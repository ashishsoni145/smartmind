'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { apiClient } from '@/lib/api-client';
import { AcademicHealthScore, DailyDebrief, WeeklyReview } from '@sharpmind/types';
import styles from './AnalyticsPage.module.css';

export default function AnalyticsPage() {
  const [healthScore, setHealthScore] = useState<AcademicHealthScore | null>(null);
  const [dailyDebrief, setDailyDebrief] = useState<DailyDebrief | null>(null);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [scoreData, debriefData, reviewData] = await Promise.all([
        apiClient.analytics.getHealthScore().catch(() => null),
        apiClient.analytics.getDailyDebrief().catch(() => null),
        apiClient.analytics.getWeeklyReview().catch(() => null),
      ]);
      setHealthScore(scoreData);
      setDailyDebrief(debriefData);
      setWeeklyReview(reviewData);
    } catch (err: any) {
      console.error('Failed to load academic analytics:', err);
      setErrorMsg('Could not sync with academic intelligence engine. Please check backend connectivity.');
      setHealthScore(null);
      setDailyDebrief(null);
      setWeeklyReview(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const overallScore = healthScore?.overallScore ?? 0;
  const gaugeAngle = `${Math.round((overallScore / 100) * 360)}deg`;

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Icon name="analytics" size="xs" />
            Academic Intelligence Engine
          </div>
          <h1 className={styles.title}>Academic Health & Telemetry</h1>
          <p className={styles.subtitle}>
            Explainable 7-dimension performance telemetry synthesized strictly from verified test results,
            spaced repetition retention, and focus sessions. Zero artificial guesswork.
          </p>
        </div>

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
            <span><span className="banner-inline"><Icon name="info" size="sm" /> {errorMsg}</span></span>
            <button
              onClick={loadAnalytics}
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

        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Evaluating 7-dimension telemetry data...
          </div>
        ) : !healthScore ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}>
            <div className={styles.emptyStateIcon} aria-hidden="true">
              <Icon name="analytics" size="lg" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '0.75rem' }}>
              Academic Health Score Uncalibrated
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '520px', margin: '0.5rem auto 1.5rem auto', lineHeight: 1.6 }}>
              SharpMind refuses to fabricate scores. An authentic academic health index requires observed evidence from your study sessions, mock tests, and revision retries.
            </p>
            <Link
              href="/app/tests"
              className={styles.primaryCta}
            >
              Begin Observed Evidence Session &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* Overall Health Score Card */}
            <div className={styles.overallScoreCard}>
              <div className={styles.scoreLeft}>
                <span className={styles.scoreLabel}>Composite Academic Health Index</span>
                <div className={styles.gradeLabel}>{healthScore.gradeLabel}</div>
                <p className={styles.scoreDescription}>
                  Calculated deterministically using syllabus coverage (15%), conceptual mastery (20%),
                  revision cadence (15%), exam readiness (20%), time pacing (10%), problem accuracy (10%),
                  and habit consistency (10%).
                </p>
              </div>

              <div
                className={styles.scoreGauge}
                style={{ '--health-angle': gaugeAngle } as React.CSSProperties}
              >
                <div className={styles.gaugeInner}>
                  <span className={styles.gaugeNumber}>{healthScore.overallScore}</span>
                  <span className={styles.gaugeMax}>/ 100</span>
                </div>
              </div>
            </div>

            {/* 7 Dimensions Grid */}
            {healthScore.dimensions && healthScore.dimensions.length > 0 && (
              <div className={styles.dimensionsSection}>
                <h2 className={styles.sectionHeading}>Seven Core Health Dimensions</h2>
                <div className={styles.dimensionsGrid}>
                  {healthScore.dimensions.map((dim) => {
                    const badgeClass =
                      dim.status === 'healthy'
                        ? styles.healthy
                        : dim.status === 'attention'
                        ? styles.attention
                        : dim.status === 'critical'
                        ? styles.critical
                        : styles.uncalibrated;

                    const barColor =
                      dim.status === 'healthy'
                        ? '#10b981'
                        : dim.status === 'attention'
                        ? '#f59e0b'
                        : dim.status === 'critical'
                        ? '#ef4444'
                        : '#64748b';

                    return (
                      <div key={dim.id} className={styles.dimensionCard}>
                        <div className={styles.dimensionHeader}>
                          <span className={styles.dimensionTitle}>{dim.label}</span>
                          <span className={`${styles.dimensionBadge} ${badgeClass}`}>
                            {dim.status}
                          </span>
                        </div>

                        <div className={styles.scoreBarTrack}>
                          <div
                            className={styles.scoreBarFill}
                            style={{
                              width: `${dim.score}%`,
                              backgroundColor: barColor,
                            }}
                          />
                        </div>

                        <p className={styles.dimensionExplanation}>{dim.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Daily Debrief & Weekly Strategic Review */}
        <div className={styles.reviewsSplit}>
          {/* Daily Debrief Card */}
          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <h3 className={styles.reviewTitle}>
                <Icon name="sparkles" size="sm" />
                Daily AI Debrief
              </h3>
              {dailyDebrief && (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{dailyDebrief.reviewDate}</span>
              )}
            </div>

            {dailyDebrief ? (
              <>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Today&apos;s Grounded Highlights
                  </span>
                  <ul className={styles.bulletList} style={{ marginTop: '0.5rem' }}>
                    {dailyDebrief.highlights.map((h, i) => (
                      <li key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}><Icon name="check" size="xs" /></span>
                        <span>{h}</span>
                      </li>
                    ))}
                    {dailyDebrief.celebratedWins.map((w, i) => (
                      <li key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}><Icon name="flame" size="xs" /></span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {dailyDebrief.actionableNextSteps && dailyDebrief.actionableNextSteps.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase' }}>
                      Actionable Next Steps
                    </span>
                    <ul className={styles.bulletList} style={{ marginTop: '0.5rem' }}>
                      {dailyDebrief.actionableNextSteps.map((s, i) => (
                        <li key={i} className={styles.bulletItem}>
                          <span className={styles.bulletIcon}><Icon name="arrowRight" size="xs" /></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                No debrief generated yet for today. Completing focus sessions, revision recall cards, or tests will generate your evening debrief.
              </p>
            )}
          </div>

          {/* Weekly Strategic Review Card */}
          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <h3 className={styles.reviewTitle}>
                <Icon name="award" size="sm" />
                Weekly Strategic Review
              </h3>
              {weeklyReview && (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {weeklyReview.weekStartDate} to {weeklyReview.weekEndDate}
                </span>
              )}
            </div>

            {weeklyReview ? (
              <>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      Weekly Study Hours
                    </span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
                      {weeklyReview.totalStudyHours.toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      Topic Velocity
                    </span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8' }}>
                      {weeklyReview.weeklyVelocity} topics
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Strategic Recommendations
                  </span>
                  <ul className={styles.bulletList} style={{ marginTop: '0.5rem' }}>
                    {weeklyReview.strategicRecommendations.map((r, i) => (
                      <li key={i} className={styles.bulletItem}>
                        <span className={styles.bulletIcon}><Icon name="target" size="xs" /></span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Weekly strategic review is compiled at the conclusion of each study cycle to track velocity and balance across subjects.
              </p>
            )}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
