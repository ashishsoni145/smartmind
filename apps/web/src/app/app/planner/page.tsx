'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export default function PlannerPage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Adaptive Study Planner & Agenda"
        subtitle="Dynamic calendar sequencing concepts, revision blocks, and mock tests according to your target exam timeline."
        icon="📅"
        statusBadge="Schema Linked (public.study_plans)"
        phaseBadge="Phase 02 — Adaptive Backlog"
        notice="Schedules adjust automatically based on your daily available hours and performance on practice diagnostics."
        features={[
          {
            icon: '⚡',
            title: 'Dynamic Pacing Adjustment',
            description: 'If you master a chapter faster than expected, the planner pulls forward upcoming topics to maximize exam readiness.',
          },
          {
            icon: '🎯',
            title: 'Exam Countdown Alignment',
            description: 'Back-solves syllabus coverage from your exam test dates (JEE Main, NEET, CBSE Boards).',
          },
          {
            icon: '🔄',
            title: 'Embedded Spaced Repetition',
            description: 'Never forgets to schedule reviews: concepts automatically resurface at 1, 3, 7, and 21-day intervals.',
          },
        ]}
      />
    </WorkspaceShell>
  );
}
