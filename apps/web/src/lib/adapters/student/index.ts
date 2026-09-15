import { LocalStudentProfileAdapter } from './local-student-profile-adapter';
import type { StudentProfileAdapter } from './student-profile-adapter.interface';

export const studentProfileAdapter: StudentProfileAdapter = new LocalStudentProfileAdapter();
export type { StudentProfileAdapter };
export * from '@/lib/types/onboarding';
