'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ActionToastItem } from '@sharpmind/types';
import { ActionToast } from './ActionToast';

interface ActionToastContextType {
  toasts: ActionToastItem[];
  addToast: (toast: Omit<ActionToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ActionToastContext = createContext<ActionToastContextType | undefined>(undefined);

export const ActionToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ActionToastItem[]>([]);

  const addToast = useCallback((toastData: Omit<ActionToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ActionToastItem = {
      ...toastData,
      id,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ActionToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <div className="action-toast-container" style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        pointerEvents: 'none',
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ActionToast toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ActionToastContext.Provider>
  );
};

export const useActionToast = () => {
  const context = useContext(ActionToastContext);
  if (!context) {
    throw new Error('useActionToast must be used within an ActionToastProvider');
  }
  return context;
};
