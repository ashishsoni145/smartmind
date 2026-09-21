import { describe, it, expect } from 'vitest';
import { FocusRules } from '../modules/focus/focus.rules';

describe('Focus Mode & Study Session Tracking (Phase 07 Part 03)', () => {
  it('should calculate effective study seconds by subtracting logged interruptions', () => {
    const actualSeconds = 1500; // 25 minutes
    const interruptions = [
      { timestamp: '2026-09-21T10:00:00Z', reason: 'Phone call', durationSeconds: 120 },
      { timestamp: '2026-09-21T10:15:00Z', reason: 'Doorbell', durationSeconds: 60 },
    ];

    const effective = FocusRules.calculateEffectiveStudySeconds(actualSeconds, interruptions);
    expect(effective).toBe(1500 - 180); // 1320 seconds
  });

  it('should derive grounded Student Model practice evidence without overclaiming mastery', () => {
    const curriculumNodeId = '950639bc-d491-4cf9-828b-87cbdeaf1303';
    const actualSeconds = 3000; // 50 mins
    const reflection = {
      productivityScore: 5,
      notes: 'Solved 8 hard rotational dynamics numericals cleanly',
      completedObjective: true,
      keyLearnings: 'Torque calculation origin matters',
    };

    const evidence = FocusRules.deriveStudentModelEvidence(curriculumNodeId, actualSeconds, reflection);

    expect(evidence.curriculumNodeId).toBe(curriculumNodeId);
    expect(evidence.evidenceType).toBe('practice');
    expect(evidence.score).toBeGreaterThanOrEqual(0.4);
    expect(evidence.score).toBeLessThanOrEqual(0.9);
    expect(evidence.metadata.source).toBe('focus_session');
    expect(evidence.metadata.durationMinutes).toBe(50);
  });

  it('should aggregate session statistics across multiple study blocks', () => {
    const sessions = [
      { actualDurationSeconds: 1800, status: 'completed', interruptions: 1 },
      { actualDurationSeconds: 3600, status: 'completed', interruptions: 0 },
      { actualDurationSeconds: 600, status: 'abandoned', interruptions: 2 },
    ];

    const stats = FocusRules.aggregateSessionStats(sessions);

    expect(stats.totalHours).toBe(1.7); // (1800 + 3600 + 600) / 3600 = 1.666 -> 1.7
    expect(stats.completedCount).toBe(2);
    expect(stats.abandonedCount).toBe(1);
    expect(stats.averageDurationMinutes).toBe(33); // 6000 / 3 / 60
    expect(stats.interruptionRate).toBeGreaterThan(0);
  });
});
