import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireResourceOwner } from '../../middleware/authorization';
import { TutorController } from './tutor.controller';
import { aiRateLimit } from '../../middleware/ai-rate-limit';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

router.post('/sessions', TutorController.createSession);
router.get('/sessions', TutorController.listSessions);
router.get('/sessions/:sessionId', requireResourceOwner('tutor_session', 'sessionId'), TutorController.getSession);
// The only route that spends money on a provider, so it carries the shared AI cap.
router.post(
  '/sessions/:sessionId/messages',
  aiRateLimit,
  requireResourceOwner('tutor_session', 'sessionId'),
  TutorController.sendMessage
);
router.delete('/sessions/:sessionId', requireResourceOwner('tutor_session', 'sessionId'), TutorController.deleteSession);

export const tutorRoutes = router;
export default tutorRoutes;
