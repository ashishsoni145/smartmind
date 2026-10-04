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

  const firstName = user?.fullName?.split(' ')[0] || 'Learner';
  const greetingRef = React.useRef<string | null>(null);
  if (greetingRef.current === null) {
    const hour = new Date().getHours();
    greetingRef.current = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  }
  const greeting = greetingRef.current;
  const hasIdentity = Boolean(profile?.onboardingStatus.isCompleted);
  const contextLine = hasIdentity
    ? [boardName, gradeName && `Class ${gradeName}`, targetExamName]
        .filter(Boolean)
        .join(' · ')
    : 'Complete your academic identity to unlock personalized sequencing.';

  const completedTaskCount = dailyTasks.filter((t) => t.status === 'completed').length;

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Error Banner */}
        {fetchError && (
          <div className={styles.errorBanner} role="alert">
            <Icon name="info" size="sm" />
            <span>{fetchError}</span>
            <Button onClick={() => user?.id && loadProfileAndState(user.id)} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingSkeleton} role="status" aria-live="polite">
            <div className={styles.skeletonHeader}>
              <div className={styles.skeleton} style={{ width: '34%', height: '28px' }} />
              <div className={styles.skeleton} style={{ width: '52%', height: '14px' }} />
            </div>
            <div className={styles.skeleton} style={{ width: '100%', height: '148px' }} />
            <div className={styles.skeletonRow}>
              <div className={styles.skeleton} style={{ flex: 1, height: '88px' }} />
              <div className={styles.skeleton} style={{ flex: 1, height: '88px' }} />
              <div className={styles.skeleton} style={{ flex: 1, height: '88px' }} />
              <div className={styles.skeleton} style={{ flex: 1, height: '88px' }} />
            </div>
            <div className={styles.skeleton} style={{ width: '100%', height: '220px' }} />
            <p className={styles.loadingText}>Evaluating student model and real-time academic state…</p>
          </div>
        ) : (
          <>
            {/* ----------------------------------------------------------- */}
            {/* Command header — contextual greeting                        */}
            {/* ----------------------------------------------------------- */}
            <header className={styles.pageHeader}>
              <div>
                <h1 className={styles.greeting}>
                  {greeting}, {firstName}
                </h1>
                <p className={styles.greetingSub}>
                  {contextLine}
                  {hasIdentity && ' — here’s your academic state and the highest-leverage next step.'}
                </p>
              </div>
              <div className={styles.headerMeta}>
                <span className={styles.statusChip}>
                  <span
                    className={`${styles.statusDot} ${
                      modelSummary.status === 'calibrated' ? styles.statusDotOk : styles.statusDotIdle
                    }`}
                    aria-hidden="true"
                  />
                  {modelSummary.status === 'calibrated' ? 'Model calibrated' : 'Awaiting calibration'}
                </span>
                <span className={styles.statusChipMono}>{targetExamName}</span>
              </div>
            </header>

            {/* ----------------------------------------------------------- */}
            {/* Continue Learning — AI next-action surface                  */}
            {/* ----------------------------------------------------------- */}
            <section className={styles.nextActionHero} aria-labelledby="ai-next-action-heading">
              <div className={styles.heroTopRow}>
                <div className={styles.engineBadge}>
                  <span className={styles.pulseGreen} aria-hidden="true" />
                  <span>Next-Action Engine</span>
                </div>
                <span className={styles.priorityPill}>Priority 1 · High leverage</span>
              </div>

              {!isOnboardingComplete ? (
                <>
                  <div className={styles.heroMain}>
                    <h2 id="ai-next-action-heading" className={styles.heroTitle}>
                      Complete your academic identity calibration
                    </h2>
                    <p className={styles.heroDescription}>
                      SharpMind needs your target exam, syllabus board, and enrolled subjects before it can
                      sequence personalized practice questions.
                    </p>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/onboarding" variant="primary" size="lg">
                      Complete onboarding <Icon name="arrowRight" size="xs" />
                    </Button>
                  </div>
                </>
              ) : isDiagnosticPending || modelSummary.status === 'uncalibrated' ? (
                <>
                  <div className={styles.heroMain}>
                    <h2 id="ai-next-action-heading" className={styles.heroTitle}>
                      Take the SharpMind baseline diagnostic
                    </h2>
                    <p className={styles.heroDescription}>
                      Calibrate your baseline knowledge model across {boardName} {gradeName} ({targetExamName})
                      without guessing or fabricating initial mastery scores.
                    </p>
                  </div>
                  <div className={styles.reasonBox}>
                    <Icon name="lightbulb" size="sm" className={styles.reasonIcon} />
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next?</span> SharpMind refuses to
                      fabricate scores. A 5-question stratified diagnostic records authentic evidence to anchor
                      your mastery vector with explicit uncertainty tracking.
                    </div>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests?type=diagnostic" variant="primary" size="lg">
                      Launch baseline diagnostic <Icon name="arrowRight" size="xs" />
                    </Button>
                    <Button href="/app/tests" variant="outline" size="lg">
                      Open test runner
                    </Button>
                    <div className={styles.metaSpecs}>
                      <span>5 questions</span>
                      <span aria-hidden="true">·</span>
                      <span>≈ 15 min</span>
                      <span aria-hidden="true">·</span>
                      <span>Confidence-weighted</span>
                    </div>
                  </div>
                </>
              ) : topBacklog ? (
                <>
                  <div className={styles.heroMain}>
                    <div className={styles.heroSubjectRow}>
                      <span className={styles.heroSubjectChip}>
                        <Icon
                          name={SUBJECT_CATALOG[topBacklog.subject]?.icon || 'bookOpen'}
                          size="xs"
                        />
                        {SUBJECT_CATALOG[topBacklog.subject]?.name || topBacklog.subject}
                      </span>
                      <span className={styles.heroClassification}>
                        {topBacklog.classification.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 id="ai-next-action-heading" className={styles.heroTitle}>
                      {topBacklog.title}
                    </h2>
                    <p className={styles.heroDescription}>
                      Ranked #1 on your adaptive backlog — addressing this topic yields the highest expected
                      score increase for {targetExamName} before your next milestone.
                    </p>
                  </div>
                  <div className={styles.reasonBox}>
                    <Icon name="target" size="sm" className={styles.reasonIcon} />
                    <div className={styles.reasonText}>
                      <span className={styles.reasonHighlight}>Why this next?</span>{' '}
                      {topBacklog.reasons.join('. ') ||
                        `Identified as ${topBacklog.classification} with high weightage in ${targetExamName}.`}
                    </div>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Continue learning <Icon name="play" size="xs" />
                    </Button>
                    <Button
                      href={`/app/tutor?topic=${encodeURIComponent(topBacklog.title)}`}
                      variant="outline"
                      size="lg"
                    >
                      Ask the tutor
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.heroMain}>
                    <h2 id="ai-next-action-heading" className={styles.heroTitle}>
                      Study agenda clear &amp; on pace
                    </h2>
                    <p className={styles.heroDescription}>
                      All scheduled tasks and high-priority backlog items are mastered. Run a mock assessment or
                      explore advanced PYQ patterns.
                    </p>
                  </div>
                  <div className={styles.heroActionRow}>
                    <Button href="/app/tests" variant="primary" size="lg">
                      Take a full-length mock <Icon name="arrowRight" size="xs" />
                    </Button>
                  </div>
                </>
              )}
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Progress overview — real student model metrics              */}
            {/* ----------------------------------------------------------- */}
            <section aria-label="Student Model Summary Metrics" className={styles.metricsRibbon}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Mastery level</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>
                    {modelSummary.status === 'calibrated' ? `${modelSummary.masteryScore}%` : '—'}
                  </span>
                  <span className={styles.metricSubtext}>
                    {modelSummary.status === 'calibrated' ? 'calibrated' : 'uncalibrated'}
                  </span>
                </div>
                <span className={styles.metricBadge}>{modelSummary.masteredCount} mastered units</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Retention health</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>
                    {modelSummary.status === 'calibrated' ? `${modelSummary.retentionScore}%` : '—'}
                  </span>
                  <span className={styles.metricSubtext}>memory stability</span>
                </div>
                <span className={styles.metricBadge}>SM-2 decay</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Observed evidence</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>{modelSummary.evidenceCount}</span>
                  <span className={styles.metricSubtext}>attempts</span>
                </div>
                <span className={styles.metricBadge}>immutable log</span>
              </div>

              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Focus queue</span>
                <div className={styles.metricValueRow}>
                  <span className={styles.metricValue}>{backlogItems.length}</span>
                  <span className={styles.metricSubtext}>prioritized topics</span>
                </div>
                <span className={styles.metricBadge}>adaptive</span>
              </div>
            </section>

            {/* ----------------------------------------------------------- */}
            {/* Command grid — plan + backlog | revision + knowledge state  */}
            {/* ----------------------------------------------------------- */}
            <div className={styles.commandGrid}>
              <div className={styles.commandMain}>
                {/* Today's adaptive study plan */}
                <section aria-labelledby="planner-heading" className={styles.panelSection}>
                  <div className={styles.sectionHeader}>
                    <h3 id="planner-heading" className={styles.sectionTitle}>
                      Today&apos;s study plan
                    </h3>
                    <div className={styles.sectionHeaderRight}>
                      <span className={styles.sectionSubtitle}>
                        {dailyTasks.length > 0
                          ? `${completedTaskCount}/${dailyTasks.length} complete · ${planSessionInfo?.totalMinutes ?? 0} min`
                          : 'No tasks scheduled'}
                      </span>
                      <Button onClick={handleReplan} variant="outline" size="sm">
                        <Icon name="zap" size="xs" /> Replan
                      </Button>
                    </div>
                  </div>

                  <div className={styles.plannerSessionCard}>
                    <div className={styles.sessionHeaderRow}>
                      <div className={styles.sessionTimeSlot}>
                        <Icon name="clock" size="xs" />
                        <span>
                          {planSessionInfo ? `Study window ${planSessionInfo.timeSlot}` : 'Flexible daily study window'}
                        </span>
                      </div>
                      <span className={styles.sessionTaskCount}>
                        {dailyTasks.length > 0 ? `${dailyTasks.length} tasks` : '0 tasks'}
                      </span>
                    </div>

                    {dailyTasks.length === 0 ? (
                      <div className={styles.inlineEmpty}>
                        No tasks scheduled for today yet. Use <strong>Replan</strong> to generate today&apos;s
                        sequence from your backlog.
                      </div>
                    ) : (
                      <ul className={styles.taskList} role="list">
                        {dailyTasks.map((task) => (
                          <li
                            key={task.id}
                            className={`${styles.taskItem} ${
                              task.status === 'completed' ? styles.taskItemCompleted : ''
                            }`}
                          >
                            <div className={styles.taskMeta}>
                              <input
                                type="checkbox"
                                className={styles.taskCheckbox}
                                checked={task.status === 'completed'}
                                onChange={() => handleToggleTaskStatus(task.id, task.sessionId)}
                                aria-label={`Mark ${task.title} as completed`}
                              />
                              <div className={styles.taskTextCol}>
                                <strong className={styles.taskTitleInline}>{task.title}</strong>
                                <div className={styles.taskSubRow}>
                                  <span className={styles.taskSubjectTag}>{task.subject}</span>
                                  <span className={styles.taskDot} aria-hidden="true">·</span>
                                  <span className={styles.taskDuration}>{task.durationMinutes} min</span>
                                </div>
                              </div>
                            </div>

                            <span className={styles.taskTypeBadge}>
                              {task.taskType.replace(/_/g, ' ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>

                {/* Adaptive academic backlog */}
                <section aria-labelledby="backlog-heading" className={styles.panelSection}>
                  <div className={styles.sectionHeader}>
                    <h3 id="backlog-heading" className={styles.sectionTitle}>
                      Prioritized backlog
                    </h3>
                    <span className={styles.sectionSubtitle}>
                      Ordered by exam proximity, weakness &amp; weightage
                    </span>
                  </div>

                  {backlogItems.length === 0 ? (
                    <div className={styles.inlineEmpty}>
                      No backlog items found. Complete your initial diagnostic assessment to populate
                      prioritized topics.
                    </div>
                  ) : (
                    <div className={styles.backlogGrid}>
                      {backlogItems.map((item) => (
                        <div key={item.id} className={styles.backlogCard}>
                          <div className={styles.cardHeaderRow}>
                            <span className={styles.taskTypeBadge}>{item.subject}</span>
                            <span className={styles.priorityTag}>score {item.priorityScore}</span>
                          </div>
                          <div className={styles.cardBody}>
                            <h4 className={styles.taskTitle}>{item.title}</h4>
                            <div className={styles.reasonPillList}>
                              {item.reasons.map((r, idx) => (
                                <span key={idx} className={styles.reasonPill}>
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.cardFooter}>
                            <span
                              className={`${styles.classificationTag} ${
                                item.classification === 'weak' || item.classification === 'at_risk'
                                  ? styles.classificationWarn
                                  : ''
                              }`}
                            >
                              {item.classification.replace(/_/g, ' ')}
                            </span>
                            <Button href="/app/tests" variant="outline" size="sm">
                              Practice <Icon name="arrowRight" size="xs" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className={styles.commandSide}>
                {/* Spaced repetition due queue */}
                <section aria-labelledby="revision-heading" className={styles.panelSection}>
                  <div className={styles.sectionHeader}>
                    <h3 id="revision-heading" className={styles.sectionTitle}>
                      Revision queue
                    </h3>
                    <span className={styles.sectionSubtitle}>
                      {dueRevisions.length} due
                    </span>
                  </div>

                  {dueRevisions.length === 0 ? (
                    <div className={styles.inlineEmpty}>
                      All spaced revisions for today are complete — your memory decay curve is in optimal
                      shape.
                    </div>
                  ) : (
                    <div className={styles.revisionGrid}>
                      {dueRevisions.map((item) => (
                        <div key={item.id} className={styles.revisionCard}>
                          <div className={styles.revisionHead}>
                            <span className={styles.revisionSubject}>{item.subject}</span>
                            <span
                              className={`${styles.urgencyBadge} ${
                                item.urgency === 'high'
                                  ? styles.urgencyHigh
                                  : item.urgency === 'medium'
                                  ? styles.urgencyMedium
                                  : styles.urgencyNormal
                              }`}
                            >
                              {item.urgency}
                            </span>
                          </div>
                          <h4 className={styles.revisionTitle}>{item.title}</h4>
                          <p className={styles.revisionMeta}>
                            Retention {Math.round(item.retention * 100)}% · interval {item.intervalDays}d
                          </p>

                          <div className={styles.sm2ActionRow}>
                            <button
                              type="button"
                              className={`${styles.sm2Btn} ${styles.sm2BtnRecall}`}
                              onClick={() => handleReviewOutcome(item.id, 'recalled')}
                            >
                              Recalled
                            </button>
                            <button
                              type="button"
                              className={styles.sm2Btn}
                              onClick={() => handleReviewOutcome(item.id, 'partially_recalled')}
                            >
                              Hard
                            </button>
                            <button
                              type="button"
                              className={`${styles.sm2Btn} ${styles.sm2BtnForgot}`}
                              onClick={() => handleReviewOutcome(item.id, 'forgot')}
                            >
                              Forgot
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Knowledge state matrix */}
                <section aria-labelledby="matrix-heading" className={styles.panelSection}>
                  <div className={styles.sectionHeader}>
                    <h3 id="matrix-heading" className={styles.sectionTitle}>
                      Knowledge state
                    </h3>
                    <span className={styles.sectionSubtitle}>Truth in data</span>
                  </div>

                  <div className={styles.matrixCard}>
                    <div className={styles.matrixGrid}>
                      {enrolledSubjectIds.map((subId) => {
                        const info = SUBJECT_CATALOG[subId] || {
                          id: subId,
                          name: subId,
                          icon: 'bookOpen' as IconName,
                        };
                        return (
                          <div key={subId} className={styles.subjectCard}>
                            <div className={styles.subjectTop}>
                              <span className={styles.subjectName}>
                                <Icon name={info.icon} size="sm" />
                                <span>{info.name}</span>
                              </span>
                              <span
                                className={`${styles.subjectStatus} ${
                                  modelSummary.status === 'calibrated'
                                    ? styles.statusCalibrated
                                    : styles.statusUncalibrated
                                }`}
                              >
                                {modelSummary.status === 'calibrated' ? 'Calibrated' : 'Pending baseline'}
                              </span>
                            </div>
                            <div className={styles.subjectProgress}>
                              {modelSummary.status === 'calibrated' ? (
                                <span>
                                  Mastery {modelSummary.masteryScore}% · {modelSummary.evidenceCount} evidence
                                </span>
                              ) : (
                                <span>Awaiting diagnostic submission</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={styles.matrixFooter}>
                      <span>
                        Alignment: {boardName} {gradeName ? `Class ${gradeName}` : ''}
                      </span>
                      <Link href="/onboarding" className={styles.matrixFooterLink}>
                        Edit subjects <Icon name="arrowRight" size="xs" />
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* Study mode launchers                                        */}
            {/* ----------------------------------------------------------- */}
            <section aria-labelledby="modes-heading" className={styles.panelSection}>
              <div className={styles.sectionHeader}>
                <h3 id="modes-heading" className={styles.sectionTitle}>
                  Study modes
                </h3>
                <span className={styles.sectionSubtitle}>Instant access to active learning environments</span>
              </div>

              <div className={styles.modesGrid}>
                <Link href="/app/tutor" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="tutor" size="md" />
                  </span>
                  <div className={styles.modeText}>
                    <h4 className={styles.modeTitle}>AI Socratic Tutor</h4>
                    <p className={styles.modeDesc}>
                      Step-by-step guidance that helps you deduce concepts rather than handing you raw answers.
                    </p>
                  </div>
                  <span className={styles.modeCta}>
                    Launch <Icon name="arrowRight" size="xs" />
                  </span>
                </Link>

                <Link href="/app/focus" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="focus" size="md" />
                  </span>
                  <div className={styles.modeText}>
                    <h4 className={styles.modeTitle}>Deep Focus Mode</h4>
                    <p className={styles.modeDesc}>
                      Distraction-free 25m and 50m Pomodoro blocks with session telemetry.
                    </p>
                  </div>
                  <span className={styles.modeCta}>
                    Open timer <Icon name="arrowRight" size="xs" />
                  </span>
                </Link>

                <Link href="/app/tests" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="tests" size="md" />
                  </span>
                  <div className={styles.modeText}>
                    <h4 className={styles.modeTitle}>Diagnostic Engine</h4>
                    <p className={styles.modeDesc}>
                      Timed practice tests and NTA-compliant past paper simulations.
                    </p>
                  </div>
                  <span className={styles.modeCta}>
                    Explore <Icon name="arrowRight" size="xs" />
                  </span>
                </Link>

                <Link href="/app/mistakes" className={styles.modeCard}>
                  <span className={styles.modeIcon} aria-hidden="true">
                    <Icon name="mistakes" size="md" />
                  </span>
                  <div className={styles.modeText}>
                    <h4 className={styles.modeTitle}>Mistake Notebook</h4>
                    <p className={styles.modeDesc}>
                      Categorized review of questions answered incorrectly with retry schedules.
                    </p>
                  </div>
                  <span className={styles.modeCta}>
                    Review <Icon name="arrowRight" size="xs" />
                  </span>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </WorkspaceShell>
  );
}
