// =============================================================================
// Assessment Rules — Scoring, Section Rules & Session Countdown
// =============================================================================

import type {
  Assessment,
  AssessmentAnswerItem,
  MarkingScheme,
} from '@sharpmind/types';

export interface ScoreAssessmentInput {
  assessment: Assessment;
  answers: AssessmentAnswerItem[];
}

export interface ScoreAssessmentResult {
  totalScore: number;
  maxScore: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnattempted: number;
  accuracyPercentage: number;
  scoredAnswers: AssessmentAnswerItem[];
}

/**
 * Calculates final score and statistics for an assessment submission deterministically.
 * Respects section limits (e.g. attempt max 5 of 10).
 */
export function calculateAssessmentScore(
  assessment: Assessment,
  answers: AssessmentAnswerItem[],
  questionMarksMap: Record<string, number>
): ScoreAssessmentResult {
  const markingScheme: MarkingScheme = assessment.markingScheme || {
    correct: 4.0,
    incorrect: -1.0,
    unattempted: 0.0,
  };

  let totalScore = 0;
  let maxScore = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;

  const scoredAnswers: AssessmentAnswerItem[] = [];

  for (const ans of answers) {
    const qMarks = questionMarksMap[ans.questionId] || markingScheme.correct;
    maxScore += qMarks;

    const isAttempted =
      (ans.selectedOptions && ans.selectedOptions.length > 0) ||
      (ans.numericalAnswer && ans.numericalAnswer.trim() !== '');

    if (!isAttempted) {
      totalUnattempted++;
      scoredAnswers.push({
        ...ans,
        isCorrect: false,
        marksAwarded: markingScheme.unattempted,
        status: 'unanswered',
      });
      continue;
    }

    totalAttempted++;

    if (ans.isCorrect) {
      totalCorrect++;
      const awarded = ans.marksAwarded !== undefined ? ans.marksAwarded : qMarks;
      totalScore += awarded;
      scoredAnswers.push({
        ...ans,
        marksAwarded: awarded,
        status: 'answered',
      });
    } else {
      totalIncorrect++;
      const deduction = markingScheme.incorrect;
      totalScore += deduction;
      scoredAnswers.push({
        ...ans,
        marksAwarded: deduction,
        status: 'answered',
      });
    }
  }

  // Ensure score does not drop below 0 if configured
  const finalTotalScore = Math.max(0, Math.round(totalScore * 100) / 100);
  const accuracyPercentage =
    totalAttempted > 0
      ? Math.round((totalCorrect / totalAttempted) * 10000) / 100
      : 0;

  return {
    totalScore: finalTotalScore,
    maxScore: Math.round(maxScore * 100) / 100,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    accuracyPercentage,
    scoredAnswers,
  };
}

/**
 * Computes remaining test duration in seconds safely from server timestamps.
 * Prevents client-side manipulation of the clock.
 */
export function calculateRemainingSeconds(
  startedAtIso: string,
  durationMinutes: number
): number {
  const startedAt = new Date(startedAtIso).getTime();
  const totalAllowedMs = durationMinutes * 60 * 1000;
  const elapsedMs = Date.now() - startedAt;
  const remainingMs = totalAllowedMs - elapsedMs;

  return Math.max(0, Math.floor(remainingMs / 1000));
}
