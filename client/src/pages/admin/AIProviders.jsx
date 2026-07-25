import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import ErrorState from '../../components/admin/ErrorState';
import axios from 'axios';

const AIProviders = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testing, setTesting] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    defaultProvider: 'groq',
    defaultModel: 'llama3-70b-8192',
    providers: [
      {
        id: 'groq',
        name: 'Groq',
        status: 'active',
        apiKey: '••••••••••••',
        models: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
        requestsToday: 2847,
        errorsToday: 12,
        avgResponseTime: 245,
      },
      {
        id: 'openai',
        name: 'OpenAI',
        status: 'inactive',
        apiKey: '',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        requestsToday: 0,
        errorsToday: 0,
        avgResponseTime: 0,
      },
    ],
  });

  useEffect(() => {
    fetchAISettings();
  }, []);

  const fetchAISettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/admin/ai-settings');
      setAiSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      setError('Failed to load AI settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (providerId) => {
    try {
      setTesting(true);
      await axios.post(`/api/admin/ai-settings/test/${providerId}`);
      alert('Connection test successful');
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put('/api/admin/ai-settings', aiSettings);
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load AI settings"
        description={error}
        onRetry={fetchAISettings}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="AI Management"
        description="Configure AI providers and monitor usage"
        breadcrumbs={['Dashboard', 'AI Management']}
        primaryActionLabel="Save Settings"
        onPrimaryAction={handleSaveSettings}
        showRefresh
        onRefresh={fetchAISettings}
      />

      {/* Default Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl"
      >
        <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">Default AI Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Default Provider</label>
            <select
              value={aiSettings.defaultProvider}
              onChange={(e) => setAiSettings(prev => ({ ...prev, defaultProvider: e.target.value }))}
              className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
            >
              {aiSettings.providers.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Default Model</label>
            <select
              value={aiSettings.defaultModel}
              onChange={(e) => setAiSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
              className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
            >
              {aiSettings.providers.find(p => p.id === aiSettings.defaultProvider)?.models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Providers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">AI Providers</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiSettings.providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg ${provider.status === 'active' ? 'bg-[rgba(16,185,129,0.1)]' : 'bg-[rgba(148,163,184,0.1)]'} flex items-center justify-center`}>
                    <Cpu className={`w-6 h-6 ${provider.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--color-text-heading)]">{provider.name}</h4>
                    <div className="flex items-center space-x-2">
                      {provider.status === 'active' ? (
                        <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[var(--color-text-muted)]" />
                      )}
                      <span className={`text-sm ${provider.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}>
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTestConnection(provider.id)}
                  disabled={testing}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-[rgba(37,99,235,0.1)] border border-[rgba(37,99,235,0.2)] text-[var(--color-primary-blue)] rounded-lg hover:bg-[rgba(37,99,235,0.2)] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Test</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg">
                  <p className="text-[var(--color-text-muted)] text-xs mb-1">Requests Today</p>
                  <p className="text-xl font-bold text-[var(--color-text-heading)]">{provider.requestsToday.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg">
                  <p className="text-[var(--color-text-muted)] text-xs mb-1">Errors Today</p>
                  <p className={`text-xl font-bold ${provider.errorsToday > 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'}`}>
                    {provider.errorsToday}
                  </p>
                </div>
                <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg">
                  <p className="text-[var(--color-text-muted)] text-xs mb-1">Avg Response Time</p>
                  <p className="text-xl font-bold text-[var(--color-text-heading)]">{provider.avgResponseTime}ms</p>
                </div>
                <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg">
                  <p className="text-[var(--color-text-muted)] text-xs mb-1">API Key</p>
                  <p className="text-sm text-[var(--color-text-body)] font-mono">{provider.apiKey || 'Not configured'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-[var(--color-text-muted)] mb-2">Available Models</p>
                <div className="flex flex-wrap gap-2">
                  {provider.models.map(model => (
                    <span
                      key={model}
                      className={`px-3 py-1 rounded-full text-xs ${
                        aiSettings.defaultModel === model && aiSettings.defaultProvider === provider.id
                          ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
                          : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Error Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Recent AI Errors</h3>
          <Activity className="w-5 h-5 text-[var(--color-text-muted)]" />
        </div>
        <div className="space-y-3">
          {[
            { error: 'Rate limit exceeded', provider: 'Groq', time: '5 min ago' },
            { error: 'Invalid API key', provider: 'OpenAI', time: '1 hour ago' },
            { error: 'Connection timeout', provider: 'Groq', time: '2 hours ago' },
          ].map((log, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[var(--color-error)]" />
              <div className="flex-1">
                <p className="text-[var(--color-text-body)]">{log.error}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{log.provider} • {log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AIProviders;
