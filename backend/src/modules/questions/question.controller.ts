import { Request, Response, NextFunction } from 'express';
import { QuestionService } from './question.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../lib/api-response';
import { ListQuestionsQueryInput, IngestQuestionsInput } from './question.schema';

export class QuestionController {
  public static async listQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as ListQuestionsQueryInput;
      const { questions, total } = await QuestionService.listQuestions(filters);
      sendPaginated(res, questions, total, filters.page || 1, filters.limit || 20);
    } catch (err) {
      next(err);
    }
  }

  public static async getPyqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectId, curriculumNodeId, targetExamId, year, limit } = req.query as any;
      const pyqs = await QuestionService.getPyqs({
        subjectId,
        curriculumNodeId,
        targetExamId,
        year: year ? parseInt(year, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });
      sendSuccess(res, pyqs);
    } catch (err) {
      next(err);
    }
  }

  public static async getImportantQuestions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { curriculumNodeId } = req.query as { curriculumNodeId?: string };
      const questions = await QuestionService.getImportantQuestions(curriculumNodeId);
      sendSuccess(res, questions);
    } catch (err) {
      next(err);
    }
  }

  public static async getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const question = await QuestionService.getQuestionById(id);
      sendSuccess(res, question);
    } catch (err) {
      next(err);
    }
  }

  public static async ingestQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questions } = req.body as IngestQuestionsInput;
      const result = await QuestionService.ingestQuestions(questions);
      sendCreated(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async analyzePatterns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectId, targetExamId } = req.query as { subjectId?: string; targetExamId?: string };
      const patterns = await QuestionService.analyzeExamPatterns(subjectId, targetExamId);
      sendSuccess(res, patterns);
    } catch (err) {
      next(err);
    }
  }
}
