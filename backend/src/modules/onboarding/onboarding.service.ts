import { supabase } from '../../db/client';
import { BadRequestError } from '../../lib/errors';
import { SaveDraftInput, CompleteOnboardingInput } from './onboarding.schema';
import { UserService, StudentProfileResponse } from '../users/user.service';

export interface OnboardingDraftResponse {
  userId: string;
  step: number;
  draftData: Record<string, unknown>;
  updatedAt: string;
}

export class OnboardingService {
  public static async getDraft(userId: string): Promise<OnboardingDraftResponse | null> {
    const { data, error } = await supabase
      .from('onboarding_drafts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(`Failed to fetch onboarding draft: ${error.message}`);
    }

    if (!data) return null;

    return {
      userId: data.user_id,
      step: data.step,
      draftData: data.draft_data || {},
      updatedAt: data.updated_at,
    };
  }

  public static async saveDraft(
    userId: string,
    input: SaveDraftInput
  ): Promise<OnboardingDraftResponse> {
    const payload = {
      user_id: userId,
      step: input.step,
      draft_data: input.draftData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('onboarding_drafts')
      .upsert(payload)
      .select('*')
      .single();

    if (error || !data) {
      throw new BadRequestError(`Failed to save onboarding draft: ${error?.message}`);
    }

    return {
      userId: data.user_id,
      step: data.step,
      draftData: data.draft_data,
      updatedAt: data.updated_at,
    };
  }

  public static async completeOnboarding(
    userId: string,
    input: CompleteOnboardingInput
  ): Promise<{ profile: StudentProfileResponse; nextStep: string }> {
    const now = new Date().toISOString();

    // Check if student profile exists
    const existing = await UserService.getStudentProfile(userId);

    const studentProfileData = {
      user_id: userId,
      board_id: input.boardId,
      grade_id: input.gradeId,
      academic_year: input.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      enrolled_subjects: input.enrolledSubjects,
      target_exam_goals: input.targetExamGoals,
      current_preparation_level: input.currentPreparationLevel,
      self_assessed_strengths: input.selfAssessedStrengths,
      self_assessed_focus_areas: input.selfAssessedFocusAreas,
      daily_available_hours: input.dailyAvailableHours,
      preferred_study_time: input.preferredStudyTime,
      learning_style_preference: input.learningStylePreference,
      reminder_preferences: input.reminderPreferences,
      onboarding_completed: true,
      onboarding_step: 4,
      onboarding_completed_at: now,
      next_action: 'take_diagnostic',
      knowledge_model_status: 'pending_initial_diagnostic',
      updated_at: now,
    };

    if (existing) {
      const { error } = await supabase
        .from('student_profiles')
        .update(studentProfileData)
        .eq('user_id', userId);

      if (error) {
        throw new BadRequestError(`Failed to update student profile: ${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from('student_profiles')
        .insert(studentProfileData);

      if (error) {
        throw new BadRequestError(`Failed to insert student profile: ${error.message}`);
      }
    }

    // Clean up draft data
    await supabase.from('onboarding_drafts').delete().eq('user_id', userId);

    const updatedProfile = await UserService.getStudentProfile(userId);
    if (!updatedProfile) {
      throw new BadRequestError('Failed to retrieve finalized student profile');
    }

    return {
      profile: updatedProfile,
      nextStep: '/app/diagnostic',
    };
  }
}
