import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'coming';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], styles[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
