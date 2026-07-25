import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Target,
  Award,
  Zap,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import axios from 'axios';

const GamificationManagement = () => {
  const [activeTab, setActiveTab] = useState('badges');
  const [loading, setLoading] = useState(true);
  const [gamificationData, setGamificationData] = useState({
    badges: [],
    achievements: [],
    challenges: [],
    xpRules: {
      interviewCompleted: 100,
      interviewScoreAbove80: 50,
      interviewScoreAbove90: 100,
      dailyLogin: 10,
      weeklyStreak: 50,
      certificateEarned: 200,
    },
    careerRanks: [],
  });

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/gamification');
      setGamificationData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
      setLoading(false);
    }
  };

  const handleSaveXP = async () => {
    try {
      await axios.put('/api/admin/gamification/xp-rules', gamificationData.xpRules);
      alert('XP rules saved successfully');
    } catch (error) {
      console.error('Error saving XP rules:', error);
      alert('Failed to save XP rules');
    }
  };

  const handleSaveCareerRanks = async () => {
    try {
      await axios.put('/api/admin/gamification/career-ranks', gamificationData.careerRanks);
      alert('Career ranks saved successfully');
    } catch (error) {
      console.error('Error saving career ranks:', error);
      alert('Failed to save career ranks');
    }
  };

  const tabs = [
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'achievements', label: 'Achievements', icon: Star },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'xp', label: 'XP Rules', icon: Zap },
    { id: 'ranks', label: 'Career Ranks', icon: Trophy },
  ];

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
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Gamification</h1>
          <p className="text-[var(--color-text-muted)]">Manage badges, achievements, challenges, and XP rules</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-2 border-b border-[var(--color-border)]"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[var(--color-primary-blue)] text-[var(--color-text-heading)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {activeTab === 'xp' ? (
          <div className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">XP Rules</h3>
              <button
                onClick={handleSaveXP}
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Rules</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gamificationData.xpRules).map(([key, value]) => (
                <div key={key} className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setGamificationData(prev => ({
                      ...prev,
                      xpRules: {
                        ...prev.xpRules,
                        [key]: parseInt(e.target.value),
                      },
                    }))}
                    className="w-full px-4 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'ranks' ? (
          <div className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)]">Career Rank Configuration</h3>
              <button
                onClick={handleSaveCareerRanks}
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </div>
            <div className="space-y-4">
              {gamificationData.careerRanks?.length > 0 ? (
                gamificationData.careerRanks.map((rank, index) => (
                  <div key={index} className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Rank Name</label>
                        <input
                          type="text"
                          value={rank.name}
                          onChange={(e) => {
                            const newRanks = [...gamificationData.careerRanks];
                            newRanks[index].name = e.target.value;
                            setGamificationData(prev => ({ ...prev, careerRanks: newRanks }));
                          }}
                          className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Minimum Level</label>
                        <input
                          type="number"
                          value={rank.minLevel}
                          onChange={(e) => {
                            const newRanks = [...gamificationData.careerRanks];
                            newRanks[index].minLevel = parseInt(e.target.value);
                            setGamificationData(prev => ({ ...prev, careerRanks: newRanks }));
                          }}
                          className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Badge Color</label>
                        <select
                          value={rank.color}
                          onChange={(e) => {
                            const newRanks = [...gamificationData.careerRanks];
                            newRanks[index].color = e.target.value;
                            setGamificationData(prev => ({ ...prev, careerRanks: newRanks }));
                          }}
                          className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                        >
                          <option value="gray">Gray</option>
                          <option value="orange">Orange</option>
                          <option value="indigo">Indigo</option>
                          <option value="green">Green</option>
                          <option value="blue">Blue</option>
                          <option value="purple">Purple</option>
                          <option value="yellow">Yellow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                [
                  { name: 'Intern', minLevel: 1, color: 'gray' },
                  { name: 'Junior Developer', minLevel: 6, color: 'orange' },
                  { name: 'Software Engineer', minLevel: 11, color: 'indigo' },
                  { name: 'Senior Developer', minLevel: 21, color: 'green' },
                  { name: 'Interview Expert', minLevel: 31, color: 'blue' },
                ].map((rank, index) => (
                  <div key={index} className="p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Rank Name</label>
                        <input
                          type="text"
                          defaultValue={rank.name}
                          className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Minimum Level</label>
                        <input
                          type="number"
                          defaultValue={rank.minLevel}
                          className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Badge Color</label>
                        <select
                          defaultValue={rank.color}
                          className="w-full px-3 py-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-primary-blue)]"
                        >
                          <option value="gray">Gray</option>
                          <option value="orange">Orange</option>
                          <option value="indigo">Indigo</option>
                          <option value="green">Green</option>
                          <option value="blue">Blue</option>
                          <option value="purple">Purple</option>
                          <option value="yellow">Yellow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)] capitalize">{activeTab}</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[var(--color-primary-blue)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-primary-blue-hover)] transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
            <div className="space-y-3">
              {gamificationData[activeTab]?.length > 0 ? (
                gamificationData[activeTab].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
                        {activeTab === 'badges' && <Award className="w-6 h-6 text-[var(--color-primary-blue)]" />}
                        {activeTab === 'achievements' && <Star className="w-6 h-6 text-[var(--color-warning)]" />}
                        {activeTab === 'challenges' && <Target className="w-6 h-6 text-[var(--color-success)]" />}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-text-heading)]">{item.name || item.title}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </button>
                      <button className="p-2 hover:bg-[var(--color-hover)] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-[var(--color-text-muted)]">
                  No {activeTab} found. Add your first one.
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GamificationManagement;
