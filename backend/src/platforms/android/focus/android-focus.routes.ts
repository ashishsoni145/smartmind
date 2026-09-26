import { Router } from 'express';
import { requireAuth } from '../../../middleware/auth';
import { resolveStudentProfile } from '../../../middleware/identity';
import { AndroidFocusController } from './android-focus.controller';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

router.post('/sessions', AndroidFocusController.startSession);
router.post('/sync', AndroidFocusController.syncOutbox);

export const androidFocusRoutes = router;
export default androidFocusRoutes;
