import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotes, createNote, updateNote, deleteNote } from '../redux/slices/profileSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote,
  Plus,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Notes = () => {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.profile);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      await dispatch(createNote({
        interviewId: notes[0]?.interview?._id || null,
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
      })).unwrap();
      toast.success('Note created successfully!');
      setIsCreating(false);
      setFormData({ title: '', content: '', tags: [] });
    } catch (error) {
      toast.error(error || 'Failed to create note');
    }
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateNote({
        noteId: editingNote._id,
        noteData: formData,
      })).unwrap();
      toast.success('Note updated successfully!');
      setEditingNote(null);
      setFormData({ title: '', content: '', tags: [] });
    } catch (error) {
      toast.error(error || 'Failed to update note');
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await dispatch(deleteNote(noteId)).unwrap();
        toast.success('Note deleted');
      } catch (error) {
        toast.error(error || 'Failed to delete note');
      }
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', tags: [] });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Notes</h1>
          <p className="text-[var(--color-text-muted)]">Personal notes from your interviews</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="glass-button flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Note</span>
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="glass-input pl-10 w-full"
          />
        </div>
      </motion.div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingNote) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-heading)]">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="glass-input w-full"
                  placeholder="Note title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="glass-input w-full resize-none"
                  placeholder="Write your note here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="glass-input w-full"
                  placeholder="react, hooks, javascript"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={editingNote ? handleUpdate : handleCreate}
                  disabled={loading}
                  className="glass-button flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="spinner w-5 h-5"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingNote ? 'Update' : 'Create'}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] hover:bg-[var(--color-hover)] transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="col-span-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
            <StickyNote className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-heading)]">No notes yet</h3>
            <p className="text-[var(--color-text-muted)]">Create notes after interviews to track your learning</p>
          </div>
        ) : (
          filteredNotes.map((note, index) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-primary-blue)]/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold line-clamp-2 text-[var(--color-text-body)]">{note.title}</h3>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-error)]" />
                  </button>
                </div>
              </div>

              <p className="text-[var(--color-text-muted)] text-sm line-clamp-4 mb-4">{note.content}</p>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-lg bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)]">
                <Calendar className="w-4 h-4" />
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Notes;
