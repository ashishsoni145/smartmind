import type { OnboardingDraft, StudentProfile } from '@/lib/types/onboarding';

export interface StudentProfileAdapter {
  name: string;
  getProfile(userId: string): Promise<StudentProfile | null>;
  saveDraft(userId: string, draft: OnboardingDraft, step: number): Promise<void>;
  getDraft(userId: string): Promise<{ draft: OnboardingDraft; step: number } | null>;
  completeOnboarding(userId: string, profile: StudentProfile): Promise<StudentProfile>;
  resetOnboarding(userId: string): Promise<void>;
}
