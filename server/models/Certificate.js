const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true,
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  score: {
    type: Number,
    required: true,
  },
  interviewType: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  certificateUrl: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate certificate number
certificateSchema.pre('save', function (next) {
  if (!this.certificateNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.certificateNumber = `CERT-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
