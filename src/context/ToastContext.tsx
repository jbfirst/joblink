import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-24 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-drawer border flex items-start gap-3 transition-all transform duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-white border-secondary/30 text-on-surface'
                : toast.type === 'error'
                ? 'bg-white border-error/30 text-on-surface'
                : 'bg-white border-primary/20 text-on-surface'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                toast.type === 'success'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : toast.type === 'error'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-primary-fixed text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {toast.type === 'success' ? 'check' : toast.type === 'error' ? 'priority_high' : 'info'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-primary">{toast.title}</h4>
              {toast.message && <p className="text-xs text-on-surface-variant mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
