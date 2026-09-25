import { ApiClientError } from '@sharpmind/api-client';
import { billingAvailability, describeBilling } from '../src/features/entitlements/billing';
import { initialOnboardingForm, toOnboardingPayload, toggleInList, validateOnboardingForm } from '../src/features/onboarding/onboardingForm';
import { eventIdFromCreateResponse, measuredSeconds, pickRevisionType } from '../src/features/revision/reviewFlow';
import { draftFor, selectOption, summarize, timeTakenSeconds, toSubmitAnswers } from '../src/features/tests/attemptModel';
import { toUserError } from '../src/utils/errors';
import { sniffImageType } from '../src/utils/imageType';

describe('onboarding form', () => {
  it('requires board, grade and a subject, matching the server schema', () => {
    const errors = validateOnboardingForm(initialOnboardingForm(new Date('2026-09-25')));
    expect(errors).toMatchObject({ boardId: expect.any(String), gradeId: expect.any(String), subjectIds: expect.any(String) });
    expect(errors.dailyHours).toBeUndefined();
  });

  it('validates hours and exam year and builds the API payload', () => {
    const now = new Date('2026-09-25');
    const form = { ...initialOnboardingForm(now), boardId: 'cbse', gradeId: 'g11', subjectIds: ['phy'], dailyHours: '20' };
    expect(validateOnboardingForm(form, now).dailyHours).toMatch(/16/);
    const withExam = { ...form, dailyHours: '2.5', examIds: ['jee'], targetYear: '2020' };
    expect(validateOnboardingForm(withExam, now).targetYear).toMatch(/2026/);
    const good = { ...withExam, targetYear: '2027' };
    expect(validateOnboardingForm(good, now)).toEqual({});
    expect(toOnboardingPayload(good)).toEqual({
      boardId: 'cbse',
      gradeId: 'g11',
      enrolledSubjects: ['phy'],
      targetExamGoals: [{ examId: 'jee', targetYear: 2027 }],
      currentPreparationLevel: 'beginner',
      dailyAvailableHours: 2.5,
      preferredStudyTime: 'evening',
      learningStylePreference: 'problem_solving_first',
    });
    expect(toggleInList(['a'], 'a')).toEqual([]);
    expect(toggleInList(['a'], 'b')).toEqual(['a', 'b']);
  });
});

describe('test attempt model', () => {
  it('toggles single vs multiple choice correctly', () => {
    expect(selectOption('single_choice', [], 'A')).toEqual(['A']);
    expect(selectOption('single_choice', ['A'], 'B')).toEqual(['B']);
    expect(selectOption('single_choice', ['A'], 'A')).toEqual([]);
    expect(selectOption('multiple_choice', ['A'], 'C')).toEqual(['A', 'C']);
    expect(selectOption('multiple_choice', ['A', 'C'], 'A')).toEqual(['C']);
  });

  it('never reports "answered" without an answer and summarises honestly', () => {
    const cleared = draftFor('q1', undefined, { selectedOptions: [], status: 'answered' }, '2026-01-01T00:00:00Z');
    expect(cleared.status).toBe('visited');
    const answered = draftFor('q1', cleared, { numericalAnswer: '42' }, '2026-01-01T00:00:01Z');
    expect(answered.status).toBe('answered');
    const marked = draftFor('q2', undefined, { status: 'marked_for_review' }, '2026-01-01T00:00:02Z');
    const summary = summarize({ q1: answered, q2: marked }, ['q1', 'q2', 'q3']);
    expect(summary).toEqual({ answered: 1, marked: 1, unanswered: 2, total: 3 });
    const payload = toSubmitAnswers({ q1: answered, q2: marked, q3: draftFor('q3', undefined, {}, '2026-01-01T00:00:03Z') });
    expect(payload.map((row) => row.questionId)).toEqual(['q1', 'q2']);
    expect(payload[0]).toMatchObject({ numericalAnswer: '42', status: 'answered' });
  });

  it('derives time taken from the server budget and local countdown', () => {
    expect(timeTakenSeconds(60, 3000)).toBe(600);
    expect(timeTakenSeconds(60, -5)).toBe(3600);
    expect(timeTakenSeconds(60, null)).toBe(0);
    expect(timeTakenSeconds(undefined, 10)).toBe(0);
  });
});

describe('revision review flow', () => {
  it('refuses to fall back to the item id when the server returns no event id', () => {
    expect(eventIdFromCreateResponse({ id: 'evt-1' })).toBe('evt-1');
    expect(eventIdFromCreateResponse({ event: { id: 'evt-2' } })).toBe('evt-2');
    expect(() => eventIdFromCreateResponse({})).toThrow(/event id/);
    expect(() => eventIdFromCreateResponse(null)).toThrow();
  });

  it('measures real time and only uses server-known revision types', () => {
    const review = { itemId: 'i', eventId: 'e', startedAtEpochMs: 10_000, revisionType: 'active_recall' };
    expect(measuredSeconds(review, 10_000)).toBe(1);
    expect(measuredSeconds(review, 10_000 + 95_500)).toBe(96);
    expect(pickRevisionType({ recommendedType: 'flashcard' })).toBe('flashcard');
    expect(pickRevisionType({ recommendedType: 'made_up' })).toBe('active_recall');
    expect(pickRevisionType({})).toBe('active_recall');
  });
});

describe('billing boundary', () => {
  it('reports not_available without a backend endpoint and shows nothing purchasable', async () => {
    const availability = await billingAvailability(null);
    expect(availability).toEqual({ status: 'not_available', reason: 'backend_endpoint_missing' });
    expect(describeBilling(availability)).toMatch(/not available/i);
    const provider = { availability: async () => ({ status: 'available' as const }), purchase: async () => ({ purchaseToken: 't', productId: 'p' }) };
    // Even with a device provider, no backend verification means no purchase path.
    expect(await billingAvailability(provider)).toEqual({ status: 'not_available', reason: 'backend_endpoint_missing' });
  });
});

describe('error mapping', () => {
  it('maps HTTP families to user-facing kinds', () => {
    expect(toUserError(new ApiClientError('nope', 403, 'FORBIDDEN'))).toMatchObject({ kind: 'forbidden', retryable: false });
    expect(toUserError(new ApiClientError('missing', 404, 'NOT_FOUND'))).toMatchObject({ kind: 'not_found' });
    expect(toUserError(new ApiClientError('conflict', 409, 'CONFLICT'))).toMatchObject({ kind: 'conflict' });
    expect(toUserError(new ApiClientError('bad', 422, 'VALIDATION'))).toMatchObject({ kind: 'validation', retryable: false });
    expect(toUserError(new ApiClientError('slow down', 429, 'RATE_LIMIT'))).toMatchObject({ kind: 'rate_limited', retryable: true });
    expect(toUserError(new ApiClientError('boom', 503, 'DOWN'))).toMatchObject({ kind: 'server', retryable: true });
    expect(toUserError(new TypeError('Network request failed'))).toMatchObject({ offline: true, retryable: true });
    const aborted = new Error('aborted');
    aborted.name = 'AbortError';
    expect(toUserError(aborted).code).toBe('ABORTED');
  });
});

describe('image sniffing', () => {
  it('detects supported formats by magic bytes and rejects others', () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))?.mimeType).toBe('image/jpeg');
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.mimeType).toBe('image/png');
    const webp = new Uint8Array(12);
    'RIFF'.split('').forEach((c, i) => { webp[i] = c.charCodeAt(0); });
    'WEBP'.split('').forEach((c, i) => { webp[8 + i] = c.charCodeAt(0); });
    expect(sniffImageType(webp)?.mimeType).toBe('image/webp');
    expect(sniffImageType(new Uint8Array([0x25, 0x50, 0x44, 0x46]))).toBeNull(); // %PDF
    expect(sniffImageType(new Uint8Array([]))).toBeNull();
  });
});
