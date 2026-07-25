import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Shield,
  CreditCard,
  Trash2,
  Save,
  ChevronRight,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumCard from '../components/ui/PremiumCard';
import PremiumButton from '../components/ui/PremiumButton';
import { getSettings, updateSettings, updatePassword, deleteAccount, setTheme } from '../redux/slices/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { settings, loading } = useSelector((state) => state.settings);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    dispatch(getSettings());
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, [dispatch]);

  const toggleDarkMode = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    document.documentElement.setAttribute('data-theme', newTheme);
    dispatch(updateSettings({ theme: newTheme }));
  };

  const handleNotificationChange = (key) => {
    const updatedNotifications = {
      ...settings.notifications,
      [key]: !settings.notifications[key],
    };
    dispatch(updateSettings({ notifications: updatedNotifications }));
  };

  const handlePrivacyChange = (key, value) => {
    const updatedPrivacy = {
      ...settings.privacy,
      [key]: value,
    };
    dispatch(updateSettings({ privacy: updatedPrivacy }));
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(updateSettings(settings)).unwrap();
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error(error || 'Failed to save settings');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await dispatch(updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error || 'Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await dispatch(deleteAccount(password)).unwrap();
        toast.success('Account deleted successfully');
        window.location.href = '/login';
      } catch (error) {
        toast.error(error || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-heading)]">
          <span className="bg-gradient-to-r from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">Manage your account settings and preferences</p>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-[var(--color-primary-blue)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Account Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">Email Address</p>
                <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>

            <div 
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)] cursor-pointer hover:bg-[var(--color-hover)] transition-colors"
              onClick={() => setShowPasswordModal(true)}
            >
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Change Password</p>
                <p className="text-sm text-[var(--color-text-muted)]">Update your password</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Two-Factor Authentication</p>
                <p className="text-sm text-[var(--color-text-muted)]">Add extra security to your account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-6 h-6 text-[var(--color-primary-blue)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div className="flex items-center space-x-3">
                {settings.theme === 'dark' ? <Moon className="w-5 h-5 text-[var(--color-text-muted)]" /> : <Sun className="w-5 h-5 text-[var(--color-text-muted)]" />}
                <div>
                  <p className="font-medium text-[var(--color-text-heading)]">Dark Mode</p>
                  <p className="text-sm text-[var(--color-text-muted)]">Toggle dark/light theme</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="relative w-12 h-6 bg-[var(--color-primary-blue)] rounded-full transition-colors"
              >
                <motion.div
                  initial={false}
                  animate={{ x: settings.theme === 'dark' ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-[var(--color-primary-blue)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
              { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Get reminded about scheduled interviews' },
              { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly progress reports' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">{item.label}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationChange(item.key)}
                  className="relative w-12 h-6 bg-[var(--color-bg-secondary)] rounded-full transition-colors"
                >
                  <motion.div
                    initial={false}
                    animate={{ x: settings.notifications[item.key] ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`absolute top-1 w-4 h-4 rounded-full ${settings.notifications[item.key] ? 'bg-[var(--color-primary-blue)]' : 'bg-[var(--color-text-muted)]'}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </PremiumCard>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-[var(--color-primary-blue)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Privacy</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--color-surface)]">
              <p className="font-medium text-[var(--color-text-heading)] mb-3">Profile Visibility</p>
              <div className="space-y-2">
                {['public', 'private', 'friends'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value={option}
                      checked={settings.privacy.profileVisibility === option}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-4 h-4 accent-[var(--color-primary-blue)]"
                    />
                    <span className="text-[var(--color-text-body)] capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">Show Interview History</p>
                <p className="text-sm text-[var(--color-text-muted)]">Allow others to see your interview history</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('showInterviewHistory', !settings.privacy.showInterviewHistory)}
                className="relative w-12 h-6 bg-[var(--color-bg-secondary)] rounded-full transition-colors"
              >
                <motion.div
                  initial={false}
                  animate={{ x: settings.privacy.showInterviewHistory ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-1 w-4 h-4 rounded-full ${settings.privacy.showInterviewHistory ? 'bg-[var(--color-primary-blue)]' : 'bg-[var(--color-text-muted)]'}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">Show Certificates</p>
                <p className="text-sm text-[var(--color-text-muted)]">Display certificates on your profile</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('showCertificates', !settings.privacy.showCertificates)}
                className="relative w-12 h-6 bg-[var(--color-bg-secondary)] rounded-full transition-colors"
              >
                <motion.div
                  initial={false}
                  animate={{ x: settings.privacy.showCertificates ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-1 w-4 h-4 rounded-full ${settings.privacy.showCertificates ? 'bg-[var(--color-primary-blue)]' : 'bg-[var(--color-text-muted)]'}`}
                />
              </button>
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Billing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="w-6 h-6 text-[var(--color-primary-blue)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Billing</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">Current Plan</p>
                <p className="text-sm text-[var(--color-text-muted)]">Free Plan</p>
              </div>
              <PremiumButton variant="secondary" size="sm">
                Upgrade
              </PremiumButton>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">Payment Methods</p>
                <p className="text-sm text-[var(--color-text-muted)]">Manage your payment methods</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)]">
              <div>
                <p className="font-medium text-[var(--color-text-heading)]">Billing History</p>
                <p className="text-sm text-[var(--color-text-muted)]">View past invoices</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PremiumCard className="p-6 border-[var(--color-error)]/30">
          <div className="flex items-center space-x-3 mb-6">
            <Trash2 className="w-6 h-6 text-[var(--color-error)]" />
            <h3 className="text-xl font-semibold text-[var(--color-error)]">Danger Zone</h3>
          </div>
          
          <div className="p-4 rounded-xl bg-[var(--color-error)]/10 border border-[var(--color-error)]/30">
            <p className="font-medium text-[var(--color-text-primary)] mb-2">Delete Account</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <PremiumButton
              onClick={handleDeleteAccount}
              variant="danger"
              icon={Trash2}
            >
              Delete Account
            </PremiumButton>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-end"
      >
        <PremiumButton
          onClick={handleSaveSettings}
          loading={loading}
          icon={Save}
          size="lg"
        >
          Save All Settings
        </PremiumButton>
      </motion.div>

      {/* Password Modal */}
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] p-4 overflow-y-auto"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">Change Password</h3>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)]"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)]"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary-blue)] text-[var(--color-text-heading)] placeholder-[var(--color-text-muted)]"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <PremiumButton
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  variant="secondary"
                >
                  Cancel
                </PremiumButton>
                <PremiumButton
                  type="submit"
                  loading={loading}
                  icon={Lock}
                >
                  Update Password
                </PremiumButton>
              </div>
            </form>
          </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
