'use client';

import React from 'react';
import Link from 'next/link';
import type { Subject } from '@/lib/types/curriculum';
import { Icon, type IconName } from '@/components/ui/Icon';
import styles from './SubjectCardGrid.module.css';

interface SubjectCardGridProps {
  subjects: Subject[];
  chapterCounts: Record<string, number>;
  onSelectSubject?: (subjectId: string) => void;
}

export const SubjectCardGrid: React.FC<SubjectCardGridProps> = ({
  subjects,
  chapterCounts,
  onSelectSubject,
}) => {
  if (subjects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Icon name="classroom" size="xl" />
        </div>
        <h3>No Enrolled Subjects Found</h3>
        <p>Update your academic identity in onboarding to enroll in subjects.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {subjects.map((sub) => {
        const iconName = (sub.icon || sub.id) as IconName;
        const count = chapterCounts[sub.id] || 0;
        const categoryLabel = sub.category.replace('_', ' ');

        const handleClick = (e: React.MouseEvent) => {
          if (onSelectSubject) {
            e.preventDefault();
            onSelectSubject(sub.id);
          }
        };

        return (
          <Link
            key={sub.id}
            href={`/app/classroom?subject=${sub.id}`}
            className={styles.card}
            onClick={handleClick}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper} aria-hidden="true">
                <Icon name={iconName} size="md" />
              </div>
              <span className={styles.codeBadge}>{sub.code}</span>
            </div>

            <h3 className={styles.title}>{sub.name}</h3>
            <span className={styles.category}>{categoryLabel}</span>

            <div className={styles.metaRow}>
              <span className={styles.chapterCount}>
                <Icon name="layers" size="xs" />
                <span>{count} {count === 1 ? 'Chapter' : 'Chapters'}</span>
              </span>
              <span className={styles.maturityBadge} title="Truth in Data: Uncalibrated until observed diagnostic evidence">
                Calibration Pending
              </span>
            </div>

            <div className={styles.cardFooter}>
              <span>Explore Chapters</span>
              <span className={styles.arrow}>&rarr;</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
