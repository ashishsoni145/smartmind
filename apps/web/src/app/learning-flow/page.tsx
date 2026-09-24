import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Learning Flow',
  description:
    'Understand the SharpMind learning loop — from goal-setting through adaptive learning, assessment, mistake analysis, spaced revision, to exam readiness.',
};

const loopSteps = [
  {
    number: '01',
    title: 'Goals & Curriculum',
    description: 'You define your targets: exams, subjects, topics, or skills. SharpMind maps your goals to the official curriculum, creating a structured academic graph of everything you need to master.',
    detail: 'Example: "Prepare for JEE Main 2027" → SharpMind maps all Physics, Chemistry, and Maths topics from the JEE syllabus and cross-references with NCERT.',
    color: 'var(--color-accent-light)',
  },
  {
    number: '02',
    title: 'Diagnostic & Student Model',
    description: 'Before jumping in, SharpMind assesses what you already know. Quick diagnostic assessments establish your baseline, and the Student Model initialises with real evidence — not assumptions.',
    detail: 'Your Student Model starts forming from day one: concept mastery levels, confidence scores, and knowledge gaps, all based on real interactions.',
    color: 'var(--color-accent)',
  },
  {
    number: '03',
    title: 'Adaptive Learning',
    description: 'Based on your Student Model, SharpMind generates a personalised learning path. It selects the right concepts, in the right order, at the right difficulty — adapting in real-time as you progress.',
    detail: 'If you\'re strong in Kinematics but weak in Rotational Dynamics, SharpMind won\'t waste time on basics you\'ve mastered. It goes straight to your gaps.',
    color: 'var(--color-accent)',
  },
  {
    number: '04',
    title: 'Practice & Assessment',
    description: 'Calibrated questions test your understanding at exactly the right level. Adaptive assessments get harder as you improve and provide targeted practice exactly where you need it.',
    detail: 'Each question response updates your Student Model: correct answers strengthen mastery, errors reveal misconceptions, and time patterns show confidence.',
    color: '#06b6d4',
  },
  {
    number: '05',
    title: 'Mistake Capture & Analysis',
    description: 'Every mistake is a data point. SharpMind captures the full context — the question, your response, the correct answer, the underlying concept, and the likely misconception.',
    detail: 'Mistakes are categorised (conceptual error, calculation slip, misread question) and linked to specific concepts, creating a structured revision target list.',
    color: '#10b981',
  },
  {
    number: '06',
    title: 'Model Update & Backlog',
    description: 'Your Student Model continuously updates. New evidence refines mastery levels, forgetting curves predict decay, and the adaptive backlog re-prioritises what to study next.',
    detail: 'The system distinguishes between observed evidence (test results) and inferred state (predicted forgetting). Only verified data changes your core model.',
    color: '#f59e0b',
  },
  {
    number: '07',
    title: 'Spaced Revision',
    description: 'Algorithmically-timed revision sessions target concepts that are about to be forgotten. Spaced repetition ensures long-term retention without wasting time reviewing what\'s still fresh.',
    detail: 'SharpMind knows that you learned "Thermodynamics — Carnot Cycle" 12 days ago and you\'re predicted to forget it tomorrow. It schedules revision today.',
    color: '#ef4444',
  },
  {
    number: '08',
    title: 'Readiness & Next Action',
    description: 'Continuous readiness scoring tells you exactly how prepared you are for each exam. The loop starts again — SharpMind always knows the best next action.',
    detail: 'Readiness is broken down by subject, topic, and question type. "You\'re 78% ready for JEE Physics — strongest in Mechanics (92%), weakest in Optics (54%)."',
    color: 'var(--color-accent-light)',
  },
];

export default function LearningFlowPage() {
  return (
    <>
      <section className={`${styles.hero} section`} aria-labelledby="flow-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="The SharpMind Learning Loop"
            subtitle="A continuous, evidence-driven cycle that turns academic goals into mastery. Every step feeds the next, creating a self-improving system that gets smarter as you learn."
            badge="Learning Flow"
            as="h1"
          />
        </div>
      </section>

      <section className="section" aria-label="Learning loop steps">
        <div className="container">
          <div className={styles.timeline}>
            {loopSteps.map((step, index) => (
              <div key={step.number} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <div
                    className={styles.timelineNumber}
                    style={{ background: step.color }}
                  >
                    {step.number}
                  </div>
                  {index < loopSteps.length - 1 && (
                    <div className={styles.timelineLine} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <h2 className={styles.stepTitle}>{step.title}</h2>
                  <p className={styles.stepDescription}>{step.description}</p>
                  <div className={styles.stepDetail}>
                    <p>{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loop indicator */}
          <div className={styles.loopIndicator}>
            <div className={styles.loopArrow} aria-hidden="true">↻</div>
            <p className={styles.loopText}>
              The loop never stops. Every interaction makes SharpMind smarter about how you learn.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.ctaSection} section`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Start Your Learning Loop</h2>
          <p className={styles.ctaSubtitle}>
            Experience the continuous cycle of improvement.
          </p>
          <Button href="/get-started" variant="primary" size="lg">
            Get Started Free
          </Button>
        </div>
      </section>
    </>
  );
}
