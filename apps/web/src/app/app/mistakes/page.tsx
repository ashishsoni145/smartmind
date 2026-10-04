'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import styles from './mistakes.module.css';
import type { MistakeRecord } from '@sharpmind/types';
import { apiClient as api } from '@/lib/api-client';

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [metrics, setMetrics] = useState({
    totalMistakes: 0,
    resolvedCount: 0,
    unresolvedCount: 0,
    overdueCount: 0,
    rootCauseDistribution: {} as Record<string, number>,
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Retry Modal State
  const [activeRetryMistake, setActiveRetryMistake] = useState<MistakeRecord | null>(null);
  const [retryAnswer, setRetryAnswer] = useState<string>('');
  const [retryResult, setRetryResult] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  useEffect(() => {
    loadMistakes();
  }, []);

  async function loadMistakes() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.mistakes.list({ limit: 50 });
      if (res && res.mistakes) {
        setMistakes(res.mistakes);
        if (res.metrics) {
          setMetrics(res.metrics);
        } else {
          setMetrics({
            totalMistakes: res.mistakes.length,
            resolvedCount: res.mistakes.filter((m) => m.isResolved).length,
            unresolvedCount: res.mistakes.filter((m) => !m.isResolved).length,
            overdueCount: res.mistakes.filter(
              (m) => !m.isResolved && m.nextRetryAt && m.nextRetryAt <= new Date().toISOString()
            ).length,
            rootCauseDistribution: res.mistakes.reduce((acc: Record<string, number>, m) => {
              const cause = m.rootCause || 'unclassified';
              acc[cause] = (acc[cause] || 0) + 1;
              return acc;
            }, {}),
          });
        }
      } else {
        setMistakes([]);
      }
    } catch (err: any) {
      console.error('Failed to load mistakes from API:', err);
      setErrorMsg('Could not sync mistake notebook with server. Please check backend connectivity.');
      setMistakes([]);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenRetry(mistake: MistakeRecord) {
    setActiveRetryMistake(mistake);
    setRetryAnswer('');
    setRetryResult(null);
    setRetryError(null);
  }

  async function handleExecuteRetry() {
    if (!activeRetryMistake) return;
    setRetrying(true);
    setRetryError(null);

    try {
      const q = activeRetryMistake.question;
      const isNum = q?.questionType === 'numerical';
      const payload = isNum
        ? { numericalAnswer: retryAnswer }
        : { selectedOptions: [retryAnswer] };

      const res = await api.mistakes.retry(activeRetryMistake.id, payload);
      setRetryResult({
        isCorrect: res.isCorrect,
        explanation: res.explanation,
      });

      // Update in local state
      setMistakes((prev) =>
        prev.map((m) => (m.id === activeRetryMistake.id ? res.mistake : m))
      );

      // Refresh metrics
      if (res.isCorrect) {
        setMetrics((prev) => ({
          ...prev,
          resolvedCount: prev.resolvedCount + 1,
          unresolvedCount: Math.max(0, prev.unresolvedCount - 1),
        }));
      }
    } catch (err: any) {
      console.error('Failed to execute retry:', err);
      setRetryError(`Validation failed: ${err.message || 'Server error'}. Please try again.`);
    } finally {
      setRetrying(false);
    }
  }

  // Filtered view
  const filteredMistakes = useMemo(() => {
    const nowIso = new Date().toISOString();
    return mistakes.filter((m) => {
      if (selectedFilter === 'overdue') {
        return !m.isResolved && m.nextRetryAt && m.nextRetryAt <= nowIso;
      }
      if (selectedFilter === 'resolved') {
        return m.isResolved;
      }
      if (selectedFilter === 'conceptual') {
        return m.rootCause === 'conceptual' || m.rootCause === 'conceptual_misunderstanding';
      }
      if (selectedFilter === 'calculation') {
        return m.rootCause === 'calculation' || m.rootCause === 'calculation_error';
      }
      return true;
    });
  }, [mistakes, selectedFilter]);

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleWithIcon}>
            <div className={styles.pageIcon}>
              <Icon name="mistakes" size="md" />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Mistake Notebook & Spaced Error Remediation</h1>
              <p className={styles.pageSubtitle}>
                Every incorrect attempt is classified by psychological and conceptual failure modes. Spaced retries reinforce memory decay curves to ensure errors never recur in your final exam.
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
            <span><span className="banner-inline"><Icon name="info" size="sm" /> {errorMsg}</span></span>
            <button
              onClick={loadMistakes}
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
            <span className={styles.metricLabel}>LOGGED MISTAKES</span>
            <div className={styles.metricValue}>{metrics.totalMistakes}</div>
          </div>
          <div className={`${styles.metricCard} ${styles.metricAlert}`}>
            <span className={styles.metricLabel}>DUE FOR SPACED RETRY</span>
            <div className={styles.metricValue} style={{ color: '#f87171' }}>
              {metrics.overdueCount}
            </div>
          </div>
          <div className={`${styles.metricCard} ${styles.metricSuccess}`}>
            <span className={styles.metricLabel}>RESOLVED & MASTERED</span>
            <div className={styles.metricValue} style={{ color: '#34d399' }}>
              {metrics.resolvedCount}
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>PRIMARY FAILURE MODE</span>
            <div className={styles.metricValue} style={{ fontSize: '1.125rem', color: '#cbd5e1' }}>
              {Object.keys(metrics.rootCauseDistribution)[0]?.replace(/_/g, ' ').toUpperCase() || 'NONE LOGGED'}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filterBar}>
          {[
            { id: 'all', label: 'All Mistakes' },
            { id: 'overdue', label: 'Due for Review' },
            { id: 'conceptual', label: 'Conceptual Errors' },
            { id: 'calculation', label: 'Calculation Slips' },
            { id: 'resolved', label: 'Mastered & Resolved' },
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

        {/* Mistakes List */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Loading mistake records...
          </div>
        ) : filteredMistakes.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              No mistake records found in this view.
            </p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              When you answer questions incorrectly in practice drills or assessments, they are automatically cataloged here with spaced retry intervals.
            </p>
          </div>
        ) : (
          <div className={styles.listContainer}>
            {filteredMistakes.map((m) => {
              const isOverdue = !m.isResolved && m.nextRetryAt && m.nextRetryAt <= new Date().toISOString();
              const rootCauseLabel = (m.rootCause || 'Unclassified').replace(/_/g, ' ').toUpperCase();

              return (
                <div key={m.id} className={styles.mistakeCard}>
                  <div className={styles.mistakeCardHeader}>
                    <div className={styles.tagGroup}>
                      <span className={`${styles.badge} ${styles.badgeCause}`}>
                        {rootCauseLabel}
                      </span>
                      <span className={`${styles.badge} ${styles.badgeRepetition}`}>
                        Repetition {m.repetitionCount} • Interval: {m.spacedIntervalDays}d
                      </span>
                      {m.isResolved && (
                        <span className={`${styles.badge} ${styles.badgeResolved}`}>
                          Mastered
                        </span>
                      )}
                    </div>

                    {!m.isResolved && (
                      <span className={styles.dueText}>
                        {isOverdue ? 'Overdue for Spaced Retry' : 'Next review scheduled'}
                      </span>
                    )}
                  </div>

                  <div className={styles.questionText}>
                    {m.question?.questionText || 'Question statement logged from assessment.'}
                  </div>

                  {/* Comparison Grid */}
                  <div className={styles.comparisonGrid}>
                    <div className={`${styles.ansBox} ${styles.ansWrong}`}>
                      <span className={styles.ansLabel}>YOUR SUBMITTED ANSWER</span>
                      <span className={styles.ansContent}>
                        {typeof m.studentAnswer === 'object' ? JSON.stringify(m.studentAnswer) : String(m.studentAnswer || 'Unattempted / Empty')}
                      </span>
                    </div>
                    <div className={`${styles.ansBox} ${styles.ansCorrect}`}>
                      <span className={styles.ansLabel}>VERIFIED CORRECT KEY</span>
                      <span className={styles.ansContent}>
                        {typeof m.correctAnswer === 'object' ? JSON.stringify(m.correctAnswer) : String(m.correctAnswer || 'Verified Key')}
                      </span>
                    </div>
                  </div>

                  {m.question?.explanation && (
                    <div className={styles.explanationBox}>
                      <strong>Pedagogical Proof: </strong>
                      {m.question.explanation}
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    <span className={styles.metricLabel}>
                      Logged from: {m.assessmentId ? 'Diagnostic Assessment' : 'Practice Session'}
                    </span>

                    {!m.isResolved ? (
                      <button
                        className={styles.retryBtn}
                        onClick={() => handleOpenRetry(m)}
                      >
                        <Icon name="refresh" size="xs" />
                        Solve Again (Spaced Retry)
                      </button>
                    ) : (
                      <span className={styles.dueText} style={{ color: '#34d399' }}>
                        Concept Mastered
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Spaced Retry Modal */}
        {activeRetryMistake && (
          <div className={styles.modalOverlay}>
            <div className={styles.retryModal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className={styles.pageTitle} style={{ fontSize: '1.25rem' }}>
                  Spaced Repetition Retry
                </h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setActiveRetryMistake(null)}
                >
                  <Icon name="close" size="sm" />
                </button>
              </div>

              <div className={styles.questionText}>
                {activeRetryMistake.question?.questionText}
              </div>

              {retryError && (
                <div style={{
                  padding: '0.75rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '0.5rem',
                  color: '#f87171',
                  fontSize: '0.8125rem',
                }}>
                  <span className="banner-inline"><Icon name="info" size="sm" /> {retryError}</span>
                </div>
              )}

              {activeRetryMistake.question?.questionType === 'numerical' ? (
                <div>
                  <label className={styles.metricLabel}>YOUR REVISED NUMERICAL VALUE:</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Enter revised answer"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      background: '#111620',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      marginTop: '0.5rem',
                    }}
                    value={retryAnswer}
                    onChange={(e) => setRetryAnswer(e.target.value)}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeRetryMistake.question?.options?.map((opt) => (
                    <div
                      key={opt.optionKey}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: retryAnswer === opt.optionKey ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${retryAnswer === opt.optionKey ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer',
                        color: '#ffffff',
                        display: 'flex',
                        gap: '0.75rem',
                      }}
                      onClick={() => setRetryAnswer(opt.optionKey)}
                    >
                      <strong>{opt.optionKey}.</strong>
                      <span>{opt.optionText}</span>
                    </div>
                  ))}
                </div>
              )}

              {retryResult && (
                <div
                  className={`${styles.feedbackBanner} ${
                    retryResult.isCorrect ? styles.feedbackSuccess : styles.feedbackFail
                  }`}
                >
                  <Icon name={retryResult.isCorrect ? 'check' : 'close'} size="sm" />
                  <span>
                    {retryResult.isCorrect
                      ? 'Correct! Spaced retry passed. Mistake has been marked as resolved.'
                      : 'Incorrect attempt. Repetition interval has been extended for another spaced review.'}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveRetryMistake(null)}
                >
                  Close
                </button>
                <button
                  className={styles.retryBtn}
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={retrying || !retryAnswer}
                  onClick={handleExecuteRetry}
                >
                  {retrying ? 'Validating...' : 'Submit Revision Answer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
