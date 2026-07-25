import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Zap } from 'lucide-react';
import axios from 'axios';

const GamificationBar = () => {
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    fetchGamification();
  }, []);

  const fetchGamification = async () => {
    try {
      const response = await axios.get('/api/gamification/profile');
      setGamification(response.data.data);
    } catch (error) {
      console.error('Error fetching gamification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getXPProgress = () => {
    if (!gamification) return 0;
    return (gamification.xp / gamification.xpToNextLevel) * 100;
  };

  if (loading || !gamification) {
    return null;
  }

  return (
    <div className="bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Level Badge */}
          <motion.div
            className="flex items-center space-x-2 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] px-4 py-2 rounded-full shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-5 h-5 text-[var(--color-text-heading)]" />
            <span className="text-[var(--color-text-heading)] font-semibold text-sm">Level {gamification.level}</span>
          </motion.div>

          {/* XP Progress Bar */}
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <Zap className="w-5 h-5 text-[var(--color-primary-blue)]" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-[var(--color-text-heading)] mb-1 font-medium">
                <span>XP Progress</span>
                <span>{gamification.xp} / {gamification.xpToNextLevel}</span>
              </div>
              <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getXPProgress()}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]"
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          {gamification.streak.current > 0 && (
            <motion.div
              className="flex items-center space-x-2 bg-[rgba(245,158,11,0.2)] px-4 py-2 rounded-full shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Flame className="w-5 h-5 text-[var(--color-warning)]" />
              <span className="text-[var(--color-warning)] font-semibold text-sm">{gamification.streak.current} Day Streak</span>
            </motion.div>
          )}
        </div>

        {/* Total XP */}
        <motion.div
          className="flex items-center space-x-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-4 py-2 rounded-full shadow-sm"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowXP(!showXP)}
        >
          <Trophy className="w-5 h-5 text-[var(--color-primary-blue)]" />
          <span className="text-[var(--color-text-heading)] font-semibold text-sm">{gamification.totalXP} XP</span>
        </motion.div>
      </div>

      {/* XP Popup */}
      {showXP && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-[var(--color-bg-card)] border border-[var(--color-border)] p-4 shadow-lg"
        >
          <div className="max-w-7xl mx-auto">
            <h3 className="text-sm font-semibold text-[var(--color-text-heading)] mb-2">XP Breakdown</h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-[var(--color-text-muted)]">Current XP</div>
                <div className="text-[var(--color-text-heading)] font-semibold">{gamification.xp}</div>
              </div>
              <div>
                <div className="text-[var(--color-text-muted)]">To Next Level</div>
                <div className="text-[var(--color-text-heading)] font-semibold">{gamification.xpToNextLevel}</div>
              </div>
              <div>
                <div className="text-[var(--color-text-muted)]">Total XP</div>
                <div className="text-[var(--color-text-heading)] font-semibold">{gamification.totalXP}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GamificationBar;
