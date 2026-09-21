import { supabase } from '../../db/client';
import { AnalyticsRules, RawTelemetryMetrics } from './analytics.rules';
import { AcademicHealthScore, DailyDebrief, WeeklyReview } from '@sharpmind/types';
import { ReviewAnalyticsAgent } from '../../ai/agents/review-analytics.agent';

export class AnalyticsService {
  private static async resolveIdentities(identifier: string): Promise<{ userId: string; studentProfileId: string }> {
    const { IdentityService } = await import('../auth/identity.service');
    const studentProfileId = await IdentityService.resolveStudentProfileId(identifier);
    const userId = await IdentityService.getUserIdForStudentProfile(studentProfileId);
    return { userId, studentProfileId };
  }

  /**
   * Retrieves or computes the real-time Academic Health Score for a student
   */
  static async getHealthScore(studentId: string): Promise<AcademicHealthScore> {
    const { userId, studentProfileId } = await this.resolveIdentities(studentId).catch(() => ({
      userId: studentId,
      studentProfileId: studentId,
    }));
    const metrics = await this.aggregateStudentTelemetry(studentProfileId, userId);
    return AnalyticsRules.computeHealthScore(metrics);
  }

  /**
   * Retrieves or generates today's Daily Debrief
   */
  static async getDailyDebrief(studentId: string, targetDate?: string): Promise<DailyDebrief> {
    const { userId, studentProfileId } = await this.resolveIdentities(studentId).catch(() => ({
      userId: studentId,
      studentProfileId: studentId,
    }));
    const todayStr = targetDate || new Date().toISOString().split('T')[0];

    // Check if an existing debrief exists in academic_reviews (uses profiles.id / userId)
    const { data: existing } = await supabase
      .from('academic_reviews')
      .select('*')
      .eq('student_id', userId)
      .eq('review_type', 'daily_debrief')
      .eq('review_date', todayStr)
      .maybeSingle();

    if (existing) {
      const summary = (existing.evidence_summary as any) || {};
      const insights = (existing.ai_insights as any) || {};
      return {
        id: existing.id,
        studentId: existing.student_id,
        reviewDate: existing.review_date,
        healthScore: Number(existing.health_score),
        studyHoursToday: summary.studyHoursToday || 0,
        questionsAttemptedToday: summary.questionsAttemptedToday || 0,
        accuracyRateToday: summary.accuracyRateToday || 0,
        highlights: insights.highlights || [],
        celebratedWins: insights.celebratedWins || [],
        areasNeedingAttention: insights.areasNeedingAttention || [],
        actionableNextSteps: (existing.actionable_next_steps as string[]) || [],
      };
    }

    // Compute empirical metrics for today
    const healthScore = await this.getHealthScore(studentProfileId);
    const todayTelemetry = await this.getTodayTelemetry(studentProfileId, userId, todayStr);

    const debriefAi = await ReviewAnalyticsAgent.generateDailyDebrief(
      studentProfileId,
      todayStr,
      healthScore,
      todayTelemetry
    );

    // Save to database
    const { data: inserted, error } = await supabase
      .from('academic_reviews')
      .insert({
        student_id: userId,
        review_type: 'daily_debrief',
        review_date: todayStr,
        health_score: healthScore.overallScore,
        dimension_scores: healthScore.dimensions,
        evidence_summary: {
          studyHoursToday: todayTelemetry.studyHoursToday,
          questionsAttemptedToday: todayTelemetry.questionsAttemptedToday,
          accuracyRateToday: todayTelemetry.accuracyRateToday,
        },
        ai_insights: {
          highlights: debriefAi.highlights,
          celebratedWins: debriefAi.celebratedWins,
          areasNeedingAttention: debriefAi.areasNeedingAttention,
        },
        actionable_next_steps: debriefAi.actionableNextSteps,
      })
      .select()
      .maybeSingle();

    if (error || !inserted) {
      return {
        id: 'transient-debrief',
        studentId: userId,
        reviewDate: todayStr,
        healthScore: healthScore.overallScore,
        studyHoursToday: todayTelemetry.studyHoursToday,
        questionsAttemptedToday: todayTelemetry.questionsAttemptedToday,
        accuracyRateToday: todayTelemetry.accuracyRateToday,
        highlights: debriefAi.highlights,
        celebratedWins: debriefAi.celebratedWins,
        areasNeedingAttention: debriefAi.areasNeedingAttention,
        actionableNextSteps: debriefAi.actionableNextSteps,
      };
    }

    return {
      id: inserted.id,
      studentId: inserted.student_id,
      reviewDate: inserted.review_date,
      healthScore: Number(inserted.health_score),
      studyHoursToday: todayTelemetry.studyHoursToday,
      questionsAttemptedToday: todayTelemetry.questionsAttemptedToday,
      accuracyRateToday: todayTelemetry.accuracyRateToday,
      highlights: debriefAi.highlights,
      celebratedWins: debriefAi.celebratedWins,
      areasNeedingAttention: debriefAi.areasNeedingAttention,
      actionableNextSteps: debriefAi.actionableNextSteps,
    };
  }

  /**
   * Retrieves or generates Weekly Review
   */
  static async getWeeklyReview(studentId: string, weekStartDate?: string): Promise<WeeklyReview> {
    const { userId, studentProfileId } = await this.resolveIdentities(studentId).catch(() => ({
      userId: studentId,
      studentProfileId: studentId,
    }));
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const weekStart = weekStartDate || monday.toISOString().split('T')[0];

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekEnd = sunday.toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('academic_reviews')
      .select('*')
      .eq('student_id', userId)
      .eq('review_type', 'weekly_review')
      .eq('review_date', weekStart)
      .maybeSingle();

    if (existing) {
      const summary = (existing.evidence_summary as any) || {};
      return {
        id: existing.id,
        studentId: existing.student_id,
        weekStartDate: existing.review_date,
        weekEndDate: weekEnd,
        healthScore: Number(existing.health_score),
        totalStudyHours: summary.totalStudyHours || 0,
        weeklyVelocity: summary.weeklyVelocity || 0,
        subjectAllocation: summary.subjectAllocation || {},
        masteryDeltas: summary.masteryDeltas || {},
        strategicRecommendations: (existing.actionable_next_steps as string[]) || [],
      };
    }

    const healthScore = await this.getHealthScore(studentProfileId);
    const weeklyTelemetry = await this.getWeeklyTelemetry(studentProfileId, userId, weekStart, weekEnd);

    const weeklyAi = await ReviewAnalyticsAgent.generateWeeklyReview(
      studentProfileId,
      weekStart,
      weekEnd,
      healthScore,
      weeklyTelemetry
    );

    const { data: inserted } = await supabase
      .from('academic_reviews')
      .insert({
        student_id: userId,
        review_type: 'weekly_review',
        review_date: weekStart,
        health_score: healthScore.overallScore,
        dimension_scores: healthScore.dimensions,
        evidence_summary: {
          totalStudyHours: weeklyTelemetry.totalStudyHours,
          weeklyVelocity: weeklyTelemetry.weeklyVelocity,
          subjectAllocation: weeklyTelemetry.subjectAllocation,
          masteryDeltas: weeklyTelemetry.masteryDeltas,
        },
        ai_insights: {
          velocitySummary: weeklyAi.weeklyVelocitySummary,
          prioritizedFocus: weeklyAi.prioritizedSubjectFocus,
        },
        actionable_next_steps: weeklyAi.strategicRecommendations,
      })
      .select()
      .maybeSingle();

    return {
      id: inserted ? inserted.id : 'transient-weekly-review',
      studentId: userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      healthScore: healthScore.overallScore,
      totalStudyHours: weeklyTelemetry.totalStudyHours,
      weeklyVelocity: weeklyTelemetry.weeklyVelocity,
      subjectAllocation: weeklyTelemetry.subjectAllocation,
      masteryDeltas: weeklyTelemetry.masteryDeltas,
      strategicRecommendations: weeklyAi.strategicRecommendations,
    };
  }

  /**
   * Aggregates telemetry across multiple database domains using authentic tables
   */
  private static async aggregateStudentTelemetry(
    studentProfileId: string,
    userId: string
  ): Promise<RawTelemetryMetrics> {
    // 1. Curriculum nodes count
    const { count: totalCurriculumNodes } = await supabase
      .from('curriculum_nodes')
      .select('*', { count: 'exact', head: true });

    // 2. Knowledge states (uses student_profiles.id)
    const { data: knowledgeStates } = await supabase
      .from('student_knowledge_states')
      .select('mastery_score, confidence_score')
      .eq('student_id', studentProfileId);

    const statesCount = knowledgeStates?.length || 0;
    const completedNodes = statesCount;
    const totalMastery = (knowledgeStates || []).reduce((acc, curr) => acc + Number(curr.mastery_score || 0), 0);
    const averageMasteryScore = statesCount > 0 ? totalMastery / statesCount : 0;

    // 3. Revision items (uses student_profiles.id)
    const { data: revisionItems } = await supabase
      .from('revision_items')
      .select('next_review_at')
      .eq('student_id', studentProfileId);

    const totalRevisionItems = revisionItems?.length || 0;
    const nowIso = new Date().toISOString();
    const overdueRevisionItems = (revisionItems || []).filter(item => item.next_review_at && item.next_review_at < nowIso).length;

    // 4. Study hours this week from study_sessions (uses profiles.id / userId)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('actual_duration_seconds, started_at, status')
      .eq('student_id', userId)
      .gte('started_at', sevenDaysAgo.toISOString())
      .eq('status', 'completed');

    const totalDurationSec = (sessions || []).reduce((acc, s) => acc + (s.actual_duration_seconds || 0), 0);
    const studyHoursThisWeek = totalDurationSec / 3600;

    // 5. Assessment Submissions (uses student_profiles.id)
    const { data: attempts } = await supabase
      .from('assessment_submissions')
      .select('total_score, max_score')
      .eq('student_id', studentProfileId)
      .in('status', ['completed', 'submitted']);

    const totalTestAttempts = attempts?.length || 0;
    let overallAccuracyRate: number | undefined = undefined;
    if (totalTestAttempts > 0) {
      let totalEarned = 0;
      let totalPossible = 0;
      for (const a of attempts || []) {
        totalEarned += Number(a.total_score || 0);
        totalPossible += Number(a.max_score || 100);
      }
      overallAccuracyRate = totalPossible > 0 ? totalEarned / totalPossible : 0;
    }

    // 6. Streak from study_sessions (uses userId)
    const consecutiveStudyDays = await this.computeConsecutiveDays(userId);

    return {
      totalCurriculumNodes: totalCurriculumNodes || 45,
      completedNodes,
      averageMasteryScore,
      knowledgeStatesCount: statesCount,
      totalRevisionItems,
      overdueRevisionItems,
      examReadinessScore: statesCount > 0 ? Math.round(averageMasteryScore * 90) : undefined,
      studyHoursThisWeek,
      targetWeeklyStudyHours: 15,
      totalTestAttempts,
      overallAccuracyRate,
      consecutiveStudyDays,
    };
  }

  private static async computeConsecutiveDays(userId: string): Promise<number> {
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('started_at')
      .eq('student_id', userId)
      .eq('status', 'completed')
      .order('started_at', { ascending: false })
      .limit(30);

    if (!sessions || sessions.length === 0) return 0;

    const uniqueDays = new Set<string>();
    for (const s of sessions) {
      uniqueDays.add(new Date(s.started_at).toISOString().split('T')[0]);
    }

    const sortedDays = Array.from(uniqueDays).sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!sortedDays.includes(today) && !sortedDays.includes(yesterday)) {
      return 0;
    }

    return sortedDays.length;
  }

  private static async getTodayTelemetry(studentProfileId: string, userId: string, dateStr: string) {
    const dayStart = `${dateStr}T00:00:00.000Z`;
    const dayEnd = `${dateStr}T23:59:59.999Z`;

    // 1. Study sessions (userId)
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('actual_duration_seconds')
      .eq('student_id', userId)
      .eq('status', 'completed')
      .gte('started_at', dayStart)
      .lte('started_at', dayEnd);

    const studySeconds = (sessions || []).reduce((acc, s) => acc + (s.actual_duration_seconds || 0), 0);

    // 2. Revision items (studentProfileId)
    const { data: revisionItems } = await supabase
      .from('revision_items')
      .select('next_review_at')
      .eq('student_id', studentProfileId);

    const overdueRevisionCards = (revisionItems || []).filter(item => item.next_review_at && item.next_review_at < new Date().toISOString()).length;

    // 3. Questions attempted today from evidence_logs (studentProfileId)
    const { data: todayLogs } = await supabase
      .from('evidence_logs')
      .select('is_correct')
      .eq('student_id', studentProfileId)
      .gte('created_at', dayStart)
      .lte('created_at', dayEnd)
      .not('is_correct', 'is', null);

    const questionsAttemptedToday = todayLogs?.length || 0;
    const correctCount = (todayLogs || []).filter(l => l.is_correct === true).length;
    const accuracyRateToday = questionsAttemptedToday > 0 ? Math.round((correctCount / questionsAttemptedToday) * 100) / 100 : 0;

    return {
      studyHoursToday: studySeconds / 3600,
      questionsAttemptedToday,
      accuracyRateToday,
      overdueRevisionCards,
    };
  }

  private static async getWeeklyTelemetry(studentProfileId: string, userId: string, weekStart: string, weekEnd: string) {
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('actual_duration_seconds, subject_id')
      .eq('student_id', userId)
      .eq('status', 'completed')
      .gte('started_at', `${weekStart}T00:00:00.000Z`)
      .lte('started_at', `${weekEnd}T23:59:59.999Z`);

    const totalSeconds = (sessions || []).reduce((acc, s) => acc + (s.actual_duration_seconds || 0), 0);
    const subjectAllocation: Record<string, number> = {};

    for (const s of sessions || []) {
      const subj = s.subject_id || 'general';
      subjectAllocation[subj] = (subjectAllocation[subj] || 0) + Number(((s.actual_duration_seconds || 0) / 3600).toFixed(1));
    }

    const { data: revisionItems } = await supabase
      .from('revision_items')
      .select('next_review_at')
      .eq('student_id', studentProfileId);

    const overdueRevisionCards = (revisionItems || []).filter(item => item.next_review_at && item.next_review_at < new Date().toISOString()).length;

    // Mastery deltas computed from actual knowledge states
    const { data: weeklyStates } = await supabase
      .from('student_knowledge_states')
      .select('mastery_score, curriculum_nodes(subject_id)')
      .eq('student_id', studentProfileId);

    const masteryDeltas: Record<string, number> = {};
    for (const state of weeklyStates || []) {
      const subj = (state as any).curriculum_nodes?.subject_id || 'general';
      masteryDeltas[subj] = Number((((masteryDeltas[subj] || 0) + (Number(state.mastery_score) || 0)) / 2).toFixed(1));
    }

    return {
      totalStudyHours: totalSeconds / 3600,
      weeklyVelocity: (sessions || []).length,
      subjectAllocation,
      masteryDeltas,
      overdueRevisionCards,
    };
  }
}
