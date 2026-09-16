'use client';

import React from 'react';
import Link from 'next/link';
import type { Subject, ChapterNode } from '@/lib/types/curriculum';
import { Icon, type IconName } from '@/components/ui/Icon';
import styles from './ChapterListView.module.css';

interface ChapterListViewProps {
  subject: Subject;
  chapters: ChapterNode[];
  onSelectChapter?: (chapterId: string) => void;
}

export const ChapterListView: React.FC<ChapterListViewProps> = ({
  subject,
  chapters,
  onSelectChapter,
}) => {
  const iconName = (subject.icon || subject.id) as IconName;

  if (chapters.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Icon name="layers" size="xl" style={{ color: 'var(--color-text-tertiary)', marginBottom: '0.75rem' }} />
        <h3>No Chapters Found</h3>
        <p>No chapters match your current search or grade filter.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.subjectTitleArea}>
          <div className={styles.subjectIcon} aria-hidden="true">
            <Icon name={iconName} size="md" />
          </div>
          <div>
            <h2 className={styles.subjectTitle}>{subject.name} Chapters</h2>
            <div className={styles.subjectMeta}>
              Authoritative NCERT and Competitive Entrance Syllabus • {chapters.length} Chapters Available
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chapterList}>
        {chapters.map((ch, idx) => {
          const gradeLabel = ch.gradeId === 'class_11' ? 'Class 11' : ch.gradeId === 'class_12' ? 'Class 12' : 'Dropper';
          const prereq = ch.prerequisites && ch.prerequisites[0];

          const handleClick = (e: React.MouseEvent) => {
            if (onSelectChapter) {
              e.preventDefault();
              onSelectChapter(ch.id);
            }
          };

          return (
            <Link
              key={ch.id}
              href={`/app/classroom?subject=${subject.id}&chapter=${ch.id}`}
              className={styles.chapterCard}
              onClick={handleClick}
            >
              <div className={styles.cardTopRow}>
                <div className={styles.badges}>
                  <span className={styles.seqBadge}>#{idx + 1}</span>
                  <span className={styles.codeBadge}>{ch.code}</span>
                  <span className={styles.gradeBadge}>{gradeLabel}</span>
                </div>
                <div className={styles.weightageBadge}>
                  <Icon name="award" size="xs" />
                  <span>{ch.weightagePercent}% Weightage</span>
                </div>
              </div>

              <h3 className={styles.chapterTitle}>{ch.title}</h3>
              {ch.description && <p className={styles.chapterDesc}>{ch.description}</p>}

              <div className={styles.metaBottom}>
                <div className={styles.statsGroup}>
                  <span className={styles.statItem}>
                    <Icon name="layers" size="xs" />
                    <span>{ch.topicsCount || 3} Topics</span>
                  </span>

                  {prereq && (
                    <span className={styles.prereqBadge} title={prereq.title}>
                      <Icon name={prereq.met ? 'check' : 'lock'} size="xs" />
                      <span>Prereq: {prereq.title.split('(')[0]}</span>
                    </span>
                  )}

                  <span className={styles.statItem} title="Continuous Bayesian mastery probability (Uncalibrated)">
                    <Icon name="target" size="xs" />
                    <span>Mastery: Uncalibrated (p=0.10)</span>
                  </span>
                </div>

                <div className={styles.actionArea}>
                  <span>Explore Topics</span>
                  <Icon name="chevronRight" size="xs" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
