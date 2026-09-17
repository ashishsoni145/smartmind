# tools/data/chemistry_catalog.py
# Authentic NCERT Chemistry Catalog (All 19 Chapters: Class 11 & Class 12)

def get_chemistry_catalog():
    cat = {}

    # ==========================================
    # CLASS 11 CHEMISTRY
    # ==========================================

    # CHEM-11-01: Some Basic Concepts of Chemistry
    cat["CHEM-11-01"] = [
        {
            "title": "Laws of Chemical Combinations & Dalton’s Atomic Theory",
            "desc": "Law of conservation of mass, definite proportions, multiple proportions, Gay-Lussac's law, Avogadro's hypothesis, and Dalton's postulates.",
            "notesOverview": "Chemical reactions obey macroscopic mass and volume conservation principles that led directly to Dalton's atomic postulate that atoms are indivisible building blocks.",
            "notesSections": [
                {
                    "heading": "Foundational Laws of Mass and Volume",
                    "paragraphs": [
                        "Law of Conservation of Mass (Lavoisier, 1789): Total mass of products in any chemical or physical transformation equals total mass of reactants: m_reactants = m_products.",
                        "Law of Definite Proportions (Proust, 1799): A given pure chemical compound always contains exactly the same proportion of elements by weight, irrespective of source.",
                        "Law of Multiple Proportions (Dalton, 1803): When two elements combine to form more than one compound, masses of one element combining with fixed mass of other are in small whole-number ratios.",
                        "Gay-Lussac’s Law & Avogadro’s Law (1811): Equal volumes of all gases under identical temperature and pressure contain equal numbers of molecules: V \\propto n."
                    ],
                    "keyTakeaways": [
                        "Avogadro's law resolved the contradiction between Dalton's atomic theory and Gay-Lussac's combining volumes by establishing the difference between atoms and molecules.",
                        "Molar volume of any ideal gas at standard STP (0 °C, 1 bar) is exactly 22.71 L/mol (22.4 L at 1 atm)."
                    ],
                    "examTips": ["For multiple proportions numericals, keep the mass of one element constant (normalize to 1g or 100g) before computing the ratio of the second element."]
                }
            ],
            "misconceptions": ["Confusing Gay-Lussac's law of combining volumes with Gay-Lussac's P-T law. Combining volumes applies strictly to gaseous reacting stoichiometric volumes."],
            "formulas": [
                {
                    "label": "Avogadro’s Law at STP",
                    "formula": "V = n \\times V_m, \\quad V_m = 22.71 \\text{ L/mol at STP (1 bar, 273.15 K)}",
                    "description": "Gas volume directly proportional to moles at constant temperature and pressure.",
                    "variables": [
                        { "symbol": "V", "meaning": "Gas Volume", "unit": "L" },
                        { "symbol": "n", "meaning": "Amount of Substance", "unit": "mol" },
                        { "symbol": "V_m", "meaning": "Molar Volume", "unit": "L/mol" }
                    ]
                }
            ]
        },
        {
            "title": "Mole Concept, Molar Mass & Percentage Composition",
            "desc": "Avogadro constant N_A = 6.022 x 10^23, molar mass, atomic mass unit (u), empirical and molecular formula determination.",
            "notesOverview": "One mole contains exactly 6.02214076 x 10^23 elementary entities. It connects microscopic atomic masses in unified atomic mass units (u) with macroscopic laboratory grams.",
            "notesSections": [
                {
                    "heading": "Quantitative Mole Computations",
                    "paragraphs": [
                        "1 unified atomic mass unit (1 u) = 1/12th mass of carbon-12 atom = 1.66056 x 10^-24 g.",
                        "Empirical formula represents the simplest whole-number ratio of various atoms present in a compound, while molecular formula shows the exact number of atoms of each element: Molecular Formula = n x (Empirical Formula).",
                        "To calculate empirical formula: Convert mass percent to grams -> convert to moles -> divide by smallest mole count -> multiply to get whole integers."
                    ],
                    "keyTakeaways": [
                        "Molecular weight = n x Empirical formula weight, where n is an integer: n = M_m / M_emp.",
                        "Vapour density (VD) of a gas relates to molar mass by: Molar Mass = 2 x Vapour Density."
                    ],
                    "examTips": ["If fractional ratios like 1.33 or 1.5 appear in empirical formula calculation, multiply all atom counts by 3 or 2 respectively."]
                }
            ],
            "misconceptions": ["Confusing empirical formula with molecular formula for ionic compounds. Ionic compounds like NaCl or CaCl2 exist only as empirical network lattices without discrete molecules."],
            "formulas": [
                {
                    "label": "Mole Count Formula",
                    "formula": "n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V_{\\text{STP}}}{22.71}",
                    "description": "Fundamental relationship linking mass, entity count, and standard gas volume to moles.",
                    "variables": [
                        { "symbol": "n", "meaning": "Moles", "unit": "mol" },
                        { "symbol": "m", "meaning": "Sample Mass", "unit": "g" },
                        { "symbol": "M", "meaning": "Molar Mass", "unit": "g/mol" },
                        { "symbol": "N_A", "meaning": "Avogadro Number", "unit": "mol^{-1}" }
                    ]
                },
                {
                    "label": "Mass Percentage & Molecular Multiplier",
                    "formula": "\\% \\text{ Element} = \\frac{\\text{Mass of element in 1 mol}}{\\text{Molar Mass}} \\times 100, \\quad n = \\frac{\\text{Molar Mass}}{\\text{Empirical Formula Mass}}",
                    "description": "Mass composition percentage and empirical-to-molecular integer factor.",
                    "variables": [
                        { "symbol": "n", "meaning": "Integer Multiplier", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Stoichiometry, Limiting Reagents & Concentration of Solutions",
            "desc": "Stoichiometric calculations, limiting reagent identification, percentage yield, mass percent, mole fraction, molarity (M), and molality (m).",
            "notesOverview": "Stoichiometry calculates theoretical yields and consumed reactants. When reactants are mixed in non-stoichiometric proportions, the limiting reagent is completely consumed first and dictates product yield.",
            "notesSections": [
                {
                    "heading": "Limiting Reagents and Solution Concentrations",
                    "paragraphs": [
                        "The limiting reagent is identified by dividing each reactant's available moles by its stoichiometric coefficient: the lowest ratio reactant is strictly limiting.",
                        "Molarity (M) = Moles of solute / Volume of solution in liters (temperature dependent due to volume expansion).",
                        "Molality (m) = Moles of solute / Mass of solvent in kilograms (temperature INDEPENDENT since mass is invariant).",
                        "Mole Fraction (X_A) = n_A / (n_A + n_B), and sum of mole fractions of all components is always unity: \\sum X_i = 1."
                    ],
                    "keyTakeaways": [
                        "Molality and mole fraction are independent of temperature; Molarity changes with temperature.",
                        "Dilution equation: M_1 V_1 = M_2 V_2 for changing solvent volumes."
                    ],
                    "examTips": ["In limiting reagent problems, NEVER compare initial masses directly. Always convert grams to moles and divide by balanced stoichiometric coefficients!"]
                }
            ],
            "misconceptions": ["Believing the reactant with the lowest initial mass is always the limiting reagent. Moles divided by stoichiometric coefficients determines the limiter."],
            "formulas": [
                {
                    "label": "Molarity vs Molality",
                    "formula": "M = \\frac{n_{\\text{solute}}}{V_{\\text{soln (L)}}}, \\quad m = \\frac{n_{\\text{solute}}}{m_{\\text{solvent (kg)}}}",
                    "description": "Volumetric molar concentration versus temperature-invariant molal concentration.",
                    "variables": [
                        { "symbol": "M", "meaning": "Molarity", "unit": "mol/L" },
                        { "symbol": "m", "meaning": "Molality", "unit": "mol/kg" },
                        { "symbol": "V", "meaning": "Solution Volume", "unit": "L" }
                    ]
                }
            ]
        }
    ]

    # CHEM-11-02: Structure of Atom
    cat["CHEM-11-02"] = [
        {
            "title": "Bohr’s Model of Hydrogen Atom & Line Spectra",
            "desc": "Postulates of Bohr model, quantization of angular momentum L = nh/2pi, radius r_n = n^2 a0, energy E_n = -13.6 Z^2 / n^2 eV, Rydberg equation, and spectral series.",
            "notesOverview": "Bohr combined classical mechanics with Planck's quantum hypothesis to explain the stability and discrete emission spectra of hydrogen-like single-electron atoms (H, He+, Li2+).",
            "notesSections": [
                {
                    "heading": "Orbital Radii, Energy Levels, and Spectral Transitions",
                    "paragraphs": [
                        "Bohr Postulate 1: Electrons move in circular orbits under electrostatic Coulomb attraction: m v^2 / r = (1 / 4 pi epsilon_0) * (Z e^2 / r^2).",
                        "Bohr Postulate 2: Orbital angular momentum is quantized in integer units of h / 2pi: L = m v r = n (h / 2pi), where n = 1, 2, 3...",
                        "Bohr Postulate 3: Radiative emission or absorption occurs only during discontinuous transitions between orbits: Delta E = E_2 - E_1 = h nu.",
                        "Rydberg formula for spectral lines: 1/lambda = R_H * Z^2 * (1/n_1^2 - 1/n_2^2), giving the Lyman (UV), Balmer (Visible), Paschen, Brackett, and Pfund (IR) series."
                    ],
                    "keyTakeaways": [
                        "Energy is negative: zero reference energy corresponds to an electron completely separated from the nucleus at infinity (n -> infinity).",
                        "Balmer series is the only hydrogen spectral series falling in the visible spectrum."
                    ],
                    "examTips": ["Shortest wavelength (series limit) corresponds to n_2 = infinity; longest wavelength corresponds to the immediate next transition n_2 = n_1 + 1."]
                }
            ],
            "misconceptions": ["Applying Bohr's model equations to multi-electron atoms (like neutral Helium). Bohr's model is strictly valid ONLY for single-electron species (H, He+, Li2+, Be3+)."],
            "formulas": [
                {
                    "label": "Bohr Energy & Radius Quantization",
                    "formula": "E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}, \\quad r_n = 0.529 \\frac{n^2}{Z} \\text{ \\AA}",
                    "description": "Quantized energy levels and orbital radii for hydrogen-like species.",
                    "variables": [
                        { "symbol": "Z", "meaning": "Atomic Number", "unit": "-" },
                        { "symbol": "n", "meaning": "Principal Quantum Number", "unit": "-" },
                        { "symbol": "E_n", "meaning": "Orbital Energy", "unit": "eV" },
                        { "symbol": "r_n", "meaning": "Bohr Radius", "unit": "Å" }
                    ]
                },
                {
                    "label": "Rydberg Spectral Formula",
                    "formula": "\\frac{1}{\\lambda} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)",
                    "description": "Wavenumber of emitted photon during electronic de-excitation from n2 to n1.",
                    "variables": [
                        { "symbol": "R_H", "meaning": "Rydberg Constant", "unit": "1.097 \\times 10^7 \\text{ m}^{-1}" },
                        { "symbol": "\\lambda", "meaning": "Emitted Wavelength", "unit": "m" }
                    ]
                }
            ],
            "simulationId": "bohr_atom"
        },
        {
            "title": "Dual Nature of Matter & Heisenberg’s Uncertainty Principle",
            "desc": "de Broglie wavelength lambda = h / p = h / mv, wave-particle duality, Davisson-Germer confirmation, and Heisenberg uncertainty Delta x * Delta p >= h / 4pi.",
            "notesOverview": "Microscopic matter exhibits both particle and wave characteristics. de Broglie assigned wave properties to particles, and Heisenberg proved that position and momentum cannot be simultaneously determined with arbitrary precision.",
            "notesSections": [
                {
                    "heading": "Wave Mechanics and Fundamental Measurement Uncertainty",
                    "paragraphs": [
                        "de Broglie Hypothesis (1924): Any moving particle with momentum p has an associated matter wave of wavelength: lambda = h / p = h / (m v).",
                        "For charged particles accelerated through potential difference V: lambda = h / sqrt(2 m q V). For an electron: lambda = 12.27 / sqrt(V) Angstroms.",
                        "Heisenberg's Uncertainty Principle (1927): It is fundamentally impossible to measure simultaneously both the exact position and exact linear momentum of a microscopic particle: Delta x * Delta p_x >= h / (4 pi).",
                        "Uncertainty in energy and time: Delta E * Delta t >= h / (4 pi)."
                    ],
                    "keyTakeaways": [
                        "Matter waves are NOT electromagnetic waves; they represent probability amplitudes of locating a particle in space.",
                        "Uncertainty principle ruled out Bohr's definite classical circular electron orbits, requiring probabilistic orbital clouds."
                    ],
                    "examTips": ["Macroscopic objects (e.g. 100g cricket ball) have negligible de Broglie wavelengths (~10^-34 m), so wave properties and uncertainty are completely imperceptible."]
                }
            ],
            "misconceptions": ["Assuming Heisenberg's uncertainty is caused by clumsy measuring instruments. It is a fundamental intrinsic quantum property of wave packets in nature."],
            "formulas": [
                {
                    "label": "de Broglie Wavelength",
                    "formula": "\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}}",
                    "description": "Wavelength of matter wave associated with particle having momentum p or kinetic energy K.",
                    "variables": [
                        { "symbol": "h", "meaning": "Planck Constant", "unit": "6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}" },
                        { "symbol": "m", "meaning": "Particle Mass", "unit": "kg" },
                        { "symbol": "v", "meaning": "Velocity", "unit": "m/s" },
                        { "symbol": "\\lambda", "meaning": "de Broglie Wavelength", "unit": "m" }
                    ]
                },
                {
                    "label": "Heisenberg Uncertainty Relation",
                    "formula": "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2}",
                    "description": "Fundamental limit to the precision of simultaneous conjugate position and momentum measurements.",
                    "variables": [
                        { "symbol": "\\Delta x", "meaning": "Position Uncertainty", "unit": "m" },
                        { "symbol": "\\Delta p", "meaning": "Momentum Uncertainty", "unit": "kg m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Quantum Numbers, Orbitals & Electronic Configuration",
            "desc": "Schrödinger wave equation, psi and psi^2, quantum numbers (n, l, m_l, m_s), radial and angular nodes, Aufbau principle, Pauli exclusion principle, and Hund’s rule.",
            "notesOverview": "The quantum mechanical model describes electron distribution via wavefunctions psi. The square of wavefunction psi^2 defines electron probability density, characterized by four quantum numbers.",
            "notesSections": [
                {
                    "heading": "Four Quantum Numbers and Orbital Filling Rules",
                    "paragraphs": [
                        "Principal (n = 1, 2, ...): Determines main energy level (shell) and size of orbital. Max electrons = 2n^2.",
                        "Azimuthal / Orbital Angular Momentum (l = 0 to n - 1): Determines orbital subshell shape (l = 0: s, l = 1: p, l = 2: d, l = 3: f). Orbital angular momentum L = sqrt(l(l+1)) * h/2pi.",
                        "Magnetic (m_l = -l to +l): Determines spatial orientation of orbitals (2l + 1 orientations per subshell).",
                        "Spin (m_s = +1/2 or -1/2): Describes intrinsic electron spin angular momentum.",
                        "Aufbau Principle: Orbitals are filled in order of increasing energy according to (n + l) rule.",
                        "Pauli Exclusion Principle: No two electrons in an atom can have the same set of all four quantum numbers.",
                        "Hund’s Rule of Maximum Multiplicity: Pairing of electrons in degenerate orbitals does not take place until each orbital is singly occupied with parallel spins."
                    ],
                    "keyTakeaways": [
                        "Total number of nodes = n - 1 (Radial nodes = n - l - 1, Angular nodes = l).",
                        "Half-filled (d5) and completely filled (d10) subshells possess extra stability due to symmetry and maximum exchange energy (e.g. Cr: [Ar] 4s1 3d5, Cu: [Ar] 4s1 3d10)."
                    ],
                    "examTips": ["If two orbitals have the same (n + l) value, the orbital with the lower n value possesses lower energy and fills first (e.g. 3d vs 4p: 3d has n=3, 4p has n=4, so 3d is lower energy)."]
                }
            ],
            "misconceptions": ["Assuming an electron physically spins on its axis like a planet. Spin is an intrinsic relativistic quantum mechanical angular momentum property."],
            "formulas": [
                {
                    "label": "Orbital Angular Momentum & Node Formulas",
                    "formula": "L = \\sqrt{l(l+1)} \\frac{h}{2\\pi}, \\quad \\text{Radial Nodes} = n - l - 1, \\quad \\text{Angular Nodes} = l",
                    "description": "Quantized orbital angular momentum and nodal spatial planes.",
                    "variables": [
                        { "symbol": "n", "meaning": "Principal Quantum Number", "unit": "-" },
                        { "symbol": "l", "meaning": "Azimuthal Quantum Number", "unit": "-" },
                        { "symbol": "L", "meaning": "Angular Momentum", "unit": "J s" }
                    ]
                }
            ]
        }
    ]

    # CHEM-11-03: Classification of Elements and Periodicity in Properties
    cat["CHEM-11-03"] = [
        {
            "title": "Modern Periodic Law & Periodic Table Architecture",
            "desc": "Moseley's law sqrt(nu) = a(Z - b), modern periodic law based on atomic number Z, s, p, d, f block divisions, and IUPAC nomenclature for Z > 100.",
            "notesOverview": "Henry Moseley established that atomic number Z, rather than atomic mass, is the fundamental property of an element. Physical and chemical properties of elements are periodic functions of their atomic numbers.",
            "notesSections": [
                {
                    "heading": "Periodic Law and Block Configurations",
                    "paragraphs": [
                        "Moseley’s X-ray Experiment (1913): Characteristic X-ray frequency nu satisfies sqrt(nu) = a(Z - b). A plot of sqrt(nu) versus Z yields a straight line, proving atomic number is fundamental.",
                        "Modern Periodic Table consists of 7 horizontal periods and 18 vertical groups.",
                        "s-block: ns^1-2 (alkali and alkaline earth metals). Highly electropositive, reactive reducing agents.",
                        "p-block: ns^2 np^1-6 (groups 13 to 18). Includes metals, metalloids, and non-metals.",
                        "d-block: (n-1)d^1-10 ns^0-2 (groups 3 to 12). Transition elements with variable oxidation states.",
                        "f-block: (n-2)f^1-14 (n-1)d^0-1 ns^2 (lanthanoids and actinoids). Inner transition elements placed separately at bottom."
                    ],
                    "keyTakeaways": [
                        "Periodic repetition of properties arises from recurring valence shell electronic configurations.",
                        "Elements with Z > 100 use systematic Latin roots: un (1), nil (0), bi (2), tri (3), quad (4), pent (5), hex (6), sept (7), oct (8), enn (9) with suffix '-ium'."
                    ],
                    "examTips": ["Group number determination: s-block = valence electrons; p-block = 12 + valence p-electrons; d-block = 2 + (n-1)d electrons."]
                }
            ],
            "misconceptions": ["Thinking Mendeleev arranged elements by atomic number. Mendeleev organized elements by atomic mass; Moseley introduced atomic number."],
            "formulas": [
                {
                    "label": "Moseley’s Law",
                    "formula": "\\sqrt{\\nu} = a (Z - b)",
                    "description": "Linear relationship between frequency of characteristic X-rays and atomic number Z.",
                    "variables": [
                        { "symbol": "\\nu", "meaning": "X-ray Frequency", "unit": "Hz" },
                        { "symbol": "Z", "meaning": "Atomic Number", "unit": "-" },
                        { "symbol": "a, b", "meaning": "Moseley Constants", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Periodic Trends in Physical & Chemical Properties",
            "desc": "Atomic and ionic radii, lanthanoid contraction, ionization enthalpy (IE), electron gain enthalpy (Delta_eg H), electronegativity (Pauling scale), and anomalous properties of 2nd period elements.",
            "notesOverview": "Atomic properties vary systematically across periods and down groups due to the interplay between effective nuclear charge Z_eff and electronic shielding.",
            "notesSections": [
                {
                    "heading": "Periodic Gradients Across Periods and Groups",
                    "paragraphs": [
                        "Atomic Radius: Decreases across a period (increasing Z_eff pulls electrons closer); increases down a group (addition of new principal shells). Cation < Parent Atom < Anion.",
                        "Ionization Enthalpy (Delta_i H): Energy required to remove the most loosely bound electron from an isolated gaseous atom. Increases across a period, decreases down a group.",
                        "Anomalies in Delta_i H: Be > B (2s2 full subshell vs 2p1) and N > O (2p3 half-filled stable configuration vs 2p4).",
                        "Electron Gain Enthalpy (Delta_eg H): Enthalpy change when an electron is added to gaseous atom. Cl has more negative Delta_eg H than F due to high interelectronic repulsions in compact 2p subshell of fluorine.",
                        "Electronegativity: Pauling scale ability of an atom in a molecule to attract shared electron pair. Fluorine is highest (4.0). Decreases down group, increases across period."
                    ],
                    "keyTakeaways": [
                        "Noble gases possess positive electron gain enthalpies due to fully filled octets.",
                        "Second period elements (Li, Be, B, C, N, O, F) show anomalous properties due to small size, high electronegativity, and total absence of d-orbitals."
                    ],
                    "examTips": ["Isoelectronic species radius comparison: Greater positive nuclear charge means smaller ionic radius (e.g. Al3+ < Mg2+ < Na+ < F- < O2- < N3-)."]
                }
            ],
            "misconceptions": ["Believing Fluorine has the highest electron affinity. Fluorine is the most electronegative, but Chlorine has the highest negative electron gain enthalpy."],
            "formulas": [
                {
                    "label": "Effective Nuclear Charge & Pauling Electronegativity",
                    "formula": "Z_{\\text{eff}} = Z - \\sigma, \\quad |\\chi_A - \\chi_B| = 0.208 \\sqrt{\\Delta} \\text{ (in kcal/mol)}",
                    "description": "Slater shielding screening factor and Pauling electronegativity difference formula.",
                    "variables": [
                        { "symbol": "Z", "meaning": "Nuclear Charge", "unit": "-" },
                        { "symbol": "\\sigma", "meaning": "Shielding Constant", "unit": "-" },
                        { "symbol": "\\chi", "meaning": "Pauling Electronegativity", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # CHEM-11-04: Chemical Bonding and Molecular Structure
    cat["CHEM-11-04"] = [
        {
            "title": "VSEPR Theory & Molecular Geometry",
            "desc": "Valence Shell Electron Pair Repulsion theory, repulsion order lp-lp > lp-bp > bp-bp, molecular geometry versus electron geometry (linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral).",
            "notesOverview": "VSEPR theory predicts three-dimensional molecular geometries by minimizing electrostatic repulsion between valence shell electron pairs (bonding pairs and lone pairs) surrounding the central atom.",
            "notesSections": [
                {
                    "heading": "Principles of Valence Shell Electron Repulsion",
                    "paragraphs": [
                        "Electron pairs surround the central atom and orient themselves in space to minimize mutual electrostatic repulsion, maximizing spatial separation.",
                        "Repulsion strength hierarchy: Lone Pair - Lone Pair (lp - lp) > Lone Pair - Bond Pair (lp - bp) > Bond Pair - Bond Pair (bp - bp).",
                        "Lone pairs occupy more spatial volume because they are localized under the attraction of a single atomic nucleus, compressing adjacent bond angles.",
                        "Examples: CH4 (4 bp, 0 lp: tetrahedral, 109.5°); NH3 (3 bp, 1 lp: trigonal pyramidal, 107°); H2O (2 bp, 2 lp: bent / V-shaped, 104.5°).",
                        "Trigonal Bipyramidal (PCl5): Axial bonds (longer, 90° repulsion from 3 equatorial bonds) are longer and weaker than equatorial bonds (120° angles)."
                    ],
                    "keyTakeaways": [
                        "In trigonal bipyramidal systems (like SF4 or ClF3), lone pairs always occupy equatorial positions to experience only two 90° repulsions instead of three.",
                        "In octahedral systems with two lone pairs (XeF4), lone pairs occupy trans positions at 180° to yield square planar geometry."
                    ],
                    "examTips": ["PCl5 is thermally unstable and decomposes to PCl3 + Cl2 because the two axial P-Cl bonds are longer and weaker than the three equatorial bonds."]
                }
            ],
            "misconceptions": ["Confusing electron pair geometry with molecular shape. Electron geometry considers all pairs; molecular shape considers only the spatial arrangement of atoms."],
            "formulas": [
                {
                    "label": "Steric Number Formula",
                    "formula": "\\text{Steric Number} = \\frac{1}{2} [V + M - C + A]",
                    "description": "Calculates total electron pairs to determine hybridisation and basic VSEPR electron geometry.",
                    "variables": [
                        { "symbol": "V", "meaning": "Valence Electrons of Central Atom", "unit": "-" },
                        { "symbol": "M", "meaning": "Monovalent Surrounding Atoms (H, X)", "unit": "-" },
                        { "symbol": "C", "meaning": "Cationic Positive Charge", "unit": "-" },
                        { "symbol": "A", "meaning": "Anionic Negative Charge", "unit": "-" }
                    ]
                }
            ],
            "simulationId": "vsepr_geometry"
        },
        {
            "title": "Valence Bond Theory & Hybridisation",
            "desc": "Orbital overlap concept, sigma (sigma) and pi (pi) bonds, sp, sp2, sp3, sp3d, sp3d2 hybridisation schemes with geometry and bond angles.",
            "notesOverview": "Valence Bond Theory explains covalent bonding through orbital overlapping. Hybridisation mixes atomic orbitals of similar energies to form identical hybrid orbitals with specific spatial directional characteristics.",
            "notesSections": [
                {
                    "heading": "Orbital Overlap and Hybrid Orbital Spatial Geometries",
                    "paragraphs": [
                        "Sigma (sigma) bond: Formed by end-to-end (head-on / axial) overlap along internuclear axis (s-s, s-p, or p-p). Strong bond with cylindrical symmetry.",
                        "Pi (pi) bond: Formed by lateral (sideways) overlap of parallel unhybridized p-orbitals. Weaker than sigma bond with electron density above and below the nodal plane.",
                        "sp Hybridisation: 1 s + 1 p -> 2 hybrid orbitals at 180° (Linear, e.g. BeCl2, C2H2). 50% s-character.",
                        "sp2 Hybridisation: 1 s + 2 p -> 3 hybrid orbitals at 120° (Trigonal Planar, e.g. BF3, C2H4). 33.3% s-character.",
                        "sp3 Hybridisation: 1 s + 3 p -> 4 hybrid orbitals at 109.5° (Tetrahedral, e.g. CH4, NH3, H2O). 25% s-character.",
                        "sp3d (Trigonal Bipyramidal, PCl5) and sp3d2 (Octahedral, SF6)."
                    ],
                    "keyTakeaways": [
                        "Higher s-character in hybrid orbital increases electronegativity, bond strength, and acidity (alkyne C-H > alkene C-H > alkane C-H).",
                        "Single bond contains 1 sigma; double bond contains 1 sigma + 1 pi; triple bond contains 1 sigma + 2 pi."
                    ],
                    "examTips": ["Resonance does not alter the actual hybridisation state or geometry of the molecule. Count sigma bonds and localized lone pairs only when assigning hybridisation."]
                }
            ],
            "misconceptions": ["Believing hybridisation is a physical process where atoms physically morph. It is a mathematical model combining wavefunctions to explain observed molecular shapes."],
            "formulas": [
                {
                    "label": "Hybridisation and s-Character Relations",
                    "formula": "\\cos\\theta = -\\frac{s}{1 - s} = -\\frac{1}{n} \\quad (\\text{for } sp^n)",
                    "description": "Geometric relationship connecting inter-orbital angle theta to fractional s-character in hybrid orbitals.",
                    "variables": [
                        { "symbol": "\\theta", "meaning": "Bond Angle", "unit": "rad" },
                        { "symbol": "s", "meaning": "Fractional s-Character", "unit": "-" },
                        { "symbol": "n", "meaning": "p-Character Power", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Molecular Orbital Theory (MOT) & Hydrogen Bonding",
            "desc": "LCAO principle, bonding vs antibonding orbitals, energy level diagrams for homonuclear diatomics (<=14 e- vs >14 e-), bond order, magnetic behavior, and hydrogen bonding.",
            "notesOverview": "Molecular Orbital Theory treats electrons as moving under the influence of all nuclei in the molecule. Linear Combination of Atomic Orbitals (LCAO) generates bonding (constructive interference) and antibonding (destructive interference) molecular orbitals.",
            "notesSections": [
                {
                    "heading": "LCAO Energy Sequences and Bond Order",
                    "paragraphs": [
                        "Bonding MO (sigma, pi): Formed by constructive wave addition (psi_A + psi_B), possessing lower energy and higher electron density between nuclei.",
                        "Antibonding MO (sigma*, pi*): Formed by destructive wave subtraction (psi_A - psi_B), possessing higher energy with a nodal plane between nuclei.",
                        "Energy sequence for <= 14 electrons (B2, C2, N2): sigma1s < sigma*1s < sigma2s < sigma*2s < (pi2px = pi2py) < sigma2pz < (pi*2px = pi*2py) < sigma*2pz (sp mixing flips pi and sigma2pz).",
                        "Energy sequence for > 14 electrons (O2, F2): sigma1s < sigma*1s < sigma2s < sigma*2s < sigma2pz < (pi2px = pi2py) < (pi*2px = pi*2py) < sigma*2pz.",
                        "Bond Order = 1/2 * (N_b - N_a). If Bond Order > 0, molecule is stable. Molecules with unpaired electrons are paramagnetic (O2 has 2 unpaired electrons in pi*2p orbitals, explaining its experimentally observed paramagnetism)."
                    ],
                    "keyTakeaways": [
                        "MOT successfully explains the paramagnetism of O2, which Lewis and Valence Bond theories failed to explain.",
                        "Higher bond order corresponds to shorter bond length and higher bond dissociation enthalpy."
                    ],
                    "examTips": ["Hydrogen bonding occurs strictly between H and highly electronegative elements F, O, N. Intermolecular H-bonding increases boiling point (H2O vs H2S); intramolecular H-bonding (o-nitrophenol) decreases boiling point."]
                }
            ],
            "misconceptions": ["Believing O2 is diamagnetic because all its valence electrons appear paired in Lewis structures. MOT correctly shows 2 unpaired electrons in degenerate pi* antibonding orbitals."],
            "formulas": [
                {
                    "label": "Bond Order Formula",
                    "formula": "\\text{Bond Order} = \\frac{1}{2} (N_b - N_a)",
                    "description": "Determines stability and multiplicity of covalent bonds between two atoms.",
                    "variables": [
                        { "symbol": "N_b", "meaning": "Bonding Electrons", "unit": "-" },
                        { "symbol": "N_a", "meaning": "Antibonding Electrons", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # Merge all remaining Class 11 and Class 12 chapters
    from chemistry_part2 import CHEMISTRY_PART2
    cat.update(CHEMISTRY_PART2)

    return cat

if __name__ == "__main__":
    cat = get_chemistry_catalog()
    print("Total Chemistry chapters loaded:", len(cat))
    for code, topics in cat.items():
        print(f"  {code}: {len(topics)} topics")
