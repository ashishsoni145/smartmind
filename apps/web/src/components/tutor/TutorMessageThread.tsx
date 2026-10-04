import React, { useRef, useEffect } from 'react';
import type { TutorMessage } from '@/lib/types/tutor';
import { Icon } from '@/components/ui/Icon';
import styles from './TutorMessageThread.module.css';

interface TutorMessageThreadProps {
  messages: TutorMessage[];
  isLoading: boolean;
  onOpenSimulation?: () => void;
  onSelectSuggestion?: (prompt: string) => void;
}

const EMPTY_SUGGESTIONS = [
  {
    icon: 'physics',
    prompt: 'Explain why horizontal velocity is constant in projectile motion while vertical velocity changes.',
  },
  {
    icon: 'lightbulb',
    prompt: 'How do I derive the formula for horizontal range R = (v₀² sin 2θ) / g?',
  },
  {
    icon: 'chemistry',
    prompt: 'What is the algorithmic test to determine the limiting reagent in a stoichiometric reaction?',
  },
  {
    icon: 'mathematics',
    prompt: 'Give me a Socratic hint on applying Lagrange Mean Value Theorem to prove inequalities.',
  },
];

export const TutorMessageThread: React.FC<TutorMessageThreadProps> = ({
  messages,
  isLoading,
  onOpenSimulation,
  onSelectSuggestion,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={styles.threadContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Icon name="sparkles" size="lg" />
          </div>
          <h2 className={styles.emptyTitle}>SharpMind AI Academic Tutor</h2>
          <p className={styles.emptySubtitle}>
            Select your desired pedagogical mode above (Teach, Socratic, Hint, Practice, Quiz, Check Solution, etc.), then ask a question or upload your handwritten rough work.
          </p>

          <div className={styles.suggestedPromptsGrid}>
            {EMPTY_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.suggestedPromptCard}
                onClick={() => onSelectSuggestion?.(item.prompt)}
              >
                <div className={styles.promptIcon}>
                  <Icon name={item.icon as any} size="sm" />
                </div>
                <span className={styles.promptText}>{item.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.threadContainer} role="log" aria-live="polite" aria-label="Tutor Dialogue History">
      {messages.map((msg) => {
        const isUser = msg.senderRole === 'student' || msg.role === 'user';
        const text = msg.messageText || msg.content || '';
        const formattedTime = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        // Check if message recommends projectile or 3D simulation
        const isSimulationRelevant =
          !isUser &&
          (text.toLowerCase().includes('projectile') ||
            text.toLowerCase().includes('trajectory') ||
            text.toLowerCase().includes('simulation') ||
            text.toLowerCase().includes('angle'));

        return (
          <div
            key={msg.id}
            className={`${styles.messageRow} ${isUser ? styles.userRow : styles.assistantRow}`}
          >
            <div
              className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.assistantAvatar}`}
              aria-hidden="true"
            >
              <Icon name={isUser ? 'user' : 'sparkles'} size="sm" />
            </div>

            <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
              <div className={styles.bubbleHeader}>
                {msg.mode && (
                  <span className={styles.modeBadge}>
                    {msg.mode.replace('_', ' ')}
                  </span>
                )}
                <span className={styles.timestamp}>{formattedTime}</span>
              </div>

              {/* Message text */}
              <div className={styles.messageText}>{text}</div>

              {/* Attached image preview */}
              {msg.imageUrl && (
                <div className={styles.attachedImageWrapper}>
                  <img
                    src={msg.imageUrl}
                    alt="Student uploaded problem or handwritten work"
                    className={styles.attachedImage}
                  />
                </div>
              )}

              {/* Authoritative NCERT Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className={styles.citationsContainer}>
                  <span className={styles.citationLabel}>Canonical Syllabus Citations</span>
                  {msg.citations.map((c, cIdx) => (
                    <div key={cIdx} className={styles.citationCard}>
                      <Icon name="bookOpen" size="xs" />
                      <span>
                        <strong>{c.source}</strong> • {c.chapter || c.chapterOrDoc}
                        {c.section ? ` (§${c.section})` : ''}
                        {c.pageNumber ? ` — Page ${c.pageNumber}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive Simulation Hook Button */}
              {isSimulationRelevant && onOpenSimulation && (
                <button
                  type="button"
                  className={styles.simulationHookBtn}
                  onClick={onOpenSimulation}
                >
                  <Icon name="cube" size="sm" />
                  Launch 3D Visual Simulation
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading indicator */}
      {isLoading && (
        <div className={`${styles.messageRow} ${styles.assistantRow}`}>
          <div className={`${styles.avatar} ${styles.assistantAvatar}`} aria-hidden="true">
            <Icon name="sparkles" size="sm" />
          </div>
          <div className={`${styles.messageBubble} ${styles.assistantBubble}`}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              SharpMind Pedagogical Reasoning...
            </span>
            <div className={styles.loadingSkeleton} aria-label="Generating response">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
