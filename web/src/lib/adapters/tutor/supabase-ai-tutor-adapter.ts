import type { TutorAdapter } from './tutor-adapter.interface';
import type {
  TutorSession,
  TutorMessage,
  TutorMode,
  TutorContext,
} from '@/lib/types/tutor';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getApiClient } from '@/lib/api';

export class SupabaseAITutorAdapter implements TutorAdapter {
  public readonly name = 'SupabaseAITutorAdapter';

  public async getSessions(userId: string): Promise<TutorSession[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .select('*')
        .eq('student_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) {
        console.warn('Could not fetch tutor sessions:', error?.message);
        return [];
      }

      return data.map((row) => ({
        id: row.id,
        userId: row.student_id,
        title: row.title,
        subjectId: row.subject_id,
        curriculumNodeId: row.curriculum_node_id,
        currentMode: (row.mode as TutorMode) || 'socratic',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      console.error('Failed to load tutor sessions:', err);
      return [];
    }
  }

  public async getSession(sessionId: string): Promise<TutorSession | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.student_id,
        title: data.title,
        subjectId: data.subject_id,
        curriculumNodeId: data.curriculum_node_id,
        currentMode: (data.mode as TutorMode) || 'socratic',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return null;
    }
  }

  public async createSession(
    userId: string,
    title: string,
    mode: TutorMode,
    context?: TutorContext
  ): Promise<TutorSession> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Database client not initialized');

    const sessionTitle = title || (context?.topicTitle ? `${context.topicTitle} Session` : 'New Concept Dialogue');

    const { data, error } = await supabase
      .from('tutor_sessions')
      .insert({
        student_id: userId,
        title: sessionTitle,
        subject_id: context?.subjectId || null,
        curriculum_node_id: context?.chapterId || null,
        mode,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create tutor session: ${error?.message || 'Unknown database error'}`);
    }

    return {
      id: data.id,
      userId: data.student_id,
      title: data.title,
      subjectId: data.subject_id,
      curriculumNodeId: data.curriculum_node_id,
      currentMode: mode,
      context,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  public async deleteSession(sessionId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from('tutor_sessions').delete().eq('id', sessionId);
      return !error;
    } catch {
      return false;
    }
  }

  public async getMessages(sessionId: string): Promise<TutorMessage[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('tutor_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error || !data) return [];

      return data.map((row) => ({
        id: row.id,
        sessionId: row.session_id,
        senderRole: row.sender_role as 'student' | 'assistant' | 'system',
        messageText: row.message_text,
        imageUrl: row.image_url,
        createdAt: row.created_at,
      }));
    } catch {
      return [];
    }
  }

  public async sendMessage(
    sessionId: string,
    messageText: string,
    mode: TutorMode,
    imageUrl?: string,
    context?: TutorContext
  ): Promise<TutorMessage> {
    // 1. Try live backend AI Orchestrator first
    try {
      const api = getApiClient();
      const res = await api.tutor.sendMessage(sessionId, {
        message: messageText,
        imageUrl,
        mode,
      });

      if (res && res.assistantMessage) {
        return {
          id: res.assistantMessage.id,
          sessionId: res.assistantMessage.sessionId,
          senderRole: 'assistant',
          messageText: (res.assistantMessage as any).messageText || (res.assistantMessage as any).content || '',
          imageUrl: res.assistantMessage.imageUrl,
          citations: (res.assistantMessage.citations || []) as any,
          createdAt: res.assistantMessage.createdAt,
        };
      }
    } catch (apiErr: any) {
      console.warn('Backend tutor endpoint error:', apiErr?.message);
    }

    // 2. Direct Supabase write path
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client unavailable');
    }

    // Record student inquiry
    await supabase.from('tutor_messages').insert({
      session_id: sessionId,
      sender_role: 'student',
      message_text: messageText,
      image_url: imageUrl || null,
    });

    // Provide honest system response when AI backend is unreachable rather than fabricating canned answers
    const fallbackAssistantText =
      'The Socratic AI Tutor engine is temporarily unavailable or synthesizing a high-dimensional response. Please verify backend connectivity or retry in a few moments.';

    const { data: insertedMsg } = await supabase
      .from('tutor_messages')
      .insert({
        session_id: sessionId,
        sender_role: 'assistant',
        message_text: fallbackAssistantText,
      })
      .select()
      .single();

    return {
      id: insertedMsg?.id || `fallback-${Date.now()}`,
      sessionId,
      senderRole: 'assistant',
      messageText: fallbackAssistantText,
      createdAt: new Date().toISOString(),
    };
  }
}
