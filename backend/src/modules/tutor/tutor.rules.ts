import { TutorMode } from '@sharpmind/types';

export interface PedagogicalCheck {
  isCompliant: boolean;
  violationType?: 'direct_answer_leak' | 'too_brief' | 'passive_instruction';
  sanitizedText?: string;
  reason?: string;
}

export class TutorRules {
  /**
   * Enforces that in Socratic and Hint modes, the tutor does not give away
   * the direct answer or option letter on the first engagement.
   */
  static checkActiveLearning(mode: TutorMode, text: string): PedagogicalCheck {
    if (mode !== 'socratic' && mode !== 'hint') {
      return { isCompliant: true };
    }

    // Patterns matching premature answer dumps
    const directOptionPattern = /(?:the\s+(?:correct\s+)?answer\s+is\s+|option\s+)([A-D])\b/i;
    const directSolutionPattern = /(?:therefore,?\s*(?:the\s+answer|result)\s*(?:is|=|:)\s*)([^\n]+)/i;

    if (directOptionPattern.test(text) || directSolutionPattern.test(text)) {
      // Sanitize: replace the direct leak with an active discovery question
      const sanitized = text
        .replace(directOptionPattern, 'What does your analysis tell you about options')
        .replace(directSolutionPattern, 'Can you verify this conclusion using your formula?');

      return {
        isCompliant: false,
        violationType: 'direct_answer_leak',
        sanitizedText: sanitized,
        reason: 'Socratic mode detected direct answer leakage. Sanitized to maintain inquiry-based learning.',
      };
    }

    return { isCompliant: true };
  }

  /**
   * Determine hint tier from student interaction history
   */
  static determineHintTier(previousHintsGiven: number): 1 | 2 | 3 {
    if (previousHintsGiven <= 0) return 1;
    if (previousHintsGiven === 1) return 2;
    return 3;
  }
}
