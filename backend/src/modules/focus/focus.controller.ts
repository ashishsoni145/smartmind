import { Request, Response, NextFunction } from 'express';
import { FocusService } from './focus.service';
import {
  startSessionSchema,
  logInterruptionSchema,
  completeSessionSchema,
  listSessionsQuerySchema,
} from './focus.schema';
import { UnauthorizedError } from '../../lib/errors';
import { IdentityService } from '../auth/identity.service';

export class FocusController {
  private static async getStudentId(req: Request): Promise<string> {
    if (!req.user) {
      throw new UnauthorizedError('Student authentication required');
    }
    return req.user.id;
  }

  /**
   * POST /focus/sessions — Start a new study block
   */
  public static async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await FocusController.getStudentId(req);
      const input = startSessionSchema.parse(req.body);
      const session = await FocusService.startSession(studentId, input);
      res.status(201).json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /focus/sessions/:sessionId/pause — Pause study session
   */
  public static async pauseSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await FocusController.getStudentId(req);
      const session = await FocusService.pauseSession(req.params.sessionId, studentId);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /focus/sessions/:sessionId/resume — Resume study session
   */
  public static async resumeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await FocusController.getStudentId(req);
      const session = await FocusService.resumeSession(req.params.sessionId, studentId);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /focus/sessions/:sessionId/interruption — Log interruption
   */
  public static async logInterruption(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await FocusController.getStudentId(req);
      const input = logInterruptionSchema.parse(req.body);
      const session = await FocusService.logInterruption(req.params.sessionId, studentId, input);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /focus/sessions/:sessionId/complete — Complete focus session
   */
  public static async completeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await FocusController.getStudentId(req);
      const input = completeSessionSchema.parse(req.body);
      const session = await FocusService.completeSession(req.params.sessionId, studentId, input);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /focus/sessions — List study history
   */
  public static async listSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = await FocusController.getStudentId(req);
      const query = listSessionsQuerySchema.parse(req.query);
      const sessions = await FocusService.listSessions(studentId, query);
      res.json({ success: true, data: sessions });
    } catch (err) {
      next(err);
    }
  }
}
