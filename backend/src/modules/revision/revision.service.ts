import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import type {
  RevisionItem,
  RevisionEvent,
  RevisionDueSummary,
} from '@sharpmind/types';
import type {
  CreateRevisionSessionInput,
  CompleteRevisionInput,
} from './revision.schema';
import { StudentModelService } from '../student-model/student-model.service';
import {
  computeRevisionUrgency,
  selectRevisionType,
  updateRevisionSchedule,
  computeRetentionDecay,
  SM2_INITIAL_EASE,
} from './revision.rules';

// =============================================================================
// RevisionService — Spaced repetition + intelligent revision management
// =============================================================================

export class RevisionService {
  /**
   * Get items due for revision with urgency scoring.
   */
  public static async getDueRevisions(
    studentId: string,
    subjectId?: string,
    limit: number = 50
  ): Promise<RevisionDueSummary> {
    const today = new Date().toISOString().split('T')[0];

    let q = supabase
      .from('revision_items')
      .select('*, curriculum_nodes(title, subject_id)')
      .eq('student_id', studentId)
      .in('status', ['due', 'reviewed'])
      .lte('due_date', today)
      .order('due_date', { ascending: true })
      .limit(limit);

    if (subjectId) {
      q = q.eq('curriculum_nodes.subject_id', subjectId);
    }

    const { data, error } = await q;
    if (error) throw new BadRequestError(`Failed to fetch due revisions: ${error.message}`);

    // Also count upcoming items
    const { count: dueThisWeekCount } = await supabase
      .from('revision_items')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .in('status', ['due', 'reviewed'])
      .lte('due_date', this.getDateDaysFromNow(7));

    // Enrich each item with retention and urgency
    const items: RevisionItem[] = [];
    let overdueCount = 0;
    let dueTodayCount = 0;

    for (const row of (data || [])) {
      const retention = computeRetentionDecay(row.last_reviewed_at, Number(row.interval_days));
      const daysOverdue = Math.max(0,
        Math.round((Date.now() - new Date(row.due_date).getTime()) / (1000 * 60 * 60 * 24))
      );

      if (daysOverdue > 0) overdueCount++;
      if (row.due_date === today) dueTodayCount++;

      const urgency = computeRevisionUrgency({
        retention,
        masteryScore: 50, // Default; could be enriched from knowledge state
        daysOverdue,
        daysUntilExam: null,
        mistakeCount: 0,
        curriculumImportance: 0,
      });

      const recommendedType = selectRevisionType(50, retention, 0, false);

      items.push({
        id: row.id,
        studentId: row.student_id,
        curriculumNodeId: row.curriculum_node_id,
        repetitionLevel: Number(row.repetition_level),
        easeFactor: Number(row.ease_factor),
        intervalDays: Number(row.interval_days),
        dueDate: row.due_date,
        lastReviewedAt: row.last_reviewed_at || null,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        topicTitle: (row as any).curriculum_nodes?.title,
        subjectId: (row as any).curriculum_nodes?.subject_id,
        currentRetention: retention,
        urgencyScore: urgency,
        recommendedType,
      });
    }

    // Sort by urgency (highest first)
    items.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));

    return {
      totalDue: items.length,
      overdue: overdueCount,
      dueToday: dueTodayCount,
      dueThisWeek: dueThisWeekCount || 0,
      items,
    };
  }

  /**
   * Create a revision event (start a revision session).
   */
  public static async createRevisionEvent(
    studentId: string,
    input: CreateRevisionSessionInput
  ): Promise<RevisionEvent> {
    // Find or compute retention before revision
    let retentionBefore: number | null = null;
    if (input.curriculumNodeId) {
      const { data: revItem } = await supabase
        .from('revision_items')
        .select('last_reviewed_at, interval_days')
        .eq('student_id', studentId)
        .eq('curriculum_node_id', input.curriculumNodeId)
        .maybeSingle();

      if (revItem) {
        retentionBefore = computeRetentionDecay(revItem.last_reviewed_at, Number(revItem.interval_days));
      }
    }

    const { data, error } = await supabase
      .from('revision_events')
      .insert({
        student_id: studentId,
        curriculum_node_id: input.curriculumNodeId || null,
        concept_id: input.conceptId || null,
        revision_type: input.revisionType,
        retention_before: retentionBefore,
      })
      .select('*')
      .single();

    if (error || !data) throw new BadRequestError(`Failed to create revision event: ${error?.message}`);

    return mapRevisionEventRow(data);
  }

  /**
   * Complete a revision event — record outcome, update SM-2 schedule,
   * record evidence in Student Model (feedback loop).
   */
  public static async completeRevision(
    eventId: string,
    input: CompleteRevisionInput
  ): Promise<RevisionEvent> {
    // 1. Fetch the event
    const { data: event, error: fetchError } = await supabase
      .from('revision_events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle();

    if (fetchError || !event) throw new NotFoundError('Revision event not found');

    // 2. Update the revision item's SM-2 schedule
    if (event.curriculum_node_id) {
      const { data: revItem } = await supabase
        .from('revision_items')
        .select('*')
        .eq('student_id', event.student_id)
        .eq('curriculum_node_id', event.curriculum_node_id)
        .maybeSingle();

      if (revItem) {
        const sm2Result = updateRevisionSchedule({
          currentEaseFactor: Number(revItem.ease_factor) || SM2_INITIAL_EASE,
          currentInterval: Number(revItem.interval_days) || 1,
          currentRepetition: Number(revItem.repetition_level) || 0,
          outcome: input.outcome,
        });

        await supabase
          .from('revision_items')
          .update({
            ease_factor: sm2Result.newEaseFactor,
            interval_days: sm2Result.newInterval,
            repetition_level: sm2Result.newRepetition,
            due_date: sm2Result.nextDueDate.toISOString().split('T')[0],
            last_reviewed_at: new Date().toISOString(),
            status: sm2Result.newRepetition >= 5 ? 'graduated' : 'reviewed',
          })
          .eq('id', revItem.id);
      } else {
        // Create revision item if it doesn't exist
        const sm2Result = updateRevisionSchedule({
          currentEaseFactor: SM2_INITIAL_EASE,
          currentInterval: 1,
          currentRepetition: 0,
          outcome: input.outcome,
        });

        await supabase.from('revision_items').insert({
          student_id: event.student_id,
          curriculum_node_id: event.curriculum_node_id,
          ease_factor: sm2Result.newEaseFactor,
          interval_days: sm2Result.newInterval,
          repetition_level: sm2Result.newRepetition,
          due_date: sm2Result.nextDueDate.toISOString().split('T')[0],
          last_reviewed_at: new Date().toISOString(),
          status: 'reviewed',
        });
      }
    }

    // 3. Compute retention after
    const retentionAfter = input.outcome === 'recalled' ? 1.0 :
                           input.outcome === 'partially_recalled' ? 0.6 : 0.2;

    // 4. Update the revision event
    const { data: updated, error: updateError } = await supabase
      .from('revision_events')
      .update({
        outcome: input.outcome,
        time_spent_seconds: input.timeSpentSeconds,
        retention_after: retentionAfter,
        questions_attempted: input.questionsAttempted,
        questions_correct: input.questionsCorrect,
        completed_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .select('*')
      .single();

    if (updateError || !updated) throw new BadRequestError(`Update failed: ${updateError?.message}`);

    // 5. Record evidence in Student Model (feedback loop!)
    const evidenceType = event.revision_type === 'active_recall' ? 'revision_recall' as const :
                         event.revision_type === 'practice_based' ? 'revision_practice' as const :
                         event.revision_type === 'flashcard' ? 'flashcard_review' as const :
                         event.revision_type === 'formula_revision' ? 'formula_review' as const :
                         'revision_drill' as const;

    await StudentModelService.recordEvidence(event.student_id, {
      curriculumNodeId: event.curriculum_node_id,
      conceptId: event.concept_id,
      evidenceType,
      sourceRefId: eventId,
      isCorrect: input.outcome === 'recalled',
      timeTakenSeconds: input.timeSpentSeconds,
      sessionType: 'revision',
      provenanceSource: 'revision_engine_v1',
      payload: {
        revisionType: event.revision_type,
        outcome: input.outcome,
        questionsAttempted: input.questionsAttempted,
        questionsCorrect: input.questionsCorrect,
      },
    });

    return mapRevisionEventRow(updated);
  }

  /**
   * Get revision history for a student.
   */
  public static async getHistory(
    studentId: string,
    limit: number = 50
  ): Promise<RevisionEvent[]> {
    const { data, error } = await supabase
      .from('revision_events')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new BadRequestError(`Failed to fetch history: ${error.message}`);
    return (data || []).map(mapRevisionEventRow);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private static getDateDaysFromNow(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }
}

// =============================================================================
// Row Mapper
// =============================================================================

function mapRevisionEventRow(row: any): RevisionEvent {
  return {
    id: row.id,
    studentId: row.student_id,
    curriculumNodeId: row.curriculum_node_id || null,
    conceptId: row.concept_id || null,
    revisionItemId: row.revision_item_id || null,
    revisionType: row.revision_type,
    outcome: row.outcome || null,
    timeSpentSeconds: Number(row.time_spent_seconds) || 0,
    retentionBefore: row.retention_before != null ? Number(row.retention_before) : null,
    retentionAfter: row.retention_after != null ? Number(row.retention_after) : null,
    questionsAttempted: Number(row.questions_attempted) || 0,
    questionsCorrect: Number(row.questions_correct) || 0,
    metadata: row.metadata || {},
    completedAt: row.completed_at || null,
    createdAt: row.created_at,
  };
}
