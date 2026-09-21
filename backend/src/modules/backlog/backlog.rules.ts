// =============================================================================
// Backlog Prioritization Rules — Deterministic, configurable, explainable
// Every backlog item carries reasons explaining its priority ranking.
// =============================================================================

import type { BacklogClassification, PriorityReason } from '@sharpmind/types';

// ---------------------------------------------------------------------------
// Configurable Priority Weights
// ---------------------------------------------------------------------------

export interface PriorityWeights {
  examProximity: number;      // How close is the exam deadline?
  curriculumImportance: number; // Topic weightage in exam
  weakness: number;           // 1 - mastery (lower mastery = higher priority)
  prerequisiteDepth: number;  // How many topics does this block?
  retentionDecay: number;     // How much has been forgotten?
  previousPerformance: number; // Historical accuracy (inversely)
  recency: number;            // How long since last practice?
}

export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  examProximity: 0.20,
  curriculumImportance: 0.15,
  weakness: 0.25,
  prerequisiteDepth: 0.10,
  retentionDecay: 0.15,
  previousPerformance: 0.05,
  recency: 0.10,
};

/** Maximum items in a generated backlog (prevents unbounded queries) */
export const MAX_BACKLOG_ITEMS = 200;

// ---------------------------------------------------------------------------
// Classification Logic
// ---------------------------------------------------------------------------

export interface ClassificationInput {
  evidenceCount: number;
  masteryScore: number;
  retention: number;       // 0-1 current retention
  lastPracticedAt: string | null;
  nextReviewDate: string | null;
  daysUntilExam: number | null;
}

/**
 * Classify a curriculum item into one of the backlog statuses.
 * Deterministic: same inputs always produce the same output.
 */
export function classifyBacklogItem(input: ClassificationInput): BacklogClassification {
  const { evidenceCount, masteryScore, retention, lastPracticedAt, nextReviewDate, daysUntilExam } = input;

  // Never touched
  if (evidenceCount === 0) return 'unstarted';

  // Exam is close and mastery is low
  if (daysUntilExam !== null && daysUntilExam <= 14 && masteryScore < 60) return 'at_risk';

  // Overdue for revision
  if (nextReviewDate) {
    const dueDate = new Date(nextReviewDate);
    const now = new Date();
    const overdueDays = (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24);
    if (overdueDays > 7) return 'overdue';
  }

  // Low retention — needs revision
  if (retention < 0.5 && evidenceCount > 0) return 'revision_due';

  // Weak mastery
  if (masteryScore < 40) return 'weak';

  // In progress — has evidence but not mastered
  if (masteryScore < 80) return 'in_progress';

  // Check if revision is due even though mastery is high
  if (retention < 0.7) return 'revision_due';

  return 'in_progress';
}

// ---------------------------------------------------------------------------
// Priority Score Computation
// ---------------------------------------------------------------------------

export interface PriorityInput {
  examProximityDays: number | null;  // Days until target exam
  weightagePercent: number;          // Curriculum weightage (0-100)
  masteryScore: number;              // 0-100
  prerequisiteCount: number;         // How many topics this blocks
  retention: number;                 // 0-1
  accuracy: number;                  // 0-1 historical accuracy
  daysSinceLastPractice: number | null;
}

export interface PriorityResult {
  score: number;
  reasons: PriorityReason[];
}

/**
 * Compute a priority score with explanation for a backlog item.
 * Higher score = higher priority.
 * Every factor contributes a sub-score and a human-readable explanation.
 */
export function computePriorityScore(
  input: PriorityInput,
  weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS
): PriorityResult {
  const reasons: PriorityReason[] = [];
  let totalScore = 0;

  // 1. Exam Proximity — closer exam = higher urgency
  const examDays = input.examProximityDays ?? 180;
  const examRaw = Math.max(0, 1 - examDays / 180); // 1 at 0 days, 0 at 180+ days
  const examContribution = examRaw * weights.examProximity * 100;
  totalScore += examContribution;
  reasons.push({
    factor: 'exam_proximity',
    weight: weights.examProximity,
    rawValue: examDays,
    contribution: Math.round(examContribution * 100) / 100,
    explanation: examDays <= 30
      ? `Exam in ${examDays} days — high urgency`
      : examDays <= 90
      ? `Exam in ${examDays} days — moderate urgency`
      : `Exam is ${examDays} days away`,
  });

  // 2. Curriculum Importance — higher weightage = higher priority
  const importanceRaw = (input.weightagePercent || 0) / 100;
  const importanceContribution = importanceRaw * weights.curriculumImportance * 100;
  totalScore += importanceContribution;
  reasons.push({
    factor: 'curriculum_importance',
    weight: weights.curriculumImportance,
    rawValue: input.weightagePercent || 0,
    contribution: Math.round(importanceContribution * 100) / 100,
    explanation: input.weightagePercent > 10
      ? `High exam weightage (${input.weightagePercent}%)`
      : `${input.weightagePercent || 0}% exam weightage`,
  });

  // 3. Weakness — lower mastery = higher priority
  const weaknessRaw = 1 - input.masteryScore / 100;
  const weaknessContribution = weaknessRaw * weights.weakness * 100;
  totalScore += weaknessContribution;
  reasons.push({
    factor: 'weakness',
    weight: weights.weakness,
    rawValue: input.masteryScore,
    contribution: Math.round(weaknessContribution * 100) / 100,
    explanation: input.masteryScore < 30
      ? `Very weak mastery (${input.masteryScore}%) — needs immediate attention`
      : input.masteryScore < 60
      ? `Below-average mastery (${input.masteryScore}%)`
      : `Mastery at ${input.masteryScore}%`,
  });

  // 4. Prerequisite Depth — blocking more topics = higher priority
  const prereqRaw = Math.min(1, input.prerequisiteCount / 5);
  const prereqContribution = prereqRaw * weights.prerequisiteDepth * 100;
  totalScore += prereqContribution;
  if (input.prerequisiteCount > 0) {
    reasons.push({
      factor: 'prerequisite_depth',
      weight: weights.prerequisiteDepth,
      rawValue: input.prerequisiteCount,
      contribution: Math.round(prereqContribution * 100) / 100,
      explanation: `Blocks ${input.prerequisiteCount} downstream topic(s)`,
    });
  }

  // 5. Retention Decay — forgetting more = higher priority
  const decayRaw = 1 - input.retention;
  const decayContribution = decayRaw * weights.retentionDecay * 100;
  totalScore += decayContribution;
  reasons.push({
    factor: 'retention_decay',
    weight: weights.retentionDecay,
    rawValue: Math.round(input.retention * 100),
    contribution: Math.round(decayContribution * 100) / 100,
    explanation: input.retention < 0.5
      ? `Significant forgetting (${Math.round(input.retention * 100)}% retention)`
      : `${Math.round(input.retention * 100)}% retention`,
  });

  // 6. Previous Performance — lower accuracy = higher priority
  const perfRaw = 1 - input.accuracy;
  const perfContribution = perfRaw * weights.previousPerformance * 100;
  totalScore += perfContribution;
  reasons.push({
    factor: 'previous_performance',
    weight: weights.previousPerformance,
    rawValue: Math.round(input.accuracy * 100),
    contribution: Math.round(perfContribution * 100) / 100,
    explanation: `${Math.round(input.accuracy * 100)}% historical accuracy`,
  });

  // 7. Recency — longer since last practice = higher priority
  const daysSince = input.daysSinceLastPractice ?? 90;
  const recencyRaw = Math.min(1, daysSince / 30); // Saturates at 30 days
  const recencyContribution = recencyRaw * weights.recency * 100;
  totalScore += recencyContribution;
  reasons.push({
    factor: 'recency',
    weight: weights.recency,
    rawValue: daysSince,
    contribution: Math.round(recencyContribution * 100) / 100,
    explanation: daysSince > 14
      ? `Not practiced in ${daysSince} days`
      : `Last practiced ${daysSince} day(s) ago`,
  });

  return {
    score: Math.round(totalScore * 100) / 100,
    reasons: reasons.sort((a, b) => b.contribution - a.contribution),
  };
}

/**
 * Rank items by priority score with tiebreaking.
 * Tiebreak: earlier deadline first, then alphabetical by title.
 */
export function rankBacklogItems<T extends { priorityScore: number; deadline: string | null; title: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;

    // Tiebreak: earlier deadline first
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;

    // Final tiebreak: alphabetical
    return a.title.localeCompare(b.title);
  });
}
