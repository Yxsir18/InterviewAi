const VoiceInterview = require('../models/VoiceInterview');
const voiceInterviewService = require('../services/voiceInterviewService');
const gamificationService = require('../services/gamificationService');

// @desc    Start voice interview
// @route   POST /api/voice-interview/start
// @access  Private
exports.startVoiceInterview = async (req, res, next) => {
  try {
    const { jobRole, difficulty, numQuestions } = req.body;

    // Generate voice interview questions
    const questionsData = await voiceInterviewService.generateVoiceQuestions(
      jobRole || 'Software Engineer',
      difficulty || 'Medium',
      numQuestions || 5
    );

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

    // Ensure questions is an array
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    // Create interview record
    const interview = await VoiceInterview.create({
      user: req.user._id,
      jobRole: jobRole || 'Software Engineer',
      difficulty: difficulty || 'Medium',
      questions,
      status: 'in_progress',
      startedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    console.error('Error starting voice interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start voice interview',
      error: error.message,
    });
  }
};

// @desc    Submit answer for voice interview
// @route   POST /api/voice-interview/answer
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, transcription, editedTranscription, audioDuration } = req.body;

    const interview = await VoiceInterview.findOne({
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
    const finalTranscription = editedTranscription || transcription;

    // Analyze communication metrics
    const communicationMetrics = voiceInterviewService.analyzeCommunicationMetrics(
      finalTranscription,
      audioDuration || 30
    );

    // Evaluate answer with communication analysis
    const evaluation = await voiceInterviewService.evaluateAnswerWithCommunication(
      currentQuestion.question,
      finalTranscription,
      communicationMetrics
    );

    // Add to conversation
    interview.conversation.push({
      role: 'candidate',
      content: finalTranscription,
      audioDuration: audioDuration || 30,
      transcription,
      editedTranscription,
      timestamp: new Date(),
      communicationMetrics,
      evaluation,
    });

    interview.currentQuestionIndex += 1;
    interview.timeSpent += audioDuration || 30;

    // Check if interview is complete
    if (interview.currentQuestionIndex >= interview.questions.length) {
      interview.status = 'completed';
      interview.completedAt = new Date();
      
      // Calculate overall scores
      const evaluations = interview.conversation
        .filter(c => c.role === 'candidate' && c.evaluation)
        .map(c => c.evaluation);
      
      interview.overallScore = evaluations.length > 0
        ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
        : 0;

      interview.communicationScore = evaluations.length > 0
        ? Math.round(evaluations.reduce((sum, e) => sum + e.communicationScore, 0) / evaluations.length)
        : 0;

      // Calculate average metrics
      const metrics = interview.conversation
        .filter(c => c.role === 'candidate' && c.communicationMetrics)
        .map(c => c.communicationMetrics);
      
      if (metrics.length > 0) {
        interview.averageMetrics = {
          confidence: Math.round(metrics.reduce((sum, m) => sum + m.confidence, 0) / metrics.length),
          fluency: Math.round(metrics.reduce((sum, m) => sum + m.fluency, 0) / metrics.length),
          grammar: Math.round(metrics.reduce((sum, m) => sum + m.grammar, 0) / metrics.length),
          fillers: Math.round(metrics.reduce((sum, m) => sum + m.fillers, 0) / metrics.length),
          speakingSpeed: Math.round(metrics.reduce((sum, m) => sum + m.speakingSpeed, 0) / metrics.length),
        };
      }

      // Extract feedback
      const allEvaluations = interview.conversation
        .filter(c => c.role === 'candidate' && c.evaluation);
      
      interview.feedback = {
        strengths: [...new Set(allEvaluations.flatMap(e => e.evaluation?.strengths || []))],
        weaknesses: [...new Set(allEvaluations.flatMap(e => e.evaluation?.weaknesses || []))],
        recommendations: [...new Set(allEvaluations.flatMap(e => e.evaluation?.recommendations || []))],
        communicationFeedback: [...new Set(allEvaluations.flatMap(e => e.evaluation?.communicationFeedback || []))],
      };
    }

    await interview.save();

    // Award XP and update gamification
    try {
      await gamificationService.interviewComplete(req.user._id, interview.overallScore, 'voice');
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

// @desc    Get voice interview history
// @route   GET /api/voice-interview/history
// @access  Private
exports.getVoiceInterviewHistory = async (req, res, next) => {
  try {
    const interviews = await VoiceInterview.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error('Error fetching voice interview history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview history',
      error: error.message,
    });
  }
};

// @desc    Get voice interview analytics
// @route   GET /api/voice-interview/analytics
// @access  Private
exports.getVoiceInterviewAnalytics = async (req, res, next) => {
  try {
    const interviews = await VoiceInterview.find({
      user: req.user._id,
      status: 'completed',
    });

    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInterviews: 0,
          averageScore: 0,
          averageCommunicationScore: 0,
          averageMetrics: {
            confidence: 0,
            fluency: 0,
            grammar: 0,
            fillers: 0,
            speakingSpeed: 0,
          },
          improvementTrend: [],
        },
      });
    }

    const averageScore = interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length;
    const averageCommunicationScore = interviews.reduce((sum, i) => sum + i.communicationScore, 0) / interviews.length;

    // Calculate average metrics
    const averageMetrics = {
      confidence: interviews.reduce((sum, i) => sum + (i.averageMetrics?.confidence || 0), 0) / interviews.length,
      fluency: interviews.reduce((sum, i) => sum + (i.averageMetrics?.fluency || 0), 0) / interviews.length,
      grammar: interviews.reduce((sum, i) => sum + (i.averageMetrics?.grammar || 0), 0) / interviews.length,
      fillers: interviews.reduce((sum, i) => sum + (i.averageMetrics?.fillers || 0), 0) / interviews.length,
      speakingSpeed: interviews.reduce((sum, i) => sum + (i.averageMetrics?.speakingSpeed || 0), 0) / interviews.length,
    };

    // Improvement trend
    const improvementTrend = interviews
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(-10)
      .map(i => ({
        date: i.createdAt,
        score: i.overallScore,
        communicationScore: i.communicationScore,
      }));

    res.status(200).json({
      success: true,
      data: {
        totalInterviews: interviews.length,
        averageScore: Math.round(averageScore),
        averageCommunicationScore: Math.round(averageCommunicationScore),
        averageMetrics: {
          confidence: Math.round(averageMetrics.confidence),
          fluency: Math.round(averageMetrics.fluency),
          grammar: Math.round(averageMetrics.grammar),
          fillers: Math.round(averageMetrics.fillers),
          speakingSpeed: Math.round(averageMetrics.speakingSpeed),
        },
        improvementTrend,
      },
    });
  } catch (error) {
    console.error('Error fetching voice interview analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};

// @desc    Get single voice interview
// @route   GET /api/voice-interview/:id
// @access  Private
exports.getVoiceInterview = async (req, res, next) => {
  try {
    const interview = await VoiceInterview.findOne({
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
    console.error('Error fetching voice interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview',
      error: error.message,
    });
  }
};
