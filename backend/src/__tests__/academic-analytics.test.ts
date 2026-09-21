import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsRules, RawTelemetryMetrics } from '../modules/analytics/analytics.rules';
import { AnalyticsService } from '../modules/analytics/analytics.service';
import { supabase } from '../db/client';

vi.mock('../db/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Part 04: Academic Analytics & Review Surfaces', () => {
  describe('AnalyticsRules: 7-Dimension Academic Health Score', () => {
    it('computes calibrated health score for an active, high-performing student', () => {
      const activeMetrics: RawTelemetryMetrics = {
        totalCurriculumNodes: 50,
        completedNodes: 40,
        averageMasteryScore: 0.88,
        knowledgeStatesCount: 40,
        totalRevisionItems: 25,
        overdueRevisionItems: 0,
        examReadinessScore: 85,
        studyHoursThisWeek: 16.5,
        targetWeeklyStudyHours: 15,
        totalTestAttempts: 6,
        overallAccuracyRate: 0.84,
        consecutiveStudyDays: 5,
      };

      const health = AnalyticsRules.computeHealthScore(activeMetrics);

      expect(health.dimensions).toHaveLength(7);
      expect(health.overallScore).toBeGreaterThanOrEqual(80);
      expect(health.gradeLabel).toContain('Advanced Mastery');

      const revisionDim = health.dimensions.find(d => d.id === 'revision');
      expect(revisionDim?.status).toBe('healthy');
      expect(revisionDim?.score).toBe(100);

      const syllabusDim = health.dimensions.find(d => d.id === 'syllabus');
      expect(syllabusDim?.score).toBe(80);
    });

    it('handles new/uncalibrated student without throwing errors', () => {
      const uncalibratedMetrics: RawTelemetryMetrics = {
        totalCurriculumNodes: 50,
        completedNodes: 0,
        averageMasteryScore: 0,
        knowledgeStatesCount: 0,
        totalRevisionItems: 0,
        overdueRevisionItems: 0,
        examReadinessScore: undefined,
        studyHoursThisWeek: 0,
        targetWeeklyStudyHours: 15,
        totalTestAttempts: 0,
        overallAccuracyRate: undefined,
        consecutiveStudyDays: 0,
      };

      const health = AnalyticsRules.computeHealthScore(uncalibratedMetrics);

      expect(health.dimensions).toHaveLength(7);
      const masteryDim = health.dimensions.find(d => d.id === 'knowledge');
      expect(masteryDim?.status).toBe('uncalibrated');
      expect(masteryDim?.explanation).toContain('Initial diagnostic assessment required');

      const examDim = health.dimensions.find(d => d.id === 'exam');
      expect(examDim?.status).toBe('uncalibrated');
    });

    it('penalizes revision health when spaced repetition queue has excessive overdue cards', () => {
      const overdueMetrics: RawTelemetryMetrics = {
        totalCurriculumNodes: 50,
        completedNodes: 20,
        averageMasteryScore: 0.65,
        knowledgeStatesCount: 20,
        totalRevisionItems: 30,
        overdueRevisionItems: 24, // 80% overdue!
        examReadinessScore: 60,
        studyHoursThisWeek: 8,
        targetWeeklyStudyHours: 15,
        totalTestAttempts: 2,
        overallAccuracyRate: 0.70,
        consecutiveStudyDays: 2,
      };

      const health = AnalyticsRules.computeHealthScore(overdueMetrics);
      const revisionDim = health.dimensions.find(d => d.id === 'revision');

      expect(revisionDim?.status).toBe('critical');
      expect(revisionDim?.score).toBe(20);
      expect(revisionDim?.explanation).toContain('24 spaced repetition cards are currently overdue');
    });
  });

  describe('AnalyticsService Integration', () => {
    const studentId = 'test-student-analytics-123';

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('aggregates multi-source telemetry and returns 7-dimension health score', async () => {
      // Mock supabaseAdmin calls
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'curriculum_nodes') {
          return {
            select: vi.fn().mockResolvedValue({ count: 45 }),
          };
        }
        if (table === 'student_knowledge_states') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [
                  { mastery_score: 0.8, confidence_score: 0.85 },
                  { mastery_score: 0.9, confidence_score: 0.9 },
                ],
              }),
            }),
          };
        }
        if (table === 'revision_items') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [{ next_review_at: new Date(Date.now() + 86400000).toISOString() }],
              }),
            }),
          };
        }
        if (table === 'study_sessions') {
          const createChain = (data: any) => {
            const chain: any = {
              eq: vi.fn(() => chain),
              gte: vi.fn(() => chain),
              lte: vi.fn(() => chain),
              order: vi.fn(() => chain),
              limit: vi.fn().mockResolvedValue({ data }),
              then: (resolve: any) => Promise.resolve({ data }).then(resolve),
            };
            return chain;
          };
          return {
            select: vi.fn().mockReturnValue(createChain([
              { actual_duration_seconds: 3600, status: 'completed', started_at: new Date().toISOString() },
            ])),
          };
        }
        if (table === 'assessment_submissions' || table === 'test_attempts') {
          const chain: any = {
            eq: vi.fn(() => chain),
            in: vi.fn(() => chain),
            then: (resolve: any) => Promise.resolve({ data: [{ total_score: 80, max_score: 100 }] }).then(resolve),
          };
          return {
            select: vi.fn().mockReturnValue(chain),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [] }),
          }),
        };
      });

      const score = await AnalyticsService.getHealthScore(studentId);
      expect(score.overallScore).toBeGreaterThan(0);
      expect(score.dimensions).toHaveLength(7);
      expect(score.dimensions.every(d => typeof d.score === 'number')).toBe(true);
    });
  });
});
