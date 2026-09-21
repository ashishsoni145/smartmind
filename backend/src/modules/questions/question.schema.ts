import { z } from 'zod';

export const questionTypeEnum = z.enum([
  'single_choice',
  'multiple_choice',
  'numerical',
  'assertion_reason',
  'short_answer',
  'long_answer',
  'case_based',
  'competency_based',
  'conceptual',
  'application',
  'hots',
  'derivation_proof',
  'diagram_based',
  'mixed',
]);

export const pedagogicalTypeEnum = z.enum([
  'conceptual',
  'application',
  'hots',
  'derivation_proof',
  'case_based',
  'competency_based',
  'diagram_based',
  'mixed',
]);

export const listQuestionsQuerySchema = z.object({
  subjectId: z.string().optional(),
  curriculumNodeId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
  targetExamId: z.string().optional(),
  year: z.coerce.number().int().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard', 'olympiad']).optional(),
  questionType: questionTypeEnum.optional(),
  pedagogicalType: pedagogicalTypeEnum.optional(),
  isPyq: z.preprocess((val) => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
  isImportant: z.preprocess((val) => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
  isGenerated: z.preprocess((val) => (val === 'true' ? true : val === 'false' ? false : val), z.boolean().optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const questionOptionSchema = z.object({
  optionKey: z.string(),
  optionText: z.string(),
  isCorrect: z.boolean(),
});

export const solutionStepSchema = z.object({
  stepNumber: z.number().int(),
  title: z.string(),
  description: z.string(),
  mathLatex: z.string().optional(),
});

export const generationProvenanceSchema = z.object({
  generatorModel: z.string(),
  promptTemplate: z.string(),
  temperature: z.number(),
  baseConceptId: z.string().uuid().optional(),
  generatedAt: z.string(),
  isAudited: z.boolean().default(false),
});

export const createQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  subjectId: z.string(),
  curriculumNodeId: z.string().uuid().nullable().optional(),
  conceptId: z.string().uuid().nullable().optional(),
  targetExamId: z.string().nullable().optional(),
  questionText: z.string().min(1),
  questionType: questionTypeEnum.default('single_choice'),
  pedagogicalType: pedagogicalTypeEnum.default('conceptual'),
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
  isGenerated: z.boolean().default(false),
  generationProvenance: generationProvenanceSchema.optional(),
  diagramUrl: z.string().url().optional().nullable(),
  solutionSteps: z.array(solutionStepSchema).default([]),
  appearanceFrequency: z.number().int().default(1),
  patternTags: z.array(z.string()).default([]),
  options: z.array(questionOptionSchema).optional(),
});

export const ingestQuestionsSchema = z.object({
  questions: z.array(createQuestionSchema).min(1),
});

export const adaptiveSelectionQuerySchema = z.object({
  subjectId: z.string(),
  curriculumNodeId: z.string().uuid().optional(),
  conceptId: z.string().uuid().optional(),
  targetExamId: z.string().optional(),
  count: z.coerce.number().int().min(1).max(50).default(10),
});

export const validateAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOptions: z.array(z.string()).optional(),
  numericalAnswer: z.string().optional().nullable(),
  textAnswer: z.string().optional().nullable(),
});

export type ListQuestionsQueryInput = z.infer<typeof listQuestionsQuerySchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type IngestQuestionsInput = z.infer<typeof ingestQuestionsSchema>;
export type AdaptiveSelectionQueryInput = z.infer<typeof adaptiveSelectionQuerySchema>;
export type ValidateAnswerInput = z.infer<typeof validateAnswerSchema>;
