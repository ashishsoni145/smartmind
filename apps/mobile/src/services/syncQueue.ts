export type SyncStatus = 'pending' | 'synchronized' | 'failed' | 'abandoned';

export type SyncKind = 'focus_started' | 'focus_completed' | 'focus_cancelled' | 'restriction_triggered';

export type SyncItem = {
  /** Stable, caller-provided id. Re-enqueueing the same id is a no-op (idempotent). */
  id: string;
  kind: SyncKind;
  payload: Record<string, unknown>;
  status: SyncStatus;
  attempts: number;
  lastError?: string;
  createdAt: string;
  lastAttemptAt?: string;
};

export const MAX_SYNC_ATTEMPTS = 8;
const BASE_BACKOFF_MS = 5_000;
const MAX_BACKOFF_MS = 10 * 60_000;

export function enqueue(items: SyncItem[], item: Omit<SyncItem, 'status' | 'attempts' | 'createdAt'>): SyncItem[] {
  if (items.some((existing) => existing.id === item.id)) {
    return items;
  }
  return [
    ...items,
    {
      ...item,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function markResult(items: SyncItem[], id: string, ok: boolean, error?: string, now: Date = new Date()): SyncItem[] {
  return items.map((item) => {
    if (item.id !== id) return item;
    if (ok) {
      return { ...item, status: 'synchronized', lastError: undefined, lastAttemptAt: now.toISOString() };
    }
    const attempts = item.attempts + 1;
    return {
      ...item,
      status: attempts >= MAX_SYNC_ATTEMPTS ? 'abandoned' : 'failed',
      attempts,
      lastError: error || 'sync_failed',
      lastAttemptAt: now.toISOString(),
    };
  });
}

/** Marks an item as permanently rejected by the server (4xx). It is kept for display, never retried. */
export function markRejected(items: SyncItem[], id: string, error: string, now: Date = new Date()): SyncItem[] {
  return items.map((item) => (item.id === id ? { ...item, status: 'abandoned', attempts: item.attempts + 1, lastError: error, lastAttemptAt: now.toISOString() } : item));
}

export function pendingItems(items: SyncItem[]): SyncItem[] {
  return items.filter((item) => item.status === 'pending' || item.status === 'failed');
}

export function backoffMs(attempts: number): number {
  if (attempts <= 0) return 0;
  return Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** (attempts - 1));
}

/** Whether a failed item has waited long enough to be retried. */
export function shouldAttempt(item: SyncItem, now: number): boolean {
  if (item.status === 'synchronized' || item.status === 'abandoned') return false;
  if (item.status === 'pending' || !item.lastAttemptAt) return true;
  return now - Date.parse(item.lastAttemptAt) >= backoffMs(item.attempts);
}

/** Items to flush in creation order, respecting backoff. */
export function dueItems(items: SyncItem[], now: number): SyncItem[] {
  return pendingItems(items)
    .filter((item) => shouldAttempt(item, now))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function prune(items: SyncItem[], keepSynchronized = 20): SyncItem[] {
  const done = items.filter((item) => item.status === 'synchronized');
  const dropped = new Set(done.slice(0, Math.max(0, done.length - keepSynchronized)).map((item) => item.id));
  return items.filter((item) => !dropped.has(item.id));
}

export function serializeQueue(items: SyncItem[]): string {
  return JSON.stringify({ v: 1, items });
}

export function deserializeQueue(raw: string | null | undefined): SyncItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { v?: number; items?: unknown };
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.items)) return [];
    return parsed.items.filter((item): item is SyncItem => {
      if (!item || typeof item !== 'object') return false;
      const row = item as Partial<SyncItem>;
      return typeof row.id === 'string' && typeof row.kind === 'string' && typeof row.status === 'string' && typeof row.createdAt === 'string';
    });
  } catch {
    return [];
  }
}
