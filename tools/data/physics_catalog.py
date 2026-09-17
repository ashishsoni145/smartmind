# tools/data/physics_catalog.py
# Complete Authentic NCERT Physics Catalog (All 28 Chapters)
import sys
sys.path.append('e:/mind/tools/data')

def get_physics_catalog():
    from physics_complete import PHYSICS_ALL
    from physics_class12 import PHYSICS_12
    
    catalog = {}
    catalog.update(PHYSICS_ALL)
    catalog.update(PHYSICS_12)
    
    # Complete remaining Class 12 Physics chapters (PHY-12-04 through PHY-12-14)
    # PHY-12-04: Moving Charges and Magnetism
    catalog["PHY-12-04"] = [
        {
            "title": "Magnetic Force on Moving Charges & Lorentz Force",
            "desc": "Lorentz force F = q(E + v x B), motion of charge in uniform magnetic field, helical path, pitch of helix, and cyclotron frequency.",
            "notesOverview": "A magnetic field exerts a velocity-dependent deflecting force on moving charges: F_m = q(v x B). The Lorentz force combines electrostatic and magnetic forces: F = q(E + v x B).",
            "notesSections": [
                {
                    "heading": "Lorentz Force and Circular Helical Trajectories",
                    "paragraphs": [
                        "Magnetic force F_m is always perpendicular to instantaneous velocity v, doing strictly zero work: dW = F_m . v dt = 0. Magnetic fields alter trajectory direction but never speed or kinetic energy.",
                        "When velocity is perpendicular to magnetic field (theta = 90 deg), the particle follows a circular orbit of radius r = m*v / (q*B). Cyclotron frequency f = q*B / (2*pi*m) is independent of speed and radius.",
                        "When velocity has a component parallel to B, the trajectory is a helix of pitch p = v_parallel * T = (2*pi*m*v_parallel) / (q*B)."
                    ],
                    "keyTakeaways": [
                        "Magnetic Lorentz force does ZERO mechanical work: magnetic fields can never change the kinetic energy of a charged particle.",
                        "Cyclotron frequency depends solely on charge-to-mass ratio (q/m) and magnetic field B."
                    ],
                    "examTips": ["In crossed electric and perpendicular magnetic fields, velocity selector passes particles undeflected when v = E / B."]
                }
            ],
            "misconceptions": ["Thinking magnetic force can speed up a charged particle. Magnetic force is always perpendicular to velocity, so power P = F . v is identically zero."],
            "formulas": [
                {
                    "label": "Lorentz Force Law",
                    "formula": "\\vec{F} = q (\\vec{E} + \\vec{v} \\times \\vec{B})",
                    "description": "Total electromagnetic force on charge q moving at velocity v in fields E and B.",
                    "variables": [
                        { "symbol": "q", "meaning": "Electric Charge", "unit": "C" },
                        { "symbol": "\\vec{E}", "meaning": "Electric Field", "unit": "V/m" },
                        { "symbol": "\\vec{v}", "meaning": "Particle Velocity", "unit": "m/s" },
                        { "symbol": "\\vec{B}", "meaning": "Magnetic Flux Density", "unit": "T" },
                        { "symbol": "\\vec{F}", "meaning": "Total Lorentz Force", "unit": "N" }
                    ]
                },
                {
                    "label": "Cyclotron Radius",
                    "formula": "r = \\frac{m v}{q B} = \\frac{p}{q B}",
                    "description": "Orbital radius of charged particle undergoing circular motion perpendicular to magnetic field B.",
                    "variables": [
                        { "symbol": "m", "meaning": "Particle Mass", "unit": "kg" },
                        { "symbol": "v", "meaning": "Perpendicular Speed", "unit": "m/s" },
                        { "symbol": "q", "meaning": "Charge Magnitude", "unit": "C" },
                        { "symbol": "B", "meaning": "Magnetic Field", "unit": "T" },
                        { "symbol": "r", "meaning": "Gyroradius", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Biot-Savart Law & Field of a Circular Current Loop",
            "desc": "Biot-Savart law dB = (mu0/4pi)*(I dl x r)/r^3, magnetic field at centre and on axis of a circular current-carrying loop.",
            "notesOverview": "The Biot-Savart law provides the fundamental differential equation relating an infinitesimal current element I dl to the magnetic field dB it generates at a field point.",
            "notesSections": [
                {
                    "heading": "Biot-Savart Law and Circular Loop Derivation",
                    "paragraphs": [
                        "Biot-Savart Law: dB = (mu_0 / 4*pi) * (I * dl * sin theta / r^2), where mu_0 = 4*pi x 10^-7 T m/A.",
                        "Magnetic field at centre of circular loop of radius R with N turns: B_centre = (mu_0 * N * I) / (2 * R).",
                        "Magnetic field on axis at distance x from centre: B_axis = (mu_0 * N * I * R^2) / (2 * (R^2 + x^2)^(3/2)). For distant points (x >> R): B_axis approx (mu_0 / 4*pi) * (2*M / x^3), identical to magnetic dipole field."
                    ],
                    "keyTakeaways": [
                        "Right-Hand Grip Rule: Curl fingers along current flow; thumb points in direction of axial magnetic field.",
                        "At large distances, a circular current loop behaves as a magnetic dipole of moment M = N * I * A = N * I * pi * R^2."
                    ],
                    "examTips": ["Ratio of field at centre to field at axial distance x = R is (1 + 1)^(3/2) = 2^(3/2) = 2*sqrt(2)."]
                }
            ],
            "misconceptions": ["Confusing electric dipole field (1/r^3) with straight wire magnetic field (1/r). Circular loops produce 1/r^3 dipole fields at large distances."],
            "formulas": [
                {
                    "label": "Biot-Savart Differential Law",
                    "formula": "d\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{I (d\\vec{l} \\times \\hat{r})}{r^2}",
                    "description": "Magnetic field element produced by current element I dl at position vector r.",
                    "variables": [
                        { "symbol": "\\mu_0", "meaning": "Permeability of Free Space", "unit": "T m/A" },
                        { "symbol": "I", "meaning": "Electric Current", "unit": "A" },
                        { "symbol": "d\\vec{l}", "meaning": "Length Element Vector", "unit": "m" },
                        { "symbol": "r", "meaning": "Separation Distance", "unit": "m" }
                    ]
                },
                {
                    "label": "Field on Axis of Circular Loop",
                    "formula": "B = \\frac{\\mu_0 N I R^2}{2 (R^2 + x^2)^{3/2}}",
                    "description": "Magnetic field at axial distance x from centre of N-turn loop of radius R.",
                    "variables": [
                        { "symbol": "N", "meaning": "Number of Turns", "unit": "-" },
                        { "symbol": "I", "meaning": "Current", "unit": "A" },
                        { "symbol": "R", "meaning": "Loop Radius", "unit": "m" },
                        { "symbol": "x", "meaning": "Axial Distance from Centre", "unit": "m" },
                        { "symbol": "B", "meaning": "Magnetic Field", "unit": "T" }
                    ]
                }
            ]
        },
        {
            "title": "Ampere’s Circuital Law, Solenoids & Toroids",
            "desc": "Ampere’s law oint(B . dl) = mu0 * I_encl, magnetic field of infinite straight wire, long solenoid B = mu0*n*I, and toroidal solenoid.",
            "notesOverview": "Ampere’s Circuital Law states that the line integral of magnetic field B around any closed Amperian loop equals mu_0 times the total enclosed net current: oint(B . dl) = mu_0 * I_encl.",
            "notesSections": [
                {
                    "heading": "Solenoid and Toroid Fields",
                    "paragraphs": [
                        "For a long straight wire at distance r: B = (mu_0 * I) / (2*pi*r).",
                        "Inside an ideal long solenoid with n turns per unit length (n = N/L): B = mu_0 * n * I. Field outside is virtually zero.",
                        "At the open ends of a semi-infinite solenoid: field is half the central value: B_end = 0.5 * mu_0 * n * I.",
                        "Inside a toroid of mean radius R: B = (mu_0 * N * I) / (2*pi*R) = mu_0 * n * I."
                    ],
                    "keyTakeaways": [
                        "Field inside an ideal solenoid is remarkably uniform and parallel to the axis.",
                        "Ampere's circuital law is the magnetic counterpart of Gauss's law in electrostatics."
                    ],
                    "examTips": ["Notice that n is turns PER UNIT LENGTH (N/L), not total turns N. Always check units of n."]
                }
            ],
            "misconceptions": ["Plugging total turns N into B = mu0*n*I instead of turns per unit length n = N/L."],
            "formulas": [
                {
                    "label": "Ampere’s Circuital Law",
                    "formula": "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{encl}}",
                    "description": "Line integral of magnetic field around closed loop equals mu_0 times enclosed current.",
                    "variables": [
                        { "symbol": "I_{\\text{encl}}", "meaning": "Net Current Threading Loop", "unit": "A" },
                        { "symbol": "\\mu_0", "meaning": "Permeability of Free Space", "unit": "T m/A" },
                        { "symbol": "\\vec{B}", "meaning": "Magnetic Field Vector", "unit": "T" }
                    ]
                },
                {
                    "label": "Magnetic Field Inside Long Solenoid",
                    "formula": "B = \\mu_0 n I = \\mu_0 \\left(\\frac{N}{L}\\right) I",
                    "description": "Uniform axial magnetic field inside core of long solenoid.",
                    "variables": [
                        { "symbol": "n", "meaning": "Turns per Unit Length (N/L)", "unit": "m^-1" },
                        { "symbol": "I", "meaning": "Current", "unit": "A" },
                        { "symbol": "B", "meaning": "Core Magnetic Field", "unit": "T" }
                    ]
                }
            ]
        },
        {
            "title": "Force Between Parallel Conductors & Definition of the Ampere",
            "desc": "Parallel currents attract, antiparallel currents repel, force per unit length dF/dL = (mu0/2pi)*(I1*I2/d), SI definition of Ampere.",
            "notesOverview": "Two parallel conductors carrying electric currents exert mutual magnetic Lorentz forces on each other through the magnetic field each creates at the location of the other.",
            "notesSections": [
                {
                    "heading": "Mutual Force and the Ampere Definition",
                    "paragraphs": [
                        "Current I1 creates field B1 = (mu_0 * I1) / (2*pi*d) at conductor 2. Conductor 2 carrying I2 experiences force: F/L = I2 * B1 = (mu_0 * I1 * I2) / (2*pi*d).",
                        "Like parallel currents attract; unlike antiparallel currents repel (opposite of electrostatic charges!).",
                        "One Ampere is defined as that constant current which, maintained in two straight parallel conductors of infinite length and negligible cross-section placed 1 metre apart in vacuum, produces a force of 2 x 10^-7 N per metre of length."
                    ],
                    "keyTakeaways": [
                        "Parallel currents attract; antiparallel currents repel.",
                        "Force satisfies Newton's third law: F_12 = -F_21."
                    ],
                    "examTips": ["Remember: unlike charges attract, but LIKE CURRENTS attract! Students frequently reverse this."]
                }
            ],
            "misconceptions": ["Assuming parallel currents repel because like charges repel. Magnetic force causes like parallel currents to ATTRACT."],
            "formulas": [
                {
                    "label": "Force Between Parallel Conductors",
                    "formula": "\\frac{F}{L} = \\frac{\\mu_0}{2\\pi} \\frac{I_1 I_2}{d}",
                    "description": "Mutual magnetic force per unit length between parallel currents separated by distance d.",
                    "variables": [
                        { "symbol": "I_1, I_2", "meaning": "Currents in Conductors", "unit": "A" },
                        { "symbol": "d", "meaning": "Perpendicular Separation Distance", "unit": "m" },
                        { "symbol": "F/L", "meaning": "Force per Unit Length", "unit": "N/m" }
                    ]
                }
            ]
        },
        {
            "title": "Torque on Current Loop & Moving Coil Galvanometer",
            "desc": "Magnetic dipole moment M = NIA, torque tau = M x B, principle of moving coil galvanometer, radial magnetic field, sensitivity.",
            "notesOverview": "A planar current loop placed in an external magnetic field experiences a torque tau = M x B aligning its magnetic dipole moment M with field B.",
            "notesSections": [
                {
                    "heading": "Moving Coil Galvanometer Operation",
                    "paragraphs": [
                        "Torque on coil of N turns, area A carrying current I: tau = N*I*A*B * sin theta.",
                        "In a moving coil galvanometer, concave cylindrical pole pieces and a soft iron core create a RADIAL magnetic field (theta = 90 deg everywhere), ensuring deflecting torque is linear with current: tau = N*I*A*B.",
                        "Restoring torque from suspension spring: tau_restoring = k * phi. In equilibrium: k*phi = N*I*A*B -> phi = (N*A*B / k) * I.",
                        "Current sensitivity: S_i = phi / I = N*A*B / k. Voltage sensitivity: S_v = phi / V = N*A*B / (k * R)."
                    ],
                    "keyTakeaways": [
                        "Galvanometer is converted to an ammeter by connecting a small shunt resistance S in parallel: S = (I_g * G) / (I - I_g).",
                        "Galvanometer is converted to a voltmeter by connecting a high resistance R in series: R = (V / I_g) - G."
                    ],
                    "examTips": ["Increasing current sensitivity by doubling N also doubles coil resistance R, leaving voltage sensitivity UNCHANGED."]
                }
            ],
            "misconceptions": ["Assuming increasing turns N always increases voltage sensitivity. Doubling N doubles resistance R, keeping S_v = S_i / R constant."],
            "formulas": [
                {
                    "label": "Torque on Current Loop",
                    "formula": "\\vec{\\tau} = \\vec{M} \\times \\vec{B} \\implies \\tau = N I A B \\sin\\theta",
                    "description": "Deflecting torque experienced by coil of N turns and area A in magnetic field B.",
                    "variables": [
                        { "symbol": "N", "meaning": "Number of Turns", "unit": "-" },
                        { "symbol": "I", "meaning": "Coil Current", "unit": "A" },
                        { "symbol": "A", "meaning": "Loop Area", "unit": "m^2" },
                        { "symbol": "B", "meaning": "Magnetic Flux Density", "unit": "T" },
                        { "symbol": "\\tau", "meaning": "Torque", "unit": "N m" }
                    ]
                },
                {
                    "label": "Ammeter Shunt Resistance",
                    "formula": "S = \\frac{I_g G}{I - I_g}",
                    "description": "Parallel shunt resistance required to convert galvanometer of resistance G and full-scale current I_g into ammeter of range I.",
                    "variables": [
                        { "symbol": "I_g", "meaning": "Galvanometer Full Scale Current", "unit": "A" },
                        { "symbol": "G", "meaning": "Galvanometer Coil Resistance", "unit": "\\Omega" },
                        { "symbol": "I", "meaning": "Ammeter Measurement Range", "unit": "A" },
                        { "symbol": "S", "meaning": "Required Shunt Resistance", "unit": "\\Omega" }
                    ]
                }
            ]
        }
    ]

    # PHY-12-05: Magnetism and Matter
    catalog["PHY-12-05"] = [
        {
            "title": "Bar Magnet as an Equivalent Solenoid & Magnetic Dipole",
            "desc": "Magnetic field lines, bar magnet field on axial line B = 2*mu0*M/(4pi*r^3), equatorial line B = mu0*M/(4pi*r^3), Gauss’s law for magnetism.",
            "notesOverview": "A bar magnet possesses two unisolable poles (N and S) separated by magnetic length 2l, behaving as a magnetic dipole of moment M = m * (2l). Its external field is identical to that of a finite current-carrying solenoid.",
            "notesSections": [
                {
                    "heading": "Magnetic Field Lines and Gauss's Law",
                    "paragraphs": [
                        "Magnetic field lines form continuous closed loops (running N to S externally, and S to N internally through the magnet).",
                        "Gauss’s Law for Magnetism: oint(B . dA) = 0. Net magnetic flux through ANY closed surface is strictly zero, establishing the non-existence of isolated magnetic monopoles.",
                        "Axial field: B_axial = (mu_0 / 4*pi) * (2*M / r^3). Equatorial field: B_eq = (mu_0 / 4*pi) * (M / r^3)."
                    ],
                    "keyTakeaways": [
                        "Electric field lines terminate; magnetic field lines are continuous closed loops.",
                        "Breaking a magnet in two produces two complete smaller magnets, each with its own N and S poles."
                    ],
                    "examTips": ["oint(B . dA) = 0 is a direct consequence of magnetic field lines having no starting or ending points."]
                }
            ],
            "misconceptions": ["Believing magnetic monopoles exist classically. Cutting a magnet never isolates a single pole."],
            "formulas": [
                {
                    "label": "Gauss’s Law for Magnetism",
                    "formula": "\\oint \\vec{B} \\cdot d\\vec{A} = 0",
                    "description": "Total outward magnetic flux through any closed Gaussian surface vanishes identically.",
                    "variables": [
                        { "symbol": "\\vec{B}", "meaning": "Magnetic Flux Density", "unit": "T" },
                        { "symbol": "d\\vec{A}", "meaning": "Area Vector", "unit": "m^2" }
                    ]
                },
                {
                    "label": "Axial Magnetic Field of Bar Magnet",
                    "formula": "B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi} \\frac{2 M}{r^3}",
                    "description": "Magnetic field along the dipole axis at distance r >> l.",
                    "variables": [
                        { "symbol": "M", "meaning": "Magnetic Dipole Moment", "unit": "J/T or A m^2" },
                        { "symbol": "r", "meaning": "Axial Distance", "unit": "m" },
                        { "symbol": "B_{\\text{axial}}", "meaning": "Axial Field Strength", "unit": "T" }
                    ]
                }
            ]
        },
        {
            "title": "Magnetic Properties of Materials: Dia, Para & Ferromagnetism",
            "desc": "Magnetisation M, magnetic intensity H, susceptibility chi = M/H, permeability mu = mu0*(1 + chi), Curie's law, and hysteresis curve.",
            "notesOverview": "All materials respond to external magnetic fields. Diamagnetic materials are repelled (chi < 0); paramagnetic materials are weakly attracted (chi > 0); ferromagnetic materials are strongly magnetized (chi >> 1000).",
            "notesSections": [
                {
                    "heading": "Classification of Magnetic Substances",
                    "paragraphs": [
                        "Diamagnetism (Bi, Cu, H2O): Induced magnetic moments oppose external field. chi is small and negative (~ -10^-5), independent of temperature.",
                        "Paramagnetism (Al, O2, Na): Permanent atomic dipoles align with field. chi is small and positive (~ 10^-3). Obeys Curie's law: chi = C / T.",
                        "Ferromagnetism (Fe, Co, Ni): Domain structure with strong exchange coupling. Exhibits hysteresis. Above Curie temperature T_c, ferromagnetic material transitions to paramagnetic: chi = C / (T - T_c) (Curie-Weiss Law)."
                    ],
                    "keyTakeaways": [
                        "Permanent magnets require high retentivity and high coercivity (e.g. Alnico, steel).",
                        "Electromagnet and transformer cores require high permeability, high retentivity, but LOW coercivity and narrow hysteresis loop (soft iron) to minimize heating losses."
                    ],
                    "examTips": ["Superconductors are perfect diamagnets with chi = -1 and relative permeability mu_r = 0 (Meissner Effect)."]
                }
            ],
            "misconceptions": ["Assuming diamagnetism depends on temperature. Diamagnetism is a universal orbital property that is independent of temperature."],
            "formulas": [
                {
                    "label": "Magnetic Susceptibility Relation",
                    "formula": "\\chi = \\frac{M}{H}, \\quad \\mu_r = 1 + \\chi",
                    "description": "Relationship between magnetic susceptibility chi, magnetization M, field H, and relative permeability mu_r.",
                    "variables": [
                        { "symbol": "M", "meaning": "Magnetisation", "unit": "A/m" },
                        { "symbol": "H", "meaning": "Magnetic Intensity", "unit": "A/m" },
                        { "symbol": "\\chi", "meaning": "Magnetic Susceptibility", "unit": "-" },
                        { "symbol": "\\mu_r", "meaning": "Relative Permeability", "unit": "-" }
                    ]
                },
                {
                    "label": "Curie’s Law for Paramagnetism",
                    "formula": "\\chi = \\frac{C}{T}",
                    "description": "Magnetic susceptibility of paramagnetic material inversely proportional to absolute temperature T.",
                    "variables": [
                        { "symbol": "C", "meaning": "Curie Constant", "unit": "K" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                        { "symbol": "\\chi", "meaning": "Susceptibility", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    from physics_part3 import PHYSICS_PART3
    catalog.update(PHYSICS_PART3)

    print("Physics Class 12 part 2 & 3 loaded. Total Physics chapters:", len(catalog))
    return catalog

if __name__ == "__main__":
    cat = get_physics_catalog()
    print("Total Physics chapters in catalog:", len(cat))
