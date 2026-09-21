import { Request, Response, NextFunction } from 'express';
import { TutorService } from './tutor.service';
import {
  createSessionSchema,
  sendMessageSchema,
  listSessionsQuerySchema,
} from './tutor.schema';
import { UnauthorizedError } from '../../lib/errors';

export class TutorController {
  private static getUserId(req: Request): string {
    const userId = req.user?.id || (req.headers['x-student-id'] as string);
    if (!userId) {
      throw new UnauthorizedError('User ID could not be identified');
    }
    return userId;
  }

  /**
   * POST /tutor/sessions — create new study session
   */
  public static async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = TutorController.getUserId(req);
      const input = createSessionSchema.parse(req.body);
      const session = await TutorService.createSession(userId, input);
      res.status(201).json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /tutor/sessions — list user's sessions
   */
  public static async listSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = TutorController.getUserId(req);
      const query = listSessionsQuerySchema.parse(req.query);
      const result = await TutorService.listSessions(userId, query);
      res.json({ success: true, data: result.sessions, total: result.total });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /tutor/sessions/:sessionId — get session details and messages
   */
  public static async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = TutorController.getUserId(req);
      const result = await TutorService.getSession(req.params.sessionId, userId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /tutor/sessions/:sessionId/messages — send student message & get AI response
   */
  public static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = TutorController.getUserId(req);
      const input = sendMessageSchema.parse(req.body);
      const result = await TutorService.sendMessage(req.params.sessionId, userId, input);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /tutor/sessions/:sessionId — delete session
   */
  public static async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = TutorController.getUserId(req);
      await TutorService.deleteSession(req.params.sessionId, userId);
      res.json({ success: true, message: 'Session deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
