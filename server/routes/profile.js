const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const validator = require('../middleware/validator');

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
});

// Get profile
router.get('/', protect, profileController.getProfile);

// Update profile
router.put('/', protect, profileController.updateProfile);

// Update user info
router.put(
  '/user',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
  ],
  validator,
  profileController.updateUserInfo
);

// Upload avatar
router.post('/avatar', protect, upload.single('avatar'), profileController.uploadAvatar);

// Get avatar image
router.get('/avatar/:filename', profileController.getAvatar);

// Experience routes
router.post(
  '/experience',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('company').notEmpty().withMessage('Company is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
  ],
  validator,
  profileController.addExperience
);

router.put(
  '/experience/:id',
  protect,
  profileController.updateExperience
);

router.delete('/experience/:id', protect, profileController.deleteExperience);

// Education routes
router.post(
  '/education',
  protect,
  [
    body('school').notEmpty().withMessage('School is required'),
    body('degree').notEmpty().withMessage('Degree is required'),
    body('field').notEmpty().withMessage('Field is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
  ],
  validator,
  profileController.addEducation
);

router.put(
  '/education/:id',
  protect,
  profileController.updateEducation
);

router.delete('/education/:id', protect, profileController.deleteEducation);

// Project routes
router.post(
  '/projects',
  protect,
  [
    body('name').notEmpty().withMessage('Project name is required'),
  ],
  validator,
  profileController.addProject
);

router.put(
  '/projects/:id',
  protect,
  profileController.updateProject
);

router.delete('/projects/:id', protect, profileController.deleteProject);

module.exports = router;
