import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Award,
  Calendar,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import FilterToolbar from '../../components/admin/FilterToolbar';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import ActionModal from '../../components/admin/ActionModal';
import DetailDrawer from '../../components/admin/DetailDrawer';
import axios from 'axios';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificates, setSelectedCertificates] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalCertificate, setActionModalCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/certificates', {
        params: {
          search: searchTerm,
          sortBy,
          sortOrder,
        },
      });
      setCertificates(response.data.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleCertificateClick = async (certificate) => {
    setSelectedCertificate(certificate);
    setShowDrawer(true);
  };

  const openActionModal = (certificate) => {
    setActionModalCertificate(certificate);
    setShowActionModal(true);
  };

  const handleRegenerate = async (certificateId) => {
    try {
      await axios.post(`/api/admin/certificates/${certificateId}/regenerate`);
      fetchCertificates();
      setShowActionModal(false);
    } catch (error) {
      console.error('Error regenerating certificate:', error);
    }
  };

  const handleDelete = async (certificateId) => {
    try {
      await axios.delete(`/api/admin/certificates/${certificateId}`);
      fetchCertificates();
      setShowActionModal(false);
      setShowDrawer(false);
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm">
            {value?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-[var(--color-text-body)]">{value?.name}</p>
            <p className="text-sm text-[var(--color-text-muted)]">{value?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'interviewType',
      label: 'Interview Type',
      render: (value) => (
        <span className="text-[var(--color-text-body)]">{value}</span>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (value) => (
        <span className={`font-bold ${
          value >= 80 ? 'text-[var(--color-success)]' :
          value >= 60 ? 'text-[var(--color-warning)]' :
          'text-[var(--color-error)]'
        }`}>{value}%</span>
      ),
    },
    {
      key: 'issuedDate',
      label: 'Issued',
      render: (value) => (
        <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
          <Calendar className="w-4 h-4" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'expiryDate',
      label: 'Expires',
      render: (value) => (
        <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
          <Calendar className="w-4 h-4" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      ),
    },
  ];

  const certificateActions = [
    { id: 'view', label: 'View', icon: Eye, onClick: () => handleCertificateClick(actionModalCertificate) },
    { id: 'download', label: 'Download', icon: Download, onClick: () => console.log('Download clicked') },
    { id: 'regenerate', label: 'Regenerate', icon: RefreshCw, onClick: () => handleRegenerate(actionModalCertificate._id) },
    { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => handleDelete(actionModalCertificate._id), danger: true },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load certificates"
        description={error}
        onRetry={fetchCertificates}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Certificates"
        description="Manage user certificates and credentials"
        breadcrumbs={['Dashboard', 'Certificates']}
        showRefresh
        onRefresh={fetchCertificates}
      />

      {/* Filter Toolbar */}
      <FilterToolbar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onSearchSubmit={fetchCertificates}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        sortOptions={[
          { value: 'createdAt', label: 'Issued Date' },
          { value: 'score', label: 'Score' },
          { value: 'expiryDate', label: 'Expiry Date' },
        ]}
        showExport
        onExport={() => console.log('Export clicked')}
      />

      {/* Certificates Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certificates found"
            description="No certificates have been issued yet"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">User</th>
                  <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Interview Type</th>
                  <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Score</th>
                  <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Issued</th>
                  <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Expires</th>
                  <th className="text-left p-4 text-[var(--color-text-muted)] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr
                    key={certificate._id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] cursor-pointer transition-colors"
                    onClick={() => handleCertificateClick(certificate)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-[var(--color-text-heading)] font-semibold text-sm">
                          {certificate.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text-body)]">{certificate.user?.name}</p>
                          <p className="text-sm text-[var(--color-text-muted)]">{certificate.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--color-text-body)]">{certificate.interviewType}</td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        certificate.score >= 80 ? 'text-[var(--color-success)]' :
                        certificate.score >= 60 ? 'text-[var(--color-warning)]' :
                        'text-[var(--color-error)]'
                      }`}>{certificate.score}%</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(certificate.issuedDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(certificate.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openActionModal(certificate);
                        }}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      >
                        <Eye className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Certificate Details"
      >
        {selectedCertificate && (
          <div className="space-y-6">
            {/* Certificate Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-warning)] flex items-center justify-center">
                  <Award className="w-8 h-8 text-[var(--color-text-heading)]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">
                    {selectedCertificate.user?.name}
                  </h3>
                  <p className="text-[var(--color-text-muted)]">{selectedCertificate.user?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${
                  selectedCertificate.score >= 80 ? 'text-[var(--color-success)]' :
                  selectedCertificate.score >= 60 ? 'text-[var(--color-warning)]' :
                  'text-[var(--color-error)]'
                }`}>{selectedCertificate.score}%</p>
                <p className="text-sm text-[var(--color-text-muted)]">Score</p>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Interview Type</p>
                <p className="text-[var(--color-text-body)]">{selectedCertificate.interviewType}</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Certificate ID</p>
                <p className="text-[var(--color-text-body)] font-mono text-sm">{selectedCertificate.certificateId}</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Issued Date</p>
                <p className="text-[var(--color-text-body)]">{new Date(selectedCertificate.issuedDate).toLocaleDateString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <p className="text-[var(--color-text-muted)] text-sm mb-1">Expiry Date</p>
                <p className="text-[var(--color-text-body)]">{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                {certificateActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.onClick}
                      className={`flex items-center space-x-2 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors ${
                        action.danger ? 'hover:bg-[rgba(239,68,68,0.1)]' : ''
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${action.danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`} />
                      <span className="text-sm text-[var(--color-text-body)]">{action.label}</span>
		    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Certificate Actions"
        actions={certificateActions}
      />
    </div>
  );
};

export default Certificates;
