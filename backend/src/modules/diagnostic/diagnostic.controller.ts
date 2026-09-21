import { Request, Response, NextFunction } from 'express';
import { DiagnosticService } from './diagnostic.service';
import { createDiagnosticSchema, submitDiagnosticSchema } from './diagnostic.schema';

export class DiagnosticController {
  /** POST /diagnostic/sessions — create a new diagnostic session */
  public static async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const input = createDiagnosticSchema.parse(req.body);
      const session = await DiagnosticService.createSession(studentId, input);
      res.status(201).json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /** GET /diagnostic/sessions/:sessionId — get session with questions */
  public static async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await DiagnosticService.getSession(req.params.sessionId);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /** GET /diagnostic/:studentId/sessions — list student's diagnostic sessions */
  public static async listSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await DiagnosticService.getStudentSessions(req.params.studentId);
      res.json({ success: true, data: sessions });
    } catch (err) {
      next(err);
    }
  }

  /** POST /diagnostic/sessions/:sessionId/submit — submit answers and score */
  public static async submitAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const input = submitDiagnosticSchema.parse(req.body);
      const session = await DiagnosticService.submitAnswers(req.params.sessionId, input);
      res.json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  }

  /** GET /diagnostic/sessions/:sessionId/results — get analyzed results */
  public static async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await DiagnosticService.getSession(req.params.sessionId);
      res.json({
        success: true,
        data: {
          results: session.results,
          strengths: session.strengths,
          weaknesses: session.weaknesses,
          confidenceLevel: session.confidenceLevel,
          totalCorrect: session.totalCorrect,
          totalQuestions: session.totalQuestions,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
