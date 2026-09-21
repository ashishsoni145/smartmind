import { AcademicHealthScore, HealthDimension } from '@sharpmind/types';

export interface RawTelemetryMetrics {
  totalCurriculumNodes: number;
  completedNodes: number;
  averageMasteryScore: number; // 0.0 to 1.0
  knowledgeStatesCount: number;
  totalRevisionItems: number;
  overdueRevisionItems: number;
  examReadinessScore?: number; // 0 to 100
  studyHoursThisWeek: number;
  targetWeeklyStudyHours: number;
  totalTestAttempts: number;
  overallAccuracyRate?: number; // 0.0 to 1.0
  consecutiveStudyDays: number;
}

export class AnalyticsRules {
  /**
   * Computes explainable 7-dimension Academic Health Score based exclusively on empirical telemetry
   */
  static computeHealthScore(metrics: RawTelemetryMetrics): AcademicHealthScore {
    const dimensions: HealthDimension[] = [];

    // 1. Syllabus Progress (Weight: 0.15)
    const syllabusPercent = metrics.totalCurriculumNodes > 0
      ? Math.round((metrics.completedNodes / metrics.totalCurriculumNodes) * 100)
      : 0;
    dimensions.push({
      id: 'syllabus',
      label: 'Syllabus Coverage',
      score: syllabusPercent,
      weight: 0.15,
      explanation: `${metrics.completedNodes} of ${metrics.totalCurriculumNodes} curriculum units covered (${syllabusPercent}%).`,
      status: metrics.totalCurriculumNodes === 0 ? 'uncalibrated' : syllabusPercent >= 60 ? 'healthy' : 'attention',
    });

    // 2. Knowledge Mastery (Weight: 0.20)
    const hasMasteryData = metrics.knowledgeStatesCount > 0;
    const masteryScore = hasMasteryData ? Math.round(metrics.averageMasteryScore * 100) : 50;
    dimensions.push({
      id: 'knowledge',
      label: 'Conceptual Mastery',
      score: masteryScore,
      weight: 0.20,
      explanation: hasMasteryData
        ? `Average concept mastery across ${metrics.knowledgeStatesCount} active topics is ${masteryScore}%.`
        : 'Initial diagnostic assessment required to establish baseline mastery.',
      status: !hasMasteryData ? 'uncalibrated' : masteryScore >= 75 ? 'healthy' : masteryScore >= 50 ? 'attention' : 'critical',
    });

    // 3. Revision Health (Weight: 0.15)
    const hasRevisionItems = metrics.totalRevisionItems > 0;
    const revisionScore = hasRevisionItems
      ? Math.max(0, Math.round(((metrics.totalRevisionItems - metrics.overdueRevisionItems) / metrics.totalRevisionItems) * 100))
      : 100;
    dimensions.push({
      id: 'revision',
      label: 'Revision Cadence',
      score: revisionScore,
      weight: 0.15,
      explanation: metrics.overdueRevisionItems > 0
        ? `${metrics.overdueRevisionItems} spaced repetition cards are currently overdue.`
        : 'Spaced repetition queue is up to date with zero overdue items.',
      status: metrics.overdueRevisionItems > 5 ? 'critical' : metrics.overdueRevisionItems > 0 ? 'attention' : 'healthy',
    });

    // 4. Exam Readiness (Weight: 0.20)
    const hasReadiness = metrics.examReadinessScore !== undefined && metrics.examReadinessScore > 0;
    const readinessVal = hasReadiness ? Math.round(metrics.examReadinessScore!) : 50;
    dimensions.push({
      id: 'exam',
      label: 'Exam Readiness',
      score: readinessVal,
      weight: 0.20,
      explanation: hasReadiness
        ? `Composite readiness index based on verified telemetry: ${readinessVal}/100.`
        : 'Readiness requires completed mock exams and verified topic mastery.',
      status: !hasReadiness ? 'uncalibrated' : readinessVal >= 70 ? 'healthy' : 'attention',
    });

    // 5. Time Investment (Weight: 0.10)
    const targetHours = Math.max(1, metrics.targetWeeklyStudyHours || 15);
    const timeScore = Math.min(100, Math.round((metrics.studyHoursThisWeek / targetHours) * 100));
    dimensions.push({
      id: 'time',
      label: 'Study Time Pacing',
      score: timeScore,
      weight: 0.10,
      explanation: `${metrics.studyHoursThisWeek.toFixed(1)}h logged this week against target of ${targetHours}h (${timeScore}%).`,
      status: timeScore >= 80 ? 'healthy' : timeScore >= 50 ? 'attention' : 'critical',
    });

    // 6. Performance Accuracy (Weight: 0.10)
    const hasAccuracy = metrics.overallAccuracyRate !== undefined && metrics.totalTestAttempts > 0;
    const accuracyScore = hasAccuracy ? Math.round(metrics.overallAccuracyRate! * 100) : 50;
    dimensions.push({
      id: 'performance',
      label: 'Problem Solving Accuracy',
      score: accuracyScore,
      weight: 0.10,
      explanation: hasAccuracy
        ? `Average accuracy of ${accuracyScore}% across ${metrics.totalTestAttempts} formal assessments.`
        : 'Take chapter tests to calibrate assessment accuracy.',
      status: !hasAccuracy ? 'uncalibrated' : accuracyScore >= 75 ? 'healthy' : 'attention',
    });

    // 7. Consistency & Habit (Weight: 0.10)
    const streak = metrics.consecutiveStudyDays;
    const consistencyScore = Math.min(100, Math.round((streak / 7) * 70 + (streak > 0 ? 30 : 0)));
    dimensions.push({
      id: 'consistency',
      label: 'Habit Consistency',
      score: consistencyScore,
      weight: 0.10,
      explanation: streak > 0
        ? `Active study streak of ${streak} consecutive days.`
        : 'No study session recorded today yet. Start a 25-minute focus block.',
      status: streak >= 4 ? 'healthy' : streak >= 1 ? 'attention' : 'critical',
    });

    // Weighted composite calculation
    let totalWeighted = 0;
    let totalWeight = 0;

    for (const d of dimensions) {
      totalWeighted += d.score * d.weight;
      totalWeight += d.weight;
    }

    const overallScore = Math.round(totalWeighted / totalWeight);

    return {
      overallScore,
      gradeLabel: this.deriveGradeLabel(overallScore),
      dimensions,
      lastUpdated: new Date().toISOString(),
    };
  }

  private static deriveGradeLabel(score: number): string {
    if (score >= 85) return 'Target Track: Advanced Mastery';
    if (score >= 70) return 'Consistent Progress: Calibrated';
    if (score >= 50) return 'Foundation Building: Steady Momentum';
    return 'Attention Needed: Prioritize Backlog & Revision';
  }
}
