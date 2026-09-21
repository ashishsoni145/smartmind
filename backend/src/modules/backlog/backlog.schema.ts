import { z } from 'zod';

export const getBacklogQuerySchema = z.object({
  classification: z.enum([
    'unstarted', 'in_progress', 'weak', 'revision_due', 'overdue', 'at_risk',
  ]).optional(),
  subjectId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type GetBacklogQueryInput = z.infer<typeof getBacklogQuerySchema>;

export const studentIdParamSchema = z.object({
  studentId: z.string().uuid(),
});
