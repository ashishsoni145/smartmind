'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useProtectedRoute } from '@/lib/auth/use-protected-route';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './page.module.css';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/app';

  // Returning user protection: if already signed in, redirect to target
  useProtectedRoute({ requireAuth: false, redirectTo });

  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await signIn({ email, password, rememberMe });
    if (!res.success) {
      if (res.requiresEmailVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        setErrorMessage(res.error?.message || 'Authentication failed. Please check your credentials.');
      }
    } else {
      router.push(redirectTo);
    }
  };



  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your SharpMind learning workspace</p>
      </div>

      {errorMessage && (
        <div className={styles.errorAlert} role="alert" aria-live="polite">
          <span aria-hidden="true">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="login-email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
        />

        <div className={styles.passwordWrapper}>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="login-password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <div className={styles.formRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me for 30 days</span>
          </label>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className={styles.submitBtn}
        >
          Sign In
        </Button>
      </form>



      <div className={styles.footerText}>
        Don&apos;t have an account yet?
        <Link href="/signup" className={styles.signupLink}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.card}>Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
