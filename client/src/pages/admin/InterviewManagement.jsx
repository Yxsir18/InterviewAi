import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  User,
  MoreVertical,
  X,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import FilterToolbar from '../../components/admin/FilterToolbar';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import EmptyState from '../../components/admin/EmptyState';
import ErrorState from '../../components/admin/ErrorState';
import ActionModal from '../../components/admin/ActionModal';
import DetailDrawer from '../../components/admin/DetailDrawer';
import axios from 'axios';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterviews, setSelectedInterviews] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterviewDrawer, setShowInterviewDrawer] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalInterview, setActionModalInterview] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/interviews', {
        params: {
          search: searchTerm,
          status: statusFilter,
          type: typeFilter,
          difficulty: difficultyFilter,
          sortBy,
          sortOrder,
        },
      });
      setInterviews(response.data.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'status') setStatusFilter(value);
    if (key === 'type') setTypeFilter(value);
    if (key === 'difficulty') setDifficultyFilter(value);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleInterviewClick = async (interview) => {
    setSelectedInterview(interview);
    setShowInterviewDrawer(true);
    setDrawerLoading(true);
    setInterviewDetails(null);
    try {
      const response = await axios.get(`/api/admin/interviews/${interview._id}`);
      setInterviewDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching interview details:', error);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleInterviewAction = async (interviewId, action) => {
    try {
      await axios.post(`/api/admin/interviews/${interviewId}/${action}`);
      fetchInterviews();
    } catch (error) {
      console.error('Error performing interview action:', error);
    }
  };

  const openActionModal = (interview) => {
    setActionModalInterview(interview);
    setShowActionModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/api/admin/interviews/export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'interviews.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting interviews:', error);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Candidate',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm overflow-hidden">
            {value?.avatar ? (
              <img 
                src={value.avatar.startsWith('http') ? value.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${value.avatar}`} 
                alt={value.name}
                className="w-full h-full object-cover"
              />
            ) : (
              value?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-medium text-[var(--color-text-body)]">{value?.name}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{value?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'coding' ? 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]' :
          value === 'voice' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
          value === 'resume' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
          'bg-[rgba(168,85,247,0.1)] text-[var(--color-accent-purple)]'
        }`}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'easy' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
          value === 'medium' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
          value === 'hard' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
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
          value === 'completed' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
          value === 'in_progress' ? 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]' :
          value === 'pending' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
          value === 'cancelled' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]' :
          'bg-[rgba(148,163,184,0.1)] text-[var(--color-text-muted)]'
        }`}>
          {value?.replace('_', ' ').charAt(0).toUpperCase() + value?.replace('_', ' ').slice(1)}
        </span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <span className="text-[var(--color-text-body)] font-medium">{value ? `${value}%` : '-'}</span>
          {value && value >= 70 && <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />}
          {value && value < 70 && <XCircle className="w-4 h-4 text-[var(--color-error)]" />}
        </div>
      ),
    },
  ];

  const interviewActions = [
    { id: 'view', label: 'View Details', icon: Eye },
    { id: 'pause', label: 'Pause', icon: Pause },
    { id: 'resume', label: 'Resume', icon: Play },
    { id: 'cancel', label: 'Cancel', icon: XCircle },
    { id: 'delete', label: 'Delete', icon: Trash2, danger: true },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load interviews"
        description={error}
        onRetry={fetchInterviews}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Interview Management"
        description="Monitor and manage all platform interviews"
        breadcrumbs={['Dashboard', 'Interviews']}
        secondaryActions={[
          { icon: Download, label: 'Export', onClick: handleExport },
        ]}
      />

      {/* Filter Toolbar */}
      <FilterToolbar
        searchPlaceholder="Search interviews by candidate, type..."
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        filters={[
          {
            key: 'status',
            label: 'All Status',
            value: statusFilter,
            options: [
              { value: 'completed', label: 'Completed' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
          },
          {
            key: 'type',
            label: 'All Types',
            value: typeFilter,
            options: [
              { value: 'technical', label: 'Technical' },
              { value: 'coding', label: 'Coding' },
              { value: 'voice', label: 'Voice' },
              { value: 'resume', label: 'Resume' },
            ],
          },
          {
            key: 'difficulty',
            label: 'All Difficulty',
            value: difficultyFilter,
            options: [
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        showExport
        onExport={handleExport}
        selectedCount={selectedInterviews.size}
        onClearSelection={() => setSelectedInterviews(new Set())}
      />

      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden md:block bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
      >
        {interviews.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No interviews found"
            description="No interviews have been created yet."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[var(--color-bg-card)] z-10">
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left p-4 text-[var(--color-text-muted)] font-medium whitespace-nowrap w-12">
                      <input
                        type="checkbox"
                        checked={selectedInterviews.size === interviews.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInterviews(new Set(interviews.map(i => i._id)));
                          } else {
                            setSelectedInterviews(new Set());
                          }
                        }}
                        className="rounded border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
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
                  {interviews.map((interview) => (
                    <tr
                      key={interview._id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors cursor-pointer"
                      onClick={() => handleInterviewClick(interview)}
                    >
                      <td className="p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedInterviews.has(interview._id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedInterviews);
                            if (e.target.checked) {
                              newSet.add(interview._id);
                            } else {
                              newSet.delete(interview._id);
                            }
                            setSelectedInterviews(newSet);
                          }}
                          className="rounded border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
                        />
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="p-4 whitespace-nowrap">
                          {col.render(interview[col.key], interview)}
                        </td>
                      ))}
                      <td className="p-4 whitespace-nowrap sticky right-0 bg-[var(--color-bg-card)] z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openActionModal(interview)}
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
          </>
        )}
      </motion.div>

      {/* Mobile Card Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:hidden space-y-4"
      >
        {interviews.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No interviews found"
            description="No interviews have been created yet."
          />
        ) : (
          interviews.map((interview) => (
            <div
              key={interview._id}
              onClick={() => handleInterviewClick(interview)}
              className="p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm overflow-hidden flex-shrink-0">
                  {interview.user?.avatar ? (
                    <img 
                      src={interview.user.avatar.startsWith('http') ? interview.user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${interview.user.avatar}`} 
                      alt={interview.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    interview.user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-body)] truncate">{interview.user?.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)] truncate">{interview.user?.email}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openActionModal(interview);
                  }}
                  className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  interview.type === 'coding' ? 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]' :
                  interview.type === 'voice' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                  'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                }`}>
                  {interview.type?.charAt(0).toUpperCase() + interview.type?.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  interview.difficulty === 'easy' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                  interview.difficulty === 'medium' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
                  'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]'
                }`}>
                  {interview.difficulty?.charAt(0).toUpperCase() + interview.difficulty?.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  interview.status === 'completed' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                  interview.status === 'in_progress' ? 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]' :
                  'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                }`}>
                  {interview.status?.replace('_', ' ').charAt(0).toUpperCase() + interview.status?.replace('_', ' ').slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-[var(--color-text-muted)]">
                  <span className="text-[var(--color-text-body)] font-medium">{interview.score ? `${interview.score}%` : '-'}</span>
                  {interview.score && interview.score >= 70 && <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />}
                  {interview.score && interview.score < 70 && <XCircle className="w-4 h-4 text-[var(--color-error)]" />}
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Interview Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Interview Actions"
        user={actionModalInterview?.user}
        actions={interviewActions.map(action => ({
          ...action,
          onClick: () => handleInterviewAction(actionModalInterview._id, action.id),
        }))}
      />

      {/* Interview Detail Drawer */}
      <DetailDrawer
        isOpen={showInterviewDrawer}
        onClose={() => setShowInterviewDrawer(false)}
        title="Interview Details"
        loading={drawerLoading}
      >
        {interviewDetails && (
          <div className="space-y-6">
            {/* Interview Header */}
            <div className="flex items-center space-x-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-bold text-xl overflow-hidden">
                {interviewDetails.user?.avatar ? (
                  <img 
                    src={interviewDetails.user.avatar.startsWith('http') ? interviewDetails.user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${interviewDetails.user.avatar}`} 
                    alt={interviewDetails.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  interviewDetails.user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">{interviewDetails.user?.name}</h3>
                <p className="text-[var(--color-text-muted)]">{interviewDetails.user?.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    interviewDetails.status === 'completed' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                    interviewDetails.status === 'in_progress' ? 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]' :
                    'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                  }`}>
                    {interviewDetails.status?.replace('_', ' ').charAt(0).toUpperCase() + interviewDetails.status?.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Interview Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Type</p>
                <p className="text-[var(--color-text-body)] font-medium">{interviewDetails.type?.charAt(0).toUpperCase() + interviewDetails.type?.slice(1)}</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Difficulty</p>
                <p className="text-[var(--color-text-body)] font-medium">{interviewDetails.difficulty?.charAt(0).toUpperCase() + interviewDetails.difficulty?.slice(1)}</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Score</p>
                <p className="text-2xl font-bold text-[var(--color-text-heading)]">{interviewDetails.score ? `${interviewDetails.score}%` : '-'}</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Duration</p>
                <p className="text-[var(--color-text-body)]">{interviewDetails.duration ? `${Math.floor(interviewDetails.duration / 60)}m ${interviewDetails.duration % 60}s` : '-'}</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Created</p>
                <p className="text-[var(--color-text-body)]">{new Date(interviewDetails.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)] mb-1">Completed</p>
                <p className="text-[var(--color-text-body)]">{interviewDetails.completedAt ? new Date(interviewDetails.completedAt).toLocaleDateString() : 'In Progress'}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-[var(--color-bg-secondary)] rounded-lg">
              <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {interviewActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        handleInterviewAction(interviewDetails._id, action.id);
                        setShowInterviewDrawer(false);
                      }}
                      className={`flex items-center space-x-2 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors ${
                        action.danger ? 'bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)]' : 'bg-[var(--color-bg-card)]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${action.danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`} />
                      <span className={`text-sm ${action.danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text-body)]'}`}>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default InterviewManagement;
