const EmptyState = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  primaryActionLabel,
  onPrimaryAction,
  secondaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 bg-[var(--color-surface)] rounded-full flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-[var(--color-text-muted)]" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">{title}</h3>
      {description && <p className="text-[var(--color-text-muted)] mb-6 max-w-md">{description}</p>}
      
      <div className="flex items-center space-x-4">
        {primaryAction && (
          <button
            onClick={onPrimaryAction}
            className="flex items-center space-x-2 px-6 py-2 bg-[var(--color-primary-button)] text-white rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
          >
            {primaryAction && <primaryAction className="w-5 h-5" />}
            <span className="text-sm font-medium">{primaryActionLabel || 'Create New'}</span>
          </button>
        )}
        
        {secondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="flex items-center space-x-2 px-6 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-body)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            {secondaryAction && <secondaryAction className="w-5 h-5 text-[var(--color-text-muted)]" />}
            <span className="text-sm">{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
