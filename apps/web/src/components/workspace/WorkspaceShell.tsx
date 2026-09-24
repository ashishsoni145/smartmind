'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useProtectedRoute } from '@/lib/auth/use-protected-route';
import { studentProfileAdapter } from '@/lib/adapters/student';
import type { StudentProfile } from '@/lib/types/onboarding';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { NotificationsDrawer } from './NotificationsDrawer';
import styles from './WorkspaceShell.module.css';

const MOBILE_NAV: { id: string; label: string; href: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Home', href: '/app', icon: 'dashboard' },
  { id: 'classroom', label: 'Classes', href: '/app/classroom', icon: 'classroom' },
  { id: 'tutor', label: 'Tutor', href: '/app/tutor', icon: 'tutor' },
  { id: 'planner', label: 'Plan', href: '/app/planner', icon: 'planner' },
];

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  // Render the loading shell on first client paint so hydration matches SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Enforce authentication on all workspace views
  useProtectedRoute({ requireAuth: true });

  // Restore sidebar collapse preference from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sharpmind_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch student profile for academic context
  useEffect(() => {
    if (user?.id) {
      studentProfileAdapter.getProfile(user.id).then((p) => setProfile(p));
    }
  }, [user?.id]);

  // Global Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sharpmind_sidebar_collapsed', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  if (!isMounted || isLoading || !isAuthenticated || !user) {
    return (
      <div className={styles.loadingScreen} role="status" aria-live="polite">
        <div className={styles.spinner} />
        <p>Restoring SharpMind workspace...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className={styles.mainColumn}>
        <TopBar
          profile={profile}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <main id="workspace-content" className={styles.contentWrapper}>
          {children}
        </main>
      </div>

      <nav className={styles.bottomNav} aria-label="Mobile navigation">
        {MOBILE_NAV.map((item) => {
          const isActive =
            item.href === '/app' ? pathname === '/app' : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.bottomNavItem} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          className={styles.bottomNavItem}
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open full navigation menu"
        >
          <Icon name="menu" size="sm" />
          <span>More</span>
        </button>
      </nav>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
