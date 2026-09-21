// =============================================================================
// Mistake Routes
// =============================================================================

import { Router } from 'express';
import { MistakeController } from './mistake.controller';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireResourceOwner } from '../../middleware/authorization';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

router.get('/', MistakeController.getMistakes);
router.get('/:id', requireResourceOwner('mistake', 'id'), MistakeController.getMistakeById);
router.patch('/:id', requireResourceOwner('mistake', 'id'), MistakeController.updateMistake);
router.post('/:id/retry', requireResourceOwner('mistake', 'id'), MistakeController.retryMistake);

export { router as mistakeRoutes };
