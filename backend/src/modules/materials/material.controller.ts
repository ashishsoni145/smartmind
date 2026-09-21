import { Request, Response, NextFunction } from 'express';
import { MaterialService } from './material.service';
import {
  createMaterialSchema,
  processMaterialSchema,
  listMaterialsQuerySchema,
} from './material.schema';
import { UnauthorizedError } from '../../lib/errors';

export class MaterialController {
  private static getUserId(req: Request): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('User authentication required');
    }
    return userId;
  }

  /**
   * POST /materials — Register study material (with optional instant text processing)
   */
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = MaterialController.getUserId(req);
      const input = createMaterialSchema.parse(req.body);
      const material = await MaterialService.createMaterial(userId, input);
      res.status(201).json({ success: true, data: material });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /materials/:materialId/process — Process text/OCR content
   */
  public static async process(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = MaterialController.getUserId(req);
      const input = processMaterialSchema.parse(req.body);
      const material = await MaterialService.processMaterial(
        req.params.materialId,
        userId,
        input.rawContent
      );
      res.json({ success: true, data: material });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /materials/:materialId — Get study material by ID
   */
  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = MaterialController.getUserId(req);
      const material = await MaterialService.getMaterial(req.params.materialId, userId);
      res.json({ success: true, data: material });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /materials — List study materials
   */
  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = MaterialController.getUserId(req);
      const query = listMaterialsQuerySchema.parse(req.query);
      const result = await MaterialService.listMaterials(userId, query);
      res.json({ success: true, data: result.materials, total: result.total });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /materials/:materialId — Delete study material
   */
  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = MaterialController.getUserId(req);
      await MaterialService.deleteMaterial(req.params.materialId, userId);
      res.json({ success: true, message: 'Material deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
