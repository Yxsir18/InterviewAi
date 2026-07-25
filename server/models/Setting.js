const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  pushNotifications: {
    type: Boolean,
    default: true,
  },
  interviewReminders: {
    type: Boolean,
    default: true,
  },
  weeklyReports: {
    type: Boolean,
    default: true,
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark',
  },
  language: {
    type: String,
    default: 'en',
  },
  voiceEnabled: {
    type: Boolean,
    default: true,
  },
  autoSaveAnswers: {
    type: Boolean,
    default: true,
  },
  defaultInterviewLength: {
    type: Number,
    enum: [5, 10, 20],
    default: 10,
  },
  defaultDifficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
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
settingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Setting', settingSchema);
