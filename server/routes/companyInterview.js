const express = require('express');
const router = express.Router();
const {
  body,
  validationResult,
} = require('express-validator');
const {
  startCompanyInterview,
  submitAnswer,
  getCompanyInterviewHistory,
  getCompanyInterviewAnalytics,
  getCompanyInterview,
} = require('../controllers/companyInterviewController');
const { protect } = require('../middleware/auth');

// Middleware to protect all routes
router.use(protect);

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Apple', 'TCS', 'Infosys', 'Wipro', 'Accenture'];
const ROUNDS = ['HR', 'Technical', 'Coding', 'Managerial'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby'];

// @route   POST /api/company-interview/start
// @desc    Start company-specific interview
// @access  Private
router.post(
  '/start',
  [
    body('company').isIn(COMPANIES),
    body('round').isIn(ROUNDS),
    body('jobRole').optional(),
    body('difficulty').optional().isIn(DIFFICULTIES),
    body('language').optional().isIn(LANGUAGES),
    body('numQuestions').optional().isInt({ min: 1, max: 10 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  startCompanyInterview
);

// @route   POST /api/company-interview/answer
// @desc    Submit answer for company interview
// @access  Private
router.post(
  '/answer',
  [
    body('interviewId').notEmpty(),
    body('answer').notEmpty(),
    body('timeTaken').optional().isInt(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  submitAnswer
);

// @route   GET /api/company-interview/history
// @desc    Get company interview history
// @access  Private
router.get('/history', getCompanyInterviewHistory);

// @route   GET /api/company-interview/analytics
// @desc    Get company interview analytics
// @access  Private
router.get('/analytics', getCompanyInterviewAnalytics);

// @route   GET /api/company-interview/:id
// @desc    Get single company interview
// @access  Private
router.get('/:id', getCompanyInterview);

module.exports = router;
