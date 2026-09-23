import { LocalStudentProfileAdapter } from './local-student-profile-adapter';
import { SupabaseStudentProfileAdapter } from './supabase-student-profile-adapter';
import type { StudentProfileAdapter } from './student-profile-adapter.interface';

function createStudentProfileAdapter(): StudentProfileAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseStudentProfileAdapter();
  }

  // During SSR / static site generation (e.g. Next.js build prerendering) or local development without credentials, use Local adapter
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    throw new Error('Critical Configuration Error: Supabase credentials are missing in production.');
  }

  return new LocalStudentProfileAdapter();
}

export const studentProfileAdapter: StudentProfileAdapter = createStudentProfileAdapter();
export type { StudentProfileAdapter };
export * from '@/lib/types/onboarding';
