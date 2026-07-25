import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitAnswer, endInterview } from '../redux/slices/interviewSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Check,
  X,
  Clock,
  Play,
  Pause,
} from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentInterview, questions, currentQuestionIndex, loading } = useSelector((state) => state.interview);

  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setAnswer(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Speech recognition error. Please try typing your answer.');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (!isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [isPaused, timeLeft]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleNext = async () => {
    if (!answer.trim() && !isRecording) {
      toast.error('Please provide an answer or skip the question');
      return;
    }

    const timeTaken = 300 - timeLeft;
    
    try {
      await dispatch(submitAnswer({
        interviewId: id,
        questionId: currentQuestion._id,
        answer,
        timeTaken,
        skipped: !answer.trim(),
      })).unwrap();

      setAnswer('');
      setTimeLeft(300);

      if (currentQuestionIndex >= questions.length - 1) {
        toast.success('Interview completed!');
        navigate(`/dashboard/interview/report/${id}`);
      }
    } catch (error) {
      toast.error(error || 'Failed to submit answer');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // In a real app, you'd want to load the previous answer
      toast.info('Navigation to previous questions is not supported in this version');
    }
  };

  const handleSkip = async () => {
    try {
      await dispatch(submitAnswer({
        interviewId: id,
        questionId: currentQuestion._id,
        answer: '',
        timeTaken: 300 - timeLeft,
        skipped: true,
      })).unwrap();

      setAnswer('');
      setTimeLeft(300);

      if (currentQuestionIndex >= questions.length - 1) {
        toast.success('Interview completed!');
        navigate(`/dashboard/interview/report/${id}`);
      }
    } catch (error) {
      toast.error(error || 'Failed to skip question');
    }
  };

  const handleEndInterview = async () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      try {
        await dispatch(endInterview(id)).unwrap();
        toast.success('Interview ended');
        navigate('/interview/history');
      } catch (error) {
        toast.error(error || 'Failed to end interview');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[var(--color-text-muted)]">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm px-3 py-1 rounded-full bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]">
              {currentQuestion.category}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
            <Clock className="w-5 h-5" />
            <span className={`font-mono ${timeLeft < 60 ? 'text-[var(--color-error)]' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] rounded-full"
          />
        </div>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-8"
      >
        <h2 className="text-2xl font-semibold mb-4 text-[var(--color-text-heading)]">{currentQuestion.question}</h2>
        <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
          <span className={`px-2 py-1 rounded ${
            currentQuestion.difficulty === 'Easy' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
            currentQuestion.difficulty === 'Medium' ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]' :
            'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)]'
          }`}>
            {currentQuestion.difficulty}
          </span>
          <span>•</span>
          <span>{currentQuestion.type}</span>
        </div>
      </motion.div>

      {/* Answer Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Your Answer</h3>
          <button
            onClick={toggleRecording}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRecording
                ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] hover:bg-[rgba(239,68,68,0.2)]'
                : 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)] hover:bg-[rgba(37,99,235,0.2)]'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isRecording ? 'Stop Recording' : 'Voice Answer'}</span>
          </button>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here or use voice input..."
          className="w-full h-48 resize-none bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4 text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]"
          disabled={isRecording}
        />

        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center space-x-2 text-[var(--color-error)]"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--color-error)] animate-pulse"></div>
            <span className="text-sm">Recording...</span>
          </motion.div>
        )}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-heading)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-heading)]" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
          >
            <SkipForward className="w-5 h-5 text-[var(--color-text-heading)]" />
            <span>Skip</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleEndInterview}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] hover:bg-[rgba(239,68,68,0.2)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-error)]" />
            <span>End Interview</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!answer.trim() && !isRecording}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] hover:bg-[var(--color-primary-blue-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              <>
                <Check className="w-5 h-5 text-[var(--color-text-heading)]" />
                <span>Submit</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-5 h-5 text-[var(--color-text-heading)]" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewInterface;
