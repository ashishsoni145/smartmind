import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface EnergyConservationSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const EnergyConservationSimulation: React.FC<EnergyConservationSimulationProps> = ({
  onClose,
  title = 'Mechanical Energy Conservation & Potential Wells',
  topicTitle = 'Work, Energy and Power (NCERT Chapter 5 • Section 5.2)',
}) => {
  const [initialHeight, setInitialHeight] = useState<number>(20); // meters
  const [mass, setMass] = useState<number>(4); // kg
  const [gravity, setGravity] = useState<number>(9.8); // m/s²
  const [damping, setDamping] = useState<boolean>(false); // Non-conservative friction
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Oscillation frequency in parabolic bowl: y = c * x²
  // Angular frequency ω = sqrt(2 * c * g)
  const c = 0.03;
  const omega = Math.sqrt(2 * c * gravity);
  const dampingFactor = damping ? 0.08 : 0;

  // Maximum initial displacement x0 where c * x0² = initialHeight
  const maxX = Math.sqrt(initialHeight / c);

  // Position at time t
  const currentX = maxX * Math.exp(-dampingFactor * simTime) * Math.cos(omega * simTime);
  const currentY = c * currentX * currentX;

  // Velocity: v = dx/dt
  const currentV =
    -maxX *
    Math.exp(-dampingFactor * simTime) *
    (dampingFactor * Math.cos(omega * simTime) + omega * Math.sin(omega * simTime));

  const potentialEnergy = mass * gravity * currentY;
  const kineticEnergy = 0.5 * mass * currentV * currentV;
  const totalEnergy = potentialEnergy + kineticEnergy;
  const maxInitialEnergy = mass * gravity * initialHeight;

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const loop = (now: number) => {
      if (lastTimestampRef.current !== null) {
        const dt = (now - lastTimestampRef.current) / 1000;
        setSimTime((prev) => prev + dt);
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
    setSimTime(0);
    setIsPlaying(true);
  };

  // Render Track & Energy Bar Charts
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

    // Track Geometry
    const centerX = width * 0.42;
    const baseY = height * 0.62;
    const scaleX = 8.5;
    const scaleY = 6.5;

    // 1. Draw Parabolic Potential Energy Track
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const boundX = maxX * 1.35;
    for (let x = -boundX; x <= boundX; x += 0.5) {
      const y = c * x * x;
      const px = centerX + x * scaleX;
      const py = baseY - y * scaleY;
      if (x === -boundX) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Ground fill under track
    ctx.lineTo(centerX + boundX * scaleX, baseY + 20);
    ctx.lineTo(centerX - boundX * scaleX, baseY + 20);
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fill();

    // 2. Rolling Particle Orb
    const orbPx = centerX + currentX * scaleX;
    const orbPy = baseY - currentY * scaleY - 8;

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(orbPx, orbPy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity Vector on Particle
    if (Math.abs(currentV) > 0.5) {
      const vScale = 2.0;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(orbPx, orbPy);
      ctx.lineTo(orbPx + currentV * vScale, orbPy);
      ctx.stroke();
    }

    // 3. Real-Time Energy Bar Charts (Right Section)
    const barX = width - 180;
    const barBaseY = baseY;
    const barMaxH = 150;
    const barW = 32;

    const kNorm = Math.min(1, kineticEnergy / (maxInitialEnergy || 1));
    const pNorm = Math.min(1, potentialEnergy / (maxInitialEnergy || 1));
    const totNorm = Math.min(1, totalEnergy / (maxInitialEnergy || 1));

    // Bar 1: Kinetic Energy (Cyan)
    const kH = kNorm * barMaxH;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(barX, barBaseY - kH, barW, kH);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(barX, barBaseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px sans-serif';
    ctx.fillText('Kinetic (K)', barX - 6, barBaseY + 16);
    ctx.fillText(`${kineticEnergy.toFixed(0)} J`, barX, barBaseY - kH - 4);

    // Bar 2: Potential Energy (Amber)
    const pH = pNorm * barMaxH;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(barX + 48, barBaseY - pH, barW, pH);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(barX + 48, barBaseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Potential (U)', barX + 40, barBaseY + 16);
    ctx.fillText(`${potentialEnergy.toFixed(0)} J`, barX + 48, barBaseY - pH - 4);

    // Bar 3: Total Energy (Green)
    const totH = totNorm * barMaxH;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX + 96, barBaseY - totH, barW, totH);
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(barX + 96, barBaseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Total (E)', barX + 94, barBaseY + 16);
    ctx.fillText(`${totalEnergy.toFixed(0)} J`, barX + 96, barBaseY - totH - 4);

    ctx.restore();
  }, [currentX, currentY, currentV, kineticEnergy, potentialEnergy, totalEnergy, maxInitialEnergy, maxX]);

  return (
    <div className={styles.container} role="region" aria-label="Energy Conservation Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 5 • Mechanical Energy</span>
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

      <div className={styles.mainStage} style={{ minHeight: '430px' }}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div className={styles.telemetryHud}>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Height y(t)</span>
            <span className={styles.telemetryVal}>{currentY.toFixed(1)} m</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Speed |v|</span>
            <span className={styles.telemetryVal}>{Math.abs(currentV).toFixed(1)} m/s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Kinetic Energy (K)</span>
            <span className={styles.telemetryVal}>{kineticEnergy.toFixed(1)} J</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Potential Energy (U)</span>
            <span className={styles.telemetryVal}>{potentialEnergy.toFixed(1)} J</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Total Mechanical (E)</span>
            <span className={styles.telemetryVal} style={{ color: '#10b981' }}>
              {totalEnergy.toFixed(1)} J
            </span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Release Height (h₀)</span>
              <span className={styles.controlVal}>{initialHeight} m</span>
            </div>
            <input
              type="range"
              min="5"
              max="28"
              value={initialHeight}
              onChange={(e) => {
                setInitialHeight(Number(e.target.value));
                handleReset();
              }}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Particle Mass (m)</span>
              <span className={styles.controlVal}>{mass} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={mass}
              onChange={(e) => {
                setMass(Number(e.target.value));
                handleReset();
              }}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Dissipative Friction</span>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8125rem' }}>
              <input
                type="checkbox"
                checked={damping}
                onChange={(e) => {
                  setDamping(e.target.checked);
                  handleReset();
                }}
              />
              <span>Non-Conservative Damping</span>
            </label>
          </div>
        </div>

        <div className={styles.playControlsRow}>
          <div className={styles.playbackButtons}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Icon name={isPlaying ? 'pause' : 'play'} size="sm" />
              {isPlaying ? 'Pause' : 'Oscillate'}
            </button>

            <button type="button" className={styles.btnSecondary} onClick={handleReset}>
              <Icon name="refresh" size="xs" />
              Reset Energy State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
