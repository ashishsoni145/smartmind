import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    title: 'Set Your Goals',
    description:
      'Tell SharpMind your targets — upcoming exams, subjects to master, or topics to strengthen. It builds your personalised academic map.',
  },
  {
    number: '02',
    title: 'Learn Adaptively',
    description:
      'AI curates the perfect sequence of concepts, materials, and practice for where you are right now. No guesswork.',
  },
  {
    number: '03',
    title: 'Practice & Assess',
    description:
      'Tackle calibrated questions and assessments. Every response updates your Student Model with real evidence.',
  },
  {
    number: '04',
    title: 'Revise & Master',
    description:
      'Spaced repetition, mistake analysis, and readiness scoring ensure nothing falls through the cracks before exam day.',
  },
];

export function HowItWorks() {
  return (
    <section className={`${styles.section} section`} aria-labelledby="how-it-works-heading">
      <div className="container">
        <SectionHeading
          title="How SharpMind Works"
          subtitle="Four steps from chaos to clarity. Your entire academic journey, orchestrated by AI."
          badge="Process"
        />

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber} aria-hidden="true">
                {step.number}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
