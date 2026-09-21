import { describe, it, expect } from 'vitest';
import {
  calculateAssessmentScore,
  calculateRemainingSeconds,
} from '../modules/assessments/assessment.rules';
import {
  createAssessmentSchema,
  autosaveAnswerSchema,
  submitAssessmentSchema,
} from '../modules/assessments/assessment.schema';
import type { Assessment, AssessmentAnswerItem } from '@sharpmind/types';

describe('Assessment Engine — Scoring Rules & Countdown Calculation', () => {
  const sampleAssessment: Assessment = {
    id: 'test-assess-1',
    title: 'JEE Main Physics Chapter Test: Kinematics',
    type: 'chapter_test',
    durationMinutes: 60,
    totalMarks: 20,
    markingScheme: { correct: 4.0, incorrect: -1.0, unattempted: 0.0 },
    difficultyDistribution: { easy: 20, medium: 60, hard: 20 },
    sectionsConfig: [],
    isAdaptive: false,
    isPublished: true,
  };

  const questionMarksMap = {
    'q-1': 4.0,
    'q-2': 4.0,
    'q-3': 4.0,
    'q-4': 4.0,
    'q-5': 4.0,
  };

  describe('calculateAssessmentScore', () => {
    it('calculates perfect score when all attempted questions are correct', () => {
      const answers: AssessmentAnswerItem[] = [
        { questionId: 'q-1', selectedOptions: ['A'], isCorrect: true, timeSpentSeconds: 40, status: 'answered' },
        { questionId: 'q-2', selectedOptions: ['B'], isCorrect: true, timeSpentSeconds: 50, status: 'answered' },
      ];

      const result = calculateAssessmentScore(sampleAssessment, answers, questionMarksMap);
      expect(result.totalScore).toBe(8.0);
      expect(result.totalAttempted).toBe(2);
      expect(result.totalCorrect).toBe(2);
      expect(result.accuracyPercentage).toBe(100);
    });

    it('applies negative marking correctly for incorrect answers', () => {
      const answers: AssessmentAnswerItem[] = [
        { questionId: 'q-1', selectedOptions: ['A'], isCorrect: true, timeSpentSeconds: 40, status: 'answered' },
        { questionId: 'q-2', selectedOptions: ['C'], isCorrect: false, timeSpentSeconds: 60, status: 'answered' },
      ];

      const result = calculateAssessmentScore(sampleAssessment, answers, questionMarksMap);
      // 4.0 - 1.0 = 3.0
      expect(result.totalScore).toBe(3.0);
      expect(result.totalAttempted).toBe(2);
      expect(result.totalCorrect).toBe(1);
      expect(result.totalIncorrect).toBe(1);
      expect(result.accuracyPercentage).toBe(50);
    });

    it('awards 0 marks for unattempted questions without negative deduction', () => {
      const answers: AssessmentAnswerItem[] = [
        { questionId: 'q-1', selectedOptions: ['A'], isCorrect: true, timeSpentSeconds: 45, status: 'answered' },
        { questionId: 'q-2', selectedOptions: [], isCorrect: false, timeSpentSeconds: 0, status: 'unanswered' },
      ];

      const result = calculateAssessmentScore(sampleAssessment, answers, questionMarksMap);
      expect(result.totalScore).toBe(4.0);
      expect(result.totalAttempted).toBe(1);
      expect(result.totalUnattempted).toBe(1);
    });

    it('clamps negative total score to 0 when configured', () => {
      const answers: AssessmentAnswerItem[] = [
        { questionId: 'q-1', selectedOptions: ['D'], isCorrect: false, timeSpentSeconds: 20, status: 'answered' },
        { questionId: 'q-2', selectedOptions: ['C'], isCorrect: false, timeSpentSeconds: 20, status: 'answered' },
      ];

      const result = calculateAssessmentScore(sampleAssessment, answers, questionMarksMap);
      // Total would be -2.0, clamped to 0
      expect(result.totalScore).toBe(0);
      expect(result.totalIncorrect).toBe(2);
    });
  });

  describe('calculateRemainingSeconds', () => {
    it('calculates accurate remaining countdown from server ISO timestamp', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const remaining = calculateRemainingSeconds(fiveMinutesAgo, 60);

      // 60m - 5m = 55 minutes = 3300 seconds (allow ±2s for execution time)
      expect(remaining).toBeGreaterThanOrEqual(3298);
      expect(remaining).toBeLessThanOrEqual(3302);
    });

    it('clamps to zero when time has expired', () => {
      const twoHoursAgo = new Date(Date.now() - 120 * 60 * 1000).toISOString();
      const remaining = calculateRemainingSeconds(twoHoursAgo, 60);

      expect(remaining).toBe(0);
    });
  });

  describe('Zod Schemas', () => {
    it('validates createAssessmentSchema with defaults', () => {
      const valid = {
        title: 'Full Mock Test 01',
        type: 'mock_exam',
        durationMinutes: 180,
        totalMarks: 300,
      };
      const res = createAssessmentSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.markingScheme.correct).toBe(4.0);
        expect(res.data.markingScheme.incorrect).toBe(-1.0);
      }
    });

    it('validates autosaveAnswerSchema', () => {
      const valid = {
        questionId: '11111111-1111-1111-1111-111111111111',
        selectedOptions: ['B'],
        timeSpentSeconds: 45,
        status: 'answered',
      };
      expect(autosaveAnswerSchema.safeParse(valid).success).toBe(true);
    });

    it('validates submitAssessmentSchema', () => {
      const valid = {
        answers: [
          {
            questionId: '11111111-1111-1111-1111-111111111111',
            selectedOptions: ['B'],
            timeSpentSeconds: 45,
            status: 'answered',
          },
        ],
        timeTakenSeconds: 1200,
      };
      expect(submitAssessmentSchema.safeParse(valid).success).toBe(true);
    });
  });
});
