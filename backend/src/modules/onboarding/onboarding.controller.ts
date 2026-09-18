import { Request, Response, NextFunction } from 'express';
import { OnboardingService } from './onboarding.service';
import { sendSuccess } from '../../lib/api-response';
import { UnauthorizedError } from '../../lib/errors';

export class OnboardingController {
  public static async getDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const draft = await OnboardingService.getDraft(req.user.id);
      sendSuccess(res, draft);
    } catch (err) {
      next(err);
    }
  }

  public static async saveDraft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const saved = await OnboardingService.saveDraft(req.user.id, req.body);
      sendSuccess(res, saved);
    } catch (err) {
      next(err);
    }
  }

  public static async completeOnboarding(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await OnboardingService.completeOnboarding(req.user.id, req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
