'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/lib/auth/auth-context';
import { apiClient } from '@/lib/api-client';
import styles from './planner.module.css';

interface PlanTaskItem {
  id: string;
  sessionId: string;
  title: string;
  subjectId: string;
  taskType: string;
  estimatedMinutes: number;
  priority: string;
  status: string;
  explanation?: string;
}

interface PlanSessionItem {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  sessionType: string;
  explanation: string;
  tasks: PlanTaskItem[];
}

interface DailyPlanData {
  date: string;
  sessions: PlanSessionItem[];
  totalMinutes: number;
  taskCount: number;
  explanation?: string;
}

interface WeeklyPlanData {
  weekStartDate: string;
  days: DailyPlanData[];
  totalMinutes: number;
  totalTasks: number;
  explanation?: string;
}

export default function PlannerPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');
  const [todayPlan, setTodayPlan] = useState<DailyPlanData | null>(null);
  const [weekPlan, setWeekPlan] = useState<WeeklyPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [replanning, setReplanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPlannerData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      if (viewMode === 'today') {
        const plan = await apiClient.planner.getToday(user.id);
        if (plan) {
          const sessions: PlanSessionItem[] = (plan.sessions || []).map((s: any) => ({
            id: s.id,
            sessionDate: s.sessionDate || s.session_date,
            startTime: s.startTime || s.start_time || '09:00',
            endTime: s.endTime || s.end_time || '11:00',
            durationMinutes: s.durationMinutes || s.duration_minutes || 120,
            sessionType: s.sessionType || s.session_type || 'deep_work',
            explanation: s.explanation || '',
            tasks: (s.tasks || []).map((t: any) => ({
              id: t.id,
              sessionId: s.id,
              title: t.title,
              subjectId: t.subjectId || t.subject_id || 'General',
              taskType: t.taskType || t.task_type || 'practice_drill',
              estimatedMinutes: t.estimatedMinutes || t.estimated_minutes || 30,
              priority: t.priority || 'medium',
              status: t.status || 'pending',
              explanation: t.explanation,
            })),
          }));

          setTodayPlan({
            date: plan.date,
            sessions,
            totalMinutes: plan.totalMinutes || 0,
            taskCount: plan.taskCount || 0,
            explanation: plan.explanation,
          });
        } else {
          setTodayPlan(null);
        }
      } else {
        const week = await apiClient.planner.getWeek(user.id);
        if (week) {
          const days: DailyPlanData[] = (week.days || []).map((d: any) => ({
            date: d.date,
            sessions: (d.sessions || []).map((s: any) => ({
              id: s.id,
              sessionDate: s.sessionDate || s.session_date,
              startTime: s.startTime || s.start_time,
              endTime: s.endTime || s.end_time,
              durationMinutes: s.durationMinutes || s.duration_minutes,
              sessionType: s.sessionType || s.session_type,
              explanation: s.explanation,
              tasks: (s.tasks || []).map((t: any) => ({
                id: t.id,
                sessionId: s.id,
                title: t.title,
                subjectId: t.subjectId || t.subject_id,
                taskType: t.taskType || t.task_type,
                estimatedMinutes: t.estimatedMinutes || t.estimated_minutes,
                priority: t.priority,
                status: t.status,
              })),
            })),
            totalMinutes: d.totalMinutes || 0,
            taskCount: d.taskCount || 0,
          }));

          setWeekPlan({
            weekStartDate: week.weekStartDate,
            days,
            totalMinutes: week.totalMinutes || 0,
            totalTasks: week.totalTasks || 0,
            explanation: week.explanation,
          });
        } else {
          setWeekPlan(null);
        }
      }
    } catch (err: any) {
      console.error('Failed to load study plan:', err);
      setErrorMsg('Could not sync with Adaptive Planner. Please check backend connectivity.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, viewMode]);

  useEffect(() => {
    loadPlannerData();
  }, [loadPlannerData]);

  const handleToggleTask = async (sessionId: string, taskId: string, currentStatus: string) => {
    if (!user?.id) return;
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    // Optimistically update today's plan
    if (todayPlan) {
      setTodayPlan({
        ...todayPlan,
        sessions: todayPlan.sessions.map((sess) => {
          if (sess.id !== sessionId) return sess;
          return {
            ...sess,
            tasks: sess.tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
          };
        }),
      });
    }

    try {
      await apiClient.planner.updateTask(user.id, sessionId, taskId, nextStatus);
    } catch (err) {
      console.error('Failed to update task status on backend:', err);
      loadPlannerData();
    }
  };

  const handleReplan = async () => {
    if (!user?.id) return;
    setReplanning(true);
    setErrorMsg(null);

    try {
      await apiClient.planner.replan(user.id);
      await loadPlannerData();
    } catch (err: any) {
      console.error('Failed to execute replan:', err);
      setErrorMsg(`Replan failed: ${err.message || 'Server error'}.`);
    } finally {
      setReplanning(false);
    }
  };

  const totalTasksToday = todayPlan?.sessions?.reduce((acc, s) => acc + s.tasks.length, 0) || 0;
  const completedTasksToday =
    todayPlan?.sessions?.reduce(
      (acc, s) => acc + s.tasks.filter((t) => t.status === 'completed').length,
      0
    ) || 0;

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleWithIcon}>
            <div className={styles.pageIcon}>
              <Icon name="calendar" size="md" />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Adaptive Study Planner & Agenda</h1>
              <p className={styles.pageSubtitle}>
                Dynamic scheduling balancing syllabus coverage, spaced revisions, and practice drills against your available daily study hours.
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.tabToggle}>
              <button
                className={`${styles.tabBtn} ${viewMode === 'today' ? styles.tabBtnActive : ''}`}
                onClick={() => setViewMode('today')}
              >
                Today&apos;s Agenda
              </button>
              <button
                className={`${styles.tabBtn} ${viewMode === 'week' ? styles.tabBtnActive : ''}`}
                onClick={() => setViewMode('week')}
              >
                Weekly Matrix
              </button>
            </div>

            <button
              className={styles.replanBtn}
              onClick={handleReplan}
              disabled={replanning || loading}
            >
              <Icon name="zap" size="xs" />
              {replanning ? 'Replanning...' : 'Replan Missed Work'}
            </button>
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
              onClick={loadPlannerData}
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
            <span className={styles.metricLabel}>
              {viewMode === 'today' ? 'TASKS SCHEDULED TODAY' : 'WEEKLY TOTAL TASKS'}
            </span>
            <div className={styles.metricValue}>
              {viewMode === 'today' ? totalTasksToday : weekPlan?.totalTasks || 0}
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>
              {viewMode === 'today' ? 'COMPLETED TODAY' : 'WEEKLY STUDY TIME'}
            </span>
            <div className={styles.metricValue} style={{ color: '#34d399' }}>
              {viewMode === 'today'
                ? `${completedTasksToday} / ${totalTasksToday}`
                : `${Math.round(((weekPlan?.totalMinutes || 0) / 60) * 10) / 10}h`}
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>PACING STATUS</span>
            <div className={styles.metricValue} style={{ fontSize: '1.125rem', color: '#38bdf8' }}>
              {completedTasksToday === totalTasksToday && totalTasksToday > 0
                ? 'All Tasks Done'
                : 'Balanced Cadence'}
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>ALGORITHM</span>
            <div className={styles.metricValue} style={{ fontSize: '1.125rem', color: '#a855f7' }}>
              Knapsack Fitted
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Generating dynamic study schedule from backlog priorities...
          </div>
        ) : viewMode === 'today' ? (
          /* Today View */
          !todayPlan || todayPlan.sessions.length === 0 ? (
            <div style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--color-text-secondary)',
            }}>
              <span className="empty-icon"><Icon name="calendar" size="lg" /></span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.75rem' }}>
                No Study Sessions Scheduled for Today
              </h3>
              <p style={{ fontSize: '0.875rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem auto', lineHeight: 1.6 }}>
                Click &quot;Replan Missed Work&quot; to synthesize today&apos;s sequence from your prioritized learning backlog and due revisions.
              </p>
              <button
                className={styles.replanBtn}
                onClick={handleReplan}
                disabled={replanning}
              >
                <Icon name="zap" size="xs" />
                {replanning ? 'Synthesizing...' : 'Generate Today\'s Plan Now'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {todayPlan.sessions.map((session, sIdx) => (
                <div key={session.id} className={styles.sessionCard}>
                  <div className={styles.sessionHeaderRow}>
                    <div className={styles.sessionTimeSlot}>
                      <span className="banner-inline"><Icon name="clock" size="xs" /> Block {sIdx + 1}: {session.startTime} – {session.endTime}</span>
                    </div>
                    <span className={styles.sessionMeta}>
                      {session.durationMinutes} Mins Allocated • {session.tasks.length} Tasks
                    </span>
                  </div>

                  {session.explanation && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                      &ldquo;{session.explanation}&rdquo;
                    </p>
                  )}

                  <div className={styles.taskList}>
                    {session.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`${styles.taskItem} ${task.status === 'completed' ? styles.taskItemCompleted : ''}`}
                      >
                        <div className={styles.taskMeta}>
                          <input
                            type="checkbox"
                            className={styles.taskCheckbox}
                            checked={task.status === 'completed'}
                            onChange={() => handleToggleTask(session.id, task.id, task.status)}
                            aria-label={`Mark ${task.title} as completed`}
                          />
                          <div>
                            <strong style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                              {task.title}
                            </strong>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                                {task.subjectId}
                              </span>
                              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>•</span>
                              <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                                {task.estimatedMinutes} min
                              </span>
                              {task.explanation && (
                                <>
                                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>•</span>
                                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                                    {task.explanation}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={styles.taskBadge}>
                            {task.taskType.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <Link
                            href={task.taskType.includes('revision') ? '/app/revision' : '/app/tests'}
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-accent)',
                              textDecoration: 'underline',
                              fontWeight: 500,
                            }}
                          >
                            Launch &rarr;
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Weekly Matrix View */
          !weekPlan || weekPlan.days.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No weekly schedule found.
            </div>
          ) : (
            <div className={styles.weekGrid}>
              {weekPlan.days.map((day) => {
                const dayDateObj = new Date(day.date);
                const dayName = dayDateObj.toLocaleDateString(undefined, { weekday: 'short' });
                const dayDateNum = dayDateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                const allTasks = day.sessions.flatMap((s) => s.tasks);

                return (
                  <div key={day.date} className={styles.dayColumn}>
                    <div className={styles.dayHeader}>
                      <span className={styles.dayName}>{dayName}</span>
                      <span className={styles.dayDate}>{dayDateNum}</span>
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(day.totalMinutes / 60)}h • {allTasks.length} tasks
                    </div>

                    {allTasks.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', padding: '0.5rem 0' }}>
                        Rest / Open buffer
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {allTasks.map((t) => (
                          <div key={t.id} className={styles.dayTaskMini}>
                            <strong style={{ display: 'block', color: '#ffffff' }}>{t.title}</strong>
                            <span style={{ fontSize: '0.6875rem', color: '#38bdf8' }}>{t.subjectId}</span>
                            <span style={{ fontSize: '0.6875rem', color: '#64748b' }}> • {t.estimatedMinutes}m</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </WorkspaceShell>
  );
}
