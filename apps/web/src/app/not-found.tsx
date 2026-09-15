import { Button } from '@/components/ui/Button';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <section className={styles.page} aria-labelledby="not-found-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.container}`}>
        <span className={styles.code}>404</span>
        <h1 id="not-found-heading" className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Button href="/" variant="primary" size="lg">
            Go Home
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
