import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { GraphService } from '../modules/knowledge-graph/graph.service';

describe('Academic Knowledge Graph & DAG Traversal Suite', () => {
  const app = createApp();
  let conceptAId: string;
  let conceptBId: string;
  let conceptCId: string;

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
    const res = await request(app).get(`/api/v1/graph/concepts/${conceptCId}/prerequisites`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Concept C depends on B (depth 1) and A (depth 2)
    const prereqIds = res.body.data.map((p: any) => p.conceptId);
    expect(prereqIds).toContain(conceptBId);
  });

  it('Cycle detection: should reject edge that creates a directed cycle (C -> A)', async () => {
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
