import { Request, Response, NextFunction } from 'express';
import { BacklogService } from './backlog.service';
import { getBacklogQuerySchema } from './backlog.schema';

export class BacklogController {
  /** GET /backlog/:studentId — get prioritized backlog */
  public static async getBacklog(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const filters = getBacklogQuerySchema.parse(req.query);
      const result = await BacklogService.getBacklog(studentId, filters);
      res.json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit,
          summary: result.summary,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /** POST /backlog/:studentId/refresh — regenerate/re-prioritize */
  public static async refreshBacklog(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const summary = await BacklogService.generateBacklog(studentId);
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }

  /** GET /backlog/:studentId/items/:itemId — single item detail */
  public static async getItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await BacklogService.getBacklogItem(req.params.itemId);
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  }
}
