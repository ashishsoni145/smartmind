'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Button } from '@/components/ui/Button';
import { subscribeNewsletter } from '@/lib/adapters/form-adapter';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/product' },
      { label: 'Features', href: '/features' },
      { label: 'AI Academic OS', href: '/ai-academic-os' },
      { label: 'Learning Flow', href: '/learning-flow' },
      { label: 'Download', href: '/download' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const result = await subscribeNewsletter(email);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="SharpMind home">
              <svg
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
            <p className={styles.tagline}>
              The AI Academic OS that knows what you know, what you&apos;ve
              forgotten, and what you need next.
            </p>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <ul className={styles.linkList} role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Stay Updated</h3>
            <p className={styles.newsletterDesc}>
              Get product updates and learning tips.
            </p>
            <form
              className={styles.newsletterForm}
              onSubmit={handleNewsletter}
              aria-label="Newsletter signup"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.newsletterInput}
                disabled={status === 'loading'}
                aria-describedby={
                  status === 'success' || status === 'error'
                    ? 'newsletter-status'
                    : undefined
                }
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={status === 'loading'}
              >
                Subscribe
              </Button>
            </form>
            {(status === 'success' || status === 'error') && (
              <p
                id="newsletter-status"
                className={
                  status === 'success' ? styles.successMsg : styles.errorMsg
                }
                role="status"
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} SharpMind. All rights reserved.
          </p>
          <p className={styles.accessibility}>
            Committed to accessibility and inclusive education.
          </p>
        </div>
      </div>
    </footer>
  );
}
