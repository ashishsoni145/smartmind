import { Request, Response, NextFunction } from 'express';
import { CurriculumService } from './curriculum.service';
import { sendSuccess } from '../../lib/api-response';
import { ListChaptersQueryInput, ImportCurriculumInput } from './curriculum.schema';

export class CurriculumController {
  public static async getBoards(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await CurriculumService.getBoards();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getGrades(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await CurriculumService.getGrades();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getSubjects(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await CurriculumService.getSubjects();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getTargetExams(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await CurriculumService.getTargetExams();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as ListChaptersQueryInput;
      const data = await CurriculumService.getChapters(filters);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { chapterId } = req.params;
      const data = await CurriculumService.getTopics(chapterId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getNodeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = await CurriculumService.getNodeById(id);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async importNodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nodes } = req.body as ImportCurriculumInput;
      const result = await CurriculumService.importNodes(nodes);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
