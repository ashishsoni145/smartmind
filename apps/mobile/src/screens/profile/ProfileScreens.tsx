import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curriculumApi, notificationApi, onboardingApi } from '../../api';
import { Button, Card, Chip, Divider, Heading, InlineNotice, ListRow, Row, Screen, SectionTitle, StateView, Text, TextField } from '../../components/ui';
import { resolveEntitlement } from '../../features/entitlements/entitlements';
import { billingAvailability, describeBilling, type BillingAvailability } from '../../features/entitlements/billing';
import { focusNative } from '../../features/focus/nativeFocus';
import { requestNotifications, openSettingsFor } from '../../features/focus/permissions';
import {
  LEARNING_STYLES,
  PREPARATION_LEVELS,
  STUDY_TIMES,
  initialOnboardingForm,
  labelForEnum,
  toOnboardingPayload,
  toggleInList,
  validateOnboardingForm,
  type OnboardingFieldErrors,
} from '../../features/onboarding/onboardingForm';
import { useStudent } from '../../hooks/useStudent';
import type { HomeStackParamList } from '../../navigation/types';
import { useAuth } from '../../services/auth';
import { useTheme } from '../../theme/ThemeProvider';
import { toUserError } from '../../utils/errors';

const APP_VERSION_LABEL = 'Android build';

export function ProfileScreen({ navigation }: NativeStackScreenProps<HomeStackParamList, 'Profile'>) {
  const auth = useAuth();
  const theme = useTheme();
  const student = useStudent();
  const entitlement = resolveEntitlement(student.me);
  const [signingOut, setSigningOut] = useState(false);
  const profile = student.profile as { boardId?: string; gradeId?: string; enrolledSubjects?: string[]; onboardingCompleted?: boolean } | null;

  return (
    <Screen>
      <Heading subtitle={auth.user?.email}>{auth.user?.fullName || 'Profile'}</Heading>
      <Card>
        <ListRow title="Email verified" meta={auth.user?.emailVerified ? 'Yes' : 'No'} />
        <ListRow title="Appearance" meta={theme.name === 'dark' ? 'Dark' : 'Light'} />
        <Button label={theme.name === 'dark' ? 'Use light theme' : 'Use dark theme'} tone="ghost" onPress={() => theme.setTheme(theme.name === 'dark' ? 'light' : 'dark')} />
      </Card>
      <SectionTitle>Academic profile</SectionTitle>
      <Card>
        {student.loading ? (
          <Text tone="secondary">Loading profile…</Text>
        ) : student.error ? (
          <InlineNotice tone="danger" label={toUserError(student.error).message} />
        ) : profile ? (
          <>
            <ListRow title="Board" meta={profile.boardId || '—'} />
            <ListRow title="Class" meta={profile.gradeId || '—'} />
            <ListRow title="Subjects" meta={profile.enrolledSubjects?.length ? String(profile.enrolledSubjects.length) : '—'} />
            <Button label={profile.onboardingCompleted ? 'Update academic setup' : 'Complete academic setup'} tone="secondary" onPress={() => navigation.navigate('Onboarding')} />
          </>
        ) : (
          <Text tone="secondary">No student profile is attached to this account.</Text>
        )}
      </Card>
      <SectionTitle>Account</SectionTitle>
      <Card>
        <ListRow title="Notifications" subtitle="In-app inbox and local reminders" onPress={() => navigation.navigate('Notifications')} />
        <Divider />
        <ListRow title="Subscription" subtitle={entitlement.source === 'server' ? `${entitlement.tier} · ${entitlement.status}` : 'Free · Pro is not purchasable in this version'} onPress={() => navigation.navigate('Subscription')} />
      </Card>
      <Button
        label="Sign out"
        tone="danger"
        loading={signingOut}
        disabled={signingOut}
        onPress={async () => {
          setSigningOut(true);
          try {
            await auth.signOut();
          } finally {
            setSigningOut(false);
          }
        }}
      />
      <Text tone="muted" variant="small" style={{ textAlign: 'center' }}>
        {APP_VERSION_LABEL} · Privileged server keys are never embedded in this app.
      </Text>
    </Screen>
  );
}

const REMINDER_ID = 'study-evening';
const REMINDER_CACHE_KEY = 'reminder.study-evening.v1';

type LocalReminder = { hour: number; minute: number; nextAtEpochMs: number };

function nextOccurrence(hour: number, minute: number, from = new Date()): number {
  const when = new Date(from);
  when.setHours(hour, minute, 0, 0);
  if (when.getTime() <= from.getTime()) when.setDate(when.getDate() + 1);
  return when.getTime();
}

export function NotificationsScreen() {
  const queryClient = useQueryClient();
  const inbox = useQuery({ queryKey: ['notifications'], queryFn: () => notificationApi.list() });
  const prefs = useQuery({ queryKey: ['notification-prefs'], queryFn: () => notificationApi.preferences() });
  const [reminder, setReminder] = useState<LocalReminder | null | 'unknown'>('unknown');
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    focusNative
      .cacheRead(REMINDER_CACHE_KEY)
      .then((raw) => {
        if (cancelled) return;
        if (!raw) {
          setReminder(null);
          return;
        }
        try {
          const parsed = JSON.parse(raw) as LocalReminder;
          setReminder(typeof parsed.hour === 'number' ? parsed : null);
        } catch {
          setReminder(null);
        }
      })
      .catch(() => {
        if (!cancelled) setReminder(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const markAll = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
  const updatePrefs = useMutation({
    mutationFn: (patch: Record<string, unknown>) => notificationApi.updatePreferences(patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notification-prefs'] }),
  });

  async function enableReminder(hour: number) {
    setBusy(true);
    setReminderError(null);
    try {
      const permission = await requestNotifications();
      if (permission !== 'granted') {
        setReminderError(
          permission === 'settings'
            ? 'Notifications are turned off for SharpMind. Enable them in Android Settings, then try again.'
            : 'Notification permission was not granted, so no reminder was scheduled.',
        );
        if (permission === 'settings') await openSettingsFor('notifications');
        return;
      }
      const nextAtEpochMs = nextOccurrence(hour, 0);
      // scheduleReminder is keyed by id, so re-enabling replaces the previous alarm instead of duplicating it.
      await focusNative.scheduleReminder(REMINDER_ID, 'Study block', 'Your planner for today is ready in SharpMind.', nextAtEpochMs);
      const next: LocalReminder = { hour, minute: 0, nextAtEpochMs };
      await focusNative.cacheWrite(REMINDER_CACHE_KEY, JSON.stringify(next));
      setReminder(next);
      if (prefs.data && !prefs.data.studySessionReminders) {
        updatePrefs.mutate({ studySessionReminders: true });
      }
    } catch (err) {
      setReminderError(toUserError(err).message);
    } finally {
      setBusy(false);
    }
  }

  async function disableReminder() {
    setBusy(true);
    setReminderError(null);
    try {
      await focusNative.cancelReminder(REMINDER_ID);
      await focusNative.cacheRemove(REMINDER_CACHE_KEY);
      setReminder(null);
    } catch (err) {
      setReminderError(toUserError(err).message);
    } finally {
      setBusy(false);
    }
  }

  const notifications = inbox.data?.notifications || [];
  const mutationError = markRead.error || markAll.error || updatePrefs.error;

  return (
    <Screen refreshing={inbox.isRefetching} onRefresh={() => { inbox.refetch(); prefs.refetch(); }}>
      <Heading subtitle="Reminders are scheduled on this device only after you turn them on. Nothing is scheduled at install.">Notifications</Heading>

      <SectionTitle>Daily study reminder</SectionTitle>
      <Card>
        {reminder === 'unknown' ? (
          <Text tone="secondary">Checking local reminder…</Text>
        ) : reminder ? (
          <>
            <Text weight="600">On · every day at {String(reminder.hour).padStart(2, '0')}:00</Text>
            <Text tone="secondary" variant="small">Next: {new Date(reminder.nextAtEpochMs).toLocaleString()}. Fires once, then re-arms itself the next day it fires.</Text>
            <Button label="Turn off reminder" tone="secondary" onPress={disableReminder} loading={busy} disabled={busy} />
          </>
        ) : (
          <>
            <Text tone="secondary">Pick a time. SharpMind asks for notification permission first and schedules exactly one alarm.</Text>
            <Row style={{ flexWrap: 'wrap' }}>
              {[7, 17, 19, 21].map((hour) => (
                <Chip key={hour} label={`${String(hour).padStart(2, '0')}:00`} onPress={() => enableReminder(hour)} disabled={busy} />
              ))}
            </Row>
          </>
        )}
        {reminderError ? <InlineNotice tone="danger" label={reminderError} /> : null}
      </Card>

      <SectionTitle>Server preferences</SectionTitle>
      <Card>
        <StateView loading={prefs.isLoading} error={prefs.error ? toUserError(prefs.error) : null} onRetry={() => prefs.refetch()}>
          {prefs.data ? (
            <>
              {(
                [
                  ['studySessionReminders', 'Study session reminders'],
                  ['revisionReminders', 'Revision reminders'],
                  ['testReminders', 'Test reminders'],
                  ['backlogAlerts', 'Backlog alerts'],
                  ['emailEnabled', 'Email'],
                ] as const
              ).map(([key, label]) => (
                <ListRow
                  key={key}
                  title={label}
                  meta={prefs.data[key] ? 'On' : 'Off'}
                  accessibilityHint="Toggles this preference on the server"
                  onPress={updatePrefs.isPending ? undefined : () => updatePrefs.mutate({ [key]: !prefs.data[key] })}
                />
              ))}
              <Text tone="muted" variant="small">Quiet hours {prefs.data.quietHoursStart?.slice(0, 5)}–{prefs.data.quietHoursEnd?.slice(0, 5)} ({prefs.data.timezone}).</Text>
            </>
          ) : null}
        </StateView>
      </Card>

      <SectionTitle action={notifications.some((n) => !n.isRead) ? 'Mark all read' : undefined} onAction={() => markAll.mutate()}>Inbox</SectionTitle>
      {mutationError ? <InlineNotice tone="danger" label={toUserError(mutationError).message} /> : null}
      <StateView
        loading={inbox.isLoading}
        error={inbox.error ? toUserError(inbox.error) : null}
        onRetry={() => inbox.refetch()}
        empty={notifications.length === 0 ? 'No notifications yet.' : null}>
        {notifications.map((item) => (
          <Card key={item.id} tone={item.isRead ? 'default' : 'accent'}>
            <Text weight="700">{item.title}</Text>
            <Text tone="secondary">{item.message}</Text>
            <Text tone="muted" variant="small">{new Date(item.createdAt).toLocaleString()}</Text>
            {!item.isRead ? (
              <Button label="Mark read" tone="ghost" compact onPress={() => markRead.mutate(item.id)} disabled={markRead.isPending} />
            ) : null}
          </Card>
        ))}
      </StateView>
    </Screen>
  );
}

export function SubscriptionScreen() {
  const student = useStudent();
  const entitlement = resolveEntitlement(student.me);
  const [billing, setBilling] = useState<BillingAvailability | null>(null);
  useEffect(() => {
    let cancelled = false;
    billingAvailability(null).then((result) => {
      if (!cancelled) setBilling(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen>
      <Heading subtitle="Pro status comes from the SharpMind server. This device never stores or grants it.">Subscription</Heading>
      <Card tone={entitlement.trusted ? 'success' : 'default'}>
        <Text weight="700">{entitlement.trusted ? `${entitlement.tier} · ${entitlement.status}` : 'Free plan'}</Text>
        <Text tone="secondary">{entitlement.message}</Text>
        {student.loading ? <Text tone="muted" variant="small">Refreshing from server…</Text> : null}
        {student.error ? <InlineNotice tone="warning" label={`Could not refresh entitlement: ${toUserError(student.error).message}`} /> : null}
      </Card>
      <Card>
        <Text weight="700">Upgrade</Text>
        <Text tone="secondary">{billing ? describeBilling(billing) : 'Checking purchase availability…'}</Text>
        {billing?.status === 'available' ? (
          <Button label="Continue in Google Play" onPress={() => undefined} disabled />
        ) : (
          <Text tone="muted" variant="small">No purchase button is shown because nothing can be unlocked yet. When Play Billing ships, purchases will be verified server-side.</Text>
        )}
      </Card>
      <Button label="Refresh" tone="secondary" onPress={() => student.refetch()} disabled={student.loading} />
    </Screen>
  );
}

type Named = { id: string; name: string; code?: string };

/** `standalone` is set by the onboarding gate, where there is no navigation header above it. */
export function OnboardingScreen({ standalone = false }: { standalone?: boolean }) {
  const student = useStudent();
  const queryClient = useQueryClient();
  const boards = useQuery({ queryKey: ['curriculum', 'boards'], queryFn: () => curriculumApi.boards() as Promise<Named[]> });
  const grades = useQuery({ queryKey: ['curriculum', 'grades'], queryFn: () => curriculumApi.grades() as Promise<Named[]> });
  const subjects = useQuery({ queryKey: ['curriculum', 'subjects'], queryFn: () => curriculumApi.subjects() as Promise<Named[]> });
  const exams = useQuery({ queryKey: ['curriculum', 'exams'], queryFn: () => curriculumApi.exams() as Promise<Named[]> });
  const [form, setForm] = useState(initialOnboardingForm);
  const [errors, setErrors] = useState<OnboardingFieldErrors>({});
  const [saved, setSaved] = useState(false);

  // Pre-fill from an existing profile so "update" edits instead of starting blank.
  const profile = student.profile as { boardId?: string; gradeId?: string; enrolledSubjects?: string[]; dailyAvailableHours?: number; preferredStudyTime?: string; currentPreparationLevel?: string; learningStylePreference?: string } | null;
  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      ...prev,
      boardId: prev.boardId ?? profile.boardId ?? null,
      gradeId: prev.gradeId ?? profile.gradeId ?? null,
      subjectIds: prev.subjectIds.length ? prev.subjectIds : profile.enrolledSubjects ?? [],
      dailyHours: profile.dailyAvailableHours ? String(profile.dailyAvailableHours) : prev.dailyHours,
      studyTime: (STUDY_TIMES as readonly string[]).includes(profile.preferredStudyTime ?? '') ? (profile.preferredStudyTime as typeof prev.studyTime) : prev.studyTime,
      preparationLevel: (PREPARATION_LEVELS as readonly string[]).includes(profile.currentPreparationLevel ?? '') ? (profile.currentPreparationLevel as typeof prev.preparationLevel) : prev.preparationLevel,
      learningStyle: (LEARNING_STYLES as readonly string[]).includes(profile.learningStylePreference ?? '') ? (profile.learningStylePreference as typeof prev.learningStyle) : prev.learningStyle,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.boardId, profile?.gradeId]);

  const complete = useMutation({
    mutationFn: () => onboardingApi.complete(toOnboardingPayload(form)),
    onSuccess: async () => {
      setSaved(true);
      await queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await student.refetch();
    },
  });

  const referenceLoading = boards.isLoading || grades.isLoading || subjects.isLoading;
  const referenceError = boards.error || grades.error || subjects.error;
  const examList = useMemo(() => exams.data ?? [], [exams.data]);

  function submit() {
    const next = validateOnboardingForm(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSaved(false);
    complete.mutate();
  }

  return (
    <Screen headerless={standalone}>
      <Heading subtitle="Board, class and subjects drive the planner, tests and revision. Everything is saved on the server; nothing is guessed.">Academic setup</Heading>
      <StateView
        loading={referenceLoading}
        loadingLabel="Loading curriculum options"
        error={referenceError ? toUserError(referenceError) : null}
        onRetry={() => { boards.refetch(); grades.refetch(); subjects.refetch(); exams.refetch(); }}>
        <SectionTitle>Board</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }}>
          {(boards.data ?? []).map((board) => (
            <Chip key={board.id} label={board.name} active={form.boardId === board.id} onPress={() => setForm({ ...form, boardId: board.id })} />
          ))}
        </Row>
        {boards.data && boards.data.length === 0 ? <Text tone="warning" variant="small">The server returned no boards.</Text> : null}
        {errors.boardId ? <Text tone="danger" variant="small">{errors.boardId}</Text> : null}

        <SectionTitle>Class</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }}>
          {(grades.data ?? []).map((grade) => (
            <Chip key={grade.id} label={grade.name} active={form.gradeId === grade.id} onPress={() => setForm({ ...form, gradeId: grade.id })} />
          ))}
        </Row>
        {errors.gradeId ? <Text tone="danger" variant="small">{errors.gradeId}</Text> : null}

        <SectionTitle>Subjects</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }}>
          {(subjects.data ?? []).map((subject) => (
            <Chip key={subject.id} label={subject.name} active={form.subjectIds.includes(subject.id)} onPress={() => setForm({ ...form, subjectIds: toggleInList(form.subjectIds, subject.id) })} />
          ))}
        </Row>
        {errors.subjectIds ? <Text tone="danger" variant="small">{errors.subjectIds}</Text> : null}

        <SectionTitle>Target exams (optional)</SectionTitle>
        {exams.error ? <Text tone="warning" variant="small">Exam list unavailable: {toUserError(exams.error).message}</Text> : null}
        <Row style={{ flexWrap: 'wrap' }}>
          {examList.map((exam) => (
            <Chip key={exam.id} label={exam.name} active={form.examIds.includes(exam.id)} onPress={() => setForm({ ...form, examIds: toggleInList(form.examIds, exam.id) })} />
          ))}
        </Row>
        {form.examIds.length > 0 ? (
          <TextField label="Target year" value={form.targetYear} onChangeText={(value) => setForm({ ...form, targetYear: value.replace(/[^0-9]/g, '').slice(0, 4) })} keyboardType="numeric" error={errors.targetYear} />
        ) : null}

        <SectionTitle>Preparation level</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }}>
          {PREPARATION_LEVELS.map((level) => (
            <Chip key={level} label={labelForEnum(level)} active={form.preparationLevel === level} onPress={() => setForm({ ...form, preparationLevel: level })} />
          ))}
        </Row>

        <TextField
          label="Daily available hours"
          value={form.dailyHours}
          onChangeText={(value) => setForm({ ...form, dailyHours: value })}
          keyboardType="numeric"
          hint="Between 0.5 and 16."
          error={errors.dailyHours}
        />

        <SectionTitle>Preferred study time</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }}>
          {STUDY_TIMES.map((slot) => (
            <Chip key={slot} label={labelForEnum(slot)} active={form.studyTime === slot} onPress={() => setForm({ ...form, studyTime: slot })} />
          ))}
        </Row>

        <SectionTitle>Learning style</SectionTitle>
        <Row style={{ flexWrap: 'wrap' }}>
          {LEARNING_STYLES.map((style) => (
            <Chip key={style} label={labelForEnum(style)} active={form.learningStyle === style} onPress={() => setForm({ ...form, learningStyle: style })} />
          ))}
        </Row>

        <View style={{ height: 8 }} />
        {complete.error ? <InlineNotice tone="danger" label={toUserError(complete.error).message} /> : null}
        {saved ? <InlineNotice tone="success" label="Saved on the server. Your planner will use this profile." /> : null}
        <Button label="Save academic setup" onPress={submit} loading={complete.isPending} disabled={complete.isPending} />
      </StateView>
    </Screen>
  );
}
