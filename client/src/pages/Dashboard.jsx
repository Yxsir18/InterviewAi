import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  Play,
  BarChart3,
  Code,
  Sparkles,
} from 'lucide-react';
import { getInterviewHistory } from '../redux/slices/interviewSlice';
import { getProfile } from '../redux/slices/profileSlice';
import PremiumCard, { StatCard } from '../components/ui/PremiumCard';
import WeeklyProgressChart from '../components/WeeklyProgressChart';
import RecentInterviews from '../components/RecentInterviews';
import SkillAnalysis from '../components/SkillAnalysis';
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { interviewHistory } = useSelector((state) => state.interview);
  const { profile } = useSelector((state) => state.profile);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    dispatch(getInterviewHistory({ limit: 5 }));
    dispatch(getProfile());
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/user');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-[var(--color-surface)] rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-[var(--color-surface)] rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 text-center">
        <p className="text-[var(--color-text-muted)]">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const { overview, recentInterviews, upcomingInterviews, performanceByType, resumeData, certificates } = dashboardData || {};

  const skills = profile?.skills || [];
  const strongestSkill = skills.length > 0 ? skills[0] : 'N/A';
  const weakestSkill = skills.length > 1 ? skills[skills.length - 1] : 'N/A';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[var(--color-primary-blue)]/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
            Welcome back, <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)]">
            Ready to ace your next interview? Let's continue your preparation journey.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            label="Total Interviews"
            value={overview?.totalInterviews || 0}
            icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="primary"
            trend={`${overview?.pendingInterviews || 0} pending`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            label="Average Score"
            value={`${overview?.averageScore || 0}%`}
            icon={<Award className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="success"
            trend={`Highest: ${overview?.highestScore || 0}%`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            label="Completed"
            value={overview?.completedInterviews || 0}
            icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="primary"
            trend="Keep it up!"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            label="Certificates"
            value={overview?.totalCertificates || 0}
            icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="primary"
            trend={`${overview?.resumeAnalyses || 0} resume analyses`}
          />
        </motion.div>
      </div>

      {/* Charts and Recent Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-heading)]">Weekly Progress</h2>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)]" />
          </div>
          <WeeklyProgressChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-heading)]">Skill Analysis</h2>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)]" />
          </div>
          <SkillAnalysis skills={skills} />
        </motion.div>
      </div>

      {/* Recent Interviews & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-heading)]">Recent Interviews</h2>
            <button
              onClick={() => navigate('/interview/history')}
              className="text-sm text-[var(--color-primary-blue)] hover:text-[var(--color-secondary-cyan)] transition-colors"
            >
              View All
            </button>
          </div>
          <RecentInterviews interviews={recentInterviews?.slice(0, 3) || []} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-heading)] mb-4 sm:mb-6">Quick Actions</h2>
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => navigate('/dashboard/interview/generator')}
              className="w-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white font-medium px-4 sm:px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Start New Interview</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/interview/coding/generator')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[var(--color-hover)] border border-[var(--color-primary-blue)]/30 text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)]/20 transition-colors min-h-[44px]"
            >
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Start Coding Interview</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/resume/upload')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-heading)] hover:bg-[var(--color-bg-card)] transition-colors min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Upload Resume</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-heading)] hover:bg-[var(--color-bg-card)] transition-colors min-h-[44px]"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">View Analytics</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/bookmarks')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-heading)] hover:bg-[var(--color-bg-card)] transition-colors min-h-[44px]"
            >
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Review Bookmarks</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Improvement Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-[var(--color-text-heading)]">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 transition-colors cursor-pointer">
            <h3 className="font-medium mb-2 text-sm sm:text-base text-[var(--color-text-body)]">Practice React Hooks</h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-3">Focus on useEffect and custom hooks</p>
            <div className="flex items-center text-[var(--color-primary-blue)] text-xs sm:text-sm">
              <span>Start Practice</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 transition-colors cursor-pointer">
            <h3 className="font-medium mb-2 text-sm sm:text-base text-[var(--color-text-body)]">System Design Basics</h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-3">Learn scalability patterns</p>
            <div className="flex items-center text-[var(--color-primary-blue)] text-xs sm:text-sm">
              <span>Start Learning</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 transition-colors cursor-pointer">
            <h3 className="font-medium mb-2 text-sm sm:text-base text-[var(--color-text-body)]">Database Optimization</h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-3">Indexing and query optimization</p>
            <div className="flex items-center text-[var(--color-primary-blue)] text-xs sm:text-sm">
              <span>Start Learning</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
