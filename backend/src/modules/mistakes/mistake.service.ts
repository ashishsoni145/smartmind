// =============================================================================
// Mistake Service — Notebook Management, Error Diagnostics & Spaced Retries
// =============================================================================

import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import { validateAnswer } from '../questions/question.rules';
import { calculateNextRetry, inferMistakeRootCause, processMistakeRetry } from './mistake.rules';
import { StudentModelService } from '../student-model/student-model.service';
import type {
  MistakeRecord,
  MistakeRootCause,
  Question,
} from '@sharpmind/types';
import type {
  ListMistakesQueryInput,
  UpdateMistakeInput,
  RetryMistakeInput,
} from './mistake.schema';

export class MistakeService {
  /**
   * Retrieves a paginated list of mistakes with filtering and summary metrics.
   */
  public static async getMistakes(
    studentId: string,
    query: ListMistakesQueryInput
  ): Promise<{
    mistakes: MistakeRecord[];
    total: number;
    metrics: {
      totalMistakes: number;
      resolvedCount: number;
      unresolvedCount: number;
      overdueCount: number;
      rootCauseDistribution: Record<string, number>;
    };
  }> {
    let q = supabase
      .from('mistakes')
      .select('*, questions(*)', { count: 'exact' })
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (query.rootCause) {
      q = q.eq('root_cause', query.rootCause);
    }
    if (query.isResolved !== undefined) {
      q = q.eq('is_resolved', query.isResolved);
    }
    if (query.overdueOnly) {
      const nowIso = new Date().toISOString();
      q = q.eq('is_resolved', false).lte('next_retry_at', nowIso);
    }

    q = q.range(query.offset, query.offset + query.limit - 1);

    const { data, count, error } = await q;
    if (error) {
      throw new BadRequestError(`Failed to fetch mistakes: ${error.message}`);
    }

    // Fetch metrics across all student's mistakes
    const { data: allMistakes } = await supabase
      .from('mistakes')
      .select('root_cause, is_resolved, next_retry_at')
      .eq('student_id', studentId);

    const nowIso = new Date().toISOString();
    let resolvedCount = 0;
    let unresolvedCount = 0;
    let overdueCount = 0;
    const rootCauseDistribution: Record<string, number> = {};

    for (const m of allMistakes || []) {
      if (m.is_resolved) {
        resolvedCount++;
      } else {
        unresolvedCount++;
        if (m.next_retry_at && m.next_retry_at <= nowIso) {
          overdueCount++;
        }
      }
      const rc = m.root_cause || 'conceptual';
      rootCauseDistribution[rc] = (rootCauseDistribution[rc] || 0) + 1;
    }

    const mistakes: MistakeRecord[] = (data || []).map((row: any) => ({
      id: row.id,
      studentId: row.student_id,
      questionId: row.question_id,
      assessmentId: row.assessment_id,
      rootCause: row.root_cause,
      studentAnswer: row.student_answer,
      correctAnswer: row.correct_answer,
      repetitionCount: row.repetition_count,
      spacedIntervalDays: row.spaced_interval_days,
      nextRetryAt: row.next_retry_at,
      resolvedAt: row.resolved_at,
      isResolved: row.is_resolved,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      question: row.questions ? mapQuestionRow(row.questions) : undefined,
    }));

    return {
      mistakes,
      total: count || 0,
      metrics: {
        totalMistakes: (allMistakes || []).length,
        resolvedCount,
        unresolvedCount,
        overdueCount,
        rootCauseDistribution,
      },
    };
  }

  /**
   * Retrieves single mistake by ID.
   */
  public static async getMistakeById(id: string, studentId: string): Promise<MistakeRecord> {
    const { data, error } = await supabase
      .from('mistakes')
      .select('*, questions(*)')
      .eq('id', id)
      .eq('student_id', studentId)
      .maybeSingle();

    if (error || !data) {
      throw new NotFoundError(`Mistake record not found: ${id}`);
    }

    return {
      id: data.id,
      studentId: data.student_id,
      questionId: data.question_id,
      assessmentId: data.assessment_id,
      rootCause: data.root_cause,
      studentAnswer: data.student_answer,
      correctAnswer: data.correct_answer,
      repetitionCount: data.repetition_count,
      spacedIntervalDays: data.spaced_interval_days,
      nextRetryAt: data.next_retry_at,
      resolvedAt: data.resolved_at,
      isResolved: data.is_resolved,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      question: data.questions ? mapQuestionRow(data.questions) : undefined,
    };
  }

  /**
   * Updates root cause classification or reflection notes.
   */
  public static async updateMistake(
    id: string,
    studentId: string,
    input: UpdateMistakeInput
  ): Promise<MistakeRecord> {
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.rootCause !== undefined) updates.root_cause = input.rootCause;
    if (input.notes !== undefined) updates.notes = input.notes;
    if (input.isResolved !== undefined) {
      updates.is_resolved = input.isResolved;
      if (input.isResolved) {
        updates.resolved_at = new Date().toISOString();
      } else {
        updates.resolved_at = null;
      }
    }

    const { data, error } = await supabase
      .from('mistakes')
      .update(updates)
      .eq('id', id)
      .eq('student_id', studentId)
      .select('*, questions(*)')
      .single();

    if (error || !data) {
      throw new BadRequestError(`Failed to update mistake: ${error?.message || 'Not found'}`);
    }

    return {
      id: data.id,
      studentId: data.student_id,
      questionId: data.question_id,
      assessmentId: data.assessment_id,
      rootCause: data.root_cause,
      studentAnswer: data.student_answer,
      correctAnswer: data.correct_answer,
      repetitionCount: data.repetition_count,
      spacedIntervalDays: data.spaced_interval_days,
      nextRetryAt: data.next_retry_at,
      resolvedAt: data.resolved_at,
      isResolved: data.is_resolved,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      question: data.questions ? mapQuestionRow(data.questions) : undefined,
    };
  }

  /**
   * Evaluates a retry attempt on a logged mistake question.
   * Feeds evidence into Student Model and adjusts spaced intervals.
   */
  public static async retryMistake(
    id: string,
    studentId: string,
    input: RetryMistakeInput
  ): Promise<{
    isCorrect: boolean;
    explanation?: string;
    isResolved: boolean;
    repetitionCount: number;
    spacedIntervalDays: number;
    nextRetryAt: string;
    mistake: MistakeRecord;
  }> {
    const existing = await this.getMistakeById(id, studentId);
    if (!existing.question) {
      throw new BadRequestError('Associated question details not found for retry evaluation.');
    }

    const q = existing.question;
    const valResult = validateAnswer({
      question: q,
      selectedOptions: input.selectedOptions,
      numericalAnswer: input.numericalAnswer,
    });

    const isCorrect = valResult.isCorrect;
    const retryOutcome = processMistakeRetry({
      currentRepetition: existing.repetitionCount || 1,
      isCorrect,
    });

    // Update mistake record
    const { data, error } = await supabase
      .from('mistakes')
      .update({
        is_resolved: retryOutcome.isResolved,
        resolved_at: retryOutcome.resolvedAt || null,
        repetition_count: retryOutcome.repetitionCount,
        spaced_interval_days: retryOutcome.spacedIntervalDays,
        next_retry_at: retryOutcome.nextRetryAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('student_id', studentId)
      .select('*, questions(*)')
      .single();

    if (error || !data) {
      throw new BadRequestError(`Failed to update mistake retry outcome: ${error?.message}`);
    }

    // Record evidence to Student Model
    try {
      await StudentModelService.recordEvidence(studentId, {
        evidenceType: 'practice_question',
        curriculumNodeId: q.curriculumNodeId,
        conceptId: q.conceptId,
        questionId: q.id,
        isCorrect,
        scoreOrPerformance: isCorrect ? 1.0 : 0.0,
        timeTakenSeconds: input.timeSpentSeconds,
        difficultyLevel: q.difficultyLevel,
        sessionType: 'spaced_retry',
        provenanceSource: 'mistake_retry',
        payload: {
          mistakeId: id,
          repetitionCount: retryOutcome.repetitionCount,
        },
      });
    } catch {
      // Non-blocking for student response
    }

    const updatedMistake: MistakeRecord = {
      id: data.id,
      studentId: data.student_id,
      questionId: data.question_id,
      assessmentId: data.assessment_id,
      rootCause: data.root_cause,
      studentAnswer: data.student_answer,
      correctAnswer: data.correct_answer,
      repetitionCount: data.repetition_count,
      spacedIntervalDays: data.spaced_interval_days,
      nextRetryAt: data.next_retry_at,
      resolvedAt: data.resolved_at,
      isResolved: data.is_resolved,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      question: data.questions ? mapQuestionRow(data.questions) : undefined,
    };

    return {
      isCorrect,
      explanation: q.explanation,
      isResolved: retryOutcome.isResolved,
      repetitionCount: retryOutcome.repetitionCount,
      spacedIntervalDays: retryOutcome.spacedIntervalDays,
      nextRetryAt: retryOutcome.nextRetryAt,
      mistake: updatedMistake,
    };
  }

  /**
   * Logs a new mistake or increments repetition count if question was previously logged.
   */
  public static async logMistake(params: {
    studentId: string;
    question: Question;
    assessmentId?: string;
    studentAnswer: any;
    timeSpentSeconds?: number;
    customRootCause?: MistakeRootCause;
  }): Promise<void> {
    const { studentId, question, assessmentId, studentAnswer, timeSpentSeconds = 30, customRootCause } = params;

    // Check if mistake already exists for this student & question
    const { data: existing } = await supabase
      .from('mistakes')
      .select('id, repetition_count')
      .eq('student_id', studentId)
      .eq('question_id', question.id)
      .maybeSingle();

    const rootCause =
      customRootCause ||
      inferMistakeRootCause({
        question,
        timeSpentSeconds,
        studentAnswer,
      });

    const targetOption = question.options?.find((o) => o.isCorrect);
    const correctAnswer = targetOption ? targetOption.optionKey || targetOption.optionText : question.explanation;

    if (existing) {
      const newRep = (existing.repetition_count || 1) + 1;
      const { spacedIntervalDays, nextRetryAt } = calculateNextRetry(newRep);
      await supabase
        .from('mistakes')
        .update({
          repetition_count: newRep,
          spaced_interval_days: spacedIntervalDays,
          next_retry_at: nextRetryAt,
          is_resolved: false,
          resolved_at: null,
          student_answer: studentAnswer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      const { spacedIntervalDays, nextRetryAt } = calculateNextRetry(1);
      await supabase.from('mistakes').insert({
        student_id: studentId,
        question_id: question.id,
        assessment_id: assessmentId || null,
        root_cause: rootCause,
        student_answer: studentAnswer,
        correct_answer: correctAnswer,
        repetition_count: 1,
        spaced_interval_days: spacedIntervalDays,
        next_retry_at: nextRetryAt,
        is_resolved: false,
      });
    }
  }
}

function mapQuestionRow(row: any): Question {
  return {
    id: row.id,
    curriculumNodeId: row.curriculum_node_id,
    subjectId: row.subject_id,
    conceptId: row.concept_id,
    targetExamId: row.target_exam_id,
    questionType: row.question_type,
    pedagogicalType: row.pedagogical_type || 'conceptual',
    difficultyLevel: row.difficulty_level || 'medium',
    questionText: row.question_text,
    options: row.options || [],
    marks: row.marks || 4,
    negativeMarks: row.negative_marks,
    explanation: row.explanation,
    hint: row.hint,
    diagramUrl: row.diagram_url,
    patternTags: row.pattern_tags || [],
    sourceType: row.source_type || 'verified_source',
    provenanceSource: row.provenance_source,
    isVerified: row.is_verified ?? true,
    isGenerated: row.is_generated ?? false,
    isPyq: row.is_pyq ?? false,
    isImportant: row.is_important ?? false,
    appearanceFrequency: row.appearance_frequency ?? 1,
    numericalTolerance: row.numerical_tolerance,
  };
}
