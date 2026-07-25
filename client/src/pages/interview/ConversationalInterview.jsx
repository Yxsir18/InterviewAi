import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  SkipForward,
  Pause,
  Play,
  Clock,
  MessageSquare,
  User,
  Bot,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PremiumButton from '../../components/ui/PremiumButton';
import PremiumInput from '../../components/ui/PremiumInput';

const ConversationalInterview = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  console.log('ConversationalInterview mounted');
  console.log('Full URL path:', location.pathname);
  console.log('interviewId from useParams:', interviewId);
  console.log('All params:', useParams());

  const [conversation, setConversation] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [interviewInfo, setInterviewInfo] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (interviewId) {
      console.log('interviewId available, loading conversation:', interviewId);
      loadConversation();
    } else {
      console.log('interviewId not available yet');
    }
  }, [interviewId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    let interval;
    if (!isPaused && interviewInfo?.status === 'in_progress') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, interviewInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      const response = await axios.get(`/api/interview/conversational/${interviewId}/conversation`);
      console.log('Conversation loaded:', response.data.data);
      const conversationData = response.data.data.conversation || [];
      console.log('Conversation array:', conversationData);
      setConversation(conversationData);
      setInterviewInfo(response.data.data);
      
      if (response.data.data.status === 'paused') {
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load conversation');
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isThinking) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setIsThinking(true);

    console.log('Sending message with interviewId:', interviewId);

    // Add user message to conversation
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
      const response = await axios.post('/api/interview/conversational/answer', {
        interviewId,
        answer: userMessage,
        timeTaken: timer,
      });

      if (response.data.data.status === 'completed') {
        // Interview completed
        toast.success('Interview completed successfully!');
        navigate(`/report/${response.data.data.reportId}`);
        return;
      }

      // Add AI response to conversation
      setConversation([
        ...newConversation,
        {
          role: 'interviewer',
          content: response.data.data.followUpQuestion,
          timestamp: new Date(),
          evaluation: response.data.data.evaluation,
        },
      ]);

      setInterviewInfo(prev => ({
        ...prev,
        currentQuestionIndex: response.data.data.questionIndex,
      }));

      setTimer(0);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove user message on error
      setConversation(conversation);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const handleSkip = async () => {
    setIsThinking(true);

    try {
      const response = await axios.post('/api/interview/conversational/skip', {
        interviewId,
      });

      // Add skip message and AI response
      setConversation([
        ...conversation,
        {
          role: 'candidate',
          content: '[Skipped]',
          timestamp: new Date(),
        },
        {
          role: 'interviewer',
          content: response.data.data.followUpQuestion,
          timestamp: new Date(),
        },
      ]);

      setInterviewInfo(prev => ({
        ...prev,
        currentQuestionIndex: response.data.data.questionIndex,
      }));

      setTimer(0);
    } catch (error) {
      console.error('Error skipping question:', error);
      toast.error('Failed to skip question');
    } finally {
      setIsThinking(false);
    }
  };

  const handlePause = async () => {
    try {
      await axios.post('/api/interview/conversational/pause', { interviewId });
      setIsPaused(true);
      toast.success('Interview paused');
    } catch (error) {
      console.error('Error pausing interview:', error);
      toast.error('Failed to pause interview');
    }
  };

  const handleResume = async () => {
    try {
      await axios.post('/api/interview/conversational/resume', { interviewId });
      setIsPaused(false);
      toast.success('Interview resumed');
    } catch (error) {
      console.error('Error resuming interview:', error);
      toast.error('Failed to resume interview');
    }
  };

  const handleEndInterview = async () => {
    if (window.confirm('Are you sure you want to end the interview early?')) {
      try {
        // This would need to be implemented in backend
        toast.info('Ending interview early...');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error ending interview:', error);
        toast.error('Failed to end interview');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!interviewInfo) return 0;
    return ((interviewInfo.currentQuestionIndex / interviewInfo.totalQuestions) * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                {interviewInfo?.type || 'Interview'}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                {interviewInfo?.difficulty} • {interviewInfo?.length} Questions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-primary)] font-mono">{formatTime(timer)}</span>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm text-[var(--color-text-muted)]">
                {interviewInfo?.currentQuestionIndex || 0}/{interviewInfo?.totalQuestions || 5}
              </span>
            </div>

            {/* Pause/Resume */}
            <button
              onClick={isPaused ? handleResume : handlePause}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-[var(--color-success)]" />
              ) : (
                <Pause className="w-5 h-5 text-[var(--color-warning)]" />
              )}
            </button>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-xl)] z-10">
                  <button
                    onClick={handleSkip}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[var(--color-hover)] text-left text-[var(--color-text-muted)]"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Skip Question</span>
                  </button>
                  <button
                    onClick={handleEndInterview}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-[var(--color-hover)] text-left text-[var(--color-danger)]"
                  >
                    <X className="w-4 h-4" />
                    <span>End Interview</span>
                  </button>
                </div>
              )}
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
                  Loading conversation...
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
                    {/* Avatar */}
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

                    {/* Message */}
                    <div
                      className={`flex flex-col space-y-1 ${
                        message.role === 'candidate' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.role === 'candidate'
                            ? 'bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-[var(--color-text-heading)]'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-heading)]'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content || 'No content'}</p>
                      </div>

                      {/* Evaluation */}
                      {message.evaluation && (
                        <div className="px-3 py-2 bg-[var(--color-hover)] rounded-lg mt-2">
                          <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)]">
                            <span>Score: {message.evaluation.score}/100</span>
                          </div>
                          {message.evaluation.feedback && (
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                              {message.evaluation.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking Indicator */}
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

            {/* Paused Indicator */}
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="px-4 py-2 bg-[var(--color-warning)]/20 border border-[var(--color-warning)]/30 rounded-lg">
                  <p className="text-[var(--color-warning)] text-sm">Interview Paused</p>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--color-border)] p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSkip}
                disabled={isThinking || isPaused}
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors disabled:opacity-50"
              >
                <SkipForward className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your answer..."
                  disabled={isThinking || isPaused}
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] disabled:opacity-50 transition-colors"
                />
              </div>

              <PremiumButton
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isThinking || isPaused}
                icon={Send}
              >
                Send
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationalInterview;
