const CodingInterview = require('../models/CodingInterview');
const codeExecutionService = require('../services/codeExecutionService');
const codeReviewService = require('../services/codeReviewService');

// Helper function to generate problem
async function generateProblem(topic, difficulty, language) {
  return await codeReviewService.generateProblem(topic, difficulty, language);
}

// @desc    Generate coding problem
// @route   POST /api/coding-interview/generate-problem
// @access  Private
exports.generateProblem = async (req, res, next) => {
  try {
    const { topic, difficulty, language } = req.body;

    console.log('Generating problem:', { topic, difficulty, language });
    console.log('Request body:', req.body);

    // Validate required fields
    if (!topic || !difficulty || !language) {
      console.log('Validation failed:', { topic, difficulty, language });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: topic, difficulty, language',
        errors: [
          !topic ? 'topic is required' : null,
          !difficulty ? 'difficulty is required' : null,
          !language ? 'language is required' : null,
        ].filter(Boolean),
      });
    }

    const problem = await codeReviewService.generateProblem(topic, difficulty, language);

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('Error generating problem:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to generate problem',
      error: error.message,
    });
  }
};

// @desc    Start coding interview
// @route   POST /api/coding-interview/start
// @access  Private
exports.startCodingInterview = async (req, res, next) => {
  try {
    const { title, description, difficulty, language, timeLimit, problem } = req.body;

    console.log('Starting coding interview with data:', { title, description, difficulty, language, timeLimit, problem });

    let safeProblem;

    // If no problem provided, generate one using AI
    if (!problem) {
      try {
        const topic = title.split(' - ')[0]; // Extract topic from title
        const generatedProblem = await generateProblem(topic, difficulty, language);
        safeProblem = {
          title: generatedProblem.title,
          description: generatedProblem.description,
          examples: generatedProblem.examples || [],
          constraints: generatedProblem.constraints || [],
          starterCode: typeof generatedProblem.starterCode === 'string' 
            ? {
                javascript: language === 'javascript' ? generatedProblem.starterCode : '',
                python: language === 'python' ? generatedProblem.starterCode : '',
                java: language === 'java' ? generatedProblem.starterCode : '',
                cpp: language === 'cpp' ? generatedProblem.starterCode : '',
                typescript: language === 'typescript' ? generatedProblem.starterCode : '',
                go: language === 'go' ? generatedProblem.starterCode : '',
                rust: language === 'rust' ? generatedProblem.starterCode : '',
                csharp: language === 'csharp' ? generatedProblem.starterCode : '',
                php: language === 'php' ? generatedProblem.starterCode : '',
                ruby: language === 'ruby' ? generatedProblem.starterCode : '',
              }
            : generatedProblem.starterCode || {
                javascript: '',
                python: '',
                java: '',
                cpp: '',
                typescript: '',
                go: '',
                rust: '',
                csharp: '',
                php: '',
                ruby: '',
              },
        };
      } catch (error) {
        console.error('Error generating problem:', error);
        // Fallback to default problem if AI fails
        safeProblem = {
          title: title,
          description: description,
          examples: [],
          constraints: [],
          starterCode: {
            javascript: '// Write your solution here\n',
            python: '# Write your solution here\n',
            java: '// Write your solution here\n',
            cpp: '// Write your solution here\n',
            typescript: '// Write your solution here\n',
            go: '// Write your solution here\n',
            rust: '// Write your solution here\n',
            csharp: '// Write your solution here\n',
            php: '// Write your solution here\n',
            ruby: '# Write your solution here\n',
          },
        };
      }
    } else {
      // Use provided problem
      safeProblem = {
        title: problem?.title || title,
        description: problem?.description || description,
        examples: problem?.examples || [],
        constraints: problem?.constraints || [],
        starterCode: typeof problem?.starterCode === 'string' 
          ? {
              javascript: language === 'javascript' ? problem.starterCode : '',
              python: language === 'python' ? problem.starterCode : '',
              java: language === 'java' ? problem.starterCode : '',
              cpp: language === 'cpp' ? problem.starterCode : '',
              typescript: language === 'typescript' ? problem.starterCode : '',
              go: language === 'go' ? problem.starterCode : '',
              rust: language === 'rust' ? problem.starterCode : '',
              csharp: language === 'csharp' ? problem.starterCode : '',
              php: language === 'php' ? problem.starterCode : '',
              ruby: language === 'ruby' ? problem.starterCode : '',
            }
          : problem?.starterCode || {
              javascript: '',
              python: '',
              java: '',
              cpp: '',
              typescript: '',
              go: '',
              rust: '',
              csharp: '',
              php: '',
              ruby: '',
            },
      };
    }

    const codingInterview = await CodingInterview.create({
      user: req.user._id,
      title,
      description,
      difficulty,
      language,
      timeLimit,
      status: 'in_progress',
      problem: safeProblem,
      startTime: new Date(),
    });

    res.status(200).json({
      success: true,
      data: {
        interviewId: codingInterview._id,
        problem: codingInterview.problem,
        starterCode: codingInterview.problem?.starterCode?.[language] || '',
        timeLimit: codingInterview.timeLimit,
        status: codingInterview.status,
      },
    });
  } catch (error) {
    console.error('Error starting coding interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start coding interview',
      error: error.message,
    });
  }
};

// @desc    Run code
// @route   POST /api/coding-interview/run
// @access  Private
exports.runCode = async (req, res, next) => {
  try {
    const { interviewId, code, language, input } = req.body;

    console.log('Running code:', { interviewId, language, codeLength: code?.length });

    const interview = await CodingInterview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const result = await codeExecutionService.executeCode(code, language, input);

    res.status(200).json({
      success: true,
      data: {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
      },
    });
  } catch (error) {
    console.error('Error running code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run code',
      error: error.message,
    });
  }
};

// @desc    Submit solution
// @route   POST /api/coding-interview/submit
// @access  Private
exports.submitSolution = async (req, res, next) => {
  try {
    const { interviewId, code, language } = req.body;

    console.log('=== SUBMIT SOLUTION START ===');
    console.log('Submitting solution:', { interviewId, language, codeLength: code?.length });

    const interview = await CodingInterview.findById(interviewId);
    if (!interview) {
      console.log('Interview not found');
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      console.log('Not authorized');
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    console.log('Interview found, proceeding with submission');

    // Run test cases if available
    let testResults = [];
    try {
      if (interview.problem.examples && interview.problem.examples.length > 0) {
        const testCases = interview.problem.examples.map(example => ({
          input: example.input,
          output: example.output,
        }));
        console.log('Running test cases:', testCases.length);
        testResults = await codeExecutionService.runTestCases(code, language, testCases);
        console.log('Test results:', testResults);
      }
    } catch (error) {
      console.error('Error running test cases:', error);
      // Continue with empty test results if test execution fails
      testResults = [];
    }

    // Calculate test cases passed
    const testCasesPassed = testResults.filter(r => r.passed).length;
    const totalTestCases = testResults.length;

    console.log('Test cases passed:', testCasesPassed, 'of', totalTestCases);
    console.log('Attempting to save submission');

    // Save submission with actual test results
    try {
      interview.submissions.push({
        code,
        language,
        executionTime: testResults.reduce((sum, r) => sum + (r.executionTime || 0), 0),
        status: testCasesPassed === totalTestCases ? 'success' : 'error',
        output: testResults.map(r => r.actualOutput).join('\n'),
        testCasesPassed,
        totalTestCases,
        timestamp: new Date(),
      });
      interview.currentSubmission = {
        code,
        language,
      };
      interview.status = 'completed';
      interview.endTime = new Date();
      
      await interview.save();
      console.log('Submission saved successfully');
    } catch (error) {
      console.error('ERROR SAVING SUBMISSION:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to save submission',
        error: error.message,
        errorName: error.name,
      });
    }

    console.log('=== SUBMIT SOLUTION SUCCESS ===');

    res.status(200).json({
      success: true,
      data: {
        submissionId: interview.submissions[interview.submissions.length - 1]._id,
        testResults,
        testCasesPassed,
        totalTestCases,
        review: null,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error('=== SUBMIT SOLUTION CATCH ===');
    console.error('Error submitting solution:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to submit solution',
      error: error.message,
      errorName: error.name,
    });
  }
};

// @desc    Get coding interview details
// @route   GET /api/coding-interview/:id
// @access  Private
exports.getCodingInterview = async (req, res, next) => {
  try {
    const interview = await CodingInterview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Error getting coding interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coding interview',
      error: error.message,
    });
  }
};

// @desc    Get user's coding interview history
// @route   GET /api/coding-interview/history
// @access  Private
exports.getCodingInterviewHistory = async (req, res, next) => {
  try {
    const interviews = await CodingInterview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error('Error getting coding interview history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coding interview history',
      error: error.message,
    });
  }
};

// @desc    Get coding statistics
// @route   GET /api/coding-interview/stats
// @access  Private
exports.getCodingStats = async (req, res, next) => {
  try {
    const stats = await CodingInterview.aggregate([
      { $match: { user: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: '$language',
          totalInterviews: { $sum: 1 },
          averageScore: { $avg: '$review.overallScore' },
          averageTime: { $avg: '$timeTaken' },
        },
      },
    ]);

    const totalInterviews = await CodingInterview.countDocuments({
      user: req.user._id,
      status: 'completed',
    });

    const overallAverageScore = await CodingInterview.aggregate([
      { $match: { user: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$review.overallScore' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalInterviews,
        languageStats: stats,
        overallAverageScore: overallAverageScore[0]?.averageScore || 0,
      },
    });
  } catch (error) {
    console.error('Error getting coding stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get coding stats',
      error: error.message,
    });
  }
};

// @desc    Save current code (auto-save)
// @route   POST /api/coding-interview/save
// @access  Private
exports.saveCurrentCode = async (req, res, next) => {
  try {
    const { interviewId, code, language } = req.body;

    const interview = await CodingInterview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    interview.currentSubmission = { code, language };
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Code saved successfully',
    });
  } catch (error) {
    console.error('Error saving code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save code',
      error: error.message,
    });
  }
};
