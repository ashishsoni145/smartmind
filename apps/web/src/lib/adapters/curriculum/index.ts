import { StaticCurriculumAdapter } from './static-curriculum-adapter';
import { SupabaseCurriculumAdapter } from './supabase-curriculum-adapter';
import type { CurriculumAdapter } from './curriculum-adapter.interface';

function createCurriculumAdapter(): CurriculumAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    throw new Error('Supabase configuration missing in production for CurriculumAdapter');
  }

  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseCurriculumAdapter();
  }

  return new StaticCurriculumAdapter();
}

export const curriculumAdapter: CurriculumAdapter = createCurriculumAdapter();
export type { CurriculumAdapter };
export * from '@/lib/types/curriculum';
