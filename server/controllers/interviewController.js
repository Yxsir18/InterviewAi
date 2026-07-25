const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Report = require('../models/Report');
const Certificate = require('../models/Certificate');
const Resume = require('../models/Resume');
const User = require('../models/User');

// Initialize Groq AI if API key is available
let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
  const Groq = require('groq-sdk');
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log('✅ Groq AI initialized successfully');
} else {
  console.warn('⚠️  Groq API key not configured. AI features will use fallback questions.');
  console.warn('   Get a free API key from: https://console.groq.com/keys');
}

// @desc    Start new interview
// @route   POST /api/interview/start
// @access  Private
exports.startInterview = async (req, res, next) => {
  try {
    const { type, difficulty, length } = req.body;

    // Get user's default resume for context
    const resume = await Resume.findOne({ user: req.user._id, isDefault: true });
    let resumeContext = '';
    if (resume && resume.parsedData) {
      resumeContext = `
        User Skills: ${resume.parsedData.skills.join(', ')}
        User Technologies: ${resume.parsedData.technologies.join(', ')}
        User Experience: ${resume.parsedData.experience.length} positions
        User Education: ${resume.parsedData.education.length} degrees
      `;
    }

    // Create interview first to get the ID
    const interview = await Interview.create({
      user: req.user._id,
      type,
      difficulty,
      length,
      status: 'in_progress',
      startTime: Date.now(),
    });

    // Generate AI questions
    const questions = await generateAIQuestions(type, difficulty, length, resumeContext, interview._id);

    // Update interview with questions
    interview.questions = questions.map(q => q._id);
    await interview.save();

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        interview: {
          id: interview._id,
          type: interview.type,
          difficulty: interview.difficulty,
          length: interview.length,
          status: interview.status,
          startTime: interview.startTime,
        },
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer
// @route   POST /api/interview/answer
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionId, answer, voiceAnswer, timeTaken, skipped } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if interview belongs to user
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview',
      });
    }

    // Check if interview is in progress
    if (interview.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in progress',
      });
    }

    // Add answer to interview
    const answerData = {
      question: questionId,
      answer: answer || voiceAnswer,
      voiceAnswer,
      timeTaken,
      skipped: skipped || false,
      submittedAt: Date.now(),
    };

    interview.answers.push(answerData);
    interview.currentQuestionIndex += 1;
    await interview.save();

    // Check if interview is complete
    if (interview.currentQuestionIndex >= interview.length) {
      interview.status = 'completed';
      interview.endTime = Date.now();
      interview.calculateTotalTime();
      await interview.save();

      // Generate report
      const report = await generateReport(interview);
      interview.report = report._id;
      await interview.save();

      // Check if certificate should be issued
      if (report.overallScore >= 70) {
        const certificate = await generateCertificate(interview, report);
        report.certificate = certificate._id;
        await report.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        currentQuestionIndex: interview.currentQuestionIndex,
        isComplete: interview.status === 'completed',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End interview
// @route   POST /api/interview/end
// @access  Private
exports.endInterview = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if interview belongs to user
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview',
      });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview is already completed',
      });
    }

    interview.status = 'abandoned';
    interview.endTime = Date.now();
    interview.calculateTotalTime();
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview ended',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview history
// @route   GET /api/interview/history
// @access  Private
exports.getInterviewHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const interviews = await Interview.find({ user: req.user._id })
      .populate('report')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interview.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: interviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview report
// @route   GET /api/interview/report/:id
// @access  Private
exports.getInterviewReport = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('report')
      .populate('questions');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if interview belongs to user
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview',
      });
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retake interview
// @route   POST /api/interview/retake/:id
// @access  Private
exports.retakeInterview = async (req, res, next) => {
  try {
    const originalInterview = await Interview.findById(req.params.id);

    if (!originalInterview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check if interview belongs to user
    if (originalInterview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview',
      });
    }

    // Get user's default resume for context
    const resume = await Resume.findOne({ user: req.user._id, isDefault: true });
    let resumeContext = '';
    if (resume && resume.parsedData) {
      resumeContext = `
        User Skills: ${resume.parsedData.skills.join(', ')}
        User Technologies: ${resume.parsedData.technologies.join(', ')}
      `;
    }

    // Create new interview first to get the ID
    const interview = await Interview.create({
      user: req.user._id,
      type: originalInterview.type,
      difficulty: originalInterview.difficulty,
      length: originalInterview.length,
      status: 'in_progress',
      startTime: Date.now(),
    });

    // Generate new questions
    const questions = await generateAIQuestions(
      originalInterview.type,
      originalInterview.difficulty,
      originalInterview.length,
      resumeContext,
      interview._id
    );

    // Update interview with questions
    interview.questions = questions.map(q => q._id);
    await interview.save();

    res.status(201).json({
      success: true,
      message: 'Interview started successfully',
      data: {
        interview: {
          id: interview._id,
          type: interview.type,
          difficulty: interview.difficulty,
          length: interview.length,
          status: interview.status,
          startTime: interview.startTime,
        },
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate AI questions
async function generateAIQuestions(type, difficulty, length, resumeContext, interviewId) {
  const prompt = `
    Generate ${length} unique interview questions for a ${type} interview at ${difficulty} difficulty level.
    
    ${resumeContext}
    
    For each question, provide:
    - The question text
    - The category/topic
    - The difficulty level
    - The type (technical, behavioral, situational, or coding)
    - Expected answer key points
    - Keywords to look for
    - Related topics
    
    Return as a JSON array with this structure:
    [
      {
        "question": "question text",
        "category": "category name",
        "difficulty": "Easy/Medium/Hard",
        "type": "technical/behavioral/situational/coding",
        "expectedAnswer": "key points for expected answer",
        "keywords": ["keyword1", "keyword2"],
        "topics": ["topic1", "topic2"]
      }
    ]
  `;

  // Check if Groq AI is initialized
  if (!groq) {
    console.log('Groq AI not available, using fallback questions');
    return await getFallbackQuestions(type, difficulty, length, interviewId);
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview question generator. Always respond with valid JSON arrays only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0].message.content;
    const questionsData = JSON.parse(text);
    
    // Handle if response is wrapped in an object
    const questionsArray = Array.isArray(questionsData) ? questionsData : (questionsData.questions || questionsData.data || []);
    
    const questions = await Promise.all(
      questionsArray.map(async (q, index) => {
        return await Question.create({
          questionNumber: index + 1,
          question: q.question,
          category: q.category,
          difficulty: q.difficulty,
          type: q.type,
          expectedAnswer: q.expectedAnswer,
          keywords: q.keywords,
          topics: q.topics,
          isAIGenerated: true,
          interview: interviewId,
        });
      })
    );

    return questions;
  } catch (error) {
    console.error('Error generating AI questions:', error.message);
    // Fallback to predefined questions if AI fails
    return await getFallbackQuestions(type, difficulty, length, interviewId);
  }
}

// Helper function to generate report
async function generateReport(interview) {
  const questions = await Question.find({ _id: { $in: interview.questions } });
  const answers = interview.answers;

  const questionWiseAnalysis = await Promise.all(
    questions.map(async (question, index) => {
      const answer = answers.find(a => a.question.toString() === question._id.toString());
      
      if (!answer || answer.skipped) {
        return {
          question: question._id,
          questionNumber: question.questionNumber,
          questionText: question.question,
          userAnswer: answer?.answer || 'Skipped',
          score: 0,
          technicalAccuracy: 0,
          communication: 0,
          confidence: 0,
          completeness: 0,
          grammar: 0,
          bestPractices: 0,
          explanation: 'Question was skipped',
          correctAnswer: question.expectedAnswer,
          improvementSuggestions: ['Try to answer all questions for better assessment'],
        };
      }

      // Evaluate answer using AI
      const evaluation = await evaluateAnswer(question, answer);

      return {
        question: question._id,
        questionNumber: question.questionNumber,
        questionText: question.question,
        userAnswer: answer.answer,
        score: evaluation.score,
        technicalAccuracy: evaluation.technicalAccuracy,
        communication: evaluation.communication,
        confidence: evaluation.confidence,
        completeness: evaluation.completeness,
        grammar: evaluation.grammar,
        bestPractices: evaluation.bestPractices,
        explanation: evaluation.explanation,
        correctAnswer: question.expectedAnswer,
        improvementSuggestions: evaluation.improvementSuggestions,
      };
    })
  );

  // Calculate overall score
  const overallScore = questionWiseAnalysis.reduce((sum, q) => sum + q.score, 0) / questions.length;

  // Calculate topic-wise scores
  const topicScores = {};
  questionWiseAnalysis.forEach(q => {
    const topic = questions.find(qn => qn._id.toString() === q.question.toString())?.category || 'General';
    if (!topicScores[topic]) {
      topicScores[topic] = { totalScore: 0, count: 0 };
    }
    topicScores[topic].totalScore += q.score;
    topicScores[topic].count += 1;
  });

  const topicWiseScores = Object.entries(topicScores).map(([topic, data]) => ({
    topic,
    score: data.totalScore / data.count,
    questionsCount: data.count,
  }));

  // Generate performance summary
  const performanceSummary = await generatePerformanceSummary(overallScore, questionWiseAnalysis);

  // Identify strengths and weaknesses
  const strengths = topicWiseScores
    .filter(t => t.score >= 70)
    .map(t => t.topic);
  const weaknesses = topicWiseScores
    .filter(t => t.score < 50)
    .map(t => t.topic);

  // Generate improvement roadmap
  const improvementRoadmap = await generateImprovementRoadmap(weaknesses, questionWiseAnalysis);

  // Generate AI suggestions
  const aiSuggestions = await generateAISuggestions(overallScore, strengths, weaknesses);

  const report = await Report.create({
    interview: interview._id,
    user: interview.user,
    overallScore,
    performanceSummary,
    strengths,
    weaknesses,
    topicWiseScores,
    questionWiseAnalysis,
    improvementRoadmap,
    aiSuggestions,
  });

  return report;
}

// Helper function to evaluate answer
async function evaluateAnswer(question, answer) {
  const prompt = `
    Evaluate the following interview answer:
    
    Question: ${question.question}
    Expected Answer: ${question.expectedAnswer}
    Keywords to look for: ${question.keywords.join(', ')}
    
    User's Answer: ${answer.answer}
    
    Provide evaluation as JSON with:
    {
      "score": 0-100,
      "technicalAccuracy": 0-10,
      "communication": 0-10,
      "confidence": 0-10,
      "completeness": 0-10,
      "grammar": 0-10,
      "bestPractices": 0-10,
      "explanation": "detailed explanation of the evaluation",
      "improvementSuggestions": ["suggestion1", "suggestion2"]
    }
  `;

  // Check if Groq AI is initialized
  if (!groq) {
    console.log('Groq AI not available, using fallback evaluation');
    return {
      score: 50,
      technicalAccuracy: 5,
      communication: 5,
      confidence: 5,
      completeness: 5,
      grammar: 5,
      bestPractices: 5,
      explanation: 'AI evaluation not available. Manual review recommended.',
      improvementSuggestions: ['Review your answer against the expected answer'],
    };
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview evaluator. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const text = completion.choices[0].message.content;
    return JSON.parse(text);
  } catch (error) {
    console.error('Error evaluating answer:', error.message);
    // Fallback evaluation
    return {
      score: 50,
      technicalAccuracy: 5,
      communication: 5,
      confidence: 5,
      completeness: 5,
      grammar: 5,
      bestPractices: 5,
      explanation: 'Unable to evaluate due to technical issues',
      improvementSuggestions: ['Try again later'],
    };
  }
}

// Helper function to generate performance summary
async function generatePerformanceSummary(overallScore, questionWiseAnalysis) {
  if (overallScore >= 80) {
    return 'Excellent performance! You demonstrated strong knowledge and answered questions with confidence and accuracy.';
  } else if (overallScore >= 60) {
    return 'Good performance! You have a solid understanding but there are areas where you can improve.';
  } else if (overallScore >= 40) {
    return 'Fair performance. You need to focus on strengthening your fundamentals and practicing more.';
  } else {
    return 'Needs improvement. Consider revisiting the core concepts and practicing regularly.';
  }
}

// Helper function to generate improvement roadmap
async function generateImprovementRoadmap(weaknesses, questionWiseAnalysis) {
  const roadmap = weaknesses.map(topic => ({
    priority: 'high',
    topic,
    action: `Study and practice ${topic} concepts`,
    resources: [
      'Documentation',
      'Online tutorials',
      'Practice problems',
      'Mock interviews',
    ],
  }));

  return roadmap;
}

// Helper function to generate AI suggestions
async function generateAISuggestions(overallScore, strengths, weaknesses) {
  const prompt = `
    Based on the following interview performance:
    - Overall Score: ${overallScore}
    - Strengths: ${strengths.join(', ')}
    - Weaknesses: ${weaknesses.join(', ')}
    
    Provide personalized learning suggestions as a concise paragraph.
  `;

  // Check if Groq AI is initialized
  if (!groq) {
    console.log('Groq AI not available, using fallback suggestions');
    return 'Focus on your weak areas and practice regularly. Consider taking more interviews to track your progress.';
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach. Provide concise, actionable learning suggestions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 512
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI suggestions:', error.message);
    return 'Focus on your weak areas and practice regularly. Consider taking more interviews to track your progress.';
  }
}

// Helper function to generate certificate
async function generateCertificate(interview, report) {
  const certificate = await Certificate.create({
    user: interview.user,
    report: report._id,
    interview: interview._id,
    score: report.overallScore,
    interviewType: interview.type,
    difficulty: interview.difficulty,
  });

  return certificate;
}

// Helper function for fallback questions
async function getFallbackQuestions(type, difficulty, length, interviewId) {
  const fallbackQuestions = [
    {
      questionNumber: 1,
      question: `What is your experience with ${type}?`,
      category: 'Experience',
      difficulty,
      type: 'behavioral',
      expectedAnswer: 'Should discuss relevant experience and projects',
      keywords: ['experience', 'project', 'worked'],
      topics: [type],
      isAIGenerated: false,
      interview: interviewId,
    },
    {
      questionNumber: 2,
      question: `Explain a challenging problem you solved using ${type}.`,
      category: 'Problem Solving',
      difficulty,
      type: 'situational',
      expectedAnswer: 'Should describe problem, approach, and solution',
      keywords: ['problem', 'solution', 'approach'],
      topics: [type, 'Problem Solving'],
      isAIGenerated: false,
      interview: interviewId,
    },
    {
      questionNumber: 3,
      question: `What are the best practices for working with ${type}?`,
      category: 'Best Practices',
      difficulty,
      type: 'technical',
      expectedAnswer: 'Should list industry best practices',
      keywords: ['best practice', 'standard', 'convention'],
      topics: [type, 'Best Practices'],
      isAIGenerated: false,
      interview: interviewId,
    },
  ];

  // Return requested number of questions (cycling through fallback if needed)
  const questions = [];
  for (let i = 0; i < length; i++) {
    const fallbackQ = { ...fallbackQuestions[i % fallbackQuestions.length] };
    fallbackQ.questionNumber = i + 1;
    questions.push(fallbackQ);
  }

  return await Question.create(questions);
}
