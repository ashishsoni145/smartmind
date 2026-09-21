import { z } from 'zod';

export const assessmentTypeEnum = z.enum([
  'chapter_test',
  'subject_test',
  'full_syllabus_test',
  'pyq_test',
  'ai_generated_test',
  'mock_exam',
  'custom_test',
  'diagnostic',
  'revision_quiz',
]);

export const listAssessmentsQuerySchema = z.object({
  type: assessmentTypeEnum.optional(),
  subjectId: z.string().optional(),
  targetExamId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const sectionConfigSchema = z.object({
  sectionName: z.string(),
  instructions: z.string().optional(),
  questionIds: z.array(z.string().uuid()).optional(),
  marksCorrect: z.number().default(4.0),
  marksIncorrect: z.number().default(-1.0),
  maxToAttempt: z.number().int().optional(),
});

export const createAssessmentSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: assessmentTypeEnum.default('chapter_test'),
  targetExamId: z.string().optional().nullable(),
  subjectId: z.string().optional().nullable(),
  durationMinutes: z.number().int().min(5).max(360).default(60),
  totalMarks: z.number().default(100),
  passingMarks: z.number().optional().nullable(),
  markingScheme: z
    .object({
      correct: z.number().default(4.0),
      incorrect: z.number().default(-1.0),
      unattempted: z.number().default(0.0),
    })
    .default({ correct: 4.0, incorrect: -1.0, unattempted: 0.0 }),
  difficultyDistribution: z
    .object({
      easy: z.number().default(30),
      medium: z.number().default(50),
      hard: z.number().default(20),
    })
    .default({ easy: 30, medium: 50, hard: 20 }),
  sectionsConfig: z.array(sectionConfigSchema).default([]),
  questionIds: z.array(z.string().uuid()).optional(),
  isAdaptive: z.boolean().default(false),
});

export const autosaveAnswerSchema = z.object({
  questionId: z.string().uuid(),
  selectedOptions: z.array(z.string()).optional(),
  numericalAnswer: z.string().optional().nullable(),
  timeSpentSeconds: z.number().int().min(0).default(0),
  status: z.enum(['answered', 'marked_for_review', 'unanswered', 'visited']).default('answered'),
});

export const submitAssessmentSchema = z.object({
  answers: z.array(autosaveAnswerSchema),
  timeTakenSeconds: z.number().int().min(0),
});

export type ListAssessmentsQueryInput = z.infer<typeof listAssessmentsQuerySchema>;
export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
export type AutosaveAnswerInput = z.infer<typeof autosaveAnswerSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
