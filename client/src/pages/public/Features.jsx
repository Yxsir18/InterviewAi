import { motion } from 'framer-motion';
import {
  Bot,
  Code,
  FileText,
  Award,
  BarChart3,
  MessageSquare,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 'ai-interview',
      icon: Bot,
      title: 'AI Conversational Interview',
      description: 'Practice with AI-powered interviews that simulate real conversations with interviewers. Get instant feedback on your responses, communication style, and body language.',
      benefits: [
        'Real-time conversation simulation',
        'Instant AI feedback on responses',
        'Multiple interview types (behavioral, technical)',
        'Progress tracking and analytics',
        'Customizable difficulty levels',
      ],
      color: 'blue',
    },
    {
      id: 'coding-interview',
      icon: Code,
      title: 'Coding Interview',
      description: 'Solve coding challenges with real-time feedback. Our AI analyzes your code for efficiency, readability, and best practices.',
      benefits: [
        '500+ coding challenges',
        'Real-time code analysis',
        'Multiple programming languages',
        'Time complexity optimization tips',
        'LeetCode-style problems',
      ],
      color: 'cyan',
    },
    {
      id: 'resume-analyzer',
      icon: FileText,
      title: 'Resume ATS Analyzer',
      description: 'Get your resume analyzed by AI to optimize it for ATS systems. Receive detailed feedback on formatting, keywords, and overall effectiveness.',
      benefits: [
        'ATS compatibility check',
        'Keyword optimization suggestions',
        'Formatting recommendations',
        'Content improvement tips',
        'Industry-standard scoring',
      ],
      color: 'green',
    },
    {
      id: 'ai-feedback',
      icon: MessageSquare,
      title: 'AI Feedback',
      description: 'Receive comprehensive feedback on your interview performance. Our AI analyzes your responses and provides actionable insights.',
      benefits: [
        'Detailed response analysis',
        'Communication style feedback',
        'Technical accuracy assessment',
        'Improvement recommendations',
        'Performance metrics',
      ],
      color: 'purple',
    },
    {
      id: 'certificates',
      icon: Award,
      title: 'Certificates',
      description: 'Earn certificates to showcase your interview preparation achievements. Share them on LinkedIn and other platforms.',
      benefits: [
        'Verifiable certificates',
        'LinkedIn integration',
        'Skill badges',
        'Achievement tracking',
        'Professional recognition',
      ],
      color: 'yellow',
    },
    {
      id: 'gamification',
      icon: Zap,
      title: 'Gamification',
      description: 'Stay motivated with gamified learning. Earn points, badges, and unlock achievements as you practice.',
      benefits: [
        'Points and XP system',
        'Achievement badges',
        'Leaderboards',
        'Daily challenges',
        'Streak tracking',
      ],
      color: 'orange',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track your progress with detailed analytics. Identify strengths and weaknesses to focus your preparation.',
      benefits: [
        'Progress tracking',
        'Performance metrics',
        'Skill analysis',
        'Trend visualization',
        'Custom reports',
      ],
      color: 'pink',
    },
    {
      id: 'progress-tracking',
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time. Set goals and track your journey to interview success.',
      benefits: [
        'Goal setting',
        'Milestone tracking',
        'Progress visualization',
        'Personalized recommendations',
        'Historical data',
      ],
      color: 'indigo',
    },
    {
      id: 'career-guidance',
      icon: Brain,
      title: 'Career Guidance',
      description: 'Get personalized career advice based on your profile and interview performance. Receive recommendations for skill development.',
      benefits: [
        'Personalized recommendations',
        'Skill gap analysis',
        'Career path suggestions',
        'Industry insights',
        'Job matching',
      ],
      color: 'teal',
    },
    {
      id: 'interview-reports',
      icon: Shield,
      title: 'Interview Reports',
      description: 'Generate detailed reports of your interview sessions. Review your performance and share with mentors or recruiters.',
      benefits: [
        'Detailed session reports',
        'Performance summaries',
        'Shareable reports',
        'PDF export',
        'Comparison analytics',
      ],
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-heading)] mb-4">
            Powerful Features
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Everything you need to master your interview preparation journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={feature.id}
                id={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                <div className={isEven ? '' : 'order-2 lg:order-1'}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${feature.color}-400`} />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-text-heading)]">{feature.title}</h2>
                  </div>
                  <p className="text-lg text-[var(--color-text-muted)] mb-8">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                        <span className="text-[var(--color-text-body)]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={isEven ? 'order-2 lg:order-1' : ''}>
                  <div className="p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                    <div className="aspect-video rounded-xl bg-gradient-to-br from-[var(--color-primary-blue)]/10 to-[var(--color-secondary-cyan)]/10 flex items-center justify-center">
                      <Icon className="w-24 h-24 text-[var(--color-primary-blue)] opacity-50" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            Join thousands of candidates who are already improving their interview skills.
          </p>
          <a
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
