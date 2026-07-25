import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookmarks, createBookmark, deleteBookmark } from '../redux/slices/profileSlice';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  Trash2,
  Search,
  Filter,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { bookmarks, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getBookmarks());
  }, [dispatch]);

  const handleDelete = async (bookmarkId) => {
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      try {
        await dispatch(deleteBookmark(bookmarkId)).unwrap();
        toast.success('Bookmark removed');
      } catch (error) {
        toast.error(error || 'Failed to remove bookmark');
      }
    }
  };

  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bookmark);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-heading)] mb-2">Bookmarks</h1>
          <p className="text-[var(--color-text-muted)]">Questions you've saved for later review</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              className="glass-input pl-10 w-64"
            />
          </div>
        </div>
      </motion.div>

      {/* Bookmarks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
            <Bookmark className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-heading)]">No bookmarks yet</h3>
            <p className="text-[var(--color-text-muted)]">Save difficult questions during interviews to review them later</p>
          </div>
        ) : (
          Object.entries(groupedBookmarks).map(([category, categoryBookmarks], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-[var(--color-primary-blue)]" />
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)]">{category}</h3>
                <span className="text-sm text-[var(--color-text-muted)]">({categoryBookmarks.length})</span>
              </div>

              <div className="space-y-3">
                {categoryBookmarks.map((bookmark, index) => (
                  <motion.div
                    key={bookmark._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)]/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-[rgba(37,99,235,0.1)] text-[var(--color-primary-blue)]">
                            {bookmark.difficulty}
                          </span>
                          {bookmark.interview && (
                            <span className="text-xs text-[var(--color-text-muted)]">
                              From interview
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--color-text-body)] mb-2">{bookmark.questionText}</p>
                        {bookmark.notes && (
                          <p className="text-sm text-[var(--color-text-muted)] italic">"{bookmark.notes}"</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(bookmark._id)}
                        className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-5 h-5 text-[var(--color-text-muted)] hover:text-[var(--color-error)]" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Bookmarks;
