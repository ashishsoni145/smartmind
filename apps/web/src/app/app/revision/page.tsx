'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export default function RevisionPage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Spaced Repetition & Retention Engine"
        subtitle="Mathematical modeling of the Ebbinghaus forgetting curve so you never forget what you've learned."
        icon="🔄"
        statusBadge="Schema Bound (public.revision_items)"
        phaseBadge="Phase 02 — Spaced Repetition"
        notice="Review intervals use dynamic stability factors (p_know, p_forget) calibrated against empirical student recall data."
        features={[
          {
            icon: '📉',
            title: 'Forgetting Curve Defense',
            description: 'Concepts are mathematically flagged for review right before recall drops below the 85% retention threshold.',
          },
          {
            icon: '⚡',
            title: 'Micro-Drill Generation',
            description: '10-minute rapid-fire practice drills targeting only high-yield formulas and concepts due for review today.',
          },
          {
            icon: '📚',
            title: 'Cross-Topic Interleaving',
            description: 'Mixes Physics, Chemistry, and Mathematics problems in the same review session to enhance cognitive discrimination.',
          },
        ]}
      />
    </WorkspaceShell>
  );
}
