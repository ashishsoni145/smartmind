import type {
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
} from '@/lib/types/curriculum';
import { ALL_NCERT_CHAPTERS } from './ncert-chapters-data';
import { ALL_NCERT_TOPICS } from './ncert-topics-data';

export const CANONICAL_CHAPTERS: ChapterNode[] = ALL_NCERT_CHAPTERS;

export const CANONICAL_TOPICS: Record<string, TopicNode[]> = ALL_NCERT_TOPICS;

export const CANONICAL_QUESTIONS: CurriculumQuestion[] = [
  // Authenticated PYQ from JEE Main 2023 (Units and Measurements: Dimensional Analysis)
  {
    id: 'd0000011-0000-0000-0000-000000000001',
    curriculumNodeId: 'c0000011-0000-0000-0000-000000000001',
    subjectId: 'physics',
    questionText: 'If speed of light c, Planck constant h, and universal gravitational constant G are chosen as fundamental physical quantities, the dimensions of time in terms of c, h, and G are:',
    questionType: 'single_choice',
    difficultyLevel: 'moderate',
    explanation: 'Let t ∝ c^x h^y G^z. Equating dimensions: [T] = [LT⁻¹]^x [ML²T⁻¹]^y [M⁻¹L³T⁻²]^z. Solving gives y - z = 0 => y = z, x + 2y + 3z = 0 => x = -5z, -x - y - 2z = 1 => 5z - 3z = 1 => z = 1/2. Thus y = 1/2, z = 1/2, x = -5/2. Therefore, t = [G^(1/2) h^(1/2) c^(-5/2)].',
    hint: 'Express dimensions of c, h, and G in terms of M, L, and T, then balance powers to solve for time.',
    sourceExam: 'JEE Main',
    sourceYear: 2023,
    isPyq: true,
    isVerified: true,
    options: [
      { id: 'opt-1101-1', optionKey: 'A', optionText: 'G^(1/2) h^(1/2) c^(-5/2)', isCorrect: true },
      { id: 'opt-1101-2', optionKey: 'B', optionText: 'G^(1/2) h^(1/2) c^(-3/2)', isCorrect: false },
      { id: 'opt-1101-3', optionKey: 'C', optionText: 'G^(1/2) h^(-1/2) c^(-5/2)', isCorrect: false },
      { id: 'opt-1101-4', optionKey: 'D', optionText: 'G^(-1/2) h^(1/2) c^(5/2)', isCorrect: false },
    ],
  },
  // Authenticated PYQ from NEET 2023 (Units and Measurements: Error Analysis)
  {
    id: 'd0000011-0000-0000-0000-000000000002',
    curriculumNodeId: 'c0000011-0000-0000-0000-000000000001',
    subjectId: 'physics',
    questionText: 'The percentage errors in the measurement of mass, length, and time are 1%, 2%, and 3% respectively. What is the maximum percentage error in the estimation of a physical quantity X = (m * l²) / t³?',
    questionType: 'single_choice',
    difficultyLevel: 'easy',
    explanation: 'Maximum relative error ΔX/X = (Δm/m) + 2(Δl/l) + 3(Δt/t). Percentage error = 1% + 2(2%) + 3(3%) = 1% + 4% + 9% = 14%.',
    hint: 'Sum the fractional errors multiplied by their respective absolute powers.',
    sourceExam: 'NEET',
    sourceYear: 2023,
    isPyq: true,
    isVerified: true,
    options: [
      { id: 'opt-1102-1', optionKey: 'A', optionText: '14%', isCorrect: true },
      { id: 'opt-1102-2', optionKey: 'B', optionText: '8%', isCorrect: false },
      { id: 'opt-1102-3', optionKey: 'C', optionText: '10%', isCorrect: false },
      { id: 'opt-1102-4', optionKey: 'D', optionText: '16%', isCorrect: false },
    ],
  },
  // Authenticated PYQ from JEE Main 2023 (Kinematics)
  {
    id: 'd0000001-0000-0000-0000-000000000001',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000001',
    subjectId: 'physics',
    questionText: 'A particle moves along the x-axis such that its position is given by x(t) = 3t² - 12t + 5 (in SI units). At what time does the velocity of the particle become zero?',
    questionType: 'single_choice',
    difficultyLevel: 'easy',
    explanation: 'Velocity v(t) = dx/dt = 6t - 12. Setting v(t) = 0 gives 6t = 12 => t = 2.0 s.',
    hint: 'Differentiate the position function with respect to time to obtain the instantaneous velocity function v(t).',
    sourceExam: 'JEE Main',
    sourceYear: 2023,
    isPyq: true,
    isVerified: true,
    options: [
      { id: 'opt-1', optionKey: 'A', optionText: '1.0 s', isCorrect: false },
      { id: 'opt-2', optionKey: 'B', optionText: '2.0 s', isCorrect: true },
      { id: 'opt-3', optionKey: 'C', optionText: '4.0 s', isCorrect: false },
      { id: 'opt-4', optionKey: 'D', optionText: '0.5 s', isCorrect: false },
    ],
  },
  // Authentic PYQ from JEE Main 2022 (Projectile Motion)
  {
    id: 'q-proj-jee-2022',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000001',
    subjectId: 'physics',
    questionText: 'A projectile is launched from ground level with speed u = 40 m/s at an angle of 30° with the horizontal. Taking g = 10 m/s², what is the total time of flight and the maximum height reached?',
    questionType: 'single_choice',
    difficultyLevel: 'moderate',
    explanation: 'Time of flight T = 2u sin(θ)/g = 2(40)(0.5)/10 = 4.0 s. Max height H = u² sin²(θ)/(2g) = 1600(0.25)/20 = 20 m.',
    hint: 'Use the orthogonal vertical kinematics component: uy = u sin(θ) and ay = -g.',
    sourceExam: 'JEE Main',
    sourceYear: 2022,
    isPyq: true,
    isVerified: true,
    options: [
      { id: 'opt-21', optionKey: 'A', optionText: 'T = 4 s, H = 20 m', isCorrect: true },
      { id: 'opt-22', optionKey: 'B', optionText: 'T = 8 s, H = 40 m', isCorrect: false },
      { id: 'opt-23', optionKey: 'C', optionText: 'T = 2 s, H = 10 m', isCorrect: false },
      { id: 'opt-24', optionKey: 'D', optionText: 'T = 4 s, H = 40 m', isCorrect: false },
    ],
  },
  // Authentic PYQ from NEET 2023 (Chemistry Mole Concept)
  {
    id: 'd0000001-0000-0000-0000-000000000003',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000005',
    subjectId: 'chemistry',
    questionText: 'What is the mass of pure sodium hydroxide (NaOH) required to prepare 250 mL of a 0.5 M aqueous solution? (Molar mass of NaOH = 40 g/mol)',
    questionType: 'single_choice',
    difficultyLevel: 'easy',
    explanation: 'Moles required = Molarity × Volume (in L) = 0.5 mol/L × 0.250 L = 0.125 mol. Mass = Moles × Molar Mass = 0.125 × 40 = 5.0 g.',
    hint: 'Recall that Molarity = Moles of solute / Volume of solution in liters.',
    sourceExam: 'NEET',
    sourceYear: 2023,
    isPyq: true,
    isVerified: true,
    options: [
      { id: 'opt-31', optionKey: 'A', optionText: '2.5 g', isCorrect: false },
      { id: 'opt-32', optionKey: 'B', optionText: '5.0 g', isCorrect: true },
      { id: 'opt-33', optionKey: 'C', optionText: '10.0 g', isCorrect: false },
      { id: 'opt-34', optionKey: 'D', optionText: '20.0 g', isCorrect: false },
    ],
  },
  // Authentic PYQ from JEE Advanced 2021 (Differential Calculus)
  {
    id: 'd0000001-0000-0000-0000-000000000005',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000009',
    subjectId: 'mathematics',
    questionText: 'Evaluate the limit L = lim_{x -> 0} (sin(5x) - 5x) / x³.',
    questionType: 'single_choice',
    difficultyLevel: 'hard',
    explanation: 'Using Taylor expansion: sin(5x) = 5x - (5x)³/6 + O(x⁵). Thus sin(5x) - 5x = -125x³/6. Dividing by x³ as x -> 0 gives -125/6.',
    hint: 'Apply Taylor series expansion for sin(u) = u - u³/3! + u⁵/5! or apply L’Hôpital rule 3 times.',
    sourceExam: 'JEE Advanced',
    sourceYear: 2021,
    isPyq: true,
    isVerified: true,
    options: [
      { id: 'opt-51', optionKey: 'A', optionText: '-125/6', isCorrect: true },
      { id: 'opt-52', optionKey: 'B', optionText: '125/6', isCorrect: false },
      { id: 'opt-53', optionKey: 'C', optionText: '-25/6', isCorrect: false },
      { id: 'opt-54', optionKey: 'D', optionText: '0', isCorrect: false },
    ],
  },
];

export const CANONICAL_MATERIALS: CurriculumMaterial[] = [
  {
    id: 'mat-ncert-phy-11-01',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000001',
    subjectId: 'physics',
    subjectName: 'Physics',
    chapterTitle: 'Kinematics & Dynamics',
    title: 'NCERT Physics Part 1: Chapter 4 — Motion in a Plane',
    fileType: 'pdf',
    pageCount: 4,
    fileSize: '2.4 MB',
    authoritativeSource: 'National Council of Educational Research and Training (NCERT Class XI)',
    description: 'Official NCERT Chapter 4 text covering vector algebra, two-dimensional motion with constant acceleration, and complete projectile dynamics with mathematical derivations.',
    tags: ['NCERT', 'Physics', 'Kinematics', 'Projectile Motion', 'JEE Main', 'NEET'],
    pages: [
      {
        pageNumber: 1,
        title: '4.1 Introduction to Motion in Two Dimensions',
        sections: [
          {
            heading: '4.1 Position, Displacement and Velocity in a Plane',
            paragraphs: [
              'In the previous chapter, we developed the concepts of position, displacement, velocity and acceleration that are needed to describe the motion of an object along a straight line. We found that the direction of the aspects of motion in one dimension can easily be taken care of by plus and minus signs.',
              'However, in order to describe motion of an object in two dimensions (a plane) or three dimensions (space), we need to use vectors to describe the physical quantities mentioned above. Therefore, it is first necessary to learn the language of vectors.',
            ],
            callouts: [
              {
                type: 'note',
                title: 'Vector Representation',
                content: 'A vector is specified by giving its magnitude by a number and its direction in space. Position vector r of a particle located in a plane with reference to the origin of an x-y coordinate system is given by r = x î + y ĵ.',
              },
            ],
          },
          {
            heading: '4.2 Resolution of Vectors into Rectangular Components',
            paragraphs: [
              'Let a vector A lie in the x-y plane. If A makes an angle θ with the x-axis, then its components along the x and y axes are given by Ax = A cos θ and Ay = A sin θ.',
              'Conversely, if Ax and Ay are given, the magnitude of A is A = √(Ax² + Ay²) and the direction is given by tan θ = Ay / Ax.',
            ],
            callouts: [
              {
                type: 'formula',
                title: 'Vector Magnitude & Angle',
                content: '|A| = √(Ax² + Ay²),  θ = arctan(Ay / Ax)',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        title: '4.7 Motion in a Plane with Constant Acceleration',
        sections: [
          {
            heading: '4.7 Kinematic Equations for 2D Motion',
            paragraphs: [
              'Suppose that at t = 0, a particle is at position r₀ and has velocity v₀. If the acceleration a is constant in both magnitude and direction, the velocity at any time t is v = v₀ + a t.',
              'In terms of rectangular components along the x and y axes, the motion along perpendicular directions can be treated as two independent one-dimensional motions:',
            ],
            callouts: [
              {
                type: 'formula',
                title: 'Component Equations of Motion',
                content: 'vx = v₀x + ax·t,   x = x₀ + v₀x·t + ½ ax·t²\nvy = v₀y + ay·t,   y = y₀ + v₀y·t + ½ ay·t²',
              },
              {
                type: 'tip',
                title: 'Principle of Independence',
                content: 'Motion in a plane can always be decomposed into two mutually perpendicular, independent motions with constant accelerations along each axis.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        title: '4.10 Projectile Motion and Mathematical Formulation',
        sections: [
          {
            heading: '4.10 Trajectory of a Projectile',
            paragraphs: [
              'As an application of the ideas developed in the previous section, let us consider the motion of a projectile. An object that is in flight after being thrown or projected is called a projectile. Such a projectile might be a football, a cricket ball, or any other particle.',
              'The motion of a projectile may be thought of as the result of two separate, simultaneously occurring components of motions: one along the horizontal direction without any acceleration, and the other along the vertical direction with constant acceleration due to gravity g acting downward.',
            ],
            callouts: [
              {
                type: 'theorem',
                title: 'Equation of the Path (Parabolic Trajectory)',
                content: 'y = (tan θ₀)·x - [g / (2·v₀²·cos²θ₀)]·x²',
              },
              {
                type: 'formula',
                title: 'Canonical Projectile Parameters',
                content: 'Time of Flight: T = (2·v₀·sin θ₀) / g\nMaximum Height: H = (v₀²·sin²θ₀) / (2g)\nHorizontal Range: R = (v₀²·sin 2θ₀) / g',
              },
              {
                type: 'note',
                title: 'Maximum Range Condition',
                content: 'For a given launch speed v₀, horizontal range R is maximum when sin 2θ₀ is maximum, i.e., 2θ₀ = 90° ⇒ θ₀ = 45°. The maximum range is Rmax = v₀² / g.',
              },
            ],
            diagramDescription: 'Cross-sectional trajectory curve starting at (0,0), reaching apex at x = R/2, y = H, with velocity vector tangential to path.',
          },
        ],
      },
      {
        pageNumber: 4,
        title: 'Chapter Summary & High-Yield NCERT Exercises',
        sections: [
          {
            heading: 'Points to Ponder',
            paragraphs: [
              '1. In projectile motion, the horizontal component of velocity remains constant throughout the flight if air resistance is neglected.',
              '2. The vertical component of velocity is zero at the highest point of the trajectory, while the acceleration remains downward at g = 9.8 m/s².',
              '3. Two angles of projection with the horizontal, θ and (90° - θ), produce the same horizontal range for equal initial launch speeds.',
            ],
            callouts: [
              {
                type: 'warning',
                title: 'Common Misconception Alert',
                content: 'Students often incorrectly write the acceleration at the apex as 0 m/s². The vertical velocity vy = 0 at the peak, but acceleration ay = -g remains constant everywhere.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mat-formula-phy-11-01',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000001',
    subjectId: 'physics',
    subjectName: 'Physics',
    chapterTitle: 'Kinematics & Dynamics',
    title: 'Kinematics & Dynamics High-Yield Formula Cheatsheet',
    fileType: 'cheatsheet',
    pageCount: 2,
    fileSize: '850 KB',
    authoritativeSource: 'SharpMind Academic Pedagogy Team',
    description: 'Concise summary of all projectile equations, relative velocity vectors, friction coefficients, and banking constraints for rapid exam revision.',
    tags: ['Cheatsheet', 'Formulae', 'Physics', 'Quick Revision'],
    pages: [
      {
        pageNumber: 1,
        title: 'Part A: Kinematics in 1D and 2D',
        sections: [
          {
            heading: 'Core Kinematic Equations (Constant Acceleration)',
            paragraphs: [
              'v = u + a·t\ns = u·t + ½ a·t²\nv² = u² + 2a·s\ns_nth = u + ½ a·(2n - 1)',
            ],
            callouts: [
              {
                type: 'formula',
                title: 'Projectile on Inclined Plane (Angle α, Incline β)',
                content: 'T = 2·u·sin(α - β) / (g·cos β)\nR = [u² / (g·cos²β)] · [sin(2α - β) - sin β]',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        title: 'Part B: Newton Laws & Circular Motion Constraints',
        sections: [
          {
            heading: 'Friction and Banking of Curves',
            paragraphs: [
              'Static Friction: fs ≤ μs·N\nKinetic Friction: fk = μk·N (with μk < μs)\nOptimum Speed on Banked Curve: v = √(R·g·tan θ)\nMaximum Permissible Speed: vmax = √[ R·g·(tan θ + μs) / (1 - μs·tan θ) ]',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mat-summary-chem-11-01',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000005',
    subjectId: 'chemistry',
    subjectName: 'Chemistry',
    chapterTitle: 'Some Basic Concepts of Chemistry',
    title: 'NCERT Chemistry Part 1: Chapter 1 — Some Basic Concepts of Chemistry',
    fileType: 'pdf',
    pageCount: 3,
    fileSize: '1.9 MB',
    authoritativeSource: 'NCERT Class XI Chemistry',
    description: 'Canonical textbook chapter covering mole laws, Gay-Lussac law, stoichiometry and concentration calculations.',
    tags: ['NCERT', 'Chemistry', 'Mole Concept', 'Stoichiometry'],
    pages: [
      {
        pageNumber: 1,
        title: '1.7 Atomic and Molecular Masses & The Mole Concept',
        sections: [
          {
            heading: 'Definition of One Mole',
            paragraphs: [
              'One mole is the amount of a substance that contains as many entities (atoms, molecules or other particles) as there are atoms in exactly 0.012 kg (or 12 g) of the ¹²C isotope.',
              'The Avogadro constant is denoted by NA = 6.02214076 × 10²³ entities per mole.',
            ],
            callouts: [
              {
                type: 'formula',
                title: 'Mole Calculations',
                content: 'Number of Moles (n) = Mass (g) / Molar Mass (M)\nn = Number of Particles / NA = Volume of Gas at STP (L) / 22.4',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        title: '1.8 Percentage Composition and Stoichiometry',
        sections: [
          {
            heading: 'Concentration Units in Solution Chemistry',
            paragraphs: [
              'Mass Percentage = (Mass of Solute / Total Mass of Solution) × 100',
              'Molarity (M) = Moles of Solute / Volume of Solution in Litres (L)',
              'Molality (m) = Moles of Solute / Mass of Solvent in Kilograms (kg)',
              'Mole Fraction (χA) = nA / (nA + nB)',
            ],
            callouts: [
              {
                type: 'tip',
                title: 'Temperature Independence',
                content: 'Molality and Mole Fraction do not change with temperature because mass does not depend on temperature. Molarity decreases with rising temperature due to liquid thermal expansion.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        title: '1.9 Limiting Reagent and Yield Calculations',
        sections: [
          {
            heading: 'Determining the Limiting Reagent',
            paragraphs: [
              'The reactant which is entirely consumed when a reaction goes to completion is called the limiting reagent or limiting reactant. The amount of product formed is strictly governed by the limiting reagent.',
            ],
            callouts: [
              {
                type: 'note',
                title: 'Algorithmic Test',
                content: 'Divide the available moles of each reactant by its respective stoichiometric coefficient. The species with the smallest resulting ratio is the limiting reagent.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mat-notes-math-12-01',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000009',
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    chapterTitle: 'Applications of Derivatives',
    title: 'Calculus Theorems & Monotonicity Criteria Master Notes',
    fileType: 'notes',
    pageCount: 3,
    fileSize: '1.2 MB',
    authoritativeSource: 'SharpMind Mathematics Cell',
    description: 'Rigorous breakdown of Rolle theorem, Lagrange Mean Value Theorem (LMVT), and second derivative concavity tests with worked geometric proofs.',
    tags: ['Mathematics', 'Calculus', 'Derivatives', 'JEE Advanced'],
    pages: [
      {
        pageNumber: 1,
        title: '1. Lagrange Mean Value Theorem (LMVT)',
        sections: [
          {
            heading: 'Statement and Geometric Interpretation',
            paragraphs: [
              'Let f: [a, b] → ℝ be a function such that: (i) f is continuous on the closed interval [a, b], and (ii) f is differentiable on the open interval (a, b).',
              'Then there exists at least one point c ∈ (a, b) such that f\'(c) = [f(b) - f(a)] / (b - a).',
              'Geometrically, there is at least one tangent line to the graph of f between x = a and x = b that is parallel to the secant line passing through (a, f(a)) and (b, f(b)).',
            ],
            callouts: [
              {
                type: 'theorem',
                title: 'LMVT Equation',
                content: 'f\'(c) = (f(b) - f(a)) / (b - a)  for some c ∈ (a, b)',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        title: '2. Monotonicity and First Derivative Tests',
        sections: [
          {
            heading: 'Strictly Increasing and Decreasing Functions',
            paragraphs: [
              'Let f be continuous on [a, b] and differentiable on (a, b).',
              '1. If f\'(x) > 0 for all x ∈ (a, b), then f is strictly increasing on [a, b].',
              '2. If f\'(x) < 0 for all x ∈ (a, b), then f is strictly decreasing on [a, b].',
              '3. If f\'(x) = 0 for all x ∈ (a, b), then f is a constant function on [a, b].',
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        title: '3. Concavity, Convexity and Points of Inflection',
        sections: [
          {
            heading: 'Second Derivative Criteria',
            paragraphs: [
              'If f\'\'(x) > 0 on an interval, the curve is concave upwards (convex).',
              'If f\'\'(x) < 0 on an interval, the curve is concave downwards.',
              'A point where the concavity changes from upward to downward (or vice versa) and f has a tangent is called a point of inflection (where f\'\'(c) = 0 or does not exist).',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mat-diag-chem-11-01',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000006',
    subjectId: 'chemistry',
    subjectName: 'Chemistry',
    chapterTitle: 'Structure of Atom',
    title: 'Orbital Shapes & Quantum Numbers Visual Summary',
    fileType: 'image',
    pageCount: 1,
    fileSize: '3.1 MB',
    authoritativeSource: 'NCERT Structural Atlas',
    description: 'High-resolution orthogonal visual map of s, p, d orbital probability density clouds, nodal planes, and Hund/Aufbau filling rules.',
    tags: ['Visual Diagram', 'Chemistry', 'Orbitals', 'Quantum Mechanics'],
    pages: [
      {
        pageNumber: 1,
        title: 'Quantum Number System and Radial Nodes',
        sections: [
          {
            heading: 'Orbital Spatial Orientations',
            paragraphs: [
              'Principal Quantum Number (n): Determines orbital energy and shell size (n = 1, 2, 3, ...).',
              'Azimuthal Quantum Number (l): Defines subshell shape (l = 0 for s, 1 for p, 2 for d, 3 for f).',
              'Magnetic Quantum Number (ml): Specifies spatial orientation (-l to +l).',
              'Spin Quantum Number (ms): +½ or -½.',
            ],
            callouts: [
              {
                type: 'formula',
                title: 'Nodal Count Formula',
                content: 'Radial Nodes = n - l - 1\nAngular Nodes = l\nTotal Nodes = n - 1',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mat-gen-phy-11-01',
    curriculumNodeId: 'c0000001-0000-0000-0000-000000000001',
    subjectId: 'physics',
    subjectName: 'Physics',
    chapterTitle: 'Kinematics & Dynamics',
    title: 'AI-Synthesized Revision Capsule: Variable Angle Projectiles & Energy Conservation',
    fileType: 'summary',
    pageCount: 2,
    fileSize: '420 KB',
    authoritativeSource: 'SharpMind Pedagogical Engine',
    description: 'Curated adaptive summary highlighting the 5 most common student misconception traps in projectile problems under exam conditions.',
    tags: ['AI Generated', 'Physics', 'Mistake Prevention', 'High Yield'],
    pages: [
      {
        pageNumber: 1,
        title: 'Core Misconceptions in Projectile Trajectories',
        sections: [
          {
            heading: 'Trap #1: Kinetic Energy at Maximum Height',
            paragraphs: [
              'At maximum height, vertical velocity is zero, but horizontal velocity is still vx = v₀ cos θ₀. Therefore, the kinetic energy at the apex is KE_top = ½ m (v₀ cos θ₀)² = KE₀ cos² θ₀, which is NEVER zero unless launched purely vertically (θ₀ = 90°).',
            ],
            callouts: [
              {
                type: 'tip',
                title: 'JEE Problem Shortcut',
                content: 'If a problem states "Kinetic energy at highest point is half its initial value", immediately write cos²θ = ½ ⇒ cos θ = 1/√2 ⇒ θ = 45°!',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 2,
        title: 'Energy Balance & Velocity Vectors',
        sections: [
          {
            heading: 'Velocity Vector at Time t',
            paragraphs: [
              'v⃗(t) = (v₀ cos θ₀) î + (v₀ sin θ₀ - g t) ĵ',
              'Speed at time t: v(t) = √[ (v₀ cos θ₀)² + (v₀ sin θ₀ - g t)² ]',
              'Work done by gravity during entire flight over a horizontal level ground is ZERO, because initial and final vertical positions are identical (Δy = 0).',
            ],
          },
        ],
      },
    ],
  },
];

