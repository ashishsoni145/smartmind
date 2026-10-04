import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface PointChargeFieldSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const PointChargeFieldSimulation: React.FC<PointChargeFieldSimulationProps> = ({
  onClose,
  title = '3D Electrostatic Field & Equipotential Sandbox',
  topicTitle = 'Electric Charges and Fields (NCERT Chapter 1 • Section 1.4)',
}) => {
  const [q1, setQ1] = useState<number>(3); // microcoulombs
  const [q2, setQ2] = useState<number>(-3); // microcoulombs
  const [distance, setDistance] = useState<number>(60); // mm
  const [showEquipotentials, setShowEquipotentials] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Constants
  const k = 8.99e9; // N m² / C²

  // Midpoint values
  const dMeters = (distance / 1000);
  const rHalf = dMeters / 2;
  const q1C = q1 * 1e-6;
  const q2C = q2 * 1e-6;

  // Potential at midpoint V = k * q1 / r + k * q2 / r
  const midPotential = (k * q1C) / rHalf + (k * q2C) / rHalf;

  // Field at midpoint (along the axis)
  // E_net = k * q1 / r² - k * q2 / r² (taking positive towards q2)
  const midField = Math.abs((k * q1C) / (rHalf * rHalf) - (k * q2C) / (rHalf * rHalf));

  // Dipole moment if equal and opposite
  const dipoleMoment = Math.abs(q1) === Math.abs(q2) && q1 * q2 < 0 ? Math.abs(q1C) * dMeters : null;

  // Render 2D vector field & lines
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

    const cx = width / 2;
    const cy = height / 2;
    const halfD = (distance * 2.5); // pixel scale

    const pos1 = { x: cx - halfD, y: cy };
    const pos2 = { x: cx + halfD, y: cy };

    // 1. Draw Equipotential Contour Rings
    if (showEquipotentials) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      for (let r = 18; r <= 140; r += 16) {
        ctx.beginPath();
        ctx.arc(pos1.x, pos1.y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pos2.x, pos2.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 2. Draw Electric Field Vectors Grid
    const step = 28;
    for (let x = 40; x < width - 40; x += step) {
      for (let y = 30; y < height - 30; y += step) {
        const r1x = x - pos1.x;
        const r1y = y - pos1.y;
        const d1 = Math.sqrt(r1x * r1x + r1y * r1y);

        const r2x = x - pos2.x;
        const r2y = y - pos2.y;
        const d2 = Math.sqrt(r2x * r2x + r2y * r2y);

        if (d1 < 20 || d2 < 20) continue;

        // E = k * q / d²
        const e1 = (q1 / (d1 * d1)) * 450;
        const e2 = (q2 / (d2 * d2)) * 450;

        const ex = e1 * (r1x / d1) + e2 * (r2x / d2);
        const ey = e1 * (r1y / d1) + e2 * (r2y / d2);
        const eMag = Math.sqrt(ex * ex + ey * ey);

        if (eMag > 0.05) {
          const arrowLen = Math.min(18, eMag * 1.5);
          const nx = (ex / eMag) * arrowLen;
          const ny = (ey / eMag) * arrowLen;

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + nx, y + ny);
          ctx.stroke();
        }
      }
    }

    // 3. Charge 1 Node
    const col1 = q1 >= 0 ? '#ef4444' : '#38bdf8';
    ctx.fillStyle = col1;
    ctx.shadowColor = col1;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(pos1.x, pos1.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(q1 >= 0 ? `+${q1}μC` : `${q1}μC`, pos1.x - 16, pos1.y + 4);

    // 4. Charge 2 Node
    const col2 = q2 >= 0 ? '#ef4444' : '#38bdf8';
    ctx.fillStyle = col2;
    ctx.shadowColor = col2;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(pos2.x, pos2.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(q2 >= 0 ? `+${q2}μC` : `${q2}μC`, pos2.x - 16, pos2.y + 4);

    // 5. Midpoint Marker
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Midpoint', cx - 22, cy + 18);

    ctx.restore();
  }, [q1, q2, distance, showEquipotentials]);

  return (
    <div className={styles.container} role="region" aria-label="Point Charge Field Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 1 • Electrostatics</span>
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
            <span className={styles.telemetryLabel}>Midpoint Potential</span>
            <span className={styles.telemetryVal}>{(midPotential / 1000).toFixed(1)} kV</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Midpoint E-Field</span>
            <span className={styles.telemetryVal}>{(midField / 1e6).toFixed(1)} MV/m</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Separation (d)</span>
            <span className={styles.telemetryVal}>{distance} mm</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Dipole Moment (p)</span>
            <span className={styles.telemetryVal}>
              {dipoleMoment !== null ? `${(dipoleMoment * 1e9).toFixed(1)} nC·m` : 'Asymmetric'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Charge q₁</span>
              <span className={styles.controlVal}>{q1 > 0 ? `+${q1}` : q1} μC</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={q1}
              onChange={(e) => setQ1(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Charge q₂</span>
              <span className={styles.controlVal}>{q2 > 0 ? `+${q2}` : q2} μC</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="1"
              value={q2}
              onChange={(e) => setQ2(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Separation Distance</span>
              <span className={styles.controlVal}>{distance} mm</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.playControlsRow}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={showEquipotentials}
              onChange={(e) => setShowEquipotentials(e.target.checked)}
            />
            <span>Show Equipotential Surfaces (V = const)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
