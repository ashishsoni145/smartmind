import type { TutorAdapter } from './tutor-adapter.interface';
import type { TutorContext, TutorMessage, TutorMode, TutorSession } from '@/lib/types/tutor';

export const TUTOR_NOT_CONFIGURED_MESSAGE =
  'The AI tutor is not available in this deployment: no backend is configured, so no answer has been generated. Nothing below this line was written by a model, and no source is cited because none was consulted. This is a deployment configuration problem, not something you did — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, and ask the tutor again once the site is correctly configured.';

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Returned when the tutor has no backend to talk to.
 *
 * `LocalAITutorAdapter` used to be the silent fallback here, and it did not merely stand in for
 * missing data — it fabricated teaching. Its reply was chosen by the tutor *mode* alone: the
 * student's actual question was passed in and never read. It claimed "I have analyzed your attached
 * diagram" for diagrams it never opened, told students their unseen reasoning was "conceptually
 * accurate", and attached citations reading "NCERT Curriculum Provenance" and "Verified Syllabus
 * Reference" for sources that were never consulted. A student cannot tell that apart from a real
 * answer, which is what makes it worse than an error.
 *
 * This adapter cannot crash the page either. `handleSendMessage` in the tutor screen calls
 * `createSession` outside a try/catch, so throwing would surface as an unhandled rejection and a
 * blank screen; instead `createSession` returns a real local session container and `sendMessage`
 * returns an assistant message that states the truth. `citations` is explicitly empty so fabricated
 * provenance has nowhere to come from.
 */
export class NotConfiguredTutorAdapter implements TutorAdapter {
  public readonly name = 'NotConfiguredTutorAdapter';

  async getSessions(): Promise<TutorSession[]> {
    return [];
  }

  async getSession(): Promise<TutorSession | null> {
    return null;
  }

  async createSession(
    userId: string,
    title: string,
    mode: TutorMode,
    context?: TutorContext
  ): Promise<TutorSession> {
    const at = nowIso();
    return {
      id: `tutor-not-configured-${Date.now()}`,
      userId,
      title,
      currentMode: mode,
      mode,
      context,
      status: 'not_configured',
      createdAt: at,
      updatedAt: at,
      messageCount: 0,
    };
  }

  async deleteSession(): Promise<boolean> {
    // Nothing was ever persisted, so there is nothing to delete. Report that honestly rather than
    // claiming a successful deletion.
    return false;
  }

  async getMessages(): Promise<TutorMessage[]> {
    return [];
  }

  async sendMessage(
    sessionId: string,
    // Kept for positional compatibility with TutorAdapter and deliberately unused: the whole point
    // is that nothing generates a reply to it.
    _messageText: string,
    mode: TutorMode,
    imageUrl?: string
  ): Promise<TutorMessage> {
    return {
      id: `tutor-unavailable-${Date.now()}`,
      sessionId,
      senderRole: 'assistant',
      role: 'assistant',
      messageText: TUTOR_NOT_CONFIGURED_MESSAGE,
      content: TUTOR_NOT_CONFIGURED_MESSAGE,
      imageUrl,
      mode,
      // Deliberately empty: this reply consulted no source, so it cites none.
      citations: [],
      groundedReferences: [],
      modelUsed: 'none',
      providerUsed: 'none',
      tokensUsed: 0,
      createdAt: nowIso(),
    };
  }
}
