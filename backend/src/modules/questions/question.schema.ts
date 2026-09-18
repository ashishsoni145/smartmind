import { z } from 'zod';

export const listQuestionsQuerySchema = z.object({
  subjectId: z.string().optional(),
  curriculumNodeId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
  targetExamId: z.string().optional(),
  year: z.coerce.number().int().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard', 'olympiad']).optional(),
  isPyq: z.preprocess((val) => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
  isImportant: z.preprocess((val) => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const questionOptionSchema = z.object({
  optionKey: z.string(),
  optionText: z.string(),
  isCorrect: z.boolean(),
});

export const createQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  subjectId: z.string(),
  curriculumNodeId: z.string().uuid().nullable().optional(),
  conceptId: z.string().uuid().nullable().optional(),
  targetExamId: z.string().nullable().optional(),
  questionText: z.string().min(1),
  questionType: z
    .enum(['single_choice', 'multiple_choice', 'numerical', 'assertion_reason'])
    .default('single_choice'),
  difficultyLevel: z.enum(['easy', 'medium', 'hard', 'olympiad']).default('medium'),
  marks: z.number().default(4.0),
  explanation: z.string().optional().default(''),
  hint: z.string().optional().default(''),
  sourceExam: z.string().optional(),
  sourceYear: z.number().int().optional(),
  sourceSession: z.string().optional(),
  sourcePaperCode: z.string().optional(),
  isPyq: z.boolean().default(false),
  isImportant: z.boolean().default(false),
  appearanceFrequency: z.number().int().default(1),
  patternTags: z.array(z.string()).default([]),
  options: z.array(questionOptionSchema).optional(),
});

export const ingestQuestionsSchema = z.object({
  questions: z.array(createQuestionSchema).min(1),
});

export type ListQuestionsQueryInput = z.infer<typeof listQuestionsQuerySchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type IngestQuestionsInput = z.infer<typeof ingestQuestionsSchema>;
