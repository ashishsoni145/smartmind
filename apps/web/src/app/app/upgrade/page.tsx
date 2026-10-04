'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';
import { Button } from '@/components/ui/Button';

export default function UpgradePage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="SharpMind Pro Academic Plan"
        subtitle="Supercharge your preparation with unlimited Socratic AI tutoring, full-length NTA-style mocks, and multi-model reasoning."
        
        statusBadge="Tier Evaluation Mode"
        phaseBadge="Account Tier & Quotas"
        notice="During Phase 01 beta, all enrolled students have unrestricted evaluation access to core learning and diagnostic modules."
        primaryActionLabel="Continue Free Beta Access"
        primaryActionHref="/app"
        features={[
          {
            
            title: 'Unlimited AI Tutor Inquiries',
            description: 'Uncapped Socratic concept clarification and step-by-step guidance across all core STEM subjects.',
          },
          {
            
            title: 'Adaptive Full-Length Mock Exams',
            description: 'NTA-compliant JEE Main and NEET simulation environments with All-India Rank percentile projections.',
          },
          {
            
            title: 'Parent & Mentor Transparency Portal',
            description: 'Dedicated portal enabling guardians and private tutors to review verified diagnostic reports and study consistency.',
          },
        ]}
      />
    </WorkspaceShell>
  );
}
