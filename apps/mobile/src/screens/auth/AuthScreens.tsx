import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Heading, InlineNotice, Screen, Text, TextField } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../services/auth';
import { toUserError } from '../../utils/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | null {
  if (!value.trim()) return 'Enter your email.';
  if (!EMAIL_PATTERN.test(value.trim())) return 'That does not look like an email address.';
  return null;
}

function NotConfigured() {
  return (
    <InlineNotice
      tone="warning"
      label="This build has no public Supabase URL or anon key, so sign-in is disabled. Configure SHARPMIND_SUPABASE_URL and SHARPMIND_SUPABASE_ANON_KEY at build time. Privileged keys are never embedded."
    />
  );
}

export function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const emailError = validateEmail(email);
    const passwordError = password ? null : 'Enter your password.';
    setFieldErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
    if (emailError || passwordError) return;
    setBusy(true);
    setError(null);
    auth.clearNotice();
    try {
      await auth.signIn(email.trim(), password);
    } catch (err) {
      setError(toUserError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen headerless>
      <Heading subtitle="AI Academic OS">SharpMind</Heading>
      {!auth.configured ? <NotConfigured /> : null}
      {auth.notice ? <InlineNotice tone="warning" label={auth.notice.message} /> : null}
      <TextField
        label="Email"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
        }}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        error={fieldErrors.email}
        editable={!busy}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
        }}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={submit}
        error={fieldErrors.password}
        editable={!busy}
      />
      {error ? <InlineNotice tone="danger" label={error} /> : null}
      <Button label="Sign in" onPress={submit} loading={busy} disabled={busy || !auth.configured} />
      <Button label="Create an account" tone="ghost" onPress={() => navigation.navigate('Signup')} disabled={busy} />
      <Button label="Forgot password" tone="ghost" onPress={() => navigation.navigate('ForgotPassword')} disabled={busy} />
    </Screen>
  );
}

export function SignupScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Signup'>) {
  const auth = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const next = {
      fullName: fullName.trim().length < 2 ? 'Enter your name.' : undefined,
      email: validateEmail(email) ?? undefined,
      password: password.length < 8 ? 'Use at least 8 characters.' : undefined,
    };
    setFieldErrors(next);
    if (next.fullName || next.email || next.password) return;
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      const result = await auth.signUp(email.trim(), password, fullName.trim());
      setMessage(
        result.needsVerification
          ? 'Check your email and confirm the address, then sign in.'
          : 'Account created. You are signed in.',
      );
    } catch (err) {
      setError(toUserError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading subtitle="Student accounts use the same SharpMind identity as the web app.">Create account</Heading>
      {!auth.configured ? <NotConfigured /> : null}
      <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" autoComplete="name" error={fieldErrors.fullName} editable={!busy} />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        error={fieldErrors.email}
        editable={!busy}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        hint="At least 8 characters."
        error={fieldErrors.password}
        returnKeyType="done"
        onSubmitEditing={submit}
        editable={!busy}
      />
      {error ? <InlineNotice tone="danger" label={error} /> : null}
      {message ? <InlineNotice tone="success" label={message} /> : null}
      <Button label="Create account" onPress={submit} loading={busy} disabled={busy || !auth.configured} />
      <Button label="Back to sign in" tone="ghost" onPress={() => navigation.goBack()} disabled={busy} />
    </Screen>
  );
}

export function ForgotPasswordScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const emailError = validateEmail(email);
    setFieldError(emailError ?? undefined);
    if (emailError) return;
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      await auth.resetPassword(email.trim());
      setMessage('If an account exists for that address, a reset email was sent. The link opens the web app.');
    } catch (err) {
      setError(toUserError(err).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading>Reset password</Heading>
      {!auth.configured ? <NotConfigured /> : null}
      <Text tone="secondary">Enter the email you signed up with and we will send a reset link.</Text>
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        error={fieldError}
        returnKeyType="done"
        onSubmitEditing={submit}
        editable={!busy}
      />
      {error ? <InlineNotice tone="danger" label={error} /> : null}
      {message ? <InlineNotice tone="success" label={message} /> : null}
      <Button label="Send reset email" onPress={submit} loading={busy} disabled={busy || !auth.configured} />
      <Button label="Back" tone="ghost" onPress={() => navigation.goBack()} disabled={busy} />
    </Screen>
  );
}
