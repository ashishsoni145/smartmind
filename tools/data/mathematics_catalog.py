# tools/data/mathematics_catalog.py
# Authentic NCERT Mathematics Catalog (All 27 Chapters: Class 11 & Class 12)

def get_mathematics_catalog():
    cat = {}

    # ==========================================
    # CLASS 11 MATHEMATICS
    # ==========================================

    # MATH-11-01: Sets
    cat["MATH-11-01"] = [
        {
            "title": "Set Operations, Venn Diagrams & De Morgan’s Laws",
            "desc": "Representation of sets (roster and set-builder), empty set, subsets, power sets, universal sets, Venn diagrams, union, intersection, complement, and De Morgan’s laws.",
            "notesOverview": "A set is a well-defined collection of distinct objects. Set theory provides foundational language for relations, functions, probability, and mathematical analysis.",
            "notesSections": [
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
                    "examTips": ["For three sets: n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - n(A \\cap B) - n(B \\cap C) - n(C \\cap A) + n(A \\cap B \\cap C)."]
                }
            ],
            "misconceptions": ["Believing the empty set has no subsets. The empty set \\emptyset is a subset of every set, including itself: P(\\emptyset) = {\\emptyset} with 2^0 = 1 element."],
            "formulas": [
                {
                    "label": "Inclusion-Exclusion Principle",
                    "formula": "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
                    "description": "Fundamental cardinality theorem for two finite intersecting sets.",
                    "variables": [
                        { "symbol": "n(A)", "meaning": "Cardinality of Set A", "unit": "-" },
                        { "symbol": "n(B)", "meaning": "Cardinality of Set B", "unit": "-" }
                    ]
                },
                {
                    "label": "De Morgan’s Laws",
                    "formula": "(A \\cup B)' = A' \\cap B', \\quad (A \\cap B)' = A' \\cup B'",
                    "description": "Complementation duality laws in set theory.",
                    "variables": [
                        { "symbol": "A', B'", "meaning": "Complementary Sets", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-02: Relations and Functions
    cat["MATH-11-02"] = [
        {
            "title": "Cartesian Products, Relations & Function Types",
            "desc": "Cartesian product A x B, binary relations, domain, codomain, range, definition of function, polynomial, rational, modulus, signum, greatest integer functions, and algebra of functions.",
            "notesOverview": "Relations associate elements of one set with another. A function is a special relation where each input in domain maps to exactly one unique output in codomain.",
            "notesSections": [
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
                    "examTips": ["For finding range of rational functions like (x^2 - 1)/(x - 1), always exclude undefined points from the range (range is R - {2})."]
                }
            ],
            "misconceptions": ["Assuming [x] is continuous. The floor function [x] has jump discontinuities at every single integer point x in Z."],
            "formulas": [
                {
                    "label": "Total Relations Count",
                    "formula": "N_{\\text{relations}} = 2^{n(A) \\times n(B)} = 2^{p q}",
                    "description": "Total number of binary relations between finite sets of size p and q.",
                    "variables": [
                        { "symbol": "p, q", "meaning": "Set Cardinalities", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-03: Trigonometric Functions
    cat["MATH-11-03"] = [
        {
            "title": "Trigonometric Ratios, Compound Angles & Transformations",
            "desc": "Radian measure, unit circle definitions, signs of trigonometric functions in quadrants (ASTC rule), compound angle formulas sin(x ± y), cos(x ± y), double and triple angle identities, product-to-sum transformations.",
            "notesOverview": "Trigonometric functions generalize circular arc ratios. Trigonometric identities simplify complex geometric and calculus evaluations.",
            "notesSections": [
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
                    "examTips": ["When solving trigonometric equations, be alert to extraneous roots introduced by squaring both sides!"]
                }
            ],
            "misconceptions": ["Writing sin(x + y) = sin x + sin y. Trigonometric operators do not distribute linearly across sums."],
            "formulas": [
                {
                    "label": "Fundamental Compound Angle Identities",
                    "formula": "\\sin(x \\pm y) = \\sin x \\cos y \\pm \\cos x \\sin y, \\quad \\cos(x \\pm y) = \\cos x \\cos y \\mp \\sin x \\sin y",
                    "description": "Sum and difference angle addition theorems.",
                    "variables": [
                        { "symbol": "x, y", "meaning": "Angular Arguments", "unit": "rad" }
                    ]
                },
                {
                    "label": "Double Angle and Half-Angle Power Reduction",
                    "formula": "\\cos 2x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x, \\quad \\sin^2 x = \\frac{1 - \\cos 2x}{2}",
                    "description": "Double angle cosine expansions and power reduction identities.",
                    "variables": [
                        { "symbol": "x", "meaning": "Angle", "unit": "rad" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-04: Complex Numbers and Quadratic Equations
    cat["MATH-11-04"] = [
        {
            "title": "Algebra of Complex Numbers & Modulus-Conjugate",
            "desc": "Imaginary unit i = sqrt(-1), complex numbers z = a + ib, Argand plane representation, modulus |z| = sqrt(a^2 + b^2), conjugate z_bar = a - ib, polar representation r(cos theta + i sin theta), and quadratic equations with negative discriminant.",
            "notesOverview": "Complex numbers extend the real number system to solve algebraic equations lacking real roots. The Argand plane maps complex numbers as 2D geometric vectors.",
            "notesSections": [
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
                    "examTips": ["Principal argument Arg(z) strictly lies in (-pi, pi]. Adjust quadrant signs carefully when computing theta = arctan(|b/a|)."]
                }
            ],
            "misconceptions": ["Writing sqrt(a) * sqrt(b) = sqrt(ab) when both a and b are negative. sqrt(-a) * sqrt(-b) = i sqrt(a) * i sqrt(b) = -sqrt(ab)."],
            "formulas": [
                {
                    "label": "Complex Modulus, Conjugate & Inverse",
                    "formula": "|z| = \\sqrt{a^2 + b^2}, \\quad z \\bar{z} = |z|^2, \\quad z^{-1} = \\frac{\\bar{z}}{|z|^2}",
                    "description": "Relationships connecting complex number z = a + ib with its modulus and conjugate.",
                    "variables": [
                        { "symbol": "z", "meaning": "Complex Number", "unit": "-" },
                        { "symbol": "\\bar{z}", "meaning": "Complex Conjugate", "unit": "-" },
                        { "symbol": "|z|", "meaning": "Modulus Magnitude", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-05: Linear Inequalities
    cat["MATH-11-05"] = [
        {
            "title": "Algebraic & Graphical Solutions of Linear Inequalities",
            "desc": "Linear inequalities in one and two variables, algebraic rules (sign reversal on multiplying by negative numbers), representation on number line, half-plane graphical solutions.",
            "notesOverview": "Inequalities model boundary constraints. Multiplying or dividing both sides by a negative number inverts the inequality symbol.",
            "notesSections": [
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
                    "examTips": ["Never cancel variable factors from both sides of an inequality unless their sign is unconditionally guaranteed!"]
                }
            ],
            "misconceptions": ["Cross-multiplying variables across an inequality without knowing their sign. If x is negative, cross-multiplying flips the sign."],
            "formulas": [
                {
                    "label": "Inequality Reversal Rule",
                    "formula": "a < b \\iff -a > -b, \\quad x < y \\implies c x > c y \\quad (\\text{for } c < 0)",
                    "description": "Directional sign inversion upon scaling by negative coefficients.",
                    "variables": [
                        { "symbol": "a, b", "meaning": "Real Numbers", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-06: Permutations and Combinations
    cat["MATH-11-06"] = [
        {
            "title": "Fundamental Counting Principles, Permutations & Combinations",
            "desc": "Fundamental principle of multiplication and addition, factorial notation n!, permutations nPr = n! / (n - r)!, permutations of repeated items, combinations nCr = n! / (r! (n - r)!), and Pascal identity nCr + nCr-1 = n+1Cr.",
            "notesOverview": "Combinatorics analyzes finite discrete arrangements. Permutations count ordered arrangements, whereas combinations count unordered selections.",
            "notesSections": [
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
                    "examTips": ["Use 'Gap Method' when no two specific items can be adjacent; use 'String/Tie Method' when specific items must always stay together."]
                }
            ],
            "misconceptions": ["Using permutations when order is irrelevant. Handshakes, teams, and committees are combinations (nCr), while rank, codes, and seating rows are permutations (nPr)."],
            "formulas": [
                {
                    "label": "Permutation and Combination Formulas",
                    "formula": "^n P_r = \\frac{n!}{(n - r)!}, \\quad ^n C_r = \\frac{n!}{r!(n - r)!}, \\quad ^n C_r + ^n C_{r-1} = ^{n+1} C_r",
                    "description": "Standard formulas for permutations, combinations, and Pascal's additive identity.",
                    "variables": [
                        { "symbol": "n", "meaning": "Total Objects", "unit": "-" },
                        { "symbol": "r", "meaning": "Selected/Arranged Items", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-07: Binomial Theorem
    cat["MATH-11-07"] = [
        {
            "title": "Binomial Theorem for Positive Integral Index",
            "desc": "Binomial expansion (a + b)^n = sum(nCr a^(n-r) b^r), general term T_(r+1) = nCr a^(n-r) b^r, middle terms, properties of binomial coefficients sum(nCr) = 2^n.",
            "notesOverview": "The Binomial Theorem expands algebraic powers of binomials (a + b)^n into a polynomial sum with coefficients given by combinatorial selections.",
            "notesSections": [
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
                    "examTips": ["To find the sum of all coefficients in any polynomial expansion (ax + by)^n, simply substitute x = 1 and y = 1!"]
                }
            ],
            "misconceptions": ["Confusing the term number with r. The 5th term has r = 4, because terms are indexed as T_(r+1)."],
            "formulas": [
                {
                    "label": "Binomial Expansion and General Term",
                    "formula": "(a + b)^n = \\sum_{r=0}^n {^n C_r} a^{n-r} b^r, \\quad T_{r+1} = {^n C_r} a^{n-r} b^r",
                    "description": "Standard binomial polynomial expansion and indexed general term.",
                    "variables": [
                        { "symbol": "n", "meaning": "Power Index", "unit": "-" },
                        { "symbol": "T_{r+1}", "meaning": "(r+1)-th Term", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-08: Sequences and Series
    cat["MATH-11-08"] = [
        {
            "title": "Geometric Progression (GP) & Relationship between AM and GM",
            "desc": "Geometric progression a, ar, ar^2..., nth term a_n = a r^(n-1), sum of n terms S_n = a(1 - r^n)/(1 - r), infinite GP sum S_inf = a / (1 - r) for |r| < 1, geometric mean GM = sqrt(ab), and AM >= GM inequality.",
            "notesOverview": "Geometric progressions maintain a constant ratio between consecutive terms. The Arithmetic Mean - Geometric Mean (AM-GM) inequality is one of the most powerful optimization tools in mathematics.",
            "notesSections": [
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
                    "examTips": ["Infinite GP formula converges ONLY when |r| < 1. If |r| >= 1, the infinite series diverges to infinity."]
                }
            ],
            "misconceptions": ["Applying infinite GP sum when |r| >= 1. S_inf = a/(1 - r) is valid strictly for -1 < r < 1."],
            "formulas": [
                {
                    "label": "Finite & Infinite Geometric Series",
                    "formula": "S_n = \\frac{a(1 - r^n)}{1 - r}, \\quad S_\\infty = \\frac{a}{1 - r} \\; (|r| < 1), \\quad \\text{AM} \\ge \\text{GM} \\; \\left(\\frac{a + b}{2} \\ge \\sqrt{ab}\\right)",
                    "description": "Formulas for sum of finite GP, convergent infinite GP, and AM-GM inequality.",
                    "variables": [
                        { "symbol": "a", "meaning": "First Term", "unit": "-" },
                        { "symbol": "r", "meaning": "Common Ratio", "unit": "-" },
                        { "symbol": "S_\\infty", "meaning": "Infinite Sum", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-09: Straight Lines
    cat["MATH-11-09"] = [
        {
            "title": "Forms of Straight Line Equations & Distance from Point",
            "desc": "Slope m = tan theta = (y2 - y1)/(x2 - x1), angle between lines tan theta = |(m2 - m1)/(1 + m1 m2)|, parallel (m1 = m2) and perpendicular (m1 m2 = -1) lines, point-slope, slope-intercept, two-point, intercept form x/a + y/b = 1, normal form, and perpendicular distance d = |Ax0 + By0 + C| / sqrt(A^2 + B^2).",
            "notesOverview": "A straight line represents a first-degree linear polynomial in x and y. Slope characterizes inclination, and coordinate geometry formulas compute perpendicular offsets and inter-line angles.",
            "notesSections": [
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
                    "examTips": ["Before applying the parallel line distance formula |C1 - C2| / sqrt(A^2 + B^2), verify that the coefficients of x and y in both equations are exactly identical!"]
                }
            ],
            "misconceptions": ["Applying perpendicular distance formula without absolute value. Distance is a physical geometric length and must always be non-negative."],
            "formulas": [
                {
                    "label": "Distance of Point and Parallel Lines",
                    "formula": "d = \\frac{|A x_0 + B y_0 + C|}{\\sqrt{A^2 + B^2}}, \\quad d_{\\parallel} = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}",
                    "description": "Perpendicular distance from a point to a line, and distance between parallel lines.",
                    "variables": [
                        { "symbol": "d", "meaning": "Perpendicular Distance", "unit": "-" },
                        { "symbol": "A, B, C", "meaning": "Line Coefficients", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-10: Conic Sections
    cat["MATH-11-10"] = [
        {
            "title": "Circle, Parabola, Ellipse & Hyperbola Standard Equations",
            "desc": "Conic definition locus SP = e PM, circle (x - h)^2 + (y - k)^2 = r^2, parabola y^2 = 4ax (focus (a,0), directrix x = -a, latus rectum 4a), ellipse x^2/a^2 + y^2/b^2 = 1 (eccentricity e = sqrt(1 - b^2/a^2)), hyperbola x^2/a^2 - y^2/b^2 = 1.",
            "notesOverview": "Conic sections are curves formed by intersecting a double cone with a plane. Eccentricity e classifies conics: circle (e = 0), parabola (e = 1), ellipse (0 < e < 1), and hyperbola (e > 1).",
            "notesSections": [
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
                    "examTips": ["If the coefficient of x^2 has a larger denominator in an ellipse, the major axis lies along the x-axis; if y^2 has larger denominator, the major axis is vertical along the y-axis."]
                }
            ],
            "misconceptions": ["Assuming eccentricity of a hyperbola can be less than 1. Eccentricity of a hyperbola is strictly e > 1."],
            "formulas": [
                {
                    "label": "Eccentricity & Latus Rectum of Conics",
                    "formula": "e_{\\text{ellipse}} = \\sqrt{1 - \\frac{b^2}{a^2}}, \\quad e_{\\text{hyperbola}} = \\sqrt{1 + \\frac{b^2}{a^2}}, \\quad \\text{L.R.} = \\frac{2b^2}{a}",
                    "description": "Eccentricities and latus rectum lengths for central conic sections.",
                    "variables": [
                        { "symbol": "a", "meaning": "Semi-Major / Transverse Axis", "unit": "-" },
                        { "symbol": "b", "meaning": "Semi-Minor / Conjugate Axis", "unit": "-" },
                        { "symbol": "e", "meaning": "Eccentricity", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-11: Introduction to Three-Dimensional Geometry
    cat["MATH-11-11"] = [
        {
            "title": "Coordinate Axes, Distance & Section Formula in 3D",
            "desc": "3D coordinate axes and octants, distance formula between two points P(x1, y1, z1) and Q(x2, y2, z2), section formula for internal and external division, centroid of triangle.",
            "notesOverview": "Three-dimensional geometry extends Cartesian coordinates by adding an orthogonal z-axis, partitioning space into eight octants.",
            "notesSections": [
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
                    "examTips": ["To find the ratio in which the YZ-plane divides a line segment, set the x-coordinate of the dividing point to zero: x = 0."]
                }
            ],
            "misconceptions": ["Confusing octant numbering with 2D quadrant numbering. Octants I through IV have z > 0; octants V through VIII have z < 0."],
            "formulas": [
                {
                    "label": "3D Distance and Section Formulas",
                    "formula": "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}, \\quad R = \\left(\\frac{m x_2 + n x_1}{m + n}, \\frac{m y_2 + n y_1}{m + n}, \\frac{m z_2 + n z_1}{m + n}\\right)",
                    "description": "Euclidean 3D distance and internal ratio section division formulas.",
                    "variables": [
                        { "symbol": "d", "meaning": "3D Spatial Distance", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-12: Limits and Derivatives
    cat["MATH-11-12"] = [
        {
            "title": "Intuitive Limits, Standard Limits & First Principle Differentiation",
            "desc": "Concept of limit, left-hand and right-hand limits, standard trigonometric limits lim(x->0) sin x / x = 1, polynomial limit lim(x->a) (x^n - a^n)/(x - a) = n a^(n-1), derivative as rate of change, differentiation from first principles f'(x) = lim(h->0) [f(x+h) - f(x)]/h, product rule and quotient rule.",
            "notesOverview": "Calculus analyzes continuous change. A limit investigates function behavior near a point without requiring evaluation at the point. Derivatives quantify instantaneous rate of change via the first principle limit of a secant line slope transitioning into a tangent.",
            "notesSections": [
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
                    "examTips": ["In limits yielding indeterminate form 0/0, factorize, rationalize, or apply standard limits before direct substitution!"]
                }
            ],
            "misconceptions": ["Assuming f(a) must be defined for lim_{x -> a} f(x) to exist. A limit depends solely on neighborhood behavior, completely independent of the function's value at x = a."],
            "formulas": [
                {
                    "label": "Standard Limit Theorems",
                    "formula": "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to a} \\frac{x^n - a^n}{x - a} = n a^{n-1}",
                    "description": "Foundational trigonometric and algebraic standard limits.",
                    "variables": [
                        { "symbol": "x", "meaning": "Limit Variable", "unit": "rad" },
                        { "symbol": "a", "meaning": "Limit Target Point", "unit": "-" }
                    ]
                },
                {
                    "label": "First Principle Derivative & Product Rule",
                    "formula": "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}, \\quad \\frac{d}{dx}[u \\cdot v] = u \\frac{dv}{dx} + v \\frac{du}{dx}",
                    "description": "Definition of derivative from first principles and Leibniz product differentiation rule.",
                    "variables": [
                        { "symbol": "f'(x)", "meaning": "Derivative Rate of Change", "unit": "-" },
                        { "symbol": "h", "meaning": "Infinitesimal Increment", "unit": "-" }
                    ]
                }
            ],
            "simulationId": "secant_tangent_limit"
        }
    ]

    # MATH-11-13: Statistics
    cat["MATH-11-13"] = [
        {
            "title": "Measures of Dispersion: Mean Deviation, Variance & Standard Deviation",
            "desc": "Mean deviation about mean and median, variance sigma^2 = sum(xi - x_bar)^2 / n, standard deviation sigma = sqrt(variance), variance formula for grouped data sigma^2 = [sum fi xi^2 / N] - (x_bar)^2.",
            "notesOverview": "Dispersion quantifies the spread of data points around a central measure. Variance and standard deviation are the primary algebraic dispersion metrics in statistics.",
            "notesSections": [
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
                    "examTips": ["Mean deviation about median is strictly less than or equal to mean deviation about mean: MD(median) <= MD(mean)."]
                }
            ],
            "misconceptions": ["Believing standard deviation can be negative. Standard deviation is defined as the POSITIVE square root of variance (sigma >= 0)."],
            "formulas": [
                {
                    "label": "Variance and Standard Deviation",
                    "formula": "\\sigma^2 = \\frac{1}{N} \\sum f_i x_i^2 - \\bar{x}^2, \\quad \\sigma = \\sqrt{\\sigma^2}, \\quad \\text{CV} = \\frac{\\sigma}{\\bar{x}} \\times 100",
                    "description": "Variance computation, standard deviation, and coefficient of variation.",
                    "variables": [
                        { "symbol": "\\sigma^2", "meaning": "Variance", "unit": "-" },
                        { "symbol": "\\sigma", "meaning": "Standard Deviation", "unit": "-" },
                        { "symbol": "\\bar{x}", "meaning": "Arithmetic Mean", "unit": "-" },
                        { "symbol": "\\text{CV}", "meaning": "Coefficient of Variation", "unit": "%" }
                    ]
                }
            ]
        }
    ]

    # MATH-11-14: Probability
    cat["MATH-11-14"] = [
        {
            "title": "Axiomatic Probability, Mutually Exclusive & Exhaustive Events",
            "desc": "Random experiments, sample spaces, event types (impossible, sure, mutually exclusive, exhaustive), axiomatic definition of probability, addition theorem P(A union B) = P(A) + P(B) - P(A intersection B).",
            "notesOverview": "Probability quantifies the likelihood of random events. Axiomatic probability establishes rigorous set-theoretic rules for events defined on a sample space S.",
            "notesSections": [
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
                    "examTips": ["P(A but not B) = P(A - B) = P(A cap B') = P(A) - P(A cap B)."]
                }
            ],
            "misconceptions": ["Confusing mutually exclusive events with independent events. Mutually exclusive means A cap B = emptyset (disjoint); independent means P(A cap B) = P(A) * P(B)."],
            "formulas": [
                {
                    "label": "Axiomatic Addition Theorem",
                    "formula": "P(A \\cup B) = P(A) + P(B) - P(A \\cap B), \\quad P(A') = 1 - P(A)",
                    "description": "General probability addition law for intersecting events.",
                    "variables": [
                        { "symbol": "P(A)", "meaning": "Probability of Event A", "unit": "-" },
                        { "symbol": "P(A \\cap B)", "meaning": "Joint Probability", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # ==========================================
    # CLASS 12 MATHEMATICS
    # ==========================================

    # MATH-12-01: Relations and Functions
    cat["MATH-12-01"] = [
        {
            "title": "Equivalence Relations & Injective/Surjective Functions",
            "desc": "Types of relations: reflexive, symmetric, transitive, equivalence relations and equivalence classes, types of functions: one-one (injective), onto (surjective), and bijective functions.",
            "notesOverview": "Equivalence relations partition sets into disjoint equivalence classes. Functions with both injective and surjective properties are bijective and possess unique inverses.",
            "notesSections": [
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
                    "examTips": ["To prove a function is onto, express x in terms of y (x = g(y)) and verify that for every y in codomain, x is a valid member of domain!"]
                }
            ],
            "misconceptions": ["Assuming a relation is transitive if (a, b) is in R but no (b, c) exists. If the premise (b, c) is never met, transitivity is vacuously TRUE."],
            "formulas": [
                {
                    "label": "Injectivity Criterion",
                    "formula": "f(x_1) = f(x_2) \\implies x_1 = x_2, \\quad \\text{Range}(f) = \\text{Codomain}(B) \\; (\\text{for onto})",
                    "description": "Mathematical definitions of one-one and onto function mappings.",
                    "variables": [
                        { "symbol": "x_1, x_2", "meaning": "Domain Elements", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-02: Inverse Trigonometric Functions
    cat["MATH-12-02"] = [
        {
            "title": "Principal Value Branches & Elementary Properties",
            "desc": "Domain, range and principal value branches of sin^-1, cos^-1, tan^-1, cosec^-1, sec^-1, cot^-1, graphs of inverse trigonometric functions, and properties sin^-1(-x) = -sin^-1 x, cos^-1(-x) = pi - cos^-1 x, sin^-1 x + cos^-1 x = pi / 2.",
            "notesOverview": "Trigonometric functions are periodic and not one-one over R; restricting their domains produces bijective branches that define inverse trigonometric functions.",
            "notesSections": [
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
                    "examTips": ["Watch out for negative arguments in cos^-1, sec^-1, and cot^-1: cos^-1(-1/2) = pi - pi/3 = 2pi/3, NOT -pi/3!"]
                }
            ],
            "misconceptions": ["Writing sin^-1 x = 1 / sin x. sin^-1 x denotes the inverse function arcsin(x), whereas (sin x)^-1 = cosec x."],
            "formulas": [
                {
                    "label": "Inverse Trigonometric Complementary Identities",
                    "formula": "\\sin^{-1} x + \\cos^{-1} x = \\frac{\\pi}{2}, \\quad \\tan^{-1} x + \\cot^{-1} x = \\frac{\\pi}{2}, \\quad \\cos^{-1}(-x) = \\pi - \\cos^{-1} x",
                    "description": "Complementary angle identities and negative argument reflection laws.",
                    "variables": [
                        { "symbol": "x", "meaning": "Real Argument", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-03: Matrices
    cat["MATH-12-03"] = [
        {
            "title": "Matrix Algebra, Multiplication & Transpose",
            "desc": "Matrix order m x n, types of matrices (column, row, square, diagonal, scalar, identity, zero), matrix addition, scalar multiplication, matrix multiplication (non-commutative AB != BA), transpose of matrix (A^T), symmetric (A^T = A) and skew-symmetric (A^T = -A) matrices.",
            "notesOverview": "Matrices are rectangular arrays of numbers representing linear maps. Matrix multiplication is associative and distributive, but generally non-commutative.",
            "notesSections": [
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
                    "examTips": ["Remember the reversal law: (AB)^T = B^T A^T, and for three matrices (ABC)^T = C^T B^T A^T."]
                }
            ],
            "misconceptions": ["Assuming AB = BA for square matrices. Matrix multiplication is non-commutative except for special pairs like commuting diagonal matrices or A and its inverse."],
            "formulas": [
                {
                    "label": "Matrix Decomposition & Reversal Rule",
                    "formula": "(A B)^T = B^T A^T, \\quad A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)",
                    "description": "Transpose product reversal law and unique decomposition into symmetric and skew-symmetric parts.",
                    "variables": [
                        { "symbol": "A, B", "meaning": "Square Matrices", "unit": "-" },
                        { "symbol": "A^T", "meaning": "Transpose Matrix", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-04: Determinants
    cat["MATH-12-04"] = [
        {
            "title": "Determinant Properties, Adjoint, Inverse & Cramer’s Rule",
            "desc": "Determinant of 2x2 and 3x3 matrices, minors and cofactors C_ij = (-1)^(i+j) M_ij, adjoint adj(A) = C^T, matrix inverse A^-1 = adj(A) / det(A), and solving systems of linear equations AX = B via matrix method X = A^-1 B.",
            "notesOverview": "The determinant maps square matrices to scalar values measuring volumetric scaling. A matrix is invertible if and only if its determinant is non-zero (non-singular).",
            "notesSections": [
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
                    "examTips": ["If |A| = 0, the matrix is singular and CANNOT be inverted."]
                }
            ],
            "misconceptions": ["Writing |k A| = k |A|. Factoring k out from an n x n determinant factors k from each of the n rows, giving k^n |A|."],
            "formulas": [
                {
                    "label": "Adjoint Identity & Matrix Inverse",
                    "formula": "A \\cdot \\text{adj}(A) = |A| I_n, \\quad A^{-1} = \\frac{1}{|A|} \\text{adj}(A) \\quad (|A| \\ne 0)",
                    "description": "Fundamental matrix inversion theorem via determinant and adjoint.",
                    "variables": [
                        { "symbol": "|A|", "meaning": "Matrix Determinant", "unit": "-" },
                        { "symbol": "\\text{adj}(A)", "meaning": "Adjoint Matrix", "unit": "-" },
                        { "symbol": "A^{-1}", "meaning": "Inverse Matrix", "unit": "-" }
                    ]
                },
                {
                    "label": "Determinant of Adjoint and Scalar Scaling",
                    "formula": "|\\text{adj}(A)| = |A|^{n - 1}, \\quad |k A| = k^n |A|",
                    "description": "Adjoint determinant power and scalar expansion in n-dimensional matrix.",
                    "variables": [
                        { "symbol": "n", "meaning": "Matrix Dimension / Order", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-05: Continuity and Differentiability
    cat["MATH-12-05"] = [
        {
            "title": "Continuity, Chain Rule, Implicit & Logarithmic Differentiation",
            "desc": "Continuity at a point lim(x->c) f(x) = f(c), differentiability implies continuity, chain rule for composite functions, derivatives of inverse trigonometric functions, implicit differentiation, logarithmic differentiation y = u(x)^v(x), parametric differentiation, and second order derivatives d^2y/dx^2.",
            "notesOverview": "Continuity requires no breaks in a function's curve; differentiability requires a smooth unique tangent line. Differentiability is a strictly stronger condition: every differentiable function is continuous, but the converse is false (e.g. |x| at x = 0).",
            "notesSections": [
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
                    "examTips": ["When computing parametric second derivatives, never simply differentiate numerator and denominator separately! d^2y/dx^2 != (d^2y/dt^2)/(d^2x/dt^2)."]
                }
            ],
            "misconceptions": ["Assuming continuity implies differentiability. Functions with sharp corners (like |x|) or vertical tangents (x^(1/3)) are continuous but not differentiable at those points."],
            "formulas": [
                {
                    "label": "Logarithmic & Parametric Second Derivative",
                    "formula": "\\frac{d}{dx}[u^v] = u^v \\left( v' \\ln u + \\frac{v u'}{u} \\right), \\quad \\frac{d^2 y}{dx^2} = \\frac{d}{dt}\\left( \\frac{dy}{dx} \\right) \\frac{1}{\\frac{dx}{dt}}",
                    "description": "Formulas for variable power differentiation and parametric second order derivative.",
                    "variables": [
                        { "symbol": "u, v", "meaning": "Differentiable Functions of x", "unit": "-" },
                        { "symbol": "t", "meaning": "Independent Parameter", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-06: Application of Derivatives
    cat["MATH-12-06"] = [
        {
            "title": "Rate of Change, Monotonicity & Maxima-Minima Optimization",
            "desc": "Rate of change dy/dt = (dy/dx)(dx/dt), increasing and decreasing functions (f'(x) > 0 vs f'(x) < 0), critical points, first derivative test, second derivative test for local maxima (f'' < 0) and minima (f'' > 0), and applied real-world optimization problems.",
            "notesOverview": "Derivatives enable optimization. The sign of the first derivative determines monotonicity, while the second derivative measures concavity and classifies extrema.",
            "notesSections": [
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
                    "examTips": ["Always verify boundary values when finding absolute extrema on a closed interval [a, b]!"]
                }
            ],
            "misconceptions": ["Assuming f'(c) = 0 guarantees a local maximum or minimum. For f(x) = x^3, f'(0) = 0, but x = 0 is an inflection point, not an extremum."],
            "formulas": [
                {
                    "label": "First & Second Derivative Optimization Tests",
                    "formula": "f'(c) = 0 \\; \\& \\; f''(c) < 0 \\implies \\text{Local Maxima}, \\quad f'(c) = 0 \\; \\& \\; f''(c) > 0 \\implies \\text{Local Minima}",
                    "description": "Concavity criteria for classifying local extrema.",
                    "variables": [
                        { "symbol": "c", "meaning": "Critical Point", "unit": "-" },
                        { "symbol": "f''(c)", "meaning": "Second Derivative Concavity", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-07: Integrals
    cat["MATH-12-07"] = [
        {
            "title": "Integration Methods & Fundamental Theorem of Calculus",
            "desc": "Integration as inverse of differentiation, standard algebraic and trigonometric integrals, integration by substitution, integration by partial fractions, integration by parts (ILATE rule), Fundamental Theorem of Calculus, and definite integral properties.",
            "notesOverview": "Integral calculus computes antiderivatives (indefinite integrals) and accumulated areas (definite integrals). The Fundamental Theorem of Calculus unifies differentiation and integration.",
            "notesSections": [
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
                    "examTips": ["Check odd symmetry immediately for symmetric limits [-a, a]: if f(-x) = -f(x), the definite integral is ZERO without needing integration!"]
                }
            ],
            "misconceptions": ["Forgetting absolute value in logarithmic integration. int (1/x) dx = ln|x| + C, not ln(x) + C."],
            "formulas": [
                {
                    "label": "Integration by Parts & Exponential Identity",
                    "formula": "\\int u v \\, dx = u \\int v \\, dx - \\int \\left( u' \\int v \\, dx \\right) dx, \\quad \\int e^x [f(x) + f'(x)] dx = e^x f(x) + C",
                    "description": "ILATE product integration rule and exponential-derivative matching pattern.",
                    "variables": [
                        { "symbol": "u, v", "meaning": "Factor Functions", "unit": "-" },
                        { "symbol": "C", "meaning": "Constant of Integration", "unit": "-" }
                    ]
                },
                {
                    "label": "King’s Definite Integral Property",
                    "formula": "\\int_a^b f(x) \\, dx = \\int_a^b f(a + b - x) \\, dx, \\quad \\int_0^a f(x) \\, dx = \\int_0^a f(a - x) \\, dx",
                    "description": "Boundary reflection invariance property for definite integrals.",
                    "variables": [
                        { "symbol": "a, b", "meaning": "Integration Limits", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-08: Application of Integrals
    cat["MATH-12-08"] = [
        {
            "title": "Area Under Simple Curves & Bounded Regions",
            "desc": "Area bounded by curve y = f(x), x-axis and vertical lines x = a, x = b: Area = int_a^b |y| dx, area between curve and y-axis: Area = int_c^d |x| dy, area bounded between two intersecting curves Area = int (y_upper - y_lower) dx.",
            "notesOverview": "Definite integrals compute geometric planar areas. The absolute value of vertical or horizontal differential strips integrates the bounded area regardless of orientation.",
            "notesSections": [
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
                    "examTips": ["Ellipse area x^2/a^2 + y^2/b^2 = 1 is exactly pi * a * b. Use this formula to immediately verify calculus derivations!"]
                }
            ],
            "misconceptions": ["Integrating y dx directly when the curve crosses above and below the x-axis. Regions below the axis subtract from above-axis regions unless integrated piecewise with absolute values."],
            "formulas": [
                {
                    "label": "Bounded Planar Area Formula",
                    "formula": "A = \\int_a^b [y_{\\text{upper}} - y_{\\text{lower}}] \\, dx = \\int_c^d [x_{\\text{right}} - x_{\\text{left}}] \\, dy",
                    "description": "Differential strip integration for vertical and horizontal bounding regimes.",
                    "variables": [
                        { "symbol": "A", "meaning": "Geometric Planar Area", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-09: Differential Equations
    cat["MATH-12-09"] = [
        {
            "title": "Order, Degree & First Order Differential Equations",
            "desc": "Order (highest derivative order) and degree (power of highest derivative when polynomial in derivatives), general and particular solutions, variable separable method, homogeneous differential equations dy/dx = F(y/x), and linear differential equations dy/dx + Py = Q via integrating factor IF = e^(int P dx).",
            "notesOverview": "Differential equations relate unknown functions to their derivatives. First-order equations are solved via separation of variables, homogeneous substitutions, or integrating factors.",
            "notesSections": [
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
                    "examTips": ["Watch for equations in linear form dx/dy + P(y) x = Q(y): here IF = e^(int P(y) dy) and solution is x * (IF) = int [Q(y) * (IF)] dy + C."]
                }
            ],
            "misconceptions": ["Believing all differential equations have a degree. Equations like e^(dy/dx) + y = x have order 1, but their degree is NOT defined."],
            "formulas": [
                {
                    "label": "First-Order Linear ODE Solution",
                    "formula": "\\text{IF} = e^{\\int P(x) \\, dx}, \\quad y \\cdot (\\text{IF}) = \\int Q(x) \\cdot (\\text{IF}) \\, dx + C",
                    "description": "Integrating factor method for first-order linear differential equations.",
                    "variables": [
                        { "symbol": "\\text{IF}", "meaning": "Integrating Factor", "unit": "-" },
                        { "symbol": "P(x), Q(x)", "meaning": "Coefficient Functions", "unit": "-" },
                        { "symbol": "C", "meaning": "Arbitrary Constant", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-10: Vector Algebra
    cat["MATH-12-10"] = [
        {
            "title": "Dot Product, Cross Product & Geometric Vector Projections",
            "desc": "Vectors, magnitude, direction cosines and direction ratios, addition of vectors, scalar (dot) product a . b = |a||b| cos theta, projection of vector, vector (cross) product a x b = |a||b| sin theta n_hat, right-hand rule, and area of parallelogram and triangle.",
            "notesOverview": "Vector algebra handles physical quantities possessing magnitude and spatial direction. Dot products yield scalars measuring collinearity and projections, while cross products yield orthogonal vectors measuring perpendicularity and area.",
            "notesSections": [
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
                    "examTips": ["Projection of a on b has vector b in the denominator! Projection = (a . b) / |b|."]
                }
            ],
            "misconceptions": ["Assuming cross product is commutative. a x b = -(b x a): reversing vector order flips the right-hand normal direction by 180 degrees."],
            "formulas": [
                {
                    "label": "Scalar and Vector Products",
                    "formula": "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta, \\quad \\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix}",
                    "description": "Scalar projection dot product and determinant form of orthogonal vector cross product.",
                    "variables": [
                        { "symbol": "\\vec{a}, \\vec{b}", "meaning": "3D Vectors", "unit": "-" },
                        { "symbol": "\\theta", "meaning": "Inter-Vector Angle", "unit": "rad" }
                    ]
                },
                {
                    "label": "Vector Projection and Parallelogram Area",
                    "formula": "\\text{Proj}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}, \\quad \\text{Area} = |\\vec{a} \\times \\vec{b}|",
                    "description": "Scalar projection length and geometric area of vector-spanned parallelogram.",
                    "variables": [
                        { "symbol": "\\text{Proj}", "meaning": "Scalar Projection Length", "unit": "-" }
                    ]
                }
            ],
            "simulationId": "vector_cross_product"
        }
    ]

    # MATH-12-11: Three-Dimensional Geometry
    cat["MATH-12-11"] = [
        {
            "title": "Lines in 3D Space & Shortest Distance between Skew Lines",
            "desc": "Direction cosines and ratios of a line, vector and Cartesian equations of a line through a point parallel to vector r = a + lambda b, line passing through two points, angle between two lines, skew lines, and shortest distance d = |(b1 x b2) . (a2 - a1)| / |b1 x b2|.",
            "notesOverview": "Lines in three dimensions can intersect, be parallel, or be skew (non-parallel lines in non-intersecting planes). Shortest distance between skew lines determines whether they are coplanar.",
            "notesSections": [
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
                    "examTips": ["If the determinant [[x2-x1, y2-y1, z2-z1], [a1, b1, c1], [a2, b2, c2]] vanishes, the lines intersect and are coplanar!"]
                }
            ],
            "misconceptions": ["Assuming two lines in 3D that never meet must be parallel. In 3D space, skew lines never meet yet are not parallel."],
            "formulas": [
                {
                    "label": "Shortest Distance between Skew Lines",
                    "formula": "d = \\frac{|(\\vec{b}_1 \\times \\vec{b}_2) \\cdot (\\vec{a}_2 - \\vec{a}_1)|}{|\\vec{b}_1 \\times \\vec{b}_2|}",
                    "description": "Orthogonal distance between non-parallel, non-intersecting spatial skew lines.",
                    "variables": [
                        { "symbol": "\\vec{a}_1, \\vec{a}_2", "meaning": "Position Vectors of Points on Lines", "unit": "-" },
                        { "symbol": "\\vec{b}_1, \\vec{b}_2", "meaning": "Direction Vectors", "unit": "-" },
                        { "symbol": "d", "meaning": "Shortest Distance", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-12: Linear Programming
    cat["MATH-12-12"] = [
        {
            "title": "Mathematical Formulation & Graphical Corner-Point Method",
            "desc": "Linear programming problem (LPP) terminology: objective function Z = ax + by, linear constraints, non-negative restrictions x >= 0, y >= 0, feasible region, convex polygon, Corner Point Theorem, bounded and unbounded feasible regions.",
            "notesOverview": "Linear programming optimizes a linear objective function subject to linear inequality constraints. The Fundamental Corner Point Theorem proves optimal solutions occur at extreme vertices of the convex feasible region.",
            "notesSections": [
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
                    "examTips": ["For unbounded feasible regions, you MUST graph the line ax + by = M and verify whether the open half-plane intersects the feasible region before declaring M as optimal!"]
                }
            ],
            "misconceptions": ["Assuming an unbounded feasible region always has an optimal solution. An unbounded region may have no maximum if ax + by can grow indefinitely."],
            "formulas": [
                {
                    "label": "Linear Objective Function & Constraints",
                    "formula": "\\text{Maximize / Minimize: } Z = ax + by \\quad \\text{subject to } \\sum a_{ij} x_j \\le b_i, \\; x_j \\ge 0",
                    "description": "General mathematical formulation of linear programming problem.",
                    "variables": [
                        { "symbol": "Z", "meaning": "Objective Function Value", "unit": "-" },
                        { "symbol": "a, b", "meaning": "Objective Coefficients", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    # MATH-12-13: Probability
    cat["MATH-12-13"] = [
        {
            "title": "Conditional Probability, Bayes’ Theorem & Random Variables",
            "desc": "Conditional probability P(A|B) = P(A intersection B) / P(B), multiplication theorem on probability, independent events P(A intersection B) = P(A) P(B), Theorem of Total Probability, Bayes’ theorem for posterior probabilities, probability distributions of random variable, mean (expected value) E(X) = sum(xi pi).",
            "notesOverview": "Conditional probability updates probability estimates upon receiving partial information. Bayes' theorem computes posterior probability of causes given observed effects.",
            "notesSections": [
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
                    "examTips": ["In Bayes' theorem word problems, clearly define the hypothesis events E1, E2 (the source/box/cause chosen) and the observed event A (the defective item/colour observed)!"]
                }
            ],
            "misconceptions": ["Assuming independent and mutually exclusive are synonymous. Mutually exclusive means events cannot happen together (disjoint); independent means probability of one does not change knowing the other."],
            "formulas": [
                {
                    "label": "Bayes’ Theorem Formulation",
                    "formula": "P(E_i | A) = \\frac{P(E_i) P(A | E_i)}{\\sum_{j=1}^n P(E_j) P(A | E_j)}",
                    "description": "Calculates posterior probability of cause Ei given observed evidence A.",
                    "variables": [
                        { "symbol": "P(E_i | A)", "meaning": "Posterior Probability", "unit": "-" },
                        { "symbol": "P(E_i)", "meaning": "Prior Probability", "unit": "-" },
                        { "symbol": "P(A | E_i)", "meaning": "Likelihood", "unit": "-" }
                    ]
                },
                {
                    "label": "Expectation & Variance of Random Variable",
                    "formula": "E(X) = \\sum x_i p_i, \\quad \\text{Var}(X) = \\sum x_i^2 p_i - [E(X)]^2",
                    "description": "Expected value and variance of discrete probability distribution.",
                    "variables": [
                        { "symbol": "E(X)", "meaning": "Mathematical Expectation (Mean)", "unit": "-" },
                        { "symbol": "\\text{Var}(X)", "meaning": "Variance of Random Variable", "unit": "-" }
                    ]
                }
            ]
        }
    ]

    return cat

if __name__ == "__main__":
    cat = get_mathematics_catalog()
    print("Total Mathematics chapters loaded:", len(cat))
    for code, topics in cat.items():
        print(f"  {code}: {len(topics)} topics")
