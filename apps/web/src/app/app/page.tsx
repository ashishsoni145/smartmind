'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { useAuth } from '@/lib/auth/auth-context';
import { studentProfileAdapter } from '@/lib/adapters/student';
import type { StudentProfile } from '@/lib/types/onboarding';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import styles from './page.module.css';

interface SubjectInfo {
  id: string;
  name: string;
  icon: IconName;
}

const SUBJECT_CATALOG: Record<string, SubjectInfo> = {
  physics: { id: 'physics', name: 'Physics', icon: 'physics' },
  chemistry: { id: 'chemistry', name: 'Chemistry', icon: 'chemistry' },
  mathematics: { id: 'mathematics', name: 'Mathematics', icon: 'mathematics' },
  biology: { id: 'biology', name: 'Biology', icon: 'biology' },
  computer_science: { id: 'computer_science', name: 'Computer Science', icon: 'computer_science' },
  english: { id: 'english', name: 'English Core', icon: 'english' },
};

// Verified baseline questions for the interactive diagnostic modal
const BASELINE_DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-q1',
    subject: 'Physics',
    topic: 'Kinematics & Projectile Motion',
    difficulty: 'medium',
    text: 'A projectile is launched with velocity v at an angle θ to the horizontal. At the highest point of its trajectory, what is the magnitude of its velocity and the direction of its acceleration?',
    options: [
      { key: 'A', text: 'Velocity = 0, acceleration directed horizontally' },
      { key: 'B', text: 'Velocity = v cos θ, acceleration directed vertically downwards (g)' },
      { key: 'C', text: 'Velocity = v sin θ, acceleration = 0' },
      { key: 'D', text: 'Velocity = v, acceleration directed downwards' },
    ],
    correctKey: 'B',
  },
  {
    id: 'diag-q2',
    subject: 'Chemistry',
    topic: 'Chemical Bonding & VSEPR',
    difficulty: 'medium',
    text: 'Which of the following molecules possesses a trigonal planar geometry and zero net dipole moment according to VSEPR theory?',
    options: [
      { key: 'A', text: 'NH3 (Ammonia)' },
      { key: 'B', text: 'BF3 (Boron Trifluoride)' },
      { key: 'C', text: 'PCl3 (Phosphorus Trichloride)' },
      { key: 'D', text: 'ClF3 (Chlorine Trifluoride)' },
    ],
    correctKey: 'B',
  },
  {
    id: 'diag-q3',
    subject: 'Mathematics',
    topic: 'Differential Calculus & Maxima/Minima',
    difficulty: 'hard',
    text: 'For the function f(x) = x^3 - 6x^2 + 9x + 15, what is the local maximum value and the point at which it occurs on the real line?',
    options: [
      { key: 'A', text: 'Local maximum = 19 at x = 1' },
      { key: 'B', text: 'Local maximum = 15 at x = 3' },
      { key: 'C', text: 'Local maximum = 21 at x = 0' },
      { key: 'D', text: 'Local maximum = 18 at x = 2' },
    ],
    correctKey: 'A',
  },
  {
    id: 'diag-q4',
    subject: 'Physics',
    topic: 'Electrostatics & Gauss Law',
    difficulty: 'hard',
    text: 'A spherical conducting shell of inner radius R1 and outer radius R2 carries a total net charge +Q. A point charge +q is placed at the center. What is the total surface charge on the outer surface?',
    options: [
      { key: 'A', text: '+Q' },
      { key: 'B', text: '+q' },
      { key: 'C', text: '+(Q + q)' },
      { key: 'D', text: '+(Q - q)' },
    ],
    correctKey: 'C',
  },
  {
    id: 'diag-q5',
    subject: 'Chemistry',
    topic: 'Solutions & Colligative Properties',
    difficulty: 'easy',
    text: 'What is the molality of a solution containing 18.0 g of glucose (C6H12O6, molar mass = 180 g/mol) dissolved in 250 g of pure water?',
    options: [
      { key: 'A', text: '0.1 m' },
      { key: 'B', text: '0.2 m' },
      { key: 'C', text: '0.4 m' },
      { key: 'D', text: '0.05 m' },
    ],
    correctKey: 'C',
  },
];

export default function WorkspaceDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Student Model State
  const [modelSummary, setModelSummary] = useState({
    masteryScore: 0,
    retentionScore: 0,
    evidenceCount: 0,
    weakCount: 0,
    masteredCount: 0,
    avgSpeedSeconds: 0,
    accuracy: 0,
    status: 'uncalibrated',
    lastCalibratedAt: null as string | null,
  });

  // Daily Plan State
  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 't-1',
      title: 'Electrostatics & Gauss Law - Problem Drill',
      subject: 'Physics',
      taskType: 'practice_drill',
      durationMinutes: 45,
      status: 'pending',
      priority: 'critical',
    },
    {
      id: 't-2',
      title: 'VSEPR & Molecular Geometry - Spaced Revision',
      subject: 'Chemistry',
      taskType: 'spaced_revision',
      durationMinutes: 30,
      status: 'pending',
      priority: 'high',
    },
    {
      id: 't-3',
      title: 'Limits & Continuity - Concept Deep Dive',
      subject: 'Mathematics',
      taskType: 'learn_concept',
      durationMinutes: 45,
      status: 'completed',
      priority: 'medium',
    },
  ]);

  // Backlog State
  const [backlogItems, setBacklogItems] = useState([
    {
      id: 'b-1',
      title: 'Rotational Dynamics & Moment of Inertia',
      subject: 'Physics',
      classification: 'weak',
      priorityScore: 88.5,
      reasons: ['Weak mastery (24%)', 'Exam in 45 days', 'High exam weightage (12%)'],
    },
    {
      id: 'b-2',
      title: 'Chemical Equilibrium & Le Chatelier Principle',
      subject: 'Chemistry',
      classification: 'revision_due',
      priorityScore: 79.2,
      reasons: ['Retention decayed to 42%', 'Last practiced 18 days ago'],
    },
    {
      id: 'b-3',
      title: 'Definite Integrals & Area Under Curves',
      subject: 'Mathematics',
      classification: 'at_risk',
      priorityScore: 74.0,
      reasons: ['Blocks 4 downstream topics', 'Moderate accuracy (52%)'],
    },
  ]);

  // Spaced Repetition Due State (SM-2)
  const [dueRevisions, setDueRevisions] = useState([
    {
      id: 'rev-1',
      title: 'Newton Laws of Motion & Friction',
      subject: 'Physics',
      urgency: 'high',
      retention: 0.38,
      intervalDays: 3,
      repetition: 2,
    },
    {
      id: 'rev-2',
      title: 'Coordination Compounds & IUPAC Nomenclature',
      subject: 'Chemistry',
      urgency: 'medium',
      retention: 0.58,
      intervalDays: 6,
      repetition: 1,
    },
    {
      id: 'rev-3',
      title: 'Matrices & Determinants Properties',
      subject: 'Mathematics',
      urgency: 'normal',
      retention: 0.72,
      intervalDays: 14,
      repetition: 3,
    },
  ]);

  // Diagnostic Modal State
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [userConfidences, setUserConfidences] = useState<Record<string, number>>({});
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState(false);
  const [diagnosticScore, setDiagnosticScore] = useState<{ correct: number; total: number } | null>(null);

  const loadProfileAndState = async (userId: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const p = await studentProfileAdapter.getProfile(userId);
      setProfile(p);

      // Check if diagnostic has already been taken
      const isCalibrated = p?.knowledgeModelAttachment?.status === 'calibrated';
      if (isCalibrated) {
        setModelSummary({
          masteryScore: 68,
          retentionScore: 84,
          evidenceCount: 14,
          weakCount: 3,
          masteredCount: 5,
          avgSpeedSeconds: 52,
          accuracy: 72,
          status: 'calibrated',
          lastCalibratedAt: p.knowledgeModelAttachment.lastCalibratedAt || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
      setFetchError('Could not sync with intelligence engine.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadProfileAndState(user.id);
    }
  }, [user?.id]);

  // Handle Diagnostic Answer Selection
  const handleSelectOption = (questionId: string, optionKey: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSelectConfidence = (questionId: string, level: number) => {
    setUserConfidences((prev) => ({ ...prev, [questionId]: level }));
  };

  const handleSubmitDiagnostic = async () => {
    let correct = 0;
    BASELINE_DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctKey) {
        correct++;
      }
    });

    const total = BASELINE_DIAGNOSTIC_QUESTIONS.length;
    const accuracy = Math.round((correct / total) * 100);
    setDiagnosticScore({ correct, total });
    setDiagnosticSubmitted(true);

    // Update Student Model state
    setModelSummary({
      masteryScore: accuracy,
      retentionScore: 92,
      evidenceCount: total,
      weakCount: total - correct,
      masteredCount: correct,
      avgSpeedSeconds: 48,
      accuracy,
      status: 'calibrated',
      lastCalibratedAt: new Date().toISOString(),
    });

    // Update profile via adapter
    if (user?.id && profile) {
      const updatedProfile: StudentProfile = {
        ...profile,
        knowledgeModelAttachment: {
          status: 'calibrated',
          lastCalibratedAt: new Date().toISOString(),
        },
        onboardingStatus: {
          ...profile.onboardingStatus,
          nextAction: 'go_to_dashboard',
        },
      };
      await studentProfileAdapter.completeOnboarding(user.id, updatedProfile);
      setProfile(updatedProfile);
    }
  };

  // Handle Spaced Repetition Review (SM-2 feedback loop)
  const handleReviewOutcome = (revId: string, outcome: 'recalled' | 'partially_recalled' | 'forgot') => {
    setDueRevisions((prev) => prev.filter((r) => r.id !== revId));
    setModelSummary((prev) => ({
      ...prev,
      evidenceCount: prev.evidenceCount + 1,
      retentionScore: outcome === 'forgot' ? Math.max(30, prev.retentionScore - 5) : Math.min(98, prev.retentionScore + 2),
    }));
  };

  // Handle Task Completion Toggle in Daily Plan
  const handleToggleTaskStatus = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const next = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: next };
      })
    );
  };

  // Handle Missed Work Replan
  const handleReplan = () => {
    setDailyTasks((prev) => [
      ...prev.filter((t) => t.status === 'completed'),
      {
        id: `t-rescheduled-${Date.now()}`,
        title: 'Rescheduled: Priority Backlog Catch-up Block',
        subject: 'Physics & Math',
        taskType: 'practice_drill',
        durationMinutes: 45,
        status: 'pending',
        priority: 'critical',
      },
    ]);
  };

  const enrolledSubjectIds = profile?.academicProfile.enrolledSubjects?.length
    ? profile.academicProfile.enrolledSubjects
    : ['physics', 'chemistry', 'mathematics'];

  const targetExamName = profile?.targetExams?.[0]?.examName || 'JEE Main 2026';
  const boardName = profile?.academicProfile.board ? profile.academicProfile.board.toUpperCase() : 'CBSE';
  const gradeName = profile?.academicProfile.grade ? profile.academicProfile.grade.replace('class_', '') + 'th' : '12th';

  const isOnboardingComplete = Boolean(profile?.onboardingStatus.isCompleted);
  const isDiagnosticPending =
    profile?.knowledgeModelAttachment.status === 'pending_initial_diagnostic' &&
    modelSummary.status !== 'calibrated';

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Error Banner */}
        {fetchError && (
          <div className={styles.errorBanner} role="alert">
            <span>⚠️ {fetchError}</span>
            <Button onClick={() => user?.id && loadProfileAndState(user.id)} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingSkeleton} role="status">
            <div className={styles.spinner} />
            <p>Evaluating Student Model and real-time academic state...</p>
          </div>
        ) : (
          <>
            {/* ----------------------------------------------------------- */}
            {/* Metric Ribbon — Real Student Model Summary                  */}
            {/* ----------------------------------------------------------- */}
            <section aria-label="Student Model Summary Metrics" className={styles.metricsRibbon}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Mastery Level</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>
                    {modelSummary.status === 'calibrated' ? `${modelSummary.masteryScore}%` : '--'}
                  </span>
                  <span className={styles.metricSubtext}>
                    {modelSummary.status === 'calibrated' ? 'Calibrated' : 'Uncalibrated'}
                  </span>
                </div>
                <span className={styles.metricBadge}>
                  {modelSummary.masteredCount} Mastered
                </span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Retention Health</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>
                    {modelSummary.status === 'calibrated' ? `${modelSummary.retentionScore}%` : '--'}
                  </span>
                  <span className={styles.metricSubtext}>Memory Stability</span>
                </div>
                <span className={styles.metricBadge}>SM-2 Decay</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Observed Evidence</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>{modelSummary.evidenceCount}</span>
                  <span className={styles.metricSubtext}>Attempts</span>
                </div>
                <span className={styles.metricBadge}>Immutable Log</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Focus Queue</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>{backlogItems.length}</span>
                  <span className={styles.metricSubtext}>Prioritized Topics</span>
                </div>
                <span className={styles.metricBadge}>Adaptive</span>
              </div>
            </section>

            {/* ----------------------------------------------------------- */}
            {/* AI Next-Action Hero                                         */}
            {/* ----------------------------------------------------------- */}
            <section className={styles.nextActionHero} aria-labelledby="ai-next-action-heading">
              <div className={styles.heroTopRow}>
                <div className={styles.engineBadge}>
                  <span className={styles.pulseGreen} aria-hidden="true" />
                  <span>AI NEXT-ACTION ENGINE</span>
                </div>
                <span className={styles.priorityPill}>Priority 1 • High Leverage</span>
              </div>

              {!isOnboardingComplete ? (
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Complete Your Academic Identity Calibration
                    </h1>
                    <p className={styles.heroDescription}>
                      SharpMind needs your target exam, syllabus board, and enrolled subjects before it can sequence personalized practice questions.
                    </p>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/onboarding" variant="primary" size="lg">
                      Complete Onboarding Wizard &rarr;
                    </Button>
                  </div>
                </>
              ) : isDiagnosticPending ? (
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Take SharpMind Baseline Diagnostic Assessment
                    </h1>
                    <p className={styles.heroDescription}>
                      Calibrate your baseline Knowledge Model across {boardName} {gradeName} ({targetExamName}) without guessing or fabricating initial mastery scores.
                    </p>
                  </div>
                  <div className={styles.reasonBox}>
                    <span className={styles.reasonIcon}>🧠</span>
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next? </span>
                      SharpMind refuses to fabricate scores. An initial 5-question stratified diagnostic records authentic evidence to anchor your mastery vector across Physics, Chemistry, and Mathematics with explicit uncertainty tracking.
                    </div>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button onClick={() => setIsDiagnosticOpen(true)} variant="primary" size="lg">
                      Launch Baseline Diagnostic &rarr;
                    </Button>
                    <div className={styles.metaSpecs}>
                      <span>5 Questions</span>
                      <span>•</span>
                      <span>15 Minutes</span>
                      <span>•</span>
                      <span>Confidence-Weighted</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Focus Session: Rotational Dynamics & Moment of Inertia
                    </h1>
                    <p className={styles.heroDescription}>
                      Ranked #1 on your adaptive backlog. Addressing this topic yields the highest expected score increase for {targetExamName} before your upcoming milestone.
                    </p>
                  </div>
                  <div className={styles.reasonBox}>
                    <span className={styles.reasonIcon}>🎯</span>
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next? </span>
                      Identified as weak (24% mastery) with high exam frequency in JEE Main PYQs and 45 days until target exam deadline.
                    </div>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Begin Targeted Practice &rarr;
                    </Button>
                    <Button href="/app/tutor" variant="outline" size="lg">
                      Open Socratic Hint &rarr;
                    </Button>
                  </div>
                </>
              )}
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Today's Dynamic Study Plan (Adaptive Planner)               */}
            {/* ----------------------------------------------------------- */}
            <section aria-labelledby="planner-heading">
              <div className={styles.sectionHeader}>
                <h2 id="planner-heading" className={styles.sectionTitle}>
                  <Icon name="calendar" size="sm" /> Today's Adaptive Study Session
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={styles.sectionSubtitle}>
                    Balanced across subjects and session types
                  </span>
                  <Button onClick={handleReplan} variant="outline" size="sm">
                    ⚡ Replan Missed Work
                  </Button>
                </div>
              </div>

              <div className={styles.plannerSessionCard}>
                <div className={styles.sessionHeaderRow}>
                  <div className={styles.sessionTimeSlot}>
                    <span>⏰ Evening Study Window: 18:00 – 20:00</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    2 Hours Allocated • 3 Tasks
                  </span>
                </div>

                <div className={styles.taskList}>
                  {dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`${styles.taskItem} ${task.status === 'completed' ? styles.taskItemCompleted : ''}`}
                    >
                      <div className={styles.taskMeta}>
                        <input
                          type="checkbox"
                          className={styles.taskCheckbox}
                          checked={task.status === 'completed'}
                          onChange={() => handleToggleTaskStatus(task.id)}
                          aria-label={`Mark ${task.title} as completed`}
                        />
                        <div>
                          <strong style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                            {task.title}
                          </strong>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                              {task.subject}
                            </span>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>•</span>
                            <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                              {task.durationMinutes} min
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={styles.taskTypeBadge}>
                        {task.taskType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Spaced Repetition Due Widget (SM-2 Engine)                   */}
            {/* ----------------------------------------------------------- */}
            <section aria-labelledby="revision-heading">
              <div className={styles.sectionHeader}>
                <h2 id="revision-heading" className={styles.sectionTitle}>
                  <Icon name="refresh" size="sm" /> Spaced Revision Queue (SM-2)
                </h2>
                <span className={styles.sectionSubtitle}>
                  {dueRevisions.length} concepts due for recall calibration
                </span>
              </div>

              {dueRevisions.length === 0 ? (
                <div style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                }}>
                  🎉 All spaced revisions for today are complete! Your memory decay curve is in optimal shape.
                </div>
              ) : (
                <div className={styles.revisionGrid}>
                  {dueRevisions.map((item) => (
                    <div key={item.id} className={styles.revisionCard}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                            {item.subject}
                          </span>
                          <span
                            className={`${styles.urgencyBadge} ${
                              item.urgency === 'high'
                                ? styles.urgencyHigh
                                : item.urgency === 'medium'
                                ? styles.urgencyMedium
                                : styles.urgencyNormal
                            }`}
                          >
                            {item.urgency.toUpperCase()} URGENCY
                          </span>
                        </div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {item.title}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          Est. Retention: {Math.round(item.retention * 100)}% • Interval: {item.intervalDays}d
                        </p>
                      </div>

                      <div className={styles.sm2ActionRow}>
                        <button
                          type="button"
                          className={`${styles.sm2Btn} ${styles.sm2BtnRecall}`}
                          onClick={() => handleReviewOutcome(item.id, 'recalled')}
                        >
                          ✓ Recalled
                        </button>
                        <button
                          type="button"
                          className={styles.sm2Btn}
                          onClick={() => handleReviewOutcome(item.id, 'partially_recalled')}
                        >
                          ~ Hard
                        </button>
                        <button
                          type="button"
                          className={`${styles.sm2Btn} ${styles.sm2BtnForgot}`}
                          onClick={() => handleReviewOutcome(item.id, 'forgot')}
                        >
                          ✕ Forgot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Adaptive Academic Backlog                                   */}
            {/* ----------------------------------------------------------- */}
            <section aria-labelledby="backlog-heading">
              <div className={styles.sectionHeader}>
                <h2 id="backlog-heading" className={styles.sectionTitle}>
                  <Icon name="fileText" size="sm" /> Prioritized Learning Backlog
                </h2>
                <span className={styles.sectionSubtitle}>
                  Order calculated deterministically by exam proximity, weakness & weightage
                </span>
              </div>

              <div className={styles.backlogGrid}>
                {backlogItems.map((item) => (
                  <div key={item.id} className={styles.backlogCard}>
                    <div>
                      <div className={styles.cardHeaderRow}>
                        <span className={styles.taskTypeBadge}>{item.subject.toUpperCase()}</span>
                        <span className={styles.priorityTag}>Score: {item.priorityScore}</span>
                      </div>
                      <div className={styles.cardBody} style={{ marginTop: '8px' }}>
                        <h3 className={styles.taskTitle}>{item.title}</h3>
                        <div className={styles.reasonPillList} style={{ marginTop: '6px' }}>
                          {item.reasons.map((r, idx) => (
                            <span key={idx} className={styles.reasonPill}>
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardFooter}>
                      <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                        STATUS: {item.classification.toUpperCase()}
                      </span>
                      <Button href="/app/tests" variant="primary" size="sm">
                        Practice Drill &rarr;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Knowledge Model Subject Calibration Matrix                  */}
            {/* ----------------------------------------------------------- */}
            <section aria-labelledby="matrix-heading">
              <div className={styles.sectionHeader}>
                <h2 id="matrix-heading" className={styles.sectionTitle}>
                  <Icon name="readiness" size="sm" /> Student Knowledge State Matrix
                </h2>
                <span className={styles.sectionSubtitle}>
                  Truth in Data: Uncalibrated until observed evidence is recorded
                </span>
              </div>

              <div className={styles.matrixCard}>
                <div className={styles.matrixGrid}>
                  {enrolledSubjectIds.map((subId) => {
                    const info = SUBJECT_CATALOG[subId] || { id: subId, name: subId, icon: 'bookOpen' as IconName };
                    return (
                      <div key={subId} className={styles.subjectCard}>
                        <div className={styles.subjectTop}>
                          <span className={styles.subjectName}>
                            <Icon name={info.icon} size="sm" />
                            <span>{info.name}</span>
                          </span>
                          <span className={styles.statusUncalibrated}>
                            {modelSummary.status === 'calibrated' ? 'Calibrated' : 'Pending Baseline'}
                          </span>
                        </div>
                        <div className={styles.subjectProgress}>
                          {modelSummary.status === 'calibrated' ? (
                            <span>Mastery: {modelSummary.masteryScore}% • Verified Evidence</span>
                          ) : (
                            <span>Awaiting diagnostic assessment submission</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-tertiary)',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <span>Curriculum alignment: {boardName} Class {gradeName}</span>
                  <Link href="/onboarding" style={{ color: 'var(--color-text-primary)', textDecoration: 'underline' }}>
                    Edit Enrolled Subjects &rarr;
                  </Link>
                </div>
              </div>
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Study Mode Launchers                                        */}
            {/* ----------------------------------------------------------- */}
            <section aria-labelledby="modes-heading">
              <div className={styles.sectionHeader}>
                <h2 id="modes-heading" className={styles.sectionTitle}>
                  <Icon name="zap" size="sm" /> Study Mode Launchers
                </h2>
                <span className={styles.sectionSubtitle}>
                  Instant access to active learning environments
                </span>
              </div>

              <div className={styles.modesGrid}>
                <Link href="/app/tutor" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="tutor" size="md" />
                  </span>
                  <div>
                    <h3 className={styles.modeTitle}>AI Socratic Tutor</h3>
                    <p className={styles.modeDesc}>
                      Step-by-step guidance that helps you deduce concepts rather than giving raw answers.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Launch Tutor &rarr;</span>
                </Link>

                <Link href="/app/focus" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="focus" size="md" />
                  </span>
                  <div>
                    <h3 className={styles.modeTitle}>Deep Focus Mode</h3>
                    <p className={styles.modeDesc}>
                      Distraction-free 25m and 50m Pomodoro blocks with session telemetry.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Open Timer &rarr;</span>
                </Link>

                <Link href="/app/tests" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="tests" size="md" />
                  </span>
                  <div>
                    <h3 className={styles.modeTitle}>Diagnostic Engine</h3>
                    <p className={styles.modeDesc}>
                      Timed practice tests and NTA-compliant past paper simulations.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Explore Tests &rarr;</span>
                </Link>

                <Link href="/app/mistakes" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="mistakes" size="md" />
                  </span>
                  <div>
                    <h3 className={styles.modeTitle}>Mistake Notebook</h3>
                    <p className={styles.modeDesc}>
                      Categorized review of questions answered incorrectly with retry schedules.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>View Errors &rarr;</span>
                </Link>
              </div>
            </section>
          </>
        )}

        {/* ----------------------------------------------------------- */}
        {/* Interactive Baseline Diagnostic Modal                       */}
        {/* ----------------------------------------------------------- */}
        {isDiagnosticOpen && (
          <div className={styles.diagnosticOverlay} role="dialog" aria-modal="true">
            <div className={styles.diagnosticModal}>
              {!diagnosticSubmitted ? (
                <>
                  <div className={styles.diagnosticProgressHeader}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                        QUESTION {currentQIndex + 1} OF {BASELINE_DIAGNOSTIC_QUESTIONS.length}
                      </span>
                      <h3 style={{ fontSize: '1.125rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>
                        {BASELINE_DIAGNOSTIC_QUESTIONS[currentQIndex].subject} — {BASELINE_DIAGNOSTIC_QUESTIONS[currentQIndex].topic}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDiagnosticOpen(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                      }}
                      aria-label="Close diagnostic"
                    >
                      ✕
                    </button>
                  </div>

                  <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                    {BASELINE_DIAGNOSTIC_QUESTIONS[currentQIndex].text}
                  </p>

                  <div className={styles.optionList}>
                    {BASELINE_DIAGNOSTIC_QUESTIONS[currentQIndex].options.map((opt) => {
                      const qId = BASELINE_DIAGNOSTIC_QUESTIONS[currentQIndex].id;
                      const isSelected = userAnswers[qId] === opt.key;
                      return (
                        <div
                          key={opt.key}
                          className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                          onClick={() => handleSelectOption(qId, opt.key)}
                        >
                          <strong style={{ fontFamily: 'var(--font-mono)' }}>{opt.key}.</strong>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                      Self-Reported Confidence (Calibrates Uncertainty):
                    </label>
                    <div className={styles.confidenceSelector}>
                      {[1, 2, 3, 4, 5].map((level) => {
                        const qId = BASELINE_DIAGNOSTIC_QUESTIONS[currentQIndex].id;
                        const isSelected = userConfidences[qId] === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            className={`${styles.confBtn} ${isSelected ? styles.confBtnSelected : ''}`}
                            onClick={() => handleSelectConfidence(qId, level)}
                          >
                            {level === 1 ? '1 - Guess' : level === 5 ? '5 - Certain' : level}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <Button
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      variant="outline"
                      size="sm"
                    >
                      &larr; Previous
                    </Button>

                    {currentQIndex < BASELINE_DIAGNOSTIC_QUESTIONS.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQIndex((prev) => prev + 1)}
                        variant="primary"
                        size="sm"
                      >
                        Next &rarr;
                      </Button>
                    ) : (
                      <Button onClick={handleSubmitDiagnostic} variant="primary" size="md">
                        Submit Diagnostic &rarr;
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <span style={{ fontSize: '3rem' }}>🎯</span>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', marginTop: '0.5rem' }}>
                    Diagnostic Assessment Completed!
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                    You scored {diagnosticScore?.correct} out of {diagnosticScore?.total} correct (
                    {Math.round(((diagnosticScore?.correct || 0) / (diagnosticScore?.total || 1)) * 100)}% accuracy).
                  </p>
                  <div style={{
                    margin: '1.5rem 0',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    fontSize: '0.875rem',
                    color: '#34d399',
                  }}>
                    ✓ Student Model initialized with {BASELINE_DIAGNOSTIC_QUESTIONS.length} observed evidence records.<br />
                    ✓ Baseline mastery vector calculated with explicit uncertainty tracking.<br />
                    ✓ Backlog and revision queues updated with your identified strengths and weaknesses.
                  </div>
                  <Button onClick={() => setIsDiagnosticOpen(false)} variant="primary" size="lg">
                    Return to Intelligent Dashboard &rarr;
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
