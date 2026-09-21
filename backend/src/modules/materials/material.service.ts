import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { StudyMaterialAgent } from '../../ai/agents/study-material.agent';
import { MaterialRules } from './material.rules';
import {
  CreateMaterialInput,
  ListMaterialsQueryInput,
} from './material.schema';
import {
  StudyMaterial,
  StudyFormulaItem,
  ExtractedConcept,
  StudyMaterialSummary,
} from '@sharpmind/types';

export class MaterialService {
  /**
   * Register a new study material record (student upload or notes)
   */
  static async createMaterial(
    userId: string,
    input: CreateMaterialInput
  ): Promise<StudyMaterial> {
    const payload = {
      user_id: userId,
      title: input.title,
      source_type: input.sourceType || 'student_upload',
      subject_id: input.subjectId || null,
      grade_id: input.gradeId || null,
      board_id: input.boardId || null,
      curriculum_node_id: input.curriculumNodeId || null,
      file_url: input.fileUrl || null,
      file_asset_id: input.fileAssetId || null,
      processing_status: 'pending',
      summary: {},
      extracted_concepts: [],
      formula_sheet: [],
      flashcards: [],
      quiz_questions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('materials')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      logger.error({ error }, 'Failed to insert study material record');
      throw new BadRequestError(`Could not create study material: ${error?.message}`);
    }

    const material = this.mapMaterialRow(data);

    // If raw text content was supplied, immediately trigger intelligence processing
    if (input.rawContent && input.rawContent.trim().length > 0) {
      return this.processMaterial(material.id, userId, input.rawContent);
    }

    return material;
  }

  /**
   * Process raw text/OCR content: chunking, indexing, AI intelligence extraction
   */
  static async processMaterial(
    materialId: string,
    userId: string,
    rawContent?: string
  ): Promise<StudyMaterial> {
    // 1. Fetch material and verify ownership
    const { data: materialRow, error: fetchErr } = await supabase
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .maybeSingle();

    if (fetchErr || !materialRow) {
      throw new NotFoundError(`Material ${materialId} not found`);
    }

    if (materialRow.user_id && materialRow.user_id !== userId) {
      throw new ForbiddenError('You do not have permission to process this material');
    }

    const contentToProcess = rawContent || '';

    // Handle malformed/empty files gracefully
    if (!contentToProcess || contentToProcess.trim().length < 10) {
      await supabase
        .from('materials')
        .update({
          processing_status: 'failed',
          error_message: 'Malformed or empty document text. Content must contain at least 10 characters of readable text.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', materialId);

      const { data: updated } = await supabase
        .from('materials')
        .select('*')
        .eq('id', materialId)
        .single();
      return this.mapMaterialRow(updated);
    }

    // Set status to processing
    await supabase
      .from('materials')
      .update({ processing_status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', materialId);

    try {
      // 2. Chunk and index into material_chunks
      const chunks = MaterialRules.chunkDocument(contentToProcess);

      // Clean existing chunks if re-processing
      await supabase.from('material_chunks').delete().eq('material_id', materialId);

      if (chunks.length > 0) {
        const chunkPayloads = chunks.map((c) => ({
          material_id: materialId,
          chunk_index: c.chunkIndex,
          content: c.content,
          metadata: {
            wordCount: c.wordCount,
            citationTag: c.citationTag,
          },
        }));

        await supabase.from('material_chunks').insert(chunkPayloads);
      }

      // 3. Extract concepts, formulas, summaries via AI Agent
      const aiResult = await StudyMaterialAgent.process({
        text: contentToProcess,
        sourceDocumentName: materialRow.title,
        subject: materialRow.subject_id || undefined,
      });

      // 4. Map structured artifacts
      const formulaList: StudyFormulaItem[] = [];
      const conceptList: ExtractedConcept[] = [];
      const keyTakeaways: string[] = [];

      for (const topic of aiResult.extractedTopics) {
        keyTakeaways.push(...(topic.coreDefinitions || []));

        for (const f of topic.keyFormulas || []) {
          formulaList.push({
            id: `form-${formulaList.length + 1}`,
            name: topic.title,
            formulaLatex: f,
            boundaryConditions: 'Standard academic conditions',
          });
        }

        for (const def of topic.coreDefinitions || []) {
          conceptList.push({
            id: `conc-${conceptList.length + 1}`,
            name: topic.title,
            definition: def,
            examRelevance: 'high',
          });
        }
      }

      const summary: StudyMaterialSummary = {
        title: materialRow.title,
        coreSubject: materialRow.subject_id,
        keyTakeaways: keyTakeaways.slice(0, 10),
        estimatedReadTimeMinutes: Math.max(1, Math.round(contentToProcess.split(/\s+/).length / 200)),
      };

      // 5. Generate Flashcards & Quizzes from extracted concepts
      const flashcards = MaterialRules.generateRevisionDeck(formulaList, conceptList);
      const quizQuestions = MaterialRules.synthesizeQuizQuestions(conceptList, formulaList);

      // 6. Persist to database
      const updatePayload = {
        processing_status: 'completed',
        summary,
        extracted_concepts: conceptList,
        formula_sheet: formulaList,
        flashcards,
        quiz_questions: quizQuestions,
        error_message: null,
        updated_at: new Date().toISOString(),
      };

      const { data: finalRow, error: updateErr } = await supabase
        .from('materials')
        .update(updatePayload)
        .eq('id', materialId)
        .select('*')
        .single();

      if (updateErr || !finalRow) {
        throw new BadRequestError(`Failed to save extracted intelligence: ${updateErr?.message}`);
      }

      return this.mapMaterialRow(finalRow);
    } catch (err: any) {
      logger.error({ err: err.message, materialId }, 'Material intelligence processing failed');

      await supabase
        .from('materials')
        .update({
          processing_status: 'failed',
          error_message: err.message || 'AI extraction failed during processing.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', materialId);

      const { data: failedRow } = await supabase
        .from('materials')
        .select('*')
        .eq('id', materialId)
        .single();
      return this.mapMaterialRow(failedRow);
    }
  }

  /**
   * Get a material by ID
   */
  static async getMaterial(materialId: string, userId: string): Promise<StudyMaterial> {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .maybeSingle();

    if (error || !data) {
      throw new NotFoundError(`Material ${materialId} not found`);
    }

    if (data.user_id && data.user_id !== userId) {
      throw new ForbiddenError('You do not have access to this material');
    }

    return this.mapMaterialRow(data);
  }

  /**
   * List materials accessible to user
   */
  static async listMaterials(
    userId: string,
    query: ListMaterialsQueryInput
  ): Promise<{ materials: StudyMaterial[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = supabase
      .from('materials')
      .select('*', { count: 'exact' })
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('created_at', { ascending: false });

    if (query.subjectId) q = q.eq('subject_id', query.subjectId);
    if (query.curriculumNodeId) q = q.eq('curriculum_node_id', query.curriculumNodeId);
    if (query.status) q = q.eq('processing_status', query.status);

    const { data, count, error } = await q.range(from, to);

    if (error) {
      throw new BadRequestError(`Failed to list study materials: ${error.message}`);
    }

    return {
      materials: (data || []).map(this.mapMaterialRow),
      total: count || 0,
    };
  }

  /**
   * Delete a study material record
   */
  static async deleteMaterial(materialId: string, userId: string): Promise<void> {
    const { data: material } = await supabase
      .from('materials')
      .select('user_id')
      .eq('id', materialId)
      .maybeSingle();

    if (!material) throw new NotFoundError(`Material ${materialId} not found`);
    if (material.user_id && material.user_id !== userId) {
      throw new ForbiddenError('You do not have permission to delete this material');
    }

    const { error } = await supabase.from('materials').delete().eq('id', materialId);
    if (error) throw new BadRequestError(`Failed to delete material: ${error.message}`);
  }

  private static mapMaterialRow(row: any): StudyMaterial {
    return {
      id: row.id,
      userId: row.user_id || undefined,
      title: row.title,
      sourceType: row.source_type,
      boardId: row.board_id || undefined,
      gradeId: row.grade_id || undefined,
      subjectId: row.subject_id || undefined,
      curriculumNodeId: row.curriculum_node_id || undefined,
      fileUrl: row.file_url || undefined,
      fileAssetId: row.file_asset_id || undefined,
      processingStatus: row.processing_status || 'completed',
      summary: row.summary || {},
      extractedConcepts: row.extracted_concepts || [],
      formulaSheet: row.formula_sheet || [],
      flashcards: row.flashcards || [],
      quizQuestions: row.quiz_questions || [],
      errorMessage: row.error_message || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
