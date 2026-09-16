import React, { useState } from 'react';
import type { UserPreferences, NotificationSettings } from '@/lib/types/settings';
import { useTheme } from '@/lib/theme/theme-context';
import { Icon } from '@/components/ui/Icon';
import styles from './PreferencesForm.module.css';

interface PreferencesFormProps {
  preferences: UserPreferences;
  notifications: NotificationSettings;
  onSavePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  onSaveNotifications: (notifs: Partial<NotificationSettings>) => Promise<void>;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  preferences,
  notifications,
  onSavePreferences,
  onSaveNotifications,
}) => {
  const { theme, setTheme } = useTheme();

  // Notification states
  const [dailyReminder, setDailyReminder] = useState(notifications.dailyStudyReminder);
  const [reminderTime, setReminderTime] = useState(notifications.reminderTime || '18:00');
  const [revisionAlerts, setRevisionAlerts] = useState(notifications.revisionAlerts);
  const [announcements, setAnnouncements] = useState(notifications.testSeriesAnnouncements);
  const [weeklyEmail, setWeeklyEmail] = useState(notifications.weeklyReportEmail);

  // Experience states
  const [soundEffects, setSoundEffects] = useState(preferences.soundEffects);
  const [reducedMotion, setReducedMotion] = useState(preferences.reducedMotion);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleThemeChange = async (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    try {
      await onSavePreferences({ theme: newTheme });
    } catch (err) {
      console.error('Failed to persist theme preference:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        onSavePreferences({
          soundEffects,
          reducedMotion,
        }),
        onSaveNotifications({
          dailyStudyReminder: dailyReminder,
          reminderTime,
          revisionAlerts,
          testSeriesAnnouncements: announcements,
          weeklyReportEmail: weeklyEmail,
        }),
      ]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSave}>
      {/* Theme Selection */}
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>
          <Icon name="sparkles" size="sm" />
          Appearance & Workspace Theme
        </h2>
        <p className={styles.subtitle}>
          Customize contrast and workspace styling. Instant transition across all views.
        </p>
      </div>

      <div className={styles.themeSelectorRow}>
        <button
          type="button"
          onClick={() => handleThemeChange('dark')}
          className={`${styles.themeBtn} ${theme === 'dark' ? styles.activeThemeBtn : ''}`}
          aria-pressed={theme === 'dark'}
        >
          <Icon name="moon" size="lg" />
          <span className={styles.themeLabel}>Dark Mode (Default)</span>
        </button>

        <button
          type="button"
          onClick={() => handleThemeChange('light')}
          className={`${styles.themeBtn} ${theme === 'light' ? styles.activeThemeBtn : ''}`}
          aria-pressed={theme === 'light'}
        >
          <Icon name="sun" size="lg" />
          <span className={styles.themeLabel}>Light Mode</span>
        </button>

        <button
          type="button"
          onClick={() => handleThemeChange('system')}
          className={`${styles.themeBtn} ${theme === 'system' ? styles.activeThemeBtn : ''}`}
          aria-pressed={theme === 'system'}
        >
          <Icon name="laptop" size="lg" />
          <span className={styles.themeLabel}>System Preference</span>
        </button>
      </div>

      {/* Notifications */}
      <div className={styles.cardHeader} style={{ marginTop: '1rem' }}>
        <h2 className={styles.title}>
          <Icon name="bell" size="sm" />
          Study Reminders & Academic Alerts
        </h2>
        <p className={styles.subtitle}>
          Configure your daily study nudges, spaced repetition alerts, and weekly progress digests.
        </p>
      </div>

      <div className={styles.togglesList}>
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Daily Target Study Reminder</span>
            <span className={styles.toggleDesc}>
              Receive an intelligent nudge when it is time for your scheduled revision session.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {dailyReminder && (
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className={styles.timeInput}
                aria-label="Daily reminder time"
              />
            )}
            <input
              type="checkbox"
              id="dailyReminder"
              checked={dailyReminder}
              onChange={(e) => setDailyReminder(e.target.checked)}
              className={styles.checkbox}
            />
          </div>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Spaced Repetition Decay Warnings</span>
            <span className={styles.toggleDesc}>
              Alerts when learned topics are approaching retention threshold and need revision.
            </span>
          </div>
          <input
            type="checkbox"
            id="revisionAlerts"
            checked={revisionAlerts}
            onChange={(e) => setRevisionAlerts(e.target.checked)}
            className={styles.checkbox}
          />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Test Series & Mock Exam Announcements</span>
            <span className={styles.toggleDesc}>
              Get informed when new chapter-wise tests and all-India mocks go live.
            </span>
          </div>
          <input
            type="checkbox"
            id="announcements"
            checked={announcements}
            onChange={(e) => setAnnouncements(e.target.checked)}
            className={styles.checkbox}
          />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Weekly Academic Performance Report</span>
            <span className={styles.toggleDesc}>
              A comprehensive Sunday briefing of hours studied, mastery gained, and weak areas.
            </span>
          </div>
          <input
            type="checkbox"
            id="weeklyEmail"
            checked={weeklyEmail}
            onChange={(e) => setWeeklyEmail(e.target.checked)}
            className={styles.checkbox}
          />
        </div>
      </div>

      {/* Accessibility & Workspace Feel */}
      <div className={styles.cardHeader} style={{ marginTop: '1rem' }}>
        <h2 className={styles.title}>
          <Icon name="layers" size="sm" />
          Accessibility & Interaction
        </h2>
        <p className={styles.subtitle}>
          Fine-tune sound and animations for optimal focus.
        </p>
      </div>

      <div className={styles.togglesList}>
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Reduced Visual Motion</span>
            <span className={styles.toggleDesc}>
              Minimize transitions and background motion in focus mode and 3D scenes.
            </span>
          </div>
          <input
            type="checkbox"
            id="reducedMotion"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            className={styles.checkbox}
          />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleTitle}>Audio Feedback on Task Completion</span>
            <span className={styles.toggleDesc}>
              Play subtle chimes when finishing Pomodoro intervals or question sets.
            </span>
          </div>
          <input
            type="checkbox"
            id="soundEffects"
            checked={soundEffects}
            onChange={(e) => setSoundEffects(e.target.checked)}
            className={styles.checkbox}
          />
        </div>
      </div>

      <div className={styles.actionsRow}>
        {savedSuccess && (
          <span className={styles.successToast}>
            <Icon name="check" size="xs" />
            Preferences and notifications saved successfully
          </span>
        )}
        <button type="submit" disabled={isSaving} className={styles.saveBtn}>
          <Icon name="check" size="sm" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
};
