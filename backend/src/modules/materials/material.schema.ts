import { z } from 'zod';

export const createMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  sourceType: z.enum([
    'ncert_textbook',
    'syllabus_guide',
    'curated_notes',
    'pyq_solution',
    'student_upload',
    'user_notes',
  ]).default('student_upload'),
  subjectId: z.string().optional(),
  gradeId: z.string().optional(),
  boardId: z.string().optional(),
  curriculumNodeId: z.string().uuid().optional(),
  fileUrl: z.string().url().optional(),
  fileAssetId: z.string().uuid().optional(),
  rawContent: z.string().optional(),
});

export const processMaterialSchema = z.object({
  rawContent: z.string().min(10, 'Content must be at least 10 characters').optional(),
});

export const listMaterialsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  subjectId: z.string().optional(),
  curriculumNodeId: z.string().uuid().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type ProcessMaterialInput = z.infer<typeof processMaterialSchema>;
export type ListMaterialsQueryInput = z.infer<typeof listMaterialsQuerySchema>;
