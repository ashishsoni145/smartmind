import { z } from 'zod';

export const getDueRevisionsSchema = z.object({
  subjectId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type GetDueRevisionsInput = z.infer<typeof getDueRevisionsSchema>;

export const createRevisionSessionSchema = z.object({
  revisionType: z.enum([
    'quick_review', 'active_recall', 'flashcard', 'formula_revision',
    'mistake_revision', 'practice_based',
  ]),
  curriculumNodeId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
});

export type CreateRevisionSessionInput = z.infer<typeof createRevisionSessionSchema>;

export const completeRevisionSchema = z.object({
  outcome: z.enum(['recalled', 'partially_recalled', 'forgot']),
  timeSpentSeconds: z.number().int().min(0).default(0),
  questionsAttempted: z.number().int().min(0).default(0),
  questionsCorrect: z.number().int().min(0).default(0),
});

export type CompleteRevisionInput = z.infer<typeof completeRevisionSchema>;
