import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { PlannerController } from './planner.controller';

const router = Router();

router.use(requireAuth);

router.get('/:studentId/today', PlannerController.getToday);
router.get('/:studentId/tomorrow', PlannerController.getTomorrow);
router.get('/:studentId/week', PlannerController.getWeek);
router.post('/:studentId/replan', PlannerController.replan);
router.patch('/:studentId/sessions/:sessionId/tasks/:taskId', PlannerController.updateTask);

export const plannerRoutes = router;
