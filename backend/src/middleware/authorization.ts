import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/client';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../lib/errors';
import { IdentityService } from '../modules/auth/identity.service';

/**
 * Middleware ensuring the authenticated user is authorized to access
 * the requested student records (as the student themselves, or as an approved parent/teacher, or admin).
 * Automatically normalizes req.params[paramName] to the canonical student_profiles.id.
 */
export const requireStudentOrMentor = (paramName = 'studentId') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      const targetIdentifier = req.params[paramName] || req.body?.[paramName] || req.query?.[paramName];
      if (!targetIdentifier) {
        // If route has no studentId specified, ensure caller is student and use own studentProfileId
        if (req.user.role === 'student') {
          if (!req.studentProfileId) {
            req.studentProfileId = await IdentityService.getStudentProfileIdForUser(req.user.id);
          }
          return next();
        }
        return next(new ForbiddenError('Target student identifier is required for non-student roles'));
      }

      const { authorized, studentProfileId } = await IdentityService.isAuthorizedForStudent(
        req.user,
        String(targetIdentifier)
      );

      if (!authorized) {
        return next(new ForbiddenError('Access denied: Unauthorized to access this student resource'));
      }

      // Canonical normalization: downstream handlers always receive the true student_profiles.id
      if (req.params[paramName]) {
        req.params[paramName] = studentProfileId;
      }
      if (!req.studentProfileId && req.user.role === 'student') {
        req.studentProfileId = studentProfileId;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export type ProtectedResourceType =
  | 'submission'
  | 'diagnostic_session'
  | 'mistake'
  | 'tutor_session'
  | 'study_session'
  | 'material'
  | 'file';

/**
 * Middleware verifying server-side ownership of specific resource IDs
 * before mutating or accessing them.
 */
export const requireResourceOwner = (resourceType: ProtectedResourceType, idParam = 'id') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Authentication required'));
      }

      // Admins bypass resource ownership
      if (req.user.role === 'admin') {
        return next();
      }

      const resourceId = req.params[idParam];
      if (!resourceId) {
        return next();
      }

      if (!req.studentProfileId && req.user.role === 'student') {
        req.studentProfileId = await IdentityService.getStudentProfileIdForUser(req.user.id);
      }

      let ownerStudentId: string | null = null;
      let ownerUserId: string | null = null;

      switch (resourceType) {
        case 'submission': {
          const { data } = await supabase
            .from('assessment_submissions')
            .select('student_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('Assessment submission not found'));
          ownerStudentId = data.student_id;
          break;
        }
        case 'diagnostic_session': {
          const { data } = await supabase
            .from('diagnostic_sessions')
            .select('student_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('Diagnostic session not found'));
          ownerStudentId = data.student_id;
          break;
        }
        case 'mistake': {
          const { data } = await supabase
            .from('mistakes')
            .select('student_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('Mistake record not found'));
          ownerStudentId = data.student_id;
          break;
        }
        case 'tutor_session': {
          const { data } = await supabase
            .from('tutor_sessions')
            .select('student_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('Tutor session not found'));
          ownerStudentId = data.student_id;
          break;
        }
        case 'study_session': {
          const { data } = await supabase
            .from('study_sessions')
            .select('student_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('Study session not found'));
          ownerUserId = data.student_id; // In study_sessions, student_id REFERENCES profiles(id)
          break;
        }
        case 'material': {
          const { data } = await supabase
            .from('materials')
            .select('user_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('Study material not found'));
          ownerUserId = data.user_id; // In materials, user_id REFERENCES profiles(id)
          break;
        }
        case 'file': {
          const { data } = await supabase
            .from('file_assets')
            .select('user_id')
            .eq('id', resourceId)
            .maybeSingle();
          if (!data) return next(new NotFoundError('File asset not found'));
          ownerUserId = data.user_id;
          break;
        }
      }

      // Check student ownership
      if (req.user.role === 'student') {
        if (ownerStudentId && ownerStudentId !== req.studentProfileId) {
          return next(new ForbiddenError('Access denied: You do not own this resource'));
        }
        if (ownerUserId && ownerUserId !== req.user.id) {
          return next(new ForbiddenError('Access denied: You do not own this resource'));
        }
        return next();
      }

      // Check mentor (parent/teacher) authorization if resource has owner student
      if (ownerStudentId) {
        const { authorized } = await IdentityService.isAuthorizedForStudent(req.user, ownerStudentId);
        if (!authorized) {
          return next(new ForbiddenError('Access denied: You are not authorized to access this resource'));
        }
        return next();
      }

      if (ownerUserId && ownerUserId !== req.user.id) {
        return next(new ForbiddenError('Access denied: You do not own this resource'));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
