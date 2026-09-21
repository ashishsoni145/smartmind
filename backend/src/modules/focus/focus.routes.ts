import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireResourceOwner } from '../../middleware/authorization';
import { FocusController } from './focus.controller';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

router.post('/sessions', FocusController.startSession);
router.get('/sessions', FocusController.listSessions);
router.post('/sessions/:sessionId/pause', requireResourceOwner('study_session', 'sessionId'), FocusController.pauseSession);
router.post('/sessions/:sessionId/resume', requireResourceOwner('study_session', 'sessionId'), FocusController.resumeSession);
router.post('/sessions/:sessionId/interruption', requireResourceOwner('study_session', 'sessionId'), FocusController.logInterruption);
router.post('/sessions/:sessionId/complete', requireResourceOwner('study_session', 'sessionId'), FocusController.completeSession);

export const focusRoutes = router;
export default focusRoutes;
