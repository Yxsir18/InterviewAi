import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  History,
  Bookmark,
  StickyNote,
  BarChart3,
  Award,
  User,
  Shield,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ variant = 'default' }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Interview', href: '/interview/generator', icon: FileText },
    { name: 'History', href: '/interview/history', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Notes', href: '/notes', icon: StickyNote },
    { name: 'Certificates', href: '/certificates', icon: Award },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Shield },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const navigation = variant === 'admin' ? adminNavigation : userNavigation;
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[var(--color-navbar)]/50 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 min-h-[64px]">
          {/* Logo */}
          <Link 
            to={variant === 'admin' ? '/admin/dashboard' : '/dashboard'} 
            className="flex items-center gap-2 sm:gap-3 no-underline"
          >
            <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-primary-blue)] flex items-center justify-center flex-shrink-0">
              {variant === 'admin' ? (
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-primary-blue)] bg-clip-text text-transparent">
              InterviewAI {variant === 'admin' ? 'Admin' : ''}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  isActive(item.href)
                    ? 'text-[var(--color-accent-purple)] bg-[rgba(124,58,237,0.2)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-transparent border-none cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-4 pt-4 border-t border-[var(--color-border)]"
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                    isActive(item.href)
                      ? 'text-[var(--color-accent-purple)] bg-[rgba(124,58,237,0.2)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
