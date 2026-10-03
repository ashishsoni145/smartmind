'use client';

import styles from './Footer.module.css';

const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL || 'https://sharpmind.live';

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} SharpMind. All rights reserved.
          </p>
          <p className={styles.accessibility}>
            <a href={LANDING_URL} className={styles.link}>
              Back to SharpMind Home
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
