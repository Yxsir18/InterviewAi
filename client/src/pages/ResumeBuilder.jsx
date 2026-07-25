import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Download,
  FileText,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Check,
  X,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Target,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Award,
  Printer,
  Share2,
  Undo,
  Redo,
  XCircle,
  MoreVertical,
  Settings,
  Layout,
  PanelLeft,
  PanelRight,
  Scan,
  Wrench,
  BookOpen,
  GraduationCap,
  Briefcase,
  Code,
  Award as Certificate,
  Globe,
  MessageSquare,
  Star,
  Tag,
  Layers,
  User,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(null);
  const [resume, setResume] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [aiLoading, setAiLoading] = useState({});
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalContent, setAiModalContent] = useState(null);
  const [showATSPanel, setShowATSPanel] = useState(false);
  const [showJobMatchPanel, setShowJobMatchPanel] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [panelWidth, setPanelWidth] = useState(45);
  const [isResizing, setIsResizing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showScoreCard, setShowScoreCard] = useState(true);
  const [mobileView, setMobileView] = useState('editor');
  const resumeRef = useRef(null);
  const autoSaveRef = useRef(null);

  const templates = [
    { id: 'modern-professional', name: 'Modern Professional', description: 'Clean and contemporary ATS-friendly' },
    { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'corporate', name: 'Corporate', description: 'Formal and business-focused' },
    { id: 'executive', name: 'Executive', description: 'Senior leadership style' },
    { id: 'student', name: 'Student', description: 'Entry-level and academic' },
    { id: 'software-engineer', name: 'Software Engineer', description: 'Tech-focused and technical' },
  ];

  // Auto-save functionality
  useEffect(() => {
    if (resume && !loading) {
      setSaveStatus('unsaved');
      
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      
      autoSaveRef.current = setTimeout(() => {
        autoSaveResume();
      }, 3000);
    }
    
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [resume]);

  useEffect(() => {
    if (id) {
      fetchResume();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  const fetchResume = async () => {
    try {
      const response = await axios.get(`/api/resume-builder/${id}`);
      setResume(response.data.data);
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const response = await axios.post('/api/resume-builder', {
        name: 'My Resume',
        template: 'modern-professional',
      });
      navigate(`/dashboard/resume/builder/${response.data.data._id}`);
    } catch (error) {
      toast.error('Failed to create resume');
    }
  };

  const autoSaveResume = async () => {
    if (!resume) return;
    setSaveStatus('saving');
    try {
      await axios.put(`/api/resume-builder/${resume._id}`, resume);
      setSaveStatus('saved');
      setLastSaved(new Date());
    } catch (error) {
      setSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  };

  const saveResume = async () => {
    if (!resume) return;
    setSaving(true);
    try {
      await axios.put(`/api/resume-builder/${resume._id}`, resume);
      setSaveStatus('saved');
      setLastSaved(new Date());
      toast.success('Resume saved successfully');
    } catch (error) {
      setSaveStatus('error');
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack([...redoStack, resume]);
    setUndoStack(undoStack.slice(0, -1));
    setResume(previousState);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack([...undoStack, resume]);
    setRedoStack(redoStack.slice(0, -1));
    setResume(nextState);
  };

  const addToUndoStack = (newResume) => {
    setUndoStack([...undoStack.slice(-19), resume]);
    setRedoStack([]);
  };

  const createVersion = async (versionName) => {
    if (!resume) return;
    try {
      await axios.post(`/api/resume-builder/${resume._id}/version`, {
        name: versionName,
      });
      await fetchResume();
      setShowVersionModal(false);
      toast.success('New version created');
    } catch (error) {
      toast.error('Failed to create version');
    }
  };

  const switchVersion = async (version) => {
    if (!resume) return;
    try {
      await axios.put(`/api/resume-builder/${resume._id}/version/${version}`);
      await fetchResume();
      toast.success(`Switched to version ${version}`);
    } catch (error) {
      toast.error('Failed to switch version');
    }
  };

  const generateAISummary = async () => {
    if (!resume) return;
    setAiLoading(prev => ({ ...prev, summary: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/ai/summary`, {
        experience: resume.versions[0].sections.find(s => s.type === 'experience')?.content || '',
        skills: resume.versions[0].sections.find(s => s.type === 'skills')?.content || '',
      });
      
      const summarySection = resume.versions[0].sections.find(s => s.type === 'summary');
      if (summarySection) {
        summarySection.content = response.data.data.summary;
        summarySection.aiImproved = true;
      } else {
        resume.versions[0].sections.push({
          id: Date.now().toString(),
          type: 'summary',
          title: 'Professional Summary',
          order: 0,
          content: response.data.data.summary,
          aiImproved: true,
        });
      }
      toast.success('Summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setAiLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const improveBullets = async (sectionId, bullets) => {
    if (!resume) return;
    setAiLoading(prev => ({ ...prev, [sectionId]: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/ai/bullets`, {
        bullets,
        role: 'Software Developer',
      });
      
      const section = resume.versions[0].sections.find(s => s.id === sectionId);
      if (section) {
        section.content = response.data.data.bullets;
        section.aiImproved = true;
      }
      toast.success('Bullet points improved');
    } catch (error) {
      toast.error('Failed to improve bullet points');
    } finally {
      setAiLoading(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const suggestSkills = async () => {
    if (!resume) return;
    setAiLoading(prev => ({ ...prev, skills: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/ai/skills`, {
        role: 'Software Developer',
        experience: resume.versions[0].sections.find(s => s.type === 'experience')?.content || '',
        currentSkills: resume.versions[0].sections.find(s => s.type === 'skills')?.content || [],
      });
      
      const skillsSection = resume.versions[0].sections.find(s => s.type === 'skills');
      if (skillsSection) {
        skillsSection.aiSuggestions = response.data.data.skills;
      }
      toast.success('Skills suggested');
    } catch (error) {
      toast.error('Failed to suggest skills');
    } finally {
      setAiLoading(prev => ({ ...prev, skills: false }));
    }
  };

  const generateProjects = async () => {
    if (!resume) return;
    setAiLoading(prev => ({ ...prev, projects: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/ai/projects`, {
        skills: resume.versions[0].sections.find(s => s.type === 'skills')?.content || [],
        role: 'Software Developer',
        count: 3,
      });
      
      const projectsSection = resume.versions[0].sections.find(s => s.type === 'projects');
      if (projectsSection) {
        projectsSection.content = response.data.data.projects;
        projectsSection.aiImproved = true;
      }
      toast.success('Projects generated');
    } catch (error) {
      toast.error('Failed to generate projects');
    } finally {
      setAiLoading(prev => ({ ...prev, projects: false }));
    }
  };

  // Enhanced AI functions
  const improveWithAI = async (type, content, field) => {
    if (!resume) return;
    setAiLoading(prev => ({ ...prev, [type]: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/ai/improve`, {
        type,
        content,
        field,
      });
      
      setAiModalContent({
        type,
        original: content,
        improved: response.data.data.improved,
        field,
      });
      setShowAIModal(true);
    } catch (error) {
      toast.error('Failed to improve with AI');
    } finally {
      setAiLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const applyAISuggestion = () => {
    if (!aiModalContent || !resume) return;
    
    const { type, improved, field } = aiModalContent;
    const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];
    
    if (type === 'summary') {
      const summarySection = currentVersion.sections.find(s => s.type === 'summary');
      if (summarySection) {
        summarySection.content = improved;
        summarySection.aiImproved = true;
      }
    } else if (type === 'experience') {
      const expSection = currentVersion.sections.find(s => s.type === 'experience');
      if (expSection && Array.isArray(expSection.content)) {
        const entry = expSection.content.find((e, i) => i === field.index);
        if (entry) {
          entry.description = improved;
          entry.aiImproved = true;
        }
      }
    } else if (type === 'project') {
      const projSection = currentVersion.sections.find(s => s.type === 'projects');
      if (projSection && Array.isArray(projSection.content)) {
        const entry = projSection.content.find((e, i) => i === field.index);
        if (entry) {
          entry.description = improved;
          entry.aiImproved = true;
        }
      }
    }
    
    setResume({ ...resume });
    setShowAIModal(false);
    setAiModalContent(null);
    toast.success('AI suggestion applied');
  };

  // ATS Analysis
  const analyzeATS = async () => {
    if (!resume) return;
    setAiLoading(prev => ({ ...prev, ats: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/analyze-ats`, {
        resume: resume.versions[0],
      });
      setAtsScore(response.data.data);
      setShowATSPanel(true);
      toast.success('ATS analysis complete');
    } catch (error) {
      toast.error('Failed to analyze ATS');
    } finally {
      setAiLoading(prev => ({ ...prev, ats: false }));
    }
  };

  // Job Description Matching
  const matchJobDescription = async () => {
    if (!resume || !jobDescription) return;
    setAiLoading(prev => ({ ...prev, jobMatch: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/match-job`, {
        resume: resume.versions[0],
        jobDescription,
      });
      setJobMatch(response.data.data);
      setShowJobMatchPanel(true);
      toast.success('Job match analysis complete');
    } catch (error) {
      toast.error('Failed to match job description');
    } finally {
      setAiLoading(prev => ({ ...prev, jobMatch: false }));
    }
  };

  const optimizeForJob = async () => {
    if (!resume || !jobDescription) return;
    setAiLoading(prev => ({ ...prev, optimize: true }));
    try {
      const response = await axios.post(`/api/resume-builder/${resume._id}/optimize-job`, {
        resume: resume.versions[0],
        jobDescription,
      });
      
      const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];
      currentVersion.sections = response.data.data.sections;
      setResume({ ...resume });
      toast.success('Resume optimized for job');
    } catch (error) {
      toast.error('Failed to optimize resume');
    } finally {
      setAiLoading(prev => ({ ...prev, optimize: false }));
    }
  };

  // Resume Scoring
  const calculateResumeScore = () => {
    if (!resume) return null;
    const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];
    
    let completion = 0;
    let totalFields = 0;
    let filledFields = 0;
    
    // Personal info
    const personalFields = ['fullName', 'email', 'phone', 'location'];
    personalFields.forEach(field => {
      totalFields++;
      if (currentVersion.personalInfo?.[field]) filledFields++;
    });
    
    // Sections
    const requiredSections = ['summary', 'experience', 'education', 'skills'];
    requiredSections.forEach(sectionType => {
      totalFields++;
      const section = currentVersion.sections.find(s => s.type === sectionType);
      if (section && section.content && (Array.isArray(section.content) ? section.content.length > 0 : section.content.trim())) {
        filledFields++;
      }
    });
    
    completion = Math.round((filledFields / totalFields) * 100);
    
    return {
      completion,
      ats: atsScore?.overall || 0,
      grammar: 95,
      readability: 90,
      keywordMatch: jobMatch?.matchPercentage || 0,
    };
  };

  const resumeScore = calculateResumeScore();

  const exportPDF = async () => {
    if (!resume) return;
    try {
      const response = await axios.get(`/api/resume-builder/${resume._id}/export/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const exportDOCX = async () => {
    if (!resume) return;
    try {
      const response = await axios.get(`/api/resume-builder/${resume._id}/export/docx`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.name}.docx`);
      document.body.appendChild(link);
      link.click();
      toast.success('DOCX exported successfully');
    } catch (error) {
      toast.error('Failed to export DOCX');
    }
  };

  const printResume = () => {
    if (!resumeRef.current) return;
    const printContent = resumeRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>${resume.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .resume-preview { max-width: 210mm; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="resume-preview">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const copyResume = async () => {
    if (!resume) return;
    const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];
    
    let text = `${currentVersion.personalInfo?.fullName || 'Your Name'}\n`;
    text += `${currentVersion.personalInfo?.email || ''} | ${currentVersion.personalInfo?.phone || ''} | ${currentVersion.personalInfo?.location || ''}\n\n`;
    
    currentVersion.sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order).forEach(section => {
      text += `${section.title}\n`;
      if (Array.isArray(section.content)) {
        text += section.content.join(', ') + '\n';
      } else {
        text += section.content + '\n';
      }
      text += '\n';
    });
    
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Resume copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy resume');
    }
  };

  const useResume = async () => {
    if (!resume) return;
    try {
      await axios.put(`/api/resume-builder/${resume._id}/set-default`);
      toast.success('Resume set as default for interviews');
    } catch (error) {
      toast.error('Failed to set default resume');
    }
  };

  const moveSection = (fromIndex, toIndex) => {
    if (!resume) return;
    addToUndoStack(resume);
    const sections = [...resume.versions[0].sections];
    const [movedSection] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, movedSection);
    
    sections.forEach((section, index) => {
      section.order = index;
    });
    
    resume.versions[0].sections = sections;
    setResume({ ...resume });
  };

  const addSection = (type) => {
    if (!resume) return;
    addToUndoStack(resume);
    const sectionTitles = {
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      certifications: 'Certifications',
      languages: 'Languages',
      interests: 'Interests',
      achievements: 'Achievements',
      custom: 'Custom Section',
    };

    resume.versions[0].sections.push({
      id: Date.now().toString(),
      type,
      title: sectionTitles[type],
      order: resume.versions[0].sections.length,
      content: type === 'skills' ? [] : type === 'experience' || type === 'education' || type === 'projects' || type === 'certifications' ? [] : '',
      isVisible: true,
      aiImproved: false,
      aiSuggestions: [],
    });
    setResume({ ...resume });
  };

  const removeSection = (sectionId) => {
    if (!resume) return;
    addToUndoStack(resume);
    resume.versions[0].sections = resume.versions[0].sections.filter(
      s => s.id !== sectionId
    );
    setResume({ ...resume });
  };

  const toggleSectionVisibility = (sectionId) => {
    if (!resume) return;
    addToUndoStack(resume);
    const section = resume.versions[0].sections.find(s => s.id === sectionId);
    if (section) {
      section.isVisible = !section.isVisible;
      setResume({ ...resume });
    }
  };

  // Panel resize handlers
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const container = document.getElementById('resume-builder-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newWidth > 20 && newWidth < 80) {
      setPanelWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove]);

  // Section configuration
  const sectionConfig = [
    { id: 'personal', title: 'Personal Information', icon: User },
    { id: 'summary', title: 'Professional Summary', icon: FileText },
    { id: 'experience', title: 'Work Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'projects', title: 'Projects', icon: Code },
    { id: 'skills', title: 'Skills', icon: Tag },
    { id: 'certifications', title: 'Certifications', icon: Certificate },
    { id: 'languages', title: 'Languages', icon: Globe },
    { id: 'achievements', title: 'Achievements', icon: Award },
    { id: 'custom', title: 'Custom Section', icon: Layers },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="w-8 h-8 text-[var(--color-primary-blue)] animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">No Resume Selected</h2>
          <button
            onClick={createNewResume}
            className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Create New Resume
          </button>
        </div>
      </div>
    );
  }

  const currentVersion = resume.versions.find(v => v.version === resume.currentVersion) || resume.versions[0];

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      {/* Premium Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-card)] sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text-heading)]">{resume.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
                  <span>Version {resume.currentVersion}</span>
                  <span>•</span>
                  <span className={`flex items-center ${saveStatus === 'saved' ? 'text-green-600' : saveStatus === 'saving' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {saveStatus === 'saving' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                    {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
                  </span>
                  <span>•</span>
                  <span>{formatLastSaved()}</span>
                </div>
              </div>
            </div>
            {/* Resume Score in Header */}
            {resumeScore && (
              <div className="flex items-center space-x-4 bg-[var(--color-bg-secondary)] px-4 py-2 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-[var(--color-text-muted)]">Completion</div>
                  <div className="text-sm font-bold text-[var(--color-text-heading)]">{resumeScore.completion}%</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-border)]"></div>
                <div className="text-center">
                  <div className="text-xs text-[var(--color-text-muted)]">ATS</div>
                  <div className="text-sm font-bold text-[var(--color-text-heading)]">{resumeScore.ats}%</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-border)]"></div>
                <div className="text-center">
                  <div className="text-xs text-[var(--color-text-muted)]">Grammar</div>
                  <div className="text-sm font-bold text-[var(--color-text-heading)]">{resumeScore.grammar}%</div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              {/* Undo/Redo Group */}
              <div className="flex items-center space-x-1 bg-[var(--color-bg-secondary)] rounded-lg p-1">
                <button
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  className="p-2 text-[var(--color-text-heading)] rounded hover:bg-[var(--color-hover)] transition-colors disabled:opacity-30"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className="p-2 text-[var(--color-text-heading)] rounded hover:bg-[var(--color-hover)] transition-colors disabled:opacity-30"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>

              {/* Analysis Tools Group */}
              <div className="flex items-center space-x-1 bg-[var(--color-bg-secondary)] rounded-lg p-1">
                <button
                  onClick={() => setShowATSPanel(!showATSPanel)}
                  className={`p-2 rounded transition-colors ${showATSPanel ? 'bg-[var(--color-primary-blue)] text-white' : 'text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]'}`}
                  title="ATS Analysis"
                >
                  <Scan className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowJobMatchPanel(!showJobMatchPanel)}
                  className={`p-2 rounded transition-colors ${showJobMatchPanel ? 'bg-[var(--color-primary-blue)] text-white' : 'text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]'}`}
                  title="Job Match"
                >
                  <Target className="w-4 h-4" />
                </button>
              </div>

              {/* Version & Save Group */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowVersionModal(true)}
                  className="px-3 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm font-medium"
                >
                  <Copy className="w-4 h-4 inline mr-1" />
                  Version
                </button>
                <button
                  onClick={saveResume}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 inline mr-1" />
                  )}
                  Save
                </button>
                <button
                  onClick={useResume}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <Share2 className="w-4 h-4 inline mr-1" />
                  Use This Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div id="resume-builder-container" className="flex-1 flex overflow-hidden hidden lg:flex">
        {/* Left Panel - Editor (40%) */}
        <div 
          className="flex flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden"
          style={{ width: `${panelWidth}%` }}
        >
          {/* Section Navigation */}
          <div className="p-5 border-b border-[var(--color-border)] overflow-y-auto flex-1">
            <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Resume Sections</h2>
            <div className="space-y-1">
              {sectionConfig.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const hasContent = section.id === 'personal' 
                  ? Object.keys(currentVersion.personalInfo || {}).length > 0
                  : currentVersion.sections.some(s => s.type === section.id);
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:ring-offset-2 ${
                      isActive 
                        ? 'bg-[var(--color-primary-blue)] text-white shadow-lg' 
                        : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] hover:bg-[var(--color-primary-blue)] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{section.title}</span>
                    </div>
                    {hasContent && (
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-green-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Selection */}
          <div className="p-5 border-t border-[var(--color-border)]">
            <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Template</h3>
            <div className="grid grid-cols-5 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    addToUndoStack(resume);
                    currentVersion.template = template.id;
                    setResume({ ...resume });
                  }}
                  className={`p-2 rounded-lg border-2 transition-all text-center ${
                    currentVersion.template === template.id
                      ? 'border-[var(--color-primary-blue)] bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-heading)] hover:border-[var(--color-primary-blue)]/30'
                  }`}
                  title={template.description}
                >
                  <div className="text-xs font-medium text-[var(--color-text-heading)]">{template.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className="w-1 bg-[var(--color-border)] hover:bg-[var(--color-primary-blue)] cursor-col-resize transition-colors relative hidden md:block"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded p-1 opacity-0 hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
        </div>

        {/* Right Panel - Live Preview (60%) */}
        <div 
          className="flex flex-col bg-[var(--color-bg-primary)] overflow-hidden"
          style={{ width: `${100 - panelWidth}%` }}
        >
          {/* Preview Toolbar */}
          <div className="p-3 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-[var(--color-text-heading)]" />
              </button>
              <span className="text-sm text-[var(--color-text-muted)] w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-[var(--color-text-heading)]" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors"
                title="Fit to Width"
              >
                <Maximize2 className="w-4 h-4 text-[var(--color-text-heading)]" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={printResume}
                className="p-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors"
                title="Print"
              >
                <Printer className="w-4 h-4 text-[var(--color-text-heading)]" />
              </button>
              <button
                onClick={copyResume}
                className="p-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors"
                title="Copy Resume"
              >
                <Copy className="w-4 h-4 text-[var(--color-text-heading)]" />
              </button>
              <button
                onClick={exportPDF}
                className="px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors text-sm text-[var(--color-text-heading)]"
                title="Export PDF"
              >
                <Download className="w-4 h-4 inline mr-1" />
                PDF
              </button>
              <button
                onClick={exportDOCX}
                className="px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded hover:bg-[var(--color-hover)] transition-colors text-sm text-[var(--color-text-heading)]"
                title="Export DOCX"
              >
                <Download className="w-4 h-4 inline mr-1" />
                DOCX
              </button>
            </div>
          </div>

          {/* Resume Preview Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-gray-100">
            <div 
              ref={resumeRef}
              className="mx-auto bg-white shadow-2xl transition-all duration-300"
              style={{ 
                maxWidth: '210mm',
                width: '100%',
                minHeight: '297mm',
                padding: '20mm',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <ResumePreview resume={currentVersion} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Tabs */}
      <div className="flex-1 flex flex-col lg:hidden overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-x-auto">
          <button
            onClick={() => setMobileView('editor')}
            className={`flex-1 min-w-max px-4 py-3 text-sm font-medium transition-colors ${
              mobileView === 'editor'
                ? 'text-[var(--color-primary-blue)] border-b-2 border-[var(--color-primary-blue)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
            }`}
          >
            <Edit className="w-4 h-4 inline mr-1" />
            Editor
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 min-w-max px-4 py-3 text-sm font-medium transition-colors ${
              mobileView === 'preview'
                ? 'text-[var(--color-primary-blue)] border-b-2 border-[var(--color-primary-blue)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-1" />
            Preview
          </button>
        </div>

        {/* Editor Tab Content */}
        {mobileView === 'editor' && (
          <div className="flex-1 overflow-y-auto bg-[var(--color-bg-card)]">
            {/* Section Navigation */}
            <div className="p-5 border-b border-[var(--color-border)]">
              <h2 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Resume Sections</h2>
              <div className="grid grid-cols-2 gap-3">
                {sectionConfig.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const hasContent = section.id === 'personal' 
                    ? Object.keys(currentVersion.personalInfo || {}).length > 0
                    : currentVersion.sections.some(s => s.type === section.id);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:ring-offset-2 ${
                        isActive 
                          ? 'bg-[var(--color-primary-blue)] text-white' 
                          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] hover:bg-[var(--color-primary-blue)] hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-semibold">{section.title}</span>
                      {hasContent && (
                        <div className={`w-2 h-2 rounded-full ml-auto ${isActive ? 'bg-white' : 'bg-green-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Selection */}
            <div className="p-5 border-b border-[var(--color-border)]">
              <h3 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Template</h3>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      addToUndoStack(resume);
                      currentVersion.template = template.id;
                      setResume({ ...resume });
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      currentVersion.template === template.id
                        ? 'border-[var(--color-primary-blue)] bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-heading)] hover:border-[var(--color-primary-blue)]/30'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[var(--color-text-heading)]">{template.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Export Actions */}
            <div className="p-5 flex flex-wrap gap-3">
              <button
                onClick={exportPDF}
                className="flex-1 px-4 py-3 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm font-medium text-[var(--color-text-heading)]"
              >
                <Download className="w-4 h-4 inline mr-1" />
                PDF
              </button>
              <button
                onClick={exportDOCX}
                className="flex-1 px-4 py-3 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm font-medium text-[var(--color-text-heading)]"
              >
                <Download className="w-4 h-4 inline mr-1" />
                DOCX
              </button>
              <button
                onClick={printResume}
                className="flex-1 px-4 py-3 bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm font-medium text-[var(--color-text-heading)]"
              >
                <Printer className="w-4 h-4 inline mr-1" />
                Print
              </button>
            </div>
          </div>
        )}

        {/* Preview Tab Content */}
        {mobileView === 'preview' && (
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-4">
            <div 
              ref={resumeRef}
              className="mx-auto bg-white shadow-2xl transition-all duration-300"
              style={{ 
                width: '100%',
                maxWidth: '210mm',
                minHeight: '297mm',
                padding: '15px',
              }}
            >
              <ResumePreview resume={currentVersion} />
            </div>
          </div>
        )}
      </div>

      {/* Side Panels */}
      <AnimatePresence>
        {/* ATS Score Panel */}
        {showATSPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-[var(--color-bg-card)] border-l border-[var(--color-border)] shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text-heading)]">ATS Analysis</h2>
                <button
                  onClick={() => setShowATSPanel(false)}
                  className="p-1 hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>

              {!atsScore ? (
                <button
                  onClick={analyzeATS}
                  disabled={aiLoading.ats}
                  className="w-full py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {aiLoading.ats ? (
                    <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                  ) : (
                    <Scan className="w-5 h-5 inline mr-2" />
                  )}
                  Analyze Resume
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="text-3xl font-bold">{atsScore.overall}%</div>
                    <div className="text-sm opacity-90">Overall ATS Score</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-text-muted)]">Keyword Score</span>
                        <span className="font-medium">{atsScore.keywordScore}%</span>
                      </div>
                      <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                          style={{ width: `${atsScore.keywordScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-text-muted)]">Formatting Score</span>
                        <span className="font-medium">{atsScore.formattingScore}%</span>
                      </div>
                      <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                          style={{ width: `${atsScore.formattingScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[var(--color-text-muted)]">Readability</span>
                        <span className="font-medium">{atsScore.readability}%</span>
                      </div>
                      <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                          style={{ width: `${atsScore.readability}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {atsScore.missingSections?.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Missing Sections</h4>
                      <ul className="text-sm text-red-600 dark:text-red-300 space-y-1">
                        {atsScore.missingSections.map((section, idx) => (
                          <li key={idx}>• {section}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {atsScore.suggestions?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-[var(--color-text-heading)]">Suggestions</h4>
                      {atsScore.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                          <p className="text-sm text-[var(--color-text-body)]">{suggestion}</p>
                          <button
                            onClick={() => improveWithAI('ats-fix', suggestion, { index: idx })}
                            className="mt-2 text-xs text-[var(--color-primary-blue)] hover:underline"
                          >
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            Fix with AI
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setAtsScore(null)}
                    className="w-full py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Re-analyze
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Job Match Panel */}
        {showJobMatchPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-[var(--color-bg-card)] border-l border-[var(--color-border)] shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text-heading)]">Job Description Match</h2>
                <button
                  onClick={() => setShowJobMatchPanel(false)}
                  className="p-1 hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Paste Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] resize-none text-sm"
                    placeholder="Paste the job description here..."
                  />
                </div>

                {!jobMatch ? (
                  <button
                    onClick={matchJobDescription}
                    disabled={aiLoading.jobMatch || !jobDescription}
                    className="w-full py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {aiLoading.jobMatch ? (
                      <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                    ) : (
                      <Target className="w-5 h-5 inline mr-2" />
                    )}
                    Analyze Match
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <div className="text-3xl font-bold">{jobMatch.matchPercentage}%</div>
                      <div className="text-sm opacity-90">Job Match</div>
                    </div>

                    {jobMatch.matchingSkills?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-heading)] mb-2">Matching Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobMatch.matchingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {jobMatch.missingSkills?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-heading)] mb-2">Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobMatch.missingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {jobMatch.suggestions?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-[var(--color-text-heading)]">Optimization Suggestions</h4>
                        {jobMatch.suggestions.map((suggestion, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                            <p className="text-sm text-[var(--color-text-body)]">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={optimizeForJob}
                      disabled={aiLoading.optimize}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {aiLoading.optimize ? (
                        <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 inline mr-2" />
                      )}
                      Optimize Resume for This Job
                    </button>

                    <button
                      onClick={() => setJobMatch(null)}
                      className="w-full py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-hover)] transition-colors text-sm"
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Re-analyze
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Editor Panel (Collapsible) */}
      {activeSection && (
        <div className="fixed left-0 top-20 bottom-0 w-[400px] bg-[var(--color-bg-card)] border-r border-[var(--color-border)] shadow-2xl z-40 overflow-y-auto transform transition-transform">
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">
              {sectionConfig.find(s => s.id === activeSection)?.title || 'Section Editor'}
            </h3>
            <button
              onClick={() => setActiveSection(null)}
              className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="p-6">
          {activeSection === 'personal' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={currentVersion.personalInfo?.fullName || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, fullName: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Email</label>
                  <input
                    type="email"
                    value={currentVersion.personalInfo?.email || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, email: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={currentVersion.personalInfo?.phone || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, phone: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Location</label>
                  <input
                    type="text"
                    value={currentVersion.personalInfo?.location || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, location: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={currentVersion.personalInfo?.linkedin || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, linkedin: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">GitHub</label>
                  <input
                    type="url"
                    value={currentVersion.personalInfo?.github || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, github: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="github.com/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Website</label>
                  <input
                    type="url"
                    value={currentVersion.personalInfo?.website || ''}
                    onChange={(e) => {
                      addToUndoStack(resume);
                      currentVersion.personalInfo = { ...currentVersion.personalInfo, website: e.target.value };
                      setResume({ ...resume });
                    }}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all"
                    placeholder="www.johndoe.com"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'summary' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Professional Summary</h3>
              <div className="space-y-4">
                <textarea
                  value={currentVersion.sections.find(s => s.type === 'summary')?.content || ''}
                  onChange={(e) => {
                    addToUndoStack(resume);
                    const summarySection = currentVersion.sections.find(s => s.type === 'summary');
                    if (summarySection) {
                      summarySection.content = e.target.value;
                    } else {
                      currentVersion.sections.push({
                        id: Date.now().toString(),
                        type: 'summary',
                        title: 'Professional Summary',
                        order: currentVersion.sections.length,
                        content: e.target.value,
                        isVisible: true,
                      });
                    }
                    setResume({ ...resume });
                  }}
                  rows={6}
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)] focus:border-transparent transition-all resize-none"
                  placeholder="Write a compelling professional summary..."
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => improveWithAI('summary', currentVersion.sections.find(s => s.type === 'summary')?.content || '', {})}
                    disabled={aiLoading.summary}
                    className="px-4 py-2.5 bg-[rgba(168,85,247,0.15)] text-purple-700 rounded-lg hover:bg-[rgba(168,85,247,0.25)] transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {aiLoading.summary ? (
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 inline mr-2" />
                    )}
                    AI Improve
                  </button>
                  <button
                    onClick={generateAISummary}
                    disabled={aiLoading.summary}
                    className="px-4 py-2.5 bg-[rgba(37,99,235,0.15)] text-blue-700 rounded-lg hover:bg-[rgba(37,99,235,0.25)] transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    AI Generate
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Work Experience</h3>
              <div className="space-y-3">
                {(currentVersion.sections.find(s => s.type === 'experience')?.content || []).map((entry, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[var(--color-text-heading)]">Entry {idx + 1}</span>
                      <button
                        onClick={() => {
                          addToUndoStack(resume);
                          const expSection = currentVersion.sections.find(s => s.type === 'experience');
                          if (expSection) {
                            expSection.content = expSection.content.filter((_, i) => i !== idx);
                            setResume({ ...resume });
                          }
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={entry.company || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.company = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={entry.title || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.title = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Job Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={entry.startDate || ''}
                        onChange={(e) => {
                          addToUndoStack(resume);
                          entry.startDate = e.target.value;
                          setResume({ ...resume });
                        }}
                        className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        value={entry.endDate || ''}
                        onChange={(e) => {
                          addToUndoStack(resume);
                          entry.endDate = e.target.value;
                          setResume({ ...resume });
                        }}
                        className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                        placeholder="End Date"
                      />
                    </div>
                    <textarea
                      value={entry.description || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.description = e.target.value;
                        setResume({ ...resume });
                      }}
                      rows={4}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] resize-none text-sm"
                      placeholder="Description (one bullet per line)"
                    />
                    <button
                      onClick={() => improveWithAI('experience', entry.description || '', { index: idx })}
                      disabled={aiLoading[`exp-${idx}`]}
                      className="w-full px-2 py-1.5 bg-[rgba(168,85,247,0.15)] text-purple-700 rounded hover:bg-[rgba(168,85,247,0.25)] transition-colors text-xs disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      AI Improve Description
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    addToUndoStack(resume);
                    const expSection = currentVersion.sections.find(s => s.type === 'experience');
                    if (expSection) {
                      if (!Array.isArray(expSection.content)) expSection.content = [];
                      expSection.content.push({ company: '', title: '', startDate: '', endDate: '', description: '' });
                    } else {
                      currentVersion.sections.push({
                        id: Date.now().toString(),
                        type: 'experience',
                        title: 'Work Experience',
                        order: currentVersion.sections.length,
                        content: [{ company: '', title: '', startDate: '', endDate: '', description: '' }],
                        isVisible: true,
                      });
                    }
                    setResume({ ...resume });
                  }}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] border-dashed rounded-lg text-[var(--color-text-muted)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Experience
                </button>
              </div>
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Education</h3>
              <div className="space-y-3">
                {(currentVersion.sections.find(s => s.type === 'education')?.content || []).map((entry, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[var(--color-text-heading)]">Entry {idx + 1}</span>
                      <button
                        onClick={() => {
                          addToUndoStack(resume);
                          const eduSection = currentVersion.sections.find(s => s.type === 'education');
                          if (eduSection) {
                            eduSection.content = eduSection.content.filter((_, i) => i !== idx);
                            setResume({ ...resume });
                          }
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={entry.institution || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.institution = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      value={entry.degree || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.degree = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={entry.field || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.field = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Field of Study"
                    />
                    <input
                      type="text"
                      value={entry.graduationYear || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.graduationYear = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Graduation Year"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    addToUndoStack(resume);
                    const eduSection = currentVersion.sections.find(s => s.type === 'education');
                    if (eduSection) {
                      if (!Array.isArray(eduSection.content)) eduSection.content = [];
                      eduSection.content.push({ institution: '', degree: '', field: '', graduationYear: '' });
                    } else {
                      currentVersion.sections.push({
                        id: Date.now().toString(),
                        type: 'education',
                        title: 'Education',
                        order: currentVersion.sections.length,
                        content: [{ institution: '', degree: '', field: '', graduationYear: '' }],
                        isVisible: true,
                      });
                    }
                    setResume({ ...resume });
                  }}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] border-dashed rounded-lg text-[var(--color-text-muted)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Education
                </button>
              </div>
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Skills</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(currentVersion.sections.find(s => s.type === 'skills')?.content || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[rgba(37,99,235,0.15)] text-blue-700 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        onClick={() => {
                          addToUndoStack(resume);
                          const skillsSection = currentVersion.sections.find(s => s.type === 'skills');
                          if (skillsSection) {
                            skillsSection.content = skillsSection.content.filter((_, i) => i !== idx);
                            setResume({ ...resume });
                          }
                        }}
                        className="ml-2 text-[var(--color-primary-blue)] hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        addToUndoStack(resume);
                        const skillsSection = currentVersion.sections.find(s => s.type === 'skills');
                        if (skillsSection) {
                          if (!Array.isArray(skillsSection.content)) skillsSection.content = [];
                          skillsSection.content.push(e.target.value);
                        } else {
                          currentVersion.sections.push({
                            id: Date.now().toString(),
                            type: 'skills',
                            title: 'Skills',
                            order: currentVersion.sections.length,
                            content: [e.target.value],
                            isVisible: true,
                          });
                        }
                        setResume({ ...resume });
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={suggestSkills}
                    disabled={aiLoading.skills}
                    className="px-3 py-2 bg-[rgba(168,85,247,0.15)] text-purple-700 rounded-lg hover:bg-[rgba(168,85,247,0.25)] transition-colors text-sm disabled:opacity-50"
                  >
                    {aiLoading.skills ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Projects</h3>
              <div className="space-y-3">
                {(currentVersion.sections.find(s => s.type === 'projects')?.content || []).map((entry, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[var(--color-text-heading)]">Project {idx + 1}</span>
                      <button
                        onClick={() => {
                          addToUndoStack(resume);
                          const projSection = currentVersion.sections.find(s => s.type === 'projects');
                          if (projSection) {
                            projSection.content = projSection.content.filter((_, i) => i !== idx);
                            setResume({ ...resume });
                          }
                        }}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={entry.name || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.name = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Project Name"
                    />
                    <textarea
                      value={entry.description || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.description = e.target.value;
                        setResume({ ...resume });
                      }}
                      rows={4}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] resize-none text-sm"
                      placeholder="Project Description"
                    />
                    <input
                      type="url"
                      value={entry.github || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.github = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="GitHub URL"
                    />
                    <input
                      type="url"
                      value={entry.liveDemo || ''}
                      onChange={(e) => {
                        addToUndoStack(resume);
                        entry.liveDemo = e.target.value;
                        setResume({ ...resume });
                      }}
                      className="w-full px-2 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded text-[var(--color-text-heading)] text-sm"
                      placeholder="Live Demo URL"
                    />
                    <button
                      onClick={() => improveWithAI('project', entry.description || '', { index: idx })}
                      disabled={aiLoading[`proj-${idx}`]}
                      className="w-full px-2 py-1.5 bg-[rgba(168,85,247,0.15)] text-purple-700 rounded hover:bg-[rgba(168,85,247,0.25)] transition-colors text-xs disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      AI Improve Description
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    addToUndoStack(resume);
                    const projSection = currentVersion.sections.find(s => s.type === 'projects');
                    if (projSection) {
                      if (!Array.isArray(projSection.content)) projSection.content = [];
                      projSection.content.push({ name: '', description: '', github: '', liveDemo: '' });
                    } else {
                      currentVersion.sections.push({
                        id: Date.now().toString(),
                        type: 'projects',
                        title: 'Projects',
                        order: currentVersion.sections.length,
                        content: [{ name: '', description: '', github: '', liveDemo: '' }],
                        isVisible: true,
                      });
                    }
                    setResume({ ...resume });
                  }}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] border-dashed rounded-lg text-[var(--color-text-muted)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* AI Suggestion Modal */}
      {showAIModal && aiModalContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6 max-w-2xl w-full mx-4 border border-[var(--color-border)] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-text-heading)]">AI Suggestion</h3>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setAiModalContent(null);
                }}
                className="p-1 hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Original</label>
                <div className="p-3 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-text-body)] text-sm whitespace-pre-wrap">
                  {aiModalContent.original}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">AI Improved</label>
                <div className="p-3 bg-[rgba(37,99,235,0.15)] dark:bg-[rgba(37,99,235,0.25)] border border-[var(--color-primary-blue)] rounded-lg text-blue-900 dark:text-blue-100 text-sm whitespace-pre-wrap">
                  {aiModalContent.improved}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAIModal(false);
                    setAiModalContent(null);
                  }}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={applyAISuggestion}
                  className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Apply Suggestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6 max-w-md w-full mx-4 border border-[var(--color-border)]">
            <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-4">Create New Version</h3>
            <input
              type="text"
              placeholder="Version name (e.g., v2 - Updated)"
              className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  createVersion(e.target.value);
                }
              }}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const input = document.querySelector('input');
                  if (input?.value) createVersion(input.value);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-accent-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Resume Preview Component
const ResumePreview = ({ resume }) => {
  return (
    <div className="text-[var(--color-text-heading)]">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">{resume.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-sm text-[var(--color-text-body)]">
          {resume.personalInfo?.email || 'email@example.com'}
          {resume.personalInfo?.phone && ` • ${resume.personalInfo.phone}`}
          {resume.personalInfo?.location && ` • ${resume.personalInfo.location}`}
        </p>
        {(resume.personalInfo?.linkedin || resume.personalInfo?.github || resume.personalInfo?.website) && (
          <p className="text-sm text-[var(--color-text-body)] mt-1">
            {resume.personalInfo?.linkedin && <span>{resume.personalInfo.linkedin} </span>}
            {resume.personalInfo?.github && <span>{resume.personalInfo.github} </span>}
            {resume.personalInfo?.website && <span>{resume.personalInfo.website}</span>}
          </p>
        )}
      </div>
      {resume.sections
        .filter(s => s.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.id} className="mb-4">
            <h2 className="font-bold text-lg mb-2 border-b border-gray-300 pb-1 uppercase">{section.title}</h2>
            <div className="text-sm">
              {section.type === 'experience' && Array.isArray(section.content) ? (
                section.content.map((entry, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{entry.title || 'Position'}</p>
                        <p className="text-[var(--color-text-body)]">{entry.company || 'Company'}</p>
                      </div>
                      <p className="text-[var(--color-text-muted)] text-sm">{entry.startDate} - {entry.endDate}</p>
                    </div>
                    <p className="mt-1 whitespace-pre-line text-[var(--color-text-body)]">{entry.description || ''}</p>
                  </div>
                ))
              ) : section.type === 'education' && Array.isArray(section.content) ? (
                section.content.map((entry, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{entry.degree || 'Degree'}</p>
                        <p className="text-[var(--color-text-body)]">{entry.institution || 'Institution'}</p>
                        <p className="text-[var(--color-text-muted)] text-sm">{entry.field || ''}</p>
                      </div>
                      <p className="text-[var(--color-text-muted)] text-sm">{entry.graduationYear || ''}</p>
                    </div>
                    {entry.gpa && <p className="text-[var(--color-text-muted)] text-sm mt-1">GPA: {entry.gpa}</p>}
                  </div>
                ))
              ) : section.type === 'skills' && Array.isArray(section.content) ? (
                <div className="flex flex-wrap gap-2">
                  {section.content.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">{skill}</span>
                  ))}
                </div>
              ) : section.type === 'projects' && Array.isArray(section.content) ? (
                section.content.map((entry, idx) => (
                  <div key={idx} className="mb-3">
                    <p className="font-semibold">{entry.name || 'Project Name'}</p>
                    <p className="text-[var(--color-text-body)] whitespace-pre-line">{entry.description || ''}</p>
                    {(entry.github || entry.liveDemo) && (
                      <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        {entry.github && <span>GitHub: {entry.github} </span>}
                        {entry.liveDemo && <span>Demo: {entry.liveDemo}</span>}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="whitespace-pre-wrap">{Array.isArray(section.content) ? section.content.join(', ') : section.content}</div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ResumeBuilder;
