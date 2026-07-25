import { motion } from 'framer-motion';
import { Award, Download, Share2, Calendar, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('/api/certificates');
      setCertificates(response.data.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificate) => {
    try {
      const response = await axios.get(`/api/certificates/${certificate._id}/download`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${certificate.certificateNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleShare = async (certificate) => {
    try {
      const shareUrl = `${window.location.origin}/verify-certificate/${certificate.certificateNumber}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Verification link copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Certificates</h1>
        <p className="text-[var(--color-text-muted)]">Your achievements and certifications</p>
      </motion.div>

      {/* Certificates List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {certificates.length === 0 ? (
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
            <Award className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-heading)]">No certificates yet</h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              Complete interviews with a score of 70% or higher to earn certificates
            </p>
          </div>
        ) : (
          certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Certificate Preview */}
                <div className="w-full md:w-64 h-48 rounded-xl bg-gradient-to-br from-[var(--color-warning)]/20 to-[var(--color-accent-purple)]/20 border-2 border-[var(--color-warning)]/30 flex items-center justify-center p-6">
                  <div className="text-center">
                    <Award className="w-12 h-12 text-[var(--color-warning)] mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-[var(--color-warning)]">Certificate</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{certificate.interviewType}</p>
                    <p className="text-2xl font-bold mt-2">{certificate.score}%</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-xl font-semibold text-[var(--color-text-body)]">{certificate.interviewType}</h3>
                    {certificate.isVerified && (
                      <span className="flex items-center space-x-1 text-xs text-[var(--color-success)]">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Certificate Number</p>
                      <p className="font-mono text-sm">{certificate.certificateNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Difficulty</p>
                      <p className="font-medium">{certificate.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Score</p>
                      <p className="font-medium">{certificate.score}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)]">Issued Date</p>
                      <p className="font-medium flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(certificate.issuedDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover)] transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover)] transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Certificates;
