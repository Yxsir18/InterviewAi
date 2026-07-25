const express = require('express');
const router = express.Router();
const {
  body,
  validationResult,
} = require('express-validator');
const {
  startCodingInterview,
  runCode,
  submitSolution,
  getCodingInterview,
  getCodingInterviewHistory,
  getCodingStats,
  saveCurrentCode,
  generateProblem,
} = require('../controllers/codingInterviewController');
const { protect } = require('../middleware/auth');

// Middleware to protect all routes
router.use(protect);

// @route   POST /api/coding-interview/start
// @desc    Start coding interview
// @access  Private
router.post(
  '/start',
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
    body('language').isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby']),
    body('timeLimit').isInt({ min: 1, max: 120 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  startCodingInterview
);

// @route   POST /api/coding-interview/run
// @desc    Run code
// @access  Private
router.post(
  '/run',
  [
    body('interviewId').notEmpty(),
    body('code').notEmpty(),
    body('language').isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  runCode
);

// @route   POST /api/coding-interview/submit
// @desc    Submit solution
// @access  Private
router.post(
  '/submit',
  [
    body('interviewId').notEmpty(),
    body('code').notEmpty(),
    body('language').isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  submitSolution
);

// @route   GET /api/coding-interview/history
// @desc    Get user's coding interview history
// @access  Private
router.get('/history', getCodingInterviewHistory);

// @route   GET /api/coding-interview/stats
// @desc    Get coding statistics
// @access  Private
router.get('/stats', getCodingStats);

// @route   GET /api/coding-interview/:id
// @desc    Get coding interview details
// @access  Private
router.get('/:id', getCodingInterview);

// @route   POST /api/coding-interview/save
// @desc    Save current code (auto-save)
// @access  Private
router.post(
  '/save',
  [
    body('interviewId').notEmpty(),
    body('code').notEmpty(),
    body('language').isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  saveCurrentCode
);

// @route   POST /api/coding-interview/generate-problem
// @desc    Generate coding problem
// @access  Private
router.post(
  '/generate-problem',
  [
    body('topic').notEmpty(),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
    body('language').isIn(['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  generateProblem
);

module.exports = router;
