import type { SettingsAdapter } from './settings-adapter.interface';
import type {
  UserSettings,
  AcademicSettings,
  UserPreferences,
  NotificationSettings,
} from '@/lib/types/settings';
import { LocalSettingsAdapter } from './local-settings-adapter';
import { getSupabaseClient } from '@/lib/supabase/client';

export class SupabaseSettingsAdapter implements SettingsAdapter {
  public readonly name = 'SupabaseSettingsAdapter';
  private localFallback = new LocalSettingsAdapter();

  public async getSettings(userId: string): Promise<UserSettings> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.localFallback.getSettings(userId);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: studentProf } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const base = await this.localFallback.getSettings(userId);

      if (profile) {
        base.name = profile.full_name || base.name;
        base.email = profile.email || base.email;
        base.role = profile.role || base.role;
      }

      if (studentProf) {
        if (studentProf.target_exams) base.academicProfile.targetExams = studentProf.target_exams;
        if (studentProf.daily_available_hours)
          base.academicProfile.dailyAvailableHours = Number(studentProf.daily_available_hours);
        if (studentProf.preferred_study_time)
          base.academicProfile.preferredStudyTime = studentProf.preferred_study_time;
      }

      return base;
    } catch {
      return this.localFallback.getSettings(userId);
    }
  }

  public async updateProfile(
    userId: string,
    data: Partial<Pick<UserSettings, 'name' | 'username' | 'avatarUrl'>>
  ): Promise<UserSettings> {
    const supabase = getSupabaseClient();
    if (supabase && data.name) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.name, updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) {
        throw new Error(`Failed to save profile changes: ${error.message}`);
      }
    }
    return this.getSettings(userId);
  }

  public async updateAcademicProfile(
    userId: string,
    data: Partial<AcademicSettings>
  ): Promise<UserSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (data.targetExams) updatePayload.target_exams = data.targetExams;
      if (data.dailyAvailableHours) updatePayload.daily_available_hours = data.dailyAvailableHours;
      if (data.preferredStudyTime) updatePayload.preferred_study_time = data.preferredStudyTime;

      const { error } = await supabase
        .from('student_profiles')
        .update(updatePayload)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to save academic profile: ${error.message}`);
      }
    }
    return this.getSettings(userId);
  }

  public async updatePreferences(
    userId: string,
    data: Partial<UserPreferences>
  ): Promise<UserSettings> {
    return this.localFallback.updatePreferences(userId, data);
  }

  public async updateNotifications(
    userId: string,
    data: Partial<NotificationSettings>
  ): Promise<UserSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          email_enabled: data.emailNotifications,
          in_app_enabled: data.inAppNotifications,
          revision_reminders: data.studyReminders,
          updated_at: new Date().toISOString(),
        })
        .eq('student_id', userId);

      if (error) {
        throw new Error(`Failed to save notification preferences: ${error.message}`);
      }
    }
    return this.localFallback.updateNotifications(userId, data);
  }

  public async changePassword(
    userId: string,
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPass,
        });
        if (error) {
          return { success: false, message: error.message };
        }
        await this.localFallback.changePassword(userId, oldPass, newPass);
        return { success: true, message: 'Password successfully updated in Supabase security vault.' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to update password.' };
      }
    }
    return this.localFallback.changePassword(userId, oldPass, newPass);
  }
}
