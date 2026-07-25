const express = require('express');
const router = express.Router();
const {
  body,
  query,
  validationResult,
} = require('express-validator');
const {
  getGamificationProfile,
  awardXP,
  interviewComplete,
  updateStreak,
  getLeaderboard,
  getChallenges,
  getBadges,
  getRewards,
  unlockReward,
  getCareerRanks,
  getPerformanceInsights,
  getPersonalBests,
  getDailyGoals,
  resetAchievements,
  triggerEvent,
} = require('../controllers/gamificationController');
const { protect, admin } = require('../middleware/auth');

// Middleware to protect all routes
router.use(protect);

// @route   GET /api/gamification/profile
// @desc    Get user gamification profile
// @access  Private
router.get('/profile', getGamificationProfile);

// @route   POST /api/gamification/award-xp
// @desc    Award XP to user
// @access  Private
router.post(
  '/award-xp',
  [
    body('amount').isInt({ min: 1 }),
    body('reason').optional(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  awardXP
);

// @route   POST /api/gamification/interview-complete
// @desc    Update interview stats and award XP
// @access  Private
router.post(
  '/interview-complete',
  [
    body('score').isInt({ min: 0, max: 100 }),
    body('interviewType').optional().isIn(['conversational', 'coding', 'company', 'voice']),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  interviewComplete
);

// @route   POST /api/gamification/update-streak
// @desc    Update daily streak
// @access  Private
router.post('/update-streak', updateStreak);

// @route   GET /api/gamification/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get(
  '/leaderboard',
  [
    query('type').optional().isIn(['global', 'weekly', 'monthly']),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  getLeaderboard
);

// @route   GET /api/gamification/challenges
// @desc    Get challenges
// @access  Private
router.get('/challenges', getChallenges);

// @route   GET /api/gamification/badges
// @desc    Get badges and achievements
// @access  Private
router.get('/badges', getBadges);

// @route   GET /api/gamification/rewards
// @desc    Get rewards
// @access  Private
router.get('/rewards', getRewards);

// @route   POST /api/gamification/unlock-reward
// @desc    Unlock reward
// @access  Private
router.post(
  '/unlock-reward',
  [
    body('rewardId').notEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  unlockReward
);

// @route   GET /api/gamification/career-ranks
// @desc    Get career ranks
// @access  Private
router.get('/career-ranks', getCareerRanks);

// @route   GET /api/gamification/performance-insights
// @desc    Get performance insights
// @access  Private
router.get('/performance-insights', getPerformanceInsights);

// @route   GET /api/gamification/personal-bests
// @desc    Get personal bests
// @access  Private
router.get('/personal-bests', getPersonalBests);

// @route   GET /api/gamification/daily-goals
// @desc    Get daily goals
// @access  Private
router.get('/daily-goals', getDailyGoals);

// @route   POST /api/gamification/reset-achievements
// @desc    Reset user achievements to initial state
// @access  Private
router.post('/reset-achievements', resetAchievements);

// @route   POST /api/gamification/event
// @desc    Trigger gamification event
// @access  Private
router.post('/event', triggerEvent);

module.exports = router;
