import { Button } from '@/components/ui/Button';
import styles from './CtaBanner.module.css';

export function CtaBanner() {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <div className={styles.content}>
          <h2 id="cta-heading" className={styles.title}>
            Ready to Transform How You Learn?
          </h2>
          <p className={styles.subtitle}>
            Join SharpMind and experience the future of academic excellence.
            Your AI Academic OS is waiting.
          </p>
          <div className={styles.actions}>
            <Button href="/get-started" variant="primary" size="lg">
              Get Started Free
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Talk to Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
