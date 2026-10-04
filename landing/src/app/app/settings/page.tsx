'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { useAuth } from '@/lib/auth/auth-context';
import { settingsAdapter } from '@/lib/adapters/settings';
import type { UserSettings } from '@/lib/types/settings';
import { SettingsNav, type SettingsTab } from '@/components/settings/SettingsNav';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { AcademicSettingsForm } from '@/components/settings/AcademicSettingsForm';
import { SecuritySettingsForm } from '@/components/settings/SecuritySettingsForm';
import { SubscriptionStatusCard } from '@/components/settings/SubscriptionStatusCard';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { Icon } from '@/components/ui/Icon';
import styles from './settings.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, adapterName } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const data = await settingsAdapter.getSettings(userId);
      // Merge in active auth user info if available
      if (user) {
        data.name = user.fullName || data.name;
        data.email = user.email || data.email;
      }
      setSettings(data);
    } catch (err) {
      console.error('Failed to load user settings:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadSettings(user.id);
    }
  }, [user?.id, loadSettings]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const userId = user?.id || '';

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Workspace & Account Settings</h1>
          <p className={styles.subtitle}>
            Manage your academic identity, appearance, study habits, security, and subscription tier.
          </p>
        </header>

        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

        <main className={styles.contentArea}>
          {loading || !settings ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <span>Loading your preferences and academic profile...</span>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && (
                <ProfileForm
                  settings={settings}
                  onSave={async (data) => {
                    const updated = await settingsAdapter.updateProfile(userId, data);
                    setSettings(updated);
                  }}
                />
              )}

              {activeTab === 'academic' && (
                <AcademicSettingsForm
                  initialData={settings.academicProfile}
                  onSave={async (data) => {
                    const updated = await settingsAdapter.updateAcademicProfile(userId, data);
                    setSettings(updated);
                  }}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettingsForm
                  lastPasswordChange={settings.security.lastPasswordChange}
                  onChangePassword={async (oldPass, newPass) => {
                    return await settingsAdapter.changePassword(userId, oldPass, newPass);
                  }}
                />
              )}

              {activeTab === 'subscription' && (
                <SubscriptionStatusCard subscription={settings.subscription} />
              )}

              {activeTab === 'preferences' && (
                <PreferencesForm
                  preferences={settings.preferences}
                  notifications={settings.notifications}
                  onSavePreferences={async (data) => {
                    const updated = await settingsAdapter.updatePreferences(userId, data);
                    setSettings(updated);
                  }}
                  onSaveNotifications={async (data) => {
                    const updated = await settingsAdapter.updateNotifications(userId, data);
                    setSettings(updated);
                  }}
                />
              )}
            </>
          )}
        </main>

        <footer className={styles.footerActions}>
          <div className={styles.sessionMeta}>
            <span className={styles.sessionTitle}>Active Auth Session & Persistence</span>
            <span className={styles.sessionDesc}>
              Connected via {adapterName} • Logged in as {user?.email || 'Guest Student'}
            </span>
          </div>
          <button type="button" onClick={handleSignOut} className={styles.signOutBtn}>
            <Icon name="logout" size="sm" />
            Sign Out
          </button>
        </footer>
      </div>
    </WorkspaceShell>
  );
}
