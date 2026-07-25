const Gamification = require('../models/Gamification');
const GlobalChallenge = require('../models/Gamification').GlobalChallenge;
const GlobalReward = require('../models/Gamification').GlobalReward;

// XP rewards for different activities
const XP_REWARDS = {
  interview_completed: { base: 50, multiplier: 1.0 },
  interview_perfect: { base: 100, multiplier: 2.0 },
  interview_good: { base: 75, multiplier: 1.5 },
  interview_average: { base: 50, multiplier: 1.0 },
  company_interview: { base: 75, multiplier: 1.5 },
  voice_interview: { base: 60, multiplier: 1.2 },
  coding_interview: { base: 80, multiplier: 1.6 },
  daily_login: { base: 10, multiplier: 1.0 },
  streak_bonus: { base: 5, multiplier: 1.0 },
  challenge_completed: { base: 100, multiplier: 1.0 },
};

// Badge definitions
const BADGES = [
  {
    id: 'first_interview',
    name: 'First Steps',
    description: 'Complete your first interview',
    icon: '🎯',
    rarity: 'common',
    target: 1,
  },
  {
    id: 'five_interviews',
    name: 'Getting Started',
    description: 'Complete 5 interviews',
    icon: '🌟',
    rarity: 'common',
    target: 5,
  },
  {
    id: 'ten_interviews',
    name: 'Interview Pro',
    description: 'Complete 10 interviews',
    icon: '⭐',
    rarity: 'rare',
    target: 10,
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Get a perfect score in an interview',
    icon: '💯',
    rarity: 'epic',
    target: 1,
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    target: 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    rarity: 'rare',
    target: 7,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    rarity: 'legendary',
    target: 30,
  },
  {
    id: 'company_master',
    name: 'Company Expert',
    description: 'Complete interviews for all 10 companies',
    icon: '🏢',
    rarity: 'epic',
    target: 10,
  },
  {
    id: 'coding_ninja',
    name: 'Coding Ninja',
    description: 'Complete 10 coding interviews',
    icon: '🥷',
    rarity: 'rare',
    target: 10,
  },
  {
    id: 'voice_master',
    name: 'Voice Master',
    description: 'Complete 10 voice interviews',
    icon: '🎤',
    rarity: 'rare',
    target: 10,
  },
];

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: 'first_interview',
    name: 'First Interview',
    description: 'Complete your first interview',
    category: 'interviews',
    xpReward: 50,
    target: 1,
  },
  {
    id: 'five_interviews',
    name: 'Interview Enthusiast',
    description: 'Complete 5 interviews',
    category: 'interviews',
    xpReward: 100,
    target: 5,
  },
  {
    id: 'ten_interviews',
    name: 'Interview Expert',
    description: 'Complete 10 interviews',
    category: 'interviews',
    xpReward: 200,
    target: 10,
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Maintain a 3-day streak',
    category: 'streaks',
    xpReward: 75,
    target: 3,
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Maintain a 7-day streak',
    category: 'streaks',
    xpReward: 150,
    target: 7,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get a perfect score in an interview',
    category: 'interviews',
    xpReward: 100,
    target: 1,
  },
];

/**
 * Get or create user gamification profile
 */
async function getOrCreateGamification(userId) {
  let gamification = await Gamification.findOne({ user: userId });
  
  if (!gamification) {
    try {
      gamification = await Gamification.create({
        user: userId,
        badges: BADGES.map(badge => ({
          ...badge,
          progress: 0,
        })),
        achievements: ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          progress: 0,
        })),
      });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error - try to find again (might have been created by another request)
        gamification = await Gamification.findOne({ user: userId });
        if (!gamification) {
          // If still not found, create without badges/achievements first
          gamification = await Gamification.create({
            user: userId,
            badges: [],
            achievements: [],
          });
          // Then add badges and achievements one by one
          for (const badge of BADGES) {
            gamification.badges.push({
              ...badge,
              progress: 0,
            });
          }
          for (const achievement of ACHIEVEMENTS) {
            gamification.achievements.push({
              ...achievement,
              progress: 0,
            });
          }
          await gamification.save();
        }
      } else {
        throw error;
      }
    }
  }
  
  // Generate recent activities
  const recentActivities = generateRecentActivities(gamification);
  
  // Return gamification with recent activities
  return {
    ...gamification.toObject(),
    recentActivities,
  };
}

/**
 * Generate recent activities from gamification data
 */
function generateRecentActivities(gamification) {
  const activities = [];
  
  // Add recent badge unlocks
  const recentBadges = gamification.badges
    .filter(b => b.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 3);
  
  recentBadges.forEach(badge => {
    activities.push({
      id: `badge_${badge.id}`,
      type: 'badge',
      title: `Unlocked Badge: ${badge.name}`,
      time: getTimeAgo(badge.unlockedAt),
    });
  });
  
  // Add recent achievement unlocks
  const recentAchievements = gamification.achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 2);
  
  recentAchievements.forEach(achievement => {
    activities.push({
      id: `achievement_${achievement.id}`,
      type: 'achievement',
      title: `Achievement: ${achievement.name}`,
      time: getTimeAgo(achievement.unlockedAt),
    });
  });
  
  // Add interview activity based on stats
  if (gamification.stats.interviewsCompleted > 0) {
    activities.push({
      id: `interview_${Date.now()}`,
      type: 'interview',
      title: `Completed ${gamification.stats.interviewsCompleted} Interview${gamification.stats.interviewsCompleted > 1 ? 's' : ''}`,
      time: 'Recently',
    });
  }
  
  // Add level up activity
  if (gamification.level > 1) {
    activities.push({
      id: `level_${gamification.level}`,
      type: 'level',
      title: `Reached Level ${gamification.level}`,
      time: getTimeAgo(gamification.updatedAt),
    });
  }
  
  // Add streak activity
  if (gamification.streak.current > 0) {
    activities.push({
      id: `streak_${gamification.streak.current}`,
      type: 'streak',
      title: `${gamification.streak.current} Day Streak`,
      time: getTimeAgo(gamification.streak.lastActiveDate),
    });
  }
  
  // Sort by time (most recent first) and limit to 5
  return activities.slice(0, 5);
}

/**
 * Get time ago string
 */
function getTimeAgo(date) {
  if (!date) return 'Unknown';
  
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return 'Recently';
}

/**
 * Calculate XP for interview completion
 */
function calculateInterviewXP(score, interviewType) {
  let baseXP = XP_REWARDS.interview_completed.base;
  let multiplier = XP_REWARDS.interview_completed.multiplier;
  
  if (score >= 90) {
    baseXP = XP_REWARDS.interview_perfect.base;
    multiplier = XP_REWARDS.interview_perfect.multiplier;
  } else if (score >= 75) {
    baseXP = XP_REWARDS.interview_good.base;
    multiplier = XP_REWARDS.interview_good.multiplier;
  } else if (score >= 60) {
    baseXP = XP_REWARDS.interview_average.base;
    multiplier = XP_REWARDS.interview_average.multiplier;
  }
  
  // Apply interview type multiplier
  switch (interviewType) {
    case 'company':
      multiplier *= XP_REWARDS.company_interview.multiplier;
      break;
    case 'voice':
      multiplier *= XP_REWARDS.voice_interview.multiplier;
      break;
    case 'coding':
      multiplier *= XP_REWARDS.coding_interview.multiplier;
      break;
  }
  
  return Math.floor(baseXP * multiplier);
}

/**
 * Award XP to user
 */
async function awardXP(userId, amount, reason) {
  const gamification = await getOrCreateGamification(userId);
  const leveledUp = gamification.addXP(amount);
  
  await gamification.save();
  
  return {
    xp: gamification.xp,
    totalXP: gamification.totalXP,
    level: gamification.level,
    xpToNextLevel: gamification.xpToNextLevel,
    leveledUp,
    amount,
    reason,
  };
}

/**
 * Update user stats after interview
 */
async function updateInterviewStats(userId, score, interviewType) {
  const gamification = await getOrCreateGamification(userId);
  
  gamification.stats.totalInterviews += 1;
  gamification.stats.interviewsCompleted += 1;
  
  // Update average score
  const totalScore = gamification.stats.averageScore * (gamification.stats.interviewsCompleted - 1) + score;
  gamification.stats.averageScore = Math.round(totalScore / gamification.stats.interviewsCompleted);
  
  if (score === 100) {
    gamification.stats.perfectInterviews += 1;
  }
  
  // Update interview achievements
  const interviewAchievement = gamification.achievements.find(a => a.category === 'interviews');
  if (interviewAchievement) {
    interviewAchievement.progress = Math.min(interviewAchievement.progress + 1, interviewAchievement.target);
    
    if (interviewAchievement.progress >= interviewAchievement.target && !interviewAchievement.unlockedAt) {
      interviewAchievement.unlockedAt = new Date();
      await awardXP(userId, interviewAchievement.xpReward, `Achievement: ${interviewAchievement.name}`);
    }
  }
  
  // Update perfect score achievement
  if (score === 100) {
    const perfectAchievement = gamification.achievements.find(a => a.id === 'perfect_score');
    if (perfectAchievement && !perfectAchievement.unlockedAt) {
      perfectAchievement.progress = 1;
      perfectAchievement.unlockedAt = new Date();
      await awardXP(userId, perfectAchievement.xpReward, `Achievement: ${perfectAchievement.name}`);
    }
  }
  
  // Update interview badges
  const interviewBadge = gamification.badges.find(b => b.id === 'first_interview');
  if (interviewBadge && !interviewBadge.unlockedAt) {
    interviewBadge.progress = 1;
    interviewBadge.unlockedAt = new Date();
  }
  
  const fiveInterviewBadge = gamification.badges.find(b => b.id === 'five_interviews');
  if (fiveInterviewBadge) {
    fiveInterviewBadge.progress = Math.min(fiveInterviewBadge.progress + 1, fiveInterviewBadge.target);
    if (fiveInterviewBadge.progress >= fiveInterviewBadge.target && !fiveInterviewBadge.unlockedAt) {
      fiveInterviewBadge.unlockedAt = new Date();
    }
  }
  
  const tenInterviewBadge = gamification.badges.find(b => b.id === 'ten_interviews');
  if (tenInterviewBadge) {
    tenInterviewBadge.progress = Math.min(tenInterviewBadge.progress + 1, tenInterviewBadge.target);
    if (tenInterviewBadge.progress >= tenInterviewBadge.target && !tenInterviewBadge.unlockedAt) {
      tenInterviewBadge.unlockedAt = new Date();
    }
  }
  
  if (score === 100) {
    const perfectBadge = gamification.badges.find(b => b.id === 'perfect_score');
    if (perfectBadge && !perfectBadge.unlockedAt) {
      perfectBadge.progress = 1;
      perfectBadge.unlockedAt = new Date();
    }
  }
  
  await gamification.save();
  
  return gamification;
}

/**
 * Update daily streak
 */
async function updateDailyStreak(userId) {
  const gamification = await getOrCreateGamification(userId);
  const streak = gamification.updateStreak();
  
  // Award streak bonus XP
  if (streak > 1) {
    const bonusXP = Math.floor(XP_REWARDS.streak_bonus.base * streak * XP_REWARDS.streak_bonus.multiplier);
    await awardXP(userId, bonusXP, `Streak bonus: ${streak} days`);
  }
  
  // Update streak achievements and badges
  const streakAchievement3 = gamification.achievements.find(a => a.id === 'streak_3');
  const streakAchievement7 = gamification.achievements.find(a => a.id === 'streak_7');
  
  if (streakAchievement3 && streak >= 3 && !streakAchievement3.unlockedAt) {
    streakAchievement3.progress = 3;
    streakAchievement3.unlockedAt = new Date();
    await awardXP(userId, streakAchievement3.xpReward, `Achievement: ${streakAchievement3.name}`);
  }
  
  if (streakAchievement7 && streak >= 7 && !streakAchievement7.unlockedAt) {
    streakAchievement7.progress = 7;
    streakAchievement7.unlockedAt = new Date();
    await awardXP(userId, streakAchievement7.xpReward, `Achievement: ${streakAchievement7.name}`);
  }
  
  const streakBadge3 = gamification.badges.find(b => b.id === 'streak_3');
  if (streakBadge3 && streak >= 3 && !streakBadge3.unlockedAt) {
    streakBadge3.progress = 3;
    streakBadge3.unlockedAt = new Date();
  }
  
  const streakBadge7 = gamification.badges.find(b => b.id === 'streak_7');
  if (streakBadge7 && streak >= 7 && !streakBadge7.unlockedAt) {
    streakBadge7.progress = 7;
    streakBadge7.unlockedAt = new Date();
  }
  
  const streakBadge30 = gamification.badges.find(b => b.id === 'streak_30');
  if (streakBadge30) {
    streakBadge30.progress = Math.min(streak, streakBadge30.target);
    if (streakBadge30.progress >= streakBadge30.target && !streakBadge30.unlockedAt) {
      streakBadge30.unlockedAt = new Date();
    }
  }
  
  await gamification.save();
  
  return {
    currentStreak: streak,
    longestStreak: gamification.streak.longest,
  };
}

/**
 * Get leaderboard
 */
async function getLeaderboard(type = 'global', limit = 10) {
  const sortField = type === 'global' ? 'totalXP' : 
                    type === 'weekly' ? 'leaderboard.weeklyRank' : 
                    'leaderboard.monthlyRank';
  
  const leaderboard = await Gamification.find()
    .sort({ [sortField]: -1 })
    .limit(limit)
    .populate('user', 'name email avatar');
  
  return leaderboard.map((entry, index) => ({
    rank: index + 1,
    user: entry.user,
    level: entry.level,
    totalXP: entry.totalXP,
    points: entry.leaderboard.points,
  }));
}

/**
 * Get challenges for user
 */
async function getChallengesForUser(userId) {
  const gamification = await getOrCreateGamification(userId);
  
  // Get active global challenges
  const now = new Date();
  const activeGlobalChallenges = await GlobalChallenge.find({
    active: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
  
  // Merge with user's active challenges
  const userChallengeIds = gamification.activeChallenges.map(c => c.id);
  const newGlobalChallenges = activeGlobalChallenges.filter(
    gc => !userChallengeIds.includes(gc.id)
  );
  
  // Add new global challenges to user's active challenges
  newGlobalChallenges.forEach(gc => {
    gamification.activeChallenges.push({
      id: gc.id,
      title: gc.title,
      description: gc.description,
      type: gc.type,
      xpReward: gc.xpReward,
      startDate: gc.startDate,
      endDate: gc.endDate,
      target: gc.target,
      progress: 0,
      completed: false,
    });
  });
  
  await gamification.save();
  
  return {
    active: gamification.activeChallenges,
    completed: gamification.completedChallenges,
  };
}

/**
 * Update challenges
 */
async function updateChallenges(userId, interviewType) {
  const gamification = await getOrCreateGamification(userId);
  
  // Update daily challenges
  gamification.activeChallenges.forEach(challenge => {
    if (challenge.type === 'daily' && !challenge.completed) {
      if (challenge.title.includes('Interviews')) {
        challenge.progress = Math.min(challenge.progress + 1, challenge.target);
      } else if (challenge.title.includes('Score')) {
        // This would need to be called with score
      }
      
      if (challenge.progress >= challenge.target && !challenge.completed) {
        challenge.completed = true;
        challenge.completedAt = new Date();
        gamification.completedChallenges.push(challenge);
        gamification.stats.challengesCompleted += 1;
        awardXP(userId, challenge.xpReward, `Challenge: ${challenge.title}`);
      }
    }
  });
  
  await gamification.save();
  
  return gamification;
}

module.exports = {
  getOrCreateGamification,
  calculateInterviewXP,
  awardXP,
  updateInterviewStats,
  updateDailyStreak,
  getLeaderboard,
  getChallengesForUser,
  updateChallenges,
  XP_REWARDS,
  BADGES,
  ACHIEVEMENTS,
};
