'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { useAuth } from '@/lib/auth/auth-context';
import { studentProfileAdapter } from '@/lib/adapters/student';
import type { StudentProfile } from '@/lib/types/onboarding';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { apiClient } from '@/lib/api-client';
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

interface DashboardTask {
  id: string;
  sessionId?: string;
  title: string;
  subject: string;
  taskType: string;
  durationMinutes: number;
  status: string;
  priority: string;
}

interface DashboardBacklogItem {
  id: string;
  title: string;
  subject: string;
  classification: string;
  priorityScore: number;
  reasons: string[];
}

interface DashboardRevisionItem {
  id: string;
  title: string;
  subject: string;
  urgency: 'high' | 'medium' | 'normal';
  retention: number;
  intervalDays: number;
  repetition: number;
}

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
  const [dailyTasks, setDailyTasks] = useState<DashboardTask[]>([]);
  const [planSessionInfo, setPlanSessionInfo] = useState<{ timeSlot: string; totalMinutes: number } | null>(null);

  // Backlog State
  const [backlogItems, setBacklogItems] = useState<DashboardBacklogItem[]>([]);

  // Spaced Repetition Due State (SM-2)
  const [dueRevisions, setDueRevisions] = useState<DashboardRevisionItem[]>([]);

  const loadProfileAndState = useCallback(async (userId: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch Student Profile
      const p = await studentProfileAdapter.getProfile(userId);
      setProfile(p);

      // 2. Fetch Student Model Summary from Backend
      try {
        const summary = await apiClient.studentModel.getSummary(userId);
        if (summary) {
          const evidenceCount = summary.totalEvidence || 0;
          const isCalibrated = evidenceCount > 0;
          const weakTopics = summary.subjectSummaries?.reduce(
            (acc: number, s: any) => acc + (s.weakCount || 0),
            0
          ) || 0;
          const masteredTopics = summary.subjectSummaries?.reduce(
            (acc: number, s: any) => acc + (s.masteredCount || 0),
            0
          ) || 0;

          setModelSummary({
            masteryScore: Math.round((summary.overallMastery || 0) * 100),
            retentionScore: Math.round((summary.overallRetention || 0) * 100),
            evidenceCount,
            weakCount: weakTopics,
            masteredCount: masteredTopics,
            avgSpeedSeconds: 48,
            accuracy: Math.round((summary.overallMastery || 0) * 100),
            status: isCalibrated ? 'calibrated' : 'uncalibrated',
            lastCalibratedAt: summary.lastActivityAt || null,
          });
        }
      } catch (smErr) {
        console.warn('Could not load student model summary:', smErr);
      }

      // 3. Fetch Prioritized Backlog
      try {
        const backlogRes = await apiClient.backlog.get(userId, { limit: 6 });
        if (backlogRes && backlogRes.items) {
          const mappedBacklog: DashboardBacklogItem[] = backlogRes.items.map((item: any) => ({
            id: item.id || item.curriculum_node_id,
            title: item.title,
            subject: item.subject_id || item.subjectId || 'General',
            classification: item.classification || 'unstarted',
            priorityScore: Math.round((Number(item.priority_score || item.priorityScore) || 50) * 10) / 10,
            reasons: Array.isArray(item.priority_reasons)
              ? item.priority_reasons.map((r: any) => (typeof r === 'string' ? r : r.explanation || r.reason || ''))
              : ['Identified by adaptive scheduler'],
          }));
          setBacklogItems(mappedBacklog);
        }
      } catch (bErr) {
        console.warn('Could not load backlog items:', bErr);
      }

      // 4. Fetch Daily Planner Sessions
      try {
        const plan = await apiClient.planner.getToday(userId);
        if (plan && plan.sessions && plan.sessions.length > 0) {
          const allTasks: DashboardTask[] = [];
          for (const session of plan.sessions) {
            for (const task of session.tasks || []) {
              allTasks.push({
                id: task.id,
                sessionId: session.id,
                title: task.title,
                subject: task.subjectId || 'General',
                taskType: task.taskType || 'practice_drill',
                durationMinutes: task.estimatedMinutes || 30,
                status: task.status || 'pending',
                priority: task.priority || 'medium',
              });
            }
          }
          setDailyTasks(allTasks);
          setPlanSessionInfo({
            timeSlot: `${plan.sessions[0].startTime || '09:00'} – ${plan.sessions[plan.sessions.length - 1].endTime || '18:00'}`,
            totalMinutes: plan.totalMinutes || 120,
          });
        } else {
          setDailyTasks([]);
        }
      } catch (pErr) {
        console.warn('Could not load daily plan:', pErr);
      }

      // 5. Fetch Spaced Repetition Due Queue
      try {
        const revRes = await apiClient.revision.getDue(userId, { limit: 10 });
        if (revRes && revRes.items) {
          const mappedRev: DashboardRevisionItem[] = revRes.items.map((item: any) => {
            const urgencyScore = Number(item.urgencyScore) || 50;
            const urgency: 'high' | 'medium' | 'normal' =
              urgencyScore > 75 ? 'high' : urgencyScore > 40 ? 'medium' : 'normal';
            return {
              id: item.id,
              title: item.topicTitle || 'Curriculum Concept Recall',
              subject: item.subjectId || 'General',
              urgency,
              retention: item.currentRetention || 0.5,
              intervalDays: item.intervalDays || 1,
              repetition: item.repetitionLevel || 0,
            };
          });
          setDueRevisions(mappedRev);
        } else {
          setDueRevisions([]);
        }
      } catch (rErr) {
        console.warn('Could not load revision queue:', rErr);
      }
    } catch (err) {
      console.error('Critical failure in workspace dashboard sync:', err);
      setFetchError('Could not sync with intelligence engine. Please check backend connectivity.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadProfileAndState(user.id);
    }
  }, [user?.id, loadProfileAndState]);

  // Handle Spaced Repetition Review (SM-2 feedback loop)
  const handleReviewOutcome = async (revId: string, outcome: 'recalled' | 'partially_recalled' | 'forgot') => {
    if (!user?.id) return;
    const backendOutcome = outcome === 'recalled' ? 'recalled' : outcome === 'partially_recalled' ? 'hard' : 'forgot';

    // Optimistically remove from view
    setDueRevisions((prev) => prev.filter((r) => r.id !== revId));

    try {
      await apiClient.revision.completeEvent(user.id, revId, {
        outcome: backendOutcome,
        timeSpentSeconds: 45,
      });
      // Refresh summary
      const summary = await apiClient.studentModel.getSummary(user.id);
      if (summary) {
        setModelSummary((prev) => ({
          ...prev,
          evidenceCount: summary.totalEvidence || prev.evidenceCount + 1,
          retentionScore: Math.round((summary.overallRetention || 0) * 100),
        }));
      }
    } catch (err) {
      console.error('Failed to record revision outcome on backend:', err);
    }
  };

  // Handle Task Completion Toggle in Daily Plan
  const handleToggleTaskStatus = async (taskId: string, sessionId?: string) => {
    if (!user?.id) return;
    const currentTask = dailyTasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    const nextStatus = currentTask.status === 'completed' ? 'pending' : 'completed';

    // Optimistic UI update
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );

    if (sessionId) {
      try {
        await apiClient.planner.updateTask(user.id, sessionId, taskId, nextStatus);
      } catch (err) {
        console.error('Failed to update task status on backend:', err);
      }
    }
  };

  // Handle Missed Work Replan via Adaptive Planner
  const handleReplan = async () => {
    if (!user?.id) return;
    try {
      const plan = await apiClient.planner.replan(user.id);
      if (plan && plan.sessions) {
        const allTasks: DashboardTask[] = [];
        for (const session of plan.sessions) {
          for (const task of session.tasks || []) {
            allTasks.push({
              id: task.id,
              sessionId: session.id,
              title: task.title,
              subject: task.subjectId || 'General',
              taskType: task.taskType || 'practice_drill',
              durationMinutes: task.estimatedMinutes || 30,
              status: task.status || 'pending',
              priority: task.priority || 'high',
            });
          }
        }
        setDailyTasks(allTasks);
      }
    } catch (err) {
      console.error('Failed to trigger replan on backend:', err);
    }
  };

  const enrolledSubjectIds = profile?.academicProfile.enrolledSubjects?.length
    ? profile.academicProfile.enrolledSubjects
    : ['physics', 'chemistry', 'mathematics'];

  const targetExamName = profile?.targetExams?.[0]?.examName || 'Target Exam';
  const boardName = profile?.academicProfile.board ? profile.academicProfile.board.toUpperCase() : 'Board';
  const gradeName = profile?.academicProfile.grade ? profile.academicProfile.grade.replace('class_', '') + 'th' : '';

  const isOnboardingComplete = Boolean(profile?.onboardingStatus.isCompleted);
  const isDiagnosticPending =
    profile?.knowledgeModelAttachment.status === 'pending_initial_diagnostic' &&
    modelSummary.status !== 'calibrated';

  // Next-action recommendation derived directly from top backlog item or due revision
  const topBacklog = backlogItems.length > 0 ? backlogItems[0] : null;

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
                  {modelSummary.masteredCount} Mastered Units
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
              ) : isDiagnosticPending || modelSummary.status === 'uncalibrated' ? (
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
                    <Button href="/app/tests?type=diagnostic" variant="primary" size="lg">
                      Launch Baseline Diagnostic &rarr;
                    </Button>
                    <Button href="/app/tests" variant="outline" size="lg">
                      Open in Full Test Runner &rarr;
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
              ) : topBacklog ? (
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Focus Session: {topBacklog.title}
                    </h1>
                    <p className={styles.heroDescription}>
                      Ranked #1 on your adaptive backlog. Addressing this topic yields the highest expected score increase for {targetExamName} before your upcoming milestone.
                    </p>
                  </div>
                  <div className={styles.reasonBox}>
                    <span className={styles.reasonIcon}>🎯</span>
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next? </span>
                      {topBacklog.reasons.join('. ') || `Identified as ${topBacklog.classification} with high weightage in ${targetExamName}.`}
                    </div>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Begin Targeted Practice &rarr;
                    </Button>
                    <Button href={`/app/tutor?topic=${encodeURIComponent(topBacklog.title)}`} variant="outline" size="lg">
                      Open Socratic Hint &rarr;
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.heroMain}>
                    <h1 id="ai-next-action-heading" className={styles.heroTitle}>
                      Study Agenda Clear & On Pace
                    </h1>
                    <p className={styles.heroDescription}>
                      All scheduled tasks and high-priority backlog items are mastered. You can run mock assessments or explore advanced PYQ patterns.
                    </p>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Take Full-Length Mock Exam &rarr;
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
                    <span>⏰ {planSessionInfo ? `Study Window: ${planSessionInfo.timeSlot}` : 'Flexible Daily Study Window'}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    {dailyTasks.length > 0 ? `${dailyTasks.length} Tasks Scheduled` : 'No Scheduled Tasks'}
                  </span>
                </div>

                {dailyTasks.length === 0 ? (
                  <div style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                  }}>
                    No tasks scheduled for today yet. Use <strong>Replan Missed Work</strong> to generate today&apos;s sequence from your backlog.
                  </div>
                ) : (
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
                            onChange={() => handleToggleTaskStatus(task.id, task.sessionId)}
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
                          {task.taskType.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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

              {backlogItems.length === 0 ? (
                <div style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.875rem',
                }}>
                  No backlog items found. Complete your initial diagnostic assessment to populate prioritized topics.
                </div>
              ) : (
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
                          STATUS: {item.classification.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <Button href="/app/tests" variant="primary" size="sm">
                          Practice Drill &rarr;
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                            <span>Mastery: {modelSummary.masteryScore}% • Verified Evidence ({modelSummary.evidenceCount})</span>
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
                  <span>Curriculum alignment: {boardName} {gradeName ? `Class ${gradeName}` : ''}</span>
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

      </div>
    </WorkspaceShell>
  );
}
