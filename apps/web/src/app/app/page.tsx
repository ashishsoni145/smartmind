'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { useAuth } from '@/lib/auth/auth-context';
import { studentProfileAdapter } from '@/lib/adapters/student';
import type { StudentProfile } from '@/lib/types/onboarding';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

import { Icon, type IconName } from '@/components/ui/Icon';

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

export default function WorkspaceDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    setFetchError(null);
    try {
      const p = await studentProfileAdapter.getProfile(userId);
      setProfile(p);
    } catch (err) {
      setFetchError('Failed to load academic profile from persistence layer.');
      console.error(err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadProfile(user.id);
    }
  }, [user?.id]);

  const enrolledSubjectIds = profile?.academicProfile.enrolledSubjects?.length
    ? profile.academicProfile.enrolledSubjects
    : ['physics', 'chemistry', 'mathematics'];

  const targetExamName = profile?.targetExams?.[0]?.examName || 'Competitive Entrance Exams';
  const boardName = profile?.academicProfile.board ? profile.academicProfile.board.toUpperCase() : 'CBSE';
  const gradeName = profile?.academicProfile.grade ? profile.academicProfile.grade.replace('class_', '') + 'th' : '12th';

  const isOnboardingComplete = Boolean(profile?.onboardingStatus.isCompleted);
  const isDiagnosticPending = profile?.knowledgeModelAttachment.status === 'pending_initial_diagnostic';

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Error State Banner */}
        {fetchError && (
          <div className={styles.errorBanner} role="alert">
            <span>⚠️ {fetchError}</span>
            <Button onClick={() => user?.id && loadProfile(user.id)} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )}

        {isLoadingProfile ? (
          <div className={styles.loadingSkeleton} role="status">
            <div className={styles.spinner} />
            <p>Evaluating real-time academic state...</p>
          </div>
        ) : (
          <>
            {/* Primary AI Next-Action Hero */}
            <section className={styles.nextActionHero} aria-labelledby="ai-next-action-heading">
              <div className={styles.heroTopRow}>
                <div className={styles.engineBadge}>
                  <span className={styles.pulseGreen} aria-hidden="true" />
                  <span>AI NEXT-ACTION ENGINE</span>
                </div>
                <span className={styles.priorityPill}>Priority 1 • High Leverage</span>
              </div>

              {!isOnboardingComplete ? (
                // Case A: Onboarding Incomplete
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Complete Your Academic Identity Calibration
                    </h1>
                    <p className={styles.heroDescription}>
                      SharpMind needs your target exam, syllabus board, and enrolled subjects before it can sequence personalized practice questions.
                    </p>
                  </div>

                  <div className={styles.reasonBox}>
                    <span className={styles.reasonIcon}>💡</span>
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next? </span>
                      The AI Knowledge Model cannot construct your curriculum graph or calculate forgetting curves without knowing your enrolled subjects and target examination deadline.
                    </div>
                  </div>

                  <div className={styles.heroActionRow}>
                    <Button href="/onboarding" variant="primary" size="lg">
                      Complete Onboarding Wizard &rarr;
                    </Button>
                    <div className={styles.metaSpecs}>
                      <span>Est. 2 minutes</span>
                      <span>•</span>
                      <span>5 quick steps</span>
                    </div>
                  </div>
                </>
              ) : isDiagnosticPending ? (
                // Case B: Onboarding Complete, Baseline Diagnostic Pending
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
                      SharpMind refuses to fabricate scores. An initial 45-minute diagnostic assessment records authentic evidence to anchor your mastery vector across Physics, Chemistry, and Mathematics.
                    </div>
                  </div>

                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Launch Baseline Diagnostic &rarr;
                    </Button>
                    <div className={styles.metaSpecs}>
                      <span>45 Minutes</span>
                      <span>•</span>
                      <span>20 Marks (+4 / -1)</span>
                      <span>•</span>
                      <span>5 Verified Questions</span>
                    </div>
                  </div>
                </>
              ) : (
                // Case C: Calibrated Learning Routine
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Evening Deep Work: Electrostatics & Kinematics Drill
                    </h1>
                    <p className={styles.heroDescription}>
                      Your scheduled focus window is active. Solve 8 targeted problems targeting your identified weakness in projectile trajectory calculations.
                    </p>
                  </div>

                  <div className={styles.reasonBox}>
                    <span className={styles.reasonIcon}>🎯</span>
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next? </span>
                      Calibrated for {targetExamName}. Based on your recent diagnostic attempt, targeted practice in projectile kinematics yields the highest marginal score increase.
                    </div>
                  </div>

                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Begin Practice Drill &rarr;
                    </Button>
                    <Button href="/app/tutor" variant="outline" size="lg">
                      Open AI Socratic Hint &rarr;
                    </Button>
                  </div>
                </>
              )}
            </section>

            {/* Adaptive Academic Backlog / Study Queue */}
            <section aria-labelledby="backlog-heading">
              <div className={styles.sectionHeader}>
                <h2 id="backlog-heading" className={styles.sectionTitle}>
                  <span>📋</span> Adaptive Daily Queue
                </h2>
                <span className={styles.sectionSubtitle}>
                  Ordered dynamically by pedagogical priority
                </span>
              </div>

              <div className={styles.backlogGrid}>
                {/* Task 1 */}
                <div className={styles.backlogCard}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.taskTypeBadge}>DIAGNOSTIC TEST</span>
                    <span className={styles.priorityTag}>P1 • Required</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.taskTitle}>SharpMind Baseline Assessment</h3>
                    <p className={styles.taskContext}>
                      5 verified items spanning Kinematics, Gauss Law, Molarity, BF3 Geometry, and Derivatives.
                    </p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                      45m • 20 pts
                    </span>
                    <Button href="/app/tests" variant="primary" size="sm">
                      Start &rarr;
                    </Button>
                  </div>
                </div>

                {/* Task 2 */}
                <div className={styles.backlogCard}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.taskTypeBadge}>FOCUS ROUTINE</span>
                    <span className={styles.priorityTag}>P2 • Scheduled</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.taskTitle}>Evening Deep Work Block</h3>
                    <p className={styles.taskContext}>
                      Targeted daily study window: {profile?.studyPreferences.dailyAvailableHours || 3.0} hours allocated for intense problem solving.
                    </p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                      50m Pomodoro
                    </span>
                    <Button href="/app/focus" variant="outline" size="sm">
                      Launch Focus &rarr;
                    </Button>
                  </div>
                </div>

                {/* Task 3 */}
                <div className={styles.backlogCard}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.taskTypeBadge}>AI SOCRATIC COACH</span>
                    <span className={styles.priorityTag}>P3 • On-Demand</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.taskTitle}>Doubt Clearance Session</h3>
                    <p className={styles.taskContext}>
                      Clarify conceptual sticking points with the guided Socratic dialogue engine.
                    </p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                      Interactive
                    </span>
                    <Button href="/app/tutor" variant="outline" size="sm">
                      Ask Tutor &rarr;
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Knowledge Model Calibration Matrix (Truth in Data) */}
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
                            {isDiagnosticPending ? 'Calibration Pending' : 'Baseline Active'}
                          </span>
                        </div>
                        <div className={styles.subjectProgress}>
                          {isDiagnosticPending ? (
                            <span>Awaiting diagnostic assessment submission</span>
                          ) : (
                            <span>Observed evidence: 0 verified attempts</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-tertiary)',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span>Curriculum alignment: {boardName} Class {gradeName}</span>
                  <Link href="/onboarding" style={{ color: 'var(--color-text-primary)', textDecoration: 'underline' }}>
                    Edit Enrolled Subjects &rarr;
                  </Link>
                </div>
              </div>
            </section>

            {/* Study Mode Quick Launchers */}
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
      </div>
    </WorkspaceShell>
  );
}
