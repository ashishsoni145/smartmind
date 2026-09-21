import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/roles';
import { validateBody, validateQuery } from '../../lib/validate';
import {
  listAssessmentsQuerySchema,
  createAssessmentSchema,
  autosaveAnswerSchema,
  submitAssessmentSchema,
} from './assessment.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(listAssessmentsQuerySchema), AssessmentController.listAssessments);
router.post('/', requireAdmin, validateBody(createAssessmentSchema), AssessmentController.createAssessment);
router.get('/:id', AssessmentController.getAssessmentById);
router.post('/:id/start', AssessmentController.startAttempt);
router.post('/submissions/:submissionId/autosave', validateBody(autosaveAnswerSchema), AssessmentController.autosaveAnswer);
router.get('/submissions/:submissionId/resume', AssessmentController.resumeAttempt);
router.post('/submissions/:submissionId/submit', validateBody(submitAssessmentSchema), AssessmentController.submitAttempt);

export const assessmentRoutes = router;
