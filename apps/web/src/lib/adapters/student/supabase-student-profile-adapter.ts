import type { StudentProfileAdapter } from './student-profile-adapter.interface';
import type { OnboardingDraft, StudentProfile } from '@/lib/types/onboarding';
import { getSupabaseClient } from '@/lib/supabase/client';
import { LocalStudentProfileAdapter } from './local-student-profile-adapter';

export class SupabaseStudentProfileAdapter implements StudentProfileAdapter {
  public readonly name = 'SupabaseStudentProfileAdapter';
  private localFallback = new LocalStudentProfileAdapter();

  public async getProfile(userId: string): Promise<StudentProfile | null> {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) {
      return this.localFallback.getProfile(userId);
    }

    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          id,
          user_id,
          board_id,
          grade_id,
          academic_year,
          enrolled_subjects,
          target_exam_goals,
          current_preparation_level,
          self_assessed_strengths,
          self_assessed_focus_areas,
          daily_available_hours,
          preferred_study_time,
          learning_style_preference,
          reminder_preferences,
          onboarding_completed,
          onboarding_step,
          onboarding_completed_at,
          next_action,
          knowledge_model_status,
          last_calibrated_at,
          created_at,
          updated_at,
          profiles (
            full_name
          )
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return this.localFallback.getProfile(userId);
      }

      const profileRow = data as Record<string, unknown>;
      const userProfile = (profileRow.profiles as { full_name?: string } | null) || {};

      return {
        id: (profileRow.id as string) || '',
        userId: (profileRow.user_id as string) || userId,
        fullName: userProfile.full_name || 'Learner',
        academicProfile: {
          grade: (profileRow.grade_id as string) || '',
          board: (profileRow.board_id as string) || '',
          academicYear: (profileRow.academic_year as string) || '',
          enrolledSubjects: (profileRow.enrolled_subjects as string[]) || [],
        },
        targetExams: (profileRow.target_exam_goals as StudentProfile['targetExams']) || [],
        readinessBaseline: {
          currentPreparationLevel: (profileRow.current_preparation_level as StudentProfile['readinessBaseline']['currentPreparationLevel']) || 'beginner',
          selfAssessedStrengths: (profileRow.self_assessed_strengths as string[]) || [],
          selfAssessedFocusAreas: (profileRow.self_assessed_focus_areas as string[]) || [],
        },
        studyPreferences: {
          dailyAvailableHours: Number(profileRow.daily_available_hours) || 3,
          preferredStudyTime: (profileRow.preferred_study_time as StudentProfile['studyPreferences']['preferredStudyTime']) || 'evening',
          learningStylePreference: (profileRow.learning_style_preference as StudentProfile['studyPreferences']['learningStylePreference']) || 'problem_solving_first',
          reminderPreferences: (profileRow.reminder_preferences as StudentProfile['studyPreferences']['reminderPreferences']) || {
            email: true,
            dailyGoalPrompt: true,
          },
        },
        onboardingStatus: {
          currentStep: Number(profileRow.onboarding_step) || 1,
          isCompleted: Boolean(profileRow.onboarding_completed),
          completedAt: (profileRow.onboarding_completed_at as string) || undefined,
          nextAction: (profileRow.next_action as StudentProfile['onboardingStatus']['nextAction']) || 'take_diagnostic',
        },
        knowledgeModelAttachment: {
          status: (profileRow.knowledge_model_status as StudentProfile['knowledgeModelAttachment']['status']) || 'pending_initial_diagnostic',
          lastCalibratedAt: (profileRow.last_calibrated_at as string) || undefined,
        },
        createdAt: (profileRow.created_at as string) || new Date().toISOString(),
        updatedAt: (profileRow.updated_at as string) || new Date().toISOString(),
      };
    } catch {
      return this.localFallback.getProfile(userId);
    }
  }

  public async saveDraft(userId: string, draft: OnboardingDraft, step: number): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) {
      return this.localFallback.saveDraft(userId, draft, step);
    }

    try {
      await supabase.from('onboarding_drafts').upsert({
        user_id: userId,
        draft_data: draft,
        step,
        updated_at: new Date().toISOString(),
      });
      // Also cache locally for seamless instant re-entry
      await this.localFallback.saveDraft(userId, draft, step);
    } catch {
      await this.localFallback.saveDraft(userId, draft, step);
    }
  }

  public async getDraft(userId: string): Promise<{ draft: OnboardingDraft; step: number } | null> {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) {
      return this.localFallback.getDraft(userId);
    }

    try {
      const { data, error } = await supabase
        .from('onboarding_drafts')
        .select('draft_data, step')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return this.localFallback.getDraft(userId);
      }

      return {
        draft: (data.draft_data as OnboardingDraft) || {},
        step: Number(data.step) || 1,
      };
    } catch {
      return this.localFallback.getDraft(userId);
    }
  }

  public async completeOnboarding(userId: string, profile: StudentProfile): Promise<StudentProfile> {
    const supabase = getSupabaseClient();
    const completedAt = new Date().toISOString();

    const completedProfile: StudentProfile = {
      ...profile,
      userId,
      onboardingStatus: {
        ...profile.onboardingStatus,
        isCompleted: true,
        completedAt,
        nextAction: 'take_diagnostic',
      },
      knowledgeModelAttachment: {
        status: 'pending_initial_diagnostic',
        lastCalibratedAt: undefined,
      },
      updatedAt: completedAt,
    };

    if (!supabase || !userId) {
      return this.localFallback.completeOnboarding(userId, completedProfile);
    }

    try {
      await supabase.from('student_profiles').upsert(
        {
          user_id: userId,
          board_id: profile.academicProfile.board || null,
          grade_id: profile.academicProfile.grade || null,
          academic_year: profile.academicProfile.academicYear || null,
          enrolled_subjects: profile.academicProfile.enrolledSubjects || [],
          target_exam_goals: profile.targetExams || [],
          current_preparation_level: profile.readinessBaseline.currentPreparationLevel,
          self_assessed_strengths: profile.readinessBaseline.selfAssessedStrengths || [],
          self_assessed_focus_areas: profile.readinessBaseline.selfAssessedFocusAreas || [],
          daily_available_hours: profile.studyPreferences.dailyAvailableHours,
          preferred_study_time: profile.studyPreferences.preferredStudyTime,
          learning_style_preference: profile.studyPreferences.learningStylePreference,
          reminder_preferences: profile.studyPreferences.reminderPreferences,
          onboarding_completed: true,
          onboarding_step: 5,
          onboarding_completed_at: completedAt,
          next_action: 'take_diagnostic',
          knowledge_model_status: 'pending_initial_diagnostic',
          updated_at: completedAt,
        },
        { onConflict: 'user_id' }
      );

      // Clean up onboarding draft
      await supabase.from('onboarding_drafts').delete().eq('user_id', userId);
      await this.localFallback.completeOnboarding(userId, completedProfile);
      return completedProfile;
    } catch {
      return this.localFallback.completeOnboarding(userId, completedProfile);
    }
  }

  public async resetOnboarding(userId: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && userId) {
      try {
        await supabase.from('student_profiles').delete().eq('user_id', userId);
        await supabase.from('onboarding_drafts').delete().eq('user_id', userId);
      } catch {
        // Fall through
      }
    }
    await this.localFallback.resetOnboarding(userId);
  }
}
