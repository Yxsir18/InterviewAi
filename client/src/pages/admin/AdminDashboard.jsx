import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  Clock,
  BarChart3,
  Cpu,
  Zap,
  Award,
  DollarSign,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/admin/StatCard';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import ErrorState from '../../components/admin/ErrorState';
import axios from 'axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/admin');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
        title="Failed to load dashboard"
        description={error}
        onRetry={fetchDashboardData}
      />
    );
  }

  const { overview, interviewStats, gamificationStats, topUsers, recentUsers, recentInterviews, recentCertificates, charts } = dashboardData || {};

  const displayStats = overview || {
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    scheduledInterviews: 0,
    aiQuestionsGenerated: 0,
    certificatesIssued: 0,
    resumeAnalyses: 0
  };

  const recentActivity = [
    ...(recentUsers?.map(u => ({ type: 'user', message: `New user registered: ${u.name}`, time: 'Just now' })) || []),
    ...(recentInterviews?.map(i => ({ type: 'interview', message: `Interview completed: ${i.title}`, time: 'Recently' })) || []),
    ...(recentCertificates?.map(c => ({ type: 'certificate', message: `Certificate issued: ${c.interviewType} - ${c.score}%`, time: 'Recently' })) || [])
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of platform performance and metrics"
        breadcrumbs={['Dashboard']}
        showRefresh
        onRefresh={fetchDashboardData}
      />

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Users"
            value={displayStats.totalUsers.toLocaleString()}
            change={`+${displayStats.newUsers} this month`}
            changeType="positive"
            icon={Users}
            iconColor="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Users"
            value={displayStats.activeUsers.toLocaleString()}
            change="Last 30 days"
            changeType="neutral"
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
            title="Total Interviews"
            value={displayStats.totalInterviews.toLocaleString()}
            change={`${displayStats.completedInterviews} completed`}
            changeType="positive"
            icon={FileText}
            iconColor="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Scheduled Interviews"
            value={displayStats.scheduledInterviews.toLocaleString()}
            change="Upcoming"
            changeType="neutral"
            icon={Clock}
            iconColor="green"
          />
        </motion.div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <StatCard
            title="Avg Interview Score"
            value={`${interviewStats?.averageScore?.toFixed(1) || 0}%`}
            change={`Completion: ${(interviewStats?.completionRate * 100 || 0).toFixed(0)}%`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <StatCard
            title="AI Questions Generated"
            value={displayStats.aiQuestionsGenerated.toLocaleString()}
            change="Total generated"
            changeType="neutral"
            icon={Cpu}
            iconColor="yellow"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <StatCard
            title="Resume Analyses"
            value={displayStats.resumeAnalyses.toLocaleString()}
            change="Total analyses"
            changeType="neutral"
            icon={DollarSign}
            iconColor="green"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <StatCard
            title="Certificates Issued"
            value={displayStats.certificatesIssued.toLocaleString()}
            change="Total issued"
            changeType="neutral"
            icon={Award}
            iconColor="blue"
          />
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="lg:col-span-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">User Growth</h3>
            <span className="text-sm text-[var(--color-text-muted)]">Last 30 days</span>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {charts?.userGrowth?.length > 0 ? (
              charts.userGrowth.map((item, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[var(--color-primary-blue)] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.min(100, (item.count / 50) * 100)}%` }}
                  title={`${item.count} users`}
                />
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
                No data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Interview Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Interview Trends</h3>
            <BarChart3 className="w-5 h-5 text-[var(--color-text-muted)]" />
          </div>
          <div className="space-y-4">
            {charts?.interviewsByType?.length > 0 ? (
              charts.interviewsByType.map((item, index) => {
                const total = charts.interviewsByType.reduce((sum, i) => sum + i.count, 0);
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                const colors = [
                  'var(--color-primary-blue)',
                  'var(--color-accent-purple)',
                  'var(--color-success)',
                  'var(--color-warning)'
                ];
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--color-text-muted)]">{item._id || 'Unknown'}</span>
                      <span className="text-[var(--color-text-heading)]">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: colors[index % colors.length] }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center text-[var(--color-text-muted)] py-8">
                No data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Interview Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Interview Trends</h3>
          <Zap className="w-5 h-5 text-[var(--color-warning)]" />
        </div>
        <div className="h-48 flex items-end space-x-2">
          {charts?.interviewTrends?.length > 0 ? (
            charts.interviewTrends.map((item, i) => (
              <div
                key={i}
                className="flex-1 bg-[var(--color-warning)] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${Math.min(100, (item.count / 100) * 100)}%` }}
                title={`${item.count} interviews`}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
              No data available
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-[var(--color-text-muted)]">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-6">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={activity.id || index} className="flex items-center space-x-4 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors">
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                activity.type === 'user' ? 'bg-[rgba(37,99,235,0.1)]' :
                activity.type === 'interview' ? 'bg-[rgba(16,185,129,0.1)]' :
                'bg-[rgba(245,158,11,0.1)]'
              }`}>
                {activity.type === 'user' && <Users className="w-5 h-5 text-[var(--color-primary-blue)]" />}
                {activity.type === 'interview' && <FileText className="w-5 h-5 text-[var(--color-success)]" />}
                {activity.type === 'certificate' && <Award className="w-5 h-5 text-[var(--color-warning)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--color-text-heading)] text-sm truncate">{activity.message}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
