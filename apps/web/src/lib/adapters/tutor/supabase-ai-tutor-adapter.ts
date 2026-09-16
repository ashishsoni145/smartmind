import type { TutorAdapter } from './tutor-adapter.interface';
import type {
  TutorSession,
  TutorMessage,
  TutorMode,
  TutorContext,
} from '@/lib/types/tutor';
import { getSupabaseClient } from '@/lib/supabase/client';
import { LocalAITutorAdapter } from './local-ai-tutor-adapter';

export class SupabaseAITutorAdapter implements TutorAdapter {
  public readonly name = 'SupabaseAITutorAdapter';
  private localFallback = new LocalAITutorAdapter();

  public async getSessions(userId: string): Promise<TutorSession[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.localFallback.getSessions(userId);

    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return this.localFallback.getSessions(userId);
      }

      return data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title,
        subjectId: row.subject_id,
        curriculumNodeId: row.curriculum_node_id,
        currentMode: (row.mode as TutorMode) || 'socratic',
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch {
      return this.localFallback.getSessions(userId);
    }
  }

  public async getSession(sessionId: string): Promise<TutorSession | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.localFallback.getSession(sessionId);

    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !data) return this.localFallback.getSession(sessionId);

      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        subjectId: data.subject_id,
        curriculumNodeId: data.curriculum_node_id,
        currentMode: (data.mode as TutorMode) || 'socratic',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return this.localFallback.getSession(sessionId);
    }
  }

  public async createSession(
    userId: string,
    title: string,
    mode: TutorMode,
    context?: TutorContext
  ): Promise<TutorSession> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.localFallback.createSession(userId, title, mode, context);

    try {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .insert({
          user_id: userId,
          title: title || (context?.topicTitle ? `${context.topicTitle} Session` : 'New Academic Dialogue'),
          subject_id: context?.subjectId || null,
          curriculum_node_id: context?.chapterId || null,
          mode,
        })
        .select()
        .single();

      if (error || !data) {
        return this.localFallback.createSession(userId, title, mode, context);
      }

      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        subjectId: data.subject_id,
        curriculumNodeId: data.curriculum_node_id,
        currentMode: mode,
        context,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch {
      return this.localFallback.createSession(userId, title, mode, context);
    }
  }

  public async deleteSession(sessionId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.localFallback.deleteSession(sessionId);

    try {
      const { error } = await supabase.from('tutor_sessions').delete().eq('id', sessionId);
      if (error) return this.localFallback.deleteSession(sessionId);
      return true;
    } catch {
      return this.localFallback.deleteSession(sessionId);
    }
  }

  public async getMessages(sessionId: string): Promise<TutorMessage[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.localFallback.getMessages(sessionId);

    try {
      const { data, error } = await supabase
        .from('tutor_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        return this.localFallback.getMessages(sessionId);
      }

      return data.map((row) => ({
        id: row.id,
        sessionId: row.session_id,
        senderRole: row.sender_role as 'student' | 'assistant' | 'system',
        messageText: row.message_text,
        imageUrl: row.image_url,
        createdAt: row.created_at,
      }));
    } catch {
      return this.localFallback.getMessages(sessionId);
    }
  }

  public async sendMessage(
    sessionId: string,
    messageText: string,
    mode: TutorMode,
    imageUrl?: string,
    context?: TutorContext
  ): Promise<TutorMessage> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return this.localFallback.sendMessage(sessionId, messageText, mode, imageUrl, context);
    }

    try {
      // Record student message
      await supabase.from('tutor_messages').insert({
        session_id: sessionId,
        sender_role: 'student',
        message_text: messageText,
        image_url: imageUrl || null,
      });

      // Generate pedagogical reply
      const reply = await this.localFallback.sendMessage(
        sessionId,
        messageText,
        mode,
        imageUrl,
        context
      );

      // Record assistant reply
      await supabase.from('tutor_messages').insert({
        session_id: sessionId,
        sender_role: 'assistant',
        message_text: reply.messageText,
        context_references: reply.citations ? (reply.citations as any) : null,
      });

      return reply;
    } catch {
      return this.localFallback.sendMessage(sessionId, messageText, mode, imageUrl, context);
    }
  }
}
