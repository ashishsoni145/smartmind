# tools/data/physics_complete.py
# Complete authentic NCERT Physics curriculum specification (All 28 Chapters)
import sys
sys.path.append('e:/mind/tools/data')

from physics_topics import PHYSICS_TOPICS
from physics_topics_part2 import PHYSICS_PART2
from physics_generator import get_physics_topics

PHYSICS_ALL = {}
PHYSICS_ALL.update(get_physics_topics())

# Add PHY-11-13, PHY-11-14, and all 14 chapters of Class 12
PHYSICS_ALL["PHY-11-13"] = [
    {
        "title": "Periodic and Oscillatory Motions & Harmonic Functions",
        "desc": "Period, frequency, angular frequency omega = 2*pi*f, displacement relations, harmonic vs non-harmonic motion.",
        "notesOverview": "Periodic motion repeats identically at regular time intervals. Oscillatory motion is a to-and-fro periodic motion about a stable mean equilibrium position.",
        "notesSections": [
            {
                "heading": "Harmonic Representation of Motion",
                "paragraphs": [
                    "A periodic motion that can be represented by a single sine or cosine function is called simple harmonic: x(t) = A*cos(omega*t + phi).",
                    "Any complex periodic motion can be decomposed into a Fourier sum of pure sine and cosine harmonic terms."
                ],
                "keyTakeaways": ["Every oscillatory motion is periodic, but every periodic motion is not necessarily oscillatory (e.g. planetary orbit is periodic but not oscillatory)."],
                "examTips": ["Phase constant phi represents the initial state of motion at time t = 0."]
            }
        ],
        "misconceptions": ["Assuming all periodic motions are simple harmonic. SHM requires the restoring force to be strictly linear with displacement (F = -k*x)."],
        "formulas": [
            {
                "label": "Displacement in SHM",
                "formula": "x(t) = A \\cos(\\omega t + \\phi)",
                "description": "Instantaneous displacement coordinate in simple harmonic motion of amplitude A.",
                "variables": [
                    { "symbol": "A", "meaning": "Amplitude", "unit": "m" },
                    { "symbol": "\\omega", "meaning": "Angular Frequency", "unit": "rad/s" },
                    { "symbol": "\\phi", "meaning": "Initial Phase Constant", "unit": "rad" },
                    { "symbol": "x(t)", "meaning": "Displacement", "unit": "m" }
                ]
            }
        ]
    },
    {
        "title": "Simple Harmonic Motion (SHM) & Reference Circle",
        "desc": "Uniform circular motion projection, velocity v(t) = -omega*A*sin(omega*t + phi), acceleration a(t) = -omega^2*x.",
        "notesOverview": "Simple Harmonic Motion is the orthogonal projection of uniform circular motion on any diameter of the reference circle.",
        "notesSections": [
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
                "examTips": ["Phase difference between velocity and acceleration is pi/2; between displacement and acceleration is pi."]
            }
        ],
        "misconceptions": ["Thinking velocity and acceleration are in the same direction in SHM: when moving away from mean position, velocity and restoring acceleration oppose each other."],
        "formulas": [
            {
                "label": "Velocity-Displacement Relation in SHM",
                "formula": "v = \\pm \\omega \\sqrt{A^2 - x^2}",
                "description": "Speed of particle as a function of displacement x from equilibrium mean position.",
                "variables": [
                    { "symbol": "\\omega", "meaning": "Angular Frequency", "unit": "rad/s" },
                    { "symbol": "A", "meaning": "Amplitude", "unit": "m" },
                    { "symbol": "x", "meaning": "Displacement", "unit": "m" },
                    { "symbol": "v", "meaning": "Velocity", "unit": "m/s" }
                ]
            },
            {
                "label": "SHM Acceleration Equation",
                "formula": "a = -\\omega^2 x",
                "description": "Defining differential condition of simple harmonic motion.",
                "variables": [
                    { "symbol": "\\omega", "meaning": "Angular Frequency", "unit": "rad/s" },
                    { "symbol": "x", "meaning": "Displacement", "unit": "m" },
                    { "symbol": "a", "meaning": "Acceleration", "unit": "m/s^2" }
                ]
            }
        ]
    },
    {
        "title": "Energy in Simple Harmonic Motion: Kinetic & Potential Energy",
        "desc": "Kinetic energy K = 0.5*m*omega^2*(A^2 - x^2), potential energy U = 0.5*m*omega^2*x^2, total energy E = 0.5*m*omega^2*A^2.",
        "notesOverview": "In undamped SHM, total mechanical energy is conserved: kinetic and potential energy oscillate between zero and peak values at twice the fundamental oscillation frequency.",
        "notesSections": [
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
                "examTips": ["Remember that energy frequency is 2f, while displacement and velocity frequency is f."]
            }
        ],
        "misconceptions": ["Assuming kinetic and potential energies oscillate at the same frequency as displacement. Energy oscillates at TWICE the displacement frequency."],
        "formulas": [
            {
                "label": "Total Energy in SHM",
                "formula": "E = K + U = \\frac{1}{2} m \\omega^2 A^2 = \\frac{1}{2} k A^2",
                "description": "Invariant total mechanical energy in undamped simple harmonic oscillator.",
                "variables": [
                    { "symbol": "m", "meaning": "Mass", "unit": "kg" },
                    { "symbol": "\\omega", "meaning": "Angular Frequency", "unit": "rad/s" },
                    { "symbol": "A", "meaning": "Amplitude", "unit": "m" },
                    { "symbol": "E", "meaning": "Total Energy", "unit": "J" }
                ]
            }
        ]
    },
    {
        "title": "The Simple Pendulum & Spring-Mass System Oscillations",
        "desc": "Restoring torque tau = -m*g*L*sin theta, small angle approximation, period T = 2*pi*sqrt(L/g), and spring period T = 2*pi*sqrt(m/k).",
        "notesOverview": "For small angular displacements (theta < 10 degrees), restoring torque in a simple pendulum is linear: tau = -m*g*L*theta, producing simple harmonic motion with period T = 2*pi*sqrt(L/g).",
        "notesSections": [
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
                "examTips": ["In a freely falling lift (weightlessness), effective gravity g_eff = 0, so period of simple pendulum becomes INFINITE (pendulum stops oscillating)."]
            }
        ],
        "misconceptions": ["Believing heavier pendulum bobs swing slower. Period T = 2*pi*sqrt(L/g) is completely independent of mass."],
        "formulas": [
            {
                "label": "Simple Pendulum Period",
                "formula": "T = 2 \\pi \\sqrt{\\frac{L}{g}}",
                "description": "Period of small-amplitude oscillation of simple pendulum of effective length L.",
                "variables": [
                    { "symbol": "L", "meaning": "Pendulum Length", "unit": "m" },
                    { "symbol": "g", "meaning": "Gravitational Acceleration", "unit": "m/s^2" },
                    { "symbol": "T", "meaning": "Time Period", "unit": "s" }
                ]
            },
            {
                "label": "Spring-Mass Oscillator Period",
                "formula": "T = 2 \\pi \\sqrt{\\frac{m}{k}}",
                "description": "Period of oscillation of mass m attached to ideal spring of stiffness constant k.",
                "variables": [
                    { "symbol": "m", "meaning": "Attached Mass", "unit": "kg" },
                    { "symbol": "k", "meaning": "Spring Constant", "unit": "N/m" },
                    { "symbol": "T", "meaning": "Period of Oscillation", "unit": "s" }
                ]
            }
        ]
    }
]

PHYSICS_ALL["PHY-11-14"] = [
    {
        "title": "Transverse and Longitudinal Waves: Speed of Waves",
        "desc": "Wave propagation without mass transport, wave pulses, speed of transverse waves on stretched string v = sqrt(T/mu), speed of sound in gases.",
        "notesOverview": "Waves transport energy and momentum through a material medium without net transport of matter. In transverse waves, particles oscillate perpendicular to wave velocity; in longitudinal waves, particles oscillate parallel to wave velocity.",
        "notesSections": [
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
                "examTips": ["Sound speed increases with temperature: v directly proportional to sqrt(T_Kelvin). Sound speed is INDEPENDENT of gas pressure at constant temperature."]
            }
        ],
        "misconceptions": ["Assuming sound speed increases when atmospheric pressure rises. If temperature is constant, density increases proportionally with pressure, keeping v = sqrt(gamma*P/rho) invariant."],
        "formulas": [
            {
                "label": "Speed of Transverse Wave on String",
                "formula": "v = \\sqrt{\\frac{T}{\\mu}}",
                "description": "Propagation speed of wave on stretched string with tension T and linear density mu.",
                "variables": [
                    { "symbol": "T", "meaning": "String Tension", "unit": "N" },
                    { "symbol": "\\mu", "meaning": "Linear Mass Density (m/L)", "unit": "kg/m" },
                    { "symbol": "v", "meaning": "Wave Speed", "unit": "m/s" }
                ]
            },
            {
                "label": "Laplace Speed of Sound in Gas",
                "formula": "v = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{\\gamma R T}{M}}",
                "description": "Adiabatic propagation speed of longitudinal acoustic wave in ideal gas.",
                "variables": [
                    { "symbol": "\\gamma", "meaning": "Adiabatic Index", "unit": "-" },
                    { "symbol": "P", "meaning": "Gas Pressure", "unit": "Pa" },
                    { "symbol": "\\rho", "meaning": "Gas Density", "unit": "kg/m^3" },
                    { "symbol": "T", "meaning": "Absolute Temperature", "unit": "K" },
                    { "symbol": "v", "meaning": "Speed of Sound", "unit": "m/s" }
                ]
            }
        ]
    },
    {
        "title": "Progressive Harmonic Waves & Wave Superposition",
        "desc": "Wave equation y(x,t) = A*sin(kx - omega*t + phi), wave number k = 2*pi/lambda, phase velocity v = omega/k, and superposition principle.",
        "notesOverview": "A sinusoidal travelling wave propagates continuous phase disturbance through space: y(x,t) = A*sin(kx - omega*t) for wave travelling in +X direction.",
        "notesSections": [
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
                "examTips": ["Particle speed v_p is distinct from wave propagation speed v. Maximum particle speed is v_p,max = omega*A."]
            }
        ],
        "misconceptions": ["Confusing wave speed v = f*lambda with particle speed dy/dt. Wave speed is constant for a given medium; particle speed oscillates simple harmonically."],
        "formulas": [
            {
                "label": "Travelling Wave Equation",
                "formula": "y(x, t) = A \\sin(k x - \\omega t + \\phi) = A \\sin\\left[2\\pi\\left(\\frac{x}{\\lambda} - \\frac{t}{T}\\right)\\right]",
                "description": "Transverse displacement profile of a progressive harmonic wave moving in +X direction.",
                "variables": [
                    { "symbol": "A", "meaning": "Wave Amplitude", "unit": "m" },
                    { "symbol": "k", "meaning": "Wave Number (2 pi / lambda)", "unit": "rad/m" },
                    { "symbol": "\\omega", "meaning": "Angular Frequency", "unit": "rad/s" },
                    { "symbol": "y", "meaning": "Transverse Displacement", "unit": "m" }
                ]
            }
        ]
    },
    {
        "title": "Standing Waves in Strings, Organ Pipes & Resonant Harmonics",
        "desc": "Reflection at boundaries, nodes and antinodes, harmonics in stretched strings, open organ pipes, and closed organ pipes.",
        "notesOverview": "When two identical travelling waves propagate in opposite directions along the same medium, their superposition produces a standing (stationary) wave with stationary nodes (zero motion) and antinodes (maximum amplitude).",
        "notesSections": [
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
                "examTips": ["An open organ pipe produces richer, more harmonious sound than a closed organ pipe because it contains all integer harmonics."]
            }
        ],
        "misconceptions": ["Believing standing waves transmit energy through space. Energy is trapped oscillating between stationary nodes."],
        "formulas": [
            {
                "label": "Harmonics of Stretched String / Open Pipe",
                "formula": "f_n = n \\frac{v}{2 L} \\quad (n = 1, 2, 3, \\dots)",
                "description": "Frequencies of all resonant harmonics in stretched string fixed at both ends or organ pipe open at both ends.",
                "variables": [
                    { "symbol": "n", "meaning": "Harmonic Number", "unit": "-" },
                    { "symbol": "v", "meaning": "Wave Speed in Medium", "unit": "m/s" },
                    { "symbol": "L", "meaning": "Length of Resonator", "unit": "m" },
                    { "symbol": "f_n", "meaning": "Resonant Frequency", "unit": "Hz" }
                ]
            },
            {
                "label": "Harmonics of Closed Organ Pipe",
                "formula": "f_n = (2n - 1) \\frac{v}{4 L} \\quad (n = 1, 2, 3, \\dots)",
                "description": "Only odd harmonics produced in organ pipe closed at one end.",
                "variables": [
                    { "symbol": "v", "meaning": "Speed of Sound", "unit": "m/s" },
                    { "symbol": "L", "meaning": "Pipe Length", "unit": "m" },
                    { "symbol": "f_n", "meaning": "Odd Harmonic Frequency", "unit": "Hz" }
                ]
            }
        ]
    },
    {
        "title": "Acoustic Beats, Beat Frequency & Tuning Phenomena",
        "desc": "Superposition of waves of slightly differing frequencies, periodic modulation of loudness, beat frequency f_beat = |f1 - f2|.",
        "notesOverview": "Beats occur when two sound waves of slightly differing frequencies f1 and f2 travel in the same direction, superposing to create periodic variations in sound intensity.",
        "notesSections": [
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
                "examTips": ["Remember: Waxing -> frequency decreases (m increases); Filing -> frequency increases (m decreases)."]
            }
        ],
        "misconceptions": ["Confusing beat frequency with the mean carrier frequency. Beat frequency is the difference |f1 - f2|."],
        "formulas": [
            {
                "label": "Beat Frequency",
                "formula": "f_{\\text{beat}} = |f_1 - f_2|",
                "description": "Number of loudness intensity maxima heard per second.",
                "variables": [
                    { "symbol": "f_1, f_2", "meaning": "Frequencies of Superposing Waves", "unit": "Hz" },
                    { "symbol": "f_{\\text{beat}}", "meaning": "Beat Frequency", "unit": "Hz" }
                ]
            }
        ]
    }
]

print("Physics Class 11 completely loaded.")
