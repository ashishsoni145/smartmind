import type { TopicNode } from '@/lib/types/curriculum';

export const ALL_NCERT_TOPICS: Record<string, TopicNode[]> = {
  "c0000011-0000-0000-0000-000000000001": [
    {
      "id": "top-phy-11-01-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-01-T01",
      "title": "The International System of Units (SI) & Base Standards",
      "description": "Seven fundamental SI base units, supplementary radian and steradian units, standard metric prefixes and operational conventions.",
      "sequenceOrder": 1,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The International System of Units (SI) is an absolute, rationalized, coherent decimal system adopted internationally in 1971 by the 14th General Conference on Weights and Measures (CGPM).",
        "sections": [
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
        "commonMisconceptions": [
          "Believing radian and steradian possess physical dimensions: they are dimensionless supplementary units [M^0 L^0 T^0]."
        ]
      },
      "formulas": [
        {
          "label": "Plane Angle Definition",
          "formula": "\\theta = \\frac{s}{r}",
          "description": "Angle subtended by arc length s at radius r in radians.",
          "variables": [
            {
              "symbol": "s",
              "meaning": "Arc Length",
              "unit": "m"
            },
            {
              "symbol": "r",
              "meaning": "Radius",
              "unit": "m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Plane Angle",
              "unit": "rad"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-01-01",
          "title": "The International System of Units (SI) & Base Standards Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for The International System of Units (SI) & Base Standards.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-01-01",
          "title": "The International System of Units (SI) & Base Standards",
          "summary": "Seven fundamental SI base units, supplementary radian and steradian units, standard metric prefixes and operational conventions."
        }
      ]
    },
    {
      "id": "top-phy-11-01-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-01-T02",
      "title": "Measurement of Length, Parallax Method & Astronomical Scales",
      "description": "Triangulation, parallax method for stellar distances, molecular layer estimations, and microscopic measuring instruments.",
      "sequenceOrder": 2,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Direct measurements are limited to terrestrial scales (verniers, micrometers). For planetary distances, the angular parallax method is required.",
        "sections": [
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
            "examTips": [
              "Always convert angles to radians before applying D = b / theta."
            ]
          }
        ],
        "commonMisconceptions": [
          "Directly plugging angles in degrees into parallax equations without radian conversion."
        ]
      },
      "formulas": [
        {
          "label": "Parallax Distance Formula",
          "formula": "D = \\frac{b}{\\theta}",
          "description": "Distance to a celestial object using baseline separation b and parallax angle theta in radians.",
          "variables": [
            {
              "symbol": "b",
              "meaning": "Baseline Separation",
              "unit": "m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Parallax Angle",
              "unit": "rad"
            },
            {
              "symbol": "D",
              "meaning": "Distance to Celestial Object",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-01-02",
          "title": "Measurement of Length, Parallax Method & Astronomical Scales Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Measurement of Length, Parallax Method & Astronomical Scales.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-01-02",
          "title": "Measurement of Length, Parallax Method & Astronomical Scales",
          "summary": "Triangulation, parallax method for stellar distances, molecular layer estimations, and microscopic measuring instruments."
        }
      ]
    },
    {
      "id": "top-phy-11-01-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-01-T03",
      "title": "Significant Figures, Rounding Rules & Error Propagation",
      "description": "Systematic and random errors, absolute, relative, and percentage errors, rules of significant figures in arithmetic operations.",
      "sequenceOrder": 3,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Every scientific measurement contains uncertainty. Reliable digits plus the first uncertain digit constitute significant figures.",
        "sections": [
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
            "examTips": [
              "Relative errors always add up; never subtract fractional errors even if quantities are divided."
            ]
          }
        ],
        "commonMisconceptions": [
          "Subtracting percentage errors in quotient expressions. Errors always accumulate."
        ]
      },
      "formulas": [
        {
          "label": "Fractional Error Propagation",
          "formula": "\\frac{\\Delta Z}{Z} = p \\frac{\\Delta A}{A} + q \\frac{\\Delta B}{B} + r \\frac{\\Delta C}{C}",
          "description": "Maximum relative error for generalized power function Z = (A^p * B^q) / C^r.",
          "variables": [
            {
              "symbol": "Z",
              "meaning": "Physical Quantity",
              "unit": "-"
            },
            {
              "symbol": "\\Delta Z",
              "meaning": "Absolute Uncertainty",
              "unit": "-"
            },
            {
              "symbol": "p, q, r",
              "meaning": "Power Exponents",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-01-03",
          "title": "Significant Figures, Rounding Rules & Error Propagation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Significant Figures, Rounding Rules & Error Propagation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-01-03",
          "title": "Significant Figures, Rounding Rules & Error Propagation",
          "summary": "Systematic and random errors, absolute, relative, and percentage errors, rules of significant figures in arithmetic operations."
        }
      ]
    },
    {
      "id": "top-phy-11-01-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-01-T04",
      "title": "Dimensions of Physical Quantities & Dimensional Analysis",
      "description": "Dimensional formulas, principle of homogeneity, checking physical equations, converting units across systems, and deducing relations.",
      "sequenceOrder": 4,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Dimensional analysis uses dimensional homogeneity [M, L, T, I, Theta, N, J] to check equation validity and deduce proportional dependencies.",
        "sections": [
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
            "examTips": [
              "Use dimensional analysis to rapidly eliminate incorrect choices in objective examinations."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming dimensional correctness guarantees physical correctness. (An equation can be dimensionally homogeneous but physically wrong)."
        ]
      },
      "formulas": [
        {
          "label": "Unit System Conversion Formula",
          "formula": "n_2 = n_1 \\left(\\frac{M_1}{M_2}\\right)^a \\left(\\frac{L_1}{L_2}\\right)^b \\left(\\frac{T_1}{T_2}\\right)^c",
          "description": "Transformation of numerical values between two unit systems based on dimensional exponents.",
          "variables": [
            {
              "symbol": "n_1",
              "meaning": "Numerical Value in System 1",
              "unit": "-"
            },
            {
              "symbol": "n_2",
              "meaning": "Numerical Value in System 2",
              "unit": "-"
            },
            {
              "symbol": "a, b, c",
              "meaning": "Dimensional Powers",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-01-04",
          "title": "Dimensions of Physical Quantities & Dimensional Analysis Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Dimensions of Physical Quantities & Dimensional Analysis.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-01-04",
          "title": "Dimensions of Physical Quantities & Dimensional Analysis",
          "summary": "Dimensional formulas, principle of homogeneity, checking physical equations, converting units across systems, and deducing relations."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000001": [
    {
      "id": "top-phy-11-02-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-02-T01",
      "title": "Position, Path Length, Displacement & Reference Frames",
      "description": "Frame of reference, rectilinear coordinate axes, path length (scalar distance), and displacement vector.",
      "sequenceOrder": 1,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Motion is relative to an observer's reference frame. Path length is total scalar distance traversed, whereas displacement is the directed vector change in position.",
        "sections": [
          {
            "heading": "Displacement vs Path Length",
            "paragraphs": [
              "Displacement Delta x = x2 - x1 is the shortest vector distance between initial and final points.",
              "Magnitude of displacement <= path length. They are equal only for unidirectional rectilinear motion without turning back."
            ],
            "keyTakeaways": [
              "Displacement can be zero when a particle returns to origin, even though path length is non-zero."
            ],
            "examTips": [
              "Check whether velocity changes sign to detect reversal points when computing total distance."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming displacement equals path length for oscillating or reversing motion."
        ]
      },
      "formulas": [
        {
          "label": "Displacement Vector",
          "formula": "\\Delta x = x_2 - x_1",
          "description": "Net directed change between final and initial coordinates.",
          "variables": [
            {
              "symbol": "x_1",
              "meaning": "Initial Position",
              "unit": "m"
            },
            {
              "symbol": "x_2",
              "meaning": "Final Position",
              "unit": "m"
            },
            {
              "symbol": "\\Delta x",
              "meaning": "Displacement",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-02-01",
          "title": "Position, Path Length, Displacement & Reference Frames Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Position, Path Length, Displacement & Reference Frames.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-02-01",
          "title": "Position, Path Length, Displacement & Reference Frames",
          "summary": "Frame of reference, rectilinear coordinate axes, path length (scalar distance), and displacement vector."
        }
      ]
    },
    {
      "id": "top-phy-11-02-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-02-T02",
      "title": "Average Velocity, Average Speed & 1D Relative Motion",
      "description": "Average velocity as displacement over elapsed time, average speed as path length over elapsed time, and 1D relative velocity.",
      "sequenceOrder": 2,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Average velocity depends strictly on initial and final endpoints, while average speed accounts for all intermediate trajectory path segments.",
        "sections": [
          {
            "heading": "Harmonic and Arithmetic Means",
            "paragraphs": [
              "If equal distances are travelled at speeds v1 and v2, average speed is the harmonic mean: 2*v1*v2 / (v1 + v2).",
              "If equal times are spent travelling at speeds v1 and v2, average speed is the arithmetic mean: (v1 + v2) / 2."
            ],
            "keyTakeaways": [
              "Average speed is always greater than or equal to magnitude of average velocity."
            ],
            "examTips": [
              "Identify whether equal distance halves or equal time halves are given before choosing the formula."
            ]
          }
        ],
        "commonMisconceptions": [
          "Taking the arithmetic average (v1+v2)/2 when distances, rather than travel times, are equal."
        ]
      },
      "formulas": [
        {
          "label": "Average Velocity",
          "formula": "\\bar{v} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_2 - x_1}{t_2 - t_1}",
          "description": "Ratio of net displacement to total elapsed time.",
          "variables": [
            {
              "symbol": "\\Delta x",
              "meaning": "Net Displacement",
              "unit": "m"
            },
            {
              "symbol": "\\Delta t",
              "meaning": "Total Elapsed Time",
              "unit": "s"
            },
            {
              "symbol": "\\bar{v}",
              "meaning": "Average Velocity",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "1D Relative Velocity",
          "formula": "v_{AB} = v_A - v_B",
          "description": "Velocity of body A with respect to observer body B.",
          "variables": [
            {
              "symbol": "v_A",
              "meaning": "Velocity of Body A",
              "unit": "m/s"
            },
            {
              "symbol": "v_B",
              "meaning": "Velocity of Body B",
              "unit": "m/s"
            },
            {
              "symbol": "v_{AB}",
              "meaning": "Relative Velocity of A w.r.t B",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-02-02",
          "title": "Average Velocity, Average Speed & 1D Relative Motion Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Average Velocity, Average Speed & 1D Relative Motion.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-02-02",
          "title": "Average Velocity, Average Speed & 1D Relative Motion",
          "summary": "Average velocity as displacement over elapsed time, average speed as path length over elapsed time, and 1D relative velocity."
        }
      ]
    },
    {
      "id": "top-phy-11-02-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-02-T03",
      "title": "Instantaneous Velocity, Differential Calculus & Motion Graphs",
      "description": "Instantaneous velocity as time derivative dx/dt, graphical interpretation as tangent slope of x-t curve, and v-t graph area.",
      "sequenceOrder": 3,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Instantaneous velocity v = dx/dt represents the instantaneous rate of change of position at a given mathematical point in time.",
        "sections": [
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
            "examTips": [
              "Area below the time axis on a v-t plot represents negative displacement."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing average velocity over an interval with instantaneous velocity at a specific moment."
        ]
      },
      "formulas": [
        {
          "label": "Instantaneous Velocity Derivative",
          "formula": "v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt}",
          "description": "First time derivative of position coordinate representing instantaneous velocity.",
          "variables": [
            {
              "symbol": "x",
              "meaning": "Position Coordinate",
              "unit": "m"
            },
            {
              "symbol": "t",
              "meaning": "Time",
              "unit": "s"
            },
            {
              "symbol": "v",
              "meaning": "Instantaneous Velocity",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-02-03",
          "title": "Instantaneous Velocity, Differential Calculus & Motion Graphs Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Instantaneous Velocity, Differential Calculus & Motion Graphs.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-02-03",
          "title": "Instantaneous Velocity, Differential Calculus & Motion Graphs",
          "summary": "Instantaneous velocity as time derivative dx/dt, graphical interpretation as tangent slope of x-t curve, and v-t graph area."
        }
      ]
    },
    {
      "id": "top-phy-11-02-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-02-T04",
      "title": "Uniform Acceleration, Kinematic Equations & Calculus Derivations",
      "description": "Uniformly accelerated motion, integration derivations, and three fundamental kinematic relations.",
      "sequenceOrder": 4,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "For constant acceleration, kinematics equations link displacement, initial velocity, final velocity, acceleration, and time.",
        "sections": [
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
            "examTips": [
              "If acceleration varies with time or position, you MUST use calculus integration: v = integral(a dt) or v dv = a dx."
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying v = u + at when acceleration depends on position or velocity."
        ]
      },
      "formulas": [
        {
          "label": "First Kinematic Equation",
          "formula": "v = v_0 + a t",
          "description": "Final velocity under constant rectilinear acceleration a.",
          "variables": [
            {
              "symbol": "v_0",
              "meaning": "Initial Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "a",
              "meaning": "Constant Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "t",
              "meaning": "Elapsed Time",
              "unit": "s"
            },
            {
              "symbol": "v",
              "meaning": "Final Velocity",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "Second Kinematic Equation",
          "formula": "x = v_0 t + \\frac{1}{2} a t^2",
          "description": "Position displacement as a quadratic function of time under constant acceleration.",
          "variables": [
            {
              "symbol": "v_0",
              "meaning": "Initial Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "a",
              "meaning": "Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "t",
              "meaning": "Elapsed Time",
              "unit": "s"
            },
            {
              "symbol": "x",
              "meaning": "Net Displacement",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Third Kinematic Equation",
          "formula": "v^2 = v_0^2 + 2 a x",
          "description": "Time-independent relation connecting velocity squares with displacement.",
          "variables": [
            {
              "symbol": "v_0",
              "meaning": "Initial Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "v",
              "meaning": "Final Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "a",
              "meaning": "Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "x",
              "meaning": "Displacement",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-02-04",
          "title": "Uniform Acceleration, Kinematic Equations & Calculus Derivations Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Uniform Acceleration, Kinematic Equations & Calculus Derivations with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "rectilinear_kinematics"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-02-04",
          "title": "Uniform Acceleration, Kinematic Equations & Calculus Derivations",
          "summary": "Uniformly accelerated motion, integration derivations, and three fundamental kinematic relations.",
          "simulationId": "rectilinear_kinematics"
        }
      ]
    },
    {
      "id": "top-phy-11-02-05",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "PHY-11-02-T05",
      "title": "Free Fall Under Gravity & Galileo’s Law of Odd Numbers",
      "description": "Vertical motion under earth gravity g = 9.8 m/s^2, time of flight, maximum height, and ratios of distances.",
      "sequenceOrder": 5,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "In vacuum, all bodies dropped from rest experience equal downward acceleration g regardless of mass.",
        "sections": [
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
            "examTips": [
              "Assign an explicit upward positive coordinate system before writing signs for u, g, and s."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking heavier bodies fall faster under gravity in vacuum. Acceleration g is independent of body mass."
        ]
      },
      "formulas": [
        {
          "label": "Maximum Height in Free Fall",
          "formula": "H = \\frac{u^2}{2 g}",
          "description": "Maximum vertical altitude achieved by a body projected upward with speed u.",
          "variables": [
            {
              "symbol": "u",
              "meaning": "Initial Upward Speed",
              "unit": "m/s"
            },
            {
              "symbol": "g",
              "meaning": "Acceleration Due to Gravity",
              "unit": "m/s^2"
            },
            {
              "symbol": "H",
              "meaning": "Peak Altitude",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Total Free Fall Flight Time",
          "formula": "T = \\frac{2 u}{g}",
          "description": "Total time taken to ascend to peak height and return to initial level.",
          "variables": [
            {
              "symbol": "u",
              "meaning": "Launch Speed",
              "unit": "m/s"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "T",
              "meaning": "Total Time of Flight",
              "unit": "s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-02-05",
          "title": "Free Fall Under Gravity & Galileo’s Law of Odd Numbers Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Free Fall Under Gravity & Galileo’s Law of Odd Numbers.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-02-05",
          "title": "Free Fall Under Gravity & Galileo’s Law of Odd Numbers",
          "summary": "Vertical motion under earth gravity g = 9.8 m/s^2, time of flight, maximum height, and ratios of distances."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000002": [
    {
      "id": "top-phy-11-03-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-11-03-T01",
      "title": "Scalars and Vectors, Vector Operations & Unit Vectors",
      "description": "Scalar and vector definitions, triangle law, parallelogram law of vector addition, null vector, and Cartesian unit vectors i, j, k.",
      "sequenceOrder": 1,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Vectors possess both magnitude and direction, obeying geometric vector addition rules rather than simple algebraic addition.",
        "sections": [
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
            "examTips": [
              "Remember that physical quantities with magnitude and direction (like electric current) are NOT vectors unless they obey vector addition laws."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming any quantity with direction is a vector (e.g. current has direction but adds algebraically)."
        ]
      },
      "formulas": [
        {
          "label": "Resultant Vector Magnitude",
          "formula": "R = \\sqrt{A^2 + B^2 + 2 A B \\cos\\theta}",
          "description": "Magnitude of resultant vector formed by adding two vectors at angle theta.",
          "variables": [
            {
              "symbol": "A",
              "meaning": "Magnitude of Vector A",
              "unit": "-"
            },
            {
              "symbol": "B",
              "meaning": "Magnitude of Vector B",
              "unit": "-"
            },
            {
              "symbol": "\\theta",
              "meaning": "Enclosed Angle",
              "unit": "rad"
            },
            {
              "symbol": "R",
              "meaning": "Resultant Magnitude",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Resultant Direction Angle",
          "formula": "\\tan\\alpha = \\frac{B \\sin\\theta}{A + B \\cos\\theta}",
          "description": "Orientation angle alpha of the resultant vector relative to vector A.",
          "variables": [
            {
              "symbol": "\\alpha",
              "meaning": "Angle w.r.t Vector A",
              "unit": "rad"
            },
            {
              "symbol": "\\theta",
              "meaning": "Angle Between A and B",
              "unit": "rad"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-03-01",
          "title": "Scalars and Vectors, Vector Operations & Unit Vectors Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Scalars and Vectors, Vector Operations & Unit Vectors.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-03-01",
          "title": "Scalars and Vectors, Vector Operations & Unit Vectors",
          "summary": "Scalar and vector definitions, triangle law, parallelogram law of vector addition, null vector, and Cartesian unit vectors i, j, k."
        }
      ]
    },
    {
      "id": "top-phy-11-03-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-11-03-T02",
      "title": "Resolution of Vectors in a Plane & Rectangular Components",
      "description": "Orthogonal decomposition of a 2D vector into Ax and Ay, direction cosines, and vector representation in Cartesian form.",
      "sequenceOrder": 2,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Any vector in the XY plane can be uniquely resolved into perpendicular components: A = Ax*i + Ay*j.",
        "sections": [
          {
            "heading": "Orthogonal Projection and Magnitude",
            "paragraphs": [
              "Ax = A*cos theta, Ay = A*sin theta, where theta is angle with X-axis.",
              "Vector magnitude is given by Pythagorean theorem: |A| = sqrt(Ax^2 + Ay^2)."
            ],
            "keyTakeaways": [
              "Splitting forces into orthogonal components allows solving 2D equilibrium as two independent 1D equations."
            ],
            "examTips": [
              "Always resolve along and perpendicular to the inclined plane when solving incline problems."
            ]
          }
        ],
        "commonMisconceptions": [
          "Forgetting that component signs depend on the chosen Cartesian quadrant."
        ]
      },
      "formulas": [
        {
          "label": "2D Vector Decomposition",
          "formula": "\\vec{A} = A_x \\hat{i} + A_y \\hat{j} = (A \\cos\\theta) \\hat{i} + (A \\sin\\theta) \\hat{j}",
          "description": "Orthogonal representation of 2D vector in Cartesian components.",
          "variables": [
            {
              "symbol": "A_x",
              "meaning": "Horizontal Component",
              "unit": "-"
            },
            {
              "symbol": "A_y",
              "meaning": "Vertical Component",
              "unit": "-"
            },
            {
              "symbol": "\\hat{i}, \\hat{j}",
              "meaning": "Unit Basis Vectors",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-03-02",
          "title": "Resolution of Vectors in a Plane & Rectangular Components Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Resolution of Vectors in a Plane & Rectangular Components.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-03-02",
          "title": "Resolution of Vectors in a Plane & Rectangular Components",
          "summary": "Orthogonal decomposition of a 2D vector into Ax and Ay, direction cosines, and vector representation in Cartesian form."
        }
      ]
    },
    {
      "id": "top-phy-11-03-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-11-03-T03",
      "title": "Motion in a Plane with Constant Acceleration & Superposition",
      "description": "Independence of orthogonal motion directions, 2D displacement and velocity vectors under constant acceleration.",
      "sequenceOrder": 3,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Motion in a plane can be treated as two concurrent, independent one-dimensional motions along orthogonal X and Y axes.",
        "sections": [
          {
            "heading": "Independence of Perpendicular Motions",
            "paragraphs": [
              "Horizontal motion with zero acceleration proceeds simultaneously and independently of vertical motion influenced by constant gravity.",
              "The total position vector is r(t) = (x0 + v0x*t + 0.5*ax*t^2)*i + (y0 + v0y*t + 0.5*ay*t^2)*j."
            ],
            "keyTakeaways": [
              "Time parameter t couples the independent horizontal and vertical coordinate equations."
            ],
            "examTips": [
              "Eliminate parameter t between x(t) and y(t) to derive the Cartesian trajectory equation y = f(x)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming vertical gravity alters horizontal velocity in ideal projectile motion."
        ]
      },
      "formulas": [
        {
          "label": "2D Position Vector",
          "formula": "\\vec{r}(t) = \\vec{r}_0 + \\vec{v}_0 t + \\frac{1}{2} \\vec{a} t^2",
          "description": "Position vector in XY plane as a function of time.",
          "variables": [
            {
              "symbol": "r(t)",
              "meaning": "Position Vector",
              "unit": "m"
            },
            {
              "symbol": "v_0",
              "meaning": "Initial Velocity Vector",
              "unit": "m/s"
            },
            {
              "symbol": "a",
              "meaning": "Constant Acceleration Vector",
              "unit": "m/s^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-03-03",
          "title": "Motion in a Plane with Constant Acceleration & Superposition Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Motion in a Plane with Constant Acceleration & Superposition.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-03-03",
          "title": "Motion in a Plane with Constant Acceleration & Superposition",
          "summary": "Independence of orthogonal motion directions, 2D displacement and velocity vectors under constant acceleration."
        }
      ]
    },
    {
      "id": "top-phy-11-03-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-11-03-T04",
      "title": "Projectile Motion Dynamics, Parabolic Trajectory & Flight Range",
      "description": "Ballistic flight path, time of maximum height, total flight time, horizontal range, maximum range angle, and trajectory equation.",
      "sequenceOrder": 4,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A projectile is any body thrown with initial velocity that moves freely under gravity alone. Its path is a symmetric parabola.",
        "sections": [
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
        "commonMisconceptions": [
          "Believing velocity is zero at highest point: only vertical component vy is zero; horizontal speed v0*cos theta remains non-zero.",
          "Thinking acceleration changes direction: gravitational acceleration g is ALWAYS vertically downward throughout flight."
        ]
      },
      "formulas": [
        {
          "label": "Total Flight Time",
          "formula": "T = \\frac{2 v_0 \\sin\\theta}{g}",
          "description": "Total duration from launch until returning to the launch horizontal plane.",
          "variables": [
            {
              "symbol": "v_0",
              "meaning": "Launch Speed",
              "unit": "m/s"
            },
            {
              "symbol": "\\theta",
              "meaning": "Launch Elevation Angle",
              "unit": "rad"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "T",
              "meaning": "Total Time of Flight",
              "unit": "s"
            }
          ]
        },
        {
          "label": "Maximum Peak Height",
          "formula": "H = \\frac{v_0^2 \\sin^2\\theta}{2 g}",
          "description": "Maximum vertical altitude achieved by the projectile above launch datum.",
          "variables": [
            {
              "symbol": "v_0",
              "meaning": "Launch Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "\\theta",
              "meaning": "Launch Angle",
              "unit": "rad"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "H",
              "meaning": "Maximum Vertical Height",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Horizontal Range",
          "formula": "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
          "description": "Horizontal distance traversed before projectile hits the original plane level.",
          "variables": [
            {
              "symbol": "v_0",
              "meaning": "Launch Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "\\theta",
              "meaning": "Launch Angle",
              "unit": "rad"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "R",
              "meaning": "Horizontal Range",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Cartesian Trajectory Parabola",
          "formula": "y = x \\tan\\theta - \\frac{g x^2}{2 v_0^2 \\cos^2\\theta} = x \\tan\\theta \\left(1 - \\frac{x}{R}\\right)",
          "description": "Parabolic profile equation expressing vertical position y in terms of horizontal coordinate x.",
          "variables": [
            {
              "symbol": "x",
              "meaning": "Horizontal Position",
              "unit": "m"
            },
            {
              "symbol": "y",
              "meaning": "Vertical Elevation",
              "unit": "m"
            },
            {
              "symbol": "R",
              "meaning": "Horizontal Range",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-03-04",
          "title": "Projectile Motion Dynamics, Parabolic Trajectory & Flight Range Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Projectile Motion Dynamics, Parabolic Trajectory & Flight Range with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "projectile_motion"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-03-04",
          "title": "Projectile Motion Dynamics, Parabolic Trajectory & Flight Range",
          "summary": "Ballistic flight path, time of maximum height, total flight time, horizontal range, maximum range angle, and trajectory equation.",
          "simulationId": "projectile_motion"
        }
      ]
    },
    {
      "id": "top-phy-11-03-05",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-11-03-T05",
      "title": "Uniform Circular Motion & Centripetal Acceleration",
      "description": "Angular displacement, angular velocity, tangential speed, radial centripetal acceleration vector a_c = omega^2 * R, and frequency.",
      "sequenceOrder": 5,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "When a particle moves in a circle at constant speed, its direction changes continuously, producing a radial inward acceleration toward the centre.",
        "sections": [
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
            "examTips": [
              "In uniform circular motion, acceleration is NOT constant because its direction rotates continuously."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking uniform circular motion has zero acceleration because speed is constant. Direction change requires centripetal acceleration."
        ]
      },
      "formulas": [
        {
          "label": "Centripetal Acceleration",
          "formula": "a_c = \\frac{v^2}{R} = \\omega^2 R = 4 \\pi^2 f^2 R",
          "description": "Inward radial acceleration maintaining circular motion of radius R.",
          "variables": [
            {
              "symbol": "v",
              "meaning": "Tangential Linear Speed",
              "unit": "m/s"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Velocity",
              "unit": "rad/s"
            },
            {
              "symbol": "R",
              "meaning": "Radius of Curvature",
              "unit": "m"
            },
            {
              "symbol": "a_c",
              "meaning": "Centripetal Acceleration",
              "unit": "m/s^2"
            }
          ]
        },
        {
          "label": "Linear-Angular Velocity Relation",
          "formula": "v = \\omega R = \\frac{2\\pi R}{T}",
          "description": "Tangential velocity linked to angular velocity and period of revolution.",
          "variables": [
            {
              "symbol": "v",
              "meaning": "Tangential Speed",
              "unit": "m/s"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Frequency",
              "unit": "rad/s"
            },
            {
              "symbol": "R",
              "meaning": "Orbital Radius",
              "unit": "m"
            },
            {
              "symbol": "T",
              "meaning": "Period of Revolution",
              "unit": "s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-03-05",
          "title": "Uniform Circular Motion & Centripetal Acceleration Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Uniform Circular Motion & Centripetal Acceleration with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "circular_motion"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-03-05",
          "title": "Uniform Circular Motion & Centripetal Acceleration",
          "summary": "Angular displacement, angular velocity, tangential speed, radial centripetal acceleration vector a_c = omega^2 * R, and frequency.",
          "simulationId": "circular_motion"
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000004": [
    {
      "id": "top-phy-11-04-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-11-04-T01",
      "title": "Inertia & Newton’s First Law of Motion",
      "description": "Galileo’s thought experiments, concept of inertia (rest, motion, direction), and definition of force as an external agent.",
      "sequenceOrder": 1,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Newton’s first law states every body continues in its state of rest or uniform motion in a straight line unless compelled by external unbalanced force.",
        "sections": [
          {
            "heading": "Qualitative Definition of Force and Inertia",
            "paragraphs": [
              "Inertia is the inherent resistance of matter to change its velocity state. Mass is the quantitative measure of inertia.",
              "An inertial frame is one where Newton’s first law holds without invoking pseudo-forces."
            ],
            "keyTakeaways": [
              "Zero net force implies zero acceleration, not necessarily zero velocity."
            ],
            "examTips": [
              "Distinguish clearly between inertia of rest, inertia of motion, and inertia of direction."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming force is required to keep an object moving. Force is required only to CHANGE motion."
        ]
      },
      "formulas": [
        {
          "label": "Equilibrium Condition (First Law)",
          "formula": "\\sum \\vec{F}_{ext} = 0 \\implies \\vec{a} = 0, \\; \\vec{v} = \\text{const}",
          "description": "Vanishing net external force guarantees constant velocity vector.",
          "variables": [
            {
              "symbol": "\\vec{F}_{ext}",
              "meaning": "Net External Force",
              "unit": "N"
            },
            {
              "symbol": "\\vec{a}",
              "meaning": "Acceleration Vector",
              "unit": "m/s^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-04-01",
          "title": "Inertia & Newton’s First Law of Motion Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Inertia & Newton’s First Law of Motion.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-04-01",
          "title": "Inertia & Newton’s First Law of Motion",
          "summary": "Galileo’s thought experiments, concept of inertia (rest, motion, direction), and definition of force as an external agent."
        }
      ]
    },
    {
      "id": "top-phy-11-04-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-11-04-T02",
      "title": "Newton’s Second Law of Motion, Momentum & Impulse",
      "description": "Linear momentum p = mv, rate of change of momentum, F = dp/dt = ma, SI unit newton, and impulse-momentum theorem.",
      "sequenceOrder": 2,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The rate of change of linear momentum is directly proportional to applied unbalanced force and takes place in the direction of the force.",
        "sections": [
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
            "examTips": [
              "Remember that for variable mass systems (like rockets), the v*(dm/dt) thrust term must be retained."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking F = ma holds for variable mass systems: the fundamental law is F = dp/dt."
        ]
      },
      "formulas": [
        {
          "label": "Newton’s Second Law",
          "formula": "\\vec{F}_{net} = \\frac{d\\vec{p}}{dt} = m \\vec{a}",
          "description": "Net applied force equals time rate of change of momentum, yielding m*a for constant mass.",
          "variables": [
            {
              "symbol": "m",
              "meaning": "Inertial Mass",
              "unit": "kg"
            },
            {
              "symbol": "\\vec{a}",
              "meaning": "Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "\\vec{F}_{net}",
              "meaning": "Net Force Vector",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Impulse-Momentum Theorem",
          "formula": "\\vec{J} = \\int_{t_1}^{t_2} \\vec{F} dt = \\Delta \\vec{p} = m \\vec{v}_f - m \\vec{v}_i",
          "description": "Time integral of force equals total change in linear momentum.",
          "variables": [
            {
              "symbol": "\\vec{J}",
              "meaning": "Impulse Vector",
              "unit": "N s"
            },
            {
              "symbol": "\\Delta\\vec{p}",
              "meaning": "Momentum Change",
              "unit": "kg m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-04-02",
          "title": "Newton’s Second Law of Motion, Momentum & Impulse Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Newton’s Second Law of Motion, Momentum & Impulse.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-04-02",
          "title": "Newton’s Second Law of Motion, Momentum & Impulse",
          "summary": "Linear momentum p = mv, rate of change of momentum, F = dp/dt = ma, SI unit newton, and impulse-momentum theorem."
        }
      ]
    },
    {
      "id": "top-phy-11-04-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-11-04-T03",
      "title": "Newton’s Third Law & Conservation of Linear Momentum",
      "description": "Action-reaction pairs, simultaneous generation on different bodies, and isolated system momentum conservation.",
      "sequenceOrder": 3,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "To every action there is always an equal and opposite reaction. Forces always occur in matched pairs acting on two different bodies.",
        "sections": [
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
            "examTips": [
              "When drawing Free Body Diagrams, include ONLY forces exerted ON the body, never forces exerted BY the body."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking action and reaction cancel each other out. They act on two distinct objects, so they cannot cancel."
        ]
      },
      "formulas": [
        {
          "label": "Newton’s Third Law",
          "formula": "\\vec{F}_{AB} = -\\vec{F}_{BA}",
          "description": "Mutual forces exerted between two interacting bodies A and B are equal in magnitude and opposite in direction.",
          "variables": [
            {
              "symbol": "\\vec{F}_{AB}",
              "meaning": "Force on A by B",
              "unit": "N"
            },
            {
              "symbol": "\\vec{F}_{BA}",
              "meaning": "Force on B by A",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Conservation of Linear Momentum",
          "formula": "m_1 \\vec{u}_1 + m_2 \\vec{u}_2 = m_1 \\vec{v}_1 + m_2 \\vec{v}_2",
          "description": "Total momentum before collision equals total momentum after collision in an isolated system.",
          "variables": [
            {
              "symbol": "m_1, m_2",
              "meaning": "Masses of Bodies",
              "unit": "kg"
            },
            {
              "symbol": "u_1, u_2",
              "meaning": "Initial Velocities",
              "unit": "m/s"
            },
            {
              "symbol": "v_1, v_2",
              "meaning": "Final Velocities",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-04-03",
          "title": "Newton’s Third Law & Conservation of Linear Momentum Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Newton’s Third Law & Conservation of Linear Momentum.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-04-03",
          "title": "Newton’s Third Law & Conservation of Linear Momentum",
          "summary": "Action-reaction pairs, simultaneous generation on different bodies, and isolated system momentum conservation."
        }
      ]
    },
    {
      "id": "top-phy-11-04-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-11-04-T04",
      "title": "Free Body Diagrams, Equilibrium & Pulley Incline Mechanics",
      "description": "Isolation of mechanical bodies, normal reaction, string tension, inclined planes, and coupled pulley systems.",
      "sequenceOrder": 4,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A Free Body Diagram (FBD) isolates a single body and visualizes all external contact and field forces acting on it.",
        "sections": [
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
            "examTips": [
              "Write F = ma separately for each isolated mass, then add the coupled equations to eliminate unknown string tension T."
            ]
          }
        ],
        "commonMisconceptions": [
          "Drawing string tension pushing an object: strings can ONLY pull, never push."
        ]
      },
      "formulas": [
        {
          "label": "Acceleration of Incline-Pulley System",
          "formula": "a = \\frac{m_2 - m_1 \\sin\\theta}{m_1 + m_2} g",
          "description": "Net acceleration of hanging mass m2 connected to mass m1 on frictionless incline of angle theta.",
          "variables": [
            {
              "symbol": "m_1",
              "meaning": "Mass on Incline",
              "unit": "kg"
            },
            {
              "symbol": "m_2",
              "meaning": "Hanging Mass",
              "unit": "kg"
            },
            {
              "symbol": "\\theta",
              "meaning": "Incline Angle",
              "unit": "rad"
            },
            {
              "symbol": "a",
              "meaning": "System Acceleration",
              "unit": "m/s^2"
            }
          ]
        },
        {
          "label": "Incline Normal Reaction Force",
          "formula": "N = m_1 g \\cos\\theta",
          "description": "Perpendicular contact normal force balancing weight component on incline.",
          "variables": [
            {
              "symbol": "N",
              "meaning": "Normal Contact Force",
              "unit": "N"
            },
            {
              "symbol": "m_1",
              "meaning": "Object Mass",
              "unit": "kg"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-04-04",
          "title": "Free Body Diagrams, Equilibrium & Pulley Incline Mechanics Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Free Body Diagrams, Equilibrium & Pulley Incline Mechanics with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "incline_fbd_pulley"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-04-04",
          "title": "Free Body Diagrams, Equilibrium & Pulley Incline Mechanics",
          "summary": "Isolation of mechanical bodies, normal reaction, string tension, inclined planes, and coupled pulley systems.",
          "simulationId": "incline_fbd_pulley"
        }
      ]
    },
    {
      "id": "top-phy-11-04-05",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-11-04-T05",
      "title": "Frictional Forces: Static, Limiting, Kinetic & Rolling Friction",
      "description": "Origin of friction, angle of friction, angle of repose, coefficients mu_s and mu_k, and rolling resistance.",
      "sequenceOrder": 5,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Friction opposes relative motion or impending motion between contacting surfaces. Static friction is a self-adjusting force up to its limiting threshold.",
        "sections": [
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
            "examTips": [
              "Static friction only equals mu_s * N when the body is on the verge of impending motion."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming static friction is always mu_s * N. It self-adjusts from 0 up to mu_s * N to match the applied force."
        ]
      },
      "formulas": [
        {
          "label": "Limiting Static Friction",
          "formula": "f_{s,\\max} = \\mu_s N",
          "description": "Maximum threshold of self-adjusting static friction before slip begins.",
          "variables": [
            {
              "symbol": "\\mu_s",
              "meaning": "Coefficient of Static Friction",
              "unit": "-"
            },
            {
              "symbol": "N",
              "meaning": "Normal Contact Reaction",
              "unit": "N"
            },
            {
              "symbol": "f_{s,\\max}",
              "meaning": "Limiting Friction Force",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Kinetic Friction Force",
          "formula": "f_k = \\mu_k N",
          "description": "Opposing resistive force during relative sliding motion.",
          "variables": [
            {
              "symbol": "\\mu_k",
              "meaning": "Coefficient of Kinetic Friction",
              "unit": "-"
            },
            {
              "symbol": "f_k",
              "meaning": "Kinetic Friction",
              "unit": "N"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-04-05",
          "title": "Frictional Forces: Static, Limiting, Kinetic & Rolling Friction Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Frictional Forces: Static, Limiting, Kinetic & Rolling Friction.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-04-05",
          "title": "Frictional Forces: Static, Limiting, Kinetic & Rolling Friction",
          "summary": "Origin of friction, angle of friction, angle of repose, coefficients mu_s and mu_k, and rolling resistance."
        }
      ]
    },
    {
      "id": "top-phy-11-04-06",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-11-04-T06",
      "title": "Circular Dynamics, Banked Curves & Centripetal Force",
      "description": "Centripetal force requirement, level curved road skidding speed, optimal banked curve angle without friction, and safe speed limits.",
      "sequenceOrder": 6,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "To round a curved path of radius R, an inward centripetal force F_c = m*v^2 / R is required, provided by friction, banking, or both.",
        "sections": [
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
            "examTips": [
              "At the rated banking speed, tyre wear is minimal because friction is not invoked."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking centripetal force is an extra physical force: it is the NET resultant of existing forces (normal, friction, gravity)."
        ]
      },
      "formulas": [
        {
          "label": "Maximum Speed on Level Road",
          "formula": "v_{\\max} = \\sqrt{\\mu_s g R}",
          "description": "Skidding threshold speed on horizontal flat curve of radius R.",
          "variables": [
            {
              "symbol": "\\mu_s",
              "meaning": "Tyre-Road Static Friction",
              "unit": "-"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "R",
              "meaning": "Radius of Curve",
              "unit": "m"
            },
            {
              "symbol": "v_{\\max}",
              "meaning": "Maximum Non-Skid Speed",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "Optimal Banking Angle (Zero Friction)",
          "formula": "\\tan\\theta = \\frac{v^2}{g R}",
          "description": "Banking inclination angle where normal reaction component alone balances centripetal demand.",
          "variables": [
            {
              "symbol": "\\theta",
              "meaning": "Banking Angle",
              "unit": "rad"
            },
            {
              "symbol": "v",
              "meaning": "Design Speed",
              "unit": "m/s"
            },
            {
              "symbol": "R",
              "meaning": "Radius of Turn",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Maximum Safe Speed on Banked Road with Friction",
          "formula": "v_{\\max} = \\sqrt{R g \\left(\\frac{\\mu_s + \\tan\\theta}{1 - \\mu_s \\tan\\theta}\\right)}",
          "description": "Upper velocity threshold preventing vehicle from sliding outward up a banked curve.",
          "variables": [
            {
              "symbol": "R",
              "meaning": "Radius of Curve",
              "unit": "m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Road Banking Angle",
              "unit": "rad"
            },
            {
              "symbol": "\\mu_s",
              "meaning": "Static Friction Coefficient",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-04-06",
          "title": "Circular Dynamics, Banked Curves & Centripetal Force Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Circular Dynamics, Banked Curves & Centripetal Force with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "road_banking"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-04-06",
          "title": "Circular Dynamics, Banked Curves & Centripetal Force",
          "summary": "Centripetal force requirement, level curved road skidding speed, optimal banked curve angle without friction, and safe speed limits.",
          "simulationId": "road_banking"
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000005": [
    {
      "id": "top-phy-11-05-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T01",
      "title": "Work Done by a Constant Force & Scalar Dot Product",
      "description": "Work definition W = F . d = F d cos theta, scalar product properties, positive, negative, and zero work regimes.",
      "sequenceOrder": 1,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Work is defined as the scalar product of force and displacement vectors: W = F . d = F*d*cos theta.",
        "sections": [
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
            "examTips": [
              "Centripetal force and magnetic Lorentz force always do ZERO work because force is always perpendicular to velocity."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing carrying a heavy load horizontally does work against gravity. Since displacement is horizontal, gravitational work is zero."
        ]
      },
      "formulas": [
        {
          "label": "Work Done by Constant Force",
          "formula": "W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta",
          "description": "Scalar product of applied force vector and displacement vector.",
          "variables": [
            {
              "symbol": "F",
              "meaning": "Force Magnitude",
              "unit": "N"
            },
            {
              "symbol": "d",
              "meaning": "Displacement Magnitude",
              "unit": "m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Angle Between Force & Displacement",
              "unit": "rad"
            },
            {
              "symbol": "W",
              "meaning": "Mechanical Work Done",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-05-01",
          "title": "Work Done by a Constant Force & Scalar Dot Product Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Work Done by a Constant Force & Scalar Dot Product.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-01",
          "title": "Work Done by a Constant Force & Scalar Dot Product",
          "summary": "Work definition W = F . d = F d cos theta, scalar product properties, positive, negative, and zero work regimes."
        }
      ]
    },
    {
      "id": "top-phy-11-05-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T02",
      "title": "Kinetic Energy & The Work-Energy Theorem",
      "description": "Derivation of kinetic energy K = 0.5*m*v^2, and work-energy theorem for constant and variable forces.",
      "sequenceOrder": 2,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Work-Energy Theorem states that the work done by the net force acting on a body equals the change in its kinetic energy: W_net = Delta K.",
        "sections": [
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
            "examTips": [
              "If a body moves at constant speed, the net work done by ALL forces combined is strictly zero."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing work done by one individual force with work done by the NET resultant force in the work-energy theorem."
        ]
      },
      "formulas": [
        {
          "label": "Work-Energy Theorem",
          "formula": "W_{\\text{net}} = \\Delta K = \\frac{1}{2} m v_f^2 - \\frac{1}{2} m v_i^2",
          "description": "Net mechanical work done by all forces equals the change in kinetic energy.",
          "variables": [
            {
              "symbol": "W_{\\text{net}}",
              "meaning": "Total Work Done",
              "unit": "J"
            },
            {
              "symbol": "m",
              "meaning": "Particle Mass",
              "unit": "kg"
            },
            {
              "symbol": "v_i, v_f",
              "meaning": "Initial & Final Speeds",
              "unit": "m/s"
            },
            {
              "symbol": "\\Delta K",
              "meaning": "Kinetic Energy Change",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Kinetic Energy - Momentum Relation",
          "formula": "K = \\frac{p^2}{2 m}",
          "description": "Kinetic energy expressed in terms of linear momentum magnitude p.",
          "variables": [
            {
              "symbol": "p",
              "meaning": "Linear Momentum",
              "unit": "kg m/s"
            },
            {
              "symbol": "m",
              "meaning": "Body Mass",
              "unit": "kg"
            },
            {
              "symbol": "K",
              "meaning": "Kinetic Energy",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-05-02",
          "title": "Kinetic Energy & The Work-Energy Theorem Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Kinetic Energy & The Work-Energy Theorem.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-02",
          "title": "Kinetic Energy & The Work-Energy Theorem",
          "summary": "Derivation of kinetic energy K = 0.5*m*v^2, and work-energy theorem for constant and variable forces."
        }
      ]
    },
    {
      "id": "top-phy-11-05-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T03",
      "title": "Work Done by Variable Force & Graphical Area Integration",
      "description": "Integration W = integral(F dx), area under force-displacement F-x curve, and Hooke’s law restoring forces.",
      "sequenceOrder": 3,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "When force varies with position, total work is the definite integral of F(x) dx, corresponding to the area under the F-x curve.",
        "sections": [
          {
            "heading": "Area under F-x Curve",
            "paragraphs": [
              "Divide displacement into infinitesimal strips dx. Work in each strip is dW = F(x)*dx.",
              "Total work: W = integral_{x_i}^{x_f} F(x) dx. The sign of the area matches the sign of F(x)."
            ],
            "keyTakeaways": [
              "Area above displacement axis represents positive work; area below represents negative work."
            ],
            "examTips": [
              "Use simple geometric area formulas (triangles, rectangles) to evaluate work on piecewise-linear F-x graphs."
            ]
          }
        ],
        "commonMisconceptions": [
          "Multiplying final force by total displacement for variable forces. Integration is mandatory."
        ]
      },
      "formulas": [
        {
          "label": "Variable Force Work Integral",
          "formula": "W = \\int_{x_i}^{x_f} F(x) dx",
          "description": "Definite integral of position-dependent force representing work done.",
          "variables": [
            {
              "symbol": "F(x)",
              "meaning": "Position-Dependent Force",
              "unit": "N"
            },
            {
              "symbol": "x_i, x_f",
              "meaning": "Initial & Final Coordinates",
              "unit": "m"
            },
            {
              "symbol": "W",
              "meaning": "Total Work Done",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-05-03",
          "title": "Work Done by Variable Force & Graphical Area Integration Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Work Done by Variable Force & Graphical Area Integration.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-03",
          "title": "Work Done by Variable Force & Graphical Area Integration",
          "summary": "Integration W = integral(F dx), area under force-displacement F-x curve, and Hooke’s law restoring forces."
        }
      ]
    },
    {
      "id": "top-phy-11-05-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T04",
      "title": "Conservative Forces, Potential Energy & The Spring Oscillator",
      "description": "Conservative force criteria, path independence, curl/gradient F = -dU/dx, Hooke’s law, and spring potential energy U = 0.5*k*x^2.",
      "sequenceOrder": 4,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A force is conservative if the work done in a closed loop is zero, or equivalently, work between two points is independent of path.",
        "sections": [
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
            "examTips": [
              "Stable equilibrium occurs where dU/dx = 0 and d^2U/dx^2 > 0 (potential energy minimum)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Defining absolute potential energy without choosing an explicit reference datum where U = 0."
        ]
      },
      "formulas": [
        {
          "label": "Force-Potential Energy Relation",
          "formula": "F(x) = -\\frac{dU}{dx}",
          "description": "Conservative force is the negative spatial gradient of potential energy.",
          "variables": [
            {
              "symbol": "U(x)",
              "meaning": "Potential Energy Function",
              "unit": "J"
            },
            {
              "symbol": "x",
              "meaning": "Position Coordinate",
              "unit": "m"
            },
            {
              "symbol": "F(x)",
              "meaning": "Conservative Restoring Force",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Elastic Potential Energy of Spring",
          "formula": "U(x) = \\frac{1}{2} k x^2",
          "description": "Energy stored in a spring of spring constant k compressed or extended by displacement x.",
          "variables": [
            {
              "symbol": "k",
              "meaning": "Spring Stiffness Constant",
              "unit": "N/m"
            },
            {
              "symbol": "x",
              "meaning": "Elongation or Compression",
              "unit": "m"
            },
            {
              "symbol": "U(x)",
              "meaning": "Elastic Potential Energy",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-05-04",
          "title": "Conservative Forces, Potential Energy & The Spring Oscillator Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Conservative Forces, Potential Energy & The Spring Oscillator.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-04",
          "title": "Conservative Forces, Potential Energy & The Spring Oscillator",
          "summary": "Conservative force criteria, path independence, curl/gradient F = -dU/dx, Hooke’s law, and spring potential energy U = 0.5*k*x^2."
        }
      ]
    },
    {
      "id": "top-phy-11-05-05",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T05",
      "title": "The Law of Conservation of Mechanical Energy",
      "description": "Total mechanical energy E = K + U, conservation in conservative force fields, and energy exchange bar charts.",
      "sequenceOrder": 5,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "In an isolated system governed solely by conservative forces, total mechanical energy E = K + U remains constant throughout motion.",
        "sections": [
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
            "examTips": [
              "Using energy conservation often provides a 1-line solution to problems that would require complex integration via kinematics."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming mechanical energy is always conserved. When friction or inelastic collisions occur, mechanical energy degrades to thermal energy."
        ]
      },
      "formulas": [
        {
          "label": "Conservation of Mechanical Energy",
          "formula": "E = K + U = \\text{constant} \\implies \\Delta K + \\Delta U = 0",
          "description": "Invariance of total mechanical energy in conservative fields.",
          "variables": [
            {
              "symbol": "K",
              "meaning": "Kinetic Energy",
              "unit": "J"
            },
            {
              "symbol": "U",
              "meaning": "Potential Energy",
              "unit": "J"
            },
            {
              "symbol": "E",
              "meaning": "Total Mechanical Energy",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Free Fall Impact Velocity",
          "formula": "v = \\sqrt{2 g h}",
          "description": "Velocity attained after falling freely through vertical altitude h from rest.",
          "variables": [
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "h",
              "meaning": "Vertical Drop Height",
              "unit": "m"
            },
            {
              "symbol": "v",
              "meaning": "Impact Velocity",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-05-05",
          "title": "The Law of Conservation of Mechanical Energy Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for The Law of Conservation of Mechanical Energy with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "energy_conservation"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-05",
          "title": "The Law of Conservation of Mechanical Energy",
          "summary": "Total mechanical energy E = K + U, conservation in conservative force fields, and energy exchange bar charts.",
          "simulationId": "energy_conservation"
        }
      ]
    },
    {
      "id": "top-phy-11-05-06",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T06",
      "title": "Power, Work Rate & Mechanical Efficiency",
      "description": "Average and instantaneous power, P = dW/dt = F . v, watt and horsepower units, and mechanical efficiency.",
      "sequenceOrder": 6,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Power is the time rate at which work is done or energy is transferred: P = dW/dt = F . v.",
        "sections": [
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
            "examTips": [
              "Remember that kWh is a unit of ENERGY, not power."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing power (rate of doing work, in watts) with work/energy (total amount, in joules)."
        ]
      },
      "formulas": [
        {
          "label": "Instantaneous Power",
          "formula": "P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v} = F v \\cos\\theta",
          "description": "Scalar product of applied force vector and instantaneous velocity vector.",
          "variables": [
            {
              "symbol": "F",
              "meaning": "Applied Force",
              "unit": "N"
            },
            {
              "symbol": "v",
              "meaning": "Instantaneous Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "\\theta",
              "meaning": "Force-Velocity Angle",
              "unit": "rad"
            },
            {
              "symbol": "P",
              "meaning": "Mechanical Power",
              "unit": "W"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-05-06",
          "title": "Power, Work Rate & Mechanical Efficiency Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Power, Work Rate & Mechanical Efficiency.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-06",
          "title": "Power, Work Rate & Mechanical Efficiency",
          "summary": "Average and instantaneous power, P = dW/dt = F . v, watt and horsepower units, and mechanical efficiency."
        }
      ]
    },
    {
      "id": "top-phy-11-05-07",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-11-05-T07",
      "title": "Collisions in 1D and 2D: Elastic, Inelastic & Coefficient of Restitution",
      "description": "Linear momentum conservation, kinetic energy conservation criteria, perfectly inelastic collisions, and coefficient of restitution e.",
      "sequenceOrder": 7,
      "weightagePercent": 0.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "In all isolated collisions, linear momentum is conserved. Elastic collisions conserve kinetic energy; inelastic collisions do not.",
        "sections": [
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
            "examTips": [
              "In perfectly inelastic collisions (e = 0), the colliding bodies stick together and move with a common velocity."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming momentum is lost in inelastic collisions. Momentum is ALWAYS conserved in isolated collisions; only kinetic energy is dissipated."
        ]
      },
      "formulas": [
        {
          "label": "Coefficient of Restitution",
          "formula": "e = \\frac{v_2 - v_1}{u_1 - u_2} = \\frac{\\text{Velocity of Separation}}{\\text{Velocity of Approach}}",
          "description": "Ratio of relative velocity of separation to relative velocity of approach along common normal.",
          "variables": [
            {
              "symbol": "u_1, u_2",
              "meaning": "Velocities Before Collision",
              "unit": "m/s"
            },
            {
              "symbol": "v_1, v_2",
              "meaning": "Velocities After Collision",
              "unit": "m/s"
            },
            {
              "symbol": "e",
              "meaning": "Restitution Coefficient (0 <= e <= 1)",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Common Velocity in Perfectly Inelastic Collision",
          "formula": "v_c = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2}",
          "description": "Shared velocity of coalesced masses following perfectly inelastic impact (e = 0).",
          "variables": [
            {
              "symbol": "m_1, m_2",
              "meaning": "Colliding Masses",
              "unit": "kg"
            },
            {
              "symbol": "u_1, u_2",
              "meaning": "Initial Velocities",
              "unit": "m/s"
            },
            {
              "symbol": "v_c",
              "meaning": "Combined Final Velocity",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-05-07",
          "title": "Collisions in 1D and 2D: Elastic, Inelastic & Coefficient of Restitution Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Collisions in 1D and 2D: Elastic, Inelastic & Coefficient of Restitution.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-05-07",
          "title": "Collisions in 1D and 2D: Elastic, Inelastic & Coefficient of Restitution",
          "summary": "Linear momentum conservation, kinetic energy conservation criteria, perfectly inelastic collisions, and coefficient of restitution e."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000006": [
    {
      "id": "top-phy-11-06-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-11-06-T01",
      "title": "Centre of Mass of Two-Particle System & Rigid Bodies",
      "description": "Centre of mass definition, coordinates for discrete particle systems, continuous mass distributions, and velocity of centre of mass.",
      "sequenceOrder": 1,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The centre of mass is the unique geometric point where the entire mass of a system can be assumed to be concentrated for external translational dynamics.",
        "sections": [
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
            "examTips": [
              "In explosions or internal collisions, the center of mass continues along its original parabolic or straight trajectory unaffected."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming the centre of mass must lie inside the material of the body. (For rings and hollow cylinders, it lies in empty space)."
        ]
      },
      "formulas": [
        {
          "label": "Centre of Mass Vector",
          "formula": "\\vec{R}_{cm} = \\frac{\\sum m_i \\vec{r}_i}{\\sum m_i} = \\frac{1}{M} \\int \\vec{r} dm",
          "description": "Mass-weighted average position vector of a multi-particle or continuous rigid system.",
          "variables": [
            {
              "symbol": "m_i",
              "meaning": "Mass of ith Particle",
              "unit": "kg"
            },
            {
              "symbol": "\\vec{r}_i",
              "meaning": "Position Vector of ith Particle",
              "unit": "m"
            },
            {
              "symbol": "M",
              "meaning": "Total System Mass",
              "unit": "kg"
            },
            {
              "symbol": "\\vec{R}_{cm}",
              "meaning": "Centre of Mass Position",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-06-01",
          "title": "Centre of Mass of Two-Particle System & Rigid Bodies Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Centre of Mass of Two-Particle System & Rigid Bodies.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-06-01",
          "title": "Centre of Mass of Two-Particle System & Rigid Bodies",
          "summary": "Centre of mass definition, coordinates for discrete particle systems, continuous mass distributions, and velocity of centre of mass."
        }
      ]
    },
    {
      "id": "top-phy-11-06-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-11-06-T02",
      "title": "Torque, Angular Momentum & Principle of Moments",
      "description": "Torque tau = r x F, angular momentum L = r x p = I*omega, conservation of angular momentum, and rotational equilibrium.",
      "sequenceOrder": 2,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Torque is the rotational analogue of force, producing angular acceleration. Angular momentum is conserved when net external torque is zero.",
        "sections": [
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
            "examTips": [
              "Remember that torque depends on the chosen pivot origin; choose the pivot at the point with unknown forces to simplify equations."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming angular momentum is conserved even when an external torque acts. Angular momentum is conserved only when NET external torque is zero."
        ]
      },
      "formulas": [
        {
          "label": "Torque Vector",
          "formula": "\\vec{\\tau} = \\vec{r} \\times \\vec{F}",
          "description": "Rotational moment of force about a reference pivot point.",
          "variables": [
            {
              "symbol": "\\vec{r}",
              "meaning": "Position Vector from Pivot",
              "unit": "m"
            },
            {
              "symbol": "\\vec{F}",
              "meaning": "Applied Force Vector",
              "unit": "N"
            },
            {
              "symbol": "\\vec{\\tau}",
              "meaning": "Torque Vector",
              "unit": "N m"
            }
          ]
        },
        {
          "label": "Conservation of Angular Momentum",
          "formula": "I_1 \\omega_1 = I_2 \\omega_2 = \\text{constant}",
          "description": "Product of moment of inertia and angular velocity remains invariant under zero external torque.",
          "variables": [
            {
              "symbol": "I",
              "meaning": "Moment of Inertia",
              "unit": "kg m^2"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Velocity",
              "unit": "rad/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-06-02",
          "title": "Torque, Angular Momentum & Principle of Moments Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Torque, Angular Momentum & Principle of Moments with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "vector_cross_product"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-06-02",
          "title": "Torque, Angular Momentum & Principle of Moments",
          "summary": "Torque tau = r x F, angular momentum L = r x p = I*omega, conservation of angular momentum, and rotational equilibrium.",
          "simulationId": "vector_cross_product"
        }
      ]
    },
    {
      "id": "top-phy-11-06-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-11-06-T03",
      "title": "Moment of Inertia, Radius of Gyration & Parallel/Perpendicular Axes",
      "description": "Rotational inertia I = sum(m_i * r_i^2), radius of gyration k, parallel and perpendicular axis theorems, and standard values for common shapes.",
      "sequenceOrder": 3,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Moment of inertia measures a rigid body’s resistance to rotational acceleration, depending on mass distribution relative to the rotation axis.",
        "sections": [
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
            "examTips": [
              "The perpendicular axis theorem applies strictly to two-dimensional planar laminar bodies, NOT to 3D solid bodies."
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying the perpendicular axis theorem to spheres or solid cylinders: it is valid ONLY for flat laminar 2D sheets."
        ]
      },
      "formulas": [
        {
          "label": "Parallel Axis Theorem",
          "formula": "I = I_{cm} + M d^2",
          "description": "Moment of inertia about any arbitrary parallel axis displaced by distance d from center of mass.",
          "variables": [
            {
              "symbol": "I_{cm}",
              "meaning": "Moment of Inertia about CM Axis",
              "unit": "kg m^2"
            },
            {
              "symbol": "M",
              "meaning": "Total Body Mass",
              "unit": "kg"
            },
            {
              "symbol": "d",
              "meaning": "Perpendicular Separation Distance",
              "unit": "m"
            },
            {
              "symbol": "I",
              "meaning": "Total Shifted Moment of Inertia",
              "unit": "kg m^2"
            }
          ]
        },
        {
          "label": "Radius of Gyration",
          "formula": "k = \\sqrt{\\frac{I}{M}}",
          "description": "Effective radial distance from the axis where the entire mass could be concentrated with identical rotational inertia.",
          "variables": [
            {
              "symbol": "I",
              "meaning": "Moment of Inertia",
              "unit": "kg m^2"
            },
            {
              "symbol": "M",
              "meaning": "Total Mass",
              "unit": "kg"
            },
            {
              "symbol": "k",
              "meaning": "Radius of Gyration",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-06-03",
          "title": "Moment of Inertia, Radius of Gyration & Parallel/Perpendicular Axes Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Moment of Inertia, Radius of Gyration & Parallel/Perpendicular Axes.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-06-03",
          "title": "Moment of Inertia, Radius of Gyration & Parallel/Perpendicular Axes",
          "summary": "Rotational inertia I = sum(m_i * r_i^2), radius of gyration k, parallel and perpendicular axis theorems, and standard values for common shapes."
        }
      ]
    },
    {
      "id": "top-phy-11-06-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-11-06-T04",
      "title": "Kinematics & Dynamics of Rotational Motion about a Fixed Axis",
      "description": "Rotational kinematic equations, work done by torque W = integral(tau d theta), rotational kinetic energy K_rot = 0.5*I*omega^2.",
      "sequenceOrder": 4,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Rotational motion about a fixed axis mirrors linear translational motion, replacing x, v, a, m with theta, omega, alpha, I.",
        "sections": [
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
            "examTips": [
              "Ensure angular units are in radians and radians/second before using kinematic relations."
            ]
          }
        ],
        "commonMisconceptions": [
          "Using revolutions per minute (rpm) directly in kinematic equations without multiplying by 2*pi/60 to convert to rad/s."
        ]
      },
      "formulas": [
        {
          "label": "Rotational Kinetic Energy",
          "formula": "K_{\\text{rot}} = \\frac{1}{2} I \\omega^2",
          "description": "Kinetic energy stored in a body rotating with angular velocity omega.",
          "variables": [
            {
              "symbol": "I",
              "meaning": "Moment of Inertia",
              "unit": "kg m^2"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Velocity",
              "unit": "rad/s"
            },
            {
              "symbol": "K_{\\text{rot}}",
              "meaning": "Rotational Kinetic Energy",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Rotational Power",
          "formula": "P = \\tau \\omega",
          "description": "Mechanical power delivered by applied torque tau at angular speed omega.",
          "variables": [
            {
              "symbol": "\\tau",
              "meaning": "Applied Torque",
              "unit": "N m"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Speed",
              "unit": "rad/s"
            },
            {
              "symbol": "P",
              "meaning": "Power Delivered",
              "unit": "W"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-06-04",
          "title": "Kinematics & Dynamics of Rotational Motion about a Fixed Axis Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Kinematics & Dynamics of Rotational Motion about a Fixed Axis.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-06-04",
          "title": "Kinematics & Dynamics of Rotational Motion about a Fixed Axis",
          "summary": "Rotational kinematic equations, work done by torque W = integral(tau d theta), rotational kinetic energy K_rot = 0.5*I*omega^2."
        }
      ]
    },
    {
      "id": "top-phy-11-06-05",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-11-06-T05",
      "title": "Rolling Motion Without Slipping & Energy of a Rolling Body",
      "description": "Combination of translation and rotation, contact point instantaneous rest, v_cm = R*omega, and total kinetic energy.",
      "sequenceOrder": 5,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Pure rolling is the superposition of pure translation of centre of mass with pure rotation about the centre of mass.",
        "sections": [
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
            "examTips": [
              "Heavier mass does NOT roll faster: acceleration down an incline depends solely on the shape factor k^2/R^2, independent of mass M and radius R."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking friction does negative work during pure rolling. Static friction provides torque but does zero work since contact point has zero displacement."
        ]
      },
      "formulas": [
        {
          "label": "Total Kinetic Energy in Pure Rolling",
          "formula": "K_{\\text{total}} = \\frac{1}{2} M v_{cm}^2 \\left(1 + \\frac{k^2}{R^2}\\right)",
          "description": "Sum of translational and rotational kinetic energy for rolling without slip.",
          "variables": [
            {
              "symbol": "M",
              "meaning": "Total Mass",
              "unit": "kg"
            },
            {
              "symbol": "v_{cm}",
              "meaning": "Translational Speed of CM",
              "unit": "m/s"
            },
            {
              "symbol": "k",
              "meaning": "Radius of Gyration",
              "unit": "m"
            },
            {
              "symbol": "R",
              "meaning": "Radius of Body",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Acceleration of Rolling Body on Incline",
          "formula": "a = \\frac{g \\sin\\theta}{1 + \\frac{k^2}{R^2}}",
          "description": "Linear acceleration down an inclined plane of tilt angle theta for pure rolling.",
          "variables": [
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "\\theta",
              "meaning": "Incline Angle",
              "unit": "rad"
            },
            {
              "symbol": "k^2/R^2",
              "meaning": "Geometric Shape Factor",
              "unit": "-"
            },
            {
              "symbol": "a",
              "meaning": "Linear Acceleration",
              "unit": "m/s^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-06-05",
          "title": "Rolling Motion Without Slipping & Energy of a Rolling Body Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Rolling Motion Without Slipping & Energy of a Rolling Body.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-06-05",
          "title": "Rolling Motion Without Slipping & Energy of a Rolling Body",
          "summary": "Combination of translation and rotation, contact point instantaneous rest, v_cm = R*omega, and total kinetic energy."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000007": [
    {
      "id": "top-phy-11-07-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-11-07-T01",
      "title": "Kepler’s Laws of Planetary Motion & Orbital Geometry",
      "description": "Kepler’s first law (ellipses), second law (areal velocity conservation), and third law (T^2 proportional to a^3).",
      "sequenceOrder": 1,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Johannes Kepler formulated three empirical laws of planetary motion based on Tycho Brahe’s astronomical observations, which Newton later derived from the inverse-square law.",
        "sections": [
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
            "examTips": [
              "Kepler’s third law constant (4*pi^2 / GM) depends solely on the mass of the central attracting body (Sun), not the planet."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming planetary orbits are circular. Real orbits are ellipses with varying radial distances."
        ]
      },
      "formulas": [
        {
          "label": "Kepler’s Second Law (Areal Velocity)",
          "formula": "\\frac{dA}{dt} = \\frac{L}{2 m} = \\text{constant}",
          "description": "Conservation of areal velocity arising from conservation of orbital angular momentum under central force.",
          "variables": [
            {
              "symbol": "dA/dt",
              "meaning": "Areal Velocity",
              "unit": "m^2/s"
            },
            {
              "symbol": "L",
              "meaning": "Angular Momentum",
              "unit": "kg m^2/s"
            },
            {
              "symbol": "m",
              "meaning": "Planet Mass",
              "unit": "kg"
            }
          ]
        },
        {
          "label": "Kepler’s Third Law (Harmonic Law)",
          "formula": "T^2 = \\left(\\frac{4\\pi^2}{G M}\\right) a^3",
          "description": "Square of revolution period proportional to cube of orbital semi-major axis.",
          "variables": [
            {
              "symbol": "T",
              "meaning": "Orbital Period",
              "unit": "s"
            },
            {
              "symbol": "a",
              "meaning": "Semi-Major Axis",
              "unit": "m"
            },
            {
              "symbol": "M",
              "meaning": "Central Attractor Mass",
              "unit": "kg"
            },
            {
              "symbol": "G",
              "meaning": "Universal Gravitational Constant",
              "unit": "N m^2/kg^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-11-07-01",
          "title": "Kepler’s Laws of Planetary Motion & Orbital Geometry Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Kepler’s Laws of Planetary Motion & Orbital Geometry with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "kepler_orbit"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-07-01",
          "title": "Kepler’s Laws of Planetary Motion & Orbital Geometry",
          "summary": "Kepler’s first law (ellipses), second law (areal velocity conservation), and third law (T^2 proportional to a^3).",
          "simulationId": "kepler_orbit"
        }
      ]
    },
    {
      "id": "top-phy-11-07-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-11-07-T02",
      "title": "Universal Law of Gravitation & Gravitational Constant G",
      "description": "Newton’s inverse square law of universal gravitation, vector form, Cavendish balance experiment, and superposition principle.",
      "sequenceOrder": 2,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Every particle in the universe attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of their separation distance.",
        "sections": [
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
            "examTips": [
              "The gravitational force between two spherically symmetric shells behaves as if all their mass were concentrated at their centres (Shell Theorem)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing universal constant G (6.67 x 10^-11 N m^2/kg^2) with local acceleration due to gravity g (9.8 m/s^2)."
        ]
      },
      "formulas": [
        {
          "label": "Newton’s Universal Law of Gravitation",
          "formula": "F = G \\frac{m_1 m_2}{r^2}",
          "description": "Gravitational attraction force between two point masses separated by distance r.",
          "variables": [
            {
              "symbol": "G",
              "meaning": "Universal Gravitational Constant",
              "unit": "N m^2/kg^2"
            },
            {
              "symbol": "m_1, m_2",
              "meaning": "Interacting Masses",
              "unit": "kg"
            },
            {
              "symbol": "r",
              "meaning": "Centroid Separation",
              "unit": "m"
            },
            {
              "symbol": "F",
              "meaning": "Gravitational Force",
              "unit": "N"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-07-02",
          "title": "Universal Law of Gravitation & Gravitational Constant G Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Universal Law of Gravitation & Gravitational Constant G.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-07-02",
          "title": "Universal Law of Gravitation & Gravitational Constant G",
          "summary": "Newton’s inverse square law of universal gravitation, vector form, Cavendish balance experiment, and superposition principle."
        }
      ]
    },
    {
      "id": "top-phy-11-07-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-11-07-T03",
      "title": "Acceleration Due to Gravity: Altitude, Depth & Earth Rotation",
      "description": "Surface gravity g = G*M / R^2, variation of g with height h, depth d, latitude, and Earth’s oblate shape.",
      "sequenceOrder": 3,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The effective acceleration due to gravity decreases both with altitude above Earth’s surface and with depth below the surface, vanishing at Earth’s center.",
        "sections": [
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
            "examTips": [
              "Use the binomial approximation g_h = g*(1 - 2h/R) ONLY when h is small (less than 5% of Earth radius, h < 320 km). For large h, use g_h = g*R^2 / (R+h)^2."
            ]
          }
        ],
        "commonMisconceptions": [
          "Using the approximation g_h = g*(1 - 2h/R) for altitudes like h = R. For h = R, g_h = g/4, whereas the linear approximation erroneously gives negative value."
        ]
      },
      "formulas": [
        {
          "label": "Gravity at Altitude h",
          "formula": "g_h = g \\left(\\frac{R}{R + h}\\right)^2 \\approx g \\left(1 - \\frac{2h}{R}\\right)",
          "description": "Gravitational acceleration at height h above Earth surface of radius R.",
          "variables": [
            {
              "symbol": "g",
              "meaning": "Surface Gravity",
              "unit": "m/s^2"
            },
            {
              "symbol": "R",
              "meaning": "Earth Radius (6400 km)",
              "unit": "m"
            },
            {
              "symbol": "h",
              "meaning": "Altitude",
              "unit": "m"
            },
            {
              "symbol": "g_h",
              "meaning": "Acceleration at Height h",
              "unit": "m/s^2"
            }
          ]
        },
        {
          "label": "Gravity at Depth d",
          "formula": "g_d = g \\left(1 - \\frac{d}{R}\\right)",
          "description": "Gravitational acceleration at depth d below Earth surface.",
          "variables": [
            {
              "symbol": "d",
              "meaning": "Depth Below Surface",
              "unit": "m"
            },
            {
              "symbol": "g_d",
              "meaning": "Acceleration at Depth d",
              "unit": "m/s^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-07-03",
          "title": "Acceleration Due to Gravity: Altitude, Depth & Earth Rotation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Acceleration Due to Gravity: Altitude, Depth & Earth Rotation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-07-03",
          "title": "Acceleration Due to Gravity: Altitude, Depth & Earth Rotation",
          "summary": "Surface gravity g = G*M / R^2, variation of g with height h, depth d, latitude, and Earth’s oblate shape."
        }
      ]
    },
    {
      "id": "top-phy-11-07-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-11-07-T04",
      "title": "Gravitational Potential Energy, Potential & Escape Speed",
      "description": "Gravitational potential V = -GM/r, potential energy U = -G*M*m/r, binding energy, and escape velocity v_e = sqrt(2*g*R).",
      "sequenceOrder": 4,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Gravitational potential energy is zero at infinity and negative everywhere in the attractive field: U(r) = -G*M*m / r. Escape speed is the minimum launch velocity required to break free into infinity.",
        "sections": [
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
            "examTips": [
              "Escape velocity depends on the mass and radius of the celestial body, NOT on the mass of the launched object."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing launch angle affects escape speed. As long as the object doesn't collide with the planet, escape speed is invariant with launch angle."
        ]
      },
      "formulas": [
        {
          "label": "Gravitational Potential Energy",
          "formula": "U(r) = -\\frac{G M m}{r}",
          "description": "Potential energy of mass m at radial distance r from attractor mass M.",
          "variables": [
            {
              "symbol": "G",
              "meaning": "Gravitational Constant",
              "unit": "N m^2/kg^2"
            },
            {
              "symbol": "M, m",
              "meaning": "Attractor & Test Masses",
              "unit": "kg"
            },
            {
              "symbol": "r",
              "meaning": "Separation Distance",
              "unit": "m"
            },
            {
              "symbol": "U(r)",
              "meaning": "Potential Energy",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Escape Speed Formula",
          "formula": "v_e = \\sqrt{\\frac{2 G M}{R}} = \\sqrt{2 g R}",
          "description": "Minimum ballistic launch speed required to escape gravitational attraction to infinity.",
          "variables": [
            {
              "symbol": "g",
              "meaning": "Surface Gravity",
              "unit": "m/s^2"
            },
            {
              "symbol": "R",
              "meaning": "Planet Radius",
              "unit": "m"
            },
            {
              "symbol": "v_e",
              "meaning": "Escape Velocity",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-07-04",
          "title": "Gravitational Potential Energy, Potential & Escape Speed Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Gravitational Potential Energy, Potential & Escape Speed.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-07-04",
          "title": "Gravitational Potential Energy, Potential & Escape Speed",
          "summary": "Gravitational potential V = -GM/r, potential energy U = -G*M*m/r, binding energy, and escape velocity v_e = sqrt(2*g*R)."
        }
      ]
    },
    {
      "id": "top-phy-11-07-05",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-11-07-T05",
      "title": "Earth Satellites: Orbital Speed, Period & Geostationary Orbits",
      "description": "Orbital velocity v_o = sqrt(GM/r), period of satellite, binding energy, geostationary satellites (24h period, 36000 km), and polar satellites.",
      "sequenceOrder": 5,
      "weightagePercent": 1.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A satellite in circular orbit around Earth experiences centripetal acceleration balanced by gravitational attraction: m*v_o^2 / r = G*M*m / r^2.",
        "sections": [
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
            "examTips": [
              "Total energy of a bound satellite is NEGATIVE. To move a satellite to a higher orbit, you must ADD energy, even though its orbital speed decreases!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking satellites in higher orbits travel faster. Orbital speed v_o = sqrt(GM/r) is inversely proportional to sqrt(r), so higher orbits have slower speeds."
        ]
      },
      "formulas": [
        {
          "label": "Orbital Velocity",
          "formula": "v_o = \\sqrt{\\frac{G M}{r}} = \\sqrt{\\frac{G M}{R + h}}",
          "description": "Speed required for circular stable orbit at radius r = R + h.",
          "variables": [
            {
              "symbol": "M",
              "meaning": "Earth Mass",
              "unit": "kg"
            },
            {
              "symbol": "r",
              "meaning": "Orbital Radius",
              "unit": "m"
            },
            {
              "symbol": "v_o",
              "meaning": "Orbital Velocity",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "Satellite Total Mechanical Energy",
          "formula": "E = -\\frac{G M m}{2 r} = -K = \\frac{1}{2} U",
          "description": "Total bound mechanical energy of an orbiting satellite.",
          "variables": [
            {
              "symbol": "K",
              "meaning": "Orbital Kinetic Energy",
              "unit": "J"
            },
            {
              "symbol": "U",
              "meaning": "Gravitational Potential Energy",
              "unit": "J"
            },
            {
              "symbol": "E",
              "meaning": "Total Mechanical Energy",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-07-05",
          "title": "Earth Satellites: Orbital Speed, Period & Geostationary Orbits Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Earth Satellites: Orbital Speed, Period & Geostationary Orbits.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-07-05",
          "title": "Earth Satellites: Orbital Speed, Period & Geostationary Orbits",
          "summary": "Orbital velocity v_o = sqrt(GM/r), period of satellite, binding energy, geostationary satellites (24h period, 36000 km), and polar satellites."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000008": [
    {
      "id": "top-phy-11-08-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "PHY-11-08-T01",
      "title": "Elastic Behaviour of Solids & Stress-Strain Concepts",
      "description": "Intermolecular forces, deforming force, restoring force, definitions of stress and strain, tensile, compressive, shearing, and hydraulic stress.",
      "sequenceOrder": 1,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Elasticity is the property of a body to regain its original shape and size after the removal of deforming forces. Perfect elasticity and plasticity represent boundary states.",
        "sections": [
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
            "examTips": [
              "Breaking stress depends solely on material nature, independent of wire length or cross-sectional area."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing stress with pressure: pressure is strictly compressive and external, whereas stress can be tensile or shearing and is internal restoring force."
        ]
      },
      "formulas": [
        {
          "label": "Tensile Stress Definition",
          "formula": "\\sigma = \\frac{F}{A}",
          "description": "Internal restoring force per unit cross-sectional area.",
          "variables": [
            {
              "symbol": "F",
              "meaning": "Internal Restoring Force",
              "unit": "N"
            },
            {
              "symbol": "A",
              "meaning": "Cross-Sectional Area",
              "unit": "m^2"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Stress",
              "unit": "N/m^2"
            }
          ]
        },
        {
          "label": "Longitudinal Strain",
          "formula": "\\epsilon = \\frac{\\Delta L}{L}",
          "description": "Fractional elongation of wire of initial length L.",
          "variables": [
            {
              "symbol": "\\Delta L",
              "meaning": "Change in Length",
              "unit": "m"
            },
            {
              "symbol": "L",
              "meaning": "Original Length",
              "unit": "m"
            },
            {
              "symbol": "\\epsilon",
              "meaning": "Longitudinal Strain",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-08-01",
          "title": "Elastic Behaviour of Solids & Stress-Strain Concepts Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Elastic Behaviour of Solids & Stress-Strain Concepts.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-08-01",
          "title": "Elastic Behaviour of Solids & Stress-Strain Concepts",
          "summary": "Intermolecular forces, deforming force, restoring force, definitions of stress and strain, tensile, compressive, shearing, and hydraulic stress."
        }
      ]
    },
    {
      "id": "top-phy-11-08-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "PHY-11-08-T02",
      "title": "Hooke’s Law, Stress-Strain Curve & Elastic Moduli",
      "description": "Proportional limit, yield point, ultimate tensile strength, fracture point, ductile vs brittle materials, and Young's modulus Y.",
      "sequenceOrder": 2,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Hooke’s law states that for small deformations within the proportional limit, stress is directly proportional to strain: Stress = Modulus * Strain.",
        "sections": [
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
            "examTips": [
              "The slope of the linear stress-strain curve in the elastic region gives Young's Modulus."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming rubber is more elastic than steel because it stretches more. Elasticity measures resistance to deformation; steel has much higher modulus."
        ]
      },
      "formulas": [
        {
          "label": "Young’s Modulus",
          "formula": "Y = \\frac{\\sigma}{\\epsilon} = \\frac{F L}{A \\Delta L}",
          "description": "Ratio of longitudinal tensile stress to longitudinal strain within proportional limit.",
          "variables": [
            {
              "symbol": "F",
              "meaning": "Applied Load",
              "unit": "N"
            },
            {
              "symbol": "L",
              "meaning": "Wire Length",
              "unit": "m"
            },
            {
              "symbol": "A",
              "meaning": "Cross-Section Area",
              "unit": "m^2"
            },
            {
              "symbol": "\\Delta L",
              "meaning": "Elongation",
              "unit": "m"
            },
            {
              "symbol": "Y",
              "meaning": "Young's Modulus",
              "unit": "Pa"
            }
          ]
        },
        {
          "label": "Elastic Potential Energy Density",
          "formula": "u = \\frac{U}{V} = \\frac{1}{2} \\times \\text{Stress} \\times \\text{Strain} = \\frac{1}{2} Y \\epsilon^2",
          "description": "Strain energy stored per unit volume of deformed elastic material.",
          "variables": [
            {
              "symbol": "Y",
              "meaning": "Young's Modulus",
              "unit": "Pa"
            },
            {
              "symbol": "\\epsilon",
              "meaning": "Strain",
              "unit": "-"
            },
            {
              "symbol": "u",
              "meaning": "Energy Density",
              "unit": "J/m^3"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-08-02",
          "title": "Hooke’s Law, Stress-Strain Curve & Elastic Moduli Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Hooke’s Law, Stress-Strain Curve & Elastic Moduli.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-08-02",
          "title": "Hooke’s Law, Stress-Strain Curve & Elastic Moduli",
          "summary": "Proportional limit, yield point, ultimate tensile strength, fracture point, ductile vs brittle materials, and Young's modulus Y."
        }
      ]
    },
    {
      "id": "top-phy-11-08-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "PHY-11-08-T03",
      "title": "Shear Modulus, Bulk Modulus & Elastic Applications",
      "description": "Shear modulus G, Bulk modulus B, compressibility K = 1/B, Poisson’s ratio, structural design of beams and crane ropes.",
      "sequenceOrder": 3,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Bulk modulus governs volumetric compressibility of solids, liquids, and gases. Shear modulus governs torsional and angular distortion in solids.",
        "sections": [
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
            "examTips": [
              "In crane cables, multiple braided thin wires provide far greater flexibility and strength than a single solid thick rod."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming fluids possess a shear modulus. Ideal fluids have zero shear rigidity."
        ]
      },
      "formulas": [
        {
          "label": "Bulk Modulus",
          "formula": "B = -\\frac{\\Delta P}{\\frac{\\Delta V}{V}} = -V \\frac{dP}{dV}",
          "description": "Volumetric resistance to uniform hydrostatic compression.",
          "variables": [
            {
              "symbol": "\\Delta P",
              "meaning": "Hydrostatic Pressure Change",
              "unit": "Pa"
            },
            {
              "symbol": "V",
              "meaning": "Initial Volume",
              "unit": "m^3"
            },
            {
              "symbol": "\\Delta V",
              "meaning": "Volume Change",
              "unit": "m^3"
            },
            {
              "symbol": "B",
              "meaning": "Bulk Modulus",
              "unit": "Pa"
            }
          ]
        },
        {
          "label": "Bending Sag of a Beam",
          "formula": "\\delta = \\frac{W L^3}{4 Y b d^3}",
          "description": "Central vertical depression sag of rectangular cross-section beam supported at both ends.",
          "variables": [
            {
              "symbol": "W",
              "meaning": "Central Load",
              "unit": "N"
            },
            {
              "symbol": "L",
              "meaning": "Span Length",
              "unit": "m"
            },
            {
              "symbol": "b",
              "meaning": "Breadth",
              "unit": "m"
            },
            {
              "symbol": "d",
              "meaning": "Depth",
              "unit": "m"
            },
            {
              "symbol": "\\delta",
              "meaning": "Central Sag",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-08-03",
          "title": "Shear Modulus, Bulk Modulus & Elastic Applications Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Shear Modulus, Bulk Modulus & Elastic Applications.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-08-03",
          "title": "Shear Modulus, Bulk Modulus & Elastic Applications",
          "summary": "Shear modulus G, Bulk modulus B, compressibility K = 1/B, Poisson’s ratio, structural design of beams and crane ropes."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000009": [
    {
      "id": "top-phy-11-09-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-11-09-T01",
      "title": "Fluid Pressure, Pascal’s Law & Hydraulic Machines",
      "description": "Fluid pressure P = dF/dA, hydrostatic pressure variation P = P0 + rho*g*h, Pascal's principle, and hydraulic lift multiplication.",
      "sequenceOrder": 1,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Liquids exert normal pressure in all directions. Pascal’s law states that pressure applied to an enclosed fluid is transmitted undiminished to every portion of fluid and container walls.",
        "sections": [
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
            "examTips": [
              "Remember to add atmospheric pressure (P0 = 1.013 x 10^5 Pa) when calculating total absolute pressure."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming container shape affects bottom pressure. Pressure depends solely on vertical depth h and fluid density rho."
        ]
      },
      "formulas": [
        {
          "label": "Hydrostatic Pressure at Depth",
          "formula": "P = P_0 + \\rho g h",
          "description": "Absolute pressure at vertical depth h beneath free fluid surface.",
          "variables": [
            {
              "symbol": "P_0",
              "meaning": "Atmospheric Surface Pressure",
              "unit": "Pa"
            },
            {
              "symbol": "\\rho",
              "meaning": "Liquid Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "h",
              "meaning": "Vertical Depth",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Pascal’s Hydraulic Lift Relation",
          "formula": "F_2 = F_1 \\left(\\frac{A_2}{A_1}\\right)",
          "description": "Force multiplication across coupled hydraulic pistons of unequal areas.",
          "variables": [
            {
              "symbol": "F_1",
              "meaning": "Input Effort Force",
              "unit": "N"
            },
            {
              "symbol": "A_1, A_2",
              "meaning": "Piston Surface Areas",
              "unit": "m^2"
            },
            {
              "symbol": "F_2",
              "meaning": "Lifted Load Force",
              "unit": "N"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-09-01",
          "title": "Fluid Pressure, Pascal’s Law & Hydraulic Machines Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Fluid Pressure, Pascal’s Law & Hydraulic Machines.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-09-01",
          "title": "Fluid Pressure, Pascal’s Law & Hydraulic Machines",
          "summary": "Fluid pressure P = dF/dA, hydrostatic pressure variation P = P0 + rho*g*h, Pascal's principle, and hydraulic lift multiplication."
        }
      ]
    },
    {
      "id": "top-phy-11-09-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-11-09-T02",
      "title": "Streamline Flow, Equation of Continuity & Bernoulli’s Principle",
      "description": "Steady laminar vs turbulent flow, Reynolds number, continuity equation A1*v1 = A2*v2, Bernoulli’s theorem and Venturimeter.",
      "sequenceOrder": 2,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Bernoulli’s principle expresses conservation of mechanical energy in streamline flow of an incompressible, non-viscous fluid.",
        "sections": [
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
            "examTips": [
              "Bernoulli’s theorem applies strictly to streamline, steady, non-viscous, incompressible flow."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing higher fluid speed creates higher pressure. Bernoulli proves higher flow speed REDUCES static fluid pressure."
        ]
      },
      "formulas": [
        {
          "label": "Equation of Continuity",
          "formula": "A_1 v_1 = A_2 v_2 = \\text{constant}",
          "description": "Conservation of volume flow rate for incompressible fluid across varying pipe cross-sections.",
          "variables": [
            {
              "symbol": "A_1, A_2",
              "meaning": "Cross-Sectional Areas",
              "unit": "m^2"
            },
            {
              "symbol": "v_1, v_2",
              "meaning": "Flow Velocities",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "Bernoulli’s Master Equation",
          "formula": "P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{constant}",
          "description": "Conservation of energy per unit volume in streamline ideal fluid flow.",
          "variables": [
            {
              "symbol": "P",
              "meaning": "Static Pressure",
              "unit": "Pa"
            },
            {
              "symbol": "\\rho",
              "meaning": "Fluid Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "v",
              "meaning": "Flow Speed",
              "unit": "m/s"
            },
            {
              "symbol": "h",
              "meaning": "Elevation Altitude",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-09-02",
          "title": "Streamline Flow, Equation of Continuity & Bernoulli’s Principle Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Streamline Flow, Equation of Continuity & Bernoulli’s Principle.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-09-02",
          "title": "Streamline Flow, Equation of Continuity & Bernoulli’s Principle",
          "summary": "Steady laminar vs turbulent flow, Reynolds number, continuity equation A1*v1 = A2*v2, Bernoulli’s theorem and Venturimeter."
        }
      ]
    },
    {
      "id": "top-phy-11-09-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-11-09-T03",
      "title": "Viscosity, Stokes’ Law & Terminal Velocity",
      "description": "Coefficient of viscosity eta, velocity gradient dv/dx, Stokes’ drag law F = 6*pi*eta*r*v, and terminal settling speed.",
      "sequenceOrder": 3,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Viscosity is internal fluid friction opposing relative motion between adjacent fluid layers. A falling spherical body achieves constant terminal speed when viscous drag and buoyancy balance gravity.",
        "sections": [
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
            "examTips": [
              "Remember that terminal velocity depends on density difference (rho - sigma). If object is less dense than fluid, terminal speed is upward."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming viscosity of gases decreases with temperature like liquids. Gas viscosity INCREASES with temperature due to increased momentum transfer."
        ]
      },
      "formulas": [
        {
          "label": "Stokes’ Drag Law",
          "formula": "F_v = 6 \\pi \\eta r v",
          "description": "Viscous resistive drag force on sphere of radius r moving at speed v in fluid of viscosity eta.",
          "variables": [
            {
              "symbol": "\\eta",
              "meaning": "Dynamic Viscosity",
              "unit": "Pa s"
            },
            {
              "symbol": "r",
              "meaning": "Sphere Radius",
              "unit": "m"
            },
            {
              "symbol": "v",
              "meaning": "Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "F_v",
              "meaning": "Viscous Drag Force",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Terminal Settling Velocity",
          "formula": "v_t = \\frac{2 r^2 (\\rho - \\sigma) g}{9 \\eta}",
          "description": "Steady terminal velocity achieved when net downward driving force vanishes.",
          "variables": [
            {
              "symbol": "r",
              "meaning": "Droplet/Sphere Radius",
              "unit": "m"
            },
            {
              "symbol": "\\rho",
              "meaning": "Sphere Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Fluid Medium Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "\\eta",
              "meaning": "Fluid Viscosity",
              "unit": "Pa s"
            },
            {
              "symbol": "v_t",
              "meaning": "Terminal Velocity",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-09-03",
          "title": "Viscosity, Stokes’ Law & Terminal Velocity Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Viscosity, Stokes’ Law & Terminal Velocity.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-09-03",
          "title": "Viscosity, Stokes’ Law & Terminal Velocity",
          "summary": "Coefficient of viscosity eta, velocity gradient dv/dx, Stokes’ drag law F = 6*pi*eta*r*v, and terminal settling speed."
        }
      ]
    },
    {
      "id": "top-phy-11-09-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-11-09-T04",
      "title": "Surface Tension, Surface Energy & Capillary Ascent",
      "description": "Intermolecular cohesive forces, surface energy W = S*Delta A, excess pressure across curved surfaces, angle of contact, and capillary rise.",
      "sequenceOrder": 4,
      "weightagePercent": 1.1,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Molecules on a liquid surface experience net inward cohesive pull, causing the surface to behave like a stretched elastic membrane minimizing surface area.",
        "sections": [
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
            "examTips": [
              "Notice soap bubbles have TWO free surfaces, doubling the excess pressure compared to a liquid drop."
            ]
          }
        ],
        "commonMisconceptions": [
          "Using 2S/R for a soap bubble: soap bubbles have two air-liquid interfaces, so excess pressure is 4S/R."
        ]
      },
      "formulas": [
        {
          "label": "Excess Pressure in Soap Bubble",
          "formula": "\\Delta P = \\frac{4 S}{R}",
          "description": "Internal excess pressure in soap bubble of radius R having two air interfaces.",
          "variables": [
            {
              "symbol": "S",
              "meaning": "Surface Tension",
              "unit": "N/m"
            },
            {
              "symbol": "R",
              "meaning": "Bubble Radius",
              "unit": "m"
            },
            {
              "symbol": "\\Delta P",
              "meaning": "Excess Pressure",
              "unit": "Pa"
            }
          ]
        },
        {
          "label": "Capillary Ascent Formula",
          "formula": "h = \\frac{2 S \\cos\\theta}{r \\rho g}",
          "description": "Vertical equilibrium height of liquid column in narrow capillary tube of radius r.",
          "variables": [
            {
              "symbol": "S",
              "meaning": "Surface Tension",
              "unit": "N/m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Contact Angle",
              "unit": "rad"
            },
            {
              "symbol": "r",
              "meaning": "Capillary Tube Radius",
              "unit": "m"
            },
            {
              "symbol": "\\rho",
              "meaning": "Liquid Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "h",
              "meaning": "Capillary Rise Height",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-09-04",
          "title": "Surface Tension, Surface Energy & Capillary Ascent Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Surface Tension, Surface Energy & Capillary Ascent.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-09-04",
          "title": "Surface Tension, Surface Energy & Capillary Ascent",
          "summary": "Intermolecular cohesive forces, surface energy W = S*Delta A, excess pressure across curved surfaces, angle of contact, and capillary rise."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000010": [
    {
      "id": "top-phy-11-10-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "PHY-11-10-T01",
      "title": "Temperature, Thermal Expansion & Thermometry",
      "description": "Thermal equilibrium, Celsius/Fahrenheit/Kelvin scales, linear expansion alpha, superficial expansion beta, volume expansion gamma.",
      "sequenceOrder": 1,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Temperature is a macroscopic measure of average molecular kinetic energy. Most substances expand upon heating.",
        "sections": [
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
            "examTips": [
              "A hole in a heated plate expands exactly as if it were filled with the solid material."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing holes in metal sheets contract when heated. Thermal expansion scales all dimensions outwards, expanding holes."
        ]
      },
      "formulas": [
        {
          "label": "Linear Thermal Expansion",
          "formula": "\\Delta L = L_0 \\alpha \\Delta T",
          "description": "Change in length of solid rod of initial length L0 under temperature change Delta T.",
          "variables": [
            {
              "symbol": "L_0",
              "meaning": "Initial Length",
              "unit": "m"
            },
            {
              "symbol": "\\alpha",
              "meaning": "Coefficient of Linear Expansion",
              "unit": "K^-1"
            },
            {
              "symbol": "\\Delta T",
              "meaning": "Temperature Change",
              "unit": "K"
            },
            {
              "symbol": "\\Delta L",
              "meaning": "Elongation",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Thermal Stress in Rigidly Clamped Rod",
          "formula": "\\sigma = Y \\alpha \\Delta T",
          "description": "Mechanical compressive stress induced when thermal expansion is prevented by rigid supports.",
          "variables": [
            {
              "symbol": "Y",
              "meaning": "Young's Modulus",
              "unit": "Pa"
            },
            {
              "symbol": "\\alpha",
              "meaning": "Linear Expansion Coefficient",
              "unit": "K^-1"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Induced Thermal Stress",
              "unit": "Pa"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-10-01",
          "title": "Temperature, Thermal Expansion & Thermometry Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Temperature, Thermal Expansion & Thermometry.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-10-01",
          "title": "Temperature, Thermal Expansion & Thermometry",
          "summary": "Thermal equilibrium, Celsius/Fahrenheit/Kelvin scales, linear expansion alpha, superficial expansion beta, volume expansion gamma."
        }
      ]
    },
    {
      "id": "top-phy-11-10-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "PHY-11-10-T02",
      "title": "Specific Heat Capacity, Calorimetry & Latent Heat",
      "description": "Heat capacity, molar heat capacity, water equivalent, principle of calorimetry, latent heat of fusion and vaporisation.",
      "sequenceOrder": 2,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Heat absorbed or evolved during temperature change: Q = m*c*Delta T. During a phase change, temperature remains constant: Q = m*L.",
        "sections": [
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
            "examTips": [
              "Always check whether sufficient heat exists to melt/vaporize all material when solving mixture equilibrium problems."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming temperature changes during melting or boiling. Temperature stays constant during pure phase changes."
        ]
      },
      "formulas": [
        {
          "label": "Sensible Heat Equation",
          "formula": "Q = m c \\Delta T",
          "description": "Thermal energy required to raise temperature of mass m with specific heat capacity c.",
          "variables": [
            {
              "symbol": "m",
              "meaning": "Mass",
              "unit": "kg"
            },
            {
              "symbol": "c",
              "meaning": "Specific Heat Capacity",
              "unit": "J/(kg K)"
            },
            {
              "symbol": "\\Delta T",
              "meaning": "Temperature Rise",
              "unit": "K"
            },
            {
              "symbol": "Q",
              "meaning": "Heat Energy",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Latent Heat of Phase Change",
          "formula": "Q = m L",
          "description": "Thermal energy absorbed or released during isothermal phase transition.",
          "variables": [
            {
              "symbol": "m",
              "meaning": "Mass Changing Phase",
              "unit": "kg"
            },
            {
              "symbol": "L",
              "meaning": "Specific Latent Heat",
              "unit": "J/kg"
            },
            {
              "symbol": "Q",
              "meaning": "Latent Heat Transferred",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-10-02",
          "title": "Specific Heat Capacity, Calorimetry & Latent Heat Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Specific Heat Capacity, Calorimetry & Latent Heat.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-10-02",
          "title": "Specific Heat Capacity, Calorimetry & Latent Heat",
          "summary": "Heat capacity, molar heat capacity, water equivalent, principle of calorimetry, latent heat of fusion and vaporisation."
        }
      ]
    },
    {
      "id": "top-phy-11-10-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "PHY-11-10-T03",
      "title": "Heat Transfer: Conduction, Convection & Radiation Laws",
      "description": "Thermal conductivity k, Fourier rate equation, black body radiation, Stefan-Boltzmann law, Wien's displacement law, and Newton's law of cooling.",
      "sequenceOrder": 3,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Heat transfers via conduction (microscopic collisions in solids), convection (bulk fluid movement), and radiation (electromagnetic waves without medium).",
        "sections": [
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
            "examTips": [
              "Doubling absolute temperature of a black body increases its radiated emission by a factor of 2^4 = 16!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying Newton's law of cooling to very large temperature differences where Stefan's T^4 radiation dominates."
        ]
      },
      "formulas": [
        {
          "label": "Stefan-Boltzmann Law",
          "formula": "P = e \\sigma A T^4",
          "description": "Total radiant power emitted by body of emissivity e and area A at absolute temperature T.",
          "variables": [
            {
              "symbol": "e",
              "meaning": "Emissivity (0 <= e <= 1)",
              "unit": "-"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Stefan Constant (5.67 x 10^-8)",
              "unit": "W/(m^2 K^4)"
            },
            {
              "symbol": "A",
              "meaning": "Surface Area",
              "unit": "m^2"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "P",
              "meaning": "Radiated Power",
              "unit": "W"
            }
          ]
        },
        {
          "label": "Wien’s Displacement Law",
          "formula": "\\lambda_{\\max} T = b = 2.898 \\times 10^{-3} \\text{ m K}",
          "description": "Inverse relationship between peak emission wavelength and blackbody absolute temperature.",
          "variables": [
            {
              "symbol": "\\lambda_{\\max}",
              "meaning": "Peak Emission Wavelength",
              "unit": "m"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "b",
              "meaning": "Wien's Constant",
              "unit": "m K"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-10-03",
          "title": "Heat Transfer: Conduction, Convection & Radiation Laws Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Heat Transfer: Conduction, Convection & Radiation Laws.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-10-03",
          "title": "Heat Transfer: Conduction, Convection & Radiation Laws",
          "summary": "Thermal conductivity k, Fourier rate equation, black body radiation, Stefan-Boltzmann law, Wien's displacement law, and Newton's law of cooling."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000011": [
    {
      "id": "top-phy-11-11-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-11-11-T01",
      "title": "Thermal Equilibrium & Zeroth Law of Thermodynamics",
      "description": "Concept of temperature, thermal contact, diathermic and adiabatic walls, and temperature scale foundation.",
      "sequenceOrder": 1,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Zeroth Law of Thermodynamics establishes temperature as the universal state variable that determines whether systems are in thermal equilibrium.",
        "sections": [
          {
            "heading": "Zeroth Law and Thermometry",
            "paragraphs": [
              "If two bodies A and B are each in thermal equilibrium with a third body C, then A and B are in thermal equilibrium with each other.",
              "This law justifies the concept of temperature as an invariant property shared by systems in mutual thermal equilibrium."
            ],
            "keyTakeaways": [
              "Temperature is a scalar state variable; heat flows from higher to lower temperature."
            ],
            "examTips": [
              "Zeroth law was formulated after the 1st and 2nd laws, but placed first due to its foundational nature."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking temperature is heat: temperature is a state function; heat is transient energy in transit."
        ]
      },
      "formulas": [
        {
          "label": "Thermal Equilibrium Condition",
          "formula": "T_A = T_B = T_C",
          "description": "Equality of empirical temperatures across systems in mutual thermal equilibrium.",
          "variables": [
            {
              "symbol": "T_A, T_B, T_C",
              "meaning": "System Temperatures",
              "unit": "K"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-11-01",
          "title": "Thermal Equilibrium & Zeroth Law of Thermodynamics Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Thermal Equilibrium & Zeroth Law of Thermodynamics.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-11-01",
          "title": "Thermal Equilibrium & Zeroth Law of Thermodynamics",
          "summary": "Concept of temperature, thermal contact, diathermic and adiabatic walls, and temperature scale foundation."
        }
      ]
    },
    {
      "id": "top-phy-11-11-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-11-11-T02",
      "title": "First Law of Thermodynamics & Internal Energy",
      "description": "Heat Q, work done W, internal energy U as state function, Delta Q = Delta U + Delta W, sign conventions.",
      "sequenceOrder": 2,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The First Law of Thermodynamics expresses the conservation of energy for thermodynamic systems: heat supplied equals increase in internal energy plus work done by the system.",
        "sections": [
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
            "examTips": [
              "Be careful with chemistry vs physics conventions: in NCERT Physics, work done BY gas on expansion is positive (+P dV)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing path functions (Q, W) with state functions (U, P, V, T). Only state functions have exact differentials dU."
        ]
      },
      "formulas": [
        {
          "label": "First Law of Thermodynamics",
          "formula": "\\Delta Q = \\Delta U + \\Delta W = \\Delta U + P \\Delta V",
          "description": "Conservation of energy relating heat transfer, internal energy change, and work done.",
          "variables": [
            {
              "symbol": "\\Delta Q",
              "meaning": "Heat Added to System",
              "unit": "J"
            },
            {
              "symbol": "\\Delta U",
              "meaning": "Internal Energy Change",
              "unit": "J"
            },
            {
              "symbol": "\\Delta W",
              "meaning": "Work Done by System",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Ideal Gas Internal Energy Change",
          "formula": "\\Delta U = n C_v \\Delta T",
          "description": "Change in internal energy for n moles of ideal gas under temperature change Delta T.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Amount of Gas",
              "unit": "mol"
            },
            {
              "symbol": "C_v",
              "meaning": "Molar Heat Capacity at Constant Volume",
              "unit": "J/(mol K)"
            },
            {
              "symbol": "\\Delta T",
              "meaning": "Temperature Change",
              "unit": "K"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-11-02",
          "title": "First Law of Thermodynamics & Internal Energy Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for First Law of Thermodynamics & Internal Energy.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-11-02",
          "title": "First Law of Thermodynamics & Internal Energy",
          "summary": "Heat Q, work done W, internal energy U as state function, Delta Q = Delta U + Delta W, sign conventions."
        }
      ]
    },
    {
      "id": "top-phy-11-11-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-11-11-T03",
      "title": "Thermodynamic Processes: Isothermal, Adiabatic, Isochoric & Isobaric",
      "description": "Quasi-static processes, PV diagrams, work done in isothermal expansion W = nRT ln(V2/V1), adiabatic relation PV^gamma = const, and work done in adiabatic expansion.",
      "sequenceOrder": 3,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Thermodynamic processes describe transitions between states under constrained variables: temperature (isothermal), heat exchange (adiabatic), pressure (isobaric), or volume (isochoric).",
        "sections": [
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
            "examTips": [
              "Fast processes (sound propagation, tyre burst) are adiabatic; slow processes in conducting containers are isothermal."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming gas temperature remains constant during adiabatic expansion. In adiabatic expansion, gas does work at the expense of its internal energy, cooling significantly."
        ]
      },
      "formulas": [
        {
          "label": "Isothermal Work Done",
          "formula": "W = n R T \\ln\\left(\\frac{V_2}{V_1}\\right) = 2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right)",
          "description": "Work done during reversible isothermal expansion of n moles of ideal gas.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Moles of Gas",
              "unit": "mol"
            },
            {
              "symbol": "R",
              "meaning": "Universal Gas Constant (8.314)",
              "unit": "J/(mol K)"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "V_1, V_2",
              "meaning": "Initial & Final Volumes",
              "unit": "m^3"
            },
            {
              "symbol": "W",
              "meaning": "Work Done",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Adiabatic Process Relation",
          "formula": "P V^\\gamma = \\text{constant} \\implies T V^{\\gamma - 1} = \\text{constant}",
          "description": "Equation of state for reversible adiabatic process with heat capacity ratio gamma = Cp / Cv.",
          "variables": [
            {
              "symbol": "P",
              "meaning": "Gas Pressure",
              "unit": "Pa"
            },
            {
              "symbol": "V",
              "meaning": "Gas Volume",
              "unit": "m^3"
            },
            {
              "symbol": "\\gamma",
              "meaning": "Adiabatic Exponent (Cp / Cv)",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Adiabatic Work Done",
          "formula": "W = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1} = \\frac{n R (T_1 - T_2)}{\\gamma - 1}",
          "description": "Work done during adiabatic expansion between states (P1, V1, T1) and (P2, V2, T2).",
          "variables": [
            {
              "symbol": "T_1, T_2",
              "meaning": "Initial & Final Temperatures",
              "unit": "K"
            },
            {
              "symbol": "\\gamma",
              "meaning": "Adiabatic Ratio",
              "unit": "-"
            },
            {
              "symbol": "W",
              "meaning": "Adiabatic Work",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-11-03",
          "title": "Thermodynamic Processes: Isothermal, Adiabatic, Isochoric & Isobaric Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Thermodynamic Processes: Isothermal, Adiabatic, Isochoric & Isobaric.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-11-03",
          "title": "Thermodynamic Processes: Isothermal, Adiabatic, Isochoric & Isobaric",
          "summary": "Quasi-static processes, PV diagrams, work done in isothermal expansion W = nRT ln(V2/V1), adiabatic relation PV^gamma = const, and work done in adiabatic expansion."
        }
      ]
    },
    {
      "id": "top-phy-11-11-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-11-11-T04",
      "title": "Second Law of Thermodynamics & Heat Engines (Carnot Cycle)",
      "description": "Kelvin-Planck statement, Clausius statement, Carnot cycle efficiency eta = 1 - T2/T1, refrigerators and coefficient of performance COP.",
      "sequenceOrder": 4,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Second Law dictates the spontaneous direction of natural processes. Heat cannot spontaneously flow from colder to hotter bodies, and no engine can convert absorbed heat entirely into work.",
        "sections": [
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
            "examTips": [
              "To achieve 100% efficiency, the sink temperature T2 must be absolute zero (0 K), which is unattainable by the Third Law."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming a real engine can exceed Carnot efficiency. Carnot theorem proves no real engine can exceed reversible Carnot efficiency."
        ]
      },
      "formulas": [
        {
          "label": "Carnot Engine Efficiency",
          "formula": "\\eta = 1 - \\frac{Q_2}{Q_1} = 1 - \\frac{T_2}{T_1}",
          "description": "Maximum theoretical efficiency of heat engine operating between source T1 and sink T2.",
          "variables": [
            {
              "symbol": "T_1",
              "meaning": "Source Temperature",
              "unit": "K"
            },
            {
              "symbol": "T_2",
              "meaning": "Sink Temperature",
              "unit": "K"
            },
            {
              "symbol": "\\eta",
              "meaning": "Thermal Efficiency",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Refrigerator Coefficient of Performance",
          "formula": "\\beta = \\frac{Q_2}{W} = \\frac{T_2}{T_1 - T_2}",
          "description": "Ratio of heat extracted from cold reservoir to electrical work input.",
          "variables": [
            {
              "symbol": "Q_2",
              "meaning": "Heat Extracted",
              "unit": "J"
            },
            {
              "symbol": "W",
              "meaning": "Work Input",
              "unit": "J"
            },
            {
              "symbol": "\\beta",
              "meaning": "Coefficient of Performance",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-11-04",
          "title": "Second Law of Thermodynamics & Heat Engines (Carnot Cycle) Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Second Law of Thermodynamics & Heat Engines (Carnot Cycle).",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-11-04",
          "title": "Second Law of Thermodynamics & Heat Engines (Carnot Cycle)",
          "summary": "Kelvin-Planck statement, Clausius statement, Carnot cycle efficiency eta = 1 - T2/T1, refrigerators and coefficient of performance COP."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000012": [
    {
      "id": "top-phy-11-12-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-11-12-T01",
      "title": "Molecular Nature of Matter & Ideal Gas Equation",
      "description": "Postulates of kinetic theory of gases, Avogadro's hypothesis, Boyle's law, Charles' law, and equation of state PV = nRT = N*k_B*T.",
      "sequenceOrder": 1,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Kinetic theory models a gas as an ensemble of rapidly moving, point-like elastic particles in continuous random motion, explaining macroscopic gas laws from microscopic mechanics.",
        "sections": [
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
            "examTips": [
              "Always convert temperatures to Kelvin (T = t + 273.15) before using PV = nRT."
            ]
          }
        ],
        "commonMisconceptions": [
          "Using Celsius temperature in ideal gas equations: PV = nRT requires absolute temperature in Kelvin."
        ]
      },
      "formulas": [
        {
          "label": "Ideal Gas Equation of State",
          "formula": "P V = n R T = N k_B T",
          "description": "Equation connecting pressure, volume, temperature, and amount of gas.",
          "variables": [
            {
              "symbol": "P",
              "meaning": "Pressure",
              "unit": "Pa"
            },
            {
              "symbol": "V",
              "meaning": "Volume",
              "unit": "m^3"
            },
            {
              "symbol": "n",
              "meaning": "Moles",
              "unit": "mol"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-12-01",
          "title": "Molecular Nature of Matter & Ideal Gas Equation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Molecular Nature of Matter & Ideal Gas Equation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-12-01",
          "title": "Molecular Nature of Matter & Ideal Gas Equation",
          "summary": "Postulates of kinetic theory of gases, Avogadro's hypothesis, Boyle's law, Charles' law, and equation of state PV = nRT = N*k_B*T."
        }
      ]
    },
    {
      "id": "top-phy-11-12-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-11-12-T02",
      "title": "Kinetic Pressure Derivation & RMS Velocity",
      "description": "Derivation of pressure P = (1/3)*rho*v_rms^2, kinetic interpretation of temperature E_k = (3/2)*k_B*T, and root mean square speed.",
      "sequenceOrder": 2,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Gas pressure originates from momentum imparted by molecular collisions against container walls: P = (1/3)*rho*v_rms^2.",
        "sections": [
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
            "examTips": [
              "v_rms depends solely on temperature and molar mass, independent of pressure or volume changes at constant T."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking v_rms increases when pressure increases at constant temperature. If T is constant, v_rms is invariant."
        ]
      },
      "formulas": [
        {
          "label": "Kinetic Gas Pressure Formula",
          "formula": "P = \\frac{1}{3} \\rho v_{rms}^2 = \\frac{1}{3} \\frac{N m}{V} v_{rms}^2",
          "description": "Pressure exerted by N gas molecules of mass m in container of volume V.",
          "variables": [
            {
              "symbol": "\\rho",
              "meaning": "Gas Mass Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "v_{rms}",
              "meaning": "Root Mean Square Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "P",
              "meaning": "Kinetic Pressure",
              "unit": "Pa"
            }
          ]
        },
        {
          "label": "Root Mean Square Speed",
          "formula": "v_{rms} = \\sqrt{\\frac{3 R T}{M}} = \\sqrt{\\frac{3 k_B T}{m}}",
          "description": "Root mean square speed of gas molecules of molar mass M at absolute temperature T.",
          "variables": [
            {
              "symbol": "R",
              "meaning": "Universal Gas Constant",
              "unit": "J/(mol K)"
            },
            {
              "symbol": "T",
              "meaning": "Temperature",
              "unit": "K"
            },
            {
              "symbol": "M",
              "meaning": "Molar Mass",
              "unit": "kg/mol"
            },
            {
              "symbol": "v_{rms}",
              "meaning": "RMS Velocity",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-12-02",
          "title": "Kinetic Pressure Derivation & RMS Velocity Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Kinetic Pressure Derivation & RMS Velocity.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-12-02",
          "title": "Kinetic Pressure Derivation & RMS Velocity",
          "summary": "Derivation of pressure P = (1/3)*rho*v_rms^2, kinetic interpretation of temperature E_k = (3/2)*k_B*T, and root mean square speed."
        }
      ]
    },
    {
      "id": "top-phy-11-12-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-11-12-T03",
      "title": "Law of Equipartition of Energy & Degrees of Freedom",
      "description": "Degrees of freedom f for monatomic (f=3), diatomic (f=5), and polyatomic gases, internal energy U = (f/2)*nRT, and heat capacity ratios gamma.",
      "sequenceOrder": 3,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Law of Equipartition states that in thermal equilibrium, total energy is distributed equally among all degrees of freedom, each contributing (1/2)*k_B*T per molecule.",
        "sections": [
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
            "examTips": [
              "For a mixture of n1 moles of gas 1 and n2 moles of gas 2: Cv_mix = (n1*Cv1 + n2*Cv2) / (n1 + n2)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming vibrational degrees of freedom are active at room temperature. They only activate at elevated temperatures (> 1000 K)."
        ]
      },
      "formulas": [
        {
          "label": "Law of Equipartition of Energy",
          "formula": "E = \\frac{f}{2} k_B T",
          "description": "Mean thermal energy per molecule with f independent degrees of freedom.",
          "variables": [
            {
              "symbol": "f",
              "meaning": "Degrees of Freedom",
              "unit": "-"
            },
            {
              "symbol": "k_B",
              "meaning": "Boltzmann Constant",
              "unit": "J/K"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            }
          ]
        },
        {
          "label": "Adiabatic Index from Degrees of Freedom",
          "formula": "\\gamma = \\frac{C_p}{C_v} = 1 + \\frac{2}{f}",
          "description": "Ratio of specific heats expressed in terms of degrees of freedom f.",
          "variables": [
            {
              "symbol": "f",
              "meaning": "Degrees of Freedom",
              "unit": "-"
            },
            {
              "symbol": "\\gamma",
              "meaning": "Adiabatic Index",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-12-03",
          "title": "Law of Equipartition of Energy & Degrees of Freedom Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Law of Equipartition of Energy & Degrees of Freedom.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-12-03",
          "title": "Law of Equipartition of Energy & Degrees of Freedom",
          "summary": "Degrees of freedom f for monatomic (f=3), diatomic (f=5), and polyatomic gases, internal energy U = (f/2)*nRT, and heat capacity ratios gamma."
        }
      ]
    },
    {
      "id": "top-phy-11-12-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-11-12-T04",
      "title": "Mean Free Path & Molecular Collision Frequency",
      "description": "Mean free path lambda = 1 / (sqrt(2)*n*pi*d^2), collision frequency, dependence on pressure and temperature.",
      "sequenceOrder": 4,
      "weightagePercent": 0.9,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Molecules undergo billions of collisions per second. The average distance traversed between two successive collisions is the mean free path lambda.",
        "sections": [
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
            "examTips": [
              "At constant volume (n = const), mean free path is invariant even if temperature changes!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming lambda increases with pressure. Increasing pressure packs molecules closer, reducing mean free path."
        ]
      },
      "formulas": [
        {
          "label": "Mean Free Path",
          "formula": "\\lambda = \\frac{1}{\\sqrt{2} n \\pi d^2} = \\frac{k_B T}{\\sqrt{2} \\pi d^2 P}",
          "description": "Average distance travelled by a gas molecule between successive elastic collisions.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Number Density (N/V)",
              "unit": "m^-3"
            },
            {
              "symbol": "d",
              "meaning": "Molecular Diameter",
              "unit": "m"
            },
            {
              "symbol": "P",
              "meaning": "Gas Pressure",
              "unit": "Pa"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Mean Free Path",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-12-04",
          "title": "Mean Free Path & Molecular Collision Frequency Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Mean Free Path & Molecular Collision Frequency.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-12-04",
          "title": "Mean Free Path & Molecular Collision Frequency",
          "summary": "Mean free path lambda = 1 / (sqrt(2)*n*pi*d^2), collision frequency, dependence on pressure and temperature."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000013": [
    {
      "id": "top-phy-11-13-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-11-13-T01",
      "title": "Periodic and Oscillatory Motions & Harmonic Functions",
      "description": "Period, frequency, angular frequency omega = 2*pi*f, displacement relations, harmonic vs non-harmonic motion.",
      "sequenceOrder": 1,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Periodic motion repeats identically at regular time intervals. Oscillatory motion is a to-and-fro periodic motion about a stable mean equilibrium position.",
        "sections": [
          {
            "heading": "Harmonic Representation of Motion",
            "paragraphs": [
              "A periodic motion that can be represented by a single sine or cosine function is called simple harmonic: x(t) = A*cos(omega*t + phi).",
              "Any complex periodic motion can be decomposed into a Fourier sum of pure sine and cosine harmonic terms."
            ],
            "keyTakeaways": [
              "Every oscillatory motion is periodic, but every periodic motion is not necessarily oscillatory (e.g. planetary orbit is periodic but not oscillatory)."
            ],
            "examTips": [
              "Phase constant phi represents the initial state of motion at time t = 0."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming all periodic motions are simple harmonic. SHM requires the restoring force to be strictly linear with displacement (F = -k*x)."
        ]
      },
      "formulas": [
        {
          "label": "Displacement in SHM",
          "formula": "x(t) = A \\cos(\\omega t + \\phi)",
          "description": "Instantaneous displacement coordinate in simple harmonic motion of amplitude A.",
          "variables": [
            {
              "symbol": "A",
              "meaning": "Amplitude",
              "unit": "m"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Frequency",
              "unit": "rad/s"
            },
            {
              "symbol": "\\phi",
              "meaning": "Initial Phase Constant",
              "unit": "rad"
            },
            {
              "symbol": "x(t)",
              "meaning": "Displacement",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-13-01",
          "title": "Periodic and Oscillatory Motions & Harmonic Functions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Periodic and Oscillatory Motions & Harmonic Functions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-13-01",
          "title": "Periodic and Oscillatory Motions & Harmonic Functions",
          "summary": "Period, frequency, angular frequency omega = 2*pi*f, displacement relations, harmonic vs non-harmonic motion."
        }
      ]
    },
    {
      "id": "top-phy-11-13-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-11-13-T02",
      "title": "Simple Harmonic Motion (SHM) & Reference Circle",
      "description": "Uniform circular motion projection, velocity v(t) = -omega*A*sin(omega*t + phi), acceleration a(t) = -omega^2*x.",
      "sequenceOrder": 2,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Simple Harmonic Motion is the orthogonal projection of uniform circular motion on any diameter of the reference circle.",
        "sections": [
          {
            "heading": "Kinematics of SHM",
            "paragraphs": [
              "Velocity leads displacement by phase pi/2: v(t) = -omega*A*sin(omega*t + phi) = omega * sqrt(A^2 - x^2). At mean position (x = 0), speed is maximum: v_max = omega*A.",
              "Acceleration leads displacement by phase pi (opposite direction): a(t) = -omega^2*x. At extreme positions (x = +-A), acceleration is maximum: a_max = omega^2*A."
            ],
            "keyTakeaways": [
              "Acceleration in SHM is always directed toward the mean equilibrium position.",
              "Speed is maximum where acceleration is zero (mean position), and speed is zero where acceleration is maximum (extreme points)."
            ],
            "examTips": [
              "Phase difference between velocity and acceleration is pi/2; between displacement and acceleration is pi."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking velocity and acceleration are in the same direction in SHM: when moving away from mean position, velocity and restoring acceleration oppose each other."
        ]
      },
      "formulas": [
        {
          "label": "Velocity-Displacement Relation in SHM",
          "formula": "v = \\pm \\omega \\sqrt{A^2 - x^2}",
          "description": "Speed of particle as a function of displacement x from equilibrium mean position.",
          "variables": [
            {
              "symbol": "\\omega",
              "meaning": "Angular Frequency",
              "unit": "rad/s"
            },
            {
              "symbol": "A",
              "meaning": "Amplitude",
              "unit": "m"
            },
            {
              "symbol": "x",
              "meaning": "Displacement",
              "unit": "m"
            },
            {
              "symbol": "v",
              "meaning": "Velocity",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "SHM Acceleration Equation",
          "formula": "a = -\\omega^2 x",
          "description": "Defining differential condition of simple harmonic motion.",
          "variables": [
            {
              "symbol": "\\omega",
              "meaning": "Angular Frequency",
              "unit": "rad/s"
            },
            {
              "symbol": "x",
              "meaning": "Displacement",
              "unit": "m"
            },
            {
              "symbol": "a",
              "meaning": "Acceleration",
              "unit": "m/s^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-13-02",
          "title": "Simple Harmonic Motion (SHM) & Reference Circle Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Simple Harmonic Motion (SHM) & Reference Circle.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-13-02",
          "title": "Simple Harmonic Motion (SHM) & Reference Circle",
          "summary": "Uniform circular motion projection, velocity v(t) = -omega*A*sin(omega*t + phi), acceleration a(t) = -omega^2*x."
        }
      ]
    },
    {
      "id": "top-phy-11-13-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-11-13-T03",
      "title": "Energy in Simple Harmonic Motion: Kinetic & Potential Energy",
      "description": "Kinetic energy K = 0.5*m*omega^2*(A^2 - x^2), potential energy U = 0.5*m*omega^2*x^2, total energy E = 0.5*m*omega^2*A^2.",
      "sequenceOrder": 3,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "In undamped SHM, total mechanical energy is conserved: kinetic and potential energy oscillate between zero and peak values at twice the fundamental oscillation frequency.",
        "sections": [
          {
            "heading": "Energy Exchange and Frequency",
            "paragraphs": [
              "Total energy E = K + U = 0.5 * m * omega^2 * A^2 = constant, proportional to the square of amplitude A^2.",
              "At mean position (x = 0), energy is purely kinetic. At extreme positions (x = +-A), energy is purely potential.",
              "When x = A / sqrt(2), kinetic energy equals potential energy: K = U = E / 2."
            ],
            "keyTakeaways": [
              "Kinetic and potential energy oscillate with frequency 2*f (twice the particle's displacement frequency).",
              "Average kinetic energy over one full cycle equals average potential energy: <K> = <U> = E / 2."
            ],
            "examTips": [
              "Remember that energy frequency is 2f, while displacement and velocity frequency is f."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming kinetic and potential energies oscillate at the same frequency as displacement. Energy oscillates at TWICE the displacement frequency."
        ]
      },
      "formulas": [
        {
          "label": "Total Energy in SHM",
          "formula": "E = K + U = \\frac{1}{2} m \\omega^2 A^2 = \\frac{1}{2} k A^2",
          "description": "Invariant total mechanical energy in undamped simple harmonic oscillator.",
          "variables": [
            {
              "symbol": "m",
              "meaning": "Mass",
              "unit": "kg"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Frequency",
              "unit": "rad/s"
            },
            {
              "symbol": "A",
              "meaning": "Amplitude",
              "unit": "m"
            },
            {
              "symbol": "E",
              "meaning": "Total Energy",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-13-03",
          "title": "Energy in Simple Harmonic Motion: Kinetic & Potential Energy Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Energy in Simple Harmonic Motion: Kinetic & Potential Energy.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-13-03",
          "title": "Energy in Simple Harmonic Motion: Kinetic & Potential Energy",
          "summary": "Kinetic energy K = 0.5*m*omega^2*(A^2 - x^2), potential energy U = 0.5*m*omega^2*x^2, total energy E = 0.5*m*omega^2*A^2."
        }
      ]
    },
    {
      "id": "top-phy-11-13-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-11-13-T04",
      "title": "The Simple Pendulum & Spring-Mass System Oscillations",
      "description": "Restoring torque tau = -m*g*L*sin theta, small angle approximation, period T = 2*pi*sqrt(L/g), and spring period T = 2*pi*sqrt(m/k).",
      "sequenceOrder": 4,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "For small angular displacements (theta < 10 degrees), restoring torque in a simple pendulum is linear: tau = -m*g*L*theta, producing simple harmonic motion with period T = 2*pi*sqrt(L/g).",
        "sections": [
          {
            "heading": "Pendulum and Spring Formulae",
            "paragraphs": [
              "Simple pendulum: T = 2*pi * sqrt(L / g). Period is independent of pendulum bob mass and depends solely on length L and local gravity g.",
              "Spring-mass system: T = 2*pi * sqrt(m / k). For springs in series: 1/k_eq = 1/k1 + 1/k2. For springs in parallel: k_eq = k1 + k2."
            ],
            "keyTakeaways": [
              "Seconds pendulum has period T = 2.0 seconds and length L approx 0.993 m on Earth's surface.",
              "Inside an accelerating elevator with upward acceleration a: effective gravity is g_eff = g + a, decreasing period T."
            ],
            "examTips": [
              "In a freely falling lift (weightlessness), effective gravity g_eff = 0, so period of simple pendulum becomes INFINITE (pendulum stops oscillating)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing heavier pendulum bobs swing slower. Period T = 2*pi*sqrt(L/g) is completely independent of mass."
        ]
      },
      "formulas": [
        {
          "label": "Simple Pendulum Period",
          "formula": "T = 2 \\pi \\sqrt{\\frac{L}{g}}",
          "description": "Period of small-amplitude oscillation of simple pendulum of effective length L.",
          "variables": [
            {
              "symbol": "L",
              "meaning": "Pendulum Length",
              "unit": "m"
            },
            {
              "symbol": "g",
              "meaning": "Gravitational Acceleration",
              "unit": "m/s^2"
            },
            {
              "symbol": "T",
              "meaning": "Time Period",
              "unit": "s"
            }
          ]
        },
        {
          "label": "Spring-Mass Oscillator Period",
          "formula": "T = 2 \\pi \\sqrt{\\frac{m}{k}}",
          "description": "Period of oscillation of mass m attached to ideal spring of stiffness constant k.",
          "variables": [
            {
              "symbol": "m",
              "meaning": "Attached Mass",
              "unit": "kg"
            },
            {
              "symbol": "k",
              "meaning": "Spring Constant",
              "unit": "N/m"
            },
            {
              "symbol": "T",
              "meaning": "Period of Oscillation",
              "unit": "s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-13-04",
          "title": "The Simple Pendulum & Spring-Mass System Oscillations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for The Simple Pendulum & Spring-Mass System Oscillations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-13-04",
          "title": "The Simple Pendulum & Spring-Mass System Oscillations",
          "summary": "Restoring torque tau = -m*g*L*sin theta, small angle approximation, period T = 2*pi*sqrt(L/g), and spring period T = 2*pi*sqrt(m/k)."
        }
      ]
    }
  ],
  "c0000011-0000-0000-0000-000000000014": [
    {
      "id": "top-phy-11-14-01",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-11-14-T01",
      "title": "Transverse and Longitudinal Waves: Speed of Waves",
      "description": "Wave propagation without mass transport, wave pulses, speed of transverse waves on stretched string v = sqrt(T/mu), speed of sound in gases.",
      "sequenceOrder": 1,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Waves transport energy and momentum through a material medium without net transport of matter. In transverse waves, particles oscillate perpendicular to wave velocity; in longitudinal waves, particles oscillate parallel to wave velocity.",
        "sections": [
          {
            "heading": "Wave Speed in Strings and Gases",
            "paragraphs": [
              "Speed on string: v = sqrt(T / mu), where T is tension and mu is mass per unit length.",
              "Newton's formula for sound in gases assumed isothermal propagation: v = sqrt(P / rho). Laplace corrected this by recognizing sound compressions are adiabatic: v = sqrt(gamma * P / rho)."
            ],
            "keyTakeaways": [
              "Sound waves in air are longitudinal; light waves in vacuum are transverse electromagnetic waves.",
              "Laplace's correction matches experimental sound speed in air (~332 m/s at STP)."
            ],
            "examTips": [
              "Sound speed increases with temperature: v directly proportional to sqrt(T_Kelvin). Sound speed is INDEPENDENT of gas pressure at constant temperature."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming sound speed increases when atmospheric pressure rises. If temperature is constant, density increases proportionally with pressure, keeping v = sqrt(gamma*P/rho) invariant."
        ]
      },
      "formulas": [
        {
          "label": "Speed of Transverse Wave on String",
          "formula": "v = \\sqrt{\\frac{T}{\\mu}}",
          "description": "Propagation speed of wave on stretched string with tension T and linear density mu.",
          "variables": [
            {
              "symbol": "T",
              "meaning": "String Tension",
              "unit": "N"
            },
            {
              "symbol": "\\mu",
              "meaning": "Linear Mass Density (m/L)",
              "unit": "kg/m"
            },
            {
              "symbol": "v",
              "meaning": "Wave Speed",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "Laplace Speed of Sound in Gas",
          "formula": "v = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{\\gamma R T}{M}}",
          "description": "Adiabatic propagation speed of longitudinal acoustic wave in ideal gas.",
          "variables": [
            {
              "symbol": "\\gamma",
              "meaning": "Adiabatic Index",
              "unit": "-"
            },
            {
              "symbol": "P",
              "meaning": "Gas Pressure",
              "unit": "Pa"
            },
            {
              "symbol": "\\rho",
              "meaning": "Gas Density",
              "unit": "kg/m^3"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "v",
              "meaning": "Speed of Sound",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-14-01",
          "title": "Transverse and Longitudinal Waves: Speed of Waves Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Transverse and Longitudinal Waves: Speed of Waves.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-14-01",
          "title": "Transverse and Longitudinal Waves: Speed of Waves",
          "summary": "Wave propagation without mass transport, wave pulses, speed of transverse waves on stretched string v = sqrt(T/mu), speed of sound in gases."
        }
      ]
    },
    {
      "id": "top-phy-11-14-02",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-11-14-T02",
      "title": "Progressive Harmonic Waves & Wave Superposition",
      "description": "Wave equation y(x,t) = A*sin(kx - omega*t + phi), wave number k = 2*pi/lambda, phase velocity v = omega/k, and superposition principle.",
      "sequenceOrder": 2,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A sinusoidal travelling wave propagates continuous phase disturbance through space: y(x,t) = A*sin(kx - omega*t) for wave travelling in +X direction.",
        "sections": [
          {
            "heading": "Wave Equation and Propagation",
            "paragraphs": [
              "Wave number k = 2*pi / lambda (rad/m); Angular frequency omega = 2*pi / T = 2*pi*f (rad/s).",
              "Phase speed: v = omega / k = lambda / T = f * lambda.",
              "Sign rule: (kx - omega*t) travels in +X direction; (kx + omega*t) travels in -X direction."
            ],
            "keyTakeaways": [
              "Particle velocity v_p = dy/dt = -omega*A*cos(kx - omega*t) = -v * (dy/dx).",
              "Superposition principle: When two or more waves overlap, resultant displacement is the algebraic vector sum: y = y1 + y2."
            ],
            "examTips": [
              "Particle speed v_p is distinct from wave propagation speed v. Maximum particle speed is v_p,max = omega*A."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing wave speed v = f*lambda with particle speed dy/dt. Wave speed is constant for a given medium; particle speed oscillates simple harmonically."
        ]
      },
      "formulas": [
        {
          "label": "Travelling Wave Equation",
          "formula": "y(x, t) = A \\sin(k x - \\omega t + \\phi) = A \\sin\\left[2\\pi\\left(\\frac{x}{\\lambda} - \\frac{t}{T}\\right)\\right]",
          "description": "Transverse displacement profile of a progressive harmonic wave moving in +X direction.",
          "variables": [
            {
              "symbol": "A",
              "meaning": "Wave Amplitude",
              "unit": "m"
            },
            {
              "symbol": "k",
              "meaning": "Wave Number (2 pi / lambda)",
              "unit": "rad/m"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Frequency",
              "unit": "rad/s"
            },
            {
              "symbol": "y",
              "meaning": "Transverse Displacement",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-14-02",
          "title": "Progressive Harmonic Waves & Wave Superposition Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Progressive Harmonic Waves & Wave Superposition.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-14-02",
          "title": "Progressive Harmonic Waves & Wave Superposition",
          "summary": "Wave equation y(x,t) = A*sin(kx - omega*t + phi), wave number k = 2*pi/lambda, phase velocity v = omega/k, and superposition principle."
        }
      ]
    },
    {
      "id": "top-phy-11-14-03",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-11-14-T03",
      "title": "Standing Waves in Strings, Organ Pipes & Resonant Harmonics",
      "description": "Reflection at boundaries, nodes and antinodes, harmonics in stretched strings, open organ pipes, and closed organ pipes.",
      "sequenceOrder": 3,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "When two identical travelling waves propagate in opposite directions along the same medium, their superposition produces a standing (stationary) wave with stationary nodes (zero motion) and antinodes (maximum amplitude).",
        "sections": [
          {
            "heading": "Boundary Conditions and Resonance Frequencies",
            "paragraphs": [
              "Fixed boundary reflects with phase reversal (Delta phi = pi); Free boundary reflects without phase change (Delta phi = 0).",
              "Stretched string fixed at both ends & Open organ pipe: Both produce ALL harmonics (f, 2f, 3f, 4f...): f_n = n * v / (2L).",
              "Closed organ pipe (one end closed, one open): Produces ONLY ODD harmonics (f, 3f, 5f...): f_n = (2n - 1) * v / (4L)."
            ],
            "keyTakeaways": [
              "Distance between two successive nodes or antinodes is lambda / 2.",
              "Distance between an adjacent node and antinode is lambda / 4.",
              "Standing waves transmit ZERO net energy along the medium."
            ],
            "examTips": [
              "An open organ pipe produces richer, more harmonious sound than a closed organ pipe because it contains all integer harmonics."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing standing waves transmit energy through space. Energy is trapped oscillating between stationary nodes."
        ]
      },
      "formulas": [
        {
          "label": "Harmonics of Stretched String / Open Pipe",
          "formula": "f_n = n \\frac{v}{2 L} \\quad (n = 1, 2, 3, \\dots)",
          "description": "Frequencies of all resonant harmonics in stretched string fixed at both ends or organ pipe open at both ends.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Harmonic Number",
              "unit": "-"
            },
            {
              "symbol": "v",
              "meaning": "Wave Speed in Medium",
              "unit": "m/s"
            },
            {
              "symbol": "L",
              "meaning": "Length of Resonator",
              "unit": "m"
            },
            {
              "symbol": "f_n",
              "meaning": "Resonant Frequency",
              "unit": "Hz"
            }
          ]
        },
        {
          "label": "Harmonics of Closed Organ Pipe",
          "formula": "f_n = (2n - 1) \\frac{v}{4 L} \\quad (n = 1, 2, 3, \\dots)",
          "description": "Only odd harmonics produced in organ pipe closed at one end.",
          "variables": [
            {
              "symbol": "v",
              "meaning": "Speed of Sound",
              "unit": "m/s"
            },
            {
              "symbol": "L",
              "meaning": "Pipe Length",
              "unit": "m"
            },
            {
              "symbol": "f_n",
              "meaning": "Odd Harmonic Frequency",
              "unit": "Hz"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-14-03",
          "title": "Standing Waves in Strings, Organ Pipes & Resonant Harmonics Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Standing Waves in Strings, Organ Pipes & Resonant Harmonics.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-14-03",
          "title": "Standing Waves in Strings, Organ Pipes & Resonant Harmonics",
          "summary": "Reflection at boundaries, nodes and antinodes, harmonics in stretched strings, open organ pipes, and closed organ pipes."
        }
      ]
    },
    {
      "id": "top-phy-11-14-04",
      "subjectId": "physics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000011-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-11-14-T04",
      "title": "Acoustic Beats, Beat Frequency & Tuning Phenomena",
      "description": "Superposition of waves of slightly differing frequencies, periodic modulation of loudness, beat frequency f_beat = |f1 - f2|.",
      "sequenceOrder": 4,
      "weightagePercent": 1.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Beats occur when two sound waves of slightly differing frequencies f1 and f2 travel in the same direction, superposing to create periodic variations in sound intensity.",
        "sections": [
          {
            "heading": "Beat Period and Application",
            "paragraphs": [
              "Resultant amplitude varies as: A_res = 2*A*cos(2*pi * ((f1 - f2)/2) * t).",
              "Intensity peaks with beat frequency: f_beat = |f1 - f2|. Human ear perceives beats distinctly when f_beat <= 10 Hz (persistence of hearing).",
              "Waxing a tuning fork increases mass, lowering its frequency; filing a tuning fork reduces mass, raising its frequency."
            ],
            "keyTakeaways": [
              "Beats are used by musicians to accurately tune musical instruments to standard pitch.",
              "If loading a fork with wax decreases beat frequency, the original frequency of the loaded fork was greater than the standard fork."
            ],
            "examTips": [
              "Remember: Waxing -> frequency decreases (m increases); Filing -> frequency increases (m decreases)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing beat frequency with the mean carrier frequency. Beat frequency is the difference |f1 - f2|."
        ]
      },
      "formulas": [
        {
          "label": "Beat Frequency",
          "formula": "f_{\\text{beat}} = |f_1 - f_2|",
          "description": "Number of loudness intensity maxima heard per second.",
          "variables": [
            {
              "symbol": "f_1, f_2",
              "meaning": "Frequencies of Superposing Waves",
              "unit": "Hz"
            },
            {
              "symbol": "f_{\\text{beat}}",
              "meaning": "Beat Frequency",
              "unit": "Hz"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-11-14-04",
          "title": "Acoustic Beats, Beat Frequency & Tuning Phenomena Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Acoustic Beats, Beat Frequency & Tuning Phenomena.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-11-14-04",
          "title": "Acoustic Beats, Beat Frequency & Tuning Phenomena",
          "summary": "Superposition of waves of slightly differing frequencies, periodic modulation of loudness, beat frequency f_beat = |f1 - f2|."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000003": [
    {
      "id": "top-phy-12-01-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "PHY-12-01-T01",
      "title": "Electric Charges, Quantisation & Coulomb’s Law",
      "description": "Frictional electricity, charge conservation, quantisation q = +-n*e, Coulomb's inverse square law in vector form, permittivity of medium.",
      "sequenceOrder": 1,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Electric charge is an intrinsic scalar property of elementary particles. Charge is conserved, invariant under relativistic motion, and quantised in integer multiples of elementary charge e = 1.602 x 10^-19 C.",
        "sections": [
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
            "examTips": [
              "Remember that Coulomb force decreases significantly in high-dielectric media like water, explaining why ionic salts dissociate readily."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking charge magnitude varies with speed: unlike mass, electric charge is strictly relativistically invariant."
        ]
      },
      "formulas": [
        {
          "label": "Coulomb’s Electrostatic Law",
          "formula": "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}",
          "description": "Electrostatic interaction force between two stationary point charges separated by distance r in vacuum.",
          "variables": [
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Permittivity of Free Space",
              "unit": "C^2/(N m^2)"
            },
            {
              "symbol": "q_1, q_2",
              "meaning": "Point Charges",
              "unit": "C"
            },
            {
              "symbol": "r",
              "meaning": "Separation Distance",
              "unit": "m"
            },
            {
              "symbol": "F",
              "meaning": "Electrostatic Force",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Quantisation of Charge",
          "formula": "q = \\pm n e",
          "description": "Electric charge exists in discrete integer multiples of elementary charge e = 1.602 x 10^-19 C.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Integer Number of Electrons/Protons",
              "unit": "-"
            },
            {
              "symbol": "e",
              "meaning": "Elementary Charge Quantum",
              "unit": "C"
            },
            {
              "symbol": "q",
              "meaning": "Total Net Charge",
              "unit": "C"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-01-01",
          "title": "Electric Charges, Quantisation & Coulomb’s Law Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Electric Charges, Quantisation & Coulomb’s Law.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-01-01",
          "title": "Electric Charges, Quantisation & Coulomb’s Law",
          "summary": "Frictional electricity, charge conservation, quantisation q = +-n*e, Coulomb's inverse square law in vector form, permittivity of medium."
        }
      ]
    },
    {
      "id": "top-phy-12-01-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "PHY-12-01-T02",
      "title": "Electric Field Lines, Field of Point Charges & Field Lines",
      "description": "Electric field intensity E = F/q0, field of single and multiple point charges, properties of field lines, neutral points.",
      "sequenceOrder": 2,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "An electric field E is a vector force field surrounding charges: E = F / q0 = (1 / (4*pi*epsilon_0)) * (q / r^2) * r_hat.",
        "sections": [
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
            "examTips": [
              "Electric field inside a hollow charged conductor in electrostatic equilibrium is identically zero (electrostatic shielding)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing electric field lines can intersect. Two field lines never cross because field direction at any point is unique."
        ]
      },
      "formulas": [
        {
          "label": "Electric Field of Point Charge",
          "formula": "\\vec{E} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r^2} \\hat{r}",
          "description": "Vector electric field intensity produced by source charge q at distance r.",
          "variables": [
            {
              "symbol": "q",
              "meaning": "Source Charge",
              "unit": "C"
            },
            {
              "symbol": "r",
              "meaning": "Distance from Charge",
              "unit": "m"
            },
            {
              "symbol": "\\vec{E}",
              "meaning": "Electric Field Intensity",
              "unit": "N/C"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-12-01-02",
          "title": "Electric Field Lines, Field of Point Charges & Field Lines Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Electric Field Lines, Field of Point Charges & Field Lines with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "point_charge_field"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-01-02",
          "title": "Electric Field Lines, Field of Point Charges & Field Lines",
          "summary": "Electric field intensity E = F/q0, field of single and multiple point charges, properties of field lines, neutral points.",
          "simulationId": "point_charge_field"
        }
      ]
    },
    {
      "id": "top-phy-12-01-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "PHY-12-01-T03",
      "title": "Electric Dipole, Dipole Moment & Field Calculations",
      "description": "Dipole moment p = q*2a, electric field on axial line E_axial = 2kp/r^3, equatorial line E_eq = -kp/r^3, torque tau = p x E.",
      "sequenceOrder": 3,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "An electric dipole consists of a pair of equal and opposite point charges (+q and -q) separated by distance 2a. Electric dipole moment is vector p = q * (2a) directed from negative to positive charge.",
        "sections": [
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
            "examTips": [
              "Stable equilibrium occurs at theta = 0 (p parallel to E, U = -pE); Unstable equilibrium occurs at theta = 180 degrees (U = +pE)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking net force on a dipole in a uniform field is non-zero. Net translational force is zero; only torque exists."
        ]
      },
      "formulas": [
        {
          "label": "Axial Field of Short Dipole",
          "formula": "E_{\\text{axial}} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 p}{r^3}",
          "description": "Electric field along the dipole axis at distance r >> a.",
          "variables": [
            {
              "symbol": "p",
              "meaning": "Dipole Moment (q * 2a)",
              "unit": "C m"
            },
            {
              "symbol": "r",
              "meaning": "Axial Distance",
              "unit": "m"
            },
            {
              "symbol": "E_{\\text{axial}}",
              "meaning": "Axial Electric Field",
              "unit": "N/C"
            }
          ]
        },
        {
          "label": "Equatorial Field of Short Dipole",
          "formula": "E_{\\text{eq}} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{p}{r^3}",
          "description": "Electric field on broadside equatorial plane perpendicular to dipole axis.",
          "variables": [
            {
              "symbol": "p",
              "meaning": "Dipole Moment",
              "unit": "C m"
            },
            {
              "symbol": "r",
              "meaning": "Equatorial Distance",
              "unit": "m"
            },
            {
              "symbol": "E_{\\text{eq}}",
              "meaning": "Equatorial Field",
              "unit": "N/C"
            }
          ]
        },
        {
          "label": "Torque on Dipole in Uniform Field",
          "formula": "\\vec{\\tau} = \\vec{p} \\times \\vec{E} \\implies \\tau = p E \\sin\\theta",
          "description": "Mechanical aligning torque experienced by electric dipole in uniform external field E.",
          "variables": [
            {
              "symbol": "p",
              "meaning": "Dipole Moment",
              "unit": "C m"
            },
            {
              "symbol": "E",
              "meaning": "External Electric Field",
              "unit": "N/C"
            },
            {
              "symbol": "\\theta",
              "meaning": "Orientation Angle",
              "unit": "rad"
            },
            {
              "symbol": "\\tau",
              "meaning": "Aligning Torque",
              "unit": "N m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-01-03",
          "title": "Electric Dipole, Dipole Moment & Field Calculations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Electric Dipole, Dipole Moment & Field Calculations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-01-03",
          "title": "Electric Dipole, Dipole Moment & Field Calculations",
          "summary": "Dipole moment p = q*2a, electric field on axial line E_axial = 2kp/r^3, equatorial line E_eq = -kp/r^3, torque tau = p x E."
        }
      ]
    },
    {
      "id": "top-phy-12-01-04",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "PHY-12-01-T04",
      "title": "Electric Flux, Gauss’s Law & Symmetric Field Applications",
      "description": "Electric flux Phi = integral(E . dA), Gauss's theorem Phi_net = q_encl / epsilon_0, applications to infinite wire, plane sheet, spherical shell.",
      "sequenceOrder": 4,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Gauss’s law equates the net outward electric flux through any closed Gaussian surface to the net enclosed charge divided by permittivity: Phi = oint(E . dA) = q_encl / epsilon_0.",
        "sections": [
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
            "examTips": [
              "For conducting sheets, charge resides on both surfaces, so field outside is E = sigma / epsilon_0 (double that of a single non-conducting sheet)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming external charges contribute to net Gaussian flux. External charges alter local field E on the surface, but their net flux contribution over the entire closed surface integrates to zero."
        ]
      },
      "formulas": [
        {
          "label": "Gauss’s Law",
          "formula": "\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{encl}}}{\\varepsilon_0}",
          "description": "Total outward electric flux through closed Gaussian surface equals enclosed charge over epsilon_0.",
          "variables": [
            {
              "symbol": "q_{\\text{encl}}",
              "meaning": "Net Enclosed Charge",
              "unit": "C"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Permittivity of Free Space",
              "unit": "C^2/(N m^2)"
            },
            {
              "symbol": "\\Phi_E",
              "meaning": "Net Electric Flux",
              "unit": "N m^2/C"
            }
          ]
        },
        {
          "label": "Field of Infinitely Long Straight Wire",
          "formula": "E = \\frac{\\lambda}{2\\pi\\varepsilon_0 r}",
          "description": "Radial electric field at distance r from infinite straight line charge of density lambda.",
          "variables": [
            {
              "symbol": "\\lambda",
              "meaning": "Linear Charge Density",
              "unit": "C/m"
            },
            {
              "symbol": "r",
              "meaning": "Radial Distance",
              "unit": "m"
            },
            {
              "symbol": "E",
              "meaning": "Electric Field",
              "unit": "N/C"
            }
          ]
        },
        {
          "label": "Field of Infinite Uniform Sheet of Charge",
          "formula": "E = \\frac{\\sigma}{2\\varepsilon_0}",
          "description": "Uniform perpendicular electric field produced by infinite planar non-conducting sheet of surface charge density sigma.",
          "variables": [
            {
              "symbol": "\\sigma",
              "meaning": "Surface Charge Density",
              "unit": "C/m^2"
            },
            {
              "symbol": "E",
              "meaning": "Uniform Electric Field",
              "unit": "N/C"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-01-04",
          "title": "Electric Flux, Gauss’s Law & Symmetric Field Applications Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Electric Flux, Gauss’s Law & Symmetric Field Applications.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-01-04",
          "title": "Electric Flux, Gauss’s Law & Symmetric Field Applications",
          "summary": "Electric flux Phi = integral(E . dA), Gauss's theorem Phi_net = q_encl / epsilon_0, applications to infinite wire, plane sheet, spherical shell."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000002": [
    {
      "id": "top-phy-12-02-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-12-02-T01",
      "title": "Electrostatic Potential & Potential Due to Charge Distributions",
      "description": "Potential difference Delta V = W/q0, potential of point charge V = q / (4*pi*epsilon_0*r), dipole potential, and superposition.",
      "sequenceOrder": 1,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Electrostatic potential V at a point is the work done per unit positive test charge in bringing it from infinity to that point against electrostatic forces: V = -integral(E . dr).",
        "sections": [
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
            "examTips": [
              "Work done in moving charge q between potentials V1 and V2: W = q*(V2 - V1), independent of path."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing zero potential implies zero electric field. On the equatorial line of a dipole, potential is zero everywhere, but electric field is non-zero."
        ]
      },
      "formulas": [
        {
          "label": "Point Charge Electric Potential",
          "formula": "V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}",
          "description": "Scalar electrostatic potential at distance r from point charge q with zero datum at infinity.",
          "variables": [
            {
              "symbol": "q",
              "meaning": "Source Charge",
              "unit": "C"
            },
            {
              "symbol": "r",
              "meaning": "Distance",
              "unit": "m"
            },
            {
              "symbol": "V",
              "meaning": "Electric Potential",
              "unit": "V"
            }
          ]
        },
        {
          "label": "Short Dipole Potential",
          "formula": "V(r, \\theta) = \\frac{1}{4\\pi\\varepsilon_0} \\frac{p \\cos\\theta}{r^2}",
          "description": "Potential at coordinates (r, theta) from centre of short electric dipole of moment p.",
          "variables": [
            {
              "symbol": "p",
              "meaning": "Dipole Moment",
              "unit": "C m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Polar Angle from Dipole Axis",
              "unit": "rad"
            },
            {
              "symbol": "r",
              "meaning": "Radial Distance",
              "unit": "m"
            },
            {
              "symbol": "V",
              "meaning": "Dipole Potential",
              "unit": "V"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-02-01",
          "title": "Electrostatic Potential & Potential Due to Charge Distributions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Electrostatic Potential & Potential Due to Charge Distributions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-02-01",
          "title": "Electrostatic Potential & Potential Due to Charge Distributions",
          "summary": "Potential difference Delta V = W/q0, potential of point charge V = q / (4*pi*epsilon_0*r), dipole potential, and superposition."
        }
      ]
    },
    {
      "id": "top-phy-12-02-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-12-02-T02",
      "title": "Equipotential Surfaces & Field-Potential Relation",
      "description": "Equipotential surface definition, work done on equipotential is zero, E = -dV/dr, surface shapes for point charges and uniform fields.",
      "sequenceOrder": 2,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "An equipotential surface is a locus of points having identical electric potential throughout. No work is required to move a charge across an equipotential surface: dW = q*dV = 0.",
        "sections": [
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
            "examTips": [
              "The surface of any conductor in electrostatic equilibrium is an equipotential surface."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking work is done moving a charge along an equipotential surface. Since Delta V = 0, work is strictly zero."
        ]
      },
      "formulas": [
        {
          "label": "Electric Field - Potential Gradient Relation",
          "formula": "E = -\\frac{dV}{dr} \\implies \\vec{E} = -\\nabla V = -\\left(\\frac{\\partial V}{\\partial x}\\hat{i} + \\frac{\\partial V}{\\partial y}\\hat{j} + \\frac{\\partial V}{\\partial z}\\hat{k}\\right)",
          "description": "Electric field is the negative spatial gradient of electrostatic potential.",
          "variables": [
            {
              "symbol": "V",
              "meaning": "Potential Function",
              "unit": "V"
            },
            {
              "symbol": "r",
              "meaning": "Spatial Coordinate",
              "unit": "m"
            },
            {
              "symbol": "E",
              "meaning": "Electric Field",
              "unit": "V/m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-02-02",
          "title": "Equipotential Surfaces & Field-Potential Relation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Equipotential Surfaces & Field-Potential Relation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-02-02",
          "title": "Equipotential Surfaces & Field-Potential Relation",
          "summary": "Equipotential surface definition, work done on equipotential is zero, E = -dV/dr, surface shapes for point charges and uniform fields."
        }
      ]
    },
    {
      "id": "top-phy-12-02-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-12-02-T03",
      "title": "Capacitors, Dielectrics & Capacitance of Parallel Plate Capacitor",
      "description": "Capacitance C = Q/V, parallel plate capacitor C0 = epsilon_0*A/d, dielectric insertion C = K*C0, bound surface charge density.",
      "sequenceOrder": 3,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A capacitor stores electric charge and electrostatic field energy. Inserting a dielectric of dielectric constant K between plates reduces internal electric field and increases capacitance by factor K.",
        "sections": [
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
            "examTips": [
              "Always check whether the battery remains connected or disconnected before evaluating changes in Q, V, E, and U."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming capacitance C = Q/V changes when Q changes. C is an intrinsic geometric constant; doubling Q simply doubles voltage V."
        ]
      },
      "formulas": [
        {
          "label": "Parallel Plate Capacitance",
          "formula": "C = \\frac{K \\varepsilon_0 A}{d}",
          "description": "Capacitance of parallel plate capacitor of area A and plate separation d filled with dielectric of constant K.",
          "variables": [
            {
              "symbol": "A",
              "meaning": "Plate Surface Area",
              "unit": "m^2"
            },
            {
              "symbol": "d",
              "meaning": "Plate Separation Distance",
              "unit": "m"
            },
            {
              "symbol": "K",
              "meaning": "Dielectric Constant",
              "unit": "-"
            },
            {
              "symbol": "C",
              "meaning": "Capacitance",
              "unit": "F"
            }
          ]
        },
        {
          "label": "Capacitor with Partial Dielectric Slab",
          "formula": "C = \\frac{\\varepsilon_0 A}{d - t + \\frac{t}{K}}",
          "description": "Capacitance with dielectric slab of thickness t < d inserted between plates.",
          "variables": [
            {
              "symbol": "t",
              "meaning": "Dielectric Slab Thickness",
              "unit": "m"
            },
            {
              "symbol": "d",
              "meaning": "Plate Separation",
              "unit": "m"
            },
            {
              "symbol": "K",
              "meaning": "Dielectric Constant",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-02-03",
          "title": "Capacitors, Dielectrics & Capacitance of Parallel Plate Capacitor Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Capacitors, Dielectrics & Capacitance of Parallel Plate Capacitor.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-02-03",
          "title": "Capacitors, Dielectrics & Capacitance of Parallel Plate Capacitor",
          "summary": "Capacitance C = Q/V, parallel plate capacitor C0 = epsilon_0*A/d, dielectric insertion C = K*C0, bound surface charge density."
        }
      ]
    },
    {
      "id": "top-phy-12-02-04",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "PHY-12-02-T04",
      "title": "Combination of Capacitors & Electrostatic Energy Storage",
      "description": "Series combination 1/C = 1/C1 + 1/C2, parallel combination C = C1 + C2, energy U = 0.5*C*V^2, energy density u = 0.5*epsilon_0*E^2.",
      "sequenceOrder": 4,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Capacitors can be interconnected in series (shared charge Q) or parallel (shared voltage V). Energy stored resides in the electrostatic field between plates.",
        "sections": [
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
            "examTips": [
              "The energy formula U = (1/2)*C*V^2 has factor 1/2 because average potential during charging is V/2."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming energy is conserved when connecting two charged capacitors. Charge is conserved, but electrostatic energy is ALWAYS lost as heat in connecting wires."
        ]
      },
      "formulas": [
        {
          "label": "Stored Electrostatic Energy",
          "formula": "U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2 C} = \\frac{1}{2} Q V",
          "description": "Energy stored in electrostatic field of capacitor of capacitance C charged to voltage V.",
          "variables": [
            {
              "symbol": "C",
              "meaning": "Capacitance",
              "unit": "F"
            },
            {
              "symbol": "V",
              "meaning": "Potential Difference",
              "unit": "V"
            },
            {
              "symbol": "Q",
              "meaning": "Stored Charge",
              "unit": "C"
            },
            {
              "symbol": "U",
              "meaning": "Electrostatic Energy",
              "unit": "J"
            }
          ]
        },
        {
          "label": "Electrostatic Field Energy Density",
          "formula": "u = \\frac{1}{2} \\varepsilon_0 E^2",
          "description": "Energy stored per unit volume in electric field E in vacuum.",
          "variables": [
            {
              "symbol": "E",
              "meaning": "Electric Field Intensity",
              "unit": "V/m"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Permittivity of Free Space",
              "unit": "C^2/(N m^2)"
            },
            {
              "symbol": "u",
              "meaning": "Energy Density",
              "unit": "J/m^3"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-02-04",
          "title": "Combination of Capacitors & Electrostatic Energy Storage Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Combination of Capacitors & Electrostatic Energy Storage.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-02-04",
          "title": "Combination of Capacitors & Electrostatic Energy Storage",
          "summary": "Series combination 1/C = 1/C1 + 1/C2, parallel combination C = C1 + C2, energy U = 0.5*C*V^2, energy density u = 0.5*epsilon_0*E^2."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000004": [
    {
      "id": "top-phy-12-03-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-03-T01",
      "title": "Electric Current, Drift Velocity & Origin of Resistivity",
      "description": "Current I = dQ/dt, current density J = I/A, microscopic electron drift v_d = -e*E*tau/m, relation I = n*e*A*v_d, and Ohm's law.",
      "sequenceOrder": 1,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Electric current is the net macroscopic charge flow across a cross-section. Under an electric field E, free electrons accelerate and collide with lattice ions, achieving a steady average drift velocity v_d on the order of 10^-4 m/s.",
        "sections": [
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
            "examTips": [
              "Drift velocity is directly proportional to applied electric field E and potential difference V across a fixed wire length."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming electrons travel at light speed through wires. Individual electron drift speed is fractions of a mm/s; it is the electric field disturbance that travels at near light speed."
        ]
      },
      "formulas": [
        {
          "label": "Drift Velocity of Electrons",
          "formula": "v_d = \\frac{e E \\tau}{m} = \\frac{e V \\tau}{m L}",
          "description": "Steady average drift speed acquired by conduction electrons in conductor of length L under voltage V.",
          "variables": [
            {
              "symbol": "e",
              "meaning": "Elementary Electron Charge",
              "unit": "C"
            },
            {
              "symbol": "\\tau",
              "meaning": "Relaxation Time",
              "unit": "s"
            },
            {
              "symbol": "m",
              "meaning": "Electron Mass",
              "unit": "kg"
            },
            {
              "symbol": "E",
              "meaning": "Electric Field Intensity",
              "unit": "V/m"
            },
            {
              "symbol": "v_d",
              "meaning": "Drift Velocity",
              "unit": "m/s"
            }
          ]
        },
        {
          "label": "Current - Drift Velocity Relation",
          "formula": "I = n e A v_d",
          "description": "Macroscopic electric current expressed in terms of microscopic electron drift.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Conduction Electron Density",
              "unit": "m^-3"
            },
            {
              "symbol": "e",
              "meaning": "Charge Quantum",
              "unit": "C"
            },
            {
              "symbol": "A",
              "meaning": "Cross-Sectional Area",
              "unit": "m^2"
            },
            {
              "symbol": "I",
              "meaning": "Electric Current",
              "unit": "A"
            }
          ]
        },
        {
          "label": "Microscopic Ohm’s Law",
          "formula": "\\vec{J} = \\sigma \\vec{E} = \\frac{1}{\\rho} \\vec{E}",
          "description": "Vector current density proportional to applied electric field with electrical conductivity sigma.",
          "variables": [
            {
              "symbol": "\\vec{J}",
              "meaning": "Current Density Vector",
              "unit": "A/m^2"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Electrical Conductivity",
              "unit": "S/m"
            },
            {
              "symbol": "\\rho",
              "meaning": "Electrical Resistivity",
              "unit": "\\Omega m"
            },
            {
              "symbol": "\\vec{E}",
              "meaning": "Electric Field",
              "unit": "V/m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-03-01",
          "title": "Electric Current, Drift Velocity & Origin of Resistivity Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Electric Current, Drift Velocity & Origin of Resistivity.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-03-01",
          "title": "Electric Current, Drift Velocity & Origin of Resistivity",
          "summary": "Current I = dQ/dt, current density J = I/A, microscopic electron drift v_d = -e*E*tau/m, relation I = n*e*A*v_d, and Ohm's law."
        }
      ]
    },
    {
      "id": "top-phy-12-03-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-03-T02",
      "title": "Temperature Dependence of Resistivity & Electric Power",
      "description": "Temperature coefficient alpha, resistivity rho(T) = rho0*(1 + alpha*Delta T), Joule heating H = I^2*R*t, maximum power transfer theorem.",
      "sequenceOrder": 2,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "For metallic conductors, increasing temperature increases lattice ion vibrations, reducing relaxation time tau and raising resistivity (alpha > 0). For semiconductors, carrier density n increases exponentially, causing resistivity to drop sharply (alpha < 0).",
        "sections": [
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
            "examTips": [
              "Bulb ratings (e.g. 100W, 220V): Resistance R = V_rated^2 / P_rated is constant. Power consumed at another voltage V is P_consumed = V^2 / R."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming higher wattage bulbs have higher resistance. Lower resistance draws more current at constant voltage, producing higher power output (P = V^2 / R)."
        ]
      },
      "formulas": [
        {
          "label": "Temperature Dependence of Resistance",
          "formula": "R(T) = R_0 [1 + \\alpha (T - T_0)]",
          "description": "Variation of electrical resistance with temperature for material with temperature coefficient alpha.",
          "variables": [
            {
              "symbol": "R_0",
              "meaning": "Resistance at Reference Temp T0",
              "unit": "\\Omega"
            },
            {
              "symbol": "\\alpha",
              "meaning": "Temperature Coefficient",
              "unit": "K^-1"
            },
            {
              "symbol": "R(T)",
              "meaning": "Resistance at Temperature T",
              "unit": "\\Omega"
            }
          ]
        },
        {
          "label": "Joule Heating Power",
          "formula": "P = V I = I^2 R = \\frac{V^2}{R}",
          "description": "Rate of electrical energy dissipated as thermal heat in a resistive element.",
          "variables": [
            {
              "symbol": "V",
              "meaning": "Voltage Drop",
              "unit": "V"
            },
            {
              "symbol": "I",
              "meaning": "Current",
              "unit": "A"
            },
            {
              "symbol": "R",
              "meaning": "Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "P",
              "meaning": "Dissipated Power",
              "unit": "W"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-03-02",
          "title": "Temperature Dependence of Resistivity & Electric Power Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Temperature Dependence of Resistivity & Electric Power.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-03-02",
          "title": "Temperature Dependence of Resistivity & Electric Power",
          "summary": "Temperature coefficient alpha, resistivity rho(T) = rho0*(1 + alpha*Delta T), Joule heating H = I^2*R*t, maximum power transfer theorem."
        }
      ]
    },
    {
      "id": "top-phy-12-03-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-03-T03",
      "title": "Cells, EMF, Internal Resistance & Grouping of Cells",
      "description": "Electromotive force E, terminal voltage V = E - I*r, series and parallel combination of cells, condition for maximum current.",
      "sequenceOrder": 3,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A chemical cell maintains potential difference across a circuit. EMF E is the open-circuit potential difference. When delivering current I, terminal voltage drops due to internal resistance: V = E - I*r.",
        "sections": [
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
            "examTips": [
              "Short-circuit current of a cell is I_max = E / r (when external resistance R = 0)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing terminal voltage is always less than EMF. During charging, external current enters the positive terminal, making V = E + Ir > E."
        ]
      },
      "formulas": [
        {
          "label": "Terminal Voltage of Discharging Cell",
          "formula": "V = E - I r",
          "description": "Closed-circuit terminal voltage of cell of emf E and internal resistance r supplying current I.",
          "variables": [
            {
              "symbol": "E",
              "meaning": "Electromotive Force",
              "unit": "V"
            },
            {
              "symbol": "I",
              "meaning": "Load Current Delivered",
              "unit": "A"
            },
            {
              "symbol": "r",
              "meaning": "Internal Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "V",
              "meaning": "Terminal Potential Difference",
              "unit": "V"
            }
          ]
        },
        {
          "label": "Parallel Combination of Unequal Cells",
          "formula": "E_{\\text{eq}} = \\frac{\\frac{E_1}{r_1} + \\frac{E_2}{r_2}}{\\frac{1}{r_1} + \\frac{1}{r_2}}, \\quad \\frac{1}{r_{\\text{eq}}} = \\frac{1}{r_1} + \\frac{1}{r_2}",
          "description": "Equivalent emf and internal resistance for two cells connected in parallel.",
          "variables": [
            {
              "symbol": "E_1, E_2",
              "meaning": "EMFs of Cells",
              "unit": "V"
            },
            {
              "symbol": "r_1, r_2",
              "meaning": "Internal Resistances",
              "unit": "\\Omega"
            },
            {
              "symbol": "E_{\\text{eq}}",
              "meaning": "Equivalent EMF",
              "unit": "V"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-03-03",
          "title": "Cells, EMF, Internal Resistance & Grouping of Cells Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Cells, EMF, Internal Resistance & Grouping of Cells.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-03-03",
          "title": "Cells, EMF, Internal Resistance & Grouping of Cells",
          "summary": "Electromotive force E, terminal voltage V = E - I*r, series and parallel combination of cells, condition for maximum current."
        }
      ]
    },
    {
      "id": "top-phy-12-03-04",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-03-T04",
      "title": "Kirchhoff’s Rules & Complex DC Circuit Mesh Analysis",
      "description": "Kirchhoff's Current Law (KCL / junction rule, charge conservation), Kirchhoff's Voltage Law (KVL / loop rule, energy conservation), multi-loop circuit networks.",
      "sequenceOrder": 4,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Kirchhoff's rules enable systematic solution of complex electrical networks beyond simple series-parallel reductions, expressing fundamental conservation of electric charge (KCL) and energy (KVL).",
        "sections": [
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
            "examTips": [
              "Always label branch current directions explicitly with arrows before writing KVL loop equations."
            ]
          }
        ],
        "commonMisconceptions": [
          "Mixing up sign conventions in loop rules. Be consistent: tracing along current gives -IR; tracing against current gives +IR."
        ]
      },
      "formulas": [
        {
          "label": "Kirchhoff’s Current Law (Junction Rule)",
          "formula": "\\sum I = 0 \\implies \\sum I_{\\text{in}} = \\sum I_{\\text{out}}",
          "description": "Algebraic sum of currents meeting at any electrical node is zero (charge conservation).",
          "variables": [
            {
              "symbol": "I",
              "meaning": "Branch Currents",
              "unit": "A"
            }
          ]
        },
        {
          "label": "Kirchhoff’s Voltage Law (Loop Rule)",
          "formula": "\\sum \\Delta V = 0 \\implies \\sum E = \\sum I R",
          "description": "Algebraic sum of potential differences around any closed circuit loop is zero (energy conservation).",
          "variables": [
            {
              "symbol": "E",
              "meaning": "Source EMFs",
              "unit": "V"
            },
            {
              "symbol": "I R",
              "meaning": "Resistive Potential Drops",
              "unit": "V"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-12-03-04",
          "title": "Kirchhoff’s Rules & Complex DC Circuit Mesh Analysis Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Kirchhoff’s Rules & Complex DC Circuit Mesh Analysis with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "dc_circuit_mesh"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-03-04",
          "title": "Kirchhoff’s Rules & Complex DC Circuit Mesh Analysis",
          "summary": "Kirchhoff's Current Law (KCL / junction rule, charge conservation), Kirchhoff's Voltage Law (KVL / loop rule, energy conservation), multi-loop circuit networks.",
          "simulationId": "dc_circuit_mesh"
        }
      ]
    },
    {
      "id": "top-phy-12-03-05",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-03-T05",
      "title": "The Wheatstone Bridge & Balanced Null Condition",
      "description": "Bridge configuration with 4 resistors P, Q, R, S, galvanometer null condition P/Q = R/S, high sensitivity conditions.",
      "sequenceOrder": 5,
      "weightagePercent": 1.4,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Wheatstone bridge is a precision null-detection circuit used to measure unknown electrical resistances with high accuracy without drawing current from the circuit at balance.",
        "sections": [
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
            "examTips": [
              "When solving bridge problems, always check first if the bridge is balanced (P/Q = R/S) to eliminate the middle resistor immediately!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming the galvanometer must be connected between specific opposite nodes. Swapping battery and galvanometer positions preserves the balance condition."
        ]
      },
      "formulas": [
        {
          "label": "Balanced Wheatstone Bridge Condition",
          "formula": "\\frac{P}{Q} = \\frac{R}{S} \\implies I_g = 0",
          "description": "Condition under which galvanometer current vanishes and bridge is balanced.",
          "variables": [
            {
              "symbol": "P, Q",
              "meaning": "Ratio Arm Resistances",
              "unit": "\\Omega"
            },
            {
              "symbol": "R",
              "meaning": "Standard Known Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "S",
              "meaning": "Unknown Resistance",
              "unit": "\\Omega"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-03-05",
          "title": "The Wheatstone Bridge & Balanced Null Condition Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for The Wheatstone Bridge & Balanced Null Condition.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-03-05",
          "title": "The Wheatstone Bridge & Balanced Null Condition",
          "summary": "Bridge configuration with 4 resistors P, Q, R, S, galvanometer null condition P/Q = R/S, high sensitivity conditions."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000004": [
    {
      "id": "top-phy-12-04-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-04-T01",
      "title": "Magnetic Force on Moving Charges & Lorentz Force",
      "description": "Lorentz force F = q(E + v x B), motion of charge in uniform magnetic field, helical path, pitch of helix, and cyclotron frequency.",
      "sequenceOrder": 1,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A magnetic field exerts a velocity-dependent deflecting force on moving charges: F_m = q(v x B). The Lorentz force combines electrostatic and magnetic forces: F = q(E + v x B).",
        "sections": [
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
            "examTips": [
              "In crossed electric and perpendicular magnetic fields, velocity selector passes particles undeflected when v = E / B."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking magnetic force can speed up a charged particle. Magnetic force is always perpendicular to velocity, so power P = F . v is identically zero."
        ]
      },
      "formulas": [
        {
          "label": "Lorentz Force Law",
          "formula": "\\vec{F} = q (\\vec{E} + \\vec{v} \\times \\vec{B})",
          "description": "Total electromagnetic force on charge q moving at velocity v in fields E and B.",
          "variables": [
            {
              "symbol": "q",
              "meaning": "Electric Charge",
              "unit": "C"
            },
            {
              "symbol": "\\vec{E}",
              "meaning": "Electric Field",
              "unit": "V/m"
            },
            {
              "symbol": "\\vec{v}",
              "meaning": "Particle Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "\\vec{B}",
              "meaning": "Magnetic Flux Density",
              "unit": "T"
            },
            {
              "symbol": "\\vec{F}",
              "meaning": "Total Lorentz Force",
              "unit": "N"
            }
          ]
        },
        {
          "label": "Cyclotron Radius",
          "formula": "r = \\frac{m v}{q B} = \\frac{p}{q B}",
          "description": "Orbital radius of charged particle undergoing circular motion perpendicular to magnetic field B.",
          "variables": [
            {
              "symbol": "m",
              "meaning": "Particle Mass",
              "unit": "kg"
            },
            {
              "symbol": "v",
              "meaning": "Perpendicular Speed",
              "unit": "m/s"
            },
            {
              "symbol": "q",
              "meaning": "Charge Magnitude",
              "unit": "C"
            },
            {
              "symbol": "B",
              "meaning": "Magnetic Field",
              "unit": "T"
            },
            {
              "symbol": "r",
              "meaning": "Gyroradius",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-04-01",
          "title": "Magnetic Force on Moving Charges & Lorentz Force Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Magnetic Force on Moving Charges & Lorentz Force.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-04-01",
          "title": "Magnetic Force on Moving Charges & Lorentz Force",
          "summary": "Lorentz force F = q(E + v x B), motion of charge in uniform magnetic field, helical path, pitch of helix, and cyclotron frequency."
        }
      ]
    },
    {
      "id": "top-phy-12-04-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-04-T02",
      "title": "Biot-Savart Law & Field of a Circular Current Loop",
      "description": "Biot-Savart law dB = (mu0/4pi)*(I dl x r)/r^3, magnetic field at centre and on axis of a circular current-carrying loop.",
      "sequenceOrder": 2,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Biot-Savart law provides the fundamental differential equation relating an infinitesimal current element I dl to the magnetic field dB it generates at a field point.",
        "sections": [
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
            "examTips": [
              "Ratio of field at centre to field at axial distance x = R is (1 + 1)^(3/2) = 2^(3/2) = 2*sqrt(2)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing electric dipole field (1/r^3) with straight wire magnetic field (1/r). Circular loops produce 1/r^3 dipole fields at large distances."
        ]
      },
      "formulas": [
        {
          "label": "Biot-Savart Differential Law",
          "formula": "d\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{I (d\\vec{l} \\times \\hat{r})}{r^2}",
          "description": "Magnetic field element produced by current element I dl at position vector r.",
          "variables": [
            {
              "symbol": "\\mu_0",
              "meaning": "Permeability of Free Space",
              "unit": "T m/A"
            },
            {
              "symbol": "I",
              "meaning": "Electric Current",
              "unit": "A"
            },
            {
              "symbol": "d\\vec{l}",
              "meaning": "Length Element Vector",
              "unit": "m"
            },
            {
              "symbol": "r",
              "meaning": "Separation Distance",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Field on Axis of Circular Loop",
          "formula": "B = \\frac{\\mu_0 N I R^2}{2 (R^2 + x^2)^{3/2}}",
          "description": "Magnetic field at axial distance x from centre of N-turn loop of radius R.",
          "variables": [
            {
              "symbol": "N",
              "meaning": "Number of Turns",
              "unit": "-"
            },
            {
              "symbol": "I",
              "meaning": "Current",
              "unit": "A"
            },
            {
              "symbol": "R",
              "meaning": "Loop Radius",
              "unit": "m"
            },
            {
              "symbol": "x",
              "meaning": "Axial Distance from Centre",
              "unit": "m"
            },
            {
              "symbol": "B",
              "meaning": "Magnetic Field",
              "unit": "T"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-04-02",
          "title": "Biot-Savart Law & Field of a Circular Current Loop Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Biot-Savart Law & Field of a Circular Current Loop.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-04-02",
          "title": "Biot-Savart Law & Field of a Circular Current Loop",
          "summary": "Biot-Savart law dB = (mu0/4pi)*(I dl x r)/r^3, magnetic field at centre and on axis of a circular current-carrying loop."
        }
      ]
    },
    {
      "id": "top-phy-12-04-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-04-T03",
      "title": "Ampere’s Circuital Law, Solenoids & Toroids",
      "description": "Ampere’s law oint(B . dl) = mu0 * I_encl, magnetic field of infinite straight wire, long solenoid B = mu0*n*I, and toroidal solenoid.",
      "sequenceOrder": 3,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Ampere’s Circuital Law states that the line integral of magnetic field B around any closed Amperian loop equals mu_0 times the total enclosed net current: oint(B . dl) = mu_0 * I_encl.",
        "sections": [
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
            "examTips": [
              "Notice that n is turns PER UNIT LENGTH (N/L), not total turns N. Always check units of n."
            ]
          }
        ],
        "commonMisconceptions": [
          "Plugging total turns N into B = mu0*n*I instead of turns per unit length n = N/L."
        ]
      },
      "formulas": [
        {
          "label": "Ampere’s Circuital Law",
          "formula": "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{encl}}",
          "description": "Line integral of magnetic field around closed loop equals mu_0 times enclosed current.",
          "variables": [
            {
              "symbol": "I_{\\text{encl}}",
              "meaning": "Net Current Threading Loop",
              "unit": "A"
            },
            {
              "symbol": "\\mu_0",
              "meaning": "Permeability of Free Space",
              "unit": "T m/A"
            },
            {
              "symbol": "\\vec{B}",
              "meaning": "Magnetic Field Vector",
              "unit": "T"
            }
          ]
        },
        {
          "label": "Magnetic Field Inside Long Solenoid",
          "formula": "B = \\mu_0 n I = \\mu_0 \\left(\\frac{N}{L}\\right) I",
          "description": "Uniform axial magnetic field inside core of long solenoid.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Turns per Unit Length (N/L)",
              "unit": "m^-1"
            },
            {
              "symbol": "I",
              "meaning": "Current",
              "unit": "A"
            },
            {
              "symbol": "B",
              "meaning": "Core Magnetic Field",
              "unit": "T"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-04-03",
          "title": "Ampere’s Circuital Law, Solenoids & Toroids Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Ampere’s Circuital Law, Solenoids & Toroids.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-04-03",
          "title": "Ampere’s Circuital Law, Solenoids & Toroids",
          "summary": "Ampere’s law oint(B . dl) = mu0 * I_encl, magnetic field of infinite straight wire, long solenoid B = mu0*n*I, and toroidal solenoid."
        }
      ]
    },
    {
      "id": "top-phy-12-04-04",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-04-T04",
      "title": "Force Between Parallel Conductors & Definition of the Ampere",
      "description": "Parallel currents attract, antiparallel currents repel, force per unit length dF/dL = (mu0/2pi)*(I1*I2/d), SI definition of Ampere.",
      "sequenceOrder": 4,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Two parallel conductors carrying electric currents exert mutual magnetic Lorentz forces on each other through the magnetic field each creates at the location of the other.",
        "sections": [
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
            "examTips": [
              "Remember: unlike charges attract, but LIKE CURRENTS attract! Students frequently reverse this."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming parallel currents repel because like charges repel. Magnetic force causes like parallel currents to ATTRACT."
        ]
      },
      "formulas": [
        {
          "label": "Force Between Parallel Conductors",
          "formula": "\\frac{F}{L} = \\frac{\\mu_0}{2\\pi} \\frac{I_1 I_2}{d}",
          "description": "Mutual magnetic force per unit length between parallel currents separated by distance d.",
          "variables": [
            {
              "symbol": "I_1, I_2",
              "meaning": "Currents in Conductors",
              "unit": "A"
            },
            {
              "symbol": "d",
              "meaning": "Perpendicular Separation Distance",
              "unit": "m"
            },
            {
              "symbol": "F/L",
              "meaning": "Force per Unit Length",
              "unit": "N/m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-04-04",
          "title": "Force Between Parallel Conductors & Definition of the Ampere Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Force Between Parallel Conductors & Definition of the Ampere.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-04-04",
          "title": "Force Between Parallel Conductors & Definition of the Ampere",
          "summary": "Parallel currents attract, antiparallel currents repel, force per unit length dF/dL = (mu0/2pi)*(I1*I2/d), SI definition of Ampere."
        }
      ]
    },
    {
      "id": "top-phy-12-04-05",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "PHY-12-04-T05",
      "title": "Torque on Current Loop & Moving Coil Galvanometer",
      "description": "Magnetic dipole moment M = NIA, torque tau = M x B, principle of moving coil galvanometer, radial magnetic field, sensitivity.",
      "sequenceOrder": 5,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A planar current loop placed in an external magnetic field experiences a torque tau = M x B aligning its magnetic dipole moment M with field B.",
        "sections": [
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
            "examTips": [
              "Increasing current sensitivity by doubling N also doubles coil resistance R, leaving voltage sensitivity UNCHANGED."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming increasing turns N always increases voltage sensitivity. Doubling N doubles resistance R, keeping S_v = S_i / R constant."
        ]
      },
      "formulas": [
        {
          "label": "Torque on Current Loop",
          "formula": "\\vec{\\tau} = \\vec{M} \\times \\vec{B} \\implies \\tau = N I A B \\sin\\theta",
          "description": "Deflecting torque experienced by coil of N turns and area A in magnetic field B.",
          "variables": [
            {
              "symbol": "N",
              "meaning": "Number of Turns",
              "unit": "-"
            },
            {
              "symbol": "I",
              "meaning": "Coil Current",
              "unit": "A"
            },
            {
              "symbol": "A",
              "meaning": "Loop Area",
              "unit": "m^2"
            },
            {
              "symbol": "B",
              "meaning": "Magnetic Flux Density",
              "unit": "T"
            },
            {
              "symbol": "\\tau",
              "meaning": "Torque",
              "unit": "N m"
            }
          ]
        },
        {
          "label": "Ammeter Shunt Resistance",
          "formula": "S = \\frac{I_g G}{I - I_g}",
          "description": "Parallel shunt resistance required to convert galvanometer of resistance G and full-scale current I_g into ammeter of range I.",
          "variables": [
            {
              "symbol": "I_g",
              "meaning": "Galvanometer Full Scale Current",
              "unit": "A"
            },
            {
              "symbol": "G",
              "meaning": "Galvanometer Coil Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "I",
              "meaning": "Ammeter Measurement Range",
              "unit": "A"
            },
            {
              "symbol": "S",
              "meaning": "Required Shunt Resistance",
              "unit": "\\Omega"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-04-05",
          "title": "Torque on Current Loop & Moving Coil Galvanometer Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Torque on Current Loop & Moving Coil Galvanometer.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-04-05",
          "title": "Torque on Current Loop & Moving Coil Galvanometer",
          "summary": "Magnetic dipole moment M = NIA, torque tau = M x B, principle of moving coil galvanometer, radial magnetic field, sensitivity."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000005": [
    {
      "id": "top-phy-12-05-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-12-05-T01",
      "title": "Bar Magnet as an Equivalent Solenoid & Magnetic Dipole",
      "description": "Magnetic field lines, bar magnet field on axial line B = 2*mu0*M/(4pi*r^3), equatorial line B = mu0*M/(4pi*r^3), Gauss’s law for magnetism.",
      "sequenceOrder": 1,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A bar magnet possesses two unisolable poles (N and S) separated by magnetic length 2l, behaving as a magnetic dipole of moment M = m * (2l). Its external field is identical to that of a finite current-carrying solenoid.",
        "sections": [
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
            "examTips": [
              "oint(B . dA) = 0 is a direct consequence of magnetic field lines having no starting or ending points."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing magnetic monopoles exist classically. Cutting a magnet never isolates a single pole."
        ]
      },
      "formulas": [
        {
          "label": "Gauss’s Law for Magnetism",
          "formula": "\\oint \\vec{B} \\cdot d\\vec{A} = 0",
          "description": "Total outward magnetic flux through any closed Gaussian surface vanishes identically.",
          "variables": [
            {
              "symbol": "\\vec{B}",
              "meaning": "Magnetic Flux Density",
              "unit": "T"
            },
            {
              "symbol": "d\\vec{A}",
              "meaning": "Area Vector",
              "unit": "m^2"
            }
          ]
        },
        {
          "label": "Axial Magnetic Field of Bar Magnet",
          "formula": "B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi} \\frac{2 M}{r^3}",
          "description": "Magnetic field along the dipole axis at distance r >> l.",
          "variables": [
            {
              "symbol": "M",
              "meaning": "Magnetic Dipole Moment",
              "unit": "J/T or A m^2"
            },
            {
              "symbol": "r",
              "meaning": "Axial Distance",
              "unit": "m"
            },
            {
              "symbol": "B_{\\text{axial}}",
              "meaning": "Axial Field Strength",
              "unit": "T"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-05-01",
          "title": "Bar Magnet as an Equivalent Solenoid & Magnetic Dipole Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Bar Magnet as an Equivalent Solenoid & Magnetic Dipole.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-05-01",
          "title": "Bar Magnet as an Equivalent Solenoid & Magnetic Dipole",
          "summary": "Magnetic field lines, bar magnet field on axial line B = 2*mu0*M/(4pi*r^3), equatorial line B = mu0*M/(4pi*r^3), Gauss’s law for magnetism."
        }
      ]
    },
    {
      "id": "top-phy-12-05-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "PHY-12-05-T02",
      "title": "Magnetic Properties of Materials: Dia, Para & Ferromagnetism",
      "description": "Magnetisation M, magnetic intensity H, susceptibility chi = M/H, permeability mu = mu0*(1 + chi), Curie's law, and hysteresis curve.",
      "sequenceOrder": 2,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "All materials respond to external magnetic fields. Diamagnetic materials are repelled (chi < 0); paramagnetic materials are weakly attracted (chi > 0); ferromagnetic materials are strongly magnetized (chi >> 1000).",
        "sections": [
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
            "examTips": [
              "Superconductors are perfect diamagnets with chi = -1 and relative permeability mu_r = 0 (Meissner Effect)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming diamagnetism depends on temperature. Diamagnetism is a universal orbital property that is independent of temperature."
        ]
      },
      "formulas": [
        {
          "label": "Magnetic Susceptibility Relation",
          "formula": "\\chi = \\frac{M}{H}, \\quad \\mu_r = 1 + \\chi",
          "description": "Relationship between magnetic susceptibility chi, magnetization M, field H, and relative permeability mu_r.",
          "variables": [
            {
              "symbol": "M",
              "meaning": "Magnetisation",
              "unit": "A/m"
            },
            {
              "symbol": "H",
              "meaning": "Magnetic Intensity",
              "unit": "A/m"
            },
            {
              "symbol": "\\chi",
              "meaning": "Magnetic Susceptibility",
              "unit": "-"
            },
            {
              "symbol": "\\mu_r",
              "meaning": "Relative Permeability",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Curie’s Law for Paramagnetism",
          "formula": "\\chi = \\frac{C}{T}",
          "description": "Magnetic susceptibility of paramagnetic material inversely proportional to absolute temperature T.",
          "variables": [
            {
              "symbol": "C",
              "meaning": "Curie Constant",
              "unit": "K"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "\\chi",
              "meaning": "Susceptibility",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-05-02",
          "title": "Magnetic Properties of Materials: Dia, Para & Ferromagnetism Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Magnetic Properties of Materials: Dia, Para & Ferromagnetism.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-05-02",
          "title": "Magnetic Properties of Materials: Dia, Para & Ferromagnetism",
          "summary": "Magnetisation M, magnetic intensity H, susceptibility chi = M/H, permeability mu = mu0*(1 + chi), Curie's law, and hysteresis curve."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000006": [
    {
      "id": "top-phy-12-06-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-12-06-T01",
      "title": "Magnetic Flux & Faraday’s Laws of Induction",
      "description": "Magnetic flux Phi = B . A, Faraday's experiments, induced EMF e = -dPhi/dt, rate of change of magnetic flux.",
      "sequenceOrder": 1,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Electromagnetic induction is the phenomenon of generating an electric current and electromotive force across a conductor when the magnetic flux linked with it changes with time.",
        "sections": [
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
            "examTips": [
              "Total induced charge Delta q = Delta Phi / R is independent of the rate at which flux changes!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking induced charge depends on how fast the magnet is moved. Induced EMF depends on speed (dPhi/dt), but total induced CHARGE depends solely on net flux change Delta Phi."
        ]
      },
      "formulas": [
        {
          "label": "Faraday’s Law of Induced EMF",
          "formula": "e = -N \\frac{d\\Phi_B}{dt} = -N \\frac{d}{dt}(B A \\cos\\theta)",
          "description": "Induced electromotive force produced by time-varying magnetic flux.",
          "variables": [
            {
              "symbol": "N",
              "meaning": "Number of Turns",
              "unit": "-"
            },
            {
              "symbol": "\\Phi_B",
              "meaning": "Magnetic Flux",
              "unit": "Wb"
            },
            {
              "symbol": "t",
              "meaning": "Time",
              "unit": "s"
            },
            {
              "symbol": "e",
              "meaning": "Induced EMF",
              "unit": "V"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-06-01",
          "title": "Magnetic Flux & Faraday’s Laws of Induction Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Magnetic Flux & Faraday’s Laws of Induction.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-06-01",
          "title": "Magnetic Flux & Faraday’s Laws of Induction",
          "summary": "Magnetic flux Phi = B . A, Faraday's experiments, induced EMF e = -dPhi/dt, rate of change of magnetic flux."
        }
      ]
    },
    {
      "id": "top-phy-12-06-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-12-06-T02",
      "title": "Lenz’s Law & Conservation of Energy",
      "description": "Lenz’s law direction rule, negative sign in Faraday's law, mechanical work converted to electrical energy, eddy currents.",
      "sequenceOrder": 2,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Lenz’s law states that the polarity of induced EMF is always such that it tends to produce a current which opposes the very change in magnetic flux that causes it.",
        "sections": [
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
            "examTips": [
              "Right-Hand Rule for Lenz's law: Thumb opposes the change in external flux; curled fingers indicate induced current flow."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing Lenz's law violates energy conservation. Lenz's law is the exact physical manifestation of energy conservation in electromagnetic systems."
        ]
      },
      "formulas": [
        {
          "label": "Induced Current and Charge",
          "formula": "I = \\frac{|e|}{R} = \\frac{N}{R} \\frac{d\\Phi_B}{dt}, \\quad \\Delta q = \\frac{N \\Delta\\Phi_B}{R}",
          "description": "Induced current and total charge transferred in closed circuit of resistance R.",
          "variables": [
            {
              "symbol": "R",
              "meaning": "Circuit Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "\\Delta\\Phi_B",
              "meaning": "Net Magnetic Flux Change",
              "unit": "Wb"
            },
            {
              "symbol": "\\Delta q",
              "meaning": "Total Induced Charge",
              "unit": "C"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-06-02",
          "title": "Lenz’s Law & Conservation of Energy Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Lenz’s Law & Conservation of Energy.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-06-02",
          "title": "Lenz’s Law & Conservation of Energy",
          "summary": "Lenz’s law direction rule, negative sign in Faraday's law, mechanical work converted to electrical energy, eddy currents."
        }
      ]
    },
    {
      "id": "top-phy-12-06-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "PHY-12-06-T03",
      "title": "Motional EMF, Inductance & AC Generator",
      "description": "Motional EMF e = B*l*v, self-inductance L, mutual inductance M, magnetic energy U = 0.5*L*I^2, and AC alternator working.",
      "sequenceOrder": 3,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A conducting rod of length l moving with velocity v perpendicular to magnetic field B generates a motional EMF: e = B*l*v. Inductance represents electrical inertia opposing current changes.",
        "sections": [
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
            "examTips": [
              "Peak EMF in an AC generator is e0 = N*B*A*omega. Peak power is P_max = e0^2 / R."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming self-inductance L depends on current I. L is a purely geometric constant depending on turns, dimensions, and core permeability."
        ]
      },
      "formulas": [
        {
          "label": "Motional EMF",
          "formula": "e = B l v \\sin\\theta",
          "description": "EMF induced across ends of conductor of length l sweeping at velocity v across magnetic field B.",
          "variables": [
            {
              "symbol": "B",
              "meaning": "Magnetic Field",
              "unit": "T"
            },
            {
              "symbol": "l",
              "meaning": "Conductor Length",
              "unit": "m"
            },
            {
              "symbol": "v",
              "meaning": "Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "e",
              "meaning": "Motional EMF",
              "unit": "V"
            }
          ]
        },
        {
          "label": "AC Generator Peak EMF",
          "formula": "e(t) = N B A \\omega \\sin(\\omega t) = e_0 \\sin(\\omega t)",
          "description": "Sinusoidal alternating voltage generated by rotating armature coil in uniform magnetic field.",
          "variables": [
            {
              "symbol": "N",
              "meaning": "Number of Turns",
              "unit": "-"
            },
            {
              "symbol": "A",
              "meaning": "Coil Area",
              "unit": "m^2"
            },
            {
              "symbol": "\\omega",
              "meaning": "Angular Speed",
              "unit": "rad/s"
            },
            {
              "symbol": "e_0",
              "meaning": "Peak Output Voltage",
              "unit": "V"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-06-03",
          "title": "Motional EMF, Inductance & AC Generator Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Motional EMF, Inductance & AC Generator.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-06-03",
          "title": "Motional EMF, Inductance & AC Generator",
          "summary": "Motional EMF e = B*l*v, self-inductance L, mutual inductance M, magnetic energy U = 0.5*L*I^2, and AC alternator working."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000007": [
    {
      "id": "top-phy-12-07-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-12-07-T01",
      "title": "AC Voltage in Pure Resistor, Inductor & Capacitor",
      "description": "Peak and RMS values V_rms = V0/sqrt(2), inductive reactance X_L = omega*L (current lags by pi/2), capacitive reactance X_C = 1/(omega*C) (current leads by pi/2).",
      "sequenceOrder": 1,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Alternating current reverses direction periodically. In a resistor, V and I are in phase. In an inductor, current lags voltage by 90 degrees. In a capacitor, current leads voltage by 90 degrees.",
        "sections": [
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
            "examTips": [
              "Mains household supply of 220V AC is the RMS value. The peak voltage is V0 = 220 * sqrt(2) approx 311 V!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing 220V AC and 220V DC have identical shock hazard. 220V AC peaks at 311V, making it substantially more dangerous than 220V DC."
        ]
      },
      "formulas": [
        {
          "label": "RMS Current and Voltage",
          "formula": "I_{\\text{rms}} = \\frac{I_0}{\\sqrt{2}} \\approx 0.707 I_0, \\quad V_{\\text{rms}} = \\frac{V_0}{\\sqrt{2}} \\approx 0.707 V_0",
          "description": "Root mean square effective value of sinusoidal alternating waveform.",
          "variables": [
            {
              "symbol": "I_0",
              "meaning": "Peak Current",
              "unit": "A"
            },
            {
              "symbol": "I_{\\text{rms}}",
              "meaning": "Root Mean Square Current",
              "unit": "A"
            }
          ]
        },
        {
          "label": "Inductive and Capacitive Reactance",
          "formula": "X_L = \\omega L = 2\\pi f L, \\quad X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi f C}",
          "description": "Oppositions offered by pure inductance and pure capacitance to alternating current.",
          "variables": [
            {
              "symbol": "L",
              "meaning": "Inductance",
              "unit": "H"
            },
            {
              "symbol": "C",
              "meaning": "Capacitance",
              "unit": "F"
            },
            {
              "symbol": "f",
              "meaning": "AC Frequency",
              "unit": "Hz"
            },
            {
              "symbol": "X_L, X_C",
              "meaning": "Reactances",
              "unit": "\\Omega"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-07-01",
          "title": "AC Voltage in Pure Resistor, Inductor & Capacitor Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for AC Voltage in Pure Resistor, Inductor & Capacitor.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-07-01",
          "title": "AC Voltage in Pure Resistor, Inductor & Capacitor",
          "summary": "Peak and RMS values V_rms = V0/sqrt(2), inductive reactance X_L = omega*L (current lags by pi/2), capacitive reactance X_C = 1/(omega*C) (current leads by pi/2)."
        }
      ]
    },
    {
      "id": "top-phy-12-07-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-12-07-T02",
      "title": "Series LCR Circuit, Impedance & Electrical Resonance",
      "description": "Impedance Z = sqrt(R^2 + (X_L - X_C)^2), phase angle tan phi = (X_L - X_C)/R, resonant frequency omega_0 = 1/sqrt(LC), Quality factor Q.",
      "sequenceOrder": 2,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A series LCR circuit combines resistance, inductive reactance, and capacitive reactance. At resonance, inductive and capacitive reactances cancel, minimizing impedance to Z = R.",
        "sections": [
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
            "examTips": [
              "Radio tuning dials adjust a variable capacitor C to match the series LCR resonant frequency f0 to the incoming station frequency."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming voltage across inductor or capacitor cannot exceed source voltage. In high-Q resonant circuits, V_L and V_C can be many times larger than input source voltage (Q-multiplication)."
        ]
      },
      "formulas": [
        {
          "label": "Series LCR Impedance",
          "formula": "Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{R^2 + \\left(\\omega L - \\frac{1}{\\omega C}\\right)^2}",
          "description": "Total opposition to alternating current in series LCR circuit.",
          "variables": [
            {
              "symbol": "R",
              "meaning": "Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "X_L",
              "meaning": "Inductive Reactance",
              "unit": "\\Omega"
            },
            {
              "symbol": "X_C",
              "meaning": "Capacitive Reactance",
              "unit": "\\Omega"
            },
            {
              "symbol": "Z",
              "meaning": "Total Circuit Impedance",
              "unit": "\\Omega"
            }
          ]
        },
        {
          "label": "Resonant Frequency",
          "formula": "f_0 = \\frac{1}{2\\pi \\sqrt{L C}}, \\quad \\omega_0 = \\frac{1}{\\sqrt{L C}}",
          "description": "Natural electrical resonance frequency where inductive and capacitive reactances cancel.",
          "variables": [
            {
              "symbol": "L",
              "meaning": "Circuit Inductance",
              "unit": "H"
            },
            {
              "symbol": "C",
              "meaning": "Circuit Capacitance",
              "unit": "F"
            },
            {
              "symbol": "f_0",
              "meaning": "Resonant Frequency",
              "unit": "Hz"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-07-02",
          "title": "Series LCR Circuit, Impedance & Electrical Resonance Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Series LCR Circuit, Impedance & Electrical Resonance.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-07-02",
          "title": "Series LCR Circuit, Impedance & Electrical Resonance",
          "summary": "Impedance Z = sqrt(R^2 + (X_L - X_C)^2), phase angle tan phi = (X_L - X_C)/R, resonant frequency omega_0 = 1/sqrt(LC), Quality factor Q."
        }
      ]
    },
    {
      "id": "top-phy-12-07-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "PHY-12-07-T03",
      "title": "Power in AC Circuits, Wattless Current & Transformers",
      "description": "Real power P_avg = V_rms*I_rms*cos phi, power factor, wattless current, transformer principle, turns ratio, step-up/step-down efficiency.",
      "sequenceOrder": 3,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Real power dissipated in an AC circuit depends on the power factor cos phi. Transformers transfer AC electrical energy between voltage levels using mutual induction.",
        "sections": [
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
            "examTips": [
              "To minimize transmission power loss over long distances, electricity is stepped up to very high voltages (lowering current and I^2*R losses)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Connecting a transformer to a DC battery: since DC produces constant flux (dPhi/dt = 0), induced secondary voltage is zero, and primary coil may burn out."
        ]
      },
      "formulas": [
        {
          "label": "AC True Average Power",
          "formula": "P_{\\text{avg}} = V_{\\text{rms}} I_{\\text{rms}} \\cos\\phi",
          "description": "Actual real power consumed in AC circuit with power factor cos phi = R / Z.",
          "variables": [
            {
              "symbol": "V_{\\text{rms}}",
              "meaning": "RMS Voltage",
              "unit": "V"
            },
            {
              "symbol": "I_{\\text{rms}}",
              "meaning": "RMS Current",
              "unit": "A"
            },
            {
              "symbol": "\\cos\\phi",
              "meaning": "Power Factor (R/Z)",
              "unit": "-"
            },
            {
              "symbol": "P_{\\text{avg}}",
              "meaning": "True Power Consumed",
              "unit": "W"
            }
          ]
        },
        {
          "label": "Transformer Transformation Ratio",
          "formula": "\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s} = k",
          "description": "Ideal transformer voltage, turns, and current scaling ratio.",
          "variables": [
            {
              "symbol": "N_p, N_s",
              "meaning": "Primary & Secondary Turns",
              "unit": "-"
            },
            {
              "symbol": "V_p, V_s",
              "meaning": "Primary & Secondary Voltages",
              "unit": "V"
            },
            {
              "symbol": "I_p, I_s",
              "meaning": "Primary & Secondary Currents",
              "unit": "A"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-07-03",
          "title": "Power in AC Circuits, Wattless Current & Transformers Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Power in AC Circuits, Wattless Current & Transformers.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-07-03",
          "title": "Power in AC Circuits, Wattless Current & Transformers",
          "summary": "Real power P_avg = V_rms*I_rms*cos phi, power factor, wattless current, transformer principle, turns ratio, step-up/step-down efficiency."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000008": [
    {
      "id": "top-phy-12-08-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "PHY-12-08-T01",
      "title": "Displacement Current & Maxwell’s Equations",
      "description": "Inconsistency of Ampere’s law during capacitor charging, displacement current I_d = epsilon_0*(dPhi_E/dt), Maxwell-Ampere law.",
      "sequenceOrder": 1,
      "weightagePercent": 1.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "James Clerk Maxwell resolved the mathematical inconsistency in Ampere's circuital law by introducing displacement current, proving that changing electric fields create magnetic fields.",
        "sections": [
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
            "examTips": [
              "Displacement current produces the same magnetic field as an equal conduction current."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing displacement current involves physical flow of electrons. It arises entirely from the time variation of electric flux."
        ]
      },
      "formulas": [
        {
          "label": "Maxwell-Ampere Law",
          "formula": "\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_c + \\mu_0 \\varepsilon_0 \\frac{d\\Phi_E}{dt}",
          "description": "Circulation of magnetic field driven by conduction current and time-varying electric flux.",
          "variables": [
            {
              "symbol": "I_c",
              "meaning": "Conduction Current",
              "unit": "A"
            },
            {
              "symbol": "\\Phi_E",
              "meaning": "Electric Flux",
              "unit": "V m"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Permittivity of Free Space",
              "unit": "C^2/(N m^2)"
            },
            {
              "symbol": "\\mu_0",
              "meaning": "Permeability of Free Space",
              "unit": "T m/A"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-08-01",
          "title": "Displacement Current & Maxwell’s Equations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Displacement Current & Maxwell’s Equations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-08-01",
          "title": "Displacement Current & Maxwell’s Equations",
          "summary": "Inconsistency of Ampere’s law during capacitor charging, displacement current I_d = epsilon_0*(dPhi_E/dt), Maxwell-Ampere law."
        }
      ]
    },
    {
      "id": "top-phy-12-08-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "PHY-12-08-T02",
      "title": "Electromagnetic Waves & The Electromagnetic Spectrum",
      "description": "Transverse nature of EM waves, speed of light c = 1/sqrt(mu0*epsilon0), energy density, and electromagnetic spectrum bands.",
      "sequenceOrder": 2,
      "weightagePercent": 1.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Electromagnetic waves are self-sustaining oscillating transverse electric and magnetic fields propagating through space at speed c = 3.00 x 10^8 m/s.",
        "sections": [
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
            "examTips": [
              "Microwaves resonate with water molecular rotation (used in microwave ovens and radar). Gamma rays have the highest energy and penetrating power."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking electric fields carry more energy than magnetic fields in an EM wave. Both fields carry EQUAL average energy densities: u_E = u_B."
        ]
      },
      "formulas": [
        {
          "label": "Speed of Light from Fundamental Constants",
          "formula": "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0} \\approx 3.00 \\times 10^8 \\text{ m/s}",
          "description": "Speed of electromagnetic waves in vacuum determined by electric and magnetic constants.",
          "variables": [
            {
              "symbol": "\\mu_0",
              "meaning": "Magnetic Permeability",
              "unit": "T m/A"
            },
            {
              "symbol": "\\varepsilon_0",
              "meaning": "Electric Permittivity",
              "unit": "C^2/(N m^2)"
            },
            {
              "symbol": "E_0",
              "meaning": "Peak Electric Field",
              "unit": "V/m"
            },
            {
              "symbol": "B_0",
              "meaning": "Peak Magnetic Field",
              "unit": "T"
            },
            {
              "symbol": "c",
              "meaning": "Speed of Light",
              "unit": "m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-08-02",
          "title": "Electromagnetic Waves & The Electromagnetic Spectrum Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Electromagnetic Waves & The Electromagnetic Spectrum.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-08-02",
          "title": "Electromagnetic Waves & The Electromagnetic Spectrum",
          "summary": "Transverse nature of EM waves, speed of light c = 1/sqrt(mu0*epsilon0), energy density, and electromagnetic spectrum bands."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000009": [
    {
      "id": "top-phy-12-09-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-12-09-T01",
      "title": "Reflection at Spherical Mirrors & Mirror Formula",
      "description": "Concave and convex mirrors, Cartesian sign convention, focal length f = R/2, mirror formula 1/v + 1/u = 1/f, linear magnification m = -v/u.",
      "sequenceOrder": 1,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Geometrical optics treats light propagation as rectilinear rays. Curved spherical mirrors reflect light to form real or virtual images according to the mirror equation.",
        "sections": [
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
            "examTips": [
              "Always substitute u, v, f with their proper Cartesian signs when computing numerical values."
            ]
          }
        ],
        "commonMisconceptions": [
          "Forgetting the negative sign in mirror magnification: m = -v/u for mirrors, whereas m = +v/u for lenses."
        ]
      },
      "formulas": [
        {
          "label": "Mirror Formula",
          "formula": "\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}",
          "description": "Relation between object distance u, image distance v, and focal length f of spherical mirror.",
          "variables": [
            {
              "symbol": "u",
              "meaning": "Object Distance",
              "unit": "m"
            },
            {
              "symbol": "v",
              "meaning": "Image Distance",
              "unit": "m"
            },
            {
              "symbol": "f",
              "meaning": "Focal Length (R/2)",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Mirror Linear Magnification",
          "formula": "m = \\frac{h_i}{h_o} = -\\frac{v}{u} = \\frac{f}{f - u}",
          "description": "Ratio of image height to object height for spherical mirror.",
          "variables": [
            {
              "symbol": "h_i, h_o",
              "meaning": "Image & Object Heights",
              "unit": "m"
            },
            {
              "symbol": "u, v",
              "meaning": "Distances",
              "unit": "m"
            },
            {
              "symbol": "m",
              "meaning": "Linear Magnification",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-09-01",
          "title": "Reflection at Spherical Mirrors & Mirror Formula Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Reflection at Spherical Mirrors & Mirror Formula.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-09-01",
          "title": "Reflection at Spherical Mirrors & Mirror Formula",
          "summary": "Concave and convex mirrors, Cartesian sign convention, focal length f = R/2, mirror formula 1/v + 1/u = 1/f, linear magnification m = -v/u."
        }
      ]
    },
    {
      "id": "top-phy-12-09-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-12-09-T02",
      "title": "Refraction of Light, Total Internal Reflection & Optical Fibres",
      "description": "Snell’s law n1*sin(i) = n2*sin(r), critical angle sin(i_c) = 1/n, total internal reflection, mirage, optical fibres and endoscopy.",
      "sequenceOrder": 2,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "When light passes obliquely between optical media of differing refractive indices, its speed and wavelength change, bending the ray according to Snell’s Law.",
        "sections": [
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
            "examTips": [
              "In TIR, 100% of light energy is reflected with ZERO absorption loss, far superior to silvered mirrors."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing light frequency changes during refraction. Frequency depends solely on the source and remains CONSTANT; only speed and wavelength change."
        ]
      },
      "formulas": [
        {
          "label": "Snell’s Law of Refraction",
          "formula": "n_1 \\sin i = n_2 \\sin r \\implies \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1} = \\frac{v_1}{v_2} = \\frac{\\lambda_1}{\\lambda_2}",
          "description": "Fundamental law of optical refraction across planar interfaces.",
          "variables": [
            {
              "symbol": "i",
              "meaning": "Angle of Incidence",
              "unit": "rad"
            },
            {
              "symbol": "r",
              "meaning": "Angle of Refraction",
              "unit": "rad"
            },
            {
              "symbol": "n_1, n_2",
              "meaning": "Refractive Indices",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Critical Angle for Total Internal Reflection",
          "formula": "\\sin i_c = \\frac{1}{n}",
          "description": "Threshold incidence angle in optically denser medium relative to air/vacuum.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Refractive Index of Denser Medium",
              "unit": "-"
            },
            {
              "symbol": "i_c",
              "meaning": "Critical Angle",
              "unit": "rad"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-09-02",
          "title": "Refraction of Light, Total Internal Reflection & Optical Fibres Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Refraction of Light, Total Internal Reflection & Optical Fibres.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-09-02",
          "title": "Refraction of Light, Total Internal Reflection & Optical Fibres",
          "summary": "Snell’s law n1*sin(i) = n2*sin(r), critical angle sin(i_c) = 1/n, total internal reflection, mirage, optical fibres and endoscopy."
        }
      ]
    },
    {
      "id": "top-phy-12-09-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-12-09-T03",
      "title": "Refraction at Spherical Surfaces & Lens Maker’s Formula",
      "description": "Single spherical surface n2/v - n1/u = (n2-n1)/R, Lens Maker’s equation 1/f = (n-1)(1/R1 - 1/R2), thin lens formula 1/v - 1/u = 1/f, lens combinations.",
      "sequenceOrder": 3,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Thin lenses form images through two successive refractive spherical surfaces. The Lens Maker's Formula relates focal length directly to surface radii of curvature and material refractive index.",
        "sections": [
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
            "examTips": [
              "Cutting an equiconvex lens vertically in two halves doubles the focal length of each half (f_half = 2*f), while power halves."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming focal length is an invariant property of the lens. Focal length depends on the refractive index of the surrounding medium!"
        ]
      },
      "formulas": [
        {
          "label": "Lens Maker’s Formula",
          "formula": "\\frac{1}{f} = \\left(\\frac{n_2}{n_1} - 1\\right) \\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)",
          "description": "Focal length of thin lens of index n2 immersed in medium of index n1 with radii R1 and R2.",
          "variables": [
            {
              "symbol": "n_2",
              "meaning": "Lens Material Index",
              "unit": "-"
            },
            {
              "symbol": "n_1",
              "meaning": "Surrounding Medium Index",
              "unit": "-"
            },
            {
              "symbol": "R_1, R_2",
              "meaning": "Surface Curvature Radii",
              "unit": "m"
            },
            {
              "symbol": "f",
              "meaning": "Focal Length",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Thin Lens Equation",
          "formula": "\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}",
          "description": "Relation between object distance u, image distance v, and focal length f of thin lens.",
          "variables": [
            {
              "symbol": "u",
              "meaning": "Object Distance",
              "unit": "m"
            },
            {
              "symbol": "v",
              "meaning": "Image Distance",
              "unit": "m"
            },
            {
              "symbol": "f",
              "meaning": "Focal Length",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-09-03",
          "title": "Refraction at Spherical Surfaces & Lens Maker’s Formula Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Refraction at Spherical Surfaces & Lens Maker’s Formula.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-09-03",
          "title": "Refraction at Spherical Surfaces & Lens Maker’s Formula",
          "summary": "Single spherical surface n2/v - n1/u = (n2-n1)/R, Lens Maker’s equation 1/f = (n-1)(1/R1 - 1/R2), thin lens formula 1/v - 1/u = 1/f, lens combinations."
        }
      ]
    },
    {
      "id": "top-phy-12-09-04",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "PHY-12-09-T04",
      "title": "Refraction Through a Prism & Optical Instruments",
      "description": "Prism formula n = sin((A+Dm)/2)/sin(A/2), compound microscope magnification m = (L/f0)*(D/fe), and astronomical telescope m = f0/fe.",
      "sequenceOrder": 4,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A triangular prism deviates and disperses polychromatic light. Compound microscopes provide high magnification for minute near objects; astronomical telescopes magnify distant celestial objects.",
        "sections": [
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
            "examTips": [
              "Reflecting telescopes (Cassegrain) use paraboloid mirrors instead of lenses, completely eliminating chromatic aberration."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing telescope and microscope focal length designs: telescopes require large f_o; microscopes require very small f_o."
        ]
      },
      "formulas": [
        {
          "label": "Prism Refractive Index Formula",
          "formula": "n = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}",
          "description": "Refractive index of prism of apex angle A exhibiting minimum deviation angle D_m.",
          "variables": [
            {
              "symbol": "A",
              "meaning": "Prism Apex Angle",
              "unit": "rad"
            },
            {
              "symbol": "D_m",
              "meaning": "Minimum Angle of Deviation",
              "unit": "rad"
            },
            {
              "symbol": "n",
              "meaning": "Refractive Index",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Astronomical Telescope Magnifying Power",
          "formula": "m = \\frac{f_o}{f_e}, \\quad L = f_o + f_e",
          "description": "Angular magnification and barrel length in normal adjustment (image at infinity).",
          "variables": [
            {
              "symbol": "f_o",
              "meaning": "Objective Focal Length",
              "unit": "m"
            },
            {
              "symbol": "f_e",
              "meaning": "Eyepiece Focal Length",
              "unit": "m"
            },
            {
              "symbol": "m",
              "meaning": "Angular Magnifying Power",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-09-04",
          "title": "Refraction Through a Prism & Optical Instruments Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Refraction Through a Prism & Optical Instruments.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-09-04",
          "title": "Refraction Through a Prism & Optical Instruments",
          "summary": "Prism formula n = sin((A+Dm)/2)/sin(A/2), compound microscope magnification m = (L/f0)*(D/fe), and astronomical telescope m = f0/fe."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000010": [
    {
      "id": "top-phy-12-10-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "PHY-12-10-T01",
      "title": "Huygens’ Principle & Wavefront Construction",
      "description": "Primary and secondary wavefronts, Huygens' construction, proof of laws of reflection and refraction using wave theory.",
      "sequenceOrder": 1,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Huygens’ Principle posits that every point on a wavefront acts as a secondary source of spherical wavelets, whose forward envelope forms the new wavefront at a later instant.",
        "sections": [
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
            "examTips": [
              "Frequency remains invariant when a wave refracts into another medium: f is constant, while v and lambda scale by 1/n."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming light speeds up in denser media (as Newton corpuscular theory wrongly proposed). Wave theory proved light SLOWS DOWN in denser media."
        ]
      },
      "formulas": [
        {
          "label": "Refractive Index and Wave Speed",
          "formula": "n = \\frac{c}{v} = \\frac{\\lambda_0}{\\lambda}",
          "description": "Refractive index as the ratio of vacuum light speed/wavelength to medium speed/wavelength.",
          "variables": [
            {
              "symbol": "c",
              "meaning": "Speed of Light in Vacuum",
              "unit": "m/s"
            },
            {
              "symbol": "v",
              "meaning": "Speed of Light in Medium",
              "unit": "m/s"
            },
            {
              "symbol": "\\lambda_0, \\lambda",
              "meaning": "Vacuum & Medium Wavelengths",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-10-01",
          "title": "Huygens’ Principle & Wavefront Construction Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Huygens’ Principle & Wavefront Construction.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-10-01",
          "title": "Huygens’ Principle & Wavefront Construction",
          "summary": "Primary and secondary wavefronts, Huygens' construction, proof of laws of reflection and refraction using wave theory."
        }
      ]
    },
    {
      "id": "top-phy-12-10-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "PHY-12-10-T02",
      "title": "Interference of Light & Young’s Double Slit Experiment (YDSE)",
      "description": "Coherent sources, path difference Delta x = d*sin theta = d*y/D, constructive and destructive interference, fringe width beta = lambda*D/d.",
      "sequenceOrder": 2,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Young's Double Slit Experiment confirmed the wave nature of light by demonstrating that light from two coherent slits superposes to produce alternating bright and dark interference fringes.",
        "sections": [
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
            "examTips": [
              "If one slit is covered with thin glass slab of thickness t and index n, the entire fringe pattern shifts by Delta y = (n - 1)*t * D / d without changing fringe width."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking independent light bulbs can produce interference. Two independent light bulbs have random phase variations (~10^-8 s) and can NEVER act as coherent sources."
        ]
      },
      "formulas": [
        {
          "label": "Interference Fringe Width",
          "formula": "\\beta = \\frac{\\lambda D}{d}",
          "description": "Uniform spatial spacing between adjacent bright or dark fringes on screen at distance D from slit spacing d.",
          "variables": [
            {
              "symbol": "\\lambda",
              "meaning": "Wavelength of Monochromatic Light",
              "unit": "m"
            },
            {
              "symbol": "D",
              "meaning": "Slit-to-Screen Distance",
              "unit": "m"
            },
            {
              "symbol": "d",
              "meaning": "Slit Separation",
              "unit": "m"
            },
            {
              "symbol": "\\beta",
              "meaning": "Fringe Width",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Resultant Intensity in Wave Interference",
          "formula": "I = I_1 + I_2 + 2 \\sqrt{I_1 I_2} \\cos\\phi = 4 I_0 \\cos^2\\left(\\frac{\\phi}{2}\\right)",
          "description": "Total optical intensity for coherent beams of phase difference phi.",
          "variables": [
            {
              "symbol": "I_0",
              "meaning": "Individual Slit Intensity",
              "unit": "W/m^2"
            },
            {
              "symbol": "\\phi",
              "meaning": "Phase Difference",
              "unit": "rad"
            },
            {
              "symbol": "I",
              "meaning": "Resultant Intensity",
              "unit": "W/m^2"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-12-10-02",
          "title": "Interference of Light & Young’s Double Slit Experiment (YDSE) Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Interference of Light & Young’s Double Slit Experiment (YDSE) with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "double_slit_interference"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-10-02",
          "title": "Interference of Light & Young’s Double Slit Experiment (YDSE)",
          "summary": "Coherent sources, path difference Delta x = d*sin theta = d*y/D, constructive and destructive interference, fringe width beta = lambda*D/d.",
          "simulationId": "double_slit_interference"
        }
      ]
    },
    {
      "id": "top-phy-12-10-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "PHY-12-10-T03",
      "title": "Diffraction of Light at a Single Slit & Resolving Power",
      "description": "Single slit Fraunhofer diffraction, central maximum width 2*lambda*D/a, secondary maxima and minima, comparison with interference.",
      "sequenceOrder": 3,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Diffraction is the bending of waves around the corners of an obstacle or aperture comparable in size to the wavelength. Single slit diffraction produces a wide, intense central maximum bordered by faint secondary fringes.",
        "sections": [
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
            "examTips": [
              "Central maximum in single slit diffraction is twice as wide as secondary fringes, and contains ~85% of total light energy."
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying a*sin theta = n*lambda as a maximum condition. In single slit diffraction, a*sin theta = n*lambda is the condition for MINIMA."
        ]
      },
      "formulas": [
        {
          "label": "Single Slit Diffraction Minima",
          "formula": "a \\sin\\theta = n \\lambda \\quad (n = 1, 2, 3, \\dots)",
          "description": "Angular positions of diffraction minima produced by aperture slit of width a.",
          "variables": [
            {
              "symbol": "a",
              "meaning": "Slit Width",
              "unit": "m"
            },
            {
              "symbol": "\\theta",
              "meaning": "Diffraction Angle",
              "unit": "rad"
            },
            {
              "symbol": "n",
              "meaning": "Order of Minimum",
              "unit": "-"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Wavelength",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Angular Width of Central Maximum",
          "formula": "2 \\theta_0 = \\frac{2 \\lambda}{a}, \\quad W_{\\text{central}} = \\frac{2 \\lambda D}{a}",
          "description": "Total angular and linear spatial spread of central diffraction peak.",
          "variables": [
            {
              "symbol": "a",
              "meaning": "Aperture Width",
              "unit": "m"
            },
            {
              "symbol": "D",
              "meaning": "Screen Distance",
              "unit": "m"
            },
            {
              "symbol": "W_{\\text{central}}",
              "meaning": "Linear Width on Screen",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-10-03",
          "title": "Diffraction of Light at a Single Slit & Resolving Power Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Diffraction of Light at a Single Slit & Resolving Power.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-10-03",
          "title": "Diffraction of Light at a Single Slit & Resolving Power",
          "summary": "Single slit Fraunhofer diffraction, central maximum width 2*lambda*D/a, secondary maxima and minima, comparison with interference."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000011": [
    {
      "id": "top-phy-12-11-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-12-11-T01",
      "title": "Photoelectric Effect & Lenard’s Experimental Observations",
      "description": "Threshold frequency nu0, work function Phi0, stopping potential V0, instantaneous emission, effect of intensity and frequency.",
      "sequenceOrder": 1,
      "weightagePercent": 1.7,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The photoelectric effect is the instantaneous emission of electrons from a metallic surface when exposed to electromagnetic radiation of frequency exceeding a threshold frequency nu_0.",
        "sections": [
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
            "examTips": [
              "Doubling intensity doubles photoelectric current, but leaves stopping potential V0 and maximum kinetic energy UNCHANGED."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing higher intensity light produces faster photoelectrons. Higher intensity increases the NUMBER of photoelectrons; only higher frequency increases their SPEED."
        ]
      },
      "formulas": [
        {
          "label": "Stopping Potential Relation",
          "formula": "K_{\\max} = \\frac{1}{2} m v_{\\max}^2 = e V_0",
          "description": "Maximum kinetic energy of emitted photoelectrons equated to stopping potential V0.",
          "variables": [
            {
              "symbol": "e",
              "meaning": "Electron Charge Quantum",
              "unit": "C"
            },
            {
              "symbol": "V_0",
              "meaning": "Stopping Potential",
              "unit": "V"
            },
            {
              "symbol": "K_{\\max}",
              "meaning": "Maximum Kinetic Energy",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-11-01",
          "title": "Photoelectric Effect & Lenard’s Experimental Observations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Photoelectric Effect & Lenard’s Experimental Observations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-11-01",
          "title": "Photoelectric Effect & Lenard’s Experimental Observations",
          "summary": "Threshold frequency nu0, work function Phi0, stopping potential V0, instantaneous emission, effect of intensity and frequency."
        }
      ]
    },
    {
      "id": "top-phy-12-11-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-12-11-T02",
      "title": "Einstein’s Photoelectric Equation & The Photon Concept",
      "description": "Energy quantum E = h*nu, Einstein's equation h*nu = Phi0 + K_max = h*nu0 + e*V0, Planck's constant determination.",
      "sequenceOrder": 2,
      "weightagePercent": 1.7,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Albert Einstein explained the photoelectric effect in 1905 by proposing that light propagates in discrete localized energy packets called photons: E = h*nu.",
        "sections": [
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
            "examTips": [
              "The slope of V0 versus nu graph is identical for ALL metals, equal to h / e."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming photons have rest mass. Photons have zero rest mass; their energy is purely relativistic kinetic energy E = h*nu."
        ]
      },
      "formulas": [
        {
          "label": "Einstein’s Photoelectric Equation",
          "formula": "h \\nu = \\Phi_0 + K_{\\max} = h \\nu_0 + e V_0",
          "description": "Conservation of energy in single-photon absorption by a conduction electron.",
          "variables": [
            {
              "symbol": "h",
              "meaning": "Planck’s Constant (6.626 x 10^-34)",
              "unit": "J s"
            },
            {
              "symbol": "\\nu",
              "meaning": "Incident Photon Frequency",
              "unit": "Hz"
            },
            {
              "symbol": "\\Phi_0",
              "meaning": "Work Function (h nu_0)",
              "unit": "J"
            },
            {
              "symbol": "K_{\\max}",
              "meaning": "Maximum Photoelectron Kinetic Energy",
              "unit": "J"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-11-02",
          "title": "Einstein’s Photoelectric Equation & The Photon Concept Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Einstein’s Photoelectric Equation & The Photon Concept.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-11-02",
          "title": "Einstein’s Photoelectric Equation & The Photon Concept",
          "summary": "Energy quantum E = h*nu, Einstein's equation h*nu = Phi0 + K_max = h*nu0 + e*V0, Planck's constant determination."
        }
      ]
    },
    {
      "id": "top-phy-12-11-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "PHY-12-11-T03",
      "title": "De Broglie’s Wave Nature of Matter & Davisson-Germer Experiment",
      "description": "De Broglie wavelength lambda = h/p = h/(mv), wavelength of electron accelerated by voltage V lambda = 1.227/sqrt(V) nm, Davisson-Germer diffraction.",
      "sequenceOrder": 3,
      "weightagePercent": 1.7,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Louis de Broglie proposed that matter exhibits wave-particle duality: every moving particle is accompanied by a matter wave of wavelength lambda = h / p.",
        "sections": [
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
            "examTips": [
              "For thermal neutrons at temperature T: average kinetic energy K = (3/2)*k_B*T, so lambda = h / sqrt(3*m*k_B*T)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing de Broglie waves are electromagnetic. Matter waves are probability waves, completely distinct from electromagnetic radiation."
        ]
      },
      "formulas": [
        {
          "label": "De Broglie Wavelength",
          "formula": "\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}}",
          "description": "Wavelength of matter wave associated with particle of momentum p.",
          "variables": [
            {
              "symbol": "h",
              "meaning": "Planck’s Constant",
              "unit": "J s"
            },
            {
              "symbol": "p",
              "meaning": "Linear Momentum",
              "unit": "kg m/s"
            },
            {
              "symbol": "\\lambda",
              "meaning": "De Broglie Wavelength",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Accelerated Electron Wavelength",
          "formula": "\\lambda_e = \\frac{h}{\\sqrt{2 m_e e V}} = \\frac{1.227}{\\sqrt{V}} \\text{ nm}",
          "description": "De Broglie wavelength of electron accelerated across potential difference V in volts.",
          "variables": [
            {
              "symbol": "V",
              "meaning": "Accelerating Potential Difference",
              "unit": "V"
            },
            {
              "symbol": "\\lambda_e",
              "meaning": "Electron Wavelength",
              "unit": "nm"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-11-03",
          "title": "De Broglie’s Wave Nature of Matter & Davisson-Germer Experiment Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for De Broglie’s Wave Nature of Matter & Davisson-Germer Experiment.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-11-03",
          "title": "De Broglie’s Wave Nature of Matter & Davisson-Germer Experiment",
          "summary": "De Broglie wavelength lambda = h/p = h/(mv), wavelength of electron accelerated by voltage V lambda = 1.227/sqrt(V) nm, Davisson-Germer diffraction."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000012": [
    {
      "id": "top-phy-12-12-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-12-12-T01",
      "title": "Alpha-Particle Scattering & Rutherford’s Nuclear Model",
      "description": "Geiger-Marsden experiment, impact parameter b, distance of closest approach r0, discovery of central atomic nucleus, limitations.",
      "sequenceOrder": 1,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Rutherford’s alpha-particle scattering experiment demonstrated that most of the atom is empty space, with all positive charge and virtually all mass concentrated in a tiny central core called the nucleus.",
        "sections": [
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
            "examTips": [
              "Rutherford scattering assumes Coulomb interaction between point-like alpha particle and target gold nucleus."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming Rutherford's model explained why atoms don't collapse. Classical physics predicts Rutherford atoms are inherently unstable; Bohr's quantum postulates were required."
        ]
      },
      "formulas": [
        {
          "label": "Distance of Closest Approach",
          "formula": "r_0 = \\frac{1}{4\\pi\\varepsilon_0} \\frac{2 Z e^2}{K}",
          "description": "Minimum distance reached by alpha particle of kinetic energy K in head-on collision with nucleus of atomic number Z.",
          "variables": [
            {
              "symbol": "Z",
              "meaning": "Target Atomic Number",
              "unit": "-"
            },
            {
              "symbol": "e",
              "meaning": "Elementary Charge",
              "unit": "C"
            },
            {
              "symbol": "K",
              "meaning": "Alpha Particle Kinetic Energy",
              "unit": "J"
            },
            {
              "symbol": "r_0",
              "meaning": "Closest Approach Distance",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-12-01",
          "title": "Alpha-Particle Scattering & Rutherford’s Nuclear Model Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Alpha-Particle Scattering & Rutherford’s Nuclear Model.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-12-01",
          "title": "Alpha-Particle Scattering & Rutherford’s Nuclear Model",
          "summary": "Geiger-Marsden experiment, impact parameter b, distance of closest approach r0, discovery of central atomic nucleus, limitations."
        }
      ]
    },
    {
      "id": "top-phy-12-12-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-12-12-T02",
      "title": "Bohr’s Model of the Hydrogen Atom & Quantised Orbits",
      "description": "Bohr's postulates, angular momentum quantisation L = n*h/(2pi), radius r_n = 0.529*n^2/Z Angstrom, velocity v_n = c/(137*n), energy levels E_n = -13.6*Z^2/n^2 eV.",
      "sequenceOrder": 2,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Niels Bohr resolved atomic stability by postulating that electrons revolve only in discrete non-radiating stationary orbits where orbital angular momentum is an integer multiple of h / (2*pi).",
        "sections": [
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
            "examTips": [
              "Remember that K = -E and U = 2E. If total energy is -3.4 eV (n=2), K = +3.4 eV and U = -6.8 eV."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming Bohr model applies to multi-electron atoms. Bohr model is strictly valid ONLY for hydrogen and hydrogen-like single-electron ions (He+, Li2+, Be3+)."
        ]
      },
      "formulas": [
        {
          "label": "Bohr Orbital Radius",
          "formula": "r_n = \\frac{\\varepsilon_0 h^2 n^2}{\\pi m e^2 Z} = 0.529 \\frac{n^2}{Z} \\text{ \\AA}",
          "description": "Quantised orbital radius of nth stationary orbit for hydrogen-like ion of atomic number Z.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Principal Quantum Number",
              "unit": "-"
            },
            {
              "symbol": "Z",
              "meaning": "Atomic Number",
              "unit": "-"
            },
            {
              "symbol": "r_n",
              "meaning": "Orbital Radius",
              "unit": "\\AA"
            }
          ]
        },
        {
          "label": "Bohr Energy Levels",
          "formula": "E_n = -\\frac{m e^4 Z^2}{8 \\varepsilon_0^2 h^2 n^2} = -13.6 \\frac{Z^2}{n^2} \\text{ eV}",
          "description": "Quantised total mechanical energy of electron in nth stationary Bohr orbit.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Principal Quantum Number",
              "unit": "-"
            },
            {
              "symbol": "Z",
              "meaning": "Nuclear Charge Number",
              "unit": "-"
            },
            {
              "symbol": "E_n",
              "meaning": "Orbit Energy",
              "unit": "eV"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-phy-12-12-02",
          "title": "Bohr’s Model of the Hydrogen Atom & Quantised Orbits Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Bohr’s Model of the Hydrogen Atom & Quantised Orbits with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "bohr_atom"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-12-02",
          "title": "Bohr’s Model of the Hydrogen Atom & Quantised Orbits",
          "summary": "Bohr's postulates, angular momentum quantisation L = n*h/(2pi), radius r_n = 0.529*n^2/Z Angstrom, velocity v_n = c/(137*n), energy levels E_n = -13.6*Z^2/n^2 eV.",
          "simulationId": "bohr_atom"
        }
      ]
    },
    {
      "id": "top-phy-12-12-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "PHY-12-12-T03",
      "title": "Hydrogen Line Spectra & De Broglie’s Justification",
      "description": "Rydberg formula 1/lambda = R*(1/n1^2 - 1/n2^2), Lyman, Balmer, Paschen, Brackett, Pfund series, de Broglie's standing wave condition 2*pi*r = n*lambda.",
      "sequenceOrder": 3,
      "weightagePercent": 1.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Atomic hydrogen emits discrete spectral lines when excited electrons transition to lower energy states, emitting single photons matching the Rydberg formula.",
        "sections": [
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
            "examTips": [
              "The longest wavelength (first line) in Lyman series is n=2 -> n=1: lambda = 4 / (3R) approx 1216 Angstrom."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming Lyman series is in the visible spectrum. Lyman series is strictly ULTRAVIOLET; only Balmer series lies in the visible spectrum."
        ]
      },
      "formulas": [
        {
          "label": "Rydberg Spectral Formula",
          "formula": "\\frac{1}{\\lambda} = R Z^2 \\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)",
          "description": "Wavenumber of photon emitted during quantum transition from level n2 to level n1.",
          "variables": [
            {
              "symbol": "R",
              "meaning": "Rydberg Constant (1.097 x 10^7)",
              "unit": "m^-1"
            },
            {
              "symbol": "n_1, n_2",
              "meaning": "Lower & Upper Quantum Levels",
              "unit": "-"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Emitted Photon Wavelength",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-12-03",
          "title": "Hydrogen Line Spectra & De Broglie’s Justification Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Hydrogen Line Spectra & De Broglie’s Justification.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-12-03",
          "title": "Hydrogen Line Spectra & De Broglie’s Justification",
          "summary": "Rydberg formula 1/lambda = R*(1/n1^2 - 1/n2^2), Lyman, Balmer, Paschen, Brackett, Pfund series, de Broglie's standing wave condition 2*pi*r = n*lambda."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000013": [
    {
      "id": "top-phy-12-13-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-12-13-T01",
      "title": "Nuclear Structure, Nuclear Size & Nuclear Density",
      "description": "Atomic mass unit 1 u = 931.5 MeV, nuclear radius R = R0*A^(1/3) (R0 = 1.2 fm), constant nuclear density rho approx 2.3 x 10^17 kg/m^3.",
      "sequenceOrder": 1,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The atomic nucleus consists of bound nucleons (protons and neutrons). Nuclear volume is proportional to mass number A, rendering nuclear density universally constant across all chemical elements.",
        "sections": [
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
            "examTips": [
              "The ratio of nuclear densities of any two elements (e.g. Iron vs Lead) is strictly 1 : 1."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming heavier nuclei are denser. Nuclear radius scales as A^(1/3), making nuclear density identical for all nuclei."
        ]
      },
      "formulas": [
        {
          "label": "Nuclear Radius Formula",
          "formula": "R = R_0 A^{1/3}",
          "description": "Empirical radius of nucleus of mass number A with R0 = 1.2 fm.",
          "variables": [
            {
              "symbol": "R_0",
              "meaning": "Nuclear Radius Constant (1.2 fm)",
              "unit": "m"
            },
            {
              "symbol": "A",
              "meaning": "Mass Number (Nucleon Count)",
              "unit": "-"
            },
            {
              "symbol": "R",
              "meaning": "Nuclear Radius",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-13-01",
          "title": "Nuclear Structure, Nuclear Size & Nuclear Density Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Nuclear Structure, Nuclear Size & Nuclear Density.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-13-01",
          "title": "Nuclear Structure, Nuclear Size & Nuclear Density",
          "summary": "Atomic mass unit 1 u = 931.5 MeV, nuclear radius R = R0*A^(1/3) (R0 = 1.2 fm), constant nuclear density rho approx 2.3 x 10^17 kg/m^3."
        }
      ]
    },
    {
      "id": "top-phy-12-13-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-12-13-T02",
      "title": "Mass Defect & Binding Energy per Nucleon Curve",
      "description": "Mass defect Delta m = [Z*mp + (A-Z)*mn] - M_nucleus, binding energy E_b = Delta m * c^2, BE/A curve, nuclear fission and fusion.",
      "sequenceOrder": 2,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The rest mass of an atomic nucleus is always strictly less than the sum of the individual masses of its constituent free nucleons, the missing mass having been converted into nuclear binding energy: E_b = Delta m * c^2.",
        "sections": [
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
            "examTips": [
              "Energy released in a nuclear reaction: Q = (Total BE of products) - (Total BE of reactants) = (Mass of reactants - Mass of products) * 931.5 MeV."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing total binding energy with stability. Stability is determined by Binding Energy PER NUCLEON (BE/A), not total binding energy."
        ]
      },
      "formulas": [
        {
          "label": "Mass Defect & Binding Energy",
          "formula": "\\Delta m = [Z m_p + (A - Z) m_n] - M, \\quad E_b = \\Delta m \\times 931.5 \\text{ MeV}",
          "description": "Mass discrepancy converted into nuclear binding energy holding nucleons together.",
          "variables": [
            {
              "symbol": "Z",
              "meaning": "Proton Number",
              "unit": "-"
            },
            {
              "symbol": "A",
              "meaning": "Mass Number",
              "unit": "-"
            },
            {
              "symbol": "\\Delta m",
              "meaning": "Mass Defect",
              "unit": "u"
            },
            {
              "symbol": "E_b",
              "meaning": "Total Binding Energy",
              "unit": "MeV"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-13-02",
          "title": "Mass Defect & Binding Energy per Nucleon Curve Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Mass Defect & Binding Energy per Nucleon Curve.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-13-02",
          "title": "Mass Defect & Binding Energy per Nucleon Curve",
          "summary": "Mass defect Delta m = [Z*mp + (A-Z)*mn] - M_nucleus, binding energy E_b = Delta m * c^2, BE/A curve, nuclear fission and fusion."
        }
      ]
    },
    {
      "id": "top-phy-12-13-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "PHY-12-13-T03",
      "title": "Nuclear Fission, Chain Reactions & Nuclear Fusion",
      "description": "Thermal neutron fission of U-235, controlled vs uncontrolled chain reactions, multiplication factor k, stellar proton-proton cycle fusion.",
      "sequenceOrder": 3,
      "weightagePercent": 1.3,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Nuclear fission splits heavy nuclei into middle-mass fragments with high energy release; nuclear fusion fuses light hydrogen isotopes into helium at extreme thermonuclear temperatures.",
        "sections": [
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
            "examTips": [
              "Moderators SLOW DOWN fast neutrons to thermal speeds (~0.025 eV); control rods ABSORB excess neutrons."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing the functions of moderators and control rods. Moderators slow down neutrons without absorbing them; control rods absorb neutrons to control reactor power."
        ]
      },
      "formulas": [
        {
          "label": "Nuclear Fission Energy Release",
          "formula": "Q = [m(^{235}_{92}\\text{U}) + m_n - \\sum m_{\\text{products}}] c^2 \\approx 200 \\text{ MeV}",
          "description": "Total kinetic energy and gamma radiation released per U-235 fission event.",
          "variables": [
            {
              "symbol": "Q",
              "meaning": "Fission Energy Released",
              "unit": "MeV"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-13-03",
          "title": "Nuclear Fission, Chain Reactions & Nuclear Fusion Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Nuclear Fission, Chain Reactions & Nuclear Fusion.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-13-03",
          "title": "Nuclear Fission, Chain Reactions & Nuclear Fusion",
          "summary": "Thermal neutron fission of U-235, controlled vs uncontrolled chain reactions, multiplication factor k, stellar proton-proton cycle fusion."
        }
      ]
    }
  ],
  "c0000012-0000-0000-0000-000000000014": [
    {
      "id": "top-phy-12-14-01",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-12-14-T01",
      "title": "Energy Bands in Solids: Conductors, Semiconductors & Insulators",
      "description": "Valence band, conduction band, forbidden energy gap Eg, classification of metals (Eg = 0), semiconductors (Eg < 3 eV), and insulators (Eg > 3 eV).",
      "sequenceOrder": 1,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "In crystalline solids, atomic energy levels split into continuous energy bands. Electrical conductivity depends on the magnitude of the forbidden energy gap Eg separating the valence band from the conduction band.",
        "sections": [
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
            "examTips": [
              "At absolute zero (0 K), intrinsic semiconductors have completely empty conduction bands and act as perfect insulators."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming holes physically move through the lattice. Holes move via neighboring valence electrons hopping into adjacent empty states."
        ]
      },
      "formulas": [
        {
          "label": "Total Semiconductor Current",
          "formula": "I = I_e + I_h = e A (n_e v_e + n_h v_h)",
          "description": "Total current carried by electrons in conduction band and holes in valence band.",
          "variables": [
            {
              "symbol": "n_e, n_h",
              "meaning": "Electron & Hole Densities",
              "unit": "m^-3"
            },
            {
              "symbol": "v_e, v_h",
              "meaning": "Drift Velocities",
              "unit": "m/s"
            },
            {
              "symbol": "e",
              "meaning": "Elementary Charge",
              "unit": "C"
            },
            {
              "symbol": "I",
              "meaning": "Total Current",
              "unit": "A"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-14-01",
          "title": "Energy Bands in Solids: Conductors, Semiconductors & Insulators Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Energy Bands in Solids: Conductors, Semiconductors & Insulators.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-14-01",
          "title": "Energy Bands in Solids: Conductors, Semiconductors & Insulators",
          "summary": "Valence band, conduction band, forbidden energy gap Eg, classification of metals (Eg = 0), semiconductors (Eg < 3 eV), and insulators (Eg > 3 eV)."
        }
      ]
    },
    {
      "id": "top-phy-12-14-02",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-12-14-T02",
      "title": "Intrinsic and Extrinsic Semiconductors: Doping & Carriers",
      "description": "Pure Silicon/Germanium, n_e = n_h = n_i, n-type doping (pentavalent P, As, Sb), p-type doping (trivalent B, Al, In), mass action law n_e*n_h = n_i^2.",
      "sequenceOrder": 2,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Doping introduces deliberate trace impurities into pure semiconductors to dramatically increase carrier concentrations. Pentavalent dopants create n-type material; trivalent dopants create p-type material.",
        "sections": [
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
            "examTips": [
              "Remember: n-type semiconductor is NOT negatively charged! It is electrically neutral overall."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing n-type semiconductors have net negative electrical charge. Mobile electrons are balanced by stationary positive donor ions, maintaining net electrical neutrality."
        ]
      },
      "formulas": [
        {
          "label": "Semiconductor Mass Action Law",
          "formula": "n_e n_h = n_i^2",
          "description": "Invariant product of electron and hole carrier densities in thermal equilibrium.",
          "variables": [
            {
              "symbol": "n_e",
              "meaning": "Electron Concentration",
              "unit": "m^-3"
            },
            {
              "symbol": "n_h",
              "meaning": "Hole Concentration",
              "unit": "m^-3"
            },
            {
              "symbol": "n_i",
              "meaning": "Intrinsic Carrier Concentration",
              "unit": "m^-3"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-14-02",
          "title": "Intrinsic and Extrinsic Semiconductors: Doping & Carriers Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Intrinsic and Extrinsic Semiconductors: Doping & Carriers.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-14-02",
          "title": "Intrinsic and Extrinsic Semiconductors: Doping & Carriers",
          "summary": "Pure Silicon/Germanium, n_e = n_h = n_i, n-type doping (pentavalent P, As, Sb), p-type doping (trivalent B, Al, In), mass action law n_e*n_h = n_i^2."
        }
      ]
    },
    {
      "id": "top-phy-12-14-03",
      "subjectId": "physics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000012-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "PHY-12-14-T03",
      "title": "p-n Junction Diode, Biasing & Full-Wave Rectification",
      "description": "Diffusion and drift currents, depletion layer, barrier potential, forward and reverse bias I-V characteristics, half-wave and full-wave rectification.",
      "sequenceOrder": 3,
      "weightagePercent": 2.2,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A p-n junction forms when p-type and n-type semiconductor regions merge. Diffusion of carriers creates a depletion layer and built-in barrier potential opposing further diffusion.",
        "sections": [
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
            "examTips": [
              "Zener diode is heavily doped, operates in REVERSE breakdown region, and is used as a DC voltage regulator."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming diode conducts zero current in reverse bias. A tiny temperature-dependent reverse saturation current (microamps) flows due to minority carriers."
        ]
      },
      "formulas": [
        {
          "label": "Full-Wave Rectifier Efficiency",
          "formula": "\\eta = \\frac{0.812 R_L}{r_d + R_L} \\approx 81.2\\%",
          "description": "Maximum conversion efficiency of AC input power to DC output power in full-wave rectifier.",
          "variables": [
            {
              "symbol": "R_L",
              "meaning": "Load Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "r_d",
              "meaning": "Diode Forward Resistance",
              "unit": "\\Omega"
            },
            {
              "symbol": "\\eta",
              "meaning": "Rectification Efficiency",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-phy-12-14-03",
          "title": "p-n Junction Diode, Biasing & Full-Wave Rectification Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for p-n Junction Diode, Biasing & Full-Wave Rectification.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-phy-12-14-03",
          "title": "p-n Junction Diode, Biasing & Full-Wave Rectification",
          "summary": "Diffusion and drift currents, depletion layer, barrier potential, forward and reverse bias I-V characteristics, half-wave and full-wave rectification."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000005": [
    {
      "id": "top-chem-11-01-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-11-01-T01",
      "title": "Laws of Chemical Combinations & Dalton’s Atomic Theory",
      "description": "Law of conservation of mass, definite proportions, multiple proportions, Gay-Lussac's law, Avogadro's hypothesis, and Dalton's postulates.",
      "sequenceOrder": 1,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Chemical reactions obey macroscopic mass and volume conservation principles that led directly to Dalton's atomic postulate that atoms are indivisible building blocks.",
        "sections": [
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
            "examTips": [
              "For multiple proportions numericals, keep the mass of one element constant (normalize to 1g or 100g) before computing the ratio of the second element."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing Gay-Lussac's law of combining volumes with Gay-Lussac's P-T law. Combining volumes applies strictly to gaseous reacting stoichiometric volumes."
        ]
      },
      "formulas": [
        {
          "label": "Avogadro’s Law at STP",
          "formula": "V = n \\times V_m, \\quad V_m = 22.71 \\text{ L/mol at STP (1 bar, 273.15 K)}",
          "description": "Gas volume directly proportional to moles at constant temperature and pressure.",
          "variables": [
            {
              "symbol": "V",
              "meaning": "Gas Volume",
              "unit": "L"
            },
            {
              "symbol": "n",
              "meaning": "Amount of Substance",
              "unit": "mol"
            },
            {
              "symbol": "V_m",
              "meaning": "Molar Volume",
              "unit": "L/mol"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-01-01",
          "title": "Laws of Chemical Combinations & Dalton’s Atomic Theory Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Laws of Chemical Combinations & Dalton’s Atomic Theory.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-01-01",
          "title": "Laws of Chemical Combinations & Dalton’s Atomic Theory",
          "summary": "Law of conservation of mass, definite proportions, multiple proportions, Gay-Lussac's law, Avogadro's hypothesis, and Dalton's postulates."
        }
      ]
    },
    {
      "id": "top-chem-11-01-02",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-11-01-T02",
      "title": "Mole Concept, Molar Mass & Percentage Composition",
      "description": "Avogadro constant N_A = 6.022 x 10^23, molar mass, atomic mass unit (u), empirical and molecular formula determination.",
      "sequenceOrder": 2,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "One mole contains exactly 6.02214076 x 10^23 elementary entities. It connects microscopic atomic masses in unified atomic mass units (u) with macroscopic laboratory grams.",
        "sections": [
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
            "examTips": [
              "If fractional ratios like 1.33 or 1.5 appear in empirical formula calculation, multiply all atom counts by 3 or 2 respectively."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing empirical formula with molecular formula for ionic compounds. Ionic compounds like NaCl or CaCl2 exist only as empirical network lattices without discrete molecules."
        ]
      },
      "formulas": [
        {
          "label": "Mole Count Formula",
          "formula": "n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V_{\\text{STP}}}{22.71}",
          "description": "Fundamental relationship linking mass, entity count, and standard gas volume to moles.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Moles",
              "unit": "mol"
            },
            {
              "symbol": "m",
              "meaning": "Sample Mass",
              "unit": "g"
            },
            {
              "symbol": "M",
              "meaning": "Molar Mass",
              "unit": "g/mol"
            },
            {
              "symbol": "N_A",
              "meaning": "Avogadro Number",
              "unit": "mol^{-1}"
            }
          ]
        },
        {
          "label": "Mass Percentage & Molecular Multiplier",
          "formula": "\\% \\text{ Element} = \\frac{\\text{Mass of element in 1 mol}}{\\text{Molar Mass}} \\times 100, \\quad n = \\frac{\\text{Molar Mass}}{\\text{Empirical Formula Mass}}",
          "description": "Mass composition percentage and empirical-to-molecular integer factor.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Integer Multiplier",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-01-02",
          "title": "Mole Concept, Molar Mass & Percentage Composition Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Mole Concept, Molar Mass & Percentage Composition.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-01-02",
          "title": "Mole Concept, Molar Mass & Percentage Composition",
          "summary": "Avogadro constant N_A = 6.022 x 10^23, molar mass, atomic mass unit (u), empirical and molecular formula determination."
        }
      ]
    },
    {
      "id": "top-chem-11-01-03",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-11-01-T03",
      "title": "Stoichiometry, Limiting Reagents & Concentration of Solutions",
      "description": "Stoichiometric calculations, limiting reagent identification, percentage yield, mass percent, mole fraction, molarity (M), and molality (m).",
      "sequenceOrder": 3,
      "weightagePercent": 2.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Stoichiometry calculates theoretical yields and consumed reactants. When reactants are mixed in non-stoichiometric proportions, the limiting reagent is completely consumed first and dictates product yield.",
        "sections": [
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
            "examTips": [
              "In limiting reagent problems, NEVER compare initial masses directly. Always convert grams to moles and divide by balanced stoichiometric coefficients!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing the reactant with the lowest initial mass is always the limiting reagent. Moles divided by stoichiometric coefficients determines the limiter."
        ]
      },
      "formulas": [
        {
          "label": "Molarity vs Molality",
          "formula": "M = \\frac{n_{\\text{solute}}}{V_{\\text{soln (L)}}}, \\quad m = \\frac{n_{\\text{solute}}}{m_{\\text{solvent (kg)}}}",
          "description": "Volumetric molar concentration versus temperature-invariant molal concentration.",
          "variables": [
            {
              "symbol": "M",
              "meaning": "Molarity",
              "unit": "mol/L"
            },
            {
              "symbol": "m",
              "meaning": "Molality",
              "unit": "mol/kg"
            },
            {
              "symbol": "V",
              "meaning": "Solution Volume",
              "unit": "L"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-01-03",
          "title": "Stoichiometry, Limiting Reagents & Concentration of Solutions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Stoichiometry, Limiting Reagents & Concentration of Solutions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-01-03",
          "title": "Stoichiometry, Limiting Reagents & Concentration of Solutions",
          "summary": "Stoichiometric calculations, limiting reagent identification, percentage yield, mass percent, mole fraction, molarity (M), and molality (m)."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000002": [
    {
      "id": "top-chem-11-02-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "CHEM-11-02-T01",
      "title": "Bohr’s Model of Hydrogen Atom & Line Spectra",
      "description": "Postulates of Bohr model, quantization of angular momentum L = nh/2pi, radius r_n = n^2 a0, energy E_n = -13.6 Z^2 / n^2 eV, Rydberg equation, and spectral series.",
      "sequenceOrder": 1,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Bohr combined classical mechanics with Planck's quantum hypothesis to explain the stability and discrete emission spectra of hydrogen-like single-electron atoms (H, He+, Li2+).",
        "sections": [
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
            "examTips": [
              "Shortest wavelength (series limit) corresponds to n_2 = infinity; longest wavelength corresponds to the immediate next transition n_2 = n_1 + 1."
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying Bohr's model equations to multi-electron atoms (like neutral Helium). Bohr's model is strictly valid ONLY for single-electron species (H, He+, Li2+, Be3+)."
        ]
      },
      "formulas": [
        {
          "label": "Bohr Energy & Radius Quantization",
          "formula": "E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}, \\quad r_n = 0.529 \\frac{n^2}{Z} \\text{ \\AA}",
          "description": "Quantized energy levels and orbital radii for hydrogen-like species.",
          "variables": [
            {
              "symbol": "Z",
              "meaning": "Atomic Number",
              "unit": "-"
            },
            {
              "symbol": "n",
              "meaning": "Principal Quantum Number",
              "unit": "-"
            },
            {
              "symbol": "E_n",
              "meaning": "Orbital Energy",
              "unit": "eV"
            },
            {
              "symbol": "r_n",
              "meaning": "Bohr Radius",
              "unit": "Å"
            }
          ]
        },
        {
          "label": "Rydberg Spectral Formula",
          "formula": "\\frac{1}{\\lambda} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)",
          "description": "Wavenumber of emitted photon during electronic de-excitation from n2 to n1.",
          "variables": [
            {
              "symbol": "R_H",
              "meaning": "Rydberg Constant",
              "unit": "1.097 \\times 10^7 \\text{ m}^{-1}"
            },
            {
              "symbol": "\\lambda",
              "meaning": "Emitted Wavelength",
              "unit": "m"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-chem-11-02-01",
          "title": "Bohr’s Model of Hydrogen Atom & Line Spectra Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Bohr’s Model of Hydrogen Atom & Line Spectra with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "bohr_atom"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-02-01",
          "title": "Bohr’s Model of Hydrogen Atom & Line Spectra",
          "summary": "Postulates of Bohr model, quantization of angular momentum L = nh/2pi, radius r_n = n^2 a0, energy E_n = -13.6 Z^2 / n^2 eV, Rydberg equation, and spectral series.",
          "simulationId": "bohr_atom"
        }
      ]
    },
    {
      "id": "top-chem-11-02-02",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "CHEM-11-02-T02",
      "title": "Dual Nature of Matter & Heisenberg’s Uncertainty Principle",
      "description": "de Broglie wavelength lambda = h / p = h / mv, wave-particle duality, Davisson-Germer confirmation, and Heisenberg uncertainty Delta x * Delta p >= h / 4pi.",
      "sequenceOrder": 2,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Microscopic matter exhibits both particle and wave characteristics. de Broglie assigned wave properties to particles, and Heisenberg proved that position and momentum cannot be simultaneously determined with arbitrary precision.",
        "sections": [
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
            "examTips": [
              "Macroscopic objects (e.g. 100g cricket ball) have negligible de Broglie wavelengths (~10^-34 m), so wave properties and uncertainty are completely imperceptible."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming Heisenberg's uncertainty is caused by clumsy measuring instruments. It is a fundamental intrinsic quantum property of wave packets in nature."
        ]
      },
      "formulas": [
        {
          "label": "de Broglie Wavelength",
          "formula": "\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m K}}",
          "description": "Wavelength of matter wave associated with particle having momentum p or kinetic energy K.",
          "variables": [
            {
              "symbol": "h",
              "meaning": "Planck Constant",
              "unit": "6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}"
            },
            {
              "symbol": "m",
              "meaning": "Particle Mass",
              "unit": "kg"
            },
            {
              "symbol": "v",
              "meaning": "Velocity",
              "unit": "m/s"
            },
            {
              "symbol": "\\lambda",
              "meaning": "de Broglie Wavelength",
              "unit": "m"
            }
          ]
        },
        {
          "label": "Heisenberg Uncertainty Relation",
          "formula": "\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} = \\frac{\\hbar}{2}",
          "description": "Fundamental limit to the precision of simultaneous conjugate position and momentum measurements.",
          "variables": [
            {
              "symbol": "\\Delta x",
              "meaning": "Position Uncertainty",
              "unit": "m"
            },
            {
              "symbol": "\\Delta p",
              "meaning": "Momentum Uncertainty",
              "unit": "kg m/s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-02-02",
          "title": "Dual Nature of Matter & Heisenberg’s Uncertainty Principle Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Dual Nature of Matter & Heisenberg’s Uncertainty Principle.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-02-02",
          "title": "Dual Nature of Matter & Heisenberg’s Uncertainty Principle",
          "summary": "de Broglie wavelength lambda = h / p = h / mv, wave-particle duality, Davisson-Germer confirmation, and Heisenberg uncertainty Delta x * Delta p >= h / 4pi."
        }
      ]
    },
    {
      "id": "top-chem-11-02-03",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "CHEM-11-02-T03",
      "title": "Quantum Numbers, Orbitals & Electronic Configuration",
      "description": "Schrödinger wave equation, psi and psi^2, quantum numbers (n, l, m_l, m_s), radial and angular nodes, Aufbau principle, Pauli exclusion principle, and Hund’s rule.",
      "sequenceOrder": 3,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The quantum mechanical model describes electron distribution via wavefunctions psi. The square of wavefunction psi^2 defines electron probability density, characterized by four quantum numbers.",
        "sections": [
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
            "examTips": [
              "If two orbitals have the same (n + l) value, the orbital with the lower n value possesses lower energy and fills first (e.g. 3d vs 4p: 3d has n=3, 4p has n=4, so 3d is lower energy)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming an electron physically spins on its axis like a planet. Spin is an intrinsic relativistic quantum mechanical angular momentum property."
        ]
      },
      "formulas": [
        {
          "label": "Orbital Angular Momentum & Node Formulas",
          "formula": "L = \\sqrt{l(l+1)} \\frac{h}{2\\pi}, \\quad \\text{Radial Nodes} = n - l - 1, \\quad \\text{Angular Nodes} = l",
          "description": "Quantized orbital angular momentum and nodal spatial planes.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Principal Quantum Number",
              "unit": "-"
            },
            {
              "symbol": "l",
              "meaning": "Azimuthal Quantum Number",
              "unit": "-"
            },
            {
              "symbol": "L",
              "meaning": "Angular Momentum",
              "unit": "J s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-02-03",
          "title": "Quantum Numbers, Orbitals & Electronic Configuration Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Quantum Numbers, Orbitals & Electronic Configuration.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-02-03",
          "title": "Quantum Numbers, Orbitals & Electronic Configuration",
          "summary": "Schrödinger wave equation, psi and psi^2, quantum numbers (n, l, m_l, m_s), radial and angular nodes, Aufbau principle, Pauli exclusion principle, and Hund’s rule."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000003": [
    {
      "id": "top-chem-11-03-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "CHEM-11-03-T01",
      "title": "Modern Periodic Law & Periodic Table Architecture",
      "description": "Moseley's law sqrt(nu) = a(Z - b), modern periodic law based on atomic number Z, s, p, d, f block divisions, and IUPAC nomenclature for Z > 100.",
      "sequenceOrder": 1,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Henry Moseley established that atomic number Z, rather than atomic mass, is the fundamental property of an element. Physical and chemical properties of elements are periodic functions of their atomic numbers.",
        "sections": [
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
            "examTips": [
              "Group number determination: s-block = valence electrons; p-block = 12 + valence p-electrons; d-block = 2 + (n-1)d electrons."
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking Mendeleev arranged elements by atomic number. Mendeleev organized elements by atomic mass; Moseley introduced atomic number."
        ]
      },
      "formulas": [
        {
          "label": "Moseley’s Law",
          "formula": "\\sqrt{\\nu} = a (Z - b)",
          "description": "Linear relationship between frequency of characteristic X-rays and atomic number Z.",
          "variables": [
            {
              "symbol": "\\nu",
              "meaning": "X-ray Frequency",
              "unit": "Hz"
            },
            {
              "symbol": "Z",
              "meaning": "Atomic Number",
              "unit": "-"
            },
            {
              "symbol": "a, b",
              "meaning": "Moseley Constants",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-03-01",
          "title": "Modern Periodic Law & Periodic Table Architecture Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Modern Periodic Law & Periodic Table Architecture.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-03-01",
          "title": "Modern Periodic Law & Periodic Table Architecture",
          "summary": "Moseley's law sqrt(nu) = a(Z - b), modern periodic law based on atomic number Z, s, p, d, f block divisions, and IUPAC nomenclature for Z > 100."
        }
      ]
    },
    {
      "id": "top-chem-11-03-02",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "CHEM-11-03-T02",
      "title": "Periodic Trends in Physical & Chemical Properties",
      "description": "Atomic and ionic radii, lanthanoid contraction, ionization enthalpy (IE), electron gain enthalpy (Delta_eg H), electronegativity (Pauling scale), and anomalous properties of 2nd period elements.",
      "sequenceOrder": 2,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Atomic properties vary systematically across periods and down groups due to the interplay between effective nuclear charge Z_eff and electronic shielding.",
        "sections": [
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
            "examTips": [
              "Isoelectronic species radius comparison: Greater positive nuclear charge means smaller ionic radius (e.g. Al3+ < Mg2+ < Na+ < F- < O2- < N3-)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing Fluorine has the highest electron affinity. Fluorine is the most electronegative, but Chlorine has the highest negative electron gain enthalpy."
        ]
      },
      "formulas": [
        {
          "label": "Effective Nuclear Charge & Pauling Electronegativity",
          "formula": "Z_{\\text{eff}} = Z - \\sigma, \\quad |\\chi_A - \\chi_B| = 0.208 \\sqrt{\\Delta} \\text{ (in kcal/mol)}",
          "description": "Slater shielding screening factor and Pauling electronegativity difference formula.",
          "variables": [
            {
              "symbol": "Z",
              "meaning": "Nuclear Charge",
              "unit": "-"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Shielding Constant",
              "unit": "-"
            },
            {
              "symbol": "\\chi",
              "meaning": "Pauling Electronegativity",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-03-02",
          "title": "Periodic Trends in Physical & Chemical Properties Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Periodic Trends in Physical & Chemical Properties.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-03-02",
          "title": "Periodic Trends in Physical & Chemical Properties",
          "summary": "Atomic and ionic radii, lanthanoid contraction, ionization enthalpy (IE), electron gain enthalpy (Delta_eg H), electronegativity (Pauling scale), and anomalous properties of 2nd period elements."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000006": [
    {
      "id": "top-chem-11-04-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "CHEM-11-04-T01",
      "title": "VSEPR Theory & Molecular Geometry",
      "description": "Valence Shell Electron Pair Repulsion theory, repulsion order lp-lp > lp-bp > bp-bp, molecular geometry versus electron geometry (linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral).",
      "sequenceOrder": 1,
      "weightagePercent": 2.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "VSEPR theory predicts three-dimensional molecular geometries by minimizing electrostatic repulsion between valence shell electron pairs (bonding pairs and lone pairs) surrounding the central atom.",
        "sections": [
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
            "examTips": [
              "PCl5 is thermally unstable and decomposes to PCl3 + Cl2 because the two axial P-Cl bonds are longer and weaker than the three equatorial bonds."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing electron pair geometry with molecular shape. Electron geometry considers all pairs; molecular shape considers only the spatial arrangement of atoms."
        ]
      },
      "formulas": [
        {
          "label": "Steric Number Formula",
          "formula": "\\text{Steric Number} = \\frac{1}{2} [V + M - C + A]",
          "description": "Calculates total electron pairs to determine hybridisation and basic VSEPR electron geometry.",
          "variables": [
            {
              "symbol": "V",
              "meaning": "Valence Electrons of Central Atom",
              "unit": "-"
            },
            {
              "symbol": "M",
              "meaning": "Monovalent Surrounding Atoms (H, X)",
              "unit": "-"
            },
            {
              "symbol": "C",
              "meaning": "Cationic Positive Charge",
              "unit": "-"
            },
            {
              "symbol": "A",
              "meaning": "Anionic Negative Charge",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-chem-11-04-01",
          "title": "VSEPR Theory & Molecular Geometry Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for VSEPR Theory & Molecular Geometry with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "vsepr_geometry"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-04-01",
          "title": "VSEPR Theory & Molecular Geometry",
          "summary": "Valence Shell Electron Pair Repulsion theory, repulsion order lp-lp > lp-bp > bp-bp, molecular geometry versus electron geometry (linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral).",
          "simulationId": "vsepr_geometry"
        }
      ]
    },
    {
      "id": "top-chem-11-04-02",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "CHEM-11-04-T02",
      "title": "Valence Bond Theory & Hybridisation",
      "description": "Orbital overlap concept, sigma (sigma) and pi (pi) bonds, sp, sp2, sp3, sp3d, sp3d2 hybridisation schemes with geometry and bond angles.",
      "sequenceOrder": 2,
      "weightagePercent": 2.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Valence Bond Theory explains covalent bonding through orbital overlapping. Hybridisation mixes atomic orbitals of similar energies to form identical hybrid orbitals with specific spatial directional characteristics.",
        "sections": [
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
            "examTips": [
              "Resonance does not alter the actual hybridisation state or geometry of the molecule. Count sigma bonds and localized lone pairs only when assigning hybridisation."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing hybridisation is a physical process where atoms physically morph. It is a mathematical model combining wavefunctions to explain observed molecular shapes."
        ]
      },
      "formulas": [
        {
          "label": "Hybridisation and s-Character Relations",
          "formula": "\\cos\\theta = -\\frac{s}{1 - s} = -\\frac{1}{n} \\quad (\\text{for } sp^n)",
          "description": "Geometric relationship connecting inter-orbital angle theta to fractional s-character in hybrid orbitals.",
          "variables": [
            {
              "symbol": "\\theta",
              "meaning": "Bond Angle",
              "unit": "rad"
            },
            {
              "symbol": "s",
              "meaning": "Fractional s-Character",
              "unit": "-"
            },
            {
              "symbol": "n",
              "meaning": "p-Character Power",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-04-02",
          "title": "Valence Bond Theory & Hybridisation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Valence Bond Theory & Hybridisation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-04-02",
          "title": "Valence Bond Theory & Hybridisation",
          "summary": "Orbital overlap concept, sigma (sigma) and pi (pi) bonds, sp, sp2, sp3, sp3d, sp3d2 hybridisation schemes with geometry and bond angles."
        }
      ]
    },
    {
      "id": "top-chem-11-04-03",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "CHEM-11-04-T03",
      "title": "Molecular Orbital Theory (MOT) & Hydrogen Bonding",
      "description": "LCAO principle, bonding vs antibonding orbitals, energy level diagrams for homonuclear diatomics (<=14 e- vs >14 e-), bond order, magnetic behavior, and hydrogen bonding.",
      "sequenceOrder": 3,
      "weightagePercent": 2.8,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Molecular Orbital Theory treats electrons as moving under the influence of all nuclei in the molecule. Linear Combination of Atomic Orbitals (LCAO) generates bonding (constructive interference) and antibonding (destructive interference) molecular orbitals.",
        "sections": [
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
            "examTips": [
              "Hydrogen bonding occurs strictly between H and highly electronegative elements F, O, N. Intermolecular H-bonding increases boiling point (H2O vs H2S); intramolecular H-bonding (o-nitrophenol) decreases boiling point."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing O2 is diamagnetic because all its valence electrons appear paired in Lewis structures. MOT correctly shows 2 unpaired electrons in degenerate pi* antibonding orbitals."
        ]
      },
      "formulas": [
        {
          "label": "Bond Order Formula",
          "formula": "\\text{Bond Order} = \\frac{1}{2} (N_b - N_a)",
          "description": "Determines stability and multiplicity of covalent bonds between two atoms.",
          "variables": [
            {
              "symbol": "N_b",
              "meaning": "Bonding Electrons",
              "unit": "-"
            },
            {
              "symbol": "N_a",
              "meaning": "Antibonding Electrons",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-04-03",
          "title": "Molecular Orbital Theory (MOT) & Hydrogen Bonding Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Molecular Orbital Theory (MOT) & Hydrogen Bonding.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-04-03",
          "title": "Molecular Orbital Theory (MOT) & Hydrogen Bonding",
          "summary": "LCAO principle, bonding vs antibonding orbitals, energy level diagrams for homonuclear diatomics (<=14 e- vs >14 e-), bond order, magnetic behavior, and hydrogen bonding."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000005": [
    {
      "id": "top-chem-11-05-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-11-05-T01",
      "title": "First Law of Thermodynamics, Enthalpy & Heat Capacity",
      "description": "System and surroundings, state functions, internal energy Delta U = q + w, work of expansion w = -P Delta V, enthalpy H = U + PV, and Cp - Cv = R.",
      "sequenceOrder": 1,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Chemical thermodynamics studies energy transformations in chemical reactions. The First Law states energy conservation: change in internal energy equals heat supplied plus work done on the system.",
        "sections": [
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
            "examTips": [
              "Always calculate Delta n_g = (moles of gaseous products) - (moles of gaseous reactants). Solids and liquids are strictly ignored in Delta n_g!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking work done in reversible expansion equals irreversible expansion. Reversible isothermal expansion delivers the MAXIMUM work possible."
        ]
      },
      "formulas": [
        {
          "label": "First Law & Gaseous Reaction Enthalpy",
          "formula": "\\Delta U = q + w, \\quad \\Delta H = \\Delta U + \\Delta n_g R T",
          "description": "Internal energy change and isobaric reaction enthalpy adjustment.",
          "variables": [
            {
              "symbol": "\\Delta U",
              "meaning": "Internal Energy Change",
              "unit": "J"
            },
            {
              "symbol": "q",
              "meaning": "Heat Absorbed",
              "unit": "J"
            },
            {
              "symbol": "w",
              "meaning": "Work Done",
              "unit": "J"
            },
            {
              "symbol": "\\Delta n_g",
              "meaning": "Change in Gas Moles",
              "unit": "mol"
            }
          ]
        },
        {
          "label": "Reversible Isothermal Work & Heat Capacities",
          "formula": "w_{\\text{rev}} = -2.303 n R T \\log_{10}\\left(\\frac{V_2}{V_1}\\right), \\quad C_p - C_v = R",
          "description": "Maximum work of isothermal ideal gas expansion and Mayer heat capacity difference.",
          "variables": [
            {
              "symbol": "w_{\\text{rev}}",
              "meaning": "Reversible Expansion Work",
              "unit": "J"
            },
            {
              "symbol": "C_p, C_v",
              "meaning": "Molar Heat Capacities",
              "unit": "J/(mol K)"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-05-01",
          "title": "First Law of Thermodynamics, Enthalpy & Heat Capacity Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for First Law of Thermodynamics, Enthalpy & Heat Capacity.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-05-01",
          "title": "First Law of Thermodynamics, Enthalpy & Heat Capacity",
          "summary": "System and surroundings, state functions, internal energy Delta U = q + w, work of expansion w = -P Delta V, enthalpy H = U + PV, and Cp - Cv = R."
        }
      ]
    },
    {
      "id": "top-chem-11-05-02",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-11-05-T02",
      "title": "Hess’s Law & Enthalpy of Reactions",
      "description": "Standard enthalpy changes, Hess's law of constant heat summation, standard enthalpy of formation Delta_f H°, combustion, bond dissociation enthalpy.",
      "sequenceOrder": 2,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Hess’s law of constant heat summation is a direct manifestation of enthalpy being a state function: net enthalpy change in a reaction is independent of intermediate pathway steps.",
        "sections": [
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
            "examTips": [
              "When using bond enthalpies, it is ALWAYS: Reactants minus Products. When using formation enthalpies, it is ALWAYS: Products minus Reactants!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Using Products minus Reactants for bond enthalpies. Bond enthalpy calculation requires breaking bonds (reactants, +ve) minus forming bonds (products, -ve)."
        ]
      },
      "formulas": [
        {
          "label": "Hess’s Law & Bond Enthalpy Formulations",
          "formula": "\\Delta_r H^\\circ = \\sum \\Delta_f H^\\circ(\\text{products}) - \\sum \\Delta_f H^\\circ(\\text{reactants}) = \\sum \\text{B.E.}(\\text{reactants}) - \\sum \\text{B.E.}(\\text{products})",
          "description": "Standard reaction enthalpy via formation enthalpies and covalent bond dissociation energies.",
          "variables": [
            {
              "symbol": "\\Delta_r H^\\circ",
              "meaning": "Standard Reaction Enthalpy",
              "unit": "kJ/mol"
            },
            {
              "symbol": "\\text{B.E.}",
              "meaning": "Bond Enthalpy",
              "unit": "kJ/mol"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-05-02",
          "title": "Hess’s Law & Enthalpy of Reactions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Hess’s Law & Enthalpy of Reactions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-05-02",
          "title": "Hess’s Law & Enthalpy of Reactions",
          "summary": "Standard enthalpy changes, Hess's law of constant heat summation, standard enthalpy of formation Delta_f H°, combustion, bond dissociation enthalpy."
        }
      ]
    },
    {
      "id": "top-chem-11-05-03",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-11-05-T03",
      "title": "Entropy, Gibbs Free Energy & Spontaneity",
      "description": "Second law of thermodynamics, entropy Delta S = q_rev / T, Gibbs free energy Delta G = Delta H - T Delta S, spontaneity criteria, and relationship with equilibrium constant Delta G° = -RT ln K.",
      "sequenceOrder": 3,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Entropy measures microscopic molecular disorder. The Second Law states that the entropy of the universe increases in any spontaneous process. Gibbs free energy provides the universal thermodynamic criterion for reaction spontaneity at constant temperature and pressure.",
        "sections": [
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
            "examTips": [
              "To find the threshold temperature where a non-spontaneous reaction becomes spontaneous, set Delta G = 0 -> T_eq = Delta H / Delta S."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming Delta G° = 0 at equilibrium. At equilibrium, Delta G = 0. Delta G° is related to equilibrium constant by Delta G° = -RT ln K."
        ]
      },
      "formulas": [
        {
          "label": "Gibbs-Helmholtz Spontaneity Equation",
          "formula": "\\Delta G = \\Delta H - T \\Delta S, \\quad \\Delta G^\\circ = -R T \\ln K = -2.303 R T \\log_{10} K",
          "description": "Fundamental thermodynamic criterion for spontaneity and link to equilibrium constant.",
          "variables": [
            {
              "symbol": "\\Delta G",
              "meaning": "Gibbs Free Energy Change",
              "unit": "kJ/mol"
            },
            {
              "symbol": "\\Delta H",
              "meaning": "Enthalpy Change",
              "unit": "kJ/mol"
            },
            {
              "symbol": "T",
              "meaning": "Absolute Temperature",
              "unit": "K"
            },
            {
              "symbol": "\\Delta S",
              "meaning": "Entropy Change",
              "unit": "J/(mol K)"
            },
            {
              "symbol": "K",
              "meaning": "Equilibrium Constant",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-05-03",
          "title": "Entropy, Gibbs Free Energy & Spontaneity Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Entropy, Gibbs Free Energy & Spontaneity.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-05-03",
          "title": "Entropy, Gibbs Free Energy & Spontaneity",
          "summary": "Second law of thermodynamics, entropy Delta S = q_rev / T, Gibbs free energy Delta G = Delta H - T Delta S, spontaneity criteria, and relationship with equilibrium constant Delta G° = -RT ln K."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000006": [
    {
      "id": "top-chem-11-06-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "CHEM-11-06-T01",
      "title": "Law of Chemical Equilibrium & Le Chatelier’s Principle",
      "description": "Dynamic equilibrium, equilibrium constants Kc and Kp, Kp = Kc (RT)^Delta n_g, reaction quotient Q, and Le Chatelier's response to concentration, pressure, temperature, and inert gas additions.",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Chemical equilibrium is dynamic: forward and reverse reaction rates are equal. Le Chatelier's principle predicts how an equilibrium system shifts to counteract applied external stresses.",
        "sections": [
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
            "examTips": [
              "Temperature is the ONLY factor that alters the numerical value of the equilibrium constant K!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing addition of inert gas at constant volume shifts equilibrium. At constant volume, partial pressures of reacting gases do not change, so equilibrium is unaffected."
        ]
      },
      "formulas": [
        {
          "label": "Equilibrium Constant Relations",
          "formula": "K_p = K_c (R T)^{\\Delta n_g}, \\quad \\ln\\left(\\frac{K_2}{K_1}\\right) = \\frac{\\Delta H^\\circ}{R} \\left( \\frac{1}{T_1} - \\frac{1}{T_2} \\right)",
          "description": "Relationship between Kp and Kc, and van 't Hoff temperature dependence of equilibrium constant.",
          "variables": [
            {
              "symbol": "K_p",
              "meaning": "Partial Pressure Constant",
              "unit": "-"
            },
            {
              "symbol": "K_c",
              "meaning": "Molar Concentration Constant",
              "unit": "-"
            },
            {
              "symbol": "\\Delta n_g",
              "meaning": "Gaseous Mole Difference",
              "unit": "mol"
            },
            {
              "symbol": "\\Delta H^\\circ",
              "meaning": "Standard Reaction Enthalpy",
              "unit": "J/mol"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-06-01",
          "title": "Law of Chemical Equilibrium & Le Chatelier’s Principle Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Law of Chemical Equilibrium & Le Chatelier’s Principle.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-06-01",
          "title": "Law of Chemical Equilibrium & Le Chatelier’s Principle",
          "summary": "Dynamic equilibrium, equilibrium constants Kc and Kp, Kp = Kc (RT)^Delta n_g, reaction quotient Q, and Le Chatelier's response to concentration, pressure, temperature, and inert gas additions."
        }
      ]
    },
    {
      "id": "top-chem-11-06-02",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "CHEM-11-06-T02",
      "title": "Ionic Equilibrium: pH, Buffers & Solubility Product",
      "description": "Arrhenius, Brönsted-Lowry and Lewis acid-base theories, autoionization of water Kw = 1.0 x 10^-14, pH scale, Henderson-Hasselbalch buffer equation, and solubility product Ksp.",
      "sequenceOrder": 2,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Ionic equilibrium involves weak electrolytes, dissociation constants, hydronium concentration pH, common ion effect, buffer systems resisting pH changes, and sparingly soluble salt precipitation.",
        "sections": [
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
            "examTips": [
              "For 10^-8 M HCl solution, pH is NOT 8 (an acid cannot be alkaline!). You must include water autoionization: [H+]_total = 10^-8 + 10^-7 = 1.05 x 10^-7 M -> pH approx 6.98."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming K_w is always 10^-14. At higher temperatures (e.g. 60 °C), autoionization of water increases (Kw ~ 10^-13), so neutral pH drops below 7."
        ]
      },
      "formulas": [
        {
          "label": "Henderson-Hasselbalch & Solubility Product",
          "formula": "\\text{pH} = pK_a + \\log_{10}\\left( \\frac{[\\text{Conjugate Base}]}{[\\text{Acid}]} \\right), \\quad K_{sp} = x^x y^y S^{x+y}",
          "description": "Buffer pH calculation and relationship between solubility S and solubility product Ksp.",
          "variables": [
            {
              "symbol": "\\text{pH}",
              "meaning": "Hydronium Exponent",
              "unit": "-"
            },
            {
              "symbol": "pK_a",
              "meaning": "Acid Dissociation Index",
              "unit": "-"
            },
            {
              "symbol": "K_{sp}",
              "meaning": "Solubility Product Constant",
              "unit": "-"
            },
            {
              "symbol": "S",
              "meaning": "Molar Solubility",
              "unit": "mol/L"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-06-02",
          "title": "Ionic Equilibrium: pH, Buffers & Solubility Product Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Ionic Equilibrium: pH, Buffers & Solubility Product.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-06-02",
          "title": "Ionic Equilibrium: pH, Buffers & Solubility Product",
          "summary": "Arrhenius, Brönsted-Lowry and Lewis acid-base theories, autoionization of water Kw = 1.0 x 10^-14, pH scale, Henderson-Hasselbalch buffer equation, and solubility product Ksp."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000007": [
    {
      "id": "top-chem-11-07-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "CHEM-11-07-T01",
      "title": "Oxidation States & Balancing Redox Reactions",
      "description": "Classical and electron transfer concepts of oxidation/reduction, rules for calculating oxidation numbers, disproportionation reactions, ion-electron and oxidation number balancing methods.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Redox reactions involve simultaneous reduction (gain of electrons, decrease in oxidation state) and oxidation (loss of electrons, increase in oxidation state).",
        "sections": [
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
            "examTips": [
              "Identify peroxy bonds in H2SO5 (Caro's acid), H2S2O8 (Marshall's acid), and CrO5 (butterfly structure, Cr is +6 with two peroxy groups)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assigning fractional or anomalous oxidation numbers mechanically without inspecting molecular structure. Structure reveals true formal oxidation states."
        ]
      },
      "formulas": [
        {
          "label": "Redox Half-Reaction Balance",
          "formula": "\\text{Oxidant} + n e^- \\longrightarrow \\text{Reduced Form}, \\quad \\Delta(\\text{Oxidation Number}) = n e^-",
          "description": "Conservation of charge and electron transfer in redox half-reactions.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Number of Transferred Electrons",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-07-01",
          "title": "Oxidation States & Balancing Redox Reactions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Oxidation States & Balancing Redox Reactions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-07-01",
          "title": "Oxidation States & Balancing Redox Reactions",
          "summary": "Classical and electron transfer concepts of oxidation/reduction, rules for calculating oxidation numbers, disproportionation reactions, ion-electron and oxidation number balancing methods."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000008": [
    {
      "id": "top-chem-11-08-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "CHEM-11-08-T01",
      "title": "IUPAC Nomenclature & Electronic Effects in Organic Molecules",
      "description": "IUPAC rules for aliphatic and functionalized aromatic compounds, inductive effect (+I, -I), electromeric effect, resonance/mesomeric effect (+M, -M), and hyperconjugation.",
      "sequenceOrder": 1,
      "weightagePercent": 8.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Organic chemistry fundamentals govern molecular stability and reaction mechanisms through permanent and temporary electronic displacement effects.",
        "sections": [
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
            "examTips": [
              "Count alpha-hydrogens to immediately evaluate relative alkene heat of hydrogenation and carbocation stability: more alpha-H means higher stability!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing resonance structures physically flip back and forth. Resonance structures are imaginary canonical forms; the true molecule is a stable hybrid."
        ]
      },
      "formulas": [
        {
          "label": "Hyperconjugation Stability Rule",
          "formula": "\\text{Stability} \\propto \\text{Number of } \\alpha\\text{-Hydrogens} \\quad (3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+)",
          "description": "Direct relationship between alpha-C-H bonds and hyperconjugative carbocation/alkene stability.",
          "variables": [
            {
              "symbol": "\\alpha\\text{-H}",
              "meaning": "Alpha Hydrogen Count",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-08-01",
          "title": "IUPAC Nomenclature & Electronic Effects in Organic Molecules Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for IUPAC Nomenclature & Electronic Effects in Organic Molecules.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-08-01",
          "title": "IUPAC Nomenclature & Electronic Effects in Organic Molecules",
          "summary": "IUPAC rules for aliphatic and functionalized aromatic compounds, inductive effect (+I, -I), electromeric effect, resonance/mesomeric effect (+M, -M), and hyperconjugation."
        }
      ]
    }
  ],
  "c0000021-0000-0000-0000-000000000009": [
    {
      "id": "top-chem-11-09-01",
      "subjectId": "chemistry",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000021-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "CHEM-11-09-T01",
      "title": "Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution",
      "description": "Conformations of ethane (Newman projections), Markovnikov and anti-Markovnikov addition to alkenes, ozonolysis, acidity of terminal alkynes, aromaticity (Hückel's 4n+2 rule), and electrophilic substitution mechanism.",
      "sequenceOrder": 1,
      "weightagePercent": 8.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Hydrocarbons are the foundational organic compounds. Alkenes undergo electrophilic addition, terminal alkynes exhibit acidic protons, and aromatic hydrocarbons undergo electrophilic aromatic substitution while preserving ring aromaticity.",
        "sections": [
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
            "examTips": [
              "In ozonolysis problems, simply break the C=C double bond and cap both open ends with =O oxygen atoms to deduce reactant structures!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying peroxide anti-Markovnikov effect to HCl or HI. Bond strength of HCl is too high, and iodine radicals dimerize to I2 rather than adding to alkenes."
        ]
      },
      "formulas": [
        {
          "label": "Hückel’s Rule for Aromaticity",
          "formula": "\\text{Total } \\pi\\text{-electrons} = 4n + 2 \\quad (n = 0, 1, 2, 3...)",
          "description": "Criterion for aromatic stabilization in planar cyclic conjugated polyenes.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Non-negative Integer",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-11-09-01",
          "title": "Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-11-09-01",
          "title": "Alkanes, Alkenes, Alkynes & Aromatic Electrophilic Substitution",
          "summary": "Conformations of ethane (Newman projections), Markovnikov and anti-Markovnikov addition to alkenes, ozonolysis, acidity of terminal alkynes, aromaticity (Hückel's 4n+2 rule), and electrophilic substitution mechanism."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000001": [
    {
      "id": "top-chem-12-01-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "CHEM-12-01-T01",
      "title": "Raoult’s Law, Colligative Properties & Van ’t Hoff Factor",
      "description": "Henry’s law p = K_H x, Raoult’s law p_A = p_A° x_A, ideal vs non-ideal solutions, elevation of boiling point Delta T_b = i K_b m, depression of freezing point Delta T_f = i K_f m, osmotic pressure Pi = i C R T, and abnormal molar mass.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Colligative properties depend solely on the number of solute particles in solution relative to solvent molecules, irrespective of chemical identity. Dissociation or association alters particle counts, quantified by the van 't Hoff factor i.",
        "sections": [
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
            "examTips": [
              "For strong electrolytes like CaCl2, assume complete dissociation (alpha = 1) unless given otherwise: CaCl2 -> Ca2+ + 2 Cl-, so n = 3 and i = 3."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming molar mass calculated from colligative properties is always normal. Electrolytes dissociate giving smaller molar masses, while carboxylic acids dimerize giving doubled molar masses."
        ]
      },
      "formulas": [
        {
          "label": "Colligative Property Equations",
          "formula": "\\frac{p_1^\\circ - p_1}{p_1^\\circ} = i \\, x_2, \\quad \\Delta T_b = i \\, K_b \\, m, \\quad \\Delta T_f = i \\, K_f \\, m, \\quad \\Pi = i \\, C R T",
          "description": "Standard formulas for four colligative properties incorporating van 't Hoff factor.",
          "variables": [
            {
              "symbol": "K_b",
              "meaning": "Molal Boiling Elevation Constant (Ebullioscopic)",
              "unit": "K kg/mol"
            },
            {
              "symbol": "K_f",
              "meaning": "Molal Freezing Depression Constant (Cryoscopic)",
              "unit": "K kg/mol"
            },
            {
              "symbol": "\\Pi",
              "meaning": "Osmotic Pressure",
              "unit": "atm"
            },
            {
              "symbol": "i",
              "meaning": "Van ’t Hoff Factor",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Van ’t Hoff Dissociation & Association Degree",
          "formula": "\\alpha_{\\text{diss}} = \\frac{i - 1}{n - 1}, \\quad \\alpha_{\\text{assoc}} = \\frac{1 - i}{1 - 1/n}",
          "description": "Determines degree of ionization or dimerization from van 't Hoff factor.",
          "variables": [
            {
              "symbol": "\\alpha",
              "meaning": "Degree of Dissociation/Association",
              "unit": "-"
            },
            {
              "symbol": "n",
              "meaning": "Number of Ions/Molecules per Unit",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-01-01",
          "title": "Raoult’s Law, Colligative Properties & Van ’t Hoff Factor Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Raoult’s Law, Colligative Properties & Van ’t Hoff Factor.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-01-01",
          "title": "Raoult’s Law, Colligative Properties & Van ’t Hoff Factor",
          "summary": "Henry’s law p = K_H x, Raoult’s law p_A = p_A° x_A, ideal vs non-ideal solutions, elevation of boiling point Delta T_b = i K_b m, depression of freezing point Delta T_f = i K_f m, osmotic pressure Pi = i C R T, and abnormal molar mass."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000002": [
    {
      "id": "top-chem-12-02-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "CHEM-12-02-T01",
      "title": "Galvanic Cells, Nernst Equation & Kohlrausch’s Law",
      "description": "Electrochemical cell, standard electrode potential E°, Nernst equation E_cell = E°_cell - (0.0591/n) log Q, Gibbs energy Delta G° = -n F E°, electrolytic conductance, molar conductivity Lambda_m, Kohlrausch law, and Faraday's laws of electrolysis.",
      "sequenceOrder": 1,
      "weightagePercent": 7.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Electrochemistry bridges chemical energy and electrical energy. Galvanic cells produce electricity via spontaneous redox reactions, while electrolytic cells drive non-spontaneous reactions via electrical current.",
        "sections": [
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
            "examTips": [
              "In lead-acid storage batteries, during discharging Pb(s) at anode and PbO2(s) at cathode both convert to PbSO4(s), consuming H2SO4 (electrolyte density drops)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming electrode potential E° is an extensive property. E° is an INTENSIVE property independent of stoichiometric coefficients (multiplying a half-cell by 2 does NOT change E°)."
        ]
      },
      "formulas": [
        {
          "label": "Nernst Equation at 298 K",
          "formula": "E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10} Q, \\quad \\Delta G^\\circ = -n F E^\\circ_{\\text{cell}}",
          "description": "Calculates non-standard electromotive force and standard free energy from cell potential.",
          "variables": [
            {
              "symbol": "E_{\\text{cell}}",
              "meaning": "Cell Electromotive Force",
              "unit": "V"
            },
            {
              "symbol": "E^\\circ_{\\text{cell}}",
              "meaning": "Standard Cell Potential",
              "unit": "V"
            },
            {
              "symbol": "n",
              "meaning": "Transferred Electrons",
              "unit": "-"
            },
            {
              "symbol": "F",
              "meaning": "Faraday Constant",
              "unit": "96485 \\text{ C/mol}"
            }
          ]
        },
        {
          "label": "Kohlrausch’s Law & Faraday’s Electrolysis",
          "formula": "\\Lambda_m^\\circ = \\nu_+ \\lambda_+^\\circ + \\nu_- \\lambda_-^\\circ, \\quad m = \\frac{M \\, I \\, t}{n F}",
          "description": "Limiting ion conductivity sum and electrodeposition mass formula.",
          "variables": [
            {
              "symbol": "\\Lambda_m^\\circ",
              "meaning": "Limiting Molar Conductivity",
              "unit": "S cm²/mol"
            },
            {
              "symbol": "m",
              "meaning": "Mass Deposited",
              "unit": "g"
            },
            {
              "symbol": "I",
              "meaning": "Current",
              "unit": "A"
            },
            {
              "symbol": "t",
              "meaning": "Time Duration",
              "unit": "s"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-02-01",
          "title": "Galvanic Cells, Nernst Equation & Kohlrausch’s Law Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Galvanic Cells, Nernst Equation & Kohlrausch’s Law.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-02-01",
          "title": "Galvanic Cells, Nernst Equation & Kohlrausch’s Law",
          "summary": "Electrochemical cell, standard electrode potential E°, Nernst equation E_cell = E°_cell - (0.0591/n) log Q, Gibbs energy Delta G° = -n F E°, electrolytic conductance, molar conductivity Lambda_m, Kohlrausch law, and Faraday's laws of electrolysis."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000007": [
    {
      "id": "top-chem-12-03-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "CHEM-12-03-T01",
      "title": "Rate Laws, Reaction Order & Arrhenius Equation",
      "description": "Rate of reaction, rate law Rate = k [A]^x [B]^y, order versus molecularity, integrated rate equations for zero-order and first-order reactions, half-life t_1/2, Arrhenius activation energy k = A e^(-Ea/RT).",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Chemical kinetics investigates reaction rates, mechanisms, and temperature dependencies. The order of reaction is an experimental quantity, whereas molecularity is a theoretical count of reacting particles in an elementary step.",
        "sections": [
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
            "examTips": [
              "To find overall reaction order, examine the units of rate constant k: s^-1 = 1st order; L/(mol s) = 2nd order; mol/(L s) = zero order."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing reaction order with molecularity. Order is determined strictly experimentally; molecularity has meaning only for simple elementary steps."
        ]
      },
      "formulas": [
        {
          "label": "Integrated Rate Equations (Zero & First Order)",
          "formula": "k_{\\text{zero}} = \\frac{[A]_0 - [A]}{t} \\; (t_{1/2} = \\frac{[A]_0}{2k}), \\quad k_{\\text{first}} = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]}\\right) \\; (t_{1/2} = \\frac{0.693}{k})",
          "description": "Concentration decay formulas and characteristic half-lives.",
          "variables": [
            {
              "symbol": "[A]_0",
              "meaning": "Initial Concentration",
              "unit": "mol/L"
            },
            {
              "symbol": "[A]",
              "meaning": "Concentration at Time t",
              "unit": "mol/L"
            },
            {
              "symbol": "k",
              "meaning": "Rate Constant",
              "unit": "s^{-1} \\text{ or mol/(L s)}"
            },
            {
              "symbol": "t_{1/2}",
              "meaning": "Half-Life Period",
              "unit": "s"
            }
          ]
        },
        {
          "label": "Arrhenius Activation Energy Formula",
          "formula": "\\log_{10}\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R} \\left( \\frac{T_2 - T_1}{T_1 T_2} \\right)",
          "description": "Temperature sensitivity of reaction rate constant based on activation energy.",
          "variables": [
            {
              "symbol": "E_a",
              "meaning": "Activation Energy",
              "unit": "J/mol"
            },
            {
              "symbol": "R",
              "meaning": "Gas Constant",
              "unit": "8.314 \\text{ J/(mol K)}"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-03-01",
          "title": "Rate Laws, Reaction Order & Arrhenius Equation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Rate Laws, Reaction Order & Arrhenius Equation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-03-01",
          "title": "Rate Laws, Reaction Order & Arrhenius Equation",
          "summary": "Rate of reaction, rate law Rate = k [A]^x [B]^y, order versus molecularity, integrated rate equations for zero-order and first-order reactions, half-life t_1/2, Arrhenius activation energy k = A e^(-Ea/RT)."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000004": [
    {
      "id": "top-chem-12-04-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "CHEM-12-04-T01",
      "title": "Transition Elements, Lanthanoid Contraction & KMnO4/K2Cr2O7",
      "description": "General properties of 3d series: variable oxidation states, catalytic behavior, coloured ions, magnetic moments mu = sqrt(n(n+2)) BM, lanthanoid contraction, and preparation/oxidizing properties of K2Cr2O7 and KMnO4.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Transition elements possess partially filled d-orbitals in atomic or common oxidation states. Lanthanoids feature 4f subshell filling where poor 4f shielding induces the profound lanthanoid contraction.",
        "sections": [
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
            "examTips": [
              "Chromate (CrO4^(2-), yellow) and dichromate (Cr2O7^(2-), orange) interconvert with pH: in acidic medium dichromate dominates; in basic medium chromate dominates!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing Scandium is not a transition element. Sc has a partially filled 3d subshell in ground state (3d1 4s2), fulfilling the transition element definition."
        ]
      },
      "formulas": [
        {
          "label": "Spin-Only Magnetic Moment",
          "formula": "\\mu_s = \\sqrt{n(n + 2)} \\text{ BM} \\quad (1 \\text{ BM} = \\frac{e h}{4\\pi m})",
          "description": "Calculates magnetic moment from count of unpaired electrons n.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Unpaired Electrons Count",
              "unit": "-"
            },
            {
              "symbol": "\\mu_s",
              "meaning": "Magnetic Moment",
              "unit": "BM"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-04-01",
          "title": "Transition Elements, Lanthanoid Contraction & KMnO4/K2Cr2O7 Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Transition Elements, Lanthanoid Contraction & KMnO4/K2Cr2O7.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-04-01",
          "title": "Transition Elements, Lanthanoid Contraction & KMnO4/K2Cr2O7",
          "summary": "General properties of 3d series: variable oxidation states, catalytic behavior, coloured ions, magnetic moments mu = sqrt(n(n+2)) BM, lanthanoid contraction, and preparation/oxidizing properties of K2Cr2O7 and KMnO4."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000005": [
    {
      "id": "top-chem-12-05-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "CHEM-12-05-T01",
      "title": "Coordination Nomenclature, Crystal Field Theory & Isomerism",
      "description": "Werner’s theory, IUPAC nomenclature of complexes, structural and stereoisomerism, Valence Bond Theory, and Crystal Field Theory (CFT) octahedral/tetrahedral d-orbital splitting Delta_o.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Coordination compounds contain central transition metal ions bonded to coordinate covalent ligands. Crystal Field Theory explains splitting of degenerate d-orbitals by electrostatic ligand fields, dictating color and magnetic properties.",
        "sections": [
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
            "examTips": [
              "[Ni(CO)4] is tetrahedral and diamagnetic (sp3), while [Ni(CN)4]^(2-) is square planar and diamagnetic (dsp2). Know these two benchmark JEE/NEET cases!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming [Ti(H2O)6]3+ is colorless. It is purple because single 3d electron undergoes d-d transition from t2g to eg by absorbing green-yellow light."
        ]
      },
      "formulas": [
        {
          "label": "Crystal Field Stabilization Energy (CFSE)",
          "formula": "\\text{CFSE}_{\\text{oct}} = [-0.4 \\, n_{t_{2g}} + 0.6 \\, n_{e_g}] \\Delta_o + m P",
          "description": "Calculates thermodynamic stabilization of d-electron configurations in octahedral fields.",
          "variables": [
            {
              "symbol": "\\Delta_o",
              "meaning": "Octahedral Crystal Field Splitting",
              "unit": "cm^{-1}"
            },
            {
              "symbol": "P",
              "meaning": "Electron Pairing Energy",
              "unit": "cm^{-1}"
            },
            {
              "symbol": "n_{t_{2g}}, n_{e_g}",
              "meaning": "Electrons in t2g and eg",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-05-01",
          "title": "Coordination Nomenclature, Crystal Field Theory & Isomerism Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Coordination Nomenclature, Crystal Field Theory & Isomerism.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-05-01",
          "title": "Coordination Nomenclature, Crystal Field Theory & Isomerism",
          "summary": "Werner’s theory, IUPAC nomenclature of complexes, structural and stereoisomerism, Valence Bond Theory, and Crystal Field Theory (CFT) octahedral/tetrahedral d-orbital splitting Delta_o."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000006": [
    {
      "id": "top-chem-12-06-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "CHEM-12-06-T01",
      "title": "SN1 & SN2 Mechanisms & Haloarene Reactivity",
      "description": "Nucleophilic substitution mechanisms: SN2 (bimolecular, concerted, Walden inversion) vs SN1 (unimolecular, carbocation intermediate, racemization), and low reactivity of chlorobenzene toward nucleophilic substitution.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Alkyl halides undergo nucleophilic substitution and elimination reactions. The mechanism is controlled by substrate steric hindrance, nucleophile strength, solvent polarity, and leaving group stability.",
        "sections": [
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
            "examTips": [
              "Allylic and benzylic halides show exceptionally high reactivity in BOTH SN1 (resonance-stabilized carbocations) and SN2 reactions!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming haloarenes cannot undergo nucleophilic substitution. Under harsh conditions (Dow's process: NaOH, 623 K, 300 atm) or with ortho/para -NO2 groups, substitution occurs readily."
        ]
      },
      "formulas": [
        {
          "label": "SN1 vs SN2 Rate Laws",
          "formula": "\\text{Rate}_{SN2} = k [\\text{R-X}] [\\text{Nu}^-], \\quad \\text{Rate}_{SN1} = k [\\text{R-X}]",
          "description": "Bimolecular second-order versus unimolecular first-order substitution rate kinetics.",
          "variables": [
            {
              "symbol": "[\\text{R-X}]",
              "meaning": "Substrate Concentration",
              "unit": "mol/L"
            },
            {
              "symbol": "[\\text{Nu}^-]",
              "meaning": "Nucleophile Concentration",
              "unit": "mol/L"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-06-01",
          "title": "SN1 & SN2 Mechanisms & Haloarene Reactivity Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for SN1 & SN2 Mechanisms & Haloarene Reactivity.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-06-01",
          "title": "SN1 & SN2 Mechanisms & Haloarene Reactivity",
          "summary": "Nucleophilic substitution mechanisms: SN2 (bimolecular, concerted, Walden inversion) vs SN1 (unimolecular, carbocation intermediate, racemization), and low reactivity of chlorobenzene toward nucleophilic substitution."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000007": [
    {
      "id": "top-chem-12-07-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "CHEM-12-07-T01",
      "title": "Alcohols, Phenols & Williamson Ether Synthesis",
      "description": "Preparation of alcohols, Lucas test (distinguishing 1°, 2°, 3° alcohols), acidity of phenols (resonance stabilization of phenoxide), Reimer-Tiemann and Kolbe reactions, and Williamson ether synthesis mechanism.",
      "sequenceOrder": 1,
      "weightagePercent": 6.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Alcohols and phenols feature hydroxyl (-OH) groups. Phenols are substantially more acidic than alcohols due to resonance stabilization of the phenoxide ion. Ethers are synthesized primarily via Williamson's SN2 substitution.",
        "sections": [
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
            "examTips": [
              "Hydroboration-oxidation of alkenes (B2H6 followed by H2O2/OH-) yields anti-Markovnikov alcohol without any carbocation rearrangement!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Using 3° alkyl halide with sodium methoxide to synthesize tert-butyl methyl ether. 3° halide undergoes 100% elimination giving isobutylene alkene; use sodium tert-butoxide + CH3I instead."
        ]
      },
      "formulas": [
        {
          "label": "Williamson SN2 Synthesis",
          "formula": "R-\\text{CH}_2-\\text{X} + R'-\\text{O}^- \\text{Na}^+ \\longrightarrow R-\\text{CH}_2-\\text{O}-R' + \\text{NaX}",
          "description": "Bimolecular substitution between primary alkyl halide and alkoxide ion.",
          "variables": [
            {
              "symbol": "R-\\text{CH}_2-\\text{X}",
              "meaning": "Primary Alkyl Halide",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-07-01",
          "title": "Alcohols, Phenols & Williamson Ether Synthesis Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Alcohols, Phenols & Williamson Ether Synthesis.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-07-01",
          "title": "Alcohols, Phenols & Williamson Ether Synthesis",
          "summary": "Preparation of alcohols, Lucas test (distinguishing 1°, 2°, 3° alcohols), acidity of phenols (resonance stabilization of phenoxide), Reimer-Tiemann and Kolbe reactions, and Williamson ether synthesis mechanism."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000008": [
    {
      "id": "top-chem-12-08-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "CHEM-12-08-T01",
      "title": "Carbonyl Nucleophilic Addition, Aldol Condensation & Cannizzaro",
      "description": "Structure of carbonyl group, nucleophilic addition of HCN, NaHSO3, Grignard reagents, Aldol and cross-Aldol condensation, Cannizzaro reaction, Tollens' and Fehling's tests, and acidity of carboxylic acids.",
      "sequenceOrder": 1,
      "weightagePercent": 8.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The polarized carbonyl group (C=O) undergoes nucleophilic addition. Alpha-hydrogens in aldehydes and ketones are acidic due to resonance stabilization of the resulting enolate ion, driving Aldol condensations.",
        "sections": [
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
            "examTips": [
              "Hell-Volhard-Zelinsky (HVZ) reaction: Carboxylic acids with alpha-hydrogen react with X2 / red P to selectively substitute alpha-hydrogen with halogen."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing benzaldehyde undergoes Aldol condensation. Benzaldehyde lacks alpha-hydrogens, so with base alone it undergoes Cannizzaro; with an aldehyde having alpha-H it undergoes cross-Aldol."
        ]
      },
      "formulas": [
        {
          "label": "Aldol Dehydration Product",
          "formula": "2 \\, R-\\text{CH}_2-\\text{CHO} \\xrightarrow{\\text{dil. NaOH}} R-\\text{CH}_2-\\text{CH(OH)}-\\text{CH}(R)-\\text{CHO} \\xrightarrow{\\Delta} R-\\text{CH}_2-\\text{CH}=\\text{C}(R)-\\text{CHO} + \\text{H}_2\\text{O}",
          "description": "Base-catalyzed dimerization and dehydration forming alpha,beta-unsaturated aldehyde.",
          "variables": [
            {
              "symbol": "R",
              "meaning": "Alkyl Substituent",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-08-01",
          "title": "Carbonyl Nucleophilic Addition, Aldol Condensation & Cannizzaro Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Carbonyl Nucleophilic Addition, Aldol Condensation & Cannizzaro.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-08-01",
          "title": "Carbonyl Nucleophilic Addition, Aldol Condensation & Cannizzaro",
          "summary": "Structure of carbonyl group, nucleophilic addition of HCN, NaHSO3, Grignard reagents, Aldol and cross-Aldol condensation, Cannizzaro reaction, Tollens' and Fehling's tests, and acidity of carboxylic acids."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000009": [
    {
      "id": "top-chem-12-09-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "CHEM-12-09-T01",
      "title": "Basicity of Amines, Hoffmann Degradation & Diazonium Salts",
      "description": "Classification (1°, 2°, 3°), Gabriel phthalimide synthesis, Hoffmann bromamide degradation, basicity trends in gas phase vs aqueous solution, Carbylamine test, Hinsberg test, and synthetic versatility of arenediazonium salts.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Amines are basic organic derivatives of ammonia. Basicity in aqueous solution is an interplay between inductive effect, steric hindrance, and hydration of the substituted ammonium cation. Diazonium salts are vital synthetic intermediates.",
        "sections": [
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
            "examTips": [
              "Hoffmann degradation is the most important reaction for 'stepping down' an organic carbon chain (reducing carbon count by 1)!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing tertiary amines are the most basic in water. In water, tertiary amines are weakly hydrated due to steric crowding, making secondary amines the most basic."
        ]
      },
      "formulas": [
        {
          "label": "Hoffmann Bromamide Chain Reduction",
          "formula": "R-\\text{CONH}_2 + \\text{Br}_2 + 4\\text{NaOH} \\longrightarrow R-\\text{NH}_2 + \\text{Na}_2\\text{CO}_3 + 2\\text{NaBr} + 2\\text{H}_2\\text{O}",
          "description": "Decarbonylative conversion of amide into primary amine with loss of one carbon.",
          "variables": [
            {
              "symbol": "R-\\text{CONH}_2",
              "meaning": "Aliphatic/Aromatic Amide",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-09-01",
          "title": "Basicity of Amines, Hoffmann Degradation & Diazonium Salts Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Basicity of Amines, Hoffmann Degradation & Diazonium Salts.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-09-01",
          "title": "Basicity of Amines, Hoffmann Degradation & Diazonium Salts",
          "summary": "Classification (1°, 2°, 3°), Gabriel phthalimide synthesis, Hoffmann bromamide degradation, basicity trends in gas phase vs aqueous solution, Carbylamine test, Hinsberg test, and synthetic versatility of arenediazonium salts."
        }
      ]
    }
  ],
  "c0000022-0000-0000-0000-000000000010": [
    {
      "id": "top-chem-12-10-01",
      "subjectId": "chemistry",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000022-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "CHEM-12-10-T01",
      "title": "Carbohydrates, Proteins, Nucleic Acids & Enzyme Kinetics",
      "description": "Monosaccharides (D-glucose open and cyclic Haworth structures, mutarotation), glycosidic linkage, amino acids (zwitterion, isoelectric point), peptide bond, protein structural hierarchy, DNA double helix (Watson-Crick), and RNA.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Biomolecules are organic molecules sustaining life processes. Carbohydrates store chemical energy, proteins provide enzymatic catalysis and structural scaffolds, and nucleic acids encode genetic inheritance.",
        "sections": [
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
            "examTips": [
              "Sucrose on hydrolysis undergoes 'inversion of cane sugar': dextrorotatory sucrose (+66.5°) converts to a laevorotatory mixture of D-glucose (+52.5°) and D-fructose (-92.4°) because fructose laevorotation dominates!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Thinking protein denaturation breaks covalent peptide bonds. Denaturation unfolds secondary and tertiary conformations, but the primary covalent sequence remains completely intact."
        ]
      },
      "formulas": [
        {
          "label": "Isoelectric Point of Amino Acids",
          "formula": "\\text{pI} = \\frac{pK_{a1} + pK_{a2}}{2}",
          "description": "pH at which amino acid exists purely in dipolar zwitterionic form with zero net charge.",
          "variables": [
            {
              "symbol": "\\text{pI}",
              "meaning": "Isoelectric Point",
              "unit": "-"
            },
            {
              "symbol": "pK_{a1}, pK_{a2}",
              "meaning": "Ionization Constants of Carboxylic and Amino Groups",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-chem-12-10-01",
          "title": "Carbohydrates, Proteins, Nucleic Acids & Enzyme Kinetics Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Carbohydrates, Proteins, Nucleic Acids & Enzyme Kinetics.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-chem-12-10-01",
          "title": "Carbohydrates, Proteins, Nucleic Acids & Enzyme Kinetics",
          "summary": "Monosaccharides (D-glucose open and cyclic Haworth structures, mutarotation), glycosidic linkage, amino acids (zwitterion, isoelectric point), peptide bond, protein structural hierarchy, DNA double helix (Watson-Crick), and RNA."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000008": [
    {
      "id": "top-math-11-01-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "MATH-11-01-T01",
      "title": "Set Operations, Venn Diagrams & De Morgan’s Laws",
      "description": "Representation of sets (roster and set-builder), empty set, subsets, power sets, universal sets, Venn diagrams, union, intersection, complement, and De Morgan’s laws.",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A set is a well-defined collection of distinct objects. Set theory provides foundational language for relations, functions, probability, and mathematical analysis.",
        "sections": [
          {
            "heading": "Subsets, Power Sets, and Boolean Operations",
            "paragraphs": [
              "A set A is a subset of B (A \\subseteq B) if every element in A belongs to B. Total number of subsets of a set with n elements is 2^n, and proper subsets is 2^n - 1.",
              "Power Set P(A): The collection of all subsets of set A: n(P(A)) = 2^n.",
              "Union (A \\cup B) contains all elements in A or B; Intersection (A \\cap B) contains elements present in both. If A \\cap B = \\emptyset, A and B are disjoint.",
              "De Morgan’s Laws: (A \\cup B)' = A' \\cap B' and (A \\cap B)' = A' \\cup B'."
            ],
            "keyTakeaways": [
              "Cardinality principle: n(A \\cup B) = n(A) + n(B) - n(A \\cap B).",
              "Difference of sets: A - B = A \\cap B' contains elements belonging to A but not B."
            ],
            "examTips": [
              "For three sets: n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - n(A \\cap B) - n(B \\cap C) - n(C \\cap A) + n(A \\cap B \\cap C)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing the empty set has no subsets. The empty set \\emptyset is a subset of every set, including itself: P(\\emptyset) = {\\emptyset} with 2^0 = 1 element."
        ]
      },
      "formulas": [
        {
          "label": "Inclusion-Exclusion Principle",
          "formula": "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
          "description": "Fundamental cardinality theorem for two finite intersecting sets.",
          "variables": [
            {
              "symbol": "n(A)",
              "meaning": "Cardinality of Set A",
              "unit": "-"
            },
            {
              "symbol": "n(B)",
              "meaning": "Cardinality of Set B",
              "unit": "-"
            }
          ]
        },
        {
          "label": "De Morgan’s Laws",
          "formula": "(A \\cup B)' = A' \\cap B', \\quad (A \\cap B)' = A' \\cup B'",
          "description": "Complementation duality laws in set theory.",
          "variables": [
            {
              "symbol": "A', B'",
              "meaning": "Complementary Sets",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-01-01",
          "title": "Set Operations, Venn Diagrams & De Morgan’s Laws Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Set Operations, Venn Diagrams & De Morgan’s Laws.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-01-01",
          "title": "Set Operations, Venn Diagrams & De Morgan’s Laws",
          "summary": "Representation of sets (roster and set-builder), empty set, subsets, power sets, universal sets, Venn diagrams, union, intersection, complement, and De Morgan’s laws."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000002": [
    {
      "id": "top-math-11-02-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "MATH-11-02-T01",
      "title": "Cartesian Products, Relations & Function Types",
      "description": "Cartesian product A x B, binary relations, domain, codomain, range, definition of function, polynomial, rational, modulus, signum, greatest integer functions, and algebra of functions.",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Relations associate elements of one set with another. A function is a special relation where each input in domain maps to exactly one unique output in codomain.",
        "sections": [
          {
            "heading": "Domain, Range, and Standard Function Properties",
            "paragraphs": [
              "Cartesian Product: A x B = {(a, b) : a in A, b in B}. If n(A) = p and n(B) = q, then n(A x B) = pq, and total relations from A to B is 2^(pq).",
              "Function Definition: A relation f from A to B is a function if every element in A has one and only one image in B.",
              "Modulus Function f(x) = |x|: Returns x for x >= 0, and -x for x < 0. Domain = R, Range = [0, infinity).",
              "Signum Function: sgn(x) = 1 (x > 0), 0 (x = 0), -1 (x < 0). Domain = R, Range = {-1, 0, 1}.",
              "Greatest Integer Function f(x) = [x]: Greatest integer less than or equal to x. Step discontinuous at all integer points."
            ],
            "keyTakeaways": [
              "Vertical Line Test: If any vertical line intersects a graph at more than one point, the graph is NOT a function.",
              "Domain determination: Quantities inside square roots must be >= 0; denominators cannot equal 0."
            ],
            "examTips": [
              "For finding range of rational functions like (x^2 - 1)/(x - 1), always exclude undefined points from the range (range is R - {2})."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming [x] is continuous. The floor function [x] has jump discontinuities at every single integer point x in Z."
        ]
      },
      "formulas": [
        {
          "label": "Total Relations Count",
          "formula": "N_{\\text{relations}} = 2^{n(A) \\times n(B)} = 2^{p q}",
          "description": "Total number of binary relations between finite sets of size p and q.",
          "variables": [
            {
              "symbol": "p, q",
              "meaning": "Set Cardinalities",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-02-01",
          "title": "Cartesian Products, Relations & Function Types Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Cartesian Products, Relations & Function Types.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-02-01",
          "title": "Cartesian Products, Relations & Function Types",
          "summary": "Cartesian product A x B, binary relations, domain, codomain, range, definition of function, polynomial, rational, modulus, signum, greatest integer functions, and algebra of functions."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000003": [
    {
      "id": "top-math-11-03-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "MATH-11-03-T01",
      "title": "Trigonometric Ratios, Compound Angles & Transformations",
      "description": "Radian measure, unit circle definitions, signs of trigonometric functions in quadrants (ASTC rule), compound angle formulas sin(x ± y), cos(x ± y), double and triple angle identities, product-to-sum transformations.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Trigonometric functions generalize circular arc ratios. Trigonometric identities simplify complex geometric and calculus evaluations.",
        "sections": [
          {
            "heading": "Trigonometric Identites and Quadrant Symmetries",
            "paragraphs": [
              "Radian Measure: 1 radian = 180° / pi approx 57° 16'. Arc length s = r theta.",
              "ASTC Rule: All positive in Q1, Sin positive in Q2, Tan positive in Q3, Cos positive in Q4.",
              "Compound Angle Formulas: sin(x + y) = sin x cos y + cos x sin y; cos(x + y) = cos x cos y - sin x sin y; tan(x + y) = (tan x + tan y) / (1 - tan x tan y).",
              "Double Angle Formulas: sin 2x = 2 sin x cos x; cos 2x = cos^2 x - sin^2 x = 2 cos^2 x - 1 = 1 - 2 sin^2 x; tan 2x = 2 tan x / (1 - tan^2 x)."
            ],
            "keyTakeaways": [
              "1 + cos 2x = 2 cos^2 x and 1 - cos 2x = 2 sin^2 x are the most frequently used substitutions in integral calculus.",
              "Range of a cos x + b sin x is [-sqrt(a^2 + b^2), +sqrt(a^2 + b^2)]."
            ],
            "examTips": [
              "When solving trigonometric equations, be alert to extraneous roots introduced by squaring both sides!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Writing sin(x + y) = sin x + sin y. Trigonometric operators do not distribute linearly across sums."
        ]
      },
      "formulas": [
        {
          "label": "Fundamental Compound Angle Identities",
          "formula": "\\sin(x \\pm y) = \\sin x \\cos y \\pm \\cos x \\sin y, \\quad \\cos(x \\pm y) = \\cos x \\cos y \\mp \\sin x \\sin y",
          "description": "Sum and difference angle addition theorems.",
          "variables": [
            {
              "symbol": "x, y",
              "meaning": "Angular Arguments",
              "unit": "rad"
            }
          ]
        },
        {
          "label": "Double Angle and Half-Angle Power Reduction",
          "formula": "\\cos 2x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x, \\quad \\sin^2 x = \\frac{1 - \\cos 2x}{2}",
          "description": "Double angle cosine expansions and power reduction identities.",
          "variables": [
            {
              "symbol": "x",
              "meaning": "Angle",
              "unit": "rad"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-03-01",
          "title": "Trigonometric Ratios, Compound Angles & Transformations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Trigonometric Ratios, Compound Angles & Transformations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-03-01",
          "title": "Trigonometric Ratios, Compound Angles & Transformations",
          "summary": "Radian measure, unit circle definitions, signs of trigonometric functions in quadrants (ASTC rule), compound angle formulas sin(x ± y), cos(x ± y), double and triple angle identities, product-to-sum transformations."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000004": [
    {
      "id": "top-math-11-04-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "MATH-11-04-T01",
      "title": "Algebra of Complex Numbers & Modulus-Conjugate",
      "description": "Imaginary unit i = sqrt(-1), complex numbers z = a + ib, Argand plane representation, modulus |z| = sqrt(a^2 + b^2), conjugate z_bar = a - ib, polar representation r(cos theta + i sin theta), and quadratic equations with negative discriminant.",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Complex numbers extend the real number system to solve algebraic equations lacking real roots. The Argand plane maps complex numbers as 2D geometric vectors.",
        "sections": [
          {
            "heading": "Argand Geometry and Algebraic Operations",
            "paragraphs": [
              "Imaginary unit: i^2 = -1, i^3 = -i, i^4 = 1. Sum of four consecutive powers of i is always zero: i^n + i^(n+1) + i^(n+2) + i^(n+3) = 0.",
              "Modulus & Conjugate: For z = a + ib, |z| = sqrt(a^2 + b^2) and conjugate z* = a - ib. Fundamental identity: z * z* = |z|^2.",
              "Multiplicative Inverse: z^(-1) = z* / |z|^2.",
              "Quadratic Equation with D < 0: Roots of ax^2 + bx + c = 0 are x = (-b +- i sqrt(4ac - b^2)) / (2a)."
            ],
            "keyTakeaways": [
              "Triangle Inequality: ||z1| - |z2|| <= |z1 + z2| <= |z1| + |z2|.",
              "Modulus properties: |z1 * z2| = |z1| * |z2| and |z1 / z2| = |z1| / |z2|."
            ],
            "examTips": [
              "Principal argument Arg(z) strictly lies in (-pi, pi]. Adjust quadrant signs carefully when computing theta = arctan(|b/a|)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Writing sqrt(a) * sqrt(b) = sqrt(ab) when both a and b are negative. sqrt(-a) * sqrt(-b) = i sqrt(a) * i sqrt(b) = -sqrt(ab)."
        ]
      },
      "formulas": [
        {
          "label": "Complex Modulus, Conjugate & Inverse",
          "formula": "|z| = \\sqrt{a^2 + b^2}, \\quad z \\bar{z} = |z|^2, \\quad z^{-1} = \\frac{\\bar{z}}{|z|^2}",
          "description": "Relationships connecting complex number z = a + ib with its modulus and conjugate.",
          "variables": [
            {
              "symbol": "z",
              "meaning": "Complex Number",
              "unit": "-"
            },
            {
              "symbol": "\\bar{z}",
              "meaning": "Complex Conjugate",
              "unit": "-"
            },
            {
              "symbol": "|z|",
              "meaning": "Modulus Magnitude",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-04-01",
          "title": "Algebra of Complex Numbers & Modulus-Conjugate Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Algebra of Complex Numbers & Modulus-Conjugate.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-04-01",
          "title": "Algebra of Complex Numbers & Modulus-Conjugate",
          "summary": "Imaginary unit i = sqrt(-1), complex numbers z = a + ib, Argand plane representation, modulus |z| = sqrt(a^2 + b^2), conjugate z_bar = a - ib, polar representation r(cos theta + i sin theta), and quadratic equations with negative discriminant."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000005": [
    {
      "id": "top-math-11-05-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "MATH-11-05-T01",
      "title": "Algebraic & Graphical Solutions of Linear Inequalities",
      "description": "Linear inequalities in one and two variables, algebraic rules (sign reversal on multiplying by negative numbers), representation on number line, half-plane graphical solutions.",
      "sequenceOrder": 1,
      "weightagePercent": 3.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Inequalities model boundary constraints. Multiplying or dividing both sides by a negative number inverts the inequality symbol.",
        "sections": [
          {
            "heading": "Algebraic Inequalities and Feasible Half-Planes",
            "paragraphs": [
              "Multiplication by Negative Quantity: If a < b and c < 0, then a*c > b*c (the inequality sign flips).",
              "Linear Inequality in Two Variables (ax + by <= c): Graph straight line ax + by = c (solid for <=, dashed for <). The origin (0, 0) test determines which half-plane satisfies the inequality.",
              "Solution of System of Inequalities: The common shaded region represents the intersection of all individual half-planes."
            ],
            "keyTakeaways": [
              "A solid boundary line includes equality (<=, >=); a dashed boundary line excludes equality (<, >).",
              "If the origin lies on the line itself, choose another test point like (1, 0) or (0, 1)."
            ],
            "examTips": [
              "Never cancel variable factors from both sides of an inequality unless their sign is unconditionally guaranteed!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Cross-multiplying variables across an inequality without knowing their sign. If x is negative, cross-multiplying flips the sign."
        ]
      },
      "formulas": [
        {
          "label": "Inequality Reversal Rule",
          "formula": "a < b \\iff -a > -b, \\quad x < y \\implies c x > c y \\quad (\\text{for } c < 0)",
          "description": "Directional sign inversion upon scaling by negative coefficients.",
          "variables": [
            {
              "symbol": "a, b",
              "meaning": "Real Numbers",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-05-01",
          "title": "Algebraic & Graphical Solutions of Linear Inequalities Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Algebraic & Graphical Solutions of Linear Inequalities.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-05-01",
          "title": "Algebraic & Graphical Solutions of Linear Inequalities",
          "summary": "Linear inequalities in one and two variables, algebraic rules (sign reversal on multiplying by negative numbers), representation on number line, half-plane graphical solutions."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000006": [
    {
      "id": "top-math-11-06-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "MATH-11-06-T01",
      "title": "Fundamental Counting Principles, Permutations & Combinations",
      "description": "Fundamental principle of multiplication and addition, factorial notation n!, permutations nPr = n! / (n - r)!, permutations of repeated items, combinations nCr = n! / (r! (n - r)!), and Pascal identity nCr + nCr-1 = n+1Cr.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Combinatorics analyzes finite discrete arrangements. Permutations count ordered arrangements, whereas combinations count unordered selections.",
        "sections": [
          {
            "heading": "Counting Theorems and Algebraic Combinations",
            "paragraphs": [
              "Fundamental Principle of Multiplication: If an event can occur in m ways and a second event in n ways, both in succession can occur in m * n ways.",
              "Permutations (Order Matters): Arranging r objects chosen from n distinct objects: nPr = n! / (n - r)!.",
              "Permutations with Repetition: Arranging n objects where p are identical of type 1, q of type 2: N = n! / (p! * q!).",
              "Combinations (Order Does Not Matter): Selecting r objects from n distinct objects: nCr = n! / [r! * (n - r)!].",
              "Key Identities: nCr = nC(n-r); nCr + nC(r-1) = (n+1)Cr (Pascal’s Rule); nPr = r! * nCr."
            ],
            "keyTakeaways": [
              "0! = 1 by definition (ensures consistency of nPn = n! / 0! = n!).",
              "Circular permutations: Arranging n distinct items in a circle has (n - 1)! arrangements."
            ],
            "examTips": [
              "Use 'Gap Method' when no two specific items can be adjacent; use 'String/Tie Method' when specific items must always stay together."
            ]
          }
        ],
        "commonMisconceptions": [
          "Using permutations when order is irrelevant. Handshakes, teams, and committees are combinations (nCr), while rank, codes, and seating rows are permutations (nPr)."
        ]
      },
      "formulas": [
        {
          "label": "Permutation and Combination Formulas",
          "formula": "^n P_r = \\frac{n!}{(n - r)!}, \\quad ^n C_r = \\frac{n!}{r!(n - r)!}, \\quad ^n C_r + ^n C_{r-1} = ^{n+1} C_r",
          "description": "Standard formulas for permutations, combinations, and Pascal's additive identity.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Total Objects",
              "unit": "-"
            },
            {
              "symbol": "r",
              "meaning": "Selected/Arranged Items",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-06-01",
          "title": "Fundamental Counting Principles, Permutations & Combinations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Fundamental Counting Principles, Permutations & Combinations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-06-01",
          "title": "Fundamental Counting Principles, Permutations & Combinations",
          "summary": "Fundamental principle of multiplication and addition, factorial notation n!, permutations nPr = n! / (n - r)!, permutations of repeated items, combinations nCr = n! / (r! (n - r)!), and Pascal identity nCr + nCr-1 = n+1Cr."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000007": [
    {
      "id": "top-math-11-07-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "MATH-11-07-T01",
      "title": "Binomial Theorem for Positive Integral Index",
      "description": "Binomial expansion (a + b)^n = sum(nCr a^(n-r) b^r), general term T_(r+1) = nCr a^(n-r) b^r, middle terms, properties of binomial coefficients sum(nCr) = 2^n.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The Binomial Theorem expands algebraic powers of binomials (a + b)^n into a polynomial sum with coefficients given by combinatorial selections.",
        "sections": [
          {
            "heading": "Binomial Expansion and Term Analysis",
            "paragraphs": [
              "Binomial Formula: (a + b)^n = nC0 a^n + nC1 a^(n-1) b + nC2 a^(n-2) b^2 + ... + nCn b^n.",
              "Total terms in expansion of (a + b)^n is exactly (n + 1).",
              "General Term: T_(r+1) = nCr a^(n-r) b^r. The (r+1)-th term corresponds to index r in nCr.",
              "Middle Term: If n is even, there is one middle term: T_(n/2 + 1). If n is odd, there are two middle terms: T_((n+1)/2) and T_((n+3)/2).",
              "Sum of Coefficients: Putting a = 1, b = 1 gives C0 + C1 + C2 + ... + Cn = 2^n. Sum of odd coefficients equals sum of even coefficients: 2^(n-1)."
            ],
            "keyTakeaways": [
              "Term independent of x is obtained by finding r such that the net exponent of x in T_(r+1) equals zero.",
              "Coefficients equidistant from beginning and end are equal: nCr = nC(n-r)."
            ],
            "examTips": [
              "To find the sum of all coefficients in any polynomial expansion (ax + by)^n, simply substitute x = 1 and y = 1!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing the term number with r. The 5th term has r = 4, because terms are indexed as T_(r+1)."
        ]
      },
      "formulas": [
        {
          "label": "Binomial Expansion and General Term",
          "formula": "(a + b)^n = \\sum_{r=0}^n {^n C_r} a^{n-r} b^r, \\quad T_{r+1} = {^n C_r} a^{n-r} b^r",
          "description": "Standard binomial polynomial expansion and indexed general term.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Power Index",
              "unit": "-"
            },
            {
              "symbol": "T_{r+1}",
              "meaning": "(r+1)-th Term",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-07-01",
          "title": "Binomial Theorem for Positive Integral Index Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Binomial Theorem for Positive Integral Index.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-07-01",
          "title": "Binomial Theorem for Positive Integral Index",
          "summary": "Binomial expansion (a + b)^n = sum(nCr a^(n-r) b^r), general term T_(r+1) = nCr a^(n-r) b^r, middle terms, properties of binomial coefficients sum(nCr) = 2^n."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000008": [
    {
      "id": "top-math-11-08-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "MATH-11-08-T01",
      "title": "Geometric Progression (GP) & Relationship between AM and GM",
      "description": "Geometric progression a, ar, ar^2..., nth term a_n = a r^(n-1), sum of n terms S_n = a(1 - r^n)/(1 - r), infinite GP sum S_inf = a / (1 - r) for |r| < 1, geometric mean GM = sqrt(ab), and AM >= GM inequality.",
      "sequenceOrder": 1,
      "weightagePercent": 5.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Geometric progressions maintain a constant ratio between consecutive terms. The Arithmetic Mean - Geometric Mean (AM-GM) inequality is one of the most powerful optimization tools in mathematics.",
        "sections": [
          {
            "heading": "Geometric Series and the AM-GM Inequality",
            "paragraphs": [
              "Geometric Progression: Ratio of any term to its preceding term is constant common ratio r: a_n = a * r^(n-1).",
              "Sum of n terms: S_n = a(1 - r^n) / (1 - r) for r != 1.",
              "Sum of Infinite GP: For |r| < 1, as n -> infinity, r^n -> 0, so S_infinity = a / (1 - r).",
              "Geometric Mean (GM): For positive numbers a and b, GM = sqrt(ab).",
              "AM-GM Inequality: For any non-negative real numbers, Arithmetic Mean >= Geometric Mean: (a + b) / 2 >= sqrt(ab), with equality holding if and only if a = b."
            ],
            "keyTakeaways": [
              "AM - GM = (a + b)/2 - sqrt(ab) = (sqrt(a) - sqrt(b))^2 / 2 >= 0.",
              "AM-GM inequality is the primary technique for finding minimum values of expressions like x + 1/x (for x > 0, min value is 2)."
            ],
            "examTips": [
              "Infinite GP formula converges ONLY when |r| < 1. If |r| >= 1, the infinite series diverges to infinity."
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying infinite GP sum when |r| >= 1. S_inf = a/(1 - r) is valid strictly for -1 < r < 1."
        ]
      },
      "formulas": [
        {
          "label": "Finite & Infinite Geometric Series",
          "formula": "S_n = \\frac{a(1 - r^n)}{1 - r}, \\quad S_\\infty = \\frac{a}{1 - r} \\; (|r| < 1), \\quad \\text{AM} \\ge \\text{GM} \\; \\left(\\frac{a + b}{2} \\ge \\sqrt{ab}\\right)",
          "description": "Formulas for sum of finite GP, convergent infinite GP, and AM-GM inequality.",
          "variables": [
            {
              "symbol": "a",
              "meaning": "First Term",
              "unit": "-"
            },
            {
              "symbol": "r",
              "meaning": "Common Ratio",
              "unit": "-"
            },
            {
              "symbol": "S_\\infty",
              "meaning": "Infinite Sum",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-08-01",
          "title": "Geometric Progression (GP) & Relationship between AM and GM Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Geometric Progression (GP) & Relationship between AM and GM.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-08-01",
          "title": "Geometric Progression (GP) & Relationship between AM and GM",
          "summary": "Geometric progression a, ar, ar^2..., nth term a_n = a r^(n-1), sum of n terms S_n = a(1 - r^n)/(1 - r), infinite GP sum S_inf = a / (1 - r) for |r| < 1, geometric mean GM = sqrt(ab), and AM >= GM inequality."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000009": [
    {
      "id": "top-math-11-09-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "MATH-11-09-T01",
      "title": "Forms of Straight Line Equations & Distance from Point",
      "description": "Slope m = tan theta = (y2 - y1)/(x2 - x1), angle between lines tan theta = |(m2 - m1)/(1 + m1 m2)|, parallel (m1 = m2) and perpendicular (m1 m2 = -1) lines, point-slope, slope-intercept, two-point, intercept form x/a + y/b = 1, normal form, and perpendicular distance d = |Ax0 + By0 + C| / sqrt(A^2 + B^2).",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "A straight line represents a first-degree linear polynomial in x and y. Slope characterizes inclination, and coordinate geometry formulas compute perpendicular offsets and inter-line angles.",
        "sections": [
          {
            "heading": "Standard Forms and Distance Formulas",
            "paragraphs": [
              "Slope: m = tan theta = (y2 - y1) / (x2 - x1). Two lines are parallel if m1 = m2; perpendicular if m1 * m2 = -1.",
              "Slope-Intercept Form: y = m x + c. Point-Slope Form: y - y1 = m (x - x1). Two-Point Form: (y - y1) = [(y2 - y1)/(x2 - x1)] * (x - x1).",
              "Intercept Form: x / a + y / b = 1, where a and b are x- and y-intercepts.",
              "Perpendicular Distance of Point (x0, y0) from Ax + By + C = 0: d = |A x0 + B y0 + C| / sqrt(A^2 + B^2).",
              "Distance Between Parallel Lines Ax + By + C1 = 0 and Ax + By + C2 = 0: d = |C1 - C2| / sqrt(A^2 + B^2)."
            ],
            "keyTakeaways": [
              "Lines parallel to Ax + By + C = 0 have equation Ax + By + k = 0.",
              "Lines perpendicular to Ax + By + C = 0 have equation Bx - Ay + k = 0."
            ],
            "examTips": [
              "Before applying the parallel line distance formula |C1 - C2| / sqrt(A^2 + B^2), verify that the coefficients of x and y in both equations are exactly identical!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Applying perpendicular distance formula without absolute value. Distance is a physical geometric length and must always be non-negative."
        ]
      },
      "formulas": [
        {
          "label": "Distance of Point and Parallel Lines",
          "formula": "d = \\frac{|A x_0 + B y_0 + C|}{\\sqrt{A^2 + B^2}}, \\quad d_{\\parallel} = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}",
          "description": "Perpendicular distance from a point to a line, and distance between parallel lines.",
          "variables": [
            {
              "symbol": "d",
              "meaning": "Perpendicular Distance",
              "unit": "-"
            },
            {
              "symbol": "A, B, C",
              "meaning": "Line Coefficients",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-09-01",
          "title": "Forms of Straight Line Equations & Distance from Point Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Forms of Straight Line Equations & Distance from Point.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-09-01",
          "title": "Forms of Straight Line Equations & Distance from Point",
          "summary": "Slope m = tan theta = (y2 - y1)/(x2 - x1), angle between lines tan theta = |(m2 - m1)/(1 + m1 m2)|, parallel (m1 = m2) and perpendicular (m1 m2 = -1) lines, point-slope, slope-intercept, two-point, intercept form x/a + y/b = 1, normal form, and perpendicular distance d = |Ax0 + By0 + C| / sqrt(A^2 + B^2)."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000010": [
    {
      "id": "top-math-11-10-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "MATH-11-10-T01",
      "title": "Circle, Parabola, Ellipse & Hyperbola Standard Equations",
      "description": "Conic definition locus SP = e PM, circle (x - h)^2 + (y - k)^2 = r^2, parabola y^2 = 4ax (focus (a,0), directrix x = -a, latus rectum 4a), ellipse x^2/a^2 + y^2/b^2 = 1 (eccentricity e = sqrt(1 - b^2/a^2)), hyperbola x^2/a^2 - y^2/b^2 = 1.",
      "sequenceOrder": 1,
      "weightagePercent": 7.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Conic sections are curves formed by intersecting a double cone with a plane. Eccentricity e classifies conics: circle (e = 0), parabola (e = 1), ellipse (0 < e < 1), and hyperbola (e > 1).",
        "sections": [
          {
            "heading": "Standard Conic Geometry and Geometric Properties",
            "paragraphs": [
              "Circle: Center (h, k), radius r: (x - h)^2 + (y - k)^2 = r^2. General form: x^2 + y^2 + 2gx + 2fy + c = 0 (Center = (-g, -f), radius = sqrt(g^2 + f^2 - c)).",
              "Parabola (y^2 = 4ax): Focus (a, 0), Directrix x = -a, Axis y = 0, Vertex (0, 0), Length of Latus Rectum = 4a.",
              "Ellipse (x^2 / a^2 + y^2 / b^2 = 1, a > b): Foci (+-ae, 0), Vertices (+-a, 0), Eccentricity e = sqrt(1 - b^2/a^2), Length of Latus Rectum = 2b^2 / a. Focal sum property: SP + S'P = 2a.",
              "Hyperbola (x^2 / a^2 - y^2 / b^2 = 1): Foci (+-ae, 0), Vertices (+-a, 0), Eccentricity e = sqrt(1 + b^2/a^2), Length of Latus Rectum = 2b^2 / a. Focal difference property: |SP - S'P| = 2a."
            ],
            "keyTakeaways": [
              "For an ellipse, b^2 = a^2(1 - e^2); for a hyperbola, b^2 = a^2(e^2 - 1).",
              "In an ellipse, the sum of distances from any point on the curve to the two foci is constant and equals the major axis 2a."
            ],
            "examTips": [
              "If the coefficient of x^2 has a larger denominator in an ellipse, the major axis lies along the x-axis; if y^2 has larger denominator, the major axis is vertical along the y-axis."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming eccentricity of a hyperbola can be less than 1. Eccentricity of a hyperbola is strictly e > 1."
        ]
      },
      "formulas": [
        {
          "label": "Eccentricity & Latus Rectum of Conics",
          "formula": "e_{\\text{ellipse}} = \\sqrt{1 - \\frac{b^2}{a^2}}, \\quad e_{\\text{hyperbola}} = \\sqrt{1 + \\frac{b^2}{a^2}}, \\quad \\text{L.R.} = \\frac{2b^2}{a}",
          "description": "Eccentricities and latus rectum lengths for central conic sections.",
          "variables": [
            {
              "symbol": "a",
              "meaning": "Semi-Major / Transverse Axis",
              "unit": "-"
            },
            {
              "symbol": "b",
              "meaning": "Semi-Minor / Conjugate Axis",
              "unit": "-"
            },
            {
              "symbol": "e",
              "meaning": "Eccentricity",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-10-01",
          "title": "Circle, Parabola, Ellipse & Hyperbola Standard Equations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Circle, Parabola, Ellipse & Hyperbola Standard Equations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-10-01",
          "title": "Circle, Parabola, Ellipse & Hyperbola Standard Equations",
          "summary": "Conic definition locus SP = e PM, circle (x - h)^2 + (y - k)^2 = r^2, parabola y^2 = 4ax (focus (a,0), directrix x = -a, latus rectum 4a), ellipse x^2/a^2 + y^2/b^2 = 1 (eccentricity e = sqrt(1 - b^2/a^2)), hyperbola x^2/a^2 - y^2/b^2 = 1."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000011": [
    {
      "id": "top-math-11-11-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "MATH-11-11-T01",
      "title": "Coordinate Axes, Distance & Section Formula in 3D",
      "description": "3D coordinate axes and octants, distance formula between two points P(x1, y1, z1) and Q(x2, y2, z2), section formula for internal and external division, centroid of triangle.",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Three-dimensional geometry extends Cartesian coordinates by adding an orthogonal z-axis, partitioning space into eight octants.",
        "sections": [
          {
            "heading": "3D Cartesian Space and Spatial Division",
            "paragraphs": [
              "Eight Octants: Coordinate planes XY, YZ, ZX divide space into 8 octants with signs determined by x, y, z signs.",
              "Distance Formula: Distance between P(x1, y1, z1) and Q(x2, y2, z2) is d = sqrt((x2 - x1)^2 + (y2 - y1)^2 + (z2 - z1)^2).",
              "Section Formula (Internal): Coordinates of point dividing segment in ratio m : n are ((m x2 + n x1)/(m + n), (m y2 + n y1)/(m + n), (m z2 + n z1)/(m + n)).",
              "Centroid of Triangle: G = ((x1 + x2 + x3)/3, (y1 + y2 + y3)/3, (z1 + z2 + z3)/3)."
            ],
            "keyTakeaways": [
              "Points on the x-axis have y = 0, z = 0 (coordinates (x, 0, 0)).",
              "Points in the XY-plane have z = 0 (coordinates (x, y, 0))."
            ],
            "examTips": [
              "To find the ratio in which the YZ-plane divides a line segment, set the x-coordinate of the dividing point to zero: x = 0."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing octant numbering with 2D quadrant numbering. Octants I through IV have z > 0; octants V through VIII have z < 0."
        ]
      },
      "formulas": [
        {
          "label": "3D Distance and Section Formulas",
          "formula": "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}, \\quad R = \\left(\\frac{m x_2 + n x_1}{m + n}, \\frac{m y_2 + n y_1}{m + n}, \\frac{m z_2 + n z_1}{m + n}\\right)",
          "description": "Euclidean 3D distance and internal ratio section division formulas.",
          "variables": [
            {
              "symbol": "d",
              "meaning": "3D Spatial Distance",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-11-01",
          "title": "Coordinate Axes, Distance & Section Formula in 3D Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Coordinate Axes, Distance & Section Formula in 3D.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-11-01",
          "title": "Coordinate Axes, Distance & Section Formula in 3D",
          "summary": "3D coordinate axes and octants, distance formula between two points P(x1, y1, z1) and Q(x2, y2, z2), section formula for internal and external division, centroid of triangle."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000012": [
    {
      "id": "top-math-11-12-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "MATH-11-12-T01",
      "title": "Intuitive Limits, Standard Limits & First Principle Differentiation",
      "description": "Concept of limit, left-hand and right-hand limits, standard trigonometric limits lim(x->0) sin x / x = 1, polynomial limit lim(x->a) (x^n - a^n)/(x - a) = n a^(n-1), derivative as rate of change, differentiation from first principles f'(x) = lim(h->0) [f(x+h) - f(x)]/h, product rule and quotient rule.",
      "sequenceOrder": 1,
      "weightagePercent": 7.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Calculus analyzes continuous change. A limit investigates function behavior near a point without requiring evaluation at the point. Derivatives quantify instantaneous rate of change via the first principle limit of a secant line slope transitioning into a tangent.",
        "sections": [
          {
            "heading": "Limits and First Principles Differentiation",
            "paragraphs": [
              "Existence of Limit: lim_{x -> a} f(x) exists if and only if Left-Hand Limit (LHL = lim_{h -> 0} f(a - h)) equals Right-Hand Limit (RHL = lim_{h -> 0} f(a + h)) and both are finite.",
              "Standard Limits: lim_{x -> 0} (sin x / x) = 1 (x in radians); lim_{x -> 0} ((1 - cos x)/x) = 0; lim_{x -> 0} ((e^x - 1)/x) = 1; lim_{x -> a} ((x^n - a^n)/(x - a)) = n a^(n-1).",
              "Derivative from First Principles: f'(x) = lim_{h -> 0} [f(x + h) - f(x)] / h. Geometrically represents the slope of the tangent line to the curve y = f(x) at point x.",
              "Product Rule (Leibniz): d/dx [u * v] = u (dv/dx) + v (du/dx).",
              "Quotient Rule: d/dx [u / v] = [v (du/dx) - u (dv/dx)] / v^2."
            ],
            "keyTakeaways": [
              "lim_{x -> 0} (sin x / x) = 1 requires x to be in RADIANS, not degrees. If x is in degrees, the limit is pi / 180.",
              "Secant line connecting (x, f(x)) and (x+h, f(x+h)) becomes the instantaneous tangent line as h approaches 0."
            ],
            "examTips": [
              "In limits yielding indeterminate form 0/0, factorize, rationalize, or apply standard limits before direct substitution!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming f(a) must be defined for lim_{x -> a} f(x) to exist. A limit depends solely on neighborhood behavior, completely independent of the function's value at x = a."
        ]
      },
      "formulas": [
        {
          "label": "Standard Limit Theorems",
          "formula": "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to a} \\frac{x^n - a^n}{x - a} = n a^{n-1}",
          "description": "Foundational trigonometric and algebraic standard limits.",
          "variables": [
            {
              "symbol": "x",
              "meaning": "Limit Variable",
              "unit": "rad"
            },
            {
              "symbol": "a",
              "meaning": "Limit Target Point",
              "unit": "-"
            }
          ]
        },
        {
          "label": "First Principle Derivative & Product Rule",
          "formula": "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}, \\quad \\frac{d}{dx}[u \\cdot v] = u \\frac{dv}{dx} + v \\frac{du}{dx}",
          "description": "Definition of derivative from first principles and Leibniz product differentiation rule.",
          "variables": [
            {
              "symbol": "f'(x)",
              "meaning": "Derivative Rate of Change",
              "unit": "-"
            },
            {
              "symbol": "h",
              "meaning": "Infinitesimal Increment",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-math-11-12-01",
          "title": "Intuitive Limits, Standard Limits & First Principle Differentiation Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Intuitive Limits, Standard Limits & First Principle Differentiation with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "secant_tangent_limit"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-12-01",
          "title": "Intuitive Limits, Standard Limits & First Principle Differentiation",
          "summary": "Concept of limit, left-hand and right-hand limits, standard trigonometric limits lim(x->0) sin x / x = 1, polynomial limit lim(x->a) (x^n - a^n)/(x - a) = n a^(n-1), derivative as rate of change, differentiation from first principles f'(x) = lim(h->0) [f(x+h) - f(x)]/h, product rule and quotient rule.",
          "simulationId": "secant_tangent_limit"
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000013": [
    {
      "id": "top-math-11-13-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "MATH-11-13-T01",
      "title": "Measures of Dispersion: Mean Deviation, Variance & Standard Deviation",
      "description": "Mean deviation about mean and median, variance sigma^2 = sum(xi - x_bar)^2 / n, standard deviation sigma = sqrt(variance), variance formula for grouped data sigma^2 = [sum fi xi^2 / N] - (x_bar)^2.",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Dispersion quantifies the spread of data points around a central measure. Variance and standard deviation are the primary algebraic dispersion metrics in statistics.",
        "sections": [
          {
            "heading": "Variance and Standard Deviation Formulations",
            "paragraphs": [
              "Mean Deviation (MD): Mean deviation about mean = sum(|xi - x_bar|) / n. Mean deviation is minimized when measured about the median.",
              "Variance (sigma^2): Mean of squares of deviations from the mean: sigma^2 = (1/N) * sum(fi * (xi - x_bar)^2).",
              "Computational Shortcut for Variance: sigma^2 = [sum(fi * xi^2) / N] - [sum(fi * xi) / N]^2.",
              "Standard Deviation (sigma): Positive square root of variance: sigma = sqrt(sigma^2).",
              "Coefficient of Variation (CV): CV = (sigma / x_bar) * 100. Measures relative variability; lower CV indicates greater consistency."
            ],
            "keyTakeaways": [
              "Adding or subtracting a constant to each observation does NOT change variance or standard deviation.",
              "Multiplying each observation by a constant k multiplies standard deviation by |k| and variance by k^2."
            ],
            "examTips": [
              "Mean deviation about median is strictly less than or equal to mean deviation about mean: MD(median) <= MD(mean)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing standard deviation can be negative. Standard deviation is defined as the POSITIVE square root of variance (sigma >= 0)."
        ]
      },
      "formulas": [
        {
          "label": "Variance and Standard Deviation",
          "formula": "\\sigma^2 = \\frac{1}{N} \\sum f_i x_i^2 - \\bar{x}^2, \\quad \\sigma = \\sqrt{\\sigma^2}, \\quad \\text{CV} = \\frac{\\sigma}{\\bar{x}} \\times 100",
          "description": "Variance computation, standard deviation, and coefficient of variation.",
          "variables": [
            {
              "symbol": "\\sigma^2",
              "meaning": "Variance",
              "unit": "-"
            },
            {
              "symbol": "\\sigma",
              "meaning": "Standard Deviation",
              "unit": "-"
            },
            {
              "symbol": "\\bar{x}",
              "meaning": "Arithmetic Mean",
              "unit": "-"
            },
            {
              "symbol": "\\text{CV}",
              "meaning": "Coefficient of Variation",
              "unit": "%"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-13-01",
          "title": "Measures of Dispersion: Mean Deviation, Variance & Standard Deviation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Measures of Dispersion: Mean Deviation, Variance & Standard Deviation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-13-01",
          "title": "Measures of Dispersion: Mean Deviation, Variance & Standard Deviation",
          "summary": "Mean deviation about mean and median, variance sigma^2 = sum(xi - x_bar)^2 / n, standard deviation sigma = sqrt(variance), variance formula for grouped data sigma^2 = [sum fi xi^2 / N] - (x_bar)^2."
        }
      ]
    }
  ],
  "c0000031-0000-0000-0000-000000000014": [
    {
      "id": "top-math-11-14-01",
      "subjectId": "mathematics",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000031-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "MATH-11-14-T01",
      "title": "Axiomatic Probability, Mutually Exclusive & Exhaustive Events",
      "description": "Random experiments, sample spaces, event types (impossible, sure, mutually exclusive, exhaustive), axiomatic definition of probability, addition theorem P(A union B) = P(A) + P(B) - P(A intersection B).",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Probability quantifies the likelihood of random events. Axiomatic probability establishes rigorous set-theoretic rules for events defined on a sample space S.",
        "sections": [
          {
            "heading": "Sample Space and Axiomatic Rules",
            "paragraphs": [
              "Axiom 1: For any event A, 0 <= P(A) <= 1.",
              "Axiom 2: Probability of the entire sample space S is unity: P(S) = 1.",
              "Axiom 3: If A and B are mutually exclusive events (A cap B = emptyset), then P(A cup B) = P(A) + P(B).",
              "Addition Theorem for Any Events: P(A cup B) = P(A) + P(B) - P(A cap B).",
              "Complementary Event: P(A') = 1 - P(A)."
            ],
            "keyTakeaways": [
              "Two events are mutually exclusive if they cannot happen simultaneously (A cap B = emptyset -> P(A cap B) = 0).",
              "Events E1, E2, ... En are exhaustive if their union is the entire sample space (E1 cup E2 cup ... cup En = S)."
            ],
            "examTips": [
              "P(A but not B) = P(A - B) = P(A cap B') = P(A) - P(A cap B)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing mutually exclusive events with independent events. Mutually exclusive means A cap B = emptyset (disjoint); independent means P(A cap B) = P(A) * P(B)."
        ]
      },
      "formulas": [
        {
          "label": "Axiomatic Addition Theorem",
          "formula": "P(A \\cup B) = P(A) + P(B) - P(A \\cap B), \\quad P(A') = 1 - P(A)",
          "description": "General probability addition law for intersecting events.",
          "variables": [
            {
              "symbol": "P(A)",
              "meaning": "Probability of Event A",
              "unit": "-"
            },
            {
              "symbol": "P(A \\cap B)",
              "meaning": "Joint Probability",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-11-14-01",
          "title": "Axiomatic Probability, Mutually Exclusive & Exhaustive Events Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Axiomatic Probability, Mutually Exclusive & Exhaustive Events.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-11-14-01",
          "title": "Axiomatic Probability, Mutually Exclusive & Exhaustive Events",
          "summary": "Random experiments, sample spaces, event types (impossible, sure, mutually exclusive, exhaustive), axiomatic definition of probability, addition theorem P(A union B) = P(A) + P(B) - P(A intersection B)."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000001": [
    {
      "id": "top-math-12-01-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "MATH-12-01-T01",
      "title": "Equivalence Relations & Injective/Surjective Functions",
      "description": "Types of relations: reflexive, symmetric, transitive, equivalence relations and equivalence classes, types of functions: one-one (injective), onto (surjective), and bijective functions.",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Equivalence relations partition sets into disjoint equivalence classes. Functions with both injective and surjective properties are bijective and possess unique inverses.",
        "sections": [
          {
            "heading": "Relation Properties and Function Classifications",
            "paragraphs": [
              "Reflexive: (a, a) in R for all a in A.",
              "Symmetric: (a, b) in R implies (b, a) in R.",
              "Transitive: (a, b) in R and (b, c) in R implies (a, c) in R.",
              "Equivalence Relation: A relation that is simultaneously reflexive, symmetric, and transitive. Fundamental Theorem: An equivalence relation partitions set A into mutually disjoint equivalence classes.",
              "One-One (Injective): f(x1) = f(x2) implies x1 = x2. (Horizontal line test intersects graph at most once).",
              "Onto (Surjective): For every y in codomain B, there exists x in domain A such that f(x) = y (Range of f = Codomain of f).",
              "Bijective: Both one-one and onto. A function is invertible if and only if it is bijective."
            ],
            "keyTakeaways": [
              "A strictly monotonic function (strictly increasing or decreasing throughout domain) is always one-one.",
              "Number of onto functions from a set with m elements to a set with n elements can be computed via Stirling numbers / inclusion-exclusion."
            ],
            "examTips": [
              "To prove a function is onto, express x in terms of y (x = g(y)) and verify that for every y in codomain, x is a valid member of domain!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming a relation is transitive if (a, b) is in R but no (b, c) exists. If the premise (b, c) is never met, transitivity is vacuously TRUE."
        ]
      },
      "formulas": [
        {
          "label": "Injectivity Criterion",
          "formula": "f(x_1) = f(x_2) \\implies x_1 = x_2, \\quad \\text{Range}(f) = \\text{Codomain}(B) \\; (\\text{for onto})",
          "description": "Mathematical definitions of one-one and onto function mappings.",
          "variables": [
            {
              "symbol": "x_1, x_2",
              "meaning": "Domain Elements",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-01-01",
          "title": "Equivalence Relations & Injective/Surjective Functions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Equivalence Relations & Injective/Surjective Functions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-01-01",
          "title": "Equivalence Relations & Injective/Surjective Functions",
          "summary": "Types of relations: reflexive, symmetric, transitive, equivalence relations and equivalence classes, types of functions: one-one (injective), onto (surjective), and bijective functions."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000002": [
    {
      "id": "top-math-12-02-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "MATH-12-02-T01",
      "title": "Principal Value Branches & Elementary Properties",
      "description": "Domain, range and principal value branches of sin^-1, cos^-1, tan^-1, cosec^-1, sec^-1, cot^-1, graphs of inverse trigonometric functions, and properties sin^-1(-x) = -sin^-1 x, cos^-1(-x) = pi - cos^-1 x, sin^-1 x + cos^-1 x = pi / 2.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Trigonometric functions are periodic and not one-one over R; restricting their domains produces bijective branches that define inverse trigonometric functions.",
        "sections": [
          {
            "heading": "Principal Value Branches and Identities",
            "paragraphs": [
              "sin^-1 x: Domain [-1, 1], Principal Range [-pi/2, pi/2].",
              "cos^-1 x: Domain [-1, 1], Principal Range [0, pi].",
              "tan^-1 x: Domain R, Principal Range (-pi/2, pi/2).",
              "Complementary Angles: sin^-1 x + cos^-1 x = pi / 2 (for x in [-1, 1]); tan^-1 x + cot^-1 x = pi / 2; sec^-1 x + cosec^-1 x = pi / 2.",
              "Negative Arguments: sin^-1(-x) = -sin^-1 x; tan^-1(-x) = -tan^-1 x; cosec^-1(-x) = -cosec^-1 x. cos^-1(-x) = pi - cos^-1 x; sec^-1(-x) = pi - sec^-1 x; cot^-1(-x) = pi - cot^-1 x."
            ],
            "keyTakeaways": [
              "sin^-1(sin theta) = theta ONLY when theta lies inside the principal range [-pi/2, pi/2]. E.g. sin^-1(sin(2pi/3)) = pi - 2pi/3 = pi/3.",
              "cos^-1(cos theta) = theta ONLY when theta lies in [0, pi]."
            ],
            "examTips": [
              "Watch out for negative arguments in cos^-1, sec^-1, and cot^-1: cos^-1(-1/2) = pi - pi/3 = 2pi/3, NOT -pi/3!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Writing sin^-1 x = 1 / sin x. sin^-1 x denotes the inverse function arcsin(x), whereas (sin x)^-1 = cosec x."
        ]
      },
      "formulas": [
        {
          "label": "Inverse Trigonometric Complementary Identities",
          "formula": "\\sin^{-1} x + \\cos^{-1} x = \\frac{\\pi}{2}, \\quad \\tan^{-1} x + \\cot^{-1} x = \\frac{\\pi}{2}, \\quad \\cos^{-1}(-x) = \\pi - \\cos^{-1} x",
          "description": "Complementary angle identities and negative argument reflection laws.",
          "variables": [
            {
              "symbol": "x",
              "meaning": "Real Argument",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-02-01",
          "title": "Principal Value Branches & Elementary Properties Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Principal Value Branches & Elementary Properties.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-02-01",
          "title": "Principal Value Branches & Elementary Properties",
          "summary": "Domain, range and principal value branches of sin^-1, cos^-1, tan^-1, cosec^-1, sec^-1, cot^-1, graphs of inverse trigonometric functions, and properties sin^-1(-x) = -sin^-1 x, cos^-1(-x) = pi - cos^-1 x, sin^-1 x + cos^-1 x = pi / 2."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000003": [
    {
      "id": "top-math-12-03-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "MATH-12-03-T01",
      "title": "Matrix Algebra, Multiplication & Transpose",
      "description": "Matrix order m x n, types of matrices (column, row, square, diagonal, scalar, identity, zero), matrix addition, scalar multiplication, matrix multiplication (non-commutative AB != BA), transpose of matrix (A^T), symmetric (A^T = A) and skew-symmetric (A^T = -A) matrices.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Matrices are rectangular arrays of numbers representing linear maps. Matrix multiplication is associative and distributive, but generally non-commutative.",
        "sections": [
          {
            "heading": "Matrix Operations and Transpose Symmetries",
            "paragraphs": [
              "Multiplication Condition: Product AB is defined if and only if columns of A equals rows of B: A_(m x n) * B_(n x p) = C_(m x p).",
              "Non-Commutativity: In general, AB != BA. Even if both AB and BA exist, they may have different orders or different elements.",
              "Transpose Properties: (A^T)^T = A; (A + B)^T = A^T + B^T; (k A)^T = k A^T; Reversal rule: (AB)^T = B^T A^T.",
              "Symmetric & Skew-Symmetric: A is symmetric if A^T = A; skew-symmetric if A^T = -A (all main diagonal elements of a skew-symmetric matrix are zero: a_ii = 0).",
              "Every square matrix can be uniquely expressed as the sum of a symmetric and a skew-symmetric matrix: A = (A + A^T)/2 + (A - A^T)/2."
            ],
            "keyTakeaways": [
              "If AB = 0 (zero matrix), it does NOT necessarily imply A = 0 or B = 0.",
              "All diagonal entries of a skew-symmetric matrix must be zero because a_ii = -a_ii -> 2 a_ii = 0."
            ],
            "examTips": [
              "Remember the reversal law: (AB)^T = B^T A^T, and for three matrices (ABC)^T = C^T B^T A^T."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming AB = BA for square matrices. Matrix multiplication is non-commutative except for special pairs like commuting diagonal matrices or A and its inverse."
        ]
      },
      "formulas": [
        {
          "label": "Matrix Decomposition & Reversal Rule",
          "formula": "(A B)^T = B^T A^T, \\quad A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)",
          "description": "Transpose product reversal law and unique decomposition into symmetric and skew-symmetric parts.",
          "variables": [
            {
              "symbol": "A, B",
              "meaning": "Square Matrices",
              "unit": "-"
            },
            {
              "symbol": "A^T",
              "meaning": "Transpose Matrix",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-03-01",
          "title": "Matrix Algebra, Multiplication & Transpose Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Matrix Algebra, Multiplication & Transpose.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-03-01",
          "title": "Matrix Algebra, Multiplication & Transpose",
          "summary": "Matrix order m x n, types of matrices (column, row, square, diagonal, scalar, identity, zero), matrix addition, scalar multiplication, matrix multiplication (non-commutative AB != BA), transpose of matrix (A^T), symmetric (A^T = A) and skew-symmetric (A^T = -A) matrices."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000004": [
    {
      "id": "top-math-12-04-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "MATH-12-04-T01",
      "title": "Determinant Properties, Adjoint, Inverse & Cramer’s Rule",
      "description": "Determinant of 2x2 and 3x3 matrices, minors and cofactors C_ij = (-1)^(i+j) M_ij, adjoint adj(A) = C^T, matrix inverse A^-1 = adj(A) / det(A), and solving systems of linear equations AX = B via matrix method X = A^-1 B.",
      "sequenceOrder": 1,
      "weightagePercent": 6.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The determinant maps square matrices to scalar values measuring volumetric scaling. A matrix is invertible if and only if its determinant is non-zero (non-singular).",
        "sections": [
          {
            "heading": "Cofactor Adjoints and Matrix Inversion",
            "paragraphs": [
              "Minor M_ij: Determinant of submatrix obtained by deleting i-th row and j-th column. Cofactor C_ij = (-1)^(i + j) M_ij.",
              "Adjoint of Matrix: Transpose of cofactor matrix: adj(A) = [C_ij]^T. Fundamental theorem: A * adj(A) = adj(A) * A = |A| * I.",
              "Matrix Inverse: A^-1 exists if and only if |A| != 0 (non-singular matrix). A^-1 = (1 / |A|) * adj(A).",
              "Properties: |adj(A)| = |A|^(n - 1); |A^-1| = 1 / |A|; adj(AB) = adj(B) * adj(A); (AB)^-1 = B^-1 A^-1.",
              "System of Linear Equations AX = B: If |A| != 0, unique solution X = A^-1 B. If |A| = 0 and (adj A) B != 0, system is inconsistent (no solution). If |A| = 0 and (adj A) B = 0, system has infinitely many solutions or no solution."
            ],
            "keyTakeaways": [
              "|k A| = k^n |A| for an n x n matrix A.",
              "Area of triangle with vertices (x1,y1), (x2,y2), (x3,y3) = (1/2) |det[[x1,y1,1],[x2,y2,1],[x3,y3,1]]|."
            ],
            "examTips": [
              "If |A| = 0, the matrix is singular and CANNOT be inverted."
            ]
          }
        ],
        "commonMisconceptions": [
          "Writing |k A| = k |A|. Factoring k out from an n x n determinant factors k from each of the n rows, giving k^n |A|."
        ]
      },
      "formulas": [
        {
          "label": "Adjoint Identity & Matrix Inverse",
          "formula": "A \\cdot \\text{adj}(A) = |A| I_n, \\quad A^{-1} = \\frac{1}{|A|} \\text{adj}(A) \\quad (|A| \\ne 0)",
          "description": "Fundamental matrix inversion theorem via determinant and adjoint.",
          "variables": [
            {
              "symbol": "|A|",
              "meaning": "Matrix Determinant",
              "unit": "-"
            },
            {
              "symbol": "\\text{adj}(A)",
              "meaning": "Adjoint Matrix",
              "unit": "-"
            },
            {
              "symbol": "A^{-1}",
              "meaning": "Inverse Matrix",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Determinant of Adjoint and Scalar Scaling",
          "formula": "|\\text{adj}(A)| = |A|^{n - 1}, \\quad |k A| = k^n |A|",
          "description": "Adjoint determinant power and scalar expansion in n-dimensional matrix.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Matrix Dimension / Order",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-04-01",
          "title": "Determinant Properties, Adjoint, Inverse & Cramer’s Rule Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Determinant Properties, Adjoint, Inverse & Cramer’s Rule.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-04-01",
          "title": "Determinant Properties, Adjoint, Inverse & Cramer’s Rule",
          "summary": "Determinant of 2x2 and 3x3 matrices, minors and cofactors C_ij = (-1)^(i+j) M_ij, adjoint adj(A) = C^T, matrix inverse A^-1 = adj(A) / det(A), and solving systems of linear equations AX = B via matrix method X = A^-1 B."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000009": [
    {
      "id": "top-math-12-05-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "MATH-12-05-T01",
      "title": "Continuity, Chain Rule, Implicit & Logarithmic Differentiation",
      "description": "Continuity at a point lim(x->c) f(x) = f(c), differentiability implies continuity, chain rule for composite functions, derivatives of inverse trigonometric functions, implicit differentiation, logarithmic differentiation y = u(x)^v(x), parametric differentiation, and second order derivatives d^2y/dx^2.",
      "sequenceOrder": 1,
      "weightagePercent": 9.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Continuity requires no breaks in a function's curve; differentiability requires a smooth unique tangent line. Differentiability is a strictly stronger condition: every differentiable function is continuous, but the converse is false (e.g. |x| at x = 0).",
        "sections": [
          {
            "heading": "Differentiation Techniques and Chain Rule",
            "paragraphs": [
              "Continuity Definition: f(x) is continuous at x = c if LHL = RHL = f(c).",
              "Differentiability implies Continuity: If f is differentiable at c, it is continuous at c. Counterexample: f(x) = |x| is continuous at x = 0, but not differentiable at x = 0 (corner point).",
              "Chain Rule: dy/dx = (dy/du) * (du/dx).",
              "Logarithmic Differentiation: Used for variable powers y = u(x)^v(x) or complicated products: Take ln on both sides -> ln y = v(x) ln u(x) -> differentiate: (1/y) dy/dx = v'(x) ln u(x) + v(x) u'(x) / u(x).",
              "Parametric Differentiation: For x = f(t), y = g(t): dy/dx = (dy/dt) / (dx/dt). Second derivative: d^2y/dx^2 = (d/dt(dy/dx)) / (dx/dt)."
            ],
            "keyTakeaways": [
              "d/dx [sin^-1 x] = 1 / sqrt(1 - x^2); d/dx [cos^-1 x] = -1 / sqrt(1 - x^2); d/dx [tan^-1 x] = 1 / (1 + x^2).",
              "In parametric second derivatives, remember to multiply by dt/dx at the end: d^2y/dx^2 = d/dt [dy/dx] * (dt/dx)."
            ],
            "examTips": [
              "When computing parametric second derivatives, never simply differentiate numerator and denominator separately! d^2y/dx^2 != (d^2y/dt^2)/(d^2x/dt^2)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming continuity implies differentiability. Functions with sharp corners (like |x|) or vertical tangents (x^(1/3)) are continuous but not differentiable at those points."
        ]
      },
      "formulas": [
        {
          "label": "Logarithmic & Parametric Second Derivative",
          "formula": "\\frac{d}{dx}[u^v] = u^v \\left( v' \\ln u + \\frac{v u'}{u} \\right), \\quad \\frac{d^2 y}{dx^2} = \\frac{d}{dt}\\left( \\frac{dy}{dx} \\right) \\frac{1}{\\frac{dx}{dt}}",
          "description": "Formulas for variable power differentiation and parametric second order derivative.",
          "variables": [
            {
              "symbol": "u, v",
              "meaning": "Differentiable Functions of x",
              "unit": "-"
            },
            {
              "symbol": "t",
              "meaning": "Independent Parameter",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-05-01",
          "title": "Continuity, Chain Rule, Implicit & Logarithmic Differentiation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Continuity, Chain Rule, Implicit & Logarithmic Differentiation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-05-01",
          "title": "Continuity, Chain Rule, Implicit & Logarithmic Differentiation",
          "summary": "Continuity at a point lim(x->c) f(x) = f(c), differentiability implies continuity, chain rule for composite functions, derivatives of inverse trigonometric functions, implicit differentiation, logarithmic differentiation y = u(x)^v(x), parametric differentiation, and second order derivatives d^2y/dx^2."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000006": [
    {
      "id": "top-math-12-06-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "MATH-12-06-T01",
      "title": "Rate of Change, Monotonicity & Maxima-Minima Optimization",
      "description": "Rate of change dy/dt = (dy/dx)(dx/dt), increasing and decreasing functions (f'(x) > 0 vs f'(x) < 0), critical points, first derivative test, second derivative test for local maxima (f'' < 0) and minima (f'' > 0), and applied real-world optimization problems.",
      "sequenceOrder": 1,
      "weightagePercent": 8.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Derivatives enable optimization. The sign of the first derivative determines monotonicity, while the second derivative measures concavity and classifies extrema.",
        "sections": [
          {
            "heading": "Monotonicity and Extreme Value Tests",
            "paragraphs": [
              "Rate of Change: dy/dt = (dy/dx) * (dx/dt). Relates time rates of geometric quantities (volume, surface area).",
              "Increasing / Decreasing: f(x) is strictly increasing on (a, b) if f'(x) > 0 for all x in (a, b); strictly decreasing if f'(x) < 0.",
              "Critical Points: Points in domain where f'(x) = 0 or f'(x) does not exist.",
              "Second Derivative Test: At a critical point c where f'(c) = 0: (1) If f''(c) < 0, f has a local MAXIMUM at c; (2) If f''(c) > 0, f has a local MINIMUM at c; (3) If f''(c) = 0, test is inconclusive (use First Derivative Test).",
              "Absolute Maxima / Minima on Closed Interval [a, b]: Evaluate f(x) at all critical points in (a, b) AND at the boundary endpoints x = a and x = b: the largest value is absolute maximum, smallest is absolute minimum."
            ],
            "keyTakeaways": [
              "Point of Inflexion occurs where concavity changes sign (f''(x) = 0 and f''(x) changes sign across the point).",
              "For optimization word problems, eliminate extra variables using given geometric constraints to form a single-variable function before differentiating."
            ],
            "examTips": [
              "Always verify boundary values when finding absolute extrema on a closed interval [a, b]!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming f'(c) = 0 guarantees a local maximum or minimum. For f(x) = x^3, f'(0) = 0, but x = 0 is an inflection point, not an extremum."
        ]
      },
      "formulas": [
        {
          "label": "First & Second Derivative Optimization Tests",
          "formula": "f'(c) = 0 \\; \\& \\; f''(c) < 0 \\implies \\text{Local Maxima}, \\quad f'(c) = 0 \\; \\& \\; f''(c) > 0 \\implies \\text{Local Minima}",
          "description": "Concavity criteria for classifying local extrema.",
          "variables": [
            {
              "symbol": "c",
              "meaning": "Critical Point",
              "unit": "-"
            },
            {
              "symbol": "f''(c)",
              "meaning": "Second Derivative Concavity",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-06-01",
          "title": "Rate of Change, Monotonicity & Maxima-Minima Optimization Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Rate of Change, Monotonicity & Maxima-Minima Optimization.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-06-01",
          "title": "Rate of Change, Monotonicity & Maxima-Minima Optimization",
          "summary": "Rate of change dy/dt = (dy/dx)(dx/dt), increasing and decreasing functions (f'(x) > 0 vs f'(x) < 0), critical points, first derivative test, second derivative test for local maxima (f'' < 0) and minima (f'' > 0), and applied real-world optimization problems."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000010": [
    {
      "id": "top-math-12-07-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "MATH-12-07-T01",
      "title": "Integration Methods & Fundamental Theorem of Calculus",
      "description": "Integration as inverse of differentiation, standard algebraic and trigonometric integrals, integration by substitution, integration by partial fractions, integration by parts (ILATE rule), Fundamental Theorem of Calculus, and definite integral properties.",
      "sequenceOrder": 1,
      "weightagePercent": 11.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Integral calculus computes antiderivatives (indefinite integrals) and accumulated areas (definite integrals). The Fundamental Theorem of Calculus unifies differentiation and integration.",
        "sections": [
          {
            "heading": "Integration by Parts and Definite Integral Properties",
            "paragraphs": [
              "Integration by Parts: int(u * v dx) = u * int(v dx) - int[(du/dx) * int(v dx)] dx. Choice of first function u follows ILATE order: Inverse trig, Logarithmic, Algebraic, Trigonometric, Exponential.",
              "Special Integral: int e^x [f(x) + f'(x)] dx = e^x f(x) + C.",
              "Definite Integral Properties: (1) int_a^b f(x) dx = int_a^b f(a + b - x) dx; (2) King's Property: int_0^a f(x) dx = int_0^a f(a - x) dx; (3) Even/Odd: int_-a^a f(x) dx = 2 int_0^a f(x) dx (if f is even), or 0 (if f is odd)."
            ],
            "keyTakeaways": [
              "King's Property int_0^a f(x) dx = int_0^a f(a - x) dx resolves over 80% of tricky definite trigonometric integrals (e.g. int_0^(pi/2) sin^n x / (sin^n x + cos^n x) dx = pi / 4).",
              "Always add integration constant C for indefinite integrals."
            ],
            "examTips": [
              "Check odd symmetry immediately for symmetric limits [-a, a]: if f(-x) = -f(x), the definite integral is ZERO without needing integration!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Forgetting absolute value in logarithmic integration. int (1/x) dx = ln|x| + C, not ln(x) + C."
        ]
      },
      "formulas": [
        {
          "label": "Integration by Parts & Exponential Identity",
          "formula": "\\int u v \\, dx = u \\int v \\, dx - \\int \\left( u' \\int v \\, dx \\right) dx, \\quad \\int e^x [f(x) + f'(x)] dx = e^x f(x) + C",
          "description": "ILATE product integration rule and exponential-derivative matching pattern.",
          "variables": [
            {
              "symbol": "u, v",
              "meaning": "Factor Functions",
              "unit": "-"
            },
            {
              "symbol": "C",
              "meaning": "Constant of Integration",
              "unit": "-"
            }
          ]
        },
        {
          "label": "King’s Definite Integral Property",
          "formula": "\\int_a^b f(x) \\, dx = \\int_a^b f(a + b - x) \\, dx, \\quad \\int_0^a f(x) \\, dx = \\int_0^a f(a - x) \\, dx",
          "description": "Boundary reflection invariance property for definite integrals.",
          "variables": [
            {
              "symbol": "a, b",
              "meaning": "Integration Limits",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-07-01",
          "title": "Integration Methods & Fundamental Theorem of Calculus Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Integration Methods & Fundamental Theorem of Calculus.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-07-01",
          "title": "Integration Methods & Fundamental Theorem of Calculus",
          "summary": "Integration as inverse of differentiation, standard algebraic and trigonometric integrals, integration by substitution, integration by partial fractions, integration by parts (ILATE rule), Fundamental Theorem of Calculus, and definite integral properties."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000008": [
    {
      "id": "top-math-12-08-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "MATH-12-08-T01",
      "title": "Area Under Simple Curves & Bounded Regions",
      "description": "Area bounded by curve y = f(x), x-axis and vertical lines x = a, x = b: Area = int_a^b |y| dx, area between curve and y-axis: Area = int_c^d |x| dy, area bounded between two intersecting curves Area = int (y_upper - y_lower) dx.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Definite integrals compute geometric planar areas. The absolute value of vertical or horizontal differential strips integrates the bounded area regardless of orientation.",
        "sections": [
          {
            "heading": "Area Determination between Intersecting Curves",
            "paragraphs": [
              "Area bounded by curve y = f(x) from x = a to x = b: A = int_a^b y dx. If curve drops below x-axis, take absolute value of integral.",
              "Area between two curves y1 = f(x) and y2 = g(x) from intersection x = a to x = b: A = int_a^b [f(x) - g(x)] dx, where f(x) >= g(x) on [a, b].",
              "Standard Benchmark: Area bounded between parabola y^2 = 4ax and line y = mx is Area = 8 a^2 / (3 m^3).",
              "Standard Benchmark: Area bounded between parabolas y^2 = 4ax and x^2 = 4by is Area = 16 ab / 3."
            ],
            "keyTakeaways": [
              "Area is always non-negative: geometric areas below the x-axis must be integrated with a negative sign to produce positive area.",
              "Find intersection points first by solving simultaneous equations to set correct integration limits."
            ],
            "examTips": [
              "Ellipse area x^2/a^2 + y^2/b^2 = 1 is exactly pi * a * b. Use this formula to immediately verify calculus derivations!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Integrating y dx directly when the curve crosses above and below the x-axis. Regions below the axis subtract from above-axis regions unless integrated piecewise with absolute values."
        ]
      },
      "formulas": [
        {
          "label": "Bounded Planar Area Formula",
          "formula": "A = \\int_a^b [y_{\\text{upper}} - y_{\\text{lower}}] \\, dx = \\int_c^d [x_{\\text{right}} - x_{\\text{left}}] \\, dy",
          "description": "Differential strip integration for vertical and horizontal bounding regimes.",
          "variables": [
            {
              "symbol": "A",
              "meaning": "Geometric Planar Area",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-08-01",
          "title": "Area Under Simple Curves & Bounded Regions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Area Under Simple Curves & Bounded Regions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-08-01",
          "title": "Area Under Simple Curves & Bounded Regions",
          "summary": "Area bounded by curve y = f(x), x-axis and vertical lines x = a, x = b: Area = int_a^b |y| dx, area between curve and y-axis: Area = int_c^d |x| dy, area bounded between two intersecting curves Area = int (y_upper - y_lower) dx."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000009": [
    {
      "id": "top-math-12-09-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "MATH-12-09-T01",
      "title": "Order, Degree & First Order Differential Equations",
      "description": "Order (highest derivative order) and degree (power of highest derivative when polynomial in derivatives), general and particular solutions, variable separable method, homogeneous differential equations dy/dx = F(y/x), and linear differential equations dy/dx + Py = Q via integrating factor IF = e^(int P dx).",
      "sequenceOrder": 1,
      "weightagePercent": 6.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Differential equations relate unknown functions to their derivatives. First-order equations are solved via separation of variables, homogeneous substitutions, or integrating factors.",
        "sections": [
          {
            "heading": "Solution Methods for First-Order ODEs",
            "paragraphs": [
              "Order: Order of highest derivative occurring in the equation.",
              "Degree: Power of highest order derivative after expressing equation as a polynomial in derivatives. Degree is undefined if derivatives are arguments of transcendental functions (e.g. sin(dy/dx) or e^(dy/dx)).",
              "Separation of Variables: Express in form f(x) dx = g(y) dy and integrate both sides directly.",
              "Homogeneous Equations: dy/dx = F(y/x). Substitute y = v x -> dy/dx = v + x (dv/dx), separating v and x.",
              "Linear Differential Equation: dy/dx + P(x) y = Q(x). Integrating Factor IF = e^(int P(x) dx). General solution: y * (IF) = int [Q(x) * (IF)] dx + C."
            ],
            "keyTakeaways": [
              "Number of arbitrary constants in the general solution of an n-th order ODE equals n.",
              "Particular solution has zero arbitrary constants (evaluated using given initial conditions)."
            ],
            "examTips": [
              "Watch for equations in linear form dx/dy + P(y) x = Q(y): here IF = e^(int P(y) dy) and solution is x * (IF) = int [Q(y) * (IF)] dy + C."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing all differential equations have a degree. Equations like e^(dy/dx) + y = x have order 1, but their degree is NOT defined."
        ]
      },
      "formulas": [
        {
          "label": "First-Order Linear ODE Solution",
          "formula": "\\text{IF} = e^{\\int P(x) \\, dx}, \\quad y \\cdot (\\text{IF}) = \\int Q(x) \\cdot (\\text{IF}) \\, dx + C",
          "description": "Integrating factor method for first-order linear differential equations.",
          "variables": [
            {
              "symbol": "\\text{IF}",
              "meaning": "Integrating Factor",
              "unit": "-"
            },
            {
              "symbol": "P(x), Q(x)",
              "meaning": "Coefficient Functions",
              "unit": "-"
            },
            {
              "symbol": "C",
              "meaning": "Arbitrary Constant",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-09-01",
          "title": "Order, Degree & First Order Differential Equations Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Order, Degree & First Order Differential Equations.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-09-01",
          "title": "Order, Degree & First Order Differential Equations",
          "summary": "Order (highest derivative order) and degree (power of highest derivative when polynomial in derivatives), general and particular solutions, variable separable method, homogeneous differential equations dy/dx = F(y/x), and linear differential equations dy/dx + Py = Q via integrating factor IF = e^(int P dx)."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000010": [
    {
      "id": "top-math-12-10-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "MATH-12-10-T01",
      "title": "Dot Product, Cross Product & Geometric Vector Projections",
      "description": "Vectors, magnitude, direction cosines and direction ratios, addition of vectors, scalar (dot) product a . b = |a||b| cos theta, projection of vector, vector (cross) product a x b = |a||b| sin theta n_hat, right-hand rule, and area of parallelogram and triangle.",
      "sequenceOrder": 1,
      "weightagePercent": 6.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Vector algebra handles physical quantities possessing magnitude and spatial direction. Dot products yield scalars measuring collinearity and projections, while cross products yield orthogonal vectors measuring perpendicularity and area.",
        "sections": [
          {
            "heading": "Dot Product, Cross Product, and Projections",
            "paragraphs": [
              "Direction Cosines: l = cos alpha, m = cos beta, n = cos gamma satisfying l^2 + m^2 + n^2 = 1.",
              "Scalar (Dot) Product: a . b = |a| |b| cos theta = a1 b1 + a2 b2 + a3 b3. Two non-zero vectors are perpendicular if and only if a . b = 0.",
              "Projection of a on b: Projection = (a . b) / |b|.",
              "Vector (Cross) Product: a x b = |a| |b| sin theta n_hat, where n_hat is unit normal given by right-hand thumb rule. Determinant form: a x b = det[[i, j, k], [a1, a2, a3], [b1, b2, b3]].",
              "Cross product is anti-commutative: a x b = -(b x a). Two non-zero vectors are collinear/parallel if and only if a x b = 0.",
              "Area of Parallelogram with adjacent sides a and b = |a x b|; Area of Triangle = (1/2) |a x b|."
            ],
            "keyTakeaways": [
              "Lagrange’s Identity: |a x b|^2 = |a|^2 |b|^2 - (a . b)^2.",
              "i . i = j . j = k . k = 1; i . j = j . k = k . i = 0.",
              "i x j = k, j x k = i, k x i = j; i x i = 0."
            ],
            "examTips": [
              "Projection of a on b has vector b in the denominator! Projection = (a . b) / |b|."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming cross product is commutative. a x b = -(b x a): reversing vector order flips the right-hand normal direction by 180 degrees."
        ]
      },
      "formulas": [
        {
          "label": "Scalar and Vector Products",
          "formula": "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta, \\quad \\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}",
          "description": "Scalar projection dot product and determinant form of orthogonal vector cross product.",
          "variables": [
            {
              "symbol": "\\vec{a}, \\vec{b}",
              "meaning": "3D Vectors",
              "unit": "-"
            },
            {
              "symbol": "\\theta",
              "meaning": "Inter-Vector Angle",
              "unit": "rad"
            }
          ]
        },
        {
          "label": "Vector Projection and Parallelogram Area",
          "formula": "\\text{Proj}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}, \\quad \\text{Area} = |\\vec{a} \\times \\vec{b}|",
          "description": "Scalar projection length and geometric area of vector-spanned parallelogram.",
          "variables": [
            {
              "symbol": "\\text{Proj}",
              "meaning": "Scalar Projection Length",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-sim-top-math-12-10-01",
          "title": "Dot Product, Cross Product & Geometric Vector Projections Interactive 3D Simulation",
          "description": "Contained real-time 3D simulation for Dot Product, Cross Product & Geometric Vector Projections with responsive parameters.",
          "artifactType": "3d_simulation",
          "simulationId": "vector_cross_product"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-10-01",
          "title": "Dot Product, Cross Product & Geometric Vector Projections",
          "summary": "Vectors, magnitude, direction cosines and direction ratios, addition of vectors, scalar (dot) product a . b = |a||b| cos theta, projection of vector, vector (cross) product a x b = |a||b| sin theta n_hat, right-hand rule, and area of parallelogram and triangle.",
          "simulationId": "vector_cross_product"
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000011": [
    {
      "id": "top-math-12-11-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "MATH-12-11-T01",
      "title": "Lines in 3D Space & Shortest Distance between Skew Lines",
      "description": "Direction cosines and ratios of a line, vector and Cartesian equations of a line through a point parallel to vector r = a + lambda b, line passing through two points, angle between two lines, skew lines, and shortest distance d = |(b1 x b2) . (a2 - a1)| / |b1 x b2|.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Lines in three dimensions can intersect, be parallel, or be skew (non-parallel lines in non-intersecting planes). Shortest distance between skew lines determines whether they are coplanar.",
        "sections": [
          {
            "heading": "Equations of Lines and Skew Line Separation",
            "paragraphs": [
              "Vector Equation of Line passing through a with direction b: r = a + lambda b.",
              "Cartesian Form: (x - x1)/a = (y - y1)/b = (z - z1)/c, where a, b, c are direction ratios.",
              "Line Through Two Points: r = a + lambda (b - a), or (x - x1)/(x2 - x1) = (y - y1)/(y2 - y1) = (z - z1)/(z2 - z1).",
              "Skew Lines: Lines in 3D space that are neither parallel nor intersecting. They lie in non-parallel planes.",
              "Shortest Distance Between Skew Lines r = a1 + lambda b1 and r = a2 + mu b2: d = |(b1 x b2) . (a2 - a1)| / |b1 x b2|.",
              "Coplanarity Condition: Two lines are coplanar if and only if shortest distance is zero: (b1 x b2) . (a2 - a1) = 0."
            ],
            "keyTakeaways": [
              "Shortest distance vector is perpendicular to BOTH lines (parallel to b1 x b2).",
              "Distance between parallel lines r = a1 + lambda b and r = a2 + mu b is d = |b x (a2 - a1)| / |b|."
            ],
            "examTips": [
              "If the determinant [[x2-x1, y2-y1, z2-z1], [a1, b1, c1], [a2, b2, c2]] vanishes, the lines intersect and are coplanar!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming two lines in 3D that never meet must be parallel. In 3D space, skew lines never meet yet are not parallel."
        ]
      },
      "formulas": [
        {
          "label": "Shortest Distance between Skew Lines",
          "formula": "d = \\frac{|(\\vec{b}_1 \\times \\vec{b}_2) \\cdot (\\vec{a}_2 - \\vec{a}_1)|}{|\\vec{b}_1 \\times \\vec{b}_2|}",
          "description": "Orthogonal distance between non-parallel, non-intersecting spatial skew lines.",
          "variables": [
            {
              "symbol": "\\vec{a}_1, \\vec{a}_2",
              "meaning": "Position Vectors of Points on Lines",
              "unit": "-"
            },
            {
              "symbol": "\\vec{b}_1, \\vec{b}_2",
              "meaning": "Direction Vectors",
              "unit": "-"
            },
            {
              "symbol": "d",
              "meaning": "Shortest Distance",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-11-01",
          "title": "Lines in 3D Space & Shortest Distance between Skew Lines Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Lines in 3D Space & Shortest Distance between Skew Lines.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-11-01",
          "title": "Lines in 3D Space & Shortest Distance between Skew Lines",
          "summary": "Direction cosines and ratios of a line, vector and Cartesian equations of a line through a point parallel to vector r = a + lambda b, line passing through two points, angle between two lines, skew lines, and shortest distance d = |(b1 x b2) . (a2 - a1)| / |b1 x b2|."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000012": [
    {
      "id": "top-math-12-12-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "MATH-12-12-T01",
      "title": "Mathematical Formulation & Graphical Corner-Point Method",
      "description": "Linear programming problem (LPP) terminology: objective function Z = ax + by, linear constraints, non-negative restrictions x >= 0, y >= 0, feasible region, convex polygon, Corner Point Theorem, bounded and unbounded feasible regions.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Linear programming optimizes a linear objective function subject to linear inequality constraints. The Fundamental Corner Point Theorem proves optimal solutions occur at extreme vertices of the convex feasible region.",
        "sections": [
          {
            "heading": "Feasible Polygons and Corner Point Optimization",
            "paragraphs": [
              "Objective Function: Z = ax + by, to be maximized or minimized.",
              "Feasible Region: Common region determined by all constraints including non-negativity constraints x >= 0, y >= 0. Feasible region is always a convex polygon.",
              "Corner Point Theorem 1: If the feasible region is bounded, the objective function Z attains both an absolute maximum and an absolute minimum at corner points (vertices).",
              "Corner Point Theorem 2: If the feasible region is unbounded, optimal value M found at corner points is maximum if and only if open half-plane ax + by > M has no points in common with the feasible region.",
              "Multiple Optimal Solutions: If the objective function attains the same optimal value at two corner points, it attains the same optimal value at every point on the line segment connecting them."
            ],
            "keyTakeaways": [
              "Non-negativity constraints x >= 0, y >= 0 restrict the feasible region strictly to the first quadrant.",
              "If the feasible region is empty (no common points), there is NO feasible solution."
            ],
            "examTips": [
              "For unbounded feasible regions, you MUST graph the line ax + by = M and verify whether the open half-plane intersects the feasible region before declaring M as optimal!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming an unbounded feasible region always has an optimal solution. An unbounded region may have no maximum if ax + by can grow indefinitely."
        ]
      },
      "formulas": [
        {
          "label": "Linear Objective Function & Constraints",
          "formula": "\\text{Maximize / Minimize: } Z = ax + by \\quad \\text{subject to } \\sum a_{ij} x_j \\le b_i, \\; x_j \\ge 0",
          "description": "General mathematical formulation of linear programming problem.",
          "variables": [
            {
              "symbol": "Z",
              "meaning": "Objective Function Value",
              "unit": "-"
            },
            {
              "symbol": "a, b",
              "meaning": "Objective Coefficients",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-12-01",
          "title": "Mathematical Formulation & Graphical Corner-Point Method Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Mathematical Formulation & Graphical Corner-Point Method.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-12-01",
          "title": "Mathematical Formulation & Graphical Corner-Point Method",
          "summary": "Linear programming problem (LPP) terminology: objective function Z = ax + by, linear constraints, non-negative restrictions x >= 0, y >= 0, feasible region, convex polygon, Corner Point Theorem, bounded and unbounded feasible regions."
        }
      ]
    }
  ],
  "c0000032-0000-0000-0000-000000000013": [
    {
      "id": "top-math-12-13-01",
      "subjectId": "mathematics",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000032-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "MATH-12-13-T01",
      "title": "Conditional Probability, Bayes’ Theorem & Random Variables",
      "description": "Conditional probability P(A|B) = P(A intersection B) / P(B), multiplication theorem on probability, independent events P(A intersection B) = P(A) P(B), Theorem of Total Probability, Bayes’ theorem for posterior probabilities, probability distributions of random variable, mean (expected value) E(X) = sum(xi pi).",
      "sequenceOrder": 1,
      "weightagePercent": 7.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Conditional probability updates probability estimates upon receiving partial information. Bayes' theorem computes posterior probability of causes given observed effects.",
        "sections": [
          {
            "heading": "Bayes’ Posterior Theorem and Random Distributions",
            "paragraphs": [
              "Conditional Probability: P(A | B) = P(A cap B) / P(B), provided P(B) != 0.",
              "Independent Events: A and B are independent if occurrence of one does not affect the other: P(A cap B) = P(A) * P(B), meaning P(A | B) = P(A).",
              "Theorem of Total Probability: If E1, E2, ... En partition sample space S, then for any event A: P(A) = sum(P(Ei) * P(A | Ei)).",
              "Bayes’ Theorem: P(Ei | A) = [P(Ei) * P(A | Ei)] / [sum_{j=1}^n P(Ej) * P(A | Ej)]. Computes inverse probability of cause Ei given effect A.",
              "Random Variable: Real-valued function defined on sample space. Probability distribution satisfies: pi >= 0 and sum(pi) = 1.",
              "Mean (Expectation): mu = E(X) = sum(xi * pi). Variance: Var(X) = E(X^2) - [E(X)]^2 = sum(xi^2 * pi) - mu^2."
            ],
            "keyTakeaways": [
              "If A and B are independent, then A and B' are also independent, and A' and B' are also independent.",
              "Mutually exclusive events with non-zero probability can NEVER be independent (since P(A cap B) = 0 != P(A) * P(B))."
            ],
            "examTips": [
              "In Bayes' theorem word problems, clearly define the hypothesis events E1, E2 (the source/box/cause chosen) and the observed event A (the defective item/colour observed)!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming independent and mutually exclusive are synonymous. Mutually exclusive means events cannot happen together (disjoint); independent means probability of one does not change knowing the other."
        ]
      },
      "formulas": [
        {
          "label": "Bayes’ Theorem Formulation",
          "formula": "P(E_i | A) = \\frac{P(E_i) P(A | E_i)}{\\sum_{j=1}^n P(E_j) P(A | E_j)}",
          "description": "Calculates posterior probability of cause Ei given observed evidence A.",
          "variables": [
            {
              "symbol": "P(E_i | A)",
              "meaning": "Posterior Probability",
              "unit": "-"
            },
            {
              "symbol": "P(E_i)",
              "meaning": "Prior Probability",
              "unit": "-"
            },
            {
              "symbol": "P(A | E_i)",
              "meaning": "Likelihood",
              "unit": "-"
            }
          ]
        },
        {
          "label": "Expectation & Variance of Random Variable",
          "formula": "E(X) = \\sum x_i p_i, \\quad \\text{Var}(X) = \\sum x_i^2 p_i - [E(X)]^2",
          "description": "Expected value and variance of discrete probability distribution.",
          "variables": [
            {
              "symbol": "E(X)",
              "meaning": "Mathematical Expectation (Mean)",
              "unit": "-"
            },
            {
              "symbol": "\\text{Var}(X)",
              "meaning": "Variance of Random Variable",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-math-12-13-01",
          "title": "Conditional Probability, Bayes’ Theorem & Random Variables Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Conditional Probability, Bayes’ Theorem & Random Variables.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-math-12-13-01",
          "title": "Conditional Probability, Bayes’ Theorem & Random Variables",
          "summary": "Conditional probability P(A|B) = P(A intersection B) / P(B), multiplication theorem on probability, independent events P(A intersection B) = P(A) P(B), Theorem of Total Probability, Bayes’ theorem for posterior probabilities, probability distributions of random variable, mean (expected value) E(X) = sum(xi pi)."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000001": [
    {
      "id": "top-bio-11-01-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "BIO-11-01-T01",
      "title": "Taxonomic Hierarchy & Binomial Nomenclature",
      "description": "Characteristics of living organisms, biodiversity, Carolus Linnaeus's binomial nomenclature rules (ICBN and ICZN), and taxonomic hierarchy (Species, Genus, Family, Order, Class, Phylum/Division, Kingdom).",
      "sequenceOrder": 1,
      "weightagePercent": 2.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Taxonomy classifies biological diversity into hierarchical categories. Linnaeus established standardized Latin binomial nomenclature, identifying every organism by genus and species epithet.",
        "sections": [
          {
            "heading": "Taxonomic Hierarchy and Binomial Rules",
            "paragraphs": [
              "Defining Properties of Life: Metabolism and cellular organization are defining features without exception; growth and reproduction are characteristics with exceptions (e.g. sterile worker bees, mules).",
              "Binomial Nomenclature (Linnaeus): Biological names are Latinized; the first word denotes Genus (capitalized) and the second denotes Specific Epithet (lowercase). Written in italics or underlined separately when handwritten.",
              "Taxonomic Hierarchy (Obligate Categories): Species -> Genus -> Family -> Order -> Class -> Division/Phylum -> Kingdom. Moving up from species to kingdom, the number of common characteristics decreases."
            ],
            "keyTakeaways": [
              "Taxon represents a taxonomic group of any rank (e.g. Mammalia, Insecta, Chordata are all taxa).",
              "Division is used for plants, whereas Phylum is used for animals."
            ],
            "examTips": [
              "Homo sapiens taxonomy: Genus Homo, Family Hominidae, Order Primata, Class Mammalia, Phylum Chordata, Kingdom Animalia."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing consciousness is not a defining property. Consciousness (awareness of environment and response to external stimuli) is a defining feature of all living organisms."
        ]
      },
      "formulas": [
        {
          "label": "Taxonomic Species Similarity Index",
          "formula": "\\text{Common Traits} \\propto \\frac{1}{\\text{Hierarchical Rank}} \\quad (\\text{Species} > \\text{Genus} > \\text{Family} > \\dots > \\text{Kingdom})",
          "description": "Inverse relationship between taxonomic level height and degree of shared morphological/genetic traits.",
          "variables": [
            {
              "symbol": "\\text{Rank}",
              "meaning": "Taxonomic Categorical Level",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-01-01",
          "title": "Taxonomic Hierarchy & Binomial Nomenclature Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Taxonomic Hierarchy & Binomial Nomenclature.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-01-01",
          "title": "Taxonomic Hierarchy & Binomial Nomenclature",
          "summary": "Characteristics of living organisms, biodiversity, Carolus Linnaeus's binomial nomenclature rules (ICBN and ICZN), and taxonomic hierarchy (Species, Genus, Family, Order, Class, Phylum/Division, Kingdom)."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000002": [
    {
      "id": "top-bio-11-02-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "BIO-11-02-T01",
      "title": "Five Kingdom System, Fungi & Acellular Entities",
      "description": "R.H. Whittaker's 1969 Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia), Archaebacteria, Cyanobacteria, Fungal classes (Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes), Viruses, Viroids, and Lichens.",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Whittaker organized living organisms into five kingdoms based on cell structure, body organization, mode of nutrition, reproduction, and phylogenetic relationships.",
        "sections": [
          {
            "heading": "Whittaker’s Kingdoms and Acellular Pathogens",
            "paragraphs": [
              "Criteria for 5 Kingdoms: Cell structure (prokaryotic vs eukaryotic), thallus organization, mode of nutrition (autotrophic vs heterotrophic), reproduction, and phylogenetic relationships.",
              "Kingdom Monera: Solely prokaryotes (bacteria). Archaebacteria survive extreme habitats due to branched-chain lipids in cell membranes (methanogens, halophiles, thermoacidophiles).",
              "Kingdom Protista: Unicellular eukaryotes. Chrysophytes (diatoms, diatomaceous earth), Dinoflagellates (red tide caused by Gonyaulax), Euglenoids, Slime moulds, Protozoans.",
              "Kingdom Fungi: Heterotrophic, chitinous cell walls. Ascomycetes (sac fungi, Penicillium, yeast), Basidiomycetes (club fungi, Agaricus, Puccinia rust), Deuteromycetes (imperfect fungi lacking sexual stage).",
              "Acellular Entities: Viruses are obligate intracellular parasites with genetic material (DNA or RNA, never both) enclosed in a protein capsid. Viroids (T.O. Diener, 1971) are free infectious RNA devoid of protein coats. Prions are abnormally folded infectious proteins."
            ],
            "keyTakeaways": [
              "Lichens are symbiotic associations between an algae (phycobiont, phototrophic) and fungus (mycobiont, absorbs water and minerals). Lichens are sensitive pollution bioindicators that do not grow in SO2 polluted areas.",
              "Diatoms leave behind silica-rich cell wall deposits known as 'diatomaceous earth', used in filtration of oils and polishing."
            ],
            "examTips": [
              "Viruses were crystallized by W.M. Stanley (1935); M.W. Beijerinek (1898) coined the phrase 'Contagium vivum fluidum'."
            ]
          }
        ],
        "commonMisconceptions": [
          "Classifying viruses in Whittaker's kingdoms. Viruses, viroids, and prions have no place in Whittaker's five kingdoms because they are acellular."
        ]
      },
      "formulas": [
        {
          "label": "Whittaker Classification Matrix",
          "formula": "\\text{Organism} \\xrightarrow{\\text{Cell Type}} \\text{Prokaryota (Monera)} \\; \\& \\; \\text{Eukaryota} \\xrightarrow{\\text{Organization}} \\text{Protista / Fungi / Plantae / Animalia}",
          "description": "Decision tree defining Whittaker's 5 kingdom taxonomic assignment.",
          "variables": [
            {
              "symbol": "\\text{Cell Type}",
              "meaning": "Prokaryotic vs Eukaryotic Organization",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-02-01",
          "title": "Five Kingdom System, Fungi & Acellular Entities Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Five Kingdom System, Fungi & Acellular Entities.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-02-01",
          "title": "Five Kingdom System, Fungi & Acellular Entities",
          "summary": "R.H. Whittaker's 1969 Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia), Archaebacteria, Cyanobacteria, Fungal classes (Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes), Viruses, Viroids, and Lichens."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000003": [
    {
      "id": "top-bio-11-03-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "BIO-11-03-T01",
      "title": "Algae, Bryophytes, Pteridophytes & Gymnosperms",
      "description": "Algal divisions (Chlorophyceae, Phaeophyceae, Rhodophyceae), Bryophytes (amphibians of plant kingdom, liverworts and mosses), Pteridophytes (vascular cryptogams, heterospory, seed habit precursor), Gymnosperms (naked seeds, Cycas and Pinus), and alternation of generations.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Plant evolution traces transitions from aquatic thallophytes to terrestrial embryophytes with vascular tissues and reproductive seed adaptations.",
        "sections": [
          {
            "heading": "Morphological Innovations Across Plant Divisions",
            "paragraphs": [
              "Algae: Chlorophyceae (green, chlorophyll a & b, starch storage); Phaeophyceae (brown, chlorophyll a & c, fucoxanthin pigment, laminarin/mannitol food); Rhodophyceae (red, chlorophyll a & d, r-phycoerythrin pigment, floridean starch).",
              "Bryophytes: 'Amphibians of plant kingdom' because they require water for flagellated antherozoid fertilization. Dominant generation is haploid gametophyte; sporophyte is dependent on gametophyte.",
              "Pteridophytes: First terrestrial plants possessing vascular tissues (xylem and phloem). Dominant plant body is diploid sporophyte. Heterospory in Selaginella and Salvinia (producing microspores and megaspores) is an essential evolutionary precursor to the seed habit.",
              "Gymnosperms: Ovules are not enclosed by ovary walls; seeds remain naked before and after fertilization. Cycas exhibits unbranched stem and coralloid roots with N2-fixing cyanobacteria; Pinus has mycorrhizal roots."
            ],
            "keyTakeaways": [
              "Agar-agar is obtained from red algae Gelidium and Gracilaria, used to culture microbes and prepare jellies.",
              "Peat moss Sphagnum provides fuel and packing material for trans-shipment of living material due to its immense water-holding capacity."
            ],
            "examTips": [
              "Heterospory (development of megaspores inside megasporangia retention) in Pteridophytes Selaginella is considered the decisive milestone toward the evolution of the seed habit!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing gymnosperms produce fruits. Fruits develop exclusively from ovary walls; gymnosperms lack ovaries and therefore produce naked seeds."
        ]
      },
      "formulas": [
        {
          "label": "Alternation of Generations Ratio",
          "formula": "\\text{Haplontic: } n \\text{ dominant (zygotic meiosis)}, \\quad \\text{Diplontic: } 2n \\text{ dominant (gametic meiosis)}",
          "description": "Ploidy cycle across algal versus gymnosperm/angiosperm lifecycles.",
          "variables": [
            {
              "symbol": "n, 2n",
              "meaning": "Haploid and Diploid Ploidy States",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-03-01",
          "title": "Algae, Bryophytes, Pteridophytes & Gymnosperms Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Algae, Bryophytes, Pteridophytes & Gymnosperms.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-03-01",
          "title": "Algae, Bryophytes, Pteridophytes & Gymnosperms",
          "summary": "Algal divisions (Chlorophyceae, Phaeophyceae, Rhodophyceae), Bryophytes (amphibians of plant kingdom, liverworts and mosses), Pteridophytes (vascular cryptogams, heterospory, seed habit precursor), Gymnosperms (naked seeds, Cycas and Pinus), and alternation of generations."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000004": [
    {
      "id": "top-bio-11-04-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000004",
      "nodeType": "topic",
      "code": "BIO-11-04-T01",
      "title": "Basis of Classification & Animal Phyla",
      "description": "Levels of organization, symmetry (radial vs bilateral), diploblastic vs triploblastic, coelom (acoelomate, pseudocoelomate, coelomate), non-chordate phyla (Porifera to Hemichordata), and Chordate classes (Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia).",
      "sequenceOrder": 1,
      "weightagePercent": 5.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Animal taxonomy is categorized by fundamental body architecture: germ layers, body symmetry, gut openings, coelom segmentation, and notochord development.",
        "sections": [
          {
            "heading": "Body Plans and Diagnostic Phylum Features",
            "paragraphs": [
              "Porifera: Cellular grade, canal system (ostia -> spongocoel -> osculum), choanocytes (collar cells) line spongocoel.",
              "Cnidaria / Coelenterata: Tissue grade, radial symmetry, cnidoblasts with stinging capsules (nematocysts), metagenesis (alternation between polyp and medusa in Obelia).",
              "Platyhelminthes: Flatworms, bilateral symmetry, triploblastic, acoelomate, flame cells for osmoregulation.",
              "Aschelminthes / Nematoda: Pseudocoelomate, roundworms with complete alimentary canal and muscular pharynx.",
              "Annelida: Metameric segmentation, true coelom, closed circulatory system, nephridia for excretion.",
              "Arthropoda: Largest phylum, chitinous exoskeleton, jointed appendages, Malpighian tubules for excretion, open circulation.",
              "Mollusca: Second largest phylum, soft unsegmented body covered by calcareous shell, radula feeding organ.",
              "Echinodermata: Spiny skinned, water vascular system for locomotion and food capture, adult radial and larval bilateral symmetry.",
              "Chordata: Possess notochord, dorsal hollow nerve cord, pharyngeal gill slits, and post-anal tail at some stage of development."
            ],
            "keyTakeaways": [
              "Aschelminthes are the ONLY pseudocoelomate phylum in the animal kingdom.",
              "Echinoderms exhibit secondary radial symmetry: larvae are bilaterally symmetrical, but adults are pentaradial."
            ],
            "examTips": [
              "Chordates vs Non-chordates: Chordates have dorsal hollow single nerve cord, ventral heart, and post-anal tail; non-chordates have ventral solid double nerve cord and dorsal heart."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing adult echinoderms are primitive because of radial symmetry. Echinoderms are advanced deuterostomes that secondarily evolved radial symmetry from bilateral ancestors."
        ]
      },
      "formulas": [
        {
          "label": "Animal Body Plan Coelomic Stratification",
          "formula": "\\text{Acoelomate (Flatworms)} \\subset \\text{Pseudocoelomate (Roundworms)} \\subset \\text{Coelomate (Annelids to Chordates)}",
          "description": "Evolutionary progression of the body cavity (coelom).",
          "variables": [
            {
              "symbol": "\\text{Coelom}",
              "meaning": "Mesoderm-lined Secondary Body Cavity",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-04-01",
          "title": "Basis of Classification & Animal Phyla Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Basis of Classification & Animal Phyla.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-04-01",
          "title": "Basis of Classification & Animal Phyla",
          "summary": "Levels of organization, symmetry (radial vs bilateral), diploblastic vs triploblastic, coelom (acoelomate, pseudocoelomate, coelomate), non-chordate phyla (Porifera to Hemichordata), and Chordate classes (Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia)."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000005": [
    {
      "id": "top-bio-11-05-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "BIO-11-05-T01",
      "title": "Root, Stem, Leaf Modifications, Inflorescence & Flower",
      "description": "Root regions and modifications (pneumatophores, prop roots), stem modifications (tendrils, phylloclades), leaf venation and phyllotaxy, inflorescence (racemose vs cymose), flower floral parts, placentation types, and semi-technical family descriptions.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Angiosperm morphology explores organ adaptations for support, storage, aeration, and reproductive pollination across diverse ecological niches.",
        "sections": [
          {
            "heading": "Floral Architecture and Placentation Schemes",
            "paragraphs": [
              "Root Regions: Root cap -> Region of meristematic activity -> Region of elongation (responsible for root growth) -> Region of maturation (produces epidermal root hairs for absorption).",
              "Modifications: Pneumatophores in Rhizophora grow vertically upward for respiration in saline swamps; prop roots in banyan tree for mechanical support.",
              "Placentation Types: Marginal (pea), Axile (tomato, lemon, china rose), Parietal (mustard, Argemone), Free-central (Dianthus, Primrose), Basal (sunflower, marigold).",
              "Flower Symmetry: Actinomorphic (radial: mustard, datura, chilli); Zygomorphic (bilateral: pea, gulmohur, bean, cassia); Asymmetric (canna)."
            ],
            "keyTakeaways": [
              "In basal placentation, single ovule is attached at the base of unilocular ovary (sunflower, marigold).",
              "Phylloclades are flattened, green photosynthetic stems in xerophytes (Opuntia, Euphorbia) where leaves are reduced to spines to prevent transpiration."
            ],
            "examTips": [
              "Distinguish between Solanaceae (bicarpellary, obligately placed, axile placentation, persistent calyx) and Fabaceae (diadelphous stamens 9+1, vexillary aestivation)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Confusing phylloclade with phyllode. Phylloclade is a modified photosynthetic stem (Opuntia); phyllode is a modified photosynthetic petiole (Australian acacia)."
        ]
      },
      "formulas": [
        {
          "label": "Floral Formula Conventions",
          "formula": "\\% \\; \\text{K}_{(5)} \\; \\text{C}_{1+2+(2)} \\; \\text{A}_{(9)+1} \\; \\underline{\\text{G}}_1 \\quad (\\text{Fabaceae Family Formula})",
          "description": "Standardized floral diagram shorthand representing floral organ symmetries and counts.",
          "variables": [
            {
              "symbol": "\\%",
              "meaning": "Zygomorphic Symmetry",
              "unit": "-"
            },
            {
              "symbol": "\\underline{\\text{G}}",
              "meaning": "Superior Ovary",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-05-01",
          "title": "Root, Stem, Leaf Modifications, Inflorescence & Flower Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Root, Stem, Leaf Modifications, Inflorescence & Flower.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-05-01",
          "title": "Root, Stem, Leaf Modifications, Inflorescence & Flower",
          "summary": "Root regions and modifications (pneumatophores, prop roots), stem modifications (tendrils, phylloclades), leaf venation and phyllotaxy, inflorescence (racemose vs cymose), flower floral parts, placentation types, and semi-technical family descriptions."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000006": [
    {
      "id": "top-bio-11-06-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "BIO-11-06-T01",
      "title": "Meristems, Plant Tissues & Internal Anatomy of Dicot/Monocot",
      "description": "Meristematic tissues (apical, intercalary, lateral), simple tissues (parenchyma, collenchyma, sclerenchyma), complex tissues (xylem tracheids/vessels and phloem sieve tubes/companion cells), epidermal, ground, and vascular tissue systems, anatomy of dicot and monocot root, stem, and leaf.",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Plant anatomy analyzes histological cell arrangements. Monocot and dicot organs diverge in vascular bundle arrangements, secondary growth capacity, and stomatal configurations.",
        "sections": [
          {
            "heading": "Tissue Systems and Organ Cross-Sections",
            "paragraphs": [
              "Xylem: Tracheids and vessels (dead at maturity, lignified walls for water transport). Vessels are absent in gymnosperms (tracheids only). Xylem parenchyma is the only living xylem element.",
              "Phloem: Sieve tube elements (enucleated at maturity, connected by companion cells), phloem parenchyma, and phloem fibres.",
              "Dicot Stem vs Monocot Stem: Dicot stem has vascular bundles arranged in a ring, open with cambium (capable of secondary growth); Monocot stem has scattered vascular bundles, closed without cambium, surrounded by sclerenchymatous bundle sheath.",
              "Dicot Root vs Monocot Root: Dicot root has 2 to 4 (diarch to tetrarch) xylem bundles; Monocot root has polyarch (more than 6) xylem bundles with large, well-developed pith."
            ],
            "keyTakeaways": [
              "Collenchyma provides mechanical support to growing parts (young stems, petioles) and has pectin thickenings at corners.",
              "Casparian strips in root endodermis are made of impermeable waxy suberin, forcing symplastic radial water movement."
            ],
            "examTips": [
              "Protoxylem orientation: Stem has ENDARCH xylem (protoxylem inside, metaxylem outside); Root has EXARCH xylem (protoxylem outside, metaxylem inside)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing mature sieve tube elements are dead because they lack nuclei. Mature sieve tubes are living; their cytoplasmic functions are governed by companion cells via plasmodesmata."
        ]
      },
      "formulas": [
        {
          "label": "Vascular Bundle Orientation Index",
          "formula": "\\text{Root: Exarch } (\\text{Protoxylem Outward}), \\quad \\text{Stem: Endarch } (\\text{Protoxylem Inward})",
          "description": "Anatomical differentiation rule for primary xylem development.",
          "variables": [
            {
              "symbol": "\\text{Protoxylem}",
              "meaning": "First Formed Primary Xylem",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-06-01",
          "title": "Meristems, Plant Tissues & Internal Anatomy of Dicot/Monocot Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Meristems, Plant Tissues & Internal Anatomy of Dicot/Monocot.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-06-01",
          "title": "Meristems, Plant Tissues & Internal Anatomy of Dicot/Monocot",
          "summary": "Meristematic tissues (apical, intercalary, lateral), simple tissues (parenchyma, collenchyma, sclerenchyma), complex tissues (xylem tracheids/vessels and phloem sieve tubes/companion cells), epidermal, ground, and vascular tissue systems, anatomy of dicot and monocot root, stem, and leaf."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000007": [
    {
      "id": "top-bio-11-07-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "BIO-11-07-T01",
      "title": "Epithelial, Connective, Muscular & Frog Anatomy",
      "description": "Animal tissues: epithelial (squamous, cuboidal, columnar, ciliated), cell junctions (tight, adhering, gap), connective (areolar, adipose, bone, cartilage, blood), muscular (skeletal, smooth, cardiac), and morphology and organ systems of frog (Rana tigrina).",
      "sequenceOrder": 1,
      "weightagePercent": 3.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Animal histology coordinates specialized cell lineages into functional tissues. Frog anatomy serves as the representative vertebrate model for circulatory, digestive, and urogenital physiology.",
        "sections": [
          {
            "heading": "Tissue Junctions and Frog Physiology",
            "paragraphs": [
              "Epithelial Tissues: Squamous (diffusion boundary, lung alveoli, blood capillary walls); Cuboidal (absorption and secretion, nephron tubules); Columnar (stomach and intestine lining with microvilli).",
              "Cell Junctions: Tight junctions prevent leakage across epithelial sheet; Adhering junctions cement neighboring cells together; Gap junctions facilitate rapid ionic communication and electrical coupling.",
              "Muscular Tissues: Skeletal (striated, voluntary, multinucleated); Smooth (unstriated, spindle-shaped, involuntary, uninucleate); Cardiac (striated, involuntary, with intercalated discs containing gap junctions).",
              "Frog (Rana tigrina): Poikilothermic (cold-blooded), cutaneous and pulmonary respiration, 3-chambered heart (two atria, one ventricle), hepatic and renal portal systems, ureotelic excretion."
            ],
            "keyTakeaways": [
              "Intercalated discs in cardiac muscle allow rapid wave-like transmission of electrical depolarization across the heart.",
              "Frog RBCs are nucleated, oval, and contain hemoglobin (unlike non-nucleated biconcave mammalian RBCs)."
            ],
            "examTips": [
              "In male frogs, Bidder’s canal is located inside the kidney and serves for passage of spermatozoa into the urogenital duct."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming frog heart has two ventricles. Amphibians possess a 3-chambered heart with two atria and a single undivided ventricle where oxygenated and deoxygenated blood mix partially."
        ]
      },
      "formulas": [
        {
          "label": "Cardiac Chamber Ratio in Vertebrate Evolution",
          "formula": "\\text{Fish (2-chamber)} \\longrightarrow \\text{Amphibian/Reptile (3-chamber)} \\longrightarrow \\text{Bird/Mammal (4-chamber)}",
          "description": "Evolutionary sequence of vertebrate cardiovascular septation.",
          "variables": [
            {
              "symbol": "\\text{Chambers}",
              "meaning": "Heart Cavities Count",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-07-01",
          "title": "Epithelial, Connective, Muscular & Frog Anatomy Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Epithelial, Connective, Muscular & Frog Anatomy.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-07-01",
          "title": "Epithelial, Connective, Muscular & Frog Anatomy",
          "summary": "Animal tissues: epithelial (squamous, cuboidal, columnar, ciliated), cell junctions (tight, adhering, gap), connective (areolar, adipose, bone, cartilage, blood), muscular (skeletal, smooth, cardiac), and morphology and organ systems of frog (Rana tigrina)."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000011": [
    {
      "id": "top-bio-11-08-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "BIO-11-08-T01",
      "title": "Fluid Mosaic Model, Endomembrane System & Organelles",
      "description": "Cell theory (Schleiden, Schwann, Virchow omnis cellula-e-cellula), prokaryotic vs eukaryotic cells, Singer-Nicolson Fluid Mosaic Model, endomembrane system (ER, Golgi apparatus, lysosomes, vacuoles), mitochondria (semi-autonomous, 70S ribosomes), plastids, and 9+2 axoneme cilia/flagella.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The cell is the structural and functional unit of all life. Eukaryotes compartmentalize cellular metabolic processes within specialized membrane-bound organelles.",
        "sections": [
          {
            "heading": "Membrane Architecture and Endomembrane Coordination",
            "paragraphs": [
              "Fluid Mosaic Model (Singer & Nicolson, 1972): Phospholipid bilayer with polar hydrophilic heads facing outward and non-polar hydrophobic fatty acid tails facing inward. Quasi-fluid nature of lipids enables lateral movement of proteins within membrane.",
              "Endomembrane System: Group of organelles whose functions are coordinated: Endoplasmic Reticulum (RER for protein synthesis, SER for lipid synthesis), Golgi apparatus (packaging and glycosylation of proteins into glycoproteins/glycolipids), Lysosomes (acid hydrolases optimal at pH 5), and Vacuoles.",
              "Mitochondria: Double-membraned powerhouses. Outer membrane smooth, inner membrane folded into cristae to increase surface area for ATP synthesis (F0-F1 ATP synthase complexes). Contain circular dsDNA, 70S ribosomes, dividing by fission (endosymbiotic origin).",
              "Chloroplasts: Stroma containing thylakoids stacked into grana. Thylakoid membranes contain chlorophyll pigments.",
              "Cilia and Flagella: 9 + 2 microtubule doublet axoneme pattern anchored to basal body."
            ],
            "keyTakeaways": [
              "Peroxisomes, mitochondria, and chloroplasts are NOT part of the endomembrane system because their functions are not coordinated with ER/Golgi.",
              "Eukaryotic ribosomes are 80S (60S + 40S subunits); prokaryotic, mitochondrial, and plastid ribosomes are 70S (50S + 30S subunits)."
            ],
            "examTips": [
              "Golgi apparatus has polarity: convex 'cis' face is forming/receiving face facing ER; concave 'trans' face is maturing/releasing face delivering vesicles."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing all eukaryotic organelles are double-membraned. Lysosomes and vacuoles are single-membraned; ribosomes and centrioles are non-membranous."
        ]
      },
      "formulas": [
        {
          "label": "Ribosomal Svedberg Sedimentation Subunits",
          "formula": "70\\text{S} = 50\\text{S} + 30\\text{S} \\; (\\text{Prokaryotes/Mitochondria}), \\quad 80\\text{S} = 60\\text{S} + 40\\text{S} \\; (\\text{Eukaryotic Cytoplasm})",
          "description": "Sedimentation coefficient Svedberg (S) non-additive subunit relationships.",
          "variables": [
            {
              "symbol": "\\text{S}",
              "meaning": "Svedberg Unit (Sedimentation Rate)",
              "unit": "10^{-13} \\text{ s}"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-08-01",
          "title": "Fluid Mosaic Model, Endomembrane System & Organelles Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Fluid Mosaic Model, Endomembrane System & Organelles.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-08-01",
          "title": "Fluid Mosaic Model, Endomembrane System & Organelles",
          "summary": "Cell theory (Schleiden, Schwann, Virchow omnis cellula-e-cellula), prokaryotic vs eukaryotic cells, Singer-Nicolson Fluid Mosaic Model, endomembrane system (ER, Golgi apparatus, lysosomes, vacuoles), mitochondria (semi-autonomous, 70S ribosomes), plastids, and 9+2 axoneme cilia/flagella."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000009": [
    {
      "id": "top-bio-11-09-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "BIO-11-09-T01",
      "title": "Enzyme Kinetics, Michaelis-Menten & Inhibition",
      "description": "Amino acids (zwitterions), carbohydrates, lipids, nucleotides, primary/secondary/tertiary/quaternary protein structures, enzymes as biocatalysts, activation energy reduction, Michaelis-Menten Vmax and Km, competitive vs non-competitive inhibition.",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Enzymes are specialized protein catalysts accelerating biochemical reactions by lowering activation energy barriers. Enzyme kinetics characterizes catalytic efficiency and substrate affinity.",
        "sections": [
          {
            "heading": "Enzyme Mechanism and Inhibition Models",
            "paragraphs": [
              "Catalytic Action: Enzymes lower activation energy (Ea) without altering the equilibrium constant or net Delta G of the reaction.",
              "Michaelis Constant (Km): Substrate concentration at which reaction rate reaches exactly half of maximum velocity (Vmax / 2). Lower Km indicates higher enzyme affinity for substrate.",
              "Competitive Inhibition: Inhibitor closely resembles substrate in structure and competes for the active site (e.g. malonate inhibits succinate dehydrogenase). Vmax remains unchanged; apparent Km increases. Overcome by adding excess substrate.",
              "Non-Competitive Inhibition: Inhibitor binds to allosteric site altering enzyme conformation. Vmax decreases; Km remains unchanged."
            ],
            "keyTakeaways": [
              "Co-factors: Prosthetic groups (tightly bound organic: e.g. haem in catalase), Co-enzymes (transient organic, derived from vitamins: e.g. NAD, NADP), Metal ions (e.g. Zn2+ in carboxypeptidase).",
              "Apoenzyme + Co-factor = Holoenzyme (active catalytic complex)."
            ],
            "examTips": [
              "Competitive inhibition: Km increases, Vmax constant. Non-competitive inhibition: Km constant, Vmax decreases. Memorize this exact comparison for NEET!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing enzymes change the free energy Delta G of a reaction. Enzymes alter only the activation energy barrier Ea, leaving Delta G and Keq completely untouched."
        ]
      },
      "formulas": [
        {
          "label": "Michaelis-Menten Enzyme Kinetics",
          "formula": "v = \\frac{V_{\\max} [S]}{K_m + [S]}, \\quad \\text{At } v = \\frac{V_{\\max}}{2}, \\; [S] = K_m",
          "description": "Fundamental hyperbolic rate equation for single-substrate enzyme catalyzed reactions.",
          "variables": [
            {
              "symbol": "v",
              "meaning": "Reaction Velocity",
              "unit": "mol/(L s)"
            },
            {
              "symbol": "V_{\\max}",
              "meaning": "Maximum Velocity",
              "unit": "mol/(L s)"
            },
            {
              "symbol": "K_m",
              "meaning": "Michaelis Constant",
              "unit": "mol/L"
            },
            {
              "symbol": "[S]",
              "meaning": "Substrate Concentration",
              "unit": "mol/L"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-09-01",
          "title": "Enzyme Kinetics, Michaelis-Menten & Inhibition Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Enzyme Kinetics, Michaelis-Menten & Inhibition.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-09-01",
          "title": "Enzyme Kinetics, Michaelis-Menten & Inhibition",
          "summary": "Amino acids (zwitterions), carbohydrates, lipids, nucleotides, primary/secondary/tertiary/quaternary protein structures, enzymes as biocatalysts, activation energy reduction, Michaelis-Menten Vmax and Km, competitive vs non-competitive inhibition."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000010": [
    {
      "id": "top-bio-11-10-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "BIO-11-10-T01",
      "title": "Mitosis, Meiosis, Synaptonemal Complex & Crossing Over",
      "description": "Cell cycle phases (G1, S, G2, M, G0 quiescent stage), DNA replication in S phase, stages of mitosis (prophase, metaphase, anaphase, telophase), stages of meiosis I (leptotene, zygotene, pachytene, diplotene, diakinesis), synaptonemal complex, crossing over by recombinase, and meiosis II.",
      "sequenceOrder": 1,
      "weightagePercent": 5.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The cell cycle ensures faithful genetic replication and partitioning. Mitosis produces genetically identical diploid clones; meiosis introduces genetic recombination through crossing over and halves the chromosome count for sexual reproduction.",
        "sections": [
          {
            "heading": "Meiotic Recombination and Chromosome Segregation",
            "paragraphs": [
              "Interphase: G1 (cell growth), S phase (DNA replication: DNA content doubles from 2C to 4C, chromosome count remains 2n), G2 (protein synthesis for spindle). Quiescent stage (G0): metabolically active but non-dividing.",
              "Mitosis: Metaphase (chromosomes align on equatorial metaphase plate, kinetochores attach to spindle fibres); Anaphase (centromeres split, sister chromatids migrate to opposite poles).",
              "Meiosis I Prophase I Sub-stages: (1) Leptotene: chromatin condenses; (2) Zygotene: homologous chromosomes pair (synapsis) mediated by synaptonemal complex forming bivalents; (3) Pachytene: crossing over between non-sister chromatids mediated by enzyme recombinase; (4) Diplotene: dissolution of synaptonemal complex, X-shaped chiasmata become visible; (5) Diakinesis: terminalisation of chiasmata.",
              "Anaphase I: Homologous chromosomes separate while sister chromatids remain associated at their centromeres (reductional division: 2n -> n)."
            ],
            "keyTakeaways": [
              "During S phase, DNA content doubles (2C -> 4C), but chromosome number does NOT change (remains 2n).",
              "Centromere division occurs during Anaphase of Mitosis and Anaphase II of Meiosis, but NEVER during Anaphase I."
            ],
            "examTips": [
              "Oocytes of some vertebrates remain arrested in diplotene of meiosis I for months or years (dictyotene stage)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming centromeres split during Anaphase I. In Anaphase I, homologous chromosomes disjoin, keeping centromeres intact. Centromeres split only in Anaphase II."
        ]
      },
      "formulas": [
        {
          "label": "Cell Division Ploidy and DNA Content Ratios",
          "formula": "\\text{G}_1(2n, 2C) \\xrightarrow{\\text{S phase}} (2n, 4C) \\xrightarrow{\\text{Meiosis I}} (n, 2C) \\xrightarrow{\\text{Meiosis II}} 4 \\times (n, C)",
          "description": "Tracking chromosome ploidy (n) versus DNA mass (C) throughout meiotic division.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Chromosome Number",
              "unit": "-"
            },
            {
              "symbol": "C",
              "meaning": "DNA Mass Equivalent",
              "unit": "pg"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-10-01",
          "title": "Mitosis, Meiosis, Synaptonemal Complex & Crossing Over Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Mitosis, Meiosis, Synaptonemal Complex & Crossing Over.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-10-01",
          "title": "Mitosis, Meiosis, Synaptonemal Complex & Crossing Over",
          "summary": "Cell cycle phases (G1, S, G2, M, G0 quiescent stage), DNA replication in S phase, stages of mitosis (prophase, metaphase, anaphase, telophase), stages of meiosis I (leptotene, zygotene, pachytene, diplotene, diakinesis), synaptonemal complex, crossing over by recombinase, and meiosis II."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000011": [
    {
      "id": "top-bio-11-11-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "BIO-11-11-T01",
      "title": "Light Reactions, Chemiosmosis, Calvin C3 & C4 Pathways",
      "description": "Photosynthetic pigments, Z-scheme photophosphorylation (cyclic and non-cyclic), photolysis of water, Mitchell's chemiosmotic ATP synthesis, Calvin cycle (C3 pathway, RuBisCO), Hatch-Slack C4 pathway (Kranz anatomy, PEPcase), and photorespiration.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Photosynthesis converts radiant solar energy into stable chemical bonds. Light reactions generate ATP and NADPH via thylakoid proton gradients, powering stromal dark enzymatic carbon fixation.",
        "sections": [
          {
            "heading": "Photophosphorylation and Carbon Fixation Pathways",
            "paragraphs": [
              "Light Reactions (Z-Scheme): PS II (P680) absorbs 680 nm light, passes electrons through pheophytin, PQ, cytochrome b6f, PC to PS I (P700), generating NADPH + H+. Water splitting complex associated with PS II on inner thylakoid surface releases O2: 2 H2O -> 4 H+ + 4 e- + O2.",
              "Chemiosmotic Hypothesis (Peter Mitchell): Proton accumulation inside the thylakoid lumen creates a proton gradient (Delta pH). Protons flow through CF0-CF1 ATP synthase channels into stroma, synthesizing ATP.",
              "Calvin Cycle (C3): Carboxylation (CO2 + RuBP -> 2 x 3-PGA by RuBisCO) -> Reduction (consumes 2 ATP + 2 NADPH per CO2) -> Regeneration (consumes 1 ATP). Net for 1 Glucose (6 CO2): 18 ATP + 12 NADPH.",
              "C4 Pathway (Hatch-Slack): Kranz anatomy (mesophyll cells lack RuBisCO, possess PEP carboxylase; bundle sheath cells have RuBisCO, agranal chloroplasts). Primary CO2 acceptor is PEP (3C) forming OAA (4C). Avoids photorespiratory oxygenation losses, optimal at high temperatures."
            ],
            "keyTakeaways": [
              "RuBisCO is the most abundant enzyme on Earth, possessing both carboxylase and oxygenase activity.",
              "In C4 plants, photorespiration is completely absent because CO2 concentration at RuBisCO active sites is kept high by C4 acid decarboxylation."
            ],
            "examTips": [
              "Synthesis of 1 glucose molecule in C3 plants requires 18 ATP and 12 NADPH; in C4 plants it requires 30 ATP and 12 NADPH (12 extra ATP for PEP regeneration)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming dark reactions occur only at night. 'Dark reactions' are light-independent enzymatic reactions that occur continuously in daylight utilizing ATP and NADPH generated by light reactions."
        ]
      },
      "formulas": [
        {
          "label": "Calvin Cycle Stoichiometry per Glucose",
          "formula": "6\\text{CO}_2 + 18\\text{ATP} + 12\\text{NADPH} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 18\\text{ADP} + 18\\text{P}_i + 12\\text{NADP}^+",
          "description": "Net biochemical energetic input required for single hexose glucose synthesis in C3 photosynthesis.",
          "variables": [
            {
              "symbol": "\\text{CO}_2",
              "meaning": "Carbon Dioxide Fixed",
              "unit": "mol"
            },
            {
              "symbol": "\\text{ATP}",
              "meaning": "Adenosine Triphosphate Consumed",
              "unit": "mol"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-11-01",
          "title": "Light Reactions, Chemiosmosis, Calvin C3 & C4 Pathways Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Light Reactions, Chemiosmosis, Calvin C3 & C4 Pathways.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-11-01",
          "title": "Light Reactions, Chemiosmosis, Calvin C3 & C4 Pathways",
          "summary": "Photosynthetic pigments, Z-scheme photophosphorylation (cyclic and non-cyclic), photolysis of water, Mitchell's chemiosmotic ATP synthesis, Calvin cycle (C3 pathway, RuBisCO), Hatch-Slack C4 pathway (Kranz anatomy, PEPcase), and photorespiration."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000012": [
    {
      "id": "top-bio-11-12-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "BIO-11-12-T01",
      "title": "Glycolysis, Krebs Cycle, Electron Transport & Respiratory Quotient",
      "description": "Cellular respiration, Glycolysis (EMP pathway), fermentation, aerobic respiration, TCA / Krebs cycle in mitochondrial matrix, Electron Transport System (ETS) complexes I-IV, oxidative phosphorylation, and Respiratory Quotient (RQ = CO2 evolved / O2 consumed).",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Cellular respiration breaks down organic substrates to release energy trapped as ATP. Glycolysis in the cytoplasm feeds pyruvate into mitochondrial Krebs cycle and oxidative phosphorylation.",
        "sections": [
          {
            "heading": "Glycolytic Substrate Oxidation and ETS ATP Yield",
            "paragraphs": [
              "Glycolysis (EMP Pathway): Occurs in cytoplasm of all living cells. 1 Glucose (6C) -> 2 Pyruvate (3C). Consumes 2 ATP; generates 4 ATP + 2 NADH (net gain = 2 ATP + 2 NADH). Rate-limiting step is catalyzed by phosphofructokinase (PFK).",
              "Link Reaction: Pyruvate enters mitochondrial matrix: Pyruvate + CoA + NAD+ -> Acetyl CoA + CO2 + NADH + H+ (catalyzed by pyruvate dehydrogenase).",
              "Krebs Cycle (TCA): Acetyl CoA (2C) condenses with OAA (4C) to form Citrate (6C). Per Acetyl CoA turn: 3 NADH, 1 FADH2, 1 GTP, 2 CO2. Per Glucose (2 turns): 6 NADH, 2 FADH2, 2 GTP.",
              "ETS Complexes: Complex I (NADH dehydrogenase), Complex II (Succinate dehydrogenase), Complex III (Cytochrome bc1), Complex IV (Cytochrome c oxidase with Cu centers). Terminal electron acceptor is molecular oxygen O2 forming H2O.",
              "Net ATP Yield: Oxidation of 1 NADH yields 3 ATP (or 2.5); 1 FADH2 yields 2 ATP (or 1.5). Total theoretical net yield per glucose is 36 or 38 ATP.",
              "Respiratory Quotient (RQ = CO2 / O2): Carbohydrates = 1.0; Fats (tripalmitin) = 0.7; Proteins = 0.9; Organic acids (malic acid) > 1.0; Anaerobic respiration = infinity."
            ],
            "keyTakeaways": [
              "Cytochrome c is a small, mobile electron-carrier protein attached to the outer surface of the inner mitochondrial membrane.",
              "Respiratory pathway is amphibolic (involves both catabolism and anabolism of precursors)."
            ],
            "examTips": [
              "In fermentation, only less than 7% of total energy in glucose is released, and yeast poisons itself to death when alcohol concentration reaches approximately 13%."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing respiration in plants occurs only in the absence of light. Respiration occurs continuously 24 hours a day in all living plant cells."
        ]
      },
      "formulas": [
        {
          "label": "Respiratory Quotient (RQ)",
          "formula": "\\text{RQ} = \\frac{\\text{Volume of } \\text{CO}_2 \\text{ evolved}}{\\text{Volume of } \\text{O}_2 \\text{ consumed}}, \\quad \\text{RQ}_{\\text{tripalmitin}} = \\frac{102 \\, \\text{CO}_2}{145 \\, \\text{O}_2} \\approx 0.7",
          "description": "Ratio of carbon dioxide released to oxygen consumed during aerobic substrate oxidation.",
          "variables": [
            {
              "symbol": "\\text{RQ}",
              "meaning": "Respiratory Quotient",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-12-01",
          "title": "Glycolysis, Krebs Cycle, Electron Transport & Respiratory Quotient Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Glycolysis, Krebs Cycle, Electron Transport & Respiratory Quotient.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-12-01",
          "title": "Glycolysis, Krebs Cycle, Electron Transport & Respiratory Quotient",
          "summary": "Cellular respiration, Glycolysis (EMP pathway), fermentation, aerobic respiration, TCA / Krebs cycle in mitochondrial matrix, Electron Transport System (ETS) complexes I-IV, oxidative phosphorylation, and Respiratory Quotient (RQ = CO2 evolved / O2 consumed)."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000013": [
    {
      "id": "top-bio-11-13-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "BIO-11-13-T01",
      "title": "Phytohormones: Auxins, Gibberellins, Cytokinins, Ethylene & ABA",
      "description": "Characteristics of plant growth, differentiation, dedifferentiation, redifferentiation, plant growth regulators (PGRs): Auxins (apical dominance), Gibberellins (bolting), Cytokinins (cell division, delay of senescence), Ethylene (fruit ripening), Abscisic acid (stress hormone), and photoperiodism.",
      "sequenceOrder": 1,
      "weightagePercent": 3.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Plant development integrates intrinsic genetic programs with extrinsic environmental stimuli (light, gravity) mediated by phytohormone signaling cascades.",
        "sections": [
          {
            "heading": "Phytohormone Functions and Developmental Responses",
            "paragraphs": [
              "Auxins (IAA, NAA, 2,4-D): Promote apical dominance (inhibition of lateral buds), root initiation in stem cuttings, parthenocarpy in tomatoes, and selective dicot weedicide (2,4-D).",
              "Gibberellins (GA3): Promote stem elongation in rosetting plants ('bolting' in cabbage, beet), break seed dormancy, increase stalk length in grapes, and hasten malting in brewing.",
              "Cytokinins (Kinetin, Zeatin): Promote cytokinesis, overcome apical dominance, delay leaf senescence (Richmond-Lang effect) by promoting nutrient mobilization.",
              "Ethylene (Gaseous PGR): Promotes horizontal growth of seedlings, fruit ripening (climacteric rise in respiration), breaks seed/bud dormancy, and promotes root hair growth.",
              "Abscisic Acid (ABA): 'Stress hormone', closes stomata during drought, induces seed dormancy, acts as a general plant growth inhibitor antagonistic to gibberellins."
            ],
            "keyTakeaways": [
              "Differentiation: Meristematic cells mature to perform specific functions (loss of division).",
              "Dedifferentiation: Mature living cells regain division capacity under specific conditions (e.g. formation of interfascicular cambium and cork cambium from parenchyma)."
            ],
            "examTips": [
              "Antagonistic hormone pairs: Auxin promotes apical dominance vs Cytokinin promotes lateral bud growth; Gibberellin breaks seed dormancy vs ABA induces seed dormancy."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming ABA is harmful because it inhibits growth. ABA is vital for plant survival, acting as an emergency stress hormone that closes stomata during water deficit."
        ]
      },
      "formulas": [
        {
          "label": "Geometric vs Arithmetic Growth Equations",
          "formula": "L_t = L_0 + r t \\; (\\text{Arithmetic}), \\quad W_1 = W_0 e^{r t} \\; (\\text{Geometric Exponential})",
          "description": "Mathematical models describing linear arithmetic vs exponential geometric cell growth.",
          "variables": [
            {
              "symbol": "L_t, W_1",
              "meaning": "Length / Biomass at Time t",
              "unit": "-"
            },
            {
              "symbol": "r",
              "meaning": "Relative Growth Rate",
              "unit": "s^{-1}"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-13-01",
          "title": "Phytohormones: Auxins, Gibberellins, Cytokinins, Ethylene & ABA Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Phytohormones: Auxins, Gibberellins, Cytokinins, Ethylene & ABA.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-13-01",
          "title": "Phytohormones: Auxins, Gibberellins, Cytokinins, Ethylene & ABA",
          "summary": "Characteristics of plant growth, differentiation, dedifferentiation, redifferentiation, plant growth regulators (PGRs): Auxins (apical dominance), Gibberellins (bolting), Cytokinins (cell division, delay of senescence), Ethylene (fruit ripening), Abscisic acid (stress hormone), and photoperiodism."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000014": [
    {
      "id": "top-bio-11-14-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000014",
      "nodeType": "topic",
      "code": "BIO-11-14-T01",
      "title": "Respiratory Capacities, Gas Transport & Oxygen Dissociation Curve",
      "description": "Human respiratory anatomy, mechanism of breathing (Boyle's law), respiratory volumes and capacities (TV, IRV, ERV, RV, VC, TLC), gas exchange across alveolar membrane, oxygen-hemoglobin dissociation curve, Bohr effect, transport of CO2, and neural regulation of respiration.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Gas exchange occurs across the thin alveolar membrane via simple diffusion driven by partial pressure gradients. Hemoglobin transports oxygen cooperatively, modulated by pH, CO2, and temperature.",
        "sections": [
          {
            "heading": "Pulmonary Capacities and Gas Transport Mechanisms",
            "paragraphs": [
              "Respiratory Volumes: Tidal Volume (TV = 500 mL); Inspiratory Reserve Volume (IRV = 2500-3000 mL); Expiratory Reserve Volume (ERV = 1000-1100 mL); Residual Volume (RV = 1100-1200 mL, cannot be expelled).",
              "Capacities: Vital Capacity (VC = TV + IRV + ERV = 3500-4500 mL); Total Lung Capacity (TLC = VC + RV = 5000-6000 mL). RV and TLC cannot be measured by simple spirometry.",
              "Oxygen Transport: 97% transported bound to hemoglobin (oxyhemoglobin, Hb4(O2)4); 3% dissolved in plasma. Each gram of Hb binds 1.34 mL of O2.",
              "Oxygen Dissociation Curve (Sigmoid): Shifts to the RIGHT (Bohr effect: favors O2 unloading at tissues) by: high pCO2, low pH (high H+), high temperature, and high 2,3-DPG.",
              "Carbon Dioxide Transport: 70% as bicarbonate ions (HCO3^-) mediated by RBC carbonic anhydrase; 20-25% as carbaminohemoglobin; 7% dissolved in plasma. Chloride shift (Hamburger phenomenon) maintains RBC ionic balance."
            ],
            "keyTakeaways": [
              "Respiratory rhythm center is located in the medulla oblongata; pneumotaxic center in the pons moderates rhythm.",
              "Chemosensitive receptors near medulla are sensitive to CO2 and H+ concentrations, NOT to oxygen levels."
            ],
            "examTips": [
              "Every 100 mL of oxygenated blood delivers approximately 5 mL of O2 to tissues under normal conditions; every 100 mL of deoxygenated blood delivers 4 mL of CO2 to alveoli."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing blood oxygen levels regulate normal breathing. The primary physiological driver of human ventilation is arterial pCO2 and H+ concentration, not pO2."
        ]
      },
      "formulas": [
        {
          "label": "Vital Capacity and Lung Volumes",
          "formula": "\\text{VC} = \\text{TV} + \\text{IRV} + \\text{ERV}, \\quad \\text{TLC} = \\text{VC} + \\text{RV}",
          "description": "Standard diagnostic partitioning of total lung capacity into spirometric volumes.",
          "variables": [
            {
              "symbol": "\\text{VC}",
              "meaning": "Vital Capacity",
              "unit": "mL"
            },
            {
              "symbol": "\\text{TV}",
              "meaning": "Tidal Volume (500 mL)",
              "unit": "mL"
            },
            {
              "symbol": "\\text{RV}",
              "meaning": "Residual Volume (1200 mL)",
              "unit": "mL"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-14-01",
          "title": "Respiratory Capacities, Gas Transport & Oxygen Dissociation Curve Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Respiratory Capacities, Gas Transport & Oxygen Dissociation Curve.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-14-01",
          "title": "Respiratory Capacities, Gas Transport & Oxygen Dissociation Curve",
          "summary": "Human respiratory anatomy, mechanism of breathing (Boyle's law), respiratory volumes and capacities (TV, IRV, ERV, RV, VC, TLC), gas exchange across alveolar membrane, oxygen-hemoglobin dissociation curve, Bohr effect, transport of CO2, and neural regulation of respiration."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000015": [
    {
      "id": "top-bio-11-15-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000015",
      "nodeType": "topic",
      "code": "BIO-11-15-T01",
      "title": "Cardiac Cycle, ECG, Double Circulation & Blood Groups",
      "description": "Blood components (plasma, RBCs, WBCs, platelets), ABO and Rh blood groups, erythroblastosis fetalis, blood clotting cascade, human heart anatomy, nodal tissue (SAN pacemaker), cardiac cycle (stroke volume 70 mL, cardiac output = SV x HR), electrocardiogram (ECG P, QRS, T waves), and double circulation.",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The human cardiovascular system operates a high-efficiency four-chambered double circulatory loop driven by an intrinsic autorhythmic myogenic cardiac conduction system.",
        "sections": [
          {
            "heading": "Cardiac Cycle Dynamics and Electrocardiography",
            "paragraphs": [
              "Nodal Tissue: Sinoatrial Node (SAN) in right atrium generates action potentials at 70-75/min (pacemaker), conducting to AVN, Bundle of His, and Purkinje fibres.",
              "Cardiac Cycle (0.8 s duration): Joint diastole (0.4 s) -> Atrial systole (0.1 s, pumps 30% blood into ventricles) -> Ventricular systole (0.3 s, closes AV valves causing first heart sound 'LUB', opens semilunar valves). Ventricular diastole closes semilunar valves causing second heart sound 'DUB'.",
              "Cardiac Output: CO = Stroke Volume (SV = 70 mL) x Heart Rate (HR = 72 bpm) approx 5000 mL/min (5 Litres/min).",
              "Standard ECG: P-wave (atrial depolarization); QRS complex (ventricular depolarization, marks start of ventricular systole); T-wave (ventricular repolarization). Counting QRS complexes gives the heart rate.",
              "Blood Groups: ABO system based on RBC surface antigens A and B. O group is universal donor (lacks A and B antigens); AB group is universal recipient (lacks anti-A and anti-B antibodies). Rh incompatibility in Rh- mother carrying Rh+ fetus causes erythroblastosis fetalis."
            ],
            "keyTakeaways": [
              "A human heart is myogenic because its rhythmic contraction is initiated intrinsically by autoexcitable nodal muscle fibres without neural triggers.",
              "Hepatic portal system carries blood from the intestine to the liver before returning to systemic circulation."
            ],
            "examTips": [
              "The number of QRS complexes in a given time interval equals the patient's heart rate. Elevation of ST segment is a clinical hallmark of myocardial infarction."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing 'LUB' sound is caused by blood splashing. 'LUB' is caused by the sudden acoustic closure of tricuspid and bicuspid (AV) valves at the onset of ventricular systole."
        ]
      },
      "formulas": [
        {
          "label": "Cardiac Output Formula",
          "formula": "\\text{Cardiac Output} = \\text{Stroke Volume} \\times \\text{Heart Rate} = 70 \\text{ mL} \\times 72 \\text{ bpm} \\approx 5040 \\text{ mL/min}",
          "description": "Total volume of blood pumped by each ventricle per minute.",
          "variables": [
            {
              "symbol": "\\text{CO}",
              "meaning": "Cardiac Output",
              "unit": "mL/min"
            },
            {
              "symbol": "\\text{SV}",
              "meaning": "Stroke Volume",
              "unit": "mL"
            },
            {
              "symbol": "\\text{HR}",
              "meaning": "Heart Rate",
              "unit": "bpm"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-15-01",
          "title": "Cardiac Cycle, ECG, Double Circulation & Blood Groups Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Cardiac Cycle, ECG, Double Circulation & Blood Groups.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-15-01",
          "title": "Cardiac Cycle, ECG, Double Circulation & Blood Groups",
          "summary": "Blood components (plasma, RBCs, WBCs, platelets), ABO and Rh blood groups, erythroblastosis fetalis, blood clotting cascade, human heart anatomy, nodal tissue (SAN pacemaker), cardiac cycle (stroke volume 70 mL, cardiac output = SV x HR), electrocardiogram (ECG P, QRS, T waves), and double circulation."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000016": [
    {
      "id": "top-bio-11-16-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000016",
      "nodeType": "topic",
      "code": "BIO-11-16-T01",
      "title": "Nephron Physiology, Counter-Current Mechanism & Renin-Angiotensin",
      "description": "Ammonotelism, ureotelism, uricotelism, kidney macrostructure, nephron histology (Bowman's capsule, glomerulus, PCT, loop of Henle, DCT, collecting duct), urine formation (ultrafiltration, reabsorption, secretion), GFR = 125 mL/min, counter-current multiplier, and RAAS hormonal regulation.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Mammalian kidneys regulate osmolality and eliminate nitrogenous metabolic wastes. The nephron couples high-pressure capillary ultrafiltration with medullary counter-current hyperosmotic gradient generation.",
        "sections": [
          {
            "heading": "Urine Formation and Counter-Current Gradient",
            "paragraphs": [
              "Glomerular Filtration: Glomerular capillary blood pressure filters blood across 3 layers (capillary endothelium, basement membrane, podocyte filtration slits). Glomerular Filtration Rate (GFR) = 125 mL/min = 180 Litres/day. Over 99% of filtrate is reabsorbed (daily urine output = 1.5 L).",
              "PCT: Reabsorbs 70-80% of electrolytes and water, and 100% of glucose and amino acids by active transport. Simple cuboidal brush-border epithelium.",
              "Counter-Current Mechanism: Maintained between Loop of Henle and Vasa Recta. Descending limb of loop of Henle is permeable to water but impermeable to electrolytes (filtrate hypertonic down to 1200 mOsmol/L at hairpin bend). Ascending limb is impermeable to water and actively transports NaCl out into medullary interstitium.",
              "Regulation of Kidney Function: Low blood volume stimulates Juxtaglomerular (JG) cells to release Renin -> converts angiotensinogen to Angiotensin I -> ACE converts to Angiotensin II (potent vasoconstrictor, stimulates adrenal cortex to release Aldosterone, causing Na+ and water reabsorption in DCT). Atrial Natriuretic Factor (ANF) released by atria opposes RAAS via vasodilation."
            ],
            "keyTakeaways": [
              "Juxtamedullary nephrons have long loops of Henle dipping deep into the renal medulla, responsible for producing concentrated hypertonic urine.",
              "Diabetes insipidus is caused by deficiency of Antidiuretic Hormone (ADH / Vasopressin), leading to excessive watery urination (polyuria)."
            ],
            "examTips": [
              "Counter-current mechanism operates between two parallel hairpin loops: the Loop of Henle and the capillary Vasa Recta!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming descending limb of Henle transports salt. The descending limb is strictly permeable to water only; salt is actively pumped out by the ascending limb."
        ]
      },
      "formulas": [
        {
          "label": "Glomerular Filtration Rate (GFR)",
          "formula": "\\text{GFR} = 125 \\text{ mL/min} = 180 \\text{ L/day}, \\quad \\text{Net Filtration Pressure} = P_G - (P_B + \\Pi_G) \\approx 10 \\text{ mmHg}",
          "description": "Daily glomerular filtration volume and hydrostatic net filtration pressure across the glomerular membrane.",
          "variables": [
            {
              "symbol": "\\text{GFR}",
              "meaning": "Glomerular Filtration Rate",
              "unit": "mL/min"
            },
            {
              "symbol": "P_G",
              "meaning": "Glomerular Hydrostatic Pressure",
              "unit": "mmHg"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-16-01",
          "title": "Nephron Physiology, Counter-Current Mechanism & Renin-Angiotensin Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Nephron Physiology, Counter-Current Mechanism & Renin-Angiotensin.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-16-01",
          "title": "Nephron Physiology, Counter-Current Mechanism & Renin-Angiotensin",
          "summary": "Ammonotelism, ureotelism, uricotelism, kidney macrostructure, nephron histology (Bowman's capsule, glomerulus, PCT, loop of Henle, DCT, collecting duct), urine formation (ultrafiltration, reabsorption, secretion), GFR = 125 mL/min, counter-current multiplier, and RAAS hormonal regulation."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000017": [
    {
      "id": "top-bio-11-17-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000017",
      "nodeType": "topic",
      "code": "BIO-11-17-T01",
      "title": "Sarcomere, Sliding Filament Theory & Skeletal Framework",
      "description": "Striated muscle histology, sarcomere structure (A-band, I-band, H-zone, Z-line), contractile proteins (myosin cross-bridges, actin, tropomyosin, troponin), sliding filament theory of muscle contraction, role of Ca2+ from sarcoplasmic reticulum, and human skeleton framework (axial and appendicular).",
      "sequenceOrder": 1,
      "weightagePercent": 4.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Muscle contraction operates via ATP-driven cyclic cross-bridge interactions where thin actin filaments slide over thick myosin filaments, shortening sarcomeres.",
        "sections": [
          {
            "heading": "Sliding Filament Mechanism and Cross-Bridge Cycle",
            "paragraphs": [
              "Sarcomere: Functional unit of contraction between two successive Z-lines. A-band (anisotropic, dark, thick myosin filaments, constant length); I-band (isotropic, light, thin actin filaments, shortens during contraction); H-zone (central myosin zone not overlapped by actin, vanishes during full contraction).",
              "Contractile Proteins: Actin filaments possess two F-actin helices with tropomyosin wound along them. Troponin complex masks myosin-binding sites on actin in resting state.",
              "Excitation-Contraction Coupling: Action potential at neuromuscular junction causes release of acetylcholine -> depolarizes sarcolemma -> releases Ca2+ from sarcoplasmic reticulum -> Ca2+ binds Troponin C -> unmasks active sites on actin.",
              "Cross-Bridge Cycle: Myosin head hydrolyzes ATP -> binds actin forming cross-bridge -> power stroke pulls actin toward center of sarcomere -> new ATP binds myosin head, detaching cross-bridge.",
              "Skeletal System: 206 bones. Axial skeleton (80 bones: skull 22, vertebral column 26, ribs 12 pairs, sternum 1). Appendicular skeleton (126 bones: pectoral girdle 4, pelvic girdle 2, upper limbs 60, lower limbs 60)."
            ],
            "keyTakeaways": [
              "During contraction: Sarcomere shortens, I-band shortens, H-zone narrows/disappears, but the A-band length remains STRICTLY UNCHANGED.",
              "Rigor mortis occurs after death because ATP depletion prevents detachment of myosin cross-bridges from actin."
            ],
            "examTips": [
              "First 7 pairs of ribs are true ribs (vertebrosternal, attached directly to sternum); 8th, 9th, 10th are false ribs (vertebrochondral); 11th and 12th are floating ribs (vertebral, unattached anteriorly)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing myosin filaments shorten during muscle contraction. Filaments do NOT change length; actin filaments slide over myosin filaments."
        ]
      },
      "formulas": [
        {
          "label": "Sarcomere Contraction Band Length Dynamics",
          "formula": "\\Delta(\\text{Sarcomere}) < 0, \\quad \\Delta(\\text{I-Band}) < 0, \\quad \\Delta(\\text{H-Zone}) \\to 0, \\quad \\Delta(\\text{A-Band}) \\equiv 0",
          "description": "Band dimensional changes during physiological sarcomere contraction.",
          "variables": [
            {
              "symbol": "\\text{A-Band}",
              "meaning": "Thick Myosin Band Length",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-17-01",
          "title": "Sarcomere, Sliding Filament Theory & Skeletal Framework Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Sarcomere, Sliding Filament Theory & Skeletal Framework.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-17-01",
          "title": "Sarcomere, Sliding Filament Theory & Skeletal Framework",
          "summary": "Striated muscle histology, sarcomere structure (A-band, I-band, H-zone, Z-line), contractile proteins (myosin cross-bridges, actin, tropomyosin, troponin), sliding filament theory of muscle contraction, role of Ca2+ from sarcoplasmic reticulum, and human skeleton framework (axial and appendicular)."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000018": [
    {
      "id": "top-bio-11-18-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000018",
      "nodeType": "topic",
      "code": "BIO-11-18-T01",
      "title": "Action Potential Conduction, Synapse & Human Brain Architecture",
      "description": "Neuron structure (dendrites, axon, myelin sheath, nodes of Ranvier), generation and conduction of nerve impulse (resting membrane potential -70 mV, Na+/K+ ATPase pump, depolarization via Na+ influx, repolarization via K+ efflux), electrical vs chemical synapses (neurotransmitters), human brain parts (forebrain, midbrain, hindbrain), and reflex arc.",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Neurons conduct electro-chemical impulses via voltage-gated ion channels across excitable membranes, transmitting signals across synaptic clefts using neurotransmitters.",
        "sections": [
          {
            "heading": "Electrochemical Impulses and Central Nervous System",
            "paragraphs": [
              "Resting Membrane Potential (-70 mV): Axon interior is negative relative to exterior. Maintained by Na+/K+ ATPase pump (actively pumps 3 Na+ OUT for every 2 K+ IN, consuming 1 ATP) and high resting membrane permeability to K+ compared to Na+.",
              "Action Potential Generation: Threshold stimulus opens voltage-gated Na+ channels -> rapid Na+ influx causes depolarization (+30 mV spike). Na+ channels inactivate; voltage-gated K+ channels open -> K+ efflux repolarizes membrane back to resting potential.",
              "Synaptic Transmission: Action potential reaching axon terminal triggers Ca2+ influx -> synaptic vesicles fuse with presynaptic membrane -> release neurotransmitter (e.g. Acetylcholine) into synaptic cleft -> binds receptors on postsynaptic membrane opening ligand-gated ion channels.",
              "Human Brain: Forebrain (Cerebrum: two cerebral hemispheres connected by corpus callosum, sensory/motor/association areas; Thalamus: sensory relay station; Hypothalamus: thermoregulation, hunger, thirst, endocrine control via pituitary). Midbrain (Corpora quadrigemina). Hindbrain (Pons, Cerebellum: posture and muscular coordination; Medulla oblongata: cardiovascular, respiration, swallowing centers)."
            ],
            "keyTakeaways": [
              "Saltatory conduction in myelinated nerve fibres jumps from one Node of Ranvier to the next, increasing conduction speed up to 50 times faster than unmyelinated axons.",
              "Corpus callosum is a distinctive tract of nerve fibres connecting the left and right cerebral hemispheres in mammals."
            ],
            "examTips": [
              "Na+/K+ pump stoichiometry: 3 Na+ pumped OUT, 2 K+ pumped IN per ATP hydrolyzed. Memorize this 3:2 ratio!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing action potential amplitude increases with stronger stimuli. Action potentials obey the 'All-or-None Law': stimulus intensity is encoded by firing frequency, not spike amplitude."
        ]
      },
      "formulas": [
        {
          "label": "Na+/K+ ATPase Stoichiometry & Nernst Potential",
          "formula": "3 \\text{ Na}^+_{\\text{inside}} + 2 \\text{ K}^+_{\\text{outside}} + \\text{ATP} \\longrightarrow 3 \\text{ Na}^+_{\\text{outside}} + 2 \\text{ K}^+_{\\text{inside}} + \\text{ADP} + \\text{P}_i, \\quad V_m \\approx -70 \\text{ mV}",
          "description": "Active electrogenic transport maintaining polarized resting axonal membrane potential.",
          "variables": [
            {
              "symbol": "V_m",
              "meaning": "Resting Membrane Potential",
              "unit": "mV"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-18-01",
          "title": "Action Potential Conduction, Synapse & Human Brain Architecture Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Action Potential Conduction, Synapse & Human Brain Architecture.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-18-01",
          "title": "Action Potential Conduction, Synapse & Human Brain Architecture",
          "summary": "Neuron structure (dendrites, axon, myelin sheath, nodes of Ranvier), generation and conduction of nerve impulse (resting membrane potential -70 mV, Na+/K+ ATPase pump, depolarization via Na+ influx, repolarization via K+ efflux), electrical vs chemical synapses (neurotransmitters), human brain parts (forebrain, midbrain, hindbrain), and reflex arc."
        }
      ]
    }
  ],
  "c0000041-0000-0000-0000-000000000019": [
    {
      "id": "top-bio-11-19-01",
      "subjectId": "biology",
      "gradeId": "class_11",
      "boardId": "cbse",
      "parentId": "c0000041-0000-0000-0000-000000000019",
      "nodeType": "topic",
      "code": "BIO-11-19-T01",
      "title": "Endocrine Glands, Hormones & Mechanism of Action",
      "description": "Endocrine glands (hypothalamus, pituitary, pineal, thyroid, parathyroid, thymus, adrenal, pancreas, gonads), peptide vs steroid hormones, hormone feedback loops, second messenger mechanism (cAMP, IP3, Ca2+), and intracellular nuclear receptor gene transcription.",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "The endocrine system coordinates long-term physiological homeostasis via blood-borne chemical messengers (hormones). Hormones act either via cell-surface second messengers or intracellular nuclear receptors.",
        "sections": [
          {
            "heading": "Endocrine Organs and Hormone Signaling Pathways",
            "paragraphs": [
              "Pituitary Gland: Adenohypophysis secretes GH, PRL, TSH, ACTH, LH, FSH. Neurohypophysis stores and releases Oxytocin (milk ejection, uterine labor contraction) and Vasopressin / ADH (water reabsorption in kidney) produced by hypothalamus.",
              "Thyroid Gland: Secretes T3, T4 (regulates basal metabolic rate, BMR; iodine deficiency causes simple goitre), and Thyrocalcitonin (TCT: hypocalcemic, lowers blood Ca2+).",
              "Parathyroid Gland: Parathyroid Hormone (PTH) is hypercalcemic (increases blood Ca2+ by bone resorption and renal reabsorption). PTH and TCT act antagonistically to regulate calcium balance.",
              "Adrenal Gland: Cortex (Mineralocorticoids: Aldosterone; Glucocorticoids: Cortisol). Medulla secretes emergency catecholamines: Adrenaline / Epinephrine and Noradrenaline ('fight or flight' hormones, increase heart rate, glycogenolysis).",
              "Endocrine Pancreas: Islets of Langerhans. Alpha cells secrete Glucagon (hyperglycemic); Beta cells secrete Insulin (hypoglycemic, promotes glucose cellular uptake). Deficiency of insulin causes Diabetes mellitus.",
              "Mechanism of Hormone Action: Protein/Peptide hormones (Insulin, Epinephrine, TSH) are water-soluble and cannot cross lipid membrane: bind cell-surface receptor -> activate G-protein -> generate second messenger (cAMP, IP3, Ca2+) -> biochemical cascade. Lipid-soluble steroid hormones (Estrogen, Testosterone, Cortisol) and thyroid hormones cross membrane -> bind intracellular nuclear receptors -> regulate gene expression."
            ],
            "keyTakeaways": [
              "Melatonin secreted by pineal gland regulates the 24-hour diurnal rhythm (sleep-wake cycle) and body temperature.",
              "Thymus gland secretes thymosins promoting differentiation of T-lymphocytes (cell-mediated immunity); degenerates with age, declining immunity in old people."
            ],
            "examTips": [
              "Know the antagonistic hormone pairs: Insulin (lowers blood glucose) vs Glucagon (raises blood glucose); Calcitonin (lowers blood Ca2+) vs PTH (raises blood Ca2+)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming steroid hormones use cAMP second messengers. Steroid hormones are lipophilic: they cross cell membranes directly and bind intracellular receptors to alter DNA transcription."
        ]
      },
      "formulas": [
        {
          "label": "Calcium Homeostasis Equilibrium",
          "formula": "\\text{Bone Resorption} \\xleftarrow{\\text{PTH (Hypercalcemic)}} [\\text{Ca}^{2+}]_{\\text{plasma}} \\xrightarrow{\\text{Calcitonin (Hypocalcemic)}} \\text{Bone Deposition}",
          "description": "Antagonistic endocrine feedback loop regulating extracellular plasma calcium ion concentration.",
          "variables": [
            {
              "symbol": "[\\text{Ca}^{2+}]",
              "meaning": "Plasma Calcium Concentration",
              "unit": "mg/dL"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-11-19-01",
          "title": "Endocrine Glands, Hormones & Mechanism of Action Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Endocrine Glands, Hormones & Mechanism of Action.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-11-19-01",
          "title": "Endocrine Glands, Hormones & Mechanism of Action",
          "summary": "Endocrine glands (hypothalamus, pituitary, pineal, thyroid, parathyroid, thymus, adrenal, pancreas, gonads), peptide vs steroid hormones, hormone feedback loops, second messenger mechanism (cAMP, IP3, Ca2+), and intracellular nuclear receptor gene transcription."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000001": [
    {
      "id": "top-bio-12-01-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000001",
      "nodeType": "topic",
      "code": "BIO-12-01-T01",
      "title": "Microsporogenesis, Megasporogenesis & Double Fertilization",
      "description": "Flower structure, stamen and anther wall layers (epidermis, endothecium, middle layers, tapetum), microsporogenesis and pollen grain (exine of sporopollenin), megasporogenesis and 7-celled 8-nucleate embryo sac, outbreeding devices, double fertilization (syngamy + triple fusion), and endosperm development.",
      "sequenceOrder": 1,
      "weightagePercent": 7.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Angiosperms exhibit unique double fertilization. One sperm cell fuses with the egg cell to form the diploid zygote, while the second fuses with the central diploid polar nuclei to form the triploid nutritive endosperm.",
        "sections": [
          {
            "heading": "Gametophyte Development and Double Fertilization",
            "paragraphs": [
              "Anther Wall: Tapetum is the innermost nutritive layer nourishing developing microspores; tapetal cells are multinucleated and polyploid.",
              "Pollen Grain: Two-layered wall. Outer exine is made of sporopollenin (one of the most resistant organic substances known, unaffected by strong acids, bases, or high temperature, with germ pores lacking sporopollenin); inner intine is cellulose and pectin.",
              "Female Gametophyte (Embryo Sac): Monosporic development from single functional megaspore (chalazal). 7-celled and 8-nucleate at maturity: 3 antipodals at chalazal end, 1 central cell with 2 polar nuclei, and egg apparatus (1 egg cell + 2 synergids with filiform apparatus guiding pollen tube) at micropylar end.",
              "Double Fertilization: (1) Syngamy: Sperm (n) + Egg (n) -> Zygote (2n), developing into embryo; (2) Triple Fusion: Sperm (n) + 2 Polar Nuclei (2n) -> Primary Endosperm Nucleus (PEN, 3n), developing into nutritive endosperm.",
              "Outbreeding Devices: Self-incompatibility, dichogamy (protandry/protogyny), unisexual flowers to prevent self-pollination and inbreeding depression."
            ],
            "keyTakeaways": [
              "Double fertilization is unique to Angiosperms and completely absent in Gymnosperms.",
              "Tender coconut water is free-nuclear endosperm (thousands of free nuclei); surrounding white coconut meat is cellular endosperm."
            ],
            "examTips": [
              "Apomixis is a form of asexual reproduction that mimics sexual reproduction by producing seeds without fertilization (e.g. Asteraceae and grasses)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing gymnosperms have triploid endosperm. Gymnosperm endosperm is haploid (n) formed before fertilization; angiosperm endosperm is triploid (3n) formed after triple fusion."
        ]
      },
      "formulas": [
        {
          "label": "Double Fertilization Stoichiometry",
          "formula": "\\text{Syngamy: } n + n \\longrightarrow 2n \\; (\\text{Zygote}), \\quad \\text{Triple Fusion: } n + 2n \\longrightarrow 3n \\; (\\text{PEN / Endosperm})",
          "description": "Ploidy mechanics of dual angiosperm fertilization events.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Gametic Haploid Genome",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-01-01",
          "title": "Microsporogenesis, Megasporogenesis & Double Fertilization Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Microsporogenesis, Megasporogenesis & Double Fertilization.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-01-01",
          "title": "Microsporogenesis, Megasporogenesis & Double Fertilization",
          "summary": "Flower structure, stamen and anther wall layers (epidermis, endothecium, middle layers, tapetum), microsporogenesis and pollen grain (exine of sporopollenin), megasporogenesis and 7-celled 8-nucleate embryo sac, outbreeding devices, double fertilization (syngamy + triple fusion), and endosperm development."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000002": [
    {
      "id": "top-bio-12-02-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000002",
      "nodeType": "topic",
      "code": "BIO-12-02-T01",
      "title": "Spermatogenesis, Oogenesis, Menstrual Cycle & Embryogenesis",
      "description": "Male reproductive system (testes, Leydig cells, Sertoli cells), female reproductive system (ovaries, fallopian tubes, uterus), spermatogenesis vs oogenesis, hormonal control of menstrual cycle (LH surge, follicular and luteal phases), fertilization in ampulla, cleavage, blastocyst implantation, and placenta hormones.",
      "sequenceOrder": 1,
      "weightagePercent": 7.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Human reproduction involves gametogenesis, hormonal cyclicity, internal fertilization in the fallopian tube ampulla, blastocyst implantation, and placental endocrine coordination.",
        "sections": [
          {
            "heading": "Gametogenesis and the Menstrual Cycle",
            "paragraphs": [
              "Spermatogenesis: In seminiferous tubules. Spermatogonia (2n) -> Primary spermatocytes (2n, undergo meiosis I) -> Secondary spermatocytes (n, meiosis II) -> Spermatids (n) -> mature Spermatozoa (spermiogenesis). Sertoli cells nourish germ cells; Leydig cells secrete testosterone under LH stimulation.",
              "Oogenesis: Initiated during embryonic development. Primary oocytes arrest in prophase I until puberty. Meiosis I completes prior to ovulation producing secondary oocyte (n) and 1st polar body. Meiosis II completes ONLY upon fertilization by sperm, producing ovum and 2nd polar body.",
              "Menstrual Cycle (28 days): Menstrual phase (days 1-5, sloughing of endometrium) -> Follicular / Proliferative phase (days 6-13, FSH stimulates follicle development, estrogen regenerates endometrium) -> Ovulatory phase (day 14, rapid LH surge induces rupture of Graafian follicle and release of secondary oocyte) -> Luteal / Secretory phase (days 15-28, ruptured follicle transforms into Corpus Luteum secretes high progesterone maintaining endometrium).",
              "Fertilization & Implantation: Occurs at ampullary-isthmic junction of fallopian tube. Sperm acrosome enzymes penetrate corona radiata and zona pellucida (inducing cortical reaction to block polyspermy). Cleavage forms morula -> blastocyst. Outer trophoblast implants into uterine endometrium; inner cell mass gives rise to embryo.",
              "Placental Hormones: Human Chorionic Gonadotropin (hCG), Human Placental Lactogen (hPL), Estrogen, Progesterone, and Relaxin (secreted by ovary during late pregnancy). hCG and hPL are produced exclusively during pregnancy."
            ],
            "keyTakeaways": [
              "Corpus luteum degenerates into Corpus albicans if fertilization does not occur, causing progesterone withdrawal and menstrual bleeding.",
              "Detection of hCG in urine is the basis of all standard home pregnancy test kits."
            ],
            "examTips": [
              "The LH surge on day 14 of a 28-day menstrual cycle is the direct physiological trigger for ovulation!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming oogenesis finishes before birth. Oogenesis completes meiosis II ONLY after a sperm physically penetrates the secondary oocyte."
        ]
      },
      "formulas": [
        {
          "label": "Spermatogenesis vs Oogenesis Yield Ratio",
          "formula": "1 \\text{ Primary Spermatocyte (2n)} \\longrightarrow 4 \\text{ Functional Sperm (n)}, \\quad 1 \\text{ Primary Oocyte (2n)} \\longrightarrow 1 \\text{ Ovum (n)} + 2\\text{-}3 \\text{ Polar Bodies}",
          "description": "Yield ratio of viable gametes per primary meiotic precursor cell.",
          "variables": [
            {
              "symbol": "n",
              "meaning": "Haploid Gamete",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-02-01",
          "title": "Spermatogenesis, Oogenesis, Menstrual Cycle & Embryogenesis Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Spermatogenesis, Oogenesis, Menstrual Cycle & Embryogenesis.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-02-01",
          "title": "Spermatogenesis, Oogenesis, Menstrual Cycle & Embryogenesis",
          "summary": "Male reproductive system (testes, Leydig cells, Sertoli cells), female reproductive system (ovaries, fallopian tubes, uterus), spermatogenesis vs oogenesis, hormonal control of menstrual cycle (LH surge, follicular and luteal phases), fertilization in ampulla, cleavage, blastocyst implantation, and placenta hormones."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000003": [
    {
      "id": "top-bio-12-03-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000003",
      "nodeType": "topic",
      "code": "BIO-12-03-T01",
      "title": "Contraceptive Methods, MTP & Assisted Reproductive Technologies",
      "description": "Need for reproductive health, STIs, contraceptive methods (natural, barrier, IUDs copper-releasing and hormone-releasing, oral pills Saheli, surgical tubectomy/vasectomy), Medical Termination of Pregnancy (MTP Act), amniocentesis misuse, and ART (IVF-ET, ZIFT, GIFT, ICSI).",
      "sequenceOrder": 1,
      "weightagePercent": 4.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Reproductive health addresses family planning, sexually transmitted infections, and infertility treatment via Assisted Reproductive Technologies (ART).",
        "sections": [
          {
            "heading": "Contraceptive Classification and Infertility Interventions",
            "paragraphs": [
              "Barrier Methods: Condoms protect against both pregnancy and sexually transmitted infections (STIs/STDs including AIDS, Hepatitis B, Syphilis).",
              "Intrauterine Devices (IUDs): Non-medicated (Lippes loop); Copper-releasing (CuT, Cu7, Multiload 375: Cu ions suppress sperm motility and fertilizing capacity); Hormone-releasing (Progestasert, LNG-20: make uterus unsuitable for implantation and cervix hostile to sperms).",
              "Oral Pills: 'Saheli' developed by CDRI Lucknow: once-a-week, non-steroidal pill with very few side effects and high contraceptive value.",
              "Surgical Methods: Irreversible terminal methods. Vasectomy in males (cutting and tying of vas deferens); Tubectomy in females (cutting and tying of fallopian tubes).",
              "ART Techniques: In Vitro Fertilization (IVF, 'test-tube baby'); ZIFT (Zygote Intra-Fallopian Transfer: embryo up to 8 blastomeres transferred into fallopian tube); IUT (Intra-Uterine Transfer: embryo with > 8 blastomeres transferred into uterus); GIFT (Gamete Intra-Fallopian Transfer: ovum transferred into fallopian tube of recipient female who cannot produce one); ICSI (Intra-Cytoplasmic Sperm Injection: sperm directly injected into ovum)."
            ],
            "keyTakeaways": [
              "Amniocentesis is a fetal sex determination and chromosomal diagnostic test analyzing amniotic fluid; statutory ban imposed in India to curb female foeticide.",
              "Hepatitis B, Genital Herpes, and HIV infections are non-curable STIs."
            ],
            "examTips": [
              "Distinguish ZIFT from IUT: ZIFT transfers embryos up to 8 blastomeres into fallopian tube; IUT transfers embryos with more than 8 blastomeres directly into uterus."
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing MTP is safe at all gestational ages. MTP is considered relatively safe only during the first trimester (up to 12 weeks of pregnancy)."
        ]
      },
      "formulas": [
        {
          "label": "Assisted Reproductive Embryo Transfer Boundary",
          "formula": "\\text{Embryo} \\le 8 \\text{ blastomeres} \\implies \\text{ZIFT (Fallopian Tube)}, \\quad \\text{Embryo} > 8 \\text{ blastomeres} \\implies \\text{IUT (Uterine Cavity)}",
          "description": "Clinical transfer site protocol based on cleavage blastomere count in IVF.",
          "variables": [
            {
              "symbol": "\\text{Blastomeres}",
              "meaning": "Cleavage Stage Cell Count",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-03-01",
          "title": "Contraceptive Methods, MTP & Assisted Reproductive Technologies Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Contraceptive Methods, MTP & Assisted Reproductive Technologies.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-03-01",
          "title": "Contraceptive Methods, MTP & Assisted Reproductive Technologies",
          "summary": "Need for reproductive health, STIs, contraceptive methods (natural, barrier, IUDs copper-releasing and hormone-releasing, oral pills Saheli, surgical tubectomy/vasectomy), Medical Termination of Pregnancy (MTP Act), amniocentesis misuse, and ART (IVF-ET, ZIFT, GIFT, ICSI)."
        }
      ]
    }
  ],
  "c0000001-0000-0000-0000-000000000012": [
    {
      "id": "top-bio-12-04-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000001-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "BIO-12-04-T01",
      "title": "Mendelian Genetics, Linkage & Genetic Disorders",
      "description": "Mendel’s laws of inheritance (dominance, segregation 3:1, independent assortment 9:3:3:1), incomplete dominance, codominance (ABO blood groups), Morgan’s Drosophila linkage and recombination, chromosomal theory of inheritance, sex determination (XX-XY, ZZ-ZW, honeybee haplodiploidy), and Mendelian and chromosomal disorders (Down, Turner, Klinefelter).",
      "sequenceOrder": 1,
      "weightagePercent": 9.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Genetics investigates heredity and variation. Mendel established particulate inheritance principles, which Morgan linked to physical chromosome loci exhibiting crossing over and sex-linked inheritance.",
        "sections": [
          {
            "heading": "Mendelian Ratios and Chromosomal Non-Disjunction",
            "paragraphs": [
              "Law of Segregation (Monohybrid Cross): Alleles segregate during gamete formation so each gamete receives only one allele. Phenotypic ratio = 3 : 1; Genotypic ratio = 1 : 2 : 1. Test cross (dominant phenotype x homozygous recessive) gives 1 : 1 ratio.",
              "Law of Independent Assortment (Dihybrid Cross): Dihybrid phenotypic ratio = 9 : 3 : 3 : 1. Fails when genes are closely linked on the same chromosome.",
              "Linkage (T.H. Morgan): Physical association of genes on the same chromosome. Recombination frequency between linked genes is proportional to the distance between them (Alfred Sturtevant constructed first genetic linkage maps where 1% recombination = 1 map unit / centimorgan).",
              "Sex Determination in Honeybees: Haplodiploid system. Males (drones) develop parthenogenetically from unfertilized eggs (haploid, n=16); females develop from fertilized eggs (diploid, 2n=32).",
              "Mendelian Disorders: Haemophilia (X-linked recessive, defect in blood clotting cascade); Sickle-cell anaemia (autosomal recessive point mutation in beta-globin gene, GAG -> GUG substituting glutamic acid with valine at position 6); Phenylketonuria (autosomal recessive metabolic defect in phenylalanine hydroxylase).",
              "Chromosomal Disorders: Down’s syndrome (Trisomy 21, 2n+1 = 47); Klinefelter’s syndrome (XXY male with gynaecomastia, 47,XXY); Turner’s syndrome (monosomy X female, sterile with webbed neck, 45,X0)."
            ],
            "keyTakeaways": [
              "Sickle-cell trait heterozygotes (HbA HbS) have selective survival advantage against falciparum malaria in endemic zones.",
              "Down’s syndrome is caused by non-disjunction of chromosome 21 during maternal meiotic oogenesis."
            ],
            "examTips": [
              "Sickle cell anemia point mutation substitution: 6th codon GAG (coding for Glutamic acid) mutates to GUG (coding for Valine)!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming independent assortment holds for all gene pairs. Independent assortment applies ONLY to genes located on different chromosomes or very far apart on the same chromosome."
        ]
      },
      "formulas": [
        {
          "label": "Mendelian Phenotypic Ratios & Recombination Frequency",
          "formula": "\\text{Monohybrid: } 3:1, \\quad \\text{Dihybrid: } 9:3:3:1, \\quad \\text{Recombination Frequency} = \\frac{\\text{Recombinant Progeny}}{\\text{Total Progeny}} \\times 100",
          "description": "Classical inheritance ratios and Morgan-Sturtevant centimorgan genetic mapping formula.",
          "variables": [
            {
              "symbol": "\\text{RF}",
              "meaning": "Recombination Frequency",
              "unit": "\\% \\text{ or cM}"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-04-01",
          "title": "Mendelian Genetics, Linkage & Genetic Disorders Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Mendelian Genetics, Linkage & Genetic Disorders.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-04-01",
          "title": "Mendelian Genetics, Linkage & Genetic Disorders",
          "summary": "Mendel’s laws of inheritance (dominance, segregation 3:1, independent assortment 9:3:3:1), incomplete dominance, codominance (ABO blood groups), Morgan’s Drosophila linkage and recombination, chromosomal theory of inheritance, sex determination (XX-XY, ZZ-ZW, honeybee haplodiploidy), and Mendelian and chromosomal disorders (Down, Turner, Klinefelter)."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000005": [
    {
      "id": "top-bio-12-05-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000005",
      "nodeType": "topic",
      "code": "BIO-12-05-T01",
      "title": "DNA Double Helix, Replication, Transcription & Translation",
      "description": "Watson-Crick B-DNA double helix model, Chargaff's rules, nucleosome packaging, Avery-MacLeod-McCarty & Hershey-Chase (32P/35S) experiments proving DNA as genetic material, Meselson-Stahl semi-conservative replication, transcription unit, post-transcriptional splicing/capping/tailing, genetic code features, tRNA cloverleaf, and Jacob-Monod Lac Operon.",
      "sequenceOrder": 1,
      "weightagePercent": 10.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Molecular biology elucidates genetic transmission through the Central Dogma: DNA -> RNA -> Protein. Replication is semi-conservative, transcription produces messenger RNA, and ribosomal translation synthesizes polypeptide chains according to the universal triplet genetic code.",
        "sections": [
          {
            "heading": "Central Dogma and the Lac Operon",
            "paragraphs": [
              "B-DNA Structure: Antiparallel double helix, pitch = 3.4 nm with 10 base pairs per turn (0.34 nm distance between base pairs). Chargaff's Rule: [A] = [T] and [G] = [C], so [A + G] / [T + C] = 1.",
              "Hershey-Chase Experiment (1952): Used bacteriophage T2 labeled with 35S (capsid protein) and 32P (DNA core). Radioactive 32P entered E. coli cells, proving definitively that DNA is the genetic material.",
              "Meselson-Stahl Experiment (1958): Proved semi-conservative replication using 15N heavy isotope and CsCl density gradient centrifugation.",
              "Genetic Code: Triplet, degenerate (61 codons code for 20 amino acids), unambiguous, non-overlapping, and nearly universal. AUG is dual functional (codes for Methionine and acts as initiator codon). Stop codons: UAA (ochre), UAG (amber), UGA (opal).",
              "Transcription: DNA-dependent RNA polymerase synthesizes RNA in 5' -> 3' direction. Eukaryotic pre-mRNA undergoes: (1) Splicing (introns removed by spliceosome); (2) 5' Capping (methylguanosine triphosphate added); (3) 3' Tailing (polyadenylation with 200-300 adenylate residues).",
              "Lac Operon: Inducible operon. Regulator gene i produces repressor protein that binds operator (o) in absence of lactose. When inducer (allolactose/lactose) binds repressor, repressor inactivates, allowing RNA polymerase to transcribe structural genes: lac z (beta-galactosidase), lac y (permease), and lac a (transacetylase)."
            ],
            "keyTakeaways": [
              "tRNA is an adapter molecule: cloverleaf 2D secondary structure, inverted L-shaped 3D tertiary structure.",
              "DNA ligase joins Okazaki fragments on the lagging strand during replication."
            ],
            "examTips": [
              "The genetic code is DEGENERATE: some amino acids are coded by more than one codon (e.g. Leucine has 6 codons)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming RNA polymerase requires primers for transcription. DNA polymerase requires a primer, but RNA polymerase initiates RNA synthesis de novo without primers."
        ]
      },
      "formulas": [
        {
          "label": "Chargaff’s Base-Pairing Rules",
          "formula": "[A] = [T], \\quad [G] = [C], \\quad \\frac{[A] + [G]}{[T] + [C]} = 1.0, \\quad \\%A + \\%T + \\%G + \\%C = 100\\%",
          "description": "Stoichiometric base-equivalence rules in double-stranded DNA.",
          "variables": [
            {
              "symbol": "[A], [T]",
              "meaning": "Adenine and Thymine Molar Concentrations",
              "unit": "-"
            },
            {
              "symbol": "[G], [C]",
              "meaning": "Guanine and Cytosine Molar Concentrations",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-05-01",
          "title": "DNA Double Helix, Replication, Transcription & Translation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for DNA Double Helix, Replication, Transcription & Translation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-05-01",
          "title": "DNA Double Helix, Replication, Transcription & Translation",
          "summary": "Watson-Crick B-DNA double helix model, Chargaff's rules, nucleosome packaging, Avery-MacLeod-McCarty & Hershey-Chase (32P/35S) experiments proving DNA as genetic material, Meselson-Stahl semi-conservative replication, transcription unit, post-transcriptional splicing/capping/tailing, genetic code features, tRNA cloverleaf, and Jacob-Monod Lac Operon."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000006": [
    {
      "id": "top-bio-12-06-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000006",
      "nodeType": "topic",
      "code": "BIO-12-06-T01",
      "title": "Origin of Life, Natural Selection & Hardy-Weinberg Principle",
      "description": "Miller-Urey experiment (methane, ammonia, hydrogen, water vapor producing amino acids), homologous vs analogous organs (divergent vs convergent evolution), adaptive radiation (Darwin's finches), natural selection (industrial melanism), Hardy-Weinberg equilibrium p^2 + 2pq + q^2 = 1, and human evolutionary lineage (Dryopithecus to Homo sapiens).",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Evolutionary biology investigates the origin of life and species diversification. Natural selection acts on phenotypic variations, altering population allele frequencies over geological timescales.",
        "sections": [
          {
            "heading": "Evolutionary Evidence and Population Genetics",
            "paragraphs": [
              "Miller-Urey Experiment (1953): Simulated primitive Earth atmosphere (CH4, NH3, H2, H2O at 800 °C with electric spark discharge) producing glycine, alanine, and aspartic acid, validating Oparin-Haldane chemical evolution.",
              "Homologous Organs (Divergent Evolution): Same anatomical origin, different functions (e.g. forelimbs of cheetah, whale, bat, human; thorns of Bougainvillea and tendrils of Cucurbita). Indicates common ancestry.",
              "Analogous Organs (Convergent Evolution): Different origin, similar functions due to similar environmental selective pressures (e.g. wings of butterfly and bird; eye of octopus and mammal; sweet potato root and potato stem).",
              "Adaptive Radiation: Diversification of an ancestral species into different ecological niches (e.g. Darwin's finches in Galapagos Islands, Australian marsupials).",
              "Hardy-Weinberg Principle: Allele frequencies in a large, randomly mating population remain constant from generation to generation in the absence of evolutionary influences (mutation, gene flow, genetic drift, natural selection, non-random mating): p^2 + 2pq + q^2 = 1, where p + q = 1."
            ],
            "keyTakeaways": [
              "Genetic Drift (Sewall Wright Effect): Random fluctuations in allele frequencies occurring purely by chance in SMALL populations (Founder effect, Bottleneck effect).",
              "Human Evolution Chronology: Dryopithecus -> Ramapithecus -> Australopithecus (used stone weapons, ate fruit) -> Homo habilis (first human-like, cranial capacity 650-800 cc) -> Homo erectus (1891 Java man, 900 cc, ate meat) -> Neanderthal man (1400 cc, buried dead) -> Homo sapiens."
            ],
            "examTips": [
              "In Hardy-Weinberg calculations: p = frequency of dominant allele A; q = frequency of recessive allele a; p^2 = AA; 2pq = Aa (heterozygotes); q^2 = aa (recessive trait)."
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming evolutionary changes occur within an individual's lifetime. Evolution is a population-level phenomenon measured by changes in allele frequencies across generations."
        ]
      },
      "formulas": [
        {
          "label": "Hardy-Weinberg Population Equilibrium",
          "formula": "p + q = 1, \\quad p^2 + 2pq + q^2 = 1.0",
          "description": "Binomial expansion describing stable genotype frequencies in panmictic populations.",
          "variables": [
            {
              "symbol": "p",
              "meaning": "Frequency of Dominant Allele",
              "unit": "-"
            },
            {
              "symbol": "q",
              "meaning": "Frequency of Recessive Allele",
              "unit": "-"
            },
            {
              "symbol": "2pq",
              "meaning": "Heterozygous Genotype Frequency",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-06-01",
          "title": "Origin of Life, Natural Selection & Hardy-Weinberg Principle Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Origin of Life, Natural Selection & Hardy-Weinberg Principle.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-06-01",
          "title": "Origin of Life, Natural Selection & Hardy-Weinberg Principle",
          "summary": "Miller-Urey experiment (methane, ammonia, hydrogen, water vapor producing amino acids), homologous vs analogous organs (divergent vs convergent evolution), adaptive radiation (Darwin's finches), natural selection (industrial melanism), Hardy-Weinberg equilibrium p^2 + 2pq + q^2 = 1, and human evolutionary lineage (Dryopithecus to Homo sapiens)."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000007": [
    {
      "id": "top-bio-12-07-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000007",
      "nodeType": "topic",
      "code": "BIO-12-07-T01",
      "title": "Pathogens, Innate/Acquired Immunity, AIDS & Cancer",
      "description": "Infectious diseases (Typhoid Widal test, Malaria Plasmodium life cycle in mosquito and human, Pneumonia, Amoebiasis, Ringworm), Innate immunity barriers, Acquired immunity (B-cells antibodies IgG/IgA/IgM, T-cells cell-mediated, active vs passive immunity, colostrum IgA), AIDS (HIV retrovirus life cycle, ELISA diagnostic), and Cancer (oncogenes, contact inhibition loss, metastasis).",
      "sequenceOrder": 1,
      "weightagePercent": 7.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Human immunology explores defense barriers against pathogens. Autoimmunity, immunodeficiency (AIDS), and malignant cellular transformations (cancer) represent key immunological dysfunctions.",
        "sections": [
          {
            "heading": "Immunology, Pathogenic Life Cycles, and Oncology",
            "paragraphs": [
              "Malaria Life Cycle: Plasmodium vivax. Female Anopheles mosquito injects sporozoites into human -> reproduce asexually in liver cells -> rupture RBCs releasing toxic haemozoin (responsible for recurring chills and high fever every 3-4 days) -> sexual stages (gametocytes) taken up by mosquito -> fertilization occurs in mosquito gut -> sporozoites migrate to salivary glands.",
              "Innate Immunity Barriers: Physical (skin, mucus); Physiological (stomach HCl, saliva lysozyme); Cellular (neutrophils, macrophages, NK cells); Cytokine (interferons protect uninfected cells from viral invasion).",
              "Acquired Immunity: Humoral (B-lymphocytes produce antibodies H2L2: IgG most abundant, IgA in colostrum breast milk, IgE in allergies); Cell-Mediated Immunity (T-lymphocytes responsible for graft rejection in organ transplants).",
              "AIDS: Caused by HIV (Retrovirus with RNA genome and reverse transcriptase). Infects macrophages ('HIV factory') and helper T-lymphocytes (CD4+ T-cells). Progressive depletion of helper T-cells leads to opportunistic infections (Mycobacterium, Toxoplasma). Diagnosed by ELISA; confirmed by Western blot.",
              "Cancer: Normal cells exhibit contact inhibition; cancer cells lose contact inhibition forming tumors (benign vs malignant). Malignant tumors exhibit metastasis (cancer cells enter bloodstream and form secondary tumors at distant sites, the most dreaded property of cancer). Caused by oncogenic viruses and carcinogens."
            ],
            "keyTakeaways": [
              "Colostrum secreted during the first days of lactation contains abundant IgA antibodies providing natural passive immunity to newborns.",
              "Cell-mediated immunity mediated by T-lymphocytes is responsible for the body's rejection of organ transplants: patients must take immunosuppressants (cyclosporin A) for life."
            ],
            "examTips": [
              "Identify antibody chain structure: each antibody molecule has two heavy chains and two light chains represented as H2L2!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing AIDS kills patients directly. HIV destroys helper T-cells, leaving the immune system defenseless against opportunistic infections that ultimately prove fatal."
        ]
      },
      "formulas": [
        {
          "label": "Antibody Stoichiometry Structure",
          "formula": "\\text{Monomeric Antibody} = \\text{H}_2\\text{L}_2 \\quad (2 \\text{ Heavy Chains} + 2 \\text{ Light Chains linked by S-S bridges})",
          "description": "Biochemical quaternary structure of immunoglobulin G monomer.",
          "variables": [
            {
              "symbol": "\\text{H}_2\\text{L}_2",
              "meaning": "Immunoglobulin Subunit Formula",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-07-01",
          "title": "Pathogens, Innate/Acquired Immunity, AIDS & Cancer Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Pathogens, Innate/Acquired Immunity, AIDS & Cancer.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-07-01",
          "title": "Pathogens, Innate/Acquired Immunity, AIDS & Cancer",
          "summary": "Infectious diseases (Typhoid Widal test, Malaria Plasmodium life cycle in mosquito and human, Pneumonia, Amoebiasis, Ringworm), Innate immunity barriers, Acquired immunity (B-cells antibodies IgG/IgA/IgM, T-cells cell-mediated, active vs passive immunity, colostrum IgA), AIDS (HIV retrovirus life cycle, ELISA diagnostic), and Cancer (oncogenes, contact inhibition loss, metastasis)."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000008": [
    {
      "id": "top-bio-12-08-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000008",
      "nodeType": "topic",
      "code": "BIO-12-08-T01",
      "title": "Microbes in Household, Sewage Treatment & Biocontrol",
      "description": "Lactic acid bacteria (LAB) in curd, Baker’s yeast (Saccharomyces cerevisiae), antibiotics (Penicillium notatum), bioactive molecules (Cyclosporin A from Trichoderma polysporum, Statins from Monascus purpureus), Sewage treatment plants (STPs: primary physical settling, secondary biological aeration tanks, BOD reduction), biogas production (methanogens), and biofertilizers (Mycorrhiza, Rhizobium).",
      "sequenceOrder": 1,
      "weightagePercent": 5.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Microorganisms drive vital industrial, ecological, and biotechnological processes including wastewater purification, pharmaceutical production, and organic agriculture.",
        "sections": [
          {
            "heading": "Sewage Treatment and Industrial Microbial Products",
            "paragraphs": [
              "Household: Lactobacillus (LAB) converts milk to curd, improving nutritional quality by increasing vitamin B12; Saccharomyces cerevisiae (Brewer’s/Baker’s yeast) ferments dough releasing CO2.",
              "Industrial Chemicals: Citric acid (Aspergillus niger fungus); Acetic acid (Acetobacter aceti bacterium); Butyric acid (Clostridium butyricum); Lactic acid (Lactobacillus).",
              "Bioactive Molecules: Cyclosporin A (immunosuppressive agent used in organ transplant patients, produced by fungus Trichoderma polysporum); Statins (blood-cholesterol lowering agents, competitively inhibit cholesterol synthesis enzyme, produced by yeast Monascus purpureus); Streptokinase (clot buster from Streptococcus).",
              "Sewage Treatment (STP): Primary treatment (physical removal of floating debris by filtration and grit by sedimentation). Secondary (Biological) treatment: Aerobic flocs (bacteria + fungal filaments) consume organic matter in aeration tanks, drastically reducing Biochemical Oxygen Demand (BOD). Effluent passed into anaerobic sludge digesters where methanogens produce biogas (CH4, CO2, H2S).",
              "Biocontrol: Bacillus thuringiensis (Bt, toxic Cry proteins against caterpillar pests); Trichoderma (free-living fungus controlling root-borne plant pathogens); Baculoviruses (genus Nucleopolyhedrovirus, narrow-spectrum species-specific insecticides safe for non-target organisms)."
            ],
            "keyTakeaways": [
              "BOD (Biochemical Oxygen Demand) measures organic pollution in water: higher BOD indicates greater pollution and lower dissolved oxygen.",
              "Glomus fungus forms mycorrhizal associations with plant roots, absorbing phosphorus and providing resistance to root-borne pathogens."
            ],
            "examTips": [
              "Cyclosporin A is from Trichoderma polysporum (immunosuppressive); Statins are from Monascus purpureus (cholesterol lowering). Match these correctly in NEET!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming secondary sewage treatment is chemical. Secondary sewage treatment is entirely BIOLOGICAL, relying on aerobic microbial flocs followed by anaerobic methanogenic digesters."
        ]
      },
      "formulas": [
        {
          "label": "Biochemical Oxygen Demand Correlation",
          "formula": "\\text{Water Pollution Degree} \\propto \\text{BOD} \\propto \\frac{1}{\\text{Dissolved Oxygen (DO)}}",
          "description": "Inverse relationship between biological oxygen demand and dissolved aquatic oxygen.",
          "variables": [
            {
              "symbol": "\\text{BOD}",
              "meaning": "Biochemical Oxygen Demand",
              "unit": "mg/L"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-08-01",
          "title": "Microbes in Household, Sewage Treatment & Biocontrol Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Microbes in Household, Sewage Treatment & Biocontrol.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-08-01",
          "title": "Microbes in Household, Sewage Treatment & Biocontrol",
          "summary": "Lactic acid bacteria (LAB) in curd, Baker’s yeast (Saccharomyces cerevisiae), antibiotics (Penicillium notatum), bioactive molecules (Cyclosporin A from Trichoderma polysporum, Statins from Monascus purpureus), Sewage treatment plants (STPs: primary physical settling, secondary biological aeration tanks, BOD reduction), biogas production (methanogens), and biofertilizers (Mycorrhiza, Rhizobium)."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000009": [
    {
      "id": "top-bio-12-09-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000009",
      "nodeType": "topic",
      "code": "BIO-12-09-T01",
      "title": "Recombinant DNA Technology: Restriction Enzymes, Cloning Vectors & PCR",
      "description": "Principles of genetic engineering, restriction endonucleases (molecular scissors, palindromic recognition sequences, sticky ends), DNA ligase, agarose gel electrophoresis (ethidium bromide, UV transillumination), plasmid cloning vector pBR322 (ori, rop, selectable markers ampR and tetR, insertional inactivation), competent cells, Polymerase Chain Reaction (PCR: denaturation, annealing, extension by Taq polymerase), and stirred-tank bioreactors.",
      "sequenceOrder": 1,
      "weightagePercent": 8.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Recombinant DNA technology manipulates genetic material in vitro. Restriction endonucleases cleave target genes at palindromic sequences for ligation into specialized plasmid vectors and exponential PCR amplification.",
        "sections": [
          {
            "heading": "Tools and Protocol of Genetic Engineering",
            "paragraphs": [
              "Restriction Enzymes (Molecular Scissors): Discovered by Arber, Nathan, and Smith. Cleave phosphodiester backbones of both DNA strands at specific palindromic sequences (e.g. EcoRI recognizes 5'-GAATTC-3' and cuts between G and A, producing cohesive sticky ends).",
              "Agarose Gel Electrophoresis: Negatively charged DNA fragments migrate toward the positive anode. Smaller fragments move farther (sieving effect). Visualized by staining with ethidium bromide (EtBr) under UV light as bright orange bands. Extraction of DNA band from gel is termed elution.",
              "Cloning Vector pBR322 Features: Origin of replication (ori, controls copy number); Selectable markers (ampR and tetR genes to distinguish transformants from non-transformants); Insertional Inactivation (ligation of foreign gene into BamHI site of tetR destroys tetracycline resistance, allowing selection of recombinants via replica plating; or lac z gene with X-gal chromogenic substrate producing white recombinant colonies).",
              "Polymerase Chain Reaction (PCR, Kary Mullis): Amplifies DNA a billion-fold in 30 cycles: (1) Denaturation (94-96 °C: strands separate); (2) Annealing (50-56 °C: oligonucleotide primers bind); (3) Extension (72 °C: thermostable Taq DNA polymerase isolated from bacterium Thermus aquaticus synthesizes complementary strands).",
              "Downstream Processing: Separation, purification, and clinical quality testing of recombinant protein products prior to commercial marketing."
            ],
            "keyTakeaways": [
              "Taq polymerase is used in PCR because it remains thermostably active at high denaturation temperatures (94 °C).",
              "Microinjection injects recombinant DNA directly into animal cell nuclei; biolistics/gene gun shoots gold/tungsten microparticles coated with DNA into plant cells."
            ],
            "examTips": [
              "Insertional inactivation: Recombinant colonies in lac z selection appear WHITE because beta-galactosidase is inactivated; non-recombinant colonies appear BLUE with X-gal!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming restriction enzymes cut single-stranded DNA randomly. Restriction endonucleases recognize specific palindromic double-stranded sequences."
        ]
      },
      "formulas": [
        {
          "label": "PCR Theoretical Amplification Yield",
          "formula": "N = N_0 \\times 2^n \\quad (\\text{After } n = 30 \\text{ cycles: } 2^{30} \\approx 10^9 \\text{ copies})",
          "description": "Exponential doubling of DNA template copies across thermal PCR cycles.",
          "variables": [
            {
              "symbol": "N_0",
              "meaning": "Initial DNA Copies",
              "unit": "-"
            },
            {
              "symbol": "n",
              "meaning": "PCR Thermal Cycles Count",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-09-01",
          "title": "Recombinant DNA Technology: Restriction Enzymes, Cloning Vectors & PCR Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Recombinant DNA Technology: Restriction Enzymes, Cloning Vectors & PCR.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-09-01",
          "title": "Recombinant DNA Technology: Restriction Enzymes, Cloning Vectors & PCR",
          "summary": "Principles of genetic engineering, restriction endonucleases (molecular scissors, palindromic recognition sequences, sticky ends), DNA ligase, agarose gel electrophoresis (ethidium bromide, UV transillumination), plasmid cloning vector pBR322 (ori, rop, selectable markers ampR and tetR, insertional inactivation), competent cells, Polymerase Chain Reaction (PCR: denaturation, annealing, extension by Taq polymerase), and stirred-tank bioreactors."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000010": [
    {
      "id": "top-bio-12-10-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000010",
      "nodeType": "topic",
      "code": "BIO-12-10-T01",
      "title": "Bt Crops, RNA Interference & Recombinant Therapeutics",
      "description": "Transgenic agricultural applications: Bt cotton (Bacillus thuringiensis, endotoxin CryIAc and CryIIAb against bollworms, activated by alkaline insect gut pH), RNA interference (RNAi, gene silencing via dsRNA in tobacco roots against Meloidogyne incognita nematode), genetically engineered human insulin (Eli Lilly, separate A and B chains linked by disulfide bonds, devoid of C-peptide), gene therapy for ADA deficiency, and transgenic animals.",
      "sequenceOrder": 1,
      "weightagePercent": 6.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Biotechnology addresses agricultural productivity, pharmaceutical medicine, and gene therapy by introducing recombinant genes into target host organisms.",
        "sections": [
          {
            "heading": "Agricultural Biotechnology and Human Therapeutics",
            "paragraphs": [
              "Bt Cotton: Bacillus thuringiensis produces crystalline protein protoxins (Cry proteins). Ingested by insect -> solubilized by alkaline pH of insect midgut -> activated toxin binds midgut epithelial cells -> creates pores causing cell swelling and lysis. CryIAc and CryIIAb control cotton bollworms; CryIAb controls corn borer.",
              "RNA Interference (RNAi): Cellular defense mechanism in all eukaryotes. Double-stranded RNA (dsRNA) triggers RNA-induced silencing complex (RISC), which binds and cleaves target complementary mRNA of pathogen (nematode Meloidogyne incognita), preventing translation (gene silencing).",
              "Genetically Engineered Insulin (Humulin): Human pro-insulin contains an extra connecting C-peptide which is removed during maturation. Eli Lilly (1983) synthesized DNA sequences for human insulin chain A and chain B separately, cloned them into E. coli, extracted them, and combined them via disulfide bonds to produce mature active human insulin without C-peptide.",
              "Gene Therapy: First clinical gene therapy was given in 1990 to a 4-year-old girl with Adenosine Deaminase (ADA) deficiency causing severe combined immunodeficiency (SCID). Lymphocytes from patient's blood were cultured -> functional ADA cDNA introduced using retroviral vector -> infused back into patient. Permanent cure requires gene introduction into embryonic bone marrow cells.",
              "Transgenic Animals: Transgenic cow 'Rosie' (1997) produced human protein-enriched milk (2.4 grams per litre) containing human alpha-lactalbumin, nutritionally superior for human babies."
            ],
            "keyTakeaways": [
              "Mature functional human insulin contains 51 amino acids (Chain A = 21, Chain B = 30) linked by disulfide bonds, completely lacking C-peptide.",
              "Bt toxin does NOT kill the bacterium itself because it exists as an inactive protoxin; it activates only in the alkaline gut pH of insects."
            ],
            "examTips": [
              "ADA deficiency is an autosomal recessive genetic defect; permanent cure is possible ONLY if functional ADA gene is introduced at early embryonic stages!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing mature insulin includes the C-peptide. The C-peptide is present only in the pro-hormone and is enzymatically excised during maturation."
        ]
      },
      "formulas": [
        {
          "label": "Mature Insulin Subunit Stoichiometry",
          "formula": "\\text{Proinsulin} \\xrightarrow{-\\text{C-Peptide}} \\text{Active Insulin} = \\text{Chain A (21 aa)} + \\text{Chain B (30 aa)} \\; (\\text{Disulfide Linked})",
          "description": "Proteolytic maturation of human recombinant insulin.",
          "variables": [
            {
              "symbol": "\\text{aa}",
              "meaning": "Amino Acid Residues Count (51 Total)",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-10-01",
          "title": "Bt Crops, RNA Interference & Recombinant Therapeutics Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Bt Crops, RNA Interference & Recombinant Therapeutics.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-10-01",
          "title": "Bt Crops, RNA Interference & Recombinant Therapeutics",
          "summary": "Transgenic agricultural applications: Bt cotton (Bacillus thuringiensis, endotoxin CryIAc and CryIIAb against bollworms, activated by alkaline insect gut pH), RNA interference (RNAi, gene silencing via dsRNA in tobacco roots against Meloidogyne incognita nematode), genetically engineered human insulin (Eli Lilly, separate A and B chains linked by disulfide bonds, devoid of C-peptide), gene therapy for ADA deficiency, and transgenic animals."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000011": [
    {
      "id": "top-bio-12-11-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000011",
      "nodeType": "topic",
      "code": "BIO-12-11-T01",
      "title": "Population Growth Models, Adaptations & Interspecific Interactions",
      "description": "Responses to abiotic factors (regulators, conformers, migration, diapause), physiological adaptations (Allen’s rule, altitude sickness acclimatization), population attributes (birth rate, death rate, age pyramids), exponential growth dN/dt = rN, logistic growth dN/dt = rN(1 - N/K), carrying capacity K, and interspecific interactions (mutualism, competition, predation, parasitism, commensalism, amensalism).",
      "sequenceOrder": 1,
      "weightagePercent": 6.5,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Ecology investigates organisms' relationships with physical environments and biotic communities. Population ecology mathematically models demographic growth trajectories and competitive species interactions.",
        "sections": [
          {
            "heading": "Population Growth Models and Interspecific Dynamics",
            "paragraphs": [
              "Ecological Adaptations: Allen’s Rule (mammals in colder climates have shorter ears and limbs to minimize heat loss); High Altitude Acclimatization (body compensates for low atmospheric pO2 by increasing RBC production, increasing breathing rate, and decreasing hemoglobin-O2 binding affinity).",
              "Exponential Growth (Unlimited Resources): J-shaped curve: dN/dt = (b - d) N = r N. Integrated form: N_t = N_0 e^(r t), where r is intrinsic rate of natural increase.",
              "Logistic Growth (Verhulst-Pearl, Limited Resources): S-shaped sigmoid curve: dN/dt = r N [(K - N) / K], where K is environmental carrying capacity. More realistic model in nature as resources are finite.",
              "Interspecific Interactions: Mutualism (+, +: mycorrhiza, lichens, fig-wasp coevolution); Commensalism (+, 0: orchid on mango tree, barnacles on whale, cattle egret and grazing cattle); Parasitism (+, -: Cuscuta on host, liver fluke, brood parasitism in cuckoo/koel); Predation (+, -: keeps prey populations under control, transfers energy); Competition (-, -: Gause’s Competitive Exclusion Principle states two closely related species competing for identical limiting resources cannot coexist indefinitely; MacArthur showed 5 species of warblers coexisted via resource partitioning); Amensalism (-, 0: Penicillium producing penicillin inhibiting bacterial growth)."
            ],
            "keyTakeaways": [
              "Carrying capacity K represents the maximum population size that an environment's resources can sustainably support.",
              "Brood parasitism: The koel (cuckoo) lays its eggs in the nest of a crow, evolving eggs resembling host eggs to prevent rejection."
            ],
            "examTips": [
              "Gause’s Competitive Exclusion Principle holds when resources are limiting; Resource partitioning (MacArthur's warblers) avoids competitive exclusion by foraging at different times!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming exponential growth can continue indefinitely in nature. Real populations invariably encounter resource limits and follow the logistic Verhulst-Pearl sigmoid curve."
        ]
      },
      "formulas": [
        {
          "label": "Exponential and Logistic Population Growth",
          "formula": "\\frac{dN}{dt} = r N \\; (\\text{Exponential: } N_t = N_0 e^{rt}), \\quad \\frac{dN}{dt} = r N \\left( \\frac{K - N}{K} \\right) \\; (\\text{Verhulst-Pearl Logistic})",
          "description": "Differential growth equations modeling density-independent exponential vs density-dependent logistic populations.",
          "variables": [
            {
              "symbol": "N",
              "meaning": "Population Density",
              "unit": "-"
            },
            {
              "symbol": "r",
              "meaning": "Intrinsic Rate of Natural Increase",
              "unit": "\\text{time}^{-1}"
            },
            {
              "symbol": "K",
              "meaning": "Carrying Capacity",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-11-01",
          "title": "Population Growth Models, Adaptations & Interspecific Interactions Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Population Growth Models, Adaptations & Interspecific Interactions.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-11-01",
          "title": "Population Growth Models, Adaptations & Interspecific Interactions",
          "summary": "Responses to abiotic factors (regulators, conformers, migration, diapause), physiological adaptations (Allen’s rule, altitude sickness acclimatization), population attributes (birth rate, death rate, age pyramids), exponential growth dN/dt = rN, logistic growth dN/dt = rN(1 - N/K), carrying capacity K, and interspecific interactions (mutualism, competition, predation, parasitism, commensalism, amensalism)."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000012": [
    {
      "id": "top-bio-12-12-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000012",
      "nodeType": "topic",
      "code": "BIO-12-12-T01",
      "title": "Ecosystem Productivity, Decomposition & Energy Flow 10% Law",
      "description": "Ecosystem structure and function, productivity (Gross Primary Productivity GPP, Net Primary Productivity NPP = GPP - R), decomposition steps (fragmentation, leaching, catabolism, humification, mineralization), Lindeman’s 10% energy transfer law, food chains and webs, and ecological pyramids of number, biomass, and energy (always upright).",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "An ecosystem is a functional ecological unit where biotic communities interact with physical environments. Energy flows unidirectionally through trophic levels, dissipating as heat according to thermodynamic laws.",
        "sections": [
          {
            "heading": "Energy Transfer and Ecological Pyramids",
            "paragraphs": [
              "Productivity: Gross Primary Productivity (GPP) is the total rate of biomass/organic matter synthesis during photosynthesis. Net Primary Productivity (NPP): NPP = GPP - R (where R is respiratory loss). NPP is the biomass available for consumption by heterotrophs.",
              "Decomposition: Breakdown of complex organic detritus into inorganic raw materials (CO2, H2O, nutrients): (1) Fragmentation (earthworms break detritus into smaller particles); (2) Leaching (water-soluble inorganic nutrients seep into soil horizon); (3) Catabolism (bacterial and fungal enzymes degrade detritus); (4) Humification (leads to accumulation of dark amorphous colloidal humus, resistant to microbial action); (5) Mineralization (release of inorganic nutrients).",
              "Energy Flow (Lindeman’s 10% Law): Only about 10% of the energy is transferred from one trophic level to the next higher level; 90% is lost as metabolic heat. Hence, food chains rarely exceed 4-5 trophic levels.",
              "Ecological Pyramids: Pyramid of Energy is ALWAYS upright without exception, because energy is irreversibly lost as heat at each transfer. Pyramid of Numbers can be inverted (single oak tree supporting thousands of insects and birds). Pyramid of Biomass in sea is inverted (phytoplankton standing crop is smaller than zooplankton/fishes due to rapid turnover)."
            ],
            "keyTakeaways": [
              "The annual net primary productivity of the whole biosphere is approximately 170 billion tons (dry weight) of organic matter, with oceans contributing only 55 billion tons despite occupying 70% of Earth's surface.",
              "Humus is colloidal in nature and serves as an immense reservoir of nutrients."
            ],
            "examTips": [
              "The pyramid of energy is NEVER inverted under any circumstance because of the Second Law of Thermodynamics!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Believing all ecological pyramids are upright. The pyramid of biomass in an aquatic ecosystem is INVERTED because phytoplankton have very small standing biomass at any given moment."
        ]
      },
      "formulas": [
        {
          "label": "Net Primary Productivity & Lindeman’s 10% Law",
          "formula": "\\text{NPP} = \\text{GPP} - R, \\quad E_{n+1} \\approx 0.10 \\times E_n \\quad (10\\% \\text{ Energy Trophic Efficiency})",
          "description": "Formulas for net autotrophic biomass yield and inter-trophic thermodynamic energy transfer.",
          "variables": [
            {
              "symbol": "\\text{NPP}",
              "meaning": "Net Primary Productivity",
              "unit": "\\text{g}/(\\text{m}^2 \\text{yr})"
            },
            {
              "symbol": "\\text{GPP}",
              "meaning": "Gross Primary Productivity",
              "unit": "\\text{g}/(\\text{m}^2 \\text{yr})"
            },
            {
              "symbol": "R",
              "meaning": "Autotrophic Respiration Loss",
              "unit": "\\text{g}/(\\text{m}^2 \\text{yr})"
            },
            {
              "symbol": "E_n",
              "meaning": "Trophic Level Energy",
              "unit": "\\text{kcal}"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-12-01",
          "title": "Ecosystem Productivity, Decomposition & Energy Flow 10% Law Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Ecosystem Productivity, Decomposition & Energy Flow 10% Law.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-12-01",
          "title": "Ecosystem Productivity, Decomposition & Energy Flow 10% Law",
          "summary": "Ecosystem structure and function, productivity (Gross Primary Productivity GPP, Net Primary Productivity NPP = GPP - R), decomposition steps (fragmentation, leaching, catabolism, humification, mineralization), Lindeman’s 10% energy transfer law, food chains and webs, and ecological pyramids of number, biomass, and energy (always upright)."
        }
      ]
    }
  ],
  "c0000042-0000-0000-0000-000000000013": [
    {
      "id": "top-bio-12-13-01",
      "subjectId": "biology",
      "gradeId": "class_12",
      "boardId": "cbse",
      "parentId": "c0000042-0000-0000-0000-000000000013",
      "nodeType": "topic",
      "code": "BIO-12-13-T01",
      "title": "Biodiversity Levels, Species-Area Relationship & Conservation",
      "description": "Levels of biodiversity (genetic, species, ecological), latitudinal gradients in diversity, Alexander von Humboldt’s Species-Area relationship log S = log C + Z log A, Tilman’s long-term ecosystem stability, Paul Ehrlich’s 'Rivet Popper' hypothesis, causes of biodiversity loss ('The Evil Quartet': habitat loss/fragmentation, over-exploitation, alien species invasions, co-extinctions), and In-situ vs Ex-situ conservation.",
      "sequenceOrder": 1,
      "weightagePercent": 6.0,
      "estimatedMinutes": 45,
      "masteryStatus": "uncalibrated",
      "retentionPercent": 100,
      "notes": {
        "overview": "Biodiversity represents biological variety across all organizational levels. Ecosystem stability depends on species richness. Anthropogenic pressures cause unprecedented biodiversity loss, requiring global in-situ and ex-situ conservation.",
        "sections": [
          {
            "heading": "Species Richness Gradients and Conservation Strategies",
            "paragraphs": [
              "Levels of Biodiversity: Genetic (e.g. Rauwolfia vomitoria producing reserpine, 50,000 strains of rice, 1,000 varieties of mango); Species (amphibians have higher species diversity in Western Ghats than Eastern Ghats); Ecological (India has deserts, rain forests, mangroves, coral reefs, wetlands).",
              "Latitudinal Gradients: Species diversity decreases from equator toward poles. Tropics harbor more species because: (1) Historically unglaciated, allowing long evolutionary time; (2) More constant, predictable environments reducing niche specialization; (3) Higher solar energy availability leading to higher productivity.",
              "Species-Area Relationship (Alexander von Humboldt): On a logarithmic scale: log S = log C + Z log A (straight line with slope Z). For small regions Z = 0.1 to 0.2; for entire continents Z = 0.6 to 1.2 (frugivorous birds in tropical forests Z = 1.15).",
              "The Evil Quartet (Causes of Extinction): (1) Habitat loss and fragmentation (most important cause: Amazon rainforest 'lungs of the planet' cut for soybeans and cattle); (2) Over-exploitation (Steller’s sea cow, passenger pigeon); (3) Alien species invasion (Nile perch in Lake Victoria caused extinction of 200 cichlid fish species; Parthenium, Eichhornia water hyacinth, African catfish Clarias gariepinus); (4) Co-extinctions (obligate mutualism).",
              "Conservation Strategies: In-situ (on-site: 14 Biosphere Reserves, 90+ National Parks, 448+ Wildlife Sanctuaries, Sacred Groves like Khasi and Jaintia Hills in Meghalaya); Ex-situ (off-site: Zoological parks, Botanical gardens, Wildlife safari parks, Cryopreservation of gametes at -196 °C in liquid nitrogen, seed banks)."
            ],
            "keyTakeaways": [
              "Sacred groves are traditional forest patches protected by indigenous communities due to religious beliefs, serving as last refuges for rare and threatened plants.",
              "Biodiversity Hotspots: Regions with exceptionally high species richness and high degree of endemism (Western Ghats-Sri Lanka, Indo-Burma, Himalaya)."
            ],
            "examTips": [
              "Humboldt's Species-Area equation: S = C * A^Z. On a log-log scale it is a straight line: log S = log C + Z log A, where Z is the regression coefficient!"
            ]
          }
        ],
        "commonMisconceptions": [
          "Assuming botanical gardens and zoos are in-situ conservation. They are EX-SITU (off-site) conservation methods where endangered organisms are protected outside their natural habitats."
        ]
      },
      "formulas": [
        {
          "label": "Humboldt’s Species-Area Relationship",
          "formula": "S = C A^Z \\iff \\log_{10} S = \\log_{10} C + Z \\log_{10} A",
          "description": "Power law relationship linking species richness S to geographical sampling area A.",
          "variables": [
            {
              "symbol": "S",
              "meaning": "Species Richness",
              "unit": "-"
            },
            {
              "symbol": "A",
              "meaning": "Geographical Area",
              "unit": "\\text{km}^2"
            },
            {
              "symbol": "Z",
              "meaning": "Regression Coefficient (Slope)",
              "unit": "-"
            },
            {
              "symbol": "C",
              "meaning": "Y-Intercept Constant",
              "unit": "-"
            }
          ]
        }
      ],
      "artifacts": [
        {
          "id": "art-model-top-bio-12-13-01",
          "title": "Biodiversity Levels, Species-Area Relationship & Conservation Conceptual Visual Model",
          "description": "Orthogonal visual breakdown and parameter relationships for Biodiversity Levels, Species-Area Relationship & Conservation.",
          "artifactType": "concept_model"
        }
      ],
      "concepts": [
        {
          "id": "c-top-bio-12-13-01",
          "title": "Biodiversity Levels, Species-Area Relationship & Conservation",
          "summary": "Levels of biodiversity (genetic, species, ecological), latitudinal gradients in diversity, Alexander von Humboldt’s Species-Area relationship log S = log C + Z log A, Tilman’s long-term ecosystem stability, Paul Ehrlich’s 'Rivet Popper' hypothesis, causes of biodiversity loss ('The Evil Quartet': habitat loss/fragmentation, over-exploitation, alien species invasions, co-extinctions), and In-situ vs Ex-situ conservation."
        }
      ]
    }
  ]
};
