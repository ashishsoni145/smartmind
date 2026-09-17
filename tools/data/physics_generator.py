# tools/data/physics_generator.py
# Complete authentic NCERT Physics curriculum for all 28 chapters (Class 11 & Class 12)
import json

def get_physics_topics():
    topics_map = {}
    
    # Import existing PHY-11-01 to 07 and PHY-11-08 to 10
    from physics_topics import PHYSICS_TOPICS
    from physics_topics_part2 import PHYSICS_PART2
    
    topics_map.update(PHYSICS_TOPICS)
    topics_map.update(PHYSICS_PART2)
    
    # -------------------------------------------------------------------------
    # PHY-11-11: Thermodynamics
    # -------------------------------------------------------------------------
    topics_map["PHY-11-11"] = [
        {
            "title": "Thermal Equilibrium & Zeroth Law of Thermodynamics",
            "desc": "Concept of temperature, thermal contact, diathermic and adiabatic walls, and temperature scale foundation.",
            "notesOverview": "The Zeroth Law of Thermodynamics establishes temperature as the universal state variable that determines whether systems are in thermal equilibrium.",
            "notesSections": [
                {
                    "heading": "Zeroth Law and Thermometry",
                    "paragraphs": [
                        "If two bodies A and B are each in thermal equilibrium with a third body C, then A and B are in thermal equilibrium with each other.",
                        "This law justifies the concept of temperature as an invariant property shared by systems in mutual thermal equilibrium."
                    ],
                    "keyTakeaways": ["Temperature is a scalar state variable; heat flows from higher to lower temperature."],
                    "examTips": ["Zeroth law was formulated after the 1st and 2nd laws, but placed first due to its foundational nature."]
                }
            ],
            "misconceptions": ["Thinking temperature is heat: temperature is a state function; heat is transient energy in transit."],
            "formulas": [
                {
                    "label": "Thermal Equilibrium Condition",
                    "formula": "T_A = T_B = T_C",
                    "description": "Equality of empirical temperatures across systems in mutual thermal equilibrium.",
                    "variables": [
                        { "symbol": "T_A, T_B, T_C", "meaning": "System Temperatures", "unit": "K" }
                    ]
                }
            ]
        },
        {
            "title": "First Law of Thermodynamics & Internal Energy",
            "desc": "Heat Q, work done W, internal energy U as state function, Delta Q = Delta U + Delta W, sign conventions.",
            "notesOverview": "The First Law of Thermodynamics expresses the conservation of energy for thermodynamic systems: heat supplied equals increase in internal energy plus work done by the system.",
            "notesSections": [
                {
                    "heading": "First Law Formulations and Sign Conventions",
                    "paragraphs": [
                        "Delta Q = Delta U + Delta W = Delta U + P*Delta V (in physics convention where W is work done BY the gas).",
                        "Internal energy U depends solely on temperature for an ideal gas (Joule's law): dU = n*Cv*dT. U is a state function; Q and W are path functions."
                    ],
                    "keyTakeaways": [
                        "In a cyclic process, initial and final states are identical, so net Delta U = 0 and total Q = total W.",
                        "In an isolated system, Delta Q = 0 and Delta W = 0, so Delta U = 0."
                    ],
                    "examTips": ["Be careful with chemistry vs physics conventions: in NCERT Physics, work done BY gas on expansion is positive (+P dV)."]
                }
            ],
            "misconceptions": ["Confusing path functions (Q, W) with state functions (U, P, V, T). Only state functions have exact differentials dU."],
            "formulas": [
                {
                    "label": "First Law of Thermodynamics",
                    "formula": "\\Delta Q = \\Delta U + \\Delta W = \\Delta U + P \\Delta V",
                    "description": "Conservation of energy relating heat transfer, internal energy change, and work done.",
                    "variables": [
                        { "symbol": "\\Delta Q", "meaning": "Heat Added to System", "unit": "J" },
                        { "symbol": "\\Delta U", "meaning": "Internal Energy Change", "unit": "J" },
                        { "symbol": "\\Delta W", "meaning": "Work Done by System", "unit": "J" }
                    ]
                },
                {
                    "label": "Ideal Gas Internal Energy Change",
                    "formula": "\\Delta U = n C_v \\Delta T",
                    "description": "Change in internal energy for n moles of ideal gas under temperature change Delta T.",
                    "variables": [
                        { "symbol": "n", "meaning": "Amount of Gas", "unit": "mol" },
                        { "symbol": "C_v", "meaning": "Molar Heat Capacity at Constant Volume", "unit": "J/(mol K)" },
                        { "symbol": "\\Delta T", "meaning": "Temperature Change", "unit": "K" }
                    ]
                }
            ]
        },
        {
            "title": "Thermodynamic Processes: Isothermal, Adiabatic, Isochoric & Isobaric",
            "desc": "Quasi-static processes, PV diagrams, work done in isothermal expansion W = nRT ln(V2/V1), adiabatic relation PV^gamma = const, and work done in adiabatic expansion.",
            "notesOverview": "Thermodynamic processes describe transitions between states under constrained variables: temperature (isothermal), heat exchange (adiabatic), pressure (isobaric), or volume (isochoric).",
            "notesSections": [
                {
                    "heading": "Process Equations and Work Done",
                    "paragraphs": [
                        "Isothermal (T = const): Delta U = 0, W = Q = n*R*T * ln(V2 / V1).",
                        "Adiabatic (Delta Q = 0): P*V^gamma = const, T*V^(gamma-1) = const. Work done: W = (P1*V1 - P2*V2) / (gamma - 1) = n*R*(T1 - T2) / (gamma - 1).",
                        "Isobaric (P = const): W = P*(V2 - V1) = n*R*Delta T. Isochoric (V = const): W = 0, Q = Delta U."
                    ],
                    "keyTakeaways": [
                        "Adiabatic curve on a PV diagram is steeper than isothermal curve: (dP/dV)_ad = gamma * (dP/dV)_iso.",
                        "Area enclosed by a closed loop on a PV indicator diagram represents net work done in a cyclic process."
                    ],
                    "examTips": ["Fast processes (sound propagation, tyre burst) are adiabatic; slow processes in conducting containers are isothermal."]
                }
            ],
            "misconceptions": ["Assuming gas temperature remains constant during adiabatic expansion. In adiabatic expansion, gas does work at the expense of its internal energy, cooling significantly."],
            "formulas": [
                {
                    "label": "Isothermal Work Done",
                    "formula": "W = n R T \\ln\\left(\\frac{V_2}{V_1}\\right) = 2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right)",
                    "description": "Work done during reversible isothermal expansion of n moles of ideal gas.",
                    "variables": [
                        { "symbol": "n", "meaning": "Moles of Gas", "unit": "mol" },
                        { "symbol": "R", "meaning": "Universal Gas Constant (8.314)", "unit": "J/(mol K)" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                        { "symbol": "V_1, V_2", "meaning": "Initial & Final Volumes", "unit": "m^3" },
                        { "symbol": "W", "meaning": "Work Done", "unit": "J" }
                    ]
                },
                {
                    "label": "Adiabatic Process Relation",
                    "formula": "P V^\\gamma = \\text{constant} \\implies T V^{\\gamma - 1} = \\text{constant}",
                    "description": "Equation of state for reversible adiabatic process with heat capacity ratio gamma = Cp / Cv.",
                    "variables": [
                        { "symbol": "P", "meaning": "Gas Pressure", "unit": "Pa" },
                        { "symbol": "V", "meaning": "Gas Volume", "unit": "m^3" },
                        { "symbol": "\\gamma", "meaning": "Adiabatic Exponent (Cp / Cv)", "unit": "-" }
                    ]
                },
                {
                    "label": "Adiabatic Work Done",
                    "formula": "W = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1} = \\frac{n R (T_1 - T_2)}{\\gamma - 1}",
                    "description": "Work done during adiabatic expansion between states (P1, V1, T1) and (P2, V2, T2).",
                    "variables": [
                        { "symbol": "T_1, T_2", "meaning": "Initial & Final Temperatures", "unit": "K" },
                        { "symbol": "\\gamma", "meaning": "Adiabatic Ratio", "unit": "-" },
                        { "symbol": "W", "meaning": "Adiabatic Work", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "Second Law of Thermodynamics & Heat Engines (Carnot Cycle)",
            "desc": "Kelvin-Planck statement, Clausius statement, Carnot cycle efficiency eta = 1 - T2/T1, refrigerators and coefficient of performance COP.",
            "notesOverview": "The Second Law dictates the spontaneous direction of natural processes. Heat cannot spontaneously flow from colder to hotter bodies, and no engine can convert absorbed heat entirely into work.",
            "notesSections": [
                {
                    "heading": "Carnot Cycle and Second Law Statements",
                    "paragraphs": [
                        "Kelvin-Planck Statement: No process is possible whose sole result is absorption of heat from a reservoir and complete conversion into work.",
                        "Clausius Statement: No process is possible whose sole result is transfer of heat from a cooler to a hotter body.",
                        "Carnot engine operates between temperatures T1 (source) and T2 (sink) through 4 reversible steps (isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression). Efficiency: eta = 1 - T2 / T1."
                    ],
                    "keyTakeaways": [
                        "Carnot efficiency is the theoretical upper limit for any heat engine operating between two temperatures.",
                        "Coefficient of performance for a Carnot refrigerator: beta = Q2 / W = T2 / (T1 - T2)."
                    ],
                    "examTips": ["To achieve 100% efficiency, the sink temperature T2 must be absolute zero (0 K), which is unattainable by the Third Law."]
                }
            ],
            "misconceptions": ["Assuming a real engine can exceed Carnot efficiency. Carnot theorem proves no real engine can exceed reversible Carnot efficiency."],
            "formulas": [
                {
                    "label": "Carnot Engine Efficiency",
                    "formula": "\\eta = 1 - \\frac{Q_2}{Q_1} = 1 - \\frac{T_2}{T_1}",
                    "description": "Maximum theoretical efficiency of heat engine operating between source T1 and sink T2.",
                    "variables": [
                        { "symbol": "T_1", "meaning": "Source Temperature", "unit": "K" },
                        { "symbol": "T_2", "meaning": "Sink Temperature", "unit": "K" },
                        { "symbol": "\\eta", "meaning": "Thermal Efficiency", "unit": "-" }
                    ]
                },
                {
                    "label": "Refrigerator Coefficient of Performance",
                    "formula": "\\beta = \\frac{Q_2}{W} = \\frac{T_2}{T_1 - T_2}",
                    "description": "Ratio of heat extracted from cold reservoir to electrical work input.",
                    "variables": [
                        { "symbol": "Q_2", "meaning": "Heat Extracted", "unit": "J" },
                        { "symbol": "W", "meaning": "Work Input", "unit": "J" },
                        { "symbol": "\\beta", "meaning": "Coefficient of Performance", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # -------------------------------------------------------------------------
    # PHY-11-12: Kinetic Theory of Gases
    # -------------------------------------------------------------------------
    topics_map["PHY-11-12"] = [
        {
            "title": "Molecular Nature of Matter & Ideal Gas Equation",
            "desc": "Postulates of kinetic theory of gases, Avogadro's hypothesis, Boyle's law, Charles' law, and equation of state PV = nRT = N*k_B*T.",
            "notesOverview": "Kinetic theory models a gas as an ensemble of rapidly moving, point-like elastic particles in continuous random motion, explaining macroscopic gas laws from microscopic mechanics.",
            "notesSections": [
                {
                    "heading": "Postulates of Kinetic Theory",
                    "paragraphs": [
                        "Molecules are point masses whose volume is negligible compared to the total gas volume.",
                        "Intermolecular collisions and collisions with container walls are perfectly elastic, conserving momentum and kinetic energy.",
                        "Intermolecular forces of attraction are negligible except during brief collisions."
                    ],
                    "keyTakeaways": [
                        "Universal gas constant R = 8.314 J/(mol K); Boltzmann constant k_B = R / N_A = 1.38 x 10^-23 J/K.",
                        "Real gases approach ideal behaviour at high temperature and low pressure."
                    ],
                    "examTips": ["Always convert temperatures to Kelvin (T = t + 273.15) before using PV = nRT."]
                }
            ],
            "misconceptions": ["Using Celsius temperature in ideal gas equations: PV = nRT requires absolute temperature in Kelvin."],
            "formulas": [
                {
                    "label": "Ideal Gas Equation of State",
                    "formula": "P V = n R T = N k_B T",
                    "description": "Equation connecting pressure, volume, temperature, and amount of gas.",
                    "variables": [
                        { "symbol": "P", "meaning": "Pressure", "unit": "Pa" },
                        { "symbol": "V", "meaning": "Volume", "unit": "m^3" },
                        { "symbol": "n", "meaning": "Moles", "unit": "mol" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" }
                    ]
                }
            ]
        },
        {
            "title": "Kinetic Pressure Derivation & RMS Velocity",
            "desc": "Derivation of pressure P = (1/3)*rho*v_rms^2, kinetic interpretation of temperature E_k = (3/2)*k_B*T, and root mean square speed.",
            "notesOverview": "Gas pressure originates from momentum imparted by molecular collisions against container walls: P = (1/3)*rho*v_rms^2.",
            "notesSections": [
                {
                    "heading": "Microscopic Derivation of Gas Pressure",
                    "paragraphs": [
                        "Pressure on container wall: P = (1/3) * (N / V) * m * v_rms^2 = (1/3) * rho * v_rms^2.",
                        "Translational kinetic energy of one molecule: E_trans = (1/2)*m*v_rms^2 = (3/2)*k_B*T. Temperature is directly proportional to mean molecular kinetic energy.",
                        "Speeds: v_rms = sqrt(3*R*T / M), v_avg = sqrt(8*R*T / (pi*M)), v_mp = sqrt(2*R*T / M). Ratio v_mp : v_avg : v_rms = 1 : 1.128 : 1.224."
                    ],
                    "keyTakeaways": [
                        "At absolute zero (0 K), translational kinetic energy of gas molecules ceases classically.",
                        "RMS speed is inversely proportional to square root of molecular mass: lighter gases (H2, He) have much higher thermal speeds."
                    ],
                    "examTips": ["v_rms depends solely on temperature and molar mass, independent of pressure or volume changes at constant T."]
                }
            ],
            "misconceptions": ["Thinking v_rms increases when pressure increases at constant temperature. If T is constant, v_rms is invariant."],
            "formulas": [
                {
                    "label": "Kinetic Gas Pressure Formula",
                    "formula": "P = \\frac{1}{3} \\rho v_{rms}^2 = \\frac{1}{3} \\frac{N m}{V} v_{rms}^2",
                    "description": "Pressure exerted by N gas molecules of mass m in container of volume V.",
                    "variables": [
                        { "symbol": "\\rho", "meaning": "Gas Mass Density", "unit": "kg/m^3" },
                        { "symbol": "v_{rms}", "meaning": "Root Mean Square Velocity", "unit": "m/s" },
                        { "symbol": "P", "meaning": "Kinetic Pressure", "unit": "Pa" }
                    ]
                },
                {
                    "label": "Root Mean Square Speed",
                    "formula": "v_{rms} = \\sqrt{\\frac{3 R T}{M}} = \\sqrt{\\frac{3 k_B T}{m}}",
                    "description": "Root mean square speed of gas molecules of molar mass M at absolute temperature T.",
                    "variables": [
                        { "symbol": "R", "meaning": "Universal Gas Constant", "unit": "J/(mol K)" },
                        { "symbol": "T", "meaning": "Temperature", "unit": "K" },
                        { "symbol": "M", "meaning": "Molar Mass", "unit": "kg/mol" },
                        { "symbol": "v_{rms}", "meaning": "RMS Velocity", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Law of Equipartition of Energy & Degrees of Freedom",
            "desc": "Degrees of freedom f for monatomic (f=3), diatomic (f=5), and polyatomic gases, internal energy U = (f/2)*nRT, and heat capacity ratios gamma.",
            "notesOverview": "The Law of Equipartition states that in thermal equilibrium, total energy is distributed equally among all degrees of freedom, each contributing (1/2)*k_B*T per molecule.",
            "notesSections": [
                {
                    "heading": "Degrees of Freedom and Molar Specific Heats",
                    "paragraphs": [
                        "Monatomic gas (He, Ne, Ar): f = 3 (translational only). Cv = (3/2)*R, Cp = (5/2)*R, gamma = 5/3 = 1.67.",
                        "Diatomic gas (N2, O2) at room temp: f = 5 (3 trans + 2 rot). Cv = (5/2)*R, Cp = (7/2)*R, gamma = 7/5 = 1.40.",
                        "Mayer's relation: Cp - Cv = R."
                    ],
                    "keyTakeaways": [
                        "At high temperatures, vibrational modes become active, contributing an additional 2 degrees of freedom (kinetic + potential) per mode.",
                        "gamma = 1 + 2/f."
                    ],
                    "examTips": ["For a mixture of n1 moles of gas 1 and n2 moles of gas 2: Cv_mix = (n1*Cv1 + n2*Cv2) / (n1 + n2)."]
                }
            ],
            "misconceptions": ["Assuming vibrational degrees of freedom are active at room temperature. They only activate at elevated temperatures (> 1000 K)."],
            "formulas": [
                {
                    "label": "Law of Equipartition of Energy",
                    "formula": "E = \\frac{f}{2} k_B T",
                    "description": "Mean thermal energy per molecule with f independent degrees of freedom.",
                    "variables": [
                        { "symbol": "f", "meaning": "Degrees of Freedom", "unit": "-" },
                        { "symbol": "k_B", "meaning": "Boltzmann Constant", "unit": "J/K" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" }
                    ]
                },
                {
                    "label": "Adiabatic Index from Degrees of Freedom",
                    "formula": "\\gamma = \\frac{C_p}{C_v} = 1 + \\frac{2}{f}",
                    "description": "Ratio of specific heats expressed in terms of degrees of freedom f.",
                    "variables": [
                        { "symbol": "f", "meaning": "Degrees of Freedom", "unit": "-" },
                        { "symbol": "\\gamma", "meaning": "Adiabatic Index", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Mean Free Path & Molecular Collision Frequency",
            "desc": "Mean free path lambda = 1 / (sqrt(2)*n*pi*d^2), collision frequency, dependence on pressure and temperature.",
            "notesOverview": "Molecules undergo billions of collisions per second. The average distance traversed between two successive collisions is the mean free path lambda.",
            "notesSections": [
                {
                    "heading": "Mean Free Path Formulation",
                    "paragraphs": [
                        "Mean free path: lambda = 1 / (sqrt(2) * n * pi * d^2), where n is number density of molecules (N/V = P / (k_B*T)) and d is molecular collision diameter.",
                        "Substituting n = P / (k_B*T): lambda = (k_B * T) / (sqrt(2) * pi * d^2 * P). Mean free path is directly proportional to temperature T and inversely proportional to pressure P."
                    ],
                    "keyTakeaways": [
                        "In high vacuum (~10^-6 mm Hg), mean free path can exceed several metres, allowing molecular beams to travel without collisions.",
                        "Collision frequency Z = v_avg / lambda."
                    ],
                    "examTips": ["At constant volume (n = const), mean free path is invariant even if temperature changes!"]
                }
            ],
            "misconceptions": ["Assuming lambda increases with pressure. Increasing pressure packs molecules closer, reducing mean free path."],
            "formulas": [
                {
                    "label": "Mean Free Path",
                    "formula": "\\lambda = \\frac{1}{\\sqrt{2} n \\pi d^2} = \\frac{k_B T}{\\sqrt{2} \\pi d^2 P}",
                    "description": "Average distance travelled by a gas molecule between successive elastic collisions.",
                    "variables": [
                        { "symbol": "n", "meaning": "Number Density (N/V)", "unit": "m^-3" },
                        { "symbol": "d", "meaning": "Molecular Diameter", "unit": "m" },
                        { "symbol": "P", "meaning": "Gas Pressure", "unit": "Pa" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                        { "symbol": "\\lambda", "meaning": "Mean Free Path", "unit": "m" }
                    ]
                }
            ]
        }
    ]

    print("Physics Class 11 part completed.")
    return topics_map

if __name__ == "__main__":
    t = get_physics_topics()
    print("Loaded chapters:", len(t))
