const express = require('express');
const router = express.Router();
const {
  body,
  validationResult,
} = require('express-validator');
const {
  startConversationalInterview,
  submitAnswer,
  pauseInterview,
  resumeInterview,
  getConversation,
  skipQuestion,
} = require('../controllers/conversationalInterviewController');
const { protect } = require('../middleware/auth');

// Middleware to protect all routes
router.use(protect);

// @route   POST /api/interview/conversational/start
// @desc    Start conversational interview
// @access  Private
router.post(
  '/start',
  [
    body('type').isIn(['HR', 'MERN Stack', 'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'SQL', 'Python', 'Java', 'DevOps', 'System Design', 'Data Structures']),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
    body('length').isIn([5, 10, 20]),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  startConversationalInterview
);

// @route   POST /api/interview/conversational/answer
// @desc    Submit answer and get follow-up question
// @access  Private
router.post(
  '/answer',
  [
    body('interviewId').notEmpty().withMessage('interviewId is required'),
    body('answer').notEmpty().withMessage('answer is required'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request body:', req.body);
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  submitAnswer
);

// @route   POST /api/interview/conversational/pause
// @desc    Pause interview
// @access  Private
router.post(
  '/pause',
  [body('interviewId').notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  pauseInterview
);

// @route   POST /api/interview/conversational/resume
// @desc    Resume interview
// @access  Private
router.post(
  '/resume',
  [body('interviewId').notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  resumeInterview
);

// @route   GET /api/interview/conversational/:id/conversation
// @desc    Get conversation history
// @access  Private
router.get('/:id/conversation', getConversation);

// @route   POST /api/interview/conversational/skip
// @desc    Skip current question
// @access  Private
router.post(
  '/skip',
  [body('interviewId').notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  skipQuestion
);

module.exports = router;
