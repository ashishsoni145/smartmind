import React from 'react';
import type { TutorSession } from '@/lib/types/tutor';
import { Icon } from '@/components/ui/Icon';
import styles from './TutorSessionSidebar.module.css';

interface TutorSessionSidebarProps {
  sessions: TutorSession[];
  activeSessionId: string | null;
  onSelectSession: (session: TutorSession) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const TutorSessionSidebar: React.FC<TutorSessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}) => {
  return (
    <aside className={styles.sidebar} aria-label="Tutor dialogues history">
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Dialogue Threads</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {sessions.length}
        </span>
      </div>

      <button
        type="button"
        className={styles.newSessionBtn}
        onClick={onNewSession}
        aria-label="Start new dialogue thread"
      >
        <Icon name="sparkles" size="sm" />
        New Dialogue
      </button>

      {sessions.length === 0 ? (
        <div className={styles.emptyHistory}>
          No prior dialogues recorded in this session. Start by asking a question.
        </div>
      ) : (
        <ul className={styles.sessionList}>
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const dateStr = new Date(s.updatedAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <li key={s.id}>
                <div
                  role="button"
                  tabIndex={0}
                  className={`${styles.sessionItem} ${isActive ? styles.activeSessionItem : ''}`}
                  onClick={() => onSelectSession(s)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSession(s);
                    }
                  }}
                  aria-selected={isActive}
                >
                  <div className={styles.sessionContent}>
                    <span className={styles.sessionTitle}>{s.title}</span>
                    <span className={styles.sessionMeta}>
                      <Icon name="clock" size="xs" />
                      {dateStr} • {s.currentMode || s.mode}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    title="Delete dialogue"
                    aria-label={`Delete dialogue: ${s.title}`}
                  >
                    <Icon name="trash" size="xs" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
};
