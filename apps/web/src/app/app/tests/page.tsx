'use client';

import React from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';
import { Button } from '@/components/ui/Button';

export default function TestsPage() {
  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Tests, Diagnostics & Mock Assessments"
        subtitle="Calibrate your Knowledge Model with verified examination items and diagnostic assessments."
        icon="📝"
        statusBadge="Database Seed Active"
        phaseBadge="Phase 02 — Testing Engine"
        notice="Observed assessment results are recorded immutably in public.evidence_logs to separate true evidence from AI inference."
        features={[
          {
            icon: '⚡',
            title: 'Diagnostic Knowledge Calibration',
            description: 'Identifies conceptual blindspots with minimal questions, updating your student mastery vector in real time.',
          },
          {
            icon: '⏱️',
            title: 'Exact Exam Simulation',
            description: 'Timed conditions, negative marking (-1 on incorrect single choice), and sectional score analytics.',
          },
          {
            icon: '🔍',
            title: 'Authoritative Item Provenance',
            description: 'Every test question is audited against official JEE Main, NEET, or CBSE past papers with full solution proofs.',
          },
        ]}
      >
        {/* Active Assessment Card from Supabase */}
        <div style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          background: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 8px 24px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: '#34d399',
            }}>
              ● Live in Supabase (public.assessments)
            </span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
              Marking: +4 / -1
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              SharpMind Baseline Diagnostic Assessment
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Foundational diagnostic evaluating analytical problem-solving and conceptual grasp across Physics, Chemistry, and Mathematics.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
          }}>
            <div>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6875rem', display: 'block' }}>DURATION</span>
              <strong>45 Minutes</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6875rem', display: 'block' }}>TOTAL MARKS</span>
              <strong>20 Marks</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6875rem', display: 'block' }}>QUESTIONS</span>
              <strong>5 Verified Items</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.6875rem', display: 'block' }}>SUBJECTS</span>
              <strong>PHY • CHEM • MATH</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button href="/app" variant="primary" size="md">
              Start Diagnostic Calibration &rarr;
            </Button>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              (Calibrates your living Knowledge Model)
            </span>
          </div>
        </div>
      </WorkspacePlaceholder>
    </WorkspaceShell>
  );
}
