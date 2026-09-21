// =============================================================================
// Exam Readiness Schemas
// =============================================================================

import { z } from 'zod';

export const getReadinessQuerySchema = z.object({
  targetExamId: z.string().optional(),
  recalculate: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export const simulateReadinessSchema = z.object({
  targetExamId: z.string().optional(),
  daysRemaining: z.number().min(1).max(730).default(90),
  dailyStudyHours: z.number().min(0.5).max(16).default(4.0),
  targetMocksCount: z.number().min(0).max(50).default(8),
  revisionAdherencePercent: z.number().min(0).max(100).default(85),
});

export type GetReadinessQueryInput = z.infer<typeof getReadinessQuerySchema>;
export type SimulateReadinessInput = z.infer<typeof simulateReadinessSchema>;
