// =============================================================================
// Exam Readiness Controller
// =============================================================================

import type { Request, Response, NextFunction } from 'express';
import { ReadinessService } from './readiness.service';
import { getReadinessQuerySchema, simulateReadinessSchema } from './readiness.schema';
import { sendSuccess } from '../../lib/api-response';
import { IdentityService } from '../auth/identity.service';
import { ForbiddenError, UnauthorizedError } from '../../lib/errors';

export class ReadinessController {
  private static async resolveTargetStudentId(req: Request): Promise<string> {
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
        throw new ForbiddenError('Access denied: Unauthorized to access readiness for this student');
      }
      return studentProfileId;
    }

    if (req.studentProfileId) {
      return req.studentProfileId;
    }

    return IdentityService.getStudentProfileIdForUser(req.user.id);
  }

  public static async getReadiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await ReadinessController.resolveTargetStudentId(req);
      const query = getReadinessQuerySchema.parse(req.query);

      const result = await ReadinessService.getStudentReadiness(studentProfileId, query);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async simulateScenario(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await ReadinessController.resolveTargetStudentId(req);
      const input = simulateReadinessSchema.parse(req.body);

      const result = await ReadinessService.simulateCustomScenario(studentProfileId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
