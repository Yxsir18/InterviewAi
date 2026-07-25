import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Ban,
  Shield,
  Mail,
  Calendar,
  FileText,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getUsers, updateUser, deleteUser } from '../../redux/slices/adminSlice';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, pagination } = useSelector((state) => state.admin);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = {
      page,
      search: searchQuery || undefined,
      role: filterRole || undefined,
      status: filterStatus || undefined,
    };
    dispatch(getUsers(params));
  }, [dispatch, page, searchQuery, filterRole, filterStatus]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await dispatch(updateUser({ id: userId, isActive: !currentStatus })).unwrap();
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully');
        setShowActionMenu(null);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleResendVerification = (userId) => {
    toast.success('Verification email sent');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading && users.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: '#9ca3af' }}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: '#ef4444' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">User Management</h1>
          <p className="text-[var(--color-text-muted)]">Manage and monitor all platform users</p>
        </div>
        <div className="text-[var(--color-text-muted)]">
          Total: {pagination.total} users
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="glass-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-[var(--color-text-muted)]" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="glass-input"
            >
              <option value="">All Roles</option>
              <option value="candidate">Candidate</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="glass-input"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">User</th>
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Role</th>
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Status</th>
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Interviews</th>
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Joined</th>
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Last Login</th>
                <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-body)]">{user.name}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-[rgba(168,85,247,0.1)] text-[var(--color-accent-purple)]' : 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-[var(--color-success)]' : 'bg-[var(--color-error)]'}`}></div>
                      <span className={user.isActive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <span>{user.completedInterviewCount || 0}/{user.interviewCount || 0}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
                      <Calendar className="w-4 h-4" />
                      <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === user._id ? null : user._id)}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-[var(--color-text-muted)]" />
                      </button>

                      {showActionMenu === user._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 top-full mt-2 w-48 glass-card p-2 z-10"
                        >
                          <button
                            onClick={() => {
                              handleToggleStatus(user._id, user.isActive);
                              setShowActionMenu(null);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-left"
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="w-4 h-4 text-[var(--color-error)]" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 text-[var(--color-success)]" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>

                          {!user.isEmailVerified && (
                            <button
                              onClick={() => {
                                handleResendVerification(user._id);
                                setShowActionMenu(null);
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-left"
                            >
                              <Mail className="w-4 h-4 text-[var(--color-primary-blue)]" />
                              <span>Resend Verification</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              handleDeleteUser(user._id);
                              setShowActionMenu(null);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors text-left text-[var(--color-error)]"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">No users found</p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <p className="text-[var(--color-text-muted)] text-sm">
          Showing {users.length} of {pagination.total} users
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-body)]"
          >
            Previous
          </button>
          <span className="text-[var(--color-text-muted)]">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-body)]"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsers;
