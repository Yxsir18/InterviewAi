const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  unlockedAt: { type: Date },
  progress: { type: Number, default: 0 }, // 0-100
  target: { type: Number, required: true },
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['interviews', 'streaks', 'challenges', 'special'], required: true },
  xpReward: { type: Number, required: true },
  unlockedAt: { type: Date },
  progress: { type: Number, default: 0 },
  target: { type: Number, required: true },
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'monthly', 'event'], required: true },
  xpReward: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  progress: { type: Number, default: 0 },
  target: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  condition: { type: String }, // For automated progress tracking
}, { _id: false });

const rewardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['xp_boost', 'badge', 'theme', 'avatar', 'premium_time', 'unlock'], required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date },
  requiredLevel: { type: Number },
  requiredXP: { type: Number },
  requiredBadge: { type: String },
}, { _id: false });

const gamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  xpToNextLevel: {
    type: Number,
    default: 100,
  },
  totalXP: {
    type: Number,
    default: 0,
  },
  careerRank: {
    type: String,
    default: 'Intern',
  },
  badges: [badgeSchema],
  achievements: [achievementSchema],
  activeChallenges: [challengeSchema],
  completedChallenges: [challengeSchema],
  rewards: [rewardSchema],
  streak:({
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    lastStreakDate: { type: Date },
  }),
  leaderboard: {
    globalRank: { type: Number, default: 0 },
    weeklyRank: { type: Number, default: 0 },
    monthlyRank: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  stats: {
    totalInterviews: { type: Number, default: 0 },
    interviewsCompleted: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    perfectInterviews: { type: Number, default: 0 },
    challengesCompleted: { type: Number, default: 0 },
  },
  // Automated system fields
  lastChallengeReset: { type: Date },
  lastWeeklyReset: { type: Date },
  lastMonthlyReset: { type: Date },
  activityLog: [{
    type: { type: String },
    message: { type: String },
    timestamp: { type: Date },
  }],
}, {
  timestamps: true,
});

// Calculate XP needed for next level
gamificationSchema.methods.calculateXPForLevel = function(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Check if user can level up
gamificationSchema.methods.canLevelUp = function() {
  return this.xp >= this.xpToNextLevel;
};

// Level up user
gamificationSchema.methods.levelUp = function() {
  if (this.canLevelUp()) {
    this.xp -= this.xpToNextLevel;
    this.level += 1;
    this.xpToNextLevel = this.calculateXPForLevel(this.level);
    return true;
  }
  return false;
};

// Add XP
gamificationSchema.methods.addXP = function(amount) {
  this.xp += amount;
  this.totalXP += amount;
  return this.levelUp();
};

// Update streak
gamificationSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = this.streak.lastActiveDate 
    ? new Date(this.streak.lastActiveDate).setHours(0, 0, 0, 0)
    : null;
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActive === yesterday.getTime()) {
    this.streak.current += 1;
    this.streak.longest = Math.max(this.streak.longest, this.streak.current);
  } else if (lastActive !== today.getTime()) {
    this.streak.current = 1;
  }
  
  this.streak.lastActiveDate = today;
  return this.streak.current;
};

const Gamification = mongoose.model('Gamification', gamificationSchema);

// Separate collection for global challenges
const globalChallengeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  xpReward: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  target: { type: Number, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Separate collection for global rewards
const globalRewardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['xp_boost', 'badge', 'theme', 'avatar', 'premium_time'], required: true },
  value: { type: mongoose.Schema.Types.Mixed },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const GlobalChallenge = mongoose.model('GlobalChallenge', globalChallengeSchema);
const GlobalReward = mongoose.model('GlobalReward', globalRewardSchema);

module.exports = Gamification;
module.exports.GlobalChallenge = GlobalChallenge;
module.exports.GlobalReward = GlobalReward;
