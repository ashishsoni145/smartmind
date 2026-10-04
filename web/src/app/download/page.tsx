import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Download & Platforms',
  description:
    'Access SharpMind on web, Android, iOS, Windows, and macOS. One account, one Student Model, every device.',
};

const platforms = [
  { name: 'Web App', icon: '🌐', status: 'available' as const, description: 'Access SharpMind from any browser — no download required.', action: 'Open Web App', href: '/app' },
  { name: 'Android', icon: '📱', status: 'coming' as const, description: 'Native Android app optimised for phones and tablets.', action: 'Coming Soon', href: '#' },
  { name: 'iOS', icon: '🍎', status: 'coming' as const, description: 'Native iPhone and iPad app with full feature parity.', action: 'Coming Soon', href: '#' },
  { name: 'Windows', icon: '💻', status: 'coming' as const, description: 'Desktop app for focused study sessions on Windows 10+.', action: 'Coming Soon', href: '#' },
  { name: 'macOS', icon: '🖥️', status: 'coming' as const, description: 'Native macOS app with system integration.', action: 'Coming Soon', href: '#' },
];

export default function DownloadPage() {
  return (
    <>
      <section className={`${styles.hero} section`} aria-labelledby="download-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="One Brain. Every Device."
            subtitle="Your Student Model syncs seamlessly across all platforms. Start studying on your phone, continue on your laptop, review on your tablet — zero context lost."
            badge="Platforms"
            as="h1"
          />
        </div>
      </section>

      <section className="section" aria-label="Available platforms">
        <div className="container">
          <div className={styles.grid}>
            {platforms.map((platform) => (
              <Card key={platform.name} variant="feature" hover={platform.status === 'available'}>
                <div className={styles.platformHeader}>
                  <span className={styles.platformIcon}>{platform.icon}</span>
                  <Badge variant={platform.status === 'available' ? 'success' : 'coming'}>
                    {platform.status === 'available' ? 'Available Now' : 'Coming Soon'}
                  </Badge>
                </div>
                <CardTitle>{platform.name}</CardTitle>
                <CardDescription>{platform.description}</CardDescription>
                <div className={styles.platformAction}>
                  {platform.status === 'available' ? (
                    <Button href={platform.href} variant="primary" size="sm">
                      {platform.action}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      {platform.action}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.syncSection} section`} aria-labelledby="sync-heading">
        <div className="container">
          <SectionHeading
            title="Seamless Cross-Platform Sync"
            subtitle="Your academic state is canonical — one source of truth that lives in the cloud and syncs instantly to every device."
          />
          <div className={styles.syncFeatures}>
            <div className={styles.syncItem}>
              <h3>⚡ Instant Sync</h3>
              <p>Changes propagate across devices in real-time.</p>
            </div>
            <div className={styles.syncItem}>
              <h3>🔒 Encrypted</h3>
              <p>All data encrypted in transit and at rest.</p>
            </div>
            <div className={styles.syncItem}>
              <h3>📶 Offline Support</h3>
              <p>Study offline — changes sync when you reconnect.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
