export const physicsData = [

/* ================= VERY HIGH PRIORITY ================= */

{
  name: "Modern Physics",
  weight: 10,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Photoelectric Effect",
      formulas: [
        "E = hf",
        "KEmax = hf - φ",
        "Stopping potential: eV₀ = KEmax"
      ],
      concepts: [
        "Threshold frequency",
        "Graph-based questions ⭐⭐⭐",
        "Intensity vs KE relation"
      ]
    },
    {
      name: "Bohr Model",
      formulas: [
        "Eₙ = -13.6/n²",
        "rₙ ∝ n²",
        "vₙ ∝ 1/n"
      ],
      concepts: [
        "Transition energy",
        "Spectral series"
      ]
    },
    {
      name: "Radioactivity",
      formulas: [
        "N = N₀ e^(-λt)",
        "T½ = 0.693/λ"
      ],
      concepts: [
        "Decay law ⭐⭐⭐",
        "Activity relation"
      ]
    }
  ]
},

{
  name: "Current Electricity",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Ohm's Law",
      formulas: ["V = IR"],
      concepts: ["Basic circuit problems"]
    },
    {
      name: "Kirchhoff Laws",
      formulas: ["ΣV = 0", "ΣI = 0"],
      concepts: [
        "Loop solving ⭐⭐⭐",
        "Multi-loop circuits"
      ]
    },
    {
      name: "Resistance",
      formulas: [
        "R = ρL/A",
        "Series: R = R₁+R₂",
        "Parallel: 1/R = 1/R₁ + 1/R₂"
      ],
      concepts: ["Equivalent resistance"]
    },
    {
      name: "Power",
      formulas: ["P = VI = I²R"],
      concepts: ["Power loss"]
    }
  ]
},

{
  name: "Electrostatics",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Coulomb Law",
      formulas: [
        "F = kq1q2/r²"
      ],
      concepts: [
        "Superposition principle ⭐⭐⭐"
      ]
    },
    {
      name: "Electric Field",
      formulas: [
        "E = kq/r²",
        "E = F/q"
      ],
      concepts: [
        "Field due to system of charges"
      ]
    },
    {
      name: "Potential",
      formulas: [
        "V = kq/r"
      ],
      concepts: [
        "Relation with field"
      ]
    },
    {
      name: "Capacitors",
      formulas: [
        "C = Q/V",
        "Energy = ½CV²",
        "Series & parallel"
      ],
      concepts: [
        "Combination ⭐⭐⭐",
        "Dielectric effect"
      ]
    }
  ]
},

{
  name: "Magnetism & EMI",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Lorentz Force",
      formulas: [
        "F = qvB sinθ"
      ],
      concepts: [
        "Direction rule ⭐⭐⭐"
      ]
    },
    {
      name: "Biot-Savart",
      formulas: [
        "B = μ₀I/2πr"
      ],
      concepts: [
        "Field due to wire"
      ]
    },
    {
      name: "Faraday Law",
      formulas: [
        "E = -dΦ/dt"
      ],
      concepts: [
        "Flux variation ⭐⭐⭐"
      ]
    },
    {
      name: "Lenz Law",
      concepts: [
        "Direction logic"
      ]
    }
  ]
},

{
  name: "Optics",
  weight: 8,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Ray Optics",
      formulas: [
        "1/f = 1/v + 1/u",
        "Magnification = v/u"
      ],
      concepts: [
        "Mirror + lens combo ⭐⭐⭐"
      ]
    },
    {
      name: "Refraction",
      formulas: [
        "μ = sin i / sin r"
      ],
      concepts: [
        "Critical angle"
      ]
    },
    {
      name: "Wave Optics",
      formulas: [
        "β = λD/d"
      ],
      concepts: [
        "YDSE ⭐⭐⭐",
        "Fringe shift"
      ]
    }
  ]
},

/* ================= HIGH PRIORITY ================= */

{
  name: "Thermodynamics",
  weight: 7,
  priority: "HIGH",

  topics: [
    {
      name: "First Law",
      formulas: [
        "Q = ΔU + W"
      ],
      concepts: [
        "Process-based questions"
      ]
    },
    {
      name: "Ideal Gas",
      formulas: [
        "PV = nRT"
      ],
      concepts: [
        "Graph questions"
      ]
    },
    {
      name: "Heat Engine",
      formulas: [
        "Efficiency = 1 - Tc/Th"
      ],
      concepts: [
        "Carnot engine"
      ]
    }
  ]
},

{
  name: "SHM",
  weight: 6,
  priority: "HIGH",

  topics: [
    {
      name: "Basic Equation",
      formulas: [
        "x = A sin(ωt)"
      ],
      concepts: [
        "Time period"
      ]
    },
    {
      name: "Energy",
      formulas: [
        "E = ½kA²"
      ],
      concepts: [
        "Energy variation"
      ]
    }
  ]
},

{
  name: "Waves",
  weight: 5,
  priority: "HIGH",

  topics: [
    {
      name: "Wave Motion",
      formulas: [
        "v = fλ"
      ],
      concepts: [
        "Standing waves"
      ]
    }
  ]
},

{
  name: "Rotational Motion",
  weight: 6,
  priority: "HIGH",

  topics: [
    {
      name: "Torque",
      formulas: [
        "τ = rF"
      ],
      concepts: [
        "Equilibrium"
      ]
    },
    {
      name: "Angular Momentum",
      formulas: [
        "L = Iω"
      ],
      concepts: [
        "Conservation"
      ]
    }
  ]
},

/* ================= MEDIUM ================= */

{
  name: "Kinematics",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Equations of Motion",
      formulas: [
        "v = u + at",
        "s = ut + ½at²"
      ],
      concepts: [
        "Direct questions"
      ]
    },
    {
      name: "Projectile",
      formulas: [
        "R = u²sin2θ/g"
      ],
      concepts: [
        "Range problems"
      ]
    }
  ]
},

{
  name: "Units & Dimensions",
  weight: 2,
  priority: "LOW",

  topics: [
    {
      name: "Dimensional Formula",
      formulas: [
        "[Force] = MLT⁻²"
      ],
      concepts: [
        "Easy scoring"
      ]
    }
  ]
}

];