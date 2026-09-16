'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './ClassroomFilterBar.module.css';

interface ClassroomFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGrade?: string;
  onGradeChange?: (grade: string) => void;
  placeholder?: string;
  showGradeFilter?: boolean;
}

export const ClassroomFilterBar: React.FC<ClassroomFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGrade = 'all',
  onGradeChange,
  placeholder = 'Search topics, chapters, concepts...',
  showGradeFilter = true,
}) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon} aria-hidden="true">
          <Icon name="search" size="sm" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search curriculum hierarchy"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className={styles.clearBtn}
            aria-label="Clear search"
          >
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>

      {showGradeFilter && onGradeChange && (
        <div className={styles.filterControls}>
          <div className={styles.pillGroup} role="group" aria-label="Grade filter">
            <button
              type="button"
              className={`${styles.pill} ${selectedGrade === 'all' ? styles.pillActive : ''}`}
              onClick={() => onGradeChange('all')}
            >
              All Grades
            </button>
            <button
              type="button"
              className={`${styles.pill} ${selectedGrade === 'class_11' ? styles.pillActive : ''}`}
              onClick={() => onGradeChange('class_11')}
            >
              Class 11
            </button>
            <button
              type="button"
              className={`${styles.pill} ${selectedGrade === 'class_12' ? styles.pillActive : ''}`}
              onClick={() => onGradeChange('class_12')}
            >
              Class 12
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
