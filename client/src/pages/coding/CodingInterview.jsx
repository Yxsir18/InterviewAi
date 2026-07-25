import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Send,
  Clock,
  Code,
  Terminal,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  History,
  Settings,
  X,
  Sparkles,
  Eye,
  Edit,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
  Layout,
  ArrowRight,
} from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import axios from 'axios';
import toast from 'react-hot-toast';
import PremiumButton from '../../components/ui/PremiumButton';
import PremiumCard from '../../components/ui/PremiumCard';

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

const CodingInterview = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [codeHistory, setCodeHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHints, setShowHints] = useState(false);
  const [languagePage, setLanguagePage] = useState(0);
  const languagesPerPage = 4;

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  useEffect(() => {
    let interval;
    if (interview?.status === 'in_progress') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interview?.status]);

  useEffect(() => {
    // Auto-save every 30 seconds
    autoSaveRef.current = setInterval(() => {
      if (code && interview?.status === 'in_progress') {
        saveCurrentCode();
      }
    }, 30000);

    return () => clearInterval(autoSaveRef.current);
  }, [code, interview?.status]);

  const loadInterview = async () => {
    try {
      const response = await axios.get(`/api/coding-interview/${interviewId}`);
      setInterview(response.data.data);
      const interviewLanguage = response.data.data.currentSubmission?.language || response.data.data.language || 'javascript';
      setCode(response.data.data.currentSubmission?.code || response.data.data.problem?.starterCode?.[interviewLanguage] || '');
      setLanguage(interviewLanguage);
    } catch (error) {
      console.error('Error loading interview:', error);
      toast.error('Failed to load interview');
    }
  };

  const saveCurrentCode = async () => {
    try {
      await axios.post('/api/coding-interview/save', {
        interviewId,
        code,
        language,
      });
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const response = await axios.post('/api/coding-interview/run', {
        interviewId,
        code,
        language,
        input,
      });

      setOutput(response.data.data.output || response.data.data.error || 'No output');
      toast.success('Code executed successfully');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(error.response?.data?.message || 'Failed to execute code');
      toast.error('Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/coding-interview/submit', {
        interviewId,
        code,
        language,
      });

      setTestResults(response.data.data.testResults);
      toast.success('Solution submitted successfully');

      if (response.data.data.status === 'completed') {
        // Show review
        setInterview(prev => ({
          ...prev,
          status: 'completed',
          review: response.data.data.review,
        }));
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error('Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    
    // Try to generate a completely new problem for the new language
    try {
      const topic = interview.title.split(' - ')[0]; // Extract topic from title
      const difficulty = interview.difficulty || 'Medium';
      
      console.log('Generating new problem for language:', { topic, difficulty, language: newLanguage });
      
      const response = await axios.post('/api/coding-interview/generate-problem', {
        topic: topic,
        difficulty: difficulty,
        language: newLanguage,
      }, {
        timeout: 30000, // 30 second timeout
      });
      
      const newProblem = response.data.data;
      
      // Validate the response
      if (!newProblem || !newProblem.description) {
        throw new Error('Invalid problem response from AI');
      }
      
      // Update the interview with the completely new problem
      setInterview(prev => ({
        ...prev,
        language: newLanguage,
        problem: {
          title: newProblem.title || `${difficulty} ${newLanguage} Problem`,
          description: newProblem.description || 'Solve the given problem',
          examples: newProblem.examples || [],
          constraints: newProblem.constraints || [],
          starterCode: {
            ...prev.problem.starterCode,
            [newLanguage]: newProblem.starterCode || getDefaultStarterCode(newLanguage),
          },
        },
      }));
      
      const starterCode = newProblem?.starterCode || getDefaultStarterCode(newLanguage);
      setCode(starterCode);
      
      toast.success(`Generated new ${newLanguage} problem`);
    } catch (error) {
      console.error('Error generating language-specific problem:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error type:', error.code);
      
      // Log specific validation errors
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        error.response.data.errors.forEach((err, index) => {
          console.error(`Error ${index + 1}:`, err);
        });
      }
      
      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED') {
        toast.error('AI generation timed out, using fallback');
      } else if (error.response?.status === 400) {
        toast.error('AI validation error, using fallback');
      } else {
        toast.error('AI generation failed, using fallback');
      }
      
      // Fallback: Use pre-defined language-specific problems
      const fallbackProblem = getFallbackProblem(newLanguage, interview.difficulty);
      
      setInterview(prev => ({
        ...prev,
        language: newLanguage,
        problem: fallbackProblem,
      }));
      
      const starterCode = fallbackProblem.starterCode?.[newLanguage] || getDefaultStarterCode(newLanguage);
      setCode(starterCode);
    }
  };

  const getFallbackProblem = (lang, difficulty) => {
    const baseStarterCode = {
      javascript: `// Write your JavaScript solution here
function solution(arr) {
  // Your code here
  return result;
}`,
      typescript: `// Write your TypeScript solution here
function solution(arr: number[]): number {
  // Your code here
  return result;
}`,
      python: `# Write your Python solution here
def solution(arr):
    # Your code here
    return result`,
      java: `// Write your Java solution here
public class Solution {
    public int solution(int[] arr) {
        // Your code here
        return result;
    }
}`,
      cpp: `// Write your C++ solution here
#include <vector>
using namespace std;

class Solution {
public:
    int solution(vector<int>& arr) {
        // Your code here
        return result;
    }
};`,
      go: `// Write your Go solution here
package main

func solution(arr []int) int {
    // Your code here
    return result
}`,
      rust: `// Write your Rust solution here
fn solution(arr: Vec<i32>) -> i32 {
    // Your code here
    result
}`,
      csharp: `// Write your C# solution here
public class Solution {
    public int Solution(int[] arr) {
        // Your code here
        return result;
    }
}`,
      php: `// Write your PHP solution here
function solution($arr) {
    // Your code here
    return $result;
}`,
      ruby: `# Write your Ruby solution here
def solution(arr)
  # Your code here
  result
end`,
    };

    const problems = {
      javascript: {
        title: `${difficulty} JavaScript Problem`,
        description: 'Write a JavaScript function to solve the given problem. Focus on using modern ES6+ features and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of array elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of array elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty arrays',
        ],
        starterCode: baseStarterCode,
      },
      typescript: {
        title: `${difficulty} TypeScript Problem`,
        description: 'Write a TypeScript function to solve the given problem. Focus on type safety and modern TypeScript features.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of array elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of array elements' },
        ],
        constraints: [
          'Use proper TypeScript types',
          'Time complexity should be O(n)',
          'Handle edge cases like empty arrays',
        ],
        starterCode: baseStarterCode,
      },
      python: {
        title: `${difficulty} Python Problem`,
        description: 'Write a Python function to solve the given problem. Focus on using Pythonic code and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of list elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of list elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty lists',
        ],
        starterCode: baseStarterCode,
      },
      java: {
        title: `${difficulty} Java Problem`,
        description: 'Write a Java method to solve the given problem. Focus on proper Java conventions and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of array elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of array elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty arrays',
        ],
        starterCode: baseStarterCode,
      },
      cpp: {
        title: `${difficulty} C++ Problem`,
        description: 'Write a C++ function to solve the given problem. Focus on modern C++ features and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of vector elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of vector elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty vectors',
        ],
        starterCode: baseStarterCode,
      },
      go: {
        title: `${difficulty} Go Problem`,
        description: 'Write a Go function to solve the given problem. Focus on idiomatic Go code and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of slice elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of slice elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty slices',
        ],
        starterCode: baseStarterCode,
      },
      rust: {
        title: `${difficulty} Rust Problem`,
        description: 'Write a Rust function to solve the given problem. Focus on memory safety and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of vector elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of vector elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty vectors',
        ],
        starterCode: baseStarterCode,
      },
      csharp: {
        title: `${difficulty} C# Problem`,
        description: 'Write a C# method to solve the given problem. Focus on modern C# features and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of array elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of array elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty arrays',
        ],
        starterCode: baseStarterCode,
      },
      php: {
        title: `${difficulty} PHP Problem`,
        description: 'Write a PHP function to solve the given problem. Focus on modern PHP features and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of array elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of array elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty arrays',
        ],
        starterCode: baseStarterCode,
      },
      ruby: {
        title: `${difficulty} Ruby Problem`,
        description: 'Write a Ruby method to solve the given problem. Focus on idiomatic Ruby code and efficient algorithms.',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of array elements' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of array elements' },
        ],
        constraints: [
          'Time complexity should be O(n)',
          'Space complexity should be O(1)',
          'Handle edge cases like empty arrays',
        ],
        starterCode: baseStarterCode,
      },
    };

    return problems[lang] || problems.javascript;
  };

  const getDefaultStarterCode = (lang) => {
    const defaults = {
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
    };
    return defaults[lang] || '// Write your solution here\n';
  };

  const handleNextQuestion = async () => {
    try {
      const response = await axios.post('/api/coding-interview/start', {
        title: `${interview.title.split(' - ')[0]} - ${interview.difficulty}`,
        description: `Coding interview on ${interview.title.split(' - ')[0]}`,
        difficulty: interview.difficulty,
        language: language,
        timeLimit: interview.timeLimit,
        problem: null, // Let AI generate a new problem
      });

      toast.success('Next question generated!');
      navigate(`/dashboard/interview/coding/${response.data.data.interviewId}`);
    } catch (error) {
      console.error('Error generating next question:', error);
      toast.error('Failed to generate next question');
    }
  };

  const formatCode = () => {
    // Basic code formatting based on language
    let formattedCode = code;
    
    if (language === 'javascript' || language === 'typescript') {
      // Simple JS/TS formatting
      formattedCode = formattedCode
        .replace(/\s+/g, ' ')
        .replace(/;\s*/g, ';\n')
        .replace(/\{\s*/g, ' {\n  ')
        .replace(/\}\s*/g, '\n}\n')
        .replace(/,\s*/g, ', ');
    } else if (language === 'python') {
      // Python formatting
      formattedCode = formattedCode
        .replace(/\s+/g, ' ')
        .replace(/:\s*/g, ':\n  ');
    }
    
    setCode(formattedCode);
    toast.success('Code formatted');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(codeHistory[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(codeHistory[historyIndex + 1]);
    }
  };

  useEffect(() => {
    if (code && isEditMode) {
      setCodeHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        if (newHistory[newHistory.length - 1] !== code) {
          return [...newHistory, code];
        }
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, codeHistory.length));
    }
  }, [code, isEditMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="glass-card border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-heading)]">{interview.title}</h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                {interview.difficulty} • {interview.language}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className="flex items-center space-x-2 bg-[var(--color-bg-secondary)] px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
              <span className="text-[var(--color-text-heading)] font-mono">{formatTime(timer)}</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLanguagePage(prev => Math.max(0, prev - 1))}
                disabled={languagePage === 0}
                className="p-1 hover:bg-[var(--color-hover)] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] rotate-180" />
              </button>
              <div className="flex items-center space-x-1">
                {LANGUAGES.slice(languagePage * languagesPerPage, (languagePage + 1) * languagesPerPage).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    disabled={interview.status === 'completed'}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      language === lang.id
                        ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)]'
                    }`}
                  >
                    {lang.icon}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setLanguagePage(prev => Math.min(Math.ceil(LANGUAGES.length / languagesPerPage) - 1, prev + 1))}
                disabled={languagePage >= Math.ceil(LANGUAGES.length / languagesPerPage) - 1}
                className="p-1 hover:bg-[var(--color-hover)] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
              </button>
            </div>

            {/* Edit/Read Mode Toggle */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              title={isEditMode ? 'Switch to Read Mode' : 'Switch to Edit Mode'}
            >
              {isEditMode ? (
                <Eye className="w-5 h-5 text-[var(--color-text-muted)]" />
              ) : (
                <Edit className="w-5 h-5 text-[var(--color-accent-primary)]" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-[var(--color-text-muted)]" />
              ) : (
                <Maximize2 className="w-5 h-5 text-[var(--color-text-muted)]" />
              )}
            </button>

            {/* Split View Toggle */}
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              title={isSplitView ? 'Exit Split View' : 'Enter Split View'}
            >
              <Layout className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>

            {/* History Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
            >
              <History className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>

            {/* Hints Button */}
            <button
              onClick={() => setShowHints(!showHints)}
              className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              title="Show Hints"
            >
              <Settings className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-6 py-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[var(--color-bg-primary)]' : ''}`}>
        <div className={`grid ${isSplitView ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {/* Problem Description */}
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center">
                <Code className="w-5 h-5 mr-2 text-[var(--color-accent-primary)]" />
                Problem Description
              </h2>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
              >
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
            </div>
            <div className="text-[var(--color-text-secondary)] space-y-4">
              <p>{interview.problem?.description}</p>
              
              {showHints && (
                <div className="bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-[var(--color-accent-primary)] mb-2">💡 Hints</h4>
                  <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-2">
                    <li>Start by understanding the problem requirements and constraints</li>
                    <li>Consider the time and space complexity requirements</li>
                    <li>Think about edge cases and boundary conditions</li>
                    <li>Break down the problem into smaller sub-problems</li>
                    <li>Consider using appropriate data structures for the problem type</li>
                  </ul>
                </div>
              )}
              
              {interview.problem?.examples && interview.problem.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-accent-primary)] mb-2">Examples:</h3>
                  {interview.problem.examples.map((example, index) => (
                    <div key={index} className="bg-[var(--color-surface)] rounded-lg p-3 mb-2">
                      <p className="text-sm text-[var(--color-text-muted)]">Input: {example.input}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">Output: {example.output}</p>
                      {example.explanation && (
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">{example.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {interview.problem?.constraints && interview.problem.constraints.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-accent-primary)] mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside text-sm text-[var(--color-text-muted)] space-y-1">
                    {interview.problem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </PremiumCard>

          {/* Code Editor */}
          <PremiumCard className="overflow-hidden p-0">
            <div className="border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-muted)]">Code Editor</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  <Undo className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= codeHistory.length - 1}
                  className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo"
                >
                  <Redo className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
                <button
                  onClick={formatCode}
                  className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
                  title="Format Code"
                >
                  <Settings className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
                <button
                  onClick={saveCurrentCode}
                  className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
                  title="Save code"
                >
                  <Save className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>
            <div className="h-[400px]">
              <CodeEditor
                language={language}
                value={code}
                onChange={setCode}
                height="400px"
                readOnly={!isEditMode || interview.status === 'completed'}
              />
            </div>
          </PremiumCard>
        </div>

        {/* Input/Output Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Input */}
          <PremiumCard className="p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              Input
            </h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input (if required)..."
              className="w-full h-32 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] resize-none"
            />
          </PremiumCard>

          {/* Output */}
          <PremiumCard className="p-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3 flex items-center">
              <Terminal className="w-4 h-4 mr-2" />
              Output
            </h3>
            <div className="w-full h-32 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] overflow-auto font-mono text-sm">
              {output || 'Output will appear here...'}
            </div>
          </PremiumCard>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          {interview.status !== 'completed' ? (
            <>
              <PremiumButton
                onClick={handleRunCode}
                disabled={isRunning}
                loading={isRunning}
                icon={Play}
                variant="secondary"
              >
                Run Code
              </PremiumButton>

              <PremiumButton
                onClick={handleSubmitSolution}
                disabled={isSubmitting}
                loading={isSubmitting}
                icon={Sparkles}
              >
                Submit Solution
              </PremiumButton>
            </>
          ) : (
            <PremiumButton
              onClick={handleNextQuestion}
              icon={ArrowRight}
              variant="secondary"
            >
              Next Question
            </PremiumButton>
          )}
        </div>

        {/* Test Results */}
        {testResults && testResults.length > 0 && (
          <PremiumCard className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Test Results</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {testResults.filter(r => r.passed).length}/{testResults.length} passed
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden ${
                    result.passed ? 'border-[var(--color-success)]/30' : 'border-[var(--color-danger)]/30'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between p-4 ${
                      result.passed ? 'bg-[var(--color-success)]/5' : 'bg-[var(--color-danger)]/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {result.passed ? (
                        <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                      ) : (
                        <XCircle className="w-5 h-5 text-[var(--color-danger)]" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">Test Case {index + 1}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Execution time: {result.executionTime}ms</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${result.passed ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                      {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="p-4 bg-[var(--color-bg-secondary)] space-y-2">
                    <div className="text-sm">
                      <span className="text-[var(--color-text-muted)]">Input: </span>
                      <code className="text-[var(--color-text-primary)] font-mono">{result.input || 'No input'}</code>
                    </div>
                    <div className="text-sm">
                      <span className="text-[var(--color-text-muted)]">Expected: </span>
                      <code className="text-[var(--color-success)] font-mono">{result.expectedOutput || 'No expected output'}</code>
                    </div>
                    <div className="text-sm">
                      <span className="text-[var(--color-text-muted)]">Actual: </span>
                      <code className={`${result.passed ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'} font-mono`}>
                        {result.actualOutput || 'No output'}
                      </code>
                    </div>
                    {result.error && (
                      <div className="text-sm">
                        <span className="text-[var(--color-text-muted)]">Error: </span>
                        <code className="text-[var(--color-danger)] font-mono">{result.error}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}

        {/* AI Review */}
        {interview.review && (
          <PremiumCard className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">AI Code Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-[var(--color-surface)] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{interview.review.overallScore}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Overall Score</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{interview.review.correctness}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Correctness</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{interview.review.readability}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Readability</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{interview.review.bestPractices}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Best Practices</p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{interview.review.timeComplexity}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Time Complexity</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-accent-primary)] mb-2">Feedback</h4>
                <p className="text-[var(--color-text-secondary)]">{interview.review.feedback}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-success)] mb-2">Strengths</h4>
                <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1">
                  {interview.review.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-danger)] mb-2">Weaknesses</h4>
                <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1">
                  {interview.review.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-accent-secondary)] mb-2">Improvement Suggestions</h4>
                <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-1">
                  {interview.review.improvementSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Submission History */}
        {showHistory && interview.submissions && interview.submissions.length > 0 && (
          <PremiumCard className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Submission History</h3>
            <div className="space-y-3">
              {interview.submissions.map((submission, index) => (
                <div key={index} className="bg-[var(--color-surface)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-text-muted)]">
                      Submission {index + 1} • {new Date(submission.timestamp).toLocaleString()}
                    </span>
                    <span className={`text-sm font-medium ${
                      submission.status === 'success' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-[var(--color-text-muted)]">
                    <span>Test Cases: {submission.testCasesPassed}/{submission.totalTestCases}</span>
                    {submission.executionTime && <span>Time: {submission.executionTime}ms</span>}
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}
      </div>
    </div>
  );
};

export default CodingInterview;
