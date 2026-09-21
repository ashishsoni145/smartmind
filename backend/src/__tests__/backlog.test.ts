import { describe, it, expect } from 'vitest';
import {
  classifyBacklogItem,
  computePriorityScore,
  rankBacklogItems,
  DEFAULT_PRIORITY_WEIGHTS,
} from '../modules/backlog/backlog.rules';
import {
  getBacklogQuerySchema,
  studentIdParamSchema,
} from '../modules/backlog/backlog.schema';

describe('Adaptive Backlog — Prioritization Rules & Classification', () => {
  describe('classifyBacklogItem', () => {
    it('classifies item with zero evidence as "unstarted"', () => {
      const status = classifyBacklogItem({
        evidenceCount: 0,
        masteryScore: 0,
        retention: 1,
        lastPracticedAt: null,
        nextReviewDate: null,
        daysUntilExam: 60,
      });
      expect(status).toBe('unstarted');
    });

    it('classifies item with impending exam and low mastery as "at_risk"', () => {
      const status = classifyBacklogItem({
        evidenceCount: 5,
        masteryScore: 45,
        retention: 0.8,
        lastPracticedAt: new Date().toISOString(),
        nextReviewDate: null,
        daysUntilExam: 10,
      });
      expect(status).toBe('at_risk');
    });

    it('classifies item with review overdue by >7 days as "overdue"', () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
      const status = classifyBacklogItem({
        evidenceCount: 4,
        masteryScore: 70,
        retention: 0.6,
        lastPracticedAt: eightDaysAgo,
        nextReviewDate: eightDaysAgo,
        daysUntilExam: 100,
      });
      expect(status).toBe('overdue');
    });

    it('classifies item with low retention as "revision_due"', () => {
      const status = classifyBacklogItem({
        evidenceCount: 3,
        masteryScore: 65,
        retention: 0.4,
        lastPracticedAt: new Date().toISOString(),
        nextReviewDate: null,
        daysUntilExam: 90,
      });
      expect(status).toBe('revision_due');
    });

    it('classifies item with low mastery (<40) as "weak"', () => {
      const status = classifyBacklogItem({
        evidenceCount: 6,
        masteryScore: 35,
        retention: 0.75,
        lastPracticedAt: new Date().toISOString(),
        nextReviewDate: null,
        daysUntilExam: 80,
      });
      expect(status).toBe('weak');
    });

    it('classifies item with moderate mastery (<80) and healthy retention as "in_progress"', () => {
      const status = classifyBacklogItem({
        evidenceCount: 5,
        masteryScore: 75,
        retention: 0.85,
        lastPracticedAt: new Date().toISOString(),
        nextReviewDate: null,
        daysUntilExam: 90,
      });
      expect(status).toBe('in_progress');
    });
  });

  describe('computePriorityScore', () => {
    it('computes deterministically with default weights', () => {
      const input = {
        examProximityDays: 30,
        weightagePercent: 12,
        masteryScore: 30,
        prerequisiteCount: 3,
        retention: 0.4,
        accuracy: 0.5,
        daysSinceLastPractice: 20,
      };

      const res1 = computePriorityScore(input);
      const res2 = computePriorityScore(input);

      expect(res1.score).toBe(res2.score);
      expect(res1.reasons.length).toBe(res2.reasons.length);
      expect(res1.score).toBeGreaterThan(0);
      expect(res1.score).toBeLessThanOrEqual(100);
    });

    it('yields higher score for high weakness and high weightage topic close to exam', () => {
      const urgentInput = {
        examProximityDays: 10,
        weightagePercent: 15,
        masteryScore: 20,
        prerequisiteCount: 4,
        retention: 0.3,
        accuracy: 0.25,
        daysSinceLastPractice: 25,
      };

      const calmInput = {
        examProximityDays: 180,
        weightagePercent: 2,
        masteryScore: 90,
        prerequisiteCount: 0,
        retention: 0.95,
        accuracy: 0.9,
        daysSinceLastPractice: 2,
      };

      const urgentResult = computePriorityScore(urgentInput);
      const calmResult = computePriorityScore(calmInput);

      expect(urgentResult.score).toBeGreaterThan(calmResult.score);
    });

    it('orders reasons by highest contribution descending', () => {
      const input = {
        examProximityDays: 5,
        weightagePercent: 20,
        masteryScore: 10,
        prerequisiteCount: 5,
        retention: 0.2,
        accuracy: 0.2,
        daysSinceLastPractice: 30,
      };

      const { reasons } = computePriorityScore(input);
      for (let i = 0; i < reasons.length - 1; i++) {
        expect(reasons[i].contribution).toBeGreaterThanOrEqual(reasons[i + 1].contribution);
      }
    });

    it('respects custom weights', () => {
      const input = {
        examProximityDays: 10,
        weightagePercent: 10,
        masteryScore: 50,
        prerequisiteCount: 2,
        retention: 0.5,
        accuracy: 0.5,
        daysSinceLastPractice: 10,
      };

      const customWeights = {
        ...DEFAULT_PRIORITY_WEIGHTS,
        weakness: 0.80, // Overwhelming weight on weakness
        examProximity: 0.0,
      };

      const defaultScore = computePriorityScore(input);
      const customScore = computePriorityScore(input, customWeights);

      expect(customScore.score).not.toBe(defaultScore.score);
    });
  });

  describe('rankBacklogItems', () => {
    it('ranks items by priority score descending', () => {
      const items = [
        { priorityScore: 45.2, deadline: null, title: 'B - Rotational Dynamics' },
        { priorityScore: 89.5, deadline: null, title: 'A - Kinematics' },
        { priorityScore: 65.0, deadline: null, title: 'C - Electrostatics' },
      ];

      const ranked = rankBacklogItems(items);
      expect(ranked.map((i) => i.title)).toEqual([
        'A - Kinematics',
        'C - Electrostatics',
        'B - Rotational Dynamics',
      ]);
    });

    it('breaks ties using deadline first, then title alphabetically', () => {
      const items = [
        { priorityScore: 50, deadline: '2026-10-15', title: 'Z - Optics' },
        { priorityScore: 50, deadline: '2026-10-01', title: 'M - Waves' },
        { priorityScore: 50, deadline: null, title: 'B - Thermodynamics' },
        { priorityScore: 50, deadline: null, title: 'A - Gravitation' },
      ];

      const ranked = rankBacklogItems(items);
      expect(ranked[0].title).toBe('M - Waves'); // Earlier deadline
      expect(ranked[1].title).toBe('Z - Optics'); // Later deadline
      expect(ranked[2].title).toBe('A - Gravitation'); // Alphabetical
      expect(ranked[3].title).toBe('B - Thermodynamics'); // Alphabetical
    });
  });

  describe('Zod Schemas', () => {
    it('validates getBacklogQuerySchema with default and custom values', () => {
      expect(getBacklogQuerySchema.safeParse({}).success).toBe(true);
      expect(
        getBacklogQuerySchema.safeParse({
          classification: 'weak',
          subjectId: 'physics',
          page: 2,
          limit: 20,
        }).success
      ).toBe(true);
      expect(
        getBacklogQuerySchema.safeParse({
          classification: 'invalid_status',
        }).success
      ).toBe(false);
    });

    it('validates studentIdParamSchema for UUID', () => {
      expect(
        studentIdParamSchema.safeParse({
          studentId: '11111111-1111-1111-1111-111111111111',
        }).success
      ).toBe(true);
      expect(
        studentIdParamSchema.safeParse({
          studentId: 'not-a-uuid',
        }).success
      ).toBe(false);
    });
  });
});
