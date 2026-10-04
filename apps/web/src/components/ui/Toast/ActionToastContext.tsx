'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ActionToastItem } from '@sharpmind/types';
import { ActionToast } from './ActionToast';
import styles from './ActionToast.module.css';
import { useAuth } from '@/lib/auth/auth-context';
import { apiClient } from '@/lib/api-client';

interface ActionToastContextValue {
  showActionToast: (toast: Omit<ActionToastItem, 'id'> & { id?: string }) => void;
  dismissActionToast: (id: string) => void;
  activeToasts: ActionToastItem[];
}

const ActionToastContext = createContext<ActionToastContextValue | undefined>(undefined);

export const ActionToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ActionToastItem[]>([]);
  const { user } = useAuth();

  const dismissActionToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showActionToast = useCallback(
    (toast: Omit<ActionToastItem, 'id'> & { id?: string }) => {
      const id = toast.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts(prev => {
        // Prevent exact duplicate id
        if (prev.some(t => t.id === id)) return prev;
        return [...prev, { ...toast, id }];
      });
    },
    []
  );

  // Sync with pending action-required notifications from backend when logged in
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const checkPendingActions = async () => {
      try {
        const pending = await apiClient.notifications.getPendingActionRequired();
        if (!isMounted || !pending || pending.length === 0) return;

        for (const notif of pending) {
          showActionToast({
            id: `action-notif-${notif.id}`,
            title: notif.title,
            message: notif.message,
            actionLabel: notif.actionLabel || 'View Now',
            actionUrl: notif.actionUrl || '/app/dashboard',
            severity: notif.type === 'backlog_risk' ? 'critical' : 'warning',
            onAction: async () => {
              try {
                await apiClient.notifications.markAsRead(notif.id);
              } catch {
                // Ignore failure
              }
            },
            onDismiss: async () => {
              try {
                await apiClient.notifications.markAsRead(notif.id);
              } catch {
                // Ignore failure
              }
            },
          });
        }
      } catch {
        // Suppress initial fetch errors gracefully in offline/mock mode
      }
    };

    // Initial check after 2 seconds
    const timeout = setTimeout(checkPendingActions, 2000);
    // Periodically recheck every 2 minutes
    const interval = setInterval(checkPendingActions, 120000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [user, showActionToast]);

  return (
    <ActionToastContext.Provider value={{ showActionToast, dismissActionToast, activeToasts: toasts }}>
      {children}
      {toasts.length > 0 && (
        <div className={styles.container} aria-live="polite">
          {toasts.slice(0, 3).map(toast => (
            <ActionToast key={toast.id} toast={toast} onDismiss={dismissActionToast} />
          ))}
        </div>
      )}
    </ActionToastContext.Provider>
  );
};

export const useActionToast = (): ActionToastContextValue => {
  const ctx = useContext(ActionToastContext);
  if (!ctx) {
    throw new Error('useActionToast must be used within an ActionToastProvider');
  }
  return ctx;
};
