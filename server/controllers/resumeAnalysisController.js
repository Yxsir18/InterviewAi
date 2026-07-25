const ResumeAnalysis = require('../models/ResumeAnalysis');
const resumeParserService = require('../services/resumeParserService');
const atsAnalysisService = require('../services/atsAnalysisService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// @desc    Upload and analyze resume
// @route   POST /api/resume/analyze
// @access  Private
exports.analyzeResume = async (req, res, next) => {
  try {
    const { file } = req;
    const { jobDescription } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log('Analyzing resume:', file.originalname, file.mimetype);

    // Parse the resume based on file type
    let resumeText;
    if (file.mimetype === 'application/pdf') {
      resumeText = await resumeParserService.parsePDF(file.buffer);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await resumeParserService.parseDOCX(file.buffer);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file type',
      });
    }

    console.log('Resume text extracted, length:', resumeText.length);

    // Extract structured data from resume
    const extractedData = resumeParserService.extractResumeData(resumeText);
    console.log('Extracted data:', extractedData);

    // Perform AI analysis
    const aiAnalysis = await atsAnalysisService.analyzeResume(extractedData, jobDescription);
    console.log('AI analysis completed');

    // Determine sections needing improvement
    const sectionsNeedingImprovement = [];
    if (aiAnalysis.sectionScores.skills < 70) sectionsNeedingImprovement.push('Skills');
    if (aiAnalysis.sectionScores.experience < 70) sectionsNeedingImprovement.push('Experience');
    if (aiAnalysis.sectionScores.education < 70) sectionsNeedingImprovement.push('Education');
    if (aiAnalysis.sectionScores.projects < 70) sectionsNeedingImprovement.push('Projects');
    if (aiAnalysis.sectionScores.certifications < 70) sectionsNeedingImprovement.push('Certifications');

    // Save analysis to database
    const resumeAnalysis = await ResumeAnalysis.create({
      user: req.user._id,
      fileName: file.originalname,
      fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'docx',
      extractedData,
      aiAnalysis: {
        ...aiAnalysis,
        sectionsNeedingImprovement,
      },
      sectionsNeedingImprovement,
    });

    res.status(200).json({
      success: true,
      data: resumeAnalysis,
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message,
    });
  }
};

// @desc    Get user's resume analysis history
// @route   GET /api/resume/history
// @access  Private
exports.getResumeHistory = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user._id })
      .sort({ analysisDate: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    console.error('Error fetching resume history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume history',
      error: error.message,
    });
  }
};

// @desc    Get single resume analysis
// @route   GET /api/resume/:id
// @access  Private
exports.getResumeAnalysis = async (req, res, next) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Resume analysis not found',
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error fetching resume analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume analysis',
      error: error.message,
    });
  }
};

// @desc    Get resume analytics
// @route   GET /api/resume/analytics
// @access  Private
exports.getResumeAnalytics = async (req, res, next) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user._id });

    if (analyses.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalAnalyses: 0,
          averageATSScore: 0,
          improvementTrend: [],
          topWeaknesses: [],
          sectionAverages: {
            skills: 0,
            experience: 0,
            education: 0,
            projects: 0,
            certifications: 0,
          },
        },
      });
    }

    const averageATSScore = analyses.reduce((sum, a) => sum + a.aiAnalysis.atsScore, 0) / analyses.length;

    const sectionAverages = {
      skills: analyses.reduce((sum, a) => sum + a.aiAnalysis.sectionScores.skills, 0) / analyses.length,
      experience: analyses.reduce((sum, a) => sum + a.aiAnalysis.sectionScores.experience, 0) / analyses.length,
      education: analyses.reduce((sum, a) => sum + a.aiAnalysis.sectionScores.education, 0) / analyses.length,
      projects: analyses.reduce((sum, a) => sum + a.aiAnalysis.sectionScores.projects, 0) / analyses.length,
      certifications: analyses.reduce((sum, a) => sum + a.aiAnalysis.sectionScores.certifications, 0) / analyses.length,
    };

    // Get top weaknesses
    const weaknessCounts = {};
    analyses.forEach(analysis => {
      analysis.aiAnalysis.weaknesses.forEach(weakness => {
        weaknessCounts[weakness] = (weaknessCounts[weakness] || 0) + 1;
      });
    });

    const topWeaknesses = Object.entries(weaknessCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([weakness]) => weakness);

    // Improvement trend
    const improvementTrend = analyses
      .sort((a, b) => a.analysisDate - b.analysisDate)
      .slice(-10)
      .map(a => ({
        date: a.analysisDate,
        score: a.aiAnalysis.atsScore,
      }));

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses: analyses.length,
        averageATSScore: Math.round(averageATSScore),
        improvementTrend,
        topWeaknesses,
        sectionAverages: {
          skills: Math.round(sectionAverages.skills),
          experience: Math.round(sectionAverages.experience),
          education: Math.round(sectionAverages.education),
          projects: Math.round(sectionAverages.projects),
          certifications: Math.round(sectionAverages.certifications),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching resume analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume analytics',
      error: error.message,
    });
  }
};

// Export upload middleware
exports.upload = upload;
