import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInterviewReport } from '../redux/slices/interviewSlice';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Target,
  CheckCircle,
  XCircle,
  Share2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import PremiumCard from '../components/ui/PremiumCard';
import PremiumButton from '../components/ui/PremiumButton';
import { StatCard } from '../components/ui/PremiumCard';

const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentReport, loading } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(getInterviewReport(id));
  }, [dispatch, id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(139, 92, 246);
    doc.text('InterviewAI Report', 20, 20);
    
    // Overall Score
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Overall Score: ${currentReport?.overallScore || 0}%`, 20, 40);
    
    // Performance Summary
    doc.setFontSize(12);
    doc.text('Performance Summary:', 20, 60);
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(currentReport?.performanceSummary || '', 170);
    doc.text(summaryLines, 20, 70);
    
    // Strengths
    doc.setFontSize(12);
    doc.text('Strengths:', 20, 100);
    doc.setFontSize(10);
    currentReport?.strengths?.forEach((strength, index) => {
      doc.text(`• ${strength}`, 25, 110 + (index * 7));
    });
    
    // Weaknesses
    doc.setFontSize(12);
    doc.text('Areas for Improvement:', 20, 140);
    doc.setFontSize(10);
    currentReport?.weaknesses?.forEach((weakness, index) => {
      doc.text(`• ${weakness}`, 25, 150 + (index * 7));
    });
    
    doc.save(`interview-report-${id}.pdf`);
    toast.success('Report downloaded successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-[var(--color-primary-blue)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentReport) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">Report not found</p>
        <PremiumButton
          onClick={() => navigate('/interview/history')}
          className="mt-4"
        >
          Go to History
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/interview/history')}
            className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-text-muted)]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-heading)]">
              <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">Interview Report</span>
            </h1>
            <p className="text-[var(--color-text-muted)]">Detailed analysis of your performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <PremiumButton
            onClick={handleDownloadPDF}
            icon={Download}
            variant="secondary"
          >
            Download PDF
          </PremiumButton>
          <PremiumButton
            icon={Share2}
            variant="secondary"
          >
            Share
          </PremiumButton>
        </div>
      </motion.div>

      {/* Overall Score Card */}
      <PremiumCard className="p-8 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-blue)]/10 to-[var(--color-secondary-cyan)]/10"></div>
          <div className="relative z-10">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center">
              <span className="text-4xl font-bold text-[var(--color-text-heading)]">{currentReport.overallScore}%</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[var(--color-text-heading)]">Overall Score</h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">{currentReport.performanceSummary}</p>
          </div>
        </motion.div>
      </PremiumCard>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--color-success)]" />
              <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Strengths</h3>
            </div>
            <div className="space-y-3">
              {currentReport.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--color-success)]/10">
                  <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                  <span className="text-[var(--color-text-body)]">{strength}</span>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingDown className="w-6 h-6 text-[var(--color-error)]" />
              <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Areas for Improvement</h3>
            </div>
            <div className="space-y-3">
              {currentReport.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--color-error)]/10">
                  <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                  <span className="text-[var(--color-text-body)]">{weakness}</span>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Topic-wise Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Topic-wise Performance</h3>
        <div className="space-y-4">
          {currentReport.topicWiseScores.map((topic, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{topic.topic}</span>
                <span className="text-[var(--color-text-muted)]">{topic.score.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.score}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className={`h-full rounded-full ${
                    topic.score >= 70 ? 'bg-[var(--color-success)]' :
                    topic.score >= 50 ? 'bg-[var(--color-warning)]' :
                    'bg-[var(--color-error)]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Question-wise Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PremiumCard className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-[var(--color-text-primary)]">Question-wise Analysis</h3>
          <div className="space-y-6">
            {currentReport.questionWiseAnalysis.map((question, index) => (
              <div key={index} className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-[var(--color-primary-blue)]">Q{question.questionNumber}</span>
                      <span className="text-sm text-[var(--color-text-muted)]">{question.questionText.substring(0, 100)}...</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        question.score >= 70 ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' :
                        question.score >= 50 ? 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]' :
                        'bg-[var(--color-error)]/20 text-[var(--color-error)]'
                      }`}>
                        Score: {question.score}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Technical Accuracy</p>
                    <p className="font-semibold text-[var(--color-text-heading)]">{question.technicalAccuracy}/10</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Communication</p>
                    <p className="font-semibold text-[var(--color-text-heading)]">{question.communication}/10</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Confidence</p>
                    <p className="font-semibold text-[var(--color-text-heading)]">{question.confidence}/10</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Your Answer:</p>
                    <p className="text-sm bg-[var(--color-bg-primary)] p-3 rounded-lg text-[var(--color-text-body)]">{question.userAnswer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Feedback:</p>
                    <p className="text-sm text-[var(--color-text-body)]">{question.explanation}</p>
                  </div>
                  {question.improvementSuggestions.length > 0 && (
                    <div>
                      <p className="text-sm text-[var(--color-text-muted)] mb-1">Suggestions:</p>
                      <ul className="text-sm text-[var(--color-text-body)] space-y-1">
                        {question.improvementSuggestions.map((suggestion, i) => (
                          <li key={i}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
            </div>
          ))}
        </div>
        </PremiumCard>
      </motion.div>

      {/* Improvement Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-6 h-6 text-[var(--color-accent-primary)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Improvement Roadmap</h3>
          </div>
          <div className="space-y-4">
            {currentReport.improvementRoadmap.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-[var(--color-text-primary)]">{item.topic}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'high' ? 'bg-[var(--color-danger)]/20 text-[var(--color-danger)]' :
                    item.priority === 'medium' ? 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]' :
                    'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">{item.action}</p>
                <div className="flex flex-wrap gap-2">
                  {item.resources.map((resource, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)]">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-6 h-6 text-[var(--color-primary-blue)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">AI Suggestions</h3>
          </div>
          <p className="text-[var(--color-text-body)]">{currentReport.aiSuggestions}</p>
        </PremiumCard>
      </motion.div>

      {/* Certificate */}
      {currentReport.certificate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <PremiumCard className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--color-warning)] to-orange-500 flex items-center justify-center">
              <Award className="w-8 h-8 text-[var(--color-text-heading)]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-heading)]">Congratulations!</h3>
            <p className="text-[var(--color-text-muted)] mb-4">You've earned a certificate for your excellent performance</p>
            <PremiumButton icon={Sparkles}>
              View Certificate
            </PremiumButton>
          </PremiumCard>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewReport;
