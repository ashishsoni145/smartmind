import { describe, it, expect } from 'vitest';
import {
  validateAnswer,
  sanitizeQuestionForActiveTest,
  selectAdaptiveQuestions,
} from '../modules/questions/question.rules';
import type { Question } from '@sharpmind/types';

describe('Question Domain — Validation, Sanitization & Adaptive Selection', () => {
  const sampleMcq: Question = {
    id: 'q-mcq-1',
    subjectId: 'physics',
    questionText: 'What is the acceleration due to gravity on Earth surface?',
    questionType: 'single_choice',
    pedagogicalType: 'conceptual',
    difficultyLevel: 'easy',
    marks: 4.0,
    isPyq: false,
    isImportant: false,
    appearanceFrequency: 1,
    patternTags: [],
    isVerified: true,
    isGenerated: false,
    options: [
      { optionKey: 'A', optionText: '9.8 m/s^2', isCorrect: true },
      { optionKey: 'B', optionText: '8.9 m/s^2', isCorrect: false },
      { optionKey: 'C', optionText: '11.2 m/s^2', isCorrect: false },
    ],
  };

  const sampleMultiCorrect: Question = {
    id: 'q-multi-1',
    subjectId: 'physics',
    questionText: 'Which of the following are vector quantities?',
    questionType: 'multiple_choice',
    pedagogicalType: 'conceptual',
    difficultyLevel: 'medium',
    marks: 4.0,
    isPyq: true,
    isImportant: true,
    appearanceFrequency: 2,
    patternTags: [],
    isVerified: true,
    isGenerated: false,
    options: [
      { optionKey: 'A', optionText: 'Velocity', isCorrect: true },
      { optionKey: 'B', optionText: 'Acceleration', isCorrect: true },
      { optionKey: 'C', optionText: 'Speed', isCorrect: false },
      { optionKey: 'D', optionText: 'Mass', isCorrect: false },
    ],
  };

  const sampleNumerical: Question = {
    id: 'q-num-1',
    subjectId: 'physics',
    questionText: 'Calculate the kinetic energy (in Joules) of a 2 kg mass moving at 3 m/s.',
    questionType: 'numerical',
    pedagogicalType: 'application',
    difficultyLevel: 'medium',
    marks: 4.0,
    explanation: '9.0',
    isPyq: true,
    isImportant: false,
    appearanceFrequency: 1,
    patternTags: [],
    isVerified: true,
    isGenerated: false,
    options: [
      { optionKey: 'ans', optionText: '9.0', isCorrect: true },
    ],
  };

  describe('Answer Validation', () => {
    it('evaluates single_choice MCQ correctly and awards positive marks', () => {
      const result = validateAnswer({
        question: sampleMcq,
        selectedOptions: ['A'],
      });
      expect(result.isCorrect).toBe(true);
      expect(result.marksAwarded).toBe(4.0);
    });

    it('evaluates single_choice MCQ incorrectly and applies negative marking', () => {
      const result = validateAnswer(
        {
          question: sampleMcq,
          selectedOptions: ['B'],
        },
        { correct: 4.0, incorrect: -1.0 }
      );
      expect(result.isCorrect).toBe(false);
      expect(result.marksAwarded).toBe(-1.0);
    });

    it('evaluates multiple_choice with all correct selections', () => {
      const result = validateAnswer({
        question: sampleMultiCorrect,
        selectedOptions: ['A', 'B'],
      });
      expect(result.isCorrect).toBe(true);
      expect(result.marksAwarded).toBe(4.0);
    });

    it('awards partial marks for multiple_choice with subset of correct options and zero incorrect', () => {
      const result = validateAnswer({
        question: sampleMultiCorrect,
        selectedOptions: ['A'],
      });
      expect(result.isCorrect).toBe(false);
      expect(result.marksAwarded).toBe(2.0); // 1 of 2 correct = 50%
    });

    it('penalizes multiple_choice when any incorrect option is selected', () => {
      const result = validateAnswer(
        {
          question: sampleMultiCorrect,
          selectedOptions: ['A', 'C'], // C is wrong
        },
        { correct: 4.0, incorrect: -1.0 }
      );
      expect(result.isCorrect).toBe(false);
      expect(result.marksAwarded).toBe(-1.0);
    });

    it('evaluates numerical answer within standard tolerance (±0.05)', () => {
      const exact = validateAnswer({
        question: sampleNumerical,
        numericalAnswer: '9.0',
      });
      expect(exact.isCorrect).toBe(true);

      const withinTol = validateAnswer({
        question: sampleNumerical,
        numericalAnswer: '9.03',
      });
      expect(withinTol.isCorrect).toBe(true);

      const outsideTol = validateAnswer({
        question: sampleNumerical,
        numericalAnswer: '9.5',
      });
      expect(outsideTol.isCorrect).toBe(false);
      expect(outsideTol.marksAwarded).toBe(-1.0);
    });

    it('handles unattempted questions with zero marks awarded', () => {
      const unattempted = validateAnswer({
        question: sampleMcq,
        selectedOptions: [],
      });
      expect(unattempted.isCorrect).toBe(false);
      expect(unattempted.marksAwarded).toBe(0);
      expect(unattempted.feedback).toBe('Unattempted');
    });
  });

  describe('Client Sanitization (Anti-Leakage)', () => {
    it('strips isCorrect, explanation, and hint from questions delivered during test', () => {
      const sanitized = sanitizeQuestionForActiveTest(sampleMcq);

      expect(sanitized.id).toBe(sampleMcq.id);
      expect(sanitized.questionText).toBe(sampleMcq.questionText);
      expect((sanitized as any).explanation).toBeUndefined();
      expect((sanitized as any).hint).toBeUndefined();

      sanitized.options?.forEach((opt) => {
        expect((opt as any).isCorrect).toBeUndefined();
        expect(opt.optionKey).toBeDefined();
        expect(opt.optionText).toBeDefined();
      });
    });
  });

  describe('Adaptive Question Selection', () => {
    const questionsPool: Question[] = [
      {
        ...sampleMcq,
        id: 'q-easy-1',
        conceptId: 'conc-rot-1',
        difficultyLevel: 'easy',
      },
      {
        ...sampleMcq,
        id: 'q-med-1',
        conceptId: 'conc-rot-1',
        difficultyLevel: 'medium',
      },
      {
        ...sampleMcq,
        id: 'q-hard-1',
        conceptId: 'conc-rot-1',
        difficultyLevel: 'hard',
      },
      {
        ...sampleMcq,
        id: 'q-recent-1',
        conceptId: 'conc-rot-1',
        difficultyLevel: 'easy',
      },
    ];

    it('selects easier questions when student has weak mastery (<40%)', () => {
      const selected = selectAdaptiveQuestions(questionsPool, {
        conceptMasteryMap: { 'conc-rot-1': 20 }, // Weak mastery
        recentQuestionIds: new Set(['q-recent-1']), // Should exclude q-recent-1
        targetCount: 1,
      });

      expect(selected.length).toBe(1);
      expect(selected[0].id).toBe('q-easy-1');
      expect(selected[0].difficultyLevel).toBe('easy');
    });

    it('selects challenging questions when student has high mastery (>75%)', () => {
      const selected = selectAdaptiveQuestions(questionsPool, {
        conceptMasteryMap: { 'conc-rot-1': 85 }, // High mastery
        recentQuestionIds: new Set(),
        targetCount: 1,
      });

      expect(selected.length).toBe(1);
      expect(selected[0].id).toBe('q-hard-1');
      expect(selected[0].difficultyLevel).toBe('hard');
    });

    it('excludes questions attempted recently', () => {
      const selected = selectAdaptiveQuestions(questionsPool, {
        conceptMasteryMap: { 'conc-rot-1': 20 },
        recentQuestionIds: new Set(['q-easy-1', 'q-recent-1']),
        targetCount: 1,
      });

      // q-easy-1 and q-recent-1 excluded -> picks q-med-1
      expect(selected[0].id).toBe('q-med-1');
    });
  });
});
