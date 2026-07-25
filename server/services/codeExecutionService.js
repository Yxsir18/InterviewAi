const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXECUTION_TIMEOUT = 10000; // 10 seconds
const MAX_MEMORY = 256; // 256 MB

// Decode HTML entities in code
function decodeHTMLEntities(code) {
  return code
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Language configurations
const LANGUAGE_CONFIG = {
  javascript: {
    extension: 'js',
    command: 'node',
    args: [],
  },
  typescript: {
    extension: 'ts',
    command: 'ts-node',
    args: [],
  },
  python: {
    extension: 'py',
    command: 'python',
    args: [],
  },
  java: {
    extension: 'java',
    command: 'java',
    compileCommand: 'javac',
    needsCompilation: true,
  },
  cpp: {
    extension: 'cpp',
    command: './program',
    compileCommand: 'g++',
    compileArgs: ['-o', 'program'],
    needsCompilation: true,
  },
  go: {
    extension: 'go',
    command: 'go',
    args: ['run'],
  },
  rust: {
    extension: 'rs',
    command: 'rustc',
    compileCommand: 'rustc',
    compileArgs: ['-o', 'program'],
    needsCompilation: true,
    runCommand: './program',
  },
  csharp: {
    extension: 'cs',
    command: 'dotnet',
    args: ['run'],
    needsCompilation: true,
  },
  php: {
    extension: 'php',
    command: 'php',
    args: [],
  },
  ruby: {
    extension: 'rb',
    command: 'ruby',
    args: [],
  },
};

/**
 * Execute code with timeout and memory limits
 */
async function executeCode(code, language, input = '') {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const fileName = `code_${Date.now()}.${config.extension}`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Decode HTML entities in code before writing to file
    const decodedCode = decodeHTMLEntities(code);
    
    console.log('Writing code to file:', filePath);
    console.log('Code length:', decodedCode.length);
    
    // Write code to file
    fs.writeFileSync(filePath, decodedCode);

    let result;

    if (config.needsCompilation) {
      result = await compileAndRun(filePath, language, input, config);
    } else {
      result = await runDirectly(filePath, language, input, config);
    }

    return result;
  } catch (error) {
    console.error('Error executing code:', error);
    return {
      success: false,
      output: '',
      error: error.message,
      executionTime: 0,
    };
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      // Clean up compiled files
      if (language === 'java') {
        const classFile = filePath.replace('.java', '.class');
        if (fs.existsSync(classFile)) {
          fs.unlinkSync(classFile);
        }
      }
      if (language === 'cpp') {
        const executable = path.join(tempDir, 'program');
        if (fs.existsSync(executable)) {
          fs.unlinkSync(executable);
        }
      }
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }
}

/**
 * Compile and run code (for Java, C++)
 */
async function compileAndRun(filePath, language, input, config) {
  const tempDir = path.dirname(filePath);

  try {
    // Compile
    const compileResult = await executeCommand(
      config.compileCommand,
      [...(config.compileArgs || []), filePath],
      tempDir,
      EXECUTION_TIMEOUT
    );

    if (compileResult.exitCode !== 0) {
      return {
        success: false,
        output: '',
        error: compileResult.stderr || 'Compilation failed',
        executionTime: compileResult.executionTime,
      };
    }

    // Run
    const runResult = await executeCommand(
      config.command,
      [],
      tempDir,
      EXECUTION_TIMEOUT,
      input
    );

    return {
      success: runResult.exitCode === 0,
      output: runResult.stdout,
      error: runResult.stderr,
      executionTime: runResult.executionTime,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error.message,
      executionTime: 0,
    };
  }
}

/**
 * Run code directly (for JavaScript, Python)
 */
async function runDirectly(filePath, language, input, config) {
  try {
    const result = await executeCommand(
      config.command,
      [filePath, ...(config.args || [])],
      path.dirname(filePath),
      EXECUTION_TIMEOUT,
      input
    );

    return {
      success: result.exitCode === 0,
      output: result.stdout,
      error: result.stderr,
      executionTime: result.executionTime,
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error.message,
      executionTime: 0,
    };
  }
}

/**
 * Execute command with timeout
 */
function executeCommand(command, args, cwd, timeout, input = '') {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let isTimedOut = false;

    console.log(`Executing command: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    // Write input if provided
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    const timeoutId = setTimeout(() => {
      isTimedOut = true;
      child.kill('SIGKILL');
    }, timeout);

    child.on('close', (exitCode) => {
      clearTimeout(timeoutId);
      const executionTime = Date.now() - startTime;

      console.log(`Command completed with exit code: ${exitCode}, execution time: ${executionTime}ms`);

      if (isTimedOut) {
        resolve({
          exitCode: -1,
          stdout,
          stderr: stderr || 'Execution timed out',
          executionTime,
        });
      } else {
        resolve({
          exitCode,
          stdout,
          stderr,
          executionTime,
        });
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeoutId);
      console.error(`Command execution error: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Run test cases
 */
async function runTestCases(code, language, testCases) {
  const results = [];

  for (const testCase of testCases) {
    const result = await executeCode(code, language, testCase.input);
    results.push({
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: result.output,
      passed: result.success && result.output.trim() === testCase.output.trim(),
      error: result.error,
      executionTime: result.executionTime,
    });
  }

  return results;
}

module.exports = {
  executeCode,
  runTestCases,
  LANGUAGE_CONFIG,
};
