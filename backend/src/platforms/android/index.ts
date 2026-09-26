import { Router } from 'express';
import { androidFocusRoutes } from './focus/android-focus.routes';

const router = Router();

router.use('/focus', androidFocusRoutes);

export const androidPlatformRoutes = router;
