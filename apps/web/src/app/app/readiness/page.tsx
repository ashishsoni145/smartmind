'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import styles from './readiness.module.css';
import type { StudentReadinessState } from '@sharpmind/types';
import { apiClient as api } from '@/lib/api-client';

export default function ReadinessPage() {
  const [readinessState, setReadinessState] = useState<StudentReadinessState | null>(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulation Controls
  const [daysRemaining, setDaysRemaining] = useState(90);
  const [dailyHours, setDailyHours] = useState(4.5);
  const [targetMocks, setTargetMocks] = useState(10);
  const [revisionAdherence, setRevisionAdherence] = useState(85);

  // Simulation Results
  const [simResult, setSimResult] = useState<{
    simulatedScore: number;
    simulatedReadinessDelta: number;
    scoreConfidenceInterval: { min: number; max: number };
    assumptions: string[];
    recommendations: string[];
  } | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);

  useEffect(() => {
    loadReadiness();
  }, []);

  async function loadReadiness(forceRecalculate = false) {
    try {
      if (forceRecalculate) setRecalculating(true);
      else setLoading(true);
      setErrorMsg(null);

      const res = await api.readiness.get({ recalculate: forceRecalculate });
      if (res && res.factors && res.factors.length > 0) {
        setReadinessState(res);
      } else {
        setReadinessState(null);
      }
    } catch (err: any) {
      console.error('Failed to load readiness state from API:', err);
      setErrorMsg('Could not sync readiness metrics with intelligence engine.');
      setReadinessState(null);
    } finally {
      setLoading(false);
      setRecalculating(false);
    }
  }

  async function handleRunSimulation() {
    setSimulating(true);
    setSimError(null);

    try {
      const res = await api.readiness.simulate({
        daysRemaining,
        dailyStudyHours: dailyHours,
        targetMocksCount: targetMocks,
        revisionAdherencePercent: revisionAdherence,
      });
      setSimResult(res);
    } catch (err: any) {
      console.error('Simulation execution failed:', err);
      setSimError(`Target simulation failed: ${err.message || 'Server error'}. Please try again.`);
      setSimResult(null);
    } finally {
      setSimulating(false);
    }
  }

  const overallScore = readinessState?.overallReadinessScore || 0;
  const factors = readinessState?.factors || [];

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.titleWithIcon}>
            <div className={styles.pageIcon}>
              <Icon name="readiness" size="md" />
            </div>
            <div>
              <h1 className={styles.pageTitle}>Grounded Exam Readiness & Target Simulation</h1>
              <p className={styles.pageSubtitle}>
                Objective 8-factor statistical index synthesizing empirical syllabus mastery, pacing, retention stability, and past mock volatility without fabricated promises.
              </p>
            </div>
          </div>

          <button
            className={styles.recalcBtn}
            disabled={recalculating || loading}
            onClick={() => loadReadiness(true)}
          >
            <Icon name="refresh" size="sm" />
            {recalculating ? 'Recomputing...' : 'Recompute Index'}
          </button>
        </header>

        {errorMsg && (
          <div style={{
            padding: '1rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171',
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>⚠️ {errorMsg}</span>
            <button
              onClick={() => loadReadiness(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Evaluating 8-factor empirical readiness index...
          </div>
        ) : !readinessState || factors.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}>
            <span style={{ fontSize: '2.5rem' }}>🎯</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.75rem' }}>
              Readiness Model Uncalibrated
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '520px', margin: '0.5rem auto 1.5rem auto', lineHeight: 1.6 }}>
              SharpMind refuses to fabricate scores. An objective readiness score requires observed evidence from your baseline diagnostic or practice tests.
            </p>
            <Link
              href="/app/tests"
              style={{
                display: 'inline-block',
                padding: '0.625rem 1.25rem',
                background: '#6366f1',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Take Baseline Diagnostic Assessment &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* Hero Overview Banner */}
            <div className={styles.overviewHero}>
              <div className={styles.scoreGaugeBox}>
                <div
                  className={styles.gaugeCircle}
                  style={{ '--readiness-percent': `${Math.round(overallScore)}%` } as React.CSSProperties}
                >
                  <div className={styles.gaugeInner}>
                    <span className={styles.gaugeScore}>{overallScore}%</span>
                    <span className={styles.gaugeLabel}>EXAM READINESS</span>
                  </div>
                </div>
              </div>

              <div className={styles.heroDetails}>
                <div>
                  <span className={styles.factorWeight}>
                    TARGET EXAMINATION: {(readinessState.targetExamId || 'TARGET EXAM').toUpperCase()}
                  </span>
                  <h3 className={styles.pageTitle} style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
                    Statistical Trajectory: {overallScore >= 70 ? 'On Track' : overallScore >= 45 ? 'Developing Cadence' : 'Early Calibration'}
                  </h3>
                </div>

                <div className={styles.projectionBox}>
                  <div className={styles.projItem}>
                    <span className={styles.projLabel}>PROJECTED SCORE BAND</span>
                    <div className={styles.projValue}>
                      {readinessState.projectedScoreRange?.min ?? '--'} – {readinessState.projectedScoreRange?.max ?? '--'} / 300
                    </div>
                  </div>
                  <div className={styles.projItem}>
                    <span className={styles.projLabel}>CALCULATION BASIS</span>
                    <div className={styles.projValue} style={{ color: '#34d399' }}>
                      {factors.length} Verified Factors
                    </div>
                  </div>
                  <div className={styles.projItem}>
                    <span className={styles.projLabel}>LAST COMPUTED</span>
                    <div className={styles.projValue} style={{ color: '#a855f7', fontSize: '0.875rem' }}>
                      {readinessState.lastCalculatedAt ? new Date(readinessState.lastCalculatedAt).toLocaleDateString() : 'Just now'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Grounded Readiness Factors */}
            <section className={styles.factorsSection}>
              <h2 className={styles.sectionHeading}>Grounded Readiness Breakdown</h2>
              <div className={styles.factorsGrid}>
                {factors.map((f) => {
                  const statusClass =
                    f.status === 'strong'
                      ? styles.statusStrong
                      : f.status === 'good'
                      ? styles.statusGood
                      : f.status === 'needs_work'
                      ? styles.statusNeedsWork
                      : styles.statusCritical;

                  return (
                    <div key={f.key || f.factor} className={styles.factorCard}>
                      <div className={styles.factorHeader}>
                        <span className={styles.factorName}>{f.factor || f.name}</span>
                        <span className={styles.factorWeight}>Weight: {Math.round(f.weight * 100)}%</span>
                      </div>

                      <div className={styles.factorScoreRow}>
                        <span className={styles.factorScoreNum}>{f.score}%</span>
                        <span className={`${styles.statusPill} ${statusClass}`}>
                          {f.status ? f.status.replace(/_/g, ' ') : 'STABLE'}
                        </span>
                      </div>

                      <div className={styles.progressBarTrack}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: `${Math.min(100, Math.max(0, f.score))}%` }}
                        />
                      </div>

                      <p className={styles.factorDesc}>
                        {f.description || f.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Target Simulation Sandbox */}
        <section className={styles.simulationSection}>
          <div className={styles.simHeader}>
            <div className={styles.simIcon}>
              <Icon name="target" size="md" />
            </div>
            <div>
              <h2 className={styles.pageTitle} style={{ fontSize: '1.25rem' }}>
                Counterfactual Trajectory Simulation
              </h2>
              <p className={styles.pageSubtitle}>
                Model how changes to daily study hours, mock exam frequency, and revision adherence alter your projected score distribution.
              </p>
            </div>
          </div>

          <div className={styles.slidersGrid}>
            {/* Slider 1: Days */}
            <div className={styles.sliderCard}>
              <div className={styles.sliderLabelRow}>
                <span className={styles.metricLabel}>DAYS UNTIL EXAM</span>
                <span className={styles.sliderValDisplay}>{daysRemaining} Days</span>
              </div>
              <input
                type="range"
                min="15"
                max="180"
                step="5"
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            {/* Slider 2: Daily Hours */}
            <div className={styles.sliderCard}>
              <div className={styles.sliderLabelRow}>
                <span className={styles.metricLabel}>DAILY STUDY ALLOCATION</span>
                <span className={styles.sliderValDisplay}>{dailyHours} Hours/Day</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            {/* Slider 3: Target Mocks */}
            <div className={styles.sliderCard}>
              <div className={styles.sliderLabelRow}>
                <span className={styles.metricLabel}>TARGET FULL-LENGTH MOCKS</span>
                <span className={styles.sliderValDisplay}>{targetMocks} Mocks</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={targetMocks}
                onChange={(e) => setTargetMocks(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>

            {/* Slider 4: Revision Adherence */}
            <div className={styles.sliderCard}>
              <div className={styles.sliderLabelRow}>
                <span className={styles.metricLabel}>SPACED REVISION ADHERENCE</span>
                <span className={styles.sliderValDisplay}>{revisionAdherence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={revisionAdherence}
                onChange={(e) => setRevisionAdherence(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className={styles.simBtn}
              disabled={simulating}
              onClick={handleRunSimulation}
            >
              <Icon name="sparkles" size="sm" />
              {simulating ? 'Computing Trajectory...' : 'Run Counterfactual Simulation'}
            </button>
          </div>

          {simError && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '0.5rem',
              color: '#f87171',
              fontSize: '0.875rem',
            }}>
              ⚠️ {simError}
            </div>
          )}

          {/* Simulation Output Card */}
          {simResult && (
            <div className={styles.simResultCard}>
              <div className={styles.simResultHeader}>
                <span className={styles.factorWeight}>COUNTERFACTUAL MODEL OUTPUT</span>
                <h3 className={styles.pageTitle} style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
                  Projected Trajectory at Scheduled Study Cadence
                </h3>
              </div>

              <div className={styles.simMetricsGrid}>
                <div className={styles.simScoreCard}>
                  <span className={styles.metricLabel}>PROJECTED SCORE</span>
                  <span className={styles.simScoreBig}>
                    {simResult.simulatedScore}
                    <span style={{ fontSize: '1rem', color: '#94a3b8' }}> / 300</span>
                  </span>
                </div>
                <div className={styles.simScoreCard}>
                  <span className={styles.metricLabel}>READINESS DELTA</span>
                  <span className={styles.simScoreBig} style={{ color: '#34d399' }}>
                    +{simResult.simulatedReadinessDelta}%
                  </span>
                </div>
                <div className={styles.simScoreCard}>
                  <span className={styles.metricLabel}>95% CONFIDENCE BAND</span>
                  <span className={styles.simScoreBig} style={{ fontSize: '1.25rem' }}>
                    {simResult.scoreConfidenceInterval?.min} – {simResult.scoreConfidenceInterval?.max}
                  </span>
                </div>
              </div>

              {simResult.assumptions?.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '0.8125rem', color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>
                    Grounded Model Assumptions:
                  </strong>
                  <div className={styles.assumptionsList}>
                    {simResult.assumptions.map((assump, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#6366f1' }}>•</span>
                        <span>{assump}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {simResult.recommendations?.length > 0 && (
                <div>
                  <strong style={{ fontSize: '0.8125rem', color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>
                    Recommended Priority Interventions:
                  </strong>
                  <div className={styles.assumptionsList}>
                    {simResult.recommendations.map((rec, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#10b981' }}>✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}
