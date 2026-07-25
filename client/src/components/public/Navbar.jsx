import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Bot,
  Code,
  FileText,
  Award,
  BarChart3,
  Shield,
  LogIn,
  UserPlus,
} from 'lucide-react';
import ThemeSwitcher from '../ui/ThemeSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const featureItems = [
    { name: 'AI Interview', icon: Bot, path: '/features#ai-interview' },
    { name: 'Coding Interview', icon: Code, path: '/features#coding-interview' },
    { name: 'Resume Analyzer', icon: FileText, path: '/features#resume-analyzer' },
    { name: 'Certificates', icon: Award, path: '/features#certificates' },
    { name: 'Analytics', icon: BarChart3, path: '/features#analytics' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-navbar)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 min-h-[64px]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 no-underline">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-[var(--color-text-heading)]">InterviewAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'text-[var(--color-primary-blue)]'
                    : 'text-[var(--color-text-body)] hover:text-[var(--color-text-heading)]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3 sm:space-x-4">
            <ThemeSwitcher />
            <Link
              to="/login"
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium text-[var(--color-text-body)] hover:text-[var(--color-text-heading)] transition-colors min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium min-h-[44px]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[var(--color-sidebar)] border-b border-[var(--color-border)] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    location.pathname === item.path
                      ? 'bg-[rgba(37,99,235,0.2)] text-[var(--color-primary-blue)]'
                      : 'text-[var(--color-text-body)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-heading)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
                <ThemeSwitcher />
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-[var(--color-text-body)] hover:bg-[var(--color-hover)] rounded-lg transition-colors min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] text-white rounded-lg text-sm font-medium min-h-[44px]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
