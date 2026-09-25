import { DeviceEventEmitter, NativeModules, TurboModuleRegistry } from 'react-native';
import type { Spec } from '../../native/NativeSharpMindAndroid';

export type FocusPhase =
  | 'IDLE'
  | 'PREPARING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'PERMISSION_REQUIRED';

export type FocusSnapshot = {
  id: string;
  objective: string;
  targetDurationMinutes: number;
  strictMode: boolean;
  phase: FocusPhase;
  startedAtEpochMs: number | null;
  accumulatedActiveMs: number;
  activeElapsedMs: number;
  /** Device clock when the snapshot was produced; lets JS extrapolate the clock without polling. */
  snapshotAtEpochMs: number;
  endedAtEpochMs: number | null;
  backendSessionId: string | null;
  failureReason: string | null;
  subjectId: string | null;
  curriculumNodeId: string | null;
  taskId: string | null;
  restrictionRuleIds: string[];
};

export type PermissionReport = {
  usageAccess: string;
  accessibility: string;
  notifications: string;
  usageAccessEnabled: boolean;
  accessibilityEnabled: boolean;
  notificationsEnabled: boolean;
};

export type SupportedApp = {
  packageName: string;
  label: string;
  installed: boolean;
  selectiveTargets: string[];
  supportsAppBlock: boolean;
  adapterId: string;
};

export type NativeFocusEvent = {
  type: string;
  payload: Record<string, unknown>;
};

export class NativeUnavailableError extends Error {
  constructor(message = 'The SharpMind Android focus module is not linked. Enforcement is unavailable. Nothing was simulated.') {
    super(message);
    this.name = 'NativeUnavailableError';
  }
}

export class NativePayloadError extends Error {
  constructor(message = 'The native module returned an unreadable payload.') {
    super(message);
    this.name = 'NativePayloadError';
  }
}

function moduleOrNull(): Spec | null {
  return TurboModuleRegistry.get<Spec>('SharpMindAndroid') ?? (NativeModules.SharpMindAndroid as Spec | undefined) ?? null;
}

function requireModule(): Spec {
  const native = moduleOrNull();
  if (!native) {
    throw new NativeUnavailableError();
  }
  return native;
}

function parseJson<T>(raw: string, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new NativePayloadError();
  }
}

const idleSnapshot: FocusSnapshot = {
  id: '',
  objective: '',
  targetDurationMinutes: 25,
  strictMode: false,
  phase: 'IDLE',
  startedAtEpochMs: null,
  accumulatedActiveMs: 0,
  activeElapsedMs: 0,
  snapshotAtEpochMs: 0,
  endedAtEpochMs: null,
  backendSessionId: null,
  failureReason: null,
  subjectId: null,
  curriculumNodeId: null,
  taskId: null,
  restrictionRuleIds: [],
};

function snapshot(raw: string): FocusSnapshot {
  const parsed = parseJson<Partial<FocusSnapshot>>(raw, {});
  if (!parsed.phase) throw new NativePayloadError('The native focus engine returned a snapshot without a phase.');
  return { ...idleSnapshot, ...parsed, snapshotAtEpochMs: parsed.snapshotAtEpochMs || Date.now() };
}

export const focusNative = {
  available(): boolean {
    return moduleOrNull() != null;
  },
  async start(config: Record<string, unknown>): Promise<FocusSnapshot> {
    return snapshot(await requireModule().startFocusSession(JSON.stringify(config)));
  },
  async stop(confirmStrict: boolean): Promise<FocusSnapshot> {
    return snapshot(await requireModule().stopFocusSession(confirmStrict));
  },
  async cancel(confirmStrict: boolean): Promise<FocusSnapshot> {
    return snapshot(await requireModule().cancelFocusSession(confirmStrict));
  },
  async pause(): Promise<FocusSnapshot> {
    return snapshot(await requireModule().pauseFocusSession());
  },
  async resume(): Promise<FocusSnapshot> {
    return snapshot(await requireModule().resumeFocusSession());
  },
  async status(): Promise<FocusSnapshot> {
    return snapshot(await requireModule().getFocusStatus());
  },
  async linkBackendSession(sessionId: string): Promise<FocusSnapshot> {
    return snapshot(await requireModule().linkBackendSession(sessionId));
  },
  async retryPermissions(): Promise<FocusSnapshot> {
    return snapshot(await requireModule().retryFocusPermissions());
  },
  async permissions(): Promise<PermissionReport> {
    return parseJson(await requireModule().getRequiredPermissions(), {} as PermissionReport);
  },
  openAccessibilitySettings: () => requireModule().openAccessibilitySettings(),
  openUsageAccessSettings: () => requireModule().openUsageAccessSettings(),
  openNotificationSettings: () => requireModule().openNotificationSettings(),
  isAccessibilityEnabled: () => requireModule().isAccessibilityEnabled(),
  isUsageAccessEnabled: () => requireModule().isUsageAccessEnabled(),
  async installedApps(): Promise<SupportedApp[]> {
    return parseJson(await requireModule().getInstalledSupportedApps(), []);
  },
  async setRules(rules: unknown[]): Promise<unknown[]> {
    return parseJson(await requireModule().setRestrictionRules(JSON.stringify(rules)), []);
  },
  async activeRestrictions(): Promise<unknown[]> {
    return parseJson(await requireModule().getActiveRestrictions(), []);
  },
  secureGet: (key: string) => requireModule().secureGet(key),
  secureSet: (key: string, value: string) => requireModule().secureSet(key, value),
  secureDelete: (key: string) => requireModule().secureDelete(key),
  cacheRead: (key: string) => requireModule().cacheRead(key),
  cacheWrite: (key: string, value: string) => requireModule().cacheWrite(key, value),
  cacheRemove: (key: string) => requireModule().cacheRemove(key),
  scheduleReminder: (id: string, title: string, body: string, when: number) =>
    requireModule().scheduleReminder(id, title, body, when),
  cancelReminder: (id: string) => requireModule().cancelReminder(id),
  pickImage: () => requireModule().pickImage(),
  readFileBase64: (uri: string) => requireModule().readFileBase64(uri),
  subscribe(listener: (event: NativeFocusEvent) => void): () => void {
    const sub = DeviceEventEmitter.addListener('SharpMindAndroidEvent', (body: { type?: string; payload?: string }) => {
      let payload: Record<string, unknown> = {};
      if (body?.payload) {
        try {
          payload = JSON.parse(body.payload) as Record<string, unknown>;
        } catch {
          payload = { raw: body.payload };
        }
      }
      listener({ type: body?.type || 'unknown', payload });
    });
    return () => sub.remove();
  },
};
