import type { TutorAdapter } from './tutor-adapter.interface';
import { LocalAITutorAdapter } from './local-ai-tutor-adapter';
import { SupabaseAITutorAdapter } from './supabase-ai-tutor-adapter';

function createTutorAdapter(): TutorAdapter {
  const hasSupabase =
    typeof process !== 'undefined' &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabase) {
    return new SupabaseAITutorAdapter();
  }
  // Fallback to local adapter when Supabase credentials are missing
  return new LocalAITutorAdapter();
}

export const tutorAdapter: TutorAdapter = createTutorAdapter();
export * from './tutor-adapter.interface';
export * from './local-ai-tutor-adapter';
export * from './supabase-ai-tutor-adapter';
