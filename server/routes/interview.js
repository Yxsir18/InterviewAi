const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const validator = require('../middleware/validator');

// Start interview
router.post(
  '/start',
  protect,
  [
    body('type').isIn(['HR', 'MERN Stack', 'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'SQL', 'Python', 'Java', 'DevOps', 'System Design', 'Data Structures']).withMessage('Invalid interview type'),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Invalid difficulty'),
    body('length').isIn([5, 10, 20]).withMessage('Invalid length'),
  ],
  validator,
  interviewController.startInterview
);

// Submit answer
router.post(
  '/answer',
  protect,
  [
    body('interviewId').notEmpty().withMessage('Interview ID is required'),
    body('questionId').notEmpty().withMessage('Question ID is required'),
    body('answer').optional(),
    body('voiceAnswer').optional(),
    body('timeTaken').optional().isNumeric().withMessage('Time taken must be a number'),
  ],
  validator,
  interviewController.submitAnswer
);

// End interview
router.post(
  '/end',
  protect,
  [body('interviewId').notEmpty().withMessage('Interview ID is required')],
  validator,
  interviewController.endInterview
);

// Get interview history
router.get('/history', protect, interviewController.getInterviewHistory);

// Get interview report
router.get('/report/:id', protect, interviewController.getInterviewReport);

// Retake interview
router.post('/retake/:id', protect, interviewController.retakeInterview);

module.exports = router;
