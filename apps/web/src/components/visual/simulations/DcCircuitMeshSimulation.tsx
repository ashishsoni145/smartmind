import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface DcCircuitMeshSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const DcCircuitMeshSimulation: React.FC<DcCircuitMeshSimulationProps> = ({
  onClose,
  title = "Interactive DC Circuit Mesh & Kirchhoff's Laws",
  topicTitle = 'Current Electricity (NCERT Chapter 3 • Section 3.4)',
}) => {
  const [voltage, setVoltage] = useState<number>(12); // Volts
  const [r1, setR1] = useState<number>(30); // Ohms (Series)
  const [r2, setR2] = useState<number>(60); // Ohms (Parallel 1)
  const [r3, setR3] = useState<number>(40); // Ohms (Parallel 2)
  const [animOffset, setAnimOffset] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Circuit physics calculations
  // R2 and R3 are in parallel: R23 = (R2 * R3) / (R2 + R3)
  const rParallel = (r2 * r3) / (r2 + r3);
  const rTotal = r1 + rParallel;
  const iTotal = voltage / rTotal; // Main loop current
  const vParallel = iTotal * rParallel;
  const i2 = vParallel / r2; // Branch 2 current
  const i3 = vParallel / r3; // Branch 3 current
  const totalPower = voltage * iTotal; // Watts

  // Animation loop for current flow electrons
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setAnimOffset((prev) => (prev + iTotal * 2.5) % 24);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [iTotal]);

  // Render circuit diagram
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

    // Circuit schematic coordinates
    const leftX = 90;
    const rightX = width - 110;
    const topY = 70;
    const bottomY = height - 90;
    const midX = (leftX + rightX) * 0.45;
    const parallelBranch1Y = topY - 35;
    const parallelBranch2Y = topY + 35;

    // 1. Wires (Dark sleek circuit board traces)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;

    // Main left loop from bottom up through battery
    ctx.beginPath();
    ctx.moveTo(leftX, bottomY);
    ctx.lineTo(leftX, topY);
    ctx.lineTo(midX - 50, topY);
    ctx.stroke();

    // R1 resistor location (top between leftX and midX)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(midX - 45, topY - 12, 40, 24);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(midX - 45, topY - 12, 40, 24);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`R₁ ${r1}Ω`, midX - 40, topY + 4);

    // Junction A (node split)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(midX + 10, topY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Node A', midX - 6, topY - 10);

    // Branch 1 (R2 upper)
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(midX + 10, topY);
    ctx.lineTo(midX + 10, parallelBranch1Y);
    ctx.lineTo(rightX - 30, parallelBranch1Y);
    ctx.lineTo(rightX - 30, topY);
    ctx.stroke();

    // R2 box
    const r2cx = (midX + 10 + rightX - 30) / 2;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(r2cx - 24, parallelBranch1Y - 12, 48, 24);
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(r2cx - 24, parallelBranch1Y - 12, 48, 24);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`R₂ ${r2}Ω`, r2cx - 18, parallelBranch1Y + 4);

    // Branch 2 (R3 lower)
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(midX + 10, topY);
    ctx.lineTo(midX + 10, parallelBranch2Y);
    ctx.lineTo(rightX - 30, parallelBranch2Y);
    ctx.lineTo(rightX - 30, topY);
    ctx.stroke();

    // R3 box
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(r2cx - 24, parallelBranch2Y - 12, 48, 24);
    ctx.strokeStyle = '#a855f7';
    ctx.strokeRect(r2cx - 24, parallelBranch2Y - 12, 48, 24);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`R₃ ${r3}Ω`, r2cx - 18, parallelBranch2Y + 4);

    // Junction B (node recombine)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(rightX - 30, topY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Node B', rightX - 44, topY - 10);

    // Right and bottom return wire
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(rightX - 30, topY);
    ctx.lineTo(rightX, topY);
    ctx.lineTo(rightX, bottomY);
    ctx.lineTo(leftX, bottomY);
    ctx.stroke();

    // DC Battery on left wire
    const batY = (topY + bottomY) / 2;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(leftX - 25, batY - 25, 50, 50);

    // Long line (+), short thick line (-)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftX - 16, batY - 8);
    ctx.lineTo(leftX + 16, batY - 8);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(leftX - 8, batY + 8);
    ctx.lineTo(leftX + 8, batY + 8);
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('+', leftX + 22, batY - 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('-', leftX + 22, batY + 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${voltage}V DC`, leftX - 60, batY + 4);

    // Current arrows and values
    ctx.fillStyle = '#eab308';
    ctx.font = '11px monospace';
    ctx.fillText(`I_total = ${iTotal.toFixed(2)} A →`, midX - 45, topY - 22);
    ctx.fillText(`I₂ = ${i2.toFixed(2)} A →`, r2cx - 15, parallelBranch1Y - 18);
    ctx.fillText(`I₃ = ${i3.toFixed(2)} A →`, r2cx - 15, parallelBranch2Y + 26);
    ctx.fillText(`← I_total = ${iTotal.toFixed(2)} A`, (leftX + rightX) / 2 - 40, bottomY + 20);

    // 2. Animated Flow Particles along wires
    ctx.fillStyle = '#38bdf8';
    for (let x = leftX + 20; x < rightX; x += 24) {
      const px = ((x + animOffset) % (rightX - leftX)) + leftX;
      ctx.beginPath();
      ctx.arc(px, bottomY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, [voltage, r1, r2, r3, iTotal, i2, i3, animOffset]);

  return (
    <div className={styles.container} role="region" aria-label="DC Circuit Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 3 • Kirchhoff Analysis</span>
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
            <span className={styles.telemetryLabel}>Source Emf (V)</span>
            <span className={styles.telemetryVal}>{voltage} V</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Total Equivalent Req</span>
            <span className={styles.telemetryVal}>{rTotal.toFixed(1)} Ω</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Main Current (I_tot)</span>
            <span className={styles.telemetryVal}>{iTotal.toFixed(2)} A</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Branch 1 (I₂)</span>
            <span className={styles.telemetryVal}>{i2.toFixed(2)} A</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Branch 2 (I₃)</span>
            <span className={styles.telemetryVal}>{i3.toFixed(2)} A</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Total Power (P)</span>
            <span className={styles.telemetryVal}>{totalPower.toFixed(1)} W</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Supply Voltage (V)</span>
              <span className={styles.controlVal}>{voltage} V</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Series Resistor R₁</span>
              <span className={styles.controlVal}>{r1} Ω</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={r1}
              onChange={(e) => setR1(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Parallel Branch R₂</span>
              <span className={styles.controlVal}>{r2} Ω</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={r2}
              onChange={(e) => setR2(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Parallel Branch R₃</span>
              <span className={styles.controlVal}>{r3} Ω</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={r3}
              onChange={(e) => setR3(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
