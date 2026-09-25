import React, { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TutorMessage, TutorMode } from '@sharpmind/types';
import { filesApi, tutorApi } from '../../api';
import { authorizedFetch } from '../../api/client';
import { Button, Card, Chip, Heading, MarkdownView, Screen, StateView } from '../../components/ui';
import { focusNative } from '../../features/focus/nativeFocus';
import type { TutorStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { toUserError } from '../../utils/errors';
import { decodeBase64 } from '../../utils/base64';

const MODES: TutorMode[] = ['socratic', 'teach', 'hint', 'practice', 'explain_mistake'];

export function TutorListScreen({ navigation }: NativeStackScreenProps<TutorStackParamList, 'TutorList'>) {
  const query = useQuery({ queryKey: ['tutor-sessions'], queryFn: () => tutorApi.list() });
  const create = useMutation({
    mutationFn: () => tutorApi.create({ title: 'Mobile tutor', mode: 'socratic' }),
    onSuccess: (session) => navigation.navigate('TutorChat', { sessionId: session.id, title: session.title }),
  });
  const sessions = query.data?.sessions || [];
  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Heading subtitle="Grounded replies come from the tutor API. This client does not invent answers.">AI Tutor</Heading>
      <Button label={create.isPending ? 'Starting…' : 'New conversation'} onPress={() => create.mutate()} disabled={create.isPending} />
      <StateView loading={query.isLoading} error={query.error ? toUserError(query.error).message : null} empty={sessions.length === 0 ? 'No conversations yet.' : null} onRetry={() => query.refetch()}>
        {sessions.map((session) => (
          <Card key={session.id}>
            <Text style={{ fontWeight: '700' }}>{session.title}</Text>
            <Button label="Open" onPress={() => navigation.navigate('TutorChat', { sessionId: session.id, title: session.title })} />
          </Card>
        ))}
      </StateView>
    </Screen>
  );
}

export function TutorChatScreen({ route }: NativeStackScreenProps<TutorStackParamList, 'TutorChat'>) {
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
  const [attachment, setAttachment] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  async function send() {
    const message = text.trim();
    if (!message || pending) return;
    setPending(true);
    setError(null);
    const abort = new AbortController();
    controller.current = abort;
    try {
      const response = await fetchTutorMessage(route.params.sessionId, message, mode, abort.signal, attachment);
      if (abort.signal.aborted) return;
      setText('');
      setAttachment(null);
      client.setQueryData(['tutor-session', route.params.sessionId], (current: { session: unknown; messages: TutorMessage[] } | undefined) => ({
        session: current?.session,
        messages: [...(current?.messages || []), response.studentMessage, response.assistantMessage],
      }));
    } catch (err) {
      if (!abort.signal.aborted) setError(toUserError(err).message);
    } finally {
      setPending(false);
    }
  }

  async function attach() {
    try {
      const uri = await focusNative.pickImage();
      if (!uri) return;
      const base64 = await focusNative.readFileBase64(uri);
      const bytes = decodeBase64(base64);
      if (bytes.byteLength > 8 * 1024 * 1024) {
        throw new Error('That image is larger than 8 MB.');
      }
      const upload = await filesApi.uploadUrl({
        fileName: 'tutor-attachment.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: bytes.byteLength,
        fileType: 'other',
      });
      const uploadUrl = new URL(upload.uploadUrl);
      if (!uploadUrl.searchParams.get('token') && upload.token) {
        uploadUrl.searchParams.set('token', upload.token);
      }
      const put = await fetch(uploadUrl.toString(), {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
        body: bytes,
      });
      if (!put.ok) {
        throw new Error(`The file service rejected the upload (${put.status}). Nothing was attached.`);
      }
      const download = await filesApi.downloadUrl(upload.fileId);
      setAttachment(download.downloadUrl);
      setError(null);
    } catch (err) {
      setError(toUserError(err).message);
    }
  }

  const messages = sessionQuery.data?.messages || [];
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll={false}>
        <Heading subtitle="The tutor API returns a complete reply. This screen does not invent a token stream.">{route.params.title || 'Tutor'}</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {MODES.map((item) => <Chip key={item} label={item} active={mode === item} onPress={() => setMode(item)} />)}
        </View>
        <StateView loading={sessionQuery.isLoading} error={sessionQuery.error ? toUserError(sessionQuery.error).message : null} onRetry={() => sessionQuery.refetch()}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <Card>
                <Text style={{ color: theme.colors.textMuted }}>{item.senderRole}</Text>
                <MarkdownView source={item.messageText || item.content || ''} />
              </Card>
            )}
          />
        </StateView>
        {error ? <Text style={{ color: theme.colors.danger }}>{error}</Text> : null}
        <TextInput
          accessibilityLabel="Message"
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Ask a question"
          placeholderTextColor={theme.colors.textMuted}
          style={{ minHeight: 48, color: theme.colors.text, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 12, padding: 10 }}
        />
        {attachment ? <Text style={{ color: theme.colors.textSecondary }}>Image attached. It will be sent with the next message.</Text> : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button label={pending ? 'Waiting…' : 'Send'} onPress={send} disabled={pending} />
          <Button label="Cancel" tone="ghost" onPress={() => controller.current?.abort()} />
          <Button label="Attach" tone="ghost" onPress={attach} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

async function fetchTutorMessage(
  sessionId: string,
  message: string,
  mode: TutorMode,
  signal: AbortSignal,
  imageUrl: string | null,
): Promise<{ studentMessage: TutorMessage; assistantMessage: TutorMessage }> {
  const response = await authorizedFetch(`/tutor/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: JSON.stringify({ message, mode, ...(imageUrl ? { imageUrl } : {}) }),
    signal,
  });
  const raw = await response.text();
  const body = JSON.parse(raw) as {
    success?: boolean;
    error?: { message?: string };
    data?: { studentMessage: TutorMessage; assistantMessage: TutorMessage };
  };
  if (!response.ok || !body.success || !body.data?.studentMessage || !body.data.assistantMessage) {
    throw new Error(body.error?.message || 'Tutor request failed. No reply was invented.');
  }
  return body.data;
}
