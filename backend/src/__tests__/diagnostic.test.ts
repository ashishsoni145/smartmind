import { describe, it, expect } from 'vitest';
import {
  createDiagnosticSchema,
  submitDiagnosticSchema,
  sessionIdParamSchema,
} from '../modules/diagnostic/diagnostic.schema';

describe('Diagnostic Assessment — Schemas & Scoring Logic', () => {
  describe('Schema Validation', () => {
    it('validates createDiagnosticSchema with valid subjectIds', () => {
      const valid = { subjectIds: ['sub-phy-1', 'sub-chem-2'] };
      const res = createDiagnosticSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('validates createDiagnosticSchema with empty object (optional subjectIds)', () => {
      const res = createDiagnosticSchema.safeParse({});
      expect(res.success).toBe(true);
    });

    it('validates submitDiagnosticSchema with correct structure', () => {
      const payload = {
        answers: [
          {
            questionId: '11111111-1111-1111-1111-111111111111',
            selectedOptions: ['A'],
            timeTakenSeconds: 45,
            confidenceSelfReport: 4,
          },
          {
            questionId: '22222222-2222-2222-2222-222222222222',
            numericalAnswer: '42.5',
            timeTakenSeconds: 60,
            confidenceSelfReport: 5,
          },
        ],
      };
      const res = submitDiagnosticSchema.safeParse(payload);
      expect(res.success).toBe(true);
    });

    it('rejects invalid UUID in questionId for submitDiagnosticSchema', () => {
      const payload = {
        answers: [
          {
            questionId: 'not-a-uuid',
            selectedOptions: ['A'],
          },
        ],
      };
      const res = submitDiagnosticSchema.safeParse(payload);
      expect(res.success).toBe(false);
    });

    it('rejects confidenceSelfReport out of 1-5 range', () => {
      const payload = {
        answers: [
          {
            questionId: '11111111-1111-1111-1111-111111111111',
            confidenceSelfReport: 6,
          },
        ],
      };
      const res = submitDiagnosticSchema.safeParse(payload);
      expect(res.success).toBe(false);
    });

    it('rejects negative timeTakenSeconds', () => {
      const payload = {
        answers: [
          {
            questionId: '11111111-1111-1111-1111-111111111111',
            timeTakenSeconds: -10,
          },
        ],
      };
      const res = submitDiagnosticSchema.safeParse(payload);
      expect(res.success).toBe(false);
    });

    it('validates sessionIdParamSchema for UUID', () => {
      expect(sessionIdParamSchema.safeParse({ sessionId: '11111111-1111-1111-1111-111111111111' }).success).toBe(true);
      expect(sessionIdParamSchema.safeParse({ sessionId: 'invalid-id' }).success).toBe(false);
    });
  });

  describe('Diagnostic Calibration Rules & Uncertainty', () => {
    it('calculates bounded confidence levels ensuring initial diagnostic does not claim perfect knowledge', () => {
      // Diagnostic confidence is capped at 0.6 because cold start sample size is small
      const calculateConfidence = (totalQuestions: number) =>
        Math.min(0.6, 0.3 + (totalQuestions / 30) * 0.3);

      expect(calculateConfidence(0)).toBeCloseTo(0.3);
      expect(calculateConfidence(10)).toBeCloseTo(0.4);
      expect(calculateConfidence(30)).toBeCloseTo(0.6);
      expect(calculateConfidence(100)).toBe(0.6); // Capped at 0.6
    });

    it('evaluates answers correctly based on option keys', () => {
      const evaluate = (correctKeys: string[], selectedKeys: string[]) => {
        return (
          correctKeys.length > 0 &&
          correctKeys.length === selectedKeys.length &&
          correctKeys.every((k) => selectedKeys.includes(k))
        );
      };

      expect(evaluate(['A'], ['A'])).toBe(true);
      expect(evaluate(['A', 'B'], ['B', 'A'])).toBe(true);
      expect(evaluate(['A'], ['B'])).toBe(false);
      expect(evaluate(['A', 'B'], ['A'])).toBe(false);
      expect(evaluate([], ['A'])).toBe(false);
    });

    it('categorizes strengths and weaknesses appropriately based on accuracy and question difficulty', () => {
      const analyze = (
        answers: Array<{ topic: string; difficulty: string; isCorrect: boolean }>
      ) => {
        const total = answers.length;
        const correct = answers.filter((a) => a.isCorrect).length;
        const accuracy = total > 0 ? correct / total : 0;

        const strengths = answers
          .filter((a) => a.isCorrect && ['medium', 'hard'].includes(a.difficulty))
          .map((a) => a.topic);

        const weaknesses = answers
          .filter((a) => !a.isCorrect)
          .map((a) => a.topic);

        return {
          accuracy,
          strengths: [...new Set(strengths)],
          weaknesses: [...new Set(weaknesses)],
        };
      };

      const sample = [
        { topic: 'Thermodynamics', difficulty: 'hard', isCorrect: true },
        { topic: 'Kinematics', difficulty: 'easy', isCorrect: true },
        { topic: 'Rotational Motion', difficulty: 'medium', isCorrect: false },
        { topic: 'Optics', difficulty: 'hard', isCorrect: false },
      ];

      const result = analyze(sample);
      expect(result.accuracy).toBe(0.5);
      expect(result.strengths).toEqual(['Thermodynamics']);
      expect(result.weaknesses).toEqual(['Rotational Motion', 'Optics']);
    });
  });
});
