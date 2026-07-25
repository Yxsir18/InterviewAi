import { motion } from 'framer-motion';
import { UserPlus, FileText, Bot, MessageSquare, BarChart3, TrendingUp, Award, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Register',
      description: 'Create your free account in seconds. No credit card required.',
      color: 'blue',
    },
    {
      icon: FileText,
      title: 'Complete Your Profile',
      description: 'Add your skills, experience, and career goals for personalized recommendations.',
      color: 'cyan',
    },
    {
      icon: Bot,
      title: 'Choose Interview Type',
      description: 'Select from AI interviews, coding challenges, or resume analysis.',
      color: 'green',
    },
    {
      icon: MessageSquare,
      title: 'Start AI Interview',
      description: 'Begin your practice session with real-time AI feedback.',
      color: 'purple',
    },
    {
      icon: BarChart3,
      title: 'Receive AI Feedback',
      description: 'Get detailed insights on your performance and areas for improvement.',
      color: 'pink',
    },
    {
      icon: TrendingUp,
      title: 'View Analytics',
      description: 'Track your progress with comprehensive analytics and reports.',
      color: 'orange',
    },
    {
      icon: Award,
      title: 'Improve Skills',
      description: 'Focus on weak areas and watch your skills improve over time.',
      color: 'yellow',
    },
    {
      icon: CheckCircle,
      title: 'Earn Certificates',
      description: 'Achieve milestones and earn certificates to showcase your success.',
      color: 'indigo',
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
            How It Works
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Get started in minutes and transform your interview preparation journey.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-primary-blue)] via-[var(--color-secondary-cyan)] to-[var(--color-accent-purple)] transform -translate-x-1/2" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className={`flex items-center space-x-4 ${isEven ? 'lg:text-right' : 'lg:order-2 lg:text-left'}`}>
                    <div className="hidden lg:flex w-12 h-12 rounded-full bg-[var(--color-primary-blue)]/20 items-center justify-center border-2 border-[var(--color-primary-blue)]">
                      <span className="text-[var(--color-primary-blue)] font-bold">{index + 1}</span>
                    </div>
                    <div className={`flex-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="w-6 h-6 text-[var(--color-primary-blue)]" />
                        <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">{step.title}</h3>
                      </div>
                      <p className="text-[var(--color-text-muted)]">{step.description}</p>
                    </div>
                  </div>
                  <div className={`hidden lg:flex justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-[var(--color-primary-blue)]/20 flex items-center justify-center border-2 border-[var(--color-primary-blue)]`}>
                      <Icon className="w-8 h-8 text-[var(--color-primary-blue)]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8 mt-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-blue)]/20 flex items-center justify-center border-2 border-[var(--color-primary-blue)] flex-shrink-0">
                  <span className="text-[var(--color-primary-blue)] font-bold">{index + 1}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="w-5 h-5 text-[var(--color-primary-blue)]" />
                    <h3 className="text-xl font-bold text-[var(--color-text-heading)]">{step.title}</h3>
                  </div>
                  <p className="text-[var(--color-text-muted)]">{step.description}</p>
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
            Ready to Start Your Journey?
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            Join thousands of candidates who are already improving their interview skills.
          </p>
          <a
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
