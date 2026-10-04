import React from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  gradient?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  align = 'center',
  gradient = true,
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={[styles.heading, styles[align], className]
        .filter(Boolean)
        .join(' ')}
    >
      {badge && <span className={styles.badge}>{badge}</span>}
      <Tag className={gradient ? styles.gradientTitle : styles.title}>
        {title}
      </Tag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
