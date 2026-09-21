import { z } from 'zod';

export const plannerDateSchema = z.object({
  date: z.string().optional(), // ISO date YYYY-MM-DD
});

export const replanSchema = z.object({
  fromDate: z.string().optional(), // ISO date
});

export const updateTaskSchema = z.object({
  status: z.enum(['completed', 'skipped', 'in_progress']),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
