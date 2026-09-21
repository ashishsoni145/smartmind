// =============================================================================
// Mistake Routes
// =============================================================================

import { Router } from 'express';
import { MistakeController } from './mistake.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', MistakeController.getMistakes);
router.get('/:id', MistakeController.getMistakeById);
router.patch('/:id', MistakeController.updateMistake);
router.post('/:id/retry', MistakeController.retryMistake);

export { router as mistakeRoutes };
