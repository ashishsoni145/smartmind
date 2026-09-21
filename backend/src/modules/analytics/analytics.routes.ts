import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// Require student authentication
router.use(requireAuth);

router.get('/health-score', AnalyticsController.getHealthScore);
router.get('/debrief', AnalyticsController.getDailyDebrief);
router.get('/weekly-review', AnalyticsController.getWeeklyReview);

export { router as analyticsRoutes };
