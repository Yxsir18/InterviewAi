import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter, MoreVertical } from 'lucide-react';

export const EnterpriseTable = ({
  columns,
  data,
  onRowClick,
  sortable = true,
  selectable = false,
  onSelectionChange,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredData = sortedData().filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRowSelect = (id) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(item => item.id)));
    }
    onSelectionChange?.(selectedRows.size === filteredData.length ? new Set() : new Set(filteredData.map(item => item.id)));
  };

  return (
    <div className="enterprise-card overflow-hidden w-full">
      {/* Table Header */}
      <div className="p-3 sm:p-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="enterprise-input pl-10 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors min-h-[40px]">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 hidden sm:inline">Filter</span>
          </button>
        </div>
        {selectedRows.size > 0 && (
          <div className="text-sm text-gray-400 whitespace-nowrap">
            {selectedRows.size} selected
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="enterprise-table min-w-full">
          <thead>
            <tr>
              {selectable && (
                <th className="w-10 p-3 sm:p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`cursor-pointer p-3 sm:p-4 ${sortable ? 'hover:bg-white/5' : ''}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm">{column.label}</span>
                    {sortable && sortConfig.key === column.key && (
                      <span className="text-blue-400">
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10 p-3 sm:p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={row.id || index}
                className={`${onRowClick ? 'cursor-pointer' : ''} ${selectedRows.has(row.id) ? 'bg-blue-500/10' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td onClick={(e) => e.stopPropagation()} className="p-3 sm:p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="p-3 sm:p-4 text-xs sm:text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td onClick={(e) => e.stopPropagation()} className="p-3 sm:p-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="enterprise-empty-state p-8 sm:p-12">
          <div className="enterprise-empty-state-icon w-16 h-16 sm:w-20 sm:h-20">
            <Search className="w-full h-full" />
          </div>
          <h3 className="enterprise-empty-state-title text-base sm:text-lg">No results found</h3>
          <p className="enterprise-empty-state-description text-sm sm:text-base">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default EnterpriseTable;
