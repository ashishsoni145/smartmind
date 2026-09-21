import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireResourceOwner } from '../../middleware/authorization';
import { MaterialController } from './material.controller';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

router.post('/', MaterialController.create);
router.get('/', MaterialController.list);
router.get('/:materialId', requireResourceOwner('material', 'materialId'), MaterialController.getById);
router.post('/:materialId/process', requireResourceOwner('material', 'materialId'), MaterialController.process);
router.delete('/:materialId', requireResourceOwner('material', 'materialId'), MaterialController.delete);

export const materialRoutes = router;
export default materialRoutes;
