import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Cpu,
  Trophy,
  Award,
  Bell,
  ScrollText,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Menu
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const EnterpriseSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'interviews', label: 'Interviews', icon: FileText, path: '/admin/interviews' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'ai-providers', label: 'AI Management', icon: Cpu, path: '/admin/ai-providers' },
    { id: 'gamification', label: 'Gamification', icon: Trophy, path: '/admin/gamification' },
    { id: 'certificates', label: 'Certificates', icon: Award, path: '/admin/certificates' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { id: 'logs', label: 'Activity Logs', icon: ScrollText, path: '/admin/logs' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl mx-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[var(--color-border)]">
                <div className="flex items-center space-x-3">
                  <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search anything... (Cmd+K)"
                    className="flex-1 bg-transparent border-none outline-none text-[var(--color-text-body)] placeholder-[var(--color-text-muted)]"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-[var(--color-text-muted)] mb-3">Quick Actions</p>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 hover:bg-[var(--color-hover)] rounded-lg transition-colors flex items-center space-x-3 min-h-[44px]">
                    <Users className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-body)]">Go to User Management</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-[var(--color-hover)] rounded-lg transition-colors flex items-center space-x-3 min-h-[44px]">
                    <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-body)]">Go to Interview Management</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-[var(--color-hover)] rounded-lg transition-colors flex items-center space-x-3 min-h-[44px]">
                    <Settings className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-body)]">Go to Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-sidebar)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? '80px' : '280px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 bottom-0 bg-[var(--color-sidebar)] border-r border-[var(--color-border)] z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'left-0' : '-left-full lg:left-0'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--color-primary-blue)] rounded-xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1"
                >
                  <h1 className="text-lg font-bold text-[var(--color-text-heading)]">InterviewAI</h1>
                  <p className="text-xs text-[var(--color-text-muted)]">Admin Console</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Button */}
        <div className="p-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center space-x-3 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <Search className="w-4 h-4 text-[var(--color-text-muted)]" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm text-[var(--color-text-muted)]"
                >
                  Search...
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-auto"
                >
                  <kbd className="px-2 py-0.5 text-xs bg-[var(--color-surface)] rounded text-[var(--color-text-muted)]">⌘K</kbd>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all min-h-[44px] ${
                  active
                    ? 'bg-[var(--color-primary-blue)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-hover)]'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && !collapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center space-x-3 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                <span className="text-sm text-[var(--color-text-muted)]">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--color-border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[var(--color-error)] rounded-lg hover:bg-[rgba(239,68,68,0.2)] transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default EnterpriseSidebar;
