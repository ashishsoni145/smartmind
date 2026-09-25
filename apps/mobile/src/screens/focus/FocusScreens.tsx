import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { focusApiRemote } from '../../api';
import { Button, Card, Chip, Heading, Screen, TextField } from '../../components/ui';
import { validateRules, type RestrictionRule } from '../../features/focus/rules';
import { focusNative, NativeUnavailableError, type FocusSnapshot, type SupportedApp } from '../../features/focus/nativeFocus';
import type { FocusStackParamList } from '../../navigation/types';
import { enqueue, markResult, pendingItems, type SyncItem } from '../../services/syncQueue';
import { useTheme } from '../../theme/ThemeProvider';
import { formatClock } from '../../utils/format';
import { toUserError } from '../../utils/errors';

export function FocusHomeScreen({ navigation }: NativeStackScreenProps<FocusStackParamList, 'FocusHome'>) {
  const theme = useTheme();
  const available = focusNative.available();
  return (
    <Screen>
      <Heading subtitle="Focus is a native restriction session, not a timer pretending to block apps.">Focus</Heading>
      <Card>
        <Text style={{ color: available ? theme.colors.success : theme.colors.danger }}>
          {available ? 'Kotlin focus module is linked.' : 'Focus enforcement is unavailable because the native module is not linked. No blocking is simulated.'}
        </Text>
      </Card>
      <Button label="Configure session" onPress={() => navigation.navigate('FocusSetup')} disabled={!available} />
      <Button label="Permissions" tone="ghost" onPress={() => navigation.navigate('Permissions')} disabled={!available} />
      <Button label="Current session" tone="ghost" onPress={() => navigation.navigate('FocusSession')} disabled={!available} />
    </Screen>
  );
}

export function PermissionSetupScreen() {
  const theme = useTheme();
  const [report, setReport] = useState<string>('Permissions are checked only when you ask.');
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const status = await focusNative.permissions();
      setReport(`Usage ${status.usageAccess}. Accessibility ${status.accessibility}. Notifications ${status.notifications}.`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read permissions.');
    }
  }

  return (
    <Screen>
      <Heading subtitle="Each permission is optional until you start enforcement. SharpMind explains the data and how to turn it off.">Permission setup</Heading>
      <Card>
        <Text style={{ fontWeight: '700' }}>Usage access</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Sees which app is in the foreground so a whole-app block can be noticed. Raw usage is not uploaded.</Text>
        <Button label="Open usage settings" onPress={() => focusNative.openUsageAccessSettings()} />
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>Accessibility</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Needed only for selective surfaces such as Shorts or Reels. It is not a disability tool. Window content is matched on device and discarded. You can disable it in Android Settings; SharpMind cannot stop you.</Text>
        <Button label="Open accessibility settings" onPress={() => focusNative.openAccessibilitySettings()} />
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>Notifications</Text>
        <Text style={{ color: theme.colors.textSecondary }}>Shows the visible focus notification and reminders you enable. Not requested at first launch.</Text>
        <Button label="Open notification settings" onPress={() => focusNative.openNotificationSettings()} />
      </Card>
      <Button label="Verify" onPress={refresh} />
      <Text style={{ color: theme.colors.textSecondary }}>{report}</Text>
      {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
    </Screen>
  );
}

export function FocusSetupScreen({ navigation }: NativeStackScreenProps<FocusStackParamList, 'FocusSetup'>) {
  const [objective, setObjective] = useState('Deep work block');
  const [minutes, setMinutes] = useState('25');
  const [strict, setStrict] = useState(false);
  const [apps, setApps] = useState<SupportedApp[]>([]);
  const [selected, setSelected] = useState<Record<string, RestrictionRule['ruleType']>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    focusNative.installedApps().then(setApps).catch((err) => setError(err instanceof Error ? err.message : 'Could not list apps.'));
  }, []);

  function toggle(app: SupportedApp, type: RestrictionRule['ruleType']) {
    setSelected((current) => {
      const next = { ...current };
      if (next[app.packageName] === type) delete next[app.packageName];
      else next[app.packageName] = type;
      return next;
    });
  }

  async function start() {
    const rules: RestrictionRule[] = Object.entries(selected).map(([packageName, ruleType], index) => ({
      id: `${packageName}-${ruleType}`,
      packageName,
      ruleType,
      target: ruleType === 'CONTENT_RESTRICTION' ? (packageName.includes('youtube') ? 'shorts' : 'reels') : '*',
      enabled: true,
      priority: 10 - index,
      focusSessionId: null,
      createdAt: new Date().toISOString(),
    }));
    const validation = validateRules(rules);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }
    try {
      await focusNative.setRules(rules.map((rule) => ({ ...rule, focusSessionId: rule.focusSessionId, createdAtEpochMs: Date.now() })));
      await focusNative.start({
        objective,
        targetDurationMinutes: Number(minutes) || 25,
        strictMode: strict,
        ruleIds: rules.map((rule) => rule.id),
      });
      navigation.navigate('FocusSession');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start.');
    }
  }

  return (
    <Screen>
      <Heading subtitle="Whole-app blocks use usage access. Selective Shorts or Reels rules need accessibility and fail safe if the other app does not expose that surface.">Configure focus</Heading>
      <TextField label="Objective" value={objective} onChangeText={setObjective} autoCapitalize="sentences" />
      <TextField label="Minutes" value={minutes} onChangeText={setMinutes} keyboardType="numeric" />
      <Chip label={strict ? 'Strict Mode on' : 'Strict Mode off'} active={strict} onPress={() => setStrict((value) => !value)} />
      <Text>Strict Mode asks for confirmation before ending. It does not hide SharpMind, block Settings, or prevent uninstall.</Text>
      {apps.filter((app) => app.adapterId !== 'generic').map((app) => (
        <Card key={app.packageName}>
          <Text>{app.label} · {app.installed ? 'installed' : 'not installed'}</Text>
          <Text>{app.selectiveTargets.length ? `Selective: ${app.selectiveTargets.join(', ')}` : 'Whole-app block only. Selective content is unsupported.'}</Text>
          <Button label="Block app" tone="ghost" onPress={() => toggle(app, 'APP_BLOCK')} />
          {app.selectiveTargets.length ? <Button label={`Restrict ${app.selectiveTargets[0]}`} tone="ghost" onPress={() => toggle(app, 'CONTENT_RESTRICTION')} /> : null}
        </Card>
      ))}
      {error ? <Text>{error}</Text> : null}
      <Button label="Start native session" onPress={start} />
    </Screen>
  );
}

export function FocusSessionScreen() {
  const theme = useTheme();
  const [snapshot, setSnapshot] = useState<FocusSnapshot | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [queue, setQueue] = useState<SyncItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    let stop = () => {};
    focusNative.status().then(setSnapshot).catch((err) => setError(err instanceof NativeUnavailableError ? err.message : err.message));
    stop = focusNative.subscribe((event) => {
      setEvents((current) => [`${event.type}`, ...current].slice(0, 8));
      if (event.type === 'focus_status' || event.type === 'permission_revoked') {
        focusNative.status().then(setSnapshot).catch(() => undefined);
      }
      if (event.type === 'restriction_triggered') {
        setQueue((current) => enqueue(current, { id: String(event.payload.id || Date.now()), kind: 'restriction_triggered', payload: event.payload }));
      }
    });
    return stop;
  }, []);

  const sync = useMutation({
    mutationFn: async (item: SyncItem) => {
      if (!snapshot?.backendSessionId) {
        throw new Error('No server focus session id yet. The event stays pending.');
      }
      if (item.kind === 'restriction_triggered') {
        await focusApiRemote.interruption(snapshot.backendSessionId, {
          reason: `restriction:${item.payload.ruleType}:${item.payload.packageName}`,
          durationSeconds: 0,
        });
      }
    },
    onSuccess: (_data, item) => setQueue((current) => markResult(current, item.id, true)),
    onError: (err, item) => setQueue((current) => markResult(current, item.id, false, toUserError(err).message)),
  });

  async function connectServer() {
    if (!snapshot) return;
    try {
      const remote = await focusApiRemote.start({
        objective: snapshot.objective || 'Focus session',
        targetDurationMinutes: snapshot.targetDurationMinutes,
        subjectId: snapshot.subjectId || undefined,
        curriculumNodeId: snapshot.curriculumNodeId || undefined,
        taskId: snapshot.taskId || undefined,
      });
      setEvents((current) => [`server:${remote.id}`, ...current]);
    } catch (err) {
      setError(toUserError(err).message);
    }
  }

  const elapsed = snapshot ? Math.floor(snapshot.activeElapsedMs / 1000) : 0;
  return (
    <Screen>
      <Heading subtitle={snapshot?.phase || 'IDLE'}>{formatClock(elapsed)}</Heading>
      <Text style={{ color: theme.colors.textSecondary }}>{snapshot?.objective || 'No native session.'}</Text>
      {snapshot?.failureReason ? <Text style={{ color: theme.colors.warning }}>{snapshot.failureReason}</Text> : null}
      {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
      <Button label="Pause" onPress={() => focusNative.pause().then(setSnapshot).catch((err) => setError(err.message))} />
      <Button label="Resume" onPress={() => focusNative.resume().then(setSnapshot).catch((err) => setError(err.message))} />
      <Button label={hold ? 'Confirm end' : snapshot?.strictMode ? 'Hold to end' : 'End'} tone="danger" onPress={() => {
        if (snapshot?.strictMode && !hold) {
          setHold(true);
          return;
        }
        focusNative.stop(true).then(setSnapshot).catch((err) => setError(err.message));
      }} />
      <Button label="Record on server" tone="ghost" onPress={connectServer} />
      <Card>
        <Text style={{ fontWeight: '700' }}>Sync queue</Text>
        {pendingItems(queue).length === 0 ? <Text>No pending restriction events.</Text> : pendingItems(queue).map((item) => (
          <View key={item.id}>
            <Text>{item.kind} · {item.status}</Text>
            <Button label="Retry sync" tone="ghost" onPress={() => sync.mutate(item)} />
          </View>
        ))}
      </Card>
      {events.map((event) => <Text key={event}>{event}</Text>)}
    </Screen>
  );
}
