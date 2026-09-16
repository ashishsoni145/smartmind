import React from 'react';
import Link from 'next/link';
import type { SubscriptionInfo } from '@/lib/types/settings';
import { Icon } from '@/components/ui/Icon';
import styles from './SubscriptionStatusCard.module.css';

interface SubscriptionStatusCardProps {
  subscription: SubscriptionInfo;
}

export const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  subscription,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>
            <Icon name="award" size="sm" />
            Current Academic Plan
          </h2>
          <p className={styles.subtitle}>
            Status: <strong>Active</strong> • Unlimited syllabus access
          </p>
        </div>

        <span className={styles.tierBadge}>
          <Icon name="check" size="xs" />
          {subscription.planName}
        </span>
      </div>

      <div className={styles.featuresGrid}>
        {subscription.features.map((feat, idx) => (
          <div key={idx} className={styles.featureItem}>
            <span className={styles.featureIcon}>
              <Icon name="check" size="xs" />
            </span>
            <span>{feat}</span>
          </div>
        ))}
      </div>

      <div className={styles.upgradeBanner}>
        <div className={styles.upgradeText}>
          <span className={styles.upgradeTitle}>Unlock SharpMind Pro Intelligence</span>
          <span className={styles.upgradeDesc}>
            Deep Bayesian mastery modeling, unlimited Socratic voice viva, full-length timed CBT test series, and personalized mistake coach.
          </span>
        </div>

        <Link href="/app/upgrade" className={styles.upgradeBtn}>
          <Icon name="sparkles" size="sm" />
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
};
