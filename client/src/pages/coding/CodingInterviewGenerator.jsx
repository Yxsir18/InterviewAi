import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  Database,
  Hash,
  Layers,
  ArrowRight,
  Clock,
  Target,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TOPICS = [
  { id: 'Arrays', name: 'Arrays', icon: <Hash className="w-6 h-6" />, description: 'Array manipulation and algorithms' },
  { id: 'Strings', name: 'Strings', icon: <Code className="w-6 h-6" />, description: 'String processing and manipulation' },
  { id: 'Linked Lists', name: 'Linked Lists', icon: <Layers className="w-6 h-6" />, description: 'Linked list operations' },
  { id: 'Trees', name: 'Trees', icon: <Target className="w-6 h-6" />, description: 'Tree traversal and algorithms' },
  { id: 'Graphs', name: 'Graphs', icon: <Layers className="w-6 h-6" />, description: 'Graph algorithms' },
  { id: 'Dynamic Programming', name: 'Dynamic Programming', icon: <Code className="w-6 h-6" />, description: 'DP problems and solutions' },
  { id: 'Sorting', name: 'Sorting', icon: <Hash className="w-6 h-6" />, description: 'Sorting algorithms' },
  { id: 'Searching', name: 'Searching', icon: <Target className="w-6 h-6" />, description: 'Search algorithms' },
];

const DIFFICULTIES = [
  { id: 'Easy', name: 'Easy', color: 'green', description: 'Beginner level problems' },
  { id: 'Medium', name: 'Medium', color: 'yellow', description: 'Intermediate level problems' },
  { id: 'Hard', name: 'Hard', color: 'red', description: 'Advanced level problems' },
];

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'java', name: 'Java', icon: 'JV' },
  { id: 'cpp', name: 'C++', icon: 'C++' },
  { id: 'go', name: 'Go', icon: 'GO' },
  { id: 'rust', name: 'Rust', icon: 'RS' },
  { id: 'csharp', name: 'C#', icon: 'C#' },
  { id: 'php', name: 'PHP', icon: 'PHP' },
  { id: 'ruby', name: 'Ruby', icon: 'RB' },
];

const TIME_LIMITS = [
  { id: 15, name: '15 minutes' },
  { id: 30, name: '30 minutes' },
  { id: 45, name: '45 minutes' },
  { id: 60, name: '60 minutes' },
];

const CodingInterviewGenerator = () => {
  const [selectedTopic, setSelectedTopic] = useState('Arrays');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [customProblem, setCustomProblem] = useState(false);
  const [languagePage, setLanguagePage] = useState(0);
  const languagesPerPage = 4;

  const navigate = useNavigate();

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const problem = customProblem
        ? {
            title: 'Custom Problem',
            description: 'Solve the custom problem provided by your interviewer',
            examples: [],
            constraints: [],
            starterCode: {
              javascript: '// Write your solution here\n',
              typescript: '// Write your solution here\n',
              python: '# Write your solution here\n',
              java: '// Write your solution here\n',
              cpp: '// Write your solution here\n',
              go: '// Write your solution here\n',
              rust: '// Write your solution here\n',
              csharp: '// Write your solution here\n',
              php: '// Write your solution here\n',
              ruby: '# Write your solution here\n',
            },
          }
        : await generateProblem();

      const response = await axios.post('/api/coding-interview/start', {
        title: `${selectedTopic} - ${selectedDifficulty}`,
        description: `Coding interview on ${selectedTopic}`,
        difficulty: selectedDifficulty,
        language: selectedLanguage,
        timeLimit: selectedTimeLimit,
        problem,
      });

      toast.success('Coding interview started successfully!');
      navigate(`/dashboard/interview/coding/${response.data.data.interviewId}`);
    } catch (error) {
      console.error('Error starting coding interview:', error);
      toast.error('Failed to start coding interview');
    } finally {
      setLoading(false);
    }
  };

  const generateProblem = async () => {
    try {
      const response = await axios.post('/api/coding-interview/generate-problem', {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        language: selectedLanguage,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error generating problem:', error);
      // Return default problem if AI fails
      return {
        title: `${selectedTopic} Problem`,
        description: `Solve this ${selectedDifficulty} ${selectedTopic} problem`,
        examples: [
          {
            input: 'Example input',
            output: 'Example output',
            explanation: 'Example explanation',
          },
        ],
        constraints: [
          '1 <= n <= 10^5',
          '-10^9 <= arr[i] <= 10^9',
        ],
        starterCode: {
          javascript: '// Write your solution here\n',
          python: '# Write your solution here\n',
          java: '// Write your solution here\n',
          cpp: '// Write your solution here\n',
        },
      };
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
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">Start Coding Interview</h1>
        <p className="text-[var(--color-text-muted)]">Practice coding problems with real-time execution and AI feedback</p>
      </motion.div>

      {/* Topic Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Select Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOPICS.map((topic) => (
            <motion.button
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTopic(topic.id)}
              className={`p-4 rounded-xl border transition-all ${
                selectedTopic === topic.id
                  ? 'bg-[rgba(37,99,235,0.1)] border-[var(--color-primary-blue)] text-[var(--color-primary-blue)]'
                  : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 text-[var(--color-text-muted)]'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {topic.icon}
                <span className="font-medium">{topic.name}</span>
                <span className="text-xs opacity-70">{topic.description}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Difficulty and Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Select Difficulty</h2>
          <div className="space-y-3">
            {DIFFICULTIES.map((difficulty) => (
              <motion.button
                key={difficulty.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                  selectedDifficulty === difficulty.id
                    ? 'bg-primary-600/20 border-primary-500'
                    : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    difficulty.color === 'green' ? 'bg-[var(--color-success)]' :
                    difficulty.color === 'yellow' ? 'bg-[var(--color-warning)]' :
                    'bg-[var(--color-error)]'
                  }`}></div>
                  <span className="font-medium text-[var(--color-text-body)]">{difficulty.name}</span>
                </div>
                <span className="text-sm text-[var(--color-text-muted)]">{difficulty.description}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Select Language</h2>
          <div className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => setLanguagePage(prev => Math.max(0, prev - 1))}
              disabled={languagePage === 0}
              className="p-2 hover:bg-[var(--color-hover)] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] rotate-180" />
            </button>
            <span className="text-sm text-[var(--color-text-muted)]">Page {languagePage + 1} of {Math.ceil(LANGUAGES.length / languagesPerPage)}</span>
            <button
              onClick={() => setLanguagePage(prev => Math.min(Math.ceil(LANGUAGES.length / languagesPerPage) - 1, prev + 1))}
              disabled={languagePage >= Math.ceil(LANGUAGES.length / languagesPerPage) - 1}
              className="p-2 hover:bg-[var(--color-hover)] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.slice(languagePage * languagesPerPage, (languagePage + 1) * languagesPerPage).map((lang) => (
              <motion.button
                key={lang.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center space-y-2 ${
                  selectedLanguage === lang.id
                    ? 'bg-[rgba(37,99,235,0.1)] border-[var(--color-primary-blue)] text-[var(--color-primary-blue)]'
                    : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 text-[var(--color-text-muted)]'
                }`}
              >
                <span className="text-2xl font-bold">{lang.icon}</span>
                <span className="font-medium">{lang.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Time Limit Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Select Time Limit</h2>
        <div className="flex items-center space-x-3">
          {TIME_LIMITS.map((limit) => (
            <motion.button
              key={limit.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTimeLimit(limit.id)}
              className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-center space-x-2 ${
                selectedTimeLimit === limit.id
                  ? 'bg-[rgba(37,99,235,0.1)] border-[var(--color-primary-blue)] text-[var(--color-primary-blue)]'
                  : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 text-[var(--color-text-muted)]'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">{limit.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Custom Problem Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-[var(--color-text-heading)]">Use Custom Problem</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Skip AI problem generation and use a custom problem</p>
          </div>
          <button
            onClick={() => setCustomProblem(!customProblem)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              customProblem ? 'bg-[var(--color-accent-purple)]' : 'bg-[var(--color-bg-secondary)]'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-text-heading)] transition-transform ${
                customProblem ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Summary and Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Interview Summary</h3>
            <div className="flex items-center space-x-6 text-sm text-[var(--color-text-muted)]">
              <span>Topic: {selectedTopic}</span>
              <span>Difficulty: {selectedDifficulty}</span>
              <span>Language: {selectedLanguage}</span>
              <span>Time: {selectedTimeLimit} min</span>
            </div>
          </div>
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[var(--color-text-heading)] border-t-transparent rounded-full animate-spin" />
                <span className="text-[var(--color-text-heading)] font-medium">Starting...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5 text-[var(--color-text-heading)]" />
                <span className="text-[var(--color-text-heading)] font-medium">Start Interview</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CodingInterviewGenerator;
