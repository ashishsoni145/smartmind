import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import { StudentModelService } from '../student-model/student-model.service';
import type { CreateDiagnosticInput, SubmitDiagnosticInput } from './diagnostic.schema';
import type {
  DiagnosticSession,
  DiagnosticQuestion,
  DiagnosticResult,
} from '@sharpmind/types';

// =============================================================================
// DiagnosticService — Cold-start calibration after onboarding
// Generates stratified questions, scores answers, initializes Student Model
// =============================================================================

export class DiagnosticService {
  private static readonly QUESTIONS_PER_SUBJECT = 5;
  private static readonly DIFFICULTY_DISTRIBUTION = ['easy', 'easy', 'medium', 'medium', 'hard'];

  /**
   * Create a diagnostic session with stratified questions for each enrolled subject.
   */
  public static async createSession(
    studentId: string,
    input: CreateDiagnosticInput
  ): Promise<DiagnosticSession> {
    // 1. Fetch student profile for enrolled subjects
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('enrolled_subjects, board_id, grade_id')
      .eq('id', studentId)
      .maybeSingle();

    if (profileError || !profile) {
      throw new NotFoundError('Student profile not found');
    }

    const subjectIds = input.subjectIds?.length
      ? input.subjectIds
      : (profile.enrolled_subjects as string[]) || [];

    if (subjectIds.length === 0) {
      throw new BadRequestError('No subjects available for diagnostic assessment');
    }

    // 2. Select questions for each subject using stratified sampling
    const questions: DiagnosticQuestion[] = [];

    for (const subjectId of subjectIds) {
      const subjectQuestions = await this.selectQuestionsForSubject(
        subjectId,
        profile.grade_id,
        profile.board_id
      );
      questions.push(...subjectQuestions);
    }

    if (questions.length === 0) {
      throw new BadRequestError('No questions available in the question bank for diagnostic');
    }

    // 3. Create diagnostic session
    const { data: session, error } = await supabase
      .from('diagnostic_sessions')
      .insert({
        student_id: studentId,
        status: 'pending',
        subject_ids: subjectIds,
        questions,
        total_questions: questions.length,
        confidence_level: 0.5, // Low initial confidence
        started_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !session) {
      throw new BadRequestError(`Failed to create diagnostic session: ${error?.message}`);
    }

    return mapDiagnosticSessionRow(session);
  }

  /**
   * Get a diagnostic session by ID.
   */
  public static async getSession(sessionId: string): Promise<DiagnosticSession> {
    const { data, error } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw new BadRequestError(`Failed to fetch session: ${error.message}`);
    if (!data) throw new NotFoundError('Diagnostic session not found');

    return mapDiagnosticSessionRow(data);
  }

  /**
   * Get all diagnostic sessions for a student.
   */
  public static async getStudentSessions(studentId: string): Promise<DiagnosticSession[]> {
    const { data, error } = await supabase
      .from('diagnostic_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestError(`Failed to fetch sessions: ${error.message}`);
    return (data || []).map(mapDiagnosticSessionRow);
  }

  /**
   * Submit answers for a diagnostic session.
   * Scores answers, records evidence, initializes Student Model, updates student profile.
   */
  public static async submitAnswers(
    sessionId: string,
    input: SubmitDiagnosticInput
  ): Promise<DiagnosticSession> {
    // 1. Fetch session
    const session = await this.getSession(sessionId);

    if (session.status === 'completed') {
      throw new BadRequestError('This diagnostic session has already been completed');
    }

    // 2. Score each answer
    const questions = session.questions;
    let totalCorrect = 0;
    let totalTimeSeconds = 0;
    const answeredQuestions: Array<{
      question: DiagnosticQuestion;
      answer: typeof input.answers[0];
      isCorrect: boolean;
    }> = [];

    for (const answer of input.answers) {
      const question = questions.find((q) => q.questionId === answer.questionId);
      if (!question) continue;

      // Fetch correct options from question bank
      const { data: correctOptions } = await supabase
        .from('question_options')
        .select('option_key')
        .eq('question_id', answer.questionId)
        .eq('is_correct', true);

      const correctKeys = (correctOptions || []).map((o: any) => o.option_key);
      const selectedKeys = answer.selectedOptions || [];

      const isCorrect =
        correctKeys.length > 0 &&
        correctKeys.length === selectedKeys.length &&
        correctKeys.every((k: string) => selectedKeys.includes(k));

      if (isCorrect) totalCorrect++;
      totalTimeSeconds += answer.timeTakenSeconds || 0;

      answeredQuestions.push({ question, answer, isCorrect });
    }

    // 3. Generate per-subject results
    const results = this.analyzeResults(answeredQuestions, session.subjectIds);

    // 4. Identify strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    for (const result of results) {
      if (result.accuracy >= 0.6) {
        strengths.push(`${result.subjectName}: ${Math.round(result.accuracy * 100)}% accuracy`);
      } else {
        weaknesses.push(`${result.subjectName}: needs foundational work`);
      }
      strengths.push(...result.strengths);
      weaknesses.push(...result.weaknesses);
    }

    // 5. Compute overall confidence level (low for initial diagnostic)
    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
    // Confidence is low for diagnostic because sample size is small
    const confidenceLevel = Math.min(0.6, 0.3 + (totalQuestions / 30) * 0.3);

    // 6. Record evidence for each answer in the Student Model
    for (const aq of answeredQuestions) {
      await StudentModelService.recordEvidence(session.studentId, {
        curriculumNodeId: aq.question.curriculumNodeId || undefined,
        conceptId: aq.question.conceptId || undefined,
        evidenceType: 'diagnostic_test',
        questionId: aq.question.questionId,
        isCorrect: aq.isCorrect,
        timeTakenSeconds: aq.answer.timeTakenSeconds || undefined,
        confidenceSelfReport: aq.answer.confidenceSelfReport || undefined,
        difficultyLevel: (aq.question.difficultyLevel as any) || undefined,
        sessionType: 'initial_diagnostic',
        provenanceSource: 'diagnostic_v1',
        payload: {
          diagnosticSessionId: sessionId,
          selectedOptions: aq.answer.selectedOptions,
        },
      });
    }

    // 7. Update the diagnostic session
    const { data: updated, error: updateError } = await supabase
      .from('diagnostic_sessions')
      .update({
        status: 'completed',
        answers: input.answers,
        results,
        total_correct: totalCorrect,
        total_time_seconds: totalTimeSeconds,
        confidence_level: confidenceLevel,
        strengths,
        weaknesses,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select('*')
      .single();

    if (updateError || !updated) {
      throw new BadRequestError(`Failed to update session: ${updateError?.message}`);
    }

    // 8. Update student profile status
    await supabase
      .from('student_profiles')
      .update({
        knowledge_model_status: 'initial_diagnostic_complete',
        next_action: 'view_recommendations',
        last_calibrated_at: new Date().toISOString(),
      })
      .eq('id', session.studentId);

    // 9. Snapshot the initial model state
    await StudentModelService.snapshotModel(session.studentId, 'initial_diagnostic');

    return mapDiagnosticSessionRow(updated);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static async selectQuestionsForSubject(
    subjectId: string,
    gradeId: string | null,
    boardId: string | null
  ): Promise<DiagnosticQuestion[]> {
    const questions: DiagnosticQuestion[] = [];

    for (const difficulty of this.DIFFICULTY_DISTRIBUTION) {
      let q = supabase
        .from('questions')
        .select(`
          id, subject_id, curriculum_node_id, concept_id,
          question_text, question_type, difficulty_level,
          question_options(id, option_key, option_text),
          curriculum_nodes(title)
        `)
        .eq('subject_id', subjectId)
        .eq('difficulty_level', difficulty)
        .eq('is_verified', true)
        .limit(1);

      // Avoid duplicate questions
      const existingIds = questions.map((q) => q.questionId);
      if (existingIds.length > 0) {
        q = q.not('id', 'in', `(${existingIds.join(',')})`);
      }

      const { data } = await q;
      if (data && data.length > 0) {
        const row = data[0] as any;
        questions.push({
          questionId: row.id,
          curriculumNodeId: row.curriculum_node_id || '',
          conceptId: row.concept_id || undefined,
          subjectId: row.subject_id,
          questionText: row.question_text,
          questionType: row.question_type,
          difficultyLevel: row.difficulty_level,
          options: (row.question_options || []).map((o: any) => ({
            id: o.id,
            optionKey: o.option_key,
            optionText: o.option_text,
          })),
          topicTitle: row.curriculum_nodes?.title,
        });
      }
    }

    return questions;
  }

  private static analyzeResults(
    answered: Array<{
      question: DiagnosticQuestion;
      answer: any;
      isCorrect: boolean;
    }>,
    subjectIds: string[]
  ): DiagnosticResult[] {
    const results: DiagnosticResult[] = [];

    for (const subjectId of subjectIds) {
      const subjectAnswers = answered.filter((a) => a.question.subjectId === subjectId);

      const totalQuestions = subjectAnswers.length;
      const correctCount = subjectAnswers.filter((a) => a.isCorrect).length;
      const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;

      // Confidence is proportional to sample size but capped low for diagnostics
      const confidenceLevel = Math.min(0.6, 0.2 + (totalQuestions / 10) * 0.4);

      const topicBreakdown = subjectAnswers.map((a) => ({
        nodeId: a.question.curriculumNodeId,
        title: a.question.topicTitle || 'Unknown topic',
        correct: a.isCorrect,
        difficulty: a.question.difficultyLevel,
      }));

      // Identify strengths: topics answered correctly at medium/hard
      const strengths = subjectAnswers
        .filter((a) => a.isCorrect && ['medium', 'hard'].includes(a.question.difficultyLevel))
        .map((a) => a.question.topicTitle || '')
        .filter(Boolean);

      // Identify weaknesses: topics answered incorrectly
      const weaknesses = subjectAnswers
        .filter((a) => !a.isCorrect)
        .map((a) => a.question.topicTitle || '')
        .filter(Boolean);

      results.push({
        subjectId,
        subjectName: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
        totalQuestions,
        correctCount,
        accuracy: Math.round(accuracy * 1000) / 1000,
        strengths: [...new Set(strengths)],
        weaknesses: [...new Set(weaknesses)],
        confidenceLevel,
        topicBreakdown,
      });
    }

    return results;
  }
}

// =============================================================================
// Row Mapper
// =============================================================================

function mapDiagnosticSessionRow(row: any): DiagnosticSession {
  return {
    id: row.id,
    studentId: row.student_id,
    status: row.status,
    subjectIds: row.subject_ids || [],
    questions: row.questions || [],
    answers: row.answers || null,
    results: row.results || null,
    totalQuestions: Number(row.total_questions) || 0,
    totalCorrect: Number(row.total_correct) || 0,
    totalTimeSeconds: Number(row.total_time_seconds) || 0,
    confidenceLevel: Number(row.confidence_level) || 0.5,
    strengths: row.strengths || [],
    weaknesses: row.weaknesses || [],
    startedAt: row.started_at || null,
    completedAt: row.completed_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
