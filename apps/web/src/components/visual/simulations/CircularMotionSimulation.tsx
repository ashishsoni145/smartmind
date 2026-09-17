import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface CircularMotionSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const CircularMotionSimulation: React.FC<CircularMotionSimulationProps> = ({
  onClose,
  title = '3D Uniform Circular Motion & Centripetal Vectors',
  topicTitle = 'Motion in a Plane (NCERT Chapter 3 • Section 3.8)',
}) => {
  const [radius, setRadius] = useState<number>(30); // meters
  const [omega, setOmega] = useState<number>(2.5); // rad/s
  const [mass, setMass] = useState<number>(2); // kg
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angleRad, setAngleRad] = useState<number>(0);

  // 3D Camera Controls
  const [cameraYaw, setCameraYaw] = useState<number>(35);
  const [cameraPitch, setCameraPitch] = useState<number>(30);
  const [cameraZoom, setCameraZoom] = useState<number>(350);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    yaw: 35,
    pitch: 30,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Derived kinematic values
  const linearSpeed = omega * radius; // v = ω * r
  const centripetalAcc = omega * omega * radius; // a_c = ω² * r
  const period = (2 * Math.PI) / (omega || 0.001); // T = 2π/ω
  const centripetalForce = mass * centripetalAcc; // F_c = m * a_c

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const loop = (now: number) => {
      if (lastTimestampRef.current !== null) {
        const dt = (now - lastTimestampRef.current) / 1000;
        setAngleRad((prev) => (prev + omega * dt) % (2 * Math.PI));
      }
      lastTimestampRef.current = now;
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, omega]);

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

    const newYaw = (dragStartRef.current.yaw + deltaX * 0.45) % 360;
    const newPitch = Math.max(5, Math.min(85, dragStartRef.current.pitch - deltaY * 0.45));

    setCameraYaw(newYaw);
    setCameraPitch(newPitch);
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
      setCameraZoom((prev) => Math.max(180, Math.min(650, prev + e.deltaY * 0.4)));
    };

    canvas.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  // 3D projection
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

  // Render 3D Circular Orbit Stage
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
    const scaleM2U = Math.min(width, height) / 110;

    // 1. Draw 3D Ground Grid (Y = 0)
    ctx.lineWidth = 1;
    const gridSize = 70;
    const gridStep = 15;
    for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
      const pStart = project3Dto2D(gx, 0, -gridSize, originX, originY, scaleM2U);
      const pEnd = project3Dto2D(gx, 0, gridSize, originX, originY, scaleM2U);
      ctx.strokeStyle = gx === 0 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(30, 41, 59, 0.4)';
      ctx.beginPath();
      ctx.moveTo(pStart.screenX, pStart.screenY);
      ctx.lineTo(pEnd.screenX, pEnd.screenY);
      ctx.stroke();
    }
    for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
      const pStart = project3Dto2D(-gridSize, 0, gz, originX, originY, scaleM2U);
      const pEnd = project3Dto2D(gridSize, 0, gz, originX, originY, scaleM2U);
      ctx.strokeStyle = gz === 0 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(30, 41, 59, 0.4)';
      ctx.beginPath();
      ctx.moveTo(pStart.screenX, pStart.screenY);
      ctx.lineTo(pEnd.screenX, pEnd.screenY);
      ctx.stroke();
    }

    // 2. Circular Orbit Path (radius R in X-Z plane)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const steps = 72;
    for (let i = 0; i <= steps; i++) {
      const th = (i / steps) * 2 * Math.PI;
      const ox = radius * Math.cos(th);
      const oz = radius * Math.sin(th);
      const p = project3Dto2D(ox, 0, oz, originX, originY, scaleM2U);
      if (i === 0) ctx.moveTo(p.screenX, p.screenY);
      else ctx.lineTo(p.screenX, p.screenY);
    }
    ctx.stroke();

    // 3. Center Origin Peg (0,0,0)
    const pCenter = project3Dto2D(0, 0, 0, originX, originY, scaleM2U);
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(pCenter.screenX, pCenter.screenY, 4, 0, Math.PI * 2);
    ctx.fill();

    // 4. Current Particle Position
    const px = radius * Math.cos(angleRad);
    const pz = radius * Math.sin(angleRad);
    const pCur = project3Dto2D(px, 0, pz, originX, originY, scaleM2U);

    // Radial String / Spoke from center to particle
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(pCenter.screenX, pCenter.screenY);
    ctx.lineTo(pCur.screenX, pCur.screenY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Centripetal Acceleration Vector a_c (Points Inward to Center, Cyan)
    const acScale = 0.4;
    const acDirX = -Math.cos(angleRad);
    const acDirZ = -Math.sin(angleRad);
    const acMag = Math.min(25, centripetalAcc * acScale);
    const pAcEnd = project3Dto2D(
      px + acDirX * acMag,
      0,
      pz + acDirZ * acMag,
      originX,
      originY,
      scaleM2U
    );

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pCur.screenX, pCur.screenY);
    ctx.lineTo(pAcEnd.screenX, pAcEnd.screenY);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText(`a_c = ${centripetalAcc.toFixed(1)} m/s²`, pAcEnd.screenX + 6, pAcEnd.screenY);

    // 6. Tangential Velocity Vector v_t (Tangent to circle, Yellow)
    const vtScale = 0.35;
    // Tangent in X-Z plane: (-sin(θ), cos(θ))
    const vtDirX = -Math.sin(angleRad);
    const vtDirZ = Math.cos(angleRad);
    const vtMag = Math.min(25, linearSpeed * vtScale);
    const pVtEnd = project3Dto2D(
      px + vtDirX * vtMag,
      0,
      pz + vtDirZ * vtMag,
      originX,
      originY,
      scaleM2U
    );

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pCur.screenX, pCur.screenY);
    ctx.lineTo(pVtEnd.screenX, pVtEnd.screenY);
    ctx.stroke();

    ctx.fillStyle = '#eab308';
    ctx.fillText(`v = ${linearSpeed.toFixed(1)} m/s`, pVtEnd.screenX + 6, pVtEnd.screenY);

    // 7. Particle Orb
    const orbRadius = Math.max(6, 8 * pCur.scale);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(pCur.screenX, pCur.screenY, orbRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }, [angleRad, radius, omega, centripetalAcc, linearSpeed, cameraYaw, cameraPitch, cameraZoom, project3Dto2D]);

  return (
    <div className={styles.container} role="region" aria-label="Circular Motion Simulator">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Section 3.8 • 3D Radial Dynamics</span>
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
            <strong>3D Orbit:</strong> Click & drag to rotate view • Scroll to zoom
          </span>
        </div>

        <div className={styles.telemetryHud}>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Angular Velocity (ω)</span>
            <span className={styles.telemetryVal}>{omega.toFixed(2)} rad/s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Linear Speed (v)</span>
            <span className={styles.telemetryVal}>{linearSpeed.toFixed(1)} m/s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Centripetal Acc (a_c)</span>
            <span className={styles.telemetryVal}>{centripetalAcc.toFixed(1)} m/s²</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Time Period (T)</span>
            <span className={styles.telemetryVal}>{period.toFixed(2)} s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Centripetal Force (F_c)</span>
            <span className={styles.telemetryVal}>{centripetalForce.toFixed(1)} N</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Track Radius (R)</span>
              <span className={styles.controlVal}>{radius} m</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Angular Speed (ω)</span>
              <span className={styles.controlVal}>{omega.toFixed(1)} rad/s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.1"
              value={omega}
              onChange={(e) => setOmega(Number(e.target.value))}
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
              onChange={(e) => setMass(Number(e.target.value))}
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
              {isPlaying ? 'Pause' : 'Resume'}
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setAngleRad(0);
                setIsPlaying(true);
              }}
            >
              <Icon name="refresh" size="xs" />
              Reset Angle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
