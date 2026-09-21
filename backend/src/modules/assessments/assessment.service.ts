// =============================================================================
// AssessmentService — Test Engine, Attempt State, Autosave & Submission
// =============================================================================

import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import { StudentModelService } from '../student-model/student-model.service';
import { sanitizeQuestionForActiveTest, validateAnswer } from '../questions/question.rules';
import { calculateAssessmentScore, calculateRemainingSeconds } from './assessment.rules';
import { analyzePostTestIntelligence } from './post-test.rules';
import type {
  CreateAssessmentInput,
  ListAssessmentsQueryInput,
  AutosaveAnswerInput,
  SubmitAssessmentInput,
} from './assessment.schema';
import type {
  Assessment,
  ActiveTestSession,
  AssessmentSubmission,
  AssessmentAnswerItem,
  QuestionAnswerStatus,
  Question,
} from '@sharpmind/types';

export class AssessmentService {
  /**
   * List assessments by filter
   */
  public static async listAssessments(filters: ListAssessmentsQueryInput) {
    let q = supabase
      .from('assessments')
      .select('*, assessment_questions(count)', { count: 'exact' })
      .eq('is_published', true);

    if (filters.type) q = q.eq('type', filters.type);
    if (filters.subjectId) q = q.eq('subject_id', filters.subjectId);
    if (filters.targetExamId) q = q.eq('target_exam_id', filters.targetExamId);

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    const { data, count, error } = await q
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new BadRequestError(error.message);

    const assessments = (data || []).map((row: any) => ({
      ...row,
      durationMinutes: row.duration_minutes,
      totalMarks: row.total_marks,
      passingMarks: row.passing_marks,
      markingScheme: row.marking_scheme,
      difficultyDistribution: row.difficulty_distribution,
      sectionsConfig: row.sections_config || [],
      isAdaptive: row.is_adaptive,
      isPublished: row.is_published,
      totalQuestions: row.assessment_questions?.[0]?.count || 0,
    }));

    return { assessments, total: count || 0 };
  }

  /**
   * Get an assessment by ID
   */
  public static async getAssessmentById(id: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*, assessment_questions(*, questions(*, question_options(*)))')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new BadRequestError(error.message);
    if (!data) throw new NotFoundError('Assessment not found');

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type,
      targetExamId: data.target_exam_id,
      subjectId: data.subject_id,
      durationMinutes: data.duration_minutes,
      totalMarks: data.total_marks,
      passingMarks: data.passing_marks,
      markingScheme: data.marking_scheme,
      difficultyDistribution: data.difficulty_distribution,
      sectionsConfig: data.sections_config || [],
      isAdaptive: data.is_adaptive,
      isPublished: data.is_published,
      totalQuestions: data.assessment_questions?.length || 0,
    };
  }

  /**
   * Create a new assessment
   */
  public static async createAssessment(input: CreateAssessmentInput): Promise<Assessment> {
    const { data: assessment, error } = await supabase
      .from('assessments')
      .insert({
        title: input.title,
        description: input.description,
        type: input.type,
        target_exam_id: input.targetExamId || null,
        subject_id: input.subjectId || null,
        duration_minutes: input.durationMinutes,
        total_marks: input.totalMarks,
        passing_marks: input.passingMarks || null,
        marking_scheme: input.markingScheme,
        difficulty_distribution: input.difficultyDistribution,
        sections_config: input.sectionsConfig,
        is_adaptive: input.isAdaptive,
        is_published: true,
      })
      .select('*')
      .single();

    if (error || !assessment) {
      throw new BadRequestError(`Failed to create assessment: ${error?.message}`);
    }

    // Link questions if provided
    if (input.questionIds && input.questionIds.length > 0) {
      const qRows = input.questionIds.map((qId, idx) => ({
        assessment_id: assessment.id,
        question_id: qId,
        sequence_order: idx + 1,
        marks_correct: input.markingScheme.correct,
        marks_incorrect: input.markingScheme.incorrect,
      }));

      await supabase.from('assessment_questions').insert(qRows);
    }

    return this.getAssessmentById(assessment.id);
  }

  /**
   * Start a live test attempt (Anti-leakage: questions are strictly sanitized)
   */
  public static async startTestAttempt(
    assessmentId: string,
    studentId: string
  ): Promise<ActiveTestSession> {
    const assessment = await this.getAssessmentById(assessmentId);

    // Fetch full questions for this assessment
    const { data: aqRows, error: aqErr } = await supabase
      .from('assessment_questions')
      .select('question_id, sequence_order, questions(*, question_options(*))')
      .eq('assessment_id', assessmentId)
      .order('sequence_order', { ascending: true });

    if (aqErr) throw new BadRequestError(aqErr.message);

    const questions: Question[] = (aqRows || []).map((row: any) => ({
      ...row.questions,
      options: row.questions.question_options || [],
    }));

    // If assessment has no pre-mapped questions, fetch sample questions for subject
    if (questions.length === 0 && assessment.subjectId) {
      const { data: sampleQuestions } = await supabase
        .from('questions')
        .select('*, question_options(*)')
        .eq('subject_id', assessment.subjectId)
        .limit(10);

      (sampleQuestions || []).forEach((row: any) => {
        questions.push({
          ...row,
          options: row.question_options || [],
        });
      });
    }

    // Create submission record
    const totalAllowedSeconds = assessment.durationMinutes * 60;
    const { data: submission, error: subErr } = await supabase
      .from('assessment_submissions')
      .insert({
        assessment_id: assessmentId,
        student_id: studentId,
        max_score: assessment.totalMarks,
        status: 'in_progress',
        time_remaining_seconds: totalAllowedSeconds,
        started_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (subErr || !submission) {
      throw new BadRequestError(`Failed to start test attempt: ${subErr?.message}`);
    }

    // Sanitize questions for client: strip correct answers, explanations, hints!
    const sanitizedQuestions = questions.map(sanitizeQuestionForActiveTest);

    return {
      submissionId: submission.id,
      assessment,
      questions: sanitizedQuestions,
      answersSoFar: {},
      timeRemainingSeconds: totalAllowedSeconds,
      startedAt: submission.started_at,
    };
  }

  /**
   * Autosave an answer during test
   */
  public static async autosaveAnswer(
    submissionId: string,
    studentId: string,
    input: AutosaveAnswerInput
  ) {
    const { data: submission } = await supabase
      .from('assessment_submissions')
      .select('id, student_id, status, started_at, assessment_id')
      .eq('id', submissionId)
      .single();

    if (!submission || submission.student_id !== studentId) {
      throw new NotFoundError('Active submission not found');
    }

    if (submission.status !== 'in_progress') {
      throw new BadRequestError('This test attempt has already been finalized.');
    }

    // Check if answer already exists
    const { data: existingAnswer } = await supabase
      .from('assessment_answers')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('question_id', input.questionId)
      .maybeSingle();

    if (existingAnswer) {
      await supabase
        .from('assessment_answers')
        .update({
          selected_options: input.selectedOptions || [],
          numerical_answer: input.numericalAnswer || null,
          time_spent_seconds: input.timeSpentSeconds,
        })
        .eq('id', existingAnswer.id);
    } else {
      await supabase.from('assessment_answers').insert({
        submission_id: submissionId,
        question_id: input.questionId,
        selected_options: input.selectedOptions || [],
        numerical_answer: input.numericalAnswer || null,
        time_spent_seconds: input.timeSpentSeconds,
      });
    }

    return { status: 'saved', questionId: input.questionId };
  }

  /**
   * Resume an active test attempt
   */
  public static async resumeTestAttempt(
    submissionId: string,
    studentId: string
  ): Promise<ActiveTestSession> {
    const { data: sub, error } = await supabase
      .from('assessment_submissions')
      .select('*, assessments(*)')
      .eq('id', submissionId)
      .single();

    if (error || !sub || sub.student_id !== studentId) {
      throw new NotFoundError('Active submission not found');
    }

    if (sub.status !== 'in_progress') {
      throw new BadRequestError('Test attempt is not in progress');
    }

    const assessment = await this.getAssessmentById(sub.assessment_id);
    const remainingSeconds = calculateRemainingSeconds(sub.started_at, assessment.durationMinutes);

    // Fetch questions
    const { data: aqRows } = await supabase
      .from('assessment_questions')
      .select('questions(*, question_options(*))')
      .eq('assessment_id', sub.assessment_id);

    const questions: Question[] = (aqRows || []).map((row: any) => ({
      ...row.questions,
      options: row.questions.question_options || [],
    }));

    // Fetch existing answers
    const { data: answerRows } = await supabase
      .from('assessment_answers')
      .select('*')
      .eq('submission_id', submissionId);

    const answersSoFar: Record<string, AssessmentAnswerItem> = {};
    (answerRows || []).forEach((row: any) => {
      answersSoFar[row.question_id] = {
        id: row.id,
        questionId: row.question_id,
        selectedOptions: row.selected_options || [],
        numericalAnswer: row.numerical_answer || null,
        timeSpentSeconds: row.time_spent_seconds || 0,
        status: 'answered',
      };
    });

    return {
      submissionId: sub.id,
      assessment,
      questions: questions.map(sanitizeQuestionForActiveTest),
      answersSoFar,
      timeRemainingSeconds: remainingSeconds,
      startedAt: sub.started_at,
    };
  }

  /**
   * Submit and finalize a test attempt
   */
  public static async submitTestAttempt(
    submissionId: string,
    studentId: string,
    input: SubmitAssessmentInput
  ): Promise<AssessmentSubmission> {
    const { data: sub, error: subErr } = await supabase
      .from('assessment_submissions')
      .select('*, assessments(*)')
      .eq('id', submissionId)
      .single();

    if (subErr || !sub || sub.student_id !== studentId) {
      throw new NotFoundError('Submission not found');
    }

    if (sub.status === 'completed') {
      const { data: existingAnswers } = await supabase
        .from('assessment_answers')
        .select('*')
        .eq('submission_id', submissionId);

      return {
        id: sub.id,
        assessmentId: sub.assessment_id,
        studentId: sub.student_id,
        totalScore: Number(sub.total_score || 0),
        maxScore: Number(sub.max_score || 0),
        accuracyPercentage: Number(sub.accuracy_percentage || 0),
        timeTakenSeconds: Number(sub.time_taken_seconds || 0),
        timeRemainingSeconds: 0,
        status: 'completed',
        startedAt: sub.started_at,
        completedAt: sub.completed_at,
        postTestAnalysis: sub.post_test_analysis,
        answers: (existingAnswers || []).map((a: any) => ({
          questionId: a.question_id,
          selectedOptions: a.selected_options || [],
          numericalAnswer: a.numerical_answer,
          isCorrect: a.is_correct,
          marksAwarded: a.marks_awarded,
          timeSpentSeconds: a.time_spent_seconds || 0,
          status: ((a.selected_options && a.selected_options.length > 0) || a.numerical_answer != null
            ? 'answered'
            : 'unanswered') as QuestionAnswerStatus,
        })),
      };
    }

    const assessment = await this.getAssessmentById(sub.assessment_id);

    // 1. Fetch full questions with answers & explanations
    const { data: aqRows } = await supabase
      .from('assessment_questions')
      .select('questions(*, question_options(*))')
      .eq('assessment_id', sub.assessment_id);

    let questions: Question[] = (aqRows || []).map((row: any) => ({
      ...row.questions,
      options: row.questions.question_options || [],
    }));

    if (questions.length === 0 && assessment.subjectId) {
      const { data: sampleQuestions } = await supabase
        .from('questions')
        .select('*, question_options(*)')
        .eq('subject_id', assessment.subjectId)
        .limit(10);

      questions = (sampleQuestions || []).map((row: any) => ({
        ...row,
        options: row.question_options || [],
      }));
    }

    const questionMap = new Map<string, Question>();
    const questionMarksMap: Record<string, number> = {};
    questions.forEach((q) => {
      questionMap.set(q.id, q);
      questionMarksMap[q.id] = q.marks || 4.0;
    });

    // 2. Evaluate answers
    const evaluatedAnswers: AssessmentAnswerItem[] = [];
    for (const ans of input.answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      const evalResult = validateAnswer(
        {
          question: q,
          selectedOptions: ans.selectedOptions,
          numericalAnswer: ans.numericalAnswer,
        },
        assessment.markingScheme
      );

      evaluatedAnswers.push({
        questionId: ans.questionId,
        selectedOptions: ans.selectedOptions,
        numericalAnswer: ans.numericalAnswer,
        isCorrect: evalResult.isCorrect,
        marksAwarded: evalResult.marksAwarded,
        timeSpentSeconds: ans.timeSpentSeconds,
        status: ans.status,
      });

      // Update or insert answer record
      await supabase.from('assessment_answers').upsert({
        submission_id: submissionId,
        question_id: ans.questionId,
        selected_options: ans.selectedOptions || [],
        numerical_answer: ans.numericalAnswer || null,
        is_correct: evalResult.isCorrect,
        marks_awarded: evalResult.marksAwarded,
        time_spent_seconds: ans.timeSpentSeconds,
      });
    }

    // 3. Compute overall assessment score
    const scoreResult = calculateAssessmentScore(assessment, evaluatedAnswers, questionMarksMap);

    // 4. Compute Post-Test Intelligence
    const postTestAnalysis = analyzePostTestIntelligence({
      answers: scoreResult.scoredAnswers,
      questions,
      totalScore: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      accuracyPercentage: scoreResult.accuracyPercentage,
      timeTakenSeconds: input.timeTakenSeconds,
    });

    // 5. Update submission record atomically (concurrency and rapid double-submit protection)
    const completedAt = new Date().toISOString();
    const { data: updatedSub, error: updateErr } = await supabase
      .from('assessment_submissions')
      .update({
        total_score: scoreResult.totalScore,
        max_score: scoreResult.maxScore,
        accuracy_percentage: scoreResult.accuracyPercentage,
        time_taken_seconds: input.timeTakenSeconds,
        status: 'completed',
        completed_at: completedAt,
        post_test_analysis: postTestAnalysis,
      })
      .eq('id', submissionId)
      .eq('status', 'in_progress')
      .select('*')
      .maybeSingle();

    if (updateErr) {
      throw new BadRequestError(`Failed to finalize submission: ${updateErr?.message}`);
    }

    if (!updatedSub) {
      // Already finalized concurrently or double submitted — return canonical completed state
      return this.submitTestAttempt(submissionId, studentId, input);
    }

    // 6. Feed validated evidence into Student Model
    for (const evaluated of scoreResult.scoredAnswers) {
      const q = questionMap.get(evaluated.questionId);
      if (!q) continue;

      await StudentModelService.recordEvidence(studentId, {
        curriculumNodeId: q.curriculumNodeId || undefined,
        conceptId: q.conceptId || undefined,
        evidenceType: 'assessment_submission',
        sourceRefId: `${submissionId}:${q.id}`,
        questionId: q.id,
        isCorrect: Boolean(evaluated.isCorrect),
        timeTakenSeconds: evaluated.timeSpentSeconds,
        difficultyLevel: q.difficultyLevel,
        sessionType: assessment.type,
        provenanceSource: 'assessment_v1',
        payload: {
          submissionId,
          assessmentTitle: assessment.title,
          selectedOptions: evaluated.selectedOptions,
          marksAwarded: evaluated.marksAwarded,
        },
      });
    }

    // 7. Record mistakes for all incorrect attempts
    const incorrectItems = scoreResult.scoredAnswers.filter(
      (a) => !a.isCorrect && ((a.selectedOptions && a.selectedOptions.length > 0) || a.numericalAnswer != null || (a.marksAwarded ?? 0) < 0)
    );
    for (const inc of incorrectItems) {
      const q = questionMap.get(inc.questionId);
      if (!q) continue;

      // Classify failure mode
      const isGuess = inc.timeSpentSeconds < 20;
      const isCalculation = q.questionType === 'numerical';
      const rootCause = isGuess
        ? 'time_pressure_rush'
        : isCalculation
        ? 'calculation_error'
        : 'conceptual_misunderstanding';

      // Avoid duplicate mistake insertion for the same submission and question
      const { data: existingMistake } = await supabase
        .from('mistakes')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('question_id', q.id)
        .maybeSingle();

      if (!existingMistake) {
        await supabase.from('mistakes').insert({
          student_id: studentId,
          question_id: q.id,
          submission_id: submissionId,
          curriculum_node_id: q.curriculumNodeId || null,
          mistake_type: rootCause,
          root_cause: rootCause,
          status: 'open',
          correction_state: 'unreviewed',
          attempt_count: 1,
          repetition_count: 1,
          student_answer_payload: {
            selectedOptions: inc.selectedOptions,
            numericalAnswer: inc.numericalAnswer,
          },
          correct_answer_payload: {
            explanation: q.explanation,
            correctOptions: q.options?.filter((o) => o.isCorrect),
          },
        });
      }
    }

    return {
      id: updatedSub.id,
      assessmentId: updatedSub.assessment_id,
      studentId: updatedSub.student_id,
      totalScore: Number(updatedSub.total_score),
      maxScore: Number(updatedSub.max_score),
      accuracyPercentage: Number(updatedSub.accuracy_percentage),
      timeTakenSeconds: Number(updatedSub.time_taken_seconds),
      timeRemainingSeconds: 0,
      status: 'completed',
      startedAt: updatedSub.started_at,
      completedAt: updatedSub.completed_at,
      postTestAnalysis,
      answers: scoreResult.scoredAnswers,
    };
  }
}
