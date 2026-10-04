'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    await requestPasswordReset({ email });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={styles.card}>
        <div className={styles.successBox}>
          <div className={styles.successIcon} aria-hidden="true">
            📬
          </div>
          <h1 className={styles.successTitle}>Check Your Inbox</h1>
          <p className={styles.successText}>
            If an account is associated with <strong>{email}</strong>, we have sent instructions to reset your password.
          </p>
          <Button href="/login" variant="primary" size="md" fullWidth>
            Return to Sign In
          </Button>

          <div className={styles.demoLink}>
            Testing locally?{' '}
            <Link href="/reset-password?token=demo_token" className={styles.backLink}>
              Simulate Password Reset Link &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reset Your Password</h1>
        <p className={styles.subtitle}>
          Enter your registered email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="forgot-email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          Send Reset Instructions
        </Button>
      </form>

      <div className={styles.footerText}>
        Remembered your password?
        <Link href="/login" className={styles.backLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.card}>Loading recovery form...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
