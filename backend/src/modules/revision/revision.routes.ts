import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireStudentOrMentor } from '../../middleware/authorization';
import { RevisionController } from './revision.controller';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);
router.use('/:studentId', requireStudentOrMentor('studentId'));

router.get('/:studentId/due', RevisionController.getDue);
router.post('/:studentId/sessions', RevisionController.createSession);
router.post('/:studentId/events/:eventId/complete', RevisionController.completeEvent);
router.get('/:studentId/history', RevisionController.getHistory);

export const revisionRoutes = router;
