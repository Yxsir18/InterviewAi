import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Code,
  FileText,
  BarChart3,
  Award,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Mic,
  Trophy,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const SIDEBAR_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'interviews',
    label: 'Interviews',
    icon: MessageSquare,
    path: '/dashboard/interview/generator',
  },
  {
    id: 'company-interviews',
    label: 'Company Interviews',
    icon: Building2,
    path: '/dashboard/company-interview',
  },
  {
    id: 'voice-interviews',
    label: 'Voice Interviews',
    icon: Mic,
    path: '/dashboard/voice-interview',
  },
  {
    id: 'coding',
    label: 'Coding Interview',
    icon: Code,
    path: '/dashboard/interview/coding/generator',
  },
  {
    id: 'gamification',
    label: 'Gamification',
    icon: Trophy,
    path: '/dashboard/gamification',
  },
  {
    id: 'resume',
    label: 'Resume Analyzer',
    icon: FileText,
    path: '/dashboard/resume/upload',
  },
  {
    id: 'resume-builder',
    label: 'Resume Builder',
    icon: FileText,
    path: '/dashboard/resume/builder',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/dashboard/interview/history',
  },
  {
    id: 'certificates',
    label: 'Certificates',
    icon: Award,
    path: '/dashboard/certificates',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/dashboard/profile',
  },
];

const PremiumSidebar = ({ collapsed, onToggle, isMobile }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 72 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={`h-screen bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col flex-shrink-0 ${
        isMobile ? 'fixed left-0 top-0 z-50' : 'relative'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--color-text-heading)]" />
              </div>
              <span className="text-lg font-semibold text-[var(--color-text-heading)]">InterviewAI</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setExpandedItem(item.id)}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? 'bg-[var(--color-hover)] text-[var(--color-primary-blue)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]'
                }`}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--color-primary-blue)] rounded-r-full"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                {/* Icon */}
                <Icon className="w-5 h-5 flex-shrink-0" />

                {/* Label */}
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-md text-sm text-[var(--color-text-heading)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-hover)] transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-3 font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default PremiumSidebar;
