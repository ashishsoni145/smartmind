import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface RoadBankingSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const RoadBankingSimulation: React.FC<RoadBankingSimulationProps> = ({
  onClose,
  title = 'Road Banking & Centripetal Skid Dynamics',
  topicTitle = 'Laws of Motion (NCERT Chapter 4 • Circular Road Dynamics)',
}) => {
  const [bankingAngleDeg, setBankingAngleDeg] = useState<number>(20); // θ
  const [curveRadius, setCurveRadius] = useState<number>(60); // R in meters
  const [speedKmh, setSpeedKmh] = useState<number>(55); // v in km/h
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.3); // μ

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const g = 9.8; // m/s²

  // Convert speed to m/s
  const speedMs = (speedKmh * 1000) / 3600;
  const angleRad = (bankingAngleDeg * Math.PI) / 180;
  const tanTh = Math.tan(angleRad);

  // Optimum speed (frictionless neutral speed): v0 = sqrt(R * g * tan(θ))
  const optimumSpeedMs = Math.sqrt(curveRadius * g * tanTh);
  const optimumSpeedKmh = (optimumSpeedMs * 3600) / 1000;

  // Maximum safe speed before skidding outward:
  // v_max = sqrt(R * g * (μ + tanθ) / (1 - μ * tanθ))
  let maxSpeedKmh = 999;
  if (1 - frictionCoeff * tanTh > 0) {
    const maxSpeedMs = Math.sqrt((curveRadius * g * (frictionCoeff + tanTh)) / (1 - frictionCoeff * tanTh));
    maxSpeedKmh = (maxSpeedMs * 3600) / 1000;
  }

  // Minimum safe speed before slipping inward (if road is very steep and μ is small)
  let minSpeedKmh = 0;
  if (tanTh > frictionCoeff) {
    const minSpeedMs = Math.sqrt((curveRadius * g * (tanTh - frictionCoeff)) / (1 + frictionCoeff * tanTh));
    minSpeedKmh = (minSpeedMs * 3600) / 1000;
  }

  // Determine dynamic state
  let stabilityStatus = 'SAFE TRACTION ENVELOPE';
  let statusColor = '#10b981';

  if (Math.abs(speedKmh - optimumSpeedKmh) < 2) {
    stabilityStatus = 'OPTIMUM NEUTRAL SPEED (Zero Friction Required)';
    statusColor = '#38bdf8';
  } else if (speedKmh > maxSpeedKmh) {
    stabilityStatus = 'DANGER: SKIDDING OUTWARD (Exceeded Friction Limit)';
    statusColor = '#ef4444';
  } else if (speedKmh < minSpeedKmh) {
    stabilityStatus = 'WARNING: SLIPPING INWARD (Speed too low for banking)';
    statusColor = '#f59e0b';
  }

  // Render 3D/2D cross section
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

    // Cross-sectional banked road wedge
    const originX = 100;
    const originY = height - 90;
    const roadLen = Math.min(360, width - 240);
    const roadElevation = roadLen * Math.sin(angleRad);
    const roadBaseLen = roadLen * Math.cos(angleRad);

    const roadTopX = originX + roadBaseLen;
    const roadTopY = originY - roadElevation;

    // 1. Draw Horizon & Road Surface
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(roadTopX, roadTopY);
    ctx.lineTo(roadTopX, originY);
    ctx.closePath();

    ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Road surface thick line (Asphalt)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(roadTopX, roadTopY);
    ctx.stroke();

    // Angle indicator
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(originX, originY, 40, 0, -angleRad, true);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`θ = ${bankingAngleDeg}°`, originX + 48, originY - 10);

    // 2. Vehicle on Banked Surface
    const carFraction = 0.5;
    const carCX = originX + roadBaseLen * carFraction;
    const carCY = originY - roadElevation * carFraction;

    const vW = 60;
    const vH = 34;

    ctx.save();
    ctx.translate(carCX, carCY);
    ctx.rotate(-angleRad);

    // Vehicle Chassis
    ctx.fillStyle = statusColor;
    ctx.fillRect(-vW / 2, -vH, vW, vH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-vW / 2, -vH, vW, vH);

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-vW / 2 + 6, 0, 14, 6);
    ctx.fillRect(vW / 2 - 20, 0, 14, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(`${speedKmh} km/h`, -18, -vH / 2 + 3);

    // Normal force vector (perpendicular to road surface)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -vH / 2);
    ctx.lineTo(0, -vH / 2 - 50);
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.fillText('N', 6, -vH / 2 - 40);

    ctx.restore();

    // 3. Centrifugal outward drift vs Centripetal Required Force Arrow
    const centripetalAcc = (speedMs * speedMs) / curveRadius;
    const forceArrowLen = Math.min(80, centripetalAcc * 6);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(carCX, carCY - vH / 2);
    ctx.lineTo(carCX + forceArrowLen, carCY - vH / 2);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`F_c = ${(centripetalAcc).toFixed(1)} m/s²`, carCX + forceArrowLen + 6, carCY - vH / 2 + 4);

    // 4. Center of Curvature representation
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText(`Turn Radius R = ${curveRadius}m (Center of curvature ←)`, 80, 50);

    ctx.restore();
  }, [angleRad, bankingAngleDeg, curveRadius, speedKmh, statusColor, speedMs]);

  return (
    <div className={styles.container} role="region" aria-label="Road Banking Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 4 • Banked Curves</span>
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
            <span className={styles.telemetryLabel}>Current Speed</span>
            <span className={styles.telemetryVal}>{speedKmh} km/h</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Optimum Neutral Speed</span>
            <span className={styles.telemetryVal}>{optimumSpeedKmh.toFixed(1)} km/h</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Max Safe Speed (v_max)</span>
            <span className={styles.telemetryVal}>{maxSpeedKmh > 300 ? 'No Upper Limit' : `${maxSpeedKmh.toFixed(1)} km/h`}</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Traction State</span>
            <span className={styles.telemetryVal} style={{ fontSize: '0.75rem', color: statusColor }}>
              {stabilityStatus}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Vehicle Speed (v)</span>
              <span className={styles.controlVal}>{speedKmh} km/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="130"
              value={speedKmh}
              onChange={(e) => setSpeedKmh(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Banking Angle (θ)</span>
              <span className={styles.controlVal}>{bankingAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              value={bankingAngleDeg}
              onChange={(e) => setBankingAngleDeg(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Curve Radius (R)</span>
              <span className={styles.controlVal}>{curveRadius} m</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              value={curveRadius}
              onChange={(e) => setCurveRadius(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Tire-Road Friction (μ)</span>
              <span className={styles.controlVal}>{frictionCoeff.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={frictionCoeff}
              onChange={(e) => setFrictionCoeff(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
