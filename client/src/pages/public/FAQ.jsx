import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Bot, Code, FileText, Award, Shield, User, Monitor, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'AI Interviews',
      icon: Bot,
      questions: [
        {
          question: 'How does the AI interview work?',
          answer: 'Our AI interview system uses advanced natural language processing to simulate real interview conversations. It asks relevant questions, analyzes your responses in real-time, and provides detailed feedback on your communication skills, technical knowledge, and overall performance.',
        },
        {
          question: 'Can I practice specific types of interviews?',
          answer: 'Yes! You can choose from behavioral interviews, technical interviews, system design interviews, and more. Each type is tailored to simulate real interview scenarios for different roles and companies.',
        },
        {
          question: 'How accurate is the AI feedback?',
          answer: 'Our AI is trained on thousands of successful interview responses and uses industry-standard evaluation criteria. While not perfect, it provides highly accurate feedback that closely mirrors what real interviewers look for.',
        },
        {
          question: 'Is the AI interview recorded?',
          answer: 'No, we do not record your video or audio. All analysis is done in real-time and your data is processed securely. We only store the text transcripts and feedback for your review.',
        },
      ],
    },
    {
      category: 'Coding Interviews',
      icon: Code,
      questions: [
        {
          question: 'What programming languages are supported?',
          answer: 'We support all major programming languages including Python, JavaScript, Java, C++, Go, Rust, and more. You can practice in the language you\'re most comfortable with or learn a new one.',
        },
        {
          question: 'How are coding challenges evaluated?',
          answer: 'Our AI analyzes your code for correctness, efficiency, readability, and best practices. It provides time complexity analysis and suggests optimizations when applicable.',
        },
        {
          question: 'Can I use my own IDE?',
          answer: 'While we provide a built-in code editor, you can also use our API to integrate with your preferred IDE. This allows you to practice in your familiar environment while still getting AI feedback.',
        },
        {
          question: 'Are the coding questions similar to LeetCode?',
          answer: 'Yes, our coding challenges are similar to LeetCode-style problems. We have a database of questions from top tech companies and various difficulty levels.',
        },
      ],
    },
    {
      category: 'Resume Analysis',
      icon: FileText,
      questions: [
        {
          question: 'How does the resume analyzer work?',
          answer: 'Our resume analyzer uses ATS (Applicant Tracking System) algorithms to evaluate your resume. It checks for keyword optimization, formatting, content quality, and overall effectiveness.',
        },
        {
          question: 'What file formats are supported?',
          answer: 'We support PDF, DOCX, and TXT file formats. Simply upload your resume and get instant feedback.',
        },
        {
          question: 'Can I get specific suggestions for my resume?',
          answer: 'Yes, the analyzer provides specific suggestions for improvement, including keyword additions, formatting changes, and content enhancements.',
        },
        {
          question: 'Is my resume data secure?',
          answer: 'Absolutely. Your resume data is encrypted and processed securely. We do not share your resume with any third parties.',
        },
      ],
    },
    {
      category: 'Certificates',
      icon: Award,
      questions: [
        {
          question: 'How do I earn certificates?',
          answer: 'Certificates are earned by completing specific achievements, such as completing a certain number of interviews, achieving high scores, or mastering particular skills.',
        },
        {
          question: 'Are the certificates verifiable?',
          answer: 'Yes, all certificates are verifiable through our platform. Employers can verify the authenticity of your certificates using a unique verification code.',
        },
        {
          question: 'Can I share certificates on LinkedIn?',
          answer: 'Yes, you can easily share your certificates on LinkedIn and other social platforms. We provide direct integration with LinkedIn for seamless sharing.',
        },
        {
          question: 'Do certificates expire?',
          answer: 'Our certificates do not expire. However, we recommend keeping your skills current by continuing to practice and earn new certificates.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      icon: Shield,
      questions: [
        {
          question: 'Is my data secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your data. We are GDPR compliant and follow strict data protection practices.',
        },
        {
          question: 'Who can see my interview data?',
          answer: 'Only you can see your interview data. We do not share your performance data with any third parties without your explicit consent.',
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can delete your account and all associated data at any time from your account settings. All data is permanently removed within 30 days.',
        },
        {
          question: 'Do you use my data for training?',
          answer: 'We may use anonymized data to improve our AI models, but we never use your personal information or identifiable data without explicit consent.',
        },
      ],
    },
    {
      category: 'Accounts',
      icon: User,
      questions: [
        {
          question: 'Is InterviewAI free to use?',
          answer: 'Yes, we offer a free tier with access to basic features including AI interviews, coding challenges, and resume analysis. Premium features are available for a subscription.',
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can change your email address from your account settings. You\'ll need to verify the new email address before the change takes effect.',
        },
        {
          question: 'What if I forget my password?',
          answer: 'You can reset your password using the "Forgot Password" link on the login page. We\'ll send a password reset link to your registered email.',
        },
        {
          question: 'Can I have multiple accounts?',
          answer: 'We recommend having only one account per person. Multiple accounts may violate our terms of service and can result in account suspension.',
        },
      ],
    },
    {
      category: 'Technical Requirements',
      icon: Monitor,
      questions: [
        {
          question: 'What browsers are supported?',
          answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome.',
        },
        {
          question: 'Do I need a webcam for AI interviews?',
          answer: 'A webcam is not required but recommended for the full experience. Our AI can analyze facial expressions and body language if you enable your camera.',
        },
        {
          question: 'Is a stable internet connection required?',
          answer: 'Yes, a stable internet connection is required for real-time AI analysis. We recommend a minimum of 5 Mbps for optimal performance.',
        },
        {
          question: 'Can I use InterviewAI on mobile?',
          answer: 'Yes, InterviewAI is fully responsive and works on mobile devices. However, for coding interviews, we recommend using a desktop or laptop for the best experience.',
        },
      ],
    },
    {
      category: 'General',
      icon: HelpCircle,
      questions: [
        {
          question: 'How do I contact support?',
          answer: 'You can contact our support team through the contact page or by emailing support@interviewai.com. We typically respond within 24 hours.',
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period.',
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for new subscriptions. If you\'re not satisfied, contact support within 30 days for a full refund.',
        },
        {
          question: 'How often is the platform updated?',
          answer: 'We release updates regularly to improve features and fix bugs. Major updates are announced in our newsletter and on our social media channels.',
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-heading)] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[var(--color-text-muted)]">
            Everything you need to know about InterviewAI.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--color-primary-blue)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-heading)]">{category.category}</h2>
                </div>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === key;
                    return (
                      <div
                        key={faq.question}
                        className="rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                          <span className="text-[var(--color-text-heading)] font-medium">{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                          )}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-4 pt-0">
                                <p className="text-[var(--color-text-muted)]">{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-[rgba(37,99,235,0.1)] to-[rgba(6,182,212,0.1)] border border-[var(--color-border)]"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">
            Still Have Questions?
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <span>Contact Support</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
