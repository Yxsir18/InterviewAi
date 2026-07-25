const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validator = require('../middleware/validator');

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validator,
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validator,
  authController.login
);

// Logout
router.post('/logout', protect, authController.logout);

// Refresh token
router.post('/refresh', authController.refresh);

// Get current user
router.get('/me', protect, authController.getMe);

// Verify email
router.post('/verify-email/:token', authController.verifyEmail);

// Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  validator,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validator,
  authController.resetPassword
);

// Update password
router.put(
  '/update-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validator,
  authController.updatePassword
);

module.exports = router;
