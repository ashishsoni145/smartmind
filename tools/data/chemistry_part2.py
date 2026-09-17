# tools/data/chemistry_part2.py
# Authentic NCERT Chemistry Catalog - Remaining Class 11 & All Class 12

CHEMISTRY_PART2 = {
    # CHEM-11-05: Chemical Thermodynamics
    "CHEM-11-05": [
        {
            "title": "First Law of Thermodynamics, Enthalpy & Heat Capacity",
            "desc": "System and surroundings, state functions, internal energy Delta U = q + w, work of expansion w = -P Delta V, enthalpy H = U + PV, and Cp - Cv = R.",
            "notesOverview": "Chemical thermodynamics studies energy transformations in chemical reactions. The First Law states energy conservation: change in internal energy equals heat supplied plus work done on the system.",
            "notesSections": [
                {
                    "heading": "First Law, Enthalpy, and Heat Capacities",
                    "paragraphs": [
                        "Internal Energy (U): Sum of all microscopic kinetic and potential energies. State function: Delta U = q + w (IUPAC sign convention: heat absorbed q > 0, work done ON system w > 0).",
                        "Isothermal reversible expansion of ideal gas: w_rev = -2.303 n R T log10(V2 / V1). Irreversible expansion against external pressure P_ext: w = -P_ext (V2 - V1).",
                        "Enthalpy (H = U + PV): Heat change at constant pressure is Delta H = q_p. Relationship for reactions involving gases: Delta H = Delta U + Delta n_g R T.",
                        "Heat Capacity: C_v = (dU / dT)_v and C_p = (dH / dT)_p. For one mole of an ideal gas: C_p - C_v = R (Mayer’s relation)."
                    ],
                    "keyTakeaways": [
                        "In cyclic processes, change in any state function is identically zero: Delta U = 0, Delta H = 0.",
                        "For adiabatic processes, heat exchange is zero (q = 0), so Delta U = w_ad."
                    ],
                    "examTips": ["Always calculate Delta n_g = (moles of gaseous products) - (moles of gaseous reactants). Solids and liquids are strictly ignored in Delta n_g!"]
                }
            ],
            "misconceptions": ["Thinking work done in reversible expansion equals irreversible expansion. Reversible isothermal expansion delivers the MAXIMUM work possible."],
            "formulas": [
                {
                    "label": "First Law & Gaseous Reaction Enthalpy",
                    "formula": "\\Delta U = q + w, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
                    "description": "Internal energy change and isobaric reaction enthalpy adjustment.",
                    "variables": [
                        { "symbol": "\\Delta U", "meaning": "Internal Energy Change", "unit": "J" },
                        { "symbol": "q", "meaning": "Heat Absorbed", "unit": "J" },
                        { "symbol": "w", "meaning": "Work Done", "unit": "J" },
                        { "symbol": "\\Delta n_g", "meaning": "Change in Gas Moles", "unit": "mol" }
                    ]
                },
                {
                    "label": "Reversible Isothermal Work & Heat Capacities",
                    "formula": "w_{\\text{rev}} = -2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right), \\quad C_p - C_v = R",
                    "description": "Maximum work of isothermal ideal gas expansion and Mayer heat capacity difference.",
                    "variables": [
                        { "symbol": "w_{\\text{rev}}", "meaning": "Reversible Expansion Work", "unit": "J" },
                        { "symbol": "C_p, C_v", "meaning": "Molar Heat Capacities", "unit": "J/(mol K)" }
                    ]
                }
            ]
        },
        {
            "title": "Hess’s Law & Enthalpy of Reactions",
            "desc": "Standard enthalpy changes, Hess's law of constant heat summation, standard enthalpy of formation Delta_f H°, combustion, bond dissociation enthalpy.",
            "notesOverview": "Hess’s law of constant heat summation is a direct manifestation of enthalpy being a state function: net enthalpy change in a reaction is independent of intermediate pathway steps.",
            "notesSections": [
                {
                    "heading": "Thermochemical Calculations and Hess’s Law",
                    "paragraphs": [
                        "Hess’s Law: If a chemical reaction occurs in several steps, the overall standard reaction enthalpy is the sum of standard enthalpies of the intermediate steps.",
                        "Standard Enthalpy of Formation (Delta_f H°): Enthalpy change when one mole of a compound is formed from its constituent elements in their standard states. Delta_f H° of pure elements in reference states is defined as zero.",
                        "Reaction Enthalpy from Formation Enthalpies: Delta_r H° = sum(Delta_f H° products) - sum(Delta_f H° reactants).",
                        "Reaction Enthalpy from Bond Enthalpies: Delta_r H° = sum(Bond Enthalpies reactants) - sum(Bond Enthalpies products)."
                    ],
                    "keyTakeaways": [
                        "Delta_f H° for graphite, O2(g), Cl2(g), and Br2(l) is ZERO at 298 K, 1 bar.",
                        "Lattice enthalpy can be calculated using the Born-Haber cycle by combining sublimation, ionization, dissociation, and electron gain enthalpies."
                    ],
                    "examTips": ["When using bond enthalpies, it is ALWAYS: Reactants minus Products. When using formation enthalpies, it is ALWAYS: Products minus Reactants!"]
                }
            ],
            "misconceptions": ["Using Products minus Reactants for bond enthalpies. Bond enthalpy calculation requires breaking bonds (reactants, +ve) minus forming bonds (products, -ve)."],
            "formulas": [
                {
                    "label": "Hess’s Law & Bond Enthalpy Formulations",
                    "formula": "\\Delta_r H^\\circ = \\sum \\Delta_f H^\\circ(\\text{products}) - \\sum \\Delta_f H^\\circ(\\text{reactants}) = \\sum \\text{B.E.}(\\text{reactants}) - \\sum \\text{B.E.}(\\text{products})",
                    "description": "Standard reaction enthalpy via formation enthalpies and covalent bond dissociation energies.",
                    "variables": [
                        { "symbol": "\\Delta_r H^\\circ", "meaning": "Standard Reaction Enthalpy", "unit": "kJ/mol" },
                        { "symbol": "\\text{B.E.}", "meaning": "Bond Enthalpy", "unit": "kJ/mol" }
                    ]
                }
            ]
        },
        {
            "title": "Entropy, Gibbs Free Energy & Spontaneity",
            "desc": "Second law of thermodynamics, entropy Delta S = q_rev / T, Gibbs free energy Delta G = Delta H - T Delta S, spontaneity criteria, and relationship with equilibrium constant Delta G° = -RT ln K.",
            "notesOverview": "Entropy measures microscopic molecular disorder. The Second Law states that the entropy of the universe increases in any spontaneous process. Gibbs free energy provides the universal thermodynamic criterion for reaction spontaneity at constant temperature and pressure.",
            "notesSections": [
                {
                    "heading": "Entropy and Gibbs Free Energy Criterion",
                    "paragraphs": [
                        "Entropy (S): State function measuring microscopic randomness. For reversible process: Delta S = q_rev / T. Delta S_total = Delta S_system + Delta S_surroundings > 0 for any spontaneous process.",
                        "Gibbs Free Energy: G = H - TS. At constant T and P: Delta G_sys = Delta H_sys - T Delta S_sys.",
                        "Spontaneity criteria: Delta G < 0 (spontaneous process), Delta G = 0 (equilibrium state), Delta G > 0 (non-spontaneous process).",
                        "Temperature dependence of spontaneity: If Delta H < 0 and Delta S > 0, spontaneous at ALL temperatures. If Delta H > 0 and Delta S < 0, non-spontaneous at all temperatures.",
                        "Relation with Equilibrium Constant: Delta_r G° = -2.303 R T log10 K_eq."
                    ],
                    "keyTakeaways": [
                        "Third Law of Thermodynamics: The entropy of any pure, perfectly crystalline substance approaches zero as absolute temperature approaches 0 Kelvin.",
                        "At chemical equilibrium, Delta G = 0, but Delta G° is NOT necessarily zero."
                    ],
                    "examTips": ["To find the threshold temperature where a non-spontaneous reaction becomes spontaneous, set Delta G = 0 -> T_eq = Delta H / Delta S."]
                }
            ],
            "misconceptions": ["Assuming Delta G° = 0 at equilibrium. At equilibrium, Delta G = 0. Delta G° is related to equilibrium constant by Delta G° = -RT ln K."],
            "formulas": [
                {
                    "label": "Gibbs-Helmholtz Spontaneity Equation",
                    "formula": "\\Delta G = \\Delta H - T \\Delta S, \\quad \\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K",
                    "description": "Fundamental thermodynamic criterion for spontaneity and link to equilibrium constant.",
                    "variables": [
                        { "symbol": "\\Delta G", "meaning": "Gibbs Free Energy Change", "unit": "kJ/mol" },
                        { "symbol": "\\Delta H", "meaning": "Enthalpy Change", "unit": "kJ/mol" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                        { "symbol": "\\Delta S", "meaning": "Entropy Change", "unit": "J/(mol K)" },
                        { "symbol": "K", "meaning": "Equilibrium Constant", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-11-06: Equilibrium
    "CHEM-11-06": [
        {
            "title": "Law of Chemical Equilibrium & Le Chatelier’s Principle",
            "desc": "Dynamic equilibrium, equilibrium constants Kc and Kp, Kp = Kc (RT)^Delta n_g, reaction quotient Q, and Le Chatelier's response to concentration, pressure, temperature, and inert gas additions.",
            "notesOverview": "Chemical equilibrium is dynamic: forward and reverse reaction rates are equal. Le Chatelier's principle predicts how an equilibrium system shifts to counteract applied external stresses.",
            "notesSections": [
                {
                    "heading": "Equilibrium Constants and Le Chatelier’s Law",
                    "paragraphs": [
                        "Law of Mass Action: For aA + bB <=> cC + dD, Kc = [C]^c [D]^d / ([A]^a [B]^b).",
                        "Relation between Kp and Kc: Kp = Kc (R T)^(Delta n_g), where Delta n_g = (c + d) - (a + b) for gaseous species.",
                        "Reaction Quotient Q: If Q < K, reaction proceeds forward; if Q > K, reaction proceeds in reverse; if Q = K, system is at equilibrium.",
                        "Le Chatelier’s Principle: Any change in concentration, pressure, or temperature causes the equilibrium to shift in the direction that counteracts the change.",
                        "Temperature: For exothermic reactions (Delta H < 0), increasing T shifts equilibrium in reverse (decreases K). For endothermic reactions (Delta H > 0), increasing T shifts equilibrium forward (increases K).",
                        "Addition of inert gas: At constant volume, no effect on equilibrium. At constant pressure, shifts equilibrium toward the side with more gaseous moles."
                    ],
                    "keyTakeaways": [
                        "Catalysts do NOT alter the position of chemical equilibrium or the value of K; they only increase the rate at which equilibrium is reached.",
                        "Pure solids and pure liquids have constant concentration and are omitted from equilibrium constant expressions."
                    ],
                    "examTips": ["Temperature is the ONLY factor that alters the numerical value of the equilibrium constant K!"]
                }
            ],
            "misconceptions": ["Believing addition of inert gas at constant volume shifts equilibrium. At constant volume, partial pressures of reacting gases do not change, so equilibrium is unaffected."],
            "formulas": [
                {
                    "label": "Equilibrium Constant Relations",
                    "formula": "K_p = K_c (R T)^{\\Delta n_g}, \\quad \\ln\\left(\\frac{K_2}{K_1}\\right) = \\frac{\\Delta H^\\circ}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
                    "description": "Relationship between Kp and Kc, and van 't Hoff temperature dependence of equilibrium constant.",
                    "variables": [
                        { "symbol": "K_p", "meaning": "Partial Pressure Constant", "unit": "-" },
                        { "symbol": "K_c", "meaning": "Molar Concentration Constant", "unit": "-" },
                        { "symbol": "\\Delta n_g", "meaning": "Gaseous Mole Difference", "unit": "mol" },
                        { "symbol": "\\Delta H^\\circ", "meaning": "Standard Reaction Enthalpy", "unit": "J/mol" }
                    ]
                }
            ]
        },
        {
            "title": "Ionic Equilibrium: pH, Buffers & Solubility Product",
            "desc": "Arrhenius, Brönsted-Lowry and Lewis acid-base theories, autoionization of water Kw = 1.0 x 10^-14, pH scale, Henderson-Hasselbalch buffer equation, and solubility product Ksp.",
            "notesOverview": "Ionic equilibrium involves weak electrolytes, dissociation constants, hydronium concentration pH, common ion effect, buffer systems resisting pH changes, and sparingly soluble salt precipitation.",
            "notesSections": [
                {
                    "heading": "Acid-Base Dissociation, Buffers, and Ksp",
                    "paragraphs": [
                        "Brönsted-Lowry: Acid is a proton (H+) donor; base is a proton acceptor. Conjugate acid-base pairs differ by a single proton: Ka * Kb = Kw = 10^-14 at 298 K.",
                        "Lewis Concept: Acid is an electron pair acceptor (BF3, AlCl3); base is an electron pair donor (NH3, H2O).",
                        "pH Scale (Sørensen): pH = -log10[H3O+], pOH = -log10[OH-], and pH + pOH = 14 at 25 °C.",
                        "Buffer Solutions: Resist pH changes upon addition of small amounts of strong acid or base. Acidic buffer (CH3COOH + CH3COONa): pH = pKa + log10([Salt] / [Acid]). Basic buffer: pOH = pKb + log10([Salt] / [Base]).",
                        "Solubility Product (Ksp): For sparingly soluble salt A_x B_y <=> x A^(y+) + y B^(x-), Ksp = [A^(y+)]^x [B^(x-)]^y. Precipitation occurs when ionic product Q_sp > Ksp."
                    ],
                    "keyTakeaways": [
                        "Common Ion Effect suppresses the ionization of a weak electrolyte by adding a strong electrolyte containing a common ion.",
                        "A buffer has maximum buffer capacity when [Salt] = [Acid], where pH = pKa."
                    ],
                    "examTips": ["For 10^-8 M HCl solution, pH is NOT 8 (an acid cannot be alkaline!). You must include water autoionization: [H+]_total = 10^-8 + 10^-7 = 1.05 x 10^-7 M -> pH approx 6.98."]
                }
            ],
            "misconceptions": ["Assuming K_w is always 10^-14. At higher temperatures (e.g. 60 °C), autoionization of water increases (Kw ~ 10^-13), so neutral pH drops below 7."],
            "formulas": [
                {
                    "label": "Henderson-Hasselbalch & Solubility Product",
                    "formula": "\\text{pH} = pK_a + \\log_{10}\\left( \\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]} \\right), \\quad K_{sp} = x^x y^y S^{x+y}",
                    "description": "Buffer pH calculation and relationship between solubility S and solubility product Ksp.",
                    "variables": [
                        { "symbol": "\\text{pH}", "meaning": "Hydronium Exponent", "unit": "-" },
                        { "symbol": "pK_a", "meaning": "Acid Dissociation Index", "unit": "-" },
                        { "symbol": "K_{sp}", "meaning": "Solubility Product Constant", "unit": "-" },
                        { "symbol": "S", "meaning": "Molar Solubility", "unit": "mol/L" }
                    ]
                }
            ]
        }
    ],

    # CHEM-11-07: Redox Reactions
    "CHEM-11-07": [
        {
            "title": "Oxidation States & Balancing Redox Reactions",
            "desc": "Classical and electron transfer concepts of oxidation/reduction, rules for calculating oxidation numbers, disproportionation reactions, ion-electron and oxidation number balancing methods.",
            "notesOverview": "Redox reactions involve simultaneous reduction (gain of electrons, decrease in oxidation state) and oxidation (loss of electrons, increase in oxidation state).",
            "notesSections": [
                {
                    "heading": "Oxidation Numbers and Balancing Mechanisms",
                    "paragraphs": [
                        "Oxidation Number Rules: Elemental state = 0; Fluorine is always -1; Oxygen is usually -2 (except peroxides -1, superoxides -1/2, OF2 +2); Hydrogen is +1 (except metal hydrides -1).",
                        "Disproportionation Reactions: A single chemical species is simultaneously oxidized and reduced (e.g. 2 H2O2 -> 2 H2O + O2, where oxygen goes from -1 to -2 and 0).",
                        "Ion-Electron (Half-Reaction) Method: Split into oxidation and reduction half-reactions -> balance atoms other than O and H -> balance O with H2O -> balance H with H+ (in acidic medium) -> balance charge with electrons -> equalize electrons and sum."
                    ],
                    "keyTakeaways": [
                        "In basic medium, after balancing with H+, add OH- ions equal to H+ to both sides of the equation to form water molecules.",
                        "Oxidation state cannot exceed the group valence number (e.g. S in H2SO5 has oxidation state +6, not +8, due to presence of one peroxy linkage -O-O-)."
                    ],
                    "examTips": ["Identify peroxy bonds in H2SO5 (Caro's acid), H2S2O8 (Marshall's acid), and CrO5 (butterfly structure, Cr is +6 with two peroxy groups)."]
                }
            ],
            "misconceptions": ["Assigning fractional or anomalous oxidation numbers mechanically without inspecting molecular structure. Structure reveals true formal oxidation states."],
            "formulas": [
                {
                    "label": "Redox Half-Reaction Balance",
                    "formula": "\\text{Oxidant} + n e^- \\longrightarrow \\text{Reduced Form}, \\quad \\Delta(\\text{Oxidation Number}) = n e^-",
                    "description": "Conservation of charge and electron transfer in redox half-reactions.",
                    "variables": [
                        { "symbol": "n", "meaning": "Number of Transferred Electrons", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-11-08: Organic Chemistry – Some Basic Principles and Techniques
    "CHEM-11-08": [
        {
            "title": "IUPAC Nomenclature & Electronic Effects in Organic Molecules",
            "desc": "IUPAC rules for aliphatic and functionalized aromatic compounds, inductive effect (+I, -I), electromeric effect, resonance/mesomeric effect (+M, -M), and hyperconjugation.",
            "notesOverview": "Organic chemistry fundamentals govern molecular stability and reaction mechanisms through permanent and temporary electronic displacement effects.",
            "notesSections": [
                {
                    "heading": "Electronic Displacement Effects",
                    "paragraphs": [
                        "Inductive Effect (I): Permanent polarization of sigma-bond electrons due to electronegativity differences. Transmitted through carbon chain, diminishes rapidly beyond 3 carbons. -I groups: -NO2 > -CN > -COOH > -F > -Cl. +I groups: -tBu > -iPr > -Et > -Me.",
                        "Resonance / Mesomeric Effect (M/R): Permanent delocalization of pi-electrons or lone pairs through conjugated double bonds. +M groups donate electrons to conjugated ring (-OH, -NH2, -OCH3); -M groups withdraw electrons (-NO2, -CHO, -COOH).",
                        "Hyperconjugation (Baker-Nathan Effect): Delocalization of sigma electrons of C-H bond of an alkyl group attached directly to an unsaturated system or carbocation into adjacent empty p-orbital. Stability of carbocations and alkenes is proportional to the number of alpha-hydrogens: 3° > 2° > 1° > methyl."
                    ],
                    "keyTakeaways": [
                        "Resonance effect is generally stronger than inductive effect, EXCEPT for halogens on benzene rings (halogens are deactivating due to strong -I, but ortho/para-directing due to +M).",
                        "Carbocation stability: 3° > 2° > 1° > CH3+; Carbanion stability: CH3- > 1° > 2° > 3° (due to +I destabilization)."
                    ],
                    "examTips": ["Count alpha-hydrogens to immediately evaluate relative alkene heat of hydrogenation and carbocation stability: more alpha-H means higher stability!"]
                }
            ],
            "misconceptions": ["Believing resonance structures physically flip back and forth. Resonance structures are imaginary canonical forms; the true molecule is a stable hybrid."],
            "formulas": [
                {
                    "label": "Hyperconjugation Stability Rule",
                    "formula": "\\text{Stability} \\propto \\text{Number of } \\alpha\\text{-Hydrogens} \\quad (3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+)",
                    "description": "Direct relationship between alpha-C-H bonds and hyperconjugative carbocation/alkene stability.",
                    "variables": [
                        { "symbol": "\\alpha\\text{-H}", "meaning": "Alpha Hydrogen Count", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-11-09: Hydrocarbons
    "CHEM-11-09": [
        {
            "title": "Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution",
            "desc": "Conformations of ethane (Newman projections), Markovnikov and anti-Markovnikov addition to alkenes, ozonolysis, acidity of terminal alkynes, aromaticity (Hückel's 4n+2 rule), and electrophilic substitution mechanism.",
            "notesOverview": "Hydrocarbons are the foundational organic compounds. Alkenes undergo electrophilic addition, terminal alkynes exhibit acidic protons, and aromatic hydrocarbons undergo electrophilic aromatic substitution while preserving ring aromaticity.",
            "notesSections": [
                {
                    "heading": "Reaction Mechanisms of Unsaturated and Aromatic Systems",
                    "paragraphs": [
                        "Ethane Conformations: Staggered conformation is more stable than eclipsed by 12.5 kJ/mol due to minimal torsional strain.",
                        "Markovnikov’s Rule: In electrophilic addition of HX to asymmetrical alkenes, the halide adds to the more substituted carbon (forming the more stable carbocation intermediate).",
                        "Peroxide Effect (Kharasch Effect): In the presence of organic peroxides (R-O-O-R), HBr adds via a free-radical mechanism giving anti-Markovnikov product. Valid ONLY for HBr (not HCl or HI due to thermodynamics).",
                        "Ozonolysis: Cleaves C=C double bonds to form aldehydes and ketones, identifying the exact location of unsaturation.",
                        "Hückel’s Rule of Aromaticity: A planar, cyclic, completely conjugated system with (4n + 2) pi-electrons possesses special aromatic stability (e.g. benzene n=1, 6 pi e-).",
                        "Electrophilic Aromatic Substitution: Nitration (HNO3 + H2SO4 -> NO2+ electrophile), Halogenation (Cl2 + anhydrous AlCl3 -> Cl+), Friedel-Crafts Alkylation (RCl + AlCl3 -> R+), and Acylation (RCOCl + AlCl3 -> RCO+)."
                    ],
                    "keyTakeaways": [
                        "Terminal alkynes (like propyne) react with NaNH2 or ammoniacal AgNO3 due to acidic sp-hybridized C-H proton.",
                        "Kharasch anti-Markovnikov addition works ONLY with HBr because both propagation steps are exothermic only for HBr."
                    ],
                    "examTips": ["In ozonolysis problems, simply break the C=C double bond and cap both open ends with =O oxygen atoms to deduce reactant structures!"]
                }
            ],
            "misconceptions": ["Applying peroxide anti-Markovnikov effect to HCl or HI. Bond strength of HCl is too high, and iodine radicals dimerize to I2 rather than adding to alkenes."],
            "formulas": [
                {
                    "label": "Hückel’s Rule for Aromaticity",
                    "formula": "\\text{Total } \\pi\\text{-electrons} = 4n + 2 \\quad (n = 0, 1, 2, 3...)",
                    "description": "Criterion for aromatic stabilization in planar cyclic conjugated polyenes.",
                    "variables": [
                        { "symbol": "n", "meaning": "Non-negative Integer", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # ==========================================
    # CLASS 12 CHEMISTRY
    # ==========================================

    # CHEM-12-01: Solutions
    "CHEM-12-01": [
        {
            "title": "Raoult’s Law, Colligative Properties & Van ’t Hoff Factor",
            "desc": "Henry’s law p = K_H x, Raoult’s law p_A = p_A° x_A, ideal vs non-ideal solutions, elevation of boiling point Delta T_b = i K_b m, depression of freezing point Delta T_f = i K_f m, osmotic pressure Pi = i C R T, and abnormal molar mass.",
            "notesOverview": "Colligative properties depend solely on the number of solute particles in solution relative to solvent molecules, irrespective of chemical identity. Dissociation or association alters particle counts, quantified by the van 't Hoff factor i.",
            "notesSections": [
                {
                    "heading": "Raoult’s Law and Four Colligative Properties",
                    "paragraphs": [
                        "Henry’s Law: Partial pressure of gas in vapour phase is proportional to its mole fraction in solution: p = K_H * x.",
                        "Raoult’s Law: For a solution of volatile liquids, partial vapour pressure of each component is: p_A = p_A° * x_A. Total pressure P = p_A + p_B.",
                        "Ideal Solution: Obeys Raoult's law at all concentrations (Delta H_mix = 0, Delta V_mix = 0, e.g. n-hexane + n-heptane, benzene + toluene).",
                        "Non-Ideal Solutions: Positive deviation (A-B interactions weaker than A-A/B-B, Delta H > 0, e.g. ethanol + acetone, forms minimum boiling azeotrope); Negative deviation (A-B interactions stronger due to H-bonding, Delta H < 0, e.g. chloroform + acetone, forms maximum boiling azeotrope).",
                        "Colligative Properties: (1) Relative lowering of vapour pressure: (p° - p) / p° = i * x_solute; (2) Elevation of boiling point: Delta T_b = i * K_b * m; (3) Depression of freezing point: Delta T_f = i * K_f * m; (4) Osmotic pressure: Pi = i * C * R * T.",
                        "Van ’t Hoff Factor (i): i = (Observed colligative property) / (Calculated normal property) = Normal molar mass / Abnormal molar mass. For dissociation: i = 1 + (n - 1) alpha. For association (e.g. benzoic acid dimerization): i = 1 + (1/n - 1) alpha."
                    ],
                    "keyTakeaways": [
                        "Osmotic pressure measurement is preferred for determining molar masses of polymers and biomolecules because it is measurable at room temperature and uses molarity.",
                        "Isotonic solutions have identical osmotic pressures: Pi_1 = Pi_2."
                    ],
                    "examTips": ["For strong electrolytes like CaCl2, assume complete dissociation (alpha = 1) unless given otherwise: CaCl2 -> Ca2+ + 2 Cl-, so n = 3 and i = 3."]
                }
            ],
            "misconceptions": ["Assuming molar mass calculated from colligative properties is always normal. Electrolytes dissociate giving smaller molar masses, while carboxylic acids dimerize giving doubled molar masses."],
            "formulas": [
                {
                    "label": "Colligative Property Equations",
                    "formula": "\\frac{p_1^\\circ - p_1}{p_1^\\circ} = i \\, x_2, \\quad \\Delta T_b = i \\, K_b \\, m, \\quad \\Delta T_f = i \\, K_f \\, m, \\quad \\Pi = i \\, C R T",
                    "description": "Standard formulas for four colligative properties incorporating van 't Hoff factor.",
                    "variables": [
                        { "symbol": "K_b", "meaning": "Molal Boiling Elevation Constant (Ebullioscopic)", "unit": "K kg/mol" },
                        { "symbol": "K_f", "meaning": "Molal Freezing Depression Constant (Cryoscopic)", "unit": "K kg/mol" },
                        { "symbol": "\\Pi", "meaning": "Osmotic Pressure", "unit": "atm" },
                        { "symbol": "i", "meaning": "Van ’t Hoff Factor", "unit": "-" }
                    ]
                },
                {
                    "label": "Van ’t Hoff Dissociation & Association Degree",
                    "formula": "\\alpha_{\\text{diss}} = \\frac{i - 1}{n - 1}, \\quad \\alpha_{\\text{assoc}} = \\frac{1 - i}{1 - 1/n}",
                    "description": "Determines degree of ionization or dimerization from van 't Hoff factor.",
                    "variables": [
                        { "symbol": "\\alpha", "meaning": "Degree of Dissociation/Association", "unit": "-" },
                        { "symbol": "n", "meaning": "Number of Ions/Molecules per Unit", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-02: Electrochemistry
    "CHEM-12-02": [
        {
            "title": "Galvanic Cells, Nernst Equation & Kohlrausch’s Law",
            "desc": "Electrochemical cell, standard electrode potential E°, Nernst equation E_cell = E°_cell - (0.0591/n) log Q, Gibbs energy Delta G° = -n F E°, electrolytic conductance, molar conductivity Lambda_m, Kohlrausch law, and Faraday's laws of electrolysis.",
            "notesOverview": "Electrochemistry bridges chemical energy and electrical energy. Galvanic cells produce electricity via spontaneous redox reactions, while electrolytic cells drive non-spontaneous reactions via electrical current.",
            "notesSections": [
                {
                    "heading": "Electrochemical Potentials and Conductance Laws",
                    "paragraphs": [
                        "Galvanic Cell (Daniel Cell): Zn(s) | Zn2+(aq) || Cu2+(aq) | Cu(s). Oxidation occurs at anode (-ve terminal), reduction at cathode (+ve terminal). Cell potential E°_cell = E°_cathode - E°_anode.",
                        "Nernst Equation (at 298 K): E_cell = E°_cell - (0.0591 / n) log10(Q). At equilibrium (E_cell = 0, Q = K_c): log10 K_c = n E°_cell / 0.0591.",
                        "Free Energy and Cell EMF: Delta_r G° = -n F E°_cell. A cell reaction is spontaneous if E°_cell > 0 and Delta G° < 0.",
                        "Molar Conductivity (Lambda_m = 1000 kappa / M): Increases with dilution. For strong electrolytes, obeys Debye-Hückel-Onsager equation: Lambda_m = Lambda_m° - A sqrt(C).",
                        "Kohlrausch’s Law of Independent Migration of Ions: Limiting molar conductivity of an electrolyte is the sum of limiting molar conductivities of its constituent cations and anions: Lambda_m° = nu_+ lambda_+° + nu_- lambda_-°.",
                        "Faraday’s Laws of Electrolysis: (1) Mass deposited m = Z I t = (M / n F) I t; (2) When same charge passes through different electrolytes, masses deposited are proportional to equivalent weights: m1 / m2 = E1 / E2."
                    ],
                    "keyTakeaways": [
                        "Standard Hydrogen Electrode (SHE) is assigned an arbitrary potential of exactly 0.00 V at all temperatures.",
                        "Degree of dissociation of weak electrolyte: alpha = Lambda_m / Lambda_m°."
                    ],
                    "examTips": ["In lead-acid storage batteries, during discharging Pb(s) at anode and PbO2(s) at cathode both convert to PbSO4(s), consuming H2SO4 (electrolyte density drops)."]
                }
            ],
            "misconceptions": ["Assuming electrode potential E° is an extensive property. E° is an INTENSIVE property independent of stoichiometric coefficients (multiplying a half-cell by 2 does NOT change E°)."],
            "formulas": [
                {
                    "label": "Nernst Equation at 298 K",
                    "formula": "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q, \\quad \\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}",
                    "description": "Calculates non-standard electromotive force and standard free energy from cell potential.",
                    "variables": [
                        { "symbol": "E_{\\text{cell}}", "meaning": "Cell Electromotive Force", "unit": "V" },
                        { "symbol": "E^\\circ_{\\text{cell}}", "meaning": "Standard Cell Potential", "unit": "V" },
                        { "symbol": "n", "meaning": "Transferred Electrons", "unit": "-" },
                        { "symbol": "F", "meaning": "Faraday Constant", "unit": "96485 \\text{ C/mol}" }
                    ]
                },
                {
                    "label": "Kohlrausch’s Law & Faraday’s Electrolysis",
                    "formula": "\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ, \\quad m = \\frac{M \\, I \\, t}{n F}",
                    "description": "Limiting ion conductivity sum and electrodeposition mass formula.",
                    "variables": [
                        { "symbol": "\\Lambda_m^\\circ", "meaning": "Limiting Molar Conductivity", "unit": "S cm²/mol" },
                        { "symbol": "m", "meaning": "Mass Deposited", "unit": "g" },
                        { "symbol": "I", "meaning": "Current", "unit": "A" },
                        { "symbol": "t", "meaning": "Time Duration", "unit": "s" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-03: Chemical Kinetics
    "CHEM-12-03": [
        {
            "title": "Rate Laws, Reaction Order & Arrhenius Equation",
            "desc": "Rate of reaction, rate law Rate = k [A]^x [B]^y, order versus molecularity, integrated rate equations for zero-order and first-order reactions, half-life t_1/2, Arrhenius activation energy k = A e^(-Ea/RT).",
            "notesOverview": "Chemical kinetics investigates reaction rates, mechanisms, and temperature dependencies. The order of reaction is an experimental quantity, whereas molecularity is a theoretical count of reacting particles in an elementary step.",
            "notesSections": [
                {
                    "heading": "Integrated Kinetics and Arrhenius Activation Theory",
                    "paragraphs": [
                        "Rate Law: Rate = k [A]^x [B]^y, where overall order n = x + y. Units of rate constant k = (mol/L)^(1-n) s^-1.",
                        "Zero-Order Kinetics: Rate = k. Integrated equation: [A] = [A]0 - k t. Half-life: t_1/2 = [A]0 / (2 k).",
                        "First-Order Kinetics: Rate = k [A]. Integrated equation: k = (2.303 / t) log10([A]0 / [A]). Half-life is independent of initial concentration: t_1/2 = 0.693 / k.",
                        "Molecularity: Number of reacting species taking part in an elementary step. Always a positive integer (1, 2, or 3), never zero or fractional, unlike reaction order which can be zero, fractional, or negative.",
                        "Arrhenius Equation: k = A e^(-E_a / R T), where E_a is activation energy and A is frequency factor. Linear form: log10(k2 / k1) = (E_a / 2.303 R) * [(T2 - T1) / (T1 T2)].",
                        "Catalysts lower the activation energy barrier by providing an alternative pathway, increasing rate constant k exponentially without shifting equilibrium."
                    ],
                    "keyTakeaways": [
                        "First-order half-life is completely independent of reactant concentration: all radioactive decay processes follow first-order kinetics.",
                        "For pseudo-first-order reactions (e.g. acid hydrolysis of ethyl acetate, inversion of cane sugar), one reactant is present in large excess (water)."
                    ],
                    "examTips": ["To find overall reaction order, examine the units of rate constant k: s^-1 = 1st order; L/(mol s) = 2nd order; mol/(L s) = zero order."]
                }
            ],
            "misconceptions": ["Confusing reaction order with molecularity. Order is determined strictly experimentally; molecularity has meaning only for simple elementary steps."],
            "formulas": [
                {
                    "label": "Integrated Rate Equations (Zero & First Order)",
                    "formula": "k_{\\text{zero}} = \\frac{[A]_0 - [A]}{t} \\; (t_{1/2} = \\frac{[A]_0}{2k}), \\quad k_{\\text{first}} = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]}\\right) \\; (t_{1/2} = \\frac{0.693}{k})",
                    "description": "Concentration decay formulas and characteristic half-lives.",
                    "variables": [
                        { "symbol": "[A]_0", "meaning": "Initial Concentration", "unit": "mol/L" },
                        { "symbol": "[A]", "meaning": "Concentration at Time t", "unit": "mol/L" },
                        { "symbol": "k", "meaning": "Rate Constant", "unit": "s^{-1} \\text{ or mol/(L s)}" },
                        { "symbol": "t_{1/2}", "meaning": "Half-Life Period", "unit": "s" }
                    ]
                },
                {
                    "label": "Arrhenius Activation Energy Formula",
                    "formula": "\\log_{10}\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R} \\left( \\frac{T_2 - T_1}{T_1 T_2} \\right)",
                    "description": "Temperature sensitivity of reaction rate constant based on activation energy.",
                    "variables": [
                        { "symbol": "E_a", "meaning": "Activation Energy", "unit": "J/mol" },
                        { "symbol": "R", "meaning": "Gas Constant", "unit": "8.314 \\text{ J/(mol K)}" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-04: The d- and f-Block Elements
    "CHEM-12-04": [
        {
            "title": "Transition Elements, Lanthanoid Contraction & KMnO4/K2Cr2O7",
            "desc": "General properties of 3d series: variable oxidation states, catalytic behavior, coloured ions, magnetic moments mu = sqrt(n(n+2)) BM, lanthanoid contraction, and preparation/oxidizing properties of K2Cr2O7 and KMnO4.",
            "notesOverview": "Transition elements possess partially filled d-orbitals in atomic or common oxidation states. Lanthanoids feature 4f subshell filling where poor 4f shielding induces the profound lanthanoid contraction.",
            "notesSections": [
                {
                    "heading": "Physical and Chemical Characteristics of d- and f-Blocks",
                    "paragraphs": [
                        "Variable Oxidation States: Arise because (n-1)d and ns electrons differ very little in energy. Highest oxidation state in 3d series is +7 in Manganese (Mn: [Ar] 3d5 4s2).",
                        "Paramagnetism & Spin-Only Magnetic Moment: Unpaired electrons produce magnetic moments: mu = sqrt(n(n + 2)) Bohr Magnetons (BM), where n = number of unpaired electrons.",
                        "Catalytic Activity: Transition metals provide variable oxidation states and large surface areas for intermediate complex formation (e.g. V2O5 in Contact process, Fe in Haber process).",
                        "Lanthanoid Contraction: Steady decrease in atomic and ionic radii of lanthanoid elements (La to Lu) due to poor shielding by 4f electrons. Consequence: 4d and 5d series elements have nearly identical radii (Zr approx Hf, Nb approx Ta).",
                        "Potassium Dichromate (K2Cr2O7): Prepared from chromite ore (FeCr2O4). Powerful oxidizer in acidic medium: Cr2O7^(2-) + 14 H+ + 6 e- -> 2 Cr^(3+) + 7 H2O (E° = +1.33 V).",
                        "Potassium Permanganate (KMnO4): Prepared from pyrolusite ore (MnO2). In acidic medium: MnO4^- + 8 H+ + 5 e- -> Mn^(2+) + 4 H2O (E° = +1.51 V)."
                    ],
                    "keyTakeaways": [
                        "Zn, Cd, and Hg are NOT considered typical transition elements because they have completely filled d-subshells (d10) in both elementary and ionic states.",
                        "Interstitial compounds are formed when small atoms (H, C, N) are trapped inside metal crystal lattices: they are hard and retain metallic conductivity."
                    ],
                    "examTips": ["Chromate (CrO4^(2-), yellow) and dichromate (Cr2O7^(2-), orange) interconvert with pH: in acidic medium dichromate dominates; in basic medium chromate dominates!"]
                }
            ],
            "misconceptions": ["Believing Scandium is not a transition element. Sc has a partially filled 3d subshell in ground state (3d1 4s2), fulfilling the transition element definition."],
            "formulas": [
                {
                    "label": "Spin-Only Magnetic Moment",
                    "formula": "\\mu_s = \\sqrt{n(n + 2)} \\text{ BM} \\quad (1 \\text{ BM} = \\frac{e h}{4\\pi m})",
                    "description": "Calculates magnetic moment from count of unpaired electrons n.",
                    "variables": [
                        { "symbol": "n", "meaning": "Unpaired Electrons Count", "unit": "-" },
                        { "symbol": "\\mu_s", "meaning": "Magnetic Moment", "unit": "BM" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-05: Coordination Compounds
    "CHEM-12-05": [
        {
            "title": "Coordination Nomenclature, Crystal Field Theory & Isomerism",
            "desc": "Werner’s theory, IUPAC nomenclature of complexes, structural and stereoisomerism, Valence Bond Theory, and Crystal Field Theory (CFT) octahedral/tetrahedral d-orbital splitting Delta_o.",
            "notesOverview": "Coordination compounds contain central transition metal ions bonded to coordinate covalent ligands. Crystal Field Theory explains splitting of degenerate d-orbitals by electrostatic ligand fields, dictating color and magnetic properties.",
            "notesSections": [
                {
                    "heading": "Crystal Field Theory (CFT) and Complex Stability",
                    "paragraphs": [
                        "Werner’s Postulates: Central metal exhibits primary valency (ionizable, corresponds to oxidation state) and secondary valency (non-ionizable, corresponds to coordination number).",
                        "IUPAC Rules: Name ligands in alphabetical order before central metal. Cation named first. For anionic complexes, metal ends in '-ate' (e.g. ferrate, cuprate).",
                        "Crystal Field Splitting in Octahedral Complexes (Delta_o): Five degenerate d-orbitals split into lower t2g (dxy, dyz, dxz, -0.4 Delta_o) and higher eg (dx2-y2, dz2, +0.6 Delta_o).",
                        "High-Spin vs Low-Spin: Strong field ligands (CN-, CO, en) produce large Delta_o > P (pairing energy), forcing pairing (low-spin). Weak field ligands (I-, Cl-, F-) have Delta_o < P, resulting in maximum unpaired electrons (high-spin).",
                        "Tetrahedral Splitting (Delta_t): Inverse splitting pattern (e lower, t2 higher) with Delta_t = (4/9) Delta_o. Almost always high-spin because Delta_t is small."
                    ],
                    "keyTakeaways": [
                        "Spectrochemical Series: I- < Br- < SCN- < Cl- < F- < OH- < C2O4^(2-) < H2O < NCS- < EDTA4- < NH3 < en < CN- < CO.",
                        "Colour in coordination complexes arises from d-d electronic transitions: absorbed complementary wavelength determines observed color."
                    ],
                    "examTips": ["[Ni(CO)4] is tetrahedral and diamagnetic (sp3), while [Ni(CN)4]^(2-) is square planar and diamagnetic (dsp2). Know these two benchmark JEE/NEET cases!"]
                }
            ],
            "misconceptions": ["Assuming [Ti(H2O)6]3+ is colorless. It is purple because single 3d electron undergoes d-d transition from t2g to eg by absorbing green-yellow light."],
            "formulas": [
                {
                    "label": "Crystal Field Stabilization Energy (CFSE)",
                    "formula": "\\text{CFSE}_{\\text{oct}} = [-0.4 \\, n_{t_{2g}} + 0.6 \\, n_{e_g}] \\Delta_o + m P",
                    "description": "Calculates thermodynamic stabilization of d-electron configurations in octahedral fields.",
                    "variables": [
                        { "symbol": "\\Delta_o", "meaning": "Octahedral Crystal Field Splitting", "unit": "cm^{-1}" },
                        { "symbol": "P", "meaning": "Electron Pairing Energy", "unit": "cm^{-1}" },
                        { "symbol": "n_{t_{2g}}, n_{e_g}", "meaning": "Electrons in t2g and eg", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-06: Haloalkanes and Haloarenes
    "CHEM-12-06": [
        {
            "title": "SN1 & SN2 Mechanisms & Haloarene Reactivity",
            "desc": "Nucleophilic substitution mechanisms: SN2 (bimolecular, concerted, Walden inversion) vs SN1 (unimolecular, carbocation intermediate, racemization), and low reactivity of chlorobenzene toward nucleophilic substitution.",
            "notesOverview": "Alkyl halides undergo nucleophilic substitution and elimination reactions. The mechanism is controlled by substrate steric hindrance, nucleophile strength, solvent polarity, and leaving group stability.",
            "notesSections": [
                {
                    "heading": "SN1 vs SN2 Reaction Coordinates",
                    "paragraphs": [
                        "SN2 Mechanism: Single-step concerted process. Attack of nucleophile occurs from the back-side of leaving group. Order of reactivity: Methyl > 1° > 2° > 3° (governed strictly by steric hindrance). Leads to 100% Walden inversion of configuration.",
                        "SN1 Mechanism: Two-step process via a planar carbocation intermediate. Order of reactivity: 3° > 2° > 1° > Methyl (governed by carbocation stability). Polar protic solvents stabilize carbocations and accelerate SN1. Leads to partial racemization.",
                        "Elimination (E2/E1): Alkyl halides with beta-hydrogens react with alcoholic KOH to yield alkenes, following Saytzeff's Rule (the more substituted, more stable alkene is the major product).",
                        "Low Reactivity of Haloarenes: Chlorobenzene is extremely unreactive toward nucleophilic substitution due to: (1) Resonance giving partial double-bond character to C-Cl bond; (2) sp2 hybridized carbon holding electrons tighter; (3) Instability of phenyl cation; (4) Electrostatic repulsion of approaching nucleophiles by pi-electron cloud."
                    ],
                    "keyTakeaways": [
                        "Electron-withdrawing groups (-NO2) at ortho and para positions dramatically increase haloarene reactivity toward nucleophilic substitution by stabilizing the carbanion Meisenheimer complex.",
                        "Ambident nucleophiles (e.g. CN- and NO2-) have two nucleophilic centers: KCN gives alkyl cyanides R-CN, while AgCN gives alkyl isocyanides R-NC."
                    ],
                    "examTips": ["Allylic and benzylic halides show exceptionally high reactivity in BOTH SN1 (resonance-stabilized carbocations) and SN2 reactions!"]
                }
            ],
            "misconceptions": ["Assuming haloarenes cannot undergo nucleophilic substitution. Under harsh conditions (Dow's process: NaOH, 623 K, 300 atm) or with ortho/para -NO2 groups, substitution occurs readily."],
            "formulas": [
                {
                    "label": "SN1 vs SN2 Rate Laws",
                    "formula": "\\text{Rate}_{SN2} = k [\\text{R-X}] [\\text{Nu}^-], \\quad \\text{Rate}_{SN1} = k [\\text{R-X}]",
                    "description": "Bimolecular second-order versus unimolecular first-order substitution rate kinetics.",
                    "variables": [
                        { "symbol": "[\\text{R-X}]", "meaning": "Substrate Concentration", "unit": "mol/L" },
                        { "symbol": "[\\text{Nu}^-]", "meaning": "Nucleophile Concentration", "unit": "mol/L" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-07: Alcohols, Phenols and Ethers
    "CHEM-12-07": [
        {
            "title": "Alcohols, Phenols & Williamson Ether Synthesis",
            "desc": "Preparation of alcohols, Lucas test (distinguishing 1°, 2°, 3° alcohols), acidity of phenols (resonance stabilization of phenoxide), Reimer-Tiemann and Kolbe reactions, and Williamson ether synthesis mechanism.",
            "notesOverview": "Alcohols and phenols feature hydroxyl (-OH) groups. Phenols are substantially more acidic than alcohols due to resonance stabilization of the phenoxide ion. Ethers are synthesized primarily via Williamson's SN2 substitution.",
            "notesSections": [
                {
                    "heading": "Phenol Acidity, Classic Name Reactions, and Ethers",
                    "paragraphs": [
                        "Lucas Test: Reagent = anhydrous ZnCl2 + concentrated HCl. 3° alcohols produce immediate turbidity (cloudiness); 2° alcohols produce turbidity in 5 minutes; 1° alcohols produce no turbidity at room temperature.",
                        "Acidity: Phenol is a million times more acidic than ethanol because the phenoxide ion is stabilized by delocalization of negative charge over the aromatic ring. Electron-withdrawing groups (-NO2) increase acidity (picric acid is strongly acidic).",
                        "Kolbe’s Reaction: Phenol + NaOH -> Sodium phenoxide + CO2 (at 400 K, 4-7 atm) -> Salicylic acid (2-hydroxybenzoic acid).",
                        "Reimer-Tiemann Reaction: Phenol + CHCl3 + aq NaOH -> Salicylaldehyde (electrophile is dichlorocarbene :CCl2).",
                        "Williamson Ether Synthesis: Alkyl halide + sodium alkoxide -> Ether via SN2 mechanism: R-X + R'-O^- Na^+ -> R-O-R' + NaX. For unsymmetrical ethers, the alkyl halide MUST be primary (1°) to prevent competing E2 alkene elimination."
                    ],
                    "keyTakeaways": [
                        "Cleavage of ethers with excess HI: With mixed ethers containing 3° alkyl group, reaction follows SN1 and halide attaches to 3° carbon (forming 3° iodide and alcohol). With 1° or 2° alkyl groups, reaction follows SN2 and halide attaches to smaller alkyl group.",
                        "Phenol reacts with bromine water to give white precipitate of 2,4,6-tribromophenol."
                    ],
                    "examTips": ["Hydroboration-oxidation of alkenes (B2H6 followed by H2O2/OH-) yields anti-Markovnikov alcohol without any carbocation rearrangement!"]
                }
            ],
            "misconceptions": ["Using 3° alkyl halide with sodium methoxide to synthesize tert-butyl methyl ether. 3° halide undergoes 100% elimination giving isobutylene alkene; use sodium tert-butoxide + CH3I instead."],
            "formulas": [
                {
                    "label": "Williamson SN2 Synthesis",
                    "formula": "R-\\text{CH}_2-\\text{X} + R'-\\text{O}^- \\text{Na}^+ \\longrightarrow R-\\text{CH}_2-\\text{O}-R' + \\text{NaX}",
                    "description": "Bimolecular substitution between primary alkyl halide and alkoxide ion.",
                    "variables": [
                        { "symbol": "R-\\text{CH}_2-\\text{X}", "meaning": "Primary Alkyl Halide", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-08: Aldehydes, Ketones and Carboxylic Acids
    "CHEM-12-08": [
        {
            "title": "Carbonyl Nucleophilic Addition, Aldol Condensation & Cannizzaro",
            "desc": "Structure of carbonyl group, nucleophilic addition of HCN, NaHSO3, Grignard reagents, Aldol and cross-Aldol condensation, Cannizzaro reaction, Tollens' and Fehling's tests, and acidity of carboxylic acids.",
            "notesOverview": "The polarized carbonyl group (C=O) undergoes nucleophilic addition. Alpha-hydrogens in aldehydes and ketones are acidic due to resonance stabilization of the resulting enolate ion, driving Aldol condensations.",
            "notesSections": [
                {
                    "heading": "Mechanisms of Carbonyl Transformations",
                    "paragraphs": [
                        "Nucleophilic Addition: Nucleophile attacks electrophilic carbonyl carbon. Reactivity order: Formaldehyde > other aldehydes > ketones (steric hindrance and +I alkyl electron donation reduce electrophilicity).",
                        "Tollens’ Test (Silver Mirror): Ammoniacal silver nitrate [Ag(NH3)2]+ oxidizes all aldehydes to carboxylate ions, reducing Ag+ to metallic silver mirror. Ketones do not react.",
                        "Fehling’s Test: Alkaline solution of CuSO4 + sodium potassium tartrate oxidizes aliphatic aldehydes to give red cuprous oxide (Cu2O) precipitate. Aromatic aldehydes do not reduce Fehling’s solution.",
                        "Aldol Condensation: Aldehydes or ketones possessing at least one alpha-hydrogen react in presence of dilute alkali (NaOH) to form beta-hydroxy aldehydes (aldols), which upon heating lose water to yield alpha,beta-unsaturated carbonyls.",
                        "Cannizzaro Reaction: Aldehydes lacking alpha-hydrogens (HCHO, C6H5CHO) undergo disproportionation (self-redox) in concentrated alkali (50% NaOH) to yield one molecule of alcohol and one molecule of carboxylic acid salt.",
                        "Carboxylic Acids: Carboxylate ion exhibits equivalent resonance structures with negative charge equally shared between two electronegative oxygens, making carboxylic acids much stronger acids than phenols."
                    ],
                    "keyTakeaways": [
                        "Haloform Reaction: Carbonyls possessing a methyl ketone group (CH3-C=O) or CH3-CH(OH)- react with I2 + NaOH to give yellow precipitate of iodoform (CHI3).",
                        "Wolff-Kishner reduction (NH2NH2 / KOH, glycol, heat) and Clemmensen reduction (Zn-Hg / conc. HCl) both convert C=O directly into CH2 methylene group."
                    ],
                    "examTips": ["Hell-Volhard-Zelinsky (HVZ) reaction: Carboxylic acids with alpha-hydrogen react with X2 / red P to selectively substitute alpha-hydrogen with halogen."]
                }
            ],
            "misconceptions": ["Believing benzaldehyde undergoes Aldol condensation. Benzaldehyde lacks alpha-hydrogens, so with base alone it undergoes Cannizzaro; with an aldehyde having alpha-H it undergoes cross-Aldol."],
            "formulas": [
                {
                    "label": "Aldol Dehydration Product",
                    "formula": "2 \\, R-\\text{CH}_2-\\text{CHO} \\xrightarrow{\\text{dil. NaOH}} R-\\text{CH}_2-\\text{CH(OH)}-\\text{CH}(R)-\\text{CHO} \\xrightarrow{\\Delta} R-\\text{CH}_2-\\text{CH}=\\text{C}(R)-\\text{CHO} + \\text{H}_2\\text{O}",
                    "description": "Base-catalyzed dimerization and dehydration forming alpha,beta-unsaturated aldehyde.",
                    "variables": [
                        { "symbol": "R", "meaning": "Alkyl Substituent", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-09: Amines
    "CHEM-12-09": [
        {
            "title": "Basicity of Amines, Hoffmann Degradation & Diazonium Salts",
            "desc": "Classification (1°, 2°, 3°), Gabriel phthalimide synthesis, Hoffmann bromamide degradation, basicity trends in gas phase vs aqueous solution, Carbylamine test, Hinsberg test, and synthetic versatility of arenediazonium salts.",
            "notesOverview": "Amines are basic organic derivatives of ammonia. Basicity in aqueous solution is an interplay between inductive effect, steric hindrance, and hydration of the substituted ammonium cation. Diazonium salts are vital synthetic intermediates.",
            "notesSections": [
                {
                    "heading": "Basicity Trends and Benchmark Reagents",
                    "paragraphs": [
                        "Basicity in Gas Phase: Increases strictly with electron-donating alkyl groups: 3° > 2° > 1° > NH3.",
                        "Basicity in Aqueous Medium: Interplay of +I effect, steric hindrance, and hydration: For methyl-substituted amines: (CH3)2NH (2°) > CH3NH2 (1°) > (CH3)3N (3°) > NH3. For ethyl-substituted amines: (C2H5)2NH (2°) > (C2H5)3N (3°) > C2H5NH2 (1°) > NH3.",
                        "Hoffmann Bromamide Degradation: Primary amides react with Br2 + 4 NaOH to give primary amines with ONE LESS carbon atom: R-CONH2 + Br2 + 4 NaOH -> R-NH2 + Na2CO3 + 2 NaBr + 2 H2O.",
                        "Gabriel Phthalimide Synthesis: Synthesizes pure 1° aliphatic amines without 2° or 3° amine contamination. Aromatic amines cannot be prepared this way because aryl halides cannot undergo SN2 with phthalimide anion.",
                        "Carbylamine Reaction: 1° amines heated with CHCl3 + 3 KOH produce foul-smelling isocyanides (carbylamines): R-NH2 + CHCl3 + 3 KOH -> R-NC + 3 KCl + 3 H2O (diagnostic test for 1° amines).",
                        "Diazonium Salts (Ar-N2+ Cl-): Prepared by diazotization of aniline with NaNO2 + HCl at 0-5 °C. Stable only at low temperature. Undergoes Sandmeyer reaction (CuCl/HCl -> Ar-Cl), Gattermann reaction, and azo dye coupling with phenol (orange dye) and aniline (yellow dye)."
                    ],
                    "keyTakeaways": [
                        "Aniline is much weaker base than ammonia because the lone pair on nitrogen is delocalized over the aromatic ring through resonance.",
                        "Hinsberg Reagent (benzenesulphonyl chloride): 1° amine gives precipitate soluble in alkali; 2° amine gives precipitate insoluble in alkali; 3° amine does not react."
                    ],
                    "examTips": ["Hoffmann degradation is the most important reaction for 'stepping down' an organic carbon chain (reducing carbon count by 1)!"]
                }
            ],
            "misconceptions": ["Believing tertiary amines are the most basic in water. In water, tertiary amines are weakly hydrated due to steric crowding, making secondary amines the most basic."],
            "formulas": [
                {
                    "label": "Hoffmann Bromamide Chain Reduction",
                    "formula": "R-\\text{CONH}_2 + \\text{Br}_2 + 4\\text{NaOH} \\longrightarrow R-\\text{NH}_2 + \\text{Na}_2\\text{CO}_3 + 2\\text{NaBr} + 2\\text{H}_2\\text{O}",
                    "description": "Decarbonylative conversion of amide into primary amine with loss of one carbon.",
                    "variables": [
                        { "symbol": "R-\\text{CONH}_2", "meaning": "Aliphatic/Aromatic Amide", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    # CHEM-12-10: Biomolecules
    "CHEM-12-10": [
        {
            "title": "Carbohydrates, Proteins, Nucleic Acids & Enzyme Kinetics",
            "desc": "Monosaccharides (D-glucose open and cyclic Haworth structures, mutarotation), glycosidic linkage, amino acids (zwitterion, isoelectric point), peptide bond, protein structural hierarchy, DNA double helix (Watson-Crick), and RNA.",
            "notesOverview": "Biomolecules are organic molecules sustaining life processes. Carbohydrates store chemical energy, proteins provide enzymatic catalysis and structural scaffolds, and nucleic acids encode genetic inheritance.",
            "notesSections": [
                {
                    "heading": "Biomolecular Architecture and Biochemical Linkages",
                    "paragraphs": [
                        "Glucose Structure: Aldohexose with formula C6H12O6. D-configuration designates OH at C-5 on the right in Fischer projection. Exists predominantly as cyclic six-membered pyranose ring (alpha-D-glucopyranose and beta-D-glucopyranose differ only at C-1 anomeric carbon).",
                        "Glycosidic Linkage: C-O-C ether linkage formed by condensation between two monosaccharides. Sucrose is non-reducing (glycosidic bond between C1 of alpha-glucose and C2 of beta-fructose involves both reducing groups); Maltose and Lactose are reducing sugars.",
                        "Amino Acids: Substituted methanes with -NH2, -COOH, -H, and variable -R group. In neutral solution, exist as dipolar Zwitterions: H3N+-CH(R)-COO^-. At isoelectric point (pI), net electric charge is zero and no migration occurs in electric field.",
                        "Proteins: Polypeptides of alpha-amino acids linked by peptide bonds (-CO-NH-). Primary (amino acid sequence), Secondary (alpha-helix and beta-pleated sheets stabilized by intramolecular H-bonds), Tertiary (3D globular folding via disulfide bridges, ionic and van der Waals bonds), Quaternary (multi-subunit assembly).",
                        "Denaturation: Physical changes (heat, pH) disrupt secondary and tertiary structures without breaking primary peptide bonds, causing loss of biological activity.",
                        "Nucleic Acids: Polymers of nucleotides. Each nucleotide consists of pentose sugar + nitrogenous base + phosphate group. DNA double helix features antiparallel strands held by specific hydrogen bonds: Adenine = Thymine (2 H-bonds), Guanine = Cytosine (3 H-bonds)."
                    ],
                    "keyTakeaways": [
                        "All naturally occurring amino acids (except glycine) are chiral and possess L-stereochemical configuration.",
                        "DNA contains Thymine and deoxyribose; RNA contains Uracil and ribose sugar."
                    ],
                    "examTips": ["Sucrose on hydrolysis undergoes 'inversion of cane sugar': dextrorotatory sucrose (+66.5°) converts to a laevorotatory mixture of D-glucose (+52.5°) and D-fructose (-92.4°) because fructose laevorotation dominates!"]
                }
            ],
            "misconceptions": ["Thinking protein denaturation breaks covalent peptide bonds. Denaturation unfolds secondary and tertiary conformations, but the primary covalent sequence remains completely intact."],
            "formulas": [
                {
                    "label": "Isoelectric Point of Amino Acids",
                    "formula": "\\text{pI} = \\frac{pK_{a1} + pK_{a2}}{2}",
                    "description": "pH at which amino acid exists purely in dipolar zwitterionic form with zero net charge.",
                    "variables": [
                        { "symbol": "\\text{pI}", "meaning": "Isoelectric Point", "unit": "-" },
                        { "symbol": "pK_{a1}, pK_{a2}", "meaning": "Ionization Constants of Carboxylic and Amino Groups", "unit": "-" }
                    ]
                }
            ]
        }
    ]
}
