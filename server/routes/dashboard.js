const express = require('express');
const router = express.Router();
const {
  getUserDashboard,
  getAdminDashboard,
  getDashboardCharts,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/user
// @desc    Get user dashboard data
// @access  Private
router.get('/user', protect, getUserDashboard);

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/admin', protect, getAdminDashboard);

// @route   GET /api/dashboard/charts
// @desc    Get dashboard charts data
// @access  Private
router.get('/charts', protect, getDashboardCharts);

module.exports = router;
