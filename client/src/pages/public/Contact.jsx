import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      await axios.post('/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            Get in Touch
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Send us a message</h2>
              
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                  <span className="text-[var(--color-success)]">Message sent successfully!</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />
                  <span className="text-[var(--color-error)]">Failed to send message. Please try again.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] transition-colors"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary-blue)] transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(37,99,235,0.1)] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-primary-blue)]" />
                  </div>
                  <div>
                    <h3 className="text-[var(--color-text-heading)] font-semibold mb-1">Email</h3>
                    <p className="text-[var(--color-text-muted)]">support@interviewai.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(6,182,212,0.1)] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[var(--color-accent-cyan)]" />
                  </div>
                  <div>
                    <h3 className="text-[var(--color-text-heading)] font-semibold mb-1">Phone</h3>
                    <p className="text-[var(--color-text-muted)]">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <h3 className="text-[var(--color-text-heading)] font-semibold mb-1">Office</h3>
                    <p className="text-[var(--color-text-muted)]">San Francisco, CA 94102</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] flex items-center justify-center transition-colors"
                >
                  <Github className="w-6 h-6 text-[var(--color-text-muted)]" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] border border-[var(--color-border)] flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-[var(--color-text-muted)]" />
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Location</h2>
              <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="aspect-video rounded-lg bg-gradient-to-br from-[rgba(37,99,235,0.1)] to-[rgba(6,182,212,0.1)] flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-center text-[var(--color-text-muted)] mt-4 text-sm">
                  San Francisco, California
                </p>
              </div>
            </div>

            {/* Support Hours */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-6">Support Hours</h2>
              <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                <div className="space-y-2">
                  <div className="flex justify-between text-[var(--color-text-body)]">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-body)]">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-body)]">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
