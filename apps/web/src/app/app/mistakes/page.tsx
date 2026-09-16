'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export default function MistakesPage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Mistake Notebook & Error Remediation"
        subtitle="Turn errors into mastery. Automatically captures wrong answers and classifies them by root cause."
        icon="🎯"
        statusBadge="Schema Bound (public.mistakes)"
        phaseBadge="Phase 02 — Error Remediation"
        notice="Errors are categorized by psychological and conceptual failure modes to guide targeted coaching."
        features={[
          {
            icon: '🏷️',
            title: 'Failure Mode Categorization',
            description: 'Identifies whether an error stemmed from Conceptual Misunderstanding, Calculation Slips, Silly Misreads, or Time Rush.',
          },
          {
            icon: '🔄',
            title: 'Adaptive Retry Intervals',
            description: 'Mistakes are scheduled for re-attempts after 24 hours, 7 days, and during pre-exam drills until mastered.',
          },
          {
            icon: '📝',
            title: 'Self-Annotation Journal',
            description: 'Attach your personal handwritten reasoning notes alongside AI coaching hints for comprehensive review.',
          },
        ]}
      />
    </WorkspaceShell>
  );
}
