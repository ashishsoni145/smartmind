import type { SettingsAdapter } from './settings-adapter.interface';
import type {
  UserSettings,
  AcademicSettings,
  UserPreferences,
  NotificationSettings,
} from '@/lib/types/settings';

const SETTINGS_STORAGE_KEY = 'sharpmind_user_settings_v1';

export class LocalSettingsAdapter implements SettingsAdapter {
  public readonly name = 'LocalSettingsAdapter';

  private getAllSettings(): Record<string, UserSettings> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveAllSettings(map: Record<string, UserSettings>) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore
    }
  }

  private buildDefaultSettings(userId: string): UserSettings {
    return {
      id: userId,
      name: 'Ashish Soni',
      username: 'ashish_jee',
      email: 'alpmlaapmp@gmail.com',
      role: 'student',
      academicProfile: {
        board: 'cbse',
        grade: 'class_11',
        stream: 'pcm',
        targetExams: ['jee_main', 'cbse_boards'],
        targetYear: '2027',
        dailyAvailableHours: 3.5,
        preferredStudyTime: 'evening',
        schoolOrCoaching: 'Delhi Public School / Self-Study',
      },
      subscription: {
        tier: 'free',
        status: 'active',
        planName: 'SharpMind Baseline (Free)',
        features: [
          'Full Classroom Syllabus Access',
          'NCERT Digital Library with Inbuilt Reader',
          'Socratic AI Tutor (Baseline Reasoning)',
          'Interactive 3D Simulation Void',
          'Baseline Diagnostic Assessments',
        ],
      },
      preferences: {
        theme: 'dark',
        reducedMotion: false,
        fontSize: 'default',
        soundEffects: true,
      },
      notifications: {
        dailyStudyReminder: true,
        reminderTime: '18:00',
        revisionAlerts: true,
        testSeriesAnnouncements: true,
        weeklyReportEmail: true,
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: new Date().toLocaleDateString(),
        activeSessionsCount: 1,
      },
      updatedAt: new Date().toISOString(),
    };
  }

  public async getSettings(userId: string): Promise<UserSettings> {
    const map = this.getAllSettings();
    if (!map[userId]) {
      const defaults = this.buildDefaultSettings(userId);
      map[userId] = defaults;
      this.saveAllSettings(map);
      return defaults;
    }
    return map[userId];
  }

  public async updateProfile(
    userId: string,
    data: Partial<Pick<UserSettings, 'name' | 'username' | 'avatarUrl'>>
  ): Promise<UserSettings> {
    const current = await this.getSettings(userId);
    const updated: UserSettings = {
      ...current,
      name: data.name ?? current.name,
      username: data.username ?? current.username,
      avatarUrl: data.avatarUrl ?? current.avatarUrl,
      updatedAt: new Date().toISOString(),
    };
    const map = this.getAllSettings();
    map[userId] = updated;
    this.saveAllSettings(map);
    return updated;
  }

  public async updateAcademicProfile(
    userId: string,
    data: Partial<AcademicSettings>
  ): Promise<UserSettings> {
    const current = await this.getSettings(userId);
    const updated: UserSettings = {
      ...current,
      academicProfile: {
        ...current.academicProfile,
        ...data,
      },
      updatedAt: new Date().toISOString(),
    };
    const map = this.getAllSettings();
    map[userId] = updated;
    this.saveAllSettings(map);
    return updated;
  }

  public async updatePreferences(
    userId: string,
    data: Partial<UserPreferences>
  ): Promise<UserSettings> {
    const current = await this.getSettings(userId);
    const updated: UserSettings = {
      ...current,
      preferences: {
        ...current.preferences,
        ...data,
      },
      updatedAt: new Date().toISOString(),
    };
    const map = this.getAllSettings();
    map[userId] = updated;
    this.saveAllSettings(map);
    return updated;
  }

  public async updateNotifications(
    userId: string,
    data: Partial<NotificationSettings>
  ): Promise<UserSettings> {
    const current = await this.getSettings(userId);
    const updated: UserSettings = {
      ...current,
      notifications: {
        ...current.notifications,
        ...data,
      },
      updatedAt: new Date().toISOString(),
    };
    const map = this.getAllSettings();
    map[userId] = updated;
    this.saveAllSettings(map);
    return updated;
  }

  public async changePassword(
    userId: string,
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> {
    if (newPass.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }
    const current = await this.getSettings(userId);
    current.security.lastPasswordChange = new Date().toLocaleDateString();
    const map = this.getAllSettings();
    map[userId] = current;
    this.saveAllSettings(map);
    return { success: true, message: 'Password updated successfully across all active sessions.' };
  }
}
