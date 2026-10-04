import React, { useState } from 'react';
import type { UserSettings } from '@/lib/types/settings';
import { Icon } from '@/components/ui/Icon';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  settings: UserSettings;
  onSave: (data: { name: string; username: string }) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ settings, onSave }) => {
  const [name, setName] = useState(settings.name);
  const [username, setUsername] = useState(settings.username);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), username: username.trim() });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>
          <Icon name="user" size="sm" />
          Student Identity & Account Details
        </h2>
        <p className={styles.subtitle}>
          Your public name and username are used for classroom discussions, leaderboards, and personalized AI tutor dialogues.
        </p>
      </div>

      <div className={styles.fieldsGrid}>
        {/* Full Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="settings-name" className={styles.label}>
            Full Name
          </label>
          <input
            id="settings-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSaving}
          />
          <span className={styles.helpText}>Visible on student model and progress certificates</span>
        </div>

        {/* Username */}
        <div className={styles.fieldGroup}>
          <label htmlFor="settings-username" className={styles.label}>
            Username Handle
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>@</span>
            <input
              id="settings-username"
              type="text"
              className={`${styles.input} ${styles.inputWithPrefix}`}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              required
              disabled={isSaving}
            />
          </div>
          <span className={styles.helpText}>Unique handle for peer study groups</span>
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label htmlFor="settings-email" className={styles.label}>
            Primary Email
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="settings-email"
              type="email"
              className={styles.input}
              value={settings.email}
              disabled
            />
            <span className={styles.verifiedBadge}>
              <Icon name="check" size="xs" /> Verified
            </span>
          </div>
          <span className={styles.helpText}>Managed through Supabase Auth</span>
        </div>

        {/* User Role */}
        <div className={styles.fieldGroup}>
          <label htmlFor="settings-role" className={styles.label}>
            Platform Role
          </label>
          <input
            id="settings-role"
            type="text"
            className={styles.input}
            value={settings.role === 'student' ? 'Student (JEE / NEET Aspirant)' : settings.role}
            disabled
          />
          <span className={styles.helpText}>Determines curriculum permissions and diagnostics</span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        {savedSuccess && (
          <span className={styles.successToast}>
            <Icon name="check" size="xs" /> Profile changes saved
          </span>
        )}
        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          <Icon name="check" size="xs" />
          {isSaving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
};
