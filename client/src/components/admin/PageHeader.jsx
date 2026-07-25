import { ChevronRight, Plus, Download, RefreshCw } from 'lucide-react';

const PageHeader = ({
  title,
  description,
  breadcrumbs,
  primaryAction,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActions = [],
  showRefresh = false,
  onRefresh,
}) => {
  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-[var(--color-text-muted)]">{crumb}</span>
              ) : (
                <span className="text-[var(--color-text-body)] hover:text-[var(--color-text-heading)] cursor-pointer transition-colors">
                  {crumb}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Title and Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">{title}</h1>
          {description && <p className="text-[var(--color-text-muted)]">{description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {showRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-[var(--color-text-muted)]" />
              <span className="text-sm text-[var(--color-text-body)]">Refresh</span>
            </button>
          )}

          {secondaryActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
            >
              {action.icon && <action.icon className="w-5 h-5 text-[var(--color-text-muted)]" />}
              <span className="text-sm text-[var(--color-text-body)]">{action.label}</span>
            </button>
          ))}

          {primaryAction && (
            <button
              onClick={onPrimaryAction}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-button)] text-white rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">{primaryActionLabel || 'Add New'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
