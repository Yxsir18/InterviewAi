const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },
  expectedAnswer: { type: String, required: true },
}, { _id: false });

const voiceInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  questions: [questionSchema],
  conversation: [{
    role: {
      type: String,
      enum: ['interviewer', 'candidate'],
    },
    content: String,
    audioDuration: Number, // in seconds
    transcription: String,
    editedTranscription: String,
    timestamp: Date,
    communicationMetrics: {
      confidence: Number, // 0-100
      fluency: Number, // 0-100
      grammar: Number, // 0-100
      fillers: Number, // count of filler words
      speakingSpeed: Number, // words per minute
      wordCount: Number,
    },
    evaluation: {
      score: Number,
      feedback: String,
      communicationScore: Number,
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
  communicationScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  averageMetrics: {
    confidence: Number,
    fluency: Number,
    grammar: Number,
    fillers: Number,
    speakingSpeed: Number,
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    communicationFeedback: [String],
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

module.exports = mongoose.model('VoiceInterview', voiceInterviewSchema);
