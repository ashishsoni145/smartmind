import { describe, it, expect } from 'vitest';
import {
  calculateReadinessFactors,
  computeCompositeReadiness,
  calculateProjectedScoreRange,
  generateSimulationScenarios,
  FACTOR_WEIGHTS,
} from '../modules/readiness/readiness.rules';
import {
  getReadinessQuerySchema,
  simulateReadinessSchema,
} from '../modules/readiness/readiness.schema';

describe('Exam Readiness Scoring & Simulation Engine', () => {
  describe('FACTOR_WEIGHTS', () => {
    it('sums to exactly 1.0 across all 8 factors', () => {
      const sum = Object.values(FACTOR_WEIGHTS).reduce((a, b) => a + b, 0);
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.0001);
    });
  });

  describe('calculateReadinessFactors', () => {
    it('computes all 8 grounded factors from student telemetry', () => {
      const factors = calculateReadinessFactors({
        totalSyllabusNodes: 100,
        coveredSyllabusNodes: 75,
        avgMastery: 0.82,
        avgRetention: 0.78,
        testsTaken: 8,
        avgSecondsPerQuestion: 110, // within 0.75 - 1.15 of 120s
        targetSecondsPerQuestion: 120,
        hardQuestionsAttempted: 20,
        hardQuestionsCorrect: 14,
        recentTestScores: [72, 75, 78, 74],
        totalMistakes: 10,
        resolvedMistakes: 8,
        overdueMistakes: 1,
      });

      expect(factors).toHaveLength(8);

      const coverage = factors.find((f) => f.key === 'syllabusCoverage');
      expect(coverage?.score).toBe(75);
      expect(coverage?.status).toBe('good');

      const mastery = factors.find((f) => f.key === 'conceptMastery');
      expect(mastery?.score).toBe(82);
      expect(mastery?.status).toBe('strong');

      const retention = factors.find((f) => f.key === 'retentionStability');
      expect(retention?.score).toBe(78);

      const exp = factors.find((f) => f.key === 'testExperience');
      expect(exp?.score).toBe(80);

      const pacing = factors.find((f) => f.key === 'speedPacing');
      expect(pacing?.score).toBe(100);

      const hardAcc = factors.find((f) => f.key === 'highDifficultyAccuracy');
      expect(hardAcc?.score).toBe(70);

      const consistency = factors.find((f) => f.key === 'consistency');
      expect(consistency?.score).toBeGreaterThan(80);

      const revision = factors.find((f) => f.key === 'revisionHealth');
      expect(revision?.score).toBeGreaterThan(70);
    });

    it('penalizes severe pacing bottlenecks (>180s/question)', () => {
      const factors = calculateReadinessFactors({
        totalSyllabusNodes: 100,
        coveredSyllabusNodes: 50,
        avgMastery: 0.6,
        avgRetention: 0.6,
        testsTaken: 3,
        avgSecondsPerQuestion: 240, // 2x benchmark
        targetSecondsPerQuestion: 120,
        hardQuestionsAttempted: 5,
        hardQuestionsCorrect: 2,
        recentTestScores: [50],
        totalMistakes: 5,
        resolvedMistakes: 1,
        overdueMistakes: 3,
      });

      const pacing = factors.find((f) => f.key === 'speedPacing');
      expect(pacing?.score).toBeLessThan(60);
      expect(pacing?.status).toBe('needs_work');
    });
  });

  describe('computeCompositeReadiness', () => {
    it('computes weighted composite score correctly', () => {
      const factors = calculateReadinessFactors({
        totalSyllabusNodes: 100,
        coveredSyllabusNodes: 80,
        avgMastery: 0.8,
        avgRetention: 0.8,
        testsTaken: 10,
        avgSecondsPerQuestion: 100,
        targetSecondsPerQuestion: 120,
        hardQuestionsAttempted: 10,
        hardQuestionsCorrect: 8,
        recentTestScores: [80, 80, 80],
        totalMistakes: 5,
        resolvedMistakes: 5,
        overdueMistakes: 0,
      });

      const composite = computeCompositeReadiness(factors);
      expect(composite).toBeGreaterThan(80);
      expect(composite).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateProjectedScoreRange', () => {
    it('projects score range bounded by 0 and maxMarks', () => {
      const range = calculateProjectedScoreRange(75, 300);
      // 75% of 300 = 225. Spread = 24. Range: 201 to 249
      expect(range.min).toBe(201);
      expect(range.max).toBe(249);
    });
  });

  describe('generateSimulationScenarios', () => {
    it('produces 3 distinct scenarios with explicit declared assumptions', () => {
      const scenarios = generateSimulationScenarios({
        currentReadiness: 65,
        maxMarks: 300,
        daysRemaining: 60,
      });

      expect(scenarios).toHaveLength(3);
      scenarios.forEach((s) => {
        expect(s.assumptions.length).toBeGreaterThan(0);
        expect(s.projectedScore).toBeGreaterThanOrEqual(0);
        expect(s.projectedScore).toBeLessThanOrEqual(300);
        expect(s.confidenceInterval.min).toBeLessThanOrEqual(s.confidenceInterval.max);
      });
    });
  });

  describe('Readiness Schemas', () => {
    it('parses getReadinessQuerySchema with string booleans', () => {
      const parsed = getReadinessQuerySchema.parse({
        recalculate: 'true',
        targetExamId: 'jee_main',
      });
      expect(parsed.recalculate).toBe(true);
      expect(parsed.targetExamId).toBe('jee_main');
    });

    it('parses simulateReadinessSchema with default constraints', () => {
      const parsed = simulateReadinessSchema.parse({
        daysRemaining: 45,
        dailyStudyHours: 6,
      });
      expect(parsed.daysRemaining).toBe(45);
      expect(parsed.dailyStudyHours).toBe(6);
      expect(parsed.targetMocksCount).toBe(8);
      expect(parsed.revisionAdherencePercent).toBe(85);
    });
  });
});
