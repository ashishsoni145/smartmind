import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationRules } from '../modules/notifications/notification.rules';
import { NotificationService } from '../modules/notifications/notification.service';
import { supabase } from '../db/client';
import { NotificationPreferences } from '@sharpmind/types';

vi.mock('../db/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Part 05: Notification & Reminder Infrastructure + Action Required', () => {
  describe('NotificationRules: Quiet Hours & Deduplication', () => {
    it('detects when time falls within overnight quiet hours (22:00 to 07:00)', () => {
      // 23:30 UTC = 05:00 next day in IST (Asia/Kolkata is UTC+5:30)
      // Let's create an explicit date in Asia/Kolkata at 23:00
      // 23:00 IST is 17:30 UTC
      const lateNightDate = new Date('2026-09-21T17:30:00.000Z'); // 23:00:00 in Asia/Kolkata
      const isQuiet = NotificationRules.isWithinQuietHours(lateNightDate, '22:00:00', '07:00:00', 'Asia/Kolkata');
      expect(isQuiet).toBe(true);

      // 14:00 IST is 08:30 UTC
      const daytimeDate = new Date('2026-09-21T08:30:00.000Z'); // 14:00:00 in Asia/Kolkata
      const isQuietDay = NotificationRules.isWithinQuietHours(daytimeDate, '22:00:00', '07:00:00', 'Asia/Kolkata');
      expect(isQuietDay).toBe(false);
    });

    it('adjusts quiet-hours delivery forward to outside quiet window', () => {
      const lateNightDate = new Date('2026-09-21T17:30:00.000Z'); // 23:00:00 IST
      const adjusted = NotificationRules.adjustForQuietHours(lateNightDate, '22:00:00', '07:00:00', 'Asia/Kolkata');

      expect(adjusted.getTime()).toBeGreaterThan(lateNightDate.getTime());
      expect(NotificationRules.isWithinQuietHours(adjusted, '22:00:00', '07:00:00', 'Asia/Kolkata')).toBe(false);
    });

    it('enforces 24-hour deduplication for identical reminders', () => {
      const now = new Date();
      const recentList = [
        {
          type: 'revision_due' as const,
          createdAt: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
          metadata: { dedupKey: 'revision-physics-electrostatics' },
        },
      ];

      // Same key within window -> duplicate
      expect(
        NotificationRules.isDuplicateWithinWindow(
          recentList,
          'revision_due',
          'revision-physics-electrostatics',
          24 * 3600 * 1000
        )
      ).toBe(true);

      // Different key -> allowed
      expect(
        NotificationRules.isDuplicateWithinWindow(
          recentList,
          'revision_due',
          'revision-chemistry-thermo',
          24 * 3600 * 1000
        )
      ).toBe(false);
    });

    it('respects student channel preferences and disables unselected reminder categories', () => {
      const prefs: NotificationPreferences = {
        studentId: 'student-test-1',
        emailEnabled: true,
        inAppEnabled: true,
        quietHoursStart: '22:00:00',
        quietHoursEnd: '07:00:00',
        timezone: 'Asia/Kolkata',
        revisionReminders: false, // Student turned off revision reminders
        testReminders: true,
        studySessionReminders: true,
        backlogAlerts: true,
      };

      const channelsRevision = NotificationRules.resolveActiveChannels('revision_due', prefs);
      expect(channelsRevision.sendInApp).toBe(false);
      expect(channelsRevision.sendEmail).toBe(false);

      const channelsBacklog = NotificationRules.resolveActiveChannels('backlog_risk', prefs);
      expect(channelsBacklog.sendInApp).toBe(true);
      expect(channelsBacklog.sendEmail).toBe(true);
    });
  });

  describe('NotificationService & Action Required Toasts', () => {
    const studentId = 'student-test-actions';

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('creates an Action Required notification with action label and URL', async () => {
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'notification_preferences') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: {
                    student_id: studentId,
                    email_enabled: true,
                    in_app_enabled: true,
                    quiet_hours_start: '22:00:00',
                    quiet_hours_end: '07:00:00',
                    timezone: 'Asia/Kolkata',
                    revision_reminders: true,
                    test_reminders: true,
                    study_session_reminders: true,
                    backlog_alerts: true,
                  },
                }),
              }),
            }),
          };
        }
        if (table === 'notifications') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockResolvedValue({ data: [] }),
                }),
              }),
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: 'notif-action-1',
                    student_id: studentId,
                    type: 'action_required',
                    title: 'Diagnostic Assessment Incomplete',
                    message: 'Please complete your initial assessment to unlock personalized recommendations.',
                    action_url: '/app/diagnostic',
                    action_required: true,
                    action_label: 'Start Diagnostic',
                    is_read: false,
                    scheduled_for: new Date().toISOString(),
                    metadata: { dedupKey: 'diagnostic-pending' },
                    created_at: new Date().toISOString(),
                  },
                }),
              }),
            }),
          };
        }
        return {};
      });

      const notif = await NotificationService.createNotification(studentId, {
        type: 'action_required',
        title: 'Diagnostic Assessment Incomplete',
        message: 'Please complete your initial assessment to unlock personalized recommendations.',
        actionRequired: true,
        actionLabel: 'Start Diagnostic',
        actionUrl: '/app/diagnostic',
        metadata: { dedupKey: 'diagnostic-pending' },
      });

      expect(notif).toBeDefined();
      expect(notif?.actionRequired).toBe(true);
      expect(notif?.actionLabel).toBe('Start Diagnostic');
      expect(notif?.actionUrl).toBe('/app/diagnostic');
    });

    it('queries pending action-required items strictly filtered by is_read = false', async () => {
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'notifications') {
          const createChain = (data: any) => {
            const chain: any = {
              eq: vi.fn(() => chain),
              order: vi.fn(() => chain),
              limit: vi.fn().mockResolvedValue({ data }),
            };
            return chain;
          };
          return {
            select: vi.fn().mockReturnValue(
              createChain([
                {
                  id: 'notif-pending-1',
                  student_id: studentId,
                  type: 'action_required',
                  title: '5 Revision Cards Overdue',
                  message: 'Retention will degrade if cards are delayed.',
                  action_url: '/app/revision',
                  action_required: true,
                  action_label: 'Review Cards',
                  is_read: false,
                  scheduled_for: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                },
              ])
            ),
          };
        }
        return {};
      });

      const pending = await NotificationService.getPendingActionRequired(studentId);
      expect(pending).toHaveLength(1);
      expect(pending[0].actionRequired).toBe(true);
      expect(pending[0].actionLabel).toBe('Review Cards');
      expect(pending[0].isRead).toBe(false);
    });
  });
});
