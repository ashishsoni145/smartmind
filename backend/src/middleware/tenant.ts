import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/client';
import { ForbiddenError, UnauthorizedError } from '../lib/errors';

export const requireSelfOrAdmin = (paramKey = 'userId') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const targetUserId = req.params[paramKey] || req.body[paramKey];
      if (!targetUserId) {
        return next();
      }

      // Allow if accessing self
      if (req.user.id === targetUserId) {
        return next();
      }

      // Allow if platform admin
      if (req.user.role === 'admin') {
        return next();
      }

      // If parent, check approved parent-student link
      if (req.user.role === 'parent') {
        const { data: link } = await supabase
          .from('parent_student_links')
          .select('id')
          .eq('parent_id', req.user.id)
          .eq('student_id', targetUserId)
          .eq('consent_status', 'approved')
          .maybeSingle();

        if (link) {
          return next();
        }
      }

      // If teacher, check approved teacher-student link
      if (req.user.role === 'teacher') {
        const { data: link } = await supabase
          .from('teacher_student_links')
          .select('id')
          .eq('teacher_id', req.user.id)
          .eq('student_id', targetUserId)
          .eq('consent_status', 'approved')
          .maybeSingle();

        if (link) {
          return next();
        }
      }

      return next(
        new ForbiddenError('Access denied: You do not have permission to access this resource')
      );
    } catch (err) {
      next(err);
    }
  };
};
