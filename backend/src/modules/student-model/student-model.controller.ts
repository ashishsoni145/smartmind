import { Request, Response, NextFunction } from 'express';
import { StudentModelService } from './student-model.service';
import {
  recordEvidenceSchema,
  getStatesQuerySchema,
  recalculateSchema,
} from './student-model.schema';

export class StudentModelController {
  /** GET /student-model/:studentId — full model summary */
  public static async getModel(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const summary = await StudentModelService.getModelSummary(studentId);
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }

  /** GET /student-model/:studentId/states — filtered knowledge states */
  public static async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const filters = getStatesQuerySchema.parse(req.query);
      const result = await StudentModelService.getKnowledgeStates(studentId, filters);
      res.json({
        success: true,
        data: result.states,
        meta: { total: result.total, page: filters.page, limit: filters.limit },
      });
    } catch (err) {
      next(err);
    }
  }

  /** GET /student-model/:studentId/states/:nodeId — single node state */
  public static async getState(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, nodeId } = req.params;
      const state = await StudentModelService.getKnowledgeState(studentId, nodeId);
      res.json({ success: true, data: state });
    } catch (err) {
      next(err);
    }
  }

  /** POST /student-model/:studentId/evidence — record new evidence (controlled write) */
  public static async recordEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const input = recordEvidenceSchema.parse(req.body);
      const result = await StudentModelService.recordEvidence(studentId, input);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /** POST /student-model/:studentId/recalculate — force state recalculation */
  public static async recalculate(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const input = recalculateSchema.parse(req.body);
      const state = await StudentModelService.recalculateState(studentId, input);
      res.json({ success: true, data: state });
    } catch (err) {
      next(err);
    }
  }

  /** GET /student-model/:studentId/summary — dashboard summary */
  public static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const summary = await StudentModelService.getModelSummary(studentId);
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }

  /** GET /student-model/:studentId/evidence — evidence log history */
  public static async getEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const opts = {
        curriculumNodeId: req.query.curriculumNodeId as string | undefined,
        conceptId: req.query.conceptId as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };
      const logs = await StudentModelService.getEvidenceLogs(studentId, opts);
      res.json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  /** POST /student-model/:studentId/snapshot — create audit snapshot */
  public static async snapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.studentId;
      const reason = (req.body.reason as string) || 'manual';
      await StudentModelService.snapshotModel(studentId, reason);
      res.status(201).json({ success: true, data: { message: 'Snapshot created' } });
    } catch (err) {
      next(err);
    }
  }
}
