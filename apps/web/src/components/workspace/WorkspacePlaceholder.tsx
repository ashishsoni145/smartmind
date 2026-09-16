'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from './WorkspacePlaceholder.module.css';

export interface ArchitectureFeature {
  title: string;
  description: string;
  icon?: string;
}

interface WorkspacePlaceholderProps {
  title: string;
  subtitle: string;
  icon: string;
  statusBadge?: string;
  phaseBadge?: string;
  notice?: string;
  features?: ArchitectureFeature[];
  primaryActionLabel?: string;
  primaryActionHref?: string;
  children?: React.ReactNode;
}

export function WorkspacePlaceholder({
  title,
  subtitle,
  icon,
  statusBadge = 'Schema Active & Bound',
  phaseBadge = 'Phase 02 Architecture',
  notice = 'This subsystem is linked with canonical Supabase persistence. Calibration & full engine workflow will unlock as diagnostic evidence is recorded.',
  features = [],
  primaryActionLabel = 'Back to AI Next Action',
  primaryActionHref = '/app',
  children,
}: WorkspacePlaceholderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.heroCard}>
        <div className={styles.heroBadgeRow}>
          <span className={styles.roadmapBadge}>{phaseBadge}</span>
          <span className={styles.statusPill}>{statusBadge}</span>
        </div>

        <div className={styles.headerMain}>
          <div className={styles.iconBox} aria-hidden="true">
            {icon}
          </div>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{subtitle}</p>
          </div>
        </div>

        <div className={styles.noticeBox}>
          <span>ℹ️</span>
          <span>{notice}</span>
        </div>

        {primaryActionHref && (
          <div style={{ marginTop: '0.5rem' }}>
            <Button href={primaryActionHref} variant="outline" size="md">
              {primaryActionLabel} &rarr;
            </Button>
          </div>
        )}
      </div>

      {children}

      {features.length > 0 && (
        <div className={styles.interactiveSection}>
          <h2 className={styles.sectionTitle}>Engine Capabilities & Persistence Model</h2>
          <div className={styles.grid}>
            {features.map((f, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureTitle}>
                  {f.icon && <span>{f.icon}</span>}
                  <span>{f.title}</span>
                </div>
                <p className={styles.featureBody}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
