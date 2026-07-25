import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Flame,
  Zap,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Crown,
  Medal,
  Lock,
  Unlock,
  Briefcase,
  Shield,
  Code2,
  Rocket,
  GraduationCap,
  X,
  Menu,
} from 'lucide-react';
import axios from 'axios';
import PremiumCard from '../components/ui/PremiumCard';
import PremiumButton from '../components/ui/PremiumButton';

const Gamification = () => {
  const [view, setView] = useState('overview'); // overview, badges, challenges, leaderboard, rewards
  const [gamification, setGamification] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreetingText] = useState('');
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [careerRanks, setCareerRanks] = useState(null);
  const [performanceInsights, setPerformanceInsights] = useState(null);
  const [personalBests, setPersonalBests] = useState(null);
  const [dailyGoals, setDailyGoals] = useState(null);
  const [badges, setBadges] = useState(null);
  const [challenges, setChallenges] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [badgeSearch, setBadgeSearch] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const previousLevelRef = useRef(null);

  useEffect(() => {
    fetchGamification();
    updateGreeting();
    fetchCareerRanks();
    fetchPerformanceInsights();
    fetchPersonalBests();
    fetchDailyGoals();
  }, [view]);

  useEffect(() => {
    if (view === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [leaderboardType]);

  useEffect(() => {
    if (gamification && previousLevelRef.current !== null) {
      if (gamification.level > previousLevelRef.current) {
        setShowLevelUpModal(true);
      }
    }
    if (gamification) {
      previousLevelRef.current = gamification.level;
    }
  }, [gamification]);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingText('Good Morning');
    else if (hour < 18) setGreetingText('Good Afternoon');
    else setGreetingText('Good Evening');
  };

  const fetchGamification = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/gamification/profile');
      setGamification(response.data.data);
      
      if (view === 'leaderboard') {
        const leaderboardResponse = await axios.get(`/api/gamification/leaderboard?type=${leaderboardType}`);
        setLeaderboard(leaderboardResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching gamification:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareerRanks = async () => {
    try {
      const response = await axios.get('/api/gamification/career-ranks');
      setCareerRanks(response.data.data);
    } catch (error) {
      // Silently fail - will use fallback values
    }
  };

  const fetchPerformanceInsights = async () => {
    try {
      const response = await axios.get('/api/gamification/performance-insights');
      setPerformanceInsights(response.data.data);
    } catch (error) {
      // Silently fail - will use fallback values
    }
  };

  const fetchPersonalBests = async () => {
    try {
      const response = await axios.get('/api/gamification/personal-bests');
      setPersonalBests(response.data.data);
    } catch (error) {
      // Silently fail - will use fallback values
    }
  };

  const fetchDailyGoals = async () => {
    try {
      const response = await axios.get('/api/gamification/daily-goals');
      setDailyGoals(response.data.data);
    } catch (error) {
      // Silently fail - will use fallback values
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await axios.get('/api/gamification/badges');
      setBadges(response.data.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/api/gamification/challenges');
      setChallenges(response.data.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const response = await axios.get('/api/gamification/rewards');
      setRewards(response.data.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const resetAchievements = async () => {
    try {
      await axios.post('/api/gamification/reset-achievements');
      // Refetch gamification data to get updated achievements
      fetchGamification();
    } catch (error) {
      console.error('Error resetting achievements:', error);
    }
  };

  const triggerGamificationEvent = async (eventType, eventData = {}) => {
    try {
      const response = await axios.post('/api/gamification/event', { eventType, eventData });
      // Display notifications
      if (response.data.data.notifications && response.data.data.notifications.length > 0) {
        setNotifications(response.data.data.notifications);
        // Clear notifications after 5 seconds
        setTimeout(() => setNotifications([]), 5000);
      }
      // Refetch gamification data to get updated state
      fetchGamification();
    } catch (error) {
      console.error('Error triggering gamification event:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`/api/gamification/leaderboard?type=${leaderboardType}`);
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getXPProgress = () => {
    if (!gamification) return 0;
    return (gamification.xp / gamification.xpToNextLevel) * 100;
  };

  const getCareerRank = (level) => {
    if (!careerRanks || careerRanks.length === 0) {
      // Fallback to hardcoded values if API fails
      if (level >= 31) return { name: 'Interview Expert', icon: Crown, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-[rgba(59,130,246,0.1)]' };
      if (level >= 21) return { name: 'Senior Developer', icon: Star, color: 'from-green-400 to-emerald-500', bgColor: 'bg-[rgba(16,185,129,0.1)]' };
      if (level >= 11) return { name: 'Software Engineer', icon: Code2, color: 'from-indigo-400 to-violet-500', bgColor: 'bg-[rgba(99,102,241,0.1)]' };
      if (level >= 6) return { name: 'Junior Developer', icon: Briefcase, color: 'from-orange-400 to-red-500', bgColor: 'bg-[rgba(249,115,22,0.1)]' };
      return { name: 'Intern', icon: GraduationCap, color: 'from-gray-400 to-slate-500', bgColor: 'bg-[rgba(148,163,184,0.1)]' };
    }

    // Find the appropriate rank based on level
    const sortedRanks = [...careerRanks].sort((a, b) => b.minLevel - a.minLevel);
    for (const rank of sortedRanks) {
      if (level >= rank.minLevel) {
        const iconMap = {
          'GraduationCap': GraduationCap,
          'Briefcase': Briefcase,
          'Code2': Code2,
          'Star': Star,
          'Crown': Crown,
        };
        const Icon = iconMap[rank.icon] || Star;
        return { 
          name: rank.name, 
          icon: Icon, 
          color: `from-${rank.color}-400 to-${rank.color}-500`, 
          bgColor: `bg-${rank.color}-500/20` 
        };
      }
    }
    return { name: 'Intern', icon: GraduationCap, color: 'from-gray-400 to-slate-500', bgColor: 'bg-[rgba(148,163,184,0.1)]' };
  };

  const getNextRank = (level) => {
    if (!careerRanks || careerRanks.length === 0) {
      // Fallback to hardcoded values if API fails
      if (level < 5) return { name: 'Junior Developer', level: 6 };
      if (level < 10) return { name: 'Software Engineer', level: 11 };
      if (level < 20) return { name: 'Senior Developer', level: 21 };
      if (level < 30) return { name: 'Interview Expert', level: 31 };
      return null;
    }

    // Find the next rank based on level
    const sortedRanks = [...careerRanks].sort((a, b) => a.minLevel - b.minLevel);
    for (const rank of sortedRanks) {
      if (level < rank.minLevel) {
        return { name: rank.name, level: rank.minLevel };
      }
    }
    return null;
  };

  const getXPToNextRank = (level) => {
    const nextRank = getNextRank(level);
    if (!nextRank) return 0;
    return (nextRank.level - level) * gamification.xpToNextLevel;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Loading...</div>
      </div>
    );
  }

  if (!gamification) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">No gamification data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-4 rounded-lg shadow-lg ${
                notification.type === 'level_up' ? 'bg-[rgba(124,58,237,0.9)] text-white' :
                notification.type === 'badge' ? 'bg-[rgba(245,158,11,0.9)] text-white' :
                notification.type === 'achievement' ? 'bg-[rgba(16,185,129,0.9)] text-white' :
                notification.type === 'challenge' ? 'bg-[rgba(37,99,235,0.9)] text-white' :
                notification.type === 'reward' ? 'bg-[rgba(236,72,153,0.9)] text-white' :
                'bg-[var(--color-primary-blue)] text-white'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
            <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">{greeting}, {gamification?.user?.name?.split(' ')[0] || 'User'} 👋</span>
          </h1>
          <p className="text-[var(--color-text-muted)]">Track your career progression, earn rewards, and compete with others</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden mb-4 p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between w-full"
        >
          <span className="text-[var(--color-text-heading)] font-medium">Menu</span>
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-[var(--color-text-heading)]" />
          ) : (
            <Menu className="w-5 h-5 text-[var(--color-text-heading)]" />
          )}
        </button>

        {/* Navigation */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block mb-8`}>
          <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: Trophy },
              { id: 'badges', label: 'Badges', icon: Award },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'leaderboard', label: 'Leaderboard', icon: Crown },
              { id: 'rewards', label: 'Rewards', icon: Unlock },
            ].map((item) => (
              <PremiumButton
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setMobileMenuOpen(false);
                }}
                icon={item.icon}
                variant={view === item.id ? 'primary' : 'outline'}
                className="w-full md:w-auto"
              >
                {item.label}
              </PremiumButton>
            ))}
          </div>
        </div>

        {view === 'overview' && (
          <div className="space-y-6">
            {/* XP Progress Section */}
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">XP Progress</h3>
                <Zap className="w-5 h-5 text-[var(--color-primary-blue)]" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--color-text-muted)]">Level {gamification.level}</span>
                <span className="text-sm text-[var(--color-text-muted)]">{gamification.xp} / {gamification.xpToNextLevel} XP</span>
              </div>
              <div className="w-full h-3 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getXPProgress()}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]"
                />
              </div>
              <div className="mt-4 text-sm text-[var(--color-text-muted)]">
                Total XP: {gamification.totalXP}
              </div>
            </PremiumCard>

            {/* Career Rank Badge */}
            <PremiumCard className="p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${getCareerRank(gamification.level).color} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {(() => {
                          const RankIcon = getCareerRank(gamification.level).icon;
                          return <RankIcon className="w-8 h-8 text-white" />;
                        })()}
                      </div>
                      <div>
                        <div className="text-white/80 text-sm font-medium">Current Rank</div>
                        <div className="text-white text-2xl font-bold">{getCareerRank(gamification.level).name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/80 text-sm">Level</div>
                      <div className="text-white text-3xl font-bold">{gamification.level}</div>
                    </div>
                  </div>
                  
                  {getNextRank(gamification.level) && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between text-white/90 text-sm">
                        <span>Next: {getNextRank(gamification.level).name}</span>
                        <span>{getXPToNextRank(gamification.level)} XP to promotion</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getXPProgress()}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </PremiumCard>

            {/* Stats */}
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Interview Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-[var(--color-text-muted)]">Total Interviews</div>
                  <div className="text-2xl font-bold text-[var(--color-text-heading)]">{gamification.stats.totalInterviews}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--color-text-muted)]">Completed</div>
                  <div className="text-2xl font-bold text-[var(--color-success)]">{gamification.stats.interviewsCompleted}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--color-text-muted)]">Average Score</div>
                  <div className="text-2xl font-bold text-[var(--color-primary-blue)]">{gamification.stats.averageScore}%</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--color-text-muted)]">Perfect Scores</div>
                  <div className="text-2xl font-bold text-[var(--color-warning)]">{gamification.stats.perfectInterviews}</div>
                </div>
              </div>
            </PremiumCard>

            {/* Recent Achievements */}
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Recent Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gamification.achievements.filter(a => a.unlockedAt).slice(-3).map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--color-text-heading)]">{achievement.name}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">+{achievement.xpReward} XP</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>

            {/* AI Performance Insights */}
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">AI Performance Insights</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-heading)] mb-2">Strengths</div>
                  <div className="space-y-2">
                    {performanceInsights?.strengths?.map((strength, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-[var(--color-success)]">
                        <Award className="w-4 h-4" />
                        <span>{strength}</span>
                      </div>
                    )) || (
                      <div className="flex items-center space-x-2 text-sm text-[var(--color-success)]">
                        <Award className="w-4 h-4" />
                        <span>Problem Solving</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-heading)] mb-2">Needs Improvement</div>
                  <div className="space-y-2">
                    {performanceInsights?.weaknesses?.map((weakness, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-[var(--color-warning)]">
                        <Target className="w-4 h-4" />
                        <span>{weakness}</span>
                      </div>
                    )) || (
                      <div className="flex items-center space-x-2 text-sm text-[var(--color-warning)]">
                        <Target className="w-4 h-4" />
                        <span>Communication</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-primary-blue)]/10 border border-[var(--color-primary-blue)]/30">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-[var(--color-primary-blue)] mt-0.5" />
                    <div>
                      <div className="font-medium text-[var(--color-text-heading)] mb-1">Recommendation</div>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {performanceInsights?.recommendation || 'Practice one Behavioral Interview to improve your communication skills.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumCard>

            {/* Daily & Weekly Goals */}
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Today's Goals</h3>
              <div className="space-y-3">
                {dailyGoals?.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      goal.completed
                        ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          goal.completed ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary-blue)]/20'
                        }`}>
                          {goal.completed ? (
                            <Award className="w-4 h-4 text-white" />
                          ) : (
                            <Target className="w-4 h-4 text-[var(--color-primary-blue)]" />
                          )}
                        </div>
                        <div className="font-medium text-[var(--color-text-heading)]">{goal.title}</div>
                      </div>
                      <div className="text-sm text-[var(--color-primary-blue)] font-semibold">+{goal.xpReward} XP</div>
                    </div>
                    {!goal.completed && (
                      <>
                        <div className="w-full h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]"
                          />
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-1">{goal.progress} / {goal.target}</div>
                      </>
                    )}
                  </motion.div>
                )) || [
                  { title: 'Complete 2 interviews', progress: 1, target: 2, xp: 50, completed: false },
                  { title: 'Score above 80%', progress: 1, target: 1, xp: 30, completed: true },
                  { title: 'Complete one coding interview', progress: 0, target: 1, xp: 40, completed: false },
                  { title: 'Maintain login streak', progress: 1, target: 1, xp: 10, completed: true },
                ].map((goal, index) => (
                  <motion.div
                    key={goal.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      goal.completed
                        ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          goal.completed ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary-blue)]/20'
                        }`}>
                          {goal.completed ? (
                            <Award className="w-4 h-4 text-white" />
                          ) : (
                            <Target className="w-4 h-4 text-[var(--color-primary-blue)]" />
                          )}
                        </div>
                        <div className="font-medium text-[var(--color-text-heading)]">{goal.title}</div>
                      </div>
                      <div className="text-sm text-[var(--color-primary-blue)] font-semibold">+{goal.xp} XP</div>
                    </div>
                    {!goal.completed && (
                      <>
                        <div className="w-full h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]"
                          />
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-1">{goal.progress} / {goal.target}</div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </PremiumCard>

            {/* Interview Timeline */}
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Recent Activity</h3>
              <div className="space-y-4">
                {gamification?.recentActivities?.slice(0, 5).map((activity, index) => {
                  const iconMap = {
                    interview: Trophy,
                    badge: Award,
                    level: Star,
                    challenge: Target,
                    certificate: Medal,
                  };
                  const colorMap = {
                    interview: 'text-[var(--color-primary-blue)]',
                    badge: 'text-yellow-400',
                    level: 'text-purple-400',
                    challenge: 'text-green-400',
                    certificate: 'text-orange-400',
                  };
                  const Icon = iconMap[activity.type] || Trophy;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                    >
                      <div className={`w-10 h-10 rounded-full bg-[var(--color-primary-blue)]/20 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colorMap[activity.type] || 'text-[var(--color-primary-blue)]'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--color-text-heading)]">{activity.title}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{activity.time}</div>
                      </div>
                    </motion.div>
                  );
                }) || [
                  { type: 'interview', title: 'Completed React Interview', time: '2 hours ago', icon: Trophy, color: 'text-[var(--color-primary-blue)]' },
                  { type: 'badge', title: 'Unlocked Badge: React Master', time: '5 hours ago', icon: Award, color: 'text-yellow-400' },
                  { type: 'level', title: 'Reached Level 15', time: '1 day ago', icon: Star, color: 'text-purple-400' },
                  { type: 'challenge', title: 'Completed Weekly Challenge', time: '2 days ago', icon: Target, color: 'text-green-400' },
                  { type: 'certificate', title: 'Earned Certificate: JavaScript', time: '3 days ago', icon: Medal, color: 'text-orange-400' },
                ].map((activity, index) => (
                  <motion.div
                    key={activity.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                  >
                    <div className={`w-10 h-10 rounded-full bg-[var(--color-primary-blue)]/20 flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[var(--color-text-heading)]">{activity.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{activity.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>

            {/* Personal Bests */}
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Personal Bests</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {personalBests ? (
                  Object.entries(personalBests).map(([key, value], index) => {
                    const iconMap = {
                      highestScore: Trophy,
                      longestStreak: Flame,
                      totalXPEarned: Zap,
                      favoriteCategory: Code2,
                    };
                    const labelMap = {
                      highestScore: 'Highest Score',
                      longestStreak: 'Longest Streak',
                      totalXPEarned: 'Total XP Earned',
                      favoriteCategory: 'Favorite Category',
                    };
                    const Icon = iconMap[key] || Trophy;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-5 h-5 text-[var(--color-primary-blue)]" />
                          <div className="text-xs text-[var(--color-text-muted)]">{labelMap[key] || key}</div>
                        </div>
                        <div className="text-2xl font-bold text-[var(--color-text-heading)]">{value}</div>
                      </motion.div>
                    );
                  })
                ) : (
                  [
                    { label: 'Highest Score', value: '98%', icon: Trophy },
                    { label: 'Longest Streak', value: '45 days', icon: Flame },
                    { label: 'Total XP Earned', value: '12,450', icon: Zap },
                    { label: 'Favorite Category', value: 'React', icon: Code2 },
                  ].map((record) => (
                    <motion.div
                      key={record.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <record.icon className="w-5 h-5 text-[var(--color-primary-blue)]" />
                        <div className="text-xs text-[var(--color-text-muted)]">{record.label}</div>
                      </div>
                      <div className="text-2xl font-bold text-[var(--color-text-heading)]">{record.value}</div>
                    </motion.div>
                  ))
                )}
              </div>
            </PremiumCard>
          </div>
        )}

        {view === 'badges' && (
          <div className="space-y-6">
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Your Badges</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search badges..."
                    value={badgeSearch}
                    onChange={(e) => setBadgeSearch(e.target.value)}
                    className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                  />
                  <select
                    value={badgeFilter}
                    onChange={(e) => setBadgeFilter(e.target.value)}
                    className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                  >
                    <option value="all">All</option>
                    <option value="unlocked">Unlocked</option>
                    <option value="locked">Locked</option>
                    <option value="common">Common</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {(badges || gamification?.badges || []).filter(badge => {
                  const matchesSearch = badge.name.toLowerCase().includes(badgeSearch.toLowerCase()) ||
                    badge.description.toLowerCase().includes(badgeSearch.toLowerCase());
                  const matchesFilter = badgeFilter === 'all' ||
                    (badgeFilter === 'unlocked' && badge.unlockedAt) ||
                    (badgeFilter === 'locked' && !badge.unlockedAt) ||
                    (badgeFilter === badge.rarity);
                  return matchesSearch && matchesFilter;
                }).map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className={`relative bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-xl p-4 ${
                      badge.unlockedAt ? '' : 'opacity-50 grayscale'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-white font-medium text-sm">{badge.name}</div>
                    <div className="text-white/70 text-xs mt-1">{badge.description}</div>
                    {!badge.unlockedAt && (
                      <div className="absolute top-2 right-2">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {badge.progress > 0 && badge.progress < badge.target && (
                      <div className="mt-2">
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(badge.progress / badge.target) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-white"
                          />
                        </div>
                        <div className="text-xs text-white/70 mt-1">{badge.progress}/{badge.target}</div>
                      </div>
                    )}
                    {badge.unlockedAt && (
                      <div className="text-xs text-white/90 mt-2">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Achievements</h3>
                <button
                  onClick={resetAchievements}
                  className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] hover:bg-[var(--color-border)] transition-colors text-sm"
                >
                  Reset Achievements
                </button>
              </div>
              <div className="space-y-3">
                {(gamification?.achievements || []).map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      achievement.unlockedAt
                        ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        achievement.unlockedAt
                          ? 'bg-[var(--color-success)]'
                          : 'bg-[var(--color-primary-blue)]/20'
                      }`}>
                        <Star className={`w-6 h-6 ${achievement.unlockedAt ? 'text-white' : 'text-[var(--color-primary-blue)]'}`} />
                      </div>
                      <div>
                        <div className="font-medium text-[var(--color-text-heading)]">{achievement.name}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">{achievement.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[var(--color-primary-blue)] font-semibold">+{achievement.xpReward} XP</div>
                      {achievement.unlockedAt && (
                        <div className="text-xs text-[var(--color-success)]">Earned</div>
                      )}
                      {!achievement.unlockedAt && achievement.progress > 0 && (
                        <div className="text-xs text-[var(--color-text-muted)]">{achievement.progress}/{achievement.target}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </PremiumCard>
          </div>
        )}

        {view === 'challenges' && (
          <div className="space-y-6">
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Active Challenges</h3>
              <div className="space-y-4">
                {(challenges?.active || gamification?.activeChallenges || []).map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      challenge.completed
                        ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          challenge.type === 'daily'
                            ? 'bg-[var(--color-primary-blue)]'
                            : challenge.type === 'weekly'
                            ? 'bg-[var(--color-accent-purple)]'
                            : 'bg-[var(--color-warning)]'
                        }`}>
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--color-text-heading)]">{challenge.title}</div>
                          <div className="text-sm text-[var(--color-text-muted)]">{challenge.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[var(--color-primary-blue)] font-semibold">+{challenge.xpReward} XP</div>
                        <div className="text-xs text-[var(--color-text-muted)] capitalize">{challenge.type}</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${
                          challenge.completed
                            ? 'bg-[var(--color-success)]'
                            : 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]'
                        }`}
                      />
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      {challenge.progress} / {challenge.target}
                    </div>
                  </motion.div>
                ))}
                {(!challenges?.active?.length && !gamification?.activeChallenges?.length) && (
                  <div className="text-center text-[var(--color-text-muted)] py-8">
                    No active challenges
                  </div>
                )}
              </div>
            </PremiumCard>

            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Completed Challenges</h3>
              {(!challenges?.completed?.length && !gamification?.completedChallenges?.length) ? (
                <div className="text-center text-[var(--color-text-muted)] py-8">
                  No completed challenges yet
                </div>
              ) : (
                <div className="space-y-3">
                  {(challenges?.completed || gamification?.completedChallenges || []).map((challenge) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-success)] flex items-center justify-center">
                          <Medal className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--color-text-heading)]">{challenge.title}</div>
                          <div className="text-sm text-[var(--color-text-muted)]">
                            Completed on {new Date(challenge.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-[var(--color-success)] font-semibold">+{challenge.xpReward} XP</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </PremiumCard>
          </div>
        )}

        {view === 'leaderboard' && (
          <div className="space-y-6">
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Leaderboard</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLeaderboardType('global')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      leaderboardType === 'global'
                        ? 'bg-[var(--color-primary-blue)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-heading)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setLeaderboardType('weekly')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      leaderboardType === 'weekly'
                        ? 'bg-[var(--color-primary-blue)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-heading)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setLeaderboardType('monthly')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      leaderboardType === 'monthly'
                        ? 'bg-[var(--color-primary-blue)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-heading)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        entry.rank === 1
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                          : entry.rank === 2
                          ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30'
                          : entry.rank === 3
                          ? 'bg-gradient-to-r from-orange-700/20 to-orange-800/20 border border-orange-700/30'
                          : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1
                            ? 'bg-[var(--color-warning)] text-white'
                            : entry.rank === 2
                            ? 'bg-[rgba(156,163,175,0.8)] text-white'
                            : entry.rank === 3
                            ? 'bg-[rgba(194,65,12,0.8)] text-white'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                        }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <div className="font-medium text-[var(--color-text-heading)]">{entry.user?.name || 'User'}</div>
                          <div className="text-sm text-[var(--color-text-muted)]">Level {entry.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[var(--color-primary-blue)] font-semibold">{entry.totalXP} XP</div>
                        <div className="text-xs text-[var(--color-text-muted)]">Rank #{entry.rank}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[var(--color-text-muted)] py-8">
                  No leaderboard data available
                </div>
              )}
            </PremiumCard>
          </div>
        )}

        {view === 'rewards' && (
          <div className="space-y-6">
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-heading)]">Available Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(rewards || gamification?.rewards || []).map((reward) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl border ${
                      reward.unlocked
                        ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl">
                        {reward.unlocked ? <Unlock className="w-6 h-6 text-[var(--color-success)]" /> : <Lock className="w-6 h-6 text-[var(--color-text-muted)]" />}
                      </div>
                      {reward.unlocked && (
                        <div className="text-xs text-[var(--color-success)] font-semibold">UNLOCKED</div>
                      )}
                    </div>
                    <div className="font-medium text-[var(--color-text-heading)]">{reward.name}</div>
                    <div className="text-sm text-[var(--color-text-muted)] mt-1">{reward.description}</div>
                    <div className="text-xs text-[var(--color-text-muted)] capitalize mt-2">{reward.type}</div>
                    {!reward.unlocked && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                        {reward.requiredLevel && (
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Required Level: {reward.requiredLevel}
                          </div>
                        )}
                        {reward.requiredXP && (
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Required XP: {reward.requiredXP}
                          </div>
                        )}
                        {reward.requiredBadge && (
                          <div className="text-xs text-[var(--color-text-muted)]">
                            Required Badge: {reward.requiredBadge}
                          </div>
                        )}
                      </div>
                    )}
                    {reward.unlocked && reward.unlockedAt && (
                      <div className="text-xs text-[var(--color-success)] mt-2">
                        Unlocked {new Date(reward.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              {(!rewards?.length && !gamification?.rewards?.length) && (
                <div className="text-center text-[var(--color-text-muted)] py-8">
                  No rewards available
                </div>
              )}
            </PremiumCard>
          </div>
        )}
      </div>

      {/* Level-Up Celebration Modal */}
      {showLevelUpModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLevelUpModal(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLevelUpModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center"
              >
                <Crown className="w-12 h-12 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">🎉 Level Up!</h2>
                <div className="text-5xl font-bold text-[var(--color-primary-blue)] mb-2">{gamification?.level || 1}</div>
                <div className="text-lg text-[var(--color-text-muted)] mb-4">
                  {getCareerRank(gamification?.level || 1).name}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  +{gamification?.xpToNextLevel || 100} XP Earned
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <PremiumButton
                  onClick={() => setShowLevelUpModal(false)}
                  variant="primary"
                  className="w-full"
                >
                  Continue
                </PremiumButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Gamification;
