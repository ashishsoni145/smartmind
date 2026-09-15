'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useProtectedRoute } from '@/lib/auth/use-protected-route';
import { studentProfileAdapter } from '@/lib/adapters/student';
import type { StudentProfile } from '@/lib/types/onboarding';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

function AuthenticatedWorkspace() {
  const router = useRouter();
  const { user, session, isLoading, isAuthenticated, adapterName, signOut } = useAuth();
  const [profile, setProfile] = React.useState<StudentProfile | null>(null);

  // Protect this route: unauthenticated users redirected to /login?redirectTo=%2Fapp
  useProtectedRoute({ requireAuth: true });

  React.useEffect(() => {
    if (user?.id) {
      studentProfileAdapter.getProfile(user.id).then((p) => setProfile(p));
    }
  }, [user?.id]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className={styles.loadingWrapper} role="status" aria-live="polite">
        <div className={styles.spinner} />
        <p>Loading your SharpMind workspace...</p>
      </div>
    );
  }

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'U';

  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <div className={styles.container}>
      {/* Top Profile & Actions Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar} aria-hidden="true">
            {initials}
          </div>
          <div className={styles.nameGroup}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className={styles.welcomeTitle}>{user.fullName}</h1>
              <span className={styles.roleBadge}>{user.role}</span>
            </div>
            <div className={styles.emailLine}>
              <span>{user.email}</span>
              {user.isEmailVerified ? (
                <span className={styles.verifiedBadge}>Verified</span>
              ) : (
                <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`} className={styles.emailLine}>
                  Verify Email
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button href="/onboarding" variant="outline" size="sm">
            {profile?.onboardingStatus.isCompleted ? 'Edit Profile' : 'Onboarding'}
          </Button>
          <Button href="/" variant="outline" size="sm">
            Public Home
          </Button>
          <Button onClick={handleLogout} variant="ghost" size="sm" style={{ color: '#f87171' }}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Onboarding Alert Callout */}
      {!profile?.onboardingStatus.isCompleted && (
        <div className={styles.onboardingCallout}>
          <div className={styles.onboardingCalloutText}>
            <div className={styles.onboardingCalloutTitle}>
              🎓 First-Time Academic Onboarding Incomplete
            </div>
            <div className={styles.onboardingCalloutDesc}>
              Complete your academic profile (grade, board, subjects, target exams, and study preferences) to calibrate your personalized Knowledge Model.
            </div>
          </div>
          <Button href="/onboarding" variant="primary" size="md">
            Complete Onboarding &rarr;
          </Button>
        </div>
      )}

      {/* Session Diagnostics Bar */}
      <div className={styles.sessionCard}>
        <div className={styles.sessionItem}>
          <span>Auth Provider:</span>
          <span className={styles.sessionHighlight}>{adapterName}</span>
        </div>
        <div className={styles.sessionItem}>
          <span>Session Token:</span>
          <span className={styles.sessionHighlight}>
            {session?.accessToken ? `${session.accessToken.slice(0, 16)}...` : 'None'}
          </span>
        </div>
        <div className={styles.sessionItem}>
          <span>Status:</span>
          <span className={styles.sessionHighlight} style={{ color: '#34d399' }}>
            Active & Secure
          </span>
        </div>
      </div>

      {/* Workspace Preview */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Academic OS Overview
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Your personalized knowledge graph and diagnostic loop are active.
        </p>

        <div className={styles.workspaceGrid}>
          <div className={styles.workspaceCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🧠</span>
              <span className={styles.cardTitle}>Student Knowledge Model</span>
            </div>
            <p className={styles.cardBody}>
              {profile ? (
                <>
                  Calibrated for <strong>{profile.academicProfile.board.toUpperCase()} ({profile.academicProfile.grade})</strong> with{' '}
                  {profile.academicProfile.enrolledSubjects.length} enrolled subjects.
                </>
              ) : (
                <>Living knowledge state mapped for CBSE & JEE. Concepts are continuously tracked against forgetting curves.</>
              )}
            </p>
            <span className={styles.cardFooter}>
              {profile
                ? `Readiness: ${profile.readinessBaseline.currentPreparationLevel.replace('_', ' ')}`
                : '142 concepts active • 24 due for review'}
            </span>
          </div>

          <div className={styles.workspaceCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🎯</span>
              <span className={styles.cardTitle}>Adaptive Learning Path</span>
            </div>
            <p className={styles.cardBody}>
              {profile && profile.targetExams.length > 0 ? (
                <>
                  Target Exams: <strong>{profile.targetExams.map((e) => e.examName).join(', ')}</strong>. Next action: Thermodynamics diagnostic.
                </>
              ) : (
                <>Next best action dynamically sequenced: Thermodynamics diagnostic followed by Rotational Motion revision.</>
              )}
            </p>
            <span className={styles.cardFooter}>
              {profile
                ? `Daily Goal: ${profile.studyPreferences.dailyAvailableHours} hrs • ${profile.studyPreferences.preferredStudyTime.replace('_', ' ')}`
                : 'Pacing: On Track • 88% accuracy'}
            </span>
          </div>

          <div className={styles.workspaceCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🔄</span>
              <span className={styles.cardTitle}>Spaced Repetition & Mistakes</span>
            </div>
            <p className={styles.cardBody}>
              18 captured errors categorized by root cause (conceptual vs calculation). 6 targeted practice prompts scheduled.
            </p>
            <span className={styles.cardFooter}>Next review window: Today, 6:00 PM</span>
          </div>

          <div className={styles.workspaceCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🤖</span>
              <span className={styles.cardTitle}>AI Tutor Status</span>
            </div>
            <p className={styles.cardBody}>
              Socratic guidance engine ready. Available for step-by-step hints and concept clarification.
            </p>
            <span className={styles.cardFooter}>Provider: Provider-Agnostic Adapter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppEntryPage() {
  return (
    <section className={`${styles.page} section`} aria-labelledby="workspace-heading">
      <div className={styles.glow} aria-hidden="true" />
      <Suspense
        fallback={
          <div className={styles.container}>
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner} />
              <p>Authenticating workspace session...</p>
            </div>
          </div>
        }
      >
        <AuthenticatedWorkspace />
      </Suspense>
    </section>
  );
}
