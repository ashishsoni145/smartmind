# tools/data/physics_part3.py
# Physics Class 12 Chapters 6 to 14 (PHY-12-06 through PHY-12-14)

PHYSICS_PART3 = {
    "PHY-12-06": [
        {
            "title": "Magnetic Flux & Faraday’s Laws of Induction",
            "desc": "Magnetic flux Phi = B . A, Faraday's experiments, induced EMF e = -dPhi/dt, rate of change of magnetic flux.",
            "notesOverview": "Electromagnetic induction is the phenomenon of generating an electric current and electromotive force across a conductor when the magnetic flux linked with it changes with time.",
            "notesSections": [
                {
                    "heading": "Faraday’s Law of Induction",
                    "paragraphs": [
                        "Magnetic flux: Phi = B . A = B*A*cos theta (unit: Weber, 1 Wb = 1 T m^2).",
                        "Faraday’s Law: The magnitude of induced EMF in a circuit equals the time rate of change of magnetic flux through the circuit: e = -dPhi / dt.",
                        "For a coil of N turns: e = -N * (dPhi / dt). Flux can be varied by changing B, changing area A, or changing orientation theta."
                    ],
                    "keyTakeaways": [
                        "Induced current exists ONLY while the magnetic flux is actively changing.",
                        "If a coil is moved in a uniform magnetic field with constant flux, induced EMF is zero."
                    ],
                    "examTips": ["Total induced charge Delta q = Delta Phi / R is independent of the rate at which flux changes!"]
                }
            ],
            "misconceptions": ["Thinking induced charge depends on how fast the magnet is moved. Induced EMF depends on speed (dPhi/dt), but total induced CHARGE depends solely on net flux change Delta Phi."],
            "formulas": [
                {
                    "label": "Faraday’s Law of Induced EMF",
                    "formula": "e = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d}{dt}(B A \\cos\\theta)",
                    "description": "Induced electromotive force produced by time-varying magnetic flux.",
                    "variables": [
                        { "symbol": "N", "meaning": "Number of Turns", "unit": "-" },
                        { "symbol": "\\Phi_B", "meaning": "Magnetic Flux", "unit": "Wb" },
                        { "symbol": "t", "meaning": "Time", "unit": "s" },
                        { "symbol": "e", "meaning": "Induced EMF", "unit": "V" }
                    ]
                }
            ]
        },
        {
            "title": "Lenz’s Law & Conservation of Energy",
            "desc": "Lenz’s law direction rule, negative sign in Faraday's law, mechanical work converted to electrical energy, eddy currents.",
            "notesOverview": "Lenz’s law states that the polarity of induced EMF is always such that it tends to produce a current which opposes the very change in magnetic flux that causes it.",
            "notesSections": [
                {
                    "heading": "Lenz’s Law and Energy Conservation",
                    "paragraphs": [
                        "Pushing a North pole toward a coil induces an anti-clockwise current that acts as a North pole, repelling the approaching magnet.",
                        "The mechanical work done against this magnetic repulsion is converted into electrical energy, fulfilling the Law of Conservation of Energy.",
                        "Eddy currents: Circulating induction currents set up in bulk conductors, used in electromagnetic braking and induction furnaces, minimized by laminating iron cores."
                    ],
                    "keyTakeaways": [
                        "Lenz’s law is a consequence of conservation of energy.",
                        "Lamination of transformer cores using varnish prevents large circulating eddy current loops, reducing I^2*R heating losses."
                    ],
                    "examTips": ["Right-Hand Rule for Lenz's law: Thumb opposes the change in external flux; curled fingers indicate induced current flow."]
                }
            ],
            "misconceptions": ["Believing Lenz's law violates energy conservation. Lenz's law is the exact physical manifestation of energy conservation in electromagnetic systems."],
            "formulas": [
                {
                    "label": "Induced Current and Charge",
                    "formula": "I = \\frac{|e|}{R} = \\frac{N}{R} \\frac{d\\Phi_B}{dt}, \\quad \\Delta q = \\frac{N \\Delta\\Phi_B}{R}",
                    "description": "Induced current and total charge transferred in closed circuit of resistance R.",
                    "variables": [
                        { "symbol": "R", "meaning": "Circuit Resistance", "unit": "\\Omega" },
                        { "symbol": "\\Delta\\Phi_B", "meaning": "Net Magnetic Flux Change", "unit": "Wb" },
                        { "symbol": "\\Delta q", "meaning": "Total Induced Charge", "unit": "C" }
                    ]
                }
            ]
        },
        {
            "title": "Motional EMF, Inductance & AC Generator",
            "desc": "Motional EMF e = B*l*v, self-inductance L, mutual inductance M, magnetic energy U = 0.5*L*I^2, and AC alternator working.",
            "notesOverview": "A conducting rod of length l moving with velocity v perpendicular to magnetic field B generates a motional EMF: e = B*l*v. Inductance represents electrical inertia opposing current changes.",
            "notesSections": [
                {
                    "heading": "Inductance and AC Generation",
                    "paragraphs": [
                        "Self-induced back EMF: e = -L * (dI / dt), where L is self-inductance (Henry, H). For solenoid: L = mu_0 * n^2 * A * l.",
                        "Magnetic energy stored in inductor: U = (1/2) * L * I^2.",
                        "AC Generator: Rotating a coil of N turns and area A at angular speed omega in magnetic field B generates sinusoidal EMF: e(t) = e0 * sin(omega*t), with peak EMF e0 = N*B*A*omega."
                    ],
                    "keyTakeaways": [
                        "Mutual inductance between two coaxial solenoids: M = mu_0 * n1 * n2 * pi * r1^2 * l.",
                        "Inductors oppose changes in current, acting as electrical mass."
                    ],
                    "examTips": ["Peak EMF in an AC generator is e0 = N*B*A*omega. Peak power is P_max = e0^2 / R."]
                }
            ],
            "misconceptions": ["Assuming self-inductance L depends on current I. L is a purely geometric constant depending on turns, dimensions, and core permeability."],
            "formulas": [
                {
                    "label": "Motional EMF",
                    "formula": "e = B l v \\sin\\theta",
                    "description": "EMF induced across ends of conductor of length l sweeping at velocity v across magnetic field B.",
                    "variables": [
                        { "symbol": "B", "meaning": "Magnetic Field", "unit": "T" },
                        { "symbol": "l", "meaning": "Conductor Length", "unit": "m" },
                        { "symbol": "v", "meaning": "Velocity", "unit": "m/s" },
                        { "symbol": "e", "meaning": "Motional EMF", "unit": "V" }
                    ]
                },
                {
                    "label": "AC Generator Peak EMF",
                    "formula": "e(t) = N B A \\omega \\sin(\\omega t) = e_0 \\sin(\\omega t)",
                    "description": "Sinusoidal alternating voltage generated by rotating armature coil in uniform magnetic field.",
                    "variables": [
                        { "symbol": "N", "meaning": "Number of Turns", "unit": "-" },
                        { "symbol": "A", "meaning": "Coil Area", "unit": "m^2" },
                        { "symbol": "\\omega", "meaning": "Angular Speed", "unit": "rad/s" },
                        { "symbol": "e_0", "meaning": "Peak Output Voltage", "unit": "V" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-07": [
        {
            "title": "AC Voltage in Pure Resistor, Inductor & Capacitor",
            "desc": "Peak and RMS values V_rms = V0/sqrt(2), inductive reactance X_L = omega*L (current lags by pi/2), capacitive reactance X_C = 1/(omega*C) (current leads by pi/2).",
            "notesOverview": "Alternating current reverses direction periodically. In a resistor, V and I are in phase. In an inductor, current lags voltage by 90 degrees. In a capacitor, current leads voltage by 90 degrees.",
            "notesSections": [
                {
                    "heading": "Reactance and Phasor Phase Relationships",
                    "paragraphs": [
                        "RMS values: I_rms = I0 / sqrt(2) approx 0.707 * I0; V_rms = V0 / sqrt(2) approx 0.707 * V0.",
                        "Inductive reactance: X_L = omega * L = 2*pi*f * L (ohms). X_L increases linearly with frequency; blocks high frequency AC while passing DC.",
                        "Capacitive reactance: X_C = 1 / (omega * C) = 1 / (2*pi*f * C) (ohms). X_C approaches infinity for DC (f = 0); blocks DC while passing AC."
                    ],
                    "keyTakeaways": [
                        "Capacitor blocks DC completely (X_C -> infinity).",
                        "Average power consumed by pure inductor or pure capacitor over a full AC cycle is strictly ZERO."
                    ],
                    "examTips": ["Mains household supply of 220V AC is the RMS value. The peak voltage is V0 = 220 * sqrt(2) approx 311 V!"]
                }
            ],
            "misconceptions": ["Believing 220V AC and 220V DC have identical shock hazard. 220V AC peaks at 311V, making it substantially more dangerous than 220V DC."],
            "formulas": [
                {
                    "label": "RMS Current and Voltage",
                    "formula": "I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}} \\approx 0.707 I_0, \\quad V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}} \\approx 0.707 V_0",
                    "description": "Root mean square effective value of sinusoidal alternating waveform.",
                    "variables": [
                        { "symbol": "I_0", "meaning": "Peak Current", "unit": "A" },
                        { "symbol": "I_{\\text{rms}}", "meaning": "Root Mean Square Current", "unit": "A" }
                    ]
                },
                {
                    "label": "Inductive and Capacitive Reactance",
                    "formula": "X_L = \\omega L = 2\\pi f L, \\quad X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C}",
                    "description": "Oppositions offered by pure inductance and pure capacitance to alternating current.",
                    "variables": [
                        { "symbol": "L", "meaning": "Inductance", "unit": "H" },
                        { "symbol": "C", "meaning": "Capacitance", "unit": "F" },
                        { "symbol": "f", "meaning": "AC Frequency", "unit": "Hz" },
                        { "symbol": "X_L, X_C", "meaning": "Reactances", "unit": "\\Omega" }
                    ]
                }
            ]
        },
        {
            "title": "Series LCR Circuit, Impedance & Electrical Resonance",
            "desc": "Impedance Z = sqrt(R^2 + (X_L - X_C)^2), phase angle tan phi = (X_L - X_C)/R, resonant frequency omega_0 = 1/sqrt(LC), Quality factor Q.",
            "notesOverview": "A series LCR circuit combines resistance, inductive reactance, and capacitive reactance. At resonance, inductive and capacitive reactances cancel, minimizing impedance to Z = R.",
            "notesSections": [
                {
                    "heading": "Resonance and Sharpness (Q-Factor)",
                    "paragraphs": [
                        "Total impedance: Z = sqrt(R^2 + (omega*L - 1/(omega*C))^2).",
                        "Resonance occurs when X_L = X_C -> omega_0 = 1 / sqrt(L*C) or f_0 = 1 / (2*pi * sqrt(L*C)). At resonance, impedance is minimum (Z = R) and current is maximum: I_0 = V0 / R.",
                        "Quality factor Q = (omega_0 * L) / R = (1 / R) * sqrt(L / C). Higher Q implies sharper resonance tuning in radio receiver circuits."
                    ],
                    "keyTakeaways": [
                        "At resonance, power factor cos phi = 1 (purely resistive behaviour).",
                        "Voltages across L and C cancel each other out at resonance: V_L + V_C = 0."
                    ],
                    "examTips": ["Radio tuning dials adjust a variable capacitor C to match the series LCR resonant frequency f0 to the incoming station frequency."]
                }
            ],
            "misconceptions": ["Assuming voltage across inductor or capacitor cannot exceed source voltage. In high-Q resonant circuits, V_L and V_C can be many times larger than input source voltage (Q-multiplication)."],
            "formulas": [
                {
                    "label": "Series LCR Impedance",
                    "formula": "Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{R^2 + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^2}",
                    "description": "Total opposition to alternating current in series LCR circuit.",
                    "variables": [
                        { "symbol": "R", "meaning": "Resistance", "unit": "\\Omega" },
                        { "symbol": "X_L", "meaning": "Inductive Reactance", "unit": "\\Omega" },
                        { "symbol": "X_C", "meaning": "Capacitive Reactance", "unit": "\\Omega" },
                        { "symbol": "Z", "meaning": "Total Circuit Impedance", "unit": "\\Omega" }
                    ]
                },
                {
                    "label": "Resonant Frequency",
                    "formula": "f_0 = \\frac{1}{2\\pi \\sqrt{L C}}, \\quad \\omega_0 = \\frac{1}{\\sqrt{L C}}",
                    "description": "Natural electrical resonance frequency where inductive and capacitive reactances cancel.",
                    "variables": [
                        { "symbol": "L", "meaning": "Circuit Inductance", "unit": "H" },
                        { "symbol": "C", "meaning": "Circuit Capacitance", "unit": "F" },
                        { "symbol": "f_0", "meaning": "Resonant Frequency", "unit": "Hz" }
                    ]
                }
            ]
        },
        {
            "title": "Power in AC Circuits, Wattless Current & Transformers",
            "desc": "Real power P_avg = V_rms*I_rms*cos phi, power factor, wattless current, transformer principle, turns ratio, step-up/step-down efficiency.",
            "notesOverview": "Real power dissipated in an AC circuit depends on the power factor cos phi. Transformers transfer AC electrical energy between voltage levels using mutual induction.",
            "notesSections": [
                {
                    "heading": "Power Factor and Transformer Relations",
                    "paragraphs": [
                        "Average power: P_avg = V_rms * I_rms * cos phi, where cos phi = R / Z is the power factor.",
                        "When circuit is purely reactive (phi = 90 deg, cos phi = 0), average power consumed is ZERO: current is called wattless current.",
                        "Transformer: Es / Ep = Ns / Np = Ip / Is = k (turns ratio). In step-up (k > 1), voltage increases while current decreases proportionally to conserve energy."
                    ],
                    "keyTakeaways": [
                        "Transformers operate ONLY with alternating current (AC), never with steady DC.",
                        "Core losses include: Joule heating (I^2*R in copper), Eddy current loss, Hysteresis loss, and Flux leakage."
                    ],
                    "examTips": ["To minimize transmission power loss over long distances, electricity is stepped up to very high voltages (lowering current and I^2*R losses)."]
                }
            ],
            "misconceptions": ["Connecting a transformer to a DC battery: since DC produces constant flux (dPhi/dt = 0), induced secondary voltage is zero, and primary coil may burn out."],
            "formulas": [
                {
                    "label": "AC True Average Power",
                    "formula": "P_{\\text{avg}} = V_{\\text{rms}} I_{\\text{rms}} \\cos\\phi",
                    "description": "Actual real power consumed in AC circuit with power factor cos phi = R / Z.",
                    "variables": [
                        { "symbol": "V_{\\text{rms}}", "meaning": "RMS Voltage", "unit": "V" },
                        { "symbol": "I_{\\text{rms}}", "meaning": "RMS Current", "unit": "A" },
                        { "symbol": "\\cos\\phi", "meaning": "Power Factor (R/Z)", "unit": "-" },
                        { "symbol": "P_{\\text{avg}}", "meaning": "True Power Consumed", "unit": "W" }
                    ]
                },
                {
                    "label": "Transformer Transformation Ratio",
                    "formula": "\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s} = k",
                    "description": "Ideal transformer voltage, turns, and current scaling ratio.",
                    "variables": [
                        { "symbol": "N_p, N_s", "meaning": "Primary & Secondary Turns", "unit": "-" },
                        { "symbol": "V_p, V_s", "meaning": "Primary & Secondary Voltages", "unit": "V" },
                        { "symbol": "I_p, I_s", "meaning": "Primary & Secondary Currents", "unit": "A" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-08": [
        {
            "title": "Displacement Current & Maxwell’s Equations",
            "desc": "Inconsistency of Ampere’s law during capacitor charging, displacement current I_d = epsilon_0*(dPhi_E/dt), Maxwell-Ampere law.",
            "notesOverview": "James Clerk Maxwell resolved the mathematical inconsistency in Ampere's circuital law by introducing displacement current, proving that changing electric fields create magnetic fields.",
            "notesSections": [
                {
                    "heading": "Maxwell's Four Master Equations",
                    "paragraphs": [
                        "Between capacitor plates, conduction current I_c = 0, but changing electric flux dPhi_E/dt generates displacement current: I_d = epsilon_0 * (dPhi_E / dt).",
                        "Maxwell-Ampere Law: oint(B . dl) = mu_0 * (I_c + I_d) = mu_0 * I_c + mu_0 * epsilon_0 * (dPhi_E / dt).",
                        "The four Maxwell equations unite all electricity, magnetism, and optics into a single unified framework."
                    ],
                    "keyTakeaways": [
                        "Conduction current in wires equals displacement current between capacitor plates: I_c = I_d.",
                        "A changing electric field produces a magnetic field, and a changing magnetic field produces an electric field."
                    ],
                    "examTips": ["Displacement current produces the same magnetic field as an equal conduction current."]
                }
            ],
            "misconceptions": ["Believing displacement current involves physical flow of electrons. It arises entirely from the time variation of electric flux."],
            "formulas": [
                {
                    "label": "Maxwell-Ampere Law",
                    "formula": "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_c + \\mu_0 \\varepsilon_0 \\frac{d\\Phi_E}{dt}",
                    "description": "Circulation of magnetic field driven by conduction current and time-varying electric flux.",
                    "variables": [
                        { "symbol": "I_c", "meaning": "Conduction Current", "unit": "A" },
                        { "symbol": "\\Phi_E", "meaning": "Electric Flux", "unit": "V m" },
                        { "symbol": "\\varepsilon_0", "meaning": "Permittivity of Free Space", "unit": "C^2/(N m^2)" },
                        { "symbol": "\\mu_0", "meaning": "Permeability of Free Space", "unit": "T m/A" }
                    ]
                }
            ]
        },
        {
            "title": "Electromagnetic Waves & The Electromagnetic Spectrum",
            "desc": "Transverse nature of EM waves, speed of light c = 1/sqrt(mu0*epsilon0), energy density, and electromagnetic spectrum bands.",
            "notesOverview": "Electromagnetic waves are self-sustaining oscillating transverse electric and magnetic fields propagating through space at speed c = 3.00 x 10^8 m/s.",
            "notesSections": [
                {
                    "heading": "Wave Properties and Spectrum Hierarchy",
                    "paragraphs": [
                        "Electric vector E and magnetic vector B oscillate in phase, mutually perpendicular to each other and perpendicular to the direction of propagation (E x B = c_hat).",
                        "Speed of light in vacuum: c = 1 / sqrt(mu_0 * epsilon_0) = E0 / B0 approx 3 x 10^8 m/s.",
                        "Spectrum in order of increasing frequency (decreasing wavelength): Radio waves -> Microwaves -> Infrared -> Visible (400-700 nm) -> Ultraviolet -> X-rays -> Gamma rays."
                    ],
                    "keyTakeaways": [
                        "Average energy density: u = (1/2)*epsilon_0*E^2 + B^2 / (2*mu_0). Electric and magnetic fields contribute equal energy densities.",
                        "Electromagnetic waves carry momentum: p = U / c. When absorbed, they exert radiation pressure."
                    ],
                    "examTips": ["Microwaves resonate with water molecular rotation (used in microwave ovens and radar). Gamma rays have the highest energy and penetrating power."]
                }
            ],
            "misconceptions": ["Thinking electric fields carry more energy than magnetic fields in an EM wave. Both fields carry EQUAL average energy densities: u_E = u_B."],
            "formulas": [
                {
                    "label": "Speed of Light from Fundamental Constants",
                    "formula": "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0} \\approx 3.00 \\times 10^8 \\text{ m/s}",
                    "description": "Speed of electromagnetic waves in vacuum determined by electric and magnetic constants.",
                    "variables": [
                        { "symbol": "\\mu_0", "meaning": "Magnetic Permeability", "unit": "T m/A" },
                        { "symbol": "\\varepsilon_0", "meaning": "Electric Permittivity", "unit": "C^2/(N m^2)" },
                        { "symbol": "E_0", "meaning": "Peak Electric Field", "unit": "V/m" },
                        { "symbol": "B_0", "meaning": "Peak Magnetic Field", "unit": "T" },
                        { "symbol": "c", "meaning": "Speed of Light", "unit": "m/s" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-09": [
        {
            "title": "Reflection at Spherical Mirrors & Mirror Formula",
            "desc": "Concave and convex mirrors, Cartesian sign convention, focal length f = R/2, mirror formula 1/v + 1/u = 1/f, linear magnification m = -v/u.",
            "notesOverview": "Geometrical optics treats light propagation as rectilinear rays. Curved spherical mirrors reflect light to form real or virtual images according to the mirror equation.",
            "notesSections": [
                {
                    "heading": "Mirror Formula and Sign Conventions",
                    "paragraphs": [
                        "New Cartesian Sign Convention: All distances measured from the pole P along the incident ray are positive; against incident ray are negative.",
                        "Mirror formula: 1/v + 1/u = 1/f = 2/R.",
                        "Linear magnification: m = h_i / h_o = -v / u. Negative m indicates real inverted image; positive m indicates virtual erect image."
                    ],
                    "keyTakeaways": [
                        "Concave mirror: f < 0 (can form both real and virtual images).",
                        "Convex mirror: f > 0 (always forms virtual, erect, diminished images; used as vehicle rear-view mirrors)."
                    ],
                    "examTips": ["Always substitute u, v, f with their proper Cartesian signs when computing numerical values."]
                }
            ],
            "misconceptions": ["Forgetting the negative sign in mirror magnification: m = -v/u for mirrors, whereas m = +v/u for lenses."],
            "formulas": [
                {
                    "label": "Mirror Formula",
                    "formula": "\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}",
                    "description": "Relation between object distance u, image distance v, and focal length f of spherical mirror.",
                    "variables": [
                        { "symbol": "u", "meaning": "Object Distance", "unit": "m" },
                        { "symbol": "v", "meaning": "Image Distance", "unit": "m" },
                        { "symbol": "f", "meaning": "Focal Length (R/2)", "unit": "m" }
                    ]
                },
                {
                    "label": "Mirror Linear Magnification",
                    "formula": "m = \\frac{h_i}{h_o} = -\\frac{v}{u} = \\frac{f}{f - u}",
                    "description": "Ratio of image height to object height for spherical mirror.",
                    "variables": [
                        { "symbol": "h_i, h_o", "meaning": "Image & Object Heights", "unit": "m" },
                        { "symbol": "u, v", "meaning": "Distances", "unit": "m" },
                        { "symbol": "m", "meaning": "Linear Magnification", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Refraction of Light, Total Internal Reflection & Optical Fibres",
            "desc": "Snell’s law n1*sin(i) = n2*sin(r), critical angle sin(i_c) = 1/n, total internal reflection, mirage, optical fibres and endoscopy.",
            "notesOverview": "When light passes obliquely between optical media of differing refractive indices, its speed and wavelength change, bending the ray according to Snell’s Law.",
            "notesSections": [
                {
                    "heading": "Total Internal Reflection (TIR)",
                    "paragraphs": [
                        "Snell's Law: n1 * sin i = n2 * sin r. When travelling from denser to rarer medium (n1 > n2), ray bends away from normal.",
                        "Critical angle i_c is the angle of incidence in denser medium for which refraction angle r = 90 degrees: sin i_c = n2 / n1 = 1 / n.",
                        "Total Internal Reflection occurs when: 1. Light travels from optically denser to rarer medium; 2. Angle of incidence exceeds critical angle (i > i_c).",
                        "Optical fibres use TIR along high-refractive index glass cores (n_core > n_cladding) to transmit data signals with virtually zero loss."
                    ],
                    "keyTakeaways": [
                        "Diamond sparkles brilliantly because its critical angle is exceptionally small (~24.4 deg, n = 2.42), trapping light via multiple TIRs.",
                        "Apparent depth of a liquid pool: h_apparent = h_real / n."
                    ],
                    "examTips": ["In TIR, 100% of light energy is reflected with ZERO absorption loss, far superior to silvered mirrors."]
                }
            ],
            "misconceptions": ["Believing light frequency changes during refraction. Frequency depends solely on the source and remains CONSTANT; only speed and wavelength change."],
            "formulas": [
                {
                    "label": "Snell’s Law of Refraction",
                    "formula": "n_1 \\sin i = n_2 \\sin r \\implies \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1} = \\frac{v_1}{v_2} = \\frac{\\lambda_1}{\\lambda_2}",
                    "description": "Fundamental law of optical refraction across planar interfaces.",
                    "variables": [
                        { "symbol": "i", "meaning": "Angle of Incidence", "unit": "rad" },
                        { "symbol": "r", "meaning": "Angle of Refraction", "unit": "rad" },
                        { "symbol": "n_1, n_2", "meaning": "Refractive Indices", "unit": "-" }
                    ]
                },
                {
                    "label": "Critical Angle for Total Internal Reflection",
                    "formula": "\\sin i_c = \\frac{1}{n}",
                    "description": "Threshold incidence angle in optically denser medium relative to air/vacuum.",
                    "variables": [
                        { "symbol": "n", "meaning": "Refractive Index of Denser Medium", "unit": "-" },
                        { "symbol": "i_c", "meaning": "Critical Angle", "unit": "rad" }
                    ]
                }
            ]
        },
        {
            "title": "Refraction at Spherical Surfaces & Lens Maker’s Formula",
            "desc": "Single spherical surface n2/v - n1/u = (n2-n1)/R, Lens Maker’s equation 1/f = (n-1)(1/R1 - 1/R2), thin lens formula 1/v - 1/u = 1/f, lens combinations.",
            "notesOverview": "Thin lenses form images through two successive refractive spherical surfaces. The Lens Maker's Formula relates focal length directly to surface radii of curvature and material refractive index.",
            "notesSections": [
                {
                    "heading": "Lens Maker's Formula and Power",
                    "paragraphs": [
                        "Lens Maker’s Formula: 1/f = (n - 1) * (1/R1 - 1/R2). For equiconvex lens (R1 = +R, R2 = -R): 1/f = 2*(n-1)/R.",
                        "Thin lens equation: 1/v - 1/u = 1/f. Linear magnification: m = v / u.",
                        "Optical power of lens: P = 1 / f(in metres) (Dioptres, D).",
                        "For two thin lenses in contact: P_eq = P1 + P2 -> 1/f_eq = 1/f1 + 1/f2."
                    ],
                    "keyTakeaways": [
                        "Submerging a glass lens (n = 1.5) in water (n = 1.33) increases its focal length by roughly 4 times: f_water approx 4 * f_air.",
                        "If a lens is submerged in a liquid of greater refractive index (n_liq > n_lens), its nature inverts: convex behaves as concave!"
                    ],
                    "examTips": ["Cutting an equiconvex lens vertically in two halves doubles the focal length of each half (f_half = 2*f), while power halves."]
                }
            ],
            "misconceptions": ["Assuming focal length is an invariant property of the lens. Focal length depends on the refractive index of the surrounding medium!"],
            "formulas": [
                {
                    "label": "Lens Maker’s Formula",
                    "formula": "\\frac{1}{f} = \\left(\\frac{n_2}{n_1} - 1\\right) \\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
                    "description": "Focal length of thin lens of index n2 immersed in medium of index n1 with radii R1 and R2.",
                    "variables": [
                        { "symbol": "n_2", "meaning": "Lens Material Index", "unit": "-" },
                        { "symbol": "n_1", "meaning": "Surrounding Medium Index", "unit": "-" },
                        { "symbol": "R_1, R_2", "meaning": "Surface Curvature Radii", "unit": "m" },
                        { "symbol": "f", "meaning": "Focal Length", "unit": "m" }
                    ]
                },
                {
                    "label": "Thin Lens Equation",
                    "formula": "\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}",
                    "description": "Relation between object distance u, image distance v, and focal length f of thin lens.",
                    "variables": [
                        { "symbol": "u", "meaning": "Object Distance", "unit": "m" },
                        { "symbol": "v", "meaning": "Image Distance", "unit": "m" },
                        { "symbol": "f", "meaning": "Focal Length", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Refraction Through a Prism & Optical Instruments",
            "desc": "Prism formula n = sin((A+Dm)/2)/sin(A/2), compound microscope magnification m = (L/f0)*(D/fe), and astronomical telescope m = f0/fe.",
            "notesOverview": "A triangular prism deviates and disperses polychromatic light. Compound microscopes provide high magnification for minute near objects; astronomical telescopes magnify distant celestial objects.",
            "notesSections": [
                {
                    "heading": "Prism and Microscope Magnification",
                    "paragraphs": [
                        "At angle of minimum deviation D_m: angle of incidence equals angle of emergence (i = e), and refracted ray travels parallel to the prism base.",
                        "Prism formula: n = sin((A + D_m)/2) / sin(A/2).",
                        "Compound microscope: Objective forms real, inverted, magnified image; eyepiece acts as simple magnifier. Total magnification: m = m_o * m_e = -(L / f_o) * (D / f_e) (for image at near point D = 25 cm).",
                        "Astronomical telescope in normal adjustment (image at infinity): Magnifying power m = f_o / f_e; tube length L = f_o + f_e."
                    ],
                    "keyTakeaways": [
                        "In telescopes, the objective has large focal length and large aperture (to collect ample starlight); eyepiece has short focal length.",
                        "In microscopes, both objective and eyepiece have short focal lengths, with f_objective < f_eyepiece."
                    ],
                    "examTips": ["Reflecting telescopes (Cassegrain) use paraboloid mirrors instead of lenses, completely eliminating chromatic aberration."]
                }
            ],
            "misconceptions": ["Confusing telescope and microscope focal length designs: telescopes require large f_o; microscopes require very small f_o."],
            "formulas": [
                {
                    "label": "Prism Refractive Index Formula",
                    "formula": "n = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}",
                    "description": "Refractive index of prism of apex angle A exhibiting minimum deviation angle D_m.",
                    "variables": [
                        { "symbol": "A", "meaning": "Prism Apex Angle", "unit": "rad" },
                        { "symbol": "D_m", "meaning": "Minimum Angle of Deviation", "unit": "rad" },
                        { "symbol": "n", "meaning": "Refractive Index", "unit": "-" }
                    ]
                },
                {
                    "label": "Astronomical Telescope Magnifying Power",
                    "formula": "m = \\frac{f_o}{f_e}, \\quad L = f_o + f_e",
                    "description": "Angular magnification and barrel length in normal adjustment (image at infinity).",
                    "variables": [
                        { "symbol": "f_o", "meaning": "Objective Focal Length", "unit": "m" },
                        { "symbol": "f_e", "meaning": "Eyepiece Focal Length", "unit": "m" },
                        { "symbol": "m", "meaning": "Angular Magnifying Power", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-10": [
        {
            "title": "Huygens’ Principle & Wavefront Construction",
            "desc": "Primary and secondary wavefronts, Huygens' construction, proof of laws of reflection and refraction using wave theory.",
            "notesOverview": "Huygens’ Principle posits that every point on a wavefront acts as a secondary source of spherical wavelets, whose forward envelope forms the new wavefront at a later instant.",
            "notesSections": [
                {
                    "heading": "Wave Theory Proof of Snell's Law",
                    "paragraphs": [
                        "A wavefront is the continuous locus of all points oscillating in identical phase.",
                        "When plane wavefront strikes a denser boundary obliquely: wavefront moves slower in denser medium (v2 < v1). Snell's ratio follows: sin i / sin r = v1 / v2 = n2 / n1.",
                        "Wave theory correctly predicted that light travels SLOWER in optically denser media (v = c/n), overturning Newton's corpuscular theory."
                    ],
                    "keyTakeaways": [
                        "Rays are lines perpendicular to wavefronts indicating the direction of energy propagation.",
                        "Point source produces spherical wavefronts; distant source produces planar wavefronts."
                    ],
                    "examTips": ["Frequency remains invariant when a wave refracts into another medium: f is constant, while v and lambda scale by 1/n."]
                }
            ],
            "misconceptions": ["Assuming light speeds up in denser media (as Newton corpuscular theory wrongly proposed). Wave theory proved light SLOWS DOWN in denser media."],
            "formulas": [
                {
                    "label": "Refractive Index and Wave Speed",
                    "formula": "n = \\frac{c}{v} = \\frac{\\lambda_0}{\\lambda}",
                    "description": "Refractive index as the ratio of vacuum light speed/wavelength to medium speed/wavelength.",
                    "variables": [
                        { "symbol": "c", "meaning": "Speed of Light in Vacuum", "unit": "m/s" },
                        { "symbol": "v", "meaning": "Speed of Light in Medium", "unit": "m/s" },
                        { "symbol": "\\lambda_0, \\lambda", "meaning": "Vacuum & Medium Wavelengths", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Interference of Light & Young’s Double Slit Experiment (YDSE)",
            "desc": "Coherent sources, path difference Delta x = d*sin theta = d*y/D, constructive and destructive interference, fringe width beta = lambda*D/d.",
            "simulationId": "double_slit_interference",
            "notesOverview": "Young's Double Slit Experiment confirmed the wave nature of light by demonstrating that light from two coherent slits superposes to produce alternating bright and dark interference fringes.",
            "notesSections": [
                {
                    "heading": "Conditions for Maxima, Minima & Fringe Width",
                    "paragraphs": [
                        "Coherent sources maintain a constant phase difference over time, obtainable from a single wavefront using division of wavefront (slits).",
                        "Path difference at screen point y: Delta x = d * y / D.",
                        "Bright fringe (constructive interference): Delta x = n * lambda -> y_n = n * lambda * D / d (n = 0, 1, 2...).",
                        "Dark fringe (destructive interference): Delta x = (2n - 1) * lambda / 2 -> y_n = (2n - 1) * lambda * D / (2d).",
                        "Fringe width (spacing between successive bright fringes): beta = lambda * D / d. All fringes in YDSE have equal width!"
                    ],
                    "keyTakeaways": [
                        "Submerging YDSE apparatus in water (n = 4/3) decreases wavelength by n, narrowing fringe width: beta' = beta / n.",
                        "If white light is used, central fringe is white, bordered by colored fringes with red on the outside."
                    ],
                    "examTips": ["If one slit is covered with thin glass slab of thickness t and index n, the entire fringe pattern shifts by Delta y = (n - 1)*t * D / d without changing fringe width."]
                }
            ],
            "misconceptions": ["Thinking independent light bulbs can produce interference. Two independent light bulbs have random phase variations (~10^-8 s) and can NEVER act as coherent sources."],
            "formulas": [
                {
                    "label": "Interference Fringe Width",
                    "formula": "\\beta = \\frac{\\lambda D}{d}",
                    "description": "Uniform spatial spacing between adjacent bright or dark fringes on screen at distance D from slit spacing d.",
                    "variables": [
                        { "symbol": "\\lambda", "meaning": "Wavelength of Monochromatic Light", "unit": "m" },
                        { "symbol": "D", "meaning": "Slit-to-Screen Distance", "unit": "m" },
                        { "symbol": "d", "meaning": "Slit Separation", "unit": "m" },
                        { "symbol": "\\beta", "meaning": "Fringe Width", "unit": "m" }
                    ]
                },
                {
                    "label": "Resultant Intensity in Wave Interference",
                    "formula": "I = I_1 + I_2 + 2 \\sqrt{I_1 I_2} \\cos\\phi = 4 I_0 \\cos^2\\left(\\frac{\\phi}{2}\\right)",
                    "description": "Total optical intensity for coherent beams of phase difference phi.",
                    "variables": [
                        { "symbol": "I_0", "meaning": "Individual Slit Intensity", "unit": "W/m^2" },
                        { "symbol": "\\phi", "meaning": "Phase Difference", "unit": "rad" },
                        { "symbol": "I", "meaning": "Resultant Intensity", "unit": "W/m^2" }
                    ]
                }
            ]
        },
        {
            "title": "Diffraction of Light at a Single Slit & Resolving Power",
            "desc": "Single slit Fraunhofer diffraction, central maximum width 2*lambda*D/a, secondary maxima and minima, comparison with interference.",
            "notesOverview": "Diffraction is the bending of waves around the corners of an obstacle or aperture comparable in size to the wavelength. Single slit diffraction produces a wide, intense central maximum bordered by faint secondary fringes.",
            "notesSections": [
                {
                    "heading": "Diffraction Minima and Maxima",
                    "paragraphs": [
                        "Diffraction minima occur where slit width a satisfies: a * sin theta = n * lambda (n = 1, 2, 3...). Notice this is opposite to the condition for interference maxima!",
                        "Angular width of central maximum: 2*theta_1 = 2*lambda / a. Linear width on screen: beta_0 = 2*lambda*D / a (double the width of secondary fringes).",
                        "Rayleigh's criterion for resolution: Two point sources are just resolved when the central maximum of one falls on the first minimum of the other: theta_min = 1.22 * lambda / D_aperture."
                    ],
                    "keyTakeaways": [
                        "In interference, all bright fringes have equal intensity; in diffraction, intensity drops off precipitously for secondary maxima.",
                        "Diffraction is prominent only when aperture size a is comparable to wavelength lambda."
                    ],
                    "examTips": ["Central maximum in single slit diffraction is twice as wide as secondary fringes, and contains ~85% of total light energy."]
                }
            ],
            "misconceptions": ["Applying a*sin theta = n*lambda as a maximum condition. In single slit diffraction, a*sin theta = n*lambda is the condition for MINIMA."],
            "formulas": [
                {
                    "label": "Single Slit Diffraction Minima",
                    "formula": "a \\sin\\theta = n \\lambda \\quad (n = 1, 2, 3, \\dots)",
                    "description": "Angular positions of diffraction minima produced by aperture slit of width a.",
                    "variables": [
                        { "symbol": "a", "meaning": "Slit Width", "unit": "m" },
                        { "symbol": "\\theta", "meaning": "Diffraction Angle", "unit": "rad" },
                        { "symbol": "n", "meaning": "Order of Minimum", "unit": "-" },
                        { "symbol": "\\lambda", "meaning": "Wavelength", "unit": "m" }
                    ]
                },
                {
                    "label": "Angular Width of Central Maximum",
                    "formula": "2 \\theta_0 = \\frac{2 \\lambda}{a}, \\quad W_{\\text{central}} = \\frac{2 \\lambda D}{a}",
                    "description": "Total angular and linear spatial spread of central diffraction peak.",
                    "variables": [
                        { "symbol": "a", "meaning": "Aperture Width", "unit": "m" },
                        { "symbol": "D", "meaning": "Screen Distance", "unit": "m" },
                        { "symbol": "W_{\\text{central}}", "meaning": "Linear Width on Screen", "unit": "m" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-11": [
        {
            "title": "Photoelectric Effect & Lenard’s Experimental Observations",
            "desc": "Threshold frequency nu0, work function Phi0, stopping potential V0, instantaneous emission, effect of intensity and frequency.",
            "notesOverview": "The photoelectric effect is the instantaneous emission of electrons from a metallic surface when exposed to electromagnetic radiation of frequency exceeding a threshold frequency nu_0.",
            "notesSections": [
                {
                    "heading": "Key Experimental Observations",
                    "paragraphs": [
                        "1. For a given metal, there exists a threshold frequency nu_0 below which NO electrons are emitted, regardless of radiation intensity.",
                        "2. Photoelectric current is directly proportional to the intensity of incident radiation (number of photons/sec).",
                        "3. Maximum kinetic energy of photoelectrons K_max = e * V_0 is completely independent of intensity and depends strictly linearly on radiation frequency nu.",
                        "4. Photoelectric emission is instantaneous (time lag < 10^-9 s)."
                    ],
                    "keyTakeaways": [
                        "Classical wave theory failed because it predicted emission would occur at any frequency given sufficient intensity and predicted a multi-hour heating delay.",
                        "Stopping potential V0 depends solely on radiation frequency and cathode metal work function."
                    ],
                    "examTips": ["Doubling intensity doubles photoelectric current, but leaves stopping potential V0 and maximum kinetic energy UNCHANGED."]
                }
            ],
            "misconceptions": ["Believing higher intensity light produces faster photoelectrons. Higher intensity increases the NUMBER of photoelectrons; only higher frequency increases their SPEED."],
            "formulas": [
                {
                    "label": "Stopping Potential Relation",
                    "formula": "K_{\\max} = \\frac{1}{2} m v_{\\max}^2 = e V_0",
                    "description": "Maximum kinetic energy of emitted photoelectrons equated to stopping potential V0.",
                    "variables": [
                        { "symbol": "e", "meaning": "Electron Charge Quantum", "unit": "C" },
                        { "symbol": "V_0", "meaning": "Stopping Potential", "unit": "V" },
                        { "symbol": "K_{\\max}", "meaning": "Maximum Kinetic Energy", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "Einstein’s Photoelectric Equation & The Photon Concept",
            "desc": "Energy quantum E = h*nu, Einstein's equation h*nu = Phi0 + K_max = h*nu0 + e*V0, Planck's constant determination.",
            "notesOverview": "Albert Einstein explained the photoelectric effect in 1905 by proposing that light propagates in discrete localized energy packets called photons: E = h*nu.",
            "notesSections": [
                {
                    "heading": "Einstein's Equation and Graph",
                    "paragraphs": [
                        "Einstein's photoelectric equation: h * nu = Phi_0 + K_max = h * nu_0 + e * V_0.",
                        "Stopping potential as a function of frequency: V_0 = (h / e) * nu - (Phi_0 / e).",
                        "The V0 versus nu plot is a straight line whose slope is universally h / e (giving an experimental method to measure Planck's constant h = 6.626 x 10^-34 J s), with intercept -Phi_0 / e on the voltage axis."
                    ],
                    "keyTakeaways": [
                        "Photons are electrically neutral and travel at speed c in vacuum.",
                        "Photon momentum: p = E / c = h / lambda."
                    ],
                    "examTips": ["The slope of V0 versus nu graph is identical for ALL metals, equal to h / e."]
                }
            ],
            "misconceptions": ["Assuming photons have rest mass. Photons have zero rest mass; their energy is purely relativistic kinetic energy E = h*nu."],
            "formulas": [
                {
                    "label": "Einstein’s Photoelectric Equation",
                    "formula": "h \\nu = \\Phi_0 + K_{\\max} = h \\nu_0 + e V_0",
                    "description": "Conservation of energy in single-photon absorption by a conduction electron.",
                    "variables": [
                        { "symbol": "h", "meaning": "Planck’s Constant (6.626 x 10^-34)", "unit": "J s" },
                        { "symbol": "\\nu", "meaning": "Incident Photon Frequency", "unit": "Hz" },
                        { "symbol": "\\Phi_0", "meaning": "Work Function (h nu_0)", "unit": "J" },
                        { "symbol": "K_{\\max}", "meaning": "Maximum Photoelectron Kinetic Energy", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "De Broglie’s Wave Nature of Matter & Davisson-Germer Experiment",
            "desc": "De Broglie wavelength lambda = h/p = h/(mv), wavelength of electron accelerated by voltage V lambda = 1.227/sqrt(V) nm, Davisson-Germer diffraction.",
            "notesOverview": "Louis de Broglie proposed that matter exhibits wave-particle duality: every moving particle is accompanied by a matter wave of wavelength lambda = h / p.",
            "notesSections": [
                {
                    "heading": "De Broglie Wavelength Formulae",
                    "paragraphs": [
                        "Matter wavelength: lambda = h / p = h / (m * v) = h / sqrt(2 * m * K).",
                        "For an electron accelerated from rest across potential difference V: K = e * V -> lambda = h / sqrt(2 * m_e * e * V) = 1.227 / sqrt(V) nanometres.",
                        "Davisson and Germer experimentally confirmed electron diffraction using a nickel crystal lattice in 1927, proving electrons exhibit wave interference."
                    ],
                    "keyTakeaways": [
                        "For accelerating potential V = 54 V: lambda = 1.227 / sqrt(54) = 0.167 nm, matching Bragg diffraction peaks.",
                        "Macroscopic objects have undetectable de Broglie wavelengths because mass m is large and Planck constant h is microscopic."
                    ],
                    "examTips": ["For thermal neutrons at temperature T: average kinetic energy K = (3/2)*k_B*T, so lambda = h / sqrt(3*m*k_B*T)."]
                }
            ],
            "misconceptions": ["Believing de Broglie waves are electromagnetic. Matter waves are probability waves, completely distinct from electromagnetic radiation."],
            "formulas": [
                {
                    "label": "De Broglie Wavelength",
                    "formula": "\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}}",
                    "description": "Wavelength of matter wave associated with particle of momentum p.",
                    "variables": [
                        { "symbol": "h", "meaning": "Planck’s Constant", "unit": "J s" },
                        { "symbol": "p", "meaning": "Linear Momentum", "unit": "kg m/s" },
                        { "symbol": "\\lambda", "meaning": "De Broglie Wavelength", "unit": "m" }
                    ]
                },
                {
                    "label": "Accelerated Electron Wavelength",
                    "formula": "\\lambda_e = \\frac{h}{\\sqrt{2 m_e e V}} = \\frac{1.227}{\\sqrt{V}} \\text{ nm}",
                    "description": "De Broglie wavelength of electron accelerated across potential difference V in volts.",
                    "variables": [
                        { "symbol": "V", "meaning": "Accelerating Potential Difference", "unit": "V" },
                        { "symbol": "\\lambda_e", "meaning": "Electron Wavelength", "unit": "nm" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-12": [
        {
            "title": "Alpha-Particle Scattering & Rutherford’s Nuclear Model",
            "desc": "Geiger-Marsden experiment, impact parameter b, distance of closest approach r0, discovery of central atomic nucleus, limitations.",
            "notesOverview": "Rutherford’s alpha-particle scattering experiment demonstrated that most of the atom is empty space, with all positive charge and virtually all mass concentrated in a tiny central core called the nucleus.",
            "notesSections": [
                {
                    "heading": "Scattering Mechanics and Distance of Closest Approach",
                    "paragraphs": [
                        "Only 1 in ~8000 alpha particles deflected by more than 90 degrees; a tiny fraction bounced straight back (theta = 180 deg).",
                        "Distance of closest approach in head-on collision (b = 0): Initial kinetic energy equals electrostatic potential energy: (1/2)*m*v^2 = (1 / (4*pi*epsilon_0)) * (2*Z*e^2 / r_0) -> r_0 = (2*Z*e^2) / (4*pi*epsilon_0 * K).",
                        "Limitations: Classical electromagnetic theory predicted accelerating planetary electrons would continuously radiate energy and spiral into the nucleus within ~10^-8 s, failing to explain atomic stability or discrete line spectra."
                    ],
                    "keyTakeaways": [
                        "Atomic radius is ~10^-10 m (1 Angstrom); nuclear radius is ~10^-15 to 10^-14 m (1 Fermi).",
                        "Scattering formula: N(theta) is inversely proportional to sin^4(theta / 2)."
                    ],
                    "examTips": ["Rutherford scattering assumes Coulomb interaction between point-like alpha particle and target gold nucleus."]
                }
            ],
            "misconceptions": ["Assuming Rutherford's model explained why atoms don't collapse. Classical physics predicts Rutherford atoms are inherently unstable; Bohr's quantum postulates were required."],
            "formulas": [
                {
                    "label": "Distance of Closest Approach",
                    "formula": "r_0 = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 Z e^2}{K}",
                    "description": "Minimum distance reached by alpha particle of kinetic energy K in head-on collision with nucleus of atomic number Z.",
                    "variables": [
                        { "symbol": "Z", "meaning": "Target Atomic Number", "unit": "-" },
                        { "symbol": "e", "meaning": "Elementary Charge", "unit": "C" },
                        { "symbol": "K", "meaning": "Alpha Particle Kinetic Energy", "unit": "J" },
                        { "symbol": "r_0", "meaning": "Closest Approach Distance", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Bohr’s Model of the Hydrogen Atom & Quantised Orbits",
            "desc": "Bohr's postulates, angular momentum quantisation L = n*h/(2pi), radius r_n = 0.529*n^2/Z Angstrom, velocity v_n = c/(137*n), energy levels E_n = -13.6*Z^2/n^2 eV.",
            "simulationId": "bohr_atom",
            "notesOverview": "Niels Bohr resolved atomic stability by postulating that electrons revolve only in discrete non-radiating stationary orbits where orbital angular momentum is an integer multiple of h / (2*pi).",
            "notesSections": [
                {
                    "heading": "Bohr Postulates and Derivations",
                    "paragraphs": [
                        "1. Postulate 1: Centripetal force provided by Coulomb attraction: m*v^2 / r = (1 / (4*pi*epsilon_0)) * (Z*e^2 / r^2).",
                        "2. Postulate 2: Quantisation of angular momentum: L = m*v*r = n * h / (2*pi) (n = 1, 2, 3...).",
                        "3. Postulate 3: Radiative transition: h*nu = E_initial - E_final.",
                        "Radius of nth orbit: r_n = (epsilon_0 * h^2 * n^2) / (pi * m * Z * e^2) = 0.529 * (n^2 / Z) Angstrom. For ground state H (n=1, Z=1): r1 = a0 = 0.529 Angstrom.",
                        "Total energy in nth orbit: E_n = -13.6 * (Z^2 / n^2) eV. Kinetic energy K = -E_n = +13.6 eV; Potential energy U = 2*E_n = -27.2 eV."
                    ],
                    "keyTakeaways": [
                        "Negative total energy indicates the electron is bound to the nucleus.",
                        "Ionisation energy of hydrogen atom is +13.6 eV."
                    ],
                    "examTips": ["Remember that K = -E and U = 2E. If total energy is -3.4 eV (n=2), K = +3.4 eV and U = -6.8 eV."]
                }
            ],
            "misconceptions": ["Assuming Bohr model applies to multi-electron atoms. Bohr model is strictly valid ONLY for hydrogen and hydrogen-like single-electron ions (He+, Li2+, Be3+)."],
            "formulas": [
                {
                    "label": "Bohr Orbital Radius",
                    "formula": "r_n = \\frac{\\varepsilon_0 h^2 n^2}{\\pi m e^2 Z} = 0.529 \\frac{n^2}{Z} \\text{ \\AA}",
                    "description": "Quantised orbital radius of nth stationary orbit for hydrogen-like ion of atomic number Z.",
                    "variables": [
                        { "symbol": "n", "meaning": "Principal Quantum Number", "unit": "-" },
                        { "symbol": "Z", "meaning": "Atomic Number", "unit": "-" },
                        { "symbol": "r_n", "meaning": "Orbital Radius", "unit": "\\AA" }
                    ]
                },
                {
                    "label": "Bohr Energy Levels",
                    "formula": "E_n = -\\frac{m e^4 Z^2}{8 \\varepsilon_0^2 h^2 n^2} = -13.6 \\frac{Z^2}{n^2} \\text{ eV}",
                    "description": "Quantised total mechanical energy of electron in nth stationary Bohr orbit.",
                    "variables": [
                        { "symbol": "n", "meaning": "Principal Quantum Number", "unit": "-" },
                        { "symbol": "Z", "meaning": "Nuclear Charge Number", "unit": "-" },
                        { "symbol": "E_n", "meaning": "Orbit Energy", "unit": "eV" }
                    ]
                }
            ]
        },
        {
            "title": "Hydrogen Line Spectra & De Broglie’s Justification",
            "desc": "Rydberg formula 1/lambda = R*(1/n1^2 - 1/n2^2), Lyman, Balmer, Paschen, Brackett, Pfund series, de Broglie's standing wave condition 2*pi*r = n*lambda.",
            "notesOverview": "Atomic hydrogen emits discrete spectral lines when excited electrons transition to lower energy states, emitting single photons matching the Rydberg formula.",
            "notesSections": [
                {
                    "heading": "Spectral Series and De Broglie Standing Waves",
                    "paragraphs": [
                        "Rydberg formula: 1 / lambda = R * Z^2 * (1/n1^2 - 1/n2^2), where R = 1.097 x 10^7 m^-1 is Rydberg constant.",
                        "Lyman series (n1 = 1, n2 = 2, 3...): Ultraviolet region.",
                        "Balmer series (n1 = 2, n2 = 3, 4...): Visible region (H-alpha, H-beta, H-gamma lines).",
                        "Paschen (n1 = 3), Brackett (n1 = 4), Pfund (n1 = 5): Infrared region.",
                        "De Broglie explanation: Stationary orbits correspond to constructive circular standing waves of electron matter waves: 2*pi*r = n*lambda. Substituting lambda = h / (m*v) directly yields Bohr's angular momentum quantisation m*v*r = n*h / (2*pi)!"
                    ],
                    "keyTakeaways": [
                        "Balmer series is the ONLY series lying in the visible human eye range.",
                        "Shortest wavelength in any series (series limit) occurs when n2 -> infinity: 1 / lambda_min = R / n1^2."
                    ],
                    "examTips": ["The longest wavelength (first line) in Lyman series is n=2 -> n=1: lambda = 4 / (3R) approx 1216 Angstrom."]
                }
            ],
            "misconceptions": ["Assuming Lyman series is in the visible spectrum. Lyman series is strictly ULTRAVIOLET; only Balmer series lies in the visible spectrum."],
            "formulas": [
                {
                    "label": "Rydberg Spectral Formula",
                    "formula": "\\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)",
                    "description": "Wavenumber of photon emitted during quantum transition from level n2 to level n1.",
                    "variables": [
                        { "symbol": "R", "meaning": "Rydberg Constant (1.097 x 10^7)", "unit": "m^-1" },
                        { "symbol": "n_1, n_2", "meaning": "Lower & Upper Quantum Levels", "unit": "-" },
                        { "symbol": "\\lambda", "meaning": "Emitted Photon Wavelength", "unit": "m" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-13": [
        {
            "title": "Nuclear Structure, Nuclear Size & Nuclear Density",
            "desc": "Atomic mass unit 1 u = 931.5 MeV, nuclear radius R = R0*A^(1/3) (R0 = 1.2 fm), constant nuclear density rho approx 2.3 x 10^17 kg/m^3.",
            "notesOverview": "The atomic nucleus consists of bound nucleons (protons and neutrons). Nuclear volume is proportional to mass number A, rendering nuclear density universally constant across all chemical elements.",
            "notesSections": [
                {
                    "heading": "Nuclear Size and Density Independence",
                    "paragraphs": [
                        "Nuclear radius: R = R0 * A^(1/3), where R0 approx 1.2 x 10^-15 m (1.2 fm) and A is mass number.",
                        "Nuclear volume: V = (4/3)*pi*R^3 = (4/3)*pi*R0^3 * A, directly proportional to A.",
                        "Nuclear density: rho = Total Mass / Volume = (A * m_n) / ((4/3)*pi*R0^3 * A) = m_n / ((4/3)*pi*R0^3) approx 2.3 x 10^17 kg/m^3. Density is strictly INDEPENDENT of mass number A!"
                    ],
                    "keyTakeaways": [
                        "1 atomic mass unit (1 u) = 1.6605 x 10^-27 kg = 931.5 MeV/c^2.",
                        "Nuclear matter density is immense (~10^14 times denser than water)."
                    ],
                    "examTips": ["The ratio of nuclear densities of any two elements (e.g. Iron vs Lead) is strictly 1 : 1."]
                }
            ],
            "misconceptions": ["Assuming heavier nuclei are denser. Nuclear radius scales as A^(1/3), making nuclear density identical for all nuclei."],
            "formulas": [
                {
                    "label": "Nuclear Radius Formula",
                    "formula": "R = R_0 A^{1/3}",
                    "description": "Empirical radius of nucleus of mass number A with R0 = 1.2 fm.",
                    "variables": [
                        { "symbol": "R_0", "meaning": "Nuclear Radius Constant (1.2 fm)", "unit": "m" },
                        { "symbol": "A", "meaning": "Mass Number (Nucleon Count)", "unit": "-" },
                        { "symbol": "R", "meaning": "Nuclear Radius", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Mass Defect & Binding Energy per Nucleon Curve",
            "desc": "Mass defect Delta m = [Z*mp + (A-Z)*mn] - M_nucleus, binding energy E_b = Delta m * c^2, BE/A curve, nuclear fission and fusion.",
            "notesOverview": "The rest mass of an atomic nucleus is always strictly less than the sum of the individual masses of its constituent free nucleons, the missing mass having been converted into nuclear binding energy: E_b = Delta m * c^2.",
            "notesSections": [
                {
                    "heading": "Binding Energy per Nucleon (BE/A) Curve",
                    "paragraphs": [
                        "Mass defect: Delta m = [Z*m_p + (A - Z)*m_n] - M_nucleus.",
                        "BE/A curve rises sharply for light nuclei (with peaks at He-4, C-12, O-16), reaches a broad plateau around A = 30 to 170 with a peak at Iron-56 (8.75 MeV/nucleon), and drops slowly to ~7.6 MeV/nucleon for Uranium-238.",
                        "Nuclear Fission: Heavy nuclei (A > 200) split into intermediate fragments, moving to higher BE/A and releasing ~200 MeV per fission event.",
                        "Nuclear Fusion: Light nuclei (A < 20) fuse into heavier nuclei (e.g. 4 H -> He + 2e+ + 26.7 MeV), moving up the steep initial slope and releasing enormous energy."
                    ],
                    "keyTakeaways": [
                        "Iron-56 has the highest binding energy per nucleon and is the most thermodynamically stable nucleus in the universe.",
                        "Nuclear forces are short-range (~1-2 fm), charge-independent, and exhibit saturation properties."
                    ],
                    "examTips": ["Energy released in a nuclear reaction: Q = (Total BE of products) - (Total BE of reactants) = (Mass of reactants - Mass of products) * 931.5 MeV."]
                }
            ],
            "misconceptions": ["Confusing total binding energy with stability. Stability is determined by Binding Energy PER NUCLEON (BE/A), not total binding energy."],
            "formulas": [
                {
                    "label": "Mass Defect & Binding Energy",
                    "formula": "\\Delta m = [Z m_p + (A - Z) m_n] - M, \\quad E_b = \\Delta m \\times 931.5 \\text{ MeV}",
                    "description": "Mass discrepancy converted into nuclear binding energy holding nucleons together.",
                    "variables": [
                        { "symbol": "Z", "meaning": "Proton Number", "unit": "-" },
                        { "symbol": "A", "meaning": "Mass Number", "unit": "-" },
                        { "symbol": "\\Delta m", "meaning": "Mass Defect", "unit": "u" },
                        { "symbol": "E_b", "meaning": "Total Binding Energy", "unit": "MeV" }
                    ]
                }
            ]
        },
        {
            "title": "Nuclear Fission, Chain Reactions & Nuclear Fusion",
            "desc": "Thermal neutron fission of U-235, controlled vs uncontrolled chain reactions, multiplication factor k, stellar proton-proton cycle fusion.",
            "notesOverview": "Nuclear fission splits heavy nuclei into middle-mass fragments with high energy release; nuclear fusion fuses light hydrogen isotopes into helium at extreme thermonuclear temperatures.",
            "notesSections": [
                {
                    "heading": "Fission Reactors and Stellar Fusion",
                    "paragraphs": [
                        "Fission: U-235 + n_th -> Ba-144 + Kr-89 + 3 n + 200 MeV.",
                        "Multiplication factor k = (Number of neutrons in present generation) / (Number in previous generation). In nuclear reactors, control rods (Cadmium/Boron) maintain k = 1 (critical state); Heavy water (D2O) and graphite act as moderators.",
                        "Thermonuclear Fusion: Requires extreme temperatures (~10^7 K) to overcome Coulomb electrostatic repulsion between positively charged protons (Sun's core)."
                    ],
                    "keyTakeaways": [
                        "Per unit mass, nuclear fusion yields roughly 4 times more energy than nuclear fission.",
                        "Fusion produces non-radioactive benign by-products (helium), making it the ultimate clean energy pursuit."
                    ],
                    "examTips": ["Moderators SLOW DOWN fast neutrons to thermal speeds (~0.025 eV); control rods ABSORB excess neutrons."]
                }
            ],
            "misconceptions": ["Confusing the functions of moderators and control rods. Moderators slow down neutrons without absorbing them; control rods absorb neutrons to control reactor power."],
            "formulas": [
                {
                    "label": "Nuclear Fission Energy Release",
                    "formula": "Q = [m(^{235}_{92}\\text{U}) + m_n - \\sum m_{\\text{products}}] c^2 \\approx 200 \\text{ MeV}",
                    "description": "Total kinetic energy and gamma radiation released per U-235 fission event.",
                    "variables": [
                        { "symbol": "Q", "meaning": "Fission Energy Released", "unit": "MeV" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-14": [
        {
            "title": "Energy Bands in Solids: Conductors, Semiconductors & Insulators",
            "desc": "Valence band, conduction band, forbidden energy gap Eg, classification of metals (Eg = 0), semiconductors (Eg < 3 eV), and insulators (Eg > 3 eV).",
            "notesOverview": "In crystalline solids, atomic energy levels split into continuous energy bands. Electrical conductivity depends on the magnitude of the forbidden energy gap Eg separating the valence band from the conduction band.",
            "notesSections": [
                {
                    "heading": "Energy Band Classification",
                    "paragraphs": [
                        "Conductors (Metals): Valence band and conduction band overlap (Eg = 0), providing abundant free electrons for conduction.",
                        "Insulators (Diamond, Glass): Large forbidden gap Eg > 3 eV (Eg_diamond = 5.4 eV). Thermal energy cannot bridge electrons into conduction band.",
                        "Semiconductors (Si, Ge): Small forbidden gap Eg < 3 eV (Eg_Si = 1.1 eV, Eg_Ge = 0.7 eV). At 0 K, semiconductors behave as perfect insulators; at room temperature, thermal excitation generates electron-hole pairs."
                    ],
                    "keyTakeaways": [
                        "In semiconductors, both electrons in conduction band and holes in valence band act as mobile charge carriers: I = I_e + I_h.",
                        "Hole is an effective positive charge carrier representing an empty electron state in the valence band."
                    ],
                    "examTips": ["At absolute zero (0 K), intrinsic semiconductors have completely empty conduction bands and act as perfect insulators."]
                }
            ],
            "misconceptions": ["Assuming holes physically move through the lattice. Holes move via neighboring valence electrons hopping into adjacent empty states."],
            "formulas": [
                {
                    "label": "Total Semiconductor Current",
                    "formula": "I = I_e + I_h = e A (n_e v_e + n_h v_h)",
                    "description": "Total current carried by electrons in conduction band and holes in valence band.",
                    "variables": [
                        { "symbol": "n_e, n_h", "meaning": "Electron & Hole Densities", "unit": "m^-3" },
                        { "symbol": "v_e, v_h", "meaning": "Drift Velocities", "unit": "m/s" },
                        { "symbol": "e", "meaning": "Elementary Charge", "unit": "C" },
                        { "symbol": "I", "meaning": "Total Current", "unit": "A" }
                    ]
                }
            ]
        },
        {
            "title": "Intrinsic and Extrinsic Semiconductors: Doping & Carriers",
            "desc": "Pure Silicon/Germanium, n_e = n_h = n_i, n-type doping (pentavalent P, As, Sb), p-type doping (trivalent B, Al, In), mass action law n_e*n_h = n_i^2.",
            "notesOverview": "Doping introduces deliberate trace impurities into pure semiconductors to dramatically increase carrier concentrations. Pentavalent dopants create n-type material; trivalent dopants create p-type material.",
            "notesSections": [
                {
                    "heading": "Extrinsic Doping and Mass Action Law",
                    "paragraphs": [
                        "Intrinsic: n_e = n_h = n_i. Extremely low room-temperature conductivity.",
                        "n-type: Doped with group-15 pentavalent donor atoms (P, As, Sb). Electrons are majority carriers (n_e >> n_h). Donor energy level lies just below conduction band (Ed approx 0.05 eV below Ec).",
                        "p-type: Doped with group-13 trivalent acceptor atoms (B, Al, In). Holes are majority carriers (n_h >> n_e). Acceptor energy level lies just above valence band.",
                        "Law of Mass Action: In thermal equilibrium, the product of electron and hole concentrations is constant: n_e * n_h = n_i^2."
                    ],
                    "keyTakeaways": [
                        "Both n-type and p-type semiconductor crystals are electrically NEUTRAL overall (donor/acceptor ions balance free carriers).",
                        "Conductivity of doped semiconductor: sigma = e * (n_e * mu_e + n_h * mu_h)."
                    ],
                    "examTips": ["Remember: n-type semiconductor is NOT negatively charged! It is electrically neutral overall."]
                }
            ],
            "misconceptions": ["Believing n-type semiconductors have net negative electrical charge. Mobile electrons are balanced by stationary positive donor ions, maintaining net electrical neutrality."],
            "formulas": [
                {
                    "label": "Semiconductor Mass Action Law",
                    "formula": "n_e n_h = n_i^2",
                    "description": "Invariant product of electron and hole carrier densities in thermal equilibrium.",
                    "variables": [
                        { "symbol": "n_e", "meaning": "Electron Concentration", "unit": "m^-3" },
                        { "symbol": "n_h", "meaning": "Hole Concentration", "unit": "m^-3" },
                        { "symbol": "n_i", "meaning": "Intrinsic Carrier Concentration", "unit": "m^-3" }
                    ]
                }
            ]
        },
        {
            "title": "p-n Junction Diode, Biasing & Full-Wave Rectification",
            "desc": "Diffusion and drift currents, depletion layer, barrier potential, forward and reverse bias I-V characteristics, half-wave and full-wave rectification.",
            "notesOverview": "A p-n junction forms when p-type and n-type semiconductor regions merge. Diffusion of carriers creates a depletion layer and built-in barrier potential opposing further diffusion.",
            "notesSections": [
                {
                    "heading": "p-n Junction Dynamics and Rectification",
                    "paragraphs": [
                        "Depletion layer contains immobile uncompensated donor (+ ions on n-side) and acceptor (- ions on p-side) ions. Barrier potential is ~0.7 V for Si and ~0.3 V for Ge.",
                        "Forward Bias (p to +, n to -): Barrier height decreases, depletion width narrows, allowing large exponential forward current (mA).",
                        "Reverse Bias (p to -, n to +): Barrier height increases, depletion width widens, allowing only tiny minority leakage current (microamps), until breakdown occurs.",
                        "Full-Wave Rectifier: Uses two diodes and a centre-tapped transformer (or bridge rectifier with 4 diodes) to rectify both halves of AC cycle. Ripple frequency = 2*f_in (100 Hz for 50 Hz mains). Efficiency up to 81.2%."
                    ],
                    "keyTakeaways": [
                        "Half-wave rectifier ripple frequency = f_in; Full-wave rectifier ripple frequency = 2 * f_in.",
                        "Capacitor filter connected in parallel across load smooths DC output by charging to peak voltage and discharging slowly."
                    ],
                    "examTips": ["Zener diode is heavily doped, operates in REVERSE breakdown region, and is used as a DC voltage regulator."]
                }
            ],
            "misconceptions": ["Assuming diode conducts zero current in reverse bias. A tiny temperature-dependent reverse saturation current (microamps) flows due to minority carriers."],
            "formulas": [
                {
                    "label": "Full-Wave Rectifier Efficiency",
                    "formula": "\\eta = \\frac{0.812 R_L}{r_d + R_L} \\approx 81.2\\%",
                    "description": "Maximum conversion efficiency of AC input power to DC output power in full-wave rectifier.",
                    "variables": [
                        { "symbol": "R_L", "meaning": "Load Resistance", "unit": "\\Omega" },
                        { "symbol": "r_d", "meaning": "Diode Forward Resistance", "unit": "\\Omega" },
                        { "symbol": "\\eta", "meaning": "Rectification Efficiency", "unit": "-" }
                    ]
                }
            ]
        }
    ]
}

print("Physics Class 12 Chapters 6 to 14 loaded successfully.")
