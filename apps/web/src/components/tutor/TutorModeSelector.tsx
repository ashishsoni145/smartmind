import React from 'react';
import type { TutorMode } from '@/lib/types/tutor';
import { Icon, IconName } from '@/components/ui/Icon';
import styles from './TutorModeSelector.module.css';

interface ModeOption {
  id: TutorMode;
  label: string;
  icon: IconName;
  description: string;
}

export const TUTOR_MODES: ModeOption[] = [
  {
    id: 'teach',
    label: 'Teach',
    icon: 'bookOpen',
    description: 'Foundational concept instruction with structured derivations and real-world intuition.',
  },
  {
    id: 'socratic',
    label: 'Socratic',
    icon: 'helpCircle',
    description: 'Guided questioning sequence to lead you to uncover principles autonomously.',
  },
  {
    id: 'hint',
    label: 'Hint',
    icon: 'lightbulb',
    description: 'A minimal conceptual nudge without spoiling the full solution path.',
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: 'target',
    description: 'Adaptive problem solving with scaffolded difficulty and feedback.',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    icon: 'award',
    description: 'High-speed diagnostic questions to benchmark instant recall.',
  },
  {
    id: 'check_solution',
    label: 'Check Solution',
    icon: 'check',
    description: 'Step-by-step verification of your rough work and calculation accuracy.',
  },
  {
    id: 'explain_mistake',
    label: 'Explain Mistake',
    icon: 'info',
    description: 'Root-cause diagnosis of misconceptions and negative-marking traps.',
  },
  {
    id: 'revision',
    label: 'Revision',
    icon: 'refresh',
    description: 'High-yield formula synthesis and key theorem recap.',
  },
  {
    id: 'viva',
    label: 'Viva',
    icon: 'zap',
    description: 'Oral examination simulation testing deep conceptual defense.',
  },
  {
    id: 'exam',
    label: 'Exam',
    icon: 'clock',
    description: 'Strict exam-condition assessment with rubric grading.',
  },
];

interface TutorModeSelectorProps {
  selectedMode: TutorMode;
  onSelectMode: (mode: TutorMode) => void;
  disabled?: boolean;
}

export const TutorModeSelector: React.FC<TutorModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  disabled = false,
}) => {
  const currentModeInfo = TUTOR_MODES.find((m) => m.id === selectedMode) || TUTOR_MODES[0];

  return (
    <div className={styles.container} role="region" aria-label="Pedagogical Mode Selector">
      <div className={styles.modeHeader}>
        <span className={styles.headerLabel}>
          <Icon name="sparkles" size="xs" />
          Pedagogical Mode
        </span>
        <span className={styles.activeDescription}>{currentModeInfo.description}</span>
      </div>

      <div className={styles.modesList} role="tablist" aria-label="Available Tutor Modes">
        {TUTOR_MODES.map((mode) => {
          const isActive = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={disabled}
              className={`${styles.modeButton} ${isActive ? styles.activeModeButton : ''}`}
              onClick={() => onSelectMode(mode.id)}
              title={mode.description}
            >
              <Icon name={mode.icon} size="xs" />
              {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
