import { z } from 'zod';
import { aiOrchestrator } from '../orchestrator';

export const generatedQuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(10),
  type: z.enum(['mcq', 'assertion_reason', 'numerical', 'conceptual', 'hots', 'short_answer']).default('mcq'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })).optional(),
  correctAnswer: z.string(),
  explanation: z.string().min(10),
  conceptCode: z.string().optional(),
  marks: z.number().default(4),
  negativeMarks: z.number().default(1),
});

export const generateQuestionsOutputSchema = z.object({
  questions: z.array(generatedQuestionSchema).min(1),
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
export type GenerateQuestionsOutput = z.infer<typeof generateQuestionsOutputSchema>;

export interface GenerateQuestionsInput {
  topic: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
  examPattern?: 'JEE' | 'NEET' | 'CBSE';
  targetConceptId?: string;
  studentModelMastery?: number;
}

export class QuestionGenAgent {
  /**
   * Generates curriculum-aligned questions using structured AI completion
   */
  static async generate(input: GenerateQuestionsInput): Promise<GenerateQuestionsOutput> {
    const count = input.count || 1;
    const exam = input.examPattern || 'JEE';
    const difficulty = input.difficulty || 'medium';

    const systemPrompt = `
You are the SmartMind Question Generation Agent for ${exam} preparation.
You produce rigorous, syllabus-aligned questions with distractors designed to catch canonical misconceptions.
Return ONLY valid JSON with a "questions" array matching the requested schema.
`;

    const userPrompt = `
Generate ${count} high-quality ${difficulty} level questions for topic: "${input.topic}".
Subject: ${input.subject || 'Academic'}.
Exam Pattern: ${exam}.
Target Concept: ${input.targetConceptId || 'General Topic'}.
Student Current Mastery: ${input.studentModelMastery !== undefined ? (input.studentModelMastery * 100).toFixed(0) + '%' : 'Intermediate'}.
Ensure step-by-step verified explanations and realistic numerical quantities.
`;

    const { data } = await aiOrchestrator.completeStructured<GenerateQuestionsOutput>(
      {
        taskType: 'question_generation',
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.2,
      },
      (raw) => generateQuestionsOutputSchema.parse(raw)
    );

    return data;
  }
}
