const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const Report = require('../models/Report');
const Certificate = require('../models/Certificate');
const groqService = require('../services/groqService');

// @desc    Start conversational interview
// @route   POST /api/interview/conversational/start
// @access  Private
exports.startConversationalInterview = async (req, res, next) => {
  try {
    const { type, difficulty, length } = req.body;
    console.log('Starting conversational interview:', { type, difficulty, length, user: req.user._id });

    // Get user's default resume for context
    const resume = await Resume.findOne({ user: req.user._id, isDefault: true });
    let resumeContext = '';
    if (resume) {
      resumeContext = `Resume Summary: ${resume.parsedText?.substring(0, 500) || ''}`;
    }

    // Create interview
    const interview = await Interview.create({
      user: req.user._id,
      type,
      difficulty,
      length,
      mode: 'conversational',
      status: 'in_progress',
      startTime: new Date(),
      currentQuestionIndex: 0,
    });

    console.log('Interview created:', interview._id);

    // Generate initial question
    const initialQuestion = await groqService.generateInitialQuestion(
      type,
      difficulty,
      resumeContext
    );

    console.log('Initial question generated:', initialQuestion.substring(0, 100));

    // Add initial question to conversation
    await interview.addMessage('interviewer', initialQuestion, 0);
    interview.currentQuestion = initialQuestion;

    await interview.save();

    console.log('Interview saved with initial question');

    res.status(200).json({
      success: true,
      data: {
        interviewId: interview._id,
        initialQuestion,
        questionIndex: 0,
        totalQuestions: length,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error('Error starting conversational interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversational interview',
      error: error.message,
    });
  }
};

// @desc    Submit answer and get follow-up question
// @route   POST /api/interview/conversational/answer
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, answer, timeTaken, skipped } = req.body;

    const interview = await Interview.findById(interviewId);
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

    if (interview.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in progress',
      });
    }

    // Add candidate's answer to conversation
    await interview.addMessage('candidate', answer, interview.currentQuestionIndex);

    // Evaluate the answer (non-blocking)
    let evaluation = null;
    if (!skipped) {
      try {
        evaluation = await groqService.evaluateAnswer(
          interview.type,
          interview.difficulty,
          interview.currentQuestion,
          answer,
          interview.getConversationHistory()
        );
      } catch (error) {
        console.error('Error evaluating answer:', error.message);
      }
    }

    // Update the last message with evaluation
    const lastMessage = interview.conversation[interview.conversation.length - 1];
    lastMessage.evaluation = evaluation;
    await interview.save();

    // Check if interview should continue
    const shouldContinue = await groqService.shouldContinueInterview(
      interview.getConversationHistory(),
      interview.length
    );

    if (!shouldContinue) {
      // End interview
      interview.status = 'completed';
      interview.endTime = new Date();
      interview.calculateTotalTime();
      await interview.save();

      // Generate final summary
      let summary = null;
      try {
        summary = await groqService.generateInterviewSummary(
          interview.getConversationHistory(),
          interview.type,
          interview.difficulty
        );
      } catch (error) {
        console.error('Error generating summary:', error.message);
      }

      // Generate report
      const report = await generateConversationalReport(interview, summary);

      res.status(200).json({
        success: true,
        data: {
          interviewId: interview._id,
          status: 'completed',
          reportId: report._id,
          summary,
        },
      });
    } else {
      // Generate follow-up question
      const followUpQuestion = await groqService.generateFollowUpQuestion(
        interview.type,
        interview.difficulty,
        interview.getConversationHistory(),
        answer
      );

      interview.currentQuestionIndex += 1;
      interview.currentQuestion = followUpQuestion;
      await interview.addMessage('interviewer', followUpQuestion, interview.currentQuestionIndex);

      await interview.save();

      res.status(200).json({
        success: true,
        data: {
          interviewId: interview._id,
          followUpQuestion,
          questionIndex: interview.currentQuestionIndex,
          totalQuestions: interview.length,
          evaluation,
          status: interview.status,
        },
      });
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message,
    });
  }
};

// @desc    Pause interview
// @route   POST /api/interview/conversational/pause
// @access  Private
exports.pauseInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
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

    interview.status = 'paused';
    interview.pausedAt = new Date();
    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        interviewId: interview._id,
        status: interview.status,
        pausedAt: interview.pausedAt,
      },
    });
  } catch (error) {
    console.error('Error pausing interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause interview',
      error: error.message,
    });
  }
};

// @desc    Resume interview
// @route   POST /api/interview/conversational/resume
// @access  Private
exports.resumeInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
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

    interview.status = 'in_progress';
    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        interviewId: interview._id,
        status: interview.status,
        currentQuestion: interview.currentQuestion,
        questionIndex: interview.currentQuestionIndex,
        conversation: interview.conversation,
      },
    });
  } catch (error) {
    console.error('Error resuming interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume interview',
      error: error.message,
    });
  }
};

// @desc    Get conversation history
// @route   GET /api/interview/conversational/:id/conversation
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    console.log('Getting conversation for interview:', req.params.id);
    const interview = await Interview.findById(req.params.id);
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

    console.log('Interview found:', {
      id: interview._id,
      status: interview.status,
      conversationLength: interview.conversation?.length || 0,
      conversation: interview.conversation,
    });

    res.status(200).json({
      success: true,
      data: {
        interviewId: interview._id,
        conversation: interview.conversation,
        currentQuestionIndex: interview.currentQuestionIndex,
        totalQuestions: interview.length,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation',
      error: error.message,
    });
  }
};

// @desc    Skip current question
// @route   POST /api/interview/conversational/skip
// @access  Private
exports.skipQuestion = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
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

    // Add skip message
    await interview.addMessage('candidate', '[Skipped]', interview.currentQuestionIndex);

    // Generate follow-up question
    const followUpQuestion = await groqService.generateFollowUpQuestion(
      interview.type,
      interview.difficulty,
      interview.getConversationHistory(),
      '[Skipped]'
    );

    interview.currentQuestionIndex += 1;
    interview.currentQuestion = followUpQuestion;
    await interview.addMessage('interviewer', followUpQuestion, interview.currentQuestionIndex);

    await interview.save();

    res.status(200).json({
      success: true,
      data: {
        interviewId: interview._id,
        followUpQuestion,
        questionIndex: interview.currentQuestionIndex,
        totalQuestions: interview.length,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error('Error skipping question:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to skip question',
      error: error.message,
    });
  }
};

// Helper function to generate report for conversational interview
async function generateConversationalReport(interview, summary) {
  const conversation = interview.conversation;
  
  // Calculate scores from evaluations
  const evaluations = conversation
    .filter(msg => msg.evaluation && msg.evaluation.score)
    .map(msg => msg.evaluation);

  const averageScore = evaluations.length > 0
    ? evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length
    : 50;

  const technicalScore = evaluations.length > 0
    ? evaluations.reduce((sum, evaluation) => sum + (evaluation.technicalAccuracy || 0), 0) / evaluations.length
    : 5;

  const communicationScore = evaluations.length > 0
    ? evaluations.reduce((sum, evaluation) => sum + (evaluation.communication || 0), 0) / evaluations.length
    : 5;

  // Extract strengths and weaknesses
  const allStrengths = evaluations.flatMap(evaluation => evaluation.strengths || []);
  const allWeaknesses = evaluations.flatMap(evaluation => evaluation.weaknesses || []);

  const report = await Report.create({
    interview: interview._id,
    user: interview.user,
    overallScore: averageScore,
    performanceSummary: summary?.overallPerformance || 'Conversational interview completed',
    strengths: summary?.strengths || allStrengths,
    weaknesses: summary?.areasForImprovement || allWeaknesses,
    topicWiseScores: [],
    questionWiseAnalysis: conversation
      .filter(msg => msg.role === 'candidate' && msg.evaluation)
      .map((msg, index) => ({
        question: msg._id,
        questionNumber: index + 1,
        questionText: conversation[index * 2]?.content || 'Question',
        userAnswer: msg.content,
        score: msg.evaluation?.score || 50,
        technicalAccuracy: msg.evaluation?.technicalAccuracy || 5,
        communication: msg.evaluation?.communication || 5,
        confidence: msg.evaluation?.depth || 5,
        completeness: msg.evaluation?.clarity || 5,
        grammar: 5,
        bestPractices: 5,
        explanation: msg.evaluation?.feedback || '',
        correctAnswer: '',
        improvementSuggestions: msg.evaluation?.improvementSuggestions || [],
      })),
    improvementRoadmap: summary?.recommendations || [],
    aiSuggestions: summary?.nextSteps || [],
  });

  // Update interview with report
  interview.report = report._id;
  await interview.save();

  // Generate certificate if score >= 70
  if (averageScore >= 70) {
    await Certificate.create({
      user: interview.user,
      report: report._id,
      interview: interview._id,
      score: averageScore,
      interviewType: interview.type,
      difficulty: interview.difficulty,
    });
  }

  return report;
}
