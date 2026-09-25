/**
 * Revision review flow, kept pure so it can be tested.
 *
 * Backend contract (backend/src/modules/revision):
 *   POST /revision/:studentId/sessions           → creates a revision_event (returns { id, ... })
 *   POST /revision/:studentId/events/:id/complete → records outcome + measured time
 *
 * A review therefore has two server steps, and the outcome and duration are what the student
 * actually did: the timer starts when they open the item, and the outcome is the button they press.
 * Nothing defaults to "recalled" and no duration is invented.
 */
export type RevisionOutcome = 'recalled' | 'partially_recalled' | 'forgot';

export type ActiveReview = {
  itemId: string;
  eventId: string;
  startedAtEpochMs: number;
  revisionType: string;
};

export const OUTCOME_LABELS: Array<{ outcome: RevisionOutcome; label: string; hint: string }> = [
  { outcome: 'recalled', label: 'Recalled', hint: 'Got it without help' },
  { outcome: 'partially_recalled', label: 'Partly', hint: 'Needed a hint or got part of it' },
  { outcome: 'forgot', label: 'Forgot', hint: 'Could not recall it' },
];

/** Extracts the created event id; throws instead of falling back to the item id, which is a different table. */
export function eventIdFromCreateResponse(created: unknown): string {
  if (created && typeof created === 'object') {
    const record = created as Record<string, unknown>;
    const direct = record.id;
    if (typeof direct === 'string' && direct.length > 0) return direct;
    const nested = record.event;
    if (nested && typeof nested === 'object') {
      const id = (nested as Record<string, unknown>).id;
      if (typeof id === 'string' && id.length > 0) return id;
    }
  }
  throw new Error('The server did not return a revision event id, so the review cannot be recorded.');
}

export function measuredSeconds(review: ActiveReview, nowEpochMs: number): number {
  const seconds = Math.round((nowEpochMs - review.startedAtEpochMs) / 1000);
  // Guard against clock jumps; the server also validates.
  return Math.min(Math.max(seconds, 1), 6 * 60 * 60);
}

export function pickRevisionType(item: { recommendedType?: string | null }): string {
  const allowed = ['quick_review', 'active_recall', 'flashcard', 'formula_revision', 'mistake_revision', 'practice_based'];
  return item.recommendedType && allowed.includes(item.recommendedType) ? item.recommendedType : 'active_recall';
}
