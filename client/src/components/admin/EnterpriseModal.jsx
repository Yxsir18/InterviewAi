import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const EnterpriseModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm sm:max-w-md',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-2xl',
    xl: 'max-w-xl sm:max-w-4xl',
    full: 'max-w-2xl sm:max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="enterprise-modal-backdrop"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className={`w-full ${sizeClasses[size]} bg-[#1E293B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
            >
              {/* Header */}
              {(title || showClose) && (
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
                  {title && (
                    <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
                  )}
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnterpriseModal;
