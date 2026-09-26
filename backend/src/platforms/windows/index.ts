import { Router } from 'express';

const router = Router();

// Windows desktop platform specific route extensions can be mounted here
router.get('/health', (_req, res) => {
  res.json({ success: true, platform: 'windows', status: 'prepared' });
});

export const windowsPlatformRoutes = router;
