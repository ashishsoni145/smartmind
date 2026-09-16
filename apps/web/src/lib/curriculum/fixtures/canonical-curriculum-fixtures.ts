import type {
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
} from '@/lib/types/curriculum';

export const CANONICAL_CHAPTERS: ChapterNode[] = [
  // Physics Class 11
  {
    id: 'c0000001-0000-0000-0000-000000000001',
    subjectId: 'physics',
    gradeId: 'class_11',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'PHY-11-01',
    title: 'Kinematics & Laws of Motion',
    description: 'Vectors, 1D/2D projectile motion, Newton laws, friction, and circular dynamics.',
    sequenceOrder: 1,
    weightagePercent: 8.5,
    topicsCount: 4,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'math-basic', title: 'Calculus Fundamentals (Differentiation & Integration)', met: true, code: 'MATH-FOUND' },
    ],
  },
  {
    id: 'c0000001-0000-0000-0000-000000000002',
    subjectId: 'physics',
    gradeId: 'class_11',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'PHY-11-02',
    title: 'Work, Energy & Power',
    description: 'Conservative forces, work-energy theorem, collisions and potential energy curves.',
    sequenceOrder: 2,
    weightagePercent: 7.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000001', title: 'Kinematics & Laws of Motion', met: false, code: 'PHY-11-01' },
    ],
  },
  // Physics Class 12
  {
    id: 'c0000001-0000-0000-0000-000000000003',
    subjectId: 'physics',
    gradeId: 'class_12',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'PHY-12-01',
    title: 'Electrostatics & Gauss Law',
    description: 'Coulomb law, electric field, potential, flux, Gauss law and capacitors.',
    sequenceOrder: 1,
    weightagePercent: 9.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000001', title: 'Vectors & 2D Motion', met: true, code: 'PHY-11-01' },
    ],
  },
  {
    id: 'c0000001-0000-0000-0000-000000000004',
    subjectId: 'physics',
    gradeId: 'class_12',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'PHY-12-02',
    title: 'Current Electricity & Magnetism',
    description: 'Ohm law, Kirchhoff laws, Biot-Savart law, Ampere circuital law and Lorentz force.',
    sequenceOrder: 2,
    weightagePercent: 9.5,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000003', title: 'Electrostatics & Potential', met: false, code: 'PHY-12-01' },
    ],
  },

  // Chemistry Class 11
  {
    id: 'c0000001-0000-0000-0000-000000000005',
    subjectId: 'chemistry',
    gradeId: 'class_11',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'CHEM-11-01',
    title: 'Some Basic Concepts of Chemistry',
    description: 'Mole concept, stoichiometry, empirical formulas, and concentration terms.',
    sequenceOrder: 1,
    weightagePercent: 6.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [],
  },
  {
    id: 'c0000001-0000-0000-0000-000000000006',
    subjectId: 'chemistry',
    gradeId: 'class_11',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'CHEM-11-02',
    title: 'Structure of Atom & Chemical Bonding',
    description: 'Bohr model, quantum numbers, orbital overlap, VSEPR theory, and hybridization.',
    sequenceOrder: 2,
    weightagePercent: 8.5,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000005', title: 'Some Basic Concepts of Chemistry', met: true, code: 'CHEM-11-01' },
    ],
  },
  // Chemistry Class 12
  {
    id: 'c0000001-0000-0000-0000-000000000007',
    subjectId: 'chemistry',
    gradeId: 'class_12',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'CHEM-12-01',
    title: 'Chemical Kinetics & Solutions',
    description: 'Rate laws, Arrhenius equation, colligative properties, and Raoult law.',
    sequenceOrder: 1,
    weightagePercent: 8.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000005', title: 'Mole Concept & Solutions', met: true, code: 'CHEM-11-01' },
    ],
  },

  // Mathematics Class 11
  {
    id: 'c0000001-0000-0000-0000-000000000008',
    subjectId: 'mathematics',
    gradeId: 'class_11',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'MATH-11-01',
    title: 'Sets, Relations & Functions',
    description: 'Domain, range, composite functions, and trigonometric identities.',
    sequenceOrder: 1,
    weightagePercent: 7.5,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [],
  },
  // Mathematics Class 12
  {
    id: 'c0000001-0000-0000-0000-000000000009',
    subjectId: 'mathematics',
    gradeId: 'class_12',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'MATH-12-01',
    title: 'Differential Calculus',
    description: 'Limits, continuity, differentiability, maxima-minima, and tangents-normals.',
    sequenceOrder: 1,
    weightagePercent: 11.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000008', title: 'Functions & Graphs', met: true, code: 'MATH-11-01' },
    ],
  },
  {
    id: 'c0000001-0000-0000-0000-000000000010',
    subjectId: 'mathematics',
    gradeId: 'class_12',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'MATH-12-02',
    title: 'Integral Calculus',
    description: 'Indefinite integration, definite integrals properties, and areas under curves.',
    sequenceOrder: 2,
    weightagePercent: 11.5,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000009', title: 'Differential Calculus', met: false, code: 'MATH-12-01' },
    ],
  },

  // Biology Class 11
  {
    id: 'c0000001-0000-0000-0000-000000000011',
    subjectId: 'biology',
    gradeId: 'class_11',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'BIO-11-01',
    title: 'Cell Structure & Biomolecules',
    description: 'Prokaryotic vs eukaryotic organization, mitosis/meiosis, proteins, enzymes, nucleic acids.',
    sequenceOrder: 1,
    weightagePercent: 8.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [],
  },
  // Biology Class 12
  {
    id: 'c0000001-0000-0000-0000-000000000012',
    subjectId: 'biology',
    gradeId: 'class_12',
    boardId: 'cbse',
    parentId: null,
    nodeType: 'chapter',
    code: 'BIO-12-01',
    title: 'Genetics & Molecular Inheritance',
    description: 'Mendelian genetics, chromosome theory, DNA replication, transcription, and translation.',
    sequenceOrder: 1,
    weightagePercent: 12.0,
    topicsCount: 3,
    masteryStatus: 'uncalibrated',
    masteryProbability: 0.1,
    retentionPercent: 100,
    readinessScore: 0,
    prerequisites: [
      { id: 'c0000001-0000-0000-0000-000000000011', title: 'Cell Structure & Nucleic Acids', met: true, code: 'BIO-11-01' },
    ],
  },
];

export const CANONICAL_TOPICS: Record<string, TopicNode[]> = {
  // PHY-11-01 Kinematics
  'c0000001-0000-0000-0000-000000000001': [
    {
      id: 'phy-11-01-t01',
      subjectId: 'physics',
      gradeId: 'class_11',
      boardId: 'cbse',
      parentId: 'c0000001-0000-0000-0000-000000000001',
      nodeType: 'topic',
      code: 'PHY-11-01-T01',
      title: 'Rectilinear Motion & Calculus Approach',
      description: 'Position-time graphs, instantaneous velocity, uniform acceleration, and stopping distances.',
      sequenceOrder: 1,
      weightagePercent: 2.5,
      estimatedMinutes: 45,
      masteryStatus: 'uncalibrated',
      retentionPercent: 100,
      prerequisites: [
        { id: 'math-diff-basic', title: 'Basic Derivatives: dx/dt and d²x/dt²', met: true },
      ],
      concepts: [
        {
          id: 'c-rect-01',
          title: 'Instantaneous Kinematics',
          summary: 'Velocity is defined as the time derivative of position v(t) = dx/dt, and acceleration is a(t) = dv/dt = d²x/dt².',
          coreFormulas: [
            { label: 'Instantaneous Velocity', formula: 'v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt}' },
            { label: 'Instantaneous Acceleration', formula: 'a = \\frac{dv}{dt} = v \\frac{dv}{dx}' },
            { label: 'Displacement with Const Acc', formula: 's = ut + \\frac{1}{2}at^2' },
          ],
          visualLearningType: 'simulation',
          visualLearningTitle: 'Interactive 1D Motion Grapher',
          visualLearningDescription: 'Real-time interactive plot mapping position, velocity, and acceleration curves with variable drag parameters.',
        },
      ],
    },
    {
      id: 'phy-11-01-t02',
      subjectId: 'physics',
      gradeId: 'class_11',
      boardId: 'cbse',
      parentId: 'c0000001-0000-0000-0000-000000000001',
      nodeType: 'topic',
      code: 'PHY-11-01-T02',
      title: 'Vectors & 2D Projectile Motion',
      description: 'Orthogonal decomposition, trajectory equations, time of flight, horizontal range, and maximum height.',
      sequenceOrder: 2,
      weightagePercent: 3.0,
      estimatedMinutes: 60,
      masteryStatus: 'uncalibrated',
      retentionPercent: 100,
      prerequisites: [
        { id: 'phy-11-01-t01', title: 'Rectilinear Motion', met: true },
      ],
      concepts: [
        {
          id: 'c-proj-01',
          title: 'Parabolic Trajectory & Range',
          summary: 'Motion in 2D is resolved into independent horizontal (ax = 0) and vertical (ay = -g) components.',
          coreFormulas: [
            { label: 'Time of Flight', formula: 'T = \\frac{2 u \\sin \\theta}{g}' },
            { label: 'Maximum Height', formula: 'H = \\frac{u^2 \\sin^2 \\theta}{2g}' },
            { label: 'Horizontal Range', formula: 'R = \\frac{u^2 \\sin(2\\theta)}{g}' },
            { label: 'Trajectory Equation', formula: 'y = x \\tan \\theta - \\frac{g x^2}{2 u^2 \\cos^2 \\theta}' },
          ],
          visualLearningType: 'simulation',
          visualLearningTitle: 'Ballistic Trajectory Simulator',
          visualLearningDescription: 'Interactive launch velocity, angle slider, and air resistance toggle showing parabolic flight path envelope.',
        },
      ],
    },
    {
      id: 'phy-11-01-t03',
      subjectId: 'physics',
      gradeId: 'class_11',
      boardId: 'cbse',
      parentId: 'c0000001-0000-0000-0000-000000000001',
      nodeType: 'topic',
      code: 'PHY-11-01-T03',
      title: "Newton's Laws of Motion & Free Body Diagrams",
      description: 'Inertia, momentum conservation, constraint relations, pulley systems, and pseudo forces.',
      sequenceOrder: 3,
      weightagePercent: 2.0,
      estimatedMinutes: 50,
      masteryStatus: 'uncalibrated',
      retentionPercent: 100,
      prerequisites: [
        { id: 'phy-11-01-t02', title: 'Vectors & Force Resolution', met: true },
      ],
      concepts: [
        {
          id: 'c-nlm-01',
          title: 'Equilibrium & Non-Inertial Frames',
          summary: 'In an accelerating frame with acceleration a_frame, a pseudo-force F_pseudo = -m * a_frame must be applied to the system.',
          coreFormulas: [
            { label: 'Second Law', formula: '\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m\\vec{a}' },
            { label: 'Pseudo Force', formula: '\\vec{F}_{pseudo} = -m\\vec{a}_{frame}' },
          ],
          visualLearningType: 'interactive_diagram',
          visualLearningTitle: 'Atwood Pulley & Incline Vector Solver',
          visualLearningDescription: 'Visual FBD breakdown showing normal reaction, tension, and gravity resolution vectors.',
        },
      ],
    },
    {
      id: 'phy-11-01-t04',
      subjectId: 'physics',
      gradeId: 'class_11',
      boardId: 'cbse',
      parentId: 'c0000001-0000-0000-0000-000000000001',
      nodeType: 'topic',
      code: 'PHY-11-01-T04',
      title: 'Friction Dynamics & Circular Motion',
      description: 'Static vs kinetic friction, angle of repose, banking of roads, and conical pendulum.',
      sequenceOrder: 4,
      weightagePercent: 1.0,
      estimatedMinutes: 40,
      masteryStatus: 'uncalibrated',
      retentionPercent: 100,
      prerequisites: [
        { id: 'phy-11-01-t03', title: "Newton's Laws", met: true },
      ],
      concepts: [
        {
          id: 'c-fric-01',
          title: 'Friction Thresholds & Banking',
          summary: 'Static friction is self-adjusting up to f_max = μs * N. Kinetic friction f_k = μk * N acts opposite to relative slipping.',
          coreFormulas: [
            { label: 'Limiting Friction', formula: 'f_s \\le \\mu_s N' },
            { label: 'Banked Road Optimum Speed', formula: 'v = \\sqrt{R g \\tan \\theta}' },
          ],
          visualLearningType: 'simulation',
          visualLearningTitle: 'Road Banking & Slip Envelope',
          visualLearningDescription: '3D circular turn simulator demonstrating vehicle rollover vs skidding thresholds with friction variation.',
        },
      ],
    },
  ],

  // CHEM-11-01 Mole Concept
  'c0000001-0000-0000-0000-000000000005': [
    {
      id: 'chem-11-01-t01',
      subjectId: 'chemistry',
      gradeId: 'class_11',
      boardId: 'cbse',
      parentId: 'c0000001-0000-0000-0000-000000000005',
      nodeType: 'topic',
      code: 'CHEM-11-01-T01',
      title: 'Mole Concept & Stoichiometry',
      description: 'Avogadro constant, molar mass, stoichiometry, limiting reagent, and percentage yield.',
      sequenceOrder: 1,
      weightagePercent: 3.0,
      estimatedMinutes: 45,
      masteryStatus: 'uncalibrated',
      retentionPercent: 100,
      concepts: [
        {
          id: 'c-mole-01',
          title: 'Mole Quantification & Limiting Reagent',
          summary: 'One mole contains 6.022 × 10²³ elementary entities. The limiting reagent determines the theoretical maximum yield.',
          coreFormulas: [
            { label: 'Number of Moles', formula: 'n = \\frac{w}{M} = \\frac{N}{N_A} = \\frac{V_{STP}}{22.7}' },
            { label: 'Percent Yield', formula: '\\% \\text{ Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100' },
          ],
          visualLearningType: 'interactive_diagram',
          visualLearningTitle: 'Stoichiometric Balancer & Reagent Depletion',
          visualLearningDescription: 'Dynamic reaction chamber showing molecular count depletion and limiting reactant bottlenecks.',
        },
      ],
    },
  ],

  // MATH-12-01 Differential Calculus
  'c0000001-0000-0000-0000-000000000009': [
    {
      id: 'math-12-01-t01',
      subjectId: 'mathematics',
      gradeId: 'class_12',
      boardId: 'cbse',
      parentId: 'c0000001-0000-0000-0000-000000000009',
      nodeType: 'topic',
      code: 'MATH-12-01-T01',
      title: 'Limits, Continuity & Differentiability',
      description: 'L’Hôpital’s rule, intermediate value property, differentiability and differentiability implications.',
      sequenceOrder: 1,
      weightagePercent: 4.0,
      estimatedMinutes: 60,
      masteryStatus: 'uncalibrated',
      retentionPercent: 100,
      concepts: [
        {
          id: 'c-limits-01',
          title: 'L’Hôpital and First Principle',
          summary: 'Differentiability implies continuity, but the converse is not always true (e.g. Weierstrass or absolute value at 0).',
          coreFormulas: [
            { label: 'Derivative Definition', formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}" },
            { label: "L'Hopital Rule", formula: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}" },
          ],
          visualLearningType: 'simulation',
          visualLearningTitle: 'Tangent Secant Limit Explorer',
          visualLearningDescription: 'Interactive zoom into cusps, discontinuities, and secant line converging onto instantaneous tangent slopes.',
        },
      ],
    },
  ],
};

export const CANONICAL_QUESTIONS: CurriculumQuestion[] = [
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

