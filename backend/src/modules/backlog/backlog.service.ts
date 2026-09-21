import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import type { GetBacklogQueryInput } from './backlog.schema';
import type { BacklogItem, BacklogSummary } from '@sharpmind/types';
import { computeRetention } from '../student-model/student-model.rules';
import {
  classifyBacklogItem,
  computePriorityScore,
  rankBacklogItems,
  MAX_BACKLOG_ITEMS,
  DEFAULT_PRIORITY_WEIGHTS,
} from './backlog.rules';

// =============================================================================
// BacklogService — Generates and maintains the adaptive prioritized backlog
// =============================================================================

export class BacklogService {
  /**
   * Generate or refresh the backlog for a student.
   * Scans enrolled curriculum nodes, joins with knowledge states,
   * classifies and scores each item, then upserts into backlog_items.
   */
  public static async generateBacklog(studentId: string): Promise<BacklogSummary> {
    // 1. Fetch student profile for enrolled subjects and exam targets
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('enrolled_subjects, target_exam_goals, daily_available_hours')
      .eq('id', studentId)
      .maybeSingle();

    if (!profile) throw new NotFoundError('Student profile not found');

    const enrolledSubjects = (profile.enrolled_subjects as string[]) || [];
    const examGoals = profile.target_exam_goals as any[] || [];
    const examDeadline = this.getEarliestExamDeadline(examGoals);

    // 2. Fetch curriculum nodes (chapters and topics) for enrolled subjects
    const { data: nodes } = await supabase
      .from('curriculum_nodes')
      .select('id, title, subject_id, weightage_percent, node_type, sequence_order')
      .in('subject_id', enrolledSubjects.length > 0 ? enrolledSubjects : ['_none_'])
      .in('node_type', ['chapter', 'topic'])
      .eq('status', 'active')
      .order('sequence_order', { ascending: true })
      .limit(MAX_BACKLOG_ITEMS);

    if (!nodes || nodes.length === 0) {
      return { totalItems: 0, unstarted: 0, inProgress: 0, weak: 0, revisionDue: 0, overdue: 0, atRisk: 0, topPriorities: [] };
    }

    // 3. Fetch all knowledge states for this student
    const { data: knowledgeStates } = await supabase
      .from('student_knowledge_states')
      .select('curriculum_node_id, mastery_score, stability_days, last_practiced_at, next_recommended_review_at, evidence_count, total_correct, total_questions_attempted, status')
      .eq('student_id', studentId);

    const stateMap = new Map<string, any>();
    for (const ks of (knowledgeStates || [])) {
      stateMap.set(ks.curriculum_node_id, ks);
    }

    // 4. Compute days until exam
    const daysUntilExam = examDeadline
      ? Math.max(0, Math.round((examDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

    // 5. Classify and score each node
    const backlogItems: Array<{
      curriculum_node_id: string;
      title: string;
      subject_id: string;
      classification: string;
      priority_score: number;
      priority_reasons: any[];
      deadline: string | null;
      estimated_minutes: number;
    }> = [];

    for (const node of nodes) {
      const ks = stateMap.get(node.id);

      const evidenceCount = ks ? Number(ks.evidence_count) : 0;
      const masteryScore = ks ? Number(ks.mastery_score) : 0;
      const stability = ks ? Number(ks.stability_days) : 1;
      const lastPracticedAt = ks?.last_practiced_at || null;
      const nextReview = ks?.next_recommended_review_at || null;
      const totalAttempted = ks ? Number(ks.total_questions_attempted) : 0;
      const totalCorrect = ks ? Number(ks.total_correct) : 0;

      const retention = computeRetention(lastPracticedAt, stability);
      const accuracy = totalAttempted > 0 ? totalCorrect / totalAttempted : 0;
      const daysSincePractice = lastPracticedAt
        ? Math.round((Date.now() - new Date(lastPracticedAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const classification = classifyBacklogItem({
        evidenceCount,
        masteryScore,
        retention,
        lastPracticedAt,
        nextReviewDate: nextReview,
        daysUntilExam,
      });

      const { score, reasons } = computePriorityScore(
        {
          examProximityDays: daysUntilExam,
          weightagePercent: Number(node.weightage_percent) || 0,
          masteryScore,
          prerequisiteCount: 0, // Could be enriched with graph data
          retention,
          accuracy,
          daysSinceLastPractice: daysSincePractice,
        },
        DEFAULT_PRIORITY_WEIGHTS
      );

      backlogItems.push({
        curriculum_node_id: node.id,
        title: node.title,
        subject_id: node.subject_id,
        classification,
        priority_score: score,
        priority_reasons: reasons,
        deadline: examDeadline ? examDeadline.toISOString().split('T')[0] : null,
        estimated_minutes: node.node_type === 'chapter' ? 90 : 45,
      });
    }

    // 6. Rank items
    const ranked = rankBacklogItems(backlogItems.map((item) => ({
      ...item,
      priorityScore: item.priority_score,
      deadline: item.deadline,
    })));

    // 7. Deactivate old backlog items and insert new ones
    await supabase
      .from('backlog_items')
      .update({ is_active: false })
      .eq('student_id', studentId)
      .eq('is_active', true);

    // 8. Insert ranked items
    const insertPayloads = ranked.map((item, index) => ({
      student_id: studentId,
      curriculum_node_id: item.curriculum_node_id,
      title: item.title,
      classification: item.classification,
      priority_score: item.priority_score,
      priority_rank: index + 1,
      priority_reasons: item.priority_reasons,
      deadline: item.deadline,
      estimated_minutes: item.estimated_minutes,
      subject_id: item.subject_id,
      is_active: true,
    }));

    if (insertPayloads.length > 0) {
      await supabase.from('backlog_items').insert(insertPayloads);
    }

    // 9. Build summary
    return this.buildSummary(studentId);
  }

  /**
   * Get the current backlog for a student (already generated).
   */
  public static async getBacklog(
    studentId: string,
    filters: GetBacklogQueryInput
  ): Promise<{ items: BacklogItem[]; total: number; summary: BacklogSummary }> {
    let q = supabase
      .from('backlog_items')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId)
      .eq('is_active', true)
      .order('priority_rank', { ascending: true });

    if (filters.classification) q = q.eq('classification', filters.classification);
    if (filters.subjectId) q = q.eq('subject_id', filters.subjectId);

    const from = (filters.page - 1) * filters.limit;
    const to = from + filters.limit - 1;

    const { data, count, error } = await q.range(from, to);
    if (error) throw new BadRequestError(`Failed to fetch backlog: ${error.message}`);

    const items = (data || []).map(mapBacklogItemRow);
    const summary = await this.buildSummary(studentId);

    return { items, total: count || 0, summary };
  }

  /**
   * Get a single backlog item with full detail.
   */
  public static async getBacklogItem(itemId: string): Promise<BacklogItem> {
    const { data, error } = await supabase
      .from('backlog_items')
      .select('*')
      .eq('id', itemId)
      .maybeSingle();

    if (error) throw new BadRequestError(`Failed to fetch item: ${error.message}`);
    if (!data) throw new NotFoundError('Backlog item not found');

    return mapBacklogItemRow(data);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static async buildSummary(studentId: string): Promise<BacklogSummary> {
    const { data: items } = await supabase
      .from('backlog_items')
      .select('classification, priority_score')
      .eq('student_id', studentId)
      .eq('is_active', true);

    const all = items || [];

    const counts = { unstarted: 0, in_progress: 0, weak: 0, revision_due: 0, overdue: 0, at_risk: 0 };
    for (const item of all) {
      const cls = item.classification as keyof typeof counts;
      if (cls in counts) counts[cls]++;
    }

    // Top 5 priorities
    const { data: topItems } = await supabase
      .from('backlog_items')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .order('priority_rank', { ascending: true })
      .limit(5);

    return {
      totalItems: all.length,
      unstarted: counts.unstarted,
      inProgress: counts.in_progress,
      weak: counts.weak,
      revisionDue: counts.revision_due,
      overdue: counts.overdue,
      atRisk: counts.at_risk,
      topPriorities: (topItems || []).map(mapBacklogItemRow),
    };
  }

  private static getEarliestExamDeadline(examGoals: any[]): Date | null {
    if (!examGoals || examGoals.length === 0) return null;

    // Try to extract exam dates from goals
    for (const goal of examGoals) {
      if (goal.targetDate) return new Date(goal.targetDate);
      if (goal.targetYear) {
        // Default exam month: April of target year
        return new Date(`${goal.targetYear}-04-15`);
      }
    }

    return null;
  }
}

// =============================================================================
// Row Mapper
// =============================================================================

function mapBacklogItemRow(row: any): BacklogItem {
  return {
    id: row.id,
    studentId: row.student_id,
    curriculumNodeId: row.curriculum_node_id || null,
    conceptId: row.concept_id || null,
    title: row.title,
    classification: row.classification,
    priorityScore: Number(row.priority_score) || 0,
    priorityRank: Number(row.priority_rank) || 0,
    priorityReasons: row.priority_reasons || [],
    deadline: row.deadline || null,
    estimatedMinutes: Number(row.estimated_minutes) || 45,
    subjectId: row.subject_id || null,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
