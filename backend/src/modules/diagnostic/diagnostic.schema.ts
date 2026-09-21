import { z } from 'zod';

export const createDiagnosticSchema = z.object({
  subjectIds: z.array(z.string()).optional(),
});

export type CreateDiagnosticInput = z.infer<typeof createDiagnosticSchema>;

export const submitDiagnosticSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    selectedOptions: z.array(z.string()).optional(),
    numericalAnswer: z.string().optional(),
    timeTakenSeconds: z.number().int().min(0).optional(),
    confidenceSelfReport: z.number().int().min(1).max(5).optional(),
  })),
});

export type SubmitDiagnosticInput = z.infer<typeof submitDiagnosticSchema>;

export const sessionIdParamSchema = z.object({
  sessionId: z.string().uuid(),
});
