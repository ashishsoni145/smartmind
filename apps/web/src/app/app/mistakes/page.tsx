'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import styles from './mistakes.module.css';
import type { MistakeRecord, MistakeRootCause } from '@sharpmind/types';
import SharpMindApiClient from '@sharpmind/api-client';

const api = new SharpMindApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('supabase_access_token');
    }
    return null;
  },
});

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

  // Retry Modal State
  const [activeRetryMistake, setActiveRetryMistake] = useState<MistakeRecord | null>(null);
  const [retryAnswer, setRetryAnswer] = useState<string>('');
  const [retryResult, setRetryResult] = useState<{ isCorrect: boolean; explanation?: string } | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    loadMistakes();
  }, []);

  async function loadMistakes() {
    try {
      setLoading(true);
      const res = await api.mistakes.list({ limit: 50 });
      if (res.mistakes && res.mistakes.length > 0) {
        setMistakes(res.mistakes);
        setMetrics(res.metrics);
      } else {
        setMistakes(DEFAULT_MISTAKES);
        setMetrics({
          totalMistakes: 3,
          resolvedCount: 1,
          unresolvedCount: 2,
          overdueCount: 1,
          rootCauseDistribution: {
            conceptual: 1,
            calculation: 1,
            guessing: 1,
          },
        });
      }
    } catch {
      setMistakes(DEFAULT_MISTAKES);
      setMetrics({
        totalMistakes: 3,
        resolvedCount: 1,
        unresolvedCount: 2,
        overdueCount: 1,
        rootCauseDistribution: {
          conceptual: 1,
          calculation: 1,
          guessing: 1,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenRetry(mistake: MistakeRecord) {
    setActiveRetryMistake(mistake);
    setRetryAnswer('');
    setRetryResult(null);
  }

  async function handleExecuteRetry() {
    if (!activeRetryMistake) return;
    setRetrying(true);

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
    } catch {
      // Fallback local simulation
      const correctTarget = activeRetryMistake.question?.options?.find((o) => o.isCorrect)?.optionKey || activeRetryMistake.correctAnswer;
      const isCorrect = String(retryAnswer).trim().toUpperCase() === String(correctTarget).trim().toUpperCase();

      setRetryResult({
        isCorrect,
        explanation: activeRetryMistake.question?.explanation || 'Reviewed in Spaced Repetition queue.',
      });

      if (isCorrect) {
        setMistakes((prev) =>
          prev.map((m) =>
            m.id === activeRetryMistake.id
              ? { ...m, isResolved: true, resolvedAt: new Date().toISOString() }
              : m
          )
        );
      }
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
              {Object.keys(metrics.rootCauseDistribution)[0]?.replace('_', ' ').toUpperCase() || 'CONCEPTUAL'}
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
        <div className={styles.listContainer}>
          {filteredMistakes.map((m) => {
            const isOverdue = !m.isResolved && m.nextRetryAt && m.nextRetryAt <= new Date().toISOString();
            const rootCauseLabel = m.rootCause.replace('_', ' ').toUpperCase();

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
                      {JSON.stringify(m.studentAnswer) || 'Unattempted / Empty'}
                    </span>
                  </div>
                  <div className={`${styles.ansBox} ${styles.ansCorrect}`}>
                    <span className={styles.ansLabel}>VERIFIED CORRECT KEY</span>
                    <span className={styles.ansContent}>
                      {JSON.stringify(m.correctAnswer)}
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
                        border: `1px solid ${retryAnswer === opt.optionKey ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
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

const DEFAULT_MISTAKES: MistakeRecord[] = [
  {
    id: 'mistake-rotational-1',
    studentId: 'me',
    questionId: 'q-rot-1',
    assessmentId: 'assess-jee-kinematics',
    rootCause: 'calculation',
    studentAnswer: ['B'],
    correctAnswer: ['A'],
    repetitionCount: 1,
    spacedIntervalDays: 1,
    nextRetryAt: new Date(Date.now() - 3600000).toISOString(), // Overdue
    isResolved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    question: {
      id: 'q-rot-1',
      subjectId: 'physics',
      curriculumNodeId: 'node-rotational',
      conceptId: 'concept-moment-inertia',
      questionType: 'single_choice',
      pedagogicalType: 'conceptual',
      difficultyLevel: 'medium',
      questionText: 'A solid sphere and hollow sphere of same mass and radius roll down an incline without slipping. Which reaches the bottom first?',
      marks: 4,
      isPyq: true,
      isImportant: true,
      appearanceFrequency: 4,
      patternTags: ['Rotational Motion', 'Rolling Dynamics'],
      isVerified: true,
      isGenerated: false,
      explanation: 'The solid sphere has a smaller moment of inertia (2/5 MR^2 vs 2/3 MR^2), thus greater linear acceleration a = g sin(theta) / (1 + I/MR^2).',
      options: [
        { optionKey: 'A', optionText: 'Solid sphere reaches first', isCorrect: true },
        { optionKey: 'B', optionText: 'Hollow sphere reaches first', isCorrect: false },
        { optionKey: 'C', optionText: 'Both reach simultaneously', isCorrect: false },
        { optionKey: 'D', optionText: 'Depends on the angle of inclination', isCorrect: false },
      ],
    },
  },
  {
    id: 'mistake-electro-2',
    studentId: 'me',
    questionId: 'q-elec-2',
    assessmentId: 'assess-full-mock-01',
    rootCause: 'conceptual',
    studentAnswer: '4.5',
    correctAnswer: '9.0',
    repetitionCount: 2,
    spacedIntervalDays: 3,
    nextRetryAt: new Date(Date.now() + 86400000).toISOString(),
    isResolved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    question: {
      id: 'q-elec-2',
      subjectId: 'physics',
      curriculumNodeId: 'node-electrostatics',
      conceptId: 'concept-gauss-law',
      questionType: 'numerical',
      pedagogicalType: 'application',
      difficultyLevel: 'hard',
      questionText: 'Calculate the total electric flux in N m^2/C through a Gaussian cube enclosing a net charge of 79.65 pC (epsilon_0 = 8.85 x 10^-12 C^2/N m^2).',
      marks: 4,
      isPyq: true,
      isImportant: true,
      appearanceFrequency: 3,
      patternTags: ['Gauss Law', 'Electric Flux'],
      isVerified: true,
      isGenerated: false,
      explanation: 'Flux Phi = q_enclosed / epsilon_0 = (79.65 * 10^-12) / (8.85 * 10^-12) = 9.0 N m^2/C.',
    },
  },
  {
    id: 'mistake-thermo-3',
    studentId: 'me',
    questionId: 'q-thermo-3',
    rootCause: 'guessing',
    studentAnswer: ['C'],
    correctAnswer: ['B'],
    repetitionCount: 3,
    spacedIntervalDays: 7,
    nextRetryAt: new Date().toISOString(),
    isResolved: true,
    resolvedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    question: {
      id: 'q-thermo-3',
      subjectId: 'physics',
      curriculumNodeId: 'node-thermo',
      conceptId: 'concept-carnot',
      questionType: 'single_choice',
      pedagogicalType: 'conceptual',
      difficultyLevel: 'medium',
      questionText: 'In an isothermal expansion of an ideal gas, the change in internal energy Delta U is:',
      marks: 4,
      isPyq: true,
      isImportant: false,
      appearanceFrequency: 2,
      patternTags: ['Thermodynamics', 'Isothermal Process'],
      isVerified: true,
      isGenerated: false,
      explanation: 'For an ideal gas, internal energy depends only on temperature. Since temperature is constant in an isothermal process, Delta U = 0.',
      options: [
        { optionKey: 'A', optionText: 'Positive', isCorrect: false },
        { optionKey: 'B', optionText: 'Zero', isCorrect: true },
        { optionKey: 'C', optionText: 'Negative', isCorrect: false },
        { optionKey: 'D', optionText: 'Equal to work done', isCorrect: false },
      ],
    },
  },
];
