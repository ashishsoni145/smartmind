import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import {
  ListQuestionsQueryInput,
  CreateQuestionInput,
} from './question.schema';

export class QuestionService {
  public static async listQuestions(filters: ListQuestionsQueryInput) {
    let q = supabase
      .from('questions')
      .select('*, question_options (*)', { count: 'exact' });

    if (filters.subjectId) q = q.eq('subject_id', filters.subjectId);
    if (filters.curriculumNodeId) q = q.eq('curriculum_node_id', filters.curriculumNodeId);
    if (filters.conceptId) q = q.eq('concept_id', filters.conceptId);
    if (filters.targetExamId) q = q.eq('target_exam_id', filters.targetExamId);
    if (filters.year) q = q.eq('source_year', filters.year);
    if (filters.difficultyLevel) q = q.eq('difficulty_level', filters.difficultyLevel);
    if (filters.isPyq !== undefined) q = q.eq('is_pyq', filters.isPyq);
    if (filters.isImportant !== undefined) q = q.eq('is_important', filters.isImportant);

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    const { data, count, error } = await q
      .order('source_year', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new BadRequestError(error.message);

    const formatted = (data || []).map((q: any) => ({
      ...q,
      options: q.question_options || [],
    }));

    return {
      questions: formatted,
      total: count || 0,
    };
  }

  public static async getPyqs(filters: {
    subjectId?: string;
    curriculumNodeId?: string;
    targetExamId?: string;
    year?: number;
    limit?: number;
  }) {
    let q = supabase
      .from('questions')
      .select('*, question_options (*)')
      .eq('is_pyq', true)
      .order('source_year', { ascending: false, nullsFirst: false });

    if (filters.subjectId) q = q.eq('subject_id', filters.subjectId);
    if (filters.curriculumNodeId) q = q.eq('curriculum_node_id', filters.curriculumNodeId);
    if (filters.targetExamId) q = q.eq('target_exam_id', filters.targetExamId);
    if (filters.year) q = q.eq('source_year', filters.year);
    if (filters.limit) q = q.limit(filters.limit);

    const { data, error } = await q;
    if (error) throw new BadRequestError(error.message);

    return (data || []).map((q: any) => ({
      ...q,
      options: q.question_options || [],
    }));
  }

  public static async getImportantQuestions(curriculumNodeId?: string) {
    let q = supabase
      .from('questions')
      .select('*, question_options (*)')
      .eq('is_important', true)
      .order('appearance_frequency', { ascending: false });

    if (curriculumNodeId) {
      q = q.eq('curriculum_node_id', curriculumNodeId);
    }

    const { data, error } = await q;
    if (error) throw new BadRequestError(error.message);

    return (data || []).map((q: any) => ({
      ...q,
      options: q.question_options || [],
    }));
  }

  public static async getQuestionById(id: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*, question_options (*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new BadRequestError(error.message);
    if (!data) throw new NotFoundError('Question not found');

    return {
      ...data,
      options: data.question_options || [],
    };
  }

  /**
   * Deduplicated, source-aware question ingestion pipeline
   */
  public static async ingestQuestions(questions: CreateQuestionInput[]) {
    let createdCount = 0;
    let deduplicatedCount = 0;
    const results: any[] = [];

    for (const q of questions) {
      // Check for duplicate: match by (subject_id, source_exam, source_year, trimmed question_text)
      const cleanText = q.questionText.trim();
      let query = supabase
        .from('questions')
        .select('id, appearance_frequency')
        .eq('subject_id', q.subjectId)
        .eq('question_text', cleanText);

      if (q.sourceExam) query = query.eq('source_exam', q.sourceExam);
      if (q.sourceYear) query = query.eq('source_year', q.sourceYear);

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        // Increment frequency on repeated question appearances across sessions/years
        await supabase
          .from('questions')
          .update({
            appearance_frequency: (existing.appearance_frequency || 1) + 1,
            is_important: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        deduplicatedCount++;
        results.push({ id: existing.id, status: 'deduplicated_updated' });
      } else {
        // Insert new authentic question
        const { data: inserted, error: insertErr } = await supabase
          .from('questions')
          .insert({
            ...(q.id ? { id: q.id } : {}),
            subject_id: q.subjectId,
            curriculum_node_id: q.curriculumNodeId || null,
            concept_id: q.conceptId || null,
            target_exam_id: q.targetExamId || null,
            question_text: cleanText,
            question_type: q.questionType,
            pedagogical_type: q.pedagogicalType || 'conceptual',
            difficulty_level: q.difficultyLevel,
            marks: q.marks,
            explanation: q.explanation || '',
            hint: q.hint || '',
            source_exam: q.sourceExam,
            source_year: q.sourceYear,
            source_session: q.sourceSession,
            source_paper_code: q.sourcePaperCode,
            is_pyq: q.isPyq,
            is_important: q.isImportant,
            is_generated: q.isGenerated || false,
            generation_provenance: q.generationProvenance || null,
            diagram_url: q.diagramUrl || null,
            solution_steps: q.solutionSteps || [],
            appearance_frequency: q.appearanceFrequency,
            pattern_tags: q.patternTags,
            is_verified: !q.isGenerated,
          })
          .select('*')
          .single();

        if (insertErr || !inserted) {
          throw new BadRequestError(`Failed to insert question: ${insertErr?.message}`);
        }

        // Insert options if provided
        if (q.options && q.options.length > 0) {
          const optRows = q.options.map((opt) => ({
            question_id: inserted.id,
            option_key: opt.optionKey,
            option_text: opt.optionText,
            is_correct: opt.isCorrect,
          }));

          await supabase.from('question_options').insert(optRows);
        }

        createdCount++;
        results.push({ id: inserted.id, status: 'created' });
      }
    }

    return {
      total: questions.length,
      createdCount,
      deduplicatedCount,
      results,
    };
  }

  /**
   * Select adaptive questions for a student based on concept mastery and recent evidence.
   */
  public static async selectAdaptive(studentId: string, filters: {
    subjectId: string;
    curriculumNodeId?: string;
    conceptId?: string;
    targetExamId?: string;
    count?: number;
  }) {
    const targetCount = filters.count || 10;

    // 1. Fetch candidate questions
    let q = supabase
      .from('questions')
      .select('*, question_options(*)')
      .eq('subject_id', filters.subjectId);

    if (filters.curriculumNodeId) q = q.eq('curriculum_node_id', filters.curriculumNodeId);
    if (filters.conceptId) q = q.eq('concept_id', filters.conceptId);
    if (filters.targetExamId) q = q.eq('target_exam_id', filters.targetExamId);

    const { data: candidates, error: candError } = await q.limit(100);
    if (candError) throw new BadRequestError(candError.message);

    const formattedCandidates: any[] = (candidates || []).map((row: any) => ({
      ...row,
      options: row.question_options || [],
    }));

    if (formattedCandidates.length === 0) {
      return [];
    }

    // 2. Fetch student's concept mastery states
    const { data: conceptStates } = await supabase
      .from('student_concept_states')
      .select('concept_id, mastery_score')
      .eq('student_id', studentId);

    const conceptMasteryMap: Record<string, number> = {};
    (conceptStates || []).forEach((cs: any) => {
      if (cs.concept_id) conceptMasteryMap[cs.concept_id] = cs.mastery_score;
    });

    // 3. Fetch recently attempted question IDs (last 14 days)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentLogs } = await supabase
      .from('student_evidence_logs')
      .select('question_id')
      .eq('student_id', studentId)
      .gte('created_at', fourteenDaysAgo);

    const recentQuestionIds = new Set<string>(
      (recentLogs || []).map((l: any) => l.question_id).filter(Boolean)
    );

    // 4. Run deterministic adaptive selection rules
    const { selectAdaptiveQuestions } = await import('./question.rules');
    return selectAdaptiveQuestions(formattedCandidates, {
      conceptMasteryMap,
      recentQuestionIds,
      targetCount,
    });
  }

  /**
   * Validate a question answer deterministically.
   */
  public static async validateQuestionAnswer(questionId: string, input: {
    selectedOptions?: string[];
    numericalAnswer?: string | null;
    textAnswer?: string | null;
  }) {
    const question = await this.getQuestionById(questionId);
    const { validateAnswer } = await import('./question.rules');

    return validateAnswer({
      question: question as any,
      selectedOptions: input.selectedOptions,
      numericalAnswer: input.numericalAnswer,
      textAnswer: input.textAnswer,
    });
  }

  public static async analyzeExamPatterns(subjectId?: string, targetExamId?: string) {
    let q = supabase
      .from('questions')
      .select('source_exam, source_year, difficulty_level, pattern_tags, is_pyq')
      .eq('is_pyq', true);

    if (subjectId) q = q.eq('subject_id', subjectId);
    if (targetExamId) q = q.eq('target_exam_id', targetExamId);

    const { data, error } = await q;
    if (error) throw new BadRequestError(error.message);

    const questions = data || [];
    const yearDistribution: Record<number, number> = {};
    const difficultyDistribution: Record<string, number> = {};
    const patternTagDistribution: Record<string, number> = {};

    questions.forEach((item: any) => {
      if (item.source_year) {
        yearDistribution[item.source_year] = (yearDistribution[item.source_year] || 0) + 1;
      }
      if (item.difficulty_level) {
        difficultyDistribution[item.difficulty_level] =
          (difficultyDistribution[item.difficulty_level] || 0) + 1;
      }
      if (Array.isArray(item.pattern_tags)) {
        item.pattern_tags.forEach((tag: string) => {
          patternTagDistribution[tag] = (patternTagDistribution[tag] || 0) + 1;
        });
      }
    });

    return {
      totalPyqs: questions.length,
      yearDistribution,
      difficultyDistribution,
      patternTagDistribution,
    };
  }
}
