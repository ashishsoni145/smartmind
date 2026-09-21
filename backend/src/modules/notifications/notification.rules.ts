import { NotificationPreferences, NotificationType } from '@sharpmind/types';

export class NotificationRules {
  /**
   * Evaluates if a given timestamp falls within the student's quiet hours in their timezone
   */
  static isWithinQuietHours(
    date: Date,
    quietStart: string = '22:00:00',
    quietEnd: string = '07:00:00',
    timezone: string = 'Asia/Kolkata'
  ): boolean {
    try {
      // Format current time in student's timezone as HH:mm:ss
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const parts = formatter.formatToParts(date);
      const hour = parts.find(p => p.type === 'hour')?.value || '00';
      const minute = parts.find(p => p.type === 'minute')?.value || '00';
      const second = parts.find(p => p.type === 'second')?.value || '00';

      const currentSec = parseInt(hour, 10) * 3600 + parseInt(minute, 10) * 60 + parseInt(second, 10);

      const [sH, sM, sS = 0] = quietStart.split(':').map(Number);
      const startSec = sH * 3600 + sM * 60 + sS;

      const [eH, eM, eS = 0] = quietEnd.split(':').map(Number);
      const endSec = eH * 3600 + eM * 60 + eS;

      if (startSec <= endSec) {
        // Simple range (e.g. 01:00 to 06:00)
        return currentSec >= startSec && currentSec < endSec;
      } else {
        // Overnight range (e.g. 22:00 to 07:00)
        return currentSec >= startSec || currentSec < endSec;
      }
    } catch {
      return false; // Fallback to allowed if timezone resolution fails
    }
  }

  /**
   * Adjusts delivery time forward if scheduled timestamp falls inside quiet hours
   */
  static adjustForQuietHours(
    targetDate: Date,
    quietStart: string = '22:00:00',
    quietEnd: string = '07:00:00',
    timezone: string = 'Asia/Kolkata'
  ): Date {
    if (!this.isWithinQuietHours(targetDate, quietStart, quietEnd, timezone)) {
      return targetDate;
    }

    // Advance date hour by hour until out of quiet hours
    const adjusted = new Date(targetDate.getTime());
    while (this.isWithinQuietHours(adjusted, quietStart, quietEnd, timezone)) {
      adjusted.setTime(adjusted.getTime() + 15 * 60 * 1000); // add 15 mins
    }
    return adjusted;
  }

  /**
   * 24-hour deduplication check:
   * Prevents spamming repeated notifications of the same category (e.g. revision due or study reminders)
   */
  static isDuplicateWithinWindow(
    recentNotifications: Array<{ type: NotificationType; createdAt: string; metadata?: any }>,
    newType: NotificationType,
    dedupKey?: string,
    windowMs: number = 24 * 60 * 60 * 1000
  ): boolean {
    const now = Date.now();
    for (const notif of recentNotifications) {
      if (notif.type !== newType) continue;

      const diff = now - new Date(notif.createdAt).getTime();
      if (diff >= 0 && diff < windowMs) {
        if (!dedupKey) return true; // generic deduplication for this type

        const existingKey = notif.metadata?.dedupKey;
        if (existingKey === dedupKey) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Determines active channels for a notification given student preferences
   */
  static resolveActiveChannels(
    type: NotificationType,
    prefs: NotificationPreferences
  ): { sendInApp: boolean; sendEmail: boolean } {
    if (!prefs.inAppEnabled && !prefs.emailEnabled) {
      return { sendInApp: false, sendEmail: false };
    }

    let categoryAllowed = true;
    if (type === 'revision_due' && !prefs.revisionReminders) categoryAllowed = false;
    if (type === 'test_scheduled' && !prefs.testReminders) categoryAllowed = false;
    if (type === 'study_session' && !prefs.studySessionReminders) categoryAllowed = false;
    if (type === 'backlog_risk' && !prefs.backlogAlerts) categoryAllowed = false;

    if (!categoryAllowed) {
      return { sendInApp: false, sendEmail: false };
    }

    return {
      sendInApp: prefs.inAppEnabled,
      sendEmail: prefs.emailEnabled && (type === 'backlog_risk' || type === 'review_summary' || type === 'test_scheduled'),
    };
  }
}
