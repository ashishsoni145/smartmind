import type { AnswerDraft } from '../../services/answerStore';

/** Pure helpers for the test runner; the server remains the grader. */

export type QuestionKind = 'single_choice' | 'multiple_choice' | 'numerical' | string;

export function selectOption(kind: QuestionKind, current: string[], optionKey: string): string[] {
  if (kind === 'multiple_choice') {
    return current.includes(optionKey) ? current.filter((key) => key !== optionKey) : [...current, optionKey].sort();
  }
  return current[0] === optionKey ? [] : [optionKey];
}

export function draftFor(questionId: string, previous: AnswerDraft | undefined, patch: Partial<AnswerDraft>, nowIso: string): AnswerDraft {
  const next: AnswerDraft = {
    questionId,
    selectedOptions: previous?.selectedOptions || [],
    numericalAnswer: previous?.numericalAnswer || '',
    status: previous?.status || 'visited',
    timeSpentSeconds: previous?.timeSpentSeconds || 0,
    updatedAt: nowIso,
    ...patch,
  };
  const hasAnswer = next.selectedOptions.length > 0 || next.numericalAnswer.trim().length > 0;
  if (next.status === 'answered' && !hasAnswer) next.status = 'visited';
  if (next.status === 'visited' && hasAnswer) next.status = 'answered';
  return next;
}

export type AttemptSummary = { answered: number; marked: number; unanswered: number; total: number };

export function summarize(drafts: Record<string, AnswerDraft>, questionIds: string[]): AttemptSummary {
  let answered = 0;
  let marked = 0;
  questionIds.forEach((id) => {
    const draft = drafts[id];
    if (!draft) return;
    const hasAnswer = draft.selectedOptions.length > 0 || draft.numericalAnswer.trim().length > 0;
    if (hasAnswer) answered += 1;
    if (draft.status === 'marked_for_review') marked += 1;
  });
  return { answered, marked, unanswered: questionIds.length - answered, total: questionIds.length };
}

/** Time taken is what the server-issued budget minus the local countdown says, never negative. */
export function timeTakenSeconds(durationMinutes: number | null | undefined, remainingSeconds: number | null): number {
  const budget = Math.max(0, Math.round((durationMinutes || 0) * 60));
  if (remainingSeconds == null) return 0;
  return Math.max(0, budget - Math.max(0, remainingSeconds));
}

/** Answers payload for submit: drop untouched questions, keep numeric answers as trimmed strings. */
export function toSubmitAnswers(drafts: Record<string, AnswerDraft>): Array<{ questionId: string; selectedOptions: string[]; numericalAnswer?: string; timeSpentSeconds: number; status: AnswerDraft['status'] }> {
  return Object.values(drafts)
    .filter((draft) => draft.selectedOptions.length > 0 || draft.numericalAnswer.trim().length > 0 || draft.status === 'marked_for_review')
    .map((draft) => ({
      questionId: draft.questionId,
      selectedOptions: draft.selectedOptions,
      ...(draft.numericalAnswer.trim() ? { numericalAnswer: draft.numericalAnswer.trim() } : {}),
      timeSpentSeconds: draft.timeSpentSeconds,
      status: draft.status,
    }));
}
