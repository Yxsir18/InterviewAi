import { motion } from 'framer-motion';
import { Bot, Target, Zap, Rocket, Users, Award, Shield, Code, Brain, Globe, ChevronRight, Database } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To democratize interview preparation by making AI-powered coaching accessible to everyone, regardless of background or resources.',
    },
    {
      icon: Zap,
      title: 'Vision',
      description: 'To become the world\'s leading platform for interview preparation, helping millions of candidates land their dream jobs.',
    },
    {
      icon: Shield,
      title: 'Values',
      description: 'We believe in accessibility, innovation, integrity, and user success. Every feature we build is centered around helping candidates succeed.',
    },
  ];

  const problems = [
    {
      title: 'Lack of Practice',
      description: 'Most candidates don\'t get enough practice before actual interviews, leading to poor performance.',
    },
    {
      title: 'No Feedback',
      description: 'Without feedback, candidates don\'t know what they\'re doing wrong or how to improve.',
    },
    {
      title: 'High Cost',
      description: 'Traditional coaching is expensive and inaccessible to many candidates.',
    },
    {
      title: 'Time Constraints',
      description: 'Busy schedules make it difficult to find time for interview preparation.',
    },
  ];

  const solutions = [
    {
      title: 'AI-Powered Practice',
      description: 'Practice anytime, anywhere with our AI interviewers available 24/7.',
    },
    {
      title: 'Instant Feedback',
      description: 'Get real-time feedback on your responses, code, and overall performance.',
    },
    {
      title: 'Affordable Access',
      description: 'Free tier available with premium features at reasonable prices.',
    },
    {
      title: 'Flexible Learning',
      description: 'Learn at your own pace with bite-sized sessions and progress tracking.',
    },
  ];

  const techStack = [
    { name: 'React', icon: Code, color: 'blue' },
    { name: 'Node.js', icon: Code, color: 'green' },
    { name: 'Python', icon: Brain, color: 'yellow' },
    { name: 'MongoDB', icon: Database, color: 'green' },
    { name: 'OpenAI', icon: Bot, color: 'purple' },
    { name: 'TensorFlow', icon: Brain, color: 'orange' },
  ];

  const roadmap = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      items: ['AI Interview System', 'Coding Challenges', 'Resume Analyzer'],
      status: 'completed',
    },
    {
      phase: 'Phase 2',
      title: 'Enhancement',
      items: ['Advanced Analytics', 'Gamification', 'Certificates'],
      status: 'in-progress',
    },
    {
      phase: 'Phase 3',
      title: 'Expansion',
      items: ['Mobile App', 'Video Interviews', 'Company Partnerships'],
      status: 'upcoming',
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
            About InterviewAI
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Transforming interview preparation with AI-powered coaching and real-time feedback.
          </p>
        </motion.div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
              >
                <div className="w-14 h-14 rounded-xl bg-[rgba(37,99,235,0.1)] flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-[var(--color-primary-blue)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">{value.title}</h3>
                <p className="text-[var(--color-text-muted)]">{value.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Problems We Solve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-8">Problems We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <div key={problem.title} className="p-6 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2">{problem.title}</h3>
                <p className="text-[var(--color-text-muted)]">{problem.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Our Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-8">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((solution, index) => (
              <div key={solution.title} className="p-6 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2">{solution.title}</h3>
                <p className="text-[var(--color-text-muted)]">{solution.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-8">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={tech.name} className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-center">
                  <Icon className="w-8 h-8 text-[var(--color-primary-blue)] mx-auto mb-3" />
                  <p className="text-[var(--color-text-heading)] font-medium">{tech.name}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-8">AI Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Natural Language Processing', description: 'Understand and analyze human language in real-time' },
              { title: 'Code Analysis', description: 'Evaluate code quality, efficiency, and best practices' },
              { title: 'Sentiment Analysis', description: 'Assess tone, confidence, and communication style' },
              { title: 'Pattern Recognition', description: 'Identify patterns in responses and provide insights' },
            ].map((capability, index) => (
              <div key={capability.title} className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2">{capability.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm">{capability.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-8">Future Roadmap</h2>
          <div className="space-y-6">
            {roadmap.map((phase, index) => (
              <div key={phase.phase} className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      phase.status === 'completed' ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]' :
                      phase.status === 'in-progress' ? 'bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]' :
                      'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'
                    }`}>
                      {phase.status}
                    </span>
                    <h3 className="text-xl font-bold text-[var(--color-text-heading)]">{phase.title}</h3>
                  </div>
                  <span className="text-[var(--color-text-muted)]">{phase.phase}</span>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-[var(--color-text-body)]">
                      <ChevronRight className="w-4 h-4 text-[var(--color-primary-blue)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
            Join Our Mission
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            Be part of the revolution in interview preparation.
          </p>
          <a
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold"
          >
            <Rocket className="w-5 h-5" />
            <span>Get Started Free</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
