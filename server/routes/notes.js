const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const notesController = require('../controllers/notesController');
const { protect } = require('../middleware/auth');
const validator = require('../middleware/validator');

// Get all notes
router.get('/', protect, notesController.getNotes);

// Get single note
router.get('/:id', protect, notesController.getNote);

// Create note
router.post(
  '/',
  protect,
  [
    body('interviewId').notEmpty().withMessage('Interview ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  validator,
  notesController.createNote
);

// Update note
router.put(
  '/:id',
  protect,
  notesController.updateNote
);

// Delete note
router.delete('/:id', protect, notesController.deleteNote);

module.exports = router;
