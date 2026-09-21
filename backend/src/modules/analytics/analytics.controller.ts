import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { getDebriefQuerySchema, getWeeklyReviewQuerySchema } from './analytics.schema';
import { UnauthorizedError } from '../../lib/errors';

export class AnalyticsController {
  private static getStudentId(req: Request): string {
    const studentId = req.user?.id || (req.headers['x-student-id'] as string);
    if (!studentId) {
      throw new UnauthorizedError('Student authentication required');
    }
    return studentId;
  }

  /**
   * GET /analytics/health-score — 7-dimension explainable health score
   */
  public static async getHealthScore(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = AnalyticsController.getStudentId(req);
      const healthScore = await AnalyticsService.getHealthScore(studentId);
      res.json({ success: true, data: healthScore });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /analytics/debrief — Daily AI debrief grounded in telemetry
   */
  public static async getDailyDebrief(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = AnalyticsController.getStudentId(req);
      const query = getDebriefQuerySchema.parse(req.query);
      const debrief = await AnalyticsService.getDailyDebrief(studentId, query.date);
      res.json({ success: true, data: debrief });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /analytics/weekly-review — Weekly strategic review
   */
  public static async getWeeklyReview(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = AnalyticsController.getStudentId(req);
      const query = getWeeklyReviewQuerySchema.parse(req.query);
      const review = await AnalyticsService.getWeeklyReview(studentId, query.weekStartDate);
      res.json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }
}
