import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  RefreshCw,
  Globe,
  ToggleLeft,
  ToggleRight,
  Cpu,
  Sliders,
  Shield,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import ErrorState from '../../components/admin/ErrorState';
import axios from 'axios';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'InterviewAI',
    platformLogo: '',
    maintenanceMode: false,
    defaultAIProvider: 'groq',
    defaultAIModel: 'llama3-70b-8192',
    maxDailyInterviews: 10,
    maxWeeklyInterviews: 50,
    enableGamification: true,
    enableCertificates: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/settings');
      setPlatformSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/api/admin/settings', platformSettings);
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setPlatformSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--color-primary-blue)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
      <span className="text-[var(--color-text-body)]">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className="relative w-12 h-6 rounded-full transition-colors"
      >
        {enabled ? (
          <div className="absolute inset-0 bg-[var(--color-primary-blue)] rounded-full">
            <div className="absolute right-1 top-1 w-4 h-4 bg-[var(--color-text-heading)] rounded-full" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[var(--color-surface)] rounded-full">
            <div className="absolute left-1 top-1 w-4 h-4 bg-[var(--color-text-heading)] rounded-full" />
          </div>
        )}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load settings"
        description={error}
        onRetry={fetchSettings}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Configure platform settings and preferences"
        breadcrumbs={['Dashboard', 'Settings']}
        primaryActionLabel="Save Changes"
        onPrimaryAction={handleSave}
        showRefresh
        onRefresh={fetchSettings}
      />

      {/* Platform Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SettingSection title="Platform Settings" icon={Globe}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Platform Name</label>
              <input
                type="text"
                value={platformSettings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Platform Logo URL</label>
              <input
                type="text"
                value={platformSettings.platformLogo}
                onChange={(e) => handleChange('platformLogo', e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <Toggle
              enabled={platformSettings.maintenanceMode}
              onChange={(value) => handleChange('maintenanceMode', value)}
              label="Maintenance Mode"
            />
            {platformSettings.maintenanceMode && (
              <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                <p className="text-[var(--color-warning)] text-sm">
                  Platform is in maintenance mode. Only admins can access the system.
                </p>
              </div>
            )}
          </div>
        </SettingSection>
      </motion.div>

      {/* AI Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SettingSection title="AI Settings" icon={Cpu}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Default AI Provider</label>
              <select
                value={platformSettings.defaultAIProvider}
                onChange={(e) => handleChange('defaultAIProvider', e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
              >
                <option value="groq">Groq</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Default AI Model</label>
              <select
                value={platformSettings.defaultAIModel}
                onChange={(e) => handleChange('defaultAIModel', e.target.value)}
                className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
              >
                <option value="llama3-70b-8192">Llama 3 70B</option>
                <option value="llama3-8b-8192">Llama 3 8B</option>
                <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                <option value="gemma-7b-it">Gemma 7B</option>
              </select>
            </div>
          </div>
        </SettingSection>
      </motion.div>

      {/* Interview Limits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SettingSection title="Interview Limits" icon={Sliders}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Max Daily Interviews (per user)</label>
              <input
                type="number"
                value={platformSettings.maxDailyInterviews}
                onChange={(e) => handleChange('maxDailyInterviews', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Max Weekly Interviews (per user)</label>
              <input
                type="number"
                value={platformSettings.maxWeeklyInterviews}
                onChange={(e) => handleChange('maxWeeklyInterviews', parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                min="1"
              />
            </div>
          </div>
        </SettingSection>
      </motion.div>

      {/* Feature Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SettingSection title="Feature Settings" icon={Shield}>
          <div className="space-y-4">
            <Toggle
              enabled={platformSettings.enableGamification}
              onChange={(value) => handleChange('enableGamification', value)}
              label="Enable Gamification"
            />
            <Toggle
              enabled={platformSettings.enableCertificates}
              onChange={(value) => handleChange('enableCertificates', value)}
              label="Enable Certificates"
            />
          </div>
        </SettingSection>
      </motion.div>

      {/* Save Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
            <span className="text-[var(--color-text-muted)]">Settings are automatically saved</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="text-sm">Save Now</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
