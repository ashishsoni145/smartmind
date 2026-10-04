'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AnimatedCounter.module.css';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  label,
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className={`${styles.counter} ${className}`}>
      <span className={styles.value} aria-label={`${prefix}${end}${suffix}`}>
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
