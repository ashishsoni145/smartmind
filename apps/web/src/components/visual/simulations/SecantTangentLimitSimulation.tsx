import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface SecantTangentLimitSimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

type FuncType = 'quadratic' | 'cubic' | 'sine' | 'inverse';

export const SecantTangentLimitSimulation: React.FC<SecantTangentLimitSimulationProps> = ({
  onClose,
  title = 'Derivative as Limit of Secant Slope Simulator',
  topicTitle = 'Limits & Derivatives (NCERT Chapter 13 • Section 13.5)',
}) => {
  const [funcType, setFuncType] = useState<FuncType>('quadratic');
  const [x0, setX0] = useState<number>(1.2);
  const [deltaX, setDeltaX] = useState<number>(1.5); // h
  const [isAnimatingH, setIsAnimatingH] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Evaluate f(x) and f'(x)
  const evalFunc = (x: number, type: FuncType) => {
    switch (type) {
      case 'quadratic':
        return { y: 0.5 * x * x, dy: x, label: 'f(x) = 0.5x²', formula: "f'(x) = x" };
      case 'cubic':
        return { y: 0.2 * Math.pow(x, 3) - 0.4 * x, dy: 0.6 * x * x - 0.4, label: 'f(x) = 0.2x³ - 0.4x', formula: "f'(x) = 0.6x² - 0.4" };
      case 'sine':
        return { y: Math.sin(x), dy: Math.cos(x), label: 'f(x) = sin(x)', formula: "f'(x) = cos(x)" };
      case 'inverse':
        const safeX = Math.abs(x) < 0.2 ? (x >= 0 ? 0.2 : -0.2) : x;
        return { y: 2 / safeX, dy: -2 / (safeX * safeX), label: 'f(x) = 2/x', formula: "f'(x) = -2/x²" };
    }
  };

  const current = evalFunc(x0, funcType);
  const y0 = current.y;
  const tangentSlope = current.dy;

  const x1 = x0 + deltaX;
  const y1 = evalFunc(x1, funcType).y;
  const deltaY = y1 - y0;
  const secantSlope = Math.abs(deltaX) > 0.0001 ? deltaY / deltaX : tangentSlope;
  const errorPercent = Math.abs(tangentSlope) > 0.001
    ? Math.min(999, Math.abs((secantSlope - tangentSlope) / tangentSlope) * 100)
    : Math.abs(secantSlope - tangentSlope) * 100;

  // Animate h -> 0 smoothly
  useEffect(() => {
    if (!isAnimatingH) return;
    let animId: number;
    let currentH = deltaX;
    const targetH = 0.02;

    const step = () => {
      currentH += (targetH - currentH) * 0.05;
      if (Math.abs(currentH - targetH) < 0.005) {
        setDeltaX(targetH);
        setIsAnimatingH(false);
      } else {
        setDeltaX(currentH);
        animId = requestAnimationFrame(step);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isAnimatingH]);

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

    // Graph viewport coordinates
    const xMin = -3.5;
    const xMax = 4.5;
    const yMin = -2.5;
    const yMax = 5.0;

    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Dark background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    const originX = toScreenX(0);
    const originY = toScreenY(0);
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis ticks and labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px Inter, sans-serif';
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue;
      const sx = toScreenX(x);
      ctx.fillText(`${x}`, sx - 4, originY + 14);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue;
      const sy = toScreenY(y);
      ctx.fillText(`${y}`, originX + 6, sy + 4);
    }

    // Draw Function Curve f(x)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    const stepX = (xMax - xMin) / 200;
    for (let x = xMin; x <= xMax; x += stepX) {
      const y = evalFunc(x, funcType).y;
      if (isNaN(y) || Math.abs(y) > 15) {
        started = false;
        continue;
      }
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      if (!started) {
        ctx.moveTo(sx, sy);
        started = true;
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();

    // Draw Secant Line through (x0, y0) and (x1, y1)
    const p0x = toScreenX(x0);
    const p0y = toScreenY(y0);
    const p1x = toScreenX(x1);
    const p1y = toScreenY(y1);

    // Secant extension
    const secXStart = xMin;
    const secYStart = y0 + secantSlope * (secXStart - x0);
    const secXEnd = xMax;
    const secYEnd = y0 + secantSlope * (secXEnd - x0);

    ctx.strokeStyle = '#f59e0b'; // amber for secant
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toScreenX(secXStart), toScreenY(secYStart));
    ctx.lineTo(toScreenX(secXEnd), toScreenY(secYEnd));
    ctx.stroke();

    // Draw Instantaneous Tangent Line (emerald)
    const tanXStart = xMin;
    const tanYStart = y0 + tangentSlope * (tanXStart - x0);
    const tanXEnd = xMax;
    const tanYEnd = y0 + tangentSlope * (tanXEnd - x0);

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)'; // emerald
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toScreenX(tanXStart), toScreenY(tanYStart));
    ctx.lineTo(toScreenX(tanXEnd), toScreenY(tanYEnd));
    ctx.stroke();
    ctx.setLineDash([]);

    // Delta-X and Delta-Y triangle
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.lineTo(p1x, p0y);
    ctx.lineTo(p1x, p1y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p0x, p0y);
    ctx.lineTo(p1x, p0y);
    ctx.lineTo(p1x, p1y);
    ctx.stroke();

    // Labels for Δx and Δy
    ctx.fillStyle = '#fbbf24';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(`Δx = ${deltaX.toFixed(2)}`, (p0x + p1x) / 2 - 20, p0y + (deltaY >= 0 ? 15 : -8));
    ctx.fillText(`Δy = ${deltaY.toFixed(2)}`, p1x + 8, (p0y + p1y) / 2);

    // Points P (x0, y0) and Q (x1, y1)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(p0x, p0y, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`P (x₀, f(x₀))`, p0x - 20, p0y - 12);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(p1x, p1y, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillText(`Q (x₀+h, f(x₀+h))`, p1x + 8, p1y - 10);
  }, [funcType, x0, deltaX, y0, y1, tangentSlope, secantSlope, deltaY]);

  return (
    <div className={styles.viewerContainer}>
      <header className={styles.viewerHeader}>
        <div className={styles.headerTitleArea}>
          <div className={styles.simBadge}>
            <Icon name="mathematics" size="xs" />
            <span>CALCULUS LIMIT SIMULATION</span>
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
        <div className={styles.canvasWrapper} style={{ position: 'relative' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '420px', display: 'block' }} />

          {/* Telemetry Overlay */}
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
            <div style={{ color: '#38bdf8', fontWeight: 600 }}>{current.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              x₀ = <span style={{ color: '#fff' }}>{x0.toFixed(2)}</span>, f(x₀) ={' '}
              <span style={{ color: '#fff' }}>{y0.toFixed(2)}</span>
            </div>
            <div style={{ color: '#f59e0b' }}>
              Secant Slope m_sec = <span style={{ fontWeight: 'bold' }}>{secantSlope.toFixed(3)}</span> (Δy/h)
            </div>
            <div style={{ color: '#10b981' }}>
              Tangent Slope f'(x₀) = <span style={{ fontWeight: 'bold' }}>{tangentSlope.toFixed(3)}</span>
            </div>
            <div style={{ color: errorPercent < 2 ? '#10b981' : '#f87171' }}>
              Approximation Error: {errorPercent.toFixed(1)}% {deltaX < 0.05 ? '(Converged!)' : ''}
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.controlPanel}>
            <h3 className={styles.panelTitle}>Differential Limit Controls</h3>

            {/* Function Picker */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Function f(x)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                {(['quadratic', 'cubic', 'sine', 'inverse'] as FuncType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFuncType(type)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: funcType === type ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: funcType === type ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: funcType === type ? '#38bdf8' : 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* x0 slider */}
            <div className={styles.controlGroup}>
              <div className={styles.sliderHeader}>
                <label className={styles.controlLabel}>Base Point (x₀)</label>
                <span className={styles.sliderValue}>{x0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2.0"
                max="2.5"
                step="0.05"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>

            {/* Delta X (h) slider */}
            <div className={styles.controlGroup}>
              <div className={styles.sliderHeader}>
                <label className={styles.controlLabel}>Step Size (h = Δx)</label>
                <span className={styles.sliderValue}>{deltaX.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="2.5"
                step="0.01"
                value={deltaX}
                onChange={(e) => setDeltaX(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Limit (h → 0)</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Large Secant</span>
              </div>
            </div>

            {/* Animate h -> 0 button */}
            <button
              onClick={() => {
                if (deltaX < 0.1) setDeltaX(2.0);
                setIsAnimatingH(true);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <Icon name="sparkles" size="sm" />
              <span>Animate Limit h → 0</span>
            </button>

            {/* NCERT Formula Box */}
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
              <div style={{ color: '#38bdf8', fontWeight: 600 }}>First Principle of Derivatives</div>
              <div style={{ fontFamily: 'monospace', color: '#fff', fontSize: '12px' }}>
                f'(x) = lim_{'{h→0}'} [f(x+h) - f(x)] / h
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                As secant chord PQ pivots as h approaches 0, the chord merges into the tangent line at P.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
