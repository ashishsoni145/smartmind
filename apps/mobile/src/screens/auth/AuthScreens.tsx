import React, { useState } from 'react';
import { Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, Heading, Screen, TextField } from '../../components/ui';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../services/auth';
import { useTheme } from '../../theme/ThemeProvider';

export function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) {
  const auth = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(auth.error);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await auth.signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading subtitle="AI Academic OS">SharpMind</Heading>
      {!auth.configured ? (
        <Card>
          <Text style={{ color: theme.colors.warning }}>
            This build has no public Supabase URL or anon key. Sign-in is disabled until the build is configured. Privileged keys are never embedded.
          </Text>
        </Card>
      ) : null}
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
      <Button label={busy ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={busy || !auth.configured} />
      <Button label="Create an account" tone="ghost" onPress={() => navigation.navigate('Signup')} />
      <Button label="Forgot password" tone="ghost" onPress={() => navigation.navigate('ForgotPassword')} />
    </Screen>
  );
}

export function SignupScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Signup'>) {
  const auth = useAuth();
  const theme = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }
    try {
      const result = await auth.signUp(email, password, fullName);
      setMessage(result.needsVerification ? 'Check your email to verify the account before signing in.' : 'Account created.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-up failed.');
    }
  }

  return (
    <Screen>
      <Heading subtitle="Student accounts use the same SharpMind identity as the web app.">Create account</Heading>
      <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
      {message ? <Text style={{ color: theme.colors.success }}>{message}</Text> : null}
      <Button label="Create account" onPress={submit} disabled={!auth.configured} />
      <Button label="Back to sign in" tone="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

export function ForgotPasswordScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>) {
  const auth = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    try {
      await auth.resetPassword(email);
      setMessage('If the account exists, a reset email was sent. The link opens the web app until Android App Links are configured.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not request a reset.');
    }
  }

  return (
    <Screen>
      <Heading>Reset password</Heading>
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
      {message ? <Text style={{ color: theme.colors.textSecondary }}>{message}</Text> : null}
      <Button label="Send reset email" onPress={submit} />
      <Button label="Back" tone="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
