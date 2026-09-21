import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { TutorController } from './tutor.controller';

const router = Router();

router.use(requireAuth);

router.post('/sessions', TutorController.createSession);
router.get('/sessions', TutorController.listSessions);
router.get('/sessions/:sessionId', TutorController.getSession);
router.post('/sessions/:sessionId/messages', TutorController.sendMessage);
router.delete('/sessions/:sessionId', TutorController.deleteSession);

export const tutorRoutes = router;
export default tutorRoutes;
