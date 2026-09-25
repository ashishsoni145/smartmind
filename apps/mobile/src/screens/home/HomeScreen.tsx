import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { analyticsApi, assessmentApi, backlogApi, focusApiRemote, plannerApi, revisionApi, studentApi } from '../../api';
import { Button, Card, Heading, Screen, StateView } from '../../components/ui';
import { mapCalibration, mapPlanTasks, mapRevisionDue, nextAction } from '../../features/home/mapDashboard';
import { useStudent } from '../../hooks/useStudent';
import { useTheme } from '../../theme/ThemeProvider';
import { titleCase } from '../../utils/format';
import { greeting } from './homeFormat';
import { toUserError } from '../../utils/errors';

function toUserMessageFromUnknown(error: unknown): string {
  return toUserError(error).message;
}

export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
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
  const loading = student.loading || plan.isLoading || summary.isLoading;
  const error = student.error ? toUserMessageFromUnknown(student.error) : null;

  return (
    <Screen
      refreshing={plan.isRefetching}
      onRefresh={() => {
        plan.refetch();
        revision.refetch();
        summary.refetch();
        backlog.refetch();
        health.refetch();
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading subtitle={[profile?.boardId, profile?.gradeId, profile?.targetExamGoals?.[0]?.examId].filter(Boolean).join(' · ') || 'Academic identity loads from your profile.'}>
          {`${greeting()}, ${student.user?.fullName?.split(' ')[0] || 'learner'}`}
        </Heading>
        <Pressable accessibilityLabel="Profile" onPress={() => navigation.navigate('Profile')}>
          <Text style={{ color: theme.colors.accent }}>Profile</Text>
        </Pressable>
      </View>
      <StateView loading={loading} error={error} onRetry={() => student.refetch()}>
        <Card>
          <Text style={{ color: theme.colors.textMuted }}>Next action</Text>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '700' }}>{action.title}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>{action.detail}</Text>
          <Button label="Open" onPress={() => navigation.getParent()?.navigate(action.route === 'Tests' || action.route === 'Planner' || action.route === 'Revision' ? 'StudyTab' : 'HomeTab')} />
        </Card>
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{calibration.calibrated ? 'Student model' : 'Not calibrated'}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>{calibration.reason}</Text>
          {calibration.calibrated ? (
            <Text style={{ color: theme.colors.text }}>
              Mastery {calibration.mastery ?? '—'} · Retention {calibration.retention ?? '—'} · Evidence {calibration.evidenceCount ?? '—'}
            </Text>
          ) : null}
          {calibration.weakTopics.slice(0, 3).map((topic) => (
            <Text key={topic.title} style={{ color: theme.colors.warning }}>{topic.title}{topic.mastery == null ? '' : ` · ${topic.mastery}`}</Text>
          ))}
        </Card>
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Today’s plan</Text>
          {plan.error ? <Text style={{ color: theme.colors.danger }}>{toUserMessageFromUnknown(plan.error)}</Text> : null}
          {tasks.length === 0 && !plan.error ? <Text style={{ color: theme.colors.textSecondary }}>The planner returned no tasks.</Text> : null}
          {tasks.slice(0, 4).map((task) => (
            <Text key={task.id} style={{ color: theme.colors.text }}>{task.title} · {titleCase(task.status)}{task.minutes ? ` · ${task.minutes}m` : ''}</Text>
          ))}
        </Card>
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Revision due</Text>
          {due.length === 0 ? <Text style={{ color: theme.colors.textSecondary }}>No due revision items from the server.</Text> : due.slice(0, 3).map((item) => (
            <Text key={item.id} style={{ color: theme.colors.text }}>{item.title}</Text>
          ))}
        </Card>
        <Card>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Assessments and focus</Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            Tests on the server: {(tests.data as { total?: number } | undefined)?.total ?? (tests.data as { assessments?: unknown[] } | undefined)?.assessments?.length ?? 'unavailable'}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            Recent focus sessions: {(focus.data as { sessions?: unknown[] } | undefined)?.sessions?.length ?? 'unavailable'}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            Health score: {health.data?.overallScore ?? (health.error ? 'unavailable' : 'loading')}
            {health.data?.dimensions?.some((item) => item.status === 'uncalibrated') ? ' · some dimensions uncalibrated' : ''}
          </Text>
        </Card>
      </StateView>
    </Screen>
  );
}


