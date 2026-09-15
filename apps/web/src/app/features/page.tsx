import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card, CardIcon, CardTitle, CardDescription } from '@/components/ui/Card';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Explore every SharpMind feature — AI learning paths, Student Knowledge Model, smart assessments, mistake analysis, spaced repetition, AI Tutor, analytics, and more.',
};

const featureCategories = [
  {
    category: 'Intelligence',
    features: [
      { icon: '🧠', title: 'Student Knowledge Model', description: 'A dynamic, evidence-based model of everything you know, don\'t know, and are forgetting. Updated with every interaction — assessments, practice, and tutor sessions all feed the model.' },
      { icon: '🎯', title: 'Adaptive Learning Paths', description: 'AI generates a personalised study plan from your goals, curriculum, and current knowledge state. It re-optimises daily as your model updates.' },
      { icon: '🤖', title: 'AI Tutor (Multi-Mode)', description: 'Explain mode for deep understanding, Quiz mode for active recall, Socratic mode for guided discovery, and Debug mode for working through mistakes step by step.' },
      { icon: '🔮', title: 'Next Best Action', description: 'At any moment, SharpMind tells you exactly what to study next for maximum impact — based on forgetting curves, exam proximity, and knowledge gaps.' },
    ],
  },
  {
    category: 'Practice & Mastery',
    features: [
      { icon: '📝', title: 'Smart Assessments', description: 'Adaptive tests that calibrate to your level in real-time. Questions get harder as you improve and easier when you struggle, keeping you in the optimal learning zone.' },
      { icon: '❌', title: 'Mistake Analysis', description: 'Every error is captured with full context — the question, your answer, the correct answer, and the underlying misconception. Mistakes become structured revision targets.' },
      { icon: '🔄', title: 'Spaced Repetition', description: 'Algorithmically-timed revision powered by forgetting curves. SharpMind schedules reviews precisely when you\'re about to forget, maximising long-term retention.' },
      { icon: '📚', title: 'PYQ Analysis & Practice', description: 'Previous year questions organised by topic, difficulty, and pattern. See how exams test each concept and practice with real exam questions.' },
    ],
  },
  {
    category: 'Tracking & Readiness',
    features: [
      { icon: '📊', title: 'Deep Analytics', description: 'Track mastery by subject, topic, and concept. Visualise learning velocity, time spent, accuracy trends, and knowledge coverage in real-time dashboards.' },
      { icon: '✅', title: 'Exam Readiness Score', description: 'A continuously-updated score that tells you exactly how prepared you are for each upcoming exam — broken down by topic and question type.' },
      { icon: '📅', title: 'Smart Planner', description: 'AI-generated daily and weekly study plans that balance new learning, practice, revision, and rest. Automatically adjusts when life happens.' },
      { icon: '🌐', title: 'Cross-Platform Sync', description: 'One canonical academic state across web, Android, iOS, Windows, and macOS. Start on your phone during commute, continue on desktop at home.' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className={`${styles.hero} section`} aria-labelledby="features-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="Features Built for Real Learning"
            subtitle="Every feature in SharpMind is designed around one question: does this actually help students learn better? If the answer isn't a clear yes, it doesn't ship."
            badge="Features"
            as="h1"
          />
        </div>
      </section>

      {featureCategories.map((category) => (
        <section
          key={category.category}
          className={`section ${styles.categorySection}`}
          aria-labelledby={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div className="container">
            <h2
              id={`category-${category.category.toLowerCase().replace(/\s+/g, '-')}`}
              className={styles.categoryTitle}
            >
              {category.category}
            </h2>
            <div className={styles.grid}>
              {category.features.map((feature) => (
                <Card key={feature.title} variant="feature">
                  <CardIcon>{feature.icon}</CardIcon>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
