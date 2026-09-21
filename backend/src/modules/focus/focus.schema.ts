import { z } from 'zod';

export const startSessionSchema = z.object({
  objective: z.string().min(3, 'Objective must be at least 3 characters').max(200),
  targetDurationMinutes: z.coerce.number().int().min(5).max(180).default(25),
  subjectId: z.string().optional(),
  curriculumNodeId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
});

export const logInterruptionSchema = z.object({
  reason: z.string().max(200).optional().default('Unplanned distraction'),
  durationSeconds: z.coerce.number().int().min(0).max(3600).default(60),
});

export const completeSessionSchema = z.object({
  actualDurationSeconds: z.coerce.number().int().min(0),
  reflection: z.object({
    productivityScore: z.number().int().min(1).max(5).default(4),
    notes: z.string().max(1000).optional(),
    completedObjective: z.boolean().default(true),
    keyLearnings: z.string().max(1000).optional(),
  }).optional().default({ productivityScore: 4, completedObjective: true }),
});

export const listSessionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(['active', 'paused', 'completed', 'abandoned']).optional(),
  subjectId: z.string().optional(),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
export type LogInterruptionInput = z.infer<typeof logInterruptionSchema>;
export type CompleteSessionInput = z.infer<typeof completeSessionSchema>;
export type ListSessionsQueryInput = z.infer<typeof listSessionsQuerySchema>;
