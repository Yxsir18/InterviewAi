import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title, message) => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title, message) => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title, message) => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title, message) => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    dismissToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
