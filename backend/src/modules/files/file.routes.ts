import { Router } from 'express';
import { FileController } from './file.controller';
import { requireAuth } from '../../middleware/auth';
import { requireResourceOwner } from '../../middleware/authorization';
import { validateBody, validateQuery } from '../../lib/validate';
import { createUploadUrlSchema, listFilesQuerySchema } from './file.schema';

const router = Router();

router.post(
  '/upload-url',
  requireAuth,
  validateBody(createUploadUrlSchema),
  FileController.createUploadUrl
);

router.get('/', requireAuth, validateQuery(listFilesQuerySchema), FileController.listFiles);
router.get('/:id', requireAuth, requireResourceOwner('file', 'id'), FileController.getFile);
router.get('/:id/download', requireAuth, requireResourceOwner('file', 'id'), FileController.getDownloadUrl);
router.delete('/:id', requireAuth, requireResourceOwner('file', 'id'), FileController.deleteFile);

export const fileRoutes = router;
