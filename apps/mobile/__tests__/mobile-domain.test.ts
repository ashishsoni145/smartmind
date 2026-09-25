import { mapCalibration, mapPlanTasks, mapRevisionDue, nextAction } from '../src/features/home/mapDashboard';
import { rejectLocalPremiumFlag, resolveEntitlement } from '../src/features/entitlements/entitlements';
import { selectiveSupport, validateRules } from '../src/features/focus/rules';
import { AnswerStore, type KeyValueStore } from '../src/services/answerStore';
import { enqueue, markResult, pendingItems } from '../src/services/syncQueue';
import { backPolicy } from '../src/navigation/backPolicy';
import { decodeBase64 } from '../src/utils/base64';
import { latexToPlain, parseMarkdown } from '../src/utils/markdown';
import { toUserError } from '../src/utils/errors';
import { ApiClientError } from '@sharpmind/api-client';

class MemoryStore implements KeyValueStore {
  values = new Map<string, string>();
  async read(key: string) { return this.values.get(key) ?? null; }
  async write(key: string, value: string) { this.values.set(key, value); }
}

describe('dashboard mapping', () => {
  it('does not invent mastery when the model is uncalibrated', () => {
    const view = mapCalibration({ totalEvidence: 0, overallMastery: 0.8 }, 'uncalibrated');
    expect(view.calibrated).toBe(false);
    expect(view.mastery).toBeNull();
  });

  it('keeps a real zero after evidence exists', () => {
    const view = mapCalibration({ totalEvidence: 4, overallMastery: 0, subjectSummaries: [] }, 'calibrated');
    expect(view.calibrated).toBe(true);
    expect(view.mastery).toBe(0);
  });

  it('maps planner tasks without fabricating missing durations', () => {
    const tasks = mapPlanTasks({ sessions: [{ id: 's1', tasks: [{ id: 't1', title: 'Kinematics', status: 'pending' }] }] });
    expect(tasks[0]).toMatchObject({ id: 't1', minutes: null, sessionId: 's1' });
  });

  it('chooses diagnostic before a local placeholder task', () => {
    const action = nextAction({ calibrated: false, tasks: [], revisions: [], backlogTitle: null });
    expect(action.title).toBe('Take the diagnostic');
  });

  it('reads revision items from either envelope', () => {
    expect(mapRevisionDue({ items: [{ id: 'r1', topicTitle: 'Waves' }] })).toHaveLength(1);
  });
});

describe('entitlements', () => {
  it('does not trust a local premium flag', () => {
    expect(rejectLocalPremiumFlag({ isPro: true })).toBe(true);
    const missing = resolveEntitlement({ fullName: 'Asha' });
    expect(missing.trusted).toBe(false);
    expect(missing.tier).toBeNull();
  });

  it('accepts only a server subscription object', () => {
    const trusted = resolveEntitlement({ subscription: { tier: 'pro', status: 'active' } });
    expect(trusted).toMatchObject({ trusted: true, source: 'server', tier: 'pro' });
  });
});

describe('restriction rules', () => {
  it('rejects settings and incomplete content targets', () => {
    expect(validateRules([{
      id: 'bad', packageName: 'com.android.settings', ruleType: 'APP_BLOCK', target: '*', enabled: true, priority: 1, focusSessionId: null, createdAt: 'now',
    }]).ok).toBe(false);
    expect(selectiveSupport('com.google.android.youtube')).toEqual(['shorts']);
    expect(selectiveSupport('com.example.game')).toEqual([]);
  });
});

describe('answer persistence', () => {
  it('keeps the newer local answer over an older server copy', async () => {
    const store = new AnswerStore(new MemoryStore());
    const local = {
      submissionId: 'sub',
      assessmentId: 'a',
      answers: { q1: { questionId: 'q1', selectedOptions: ['B'], numericalAnswer: '', status: 'answered' as const, timeSpentSeconds: 3, updatedAt: '2026-09-24T10:00:00.000Z' } },
      timeRemainingSeconds: 100,
      savedAt: '2026-09-24T10:00:00.000Z',
      sync: 'pending' as const,
    };
    await store.save(local);
    const loaded = await store.load('sub');
    const merged = store.merge(loaded, {
      q1: { questionId: 'q1', selectedOptions: ['A'], numericalAnswer: '', status: 'answered', timeSpentSeconds: 1, updatedAt: '2026-09-24T09:00:00.000Z' },
    });
    expect(merged.q1?.selectedOptions).toEqual(['B']);
  });
});

describe('sync and navigation', () => {
  it('tracks pending restriction events without marking them synchronized', () => {
    const queued = enqueue([], { id: 'e1', kind: 'restriction_triggered', payload: { packageName: 'com.example.game' } });
    expect(pendingItems(queued)).toHaveLength(1);
    expect(markResult(queued, 'e1', false, 'offline')[0]?.status).toBe('failed');
  });

  it('does not exit on the first root back press', () => {
    expect(backPolicy(true, false)).toBe('go-back');
    expect(backPolicy(false, false)).toBe('arm-exit');
    expect(backPolicy(false, true)).toBe('exit');
  });
});

describe('content rendering and errors', () => {
  it('renders math and code without claiming a full TeX engine', () => {
    expect(latexToPlain('\\frac{1}{2}')).toBe('(1)/(2)');
    const blocks = parseMarkdown('## Title\n\n```ts\nconst x = 1\n```');
    expect(blocks.map((block) => block.type)).toEqual(['heading', 'code']);
  });

  it('decodes an attachment payload without a DOM decoder', () => {
    expect(Array.from(decodeBase64('SGk='))).toEqual([72, 105]);
  });

  it('maps unauthorized responses to a session expiry', () => {
    const error = toUserError(new ApiClientError('nope', 401, 'UNAUTHORIZED'));
    expect(error.unauthorized).toBe(true);
    expect(error.message).toMatch(/session expired/i);
  });
});
