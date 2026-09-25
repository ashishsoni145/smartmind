import React, { useState } from 'react';
import { Text } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { notificationApi, onboardingApi } from '../../api';
import { Button, Card, Heading, Screen, StateView, TextField } from '../../components/ui';
import { resolveEntitlement } from '../../features/entitlements/entitlements';
import { focusNative } from '../../features/focus/nativeFocus';
import { useStudent } from '../../hooks/useStudent';
import type { HomeStackParamList } from '../../navigation/types';
import { useAuth } from '../../services/auth';
import { useTheme } from '../../theme/ThemeProvider';
import { toUserError } from '../../utils/errors';

export function ProfileScreen({ navigation }: NativeStackScreenProps<HomeStackParamList, 'Profile'>) {
  const auth = useAuth();
  const theme = useTheme();
  const student = useStudent();
  const entitlement = resolveEntitlement(student.me);
  return (
    <Screen>
      <Heading subtitle={auth.user?.email}>{auth.user?.fullName || 'Profile'}</Heading>
      <Card>
        <Text>Email verified: {auth.user?.emailVerified ? 'yes' : 'no'}</Text>
        <Text>Theme: {theme.name}</Text>
        <Button label="Toggle theme" tone="ghost" onPress={() => theme.setTheme(theme.name === 'dark' ? 'light' : 'dark')} />
      </Card>
      <Button label="Notifications" onPress={() => navigation.navigate('Notifications')} />
      <Button label="Subscription" onPress={() => navigation.navigate('Subscription')} />
      <Button label="Onboarding" tone="ghost" onPress={() => navigation.navigate('Onboarding')} />
      <Card>
        <Text style={{ fontWeight: '700' }}>Entitlement</Text>
        <Text>{entitlement.message}</Text>
      </Card>
      <Button label="Sign out" tone="danger" onPress={() => auth.signOut()} />
    </Screen>
  );
}

export function NotificationsScreen() {
  const query = useQuery({ queryKey: ['notifications'], queryFn: () => notificationApi.list() });
  const prefs = useQuery({ queryKey: ['notification-prefs'], queryFn: () => notificationApi.preferences() });
  const [error, setError] = useState<string | null>(null);
  return (
    <Screen>
      <Heading subtitle="Reminders are scheduled only after you enable them. They are not sent at install.">Notifications</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null}>
        <Text>Unread {query.data?.unreadCount ?? 0}</Text>
        {(query.data?.notifications || []).map((item) => (
          <Card key={item.id}>
            <Text style={{ fontWeight: '700' }}>{item.title}</Text>
            <Text>{item.message}</Text>
            <Button label="Mark read" tone="ghost" onPress={() => notificationApi.markRead(item.id)} />
          </Card>
        ))}
      </StateView>
      <Card>
        <Text>Study reminders: {prefs.data?.studySessionReminders ? 'on' : 'off'}</Text>
        <Button label="Enable a 7pm study reminder" onPress={async () => {
          try {
            await notificationApi.updatePreferences({ studySessionReminders: true });
            const when = new Date();
            when.setHours(19, 0, 0, 0);
            if (when.getTime() < Date.now()) when.setDate(when.getDate() + 1);
            await focusNative.scheduleReminder('study-evening', 'Study block', 'Your planner is ready.', when.getTime());
            setError(null);
          } catch (err) {
            setError(toUserError(err).message);
          }
        }} />
        {error ? <Text>{error}</Text> : null}
      </Card>
    </Screen>
  );
}

export function SubscriptionScreen() {
  const student = useStudent();
  const entitlement = resolveEntitlement(student.me);
  return (
    <Screen>
      <Heading>Subscription</Heading>
      <Card>
        <Text>{entitlement.message}</Text>
        <Text>Source: {entitlement.source}. Trusted: {entitlement.trusted ? 'yes' : 'no'}.</Text>
        <Text>Android billing can be attached later to the same server entitlement. A local isPro flag is ignored.</Text>
      </Card>
    </Screen>
  );
}

export function OnboardingScreen() {
  const student = useStudent();
  const [hours, setHours] = useState('3');
  const [message, setMessage] = useState<string | null>(null);
  const complete = useMutation({
    mutationFn: () => onboardingApi.complete({
      dailyAvailableHours: Number(hours),
      preferredStudyTime: 'evening',
      learningStylePreference: 'problem_solving_first',
      currentPreparationLevel: 'moderate',
      enrolledSubjects: ['physics', 'chemistry', 'mathematics'],
    }),
    onSuccess: () => {
      setMessage('Onboarding was saved on the server.');
      student.refetch();
    },
  });
  return (
    <Screen>
      <Heading subtitle="This uses the onboarding API. It does not invent a study plan.">Academic setup</Heading>
      <TextField label="Daily available hours" value={hours} onChangeText={setHours} keyboardType="numeric" />
      <Button label="Save onboarding" onPress={() => complete.mutate()} />
      {complete.error ? <Text>{toUserError(complete.error).message}</Text> : null}
      {message ? <Text>{message}</Text> : null}
    </Screen>
  );
}
