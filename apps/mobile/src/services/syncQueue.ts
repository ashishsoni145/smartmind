export type SyncStatus = 'pending' | 'synchronized' | 'failed';

export type SyncItem = {
  id: string;
  kind: 'focus_started' | 'focus_completed' | 'focus_cancelled' | 'restriction_triggered';
  payload: Record<string, unknown>;
  status: SyncStatus;
  attempts: number;
  lastError?: string;
  createdAt: string;
};

export function enqueue(items: SyncItem[], item: Omit<SyncItem, 'status' | 'attempts' | 'createdAt'>): SyncItem[] {
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

export function markResult(items: SyncItem[], id: string, ok: boolean, error?: string): SyncItem[] {
  return items.map((item) => {
    if (item.id !== id) return item;
    return ok
      ? { ...item, status: 'synchronized', lastError: undefined }
      : { ...item, status: 'failed', attempts: item.attempts + 1, lastError: error || 'sync_failed' };
  });
}

export function pendingItems(items: SyncItem[]): SyncItem[] {
  return items.filter((item) => item.status !== 'synchronized');
}
