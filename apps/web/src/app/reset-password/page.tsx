'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || undefined;

  const { updatePassword, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await updatePassword({
      password,
      confirmPassword,
      token,
    });

    if (!res.success) {
      setErrorMessage(res.error?.message || 'Could not update password. Please try again.');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.card}>
        <div className={styles.successBox}>
          <div className={styles.successIcon} aria-hidden="true">
            🎉
          </div>
          <h1 className={styles.successTitle}>Password Updated</h1>
          <p className={styles.successText}>
            Your password has been changed securely. Redirecting to sign in...
          </p>
          <Button href="/login" variant="primary" size="md" fullWidth>
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Set New Password</h1>
        <p className={styles.subtitle}>Enter a strong password to secure your account</p>
      </div>

      {errorMessage && (
        <div className={styles.errorAlert} role="alert" aria-live="polite">
          <span aria-hidden="true">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="New Password"
          type="password"
          name="password"
          id="reset-password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          id="reset-confirm-password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          aria-required="true"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className={styles.submitBtn}
        >
          Update Password
        </Button>
      </form>

      <div className={styles.footerText}>
        Back to
        <Link href="/login" className={styles.backLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.card}>Loading password reset...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
