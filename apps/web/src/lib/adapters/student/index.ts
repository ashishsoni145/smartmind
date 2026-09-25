import { LocalStudentProfileAdapter } from './local-student-profile-adapter';
import { SupabaseStudentProfileAdapter } from './supabase-student-profile-adapter';
import type { StudentProfileAdapter } from './student-profile-adapter.interface';

function createStudentProfileAdapter(): StudentProfileAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseStudentProfileAdapter();
  }



  return new LocalStudentProfileAdapter();
}

export const studentProfileAdapter: StudentProfileAdapter = createStudentProfileAdapter();
export type { StudentProfileAdapter };
export * from '@/lib/types/onboarding';
