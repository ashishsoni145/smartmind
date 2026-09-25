import React from 'react';
import { Pressable, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { analyticsApi, assessmentApi, backlogApi, focusApiRemote, plannerApi, revisionApi, studentApi } from '../../api';
import { Button, Card, Heading, InlineNotice, ListRow, Screen, SectionTitle, StateView, Text } from '../../components/ui';
import { mapCalibration, mapPlanTasks, mapRevisionDue, nextAction } from '../../features/home/mapDashboard';
import { useStudent } from '../../hooks/useStudent';
import type { MainTabParamList, StudyStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { titleCase } from '../../utils/format';
import { toUserError } from '../../utils/errors';
import { greeting } from './homeFormat';

type HomeNav = NavigationProp<MainTabParamList>;

function studyRoute(route: string): keyof StudyStackParamList {
  if (route === 'Tests' || route === 'Revision' || route === 'Planner') return route;
  return 'StudyHub';
}

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<HomeNav>();
  const student = useStudent();
  const studentId = student.studentId;
  const enabled = Boolean(studentId);
  const plan = useQuery({ queryKey: ['plan', studentId], enabled, queryFn: () => plannerApi.today(studentId!) });
  const revision = useQuery({ queryKey: ['revision-due', studentId], enabled, queryFn: () => revisionApi.due(studentId!, { limit: 5 }) });
  const summary = useQuery({ queryKey: ['model', studentId], enabled, queryFn: () => studentApi.summary(studentId!) });
  const backlog = useQuery({ queryKey: ['backlog', studentId], enabled, queryFn: () => backlogApi.list(studentId!, { limit: 3 }) });
  const health = useQuery({ queryKey: ['health'], enabled, queryFn: () => analyticsApi.health() });
  const tests = useQuery({ queryKey: ['assessments'], enabled, queryFn: () => assessmentApi.list({ limit: 3 }) });
  const focus = useQuery({ queryKey: ['focus-history'], enabled, queryFn: () => focusApiRemote.list({ limit: 3 }) });
  const profile = student.profile as { knowledgeModelStatus?: string; gradeId?: string; boardId?: string; targetExamGoals?: Array<{ examId?: string }> } | null;
  const calibration = mapCalibration(summary.data, profile?.knowledgeModelStatus || null);
  const tasks = mapPlanTasks(plan.data);
  const due = mapRevisionDue(revision.data);
  const backlogItems = (backlog.data as { items?: Array<{ title?: string }> } | undefined)?.items || [];
  const action = nextAction({ calibrated: calibration.calibrated, tasks, revisions: due, backlogTitle: backlogItems[0]?.title || null });
  const loading = student.loading || (enabled && plan.isLoading && summary.isLoading);
  const error = student.error ? toUserError(student.error) : null;
  const refreshing = plan.isRefetching || summary.isRefetching;
  const testsTotal = (tests.data as { total?: number } | undefined)?.total ?? (tests.data as { assessments?: unknown[] } | undefined)?.assessments?.length ?? null;
  const focusCount = (focus.data as { sessions?: unknown[] } | undefined)?.sessions?.length ?? null;

  function refreshAll() {
    plan.refetch();
    revision.refetch();
    summary.refetch();
    backlog.refetch();
    health.refetch();
    tests.refetch();
    focus.refetch();
  }

  function openStudy(route: keyof StudyStackParamList) {
    navigation.navigate('StudyTab', { screen: route } as never);
  }

  return (
    <Screen headerless refreshing={refreshing} onRefresh={refreshAll}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Heading subtitle={[profile?.boardId, profile?.gradeId, profile?.targetExamGoals?.[0]?.examId].filter(Boolean).join(' · ') || 'Academic identity loads from your profile.'}>
            {`${greeting()}, ${student.user?.fullName?.split(' ')[0] || 'learner'}`}
          </Heading>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          hitSlop={8}
          onPress={() => navigation.navigate('HomeTab', { screen: 'Profile' } as never)}
          style={({ pressed }) => ({ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: pressed ? theme.colors.elevated : theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border })}>
          <Text tone="accent" weight="600">Profile</Text>
        </Pressable>
      </View>

      <StateView loading={loading} loadingLabel="Loading your dashboard" error={error} onRetry={() => student.refetch()}>
        {!enabled ? <InlineNotice tone="warning" label="No student profile is attached to this account, so the planner and progress cannot load." /> : null}

        <Card tone="accent">
          <Text tone="muted" variant="small">Next action</Text>
          <Text variant="title" weight="700">{action.title}</Text>
          <Text tone="secondary">{action.detail}</Text>
          <Button label="Open" onPress={() => openStudy(studyRoute(action.route))} />
        </Card>

        <Card>
          <Text weight="700">{calibration.calibrated ? 'Student model' : 'Not calibrated'}</Text>
          {summary.error ? <Text tone="danger" variant="small">{toUserError(summary.error).message}</Text> : null}
          <Text tone="secondary">{calibration.reason}</Text>
          {calibration.calibrated ? (
            <Text>Mastery {calibration.mastery ?? '—'} · Retention {calibration.retention ?? '—'} · Evidence {calibration.evidenceCount ?? '—'}</Text>
          ) : null}
          {calibration.weakTopics.slice(0, 3).map((topic) => (
            <Text key={topic.title} tone="warning" variant="small">{topic.title}{topic.mastery == null ? '' : ` · ${topic.mastery}`}</Text>
          ))}
        </Card>

        <SectionTitle action="Planner" onAction={() => openStudy('Planner')}>Today’s plan</SectionTitle>
        <Card>
          {plan.isLoading ? <Text tone="secondary">Loading plan…</Text> : null}
          {plan.error ? (
            <>
              <Text tone="danger" variant="small">{toUserError(plan.error).message}</Text>
              <Button label="Retry" tone="ghost" compact onPress={() => plan.refetch()} />
            </>
          ) : null}
          {!plan.isLoading && !plan.error && tasks.length === 0 ? <Text tone="secondary">The planner returned no tasks for today.</Text> : null}
          {tasks.slice(0, 4).map((task) => (
            <ListRow key={task.id} title={task.title} meta={[titleCase(task.status), task.minutes ? `${task.minutes}m` : null].filter(Boolean).join(' · ')} />
          ))}
        </Card>

        <SectionTitle action="Revision" onAction={() => openStudy('Revision')}>Revision due</SectionTitle>
        <Card>
          {revision.isLoading ? <Text tone="secondary">Loading…</Text> : null}
          {revision.error ? <Text tone="danger" variant="small">{toUserError(revision.error).message}</Text> : null}
          {!revision.isLoading && !revision.error && due.length === 0 ? <Text tone="secondary">Nothing is due right now.</Text> : null}
          {due.slice(0, 3).map((item) => (
            <ListRow key={item.id} title={item.title} />
          ))}
        </Card>

        <SectionTitle>Assessments and focus</SectionTitle>
        <Card>
          <ListRow title="Tests on the server" meta={tests.isLoading ? '…' : tests.error ? 'unavailable' : testsTotal == null ? '—' : String(testsTotal)} onPress={() => openStudy('Tests')} />
          <ListRow title="Recent focus sessions" meta={focus.isLoading ? '…' : focus.error ? 'unavailable' : focusCount == null ? '—' : String(focusCount)} onPress={() => navigation.navigate('FocusTab')} />
          <ListRow
            title="Health score"
            meta={health.isLoading ? '…' : health.error ? 'unavailable' : health.data?.overallScore == null ? '—' : String(health.data.overallScore)}
            subtitle={health.data?.dimensions?.some((item) => item.status === 'uncalibrated') ? 'Some dimensions are still uncalibrated' : null}
            onPress={() => navigation.navigate('ProgressTab')}
          />
        </Card>
      </StateView>
    </Screen>
  );
}
