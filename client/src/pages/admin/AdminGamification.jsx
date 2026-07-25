import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Target,
  Unlock,
  Save,
  X,
} from 'lucide-react';
import PageHeader from '../../components/admin/PageHeader';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import ErrorState from '../../components/admin/ErrorState';
import EmptyState from '../../components/admin/EmptyState';
import axios from 'axios';

const AdminGamification = () => {
  const [view, setView] = useState('challenges'); // challenges, rewards
  const [challenges, setChallenges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === 'challenges') {
        const response = await axios.get('/api/gamification/admin/challenges');
        setChallenges(response.data.data);
      } else {
        const response = await axios.get('/api/gamification/admin/rewards');
        setRewards(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load gamification data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    if (view === 'challenges') {
      setFormData({
        title: '',
        description: '',
        type: 'daily',
        xpReward: 50,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        target: 1,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'xp_boost',
        value: '',
      });
    }
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    if (view === 'challenges') {
      setFormData({
        title: item.title,
        description: item.description,
        type: item.type,
        xpReward: item.xpReward,
        startDate: new Date(item.startDate).toISOString().split('T')[0],
        endDate: new Date(item.endDate).toISOString().split('T')[0],
        target: item.target,
      });
    } else {
      setFormData({
        name: item.name,
        description: item.description,
        type: item.type,
        value: JSON.stringify(item.value || {}),
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      if (view === 'challenges') {
        await axios.delete(`/api/gamification/admin/challenges/${id}`);
        setChallenges(challenges.filter(c => c.id !== id));
      } else {
        await axios.delete(`/api/gamification/admin/rewards/${id}`);
        setRewards(rewards.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'challenges') {
        if (editingItem) {
          await axios.put(`/api/gamification/admin/challenges/${editingItem.id}`, formData);
          setChallenges(challenges.map(c => c.id === editingItem.id ? { ...c, ...formData } : c));
        } else {
          const response = await axios.post('/api/gamification/admin/challenges', formData);
          setChallenges([...challenges, response.data.data]);
        }
      } else {
        const parsedValue = formData.value ? JSON.parse(formData.value) : {};
        const submitData = { ...formData, value: parsedValue };
        
        if (editingItem) {
          await axios.put(`/api/gamification/admin/rewards/${editingItem.id}`, submitData);
          setRewards(rewards.map(r => r.id === editingItem.id ? { ...r, ...submitData } : r));
        } else {
          const response = await axios.post('/api/gamification/admin/rewards', submitData);
          setRewards([...rewards, response.data.data]);
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="card" />
        <LoadingSkeleton type="table" rows={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load gamification data"
        description={error}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Gamification Management"
        description="Manage challenges and rewards for users"
        breadcrumbs={['Dashboard', 'Gamification']}
        primaryActionLabel="Create New"
        onPrimaryAction={handleCreate}
        showRefresh
        onRefresh={fetchData}
      />

      {/* Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setView('challenges')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            view === 'challenges'
              ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)]'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Challenges</span>
        </button>
        <button
          onClick={() => setView('rewards')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            view === 'rewards'
              ? 'bg-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-hover)]'
          }`}
        >
          <Unlock className="w-4 h-4" />
          <span>Rewards</span>
        </button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {view === 'challenges' ? (
          challenges.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No challenges found"
              description="Create challenges to engage users"
              primaryActionLabel="Create Challenge"
              onPrimaryAction={handleCreate}
            />
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        challenge.type === 'daily'
                          ? 'bg-[var(--color-primary-blue)]'
                          : challenge.type === 'weekly'
                          ? 'bg-[var(--color-accent-purple)]'
                          : 'bg-[var(--color-warning)]'
                      }`}>
                        <Target className="w-6 h-6 text-[var(--color-text-heading)]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--color-text-heading)]">{challenge.title}</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">{challenge.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-[var(--color-text-muted)]">
                          <span className="capitalize">{challenge.type}</span>
                          <span>•</span>
                          <span>+{challenge.xpReward} XP</span>
                          <span>•</span>
                          <span>Target: {challenge.target}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(challenge)}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <button
                        onClick={() => handleDelete(challenge.id)}
                        className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          rewards.length === 0 ? (
            <EmptyState
              icon={Unlock}
              title="No rewards found"
              description="Create rewards to incentivize users"
              primaryActionLabel="Create Reward"
              onPrimaryAction={handleCreate}
            />
          ) : (
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center">
                        <Unlock className="w-6 h-6 text-[var(--color-text-heading)]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--color-text-heading)]">{reward.name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">{reward.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-[var(--color-text-muted)]">
                          <span className="capitalize">{reward.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(reward)}
                        className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <button
                        onClick={() => handleDelete(reward.id)}
                        className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">
                {editingItem ? 'Edit' : 'Create'} {view === 'challenges' ? 'Challenge' : 'Reward'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'challenges' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">XP Reward</label>
                    <input
                      type="number"
                      value={formData.xpReward}
                      onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Target</label>
                    <input
                      type="number"
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                    >
                      <option value="xp_boost">XP Boost</option>
                      <option value="badge">Badge</option>
                      <option value="certificate">Certificate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Value (JSON)</label>
                    <textarea
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)] font-mono text-sm"
                      rows={3}
                      placeholder='{"amount": 1.5}'
                    />
                  </div>
                </>
              )}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] hover:bg-[var(--color-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminGamification;
