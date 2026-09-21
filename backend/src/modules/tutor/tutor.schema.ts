import { z } from 'zod';

export const TUTOR_MODES = [
  'teach',
  'socratic',
  'hint',
  'practice',
  'quiz',
  'check_solution',
  'explain_mistake',
  'revision',
  'viva',
  'exam',
] as const;

export const createSessionSchema = z.object({
  title: z.string().min(1).max(120).optional().default('New Study Session'),
  mode: z.enum(TUTOR_MODES).default('socratic'),
  subjectId: z.string().uuid().optional(),
  topicId: z.string().optional(),
  curriculumNodeId: z.string().uuid().optional(),
  contextMeta: z.record(z.any()).optional().default({}),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(5000),
  imageUrl: z.string().optional(),
  mode: z.enum(TUTOR_MODES).optional(),
});

export const listSessionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ListSessionsQueryInput = z.infer<typeof listSessionsQuerySchema>;
