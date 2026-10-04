export type UserRole = 'student' | 'parent' | 'educator';
export type SubscriptionTier = 'free' | 'pro' | 'institution';
export type SubscriptionStatus = 'active' | 'trial' | 'past_due';

export interface AcademicSettings {
  board: string;
  grade: string;
  stream: string;
  targetExams: string[];
  targetYear: string;
  dailyAvailableHours: number;
  preferredStudyTime: string;
  schoolOrCoaching?: string;
}

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  planName: string;
  validUntil?: string;
  features: string[];
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
  fontSize: 'default' | 'large';
  soundEffects: boolean;
}

export interface NotificationSettings {
  dailyStudyReminder: boolean;
  reminderTime: string;
  revisionAlerts: boolean;
  testSeriesAnnouncements: boolean;
  weeklyReportEmail: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessionsCount: number;
}

export interface UserSettings {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  academicProfile: AcademicSettings;
  subscription: SubscriptionInfo;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
  updatedAt: string;
}
