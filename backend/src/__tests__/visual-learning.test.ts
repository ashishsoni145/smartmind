import { describe, it, expect } from 'vitest';
import {
  VISUAL_SIMULATIONS_REGISTRY,
  getSimulationById,
  getSimulationsBySubject,
} from '../../../apps/web/src/components/visual/visual-simulation.contract';

describe('Interactive Visual-Learning Framework (Phase 07 Part 02)', () => {
  it('should maintain a registry of 14 verified academic simulations across Physics, Chemistry, and Math', () => {
    expect(VISUAL_SIMULATIONS_REGISTRY.length).toBe(14);

    const physicsSims = getSimulationsBySubject('physics');
    const chemSims = getSimulationsBySubject('chemistry');
    const mathSims = getSimulationsBySubject('mathematics');

    expect(physicsSims.length).toBe(10);
    expect(chemSims.length).toBe(2);
    expect(mathSims.length).toBe(2);
  });

  it('every simulation must specify accessible fallback explanations and high-yield exam relevance', () => {
    for (const sim of VISUAL_SIMULATIONS_REGISTRY) {
      expect(sim.id).toBeDefined();
      expect(sim.title).toBeDefined();
      expect(sim.learningObjectives.length).toBeGreaterThan(0);
      expect(sim.accessibleFallbackText.length).toBeGreaterThan(20);
      expect(sim.highYieldExamRelevance.length).toBeGreaterThan(10);
      expect(sim.interactionModes.length).toBeGreaterThan(0);
    }
  });

  it('should distinguish between 2D interactive graphs and 3D geometric models without forcing 3D everywhere', () => {
    const d3Sims = VISUAL_SIMULATIONS_REGISTRY.filter((s) => s.is3D);
    const d2Sims = VISUAL_SIMULATIONS_REGISTRY.filter((s) => !s.is3D);

    expect(d3Sims.length).toBeGreaterThan(0);
    expect(d2Sims.length).toBeGreaterThan(0);

    // Verify 3D models are reserved for true spatial concepts (VSEPR, Orbit, Vector Cross Product, Bohr Atom)
    const d3Ids = d3Sims.map((s) => s.id);
    expect(d3Ids).toContain('vsepr_geometry');
    expect(d3Ids).toContain('vector_cross_product');
    expect(d3Ids).toContain('kepler_orbit');
    expect(d3Ids).toContain('bohr_atom');

    // Verify 2D is used for circuits and graphs
    const d2Ids = d2Sims.map((s) => s.id);
    expect(d2Ids).toContain('rectilinear_kinematics');
    expect(d2Ids).toContain('dc_circuit_mesh');
  });

  it('getSimulationById should return matching simulation or undefined', () => {
    const proj = getSimulationById('projectile_motion');
    expect(proj).toBeDefined();
    expect(proj?.title).toContain('2D Projectile');

    const nonExistent = getSimulationById('quantum_teleportation_matrix');
    expect(nonExistent).toBeUndefined();
  });
});
