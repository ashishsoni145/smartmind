import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';
import { AuthenticatedUser } from '../types/express';

type UserRole = AuthenticatedUser['role'];

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access forbidden: requires one of [${allowedRoles.join(', ')}], current role is '${req.user.role}'`
        )
      );
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireTeacherOrAdmin = requireRole('teacher', 'admin');
export const requireParentOrAdmin = requireRole('parent', 'admin');
