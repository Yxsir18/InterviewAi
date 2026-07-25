import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume, getResumes } from '../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Trash2,
  Check,
  X,
  Download,
  Star,
  Sparkles,
  Target,
  AlertTriangle,
  TrendingUp,
  Award,
  BarChart3,
  FileDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumCard from '../components/ui/PremiumCard';
import PremiumButton from '../components/ui/PremiumButton';
import axios from 'axios';

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const { resumes, loading } = useSelector((state) => state.profile);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      await dispatch(uploadResume(formData)).unwrap();
      toast.success('Resume uploaded successfully!');
      setSelectedFile(null);
      dispatch(getResumes());
    } catch (error) {
      toast.error(error || 'Failed to upload resume');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await axios.post('/api/resume-analysis/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data.data);
      toast.success('Resume analysis completed!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewAnalytics = async () => {
    try {
      const response = await axios.get('/api/resume-analysis/analytics');
      setAnalyticsData(response.data.data);
      setShowAnalytics(true);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    }
  };

  const handleDownloadPDF = () => {
    if (!analysisResult) return;

    // Create a simple text-based PDF download
    const content = `
ATS Resume Analysis Report
===========================

ATS Score: ${analysisResult.aiAnalysis.atsScore}/100

Resume Summary:
${analysisResult.aiAnalysis.summary}

Missing Keywords:
${analysisResult.aiAnalysis.missingKeywords.join(', ')}

Weaknesses:
${analysisResult.aiAnalysis.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

Improvement Suggestions:
${analysisResult.aiAnalysis.improvementSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Recommended Technologies:
${analysisResult.aiAnalysis.recommendedTechnologies.join(', ')}

Recommended Certifications:
${analysisResult.aiAnalysis.recommendedCertifications.join(', ')}

Section Scores:
- Skills: ${analysisResult.aiAnalysis.sectionScores.skills}/100
- Experience: ${analysisResult.aiAnalysis.sectionScores.experience}/100
- Education: ${analysisResult.aiAnalysis.sectionScores.education}/100
- Projects: ${analysisResult.aiAnalysis.sectionScores.projects}/100
- Certifications: ${analysisResult.aiAnalysis.sectionScores.certifications}/100

Sections Needing Improvement:
${analysisResult.sectionsNeedingImprovement.join(', ')}

Analysis Date: ${new Date(analysisResult.analysisDate).toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analysis report downloaded');
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await dispatch(deleteResume(resumeId)).unwrap();
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete resume');
      }
    }
  };

  const handleSetDefault = async (resumeId) => {
    try {
      await dispatch(setDefaultResume(resumeId)).unwrap();
      toast.success('Default resume updated');
      dispatch(getResumes());
    } catch (error) {
      toast.error(error || 'Failed to set default resume');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">
            <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">ATS Resume Analyzer</span>
          </h1>
          <p className="text-[var(--color-text-muted)]">Upload your resume to get AI-powered ATS analysis and improvement suggestions</p>
        </div>
        <PremiumButton
          onClick={handleViewAnalytics}
          icon={BarChart3}
          variant="outline"
        >
          View Analytics
        </PremiumButton>
      </motion.div>

      {/* Upload Area */}
      <PremiumCard>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Upload Resume</h3>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 bg-[var(--color-surface)]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.docx"
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-3 text-[var(--color-text-muted)]" />
              <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">
                {selectedFile ? selectedFile.name : 'Drop your resume here'}
              </h3>
              <p className="text-[var(--color-text-muted)] mb-2">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : 'or click to browse'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Supported formats: PDF, DOCX (Max 5MB)</p>
            </div>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-[var(--color-accent-primary)]" />
                  <span className="font-medium text-[var(--color-text-primary)]">{selectedFile.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                  <PremiumButton
                    onClick={handleAnalyze}
                    loading={analyzing}
                    icon={Sparkles}
                  >
                    Analyze
                  </PremiumButton>
                </div>
              </motion.div>
            )}
          </div>

          {/* Job Description Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Target Job Description (Optional)</h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get tailored analysis..."
              className="w-full h-48 px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] resize-none"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Providing a job description will help identify missing keywords and tailor recommendations
            </p>
          </div>
        </div>
      </PremiumCard>

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Analysis Results</h2>
            <PremiumButton
              onClick={handleDownloadPDF}
              icon={FileDown}
              variant="outline"
            >
              Download Report
            </PremiumButton>
          </div>

          {/* ATS Score Card */}
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">ATS Score</h3>
              <div className={`text-4xl font-bold ${
                analysisResult.aiAnalysis.atsScore >= 80 ? 'text-[var(--color-success)]' :
                analysisResult.aiAnalysis.atsScore >= 60 ? 'text-[var(--color-warning)]' :
                'text-[var(--color-danger)]'
              }`}>
                {analysisResult.aiAnalysis.atsScore}/100
              </div>
            </div>
            <div className="w-full h-3 bg-[var(--color-surface)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysisResult.aiAnalysis.atsScore}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${
                  analysisResult.aiAnalysis.atsScore >= 80 ? 'bg-[var(--color-success)]' :
                  analysisResult.aiAnalysis.atsScore >= 60 ? 'bg-[var(--color-warning)]' :
                  'bg-[var(--color-danger)]'
                }`}
              />
            </div>
          </PremiumCard>

          {/* Section Scores */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(analysisResult.aiAnalysis.sectionScores).map(([section, score]) => (
              <PremiumCard key={section} className="p-4">
                <div className="text-center">
                  <p className="text-sm text-[var(--color-text-muted)] mb-2 capitalize">{section}</p>
                  <div className={`text-2xl font-bold ${
                    score >= 80 ? 'text-[var(--color-success)]' :
                    score >= 60 ? 'text-[var(--color-warning)]' :
                    'text-[var(--color-danger)]'
                  }`}>
                    {score}
                  </div>
                  <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${
                        score >= 80 ? 'bg-[var(--color-success)]' :
                        score >= 60 ? 'bg-[var(--color-warning)]' :
                        'bg-[var(--color-danger)]'
                      }`}
                    />
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>

          {/* Summary */}
          <PremiumCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
              <Target className="w-5 h-5 mr-2 text-[var(--color-accent-primary)]" />
              Resume Summary
            </h3>
            <p className="text-[var(--color-text-secondary)]">{analysisResult.aiAnalysis.summary}</p>
          </PremiumCard>

          {/* Missing Keywords */}
          {analysisResult.aiAnalysis.missingKeywords.length > 0 && (
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-[var(--color-warning)]" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.aiAnalysis.missingKeywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </PremiumCard>
          )}

          {/* Weaknesses */}
          {analysisResult.aiAnalysis.weaknesses.length > 0 && (
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-[var(--color-danger)]" />
                Weaknesses
              </h3>
              <ul className="space-y-2">
                {analysisResult.aiAnalysis.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-start text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-danger)] mr-2">•</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </PremiumCard>
          )}

          {/* Improvement Suggestions */}
          {analysisResult.aiAnalysis.improvementSuggestions.length > 0 && (
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-success)]" />
                Improvement Suggestions
              </h3>
              <ul className="space-y-2">
                {analysisResult.aiAnalysis.improvementSuggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-success)] mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </PremiumCard>
          )}

          {/* Recommended Technologies */}
          {analysisResult.aiAnalysis.recommendedTechnologies.length > 0 && (
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
                <Award className="w-5 h-5 mr-2 text-[var(--color-accent-primary)]" />
                Recommended Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.aiAnalysis.recommendedTechnologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </PremiumCard>
          )}

          {/* Recommended Certifications */}
          {analysisResult.aiAnalysis.recommendedCertifications.length > 0 && (
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
                <Award className="w-5 h-5 mr-2 text-[var(--color-accent-secondary)]" />
                Recommended Certifications
              </h3>
              <ul className="space-y-2">
                {analysisResult.aiAnalysis.recommendedCertifications.map((cert, i) => (
                  <li key={i} className="flex items-start text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-accent-secondary)] mr-2">•</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </PremiumCard>
          )}

          {/* Sections Needing Improvement */}
          {analysisResult.sectionsNeedingImprovement.length > 0 && (
            <PremiumCard className="p-6 border-[var(--color-warning)]">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)] flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-[var(--color-warning)]" />
                Sections Needing Improvement
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.sectionsNeedingImprovement.map((section, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-sm"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </PremiumCard>
          )}
        </motion.div>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && analyticsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Analytics Dashboard</h2>
            <button
              onClick={() => setShowAnalytics(false)}
              className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PremiumCard className="p-6">
              <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Total Analyses</h3>
              <div className="text-3xl font-bold text-[var(--color-text-primary)]">{analyticsData.totalAnalyses}</div>
            </PremiumCard>
            <PremiumCard className="p-6">
              <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Average ATS Score</h3>
              <div className="text-3xl font-bold text-[var(--color-accent-primary)]">{analyticsData.averageATSScore}%</div>
            </PremiumCard>
            <PremiumCard className="p-6">
              <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Improvement Trend</h3>
              <div className="flex items-center space-x-2">
                {analyticsData.improvementTrend.length > 1 && (
                  <span className={`text-2xl font-bold ${
                    analyticsData.improvementTrend[analyticsData.improvementTrend.length - 1].score > 
                    analyticsData.improvementTrend[0].score ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                  }`}>
                    {analyticsData.improvementTrend[analyticsData.improvementTrend.length - 1].score - 
                     analyticsData.improvementTrend[0].score > 0 ? '+' : ''}
                    {analyticsData.improvementTrend[analyticsData.improvementTrend.length - 1].score - 
                     analyticsData.improvementTrend[0].score}%
                  </span>
                )}
              </div>
            </PremiumCard>
          </div>

          <PremiumCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Section Averages</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.sectionAverages).map(([section, score]) => (
                <div key={section}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[var(--color-text-secondary)] capitalize">{section}</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${
                        score >= 80 ? 'bg-[var(--color-success)]' :
                        score >= 60 ? 'bg-[var(--color-warning)]' :
                        'bg-[var(--color-danger)]'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {analyticsData.topWeaknesses.length > 0 && (
            <PremiumCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Top Weaknesses</h3>
              <ul className="space-y-2">
                {analyticsData.topWeaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-start text-[var(--color-text-secondary)]">
                    <span className="text-[var(--color-danger)] mr-2">{i + 1}.</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </PremiumCard>
          )}
        </motion.div>
      )}

      {/* Existing Resumes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Your Resumes</h2>
        {resumes.length === 0 ? (
          <PremiumCard className="p-8 text-center">
            <FileText className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <p className="text-[var(--color-text-muted)]">No resumes uploaded yet</p>
          </PremiumCard>
        ) : (
          resumes.map((resume, index) => (
            <PremiumCard
              key={resume._id}
              className="p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-xl bg-[var(--color-accent-primary)]/20">
                      <FileText className="w-6 h-6 text-[var(--color-accent-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--color-text-primary)]">{resume.fileName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-[var(--color-text-muted)]">
                        <span>{resume.fileType.toUpperCase()}</span>
                        <span>{(resume.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {resume.isDefault && (
                      <span className="flex items-center space-x-1 text-xs text-[var(--color-warning)]">
                        <Star className="w-4 h-4" />
                        <span>Default</span>
                      </span>
                    )}
                    {!resume.isDefault && (
                      <button
                        onClick={() => handleSetDefault(resume._id)}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                        title="Set as default"
                      >
                        <Star className="w-5 h-5 text-[var(--color-text-muted)]" />
                      </button>
                    )}
                    <button
                      onClick={() => window.open(resume.fileUrl, '_blank')}
                      className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="p-2 rounded-lg hover:bg-[var(--color-danger)]/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]" />
                    </button>
                  </div>
                </div>

                {resume.parsedData && resume.parsedData.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-muted)] mb-2">Detected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {resume.parsedData.skills.slice(0, 8).map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)]"
                        >
                          {skill}
                        </span>
                      ))}
                      {resume.parsedData.skills.length > 8 && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                          +{resume.parsedData.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </PremiumCard>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ResumeUpload;
