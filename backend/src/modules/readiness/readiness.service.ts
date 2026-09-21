// =============================================================================
// Exam Readiness Service — 8-Factor Grounded Index & Transparent Simulator
// =============================================================================

import { supabase } from '../../db/client';
import { BadRequestError } from '../../lib/errors';
import {
  calculateReadinessFactors,
  computeCompositeReadiness,
  calculateProjectedScoreRange,
  generateSimulationScenarios,
  generateRecommendedInterventions,
} from './readiness.rules';
import type { StudentReadinessState, SimulationScenario } from '@sharpmind/types';
import type { GetReadinessQueryInput, SimulateReadinessInput } from './readiness.schema';

export class ReadinessService {
  /**
   * Retrieves or recomputes the 8-factor exam readiness index for a student.
   */
  public static async getStudentReadiness(
    studentId: string,
    query: GetReadinessQueryInput
  ): Promise<StudentReadinessState> {
    const targetExamId = query.targetExamId || 'jee_main';

    // 1. Check if cached state exists and is recent (< 6 hours) unless force recalculate
    if (!query.recalculate) {
      const { data: cached } = await supabase
        .from('student_readiness')
        .select('*')
        .eq('student_id', studentId)
        .eq('target_exam_id', targetExamId)
        .maybeSingle();

      if (cached) {
        const ageHours = (Date.now() - new Date(cached.last_calculated_at).getTime()) / (1000 * 60 * 60);
        if (ageHours < 6) {
          return mapReadinessRow(cached);
        }
      }
    }

    // 2. Fetch Knowledge States
    const { data: states } = await supabase
      .from('student_knowledge_states')
      .select('mastery_score, retention_score, curriculum_node_id')
      .eq('student_id', studentId);

    const activeStates = states || [];
    const coveredNodesCount = activeStates.filter((s) => s.mastery_score > 0.1).length;

    // Fetch total curriculum nodes for this exam/system
    const { count: totalNodesCount } = await supabase
      .from('curriculum_nodes')
      .select('id', { count: 'exact', head: true });

    const totalNodes = totalNodesCount || Math.max(coveredNodesCount, 60);

    const avgMastery =
      activeStates.length > 0
        ? activeStates.reduce((sum, s) => sum + (s.mastery_score || 0), 0) / activeStates.length
        : 0.45;

    const avgRetention =
      activeStates.length > 0
        ? activeStates.reduce((sum, s) => sum + (s.retention_score || 0), 0) / activeStates.length
        : 0.5;

    // 3. Fetch Assessment Submissions
    const { data: submissions } = await supabase
      .from('assessment_submissions')
      .select('score, max_score, percentage, time_taken_seconds, total_attempted')
      .eq('student_id', studentId)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false })
      .limit(10);

    const subList = submissions || [];
    const testsTaken = subList.length;
    const recentScores = subList.map((s) => s.percentage || 0);

    let totalAttemptedQuestions = 0;
    let totalTimeTaken = 0;
    for (const sub of subList) {
      totalAttemptedQuestions += sub.total_attempted || 0;
      totalTimeTaken += sub.time_taken_seconds || 0;
    }

    const avgSecondsPerQuestion =
      totalAttemptedQuestions > 0 ? Math.round(totalTimeTaken / totalAttemptedQuestions) : 90;

    // 4. Fetch Evidence Logs for Hard/Olympiad Questions
    const { data: hardEvidence } = await supabase
      .from('evidence_logs')
      .select('is_correct')
      .eq('student_id', studentId)
      .in('difficulty_level', ['hard', 'olympiad']);

    const hardList = hardEvidence || [];
    const hardQuestionsAttempted = hardList.length;
    const hardQuestionsCorrect = hardList.filter((e) => e.is_correct === true).length;

    // 5. Fetch Mistake Metrics
    const { data: mistakes } = await supabase
      .from('mistakes')
      .select('is_resolved, next_retry_at')
      .eq('student_id', studentId);

    const mistakeList = mistakes || [];
    const nowIso = new Date().toISOString();
    const totalMistakes = mistakeList.length;
    const resolvedMistakes = mistakeList.filter((m) => m.is_resolved).length;
    const overdueMistakes = mistakeList.filter((m) => !m.is_resolved && m.next_retry_at <= nowIso).length;

    // 6. Compute 8 Factors
    const factors = calculateReadinessFactors({
      totalSyllabusNodes: totalNodes,
      coveredSyllabusNodes: coveredNodesCount,
      avgMastery,
      avgRetention,
      testsTaken,
      avgSecondsPerQuestion,
      targetSecondsPerQuestion: 120, // default 2 minutes for JEE Main
      hardQuestionsAttempted,
      hardQuestionsCorrect,
      recentTestScores: recentScores,
      totalMistakes,
      resolvedMistakes,
      overdueMistakes,
    });

    const overallReadinessScore = computeCompositeReadiness(factors);
    const projectedScoreRange = calculateProjectedScoreRange(overallReadinessScore, 300);
    const simulationScenarios = generateSimulationScenarios({
      currentReadiness: overallReadinessScore,
      maxMarks: 300,
      daysRemaining: 90,
    });
    const recommendedInterventions = generateRecommendedInterventions(factors, overdueMistakes);

    const nowTimestamp = new Date().toISOString();

    // 7. Upsert to `student_readiness`
    const payload = {
      student_id: studentId,
      target_exam_id: targetExamId,
      overall_readiness_score: overallReadinessScore,
      projected_score_range: projectedScoreRange,
      factors,
      simulation_scenarios: simulationScenarios,
      recommended_interventions: recommendedInterventions,
      last_calculated_at: nowTimestamp,
      updated_at: nowTimestamp,
    };

    const { data: saved, error } = await supabase
      .from('student_readiness')
      .upsert(payload, { onConflict: 'student_id,target_exam_id' })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestError(`Failed to save student readiness: ${error.message}`);
    }

    return mapReadinessRow(saved);
  }

  /**
   * Runs an interactive simulation with custom student parameters (e.g. daily hours, days left).
   */
  public static async simulateCustomScenario(
    studentId: string,
    input: SimulateReadinessInput
  ): Promise<{
    currentReadinessScore: number;
    simulatedScore: number;
    simulatedReadinessDelta: number;
    scoreConfidenceInterval: { min: number; max: number };
    assumptions: string[];
    recommendations: string[];
  }> {
    const currentState = await this.getStudentReadiness(studentId, {
      targetExamId: input.targetExamId,
      recalculate: false,
    });

    const currentScore = currentState.overallReadinessScore;

    // Simulation multiplier based on daily hours and revision adherence
    const hourFactor = Math.min(1.5, Math.max(0.4, input.dailyStudyHours / 4.0));
    const revisionFactor = Math.min(1.2, Math.max(0.5, input.revisionAdherencePercent / 85));
    const mockFactor = Math.min(1.3, 1.0 + (input.targetMocksCount / 10) * 0.15);

    const potentialDelta = Math.min(
      32,
      Math.max(2, Math.round((input.daysRemaining * 0.12 * hourFactor * revisionFactor * mockFactor) * 10) / 10)
    );

    const projectedReadiness = Math.min(100, Math.round((currentScore + potentialDelta) * 10) / 10);
    const maxExamMarks = 300;
    const projectedMarks = Math.round((projectedReadiness / 100) * maxExamMarks);

    const spread = Math.round(maxExamMarks * 0.06);

    const assumptions = [
      `Maintains strict ${input.dailyStudyHours.toFixed(1)} hours/day study cadence across remaining ${input.daysRemaining} days.`,
      `Completes ${input.targetMocksCount} full-length mock examinations under timed conditions.`,
      `Maintains ${input.revisionAdherencePercent}% adherence to spaced mistake retries and flash revisions.`,
      `Consistently reviews post-test error reports to eliminate recurring blindspots.`,
    ];

    const recommendations = [
      input.dailyStudyHours < 3
        ? 'Increase daily practice by 1-2 hours to accelerate concept coverage.'
        : 'Ensure adequate rest between 4+ hour study blocks to avoid cognitive fatigue.',
      input.revisionAdherencePercent < 80
        ? 'Prioritize scheduled mistake reviews: unrepaired errors repeat in 40% of mock tests.'
        : 'Excellent revision discipline. Keep error notebook clear of overdue items.',
    ];

    return {
      currentReadinessScore: currentScore,
      simulatedScore: projectedMarks,
      simulatedReadinessDelta: potentialDelta,
      scoreConfidenceInterval: {
        min: Math.max(0, projectedMarks - spread),
        max: Math.min(maxExamMarks, projectedMarks + spread),
      },
      assumptions,
      recommendations,
    };
  }
}

function mapReadinessRow(row: any): StudentReadinessState {
  return {
    id: row.id,
    studentId: row.student_id,
    targetExamId: row.target_exam_id,
    examDate: row.exam_date,
    overallReadinessScore: Number(row.overall_readiness_score || 0),
    projectedScoreRange: row.projected_score_range || { min: 0, max: 0 },
    factors: row.factors || [],
    simulationScenarios: row.simulation_scenarios || [],
    recommendedInterventions: row.recommended_interventions || [],
    lastCalculatedAt: row.last_calculated_at,
  };
}
