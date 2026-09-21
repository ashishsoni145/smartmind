// =============================================================================
// Exam Readiness Controller
// =============================================================================

import type { Request, Response, NextFunction } from 'express';
import { ReadinessService } from './readiness.service';
import { getReadinessQuerySchema, simulateReadinessSchema } from './readiness.schema';
import { sendSuccess } from '../../lib/api-response';

export class ReadinessController {
  public static async getReadiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.studentId || (req as any).user?.id;
      const query = getReadinessQuerySchema.parse(req.query);

      const result = await ReadinessService.getStudentReadiness(studentId, query);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async simulateScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.studentId || (req as any).user?.id;
      const input = simulateReadinessSchema.parse(req.body);

      const result = await ReadinessService.simulateCustomScenario(studentId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
