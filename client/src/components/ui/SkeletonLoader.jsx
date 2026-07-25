import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse w-3/4" />
          <div className="h-3 bg-[var(--color-surface)] rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[var(--color-surface)] rounded animate-pulse" />
        <div className="h-3 bg-[var(--color-surface)] rounded animate-pulse w-5/6" />
        <div className="h-3 bg-[var(--color-surface)] rounded animate-pulse w-4/6" />
      </div>
    </div>
  );
};

const SkeletonStats = () => {
  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-surface)] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-[var(--color-surface)] rounded animate-pulse w-1/3" />
          <div className="h-6 bg-[var(--color-surface)] rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
};

const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="h-6 bg-[var(--color-surface)] rounded animate-pulse w-1/4" />
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-4 space-y-2">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse w-1/4" />
              <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse w-1/3" />
              <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse w-1/6" />
              <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse w-1/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkeletonList = ({ items = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl">
          <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--color-surface)] rounded animate-pulse w-1/3" />
            <div className="h-3 bg-[var(--color-surface)] rounded animate-pulse w-1/2" />
          </div>
          <div className="h-8 w-20 bg-[var(--color-surface)] rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />;
      case 'stats':
        return <SkeletonStats />;
      case 'table':
        return <SkeletonTable rows={count} />;
      case 'list':
        return <SkeletonList items={count} />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;
export { SkeletonCard, SkeletonStats, SkeletonTable, SkeletonList };
