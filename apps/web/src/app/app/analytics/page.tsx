'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export default function AnalyticsPage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Academic Telemetry & Learning Analytics"
        subtitle="Deep visibility into study time distribution, problem-solving speed, and accuracy curves across subjects."
        icon="📈"
        statusBadge="Telemetry Pipeline Linked"
        phaseBadge="Phase 02 — Analytics Engine"
        notice="All metrics reflect true verified study activity and diagnostic submissions. No artificial progress bars."
        features={[
          {
            icon: '⏱️',
            title: 'Pacing & Speed Metrics',
            description: 'Average time spent per question compared against historical benchmarks for competitive entrance exams.',
          },
          {
            icon: '📊',
            title: 'Subject Balance Radar',
            description: 'Visual tracking of hours allocated to Physics, Chemistry, and Mathematics versus target study goals.',
          },
          {
            icon: '🧠',
            title: 'Cognitive Fatigue Index',
            description: 'Analyzes whether accuracy declines during extended study sessions to suggest optimal break times.',
          },
        ]}
      />
    </WorkspaceShell>
  );
}
