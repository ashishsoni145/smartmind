import { Router } from 'express';
import { SearchController } from './search.controller';
import { optionalAuth } from '../../middleware/auth';
import { validateQuery } from '../../lib/validate';
import { searchQuerySchema } from './search.schema';

const router = Router();

router.get('/', optionalAuth, validateQuery(searchQuerySchema), SearchController.search);

export const searchRoutes = router;
