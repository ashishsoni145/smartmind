import { Request, Response, NextFunction } from 'express';
import { FocusService } from './focus.service';
import {
  startSessionSchema,
  logInterruptionSchema,
  completeSessionSchema,
  listSessionsQuerySchema,
} from './focus.schema';
import { UnauthorizedError } from '../../lib/errors';

export class FocusController {
  private static getStudentId(req: Request): string {
    const studentId = req.user?.id || (req.headers['x-student-id'] as string);
    if (!studentId) {
      throw new UnauthorizedError('Student authentication required');
    }
    return studentId;
  }

  /**
   * POST /focus/sessions — Start a new study block
   */
  public static async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = FocusController.getStudentId(req);
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
      const studentId = FocusController.getStudentId(req);
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
      const studentId = FocusController.getStudentId(req);
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
      const studentId = FocusController.getStudentId(req);
      const input = logInterruptionSchema.parse(req.body);
      const session = await FocusService.logInterruption(req.params.sessionId, studentId, input);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /focus/sessions/:sessionId/complete — Complete session & reflect
   */
  public static async completeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = FocusController.getStudentId(req);
      const input = completeSessionSchema.parse(req.body);
      const session = await FocusService.completeSession(req.params.sessionId, studentId, input);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /focus/sessions — List past sessions and statistics
   */
  public static async listSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = FocusController.getStudentId(req);
      const query = listSessionsQuerySchema.parse(req.query);
      const result = await FocusService.listSessions(studentId, query);
      res.json({ success: true, data: result.sessions, total: result.total, stats: result.stats });
    } catch (err) {
      next(err);
    }
  }
}
