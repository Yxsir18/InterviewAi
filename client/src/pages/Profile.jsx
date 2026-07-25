import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, uploadAvatar } from '../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Camera,
  Save,
  Building2,
  GraduationCap,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PremiumCard from '../components/ui/PremiumCard';
import PremiumButton from '../components/ui/PremiumButton';
import PremiumInput from '../components/ui/PremiumInput';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(profile?.skills || []), newSkill.trim()];
      dispatch(updateProfile({ skills: updatedSkills }));
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = (profile?.skills || []).filter(skill => skill !== skillToRemove);
    dispatch(updateProfile({ skills: updatedSkills }));
  };

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.name || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        await dispatch(uploadAvatar(formData)).unwrap();
        toast.success('Avatar updated successfully!');
      } catch (error) {
        toast.error(error || 'Failed to upload avatar');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-text-primary)]">
          <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">Profile</span>
        </h1>
        <p className="text-[var(--color-text-muted)]">Manage your personal information</p>
      </motion.div>

      {/* Profile Card */}
      <PremiumCard className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary-blue)] to-[var(--color-secondary-cyan)] flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue-hover)] cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1 text-[var(--color-text-heading)]">{user?.name}</h2>
              <p className="text-[var(--color-text-muted)] mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-[var(--color-primary-blue)]/20 text-[var(--color-primary-blue)] text-sm">
                  {user?.role}
                </span>
                {user?.isEmailVerified ? (
                  <span className="px-3 py-1 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)] text-sm">
                    Verified
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-sm">
                    Unverified
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <PremiumButton
              onClick={() => setIsEditing(!isEditing)}
              icon={Edit2}
              variant="secondary"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </PremiumButton>
          </div>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 pt-8 border-t border-[var(--color-border)] space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">GitHub</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            <PremiumButton
              onClick={handleSave}
              loading={loading}
              icon={Sparkles}
            >
              Save Changes
            </PremiumButton>
          </motion.div>
        )}
      </PremiumCard>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <PremiumCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Skills</h3>
            <PremiumButton
              onClick={() => setShowAddSkill(!showAddSkill)}
              icon={Plus}
              variant="secondary"
              size="sm"
            >
              Add Skill
            </PremiumButton>
          </div>
          
          {showAddSkill && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 flex gap-2"
            >
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill..."
                className="flex-1 px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent-primary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <PremiumButton onClick={handleAddSkill} icon={Sparkles} size="sm">
                Add
              </PremiumButton>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-2">
            {(profile?.skills || []).map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-[var(--color-error)] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          {(!profile?.skills || profile.skills.length === 0) && (
            <p className="text-[var(--color-text-muted)] text-center py-4">No skills added yet</p>
          )}
        </PremiumCard>
      </motion.div>

      {/* Experience */}
      {profile?.experience && profile.experience.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Experience</h3>
              <button className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                <Plus className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="p-4 rounded-xl bg-[var(--color-surface)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text-primary)]">{exp.title}</h4>
                      <p className="text-[var(--color-text-muted)]">{exp.company}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                      <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      )}

      {/* Education */}
      {profile?.education && profile.education.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Education</h3>
              <button className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                <Plus className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="p-4 rounded-xl bg-[var(--color-surface)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text-primary)]">{edu.school}</h4>
                      <p className="text-[var(--color-text-muted)]">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {new Date(edu.startDate).toLocaleDateString()} - {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                      <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      )}

      {/* Projects */}
      {profile?.projects && profile.projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Projects</h3>
              <button className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                <Plus className="w-5 h-5 text-[var(--color-text-muted)]" />
              </button>
            </div>
            <div className="space-y-4">
              {profile.projects.map((project, index) => (
                <div key={index} className="p-4 rounded-xl bg-[var(--color-surface)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-[var(--color-text-primary)]">{project.name}</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-lg bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors">
                      <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
