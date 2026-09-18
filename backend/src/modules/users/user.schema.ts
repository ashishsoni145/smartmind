import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const updateStudentProfileSchema = z.object({
  boardId: z.string().nullable().optional(),
  gradeId: z.string().nullable().optional(),
  academicYear: z.string().nullable().optional(),
  enrolledSubjects: z.array(z.string()).optional(),
  targetExamGoals: z
    .array(
      z.object({
        examId: z.string(),
        targetYear: z.number().int(),
        targetScoreOrRank: z.string().optional(),
      })
    )
    .optional(),
  currentPreparationLevel: z
    .enum(['beginner', 'moderate', 'advanced', 'exam_revision'])
    .optional(),
  selfAssessedStrengths: z.array(z.string()).optional(),
  selfAssessedFocusAreas: z.array(z.string()).optional(),
  dailyAvailableHours: z.number().min(0.5).max(16).optional(),
  preferredStudyTime: z
    .enum(['early_morning', 'morning', 'afternoon', 'evening', 'night'])
    .optional(),
  learningStylePreference: z
    .enum(['problem_solving_first', 'theory_first', 'visual_diagrams', 'socratic_tutor'])
    .optional(),
  reminderPreferences: z
    .object({
      email: z.boolean().optional(),
      dailyGoalPrompt: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
      studyReminders: z.boolean().optional(),
    })
    .optional(),
  nextAction: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>;
