'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import styles from './tests.module.css';
import type {
  Assessment,
  ActiveTestSession,
  AssessmentSubmission,
  PostTestIntelligence,
} from '@sharpmind/types';
import { apiClient as api } from '@/lib/api-client';

export default function TestsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Runner State
  const [activeSession, setActiveSession] = useState<ActiveTestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<string, { selectedOptions?: string[]; numericalAnswer?: string; status: string }>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [runnerError, setRunnerError] = useState<string | null>(null);

  // Scorecard modal
  const [completedSubmission, setCompletedSubmission] = useState<AssessmentSubmission | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  async function loadAssessments() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.assessments.list({ limit: 50 });
      if (res && res.assessments) {
        setAssessments(res.assessments);
      } else {
        setAssessments([]);
      }
    } catch (err: any) {
      console.error('Failed to load assessments from API:', err);
      setErrorMsg('Could not sync with assessment engine. Please check backend connectivity.');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }

  // Timer countdown loop
  useEffect(() => {
    if (!activeSession) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession]);

  async function handleStartTest(test: Assessment) {
    try {
      setLoading(true);
      setRunnerError(null);
      const session = await api.assessments.start(test.id);
      setActiveSession(session);
      setRemainingSeconds(session.timeRemainingSeconds);
      setCurrentQuestionIndex(0);

      // Preload answers if any
      const initMap: Record<string, any> = {};
      if (session.answersSoFar) {
        Object.entries(session.answersSoFar).forEach(([qId, ans]) => {
          initMap[qId] = {
            selectedOptions: ans.selectedOptions,
            numericalAnswer: ans.numericalAnswer,
            status: ans.status,
          };
        });
      }
      setAnswersMap(initMap);
    } catch (err: any) {
      console.error('Failed to start test session:', err);
      setRunnerError(`Unable to start test session: ${err.message || 'Server error'}.`);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectOption(optKey: string) {
    if (!activeSession) return;
    const q = activeSession.questions[currentQuestionIndex];
    setAnswersMap((prev) => ({
      ...prev,
      [q.id]: {
        selectedOptions: [optKey],
        status: 'answered',
      },
    }));

    // Autosave in background
    api.assessments.autosave(activeSession.submissionId, {
      questionId: q.id,
      selectedOptions: [optKey],
      timeSpentSeconds: 15,
      status: 'answered',
    }).catch(() => {});
  }

  function handleNumericalChange(val: string) {
    if (!activeSession) return;
    const q = activeSession.questions[currentQuestionIndex];
    setAnswersMap((prev) => ({
      ...prev,
      [q.id]: {
        numericalAnswer: val,
        status: val.trim() ? 'answered' : 'unanswered',
      },
    }));

    if (val.trim()) {
      api.assessments.autosave(activeSession.submissionId, {
        questionId: q.id,
        numericalAnswer: val,
        timeSpentSeconds: 20,
        status: 'answered',
      }).catch(() => {});
    }
  }

  function handleClearResponse() {
    if (!activeSession) return;
    const q = activeSession.questions[currentQuestionIndex];
    setAnswersMap((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });
  }

  function handleMarkForReview() {
    if (!activeSession) return;
    const q = activeSession.questions[currentQuestionIndex];
    const existing = answersMap[q.id];
    setAnswersMap((prev) => ({
      ...prev,
      [q.id]: {
        ...existing,
        status: 'marked_for_review',
      },
    }));
    handleNextQuestion();
  }

  function handleNextQuestion() {
    if (!activeSession) return;
    if (currentQuestionIndex < activeSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  function handlePrevQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  async function handleAutoSubmit() {
    await handleSubmitTest();
  }

  async function handleSubmitTest() {
    if (!activeSession) return;
    setSubmitting(true);
    setRunnerError(null);
    setShowSubmitModal(false);

    try {
      const answersList = Object.entries(answersMap).map(([qId, val]) => ({
        questionId: qId,
        selectedOptions: val.selectedOptions,
        numericalAnswer: val.numericalAnswer,
        timeSpentSeconds: 45,
        status: val.status,
      }));

      const totalTime = activeSession.assessment.durationMinutes * 60 - remainingSeconds;
      const submission = await api.assessments.submit(activeSession.submissionId, {
        answers: answersList,
        timeTakenSeconds: Math.max(1, totalTime),
      });

      setActiveSession(null);
      setCompletedSubmission(submission);
    } catch (err: any) {
      console.error('Failed to submit test:', err);
      setRunnerError(`Submission failed: ${err.message || 'Server error'}. Your session is still active; please click Submit Test again.`);
    } finally {
      setSubmitting(false);
    }
  }

  // Filtered assessment list
  const filteredAssessments = useMemo(() => {
    if (selectedFilter === 'all') return assessments;
    return assessments.filter((a) => a.type === selectedFilter);
  }, [assessments, selectedFilter]);

  const currentQ = activeSession?.questions[currentQuestionIndex];
  const currentAnswer = currentQ ? answersMap[currentQ.id] : null;

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.titleWithIcon}>
              <div className={styles.pageIcon}>
                <Icon name="tests" size="md" />
              </div>
              <div>
                <h1 className={styles.pageTitle}>Assessments & Mock Exam Center</h1>
                <p className={styles.pageSubtitle}>
                  NTA-pattern chapter tests, full-syllabus mocks, and diagnostic assessments with zero client-side answer leakage and instant post-test diagnostics.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filterBar}>
            {[
              { id: 'all', label: 'All Tests' },
              { id: 'chapter_test', label: 'Chapter Tests' },
              { id: 'mock_exam', label: 'Full Mock Exams' },
              { id: 'pyq_test', label: 'PYQ Question Papers' },
              { id: 'diagnostic', label: 'Diagnostics' },
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
              onClick={loadAssessments}
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

        {runnerError && (
          <div style={{
            padding: '1rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.875rem',
          }}>
            <span className="banner-inline"><Icon name="info" size="sm" /> {runnerError}</span>
          </div>
        )}

        {/* Assessment Cards Grid */}
        {loading && !activeSession ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Loading available assessments...
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              No assessments found for this category.
            </p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Switch filter to &quot;All Tests&quot; or take the Baseline Diagnostic Assessment.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredAssessments.map((test) => {
              const badgeClass =
                test.type === 'mock_exam'
                  ? styles.badgeMock
                  : test.type === 'pyq_test'
                  ? styles.badgePyq
                  : test.type === 'diagnostic'
                  ? styles.badgeDiagnostic
                  : styles.badgeChapter;

              return (
                <div key={test.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={`${styles.badge} ${badgeClass}`}>
                      {test.type.replace('_', ' ')}
                    </span>
                    <span className={styles.specLabel}>
                      +4 / -1 Marking
                    </span>
                  </div>

                  <div>
                    <h3 className={styles.cardTitle}>{test.title}</h3>
                    {test.description && <p className={styles.cardDesc}>{test.description}</p>}
                  </div>

                  <div className={styles.specsBar}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>DURATION</span>
                      <span className={styles.specValue}>{test.durationMinutes} Mins</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>TOTAL MARKS</span>
                      <span className={styles.specValue}>{test.totalMarks} Marks</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>FORMAT</span>
                      <span className={styles.specValue}>{test.isAdaptive ? 'Adaptive' : 'Standard'}</span>
                    </div>
                  </div>

                  <button
                    className={styles.startBtn}
                    onClick={() => handleStartTest(test)}
                    disabled={loading}
                  >
                    <Icon name="play" size="sm" />
                    Start Test
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Test Runner Environment Modal */}
        {activeSession && currentQ && (
          <div className={styles.runnerOverlay}>
            {/* Runner Top Bar */}
            <div className={styles.runnerTopBar}>
              <div className={styles.runnerTitleInfo}>
                <span className={styles.runnerTitle}>{activeSession.assessment.title}</span>
                <span className={styles.badgeChapter}>
                  Question {currentQuestionIndex + 1} of {activeSession.questions.length}
                </span>
              </div>

              <div className={styles.runnerTitleInfo}>
                <div className={`${styles.timerBox} ${remainingSeconds < 300 ? '' : styles.timerNormal}`}>
                  <Icon name="clock" size="sm" />
                  <span>{formatTime(remainingSeconds)}</span>
                </div>

                <button
                  className={styles.submitTestBtn}
                  onClick={() => setShowSubmitModal(true)}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>

            {/* Main Question & Palette Layout */}
            <div className={styles.runnerBody}>
              {/* Question Workspace Area */}
              <div className={styles.questionArea}>
                <div className={styles.questionCard}>
                  <div className={styles.questionCardHeader}>
                    <span className={styles.specLabel}>
                      {currentQ.subjectId.toUpperCase()} • {currentQ.difficultyLevel.toUpperCase()}
                    </span>
                    <span className={styles.badgePyq}>
                      +{currentQ.marks} / -1
                    </span>
                  </div>

                  <p className={styles.questionText}>{currentQ.questionText}</p>

                  {/* Single Choice / MCQs Options */}
                  {currentQ.options && currentQ.options.length > 0 && (
                    <div className={styles.optionsList}>
                      {currentQ.options.map((opt) => {
                        const isSelected = currentAnswer?.selectedOptions?.includes(opt.optionKey);
                        return (
                          <div
                            key={opt.optionKey}
                            className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                            onClick={() => handleSelectOption(opt.optionKey)}
                          >
                            <span className={styles.optionKey}>{opt.optionKey}</span>
                            <span className={styles.optionText}>{opt.optionText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Numerical Type Inputs */}
                  {currentQ.questionType === 'numerical' && (
                    <div className={styles.numericalInputContainer}>
                      <label className={styles.specLabel}>ENTER NUMERICAL ANSWER:</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 4.9"
                        value={currentAnswer?.numericalAnswer || ''}
                        onChange={(e) => handleNumericalChange(e.target.value)}
                        className={styles.numericalInput}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Question Controls Bar */}
                <div className={styles.controlsBar}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className={styles.controlBtn}
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      &larr; Previous
                    </button>
                    <button
                      className={styles.controlBtn}
                      onClick={handleClearResponse}
                    >
                      Clear Response
                    </button>
                    <button
                      className={styles.controlBtn}
                      onClick={handleMarkForReview}
                    >
                      Mark for Review
                    </button>
                  </div>

                  <button
                    className={`${styles.controlBtn} ${styles.controlBtnPrimary}`}
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === activeSession.questions.length - 1}
                  >
                    Save & Next &rarr;
                  </button>
                </div>
              </div>

              {/* Question Palette Sidebar (NTA standard layout) */}
              <div className={styles.paletteSidebar}>
                <h4 className={styles.paletteTitle}>Question Palette</h4>

                <div className={styles.paletteGrid}>
                  {activeSession.questions.map((q, idx) => {
                    const status = answersMap[q.id]?.status;
                    const isCurrent = idx === currentQuestionIndex;

                    let btnClass = styles.paletteBtnNotVisited;
                    if (status === 'answered') btnClass = styles.paletteBtnAnswered;
                    else if (status === 'marked_for_review') btnClass = styles.paletteBtnMarked;
                    else if (idx <= currentQuestionIndex) btnClass = styles.paletteBtnNotAnswered;

                    if (isCurrent) btnClass += ` ${styles.paletteBtnCurrent}`;

                    return (
                      <button
                        key={q.id}
                        className={`${styles.paletteBtn} ${btnClass}`}
                        onClick={() => setCurrentQuestionIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Palette Status Legend */}
                <div className={styles.paletteLegend}>
                  <div className={styles.legendRow}>
                    <div className={`${styles.legendDot} ${styles.paletteBtnAnswered}`} />
                    <span>Answered ({Object.values(answersMap).filter((a) => a.status === 'answered').length})</span>
                  </div>
                  <div className={styles.legendRow}>
                    <div className={`${styles.legendDot} ${styles.paletteBtnNotAnswered}`} />
                    <span>Not Answered</span>
                  </div>
                  <div className={styles.legendRow}>
                    <div className={`${styles.legendDot} ${styles.paletteBtnMarked}`} />
                    <span>Marked for Review</span>
                  </div>
                  <div className={styles.legendRow}>
                    <div className={`${styles.legendDot} ${styles.paletteBtnNotVisited}`} />
                    <span>Not Visited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal Before Submission */}
        {showSubmitModal && activeSession && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Submit Assessment?</h3>
              <p className={styles.modalDesc}>
                You have answered {Object.values(answersMap).filter((a) => a.status === 'answered').length} of {activeSession.questions.length} questions. Are you sure you want to submit and generate your verified intelligence scorecard?
              </p>

              <div className={styles.modalBtnRow}>
                <button
                  className={styles.modalBtnCancel}
                  onClick={() => setShowSubmitModal(false)}
                >
                  Return to Test
                </button>
                <button
                  className={styles.modalBtnConfirm}
                  onClick={handleSubmitTest}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Yes, Submit Test'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post-Test Verified Scorecard & Analysis Modal */}
        {completedSubmission && (
          <div className={styles.scorecardOverlay}>
            <div className={styles.scorecardModal}>
              <div className={styles.scorecardHeader}>
                <div>
                  <span className={styles.scorecardSub}>VERIFIED ACADEMIC SCORECARD</span>
                  <h2 className={styles.scorecardTitle}>Assessment Performance Diagnostic</h2>
                </div>
                <button
                  className={styles.closeScorecardBtn}
                  onClick={() => setCompletedSubmission(null)}
                >
                  ✕ Close Scorecard
                </button>
              </div>

              {/* Metric Hero Row */}
              <div className={styles.scoreMetricsRow}>
                <div className={styles.scoreMetricCard}>
                  <span className={styles.metricLabel}>TOTAL SCORE</span>
                  <span className={styles.metricScoreNum}>
                    {completedSubmission.totalScore}
                    <span className={styles.metricMaxScore}> / {completedSubmission.maxScore}</span>
                  </span>
                </div>
                <div className={styles.scoreMetricCard}>
                  <span className={styles.metricLabel}>ACCURACY</span>
                  <span className={styles.metricScoreNum}>{completedSubmission.accuracyPercentage}%</span>
                </div>
                <div className={styles.scoreMetricCard}>
                  <span className={styles.metricLabel}>TIME TAKEN</span>
                  <span className={styles.metricScoreNum}>{Math.round(completedSubmission.timeTakenSeconds / 60)} Mins</span>
                </div>
              </div>

              {/* Post-Test Diagnostics */}
              {completedSubmission.postTestAnalysis && (
                <div className={styles.postTestSection}>
                  <h3 className={styles.analysisHeader}>
                    <Icon name="zap" size="sm" /> Deterministic Diagnostics & Mistake Tracing
                  </h3>

                  <div className={styles.analysisGrid}>
                    <div className={styles.analysisCard}>
                      <h4 className={styles.analysisCardTitle}>Identified Weak Topics</h4>
                      {completedSubmission.postTestAnalysis.weakTopics?.length > 0 ? (
                        <ul className={styles.topicList}>
                          {completedSubmission.postTestAnalysis.weakTopics.map((wt, i) => (
                            <li key={i} className={styles.topicItem}>
                              <span>{wt.topicTitle}</span>
                              <span className={styles.marksLost}>Lost {wt.marksLost} marks</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.cardDesc}>No major topic weaknesses flagged.</p>
                      )}
                    </div>

                    <div className={styles.analysisCard}>
                      <h4 className={styles.analysisCardTitle}>Prescriptive Next Steps</h4>
                      <ul className={styles.recList}>
                        {completedSubmission.postTestAnalysis.recommendations?.map((rec, i) => (
                          <li key={i} className={styles.recItem}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  className={styles.modalBtnConfirm}
                  onClick={() => setCompletedSubmission(null)}
                >
                  Return to Dashboard &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
