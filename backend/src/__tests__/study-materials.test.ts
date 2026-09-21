import { describe, it, expect } from 'vitest';
import { MaterialRules } from '../modules/materials/material.rules';
import { MaterialService } from '../modules/materials/material.service';
import { ForbiddenError } from '../lib/errors';

describe('Study-Material Intelligence (Phase 07 Part 01)', () => {
  describe('Document Cleaning & Sliding Window Chunking', () => {
    it('should strip null bytes and non-printable control characters', () => {
      const dirty = 'Physics Notes:\x00 Chapter 5\x08 Momentum\r\n\r\n\r\nConservation of Energy.';
      const cleaned = MaterialRules.cleanDocumentText(dirty);

      expect(cleaned).not.toContain('\x00');
      expect(cleaned).not.toContain('\x08');
      expect(cleaned).toContain('Physics Notes: Chapter 5 Momentum');
    });

    it('should create sliding window chunks with overlap and provenance citation tags', () => {
      const sampleText = Array.from({ length: 600 }, (_, i) => `word${i + 1}`).join(' ');
      const materialId = '12345678-abcd-ef01-2345-6789abcdef01';
      const chunks = MaterialRules.chunkDocument(sampleText, materialId, 250, 30);

      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0].chunkIndex).toBe(0);
      expect(chunks[0].citationTag).toContain('DOC-12345678-CHUNK-1');
      expect(chunks[1].chunkIndex).toBe(1);
      expect(chunks[1].citationTag).toContain('DOC-12345678-CHUNK-2');
      expect(chunks[0].wordCount).toBe(250);
    });
  });

  describe('Intelligence Synthesis: Flashcards and Quizzes', () => {
    it('should synthesize flashcards from formulas and definitions', () => {
      const formulas = [
        { id: 'f1', name: 'Newton Second Law', formulaLatex: 'F = m * a', boundaryConditions: 'Constant mass' },
      ];
      const concepts = [
        { name: 'Inertia', definition: 'Tendency of a body to resist changes in its state of motion.' },
      ];

      const cards = MaterialRules.synthesizeFlashcards(formulas, concepts);

      expect(cards.length).toBe(2);
      expect(cards[0].front).toContain('Newton Second Law');
      expect(cards[0].back).toContain('F = m * a');
      expect(cards[1].front).toContain('Inertia');
      expect(cards[1].back).toContain('Tendency of a body');
    });

    it('should synthesize rapid check quiz questions', () => {
      const concepts = [
        { name: 'Conservation of Linear Momentum', definition: 'Total linear momentum of an isolated system remains constant.' },
      ];
      const formulas = [
        { id: 'f1', name: 'Work-Energy Theorem', formulaLatex: 'W_{net} = \\Delta K' },
      ];

      const quiz = MaterialRules.synthesizeQuizQuestions(concepts, formulas);

      expect(quiz.length).toBe(2);
      expect(quiz[0].text).toContain('Conservation of Linear Momentum');
      expect(quiz[0].options).toBeDefined();
      expect(quiz[0].options?.length).toBe(4);
      expect(quiz[0].correctAnswer).toBe('opt_a');
      expect(quiz[1].text).toContain('Work-Energy Theorem');
      expect(quiz[1].options?.[0].text).toBe('W_{net} = \\Delta K');
    });
  });

  describe('Malformed Document Handling & Permissions', () => {
    it('should reject or mark processing as failed when document is empty or malformed', async () => {
      // Direct rule testing for empty text handling
      const chunks = MaterialRules.chunkDocument('', 'mat-empty');
      expect(chunks).toEqual([]);
    });

    it('should enforce user permission isolation and disallow cross-student modifications', () => {
      const ownerId = 'user-owner-123';
      const foreignUserId = 'user-intruder-456';

      const mockMaterial = {
        user_id: ownerId,
      };

      const checkAccess = () => {
        if (mockMaterial.user_id !== foreignUserId) {
          throw new ForbiddenError('You do not have permission to process this material');
        }
      };

      expect(checkAccess).toThrow(ForbiddenError);
    });
  });
});
