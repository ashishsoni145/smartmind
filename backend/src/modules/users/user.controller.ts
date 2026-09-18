import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '../../lib/api-response';
import { UnauthorizedError } from '../../lib/errors';

export class UserController {
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const profile = await UserService.getProfile(req.user.id);
      sendSuccess(res, profile);
    } catch (err) {
      next(err);
    }
  }

  public static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const updated = await UserService.updateProfile(req.user.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  public static async getStudentProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const studentProfile = await UserService.getStudentProfile(req.user.id);
      sendSuccess(res, studentProfile);
    } catch (err) {
      next(err);
    }
  }

  public static async updateStudentProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const updated = await UserService.updateStudentProfile(req.user.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const profile = await UserService.getProfile(id);
      sendSuccess(res, profile);
    } catch (err) {
      next(err);
    }
  }
}
