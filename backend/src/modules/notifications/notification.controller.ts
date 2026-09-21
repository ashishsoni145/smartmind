import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import {
  createNotificationSchema,
  updateNotificationPreferencesSchema,
  listNotificationsQuerySchema,
} from './notification.schema';
import { UnauthorizedError } from '../../lib/errors';

export class NotificationController {
  private static async getStudentId(req: Request): Promise<string> {
    if (!req.user) {
      throw new UnauthorizedError('Student authentication required');
    }
    return req.user.id;
  }

  /**
   * GET /notifications/preferences — Get preferences
   */
  public static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const prefs = await NotificationService.getPreferences(studentId);
      res.json({ success: true, data: prefs });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /notifications/preferences — Update preferences
   */
  public static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const input = updateNotificationPreferencesSchema.parse(req.body);
      const prefs = await NotificationService.updatePreferences(studentId, input);
      res.json({ success: true, data: prefs });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /notifications — Create notification (in-app / reminder)
   */
  public static async createNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const input = createNotificationSchema.parse(req.body);
      const notif = await NotificationService.createNotification(studentId, input);
      res.status(201).json({ success: true, data: notif });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /notifications — List notifications with counts
   */
  public static async listNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const query = listNotificationsQuerySchema.parse(req.query);
      const result = await NotificationService.listNotifications(studentId, query);
      res.json({
        success: true,
        data: result.notifications,
        total: result.total,
        unreadCount: result.unreadCount,
        actionRequiredCount: result.actionRequiredCount,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /notifications/action-required — Get pending Action Required items for toasts
   */
  public static async getPendingActionRequired(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const items = await NotificationService.getPendingActionRequired(studentId);
      res.json({ success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /notifications/:notificationId/read — Mark single notification as read
   */
  public static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const notif = await NotificationService.markAsRead(req.params.notificationId, studentId);
      res.json({ success: true, data: notif });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /notifications/read-all — Mark all as read
   */
  public static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await NotificationController.getStudentId(req);
      const count = await NotificationService.markAllAsRead(studentId);
      res.json({ success: true, markedCount: count });
    } catch (err) {
      next(err);
    }
  }
}
