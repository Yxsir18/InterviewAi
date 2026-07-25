const User = require('../models/User');
const Interview = require('../models/Interview');
const Report = require('../models/Report');
const Certificate = require('../models/Certificate');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Gamification = require('../models/Gamification');
const CodingInterview = require('../models/CodingInterview');
const CompanyInterview = require('../models/CompanyInterview');
const VoiceInterview = require('../models/VoiceInterview');

// @desc    Get user dashboard data
// @route   GET /api/dashboard/user
// @access  Private
exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get gamification data
    const gamification = await Gamification.findOne({ user: userId });

    // Get interview statistics
    const totalInterviews = await Interview.countDocuments({ user: userId });
    const completedInterviews = await Interview.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });
    const pendingInterviews = await Interview.countDocuments({ 
      user: userId, 
      status: { $in: ['scheduled', 'in_progress'] } 
    });

    // Get scores
    const reports = await Report.find({ user: userId }).select('score');
    const scores = reports.map(r => r.score);
    const averageScore = scores.length > 0 
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) 
      : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    // Get certificates
    const totalCertificates = await Certificate.countDocuments({ user: userId });

    // Get resume analyses
    const resumeAnalyses = await ResumeAnalysis.countDocuments({ user: userId });

    // Get recent interviews
    const recentInterviews = await Interview.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type difficulty status createdAt score');

    // Get recent activity from gamification
    const recentActivity = gamification?.activityLog 
      ? gamification.activityLog.slice(-5).reverse()
      : [];

    // Get upcoming interviews
    const upcomingInterviews = await Interview.find({
      user: userId,
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
    .sort({ scheduledDate: 1 })
    .limit(5)
    .select('title type difficulty scheduledDate');

    // Get performance data for charts
    const performanceByType = await Report.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          averageScore: { $avg: '$score' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get performance over time (last 7 days)
    const performanceOverTime = await Report.aggregate([
      { 
        $match: { 
          user: userId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          averageScore: { $avg: '$score' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get resume data
    const resumeData = await ResumeAnalysis.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select('atsScore overallScore createdAt');

    // Get certificates
    const certificates = await Certificate.find({ user: userId })
      .sort({ issuedDate: -1 })
      .limit(5)
      .select('certificateNumber score interviewType difficulty issuedDate');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalInterviews,
          completedInterviews,
          pendingInterviews,
          averageScore,
          highestScore,
          totalCertificates,
          resumeAnalyses,
          currentLevel: gamification?.level || 1,
          currentXP: gamification?.xp || 0,
          xpRequired: gamification?.xpToNextLevel || 100,
          currentStreak: gamification?.streak?.current || 0,
          longestStreak: gamification?.streak?.longest || 0
        },
        recentInterviews,
        recentActivity,
        upcomingInterviews,
        performanceByType,
        performanceOverTime,
        resumeData,
        certificates
      }
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: thirtyDaysAgo } 
    });
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: thisMonth } 
    });

    // Get interview statistics
    const totalInterviews = await Interview.countDocuments();
    const completedInterviews = await Interview.countDocuments({ 
      status: 'completed' 
    });
    const scheduledInterviews = await Interview.countDocuments({ 
      status: 'scheduled' 
    });

    // Get AI questions generated (estimate from interviews)
    const aiQuestionsGenerated = await Interview.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$questions' } } } }
    ]);

    // Get certificates issued
    const certificatesIssued = await Certificate.countDocuments();

    // Get resume analyses
    const resumeAnalyses = await ResumeAnalysis.countDocuments();

    // Get interview statistics
    const interviewStats = await Interview.aggregate([
      { $group: {
        _id: null,
        averageScore: { $avg: '$score' },
        completionRate: {
          $avg: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }}
    ]);

    // Get most popular interview type
    const popularType = await Interview.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Get most popular difficulty
    const popularDifficulty = await Interview.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Get gamification analytics
    const highestLevel = await Gamification.findOne().sort({ level: -1 }).select('level');
    const highestXP = await Gamification.findOne().sort({ totalXP: -1 }).select('totalXP');
    const topStreak = await Gamification.findOne().sort({ 'streak.longest': -1 }).select('streak.longest');

    // Get top users by XP
    const topUsers = await Gamification.find()
      .sort({ totalXP: -1 })
      .limit(10)
      .populate('user', 'name email')
      .select('user level totalXP streak');

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt');

    // Get recent interviews
    const recentInterviews = await Interview.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .select('title type difficulty status user createdAt');

    // Get recent certificates
    const recentCertificates = await Certificate.find()
      .sort({ issuedDate: -1 })
      .limit(10)
      .populate('user', 'name')
      .select('certificateNumber score interviewType user issuedDate');

    // Get user growth data
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get interview trends
    const interviewTrends = await Interview.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          newUsers,
          totalInterviews,
          completedInterviews,
          scheduledInterviews,
          aiQuestionsGenerated: aiQuestionsGenerated[0]?.total || 0,
          certificatesIssued,
          resumeAnalyses
        },
        interviewStats: {
          averageScore: interviewStats[0]?.averageScore || 0,
          completionRate: interviewStats[0]?.completionRate || 0,
          popularType: popularType[0]?._id || 'N/A',
          popularDifficulty: popularDifficulty[0]?._id || 'N/A'
        },
        gamificationStats: {
          highestLevel: highestLevel?.level || 0,
          highestXP: highestXP?.totalXP || 0,
          topStreak: topStreak?.streak?.longest || 0
        },
        topUsers,
        recentUsers,
        recentInterviews,
        recentCertificates,
        charts: {
          userGrowth,
          interviewTrends
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard data',
      error: error.message
    });
  }
};

// @desc    Get dashboard charts data
// @route   GET /api/dashboard/charts
// @access  Private
exports.getDashboardCharts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    let charts = {};

    if (isAdmin) {
      // Admin charts
      charts.usersByMonth = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      charts.interviewsByMonth = await Interview.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      charts.interviewsByType = await Interview.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);

      charts.interviewsByDifficulty = await Interview.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]);

      charts.performanceDistribution = await Report.aggregate([
        {
          $bucket: {
            groupBy: '$score',
            boundaries: [0, 25, 50, 75, 100],
            default: 'Other',
            output: { count: { $sum: 1 } }
          }
        }
      ]);
    } else {
      // User charts
      charts.userPerformance = await Report.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            averageScore: { $avg: '$score' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      charts.userInterviewsByType = await Interview.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);

      charts.userPerformanceByType = await Report.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$type',
            averageScore: { $avg: '$score' },
            count: { $sum: 1 }
          }
        }
      ]);
    }

    res.status(200).json({
      success: true,
      data: charts
    });
  } catch (error) {
    console.error('Error fetching dashboard charts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch charts data',
      error: error.message
    });
  }
};
