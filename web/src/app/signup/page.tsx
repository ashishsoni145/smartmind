'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { useProtectedRoute } from '@/lib/auth/use-protected-route';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { UserRole } from '@/lib/types/auth';
import styles from './page.module.css';

function SignupForm() {
  const router = useRouter();
  useProtectedRoute({ requireAuth: false });

  const { signUp, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password criteria computation
  const criteria = useMemo(() => {
    return {
      length: password.length >= 8,
      mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (criteria.length) score += 1;
    if (criteria.mixedCase) score += 1;
    if (criteria.number) score += 1;
    if (criteria.special) score += 1;
    return score;
  }, [criteria]);

  const strengthInfo = useMemo(() => {
    switch (strengthScore) {
      case 0:
        return { label: 'Empty', color: 'transparent', width: '0%' };
      case 1:
        return { label: 'Weak', color: '#ef4444', width: '25%' };
      case 2:
        return { label: 'Fair', color: '#f59e0b', width: '50%' };
      case 3:
        return { label: 'Good', color: 'var(--color-accent)', width: '75%' };
      case 4:
        return { label: 'Strong', color: '#10b981', width: '100%' };
      default:
        return { label: '', color: 'transparent', width: '0%' };
    }
  }, [strengthScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (strengthScore < 3) {
      setErrorMessage('Please create a stronger password meeting the requirements.');
      return;
    }
    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    const res = await signUp({
      fullName,
      email,
      password,
      role,
      termsAccepted,
    });

    if (!res.success) {
      setErrorMessage(res.error?.message || 'Could not create account. Please try again.');
    } else {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Join SharpMind and start your adaptive learning loop</p>
      </div>

      {errorMessage && (
        <div className={styles.errorAlert} role="alert" aria-live="polite">
          <span aria-hidden="true">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Role Selector */}
        <div className={styles.roleGroup}>
          <label className={styles.roleLabel}>I am a:</label>
          <div className={styles.roleButtons} role="radiogroup" aria-label="Account role">
            <button
              type="button"
              role="radio"
              aria-checked={role === 'student'}
              className={`${styles.roleBtn} ${role === 'student' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('student')}
            >
              <span className={styles.roleIcon}>🎓</span>
              <span className={styles.roleText}>Student</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={role === 'parent'}
              className={`${styles.roleBtn} ${role === 'parent' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('parent')}
            >
              <span className={styles.roleIcon}>👨‍👩‍👧</span>
              <span className={styles.roleText}>Parent</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={role === 'teacher'}
              className={`${styles.roleBtn} ${role === 'teacher' ? styles.roleBtnActive : ''}`}
              onClick={() => setRole('teacher')}
            >
              <span className={styles.roleIcon}>👩‍🏫</span>
              <span className={styles.roleText}>Educator</span>
            </button>
          </div>
        </div>

        <Input
          label="Full Name"
          type="text"
          name="fullName"
          id="signup-name"
          autoComplete="name"
          placeholder="e.g. Aarav Sharma"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          aria-required="true"
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          id="signup-email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
        />

        <div className={styles.passwordWrapper}>
          <Input
            label="Create Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="signup-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
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

        {/* Live Password Strength Meter */}
        {password && (
          <div className={styles.strengthMeter}>
            <div className={styles.strengthBarContainer}>
              <div
                className={styles.strengthBar}
                style={{
                  width: strengthInfo.width,
                  backgroundColor: strengthInfo.color,
                }}
              />
            </div>
            <div className={styles.strengthText}>Strength: {strengthInfo.label}</div>
            <ul className={styles.criteriaList}>
              <li
                className={`${styles.criteriaItem} ${
                  criteria.length ? styles.criteriaPassed : ''
                }`}
              >
                <span>{criteria.length ? '✓' : '•'}</span>
                <span>8+ characters</span>
              </li>
              <li
                className={`${styles.criteriaItem} ${
                  criteria.mixedCase ? styles.criteriaPassed : ''
                }`}
              >
                <span>{criteria.mixedCase ? '✓' : '•'}</span>
                <span>Mixed uppercase & lowercase</span>
              </li>
              <li
                className={`${styles.criteriaItem} ${
                  criteria.number ? styles.criteriaPassed : ''
                }`}
              >
                <span>{criteria.number ? '✓' : '•'}</span>
                <span>At least one number</span>
              </li>
              <li
                className={`${styles.criteriaItem} ${
                  criteria.special ? styles.criteriaPassed : ''
                }`}
              >
                <span>{criteria.special ? '✓' : '•'}</span>
                <span>At least one symbol</span>
              </li>
            </ul>
          </div>
        )}

        <label className={styles.termsLabel}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          <span>
            I agree to the{' '}
            <Link href="/terms" className={styles.termsLink} target="_blank">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className={styles.termsLink} target="_blank">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className={styles.submitBtn}
        >
          Create Account
        </Button>
      </form>

      <div className={styles.footerText}>
        Already have an account?
        <Link href="/login" className={styles.loginLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.card}>Loading sign up...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
