import { Request, Response, NextFunction } from 'express';
import { RevisionService } from './revision.service';
import { createRevisionSessionSchema, completeRevisionSchema } from './revision.schema';

export class RevisionController {
  /** GET /revision/:studentId/due */
  public static async getDue(req: Request, res: Response, next: NextFunction) {
    try {
      const subjectId = req.query.subjectId as string | undefined;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const result = await RevisionService.getDueRevisions(
        req.params.studentId, subjectId, limit
      );
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /** POST /revision/:studentId/sessions */
  public static async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createRevisionSessionSchema.parse(req.body);
      const event = await RevisionService.createRevisionEvent(req.params.studentId, input);
      res.status(201).json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  /** POST /revision/:studentId/events/:eventId/complete */
  public static async completeEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const input = completeRevisionSchema.parse(req.body);
      const event = await RevisionService.completeRevision(req.params.eventId, input);
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  /** GET /revision/:studentId/history */
  public static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const events = await RevisionService.getHistory(req.params.studentId, limit);
      res.json({ success: true, data: events });
    } catch (err) {
      next(err);
    }
  }
}
