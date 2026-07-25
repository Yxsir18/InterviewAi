const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
  },
  notes: {
    type: String,
    default: '',
  },
  category: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for user and question (unique bookmark per question)
bookmarkSchema.index({ user: 1, question: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
