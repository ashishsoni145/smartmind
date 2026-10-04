import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The mission, vision, and values behind SharpMind — building the AI Academic OS that puts students first.',
};

const values = [
  { icon: '🔬', title: 'Evidence-Based', description: 'Every decision in SharpMind — from study recommendations to readiness scores — is grounded in real, observed evidence. We never guess when we can measure.' },
  { icon: '🎓', title: 'Student-First', description: 'Students are the primary users and beneficiaries. Every feature is designed to genuinely help students learn better, not to optimise engagement metrics.' },
  { icon: '🔒', title: 'Privacy-First', description: 'Student data is private, isolated, and protected. We believe academic data is among the most sensitive personal data and treat it accordingly.' },
  { icon: '🧪', title: 'Learning Science', description: 'We build on decades of research in cognitive science, spaced repetition, testing effects, and adaptive learning — not trends or intuition.' },
  { icon: '💡', title: 'Transparency', description: 'Students can always understand why SharpMind makes a recommendation. Our AI explains its reasoning and shows the evidence behind every suggestion.' },
  { icon: '♿', title: 'Accessibility', description: 'Education is for everyone. We build accessible interfaces that work for all students, regardless of ability, device, or connectivity.' },
];

export default function AboutPage() {
  return (
    <>
      <section className={`${styles.hero} section`} aria-labelledby="about-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="Building the Future of Learning"
            subtitle="We believe every student deserves an AI that understands how they learn — not just what they need to learn."
            badge="About Us"
            as="h1"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="section" aria-labelledby="mission-heading">
        <div className={`container ${styles.missionContainer}`}>
          <div className={styles.missionContent}>
            <h2 id="mission-heading" className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              Traditional education gives every student the same content in the same order at the same
              pace. But every student is different — they know different things, forget at different rates,
              and struggle with different concepts.
            </p>
            <p className={styles.missionText}>
              SharpMind exists to close this gap. We&apos;re building an AI Academic Operating System that
              continuously models each student&apos;s unique knowledge state and orchestrates a personalised
              learning journey — turning goals into mastery through evidence-backed learning, practice,
              assessment, and revision.
            </p>
            <p className={styles.missionText}>
              Our vision is a world where no student falls behind because the system couldn&apos;t
              adapt to them.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`${styles.valuesSection} section`} aria-labelledby="values-heading">
        <div className="container">
          <SectionHeading title="Our Values" badge="Principles" />
          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div key={value.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{value.icon}</span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.ctaSection} section`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Join Our Mission</h2>
          <p className={styles.ctaSubtitle}>Help us build the future of education.</p>
          <div className={styles.ctaActions}>
            <Button href="/get-started" variant="primary" size="lg">Get Started</Button>
            <Button href="/contact" variant="outline" size="lg">Get in Touch</Button>
          </div>
        </div>
      </section>
    </>
  );
}
