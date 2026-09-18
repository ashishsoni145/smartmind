import { Request, Response, NextFunction } from 'express';
import { GraphService } from './graph.service';
import { sendCreated, sendPaginated, sendSuccess } from '../../lib/api-response';
import { ListConceptsQueryInput } from './graph.schema';

export class GraphController {
  public static async listConcepts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as ListConceptsQueryInput;
      const { concepts, total } = await GraphService.listConcepts(filters);
      sendPaginated(res, concepts, total, filters.page || 1, filters.limit || 50);
    } catch (err) {
      next(err);
    }
  }

  public static async getConceptById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const concept = await GraphService.getConceptById(id);
      sendSuccess(res, concept);
    } catch (err) {
      next(err);
    }
  }

  public static async getPrerequisites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const prereqs = await GraphService.getPrerequisites(id);
      sendSuccess(res, prereqs);
    } catch (err) {
      next(err);
    }
  }

  public static async getRelatedConcepts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const related = await GraphService.getRelatedConcepts(id);
      sendSuccess(res, related);
    } catch (err) {
      next(err);
    }
  }

  public static async getCurriculumNodeConcepts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { curriculumNodeId } = req.params;
      const concepts = await GraphService.getCurriculumNodeConcepts(curriculumNodeId);
      sendSuccess(res, concepts);
    } catch (err) {
      next(err);
    }
  }

  public static async createConcept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const concept = await GraphService.createConcept(req.body);
      sendCreated(res, concept);
    } catch (err) {
      next(err);
    }
  }

  public static async createEdge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const edge = await GraphService.createEdge(req.body);
      sendCreated(res, edge);
    } catch (err) {
      next(err);
    }
  }

  public static async mapConceptToNode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mapping = await GraphService.mapConceptToNode(req.body);
      sendCreated(res, mapping);
    } catch (err) {
      next(err);
    }
  }
}
