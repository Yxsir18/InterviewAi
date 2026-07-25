import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ActionModal = ({
  isOpen,
  onClose,
  title,
  user,
  actions,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--color-text-heading)]">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>
              
              {user && (
                <div className="flex items-center space-x-4 mb-6 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user.avatar ? (
                      <img 
                        src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.avatar}`} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-heading)]">{user.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      onClose();
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors text-left ${
                      action.danger ? 'bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)]' : 'bg-[var(--color-bg-secondary)]'
                    }`}
                  >
                    {action.icon && <action.icon className={`w-5 h-5 ${action.danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`} />}
                    <span className={`text-sm ${action.danger ? 'text-[var(--color-error)]' : 'text-[var(--color-text-body)]'}`}>{action.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 px-4 py-2 bg-[var(--color-surface)] text-[var(--color-text-body)] rounded-lg hover:bg-[var(--color-hover)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionModal;
