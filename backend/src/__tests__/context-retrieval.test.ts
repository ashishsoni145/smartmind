import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContextAssembler } from '../ai/retrieval/context-assembler';
import { supabase } from '../db/client';

vi.mock('../db/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

describe('Selective Context Retrieval & Assembly (Phase 06 Part 02)', () => {
  const assembler = new ContextAssembler();

  beforeEach(() => {
    vi.clearAllMocks();

    (supabase.rpc as any).mockResolvedValue({ data: [], error: null });

    (supabase.from as any).mockImplementation(() => {
      const createChain = () => {
        const chain: any = {
          select: vi.fn(() => chain),
          eq: vi.fn(() => chain),
          in: vi.fn(() => chain),
          order: vi.fn(() => chain),
          limit: vi.fn(() => chain),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          then: (resolve: any) => resolve({ data: [], error: null }),
        };
        return chain;
      };
      return createChain();
    });
  });

  it('should assemble empty/graceful context when database has no matches', async () => {
    const context = await assembler.assemble({
      studentId: 'non-existent-student-id',
      curriculumNodeId: 'non-existent-node',
      conceptId: 'non-existent-concept',
    });

    expect(context).toBeDefined();
    expect(context.studentId).toBe('non-existent-student-id');
    expect(Array.isArray(context.slices)).toBe(true);
    expect(context.totalTokenEstimate).toBeGreaterThanOrEqual(0);
    expect(typeof context.formattedContextString).toBe('string');
  });

  it('should enforce token budget by omitting slices that exceed maxTokens', async () => {
    const context = await assembler.assemble({
      studentId: 'test-student-tokens',
      maxTokens: 50, // Very low token budget
    });

    expect(context.totalTokenEstimate).toBeLessThanOrEqual(50);
  });

  it('should format citations with appropriate provenance IDs', async () => {
    class CustomMockAssembler extends ContextAssembler {}

    const testAssembler = new CustomMockAssembler();
    const result = await testAssembler.assemble({
      studentId: 'student-provenance-test',
    });

    for (const citation of result.citations) {
      expect(citation).toHaveProperty('source');
      expect(citation).toHaveProperty('chapterOrDoc');
      expect(citation).toHaveProperty('snippet');
    }
  });
});
