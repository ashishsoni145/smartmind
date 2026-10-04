import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface KeplerOrbitSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const KeplerOrbitSimulation: React.FC<KeplerOrbitSimulationProps> = ({
  onClose,
  title = "3D Keplerian Planetary Orbit & Equal-Area Sweeper",
  topicTitle = 'Gravitation (NCERT Chapter 7 • Section 7.1)',
}) => {
  const [eccentricity, setEccentricity] = useState<number>(0.5); // e
  const [semiMajorAxis, setSemiMajorAxis] = useState<number>(38); // a in AU
  const [starMass, setStarMass] = useState<number>(1.0); // Solar masses
  const [showSweeps, setShowSweeps] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [trueAnomaly, setTrueAnomaly] = useState<number>(0);

  // 3D Camera controls
  const [cameraYaw, setCameraYaw] = useState<number>(40);
  const [cameraPitch, setCameraPitch] = useState<number>(32);
  const [cameraZoom, setCameraZoom] = useState<number>(380);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    yaw: 40,
    pitch: 32,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Orbital parameters
  const e = eccentricity;
  const a = semiMajorAxis;
  const perihelion = a * (1 - e);
  const aphelion = a * (1 + e);
  const b = a * Math.sqrt(Math.max(0.01, 1 - e * e)); // semi-minor axis
  const periodYears = Math.sqrt(Math.pow(a / 38, 3) / starMass) * 4;

  // Orbital distance r at true anomaly θ: r = a(1-e²) / (1 + e*cos(θ))
  const p = a * (1 - e * e);
  const currentR = p / (1 + e * Math.cos(trueAnomaly));

  // Orbital speed from vis-viva equation: v = sqrt(GM * (2/r - 1/a))
  const GM = 800 * starMass;
  const currentSpeed = Math.sqrt(Math.max(1, GM * (2 / currentR - 1 / a)));

  // Animation loop: dθ/dt = h / r² = sqrt(GM * a(1-e²)) / r²
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const h = Math.sqrt(GM * p);
    const loop = (now: number) => {
      if (lastTimestampRef.current !== null) {
        const dt = (now - lastTimestampRef.current) / 1000;
        const dTheta = (h / (currentR * currentR)) * dt * 0.8;
        setTrueAnomaly((prev) => (prev + dTheta) % (2 * Math.PI));
      }
      lastTimestampRef.current = now;
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, currentR, GM, p]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      yaw: cameraYaw,
      pitch: cameraPitch,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setCameraYaw((dragStartRef.current.yaw + deltaX * 0.45) % 360);
    setCameraPitch(Math.max(5, Math.min(85, dragStartRef.current.pitch - deltaY * 0.45)));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCameraZoom((prev) => Math.max(180, Math.min(700, prev + e.deltaY * 0.4)));
    };

    canvas.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  const project3Dto2D = useCallback(
    (x: number, y: number, z: number, originX: number, originY: number, scaleM2U: number) => {
      const wx = x * scaleM2U;
      const wy = y * scaleM2U;
      const wz = z * scaleM2U;

      const yawR = (cameraYaw * Math.PI) / 180;
      const pitchR = (cameraPitch * Math.PI) / 180;

      const cosY = Math.cos(yawR);
      const sinY = Math.sin(yawR);
      const x1 = wx * cosY - wz * sinY;
      const z1 = wx * sinY + wz * cosY;
      const y1 = wy;

      const cosP = Math.cos(pitchR);
      const sinP = Math.sin(pitchR);
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;
      const x2 = x1;

      const fovDistance = cameraZoom;
      const perspectiveScale = fovDistance / (fovDistance + z2 + 300);

      const screenX = originX + x2 * perspectiveScale;
      const screenY = originY - y2 * perspectiveScale;

      return { screenX, screenY, scale: perspectiveScale };
    },
    [cameraYaw, cameraPitch, cameraZoom]
  );

  // Render 3D Canvas
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

    const originX = width / 2;
    const originY = height * 0.55;
    const scaleM2U = Math.min(width, height) / 105;

    // 1. Central Star (at focus (0, 0, 0))
    const pSun = project3Dto2D(0, 0, 0, originX, originY, scaleM2U);
    const sunGrad = ctx.createRadialGradient(pSun.screenX, pSun.screenY, 2, pSun.screenX, pSun.screenY, 14);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#f59e0b');
    sunGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = sunGrad;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(pSun.screenX, pSun.screenY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Complete Ellipse in horizontal X-Z plane
    // Centered at (-a*e, 0, 0)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const th = (i / steps) * 2 * Math.PI;
      const r_i = p / (1 + e * Math.cos(th));
      const ex = r_i * Math.cos(th);
      const ez = r_i * Math.sin(th);
      const pt = project3Dto2D(ex, 0, ez, originX, originY, scaleM2U);
      if (i === 0) ctx.moveTo(pt.screenX, pt.screenY);
      else ctx.lineTo(pt.screenX, pt.screenY);
    }
    ctx.stroke();

    // 3. Kepler's 2nd Law: Equal Area Swept Sector
    if (showSweeps) {
      const sweepDelta = 0.35;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(pSun.screenX, pSun.screenY);
      for (let th = trueAnomaly - sweepDelta; th <= trueAnomaly; th += 0.05) {
        const r_s = p / (1 + e * Math.cos(th));
        const sx = r_s * Math.cos(th);
        const sz = r_s * Math.sin(th);
        const sp = project3Dto2D(sx, 0, sz, originX, originY, scaleM2U);
        ctx.lineTo(sp.screenX, sp.screenY);
      }
      ctx.closePath();
      ctx.fill();
    }

    // 4. Current Planet Position
    const planetX = currentR * Math.cos(trueAnomaly);
    const planetZ = currentR * Math.sin(trueAnomaly);
    const pPlanet = project3Dto2D(planetX, 0, planetZ, originX, originY, scaleM2U);

    // Radial ray from Sun to Planet
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pSun.screenX, pSun.screenY);
    ctx.lineTo(pPlanet.screenX, pPlanet.screenY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Planet Orb
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(pPlanet.screenX, pPlanet.screenY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Perihelion / Aphelion markers
    const pPeri = project3Dto2D(perihelion, 0, 0, originX, originY, scaleM2U);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Perihelion (${perihelion.toFixed(0)} AU)`, pPeri.screenX + 8, pPeri.screenY - 6);

    const pAph = project3Dto2D(-aphelion, 0, 0, originX, originY, scaleM2U);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`Aphelion (${aphelion.toFixed(0)} AU)`, pAph.screenX - 70, pAph.screenY - 6);

    ctx.restore();
  }, [trueAnomaly, eccentricity, semiMajorAxis, starMass, currentR, p, e, perihelion, aphelion, showSweeps, cameraYaw, cameraPitch, cameraZoom, project3Dto2D]);

  return (
    <div className={styles.container} role="region" aria-label="Kepler Orbit Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 7 • Planetary Mechanics</span>
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

      <div className={styles.mainStage}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        <div className={styles.cameraHintBadge}>
          <Icon name="cube" size="xs" />
          <span>
            <strong>3D Celestial View:</strong> Drag to rotate plane • Scroll to zoom
          </span>
        </div>

        <div className={styles.telemetryHud}>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Orbital Distance (r)</span>
            <span className={styles.telemetryVal}>{currentR.toFixed(1)} AU</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Orbital Speed (v)</span>
            <span className={styles.telemetryVal}>{currentSpeed.toFixed(1)} km/s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Eccentricity (e)</span>
            <span className={styles.telemetryVal}>{eccentricity.toFixed(2)}</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Semi-Major Axis (a)</span>
            <span className={styles.telemetryVal}>{semiMajorAxis} AU</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Orbital Period (T)</span>
            <span className={styles.telemetryVal}>{periodYears.toFixed(1)} Earth Yrs</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Orbital Eccentricity (e)</span>
              <span className={styles.controlVal}>{eccentricity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.75"
              step="0.05"
              value={eccentricity}
              onChange={(e) => setEccentricity(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Semi-Major Axis (a)</span>
              <span className={styles.controlVal}>{semiMajorAxis} AU</span>
            </div>
            <input
              type="range"
              min="20"
              max="50"
              value={semiMajorAxis}
              onChange={(e) => setSemiMajorAxis(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Central Star Mass (M)</span>
              <span className={styles.controlVal}>{starMass.toFixed(1)} M☉</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={starMass}
              onChange={(e) => setStarMass(Number(e.target.value))}
              className={styles.slider}
            />
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
              {isPlaying ? 'Pause' : 'Orbit'}
            </button>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8125rem', marginLeft: '0.75rem' }}>
              <input
                type="checkbox"
                checked={showSweeps}
                onChange={(e) => setShowSweeps(e.target.checked)}
              />
              <span>Demonstrate Kepler 2nd Law (Equal Area Sweep)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
