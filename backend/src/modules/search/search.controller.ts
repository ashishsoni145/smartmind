import { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';
import { sendSuccess } from '../../lib/api-response';
import { SearchQueryInput } from './search.schema';

export class SearchController {
  public static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as SearchQueryInput;
      const results = await SearchService.search(query);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }
}
