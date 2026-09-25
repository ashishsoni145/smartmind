import { PermissionsAndroid, Platform } from 'react-native';
import { focusNative, type PermissionReport } from './nativeFocus';

export type PermissionId = 'notifications' | 'usageAccess' | 'accessibility';

export type PermissionExplainer = {
  id: PermissionId;
  title: string;
  what: string;
  why: string;
  data: string;
  uploaded: string;
  disable: string;
  /** Which rules actually need it. Users can decline and still use the rest of the app. */
  requiredFor: string;
};

export const PERMISSION_EXPLAINERS: PermissionExplainer[] = [
  {
    id: 'notifications',
    title: 'Notifications',
    what: 'Shows the persistent “Focus is on” notification while a session runs, and study reminders you turn on.',
    why: 'Android requires a visible notification for the focus service, and reminders cannot be shown without it.',
    data: 'Only the objective text you typed and the elapsed minutes.',
    uploaded: 'Nothing is uploaded.',
    disable: 'Android Settings → Apps → SharpMind → Notifications.',
    requiredFor: 'Any focus session and reminders.',
  },
  {
    id: 'usageAccess',
    title: 'Usage access',
    what: 'Lets SharpMind read which app is currently in the foreground, once every few seconds, only during a session.',
    why: 'Whole-app blocks, focus-only allowlists and time limits need to know the foreground app. Usage access cannot close or force-stop another app; SharpMind opens its own intervention screen instead.',
    data: 'The foreground package name and per-app seconds for the current session, kept on this device.',
    uploaded: 'Only a rule identifier such as “restriction:APP_BLOCK:com.example” is sent to your focus history. Raw usage is never uploaded.',
    disable: 'Android Settings → Special app access → Usage access → SharpMind.',
    requiredFor: 'App block, focus-only and time-limit rules.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility service',
    what: 'Lets SharpMind notice specific in-app surfaces such as YouTube Shorts or Instagram Reels while a session is active.',
    why: 'Only selective content rules need it. It is not a disability assistance tool. Without a reliable player signal SharpMind reports “unsupported” rather than blocking the whole app.',
    data: 'View identifiers and content descriptions of at most 40 nodes are matched in memory and discarded. Password fields stop processing. Text is not stored.',
    uploaded: 'Nothing from the screen is uploaded; no screenshots, no keystrokes, no messages.',
    disable: 'Android Settings → Accessibility → SharpMind Focus. SharpMind cannot stop you from turning it off.',
    requiredFor: 'Shorts and Reels restrictions only.',
  },
];

export type PermissionStatus = 'granted' | 'missing' | 'unknown';

export function statusFromReport(report: PermissionReport | null, id: PermissionId): PermissionStatus {
  if (!report) return 'unknown';
  const granted = id === 'notifications' ? report.notificationsEnabled : id === 'usageAccess' ? report.usageAccessEnabled : report.accessibilityEnabled;
  return granted ? 'granted' : 'missing';
}

/**
 * POST_NOTIFICATIONS is a runtime permission on Android 13+. Ask in-app first (one system
 * dialog); when the user has permanently denied it, fall back to the settings page.
 */
export async function requestNotifications(): Promise<'granted' | 'denied' | 'settings'> {
  if (Platform.OS !== 'android') return 'granted';
  if (Platform.Version < 33) {
    await focusNative.openNotificationSettings();
    return 'settings';
  }
  const permission = 'android.permission.POST_NOTIFICATIONS' as const;
  const result = await PermissionsAndroid.request(permission);
  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    await focusNative.openNotificationSettings();
    return 'settings';
  }
  return 'denied';
}

export async function openSettingsFor(id: PermissionId): Promise<void> {
  if (id === 'notifications') await focusNative.openNotificationSettings();
  else if (id === 'usageAccess') await focusNative.openUsageAccessSettings();
  else await focusNative.openAccessibilitySettings();
}
