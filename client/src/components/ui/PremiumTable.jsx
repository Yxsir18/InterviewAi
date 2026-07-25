import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter, MoreVertical } from 'lucide-react';

const PremiumTable = ({ 
  columns = [], 
  data = [], 
  onSort, 
  sortColumn, 
  sortDirection,
  onRowClick,
  className = '' 
}) => {
  const handleSort = (column) => {
    if (onSort) {
      const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(column, direction);
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className={`bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-[var(--color-text-primary)] transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors ${
                  onRowClick ? 'hover:bg-[var(--color-hover)] cursor-pointer' : ''
                }`}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-[var(--color-text-primary)]">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TableActions = ({ onSearch, onFilter, onExport }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors w-64"
          />
        </div>
        {onFilter && (
          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        )}
      </div>
      {onExport && (
        <button
          onClick={onExport}
          className="px-4 py-2 bg-[var(--color-accent-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-secondary)] transition-colors"
        >
          Export
        </button>
      )}
    </div>
  );
};

export const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-[var(--color-text-muted)]">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              currentPage === page
                ? 'bg-[var(--color-accent-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Completed' },
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'In Progress' },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pending' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Failed' },
    cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Cancelled' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export const ActionMenu = ({ items = [] }) => {
  return (
    <div className="relative group">
      <button className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
        <MoreVertical className="w-4 h-4" />
      </button>
      <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-xl)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PremiumTable;
