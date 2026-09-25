import { ApiClientError } from '@sharpmind/api-client';
import {
  deserializeQueue,
  dueItems,
  enqueue,
  markRejected,
  markResult,
  prune,
  serializeQueue,
  type SyncItem,
} from '../../services/syncQueue';

export const FOCUS_QUEUE_KEY = 'focus.sync-queue.v1';

export interface QueueStorage {
  read(key: string): Promise<string>;
  write(key: string, value: string): Promise<unknown>;
}

export interface FocusRemote {
  interruption(sessionId: string, data: { reason: string; durationSeconds: number }): Promise<unknown>;
  complete(sessionId: string, data: { actualDurationSeconds: number; reflection?: { completedObjective?: boolean; notes?: string } }): Promise<unknown>;
}

export type FlushOutcome = { attempted: number; synchronized: number; failed: number; rejected: number };

/**
 * Persistent, idempotent outbox for focus events that need the server.
 *
 * - Items are keyed by the native event id, so re-delivery never duplicates a server call.
 * - Items without a backend session id are held (not failed) until the session is linked.
 * - 4xx rejections are abandoned (the server has already said no); other failures back off.
 * - Only one flush runs at a time.
 */
export class FocusSyncOutbox {
  private items: SyncItem[] = [];
  private loaded = false;
  private flushing: Promise<FlushOutcome> | null = null;
  private listeners = new Set<(items: SyncItem[]) => void>();

  constructor(private readonly storage: QueueStorage, private readonly remote: FocusRemote) {}

  subscribe(listener: (items: SyncItem[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.items);
    return () => this.listeners.delete(listener);
  }

  snapshot(): SyncItem[] {
    return this.items;
  }

  async load(): Promise<SyncItem[]> {
    if (this.loaded) return this.items;
    try {
      this.items = deserializeQueue(await this.storage.read(FOCUS_QUEUE_KEY));
    } catch {
      this.items = [];
    }
    this.loaded = true;
    this.notify();
    return this.items;
  }

  async add(item: Omit<SyncItem, 'status' | 'attempts' | 'createdAt'>): Promise<void> {
    await this.load();
    const next = enqueue(this.items, item);
    if (next === this.items) return;
    await this.commit(next);
  }

  /** Attaches data that arrived after the item was queued (e.g. the server session id). */
  async patchPayload(predicate: (item: SyncItem) => boolean, patch: Record<string, unknown>): Promise<number> {
    await this.load();
    let changed = 0;
    const next = this.items.map((item) => {
      if (item.status === 'synchronized' || item.status === 'abandoned' || !predicate(item)) return item;
      changed += 1;
      return { ...item, payload: { ...item.payload, ...patch } };
    });
    if (changed > 0) await this.commit(next);
    return changed;
  }

  async flush(now = Date.now()): Promise<FlushOutcome> {
    if (this.flushing) return this.flushing;
    this.flushing = this.runFlush(now).finally(() => {
      this.flushing = null;
    });
    return this.flushing;
  }

  private async runFlush(now: number): Promise<FlushOutcome> {
    await this.load();
    const outcome: FlushOutcome = { attempted: 0, synchronized: 0, failed: 0, rejected: 0 };
    for (const item of dueItems(this.items, now)) {
      const sessionId = typeof item.payload.backendSessionId === 'string' ? item.payload.backendSessionId : null;
      if (!sessionId) {
        // Held until the native session is linked to a server session. Not a failure.
        continue;
      }
      outcome.attempted += 1;
      try {
        await this.send(item, sessionId);
        this.items = markResult(this.items, item.id, true);
        outcome.synchronized += 1;
      } catch (error) {
        if (error instanceof ApiClientError && error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 401 && error.statusCode !== 429) {
          this.items = markRejected(this.items, item.id, error.message);
          outcome.rejected += 1;
        } else {
          this.items = markResult(this.items, item.id, false, error instanceof Error ? error.message : 'sync_failed');
          outcome.failed += 1;
        }
        if (error instanceof ApiClientError && error.statusCode === 401) {
          break; // Session expired; let auth recover before hammering the API.
        }
      }
    }
    await this.commit(prune(this.items));
    return outcome;
  }

  private async send(item: SyncItem, sessionId: string): Promise<void> {
    switch (item.kind) {
      case 'restriction_triggered':
        await this.remote.interruption(sessionId, {
          reason: `restriction:${String(item.payload.ruleType || 'unknown')}:${String(item.payload.packageName || 'unknown')}`,
          durationSeconds: 0,
        });
        return;
      case 'focus_completed':
      case 'focus_cancelled':
        await this.remote.complete(sessionId, {
          actualDurationSeconds: Math.max(0, Math.round(Number(item.payload.activeElapsedMs || 0) / 1000)),
          reflection: {
            completedObjective: item.kind === 'focus_completed',
            notes: item.kind === 'focus_cancelled' ? 'Cancelled on device before the target duration.' : undefined,
          },
        });
        return;
      case 'focus_started':
        // The start call itself creates the server session; there is nothing to replay.
        return;
      default:
        return;
    }
  }

  private async commit(next: SyncItem[]): Promise<void> {
    this.items = next;
    this.notify();
    try {
      await this.storage.write(FOCUS_QUEUE_KEY, serializeQueue(next));
    } catch {
      // Storage failure is surfaced through the pending list staying visible; nothing is marked synchronized.
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.items));
  }
}
