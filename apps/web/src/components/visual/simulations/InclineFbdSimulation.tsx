import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface InclineFbdSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const InclineFbdSimulation: React.FC<InclineFbdSimulationProps> = ({
  onClose,
  title = 'Inclined Plane & Atwood Free Body Diagram Solver',
  topicTitle = 'Laws of Motion (NCERT Chapter 4 • Section 4.6)',
}) => {
  const [angleDeg, setAngleDeg] = useState<number>(30); // Incline angle
  const [mass1, setMass1] = useState<number>(8); // Incline block mass (kg)
  const [mass2, setMass2] = useState<number>(6); // Hanging mass (kg)
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.25); // Friction μ
  const [showVectors, setShowVectors] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const g = 9.8; // m/s²

  // Physics calculation
  const angleRad = (angleDeg * Math.PI) / 180;
  const sinTh = Math.sin(angleRad);
  const cosTh = Math.cos(angleRad);

  const normalForce = mass1 * g * cosTh; // N = m1 * g * cos(θ)
  const parallelGravity = mass1 * g * sinTh; // F_parallel = m1 * g * sin(θ)
  const maxFriction = frictionCoeff * normalForce; // f_max = μ * N
  const hangingWeight = mass2 * g; // m2 * g

  // Determine motion direction and acceleration
  // Drive force = m2 * g - m1 * g * sin(θ)
  const drivingForce = hangingWeight - parallelGravity;
  let frictionForce = 0;
  let netAcceleration = 0;
  let motionState = 'Equilibrium (Static Friction)';

  if (Math.abs(drivingForce) <= maxFriction) {
    // Static equilibrium
    frictionForce = -drivingForce;
    netAcceleration = 0;
    motionState = 'Static Equilibrium (Locked)';
  } else if (drivingForce > maxFriction) {
    // Accelerates upward along incline (hanging mass pulls it)
    frictionForce = -maxFriction;
    netAcceleration = (drivingForce - maxFriction) / (mass1 + mass2);
    motionState = 'Accelerating Upward (+a)';
  } else {
    // Accelerates downward along incline (slides down)
    frictionForce = maxFriction;
    netAcceleration = (drivingForce + maxFriction) / (mass1 + mass2);
    motionState = 'Sliding Downward (-a)';
  }

  // Tension in cable
  const cableTension = mass2 * (g - netAcceleration);

  // Render 2D schematic diagram with vectors
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

    // Coordinate geometry for inclined wedge
    const wedgeBaseX = 90;
    const wedgeBaseY = height - 90;
    const wedgeLen = Math.min(380, width - 260);
    const wedgeHeight = wedgeLen * Math.tan(angleRad);
    const apexX = wedgeBaseX + wedgeLen;
    const apexY = wedgeBaseY - wedgeHeight;

    // 1. Draw Wedge
    ctx.beginPath();
    ctx.moveTo(wedgeBaseX, wedgeBaseY);
    ctx.lineTo(apexX, wedgeBaseY);
    ctx.lineTo(apexX, apexY);
    ctx.closePath();

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Incline angle arc & label
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(wedgeBaseX, wedgeBaseY, 35, 0, -angleRad, true);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px monospace';
    ctx.fillText(`θ = ${angleDeg}°`, wedgeBaseX + 44, wedgeBaseY - 10);

    // 2. Apex Pulley
    const pulleyRadius = 14;
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(apexX, apexY - pulleyRadius, pulleyRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // 3. Block m1 on Incline Surface
    const blockFraction = 0.55; // halfway along incline
    const blockCX = wedgeBaseX + wedgeLen * blockFraction;
    const blockCY = wedgeBaseY - wedgeHeight * blockFraction;

    const bW = 50;
    const bH = 34;

    ctx.save();
    ctx.translate(blockCX, blockCY);
    ctx.rotate(-angleRad);

    // Block Body
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-bW / 2, -bH, bW, bH);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(-bW / 2, -bH, bW, bH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`m₁ (${mass1}kg)`, -bW / 2 + 6, -bH / 2 + 4);

    // Normal force vector N (pointing upward perpendicular)
    if (showVectors) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -bH / 2);
      ctx.lineTo(0, -bH / 2 - 50);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.fillText(`N = ${normalForce.toFixed(0)}N`, 6, -bH / 2 - 40);

      // Tension vector T (pointing up the incline to the right)
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(bW / 2, -bH / 2);
      ctx.lineTo(bW / 2 + 45, -bH / 2);
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.fillText(`T = ${cableTension.toFixed(0)}N`, bW / 2 + 10, -bH / 2 - 6);

      // Parallel gravity m1*g*sin(θ) (pointing down incline to the left)
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-bW / 2, -bH / 2);
      ctx.lineTo(-bW / 2 - 45, -bH / 2);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`m₁g·sinθ`, -bW / 2 - 55, -bH / 2 - 6);
    }

    ctx.restore();

    // 4. Weight vector m1*g (pointing straight down in world coordinates)
    if (showVectors) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(blockCX, blockCY - bH / 2);
      ctx.lineTo(blockCX, blockCY - bH / 2 + 55);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px sans-serif';
      ctx.fillText(`W = ${(mass1 * g).toFixed(0)}N`, blockCX + 6, blockCY - bH / 2 + 45);
    }

    // 5. Cable from Block m1 over pulley to hanging Mass m2
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(blockCX, blockCY - bH / 2);
    ctx.lineTo(apexX, apexY - pulleyRadius);
    ctx.lineTo(apexX + pulleyRadius, apexY - pulleyRadius);
    const hangY = apexY + 70;
    ctx.lineTo(apexX + pulleyRadius, hangY);
    ctx.stroke();

    // Hanging Mass m2
    const hW = 40;
    const hH = 34;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(apexX + pulleyRadius - hW / 2, hangY, hW, hH);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(apexX + pulleyRadius - hW / 2, hangY, hW, hH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`m₂`, apexX + pulleyRadius - 10, hangY + 20);

    // Vector downward for hanging mass
    if (showVectors) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(apexX + pulleyRadius, hangY + hH);
      ctx.lineTo(apexX + pulleyRadius, hangY + hH + 35);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px sans-serif';
      ctx.fillText(`m₂g = ${hangingWeight.toFixed(0)}N`, apexX + pulleyRadius + 6, hangY + hH + 28);
    }

    ctx.restore();
  }, [angleRad, angleDeg, mass1, mass2, normalForce, cableTension, hangingWeight, showVectors]);

  return (
    <div className={styles.container} role="region" aria-label="Inclined Plane FBD Solver">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Section 4.6 • Free Body Diagrams</span>
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
            <span className={styles.telemetryLabel}>Incline Angle (θ)</span>
            <span className={styles.telemetryVal}>{angleDeg}°</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Normal Force (N)</span>
            <span className={styles.telemetryVal}>{normalForce.toFixed(1)} N</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Cable Tension (T)</span>
            <span className={styles.telemetryVal}>{cableTension.toFixed(1)} N</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Acceleration (a)</span>
            <span className={styles.telemetryVal}>{netAcceleration.toFixed(2)} m/s²</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Motion Dynamic State</span>
            <span className={styles.telemetryVal} style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              {motionState}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Incline Angle (θ)</span>
              <span className={styles.controlVal}>{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="65"
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Block Mass m₁</span>
              <span className={styles.controlVal}>{mass1} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={mass1}
              onChange={(e) => setMass1(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Hanging Mass m₂</span>
              <span className={styles.controlVal}>{mass2} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={mass2}
              onChange={(e) => setMass2(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Friction Coeff (μ)</span>
              <span className={styles.controlVal}>{frictionCoeff.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={frictionCoeff}
              onChange={(e) => setFrictionCoeff(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.playControlsRow}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={showVectors}
              onChange={(e) => setShowVectors(e.target.checked)}
            />
            <span>Show Orthogonal Free Body Force Vectors</span>
          </label>
        </div>
      </div>
    </div>
  );
};
