import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Trash2,
  Key,
  Eye,
  ChevronDown,
  X,
  Calendar,
  Award,
  FileText,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Star,
  Trophy,
  Flame,
  Medal,
  Clock,
  Activity,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDrawer, setShowUserDrawer] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalUser, setActionModalUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: statusFilter,
          role: roleFilter,
          sortBy,
          sortOrder,
        },
      });
      setUsers(response.data.data);
      setTotalPages(response.data.pages);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
    fetchUsers();
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    fetchUsers();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers();
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setShowUserDrawer(true);
    setDrawerLoading(true);
    setUserDetails(null);
    try {
      const response = await axios.get(`/api/admin/users/${user._id}`);
      setUserDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      const userIds = Array.from(selectedUsers);
      await axios.post('/api/admin/users/bulk', {
        action,
        userIds,
      });
      fetchUsers();
      setSelectedUsers(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await axios.post(`/api/admin/users/${userId}/${action}`);
      fetchUsers();
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const openActionModal = (user) => {
    setActionModalUser(user);
    setShowActionModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/users/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm overflow-hidden flex-shrink-0">
            {row.avatar ? (
              <img 
                src={row.avatar.startsWith('http') ? row.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${row.avatar}`} 
                alt={value}
                className="w-full h-full object-cover"
              />
            ) : (
              value?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[var(--color-text-heading)] truncate">{value}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'admin' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
          value === 'premium' ? 'bg-[rgba(124,58,237,0.1)] text-[var(--color-accent-purple)]' :
          'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
          value === 'suspended' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
          value === 'banned' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
          'bg-[rgba(148,163,184,0.1)] text-[var(--color-text-muted)]'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'interviews',
      label: 'Interviews',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-text-heading)] font-medium">{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'certificates',
      label: 'Certificates',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-text-heading)] font-medium">{value || 0}</span>
        </div>
      ),
    },
  ];

  const bulkActions = [
    { id: 'activate', label: 'Activate Users', icon: UserCheck, color: 'green' },
    { id: 'suspend', label: 'Suspend Users', icon: UserX, color: 'yellow' },
    { id: 'ban', label: 'Ban Users', icon: Shield, color: 'red' },
    { id: 'delete', label: 'Delete Users', icon: Trash2, color: 'red' },
    { id: 'resetPassword', label: 'Reset Password', icon: Key, color: 'blue' },
    { id: 'upgrade', label: 'Upgrade to Premium', icon: Award, color: 'purple' },
  ];

  const userActions = [
    { id: 'view', label: 'View Profile', icon: Eye },
    { id: 'edit', label: 'Edit', icon: Edit2 },
    { id: 'suspend', label: 'Suspend', icon: UserX },
    { id: 'resetPassword', label: 'Reset Password', icon: Key },
    { id: 'delete', label: 'Delete', icon: Trash2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">User Management</h1>
          <p className="text-[var(--color-text-muted)]">Manage all platform users and their permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <Download className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-body)]">Export</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search users by name, email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)] placeholder-[var(--color-text-muted)]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="premium">Premium</option>
            <option value="candidate">Candidate</option>
          </select>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <Filter className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-body)]">More Filters</span>
            <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>

          {selectedUsers.size > 0 && (
            <button
              onClick={() => setShowBulkActions(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
            >
              <span className="text-sm">{selectedUsers.size} selected</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-text-muted)] mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)]"
                  >
                    <option value="createdAt">Registration Date</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="lastLogin">Last Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-muted)] mb-2">Sort Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-4 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-body)]"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Users Table - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden md:block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--color-surface)] rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-[var(--color-surface)] rounded w-1/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-[var(--color-surface)] rounded-full flex items-center justify-center">
                <UserX className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <p>No users found</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[var(--color-bg-card)] z-10">
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left p-4 text-[var(--color-text-muted)] font-medium whitespace-nowrap w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.size === users.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(new Set(users.map(u => u._id)));
                          } else {
                            setSelectedUsers(new Set());
                          }
                        }}
                        className="rounded border-[var(--color-border)] bg-[var(--color-surface)]"
                      />
                    </th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="text-left p-4 text-[var(--color-text-muted)] font-medium cursor-pointer hover:text-[var(--color-text-heading)] transition-colors whitespace-nowrap"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{col.label}</span>
                          {sortBy === col.key && (
                            <span className="text-xs">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="text-left p-4 text-[var(--color-text-muted)] font-medium whitespace-nowrap sticky right-0 bg-[var(--color-bg-card)] z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.1)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user._id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedUsers);
                            if (e.target.checked) {
                              newSet.add(user._id);
                            } else {
                              newSet.delete(user._id);
                            }
                            setSelectedUsers(newSet);
                          }}
                          className="rounded border-[var(--color-border)] bg-[var(--color-surface)]"
                        />
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="p-4 whitespace-nowrap">
                          {col.render(user[col.key], user)}
                        </td>
                      ))}
                      <td className="p-4 whitespace-nowrap sticky right-0 bg-[var(--color-bg-card)] z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openActionModal(user)}
                          className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-[var(--color-text-muted)]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-[var(--color-border)] gap-4">
              <div className="text-sm text-[var(--color-text-muted)]">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-body)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-hover)] transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-body)] hover:bg-[var(--color-hover)]'
                      } transition-colors`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-[var(--color-text-muted)]">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-body)] hover:bg-[var(--color-hover)]'
                      } transition-colors`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-body)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-hover)] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Bulk Actions Modal */}
      <AnimatePresence>
        {showBulkActions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkActions(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)]">Bulk Actions</h3>
                  <button
                    onClick={() => setShowBulkActions(false)}
                    className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
                <div className="space-y-2">
                  {bulkActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleBulkAction(action.id)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors text-left"
                      >
                        <Icon className={`w-5 h-5 ${
                          action.color === 'green' ? 'text-[var(--color-success)]' :
                          action.color === 'yellow' ? 'text-[var(--color-warning)]' :
                          action.color === 'red' ? 'text-[var(--color-error)]' :
                          action.color === 'blue' ? 'text-[var(--color-primary-blue)]' :
                          action.color === 'purple' ? 'text-[var(--color-accent-purple)]' :
                          'text-[var(--color-text-muted)]'
                        }`} />
                        <span className="text-[var(--color-text-body)]">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User Action Modal */}
      <AnimatePresence>
        {showActionModal && actionModalUser && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActionModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)]">User Actions</h3>
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 mb-6 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm overflow-hidden">
                    {actionModalUser.avatar ? (
                      <img 
                        src={actionModalUser.avatar.startsWith('http') ? actionModalUser.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${actionModalUser.avatar}`} 
                        alt={actionModalUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      actionModalUser.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">{actionModalUser.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{actionModalUser.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {userActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => {
                          if (action.id === 'view') {
                            handleUserClick(actionModalUser);
                          } else {
                            handleUserAction(actionModalUser._id, action.id);
                          }
                          setShowActionModal(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors text-left"
                      >
                        <Icon className="w-5 h-5 text-[var(--color-text-muted)]" />
                        <span className="text-[var(--color-text-body)]">{action.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowActionModal(false)}
                  className="w-full mt-4 px-4 py-2 bg-[var(--color-surface)] text-[var(--color-text-body)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Card Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:hidden space-y-4"
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-muted)]">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-[var(--color-surface)] rounded-full flex items-center justify-center">
                <UserX className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <p>No users found</p>
            </div>
          </div>
        ) : (
          <>
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text-heading)] truncate">{user.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openActionModal(user);
                    }}
                    className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
                    user.role === 'premium' ? 'bg-[rgba(124,58,237,0.1)] text-[var(--color-accent-purple)]' :
                    'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
                  }`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                    user.status === 'suspended' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
                    user.status === 'banned' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
                    'bg-[rgba(148,163,184,0.1)] text-[var(--color-text-muted)]'
                  }`}>
                    {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-[var(--color-text-muted)]">
                      <FileText className="w-4 h-4" />
                      <span>{user.interviews || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[var(--color-text-muted)]">
                      <Award className="w-4 h-4" />
                      <span>{user.certificates || 0}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-[var(--color-text-muted)]">
                {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalUsers)} of {totalUsers}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-body)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-hover)] transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-body)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-hover)] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* User Details Drawer */}
      <AnimatePresence>
        {showUserDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserDrawer(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-[var(--color-bg-card)] border-l border-[var(--color-border)] z-50 overflow-y-auto"
            >
              {drawerLoading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[var(--color-primary-blue)] animate-spin" />
                </div>
              ) : userDetails ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="sticky top-0 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] p-6 z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-[var(--color-text-heading)]">User Details</h2>
                      <button
                        onClick={() => setShowUserDrawer(false)}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      >
                        <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-bold text-xl overflow-hidden">
                        {userDetails.user.avatar ? (
                          <img 
                            src={userDetails.user.avatar.startsWith('http') ? userDetails.user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${userDetails.user.avatar}`} 
                            alt={userDetails.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          userDetails.user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">{userDetails.user.name}</h3>
                        <p className="text-[var(--color-text-muted)]">{userDetails.user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userDetails.user.status === 'active' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                            userDetails.user.status === 'suspended' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
                            userDetails.user.status === 'banned' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
                            'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
                          }`}>
                            {userDetails.user.status?.charAt(0).toUpperCase() + userDetails.user.status?.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            userDetails.user.role === 'admin' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
                            userDetails.user.subscription === 'premium' ? 'bg-[rgba(124,58,237,0.1)] text-[var(--color-accent-purple)]' :
                            'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
                          }`}>
                            {userDetails.user.role?.charAt(0).toUpperCase() + userDetails.user.role?.slice(1)}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors flex items-center space-x-2">
                        <Edit2 className="w-4 h-4" />
                        <span>Edit User</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center space-x-2">
                        <UserX className="w-5 h-5 text-[var(--color-primary-blue)]" />
                        <span>Personal Information</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Full Name</p>
                          <p className="text-[var(--color-text-body)]">{userDetails.user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Email</p>
                          <p className="text-[var(--color-text-body)]">{userDetails.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Phone</p>
                          <p className="text-[var(--color-text-body)]">{userDetails.profile?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Registration Date</p>
                          <p className="text-[var(--color-text-body)]">{new Date(userDetails.user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Last Active</p>
                          <p className="text-[var(--color-text-body)]">{userDetails.user.lastLogin ? new Date(userDetails.user.lastLogin).toLocaleDateString() : 'Never'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Account Status</p>
                          <p className="text-[var(--color-text-body)]">{userDetails.user.status}</p>
                        </div>
                      </div>
                    </div>

                    {/* Interview Summary */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-[var(--color-success)]" />
                        <span>Interview Summary</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Interviews</p>
                          <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.statistics.interviewCount}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Completed</p>
                          <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.statistics.completedInterviewCount}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Average Score</p>
                          <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.statistics.averageScore}%</p>
                        </div>
                        <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Highest Score</p>
                          <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.statistics.highestScore}%</p>
                        </div>
                      </div>
                      {userDetails.statistics.lastInterview && (
                        <div className="mt-4 p-3 bg-[var(--color-bg-card)] rounded-lg">
                          <p className="text-sm text-[var(--color-text-muted)] mb-1">Last Interview</p>
                          <p className="text-[var(--color-text-body)]">{userDetails.statistics.lastInterview.type} - {userDetails.statistics.lastInterview.difficulty}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">{new Date(userDetails.statistics.lastInterview.createdAt).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div className="mt-4 flex items-center space-x-2">
                        <Award className="w-4 h-4 text-[var(--color-warning)]" />
                        <p className="text-[var(--color-text-body)]">{userDetails.certificates.length} Certificates Earned</p>
                      </div>
                    </div>

                    {/* Resume */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-[var(--color-accent-purple)]" />
                        <span>Resume</span>
                      </h4>
                      {userDetails.resumes.length > 0 ? (
                        <div className="space-y-3">
                          {userDetails.resumes.map((resume) => (
                            <div key={resume.id} className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[var(--color-text-body)]">{resume.fileName}</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  resume.atsScore >= 80 ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                                  resume.atsScore >= 60 ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
                                  'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]'
                                }`}>
                                  ATS Score: {resume.atsScore}%
                                </span>
                              </div>
                              <p className="text-sm text-[var(--color-text-muted)]">Last Updated: {new Date(resume.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          ))}
                          <button className="w-full mt-3 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors">
                            View Resume
                          </button>
                        </div>
                      ) : (
                        <p className="text-[var(--color-text-muted)]">No resume uploaded</p>
                      )}
                    </div>

                    {/* Gamification */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-[var(--color-warning)]" />
                        <span>Gamification</span>
                      </h4>
                      {userDetails.gamification ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                              <p className="text-sm text-[var(--color-text-muted)] mb-1">Level</p>
                              <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.gamification.level}</p>
                            </div>
                            <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                              <p className="text-sm text-[var(--color-text-muted)] mb-1">XP</p>
                              <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.gamification.xp}</p>
                            </div>
                            <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                              <p className="text-sm text-[var(--color-text-muted)] mb-1 flex items-center space-x-1">
                                <Flame className="w-4 h-4" />
                                <span>Current Streak</span>
                              </p>
                              <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.gamification.streak}</p>
                            </div>
                            <div className="p-3 bg-[var(--color-bg-card)] rounded-lg">
                              <p className="text-sm text-[var(--color-text-muted)] mb-1">Longest Streak</p>
                              <p className="text-2xl font-bold text-[var(--color-text-heading)]">{userDetails.gamification.longestStreak}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-[var(--color-text-muted)] mb-2">Badges ({userDetails.gamification.badges.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {userDetails.gamification.badges.map((badge, index) => (
                                <span key={index} className="px-3 py-1 bg-[var(--color-bg-card)] rounded-full text-sm text-[var(--color-text-body)]">
                                  <Medal className="w-4 h-4 inline mr-1" />
                                  {badge.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[var(--color-text-muted)]">No gamification data</p>
                      )}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4 flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-[var(--color-primary-blue)]" />
                        <span>Recent Activity</span>
                      </h4>
                      {userDetails.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {userDetails.recentActivity.slice(0, 10).map((activity, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-[var(--color-bg-card)] rounded-lg">
                              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                              <div className="flex-1">
                                <p className="text-[var(--color-text-body)] text-sm">{activity.description}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{new Date(activity.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--color-text-muted)]">No recent activity</p>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center space-x-2 p-3 bg-[var(--color-bg-card)] rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                          <Edit2 className="w-4 h-4 text-[var(--color-primary-blue)]" />
                          <span className="text-[var(--color-text-body)] text-sm">Edit User</span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-[var(--color-bg-card)] rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                          <Key className="w-4 h-4 text-[var(--color-accent-purple)]" />
                          <span className="text-[var(--color-text-body)] text-sm">Reset Password</span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-[var(--color-bg-card)] rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                          <UserX className="w-4 h-4 text-[var(--color-warning)]" />
                          <span className="text-[var(--color-text-body)] text-sm">Suspend User</span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-[var(--color-bg-card)] rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                          <UserCheck className="w-4 h-4 text-[var(--color-success)]" />
                          <span className="text-[var(--color-text-body)] text-sm">Activate User</span>
                        </button>
                        <button className="flex items-center space-x-2 p-3 bg-[rgba(239,68,68,0.1)] rounded-lg hover:bg-[rgba(239,68,68,0.2)] transition-colors col-span-2">
                          <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                          <span className="text-[var(--color-error)] text-sm">Delete User</span>
                        </button>
                      </div>
                      <button
                        onClick={() => setShowUserDrawer(false)}
                        className="w-full mt-4 px-4 py-2 bg-[var(--color-surface)] text-[var(--color-text-body)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      >
                        Close Drawer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-[var(--color-text-muted)]">
                  Failed to load user details
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
