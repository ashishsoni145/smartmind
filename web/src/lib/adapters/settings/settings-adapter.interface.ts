import type {
  UserSettings,
  AcademicSettings,
  UserPreferences,
  NotificationSettings,
} from '@/lib/types/settings';

export interface SettingsAdapter {
  name: string;
  getSettings(userId: string): Promise<UserSettings>;
  updateProfile(
    userId: string,
    data: Partial<Pick<UserSettings, 'name' | 'username' | 'avatarUrl'>>
  ): Promise<UserSettings>;
  updateAcademicProfile(
    userId: string,
    data: Partial<AcademicSettings>
  ): Promise<UserSettings>;
  updatePreferences(
    userId: string,
    data: Partial<UserPreferences>
  ): Promise<UserSettings>;
  updateNotifications(
    userId: string,
    data: Partial<NotificationSettings>
  ): Promise<UserSettings>;
  changePassword(
    userId: string,
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }>;
}
