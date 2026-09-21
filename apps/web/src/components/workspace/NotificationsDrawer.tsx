'use client';

import React, { useState, useEffect } from 'react';
import styles from './NotificationsDrawer.module.css';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { apiClient } from '@/lib/api-client';
import { NotificationRecord } from '@sharpmind/types';
import { useRouter } from 'next/navigation';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.notifications.list({ limit: 20 });
      setNotifications(res.notifications || []);
    } catch {
      // Fallback
      setNotifications([
        {
          id: 'notif-1',
          studentId: 'student',
          type: 'action_required',
          title: 'Foundational Diagnostic Ready',
          message: 'Take your calibrated 45-minute assessment to unlock personalized recommendations.',
          actionUrl: '/app/diagnostic',
          actionRequired: true,
          actionLabel: 'Begin Diagnostic',
          isRead: false,
          scheduledFor: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'notif-2',
          studentId: 'student',
          type: 'revision_due',
          title: 'Spaced Repetition Queue',
          message: 'Active cards in Electrostatics and Mechanics are due for optimal memory consolidation.',
          actionUrl: '/app/revision',
          actionRequired: true,
          actionLabel: 'Review Queue',
          isRead: false,
          scheduledFor: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleItemAction = async (n: NotificationRecord) => {
    try {
      await apiClient.notifications.markAsRead(n.id);
    } catch {
      // Ignore
    }
    if (n.actionUrl) {
      router.push(n.actionUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} role="dialog" aria-label="Notifications Drawer">
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="bell" size="sm" />
            <span>Academic Notifications</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close notifications">
            <Icon name="close" size="sm" />
          </button>
        </div>

        <div className={styles.notificationsList}>
          {isLoading && notifications.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
              Loading alerts...
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
              All caught up! Zero unread notifications.
            </div>
          )}

          {notifications.map(n => (
            <div key={n.id} className={`${styles.notificationCard} ${!n.isRead ? styles.unread : ''}`}>
              <div className={styles.notifTop}>
                <span className={styles.notifBadge}>
                  {n.actionRequired ? 'Action Required' : n.type.replace('_', ' ')}
                </span>
                <span className={styles.notifTime}>
                  {new Date(n.scheduledFor || n.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.notifTitle}>{n.title}</div>
              <div className={styles.notifBody}>{n.message}</div>

              {n.actionRequired && n.actionLabel && (
                <div style={{ marginTop: '0.75rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleItemAction(n)}
                  >
                    <span>{n.actionLabel}</span>
                    <Icon name="arrowRight" size="xs" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.drawerFooter}>
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}
