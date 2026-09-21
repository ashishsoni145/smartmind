import { supabase } from '../../db/client';
import { logger } from '../../lib/logger';
import {
  AssembledContext,
  ContextSlice,
  TutorCitation,
} from '../types';

export interface ContextRetrievalOptions {
  studentId: string;
  curriculumNodeId?: string;
  subjectId?: string;
  topicId?: string;
  conceptId?: string;
  userQuery?: string;
  includeCurriculum?: boolean;
  includeKnowledgeGraph?: boolean;
  includeStudentModel?: boolean;
  includeMistakes?: boolean;
  includePyqs?: boolean;
  includeMaterials?: boolean;
  maxTokens?: number;
}

export class ContextAssembler {
  /**
   * Assembles a structured, selective context package with provenance citations
   * while enforcing student data isolation.
   */
  async assemble(options: ContextRetrievalOptions): Promise<AssembledContext> {
    const maxTokens = options.maxTokens || 2000;
    const slices: ContextSlice[] = [];

    // 1. Curriculum Context
    if (options.includeCurriculum !== false && (options.curriculumNodeId || options.topicId || options.subjectId)) {
      const curriculumSlice = await this.retrieveCurriculumSlice(options);
      if (curriculumSlice) slices.push(curriculumSlice);
    }

    // 2. Knowledge Graph Prerequisites & Connections
    if (options.includeKnowledgeGraph !== false && (options.conceptId || options.curriculumNodeId)) {
      const kgSlice = await this.retrieveKnowledgeGraphSlice(options);
      if (kgSlice) slices.push(kgSlice);
    }

    // 3. Student Model Evidence (Mastery, Retention, Confidence)
    // STRICT TENANT ISOLATION: always scoped to options.studentId
    if (options.includeStudentModel !== false && options.studentId) {
      const smSlice = await this.retrieveStudentModelSlice(options);
      if (smSlice) slices.push(smSlice);
    }

    // 4. Student Mistakes History
    // STRICT TENANT ISOLATION: always scoped to options.studentId
    if (options.includeMistakes !== false && options.studentId) {
      const mistakeSlice = await this.retrieveMistakesSlice(options);
      if (mistakeSlice) slices.push(mistakeSlice);
    }

    // 5. Relevant Past Year Questions (PYQs)
    if (options.includePyqs !== false) {
      const pyqSlice = await this.retrievePyqSlice(options);
      if (pyqSlice) slices.push(pyqSlice);
    }

    // Sort slices by relevance score descending
    slices.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Apply token budgeting
    const selectedSlices: ContextSlice[] = [];
    let accumulatedTokens = 0;

    for (const slice of slices) {
      const estTokens = Math.ceil(slice.content.length / 4);
      if (accumulatedTokens + estTokens <= maxTokens) {
        selectedSlices.push(slice);
        accumulatedTokens += estTokens;
      }
    }

    // Build citations list
    const citations: TutorCitation[] = selectedSlices.map(s => ({
      id: s.citationId,
      source: s.sourceType,
      chapterOrDoc: s.title,
      chapter: s.title,
      snippet: s.content.slice(0, 150) + (s.content.length > 150 ? '...' : ''),
    }));

    // Format into context string
    const formattedContextString = this.formatContextString(selectedSlices);

    return {
      studentId: options.studentId,
      slices: selectedSlices,
      totalTokenEstimate: accumulatedTokens,
      formattedContextString,
      citations,
    };
  }

  private async retrieveCurriculumSlice(options: ContextRetrievalOptions): Promise<ContextSlice | null> {
    try {
      const idToQuery = options.curriculumNodeId || options.topicId;
      if (!idToQuery) return null;

      const { data, error } = await supabase
        .from('curriculum_nodes')
        .select('id, title, description, node_type, metadata')
        .eq('id', idToQuery)
        .maybeSingle();

      if (error || !data) return null;

      const content = `Curriculum Node: ${data.title} (${data.node_type})\nDescription: ${data.description || 'N/A'}`;

      return {
        sourceType: 'curriculum',
        citationId: `NCERT-${data.id}`,
        title: data.title,
        content,
        relevanceScore: 0.95,
        metadata: data.metadata,
      };
    } catch (err) {
      logger.debug({ err }, 'Failed to retrieve curriculum slice');
      return null;
    }
  }

  private async retrieveKnowledgeGraphSlice(options: ContextRetrievalOptions): Promise<ContextSlice | null> {
    try {
      const conceptId = options.conceptId || options.curriculumNodeId;
      if (!conceptId) return null;

      const { data, error } = await supabase
        .from('concept_nodes')
        .select('id, name, description, prerequisites, difficulty_level')
        .eq('id', conceptId)
        .maybeSingle();

      if (error || !data) return null;

      const prereqs = Array.isArray(data.prerequisites) ? data.prerequisites.join(', ') : 'None';
      const content = `Concept: ${data.name}\nDifficulty: ${data.difficulty_level || 'Medium'}\nPrerequisites: ${prereqs}\nSummary: ${data.description || 'Standard academic concept.'}`;

      return {
        sourceType: 'knowledge_graph',
        citationId: `KG-${data.id}`,
        title: data.name,
        content,
        relevanceScore: 0.9,
      };
    } catch (err) {
      logger.debug({ err }, 'Failed to retrieve knowledge graph slice');
      return null;
    }
  }

  private async retrieveStudentModelSlice(options: ContextRetrievalOptions): Promise<ContextSlice | null> {
    try {
      if (!options.studentId) return null;

      // Scoped specifically to options.studentId
      let q = supabase
        .from('student_knowledge_states')
        .select('curriculum_node_id, mastery_score, retention_score, confidence_level, status')
        .eq('student_id', options.studentId)
        .limit(5);

      if (options.curriculumNodeId) {
        q = q.eq('curriculum_node_id', options.curriculumNodeId);
      }

      const { data, error } = await q;
      if (error || !data || data.length === 0) return null;

      const stateSummaries = data.map(s =>
        `- Node ${s.curriculum_node_id}: Mastery ${(s.mastery_score * 100).toFixed(0)}%, Retention ${(s.retention_score * 100).toFixed(0)}%, Confidence: ${s.confidence_level || 'moderate'}, Status: ${s.status}`
      ).join('\n');

      const content = `Student Academic State Profile:\n${stateSummaries}`;

      return {
        sourceType: 'student_model',
        citationId: `SM-${options.studentId.slice(0, 8)}`,
        title: 'Student Mastery Profile',
        content,
        relevanceScore: 0.85,
      };
    } catch (err) {
      logger.debug({ err }, 'Failed to retrieve student model slice');
      return null;
    }
  }

  private async retrieveMistakesSlice(options: ContextRetrievalOptions): Promise<ContextSlice | null> {
    try {
      if (!options.studentId) return null;

      // Scoped specifically to options.studentId
      const { data, error } = await supabase
        .from('student_mistakes')
        .select('id, mistake_type, root_cause, question_id, created_at')
        .eq('student_id', options.studentId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error || !data || data.length === 0) return null;

      const mistakeList = data.map(m =>
        `- Mistake [${m.mistake_type}]: ${m.root_cause || 'Pattern/calculation error'}`
      ).join('\n');

      const content = `Recent Student Mistakes (to address proactively):\n${mistakeList}`;

      return {
        sourceType: 'mistake',
        citationId: `MISTAKE-${data[0].id}`,
        title: 'Recent Mistake History',
        content,
        relevanceScore: 0.8,
      };
    } catch (err) {
      logger.debug({ err }, 'Failed to retrieve mistakes slice');
      return null;
    }
  }

  private async retrievePyqSlice(options: ContextRetrievalOptions): Promise<ContextSlice | null> {
    try {
      let q = supabase
        .from('questions')
        .select('id, question_text, exam_type, year')
        .eq('source_type', 'pyq')
        .limit(2);

      if (options.curriculumNodeId) {
        q = q.eq('curriculum_node_id', options.curriculumNodeId);
      }

      const { data, error } = await q;
      if (error || !data || data.length === 0) return null;

      const pyqList = data.map(q =>
        `- [${q.exam_type || 'Exam'} ${q.year || 'PYQ'}]: ${q.question_text.slice(0, 120)}...`
      ).join('\n');

      const content = `Relevant Past Year Questions (PYQs):\n${pyqList}`;

      return {
        sourceType: 'pyq',
        citationId: `PYQ-${data[0].id}`,
        title: 'Past Year Questions',
        content,
        relevanceScore: 0.75,
      };
    } catch (err) {
      logger.debug({ err }, 'Failed to retrieve pyq slice');
      return null;
    }
  }

  private formatContextString(slices: ContextSlice[]): string {
    if (slices.length === 0) {
      return '';
    }

    const blocks: string[] = [
      '### CONTEXT & KNOWLEDGE BASE (Refer to these citations where relevant):',
    ];

    for (const slice of slices) {
      blocks.push(
        `#### [Citation: ${slice.citationId}] ${slice.title}\n${slice.content}\n`
      );
    }

    return blocks.join('\n');
  }
}

export const contextAssembler = new ContextAssembler();
export default contextAssembler;
