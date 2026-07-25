const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  performanceSummary: {
    type: String,
    required: true,
  },
  strengths: [{
    type: String,
  }],
  weaknesses: [{
    type: String,
  }],
  topicWiseScores: [{
    topic: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    questionsCount: {
      type: Number,
      required: true,
    },
  }],
  questionWiseAnalysis: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    questionNumber: {
      type: Number,
    },
    questionText: {
      type: String,
    },
    userAnswer: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalAccuracy: {
      type: Number,
      min: 0,
      max: 10,
    },
    communication: {
      type: Number,
      min: 0,
      max: 10,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 10,
    },
    completeness: {
      type: Number,
      min: 0,
      max: 10,
    },
    grammar: {
      type: Number,
      min: 0,
      max: 10,
    },
    bestPractices: {
      type: Number,
      min: 0,
      max: 10,
    },
    explanation: {
      type: String,
    },
    correctAnswer: {
      type: String,
    },
    improvementSuggestions: [{
      type: String,
    }],
  }],
  improvementRoadmap: [{
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
    },
    topic: {
      type: String,
    },
    action: {
      type: String,
    },
    resources: [{
      type: String,
    }],
  }],
  aiSuggestions: {
    type: String,
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
