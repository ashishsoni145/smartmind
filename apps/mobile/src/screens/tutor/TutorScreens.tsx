import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TutorMessage, TutorMode } from '@sharpmind/types';
import { filesApi, tutorApi } from '../../api';
import { ApiClientError, authorizedFetch, LONG_TIMEOUT_MS } from '../../api/client';
import { Button, Card, Chip, Heading, InlineNotice, ListRow, MarkdownView, Row, Screen, StateView, Text } from '../../components/ui';
import { focusNative } from '../../features/focus/nativeFocus';
import type { TutorStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { decodeBase64 } from '../../utils/base64';
import { toUserError } from '../../utils/errors';
import { sniffImageType } from '../../utils/imageType';
import { titleCase } from '../../utils/format';

const MODES: TutorMode[] = ['socratic', 'teach', 'hint', 'practice', 'explain_mistake'];
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

export function TutorListScreen({ navigation }: NativeStackScreenProps<TutorStackParamList, 'TutorList'>) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['tutor-sessions'], queryFn: () => tutorApi.list() });
  const create = useMutation({
    mutationFn: () => tutorApi.create({ title: `Conversation · ${new Date().toLocaleDateString()}`, mode: 'socratic' }),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['tutor-sessions'] });
      navigation.navigate('TutorChat', { sessionId: session.id, title: session.title });
    },
  });
  const remove = useMutation({
    mutationFn: (sessionId: string) => tutorApi.remove(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tutor-sessions'] }),
  });
  const sessions = query.data?.sessions || [];

  function confirmDelete(sessionId: string, title: string) {
    Alert.alert('Delete conversation?', `“${title}” will be deleted on the server.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove.mutate(sessionId) },
    ]);
  }

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Replies come from the tutor API with citations where the server provides them. Nothing is generated on the device.">AI Tutor</Heading>
      <Button label="New conversation" onPress={() => create.mutate()} loading={create.isPending} disabled={create.isPending} />
      {create.error ? <InlineNotice tone="danger" label={toUserError(create.error).message} /> : null}
      {remove.error ? <InlineNotice tone="danger" label={toUserError(remove.error).message} /> : null}
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error) : null} empty={sessions.length === 0 ? 'No conversations yet. Start one above.' : null} onRetry={() => query.refetch()}>
        <Card>
          {sessions.map((session) => (
            <ListRow
              key={session.id}
              title={session.title}
              subtitle={`${titleCase(session.currentMode || session.mode || 'socratic')} · ${new Date(session.updatedAt || session.createdAt).toLocaleString()}`}
              onPress={() => navigation.navigate('TutorChat', { sessionId: session.id, title: session.title })}
              trailing={<Button label="Delete" tone="ghost" compact onPress={() => confirmDelete(session.id, session.title)} disabled={remove.isPending} />}
            />
          ))}
        </Card>
      </StateView>
    </Screen>
  );
}

type Attachment = { url: string; mimeType: string; sizeBytes: number };

export function TutorChatScreen({ route, navigation }: NativeStackScreenProps<TutorStackParamList, 'TutorChat'>) {
  const theme = useTheme();
  const client = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: ['tutor-session', route.params.sessionId],
    queryFn: () => tutorApi.get(route.params.sessionId),
  });
  const [text, setText] = useState('');
  const [mode, setMode] = useState<TutorMode>('socratic');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [attaching, setAttaching] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const controller = useRef<AbortController | null>(null);
  const list = useRef<FlatList<TutorMessage>>(null);

  useEffect(() => {
    const current = sessionQuery.data?.session;
    const serverMode = current?.currentMode || current?.mode;
    if (serverMode && MODES.includes(serverMode)) setMode(serverMode);
    if (current?.title) navigation.setOptions({ title: current.title });
  }, [sessionQuery.data?.session, navigation]);

  useEffect(() => () => controller.current?.abort(), []);

  async function send() {
    const message = text.trim();
    if (!message || pending) return;
    setPending(true);
    setError(null);
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetchTutorMessage(route.params.sessionId, message, mode, abort.signal, attachment?.url ?? null);
      if (abort.signal.aborted) return;
      setText('');
      setAttachment(null);
      client.setQueryData(['tutor-session', route.params.sessionId], (current: { session: unknown; messages: TutorMessage[] } | undefined) => ({
        session: current?.session,
        messages: [...(current?.messages || []), response.studentMessage, response.assistantMessage],
      }));
      client.invalidateQueries({ queryKey: ['tutor-sessions'] });
      setTimeout(() => list.current?.scrollToEnd({ animated: true }), 50);
    } catch (err) {
      if (abort.signal.aborted) {
        setError('Request cancelled. Your message was kept so you can send it again.');
      } else {
        setError(toUserError(err).message);
      }
    } finally {
      if (controller.current === abort) controller.current = null;
      setPending(false);
    }
  }

  async function attach() {
    if (attaching) return;
    setAttaching(true);
    try {
      const uri = await focusNative.pickImage();
      if (!uri) return;
      const base64 = await focusNative.readFileBase64(uri);
      const bytes = decodeBase64(base64);
      if (bytes.byteLength === 0) throw new Error('The selected file is empty.');
      if (bytes.byteLength > MAX_ATTACHMENT_BYTES) throw new Error('That image is larger than 8 MB.');
      const kind = sniffImageType(bytes);
      if (!kind) throw new Error('Only JPEG, PNG, WebP or GIF images can be attached.');
      const upload = await filesApi.uploadUrl({
        fileName: `tutor-attachment-${Date.now()}.${kind.extension}`,
        mimeType: kind.mimeType,
        sizeBytes: bytes.byteLength,
        fileType: 'homework',
      });
      const uploadUrl = new URL(upload.uploadUrl);
      if (!uploadUrl.searchParams.get('token') && upload.token) {
        uploadUrl.searchParams.set('token', upload.token);
      }
      const put = await fetch(uploadUrl.toString(), {
        method: 'PUT',
        headers: { 'Content-Type': kind.mimeType, 'x-upsert': 'true' },
        body: bytes,
      });
      if (!put.ok) {
        throw new Error(`The file service rejected the upload (${put.status}). Nothing was attached.`);
      }
      const download = await filesApi.downloadUrl(upload.fileId);
      setAttachment({ url: download.downloadUrl, mimeType: kind.mimeType, sizeBytes: bytes.byteLength });
      setError(null);
    } catch (err) {
      setError(toUserError(err).message);
    } finally {
      setAttaching(false);
    }
  }

  const messages = sessionQuery.data?.messages || [];
  const canSend = text.trim().length > 0 && !pending;
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll={false}>
        <Row style={{ flexWrap: 'wrap' }}>
          {MODES.map((item) => (
            <Chip key={item} label={titleCase(item)} active={mode === item} onPress={() => setMode(item)} disabled={pending} />
          ))}
        </Row>
        <StateView loading={sessionQuery.isLoading} loadingLabel="Loading conversation" error={sessionQuery.error ? toUserError(sessionQuery.error) : null} onRetry={() => sessionQuery.refetch()}>
          <FlatList
            ref={list}
            data={messages}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 12, flexGrow: 1 }}
            onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={<Text tone="secondary" style={{ textAlign: 'center', marginTop: 24 }}>Ask your first question. Attach a photo of a problem if it helps.</Text>}
            renderItem={({ item }) => <MessageBubble message={item} />}
          />
        </StateView>
        {pending ? <Text tone="muted" variant="small" accessibilityLiveRegion="polite">Waiting for the tutor… this can take up to {Math.round(LONG_TIMEOUT_MS / 1000)} seconds.</Text> : null}
        {error ? <InlineNotice tone="danger" label={error} /> : null}
        {attachment ? (
          <Row>
            <Text tone="secondary" variant="small" style={{ flex: 1 }}>Image attached ({Math.round(attachment.sizeBytes / 1024)} KB). It is sent with the next message.</Text>
            <Button label="Remove" tone="ghost" compact onPress={() => setAttachment(null)} />
          </Row>
        ) : null}
        <TextInput
          accessibilityLabel="Message"
          value={text}
          onChangeText={setText}
          multiline
          editable={!pending}
          placeholder="Ask a question"
          placeholderTextColor={theme.colors.textMuted}
          style={{ minHeight: 48, maxHeight: 140, color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 12, padding: 10 }}
        />
        <Row>
          <View style={{ flex: 1 }}>
            <Button label="Send" onPress={send} loading={pending} disabled={!canSend} />
          </View>
          {pending ? <Button label="Cancel" tone="ghost" onPress={() => controller.current?.abort()} /> : null}
          <Button label={attaching ? 'Uploading…' : 'Attach'} tone="ghost" onPress={attach} disabled={attaching || pending} />
        </Row>
      </Screen>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message }: { message: TutorMessage }) {
  const theme = useTheme();
  const isStudent = message.senderRole === 'student' || message.role === 'user' || message.role === 'student';
  const citations = message.citations || message.groundedReferences || [];
  return (
    <View
      accessibilityLabel={`${isStudent ? 'You' : 'Tutor'} said`}
      style={{
        alignSelf: isStudent ? 'flex-end' : 'flex-start',
        maxWidth: '92%',
        backgroundColor: isStudent ? theme.colors.accentSoft : theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        gap: 4,
      }}>
      <Text tone="muted" variant="small">{isStudent ? 'You' : 'Tutor'}{message.mode ? ` · ${titleCase(message.mode)}` : ''}</Text>
      {message.imageUrl ? <Text tone="secondary" variant="small">Image attached</Text> : null}
      <MarkdownView source={message.messageText || message.content || ''} />
      {citations.length > 0 ? (
        <Text tone="muted" variant="small">Sources: {citations.map((c) => (typeof c === 'string' ? c : (c as { title?: string; source?: string }).title || (c as { source?: string }).source || 'reference')).join(', ')}</Text>
      ) : null}
    </View>
  );
}

async function fetchTutorMessage(
  sessionId: string,
  message: string,
  mode: TutorMode,
  signal: AbortSignal,
  imageUrl: string | null,
): Promise<{ studentMessage: TutorMessage; assistantMessage: TutorMessage }> {
  const response = await authorizedFetch(
    `/tutor/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: JSON.stringify({ message, mode, ...(imageUrl ? { imageUrl } : {}) }),
      signal,
    },
    LONG_TIMEOUT_MS,
  );
  const raw = await response.text();
  let body: { success?: boolean; error?: { message?: string; code?: string }; data?: { studentMessage: TutorMessage; assistantMessage: TutorMessage } } = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    body = {};
  }
  if (!response.ok || !body.success || !body.data?.studentMessage || !body.data.assistantMessage) {
    throw new ApiClientError(body.error?.message || `Tutor request failed (${response.status}).`, response.status, body.error?.code || `HTTP_${response.status}`);
  }
  return body.data;
}
