'use client';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import styles from './StatsSection.module.css';

const stats = [
  { end: 10000, suffix: '+', label: 'Concepts Mapped' },
  { end: 50, suffix: '+', label: 'Subjects Covered' },
  { end: 95, suffix: '%', label: 'Accuracy Improvement' },
  { end: 24, suffix: '/7', label: 'AI Tutor Access' },
];

export function StatsSection() {
  return (
    <section className={styles.stats} aria-label="Platform statistics">
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
