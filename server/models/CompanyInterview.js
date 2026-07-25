const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  expectedAnswer: { type: String, required: true },
  timeLimit: { type: Number, required: true },
}, { _id: false });

const companyInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
    enum: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Apple', 'TCS', 'Infosys', 'Wipro', 'Accenture'],
  },
  round: {
    type: String,
    required: true,
    enum: ['HR', 'Technical', 'Coding', 'Managerial'],
  },
  jobRole: {
    type: String,
    default: 'Software Engineer',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  language: {
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby'],
    default: 'javascript',
  },
  questions: [questionSchema],
  conversation: [{
    role: {
      type: String,
      enum: ['interviewer', 'candidate'],
    },
    content: String,
    timestamp: Date,
    evaluation: {
      score: Number,
      feedback: String,
    },
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'paused', 'completed', 'cancelled'],
    default: 'pending',
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  roundScores: {
    hr: Number,
    technical: Number,
    coding: Number,
    managerial: Number,
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
  },
  timeSpent: {
    type: Number,
    default: 0, // in seconds
  },
  startedAt: Date,
  completedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('CompanyInterview', companyInterviewSchema);
