import { StaticCurriculumAdapter } from './static-curriculum-adapter';
import type { CurriculumAdapter } from './curriculum-adapter.interface';

export const curriculumAdapter: CurriculumAdapter = new StaticCurriculumAdapter();
export type { CurriculumAdapter };
export * from '@/lib/types/curriculum';
