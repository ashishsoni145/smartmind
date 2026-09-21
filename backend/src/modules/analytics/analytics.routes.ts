import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';

const router = Router();

// Require student authentication and resolve canonical student profile
router.use(requireAuth);
router.use(resolveStudentProfile);

router.get('/health-score', AnalyticsController.getHealthScore);
router.get('/debrief', AnalyticsController.getDailyDebrief);
router.get('/weekly-review', AnalyticsController.getWeeklyReview);

export { router as analyticsRoutes };
