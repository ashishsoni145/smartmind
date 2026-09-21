'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { apiClient } from '@/lib/api-client';
import { StudySession } from '@sharpmind/types';
import styles from './FocusPage.module.css';

const PRESETS = [
  { label: 'Pomodoro', minutes: 25 },
  { label: 'Deep Block', minutes: 50 },
  { label: 'Rapid Sprint', minutes: 15 },
  { label: 'Endurance', minutes: 90 },
];

export default function FocusPage() {
  const [selectedPresetMins, setSelectedPresetMins] = useState(25);
  const [objective, setObjective] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [interruptionsCount, setInterruptionsCount] = useState(0);
  const [startError, setStartError] = useState<string | null>(null);

  // Reflection modal state
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [productivityRating, setProductivityRating] = useState(4);
  const [completedObjective, setCompletedObjective] = useState(true);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);

  // Stats & past sessions
  const [stats, setStats] = useState({
    totalCompletedMinutes: 0,
    completedCount: 0,
    averageProductivity: 0,
  });
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);

  const elapsedSecondsRef = useRef(0);

  // Load past sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await apiClient.focus.listSessions({ limit: 5 });
      setRecentSessions(res.sessions || []);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch {
      // Fallback in mock/offline mode
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          elapsedSecondsRef.current += 1;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const selectPreset = (mins: number) => {
    if (isRunning) return;
    setSelectedPresetMins(mins);
    setTimeLeft(mins * 60);
    elapsedSecondsRef.current = 0;
  };

  const handleStartSession = async () => {
    setStartError(null);
    const cleanObjective = objective.trim() || 'Deep Academic Focus Session';
    try {
      const session = await apiClient.focus.startSession({
        objective: cleanObjective,
        targetDurationMinutes: selectedPresetMins,
      });
      setSessionId(session.id);
      setIsRunning(true);
    } catch (err: any) {
      console.error('Failed to start study session on server:', err);
      setStartError('Could not create focus study session on server. Please check backend connectivity and retry.');
    }
  };

  const handlePause = async () => {
    setIsRunning(false);
    if (sessionId) {
      try {
        await apiClient.focus.pauseSession(sessionId);
      } catch (err) {
        console.error('Failed to pause focus session on server:', err);
      }
    }
  };

  const handleResume = async () => {
    setIsRunning(true);
    if (sessionId) {
      try {
        await apiClient.focus.resumeSession(sessionId);
      } catch (err) {
        console.error('Failed to resume focus session on server:', err);
      }
    }
  };

  const handleLogInterruption = async () => {
    setInterruptionsCount(prev => prev + 1);
    if (sessionId) {
      try {
        await apiClient.focus.logInterruption(sessionId, {
          reason: 'Student logged external distraction',
        });
      } catch (err) {
        console.error('Failed to log interruption on server:', err);
      }
    }
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    setShowReflectionModal(true);
  };

  const handleSubmitReflection = async () => {
    setIsSubmittingReflection(true);
    const actualSeconds = elapsedSecondsRef.current > 0 ? elapsedSecondsRef.current : selectedPresetMins * 60;

    if (sessionId) {
      try {
        await apiClient.focus.completeSession(sessionId, {
          actualDurationSeconds: actualSeconds,
          reflection: {
            productivityScore: productivityRating,
            notes: reflectionNotes,
            completedObjective,
            keyLearnings: reflectionNotes,
          },
        });
      } catch (err) {
        console.error('Failed to complete focus session on server:', err);
      }
    }

    setIsSubmittingReflection(false);
    setShowReflectionModal(false);
    setSessionId(null);
    setObjective('');
    setTimeLeft(selectedPresetMins * 60);
    elapsedSecondsRef.current = 0;
    setInterruptionsCount(0);
    loadSessions();
  };

  // SVG Progress Ring calculations
  const totalSeconds = selectedPresetMins * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <WorkspaceShell>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Icon name="clock" size="xs" />
            Focus Mode Engine
          </div>
          <h1 className={styles.title}>Distraction-Free Study Studio</h1>
          <p className={styles.subtitle}>
            Calibrated cognitive intervals that shield your concentration, record real effort telemetry,
            and feed verifiable study evidence directly into your Student Model.
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <Icon name="clock" size="xs" />
              Total Focus Today
            </div>
            <div className={styles.statValue}>
              {Math.round(stats.totalCompletedMinutes)} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>min</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <Icon name="check" size="xs" />
              Completed Blocks
            </div>
            <div className={styles.statValue}>{stats.completedCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>
              <Icon name="sparkles" size="xs" />
              Avg Productivity
            </div>
            <div className={styles.statValue}>
              {stats.averageProductivity ? `${stats.averageProductivity.toFixed(1)}/5` : '4.2/5'}
            </div>
          </div>
        </div>

        {/* Interactive Timer Block */}
        <div className={styles.timerWorkspace}>
          {/* Preset Buttons */}
          <div className={styles.presetBar}>
            {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                className={`${styles.presetBtn} ${selectedPresetMins === p.minutes ? styles.activePreset : ''}`}
                onClick={() => selectPreset(p.minutes)}
                disabled={isRunning}
              >
                {p.label} ({p.minutes}m)
              </button>
            ))}
          </div>

          {/* Objective Field */}
          <div className={styles.objectiveInputSection}>
            <input
              type="text"
              className={styles.objectiveInput}
              placeholder="What is your clear academic objective for this session? (e.g. Master Gauss's Law problems)"
              value={objective}
              onChange={e => setObjective(e.target.value)}
              disabled={isRunning}
            />
          </div>

          {/* Clock Circle */}
          <div className={styles.timerClockWrapper}>
            <svg className={styles.timerProgressSvg} viewBox="0 0 240 240">
              <circle className={styles.progressTrack} cx="120" cy="120" r={radius} />
              <circle
                className={`${styles.progressBar} ${isRunning ? styles.active : ''}`}
                cx="120"
                cy="120"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            <div className={styles.timerCenter}>
              <div className={styles.timerDigits}>{formattedTime}</div>
              <div className={styles.timerStatus}>
                {isRunning ? 'Deep Work in Progress' : timeLeft === 0 ? 'Session Complete' : 'Interval Armed'}
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {startError && (
            <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>
              {startError}
            </div>
          )}

          {/* Controls */}
          <div className={styles.controls}>
            {!isRunning && timeLeft === selectedPresetMins * 60 && (
              <button
                type="button"
                className={styles.primaryControlBtn}
                onClick={handleStartSession}
              >
                <Icon name="play" size="sm" />
                <span>Begin Focus Block</span>
              </button>
            )}

            {isRunning && (
              <>
                <button
                  type="button"
                  className={styles.secondaryControlBtn}
                  onClick={handlePause}
                >
                  Pause
                </button>
                <button
                  type="button"
                  className={styles.dangerControlBtn}
                  onClick={handleLogInterruption}
                >
                  <Icon name="bell" size="sm" />
                  <span>Log Distraction ({interruptionsCount})</span>
                </button>
                <button
                  type="button"
                  className={styles.primaryControlBtn}
                  onClick={handleSessionComplete}
                >
                  <Icon name="check" size="sm" />
                  <span>Finish & Reflect</span>
                </button>
              </>
            )}

            {!isRunning && timeLeft < selectedPresetMins * 60 && timeLeft > 0 && (
              <>
                <button
                  type="button"
                  className={styles.primaryControlBtn}
                  onClick={handleResume}
                >
                  <Icon name="play" size="sm" />
                  <span>Resume</span>
                </button>
                <button
                  type="button"
                  className={styles.secondaryControlBtn}
                  onClick={handleSessionComplete}
                >
                  Finish Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Post-Session Reflection Modal */}
        {showReflectionModal && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalCard} role="dialog">
              <div>
                <h3 className={styles.modalTitle}>Session Reflection & Evidence Logging</h3>
                <p className={styles.modalSubtitle}>
                  Reflect on your focus to calibrate your Student Model evidence without overstating mastery.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                  Self-Reported Productivity (1 = Distracted, 5 = Deep Flow)
                </label>
                <div className={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.ratingBtn} ${productivityRating === star ? styles.selectedRating : ''}`}
                      onClick={() => setProductivityRating(star)}
                    >
                      {star} {star === 5 ? 'Flow' : star === 1 ? 'Rough' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={completedObjective}
                  onChange={e => setCompletedObjective(e.target.checked)}
                />
                <span>I achieved my intended learning objective</span>
              </label>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.85rem' }}>
                  Key Learnings or Notes (Optional)
                </label>
                <textarea
                  className={styles.reflectionTextarea}
                  placeholder="What concepts clicked? What problems gave you trouble?"
                  value={reflectionNotes}
                  onChange={e => setReflectionNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={styles.secondaryControlBtn}
                  onClick={() => setShowReflectionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryControlBtn}
                  onClick={handleSubmitReflection}
                  disabled={isSubmittingReflection}
                >
                  {isSubmittingReflection ? 'Saving Evidence...' : 'Save & Update Model'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
