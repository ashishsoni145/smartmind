'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';
import { Button } from '@/components/ui/Button';

export default function FocusPage() {
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const selectDuration = (mins: number) => {
    setIsRunning(false);
    setSessionMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <WorkspaceShell>
      <WorkspacePlaceholder
        title="Distraction-Free Focus Mode"
        subtitle="Deep cognitive study blocks calibrated to your daily available hours and energy levels."
        icon="⏱️"
        statusBadge="Session Engine Ready"
        phaseBadge="Interactive Study Tool"
        notice="Tracked study time feeds directly into the Academic Analytics engine and spaced repetition scheduling."
        features={[
          {
            icon: '🎯',
            title: 'Goal-Oriented Study Intervals',
            description: 'Structured Pomodoro intervals (25/50 mins) designed to maximize neural retention without cognitive burnout.',
          },
          {
            icon: '🔕',
            title: 'Distraction Shielding',
            description: 'Mutes non-critical alerts and provides an uncluttered workspace for intense problem-solving drills.',
          },
          {
            icon: '📊',
            title: 'Effort Telemetry',
            description: 'Converts completed focus intervals into verified study hours reflected on your academic progress dashboard.',
          },
        ]}
      >
        {/* Interactive Focus Timer */}
        <div style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, #181818, #0f0f0f)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 16px 36px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => selectDuration(25)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-pill)',
                background: sessionMinutes === 25 ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                color: sessionMinutes === 25 ? '#000000' : 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
            >
              25m Deep Work
            </button>
            <button
              type="button"
              onClick={() => selectDuration(50)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-pill)',
                background: sessionMinutes === 50 ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                color: sessionMinutes === 50 ? '#000000' : 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
            >
              50m Exam Block
            </button>
          </div>

          <div style={{
            fontSize: '5rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(255, 255, 255, 0.2)',
          }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={toggleTimer} variant={isRunning ? 'secondary' : 'primary'} size="lg">
              {isRunning ? 'Pause Session' : 'Start Focus Session'}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="lg">
              Reset
            </Button>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            Completed today: {completedSessions} block{completedSessions === 1 ? '' : 's'} ({(completedSessions * sessionMinutes / 60).toFixed(1)} hrs)
          </div>
        </div>
      </WorkspacePlaceholder>
    </WorkspaceShell>
  );
}
