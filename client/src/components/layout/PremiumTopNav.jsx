import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Moon,
  Sun,
  X,
  Star,
  Flame,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import axios from 'axios';

const PremiumTopNav = ({ user, onMenuToggle, isDarkMode, onToggleDarkMode, isMobile }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [gamification, setGamification] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchGamification();
  }, []);

  const fetchGamification = async () => {
    try {
      const response = await axios.get('/api/gamification/profile');
      setGamification(response.data.data);
    } catch (error) {
      console.error('Error fetching gamification:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setProfileOpen(false);
  };

  const notifications = [
    { id: 1, title: 'Interview completed', message: 'Your MERN Stack interview is ready for review', time: '2 hours ago' },
    { id: 2, title: 'New certificate', message: 'You earned a certificate for React mastery', time: '1 day ago' },
    { id: 3, title: 'Weekly report', message: 'Your weekly progress report is available', time: '2 days ago' },
  ];

  return (
    <header className="h-16 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--color-text-primary)] hidden md:block">InterviewAI</span>
        </div>

        {/* Search - Hidden on mobile */}
        {!isMobile && (
          <div className="relative">
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-10 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
                      autoFocus
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Gamification Badges */}
        {gamification && (
          <>
            {/* Level Badge */}
            <motion.div
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] px-3 py-1.5 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm">Level {gamification.level}</span>
            </motion.div>

            {/* Streak Badge - Hidden on mobile */}
            {gamification.streak.current > 0 && !isMobile && (
              <motion.div
                className="hidden lg:flex items-center space-x-2 bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-orange-500 font-semibold text-sm">{gamification.streak.current} Day Streak</span>
              </motion.div>
            )}

            {/* Total XP Badge */}
            <motion.div
              className="flex items-center space-x-2 bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-4 h-4 text-[var(--color-accent-primary)]" />
              <span className="text-[var(--color-text-primary)] font-semibold text-sm">{gamification.totalXP} XP</span>
            </motion.div>
          </>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-accent-primary)] rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setNotificationsOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-xl)] z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-[var(--color-border)]">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors cursor-pointer"
                      >
                        <p className="font-medium text-[var(--color-text-primary)] text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-[var(--color-border)]">
                    <button className="w-full text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center text-white font-medium text-sm overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-xl)] z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-[var(--color-border)]">
                    <p className="font-medium text-[var(--color-text-primary)]">{user?.name || 'User'}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{user?.email || ''}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-primary)]"
                    >
                      <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <span className="text-sm">Profile</span>
                    </button>
                    <button 
                      onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-primary)]"
                    >
                      <Settings className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-[var(--color-border)]">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-[var(--color-danger)]"
                    >
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default PremiumTopNav;
