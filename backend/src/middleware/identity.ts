import { Request, Response, NextFunction } from 'express';
import { IdentityService } from '../modules/auth/identity.service';

/**
 * Middleware that resolves and attaches `req.studentProfileId`
 * for authenticated student users.
 */
export const resolveStudentProfile = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user && req.user.role === 'student') {
      req.studentProfileId = await IdentityService.getStudentProfileIdForUser(req.user.id);
    }
    next();
  } catch (err) {
    next(err);
  }
};
