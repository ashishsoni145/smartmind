'use client';

import React from 'react';
import Link from 'next/link';
import type { Subject, ChapterNode, TopicNode } from '@/lib/types/curriculum';
import { Icon } from '@/components/ui/Icon';
import styles from './TopicListView.module.css';

interface TopicListViewProps {
  subject: Subject;
  chapter: ChapterNode;
  topics: TopicNode[];
  onSelectTopic?: (topicId: string) => void;
}

export const TopicListView: React.FC<TopicListViewProps> = ({
  subject,
  chapter,
  topics,
  onSelectTopic,
}) => {
  return (
    <div className={styles.container}>
      {/* Chapter Context Card */}
      <div className={styles.chapterHero}>
        <div className={styles.heroTop}>
          <div className={styles.badges}>
            <span className={styles.codeBadge}>{chapter.code}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {subject.name}
            </span>
          </div>
          <div className={styles.weightageBadge}>
            <Icon name="award" size="xs" />
            <span>{chapter.weightagePercent}% Exam Weightage</span>
          </div>
        </div>

        <h2 className={styles.chapterTitle}>{chapter.title}</h2>
        {chapter.description && <p className={styles.chapterDesc}>{chapter.description}</p>}
      </div>

      {/* Topics Hierarchy */}
      <div className={styles.topicListSection}>
        <h3 className={styles.sectionTitle}>
          <Icon name="layers" size="sm" />
          <span>Curriculum Topics & Knowledge Units ({topics.length})</span>
        </h3>

        {topics.length === 0 ? (
          <div className={styles.emptyState}>
            <Icon name="fileText" size="xl" style={{ color: 'var(--color-text-tertiary)', marginBottom: '0.75rem' }} />
            <h4>No Topics Found</h4>
            <p>Topics for this chapter will activate once syllabus calibration completes.</p>
          </div>
        ) : (
          <div className={styles.topicList}>
            {topics.map((t, idx) => {
              const prereq = t.prerequisites && t.prerequisites[0];

              const handleClick = (e: React.MouseEvent) => {
                if (onSelectTopic) {
                  e.preventDefault();
                  onSelectTopic(t.id);
                }
              };

              return (
                <Link
                  key={t.id}
                  href={`/app/classroom?subject=${subject.id}&chapter=${chapter.id}&topic=${t.id}`}
                  className={styles.topicCard}
                  onClick={handleClick}
                >
                  <div className={styles.topicTopRow}>
                    <span className={styles.seqBadge}>Topic {idx + 1}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>
                      {t.code}
                    </span>
                  </div>

                  <h4 className={styles.topicTitle}>{t.title}</h4>
                  {t.description && <p className={styles.topicDesc}>{t.description}</p>}

                  <div className={styles.topicBottomRow}>
                    <div className={styles.metaTags}>
                      <span className={styles.metaTag}>
                        <Icon name="clock" size="xs" />
                        <span>{t.estimatedMinutes || 45} mins</span>
                      </span>

                      <span className={styles.metaTag}>
                        <Icon name="sparkles" size="xs" />
                        <span>{t.concepts?.length || 1} Concept Model</span>
                      </span>

                      {prereq && (
                        <span className={styles.metaTag} title={prereq.title}>
                          <Icon name={prereq.met ? 'check' : 'lock'} size="xs" />
                          <span>Prereq: {prereq.title}</span>
                        </span>
                      )}

                      <span className={styles.metaTag} title="Retention stability decay curve (Uncalibrated)">
                        <Icon name="target" size="xs" />
                        <span>Retention: 100% (Cold State)</span>
                      </span>
                    </div>

                    <div className={styles.actionArea}>
                      <span>Open Concepts & PYQs</span>
                      <Icon name="chevronRight" size="xs" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
