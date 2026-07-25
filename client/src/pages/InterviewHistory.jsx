import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInterviewHistory, retakeInterview } from '../redux/slices/interviewSlice';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  TrendingUp,
  Play,
  Filter,
  Search,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviewHistory, loading } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(getInterviewHistory());
  }, [dispatch]);

  const handleRetake = async (interviewId) => {
    try {
      await dispatch(retakeInterview(interviewId)).unwrap();
      toast.success('Starting new interview...');
      // Navigate will happen after the interview is created
    } catch (error) {
      toast.error(error || 'Failed to retake interview');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]';
      case 'in_progress':
        return 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]';
      case 'abandoned':
        return 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]';
      default:
        return 'bg-[rgba(148,163,184,0.1)] text-[var(--color-text-muted)]';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]';
      case 'Medium':
        return 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]';
      case 'Hard':
        return 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]';
      default:
        return 'bg-[rgba(148,163,184,0.1)] text-[var(--color-text-muted)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Interview History</h1>
          <p className="text-[var(--color-text-muted)]">View all your past interviews and performance</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/interview/generator')}
          className="glass-button flex items-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>New Interview</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search interviews..."
              className="glass-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-[var(--color-text-muted)]" />
            <select className="glass-input">
              <option value="">All Types</option>
              <option value="MERN Stack">MERN Stack</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="JavaScript">JavaScript</option>
            </select>
            <select className="glass-input">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Interview List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : interviewHistory.length === 0 ? (
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
            <Clock className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-heading)]">No interviews yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6">Start your first interview to see your history here</p>
            <button
              onClick={() => navigate('/dashboard/interview/generator')}
              className="glass-button"
            >
              Start Interview
            </button>
          </div>
        ) : (
          interviewHistory.map((interview, index) => (
            <motion.div
              key={interview._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary-blue)]/30 transition-all cursor-pointer"
              onClick={() => navigate(`/dashboard/interview/report/${interview._id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--color-text-body)]">{interview.type}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(interview.difficulty)}`}>
                      {interview.difficulty}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(interview.createdAt)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{interview.length} questions</span>
                    </span>
                    {interview.totalTime && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(interview.totalTime / 60)} min</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {interview.report && (
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-[var(--color-primary-blue)]" />
                        <span className="text-2xl font-bold">{interview.report.overallScore}%</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">Score</p>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetake(interview._id);
                    }}
                    className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                    title="Retake Interview"
                  >
                    <Play className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                  <ArrowRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default InterviewHistory;
