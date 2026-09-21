import { describe, it, expect } from 'vitest';
import {
  calculateNextRetry,
  inferMistakeRootCause,
  processMistakeRetry,
  MISTAKE_SPACED_INTERVALS,
} from '../modules/mistakes/mistake.rules';
import {
  listMistakesQuerySchema,
  updateMistakeSchema,
  retryMistakeSchema,
} from '../modules/mistakes/mistake.schema';
import type { Question } from '@sharpmind/types';

describe('Mistake Engine — Classification & Spaced Retries', () => {
  const baseQuestion: Question = {
    id: 'q-test-1',
    curriculumNodeId: 'node-rotational',
    subjectId: 'physics',
    questionType: 'single_choice',
    difficultyLevel: 'hard',
    questionText: 'Determine angular momentum vector.',
    options: [{ optionKey: 'A', optionText: 'L = r x p', isCorrect: true }],
    marks: 4,
    sourceType: 'verified_source',
  };

  describe('calculateNextRetry', () => {
    it('returns 1 day for first occurrence', () => {
      const base = new Date('2026-09-21T00:00:00.000Z');
      const res = calculateNextRetry(1, base);
      expect(res.spacedIntervalDays).toBe(1);
      expect(res.nextRetryAt).toBe('2026-09-22T00:00:00.000Z');
    });

    it('returns escalating intervals for higher repetitions', () => {
      const base = new Date('2026-09-21T00:00:00.000Z');
      expect(calculateNextRetry(2, base).spacedIntervalDays).toBe(3);
      expect(calculateNextRetry(3, base).spacedIntervalDays).toBe(7);
      expect(calculateNextRetry(4, base).spacedIntervalDays).toBe(21);
      expect(calculateNextRetry(5, base).spacedIntervalDays).toBe(45);
      expect(calculateNextRetry(99, base).spacedIntervalDays).toBe(45);
    });
  });

  describe('inferMistakeRootCause', () => {
    it('infers guessing when hard problem is answered in <20s', () => {
      const cause = inferMistakeRootCause({
        question: baseQuestion,
        timeSpentSeconds: 15,
        studentAnswer: ['B'],
      });
      expect(cause).toBe('guessing');
    });

    it('infers calculation error when numerical answer is within 25% of target', () => {
      const numQuestion: Question = {
        ...baseQuestion,
        questionType: 'numerical',
        difficultyLevel: 'medium',
        options: [{ optionKey: 'ans', optionText: '100.0', isCorrect: true }],
      };

      const cause = inferMistakeRootCause({
        question: numQuestion,
        timeSpentSeconds: 60,
        studentAnswer: '95', // 5% deviation
      });
      expect(cause).toBe('calculation');
    });

    it('infers misreading when taking >180s on an easy question', () => {
      const easyQuestion: Question = {
        ...baseQuestion,
        difficultyLevel: 'easy',
      };

      const cause = inferMistakeRootCause({
        question: easyQuestion,
        timeSpentSeconds: 200,
        studentAnswer: ['C'],
      });
      expect(cause).toBe('misreading');
    });

    it('infers application when question has application pedagogical type', () => {
      const appQuestion: Question = {
        ...baseQuestion,
        difficultyLevel: 'medium',
        pedagogicalType: 'application',
      };

      const cause = inferMistakeRootCause({
        question: appQuestion,
        timeSpentSeconds: 50,
        studentAnswer: ['C'],
      });
      expect(cause).toBe('application');
    });

    it('defaults to conceptual when standard attempt fails', () => {
      const cause = inferMistakeRootCause({
        question: baseQuestion,
        timeSpentSeconds: 70,
        studentAnswer: ['B'],
      });
      expect(cause).toBe('conceptual');
    });
  });

  describe('processMistakeRetry', () => {
    it('resolves mistake upon successful retry', () => {
      const base = new Date('2026-09-21T10:00:00.000Z');
      const res = processMistakeRetry({
        currentRepetition: 2,
        isCorrect: true,
        baseDate: base,
      });

      expect(res.isResolved).toBe(true);
      expect(res.resolvedAt).toBe('2026-09-21T10:00:00.000Z');
      expect(res.repetitionCount).toBe(2);
    });

    it('escalates repetition and schedules further retry upon failure', () => {
      const base = new Date('2026-09-21T10:00:00.000Z');
      const res = processMistakeRetry({
        currentRepetition: 2,
        isCorrect: false,
        baseDate: base,
      });

      expect(res.isResolved).toBe(false);
      expect(res.repetitionCount).toBe(3);
      expect(res.spacedIntervalDays).toBe(7);
      expect(res.nextRetryAt).toBe(new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString());
    });
  });

  describe('Mistake Schemas', () => {
    it('validates list query and transforms strings', () => {
      const parsed = listMistakesQuerySchema.parse({
        rootCause: 'calculation',
        isResolved: 'false',
        overdueOnly: 'true',
        limit: '25',
      });
      expect(parsed.isResolved).toBe(false);
      expect(parsed.overdueOnly).toBe(true);
      expect(parsed.limit).toBe(25);
    });

    it('validates updateMistakeSchema', () => {
      const parsed = updateMistakeSchema.parse({
        rootCause: 'formula',
        notes: 'Forgot the 1/2 factor in kinetic energy formula',
        isResolved: true,
      });
      expect(parsed.rootCause).toBe('formula');
      expect(parsed.isResolved).toBe(true);
    });

    it('validates retryMistakeSchema', () => {
      const parsed = retryMistakeSchema.parse({
        selectedOptions: ['A'],
        timeSpentSeconds: 45,
      });
      expect(parsed.selectedOptions).toEqual(['A']);
      expect(parsed.timeSpentSeconds).toBe(45);
    });
  });
});
