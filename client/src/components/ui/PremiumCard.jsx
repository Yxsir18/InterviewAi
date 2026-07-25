import { motion } from 'framer-motion';

const PremiumCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-lg)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 shadow-[var(--shadow-md)] ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StatCard = ({ icon, value, label, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-[var(--color-primary-blue)]',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    danger: 'text-[var(--color-error)]',
  };

  return (
    <PremiumCard>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
          <p className="text-2xl font-bold text-[var(--color-text-heading)]">{value}</p>
          {trend && (
            <p className="text-xs text-[var(--color-text-muted)] mt-2">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-[var(--color-hover)] ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </PremiumCard>
  );
};

export const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <PremiumCard hover={true} onClick={onClick} className="cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-lg bg-[var(--color-hover)] text-[var(--color-primary-blue)]">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2">{title}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
    </PremiumCard>
  );
};

export const ProgressCard = ({ title, progress, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]',
    success: 'from-[var(--color-success)] to-green-400',
    warning: 'from-[var(--color-warning)] to-yellow-400',
    danger: 'from-[var(--color-error)] to-red-400',
  };

  return (
    <PremiumCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[var(--color-text-heading)]">{title}</h3>
        <span className="text-sm text-[var(--color-text-muted)]">{progress}%</span>
      </div>
      <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
        />
      </div>
    </PremiumCard>
  );
};

export default PremiumCard;
