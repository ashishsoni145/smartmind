'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/lib/auth/auth-context';
import { apiClient } from '@/lib/api-client';
import styles from './revision.module.css';

interface RevisionCardItem {
  id: string;
  topicTitle: string;
  subjectId: string;
  currentRetention: number;
  urgencyScore: number;
  urgency: 'high' | 'medium' | 'normal';
  intervalDays: number;
  repetitionLevel: number;
  dueDate: string;
  recommendedType: string;
}

export default function RevisionPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<RevisionCardItem[]>([]);
  const [stats, setStats] = useState({
    totalDue: 0,
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});

  const loadRevisions = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiClient.revision.getDue(user.id, { limit: 100 });
      if (res && res.items) {
        const mapped: RevisionCardItem[] = res.items.map((item: any) => {
          const urgencyScore = Number(item.urgencyScore) || 50;
          const urgency: 'high' | 'medium' | 'normal' =
            urgencyScore > 75 ? 'high' : urgencyScore > 40 ? 'medium' : 'normal';

          return {
            id: item.id,
            topicTitle: item.topicTitle || 'Curriculum Concept Recall',
            subjectId: item.subjectId || 'general',
            currentRetention: item.currentRetention !== undefined ? item.currentRetention : 0.6,
            urgencyScore,
            urgency,
            intervalDays: item.intervalDays || 1,
            repetitionLevel: item.repetitionLevel || 0,
            dueDate: item.dueDate || new Date().toISOString().split('T')[0],
            recommendedType: item.recommendedType || 'recall_card',
          };
        });

        setItems(mapped);
        setStats({
          totalDue: res.totalDue || mapped.length,
          overdue: res.overdue || 0,
          dueToday: res.dueToday || 0,
          dueThisWeek: res.dueThisWeek || 0,
        });
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error('Failed to load revision items:', err);
      setErrorMsg('Could not sync with Spaced Repetition engine. Please check backend connectivity.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadRevisions();
  }, [loadRevisions]);

  const handleReviewOutcome = async (
    eventId: string,
    outcome: 'recalled' | 'hard' | 'forgot'
  ) => {
    if (!user?.id) return;
    setProcessingIds((prev) => ({ ...prev, [eventId]: true }));

    // Optimistically remove card
    setItems((prev) => prev.filter((item) => item.id !== eventId));
    setStats((prev) => ({
      ...prev,
      totalDue: Math.max(0, prev.totalDue - 1),
    }));

    try {
      await apiClient.revision.completeEvent(user.id, eventId, {
        outcome,
        timeSpentSeconds: outcome === 'recalled' ? 40 : outcome === 'hard' ? 65 : 90,
      });
    } catch (err) {
      console.error('Failed to submit revision outcome to server:', err);
      // Reload on failure to restore accurate state
      loadRevisions();
    } finally {
      setProcessingIds((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    }
  };

  const filteredItems = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return items.filter((item) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'overdue') return item.dueDate < today;
      if (selectedFilter === 'physics') return item.subjectId === 'physics';
      if (selectedFilter === 'chemistry') return item.subjectId === 'chemistry';
      if (selectedFilter === 'mathematics') return item.subjectId === 'mathematics';
      return true;
    });
  }, [items, selectedFilter]);

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleWithIcon}>
            <div className={styles.pageIcon}>
              <Icon name="refresh" size="md" />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Spaced Repetition & Retention Engine</h1>
              <p className={styles.pageSubtitle}>
                Mathematical modeling of the Ebbinghaus forgetting curve so you never forget what you&apos;ve learned. Review concepts right before retention decays below threshold.
              </p>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div style={{
            padding: '1rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>⚠️ {errorMsg}</span>
            <button
              onClick={loadRevisions}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Metrics Banner */}
        <div className={styles.metricsBanner}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>TOTAL DUE TODAY</span>
            <div className={styles.metricValue}>{stats.totalDue}</div>
          </div>
          <div className={`${styles.metricCard} ${stats.overdue > 0 ? styles.metricAlert : ''}`}>
            <span className={styles.metricLabel}>OVERDUE RETENTION DRILLS</span>
            <div className={styles.metricValue} style={{ color: stats.overdue > 0 ? '#f87171' : '#ffffff' }}>
              {stats.overdue}
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>SCHEDULED THIS WEEK</span>
            <div className={styles.metricValue} style={{ color: '#38bdf8' }}>
              {stats.dueThisWeek}
            </div>
          </div>
          <div className={`${styles.metricCard} ${styles.metricSuccess}`}>
            <span className={styles.metricLabel}>ALGORITHM</span>
            <div className={styles.metricValue} style={{ fontSize: '1.125rem', color: '#34d399' }}>
              SM-2 Active
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          {[
            { id: 'all', label: `All Due (${items.length})` },
            { id: 'overdue', label: `Overdue (${stats.overdue})` },
            { id: 'physics', label: 'Physics' },
            { id: 'chemistry', label: 'Chemistry' },
            { id: 'mathematics', label: 'Mathematics' },
          ].map((f) => (
            <button
              key={f.id}
              className={`${styles.filterPill} ${selectedFilter === f.id ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Revision Queue */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Calculating active memory stability & recall queue...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}>
            <span style={{ fontSize: '2.5rem' }}>🎉</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.75rem' }}>
              All Caught Up on Spaced Revisions!
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem auto', lineHeight: 1.6 }}>
              Your memory decay curves are in optimal shape. Concepts will automatically appear here when their projected recall approaches the 85% retention threshold.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link
                href="/app/tests"
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6366f1',
                  color: '#fff',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                Take Diagnostic Drill &rarr;
              </Link>
              <Link
                href="/app/focus"
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  textDecoration: 'none',
                }}
              >
                Open Deep Focus Block &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredItems.map((item) => {
              const retentionPct = Math.round(item.currentRetention * 100);
              const barColor =
                retentionPct >= 70 ? '#34d399' : retentionPct >= 45 ? '#fbbf24' : '#f87171';
              const urgencyClass =
                item.urgency === 'high'
                  ? styles.urgencyHigh
                  : item.urgency === 'medium'
                  ? styles.urgencyMedium
                  : styles.urgencyNormal;
              const isProcessing = Boolean(processingIds[item.id]);

              return (
                <div key={item.id} className={styles.revisionCard}>
                  <div>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.subjectBadge}>{item.subjectId}</span>
                      <span className={`${styles.urgencyBadge} ${urgencyClass}`}>
                        {item.urgency} URGENCY
                      </span>
                    </div>

                    <h3 className={styles.topicTitle}>{item.topicTitle}</h3>

                    <div className={styles.retentionRow}>
                      <span>Estimated Retention: {retentionPct}%</span>
                      <span>Target: 85%</span>
                    </div>

                    <div className={styles.retentionBarTrack}>
                      <div
                        className={styles.retentionBarFill}
                        style={{ width: `${retentionPct}%`, backgroundColor: barColor }}
                      />
                    </div>

                    <div className={styles.sm2MetaRow}>
                      <span>Interval: {item.intervalDays}d</span>
                      <span>•</span>
                      <span>Repetition: #{item.repetitionLevel}</span>
                      <span>•</span>
                      <span>Type: {item.recommendedType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <div className={styles.reviewBtnRow}>
                    <button
                      type="button"
                      className={`${styles.recallBtn} ${styles.recallSuccess}`}
                      disabled={isProcessing}
                      onClick={() => handleReviewOutcome(item.id, 'recalled')}
                      title="Interval will multiply by 2.5x"
                    >
                      <span>✓ Recalled</span>
                      <span className={styles.btnSubtext}>+{Math.max(2, Math.round(item.intervalDays * 2.5))}d</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.recallBtn} ${styles.recallHard}`}
                      disabled={isProcessing}
                      onClick={() => handleReviewOutcome(item.id, 'hard')}
                      title="Interval maintained with lower ease"
                    >
                      <span>~ Hard</span>
                      <span className={styles.btnSubtext}>+{Math.max(1, Math.round(item.intervalDays * 1.2))}d</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.recallBtn} ${styles.recallForgot}`}
                      disabled={isProcessing}
                      onClick={() => handleReviewOutcome(item.id, 'forgot')}
                      title="Reset interval to 1 day"
                    >
                      <span>✕ Forgot</span>
                      <span className={styles.btnSubtext}>Reset 1d</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
