import { Link } from 'react-router-dom';
import { Bot, Github, Linkedin, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-sidebar)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--color-text-heading)]">InterviewAI</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm">
              AI-powered interview preparation platform helping candidates ace their interviews with real-time feedback and analytics.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] transition-colors"
              >
                <Github className="w-5 h-5 text-[var(--color-text-muted)]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[var(--color-text-muted)]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[var(--color-text-heading)] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-[var(--color-text-heading)] font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features#ai-interview" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  AI Interview
                </Link>
              </li>
              <li>
                <Link to="/features#coding-interview" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  Coding Interview
                </Link>
              </li>
              <li>
                <Link to="/features#resume-analyzer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/features#certificates" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  Certificates
                </Link>
              </li>
              <li>
                <Link to="/features#analytics" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[var(--color-text-heading)] font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-[var(--color-text-muted)] text-sm">
                <Mail className="w-4 h-4" />
                <span>support@interviewai.com</span>
              </li>
              <li className="flex items-center space-x-3 text-[var(--color-text-muted)] text-sm">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-[var(--color-text-muted)] text-sm">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between">
          <p className="text-[var(--color-text-muted)] text-sm">
            © {new Date().getFullYear()} InterviewAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] text-sm transition-colors">
              Terms & Conditions
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-hover)] transition-colors mt-4 md:mt-0"
          >
            <ArrowUp className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
