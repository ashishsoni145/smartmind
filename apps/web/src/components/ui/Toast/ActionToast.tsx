'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ActionToastItem } from '@sharpmind/types';
import { Icon } from '../Icon';
import styles from './ActionToast.module.css';

interface ActionToastProps {
  toast: ActionToastItem;
  onDismiss: (id: string) => void;
}

export const ActionToast: React.FC<ActionToastProps> = ({ toast, onDismiss }) => {
  const router = useRouter();

  const handleAction = () => {
    if (toast.onAction) {
      toast.onAction();
    } else if (toast.actionUrl) {
      router.push(toast.actionUrl);
    }
    onDismiss(toast.id);
  };

  const severityClass =
    toast.severity === 'critical'
      ? styles.critical
      : toast.severity === 'warning'
      ? styles.warning
      : '';

  return (
    <div className={`${styles.toast} ${severityClass}`} role="alert">
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.actionBadge}>
            <span className={styles.pulseDot} />
            Action Required
          </span>
        </div>
        <button
          className={styles.closeButton}
          onClick={() => {
            if (toast.onDismiss) toast.onDismiss();
            onDismiss(toast.id);
          }}
          aria-label="Dismiss action toast"
        >
          <Icon name="close" size="xs" />
        </button>
      </div>

      <div className={styles.body}>
        <h4 className={styles.title}>{toast.title}</h4>
        <p className={styles.message}>{toast.message}</p>
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.dismissBtn}
          onClick={() => {
            if (toast.onDismiss) toast.onDismiss();
            onDismiss(toast.id);
          }}
        >
          Dismiss
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={handleAction}
        >
          <span>{toast.actionLabel}</span>
          <Icon name="arrowRight" size="xs" />
        </button>
      </div>
    </div>
  );
};
