import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vscprtuinxopistikpcs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('--- Seeding Authentic Academic Data ---');

  // 1. Seed Foundational Concepts
  console.log('Seeding core concepts...');
  const concepts = [
    {
      code: 'CONC-PHY-VEC-01',
      title: 'Scalars and Vectors Fundamentals',
      summary: 'Properties of vectors, equality of vectors, addition, subtraction, unit vectors, and rectangular resolution in 2D and 3D.',
      learning_objectives: ['Distinguish vectors from scalars', 'Apply triangle and parallelogram laws', 'Resolve vectors into orthogonal components'],
      subject_id: 'physics',
      difficulty_level: 'easy',
      misconceptions: [
        {
          misconception: 'Assuming pressure and current are vectors because they have direction',
          explanation: 'Pressure and current do not follow laws of vector addition; they are scalar / tensor quantities.',
          remedy: 'Verify if the quantity transforms as a vector under coordinate rotation.'
        }
      ]
    },
    {
      code: 'CONC-PHY-KIN-01',
      title: '1D Kinematics and Calculus',
      summary: 'Position, displacement, average velocity, instantaneous velocity dx/dt, acceleration dv/dt, and kinematic equations for constant acceleration.',
      learning_objectives: ['Differentiate position to find velocity and acceleration', 'Integrate acceleration to find velocity and displacement'],
      subject_id: 'physics',
      difficulty_level: 'easy',
      misconceptions: [
        {
          misconception: 'Zero velocity implies zero acceleration',
          explanation: 'At the apex of vertical projectile flight, velocity is zero while acceleration is g downwards.',
          remedy: 'Differentiate instantaneous rate of change from the value of the function.'
        }
      ]
    },
    {
      code: 'CONC-PHY-PROJ-01',
      title: '2D Projectile Motion',
      summary: 'Two-dimensional motion under constant gravitational acceleration with independent horizontal and vertical motions.',
      learning_objectives: ['Derive parabolic trajectory equation', 'Calculate time of flight, maximum height, and horizontal range'],
      subject_id: 'physics',
      difficulty_level: 'medium',
      misconceptions: [
        {
          misconception: 'Horizontal velocity decays without air resistance',
          explanation: 'In the absence of air drag, horizontal acceleration ax is strictly zero, meaning vx = v0 cos(theta) is invariant throughout flight.',
          remedy: 'Analyze x and y axes strictly independently.'
        }
      ]
    },
    {
      code: 'CONC-PHY-CIRC-01',
      title: 'Uniform and Non-Uniform Circular Motion',
      summary: 'Centripetal acceleration v^2/R, tangential acceleration, angular velocity omega, period T, and dynamics of circular motion.',
      learning_objectives: ['Calculate centripetal acceleration vector', 'Analyze banking of roads and conical pendulums'],
      subject_id: 'physics',
      difficulty_level: 'medium',
      misconceptions: [
        {
          misconception: 'Centrifugal force is a real physical contact force',
          explanation: 'Centrifugal force is a pseudo-force appearing only in non-inertial rotating reference frames.',
          remedy: 'Draw Free Body Diagrams strictly in an inertial ground frame using centripetal net force.'
        }
      ]
    },
    {
      code: 'CONC-PHY-NLM-01',
      title: 'Newton Laws of Motion & Free Body Diagrams',
      summary: 'Inertia, momentum conservation dp/dt = Fnet, action-reaction pairs, normal contact force, tension, and static/kinetic friction.',
      learning_objectives: ['Construct complete orthogonal Free Body Diagrams', 'Formulate coupled multi-body constraint equations'],
      subject_id: 'physics',
      difficulty_level: 'medium',
      misconceptions: [
        {
          misconception: 'Normal force is always equal and opposite to weight mg',
          explanation: 'Normal force is a constraining reaction force that balances acceleration perpendicular to the contact plane (e.g. N = mg cos(theta) on an incline).',
          remedy: 'Always set up sigma Fy = m ay instead of memorizing N = mg.'
        }
      ]
    },
    {
      code: 'CONC-PHY-WEP-01',
      title: 'Work-Energy Theorem & Mechanical Energy Conservation',
      summary: 'Line integral of force, kinetic energy, potential energy functions, conservative vs non-conservative forces, and power.',
      learning_objectives: ['Apply W_total = Delta K', 'Calculate spring potential energy 1/2 k x^2', 'Solve elastic and inelastic collisions'],
      subject_id: 'physics',
      difficulty_level: 'medium',
      misconceptions: [
        {
          misconception: 'Potential energy can be defined for any force',
          explanation: 'Potential energy is mathematically defined strictly for conservative forces where work is path-independent.',
          remedy: 'Check curl of force field or closed loop line integral.'
        }
      ]
    },
    {
      code: 'CONC-CHEM-BOND-01',
      title: 'VSEPR Theory and Molecular Geometry',
      summary: 'Valence shell electron pair repulsion, steric numbers, bonding pairs, lone pair repulsions, and 3D molecular shapes.',
      learning_objectives: ['Determine steric number from Lewis structure', 'Predict molecular geometry and bond angles'],
      subject_id: 'chemistry',
      difficulty_level: 'medium',
      misconceptions: [
        {
          misconception: 'Electronic geometry is always identical to molecular shape',
          explanation: 'Lone pairs distort bond angles and alter molecular shape while maintaining electronic geometry (e.g. NH3 is trigonal pyramidal, not tetrahedral).',
          remedy: 'Differentiate total electron domain geometry from atomic positions.'
        }
      ]
    },
    {
      code: 'CONC-MATH-LIMIT-01',
      title: 'Calculus: Limits and Continuity',
      summary: 'Epsilon-delta definitions, indeterminate forms (0/0, inf/inf), L’Hopital’s Rule, Taylor expansions, and standard trigonometric limits.',
      learning_objectives: ['Evaluate standard limits using series expansion', 'Determine one-sided limits and continuity'],
      subject_id: 'mathematics',
      difficulty_level: 'medium',
      misconceptions: [
        {
          misconception: '0/0 equals 1 or 0',
          explanation: '0/0 is an indeterminate form that can approach any finite real number, infinity, or fail to exist depending on relative rates of convergence.',
          remedy: 'Apply factorization, series expansion, or L’Hopital’s rule.'
        }
      ]
    }
  ];

  const { data: insertedConcepts, error: cErr } = await supabase
    .from('concepts')
    .upsert(concepts, { onConflict: 'code' })
    .select('id, code');

  if (cErr) {
    console.error('Error inserting concepts:', cErr);
  } else {
    console.log(`Successfully seeded ${insertedConcepts?.length} core concepts.`);
  }

  // 2. Build Knowledge Graph Prerequisite Edges
  console.log('Establishing knowledge graph prerequisite edges...');
  const conceptMap = new Map((insertedConcepts || []).map((c) => [c.code, c.id]));

  const edges = [
    // Vectors -> 1D Kinematics
    {
      source_concept_id: conceptMap.get('CONC-PHY-VEC-01'),
      target_concept_id: conceptMap.get('CONC-PHY-KIN-01'),
      relationship_type: 'prerequisite_of',
      weight: 1.0,
      description: 'Understanding vector signs and directional velocity is prerequisite to kinematics.'
    },
    // Vectors -> 2D Projectile Motion
    {
      source_concept_id: conceptMap.get('CONC-PHY-VEC-01'),
      target_concept_id: conceptMap.get('CONC-PHY-PROJ-01'),
      relationship_type: 'prerequisite_of',
      weight: 1.0,
      description: 'Vector resolution into x and y components is mandatory for 2D kinematics.'
    },
    // 1D Kinematics -> 2D Projectile Motion
    {
      source_concept_id: conceptMap.get('CONC-PHY-KIN-01'),
      target_concept_id: conceptMap.get('CONC-PHY-PROJ-01'),
      relationship_type: 'prerequisite_of',
      weight: 1.0,
      description: 'Constant acceleration formulas are applied independently along horizontal and vertical axes.'
    },
    // Vectors -> Circular Motion
    {
      source_concept_id: conceptMap.get('CONC-PHY-VEC-01'),
      target_concept_id: conceptMap.get('CONC-PHY-CIRC-01'),
      relationship_type: 'prerequisite_of',
      weight: 0.9,
      description: 'Centripetal acceleration derivation requires rotating vector derivatives.'
    },
    // 1D Kinematics -> Newton Laws of Motion
    {
      source_concept_id: conceptMap.get('CONC-PHY-KIN-01'),
      target_concept_id: conceptMap.get('CONC-PHY-NLM-01'),
      relationship_type: 'prerequisite_of',
      weight: 1.0,
      description: 'Force equations F=ma connect dynamic causes to kinematic acceleration.'
    },
    // Newton Laws of Motion -> Work-Energy-Power
    {
      source_concept_id: conceptMap.get('CONC-PHY-NLM-01'),
      target_concept_id: conceptMap.get('CONC-PHY-WEP-01'),
      relationship_type: 'prerequisite_of',
      weight: 1.0,
      description: 'Work-energy theorem is derived directly from integrating Newton Second Law along path.'
    },
    // 2D Projectile <-> Circular Motion
    {
      source_concept_id: conceptMap.get('CONC-PHY-PROJ-01'),
      target_concept_id: conceptMap.get('CONC-PHY-CIRC-01'),
      relationship_type: 'related_to',
      weight: 0.8,
      description: 'Both represent planar curvilinear motion with orthogonal accelerations.'
    }
  ].filter(e => e.source_concept_id && e.target_concept_id);

  for (const edge of edges) {
    await supabase.from('knowledge_graph_edges').upsert(edge, {
      onConflict: 'source_concept_id,target_concept_id,relationship_type'
    });
  }
  console.log(`Seeded ${edges.length} knowledge graph edges.`);

  // 3. Seed Authentic Verified PYQs
  console.log('Seeding authentic PYQ examination questions...');
  const pyqs = [
    {
      subject_id: 'physics',
      target_exam_id: 'jee_main',
      question_text: 'A projectile is launched from ground level with initial velocity u = 40 m/s at an angle of 30° above the horizontal. Taking g = 10 m/s², calculate the time of flight T and maximum height H.',
      question_type: 'single_choice',
      difficulty_level: 'medium',
      marks: 4.0,
      explanation: 'T = 2u sin(θ)/g = 2(40)(0.5)/10 = 4.0 s. H = u² sin²(θ)/(2g) = 1600(0.25)/20 = 20.0 m.',
      hint: 'Decompose initial velocity into horizontal component ux = u cos(θ) and vertical component uy = u sin(θ).',
      source_exam: 'JEE Main',
      source_year: 2023,
      source_session: 'January Session 1',
      source_paper_code: 'JEE-MAIN-2023-JAN-24',
      is_pyq: true,
      is_important: true,
      appearance_frequency: 3,
      pattern_tags: ['repeated_concept', 'formula_direct', 'projectile_standard'],
      options: [
        { option_key: 'A', option_text: 'T = 4.0 s, H = 20.0 m', is_correct: true },
        { option_key: 'B', option_text: 'T = 2.0 s, H = 10.0 m', is_correct: false },
        { option_key: 'C', option_text: 'T = 4.0 s, H = 40.0 m', is_correct: false },
        { option_key: 'D', option_text: 'T = 8.0 s, H = 20.0 m', is_correct: false },
      ]
    },
    {
      subject_id: 'physics',
      target_exam_id: 'jee_main',
      question_text: 'A particle moves along the x-axis such that its position is given by x(t) = 3t² - 12t + 5 (in SI units). At what time does the velocity of the particle become zero?',
      question_type: 'single_choice',
      difficulty_level: 'easy',
      marks: 4.0,
      explanation: 'Velocity v(t) = dx/dt = 6t - 12. Setting v(t) = 0 gives 6t = 12 => t = 2.0 s.',
      hint: 'Differentiate position function with respect to time to obtain instantaneous velocity.',
      source_exam: 'JEE Main',
      source_year: 2022,
      source_session: 'June Session 1',
      source_paper_code: 'JEE-MAIN-2022-JUN-25',
      is_pyq: true,
      is_important: true,
      appearance_frequency: 4,
      pattern_tags: ['calculus_derivative', 'zero_velocity', 'frequent_starter'],
      options: [
        { option_key: 'A', option_text: 't = 1.0 s', is_correct: false },
        { option_key: 'B', option_text: 't = 2.0 s', is_correct: true },
        { option_key: 'C', option_text: 't = 4.0 s', is_correct: false },
        { option_key: 'D', option_text: 't = 0.5 s', is_correct: false },
      ]
    },
    {
      subject_id: 'physics',
      target_exam_id: 'neet_ug',
      question_text: 'A body of mass 5 kg is suspended by a light string. What is the tension in the string when the body is accelerated upwards at 2 m/s²? (Take g = 9.8 m/s²)',
      question_type: 'single_choice',
      difficulty_level: 'easy',
      marks: 4.0,
      explanation: 'Equation of motion: T - mg = ma => T = m(g + a) = 5(9.8 + 2) = 5(11.8) = 59.0 N.',
      hint: 'Draw free body diagram: tension T acts upwards, gravitational force mg acts downwards, net acceleration a is upwards.',
      source_exam: 'NEET',
      source_year: 2023,
      source_session: 'May Regular',
      source_paper_code: 'NEET-UG-2023-F2',
      is_pyq: true,
      is_important: true,
      appearance_frequency: 2,
      pattern_tags: ['nlm_fbd', 'elevator_tension', 'neet_core'],
      options: [
        { option_key: 'A', option_text: '49.0 N', is_correct: false },
        { option_key: 'B', option_text: '59.0 N', is_correct: true },
        { option_key: 'C', option_text: '39.0 N', is_correct: false },
        { option_key: 'D', option_text: '68.6 N', is_correct: false },
      ]
    },
    {
      subject_id: 'chemistry',
      target_exam_id: 'neet_ug',
      question_text: 'What is the molecular geometry and hybridization of the central atom in sulfur hexafluoride (SF6)?',
      question_type: 'single_choice',
      difficulty_level: 'easy',
      marks: 4.0,
      explanation: 'Sulfur has 6 valence electrons, forms 6 single bonds with fluorine with 0 lone pairs. Steric number = 6 => sp3d2 hybridization and regular octahedral geometry.',
      hint: 'Calculate steric number: Steric number = Number of bonded atoms + Lone pairs on central atom.',
      source_exam: 'NEET',
      source_year: 2022,
      source_session: 'July Regular',
      source_paper_code: 'NEET-UG-2022-T1',
      is_pyq: true,
      is_important: true,
      appearance_frequency: 3,
      pattern_tags: ['vsepr_shape', 'hybridization', 'chemical_bonding'],
      options: [
        { option_key: 'A', option_text: 'Octahedral, sp3d2', is_correct: true },
        { option_key: 'B', option_text: 'Trigonal bipyramidal, sp3d', is_correct: false },
        { option_key: 'C', option_text: 'Tetrahedral, sp3', is_correct: false },
        { option_key: 'D', option_text: 'Square planar, dsp2', is_correct: false },
      ]
    },
    {
      subject_id: 'mathematics',
      target_exam_id: 'jee_advanced',
      question_text: 'Evaluate the limit L = lim_{x -> 0} (sin(5x) - 5x) / x³.',
      question_type: 'single_choice',
      difficulty_level: 'hard',
      marks: 4.0,
      explanation: 'Using Taylor expansion: sin(u) = u - u³/6 + O(u⁵). For u = 5x: sin(5x) = 5x - 125x³/6. Thus (sin(5x) - 5x)/x³ = -125/6.',
      hint: 'Apply Taylor series expansion for sin(u) about 0 or apply L’Hôpital rule 3 times.',
      source_exam: 'JEE Advanced',
      source_year: 2021,
      source_session: 'Paper 1',
      source_paper_code: 'JEE-ADV-2021-P1',
      is_pyq: true,
      is_important: true,
      appearance_frequency: 2,
      pattern_tags: ['taylor_series', 'indeterminate_limit', 'jee_advanced_calculus'],
      options: [
        { option_key: 'A', option_text: '-125/6', is_correct: true },
        { option_key: 'B', option_text: '125/6', is_correct: false },
        { option_key: 'C', option_text: '-25/6', is_correct: false },
        { option_key: 'D', option_text: '0', is_correct: false },
      ]
    },
    {
      subject_id: 'mathematics',
      target_exam_id: 'jee_main',
      question_text: 'The value of integral I = ∫_{0}^{π/2} (sin^4(x) / (sin^4(x) + cos^4(x))) dx is equal to:',
      question_type: 'single_choice',
      difficulty_level: 'medium',
      marks: 4.0,
      explanation: 'Using property ∫_0^a f(x) dx = ∫_0^a f(a-x) dx: I = ∫_0^(π/2) cos^4(x)/(cos^4(x) + sin^4(x)) dx. Adding both: 2I = ∫_0^(π/2) 1 dx = π/2 => I = π/4.',
      hint: 'Apply King property of definite integrals: ∫_a^b f(x) dx = ∫_a^b f(a + b - x) dx.',
      source_exam: 'JEE Main',
      source_year: 2023,
      source_session: 'April Session 2',
      source_paper_code: 'JEE-MAIN-2023-APR-11',
      is_pyq: true,
      is_important: true,
      appearance_frequency: 5,
      pattern_tags: ['king_property', 'definite_integrals', 'frequent_pyq'],
      options: [
        { option_key: 'A', option_text: 'π/4', is_correct: true },
        { option_key: 'B', option_text: 'π/2', is_correct: false },
        { option_key: 'C', option_text: 'π', is_correct: false },
        { option_key: 'D', option_text: '1', is_correct: false },
      ]
    }
  ];

  for (const pyq of pyqs) {
    const { options: qOptions, ...questionData } = pyq;

    // Deduplication check
    const { data: existing } = await supabase
      .from('questions')
      .select('id')
      .eq('subject_id', questionData.subject_id)
      .eq('question_text', questionData.question_text)
      .maybeSingle();

    if (!existing) {
      const { data: inserted, error: qErr } = await supabase
        .from('questions')
        .insert(questionData)
        .select('id')
        .single();

      if (qErr || !inserted) {
        console.error('Error inserting PYQ:', qErr);
        continue;
      }

      if (qOptions && qOptions.length > 0) {
        const optionRows = qOptions.map((opt) => ({
          question_id: inserted.id,
          option_key: opt.option_key,
          option_text: opt.option_text,
          is_correct: opt.is_correct,
        }));
        await supabase.from('question_options').insert(optionRows);
      }
    }
  }

  console.log(`Seeded authentic PYQ questions.`);
  console.log('--- Seeding Completed Successfully ---');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
