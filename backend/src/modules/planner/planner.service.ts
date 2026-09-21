import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import type { DailyPlan, WeeklyPlan, PlanSession, PlanTask } from '@sharpmind/types';
import { BacklogService } from '../backlog/backlog.service';
import {
  fitTasksIntoSlots,
  distributeAcrossWeek,
  handleMissedWork,
  determineSessionType,
  generateSessionExplanation,
  computeSessionTimes,
  DEFAULT_SESSION_MINUTES,
  MAX_DAILY_SESSIONS,
  type TaskCandidate,
} from './planner.rules';

// =============================================================================
// PlannerService — Converts prioritized backlog into feasible study sessions
// =============================================================================

export class PlannerService {
  /**
   * Generate a daily plan for a specific date.
   */
  public static async generateDailyPlan(
    studentId: string,
    date?: string
  ): Promise<DailyPlan> {
    const targetDate = date || new Date().toISOString().split('T')[0];

    // 1. Get student preferences
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('daily_available_hours, preferred_study_time')
      .eq('id', studentId)
      .maybeSingle();

    if (!profile) throw new NotFoundError('Student profile not found');

    const availableMinutes = (Number(profile.daily_available_hours) || 3) * 60;
    const preferredTime = profile.preferred_study_time || 'evening';

    // 2. Ensure backlog exists
    const backlogResult = await BacklogService.getBacklog(studentId, { page: 1, limit: 50 });
    if (backlogResult.total === 0) {
      // Generate backlog if empty
      await BacklogService.generateBacklog(studentId);
    }

    // 3. Get top-priority backlog items
    const { data: backlogItems } = await supabase
      .from('backlog_items')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .order('priority_rank', { ascending: true })
      .limit(20);

    // 4. Convert to task candidates
    const candidates: TaskCandidate[] = (backlogItems || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      taskType: mapClassificationToTaskType(item.classification),
      curriculumNodeId: item.curriculum_node_id,
      subjectId: item.subject_id,
      estimatedMinutes: Number(item.estimated_minutes) || DEFAULT_SESSION_MINUTES,
      priority: item.classification === 'at_risk' ? 'critical' :
                item.classification === 'overdue' ? 'high' :
                item.classification === 'weak' ? 'high' : 'medium',
      explanation: (item.priority_reasons || [])
        .slice(0, 2)
        .map((r: any) => r.explanation)
        .join('; '),
    }));

    // 5. Check for missed work from previous days
    const { data: missedSessions } = await supabase
      .from('plan_sessions')
      .select('tasks')
      .eq('student_id', studentId)
      .eq('status', 'skipped')
      .lt('session_date', targetDate)
      .limit(5);

    if (missedSessions && missedSessions.length > 0) {
      const missedTasks: TaskCandidate[] = [];
      for (const session of missedSessions) {
        const tasks = (session.tasks as any[]) || [];
        for (const t of tasks) {
          missedTasks.push({
            id: t.id || `missed-${Math.random().toString(36).slice(2)}`,
            title: `[Catch-up] ${t.title}`,
            taskType: t.taskType || 'learn_concept',
            curriculumNodeId: t.curriculumNodeId,
            subjectId: t.subjectId,
            estimatedMinutes: Math.min(t.estimatedMinutes || 30, 30), // Compress missed work
            priority: 'high',
            explanation: 'Rescheduled from missed session',
          });
        }
      }

      const { rescheduled } = handleMissedWork(missedTasks, availableMinutes * 0.3);
      candidates.unshift(...rescheduled);
    }

    // 6. Fit tasks into available time
    const { fitted } = fitTasksIntoSlots(candidates, availableMinutes, DEFAULT_SESSION_MINUTES);

    // 7. Group into sessions (max MAX_DAILY_SESSIONS)
    const sessions: PlanSession[] = [];
    const sessionSize = Math.max(1, Math.ceil(fitted.length / MAX_DAILY_SESSIONS));

    // Clean up any prior unstarted scheduled sessions for this date to guarantee zero duplicate sessions
    await supabase
      .from('plan_sessions')
      .delete()
      .eq('student_id', studentId)
      .eq('session_date', targetDate)
      .eq('status', 'scheduled');

    for (let i = 0; i < fitted.length; i += sessionSize) {
      const sessionTasks = fitted.slice(i, i + sessionSize);
      const totalMinutes = sessionTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
      const sessionIndex = sessions.length;
      const { startTime, endTime } = computeSessionTimes(preferredTime, sessionIndex, totalMinutes);
      const sessionType = determineSessionType(sessionTasks);
      const explanation = generateSessionExplanation(sessionTasks, targetDate);

      const planTasks: PlanTask[] = sessionTasks.map((t) => ({
        id: t.id,
        title: t.title,
        taskType: t.taskType,
        curriculumNodeId: t.curriculumNodeId,
        subjectId: t.subjectId,
        estimatedMinutes: t.estimatedMinutes,
        priority: t.priority,
        status: 'pending',
        explanation: t.explanation,
      }));

      // Upsert into plan_sessions
      const { data: sessionRow } = await supabase
        .from('plan_sessions')
        .insert({
          student_id: studentId,
          session_date: targetDate,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: totalMinutes,
          tasks: planTasks,
          status: 'scheduled',
          explanation,
          session_type: sessionType,
        })
        .select('*')
        .single();

      if (sessionRow) {
        sessions.push(mapPlanSessionRow(sessionRow));
      }
    }

    const totalMinutes = sessions.reduce((s, sess) => s + sess.durationMinutes, 0);

    return {
      date: targetDate,
      sessions,
      totalMinutes,
      taskCount: fitted.length,
      explanation: `${sessions.length} session(s) planned for ${totalMinutes} minutes total.`,
    };
  }

  /** Get today's plan (existing or generated). */
  public static async getToday(studentId: string): Promise<DailyPlan> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDayPlan(studentId, today);
  }

  /** Get tomorrow's plan. */
  public static async getTomorrow(studentId: string): Promise<DailyPlan> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getDayPlan(studentId, tomorrow.toISOString().split('T')[0]);
  }

  /** Get this week's plan. */
  public static async getThisWeek(studentId: string): Promise<WeeklyPlan> {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek + 1); // Monday

    const days: DailyPlan[] = [];
    let totalMinutes = 0;
    let totalTasks = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayPlan = await this.getDayPlan(studentId, dateStr);
      days.push(dayPlan);
      totalMinutes += dayPlan.totalMinutes;
      totalTasks += dayPlan.taskCount;
    }

    return {
      weekStartDate: weekStart.toISOString().split('T')[0],
      days,
      totalMinutes,
      totalTasks,
      explanation: `Week plan: ${totalTasks} tasks across ${totalMinutes} minutes.`,
    };
  }

  /** Re-plan from a given date — handles missed work intelligently. */
  public static async replan(studentId: string, fromDate?: string): Promise<DailyPlan> {
    const startDate = fromDate || new Date().toISOString().split('T')[0];

    // Mark existing scheduled sessions as rescheduled
    await supabase
      .from('plan_sessions')
      .update({ status: 'rescheduled' })
      .eq('student_id', studentId)
      .eq('session_date', startDate)
      .eq('status', 'scheduled');

    // Regenerate backlog to get fresh priorities
    await BacklogService.generateBacklog(studentId);

    // Generate fresh daily plan
    return this.generateDailyPlan(studentId, startDate);
  }

  /** Mark a plan task as completed or skipped. */
  public static async updateTaskStatus(
    sessionId: string,
    taskId: string,
    status: string
  ): Promise<PlanSession> {
    const { data: session, error } = await supabase
      .from('plan_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error || !session) throw new NotFoundError('Plan session not found');

    const tasks = (session.tasks as any[]) || [];
    const updatedTasks = tasks.map((t: any) => {
      if (t.id === taskId) return { ...t, status };
      return t;
    });

    // Check if all tasks are completed
    const allComplete = updatedTasks.every((t: any) => t.status === 'completed' || t.status === 'skipped');
    const sessionStatus = allComplete ? 'completed' : 'in_progress';

    const { data: updated, error: updateError } = await supabase
      .from('plan_sessions')
      .update({
        tasks: updatedTasks,
        status: sessionStatus,
        ...(allComplete ? { completed_at: new Date().toISOString() } : {}),
      })
      .eq('id', sessionId)
      .select('*')
      .single();

    if (updateError || !updated) throw new BadRequestError(`Update failed: ${updateError?.message}`);

    return mapPlanSessionRow(updated);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static async getDayPlan(studentId: string, date: string): Promise<DailyPlan> {
    // Check for existing sessions
    const { data: sessions } = await supabase
      .from('plan_sessions')
      .select('*')
      .eq('student_id', studentId)
      .eq('session_date', date)
      .in('status', ['scheduled', 'in_progress', 'completed'])
      .order('start_time', { ascending: true });

    if (sessions && sessions.length > 0) {
      const mapped = sessions.map(mapPlanSessionRow);
      const totalMinutes = mapped.reduce((s, sess) => s + sess.durationMinutes, 0);
      const taskCount = mapped.reduce((s, sess) => s + sess.tasks.length, 0);

      return {
        date,
        sessions: mapped,
        totalMinutes,
        taskCount,
        explanation: `${mapped.length} session(s), ${totalMinutes} min total.`,
      };
    }

    // No existing plan — generate one
    return this.generateDailyPlan(studentId, date);
  }
}

// =============================================================================
// Helpers
// =============================================================================

function mapClassificationToTaskType(classification: string): string {
  switch (classification) {
    case 'unstarted': return 'learn_concept';
    case 'in_progress': return 'learn_concept';
    case 'weak': return 'practice_drill';
    case 'revision_due': return 'spaced_revision';
    case 'overdue': return 'spaced_revision';
    case 'at_risk': return 'practice_drill';
    default: return 'learn_concept';
  }
}

function mapPlanSessionRow(row: any): PlanSession {
  return {
    id: row.id,
    studentId: row.student_id,
    planId: row.plan_id || null,
    sessionDate: row.session_date,
    startTime: row.start_time || null,
    endTime: row.end_time || null,
    durationMinutes: Number(row.duration_minutes) || 0,
    tasks: (row.tasks as PlanTask[]) || [],
    status: row.status,
    explanation: row.explanation || null,
    sessionType: row.session_type || 'study',
    completedAt: row.completed_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
