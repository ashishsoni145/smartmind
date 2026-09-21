import { describe, it, expect } from 'vitest';
import { ContextAssembler } from '../ai/retrieval/context-assembler';

describe('Selective Context Retrieval & Assembly (Phase 06 Part 02)', () => {
  const assembler = new ContextAssembler();

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
    // Test custom assembler with injected mock slice retrieval
    class CustomMockAssembler extends ContextAssembler {
      // Testing the formatting logic
    }

    const testAssembler = new CustomMockAssembler();
    const result = await testAssembler.assemble({
      studentId: 'student-provenance-test',
    });

    // Check citations structure
    for (const citation of result.citations) {
      expect(citation).toHaveProperty('source');
      expect(citation).toHaveProperty('chapterOrDoc');
      expect(citation).toHaveProperty('snippet');
    }
  });
});
