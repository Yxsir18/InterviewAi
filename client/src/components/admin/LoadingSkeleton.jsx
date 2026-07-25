const LoadingSkeleton = ({ type = 'table', rows = 5 }) => {
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--color-surface)] rounded w-1/4 animate-pulse" />
              <div className="h-3 bg-[var(--color-surface)] rounded w-1/6 animate-pulse" />
            </div>
            <div className="w-20 h-8 bg-[var(--color-surface)] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
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

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--color-surface)] rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-[var(--color-surface)] rounded w-1/4 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-[var(--color-surface)] rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-[var(--color-surface)] rounded w-1/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
