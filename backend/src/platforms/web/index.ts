import { Router } from 'express';

const router = Router();

// Web platform specific route extensions can be mounted here
router.get('/health', (_req, res) => {
  res.json({ success: true, platform: 'web', status: 'healthy' });
});

export const webPlatformRoutes = router;
