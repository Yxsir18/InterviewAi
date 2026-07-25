const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookmarkController = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');
const validator = require('../middleware/validator');

// Get all bookmarks
router.get('/', protect, bookmarkController.getBookmarks);

// Create bookmark
router.post(
  '/',
  protect,
  [body('questionId').notEmpty().withMessage('Question ID is required')],
  validator,
  bookmarkController.createBookmark
);

// Update bookmark
router.put(
  '/:id',
  protect,
  bookmarkController.updateBookmark
);

// Delete bookmark
router.delete('/:id', protect, bookmarkController.deleteBookmark);

module.exports = router;
