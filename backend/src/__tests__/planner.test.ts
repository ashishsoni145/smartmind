import { describe, it, expect } from 'vitest';
import {
  fitTasksIntoSlots,
  distributeAcrossWeek,
  handleMissedWork,
  determineSessionType,
  generateSessionExplanation,
  computeSessionTimes,
  STUDY_TIME_SLOTS,
  MIN_SESSION_MINUTES,
  type TaskCandidate,
} from '../modules/planner/planner.rules';
import {
  plannerDateSchema,
  replanSchema,
  updateTaskSchema,
} from '../modules/planner/planner.schema';

describe('Adaptive Planner — Rules, Scheduling & Rescheduling Logic', () => {
  const sampleTasks: TaskCandidate[] = [
    {
      id: 'task-1',
      title: 'Laws of Motion Practice',
      taskType: 'practice_drill',
      subjectId: 'physics',
      estimatedMinutes: 30,
      priority: 'critical',
    },
    {
      id: 'task-2',
      title: 'Thermodynamics Revision',
      taskType: 'spaced_revision',
      subjectId: 'physics',
      estimatedMinutes: 25,
      priority: 'high',
    },
    {
      id: 'task-3',
      title: 'Organic Chemistry Basics',
      taskType: 'learn_concept',
      subjectId: 'chemistry',
      estimatedMinutes: 40,
      priority: 'medium',
    },
    {
      id: 'task-4',
      title: 'Calculus Drill',
      taskType: 'practice_drill',
      subjectId: 'mathematics',
      estimatedMinutes: 30,
      priority: 'low',
    },
  ];

  describe('fitTasksIntoSlots', () => {
    it('fits tasks that fit within available time and overflows the rest', () => {
      // 55 minutes available: should fit task-1 (30m) and task-2 (25m), total 55m
      const { fitted, overflow } = fitTasksIntoSlots(sampleTasks, 55);

      expect(fitted.length).toBe(2);
      expect(fitted.map((t) => t.id)).toEqual(['task-1', 'task-2']);
      expect(overflow.length).toBe(2);
      expect(overflow.map((t) => t.id)).toEqual(['task-3', 'task-4']);
    });

    it('squeezes partial fit when remaining minutes >= MIN_SESSION_MINUTES', () => {
      // 50 minutes available: fits task-1 (30m) -> 20m left. Task-2 (25m) fits partially with 20m.
      const { fitted, overflow } = fitTasksIntoSlots(sampleTasks, 50);

      expect(fitted.length).toBe(2);
      expect(fitted[0].estimatedMinutes).toBe(30);
      expect(fitted[1].estimatedMinutes).toBe(20);
      expect(overflow.length).toBe(2);
    });

    it('overflows task when remaining minutes < MIN_SESSION_MINUTES', () => {
      // 35 minutes available: task-1 takes 30m -> 5m left (< MIN_SESSION_MINUTES)
      const { fitted, overflow } = fitTasksIntoSlots(sampleTasks, 35);

      expect(fitted.length).toBe(1);
      expect(fitted[0].id).toBe('task-1');
      expect(overflow.length).toBe(3);
    });
  });

  describe('distributeAcrossWeek', () => {
    it('distributes tasks across 7 days respecting capacities and spreading subjects', () => {
      const dailyCapacities = [60, 60, 60, 60, 60, 60, 60];
      const weekPlan = distributeAcrossWeek(sampleTasks, dailyCapacities);

      expect(weekPlan.length).toBe(7);
      const allScheduled = weekPlan.flat();
      expect(allScheduled.length).toBe(sampleTasks.length);

      // Verify no day exceeds capacity
      weekPlan.forEach((dayTasks, dayIdx) => {
        const dayMinutes = dayTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
        expect(dayMinutes).toBeLessThanOrEqual(dailyCapacities[dayIdx]);
      });
    });
  });

  describe('handleMissedWork', () => {
    it('forces rescheduling for critical and high priority tasks even when capacity is low', () => {
      const missed: TaskCandidate[] = [
        { id: 'm1', title: 'Low Task', taskType: 'learn_concept', estimatedMinutes: 30, priority: 'low' },
        { id: 'm2', title: 'Critical Task', taskType: 'mock_test', estimatedMinutes: 45, priority: 'critical' },
        { id: 'm3', title: 'High Task', taskType: 'spaced_revision', estimatedMinutes: 30, priority: 'high' },
      ];

      // Only 30 minutes remaining
      const { rescheduled, dropped } = handleMissedWork(missed, 30);

      // Critical task should be fitted first
      expect(rescheduled.some((t) => t.id === 'm2')).toBe(true);
      // High task is forced rescheduled even over capacity
      expect(rescheduled.some((t) => t.id === 'm3')).toBe(true);
      // Low task is dropped
      expect(dropped.some((t) => t.id === 'm1')).toBe(true);
    });
  });

  describe('determineSessionType', () => {
    it('detects mixed type when tasks have different types', () => {
      expect(determineSessionType(sampleTasks)).toBe('mixed');
    });

    it('detects revision when all tasks are revision', () => {
      const revisionTasks = [
        { ...sampleTasks[1], taskType: 'spaced_revision' },
        { ...sampleTasks[1], id: 'rev-2', taskType: 'revision_drill' },
      ];
      expect(determineSessionType(revisionTasks)).toBe('revision');
    });

    it('detects test when all tasks are mock or chapter tests', () => {
      const testTasks = [
        { ...sampleTasks[0], taskType: 'mock_test' },
      ];
      expect(determineSessionType(testTasks)).toBe('test');
    });

    it('detects practice when all tasks are practice drills', () => {
      const practiceTasks = [
        { ...sampleTasks[0], taskType: 'practice_drill' },
      ];
      expect(determineSessionType(practiceTasks)).toBe('practice');
    });
  });

  describe('generateSessionExplanation', () => {
    it('generates informative explanation with duration, subjects, and activities', () => {
      const explanation = generateSessionExplanation(sampleTasks.slice(0, 2), '2026-09-21');
      expect(explanation).toContain('55 min');
      expect(explanation).toContain('physics');
      expect(explanation).toContain('practice');
      expect(explanation).toContain('revision');
    });

    it('handles empty tasks list gracefully', () => {
      expect(generateSessionExplanation([], '2026-09-21')).toBe('No tasks scheduled.');
    });
  });

  describe('computeSessionTimes', () => {
    it('computes start and end time based on preferred time slot and session index', () => {
      const morningSlot = STUDY_TIME_SLOTS.morning; // 08:00
      const session0 = computeSessionTimes('morning', 0, 45);
      expect(session0.startTime).toBe('08:00');
      expect(session0.endTime).toBe('08:45');

      // Second session: starts after 45m duration + 15m break = 60m later (09:00)
      const session1 = computeSessionTimes('morning', 1, 45);
      expect(session1.startTime).toBe('09:00');
      expect(session1.endTime).toBe('09:45');
    });
  });

  describe('Zod Schemas', () => {
    it('validates plannerDateSchema with optional date', () => {
      expect(plannerDateSchema.safeParse({}).success).toBe(true);
      expect(plannerDateSchema.safeParse({ date: '2026-09-21' }).success).toBe(true);
    });

    it('validates replanSchema with optional fromDate', () => {
      expect(replanSchema.safeParse({}).success).toBe(true);
      expect(replanSchema.safeParse({ fromDate: '2026-09-22' }).success).toBe(true);
    });

    it('validates updateTaskSchema statuses', () => {
      expect(updateTaskSchema.safeParse({ status: 'completed' }).success).toBe(true);
      expect(updateTaskSchema.safeParse({ status: 'skipped' }).success).toBe(true);
      expect(updateTaskSchema.safeParse({ status: 'in_progress' }).success).toBe(true);
      expect(updateTaskSchema.safeParse({ status: 'cancelled' }).success).toBe(false);
    });
  });
});
