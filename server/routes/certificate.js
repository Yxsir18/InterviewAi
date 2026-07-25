const express = require('express');
const router = express.Router();
const {
  getUserCertificates,
  getCertificate,
  downloadCertificate,
  verifyCertificate,
  createCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

// Public route for verification (no auth required)
router.get('/verify/:certificateNumber', verifyCertificate);

// Middleware to protect all other routes
router.use(protect);

// @route   GET /api/certificates
// @desc    Get all certificates for a user
// @access  Private
router.get('/', getUserCertificates);

// @route   GET /api/certificates/:id
// @desc    Get single certificate by ID
// @access  Private
router.get('/:id', getCertificate);

// @route   GET /api/certificates/:id/download
// @desc    Download certificate as PDF
// @access  Private
router.get('/:id/download', downloadCertificate);

// @route   POST /api/certificates
// @desc    Create certificate after interview completion
// @access  Private
router.post('/', createCertificate);

module.exports = router;
