const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'custom'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  aiImproved: {
    type: Boolean,
    default: false,
  },
  aiSuggestions: {
    type: [String],
    default: [],
  },
  customSectionName: {
    type: String,
    default: '',
  },
});

const resumeVersionSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    enum: ['modern-professional', 'classic', 'minimal', 'corporate', 'executive', 'student', 'software-engineer'],
    default: 'modern-professional',
  },
  sections: [sectionSchema],
  personalInfo: {
    fullName: String,
    jobTitle: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String,
    website: String,
  },
  customization: {
    primaryColor: {
      type: String,
      default: '#2563eb',
    },
    accentColor: {
      type: String,
      default: '#0891b2',
    },
    fontFamily: {
      type: String,
      enum: ['inter', 'roboto', 'open-sans', 'lato', 'merriweather'],
      default: 'inter',
    },
    fontSize: {
      type: Number,
      default: 11,
    },
    lineSpacing: {
      type: Number,
      default: 1.5,
    },
    sectionSpacing: {
      type: Number,
      default: 16,
    },
    pageMargins: {
      top: { type: Number, default: 20 },
      bottom: { type: Number, default: 20 },
      left: { type: Number, default: 20 },
      right: { type: Number, default: 20 },
    },
    headingStyle: {
      type: String,
      enum: ['underline', 'bold', 'colored', 'bordered'],
      default: 'underline',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const resumeBuilderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  versions: [resumeVersionSchema],
  currentVersion: {
    type: Number,
    default: 1,
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

// Update timestamp before saving
resumeBuilderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ResumeBuilder', resumeBuilderSchema);
