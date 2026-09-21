import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { MaterialController } from './material.controller';

const router = Router();

router.use(requireAuth);

router.post('/', MaterialController.create);
router.get('/', MaterialController.list);
router.get('/:materialId', MaterialController.getById);
router.post('/:materialId/process', MaterialController.process);
router.delete('/:materialId', MaterialController.delete);

export const materialRoutes = router;
export default materialRoutes;
