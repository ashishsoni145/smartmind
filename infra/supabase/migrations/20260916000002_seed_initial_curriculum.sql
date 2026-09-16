-- Migration: 20260916000002_seed_initial_curriculum.sql
-- Description: Seed canonical curriculum taxonomy, chapters, diagnostic questions, and assessments

-- 1. Boards
INSERT INTO public.boards (id, code, name, description)
VALUES
  ('cbse', 'CBSE', 'Central Board of Secondary Education (CBSE)', 'National curriculum aligned with NCERT and competitive entrance examinations.'),
  ('icse', 'ISC', 'Council for the Indian School Certificate Examinations (ISC)', 'In-depth analytical curriculum emphasizing comprehensive subject mastery.'),
  ('state_board', 'State Board', 'State Secondary & Higher Secondary Board', 'Curriculum following respective state syllabus and textbook guidelines.'),
  ('ib', 'IB / Cambridge', 'International Baccalaureate (IB) / IGCSE Cambridge', 'Global inquiry-based curriculum emphasizing research and application.')
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. Grades
INSERT INTO public.grades (id, code, name, ordering)
VALUES
  ('class_11', '11th', 'Class 11 (Foundational Year)', 1),
  ('class_12', '12th', 'Class 12 (Board & Exam Year)', 2),
  ('dropper', 'Dropper', 'Target Dropper / Gap Year', 3)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  ordering = EXCLUDED.ordering;

-- 3. Subjects
INSERT INTO public.subjects (id, code, name, icon, category)
VALUES
  ('physics', 'PHY', 'Physics', '⚡', 'core_stem'),
  ('chemistry', 'CHEM', 'Chemistry', '🧪', 'core_stem'),
  ('mathematics', 'MATH', 'Mathematics', '📐', 'core_stem'),
  ('biology', 'BIO', 'Biology', '🧬', 'core_stem'),
  ('computer_science', 'CS', 'Computer Science', '💻', 'core_stem'),
  ('english', 'ENG', 'English Core', '📖', 'languages')
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category;

-- 4. Target Exams
INSERT INTO public.target_exams (id, code, name, score_type, score_placeholder, typical_months)
VALUES
  ('jee_main', 'JEE-M', 'JEE Main', 'percentile', 'e.g. 99.5+ Percentile', ARRAY['January', 'April']),
  ('jee_advanced', 'JEE-Adv', 'JEE Advanced', 'rank', 'e.g. Top 2000 All India Rank', ARRAY['May']),
  ('neet_ug', 'NEET', 'NEET (UG)', 'marks', 'e.g. 680+ Marks', ARRAY['May']),
  ('cbse_boards', 'Boards', 'Class 12 Board Exams', 'marks', 'e.g. 95%+ Overall Marks', ARRAY['February', 'March']),
  ('bitsat', 'BITSAT', 'BITSAT', 'marks', 'e.g. 330+ Marks', ARRAY['May', 'June'])
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  score_type = EXCLUDED.score_type,
  score_placeholder = EXCLUDED.score_placeholder,
  typical_months = EXCLUDED.typical_months;

-- 5. Core Curriculum Nodes (Chapters)
-- Using fixed UUIDs (0-9, a-f) for deterministic seed linkage
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-01', 'Kinematics & Laws of Motion', 'Vectors, projectile motion, Newton laws, friction, circular dynamics.', 1, 8.50),
  ('c0000001-0000-0000-0000-000000000002', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-02', 'Work, Energy & Power', 'Conservative forces, work-energy theorem, collisions and potential energy curves.', 2, 7.00),
  ('c0000001-0000-0000-0000-000000000003', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-01', 'Electrostatics & Gauss Law', 'Coulomb law, electric field, potential, flux, Gauss law and capacitors.', 1, 9.00),
  ('c0000001-0000-0000-0000-000000000004', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-02', 'Current Electricity & Magnetism', 'Ohm law, Kirchhoff laws, Biot-Savart law, Ampere circuital law and Lorentz force.', 2, 9.50),
  ('c0000001-0000-0000-0000-000000000005', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-01', 'Some Basic Concepts of Chemistry', 'Mole concept, stoichiometry, empirical formulas, and concentration terms.', 1, 6.00),
  ('c0000001-0000-0000-0000-000000000006', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-02', 'Structure of Atom & Chemical Bonding', 'Bohr model, quantum numbers, orbital overlap, VSEPR theory, and hybridization.', 2, 8.50),
  ('c0000001-0000-0000-0000-000000000007', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-01', 'Chemical Kinetics & Solutions', 'Rate laws, Arrhenius equation, colligative properties, and Raoult law.', 1, 8.00),
  ('c0000001-0000-0000-0000-000000000008', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-01', 'Sets, Relations & Functions', 'Domain, range, composite functions, and trigonometric identities.', 1, 7.50),
  ('c0000001-0000-0000-0000-000000000009', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-01', 'Differential Calculus', 'Limits, continuity, differentiability, maxima-minima, and tangents-normals.', 1, 11.00),
  ('c0000001-0000-0000-0000-000000000010', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-02', 'Integral Calculus', 'Indefinite integration, definite integrals properties, and areas under curves.', 2, 11.50),
  ('c0000001-0000-0000-0000-000000000011', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-01', 'Cell Structure & Biomolecules', 'Prokaryotic vs eukaryotic organization, mitosis/meiosis, proteins, enzymes, nucleic acids.', 1, 8.00),
  ('c0000001-0000-0000-0000-000000000012', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-01', 'Genetics & Molecular Inheritance', 'Mendelian genetics, chromosome theory, DNA replication, transcription, and translation.', 1, 12.00)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  weightage_percent = EXCLUDED.weightage_percent;

-- 6. Canonical Diagnostic Assessment
INSERT INTO public.assessments (id, title, description, type, target_exam_id, subject_id, duration_minutes, total_marks, passing_marks, is_published)
VALUES
  ('a0000001-0000-0000-0000-000000000001', 'SharpMind Baseline Diagnostic Assessment', 'Foundational diagnostic evaluating analytical problem-solving and conceptual grasp across Physics, Chemistry, and Mathematics.', 'diagnostic', 'jee_main', NULL, 45, 20, 8, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 7. Diagnostic Questions (Verified Academic Provenance)
INSERT INTO public.questions (id, subject_id, curriculum_node_id, question_text, question_type, difficulty_level, explanation, hint, source_exam, source_year, is_pyq, is_verified)
VALUES
  (
    'd0000001-0000-0000-0000-000000000001',
    'physics',
    'c0000001-0000-0000-0000-000000000001',
    'A particle moves along the x-axis such that its position is given by x(t) = 3t^2 - 12t + 5 (in SI units). At what time does the velocity of the particle become zero?',
    'single_choice',
    'easy',
    'Velocity v(t) = dx/dt = 6t - 12. Setting v(t) = 0 gives 6t = 12 => t = 2.0 s.',
    'Differentiate the position function with respect to time to obtain the instantaneous velocity.',
    'JEE Main',
    2023,
    true,
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000002',
    'physics',
    'c0000001-0000-0000-0000-000000000003',
    'Two point charges +q and -q are placed at distance d apart in vacuum. The electric potential at the midpoint between them is:',
    'single_choice',
    'easy',
    'Electric potential is a scalar quantity: V_total = V1 + V2 = k(q)/(d/2) + k(-q)/(d/2) = 0.',
    'Potential is a scalar superposition, unlike electric field which is a vector.',
    'CBSE Board',
    2024,
    true,
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000003',
    'chemistry',
    'c0000001-0000-0000-0000-000000000005',
    'What is the molarity of a solution prepared by dissolving 4.0 g of NaOH in water to form 250 mL of solution? (Molar mass of NaOH = 40 g/mol)',
    'single_choice',
    'medium',
    'Moles of NaOH = 4.0 g / 40 g/mol = 0.10 mol. Volume = 0.250 L. Molarity = 0.10 / 0.250 = 0.40 M.',
    'Calculate moles of solute first, then divide by volume in litres.',
    'NEET',
    2022,
    true,
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000004',
    'chemistry',
    'c0000001-0000-0000-0000-000000000006',
    'Which of the following molecules has a zero dipole moment due to symmetric planar geometry?',
    'single_choice',
    'medium',
    'BF3 has trigonal planar geometry (sp2 hybridization) with 120 degree bond angles, so the vector sum of bond dipole moments is zero.',
    'Check the geometry and bond dipole vectors.',
    'JEE Main',
    2024,
    true,
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000005',
    'mathematics',
    'c0000001-0000-0000-0000-000000000009',
    'Find the derivative of f(x) = ln(sin(x)) with respect to x for 0 < x < pi.',
    'single_choice',
    'easy',
    'By the chain rule: d/dx[ln(u)] = (1/u) * du/dx. Here u = sin(x), du/dx = cos(x). Therefore f''(x) = cos(x)/sin(x) = cot(x).',
    'Apply the chain rule to the composite logarithmic function.',
    'CBSE Board',
    2023,
    true,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  explanation = EXCLUDED.explanation;

-- 8. Question Options
DELETE FROM public.question_options WHERE question_id IN (
  'd0000001-0000-0000-0000-000000000001',
  'd0000001-0000-0000-0000-000000000002',
  'd0000001-0000-0000-0000-000000000003',
  'd0000001-0000-0000-0000-000000000004',
  'd0000001-0000-0000-0000-000000000005'
);

INSERT INTO public.question_options (question_id, option_key, option_text, is_correct)
VALUES
  ('d0000001-0000-0000-0000-000000000001', 'A', '1.0 s', false),
  ('d0000001-0000-0000-0000-000000000001', 'B', '2.0 s', true),
  ('d0000001-0000-0000-0000-000000000001', 'C', '3.0 s', false),
  ('d0000001-0000-0000-0000-000000000001', 'D', '4.0 s', false),

  ('d0000001-0000-0000-0000-000000000002', 'A', '0 V', true),
  ('d0000001-0000-0000-0000-000000000002', 'B', '2kq / d', false),
  ('d0000001-0000-0000-0000-000000000002', 'C', '4kq / d', false),
  ('d0000001-0000-0000-0000-000000000002', 'D', 'kq / (2d)', false),

  ('d0000001-0000-0000-0000-000000000003', 'A', '0.10 M', false),
  ('d0000001-0000-0000-0000-000000000003', 'B', '0.20 M', false),
  ('d0000001-0000-0000-0000-000000000003', 'C', '0.40 M', true),
  ('d0000001-0000-0000-0000-000000000003', 'D', '0.80 M', false),

  ('d0000001-0000-0000-0000-000000000004', 'A', 'NH3', false),
  ('d0000001-0000-0000-0000-000000000004', 'B', 'H2O', false),
  ('d0000001-0000-0000-0000-000000000004', 'C', 'BF3', true),
  ('d0000001-0000-0000-0000-000000000004', 'D', 'SO2', false),

  ('d0000001-0000-0000-0000-000000000005', 'A', 'tan(x)', false),
  ('d0000001-0000-0000-0000-000000000005', 'B', 'cot(x)', true),
  ('d0000001-0000-0000-0000-000000000005', 'C', '-cot(x)', false),
  ('d0000001-0000-0000-0000-000000000005', 'D', 'sec(x)', false);

-- 9. Map Questions into Baseline Diagnostic Assessment
INSERT INTO public.assessment_questions (assessment_id, question_id, section_name, sequence_order, marks_correct, marks_incorrect)
VALUES
  ('a0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Physics', 1, 4.0, -1.0),
  ('a0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'Physics', 2, 4.0, -1.0),
  ('a0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000003', 'Chemistry', 3, 4.0, -1.0),
  ('a0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000004', 'Chemistry', 4, 4.0, -1.0),
  ('a0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000005', 'Mathematics', 5, 4.0, -1.0)
ON CONFLICT (assessment_id, question_id) DO NOTHING;
