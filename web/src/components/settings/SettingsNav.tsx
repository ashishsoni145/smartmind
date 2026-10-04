import React from 'react';
import { Icon, IconName } from '@/components/ui/Icon';
import styles from './SettingsNav.module.css';

export type SettingsTab = 'profile' | 'academic' | 'security' | 'subscription' | 'preferences';

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: IconName;
}

const SETTINGS_TABS: TabItem[] = [
  { id: 'profile', label: 'Profile & Account', icon: 'user' },
  { id: 'academic', label: 'Academic Target', icon: 'target' },
  { id: 'security', label: 'Security & Access', icon: 'lock' },
  { id: 'subscription', label: 'Subscription & Tier', icon: 'award' },
  { id: 'preferences', label: 'Appearance & Notifications', icon: 'sparkles' },
];

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsNav: React.FC<SettingsNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className={styles.navContainer} role="tablist" aria-label="Settings section navigation">
      {SETTINGS_TABS.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.tabBtn} ${isActive ? styles.activeTab : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            <Icon name={t.icon} size="xs" />
            <span>{t.label}</span>
            {isActive && <span className={styles.activeIndicator} />}
          </button>
        );
      })}
    </nav>
  );
};
