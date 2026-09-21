// =============================================================================
// Exam Readiness Routes
// =============================================================================

import { Router } from 'express';
import { ReadinessController } from './readiness.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', ReadinessController.getReadiness);
router.post('/simulate', ReadinessController.simulateScenario);

export { router as readinessRoutes };
