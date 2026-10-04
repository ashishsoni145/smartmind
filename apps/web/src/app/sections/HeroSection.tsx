import { Button } from '@/components/ui/Button';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* Animated background */}
      <div className={styles.bgGlow} aria-hidden="true">
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>AI-Powered Academic OS</span>

          <h1 id="hero-heading" className={styles.title}>
            Master Any Subject with{' '}
            <span className={styles.gradientText}>
              AI That Knows How You Learn
            </span>
          </h1>

          <p className={styles.subtitle}>
            SharpMind continuously models what you know, what you&apos;ve
            forgotten, and what you need next — turning your goals into
            evidence-backed learning, practice, and exam readiness.
          </p>

          <div className={styles.actions}>
            <Button href="/get-started" variant="primary" size="lg">
              Get Started Free
            </Button>
            <Button href="/product" variant="secondary" size="lg">
              Learn More
            </Button>
          </div>

          <div className={styles.curricula}>
            <span className={styles.curriculaLabel}>Built for</span>
            <div className={styles.curriculaTags}>
              {['CBSE 11-12', 'JEE', 'NEET', 'ICSE'].map((tag) => (
                <span key={tag} className={styles.curriculaTag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
