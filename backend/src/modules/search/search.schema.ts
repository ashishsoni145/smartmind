import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  scope: z.enum(['all', 'curriculum', 'questions', 'materials']).default('all'),
  subjectId: z.string().optional(),
  gradeId: z.string().optional(),
  boardId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
