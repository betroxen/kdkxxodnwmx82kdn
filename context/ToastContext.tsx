import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { useSound } from '../hooks/useSound';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // PRODUCTION MANDATE: Audio assets must be bundled or served from a dedicated, trusted CDN.
  // We're replacing the external hoster URL with a secure local path.
  const notificationSoundAsset = '/assets/audio/system_notification.mp3';
  const playNotificationSound = useSound(notificationSoundAsset, 0.3);

  const showToast = useCallback((message: string, type: ToastMessage['type']) => {
    const id = Date.now() + Math.random();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    // We only play sound if the hook returned a player instance (preventing crashes if hook fails)
    if (playNotificationSound) {
        playNotificationSound();
    }
  }, [playNotificationSound]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

