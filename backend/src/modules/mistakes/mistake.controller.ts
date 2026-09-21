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
import { IdentityService } from '../auth/identity.service';
import { ForbiddenError, UnauthorizedError } from '../../lib/errors';

export class MistakeController {
  private static async resolveStudentId(req: Request): Promise<string> {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const queryStudentId = req.query.studentId as string | undefined;
    if (queryStudentId) {
      const { authorized, studentProfileId } = await IdentityService.isAuthorizedForStudent(
        req.user,
        queryStudentId
      );
      if (!authorized) {
        throw new ForbiddenError('Access denied: Unauthorized to access mistakes for this student');
      }
      return studentProfileId;
    }

    if (req.studentProfileId) {
      return req.studentProfileId;
    }

    return IdentityService.getStudentProfileIdForUser(req.user.id);
  }

  public static async getMistakes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await MistakeController.resolveStudentId(req);
      const query = listMistakesQuerySchema.parse(req.query);

      const result = await MistakeService.getMistakes(studentProfileId, query);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async getMistakeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await MistakeController.resolveStudentId(req);
      const result = await MistakeService.getMistakeById(req.params.id, studentProfileId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async updateMistake(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await MistakeController.resolveStudentId(req);
      const input = updateMistakeSchema.parse(req.body);
      const result = await MistakeService.updateMistake(req.params.id, studentProfileId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async retryMistake(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await MistakeController.resolveStudentId(req);
      const input = retryMistakeSchema.parse(req.body);
      const result = await MistakeService.retryMistake(req.params.id, studentProfileId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
