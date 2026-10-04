import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface BohrAtomSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const BohrAtomSimulation: React.FC<BohrAtomSimulationProps> = ({
  onClose,
  title = '3D Bohr Atomic Model & Quantum Photon Transitions',
  topicTitle = 'Atoms (NCERT Chapter 12 • Section 12.3)',
}) => {
  const [currentN, setCurrentN] = useState<number>(3); // Initial level
  const [targetN, setTargetN] = useState<number>(2); // Target level
  const [electronAngle, setElectronAngle] = useState<number>(0);
  const [photonEmit, setPhotonEmit] = useState<{ active: boolean; wavelength: number; color: string; dist: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Energy levels for hydrogen: E_n = -13.6 / n² eV
  const eInitial = -13.6 / (currentN * currentN);
  const eTarget = -13.6 / (targetN * targetN);
  const deltaE = Math.abs(eInitial - eTarget); // in eV

  // Photon wavelength: λ = hc / ΔE = 1240 / ΔE (in nm)
  const wavelengthNm = deltaE > 0 ? 1240 / deltaE : 0;

  // Spectral Series Identification
  const nf = Math.min(currentN, targetN);
  let seriesName = 'Ground State';
  if (deltaE > 0) {
    if (nf === 1) seriesName = 'Lyman Series (Ultraviolet)';
    else if (nf === 2) seriesName = 'Balmer Series (Visible Spectrum)';
    else if (nf === 3) seriesName = 'Paschen Series (Infrared)';
    else if (nf === 4) seriesName = 'Brackett Series (Far Infrared)';
  }

  // Color mapping
  const getPhotonColor = (nm: number) => {
    if (nm < 380) return '#c084fc'; // UV
    if (nm <= 440) return '#818cf8'; // Violet (e.g. 410 nm)
    if (nm <= 490) return '#38bdf8'; // Blue (e.g. 434 nm, 486 nm)
    if (nm <= 580) return '#10b981'; // Green
    if (nm <= 680) return '#ef4444'; // Red (e.g. 656 nm H-alpha)
    return '#f43f5e'; // Infrared
  };
  const photonColor = getPhotonColor(wavelengthNm);

  // Electron orbit animation
  useEffect(() => {
    let animId: number;
    const loop = () => {
      // Angular speed decreases with higher n: ω ∝ 1/n³
      const speed = 2.5 / (currentN * 0.8);
      setElectronAngle((prev) => (prev + speed * 0.02) % (2 * Math.PI));

      // Animate emitted photon expanding outward
      setPhotonEmit((prev) => {
        if (!prev || !prev.active) return prev;
        if (prev.dist > 220) return null;
        return { ...prev, dist: prev.dist + 3.5 };
      });

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentN]);

  // Execute transition
  const triggerTransition = (newLevel: number) => {
    if (newLevel === currentN) return;
    const prevLevel = currentN;
    const transDeltaE = Math.abs(-13.6 / (prevLevel * prevLevel) - -13.6 / (newLevel * newLevel));
    const transWavelength = 1240 / transDeltaE;

    // If dropping down, emit photon
    if (newLevel < prevLevel) {
      setPhotonEmit({
        active: true,
        wavelength: transWavelength,
        color: getPhotonColor(transWavelength),
        dist: 20,
      });
    }

    setTargetN(newLevel);
    setCurrentN(newLevel);
  };

  // Radius for level n: r_n = 28 + n * 24 pixels
  const getRadiusForN = (n: number) => 28 + n * 24;

  // Render Bohr Atom
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

    // 1. Concentric Quantum Energy Orbits (n = 1 to 5)
    for (let n = 1; n <= 5; n++) {
      const r_n = getRadiusForN(n);
      const isCurrent = n === currentN;

      ctx.strokeStyle = isCurrent ? '#38bdf8' : 'rgba(51, 65, 85, 0.5)';
      ctx.lineWidth = isCurrent ? 2 : 1;
      ctx.setLineDash(isCurrent ? [] : [3, 4]);

      ctx.beginPath();
      ctx.arc(cx, cy, r_n, 0, Math.PI * 2);
      ctx.stroke();

      // Label on orbit
      ctx.fillStyle = isCurrent ? '#38bdf8' : '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`n=${n}`, cx + r_n - 10, cy - 6);
    }
    ctx.setLineDash([]);

    // 2. Proton Nucleus (+e)
    const nucGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
    nucGrad.addColorStop(0, '#ffffff');
    nucGrad.addColorStop(0.4, '#ef4444');
    nucGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = nucGrad;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('+Ze', cx - 9, cy + 4);

    // 3. Orbiting Electron Particle
    const curR = getRadiusForN(currentN);
    const ex = cx + curR * Math.cos(electronAngle);
    const ey = cy + curR * Math.sin(electronAngle);

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Emitted Photon Wave Packet
    if (photonEmit && photonEmit.active) {
      const pDist = photonEmit.dist;
      const px = cx + pDist * Math.cos(0.8);
      const py = cy - pDist * Math.sin(0.8);

      ctx.strokeStyle = photonEmit.color;
      ctx.shadowColor = photonEmit.color;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.5;

      // Small wavy packet
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = photonEmit.color;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`hν (${photonEmit.wavelength.toFixed(0)} nm)`, px + 8, py - 4);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [currentN, electronAngle, photonEmit]);

  return (
    <div className={styles.container} role="region" aria-label="Bohr Atom Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 12 • Quantum Atomic Model</span>
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
            <span className={styles.telemetryLabel}>Active Orbit (n)</span>
            <span className={styles.telemetryVal}>n = {currentN}</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Bohr Radius (r_n)</span>
            <span className={styles.telemetryVal}>{(0.529 * currentN * currentN).toFixed(2)} Å</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Energy Level (E_n)</span>
            <span className={styles.telemetryVal}>{eInitial.toFixed(2)} eV</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Photon Wavelength</span>
            <span className={styles.telemetryVal} style={{ color: photonColor }}>
              {wavelengthNm > 0 ? `${wavelengthNm.toFixed(1)} nm` : '—'}
            </span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Emission Series</span>
            <span className={styles.telemetryVal} style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
              {seriesName}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 600 }}>
            Trigger Quantum Transition (Click Level):
          </span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={currentN === lvl ? styles.btnPrimary : styles.btnSecondary}
              style={{ padding: '0.375rem 0.875rem' }}
              onClick={() => triggerTransition(lvl)}
            >
              n = {lvl} {lvl === 1 ? '(Ground)' : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
