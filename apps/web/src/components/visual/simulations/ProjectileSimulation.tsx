import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface ProjectileSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

type ViewMode = '3d_void' | '2d_plane';

const GRAVITY_OPTIONS = [
  { label: 'Earth (9.8 m/s²)', value: 9.8 },
  { label: 'Moon (1.62 m/s²)', value: 1.62 },
  { label: 'Mars (3.72 m/s²)', value: 3.72 },
  { label: 'Jupiter (24.79 m/s²)', value: 24.79 },
];

export const ProjectileSimulation: React.FC<ProjectileSimulationProps> = ({
  onClose,
  title = 'Ballistic Projectile Dynamics & Kinematics',
  topicTitle = 'Motion in a Plane (NCERT Chapter 3 • Section 3.7)',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('3d_void');

  // Physical parameters
  const [velocity, setVelocity] = useState<number>(35); // m/s
  const [angleDeg, setAngleDeg] = useState<number>(45); // Launch angle θ
  const [azimuthDeg, setAzimuthDeg] = useState<number>(15); // Lateral deflection φ (for 3D)
  const [gravity, setGravity] = useState<number>(9.8);
  const [airDrag, setAirDrag] = useState<boolean>(false);

  // Simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  // 3D Camera Orbit Controls
  const [cameraYaw, setCameraYaw] = useState<number>(40);
  const [cameraPitch, setCameraPitch] = useState<number>(24);
  const [cameraZoom, setCameraZoom] = useState<number>(380);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    yaw: 40,
    pitch: 24,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Theoretical values
  const angleRad = (angleDeg * Math.PI) / 180;
  const azimuthRad = (azimuthDeg * Math.PI) / 180;

  const v0x = velocity * Math.cos(angleRad) * Math.cos(azimuthRad);
  const v0y = velocity * Math.sin(angleRad);
  const v0z = velocity * Math.cos(angleRad) * Math.sin(azimuthRad);

  const totalFlightTime = (2 * v0y) / gravity;
  const maxTheoreticalHeight = (v0y * v0y) / (2 * gravity);
  const theoreticalRange = Math.sqrt(v0x * v0x + v0z * v0z) * totalFlightTime;

  // Instantaneous kinematics at time t
  const calculatePositionAt = useCallback(
    (t: number) => {
      const clampedT = Math.min(t, totalFlightTime);
      if (clampedT <= 0) return { x: 0, y: 0, z: 0, vx: v0x, vy: v0y, vz: v0z };

      if (!airDrag) {
        const x = v0x * clampedT;
        const y = Math.max(0, v0y * clampedT - 0.5 * gravity * clampedT * clampedT);
        const z = v0z * clampedT;
        const vx = v0x;
        const vy = v0y - gravity * clampedT;
        const vz = v0z;
        return { x, y, z, vx, vy, vz };
      } else {
        const k = 0.08;
        const exp = Math.exp(-k * clampedT);
        const x = (v0x / k) * (1 - exp);
        const z = (v0z / k) * (1 - exp);
        const y = Math.max(
          0,
          ((v0y + gravity / k) / k) * (1 - exp) - (gravity / k) * clampedT
        );
        const vx = v0x * exp;
        const vy = (v0y + gravity / k) * exp - gravity / k;
        const vz = v0z * exp;
        return { x, y, z, vx, vy, vz };
      }
    },
    [totalFlightTime, v0x, v0y, v0z, gravity, airDrag]
  );

  const currentPos = calculatePositionAt(simTime);
  const currentSpeed = Math.sqrt(
    currentPos.vx * currentPos.vx +
      currentPos.vy * currentPos.vy +
      currentPos.vz * currentPos.vz
  );

  // Playback loop
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
          if (next >= totalFlightTime) {
            setIsPlaying(false);
            return totalFlightTime;
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
  }, [isPlaying, totalFlightTime]);

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };

  const handleStep = () => {
    setIsPlaying(false);
    setSimTime((prev) => Math.min(totalFlightTime, prev + 0.1));
  };

  const setPresetIsometric = () => {
    setCameraYaw(45);
    setCameraPitch(25);
    setCameraZoom(380);
  };

  const setPresetTopDown = () => {
    setCameraYaw(0);
    setCameraPitch(85);
    setCameraZoom(380);
  };

  const setPresetSide = () => {
    setCameraYaw(90);
    setCameraPitch(5);
    setCameraZoom(380);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (viewMode !== '3d_void') return;
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
    if (!isDraggingRef.current || viewMode !== '3d_void') return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newYaw = (dragStartRef.current.yaw + deltaX * 0.45) % 360;
    const newPitch = Math.max(
      2,
      Math.min(88, dragStartRef.current.pitch - deltaY * 0.45)
    );

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
      if (viewMode !== '3d_void') return;
      e.preventDefault();
      e.stopPropagation();
      setCameraZoom((prev) => Math.max(180, Math.min(700, prev + e.deltaY * 0.4)));
    };

    canvas.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onNativeWheel);
    };
  }, [viewMode]);

  const project3Dto2D = useCallback(
    (
      x: number,
      y: number,
      z: number,
      originX: number,
      originY: number,
      scaleMetersToUnits: number
    ) => {
      const wx = x * scaleMetersToUnits;
      const wy = y * scaleMetersToUnits;
      const wz = z * scaleMetersToUnits;

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

      return { screenX, screenY, scale: perspectiveScale, depth: z2 };
    },
    [cameraYaw, cameraPitch, cameraZoom]
  );

  // Canvas render routine
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

    if (viewMode === '3d_void') {
      const originX = width / 2;
      const originY = height * 0.65;
      const scaleM2U = Math.min(width, height) / 110;

      // 1. Draw 3D Ground Grid (Y = 0)
      ctx.lineWidth = 1;
      const gridSize = 120;
      const gridStep = 15;

      for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
        const pStart = project3Dto2D(gx, 0, -gridSize, originX, originY, scaleM2U);
        const pEnd = project3Dto2D(gx, 0, gridSize, originX, originY, scaleM2U);

        ctx.strokeStyle = gx === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(30, 41, 59, 0.5)';
        ctx.beginPath();
        ctx.moveTo(pStart.screenX, pStart.screenY);
        ctx.lineTo(pEnd.screenX, pEnd.screenY);
        ctx.stroke();
      }

      for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
        const pStart = project3Dto2D(-gridSize, 0, gz, originX, originY, scaleM2U);
        const pEnd = project3Dto2D(gridSize, 0, gz, originX, originY, scaleM2U);

        ctx.strokeStyle = gz === 0 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(30, 41, 59, 0.5)';
        ctx.beginPath();
        ctx.moveTo(pStart.screenX, pStart.screenY);
        ctx.lineTo(pEnd.screenX, pEnd.screenY);
        ctx.stroke();
      }

      // 2. Coordinate Axes at (0,0,0)
      const pOrigin = project3Dto2D(0, 0, 0, originX, originY, scaleM2U);
      const pAxisX = project3Dto2D(35, 0, 0, originX, originY, scaleM2U);
      const pAxisY = project3Dto2D(0, 35, 0, originX, originY, scaleM2U);
      const pAxisZ = project3Dto2D(0, 0, 35, originX, originY, scaleM2U);

      // +X Axis (Range forward)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pOrigin.screenX, pOrigin.screenY);
      ctx.lineTo(pAxisX.screenX, pAxisX.screenY);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('+X (Range)', pAxisX.screenX + 4, pAxisX.screenY);

      // +Y Axis (Height upward)
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(pOrigin.screenX, pOrigin.screenY);
      ctx.lineTo(pAxisY.screenX, pAxisY.screenY);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.fillText('+Y (Height)', pAxisY.screenX + 4, pAxisY.screenY);

      // +Z Axis (Azimuth lateral)
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(pOrigin.screenX, pOrigin.screenY);
      ctx.lineTo(pAxisZ.screenX, pAxisZ.screenY);
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.fillText('+Z (Lateral)', pAxisZ.screenX + 4, pAxisZ.screenY);

      // 3. Draw Complete 3D Trajectory Curve
      const stepCount = 80;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 3;

      for (let i = 0; i <= stepCount; i++) {
        const t = (i / stepCount) * totalFlightTime;
        const pos = calculatePositionAt(t);
        const p = project3Dto2D(pos.x, pos.y, pos.z, originX, originY, scaleM2U);
        if (i === 0) ctx.moveTo(p.screenX, p.screenY);
        else ctx.lineTo(p.screenX, p.screenY);
      }
      ctx.stroke();

      // 4. Apex Marker in 3D
      const apexPos = calculatePositionAt(totalFlightTime / 2);
      const pApex = project3Dto2D(apexPos.x, apexPos.y, apexPos.z, originX, originY, scaleM2U);
      const pApexGround = project3Dto2D(apexPos.x, 0, apexPos.z, originX, originY, scaleM2U);

      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pApex.screenX, pApex.screenY);
      ctx.lineTo(pApexGround.screenX, pApexGround.screenY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(pApex.screenX, pApex.screenY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '11px sans-serif';
      ctx.fillText(`Apex: ${maxTheoreticalHeight.toFixed(1)}m`, pApex.screenX + 6, pApex.screenY - 4);

      // 5. Landing Marker in 3D
      const landPos = calculatePositionAt(totalFlightTime);
      const pLand = project3Dto2D(landPos.x, 0, landPos.z, originX, originY, scaleM2U);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pLand.screenX, pLand.screenY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`Range: ${theoreticalRange.toFixed(1)}m`, pLand.screenX + 6, pLand.screenY + 12);

      // 6. Current Flying Particle & Shadow
      const pCur = project3Dto2D(currentPos.x, currentPos.y, currentPos.z, originX, originY, scaleM2U);
      const pCurShadow = project3Dto2D(currentPos.x, 0, currentPos.z, originX, originY, scaleM2U);

      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(pCur.screenX, pCur.screenY);
      ctx.lineTo(pCurShadow.screenX, pCurShadow.screenY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(pCurShadow.screenX, pCurShadow.screenY, 6 * pCurShadow.scale, 3 * pCurShadow.scale, 0, 0, Math.PI * 2);
      ctx.fill();

      const rad = Math.max(5, 7 * pCur.scale);
      const grad = ctx.createRadialGradient(
        pCur.screenX - 2,
        pCur.screenY - 2,
        1,
        pCur.screenX,
        pCur.screenY,
        rad
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#38bdf8');
      grad.addColorStop(1, '#0284c7');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(pCur.screenX, pCur.screenY, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // 2D ORTHOGONAL CROSS-SECTION MODE
      const originX = 70;
      const originY = height - 70;
      const scaleX = (width - 120) / Math.max(50, theoreticalRange * 1.15);
      const scaleY = (height - 140) / Math.max(25, maxTheoreticalHeight * 1.3);

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originX - 20, originY);
      ctx.lineTo(width - 30, originY);
      ctx.moveTo(originX, originY + 20);
      ctx.lineTo(originX, 30);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText('X (Range in meters) →', width - 150, originY + 24);
      ctx.fillText('↑ Y (Height)', originX - 45, 25);

      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.setLineDash([3, 4]);
      for (let gy = 10; gy <= maxTheoreticalHeight * 1.3; gy += 10) {
        const sy = originY - gy * scaleY;
        ctx.beginPath();
        ctx.moveTo(originX, sy);
        ctx.lineTo(width - 40, sy);
        ctx.stroke();
        ctx.fillText(`${gy}m`, originX - 34, sy + 4);
      }
      ctx.setLineDash([]);

      const stepCount = 100;
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      for (let i = 0; i <= stepCount; i++) {
        const t = (i / stepCount) * totalFlightTime;
        const pos = calculatePositionAt(t);
        const sx = originX + pos.x * scaleX;
        const sy = originY - pos.y * scaleY;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      const curSX = originX + currentPos.x * scaleX;
      const curSY = originY - currentPos.y * scaleY;

      const vScale = 1.2;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curSX, curSY);
      ctx.lineTo(curSX + currentPos.vx * vScale, curSY);
      ctx.stroke();

      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(curSX, curSY);
      ctx.lineTo(curSX, curSY - currentPos.vy * vScale);
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(curSX, curSY);
      ctx.lineTo(curSX + currentPos.vx * vScale, curSY - currentPos.vy * vScale);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(curSX, curSY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [
    viewMode,
    currentPos,
    calculatePositionAt,
    cameraYaw,
    cameraPitch,
    cameraZoom,
    project3Dto2D,
    totalFlightTime,
    theoreticalRange,
    maxTheoreticalHeight,
  ]);

  return (
    <div className={styles.container} role="region" aria-label="Interactive Projectile Dynamics Simulator">
      {/* Top Header */}
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Section 3.7 • 3D Spatial</span>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{topicTitle}</span>
          </div>
        </div>

        <div className={styles.viewModeSwitcher} role="tablist" aria-label="Select viewport dimension">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === '3d_void'}
            className={`${styles.modeBtn} ${viewMode === '3d_void' ? styles.activeModeBtn : ''}`}
            onClick={() => setViewMode('3d_void')}
          >
            <Icon name="cube" size="xs" />
            3D Spatial Void
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === '2d_plane'}
            className={`${styles.modeBtn} ${viewMode === '2d_plane' ? styles.activeModeBtn : ''}`}
            onClick={() => setViewMode('2d_plane')}
          >
            <Icon name="layers" size="xs" />
            2D Cross-Section
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            aria-label="Close simulation"
          >
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className={styles.mainStage}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Interactive simulation canvas"
        />

        {viewMode === '3d_void' && (
          <>
            <div className={styles.cameraHintBadge}>
              <Icon name="cube" size="xs" />
              <span>
                <strong>3D Void Mode:</strong> Click & drag to rotate camera • Scroll to zoom
              </span>
            </div>

            <div className={styles.cameraControlsOverlay}>
              <button
                type="button"
                className={styles.camPresetBtn}
                onClick={setPresetIsometric}
                title="Reset to 3D Isometric View"
              >
                <Icon name="rotateCw" size="xs" />
                Isometric
              </button>
              <button
                type="button"
                className={styles.camPresetBtn}
                onClick={setPresetTopDown}
                title="Top-Down Bird's Eye View"
              >
                Top-Down
              </button>
              <button
                type="button"
                className={styles.camPresetBtn}
                onClick={setPresetSide}
                title="Side Elevation View"
              >
                Side Profile
              </button>
            </div>
          </>
        )}

        {/* Real-time Telemetry HUD */}
        <div className={styles.telemetryHud} aria-live="polite">
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Time Elapsed (t)</span>
            <span className={styles.telemetryVal}>{simTime.toFixed(2)} s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Height (Y)</span>
            <span className={styles.telemetryVal}>{currentPos.y.toFixed(1)} m</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Range Dist (X)</span>
            <span className={styles.telemetryVal}>{currentPos.x.toFixed(1)} m</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Speed |v|</span>
            <span className={styles.telemetryVal}>{currentSpeed.toFixed(1)} m/s</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Max Height (H)</span>
            <span className={styles.telemetryVal}>{maxTheoreticalHeight.toFixed(1)} m</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Total Range (R)</span>
            <span className={styles.telemetryVal}>{theoreticalRange.toFixed(1)} m</span>
          </div>
        </div>
      </div>

      {/* Physics Sliders & Playback Controls */}
      <div className={styles.controlsPanel}>
        <div className={styles.slidersGrid}>
          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Launch Velocity (v₀)</span>
              <span className={styles.controlVal}>{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={velocity}
              onChange={(e) => {
                setVelocity(Number(e.target.value));
                handleReset();
              }}
              className={styles.slider}
              aria-label="Launch velocity"
            />
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Elevation Angle (θ)</span>
              <span className={styles.controlVal}>{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              value={angleDeg}
              onChange={(e) => {
                setAngleDeg(Number(e.target.value));
                handleReset();
              }}
              className={styles.slider}
              aria-label="Elevation angle"
            />
          </div>

          {viewMode === '3d_void' && (
            <div className={styles.controlGroup}>
              <div className={styles.controlHeader}>
                <span className={styles.controlName}>Azimuth Drift (φ)</span>
                <span className={styles.controlVal}>{azimuthDeg}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={azimuthDeg}
                onChange={(e) => {
                  setAzimuthDeg(Number(e.target.value));
                  handleReset();
                }}
                className={styles.slider}
                aria-label="Azimuth drift"
              />
            </div>
          )}

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.controlName}>Gravity Field (g)</span>
            </div>
            <select
              value={gravity}
              onChange={(e) => {
                setGravity(Number(e.target.value));
                handleReset();
              }}
              className={styles.gravitySelect}
              aria-label="Gravitational acceleration"
            >
              {GRAVITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback Action Buttons */}
        <div className={styles.playControlsRow}>
          <div className={styles.playbackButtons}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                if (simTime >= totalFlightTime) setSimTime(0);
                setIsPlaying(!isPlaying);
              }}
              aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
            >
              <Icon name={isPlaying ? 'pause' : 'play'} size="sm" />
              {isPlaying ? 'Pause' : simTime >= totalFlightTime ? 'Replay' : 'Launch / Play'}
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleStep}
              disabled={isPlaying || simTime >= totalFlightTime}
              title="Step forward +0.1s"
              aria-label="Step forward"
            >
              <Icon name="arrowRight" size="xs" />
              Step +0.1s
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={handleReset}
              title="Reset simulation"
              aria-label="Reset trajectory"
            >
              <Icon name="refresh" size="xs" />
              Reset
            </button>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.8125rem',
                color: '#cbd5e1',
                cursor: 'pointer',
                marginLeft: '0.5rem',
              }}
            >
              <input
                type="checkbox"
                checked={airDrag}
                onChange={(e) => {
                  setAirDrag(e.target.checked);
                  handleReset();
                }}
              />
              <span>Linear Air Drag (k=0.08)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
