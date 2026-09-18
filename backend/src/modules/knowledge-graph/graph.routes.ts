import { Router } from 'express';
import { GraphController } from './graph.controller';
import { requireAuth } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/roles';
import { validateBody, validateQuery } from '../../lib/validate';
import {
  listConceptsQuerySchema,
  createConceptSchema,
  createEdgeSchema,
  mapConceptToNodeSchema,
} from './graph.schema';

const router = Router();

router.get('/concepts', validateQuery(listConceptsQuerySchema), GraphController.listConcepts);
router.get('/concepts/:id', GraphController.getConceptById);
router.get('/concepts/:id/prerequisites', GraphController.getPrerequisites);
router.get('/concepts/:id/related', GraphController.getRelatedConcepts);
router.get('/node/:curriculumNodeId', GraphController.getCurriculumNodeConcepts);

router.post(
  '/concepts',
  requireAuth,
  requireAdmin,
  validateBody(createConceptSchema),
  GraphController.createConcept
);

router.post(
  '/edges',
  requireAuth,
  requireAdmin,
  validateBody(createEdgeSchema),
  GraphController.createEdge
);

router.post(
  '/mapping',
  requireAuth,
  requireAdmin,
  validateBody(mapConceptToNodeSchema),
  GraphController.mapConceptToNode
);

export const graphRoutes = router;
