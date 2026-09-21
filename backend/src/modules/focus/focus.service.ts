import { supabase } from '../../db/client';
import { NotFoundError, BadRequestError } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { StudentModelService } from '../student-model/student-model.service';
import { FocusRules } from './focus.rules';
import {
  StartSessionInput,
  LogInterruptionInput,
  CompleteSessionInput,
  ListSessionsQueryInput,
} from './focus.schema';
import { StudySession } from '@sharpmind/types';

export class FocusService {
  /**
   * Start a new focus study block
   */
  static async startSession(studentId: string, input: StartSessionInput): Promise<StudySession> {
    const payload = {
      student_id: studentId,
      objective: input.objective,
      target_duration_minutes: input.targetDurationMinutes || 25,
      actual_duration_seconds: 0,
      subject_id: input.subjectId || null,
      curriculum_node_id: input.curriculumNodeId || null,
      task_id: input.taskId || null,
      status: 'active',
      started_at: new Date().toISOString(),
      interruptions: 0,
      interruption_notes: [],
      reflection: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('study_sessions')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      logger.error({ error }, 'Failed to start study session');
      throw new BadRequestError(`Could not start study session: ${error?.message}`);
    }

    return this.mapSessionRow(data);
  }

  /**
   * Pause an active study session
   */
  static async pauseSession(sessionId: string, studentId: string): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .update({ status: 'paused', updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('student_id', studentId)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundError(`Active study session ${sessionId} not found`);
    }

    return this.mapSessionRow(data);
  }

  /**
   * Resume a paused study session
   */
  static async resumeSession(sessionId: string, studentId: string): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('student_id', studentId)
      .select('*')
      .single();

    if (error || !data) {
      throw new NotFoundError(`Paused study session ${sessionId} not found`);
    }

    return this.mapSessionRow(data);
  }

  /**
   * Log an intentional interruption
   */
  static async logInterruption(
    sessionId: string,
    studentId: string,
    input: LogInterruptionInput
  ): Promise<StudySession> {
    const { data: session, error: fetchErr } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (fetchErr || !session) {
      throw new NotFoundError(`Study session ${sessionId} not found`);
    }

    const currentNotes = Array.isArray(session.interruption_notes) ? session.interruption_notes : [];
    const newNote = {
      timestamp: new Date().toISOString(),
      reason: input.reason,
      durationSeconds: input.durationSeconds,
    };

    const { data: updated, error: updateErr } = await supabase
      .from('study_sessions')
      .update({
        interruptions: session.interruptions + 1,
        interruption_notes: [...currentNotes, newNote],
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select('*')
      .single();

    if (updateErr || !updated) {
      throw new BadRequestError(`Failed to record interruption: ${updateErr?.message}`);
    }

    return this.mapSessionRow(updated);
  }

  /**
   * Complete study session with post-session reflection and telemetry integration
   */
  static async completeSession(
    sessionId: string,
    studentId: string,
    input: CompleteSessionInput
  ): Promise<StudySession> {
    const { data: session, error: fetchErr } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (fetchErr || !session) {
      throw new NotFoundError(`Study session ${sessionId} not found`);
    }

    const endedAt = new Date().toISOString();
    const actualSeconds = input.actualDurationSeconds;

    const { data: updated, error: updateErr } = await supabase
      .from('study_sessions')
      .update({
        status: 'completed',
        actual_duration_seconds: actualSeconds,
        reflection: input.reflection || {},
        ended_at: endedAt,
        updated_at: endedAt,
      })
      .eq('id', sessionId)
      .select('*')
      .single();

    if (updateErr || !updated) {
      throw new BadRequestError(`Failed to finalize study session: ${updateErr?.message}`);
    }

    // Closed-loop integration with Student Model
    if (session.curriculum_node_id && actualSeconds >= 300) {
      try {
        const evidence = FocusRules.deriveStudentModelEvidence(
          session.curriculum_node_id,
          actualSeconds,
          input.reflection
        );

        await StudentModelService.recordEvidence(studentId, {
          curriculumNodeId: evidence.curriculumNodeId,
          evidenceType: 'self_assessment',
          scoreOrPerformance: Math.round(evidence.score * 100),
          confidenceSelfReport: input.reflection?.productivityScore || 3,
          sessionType: 'focus_block',
          provenanceSource: 'focus_mode_session',
          payload: evidence.metadata,
        });
      } catch (err: any) {
        logger.warn({ err: err.message }, 'Failed to record focus session evidence to Student Model');
      }
    }

    // Check-off linked planner task if objective was achieved
    if (session.task_id && input.reflection?.completedObjective) {
      try {
        await supabase
          .from('planner_tasks')
          .update({ status: 'completed', updated_at: endedAt })
          .eq('id', session.task_id)
          .eq('student_id', studentId);
      } catch (err: any) {
        logger.warn({ err: err.message }, 'Failed to mark linked planner task completed');
      }
    }

    return this.mapSessionRow(updated);
  }

  /**
   * List past study sessions with aggregated statistics
   */
  static async listSessions(
    studentId: string,
    query: ListSessionsQueryInput
  ): Promise<{
    sessions: StudySession[];
    total: number;
    stats: {
      totalHours: number;
      completedCount: number;
      abandonedCount: number;
      averageDurationMinutes: number;
      interruptionRate: number;
    };
  }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = supabase
      .from('study_sessions')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId)
      .order('started_at', { ascending: false });

    if (query.status) q = q.eq('status', query.status);
    if (query.subjectId) q = q.eq('subject_id', query.subjectId);

    const { data, count, error } = await q.range(from, to);

    if (error) {
      throw new BadRequestError(`Failed to fetch study sessions: ${error.message}`);
    }

    // Query all sessions for aggregate stats
    const { data: allSessions } = await supabase
      .from('study_sessions')
      .select('actual_duration_seconds, status, interruptions')
      .eq('student_id', studentId);

    const stats = FocusRules.aggregateSessionStats(
      (allSessions || []).map((s) => ({
        actualDurationSeconds: s.actual_duration_seconds || 0,
        status: s.status,
        interruptions: s.interruptions || 0,
      }))
    );

    return {
      sessions: (data || []).map(this.mapSessionRow),
      total: count || 0,
      stats,
    };
  }

  private static mapSessionRow(row: any): StudySession {
    return {
      id: row.id,
      studentId: row.student_id,
      subjectId: row.subject_id || undefined,
      curriculumNodeId: row.curriculum_node_id || undefined,
      taskId: row.task_id || undefined,
      objective: row.objective,
      targetDurationMinutes: row.target_duration_minutes,
      actualDurationSeconds: row.actual_duration_seconds,
      status: row.status,
      startedAt: row.started_at,
      endedAt: row.ended_at || undefined,
      interruptions: row.interruptions || 0,
      interruptionNotes: row.interruption_notes || [],
      reflection: row.reflection || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
