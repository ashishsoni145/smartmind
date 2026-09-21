import { z } from 'zod';

export const getDebriefQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export const getWeeklyReviewQuerySchema = z.object({
  weekStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export type GetDebriefQueryInput = z.infer<typeof getDebriefQuerySchema>;
export type GetWeeklyReviewQueryInput = z.infer<typeof getWeeklyReviewQuerySchema>;
