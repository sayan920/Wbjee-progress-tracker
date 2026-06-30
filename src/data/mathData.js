export const mathData = [

/* ================= VERY HIGH PRIORITY ================= */

{
  name: "Vectors",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Dot Product ⭐⭐⭐",
      formulas: [
        "A·B = |A||B|cosθ",
        "Projection = (A·B)/|B|",
        "A·A = |A|²",
        "cosθ = (A·B)/|A||B|"
      ],
      concepts: [
        "Angle between vectors ⭐⭐⭐",
        "Projection questions ⭐⭐"
      ]
    },
    {
      name: "Cross Product ⭐⭐⭐",
      formulas: [
        "|A×B| = |A||B|sinθ",
        "Area of triangle = ½|A×B|",
        "Area of parallelogram = |A×B|"
      ],
      concepts: [
        "Area problems ⭐⭐⭐",
        "Parallel/perpendicular vectors ⭐⭐"
      ]
    }
  ]
},

{
  name: "3D Geometry",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Direction Cosines ⭐⭐⭐",
      formulas: [
        "l² + m² + n² = 1"
      ],
      concepts: [
        "Direction ratios relation ⭐⭐"
      ]
    },
    {
      name: "Line in Space ⭐⭐⭐",
      formulas: [
        "r = a + λb"
      ],
      concepts: [
        "Shortest distance between lines ⭐⭐⭐",
        "Angle between lines ⭐⭐"
      ]
    }
  ]
},

{
  name: "Probability",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Conditional Probability ⭐⭐⭐",
      formulas: [
        "P(A|B) = P(A∩B)/P(B)"
      ],
      concepts: [
        "Basic direct formula ⭐⭐⭐"
      ]
    },
    {
      name: "Bayes Theorem ⭐⭐⭐",
      formulas: [
        "P(Ai|B) = [P(B|Ai)P(Ai)] / Σ"
      ],
      concepts: [
        "Repeated WBJEE PYQ ⭐⭐⭐"
      ]
    },
    {
      name: "Total Probability ⭐⭐",
      formulas: [
        "P(B) = Σ P(Ai)P(B|Ai)"
      ]
    }
  ]
},

{
  name: "Matrices & Determinants",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Inverse Matrix ⭐⭐⭐",
      formulas: [
        "A⁻¹ = adj(A)/|A|"
      ],
      concepts: [
        "System solving ⭐⭐⭐"
      ]
    },
    {
      name: "Determinants ⭐⭐⭐",
      formulas: [
        "|A| expansion",
        "|AB| = |A||B|",
        "|A⁻¹| = 1/|A|"
      ],
      concepts: [
        "Shortcut solving ⭐⭐⭐"
      ]
    }
  ]
},

/* ================= HIGH ================= */

{
  name: "Calculus",
  weight: 10,
  priority: "HIGH",

  topics: [
    {
      name: "Limits ⭐⭐⭐",
      formulas: [
        "lim x→0 sinx/x = 1",
        "lim (1-cosx)/x² = ½",
        "lim (1+1/n)^n = e"
      ],
      concepts: [
        "Standard limits ⭐⭐⭐"
      ]
    },
    {
      name: "Derivatives ⭐⭐⭐",
      formulas: [
        "d/dx(xⁿ) = nxⁿ⁻¹",
        "d/dx(sin x) = cos x",
        "d/dx(e^x) = e^x"
      ],
      concepts: [
        "Maxima minima ⭐⭐⭐",
        "Slope problems ⭐⭐"
      ]
    },
    {
      name: "Integration ⭐⭐⭐",
      formulas: [
        "∫ dx/x = ln|x|",
        "∫ e^x dx = e^x",
        "∫ sinx dx = -cosx",
        "∫ cosx dx = sinx"
      ],
      concepts: [
        "Substitution ⭐⭐⭐",
        "Standard forms ⭐⭐"
      ]
    }
  ]
},

{
  name: "Complex Numbers",
  weight: 7,
  priority: "HIGH",

  topics: [
    {
      name: "Modulus & Argument ⭐⭐⭐",
      formulas: [
        "|z| = √(x²+y²)",
        "arg(z) = tan⁻¹(y/x)"
      ],
      concepts: [
        "Argand plane ⭐⭐⭐"
      ]
    },
    {
      name: "De Moivre ⭐⭐⭐",
      formulas: [
        "(cosθ + i sinθ)^n"
      ],
      concepts: [
        "nth root ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "Straight Line & Circle",
  weight: 6,
  priority: "HIGH",

  topics: [
    {
      name: "Straight Line ⭐⭐",
      formulas: [
        "y = mx + c",
        "Distance = |Ax+By+C|/√(A²+B²)"
      ]
    },
    {
      name: "Circle ⭐⭐⭐",
      formulas: [
        "(x-h)²+(y-k)²=r²"
      ],
      concepts: [
        "Tangent ⭐⭐⭐"
      ]
    }
  ]
},

/* ================= MEDIUM ================= */

{
  name: "Quadratic Equation",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Nature of Roots ⭐⭐⭐",
      formulas: [
        "D = b² - 4ac"
      ]
    },
    {
      name: "Location of Roots ⭐⭐⭐",
      concepts: [
        "Sign method ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "Sequence & Series",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "AP GP HP ⭐⭐",
      formulas: [
        "Sn(AP) = n/2[2a+(n-1)d]",
        "Sn(GP) = a(1-r^n)/(1-r)"
      ]
    }
  ]
},

{
  name: "Binomial Theorem",
  weight: 4,
  priority: "MEDIUM",

  topics: [
    {
      name: "General Term ⭐⭐⭐",
      formulas: [
        "T(r+1) = nCr x^(n-r)"
      ]
    }
  ]
},

{
  name: "Permutation & Combination",
  weight: 6,
  priority: "HIGH",

  topics: [
    {
      name: "Permutation ⭐⭐⭐",
      formulas: [
        "nPr = n!/(n-r)!"
      ]
    },
    {
      name: "Combination ⭐⭐⭐",
      formulas: [
        "nCr = n!/(r!(n-r)!)"
      ]
    }
  ]
},

{
  name: "Statistics",
  weight: 3,
  priority: "LOW",

  topics: [
    {
      name: "Mean Median Mode ⭐",
      formulas: []
    }
  ]
}

];