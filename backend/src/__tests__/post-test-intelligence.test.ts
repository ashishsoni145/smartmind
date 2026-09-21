import { describe, it, expect } from 'vitest';
import { analyzePostTestIntelligence } from '../modules/assessments/post-test.rules';
import type { Question, AssessmentAnswerItem } from '@sharpmind/types';

describe('Post-Test Intelligence — Diagnostics & Behavioral Traps', () => {
  const sampleQuestions: Question[] = [
    {
      id: 'q-easy-1',
      curriculumNodeId: 'node-kinematics',
      subjectId: 'physics',
      conceptId: 'concept-velocity',
      questionType: 'single_choice',
      difficultyLevel: 'easy',
      questionText: 'What is the SI unit of acceleration?',
      options: [
        { optionKey: 'A', optionText: 'm/s^2', isCorrect: true },
        { optionKey: 'B', optionText: 'm/s', isCorrect: false },
      ],
      marks: 4,
      negativeMarks: 1,
      sourceType: 'verified_source',
    },
    {
      id: 'q-hard-guess',
      curriculumNodeId: 'node-rotational',
      subjectId: 'physics',
      conceptId: 'concept-torque',
      questionType: 'single_choice',
      difficultyLevel: 'hard',
      questionText: 'Calculate moment of inertia of a composite hollow cone.',
      options: [
        { optionKey: 'A', optionText: '(3/10)MR^2', isCorrect: true },
        { optionKey: 'B', optionText: '(1/2)MR^2', isCorrect: false },
      ],
      marks: 4,
      negativeMarks: 1,
      sourceType: 'verified_source',
    },
    {
      id: 'q-num-calc',
      curriculumNodeId: 'node-optics',
      subjectId: 'physics',
      conceptId: 'concept-focal-length',
      questionType: 'numerical',
      difficultyLevel: 'medium',
      questionText: 'Determine the focal length in cm.',
      options: [{ optionKey: 'ans', optionText: '20.0', isCorrect: true }],
      marks: 4,
      negativeMarks: 0,
      sourceType: 'verified_source',
    },
    {
      id: 'q-time-sink',
      curriculumNodeId: 'node-thermo',
      subjectId: 'physics',
      conceptId: 'concept-entropy',
      questionType: 'single_choice',
      difficultyLevel: 'hard',
      questionText: 'Evaluate the Carnot cycle entropy change across multi-stage expansion.',
      options: [
        { optionKey: 'A', optionText: '0 J/K', isCorrect: true },
        { optionKey: 'B', optionText: '10 J/K', isCorrect: false },
      ],
      marks: 4,
      negativeMarks: 1,
      sourceType: 'verified_source',
    },
    {
      id: 'q-correct-item',
      curriculumNodeId: 'node-kinematics',
      subjectId: 'physics',
      conceptId: 'concept-displacement',
      questionType: 'single_choice',
      difficultyLevel: 'medium',
      questionText: 'Displacement is a vector quantity.',
      options: [
        { optionKey: 'A', optionText: 'True', isCorrect: true },
        { optionKey: 'B', optionText: 'False', isCorrect: false },
      ],
      marks: 4,
      negativeMarks: 1,
      sourceType: 'verified_source',
    },
  ];

  it('detects easy question misses with diagnostic explanation', () => {
    const answers: AssessmentAnswerItem[] = [
      {
        questionId: 'q-easy-1',
        selectedOptions: ['B'],
        isCorrect: false,
        timeSpentSeconds: 30,
        marksAwarded: -1,
        status: 'answered',
      },
    ];

    const result = analyzePostTestIntelligence({
      answers,
      questions: sampleQuestions,
      totalScore: -1,
      maxScore: 20,
      accuracyPercentage: 0,
      timeTakenSeconds: 30,
    });

    expect(result.easyQuestionMisses).toHaveLength(1);
    expect(result.easyQuestionMisses[0].questionId).toBe('q-easy-1');
    expect(result.recommendations.some((r) => r.includes('careless reading'))).toBe(true);
  });

  it('detects guessing when student rushes a hard problem in under 20 seconds and fails', () => {
    const answers: AssessmentAnswerItem[] = [
      {
        questionId: 'q-hard-guess',
        selectedOptions: ['B'],
        isCorrect: false,
        timeSpentSeconds: 12,
        marksAwarded: -1,
        status: 'answered',
      },
    ];

    const result = analyzePostTestIntelligence({
      answers,
      questions: sampleQuestions,
      totalScore: -1,
      maxScore: 20,
      accuracyPercentage: 0,
      timeTakenSeconds: 12,
    });

    expect(result.guessingDetected).toHaveLength(1);
    expect(result.guessingDetected[0].questionId).toBe('q-hard-guess');
    expect(result.guessingDetected[0].timeTakenSeconds).toBe(12);
    expect(result.recommendations.some((r) => r.includes('impulse guessing'))).toBe(true);
  });

  it('flags calculation errors when numerical answer is within 25% of target', () => {
    const answers: AssessmentAnswerItem[] = [
      {
        questionId: 'q-num-calc',
        numericalAnswer: '19.2', // Target is 20.0, deviation is 0.8/20 = 4% < 25%
        isCorrect: false,
        timeSpentSeconds: 90,
        marksAwarded: 0,
        status: 'answered',
      },
    ];

    const result = analyzePostTestIntelligence({
      answers,
      questions: sampleQuestions,
      totalScore: 0,
      maxScore: 20,
      accuracyPercentage: 0,
      timeTakenSeconds: 90,
    });

    expect(result.calculationErrors).toHaveLength(1);
    expect(result.calculationErrors[0].questionId).toBe('q-num-calc');
    expect(result.calculationErrors[0].studentAnswer).toBe('19.2');
    expect(result.calculationErrors[0].correctAnswer).toBe('20.0');
    expect(result.recommendations.some((r) => r.includes('double-check verification'))).toBe(true);
  });

  it('identifies time management bottleneck when over 240 seconds is spent on a question', () => {
    const answers: AssessmentAnswerItem[] = [
      {
        questionId: 'q-time-sink',
        selectedOptions: ['B'],
        isCorrect: false,
        timeSpentSeconds: 310,
        marksAwarded: -1,
        status: 'answered',
      },
    ];

    const result = analyzePostTestIntelligence({
      answers,
      questions: sampleQuestions,
      totalScore: -1,
      maxScore: 20,
      accuracyPercentage: 0,
      timeTakenSeconds: 310,
    });

    expect(result.timeManagementIssues).toHaveLength(1);
    expect(result.timeManagementIssues[0].issue).toContain('5 minutes');
    expect(result.recommendations.some((r) => r.includes('3-minute cap'))).toBe(true);
  });

  it('aggregates conceptual errors and groups weak topics by marks lost', () => {
    const answers: AssessmentAnswerItem[] = [
      {
        questionId: 'q-easy-1',
        selectedOptions: ['B'],
        isCorrect: false,
        timeSpentSeconds: 40,
        marksAwarded: -1,
        status: 'answered',
      },
      {
        questionId: 'q-correct-item',
        selectedOptions: ['A'],
        isCorrect: true,
        timeSpentSeconds: 30,
        marksAwarded: 4,
        status: 'answered',
      },
    ];

    const result = analyzePostTestIntelligence({
      answers,
      questions: sampleQuestions,
      totalScore: 3,
      maxScore: 20,
      accuracyPercentage: 50,
      timeTakenSeconds: 70,
    });

    expect(result.conceptualErrors).toHaveLength(1);
    expect(result.conceptualErrors[0].conceptId).toBe('concept-velocity');
    expect(result.weakTopics).toHaveLength(1);
    expect(result.weakTopics[0].curriculumNodeId).toBe('node-kinematics');
    expect(result.difficultyPerformance.easy.accuracy).toBe(0);
    expect(result.difficultyPerformance.medium.accuracy).toBe(100);
  });
});
