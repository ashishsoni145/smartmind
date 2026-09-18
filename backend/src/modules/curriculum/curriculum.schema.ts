import { z } from 'zod';

export const listChaptersQuerySchema = z.object({
  subjectId: z.string().optional(),
  gradeId: z.string().optional(),
  boardId: z.string().optional(),
  academicYear: z.string().optional(),
});

export const createCurriculumNodeSchema = z.object({
  id: z.string().uuid().optional(),
  subjectId: z.string(),
  gradeId: z.string(),
  boardId: z.string(),
  parentId: z.string().uuid().nullable().optional(),
  nodeType: z.enum(['unit', 'chapter', 'topic', 'subtopic']),
  code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  sequenceOrder: z.number().int().default(1),
  weightagePercent: z.number().optional().default(4.0),
  academicYear: z.string().default('2024-2026'),
  status: z.enum(['draft', 'active', 'archived', 'rationalized_out']).default('active'),
  learningObjectives: z.array(z.string()).default([]),
  targetExamIds: z.array(z.string()).default([]),
});

export const importCurriculumSchema = z.object({
  nodes: z.array(createCurriculumNodeSchema).min(1),
});

export type ListChaptersQueryInput = z.infer<typeof listChaptersQuerySchema>;
export type CreateCurriculumNodeInput = z.infer<typeof createCurriculumNodeSchema>;
export type ImportCurriculumInput = z.infer<typeof importCurriculumSchema>;
