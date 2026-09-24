import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { GraphService } from '../modules/knowledge-graph/graph.service';
import { supabase } from '../db/client';

describe('Academic Knowledge Graph & DAG Traversal Suite', () => {
  const app = createApp();
  let conceptAId = 'concept-a-123';
  let conceptBId = 'concept-b-456';
  let conceptCId = 'concept-c-789';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Should create foundational concepts in the knowledge graph', async () => {
    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'concepts') {
        const chain: any = {
          upsert: vi.fn(() => chain),
          select: vi.fn(() => chain),
          single: vi.fn().mockImplementation(async () => ({
            data: { id: `mock-concept-${Date.now()}-${Math.random()}` },
            error: null,
          })),
        };
        return chain;
      }
      return {} as any;
    });

    const conceptA = await GraphService.createConcept({
      code: `TEST-CONC-VEC-${Date.now()}`,
      title: 'Vector Resolution & Trigonometry',
      summary: 'Orthogonal decomposition of vectors into components along cartesian axes.',
      learningObjectives: ['Resolve vectors into x and y components', 'Calculate magnitude and direction angle'],
      subjectId: 'physics',
      difficultyLevel: 'easy',
      misconceptions: [
        {
          misconception: 'Confusing sine and cosine components',
          explanation: 'Component adjacent to angle theta is always A cos(theta).',
        },
      ],
      metadata: {},
    });

    const conceptB = await GraphService.createConcept({
      code: `TEST-CONC-PROJ-${Date.now()}`,
      title: '2D Projectile Trajectory Dynamics',
      summary: 'Parabolic motion resulting from independent orthogonal 1D motions.',
      learningObjectives: ['Derive trajectory parabola', 'Calculate time of flight and range'],
      subjectId: 'physics',
      difficultyLevel: 'medium',
      misconceptions: [
        {
          misconception: 'Horizontal velocity changes during flight',
          explanation: 'Horizontal acceleration is zero when air drag is neglected; vx is constant.',
        },
      ],
      metadata: {},
    });

    const conceptC = await GraphService.createConcept({
      code: `TEST-CONC-ADV-${Date.now()}`,
      title: 'Projectile Motion on an Inclined Plane',
      summary: 'Advanced kinematics along tilted axes.',
      learningObjectives: ['Projectiles up and down an inclined plane'],
      subjectId: 'physics',
      difficultyLevel: 'hard',
      misconceptions: [],
      metadata: {},
    });

    expect(conceptA.id).toBeDefined();
    expect(conceptB.id).toBeDefined();
    expect(conceptC.id).toBeDefined();

    conceptAId = conceptA.id;
    conceptBId = conceptB.id;
    conceptCId = conceptC.id;
  });

  it('Should establish a directed prerequisite edge in the DAG (A -> B and B -> C)', async () => {
    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'knowledge_graph_edges') {
        const chain: any = {
          select: vi.fn(() => chain),
          eq: vi.fn(() => chain),
          upsert: vi.fn(() => chain),
          single: vi.fn().mockImplementation(async () => ({
            data: { id: `mock-edge-${Date.now()}-${Math.random()}` },
            error: null,
          })),
          then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve),
        };
        return chain;
      }
      return {} as any;
    });

    // A (Vectors) is prerequisite of B (Projectile)
    const edge1 = await GraphService.createEdge({
      sourceConceptId: conceptAId,
      targetConceptId: conceptBId,
      relationshipType: 'prerequisite_of',
      weight: 1.0,
      description: 'Vectors resolution is required to understand 2D kinematics',
      metadata: {},
    });

    // B (Projectile) is prerequisite of C (Inclined Projectile)
    const edge2 = await GraphService.createEdge({
      sourceConceptId: conceptBId,
      targetConceptId: conceptCId,
      relationshipType: 'prerequisite_of',
      weight: 1.0,
      description: 'Standard projectile motion is required for inclined projectile',
      metadata: {},
    });

    expect(edge1.id).toBeDefined();
    expect(edge2.id).toBeDefined();
  });

  it('Should retrieve recursive prerequisite chain via API', async () => {
    vi.spyOn(supabase, 'rpc').mockResolvedValue({
      data: [
        {
          concept_id: conceptBId,
          concept_code: 'TEST-CONC-PROJ',
          concept_title: '2D Projectile Trajectory Dynamics',
          depth: 1,
          path: [conceptCId, conceptBId],
        },
        {
          concept_id: conceptAId,
          concept_code: 'TEST-CONC-VEC',
          concept_title: 'Vector Resolution & Trigonometry',
          depth: 2,
          path: [conceptCId, conceptBId, conceptAId],
        },
      ],
      error: null,
    } as any);

    const res = await request(app).get(`/api/v1/graph/concepts/${conceptCId}/prerequisites`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Concept C depends on B (depth 1) and A (depth 2)
    const prereqIds = res.body.data.map((p: any) => p.conceptId);
    expect(prereqIds).toContain(conceptBId);
  });

  it('Cycle detection: should reject edge that creates a directed cycle (C -> A)', async () => {
    // hasPrerequisiteCycle(target: conceptAId, source: conceptCId):
    // starts at queue=[conceptAId], queue.shift() -> conceptAId.
    // matches current === conceptCId if dependents of conceptAId returns conceptCId.
    vi.spyOn(supabase, 'from').mockImplementation((table: string) => {
      if (table === 'knowledge_graph_edges') {
        const chain: any = {
          select: vi.fn(() => chain),
          eq: vi.fn().mockImplementation((_col: string, val: string) => {
            if (val === conceptAId) {
              return {
                eq: vi.fn().mockResolvedValue({
                  data: [{ target_concept_id: conceptCId }],
                }),
              };
            }
            return {
              eq: vi.fn().mockResolvedValue({ data: [] }),
            };
          }),
        };
        return chain;
      }
      return {} as any;
    });

    // Attempting to make C prerequisite of A creates a cycle A -> B -> C -> A
    await expect(
      GraphService.createEdge({
        sourceConceptId: conceptCId,
        targetConceptId: conceptAId,
        relationshipType: 'prerequisite_of',
        weight: 1.0,
        metadata: {},
      })
    ).rejects.toThrow('Cycle detected');
  });

  it('Self-referential check: should reject self edge (A -> A)', async () => {
    await expect(
      GraphService.createEdge({
        sourceConceptId: conceptAId,
        targetConceptId: conceptAId,
        relationshipType: 'related_to',
        weight: 1.0,
        metadata: {},
      })
    ).rejects.toThrow('Self-referential edges are disallowed');
  });
});
