import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Card, Chip, Heading, InlineNotice, ListRow, Row, Screen, SectionTitle, StateView, Text, TextField } from '../../components/ui';
import { validateRules, type RestrictionRule } from '../../features/focus/rules';
import { focusNative, type PermissionReport, type SupportedApp } from '../../features/focus/nativeFocus';
import { allowedActions, appLabel, describePhase, elapsedMs, remainingMs, validateSetup } from '../../features/focus/focusModel';
import { PERMISSION_EXPLAINERS, openSettingsFor, requestNotifications, statusFromReport, type PermissionId } from '../../features/focus/permissions';
import { useFocusSession } from '../../features/focus/useFocusSession';
import type { FocusStackParamList } from '../../navigation/types';
import { pendingItems } from '../../services/syncQueue';
import { useTheme } from '../../theme/ThemeProvider';
import { formatClock } from '../../utils/format';
import { toUserError } from '../../utils/errors';

function usePermissionReport() {
  const [report, setReport] = useState<PermissionReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    if (!focusNative.available()) return;
    try {
      setReport(await focusNative.permissions());
      setError(null);
    } catch (err) {
      setError(toUserError(err).message);
    }
  }, []);
  useFocusEffect(useCallback(() => {
    refresh();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]));
  return { report, error, refresh };
}

export function FocusHomeScreen({ navigation }: NativeStackScreenProps<FocusStackParamList, 'FocusHome'>) {
  const available = focusNative.available();
  const session = useFocusSession();
  const { report } = usePermissionReport();
  const actions = allowedActions(session.snapshot);
  const phase = describePhase(session.snapshot);
  const missing = PERMISSION_EXPLAINERS.filter((item) => statusFromReport(report, item.id) === 'missing');
  return (
    <Screen>
      <Heading subtitle="A native restriction session run by the Kotlin service, not a timer pretending to block apps.">Focus</Heading>
      {!available ? (
        <InlineNotice tone="danger" label="Unavailable on this build">
          The native focus module is not linked, so enforcement cannot run. Nothing is simulated.
        </InlineNotice>
      ) : null}
      {available ? (
        <Card tone={session.snapshot?.phase === 'ACTIVE' ? 'accent' : 'default'}>
          <Text tone="muted" variant="small">Current state</Text>
          <Text variant="title" weight="700">{phase.title}</Text>
          <Text tone="secondary">{phase.detail}</Text>
          {session.snapshot && !actions.canStartNew ? (
            <Button label="Open session" onPress={() => navigation.navigate('FocusSession')} />
          ) : null}
        </Card>
      ) : null}
      {available && missing.length > 0 ? (
        <InlineNotice tone="warning" label="Permissions not granted yet">
          {`${missing.map((item) => item.title).join(', ')} ${missing.length === 1 ? 'is' : 'are'} off. Rules that need them will not be enforced; SharpMind will tell you instead of pretending.`}
        </InlineNotice>
      ) : null}
      <Button label="Configure a session" onPress={() => navigation.navigate('FocusSetup')} disabled={!available || !actions.canStartNew} />
      <Button label="Permissions and privacy" tone="secondary" onPress={() => navigation.navigate('Permissions')} disabled={!available} />
      <Card>
        <Text weight="700">What Focus can and cannot do</Text>
        <Text tone="secondary" variant="small">• Detects the foreground app with usage access and opens SharpMind's own intervention screen. It cannot close other apps.</Text>
        <Text tone="secondary" variant="small">• Blocks Shorts or Reels only when the accessibility service sees the player itself; otherwise it reports “unsupported”.</Text>
        <Text tone="secondary" variant="small">• Never interferes with Android Settings, System UI, permission screens or uninstalling SharpMind.</Text>
      </Card>
    </Screen>
  );
}

export function PermissionSetupScreen() {
  const { report, error, refresh } = usePermissionReport();
  const [busy, setBusy] = useState<PermissionId | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function enable(id: PermissionId) {
    setBusy(id);
    setNotice(null);
    try {
      if (id === 'notifications') {
        const result = await requestNotifications();
        if (result === 'denied') setNotice('Notifications stay off. Focus sessions cannot start without the visible notification Android requires.');
        if (result === 'settings') setNotice('Turn on notifications for SharpMind in the system page, then come back.');
      } else {
        await openSettingsFor(id);
        setNotice('Enable SharpMind in the system page that opened, then return here. The status refreshes automatically.');
      }
    } catch (err) {
      setNotice(toUserError(err).message);
    } finally {
      setBusy(null);
      refresh();
    }
  }

  return (
    <Screen>
      <Heading subtitle="Each permission is optional. Grant only what the rules you want actually need; the rest of SharpMind works without them.">Permissions</Heading>
      {error ? <InlineNotice tone="danger" label="Could not read permission state">{error}</InlineNotice> : null}
      {PERMISSION_EXPLAINERS.map((item) => {
        const status = statusFromReport(report, item.id);
        return (
          <Card key={item.id} tone={status === 'granted' ? 'success' : 'default'}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text variant="heading" weight="700">{item.title}</Text>
              <Text variant="small" weight="600" tone={status === 'granted' ? 'success' : status === 'missing' ? 'warning' : 'muted'} accessibilityLabel={`${item.title} status: ${status}`}>
                {status === 'granted' ? '✓ On' : status === 'missing' ? 'Off' : 'Checking'}
              </Text>
            </Row>
            <Text tone="secondary" variant="small"><Text weight="600" variant="small">What it does. </Text>{item.what}</Text>
            <Text tone="secondary" variant="small"><Text weight="600" variant="small">Why SharpMind asks. </Text>{item.why}</Text>
            <Text tone="secondary" variant="small"><Text weight="600" variant="small">Data processed. </Text>{item.data}</Text>
            <Text tone="secondary" variant="small"><Text weight="600" variant="small">Uploaded. </Text>{item.uploaded}</Text>
            <Text tone="secondary" variant="small"><Text weight="600" variant="small">Needed for. </Text>{item.requiredFor}</Text>
            <Text tone="secondary" variant="small"><Text weight="600" variant="small">Turn it off. </Text>{item.disable}</Text>
            {status !== 'granted' ? (
              <Button label={item.id === 'notifications' ? 'Allow notifications' : `Open ${item.title.toLowerCase()} settings`} onPress={() => enable(item.id)} loading={busy === item.id} />
            ) : null}
          </Card>
        );
      })}
      {notice ? <InlineNotice tone="accent">{notice}</InlineNotice> : null}
      <Button label="Check again" tone="secondary" onPress={refresh} />
    </Screen>
  );
}

type Selection = Record<string, RestrictionRule['ruleType']>;

export function FocusSetupScreen({ navigation }: NativeStackScreenProps<FocusStackParamList, 'FocusSetup'>) {
  const [objective, setObjective] = useState('');
  const [minutes, setMinutes] = useState('25');
  const [strict, setStrict] = useState(false);
  const [apps, setApps] = useState<SupportedApp[] | null>(null);
  const [appsError, setAppsError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Selection>({});
  const [fieldError, setFieldError] = useState<{ field: 'objective' | 'minutes'; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const { report } = usePermissionReport();

  useEffect(() => {
    let cancelled = false;
    focusNative
      .installedApps()
      .then((list) => { if (!cancelled) setApps(list); })
      .catch((err) => { if (!cancelled) setAppsError(toUserError(err).message); });
    return () => { cancelled = true; };
  }, []);

  const adapters = useMemo(() => (apps || []).filter((app) => app.adapterId !== 'generic'), [apps]);
  const generic = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    const list = (apps || []).filter((app) => app.adapterId === 'generic');
    if (!needle) return list.slice(0, 12);
    return list.filter((app) => app.label.toLowerCase().includes(needle) || app.packageName.includes(needle)).slice(0, 30);
  }, [apps, filter]);

  const needsAccessibility = Object.values(selected).includes('CONTENT_RESTRICTION');
  const usageMissing = statusFromReport(report, 'usageAccess') === 'missing';
  const accessibilityMissing = needsAccessibility && statusFromReport(report, 'accessibility') === 'missing';
  const notificationsMissing = statusFromReport(report, 'notifications') === 'missing';

  function toggle(app: SupportedApp, type: RestrictionRule['ruleType']) {
    setSelected((current) => {
      const next = { ...current };
      if (next[app.packageName] === type) delete next[app.packageName];
      else next[app.packageName] = type;
      return next;
    });
  }

  async function start() {
    setError(null);
    const setup = validateSetup(objective, minutes);
    if (!setup.ok) {
      setFieldError({ field: setup.field, message: setup.message });
      return;
    }
    setFieldError(null);
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
    setStarting(true);
    try {
      await focusNative.setRules(rules.map((rule) => ({ ...rule, createdAtEpochMs: Date.now() })));
      const snapshot = await focusNative.start({
        objective: setup.objective,
        targetDurationMinutes: setup.minutes,
        strictMode: strict,
        ruleIds: rules.map((rule) => rule.id),
      });
      if (snapshot.phase === 'PERMISSION_REQUIRED') {
        navigation.replace('Permissions');
        return;
      }
      navigation.replace('FocusSession');
    } catch (err) {
      setError(toUserError(err).message);
    } finally {
      setStarting(false);
    }
  }

  return (
    <Screen>
      <Heading subtitle="Whole-app blocks use usage access. Shorts or Reels rules need the accessibility service and fail safe when the player cannot be identified.">Configure focus</Heading>
      <TextField label="Objective" value={objective} onChangeText={setObjective} autoCapitalize="sentences" placeholder="e.g. Finish rotational motion problem set" error={fieldError?.field === 'objective' ? fieldError.message : null} />
      <TextField label="Minutes (5–180)" value={minutes} onChangeText={setMinutes} keyboardType="numeric" error={fieldError?.field === 'minutes' ? fieldError.message : null} />
      <Row>
        {[25, 45, 60, 90].map((preset) => <Chip key={preset} label={`${preset} min`} active={minutes === String(preset)} onPress={() => setMinutes(String(preset))} />)}
      </Row>
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text weight="700">Strict Mode</Text>
          <Chip label={strict ? 'On' : 'Off'} active={strict} onPress={() => setStrict((value) => !value)} />
        </Row>
        <Text tone="secondary" variant="small">Asks for a second confirmation before ending an active session. It does not hide SharpMind, block Settings, or prevent uninstalling.</Text>
      </Card>

      <SectionTitle>Apps with selective rules</SectionTitle>
      <StateView loading={apps == null && !appsError} error={appsError} empty={apps && adapters.length === 0 ? 'No supported apps found.' : null}>
        {adapters.map((app) => (
          <Card key={app.packageName}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text weight="700">{appLabel(app.packageName)}</Text>
              <Text tone={app.installed ? 'secondary' : 'muted'} variant="small">{app.installed ? 'Installed' : 'Not installed'}</Text>
            </Row>
            <Row>
              <Chip label="Block whole app" active={selected[app.packageName] === 'APP_BLOCK'} onPress={() => toggle(app, 'APP_BLOCK')} disabled={!app.installed} />
              {app.selectiveTargets.length ? (
                <Chip label={`Restrict ${app.selectiveTargets[0]} only`} active={selected[app.packageName] === 'CONTENT_RESTRICTION'} onPress={() => toggle(app, 'CONTENT_RESTRICTION')} disabled={!app.installed} />
              ) : null}
            </Row>
            {selected[app.packageName] === 'CONTENT_RESTRICTION' ? (
              <Text tone="secondary" variant="caption">Needs the accessibility service. Ordinary videos and feeds stay available; only the {app.selectiveTargets[0]} player is matched.</Text>
            ) : null}
          </Card>
        ))}
      </StateView>

      <SectionTitle>Other installed apps</SectionTitle>
      <TextField label="Search apps" value={filter} onChangeText={setFilter} placeholder="Type an app name" hint="Whole-app block only. Selective content rules are unsupported for these apps." />
      {generic.map((app) => (
        <ListRow
          key={app.packageName}
          title={app.label}
          subtitle={app.packageName}
          onPress={() => toggle(app, 'APP_BLOCK')}
          trailing={<Text tone={selected[app.packageName] ? 'accent' : 'muted'} variant="small" weight="600">{selected[app.packageName] ? '✓ Blocked' : 'Block'}</Text>}
          accessibilityHint={selected[app.packageName] ? 'Selected. Tap to remove the block.' : 'Tap to block this app during the session.'}
        />
      ))}

      {usageMissing ? <InlineNotice tone="warning" label="Usage access is off">Whole-app, focus-only and time-limit rules cannot be enforced until you enable it. The session will wait in “Permission needed”.</InlineNotice> : null}
      {accessibilityMissing ? <InlineNotice tone="warning" label="Accessibility service is off">Shorts/Reels rules need it. Without it the session will wait in “Permission needed”.</InlineNotice> : null}
      {notificationsMissing ? <InlineNotice tone="warning" label="Notifications are off">Android requires a visible notification for the focus service.</InlineNotice> : null}
      {(usageMissing || accessibilityMissing || notificationsMissing) ? <Button label="Fix permissions first" tone="secondary" onPress={() => navigation.navigate('Permissions')} /> : null}
      {error ? <InlineNotice tone="danger" label="Could not start">{error}</InlineNotice> : null}
      <Button label="Start native session" onPress={start} loading={starting} />
    </Screen>
  );
}

export function FocusSessionScreen({ navigation }: NativeStackScreenProps<FocusStackParamList, 'FocusSession'>) {
  const theme = useTheme();
  const session = useFocusSession();
  const [now, setNow] = useState(Date.now());
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const snapshot = session.snapshot;
  const actions = allowedActions(snapshot);
  const phase = describePhase(snapshot);

  useEffect(() => {
    if (snapshot?.phase !== 'ACTIVE') return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [snapshot?.phase]);

  useEffect(() => {
    if (!confirmEnd) return;
    const timer = setTimeout(() => setConfirmEnd(false), 6000);
    return () => clearTimeout(timer);
  }, [confirmEnd]);

  // Link to the server as soon as an active native session exists (once per native id).
  useEffect(() => {
    if (snapshot && snapshot.id && !snapshot.backendSessionId && (snapshot.phase === 'ACTIVE' || snapshot.phase === 'PAUSED') && session.serverLink === 'idle') {
      session.linkToServer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot?.id, snapshot?.backendSessionId, snapshot?.phase, session.serverLink]);

  const elapsed = Math.floor(elapsedMs(snapshot, now) / 1000);
  const remaining = Math.floor(remainingMs(snapshot, now) / 1000);
  const pending = pendingItems(session.queue);

  async function act(name: string, action: () => Promise<import('../../features/focus/nativeFocus').FocusSnapshot>) {
    setBusy(name);
    await session.run(action);
    setBusy(null);
  }

  function endSession() {
    if (actions.needsStrictConfirm && !confirmEnd) {
      setConfirmEnd(true);
      return;
    }
    setConfirmEnd(false);
    act('end', () => focusNative.stop(true));
  }

  const terminal = snapshot?.phase === 'COMPLETED' || snapshot?.phase === 'CANCELLED' || snapshot?.phase === 'FAILED';

  return (
    <Screen>
      <Card tone={snapshot?.phase === 'ACTIVE' ? 'accent' : snapshot?.phase === 'PERMISSION_REQUIRED' ? 'warning' : 'default'}>
        <Text tone="muted" variant="small">{phase.title}</Text>
        <Text accessibilityRole="header" accessibilityLabel={`Elapsed ${formatClock(elapsed)}`} style={{ fontSize: 52, fontWeight: '700', letterSpacing: -1, color: theme.colors.text, lineHeight: 60 }}>
          {formatClock(elapsed)}
        </Text>
        {snapshot && !terminal ? <Text tone="secondary">{formatClock(remaining)} remaining of {snapshot.targetDurationMinutes} min</Text> : null}
        <Text weight="600">{snapshot?.objective || 'No native session.'}</Text>
        <Text tone="secondary" variant="small">{phase.detail}</Text>
      </Card>

      {session.error ? <InlineNotice tone="danger" label="Native engine">{session.error.message}</InlineNotice> : null}

      {snapshot && !terminal && snapshot.phase !== 'IDLE' ? (
        <View style={{ gap: 10 }}>
          {actions.canPause ? <Button label="Pause" tone="secondary" onPress={() => act('pause', () => focusNative.pause())} loading={busy === 'pause'} /> : null}
          {actions.canResume ? <Button label="Resume" onPress={() => act('resume', () => focusNative.resume())} loading={busy === 'resume'} /> : null}
          {actions.canRetryPermissions ? (
            <>
              <Button label="Open permissions" tone="secondary" onPress={() => navigation.navigate('Permissions')} />
              <Button label="Check permissions again" onPress={() => act('retry', () => focusNative.retryPermissions())} loading={busy === 'retry'} />
            </>
          ) : null}
          {actions.canEnd ? (
            <Button
              label={confirmEnd ? 'Tap again to confirm ending' : actions.needsStrictConfirm ? 'End session (Strict Mode)' : 'End session'}
              tone="danger"
              onPress={endSession}
              loading={busy === 'end'}
              accessibilityHint={actions.needsStrictConfirm ? 'Strict Mode requires a second tap to confirm.' : undefined}
            />
          ) : null}
          {actions.canCancel && snapshot.phase !== 'ACTIVE' ? (
            <Button label="Discard session" tone="ghost" onPress={() => act('cancel', () => focusNative.cancel(true))} loading={busy === 'cancel'} />
          ) : null}
        </View>
      ) : null}

      {terminal || snapshot?.phase === 'IDLE' ? (
        <Button label="Start a new session" onPress={() => navigation.replace('FocusSetup')} />
      ) : null}

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text weight="700">Server record</Text>
          <Text variant="small" weight="600" tone={snapshot?.backendSessionId ? 'success' : session.serverLink === 'offline' ? 'warning' : 'muted'}>
            {snapshot?.backendSessionId ? '✓ Linked' : session.serverLink === 'linking' ? 'Linking…' : session.serverLink === 'offline' ? 'Offline' : session.serverLink === 'failed' ? 'Failed' : 'Not linked'}
          </Text>
        </Row>
        <Text tone="secondary" variant="small">
          {snapshot?.backendSessionId
            ? 'Restriction events and the final duration are recorded in your focus history.'
            : 'Enforcement runs on the device either way. Linking records this session in your history when the server is reachable.'}
        </Text>
        {session.serverError ? <Text tone="danger" variant="small">{session.serverError.message}</Text> : null}
        {snapshot && !snapshot.backendSessionId && snapshot.id && !terminal ? (
          <Button label="Retry server link" tone="secondary" compact onPress={session.linkToServer} loading={session.serverLink === 'linking'} />
        ) : null}
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text weight="700">Pending sync</Text>
          <Text tone="muted" variant="small">{pending.length === 0 ? 'Nothing pending' : `${pending.length} waiting`}</Text>
        </Row>
        {pending.slice(0, 5).map((item) => (
          <Text key={item.id} tone="secondary" variant="small">
            {item.kind.replace(/_/g, ' ')} · {item.status}{item.attempts ? ` · ${item.attempts} attempt(s)` : ''}{item.lastError ? ` · ${item.lastError}` : ''}
          </Text>
        ))}
        {pending.length > 0 ? <Button label="Retry sync now" tone="secondary" compact onPress={session.flushQueue} /> : null}
      </Card>

      {session.activity.length > 0 ? (
        <Card>
          <Text weight="700">Activity</Text>
          {session.activity.map((item) => (
            <Text key={item.id} tone="secondary" variant="small">{new Date(item.at).toLocaleTimeString()} · {item.text}</Text>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
