const Gamification = require('../models/Gamification');
const gamificationService = require('./gamificationService');

/**
 * Centralized Gamification Engine
 * Handles all automatic gamification updates in a single place
 */

// Challenge templates for auto-generation
const CHALLENGE_TEMPLATES = {
  daily: [
    {
      id: 'daily_login',
      title: 'Login Today',
      description: 'Log in to the platform today',
      target: 1,
      xpReward: 10,
      type: 'daily',
      condition: 'login',
    },
    {
      id: 'daily_1_interview',
      title: 'Complete 1 Interview',
      description: 'Complete 1 interview today',
      target: 1,
      xpReward: 30,
      type: 'daily',
      condition: 'interviews_completed',
    },
    {
      id: 'daily_2_interviews',
      title: 'Complete 2 Interviews',
      description: 'Complete 2 interviews today',
      target: 2,
      xpReward: 50,
      type: 'daily',
      condition: 'interviews_completed',
    },
    {
      id: 'daily_score_80',
      title: 'Score Above 80%',
      description: 'Get a score above 80% in any interview',
      target: 1,
      xpReward: 40,
      type: 'daily',
      condition: 'high_score',
    },
    {
      id: 'daily_coding',
      title: 'Complete One Coding Interview',
      description: 'Complete a coding interview today',
      target: 1,
      xpReward: 45,
      type: 'daily',
      condition: 'coding_interview',
    },
  ],
  weekly: [
    {
      id: 'weekly_10_interviews',
      title: 'Complete 10 Interviews',
      description: 'Complete 10 interviews this week',
      target: 10,
      xpReward: 100,
      type: 'weekly',
      condition: 'interviews_completed',
    },
    {
      id: 'weekly_500_xp',
      title: 'Earn 500 XP',
      description: 'Earn 500 XP this week',
      target: 500,
      xpReward: 75,
      type: 'weekly',
      condition: 'xp_earned',
    },
    {
      id: 'weekly_7_streak',
      title: 'Maintain 7-Day Streak',
      description: 'Maintain a 7-day login streak',
      target: 7,
      xpReward: 80,
      type: 'weekly',
      condition: 'streak',
    },
    {
      id: 'weekly_3_categories',
      title: 'Complete Interviews from 3 Categories',
      description: 'Complete interviews from 3 different categories',
      target: 3,
      xpReward: 90,
      type: 'weekly',
      condition: 'categories',
    },
  ],
  monthly: [
    {
      id: 'monthly_40_interviews',
      title: 'Complete 40 Interviews',
      description: 'Complete 40 interviews this month',
      target: 40,
      xpReward: 200,
      type: 'monthly',
      condition: 'interviews_completed',
    },
    {
      id: 'monthly_level_15',
      title: 'Reach Level 15',
      description: 'Reach level 15 this month',
      target: 15,
      xpReward: 150,
      type: 'monthly',
      condition: 'level',
    },
    {
      id: 'monthly_3000_xp',
      title: 'Earn 3000 XP',
      description: 'Earn 3000 XP this month',
      target: 3000,
      xpReward: 120,
      type: 'monthly',
      condition: 'xp_earned',
    },
    {
      id: 'monthly_5_badges',
      title: 'Unlock 5 Badges',
      description: 'Unlock 5 badges this month',
      target: 5,
      xpReward: 180,
      type: 'monthly',
      condition: 'badges_unlocked',
    },
  ],
};

// Badge unlock conditions
const BADGE_CONDITIONS = [
  {
    id: 'first_interview',
    name: 'First Steps',
    description: 'Complete your first interview',
    icon: '🎯',
    rarity: 'common',
    condition: { type: 'interviews_completed', value: 1 },
  },
  {
    id: 'ten_interviews',
    name: 'Interview Explorer',
    description: 'Complete 10 interviews',
    icon: '🌟',
    rarity: 'common',
    condition: { type: 'interviews_completed', value: 10 },
  },
  {
    id: 'fifty_interviews',
    name: 'Interview Expert',
    description: 'Complete 50 interviews',
    icon: '⭐',
    rarity: 'rare',
    condition: { type: 'interviews_completed', value: 50 },
  },
  {
    id: 'hundred_interviews',
    name: 'Interview Master',
    description: 'Complete 100 interviews',
    icon: '🏆',
    rarity: 'epic',
    condition: { type: 'interviews_completed', value: 100 },
  },
  {
    id: 'seven_streak',
    name: 'Consistency Badge',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'common',
    condition: { type: 'streak', value: 7 },
  },
  {
    id: 'level_20',
    name: 'Senior Candidate',
    description: 'Reach level 20',
    icon: '🎖️',
    rarity: 'rare',
    condition: { type: 'level', value: 20 },
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Get a perfect score in an interview',
    icon: '💯',
    rarity: 'epic',
    condition: { type: 'perfect_score', value: 1 },
  },
];

// Achievement unlock conditions
const ACHIEVEMENT_CONDITIONS = [
  {
    id: 'level_10',
    name: 'Reach Level 10',
    description: 'Reach level 10',
    category: 'levels',
    xpReward: 100,
    condition: { type: 'level', value: 10 },
  },
  {
    id: 'level_20',
    name: 'Reach Level 20',
    description: 'Reach level 20',
    category: 'levels',
    xpReward: 200,
    condition: { type: 'level', value: 20 },
  },
  {
    id: 'xp_5000',
    name: 'Earn 5000 XP',
    description: 'Earn 5000 total XP',
    category: 'xp',
    xpReward: 150,
    condition: { type: 'total_xp', value: 5000 },
  },
  {
    id: 'interviews_100',
    name: 'Complete 100 Interviews',
    description: 'Complete 100 interviews',
    category: 'interviews',
    xpReward: 300,
    condition: { type: 'interviews_completed', value: 100 },
  },
  {
    id: 'thirty_streak',
    name: 'Maintain 30-Day Streak',
    description: 'Maintain a 30-day streak',
    category: 'streaks',
    xpReward: 250,
    condition: { type: 'streak', value: 30 },
  },
];

// Reward unlock conditions
const REWARD_CONDITIONS = [
  {
    id: 'level_10_reward',
    name: 'Career Rank Unlock',
    description: 'Unlock advanced career ranks',
    type: 'unlock',
    condition: { type: 'level', value: 10 },
  },
  {
    id: 'interviews_20_reward',
    name: 'XP Bonus',
    description: 'Get 500 bonus XP',
    type: 'xp',
    value: 500,
    condition: { type: 'interviews_completed', value: 20 },
  },
  {
    id: 'interviews_50_reward',
    name: 'Special Badge',
    description: 'Unlock the Interview Veteran badge',
    type: 'badge',
    badgeId: 'interview_veteran',
    condition: { type: 'interviews_completed', value: 50 },
  },
  {
    id: 'thirty_streak_reward',
    name: 'Legendary Badge',
    description: 'Unlock the Legendary Streak badge',
    type: 'badge',
    badgeId: 'legendary_streak',
    condition: { type: 'streak', value: 30 },
  },
];

/**
 * Main gamification engine function
 * Called whenever a user performs a gamification-related action
 */
async function processGamificationEvent(userId, eventType, eventData = {}) {
  try {
    const gamification = await Gamification.findOne({ user: userId });
    if (!gamification) {
      gamification = await gamificationService.getOrCreateGamification(userId);
    }

    const notifications = [];
    const activityLog = [];

    // Process based on event type
    switch (eventType) {
      case 'login':
        await processLogin(gamification, notifications, activityLog);
        break;
      case 'interview_completed':
        await processInterviewComplete(gamification, eventData, notifications, activityLog);
        break;
      case 'xp_earned':
        await processXPEarned(gamification, eventData, notifications, activityLog);
        break;
      case 'level_up':
        await processLevelUp(gamification, eventData, notifications, activityLog);
        break;
      case 'streak_update':
        await processStreakUpdate(gamification, eventData, notifications, activityLog);
        break;
    }

    // Check automatic unlocks
    await checkBadgeUnlocks(gamification, notifications, activityLog);
    await checkAchievementUnlocks(gamification, notifications, activityLog);
    await checkRewardUnlocks(gamification, notifications, activityLog);
    await updateCareerRank(gamification, notifications, activityLog);

    // Update active challenges
    await updateChallenges(gamification, eventType, eventData, notifications, activityLog);

    // Save all changes
    await gamification.save();

    return {
      success: true,
      notifications,
      activityLog,
      gamification: {
        level: gamification.level,
        xp: gamification.xp,
        totalXP: gamification.totalXP,
        streak: gamification.streak.current,
      },
    };
  } catch (error) {
    console.error('Error processing gamification event:', error);
    throw error;
  }
}

/**
 * Process login event
 */
async function processLogin(gamification, notifications, activityLog) {
  // Update streak
  const streak = gamification.updateStreak();
  
  activityLog.push({
    type: 'login',
    message: 'User logged in',
    timestamp: new Date(),
  });

  if (streak > 1) {
    const bonusXP = Math.floor(5 * streak);
    gamification.addXP(bonusXP);
    notifications.push({
      type: 'xp',
      message: `+${bonusXP} XP for ${streak}-day streak!`,
    });
    activityLog.push({
      type: 'xp_earned',
      message: `Earned ${bonusXP} XP from streak bonus`,
      timestamp: new Date(),
    });
  }
}

/**
 * Process interview completion event
 */
async function processInterviewComplete(gamification, eventData, notifications, activityLog) {
  const { score, interviewType } = eventData;

  // Update stats
  gamification.stats.totalInterviews += 1;
  gamification.stats.interviewsCompleted += 1;

  // Update average score
  const totalScore = gamification.stats.averageScore * (gamification.stats.interviewsCompleted - 1) + score;
  gamification.stats.averageScore = Math.round(totalScore / gamification.stats.interviewsCompleted);

  if (score === 100) {
    gamification.stats.perfectInterviews += 1;
  }

  // Award XP
  const xpReward = gamificationService.calculateInterviewXP(score, interviewType);
  const leveledUp = gamification.addXP(xpReward);

  notifications.push({
    type: 'xp',
    message: `+${xpReward} XP for completing interview`,
  });

  activityLog.push({
    type: 'interview_completed',
    message: `Completed interview with score ${score}%`,
    timestamp: new Date(),
  });

  activityLog.push({
    type: 'xp_earned',
    message: `Earned ${xpReward} XP`,
    timestamp: new Date(),
  });

  if (leveledUp) {
    notifications.push({
      type: 'level_up',
      message: `Level up! You are now level ${gamification.level}`,
    });
    activityLog.push({
      type: 'level_up',
      message: `Reached level ${gamification.level}`,
      timestamp: new Date(),
    });

    // Trigger level up event
    await processGamificationEvent(gamification.user, 'level_up', { level: gamification.level });
  }
}

/**
 * Process XP earned event
 */
async function processXPEarned(gamification, eventData, notifications, activityLog) {
  // XP is already added in the calling function
  // This is just for logging and unlocks
  activityLog.push({
    type: 'xp_earned',
    message: `XP updated`,
    timestamp: new Date(),
  });
}

/**
 * Process level up event
 */
async function processLevelUp(gamification, eventData, notifications, activityLog) {
  const { level } = eventData;
  notifications.push({
    type: 'level_up',
    message: `Congratulations! You reached level ${level}`,
  });
}

/**
 * Process streak update event
 */
async function processStreakUpdate(gamification, eventData, notifications, activityLog) {
  const { streak } = eventData;
  activityLog.push({
    type: 'streak',
    message: `Streak updated to ${streak} days`,
    timestamp: new Date(),
  });
}

/**
 * Check and unlock badges automatically
 */
async function checkBadgeUnlocks(gamification, notifications, activityLog) {
  for (const badgeCondition of BADGE_CONDITIONS) {
    const existingBadge = gamification.badges.find(b => b.id === badgeCondition.id);
    if (existingBadge && existingBadge.unlockedAt) continue;

    let shouldUnlock = false;

    switch (badgeCondition.condition.type) {
      case 'interviews_completed':
        shouldUnlock = gamification.stats.interviewsCompleted >= badgeCondition.condition.value;
        break;
      case 'streak':
        shouldUnlock = gamification.streak.current >= badgeCondition.condition.value;
        break;
      case 'level':
        shouldUnlock = gamification.level >= badgeCondition.condition.value;
        break;
      case 'perfect_score':
        shouldUnlock = gamification.stats.perfectInterviews >= badgeCondition.condition.value;
        break;
    }

    if (shouldUnlock) {
      if (existingBadge) {
        existingBadge.unlockedAt = new Date();
        existingBadge.progress = existingBadge.target;
      } else {
        gamification.badges.push({
          ...badgeCondition,
          progress: badgeCondition.condition.value,
          unlockedAt: new Date(),
        });
      }

      notifications.push({
        type: 'badge',
        message: `Badge unlocked: ${badgeCondition.name}`,
      });

      activityLog.push({
        type: 'badge_unlocked',
        message: `Unlocked badge: ${badgeCondition.name}`,
        timestamp: new Date(),
      });
    }
  }
}

/**
 * Check and unlock achievements automatically
 */
async function checkAchievementUnlocks(gamification, notifications, activityLog) {
  for (const achievementCondition of ACHIEVEMENT_CONDITIONS) {
    const existingAchievement = gamification.achievements.find(a => a.id === achievementCondition.id);
    if (existingAchievement && existingAchievement.unlockedAt) continue;

    let shouldUnlock = false;

    switch (achievementCondition.condition.type) {
      case 'level':
        shouldUnlock = gamification.level >= achievementCondition.condition.value;
        break;
      case 'total_xp':
        shouldUnlock = gamification.totalXP >= achievementCondition.condition.value;
        break;
      case 'interviews_completed':
        shouldUnlock = gamification.stats.interviewsCompleted >= achievementCondition.condition.value;
        break;
      case 'streak':
        shouldUnlock = gamification.streak.longest >= achievementCondition.condition.value;
        break;
    }

    if (shouldUnlock) {
      if (existingAchievement) {
        existingAchievement.unlockedAt = new Date();
        existingAchievement.progress = existingAchievement.target;
      } else {
        gamification.achievements.push({
          ...achievementCondition,
          progress: achievementCondition.condition.value,
          unlockedAt: new Date(),
        });
      }

      // Award XP for achievement
      gamification.addXP(achievementCondition.xpReward);

      notifications.push({
        type: 'achievement',
        message: `Achievement unlocked: ${achievementCondition.name} (+${achievementCondition.xpReward} XP)`,
      });

      activityLog.push({
        type: 'achievement_unlocked',
        message: `Unlocked achievement: ${achievementCondition.name}`,
        timestamp: new Date(),
      });
    }
  }
}

/**
 * Check and unlock rewards automatically
 */
async function checkRewardUnlocks(gamification, notifications, activityLog) {
  for (const rewardCondition of REWARD_CONDITIONS) {
    const existingReward = gamification.rewards?.find(r => r.id === rewardCondition.id);
    if (existingReward && existingReward.unlocked) continue;

    let shouldUnlock = false;

    switch (rewardCondition.condition.type) {
      case 'level':
        shouldUnlock = gamification.level >= rewardCondition.condition.value;
        break;
      case 'interviews_completed':
        shouldUnlock = gamification.stats.interviewsCompleted >= rewardCondition.condition.value;
        break;
      case 'streak':
        shouldUnlock = gamification.streak.longest >= rewardCondition.condition.value;
        break;
    }

    if (shouldUnlock) {
      if (existingReward) {
        existingReward.unlocked = true;
        existingReward.unlockedAt = new Date();
      } else {
        gamification.rewards.push({
          ...rewardCondition,
          unlocked: true,
          unlockedAt: new Date(),
        });
      }

      // Process reward type
      if (rewardCondition.type === 'xp') {
        gamification.addXP(rewardCondition.value);
        notifications.push({
          type: 'reward',
          message: `Reward unlocked: ${rewardCondition.name} (+${rewardCondition.value} XP)`,
        });
      } else if (rewardCondition.type === 'badge') {
        notifications.push({
          type: 'reward',
          message: `Reward unlocked: ${rewardCondition.name}`,
        });
      } else {
        notifications.push({
          type: 'reward',
          message: `Reward unlocked: ${rewardCondition.name}`,
        });
      }

      activityLog.push({
        type: 'reward_unlocked',
        message: `Unlocked reward: ${rewardCondition.name}`,
        timestamp: new Date(),
      });
    }
  }
}

/**
 * Update career rank automatically
 */
async function updateCareerRank(gamification, notifications, activityLog) {
  const careerRanks = [
    { name: 'Intern', minLevel: 1, maxLevel: 5 },
    { name: 'Junior Developer', minLevel: 6, maxLevel: 10 },
    { name: 'Software Engineer', minLevel: 11, maxLevel: 20 },
    { name: 'Senior Developer', minLevel: 21, maxLevel: 30 },
    { name: 'Interview Expert', minLevel: 31, maxLevel: Infinity },
  ];

  const currentRank = careerRanks.find(r => 
    gamification.level >= r.minLevel && gamification.level <= r.maxLevel
  );

  if (currentRank && gamification.careerRank !== currentRank.name) {
    const oldRank = gamification.careerRank;
    gamification.careerRank = currentRank.name;

    notifications.push({
      type: 'rank',
      message: `Career rank updated: ${oldRank} → ${currentRank.name}`,
    });

    activityLog.push({
      type: 'rank_update',
      message: `Career rank updated to ${currentRank.name}`,
      timestamp: new Date(),
    });
  }
}

/**
 * Update challenges based on event
 */
async function updateChallenges(gamification, eventType, eventData, notifications, activityLog) {
  // Ensure user has active challenges
  await ensureActiveChallenges(gamification);

  // Update challenge progress based on event
  gamification.activeChallenges.forEach(challenge => {
    if (challenge.completed) return;

    let progressIncrement = 0;

    switch (eventType) {
      case 'login':
        if (challenge.condition === 'login') {
          progressIncrement = 1;
        }
        break;
      case 'interview_completed':
        if (challenge.condition === 'interviews_completed') {
          progressIncrement = 1;
        } else if (challenge.condition === 'high_score' && eventData.score >= 80) {
          progressIncrement = 1;
        } else if (challenge.condition === 'coding_interview' && eventData.interviewType === 'coding') {
          progressIncrement = 1;
        }
        break;
      case 'xp_earned':
        if (challenge.condition === 'xp_earned') {
          progressIncrement = eventData.amount || 0;
        }
        break;
      case 'level_up':
        if (challenge.condition === 'level') {
          progressIncrement = eventData.level || 0;
        }
        break;
      case 'streak_update':
        if (challenge.condition === 'streak') {
          progressIncrement = eventData.streak || 0;
        }
        break;
    }

    if (progressIncrement > 0) {
      challenge.progress = Math.min(challenge.progress + progressIncrement, challenge.target);

      if (challenge.progress >= challenge.target && !challenge.completed) {
        challenge.completed = true;
        challenge.completedAt = new Date();
        gamification.completedChallenges.push(challenge);
        gamification.stats.challengesCompleted += 1;

        // Award XP for completing challenge
        gamification.addXP(challenge.xpReward);

        notifications.push({
          type: 'challenge',
          message: `Challenge completed: ${challenge.title} (+${challenge.xpReward} XP)`,
        });

        activityLog.push({
          type: 'challenge_completed',
          message: `Completed challenge: ${challenge.title}`,
          timestamp: new Date(),
        });
      }
    }
  });
}

/**
 * Ensure user has active challenges
 */
async function ensureActiveChallenges(gamification) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if we need to generate new daily challenges
  const needsDailyChallenges = !gamification.lastChallengeReset || 
    new Date(gamification.lastChallengeReset) < today;

  if (needsDailyChallenges) {
    // Remove expired daily challenges
    gamification.activeChallenges = gamification.activeChallenges.filter(c => {
      if (c.type === 'daily') {
        const endDate = new Date(c.endDate);
        return endDate >= today;
      }
      return true;
    });

    // Add new daily challenges
    const dailyTemplates = CHALLENGE_TEMPLATES.daily.filter(template => {
      return !gamification.activeChallenges.some(c => c.id === template.id);
    });

    dailyTemplates.forEach(template => {
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 1);

      gamification.activeChallenges.push({
        ...template,
        startDate: today,
        endDate,
        progress: 0,
        completed: false,
      });
    });

    gamification.lastChallengeReset = today;
  }

  // Check weekly challenges (reset on Monday)
  const dayOfWeek = now.getDay();
  const isMonday = dayOfWeek === 1;
  const lastReset = gamification.lastWeeklyReset ? new Date(gamification.lastWeeklyReset) : null;
  const needsWeeklyReset = isMonday && (!lastReset || lastReset < today);

  if (needsWeeklyReset) {
    // Remove expired weekly challenges
    gamification.activeChallenges = gamification.activeChallenges.filter(c => c.type !== 'weekly');

    // Add new weekly challenges
    const weeklyTemplates = CHALLENGE_TEMPLATES.weekly;
    const nextMonday = new Date(today);
    nextMonday.setDate(nextMonday.getDate() + (7 - dayOfWeek + 1) % 7);

    weeklyTemplates.forEach(template => {
      gamification.activeChallenges.push({
        ...template,
        startDate: today,
        endDate: nextMonday,
        progress: 0,
        completed: false,
      });
    });

    gamification.lastWeeklyReset = today;
  }

  // Check monthly challenges (reset on 1st of month)
  const isFirstOfMonth = now.getDate() === 1;
  const lastMonthlyReset = gamification.lastMonthlyReset ? new Date(gamification.lastMonthlyReset) : null;
  const needsMonthlyReset = isFirstOfMonth && (!lastMonthlyReset || lastMonthlyReset < today);

  if (needsMonthlyReset) {
    // Remove expired monthly challenges
    gamification.activeChallenges = gamification.activeChallenges.filter(c => c.type !== 'monthly');

    // Add new monthly challenges
    const monthlyTemplates = CHALLENGE_TEMPLATES.monthly;
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    monthlyTemplates.forEach(template => {
      gamification.activeChallenges.push({
        ...template,
        startDate: today,
        endDate: nextMonth,
        progress: 0,
        completed: false,
      });
    });

    gamification.lastMonthlyReset = today;
  }
}

module.exports = {
  processGamificationEvent,
  CHALLENGE_TEMPLATES,
  BADGE_CONDITIONS,
  ACHIEVEMENT_CONDITIONS,
  REWARD_CONDITIONS,
};
