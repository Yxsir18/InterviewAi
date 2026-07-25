const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'blue',
  loading = false,
}) => {
  const iconColors = {
    blue: 'text-[var(--color-primary-blue)] bg-[rgba(37,99,235,0.1)]',
    green: 'text-[var(--color-success)] bg-[rgba(16,185,129,0.1)]',
    red: 'text-[var(--color-error)] bg-[rgba(239,68,68,0.1)]',
    yellow: 'text-[var(--color-warning)] bg-[rgba(245,158,11,0.1)]',
    purple: 'text-[var(--color-accent-purple)] bg-[rgba(124,58,237,0.1)]',
    cyan: 'text-[var(--color-secondary-cyan)] bg-[rgba(6,182,212,0.1)]',
  };

  const changeColors = {
    positive: 'text-[var(--color-success)]',
    negative: 'text-[var(--color-error)]',
    neutral: 'text-[var(--color-text-muted)]',
  };

  if (loading) {
    return (
      <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)]" />
            <div className="w-16 h-4 rounded bg-[var(--color-surface)]" />
          </div>
          <div className="h-8 w-24 rounded bg-[var(--color-surface)]" />
          <div className="h-4 w-20 rounded bg-[var(--color-surface)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-hover)] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconColors[iconColor] || iconColors.blue}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {change && (
          <span className={`text-sm font-medium ${changeColors[changeType]}`}>
            {changeType === 'positive' && '+'}
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-1">{value}</h3>
      <p className="text-[var(--color-text-muted)] text-sm">{title}</p>
    </div>
  );
};

export default StatCard;
