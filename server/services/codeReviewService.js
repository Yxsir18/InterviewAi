const groqService = require('./groqService');

/**
 * Review code using AI
 */
async function reviewCode(code, language, problemDescription, testResults) {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You are an expert code reviewer and technical interviewer. Analyze the provided code and provide detailed feedback on:
- Correctness (0-100)
- Readability (0-100)
- Time Complexity analysis
- Space Complexity analysis
- Best Practices adherence (0-100)
- Overall Score (0-100)

Provide specific strengths, weaknesses, and improvement suggestions. Be constructive and educational in your feedback.`;

  const testResultsSummary = testResults
    ? testResults.map((result, index) => `
Test Case ${index + 1}:
Input: ${result.input}
Expected: ${result.expectedOutput}
Actual: ${result.actualOutput}
Passed: ${result.passed ? 'Yes' : 'No'}
Error: ${result.error || 'None'}
`).join('\n')
    : 'No test results available';

  const userPrompt = `Review the following ${language} code:

Problem Description:
${problemDescription}

Code:
\`\`\`${language}
${code}
\`\`\`

Test Results:
${testResultsSummary}

Provide your review in JSON format with:
{
  "overallScore": 0-100,
  "correctness": 0-100,
  "readability": 0-100,
  "timeComplexity": "O(n) notation with explanation",
  "spaceComplexity": "O(n) notation with explanation",
  "bestPractices": 0-100,
  "feedback": "detailed overall feedback",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"],
  "complexityAnalysis": "detailed analysis of time and space complexity"
}`;

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error reviewing code:', error);
    throw error;
  }
}

/**
 * Get quick code feedback (for real-time suggestions)
 */
async function getQuickFeedback(code, language) {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You are a helpful coding assistant. Provide quick, concise feedback on the code. Focus on obvious bugs, syntax errors, and immediate improvements. Keep your response under 200 words.`;

  const userPrompt = `Review this ${language} code for obvious issues:

\`\`\`${language}
${code}
\`\`\`

Provide brief feedback on:
1. Syntax errors
2. Obvious bugs
3. Quick improvements`;

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 300,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error getting quick feedback:', error);
    throw error;
  }
}

/**
 * Generate coding problem
 */
async function generateProblem(topic, difficulty, language) {
  console.log('generateProblem called with:', { topic, difficulty, language });
  
  if (!groqService.isAvailable()) {
    console.error('AI service not available');
    throw new Error('AI service not available');
  }

  // Map language names to more recognizable names for AI
  const languageMap = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript', 
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'go': 'Go',
    'rust': 'Rust',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby'
  };

  const mappedLanguage = languageMap[language] || language;

  const systemPrompt = `You are an expert technical interviewer. Generate coding problems for interviews. Provide clear problem statements, examples, and constraints. Always respond with valid JSON.`;

  const userPrompt = `Generate a ${difficulty} coding problem for ${topic} in ${mappedLanguage}.

Provide the problem in JSON format with:
{
  "title": "problem title",
  "description": "detailed problem description",
  "examples": [
    {
      "input": "example input",
      "output": "example output",
      "explanation": "explanation of the example"
    }
  ],
  "constraints": ["constraint1", "constraint2"],
  "starterCode": "starter code template in ${mappedLanguage}"
}`;

  try {
    console.log('Calling Groq API...');
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    console.log('Groq API response received');
    const response = completion.choices[0].message.content;
    console.log('Parsed response:', response.substring(0, 100) + '...');
    
    const parsedResponse = JSON.parse(response);
    console.log('Successfully parsed JSON');
    return parsedResponse;
  } catch (error) {
    console.error('Error generating problem:', error);
    console.error('Error details:', error.message);
    throw error;
  }
}

module.exports = {
  reviewCode,
  getQuickFeedback,
  generateProblem,
};
