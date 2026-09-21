import { describe, it, expect } from 'vitest';
import {
  computeRevisionUrgency,
  selectRevisionType,
  updateRevisionSchedule,
  computeRetentionDecay,
  SM2_MIN_EASE,
  SM2_MAX_EASE,
  SM2_INITIAL_EASE,
} from '../modules/revision/revision.rules';
import {
  getDueRevisionsSchema,
  createRevisionSessionSchema,
  completeRevisionSchema,
} from '../modules/revision/revision.schema';

describe('Revision Engine — SM-2 Spaced Repetition & Urgency Rules', () => {
  describe('computeRevisionUrgency', () => {
    it('calculates higher urgency for overdue items with forgotten knowledge and mistakes', () => {
      const urgent = computeRevisionUrgency({
        retention: 0.2, // 80% forgotten -> (1 - 0.2) * 30 = 24 pts
        masteryScore: 40,
        daysOverdue: 10, // 10 * 2.5 = 25 pts
        daysUntilExam: 15, // 20 - 15 * 0.15 = 17.75 pts
        mistakeCount: 3, // 3 * 5 = 15 pts
        curriculumImportance: 80, // 0.8 * 10 = 8 pts
      });

      const fresh = computeRevisionUrgency({
        retention: 0.95,
        masteryScore: 85,
        daysOverdue: 0,
        daysUntilExam: 120,
        mistakeCount: 0,
        curriculumImportance: 20,
      });

      expect(urgent).toBeGreaterThan(fresh);
      expect(urgent).toBeCloseTo(89.75, 1);
    });
  });

  describe('selectRevisionType', () => {
    it('selects mistake_revision when topic has 3+ unresolved mistakes', () => {
      expect(selectRevisionType(80, 0.9, 3, false)).toBe('mistake_revision');
    });

    it('selects practice_based when retention is very low (<0.3) or mastery < 20', () => {
      expect(selectRevisionType(15, 0.8, 0, false)).toBe('practice_based');
      expect(selectRevisionType(50, 0.25, 0, false)).toBe('practice_based');
    });

    it('selects active_recall when retention is low (<0.6)', () => {
      expect(selectRevisionType(70, 0.55, 0, false)).toBe('active_recall');
    });

    it('selects formula_revision when topic has formulas and retention is moderately degraded (<0.7)', () => {
      expect(selectRevisionType(75, 0.65, 0, true)).toBe('formula_revision');
    });

    it('selects quick_review for retention between 0.7 and 0.8', () => {
      expect(selectRevisionType(75, 0.75, 0, false)).toBe('quick_review');
    });

    it('defaults to flashcard for well-retained topics (>=0.8)', () => {
      expect(selectRevisionType(90, 0.9, 0, false)).toBe('flashcard');
    });
  });

  describe('updateRevisionSchedule (SM-2)', () => {
    it('sets interval to 1 on first successful recall (repetition 0 -> 1)', () => {
      const res = updateRevisionSchedule({
        currentEaseFactor: SM2_INITIAL_EASE,
        currentInterval: 1,
        currentRepetition: 0,
        outcome: 'recalled',
      });

      expect(res.newRepetition).toBe(1);
      expect(res.newInterval).toBe(1);
      expect(res.newEaseFactor).toBeGreaterThanOrEqual(SM2_INITIAL_EASE);
    });

    it('sets interval to 6 on second successful recall (repetition 1 -> 2)', () => {
      const res = updateRevisionSchedule({
        currentEaseFactor: SM2_INITIAL_EASE,
        currentInterval: 1,
        currentRepetition: 1,
        outcome: 'recalled',
      });

      expect(res.newRepetition).toBe(2);
      expect(res.newInterval).toBe(6);
    });

    it('multiplies interval by ease factor on third+ successful recall', () => {
      const res = updateRevisionSchedule({
        currentEaseFactor: 2.5,
        currentInterval: 6,
        currentRepetition: 2,
        outcome: 'recalled',
      });

      expect(res.newRepetition).toBe(3);
      // Interval = Math.round(6 * 2.6) = 16 (since grade 5 increases ease by 0.1)
      expect(res.newInterval).toBeGreaterThan(6);
    });

    it('resets interval to 1 and repetition to 0 on "forgot"', () => {
      const res = updateRevisionSchedule({
        currentEaseFactor: 2.5,
        currentInterval: 30,
        currentRepetition: 5,
        outcome: 'forgot',
      });

      expect(res.newRepetition).toBe(0);
      expect(res.newInterval).toBe(1);
      expect(res.newEaseFactor).toBe(2.3); // 2.5 - 0.2
    });

    it('clamps ease factor to [1.3, 3.0]', () => {
      // Test lower bound
      const low = updateRevisionSchedule({
        currentEaseFactor: 1.35,
        currentInterval: 5,
        currentRepetition: 1,
        outcome: 'forgot',
      });
      expect(low.newEaseFactor).toBe(SM2_MIN_EASE);

      // Test upper bound
      let ease = 2.95;
      for (let i = 0; i < 5; i++) {
        const res = updateRevisionSchedule({
          currentEaseFactor: ease,
          currentInterval: 10,
          currentRepetition: 3,
          outcome: 'recalled',
        });
        ease = res.newEaseFactor;
      }
      expect(ease).toBeLessThanOrEqual(SM2_MAX_EASE);
    });
  });

  describe('computeRetentionDecay', () => {
    it('returns 0 when item has never been reviewed', () => {
      expect(computeRetentionDecay(null, 5)).toBe(0);
    });

    it('returns ~1 immediately after review', () => {
      const now = new Date().toISOString();
      expect(computeRetentionDecay(now, 10)).toBeCloseTo(1.0, 2);
    });

    it('shows exponential decay over time', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();

      // Stability = 10 days
      const ret10 = computeRetentionDecay(tenDaysAgo, 10);
      const ret20 = computeRetentionDecay(twentyDaysAgo, 10);

      // At t = stability, retention ≈ e^(-1) ≈ 0.368
      expect(ret10).toBeCloseTo(0.368, 2);
      // At t = 2 * stability, retention ≈ e^(-2) ≈ 0.135
      expect(ret20).toBeCloseTo(0.135, 2);
      expect(ret10).toBeGreaterThan(ret20);
    });
  });

  describe('Zod Schemas', () => {
    it('validates getDueRevisionsSchema with defaults and custom options', () => {
      expect(getDueRevisionsSchema.safeParse({}).success).toBe(true);
      expect(getDueRevisionsSchema.safeParse({ limit: 10, subjectId: 'physics' }).success).toBe(true);
    });

    it('validates createRevisionSessionSchema with valid revisionType', () => {
      expect(
        createRevisionSessionSchema.safeParse({
          revisionType: 'active_recall',
        }).success
      ).toBe(true);
      expect(
        createRevisionSessionSchema.safeParse({
          revisionType: 'invalid_type',
        }).success
      ).toBe(false);
      expect(createRevisionSessionSchema.safeParse({}).success).toBe(false);
    });

    it('validates completeRevisionSchema with valid outcomes', () => {
      const valid = {
        outcome: 'recalled',
        timeSpentSeconds: 45,
        questionsAttempted: 5,
        questionsCorrect: 4,
      };
      expect(completeRevisionSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects invalid outcome in completeRevisionSchema', () => {
      const invalid = {
        outcome: 'guessed',
      };
      expect(completeRevisionSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
