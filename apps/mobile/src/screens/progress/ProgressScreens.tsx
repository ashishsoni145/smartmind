import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { analyticsApi, assessmentApi, focusApiRemote, readinessApi, revisionApi, studentApi } from '../../api';
import { BarChart, Button, Card, Heading, InlineNotice, ListRow, Meter, Screen, SectionTitle, StateView, Text, TextField } from '../../components/ui';
import { useStudent } from '../../hooks/useStudent';
import type { ProgressStackParamList } from '../../navigation/types';
import { mapCalibration } from '../../features/home/mapDashboard';
import { toUserError } from '../../utils/errors';
import { formatMinutes, titleCase } from '../../utils/format';

export function ProgressHubScreen({ navigation }: NativeStackScreenProps<ProgressStackParamList, 'ProgressHub'>) {
  return (
    <Screen>
      <Heading subtitle="Analytics stay explainable. Uncalibrated dimensions are labelled, not filled with zeros.">Progress</Heading>
      <Card>
        <ListRow title="Analytics" subtitle="Health score, daily debrief, weekly velocity" onPress={() => navigation.navigate('Analytics')} />
        <ListRow title="Readiness" subtitle="Server-calculated exam readiness and simulation" onPress={() => navigation.navigate('Readiness')} />
        <ListRow title="Mastery" subtitle="Knowledge states per topic" onPress={() => navigation.navigate('Mastery')} />
        <ListRow title="Study history" subtitle="Focus sessions, tests and revision events" onPress={() => navigation.navigate('History')} />
      </Card>
    </Screen>
  );
}

export function AnalyticsScreen() {
  const health = useQuery({ queryKey: ['health'], queryFn: () => analyticsApi.health() });
  const debrief = useQuery({ queryKey: ['debrief'], queryFn: () => analyticsApi.debrief() });
  const weekly = useQuery({ queryKey: ['weekly'], queryFn: () => analyticsApi.weekly() });
  const dimensions = health.data?.dimensions || [];
  const calibrated = dimensions.filter((item) => item.status !== 'uncalibrated');
  return (
    <Screen refreshing={health.isRefetching} onRefresh={() => { health.refetch(); debrief.refetch(); weekly.refetch(); }}>
      <Heading>Analytics</Heading>
      <StateView loading={health.isLoading} error={health.error ? toUserError(health.error) : null} onRetry={() => health.refetch()}>
        <Card>
          <Text variant="title" weight="700">
            {health.data?.overallScore == null ? 'Health score unavailable' : `Health ${health.data.overallScore}`}
            {health.data?.gradeLabel ? ` · ${health.data.gradeLabel}` : ''}
          </Text>
          {dimensions.map((item) => (
            <Meter key={item.id} label={`${item.label} · ${titleCase(item.status)}`} value={item.status === 'uncalibrated' ? null : item.score} />
          ))}
          {dimensions.length === 0 ? <Text tone="secondary">The server returned no dimensions yet.</Text> : null}
        </Card>
        {calibrated.length > 0 ? (
          <BarChart accessibilityLabel="Calibrated health dimensions" labels={calibrated.map((item) => item.id)} values={calibrated.map((item) => item.score)} />
        ) : null}
        <SectionTitle>Daily debrief</SectionTitle>
        <Card>
          {debrief.isLoading ? <Text tone="secondary">Loading…</Text> : null}
          {debrief.error ? <Text tone="danger" variant="small">{toUserError(debrief.error).message}</Text> : null}
          {debrief.data && (debrief.data.actionableNextSteps || []).length === 0 ? <Text tone="secondary">No next steps for today.</Text> : null}
          {(debrief.data?.actionableNextSteps || []).map((item) => (
            <Text key={item}>• {item}</Text>
          ))}
        </Card>
        <SectionTitle>Weekly review</SectionTitle>
        <Card>
          {weekly.isLoading ? <Text tone="secondary">Loading…</Text> : null}
          {weekly.error ? <Text tone="danger" variant="small">{toUserError(weekly.error).message}</Text> : null}
          {weekly.data ? <Text>{weekly.data.weeklyVelocity} topics/week · {weekly.data.totalStudyHours}h studied</Text> : null}
        </Card>
      </StateView>
    </Screen>
  );
}

export function ReadinessScreen() {
  const query = useQuery({ queryKey: ['readiness'], queryFn: () => readinessApi.get() });
  const [hours, setHours] = useState('3');
  const [hoursError, setHoursError] = useState<string | undefined>(undefined);
  const simulate = useMutation({ mutationFn: (dailyStudyHours: number) => readinessApi.simulate({ dailyStudyHours }) });

  function run() {
    const value = Number(hours.replace(',', '.'));
    if (!hours.trim() || Number.isNaN(value) || value < 0.5 || value > 16) {
      setHoursError('Enter between 0.5 and 16 hours.');
      return;
    }
    setHoursError(undefined);
    simulate.mutate(value);
  }

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Readiness is calculated on the server. This screen does not invent a score.">Readiness</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()}>
        <Card>
          <Text variant="title" weight="700">{query.data?.overallReadinessScore == null ? 'No readiness score yet' : `${query.data.overallReadinessScore} / 100`}</Text>
          {query.data?.projectedScoreRange ? <Text tone="secondary">Projected score {query.data.projectedScoreRange.min}–{query.data.projectedScoreRange.max}</Text> : null}
          {query.data?.lastCalculatedAt ? <Text tone="muted" variant="small">Calculated {new Date(query.data.lastCalculatedAt).toLocaleString()}</Text> : null}
        </Card>
        {(query.data?.factors || []).length > 0 ? (
          <Card>
            {(query.data?.factors || []).map((factor) => (
              <Meter key={factor.factor} label={factor.name || titleCase(factor.factor)} value={factor.score} />
            ))}
          </Card>
        ) : null}
        {(query.data?.recommendedInterventions || []).length > 0 ? (
          <Card>
            <Text weight="700">Recommended</Text>
            {(query.data?.recommendedInterventions || []).map((item) => <Text key={item}>• {item}</Text>)}
          </Card>
        ) : null}
        <SectionTitle>What-if simulation</SectionTitle>
        <Card>
          <TextField label="Daily study hours" value={hours} onChangeText={setHours} keyboardType="numeric" error={hoursError} />
          <Button label="Run server simulation" onPress={run} loading={simulate.isPending} disabled={simulate.isPending} />
          {simulate.data ? (
            <>
              <Text>{simulate.data.currentReadinessScore} → {simulate.data.simulatedScore} ({simulate.data.simulatedReadinessDelta >= 0 ? '+' : ''}{simulate.data.simulatedReadinessDelta})</Text>
              {simulate.data.recommendations.map((item) => <Text key={item} tone="secondary" variant="small">• {item}</Text>)}
              {simulate.data.assumptions.length > 0 ? <Text tone="muted" variant="small">Assumes: {simulate.data.assumptions.join('; ')}</Text> : null}
            </>
          ) : null}
          {simulate.error ? <InlineNotice tone="danger" label={toUserError(simulate.error).message} /> : null}
        </Card>
      </StateView>
    </Screen>
  );
}

type KnowledgeStateRow = { curriculumNodeId?: string; curriculumNodeTitle?: string; title?: string; masteryScore?: number; status?: string };

export function MasteryScreen() {
  const student = useStudent();
  const summary = useQuery({ queryKey: ['model', student.studentId], enabled: Boolean(student.studentId), queryFn: () => studentApi.summary(student.studentId!) });
  const states = useQuery({ queryKey: ['states', student.studentId], enabled: Boolean(student.studentId), queryFn: () => studentApi.states(student.studentId!, { limit: 30 }) });
  const calibration = mapCalibration(summary.data, (student.profile as { knowledgeModelStatus?: string } | null)?.knowledgeModelStatus || null);
  const rows = ((states.data as { states?: KnowledgeStateRow[] } | undefined)?.states || []).slice(0, 30);
  return (
    <Screen refreshing={summary.isRefetching} onRefresh={() => { summary.refetch(); states.refetch(); }}>
      <Heading>Mastery</Heading>
      <StateView loading={summary.isLoading || student.loading} error={summary.error ? toUserError(summary.error) : null} onRetry={() => summary.refetch()}>
        <Card tone={calibration.calibrated ? 'default' : 'warning'}>
          <Text weight="700">{calibration.calibrated ? 'Calibrated model' : 'Not calibrated yet'}</Text>
          <Text tone="secondary">{calibration.reason}</Text>
        </Card>
        {calibration.calibrated ? (
          <StateView loading={states.isLoading} error={states.error ? toUserError(states.error) : null} onRetry={() => states.refetch()} empty={rows.length === 0 ? 'No topic states recorded yet.' : null}>
            <Card>
              {rows.map((state, index) => (
                <Meter
                  key={state.curriculumNodeId || String(index)}
                  label={`${state.curriculumNodeTitle || state.title || state.curriculumNodeId || 'Topic'} · ${titleCase(state.status || 'unknown')}`}
                  value={typeof state.masteryScore === 'number' ? state.masteryScore : null}
                />
              ))}
            </Card>
          </StateView>
        ) : null}
      </StateView>
    </Screen>
  );
}

export function HistoryScreen() {
  const student = useStudent();
  const focus = useQuery({ queryKey: ['focus-history'], queryFn: () => focusApiRemote.list({ limit: 20 }) });
  const tests = useQuery({ queryKey: ['submissions'], queryFn: () => assessmentApi.history({ limit: 20 }) });
  const revision = useQuery({ queryKey: ['revision-history', student.studentId], enabled: Boolean(student.studentId), queryFn: () => revisionApi.history(student.studentId!, 20) });
  const revisionRows = (revision.data || []) as Array<{ id: string; outcome?: string; revisionType?: string; completedAt?: string; createdAt?: string }>;
  return (
    <Screen refreshing={focus.isRefetching} onRefresh={() => { focus.refetch(); tests.refetch(); revision.refetch(); }}>
      <Heading>Study history</Heading>
      <SectionTitle>Focus sessions</SectionTitle>
      <StateView loading={focus.isLoading} error={focus.error ? toUserError(focus.error) : null} onRetry={() => focus.refetch()} empty={(focus.data?.sessions || []).length === 0 ? 'No focus sessions synced yet.' : null}>
        <Card>
          {(focus.data?.sessions || []).map((item) => (
            <ListRow
              key={item.id}
              title={item.objective}
              subtitle={`${titleCase(item.status)} · ${formatMinutes(Math.round((item.actualDurationSeconds || 0) / 60))} of ${item.targetDurationMinutes} min`}
              meta={new Date(item.startedAt).toLocaleDateString()}
            />
          ))}
        </Card>
      </StateView>
      <SectionTitle>Tests</SectionTitle>
      <StateView loading={tests.isLoading} error={tests.error ? toUserError(tests.error) : null} onRetry={() => tests.refetch()} empty={(tests.data?.submissions || []).length === 0 ? 'No test attempts yet.' : null}>
        <Card>
          {(tests.data?.submissions || []).map((item) => (
            <ListRow
              key={item.id}
              title={titleCase(item.status)}
              subtitle={item.status === 'completed' ? `${item.totalScore} / ${item.maxScore}` : 'Not scored'}
              meta={new Date(item.startedAt).toLocaleDateString()}
            />
          ))}
        </Card>
      </StateView>
      <SectionTitle>Revision</SectionTitle>
      <StateView loading={revision.isLoading} error={revision.error ? toUserError(revision.error) : null} onRetry={() => revision.refetch()} empty={revisionRows.length === 0 ? 'No revision events yet.' : null}>
        <Card>
          {revisionRows.map((item) => (
            <ListRow
              key={item.id}
              title={item.outcome ? titleCase(item.outcome) : 'Started, not completed'}
              subtitle={item.revisionType ? titleCase(item.revisionType) : null}
              meta={item.completedAt || item.createdAt ? new Date((item.completedAt || item.createdAt) as string).toLocaleDateString() : null}
            />
          ))}
        </Card>
      </StateView>
    </Screen>
  );
}
