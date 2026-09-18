import { Router } from 'express';
import { OnboardingController } from './onboarding.controller';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../lib/validate';
import { saveDraftSchema, completeOnboardingSchema } from './onboarding.schema';

const router = Router();

router.get('/draft', requireAuth, OnboardingController.getDraft);
router.post(
  '/draft',
  requireAuth,
  validateBody(saveDraftSchema),
  OnboardingController.saveDraft
);
router.post(
  '/complete',
  requireAuth,
  validateBody(completeOnboardingSchema),
  OnboardingController.completeOnboarding
);

export const onboardingRoutes = router;
