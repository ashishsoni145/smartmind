import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { BacklogController } from './backlog.controller';

const router = Router();

router.use(requireAuth);

router.get('/:studentId', BacklogController.getBacklog);
router.post('/:studentId/refresh', BacklogController.refreshBacklog);
router.get('/:studentId/items/:itemId', BacklogController.getItem);

export const backlogRoutes = router;
