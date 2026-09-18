import { Router } from 'express';
import { CurriculumController } from './curriculum.controller';
import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/roles';
import { validateBody, validateQuery } from '../../lib/validate';
import { listChaptersQuerySchema, importCurriculumSchema } from './curriculum.schema';

const router = Router();

router.get('/boards', CurriculumController.getBoards);
router.get('/grades', CurriculumController.getGrades);
router.get('/subjects', CurriculumController.getSubjects);
router.get('/exams', CurriculumController.getTargetExams);

router.get('/chapters', validateQuery(listChaptersQuerySchema), CurriculumController.getChapters);
router.get('/chapters/:chapterId/topics', CurriculumController.getTopics);
router.get('/nodes/:id', CurriculumController.getNodeById);

router.post(
  '/import',
  requireAuth,
  requireAdmin,
  validateBody(importCurriculumSchema),
  CurriculumController.importNodes
);

export const curriculumRoutes = router;
