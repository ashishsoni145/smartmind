import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardIcon, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import styles from './FeaturesPreview.module.css';

const features = [
  {
    icon: '🧠',
    title: 'Student Knowledge Model',
    description:
      'A living map of what you know, what you\'ve forgotten, and what needs reinforcement — updated with every interaction.',
  },
  {
    icon: '🎯',
    title: 'Adaptive Learning Paths',
    description:
      'AI-generated study plans that adapt in real-time based on your performance, pace, and upcoming exams.',
  },
  {
    icon: '🔬',
    title: 'Smart Practice & Assessment',
    description:
      'Questions calibrated to your skill level. No wasted time on what you already know, no skipping what you don\'t.',
  },
  {
    icon: '📊',
    title: 'Mistake-Powered Learning',
    description:
      'Every mistake is captured, categorized, and turned into targeted revision — your errors become your greatest teacher.',
  },
  {
    icon: '🔄',
    title: 'Spaced Repetition Engine',
    description:
      'Scientifically-timed revision that fights forgetting. SharpMind knows when you\'re about to forget and intervenes.',
  },
  {
    icon: '🤖',
    title: 'AI Tutor',
    description:
      'An always-available tutor that explains, guides, and asks the right questions — never just gives away answers.',
  },
];

export function FeaturesPreview() {
  return (
    <section className={`${styles.section} section`} aria-labelledby="features-heading">
      <div className={`${styles.container} container`}>
        <SectionHeading
          title="Everything You Need to Master Any Subject"
          subtitle="SharpMind combines AI intelligence with proven learning science to create a system that actually works."
          badge="Features"
        />

        <div className={styles.grid}>
          {features.map((feature) => (
            <Card key={feature.title} variant="feature">
              <CardIcon>{feature.icon}</CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>

        <div className={styles.cta}>
          <Button href="/features" variant="outline" size="md">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
}
