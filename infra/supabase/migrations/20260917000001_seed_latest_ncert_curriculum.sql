-- Migration: 20260917000001_seed_latest_ncert_curriculum.sql
-- Description: Seed full authentic NCERT rationalised chapters (2024-2026) across Physics, Chemistry, Mathematics, and Biology

-- 1. Physics Class 11 (14 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000011-0000-0000-0000-000000000001', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-01', 'Units and Measurements', 'The International System of Units (SI), dimensions of physical quantities, dimensional analysis and error analysis.', 1, 3.50),
  ('c0000001-0000-0000-0000-000000000001', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-02', 'Motion in a Straight Line', 'Position, path length, displacement, average & instantaneous velocity, acceleration, kinematic formulas and calculus.', 2, 4.50),
  ('c0000001-0000-0000-0000-000000000002', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-03', 'Motion in a Plane', 'Scalars and vectors, vector resolution, 2D kinematics, projectile motion dynamics, and uniform circular motion.', 3, 5.50),
  ('c0000011-0000-0000-0000-000000000004', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-04', 'Laws of Motion', 'Newton laws of motion, momentum, impulse, free body diagrams, static and kinetic friction, and circular road banking.', 4, 6.00),
  ('c0000011-0000-0000-0000-000000000005', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-05', 'Work, Energy and Power', 'Work-energy theorem, kinetic and potential energy, conservation of mechanical energy, spring forces, power and collisions.', 5, 5.50),
  ('c0000011-0000-0000-0000-000000000006', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-06', 'System of Particles and Rotational Motion', 'Centre of mass, angular velocity, torque, angular momentum conservation, moment of inertia and rotational dynamics.', 6, 6.50),
  ('c0000011-0000-0000-0000-000000000007', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-07', 'Gravitation', 'Kepler laws of planetary motion, universal law of gravitation, gravitational potential energy, escape speed and orbital satellites.', 7, 5.00),
  ('c0000011-0000-0000-0000-000000000008', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-08', 'Mechanical Properties of Solids', 'Stress, strain, Hooke law, stress-strain relationship, Young modulus, shear modulus, bulk modulus and elastic potential energy.', 8, 3.50),
  ('c0000011-0000-0000-0000-000000000009', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-09', 'Mechanical Properties of Fluids', 'Pressure, Pascal law, streamline flow, Bernoulli theorem, viscosity, Stokes law, terminal speed and surface tension.', 9, 4.50),
  ('c0000011-0000-0000-0000-000000000010', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-10', 'Thermal Properties of Matter', 'Temperature, thermal expansion, specific heat capacity, calorimetry, change of state, latent heat and heat transfer.', 10, 4.00),
  ('c0000011-0000-0000-0000-000000000011', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-11', 'Thermodynamics', 'Thermal equilibrium, zeroth law, first law, internal energy, work, molar heat capacities, thermodynamic processes and second law.', 11, 5.50),
  ('c0000011-0000-0000-0000-000000000012', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-12', 'Kinetic Theory', 'Molecular model of an ideal gas, pressure deduction, RMS velocity, equipartition of energy, degrees of freedom and mean free path.', 12, 3.50),
  ('c0000011-0000-0000-0000-000000000013', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-13', 'Oscillations', 'Periodic motion, simple harmonic motion (SHM), displacement, velocity, acceleration, energy in SHM and simple pendulums.', 13, 5.00),
  ('c0000011-0000-0000-0000-000000000014', 'physics', 'class_11', 'cbse', 'chapter', 'PHY-11-14', 'Waves', 'Transverse and longitudinal waves, speed of sound, displacement relation, principle of superposition, reflection, standing waves and beats.', 14, 5.00)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 2. Physics Class 12 (14 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000001-0000-0000-0000-000000000003', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-01', 'Electric Charges and Fields', 'Electric charges, Coulomb law, electric field lines, electric flux, electric dipole, and Gauss law with spherical/planar applications.', 1, 6.00),
  ('c0000012-0000-0000-0000-000000000002', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-02', 'Electrostatic Potential and Capacitance', 'Electric potential, equipotential surfaces, potential energy of charge systems, capacitance, dielectrics, and parallel plate capacitors.', 2, 6.00),
  ('c0000001-0000-0000-0000-000000000004', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-03', 'Current Electricity', 'Drift velocity, Ohm law, resistivity, temperature dependence, Kirchhoff rules, Wheatstone bridge, and power dissipation.', 3, 7.00),
  ('c0000012-0000-0000-0000-000000000004', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-04', 'Moving Charges and Magnetism', 'Lorentz magnetic force, Biot-Savart law, Ampere circuital law, solenoid fields, force between parallel currents, and galvanometer.', 4, 6.50),
  ('c0000012-0000-0000-0000-000000000005', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-05', 'Magnetism and Matter', 'Bar magnet as equivalent solenoid, magnetic field lines, Gauss law for magnetism, magnetic susceptibility, and magnetic materials.', 5, 4.00),
  ('c0000012-0000-0000-0000-000000000006', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-06', 'Electromagnetic Induction', 'Magnetic flux, Faraday laws of induction, Lenz law, motional emf, self-inductance, mutual inductance, and AC generator.', 6, 6.00),
  ('c0000012-0000-0000-0000-000000000007', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-07', 'Alternating Current', 'AC voltage applied to R, L, C, phasor diagrams, series LCR resonance circuits, Q-factor, power in AC circuits, and transformers.', 7, 6.50),
  ('c0000012-0000-0000-0000-000000000008', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-08', 'Electromagnetic Waves', 'Displacement current, Maxwell equations, transverse characteristics of EM waves, momentum, and the electromagnetic spectrum.', 8, 3.50),
  ('c0000012-0000-0000-0000-000000000009', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-09', 'Ray Optics and Optical Instruments', 'Reflection, spherical mirrors, refraction, total internal reflection, lenses, lens maker formula, prisms, and compound microscopes.', 9, 8.00),
  ('c0000012-0000-0000-0000-000000000010', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-10', 'Wave Optics', 'Huygens principle, wavefront propagation, coherent sources, Young double slit experiment, fringe width derivation, and diffraction.', 10, 6.50),
  ('c0000012-0000-0000-0000-000000000011', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-11', 'Dual Nature of Radiation and Matter', 'Photoelectric effect, work function, Einstein photoelectric equation, photon energy and momentum, and de Broglie matter waves.', 11, 5.00),
  ('c0000012-0000-0000-0000-000000000012', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-12', 'Atoms', 'Alpha particle scattering, Rutherford model, Bohr model for hydrogen atom, quantization of angular momentum, and spectral series.', 12, 4.50),
  ('c0000012-0000-0000-0000-000000000013', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-13', 'Nuclei', 'Nuclear composition, size and density, mass defect, binding energy per nucleon curve, nuclear forces, nuclear fission and fusion.', 13, 4.00),
  ('c0000012-0000-0000-0000-000000000014', 'physics', 'class_12', 'cbse', 'chapter', 'PHY-12-14', 'Semiconductor Electronics: Materials, Devices and Simple Circuits', 'Energy bands in solids, intrinsic and extrinsic semiconductors (p-n type), p-n junction diode forward/reverse bias, and rectifiers.', 14, 6.50)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 3. Chemistry Class 11 (9 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000001-0000-0000-0000-000000000005', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-01', 'Some Basic Concepts of Chemistry', 'Nature of matter, laws of chemical combination, Dalton atomic theory, mole concept, molar mass, empirical formula, and stoichiometry.', 1, 6.00),
  ('c0000021-0000-0000-0000-000000000002', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-02', 'Structure of Atom', 'Bohr atomic model, dual character of matter, de Broglie relation, Heisenberg uncertainty principle, quantum numbers, and orbital shapes.', 2, 7.50),
  ('c0000021-0000-0000-0000-000000000003', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-03', 'Classification of Elements and Periodicity in Properties', 'Modern periodic law, periodic table structure, periodic trends in atomic radii, ionization enthalpy, electron gain enthalpy, and electronegativity.', 3, 5.00),
  ('c0000001-0000-0000-0000-000000000006', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-04', 'Chemical Bonding and Molecular Structure', 'Ionic and covalent bonds, bond polarity, dipole moment, VSEPR theory, hybridization, orbital overlap, and molecular orbital theory.', 4, 8.50),
  ('c0000021-0000-0000-0000-000000000005', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-05', 'Chemical Thermodynamics', 'First law, internal energy, enthalpy, heat capacity, Hess law, standard reaction enthalpies, spontaneity, entropy, and Gibbs free energy.', 5, 7.50),
  ('c0000021-0000-0000-0000-000000000006', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-06', 'Equilibrium', 'Dynamic chemical equilibrium, law of chemical equilibrium, Le Chatelier principle, ionic equilibrium, pH scale, buffers, and solubility product.', 6, 8.00),
  ('c0000021-0000-0000-0000-000000000007', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-07', 'Redox Reactions', 'Concept of oxidation and reduction, oxidation number calculation, balancing redox reactions by half-reaction method, and redox titration basics.', 7, 4.50),
  ('c0000021-0000-0000-0000-000000000008', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-08', 'Organic Chemistry – Some Basic Principles and Techniques', 'IUPAC nomenclature, structural and stereoisomerism, inductive, electromeric, resonance and hyperconjugation effects, and reactive intermediates.', 8, 8.50),
  ('c0000021-0000-0000-0000-000000000009', 'chemistry', 'class_11', 'cbse', 'chapter', 'CHEM-11-09', 'Hydrocarbons', 'Alkanes, conformations of ethane, alkenes, geometrical isomerism, electrophilic addition, Markovnikov rule, alkynes, and aromaticity of benzene.', 9, 8.00)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 4. Chemistry Class 12 (10 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000022-0000-0000-0000-000000000001', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-01', 'Solutions', 'Types of solutions, Raoult law, ideal and non-ideal solutions, colligative properties, abnormal molar mass, and van t Hoff factor.', 1, 7.00),
  ('c0000022-0000-0000-0000-000000000002', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-02', 'Electrochemistry', 'Galvanic cells, Nernst equation, electrolytic conductivity, Kohlrausch law, electrolysis, battery cells, fuel cells, and corrosion.', 2, 7.50),
  ('c0000001-0000-0000-0000-000000000007', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-03', 'Chemical Kinetics', 'Rate of reaction, rate law, rate constant, order and molecularity, integrated rate equations, half-life, Arrhenius equation, and collision theory.', 3, 7.00),
  ('c0000022-0000-0000-0000-000000000004', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-04', 'The d- and f-Block Elements', 'Electronic configuration, general properties of transition elements, oxidation states, catalytic and magnetic properties, lanthanoid contraction.', 4, 7.00),
  ('c0000022-0000-0000-0000-000000000005', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-05', 'Coordination Compounds', 'Werner theory, ligands, IUPAC nomenclature, isomerism, valence bond theory, crystal field theory (CFT), and complex stability.', 5, 7.00),
  ('c0000022-0000-0000-0000-000000000006', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-06', 'Haloalkanes and Haloarenes', 'Nomenclature, nature of C-X bond, preparation, optical rotation, SN1 and SN2 substitution mechanisms, and polyhalogen compounds.', 6, 6.00),
  ('c0000022-0000-0000-0000-000000000007', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-07', 'Alcohols, Phenols and Ethers', 'Nomenclature, preparation from carbonyls and alkenes, acidity, esterification, electrophilic aromatic substitution of phenols, and Williamson ether synthesis.', 7, 6.50),
  ('c0000022-0000-0000-0000-000000000008', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-08', 'Aldehydes, Ketones and Carboxylic Acids', 'Nucleophilic addition reactions, Tollens and Fehling tests, aldol condensation, Cannizzaro reaction, acidity of carboxylic acids, and HVZ reaction.', 8, 8.00),
  ('c0000022-0000-0000-0000-000000000009', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-09', 'Amines', 'Classification, basic character of alkyl and aryl amines, Gabriel phthalimide synthesis, Hofmann bromamide degradation, and diazonium salt reactions.', 9, 6.00),
  ('c0000022-0000-0000-0000-000000000010', 'chemistry', 'class_12', 'cbse', 'chapter', 'CHEM-12-10', 'Biomolecules', 'Carbohydrates (glucose, fructose), proteins, amino acids, peptide bond, primary/secondary protein structures, nucleic acids (DNA/RNA), and vitamins.', 10, 7.00)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 5. Mathematics Class 11 (14 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000001-0000-0000-0000-000000000008', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-01', 'Sets', 'Sets and representations, empty, finite, infinite sets, subsets, power sets, universal sets, Venn diagrams, and set operations.', 1, 4.00),
  ('c0000031-0000-0000-0000-000000000002', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-02', 'Relations and Functions', 'Cartesian product of sets, relations, domain, range, codomain, real-valued functions, polynomial, modulus, and greatest integer functions.', 2, 5.00),
  ('c0000031-0000-0000-0000-000000000003', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-03', 'Trigonometric Functions', 'Radian and degree measures, signs of trigonometric functions, sum and difference identities, double and triple angle identities.', 3, 7.00),
  ('c0000031-0000-0000-0000-000000000004', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-04', 'Complex Numbers and Quadratic Equations', 'Algebra of complex numbers, modulus and conjugate, Argand plane representation, and quadratic equations with complex roots.', 4, 5.00),
  ('c0000031-0000-0000-0000-000000000005', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-05', 'Linear Inequalities', 'Linear inequalities in one variable, algebraic solutions, and graphical representation on the real number line.', 5, 3.50),
  ('c0000031-0000-0000-0000-000000000006', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-06', 'Permutations and Combinations', 'Fundamental principle of counting, factorial notation, permutation formulas, combinations, and problem solving in counting.', 6, 6.00),
  ('c0000031-0000-0000-0000-000000000007', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-07', 'Binomial Theorem', 'Binomial theorem for positive integral indices, Pascal triangle, general term, and expansion properties.', 7, 4.50),
  ('c0000031-0000-0000-0000-000000000008', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-08', 'Sequences and Series', 'Arithmetic progressions review, geometric progressions (G.P.), nth term, sum of n terms, infinite G.P., and AM-GM inequality.', 8, 5.50),
  ('c0000031-0000-0000-0000-000000000009', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-09', 'Straight Lines', 'Slope of line, angle between lines, point-slope, slope-intercept, intercept forms, distance of point from line, and parallel lines.', 9, 6.00),
  ('c0000031-0000-0000-0000-000000000010', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-10', 'Conic Sections', 'Sections of cone, standard equations and properties of circles, parabolas, ellipses, and hyperbolas, eccentricity and latus rectum.', 10, 7.50),
  ('c0000031-0000-0000-0000-000000000011', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-11', 'Introduction to Three-Dimensional Geometry', 'Coordinate axes and coordinate planes in 3D, coordinates of points in octants, and distance formula between two points in 3D.', 11, 4.00),
  ('c0000031-0000-0000-0000-000000000012', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-12', 'Limits and Derivatives', 'Intuitive limits, left-hand and right-hand limits, trigonometric limits, derivatives from first principles, and product/quotient rules.', 12, 7.50),
  ('c0000031-0000-0000-0000-000000000013', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-13', 'Statistics', 'Measures of dispersion: range, mean deviation about mean/median, variance and standard deviation for grouped and ungrouped data.', 13, 4.00),
  ('c0000031-0000-0000-0000-000000000014', 'mathematics', 'class_11', 'cbse', 'chapter', 'MATH-11-14', 'Probability', 'Random experiments, sample spaces, events, mutually exclusive and exhaustive events, and axiomatic approach to probability.', 14, 5.00)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 6. Mathematics Class 12 (13 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000032-0000-0000-0000-000000000001', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-01', 'Relations and Functions', 'Reflexive, symmetric, transitive, and equivalence relations, injective, surjective, and bijective functions.', 1, 5.00),
  ('c0000032-0000-0000-0000-000000000002', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-02', 'Inverse Trigonometric Functions', 'Principal value branches, domain, range, and graphical representations of inverse trigonometric functions.', 2, 4.50),
  ('c0000032-0000-0000-0000-000000000003', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-03', 'Matrices', 'Matrix operations, scalar multiplication, matrix multiplication, transpose, symmetric and skew-symmetric matrices, and invertible matrices.', 3, 6.00),
  ('c0000032-0000-0000-0000-000000000004', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-04', 'Determinants', 'Determinants up to 3x3, minors, cofactors, area of triangle, adjoint and inverse of matrices, and solving linear systems by matrix method.', 4, 6.50),
  ('c0000001-0000-0000-0000-000000000009', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-05', 'Continuity and Differentiability', 'Continuity at a point, derivative chain rule, implicit functions, logarithmic differentiation, parametric derivatives, and second derivatives.', 5, 9.00),
  ('c0000032-0000-0000-0000-000000000006', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-06', 'Application of Derivatives', 'Rate of change of quantities, strictly increasing and decreasing functions, and local/absolute maxima and minima optimization.', 6, 8.00),
  ('c0000001-0000-0000-0000-000000000010', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-07', 'Integrals', 'Indefinite integration, substitution, partial fractions, integration by parts, definite integrals, and fundamental theorem of calculus.', 7, 11.00),
  ('c0000032-0000-0000-0000-000000000008', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-08', 'Application of Integrals', 'Area bounded by curves, lines, parabolas, ellipses, and regions between two curves using definite integrals.', 8, 6.00),
  ('c0000032-0000-0000-0000-000000000009', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-09', 'Differential Equations', 'Order and degree, general and particular solutions, variable separable methods, homogeneous equations, and first-order linear differential equations.', 9, 6.50),
  ('c0000032-0000-0000-0000-000000000010', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-10', 'Vector Algebra', 'Vectors and scalars, magnitude and direction cosines, vector addition, scalar (dot) product, and vector (cross) product applications.', 10, 6.50),
  ('c0000032-0000-0000-0000-000000000011', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-11', 'Three-Dimensional Geometry', 'Direction cosines and ratios of lines, Cartesian and vector equations of lines in space, angle between lines, and shortest distance between skew lines.', 11, 7.00),
  ('c0000032-0000-0000-0000-000000000012', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-12', 'Linear Programming', 'Linear programming problems, objective function, constraints, graphical corner point method, and feasible bounded/unbounded regions.', 12, 4.50),
  ('c0000032-0000-0000-0000-000000000013', 'mathematics', 'class_12', 'cbse', 'chapter', 'MATH-12-13', 'Probability', 'Conditional probability, multiplication theorem, independent events, Bayes theorem, partition of sample spaces, and probability distributions.', 13, 7.50)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 7. Biology Class 11 (19 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000041-0000-0000-0000-000000000001', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-01', 'The Living World', 'Characteristics of life, biodiversity, taxonomy, systematic hierarchy, and binomial nomenclature.', 1, 2.50),
  ('c0000041-0000-0000-0000-000000000002', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-02', 'Biological Classification', 'Five kingdom classification: Monera, Protista, Fungi, Plantae, Animalia, viruses, viroids, and lichens.', 2, 4.00),
  ('c0000041-0000-0000-0000-000000000003', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-03', 'Plant Kingdom', 'Classification of plants: Algae, Bryophytes, Pteridophytes, Gymnosperms, and Angiosperms, and alternation of generations.', 3, 4.50),
  ('c0000041-0000-0000-0000-000000000004', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-04', 'Animal Kingdom', 'Basis of classification (coelom, symmetry, body organization) and non-chordate/chordate phyla characteristics.', 4, 5.50),
  ('c0000041-0000-0000-0000-000000000005', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-05', 'Morphology of Flowering Plants', 'Root, stem, leaf modifications, inflorescence types, flower parts, fruits, seeds, and family descriptions (Solanaceae).', 5, 4.50),
  ('c0000041-0000-0000-0000-000000000006', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-06', 'Anatomy of Flowering Plants', 'Meristematic and permanent plant tissues, tissue systems, internal anatomy of dicot and monocot root, stem, and leaf.', 6, 4.00),
  ('c0000041-0000-0000-0000-000000000007', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-07', 'Structural Organisation in Animals', 'Animal tissues (epithelial, connective, muscular, neural) and morphology and anatomy of frog.', 7, 3.50),
  ('c0000001-0000-0000-0000-000000000011', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-08', 'Cell: The Unit of Life', 'Cell theory, prokaryotic vs eukaryotic cell architecture, cell membrane, endomembrane system, mitochondria, and nucleus.', 8, 6.00),
  ('c0000041-0000-0000-0000-000000000009', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-09', 'Biomolecules', 'Carbohydrates, lipids, amino acids, primary and secondary structures of proteins, nucleic acids, and enzyme mechanisms.', 9, 5.00),
  ('c0000041-0000-0000-0000-000000000010', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-10', 'Cell Cycle and Cell Division', 'Stages of cell cycle, phases of mitosis, stages of meiosis I and II, crossing over, and significance of meiosis.', 10, 5.50),
  ('c0000041-0000-0000-0000-000000000011', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-11', 'Photosynthesis in Higher Plants', 'Chloroplast pigments, light reaction, cyclic/non-cyclic photophosphorylation, Calvin C3 cycle, Hatch-Slack C4 cycle, and photorespiration.', 11, 6.00),
  ('c0000041-0000-0000-0000-000000000012', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-12', 'Respiration in Plants', 'Cellular respiration, glycolysis pathway, fermentation, Krebs cycle, electron transport system (ETS), and respiratory quotient.', 12, 5.00),
  ('c0000041-0000-0000-0000-000000000013', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-13', 'Plant Growth and Development', 'Phases of plant growth, differentiation, dedifferentiation, plant growth regulators (auxins, gibberellins, cytokinins, ethylene, ABA).', 13, 3.50),
  ('c0000041-0000-0000-0000-000000000014', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-14', 'Breathing and Exchange of Gases', 'Human respiratory system, mechanism of breathing, respiratory volumes and capacities, gas exchange, and regulation of respiration.', 14, 4.50),
  ('c0000041-0000-0000-0000-000000000015', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-15', 'Body Fluids and Circulation', 'Blood composition, ABO blood groups, lymph, double circulation, human cardiac cycle, ECG, and cardiovascular disorders.', 15, 5.00),
  ('c0000041-0000-0000-0000-000000000016', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-16', 'Excretory Products and their Elimination', 'Human excretory system, nephron structure, urine formation, countercurrent multiplier mechanism, and regulation of kidney function.', 16, 4.50),
  ('c0000041-0000-0000-0000-000000000017', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-17', 'Locomotion and Movement', 'Types of movement, muscle anatomy, sliding filament theory of muscle contraction, skeletal system joints, and movement disorders.', 17, 4.00),
  ('c0000041-0000-0000-0000-000000000018', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-18', 'Neural Control and Coordination', 'Neuron structure, nerve impulse conduction and transmission across synapses, central and peripheral nervous systems.', 18, 4.50),
  ('c0000041-0000-0000-0000-000000000019', 'biology', 'class_11', 'cbse', 'chapter', 'BIO-11-19', 'Chemical Coordination and Integration', 'Endocrine glands and hormones (pituitary, thyroid, adrenal, pancreas, gonads), hormone feedback, and mechanism of hormone action.', 19, 5.00)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;

-- 8. Biology Class 12 (13 Chapters)
INSERT INTO public.curriculum_nodes (id, subject_id, grade_id, board_id, node_type, code, title, description, sequence_order, weightage_percent)
VALUES
  ('c0000042-0000-0000-0000-000000000001', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-01', 'Sexual Reproduction in Flowering Plants', 'Flower anatomy, microsporogenesis, megasporogenesis, pollination mechanisms, double fertilization, endosperm and embryo development.', 1, 7.00),
  ('c0000042-0000-0000-0000-000000000002', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-02', 'Human Reproduction', 'Male and female reproductive systems, spermatogenesis, oogenesis, menstrual cycle, fertilization, blastocyst implantation, and parturition.', 2, 7.50),
  ('c0000042-0000-0000-0000-000000000003', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-03', 'Reproductive Health', 'Population stabilization, contraceptive methods, medical termination of pregnancy (MTP), STIs, and assisted reproductive technologies (ART, IVF).', 3, 4.50),
  ('c0000001-0000-0000-0000-000000000012', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-04', 'Principles of Inheritance and Variation', 'Mendelian inheritance, non-Mendelian ratios, incomplete dominance, linkage, recombination, sex determination, and genetic disorders.', 4, 9.50),
  ('c0000042-0000-0000-0000-000000000005', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-05', 'Molecular Basis of Inheritance', 'DNA structure, search for genetic material, replication, transcription, genetic code, translation, lac operon, and Human Genome Project.', 5, 10.00),
  ('c0000042-0000-0000-0000-000000000006', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-06', 'Evolution', 'Origin of life, Darwinian evolution, evidence for evolution, natural selection, Hardy-Weinberg equilibrium, and human evolution trajectory.', 6, 6.00),
  ('c0000042-0000-0000-0000-000000000007', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-07', 'Human Health and Disease', 'Pathogens, infectious diseases (malaria, typhoid, pneumonia), innate and adaptive immunity, vaccines, cancer, and HIV-AIDS.', 7, 7.50),
  ('c0000042-0000-0000-0000-000000000008', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-08', 'Microbes in Human Welfare', 'Microbes in household products, industrial fermentation, antibiotic production, sewage water treatment, biogas, and biofertilizers.', 8, 5.00),
  ('c0000042-0000-0000-0000-000000000009', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-09', 'Biotechnology: Principles and Processes', 'Recombinant DNA technology, restriction enzymes, cloning vectors (plasmids), DNA ligase, PCR amplification, and bioreactors.', 9, 8.00),
  ('c0000042-0000-0000-0000-000000000010', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-10', 'Biotechnology and its Applications', 'Applications in agriculture (Bt cotton, RNAi pest resistance), medicine (genetically engineered insulin, gene therapy), and biosafety ethics.', 10, 6.50),
  ('c0000042-0000-0000-0000-000000000011', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-11', 'Organisms and Populations', 'Organism and abiotic environment, adaptations, population attributes, exponential and logistic population growth models, and interactions.', 11, 6.50),
  ('c0000042-0000-0000-0000-000000000012', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-12', 'Ecosystem', 'Ecosystem structure, primary and secondary productivity, decomposition, energy flow, trophic levels, ecological pyramids, and nutrient cycles.', 12, 6.00),
  ('c0000042-0000-0000-0000-000000000013', 'biology', 'class_12', 'cbse', 'chapter', 'BIO-12-13', 'Biodiversity and Conservation', 'Levels of biodiversity, species-area relationship, biodiversity loss, in-situ and ex-situ conservation, biosphere reserves, and national parks.', 13, 6.00)
ON CONFLICT (id) DO UPDATE SET
  subject_id = EXCLUDED.subject_id,
  grade_id = EXCLUDED.grade_id,
  board_id = EXCLUDED.board_id,
  code = EXCLUDED.code,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sequence_order = EXCLUDED.sequence_order,
  weightage_percent = EXCLUDED.weightage_percent;
