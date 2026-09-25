import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { focusApiRemote } from '../../api';
import type { SyncItem } from '../../services/syncQueue';
import { toUserError, type UserFacingError } from '../../utils/errors';
import { FocusSyncOutbox } from './focusSync';
import { describeRestrictionEvent } from './focusModel';
import { focusNative, NativeUnavailableError, type FocusSnapshot } from './nativeFocus';

const LINK_PREFIX = 'focus.link.';

let sharedOutbox: FocusSyncOutbox | null = null;
function outbox(): FocusSyncOutbox {
  if (!sharedOutbox) {
    sharedOutbox = new FocusSyncOutbox(
      { read: (key) => focusNative.cacheRead(key), write: (key, value) => focusNative.cacheWrite(key, value) },
      {
        interruption: (sessionId, data) => focusApiRemote.interruption(sessionId, data),
        complete: (sessionId, data) => focusApiRemote.complete(sessionId, data),
      },
    );
  }
  return sharedOutbox;
}

export type FocusActivity = { id: string; at: number; text: string };

export type FocusSessionState = {
  snapshot: FocusSnapshot | null;
  error: UserFacingError | null;
  serverLink: 'idle' | 'linking' | 'linked' | 'failed' | 'offline';
  serverError: UserFacingError | null;
  activity: FocusActivity[];
  queue: SyncItem[];
  refresh: () => Promise<void>;
  run: (action: () => Promise<FocusSnapshot>) => Promise<FocusSnapshot | null>;
  linkToServer: () => Promise<void>;
  flushQueue: () => Promise<void>;
  clearError: () => void;
};

/**
 * Single subscription point for the native focus engine. The Kotlin runtime owns the state;
 * this hook mirrors snapshots, forwards restriction events to the persistent outbox, and
 * links the native session to a server session exactly once per native session id.
 */
export function useFocusSession(): FocusSessionState {
  const [snapshot, setSnapshot] = useState<FocusSnapshot | null>(null);
  const [error, setError] = useState<UserFacingError | null>(null);
  const [serverLink, setServerLink] = useState<FocusSessionState['serverLink']>('idle');
  const [serverError, setServerError] = useState<UserFacingError | null>(null);
  const [activity, setActivity] = useState<FocusActivity[]>([]);
  const [queue, setQueue] = useState<SyncItem[]>([]);
  const linking = useRef<string | null>(null);
  const snapshotRef = useRef<FocusSnapshot | null>(null);
  snapshotRef.current = snapshot;
  const endedHandled = useRef<string | null>(null);
  const mounted = useRef(true);

  const pushActivity = useCallback((text: string, id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`) => {
    setActivity((current) => [{ id, at: Date.now(), text }, ...current].slice(0, 12));
  }, []);

  const refresh = useCallback(async () => {
    if (!focusNative.available()) return;
    try {
      const next = await focusNative.status();
      if (mounted.current) {
        setSnapshot(next);
        setError(null);
      }
    } catch (err) {
      if (mounted.current) setError(toUserError(err));
    }
  }, []);

  const flushQueue = useCallback(async () => {
    try {
      const result = await outbox().flush();
      if (result.attempted > 0 && mounted.current) {
        pushActivity(`Synced ${result.synchronized} event(s) with the server${result.failed ? `, ${result.failed} will retry` : ''}${result.rejected ? `, ${result.rejected} rejected` : ''}.`);
      }
    } catch {
      // Flush errors are reflected per item.
    }
  }, [pushActivity]);

  const linkToServer = useCallback(async () => {
    const current = snapshot;
    if (!current || !current.id || current.backendSessionId) return;
    if (linking.current === current.id) return;
    linking.current = current.id;
    setServerLink('linking');
    setServerError(null);
    try {
      // Idempotency: if a server session was created for this native id before a crash, reuse it.
      let serverId = '';
      try {
        serverId = await focusNative.cacheRead(`${LINK_PREFIX}${current.id}`);
      } catch {
        serverId = '';
      }
      if (!serverId) {
        const remote = await focusApiRemote.start({
          objective: current.objective || 'Focus session',
          targetDurationMinutes: current.targetDurationMinutes,
          subjectId: current.subjectId || undefined,
          curriculumNodeId: current.curriculumNodeId || undefined,
          taskId: current.taskId || undefined,
        });
        serverId = remote.id;
        await focusNative.cacheWrite(`${LINK_PREFIX}${current.id}`, serverId);
      }
      const linked = await focusNative.linkBackendSession(serverId);
      if (mounted.current) {
        setSnapshot(linked);
        setServerLink('linked');
        pushActivity('Linked to a server focus session. Restriction events will be recorded there.');
      }
      await flushQueue();
    } catch (err) {
      const mapped = toUserError(err);
      if (mounted.current) {
        setServerError(mapped);
        setServerLink(mapped.offline ? 'offline' : 'failed');
      }
    } finally {
      linking.current = null;
    }
  }, [flushQueue, pushActivity, snapshot]);

  // Native events → snapshot + outbox.
  useEffect(() => {
    mounted.current = true;
    if (!focusNative.available()) {
      setError(toUserError(new NativeUnavailableError()));
      return () => { mounted.current = false; };
    }
    outbox().load().catch(() => undefined);
    const unsubscribeQueue = outbox().subscribe((items) => {
      if (mounted.current) setQueue(items);
    });
    refresh();
    const unsubscribe = focusNative.subscribe((event) => {
      if (event.type === 'focus_status' || event.type === 'permission_revoked' || event.type === 'focus_completed') {
        refresh();
        if (event.type === 'permission_revoked') pushActivity('A permission was revoked. Enforcement stopped and the clock froze.');
        if (event.type === 'focus_completed') pushActivity('Target duration reached. The session completed on the device.');
      }
      if (event.type === 'restriction_triggered') {
        const id = String(event.payload.id || `${Date.now()}`);
        pushActivity(describeRestrictionEvent(event.payload), id);
        outbox()
          .add({ id, kind: 'restriction_triggered', payload: { ...event.payload, backendSessionId: snapshotRef.current?.backendSessionId ?? null } })
          .then(() => flushQueue())
          .catch(() => undefined);
      }
      if (event.type === 'unsupported_surface') {
        pushActivity(`Could not identify the content in ${String(event.payload.packageName || 'that app')} (${String(event.payload.detail || 'unsupported')}). No block was applied.`);
      }
    });
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refresh();
        flushQueue();
      }
    });
    return () => {
      mounted.current = false;
      unsubscribe();
      unsubscribeQueue();
      appState.remove();
    };
  }, [flushQueue, pushActivity, refresh]);

  // Backfill queued items that were captured before the link existed.
  useEffect(() => {
    const serverId = snapshot?.backendSessionId;
    if (!serverId) return;
    outbox()
      .patchPayload((item) => !item.payload.backendSessionId, { backendSessionId: serverId })
      .then((changed) => (changed > 0 ? flushQueue() : undefined))
      .catch(() => undefined);
  }, [flushQueue, snapshot?.backendSessionId]);

  // Terminal phases → record completion/cancellation on the server once.
  useEffect(() => {
    if (!snapshot || !snapshot.id) return;
    const terminal = snapshot.phase === 'COMPLETED' || snapshot.phase === 'CANCELLED';
    if (!terminal || endedHandled.current === snapshot.id) return;
    endedHandled.current = snapshot.id;
    if (!snapshot.backendSessionId) return;
    outbox()
      .add({
        id: `${snapshot.id}:${snapshot.phase.toLowerCase()}`,
        kind: snapshot.phase === 'COMPLETED' ? 'focus_completed' : 'focus_cancelled',
        payload: { backendSessionId: snapshot.backendSessionId, activeElapsedMs: snapshot.activeElapsedMs, nativeSessionId: snapshot.id },
      })
      .then(() => flushQueue())
      .catch(() => undefined);
  }, [flushQueue, snapshot]);

  const run = useCallback(async (action: () => Promise<FocusSnapshot>) => {
    try {
      const next = await action();
      if (mounted.current) {
        setSnapshot(next);
        setError(null);
      }
      return next;
    } catch (err) {
      if (mounted.current) setError(toUserError(err));
      return null;
    }
  }, []);

  return useMemo(() => ({
    snapshot,
    error,
    serverLink,
    serverError,
    activity,
    queue,
    refresh,
    run,
    linkToServer,
    flushQueue,
    clearError: () => setError(null),
  }), [activity, error, flushQueue, linkToServer, queue, refresh, run, serverError, serverLink, snapshot]);
}
