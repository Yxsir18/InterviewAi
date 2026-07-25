import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  FileText,
  Cpu,
  DollarSign,
  Activity,
  RefreshCw,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/admin/StatCard';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import ErrorState from '../../components/admin/ErrorState';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('week');
  const [chartType, setChartType] = useState('daily');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/admin/analytics?period=${period}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const dailyInterviewsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Interviews',
        data: analytics?.dailyInterviews?.map(d => d.count) || [45, 52, 38, 65, 48, 55, 42],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const typeDistributionData = {
    labels: analytics?.typeDistribution?.map(d => d._id) || ['MERN Stack', 'React', 'Node.js', 'JavaScript', 'Python', 'Java'],
    datasets: [
      {
        data: analytics?.typeDistribution?.map(d => d.count) || [35, 25, 20, 30, 15, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const difficultyDistributionData = {
    labels: analytics?.difficultyDistribution?.map(d => d._id) || ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: analytics?.difficultyDistribution?.map(d => d.count) || [40, 45, 15],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const userGrowthData = {
    labels: analytics?.userGrowth?.map(d => d._id) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: analytics?.userGrowth?.map(d => d.count) || [120, 190, 150, 220, 180, 250],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [4500, 5200, 4800, 6100, 5800, 7200],
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const aiUsageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'AI Requests',
        data: [1200, 1500, 1100, 1800, 1400, 900, 800],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
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
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94A3B8',
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
          color: '#94A3B8',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} type="card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load analytics"
        description={error}
        onRetry={fetchAnalytics}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Analytics"
        description="Platform performance metrics and insights"
        breadcrumbs={['Dashboard', 'Analytics']}
        showRefresh
        onRefresh={fetchAnalytics}
        secondaryActions={[
          { icon: Download, label: 'Export Report', onClick: () => console.log('Export clicked') },
        ]}
      />

      {/* Period Selector */}
      <div className="flex items-center space-x-2">
        {['today', 'week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === p
                ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)]'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Interviews"
            value={analytics?.totalInterviews?.toLocaleString() || '0'}
            change={typeof analytics?.interviewGrowth === 'string' ? analytics?.interviewGrowth : '+0%'}
            changeType={typeof analytics?.interviewGrowth === 'string' && analytics?.interviewGrowth?.includes('+') ? 'positive' : 'negative'}
            icon={FileText}
            iconColor="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Completion Rate"
            value={`${analytics?.completionRate?.toFixed(0) || 0}%`}
            change={typeof analytics?.completionChange === 'string' ? analytics?.completionChange : '+0%'}
            changeType={typeof analytics?.completionChange === 'string' && analytics?.completionChange?.includes('+') ? 'positive' : 'negative'}
            icon={Activity}
            iconColor="green"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Average Score"
            value={`${analytics?.averageScore?.toFixed(1) || 0}%`}
            change={typeof analytics?.scoreChange === 'string' ? analytics?.scoreChange : '+0%'}
            changeType={typeof analytics?.scoreChange === 'string' && analytics?.scoreChange?.includes('+') ? 'positive' : 'negative'}
            icon={TrendingUp}
            iconColor="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Active Users"
            value={analytics?.activeUsers?.toLocaleString() || '0'}
            change={typeof analytics?.userGrowth === 'string' ? analytics?.userGrowth : '+0%'}
            changeType={typeof analytics?.userGrowth === 'string' && analytics?.userGrowth?.includes('+') ? 'positive' : 'negative'}
            icon={Users}
            iconColor="green"
          />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Daily Interviews</h3>
          <Line data={dailyInterviewsData} options={chartOptions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">User Growth</h3>
          <Line data={userGrowthData} options={chartOptions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Interview Types</h3>
          <Bar data={typeDistributionData} options={chartOptions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-4">Difficulty Distribution</h3>
          <Doughnut data={difficultyDistributionData} options={doughnutOptions} />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
