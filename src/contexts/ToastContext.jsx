import { useState, useCallback, useMemo } from 'react';
import { ToastContext } from './ToastContextStore';

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`animate-fade-in px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[280px] ${
              t.type === 'success' ? 'bg-accent/20 text-accent border border-accent/30' :
              t.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              t.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-primary/20 text-primary border border-primary/30'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

