// =============================================================================
// Mistake Engine — Error Classification, Repetition & Spaced Retry Rules
// =============================================================================

import type { MistakeRootCause, Question } from '@sharpmind/types';

/**
 * Standard spaced repetition intervals in days for mistaken questions.
 * Schedule: 1 day -> 3 days -> 7 days -> 21 days -> 45 days.
 */
export const MISTAKE_SPACED_INTERVALS = [1, 3, 7, 21, 45];

/**
 * Calculates the next retry interval and timestamp based on current repetition count.
 */
export function calculateNextRetry(repetitionCount: number, baseDate: Date = new Date()): {
  spacedIntervalDays: number;
  nextRetryAt: string;
} {
  const index = Math.min(repetitionCount - 1, MISTAKE_SPACED_INTERVALS.length - 1);
  const spacedIntervalDays = MISTAKE_SPACED_INTERVALS[Math.max(0, index)];

  const nextDate = new Date(baseDate.getTime() + spacedIntervalDays * 24 * 60 * 60 * 1000);
  return {
    spacedIntervalDays,
    nextRetryAt: nextDate.toISOString(),
  };
}

/**
 * Heuristically infers the likely mistake root cause from question metadata and attempt telemetry.
 */
export function inferMistakeRootCause(params: {
  question: Question;
  timeSpentSeconds: number;
  studentAnswer: any;
}): MistakeRootCause {
  const { question, timeSpentSeconds, studentAnswer } = params;

  // 1. Rushed response under 20s on non-easy question -> Guessing
  if (timeSpentSeconds < 20 && question.difficultyLevel !== 'easy') {
    return 'guessing';
  }

  // 2. Numerical arithmetic close miss -> Calculation
  if (question.questionType === 'numerical' && studentAnswer) {
    const studentNum = parseFloat(String(studentAnswer));
    const targetStr = question.options?.find((o) => o.isCorrect)?.optionText || question.explanation || '';
    const targetNum = parseFloat(targetStr);
    if (!isNaN(studentNum) && !isNaN(targetNum)) {
      const deviation = Math.abs(studentNum - targetNum) / Math.max(1, Math.abs(targetNum));
      if (deviation < 0.25) {
        return 'calculation';
      }
    }
  }

  // 3. High time spent (> 180s) on easy question resulting in error -> Misreading
  if (question.difficultyLevel === 'easy' && timeSpentSeconds > 180) {
    return 'misreading';
  }

  // 4. Case-based or application question -> Application
  if (question.pedagogicalType === 'application' || question.pedagogicalType === 'case_based') {
    return 'application';
  }

  // 5. Default root cause -> Conceptual
  return 'conceptual';
}

/**
 * Evaluates a retry attempt on a logged mistake.
 * If correct, marks resolved or increases interval.
 * If incorrect, escalates repetition count and schedules next spaced review.
 */
export function processMistakeRetry(params: {
  currentRepetition: number;
  isCorrect: boolean;
  baseDate?: Date;
}): {
  isResolved: boolean;
  resolvedAt?: string;
  repetitionCount: number;
  spacedIntervalDays: number;
  nextRetryAt: string;
} {
  const { currentRepetition, isCorrect, baseDate = new Date() } = params;

  if (isCorrect) {
    return {
      isResolved: true,
      resolvedAt: baseDate.toISOString(),
      repetitionCount: currentRepetition,
      spacedIntervalDays: 30,
      nextRetryAt: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  // If failed again, escalate repetition count
  const newRepetition = currentRepetition + 1;
  const { spacedIntervalDays, nextRetryAt } = calculateNextRetry(newRepetition, baseDate);

  return {
    isResolved: false,
    repetitionCount: newRepetition,
    spacedIntervalDays,
    nextRetryAt,
  };
}
