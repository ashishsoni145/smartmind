import React, { useState } from 'react';
import { Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { analyticsApi, assessmentApi, focusApiRemote, readinessApi, revisionApi, studentApi } from '../../api';
import { BarChart, Button, Card, Heading, Meter, Screen, StateView, TextField } from '../../components/ui';
import { useStudent } from '../../hooks/useStudent';
import type { ProgressStackParamList } from '../../navigation/types';
import { mapCalibration } from '../../features/home/mapDashboard';
import { toUserError } from '../../utils/errors';

export function ProgressHubScreen({ navigation }: NativeStackScreenProps<ProgressStackParamList, 'ProgressHub'>) {
  return (
    <Screen>
      <Heading subtitle="Analytics stay explainable. Uncalibrated dimensions are labeled, not filled with zeros.">Progress</Heading>
      <Button label="Analytics" onPress={() => navigation.navigate('Analytics')} />
      <Button label="Readiness" onPress={() => navigation.navigate('Readiness')} />
      <Button label="Mastery" onPress={() => navigation.navigate('Mastery')} />
      <Button label="Study history" onPress={() => navigation.navigate('History')} />
    </Screen>
  );
}

export function AnalyticsScreen() {
  const health = useQuery({ queryKey: ['health'], queryFn: () => analyticsApi.health() });
  const debrief = useQuery({ queryKey: ['debrief'], queryFn: () => analyticsApi.debrief() });
  const weekly = useQuery({ queryKey: ['weekly'], queryFn: () => analyticsApi.weekly() });
  return (
    <Screen refreshing={health.isRefetching} onRefresh={() => { health.refetch(); debrief.refetch(); weekly.refetch(); }}>
      <Heading>Analytics</Heading>
      <StateView loading={health.isLoading} error={health.error ? toUserError(health.error).message : null} onRetry={() => health.refetch()}>
        <Card>
          <Text>Overall {health.data?.overallScore ?? '—'} · {health.data?.gradeLabel}</Text>
          {(health.data?.dimensions || []).map((item) => (
            <Meter key={item.id} label={`${item.label} · ${item.status}`} value={item.status === 'uncalibrated' ? null : item.score} />
          ))}
        </Card>
        <BarChart
          labels={(health.data?.dimensions || []).map((item) => item.id)}
          values={(health.data?.dimensions || []).map((item) => item.status === 'uncalibrated' ? 0 : item.score)}
        />
        <Card>
          <Text style={{ fontWeight: '700' }}>Daily debrief</Text>
          {debrief.error ? <Text>{toUserError(debrief.error).message}</Text> : (debrief.data?.actionableNextSteps || []).map((item) => <Text key={item}>{item}</Text>)}
        </Card>
        <Card>
          <Text style={{ fontWeight: '700' }}>Weekly velocity</Text>
          <Text>{weekly.data ? `${weekly.data.weeklyVelocity} topics/week · ${weekly.data.totalStudyHours}h` : weekly.error ? toUserError(weekly.error).message : 'Loading'}</Text>
        </Card>
      </StateView>
    </Screen>
  );
}

export function ReadinessScreen() {
  const query = useQuery({ queryKey: ['readiness'], queryFn: () => readinessApi.get() });
  const [hours, setHours] = useState('3');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <Screen>
      <Heading subtitle="Readiness is calculated on the server. This screen does not invent a score.">Readiness</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null} onRetry={() => query.refetch()}>
        <Text>Score {query.data?.overallReadinessScore ?? 'unavailable'}</Text>
        <TextField label="Daily hours for simulation" value={hours} onChangeText={setHours} keyboardType="numeric" />
        <Button label="Run server simulation" onPress={async () => {
          try {
            const simulated = await readinessApi.simulate({ dailyStudyHours: Number(hours) });
            setResult(`${simulated.currentReadinessScore} → ${simulated.simulatedScore}. ${simulated.recommendations.join(' ')}`);
            setError(null);
          } catch (err) {
            setError(toUserError(err).message);
          }
        }} />
        {result ? <Text>{result}</Text> : null}
        {error ? <Text>{error}</Text> : null}
      </StateView>
    </Screen>
  );
}

export function MasteryScreen() {
  const student = useStudent();
  const summary = useQuery({ queryKey: ['model', student.studentId], enabled: Boolean(student.studentId), queryFn: () => studentApi.summary(student.studentId!) });
  const states = useQuery({ queryKey: ['states', student.studentId], enabled: Boolean(student.studentId), queryFn: () => studentApi.states(student.studentId!, { limit: 30 }) });
  const calibration = mapCalibration(summary.data, (student.profile as { knowledgeModelStatus?: string } | null)?.knowledgeModelStatus || null);
  return (
    <Screen>
      <Heading>Mastery</Heading>
      <StateView loading={summary.isLoading} error={summary.error ? toUserError(summary.error).message : null}>
        <Card><Text>{calibration.reason}</Text></Card>
        {calibration.calibrated ? (states.data?.states || []).slice(0, 20).map((state: { curriculumNodeId?: string; masteryScore?: number; status?: string }) => (
          <Text key={state.curriculumNodeId}>{state.curriculumNodeId} · {state.status} · {state.masteryScore}</Text>
        )) : null}
      </StateView>
    </Screen>
  );
}

export function HistoryScreen() {
  const student = useStudent();
  const focus = useQuery({ queryKey: ['focus-history'], queryFn: () => focusApiRemote.list({ limit: 20 }) });
  const tests = useQuery({ queryKey: ['submissions'], queryFn: () => assessmentApi.history({ limit: 20 }) });
  const revision = useQuery({ queryKey: ['revision-history', student.studentId], enabled: Boolean(student.studentId), queryFn: () => revisionApi.history(student.studentId!, 20) });
  return (
    <Screen>
      <Heading>Study history</Heading>
      <Card>
        <Text style={{ fontWeight: '700' }}>Focus</Text>
        {focus.error ? <Text>{toUserError(focus.error).message}</Text> : (focus.data?.sessions || []).map((item) => <Text key={item.id}>{item.objective} · {item.status}</Text>)}
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>Tests</Text>
        {(tests.data?.submissions || []).map((item) => <Text key={item.id}>{item.status} · {item.totalScore}/{item.maxScore}</Text>)}
      </Card>
      <Card>
        <Text style={{ fontWeight: '700' }}>Revision</Text>
        {(revision.data || []).map((item: { id: string; outcome?: string }) => <Text key={item.id}>{item.outcome || 'recorded'}</Text>)}
      </Card>
    </Screen>
  );
}
