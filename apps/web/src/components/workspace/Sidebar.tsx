'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: IconName;
  badge?: string;
}

interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: 'learn',
    title: 'Learning Engine',
    items: [
      { id: 'dashboard', label: 'AI Next Action', href: '/app', icon: 'dashboard' },
      { id: 'classroom', label: 'Classroom', href: '/app/classroom', icon: 'classroom' },
      { id: 'library', label: 'Curriculum Library', href: '/app/library', icon: 'library' },
      { id: 'tutor', label: 'AI Tutor / Doubt', href: '/app/tutor', icon: 'tutor' },
      { id: 'focus', label: 'Focus Mode', href: '/app/focus', icon: 'focus' },
    ],
  },
  {
    id: 'academic',
    title: 'Academic Intelligence',
    items: [
      { id: 'planner', label: 'Study Planner', href: '/app/planner', icon: 'planner' },
      { id: 'tests', label: 'Tests & Diagnostics', href: '/app/tests', icon: 'tests', badge: 'Diagnostic' },
      { id: 'mistakes', label: 'Mistake Notebook', href: '/app/mistakes', icon: 'mistakes' },
      { id: 'revision', label: 'Spaced Revision', href: '/app/revision', icon: 'revision' },
      { id: 'readiness', label: 'Exam Readiness', href: '/app/readiness', icon: 'readiness' },
      { id: 'analytics', label: 'Analytics', href: '/app/analytics', icon: 'analytics' },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <div className={styles.mobileBackdrop} onClick={onCloseMobile} aria-hidden="true" />
      )}

      <aside
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${
          isMobileOpen ? styles.mobileOpen : ''
        }`}
        aria-label="Workspace Navigation"
      >
        <div className={styles.brandHeader}>
          <Link href="/app" className={styles.brandLink} onClick={onCloseMobile}>
            <div className={styles.brandEmblem} aria-hidden="true">
              S
            </div>
            {!isCollapsed && <span className={styles.brandName}>SharpMind</span>}
          </Link>

          <button
            type="button"
            className={styles.collapseToggle}
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth <= 900) {
                onCloseMobile();
              } else {
                onToggleCollapse();
              }
            }}
            aria-label={isMobileOpen ? 'Close menu' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isMobileOpen ? 'Close menu' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={isMobileOpen ? 'close' : isCollapsed ? 'chevronRight' : 'chevronLeft'} size="xs" />
          </button>
        </div>

        <nav className={styles.navContainer}>
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.id} className={styles.navGroup}>
              <div className={styles.groupLabel}>{group.title}</div>
              {group.items.map((item) => {
                const isActive =
                  item.href === '/app' ? pathname === '/app' : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={styles.navIcon} aria-hidden="true">
                      <Icon name={item.icon} size="sm" />
                    </span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && <span className={styles.badge}>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.footerSection}>
          <Link
            href="/app/upgrade"
            className={`${styles.navItem} ${pathname === '/app/upgrade' ? styles.active : ''}`}
            onClick={onCloseMobile}
            title={isCollapsed ? 'Upgrade Pro' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">
              <Icon name="upgrade" size="sm" />
            </span>
            <span className={styles.navLabel}>SharpMind Pro</span>
            <span className={styles.badge}>Upgrade</span>
          </Link>

          <Link
            href="/app/settings"
            className={`${styles.navItem} ${pathname === '/app/settings' ? styles.active : ''}`}
            onClick={onCloseMobile}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">
              <Icon name="settings" size="sm" />
            </span>
            <span className={styles.navLabel}>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
