const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updatePassword,
  deleteAccount,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getSettings).put(protect, updateSettings);
router.route('/password').put(protect, updatePassword);
router.route('/account').delete(protect, deleteAccount);

module.exports = router;
