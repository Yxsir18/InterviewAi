const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route
router.post('/', submitContact);

// Admin routes
router.route('/')
  .get(protect, authorize('admin'), getContacts);

router.route('/:id')
  .get(protect, authorize('admin'), getContact)
  .put(protect, authorize('admin'), updateContact)
  .delete(protect, authorize('admin'), deleteContact);

module.exports = router;
