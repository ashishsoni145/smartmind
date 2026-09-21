// =============================================================================
// Mistake Controller
// =============================================================================

import type { Request, Response, NextFunction } from 'express';
import { MistakeService } from './mistake.service';
import {
  listMistakesQuerySchema,
  updateMistakeSchema,
  retryMistakeSchema,
} from './mistake.schema';
import { sendSuccess } from '../../lib/api-response';

export class MistakeController {
  public static async getMistakes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.studentId || (req as any).user?.id;
      const query = listMistakesQuerySchema.parse(req.query);

      const result = await MistakeService.getMistakes(studentId, query);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async getMistakeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.studentId || (req as any).user?.id;
      const result = await MistakeService.getMistakeById(req.params.id, studentId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async updateMistake(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.studentId || (req as any).user?.id;
      const input = updateMistakeSchema.parse(req.body);
      const result = await MistakeService.updateMistake(req.params.id, studentId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async retryMistake(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = (req as any).user?.studentId || (req as any).user?.id;
      const input = retryMistakeSchema.parse(req.body);
      const result = await MistakeService.retryMistake(req.params.id, studentId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
