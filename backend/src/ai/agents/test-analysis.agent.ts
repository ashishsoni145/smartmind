import { z } from 'zod';
import { aiOrchestrator } from '../orchestrator';

export const testAnalysisOutputSchema = z.object({
  overallScore: z.number(),
  accuracyRate: z.number(),
  speedAccuracyTradeoff: z.string(),
  keyStrengths: z.array(z.string()),
  criticalWeaknesses: z.array(z.string()),
  recommendedFocusTopics: z.array(z.object({
    topicId: z.string(),
    title: z.string(),
    urgency: z.enum(['high', 'medium', 'low']),
  })),
  actionPlan: z.string(),
});

export type TestAnalysisOutput = z.infer<typeof testAnalysisOutputSchema>;

export interface AttemptAnalysisInput {
  attemptId: string;
  studentId: string;
  testTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  timeSpentSeconds: number;
  targetDurationSeconds: number;
  topicBreakdowns?: Array<{ topic: string; correct: number; total: number }>;
}

export class TestAnalysisAgent {
  /**
   * Evaluates a completed test attempt and derives high-yield remediation strategies
   */
  static async analyze(input: AttemptAnalysisInput): Promise<TestAnalysisOutput> {
    const accuracy = input.totalQuestions > 0 ? (input.correctAnswers / input.totalQuestions) : 0;
    const score = Math.round(accuracy * 100);

    const systemPrompt = `
You are the SmartMind Test Diagnostic Agent.
Analyze student performance across accuracy, speed, and topic balance.
Provide objective, actionable pedagogical remediation without arbitrary speculation.
Return ONLY valid JSON matching the schema.
`;

    const userPrompt = `
Test: "${input.testTitle}"
Total Questions: ${input.totalQuestions}
Correct: ${input.correctAnswers}, Incorrect: ${input.incorrectAnswers}, Unattempted: ${input.unattempted}
Accuracy Rate: ${(accuracy * 100).toFixed(1)}%
Time Spent: ${Math.round(input.timeSpentSeconds / 60)} mins (Allotted: ${Math.round(input.targetDurationSeconds / 60)} mins)
Topic Breakdown: ${JSON.stringify(input.topicBreakdowns || [])}

Provide detailed strength/weakness analysis, time management diagnosis, and prioritized action plan.
`;

    const { data } = await aiOrchestrator.completeStructured<TestAnalysisOutput>(
      {
        taskType: 'test_analysis',
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        studentId: input.studentId,
        temperature: 0.2,
      },
      (raw) => {
        // Fallback defaults if mock or model omitted fields
        const safeRaw = {
          overallScore: raw.overallScore ?? score,
          accuracyRate: raw.accuracyRate ?? accuracy,
          speedAccuracyTradeoff: raw.speedAccuracyTradeoff || 'Balanced',
          keyStrengths: raw.keyStrengths || ['Conceptual Basics'],
          criticalWeaknesses: raw.criticalWeaknesses || ['Complex Multistep Calculations'],
          recommendedFocusTopics: raw.recommendedFocusTopics || [],
          actionPlan: raw.actionPlan || 'Review mistakes and re-attempt weak topics.',
        };
        return testAnalysisOutputSchema.parse(safeRaw);
      }
    );

    return data;
  }
}
