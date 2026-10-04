import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Get Started',
  description: 'Create your SharpMind account and start your adaptive learning journey.',
};

export default function GetStartedPage() {
  return (
    <section className={`${styles.page} section`} aria-labelledby="get-started-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.container}`}>
        <SectionHeading
          title="Choose Your Learning Path"
          subtitle="Select your account type to access the AI Academic OS customized for your academic goals."
          badge="Get Started"
          as="h1"
        />

        <div className={styles.cardsGrid}>
          <Link href="/signup" className={styles.roleCard}>
            <div className={styles.iconWrapper} aria-hidden="true">
              🎓
            </div>
            <h2 className={styles.cardTitle}>Student</h2>
            <p className={styles.cardDescription}>
              Build your personal knowledge graph, adaptive study plans, and master CBSE, JEE, or NEET exams.
            </p>
            <span className={styles.cardAction}>Join as Student &rarr;</span>
          </Link>

          <Link href="/signup" className={styles.roleCard}>
            <div className={styles.iconWrapper} aria-hidden="true">
              👨‍👩‍👧
            </div>
            <h2 className={styles.cardTitle}>Parent</h2>
            <p className={styles.cardDescription}>
              Track genuine learning milestones, revision consistency, and support your student with clear insights.
            </p>
            <span className={styles.cardAction}>Join as Parent &rarr;</span>
          </Link>

          <Link href="/signup" className={styles.roleCard}>
            <div className={styles.iconWrapper} aria-hidden="true">
              👩‍🏫
            </div>
            <h2 className={styles.cardTitle}>Educator</h2>
            <p className={styles.cardDescription}>
              Diagnose class mastery gaps, assign smart practice, and leverage AI diagnostic analytics.
            </p>
            <span className={styles.cardAction}>Join as Educator &rarr;</span>
          </Link>
        </div>

        <div className={styles.loginPrompt}>
          <span>Already have an account?</span>
          <Link href="/login" className={styles.loginLink}>
            Sign In to your workspace &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
