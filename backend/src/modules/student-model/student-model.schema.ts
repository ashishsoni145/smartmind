import { z } from 'zod';

export const recordEvidenceSchema = z.object({
  curriculumNodeId: z.string().uuid().optional().nullable(),
  conceptId: z.string().uuid().optional().nullable(),
  evidenceType: z.enum([
    'diagnostic_test', 'practice_question', 'assessment_submission',
    'tutor_interaction', 'self_assessment', 'revision_drill',
    'revision_recall', 'revision_practice', 'mistake_retry',
    'flashcard_review', 'formula_review',
  ]),
  sourceRefId: z.string().optional().nullable(),
  questionId: z.string().uuid().optional().nullable(),
  scoreOrPerformance: z.number().min(0).max(100).optional().nullable(),
  isCorrect: z.boolean().optional().nullable(),
  timeTakenSeconds: z.number().int().min(0).optional().nullable(),
  confidenceSelfReport: z.number().int().min(1).max(5).optional().nullable(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard', 'olympiad']).optional().nullable(),
  sessionType: z.string().optional().nullable(),
  provenanceSource: z.string().optional().default('system'),
  payload: z.record(z.unknown()).optional().default({}),
});

export type RecordEvidenceInput = z.infer<typeof recordEvidenceSchema>;

export const getStatesQuerySchema = z.object({
  subjectId: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'needs_revision', 'mastered']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type GetStatesQueryInput = z.infer<typeof getStatesQuerySchema>;

export const studentIdParamSchema = z.object({
  studentId: z.string().uuid(),
});

export const nodeIdParamSchema = z.object({
  studentId: z.string().uuid(),
  nodeId: z.string().uuid(),
});

export const recalculateSchema = z.object({
  nodeId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
}).refine((data) => data.nodeId || data.conceptId, {
  message: 'Either nodeId or conceptId is required',
});

export type RecalculateInput = z.infer<typeof recalculateSchema>;
