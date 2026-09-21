// =============================================================================
// Revision Rules — SM-2 scheduling, urgency computation, type selection
// =============================================================================

import type { RevisionType, RevisionOutcome } from '@sharpmind/types';

// ---------------------------------------------------------------------------
// SM-2 Algorithm Constants
// ---------------------------------------------------------------------------

export const SM2_MIN_EASE = 1.3;
export const SM2_MAX_EASE = 3.0;
export const SM2_INITIAL_EASE = 2.5;
export const SM2_INITIAL_INTERVAL = 1;

// ---------------------------------------------------------------------------
// Urgency Computation
// ---------------------------------------------------------------------------

export interface RevisionUrgencyInput {
  retention: number;           // 0-1 current estimated retention
  masteryScore: number;        // 0-100
  daysOverdue: number;         // Days past due date (0 if not overdue)
  daysUntilExam: number | null;
  mistakeCount: number;        // Number of unresolved mistakes on this topic
  curriculumImportance: number; // 0-100 weightage
}

/**
 * Compute revision urgency score (higher = more urgent).
 * Deterministic: same inputs always produce the same output.
 */
export function computeRevisionUrgency(input: RevisionUrgencyInput): number {
  let score = 0;

  // Factor 1: Retention loss (0-30 points)
  score += (1 - input.retention) * 30;

  // Factor 2: Overdue penalty (0-25 points)
  score += Math.min(25, input.daysOverdue * 2.5);

  // Factor 3: Exam proximity boost (0-20 points)
  if (input.daysUntilExam !== null) {
    score += Math.max(0, 20 - input.daysUntilExam * 0.15);
  }

  // Factor 4: Mistake severity (0-15 points)
  score += Math.min(15, input.mistakeCount * 5);

  // Factor 5: Importance (0-10 points)
  score += (input.curriculumImportance / 100) * 10;

  return Math.round(score * 100) / 100;
}

/**
 * Select the most appropriate revision type based on student state.
 */
export function selectRevisionType(
  masteryScore: number,
  retention: number,
  mistakeCount: number,
  hasFormulas: boolean
): RevisionType {
  // High mistake count → focus on mistakes
  if (mistakeCount >= 3) return 'mistake_revision';

  // Very low retention or mastery → need comprehensive review
  if (retention < 0.3 || masteryScore < 20) return 'practice_based';

  // Low retention but decent mastery → active recall to reinforce
  if (retention < 0.6) return 'active_recall';

  // Formula-heavy topic → formula revision
  if (hasFormulas && retention < 0.7) return 'formula_revision';

  // Moderate retention → quick review sufficient
  if (retention < 0.8) return 'quick_review';

  // Default: flashcard for maintenance
  return 'flashcard';
}

// ---------------------------------------------------------------------------
// SM-2 Scheduling Update
// ---------------------------------------------------------------------------

export interface SM2Input {
  currentEaseFactor: number;
  currentInterval: number;
  currentRepetition: number;
  outcome: RevisionOutcome;
}

export interface SM2Output {
  newEaseFactor: number;
  newInterval: number;
  newRepetition: number;
  nextDueDate: Date;
}

/**
 * SM-2 algorithm: update ease factor, interval, and repetition level.
 * 'recalled' → grade 5 (perfect), 'partially_recalled' → grade 3, 'forgot' → grade 1
 */
export function updateRevisionSchedule(input: SM2Input): SM2Output {
  const gradeMap: Record<RevisionOutcome, number> = {
    recalled: 5,
    partially_recalled: 3,
    forgot: 1,
  };

  const grade = gradeMap[input.outcome];

  let newEase = input.currentEaseFactor;
  let newInterval: number;
  let newRep: number;

  if (grade >= 3) {
    // Successful recall
    if (input.currentRepetition === 0) {
      newInterval = 1;
    } else if (input.currentRepetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(input.currentInterval * newEase);
    }
    newRep = input.currentRepetition + 1;

    // Update ease factor
    newEase = newEase + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  } else {
    // Failed recall: reset
    newRep = 0;
    newInterval = 1;

    // Decrease ease factor
    newEase = newEase - 0.2;
  }

  // Clamp ease factor
  newEase = Math.round(Math.max(SM2_MIN_EASE, Math.min(SM2_MAX_EASE, newEase)) * 100) / 100;

  // Clamp interval
  newInterval = Math.max(1, Math.min(365, newInterval));

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newInterval);

  return {
    newEaseFactor: newEase,
    newInterval,
    newRepetition: newRep,
    nextDueDate,
  };
}

/**
 * Compute current retention from last review date and stability.
 * Uses exponential decay: retention = e^(-t / stability)
 */
export function computeRetentionDecay(
  lastReviewedAt: string | null,
  intervalDays: number
): number {
  if (!lastReviewedAt) return 0;

  const elapsedMs = Date.now() - new Date(lastReviewedAt).getTime();
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

  if (elapsedDays < 0) return 1;

  // Use interval as proxy for stability
  const stability = Math.max(1, intervalDays);
  const retention = Math.exp(-elapsedDays / stability);

  return Math.round(Math.max(0, Math.min(1, retention)) * 1000) / 1000;
}
