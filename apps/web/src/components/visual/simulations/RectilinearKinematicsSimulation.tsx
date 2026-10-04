import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface RectilinearKinematicsSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const RectilinearKinematicsSimulation: React.FC<RectilinearKinematicsSimulationProps> = ({
  onClose,
  title = '1D Kinematics & Real-Time Motion Grapher',
  topicTitle = 'Motion in a Straight Line (NCERT Chapter 2 • Section 2.5)',
}) => {
  const [initialVelocity, setInitialVelocity] = useState<number>(10); // m/s
  const [acceleration, setAcceleration] = useState<number>(2); // m/s²
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [isBraking, setIsBraking] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Maximum simulated duration before auto-stop
  const maxSimTime = 12; // seconds

  // Effective acceleration (if braking, apply -6 m/s² until v=0)
  const effectiveAcc = isBraking ? -6 : acceleration;

  // Calculate kinematics at time t
  const getKinematicsAt = (t: number) => {
    let curV = initialVelocity + effectiveAcc * t;
    let curX = initialVelocity * t + 0.5 * effectiveAcc * t * t;

    // If braking, clamp at zero velocity
    if (isBraking && initialVelocity > 0 && curV <= 0) {
      const stopT = initialVelocity / 6;
      curV = 0;
      curX = initialVelocity * stopT + 0.5 * (-6) * stopT * stopT;
    }

    return { x: Math.max(0, curX), v: curV, a: effectiveAcc };
  };

  const current = getKinematicsAt(simTime);
  const stoppingDistance = current.v > 0 ? (current.v * current.v) / (2 * Math.abs(effectiveAcc || 1)) : 0;

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const loop = (now: number) => {
      if (lastTimestampRef.current !== null) {
        const dt = (now - lastTimestampRef.current) / 1000;
        setSimTime((prev) => {
          const next = prev + dt;
          if (next >= maxSimTime) {
            setIsPlaying(false);
            return maxSimTime;
          }
          return next;
        });
      }
      lastTimestampRef.current = now;
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
    setIsBraking(false);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setSimTime((prev) => Math.min(maxSimTime, prev + 0.1));
  };

  // Canvas drawing: Track + Real-Time Multi-Curve Oscilloscope
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // ==========================================
    // UPPER HALF: 1D Roadway Track with Vehicle & Vectors
    // ==========================================
    const trackY = 90;
    const trackStart = 60;
    const trackEnd = width - 60;
    const trackLen = trackEnd - trackStart;
    const maxTrackMeters = 180;
    const scaleM2Px = trackLen / maxTrackMeters;

    // Track surface
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(trackStart - 10, trackY - 15, trackLen + 20, 30);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(trackStart - 10, trackY - 15, trackLen + 20, 30);

    // Meter ticks & labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    for (let m = 0; m <= maxTrackMeters; m += 20) {
      const px = trackStart + m * scaleM2Px;
      ctx.beginPath();
      ctx.moveTo(px, trackY - 15);
      ctx.lineTo(px, trackY - 8);
      ctx.stroke();
      ctx.fillText(`${m}m`, px - 10, trackY + 28);
    }

    // Particle / Vehicle position on track
    const carPx = trackStart + Math.min(maxTrackMeters, current.x) * scaleM2Px;

    // Particle body (glowing pod)
    const carRadius = 10;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(carPx, trackY, carRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity Vector Arrow (Green)
    const vLen = Math.min(70, current.v * 2.2);
    if (Math.abs(vLen) > 2) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(carPx, trackY - 18);
      ctx.lineTo(carPx + vLen, trackY - 18);
      ctx.stroke();

      // Arrowhead
      const head = vLen > 0 ? 5 : -5;
      ctx.beginPath();
      ctx.moveTo(carPx + vLen, trackY - 18);
      ctx.lineTo(carPx + vLen - head, trackY - 22);
      ctx.lineTo(carPx + vLen - head, trackY - 14);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = '10px sans-serif';
      ctx.fillText(`v = ${current.v.toFixed(1)} m/s`, carPx + vLen + 6, trackY - 16);
    }

    // Acceleration Vector Arrow (Red)
    const aLen = Math.min(50, current.a * 5);
    if (Math.abs(aLen) > 2) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(carPx, trackY + 2);
      ctx.lineTo(carPx + aLen, trackY + 2);
      ctx.stroke();

      // Arrowhead
      const head = aLen > 0 ? 5 : -5;
      ctx.beginPath();
      ctx.moveTo(carPx + aLen, trackY + 2);
      ctx.lineTo(carPx + aLen - head, trackY - 1);
      ctx.lineTo(carPx + aLen - head, trackY + 5);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.font = '10px sans-serif';
      ctx.fillText(`a = ${current.a.toFixed(1)} m/s²`, carPx + aLen + 6, trackY + 4);
    }

    // ==========================================
    // LOWER HALF: Real-Time Oscilloscope Grapher
    // Plots x(t) in Cyan, v(t) in Green, a(t) in Red
    // ==========================================
    const graphY = 175;
    const graphH = height - graphY - 45;
    const graphW = width - 120;
    const graphX = 70;

    // Background chart box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(graphX, graphY, graphW, graphH);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(graphX, graphY, graphW, graphH);

    // Midline zero reference
    const zeroY = graphY + graphH * 0.55;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.beginPath();
    ctx.moveTo(graphX, zeroY);
    ctx.lineTo(graphX + graphW, zeroY);
    ctx.stroke();

    // Axes labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('Time t (seconds) →', graphX + graphW - 100, zeroY + 16);
    ctx.fillText('↑ Magnitude', graphX - 45, graphY + 12);

    // Legend
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('— Position x(t)', graphX + 15, graphY + 20);
    ctx.fillStyle = '#10b981';
    ctx.fillText('— Velocity v(t)', graphX + 120, graphY + 20);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('— Acceleration a(t)', graphX + 220, graphY + 20);

    // Draw curves up to current simulation time
    const samples = 120;
    const tMax = maxSimTime;

    // 1. Position x(t) Curve (Cyan)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tMax;
      const pt = getKinematicsAt(t);
      const px = graphX + (t / tMax) * graphW;
      const py = zeroY - (pt.x / 180) * (graphH * 0.45);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 2. Velocity v(t) Curve (Green)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tMax;
      const pt = getKinematicsAt(t);
      const px = graphX + (t / tMax) * graphW;
      const py = zeroY - (pt.v / 40) * (graphH * 0.4);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 3. Current Time Vertical Scanhead
    const curTimePx = graphX + (simTime / tMax) * graphW;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(curTimePx, graphY);
    ctx.lineTo(curTimePx, graphY + graphH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Scanhead dot on position curve
    const curPosPy = zeroY - (current.x / 180) * (graphH * 0.45);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curTimePx, curPosPy, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, [simTime, current, initialVelocity, effectiveAcc]);

  return (
    <div className={styles.container} role="region" aria-label="1D Motion Kinematics Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 2 • 1D Kinematics</span>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{topicTitle}</span>
          </div>
        </div>

        {onClose && (
          <button type="button" className={styles.btnSecondary} onClick={onClose} aria-label="Close">
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>

      <div className={styles.mainStage} style={{ minHeight: '440px' }}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div className={styles.telemetryHud}>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Time (t)</span>
            <span className={styles.telemetryVal}>{simTime.toFixed(2)} s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Position x(t)</span>
            <span className={styles.telemetryVal}>{current.x.toFixed(1)} m</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Velocity v(t)</span>
            <span className={styles.telemetryVal}>{current.v.toFixed(1)} m/s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Acceleration (a)</span>
            <span className={styles.telemetryVal}>{current.a.toFixed(1)} m/s²</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Stopping Distance</span>
            <span className={styles.telemetryVal}>{stoppingDistance.toFixed(1)} m</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Initial Velocity (v₀)</span>
              <span className={styles.controlVal}>{initialVelocity} m/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              value={initialVelocity}
              onChange={(e) => {
                setInitialVelocity(Number(e.target.value));
                handleReset();
              }}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Constant Acceleration (a)</span>
              <span className={styles.controlVal}>{acceleration} m/s²</span>
            </div>
            <input
              type="range"
              min="-5"
              max="8"
              value={acceleration}
              onChange={(e) => {
                setAcceleration(Number(e.target.value));
                handleReset();
              }}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Emergency Brake</span>
            </div>
            <button
              type="button"
              className={isBraking ? styles.btnPrimary : styles.btnSecondary}
              style={{ background: isBraking ? '#ef4444' : undefined, borderColor: '#ef4444' }}
              onClick={() => setIsBraking(!isBraking)}
            >
              {isBraking ? 'Braking Active (a = -6 m/s²)' : 'Apply Brake (-6 m/s²)'}
            </button>
          </div>
        </div>

        <div className={styles.playControlsRow}>
          <div className={styles.playbackButtons}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                if (simTime >= maxSimTime) setSimTime(0);
                setIsPlaying(!isPlaying);
              }}
            >
              <Icon name={isPlaying ? 'pause' : 'play'} size="sm" />
              {isPlaying ? 'Pause' : simTime >= maxSimTime ? 'Replay' : 'Run Kinematics'}
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleStep}
              disabled={isPlaying || simTime >= maxSimTime}
            >
              <Icon name="arrowRight" size="xs" />
              Step +0.1s
            </button>

            <button type="button" className={styles.btnSecondary} onClick={handleReset}>
              <Icon name="refresh" size="xs" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
