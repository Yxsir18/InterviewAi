import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  Calendar,
  Copy,
  Trash2,
  Eye,
  Edit,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeList = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resume-builder');
      setResumes(response.data.data);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const response = await axios.post('/api/resume-builder', {
        name: 'My Resume',
        template: 'modern',
      });
      navigate(`/dashboard/resume/builder/${response.data.data._id}`);
    } catch (error) {
      toast.error('Failed to create resume');
    }
  };

  const deleteResume = async (id) => {
    setDeleting(id);
    try {
      await axios.delete(`/api/resume-builder/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const duplicateResume = async (resume) => {
    try {
      const response = await axios.post('/api/resume-builder', {
        name: `${resume.name} (Copy)`,
        template: resume.versions[0]?.template || 'modern',
      });
      navigate(`/dashboard/resume/builder/${response.data.data._id}`);
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="w-8 h-8 text-[var(--color-primary-blue)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">My Resumes</h1>
              <p className="text-[var(--color-text-muted)]">Manage and edit your resumes</p>
            </div>
            <button
              onClick={createNewResume}
              className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              New Resume
            </button>
          </div>
        </div>
      </div>

      {/* Resume List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resumes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">No resumes yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6">Create your first resume to get started</p>
            <button
              onClick={createNewResume}
              className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[var(--color-primary-blue)]" />
                    </div>
                    <div>
                      <h3 className="text-[var(--color-text-heading)] font-semibold">{resume.name}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Version {resume.currentVersion} • {resume.versions.length} version(s)
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => duplicateResume(resume)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)] rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)] mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-2 py-1 bg-[rgba(168,85,247,0.1)] text-[var(--color-accent-purple)] rounded text-xs">
                    {resume.versions[0]?.template || 'modern'}
                  </span>
                  <span className="px-2 py-1 bg-[rgba(16,185,129,0.1)] text-[var(--color-success)] rounded text-xs">
                    {resume.versions[0]?.sections?.length || 0} sections
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/resume/builder/${resume._id}`)}
                    className="flex-1 px-3 py-2 bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)] rounded-lg hover:bg-[rgba(37,99,235,0.2)] transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/resume/builder/${resume._id}`)}
                    className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    disabled={deleting === resume._id}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === resume._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeList;
