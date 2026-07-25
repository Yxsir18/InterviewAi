const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  parsedData: {
    skills: [{
      type: String,
    }],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
    }],
    technologies: [{
      type: String,
    }],
    summary: {
      type: String,
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
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
resumeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
