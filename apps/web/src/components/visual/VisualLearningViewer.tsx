import React from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './VisualLearningViewer.module.css';

// Dedicated Modular Simulations
import { ProjectileSimulation } from './simulations/ProjectileSimulation';
import { RectilinearKinematicsSimulation } from './simulations/RectilinearKinematicsSimulation';
import { CircularMotionSimulation } from './simulations/CircularMotionSimulation';
import { InclineFbdSimulation } from './simulations/InclineFbdSimulation';
import { RoadBankingSimulation } from './simulations/RoadBankingSimulation';
import { EnergyConservationSimulation } from './simulations/EnergyConservationSimulation';
import { KeplerOrbitSimulation } from './simulations/KeplerOrbitSimulation';
import { PointChargeFieldSimulation } from './simulations/PointChargeFieldSimulation';
import { DcCircuitMeshSimulation } from './simulations/DcCircuitMeshSimulation';
import { DoubleSlitInterferenceSimulation } from './simulations/DoubleSlitInterferenceSimulation';
import { BohrAtomSimulation } from './simulations/BohrAtomSimulation';
import { VseprGeometrySimulation } from './simulations/VseprGeometrySimulation';
import { SecantTangentLimitSimulation } from './simulations/SecantTangentLimitSimulation';
import { VectorCrossProductSimulation } from './simulations/VectorCrossProductSimulation';

export interface VisualLearningViewerProps {
  simulationId?: string;
  title?: string;
  topicTitle?: string;
  onClose?: () => void;
}

export const VisualLearningViewer: React.FC<VisualLearningViewerProps> = ({
  simulationId,
  title,
  topicTitle,
  onClose,
}) => {
  switch (simulationId) {
    case 'projectile_motion':
      return <ProjectileSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'rectilinear_kinematics':
      return <RectilinearKinematicsSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'circular_motion':
      return <CircularMotionSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'incline_fbd_pulley':
      return <InclineFbdSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'road_banking':
      return <RoadBankingSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'energy_conservation':
      return <EnergyConservationSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'kepler_orbit':
      return <KeplerOrbitSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'point_charge_field':
      return <PointChargeFieldSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'dc_circuit_mesh':
      return <DcCircuitMeshSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'double_slit_interference':
      return <DoubleSlitInterferenceSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'bohr_atom':
      return <BohrAtomSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'vsepr_geometry':
      return <VseprGeometrySimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'secant_tangent_limit':
      return <SecantTangentLimitSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    case 'vector_cross_product':
      return <VectorCrossProductSimulation title={title} topicTitle={topicTitle} onClose={onClose} />;

    default:
      // Default fallback for topics without a dedicated 3D canvas simulation
      return (
        <div className={styles.viewerContainer}>
          <header className={styles.viewerHeader}>
            <div className={styles.headerTitleArea}>
              <div className={styles.simBadge}>
                <Icon name="bookOpen" size="xs" />
                <span>NCERT CONCEPT GUIDE</span>
              </div>
              <h2 className={styles.title}>{title || 'NCERT Core Theory & Formulas'}</h2>
              <span className={styles.topicSubtitle}>{topicTitle || 'Mastery Module'}</span>
            </div>
            {onClose && (
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                <Icon name="close" size="sm" />
              </button>
            )}
          </header>

          <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Icon name="sparkles" size="md" />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  NCERT Master Derivations & Core Insights
                </h3>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '14px', margin: 0 }}>
                This section covers fundamental concepts formulated according to the latest rationalised NCERT syllabus. Review key principles, dimensional analysis, and standard test patterns.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                  Exam High-Yield Pointers
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: 1.6 }}>
                  <li>Focus on NCERT in-text examples and exercise problems.</li>
                  <li>Verify standard sign conventions and SI base units.</li>
                  <li>Review step-by-step mathematical reasoning.</li>
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ color: '#10b981', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                  Interactive Practice
                </div>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', lineHeight: 1.6 }}>
                  Practice diagnostic MCQs, analytical numericals, and concept checkpoint questions in the assessment panel below.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }
};
