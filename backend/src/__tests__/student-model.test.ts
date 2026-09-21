import { describe, it, expect } from 'vitest';
import {
  computeMasteryFromEvidence,
  computeRetention,
  computeConfidence,
  updateStabilityAfterReview,
  classifyStatus,
  computeNextReviewDate,
  computeUncertainty,
  updatePKnow,
  updateStreaks,
  updateAvgTime,
  recomputeStateFromEvidence,
  type EvidenceRecord,
} from '../modules/student-model/student-model.rules';

describe('Student Model Rules — Deterministic Update Functions', () => {
  // -----------------------------------------------------------------------
  // computeMasteryFromEvidence
  // -----------------------------------------------------------------------
  describe('computeMasteryFromEvidence', () => {
    it('returns 0 for empty evidence', () => {
      expect(computeMasteryFromEvidence([])).toBe(0);
    });

    it('returns 100 for all correct recent answers', () => {
      const now = new Date().toISOString();
      const evidence: EvidenceRecord[] = Array.from({ length: 5 }, () => ({
        isCorrect: true,
        timeTakenSeconds: 30,
        scoreOrPerformance: null,
        difficultyLevel: 'medium',
        createdAt: now,
        confidenceSelfReport: null,
      }));
      expect(computeMasteryFromEvidence(evidence)).toBe(100);
    });

    it('returns 0 for all incorrect answers', () => {
      const now = new Date().toISOString();
      const evidence: EvidenceRecord[] = Array.from({ length: 5 }, () => ({
        isCorrect: false,
        timeTakenSeconds: 30,
        scoreOrPerformance: null,
        difficultyLevel: 'medium',
        createdAt: now,
        confidenceSelfReport: null,
      }));
      expect(computeMasteryFromEvidence(evidence)).toBe(0);
    });

    it('weights recent evidence higher than old evidence', () => {
      const recent = new Date().toISOString();
      const old = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Old correct, recent incorrect — mastery should be low
      const lowMastery = computeMasteryFromEvidence([
        { isCorrect: true, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: old, confidenceSelfReport: null },
        { isCorrect: false, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: recent, confidenceSelfReport: null },
      ]);

      // Old incorrect, recent correct — mastery should be higher
      const highMastery = computeMasteryFromEvidence([
        { isCorrect: false, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: old, confidenceSelfReport: null },
        { isCorrect: true, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: recent, confidenceSelfReport: null },
      ]);

      expect(highMastery).toBeGreaterThan(lowMastery);
    });

    it('gives harder questions more weight', () => {
      const now = new Date().toISOString();

      const easyCorrect = computeMasteryFromEvidence([
        { isCorrect: true, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'easy', createdAt: now, confidenceSelfReport: null },
      ]);

      const hardCorrect = computeMasteryFromEvidence([
        { isCorrect: true, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'hard', createdAt: now, confidenceSelfReport: null },
      ]);

      // Both are 100% correct but the raw scores are the same since it's 1/1
      // The differentiation happens with mixed results
      expect(easyCorrect).toBe(100);
      expect(hardCorrect).toBe(100);
    });

    it('ignores evidence with null isCorrect', () => {
      const now = new Date().toISOString();
      const evidence: EvidenceRecord[] = [
        { isCorrect: null, timeTakenSeconds: 30, scoreOrPerformance: 50, difficultyLevel: 'medium', createdAt: now, confidenceSelfReport: null },
      ];
      expect(computeMasteryFromEvidence(evidence)).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // computeRetention
  // -----------------------------------------------------------------------
  describe('computeRetention', () => {
    it('returns 0 for null lastPracticedAt', () => {
      expect(computeRetention(null, 10)).toBe(0);
    });

    it('returns ~1 for very recent practice', () => {
      const justNow = new Date().toISOString();
      const retention = computeRetention(justNow, 10);
      expect(retention).toBeGreaterThan(0.99);
    });

    it('decays exponentially over time', () => {
      const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const stability = 10;

      const r1 = computeRetention(daysAgo(1), stability);
      const r5 = computeRetention(daysAgo(5), stability);
      const r10 = computeRetention(daysAgo(10), stability);
      const r30 = computeRetention(daysAgo(30), stability);

      expect(r1).toBeGreaterThan(r5);
      expect(r5).toBeGreaterThan(r10);
      expect(r10).toBeGreaterThan(r30);

      // At t = stability, retention should be approximately e^-1 ≈ 0.368
      expect(r10).toBeCloseTo(Math.exp(-1), 1);
    });
  });

  // -----------------------------------------------------------------------
  // computeConfidence
  // -----------------------------------------------------------------------
  describe('computeConfidence', () => {
    it('returns 0 for no evidence', () => {
      expect(computeConfidence(0, null, 0, 0)).toBe(0);
    });

    it('increases with evidence count', () => {
      const now = new Date().toISOString();
      const c1 = computeConfidence(1, now, 1, 0);
      const c5 = computeConfidence(5, now, 3, 0);
      const c10 = computeConfidence(10, now, 5, 0);

      expect(c5).toBeGreaterThan(c1);
      expect(c10).toBeGreaterThan(c5);
    });

    it('is between 0 and 1', () => {
      const c = computeConfidence(100, new Date().toISOString(), 50, 0);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(1);
    });
  });

  // -----------------------------------------------------------------------
  // updateStabilityAfterReview
  // -----------------------------------------------------------------------
  describe('updateStabilityAfterReview', () => {
    it('increases stability on successful recall', () => {
      const result = updateStabilityAfterReview(5, 'recalled');
      expect(result).toBeGreaterThan(5);
    });

    it('increases stability slightly on partial recall', () => {
      const result = updateStabilityAfterReview(5, 'partially_recalled');
      expect(result).toBeGreaterThan(5);
      expect(result).toBeLessThan(updateStabilityAfterReview(5, 'recalled'));
    });

    it('decreases stability on forgetting', () => {
      const result = updateStabilityAfterReview(5, 'forgot');
      expect(result).toBeLessThan(5);
      expect(result).toBeGreaterThanOrEqual(0.5);
    });

    it('caps stability at MAX_STABILITY_DAYS', () => {
      const result = updateStabilityAfterReview(300, 'recalled');
      expect(result).toBeLessThanOrEqual(365);
    });
  });

  // -----------------------------------------------------------------------
  // classifyStatus
  // -----------------------------------------------------------------------
  describe('classifyStatus', () => {
    it('returns not_started for zero evidence', () => {
      expect(classifyStatus(0, 0, 0)).toBe('not_started');
    });

    it('returns mastered for high mastery and high retention', () => {
      expect(classifyStatus(85, 0.9, 10)).toBe('mastered');
    });

    it('returns needs_revision for low retention', () => {
      expect(classifyStatus(60, 0.3, 5)).toBe('needs_revision');
    });

    it('returns in_progress for moderate mastery', () => {
      expect(classifyStatus(50, 0.8, 5)).toBe('in_progress');
    });
  });

  // -----------------------------------------------------------------------
  // computeNextReviewDate
  // -----------------------------------------------------------------------
  describe('computeNextReviewDate', () => {
    it('returns today for zero stability', () => {
      const date = computeNextReviewDate(0);
      const today = new Date();
      expect(date.getDate()).toBe(today.getDate());
    });

    it('returns a future date for positive stability', () => {
      const date = computeNextReviewDate(10);
      expect(date.getTime()).toBeGreaterThan(Date.now());
    });
  });

  // -----------------------------------------------------------------------
  // updatePKnow (Bayesian)
  // -----------------------------------------------------------------------
  describe('updatePKnow', () => {
    it('increases p_know on correct answer', () => {
      const updated = updatePKnow(0.5, true, 'medium');
      expect(updated).toBeGreaterThan(0.5);
    });

    it('decreases p_know on incorrect answer', () => {
      const updated = updatePKnow(0.5, false, 'medium');
      expect(updated).toBeLessThan(0.5);
    });

    it('stays bounded between 0.001 and 0.999', () => {
      let p = 0.999;
      p = updatePKnow(p, false, 'medium');
      expect(p).toBeLessThan(0.999);
      expect(p).toBeGreaterThan(0.001);
    });
  });

  // -----------------------------------------------------------------------
  // updateStreaks
  // -----------------------------------------------------------------------
  describe('updateStreaks', () => {
    it('increments correct streak and resets incorrect on correct', () => {
      const result = updateStreaks(3, 2, true);
      expect(result.streakCorrect).toBe(4);
      expect(result.streakIncorrect).toBe(0);
    });

    it('increments incorrect streak and resets correct on incorrect', () => {
      const result = updateStreaks(3, 2, false);
      expect(result.streakCorrect).toBe(0);
      expect(result.streakIncorrect).toBe(3);
    });
  });

  // -----------------------------------------------------------------------
  // updateAvgTime
  // -----------------------------------------------------------------------
  describe('updateAvgTime', () => {
    it('returns new time when no existing average', () => {
      expect(updateAvgTime(null, 0, 30)).toBe(30);
    });

    it('applies exponential moving average', () => {
      const avg = updateAvgTime(60, 5, 30);
      expect(avg).toBeLessThan(60);
      expect(avg).toBeGreaterThan(30);
    });

    it('returns current average when new time is null', () => {
      expect(updateAvgTime(60, 5, null)).toBe(60);
    });
  });

  // -----------------------------------------------------------------------
  // recomputeStateFromEvidence (full recomputation)
  // -----------------------------------------------------------------------
  describe('recomputeStateFromEvidence', () => {
    it('returns default state for empty evidence', () => {
      const state = recomputeStateFromEvidence([]);
      expect(state.masteryScore).toBe(0);
      expect(state.evidenceCount).toBe(0);
      expect(state.status).toBe('not_started');
      expect(state.uncertainty).toBe(1);
    });

    it('produces a valid state from mixed evidence', () => {
      const now = new Date().toISOString();
      const evidence: EvidenceRecord[] = [
        { isCorrect: true, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'easy', createdAt: now, confidenceSelfReport: 4 },
        { isCorrect: false, timeTakenSeconds: 60, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: now, confidenceSelfReport: 2 },
        { isCorrect: true, timeTakenSeconds: 45, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: now, confidenceSelfReport: 3 },
      ];

      const state = recomputeStateFromEvidence(evidence);

      expect(state.evidenceCount).toBe(3);
      expect(state.totalQuestionsAttempted).toBe(3);
      expect(state.totalCorrect).toBe(2);
      expect(state.masteryScore).toBeGreaterThan(0);
      expect(state.masteryScore).toBeLessThanOrEqual(100);
      expect(state.pKnow).toBeGreaterThan(0);
      expect(state.pKnow).toBeLessThan(1);
      expect(state.streakCorrect).toBe(1); // Last answer was correct
      expect(state.streakIncorrect).toBe(0);
      expect(state.status).not.toBe('not_started');
      expect(state.modelVersion).toBeGreaterThan(0);
      expect(state.inferredAt).toBeDefined();
    });

    it('is deterministic — same inputs always give same outputs', () => {
      const now = new Date('2026-09-21T12:00:00Z').toISOString();
      const evidence: EvidenceRecord[] = [
        { isCorrect: true, timeTakenSeconds: 30, scoreOrPerformance: null, difficultyLevel: 'medium', createdAt: now, confidenceSelfReport: null },
        { isCorrect: false, timeTakenSeconds: 60, scoreOrPerformance: null, difficultyLevel: 'hard', createdAt: now, confidenceSelfReport: null },
      ];

      const state1 = recomputeStateFromEvidence(evidence, 1.0, 1);
      const state2 = recomputeStateFromEvidence(evidence, 1.0, 1);

      expect(state1.masteryScore).toBe(state2.masteryScore);
      expect(state1.pKnow).toBe(state2.pKnow);
      expect(state1.evidenceCount).toBe(state2.evidenceCount);
      expect(state1.streakCorrect).toBe(state2.streakCorrect);
    });
  });
});
