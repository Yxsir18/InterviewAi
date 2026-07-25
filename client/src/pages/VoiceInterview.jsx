import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Edit2,
  Check,
  X,
  Clock,
  MessageSquare,
  User,
  Bot,
  BarChart3,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PremiumButton from '../components/ui/PremiumButton';
import PremiumCard from '../components/ui/PremiumCard';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const JOB_ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'QA Engineer'];

const VoiceInterview = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [view, setView] = useState('setup'); // setup, interview, history, analytics
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [interview, setInterview] = useState(null);
  const [conversation, setConversation] = useState([]);
  
  // Speech recognition
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [editedTranscription, setEditedTranscription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscription(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast.error('Speech recognition error: ' + event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isListening]);

  const loadInterview = async () => {
    try {
      const response = await axios.get(`/api/voice-interview/${interviewId}`);
      setInterview(response.data.data);
      setConversation(response.data.data.conversation || []);
      setView('interview');
    } catch (error) {
      console.error('Error loading interview:', error);
      toast.error('Failed to load interview');
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/voice-interview/start', {
        jobRole,
        difficulty,
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
      toast.success('Voice interview started successfully!');
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in this browser');
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscription('');
      setEditedTranscription('');
      setIsListening(true);
      setRecordingTime(0);
      recognitionRef.current.start();
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const submitAnswer = async () => {
    if (!transcription.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    stopListening();
    setLoading(true);

    try {
      const response = await axios.post('/api/voice-interview/answer', {
        interviewId: interview._id,
        transcription,
        editedTranscription: editedTranscription || transcription,
        audioDuration: recordingTime,
      });

      const updatedInterview = response.data.data;
      setInterview(updatedInterview);
      setRecordingTime(0);
      setTranscription('');
      setEditedTranscription('');

      if (updatedInterview.status === 'completed') {
        toast.success('Interview completed successfully!');
        setConversation(updatedInterview.conversation);
      } else {
        setConversation(updatedInterview.conversation);
        // Speak next question
        const nextQuestionIndex = updatedInterview.currentQuestionIndex;
        if (nextQuestionIndex < updatedInterview.questions.length) {
          setTimeout(() => {
            speakText(updatedInterview.questions[nextQuestionIndex].question);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/voice-interview/history');
      setHistory(response.data.data);
      setView('history');
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/voice-interview/analytics');
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
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
              <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">Voice Interview</span>
            </h1>
            <p className="text-[var(--color-text-muted)]">Practice your communication skills with AI-powered voice interviews</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <PremiumCard>
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text-heading)]">Interview Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <PremiumButton
                onClick={loadHistory}
                icon={BarChart3}
                variant="outline"
              >
                View History
              </PremiumButton>
              <PremiumButton
                onClick={loadAnalytics}
                icon={TrendingUp}
                variant="outline"
              >
                View Analytics
              </PremiumButton>
            </div>
            <PremiumButton
              onClick={startInterview}
              loading={loading}
              icon={Mic}
            >
              Start Voice Interview
            </PremiumButton>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'interview') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/voice-interview')}
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text-heading)]">Voice Interview</h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {interview.jobRole} • {interview.difficulty} • {interview.questions.length} Questions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-heading)] font-mono">{formatTime(recordingTime)}</span>
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

        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
            <div className="h-[calc(100vh-350px)] overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
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
                            ? 'bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]'
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

                        {message.communicationMetrics && (
                          <div className="px-3 py-2 bg-[var(--color-hover)] rounded-lg mt-2 space-y-1">
                            <div className="grid grid-cols-5 gap-2 text-xs">
                              <div className="text-center">
                                <div className="text-[var(--color-text-muted)]">Confidence</div>
                                <div className="font-semibold text-[var(--color-text-heading)]">{message.communicationMetrics.confidence}%</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[var(--color-text-muted)]">Fluency</div>
                                <div className="font-semibold text-[var(--color-text-heading)]">{message.communicationMetrics.fluency}%</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[var(--color-text-muted)]">Grammar</div>
                                <div className="font-semibold text-[var(--color-text-heading)]">{message.communicationMetrics.grammar}%</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[var(--color-text-muted)]">Fillers</div>
                                <div className="font-semibold text-[var(--color-text-heading)]">{message.communicationMetrics.fillers}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-[var(--color-text-muted)]">WPM</div>
                                <div className="font-semibold text-[var(--color-text-heading)]">{message.communicationMetrics.speakingSpeed}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {message.evaluation && (
                          <div className="px-3 py-2 bg-[var(--color-hover)] rounded-lg mt-2">
                            <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)]">
                              <span>Score: {message.evaluation.score}/100</span>
                              <span>•</span>
                              <span>Communication: {message.evaluation.communicationScore}/100</span>
                            </div>
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

              {interview?.status === 'completed' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <div className="px-6 py-4 bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 rounded-xl">
                    <p className="text-[var(--color-success)] font-semibold">
                      Interview Completed! Score: {interview.overallScore}/100 • Communication: {interview.communicationScore}/100
                    </p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {interview?.status === 'in_progress' && (
              <div className="border-t border-[var(--color-border)] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <PremiumButton
                      onClick={isListening ? stopListening : startListening}
                      icon={isListening ? MicOff : Mic}
                      variant={isListening ? 'danger' : 'primary'}
                    >
                      {isListening ? 'Stop Recording' : 'Start Recording'}
                    </PremiumButton>
                    
                    {conversation.length > 0 && conversation[conversation.length - 1].role === 'interviewer' && (
                      <PremiumButton
                        onClick={() => speakText(conversation[conversation.length - 1].content)}
                        icon={Volume2}
                        variant="outline"
                        disabled={isSpeaking}
                      >
                        Replay Question
                      </PremiumButton>
                    )}
                  </div>

                  {transcription && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                        title="Edit transcription"
                      >
                        <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <PremiumButton
                        onClick={submitAnswer}
                        loading={loading}
                        icon={Check}
                      >
                        Submit Answer
                      </PremiumButton>
                    </div>
                  )}
                </div>

                {transcription && (
                  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
                    {isEditing ? (
                      <textarea
                        value={editedTranscription || transcription}
                        onChange={(e) => setEditedTranscription(e.target.value)}
                        className="w-full h-24 px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] resize-none"
                        placeholder="Edit your transcription..."
                      />
                    ) : (
                      <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap">{transcription}</p>
                    )}
                  </div>
                )}
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
              <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">Voice Interview History</h1>
              <p className="text-[var(--color-text-muted)]">Your voice interview practice history</p>
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
              <Mic className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">No voice interview history yet</p>
            </PremiumCard>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <PremiumCard key={item._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-[var(--color-accent-primary)]/20">
                        <Mic className="w-6 h-6 text-[var(--color-accent-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--color-text-primary)]">{item.jobRole}</h3>
                        <div className="flex items-center space-x-4 text-sm text-[var(--color-text-muted)]">
                          <span>{item.difficulty}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {item.status === 'completed' && (
                        <>
                          <div className={`text-2xl font-bold ${
                            item.overallScore >= 80 ? 'text-[var(--color-success)]' :
                            item.overallScore >= 60 ? 'text-[var(--color-warning)]' :
                            'text-[var(--color-danger)]'
                          }`}>
                            {item.overallScore}/100
                          </div>
                          <div className={`text-xl font-bold ${
                            item.communicationScore >= 80 ? 'text-[var(--color-success)]' :
                            item.communicationScore >= 60 ? 'text-[var(--color-warning)]' :
                            'text-[var(--color-danger)]'
                          }`}>
                            {item.communicationScore}/100
                          </div>
                        </>
                      )}
                      <PremiumButton
                        onClick={() => navigate(`/voice-interview/${item._id}`)}
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
              <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">Communication Analytics</h1>
              <p className="text-[var(--color-text-muted)]">Your voice interview performance metrics</p>
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
                  <div className="text-3xl font-bold text-[var(--color-accent-primary)]">{analytics.averageScore}%</div>
                </PremiumCard>
                <PremiumCard className="p-6">
                  <h3 className="text-sm text-[var(--color-text-muted)] mb-2">Communication Score</h3>
                  <div className="text-3xl font-bold text-[var(--color-success)]">{analytics.averageCommunicationScore}%</div>
                </PremiumCard>
              </div>

              <PremiumCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Communication Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div>
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Confidence</div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{analytics.averageMetrics.confidence}%</div>
                    <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics.averageMetrics.confidence}%` }}
                        className="h-full bg-[var(--color-accent-primary)]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Fluency</div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{analytics.averageMetrics.fluency}%</div>
                    <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics.averageMetrics.fluency}%` }}
                        className="h-full bg-[var(--color-success)]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Grammar</div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{analytics.averageMetrics.grammar}%</div>
                    <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics.averageMetrics.grammar}%` }}
                        className="h-full bg-[var(--color-warning)]"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Avg Fillers</div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{analytics.averageMetrics.fillers}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--color-text-muted)] mb-2">Speaking Speed</div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{analytics.averageMetrics.speakingSpeed} WPM</div>
                  </div>
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

export default VoiceInterview;
