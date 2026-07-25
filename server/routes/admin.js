const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const gamificationController = require('../controllers/gamificationController');
const { protect, authorize } = require('../middleware/auth');

// Get stats
router.get('/stats', protect, authorize('admin'), adminController.getStats);

// Get detailed stats for dashboard
router.get('/stats/detailed', protect, authorize('admin'), adminController.getDetailedStats);

// Get analytics
router.get('/analytics', protect, authorize('admin'), adminController.getAnalytics);

// User routes
router.get('/users', protect, authorize('admin'), adminController.getUsers);
router.get('/users/:id', protect, authorize('admin'), adminController.getUser);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

// Bulk user actions
router.post('/users/bulk', protect, authorize('admin'), adminController.bulkUserAction);

// Individual user actions
router.post('/users/:id/:action', protect, authorize('admin'), adminController.userAction);

// Export users
router.get('/users/export', protect, authorize('admin'), adminController.exportUsers);

// Interview routes
router.get('/interviews', protect, authorize('admin'), adminController.getInterviews);

// Certificate routes
router.get('/certificates', protect, authorize('admin'), adminController.getCertificates);
router.put('/certificates/:id/verify', protect, authorize('admin'), adminController.verifyCertificate);

// Settings routes
router.get('/settings', protect, authorize('admin'), adminController.getSettings);
router.put('/settings', protect, authorize('admin'), adminController.updateSettings);

// AI Settings routes
router.get('/ai-settings', protect, authorize('admin'), adminController.getAISettings);
router.put('/ai-settings', protect, authorize('admin'), adminController.updateAISettings);
router.post('/ai-settings/test/:providerId', protect, authorize('admin'), adminController.testAIConnection);

// Activity Logs routes
router.get('/activity-logs', protect, authorize('admin'), adminController.getActivityLogs);
router.get('/activity-logs/export', protect, authorize('admin'), adminController.exportActivityLogs);

// Gamification routes
router.get('/gamification', protect, authorize('admin'), gamificationController.getAdminGamificationData);
router.put('/gamification/career-ranks', protect, authorize('admin'), gamificationController.updateCareerRanks);

// Gamification Challenges routes
router.get('/gamification/challenges', protect, authorize('admin'), gamificationController.getChallenges);
router.post('/gamification/challenges', protect, authorize('admin'), gamificationController.createChallenge);
router.put('/gamification/challenges/:id', protect, authorize('admin'), gamificationController.updateChallenge);
router.delete('/gamification/challenges/:id', protect, authorize('admin'), gamificationController.deleteChallenge);

// Gamification Rewards routes
router.get('/gamification/rewards', protect, authorize('admin'), gamificationController.getRewards);
router.post('/gamification/rewards', protect, authorize('admin'), gamificationController.createReward);
router.put('/gamification/rewards/:id', protect, authorize('admin'), gamificationController.updateReward);
router.delete('/gamification/rewards/:id', protect, authorize('admin'), gamificationController.deleteReward);

// Notifications routes
router.get('/notifications', protect, authorize('admin'), adminController.getNotifications);
router.post('/notifications', protect, authorize('admin'), adminController.createNotification);
router.put('/notifications/:id', protect, authorize('admin'), adminController.updateNotification);
router.delete('/notifications/:id', protect, authorize('admin'), adminController.deleteNotification);

module.exports = router;
