import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from './assessment.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../lib/api-response';
import type {
  ListAssessmentsQueryInput,
  CreateAssessmentInput,
  AutosaveAnswerInput,
  SubmitAssessmentInput,
} from './assessment.schema';

export class AssessmentController {
  public static async listAssessments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as ListAssessmentsQueryInput;
      const { assessments, total } = await AssessmentService.listAssessments(filters);
      sendPaginated(res, assessments, total, filters.page || 1, filters.limit || 20);
    } catch (err) {
      next(err);
    }
  }

  public static async getAssessmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const assessment = await AssessmentService.getAssessmentById(id);
      sendSuccess(res, assessment);
    } catch (err) {
      next(err);
    }
  }

  public static async createAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateAssessmentInput;
      const assessment = await AssessmentService.createAssessment(input);
      sendCreated(res, assessment);
    } catch (err) {
      next(err);
    }
  }

  public static async startAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const studentId = req.user!.id;
      const session = await AssessmentService.startTestAttempt(id, studentId);
      sendCreated(res, session);
    } catch (err) {
      next(err);
    }
  }

  public static async autosaveAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentId = req.user!.id;
      const input = req.body as AutosaveAnswerInput;
      const result = await AssessmentService.autosaveAnswer(submissionId, studentId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async resumeAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentId = req.user!.id;
      const session = await AssessmentService.resumeTestAttempt(submissionId, studentId);
      sendSuccess(res, session);
    } catch (err) {
      next(err);
    }
  }

  public static async submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentId = req.user!.id;
      const input = req.body as SubmitAssessmentInput;
      const submission = await AssessmentService.submitTestAttempt(submissionId, studentId, input);
      sendSuccess(res, submission);
    } catch (err) {
      next(err);
    }
  }
}
