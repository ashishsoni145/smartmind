import { Request, Response, NextFunction } from 'express';
import { FileService } from './file.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../lib/api-response';
import { UnauthorizedError } from '../../lib/errors';
import { ListFilesQueryInput } from './file.schema';

export class FileController {
  public static async createUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await FileService.createSignedUploadUrl(req.user.id, req.body);
      sendCreated(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const query = req.query as unknown as ListFilesQueryInput;
      const { files, total } = await FileService.listFiles(req.user.id, query);
      sendPaginated(res, files, total, query.page || 1, query.limit || 20);
    } catch (err) {
      next(err);
    }
  }

  public static async getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const file = await FileService.getFileById(req.user.id, req.user.role, req.params.id);
      sendSuccess(res, file);
    } catch (err) {
      next(err);
    }
  }

  public static async getDownloadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      const result = await FileService.createSignedDownloadUrl(
        req.user.id,
        req.user.role,
        req.params.id
      );
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new UnauthorizedError();
      await FileService.deleteFile(req.user.id, req.user.role, req.params.id);
      sendSuccess(res, { deleted: true, id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
}
