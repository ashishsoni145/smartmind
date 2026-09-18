import { supabase } from '../../db/client';
import { NotFoundError, BadRequestError } from '../../lib/errors';
import { UpdateProfileInput, UpdateStudentProfileInput } from './user.schema';

export interface UserProfileResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  studentProfile?: StudentProfileResponse | null;
}

export interface StudentProfileResponse {
  id: string;
  userId: string;
  boardId: string | null;
  gradeId: string | null;
  academicYear: string | null;
  enrolledSubjects: string[];
  targetExamGoals: Array<{ examId: string; targetYear: number; targetScoreOrRank?: string }>;
  currentPreparationLevel: string;
  selfAssessedStrengths: string[];
  selfAssessedFocusAreas: string[];
  dailyAvailableHours: number;
  preferredStudyTime: string;
  learningStylePreference: string;
  reminderPreferences: Record<string, boolean>;
  onboardingCompleted: boolean;
  onboardingStep: number;
  onboardingCompletedAt: string | null;
  nextAction: string;
  knowledgeModelStatus: string;
  lastCalibratedAt: string | null;
}

export class UserService {
  public static async getProfile(userId: string): Promise<UserProfileResponse> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(`Failed to fetch profile: ${error.message}`);
    }
    if (!profile) {
      throw new NotFoundError('User profile not found');
    }

    let studentProfile: StudentProfileResponse | null = null;
    if (profile.role === 'student') {
      studentProfile = await this.getStudentProfile(userId).catch(() => null);
    }

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      avatarUrl: profile.avatar_url,
      isEmailVerified: profile.is_email_verified,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      studentProfile,
    };
  }

  public static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<UserProfileResponse> {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.fullName !== undefined) updatePayload.full_name = data.fullName;
    if (data.avatarUrl !== undefined) updatePayload.avatar_url = data.avatarUrl;

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .single();

    if (error || !updated) {
      throw new BadRequestError(`Failed to update profile: ${error?.message}`);
    }

    return this.getProfile(userId);
  }

  public static async getStudentProfile(userId: string): Promise<StudentProfileResponse | null> {
    const { data: sp, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(`Failed to fetch student profile: ${error.message}`);
    }
    if (!sp) {
      return null;
    }

    return {
      id: sp.id,
      userId: sp.user_id,
      boardId: sp.board_id,
      gradeId: sp.grade_id,
      academicYear: sp.academic_year,
      enrolledSubjects: sp.enrolled_subjects || [],
      targetExamGoals: sp.target_exam_goals || [],
      currentPreparationLevel: sp.current_preparation_level,
      selfAssessedStrengths: sp.self_assessed_strengths || [],
      selfAssessedFocusAreas: sp.self_assessed_focus_areas || [],
      dailyAvailableHours: Number(sp.daily_available_hours) || 3.0,
      preferredStudyTime: sp.preferred_study_time,
      learningStylePreference: sp.learning_style_preference,
      reminderPreferences: sp.reminder_preferences || {},
      onboardingCompleted: sp.onboarding_completed,
      onboardingStep: sp.onboarding_step,
      onboardingCompletedAt: sp.onboarding_completed_at,
      nextAction: sp.next_action,
      knowledgeModelStatus: sp.knowledge_model_status,
      lastCalibratedAt: sp.last_calibrated_at,
    };
  }

  public static async updateStudentProfile(
    userId: string,
    data: UpdateStudentProfileInput
  ): Promise<StudentProfileResponse> {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.boardId !== undefined) payload.board_id = data.boardId;
    if (data.gradeId !== undefined) payload.grade_id = data.gradeId;
    if (data.academicYear !== undefined) payload.academic_year = data.academicYear;
    if (data.enrolledSubjects !== undefined) payload.enrolled_subjects = data.enrolledSubjects;
    if (data.targetExamGoals !== undefined) payload.target_exam_goals = data.targetExamGoals;
    if (data.currentPreparationLevel !== undefined)
      payload.current_preparation_level = data.currentPreparationLevel;
    if (data.selfAssessedStrengths !== undefined)
      payload.self_assessed_strengths = data.selfAssessedStrengths;
    if (data.selfAssessedFocusAreas !== undefined)
      payload.self_assessed_focus_areas = data.selfAssessedFocusAreas;
    if (data.dailyAvailableHours !== undefined)
      payload.daily_available_hours = data.dailyAvailableHours;
    if (data.preferredStudyTime !== undefined) payload.preferred_study_time = data.preferredStudyTime;
    if (data.learningStylePreference !== undefined)
      payload.learning_style_preference = data.learningStylePreference;
    if (data.reminderPreferences !== undefined)
      payload.reminder_preferences = data.reminderPreferences;
    if (data.nextAction !== undefined) payload.next_action = data.nextAction;

    // Check if student_profile row exists
    const existing = await this.getStudentProfile(userId);
    if (!existing) {
      // Insert
      const { data: inserted, error } = await supabase
        .from('student_profiles')
        .insert({
          user_id: userId,
          ...payload,
        })
        .select('*')
        .single();

      if (error || !inserted) {
        throw new BadRequestError(`Failed to create student profile: ${error?.message}`);
      }
    } else {
      // Update
      const { error } = await supabase
        .from('student_profiles')
        .update(payload)
        .eq('user_id', userId);

      if (error) {
        throw new BadRequestError(`Failed to update student profile: ${error.message}`);
      }
    }

    const updated = await this.getStudentProfile(userId);
    if (!updated) {
      throw new BadRequestError('Failed to retrieve updated student profile');
    }
    return updated;
  }
}
