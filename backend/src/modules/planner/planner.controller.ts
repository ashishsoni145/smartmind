import { Request, Response, NextFunction } from 'express';
import { PlannerService } from './planner.service';
import { updateTaskSchema } from './planner.schema';

export class PlannerController {
  /** GET /planner/:studentId/today */
  public static async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await PlannerService.getToday(req.params.studentId);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  /** GET /planner/:studentId/tomorrow */
  public static async getTomorrow(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await PlannerService.getTomorrow(req.params.studentId);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  /** GET /planner/:studentId/week */
  public static async getWeek(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await PlannerService.getThisWeek(req.params.studentId);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  /** POST /planner/:studentId/replan */
  public static async replan(req: Request, res: Response, next: NextFunction) {
    try {
      const fromDate = req.body.fromDate as string | undefined;
      const plan = await PlannerService.replan(req.params.studentId, fromDate);
      res.json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /planner/:studentId/sessions/:sessionId/tasks/:taskId */
  public static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId, taskId } = req.params;
      const input = updateTaskSchema.parse(req.body);
      const session = await PlannerService.updateTaskStatus(sessionId, taskId, input.status);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }
}
