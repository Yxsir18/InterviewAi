import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  ScrollText,
  Calendar,
  User,
  Shield,
  Trash2,
  FileText,
  Settings,
  Cpu,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { EnterpriseTable } from '../../components/admin/EnterpriseTable';
import axios from 'axios';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/activity-logs', {
        params: {
          search: searchTerm,
          action: actionFilter,
          admin: adminFilter,
          sortBy,
          sortOrder,
        },
      });
      setLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchLogs();
  };

  const handleActionFilter = (value) => {
    setActionFilter(value);
    fetchLogs();
  };

  const handleAdminFilter = (value) => {
    setAdminFilter(value);
    fetchLogs();
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    fetchLogs();
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/activity-logs/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'activity-logs.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_suspended':
      case 'user_deleted':
        return <Shield className="w-4 h-4 text-[var(--color-error)]" />;
      case 'interview_deleted':
        return <Trash2 className="w-4 h-4 text-[var(--color-warning)]" />;
      case 'ai_settings_updated':
        return <Cpu className="w-4 h-4 text-[var(--color-primary-blue)]" />;
      case 'platform_settings_updated':
        return <Settings className="w-4 h-4 text-[var(--color-accent-purple)]" />;
      case 'admin_login':
        return <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />;
      default:
        return <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />;
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`enterprise-badge ${
        status === 'success' ? 'enterprise-badge-success' :
        status === 'failed' ? 'enterprise-badge-danger' :
        'enterprise-badge-warning'
      }`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: 'action',
      label: 'Action',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getActionIcon(value)}
          <span className="text-[var(--color-text-body)] capitalize">{value.replace(/_/g, ' ')}</span>
        </div>
      ),
    },
    {
      key: 'admin',
      label: 'Admin',
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-xs">
            {value?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-body)]">{value?.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{value?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      render: (value) => (
        <span className="text-[var(--color-text-muted)]">{value || '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (value) => (
        <span className="text-[var(--color-text-body)] font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Timestamp',
      render: (value) => (
        <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
          <Clock className="w-4 h-4" />
          <span>{new Date(value).toLocaleString()}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Activity Logs</h1>
          <p className="text-[var(--color-text-muted)]">Track admin actions and system events</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
        >
          <Download className="w-5 h-5 text-[var(--color-text-muted)]" />
          <span className="text-sm text-[var(--color-text-body)]">Export</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-4 flex-wrap gap-4"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search logs by action, admin..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => handleActionFilter(e.target.value)}
          className="w-40 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
        >
          <option value="all">All Actions</option>
          <option value="admin_login">Admin Login</option>
          <option value="user_suspended">User Suspended</option>
          <option value="user_deleted">User Deleted</option>
          <option value="interview_deleted">Interview Deleted</option>
          <option value="ai_settings_updated">AI Settings Updated</option>
          <option value="platform_settings_updated">Platform Settings Updated</option>
        </select>

        <select
          value={adminFilter}
          onChange={(e) => handleAdminFilter(e.target.value)}
          className="w-40 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
        >
          <option value="all">All Admins</option>
          {/* Dynamic admin options would be populated from API */}
        </select>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EnterpriseTable
          columns={columns}
          data={logs}
          sortable={true}
        />
      </motion.div>
    </div>
  );
};

export default ActivityLogs;
