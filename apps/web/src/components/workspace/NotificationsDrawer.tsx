'use client';

import React, { useState } from 'react';
import styles from './NotificationsDrawer.module.css';
import { Button } from '@/components/ui/Button';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  tag: string;
  time: string;
  isUnread: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Baseline Diagnostic Ready',
    body: 'Your 45-minute foundational diagnostic assessment is calibrated for your target exams. Take it to unlock your Knowledge Model.',
    tag: 'Academic OS',
    time: '10m ago',
    isUnread: true,
  },
  {
    id: 'notif-2',
    title: 'Persistence Synchronized',
    body: 'Your workspace is connected to Supabase PostgreSQL with encrypted row-level security enabled.',
    tag: 'System',
    time: '1h ago',
    isUnread: false,
  },
  {
    id: 'notif-3',
    title: 'Daily Focus Routine Reminder',
    body: 'Preferred study window scheduled for evening. Recommended focus duration: 3.0 hours.',
    tag: 'Habit',
    time: '3h ago',
    isUnread: false,
  },
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ isOpen, onClose }: NotificationsDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  return (
    <>
      <div className={styles.drawerBackdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} role="dialog" aria-label="Notifications Drawer">
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <span>🔔</span> Notifications
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close notifications">
            ✕
          </button>
        </div>

        <div className={styles.notificationsList}>
          {notifications.map((n) => (
            <div key={n.id} className={`${styles.notificationCard} ${n.isUnread ? styles.unread : ''}`}>
              <div className={styles.notifTop}>
                <span className={styles.notifBadge}>{n.tag}</span>
                <span className={styles.notifTime}>{n.time}</span>
              </div>
              <div className={styles.notifTitle}>{n.title}</div>
              <div className={styles.notifBody}>{n.body}</div>
            </div>
          ))}
        </div>

        <div className={styles.drawerFooter}>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
