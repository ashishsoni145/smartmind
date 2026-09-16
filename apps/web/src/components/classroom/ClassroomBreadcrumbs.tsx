'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import styles from './ClassroomBreadcrumbs.module.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface ClassroomBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const ClassroomBreadcrumbs: React.FC<ClassroomBreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Classroom Hierarchy" className={styles.nav}>
      <Link href="/app/classroom" className={styles.crumbLink}>
        <Icon name="classroom" size="xs" />
        <span>Classroom</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className={styles.separator} aria-hidden="true">
            <Icon name="chevronRight" size="xs" />
          </span>

          {item.active || !item.href ? (
            <span className={styles.crumbActive} aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className={styles.crumbLink}>
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
