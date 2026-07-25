const express = require('express');
const router = express.Router();
const {
  body,
  validationResult,
} = require('express-validator');
const {
  startVoiceInterview,
  submitAnswer,
  getVoiceInterviewHistory,
  getVoiceInterviewAnalytics,
  getVoiceInterview,
} = require('../controllers/voiceInterviewController');
const { protect } = require('../middleware/auth');

// Middleware to protect all routes
router.use(protect);

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// @route   POST /api/voice-interview/start
// @desc    Start voice interview
// @access  Private
router.post(
  '/start',
  [
    body('jobRole').optional(),
    body('difficulty').optional().isIn(DIFFICULTIES),
    body('numQuestions').optional().isInt({ min: 1, max: 10 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  startVoiceInterview
);

// @route   POST /api/voice-interview/answer
// @desc    Submit answer for voice interview
// @access  Private
router.post(
  '/answer',
  [
    body('interviewId').notEmpty(),
    body('transcription').notEmpty(),
    body('editedTranscription').optional(),
    body('audioDuration').optional().isInt(),
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

// @route   GET /api/voice-interview/history
// @desc    Get voice interview history
// @access  Private
router.get('/history', getVoiceInterviewHistory);

// @route   GET /api/voice-interview/analytics
// @desc    Get voice interview analytics
// @access  Private
router.get('/analytics', getVoiceInterviewAnalytics);

// @route   GET /api/voice-interview/:id
// @desc    Get single voice interview
// @access  Private
router.get('/:id', getVoiceInterview);

module.exports = router;
