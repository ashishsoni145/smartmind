import { Router } from 'express';
import { UserController } from './user.controller';
import { requireAuth } from '../../middleware/auth';
import { requireSelfOrAdmin } from '../../middleware/tenant';
import { validateBody } from '../../lib/validate';
import { updateProfileSchema, updateStudentProfileSchema } from './user.schema';

const router = Router();

// Current user profile endpoints
router.get('/me', requireAuth, UserController.getMe);
router.patch('/me', requireAuth, validateBody(updateProfileSchema), UserController.updateMe);
router.get('/me/student-profile', requireAuth, UserController.getStudentProfile);
router.put(
  '/me/student-profile',
  requireAuth,
  validateBody(updateStudentProfileSchema),
  UserController.updateStudentProfile
);

// Access specific user (self, parent, teacher, or admin)
router.get('/:id', requireAuth, requireSelfOrAdmin('id'), UserController.getUserById);

export const userRoutes = router;
