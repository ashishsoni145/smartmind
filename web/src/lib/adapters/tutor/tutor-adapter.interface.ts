import type {
  TutorSession,
  TutorMessage,
  TutorMode,
  TutorContext,
} from '@/lib/types/tutor';

export interface TutorAdapter {
  name: string;
  getSessions(userId: string): Promise<TutorSession[]>;
  getSession(sessionId: string): Promise<TutorSession | null>;
  createSession(userId: string, title: string, mode: TutorMode, context?: TutorContext): Promise<TutorSession>;
  deleteSession(sessionId: string): Promise<boolean>;
  getMessages(sessionId: string): Promise<TutorMessage[]>;
  sendMessage(
    sessionId: string,
    messageText: string,
    mode: TutorMode,
    imageUrl?: string,
    context?: TutorContext
  ): Promise<TutorMessage>;
}
