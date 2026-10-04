import React from 'react';
import { Icon, IconName } from '@/components/ui/Icon';
import styles from './LibraryFilterBar.module.css';

export interface LibraryFilters {
  subjectId: string;
  fileType: string;
  searchQuery: string;
}

interface LibraryFilterBarProps {
  filters: LibraryFilters;
  onChange: (filters: LibraryFilters) => void;
  totalCount: number;
}

const SUBJECT_OPTIONS: { id: string; label: string; icon: IconName }[] = [
  { id: 'all', label: 'All Disciplines', icon: 'layers' },
  { id: 'physics', label: 'Physics', icon: 'physics' },
  { id: 'chemistry', label: 'Chemistry', icon: 'chemistry' },
  { id: 'mathematics', label: 'Mathematics', icon: 'mathematics' },
  { id: 'biology', label: 'Biology', icon: 'biology' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Resource Formats' },
  { value: 'pdf', label: 'NCERT & PDF Textbooks' },
  { value: 'notes', label: 'Master Notes' },
  { value: 'cheatsheet', label: 'Formula Cheatsheets' },
  { value: 'image', label: 'Visual Diagrams' },
  { value: 'summary', label: 'Revision Summaries' },
];

export const LibraryFilterBar: React.FC<LibraryFilterBarProps> = ({
  filters,
  onChange,
  totalCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleClearSearch = () => {
    onChange({ ...filters, searchQuery: '' });
  };

  const handleSubjectClick = (subjectId: string) => {
    onChange({ ...filters, subjectId });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, fileType: e.target.value });
  };

  return (
    <div className={styles.filterContainer} role="search" aria-label="Library Resource Search and Filters">
      <div className={styles.topRow}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            <Icon name="search" size="sm" />
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search NCERT chapters, formulas, notes, or keywords..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            aria-label="Search curriculum materials"
          />
          {filters.searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClearSearch}
              aria-label="Clear search query"
            >
              <Icon name="close" size="xs" />
            </button>
          )}
        </div>

        <div className={styles.typeSelectWrapper}>
          <label htmlFor="material-type-select" className={styles.typeSelectLabel}>
            Format:
          </label>
          <select
            id="material-type-select"
            className={styles.typeSelect}
            value={filters.fileType}
            onChange={handleTypeChange}
            aria-label="Filter by material format"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.subjectPills} role="tablist" aria-label="Filter by academic subject">
        {SUBJECT_OPTIONS.map((subj) => {
          const isActive = filters.subjectId === subj.id;
          return (
            <button
              key={subj.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.pillBtn} ${isActive ? styles.activePill : ''}`}
              onClick={() => handleSubjectClick(subj.id)}
            >
              <Icon name={subj.icon} size="xs" />
              {subj.label}
            </button>
          );
        })}
      </div>

      <div className={styles.resultsMeta}>
        <span>
          Showing <strong>{totalCount}</strong> verified academic {totalCount === 1 ? 'resource' : 'resources'}
        </span>
        {(filters.subjectId !== 'all' || filters.fileType !== 'all' || filters.searchQuery) && (
          <button
            type="button"
            className={styles.pillBtn}
            onClick={() => onChange({ subjectId: 'all', fileType: 'all', searchQuery: '' })}
          >
            <Icon name="refresh" size="xs" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
