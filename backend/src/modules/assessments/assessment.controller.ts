import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from './assessment.service';
import { sendCreated, sendSuccess } from '../../lib/api-response';
import {
  ListAssessmentsQueryInput,
  CreateAssessmentInput,
  AutosaveAnswerInput,
  SubmitAssessmentInput,
} from './assessment.schema';
import { IdentityService } from '../auth/identity.service';

export class AssessmentController {
  public static async getSubmissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentProfileId = await AssessmentController.resolveStudentProfileId(req);
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const result = await AssessmentService.getSubmissions(studentProfileId, limit, offset);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async getSubmissionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentProfileId = await AssessmentController.resolveStudentProfileId(req);
      const submission = await AssessmentService.getSubmissionById(submissionId, studentProfileId);
      sendSuccess(res, submission);
    } catch (err) {
      next(err);
    }
  }

  private static async resolveStudentProfileId(req: Request): Promise<string> {
    if (req.studentProfileId) return req.studentProfileId;
    return IdentityService.getStudentProfileIdForUser(req.user!.id);
  }

  public static async listAssessments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as ListAssessmentsQueryInput;
      const assessments = await AssessmentService.listAssessments(filters);
      sendSuccess(res, assessments);
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
      const studentProfileId = await AssessmentController.resolveStudentProfileId(req);
      const session = await AssessmentService.startTestAttempt(id, studentProfileId);
      sendCreated(res, session);
    } catch (err) {
      next(err);
    }
  }

  public static async autosaveAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentProfileId = await AssessmentController.resolveStudentProfileId(req);
      const input = req.body as AutosaveAnswerInput;
      const result = await AssessmentService.autosaveAnswer(submissionId, studentProfileId, input);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async resumeAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentProfileId = await AssessmentController.resolveStudentProfileId(req);
      const session = await AssessmentService.resumeTestAttempt(submissionId, studentProfileId);
      sendSuccess(res, session);
    } catch (err) {
      next(err);
    }
  }

  public static async submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { submissionId } = req.params;
      const studentProfileId = await AssessmentController.resolveStudentProfileId(req);
      const input = req.body as SubmitAssessmentInput;
      const submission = await AssessmentService.submitTestAttempt(submissionId, studentProfileId, input);
      sendSuccess(res, submission);
    } catch (err) {
      next(err);
    }
  }
}
