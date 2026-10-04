import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface DoubleSlitInterferenceSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const DoubleSlitInterferenceSimulation: React.FC<DoubleSlitInterferenceSimulationProps> = ({
  onClose,
  title = "Young's Double Slit Wave Interference Simulator",
  topicTitle = 'Wave Optics (NCERT Chapter 10 • Section 10.3)',
}) => {
  const [wavelengthNm, setWavelengthNm] = useState<number>(550); // green light nm
  const [slitSepMm, setSlitSepMm] = useState<number>(0.25); // d in mm
  const [screenDistM, setScreenDistM] = useState<number>(1.2); // D in m
  const [wavePhase, setWavePhase] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fringe width formula: β = (λ * D) / d
  const lambdaM = wavelengthNm * 1e-9;
  const dM = slitSepMm * 1e-3;
  const fringeWidthMm = ((lambdaM * screenDistM) / dM) * 1000;

  // Convert wavelength in nm to hex color
  const getSpectralColor = (nm: number) => {
    if (nm < 440) return '#818cf8'; // violet
    if (nm < 490) return '#38bdf8'; // blue
    if (nm < 560) return '#10b981'; // green
    if (nm < 590) return '#eab308'; // yellow
    if (nm < 630) return '#f97316'; // orange
    return '#ef4444'; // red
  };
  const waveColor = getSpectralColor(wavelengthNm);

  // Wave ripple animation
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setWavePhase((prev) => (prev + 0.15) % (2 * Math.PI));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Render wave ripple tank + fringe intensity screen
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

    const barrierX = 80;
    const screenX = width - 110;
    const cy = height / 2;
    const slitHalfDist = Math.min(60, slitSepMm * 120);

    const s1 = { x: barrierX, y: cy - slitHalfDist };
    const s2 = { x: barrierX, y: cy + slitHalfDist };

    // 1. Dual-slit opaque barrier
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(barrierX - 8, 0, 16, s1.y - 8);
    ctx.fillRect(barrierX - 8, s1.y + 8, 16, s2.y - s1.y - 16);
    ctx.fillRect(barrierX - 8, s2.y + 8, 16, height - s2.y);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(barrierX - 8, 0, 16, s1.y - 8);
    ctx.strokeRect(barrierX - 8, s1.y + 8, 16, s2.y - s1.y - 16);
    ctx.strokeRect(barrierX - 8, s2.y + 8, 16, height - s2.y);

    // Slit labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.fillText('S₁', barrierX - 25, s1.y + 4);
    ctx.fillText('S₂', barrierX - 25, s2.y + 4);

    // 2. Concentric Wavefronts from Slits S1 and S2
    const waveK = (2 * Math.PI) / (wavelengthNm * 0.04);
    ctx.lineWidth = 1.2;

    for (let r = 10; r < screenX - barrierX; r += 16) {
      const alpha = Math.max(0.05, 0.45 - r / 500);

      // S1 Wavefront
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s1.x, s1.y, r + (wavePhase / (2 * Math.PI)) * 16, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // S2 Wavefront
      ctx.beginPath();
      ctx.arc(s2.x, s2.y, r + (wavePhase / (2 * Math.PI)) * 16, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }

    // 3. Central Axis Line
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.beginPath();
    ctx.moveTo(barrierX, cy);
    ctx.lineTo(screenX, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Detector Screen & Interference Fringes
    // Screen bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX, 20, 50, height - 40);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(screenX, 20, 50, height - 40);

    // Fringe Intensity pattern: I = 4 * I0 * cos²(π * d * y / (λ * D))
    const screenH = height - 40;
    const betaPixels = Math.max(12, fringeWidthMm * 8);

    for (let y = 20; y < height - 20; y += 2) {
      const dy = y - cy;
      const phaseDiff = (2 * Math.PI * dy) / betaPixels;
      const intensity = Math.pow(Math.cos(phaseDiff / 2), 2); // 0 to 1

      ctx.fillStyle = waveColor;
      ctx.globalAlpha = intensity * 0.9;
      ctx.fillRect(screenX + 2, y, 46, 2);
    }
    ctx.globalAlpha = 1.0;

    // Central Bright Fringe label
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.fillText('Central Max (n=0)', screenX - 105, cy + 4);

    ctx.restore();
  }, [wavelengthNm, slitSepMm, screenDistM, wavePhase, waveColor, fringeWidthMm]);

  return (
    <div className={styles.container} role="region" aria-label="Young Double Slit Interference Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 10 • Wave Optics</span>
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
            <span className={styles.telemetryLabel}>Wavelength (λ)</span>
            <span className={styles.telemetryVal} style={{ color: waveColor }}>
              {wavelengthNm} nm
            </span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Fringe Width (β)</span>
            <span className={styles.telemetryVal}>{fringeWidthMm.toFixed(2)} mm</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Slit Separation (d)</span>
            <span className={styles.telemetryVal}>{slitSepMm.toFixed(2)} mm</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Screen Distance (D)</span>
            <span className={styles.telemetryVal}>{screenDistM.toFixed(1)} m</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Wavelength (λ)</span>
              <span className={styles.controlVal} style={{ color: waveColor }}>
                {wavelengthNm} nm
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="700"
              step="10"
              value={wavelengthNm}
              onChange={(e) => setWavelengthNm(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Slit Separation (d)</span>
              <span className={styles.controlVal}>{slitSepMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={slitSepMm}
              onChange={(e) => setSlitSepMm(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Screen Distance (D)</span>
              <span className={styles.controlVal}>{screenDistM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={screenDistM}
              onChange={(e) => setScreenDistM(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
