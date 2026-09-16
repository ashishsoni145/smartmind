'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/Icon';
import styles from './CommandPalette.module.css';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  category: 'Core' | 'Academic Intelligence' | 'Account';
  icon: IconName;
  href?: string;
  action?: () => void;
  badge?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'Dashboard & AI Next Action',
        description: 'Primary AI Academic OS next-action command center',
        category: 'Core',
        icon: 'dashboard',
        href: '/app',
      },
      {
        id: 'classroom',
        label: 'Virtual Classroom & Hierarchy',
        description: 'Subject, chapter, topic, and concept learning streams',
        category: 'Core',
        icon: 'classroom',
        href: '/app/classroom',
      },
      {
        id: 'library',
        label: 'Curriculum Library',
        description: 'NCERT textbooks, verified PYQs, and study materials',
        category: 'Core',
        icon: 'library',
        href: '/app/library',
      },
      {
        id: 'tutor',
        label: 'AI Tutor & Doubt Solver',
        description: 'Socratic dialogue and step-by-step problem coaching',
        category: 'Core',
        icon: 'tutor',
        href: '/app/tutor',
        badge: 'Interactive',
      },
      {
        id: 'focus',
        label: 'Focus Mode',
        description: 'Distraction-free Pomodoro deep study environment',
        category: 'Core',
        icon: 'focus',
        href: '/app/focus',
        badge: 'Active Tool',
      },
      {
        id: 'planner',
        label: 'Study Planner & Agenda',
        description: 'Adaptive study schedules aligned with exam milestones',
        category: 'Academic Intelligence',
        icon: 'planner',
        href: '/app/planner',
      },
      {
        id: 'tests',
        label: 'Tests & Diagnostics',
        description: 'SharpMind Baseline Diagnostic and chapter mocks',
        category: 'Academic Intelligence',
        icon: 'tests',
        href: '/app/tests',
        badge: 'Diagnostic Ready',
      },
      {
        id: 'mistakes',
        label: 'Mistake Notebook',
        description: 'Categorized error analysis and spaced remediation',
        category: 'Academic Intelligence',
        icon: 'mistakes',
        href: '/app/mistakes',
      },
      {
        id: 'revision',
        label: 'Spaced Revision Backlog',
        description: 'Retention curves and Leitner review intervals',
        category: 'Academic Intelligence',
        icon: 'revision',
        href: '/app/revision',
      },
      {
        id: 'readiness',
        label: 'Exam Readiness Tracker',
        description: 'Probability projections for JEE, NEET, and Boards',
        category: 'Academic Intelligence',
        icon: 'readiness',
        href: '/app/readiness',
      },
      {
        id: 'analytics',
        label: 'Academic Analytics',
        description: 'Time distribution, accuracy rates, and pacing telemetry',
        category: 'Academic Intelligence',
        icon: 'analytics',
        href: '/app/analytics',
      },
      {
        id: 'upgrade',
        label: 'SharpMind Pro Membership',
        description: 'Explore multi-model AI reasoning and custom mocks',
        category: 'Account',
        icon: 'upgrade',
        href: '/app/upgrade',
        badge: 'Pro',
      },
      {
        id: 'settings',
        label: 'Workspace & Profile Settings',
        description: 'Curriculum targets, study routine, and notifications',
        category: 'Account',
        icon: 'settings',
        href: '/app/settings',
      },
      {
        id: 'onboarding',
        label: 'Re-run Academic Onboarding',
        description: 'Update board, grade, enrolled subjects, and exam goals',
        category: 'Account',
        icon: 'classroom',
        href: '/onboarding',
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          if (selected.action) {
            selected.action();
          } else if (selected.href) {
            router.push(selected.href);
          }
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search academic modules, tools, or tests..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className={styles.shortcutHint}>ESC to exit</kbd>
        </div>

        <div className={styles.resultsList}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>No matching academic tools or modules found.</div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.resultItem} ${idx === selectedIndex ? styles.active : ''}`}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.href) {
                    router.push(item.href);
                  }
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className={styles.itemIcon} aria-hidden="true">
                  <Icon name={item.icon} size="sm" />
                </span>
                <div className={styles.itemContent}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    {item.badge && <span className={styles.itemBadge}>{item.badge}</span>}
                  </div>
                  <span className={styles.itemDesc}>{item.description}</span>
                </div>
                <Icon name="arrowRight" size="xs" style={{ color: 'var(--color-text-tertiary)' }} />
              </button>
            ))
          )}
        </div>

        <div className={styles.dialogFooter}>
          <span>Use ↑ ↓ to navigate</span>
          <span>ENTER to select</span>
        </div>
      </div>
    </div>
  );
}
