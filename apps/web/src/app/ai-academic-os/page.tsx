import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'AI Academic OS',
  description:
    'Learn what an AI Academic Operating System is, how SharpMind\'s Student Model works, and why evidence-based adaptive learning outperforms traditional study methods.',
};

const principles = [
  { title: 'Observed Evidence', description: 'The Student Model only updates from real, observed interactions — answers to questions, time spent, mistakes made. It never guesses or assumes.' },
  { title: 'Controlled Mutation', description: 'Critical academic state (mastery levels, readiness scores) can only be changed through verified evidence pathways. AI cannot arbitrarily alter your progress.' },
  { title: 'Explainable Decisions', description: 'Every recommendation SharpMind makes can be traced back to specific evidence in your Student Model. You can always ask "why?" and get a real answer.' },
  { title: 'Privacy by Design', description: 'Student data is private and isolated. It\'s never shared without explicit consent. Parents and teachers see only what students authorise.' },
];

export default function AiAcademicOsPage() {
  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} section`} aria-labelledby="aios-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="What is an AI Academic OS?"
            subtitle="Most study apps give you content and hope for the best. An Academic Operating System orchestrates your entire learning journey — knowing what you know, predicting what you'll forget, and planning what comes next."
            badge="AI Academic OS"
            as="h1"
          />
        </div>
      </section>

      {/* Study App vs Academic OS */}
      <section className="section" aria-labelledby="comparison-heading">
        <div className="container">
          <h2 id="comparison-heading" className={styles.sectionTitle}>
            Study App vs. Academic OS
          </h2>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCol}>
              <h3 className={styles.comparisonHeader}>Traditional Study App</h3>
              <ul className={styles.comparisonList}>
                <li>Static content delivery</li>
                <li>Same path for everyone</li>
                <li>No memory of what you know</li>
                <li>Random practice questions</li>
                <li>Scores without insight</li>
                <li>You manage your own schedule</li>
              </ul>
            </div>
            <div className={`${styles.comparisonCol} ${styles.comparisonHighlight}`}>
              <h3 className={styles.comparisonHeader}>SharpMind Academic OS</h3>
              <ul className={styles.comparisonList}>
                <li>Dynamic, adaptive orchestration</li>
                <li>Personalised path per student</li>
                <li>Continuous Student Knowledge Model</li>
                <li>Calibrated questions at your level</li>
                <li>Evidence-backed insights &amp; actions</li>
                <li>AI plans your optimal schedule</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Student Model */}
      <section className={`${styles.modelSection} section`} aria-labelledby="model-heading">
        <div className="container">
          <SectionHeading
            title="The Student Model"
            subtitle="At the heart of SharpMind is a dynamic knowledge model that represents everything about your academic state."
          />
          <div className={styles.modelGrid}>
            <div className={styles.modelItem}>
              <h3 className={styles.modelItemTitle}>🎯 What You Know</h3>
              <p className={styles.modelItemDesc}>Concept-level mastery tracking across every topic in your curriculum, updated from real assessment evidence.</p>
            </div>
            <div className={styles.modelItem}>
              <h3 className={styles.modelItemTitle}>🕳️ What You&apos;ve Forgotten</h3>
              <p className={styles.modelItemDesc}>Forgetting curves predict knowledge decay over time, flagging concepts that need reinforcement before they fade.</p>
            </div>
            <div className={styles.modelItem}>
              <h3 className={styles.modelItemTitle}>📍 Where You Struggle</h3>
              <p className={styles.modelItemDesc}>Mistake patterns and misconceptions are identified and tracked, revealing the root causes behind errors.</p>
            </div>
            <div className={styles.modelItem}>
              <h3 className={styles.modelItemTitle}>🚀 What You Need Next</h3>
              <p className={styles.modelItemDesc}>The model computes the optimal next action — learn, practice, revise, or rest — for maximum learning efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section" aria-labelledby="principles-heading">
        <div className="container">
          <SectionHeading
            title="Our AI & Data Principles"
            subtitle="Intelligence you can trust. These aren't just guidelines — they're hard constraints built into the system."
            badge="Principles"
          />
          <div className={styles.principlesGrid}>
            {principles.map((p) => (
              <div key={p.title} className={styles.principleCard}>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleDesc}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.ctaSection} section`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Experience the Academic OS</h2>
          <p className={styles.ctaSubtitle}>See how SharpMind orchestrates learning.</p>
          <Button href="/get-started" variant="primary" size="lg">
            Get Started Free
          </Button>
        </div>
      </section>
    </>
  );
}
