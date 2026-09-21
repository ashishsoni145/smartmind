import { describe, it, expect } from 'vitest';
import { TutorRules } from '../modules/tutor/tutor.rules';
import { getTutorPrompt } from '../modules/tutor/tutor.prompts';
import { TutorMode } from '@smartmind/types';

describe('Socratic AI Tutor Engine (Phase 06 Part 03)', () => {
  describe('Active Learning & Guardrail Rules', () => {
    it('should detect and sanitize direct answer leakage in Socratic mode', () => {
      const leakedResponse = 'Great question! The correct answer is B because gravity acts downwards.';
      const check = TutorRules.checkActiveLearning('socratic', leakedResponse);

      expect(check.isCompliant).toBe(false);
      expect(check.violationType).toBe('direct_answer_leak');
      expect(check.sanitizedText).toBeDefined();
      expect(check.sanitizedText).not.toContain('The correct answer is B');
      expect(check.sanitizedText).toContain('What does your analysis tell you');
    });

    it('should detect direct solution dump and prompt student verification', () => {
      const solutionDump = 'Therefore the answer is 45 m/s after integration.';
      const check = TutorRules.checkActiveLearning('hint', solutionDump);

      expect(check.isCompliant).toBe(false);
      expect(check.sanitizedText).toContain('Can you verify this conclusion using your formula?');
    });

    it('should pass pedagogical inquiry responses in Socratic mode without modification', () => {
      const goodResponse = 'What principle from kinematics connects acceleration with distance covered?';
      const check = TutorRules.checkActiveLearning('socratic', goodResponse);

      expect(check.isCompliant).toBe(true);
      expect(check.sanitizedText).toBeUndefined();
    });

    it('should allow full explanations when in teach or revision mode', () => {
      const explanation = 'The correct answer is B because energy is conserved in an elastic collision.';
      const checkTeach = TutorRules.checkActiveLearning('teach', explanation);
      const checkRevision = TutorRules.checkActiveLearning('revision', explanation);

      expect(checkTeach.isCompliant).toBe(true);
      expect(checkRevision.isCompliant).toBe(true);
    });

    it('should calculate progressive hint tiers correctly', () => {
      expect(TutorRules.determineHintTier(0)).toBe(1);
      expect(TutorRules.determineHintTier(1)).toBe(2);
      expect(TutorRules.determineHintTier(2)).toBe(3);
      expect(TutorRules.determineHintTier(5)).toBe(3);
    });
  });

  describe('Tutor Prompt Synthesis for All 10 Modes', () => {
    const modes: TutorMode[] = [
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
    ];

    it.each(modes)('should generate specialized system prompt for mode "%s"', (mode) => {
      const prompt = getTutorPrompt(mode, '### Context Slice: NCERT Mechanics');

      expect(prompt).toContain('SmartMind AI Tutor');
      expect(prompt.toUpperCase()).toContain(mode.replace('_', ' ').toUpperCase());
      expect(prompt).toContain('NCERT Mechanics');
    });
  });
});
