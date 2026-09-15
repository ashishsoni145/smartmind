import type { StudentProfileAdapter } from './student-profile-adapter.interface';
import type { OnboardingDraft, StudentProfile } from '@/lib/types/onboarding';

const PROFILE_KEY_PREFIX = 'sharpmind_student_profile_';
const DRAFT_KEY_PREFIX = 'sharpmind_onboarding_draft_';

export class LocalStudentProfileAdapter implements StudentProfileAdapter {
  public readonly name = 'LocalStudentProfileAdapter';

  private getKey(prefix: string, userId: string): string {
    return `${prefix}${userId || 'guest'}`;
  }

  public async getProfile(userId: string): Promise<StudentProfile | null> {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.getKey(PROFILE_KEY_PREFIX, userId));
      if (!data) return null;
      return JSON.parse(data) as StudentProfile;
    } catch {
      return null;
    }
  }

  public async saveDraft(userId: string, draft: OnboardingDraft, step: number): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        this.getKey(DRAFT_KEY_PREFIX, userId),
        JSON.stringify({ draft, step, updatedAt: new Date().toISOString() })
      );
    } catch {
      // Storage unavailable
    }
  }

  public async getDraft(userId: string): Promise<{ draft: OnboardingDraft; step: number } | null> {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.getKey(DRAFT_KEY_PREFIX, userId));
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public async completeOnboarding(
    userId: string,
    profile: StudentProfile
  ): Promise<StudentProfile> {
    const completedProfile: StudentProfile = {
      ...profile,
      userId,
      onboardingStatus: {
        ...profile.onboardingStatus,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        nextAction: 'take_diagnostic',
      },
      knowledgeModelAttachment: {
        status: 'pending_initial_diagnostic',
        lastCalibratedAt: undefined,
      },
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          this.getKey(PROFILE_KEY_PREFIX, userId),
          JSON.stringify(completedProfile)
        );
        // Clean draft on successful completion
        localStorage.removeItem(this.getKey(DRAFT_KEY_PREFIX, userId));
      } catch {
        // Ignore
      }
    }

    return completedProfile;
  }

  public async resetOnboarding(userId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.getKey(PROFILE_KEY_PREFIX, userId));
      localStorage.removeItem(this.getKey(DRAFT_KEY_PREFIX, userId));
    } catch {
      // Ignore
    }
  }
}
