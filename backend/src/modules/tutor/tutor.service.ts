import { supabase } from '../../db/client';
import { NotFoundError, BadRequestError } from '../../lib/errors';
import { logger } from '../../lib/logger';
import { aiOrchestrator } from '../../ai/orchestrator';
import { contextAssembler } from '../../ai/retrieval/context-assembler';
import { getTutorPrompt } from './tutor.prompts';
import { TutorRules } from './tutor.rules';
import {
  CreateSessionInput,
  SendMessageInput,
  ListSessionsQueryInput,
} from './tutor.schema';
import {
  TutorSession,
  TutorMessage,
  TutorMode,
  AiMessage,
  AiTaskType,
} from '@sharpmind/types';

export class TutorService {
  /**
   * Create a new persistent AI Tutor session
   */
  static async createSession(userId: string, input: CreateSessionInput): Promise<TutorSession> {
    const sessionPayload = {
      user_id: userId,
      student_id: userId,
      title: input.title || 'New Study Session',
      current_mode: input.mode || 'socratic',
      subject_id: input.subjectId || null,
      curriculum_node_id: input.curriculumNodeId || null,
      topic_id: input.topicId || null,
      context_meta: input.contextMeta || {},
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tutor_sessions')
      .insert(sessionPayload)
      .select()
      .single();

    if (error || !data) {
      logger.error({ error }, 'Failed to create tutor session in database');
      throw new BadRequestError(`Could not create tutor session: ${error?.message || 'Database error'}`);
    }

    return this.mapSessionRow(data);
  }

  /**
   * List all tutor sessions for a user
   */
  static async listSessions(
    userId: string,
    query: ListSessionsQueryInput
  ): Promise<{ sessions: TutorSession[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from('tutor_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new BadRequestError(`Failed to fetch tutor sessions: ${error.message}`);
    }

    return {
      sessions: (data || []).map(this.mapSessionRow),
      total: count || 0,
    };
  }

  /**
   * Get a session by ID with its messages
   */
  static async getSession(sessionId: string, userId: string): Promise<{ session: TutorSession; messages: TutorMessage[] }> {
    const { data: sessionRow, error: sessionErr } = await supabase
      .from('tutor_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (sessionErr || !sessionRow) {
      throw new NotFoundError(`Tutor session ${sessionId} not found`);
    }

    const { data: messageRows, error: msgErr } = await supabase
      .from('tutor_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (msgErr) {
      throw new BadRequestError(`Failed to load session messages: ${msgErr.message}`);
    }

    return {
      session: this.mapSessionRow(sessionRow),
      messages: (messageRows || []).map(this.mapMessageRow),
    };
  }

  /**
   * Send a student message, retrieve context, generate response via AI Orchestrator,
   * enforce active-learning guardrails, and persist both turns.
   */
  static async sendMessage(
    sessionId: string,
    userId: string,
    input: SendMessageInput
  ): Promise<{ studentMessage: TutorMessage; assistantMessage: TutorMessage }> {
    // 1. Fetch and verify session
    const { data: sessionRow, error: sessionErr } = await supabase
      .from('tutor_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (sessionErr || !sessionRow) {
      throw new NotFoundError(`Tutor session ${sessionId} not found`);
    }

    const activeMode: TutorMode = (input.mode || sessionRow.current_mode || 'socratic') as TutorMode;

    // Update session mode and timestamp if mode changed
    if (input.mode && input.mode !== sessionRow.current_mode) {
      await supabase
        .from('tutor_sessions')
        .update({ current_mode: input.mode, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    // 2. Persist student message
    const studentMsgPayload = {
      session_id: sessionId,
      sender_role: 'student',
      message_text: input.message,
      image_url: input.imageUrl || null,
      mode: activeMode,
      created_at: new Date().toISOString(),
    };

    const { data: studentMsgRow, error: studentMsgErr } = await supabase
      .from('tutor_messages')
      .insert(studentMsgPayload)
      .select()
      .single();

    if (studentMsgErr || !studentMsgRow) {
      throw new BadRequestError(`Failed to save student message: ${studentMsgErr?.message}`);
    }

    // 3. Assemble selective context
    const context = await contextAssembler.assemble({
      studentId: userId,
      curriculumNodeId: sessionRow.curriculum_node_id || undefined,
      topicId: sessionRow.topic_id || undefined,
      subjectId: sessionRow.subject_id || undefined,
      userQuery: input.message,
    });

    // 4. Retrieve recent message history (last 10 turns)
    const { data: historyRows } = await supabase
      .from('tutor_messages')
      .select('sender_role, message_text, image_url')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    const messages: AiMessage[] = (historyRows || []).map(row => ({
      role: row.sender_role === 'student' ? 'user' : 'assistant',
      content: row.message_text,
      images: row.image_url ? [row.image_url] : undefined,
    }));

    // Ensure the latest student message is present
    if (!messages.some(m => m.content === input.message)) {
      messages.push({
        role: 'user',
        content: input.message,
        images: input.imageUrl ? [input.imageUrl] : undefined,
      });
    }

    // 5. Build prompt and determine taskType
    const systemPrompt = getTutorPrompt(activeMode, context.formattedContextString);
    let taskType: AiTaskType = 'tutor_socratic';
    if (activeMode === 'hint') taskType = 'tutor_hint';
    else if (activeMode === 'teach' || activeMode === 'revision') taskType = 'tutor_explanation';
    else if (activeMode === 'check_solution') taskType = 'solution_check';

    // 6. Invoke AI Orchestrator
    const aiResponse = await aiOrchestrator.complete({
      taskType,
      messages,
      systemPrompt,
      studentId: userId,
      metadata: {
        sessionId,
        mode: activeMode,
      },
    });

    // 7. Active learning verification / sanitization
    let finalContent = aiResponse.content;
    const pedagogyCheck = TutorRules.checkActiveLearning(activeMode, finalContent);
    if (!pedagogyCheck.isCompliant && pedagogyCheck.sanitizedText) {
      finalContent = pedagogyCheck.sanitizedText;
    }

    // 8. Persist assistant message
    const assistantMsgPayload = {
      session_id: sessionId,
      sender_role: 'assistant',
      message_text: finalContent,
      citations: context.citations,
      latency_ms: aiResponse.latencyMs,
      model_used: aiResponse.model,
      provider_used: aiResponse.provider,
      mode: activeMode,
      created_at: new Date().toISOString(),
    };

    const { data: assistantMsgRow, error: assistantMsgErr } = await supabase
      .from('tutor_messages')
      .insert(assistantMsgPayload)
      .select()
      .single();

    if (assistantMsgErr || !assistantMsgRow) {
      throw new BadRequestError(`Failed to save assistant response: ${assistantMsgErr?.message}`);
    }

    // Update session timestamp
    await supabase
      .from('tutor_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return {
      studentMessage: this.mapMessageRow(studentMsgRow),
      assistantMessage: this.mapMessageRow(assistantMsgRow),
    };
  }

  /**
   * Delete a tutor session and associated messages
   */
  static async deleteSession(sessionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('tutor_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestError(`Failed to delete session: ${error.message}`);
    }
  }

  private static mapSessionRow(row: any): TutorSession {
    return {
      id: row.id,
      userId: row.user_id,
      studentId: row.student_id,
      title: row.title || 'Study Session',
      subjectId: row.subject_id || undefined,
      curriculumNodeId: row.curriculum_node_id || undefined,
      topicId: row.topic_id || undefined,
      currentMode: row.current_mode || 'socratic',
      mode: row.current_mode || 'socratic',
      contextMeta: row.context_meta || {},
      status: row.status || 'active',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private static mapMessageRow(row: any): TutorMessage {
    return {
      id: row.id,
      sessionId: row.session_id,
      senderRole: row.sender_role,
      role: row.sender_role === 'student' ? 'user' : 'assistant',
      messageText: row.message_text,
      content: row.message_text,
      imageUrl: row.image_url || undefined,
      mode: row.mode || undefined,
      citations: row.citations || [],
      groundedReferences: row.citations || [],
      latencyMs: row.latency_ms || undefined,
      modelUsed: row.model_used || undefined,
      providerUsed: row.provider_used || undefined,
      createdAt: row.created_at,
    };
  }
}
