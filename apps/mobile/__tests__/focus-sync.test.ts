import { ApiClientError } from '@sharpmind/api-client';
import { FOCUS_QUEUE_KEY, FocusSyncOutbox, type FocusRemote, type QueueStorage } from '../src/features/focus/focusSync';
import { allowedActions, describePhase, elapsedMs, remainingMs, validateSetup } from '../src/features/focus/focusModel';
import type { FocusSnapshot } from '../src/features/focus/nativeFocus';
import { MAX_SYNC_ATTEMPTS, backoffMs, deserializeQueue, dueItems, enqueue, markResult, serializeQueue, shouldAttempt, type SyncItem } from '../src/services/syncQueue';

function memoryStorage(initial: Record<string, string> = {}): QueueStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    async read(key) {
      return data[key] ?? '';
    },
    async write(key, value) {
      data[key] = value;
    },
  };
}

function remoteStub(overrides: Partial<FocusRemote> = {}): FocusRemote & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    interruption: async (sessionId, data) => {
      calls.push(`interruption:${sessionId}:${data.reason}`);
      return {};
    },
    complete: async (sessionId, data) => {
      calls.push(`complete:${sessionId}:${data.actualDurationSeconds}`);
      return {};
    },
    ...overrides,
  };
}

function snapshot(partial: Partial<FocusSnapshot>): FocusSnapshot {
  return {
    id: 'native-1',
    objective: 'Thermodynamics problems',
    targetDurationMinutes: 25,
    strictMode: false,
    phase: 'ACTIVE',
    startedAtEpochMs: 1_000,
    accumulatedActiveMs: 0,
    activeElapsedMs: 0,
    snapshotAtEpochMs: 1_000,
    endedAtEpochMs: null,
    backendSessionId: null,
    failureReason: null,
    subjectId: null,
    curriculumNodeId: null,
    taskId: null,
    restrictionRuleIds: [],
    ...partial,
  };
}

describe('sync queue backoff and dedupe', () => {
  it('ignores a second enqueue with the same id', () => {
    const once = enqueue([], { id: 'evt-1', kind: 'restriction_triggered', payload: {} });
    const twice = enqueue(once, { id: 'evt-1', kind: 'restriction_triggered', payload: { different: true } });
    expect(twice).toBe(once);
    expect(twice).toHaveLength(1);
  });

  it('backs off exponentially and abandons after the attempt cap', () => {
    expect(backoffMs(0)).toBe(0);
    expect(backoffMs(1)).toBe(5_000);
    expect(backoffMs(2)).toBe(10_000);
    expect(backoffMs(3)).toBe(20_000);
    expect(backoffMs(20)).toBe(10 * 60_000);

    let items = enqueue([], { id: 'evt-2', kind: 'focus_completed', payload: {} });
    const t0 = new Date('2026-01-01T00:00:00Z');
    items = markResult(items, 'evt-2', false, 'offline', t0);
    expect(items[0].status).toBe('failed');
    expect(shouldAttempt(items[0], t0.getTime() + 1_000)).toBe(false);
    expect(shouldAttempt(items[0], t0.getTime() + 5_000)).toBe(true);
    expect(dueItems(items, t0.getTime() + 1_000)).toHaveLength(0);

    for (let i = 1; i < MAX_SYNC_ATTEMPTS; i += 1) {
      items = markResult(items, 'evt-2', false, 'offline', t0);
    }
    expect(items[0].status).toBe('abandoned');
    expect(items[0].attempts).toBe(MAX_SYNC_ATTEMPTS);
    expect(shouldAttempt(items[0], Number.MAX_SAFE_INTEGER)).toBe(false);
  });

  it('round-trips through storage and drops malformed rows', () => {
    const items = enqueue([], { id: 'evt-3', kind: 'focus_cancelled', payload: { activeElapsedMs: 1200 } });
    const restored = deserializeQueue(serializeQueue(items));
    expect(restored).toEqual(items);
    expect(deserializeQueue('{"v":1,"items":[{"id":1},null,"x"]}')).toEqual([]);
    expect(deserializeQueue('not json')).toEqual([]);
    expect(deserializeQueue('{"v":2,"items":[]}')).toEqual([]);
  });
});

describe('FocusSyncOutbox', () => {
  it('holds items until a backend session id is attached, then sends exactly once', async () => {
    const storage = memoryStorage();
    const remote = remoteStub();
    const outbox = new FocusSyncOutbox(storage, remote);
    await outbox.add({ id: 'r-1', kind: 'restriction_triggered', payload: { nativeSessionId: 'native-1', ruleType: 'APP_BLOCK', packageName: 'com.instagram.android' } });

    const held = await outbox.flush(Date.now());
    expect(held.attempted).toBe(0);
    expect(remote.calls).toEqual([]);

    const patched = await outbox.patchPayload((item) => item.payload.nativeSessionId === 'native-1', { backendSessionId: 'srv-9' });
    expect(patched).toBe(1);

    const sent = await outbox.flush(Date.now());
    expect(sent).toEqual({ attempted: 1, synchronized: 1, failed: 0, rejected: 0 });
    expect(remote.calls).toEqual(['interruption:srv-9:restriction:APP_BLOCK:com.instagram.android']);

    // Re-delivery of the same native event is a no-op; a second flush sends nothing.
    await outbox.add({ id: 'r-1', kind: 'restriction_triggered', payload: { nativeSessionId: 'native-1', backendSessionId: 'srv-9' } });
    const again = await outbox.flush(Date.now());
    expect(again.attempted).toBe(0);
    expect(remote.calls).toHaveLength(1);

    // Persisted for the next process.
    const restored = new FocusSyncOutbox(memoryStorage(storage.data), remoteStub());
    const items = await restored.load();
    expect(items.find((item) => item.id === 'r-1')?.status).toBe('synchronized');
  });

  it('abandons 4xx rejections, retries 5xx/offline with backoff, and stops on 401', async () => {
    const storage = memoryStorage();
    const t0 = Date.parse('2026-01-01T00:00:00Z');
    const remote = remoteStub({
      complete: async (sessionId) => {
        if (sessionId === 'gone') throw new ApiClientError('not found', 404, 'NOT_FOUND');
        if (sessionId === 'down') throw new ApiClientError('server error', 503, 'UNAVAILABLE');
        if (sessionId === 'expired') throw new ApiClientError('unauthorized', 401, 'UNAUTHORIZED');
        return {};
      },
    });
    const outbox = new FocusSyncOutbox(storage, remote);
    await outbox.add({ id: 'c-1', kind: 'focus_completed', payload: { backendSessionId: 'gone', activeElapsedMs: 60_000 } });
    await outbox.add({ id: 'c-2', kind: 'focus_completed', payload: { backendSessionId: 'down', activeElapsedMs: 60_000 } });
    await outbox.add({ id: 'c-3', kind: 'focus_completed', payload: { backendSessionId: 'expired', activeElapsedMs: 60_000 } });
    await outbox.add({ id: 'c-4', kind: 'focus_completed', payload: { backendSessionId: 'ok', activeElapsedMs: 60_000 } });

    const first = await outbox.flush(t0);
    expect(first.rejected).toBe(1);
    expect(first.failed).toBe(2); // 503 + 401
    expect(first.synchronized).toBe(0); // 401 broke the loop before c-4
    const byId = Object.fromEntries(outbox.snapshot().map((item) => [item.id, item]));
    expect(byId['c-1'].status).toBe('abandoned');
    expect(byId['c-2'].status).toBe('failed');
    expect(byId['c-4'].status).toBe('pending');

    // Immediately after, the failed item is still backing off but the pending one goes.
    const second = await outbox.flush(t0 + 1);
    expect(second.attempted).toBe(1);
    expect(outbox.snapshot().find((item) => item.id === 'c-4')?.status).toBe('synchronized');
  });

  it('runs only one flush at a time and persists under the focus queue key', async () => {
    const gate: { release: (() => void) | null } = { release: null };
    let completeCalls = 0;
    const remote = remoteStub({
      complete: () => new Promise<unknown>((resolve) => {
        completeCalls += 1;
        gate.release = () => resolve({});
      }),
    });
    const storage = memoryStorage();
    const outbox = new FocusSyncOutbox(storage, remote);
    await outbox.add({ id: 'p-1', kind: 'focus_completed', payload: { backendSessionId: 's', activeElapsedMs: 0 } });
    const a = outbox.flush();
    const b = outbox.flush();
    // The remote is reached after a few awaits; wait for it before releasing.
    while (!gate.release) await new Promise<void>((resolve) => setTimeout(resolve, 1));
    gate.release();
    const [first, second] = await Promise.all([a, b]);
    expect(first).toEqual(second);
    expect(completeCalls).toBe(1);
    expect(first.attempted).toBe(1);
    expect(storage.data[FOCUS_QUEUE_KEY]).toContain('"p-1"');
  });
});

describe('focus clock and phase model', () => {
  it('extrapolates the active clock from the snapshot time and clamps at the target', () => {
    const active = snapshot({ phase: 'ACTIVE', activeElapsedMs: 10_000, snapshotAtEpochMs: 1_000, targetDurationMinutes: 5 });
    expect(elapsedMs(active, 1_000)).toBe(10_000);
    expect(elapsedMs(active, 4_000)).toBe(13_000);
    expect(remainingMs(active, 4_000)).toBe(5 * 60_000 - 13_000);
    expect(remainingMs(active, 10 * 60_000)).toBe(0);

    const paused = snapshot({ phase: 'PAUSED', activeElapsedMs: 10_000, snapshotAtEpochMs: 1_000 });
    expect(elapsedMs(paused, 99_000)).toBe(10_000);
    expect(elapsedMs(null, 5)).toBe(0);
  });

  it('exposes only the actions the state machine allows', () => {
    expect(allowedActions(null).canStartNew).toBe(true);
    const active = allowedActions(snapshot({ phase: 'ACTIVE' }));
    expect(active).toMatchObject({ canPause: true, canResume: false, canEnd: true, canStartNew: false });
    const paused = allowedActions(snapshot({ phase: 'PAUSED' }));
    expect(paused).toMatchObject({ canPause: false, canResume: true, canStartNew: false });
    const needsPermission = allowedActions(snapshot({ phase: 'PERMISSION_REQUIRED' }));
    expect(needsPermission.canRetryPermissions).toBe(true);
    expect(needsPermission.canPause).toBe(false);
    const done = allowedActions(snapshot({ phase: 'COMPLETED' }));
    expect(done.canStartNew).toBe(true);
    expect(done.canEnd).toBe(false);
  });

  it('describes recovery and expiry honestly', () => {
    expect(describePhase(snapshot({ phase: 'PAUSED', failureReason: 'interrupted_process_restart' })).detail).toMatch(/stopped|frozen/i);
    expect(describePhase(snapshot({ phase: 'COMPLETED', failureReason: 'target_reached' })).detail).toMatch(/target|reached/i);
    expect(describePhase(snapshot({ phase: 'PERMISSION_REQUIRED', failureReason: 'permission_revoked' })).detail).toMatch(/permission/i);
  });

  it('validates setup input the same way the native machine does', () => {
    expect(validateSetup('ab', '25')).toMatchObject({ ok: false, field: 'objective' });
    expect(validateSetup('Solve integrals', '4')).toMatchObject({ ok: false, field: 'minutes' });
    expect(validateSetup('Solve integrals', '181')).toMatchObject({ ok: false, field: 'minutes' });
    expect(validateSetup('Solve integrals', 'abc')).toMatchObject({ ok: false, field: 'minutes' });
    expect(validateSetup('  Solve integrals ', '45')).toEqual({ ok: true, minutes: 45, objective: 'Solve integrals' });
  });
});

describe('sync item shape', () => {
  it('keeps required fields for the UI', () => {
    const item: SyncItem = enqueue([], { id: 'x', kind: 'focus_started', payload: {} })[0];
    expect(item).toMatchObject({ id: 'x', status: 'pending', attempts: 0 });
    expect(typeof item.createdAt).toBe('string');
  });
});
