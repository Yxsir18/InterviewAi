const express = require('express');
const router = express.Router();
const {
  analyzeResume,
  getResumeHistory,
  getResumeAnalysis,
  getResumeAnalytics,
  upload,
} = require('../controllers/resumeAnalysisController');
const { protect } = require('../middleware/auth');

// Middleware to protect all routes
router.use(protect);

// @route   POST /api/resume/analyze
// @desc    Upload and analyze resume
// @access  Private
router.post('/analyze', upload.single('file'), analyzeResume);

// @route   GET /api/resume/history
// @desc    Get user's resume analysis history
// @access  Private
router.get('/history', getResumeHistory);

// @route   GET /api/resume/analytics
// @desc    Get resume analytics
// @access  Private
router.get('/analytics', getResumeAnalytics);

// @route   GET /api/resume/:id
// @desc    Get single resume analysis
// @access  Private
router.get('/:id', getResumeAnalysis);

module.exports = router;
