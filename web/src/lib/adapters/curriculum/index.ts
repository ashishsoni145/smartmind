import { StaticCurriculumAdapter } from './static-curriculum-adapter';
import { SupabaseCurriculumAdapter } from './supabase-curriculum-adapter';
import type { CurriculumAdapter } from './curriculum-adapter.interface';

function createCurriculumAdapter(): CurriculumAdapter {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;



  if (supabaseUrl && supabaseAnonKey) {
    return new SupabaseCurriculumAdapter();
  }

  return new StaticCurriculumAdapter();
}

export const curriculumAdapter: CurriculumAdapter = createCurriculumAdapter();
export type { CurriculumAdapter };
export * from '@/lib/types/curriculum';
