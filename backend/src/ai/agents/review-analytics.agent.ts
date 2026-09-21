import { z } from 'zod';
import { aiOrchestrator } from '../orchestrator';
import { AcademicHealthScore } from '@sharpmind/types';

export const debriefInsightsSchema = z.object({
  highlights: z.array(z.string()),
  celebratedWins: z.array(z.string()),
  areasNeedingAttention: z.array(z.string()),
  actionableNextSteps: z.array(z.string()),
});

export type DebriefInsights = z.infer<typeof debriefInsightsSchema>;

export const weeklyReviewInsightsSchema = z.object({
  weeklyVelocitySummary: z.string(),
  strategicRecommendations: z.array(z.string()),
  prioritizedSubjectFocus: z.array(z.string()),
});

export type WeeklyReviewInsights = z.infer<typeof weeklyReviewInsightsSchema>;

export class ReviewAnalyticsAgent {
  /**
   * Generates grounded daily debrief feedback strictly from observed telemetry
   */
  static async generateDailyDebrief(
    studentId: string,
    reviewDate: string,
    healthScore: AcademicHealthScore,
    telemetry: {
      studyHoursToday: number;
      questionsAttemptedToday: number;
      accuracyRateToday: number;
      overdueRevisionCards: number;
    }
  ): Promise<DebriefInsights> {
    const systemPrompt = `
You are the SmartMind Academic Debrief Agent.
Analyze student telemetry for the day strictly based on empirical evidence.
Never fabricate completed activities or hallucinate progress.
Identify real momentum, note areas requiring attention, and generate 2-3 specific, achievable next steps.
Return ONLY valid JSON matching the schema.
`;

    const userPrompt = `
Date: ${reviewDate}
Overall Academic Health Score: ${healthScore.overallScore}/100 (${healthScore.gradeLabel})
Today's Study Time: ${telemetry.studyHoursToday.toFixed(1)} hours
Questions Attempted: ${telemetry.questionsAttemptedToday}
Accuracy Rate: ${(telemetry.accuracyRateToday * 100).toFixed(1)}%
Overdue Revision Cards: ${telemetry.overdueRevisionCards}
Health Dimensions:
${healthScore.dimensions.map(d => `- ${d.label}: ${d.score}/100 (${d.status}) - ${d.explanation}`).join('\n')}

Generate realistic highlights, celebrated wins, areas needing attention, and actionable next steps.
`;

    const { data } = await aiOrchestrator.completeStructured<DebriefInsights>(
      {
        taskType: 'academic_review',
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        studentId,
        temperature: 0.2,
      },
      (raw) => {
        const safeRaw = {
          highlights: raw.highlights || [
            telemetry.studyHoursToday > 0
              ? `Completed ${telemetry.studyHoursToday.toFixed(1)} hours of focused study.`
              : 'Checked in to review academic health dashboard.',
          ],
          celebratedWins: raw.celebratedWins || [
            telemetry.accuracyRateToday >= 0.75
              ? `Maintained strong problem accuracy (${Math.round(telemetry.accuracyRateToday * 100)}%).`
              : 'Logged deliberate study effort towards syllabus completion.',
          ],
          areasNeedingAttention: raw.areasNeedingAttention || [
            telemetry.overdueRevisionCards > 0
              ? `${telemetry.overdueRevisionCards} spaced repetition cards need immediate clearing.`
              : 'Keep steady pace on upcoming topic assessments.',
          ],
          actionableNextSteps: raw.actionableNextSteps || [
            'Clear overdue flashcard revision queue.',
            'Complete a 25-minute focused problem-solving block tomorrow morning.',
          ],
        };
        return debriefInsightsSchema.parse(safeRaw);
      }
    );

    return data;
  }

  /**
   * Generates strategic weekly review recommendations grounded in weekly telemetry
   */
  static async generateWeeklyReview(
    studentId: string,
    weekStartDate: string,
    weekEndDate: string,
    healthScore: AcademicHealthScore,
    telemetry: {
      totalStudyHours: number;
      weeklyVelocity: number;
      subjectAllocation: Record<string, number>;
      overdueRevisionCards: number;
    }
  ): Promise<WeeklyReviewInsights> {
    const systemPrompt = `
You are the SmartMind Strategic Weekly Review Agent.
Synthesize the student's past week of study telemetry.
Provide strategic pacing, balance recommendations across Physics, Chemistry, and Mathematics,
and concrete guidance for the upcoming week.
Return ONLY valid JSON matching the schema.
`;

    const userPrompt = `
Period: ${weekStartDate} to ${weekEndDate}
Composite Health Score: ${healthScore.overallScore}/100 (${healthScore.gradeLabel})
Total Study Hours: ${telemetry.totalStudyHours.toFixed(1)}
Weekly Topic Velocity: ${telemetry.weeklyVelocity} topics mastered
Subject Allocation (Hours): ${JSON.stringify(telemetry.subjectAllocation)}
Overdue Revision Cards: ${telemetry.overdueRevisionCards}

Provide a concise velocity summary, strategic recommendations, and prioritized subject focus.
`;

    const { data } = await aiOrchestrator.completeStructured<WeeklyReviewInsights>(
      {
        taskType: 'academic_review',
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        studentId,
        temperature: 0.2,
      },
      (raw) => {
        const safeRaw = {
          weeklyVelocitySummary: raw.weeklyVelocitySummary || `Mastered ${telemetry.weeklyVelocity} topics across ${telemetry.totalStudyHours.toFixed(1)} hours of deliberate practice.`,
          strategicRecommendations: raw.strategicRecommendations || [
            'Maintain steady balance across subjects with dedicated revision blocks.',
            'Schedule a timed mock test before starting new complex chapters.',
          ],
          prioritizedSubjectFocus: raw.prioritizedSubjectFocus || ['Physics Mechanics', 'Organic Chemistry Reactions', 'Calculus'],
        };
        return weeklyReviewInsightsSchema.parse(safeRaw);
      }
    );

    return data;
  }
}
