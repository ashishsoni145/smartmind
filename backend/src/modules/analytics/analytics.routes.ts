import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { requireAuth } from '../../middleware/auth';
import { resolveStudentProfile } from '../../middleware/identity';
import { aiRateLimit } from '../../middleware/ai-rate-limit';

const router = Router();

// Require student authentication and resolve canonical student profile
router.use(requireAuth);
router.use(resolveStudentProfile);

router.get('/health-score', AnalyticsController.getHealthScore);
// Both of these call the review-analytics agent, so they carry the shared AI cap.
router.get('/debrief', aiRateLimit, AnalyticsController.getDailyDebrief);
router.get('/weekly-review', aiRateLimit, AnalyticsController.getWeeklyReview);

export { router as analyticsRoutes };
