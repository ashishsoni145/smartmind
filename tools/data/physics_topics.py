# tools/data/physics_topics.py
# Authentic NCERT Physics curriculum specification (Class 11 & 12, 28 Chapters)

PHYSICS_TOPICS = {
    # ----------------------------------------------------
    # CLASS 11 PHYSICS (14 Chapters)
    # ----------------------------------------------------
    "PHY-11-01": [
        {
            "title": "The International System of Units (SI) & Base Standards",
            "desc": "Seven fundamental SI base units, supplementary radian and steradian units, standard metric prefixes and operational conventions.",
            "notesOverview": "The International System of Units (SI) is an absolute, rationalized, coherent decimal system adopted internationally in 1971 by the 14th General Conference on Weights and Measures (CGPM).",
            "notesSections": [
                {
                    "heading": "Seven Fundamental Base Quantities",
                    "paragraphs": [
                        "The SI system is built upon 7 dimensional base pillars: Length (metre, m), Mass (kilogram, kg), Time (second, s), Electric Current (ampere, A), Thermodynamic Temperature (kelvin, K), Amount of Substance (mole, mol), and Luminous Intensity (candela, cd).",
                        "All mechanical, thermodynamic, and electromagnetic quantities are derived systematically from these foundational seven dimensional powers."
                    ],
                    "keyTakeaways": [
                        "Base units are defined by invariant fundamental physical constants.",
                        "Plane angle (radian) and solid angle (steradian) are supplementary dimensionless units."
                    ],
                    "examTips": [
                        "Symbols for units named after scientists take capital letters (N, J, Pa), while full names are written in lowercase (newton, joule, pascal)."
                    ]
                }
            ],
            "misconceptions": ["Believing radian and steradian possess physical dimensions: they are dimensionless supplementary units [M^0 L^0 T^0]."],
            "formulas": [
                {
                    "label": "Plane Angle Definition",
                    "formula": "\\theta = \\frac{s}{r}",
                    "description": "Angle subtended by arc length s at radius r in radians.",
                    "variables": [
                        { "symbol": "s", "meaning": "Arc Length", "unit": "m" },
                        { "symbol": "r", "meaning": "Radius", "unit": "m" },
                        { "symbol": "\\theta", "meaning": "Plane Angle", "unit": "rad" }
                    ]
                }
            ]
        },
        {
            "title": "Measurement of Length, Parallax Method & Astronomical Scales",
            "desc": "Triangulation, parallax method for stellar distances, molecular layer estimations, and microscopic measuring instruments.",
            "notesOverview": "Direct measurements are limited to terrestrial scales (verniers, micrometers). For planetary distances, the angular parallax method is required.",
            "notesSections": [
                {
                    "heading": "Parallax Principle for Celestial Distances",
                    "paragraphs": [
                        "Parallax is the apparent shift in the position of an object against a distant background when viewed from two different locations.",
                        "Distance D = b / theta, where b is baseline separation and theta is parallax angle in radians."
                    ],
                    "keyTakeaways": [
                        "1 arcminute = 2.91 x 10^-4 rad; 1 arcsecond = 4.85 x 10^-6 rad.",
                        "1 light year = 9.46 x 10^15 m; 1 parsec = 3.08 x 10^16 m."
                    ],
                    "examTips": ["Always convert angles to radians before applying D = b / theta."]
                }
            ],
            "misconceptions": ["Directly plugging angles in degrees into parallax equations without radian conversion."],
            "formulas": [
                {
                    "label": "Parallax Distance Formula",
                    "formula": "D = \\frac{b}{\\theta}",
                    "description": "Distance to a celestial object using baseline separation b and parallax angle theta in radians.",
                    "variables": [
                        { "symbol": "b", "meaning": "Baseline Separation", "unit": "m" },
                        { "symbol": "\\theta", "meaning": "Parallax Angle", "unit": "rad" },
                        { "symbol": "D", "meaning": "Distance to Celestial Object", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Significant Figures, Rounding Rules & Error Propagation",
            "desc": "Systematic and random errors, absolute, relative, and percentage errors, rules of significant figures in arithmetic operations.",
            "notesOverview": "Every scientific measurement contains uncertainty. Reliable digits plus the first uncertain digit constitute significant figures.",
            "notesSections": [
                {
                    "heading": "Error Propagation in Power Relations",
                    "paragraphs": [
                        "For a physical quantity Z = (A^p * B^q) / C^r, relative uncertainty is Delta Z / Z = p*(Delta A / A) + q*(Delta B / B) + r*(Delta C / C).",
                        "The variable with the highest power exponent contributes the greatest percentage error to the final computed result."
                    ],
                    "keyTakeaways": [
                        "In multiplication/division, retain significant figures equal to the least precise measurement.",
                        "In addition/subtraction, round to the least number of decimal places."
                    ],
                    "examTips": ["Relative errors always add up; never subtract fractional errors even if quantities are divided."]
                }
            ],
            "misconceptions": ["Subtracting percentage errors in quotient expressions. Errors always accumulate."],
            "formulas": [
                {
                    "label": "Fractional Error Propagation",
                    "formula": "\\frac{\\Delta Z}{Z} = p \\frac{\\Delta A}{A} + q \\frac{\\Delta B}{B} + r \\frac{\\Delta C}{C}",
                    "description": "Maximum relative error for generalized power function Z = (A^p * B^q) / C^r.",
                    "variables": [
                        { "symbol": "Z", "meaning": "Physical Quantity", "unit": "-" },
                        { "symbol": "\\Delta Z", "meaning": "Absolute Uncertainty", "unit": "-" },
                        { "symbol": "p, q, r", "meaning": "Power Exponents", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Dimensions of Physical Quantities & Dimensional Analysis",
            "desc": "Dimensional formulas, principle of homogeneity, checking physical equations, converting units across systems, and deducing relations.",
            "notesOverview": "Dimensional analysis uses dimensional homogeneity [M, L, T, I, Theta, N, J] to check equation validity and deduce proportional dependencies.",
            "notesSections": [
                {
                    "heading": "Principle of Dimensional Homogeneity",
                    "paragraphs": [
                        "A physical equation is valid only if each additive or subtractive term possesses identical dimensions on both sides.",
                        "Dimensional analysis cannot determine dimensionless proportionality constants (like 2*pi in pendulum period) or handle transcendental arguments."
                    ],
                    "keyTakeaways": [
                        "Work and Torque share dimensions [M L^2 T^-2] but are physically distinct scalar and vector quantities.",
                        "Arguments of sin, cos, exp, and log must be dimensionless."
                    ],
                    "examTips": ["Use dimensional analysis to rapidly eliminate incorrect choices in objective examinations."]
                }
            ],
            "misconceptions": ["Assuming dimensional correctness guarantees physical correctness. (An equation can be dimensionally homogeneous but physically wrong)."],
            "formulas": [
                {
                    "label": "Unit System Conversion Formula",
                    "formula": "n_2 = n_1 \\left(\\frac{M_1}{M_2}\\right)^a \\left(\\frac{L_1}{L_2}\\right)^b \\left(\\frac{T_1}{T_2}\\right)^c",
                    "description": "Transformation of numerical values between two unit systems based on dimensional exponents.",
                    "variables": [
                        { "symbol": "n_1", "meaning": "Numerical Value in System 1", "unit": "-" },
                        { "symbol": "n_2", "meaning": "Numerical Value in System 2", "unit": "-" },
                        { "symbol": "a, b, c", "meaning": "Dimensional Powers", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-02": [
        {
            "title": "Position, Path Length, Displacement & Reference Frames",
            "desc": "Frame of reference, rectilinear coordinate axes, path length (scalar distance), and displacement vector.",
            "notesOverview": "Motion is relative to an observer's reference frame. Path length is total scalar distance traversed, whereas displacement is the directed vector change in position.",
            "notesSections": [
                {
                    "heading": "Displacement vs Path Length",
                    "paragraphs": [
                        "Displacement Delta x = x2 - x1 is the shortest vector distance between initial and final points.",
                        "Magnitude of displacement <= path length. They are equal only for unidirectional rectilinear motion without turning back."
                    ],
                    "keyTakeaways": ["Displacement can be zero when a particle returns to origin, even though path length is non-zero."],
                    "examTips": ["Check whether velocity changes sign to detect reversal points when computing total distance."]
                }
            ],
            "misconceptions": ["Assuming displacement equals path length for oscillating or reversing motion."],
            "formulas": [
                {
                    "label": "Displacement Vector",
                    "formula": "\\Delta x = x_2 - x_1",
                    "description": "Net directed change between final and initial coordinates.",
                    "variables": [
                        { "symbol": "x_1", "meaning": "Initial Position", "unit": "m" },
                        { "symbol": "x_2", "meaning": "Final Position", "unit": "m" },
                        { "symbol": "\\Delta x", "meaning": "Displacement", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Average Velocity, Average Speed & 1D Relative Motion",
            "desc": "Average velocity as displacement over elapsed time, average speed as path length over elapsed time, and 1D relative velocity.",
            "notesOverview": "Average velocity depends strictly on initial and final endpoints, while average speed accounts for all intermediate trajectory path segments.",
            "notesSections": [
                {
                    "heading": "Harmonic and Arithmetic Means",
                    "paragraphs": [
                        "If equal distances are travelled at speeds v1 and v2, average speed is the harmonic mean: 2*v1*v2 / (v1 + v2).",
                        "If equal times are spent travelling at speeds v1 and v2, average speed is the arithmetic mean: (v1 + v2) / 2."
                    ],
                    "keyTakeaways": ["Average speed is always greater than or equal to magnitude of average velocity."],
                    "examTips": ["Identify whether equal distance halves or equal time halves are given before choosing the formula."]
                }
            ],
            "misconceptions": ["Taking the arithmetic average (v1+v2)/2 when distances, rather than travel times, are equal."],
            "formulas": [
                {
                    "label": "Average Velocity",
                    "formula": "\\bar{v} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_2 - x_1}{t_2 - t_1}",
                    "description": "Ratio of net displacement to total elapsed time.",
                    "variables": [
                        { "symbol": "\\Delta x", "meaning": "Net Displacement", "unit": "m" },
                        { "symbol": "\\Delta t", "meaning": "Total Elapsed Time", "unit": "s" },
                        { "symbol": "\\bar{v}", "meaning": "Average Velocity", "unit": "m/s" }
                    ]
                },
                {
                    "label": "1D Relative Velocity",
                    "formula": "v_{AB} = v_A - v_B",
                    "description": "Velocity of body A with respect to observer body B.",
                    "variables": [
                        { "symbol": "v_A", "meaning": "Velocity of Body A", "unit": "m/s" },
                        { "symbol": "v_B", "meaning": "Velocity of Body B", "unit": "m/s" },
                        { "symbol": "v_{AB}", "meaning": "Relative Velocity of A w.r.t B", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Instantaneous Velocity, Differential Calculus & Motion Graphs",
            "desc": "Instantaneous velocity as time derivative dx/dt, graphical interpretation as tangent slope of x-t curve, and v-t graph area.",
            "notesOverview": "Instantaneous velocity v = dx/dt represents the instantaneous rate of change of position at a given mathematical point in time.",
            "notesSections": [
                {
                    "heading": "Graphical Significance of x-t and v-t Plots",
                    "paragraphs": [
                        "The tangent slope of position-time (x-t) curve gives instantaneous velocity.",
                        "The tangent slope of velocity-time (v-t) curve gives instantaneous acceleration. Area under v-t curve equals net displacement."
                    ],
                    "keyTakeaways": [
                        "Turning points on an x-t plot have horizontal tangents (v = 0).",
                        "Area under acceleration-time (a-t) plot gives change in velocity."
                    ],
                    "examTips": ["Area below the time axis on a v-t plot represents negative displacement."]
                }
            ],
            "misconceptions": ["Confusing average velocity over an interval with instantaneous velocity at a specific moment."],
            "formulas": [
                {
                    "label": "Instantaneous Velocity Derivative",
                    "formula": "v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt}",
                    "description": "First time derivative of position coordinate representing instantaneous velocity.",
                    "variables": [
                        { "symbol": "x", "meaning": "Position Coordinate", "unit": "m" },
                        { "symbol": "t", "meaning": "Time", "unit": "s" },
                        { "symbol": "v", "meaning": "Instantaneous Velocity", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Uniform Acceleration, Kinematic Equations & Calculus Derivations",
            "desc": "Uniformly accelerated motion, integration derivations, and three fundamental kinematic relations.",
            "simulationId": "rectilinear_kinematics",
            "notesOverview": "For constant acceleration, kinematics equations link displacement, initial velocity, final velocity, acceleration, and time.",
            "notesSections": [
                {
                    "heading": "The Three Master Kinematic Equations",
                    "paragraphs": [
                        "1. v = v0 + a*t (Velocity-time relation)",
                        "2. x = v0*t + 0.5*a*t^2 (Position-time relation)",
                        "3. v^2 = v0^2 + 2*a*x (Velocity-position relation)"
                    ],
                    "keyTakeaways": [
                        "Displacement in nth second: s_n = u + a*(n - 0.5).",
                        "These formulas apply STRICTLY when acceleration is constant."
                    ],
                    "examTips": ["If acceleration varies with time or position, you MUST use calculus integration: v = integral(a dt) or v dv = a dx."]
                }
            ],
            "misconceptions": ["Applying v = u + at when acceleration depends on position or velocity."],
            "formulas": [
                {
                    "label": "First Kinematic Equation",
                    "formula": "v = v_0 + a t",
                    "description": "Final velocity under constant rectilinear acceleration a.",
                    "variables": [
                        { "symbol": "v_0", "meaning": "Initial Velocity", "unit": "m/s" },
                        { "symbol": "a", "meaning": "Constant Acceleration", "unit": "m/s^2" },
                        { "symbol": "t", "meaning": "Elapsed Time", "unit": "s" },
                        { "symbol": "v", "meaning": "Final Velocity", "unit": "m/s" }
                    ]
                },
                {
                    "label": "Second Kinematic Equation",
                    "formula": "x = v_0 t + \\frac{1}{2} a t^2",
                    "description": "Position displacement as a quadratic function of time under constant acceleration.",
                    "variables": [
                        { "symbol": "v_0", "meaning": "Initial Velocity", "unit": "m/s" },
                        { "symbol": "a", "meaning": "Acceleration", "unit": "m/s^2" },
                        { "symbol": "t", "meaning": "Elapsed Time", "unit": "s" },
                        { "symbol": "x", "meaning": "Net Displacement", "unit": "m" }
                    ]
                },
                {
                    "label": "Third Kinematic Equation",
                    "formula": "v^2 = v_0^2 + 2 a x",
                    "description": "Time-independent relation connecting velocity squares with displacement.",
                    "variables": [
                        { "symbol": "v_0", "meaning": "Initial Velocity", "unit": "m/s" },
                        { "symbol": "v", "meaning": "Final Velocity", "unit": "m/s" },
                        { "symbol": "a", "meaning": "Acceleration", "unit": "m/s^2" },
                        { "symbol": "x", "meaning": "Displacement", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Free Fall Under Gravity & Galileo’s Law of Odd Numbers",
            "desc": "Vertical motion under earth gravity g = 9.8 m/s^2, time of flight, maximum height, and ratios of distances.",
            "notesOverview": "In vacuum, all bodies dropped from rest experience equal downward acceleration g regardless of mass.",
            "notesSections": [
                {
                    "heading": "Galileo’s Law of Odd Numbers",
                    "paragraphs": [
                        "Distances traversed during equal successive time intervals by a body falling from rest are in the ratio of odd numbers: 1 : 3 : 5 : 7 : ...",
                        "Time of ascent equals time of descent in free fall without air resistance."
                    ],
                    "keyTakeaways": [
                        "Maximum height reached: H = u^2 / (2g).",
                        "Total flight time: T = 2u / g."
                    ],
                    "examTips": ["Assign an explicit upward positive coordinate system before writing signs for u, g, and s."]
                }
            ],
            "misconceptions": ["Thinking heavier bodies fall faster under gravity in vacuum. Acceleration g is independent of body mass."],
            "formulas": [
                {
                    "label": "Maximum Height in Free Fall",
                    "formula": "H = \\frac{u^2}{2 g}",
                    "description": "Maximum vertical altitude achieved by a body projected upward with speed u.",
                    "variables": [
                        { "symbol": "u", "meaning": "Initial Upward Speed", "unit": "m/s" },
                        { "symbol": "g", "meaning": "Acceleration Due to Gravity", "unit": "m/s^2" },
                        { "symbol": "H", "meaning": "Peak Altitude", "unit": "m" }
                    ]
                },
                {
                    "label": "Total Free Fall Flight Time",
                    "formula": "T = \\frac{2 u}{g}",
                    "description": "Total time taken to ascend to peak height and return to initial level.",
                    "variables": [
                        { "symbol": "u", "meaning": "Launch Speed", "unit": "m/s" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "T", "meaning": "Total Time of Flight", "unit": "s" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-03": [
        {
            "title": "Scalars and Vectors, Vector Operations & Unit Vectors",
            "desc": "Scalar and vector definitions, triangle law, parallelogram law of vector addition, null vector, and Cartesian unit vectors i, j, k.",
            "notesOverview": "Vectors possess both magnitude and direction, obeying geometric vector addition rules rather than simple algebraic addition.",
            "notesSections": [
                {
                    "heading": "Parallelogram Law of Vector Addition",
                    "paragraphs": [
                        "If two vectors A and B are represented in magnitude and direction by two adjacent sides of a parallelogram, their resultant R is represented by the diagonal passing through their common origin.",
                        "Magnitude of resultant: R = sqrt(A^2 + B^2 + 2*A*B*cos theta). Direction angle alpha: tan alpha = (B*sin theta) / (A + B*cos theta)."
                    ],
                    "keyTakeaways": [
                        "Resultant is maximum (A + B) when theta = 0, minimum |A - B| when theta = 180 degrees.",
                        "Unit vectors satisfy |i| = |j| = |k| = 1 and are mutually perpendicular."
                    ],
                    "examTips": ["Remember that physical quantities with magnitude and direction (like electric current) are NOT vectors unless they obey vector addition laws."]
                }
            ],
            "misconceptions": ["Assuming any quantity with direction is a vector (e.g. current has direction but adds algebraically)."],
            "formulas": [
                {
                    "label": "Resultant Vector Magnitude",
                    "formula": "R = \\sqrt{A^2 + B^2 + 2 A B \\cos\\theta}",
                    "description": "Magnitude of resultant vector formed by adding two vectors at angle theta.",
                    "variables": [
                        { "symbol": "A", "meaning": "Magnitude of Vector A", "unit": "-" },
                        { "symbol": "B", "meaning": "Magnitude of Vector B", "unit": "-" },
                        { "symbol": "\\theta", "meaning": "Enclosed Angle", "unit": "rad" },
                        { "symbol": "R", "meaning": "Resultant Magnitude", "unit": "-" }
                    ]
                },
                {
                    "label": "Resultant Direction Angle",
                    "formula": "\\tan\\alpha = \\frac{B \\sin\\theta}{A + B \\cos\\theta}",
                    "description": "Orientation angle alpha of the resultant vector relative to vector A.",
                    "variables": [
                        { "symbol": "\\alpha", "meaning": "Angle w.r.t Vector A", "unit": "rad" },
                        { "symbol": "\\theta", "meaning": "Angle Between A and B", "unit": "rad" }
                    ]
                }
            ]
        },
        {
            "title": "Resolution of Vectors in a Plane & Rectangular Components",
            "desc": "Orthogonal decomposition of a 2D vector into Ax and Ay, direction cosines, and vector representation in Cartesian form.",
            "notesOverview": "Any vector in the XY plane can be uniquely resolved into perpendicular components: A = Ax*i + Ay*j.",
            "notesSections": [
                {
                    "heading": "Orthogonal Projection and Magnitude",
                    "paragraphs": [
                        "Ax = A*cos theta, Ay = A*sin theta, where theta is angle with X-axis.",
                        "Vector magnitude is given by Pythagorean theorem: |A| = sqrt(Ax^2 + Ay^2)."
                    ],
                    "keyTakeaways": [
                        "Splitting forces into orthogonal components allows solving 2D equilibrium as two independent 1D equations."
                    ],
                    "examTips": ["Always resolve along and perpendicular to the inclined plane when solving incline problems."]
                }
            ],
            "misconceptions": ["Forgetting that component signs depend on the chosen Cartesian quadrant."],
            "formulas": [
                {
                    "label": "2D Vector Decomposition",
                    "formula": "\\vec{A} = A_x \\hat{i} + A_y \\hat{j} = (A \\cos\\theta) \\hat{i} + (A \\sin\\theta) \\hat{j}",
                    "description": "Orthogonal representation of 2D vector in Cartesian components.",
                    "variables": [
                        { "symbol": "A_x", "meaning": "Horizontal Component", "unit": "-" },
                        { "symbol": "A_y", "meaning": "Vertical Component", "unit": "-" },
                        { "symbol": "\\hat{i}, \\hat{j}", "meaning": "Unit Basis Vectors", "unit": "-" }
                    ]
                }
            ]
        },
        {
            "title": "Motion in a Plane with Constant Acceleration & Superposition",
            "desc": "Independence of orthogonal motion directions, 2D displacement and velocity vectors under constant acceleration.",
            "notesOverview": "Motion in a plane can be treated as two concurrent, independent one-dimensional motions along orthogonal X and Y axes.",
            "notesSections": [
                {
                    "heading": "Independence of Perpendicular Motions",
                    "paragraphs": [
                        "Horizontal motion with zero acceleration proceeds simultaneously and independently of vertical motion influenced by constant gravity.",
                        "The total position vector is r(t) = (x0 + v0x*t + 0.5*ax*t^2)*i + (y0 + v0y*t + 0.5*ay*t^2)*j."
                    ],
                    "keyTakeaways": ["Time parameter t couples the independent horizontal and vertical coordinate equations."],
                    "examTips": ["Eliminate parameter t between x(t) and y(t) to derive the Cartesian trajectory equation y = f(x)."]
                }
            ],
            "misconceptions": ["Assuming vertical gravity alters horizontal velocity in ideal projectile motion."],
            "formulas": [
                {
                    "label": "2D Position Vector",
                    "formula": "\\vec{r}(t) = \\vec{r}_0 + \\vec{v}_0 t + \\frac{1}{2} \\vec{a} t^2",
                    "description": "Position vector in XY plane as a function of time.",
                    "variables": [
                        { "symbol": "r(t)", "meaning": "Position Vector", "unit": "m" },
                        { "symbol": "v_0", "meaning": "Initial Velocity Vector", "unit": "m/s" },
                        { "symbol": "a", "meaning": "Constant Acceleration Vector", "unit": "m/s^2" }
                    ]
                }
            ]
        },
        {
            "title": "Projectile Motion Dynamics, Parabolic Trajectory & Flight Range",
            "desc": "Ballistic flight path, time of maximum height, total flight time, horizontal range, maximum range angle, and trajectory equation.",
            "simulationId": "projectile_motion",
            "notesOverview": "A projectile is any body thrown with initial velocity that moves freely under gravity alone. Its path is a symmetric parabola.",
            "notesSections": [
                {
                    "heading": "Core Derivations for Projectile Launched at Angle Theta",
                    "paragraphs": [
                        "Horizontal velocity remains constant: vx = v0*cos theta. Vertical velocity decreases linearly: vy = v0*sin theta - g*t.",
                        "At maximum height, vertical velocity vy = 0. Time to peak: t_p = (v0*sin theta) / g. Total flight time: T = 2*t_p = (2*v0*sin theta) / g.",
                        "Maximum height: H = (v0^2 * sin^2 theta) / (2g). Horizontal range: R = (v0^2 * sin(2*theta)) / g."
                    ],
                    "keyTakeaways": [
                        "Maximum horizontal range occurs at launch angle theta = 45 degrees: R_max = v0^2 / g.",
                        "Horizontal range is identical for complementary launch angles theta and (90 - theta).",
                        "Equation of trajectory: y = x*tan theta - (g*x^2) / (2*v0^2 * cos^2 theta)."
                    ],
                    "examTips": [
                        "At peak altitude, kinetic energy is NOT zero: K_top = 0.5*m*(v0*cos theta)^2 = K0*cos^2 theta.",
                        "For two complementary angles with identical range, the ratio of maximum heights is tan^2 theta."
                    ]
                }
            ],
            "misconceptions": [
                "Believing velocity is zero at highest point: only vertical component vy is zero; horizontal speed v0*cos theta remains non-zero.",
                "Thinking acceleration changes direction: gravitational acceleration g is ALWAYS vertically downward throughout flight."
            ],
            "formulas": [
                {
                    "label": "Total Flight Time",
                    "formula": "T = \\frac{2 v_0 \\sin\\theta}{g}",
                    "description": "Total duration from launch until returning to the launch horizontal plane.",
                    "variables": [
                        { "symbol": "v_0", "meaning": "Launch Speed", "unit": "m/s" },
                        { "symbol": "\\theta", "meaning": "Launch Elevation Angle", "unit": "rad" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "T", "meaning": "Total Time of Flight", "unit": "s" }
                    ]
                },
                {
                    "label": "Maximum Peak Height",
                    "formula": "H = \\frac{v_0^2 \\sin^2\\theta}{2 g}",
                    "description": "Maximum vertical altitude achieved by the projectile above launch datum.",
                    "variables": [
                        { "symbol": "v_0", "meaning": "Launch Velocity", "unit": "m/s" },
                        { "symbol": "\\theta", "meaning": "Launch Angle", "unit": "rad" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "H", "meaning": "Maximum Vertical Height", "unit": "m" }
                    ]
                },
                {
                    "label": "Horizontal Range",
                    "formula": "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
                    "description": "Horizontal distance traversed before projectile hits the original plane level.",
                    "variables": [
                        { "symbol": "v_0", "meaning": "Launch Velocity", "unit": "m/s" },
                        { "symbol": "\\theta", "meaning": "Launch Angle", "unit": "rad" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "R", "meaning": "Horizontal Range", "unit": "m" }
                    ]
                },
                {
                    "label": "Cartesian Trajectory Parabola",
                    "formula": "y = x \\tan\\theta - \\frac{g x^2}{2 v_0^2 \\cos^2\\theta} = x \\tan\\theta \\left(1 - \\frac{x}{R}\\right)",
                    "description": "Parabolic profile equation expressing vertical position y in terms of horizontal coordinate x.",
                    "variables": [
                        { "symbol": "x", "meaning": "Horizontal Position", "unit": "m" },
                        { "symbol": "y", "meaning": "Vertical Elevation", "unit": "m" },
                        { "symbol": "R", "meaning": "Horizontal Range", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Uniform Circular Motion & Centripetal Acceleration",
            "desc": "Angular displacement, angular velocity, tangential speed, radial centripetal acceleration vector a_c = omega^2 * R, and frequency.",
            "simulationId": "circular_motion",
            "notesOverview": "When a particle moves in a circle at constant speed, its direction changes continuously, producing a radial inward acceleration toward the centre.",
            "notesSections": [
                {
                    "heading": "Kinematics of Uniform Circular Motion",
                    "paragraphs": [
                        "Angular speed omega = d theta / dt = 2*pi*f = 2*pi / T.",
                        "Tangential linear speed: v = omega * R. While speed is constant, velocity vector changes continuously.",
                        "Centripetal acceleration is directed radially inward toward the circular centre: a_c = v^2 / R = omega^2 * R."
                    ],
                    "keyTakeaways": [
                        "Centripetal acceleration is perpendicular to tangential velocity, doing zero work.",
                        "Kinetic energy remains constant, but linear momentum changes continuously."
                    ],
                    "examTips": ["In uniform circular motion, acceleration is NOT constant because its direction rotates continuously."]
                }
            ],
            "misconceptions": ["Thinking uniform circular motion has zero acceleration because speed is constant. Direction change requires centripetal acceleration."],
            "formulas": [
                {
                    "label": "Centripetal Acceleration",
                    "formula": "a_c = \\frac{v^2}{R} = \\omega^2 R = 4 \\pi^2 f^2 R",
                    "description": "Inward radial acceleration maintaining circular motion of radius R.",
                    "variables": [
                        { "symbol": "v", "meaning": "Tangential Linear Speed", "unit": "m/s" },
                        { "symbol": "\\omega", "meaning": "Angular Velocity", "unit": "rad/s" },
                        { "symbol": "R", "meaning": "Radius of Curvature", "unit": "m" },
                        { "symbol": "a_c", "meaning": "Centripetal Acceleration", "unit": "m/s^2" }
                    ]
                },
                {
                    "label": "Linear-Angular Velocity Relation",
                    "formula": "v = \\omega R = \\frac{2\\pi R}{T}",
                    "description": "Tangential velocity linked to angular velocity and period of revolution.",
                    "variables": [
                        { "symbol": "v", "meaning": "Tangential Speed", "unit": "m/s" },
                        { "symbol": "\\omega", "meaning": "Angular Frequency", "unit": "rad/s" },
                        { "symbol": "R", "meaning": "Orbital Radius", "unit": "m" },
                        { "symbol": "T", "meaning": "Period of Revolution", "unit": "s" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-04": [
        {
            "title": "Inertia & Newton’s First Law of Motion",
            "desc": "Galileo’s thought experiments, concept of inertia (rest, motion, direction), and definition of force as an external agent.",
            "notesOverview": "Newton’s first law states every body continues in its state of rest or uniform motion in a straight line unless compelled by external unbalanced force.",
            "notesSections": [
                {
                    "heading": "Qualitative Definition of Force and Inertia",
                    "paragraphs": [
                        "Inertia is the inherent resistance of matter to change its velocity state. Mass is the quantitative measure of inertia.",
                        "An inertial frame is one where Newton’s first law holds without invoking pseudo-forces."
                    ],
                    "keyTakeaways": ["Zero net force implies zero acceleration, not necessarily zero velocity."],
                    "examTips": ["Distinguish clearly between inertia of rest, inertia of motion, and inertia of direction."]
                }
            ],
            "misconceptions": ["Assuming force is required to keep an object moving. Force is required only to CHANGE motion."],
            "formulas": [
                {
                    "label": "Equilibrium Condition (First Law)",
                    "formula": "\\sum \\vec{F}_{ext} = 0 \\implies \\vec{a} = 0, \\; \\vec{v} = \\text{const}",
                    "description": "Vanishing net external force guarantees constant velocity vector.",
                    "variables": [
                        { "symbol": "\\vec{F}_{ext}", "meaning": "Net External Force", "unit": "N" },
                        { "symbol": "\\vec{a}", "meaning": "Acceleration Vector", "unit": "m/s^2" }
                    ]
                }
            ]
        },
        {
            "title": "Newton’s Second Law of Motion, Momentum & Impulse",
            "desc": "Linear momentum p = mv, rate of change of momentum, F = dp/dt = ma, SI unit newton, and impulse-momentum theorem.",
            "notesOverview": "The rate of change of linear momentum is directly proportional to applied unbalanced force and takes place in the direction of the force.",
            "notesSections": [
                {
                    "heading": "F = dp/dt and the Impulse Theorem",
                    "paragraphs": [
                        "F = dp/dt = m*(dv/dt) + v*(dm/dt). For constant mass systems, F = m*a.",
                        "Impulse J = integral(F dt) = Delta p represents the change in linear momentum produced by a large force acting over a brief time."
                    ],
                    "keyTakeaways": [
                        "Second law provides the quantitative formula for force.",
                        "Cushioning increases collision impact time, drastically reducing peak destructive force."
                    ],
                    "examTips": ["Remember that for variable mass systems (like rockets), the v*(dm/dt) thrust term must be retained."]
                }
            ],
            "misconceptions": ["Thinking F = ma holds for variable mass systems: the fundamental law is F = dp/dt."],
            "formulas": [
                {
                    "label": "Newton’s Second Law",
                    "formula": "\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m \\vec{a}",
                    "description": "Net applied force equals time rate of change of momentum, yielding m*a for constant mass.",
                    "variables": [
                        { "symbol": "m", "meaning": "Inertial Mass", "unit": "kg" },
                        { "symbol": "\\vec{a}", "meaning": "Acceleration", "unit": "m/s^2" },
                        { "symbol": "\\vec{F}_{net}", "meaning": "Net Force Vector", "unit": "N" }
                    ]
                },
                {
                    "label": "Impulse-Momentum Theorem",
                    "formula": "\\vec{J} = \\int_{t_1}^{t_2} \\vec{F} dt = \\Delta \\vec{p} = m \\vec{v}_f - m \\vec{v}_i",
                    "description": "Time integral of force equals total change in linear momentum.",
                    "variables": [
                        { "symbol": "\\vec{J}", "meaning": "Impulse Vector", "unit": "N s" },
                        { "symbol": "\\Delta\\vec{p}", "meaning": "Momentum Change", "unit": "kg m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Newton’s Third Law & Conservation of Linear Momentum",
            "desc": "Action-reaction pairs, simultaneous generation on different bodies, and isolated system momentum conservation.",
            "notesOverview": "To every action there is always an equal and opposite reaction. Forces always occur in matched pairs acting on two different bodies.",
            "notesSections": [
                {
                    "heading": "Action-Reaction Mechanics",
                    "paragraphs": [
                        "Action and reaction forces never cancel each other because they act on two different interacting bodies.",
                        "For an isolated system with no external net force, total linear momentum remains invariant in all collisions and explosions."
                    ],
                    "keyTakeaways": [
                        "Recoil of a gun: v_gun = -(m_bullet / M_gun) * v_bullet.",
                        "Internal forces can never change the total momentum of a system."
                    ],
                    "examTips": ["When drawing Free Body Diagrams, include ONLY forces exerted ON the body, never forces exerted BY the body."]
                }
            ],
            "misconceptions": ["Thinking action and reaction cancel each other out. They act on two distinct objects, so they cannot cancel."],
            "formulas": [
                {
                    "label": "Newton’s Third Law",
                    "formula": "\\vec{F}_{AB} = -\\vec{F}_{BA}",
                    "description": "Mutual forces exerted between two interacting bodies A and B are equal in magnitude and opposite in direction.",
                    "variables": [
                        { "symbol": "\\vec{F}_{AB}", "meaning": "Force on A by B", "unit": "N" },
                        { "symbol": "\\vec{F}_{BA}", "meaning": "Force on B by A", "unit": "N" }
                    ]
                },
                {
                    "label": "Conservation of Linear Momentum",
                    "formula": "m_1 \\vec{u}_1 + m_2 \\vec{u}_2 = m_1 \\vec{v}_1 + m_2 \\vec{v}_2",
                    "description": "Total momentum before collision equals total momentum after collision in an isolated system.",
                    "variables": [
                        { "symbol": "m_1, m_2", "meaning": "Masses of Bodies", "unit": "kg" },
                        { "symbol": "u_1, u_2", "meaning": "Initial Velocities", "unit": "m/s" },
                        { "symbol": "v_1, v_2", "meaning": "Final Velocities", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Free Body Diagrams, Equilibrium & Pulley Incline Mechanics",
            "desc": "Isolation of mechanical bodies, normal reaction, string tension, inclined planes, and coupled pulley systems.",
            "simulationId": "incline_fbd_pulley",
            "notesOverview": "A Free Body Diagram (FBD) isolates a single body and visualizes all external contact and field forces acting on it.",
            "notesSections": [
                {
                    "heading": "Systematic FBD Construction on Incline with Pulley",
                    "paragraphs": [
                        "1. Choose Cartesian coordinates aligned with the incline surface (X parallel to incline, Y perpendicular).",
                        "2. Resolve gravitational weight mg into mg*sin theta along incline and mg*cos theta normal to incline.",
                        "3. Normal force N = mg*cos theta. Unbalanced net driving force gives acceleration a = (m2 - m1*sin theta)*g / (m1 + m2)."
                    ],
                    "keyTakeaways": [
                        "String tension T is uniform across massless, frictionless pulleys.",
                        "Acceleration of connected bodies constrained by an inextensible string has identical magnitude."
                    ],
                    "examTips": ["Write F = ma separately for each isolated mass, then add the coupled equations to eliminate unknown string tension T."]
                }
            ],
            "misconceptions": ["Drawing string tension pushing an object: strings can ONLY pull, never push."],
            "formulas": [
                {
                    "label": "Acceleration of Incline-Pulley System",
                    "formula": "a = \\frac{m_2 - m_1 \\sin\\theta}{m_1 + m_2} g",
                    "description": "Net acceleration of hanging mass m2 connected to mass m1 on frictionless incline of angle theta.",
                    "variables": [
                        { "symbol": "m_1", "meaning": "Mass on Incline", "unit": "kg" },
                        { "symbol": "m_2", "meaning": "Hanging Mass", "unit": "kg" },
                        { "symbol": "\\theta", "meaning": "Incline Angle", "unit": "rad" },
                        { "symbol": "a", "meaning": "System Acceleration", "unit": "m/s^2" }
                    ]
                },
                {
                    "label": "Incline Normal Reaction Force",
                    "formula": "N = m_1 g \\cos\\theta",
                    "description": "Perpendicular contact normal force balancing weight component on incline.",
                    "variables": [
                        { "symbol": "N", "meaning": "Normal Contact Force", "unit": "N" },
                        { "symbol": "m_1", "meaning": "Object Mass", "unit": "kg" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" }
                    ]
                }
            ]
        },
        {
            "title": "Frictional Forces: Static, Limiting, Kinetic & Rolling Friction",
            "desc": "Origin of friction, angle of friction, angle of repose, coefficients mu_s and mu_k, and rolling resistance.",
            "notesOverview": "Friction opposes relative motion or impending motion between contacting surfaces. Static friction is a self-adjusting force up to its limiting threshold.",
            "notesSections": [
                {
                    "heading": "Laws of Friction and Angle of Repose",
                    "paragraphs": [
                        "Static friction satisfies 0 <= f_s <= mu_s * N. Once sliding commences, kinetic friction f_k = mu_k * N applies.",
                        "Angle of repose phi is the maximum incline tilt angle at which a body remains at rest: tan phi = mu_s."
                    ],
                    "keyTakeaways": [
                        "Coefficient of static friction mu_s is always greater than coefficient of kinetic friction mu_k.",
                        "Friction is independent of apparent contact area for macroscopic surfaces."
                    ],
                    "examTips": ["Static friction only equals mu_s * N when the body is on the verge of impending motion."]
                }
            ],
            "misconceptions": ["Assuming static friction is always mu_s * N. It self-adjusts from 0 up to mu_s * N to match the applied force."],
            "formulas": [
                {
                    "label": "Limiting Static Friction",
                    "formula": "f_{s,\\max} = \\mu_s N",
                    "description": "Maximum threshold of self-adjusting static friction before slip begins.",
                    "variables": [
                        { "symbol": "\\mu_s", "meaning": "Coefficient of Static Friction", "unit": "-" },
                        { "symbol": "N", "meaning": "Normal Contact Reaction", "unit": "N" },
                        { "symbol": "f_{s,\\max}", "meaning": "Limiting Friction Force", "unit": "N" }
                    ]
                },
                {
                    "label": "Kinetic Friction Force",
                    "formula": "f_k = \\mu_k N",
                    "description": "Opposing resistive force during relative sliding motion.",
                    "variables": [
                        { "symbol": "\\mu_k", "meaning": "Coefficient of Kinetic Friction", "unit": "-" },
                        { "symbol": "f_k", "meaning": "Kinetic Friction", "unit": "N" }
                    ]
                }
            ]
        },
        {
            "title": "Circular Dynamics, Banked Curves & Centripetal Force",
            "desc": "Centripetal force requirement, level curved road skidding speed, optimal banked curve angle without friction, and safe speed limits.",
            "simulationId": "road_banking",
            "notesOverview": "To round a curved path of radius R, an inward centripetal force F_c = m*v^2 / R is required, provided by friction, banking, or both.",
            "notesSections": [
                {
                    "heading": "Dynamics of Curved Track Banking",
                    "paragraphs": [
                        "On an unbanked level curve, friction alone provides centripetal force: v_max = sqrt(mu_s * g * R).",
                        "By banking the road at angle theta, the horizontal component of the normal reaction provides centripetal force: tan theta = v0^2 / (R * g).",
                        "Maximum safe negotiating speed on banked road with friction: v_max = sqrt(R*g * (mu_s + tan theta) / (1 - mu_s * tan theta))."
                    ],
                    "keyTakeaways": [
                        "At the design banking speed v0 = sqrt(R*g*tan theta), zero lateral friction is demanded from vehicle tyres.",
                        "If speed drops below minimum threshold v_min, the vehicle tends to slip inward down the banked slope."
                    ],
                    "examTips": ["At the rated banking speed, tyre wear is minimal because friction is not invoked."]
                }
            ],
            "misconceptions": ["Thinking centripetal force is an extra physical force: it is the NET resultant of existing forces (normal, friction, gravity)."],
            "formulas": [
                {
                    "label": "Maximum Speed on Level Road",
                    "formula": "v_{\\max} = \\sqrt{\\mu_s g R}",
                    "description": "Skidding threshold speed on horizontal flat curve of radius R.",
                    "variables": [
                        { "symbol": "\\mu_s", "meaning": "Tyre-Road Static Friction", "unit": "-" },
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "R", "meaning": "Radius of Curve", "unit": "m" },
                        { "symbol": "v_{\\max}", "meaning": "Maximum Non-Skid Speed", "unit": "m/s" }
                    ]
                },
                {
                    "label": "Optimal Banking Angle (Zero Friction)",
                    "formula": "\\tan\\theta = \\frac{v^2}{g R}",
                    "description": "Banking inclination angle where normal reaction component alone balances centripetal demand.",
                    "variables": [
                        { "symbol": "\\theta", "meaning": "Banking Angle", "unit": "rad" },
                        { "symbol": "v", "meaning": "Design Speed", "unit": "m/s" },
                        { "symbol": "R", "meaning": "Radius of Turn", "unit": "m" }
                    ]
                },
                {
                    "label": "Maximum Safe Speed on Banked Road with Friction",
                    "formula": "v_{\\max} = \\sqrt{R g \\left(\\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s \\tan\\theta}\\right)}",
                    "description": "Upper velocity threshold preventing vehicle from sliding outward up a banked curve.",
                    "variables": [
                        { "symbol": "R", "meaning": "Radius of Curve", "unit": "m" },
                        { "symbol": "\\theta", "meaning": "Road Banking Angle", "unit": "rad" },
                        { "symbol": "\\mu_s", "meaning": "Static Friction Coefficient", "unit": "-" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-05": [
        {
            "title": "Work Done by a Constant Force & Scalar Dot Product",
            "desc": "Work definition W = F . d = F d cos theta, scalar product properties, positive, negative, and zero work regimes.",
            "notesOverview": "Work is defined as the scalar product of force and displacement vectors: W = F . d = F*d*cos theta.",
            "notesSections": [
                {
                    "heading": "Positive, Negative, and Zero Work",
                    "paragraphs": [
                        "Work is positive when 0 <= theta < 90 degrees (force aids motion).",
                        "Work is zero when theta = 90 degrees (e.g. centripetal force in circular motion, normal force on horizontal ground).",
                        "Work is negative when 90 < theta <= 180 degrees (e.g. friction opposing displacement)."
                    ],
                    "keyTakeaways": [
                        "Work is a scalar quantity; its SI unit is the joule (1 J = 1 N m).",
                        "Dot product is commutative: A . B = B . A."
                    ],
                    "examTips": ["Centripetal force and magnetic Lorentz force always do ZERO work because force is always perpendicular to velocity."]
                }
            ],
            "misconceptions": ["Believing carrying a heavy load horizontally does work against gravity. Since displacement is horizontal, gravitational work is zero."],
            "formulas": [
                {
                    "label": "Work Done by Constant Force",
                    "formula": "W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta",
                    "description": "Scalar product of applied force vector and displacement vector.",
                    "variables": [
                        { "symbol": "F", "meaning": "Force Magnitude", "unit": "N" },
                        { "symbol": "d", "meaning": "Displacement Magnitude", "unit": "m" },
                        { "symbol": "\\theta", "meaning": "Angle Between Force & Displacement", "unit": "rad" },
                        { "symbol": "W", "meaning": "Mechanical Work Done", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "Kinetic Energy & The Work-Energy Theorem",
            "desc": "Derivation of kinetic energy K = 0.5*m*v^2, and work-energy theorem for constant and variable forces.",
            "notesOverview": "The Work-Energy Theorem states that the work done by the net force acting on a body equals the change in its kinetic energy: W_net = Delta K.",
            "notesSections": [
                {
                    "heading": "Work-Energy Theorem for Variable Force",
                    "paragraphs": [
                        "dW = F dx = m*(dv/dt)*dx = m*v*dv. Integrating from v_i to v_f gives W = 0.5*m*v_f^2 - 0.5*m*v_i^2 = Delta K.",
                        "The work-energy theorem is valid for all types of forces: conservative, non-conservative, external, and internal."
                    ],
                    "keyTakeaways": [
                        "Relation between kinetic energy and momentum: K = p^2 / (2m).",
                        "Work done by net force accounts for all velocity changes."
                    ],
                    "examTips": ["If a body moves at constant speed, the net work done by ALL forces combined is strictly zero."]
                }
            ],
            "misconceptions": ["Confusing work done by one individual force with work done by the NET resultant force in the work-energy theorem."],
            "formulas": [
                {
                    "label": "Work-Energy Theorem",
                    "formula": "W_{\\text{net}} = \\Delta K = \\frac{1}{2} m v_f^2 - \\frac{1}{2} m v_i^2",
                    "description": "Net mechanical work done by all forces equals the change in kinetic energy.",
                    "variables": [
                        { "symbol": "W_{\\text{net}}", "meaning": "Total Work Done", "unit": "J" },
                        { "symbol": "m", "meaning": "Particle Mass", "unit": "kg" },
                        { "symbol": "v_i, v_f", "meaning": "Initial & Final Speeds", "unit": "m/s" },
                        { "symbol": "\\Delta K", "meaning": "Kinetic Energy Change", "unit": "J" }
                    ]
                },
                {
                    "label": "Kinetic Energy - Momentum Relation",
                    "formula": "K = \\frac{p^2}{2 m}",
                    "description": "Kinetic energy expressed in terms of linear momentum magnitude p.",
                    "variables": [
                        { "symbol": "p", "meaning": "Linear Momentum", "unit": "kg m/s" },
                        { "symbol": "m", "meaning": "Body Mass", "unit": "kg" },
                        { "symbol": "K", "meaning": "Kinetic Energy", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "Work Done by Variable Force & Graphical Area Integration",
            "desc": "Integration W = integral(F dx), area under force-displacement F-x curve, and Hooke’s law restoring forces.",
            "notesOverview": "When force varies with position, total work is the definite integral of F(x) dx, corresponding to the area under the F-x curve.",
            "notesSections": [
                {
                    "heading": "Area under F-x Curve",
                    "paragraphs": [
                        "Divide displacement into infinitesimal strips dx. Work in each strip is dW = F(x)*dx.",
                        "Total work: W = integral_{x_i}^{x_f} F(x) dx. The sign of the area matches the sign of F(x)."
                    ],
                    "keyTakeaways": ["Area above displacement axis represents positive work; area below represents negative work."],
                    "examTips": ["Use simple geometric area formulas (triangles, rectangles) to evaluate work on piecewise-linear F-x graphs."]
                }
            ],
            "misconceptions": ["Multiplying final force by total displacement for variable forces. Integration is mandatory."],
            "formulas": [
                {
                    "label": "Variable Force Work Integral",
                    "formula": "W = \\int_{x_i}^{x_f} F(x) dx",
                    "description": "Definite integral of position-dependent force representing work done.",
                    "variables": [
                        { "symbol": "F(x)", "meaning": "Position-Dependent Force", "unit": "N" },
                        { "symbol": "x_i, x_f", "meaning": "Initial & Final Coordinates", "unit": "m" },
                        { "symbol": "W", "meaning": "Total Work Done", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "Conservative Forces, Potential Energy & The Spring Oscillator",
            "desc": "Conservative force criteria, path independence, curl/gradient F = -dU/dx, Hooke’s law, and spring potential energy U = 0.5*k*x^2.",
            "notesOverview": "A force is conservative if the work done in a closed loop is zero, or equivalently, work between two points is independent of path.",
            "notesSections": [
                {
                    "heading": "Potential Energy Function U(x)",
                    "paragraphs": [
                        "For conservative forces: F(x) = -dU/dx, meaning force is the negative gradient of potential energy.",
                        "For an ideal spring obeying Hooke’s law F = -k*x, restoring work done gives potential energy: U(x) = 0.5*k*x^2."
                    ],
                    "keyTakeaways": [
                        "Gravitational force, electrostatic force, and ideal spring force are conservative.",
                        "Frictional force and viscous drag are non-conservative (dissipative)."
                    ],
                    "examTips": ["Stable equilibrium occurs where dU/dx = 0 and d^2U/dx^2 > 0 (potential energy minimum)."]
                }
            ],
            "misconceptions": ["Defining absolute potential energy without choosing an explicit reference datum where U = 0."],
            "formulas": [
                {
                    "label": "Force-Potential Energy Relation",
                    "formula": "F(x) = -\\frac{dU}{dx}",
                    "description": "Conservative force is the negative spatial gradient of potential energy.",
                    "variables": [
                        { "symbol": "U(x)", "meaning": "Potential Energy Function", "unit": "J" },
                        { "symbol": "x", "meaning": "Position Coordinate", "unit": "m" },
                        { "symbol": "F(x)", "meaning": "Conservative Restoring Force", "unit": "N" }
                    ]
                },
                {
                    "label": "Elastic Potential Energy of Spring",
                    "formula": "U(x) = \\frac{1}{2} k x^2",
                    "description": "Energy stored in a spring of spring constant k compressed or extended by displacement x.",
                    "variables": [
                        { "symbol": "k", "meaning": "Spring Stiffness Constant", "unit": "N/m" },
                        { "symbol": "x", "meaning": "Elongation or Compression", "unit": "m" },
                        { "symbol": "U(x)", "meaning": "Elastic Potential Energy", "unit": "J" }
                    ]
                }
            ]
        },
        {
            "title": "The Law of Conservation of Mechanical Energy",
            "desc": "Total mechanical energy E = K + U, conservation in conservative force fields, and energy exchange bar charts.",
            "simulationId": "energy_conservation",
            "notesOverview": "In an isolated system governed solely by conservative forces, total mechanical energy E = K + U remains constant throughout motion.",
            "notesSections": [
                {
                    "heading": "Energy Exchange Between Kinetic and Potential Forms",
                    "paragraphs": [
                        "For a particle released from rest at height h, initial energy is entirely potential: E = m*g*h.",
                        "As it falls, potential energy decreases while kinetic energy increases by an identical amount: Delta K = -Delta U.",
                        "Just before impact, all energy is converted to kinetic: 0.5*m*v^2 = m*g*h -> v = sqrt(2*g*h)."
                    ],
                    "keyTakeaways": [
                        "Total mechanical energy is constant only in the absence of non-conservative dissipative forces.",
                        "When friction is present, W_nc = Delta E_mech = Delta(K + U) < 0 (thermal loss)."
                    ],
                    "examTips": ["Using energy conservation often provides a 1-line solution to problems that would require complex integration via kinematics."]
                }
            ],
            "misconceptions": ["Assuming mechanical energy is always conserved. When friction or inelastic collisions occur, mechanical energy degrades to thermal energy."],
            "formulas": [
                {
                    "label": "Conservation of Mechanical Energy",
                    "formula": "E = K + U = \\text{constant} \\implies \\Delta K + \\Delta U = 0",
                    "description": "Invariance of total mechanical energy in conservative fields.",
                    "variables": [
                        { "symbol": "K", "meaning": "Kinetic Energy", "unit": "J" },
                        { "symbol": "U", "meaning": "Potential Energy", "unit": "J" },
                        { "symbol": "E", "meaning": "Total Mechanical Energy", "unit": "J" }
                    ]
                },
                {
                    "label": "Free Fall Impact Velocity",
                    "formula": "v = \\sqrt{2 g h}",
                    "description": "Velocity attained after falling freely through vertical altitude h from rest.",
                    "variables": [
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "h", "meaning": "Vertical Drop Height", "unit": "m" },
                        { "symbol": "v", "meaning": "Impact Velocity", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Power, Work Rate & Mechanical Efficiency",
            "desc": "Average and instantaneous power, P = dW/dt = F . v, watt and horsepower units, and mechanical efficiency.",
            "notesOverview": "Power is the time rate at which work is done or energy is transferred: P = dW/dt = F . v.",
            "notesSections": [
                {
                    "heading": "Units and Instantaneous Power",
                    "paragraphs": [
                        "The SI unit of power is the watt (1 W = 1 J/s). Commercial power unit: 1 kilowatt-hour (kWh) = 3.6 x 10^6 J.",
                        "Instantaneous power P = F . v = F*v*cos theta."
                    ],
                    "keyTakeaways": [
                        "1 horsepower (hp) = 746 W.",
                        "Mechanical efficiency eta = (Useful Power Output) / (Total Power Input)."
                    ],
                    "examTips": ["Remember that kWh is a unit of ENERGY, not power."]
                }
            ],
            "misconceptions": ["Confusing power (rate of doing work, in watts) with work/energy (total amount, in joules)."],
            "formulas": [
                {
                    "label": "Instantaneous Power",
                    "formula": "P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v} = F v \\cos\\theta",
                    "description": "Scalar product of applied force vector and instantaneous velocity vector.",
                    "variables": [
                        { "symbol": "F", "meaning": "Applied Force", "unit": "N" },
                        { "symbol": "v", "meaning": "Instantaneous Velocity", "unit": "m/s" },
                        { "symbol": "\\theta", "meaning": "Force-Velocity Angle", "unit": "rad" },
                        { "symbol": "P", "meaning": "Mechanical Power", "unit": "W" }
                    ]
                }
            ]
        },
        {
            "title": "Collisions in 1D and 2D: Elastic, Inelastic & Coefficient of Restitution",
            "desc": "Linear momentum conservation, kinetic energy conservation criteria, perfectly inelastic collisions, and coefficient of restitution e.",
            "notesOverview": "In all isolated collisions, linear momentum is conserved. Elastic collisions conserve kinetic energy; inelastic collisions do not.",
            "notesSections": [
                {
                    "heading": "Coefficient of Restitution and 1D Elastic Collisions",
                    "paragraphs": [
                        "Coefficient of restitution: e = (v2 - v1) / (u1 - u2). For perfectly elastic collisions, e = 1; for perfectly inelastic collisions, e = 0.",
                        "In 1D elastic collision between equal masses (m1 = m2), the particles exchange their velocities completely."
                    ],
                    "keyTakeaways": [
                        "Kinetic energy lost in perfectly inelastic collision: Delta K = 0.5 * (m1*m2 / (m1 + m2)) * (u1 - u2)^2.",
                        "Oblique collisions require resolving momentum along and perpendicular to the common normal at impact."
                    ],
                    "examTips": ["In perfectly inelastic collisions (e = 0), the colliding bodies stick together and move with a common velocity."]
                }
            ],
            "misconceptions": ["Assuming momentum is lost in inelastic collisions. Momentum is ALWAYS conserved in isolated collisions; only kinetic energy is dissipated."],
            "formulas": [
                {
                    "label": "Coefficient of Restitution",
                    "formula": "e = \\frac{v_2 - v_1}{u_1 - u_2} = \\frac{\\text{Velocity of Separation}}{\\text{Velocity of Approach}}",
                    "description": "Ratio of relative velocity of separation to relative velocity of approach along common normal.",
                    "variables": [
                        { "symbol": "u_1, u_2", "meaning": "Velocities Before Collision", "unit": "m/s" },
                        { "symbol": "v_1, v_2", "meaning": "Velocities After Collision", "unit": "m/s" },
                        { "symbol": "e", "meaning": "Restitution Coefficient (0 <= e <= 1)", "unit": "-" }
                    ]
                },
                {
                    "label": "Common Velocity in Perfectly Inelastic Collision",
                    "formula": "v_c = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}",
                    "description": "Shared velocity of coalesced masses following perfectly inelastic impact (e = 0).",
                    "variables": [
                        { "symbol": "m_1, m_2", "meaning": "Colliding Masses", "unit": "kg" },
                        { "symbol": "u_1, u_2", "meaning": "Initial Velocities", "unit": "m/s" },
                        { "symbol": "v_c", "meaning": "Combined Final Velocity", "unit": "m/s" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-06": [
        {
            "title": "Centre of Mass of Two-Particle System & Rigid Bodies",
            "desc": "Centre of mass definition, coordinates for discrete particle systems, continuous mass distributions, and velocity of centre of mass.",
            "notesOverview": "The centre of mass is the unique geometric point where the entire mass of a system can be assumed to be concentrated for external translational dynamics.",
            "notesSections": [
                {
                    "heading": "Center of Mass Coordinates and Velocity",
                    "paragraphs": [
                        "For discrete masses: R_cm = sum(m_i * r_i) / sum(m_i). For two bodies, the centre of mass divides the separating distance inversely as their masses: m1*r1 = m2*r2.",
                        "Total linear momentum equals total mass times velocity of centre of mass: P = M * V_cm. External force governs centre of mass motion: F_ext = M * A_cm."
                    ],
                    "keyTakeaways": [
                        "Internal forces cannot alter the trajectory of the centre of mass.",
                        "For symmetrical bodies with uniform density, the centre of mass coincides with the geometric centre."
                    ],
                    "examTips": ["In explosions or internal collisions, the center of mass continues along its original parabolic or straight trajectory unaffected."]
                }
            ],
            "misconceptions": ["Assuming the centre of mass must lie inside the material of the body. (For rings and hollow cylinders, it lies in empty space)."],
            "formulas": [
                {
                    "label": "Centre of Mass Vector",
                    "formula": "\\vec{R}_{cm} = \\frac{\\sum m_i \\vec{r}_i}{\\sum m_i} = \\frac{1}{M} \\int \\vec{r} dm",
                    "description": "Mass-weighted average position vector of a multi-particle or continuous rigid system.",
                    "variables": [
                        { "symbol": "m_i", "meaning": "Mass of ith Particle", "unit": "kg" },
                        { "symbol": "\\vec{r}_i", "meaning": "Position Vector of ith Particle", "unit": "m" },
                        { "symbol": "M", "meaning": "Total System Mass", "unit": "kg" },
                        { "symbol": "\\vec{R}_{cm}", "meaning": "Centre of Mass Position", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Torque, Angular Momentum & Principle of Moments",
            "desc": "Torque tau = r x F, angular momentum L = r x p = I*omega, conservation of angular momentum, and rotational equilibrium.",
            "simulationId": "vector_cross_product",
            "notesOverview": "Torque is the rotational analogue of force, producing angular acceleration. Angular momentum is conserved when net external torque is zero.",
            "notesSections": [
                {
                    "heading": "Torque and Angular Momentum Dynamics",
                    "paragraphs": [
                        "Torque tau = r x F = r*F*sin theta. Its direction follows the Right-Hand Rule.",
                        "Newton’s second law for rotation: tau_net = dL/dt. When tau_ext = 0, total angular momentum L = I*omega = constant."
                    ],
                    "keyTakeaways": [
                        "A spinning figure skater pulling arms inward decreases moment of inertia I and therefore increases spin rate omega.",
                        "Rotational equilibrium requires net external torque to vanish about any chosen reference point."
                    ],
                    "examTips": ["Remember that torque depends on the chosen pivot origin; choose the pivot at the point with unknown forces to simplify equations."]
                }
            ],
            "misconceptions": ["Assuming angular momentum is conserved even when an external torque acts. Angular momentum is conserved only when NET external torque is zero."],
            "formulas": [
                {
                    "label": "Torque Vector",
                    "formula": "\\vec{\\tau} = \\vec{r} \\times \\vec{F}",
                    "description": "Rotational moment of force about a reference pivot point.",
                    "variables": [
                        { "symbol": "\\vec{r}", "meaning": "Position Vector from Pivot", "unit": "m" },
                        { "symbol": "\\vec{F}", "meaning": "Applied Force Vector", "unit": "N" },
                        { "symbol": "\\vec{\\tau}", "meaning": "Torque Vector", "unit": "N m" }
                    ]
                },
                {
                    "label": "Conservation of Angular Momentum",
                    "formula": "I_1 \\omega_1 = I_2 \\omega_2 = \\text{constant}",
                    "description": "Product of moment of inertia and angular velocity remains invariant under zero external torque.",
                    "variables": [
                        { "symbol": "I", "meaning": "Moment of Inertia", "unit": "kg m^2" },
                        { "symbol": "\\omega", "meaning": "Angular Velocity", "unit": "rad/s" }
                    ]
                }
            ]
        },
        {
            "title": "Moment of Inertia, Radius of Gyration & Parallel/Perpendicular Axes",
            "desc": "Rotational inertia I = sum(m_i * r_i^2), radius of gyration k, parallel and perpendicular axis theorems, and standard values for common shapes.",
            "notesOverview": "Moment of inertia measures a rigid body’s resistance to rotational acceleration, depending on mass distribution relative to the rotation axis.",
            "notesSections": [
                {
                    "heading": "Theorems of Moment of Inertia",
                    "paragraphs": [
                        "Parallel Axis Theorem: I = I_cm + M*d^2, where d is perpendicular distance between the parallel axes.",
                        "Perpendicular Axis Theorem (planar laminar bodies): I_z = I_x + I_y for axes in the plane of the lamina."
                    ],
                    "keyTakeaways": [
                        "Ring about central axis: I = M*R^2. Disc: I = 0.5*M*R^2.",
                        "Solid sphere: I = (2/5)*M*R^2. Hollow sphere: I = (2/3)*M*R^2.",
                        "Radius of gyration k = sqrt(I / M)."
                    ],
                    "examTips": ["The perpendicular axis theorem applies strictly to two-dimensional planar laminar bodies, NOT to 3D solid bodies."]
                }
            ],
            "misconceptions": ["Applying the perpendicular axis theorem to spheres or solid cylinders: it is valid ONLY for flat laminar 2D sheets."],
            "formulas": [
                {
                    "label": "Parallel Axis Theorem",
                    "formula": "I = I_{cm} + M d^2",
                    "description": "Moment of inertia about any arbitrary parallel axis displaced by distance d from center of mass.",
                    "variables": [
                        { "symbol": "I_{cm}", "meaning": "Moment of Inertia about CM Axis", "unit": "kg m^2" },
                        { "symbol": "M", "meaning": "Total Body Mass", "unit": "kg" },
                        { "symbol": "d", "meaning": "Perpendicular Separation Distance", "unit": "m" },
                        { "symbol": "I", "meaning": "Total Shifted Moment of Inertia", "unit": "kg m^2" }
                    ]
                },
                {
                    "label": "Radius of Gyration",
                    "formula": "k = \\sqrt{\\frac{I}{M}}",
                    "description": "Effective radial distance from the axis where the entire mass could be concentrated with identical rotational inertia.",
                    "variables": [
                        { "symbol": "I", "meaning": "Moment of Inertia", "unit": "kg m^2" },
                        { "symbol": "M", "meaning": "Total Mass", "unit": "kg" },
                        { "symbol": "k", "meaning": "Radius of Gyration", "unit": "m" }
                    ]
                }
            ]
        },
        {
            "title": "Kinematics & Dynamics of Rotational Motion about a Fixed Axis",
            "desc": "Rotational kinematic equations, work done by torque W = integral(tau d theta), rotational kinetic energy K_rot = 0.5*I*omega^2.",
            "notesOverview": "Rotational motion about a fixed axis mirrors linear translational motion, replacing x, v, a, m with theta, omega, alpha, I.",
            "notesSections": [
                {
                    "heading": "Analogy Between Linear and Rotational Mechanics",
                    "paragraphs": [
                        "Linear: x, v = dx/dt, a = dv/dt, F = ma, W = F*x, K = 0.5*m*v^2.",
                        "Rotational: theta, omega = d theta/dt, alpha = d omega/dt, tau = I*alpha, W = tau*theta, K = 0.5*I*omega^2.",
                        "Angular kinematic formulas: omega = omega0 + alpha*t; theta = omega0*t + 0.5*alpha*t^2; omega^2 = omega0^2 + 2*alpha*theta."
                    ],
                    "keyTakeaways": [
                        "Work done by torque: W = tau * Delta theta.",
                        "Instantaneous power in rotation: P = tau * omega."
                    ],
                    "examTips": ["Ensure angular units are in radians and radians/second before using kinematic relations."]
                }
            ],
            "misconceptions": ["Using revolutions per minute (rpm) directly in kinematic equations without multiplying by 2*pi/60 to convert to rad/s."],
            "formulas": [
                {
                    "label": "Rotational Kinetic Energy",
                    "formula": "K_{\\text{rot}} = \\frac{1}{2} I \\omega^2",
                    "description": "Kinetic energy stored in a body rotating with angular velocity omega.",
                    "variables": [
                        { "symbol": "I", "meaning": "Moment of Inertia", "unit": "kg m^2" },
                        { "symbol": "\\omega", "meaning": "Angular Velocity", "unit": "rad/s" },
                        { "symbol": "K_{\\text{rot}}", "meaning": "Rotational Kinetic Energy", "unit": "J" }
                    ]
                },
                {
                    "label": "Rotational Power",
                    "formula": "P = \\tau \\omega",
                    "description": "Mechanical power delivered by applied torque tau at angular speed omega.",
                    "variables": [
                        { "symbol": "\\tau", "meaning": "Applied Torque", "unit": "N m" },
                        { "symbol": "\\omega", "meaning": "Angular Speed", "unit": "rad/s" },
                        { "symbol": "P", "meaning": "Power Delivered", "unit": "W" }
                    ]
                }
            ]
        },
        {
            "title": "Rolling Motion Without Slipping & Energy of a Rolling Body",
            "desc": "Combination of translation and rotation, contact point instantaneous rest, v_cm = R*omega, and total kinetic energy.",
            "notesOverview": "Pure rolling is the superposition of pure translation of centre of mass with pure rotation about the centre of mass.",
            "notesSections": [
                {
                    "heading": "Kinematics and Total Energy in Pure Rolling",
                    "paragraphs": [
                        "At the instantaneous point of contact with ground, forward translational velocity cancels backward tangential velocity: v_contact = v_cm - R*omega = 0 -> v_cm = R*omega.",
                        "Total kinetic energy of a rolling body: K_total = K_trans + K_rot = 0.5*M*v_cm^2 + 0.5*I_cm*omega^2 = 0.5*M*v_cm^2 * (1 + k^2 / R^2).",
                        "Acceleration down an incline of angle theta: a = (g * sin theta) / (1 + k^2 / R^2)."
                    ],
                    "keyTakeaways": [
                        "Solid sphere (k^2/R^2 = 2/5) rolls down faster than a disc (1/2), which rolls down faster than a ring (1).",
                        "Static friction causes pure rolling but does ZERO net work because the contact point is instantaneously at rest."
                    ],
                    "examTips": ["Heavier mass does NOT roll faster: acceleration down an incline depends solely on the shape factor k^2/R^2, independent of mass M and radius R."]
                }
            ],
            "misconceptions": ["Thinking friction does negative work during pure rolling. Static friction provides torque but does zero work since contact point has zero displacement."],
            "formulas": [
                {
                    "label": "Total Kinetic Energy in Pure Rolling",
                    "formula": "K_{\\text{total}} = \\frac{1}{2} M v_{cm}^2 \\left(1 + \\frac{k^2}{R^2}\\right)",
                    "description": "Sum of translational and rotational kinetic energy for rolling without slip.",
                    "variables": [
                        { "symbol": "M", "meaning": "Total Mass", "unit": "kg" },
                        { "symbol": "v_{cm}", "meaning": "Translational Speed of CM", "unit": "m/s" },
                        { "symbol": "k", "meaning": "Radius of Gyration", "unit": "m" },
                        { "symbol": "R", "meaning": "Radius of Body", "unit": "m" }
                    ]
                },
                {
                    "label": "Acceleration of Rolling Body on Incline",
                    "formula": "a = \\frac{g \\sin\\theta}{1 + \\frac{k^2}{R^2}}",
                    "description": "Linear acceleration down an inclined plane of tilt angle theta for pure rolling.",
                    "variables": [
                        { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                        { "symbol": "\\theta", "meaning": "Incline Angle", "unit": "rad" },
                        { "symbol": "k^2/R^2", "meaning": "Geometric Shape Factor", "unit": "-" },
                        { "symbol": "a", "meaning": "Linear Acceleration", "unit": "m/s^2" }
                    ]
                }
            ]
        }
    ],

    "PHY-11-07": [
        {
            "title": "Kepler’s Laws of Planetary Motion & Orbital Geometry",
            "desc": "Kepler’s first law (ellipses), second law (areal velocity conservation), and third law (T^2 proportional to a^3).",
            "simulationId": "kepler_orbit",
            "notesOverview": "Johannes Kepler formulated three empirical laws of planetary motion based on Tycho Brahe’s astronomical observations, which Newton later derived from the inverse-square law.",
            "notesSections": [
                {
                    "heading": "The Three Laws of Planetary Motion",
                    "paragraphs": [
                        "1. Law of Orbits: All planets move in elliptical orbits with the Sun located at one of the two foci.",
                        "2. Law of Areas: The line joining a planet to the Sun sweeps out equal areas in equal intervals of time: dA/dt = L / (2m) = constant. This is a direct consequence of conservation of angular momentum under central forces.",
                        "3. Law of Periods: The square of orbital period T is directly proportional to the cube of the semi-major axis a: T^2 = (4*pi^2 / (G*M)) * a^3."
                    ],
                    "keyTakeaways": [
                        "A planet moves fastest at perihelion (closest to Sun) and slowest at aphelion (farthest from Sun): r_peri * v_peri = r_aph * v_aph.",
                        "Central forces exert zero torque about the Sun, ensuring areal velocity is strictly constant."
                    ],
                    "examTips": ["Kepler’s third law constant (4*pi^2 / GM) depends solely on the mass of the central attracting body (Sun), not the planet."]
                }
            ],
            "misconceptions": ["Assuming planetary orbits are circular. Real orbits are ellipses with varying radial distances."],
            "formulas": [
                {
                    "label": "Kepler’s Second Law (Areal Velocity)",
                    "formula": "\\frac{dA}{dt} = \\frac{L}{2 m} = \\text{constant}",
                    "description": "Conservation of areal velocity arising from conservation of orbital angular momentum under central force.",
                    "variables": [
                        { "symbol": "dA/dt", "meaning": "Areal Velocity", "unit": "m^2/s" },
                        { "symbol": "L", "meaning": "Angular Momentum", "unit": "kg m^2/s" },
                        { "symbol": "m", "meaning": "Planet Mass", "unit": "kg" }
                    ]
                },
                {
                    "label": "Kepler’s Third Law (Harmonic Law)",
                    "formula": "T^2 = \\left(\\frac{4\\pi^2}{G M}\\right) a^3",
                    "description": "Square of revolution period proportional to cube of orbital semi-major axis.",
                    "variables": [
                        { "symbol": "T", "meaning": "Orbital Period", "unit": "s" },
                        { "symbol": "a", "meaning": "Semi-Major Axis", "unit": "m" },
                        { "symbol": "M", "meaning": "Central Attractor Mass", "unit": "kg" },
                        { "symbol": "G", "meaning": "Universal Gravitational Constant", "unit": "N m^2/kg^2" }
                    ]
                }
            ]
        },
        {
            "title": "Universal Law of Gravitation & Gravitational Constant G",
            "desc": "Newton’s inverse square law of universal gravitation, vector form, Cavendish balance experiment, and superposition principle.",
            "notesOverview": "Every particle in the universe attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of their separation distance.",
            "notesSections": [
                {
                    "heading": "Newton’s Gravitational Force and Cavendish Measurement",
                    "paragraphs": [
                        "Force magnitude: F = G * m1 * m2 / r^2. In vector form, F_12 = -G * m1 * m2 / r^2 * r_hat_12 (attractive central force).",
                        "Universal gravitational constant G = 6.674 x 10^-11 N m^2/kg^2 was first measured experimentally by Henry Cavendish in 1798 using a sensitive torsion balance."
                    ],
                    "keyTakeaways": [
                        "Gravitational force is independent of the intervening medium.",
                        "Gravitational force obeys the principle of linear superposition for multi-body systems."
                    ],
                    "examTips": ["The gravitational force between two spherically symmetric shells behaves as if all their mass were concentrated at their centres (Shell Theorem)."]
                }
            ],
            "misconceptions": ["Confusing universal constant G (6.67 x 10^-11 N m^2/kg^2) with local acceleration due to gravity g (9.8 m/s^2)."],
            "formulas": [
                {
                    "label": "Newton’s Universal Law of Gravitation",
                    "formula": "F = G \\frac{m_1 m_2}{r^2}",
                    "description": "Gravitational attraction force between two point masses separated by distance r.",
                    "variables": [
                        { "symbol": "G", "meaning": "Universal Gravitational Constant", "unit": "N m^2/kg^2" },
                        { "symbol": "m_1, m_2", "meaning": "Interacting Masses", "unit": "kg" },
                        { "symbol": "r", "meaning": "Centroid Separation", "unit": "m" },
                        { "symbol": "F", "meaning": "Gravitational Force", "unit": "N" }
                    ]
                }
            ]
        },
        {
            "title": "Acceleration Due to Gravity: Altitude, Depth & Earth Rotation",
            "desc": "Surface gravity g = G*M / R^2, variation of g with height h, depth d, latitude, and Earth’s oblate shape.",
            "notesOverview": "The effective acceleration due to gravity decreases both with altitude above Earth’s surface and with depth below the surface, vanishing at Earth’s center.",
            "notesSections": [
                {
                    "heading": "Variation of g with Height, Depth, and Rotation",
                    "paragraphs": [
                        "At altitude h above surface: g_h = g / (1 + h/R)^2. For small altitudes (h << R): g_h = g * (1 - 2h/R).",
                        "At depth d below surface: g_d = g * (1 - d/R). At the centre of Earth (d = R), g = 0.",
                        "Due to Earth’s rotation with angular speed omega at latitude lambda: g_eff = g - omega^2 * R * cos^2 lambda."
                    ],
                    "keyTakeaways": [
                        "Decrease in g at height h is double the decrease at the same depth d (for h << R).",
                        "Acceleration due to gravity is maximum at poles (where cos lambda = 0) and minimum at the equator."
                    ],
                    "examTips": ["Use the binomial approximation g_h = g*(1 - 2h/R) ONLY when h is small (less than 5% of Earth radius, h < 320 km). For large h, use g_h = g*R^2 / (R+h)^2."]
                }
            ],
            "misconceptions": ["Using the approximation g_h = g*(1 - 2h/R) for altitudes like h = R. For h = R, g_h = g/4, whereas the linear approximation erroneously gives negative value."],
            "formulas": [
                {
                    "label": "Gravity at Altitude h",
                    "formula": "g_h = g \\left(\\frac{R}{R + h}\\right)^2 \\approx g \\left(1 - \\frac{2h}{R}\\right)",
                    "description": "Gravitational acceleration at height h above Earth surface of radius R.",
                    "variables": [
                        { "symbol": "g", "meaning": "Surface Gravity", "unit": "m/s^2" },
                        { "symbol": "R", "meaning": "Earth Radius (6400 km)", "unit": "m" },
                        { "symbol": "h", "meaning": "Altitude", "unit": "m" },
                        { "symbol": "g_h", "meaning": "Acceleration at Height h", "unit": "m/s^2" }
                    ]
                },
                {
                    "label": "Gravity at Depth d",
                    "formula": "g_d = g \\left(1 - \\frac{d}{R}\\right)",
                    "description": "Gravitational acceleration at depth d below Earth surface.",
                    "variables": [
                        { "symbol": "d", "meaning": "Depth Below Surface", "unit": "m" },
                        { "symbol": "g_d", "meaning": "Acceleration at Depth d", "unit": "m/s^2" }
                    ]
                }
            ]
        },
        {
            "title": "Gravitational Potential Energy, Potential & Escape Speed",
            "desc": "Gravitational potential V = -GM/r, potential energy U = -G*M*m/r, binding energy, and escape velocity v_e = sqrt(2*g*R).",
            "notesOverview": "Gravitational potential energy is zero at infinity and negative everywhere in the attractive field: U(r) = -G*M*m / r. Escape speed is the minimum launch velocity required to break free into infinity.",
            "notesSections": [
                {
                    "heading": "Escape Speed Derivation from Energy Conservation",
                    "paragraphs": [
                        "To escape to infinity, total mechanical energy must be non-negative: E = 0.5*m*v_e^2 - G*M*m / R >= 0.",
                        "Escape speed from Earth’s surface: v_e = sqrt(2*G*M / R) = sqrt(2*g*R) = 11.2 km/s.",
                        "Escape speed is independent of projectile mass and projection angle (provided it does not strike the Earth)."
                    ],
                    "keyTakeaways": [
                        "Escape speed on the Moon is ~2.38 km/s, which is lower than thermal speeds of gases, explaining why Moon has no atmosphere.",
                        "Gravitational potential V is work done in bringing unit mass from infinity to distance r: V(r) = -GM / r."
                    ],
                    "examTips": ["Escape velocity depends on the mass and radius of the celestial body, NOT on the mass of the launched object."]
                }
            ],
            "misconceptions": ["Believing launch angle affects escape speed. As long as the object doesn't collide with the planet, escape speed is invariant with launch angle."],
            "formulas": [
                {
                    "label": "Gravitational Potential Energy",
                    "formula": "U(r) = -\\frac{G M m}{r}",
                    "description": "Potential energy of mass m at radial distance r from attractor mass M.",
                    "variables": [
                        { "symbol": "G", "meaning": "Gravitational Constant", "unit": "N m^2/kg^2" },
                        { "symbol": "M, m", "meaning": "Attractor & Test Masses", "unit": "kg" },
                        { "symbol": "r", "meaning": "Separation Distance", "unit": "m" },
                        { "symbol": "U(r)", "meaning": "Potential Energy", "unit": "J" }
                    ]
                },
                {
                    "label": "Escape Speed Formula",
                    "formula": "v_e = \\sqrt{\\frac{2 G M}{R}} = \\sqrt{2 g R}",
                    "description": "Minimum ballistic launch speed required to escape gravitational attraction to infinity.",
                    "variables": [
                        { "symbol": "g", "meaning": "Surface Gravity", "unit": "m/s^2" },
                        { "symbol": "R", "meaning": "Planet Radius", "unit": "m" },
                        { "symbol": "v_e", "meaning": "Escape Velocity", "unit": "m/s" }
                    ]
                }
            ]
        },
        {
            "title": "Earth Satellites: Orbital Speed, Period & Geostationary Orbits",
            "desc": "Orbital velocity v_o = sqrt(GM/r), period of satellite, binding energy, geostationary satellites (24h period, 36000 km), and polar satellites.",
            "notesOverview": "A satellite in circular orbit around Earth experiences centripetal acceleration balanced by gravitational attraction: m*v_o^2 / r = G*M*m / r^2.",
            "notesSections": [
                {
                    "heading": "Orbital Velocity and Energy Balance",
                    "paragraphs": [
                        "Orbital speed: v_o = sqrt(GM / r) = sqrt(g*R^2 / (R+h)). For orbit close to surface: v_o = sqrt(g*R) = 7.92 km/s = v_e / sqrt(2).",
                        "Kinetic energy: K = G*M*m / (2r). Potential energy: U = -G*M*m / r.",
                        "Total energy: E = K + U = -G*M*m / (2r) = -K. Binding energy is +G*M*m / (2r)."
                    ],
                    "keyTakeaways": [
                        "Geostationary satellites orbit in the equatorial plane with period T = 24 hours at altitude ~35,800 km, rotating from west to east.",
                        "Polar satellites orbit at low altitudes (~500-800 km) in north-south meridian planes, used for environmental and remote sensing."
                    ],
                    "examTips": ["Total energy of a bound satellite is NEGATIVE. To move a satellite to a higher orbit, you must ADD energy, even though its orbital speed decreases!"]
                }
            ],
            "misconceptions": ["Thinking satellites in higher orbits travel faster. Orbital speed v_o = sqrt(GM/r) is inversely proportional to sqrt(r), so higher orbits have slower speeds."],
            "formulas": [
                {
                    "label": "Orbital Velocity",
                    "formula": "v_o = \\sqrt{\\frac{G M}{r}} = \\sqrt{\\frac{G M}{R + h}}",
                    "description": "Speed required for circular stable orbit at radius r = R + h.",
                    "variables": [
                        { "symbol": "M", "meaning": "Earth Mass", "unit": "kg" },
                        { "symbol": "r", "meaning": "Orbital Radius", "unit": "m" },
                        { "symbol": "v_o", "meaning": "Orbital Velocity", "unit": "m/s" }
                    ]
                },
                {
                    "label": "Satellite Total Mechanical Energy",
                    "formula": "E = -\\frac{G M m}{2 r} = -K = \\frac{1}{2} U",
                    "description": "Total bound mechanical energy of an orbiting satellite.",
                    "variables": [
                        { "symbol": "K", "meaning": "Orbital Kinetic Energy", "unit": "J" },
                        { "symbol": "U", "meaning": "Gravitational Potential Energy", "unit": "J" },
                        { "symbol": "E", "meaning": "Total Mechanical Energy", "unit": "J" }
                    ]
                }
            ]
        }
    ]
}
