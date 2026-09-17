# tools/data/physics_topics_part2.py
# Authentic NCERT Physics curriculum (PHY-11-08 to PHY-11-14 & PHY-12-01 to PHY-12-07)

PHYSICS_PART2 = {
    "PHY-11-08": [
        {
            "title": "Elastic Behaviour of Solids & Stress-Strain Concepts",
            "desc": "Intermolecular forces, deforming force, restoring force, definitions of stress and strain, tensile, compressive, shearing, and hydraulic stress.",
            "notesOverview": "Elasticity is the property of a body to regain its original shape and size after the removal of deforming forces. Perfect elasticity and plasticity represent boundary states.",
            "notesSections": [
                {
                    "heading": "Types of Stress and Strain",
                    "paragraphs": [
                        "Stress = Restoring Force / Area (N/m^2 or Pa). Longitudinal stress produces fractional change in length (Delta L / L).",
                        "Shearing stress produces angular deformation theta. Hydraulic stress produces fractional change in volume (Delta V / V)."
                    ],
                    "keyTakeaways": [
                        "Stress is a second-order tensor, though treated as scalar magnitude in 1D.",
                        "Strain is dimensionless and unitless."
                    ],
                    "examTips": ["Breaking stress depends solely on material nature, independent of wire length or cross-sectional area."]
                }
            ],
            "misconceptions": ["Confusing stress with pressure: pressure is strictly compressive and external, whereas stress can be tensile or shearing and is internal restoring force."],
            "formulas": [
                {
                    "label": "Tensile Stress Definition",
                    "formula": "\\sigma = \\frac{F}{A}",
                    "description": "Internal restoring force per unit cross-sectional area.",
                    "variables": [
                        { "symbol": "F", "meaning": "Internal Restoring Force", "unit": "N" },
                        { "symbol": "A", "meaning": "Cross-Sectional Area", "unit": "m^2" },
                        { "symbol": "\\sigma", "meaning": "Stress", "unit": "N/m^2" }
                    ]
                },
                {
                    "label": "Longitudinal Strain",
                    "formula": "\\epsilon = \\frac{\\Delta L}{L}",
                    "description": "Fractional elongation of wire of initial length L.",
                    "variables": [
                        { "symbol": "\\Delta L", "meaning": "Change in Length", "unit": "m" },
                        { "symbol": "L", "meaning": "Original Length", "unit": "m" },
                        { "symbol": "\\epsilon", "meaning": "Longitudinal Strain", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Hooke’s Law, Stress-Strain Curve & Elastic Moduli",
            "desc": "Proportional limit, yield point, ultimate tensile strength, fracture point, ductile vs brittle materials, and Young's modulus Y.",
            "notesOverview": "Hooke’s law states that for small deformations within the proportional limit, stress is directly proportional to strain: Stress = Modulus * Strain.",
            "notesSections": [
                {
                    "heading": "Stress-Strain Curve Analysis",
                    "paragraphs": [
                        "Region OA: Linear Hooke's law regime. Point A is proportional limit.",
                        "Point B is elastic limit (yield point). Beyond B, permanent plastic set occurs.",
                        "Point D is ultimate tensile strength. Point E is fracture point. Large DE indicates ductility; small DE indicates brittleness."
                    ],
                    "keyTakeaways": [
                        "Steel is more elastic than rubber because it requires much greater stress for the same strain (Y_steel > Y_rubber).",
                        "Young’s modulus Y = (F/A) / (Delta L / L) = (F * L) / (A * Delta L)."
                    ],
                    "examTips": ["The slope of the linear stress-strain curve in the elastic region gives Young's Modulus."]
                }
            ],
            "misconceptions": ["Assuming rubber is more elastic than steel because it stretches more. Elasticity measures resistance to deformation; steel has much higher modulus."],
            "formulas": [
                {
                    "label": "Young’s Modulus",
                    "formula": "Y = \\frac{\\sigma}{\\epsilon} = \\frac{F L}{A \\Delta L}",
                    "description": "Ratio of longitudinal tensile stress to longitudinal strain within proportional limit.",
                    "variables": [
                        { "symbol": "F", "meaning": "Applied Load", "unit": "N" },
                        { "symbol": "L", "meaning": "Wire Length", "unit": "m" },
                        { "symbol": "A", "meaning": "Cross-Section Area", "unit": "m^2" },
                        { "symbol": "\\Delta L", "meaning": "Elongation", "unit": "m" },
                        { "symbol": "Y", "meaning": "Young's Modulus", "unit": "Pa" }
                    ]
                },
                {
                    "label": "Elastic Potential Energy Density",
                    "formula": "u = \\frac{U}{V} = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain} = \\frac{1}{2} Y \\epsilon^2",
                    "description": "Strain energy stored per unit volume of deformed elastic material.",
                    "variables": [
                        { "symbol": "Y", "meaning": "Young's Modulus", "unit": "Pa" },
                        { "symbol": "\\epsilon", "meaning": "Strain", "unit": "-" },
                        { "symbol": "u", "meaning": "Energy Density", "unit": "J/m^3" }
                    ]
                }
            ]
        },
        {
            "title": "Shear Modulus, Bulk Modulus & Elastic Applications",
            "desc": "Shear modulus G, Bulk modulus B, compressibility K = 1/B, Poisson’s ratio, structural design of beams and crane ropes.",
            "notesOverview": "Bulk modulus governs volumetric compressibility of solids, liquids, and gases. Shear modulus governs torsional and angular distortion in solids.",
            "notesSections": [
                {
                    "heading": "Bulk and Shear Formulations",
                    "paragraphs": [
                        "Bulk modulus B = -Delta P / (Delta V / V). Negative sign indicates volume decreases with increasing pressure.",
                        "Compressibility K = 1 / B. Gases are highly compressible; solids are nearly incompressible.",
                        "Poisson's ratio sigma = Lateral Strain / Longitudinal Strain (theoretical range -1 to 0.5, practical range 0 to 0.5)."
                    ],
                    "keyTakeaways": [
                        "Liquids and gases have zero shear modulus (they cannot sustain static shearing stress).",
                        "I-shaped girders minimize bending sag while minimizing steel mass in structural engineering."
                    ],
                    "examTips": ["In crane cables, multiple braided thin wires provide far greater flexibility and strength than a single solid thick rod."]
                }
            ],
            "misconceptions": ["Assuming fluids possess a shear modulus. Ideal fluids have zero shear rigidity."],
            "formulas": [
                {
                    "label": "Bulk Modulus",
                    "formula": "B = -\\frac{\\Delta P}{\\frac{\\Delta V}{V}} = -V \\frac{dP}{dV}",
                    "description": "Volumetric resistance to uniform hydrostatic compression.",
                    "variables": [
                        { "symbol": "\\Delta P", "meaning": "Hydrostatic Pressure Change", "unit": "Pa" },
                        { "symbol": "V", "meaning": "Initial Volume", "unit": "m^3" },
                        { "symbol": "\\Delta V", "meaning": "Volume Change", "unit": "m^3" },
                        { "symbol": "B", "meaning": "Bulk Modulus", "unit": "Pa" }
                    ]
                },
                {
                    "label": "Bending Sag of a Beam",
                    "formula": "\\delta = \\frac{W L^3}{4 Y b d^3}",
                    "description": "Central vertical depression sag of rectangular cross-section beam supported at both ends.",
                    "variables": [
                        { "symbol": "W", "meaning": "Central Load", "unit": "N" },
                        { "symbol": "L", "meaning": "Span Length", "unit": "m" },
                        { "symbol": "b", "meaning": "Breadth", "unit": "m" },
                        { "symbol": "d", "meaning": "Depth", "unit": "m" },
                        { "symbol": "\\delta", "meaning": "Central Sag", "unit": "m" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-09": [
        {
            "title": "Fluid Pressure, Pascal’s Law & Hydraulic Machines",
            "desc": "Fluid pressure P = dF/dA, hydrostatic pressure variation P = P0 + rho*g*h, Pascal's principle, and hydraulic lift multiplication.",
            "notesOverview": "Liquids exert normal pressure in all directions. Pascal’s law states that pressure applied to an enclosed fluid is transmitted undiminished to every portion of fluid and container walls.",
            "notesSections": [
                {
                    "heading": "Hydrostatic Pressure and Pascal's Principle",
                    "paragraphs": [
                        "Gauge pressure P_g = rho * g * h; Absolute pressure P = P_atm + rho * g * h.",
                        "Hydraulic lift operates by transmitting pressure: F1 / A1 = F2 / A2 -> F2 = F1 * (A2 / A1), enabling small forces to hoist heavy vehicles."
                    ],
                    "keyTakeaways": [
                        "Pressure at a given depth is identical along any horizontal isobaric plane.",
                        "Hydrostatic paradox: Pressure depends solely on liquid depth, not container geometry or total fluid weight."
                    ],
                    "examTips": ["Remember to add atmospheric pressure (P0 = 1.013 x 10^5 Pa) when calculating total absolute pressure."]
                }
            ],
            "misconceptions": ["Assuming container shape affects bottom pressure. Pressure depends solely on vertical depth h and fluid density rho."],
            "formulas": [
                {
                    "label": "Hydrostatic Pressure at Depth",
                    "formula": "P = P_0 + \\rho g h",
                    "description": "Absolute pressure at vertical depth h beneath free fluid surface.",
                    "variables": [
                        { "symbol": "P_0", "meaning": "Atmospheric Surface Pressure", "unit": "Pa" },
                        { "symbol": "\\rho", "meaning": "Liquid Density", "unit": "kg/m^3" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "h", "meaning": "Vertical Depth", "unit": "m" }
                    ]
                },
                {
                    "label": "Pascal’s Hydraulic Lift Relation",
                    "formula": "F_2 = F_1 \\left(\\frac{A_2}{A_1}\\right)",
                    "description": "Force multiplication across coupled hydraulic pistons of unequal areas.",
                    "variables": [
                        { "symbol": "F_1", "meaning": "Input Effort Force", "unit": "N" },
                        { "symbol": "A_1, A_2", "meaning": "Piston Surface Areas", "unit": "m^2" },
                        { "symbol": "F_2", "meaning": "Lifted Load Force", "unit": "N" }
                    ]
                }
            ]
        },
        {
            "title": "Streamline Flow, Equation of Continuity & Bernoulli’s Principle",
            "desc": "Steady laminar vs turbulent flow, Reynolds number, continuity equation A1*v1 = A2*v2, Bernoulli’s theorem and Venturimeter.",
            "notesOverview": "Bernoulli’s principle expresses conservation of mechanical energy in streamline flow of an incompressible, non-viscous fluid.",
            "notesSections": [
                {
                    "heading": "Continuity and Bernoulli Equations",
                    "paragraphs": [
                        "Equation of continuity: A1 * v1 = A2 * v2 = constant (mass conservation). Where cross-section narrows, fluid velocity accelerates.",
                        "Bernoulli’s equation: P + 0.5*rho*v^2 + rho*g*h = constant. Regions of higher fluid speed experience lower static pressure (dynamic lift in aerofoils, Magnus effect in spinning balls)."
                    ],
                    "keyTakeaways": [
                        "Torricelli’s law of efflux: v = sqrt(2*g*h) matching free fall speed from hole depth h.",
                        "Venturi tube uses pressure drop at throat to measure pipe flow rate."
                    ],
                    "examTips": ["Bernoulli’s theorem applies strictly to streamline, steady, non-viscous, incompressible flow."]
                }
            ],
            "misconceptions": ["Believing higher fluid speed creates higher pressure. Bernoulli proves higher flow speed REDUCES static fluid pressure."],
            "formulas": [
                {
                    "label": "Equation of Continuity",
                    "formula": "A_1 v_1 = A_2 v_2 = \\text{constant}",
                    "description": "Conservation of volume flow rate for incompressible fluid across varying pipe cross-sections.",
                    "variables": [
                        { "symbol": "A_1, A_2", "meaning": "Cross-Sectional Areas", "unit": "m^2" },
                        { "symbol": "v_1, v_2", "meaning": "Flow Velocities", "unit": "m/s" }
                    ]
                },
                {
                    "label": "Bernoulli’s Master Equation",
                    "formula": "P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{constant}",
                    "description": "Conservation of energy per unit volume in streamline ideal fluid flow.",
                    "variables": [
                        { "symbol": "P", "meaning": "Static Pressure", "unit": "Pa" },
                        { "symbol": "\\rho", "meaning": "Fluid Density", "unit": "kg/m^3" },
                        { "symbol": "v", "meaning": "Flow Speed", "unit": "m/s" },
                        { "symbol": "h", "meaning": "Elevation Altitude", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Viscosity, Stokes’ Law & Terminal Velocity",
            "desc": "Coefficient of viscosity eta, velocity gradient dv/dx, Stokes’ drag law F = 6*pi*eta*r*v, and terminal settling speed.",
            "notesOverview": "Viscosity is internal fluid friction opposing relative motion between adjacent fluid layers. A falling spherical body achieves constant terminal speed when viscous drag and buoyancy balance gravity.",
            "notesSections": [
                {
                    "heading": "Stokes' Law and Terminal Velocity Balance",
                    "paragraphs": [
                        "Viscous drag on sphere: F_v = 6 * pi * eta * r * v.",
                        "Equilibrium condition: Gravity = Buoyancy + Viscous Drag -> (4/3)*pi*r^3 * rho * g = (4/3)*pi*r^3 * sigma * g + 6*pi*eta*r*v_t.",
                        "Terminal velocity: v_t = (2/9) * (r^2 * (rho - sigma) * g) / eta, proportional to the square of sphere radius r^2."
                    ],
                    "keyTakeaways": [
                        "Larger raindrops fall much faster than cloud mist droplets due to r^2 scaling.",
                        "Viscosity of liquids decreases with temperature, whereas viscosity of gases increases with temperature."
                    ],
                    "examTips": ["Remember that terminal velocity depends on density difference (rho - sigma). If object is less dense than fluid, terminal speed is upward."]
                }
            ],
            "misconceptions": ["Assuming viscosity of gases decreases with temperature like liquids. Gas viscosity INCREASES with temperature due to increased momentum transfer."],
            "formulas": [
                {
                    "label": "Stokes’ Drag Law",
                    "formula": "F_v = 6 \\pi \\eta r v",
                    "description": "Viscous resistive drag force on sphere of radius r moving at speed v in fluid of viscosity eta.",
                    "variables": [
                        { "symbol": "\\eta", "meaning": "Dynamic Viscosity", "unit": "Pa s" },
                        { "symbol": "r", "meaning": "Sphere Radius", "unit": "m" },
                        { "symbol": "v", "meaning": "Velocity", "unit": "m/s" },
                        { "symbol": "F_v", "meaning": "Viscous Drag Force", "unit": "N" }
                    ]
                },
                {
                    "label": "Terminal Settling Velocity",
                    "formula": "v_t = \\frac{2 r^2 (\\rho - \\sigma) g}{9 \\eta}",
                    "description": "Steady terminal velocity achieved when net downward driving force vanishes.",
                    "variables": [
                        { "symbol": "r", "meaning": "Droplet/Sphere Radius", "unit": "m" },
                        { "symbol": "\\rho", "meaning": "Sphere Density", "unit": "kg/m^3" },
                        { "symbol": "\\sigma", "meaning": "Fluid Medium Density", "unit": "kg/m^3" },
                        { "symbol": "\\eta", "meaning": "Fluid Viscosity", "unit": "Pa s" },
                        { "symbol": "v_t", "meaning": "Terminal Velocity", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Surface Tension, Surface Energy & Capillary Ascent",
            "desc": "Intermolecular cohesive forces, surface energy W = S*Delta A, excess pressure across curved surfaces, angle of contact, and capillary rise.",
            "notesOverview": "Molecules on a liquid surface experience net inward cohesive pull, causing the surface to behave like a stretched elastic membrane minimizing surface area.",
            "notesSections": [
                {
                    "heading": "Excess Pressure and Capillarity",
                    "paragraphs": [
                        "Excess pressure inside liquid drop: Delta P = 2*S / R. Inside soap bubble (two surfaces): Delta P = 4*S / R.",
                        "Capillary rise in tube of radius r: h = (2*S*cos theta) / (r * rho * g), where theta is contact angle."
                    ],
                    "keyTakeaways": [
                        "For water in glass, contact angle theta < 90 degrees (meniscus concave, liquid ascends).",
                        "For mercury in glass, contact angle theta > 90 degrees (meniscus convex, liquid depresses)."
                    ],
                    "examTips": ["Notice soap bubbles have TWO free surfaces, doubling the excess pressure compared to a liquid drop."]
                }
            ],
            "misconceptions": ["Using 2S/R for a soap bubble: soap bubbles have two air-liquid interfaces, so excess pressure is 4S/R."],
            "formulas": [
                {
                    "label": "Excess Pressure in Soap Bubble",
                    "formula": "\\Delta P = \\frac{4 S}{R}",
                    "description": "Internal excess pressure in soap bubble of radius R having two air interfaces.",
                    "variables": [
                        { "symbol": "S", "meaning": "Surface Tension", "unit": "N/m" },
                        { "symbol": "R", "meaning": "Bubble Radius", "unit": "m" },
                        { "symbol": "\\Delta P", "meaning": "Excess Pressure", "unit": "Pa" }
                    ]
                },
                {
                    "label": "Capillary Ascent Formula",
                    "formula": "h = \\frac{2 S \\cos\\theta}{r \\rho g}",
                    "description": "Vertical equilibrium height of liquid column in narrow capillary tube of radius r.",
                    "variables": [
                        { "symbol": "S", "meaning": "Surface Tension", "unit": "N/m" },
                        { "symbol": "\\theta", "meaning": "Contact Angle", "unit": "rad" },
                        { "symbol": "r", "meaning": "Capillary Tube Radius", "unit": "m" },
                        { "symbol": "\\rho", "meaning": "Liquid Density", "unit": "kg/m^3" },
                        { "symbol": "h", "meaning": "Capillary Rise Height", "unit": "m" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-10": [
        {
            "title": "Temperature, Thermal Expansion & Thermometry",
            "desc": "Thermal equilibrium, Celsius/Fahrenheit/Kelvin scales, linear expansion alpha, superficial expansion beta, volume expansion gamma.",
            "notesOverview": "Temperature is a macroscopic measure of average molecular kinetic energy. Most substances expand upon heating.",
            "notesSections": [
                {
                    "heading": "Relations Among Expansion Coefficients",
                    "paragraphs": [
                        "Linear expansion: Delta L = L0 * alpha * Delta T.",
                        "Area expansion: Delta A = A0 * beta * Delta T. Volume expansion: Delta V = V0 * gamma * Delta T.",
                        "For isotropic solids: alpha : beta : gamma = 1 : 2 : 3 (beta = 2*alpha, gamma = 3*alpha)."
                    ],
                    "keyTakeaways": [
                        "Anomalous expansion of water: water contracts between 0 and 4 deg C, achieving maximum density at 4 deg C (preserving aquatic life).",
                        "Thermal stress in clamped rods: sigma = Y * alpha * Delta T."
                    ],
                    "examTips": ["A hole in a heated plate expands exactly as if it were filled with the solid material."]
                }
            ],
            "misconceptions": ["Believing holes in metal sheets contract when heated. Thermal expansion scales all dimensions outwards, expanding holes."],
            "formulas": [
                {
                    "label": "Linear Thermal Expansion",
                    "formula": "\\Delta L = L_0 \\alpha \\Delta T",
                    "description": "Change in length of solid rod of initial length L0 under temperature change Delta T.",
                    "variables": [
                        { "symbol": "L_0", "meaning": "Initial Length", "unit": "m" },
                        { "symbol": "\\alpha", "meaning": "Coefficient of Linear Expansion", "unit": "K^-1" },
                        { "symbol": "\\Delta T", "meaning": "Temperature Change", "unit": "K" },
                        { "symbol": "\\Delta L", "meaning": "Elongation", "unit": "m" }
                    ]
                },
                {
                    "label": "Thermal Stress in Rigidly Clamped Rod",
                    "formula": "\\sigma = Y \\alpha \\Delta T",
                    "description": "Mechanical compressive stress induced when thermal expansion is prevented by rigid supports.",
                    "variables": [
                        { "symbol": "Y", "meaning": "Young's Modulus", "unit": "Pa" },
                        { "symbol": "\\alpha", "meaning": "Linear Expansion Coefficient", "unit": "K^-1" },
                        { "symbol": "\\sigma", "meaning": "Induced Thermal Stress", "unit": "Pa" }
                    ]
                }
            ]
        },
        {
            "title": "Specific Heat Capacity, Calorimetry & Latent Heat",
            "desc": "Heat capacity, molar heat capacity, water equivalent, principle of calorimetry, latent heat of fusion and vaporisation.",
            "notesOverview": "Heat absorbed or evolved during temperature change: Q = m*c*Delta T. During a phase change, temperature remains constant: Q = m*L.",
            "notesSections": [
                {
                    "heading": "Calorimetry Principle",
                    "paragraphs": [
                        "Heat gained by colder bodies equals heat lost by hotter bodies in an insulated calorimeter.",
                        "Latent heat of fusion for ice: L_f = 3.33 x 10^5 J/kg (80 cal/g). Latent heat of vaporisation for water: L_v = 2.26 x 10^6 J/kg (540 cal/g)."
                    ],
                    "keyTakeaways": [
                        "Steam at 100 deg C causes far more severe burns than water at 100 deg C due to release of latent heat of vaporisation.",
                        "Water has an exceptionally high specific heat (4186 J/(kg K)), moderating coastal climates."
                    ],
                    "examTips": ["Always check whether sufficient heat exists to melt/vaporize all material when solving mixture equilibrium problems."]
                }
            ],
            "misconceptions": ["Assuming temperature changes during melting or boiling. Temperature stays constant during pure phase changes."],
            "formulas": [
                {
                    "label": "Sensible Heat Equation",
                    "formula": "Q = m c \\Delta T",
                    "description": "Thermal energy required to raise temperature of mass m with specific heat capacity c.",
                    "variables": [
                        { "symbol": "m", "meaning": "Mass", "unit": "kg" },
                        { "symbol": "c", "meaning": "Specific Heat Capacity", "unit": "J/(kg K)" },
                        { "symbol": "\\Delta T", "meaning": "Temperature Rise", "unit": "K" },
                        { "symbol": "Q", "meaning": "Heat Energy", "unit": "J" }
                    ]
                },
                {
                    "label": "Latent Heat of Phase Change",
                    "formula": "Q = m L",
                    "description": "Thermal energy absorbed or released during isothermal phase transition.",
                    "variables": [
                        { "symbol": "m", "meaning": "Mass Changing Phase", "unit": "kg" },
                        { "symbol": "L", "meaning": "Specific Latent Heat", "unit": "J/kg" },
                        { "symbol": "Q", "meaning": "Latent Heat Transferred", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "Heat Transfer: Conduction, Convection & Radiation Laws",
            "desc": "Thermal conductivity k, Fourier rate equation, black body radiation, Stefan-Boltzmann law, Wien's displacement law, and Newton's law of cooling.",
            "notesOverview": "Heat transfers via conduction (microscopic collisions in solids), convection (bulk fluid movement), and radiation (electromagnetic waves without medium).",
            "notesSections": [
                {
                    "heading": "Radiation and Cooling Laws",
                    "paragraphs": [
                        "Fourier conduction: H = dQ/dt = k*A*(T1 - T2) / L.",
                        "Stefan-Boltzmann Law: Total radiant power per unit area of blackbody: E = sigma * T^4 (sigma = 5.67 x 10^-8 W/(m^2 K^4)).",
                        "Wien's Displacement Law: lambda_max * T = b (b = 2.898 x 10^-3 m K). Hotter bodies emit radiation peaked at shorter wavelengths.",
                        "Newton's Law of Cooling: -dT/dt = K*(T - T0) for small temperature differences with surroundings."
                    ],
                    "keyTakeaways": [
                        "Thermal resistance of slab: R_th = L / (k * A), behaving in series and parallel exactly like electrical resistors.",
                        "Newton's law of cooling is an approximation of Stefan's law valid only for small excess temperatures (Delta T < 30 deg C)."
                    ],
                    "examTips": ["Doubling absolute temperature of a black body increases its radiated emission by a factor of 2^4 = 16!"]
                }
            ],
            "misconceptions": ["Applying Newton's law of cooling to very large temperature differences where Stefan's T^4 radiation dominates."],
            "formulas": [
                {
                    "label": "Stefan-Boltzmann Law",
                    "formula": "P = e \\sigma A T^4",
                    "description": "Total radiant power emitted by body of emissivity e and area A at absolute temperature T.",
                    "variables": [
                        { "symbol": "e", "meaning": "Emissivity (0 <= e <= 1)", "unit": "-" },
                        { "symbol": "\\sigma", "meaning": "Stefan Constant (5.67 x 10^-8)", "unit": "W/(m^2 K^4)" },
                        { "symbol": "A", "meaning": "Surface Area", "unit": "m^2" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                        { "symbol": "P", "meaning": "Radiated Power", "unit": "W" }
                    ]
                },
                {
                    "label": "Wien’s Displacement Law",
                    "formula": "\\lambda_{\\max} T = b = 2.898 \\times 10^{-3} \\text{ m K}",
                    "description": "Inverse relationship between peak emission wavelength and blackbody absolute temperature.",
                    "variables": [
                        { "symbol": "\\lambda_{\\max}", "meaning": "Peak Emission Wavelength", "unit": "m" },
                        { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                        { "symbol": "b", "meaning": "Wien's Constant", "unit": "m K" }
                    ]
                }
            ]
        }
    ]
}
