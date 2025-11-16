import React, { useState, useEffect, useContext, useCallback, useRef, ReactNode } from 'react';

// --- START: CONTEXT AND TYPE DEFINITIONS ---

// 1. Toast Data Types
type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // Time in ms before auto-dismissal
}

interface ToastContextType {
  // Public API for triggering toasts
  addToast: (toast: Omit<ToastData, 'id'>) => void; 
  removeToast: (id: string) => void;
}

// 2. Mock Icons (using Lucide equivalents)
const Icons = {
    CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
    AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
    Info: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>),
    X: (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
};

// 3. Toast Context (The core state manager)
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// 4. Custom Hook for consumption
export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// --- END: CONTEXT AND TYPE DEFINITIONS ---


// --- Toast Sub-Component (The individual toast message) ---

const Toast: React.FC<{ toast: ToastData; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const { id, type, title, message, duration = 4000 } = toast;
  const timeoutRef = useRef<number | null>(null);

  // Set up auto-dismissal
  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, duration, onDismiss]);

  // Determine styling based on type
  const styleMap = {
    success: { 
        bg: 'bg-green-900/90', 
        border: 'border-green-500', 
        icon: Icons.CheckCircle, 
        iconColor: 'text-green-400' 
    },
    error: { 
        bg: 'bg-red-900/90', 
        border: 'border-red-500', 
        icon: Icons.AlertTriangle, 
        iconColor: 'text-red-400' 
    },
    warning: { 
        bg: 'bg-yellow-900/90', 
        border: 'border-yellow-500', 
        icon: Icons.AlertTriangle, 
        iconColor: 'text-yellow-400' 
    },
    info: { 
        bg: 'bg-indigo-900/90', 
        border: 'border-neon-surge', 
        icon: Icons.Info, 
        iconColor: 'text-neon-surge' 
    },
  };

  const { bg, border, icon: Icon, iconColor } = styleMap[type] || styleMap.info;

  return (
    <div
      className={`relative flex items-center p-4 rounded-lg backdrop-blur-sm shadow-xl transition-all transform duration-300 ease-out animate-[slideIn_0.3s_ease-out] border ${bg} ${border} max-w-sm w-full`}
      role="alert"
    >
        {/* Neon Effect Border on top */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-transparent via-neon-surge/80 to-transparent ${type === 'info' ? 'animate-pulse-glow' : ''}`}></div>

      {/* Icon */}
      <div className={`flex-shrink-0 mr-3 ${iconColor}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold font-orbitron uppercase text-white">{title}</p>
        <p className="text-xs text-text-secondary mt-1 font-jetbrains-mono">{message}</p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(id)}
        className="ml-4 flex-shrink-0 text-text-secondary hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <Icons.X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};


// --- Toast Provider (Manages the list of toasts) ---

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const newToast: ToastData = {
      ...toast,
      id: crypto.randomUUID(), // Production-ready unique ID
    };
    // Add new toasts to the top of the list
    setToasts(currentToasts => [newToast, ...currentToasts]);
  }, []);

  // NOTE: Removed all mock/test toasts for production readiness.

  const contextValue: ToastContextType = { toasts: [], addToast, removeToast }; 

  return (
    <ToastContext.Provider value={contextValue as any}> 
      {children}
      
      {/* The Toaster Display is rendered here so it has access to the toasts state */}
      <ToasterDisplay toasts={toasts} removeToast={removeToast} />

      {/* Custom CSS (Always include styles in the same file) */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Custom Keyframe for smooth entry */
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        /* Custom keyframe for neon effect */
        @keyframes pulse-glow {
            0%, 100% {
                opacity: 0.5;
                box-shadow: 0 0 5px #00FFC0, 0 0 10px #00FFC0;
            }
            50% {
                opacity: 1;
                box-shadow: 0 0 10px #00FFC0, 0 0 20px #00FFC0;
            }
        }
      `}} />

    </ToastContext.Provider>
  );
};


// --- Toaster Display Component (The fixed container) ---

interface ToasterDisplayProps {
    toasts: ToastData[];
    removeToast: (id: string) => void;
}

// Renamed to ToasterDisplay to avoid confusion with the provider's overall role
const ToasterDisplay: React.FC<ToasterDisplayProps> = ({ toasts, removeToast }) => {
  return (
    <div
      className="fixed top-0 right-0 z-[200] flex flex-col items-end justify-start p-4 sm:p-6 pointer-events-none"
      aria-live="polite"
    >
      <div className="w-full max-w-sm space-y-4">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
             <Toast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the Provider as the default for easy wrapping in App.tsx
export default ToastProvider; 

