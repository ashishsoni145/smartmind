// =============================================================================
// Student Model Update Rules — Deterministic, testable, no LLM involvement
// All state mutations go through these pure functions.
// =============================================================================

import type { KnowledgeStatus } from '@sharpmind/types';

// ---------------------------------------------------------------------------
// Configuration Constants
// ---------------------------------------------------------------------------

/** Target retention for scheduling next review (90%) */
export const TARGET_RETENTION = 0.9;

/** Minimum evidence count before the system has reasonable confidence */
export const MIN_EVIDENCE_FOR_CONFIDENCE = 3;

/** Maximum stability in days (cap to prevent infinite intervals) */
export const MAX_STABILITY_DAYS = 365;

/** Mastery threshold to be considered "mastered" */
export const MASTERY_THRESHOLD = 80;

/** Mastery threshold below which a topic is considered "weak" */
export const WEAK_THRESHOLD = 40;

/** Retention threshold below which revision is recommended */
export const RETENTION_THRESHOLD = 0.7;

/** Weights for recency in mastery computation (exponential decay) */
export const RECENCY_HALF_LIFE_DAYS = 14;

// ---------------------------------------------------------------------------
// Evidence Representation for Rules
// ---------------------------------------------------------------------------

export interface EvidenceRecord {
  isCorrect: boolean | null;
  timeTakenSeconds: number | null;
  scoreOrPerformance: number | null;
  difficultyLevel: string | null;
  createdAt: string; // ISO timestamp
  confidenceSelfReport: number | null;
}

// ---------------------------------------------------------------------------
// Core Computation Functions
// ---------------------------------------------------------------------------

/**
 * Compute mastery score from evidence history.
 * Uses recency-weighted accuracy: recent evidence counts more than old evidence.
 * Difficulty-adjusted: correct answers on harder questions boost mastery more.
 */
export function computeMasteryFromEvidence(evidenceLogs: EvidenceRecord[]): number {
  const scored = evidenceLogs.filter((e) => e.isCorrect !== null);
  if (scored.length === 0) return 0;

  const now = Date.now();
  let weightedCorrect = 0;
  let weightedTotal = 0;

  for (const ev of scored) {
    const ageMs = now - new Date(ev.createdAt).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    // Exponential recency weight: recent evidence matters more
    const recencyWeight = Math.exp(-ageDays * Math.LN2 / RECENCY_HALF_LIFE_DAYS);

    // Difficulty multiplier: harder questions carry more weight
    const difficultyMultiplier = getDifficultyMultiplier(ev.difficultyLevel);

    const weight = recencyWeight * difficultyMultiplier;
    weightedTotal += weight;

    if (ev.isCorrect) {
      weightedCorrect += weight;
    }
  }

  if (weightedTotal === 0) return 0;

  const rawMastery = (weightedCorrect / weightedTotal) * 100;
  return Math.round(Math.min(100, Math.max(0, rawMastery)) * 100) / 100;
}

/**
 * Compute current memory retention using Ebbinghaus-inspired exponential decay.
 * retention = e^(-t / stability)
 * where t is time since last practice in days, stability is memory strength in days.
 */
export function computeRetention(
  lastPracticedAt: string | null,
  stabilityDays: number
): number {
  if (!lastPracticedAt || stabilityDays <= 0) return 0;

  const now = Date.now();
  const lastMs = new Date(lastPracticedAt).getTime();
  const elapsedDays = (now - lastMs) / (1000 * 60 * 60 * 24);

  if (elapsedDays < 0) return 1; // Future timestamp (clock skew), assume full retention

  const retention = Math.exp(-elapsedDays / stabilityDays);
  return Math.round(Math.min(1, Math.max(0, retention)) * 1000) / 1000;
}

/**
 * Compute system confidence in its mastery estimate.
 * Higher evidence count, more recent evidence, and more consistent results → higher confidence.
 * Returns 0-1 where 1 = highly confident.
 */
export function computeConfidence(
  evidenceCount: number,
  lastEvidenceAt: string | null,
  streakCorrect: number,
  streakIncorrect: number
): number {
  if (evidenceCount === 0) return 0;

  // Factor 1: Evidence volume (logarithmic saturation)
  const volumeFactor = Math.min(1, Math.log2(evidenceCount + 1) / Math.log2(MIN_EVIDENCE_FOR_CONFIDENCE + 1));

  // Factor 2: Recency of last evidence
  let recencyFactor = 0;
  if (lastEvidenceAt) {
    const ageDays = (Date.now() - new Date(lastEvidenceAt).getTime()) / (1000 * 60 * 60 * 24);
    recencyFactor = Math.exp(-ageDays / 30); // Decays over ~30 days
  }

  // Factor 3: Consistency (long streaks indicate consistent performance)
  const maxStreak = Math.max(streakCorrect, streakIncorrect);
  const consistencyFactor = Math.min(1, maxStreak / 5);

  // Weighted combination
  const confidence = volumeFactor * 0.5 + recencyFactor * 0.3 + consistencyFactor * 0.2;
  return Math.round(Math.min(1, Math.max(0, confidence)) * 1000) / 1000;
}

/**
 * Update memory stability after a review.
 * Inspired by FSRS: successful recall increases stability, forgetting resets it.
 */
export function updateStabilityAfterReview(
  currentStability: number,
  outcome: 'recalled' | 'partially_recalled' | 'forgot'
): number {
  let newStability: number;

  switch (outcome) {
    case 'recalled':
      // Successful recall: stability grows (diminishing returns)
      newStability = currentStability * (1 + 0.5 * Math.log2(currentStability + 1));
      break;
    case 'partially_recalled':
      // Partial recall: small stability increase
      newStability = currentStability * 1.2;
      break;
    case 'forgot':
      // Forgot: stability resets to a fraction
      newStability = Math.max(0.5, currentStability * 0.3);
      break;
    default:
      newStability = currentStability;
  }

  return Math.round(Math.min(MAX_STABILITY_DAYS, Math.max(0.5, newStability)) * 100) / 100;
}

/**
 * Classify knowledge status based on mastery, retention, and evidence.
 */
export function classifyStatus(
  masteryScore: number,
  retention: number,
  evidenceCount: number
): KnowledgeStatus {
  if (evidenceCount === 0) return 'not_started';
  if (masteryScore >= MASTERY_THRESHOLD && retention >= RETENTION_THRESHOLD) return 'mastered';
  if (retention < RETENTION_THRESHOLD && evidenceCount > 0) return 'needs_revision';
  return 'in_progress';
}

/**
 * Compute when the next review should happen to maintain target retention.
 * Solves: TARGET_RETENTION = e^(-t / stability) → t = -stability * ln(TARGET_RETENTION)
 */
export function computeNextReviewDate(
  stabilityDays: number,
  targetRetention: number = TARGET_RETENTION
): Date {
  if (stabilityDays <= 0 || targetRetention <= 0 || targetRetention >= 1) {
    return new Date(); // Review now
  }

  const intervalDays = -stabilityDays * Math.log(targetRetention);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + Math.max(1, Math.round(intervalDays)));
  return nextDate;
}

/**
 * Compute uncertainty (inverse of confidence). High uncertainty = low confidence.
 * Used to indicate how much we should trust the mastery estimate.
 */
export function computeUncertainty(
  evidenceCount: number,
  lastEvidenceAt: string | null,
  streakCorrect: number,
  streakIncorrect: number
): number {
  const confidence = computeConfidence(evidenceCount, lastEvidenceAt, streakCorrect, streakIncorrect);
  return Math.round((1 - confidence) * 1000) / 1000;
}

/**
 * Update p_know (probability of knowing) based on new evidence.
 * Simple Bayesian update: correct answer increases p_know, incorrect decreases.
 * Adjusted for difficulty level.
 */
export function updatePKnow(
  currentPKnow: number,
  isCorrect: boolean,
  difficultyLevel: string | null
): number {
  const slip = 0.1; // probability of getting correct answer by chance when you don't know
  const guess = getDifficultyGuessRate(difficultyLevel);

  if (isCorrect) {
    // P(know | correct) = P(correct | know) * P(know) / P(correct)
    const pCorrectKnow = 1 - slip;
    const pCorrectNotKnow = guess;
    const pCorrect = pCorrectKnow * currentPKnow + pCorrectNotKnow * (1 - currentPKnow);
    return pCorrect > 0
      ? Math.round(Math.min(0.999, (pCorrectKnow * currentPKnow) / pCorrect) * 1000) / 1000
      : currentPKnow;
  } else {
    // P(know | incorrect) = P(incorrect | know) * P(know) / P(incorrect)
    const pIncorrectKnow = slip;
    const pIncorrectNotKnow = 1 - guess;
    const pIncorrect = pIncorrectKnow * currentPKnow + pIncorrectNotKnow * (1 - currentPKnow);
    return pIncorrect > 0
      ? Math.round(Math.max(0.001, (pIncorrectKnow * currentPKnow) / pIncorrect) * 1000) / 1000
      : currentPKnow;
  }
}

/**
 * Compute p_forget from current retention and stability.
 */
export function computePForget(
  lastPracticedAt: string | null,
  stabilityDays: number
): number {
  const retention = computeRetention(lastPracticedAt, stabilityDays);
  return Math.round((1 - retention) * 1000) / 1000;
}

/**
 * Update streaks based on new evidence.
 */
export function updateStreaks(
  currentStreakCorrect: number,
  currentStreakIncorrect: number,
  isCorrect: boolean
): { streakCorrect: number; streakIncorrect: number } {
  if (isCorrect) {
    return { streakCorrect: currentStreakCorrect + 1, streakIncorrect: 0 };
  } else {
    return { streakCorrect: 0, streakIncorrect: currentStreakIncorrect + 1 };
  }
}

/**
 * Compute rolling average time taken.
 */
export function updateAvgTime(
  currentAvg: number | null,
  currentCount: number,
  newTimeTaken: number | null
): number | null {
  if (newTimeTaken === null || newTimeTaken === undefined) return currentAvg;
  if (currentAvg === null || currentCount === 0) return newTimeTaken;

  // Exponential moving average with alpha = 0.3 for responsiveness
  const alpha = 0.3;
  return Math.round((alpha * newTimeTaken + (1 - alpha) * currentAvg) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Full State Recomputation
// ---------------------------------------------------------------------------

export interface RecomputedState {
  masteryScore: number;
  confidenceScore: number;
  pKnow: number;
  pForget: number;
  stabilityDays: number;
  totalQuestionsAttempted: number;
  totalCorrect: number;
  evidenceCount: number;
  streakCorrect: number;
  streakIncorrect: number;
  avgTimeSeconds: number | null;
  lastEvidenceAt: string | null;
  nextRecommendedReviewAt: string;
  status: KnowledgeStatus;
  uncertainty: number;
  modelVersion: number;
  inferredAt: string;
}

/**
 * Recompute full knowledge state from complete evidence history.
 * This is the canonical recomputation function — idempotent and deterministic.
 */
export function recomputeStateFromEvidence(
  evidenceLogs: EvidenceRecord[],
  currentStability: number = 1.0,
  currentModelVersion: number = 1
): RecomputedState {
  if (evidenceLogs.length === 0) {
    return {
      masteryScore: 0,
      confidenceScore: 0,
      pKnow: 0,
      pForget: 1,
      stabilityDays: 1,
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      evidenceCount: 0,
      streakCorrect: 0,
      streakIncorrect: 0,
      avgTimeSeconds: null,
      lastEvidenceAt: null,
      nextRecommendedReviewAt: new Date().toISOString(),
      status: 'not_started',
      uncertainty: 1,
      modelVersion: currentModelVersion,
      inferredAt: new Date().toISOString(),
    };
  }

  // Sort by created_at ascending for sequential processing
  const sorted = [...evidenceLogs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Compute aggregates
  let pKnow = 0.5; // Prior: 50/50
  let streakCorrect = 0;
  let streakIncorrect = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;
  let avgTime: number | null = null;
  let stability = currentStability;

  for (const ev of sorted) {
    if (ev.isCorrect !== null) {
      totalAttempted++;
      if (ev.isCorrect) totalCorrect++;

      pKnow = updatePKnow(pKnow, ev.isCorrect, ev.difficultyLevel);
      const streaks = updateStreaks(streakCorrect, streakIncorrect, ev.isCorrect);
      streakCorrect = streaks.streakCorrect;
      streakIncorrect = streaks.streakIncorrect;

      // Update stability based on outcome
      const outcome = ev.isCorrect ? 'recalled' : 'forgot';
      stability = updateStabilityAfterReview(stability, outcome);
    }

    avgTime = updateAvgTime(avgTime, totalAttempted, ev.timeTakenSeconds);
  }

  const lastEvidence = sorted[sorted.length - 1];
  const lastEvidenceAt = lastEvidence.createdAt;

  const masteryScore = computeMasteryFromEvidence(evidenceLogs);
  const retention = computeRetention(lastEvidenceAt, stability);
  const confidence = computeConfidence(
    sorted.length, lastEvidenceAt, streakCorrect, streakIncorrect
  );
  const uncertainty = computeUncertainty(
    sorted.length, lastEvidenceAt, streakCorrect, streakIncorrect
  );
  const status = classifyStatus(masteryScore, retention, sorted.length);
  const nextReview = computeNextReviewDate(stability);

  return {
    masteryScore,
    confidenceScore: Math.round(confidence * 100 * 100) / 100,
    pKnow,
    pForget: Math.round((1 - retention) * 1000) / 1000,
    stabilityDays: stability,
    totalQuestionsAttempted: totalAttempted,
    totalCorrect,
    evidenceCount: sorted.length,
    streakCorrect,
    streakIncorrect,
    avgTimeSeconds: avgTime,
    lastEvidenceAt,
    nextRecommendedReviewAt: nextReview.toISOString(),
    status,
    uncertainty,
    modelVersion: currentModelVersion + 1,
    inferredAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDifficultyMultiplier(difficulty: string | null): number {
  switch (difficulty) {
    case 'easy': return 0.8;
    case 'medium': return 1.0;
    case 'hard': return 1.3;
    case 'olympiad': return 1.5;
    default: return 1.0;
  }
}

function getDifficultyGuessRate(difficulty: string | null): number {
  switch (difficulty) {
    case 'easy': return 0.35;
    case 'medium': return 0.25;
    case 'hard': return 0.15;
    case 'olympiad': return 0.1;
    default: return 0.25;
  }
}
