import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  assessmentApi,
  backlogApi,
  curriculumApi,
  graphApi,
  materialsApi,
  mistakeApi,
  plannerApi,
  questionApi,
  revisionApi,
  searchApi,
} from '../../api';
import { Button, Card, Chip, Heading, MarkdownView, Screen, StateView, TextField } from '../../components/ui';
import { useStudent } from '../../hooks/useStudent';
import type { StudyStackParamList } from '../../navigation/types';
import { AnswerStore, type AnswerDraft, type KeyValueStore, type PersistedAttempt } from '../../services/answerStore';
import { focusNative } from '../../features/focus/nativeFocus';
import { useTheme } from '../../theme/ThemeProvider';
import { formatClock, titleCase } from '../../utils/format';
import { toUserError } from '../../utils/errors';

const memory = new Map<string, string>();
const memoryStore: KeyValueStore = {
  async read(key) {
    try {
      const native = await focusNative.cacheRead(key);
      if (native) return native;
    } catch {
      // Native cache is preferred. Memory is only a same-process fallback and is labeled below.
    }
    return memory.get(key) ?? null;
  },
  async write(key, value) {
    memory.set(key, value);
    await focusNative.cacheWrite(key, value);
  },
};
const answers = new AnswerStore(memoryStore);

export function StudyHubScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'StudyHub'>) {
  const links: Array<[string, keyof StudyStackParamList]> = [
    ['Planner', 'Planner'],
    ['Classroom', 'Classroom'],
    ['Library', 'Library'],
    ['Tests', 'Tests'],
    ['Revision', 'Revision'],
    ['Mistakes', 'Mistakes'],
  ];
  return (
    <Screen>
      <Heading subtitle="Study tools use the same backend as the web workspace.">Study</Heading>
      {links.map(([label, route]) => (
        <Button key={route} label={label} onPress={() => navigation.navigate(route as never)} />
      ))}
    </Screen>
  );
}

export function PlannerScreen() {
  const student = useStudent();
  const [day, setDay] = useState<'today' | 'week'>('today');
  const query = useQuery({
    queryKey: ['planner', day, student.studentId],
    enabled: Boolean(student.studentId),
    queryFn: () => (day === 'today' ? plannerApi.today(student.studentId!) : plannerApi.week(student.studentId!)),
  });
  const backlog = useQuery({
    queryKey: ['backlog', student.studentId],
    enabled: Boolean(student.studentId),
    queryFn: () => backlogApi.list(student.studentId!, { limit: 8 }),
  });
  const update = useMutation({
    mutationFn: (input: { sessionId: string; taskId: string; status: 'completed' | 'skipped' | 'in_progress' }) =>
      plannerApi.updateTask(student.studentId!, input.sessionId, input.taskId, input.status),
    onSuccess: () => query.refetch(),
  });
  const replan = useMutation({
    mutationFn: () => plannerApi.replan(student.studentId!),
    onSuccess: () => query.refetch(),
  });
  const sessions = day === 'today' ? (query.data as { sessions?: unknown[] })?.sessions || [] : (query.data as { days?: Array<{ sessions?: unknown[] }> })?.days?.flatMap((item) => item.sessions || []) || [];
  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Scheduling stays on the server. This screen only displays and marks tasks.">Planner</Heading>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Chip label="Today" active={day === 'today'} onPress={() => setDay('today')} />
        <Chip label="Week" active={day === 'week'} onPress={() => setDay('week')} />
      </View>
      <Button label={replan.isPending ? 'Replanning…' : 'Ask server to replan'} onPress={() => replan.mutate()} />
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null} empty={sessions.length === 0 ? 'No planned sessions.' : null} onRetry={() => query.refetch()}>
        {sessions.map((session) => {
          const row = session as { id?: string; tasks?: Array<{ id: string; title: string; status?: string; estimatedMinutes?: number }> };
          return (
            <Card key={row.id}>
              {(row.tasks || []).map((task) => (
                <View key={task.id} style={{ gap: 6 }}>
                  <Text>{task.title} · {titleCase(task.status || 'pending')}{task.estimatedMinutes ? ` · ${task.estimatedMinutes}m` : ''}</Text>
                  <Button label="Mark complete" onPress={() => row.id && update.mutate({ sessionId: row.id, taskId: task.id, status: 'completed' })} />
                </View>
              ))}
            </Card>
          );
        })}
      </StateView>
      <Card>
        <Text style={{ fontWeight: '700' }}>Adaptive backlog</Text>
        {((backlog.data as { items?: Array<{ id: string; title: string; classification?: string }> })?.items || []).map((item) => (
          <Text key={item.id}>{item.title} · {item.classification || 'unclassified'}</Text>
        ))}
      </Card>
    </Screen>
  );
}

export function ClassroomScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Classroom'>) {
  const subjects = useQuery({ queryKey: ['subjects'], queryFn: () => curriculumApi.subjects() });
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const chapters = useQuery({ queryKey: ['chapters', subjectId], queryFn: () => curriculumApi.chapters(subjectId ? { subjectId } : undefined) });
  return (
    <Screen>
      <Heading subtitle="Subjects, chapters, and topics from the curriculum API.">Classroom</Heading>
      <StateView loading={subjects.isLoading} error={subjects.error ? toUserError(subjects.error).message : null} onRetry={() => subjects.refetch()}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(subjects.data || []).map((subject: { id: string; name?: string }) => (
            <Chip key={subject.id} label={subject.name || subject.id} active={subjectId === subject.id} onPress={() => setSubjectId(subject.id)} />
          ))}
        </View>
        {(chapters.data || []).map((chapter: { id: string; title?: string; name?: string }) => (
          <Button key={chapter.id} label={chapter.title || chapter.name || chapter.id} tone="ghost" onPress={() => navigation.navigate('Topic', { nodeId: chapter.id, title: chapter.title || chapter.name || 'Chapter' })} />
        ))}
      </StateView>
    </Screen>
  );
}

export function TopicScreen({ route }: NativeStackScreenProps<StudyStackParamList, 'Topic'>) {
  const node = useQuery({ queryKey: ['node', route.params.nodeId], queryFn: () => curriculumApi.node(route.params.nodeId) });
  const topics = useQuery({ queryKey: ['topics', route.params.nodeId], queryFn: () => curriculumApi.topics(route.params.nodeId) });
  const concepts = useQuery({ queryKey: ['node-concepts', route.params.nodeId], queryFn: () => graphApi.concepts({ limit: 20 }) });
  const pyqs = useQuery({ queryKey: ['pyq', route.params.nodeId], queryFn: () => questionApi.pyqs({ curriculumNodeId: route.params.nodeId }) });
  const important = useQuery({ queryKey: ['important', route.params.nodeId], queryFn: () => questionApi.important(route.params.nodeId) });
  const [questionId, setQuestionId] = useState<string | null>(null);
  const question = useQuery({ queryKey: ['question', questionId], enabled: Boolean(questionId), queryFn: () => questionApi.byId(questionId!) });
  return (
    <Screen>
      <Heading subtitle="High-yield and PYQ data come from the question bank. Missing fields stay blank.">{route.params.title}</Heading>
      <StateView loading={node.isLoading} error={node.error ? toUserError(node.error).message : null}>
        <Card>
          <Text>{(node.data as { description?: string })?.description || 'No description on this node.'}</Text>
        </Card>
        <Text style={{ fontWeight: '700' }}>Topics</Text>
        {(topics.data || []).map((topic: { id: string; title?: string }) => <Text key={topic.id}>{topic.title || topic.id}</Text>)}
        <Text style={{ fontWeight: '700' }}>Concepts</Text>
        {(concepts.data || []).slice(0, 8).map((concept: { id: string; name?: string; title?: string }) => (
          <Text key={concept.id}>{concept.name || concept.title || concept.id}</Text>
        ))}
        <Text style={{ fontWeight: '700' }}>PYQs and high-yield</Text>
        {[...(important.data || []), ...(pyqs.data || [])].slice(0, 12).map((item: { id: string; questionText?: string; isImportant?: boolean; appearanceFrequency?: number }) => (
          <Pressable key={item.id} onPress={() => setQuestionId(item.id)}>
            <Text>{item.isImportant ? 'High yield · ' : ''}{item.appearanceFrequency ? `Seen ${item.appearanceFrequency}× · ` : ''}{(item.questionText || item.id).slice(0, 140)}</Text>
          </Pressable>
        ))}
        {question.data ? (
          <Card>
            <MarkdownView source={String((question.data as { questionText?: string }).questionText || '')} />
            <Text>{String((question.data as { explanation?: string }).explanation || 'No explanation stored.')}</Text>
          </Card>
        ) : null}
      </StateView>
    </Screen>
  );
}

export function LibraryScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Library'>) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<string | undefined>();
  const materials = useQuery({ queryKey: ['materials', source], queryFn: () => materialsApi.list(source ? { sourceType: source, limit: 30 } : { limit: 30 }) });
  const search = useQuery({ queryKey: ['search', query], enabled: query.trim().length > 1, queryFn: () => searchApi.query(query, 'materials') });
  return (
    <Screen>
      <Heading subtitle="Recent opens are kept on this device. Account-wide saved items are not offered because the backend has no save contract.">Library</Heading>
      <TextField label="Search" value={query} onChangeText={setQuery} autoCapitalize="sentences" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['ncert_textbook', 'curated_notes', 'pyq_solution', 'student_upload'].map((item) => (
          <Chip key={item} label={titleCase(item)} active={source === item} onPress={() => setSource(source === item ? undefined : item)} />
        ))}
      </View>
      <StateView loading={materials.isLoading} error={materials.error ? toUserError(materials.error).message : null} empty={(materials.data?.materials || []).length === 0 ? 'No materials.' : null}>
        {(materials.data?.materials || []).map((item) => (
          <Button key={item.id} label={item.title} tone="ghost" onPress={() => navigation.navigate('Material', { materialId: item.id, title: item.title })} />
        ))}
      </StateView>
      {(search.data?.results || []).map((item) => <Text key={item.id}>{item.title}</Text>)}
    </Screen>
  );
}

export function MaterialScreen({ route }: NativeStackScreenProps<StudyStackParamList, 'Material'>) {
  const query = useQuery({ queryKey: ['material', route.params.materialId], queryFn: () => materialsApi.byId(route.params.materialId) });
  return (
    <Screen>
      <Heading>{route.params.title}</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null}>
        <Text>Status: {query.data?.processingStatus}</Text>
        {(query.data?.summary?.keyTakeaways || []).map((item) => <Text key={item}>• {item}</Text>)}
        {(query.data?.formulaSheet || []).map((item) => <Text key={item.id}>{item.name}: {item.formulaLatex}</Text>)}
        {query.data?.errorMessage ? <Text>{query.data.errorMessage}</Text> : null}
      </StateView>
    </Screen>
  );
}

export function TestsScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Tests'>) {
  const query = useQuery({ queryKey: ['assessments'], queryFn: () => assessmentApi.list({ limit: 30 }) });
  return (
    <Screen>
      <Heading subtitle="Starting a test creates a server submission. Answers are not graded on the device.">Tests</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null} empty={(query.data?.assessments || []).length === 0 ? 'No published tests.' : null}>
        {(query.data?.assessments || []).map((item) => (
          <Button key={item.id} label={item.title} tone="ghost" onPress={() => navigation.navigate('TestDetail', { assessmentId: item.id })} />
        ))}
      </StateView>
    </Screen>
  );
}

export function TestDetailScreen({ route, navigation }: NativeStackScreenProps<StudyStackParamList, 'TestDetail'>) {
  const query = useQuery({ queryKey: ['assessment', route.params.assessmentId], queryFn: () => assessmentApi.byId(route.params.assessmentId) });
  const start = useMutation({
    mutationFn: () => assessmentApi.start(route.params.assessmentId),
    onSuccess: (session) => navigation.replace('TestRunner', { assessmentId: route.params.assessmentId, submissionId: session.submissionId }),
  });
  return (
    <Screen>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : start.error ? toUserError(start.error).message : null}>
        <Heading subtitle={`${query.data?.durationMinutes ?? '—'} min · ${query.data?.totalMarks ?? '—'} marks`}>{query.data?.title || 'Test'}</Heading>
        <Text>{query.data?.description || 'No description.'}</Text>
        <Button label={start.isPending ? 'Starting…' : 'Start test'} onPress={() => start.mutate()} disabled={start.isPending} />
      </StateView>
    </Screen>
  );
}

export function TestRunnerScreen({ route, navigation }: NativeStackScreenProps<StudyStackParamList, 'TestRunner'>) {
  const theme = useTheme();
  const [submissionId, setSubmissionId] = useState(route.params.submissionId || '');
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, AnswerDraft>>({});
  const [remaining, setRemaining] = useState<number | null>(null);
  const [storageNote, setStorageNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const session = useQuery({
    queryKey: ['attempt', route.params.assessmentId, submissionId],
    queryFn: async () => {
      const started = submissionId ? await assessmentApi.resume(submissionId) : await assessmentApi.start(route.params.assessmentId);
      setSubmissionId(started.submissionId);
      const local = await answers.load(started.submissionId).catch(() => {
        setStorageNote('Local answer storage failed. Do not leave this screen until it recovers.');
        return null;
      });
      const remote: Record<string, AnswerDraft> = {};
      Object.values(started.answersSoFar || {}).forEach((answer) => {
        remote[answer.questionId] = {
          questionId: answer.questionId,
          selectedOptions: answer.selectedOptions || [],
          numericalAnswer: answer.numericalAnswer || '',
          status: answer.status,
          timeSpentSeconds: answer.timeSpentSeconds,
          updatedAt: started.startedAt,
        };
      });
      setDrafts(answers.merge(local, remote));
      setRemaining(started.timeRemainingSeconds);
      return started;
    },
  });

  useEffect(() => {
    if (remaining == null) return;
    const timer = setInterval(() => setRemaining((value) => (value == null ? value : Math.max(0, value - 1))), 1000);
    return () => clearInterval(timer);
  }, [remaining == null]);

  const questions = session.data?.questions || [];
  const current = questions[index];

  async function persist(next: Record<string, AnswerDraft>, sync: PersistedAttempt['sync']) {
    if (!submissionId) return;
    const attempt: PersistedAttempt = {
      submissionId,
      assessmentId: route.params.assessmentId,
      answers: next,
      timeRemainingSeconds: remaining ?? 0,
      savedAt: new Date().toISOString(),
      sync,
    };
    try {
      await answers.save(attempt);
      setStorageNote(null);
    } catch (err) {
      setStorageNote(`Answers are still on this screen, but durable storage failed: ${toUserError(err).message}`);
    }
  }

  function updateCurrent(patch: Partial<AnswerDraft>) {
    if (!current) return;
    const previous = drafts[current.id];
    const next = {
      ...drafts,
      [current.id]: {
        questionId: current.id,
        selectedOptions: previous?.selectedOptions || [],
        numericalAnswer: previous?.numericalAnswer || '',
        status: 'answered' as const,
        timeSpentSeconds: previous?.timeSpentSeconds || 0,
        updatedAt: new Date().toISOString(),
        ...patch,
      },
    };
    setDrafts(next);
    persist(next, 'pending');
    assessmentApi.autosave(submissionId, {
      questionId: current.id,
      selectedOptions: next[current.id]?.selectedOptions,
      numericalAnswer: next[current.id]?.numericalAnswer,
      timeSpentSeconds: next[current.id]?.timeSpentSeconds || 0,
      status: next[current.id]?.status,
    }).then(() => persist(next, 'synchronized')).catch(() => persist(next, 'failed'));
  }

  const submit = useMutation({
    mutationFn: () => assessmentApi.submit(submissionId, {
      answers: Object.values(drafts),
      timeTakenSeconds: Math.max(0, (session.data?.assessment.durationMinutes || 0) * 60 - (remaining || 0)),
    }),
    onSuccess: (result) => navigation.replace('TestResults', { submissionId: result.id }),
    onError: (err) => setError(toUserError(err).message),
  });

  return (
    <Screen scroll={false}>
      <Heading subtitle={remaining == null ? 'Timer waiting for the server' : formatClock(remaining)}>{session.data?.assessment.title || 'Test'}</Heading>
      {storageNote ? <Text style={{ color: theme.colors.warning }}>{storageNote}</Text> : null}
      {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
      <StateView loading={session.isLoading} error={session.error ? toUserError(session.error).message : null}>
        {current ? (
          <Card>
            <Text>{index + 1} / {questions.length}</Text>
            <MarkdownView source={current.questionText} />
            {(current.options || []).map((option) => {
              const selected = drafts[current.id]?.selectedOptions.includes(option.optionKey);
              return <Chip key={option.optionKey} label={`${option.optionKey}. ${option.optionText}`} active={selected} onPress={() => updateCurrent({ selectedOptions: [option.optionKey], status: 'answered' })} />;
            })}
            {current.questionType === 'numerical' ? (
              <TextField label="Numerical answer" value={drafts[current.id]?.numericalAnswer || ''} onChangeText={(value) => updateCurrent({ numericalAnswer: value, status: 'answered' })} keyboardType="numeric" />
            ) : null}
            <Button label="Mark for review" tone="ghost" onPress={() => updateCurrent({ status: 'marked_for_review' })} />
          </Card>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label="Previous" tone="ghost" onPress={() => setIndex((value) => Math.max(0, value - 1))} />
          <Button label="Next" tone="ghost" onPress={() => setIndex((value) => Math.min(questions.length - 1, value + 1))} />
        </View>
        <Button label={submit.isPending ? 'Submitting…' : 'Submit to server'} onPress={() => submit.mutate()} disabled={submit.isPending || !submissionId} />
      </StateView>
    </Screen>
  );
}

export function TestResultsScreen({ route, navigation }: NativeStackScreenProps<StudyStackParamList, 'TestResults'>) {
  const query = useQuery({ queryKey: ['submission', route.params.submissionId], queryFn: () => assessmentApi.submission(route.params.submissionId) });
  const analysis = query.data?.postTestAnalysis;
  return (
    <Screen>
      <Heading subtitle="Results are the server submission, not a local grade.">Results</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null}>
        <Text>Score {query.data?.totalScore ?? '—'} / {query.data?.maxScore ?? '—'}</Text>
        <Text>Accuracy {query.data?.accuracyPercentage ?? '—'}%</Text>
        {(analysis?.recommendations || []).map((item) => <Text key={item}>{item}</Text>)}
        <Button label="Mistake notebook" onPress={() => navigation.navigate('Mistakes')} />
      </StateView>
    </Screen>
  );
}

export function RevisionScreen() {
  const student = useStudent();
  const due = useQuery({ queryKey: ['revision-due', student.studentId], enabled: Boolean(student.studentId), queryFn: () => revisionApi.due(student.studentId!, { limit: 30 }) });
  const history = useQuery({ queryKey: ['revision-history', student.studentId], enabled: Boolean(student.studentId), queryFn: () => revisionApi.history(student.studentId!, 20) });
  const complete = useMutation({
    mutationFn: async (item: { id: string; curriculumNodeId?: string }) => {
      const created = await revisionApi.create(student.studentId!, { revisionType: 'active_recall', curriculumNodeId: item.curriculumNodeId });
      const eventId = (created as { id?: string }).id || item.id;
      return revisionApi.complete(student.studentId!, eventId, { outcome: 'recalled', timeSpentSeconds: 60 });
    },
    onSuccess: () => { due.refetch(); history.refetch(); },
  });
  const items = (due.data as { items?: Array<{ id: string; topicTitle?: string; curriculumNodeId?: string; status?: string }> })?.items || [];
  return (
    <Screen>
      <Heading subtitle="Intervals are computed by the revision engine. Completing a review sends the outcome back.">Revision</Heading>
      <StateView loading={due.isLoading} error={due.error ? toUserError(due.error).message : complete.error ? toUserError(complete.error).message : null} empty={items.length === 0 ? 'Nothing is due.' : null}>
        {items.map((item) => (
          <Card key={item.id}>
            <Text>{item.topicTitle || item.id}</Text>
            <Text>{item.status || 'due'}</Text>
            <Button label="Mark recalled" onPress={() => complete.mutate(item)} />
          </Card>
        ))}
      </StateView>
      <Text style={{ fontWeight: '700' }}>History</Text>
      {(history.data || []).slice(0, 8).map((item: { id: string; outcome?: string; revisionType?: string }) => (
        <Text key={item.id}>{item.revisionType} · {item.outcome || 'pending'}</Text>
      ))}
    </Screen>
  );
}

export function MistakesScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Mistakes'>) {
  const [cause, setCause] = useState<string | undefined>();
  const query = useQuery({ queryKey: ['mistakes', cause], queryFn: () => mistakeApi.list(cause ? { rootCause: cause, limit: 40 } : { limit: 40 }) });
  return (
    <Screen>
      <Heading subtitle="Root causes and coaching notes come from the mistake engine.">Mistakes</Heading>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {['conceptual', 'calculation', 'silly', 'time_pressure'].map((item) => (
          <Chip key={item} label={titleCase(item)} active={cause === item} onPress={() => setCause(cause === item ? undefined : item)} />
        ))}
      </View>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null} empty={(query.data?.mistakes || []).length === 0 ? 'No mistakes recorded.' : null}>
        <Text>Open {query.data?.metrics.unresolvedCount ?? '—'} · Resolved {query.data?.metrics.resolvedCount ?? '—'}</Text>
        {(query.data?.mistakes || []).map((item) => (
          <Button key={item.id} label={`${titleCase(item.rootCause)} · ${item.isResolved ? 'resolved' : 'open'}`} tone="ghost" onPress={() => navigation.navigate('MistakeDetail', { mistakeId: item.id })} />
        ))}
      </StateView>
    </Screen>
  );
}

export function MistakeDetailScreen({ route }: NativeStackScreenProps<StudyStackParamList, 'MistakeDetail'>) {
  const query = useQuery({ queryKey: ['mistake', route.params.mistakeId], queryFn: () => mistakeApi.byId(route.params.mistakeId) });
  const retry = useMutation({
    mutationFn: (selectedOptions: string[]) => mistakeApi.retry(route.params.mistakeId, { selectedOptions }),
    onSuccess: () => query.refetch(),
  });
  const question = query.data?.question;
  return (
    <Screen>
      <Heading>{titleCase(query.data?.rootCause || 'Mistake')}</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null}>
        <MarkdownView source={question?.questionText || 'Question text was not included.'} />
        <Text>Notes: {query.data?.notes || 'No coaching note stored.'}</Text>
        <Text>Next retry: {query.data?.nextRetryAt || '—'}</Text>
        {(question?.options || []).map((option) => (
          <Button key={option.optionKey} label={option.optionText} tone="ghost" onPress={() => retry.mutate([option.optionKey])} />
        ))}
        {retry.data ? <Text>{retry.data.isCorrect ? 'Server marked the retry correct.' : 'Server marked the retry incorrect.'} {retry.data.explanation || ''}</Text> : null}
      </StateView>
    </Screen>
  );
}


