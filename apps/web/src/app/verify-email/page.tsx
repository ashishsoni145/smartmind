'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || 'your email';
  const token = searchParams?.get('token');

  const { resendVerificationEmail, verifyEmailToken } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto-verify if token is in query params
  useEffect(() => {
    if (token) {
      handleVerification(token);
    }
  }, [token]);

  const handleVerification = async (verifyToken: string) => {
    setIsVerifying(true);
    setStatusMessage('Verifying your email address...');
    const res = await verifyEmailToken(verifyToken);
    if (res.success) {
      setStatusMessage('Email verified successfully! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      setStatusMessage('Verification link expired or invalid.');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setStatusMessage(null);
    await resendVerificationEmail(email);
    setStatusMessage(`A new verification link has been sent to ${email}.`);
    setCooldown(30);
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} aria-hidden="true">
        ✉️
      </div>

      <h1 className={styles.title}>Verify Your Email</h1>
      <p className={styles.description}>
        We sent an account confirmation email to <br />
        <span className={styles.emailHighlight}>{email}</span>.
      </p>
      <p className={styles.description}>
        Click the link in the message to activate your SharpMind account and access your adaptive learning plan.
      </p>

      {statusMessage && (
        <div className={styles.alert} role="status">
          {statusMessage}
        </div>
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend Verification Email'}
        </Button>

        {/* Demo / Sandbox Simulation button */}
        <Button
          type="button"
          variant="primary"
          size="md"
          fullWidth
          loading={isVerifying}
          disabled={isVerifying}
          onClick={() => handleVerification('demo_verification_token')}
        >
          Simulate Email Link Confirmation
        </Button>

        <Button href="/login" variant="ghost" size="sm" fullWidth>
          Return to Sign In
        </Button>
      </div>

      <div className={styles.demoBanner}>
        Tip: In production, emails are dispatched securely via transaction provider (Supabase / Resend).
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.card}>Loading verification status...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
