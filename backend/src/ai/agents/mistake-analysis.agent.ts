import { z } from 'zod';
import { aiOrchestrator } from '../orchestrator';

export const mistakeAnalysisOutputSchema = z.object({
  mistakeType: z.enum(['conceptual', 'calculation', 'comprehension', 'timing', 'shortcut']),
  rootCause: z.string(),
  pedagogicalDiagnosis: z.string(),
  remedialConceptId: z.string().optional(),
  remedialAction: z.string(),
  similarityToPriorMistakes: z.number().min(0).max(1).default(0),
});

export type MistakeAnalysisOutput = z.infer<typeof mistakeAnalysisOutputSchema>;

export interface MistakeDiagnosticInput {
  questionText: string;
  correctAnswer: string;
  studentAnswer: string;
  solutionSteps?: string;
  studentRationale?: string;
  priorMistakeNotes?: string[];
}

export class MistakeAnalysisAgent {
  /**
   * Diagnoses root causes behind wrong answers and maps to curriculum concept remediation
   */
  static async diagnose(input: MistakeDiagnosticInput): Promise<MistakeAnalysisOutput> {
    const systemPrompt = `
You are the SmartMind Mistake Analysis Agent.
Classify student mistakes into conceptual, calculation, comprehension, timing, or shortcut errors.
Identify WHY the chosen wrong answer was attractive (distractor rationale) and prescribe concrete remediation.
Return ONLY valid JSON conforming to the schema.
`;

    const userPrompt = `
Question: "${input.questionText}"
Correct Answer: "${input.correctAnswer}"
Student Selected: "${input.studentAnswer}"
Student Rationale / Steps: "${input.studentRationale || input.solutionSteps || 'Not provided'}"
Prior Student Mistakes in this Domain: ${JSON.stringify(input.priorMistakeNotes || [])}

Provide precise classification, root cause analysis, and pedagogical remedy.
`;

    const { data } = await aiOrchestrator.completeStructured<MistakeAnalysisOutput>(
      {
        taskType: 'mistake_analysis',
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.2,
      },
      (raw) => {
        const safeRaw = {
          mistakeType: raw.mistakeType || 'conceptual',
          rootCause: raw.rootCause || 'Misapplication of formula under non-ideal boundary conditions.',
          pedagogicalDiagnosis: raw.pedagogicalDiagnosis || 'The student neglected external constraints.',
          remedialConceptId: raw.remedialConceptId,
          remedialAction: raw.remedialAction || 'Review foundational definitions and re-solve similar problem.',
          similarityToPriorMistakes: raw.similarityToPriorMistakes ?? 0.5,
        };
        return mistakeAnalysisOutputSchema.parse(safeRaw);
      }
    );

    return data;
  }
}
