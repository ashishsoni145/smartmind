import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  variant?: 'default' | 'feature' | 'elevated';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  hover = true,
  className = '',
  children,
}: CardProps) {
  return (
    <div
      className={[styles.card, styles[variant], hover ? styles.hover : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

interface CardIconProps {
  children: React.ReactNode;
  className?: string;
}

export function CardIcon({ children, className = '' }: CardIconProps) {
  return (
    <div className={`${styles.icon} ${className}`}>{children}</div>
  );
}

export function CardTitle({ children, className = '' }: CardIconProps) {
  return <h3 className={`${styles.title} ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: CardIconProps) {
  return <p className={`${styles.description} ${className}`}>{children}</p>;
}
