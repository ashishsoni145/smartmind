import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface VectorCrossProductSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

export const VectorCrossProductSimulation: React.FC<VectorCrossProductSimulationProps> = ({
  onClose,
  title = '3D Vector Cross Product & Right-Hand Rule Simulator',
  topicTitle = 'Vector Algebra (NCERT Chapter 10 • Section 10.4)',
}) => {
  // Vector A components
  const [ax, setAx] = useState<number>(3.0);
  const [ay, setAy] = useState<number>(1.0);
  const [az, setAz] = useState<number>(0.0);

  // Vector B components
  const [bx, setBx] = useState<number>(1.0);
  const [by, setBy] = useState<number>(3.0);
  const [bz, setBz] = useState<number>(0.0);

  // 3D Camera Angles (radians)
  const [yaw, setYaw] = useState<number>(0.6);
  const [pitch, setPitch] = useState<number>(0.4);
  const [zoomScale, setZoomScale] = useState<number>(32);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cross Product C = A x B
  // Cx = Ay*Bz - Az*By
  // Cy = Az*Bx - Ax*Bz
  // Cz = Ax*By - Ay*Bx
  const cx = ay * bz - az * by;
  const cy = az * bx - ax * bz;
  const cz = ax * by - ay * bx;

  const magA = Math.sqrt(ax * ax + ay * ay + az * az);
  const magB = Math.sqrt(bx * bx + by * by + bz * bz);
  const magC = Math.sqrt(cx * cx + cy * cy + cz * cz);
  const dotProduct = ax * bx + ay * by + az * bz;
  const cosTheta = magA > 0 && magB > 0 ? Math.max(-1, Math.min(1, dotProduct / (magA * magB))) : 1;
  const thetaDeg = (Math.acos(cosTheta) * 180) / Math.PI;

  // 3D projection helper
  const project3D = (
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    scale = zoomScale
  ) => {
    // Rotation around Y (yaw)
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY + z * sinY;
    const y1 = y;
    const z1 = -x * sinY + z * cosY;

    // Rotation around X (pitch)
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const x2 = x1;
    const y2 = y1 * cosP - z1 * sinP;
    const z2 = y1 * sinP + z1 * cosP;

    // Isometric / weak perspective
    const distance = 16;
    const fov = distance / (distance + z2);

    const screenX = width / 2 + x2 * scale * fov;
    const screenY = height / 2 - y2 * scale * fov; // canvas Y is inverted

    return { x: screenX, y: screenY, z: z2 };
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Dark space background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Ground Grid in XZ plane
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 5;
    for (let x = -gridSize; x <= gridSize; x++) {
      const pStart = project3D(x, 0, -gridSize, width, height);
      const pEnd = project3D(x, 0, gridSize, width, height);
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.stroke();
    }
    for (let z = -gridSize; z <= gridSize; z++) {
      const pStart = project3D(-gridSize, 0, z, width, height);
      const pEnd = project3D(gridSize, 0, z, width, height);
      ctx.beginPath();
      ctx.moveTo(pStart.x, pStart.y);
      ctx.lineTo(pEnd.x, pEnd.y);
      ctx.stroke();
    }

    // 3D Coordinate Axes (X: red, Y: green, Z: blue)
    const drawAxis = (ex: number, ey: number, ez: number, color: string, label: string) => {
      const origin = project3D(0, 0, 0, width, height);
      const end = project3D(ex, ey, ez, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = '11px monospace';
      ctx.fillText(label, end.x + 6, end.y + 4);
    };

    drawAxis(5, 0, 0, 'rgba(239, 68, 68, 0.4)', '+X');
    drawAxis(0, 5, 0, 'rgba(34, 197, 94, 0.4)', '+Y');
    drawAxis(0, 0, 5, 'rgba(59, 130, 246, 0.4)', '+Z');

    // Projected Key Points
    const o = project3D(0, 0, 0, width, height);
    const pA = project3D(ax, ay, az, width, height);
    const pB = project3D(bx, by, bz, width, height);
    const pCorner = project3D(ax + bx, ay + by, az + bz, width, height);
    const pC = project3D(cx, cy, cz, width, height, 16); // scaled down for cross product arrow if large

    // Shaded Parallelogram formed by A and B (Area = |A x B|)
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(pA.x, pA.y);
    ctx.lineTo(pCorner.x, pCorner.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pA.x, pA.y);
    ctx.lineTo(pCorner.x, pCorner.y);
    ctx.lineTo(pB.x, pB.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Helper to draw clean 3D vector arrow with arrowhead
    const drawVectorArrow = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      color: string,
      lineWidth: number,
      label: string
    ) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(label, to.x + 10, to.y - 6);
    };

    // Vector A (cyan)
    drawVectorArrow(o, pA, '#38bdf8', 3, `A⃗ (${ax}, ${ay}, ${az})`);

    // Vector B (amber)
    drawVectorArrow(o, pB, '#fbbf24', 3, `B⃗ (${bx}, ${by}, ${bz})`);

    // Cross Product Vector C = A x B (Emerald)
    drawVectorArrow(o, pC, '#10b981', 3.5, `C⃗ = A⃗ × B⃗ (${cx.toFixed(1)}, ${cy.toFixed(1)}, ${cz.toFixed(1)})`);

    // Right-Hand Rule Arc Indicator around normal
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(o.x, o.y, 24, 0, Math.PI);
    ctx.stroke();
  }, [ax, ay, az, bx, by, bz, cx, cy, cz, yaw, pitch, zoomScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setZoomScale((prev) => Math.max(16, Math.min(60, prev - e.deltaY * 0.04)));
    };

    canvas.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  // Orbit drag handlers with pointer capture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setYaw((prev) => prev + dx * 0.01);
    setPitch((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.01)));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  return (
    <div className={styles.viewerContainer}>
      <header className={styles.viewerHeader}>
        <div className={styles.headerTitleArea}>
          <div className={styles.simBadge}>
            <Icon name="mathematics" size="xs" />
            <span>3D VECTOR ALGEBRA SIMULATION</span>
          </div>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.topicSubtitle}>{topicTitle}</span>
        </div>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <Icon name="close" size="sm" />
          </button>
        )}
      </header>

      <div className={styles.contentLayout}>
        <div
          className={styles.canvasWrapper}
          style={{ position: 'relative', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <canvas ref={canvasRef} style={{ width: '100%', height: '440px', display: 'block' }} />

          {/* Telemetry HUD */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(9, 13, 22, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ color: '#38bdf8' }}>
              |A⃗| = {magA.toFixed(2)} [cos θ = {cosTheta.toFixed(3)}]
            </div>
            <div style={{ color: '#fbbf24' }}>
              |B⃗| = {magB.toFixed(2)} [Angle θ = {thetaDeg.toFixed(1)}°]
            </div>
            <div style={{ color: '#10b981', fontWeight: 600 }}>
              Parallelogram Area = |A⃗ × B⃗| = {magC.toFixed(2)}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
              Dot Product A⃗ · B⃗ = {dotProduct.toFixed(2)}
            </div>
            <div style={{ color: 'rgba(56, 189, 248, 0.7)', fontSize: '10px', marginTop: '2px' }}>
              Click & drag canvas to rotate 3D camera
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.controlPanel}>
            <h3 className={styles.panelTitle}>Vector Coordinates</h3>

            {/* Vector A Components */}
            <div className={styles.controlGroup}>
              <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '12px', marginBottom: '6px' }}>
                Vector A⃗ Components
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Ax: {ax.toFixed(1)}</span>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={ax}
                    onChange={(e) => setAx(parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Ay: {ay.toFixed(1)}</span>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={ay}
                    onChange={(e) => setAy(parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Az: {az.toFixed(1)}</span>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={az}
                    onChange={(e) => setAz(parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>
            </div>

            {/* Vector B Components */}
            <div className={styles.controlGroup}>
              <div style={{ color: '#fbbf24', fontWeight: 600, fontSize: '12px', marginBottom: '6px' }}>
                Vector B⃗ Components
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Bx: {bx.toFixed(1)}</span>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={bx}
                    onChange={(e) => setBx(parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>By: {by.toFixed(1)}</span>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={by}
                    onChange={(e) => setBy(parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Bz: {bz.toFixed(1)}</span>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={bz}
                    onChange={(e) => setBz(parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Presets</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    setAx(3);
                    setAy(0);
                    setAz(0);
                    setBx(0);
                    setBy(3);
                    setBz(0);
                  }}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Orthogonal (XY)
                </button>
                <button
                  onClick={() => {
                    setAx(2);
                    setAy(2);
                    setAz(0);
                    setBx(3);
                    setBy(3);
                    setBz(0);
                  }}
                  style={{
                    padding: '6px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Collinear (A ∥ B)
                </button>
              </div>
            </div>

            {/* Formula box */}
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ color: '#10b981', fontWeight: 600 }}>NCERT Cross Product Definition</div>
              <div style={{ fontFamily: 'monospace', color: '#fff', fontSize: '12px' }}>
                A⃗ × B⃗ = (|A⃗||B⃗| sin θ) n̂
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                The unit vector n̂ is perpendicular to both A⃗ and B⃗, oriented according to the right-hand screw rule.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
