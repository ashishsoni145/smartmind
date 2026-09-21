// =============================================================================
// Mistake Validation Schemas
// =============================================================================

import { z } from 'zod';

export const listMistakesQuerySchema = z.object({
  studentId: z.string().uuid().optional(),
  rootCause: z
    .enum([
      'conceptual',
      'formula',
      'calculation',
      'misreading',
      'memory',
      'application',
      'method',
      'time_pressure',
      'silly',
      'guessing',
    ])
    .optional(),
  isResolved: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  overdueOnly: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  subjectId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

export const updateMistakeSchema = z.object({
  rootCause: z
    .enum([
      'conceptual',
      'formula',
      'calculation',
      'misreading',
      'memory',
      'application',
      'method',
      'time_pressure',
      'silly',
      'guessing',
    ])
    .optional(),
  notes: z.string().max(2000).optional(),
  isResolved: z.boolean().optional(),
});

export const retryMistakeSchema = z.object({
  selectedOptions: z.array(z.string()).optional(),
  numericalAnswer: z.string().optional(),
  timeSpentSeconds: z.number().min(0).default(30),
});

export type ListMistakesQueryInput = z.infer<typeof listMistakesQuerySchema>;
export type UpdateMistakeInput = z.infer<typeof updateMistakeSchema>;
export type RetryMistakeInput = z.infer<typeof retryMistakeSchema>;
