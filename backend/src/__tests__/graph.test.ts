import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { GraphService } from '../modules/knowledge-graph/graph.service';
import { supabase } from '../db/client';

vi.mock('../db/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('Academic Knowledge Graph & DAG Traversal Suite', () => {
  const app = createApp();
  let conceptAId: string;
  let conceptBId: string;
  let conceptCId: string;

  const conceptsStore = new Map<string, any>();
  const edgesStore: any[] = [];

  beforeEach(() => {
    vi.clearAllMocks();

    (supabase.rpc as any).mockImplementation((method: string, args: any) => {
      if (method === 'get_concept_prerequisites') {
        const { start_concept_id } = args;
        const prereqs = edgesStore
          .filter((e) => e.target_concept_id === start_concept_id && e.relationship_type === 'prerequisite_of')
          .map((e) => {
            const source = conceptsStore.get(e.source_concept_id);
            return {
              concept_id: source?.id || e.source_concept_id,
              concept_code: source?.code || 'CODE',
              concept_title: source?.title || 'TITLE',
              depth: 1,
              path: [start_concept_id, e.source_concept_id],
            };
          });
        return Promise.resolve({ data: prereqs, error: null });
      }
      return Promise.resolve({ data: [], error: null });
    });

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'concepts') {
        return {
          upsert: vi.fn().mockImplementation((payload: any) => {
            const id = payload.id || `conc-${Math.random().toString(36).substring(2, 8)}`;
            const concept = { ...payload, id };
            conceptsStore.set(id, concept);
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: concept, error: null }),
              }),
            };
          }),
          select: vi.fn().mockImplementation(() => {
            const chain: any = {
              eq: vi.fn((_f: string, val: string) => {
                const concept = conceptsStore.get(val);
                return {
                  maybeSingle: vi.fn().mockResolvedValue({ data: concept, error: null }),
                };
              }),
            };
            return chain;
          }),
        };
      }

      if (table === 'knowledge_graph_edges') {
        return {
          upsert: vi.fn().mockImplementation((payload: any) => {
            const id = `edge-${Math.random().toString(36).substring(2, 8)}`;
            const edge = { ...payload, id };
            edgesStore.push(edge);
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: edge, error: null }),
              }),
            };
          }),
          select: vi.fn().mockImplementation(() => {
            const createChain = (currentFiltered: any[]) => {
              const chain: any = {
                eq: vi.fn((field: string, val: string) => {
                  const filtered = currentFiltered.filter((e) => e[field] === val);
                  return createChain(filtered);
                }),
                then: (resolve: any) => resolve({ data: currentFiltered, error: null }),
              };
              return chain;
            };
            return createChain(edgesStore);
          }),
        };
      }

      if (table === 'concept_curriculum_mappings') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        };
      }

      return {};
    });
  });

  it('Should create foundational concepts in the knowledge graph', async () => {
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
    const edge1 = await GraphService.createEdge({
      sourceConceptId: conceptAId,
      targetConceptId: conceptBId,
      relationshipType: 'prerequisite_of',
      weight: 1.0,
      description: 'Vectors resolution is required to understand 2D kinematics',
      metadata: {},
    });

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
    const res = await request(app).get(`/api/v1/graph/concepts/${conceptCId}/prerequisites`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const prereqIds = res.body.data.map((p: any) => p.conceptId);
    expect(prereqIds).toContain(conceptBId);
  });

  it('Cycle detection: should reject edge that creates a directed cycle (C -> A)', async () => {
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
