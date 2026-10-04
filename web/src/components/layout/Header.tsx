'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { Button } from '@sharpmind/shared';
import { useAuth } from '@/lib/auth/auth-context';

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'https://sharpmind.live';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'U';

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    },
    [isMenuOpen],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.container}>
        <a href={LANDING_URL} className={styles.logo} aria-label="SharpMind home">
          <svg
            className={styles.logoIcon}
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="8" fill="#ffffff" />
            <path
              d="M8 14l4 4 8-8"
              stroke="#0a0a0a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.logoText}>SharpMind</span>
        </a>

        <div className={styles.actions}>
          {isAuthenticated && user ? (
            <div className={styles.userMenu}>
              <div className={styles.userBadge}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials}
                </span>
                <span className={styles.userName}>{user.fullName}</span>
                <span className={styles.roleTag}>{user.role}</span>
              </div>
              <Button href="/app" variant="outline" size="sm">
                Dashboard
              </Button>
              <Button onClick={() => signOut()} variant="ghost" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log In
              </Button>
              <Button href="/signup" variant="primary" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
