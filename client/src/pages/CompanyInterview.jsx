import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  Code,
  Briefcase,
  Play,
  Clock,
  MessageSquare,
  User,
  Bot,
  X,
  ChevronDown,
  Sparkles,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PremiumButton from '../components/ui/PremiumButton';
import PremiumCard from '../components/ui/PremiumCard';

const COMPANIES = [
  { name: 'Google', color: '#4285F4', icon: '🔍' },
  { name: 'Amazon', color: '#FF9900', icon: '📦' },
  { name: 'Microsoft', color: '#00A4EF', icon: '💻' },
  { name: 'Meta', color: '#0668E1', icon: '📘' },
  { name: 'Netflix', color: '#E50914', icon: '🎬' },
  { name: 'Apple', color: '#000000', icon: '🍎' },
  { name: 'TCS', color: '#00A3E0', icon: '💼' },
  { name: 'Infosys', color: '#007CC3', icon: '🏢' },
  { name: 'Wipro', color: '#0066B3', icon: '🌐' },
  { name: 'Accenture', color: '#A100FF', icon: '🎯' },
];

const ROUNDS = [
  { name: 'HR', icon: Users, description: 'Behavioral and cultural fit questions' },
  { name: 'Technical', icon: Code, description: 'Technical knowledge and problem-solving' },
  { name: 'Coding', icon: Code, description: 'Programming and algorithm challenges' },
  { name: 'Managerial', icon: Briefcase, description: 'Leadership and management scenarios' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const JOB_ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'QA Engineer'];
const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
];

const CompanyInterview = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [view, setView] = useState('setup'); // setup, interview, history, analytics
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('javascript');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [interview, setInterview] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    let interval;
    if (interview?.status === 'in_progress') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interview?.status]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInterview = async () => {
    try {
      const response = await axios.get(`/api/company-interview/${interviewId}`);
      setInterview(response.data.data);
      setConversation(response.data.data.conversation || []);
      setView('interview');
    } catch (error) {
      console.error('Error loading interview:', error);
      toast.error('Failed to load interview');
    }
  };

  const startInterview = async () => {
    if (!selectedCompany || !selectedRound) {
      toast.error('Please select company and round');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/company-interview/start', {
        company: selectedCompany.name,
        round: selectedRound.name,
        jobRole,
        difficulty,
        language,
        numQuestions,
      });

      setInterview(response.data.data);
      
      // Initialize conversation with first question
      const initialConversation = response.data.data.conversation || [];
      if (initialConversation.length === 0 && response.data.data.questions.length > 0) {
        initialConversation.push({
          role: 'interviewer',
          content: response.data.data.questions[0].question,
          timestamp: new Date(),
        });
      }
      
      setConversation(initialConversation);
      setView('interview');
      toast.success('Interview started successfully!');
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isThinking) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsThinking(true);

    const newConversation = [
      ...conversation,
      {
        role: 'candidate',
        content: userMessage,
        timestamp: new Date(),
      },
    ];
    setConversation(newConversation);

    try {
      const response = await axios.post('/api/company-interview/answer', {
        interviewId: interview._id,
        answer: userMessage,
        timeTaken: timer,
      });

      const updatedInterview = response.data.data;
      setInterview(updatedInterview);
      setTimer(0);

      if (updatedInterview.status === 'completed') {
        toast.success('Interview completed successfully!');
        setConversation(updatedInterview.conversation);
      } else {
        setConversation(updatedInterview.conversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setConversation(conversation);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const loadHistory = async (company = null) => {
    setLoading(true);
    try {
      const params = company ? { company } : {};
      const response = await axios.get('/api/company-interview/history', { params });
      setHistory(response.data.data);
      setView('history');
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (company = null) => {
    setLoading(true);
    try {
      const params = company ? { company } : {};
      const response = await axios.get('/api/company-interview/analytics', { params });
      setAnalytics(response.data.data);
      setView('analytics');
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!interview) return 0;
    return ((interview.currentQuestionIndex / interview.questions.length) * 100).toFixed(0);
  };

  if (view === 'setup') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        {/* Header */}
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
              <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">Company-Specific Interviews</span>
            </h1>
            <p className="text-[var(--color-text-muted)]">Practice interviews tailored to specific company styles and cultures</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {/* Company Selection */}
          <PremiumCard>
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Select Company</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {COMPANIES.map((company) => (
                <motion.button
                  key={company.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCompany(company)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCompany?.name === company.name
                      ? 'border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/10'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/50 bg-[var(--color-surface)]'
                  }`}
                >
                  <div className="text-3xl mb-2">{company.icon}</div>
                  <div className="font-medium text-[var(--color-text-heading)]">{company.name}</div>
                </motion.button>
              ))}
            </div>
          </PremiumCard>

          {/* Round Selection */}
          <PremiumCard>
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Select Round</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROUNDS.map((round) => {
                const Icon = round.icon;
                return (
                  <motion.button
                    key={round.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRound(round)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedRound?.name === round.name
                        ? 'border-[var(--color-primary-blue)] bg-[var(--color-primary-blue)]/10'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/50 bg-[var(--color-surface)]'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2 text-[var(--color-primary-blue)]" />
                    <div className="font-medium text-[var(--color-text-heading)]">{round.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">{round.description}</div>
                  </motion.button>
                );
              })}
            </div>
          </PremiumCard>

          {/* Interview Settings */}
          <PremiumCard>
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Interview Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Job Role</label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)]"
                >
                  {JOB_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)]"
                >
                  {DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Programming Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)]"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Number of Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)]"
                >
                  {[3, 5, 7, 10].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </PremiumCard>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <PremiumButton
                onClick={() => loadHistory()}
                icon={BarChart3}
                variant="outline"
              >
                View History
              </PremiumButton>
              <PremiumButton
                onClick={() => loadAnalytics()}
                icon={BarChart3}
                variant="outline"
              >
                View Analytics
              </PremiumButton>
            </div>
            <PremiumButton
              onClick={startInterview}
              loading={loading}
              disabled={!selectedCompany || !selectedRound}
              icon={Play}
            >
              Start Interview
            </PremiumButton>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'interview') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        {/* Header */}
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/company-interview')}
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text-heading)]">
                  {interview.company} - {interview.round} Round
                </h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {interview.jobRole} • {interview.difficulty} • {interview.questions.length} Questions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-heading)] font-mono">{formatTime(timer)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-[var(--color-text-muted)]">
                  {interview.currentQuestionIndex}/{interview.questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            {/* Messages */}
            <div className="h-[calc(100vh-300px)] overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {conversation.length === 0 && (
                  <div className="text-center text-[var(--color-text-muted)] py-8">
                    Starting interview...
                  </div>
                )}
                {conversation.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.role === 'candidate' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'candidate'
                            ? 'bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)]'
                            : 'bg-gradient-to-br from-[var(--color-success)] to-teal-500'
                        }`}
                      >
                        {message.role === 'candidate' ? (
                          <User className="w-5 h-5 text-[var(--color-text-heading)]" />
                        ) : (
                          <Bot className="w-5 h-5 text-[var(--color-text-heading)]" />
                        )}
                      </div>

                      <div
                        className={`flex flex-col space-y-1 ${
                          message.role === 'candidate' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.role === 'candidate'
                              ? 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white'
                              : 'bg-[var(--color-surface)] text-[var(--color-text-heading)]'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content || 'No content'}</p>
                        </div>

                        {message.evaluation && (
                          <div className="px-3 py-2 bg-[var(--color-hover)] rounded-lg mt-2">
                            <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)]">
                              <span>Score: {message.evaluation.score}/100</span>
                            </div>
                            {message.evaluation.feedback && (
                              <p className="text-xs text-[var(--color-text-body)] mt-1">
                                {message.evaluation.feedback}
                              </p>
                            )}
                          </div>
                        )}

                        <span className="text-xs text-[var(--color-text-muted)]">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-success)] to-teal-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-[var(--color-text-heading)]" />
                    </div>
                    <div className="px-4 py-3 bg-[var(--color-surface)] rounded-2xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-[var(--color-text-muted)] rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {interview?.status === 'completed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <div className="px-6 py-4 bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 rounded-xl">
                    <p className="text-[var(--color-success)] font-semibold">Interview Completed! Score: {interview.overallScore}/100</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {interview?.status === 'in_progress' && (
              <div className="border-t border-[var(--color-border)] p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your answer..."
                      disabled={isThinking}
                      className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] disabled:opacity-50 transition-colors"
                    />
                  </div>

                  <PremiumButton
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isThinking}
                    icon={Sparkles}
                  >
                    Send
                  </PremiumButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">Interview History</h1>
              <p className="text-[var(--color-text-muted)]">Your company-specific interview history</p>
            </div>
            <PremiumButton
              onClick={() => setView('setup')}
              icon={ArrowRight}
              variant="outline"
            >
              New Interview
            </PremiumButton>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center text-[var(--color-text-muted)]">Loading...</div>
          ) : history.length === 0 ? (
            <PremiumCard className="p-8 text-center">
              <Building2 className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">No interview history yet</p>
            </PremiumCard>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <PremiumCard key={item._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-[var(--color-primary-blue)]/20">
                        <Building2 className="w-6 h-6 text-[var(--color-primary-blue)]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--color-text-heading)]">{item.company} - {item.round}</h3>
                        <div className="flex items-center space-x-4 text-sm text-[var(--color-text-muted)]">
                          <span>{item.jobRole}</span>
                          <span>{item.difficulty}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {item.status === 'completed' && (
                        <div className={`text-2xl font-bold ${
                          item.overallScore >= 80 ? 'text-[var(--color-success)]' :
                          item.overallScore >= 60 ? 'text-[var(--color-warning)]' :
                          'text-[var(--color-danger)]'
                        }`}>
                          {item.overallScore}/100
                        </div>
                      )}
                      <PremiumButton
                        onClick={() => navigate(`/company-interview/${item._id}`)}
                        icon={ArrowRight}
                        variant="outline"
                      >
                        View
                      </PremiumButton>
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'analytics') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">Interview Analytics</h1>
              <p className="text-[var(--color-text-muted)]">Your company-specific interview performance</p>
            </div>
            <PremiumButton
              onClick={() => setView('setup')}
              icon={ArrowRight}
              variant="outline"
            >
              New Interview
            </PremiumButton>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center text-[var(--color-text-muted)]">Loading...</div>
          ) : analytics ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PremiumCard className="p-6">
                  <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Total Interviews</h3>
                  <div className="text-3xl font-bold text-[var(--color-text-primary)]">{analytics.totalInterviews}</div>
                </PremiumCard>
                <PremiumCard className="p-6">
                  <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Average Score</h3>
                  <div className="text-3xl font-bold text-[var(--color-primary-blue)]">{analytics.averageScore}%</div>
                </PremiumCard>
                <PremiumCard className="p-6">
                  <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Companies Practiced</h3>
                  <div className="text-3xl font-bold text-[var(--color-text-primary)]">{Object.keys(analytics.companyBreakdown).length}</div>
                </PremiumCard>
              </div>

              <PremiumCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Company Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.companyBreakdown).map(([company, data]) => (
                    <div key={company}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[var(--color-text-body)]">{company}</span>
                        <span className="font-semibold text-[var(--color-text-heading)]">{data.averageScore}% ({data.count} interviews)</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.averageScore}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full ${
                            data.averageScore >= 80 ? 'bg-[var(--color-success)]' :
                            data.averageScore >= 60 ? 'bg-[var(--color-warning)]' :
                            'bg-[var(--color-danger)]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>

              <PremiumCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Round Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.roundBreakdown).map(([round, data]) => (
                    <div key={round}>
                      <div className="flex justify-between mb-2">
                        <span className="text-[var(--color-text-body)]">{round}</span>
                        <span className="font-semibold text-[var(--color-text-heading)]">{data.averageScore}% ({data.count} interviews)</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.averageScore}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full ${
                            data.averageScore >= 80 ? 'bg-[var(--color-success)]' :
                            data.averageScore >= 60 ? 'bg-[var(--color-warning)]' :
                            'bg-[var(--color-danger)]'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return null;
};

export default CompanyInterview;
