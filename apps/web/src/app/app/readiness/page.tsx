'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export default function ReadinessPage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Exam Readiness & Probability Projections"
        subtitle="Objective statistical modeling of syllabus coverage, accuracy stability, and target exam percentile projections."
        icon="📊"
        statusBadge="Awaiting Baseline Calibration"
        phaseBadge="Phase 02 — Predictive Readiness"
        notice="No fabricated scores: Projections require empirical test data. Complete the Baseline Diagnostic to unlock your initial readiness vector."
        primaryActionLabel="Take Baseline Diagnostic"
        primaryActionHref="/app/tests"
        features={[
          {
            icon: '🎯',
            title: 'Goal Discrepancy Analysis',
            description: 'Compares current observed proficiency against the target scores needed for top colleges (IITs, NITs, AIIMS).',
          },
          {
            icon: '📉',
            title: 'Syllabus Weightage Heatmaps',
            description: 'Identifies high-weightage chapters with low student mastery to optimize revision return-on-investment.',
          },
          {
            icon: '🛡️',
            title: 'Grounded Bayesian Projections',
            description: 'Confidence intervals that narrow as more practice and mock test evidence is recorded in PostgreSQL.',
          },
        ]}
      />
    </WorkspaceShell>
  );
}
