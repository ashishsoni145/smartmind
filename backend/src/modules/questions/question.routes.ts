import { Router } from 'express';
import { QuestionController } from './question.controller';
import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/roles';
import { validateBody, validateQuery } from '../../lib/validate';
import { listQuestionsQuerySchema, ingestQuestionsSchema } from './question.schema';

const router = Router();

router.get('/', validateQuery(listQuestionsQuerySchema), QuestionController.listQuestions);
router.get('/pyqs', QuestionController.getPyqs);
router.get('/important', QuestionController.getImportantQuestions);
router.get('/patterns', QuestionController.analyzePatterns);
router.get('/adaptive', requireAuth, QuestionController.selectAdaptive);
router.get('/:id', QuestionController.getQuestionById);
router.post('/:id/validate', requireAuth, QuestionController.validateAnswer);

router.post(
  '/ingest',
  requireAuth,
  requireAdmin,
  validateBody(ingestQuestionsSchema),
  QuestionController.ingestQuestions
);

export const questionRoutes = router;

