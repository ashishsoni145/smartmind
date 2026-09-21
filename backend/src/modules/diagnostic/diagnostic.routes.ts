import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { DiagnosticController } from './diagnostic.controller';

const router = Router();

router.use(requireAuth);

// Student's diagnostic sessions
router.get('/:studentId/sessions', DiagnosticController.listSessions);
router.post('/:studentId/sessions', DiagnosticController.createSession);

// Session-level operations
router.get('/sessions/:sessionId', DiagnosticController.getSession);
router.post('/sessions/:sessionId/submit', DiagnosticController.submitAnswers);
router.get('/sessions/:sessionId/results', DiagnosticController.getResults);

export const diagnosticRoutes = router;
