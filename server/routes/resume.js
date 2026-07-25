const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// Upload resume
router.post('/upload', protect, upload.single('resume'), resumeController.uploadResume);

// Get all resumes
router.get('/', protect, resumeController.getResumes);

// Get single resume
router.get('/:id', protect, resumeController.getResume);

// Delete resume
router.delete('/:id', protect, resumeController.deleteResume);

// Set default resume
router.put('/:id/default', protect, resumeController.setDefaultResume);

module.exports = router;
