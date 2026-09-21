import { SessionInterruption, SessionReflection } from '@sharpmind/types';

export class FocusRules {
  /**
   * Computes effective focused study time subtracting logged interruptions
   */
  static calculateEffectiveStudySeconds(
    actualSeconds: number,
    interruptions: SessionInterruption[] = []
  ): number {
    const lostSeconds = interruptions.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    return Math.max(0, actualSeconds - lostSeconds);
  }

  /**
   * Maps study session completion into grounded Student Model evidence.
   * Note: Timers measure effort and focus adherence, NOT direct test mastery.
   * Evidence is recorded with bounded weight and clear provenance.
   */
  static deriveStudentModelEvidence(
    curriculumNodeId: string,
    actualSeconds: number,
    reflection?: SessionReflection
  ): {
    curriculumNodeId: string;
    evidenceType: 'practice';
    score: number;
    metadata: Record<string, any>;
  } {
    const durationMinutes = Math.round(actualSeconds / 60);
    const prodScore = reflection?.productivityScore ?? 3;
    const completed = reflection?.completedObjective ?? true;

    // Base score between 0.5 (low focus) and 0.9 (high focus completed block)
    const normalizedScore = completed ? 0.6 + (prodScore / 5) * 0.3 : 0.4 + (prodScore / 5) * 0.2;

    return {
      curriculumNodeId,
      evidenceType: 'practice',
      score: Math.min(0.9, Math.max(0.4, normalizedScore)),
      metadata: {
        source: 'focus_session',
        durationMinutes,
        productivityScore: prodScore,
        completedObjective: completed,
      },
    };
  }

  /**
   * Aggregates stats from a list of sessions
   */
  static aggregateSessionStats(sessions: Array<{
    actualDurationSeconds: number;
    status: string;
    interruptions: number;
  }>): {
    totalHours: number;
    completedCount: number;
    abandonedCount: number;
    averageDurationMinutes: number;
    interruptionRate: number; // interruptions per hour
  } {
    let totalSeconds = 0;
    let completed = 0;
    let abandoned = 0;
    let totalInterruptions = 0;

    for (const s of sessions) {
      totalSeconds += s.actualDurationSeconds;
      if (s.status === 'completed') completed++;
      if (s.status === 'abandoned') abandoned++;
      totalInterruptions += s.interruptions;
    }

    const totalHours = Number((totalSeconds / 3600).toFixed(1));
    const averageDurationMinutes = sessions.length > 0 ? Math.round(totalSeconds / sessions.length / 60) : 0;
    const interruptionRate = totalHours > 0 ? Number((totalInterruptions / totalHours).toFixed(1)) : 0;

    return {
      totalHours,
      completedCount: completed,
      abandonedCount: abandoned,
      averageDurationMinutes,
      interruptionRate,
    };
  }
}
