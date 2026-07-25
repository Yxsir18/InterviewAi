import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';

const RecentInterviews = ({ interviews }) => {
  const navigate = useNavigate();

  if (interviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
        <p className="text-[var(--color-text-muted)]">No interviews yet. Start your first interview!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview, index) => (
        <motion.div
          key={interview._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/dashboard/interview/report/${interview._id}`)}
          className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-[var(--color-text-heading)]">{interview.type}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  interview.difficulty === 'Easy' ? 'bg-[rgba(16,185,129,0.2)] text-[var(--color-success)]' :
                  interview.difficulty === 'Medium' ? 'bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]' :
                  'bg-[rgba(239,68,68,0.2)] text-[var(--color-error)]'
                }`}>
                  {interview.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{interview.length} questions</span>
                </span>
                {interview.report && (
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{interview.report.overallScore}%</span>
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-blue)] transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentInterviews;
