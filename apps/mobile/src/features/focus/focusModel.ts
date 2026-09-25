import type { FocusPhase, FocusSnapshot } from './nativeFocus';

/** Elapsed active time extrapolated from the last native snapshot. Never runs ahead while paused. */
export function elapsedMs(snapshot: FocusSnapshot | null, now: number): number {
  if (!snapshot) return 0;
  if (snapshot.phase !== 'ACTIVE') return snapshot.activeElapsedMs;
  const drift = Math.max(0, now - (snapshot.snapshotAtEpochMs || now));
  return snapshot.activeElapsedMs + drift;
}

export function targetMs(snapshot: FocusSnapshot | null): number {
  return snapshot ? snapshot.targetDurationMinutes * 60_000 : 0;
}

export function remainingMs(snapshot: FocusSnapshot | null, now: number): number {
  return Math.max(0, targetMs(snapshot) - elapsedMs(snapshot, now));
}

export type FocusActions = {
  canPause: boolean;
  canResume: boolean;
  canEnd: boolean;
  canCancel: boolean;
  canRetryPermissions: boolean;
  canStartNew: boolean;
  /** Ending an ACTIVE strict session needs an explicit second confirmation. */
  needsStrictConfirm: boolean;
};

export function allowedActions(snapshot: FocusSnapshot | null): FocusActions {
  const phase: FocusPhase = snapshot?.phase ?? 'IDLE';
  const strict = Boolean(snapshot?.strictMode);
  const live = phase === 'ACTIVE' || phase === 'PAUSED' || phase === 'PREPARING' || phase === 'PERMISSION_REQUIRED';
  return {
    canPause: phase === 'ACTIVE',
    canResume: phase === 'PAUSED',
    canEnd: live,
    canCancel: live,
    canRetryPermissions: phase === 'PERMISSION_REQUIRED',
    canStartNew: !live,
    needsStrictConfirm: strict && phase === 'ACTIVE',
  };
}

export function describePhase(snapshot: FocusSnapshot | null): { title: string; detail: string } {
  const phase = snapshot?.phase ?? 'IDLE';
  const reason = snapshot?.failureReason ?? null;
  switch (phase) {
    case 'IDLE':
      return { title: 'No session', detail: 'Configure a focus session to start native enforcement.' };
    case 'PREPARING':
      return { title: 'Preparing', detail: 'Checking permissions before enforcement starts.' };
    case 'ACTIVE':
      return { title: 'Focus is on', detail: 'The Kotlin service is checking the foreground app for the rules you enabled.' };
    case 'PAUSED':
      return {
        title: 'Paused',
        detail: reason === 'interrupted_process_restart'
          ? 'Android stopped SharpMind while this session was running. The clock was frozen at the last confirmed moment; resume when you are ready.'
          : 'Enforcement is paused. Restrictions are not applied until you resume.',
      };
    case 'COMPLETED':
      return { title: 'Completed', detail: reason === 'target_reached' ? 'The target duration was reached.' : 'You ended the session.' };
    case 'CANCELLED':
      return { title: 'Cancelled', detail: 'The session was cancelled before its target.' };
    case 'FAILED':
      return { title: 'Stopped', detail: reason ? `The session could not continue (${humanReason(reason)}).` : 'The session could not continue.' };
    case 'PERMISSION_REQUIRED':
      return {
        title: 'Permission needed',
        detail: reason === 'permission_revoked'
          ? 'A permission was turned off during the session. Enforcement stopped; nothing was blocked without it.'
          : 'Grant the required permission, then tap “Check permissions again”.',
      };
    default:
      return { title: phase, detail: '' };
  }
}

export function humanReason(reason: string): string {
  return reason.replace(/_/g, ' ');
}

/**
 * Truthful description of what the native engine actually did. Usage access can only
 * detect the foreground app and open SharpMind's own screen; it never closes another app.
 */
export function describeRestrictionEvent(payload: Record<string, unknown>): string {
  const pkg = typeof payload.packageName === 'string' ? payload.packageName : 'an app';
  const ruleType = typeof payload.ruleType === 'string' ? payload.ruleType : '';
  const intervention = typeof payload.intervention === 'string' ? payload.intervention : 'NONE';
  const label = appLabel(pkg);
  const action =
    intervention === 'GO_HOME' ? 'opened the SharpMind intervention screen'
      : intervention === 'NAVIGATE_BACK' ? 'sent a Back action and opened the intervention screen'
        : intervention === 'NOTIFY_ONLY' ? 'posted a notification'
          : 'recorded the event';
  const rule =
    ruleType === 'APP_BLOCK' ? 'app block'
      : ruleType === 'CONTENT_RESTRICTION' ? `${String(payload.target || 'content')} restriction`
        : ruleType === 'TIME_LIMIT' ? 'time limit'
          : ruleType === 'FOCUS_ONLY' ? 'focus-only allowlist'
            : 'rule';
  return `Detected ${label} (${rule}) and ${action}. SharpMind did not close ${label}.`;
}

export function appLabel(packageName: string): string {
  if (packageName === 'com.google.android.youtube') return 'YouTube';
  if (packageName === 'com.instagram.android') return 'Instagram';
  if (packageName === 'com.facebook.katana') return 'Facebook';
  return packageName;
}

export type SetupValidation = { ok: true; minutes: number; objective: string } | { ok: false; field: 'objective' | 'minutes'; message: string };

/** Mirrors the Kotlin state machine limits so the user sees the error before the bridge call. */
export function validateSetup(objective: string, minutesInput: string): SetupValidation {
  const trimmed = objective.trim();
  if (trimmed.length < 3) return { ok: false, field: 'objective', message: 'Describe the objective in at least 3 characters.' };
  const minutes = Number(minutesInput);
  if (!Number.isInteger(minutes) || minutes < 5 || minutes > 180) {
    return { ok: false, field: 'minutes', message: 'Choose between 5 and 180 minutes.' };
  }
  return { ok: true, minutes, objective: trimmed };
}
