import type { TutorAdapter } from './tutor-adapter.interface';
import { LocalAITutorAdapter } from './local-ai-tutor-adapter';
import { NotConfiguredTutorAdapter } from './not-configured-tutor-adapter';
import { SupabaseAITutorAdapter } from './supabase-ai-tutor-adapter';

function isTruthyFlag(value: string | undefined): boolean {
  if (!value) return false;
  return !['0', 'false', 'no', 'off'].includes(value.trim().toLowerCase());
}

/**
 * Selects the tutor adapter.
 *
 * `LocalAITutorAdapter` does not call any model. It returns a canned passage chosen by the tutor
 * mode, ignores the question that was asked, and cites "NCERT Curriculum Provenance" for a source it
 * never consulted. That is usable for layout work and unacceptable anywhere a real student can read
 * it, so it is opt-in through `NEXT_PUBLIC_ALLOW_LOCAL_TUTOR=1` rather than a silent fallback.
 * A deployment with no backend gets `NotConfiguredTutorAdapter`, which says so in the reply itself.
 *
 * This is a separate flag from the auth adapter's `NEXT_PUBLIC_ALLOW_LOCAL_AUTH` on purpose: turning
 * on browser-only sign-in for local development should not also turn on fabricated teaching.
 *
 * `process.env` is read as a literal member expression because Next.js inlines `NEXT_PUBLIC_*` into
 * the browser bundle by textual replacement of exactly that form; `process.env[name]` would always
 * be `undefined` on the client.
 */
function createTutorAdapter(): TutorAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseAITutorAdapter();
  }

  const missing = [
    !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : '',
    !supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : '',
  ]
    .filter(Boolean)
    .join(' and ');

  // Read as a literal too, for the inlining reason above.
  if (isTruthyFlag(process.env.NEXT_PUBLIC_ALLOW_LOCAL_TUTOR)) {
    console.warn(
      `[tutor] ${missing} ${missing.includes(' and ') ? 'are' : 'is'} not set and NEXT_PUBLIC_ALLOW_LOCAL_TUTOR is enabled, so the tutor is using LocalAITutorAdapter. Its replies are canned text selected by mode - the question is not read, no model is called, and the citations are invented. Layout work only.`
    );
    return new LocalAITutorAdapter();
  }

  console.error(
    `[tutor] ${missing} ${missing.includes(' and ') ? 'are' : 'is'} not set, so no AI tutor backend is available. SharpMind will not fabricate an answer or a citation: the tutor replies that it is unavailable and why. Set ${missing.includes(' and ') ? 'both values' : missing}, or set NEXT_PUBLIC_ALLOW_LOCAL_TUTOR=1 for canned local-development replies.`
  );
  return new NotConfiguredTutorAdapter();
}

export const tutorAdapter: TutorAdapter = createTutorAdapter();
export * from './tutor-adapter.interface';
export * from './local-ai-tutor-adapter';
export * from './supabase-ai-tutor-adapter';
export * from './not-configured-tutor-adapter';
