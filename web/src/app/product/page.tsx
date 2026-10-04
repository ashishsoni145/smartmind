import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardIcon, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Product Overview',
  description:
    'Discover how SharpMind transforms academic learning with an AI-powered Academic Operating System — adaptive paths, knowledge modelling, and exam readiness.',
};

const differentiators = [
  {
    icon: '🎓',
    title: 'Not a Study App',
    description: 'SharpMind is a complete Academic Operating System. It doesn\'t just deliver content — it orchestrates your entire learning journey with continuous intelligence.',
  },
  {
    icon: '📈',
    title: 'Evidence, Not Guesses',
    description: 'Every recommendation is grounded in observed evidence from your interactions — not assumptions or generic algorithms.',
  },
  {
    icon: '🔒',
    title: 'Privacy-First',
    description: 'Your academic data is private, isolated, and never sold. Parents and teachers access only what you authorise through explicit consent.',
  },
  {
    icon: '🌐',
    title: 'One Brain, Every Device',
    description: 'Your Student Model syncs across web, mobile, and desktop. Start on your phone, continue on your laptop — zero context lost.',
  },
];

const curricula = [
  { name: 'CBSE Classes 11–12', description: 'Complete coverage of CBSE curriculum with NCERT alignment.' },
  { name: 'JEE (Main & Advanced)', description: 'Comprehensive JEE preparation with PYQ analysis and exam-pattern practice.' },
  { name: 'NEET', description: 'Biology, Physics, and Chemistry preparation tailored for medical entrance.' },
  { name: 'ICSE', description: 'ICSE curriculum support with board-specific preparation strategies.' },
];

export default function ProductPage() {
  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} section`} aria-labelledby="product-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="The Future of Academic Learning"
            subtitle="SharpMind isn't another study app. It's an AI Academic Operating System that continuously models your knowledge and orchestrates every step of your learning journey."
            badge="Product"
            as="h1"
          />
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="section" aria-labelledby="differentiators-heading">
        <div className="container">
          <SectionHeading
            title="What Makes SharpMind Different"
            subtitle="Built from first principles of learning science and AI, not retrofitted onto a content library."
          />
          <div className={styles.grid}>
            {differentiators.map((item) => (
              <Card key={item.title} variant="feature">
                <CardIcon>{item.icon}</CardIcon>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Curricula */}
      <section className={`${styles.curriculaSection} section`} aria-labelledby="curricula-heading">
        <div className="container">
          <SectionHeading
            title="Built for India's Most Important Exams"
            subtitle="Authoritative, verified curriculum data — not scraped content. Every concept is mapped, every question is sourced."
            badge="Curricula"
          />
          <div className={styles.curriculaGrid}>
            {curricula.map((item) => (
              <Card key={item.name} variant="elevated" hover={false}>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.ctaSection} section`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Ready to experience the difference?</h2>
          <p className={styles.ctaSubtitle}>
            Start your journey with SharpMind today.
          </p>
          <div className={styles.ctaActions}>
            <Button href="/get-started" variant="primary" size="lg">
              Get Started Free
            </Button>
            <Button href="/features" variant="outline" size="lg">
              See All Features
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
