import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Send,
  Plus,
  AlertTriangle,
  Info,
  Zap,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    type: 'announcement',
    title: '',
    message: '',
    scheduledFor: null,
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/notifications');
      setNotifications(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setSending(true);
      await axios.post('/api/admin/notifications', newNotification);
      setShowCreateModal(false);
      setNewNotification({ type: 'announcement', title: '', message: '', scheduledFor: null });
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const notificationTypes = [
    { id: 'announcement', label: 'Platform Announcement', icon: Bell, color: 'blue' },
    { id: 'maintenance', label: 'Maintenance Notice', icon: AlertTriangle, color: 'yellow' },
    { id: 'feature', label: 'Feature Update', icon: Zap, color: 'green' },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'feature':
        return <Zap className="w-5 h-5 text-green-400" />;
      default:
        return <Info className="w-5 h-5 text-[var(--color-text-muted)]" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[var(--color-text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Notifications</h1>
          <p className="text-[var(--color-text-muted)]">Send platform announcements and updates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-2.5 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Send Notification</span>
        </button>
      </motion.div>

      {/* Notification Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {notificationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border)] transition-colors cursor-pointer"
              onClick={() => {
                setNewNotification(prev => ({ ...prev, type: type.id }));
                setShowCreateModal(true);
              }}
            >
              <div className={`w-12 h-12 rounded-lg ${
                type.color === 'blue' ? 'bg-[rgba(37,99,235,0.1)]' :
                type.color === 'yellow' ? 'bg-[rgba(245,158,11,0.1)]' :
                type.color === 'green' ? 'bg-[rgba(16,185,129,0.1)]' :
                'bg-[rgba(148,163,184,0.1)]'
              } flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${
                  type.color === 'blue' ? 'text-[var(--color-primary-blue)]' :
                  type.color === 'yellow' ? 'text-[var(--color-warning)]' :
                  type.color === 'green' ? 'text-[var(--color-success)]' :
                  'text-[var(--color-text-muted)]'
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-2">{type.label}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {type.id === 'announcement' && 'Broadcast important platform-wide announcements'}
                {type.id === 'maintenance' && 'Notify users about scheduled maintenance windows'}
                {type.id === 'feature' && 'Announce new features and improvements'}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* Recent Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
      >
        <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-body)]">{notification.title}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{notification.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-[var(--color-text-muted)]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {notification.scheduledFor
                        ? `Scheduled: ${new Date(notification.scheduledFor).toLocaleString()}`
                        : `Sent: ${new Date(notification.createdAt).toLocaleString()}`}
                    </span>
                  </div>
                  {notification.status === 'sent' && (
                    <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                  )}
                  {notification.status === 'scheduled' && (
                    <Calendar className="w-5 h-5 text-[var(--color-warning)]" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[var(--color-text-muted)]">
              No notifications sent yet. Create your first one.
            </div>
          )}
        </div>
      </motion.div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">Send Notification</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors"
              >
                <Clock className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Notification Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                  className="enterprise-input w-full"
                >
                  {notificationTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="enterprise-input w-full"
                  placeholder="e.g., Scheduled Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  className="enterprise-input w-full h-32"
                  placeholder="Enter your notification message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  value={newNotification.scheduledFor || ''}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledFor: e.target.value || null }))}
                  className="enterprise-input w-full"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] hover:bg-[var(--color-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={sending || !newNotification.title || !newNotification.message}
                  className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors disabled:opacity-50"
                >
                  {sending ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{sending ? 'Sending...' : newNotification.scheduledFor ? 'Schedule' : 'Send Now'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationCenter;
