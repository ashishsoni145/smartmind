// =============================================================================
// Exam Readiness & Simulation Rules — Grounded 8-Factor Model
// =============================================================================

import type { ReadinessFactor, SimulationScenario } from '@sharpmind/types';

export interface ReadinessComputationInput {
  totalSyllabusNodes: number;
  coveredSyllabusNodes: number;
  avgMastery: number; // 0.0 - 1.0
  avgRetention: number; // 0.0 - 1.0
  testsTaken: number;
  avgSecondsPerQuestion: number;
  targetSecondsPerQuestion?: number; // default 120s for JEE Main
  hardQuestionsAttempted: number;
  hardQuestionsCorrect: number;
  recentTestScores: number[]; // e.g. last 5 test percentages (0-100)
  totalMistakes: number;
  resolvedMistakes: number;
  overdueMistakes: number;
}

/**
 * Weights for the 8 Grounded Readiness Factors (Sum = 1.0)
 */
export const FACTOR_WEIGHTS = {
  syllabusCoverage: 0.20,
  conceptMastery: 0.25,
  retentionStability: 0.15,
  testExperience: 0.10,
  speedPacing: 0.10,
  highDifficultyAccuracy: 0.10,
  consistency: 0.05,
  revisionHealth: 0.05,
} as const;

function getStatus(score: number): 'critical' | 'needs_work' | 'good' | 'strong' {
  if (score < 40) return 'critical';
  if (score < 65) return 'needs_work';
  if (score < 80) return 'good';
  return 'strong';
}

/**
 * Computes each of the 8 exam readiness factors strictly from verifiable empirical telemetry.
 */
export function calculateReadinessFactors(input: ReadinessComputationInput): ReadinessFactor[] {
  const {
    totalSyllabusNodes,
    coveredSyllabusNodes,
    avgMastery,
    avgRetention,
    testsTaken,
    avgSecondsPerQuestion,
    targetSecondsPerQuestion = 120,
    hardQuestionsAttempted,
    hardQuestionsCorrect,
    recentTestScores,
    totalMistakes,
    resolvedMistakes,
    overdueMistakes,
  } = input;

  // 1. Syllabus Coverage (0 - 100)
  const coverageScore =
    totalSyllabusNodes > 0
      ? Math.min(100, Math.round((coveredSyllabusNodes / totalSyllabusNodes) * 100))
      : 50;

  // 2. Concept Mastery (0 - 100)
  const masteryScore = Math.min(100, Math.max(0, Math.round(avgMastery * 100)));

  // 3. Retention Stability (0 - 100)
  const retentionScore = Math.min(100, Math.max(0, Math.round(avgRetention * 100)));

  // 4. Test Experience (0 - 100) — Benchmark: 10 completed full/subject tests
  const experienceScore = Math.min(100, Math.round((testsTaken / 10) * 100));

  // 5. Speed & Pacing (0 - 100)
  let pacingScore = 70;
  if (avgSecondsPerQuestion > 0) {
    const ratio = avgSecondsPerQuestion / targetSecondsPerQuestion;
    if (ratio >= 0.75 && ratio <= 1.15) {
      pacingScore = 100;
    } else if (ratio < 0.75) {
      // Too fast, risk of careless mistakes
      pacingScore = Math.max(50, Math.round(ratio * 100));
    } else {
      // Too slow, risk of leaving questions unattempted
      const penalty = Math.min(50, (ratio - 1.15) * 60);
      pacingScore = Math.max(30, Math.round(100 - penalty));
    }
  }

  // 6. High Difficulty Accuracy (0 - 100)
  const hardAccuracy =
    hardQuestionsAttempted > 0
      ? Math.round((hardQuestionsCorrect / hardQuestionsAttempted) * 100)
      : 40; // baseline if no hard questions attempted yet

  // 7. Consistency & Volatility (0 - 100)
  let consistencyScore = 75;
  if (recentTestScores.length >= 2) {
    const mean = recentTestScores.reduce((a, b) => a + b, 0) / recentTestScores.length;
    const variance =
      recentTestScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      recentTestScores.length;
    const stdDev = Math.sqrt(variance);
    consistencyScore = Math.max(20, Math.min(100, Math.round(100 - stdDev * 2.5)));
  }

  // 8. Revision Health & Mistake Clearance (0 - 100)
  let revisionScore = 80;
  if (totalMistakes > 0) {
    const resolvedRate = resolvedMistakes / totalMistakes;
    const overduePenalty = Math.min(0.5, (overdueMistakes / totalMistakes) * 0.8);
    revisionScore = Math.max(10, Math.min(100, Math.round((resolvedRate * 0.7 + (1 - overduePenalty) * 0.3) * 100)));
  }

  return [
    {
      factor: 'Syllabus Coverage',
      name: 'Syllabus Coverage',
      key: 'syllabusCoverage',
      score: coverageScore,
      weight: FACTOR_WEIGHTS.syllabusCoverage,
      contribution: Math.round(coverageScore * FACTOR_WEIGHTS.syllabusCoverage * 10) / 10,
      explanation: `${coveredSyllabusNodes} of ${totalSyllabusNodes} chapters and topics active with practice data.`,
      description: `${coveredSyllabusNodes} of ${totalSyllabusNodes} chapters and topics active with practice data.`,
      status: getStatus(coverageScore),
    },
    {
      factor: 'Concept Mastery',
      name: 'Concept Mastery',
      key: 'conceptMastery',
      score: masteryScore,
      weight: FACTOR_WEIGHTS.conceptMastery,
      contribution: Math.round(masteryScore * FACTOR_WEIGHTS.conceptMastery * 10) / 10,
      explanation: `Weighted Bayesian mastery across syllabus concepts.`,
      description: `Weighted Bayesian mastery across syllabus concepts.`,
      status: getStatus(masteryScore),
    },
    {
      factor: 'Retention Stability',
      name: 'Retention Stability',
      key: 'retentionStability',
      score: retentionScore,
      weight: FACTOR_WEIGHTS.retentionStability,
      contribution: Math.round(retentionScore * FACTOR_WEIGHTS.retentionStability * 10) / 10,
      explanation: `Ebbinghaus memory decay estimate based on elapsed practice recency.`,
      description: `Ebbinghaus memory decay estimate based on elapsed practice recency.`,
      status: getStatus(retentionScore),
    },
    {
      factor: 'Test Experience & Volume',
      name: 'Test Experience & Volume',
      key: 'testExperience',
      score: experienceScore,
      weight: FACTOR_WEIGHTS.testExperience,
      contribution: Math.round(experienceScore * FACTOR_WEIGHTS.testExperience * 10) / 10,
      explanation: `${testsTaken} tests taken against target benchmark of 10 mock assessments.`,
      description: `${testsTaken} tests taken against target benchmark of 10 mock assessments.`,
      status: getStatus(experienceScore),
    },
    {
      factor: 'Speed & Pacing Discipline',
      name: 'Speed & Pacing Discipline',
      key: 'speedPacing',
      score: pacingScore,
      weight: FACTOR_WEIGHTS.speedPacing,
      contribution: Math.round(pacingScore * FACTOR_WEIGHTS.speedPacing * 10) / 10,
      explanation: `Average ${avgSecondsPerQuestion}s/question compared to exam benchmark (${targetSecondsPerQuestion}s).`,
      description: `Average ${avgSecondsPerQuestion}s/question compared to exam benchmark (${targetSecondsPerQuestion}s).`,
      status: getStatus(pacingScore),
    },
    {
      factor: 'High-Difficulty Performance',
      name: 'High-Difficulty Performance',
      key: 'highDifficultyAccuracy',
      score: hardAccuracy,
      weight: FACTOR_WEIGHTS.highDifficultyAccuracy,
      contribution: Math.round(hardAccuracy * FACTOR_WEIGHTS.highDifficultyAccuracy * 10) / 10,
      explanation: `${hardAccuracy}% accuracy across hard and multi-concept questions.`,
      description: `${hardAccuracy}% accuracy across hard and multi-concept questions.`,
      status: getStatus(hardAccuracy),
    },
    {
      factor: 'Performance Consistency',
      name: 'Performance Consistency',
      key: 'consistency',
      score: consistencyScore,
      weight: FACTOR_WEIGHTS.consistency,
      contribution: Math.round(consistencyScore * FACTOR_WEIGHTS.consistency * 10) / 10,
      explanation: `Test-to-test variance and stability across recent mock sittings.`,
      description: `Test-to-test variance and stability across recent mock sittings.`,
      status: getStatus(consistencyScore),
    },
    {
      factor: 'Revision & Mistake Health',
      name: 'Revision & Mistake Health',
      key: 'revisionHealth',
      score: revisionScore,
      weight: FACTOR_WEIGHTS.revisionHealth,
      contribution: Math.round(revisionScore * FACTOR_WEIGHTS.revisionHealth * 10) / 10,
      explanation: `${resolvedMistakes} resolved mistakes, ${overdueMistakes} pending spaced reviews.`,
      description: `${resolvedMistakes} resolved mistakes, ${overdueMistakes} pending spaced reviews.`,
      status: getStatus(revisionScore),
    },
  ];
}

/**
 * Computes composite readiness score from factors.
 */
export function computeCompositeReadiness(factors: ReadinessFactor[]): number {
  const sum = factors.reduce((acc, f) => acc + f.score * f.weight, 0);
  return Math.round(Math.min(100, Math.max(0, sum)) * 10) / 10;
}

/**
 * Computes projected score range for the target exam under current state.
 */
export function calculateProjectedScoreRange(
  readinessScore: number,
  maxExamMarks: number = 300
): { min: number; max: number } {
  const baseCenter = (readinessScore / 100) * maxExamMarks;
  const spread = Math.round(maxExamMarks * 0.08); // ±8% confidence band

  return {
    min: Math.max(0, Math.round(baseCenter - spread)),
    max: Math.min(maxExamMarks, Math.round(baseCenter + spread)),
  };
}

/**
 * Generates transparent simulation projections with explicit, declared assumptions.
 */
export function generateSimulationScenarios(params: {
  currentReadiness: number;
  maxMarks?: number;
  daysRemaining?: number;
}): SimulationScenario[] {
  const { currentReadiness, maxMarks = 300, daysRemaining = 90 } = params;

  // Scenario 1: Baseline Trajectory
  const baseDelta = Math.min(6, Math.max(0, Math.round(daysRemaining * 0.05)));
  const baseScore = Math.min(100, Math.round((currentReadiness + baseDelta) * 10) / 10);
  const baseMarks = Math.round((baseScore / 100) * maxMarks);

  // Scenario 2: Disciplined Target Mode
  const targetDelta = Math.min(18, Math.max(4, Math.round(daysRemaining * 0.15)));
  const targetScore = Math.min(100, Math.round((currentReadiness + targetDelta) * 10) / 10);
  const targetMarks = Math.round((targetScore / 100) * maxMarks);

  // Scenario 3: High-Intensity Sprint
  const sprintDelta = Math.min(28, Math.max(8, Math.round(daysRemaining * 0.25)));
  const sprintScore = Math.min(100, Math.round((currentReadiness + sprintDelta) * 10) / 10);
  const sprintMarks = Math.round((sprintScore / 100) * maxMarks);

  return [
    {
      id: 'current_trajectory',
      title: 'Current Study Trajectory',
      description: 'Continuing at your historical study rhythm and current revision completion rate.',
      assumptions: [
        'Maintains existing 1.5–2 hours/day study pace',
        'Partial completion (~50%) of spaced revision cues',
        'No increase in mock exam frequency',
      ],
      projectedScore: baseMarks,
      projectedReadinessDelta: baseDelta,
      confidenceInterval: {
        min: Math.max(0, baseMarks - 15),
        max: Math.min(maxMarks, baseMarks + 15),
      },
    },
    {
      id: 'disciplined_routine',
      title: 'Target Exam Discipline (Recommended)',
      description: 'Structured 4 hours/day schedule with timely spaced review clearance and weekly mocks.',
      assumptions: [
        'Daily dedicated study time of 4.0 hours',
        '100% adherence to spaced repetition retry dates',
        '1 full-length mock exam every Sunday with comprehensive post-test review',
      ],
      projectedScore: targetMarks,
      projectedReadinessDelta: targetDelta,
      confidenceInterval: {
        min: Math.max(0, targetMarks - 20),
        max: Math.min(maxMarks, targetMarks + 20),
      },
    },
    {
      id: 'intensive_sprint',
      title: 'High-Intensity Chapter Sprint',
      description: 'Deep focus targeting high-weightage weak chapters and daily timed problem sets.',
      assumptions: [
        'Intensive 6+ hours/day syllabus ramp',
        'Clearing all overdue mistakes within 72 hours',
        '2 full-length mocks per week with error-book consolidation',
        'Requires sustained consistency without burnout',
      ],
      projectedScore: sprintMarks,
      projectedReadinessDelta: sprintDelta,
      confidenceInterval: {
        min: Math.max(0, sprintMarks - 25),
        max: Math.min(maxMarks, sprintMarks + 25),
      },
    },
  ];
}

/**
 * Derives actionable next-best actions from factor weak points.
 */
export function generateRecommendedInterventions(
  factors: ReadinessFactor[],
  overdueMistakes: number
): string[] {
  const recommendations: string[] = [];

  const coverage = factors.find((f) => f.key === 'syllabusCoverage');
  if (coverage && coverage.score < 60) {
    recommendations.push(
      'Prioritize untouched core syllabus chapters to expand syllabus coverage above 75%.'
    );
  }

  const pacing = factors.find((f) => f.key === 'speedPacing');
  if (pacing && pacing.score < 70) {
    recommendations.push(
      'Engage in 20-minute timed speed sprints to train pacing and reduce excessive time per problem.'
    );
  }

  if (overdueMistakes > 0) {
    recommendations.push(
      `Clear ${overdueMistakes} overdue mistake retries to reinforce weak concepts before memory decay sets in.`
    );
  }

  const testExp = factors.find((f) => f.key === 'testExperience');
  if (testExp && testExp.score < 50) {
    recommendations.push(
      'Take at least 2 full-syllabus mock assessments this month to build exam temperament and stamina.'
    );
  }

  const hardAcc = factors.find((f) => f.key === 'highDifficultyAccuracy');
  if (hardAcc && hardAcc.score < 50) {
    recommendations.push(
      'Attempt 5 HOTS (Higher Order Thinking Skills) problems daily to build advanced problem-solving depth.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Maintain your strong revision schedule and take regular full mock exams to sustain exam sharpness.'
    );
  }

  return recommendations;
}
