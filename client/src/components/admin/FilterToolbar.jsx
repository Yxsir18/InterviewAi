import { Search, Filter, ChevronDown, X, Download } from 'lucide-react';

const FilterToolbar = ({
  searchPlaceholder = 'Search...',
  searchTerm,
  onSearchChange,
  filters = [],
  onFilterChange,
  showAdvanced = false,
  advancedContent,
  onToggleAdvanced,
  showExport = false,
  onExport,
  selectedCount = 0,
  onClearSelection,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)] placeholder-[var(--color-text-muted)]"
          />
        </div>

        {/* Filters */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)]"
          >
            <option value="all">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {/* Advanced Filters Toggle */}
        {advancedContent && (
          <button
            onClick={onToggleAdvanced}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <Filter className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-body)]">More Filters</span>
            <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Export */}
        {showExport && (
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <Download className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-body)]">Export</span>
          </button>
        )}

        {/* Selection Counter */}
        {selectedCount > 0 && (
          <button
            onClick={onClearSelection}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-button)] text-white rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
          >
            <span className="text-sm">{selectedCount} selected</span>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && advancedContent && (
        <div className="p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg">
          {advancedContent}
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;
