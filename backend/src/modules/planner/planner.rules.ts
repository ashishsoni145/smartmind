// =============================================================================
// Planner Rules — Deterministic session planning and rescheduling logic
// =============================================================================

import type { PlanTask, PlanSessionType } from '@sharpmind/types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export const DEFAULT_SESSION_MINUTES = 45;
export const MIN_SESSION_MINUTES = 20;
export const MAX_SESSION_MINUTES = 120;
export const MAX_DAILY_SESSIONS = 6;

/** Preferred study time → suggested start times */
export const STUDY_TIME_SLOTS: Record<string, { start: string; end: string }> = {
  early_morning: { start: '05:00', end: '08:00' },
  morning: { start: '08:00', end: '12:00' },
  afternoon: { start: '13:00', end: '17:00' },
  evening: { start: '17:00', end: '21:00' },
  night: { start: '21:00', end: '00:00' },
};

// ---------------------------------------------------------------------------
// Task Fitting
// ---------------------------------------------------------------------------

export interface TaskCandidate {
  id: string;
  title: string;
  taskType: string;
  curriculumNodeId?: string;
  conceptId?: string;
  subjectId?: string;
  estimatedMinutes: number;
  priority: string;
  explanation?: string;
}

/**
 * Fit tasks into available time slots using greedy priority-first approach.
 * Returns tasks that fit and tasks that don't.
 */
export function fitTasksIntoSlots(
  tasks: TaskCandidate[],
  availableMinutes: number,
  maxSessionMinutes: number = DEFAULT_SESSION_MINUTES
): { fitted: TaskCandidate[]; overflow: TaskCandidate[] } {
  const fitted: TaskCandidate[] = [];
  const overflow: TaskCandidate[] = [];
  let remaining = availableMinutes;

  // Tasks should already be priority-sorted
  for (const task of tasks) {
    const duration = Math.min(task.estimatedMinutes, maxSessionMinutes);
    if (duration <= remaining) {
      fitted.push({ ...task, estimatedMinutes: duration });
      remaining -= duration;
    } else if (remaining >= MIN_SESSION_MINUTES) {
      // Partial fit: squeeze in a shorter version
      fitted.push({ ...task, estimatedMinutes: remaining });
      remaining = 0;
    } else {
      overflow.push(task);
    }
  }

  return { fitted, overflow };
}

/**
 * Distribute tasks across a week's days, respecting daily capacities.
 * Spreads subjects across days for variety.
 */
export function distributeAcrossWeek(
  tasks: TaskCandidate[],
  dailyCapacities: number[] // Minutes available each day (7 entries)
): TaskCandidate[][] {
  const weekPlan: TaskCandidate[][] = Array.from({ length: 7 }, () => []);
  const remaining = [...tasks];
  const dailyRemaining = [...dailyCapacities];

  // Track which subjects appear on which days for variety
  const daySubjects: Set<string>[] = Array.from({ length: 7 }, () => new Set());

  for (const task of remaining) {
    // Find the best day: has capacity and doesn't already have this subject
    let bestDay = -1;
    let bestScore = -Infinity;

    for (let d = 0; d < 7; d++) {
      if (dailyRemaining[d] < MIN_SESSION_MINUTES) continue;
      if (dailyRemaining[d] < task.estimatedMinutes && dailyRemaining[d] < MIN_SESSION_MINUTES) continue;

      let score = dailyRemaining[d]; // Prefer days with more capacity
      if (task.subjectId && daySubjects[d].has(task.subjectId)) {
        score -= 60; // Penalize same subject on same day
      }

      if (score > bestScore) {
        bestScore = score;
        bestDay = d;
      }
    }

    if (bestDay >= 0) {
      const duration = Math.min(task.estimatedMinutes, dailyRemaining[bestDay]);
      weekPlan[bestDay].push({ ...task, estimatedMinutes: duration });
      dailyRemaining[bestDay] -= duration;
      if (task.subjectId) daySubjects[bestDay].add(task.subjectId);
    }
  }

  return weekPlan;
}

/**
 * Handle missed/skipped tasks: triage and redistribute.
 * Critical items (deadline-sensitive, at_risk) are rescheduled immediately.
 * Low-priority missed items can be deprioritized.
 */
export function handleMissedWork(
  missedTasks: TaskCandidate[],
  remainingCapacityMinutes: number
): { rescheduled: TaskCandidate[]; dropped: TaskCandidate[] } {
  // Sort by priority: critical first
  const sorted = [...missedTasks].sort((a, b) => {
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
  });

  const rescheduled: TaskCandidate[] = [];
  const dropped: TaskCandidate[] = [];
  let remaining = remainingCapacityMinutes;

  for (const task of sorted) {
    if (remaining >= MIN_SESSION_MINUTES) {
      const duration = Math.min(task.estimatedMinutes, remaining);
      rescheduled.push({ ...task, estimatedMinutes: duration });
      remaining -= duration;
    } else {
      // Can't fit — if critical, mark for next day; otherwise deprioritize
      if (task.priority === 'critical' || task.priority === 'high') {
        rescheduled.push(task); // Force reschedule even if over capacity
      } else {
        dropped.push(task);
      }
    }
  }

  return { rescheduled, dropped };
}

/**
 * Determine the session type based on its tasks.
 */
export function determineSessionType(tasks: TaskCandidate[]): PlanSessionType {
  if (tasks.length === 0) return 'study';

  const categoryMap: Record<string, PlanSessionType> = {
    spaced_revision: 'revision',
    revision_drill: 'revision',
    mock_test: 'test',
    chapter_test: 'test',
    practice_drill: 'practice',
    mistake_analysis: 'review',
    learn_concept: 'study',
  };

  const categories = new Set(tasks.map((t) => categoryMap[t.taskType] || 'study'));

  if (categories.size > 1) return 'mixed';
  return categories.values().next().value || 'study';
}

/**
 * Generate a human-readable explanation for a study session.
 */
export function generateSessionExplanation(
  tasks: TaskCandidate[],
  sessionDate: string
): string {
  if (tasks.length === 0) return 'No tasks scheduled.';

  const subjects = [...new Set(tasks.map((t) => t.subjectId).filter(Boolean))];
  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const types = [...new Set(tasks.map((t) => t.taskType))];

  const typeLabels: Record<string, string> = {
    learn_concept: 'learning',
    practice_drill: 'practice',
    mock_test: 'testing',
    spaced_revision: 'revision',
    mistake_analysis: 'mistake review',
  };

  const activities = types.map((t) => typeLabels[t] || t).join(', ');

  return `${totalMinutes} min session covering ${subjects.join(', ')} — ${activities}. ${tasks.length} task(s) prioritized by your backlog.`;
}

/**
 * Compute start/end times for a session given preferences.
 */
export function computeSessionTimes(
  preferredStudyTime: string,
  sessionIndex: number,
  durationMinutes: number
): { startTime: string; endTime: string } {
  const slot = STUDY_TIME_SLOTS[preferredStudyTime] || STUDY_TIME_SLOTS.evening;
  const [startHour, startMin] = slot.start.split(':').map(Number);

  // Offset each session by its index * (duration + 15 min break)
  const offsetMinutes = sessionIndex * (durationMinutes + 15);
  const totalStartMinutes = startHour * 60 + startMin + offsetMinutes;

  const sh = Math.floor(totalStartMinutes / 60) % 24;
  const sm = totalStartMinutes % 60;
  const endTotal = totalStartMinutes + durationMinutes;
  const eh = Math.floor(endTotal / 60) % 24;
  const em = endTotal % 60;

  return {
    startTime: `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`,
    endTime: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
  };
}
