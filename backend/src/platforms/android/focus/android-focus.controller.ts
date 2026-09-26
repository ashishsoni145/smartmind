import { Request, Response, NextFunction } from 'express';
import { FocusService } from '../../../modules/focus/focus.service';
import { logger } from '../../../lib/logger';

export class AndroidFocusController {
  public static async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = req.studentProfileId || req.user?.id || '';
      const result = await FocusService.startSession(studentProfileId, {
        ...req.body,
        platform: 'android',
      });
      res.status(201).json({
        success: true,
        platform: 'android',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async syncOutbox(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = req.studentProfileId || req.user?.id || '';
      const { sessions, interruptions } = req.body || {};

      logger.info(
        { studentProfileId, sessionsCount: sessions?.length, interruptionsCount: interruptions?.length },
        'Android Focus outbox batch sync received'
      );

      const processedSessions = [];
      if (Array.isArray(sessions)) {
        for (const sessionData of sessions) {
          try {
            const synced = await FocusService.startSession(studentProfileId, {
              ...sessionData,
              platform: 'android',
            });
            processedSessions.push(synced);
          } catch (err: any) {
            logger.warn({ error: err?.message, sessionData }, 'Outbox session sync warning');
          }
        }
      }

      res.status(200).json({
        success: true,
        syncedSessionsCount: processedSessions.length,
        syncedAt: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
