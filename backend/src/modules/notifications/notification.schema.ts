import { z } from 'zod';

export const notificationTypeSchema = z.enum([
  'study_session',
  'revision_due',
  'test_scheduled',
  'backlog_risk',
  'exam_countdown',
  'mistake_revision',
  'goal_progress',
  'missed_plan',
  'review_summary',
  'action_required',
]);

export const createNotificationSchema = z.object({
  type: notificationTypeSchema,
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  actionUrl: z.string().optional(),
  actionRequired: z.boolean().default(false),
  actionLabel: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
  metadata: z.record(z.any()).default({}),
});

export const updateNotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
  quietHoursStart: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (HH:MM:SS)').optional(),
  quietHoursEnd: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Invalid time format (HH:MM:SS)').optional(),
  timezone: z.string().optional(),
  revisionReminders: z.boolean().optional(),
  testReminders: z.boolean().optional(),
  studySessionReminders: z.boolean().optional(),
  backlogAlerts: z.boolean().optional(),
});

export const listNotificationsQuerySchema = z.object({
  unreadOnly: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  actionRequiredOnly: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
export type ListNotificationsQueryInput = z.infer<typeof listNotificationsQuerySchema>;
