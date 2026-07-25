const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  questionNumber: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'situational', 'coding'],
    default: 'technical',
  },
  expectedAnswer: {
    type: String,
  },
  keywords: [{
    type: String,
  }],
  topics: [{
    type: String,
  }],
  isAIGenerated: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for interview and question number
questionSchema.index({ interview: 1, questionNumber: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);
