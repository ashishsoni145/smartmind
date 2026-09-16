import React, { useEffect } from 'react';
import type { CurriculumMaterial } from '@/lib/types/curriculum';
import { Icon } from '@/components/ui/Icon';
import styles from './ImageViewerModal.module.css';

interface ImageViewerModalProps {
  material: CurriculumMaterial;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  material,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-viewer-title"
    >
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <div className={styles.titleInfo}>
            <h2 id="image-viewer-title" className={styles.title}>
              {material.title}
            </h2>
            <p className={styles.subtitle}>
              {material.subjectName} • {material.authoritativeSource || 'SharpMind Academic Visual Atlas'}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        <div className={styles.canvasArea}>
          {/* High-fidelity SVG diagram for orbital shapes / quantum numbers */}
          <svg
            viewBox="0 0 800 450"
            className={styles.diagramSvg}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={material.title}
          >
            <rect width="800" height="450" fill="#0f172a" rx="8" />
            {/* Grid backdrop */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
              <radialGradient id="sOrbitalGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="pLobe1" cx="50%" cy="30%" r="40%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#be123c" stopOpacity="0.1" />
              </radialGradient>
              <radialGradient id="pLobe2" cx="50%" cy="70%" r="40%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <rect width="800" height="450" fill="url(#grid)" />

            {/* Orbitals 1: s-orbital */}
            <g transform="translate(130, 210)">
              <circle cx="0" cy="0" r="70" fill="url(#sOrbitalGrad)" />
              <circle cx="0" cy="0" r="2" fill="#ffffff" />
              <line x1="-85" y1="0" x2="85" y2="0" stroke="#475569" strokeDasharray="3,3" />
              <line x1="0" y1="-85" x2="0" y2="85" stroke="#475569" strokeDasharray="3,3" />
              <text x="0" y="115" fill="#f8fafc" fontSize="14" fontWeight="600" textAnchor="middle">
                1s Orbital (l = 0, m = 0)
              </text>
              <text x="0" y="135" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Spherical Symmetrical • 0 Nodal Planes
              </text>
            </g>

            {/* Orbitals 2: 2px orbital */}
            <g transform="translate(400, 210)">
              <ellipse cx="0" cy="-45" rx="35" ry="50" fill="url(#pLobe1)" />
              <ellipse cx="0" cy="45" rx="35" ry="50" fill="url(#pLobe2)" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <line x1="-85" y1="0" x2="85" y2="0" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="0" y1="-95" x2="0" y2="95" stroke="#475569" strokeDasharray="3,3" />
              <text x="0" y="115" fill="#f8fafc" fontSize="14" fontWeight="600" textAnchor="middle">
                2pz Orbital (l = 1, m = 0)
              </text>
              <text x="0" y="135" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Dumbbell Lobe • xy Nodal Plane
              </text>
            </g>

            {/* Orbitals 3: 3d orbital */}
            <g transform="translate(660, 210)">
              <ellipse cx="-35" cy="-35" rx="28" ry="40" transform="rotate(-45 -35 -35)" fill="url(#pLobe1)" />
              <ellipse cx="35" cy="35" rx="28" ry="40" transform="rotate(-45 35 35)" fill="url(#pLobe1)" />
              <ellipse cx="35" cy="-35" rx="28" ry="40" transform="rotate(45 35 -35)" fill="url(#pLobe2)" />
              <ellipse cx="-35" cy="35" rx="28" ry="40" transform="rotate(45 -35 35)" fill="url(#pLobe2)" />
              <circle cx="0" cy="0" r="3" fill="#ffffff" />
              <line x1="-85" y1="0" x2="85" y2="0" stroke="#475569" strokeDasharray="3,3" />
              <line x1="0" y1="-85" x2="0" y2="85" stroke="#475569" strokeDasharray="3,3" />
              <text x="0" y="115" fill="#f8fafc" fontSize="14" fontWeight="600" textAnchor="middle">
                3d(x²-y²) Orbital (l = 2)
              </text>
              <text x="0" y="135" fill="#94a3b8" fontSize="12" textAnchor="middle">
                Cloverleaf • 2 Angular Nodal Planes
              </text>
            </g>

            {/* Header branding */}
            <text x="30" y="45" fill="#60a5fa" fontSize="16" fontWeight="700">
              NCERT CHEMICAL STRUCTURE ATLAS
            </text>
            <text x="30" y="68" fill="#94a3b8" fontSize="12">
              Angular Wavefunction & Probability Density Distribution | Class 11 Chemistry Chapter 2
            </text>
          </svg>
        </div>

        {material.description && (
          <div className={styles.captionArea}>
            <p style={{ margin: 0 }}>{material.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
