import { supabase } from '../../db/client';
import {
  CreateNotificationInput,
  UpdateNotificationPreferencesInput,
  ListNotificationsQueryInput,
} from './notification.schema';
import { NotificationRules } from './notification.rules';
import { NotificationRecord, NotificationPreferences } from '@sharpmind/types';
import { NotFoundError } from '../../lib/errors';

export class NotificationService {
  /**
   * Retrieves student notification preferences or creates defaults
   */
  static async getPreferences(studentId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch notification preferences: ${error.message}`);
    }

    if (!data) {
      // Default preferences
      const defaultPrefs: NotificationPreferences = {
        studentId,
        emailEnabled: true,
        inAppEnabled: true,
        quietHoursStart: '22:00:00',
        quietHoursEnd: '07:00:00',
        timezone: 'Asia/Kolkata',
        revisionReminders: true,
        testReminders: true,
        studySessionReminders: true,
        backlogAlerts: true,
      };

      await supabase.from('notification_preferences').insert({
        student_id: studentId,
        email_enabled: defaultPrefs.emailEnabled,
        in_app_enabled: defaultPrefs.inAppEnabled,
        quiet_hours_start: defaultPrefs.quietHoursStart,
        quiet_hours_end: defaultPrefs.quietHoursEnd,
        timezone: defaultPrefs.timezone,
        revision_reminders: defaultPrefs.revisionReminders,
        test_reminders: defaultPrefs.testReminders,
        study_session_reminders: defaultPrefs.studySessionReminders,
        backlog_alerts: defaultPrefs.backlogAlerts,
      });

      return defaultPrefs;
    }

    return {
      studentId: data.student_id,
      emailEnabled: data.email_enabled,
      inAppEnabled: data.in_app_enabled,
      quietHoursStart: data.quiet_hours_start,
      quietHoursEnd: data.quiet_hours_end,
      timezone: data.timezone,
      revisionReminders: data.revision_reminders,
      testReminders: data.test_reminders,
      studySessionReminders: data.study_session_reminders,
      backlogAlerts: data.backlog_alerts,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Updates student notification preferences
   */
  static async updatePreferences(
    studentId: string,
    input: UpdateNotificationPreferencesInput
  ): Promise<NotificationPreferences> {
    // Ensure row exists
    await this.getPreferences(studentId);

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (input.emailEnabled !== undefined) updates.email_enabled = input.emailEnabled;
    if (input.inAppEnabled !== undefined) updates.in_app_enabled = input.inAppEnabled;
    if (input.quietHoursStart !== undefined) updates.quiet_hours_start = input.quietHoursStart;
    if (input.quietHoursEnd !== undefined) updates.quiet_hours_end = input.quietHoursEnd;
    if (input.timezone !== undefined) updates.timezone = input.timezone;
    if (input.revisionReminders !== undefined) updates.revision_reminders = input.revisionReminders;
    if (input.testReminders !== undefined) updates.test_reminders = input.testReminders;
    if (input.studySessionReminders !== undefined) updates.study_session_reminders = input.studySessionReminders;
    if (input.backlogAlerts !== undefined) updates.backlog_alerts = input.backlogAlerts;

    const { data, error } = await supabase
      .from('notification_preferences')
      .update(updates)
      .eq('student_id', studentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update notification preferences: ${error.message}`);
    }

    return {
      studentId: data.student_id,
      emailEnabled: data.email_enabled,
      inAppEnabled: data.in_app_enabled,
      quietHoursStart: data.quiet_hours_start,
      quietHoursEnd: data.quiet_hours_end,
      timezone: data.timezone,
      revisionReminders: data.revision_reminders,
      testReminders: data.test_reminders,
      studySessionReminders: data.study_session_reminders,
      backlogAlerts: data.backlog_alerts,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Creates a notification with quiet hours adjustment and 24-hour deduplication
   */
  static async createNotification(
    studentId: string,
    input: CreateNotificationInput
  ): Promise<NotificationRecord | null> {
    const prefs = await this.getPreferences(studentId);

    // Channel check
    const channels = NotificationRules.resolveActiveChannels(input.type, prefs);
    if (!channels.sendInApp && !channels.sendEmail) {
      return null; // Disabled by student preference
    }

    // 24-hour deduplication check
    const dedupKey = input.metadata?.dedupKey;
    const { data: recent } = await supabase
      .from('notifications')
      .select('type, created_at, metadata')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(30);

    const isDuplicate = NotificationRules.isDuplicateWithinWindow(
      (recent || []).map(r => ({
        type: r.type as any,
        createdAt: r.created_at,
        metadata: r.metadata,
      })),
      input.type,
      dedupKey
    );

    if (isDuplicate) {
      return null; // Deduplicated within 24 hours
    }

    // Quiet hours adjustment
    const requestedSchedule = input.scheduledFor ? new Date(input.scheduledFor) : new Date();
    const adjustedDelivery = NotificationRules.adjustForQuietHours(
      requestedSchedule,
      prefs.quietHoursStart,
      prefs.quietHoursEnd,
      prefs.timezone
    );

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        student_id: studentId,
        type: input.type,
        title: input.title,
        message: input.message,
        action_url: input.actionUrl || null,
        action_required: input.actionRequired,
        action_label: input.actionLabel || null,
        scheduled_for: adjustedDelivery.toISOString(),
        metadata: input.metadata,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return this.mapToRecord(data);
  }

  /**
   * Lists notifications with unread count and actionRequired items
   */
  static async listNotifications(
    studentId: string,
    query: ListNotificationsQueryInput
  ): Promise<{
    notifications: NotificationRecord[];
    total: number;
    unreadCount: number;
    actionRequiredCount: number;
  }> {
    let q = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId);

    if (query.unreadOnly) {
      q = q.eq('is_read', false);
    }
    if (query.actionRequiredOnly) {
      q = q.eq('action_required', true);
    }

    q = q.order('scheduled_for', { ascending: false })
      .range(query.offset, query.offset + query.limit - 1);

    const { data, count, error } = await q;
    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }

    // Counts
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('is_read', false);

    const { count: actionRequiredCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('action_required', true)
      .eq('is_read', false);

    return {
      notifications: (data || []).map(this.mapToRecord),
      total: count || 0,
      unreadCount: unreadCount || 0,
      actionRequiredCount: actionRequiredCount || 0,
    };
  }

  /**
   * Returns all pending Action Required items for the Action Toast system
   */
  static async getPendingActionRequired(studentId: string): Promise<NotificationRecord[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('student_id', studentId)
      .eq('action_required', true)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      throw new Error(`Failed to fetch pending action items: ${error.message}`);
    }

    return (data || []).map(this.mapToRecord);
  }

  /**
   * Marks a notification as read
   */
  static async markAsRead(notificationId: string, studentId: string): Promise<NotificationRecord> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('student_id', studentId)
      .select()
      .maybeSingle();

    if (error || !data) {
      throw new NotFoundError('Notification not found or access denied');
    }

    return this.mapToRecord(data);
  }

  /**
   * Marks all notifications as read for a student
   */
  static async markAllAsRead(studentId: string): Promise<number> {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('student_id', studentId)
      .eq('is_read', false)
      .select('id');

    if (error) {
      throw new Error(`Failed to mark all as read: ${error.message}`);
    }

    return data?.length || 0;
  }

  private static mapToRecord(row: any): NotificationRecord {
    return {
      id: row.id,
      studentId: row.student_id,
      type: row.type,
      title: row.title,
      message: row.message,
      actionUrl: row.action_url || undefined,
      actionRequired: Boolean(row.action_required),
      actionLabel: row.action_label || undefined,
      isRead: Boolean(row.is_read),
      scheduledFor: row.scheduled_for,
      sentAt: row.sent_at || undefined,
      metadata: row.metadata || {},
      createdAt: row.created_at,
    };
  }
}
