import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import type {
  RecordEvidenceInput,
  GetStatesQueryInput,
  RecalculateInput,
} from './student-model.schema';
import type {
  KnowledgeState,
  EvidenceLog,
  StudentModelSummary,
  SubjectMasterySummary,
} from '@sharpmind/types';
import {
  recomputeStateFromEvidence,
  computeRetention,
  computeNextReviewDate,
  type EvidenceRecord,
} from './student-model.rules';

// =============================================================================
// StudentModelService — Core service for reading/writing Student Model state
// All writes go through recordEvidence() → deterministic rules → state update
// =============================================================================

export class StudentModelService {
  // ---------------------------------------------------------------------------
  // Read Operations
  // ---------------------------------------------------------------------------

  /** Get all knowledge states for a student, with optional filters */
  public static async getKnowledgeStates(
    studentId: string,
    filters: GetStatesQueryInput
  ): Promise<{ states: KnowledgeState[]; total: number }> {
    let q = supabase
      .from('student_knowledge_states')
      .select('*, curriculum_nodes!inner(title, subject_id)', { count: 'exact' })
      .eq('student_id', studentId)
      .order('mastery_score', { ascending: true });

    if (filters.status) q = q.eq('status', filters.status);
    if (filters.subjectId) q = q.eq('curriculum_nodes.subject_id', filters.subjectId);

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    const { data, count, error } = await q.range(from, to);
    if (error) throw new BadRequestError(`Failed to fetch knowledge states: ${error.message}`);

    return {
      states: (data || []).map(mapKnowledgeStateRow),
      total: count || 0,
    };
  }

  /** Get a single knowledge state by student + curriculum node */
  public static async getKnowledgeState(
    studentId: string,
    nodeId: string
  ): Promise<KnowledgeState | null> {
    const { data, error } = await supabase
      .from('student_knowledge_states')
      .select('*')
      .eq('student_id', studentId)
      .eq('curriculum_node_id', nodeId)
      .maybeSingle();

    if (error) throw new BadRequestError(`Failed to fetch knowledge state: ${error.message}`);
    if (!data) return null;

    return mapKnowledgeStateRow(data);
  }

  /** Get evidence log history for a student, optionally filtered by node/concept */
  public static async getEvidenceLogs(
    studentId: string,
    opts: { curriculumNodeId?: string; conceptId?: string; limit?: number }
  ): Promise<EvidenceLog[]> {
    let q = supabase
      .from('evidence_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (opts.curriculumNodeId) q = q.eq('curriculum_node_id', opts.curriculumNodeId);
    if (opts.conceptId) q = q.eq('concept_id', opts.conceptId);

    const limit = opts.limit || 100;
    q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw new BadRequestError(`Failed to fetch evidence logs: ${error.message}`);

    return (data || []).map(mapEvidenceLogRow);
  }

  /** Get aggregated model summary per subject */
  public static async getModelSummary(studentId: string): Promise<StudentModelSummary> {
    // Fetch all knowledge states for this student with curriculum node info
    const { data: states, error } = await supabase
      .from('student_knowledge_states')
      .select('*, curriculum_nodes(title, subject_id, subjects(name))')
      .eq('student_id', studentId);

    if (error) throw new BadRequestError(`Failed to build model summary: ${error.message}`);

    // Count total evidence
    const { count: totalEvidence } = await supabase
      .from('evidence_logs')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId);

    // Latest activity
    const { data: latestEvidence } = await supabase
      .from('evidence_logs')
      .select('created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const rows = states || [];
    const bySubject = new Map<string, typeof rows>();

    for (const row of rows) {
      const subjectId = (row as any).curriculum_nodes?.subject_id || 'unknown';
      if (!bySubject.has(subjectId)) bySubject.set(subjectId, []);
      bySubject.get(subjectId)!.push(row);
    }

    const subjectSummaries: SubjectMasterySummary[] = [];
    let overallMastery = 0;
    let overallRetention = 0;
    let overallUncertainty = 0;
    let subjectCount = 0;

    for (const [subjectId, subjectStates] of bySubject) {
      const subjectName = (subjectStates[0] as any)?.curriculum_nodes?.subjects?.name || subjectId;

      let totalMastery = 0;
      let totalRetention = 0;
      let totalUncertainty = 0;
      let masteredCount = 0;
      let inProgressCount = 0;
      let needsRevisionCount = 0;
      let notStartedCount = 0;

      const topicScores: Array<{ nodeId: string; title: string; mastery: number }> = [];

      for (const s of subjectStates) {
        const mastery = Number(s.mastery_score) || 0;
        const retention = computeRetention(s.last_practiced_at, Number(s.stability_days) || 1);
        const unc = Number(s.uncertainty) || 1;

        totalMastery += mastery;
        totalRetention += retention;
        totalUncertainty += unc;

        if (s.status === 'mastered') masteredCount++;
        else if (s.status === 'in_progress') inProgressCount++;
        else if (s.status === 'needs_revision') needsRevisionCount++;
        else notStartedCount++;

        topicScores.push({
          nodeId: s.curriculum_node_id,
          title: (s as any).curriculum_nodes?.title || '',
          mastery,
        });
      }

      const count = subjectStates.length || 1;
      const avgMastery = Math.round((totalMastery / count) * 100) / 100;
      const avgRetention = Math.round((totalRetention / count) * 1000) / 1000;
      const avgUncertainty = Math.round((totalUncertainty / count) * 1000) / 1000;

      const sorted = topicScores.sort((a, b) => a.mastery - b.mastery);

      subjectSummaries.push({
        subjectId,
        subjectName,
        avgMastery,
        avgRetention,
        avgUncertainty,
        totalNodes: subjectStates.length,
        masteredCount,
        inProgressCount,
        needsRevisionCount,
        notStartedCount,
        weakestTopics: sorted.slice(0, 3),
        strongestTopics: sorted.slice(-3).reverse(),
      });

      overallMastery += avgMastery;
      overallRetention += avgRetention;
      overallUncertainty += avgUncertainty;
      subjectCount++;
    }

    const sc = subjectCount || 1;

    return {
      studentId,
      overallMastery: Math.round((overallMastery / sc) * 100) / 100,
      overallRetention: Math.round((overallRetention / sc) * 1000) / 1000,
      overallUncertainty: Math.round((overallUncertainty / sc) * 1000) / 1000,
      totalEvidence: totalEvidence || 0,
      lastActivityAt: latestEvidence?.created_at || null,
      subjectSummaries,
      modelVersion: 1,
    };
  }

  // ---------------------------------------------------------------------------
  // Write Operations — Controlled mutation via evidence recording
  // ---------------------------------------------------------------------------

  /**
   * Record a new piece of evidence and update the corresponding knowledge state.
   * This is the ONLY sanctioned write path for Student Model state.
   */
  public static async recordEvidence(
    studentId: string,
    input: RecordEvidenceInput
  ): Promise<{ evidenceLog: EvidenceLog; updatedState: KnowledgeState | null }> {
    // 1. Validate the student exists
    const { data: studentProfile } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('id', studentId)
      .maybeSingle();

    // 2. Idempotency check: if sourceRefId is provided, avoid duplicate evidence insertion
    if (input.sourceRefId) {
      const { data: existingEv } = await supabase
        .from('evidence_logs')
        .select('*')
        .eq('student_id', studentId)
        .eq('source_ref_id', input.sourceRefId)
        .maybeSingle();

      if (existingEv) {
        return {
          evidenceLog: mapEvidenceLogRow(existingEv),
          updatedState: null,
        };
      }
    }

    // 3. Insert immutable evidence log
    const evidencePayload = {
      student_id: studentId,
      curriculum_node_id: input.curriculumNodeId || null,
      concept_id: input.conceptId || null,
      evidence_type: input.evidenceType,
      source_ref_id: input.sourceRefId || null,
      question_id: input.questionId || null,
      score_or_performance: input.scoreOrPerformance ?? null,
      is_correct: input.isCorrect ?? null,
      time_taken_seconds: input.timeTakenSeconds ?? null,
      confidence_self_report: input.confidenceSelfReport ?? null,
      difficulty_level: input.difficultyLevel ?? null,
      session_type: input.sessionType ?? null,
      provenance_source: input.provenanceSource || 'system',
      payload: input.payload || {},
    };

    const { data: evidenceRow, error: evError } = await supabase
      .from('evidence_logs')
      .insert(evidencePayload)
      .select('*')
      .single();

    if (evError || !evidenceRow) {
      throw new BadRequestError(`Failed to record evidence: ${evError?.message}`);
    }

    // 3. If we have a curriculum node, update the knowledge state
    let updatedState: KnowledgeState | null = null;
    if (input.curriculumNodeId) {
      updatedState = await this.updateKnowledgeStateFromEvidence(
        studentId,
        input.curriculumNodeId
      );
    }

    return {
      evidenceLog: mapEvidenceLogRow(evidenceRow),
      updatedState,
    };
  }

  /**
   * Recalculate a knowledge state from full evidence history.
   * Used for corrections and periodic recalibration.
   */
  public static async recalculateState(
    studentId: string,
    input: RecalculateInput
  ): Promise<KnowledgeState> {
    const nodeId = input.nodeId;
    if (!nodeId) {
      throw new BadRequestError('nodeId is required for recalculation (concept-level coming soon)');
    }

    return this.updateKnowledgeStateFromEvidence(studentId, nodeId);
  }

  /** Create a snapshot of the full model for audit/rollback */
  public static async snapshotModel(
    studentId: string,
    reason: string = 'manual'
  ): Promise<void> {
    const { data: states } = await supabase
      .from('student_knowledge_states')
      .select('*')
      .eq('student_id', studentId);

    const { error } = await supabase
      .from('student_model_snapshots')
      .insert({
        student_id: studentId,
        snapshot_data: { states: states || [], timestamp: new Date().toISOString() },
        model_version: 1,
        trigger_reason: reason,
      });

    if (error) throw new BadRequestError(`Failed to create snapshot: ${error.message}`);
  }

  // ---------------------------------------------------------------------------
  // Internal: State Update Pipeline
  // ---------------------------------------------------------------------------

  private static async updateKnowledgeStateFromEvidence(
    studentId: string,
    curriculumNodeId: string
  ): Promise<KnowledgeState> {
    // Fetch all evidence for this student+node
    const { data: evidenceLogs, error: evError } = await supabase
      .from('evidence_logs')
      .select('*')
      .eq('student_id', studentId)
      .eq('curriculum_node_id', curriculumNodeId)
      .order('created_at', { ascending: true });

    if (evError) throw new BadRequestError(`Failed to fetch evidence: ${evError.message}`);

    const evidence: EvidenceRecord[] = (evidenceLogs || []).map((e: any) => ({
      isCorrect: e.is_correct,
      timeTakenSeconds: e.time_taken_seconds,
      scoreOrPerformance: e.score_or_performance,
      difficultyLevel: e.difficulty_level,
      createdAt: e.created_at,
      confidenceSelfReport: e.confidence_self_report,
    }));

    // Get existing state for current stability
    const { data: existingState } = await supabase
      .from('student_knowledge_states')
      .select('stability_days, model_version')
      .eq('student_id', studentId)
      .eq('curriculum_node_id', curriculumNodeId)
      .maybeSingle();

    const currentStability = existingState ? Number(existingState.stability_days) : 1.0;
    const currentVersion = existingState ? Number(existingState.model_version) : 0;

    // Recompute state from evidence using deterministic rules
    const newState = recomputeStateFromEvidence(evidence, currentStability, currentVersion);

    // Upsert the knowledge state
    const statePayload = {
      student_id: studentId,
      curriculum_node_id: curriculumNodeId,
      mastery_score: newState.masteryScore,
      confidence_score: newState.confidenceScore,
      p_know: newState.pKnow,
      p_forget: newState.pForget,
      stability_days: newState.stabilityDays,
      total_questions_attempted: newState.totalQuestionsAttempted,
      total_correct: newState.totalCorrect,
      evidence_count: newState.evidenceCount,
      streak_correct: newState.streakCorrect,
      streak_incorrect: newState.streakIncorrect,
      avg_time_seconds: newState.avgTimeSeconds,
      last_practiced_at: newState.lastEvidenceAt,
      last_evidence_at: newState.lastEvidenceAt,
      next_recommended_review_at: newState.nextRecommendedReviewAt,
      status: newState.status,
      uncertainty: newState.uncertainty,
      model_version: newState.modelVersion,
      inferred_at: newState.inferredAt,
    };

    const { data: upserted, error: upsertError } = await supabase
      .from('student_knowledge_states')
      .upsert(statePayload, { onConflict: 'student_id,curriculum_node_id' })
      .select('*')
      .single();

    if (upsertError || !upserted) {
      throw new BadRequestError(`Failed to update knowledge state: ${upsertError?.message}`);
    }

    return mapKnowledgeStateRow(upserted);
  }
}

// =============================================================================
// Row Mappers (DB snake_case → domain camelCase)
// =============================================================================

function mapKnowledgeStateRow(row: any): KnowledgeState {
  return {
    id: row.id,
    studentId: row.student_id,
    curriculumNodeId: row.curriculum_node_id,
    conceptId: row.concept_id || null,
    masteryScore: Number(row.mastery_score) || 0,
    confidenceScore: Number(row.confidence_score) || 0,
    pKnow: Number(row.p_know) || 0,
    pForget: Number(row.p_forget) || 0,
    stabilityDays: Number(row.stability_days) || 1,
    totalQuestionsAttempted: Number(row.total_questions_attempted) || 0,
    totalCorrect: Number(row.total_correct) || 0,
    evidenceCount: Number(row.evidence_count) || 0,
    streakCorrect: Number(row.streak_correct) || 0,
    streakIncorrect: Number(row.streak_incorrect) || 0,
    avgTimeSeconds: row.avg_time_seconds ? Number(row.avg_time_seconds) : null,
    lastPracticedAt: row.last_practiced_at || null,
    lastEvidenceAt: row.last_evidence_at || null,
    nextRecommendedReviewAt: row.next_recommended_review_at || null,
    status: row.status || 'not_started',
    uncertainty: Number(row.uncertainty) ?? 1,
    modelVersion: Number(row.model_version) || 1,
    inferredAt: row.inferred_at || row.updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvidenceLogRow(row: any): EvidenceLog {
  return {
    id: row.id,
    studentId: row.student_id,
    curriculumNodeId: row.curriculum_node_id || null,
    conceptId: row.concept_id || null,
    evidenceType: row.evidence_type,
    sourceRefId: row.source_ref_id || null,
    questionId: row.question_id || null,
    scoreOrPerformance: row.score_or_performance ? Number(row.score_or_performance) : null,
    isCorrect: row.is_correct,
    timeTakenSeconds: row.time_taken_seconds ? Number(row.time_taken_seconds) : null,
    confidenceSelfReport: row.confidence_self_report ? Number(row.confidence_self_report) : null,
    difficultyLevel: row.difficulty_level || null,
    sessionType: row.session_type || null,
    provenanceSource: row.provenance_source || 'system',
    payload: row.payload || {},
    createdAt: row.created_at,
  };
}
