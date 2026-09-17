import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from '../VisualLearningViewer.module.css';

interface VseprGeometrySimulationProps {
  onClose?: () => void;
  title?: string;
  topicTitle?: string;
}

interface MoleculeSpec {
  id: string;
  formula: string;
  name: string;
  geometry: string;
  shape: string;
  hybridization: string;
  bondAngle: string;
  lonePairs: number;
  centralAtom: { symbol: string; color: string; radius: number };
  ligandAtoms: { symbol: string; color: string; radius: number; pos: [number, number, number] }[];
  lonePairVectors?: [number, number, number][];
}

const MOLECULES: MoleculeSpec[] = [
  {
    id: 'ch4',
    formula: 'CH₄',
    name: 'Methane',
    geometry: 'Tetrahedral',
    shape: 'Tetrahedral',
    hybridization: 'sp³',
    bondAngle: '109.5°',
    lonePairs: 0,
    centralAtom: { symbol: 'C', color: '#475569', radius: 18 },
    ligandAtoms: [
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [0, 55, 0] },
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [52, -18, 0] },
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [-26, -18, 45] },
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [-26, -18, -45] },
    ],
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    name: 'Ammonia',
    geometry: 'Tetrahedral',
    shape: 'Trigonal Pyramidal',
    hybridization: 'sp³',
    bondAngle: '107.0°',
    lonePairs: 1,
    centralAtom: { symbol: 'N', color: '#38bdf8', radius: 18 },
    ligandAtoms: [
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [48, -25, 0] },
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [-24, -25, 42] },
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [-24, -25, -42] },
    ],
    lonePairVectors: [[0, 52, 0]],
  },
  {
    id: 'h2o',
    formula: 'H₂O',
    name: 'Water',
    geometry: 'Tetrahedral',
    shape: 'Bent / V-Shaped',
    hybridization: 'sp³',
    bondAngle: '104.5°',
    lonePairs: 2,
    centralAtom: { symbol: 'O', color: '#ef4444', radius: 18 },
    ligandAtoms: [
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [45, -28, 0] },
      { symbol: 'H', color: '#ffffff', radius: 11, pos: [-45, -28, 0] },
    ],
    lonePairVectors: [
      [0, 38, 35],
      [0, 38, -35],
    ],
  },
  {
    id: 'becl2',
    formula: 'BeCl₂',
    name: 'Beryllium Chloride',
    geometry: 'Linear',
    shape: 'Linear',
    hybridization: 'sp',
    bondAngle: '180.0°',
    lonePairs: 0,
    centralAtom: { symbol: 'Be', color: '#94a3b8', radius: 16 },
    ligandAtoms: [
      { symbol: 'Cl', color: '#10b981', radius: 16, pos: [-65, 0, 0] },
      { symbol: 'Cl', color: '#10b981', radius: 16, pos: [65, 0, 0] },
    ],
  },
  {
    id: 'bf3',
    formula: 'BF₃',
    name: 'Boron Trifluoride',
    geometry: 'Trigonal Planar',
    shape: 'Trigonal Planar',
    hybridization: 'sp²',
    bondAngle: '120.0°',
    lonePairs: 0,
    centralAtom: { symbol: 'B', color: '#f59e0b', radius: 16 },
    ligandAtoms: [
      { symbol: 'F', color: '#10b981', radius: 14, pos: [0, 60, 0] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [52, -30, 0] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [-52, -30, 0] },
    ],
  },
  {
    id: 'pcl5',
    formula: 'PCl₅',
    name: 'Phosphorus Pentachloride',
    geometry: 'Trigonal Bipyramidal',
    shape: 'Trigonal Bipyramidal',
    hybridization: 'sp³d',
    bondAngle: '90° & 120°',
    lonePairs: 0,
    centralAtom: { symbol: 'P', color: '#f97316', radius: 20 },
    ligandAtoms: [
      // Axial
      { symbol: 'Cl', color: '#10b981', radius: 15, pos: [0, 65, 0] },
      { symbol: 'Cl', color: '#10b981', radius: 15, pos: [0, -65, 0] },
      // Equatorial
      { symbol: 'Cl', color: '#10b981', radius: 15, pos: [55, 0, 0] },
      { symbol: 'Cl', color: '#10b981', radius: 15, pos: [-28, 0, 48] },
      { symbol: 'Cl', color: '#10b981', radius: 15, pos: [-28, 0, -48] },
    ],
  },
  {
    id: 'sf6',
    formula: 'SF₆',
    name: 'Sulfur Hexafluoride',
    geometry: 'Octahedral',
    shape: 'Octahedral',
    hybridization: 'sp³d²',
    bondAngle: '90.0°',
    lonePairs: 0,
    centralAtom: { symbol: 'S', color: '#eab308', radius: 20 },
    ligandAtoms: [
      { symbol: 'F', color: '#10b981', radius: 14, pos: [0, 58, 0] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [0, -58, 0] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [58, 0, 0] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [-58, 0, 0] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [0, 0, 58] },
      { symbol: 'F', color: '#10b981', radius: 14, pos: [0, 0, -58] },
    ],
  },
];

export const VseprGeometrySimulation: React.FC<VseprGeometrySimulationProps> = ({
  onClose,
  title = '3D VSEPR Molecular Geometry & Hybridization Sandbox',
  topicTitle = 'Chemical Bonding and Molecular Structure (NCERT Chapter 4 • Section 4.3)',
}) => {
  const [selectedMolId, setSelectedMolId] = useState<string>('ch4');

  // 3D Camera Orbit
  const [cameraYaw, setCameraYaw] = useState<number>(30);
  const [cameraPitch, setCameraPitch] = useState<number>(20);
  const [cameraZoom, setCameraZoom] = useState<number>(350);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number }>({
    x: 0,
    y: 0,
    yaw: 30,
    pitch: 20,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mol = MOLECULES.find((m) => m.id === selectedMolId) || MOLECULES[0];

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
    setCameraPitch(Math.max(-85, Math.min(85, dragStartRef.current.pitch - deltaY * 0.45)));
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
      setCameraZoom((prev) => Math.max(180, Math.min(600, prev + e.deltaY * 0.4)));
    };

    canvas.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  const project3Dto2D = useCallback(
    (x: number, y: number, z: number, originX: number, originY: number) => {
      const yawR = (cameraYaw * Math.PI) / 180;
      const pitchR = (cameraPitch * Math.PI) / 180;

      const cosY = Math.cos(yawR);
      const sinY = Math.sin(yawR);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y;

      const cosP = Math.cos(pitchR);
      const sinP = Math.sin(pitchR);
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;
      const x2 = x1;

      const fovDistance = cameraZoom;
      const scale = fovDistance / (fovDistance + z2 + 300);

      const screenX = originX + x2 * scale;
      const screenY = originY - y2 * scale;

      return { screenX, screenY, scale, depth: z2 };
    },
    [cameraYaw, cameraPitch, cameraZoom]
  );

  // Render 3D Molecule
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
    const originY = height / 2;

    // Projected central atom
    const pCenter = project3Dto2D(0, 0, 0, originX, originY);

    // 1. Draw Bond Sticks from Central Atom to Ligands
    mol.ligandAtoms.forEach((lig) => {
      const pLig = project3Dto2D(lig.pos[0], lig.pos[1], lig.pos[2], originX, originY);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 5 * pLig.scale;
      ctx.beginPath();
      ctx.moveTo(pCenter.screenX, pCenter.screenY);
      ctx.lineTo(pLig.screenX, pLig.screenY);
      ctx.stroke();
    });

    // 2. Draw Lone Pair Lobes if present (Translucent Electron Cloud)
    if (mol.lonePairVectors) {
      mol.lonePairVectors.forEach((lp) => {
        const pLp = project3Dto2D(lp[0], lp[1], lp[2], originX, originY);

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pCenter.screenX, pCenter.screenY);
        ctx.lineTo(pLp.screenX, pLp.screenY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(pLp.screenX, pLp.screenY, 14 * pLp.scale, 8 * pLp.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Two dots for electrons in lone pair
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pLp.screenX - 4, pLp.screenY, 2, 0, Math.PI * 2);
        ctx.arc(pLp.screenX + 4, pLp.screenY, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Draw Central Atom Sphere
    const cRad = mol.centralAtom.radius * pCenter.scale;
    const cGrad = ctx.createRadialGradient(
      pCenter.screenX - cRad * 0.3,
      pCenter.screenY - cRad * 0.3,
      1,
      pCenter.screenX,
      pCenter.screenY,
      cRad
    );
    cGrad.addColorStop(0, '#ffffff');
    cGrad.addColorStop(0.3, mol.centralAtom.color);
    cGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = cGrad;
    ctx.shadowColor = mol.centralAtom.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(pCenter.screenX, pCenter.screenY, cRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(mol.centralAtom.symbol, pCenter.screenX - 5, pCenter.screenY + 4);

    // 4. Draw Ligand Atom Spheres
    mol.ligandAtoms.forEach((lig) => {
      const pLig = project3Dto2D(lig.pos[0], lig.pos[1], lig.pos[2], originX, originY);
      const lRad = lig.radius * pLig.scale;

      const lGrad = ctx.createRadialGradient(
        pLig.screenX - lRad * 0.3,
        pLig.screenY - lRad * 0.3,
        1,
        pLig.screenX,
        pLig.screenY,
        lRad
      );
      lGrad.addColorStop(0, '#ffffff');
      lGrad.addColorStop(0.4, lig.color);
      lGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = lGrad;
      ctx.shadowColor = lig.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pLig.screenX, pLig.screenY, lRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = lig.color === '#ffffff' ? '#0f172a' : '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(lig.symbol, pLig.screenX - 4, pLig.screenY + 3);
    });

    ctx.restore();
  }, [mol, cameraYaw, cameraPitch, cameraZoom, project3Dto2D]);

  return (
    <div className={styles.container} role="region" aria-label="3D VSEPR Molecular Geometry Viewer">
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>NCERT Chapter 4 • 3D VSEPR Model</span>
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
            <strong>3D Molecule View:</strong> Drag mouse to rotate bonds • Scroll to zoom
          </span>
        </div>

        <div className={styles.telemetryHud}>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Molecule</span>
            <span className={styles.telemetryVal}>{mol.formula} ({mol.name})</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Molecular Shape</span>
            <span className={styles.telemetryVal}>{mol.shape}</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Hybridization</span>
            <span className={styles.telemetryVal}>{mol.hybridization}</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Ideal Bond Angle</span>
            <span className={styles.telemetryVal}>{mol.bondAngle}</span>
          </div>
          <div className={styles.telemetryCell}>
            <span className={styles.telemetryLabel}>Lone Pairs</span>
            <span className={styles.telemetryVal}>{mol.lonePairs}</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', color: '#cbd5e1', fontWeight: 600 }}>
            Select Molecular Structure:
          </span>
          {MOLECULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={selectedMolId === m.id ? styles.btnPrimary : styles.btnSecondary}
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
              onClick={() => setSelectedMolId(m.id)}
            >
              {m.formula} ({m.shape})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
