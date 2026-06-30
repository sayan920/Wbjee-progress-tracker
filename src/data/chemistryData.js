export const chemistryData = [

/* ================= VERY HIGH PRIORITY ================= */

{
  name: "Chemical Bonding",
  weight: 10,
  priority: "VERY HIGH",

  topics: [
    {
      name: "VSEPR Theory",
      formulas: [],
      concepts: [
        "Shape prediction ⭐⭐⭐",
        "Lone pair vs bond pair",
        "Geometry-based questions"
      ]
    },
    {
      name: "Hybridization",
      formulas: [
        "Steric number = σ bonds + lone pairs"
      ],
      concepts: [
        "sp, sp2, sp3 identification ⭐⭐⭐",
        "Molecular geometry"
      ]
    },
    {
      name: "Bond Order (MOT)",
      formulas: [
        "Bond order = (Nb - Na)/2"
      ],
      concepts: [
        "Stability comparison",
        "Magnetic property"
      ]
    }
  ]
},

{
  name: "Equilibrium",
  weight: 9,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Chemical Equilibrium",
      formulas: [
        "Kc = [products]/[reactants]"
      ],
      concepts: [
        "Le Chatelier principle ⭐⭐⭐",
        "Effect of pressure/temp"
      ]
    },
    {
      name: "Ionic Equilibrium",
      formulas: [
        "pH = -log[H+]",
        "Kw = 10^-14",
        "pH + pOH = 14"
      ],
      concepts: [
        "Buffer solution ⭐⭐⭐",
        "Strong vs weak acids"
      ]
    }
  ]
},

{
  name: "GOC (General Organic Chemistry)",
  weight: 10,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Inductive Effect",
      concepts: [
        "+I and -I groups ⭐⭐⭐",
        "Acidity/basicity trend"
      ]
    },
    {
      name: "Resonance",
      concepts: [
        "Stability of molecules ⭐⭐⭐",
        "Delocalization"
      ]
    },
    {
      name: "Carbocation Stability",
      concepts: [
        "3° > 2° > 1° ⭐⭐⭐",
        "Hyperconjugation"
      ]
    }
  ]
},

{
  name: "Aldehyde, Ketone",
  weight: 8,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Nucleophilic Addition",
      concepts: [
        "Mechanism ⭐⭐⭐",
        "Reactivity comparison"
      ]
    },
    {
      name: "Aldol Reaction",
      concepts: [
        "Important WBJEE PYQ ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "Electrochemistry",
  weight: 8,
  priority: "VERY HIGH",

  topics: [
    {
      name: "Nernst Equation",
      formulas: [
        "E = E° - 0.059/n logQ"
      ],
      concepts: [
        "Cell potential calculation ⭐⭐⭐"
      ]
    },
    {
      name: "Electrochemical Cell",
      formulas: [
        "ΔG = -nFE"
      ],
      concepts: [
        "Spontaneity"
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
        "ΔU = q + w"
      ],
      concepts: [
        "Heat and work relation"
      ]
    },
    {
      name: "Gibbs Energy",
      formulas: [
        "ΔG = ΔH - TΔS"
      ],
      concepts: [
        "Spontaneity ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "Chemical Kinetics",
  weight: 6,
  priority: "HIGH",

  topics: [
    {
      name: "Rate Law",
      formulas: [
        "Rate = k[A]^n"
      ],
      concepts: [
        "Order of reaction ⭐⭐⭐"
      ]
    },
    {
      name: "Half Life",
      formulas: [
        "t½ = 0.693/k"
      ],
      concepts: [
        "First order reaction"
      ]
    }
  ]
},

{
  name: "Coordination Compounds",
  weight: 7,
  priority: "HIGH",

  topics: [
    {
      name: "Nomenclature",
      concepts: [
        "Naming rules ⭐⭐⭐"
      ]
    },
    {
      name: "Isomerism",
      concepts: [
        "Geometrical, optical ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "p-Block",
  weight: 7,
  priority: "HIGH",

  topics: [
    {
      name: "Trends",
      concepts: [
        "Group trends ⭐⭐⭐"
      ]
    },
    {
      name: "Important Compounds",
      concepts: [
        "NCERT based ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "Alcohol, Phenol, Ether",
  weight: 6,
  priority: "HIGH",

  topics: [
    {
      name: "Reactions",
      concepts: [
        "Conversion reactions ⭐⭐⭐"
      ]
    }
  ]
},

/* ================= MEDIUM ================= */

{
  name: "Mole Concept",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Mole Calculation",
      formulas: [
        "n = mass/molar mass"
      ],
      concepts: [
        "Basic numerical"
      ]
    },
    {
      name: "Limiting Reagent",
      concepts: [
        "Reaction-based problems"
      ]
    }
  ]
},

{
  name: "Atomic Structure",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Bohr Model",
      formulas: [
        "E = -13.6/n²"
      ],
      concepts: [
        "Energy levels"
      ]
    },
    {
      name: "Quantum Numbers",
      concepts: [
        "Orbital structure"
      ]
    }
  ]
},

{
  name: "Periodic Table",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Trends",
      concepts: [
        "Atomic size, IE ⭐⭐⭐"
      ]
    }
  ]
},

{
  name: "Amines",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Basicity",
      concepts: [
        "Comparison questions"
      ]
    }
  ]
},

{
  name: "Carboxylic Acid",
  weight: 5,
  priority: "MEDIUM",

  topics: [
    {
      name: "Reactions",
      concepts: [
        "Important conversions"
      ]
    }
  ]
},

/* ================= LOW PRIORITY ================= */

{
  name: "Surface Chemistry",
  weight: 3,
  priority: "LOW",

  topics: [
    {
      name: "Adsorption",
      concepts: [
        "Direct questions"
      ]
    }
  ]
},

{
  name: "Environmental Chemistry",
  weight: 2,
  priority: "LOW",

  topics: [
    {
      name: "Pollution",
      concepts: [
        "Theory based"
      ]
    }
  ]
}

];