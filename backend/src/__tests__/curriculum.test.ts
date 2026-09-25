import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { CurriculumService } from '../modules/curriculum/curriculum.service';
import { supabase } from '../db/client';

vi.mock('../db/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Curriculum & Syllabus Engine Suite', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();

    const mockBoards = [
      { id: 'cbse', name: 'Central Board of Secondary Education', code: 'CBSE' },
      { id: 'isc', name: 'Indian School Certificate', code: 'ISC' },
    ];
    const mockGrades = [
      { id: 'class_11', name: 'Class 11', ordering: 1 },
      { id: 'class_12', name: 'Class 12', ordering: 2 },
      { id: 'dropper', name: 'Dropper / Repeater', ordering: 3 },
    ];
    const mockSubjects = [
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'mathematics', name: 'Mathematics' },
    ];
    const mockNodes = [
      {
        id: 'ch_1',
        subject_id: 'physics',
        grade_id: 'class_11',
        board_id: 'cbse',
        node_type: 'chapter',
        code: 'PHY-11-CH01',
        title: 'Units and Measurements',
        sequence_order: 1,
      },
    ];

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'boards') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockBoards, error: null }),
          }),
        };
      }
      if (table === 'grades') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockGrades, error: null }),
          }),
        };
      }
      if (table === 'subjects') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockSubjects, error: null }),
          }),
        };
      }
      if (table === 'curriculum_nodes') {
        const createQueryChain = () => {
          const chain: any = {
            eq: vi.fn(() => chain),
            in: vi.fn(() => chain),
            order: vi.fn(() => chain),
            then: (resolve: any) => resolve({ data: mockNodes, error: null }),
          };
          return chain;
        };

        return {
          select: vi.fn().mockReturnValue(createQueryChain()),
          upsert: vi.fn().mockReturnValue({
            select: vi.fn().mockResolvedValue({ data: mockNodes, error: null }),
          }),
        };
      }
      return {};
    });
  });

  it('GET /api/v1/curriculum/boards should return all supported boards', async () => {
    const res = await request(app).get('/api/v1/curriculum/boards');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const boardCodes = res.body.data.map((b: any) => b.code);
    expect(boardCodes).toContain('CBSE');
    expect(boardCodes).toContain('ISC');
  });

  it('GET /api/v1/curriculum/grades should return sorted academic grades', async () => {
    const res = await request(app).get('/api/v1/curriculum/grades');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  it('GET /api/v1/curriculum/subjects should return foundational STEM subjects', async () => {
    const res = await request(app).get('/api/v1/curriculum/subjects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const subjectIds = res.body.data.map((s: any) => s.id);
    expect(subjectIds).toContain('physics');
    expect(subjectIds).toContain('chemistry');
    expect(subjectIds).toContain('mathematics');
  });

  it('GET /api/v1/curriculum/chapters should filter by subject and grade', async () => {
    const res = await request(app).get('/api/v1/curriculum/chapters?subjectId=physics&gradeId=class_11');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    const firstChapter = res.body.data[0];
    expect(firstChapter.subject_id).toBe('physics');
    expect(firstChapter.grade_id).toBe('class_11');
    expect(firstChapter.node_type).toBe('chapter');
    expect(typeof firstChapter.topicsCount).toBe('number');
  });

  it('Hierarchy validation: should reject a topic without valid parent', async () => {
    await expect(
      CurriculumService.validateHierarchy({
        subjectId: 'physics',
        gradeId: 'class_11',
        boardId: 'cbse',
        nodeType: 'topic',
        code: 'TEST-TOPIC-INVALID',
        title: 'Orphan Topic',
        sequenceOrder: 1,
        weightagePercent: 2.0,
        academicYear: '2024-2026',
        status: 'active',
        learningObjectives: [],
        targetExamIds: [],
      })
    ).rejects.toThrow();
  });

  it('Duplicate detection: should reject import batch with duplicate codes', async () => {
    await expect(
      CurriculumService.importNodes([
        {
          subjectId: 'physics',
          gradeId: 'class_11',
          boardId: 'cbse',
          nodeType: 'chapter',
          code: 'DUP-01',
          title: 'Chapter 1',
          sequenceOrder: 1,
          weightagePercent: 4.0,
          academicYear: '2024-2026',
          status: 'active',
          learningObjectives: [],
          targetExamIds: [],
        },
        {
          subjectId: 'physics',
          gradeId: 'class_11',
          boardId: 'cbse',
          nodeType: 'chapter',
          code: 'DUP-01', // Duplicate code!
          title: 'Chapter 2',
          sequenceOrder: 2,
          weightagePercent: 4.0,
          academicYear: '2024-2026',
          status: 'active',
          learningObjectives: [],
          targetExamIds: [],
        },
      ])
    ).rejects.toThrow('Duplicate curriculum node codes');
  });
});
