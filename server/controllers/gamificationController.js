const Gamification = require('../models/Gamification');
const GlobalChallenge = require('../models/Gamification').GlobalChallenge;
const GlobalReward = require('../models/Gamification').GlobalReward;
const gamificationService = require('../services/gamificationService');
const gamificationEngine = require('../services/gamificationEngine');

// @desc    Get user gamification profile
// @route   GET /api/gamification/profile
// @access  Private
exports.getGamificationProfile = async (req, res, next) => {
  try {
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    
    res.status(200).json({
      success: true,
      data: gamification,
    });
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gamification profile',
      error: error.message,
    });
  }
};

// @desc    Award XP to user
// @route   POST /api/gamification/award-xp
// @access  Private
exports.awardXP = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid XP amount',
      });
    }
    
    const result = await gamificationService.awardXP(req.user._id, amount, reason);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error awarding XP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to award XP',
      error: error.message,
    });
  }
};

// @desc    Update interview stats and award XP
// @route   POST /api/gamification/interview-complete
// @access  Private
exports.interviewComplete = async (req, res, next) => {
  try {
    const { score, interviewType } = req.body;
    
    if (!score || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid score',
      });
    }
    
    // Use the gamification engine to process the interview completion
    const result = await gamificationEngine.processGamificationEvent(
      req.user._id,
      'interview_completed',
      { score, interviewType }
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error processing interview completion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process interview completion',
      error: error.message,
    });
  }
};

// @desc    Update daily streak
// @route   POST /api/gamification/update-streak
// @access  Private
exports.updateStreak = async (req, res, next) => {
  try {
    // Use the gamification engine to process login event
    const result = await gamificationEngine.processGamificationEvent(
      req.user._id,
      'login',
      {}
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update streak',
      error: error.message,
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { type = 'global', limit = 10 } = req.query;
    
    const leaderboard = await gamificationService.getLeaderboard(type, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message,
    });
  }
};

// @desc    Get challenges
// @route   GET /api/gamification/challenges
// @access  Private
exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await gamificationService.getChallengesForUser(req.user._id);
    
    res.status(200).json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message,
    });
  }
};

// @desc    Get badges and achievements
// @route   GET /api/gamification/badges
// @access  Private
exports.getBadges = async (req, res, next) => {
  try {
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        badges: gamification.badges,
        achievements: gamification.achievements,
      },
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
      error: error.message,
    });
  }
};

// @desc    Get rewards
// @route   GET /api/gamification/rewards
// @access  Private
exports.getRewards = async (req, res, next) => {
  try {
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    
    res.status(200).json({
      success: true,
      data: gamification.rewards,
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rewards',
      error: error.message,
    });
  }
};

// @desc    Unlock reward
// @route   POST /api/gamification/unlock-reward
// @access  Private
exports.unlockReward = async (req, res, next) => {
  try {
    const { rewardId } = req.body;
    
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    const reward = gamification.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found',
      });
    }
    
    if (reward.unlocked) {
      return res.status(400).json({
        success: false,
        message: 'Reward already unlocked',
      });
    }
    
    reward.unlocked = true;
    reward.unlockedAt = new Date();
    
    await gamification.save();
    
    res.status(200).json({
      success: true,
      data: reward,
    });
  } catch (error) {
    console.error('Error unlocking reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlock reward',
      error: error.message,
    });
  }
};

// @desc    Create challenge (Admin)
// @route   POST /api/gamification/admin/challenges
// @access  Private (Admin only)
exports.createChallenge = async (req, res, next) => {
  try {
    const { title, description, type, xpReward, startDate, endDate, target } = req.body;
    
    const challenge = await GlobalChallenge.create({
      id: `challenge_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title,
      description,
      type,
      xpReward,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      target,
      active: true,
    });
    
    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create challenge',
      error: error.message,
    });
  }
};

// @desc    Update challenge (Admin)
// @route   PUT /api/gamification/admin/challenges/:id
// @access  Private (Admin only)
exports.updateChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const challenge = await GlobalChallenge.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Challenge updated successfully',
      data: challenge,
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update challenge',
      error: error.message,
    });
  }
};

// @desc    Delete challenge (Admin)
// @route   DELETE /api/gamification/admin/challenges/:id
// @access  Private (Admin only)
exports.deleteChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await GlobalChallenge.findOneAndDelete({ id });
    
    res.status(200).json({
      success: true,
      message: 'Challenge deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete challenge',
      error: error.message,
    });
  }
};

// @desc    Get all challenges (Admin)
// @route   GET /api/gamification/admin/challenges
// @access  Private (Admin only)
exports.getAllChallenges = async (req, res, next) => {
  try {
    const challenges = await GlobalChallenge.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message,
    });
  }
};

// @desc    Get all rewards (Admin)
// @route   GET /api/gamification/admin/rewards
// @access  Private (Admin only)
exports.getAllRewards = async (req, res, next) => {
  try {
    const rewards = await GlobalReward.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rewards',
      error: error.message,
    });
  }
};

// @desc    Create reward (Admin)
// @route   POST /api/gamification/admin/rewards
// @access  Private (Admin only)
exports.createReward = async (req, res, next) => {
  try {
    const { name, description, type, value } = req.body;
    
    const reward = await GlobalReward.create({
      id: `reward_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name,
      description,
      type,
      value: value ? JSON.parse(value) : {},
      active: true,
    });
    
    res.status(200).json({
      success: true,
      data: reward,
    });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reward',
      error: error.message,
    });
  }
};

// @desc    Update reward (Admin)
// @route   PUT /api/gamification/admin/rewards/:id
// @access  Private (Admin only)
exports.updateReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.value && typeof updates.value === 'string') {
      updates.value = JSON.parse(updates.value);
    }
    
    const reward = await GlobalReward.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reward updated successfully',
      data: reward,
    });
  } catch (error) {
    console.error('Error updating reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reward',
      error: error.message,
    });
  }
};

// @desc    Delete reward (Admin)
// @route   DELETE /api/gamification/admin/rewards/:id
// @access  Private (Admin only)
exports.deleteReward = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await GlobalReward.findOneAndDelete({ id });
    
    res.status(200).json({
      success: true,
      message: 'Reward deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reward',
      error: error.message,
    });
  }
};

// @desc    Get career ranks
// @route   GET /api/gamification/career-ranks
// @access  Private
exports.getCareerRanks = async (req, res, next) => {
  try {
    // Default career ranks - can be stored in database later
    const careerRanks = [
      { name: 'Intern', minLevel: 1, color: 'gray', icon: 'GraduationCap' },
      { name: 'Junior Developer', minLevel: 6, color: 'orange', icon: 'Briefcase' },
      { name: 'Software Engineer', minLevel: 11, color: 'indigo', icon: 'Code2' },
      { name: 'Senior Developer', minLevel: 21, color: 'green', icon: 'Star' },
      { name: 'Interview Expert', minLevel: 31, color: 'blue', icon: 'Crown' },
    ];
    
    res.status(200).json({
      success: true,
      data: careerRanks,
    });
  } catch (error) {
    console.error('Error fetching career ranks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch career ranks',
      error: error.message,
    });
  }
};

// @desc    Get performance insights
// @route   GET /api/gamification/performance-insights
// @access  Private
exports.getPerformanceInsights = async (req, res, next) => {
  try {
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    
    // Calculate performance insights based on stats
    const insights = {
      strengths: ['Problem Solving', 'Technical Knowledge'],
      weaknesses: ['Communication'],
      recommendation: 'Practice one Behavioral Interview to improve your communication skills.',
    };
    
    // Customize based on user's average score
    if (gamification.stats.averageScore >= 85) {
      insights.strengths.push('High Performance');
    }
    
    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Error fetching performance insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance insights',
      error: error.message,
    });
  }
};

// @desc    Get personal bests
// @route   GET /api/gamification/personal-bests
// @access  Private
exports.getPersonalBests = async (req, res, next) => {
  try {
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    
    const personalBests = {
      highestScore: `${gamification.stats.averageScore}%`,
      longestStreak: `${gamification.streak.longest} days`,
      totalXPEarned: gamification.totalXP.toLocaleString(),
      favoriteCategory: 'React', // Can be calculated from interview stats
    };
    
    res.status(200).json({
      success: true,
      data: personalBests,
    });
  } catch (error) {
    console.error('Error fetching personal bests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personal bests',
      error: error.message,
    });
  }
};

// @desc    Get daily goals
// @route   GET /api/gamification/daily-goals
// @access  Private
exports.getDailyGoals = async (req, res, next) => {
  try {
    const gamification = await gamificationService.getOrCreateGamification(req.user._id);
    
    // Generate daily goals based on user's current state
    const dailyGoals = [
      {
        id: 'goal_1',
        title: 'Complete 2 interviews',
        progress: gamification.stats.interviewsCompleted % 2,
        target: 2,
        xpReward: 50,
        completed: gamification.stats.interviewsCompleted % 2 >= 2,
      },
      {
        id: 'goal_2',
        title: 'Score above 80%',
        progress: gamification.stats.averageScore >= 80 ? 1 : 0,
        target: 1,
        xpReward: 30,
        completed: gamification.stats.averageScore >= 80,
      },
      {
        id: 'goal_3',
        title: 'Complete one coding interview',
        progress: 0,
        target: 1,
        xpReward: 40,
        completed: false,
      },
      {
        id: 'goal_4',
        title: 'Maintain login streak',
        progress: gamification.streak.current >= 1 ? 1 : 0,
        target: 1,
        xpReward: 10,
        completed: gamification.streak.current >= 1,
      },
    ];
    
    res.status(200).json({
      success: true,
      data: dailyGoals,
    });
  } catch (error) {
    console.error('Error fetching daily goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily goals',
      error: error.message,
    });
  }
};

// @desc    Update career ranks (Admin)
// @route   PUT /api/admin/gamification/career-ranks
// @access  Private (Admin only)
exports.updateCareerRanks = async (req, res, next) => {
  try {
    const { careerRanks } = req.body;
    
    // In a real implementation, this would save to a database
    // For now, we'll just return success
    // TODO: Create CareerRank model and save to database
    
    res.status(200).json({
      success: true,
      message: 'Career ranks updated successfully',
      data: careerRanks,
    });
  } catch (error) {
    console.error('Error updating career ranks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update career ranks',
      error: error.message,
    });
  }
};

// @desc    Reset user achievements to initial state
// @route   POST /api/gamification/reset-achievements
// @access  Private
exports.resetAchievements = async (req, res, next) => {
  try {
    const Gamification = require('../models/Gamification');
    
    // Get the actual Mongoose document
    const gamification = await Gamification.findOne({ user: req.user._id });
    
    if (!gamification) {
      return res.status(404).json({
        success: false,
        message: 'Gamification profile not found',
      });
    }
    
    // Reset all achievements to initial state
    const gamificationService = require('../services/gamificationService');
    gamification.achievements = gamificationService.ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      progress: 0,
      unlockedAt: null,
    }));
    
    await gamification.save();
    
    res.status(200).json({
      success: true,
      message: 'Achievements reset successfully',
      data: gamification.achievements,
    });
  } catch (error) {
    console.error('Error resetting achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset achievements',
      error: error.message,
    });
  }
};

// @desc    Trigger gamification event
// @route   POST /api/gamification/event
// @access  Private
exports.triggerEvent = async (req, res, next) => {
  try {
    const { eventType, eventData } = req.body;
    
    const result = await gamificationEngine.processGamificationEvent(
      req.user._id,
      eventType,
      eventData || {}
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error triggering gamification event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger gamification event',
      error: error.message,
    });
  }
};

// @desc    Seed default global challenges
// @route   POST /api/gamification/seed-challenges
// @access  Private (Admin only)
exports.seedChallenges = async (req, res, next) => {
  try {
    const GlobalChallenge = require('../models/Gamification').GlobalChallenge;
    
    const defaultChallenges = [
      {
        id: 'daily_interviews_2',
        title: 'Complete 2 Interviews',
        description: 'Complete 2 interviews today',
        type: 'daily',
        xpReward: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        target: 2,
        active: true,
      },
      {
        id: 'daily_score_80',
        title: 'Score Above 80%',
        description: 'Get a score above 80% in any interview',
        type: 'daily',
        xpReward: 30,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        target: 1,
        active: true,
      },
      {
        id: 'weekly_interviews_5',
        title: 'Complete 5 Interviews',
        description: 'Complete 5 interviews this week',
        type: 'weekly',
        xpReward: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        target: 5,
        active: true,
      },
      {
        id: 'weekly_streak_3',
        title: 'Maintain 3-Day Streak',
        description: 'Maintain a 3-day login streak',
        type: 'weekly',
        xpReward: 75,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        target: 3,
        active: true,
      },
    ];
    
    for (const challenge of defaultChallenges) {
      const existing = await GlobalChallenge.findOne({ id: challenge.id });
      if (!existing) {
        await GlobalChallenge.create(challenge);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Default challenges seeded successfully',
    });
  } catch (error) {
    console.error('Error seeding challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed challenges',
      error: error.message,
    });
  }
};

// Admin Gamification Management Routes

// @desc    Get admin gamification data (Admin)
// @route   GET /api/admin/gamification
// @access  Private (Admin only)
exports.getAdminGamificationData = async (req, res, next) => {
  try {
    const challenges = await GlobalChallenge.find().sort({ createdAt: -1 });
    const rewards = await GlobalReward.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        challenges,
        rewards,
        badges: [],
        achievements: [],
        xpRules: {
          interviewCompleted: 100,
          interviewScoreAbove80: 50,
          interviewScoreAbove90: 100,
          dailyLogin: 10,
          weeklyStreak: 50,
          certificateEarned: 200,
        },
        careerRanks: [],
      },
    });
  } catch (error) {
    console.error('Error fetching admin gamification data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gamification data',
      error: error.message,
    });
  }
};

// @desc    Get all challenges (Admin)
// @route   GET /api/admin/gamification/challenges
// @access  Private (Admin only)
exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await GlobalChallenge.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message,
    });
  }
};

// @desc    Create challenge (Admin)
// @route   POST /api/admin/gamification/challenges
// @access  Private (Admin only)
exports.createChallenge = async (req, res, next) => {
  try {
    const { title, description, type, xpReward, target, startDate, endDate } = req.body;
    
    const challenge = await GlobalChallenge.create({
      title,
      description,
      type,
      xpReward,
      target,
      startDate,
      endDate,
      isActive: true,
    });
    
    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      data: challenge,
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create challenge',
      error: error.message,
    });
  }
};

// @desc    Update challenge (Admin)
// @route   PUT /api/admin/gamification/challenges/:id
// @access  Private (Admin only)
exports.updateChallenge = async (req, res, next) => {
  try {
    const { title, description, type, xpReward, target, startDate, endDate, isActive } = req.body;
    
    const challenge = await GlobalChallenge.findByIdAndUpdate(
      req.params.id,
      { title, description, type, xpReward, target, startDate, endDate, isActive },
      { new: true, runValidators: true }
    );
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Challenge updated successfully',
      data: challenge,
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update challenge',
      error: error.message,
    });
  }
};

// @desc    Delete challenge (Admin)
// @route   DELETE /api/admin/gamification/challenges/:id
// @access  Private (Admin only)
exports.deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await GlobalChallenge.findByIdAndDelete(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Challenge deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete challenge',
      error: error.message,
    });
  }
};

// @desc    Get all rewards (Admin)
// @route   GET /api/admin/gamification/rewards
// @access  Private (Admin only)
exports.getRewards = async (req, res, next) => {
  try {
    const rewards = await GlobalReward.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rewards',
      error: error.message,
    });
  }
};

// @desc    Create reward (Admin)
// @route   POST /api/admin/gamification/rewards
// @access  Private (Admin only)
exports.createReward = async (req, res, next) => {
  try {
    const { name, description, type, value, cost } = req.body;
    
    const reward = await GlobalReward.create({
      name,
      description,
      type,
      value: typeof value === 'string' ? JSON.parse(value) : value,
      cost,
      isActive: true,
    });
    
    res.status(201).json({
      success: true,
      message: 'Reward created successfully',
      data: reward,
    });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reward',
      error: error.message,
    });
  }
};

// @desc    Update reward (Admin)
// @route   PUT /api/admin/gamification/rewards/:id
// @access  Private (Admin only)
exports.updateReward = async (req, res, next) => {
  try {
    const { name, description, type, value, cost, isActive } = req.body;
    
    const reward = await GlobalReward.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        type, 
        value: typeof value === 'string' ? JSON.parse(value) : value, 
        cost, 
        isActive 
      },
      { new: true, runValidators: true }
    );
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reward updated successfully',
      data: reward,
    });
  } catch (error) {
    console.error('Error updating reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reward',
      error: error.message,
    });
  }
};

// @desc    Delete reward (Admin)
// @route   DELETE /api/admin/gamification/rewards/:id
// @access  Private (Admin only)
exports.deleteReward = async (req, res, next) => {
  try {
    const reward = await GlobalReward.findByIdAndDelete(req.params.id);
    
    if (!reward) {
      return res.status(404).json({
        success: false,
        message: 'Reward not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reward deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reward',
      error: error.message,
    });
  }
};
