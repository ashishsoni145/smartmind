import { GuardrailCheckResult, TutorMode } from '../types';

export class OutputGuardrail {
  /**
   * Evaluates AI model output against grounding, pedagogical standards, and active-learning constraints.
   */
  static evaluate(output: string, mode?: TutorMode): GuardrailCheckResult {
    const trimmed = output.trim();

    // 1. Inappropriate Certainty Suppression
    const excessiveCertaintyPattern = /(?:i am 100% (?:certain|sure|infallible)|there is zero doubt in my absolute authority)/i;
    if (excessiveCertaintyPattern.test(trimmed)) {
      const sanitized = trimmed.replace(
        excessiveCertaintyPattern,
        'Based on established scientific principles'
      );
      return {
        passed: false,
        guardrailName: 'OutputGuardrail:CertaintyCalibration',
        severity: 'medium',
        reason: 'Overconfident or uncalibrated assertion suppressed.',
        sanitizedContent: sanitized,
      };
    }

    // 2. Active Learning Answer Leakage in Socratic / Hint Modes
    if (mode === 'socratic' || mode === 'hint') {
      const directOptionPattern = /(?:(?:the\s+)?(?:correct\s+)?answer\s+is\s+|option\s+)([A-D])\b/i;
      const directResultPattern = /(?:therefore,?\s*(?:the\s+answer|result)\s*(?:is|=|:)\s*)([^\n]+)/i;

      if (directOptionPattern.test(trimmed) || directResultPattern.test(trimmed)) {
        const sanitized = trimmed
          .replace(directOptionPattern, 'What does your analysis suggest about options')
          .replace(directResultPattern, 'Can you verify this conclusion using your formula?');

        return {
          passed: false,
          guardrailName: 'OutputGuardrail:AntiAnswerDumping',
          severity: 'high',
          reason: 'Direct answer leakage in active learning mode.',
          sanitizedContent: sanitized,
        };
      }
    }

    // 3. System Prompt Leakage Defense
    const promptLeakPattern = /(?:my system prompt is|i was instructed to follow these rules:)/i;
    if (promptLeakPattern.test(trimmed)) {
      return {
        passed: false,
        guardrailName: 'OutputGuardrail:PromptLeakage',
        severity: 'critical',
        reason: 'Model output attempted to regurgitate system instructions.',
        sanitizedContent: 'Let us focus on analyzing the problem step-by-step.',
      };
    }

    return {
      passed: true,
      guardrailName: 'OutputGuardrail:AllPassed',
      severity: 'low',
    };
  }
}
