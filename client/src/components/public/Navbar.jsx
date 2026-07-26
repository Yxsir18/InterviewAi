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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-h-[64px]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 no-underline group">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-blue)] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-[var(--color-text-heading)] tracking-tight">InterviewAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  location.pathname === item.path
                    ? 'text-[var(--color-text-heading)'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[var(--color-primary-blue)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeSwitcher />
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] transition-colors duration-200 min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-2 px-5 py-2.5 bg-[var(--color-primary-blue)] text-white rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-all duration-200 text-sm font-medium min-h-[44px] shadow-sm hover:shadow"
            >
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)] transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden bg-[var(--color-sidebar)] border-b border-[var(--color-border)] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[48px] flex items-center ${
                    location.pathname === item.path
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-heading)'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-body)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-6 mt-6 border-t border-[var(--color-border)] space-y-2">
                <div className="px-4">
                  <ThemeSwitcher />
                </div>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] rounded-lg transition-all duration-200 min-h-[48px]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-[var(--color-primary-blue)] text-white rounded-lg text-sm font-medium min-h-[48px] shadow-sm"
                >
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
