import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireStudentOrMentor } from '../../middleware/authorization';
import { BacklogController } from './backlog.controller';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);
router.use('/:studentId', requireStudentOrMentor('studentId'));

router.get('/:studentId', BacklogController.getBacklog);
router.post('/:studentId/refresh', BacklogController.refreshBacklog);
router.get('/:studentId/items/:itemId', BacklogController.getItem);

export const backlogRoutes = router;
