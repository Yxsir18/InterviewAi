import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInterviewHistory } from '../redux/slices/interviewSlice';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import PremiumCard from '../components/ui/PremiumCard';
import { StatCard } from '../components/ui/PremiumCard';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const dispatch = useDispatch();
  const { interviewHistory } = useSelector((state) => state.interview);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(getInterviewHistory());
  }, [dispatch]);

  const completedInterviews = interviewHistory?.filter(i => i.status === 'completed') || [];
  const totalInterviews = interviewHistory?.length || 0;
  const averageScore = completedInterviews.length > 0
    ? Math.round(
        completedInterviews
          .filter(i => i.report)
          .reduce((sum, i) => sum + (i.report?.overallScore || 0), 0) / completedInterviews.length
      )
    : 0;

  // Interview type distribution
  const typeDistribution = interviewHistory?.reduce((acc, interview) => {
    acc[interview.type] = (acc[interview.type] || 0) + 1;
    return acc;
  }, {}) || {};

  // Difficulty distribution
  const difficultyDistribution = interviewHistory?.reduce((acc, interview) => {
    acc[interview.difficulty] = (acc[interview.difficulty] || 0) + 1;
    return acc;
  }, {}) || {};

  const typeChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        label: 'Interviews',
        data: Object.values(typeDistribution),
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const difficultyChartData = {
    labels: Object.keys(difficultyDistribution),
    datasets: [
      {
        label: 'Interviews',
        data: Object.values(difficultyDistribution),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#fff' : '#020617',
        bodyColor: isDark ? '#fff' : '#020617',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#64748b',
        },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#64748b',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#9ca3af' : '#64748b',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#fff' : '#020617',
        bodyColor: isDark ? '#fff' : '#020617',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
          <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">Track your interview performance and progress</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BarChart3}
          value={totalInterviews}
          label="Total Interviews"
          color="primary"
        />

        <StatCard
          icon={TrendingUp}
          value={`${averageScore}%`}
          label="Average Score"
          color="success"
        />

        <StatCard
          icon={Target}
          value={completedInterviews.length}
          label="Completed"
          color="primary"
        />

        <StatCard
          icon={Award}
          value={`${totalInterviews > 0 ? Math.round((completedInterviews.length / totalInterviews) * 100) : 0}%`}
          label="Completion Rate"
          color="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PremiumCard className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Interviews by Type</h3>
            <div className="h-64">
              {Object.keys(typeDistribution).length > 0 ? (
                <Bar data={typeChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                  No data available
                </div>
              )}
            </div>
          </PremiumCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <PremiumCard className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Difficulty Distribution</h3>
            <div className="h-64">
              {Object.keys(difficultyDistribution).length > 0 ? (
                <Doughnut data={difficultyChartData} options={doughnutOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
                  No data available
                </div>
              )}
            </div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Recent Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <PremiumCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Recent Performance</h3>
          <div className="space-y-4">
            {completedInterviews.slice(0, 5).map((interview, index) => (
              <div key={interview._id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-[var(--color-primary-blue)]/20">
                    <Calendar className="w-5 h-5 text-[var(--color-primary-blue)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">{interview.type}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{new Date(interview.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-[var(--color-text-heading)]">{interview.report?.overallScore || 0}%</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Score</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--color-text-heading)]">{interview.length}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Questions</p>
                  </div>
                </div>
              </div>
            ))}
            {completedInterviews.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-muted)]">
                No completed interviews yet
              </div>
            )}
          </div>
        </PremiumCard>
      </motion.div>
    </div>
  );
};

export default Analytics;
