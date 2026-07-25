const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['HR', 'MERN Stack', 'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'SQL', 'Python', 'Java', 'DevOps', 'System Design', 'Data Structures'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  length: {
    type: Number,
    enum: [5, 10, 20],
    required: true,
  },
  mode: {
    type: String,
    enum: ['standard', 'conversational'],
    default: 'standard',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'paused', 'completed', 'abandoned'],
    default: 'pending',
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    answer: {
      type: String,
    },
    voiceAnswer: {
      type: String,
    },
    timeTaken: {
      type: Number, // in seconds
    },
    skipped: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
    },
  }],
  // Conversational mode specific fields
  conversation: [{
    role: {
      type: String,
      enum: ['interviewer', 'candidate'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    questionIndex: {
      type: Number,
    },
    evaluation: {
      score: Number,
      feedback: String,
      strengths: [String],
      weaknesses: [String],
    },
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  currentQuestion: {
    type: String,
  },
  aiContext: {
    type: String,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  pausedAt: {
    type: Date,
  },
  totalTime: {
    type: Number, // in seconds
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp
interviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total time
interviewSchema.methods.calculateTotalTime = function () {
  if (this.startTime && this.endTime) {
    this.totalTime = Math.floor((this.endTime - this.startTime) / 1000);
  }
};

// Add message to conversation
interviewSchema.methods.addMessage = function(role, content, questionIndex, evaluation) {
  this.conversation.push({
    role,
    content,
    questionIndex,
    evaluation,
    timestamp: new Date(),
  });
  return this.save();
};

// Get conversation history for AI context
interviewSchema.methods.getConversationHistory = function() {
  return this.conversation.map(msg => ({
    role: msg.role === 'interviewer' ? 'assistant' : 'user',
    content: msg.content,
  }));
};

module.exports = mongoose.model('Interview', interviewSchema);
