import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Code,
  FileText,
  Award,
  BarChart3,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  ChevronRight,
  MessageSquare,
  Brain,
  Target,
  Rocket,
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI Conversational Interview',
      description: 'Practice with AI-powered interviews that simulate real conversations with interviewers.',
      color: 'blue',
    },
    {
      icon: Code,
      title: 'Coding Interview',
      description: 'Solve coding challenges with real-time feedback and code analysis.',
      color: 'cyan',
    },
    {
      icon: FileText,
      title: 'Resume ATS Analyzer',
      description: 'Get your resume analyzed by AI to optimize it for ATS systems.',
      color: 'green',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn certificates to showcase your interview preparation achievements.',
      color: 'purple',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Users' },
    { value: '100K+', label: 'Interviews' },
    { value: '95%', label: 'Success Rate' },
    { value: '4.9/5', label: 'Rating' },
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI-Powered Feedback',
      description: 'Get instant, personalized feedback on your responses and code.',
    },
    {
      icon: Target,
      title: 'Targeted Practice',
      description: 'Focus on specific skills and topics that matter most for your role.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and insights.',
    },
    {
      icon: Shield,
      title: 'Industry Standard',
      description: 'Practice with questions from top companies and industry experts.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      content: 'InterviewAI helped me land my dream job at Google. The AI feedback was incredibly accurate and helped me improve my communication skills.',
      avatar: 'SC',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Full Stack Developer',
      company: 'Meta',
      content: 'The coding interview preparation is top-notch. I felt so much more confident after practicing with InterviewAI.',
      avatar: 'MR',
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager',
      company: 'Amazon',
      content: 'The resume analyzer helped me optimize my CV. I got 3x more interview calls after using it.',
      avatar: 'EW',
    },
  ];

  const faqs = [
    {
      question: 'How does the AI interview work?',
      answer: 'Our AI interview system uses advanced natural language processing to simulate real interview conversations. It asks relevant questions, analyzes your responses in real-time, and provides detailed feedback on your communication skills, technical knowledge, and overall performance.',
    },
    {
      question: 'Is InterviewAI free to use?',
      answer: 'Yes, InterviewAI offers a free tier with access to basic interview features. You can practice AI interviews, coding challenges, and use the resume analyzer without any cost.',
    },
    {
      question: 'How accurate is the resume analyzer?',
      answer: 'Our resume analyzer is trained on thousands of successful resumes and uses industry-standard ATS algorithms. It provides comprehensive feedback on formatting, keywords, and overall effectiveness.',
    },
    {
      question: 'Can I practice for specific companies?',
      answer: 'Yes, you can filter interview questions by company, role, and difficulty level. We have a database of questions from top tech companies including Google, Meta, Amazon, and more.',
    },
  ];

  const technologies = [
    'React',
    'Node.js',
    'Python',
    'MongoDB',
    'OpenAI',
    'TensorFlow',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-blue)]/10 via-[var(--color-secondary-cyan)]/10 to-[var(--color-accent-purple)]/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-[var(--color-primary-blue)]/20 rounded-full blur-[100px] sm:blur-[120px]" />
        
        <div className="relative container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.2)] rounded-full mb-6 sm:mb-8"
            >
              <Zap className="w-4 h-4 text-[var(--color-primary-blue)]" />
              <span className="text-xs sm:text-sm text-[var(--color-primary-blue)]">AI-Powered Interview Preparation</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[var(--color-text-heading)] mb-4 sm:mb-6 leading-tight">
              Ace Your Next Interview
              <br />
              <span className="bg-gradient-to-r from-[var(--color-primary-blue)] via-[var(--color-secondary-cyan)] to-[var(--color-accent-purple)] bg-clip-text text-transparent">
                With AI
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
              Practice with AI-powered interviews, get real-time feedback, and land your dream job. 
              Join thousands of candidates who have transformed their interview skills.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            >
              <Link
                to="/register"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-xl hover:opacity-90 transition-opacity text-base sm:text-lg font-semibold min-h-[48px]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </Link>
              <Link
                to="/features"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-heading)] rounded-xl hover:bg-[var(--color-hover)] transition-colors text-base sm:text-lg font-semibold min-h-[48px]"
              >
                <Play className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Explore Features</span>
              </Link>
            </motion.div>

            {/* Trusted Technologies */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 sm:mt-16"
            >
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mb-3 sm:mb-4">Trusted by candidates preparing for roles at</p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 px-4">
                {technologies.map((tech) => (
                  <span key={tech} className="text-sm sm:text-base text-[var(--color-text-muted)] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-12 sm:py-16 lg:py-20 border-y border-[var(--color-border)]">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-heading)] mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-[var(--color-text-muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-heading)] mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto px-4">
              Comprehensive tools designed to help you master every aspect of the interview process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors group"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text-heading)] mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--color-text-muted)]">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Interview Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[rgba(37,99,235,0.05)] to-[rgba(6,182,212,0.05)]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-4 sm:mb-6">
                AI Conversational Interviews
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] mb-6 sm:mb-8">
                Practice real interview conversations with our advanced AI. Get instant feedback on your responses, body language, and communication style.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Real-time conversation simulation',
                  'Instant feedback on responses',
                  'Multiple interview types (behavioral, technical)',
                  'Progress tracking and analytics',
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-success)] flex-shrink-0" />
                    <span className="text-sm sm:text-base text-[var(--color-text-body)]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/features#ai-interview"
                className="inline-flex items-center space-x-2 mt-6 sm:mt-8 text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-hover)] transition-colors"
              >
                <span className="text-sm sm:text-base">Learn more about AI Interviews</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[var(--color-text-heading)] font-semibold text-sm sm:text-base truncate">AI Interviewer</div>
                    <div className="text-xs sm:text-sm text-[var(--color-text-muted)]">Online</div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 rounded-lg bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.2)]">
                    <p className="text-[var(--color-text-heading)] text-xs sm:text-sm">Tell me about a challenging project you worked on.</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] ml-6 sm:ml-8">
                    <p className="text-[var(--color-text-muted)] text-xs sm:text-sm">I led a team of 5 developers to build a real-time collaboration platform...</p>
                  </div>
                  <div className="flex items-center space-x-2 text-[var(--color-success)] text-xs sm:text-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Great response! Clear and structured.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coding Interview Preview */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="text-[var(--color-text-heading)] font-semibold text-sm sm:text-base">Two Sum</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">Medium</span>
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-text-muted)]" />
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-[var(--color-bg-secondary)] font-mono text-xs sm:text-sm text-[var(--color-text-muted)] mb-3 sm:mb-4 overflow-x-auto">
                  <span className="text-[var(--color-accent-purple)]">function</span> <span className="text-[var(--color-primary-blue)]">twoSum</span>(nums, target) {'{'}
                </div>
                <div className="flex items-center space-x-2 text-[var(--color-success)] text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Optimal solution found!</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-4 sm:mb-6">
                Coding Interview Practice
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] mb-6 sm:mb-8">
                Solve coding challenges with real-time feedback. Our AI analyzes your code for efficiency, readability, and best practices.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  '500+ coding challenges',
                  'Real-time code analysis',
                  'Multiple programming languages',
                  'Time complexity optimization tips',
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-success)] flex-shrink-0" />
                    <span className="text-sm sm:text-base text-[var(--color-text-body)]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/features#coding-interview"
                className="inline-flex items-center space-x-2 mt-6 sm:mt-8 text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-hover)] transition-colors"
              >
                <span className="text-sm sm:text-base">Explore Coding Challenges</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resume Analyzer Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-green-500/5 to-cyan-500/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] mb-4 sm:mb-6">
                Resume ATS Analyzer
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] mb-6 sm:mb-8">
                Optimize your resume for ATS systems. Get detailed feedback on formatting, keywords, and overall effectiveness.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'ATS compatibility check',
                  'Keyword optimization suggestions',
                  'Formatting recommendations',
                  'Content improvement tips',
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-success)] flex-shrink-0" />
                    <span className="text-sm sm:text-base text-[var(--color-text-body)]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/features#resume-analyzer"
                className="inline-flex items-center space-x-2 mt-6 sm:mt-8 text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue-hover)] transition-colors"
              >
                <span className="text-sm sm:text-base">Analyze Your Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="p-4 sm:p-6 lg:p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="text-[var(--color-text-heading)] font-semibold text-sm sm:text-base">Resume Analysis</div>
                  <div className="text-[var(--color-success)] text-xs sm:text-sm">92% Score</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">ATS Compatibility</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 sm:w-32 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                        <div className="w-[95%] h-full bg-[var(--color-success)] rounded-full" />
                      </div>
                      <span className="text-[var(--color-success)] text-xs sm:text-sm">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">Keyword Match</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 sm:w-32 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                        <div className="w-[88%] h-full bg-[var(--color-primary-blue)] rounded-full" />
                      </div>
                      <span className="text-[var(--color-primary-blue)] text-xs sm:text-sm">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">Formatting</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 sm:w-32 h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                        <div className="w-[92%] h-full bg-[var(--color-secondary-cyan)] rounded-full" />
                      </div>
                      <span className="text-[var(--color-secondary-cyan)] text-xs sm:text-sm">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-heading)] mb-3 sm:mb-4">
              Why Choose InterviewAI?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Built by interviewers, for interviewees. We know what it takes to succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgba(37,99,235,0.1)] flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary-blue)]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-heading)] mb-2">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[var(--color-accent-purple)]/5 to-[var(--color-accent-pink)]/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-heading)] mb-3 sm:mb-4">
              Loved by Candidates
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
              See what our users have to say about their experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
              >
                <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-warning)] fill-[var(--color-warning)]" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-[var(--color-text-muted)] mb-4 sm:mb-6">{testimonial.content}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[var(--color-text-heading)] font-semibold text-sm sm:text-base truncate">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-[var(--color-text-muted)] truncate">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-heading)] mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)]">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto px-4 space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-4 sm:p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
              >
                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-heading)] mb-2">{faq.question}</h3>
                <p className="text-sm sm:text-base text-[var(--color-text-muted)]">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center space-x-2 text-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)]/80 transition-colors"
            >
              <span className="text-sm sm:text-base">View all FAQs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-[var(--color-primary-blue)]/10 to-[var(--color-secondary-cyan)]/10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-heading)] mb-4 sm:mb-6">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-muted)] mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join thousands of candidates who have transformed their interview skills with InterviewAI.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-xl hover:opacity-90 transition-opacity text-base sm:text-lg font-semibold min-h-[48px]"
            >
              <Rocket className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Get Started Free</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
