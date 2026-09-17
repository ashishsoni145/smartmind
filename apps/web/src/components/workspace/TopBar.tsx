'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import type { StudentProfile } from '@/lib/types/onboarding';
import { Icon } from '@/components/ui/Icon';
import styles from './TopBar.module.css';

interface TopBarProps {
  profile: StudentProfile | null;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onToggleMobileMenu: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/app': 'AI Next Action',
  '/app/classroom': 'Classroom Stream',
  '/app/library': 'Curriculum Library',
  '/app/tutor': 'AI Academic Tutor',
  '/app/focus': 'Focus Mode',
  '/app/planner': 'Study Planner',
  '/app/tests': 'Tests & Diagnostics',
  '/app/mistakes': 'Mistake Notebook',
  '/app/revision': 'Spaced Revision',
  '/app/readiness': 'Exam Readiness',
  '/app/analytics': 'Analytics & Velocity',
  '/app/upgrade': 'SharpMind Pro',
  '/app/settings': 'Settings & Controls',
};

export function TopBar({
  profile,
  onOpenSearch,
  onOpenNotifications,
  onToggleMobileMenu,
  isCollapsed,
  onToggleCollapse,
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentTitle = ROUTE_TITLES[pathname] || 'Workspace';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'U';

  const academicTag = profile
    ? `${profile.academicProfile.board.toUpperCase()} ${profile.academicProfile.grade.replace('class_', '')}th`
    : 'Identity Pending';

  return (
    <header className={styles.topBar}>
      <div className={styles.leftArea}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth <= 900) {
              onToggleMobileMenu();
            } else if (onToggleCollapse) {
              onToggleCollapse();
            }
          }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name="menu" size="sm" />
        </button>

        <nav aria-label="Breadcrumbs" className={styles.breadcrumbs}>
          <Link href="/app" className={styles.crumbRoot}>
            Workspace
          </Link>
          <span className={styles.crumbSeparator}>/</span>
          <span className={styles.crumbActive}>{currentTitle}</span>
        </nav>
      </div>

      <div className={styles.centerArea}>
        <button
          type="button"
          className={styles.searchBtn}
          onClick={onOpenSearch}
          aria-label="Quick search or jump to module"
        >
          <Icon name="search" size="sm" />
          <span>Search or jump to...</span>
          <kbd className={styles.searchKbd}>⌘K</kbd>
        </button>
      </div>

      <div className={styles.rightArea}>
        <Link href="/onboarding" className={styles.academicPill} title="Update Academic Identity">
          <span className={styles.pulseDot} aria-hidden="true" />
          <span>{academicTag}</span>
        </Link>

        <button
          type="button"
          className={styles.iconBtn}
          onClick={onOpenNotifications}
          aria-label="View notifications"
          title="Notifications"
        >
          <Icon name="bell" size="sm" />
          <span className={styles.unreadDot} aria-hidden="true" />
        </button>

        <div className={styles.userMenuWrapper} ref={menuRef}>
          <button
            type="button"
            className={styles.userMenuBtn}
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className={styles.avatar} aria-hidden="true">
              {initials}
            </div>
            <span className={styles.userName}>{user?.fullName?.split(' ')[0] || 'Learner'}</span>
            <Icon name="chevronDown" size="xs" style={{ color: 'var(--color-text-tertiary)' }} />
          </button>

          {isUserMenuOpen && (
            <div className={styles.menuDropdown} role="menu">
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownName}>{user?.fullName}</div>
                <div className={styles.dropdownEmail}>{user?.email}</div>
                <span className={styles.dropdownRole}>{user?.role}</span>
              </div>

              <Link
                href="/onboarding"
                className={styles.dropdownItem}
                onClick={() => setIsUserMenuOpen(false)}
                role="menuitem"
              >
                <Icon name="classroom" size="sm" />
                <span>Academic Profile</span>
              </Link>
              <Link
                href="/app/settings"
                className={styles.dropdownItem}
                onClick={() => setIsUserMenuOpen(false)}
                role="menuitem"
              >
                <Icon name="settings" size="sm" />
                <span>Settings & Routine</span>
              </Link>
              <Link
                href="/"
                className={styles.dropdownItem}
                onClick={() => setIsUserMenuOpen(false)}
                role="menuitem"
              >
                <Icon name="externalLink" size="sm" />
                <span>Public Homepage</span>
              </Link>
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.danger}`}
                onClick={handleSignOut}
                role="menuitem"
              >
                <Icon name="logout" size="sm" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
