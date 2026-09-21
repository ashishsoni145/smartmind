import { GuardrailCheckResult } from '../types';

export class InputGuardrail {
  private static readonly INJECTION_PATTERNS: Array<{ pattern: RegExp; severity: 'high' | 'critical'; reason: string }> = [
    {
      pattern: /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|rules|commands)/i,
      severity: 'critical',
      reason: 'Instruction override attempt detected.',
    },
    {
      pattern: /(?:reveal|show|print|display|dump)\s+(?:your\s+)?(?:system\s+prompt|initial\s+prompt|developer\s+instructions)/i,
      severity: 'critical',
      reason: 'System prompt extraction attempt detected.',
    },
    {
      pattern: /you\s+are\s+now\s+(?:dan|unfiltered|jailbroken|developer\s+mode)/i,
      severity: 'critical',
      reason: 'Roleplay jailbreak attempt detected.',
    },
    {
      pattern: /(?:extract|show|give|dump|leak|print|find).*?(?:other\s+student|another\s+user|all\s+user|any\s+other\s+user).*?(?:data|answer|score|password|token)/i,
      severity: 'critical',
      reason: 'Cross-tenant student data access attempt detected.',
    },
    {
      pattern: /(?:drop\s+table|select\s+\*\s+from|insert\s+into\s+profiles)/i,
      severity: 'high',
      reason: 'Potential SQL injection payload in query text.',
    },
  ];

  /**
   * Evaluates input text for jailbreaks, prompt injections, and cross-student data attacks.
   */
  static evaluate(input: string): GuardrailCheckResult {
    const trimmed = input.trim();

    for (const check of this.INJECTION_PATTERNS) {
      if (check.pattern.test(trimmed)) {
        return {
          passed: false,
          guardrailName: 'InputGuardrail:Security',
          severity: check.severity,
          reason: check.reason,
          sanitizedContent: 'I am here to assist with your academic study, concepts, and problem solving. Let us focus on the topic at hand.',
        };
      }
    }

    return {
      passed: true,
      guardrailName: 'InputGuardrail:Security',
      severity: 'low',
    };
  }
}
