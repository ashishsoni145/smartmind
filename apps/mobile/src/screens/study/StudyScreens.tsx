import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ActiveTestSession } from '@sharpmind/types';
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
import { Button, Card, Chip, Divider, Heading, InlineNotice, ListRow, MarkdownView, Row, Screen, SectionTitle, StateView, Text, TextField } from '../../components/ui';
import { useStudent } from '../../hooks/useStudent';
import type { StudyStackParamList } from '../../navigation/types';
import { AnswerStore, type AnswerDraft, type KeyValueStore, type PersistedAttempt } from '../../services/answerStore';
import { focusNative } from '../../features/focus/nativeFocus';
import { draftFor, selectOption, summarize, timeTakenSeconds, toSubmitAnswers } from '../../features/tests/attemptModel';
import { OUTCOME_LABELS, eventIdFromCreateResponse, measuredSeconds, pickRevisionType, type ActiveReview, type RevisionOutcome } from '../../features/revision/reviewFlow';
import { useTheme } from '../../theme/ThemeProvider';
import { formatClock, titleCase } from '../../utils/format';
import { toUserError } from '../../utils/errors';

// Durable answer storage lives in the native file cache. The in-memory map only bridges the
// same process if the native cache throws; the runner tells the student when that happens.
const memory = new Map<string, string>();
const answerStorage: KeyValueStore = {
  async read(key) {
    try {
      const native = await focusNative.cacheRead(key);
      if (native) return native;
    } catch {
      // fall through to memory
    }
    return memory.get(key) ?? null;
  },
  async write(key, value) {
    memory.set(key, value);
    await focusNative.cacheWrite(key, value);
  },
};
const answers = new AnswerStore(answerStorage);

export function StudyHubScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'StudyHub'>) {
  const links: Array<{ route: keyof StudyStackParamList; title: string; subtitle: string }> = [
    { route: 'Planner', title: 'Planner', subtitle: 'Today and this week, scheduled by the server' },
    { route: 'Classroom', title: 'Classroom', subtitle: 'Subjects, chapters and topics' },
    { route: 'Library', title: 'Library', subtitle: 'Materials and search' },
    { route: 'Tests', title: 'Tests', subtitle: 'Timed attempts graded on the server' },
    { route: 'Revision', title: 'Revision', subtitle: 'Spaced-repetition queue' },
    { route: 'Mistakes', title: 'Mistakes', subtitle: 'Root causes and retries' },
  ];
  return (
    <Screen>
      <Heading subtitle="Study tools use the same backend as the web workspace.">Study</Heading>
      <Card>
        {links.map((link, index) => (
          <React.Fragment key={link.route}>
            <ListRow title={link.title} subtitle={link.subtitle} onPress={() => navigation.navigate(link.route as never)} />
            {index < links.length - 1 ? <Divider /> : null}
          </React.Fragment>
        ))}
      </Card>
    </Screen>
  );
}

type PlannerTask = { id: string; title: string; status?: string; estimatedMinutes?: number };
type PlannerSession = { id?: string; date?: string; tasks?: PlannerTask[] };

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
  const sessions: PlannerSession[] = day === 'today'
    ? ((query.data as { sessions?: PlannerSession[] } | undefined)?.sessions || [])
    : ((query.data as { days?: Array<{ date?: string; sessions?: PlannerSession[] }> } | undefined)?.days?.flatMap((item) => (item.sessions || []).map((s) => ({ ...s, date: s.date || item.date }))) || []);
  const backlogItems = ((backlog.data as { items?: Array<{ id: string; title: string; classification?: string }> } | undefined)?.items) || [];

  function confirmReplan() {
    Alert.alert('Ask the server to replan?', 'Today’s remaining tasks will be rescheduled by the planner.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Replan', onPress: () => replan.mutate() },
    ]);
  }

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => { query.refetch(); backlog.refetch(); }}>
      <Heading subtitle="Scheduling stays on the server. This screen displays and marks tasks.">Planner</Heading>
      <Row>
        <Chip label="Today" active={day === 'today'} onPress={() => setDay('today')} />
        <Chip label="Week" active={day === 'week'} onPress={() => setDay('week')} />
      </Row>
      <Button label="Ask server to replan" tone="secondary" onPress={confirmReplan} loading={replan.isPending} disabled={replan.isPending || !student.studentId} />
      {replan.error ? <InlineNotice tone="danger" label={toUserError(replan.error).message} /> : null}
      {update.error ? <InlineNotice tone="danger" label={toUserError(update.error).message} /> : null}
      <StateView loading={query.isLoading || student.loading} error={query.error ? toUserError(query.error) : null} empty={sessions.length === 0 ? 'No planned sessions.' : null} onRetry={() => query.refetch()}>
        {sessions.map((row, sessionIndex) => (
          <Card key={row.id || String(sessionIndex)}>
            {row.date ? <Text tone="muted" variant="small">{new Date(row.date).toDateString()}</Text> : null}
            {(row.tasks || []).length === 0 ? <Text tone="secondary">No tasks in this session.</Text> : null}
            {(row.tasks || []).map((task) => {
              const done = task.status === 'completed';
              const busy = update.isPending && update.variables?.taskId === task.id;
              return (
                <ListRow
                  key={task.id}
                  title={task.title}
                  subtitle={[titleCase(task.status || 'pending'), task.estimatedMinutes ? `${task.estimatedMinutes} min` : null].filter(Boolean).join(' · ')}
                  trailing={
                    row.id && !done ? (
                      <Button label={busy ? '…' : 'Done'} compact tone="secondary" disabled={update.isPending} onPress={() => update.mutate({ sessionId: row.id!, taskId: task.id, status: 'completed' })} />
                    ) : done ? <Text tone="success" variant="small">✓</Text> : null
                  }
                />
              );
            })}
          </Card>
        ))}
      </StateView>
      <SectionTitle>Adaptive backlog</SectionTitle>
      <Card>
        {backlog.isLoading ? <Text tone="secondary">Loading…</Text> : null}
        {backlog.error ? <Text tone="danger" variant="small">{toUserError(backlog.error).message}</Text> : null}
        {!backlog.isLoading && !backlog.error && backlogItems.length === 0 ? <Text tone="secondary">The backlog is empty.</Text> : null}
        {backlogItems.map((item) => (
          <ListRow key={item.id} title={item.title} meta={item.classification ? titleCase(item.classification) : null} />
        ))}
      </Card>
    </Screen>
  );
}

export function ClassroomScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Classroom'>) {
  const student = useStudent();
  const subjects = useQuery({ queryKey: ['curriculum', 'subjects'], queryFn: () => curriculumApi.subjects() });
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const profile = student.profile as { enrolledSubjects?: string[]; gradeId?: string; boardId?: string } | null;
  const subjectList = ((subjects.data || []) as Array<{ id: string; name?: string }>).filter((subject) => !profile?.enrolledSubjects?.length || profile.enrolledSubjects.includes(subject.id));
  const activeSubject = subjectId ?? subjectList[0]?.id;
  const chapters = useQuery({
    queryKey: ['chapters', activeSubject, profile?.gradeId, profile?.boardId],
    enabled: Boolean(activeSubject),
    queryFn: () => curriculumApi.chapters({ subjectId: activeSubject, gradeId: profile?.gradeId, boardId: profile?.boardId }),
  });
  const chapterList = (chapters.data || []) as Array<{ id: string; title?: string; name?: string }>;
  return (
    <Screen refreshing={chapters.isRefetching} onRefresh={() => chapters.refetch()}>
      <Heading subtitle="Subjects, chapters and topics from the curriculum API.">Classroom</Heading>
      <StateView loading={subjects.isLoading} error={subjects.error ? toUserError(subjects.error) : null} onRetry={() => subjects.refetch()} empty={subjectList.length === 0 ? 'No subjects available.' : null}>
        <Row style={{ flexWrap: 'wrap' }}>
          {subjectList.map((subject) => (
            <Chip key={subject.id} label={subject.name || subject.id} active={activeSubject === subject.id} onPress={() => setSubjectId(subject.id)} />
          ))}
        </Row>
        <StateView loading={chapters.isLoading} error={chapters.error ? toUserError(chapters.error) : null} onRetry={() => chapters.refetch()} empty={!chapters.isLoading && chapterList.length === 0 ? 'No chapters for this subject yet.' : null}>
          <Card>
            {chapterList.map((chapter) => (
              <ListRow key={chapter.id} title={chapter.title || chapter.name || chapter.id} onPress={() => navigation.navigate('Topic', { nodeId: chapter.id, title: chapter.title || chapter.name || 'Chapter' })} />
            ))}
          </Card>
        </StateView>
      </StateView>
    </Screen>
  );
}

export function TopicScreen({ route }: NativeStackScreenProps<StudyStackParamList, 'Topic'>) {
  const node = useQuery({ queryKey: ['node', route.params.nodeId], queryFn: () => curriculumApi.node(route.params.nodeId) });
  const topics = useQuery({ queryKey: ['topics', route.params.nodeId], queryFn: () => curriculumApi.topics(route.params.nodeId) });
  const subjectId = (node.data as { subjectId?: string } | undefined)?.subjectId;
  const concepts = useQuery({ queryKey: ['node-concepts', subjectId], enabled: Boolean(subjectId), queryFn: () => graphApi.concepts({ subjectId, limit: 20 }) });
  const pyqs = useQuery({ queryKey: ['pyq', route.params.nodeId], queryFn: () => questionApi.pyqs({ curriculumNodeId: route.params.nodeId }) });
  const important = useQuery({ queryKey: ['important', route.params.nodeId], queryFn: () => questionApi.important(route.params.nodeId) });
  const [questionId, setQuestionId] = useState<string | null>(null);
  const question = useQuery({ queryKey: ['question', questionId], enabled: Boolean(questionId), queryFn: () => questionApi.byId(questionId!) });
  const theme = useTheme();
  const questionRows = useMemo(() => {
    const seen = new Set<string>();
    return [...((important.data || []) as Array<{ id: string; questionText?: string; isImportant?: boolean; appearanceFrequency?: number }>), ...((pyqs.data || []) as Array<{ id: string; questionText?: string; isImportant?: boolean; appearanceFrequency?: number }>)]
      .filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)))
      .slice(0, 12);
  }, [important.data, pyqs.data]);
  return (
    <Screen>
      <Heading subtitle="High-yield and PYQ data come from the question bank. Missing fields stay blank.">{route.params.title}</Heading>
      <StateView loading={node.isLoading} error={node.error ? toUserError(node.error) : null} onRetry={() => node.refetch()}>
        <Card>
          <Text>{(node.data as { description?: string } | undefined)?.description || 'No description on this node.'}</Text>
        </Card>
        <SectionTitle>Topics</SectionTitle>
        <Card>
          {topics.isLoading ? <Text tone="secondary">Loading…</Text> : null}
          {topics.error ? <Text tone="danger" variant="small">{toUserError(topics.error).message}</Text> : null}
          {!topics.isLoading && ((topics.data || []) as unknown[]).length === 0 ? <Text tone="secondary">No sub-topics listed.</Text> : null}
          {((topics.data || []) as Array<{ id: string; title?: string }>).map((topic) => <ListRow key={topic.id} title={topic.title || topic.id} />)}
        </Card>
        {subjectId ? (
          <>
            <SectionTitle>Concepts in this subject</SectionTitle>
            <Card>
              {concepts.error ? <Text tone="danger" variant="small">{toUserError(concepts.error).message}</Text> : null}
              {((concepts.data || []) as Array<{ id: string; name?: string; title?: string }>).slice(0, 8).map((concept) => (
                <ListRow key={concept.id} title={concept.name || concept.title || concept.id} />
              ))}
            </Card>
          </>
        ) : null}
        <SectionTitle>PYQs and high-yield</SectionTitle>
        <Card>
          {important.error || pyqs.error ? <Text tone="danger" variant="small">{toUserError(important.error || pyqs.error).message}</Text> : null}
          {!important.isLoading && !pyqs.isLoading && questionRows.length === 0 ? <Text tone="secondary">No tagged questions for this node.</Text> : null}
          {questionRows.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: questionId === item.id }}
              onPress={() => setQuestionId(item.id)}
              style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: theme.colors.border }}>
              <Text tone="muted" variant="small">{[item.isImportant ? 'High yield' : null, item.appearanceFrequency ? `Seen ${item.appearanceFrequency}×` : null].filter(Boolean).join(' · ')}</Text>
              <Text numberOfLines={3}>{item.questionText || item.id}</Text>
            </Pressable>
          ))}
        </Card>
        {questionId ? (
          <StateView loading={question.isLoading} error={question.error ? toUserError(question.error) : null} onRetry={() => question.refetch()}>
            {question.data ? (
              <Card tone="accent">
                <MarkdownView source={String((question.data as { questionText?: string }).questionText || '')} />
                <Divider />
                <Text tone="secondary">{String((question.data as { explanation?: string }).explanation || 'No explanation stored for this question.')}</Text>
              </Card>
            ) : null}
          </StateView>
        ) : null}
      </StateView>
    </Screen>
  );
}

export function LibraryScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Library'>) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [source, setSource] = useState<string | undefined>();
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);
  const materials = useQuery({ queryKey: ['materials', source], queryFn: () => materialsApi.list(source ? { sourceType: source, limit: 30 } : { limit: 30 }) });
  const search = useQuery({ queryKey: ['search', debounced], enabled: debounced.length > 1, queryFn: () => searchApi.query(debounced, 'materials') });
  const results = (search.data?.results || []) as Array<{ id: string; title: string; type?: string; snippet?: string }>;
  return (
    <Screen refreshing={materials.isRefetching} onRefresh={() => materials.refetch()}>
      <Heading subtitle="Materials and search results come from the server. Nothing is cached as “saved”.">Library</Heading>
      <TextField label="Search materials" value={query} onChangeText={setQuery} autoCapitalize="sentences" returnKeyType="done" />
      {debounced.length > 1 ? (
        <StateView loading={search.isLoading} error={search.error ? toUserError(search.error) : null} onRetry={() => search.refetch()} empty={results.length === 0 ? `No results for “${debounced}”.` : null}>
          <Card>
            {results.map((item) => (
              <ListRow key={item.id} title={item.title} subtitle={item.snippet || null} meta={item.type || null} onPress={() => navigation.navigate('Material', { materialId: item.id, title: item.title })} />
            ))}
          </Card>
        </StateView>
      ) : null}
      <Row style={{ flexWrap: 'wrap' }}>
        {['ncert_textbook', 'curated_notes', 'pyq_solution', 'student_upload'].map((item) => (
          <Chip key={item} label={titleCase(item)} active={source === item} onPress={() => setSource(source === item ? undefined : item)} />
        ))}
      </Row>
      <StateView loading={materials.isLoading} error={materials.error ? toUserError(materials.error) : null} onRetry={() => materials.refetch()} empty={(materials.data?.materials || []).length === 0 ? 'No materials in this category.' : null}>
        <Card>
          {(materials.data?.materials || []).map((item) => (
            <ListRow key={item.id} title={item.title} subtitle={item.processingStatus ? titleCase(item.processingStatus) : null} onPress={() => navigation.navigate('Material', { materialId: item.id, title: item.title })} />
          ))}
        </Card>
      </StateView>
    </Screen>
  );
}

export function MaterialScreen({ route }: NativeStackScreenProps<StudyStackParamList, 'Material'>) {
  const query = useQuery({ queryKey: ['material', route.params.materialId], queryFn: () => materialsApi.byId(route.params.materialId) });
  const data = query.data;
  const processing = data?.processingStatus === 'processing' || data?.processingStatus === 'pending';
  useEffect(() => {
    if (!processing) return;
    const timer = setInterval(() => query.refetch(), 8000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processing]);
  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle={data?.processingStatus ? `Status: ${titleCase(data.processingStatus)}` : undefined}>{route.params.title}</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()}>
        {processing ? <InlineNotice tone="accent" label="The server is still processing this material. This screen refreshes automatically." /> : null}
        {data?.errorMessage ? <InlineNotice tone="danger" label={data.errorMessage} /> : null}
        {(data?.summary?.keyTakeaways || []).length > 0 ? (
          <Card>
            <Text weight="700">Key takeaways</Text>
            {(data?.summary?.keyTakeaways || []).map((item) => <Text key={item}>• {item}</Text>)}
          </Card>
        ) : null}
        {(data?.formulaSheet || []).length > 0 ? (
          <Card>
            <Text weight="700">Formula sheet</Text>
            {(data?.formulaSheet || []).map((item) => (
              <View key={item.id} style={{ gap: 2 }}>
                <Text weight="600">{item.name}</Text>
                <MarkdownView source={`$${item.formulaLatex}$`} />
              </View>
            ))}
          </Card>
        ) : null}
        {!processing && !data?.errorMessage && (data?.summary?.keyTakeaways || []).length === 0 && (data?.formulaSheet || []).length === 0 ? (
          <Text tone="secondary">The server has no summary or formula sheet for this material.</Text>
        ) : null}
      </StateView>
    </Screen>
  );
}

export function TestsScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Tests'>) {
  const query = useQuery({ queryKey: ['assessments'], queryFn: () => assessmentApi.list({ limit: 30 }) });
  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Starting a test creates a server submission. Answers are not graded on the device.">Tests</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()} empty={(query.data?.assessments || []).length === 0 ? 'No published tests.' : null}>
        <Card>
          {(query.data?.assessments || []).map((item) => (
            <ListRow
              key={item.id}
              title={item.title}
              subtitle={[item.durationMinutes ? `${item.durationMinutes} min` : null, item.totalMarks ? `${item.totalMarks} marks` : null, item.totalQuestions ? `${item.totalQuestions} questions` : null].filter(Boolean).join(' · ') || null}
              onPress={() => navigation.navigate('TestDetail', { assessmentId: item.id })}
            />
          ))}
        </Card>
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
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()}>
        <Heading subtitle={`${query.data?.durationMinutes ?? '—'} min · ${query.data?.totalMarks ?? '—'} marks${query.data?.totalQuestions ? ` · ${query.data.totalQuestions} questions` : ''}`}>{query.data?.title || 'Test'}</Heading>
        <Card>
          <Text>{query.data?.description || 'No description.'}</Text>
          <Text tone="secondary" variant="small">The timer starts on the server when you press Start. Leaving the screen does not pause it; you can resume from Study history while time remains.</Text>
        </Card>
        {start.error ? <InlineNotice tone="danger" label={toUserError(start.error).message} /> : null}
        <Button label="Start test" onPress={() => start.mutate()} loading={start.isPending} disabled={start.isPending} />
      </StateView>
    </Screen>
  );
}

export function TestRunnerScreen({ route, navigation }: NativeStackScreenProps<StudyStackParamList, 'TestRunner'>) {
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, AnswerDraft>>({});
  const [remaining, setRemaining] = useState<number | null>(null);
  const [storageNote, setStorageNote] = useState<string | null>(null);
  const [autosaveNote, setAutosaveNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const draftsRef = useRef(drafts);
  const remainingRef = useRef(remaining);
  const questionEnteredAt = useRef(Date.now());
  draftsRef.current = drafts;
  remainingRef.current = remaining;

  const session = useQuery({
    queryKey: ['attempt', route.params.assessmentId, route.params.submissionId ?? 'new'],
    staleTime: Infinity,
    retry: false,
    queryFn: async (): Promise<{ started: ActiveTestSession; local: PersistedAttempt | null; localFailed: boolean }> => {
      const started = route.params.submissionId ? await assessmentApi.resume(route.params.submissionId) : await assessmentApi.start(route.params.assessmentId);
      let localFailed = false;
      const local = await answers.load(started.submissionId).catch(() => {
        localFailed = true;
        return null;
      });
      return { started, local, localFailed };
    },
  });
  const started = session.data?.started;
  const submissionId = started?.submissionId ?? '';

  // Hydrate local state once from the server + local merge. Never inside queryFn.
  useEffect(() => {
    if (!session.data) return;
    const { started: s, local, localFailed } = session.data;
    const remote: Record<string, AnswerDraft> = {};
    Object.values(s.answersSoFar || {}).forEach((answer) => {
      remote[answer.questionId] = {
        questionId: answer.questionId,
        selectedOptions: answer.selectedOptions || [],
        numericalAnswer: answer.numericalAnswer || '',
        status: answer.status,
        timeSpentSeconds: answer.timeSpentSeconds,
        updatedAt: s.startedAt,
      };
    });
    setDrafts(answers.merge(local, remote));
    setRemaining(Math.max(0, Math.round(s.timeRemainingSeconds)));
    setStorageNote(localFailed ? 'Local answer backup is unavailable on this device. Answers still autosave to the server.' : null);
    questionEnteredAt.current = Date.now();
  }, [session.data]);

  // Countdown from the server-issued remaining time.
  useEffect(() => {
    if (remaining == null || expired) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value == null) return value;
        if (value <= 1) {
          setExpired(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining == null, expired]);

  const questions = started?.questions || [];
  const current = questions[index];
  const summary = summarize(drafts, questions.map((q) => q.id));

  const persist = useCallback(async (next: Record<string, AnswerDraft>, sync: PersistedAttempt['sync']) => {
    if (!submissionId) return;
    const attempt: PersistedAttempt = {
      submissionId,
      assessmentId: route.params.assessmentId,
      answers: next,
      timeRemainingSeconds: remainingRef.current ?? 0,
      savedAt: new Date().toISOString(),
      sync,
    };
    try {
      await answers.save(attempt);
    } catch (err) {
      setStorageNote(`Local backup failed: ${toUserError(err).message}. Answers still autosave to the server.`);
    }
  }, [submissionId, route.params.assessmentId]);

  function commitTimeOnCurrent(): Record<string, AnswerDraft> {
    if (!current) return draftsRef.current;
    const elapsed = Math.max(0, Math.round((Date.now() - questionEnteredAt.current) / 1000));
    questionEnteredAt.current = Date.now();
    if (elapsed === 0) return draftsRef.current;
    const previous = draftsRef.current[current.id];
    const next = { ...draftsRef.current, [current.id]: draftFor(current.id, previous, { timeSpentSeconds: (previous?.timeSpentSeconds || 0) + elapsed, status: previous?.status || 'visited' }, new Date().toISOString()) };
    setDrafts(next);
    return next;
  }

  function updateCurrent(patch: Partial<AnswerDraft>) {
    if (!current || expired) return;
    const withTime = commitTimeOnCurrent();
    const next = { ...withTime, [current.id]: draftFor(current.id, withTime[current.id], patch, new Date().toISOString()) };
    setDrafts(next);
    persist(next, 'pending');
    const draft = next[current.id];
    assessmentApi
      .autosave(submissionId, {
        questionId: current.id,
        selectedOptions: draft.selectedOptions,
        numericalAnswer: draft.numericalAnswer || undefined,
        timeSpentSeconds: draft.timeSpentSeconds,
        status: draft.status,
      })
      .then(() => {
        setAutosaveNote(null);
        persist(next, 'synchronized');
      })
      .catch((err) => {
        setAutosaveNote(`Autosave failed: ${toUserError(err).message}. Your answer is kept here; submitting sends everything again.`);
        persist(next, 'failed');
      });
  }

  function goTo(nextIndex: number) {
    commitTimeOnCurrent();
    setIndex(Math.min(Math.max(0, nextIndex), Math.max(0, questions.length - 1)));
  }

  const submit = useMutation({
    mutationFn: () => {
      const finalDrafts = commitTimeOnCurrent();
      return assessmentApi.submit(submissionId, {
        answers: toSubmitAnswers(finalDrafts),
        timeTakenSeconds: timeTakenSeconds(started?.assessment.durationMinutes, remainingRef.current),
      });
    },
    onSuccess: (result) => navigation.replace('TestResults', { submissionId: result.id }),
    onError: (err) => setError(toUserError(err).message),
  });

  function confirmSubmit() {
    const message = summary.unanswered > 0
      ? `${summary.unanswered} of ${summary.total} questions are unanswered${summary.marked ? ` and ${summary.marked} marked for review` : ''}. Submit anyway?`
      : 'Submit your answers to the server for grading?';
    Alert.alert('Submit test?', message, [
      { text: 'Keep working', style: 'cancel' },
      { text: 'Submit', style: 'destructive', onPress: () => submit.mutate() },
    ]);
  }

  // Hardware back: never silently abandon a running attempt.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (submit.isPending) return true;
        Alert.alert('Leave the test?', 'The server timer keeps running. You can resume from Study history while time remains.', [
          { text: 'Stay', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
        ]);
        return true;
      });
      return () => sub.remove();
    }, [navigation, submit.isPending]),
  );

  const timerLabel = remaining == null ? 'Timer waiting for the server' : expired ? 'Time is up' : formatClock(remaining);
  return (
    <Screen scroll={false}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Heading compact subtitle={`${summary.answered}/${summary.total} answered${summary.marked ? ` · ${summary.marked} for review` : ''}`}>{started?.assessment.title || 'Test'}</Heading>
        </View>
        <Text variant="title" weight="700" tone={expired ? 'danger' : remaining != null && remaining < 60 ? 'warning' : 'default'} accessibilityLiveRegion={remaining != null && remaining % 60 === 0 ? 'polite' : 'none'} accessibilityLabel={`Time remaining ${timerLabel}`}>
          {timerLabel}
        </Text>
      </Row>
      {storageNote ? <InlineNotice tone="warning" label={storageNote} /> : null}
      {autosaveNote ? <InlineNotice tone="warning" label={autosaveNote} /> : null}
      {error ? <InlineNotice tone="danger" label={error} /> : null}
      {expired ? <InlineNotice tone="danger" label="The time budget from the server has run out. Submit now; the server decides what it accepts." /> : null}
      <StateView loading={session.isLoading} loadingLabel="Loading attempt" error={session.error ? toUserError(session.error) : null} onRetry={() => session.refetch()}>
        {current ? (
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 12 }}>
            <Card>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text tone="muted" variant="small">Question {index + 1} of {questions.length} · {current.marks} mark{current.marks === 1 ? '' : 's'}</Text>
                <Text tone="muted" variant="small">{titleCase(current.questionType)}</Text>
              </Row>
              <MarkdownView source={current.questionText} />
              {current.diagramUrl ? <Text tone="muted" variant="small">This question has a diagram that this version cannot display.</Text> : null}
              {(current.options || []).map((option) => {
                const selected = drafts[current.id]?.selectedOptions.includes(option.optionKey) ?? false;
                return (
                  <Chip
                    key={option.optionKey}
                    label={`${option.optionKey}. ${option.optionText}`}
                    active={selected}
                    disabled={expired}
                    onPress={() => updateCurrent({ selectedOptions: selectOption(current.questionType, drafts[current.id]?.selectedOptions || [], option.optionKey), status: 'answered' })}
                  />
                );
              })}
              {current.questionType === 'numerical' ? (
                <TextField label="Numerical answer" value={drafts[current.id]?.numericalAnswer || ''} onChangeText={(value) => updateCurrent({ numericalAnswer: value, status: 'answered' })} keyboardType="numeric" editable={!expired} />
              ) : null}
              {!current.options?.length && current.questionType !== 'numerical' ? (
                <InlineNotice tone="warning" label={`This ${titleCase(current.questionType)} question needs a written answer, which this version cannot capture. Mark it for review and answer on the web.`} />
              ) : null}
              <Row>
                <Button
                  label={drafts[current.id]?.status === 'marked_for_review' ? 'Unmark review' : 'Mark for review'}
                  tone="ghost"
                  compact
                  disabled={expired}
                  onPress={() => updateCurrent({ status: drafts[current.id]?.status === 'marked_for_review' ? 'visited' : 'marked_for_review' })}
                />
                {(drafts[current.id]?.selectedOptions.length || 0) > 0 ? (
                  <Button label="Clear answer" tone="ghost" compact disabled={expired} onPress={() => updateCurrent({ selectedOptions: [], numericalAnswer: '', status: 'visited' })} />
                ) : null}
              </Row>
            </Card>
          </ScrollView>
        ) : null}
        <Row>
          <View style={{ flex: 1 }}>
            <Button label="Previous" tone="secondary" onPress={() => goTo(index - 1)} disabled={index === 0} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Next" tone="secondary" onPress={() => goTo(index + 1)} disabled={index >= questions.length - 1} />
          </View>
        </Row>
        <Button label="Submit to server" onPress={confirmSubmit} loading={submit.isPending} disabled={submit.isPending || !submissionId} />
      </StateView>
    </Screen>
  );
}

export function TestResultsScreen({ route, navigation }: NativeStackScreenProps<StudyStackParamList, 'TestResults'>) {
  const query = useQuery({ queryKey: ['submission', route.params.submissionId], queryFn: () => assessmentApi.submission(route.params.submissionId) });
  const analysis = query.data?.postTestAnalysis;
  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Results are the server submission, not a local grade.">Results</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()}>
        <Card tone="accent">
          <Text variant="display" weight="700">{query.data?.totalScore ?? '—'} / {query.data?.maxScore ?? '—'}</Text>
          <Text tone="secondary">Accuracy {query.data?.accuracyPercentage ?? '—'}% · {titleCase(query.data?.status || 'unknown')}</Text>
        </Card>
        {analysis ? (
          <Card>
            <Text weight="700">Breakdown</Text>
            <Text>Correct {analysis.totalCorrect} · Incorrect {analysis.totalIncorrect} · Unattempted {analysis.totalUnattempted}</Text>
            {analysis.avgTimePerQuestionSeconds ? <Text tone="secondary" variant="small">Average {Math.round(analysis.avgTimePerQuestionSeconds)}s per question</Text> : null}
          </Card>
        ) : (
          <Text tone="secondary">The server has not produced post-test analysis for this submission yet. Pull to refresh.</Text>
        )}
        {(analysis?.recommendations || []).length > 0 ? (
          <Card>
            <Text weight="700">Recommendations</Text>
            {(analysis?.recommendations || []).map((item) => <Text key={item}>• {item}</Text>)}
          </Card>
        ) : null}
        <Button label="Open mistake notebook" tone="secondary" onPress={() => navigation.navigate('Mistakes')} />
        <Button label="Back to tests" tone="ghost" onPress={() => navigation.popToTop()} />
      </StateView>
    </Screen>
  );
}

type DueItem = { id: string; topicTitle?: string; curriculumNodeId?: string; status?: string; dueDate?: string; intervalDays?: number; currentRetention?: number; recommendedType?: string };

export function RevisionScreen() {
  const student = useStudent();
  const queryClient = useQueryClient();
  const due = useQuery({ queryKey: ['revision-due', student.studentId], enabled: Boolean(student.studentId), queryFn: () => revisionApi.due(student.studentId!, { limit: 30 }) });
  const history = useQuery({ queryKey: ['revision-history', student.studentId], enabled: Boolean(student.studentId), queryFn: () => revisionApi.history(student.studentId!, 20) });
  const [active, setActive] = useState<ActiveReview | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) return;
    setElapsed(0);
    const timer = setInterval(() => setElapsed(measuredSeconds(active, Date.now())), 1000);
    return () => clearInterval(timer);
  }, [active]);

  const begin = useMutation({
    mutationFn: async (item: DueItem) => {
      const revisionType = pickRevisionType(item);
      const created = await revisionApi.create(student.studentId!, { revisionType, curriculumNodeId: item.curriculumNodeId });
      return { itemId: item.id, eventId: eventIdFromCreateResponse(created), startedAtEpochMs: Date.now(), revisionType } satisfies ActiveReview;
    },
    onSuccess: (review) => setActive(review),
  });
  const finish = useMutation({
    mutationFn: async (outcome: RevisionOutcome) => {
      if (!active) throw new Error('No review in progress.');
      return revisionApi.complete(student.studentId!, active.eventId, { outcome, timeSpentSeconds: measuredSeconds(active, Date.now()) });
    },
    onSuccess: () => {
      setActive(null);
      due.refetch();
      history.refetch();
      queryClient.invalidateQueries({ queryKey: ['revision-due'] });
    },
  });

  const items = ((due.data as { items?: DueItem[] } | undefined)?.items || (Array.isArray(due.data) ? (due.data as DueItem[]) : [])) as DueItem[];
  const activeItem = active ? items.find((item) => item.id === active.itemId) : null;
  const historyRows = (history.data || []) as Array<{ id: string; outcome?: string | null; revisionType?: string; timeSpentSeconds?: number; completedAt?: string | null }>;

  return (
    <Screen refreshing={due.isRefetching} onRefresh={() => { due.refetch(); history.refetch(); }}>
      <Heading subtitle="Intervals are computed by the revision engine. A review records what you actually did and how long it took.">Revision</Heading>
      {active ? (
        <Card tone="accent">
          <Text tone="muted" variant="small">Reviewing · {titleCase(active.revisionType)} · {formatClock(elapsed)}</Text>
          <Text variant="title" weight="700">{activeItem?.topicTitle || 'Revision item'}</Text>
          <Text tone="secondary">Recall the topic from memory, then rate yourself honestly. The engine schedules the next review from this.</Text>
          <Row style={{ flexWrap: 'wrap' }}>
            {OUTCOME_LABELS.map((entry) => (
              <View key={entry.outcome} style={{ flex: 1, minWidth: 100 }}>
                <Button label={entry.label} tone={entry.outcome === 'recalled' ? 'primary' : 'secondary'} compact onPress={() => finish.mutate(entry.outcome)} disabled={finish.isPending} />
                <Text tone="muted" variant="small" style={{ textAlign: 'center' }}>{entry.hint}</Text>
              </View>
            ))}
          </Row>
          {finish.error ? <InlineNotice tone="danger" label={toUserError(finish.error).message} /> : null}
          <Button label="Abandon review" tone="ghost" compact onPress={() => setActive(null)} disabled={finish.isPending} />
        </Card>
      ) : null}
      {begin.error ? <InlineNotice tone="danger" label={toUserError(begin.error).message} /> : null}
      <StateView loading={due.isLoading || student.loading} error={due.error ? toUserError(due.error) : null} onRetry={() => due.refetch()} empty={items.length === 0 ? 'Nothing is due right now.' : null}>
        <Card>
          {items.map((item) => (
            <ListRow
              key={item.id}
              title={item.topicTitle || 'Revision item'}
              subtitle={[
                item.dueDate ? `Due ${new Date(item.dueDate).toLocaleDateString()}` : null,
                typeof item.intervalDays === 'number' ? `${item.intervalDays}d interval` : null,
                typeof item.currentRetention === 'number' ? `Retention ${Math.round(item.currentRetention)}%` : null,
              ].filter(Boolean).join(' · ') || null}
              trailing={<Button label="Review" compact tone="secondary" onPress={() => begin.mutate(item)} disabled={Boolean(active) || begin.isPending} />}
            />
          ))}
        </Card>
      </StateView>
      <SectionTitle>Recent reviews</SectionTitle>
      <Card>
        {history.isLoading ? <Text tone="secondary">Loading…</Text> : null}
        {history.error ? <Text tone="danger" variant="small">{toUserError(history.error).message}</Text> : null}
        {!history.isLoading && historyRows.length === 0 ? <Text tone="secondary">No reviews recorded yet.</Text> : null}
        {historyRows.slice(0, 8).map((item) => (
          <ListRow
            key={item.id}
            title={item.outcome ? titleCase(item.outcome) : 'Started, not completed'}
            subtitle={[item.revisionType ? titleCase(item.revisionType) : null, item.timeSpentSeconds ? formatClock(item.timeSpentSeconds) : null].filter(Boolean).join(' · ') || null}
            meta={item.completedAt ? new Date(item.completedAt).toLocaleDateString() : null}
          />
        ))}
      </Card>
    </Screen>
  );
}

export function MistakesScreen({ navigation }: NativeStackScreenProps<StudyStackParamList, 'Mistakes'>) {
  const [cause, setCause] = useState<string | undefined>();
  const query = useQuery({ queryKey: ['mistakes', cause], queryFn: () => mistakeApi.list(cause ? { rootCause: cause, limit: 40 } : { limit: 40 }) });
  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Root causes and coaching notes come from the mistake engine.">Mistakes</Heading>
      <Row style={{ flexWrap: 'wrap' }}>
        {['conceptual', 'calculation', 'silly', 'time_pressure'].map((item) => (
          <Chip key={item} label={titleCase(item)} active={cause === item} onPress={() => setCause(cause === item ? undefined : item)} />
        ))}
      </Row>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()} empty={(query.data?.mistakes || []).length === 0 ? 'No mistakes recorded.' : null}>
        <Text tone="secondary" variant="small">Open {query.data?.metrics.unresolvedCount ?? '—'} · Resolved {query.data?.metrics.resolvedCount ?? '—'}</Text>
        <Card>
          {(query.data?.mistakes || []).map((item) => (
            <ListRow
              key={item.id}
              title={titleCase(item.rootCause)}
              subtitle={item.notes ? String(item.notes).slice(0, 100) : null}
              meta={item.isResolved ? 'Resolved' : 'Open'}
              onPress={() => navigation.navigate('MistakeDetail', { mistakeId: item.id })}
            />
          ))}
        </Card>
      </StateView>
    </Screen>
  );
}

export function MistakeDetailScreen({ route }: NativeStackScreenProps<StudyStackParamList, 'MistakeDetail'>) {
  const query = useQuery({ queryKey: ['mistake', route.params.mistakeId], queryFn: () => mistakeApi.byId(route.params.mistakeId) });
  const [selected, setSelected] = useState<string[]>([]);
  const [startedAt] = useState(() => Date.now());
  const retry = useMutation({
    mutationFn: (selectedOptions: string[]) => mistakeApi.retry(route.params.mistakeId, { selectedOptions, timeSpentSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)) }),
    onSuccess: () => query.refetch(),
  });
  const question = query.data?.question;
  const kind = (question as { questionType?: string } | undefined)?.questionType || 'single_choice';
  return (
    <Screen>
      <Heading subtitle={query.data?.isResolved ? 'Resolved' : 'Open'}>{titleCase(query.data?.rootCause || 'Mistake')}</Heading>
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} onRetry={() => query.refetch()}>
        <Card>
          <MarkdownView source={question?.questionText || 'Question text was not included by the server.'} />
        </Card>
        <Card>
          <Text weight="700">Coaching note</Text>
          <Text tone="secondary">{query.data?.notes || 'No coaching note stored.'}</Text>
          <Text tone="muted" variant="small">Next retry: {query.data?.nextRetryAt ? new Date(query.data.nextRetryAt).toLocaleString() : 'not scheduled'}</Text>
        </Card>
        {(question?.options || []).length > 0 ? (
          <Card>
            <Text weight="700">Retry</Text>
            {(question?.options || []).map((option) => (
              <Chip key={option.optionKey} label={`${option.optionKey}. ${option.optionText}`} active={selected.includes(option.optionKey)} onPress={() => setSelected(selectOption(kind, selected, option.optionKey))} disabled={retry.isPending} />
            ))}
            <Button label="Check with server" onPress={() => retry.mutate(selected)} loading={retry.isPending} disabled={retry.isPending || selected.length === 0} />
          </Card>
        ) : (
          <Text tone="secondary">This mistake has no retryable options.</Text>
        )}
        {retry.error ? <InlineNotice tone="danger" label={toUserError(retry.error).message} /> : null}
        {retry.data ? (
          <InlineNotice tone={retry.data.isCorrect ? 'success' : 'warning'} label={retry.data.isCorrect ? 'Correct on retry' : 'Not correct yet'}>
            {retry.data.explanation || (retry.data.isCorrect ? 'The server marked this retry correct.' : 'The server marked this retry incorrect.')}
          </InlineNotice>
        ) : null}
      </StateView>
    </Screen>
  );
}
