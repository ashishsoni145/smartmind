import { z } from 'zod';

export const saveDraftSchema = z.object({
  step: z.number().int().min(1).max(10),
  draftData: z.record(z.unknown()),
});

export const completeOnboardingSchema = z.object({
  boardId: z.string().min(1, 'Board is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  academicYear: z.string().optional(),
  enrolledSubjects: z.array(z.string()).min(1, 'At least one subject is required'),
  targetExamGoals: z
    .array(
      z.object({
        examId: z.string(),
        targetYear: z.number().int(),
        targetScoreOrRank: z.string().optional(),
      })
    )
    .default([]),
  currentPreparationLevel: z
    .enum(['beginner', 'moderate', 'advanced', 'exam_revision'])
    .default('beginner'),
  selfAssessedStrengths: z.array(z.string()).default([]),
  selfAssessedFocusAreas: z.array(z.string()).default([]),
  dailyAvailableHours: z.number().min(0.5).max(16).default(3.0),
  preferredStudyTime: z
    .enum(['early_morning', 'morning', 'afternoon', 'evening', 'night'])
    .default('evening'),
  learningStylePreference: z
    .enum(['problem_solving_first', 'theory_first', 'visual_diagrams', 'socratic_tutor'])
    .default('problem_solving_first'),
  reminderPreferences: z
    .object({
      email: z.boolean().optional(),
      dailyGoalPrompt: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
      studyReminders: z.boolean().optional(),
    })
    .default({ email: true, dailyGoalPrompt: true }),
});

export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
