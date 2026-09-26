import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireResourceOwner } from '../../middleware/authorization';
import { MaterialController } from './material.controller';
import { aiRateLimit } from '../../middleware/ai-rate-limit';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

// Registration can trigger instant processing and the explicit process routes always do, so those
// carry the shared AI cap. Plain reads do not.
router.post('/', aiRateLimit, MaterialController.create);
router.post('/upload', aiRateLimit, MaterialController.create);
router.get('/', MaterialController.list);
router.get('/:materialId', requireResourceOwner('material', 'materialId'), MaterialController.getById);
router.post('/:materialId/process', aiRateLimit, requireResourceOwner('material', 'materialId'), MaterialController.process);
router.post('/:materialId/reprocess', aiRateLimit, requireResourceOwner('material', 'materialId'), MaterialController.process);
router.delete('/:materialId', requireResourceOwner('material', 'materialId'), MaterialController.delete);

export const materialRoutes = router;
export default materialRoutes;
