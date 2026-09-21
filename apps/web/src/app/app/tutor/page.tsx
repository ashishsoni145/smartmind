'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { TutorModeSelector } from '@/components/tutor/TutorModeSelector';
import { TutorMessageThread } from '@/components/tutor/TutorMessageThread';
import { TutorInputArea } from '@/components/tutor/TutorInputArea';
import { TutorSessionSidebar } from '@/components/tutor/TutorSessionSidebar';
import { VisualLearningViewer } from '@/components/visual/VisualLearningViewer';
import { tutorAdapter } from '@/lib/adapters/tutor';
import { useAuth } from '@/lib/auth/auth-context';
import type { TutorSession, TutorMessage, TutorMode } from '@/lib/types/tutor';
import styles from './tutor.module.css';

function TutorPageContent() {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const modeParam = (searchParams.get('mode') as TutorMode) || 'teach';

  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [activeSession, setActiveSession] = useState<TutorSession | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [currentMode, setCurrentMode] = useState<TutorMode>(modeParam);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showSimModal, setShowSimModal] = useState<boolean>(false);

  // Load sessions on mount or when user changes
  const loadSessions = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const sessionList = await tutorAdapter.getSessions(currentUserId);
      setSessions(sessionList);

      if (sessionList.length > 0) {
        // If topicParam matches an existing session, or default to first
        setActiveSession(sessionList[0]);
        const msgs = await tutorAdapter.getMessages(sessionList[0].id);
        setMessages(msgs);
      } else if (topicParam) {
        // Only auto-create session if explicitly launched with a topic
        const initialTitle = `Topic: ${topicParam.replace(/-/g, ' ')}`;
        const newSession = await tutorAdapter.createSession(
          currentUserId,
          initialTitle,
          modeParam,
          {
            topicTitle: topicParam.replace(/-/g, ' '),
            targetExam: 'jee_main',
          }
        );
        setSessions([newSession]);
        setActiveSession(newSession);
        setMessages([]);
      } else {
        setActiveSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to load tutor sessions:', err);
    }
  }, [currentUserId, topicParam, modeParam]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Load messages when active session changes
  const handleSelectSession = async (session: TutorSession) => {
    setActiveSession(session);
    setCurrentMode(session.currentMode || session.mode || 'teach');
    setIsLoading(true);
    try {
      const msgs = await tutorAdapter.getMessages(session.id);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new dialogue thread
  const handleNewSession = async () => {
    if (!currentUserId) return;
    try {
      const newSession = await tutorAdapter.createSession(
        currentUserId,
        `Dialogue #${sessions.length + 1} (${currentMode})`,
        currentMode,
        activeSession?.context
      );
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create new session:', err);
    }
  };

  // Delete dialogue thread
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await tutorAdapter.deleteSession(sessionId);
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setSessions(remaining);
      if (activeSession?.id === sessionId) {
        if (remaining.length > 0) {
          handleSelectSession(remaining[0]);
        } else {
          setActiveSession(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  // Send message
  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!currentUserId) return;

    let currentActive = activeSession;
    if (!currentActive) {
      const newSession = await tutorAdapter.createSession(
        currentUserId,
        content.slice(0, 36) || 'New Concept Dialogue',
        currentMode
      );
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
      currentActive = newSession;
    }

    const sessionId = currentActive.id;

    // Optimistically add user message to UI
    const optimisticUserMsg: TutorMessage = {
      id: `usr-${Date.now()}`,
      sessionId,
      senderRole: 'student',
      role: 'user',
      messageText: content,
      content,
      imageUrl,
      mode: currentMode,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsLoading(true);

    try {
      const assistantMsg = await tutorAdapter.sendMessage(
        sessionId,
        content,
        currentMode,
        imageUrl,
        currentActive?.context
      );
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to send tutor message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Authenticating Socratic AI Tutor session...
      </div>
    );
  }

  return (
    <div className={styles.tutorLayout}>
      {/* Session History Drawer */}
      {isSidebarOpen && (
        <TutorSessionSidebar
          sessions={sessions}
          activeSessionId={activeSession?.id || null}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* Main Dialogue Pane */}
      <div className={styles.mainDialoguePane}>
        {/* Dialogue Top Bar */}
        <div className={styles.dialogueTopBar}>
          <div className={styles.contextInfo}>
            <button
              type="button"
              className={styles.sidebarToggleBtn}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? 'Collapse threads' : 'Expand threads'}
              aria-label="Toggle sessions history sidebar"
            >
              <Icon name="layers" size="sm" />
            </button>

            <h1 className={styles.dialogueTitle}>
              {activeSession?.title || 'Socratic AI Dialogue'}
            </h1>

            {activeSession?.context?.topicTitle && (
              <span className={styles.topicTag}>
                <Icon name="target" size="xs" />
                {activeSession.context.topicTitle}
              </span>
            )}
          </div>

          <div className={styles.topBarActions}>
            <button
              type="button"
              className={styles.visualSimBtn}
              onClick={() => setShowSimModal(true)}
              title="Open 3D Trajectory & Visual Simulation"
              aria-label="Open 3D Simulation"
            >
              <Icon name="cube" size="sm" />
              3D Simulation Void
            </button>
          </div>
        </div>

        {/* 10 Pedagogical Modes Selector */}
        <TutorModeSelector
          selectedMode={currentMode}
          onSelectMode={setCurrentMode}
          disabled={isLoading}
        />

        {/* Message Thread (Student + Assistant turns + Citations) */}
        {messages.length === 0 && !isLoading ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            <span style={{ fontSize: '2.5rem' }}>💡</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginTop: '0.75rem' }}>
              How can I guide your understanding today?
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '480px', marginTop: '0.5rem', lineHeight: 1.6 }}>
              Ask a question about any concept, paste a difficult problem, or upload a diagram. I will help you deduce the principles step by step rather than just giving away the solution.
            </p>
          </div>
        ) : (
          <TutorMessageThread
            messages={messages}
            isLoading={isLoading}
            onOpenSimulation={() => setShowSimModal(true)}
            onSelectSuggestion={(prompt) => handleSendMessage(prompt)}
          />
        )}

        {/* Multiline Input Area with Image Attachment & Drag/Drop */}
        <TutorInputArea
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* 3D Void Simulation Modal */}
      {showSimModal && (
        <div
          className={styles.simModalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sim-modal-heading"
        >
          <div className={styles.simModalWrapper}>
            <VisualLearningViewer
              title="Interactive Physics 3D Spatial Simulator"
              topicTitle={activeSession?.context?.topicTitle || 'Spatial Vectors & Dynamics'}
              onClose={() => setShowSimModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TutorPage() {
  return (
    <WorkspaceShell>
      <Suspense fallback={<div style={{ padding: '2rem' }}>Loading SharpMind AI Tutor...</div>}>
        <TutorPageContent />
      </Suspense>
    </WorkspaceShell>
  );
}
