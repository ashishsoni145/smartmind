import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireStudentOrMentor, requireResourceOwner } from '../../middleware/authorization';
import { DiagnosticController } from './diagnostic.controller';

const router = Router();

router.use(requireAuth);
router.use(resolveStudentProfile);

// Student's diagnostic sessions (supports :studentId as UUID or 'me', with full tenant authorization)
router.get('/:studentId/sessions', requireStudentOrMentor('studentId'), DiagnosticController.listSessions);
router.post('/:studentId/sessions', requireStudentOrMentor('studentId'), DiagnosticController.createSession);

// Session-level operations with resource ownership enforcement
router.get('/sessions/:sessionId', requireResourceOwner('diagnostic_session', 'sessionId'), DiagnosticController.getSession);
router.post('/sessions/:sessionId/submit', requireResourceOwner('diagnostic_session', 'sessionId'), DiagnosticController.submitAnswers);
router.get('/sessions/:sessionId/results', requireResourceOwner('diagnostic_session', 'sessionId'), DiagnosticController.getResults);

export const diagnosticRoutes = router;
