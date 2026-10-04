import { VisualSimulationMetadata } from '@sharpmind/types';

export const VISUAL_SIMULATIONS_REGISTRY: VisualSimulationMetadata[] = [
  // ---------------------------------------------------------------------------
  // Physics Simulations
  // ---------------------------------------------------------------------------
  {
    id: 'projectile_motion',
    title: '2D Projectile Trajectory & Vectors',
    subject: 'physics',
    topicId: 'top-phy-11-04-01',
    topicTitle: 'Motion in a Plane',
    description: 'Interactive simulation of 2D projectile kinematics with adjustable launch velocity, angle, and gravity.',
    learningObjectives: [
      'Understand independence of horizontal and vertical velocity components.',
      'Visualize maximum height, time of flight, and maximum range at 45 degrees.',
      'Observe velocity and acceleration vectors at each trajectory point.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'Projectile motion decomposes into constant horizontal speed and uniformly accelerated vertical motion under gravity g = 9.8 m/s^2. Range is maximized at 45 degrees without air resistance.',
    highYieldExamRelevance: 'JEE Main & NEET: Minimum 1 question annually on complementary launch angles and trajectory equations.',
  },
  {
    id: 'rectilinear_kinematics',
    title: '1D Kinematics & Motion Graphs',
    subject: 'physics',
    topicId: 'top-phy-11-03-01',
    topicTitle: 'Motion in a Straight Line',
    description: 'Real-time synchronization between moving particle and position-time, velocity-time, and acceleration-time graphs.',
    learningObjectives: [
      'Relate slope of s-t graph to instantaneous velocity.',
      'Understand area under v-t graph as total displacement.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'Area under v-t graph represents displacement; slope of v-t graph represents acceleration.',
    highYieldExamRelevance: 'CBSE & JEE Main: Graphical interpretation questions.',
  },
  {
    id: 'circular_motion',
    title: 'Uniform Circular Motion & Centripetal Acceleration',
    subject: 'physics',
    topicId: 'top-phy-11-04-03',
    topicTitle: 'Circular Motion',
    description: 'Interactive rotation visualizer demonstrating that velocity is tangential while centripetal acceleration is strictly radial.',
    learningObjectives: [
      'Observe direction of centripetal force pointing towards center.',
      'Verify acceleration magnitude a = v^2 / r = omega^2 * r.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'In uniform circular motion, speed is constant but velocity continuously changes direction due to radial inward centripetal acceleration a = v^2/r.',
    highYieldExamRelevance: 'JEE Advanced: Critical for solving banked curves and vertical circle tension.',
  },
  {
    id: 'incline_fbd_pulley',
    title: 'Inclined Plane Free Body Diagram & Pulley',
    subject: 'physics',
    topicId: 'top-phy-11-05-02',
    topicTitle: 'Laws of Motion',
    description: 'Dynamic vector decomposition of normal force, static/kinetic friction, and gravity on an incline.',
    learningObjectives: [
      'Resolve gravitational force into mg*sin(theta) and mg*cos(theta).',
      'Determine conditions for slipping versus impending motion.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'On an incline of angle theta, normal force is N = mg*cos(theta) and parallel force is mg*sin(theta). Friction f <= mu * N opposes relative motion.',
    highYieldExamRelevance: 'JEE Main & Advanced: Core mechanic for block-on-block and constrained pulley systems.',
  },
  {
    id: 'road_banking',
    title: 'Road Banking & Curved Motion Dynamics',
    subject: 'physics',
    topicId: 'top-phy-11-05-03',
    topicTitle: 'Banked Curves',
    description: 'Inspect safe speed limits and angle of banking theta on circular tracks with and without friction.',
    learningObjectives: [
      'Calculate optimum speed v = sqrt(r * g * tan(theta)).',
      'Understand role of horizontal component of normal force.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'Optimum banking angle eliminates tire friction reliance: tan(theta) = v^2 / (r*g).',
    highYieldExamRelevance: 'NEET & JEE: Standard numerical formula questions.',
  },
  {
    id: 'energy_conservation',
    title: 'Mechanical Energy Conservation & Potential Wells',
    subject: 'physics',
    topicId: 'top-phy-11-06-02',
    topicTitle: 'Work, Energy & Power',
    description: 'Continuous conversion between kinetic and potential energy in gravitational fields.',
    learningObjectives: [
      'Verify that total mechanical energy remains invariant in conservative fields.',
      'Understand stable equilibrium as local minimum of potential energy U(x).',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'In an isolated conservative system, Delta E_mech = Delta K + Delta U = 0.',
    highYieldExamRelevance: 'JEE Main: Roller coaster loops and spring-mass systems.',
  },
  {
    id: 'kepler_orbit',
    title: 'Keplerian Orbits & Gravitational Dynamics',
    subject: 'physics',
    topicId: 'top-phy-11-08-01',
    topicTitle: 'Gravitation',
    description: 'Elliptical orbits with equal area sweeps per unit time and angular momentum conservation.',
    learningObjectives: [
      'Visualize Kepler second law (areal velocity is constant).',
      'Observe speed variation: fastest at perihelion, slowest at aphelion.',
    ],
    interactionModes: ['slider', 'rotate', 'inspect'],
    is3D: true,
    accessibleFallbackText: 'Planets sweep equal areas in equal intervals of time due to zero external torque about the central star.',
    highYieldExamRelevance: 'JEE Advanced: Angular momentum conservation in satellite orbits.',
  },
  {
    id: 'point_charge_field',
    title: 'Electrostatic Electric Field Lines & Equipotentials',
    subject: 'physics',
    topicId: 'top-phy-12-01-02',
    topicTitle: 'Electric Charges and Fields',
    description: 'Field line configurations for dipole, like charges, and equipotential orthogonal surfaces.',
    learningObjectives: [
      'Observe that electric field lines never intersect.',
      'Inspect equipotential lines perpendicular to field vectors.',
    ],
    interactionModes: ['drag', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'Electric field lines start on positive charges and terminate on negative charges. Equipotential surfaces are always perpendicular to field lines.',
    highYieldExamRelevance: 'CBSE Board & NEET: Conceptual questions on field properties.',
  },
  {
    id: 'dc_circuit_mesh',
    title: 'DC Circuit Mesh & Kirchhoff Network Solver',
    subject: 'physics',
    topicId: 'top-phy-12-03-02',
    topicTitle: 'Current Electricity',
    description: 'Interactive multiloop resistor network demonstrating Kirchhoff Current Law (junctions) and Voltage Law (loops).',
    learningObjectives: [
      'Verify charge conservation at nodes (sum of I = 0).',
      'Verify energy conservation along closed loops (sum of Delta V = 0).',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'KCL enforces conservation of charge at nodes. KVL enforces conservation of energy around closed loops.',
    highYieldExamRelevance: 'JEE Main: Wheatstone bridge and complex resistor meshes.',
  },
  {
    id: 'double_slit_interference',
    title: 'Young Double Slit Interference & Wave Optics',
    subject: 'physics',
    topicId: 'top-phy-12-10-01',
    topicTitle: 'Wave Optics',
    description: 'Wavefront interference pattern, fringe width beta = lambda * D / d, and phase difference effects.',
    learningObjectives: [
      'Observe bright fringes where path difference Delta x = n * lambda.',
      'Observe dark fringes where path difference Delta x = (2n-1) * lambda / 2.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'Fringe width is given by beta = (lambda * D) / d. Central fringe is always bright (zero path difference).',
    highYieldExamRelevance: 'JEE Main & NEET: Extremely high yield formula and shifting questions.',
  },

  // ---------------------------------------------------------------------------
  // Chemistry Simulations
  // ---------------------------------------------------------------------------
  {
    id: 'bohr_atom',
    title: 'Bohr Atomic Model & Spectral Transitions',
    subject: 'chemistry',
    topicId: 'top-chm-11-02-01',
    topicTitle: 'Structure of Atom',
    description: 'Quantized electron orbits with photon emission and absorption across Lyman, Balmer, and Paschen series.',
    learningObjectives: [
      'Relate orbital radius to principal quantum number: r_n proportional to n^2.',
      'Calculate transition energy Delta E = h * c / lambda = R_H * (1/n1^2 - 1/n2^2).',
    ],
    interactionModes: ['rotate', 'inspect'],
    is3D: true,
    accessibleFallbackText: 'Electrons orbit in quantized angular momentum states L = n*h/(2*pi). Photons are emitted when an electron jumps from a higher to lower level.',
    highYieldExamRelevance: 'NEET & JEE: Hydrogen spectral line frequency calculations.',
  },
  {
    id: 'vsepr_geometry',
    title: 'VSEPR Molecular 3D Geometry',
    subject: 'chemistry',
    topicId: 'top-chm-11-04-01',
    topicTitle: 'Chemical Bonding and Molecular Structure',
    description: 'Interactive 3D molecular structures from linear (AX2) to octahedral (AX6) with lone pair repulsion.',
    learningObjectives: [
      'Understand valence shell electron pair repulsion ordering: lone pair-lone pair > lone pair-bond pair > bond pair-bond pair.',
      'Visualize bond angle distortions in NH3 (107 deg) and H2O (104.5 deg).',
    ],
    interactionModes: ['rotate', 'zoom', 'inspect'],
    is3D: true,
    accessibleFallbackText: 'Electron pairs repel to minimize repulsion. A molecule with 4 bonded pairs and 0 lone pairs forms a regular tetrahedron with 109.5 degree angles.',
    highYieldExamRelevance: 'JEE Main & NEET: Guaranteed questions on hybridization and molecular shape.',
  },

  // ---------------------------------------------------------------------------
  // Mathematics Simulations
  // ---------------------------------------------------------------------------
  {
    id: 'secant_tangent_limit',
    title: 'Secant to Tangent Limit & Derivative Intuition',
    subject: 'mathematics',
    topicId: 'top-mat-11-13-01',
    topicTitle: 'Limits and Derivatives',
    description: 'Observe average rate of change secant slope approach the instantaneous tangent line as Delta x approaches 0.',
    learningObjectives: [
      'Formulate derivative as limit of [f(x+h) - f(x)] / h as h -> 0.',
      'Understand differentiation geometrically as the slope of the curve.',
    ],
    interactionModes: ['slider', 'inspect'],
    is3D: false,
    accessibleFallbackText: 'The derivative f prime(x) is the limit of the secant line slope as the distance h between two points approaches zero.',
    highYieldExamRelevance: 'Calculus Foundation: Required for differential calculus and applications of derivatives.',
  },
  {
    id: 'vector_cross_product',
    title: 'Vector Cross Product & Right-Hand Rule',
    subject: 'mathematics',
    topicId: 'top-mat-12-10-02',
    topicTitle: 'Vector Algebra',
    description: 'Interactive 3D vector rotation displaying cross product vector orthogonal to both operands and parallelogram area.',
    learningObjectives: [
      'Inspect right-hand rule direction for a cross b.',
      'Relate magnitude |a cross b| to area of parallelogram = |a|*|b|*sin(theta).',
    ],
    interactionModes: ['rotate', 'zoom', 'inspect'],
    is3D: true,
    accessibleFallbackText: 'The vector cross product a x b produces a vector perpendicular to the plane of a and b with magnitude |a||b|sin(theta).',
    highYieldExamRelevance: 'JEE Main & Advanced: Torque, angular momentum, and Lorentz magnetic force.',
  },
];

export function getSimulationById(id: string): VisualSimulationMetadata | undefined {
  return VISUAL_SIMULATIONS_REGISTRY.find((sim) => sim.id === id);
}

export function getSimulationsBySubject(subject: 'physics' | 'chemistry' | 'mathematics'): VisualSimulationMetadata[] {
  return VISUAL_SIMULATIONS_REGISTRY.filter((sim) => sim.subject === subject);
}
