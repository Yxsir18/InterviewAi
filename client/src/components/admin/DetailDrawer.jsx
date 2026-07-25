import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

const DetailDrawer = ({
  isOpen,
  onClose,
  title,
  loading = false,
  children,
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
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-[var(--color-bg-card)] border-l border-[var(--color-border)] z-50 overflow-y-auto"
          >
            {loading ? (
              <div className="p-8 flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-[var(--color-primary-blue)] animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sticky Header */}
                <div className="sticky top-0 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] p-6 z-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[var(--color-text-heading)]">{title}</h2>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg hover:bg-[var(--color-hover)] transition-colors"
                    >
                      <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailDrawer;
