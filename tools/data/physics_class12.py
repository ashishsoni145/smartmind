# tools/data/physics_class12.py
# Authentic NCERT Class 12 Physics curriculum (PHY-12-01 to PHY-12-14)

PHYSICS_12 = {
    "PHY-12-01": [
        {
            "title": "Electric Charges, Quantisation & Coulomb’s Law",
            "desc": "Frictional electricity, charge conservation, quantisation q = +-n*e, Coulomb's inverse square law in vector form, permittivity of medium.",
            "notesOverview": "Electric charge is an intrinsic scalar property of elementary particles. Charge is conserved, invariant under relativistic motion, and quantised in integer multiples of elementary charge e = 1.602 x 10^-19 C.",
            "notesSections": [
                {
                    "heading": "Coulomb's Law and Dielectric Permittivity",
                    "paragraphs": [
                        "Coulomb's Law: F = (1 / (4*pi*epsilon_0)) * (|q1 * q2| / r^2), where 1 / (4*pi*epsilon_0) = 8.988 x 10^9 N m^2/C^2.",
                        "In a medium of relative permittivity (dielectric constant) K = epsilon_r: force is reduced by factor K: F_med = F_air / K.",
                        "Coulomb's force is a central, conservative force obeying Newton's third law: F_12 = -F_21."
                    ],
                    "keyTakeaways": [
                        "Relative permittivity of vacuum K = 1; for water K approx 81; for metals K -> infinity.",
                        "Superposition principle: Net force on test charge is the vector sum of forces exerted by individual charges."
                    ],
                    "examTips": ["Remember that Coulomb force decreases significantly in high-dielectric media like water, explaining why ionic salts dissociate readily."]
                }
            ],
            "misconceptions": ["Thinking charge magnitude varies with speed: unlike mass, electric charge is strictly relativistically invariant."],
            "formulas": [
                {
                    "label": "Coulomb’s Electrostatic Law",
                    "formula": "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}",
                    "description": "Electrostatic interaction force between two stationary point charges separated by distance r in vacuum.",
                    "variables": [
                        { "symbol": "\\varepsilon_0", "meaning": "Permittivity of Free Space", "unit": "C^2/(N m^2)" },
                        { "symbol": "q_1, q_2", "meaning": "Point Charges", "unit": "C" },
                        { "symbol": "r", "meaning": "Separation Distance", "unit": "m" },
                        { "symbol": "F", "meaning": "Electrostatic Force", "unit": "N" }
                    ]
                },
                {
                    "label": "Quantisation of Charge",
                    "formula": "q = \\pm n e",
                    "description": "Electric charge exists in discrete integer multiples of elementary charge e = 1.602 x 10^-19 C.",
                    "variables": [
                        { "symbol": "n", "meaning": "Integer Number of Electrons/Protons", "unit": "-" },
                        { "symbol": "e", "meaning": "Elementary Charge Quantum", "unit": "C" },
                        { "symbol": "q", "meaning": "Total Net Charge", "unit": "C" }
                    ]
                }
            ]
        },
        {
            "title": "Electric Field Lines, Field of Point Charges & Field Lines",
            "desc": "Electric field intensity E = F/q0, field of single and multiple point charges, properties of field lines, neutral points.",
            "simulationId": "point_charge_field",
            "notesOverview": "An electric field E is a vector force field surrounding charges: E = F / q0 = (1 / (4*pi*epsilon_0)) * (q / r^2) * r_hat.",
            "notesSections": [
                {
                    "heading": "Electric Field Lines Properties",
                    "paragraphs": [
                        "Electric field lines originate on positive charges and terminate on negative charges. They do not form closed continuous loops.",
                        "Tangent to a field line at any point gives the direction of electric field E at that point.",
                        "Two field lines NEVER cross each other, because if they did, the field would have two conflicting directions at the intersection point."
                    ],
                    "keyTakeaways": [
                        "Relative density of field lines indicates field strength (crowded lines indicate stronger field).",
                        "Electrostatic field lines are always normal to the surface of a conductor in equilibrium."
                    ],
                    "examTips": ["Electric field inside a hollow charged conductor in electrostatic equilibrium is identically zero (electrostatic shielding)."]
                }
            ],
            "misconceptions": ["Believing electric field lines can intersect. Two field lines never cross because field direction at any point is unique."],
            "formulas": [
                {
                    "label": "Electric Field of Point Charge",
                    "formula": "\\vec{E} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2} \\hat{r}",
                    "description": "Vector electric field intensity produced by source charge q at distance r.",
                    "variables": [
                        { "symbol": "q", "meaning": "Source Charge", "unit": "C" },
                        { "symbol": "r", "meaning": "Distance from Charge", "unit": "m" },
                        { "symbol": "\\vec{E}", "meaning": "Electric Field Intensity", "unit": "N/C" }
                    ]
                }
            ]
        },
        {
            "title": "Electric Dipole, Dipole Moment & Field Calculations",
            "desc": "Dipole moment p = q*2a, electric field on axial line E_axial = 2kp/r^3, equatorial line E_eq = -kp/r^3, torque tau = p x E.",
            "notesOverview": "An electric dipole consists of a pair of equal and opposite point charges (+q and -q) separated by distance 2a. Electric dipole moment is vector p = q * (2a) directed from negative to positive charge.",
            "notesSections": [
                {
                    "heading": "Axial and Equatorial Dipole Fields",
                    "paragraphs": [
                        "For short dipole (r >> a): E_axial = (1 / (4*pi*epsilon_0)) * (2*p / r^3) along dipole axis.",
                        "Equatorial field: E_eq = (1 / (4*pi*epsilon_0)) * (p / r^3) antiparallel to dipole moment vector p.",
                        "E_axial = 2 * E_eq at identical radial distance r. Dipole field falls off as 1/r^3, faster than a point charge's 1/r^2."
                    ],
                    "keyTakeaways": [
                        "In a uniform electric field, net force on dipole is zero: F_net = 0, but torque acts: tau = p x E = p*E*sin theta.",
                        "Potential energy of dipole in uniform field: U = -p . E = -p*E*cos theta."
                    ],
                    "examTips": ["Stable equilibrium occurs at theta = 0 (p parallel to E, U = -pE); Unstable equilibrium occurs at theta = 180 degrees (U = +pE)."]
                }
            ],
            "misconceptions": ["Thinking net force on a dipole in a uniform field is non-zero. Net translational force is zero; only torque exists."],
            "formulas": [
                {
                    "label": "Axial Field of Short Dipole",
                    "formula": "E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 p}{r^3}",
                    "description": "Electric field along the dipole axis at distance r >> a.",
                    "variables": [
                        { "symbol": "p", "meaning": "Dipole Moment (q * 2a)", "unit": "C m" },
                        { "symbol": "r", "meaning": "Axial Distance", "unit": "m" },
                        { "symbol": "E_{\\text{axial}}", "meaning": "Axial Electric Field", "unit": "N/C" }
                    ]
                },
                {
                    "label": "Equatorial Field of Short Dipole",
                    "formula": "E_{\\text{eq}} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{p}{r^3}",
                    "description": "Electric field on broadside equatorial plane perpendicular to dipole axis.",
                    "variables": [
                        { "symbol": "p", "meaning": "Dipole Moment", "unit": "C m" },
                        { "symbol": "r", "meaning": "Equatorial Distance", "unit": "m" },
                        { "symbol": "E_{\\text{eq}}", "meaning": "Equatorial Field", "unit": "N/C" }
                    ]
                },
                {
                    "label": "Torque on Dipole in Uniform Field",
                    "formula": "\\vec{\\tau} = \\vec{p} \\times \\vec{E} \\implies \\tau = p E \\sin\\theta",
                    "description": "Mechanical aligning torque experienced by electric dipole in uniform external field E.",
                    "variables": [
                        { "symbol": "p", "meaning": "Dipole Moment", "unit": "C m" },
                        { "symbol": "E", "meaning": "External Electric Field", "unit": "N/C" },
                        { "symbol": "\\theta", "meaning": "Orientation Angle", "unit": "rad" },
                        { "symbol": "\\tau", "meaning": "Aligning Torque", "unit": "N m" }
                    ]
                }
            ]
        },
        {
            "title": "Electric Flux, Gauss’s Law & Symmetric Field Applications",
            "desc": "Electric flux Phi = integral(E . dA), Gauss's theorem Phi_net = q_encl / epsilon_0, applications to infinite wire, plane sheet, spherical shell.",
            "notesOverview": "Gauss’s law equates the net outward electric flux through any closed Gaussian surface to the net enclosed charge divided by permittivity: Phi = oint(E . dA) = q_encl / epsilon_0.",
            "notesSections": [
                {
                    "heading": "Three Standard Gaussian Symmetry Applications",
                    "paragraphs": [
                        "1. Infinitely long straight wire with linear charge density lambda: E = lambda / (2*pi*epsilon_0 * r) (cylindrical Gaussian surface).",
                        "2. Infinite plane thin sheet of charge with surface density sigma: E = sigma / (2*epsilon_0) (independent of distance r).",
                        "3. Uniformly charged thin spherical shell of radius R and charge q: Outside (r >= R): E = q / (4*pi*epsilon_0 * r^2); Inside (r < R): E = 0 (enclosed charge is zero)."
                    ],
                    "keyTakeaways": [
                        "Gauss’s law is valid for any closed surface of arbitrary shape.",
                        "Flux through a closed surface depends solely on enclosed charges, independent of external charges outside the surface."
                    ],
                    "examTips": ["For conducting sheets, charge resides on both surfaces, so field outside is E = sigma / epsilon_0 (double that of a single non-conducting sheet)."]
                }
            ],
            "misconceptions": ["Assuming external charges contribute to net Gaussian flux. External charges alter local field E on the surface, but their net flux contribution over the entire closed surface integrates to zero."],
            "formulas": [
                {
                    "label": "Gauss’s Law",
                    "formula": "\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{encl}}}{\\varepsilon_0}",
                    "description": "Total outward electric flux through closed Gaussian surface equals enclosed charge over epsilon_0.",
                    "variables": [
                        { "symbol": "q_{\\text{encl}}", "meaning": "Net Enclosed Charge", "unit": "C" },
                        { "symbol": "\\varepsilon_0", "meaning": "Permittivity of Free Space", "unit": "C^2/(N m^2)" },
                        { "symbol": "\\Phi_E", "meaning": "Net Electric Flux", "unit": "N m^2/C" }
                    ]
                },
                {
                    "label": "Field of Infinitely Long Straight Wire",
                    "formula": "E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}",
                    "description": "Radial electric field at distance r from infinite straight line charge of density lambda.",
                    "variables": [
                        { "symbol": "\\lambda", "meaning": "Linear Charge Density", "unit": "C/m" },
                        { "symbol": "r", "meaning": "Radial Distance", "unit": "m" },
                        { "symbol": "E", "meaning": "Electric Field", "unit": "N/C" }
                    ]
                },
                {
                    "label": "Field of Infinite Uniform Sheet of Charge",
                    "formula": "E = \\frac{\\sigma}{2\\varepsilon_0}",
                    "description": "Uniform perpendicular electric field produced by infinite planar non-conducting sheet of surface charge density sigma.",
                    "variables": [
                        { "symbol": "\\sigma", "meaning": "Surface Charge Density", "unit": "C/m^2" },
                        { "symbol": "E", "meaning": "Uniform Electric Field", "unit": "N/C" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-02": [
        {
            "title": "Electrostatic Potential & Potential Due to Charge Distributions",
            "desc": "Potential difference Delta V = W/q0, potential of point charge V = q / (4*pi*epsilon_0*r), dipole potential, and superposition.",
            "notesOverview": "Electrostatic potential V at a point is the work done per unit positive test charge in bringing it from infinity to that point against electrostatic forces: V = -integral(E . dr).",
            "notesSections": [
                {
                    "heading": "Potential Properties",
                    "paragraphs": [
                        "Potential is a scalar quantity: V = (1 / (4*pi*epsilon_0)) * (q / r). Unlike electric field, potentials add algebraically.",
                        "Electric potential due to an electric dipole at distance r and angle theta with dipole axis: V(r, theta) = (1 / (4*pi*epsilon_0)) * (p*cos theta / r^2). On equatorial plane (theta = 90 deg), V = 0."
                    ],
                    "keyTakeaways": [
                        "Potential can be zero while electric field is non-zero (e.g. on equatorial plane of a dipole).",
                        "Electric field can be zero while potential is non-zero (e.g. inside a charged spherical conductor)."
                    ],
                    "examTips": ["Work done in moving charge q between potentials V1 and V2: W = q*(V2 - V1), independent of path."]
                }
            ],
            "misconceptions": ["Believing zero potential implies zero electric field. On the equatorial line of a dipole, potential is zero everywhere, but electric field is non-zero."],
            "formulas": [
                {
                    "label": "Point Charge Electric Potential",
                    "formula": "V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}",
                    "description": "Scalar electrostatic potential at distance r from point charge q with zero datum at infinity.",
                    "variables": [
                        { "symbol": "q", "meaning": "Source Charge", "unit": "C" },
                        { "symbol": "r", "meaning": "Distance", "unit": "m" },
                        { "symbol": "V", "meaning": "Electric Potential", "unit": "V" }
                    ]
                },
                {
                    "label": "Short Dipole Potential",
                    "formula": "V(r, \\theta) = \\frac{1}{4\\pi\\varepsilon_0} \\frac{p \\cos\\theta}{r^2}",
                    "description": "Potential at coordinates (r, theta) from centre of short electric dipole of moment p.",
                    "variables": [
                        { "symbol": "p", "meaning": "Dipole Moment", "unit": "C m" },
                        { "symbol": "\\theta", "meaning": "Polar Angle from Dipole Axis", "unit": "rad" },
                        { "symbol": "r", "meaning": "Radial Distance", "unit": "m" },
                        { "symbol": "V", "meaning": "Dipole Potential", "unit": "V" }
                    ]
                }
            ]
        },
        {
            "title": "Equipotential Surfaces & Field-Potential Relation",
            "desc": "Equipotential surface definition, work done on equipotential is zero, E = -dV/dr, surface shapes for point charges and uniform fields.",
            "notesOverview": "An equipotential surface is a locus of points having identical electric potential throughout. No work is required to move a charge across an equipotential surface: dW = q*dV = 0.",
            "notesSections": [
                {
                    "heading": "Field Lines and Equipotentials",
                    "paragraphs": [
                        "Electric field lines are ALWAYS perpendicular to equipotential surfaces at every point.",
                        "Electric field points in the direction of steepest decrease of electric potential: E = -dV/dr.",
                        "Equipotential surfaces are concentric spheres for a point charge; parallel planes for a uniform electric field; coaxial cylinders for an infinite line charge."
                    ],
                    "keyTakeaways": [
                        "Equipotential surfaces never intersect each other.",
                        "Closer spacing of equipotential surfaces indicates stronger electric field."
                    ],
                    "examTips": ["The surface of any conductor in electrostatic equilibrium is an equipotential surface."]
                }
            ],
            "misconceptions": ["Thinking work is done moving a charge along an equipotential surface. Since Delta V = 0, work is strictly zero."],
            "formulas": [
                {
                    "label": "Electric Field - Potential Gradient Relation",
                    "formula": "E = -\\frac{dV}{dr} \\implies \\vec{E} = -\\nabla V = -\\left(\\frac{\\partial V}{\\partial x}\\hat{i} + \\frac{\\partial V}{\\partial y}\\hat{j} + \\frac{\\partial V}{\\partial z}\\hat{k}\\right)",
                    "description": "Electric field is the negative spatial gradient of electrostatic potential.",
                    "variables": [
                        { "symbol": "V", "meaning": "Potential Function", "unit": "V" },
                        { "symbol": "r", "meaning": "Spatial Coordinate", "unit": "m" },
                        { "symbol": "E", "meaning": "Electric Field", "unit": "V/m" }
                    ]
                }
            ]
        },
        {
            "title": "Capacitors, Dielectrics & Capacitance of Parallel Plate Capacitor",
            "desc": "Capacitance C = Q/V, parallel plate capacitor C0 = epsilon_0*A/d, dielectric insertion C = K*C0, bound surface charge density.",
            "notesOverview": "A capacitor stores electric charge and electrostatic field energy. Inserting a dielectric of dielectric constant K between plates reduces internal electric field and increases capacitance by factor K.",
            "notesSections": [
                {
                    "heading": "Dielectrics and Parallel Plate Capacitance",
                    "paragraphs": [
                        "Capacitance in vacuum: C0 = epsilon_0 * A / d.",
                        "When dielectric slab of thickness t and dielectric constant K is inserted: C = epsilon_0 * A / (d - t + t/K). When slab completely fills gap (t = d): C = K * C0.",
                        "Battery connected: V remains constant, Q increases by K, C increases by K, E remains constant, energy increases by K.",
                        "Battery disconnected: Q remains constant, V decreases by K, E decreases by K, C increases by K, energy decreases by K."
                    ],
                    "keyTakeaways": [
                        "Capacitance depends solely on geometric dimensions (A, d) and dielectric medium, independent of charge Q or voltage V.",
                        "Dielectric polarisation creates bound surface charge sigma_p = sigma * (1 - 1/K)."
                    ],
                    "examTips": ["Always check whether the battery remains connected or disconnected before evaluating changes in Q, V, E, and U."]
                }
            ],
            "misconceptions": ["Assuming capacitance C = Q/V changes when Q changes. C is an intrinsic geometric constant; doubling Q simply doubles voltage V."],
            "formulas": [
                {
                    "label": "Parallel Plate Capacitance",
                    "formula": "C = \\frac{K \\varepsilon_0 A}{d}",
                    "description": "Capacitance of parallel plate capacitor of area A and plate separation d filled with dielectric of constant K.",
                    "variables": [
                        { "symbol": "A", "meaning": "Plate Surface Area", "unit": "m^2" },
                        { "symbol": "d", "meaning": "Plate Separation Distance", "unit": "m" },
                        { "symbol": "K", "meaning": "Dielectric Constant", "unit": "-" },
                        { "symbol": "C", "meaning": "Capacitance", "unit": "F" }
                    ]
                },
                {
                    "label": "Capacitor with Partial Dielectric Slab",
                    "formula": "C = \\frac{\\varepsilon_0 A}{d - t + \\frac{t}{K}}",
                    "description": "Capacitance with dielectric slab of thickness t < d inserted between plates.",
                    "variables": [
                        { "symbol": "t", "meaning": "Dielectric Slab Thickness", "unit": "m" },
                        { "symbol": "d", "meaning": "Plate Separation", "unit": "m" },
                        { "symbol": "K", "meaning": "Dielectric Constant", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Combination of Capacitors & Electrostatic Energy Storage",
            "desc": "Series combination 1/C = 1/C1 + 1/C2, parallel combination C = C1 + C2, energy U = 0.5*C*V^2, energy density u = 0.5*epsilon_0*E^2.",
            "notesOverview": "Capacitors can be interconnected in series (shared charge Q) or parallel (shared voltage V). Energy stored resides in the electrostatic field between plates.",
            "notesSections": [
                {
                    "heading": "Energy Stored and Redistribution Loss",
                    "paragraphs": [
                        "Electrostatic energy: U = (1/2)*C*V^2 = Q^2 / (2C) = (1/2)*Q*V.",
                        "Energy density in electric field: u = (1/2) * epsilon_0 * E^2 (J/m^3).",
                        "When two charged capacitors C1 (voltage V1) and C2 (voltage V2) are connected in parallel, common potential is V_c = (C1*V1 + C2*V2) / (C1 + C2).",
                        "Energy lost as heat and radiation during redistribution: Delta U = (C1 * C2 * (V1 - V2)^2) / (2 * (C1 + C2))."
                    ],
                    "keyTakeaways": [
                        "Series: Charge Q is identical on each capacitor; 1/C_eq = sum(1/C_i).",
                        "Parallel: Voltage V is identical across each capacitor; C_eq = sum(C_i).",
                        "Energy loss during redistribution is ALWAYS positive (heat generated in wires) unless initial voltages were identical."
                    ],
                    "examTips": ["The energy formula U = (1/2)*C*V^2 has factor 1/2 because average potential during charging is V/2."]
                }
            ],
            "misconceptions": ["Assuming energy is conserved when connecting two charged capacitors. Charge is conserved, but electrostatic energy is ALWAYS lost as heat in connecting wires."],
            "formulas": [
                {
                    "label": "Stored Electrostatic Energy",
                    "formula": "U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2 C} = \\frac{1}{2} Q V",
                    "description": "Energy stored in electrostatic field of capacitor of capacitance C charged to voltage V.",
                    "variables": [
                        { "symbol": "C", "meaning": "Capacitance", "unit": "F" },
                        { "symbol": "V", "meaning": "Potential Difference", "unit": "V" },
                        { "symbol": "Q", "meaning": "Stored Charge", "unit": "C" },
                        { "symbol": "U", "meaning": "Electrostatic Energy", "unit": "J" }
                    ]
                },
                {
                    "label": "Electrostatic Field Energy Density",
                    "formula": "u = \\frac{1}{2} \\varepsilon_0 E^2",
                    "description": "Energy stored per unit volume in electric field E in vacuum.",
                    "variables": [
                        { "symbol": "E", "meaning": "Electric Field Intensity", "unit": "V/m" },
                        { "symbol": "\\varepsilon_0", "meaning": "Permittivity of Free Space", "unit": "C^2/(N m^2)" },
                        { "symbol": "u", "meaning": "Energy Density", "unit": "J/m^3" }
                    ]
                }
            ]
        }
    ],

    "PHY-12-03": [
        {
            "title": "Electric Current, Drift Velocity & Origin of Resistivity",
            "desc": "Current I = dQ/dt, current density J = I/A, microscopic electron drift v_d = -e*E*tau/m, relation I = n*e*A*v_d, and Ohm's law.",
            "notesOverview": "Electric current is the net macroscopic charge flow across a cross-section. Under an electric field E, free electrons accelerate and collide with lattice ions, achieving a steady average drift velocity v_d on the order of 10^-4 m/s.",
            "notesSections": [
                {
                    "heading": "Microscopic Theory of Conduction",
                    "paragraphs": [
                        "Drift velocity: v_d = (e * E * tau) / m, where tau is average relaxation time between successive collisions.",
                        "Current: I = n * e * A * v_d, where n is electron number density.",
                        "Current density J = I / A = n * e * v_d = (n * e^2 * tau / m) * E = sigma * E (microscopic Ohm's law).",
                        "Resistivity rho = 1 / sigma = m / (n * e^2 * tau)."
                    ],
                    "keyTakeaways": [
                        "Although individual electron drift is sluggish (~mm/s), electromagnetic field signals propagate at near speed of light (~10^8 m/s).",
                        "Current I is a scalar quantity, but current density J is a vector pointing along electric field E."
                    ],
                    "examTips": ["Drift velocity is directly proportional to applied electric field E and potential difference V across a fixed wire length."]
                }
            ],
            "misconceptions": ["Assuming electrons travel at light speed through wires. Individual electron drift speed is fractions of a mm/s; it is the electric field disturbance that travels at near light speed."],
            "formulas": [
                {
                    "label": "Drift Velocity of Electrons",
                    "formula": "v_d = \\frac{e E \\tau}{m} = \\frac{e V \\tau}{m L}",
                    "description": "Steady average drift speed acquired by conduction electrons in conductor of length L under voltage V.",
                    "variables": [
                        { "symbol": "e", "meaning": "Elementary Electron Charge", "unit": "C" },
                        { "symbol": "\\tau", "meaning": "Relaxation Time", "unit": "s" },
                        { "symbol": "m", "meaning": "Electron Mass", "unit": "kg" },
                        { "symbol": "E", "meaning": "Electric Field Intensity", "unit": "V/m" },
                        { "symbol": "v_d", "meaning": "Drift Velocity", "unit": "m/s" }
                    ]
                },
                {
                    "label": "Current - Drift Velocity Relation",
                    "formula": "I = n e A v_d",
                    "description": "Macroscopic electric current expressed in terms of microscopic electron drift.",
                    "variables": [
                        { "symbol": "n", "meaning": "Conduction Electron Density", "unit": "m^-3" },
                        { "symbol": "e", "meaning": "Charge Quantum", "unit": "C" },
                        { "symbol": "A", "meaning": "Cross-Sectional Area", "unit": "m^2" },
                        { "symbol": "I", "meaning": "Electric Current", "unit": "A" }
                    ]
                },
                {
                    "label": "Microscopic Ohm’s Law",
                    "formula": "\\vec{J} = \\sigma \\vec{E} = \\frac{1}{\\rho} \\vec{E}",
                    "description": "Vector current density proportional to applied electric field with electrical conductivity sigma.",
                    "variables": [
                        { "symbol": "\\vec{J}", "meaning": "Current Density Vector", "unit": "A/m^2" },
                        { "symbol": "\\sigma", "meaning": "Electrical Conductivity", "unit": "S/m" },
                        { "symbol": "\\rho", "meaning": "Electrical Resistivity", "unit": "\\Omega m" },
                        { "symbol": "\\vec{E}", "meaning": "Electric Field", "unit": "V/m" }
                    ]
                }
            ]
        },
        {
            "title": "Temperature Dependence of Resistivity & Electric Power",
            "desc": "Temperature coefficient alpha, resistivity rho(T) = rho0*(1 + alpha*Delta T), Joule heating H = I^2*R*t, maximum power transfer theorem.",
            "notesOverview": "For metallic conductors, increasing temperature increases lattice ion vibrations, reducing relaxation time tau and raising resistivity (alpha > 0). For semiconductors, carrier density n increases exponentially, causing resistivity to drop sharply (alpha < 0).",
            "notesSections": [
                {
                    "heading": "Temperature Coefficient and Joule Heating",
                    "paragraphs": [
                        "Resistivity variation: rho(T) = rho0 * (1 + alpha * (T - T0)).",
                        "Nichrome and Manganin have exceptionally small alpha, making them ideal for standard resistance coils.",
                        "Electric power dissipated: P = V * I = I^2 * R = V^2 / R.",
                        "Maximum power transfer theorem: Maximum power is transferred from source of emf E and internal resistance r to external load R when R = r."
                    ],
                    "keyTakeaways": [
                        "Superconductors exhibit zero electrical resistivity below their critical transition temperature T_c.",
                        "In house wiring, appliances are connected in parallel so each operates at the full mains voltage independently."
                    ],
                    "examTips": ["Bulb ratings (e.g. 100W, 220V): Resistance R = V_rated^2 / P_rated is constant. Power consumed at another voltage V is P_consumed = V^2 / R."]
                }
            ],
            "misconceptions": ["Assuming higher wattage bulbs have higher resistance. Lower resistance draws more current at constant voltage, producing higher power output (P = V^2 / R)."],
            "formulas": [
                {
                    "label": "Temperature Dependence of Resistance",
                    "formula": "R(T) = R_0 [1 + \\alpha (T - T_0)]",
                    "description": "Variation of electrical resistance with temperature for material with temperature coefficient alpha.",
                    "variables": [
                        { "symbol": "R_0", "meaning": "Resistance at Reference Temp T0", "unit": "\\Omega" },
                        { "symbol": "\\alpha", "meaning": "Temperature Coefficient", "unit": "K^-1" },
                        { "symbol": "R(T)", "meaning": "Resistance at Temperature T", "unit": "\\Omega" }
                    ]
                },
                {
                    "label": "Joule Heating Power",
                    "formula": "P = V I = I^2 R = \\frac{V^2}{R}",
                    "description": "Rate of electrical energy dissipated as thermal heat in a resistive element.",
                    "variables": [
                        { "symbol": "V", "meaning": "Voltage Drop", "unit": "V" },
                        { "symbol": "I", "meaning": "Current", "unit": "A" },
                        { "symbol": "R", "meaning": "Resistance", "unit": "\\Omega" },
                        { "symbol": "P", "meaning": "Dissipated Power", "unit": "W" }
                    ]
                }
            ]
        },
        {
            "title": "Cells, EMF, Internal Resistance & Grouping of Cells",
            "desc": "Electromotive force E, terminal voltage V = E - I*r, series and parallel combination of cells, condition for maximum current.",
            "notesOverview": "A chemical cell maintains potential difference across a circuit. EMF E is the open-circuit potential difference. When delivering current I, terminal voltage drops due to internal resistance: V = E - I*r.",
            "notesSections": [
                {
                    "heading": "Cell Dynamics and Grouping",
                    "paragraphs": [
                        "Discharging cell: V = E - I*r (terminal voltage < EMF). Charging cell: V = E + I*r (terminal voltage > EMF).",
                        "Series grouping of n identical cells: E_eq = n*E, r_eq = n*r. Current I = (n*E) / (R + n*r).",
                        "Parallel grouping of m identical cells: E_eq = E, r_eq = r/m. Current I = E / (R + r/m)."
                    ],
                    "keyTakeaways": [
                        "Series grouping is advantageous when external resistance R is much larger than internal resistance r (R >> r).",
                        "Parallel grouping is advantageous when external resistance R is much smaller than internal resistance r (R << r)."
                    ],
                    "examTips": ["Short-circuit current of a cell is I_max = E / r (when external resistance R = 0)."]
                }
            ],
            "misconceptions": ["Believing terminal voltage is always less than EMF. During charging, external current enters the positive terminal, making V = E + Ir > E."],
            "formulas": [
                {
                    "label": "Terminal Voltage of Discharging Cell",
                    "formula": "V = E - I r",
                    "description": "Closed-circuit terminal voltage of cell of emf E and internal resistance r supplying current I.",
                    "variables": [
                        { "symbol": "E", "meaning": "Electromotive Force", "unit": "V" },
                        { "symbol": "I", "meaning": "Load Current Delivered", "unit": "A" },
                        { "symbol": "r", "meaning": "Internal Resistance", "unit": "\\Omega" },
                        { "symbol": "V", "meaning": "Terminal Potential Difference", "unit": "V" }
                    ]
                },
                {
                    "label": "Parallel Combination of Unequal Cells",
                    "formula": "E_{\\text{eq}} = \\frac{\\frac{E_1}{r_1} + \\frac{E_2}{r_2}}{\\frac{1}{r_1} + \\frac{1}{r_2}}, \\quad \\frac{1}{r_{\\text{eq}}} = \\frac{1}{r_1} + \\frac{1}{r_2}",
                    "description": "Equivalent emf and internal resistance for two cells connected in parallel.",
                    "variables": [
                        { "symbol": "E_1, E_2", "meaning": "EMFs of Cells", "unit": "V" },
                        { "symbol": "r_1, r_2", "meaning": "Internal Resistances", "unit": "\\Omega" },
                        { "symbol": "E_{\\text{eq}}", "meaning": "Equivalent EMF", "unit": "V" }
                    ]
                }
            ]
        },
        {
            "title": "Kirchhoff’s Rules & Complex DC Circuit Mesh Analysis",
            "desc": "Kirchhoff's Current Law (KCL / junction rule, charge conservation), Kirchhoff's Voltage Law (KVL / loop rule, energy conservation), multi-loop circuit networks.",
            "simulationId": "dc_circuit_mesh",
            "notesOverview": "Kirchhoff's rules enable systematic solution of complex electrical networks beyond simple series-parallel reductions, expressing fundamental conservation of electric charge (KCL) and energy (KVL).",
            "notesSections": [
                {
                    "heading": "The Two Fundamental Circuit Laws",
                    "paragraphs": [
                        "Kirchhoff's Current Law (Junction Rule): sum(I_in) = sum(I_out) at any circuit node (conservation of charge).",
                        "Kirchhoff's Voltage Law (Loop Rule): In any closed loop, the algebraic sum of potential changes is zero: sum(Delta V) = 0 or sum(E) = sum(I*R) (conservation of energy).",
                        "Sign convention for loops: Potential decreases across a resistor along current flow (-I*R); potential increases from negative to positive battery terminal (+E)."
                    ],
                    "keyTakeaways": [
                        "KCL is valid at any instant, even for time-varying AC circuits.",
                        "For a network with N nodes and B branches, there are (N - 1) independent KCL equations and (B - N + 1) independent KVL mesh equations."
                    ],
                    "examTips": ["Always label branch current directions explicitly with arrows before writing KVL loop equations."]
                }
            ],
            "misconceptions": ["Mixing up sign conventions in loop rules. Be consistent: tracing along current gives -IR; tracing against current gives +IR."],
            "formulas": [
                {
                    "label": "Kirchhoff’s Current Law (Junction Rule)",
                    "formula": "\\sum I = 0 \\implies \\sum I_{\\text{in}} = \\sum I_{\\text{out}}",
                    "description": "Algebraic sum of currents meeting at any electrical node is zero (charge conservation).",
                    "variables": [
                        { "symbol": "I", "meaning": "Branch Currents", "unit": "A" }
                    ]
                },
                {
                    "label": "Kirchhoff’s Voltage Law (Loop Rule)",
                    "formula": "\\sum \\Delta V = 0 \\implies \\sum E = \\sum I R",
                    "description": "Algebraic sum of potential differences around any closed circuit loop is zero (energy conservation).",
                    "variables": [
                        { "symbol": "E", "meaning": "Source EMFs", "unit": "V" },
                        { "symbol": "I R", "meaning": "Resistive Potential Drops", "unit": "V" }
                    ]
                }
            ]
        },
        {
            "title": "The Wheatstone Bridge & Balanced Null Condition",
            "desc": "Bridge configuration with 4 resistors P, Q, R, S, galvanometer null condition P/Q = R/S, high sensitivity conditions.",
            "notesOverview": "The Wheatstone bridge is a precision null-detection circuit used to measure unknown electrical resistances with high accuracy without drawing current from the circuit at balance.",
            "notesSections": [
                {
                    "heading": "Wheatstone Bridge Balance Condition",
                    "paragraphs": [
                        "When potentials at galvanometer branch nodes B and D are equal (V_B = V_D), zero current flows through the galvanometer: I_g = 0 (null deflection).",
                        "Balanced bridge condition: P / Q = R / S -> Unknown resistance S = R * (Q / P).",
                        "Sensitivity of Wheatstone bridge is highest when all four arms have roughly equal resistance values: P approx Q approx R approx S."
                    ],
                    "keyTakeaways": [
                        "At balance, the galvanometer and battery can be interchanged without disturbing the null condition.",
                        "Null method eliminates errors due to battery internal resistance or galvanometer resistance."
                    ],
                    "examTips": ["When solving bridge problems, always check first if the bridge is balanced (P/Q = R/S) to eliminate the middle resistor immediately!"]
                }
            ],
            "misconceptions": ["Assuming the galvanometer must be connected between specific opposite nodes. Swapping battery and galvanometer positions preserves the balance condition."],
            "formulas": [
                {
                    "label": "Balanced Wheatstone Bridge Condition",
                    "formula": "\\frac{P}{Q} = \\frac{R}{S} \\implies I_g = 0",
                    "description": "Condition under which galvanometer current vanishes and bridge is balanced.",
                    "variables": [
                        { "symbol": "P, Q", "meaning": "Ratio Arm Resistances", "unit": "\\Omega" },
                        { "symbol": "R", "meaning": "Standard Known Resistance", "unit": "\\Omega" },
                        { "symbol": "S", "meaning": "Unknown Resistance", "unit": "\\Omega" }
                    ]
                }
            ]
        }
    ]
}

print("Physics Class 12 part 1 loaded.")
