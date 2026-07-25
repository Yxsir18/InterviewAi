const CompanyInterview = require('../models/CompanyInterview');
const companyInterviewService = require('../services/companyInterviewService');
const gamificationService = require('../services/gamificationService');

// @desc    Start company-specific interview
// @route   POST /api/company-interview/start
// @access  Private
exports.startCompanyInterview = async (req, res, next) => {
  try {
    const { company, round, jobRole, difficulty, language, numQuestions } = req.body;

    // Generate company-specific questions
    const questionsData = await companyInterviewService.generateCompanyQuestions(
      company,
      round,
      jobRole || 'Software Engineer',
      difficulty || 'Medium',
      language || 'javascript',
      numQuestions || 5
    );

    console.log('QuestionsData received:', JSON.stringify(questionsData, null, 2));

    // Parse questions if they're returned as a string
    let questions = questionsData.questions;
    if (typeof questions === 'string') {
      try {
        questions = JSON.parse(questions);
      } catch (parseError) {
        console.error('Error parsing questions:', parseError);
        throw new Error('Failed to parse generated questions');
      }
    }

    console.log('Questions after parsing:', typeof questions, Array.isArray(questions));

    // Ensure questions is an array
    if (!Array.isArray(questions)) {
      console.error('Questions is not an array, it is:', typeof questions, questions);
      throw new Error('Questions must be an array');
    }

    // Create interview record
    const interview = await CompanyInterview.create({
      user: req.user._id,
      company,
      round,
      jobRole: jobRole || 'Software Engineer',
      difficulty: difficulty || 'Medium',
      language: language || 'javascript',
      questions,
      status: 'in_progress',
      startedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Error starting company interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start company interview',
      error: error.message,
    });
  }
};

// @desc    Submit answer for company interview
// @route   POST /api/company-interview/answer
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, answer, timeTaken } = req.body;

    const interview = await CompanyInterview.findOne({
      _id: interviewId,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    if (interview.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in progress',
      });
    }

    const currentQuestion = interview.questions[interview.currentQuestionIndex];

    // Evaluate answer
    const evaluation = await companyInterviewService.evaluateAnswer(
      interview.company,
      interview.round,
      currentQuestion.question,
      answer
    );

    // Add to conversation
    interview.conversation.push({
      role: 'candidate',
      content: answer,
      timestamp: new Date(),
      evaluation,
    });

    // Add AI feedback
    interview.conversation.push({
      role: 'interviewer',
      content: evaluation.feedback,
      timestamp: new Date(),
    });

    interview.currentQuestionIndex += 1;
    interview.timeSpent += timeTaken || 0;

    // Add next question if available
    if (interview.currentQuestionIndex < interview.questions.length) {
      const nextQuestion = interview.questions[interview.currentQuestionIndex];
      interview.conversation.push({
        role: 'interviewer',
        content: nextQuestion.question,
        timestamp: new Date(),
      });
    }

    // Check if interview is complete
    if (interview.currentQuestionIndex >= interview.questions.length) {
      interview.status = 'completed';
      interview.completedAt = new Date();
      
      // Calculate overall score
      const evaluations = interview.conversation
        .filter(c => c.role === 'candidate' && c.evaluation)
        .map(c => c.evaluation.score);
      
      interview.overallScore = evaluations.length > 0
        ? Math.round(evaluations.reduce((sum, score) => sum + score, 0) / evaluations.length)
        : 0;

      // Set round score
      const roundKey = interview.round.toLowerCase();
      interview.roundScores[roundKey] = interview.overallScore;

      // Extract feedback
      const allEvaluations = interview.conversation
        .filter(c => c.role === 'candidate' && c.evaluation);
      
      interview.feedback = {
        strengths: [...new Set(allEvaluations.flatMap(e => e.evaluation?.strengths || []))],
        weaknesses: [...new Set(allEvaluations.flatMap(e => e.evaluation?.weaknesses || []))],
        recommendations: [...new Set(allEvaluations.flatMap(e => e.evaluation?.recommendations || []))],
      };
    }

    await interview.save();

    // Award XP and update gamification
    try {
      await gamificationService.interviewComplete(req.user._id, interview.overallScore, 'company');
      await gamificationService.updateDailyStreak(req.user._id);
    } catch (gamificationError) {
      console.error('Error updating gamification:', gamificationError);
      // Don't fail the interview if gamification fails
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer',
      error: error.message,
    });
  }
};

// @desc    Get company interview history
// @route   GET /api/company-interview/history
// @access  Private
exports.getCompanyInterviewHistory = async (req, res, next) => {
  try {
    const { company } = req.query;

    const query = { user: req.user._id };
    if (company) {
      query.company = company;
    }

    const interviews = await CompanyInterview.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error('Error fetching company interview history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history',
      error: error.message,
    });
  }
};

// @desc    Get company interview analytics
// @route   GET /api/company-interview/analytics
// @access  Private
exports.getCompanyInterviewAnalytics = async (req, res, next) => {
  try {
    const { company } = req.query;

    const query = { user: req.user._id, status: 'completed' };
    if (company) {
      query.company = company;
    }

    const interviews = await CompanyInterview.find(query);

    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInterviews: 0,
          averageScore: 0,
          companyBreakdown: {},
          roundBreakdown: {},
          improvementTrend: [],
        },
      });
    }

    const averageScore = interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length;

    // Company breakdown
    const companyBreakdown = {};
    interviews.forEach(interview => {
      if (!companyBreakdown[interview.company]) {
        companyBreakdown[interview.company] = {
          count: 0,
          averageScore: 0,
        };
      }
      companyBreakdown[interview.company].count += 1;
      companyBreakdown[interview.company].averageScore += interview.overallScore;
    });

    Object.keys(companyBreakdown).forEach(company => {
      companyBreakdown[company].averageScore = Math.round(
        companyBreakdown[company].averageScore / companyBreakdown[company].count
      );
    });

    // Round breakdown
    const roundBreakdown = {};
    interviews.forEach(interview => {
      if (!roundBreakdown[interview.round]) {
        roundBreakdown[interview.round] = {
          count: 0,
          averageScore: 0,
        };
      }
      roundBreakdown[interview.round].count += 1;
      roundBreakdown[interview.round].averageScore += interview.overallScore;
    });

    Object.keys(roundBreakdown).forEach(round => {
      roundBreakdown[round].averageScore = Math.round(
        roundBreakdown[round].averageScore / roundBreakdown[round].count
      );
    });

    // Improvement trend
    const improvementTrend = interviews
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(-10)
      .map(i => ({
        date: i.createdAt,
        score: i.overallScore,
        company: i.company,
        round: i.round,
      }));

    res.status(200).json({
      success: true,
      data: {
        totalInterviews: interviews.length,
        averageScore: Math.round(averageScore),
        companyBreakdown,
        roundBreakdown,
        improvementTrend,
      },
    });
  } catch (error) {
    console.error('Error fetching company interview analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

// @desc    Get single company interview
// @route   GET /api/company-interview/:id
// @access  Private
exports.getCompanyInterview = async (req, res, next) => {
  try {
    const interview = await CompanyInterview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Error fetching company interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message,
    });
  }
};
