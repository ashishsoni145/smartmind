import { z } from 'zod';
import { aiOrchestrator } from '../orchestrator';

export const studyMaterialTopicSchema = z.object({
  title: z.string(),
  keyFormulas: z.array(z.string()),
  coreDefinitions: z.array(z.string()),
  commonPitfalls: z.array(z.string()),
});

export const studyMaterialExtractionOutputSchema = z.object({
  extractedTopics: z.array(studyMaterialTopicSchema).min(1),
  provenance: z.string(),
});

export type StudyMaterialExtractionOutput = z.infer<typeof studyMaterialExtractionOutputSchema>;

export interface ProcessMaterialInput {
  text: string;
  sourceDocumentName?: string;
  subject?: string;
  targetExam?: string;
}

export class StudyMaterialAgent {
  /**
   * Processes uploaded student materials (notes, summaries, extracts)
   * into structured formulas, definitions, and high-yield traps.
   */
  static async process(input: ProcessMaterialInput): Promise<StudyMaterialExtractionOutput> {
    const systemPrompt = `
You are the SmartMind Study Material Intelligence Agent.
Extract high-yield concepts, mathematical formulas, core definitions, and exam pitfalls from notes.
Preserve exact provenance. Return ONLY valid JSON matching the schema.
`;

    const userPrompt = `
Document Name: "${input.sourceDocumentName || 'Uploaded Notes'}"
Subject: ${input.subject || 'Academic'}
Target Exam: ${input.targetExam || 'General'}
Content to Process:
"""
${input.text.slice(0, 10000)}
"""

Extract all relevant topics, formulas, definitions, and pitfall traps.
`;

    const { data } = await aiOrchestrator.completeStructured<StudyMaterialExtractionOutput>(
      {
        taskType: 'study_material_extraction',
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.2,
        metadata: {
          provenance: input.sourceDocumentName || 'Uploaded Study Material',
        },
      },
      (raw) => {
        const safeRaw = {
          extractedTopics: raw.extractedTopics || [
            {
              title: 'Extracted Academic Topic',
              keyFormulas: raw.keyFormulas || [],
              coreDefinitions: raw.coreDefinitions || [],
              commonPitfalls: raw.commonPitfalls || [],
            },
          ],
          provenance: raw.provenance || input.sourceDocumentName || 'Uploaded Study Material',
        };
        return studyMaterialExtractionOutputSchema.parse(safeRaw);
      }
    );

    return data;
  }
}
