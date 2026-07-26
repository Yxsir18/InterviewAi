import { Link } from 'react-router-dom';
import { Bot, Github, Linkedin, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-sidebar)] border-t border-[var(--color-border)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-blue)] flex items-center justify-center transition-transform group-hover:scale-105">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-[var(--color-text-heading)] tracking-tight">InterviewAI</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
              AI-powered interview preparation platform helping candidates ace their interviews with real-time feedback and analytics.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-[var(--color-text-muted)]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-[var(--color-text-muted)]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--color-text-heading)] font-semibold mb-6 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/features" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[var(--color-text-heading)] font-semibold mb-6 text-sm uppercase tracking-wider">Features</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/features#ai-interview" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  AI Interview
                </Link>
              </li>
              <li>
                <Link to="/features#coding-interview" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  Coding Interview
                </Link>
              </li>
              <li>
                <Link to="/features#resume-analyzer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/features#certificates" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[var(--color-text-heading)] font-semibold mb-6 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-[var(--color-text-muted)] text-sm">
                <Mail className="w-4 h-4" />
                <span>support@interviewai.com</span>
              </li>
              <li className="flex items-center space-x-3 text-[var(--color-text-muted)] text-sm">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-text-muted)] text-sm">
            © {new Date().getFullYear()} InterviewAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
              Privacy
            </Link>
            <Link to="/terms" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors duration-200">
              Terms
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] transition-all duration-200"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
