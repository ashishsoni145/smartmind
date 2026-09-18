import { Router, Request, Response, NextFunction } from 'express';
import { HealthService } from './health.service';
import { sendSuccess } from '../../lib/api-response';

const router = Router();

router.get('/', (_req: Request, res: Response): void => {
  const status = HealthService.getBasicHealth();
  sendSuccess(res, status);
});

router.get('/db', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = await HealthService.getDbHealth();
    const statusCode = status.status === 'ok' ? 200 : 503;
    res.status(statusCode).json({
      success: status.status === 'ok',
      data: status,
    });
  } catch (err) {
    next(err);
  }
});

export const healthRoutes = router;
