import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { FocusController } from './focus.controller';

const router = Router();

router.use(requireAuth);

router.post('/sessions', FocusController.startSession);
router.get('/sessions', FocusController.listSessions);
router.post('/sessions/:sessionId/pause', FocusController.pauseSession);
router.post('/sessions/:sessionId/resume', FocusController.resumeSession);
router.post('/sessions/:sessionId/interruption', FocusController.logInterruption);
router.post('/sessions/:sessionId/complete', FocusController.completeSession);

export const focusRoutes = router;
export default focusRoutes;
