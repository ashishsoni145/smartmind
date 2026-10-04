'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/auth-context';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/product', label: 'Product' },
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

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

  // Close on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Track scroll for header style
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Close on Escape
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="SharpMind home">
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
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul className={styles.navList} role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive(link.href) ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
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

          <button
            className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
            <span className={styles.hamburgerBar} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Nav */}
      <nav
        id="mobile-nav"
        className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <ul className={styles.mobileNavList} role="list">
          {isAuthenticated && user && (
            <li className={styles.mobileUserInfo}>
              <span className={styles.avatar} aria-hidden="true">
                {initials}
              </span>
              <div>
                <div className={styles.userName}>{user.fullName}</div>
                <div className={styles.roleTag}>{user.role}</div>
              </div>
            </li>
          )}
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.active : ''}`}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && user ? (
            <>
              <li className={styles.mobileNavCta}>
                <Button
                  href="/app"
                  variant="primary"
                  size="md"
                  fullWidth
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  Open Dashboard
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  variant="ghost"
                  size="md"
                  fullWidth
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  Sign Out
                </Button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.mobileNavCta}>
                <Button
                  href="/login"
                  variant="outline"
                  size="md"
                  fullWidth
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  Log In
                </Button>
              </li>
              <li>
                <Button
                  href="/signup"
                  variant="primary"
                  size="md"
                  fullWidth
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  Get Started
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
