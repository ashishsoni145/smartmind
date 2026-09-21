// =============================================================================
// Exam Readiness Routes
// =============================================================================

import { Router } from 'express';
import { ReadinessController } from './readiness.controller';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

router.get('/', ReadinessController.getReadiness);
router.post('/simulate', ReadinessController.simulateScenario);

export { router as readinessRoutes };
