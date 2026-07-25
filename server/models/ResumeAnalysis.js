const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true,
  },
  extractedData: {
    skills: [String],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      gpa: String,
    }],
    experience: [{
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String,
    }],
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      startDate: String,
      endDate: String,
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String,
      expiryDate: String,
    }],
  },
  aiAnalysis: {
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    missingKeywords: [String],
    weaknesses: [String],
    improvementSuggestions: [String],
    summary: String,
    recommendedTechnologies: [String],
    recommendedCertifications: [String],
    sectionScores: {
      skills: Number,
      experience: Number,
      education: Number,
      projects: Number,
      certifications: Number,
    },
  },
  sectionsNeedingImprovement: [String],
  analysisDate: {
    type: Date,
    default: Date.now,
  },
  fileUrl: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
