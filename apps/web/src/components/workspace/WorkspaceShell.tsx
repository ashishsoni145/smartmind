'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useProtectedRoute } from '@/lib/auth/use-protected-route';
import { studentProfileAdapter } from '@/lib/adapters/student';
import type { StudentProfile } from '@/lib/types/onboarding';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { NotificationsDrawer } from './NotificationsDrawer';
import styles from './WorkspaceShell.module.css';

interface WorkspaceShellProps {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  if (isLoading || !isAuthenticated || !user) {
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

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
