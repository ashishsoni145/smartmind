import { z } from 'zod';

export const listConceptsQuerySchema = z.object({
  subjectId: z.string().optional(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  page: z.coerce.number().int().min(1).default(1),
});

export const createConceptSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  learningObjectives: z.array(z.string()).default([]),
  subjectId: z.string(),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).default('medium'),
  misconceptions: z
    .array(
      z.object({
        misconception: z.string(),
        explanation: z.string(),
        remedy: z.string().optional(),
      })
    )
    .default([]),
  metadata: z.record(z.unknown()).default({}),
});

export const createEdgeSchema = z.object({
  sourceConceptId: z.string().uuid(),
  targetConceptId: z.string().uuid(),
  relationshipType: z.enum([
    'prerequisite_of',
    'part_of',
    'related_to',
    'enables',
    'common_misconception_of',
  ]),
  weight: z.number().min(0.1).max(1.0).default(1.0),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).default({}),
});

export const mapConceptToNodeSchema = z.object({
  conceptId: z.string().uuid(),
  curriculumNodeId: z.string().uuid(),
});

export type ListConceptsQueryInput = z.infer<typeof listConceptsQuerySchema>;
export type CreateConceptInput = z.infer<typeof createConceptSchema>;
export type CreateEdgeInput = z.infer<typeof createEdgeSchema>;
export type MapConceptToNodeInput = z.infer<typeof mapConceptToNodeSchema>;
