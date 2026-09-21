import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { requireStudentOrMentor } from '../../middleware/authorization';
import { StudentModelController } from './student-model.controller';

const router = Router();

// All student model routes require authentication, identity resolution, and student/mentor authorization
router.use(requireAuth);
router.use(resolveStudentProfile);
router.use('/:studentId', requireStudentOrMentor('studentId'));

// Model summary
router.get('/:studentId', StudentModelController.getModel);
router.get('/:studentId/summary', StudentModelController.getSummary);

// Knowledge states
router.get('/:studentId/states', StudentModelController.getStates);
router.get('/:studentId/states/:nodeId', StudentModelController.getState);

// Evidence (controlled write path)
router.post('/:studentId/evidence', StudentModelController.recordEvidence);
router.get('/:studentId/evidence', StudentModelController.getEvidence);

// Recalculation & snapshots
router.post('/:studentId/recalculate', StudentModelController.recalculate);
router.post('/:studentId/snapshot', StudentModelController.snapshot);

export const studentModelRoutes = router;
