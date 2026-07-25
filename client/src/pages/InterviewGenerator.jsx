import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startInterview } from '../redux/slices/interviewSlice';
import { motion } from 'framer-motion';
import {
  Code,
  Database,
  Server,
  Cpu,
  Layers,
  GitBranch,
  FileText,
  Users,
  Settings,
  ArrowRight,
  Zap,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import PremiumCard from '../components/ui/PremiumCard';
import { FeatureCard } from '../components/ui/PremiumCard';
import PremiumButton from '../components/ui/PremiumButton';

const interviewTypes = [
  { id: 'MERN Stack', name: 'MERN Stack', icon: <Layers className="w-6 h-6" />, description: 'MongoDB, Express, React, Node.js' },
  { id: 'React', name: 'React', icon: <Code className="w-6 h-6" />, description: 'React.js, Hooks, Redux, Next.js' },
  { id: 'Node.js', name: 'Node.js', icon: <Server className="w-6 h-6" />, description: 'Express, REST APIs, Middleware' },
  { id: 'MongoDB', name: 'MongoDB', icon: <Database className="w-6 h-6" />, description: 'NoSQL, Aggregation, Indexing' },
  { id: 'JavaScript', name: 'JavaScript', icon: <Zap className="w-6 h-6" />, description: 'ES6+, Async/Await, DOM' },
  { id: 'System Design', name: 'System Design', icon: <GitBranch className="w-6 h-6" />, description: 'Scalability, Architecture' },
  { id: 'Data Structures', name: 'Data Structures', icon: <Cpu className="w-6 h-6" />, description: 'Arrays, Trees, Graphs' },
  { id: 'SQL', name: 'SQL', icon: <Database className="w-6 h-6" />, description: 'Queries, Optimization, Joins' },
  { id: 'Python', name: 'Python', icon: <Code className="w-6 h-6" />, description: 'Python 3, Django, Flask' },
  { id: 'Java', name: 'Java', icon: <Code className="w-6 h-6" />, description: 'OOP, Spring, Multithreading' },
  { id: 'DevOps', name: 'DevOps', icon: <Settings className="w-6 h-6" />, description: 'Docker, Kubernetes, CI/CD' },
  { id: 'HR', name: 'HR', icon: <Users className="w-6 h-6" />, description: 'Behavioral questions' },
];

const difficulties = [
  { id: 'Easy', name: 'Easy', color: 'green', description: 'Fundamental concepts' },
  { id: 'Medium', name: 'Medium', color: 'yellow', description: 'Intermediate level' },
  { id: 'Hard', name: 'Hard', color: 'red', description: 'Advanced topics' },
];

const lengths = [
  { id: 5, name: '5 Questions', duration: '~15 min' },
  { id: 10, name: '10 Questions', duration: '~30 min' },
  { id: 20, name: '20 Questions', duration: '~60 min' },
];

const interviewModes = [
  { id: 'standard', name: 'Standard Mode', icon: <FileText className="w-5 h-5" />, description: 'Pre-generated questions with structured answers' },
  { id: 'conversational', name: 'Conversational AI', icon: <MessageSquare className="w-5 h-5" />, description: 'AI interviewer with adaptive follow-up questions' },
];

const InterviewGenerator = () => {
  const [selectedType, setSelectedType] = useState('MERN Stack');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedLength, setSelectedLength] = useState(10);
  const [selectedMode, setSelectedMode] = useState('standard');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: interviewLoading } = useSelector((state) => state.interview);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      if (selectedMode === 'conversational') {
        // Start conversational interview
        const response = await axios.post('/api/interview/conversational/start', {
          type: selectedType,
          difficulty: selectedDifficulty,
          length: selectedLength,
        });

        console.log('Conversational interview response:', response.data.data);
        toast.success('Conversational interview started successfully!');
        navigate(`/dashboard/interview/conversational/${response.data.data.interviewId}`);
      } else {
        // Start standard interview
        const result = await dispatch(startInterview({
          type: selectedType,
          difficulty: selectedDifficulty,
          length: selectedLength,
        })).unwrap();

        toast.success('Interview started successfully!');
        navigate(`/dashboard/interview/${result.data.interview.id}`);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error(error || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
          <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">Start New Interview</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">Customize your interview parameters and start practicing</p>
      </motion.div>

      {/* Interview Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Select Interview Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {interviewTypes.map((type) => (
            <FeatureCard
              key={type.id}
              icon={type.icon}
              title={type.name}
              description={type.description}
              onClick={() => setSelectedType(type.id)}
              className={selectedType === type.id ? 'border-[var(--color-primary-blue)] bg-[var(--color-hover)]' : ''}
            />
          ))}
        </div>
      </motion.div>

      {/* Interview Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Select Interview Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviewModes.map((mode) => (
            <FeatureCard
              key={mode.id}
              icon={mode.icon}
              title={mode.name}
              description={mode.description}
              onClick={() => setSelectedMode(mode.id)}
              className={selectedMode === mode.id ? 'border-[var(--color-primary-blue)] bg-[var(--color-hover)]' : ''}
            />
          ))}
        </div>
      </motion.div>

      {/* Difficulty and Length Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Select Difficulty</h2>
          <div className="space-y-3">
            {difficulties.map((difficulty) => (
              <PremiumCard
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`cursor-pointer ${selectedDifficulty === difficulty.id ? 'border-[var(--color-primary-blue)] bg-[var(--color-hover)]' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      difficulty.color === 'green' ? 'bg-[var(--color-success)]' :
                      difficulty.color === 'yellow' ? 'bg-[var(--color-warning)]' :
                      'bg-[var(--color-error)]'
                    }`}></div>
                    <span className="font-medium text-[var(--color-text-heading)]">{difficulty.name}</span>
                  </div>
                  <span className="text-sm text-[var(--color-text-muted)]">{difficulty.description}</span>
                </div>
              </PremiumCard>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Select Interview Length</h2>
          <div className="space-y-3">
            {lengths.map((length) => (
              <PremiumCard
                key={length.id}
                onClick={() => setSelectedLength(length.id)}
                className={`cursor-pointer ${selectedLength === length.id ? 'border-[var(--color-primary-blue)] bg-[var(--color-hover)]' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[var(--color-text-heading)]">{length.name}</span>
                  <span className="text-sm text-[var(--color-text-muted)]">{length.duration}</span>
                </div>
              </PremiumCard>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Summary and Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-heading)]">Interview Summary</h3>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
              <span>Type: <span className="text-[var(--color-text-heading)]">{selectedType}</span></span>
              <span>Difficulty: <span className="text-[var(--color-text-heading)]">{selectedDifficulty}</span></span>
              <span>Questions: <span className="text-[var(--color-text-heading)]">{selectedLength}</span></span>
            </div>
          </div>
          <PremiumButton
            onClick={handleStartInterview}
            loading={loading || interviewLoading}
            size="lg"
            icon={Sparkles}
          >
            Start Interview
          </PremiumButton>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewGenerator;
