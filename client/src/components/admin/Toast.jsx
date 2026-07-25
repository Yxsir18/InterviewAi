import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ toast, onDismiss }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-[var(--color-success)]',
    error: 'bg-[var(--color-error)]',
    warning: 'bg-[var(--color-warning)]',
    info: 'bg-[var(--color-info)]',
  };

  const Icon = icons[toast.type] || Info;
  const bgColor = colors[toast.type] || 'bg-[var(--color-info)]';

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex items-start space-x-3 p-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg"
    >
      <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-heading)]">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-[var(--color-hover)] rounded transition-colors"
      >
        <X className="w-4 h-4 text-[var(--color-text-muted)]" />
      </button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onDismiss }) => {
  const toastList = toasts || [];

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toastList.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
