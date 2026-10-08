import { SchemeOfWork } from '../types';

export const defaultSchemesOfWork: SchemeOfWork[] = [
  {
    id: 'scheme-math-sss2',
    subjectName: 'Mathematics',
    classLevel: 'SSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: 'Comprehensive 12-week SSS 2 Mathematics scheme covering Quadratic Equations, Simultaneous Linear and Quadratic Equations, Trigonometric Ratios and Graphs, Logarithms and Indices, Mensuration of Solid Shapes, and Probability.',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Mathematics',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Revision of 1st Term Work & Logarithms of Numbers greater than 1 and less than 1',
        subtopics: ['Standard form review', 'Logarithms using tables', 'Calculations involving powers and roots'],
        learningObjectives: [
          'Convert numbers to standard form A × 10ⁿ where 1 ≤ A < 10',
          'Use logarithm and antilogarithm tables for multiplication and division',
          'Solve practical problems involving compound calculations'
        ],
        keyFormulasOrTerms: ['log(a × b) = log a + log b', 'log(a / b) = log a - log b', 'log(aⁿ) = n log a'],
        suggestedActivities: 'Solving past WAEC objective and theory logarithm problems.'
      },
      {
        week: 2,
        topic: 'Approximation, Significant Figures, and Percentage Errors',
        subtopics: ['Rounding off numbers', 'Absolute error', 'Relative error', 'Percentage error in measurement'],
        learningObjectives: [
          'State numbers to specified significant figures and decimal places',
          'Calculate absolute and relative errors in length, mass, and time measurements',
          'Determine percentage error = (Error / Actual Value) × 100%'
        ],
        keyFormulasOrTerms: ['Percentage Error = (|Estimated - True| / True) × 100%'],
        suggestedActivities: 'Laboratory measurement error calculations in Physics and Chemistry experiments.'
      },
      {
        week: 3,
        topic: 'Quadratic Equations (Factorization and Completing the Square Methods)',
        subtopics: ['Standard form ax² + bx + c = 0', 'Factorization of quadratic trinomials', 'Completing the square process step by step'],
        learningObjectives: [
          'Rearrange any quadratic equation to ax² + bx + c = 0',
          'Factorize quadratic expressions with fractional and negative coefficients',
          'Derive the quadratic formula using the completing the square method'
        ],
        keyFormulasOrTerms: ['ax² + bx + c = 0', 'Add (b / 2a)² to both sides'],
        suggestedActivities: 'Step-by-step derivation drills on whiteboards.'
      },
      {
        week: 4,
        topic: 'Quadratic Equations (General Formula Method) and Word Problems',
        subtopics: ['Applying x = (-b ± √(b² - 4ac)) / (2a)', 'Discriminant D = b² - 4ac and nature of roots', 'Word problems leading to quadratic equations'],
        learningObjectives: [
          'Compute roots using the quadratic formula with precision',
          'Classify roots as real, distinct, equal (D = 0), or non-real (D < 0)',
          'Formulate and solve age, geometric area, and speed-time word problems'
        ],
        keyFormulasOrTerms: ['x = (-b ± √(b² - 4ac)) / (2a)', 'D = b² - 4ac'],
        suggestedActivities: 'Solving real-world projectile and land perimeter problems.'
      },
      {
        week: 5,
        topic: 'Simultaneous Linear and Quadratic Equations',
        subtopics: ['Substitution method', 'One linear equation and one non-linear equation', 'Graphical interpretation of intersection points'],
        learningObjectives: [
          'Make one variable the subject from the linear equation (e.g., y = mx + c)',
          'Substitute into the quadratic equation to obtain a single quadratic variable',
          'Find corresponding (x, y) pairs and verify in original equations'
        ],
        keyFormulasOrTerms: ['y = 2x - 1 and x² + y² = 25'],
        suggestedActivities: 'Graphing parabolas intersecting straight lines.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Review Week',
        subtopics: ['Mid-Term assessment tests (CA2)', 'Remedial teaching on weak areas', 'Error analysis in exam scripts'],
        learningObjectives: [
          'Assess mastery of Weeks 1 to 5 topics under standard exam timing',
          'Clarify common misconceptions in completing the square and error calculations'
        ],
        keyFormulasOrTerms: ['CA2 Assessment Protocol']
      },
      {
        week: 7,
        topic: 'Trigonometry: Sine, Cosine, and Tangent Ratios for General Angles',
        subtopics: ['Unit circle and four quadrants (ASTC rule)', 'Special angles (30°, 45°, 60°)', 'Trigonometric graphs of y = sin x and y = cos x (0° ≤ x ≤ 360°)'],
        learningObjectives: [
          'State trig ratios in all four quadrants using the ASTC rule',
          'Evaluate exact trig values: sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1, sin 45° = 1/√2',
          'Plot and interpret trigonometric wave graphs and identify amplitude and period'
        ],
        keyFormulasOrTerms: ['ASTC (All Students Take Chemistry)', 'sin² θ + cos² θ = 1', 'tan θ = sin θ / cos θ'],
        suggestedActivities: 'Constructing unit circles with compass and protractor.'
      },
      {
        week: 8,
        topic: 'Sine Rule and Cosine Rule for Acute and Obtuse Triangles',
        subtopics: ['Statement of Sine Rule: a / sin A = b / sin B = c / sin C', 'Statement of Cosine Rule: a² = b² + c² - 2bc cos A', 'Ambiguous case of the sine rule'],
        learningObjectives: [
          'Determine when to use Sine Rule (two angles + one side or two sides + opposite angle)',
          'Determine when to use Cosine Rule (two sides + included angle or all three sides)',
          'Calculate unknown sides and angles of non-right angled triangles'
        ],
        keyFormulasOrTerms: ['a / sin A = b / sin B = c / sin C', 'cos A = (b² + c² - a²) / (2bc)'],
        suggestedActivities: 'Surveying triangular land plots on school sports grounds.'
      },
      {
        week: 9,
        topic: 'Bearings and Distances (3-Figure Bearings and Compass Bearings)',
        subtopics: ['Representation of cardinal points and 3-figure bearings (000° to 360°)', 'Diagrammatic modeling of ships and aircraft journeys', 'Application of sine and cosine rules to bearing problems'],
        learningObjectives: [
          'Convert compass bearings (e.g., N 45° E) to 3-figure bearings (045°)',
          'Draw accurate sketch diagrams indicating North poles at each station',
          'Calculate total distance and return bearing using trig rules'
        ],
        keyFormulasOrTerms: ['Reverse bearing = θ ± 180°'],
        suggestedActivities: 'Solving WAEC navigational distance past questions.'
      },
      {
        week: 10,
        topic: 'Mensuration: Length of Arcs, Perimeter, and Area of Sectors and Segments',
        subtopics: ['Length of an arc: L = (θ / 360°) × 2πr', 'Perimeter of a sector: P = 2r + L', 'Area of a sector: A = (θ / 360°) × πr²', 'Area of segment = Area of sector - Area of triangle'],
        learningObjectives: [
          'Calculate arc lengths and sector perimeters accurately',
          'Derive and compute segment areas using A = (θ/360)πr² - (1/2)r² sin θ',
          'Solve practical problems on circular road curves and architectural arches'
        ],
        keyFormulasOrTerms: ['Arc Length = (θ / 360°) × 2πr', 'Area of Sector = (θ / 360°) × πr²', 'Area of Segment = (θ / 360°)πr² - (1/2)r² sin θ'],
        suggestedActivities: 'Paper folding and cutting of circle sectors.'
      },
      {
        week: 11,
        topic: 'Probability: Mutually Exclusive and Independent Events',
        subtopics: ['Basic probability definition: P(E) = n(E) / n(S)', 'Addition law for mutually exclusive events: P(A or B) = P(A) + P(B)', 'Multiplication law for independent events: P(A and B) = P(A) × P(B)', 'Tree diagrams with and without replacement'],
        learningObjectives: [
          'Distinguish between mutually exclusive and independent events',
          'Draw and label probability tree diagrams for multi-stage experiments',
          'Calculate probabilities of picking colored balls from a bag with and without replacement'
        ],
        keyFormulasOrTerms: ['0 ≤ P(E) ≤ 1', 'P(A′) = 1 - P(A)', 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'],
        suggestedActivities: 'Dice rolling and card drawing probability simulation.'
      },
      {
        week: 12,
        topic: 'General Revision, WAEC Exam Prep & Terminal Examination',
        subtopics: ['Past paper walkthrough (WAEC Paper 1 & 2)', 'Formula memorization and presentation technique', 'Final term assessment'],
        learningObjectives: [
          'Synthesize all term topics into cohesive problem-solving speed',
          'Eliminate common algebraic and presentation errors in WAEC marking schemes'
        ],
        keyFormulasOrTerms: ['Comprehensive Terminal Syllabus']
      }
    ]
  },
  {
    id: 'scheme-phys-sss2',
    subjectName: 'Physics',
    classLevel: 'SSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: '12-week Physics curriculum covering Heat Energy, Thermal Expansion, Gas Laws, Waves and Optics, Sound Waves, and Electrostatics.',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Sciences',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Heat Energy, Temperature, and Thermal Expansion in Solids',
        subtopics: ['Difference between heat and temperature', 'Linear expansivity (α)', 'Area (superficial) expansivity (β = 2α)', 'Volume (cubic) expansivity (γ = 3α)', 'Applications and consequences of expansion'],
        learningObjectives: [
          'Differentiate between heat as thermal energy (Joules) and temperature as degree of hotness (Kelvin)',
          'Define linear expansivity and state its unit as K⁻¹ or °C⁻¹',
          'Solve problems using ΔL = L₁ α Δθ, A₂ = A₁(1 + βΔθ), V₂ = V₁(1 + γΔθ)'
        ],
        keyFormulasOrTerms: ['α = (L₂ - L₁) / (L₁ Δθ)', 'β = 2α', 'γ = 3α'],
        suggestedActivities: 'Demonstration of bimetallic strip bending when heated.'
      },
      {
        week: 2,
        topic: 'Thermal Expansion of Liquids and Anomalous Expansion of Water',
        subtopics: ['Real and apparent expansivity of liquids', 'Relation: γ_real = γ_apparent + γ_vessel', 'Anomalous expansion of water between 0°C and 4°C', 'Biological importance to aquatic life'],
        learningObjectives: [
          'Explain why liquids only exhibit volume expansivity',
          'Calculate real expansivity given apparent expansivity and container expansivity',
          'Sketch density vs temperature and volume vs temperature graphs for water'
        ],
        keyFormulasOrTerms: ['γ_real = γ_apparent + γ_glass', 'Maximum density of water at 4°C = 1000 kg/m³'],
        suggestedActivities: 'Plotting volume-temperature curve for ice melting.'
      },
      {
        week: 3,
        topic: 'Gas Laws: Boyle’s Law, Charles’s Law, and Pressure Law',
        subtopics: ['Boyle’s law: P₁V₁ = P₂V₂ (at constant T)', 'Charles’s law: V₁ / T₁ = V₂ / T₂ (at constant P)', 'Pressure (Gay-Lussac’s) law: P₁ / T₁ = P₂ / T₂', 'General gas equation: P₁V₁ / T₁ = P₂V₂ / T₂', 'Ideal gas equation: PV = nRT'],
        learningObjectives: [
          'State each gas law with conditions and mathematical expressions',
          'Convert Celsius temperatures to absolute thermodynamic scale: T(K) = θ(°C) + 273.15',
          'Solve multi-variable gas expansion and compression problems'
        ],
        keyFormulasOrTerms: ['P₁V₁ / T₁ = P₂V₂ / T₂', 'PV = nRT', 'T(K) = θ(°C) + 273'],
        suggestedActivities: 'Boyle’s law apparatus experiment with mercury column.'
      },
      {
        week: 4,
        topic: 'Specific Heat Capacity and Latent Heat (Method of Mixtures)',
        subtopics: ['Specific heat capacity (c): Q = mcΔθ', 'Heat capacity (C): Q = CΔθ', 'Latent heat of fusion and vaporization: Q = mL', 'Calorimetry and conservation of thermal energy: Heat Lost = Heat Gained'],
        learningObjectives: [
          'Define specific heat capacity (J / (kg·K)) and specific latent heat (J / kg)',
          'Solve calorimetry problems accounting for container heat capacity',
          'Calculate energy needed to convert -10°C ice to 100°C steam'
        ],
        keyFormulasOrTerms: ['Q = mcΔθ', 'Q = mL_f', 'Q = mL_v', 'Heat Lost = Heat Gained'],
        suggestedActivities: 'Copper calorimeter determination of c for brass.'
      },
      {
        week: 5,
        topic: 'Propagation of Waves: Mechanical vs Electromagnetic Waves',
        subtopics: ['Definition of a wave as a disturbance transmitting energy without net matter transfer', 'Transverse and longitudinal waves', 'Wave parameters: wavelength (λ), frequency (f), period (T), speed (v), amplitude (A)', 'Universal wave equation: v = fλ'],
        learningObjectives: [
          'Classify waves as mechanical (sound, water) or electromagnetic (light, radio, X-rays)',
          'Distinguish between compressions/rarefactions and crests/troughs',
          'Apply v = fλ and f = 1 / T in calculation problems'
        ],
        keyFormulasOrTerms: ['v = fλ', 'T = 1 / f', 'y = A sin(ωt - kx)'],
        suggestedActivities: 'Slinky spring wave demonstration.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Practical Review',
        subtopics: ['CA2 Written Test', 'Physics laboratory practical skills (calorimetry and pendulum timing)', 'Error minimization in measurements'],
        learningObjectives: [
          'Demonstrate accuracy in recording data to appropriate decimal places',
          'Assess understanding of thermal physics and wave equations'
        ],
        keyFormulasOrTerms: ['Laboratory Report Standards']
      },
      {
        week: 7,
        topic: 'Wave Phenomena: Reflection, Refraction, Diffraction, Interference, Polarization',
        subtopics: ['Laws of reflection', 'Refraction and Snell’s Law: n = sin i / sin r', 'Diffraction around obstacles and through narrow slits', 'Constructive and destructive interference', 'Polarization as proof of transverse nature of light'],
        learningObjectives: [
          'State and illustrate the five fundamental wave phenomena with wavefront diagrams',
          'Explain why sound diffracts more readily than light through doorways',
          'Explain why longitudinal waves cannot be polarized'
        ],
        keyFormulasOrTerms: ['n₁ sin θ₁ = n₂ sin θ₂', 'n = c / v = λ₁ / λ₂'],
        suggestedActivities: 'Ripple tank wave projection demonstration.'
      },
      {
        week: 8,
        topic: 'Sound Waves: Production, Speed, Echoes, and Resonance',
        subtopics: ['Sound propagation in solids, liquids, gases', 'Speed of sound: v = 2d / t in echo sounding', 'Reflection of sound and reverberation control in halls', 'Forced vibrations and acoustic resonance in air columns'],
        learningObjectives: [
          'Calculate depth of sea beds and distance of walls using echoes',
          'Explain conditions for resonance and its destructive/constructive effects',
          'Calculate speed of sound at varying temperatures'
        ],
        keyFormulasOrTerms: ['v = 2d / t (for echo)', 'Resonance condition: f_applied = f_natural'],
        suggestedActivities: 'Tuning fork resonance tube experiment.'
      },
      {
        week: 9,
        topic: 'Vibrations in Strings and Pipes (Musical Notes & Harmonics)',
        subtopics: ['Stationary waves on stretched strings: f₀ = (1 / 2L) × √(T / μ)', 'Closed pipes (odd harmonics only: f₀, 3f₀, 5f₀)', 'Open pipes (all harmonics: f₀, 2f₀, 3f₀, 4f₀)', 'Characteristics of musical notes: Pitch, Quality (Timbre), Loudness'],
        learningObjectives: [
          'Differentiate between noise and musical notes',
          'Relate pitch to frequency, loudness to amplitude, and quality to overtones',
          'Solve fundamental frequency and harmonic problems for open and closed organ pipes'
        ],
        keyFormulasOrTerms: ['f₀ = v / 4L (closed pipe)', 'f₀ = v / 2L (open pipe)', 'f = (1 / 2L)√(T / μ)'],
        suggestedActivities: 'Sonometer wire pitch comparison.'
      },
      {
        week: 10,
        topic: 'Electrostatics: Electric Charges and Coulomb’s Law',
        subtopics: ['Fundamental law of electrostatics (like charges repel, unlike attract)', 'Charging by friction, conduction, and induction', 'Gold leaf electroscope construction and usage', 'Coulomb’s Law of electrostatic force: F = (1 / 4πε₀) × (q₁q₂ / r²)'],
        learningObjectives: [
          'Explain charge distribution on conductors and action at sharp points',
          'Describe lightning conductors and electrostatic precipitators',
          'Calculate electrostatic force between point charges using Coulomb’s constant k = 9 × 10⁹ N·m²/C²'
        ],
        keyFormulasOrTerms: ['F = (k q₁ q₂) / r²', 'k = 1 / (4πε₀) ≈ 9 × 10⁹ N·m²/C²', 'E = F / q'],
        suggestedActivities: 'Ebonite and glass rod electrostatic charging experiments.'
      },
      {
        week: 11,
        topic: 'Electric Fields, Potential Difference, and Capacitors',
        subtopics: ['Electric field intensity (E = F / q = V / d)', 'Electric potential and potential difference: V = W / q', 'Capacitance: C = Q / V and parallel plate capacitor C = εA / d', 'Capacitors in series and parallel connections'],
        learningObjectives: [
          'Draw electric field lines for positive and negative charges and parallel plates',
          'Calculate equivalent capacitance: C_parallel = C₁ + C₂; 1/C_series = 1/C₁ + 1/C₂',
          'Calculate energy stored in a charged capacitor: W = 1/2 CV² = 1/2 QV'
        ],
        keyFormulasOrTerms: ['C = Q / V', 'C = (ε₀ ε_r A) / d', 'W = 1/2 CV² = 1/2 QV'],
        suggestedActivities: 'Connecting capacitors in series and parallel on breadboard.'
      },
      {
        week: 12,
        topic: 'Comprehensive Term Review & WAEC Practical Mock Exam',
        subtopics: ['Review of thermal physics, waves, and electrostatics', 'Alternative to Practical examination tips and table plotting guidelines', 'Final terminal examination'],
        learningObjectives: [
          'Graph plotting rules (axes labeling, large scale, best-fit line, slope calculation with large Δy/Δx triangle)',
          'Ensure full preparedness for WAEC, NECO, and Cambridge exams'
        ],
        keyFormulasOrTerms: ['Physics Examination Blueprint']
      }
    ]
  },
  {
    id: 'scheme-chem-sss2',
    subjectName: 'Chemistry',
    classLevel: 'SSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: '12-week Chemistry scheme of work covering Periodic Table Trends, Chemical Bonding, Electrolysis, Quantitative Volumetric Analysis (Titration), and Hydrocarbons.',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Sciences',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Periodic Table and Periodic Law Trends',
        subtopics: ['Modern periodic law based on atomic number', 'Blocks: s, p, d, f elements', 'Periodic trends: atomic radius, ionic radius, ionization energy, electronegativity, electron affinity across periods and down groups'],
        learningObjectives: [
          'State modern periodic law and classify elements into representative, transition, and noble gases',
          'Explain why ionization energy increases across a period and decreases down a group',
          'Predict chemical reactivity based on valence electron configuration'
        ],
        keyFormulasOrTerms: ['Nuclear charge', 'Shielding effect', 'Effective nuclear charge Z_eff'],
        suggestedActivities: 'Building periodic trend comparative charts.'
      },
      {
        week: 2,
        topic: 'Chemical Bonding: Ionic, Covalent, Coordinate, and Metallic Bonds',
        subtopics: ['Octet rule and electron transfer in ionic bonding', 'Electron sharing in single, double, triple covalent bonds', 'Coordinate (dative) bonding in NH₄⁺ and H₃O⁺', 'Metallic bonding and electron sea model', 'Intermolecular forces: Van der Waals and Hydrogen bonding'],
        learningObjectives: [
          'Draw Lewis dot-and-cross structures for NaCl, H₂O, NH₃, CH₄, CO₂, and NH₄⁺',
          'Explain physical properties (melting point, conductivity, solubility) based on bond types',
          'Explain why water (H₂O) has an unusually high boiling point compared to H₂S due to hydrogen bonds'
        ],
        keyFormulasOrTerms: ['Dative bond (A → B)', 'Hydrogen bond (H bonded to F, O, or N)'],
        suggestedActivities: 'Molecular modeling ball-and-stick assembly.'
      },
      {
        week: 3,
        topic: 'Electrolysis: Principles, Electrodes, and Preferential Discharge',
        subtopics: ['Electrolytes vs non-electrolytes (strong, weak, non-conductors)', 'Electrolytic cell vs electrochemical cell', 'Factors determining selective discharge of ions at electrodes (position in electrochemical series, concentration, nature of electrodes)', 'Electrolysis of acidified water, dilute NaCl, concentrated NaCl (brine), and CuSO₄ solution'],
        learningObjectives: [
          'Write balanced half-cell ionic equations at cathode (reduction) and anode (oxidation)',
          'Explain the electrochemical series order of cations (K⁺, Na⁺, Ca²⁺, Mg²⁺, Al³⁺, Zn²⁺, Fe²⁺, Pb²⁺, H⁺, Cu²⁺, Ag⁺, Au⁺)',
          'Explain selective discharge when inert (Pt/carbon) vs active (copper) electrodes are used'
        ],
        keyFormulasOrTerms: ['Cathode: Cu²⁺ + 2e⁻ → Cu (Reduction)', 'Anode: 4OH⁻ → 2H₂O + O₂ + 4e⁻ (Oxidation)'],
        suggestedActivities: 'Electrolysis of copper (II) sulphate solution in lab.'
      },
      {
        week: 4,
        topic: 'Faraday’s Laws of Electrolysis and Calculations',
        subtopics: ['Faraday’s First Law: m = ZIt = ZQ', 'Faraday’s Second Law: m₁ / E₁ = m₂ / E₂', 'Faraday constant (1 F = 96,500 Coulombs/mol e⁻)', 'Industrial applications: electroplating, refining of blister copper, extraction of aluminium'],
        learningObjectives: [
          'State Faraday’s 1st and 2nd laws verbatim',
          'Calculate mass of substance deposited given current, time, and molar mass',
          'Determine volume of gas liberated at STP using molar volume 22.4 dm³/mol'
        ],
        keyFormulasOrTerms: ['m = (M × I × t) / (n × F)', 'Q = I × t', '1 Faraday = 96,500 C/mol'],
        suggestedActivities: 'Electroplating iron nail with copper in beaker.'
      },
      {
        week: 5,
        topic: 'Acids, Bases, Salts, and pH Scale Calculations',
        subtopics: ['Arrhenius, Bronsted-Lowry, and Lewis definitions', 'Strong vs weak acids/bases and degree of dissociation', 'pH and pOH calculations: pH = -log[H⁺], pH + pOH = 14', 'Preparation of soluble and insoluble salts'],
        learningObjectives: [
          'Calculate pH of 0.01 M HCl, 0.05 M H₂SO₄, and 0.02 M NaOH',
          'Explain standard methods of salt preparation (neutralization, action of acid on metals, precipitation)',
          'Identify acid-base indicators (methyl orange, phenolphthalein, litmus) and color changes'
        ],
        keyFormulasOrTerms: ['pH = -log₁₀[H⁺]', 'pOH = -log₁₀[OH⁻]', 'pH + pOH = 14', '[H⁺][OH⁻] = 10⁻¹⁴'],
        suggestedActivities: 'Testing household substances with universal indicator and pH meter.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Practical Review',
        subtopics: ['CA2 Written Test on periodic trends, bonding, and electrolysis', 'Laboratory titration apparatus handling (burette, pipette, conical flask)'],
        learningObjectives: [
          'Master reading meniscus of liquid in burettes without parallax error',
          'Evaluate student mastery of stoichiometry concepts'
        ],
        keyFormulasOrTerms: ['Continuous Assessment Protocol']
      },
      {
        week: 7,
        topic: 'Quantitative Volumetric Analysis: Acid-Base Titration Calculations',
        subtopics: ['Preparation of standard solution', 'Titration equation: (C_A × V_A) / (C_B × V_B) = n_A / n_B', 'Calculations involving molarity, mass concentration (g/dm³), percentage purity, and water of crystallization'],
        learningObjectives: [
          'Perform acid-base titrations with concordant titre values within ±0.10 cm³',
          'Calculate molar concentration and mass concentration using C = m / (M × V)',
          'Determine value of x in hydrated salts like Na₂CO₃·xH₂O from experimental titration data'
        ],
        keyFormulasOrTerms: ['(C_A × V_A) / (C_B × V_B) = n_A / n_B', 'Mass conc (g/dm³) = Molarity (mol/dm³) × Molar Mass (g/mol)'],
        suggestedActivities: 'Standard titration of 0.1M HCl against anhydrous sodium trioxocarbonate (IV).'
      },
      {
        week: 8,
        topic: 'Chemical Equilibrium and Le Chatelier’s Principle',
        subtopics: ['Reversible reactions and dynamic equilibrium', 'Equilibrium constant expression K_c', 'Le Chatelier’s Principle: effect of temperature, pressure, and concentration changes', 'Industrial processes: Haber process (NH₃ synthesis) and Contact process (H₂SO₄ synthesis)'],
        learningObjectives: [
          'State Le Chatelier’s Principle accurately',
          'Predict shifts in equilibrium positions when conditions are altered',
          'Explain optimum industrial conditions (compromise temperature 450°C, 200 atm pressure, iron catalyst in Haber process)'
        ],
        keyFormulasOrTerms: ['N₂(g) + 3H₂(g) ⇌ 2NH₃(g) ΔH = -92 kJ/mol', 'K_c = [C]^c [D]^d / ([A]^a [B]^b)'],
        suggestedActivities: 'NO₂ (brown) and N₂O₄ (colorless) gas syringe temperature immersion.'
      },
      {
        week: 9,
        topic: 'Introduction to Organic Chemistry: Hydrocarbons and Homologous Series',
        subtopics: ['Unique nature of carbon (tetravalency, catenation, hybridization sp³, sp², sp)', 'Homologous series and functional groups', 'IUPAC nomenclature rules for branched alkanes, alkenes, alkynes'],
        learningObjectives: [
          'Explain why carbon forms millions of organic compounds',
          'Name organic structures up to 10 carbons using systematic IUPAC rules',
          'Draw structural isomers of butane (C₄H₁₀) and pentane (C₅H₁₂)'
        ],
        keyFormulasOrTerms: ['Alkanes: C_n H_{2n+2}', 'Alkenes: C_n H_{2n}', 'Alkynes: C_n H_{2n-2}'],
        suggestedActivities: 'Drawing and naming branched hydrocarbon isomers.'
      },
      {
        week: 10,
        topic: 'Alkanes and Alkenes: Preparation, Properties, and Reactions',
        subtopics: ['Laboratory preparation of methane and ethene', 'Combustion, substitution (free radical halogenation of methane), and addition reactions of ethene (hydrogenation, halogenation, hydration)', 'Test for unsaturation using bromine water and acidified KMnO₄'],
        learningObjectives: [
          'Write balanced equations for complete and incomplete combustion of hydrocarbons',
          'Describe the decolorization of brown bromine water by alkenes as proof of double bond',
          'Explain Markovnikov’s rule in electrophilic addition to unsymmetrical alkenes'
        ],
        keyFormulasOrTerms: ['CH₄ + Cl₂ → CH₃Cl + HCl (UV light)', 'C₂H₄ + Br₂ → C₂H₄Br₂ (1,2-dibromoethane)'],
        suggestedActivities: 'Decolorization test with bromine water in fume cupboard.'
      },
      {
        week: 11,
        topic: 'Alkynes and Aromatic Hydrocarbons (Benzene)',
        subtopics: ['Ethyne (acetylene) preparation from calcium carbide CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂', 'Combustion in oxyacetylene torch for welding', 'Benzene structure, resonance hybrid, and substitution reactions (nitration, chlorination)'],
        learningObjectives: [
          'Differentiate chemical reactions of ethyne compared to ethene and ethane',
          'Explain the stability and delocalized pi-electron cloud of benzene ring',
          'Identify common aromatic compounds (toluene, phenol, aniline, nitrobenzene)'
        ],
        keyFormulasOrTerms: ['CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂', 'Benzene C₆H₆ resonance hybrid'],
        suggestedActivities: 'Preparation of ethyne from calcium carbide and test with ammoniacal silver nitrate.'
      },
      {
        week: 12,
        topic: 'General Revision, WAEC Practical Preparation & Terminal Examination',
        subtopics: ['Volumetric and qualitative inorganic analysis review', 'Review of past WAEC theory papers', 'End of Term Assessment'],
        learningObjectives: [
          'Master flame tests and cation/anion confirmatory tests for Fe²⁺, Fe³⁺, Cu²⁺, Zn²⁺, Pb²⁺, SO₄²⁻, Cl⁻, CO₃²⁻',
          'Attain maximum readiness for WASSCE Chemistry papers 1, 2, and 3'
        ],
        keyFormulasOrTerms: ['WAEC Chemistry Practical Guide']
      }
    ]
  },
  {
    id: 'scheme-eng-sss2',
    subjectName: 'English Language',
    classLevel: 'SSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: '12-week English Language syllabus covering Essay Writing (Expository & Argumentative), Summary Writing Techniques, Comprehension Skills, Lexis & Structure, and Oral English (Vowels, Consonants, Rhyme, Stress Patterns).',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Languages & Humanities',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Oral English: Monophthongs (Pure Vowels) and Diphthongs',
        subtopics: ['12 pure vowels (long vs short vowels)', '8 diphthongs (gliding vowels)', 'Phonetic transcription and word identification'],
        learningObjectives: [
          'Distinguish between contrasting vowel pairs (/iː/ vs /ɪ/, /uː/ vs /ʊ/, /ɔː/ vs /ɒ/)',
          'Identify diphthongs (/eɪ/, /aɪ/, /ɔɪ/, /aʊ/, /əʊ/, /ɪə/, /eə/, /ʊə/) in exam words',
          'Pronounce and transcribe target words accurately'
        ],
        keyFormulasOrTerms: ['Vowel Chart', 'Phonemic symbols'],
        suggestedActivities: 'Pronunciation drills and oral contrast competitions.'
      },
      {
        week: 2,
        topic: 'Expository Essay Writing: Structure, Cohesion, and Development',
        subtopics: ['Topic analysis and outlining', 'Introduction with strong thesis statement', 'Body paragraphs with topic sentences and supporting evidence', 'Logical transitional words and conclusion'],
        learningObjectives: [
          'Plan and organize a 450-word expository essay on contemporary Nigerian themes',
          'Use cohesive devices (furthermore, consequently, nevertheless, in contrast)',
          'Ensure grammatical concord and sentence variety'
        ],
        keyFormulasOrTerms: ['P-E-E-L paragraph structure: Point, Evidence, Explanation, Link'],
        suggestedActivities: 'Writing an expository essay on "The Impact of Artificial Intelligence on Nigerian Education".'
      },
      {
        week: 3,
        topic: 'Grammar: Clauses and Sentence Types (Simple, Compound, Complex, Compound-Complex)',
        subtopics: ['Independent vs dependent clauses', 'Noun clauses and grammatical functions (subject of verb, object, complement)', 'Adjectival (relative) clauses and restrictive/non-restrictive usage', 'Adverbial clauses of time, reason, concession, manner, condition'],
        learningObjectives: [
          'Identify grammatical names and functions of underlined clauses in past WAEC passages',
          'Construct complex sentences using coordinating and subordinating conjunctions',
          'Eliminate dangling and misplaced modifiers'
        ],
        keyFormulasOrTerms: ['Grammatical Name: Noun clause / Adjectival clause / Adverbial clause', 'Grammatical Function: Subject of the verb / Object / Modifies...'],
        suggestedActivities: 'Analyzing past WAEC comprehension clause questions.'
      },
      {
        week: 4,
        topic: 'Summary Writing: Technique, Brevity, and Sentence Restructuring',
        subtopics: ['Skimming for the main idea and scanning for specific supporting points', 'Differentiating main points from illustrations, examples, and repetitions', 'Expressing points in clear, concise complete sentences using own words (avoiding mindless lifting)'],
        learningObjectives: [
          'Extract required answers from a 600-word passage without preamble or redundant adjectives',
          'Paraphrase author’s sentences while preserving original meaning',
          'Score full marks in WAEC summary section by adhering to 1-sentence per point format'
        ],
        keyFormulasOrTerms: ['Rule of Paraphrasing', 'Zero mindless lifting penalty'],
        suggestedActivities: 'Timed summary exercise on environmental conservation.'
      },
      {
        week: 5,
        topic: 'Oral English: Consonant Clusters and Silent Letters',
        subtopics: ['Initial consonant clusters (e.g., street, splash, glimpse)', 'Final consonant clusters (e.g., texts, prompts, bridged)', 'Silent letters in English words (b, k, l, p, g, h, w, t)'],
        learningObjectives: [
          'Pronounce consonant clusters without inserting epenthetic vowels (avoiding "sit-reet")',
          'Identify silent letters in words: subtle, tomb, knot, salmon, receipt, paradigm, whistle, sword'
        ],
        keyFormulasOrTerms: ['Phonotactics', 'Silent letter rules'],
        suggestedActivities: 'Silent letter spelling bee and oral audio quiz.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Essay Clinic',
        subtopics: ['Mid-Term CA2 Exam (Lexis, Comprehension, Essay)', 'Peer review of essay drafts and common punctuation errors'],
        learningObjectives: [
          'Identify punctuation pitfalls (comma splices, apostrophe misuse, run-on sentences)',
          'Gauge individual progress in exam speed'
        ],
        keyFormulasOrTerms: ['Punctuation and Concord Standards']
      },
      {
        week: 7,
        topic: 'Argumentative Essay Writing / Debate Formats',
        subtopics: ['Persuasive rhetorical techniques (ethos, pathos, logos)', 'Addressing the counter-argument and refutation', 'Formal vocatives and parliamentary addressing in debate format'],
        learningObjectives: [
          'Develop compelling logical arguments for controversial social and educational topics',
          'Refute opposing viewpoints constructively with facts and statistics',
          'Write a debate speech with proper salutations ("Mr. Chairman, Panel of Judges...")'
        ],
        keyFormulasOrTerms: ['Counter-claim and Rebuttal'],
        suggestedActivities: 'Inter-class debate: "Single-Sex Schools Produce Better Academic Results than Co-Educational Schools".'
      },
      {
        week: 8,
        topic: 'Lexis and Structure: Idioms, Phrasal Verbs, and Figurative Language',
        subtopics: ['Common English idioms and contextual meanings', 'Separable and inseparable phrasal verbs', 'Figures of speech: Metaphor, Simile, Personification, Irony, Hyperbole, Oxymoron, Euphemism, Paradox'],
        learningObjectives: [
          'Interpret figurative expressions in comprehension texts',
          'Apply appropriate phrasal verbs in essay writing',
          'Answer WAEC lexis and structure multiple choice questions with 90%+ accuracy'
        ],
        keyFormulasOrTerms: ['Idiomatic accuracy', 'Collocations'],
        suggestedActivities: 'Idiom matching flashcard tournament.'
      },
      {
        week: 9,
        topic: 'Oral English: Word Stress, Syllabification, and Sentence Intonation',
        subtopics: ['Rules of syllable stress in 2-syllable, 3-syllable, and multi-syllable words', 'Stress shifts between nouns/adjectives and verbs (e.g., RE-cord vs re-CORD, EX-port vs ex-PORT)', 'Intonation patterns: Falling intonation for declarative statements; Rising intonation for Polar Yes/No questions'],
        learningObjectives: [
          'Count syllables accurately and mark primary stress with stress marks (ˈ)',
          'Distinguish meaning shifts caused by stress placement in grammatical pairs',
          'Apply correct falling or rising tune in spoken dialogue'
        ],
        keyFormulasOrTerms: ['Primary Stress (ˈ)', 'Intonation contours (Falling vs Rising)'],
        suggestedActivities: 'Choral stress-marking recitation.'
      },
      {
        week: 10,
        topic: 'Comprehension: Critical Reading, Deductive Reasoning, and Tone Analysis',
        subtopics: ['Literal comprehension vs inferential comprehension', 'Detecting author’s tone, mood, and attitude (objective, satirical, critical, nostalgic, indignant)', 'Contextual vocabulary replacement'],
        learningObjectives: [
          'Answer inferential questions by citing textual evidence',
          'Identify the author’s perspective and literary devices used',
          'Replace vocabulary words with exact synonyms maintaining tense and number'
        ],
        keyFormulasOrTerms: ['Contextual synonym replacement rules'],
        suggestedActivities: 'Reading and dissecting historical speeches and literary prose.'
      },
      {
        week: 11,
        topic: 'Formal Letter and Speech Writing',
        subtopics: ['Conventions of formal letters (two addresses, formal salutation, concise heading, complimentary close "Yours faithfully", signature and full name)', 'Speech writing conventions (protocol, engaging greeting, memorable concluding call to action)'],
        learningObjectives: [
          'Format formal letters to government ministries, school boards, and corporate bodies',
          'Maintain an objective, polite, yet authoritative register',
          'Write a graduation valedictory speech'
        ],
        keyFormulasOrTerms: ['Formal Letter Protocol: 2 Addresses, Date, Salutation, Title, Body, Yours faithfully, Signature, Full Name'],
        suggestedActivities: 'Writing a letter to the Commissioner of Education proposing modern STEM laboratory upgrades.'
      },
      {
        week: 12,
        topic: 'Comprehensive Revision & WASSCE / IGCSE Mock Exam',
        subtopics: ['Paper 1 (Objective test: Lexis, Structure, Comprehension, Summary)', 'Paper 2 (Essay and Letter Writing)', 'Paper 3 (Test of Oral)'],
        learningObjectives: [
          'Master time management: 50 minutes for essay, 30 minutes for summary, 40 minutes for comprehension',
          'Achieve Grade A1 standard across all three examination papers'
        ],
        keyFormulasOrTerms: ['WAEC English Marking Scheme Standards']
      }
    ]
  },
  {
    id: 'scheme-bio-sss2',
    subjectName: 'Biology',
    classLevel: 'SSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: '12-week Biology scheme covering Digestive System, Circulatory and Transport Systems, Respiratory System, Excretory System, and Ecology.',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Sciences',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Digestive System in Humans and Herbivorous Mammals',
        subtopics: ['Alimentary canal structure and associated organs', 'Enzymatic digestion of carbohydrates, proteins, and lipids', 'Dentition differences between humans, carnivores, and ruminants', 'Absorption of digested food in the ileum (villi structure)'],
        learningObjectives: [
          'Label the human digestive tract and explain peristalsis',
          'State enzymes, substrates, and products (amylase, pepsin, trypsin, lipase)',
          'Explain adaptation of ruminant stomach (rumen, reticulum, omasum, abomasum)'
        ],
        keyFormulasOrTerms: ['Dental formula: I 2/2, C 1/1, PM 2/2, M 3/3 = 32', 'Villus adaptations for diffusion'],
        suggestedActivities: 'Dissection and examination of mammalian alimentary canal.'
      },
      {
        week: 2,
        topic: 'Transport System in Mammals: Blood Composition and Function',
        subtopics: ['Components of blood: Plasma, Red Blood Cells (Erythrocytes), White Blood Cells (Leukocytes), Platelets (Thrombocytes)', 'Functions of blood: transport of O₂, CO₂, nutrients, hormones, defense against disease, clotting mechanism', 'Blood groups (ABO system and Rhesus factor) and transfusion compatibility'],
        learningObjectives: [
          'Differentiate structure and roles of phagocytes vs lymphocytes',
          'Describe the blood clotting cascade (thromboplastin, prothrombin, thrombin, fibrinogen, fibrin)',
          'Determine blood compatibility and explain erythroblastosis fetalis in Rh⁻ mothers'
        ],
        keyFormulasOrTerms: ['Universal Donor: O⁻', 'Universal Recipient: AB⁺', 'Agglutination'],
        suggestedActivities: 'Blood smear slide observation under compound microscope.'
      },
      {
        week: 3,
        topic: 'Circulatory System: Heart Structure and Blood Vessels',
        subtopics: ['Internal structure of the mammalian heart (4 chambers, valves: tricuspid, bicuspid/mitral, semi-lunar)', 'Double circulation: Pulmonary and Systemic circuits', 'Comparison of arteries, veins, and capillaries', 'Heartbeat, pulse, blood pressure, and cardiovascular health'],
        learningObjectives: [
          'Trace blood flow pathway from vena cava to aorta with oxygenation details',
          'Explain why the left ventricular wall is thicker than the right',
          'Contrast structural adaptations of arteries vs veins'
        ],
        keyFormulasOrTerms: ['Double Circulation', 'Cardiac output = Stroke Volume × Heart Rate'],
        suggestedActivities: 'Dissection of sheep/cow heart in biology laboratory.'
      },
      {
        week: 4,
        topic: 'Transport in Higher Plants: Xylem and Phloem Functions',
        subtopics: ['Internal anatomy of dicot and monocot roots and stems', 'Water and mineral absorption by root hairs (osmosis and active transport)', 'Transpiration pull, root pressure, capillary action, and cohesion-tension theory', 'Translocation of manufactured organic food via phloem sieve tubes'],
        learningObjectives: [
          'Differentiate xylem vessels/tracheids vs phloem sieve tubes/companion cells',
          'Define transpiration and factors affecting rate (temperature, humidity, wind speed, light intensity)',
          'Set up and read a potometer to measure water uptake rate'
        ],
        keyFormulasOrTerms: ['Cohesion-Adhesion Theory', 'Translocation via Mass Flow'],
        suggestedActivities: 'Potometer measurement of leafy twig transpiration under light and fan.'
      },
      {
        week: 5,
        topic: 'Respiratory System in Animals: Mechanism of Breathing',
        subtopics: ['Respiratory surfaces and characteristics (large surface area, thin, moist, highly vascularized)', 'Respiratory structures in amoeba, earthworm (skin), insects (tracheal system), fish (gills), and mammals (lungs)', 'Mechanism of mammalian breathing: inhalation and exhalation mechanics', 'Cellular respiration: aerobic (glycolysis, Krebs cycle) vs anaerobic respiration'],
        learningObjectives: [
          'Explain role of diaphragm, intercostal muscles, and rib cage during ventilation',
          'Compare gaseous exchange in gill lamellae via counter-current mechanism',
          'Write balanced chemical equations for aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP'
        ],
        keyFormulasOrTerms: ['C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP', 'Lactic acid fermentation: C₆H₁₂O₆ → 2C₃H₆O₃ + 2 ATP'],
        suggestedActivities: 'Bell jar and balloon lung model demonstration.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Practical Review',
        subtopics: ['CA2 Practical and theory test', 'Biological drawing guidelines (sharp lines, no shading, magnification, ruled label lines)'],
        learningObjectives: [
          'Evaluate mastery of mammalian organ systems',
          'Ensure biological drawing compliance with WAEC rules'
        ],
        keyFormulasOrTerms: ['Magnification = Size of Drawing / Size of Actual Specimen']
      },
      {
        week: 7,
        topic: 'Excretory System in Animals and Humans',
        subtopics: ['Excretion definition vs egestion', 'Excretory products and organs in different animals (contractile vacuole in protozoa, flame cells in flatworms, nephridia in earthworms, Malpighian tubules in insects, kidneys in mammals)', 'Structure of the human urinary system and nephron', 'Processes of urine formation: Ultrafiltration in Bowman’s capsule, Selective reabsorption in proximal convoluted tubule, Osmoregulation in Loop of Henle and Collecting duct (ADH role)'],
        learningObjectives: [
          'Draw and label longitudinal section of mammalian kidney and nephron',
          'Explain hormonal regulation of water balance by Antidiuretic Hormone (ADH) from pituitary gland',
          'Describe causes and management of kidney stones and renal failure (dialysis and kidney transplant)'
        ],
        keyFormulasOrTerms: ['Ultrafiltration', 'Glomerular filtrate', 'Selective reabsorption'],
        suggestedActivities: 'Dissection of mammalian kidney showing cortex, medulla, pelvis.'
      },
      {
        week: 8,
        topic: 'Homeostasis: Regulation of Body Temperature, Blood Sugar, and Water',
        subtopics: ['Concept of internal environment and negative feedback mechanisms', 'Thermoregulation by the mammalian skin (sweating, vasodilation, vasoconstriction, shivering, hair erection)', 'Regulation of blood glucose level by pancreas (insulin and glucagon)', 'Liver functions in deamination, bile production, detoxification, and iron storage'],
        learningObjectives: [
          'Explain negative feedback loops in blood glucose homeostasis',
          'Explain physiological skin responses in hot vs cold ambient temperatures',
          'Discuss symptoms and management of Diabetes Mellitus'
        ],
        keyFormulasOrTerms: ['Negative feedback loop', 'Insulin converts glucose to glycogen', 'Glucagon converts glycogen to glucose'],
        suggestedActivities: 'Skin temperature measurement after ethanol evaporation.'
      },
      {
        week: 9,
        topic: 'Ecology: Ecosystem Dynamics, Food Chains, Food Webs, and Energy Flow',
        subtopics: ['Ecological concepts: Biosphere, biome, habitat, population, community, niche', 'Trophic levels: Producers, primary consumers, secondary consumers, tertiary consumers, decomposers', 'Pyramids of numbers, biomass, and energy (10% energy transfer rule)'],
        learningObjectives: [
          'Construct food chains and complex food webs from Nigerian savannah and rainforest habitats',
          'Explain why energy pyramids are always upright and never inverted',
          'Calculate energy available at higher trophic levels given producer energy'
        ],
        keyFormulasOrTerms: ['10% Energy Transfer Law', 'Trophic Level 1 → 2 → 3 → 4'],
        suggestedActivities: 'School garden ecological survey and quadrat sampling.'
      },
      {
        week: 10,
        topic: 'Nutrient Cycles in Nature (Carbon, Water, and Nitrogen Cycles)',
        subtopics: ['Carbon cycle: photosynthesis, respiration, combustion, fossilization', 'Water (hydrological) cycle: evaporation, transpiration, condensation, precipitation', 'Nitrogen cycle: nitrogen fixation (Rhizobium, Lightning), nitrification (Nitrosomonas, Nitrobacter), denitrification (Pseudomonas)'],
        learningObjectives: [
          'Diagram the nitrogen cycle with named bacteria at each stage',
          'Explain human impact on the carbon cycle (greenhouse effect, global warming, deforestation)',
          'State the significance of legumes in crop rotation'
        ],
        keyFormulasOrTerms: ['Nitrosomonas: NH₄⁺ → NO₂⁻', 'Nitrobacter: NO₂⁻ → NO₃⁻'],
        suggestedActivities: 'Examining root nodules of bean plants for Rhizobium bacteria.'
      },
      {
        week: 11,
        topic: 'Ecological Adaptations, Symbiosis, and Succession',
        subtopics: ['Structural and behavioral adaptations of xerophytes, hydrophytes, mesophytes, halophytes', 'Symbiotic associations: Mutualism (lichen, pollination), Commensalism (remora and shark, epiphytes), Parasitism (tapeworm, dodder)', 'Primary and secondary ecological succession in ponds and bare rocks'],
        learningObjectives: [
          'Identify adaptations of desert plants (sunken stomata, thick cuticle, succulent stems)',
          'Distinguish mutualism from commensalism with local Nigerian examples',
          'Describe pioneer communities and climax vegetation stages'
        ],
        keyFormulasOrTerms: ['Pioneer species → Seral stages → Climax community'],
        suggestedActivities: 'Field trip studying epiphyte ferns on Stanbax campus trees.'
      },
      {
        week: 12,
        topic: 'Comprehensive Term Review, Biology Practical Mock & Terminal Examination',
        subtopics: ['Specimen identification, biological drawings, food tests (Benedict’s for reducing sugars, Iodine for starch, Biuret for protein, Emulsion for lipids)', 'WAEC Paper 1 (Objective), Paper 2 (Theory), and Paper 3 (Practical)'],
        learningObjectives: [
          'Master food nutrient test chemical reagents, procedures, observations, and inferences',
          'Attain peak confidence for WASSCE Biology examination'
        ],
        keyFormulasOrTerms: ['WAEC Biology Practical Marking Rubric']
      }
    ]
  },
  {
    id: 'scheme-econ-sss2',
    subjectName: 'Economics',
    classLevel: 'SSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / WAEC WASSCE / Cambridge IGCSE',
    summary: '12-week SSS 2 Economics scheme covering Money and Banking, Central Bank Monetary Policy, Inflation and Deflation, Public Finance and Taxation, and International Trade.',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Commercial Studies',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Money: Evolution, Characteristics, Functions, and Value',
        subtopics: ['Barter system and double coincidence of wants difficulties', 'Evolution of commodity money to metallic and fiat paper money', 'Qualities of good money (acceptability, portability, divisibility, durability, scarcity)', 'Four functions of money (medium of exchange, unit of account, store of value, standard of deferred payment)'],
        learningObjectives: [
          'Explain why barter trade became obsolete with modern economic development',
          'State essential characteristics of money and explain value of money as purchasing power',
          'Calculate value of money index relative to general price level: V_m = 1 / P'
        ],
        keyFormulasOrTerms: ['V_m = 1 / P', 'M₁ = Currency in circulation + Demand deposits', 'M₂ = M₁ + Quasi-money'],
        suggestedActivities: 'Classroom barter simulation demonstrating transaction friction.'
      },
      {
        week: 2,
        topic: 'Commercial Banking and the Process of Credit Creation',
        subtopics: ['Functions of commercial banks in Nigeria', 'Types of bank accounts (Current, Savings, Fixed Deposit)', 'Credit creation mechanism and cash reserve ratio', 'Credit multiplier formula: Multiplier = 1 / Cash Reserve Ratio'],
        learningObjectives: [
          'Explain how commercial banks expand the money supply through lending',
          'Calculate total deposit expansion given initial deposit and cash reserve requirement (CRR)',
          'Distinguish between retail banking and merchant banking operations'
        ],
        keyFormulasOrTerms: ['Money Multiplier = 1 / CRR', 'Total Deposits = Initial Deposit × (1 / CRR)'],
        suggestedActivities: 'Tabulating credit expansion stages from an initial ₦100,000 deposit at 10% CRR.'
      },
      {
        week: 3,
        topic: 'Central Bank of Nigeria (CBN) and Monetary Policy Instruments',
        subtopics: ['Origins and functions of the Central Bank of Nigeria', 'Traditional monetary policy tools: Cash Reserve Ratio (CRR), Monetary Policy Rate (MPR), Open Market Operations (OMO), Liquidity Ratio', 'Selective/qualitative credit controls: Moral suasion, credit ceilings, margin requirements'],
        learningObjectives: [
          'Explain how the CBN acts as banker to the Federal Government and lender of last resort',
          'Analyze how raising the MPR curbs inflation by dampening commercial bank borrowing',
          'Differentiate expansionary vs contractionary monetary policy measures'
        ],
        keyFormulasOrTerms: ['MPR (Monetary Policy Rate)', 'OMO (Open Market Operations)', 'Treasury Bills'],
        suggestedActivities: 'Reviewing recent CBN Monetary Policy Committee (MPC) press communiques.'
      },
      {
        week: 4,
        topic: 'Inflation and Deflation: Causes, Measurement, and Control',
        subtopics: ['Definition of inflation and deflation', 'Types: Demand-pull, Cost-push, Creeping, Hyperinflation', 'Causes of inflation in Nigeria (currency depreciation, import dependency, removal of subsidies, food supply bottlenecks)', 'Measurement via Consumer Price Index (CPI): CPI = (Cost of basket current / Cost of basket base) × 100', 'Consequences and control measures'],
        learningObjectives: [
          'Distinguish between demand-pull and cost-push inflation with demand-supply diagrams',
          'Compute inflation rate from sequential CPI index figures',
          'Discuss impact of inflation on fixed-income earners, debtors, creditors, and economic growth'
        ],
        keyFormulasOrTerms: ['Inflation Rate = ((CPI₂ - CPI₁) / CPI₁) × 100%', 'Fisher’s Equation: MV = PT'],
        suggestedActivities: 'Calculating price increases of staple market commodities in Ibadan markets.'
      },
      {
        week: 5,
        topic: 'Public Finance: Government Revenue, Expenditure, and Budgets',
        subtopics: ['Sources of government revenue in Nigeria (oil revenue vs non-oil revenue: taxes, tariffs, fines, loans, royalties)', 'Recurrent expenditure vs Capital expenditure', 'Types of budgets: Balanced, Surplus, Deficit budget', 'Financing budget deficits and debt sustainability'],
        learningObjectives: [
          'Classify federal budget items into recurrent (salaries, overheads) and capital (infrastructure, schools, roads)',
          'Explain macroeconomic effects of a deficit budget during recession',
          'Evaluate external vs domestic national debt implications'
        ],
        keyFormulasOrTerms: ['Fiscal Deficit = Total Expenditure - Total Revenue (excluding borrowing)'],
        suggestedActivities: 'Analyzing Nigeria’s federal annual budget allocations.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Review Week',
        subtopics: ['CA2 Written Examination', 'Review of money, banking, inflation, and public finance calculations'],
        learningObjectives: [
          'Assess student mastery under timed WAEC objective and theory conditions',
          'Clarify credit multiplier and CPI index computation difficulties'
        ],
        keyFormulasOrTerms: ['Continuous Assessment Protocol']
      },
      {
        week: 7,
        topic: 'Taxation: Principles, Types, and Systems',
        subtopics: ['Adam Smith’s canons of taxation (equity, certainty, convenience, economy)', 'Direct taxes (Personal Income Tax, Company Income Tax, Capital Gains Tax)', 'Indirect taxes (Value Added Tax - VAT, Customs Duties, Excise Duties)', 'Systems of taxation: Progressive, Proportional, Regressive taxes', 'Tax incidence and elasticity of demand'],
        learningObjectives: [
          'Evaluate taxation systems based on ability to pay principle',
          'Explain why VAT (indirect tax) can be regressive to low-income households',
          'Calculate tax liability under progressive tax brackets'
        ],
        keyFormulasOrTerms: ['Progressive: Tax rate rises as income rises', 'Regressive: Tax rate falls as income rises'],
        suggestedActivities: 'Computing PAYE tax for sample salary grades.'
      },
      {
        week: 8,
        topic: 'International Trade: Absolute and Comparative Advantage',
        subtopics: ['Domestic (internal) trade vs International (external) trade', 'Adam Smith’s Theory of Absolute Advantage', 'David Ricardo’s Theory of Comparative Advantage and opportunity cost', 'Benefits and disadvantages of international trade'],
        learningObjectives: [
          'Distinguish reasons for trade across borders (differing factor endowments, climate, technology)',
          'Construct numerical comparative advantage models demonstrating gains from trade',
          'Calculate terms of trade: (Index of export prices / Index of import prices) × 100'
        ],
        keyFormulasOrTerms: ['Terms of Trade = (P_x / P_m) × 100', 'Opportunity Cost Ratio'],
        suggestedActivities: 'Solving WAEC comparative advantage trade output matrix questions.'
      },
      {
        week: 9,
        topic: 'Balance of Trade and Balance of Payments (BOP)',
        subtopics: ['Balance of Trade (Visible exports - Visible imports)', 'Balance of Payments structure: Current account (visible trade, invisible trade/services, unrequited transfers), Capital account, Financial account', 'BOP surplus, deficit, and equilibrium', 'Causes and remedies for chronic BOP deficit in Nigeria'],
        learningObjectives: [
          'Distinguish between balance of trade and overall balance of payments',
          'Identify items belonging to current account vs capital account',
          'Analyze policies to correct balance of payments deficits (currency devaluation, import substitution, export promotion)'
        ],
        keyFormulasOrTerms: ['BOP = Current Account + Capital Account + Financial Account + Net Errors & Omissions = 0'],
        suggestedActivities: 'Categorizing trade transactions into BOP accounting columns.'
      },
      {
        week: 10,
        topic: 'Trade Restrictions and Commercial Policies',
        subtopics: ['Free trade vs protectionism arguments', 'Instruments of trade restriction: Tariffs (specific and ad-valorem), Quotas, Embargoes, Subsidies, Exchange control', 'Economic consequences of tariffs on domestic consumers and infant industries'],
        learningObjectives: [
          'State arguments for protection of infant industries and national security',
          'Illustrate tariff effects on price, domestic output, and imports using supply-demand curves',
          'Explain dumping and anti-dumping retaliatory measures'
        ],
        keyFormulasOrTerms: ['Ad-Valorem Tariff = Percentage of imported good value', 'Specific Tariff = Fixed amount per physical unit'],
        suggestedActivities: 'Debating: "Should Nigeria ban imports of finished textile products?"'
      },
      {
        week: 11,
        topic: 'Economic Integration and International Financial Institutions',
        subtopics: ['Stages of economic integration: Free Trade Area, Customs Union, Common Market, Economic Union (ECOWAS, AfCFTA, European Union)', 'Role of International Monetary Fund (IMF), World Bank (IBRD), and World Trade Organization (WTO)', 'Challenges of African economic integration'],
        learningObjectives: [
          'Explain the objectives of the African Continental Free Trade Area (AfCFTA)',
          'Distinguish between IMF (short-term balance of payments support) and World Bank (long-term infrastructural development financing)',
          'Evaluate benefits of single currency proposals in the West African sub-region (ECO)'
        ],
        keyFormulasOrTerms: ['AfCFTA (African Continental Free Trade Area)', 'ECOWAS Common External Tariff (CET)'],
        suggestedActivities: 'Mapping trade corridors across West Africa.'
      },
      {
        week: 12,
        topic: 'General Revision, WAEC Exam Strategies & Terminal Examination',
        subtopics: ['Comprehensive review of all term topics', 'Mathematical economics calculations review (elasticity, multipliers, CPI, BOP balances)', 'End of Term Assessment'],
        learningObjectives: [
          'Execute clear step-by-step graphical illustrations and numerical proofs in theory papers',
          'Achieve mastery of WAEC and NECO Economics syllabuses'
        ],
        keyFormulasOrTerms: ['WAEC Economics Assessment Blueprint']
      }
    ]
  },
  {
    id: 'scheme-basic-sci-jss2',
    subjectName: 'Basic Science & Technology',
    classLevel: 'JSS 2',
    term: '2nd Term',
    session: '2025/2026 Academic Session',
    curriculumStandard: 'NERDC / BECE Junior WAEC',
    summary: '12-week Junior Secondary Basic Science scheme covering Living Things & Habitats, Kinetic Theory, Energy and Work, Skeletal and Circulatory Systems, and Crude Oil & Petrochemicals.',
    isAiLearned: true,
    lastUpdated: '2026-09-20',
    uploadedBy: 'HOD Junior Academics',
    weeklyTopics: [
      {
        week: 1,
        topic: 'Kinetic Theory of Matter: States and Molecular Arrangement',
        subtopics: ['Assumptions of the kinetic theory', 'Arrangement, motion, and forces in solids, liquids, and gases', 'Changes of state: Melting, boiling, evaporation, condensation, freezing, sublimation'],
        learningObjectives: [
          'Explain how particles behave when heated or cooled',
          'Explain sublimation with examples (iodine crystals, camphor/mothballs, dry ice)',
          'Distinguish between evaporation and boiling'
        ],
        keyFormulasOrTerms: ['Kinetic Energy = 1/2 mv²', 'Molecular motion'],
        suggestedActivities: 'Heating camphor crystals in a test tube.'
      },
      {
        week: 2,
        topic: 'Thermal Energy and Methods of Heat Transfer',
        subtopics: ['Conduction in solids (good conductors vs insulators)', 'Convection in liquids and gases (convection currents, sea breeze, land breeze)', 'Radiation of heat (emission and absorption by dull black vs shiny white surfaces)', 'The vacuum (thermos) flask construction and heat loss prevention'],
        learningObjectives: [
          'Demonstrate heat conduction along copper, iron, and glass rods',
          'Explain how a vacuum flask prevents conduction, convection, and radiation',
          'Explain why solar water heaters are painted black'
        ],
        keyFormulasOrTerms: ['Conduction', 'Convection', 'Radiation', 'Vacuum Flask'],
        suggestedActivities: 'Demonstrating wax melting on metal rods of different materials.'
      },
      {
        week: 3,
        topic: 'Crude Oil and Petrochemicals in Nigeria',
        subtopics: ['Origin and formation of crude oil from ancient marine organisms', 'Fractional distillation of petroleum in refineries', 'Fractions and boiling points: Petroleum gas, petrol (gasoline), kerosene, diesel, lubricating oil, bitumen', 'Economic importance of petroleum and environmental pollution'],
        learningObjectives: [
          'State the location of major oil fields and refineries in Nigeria (Port Harcourt, Warri, Kaduna, Dangote Refinery)',
          'Arrange petroleum fractions in order of increasing boiling points',
          'Discuss environmental degradation in the Niger Delta and oil spillage control'
        ],
        keyFormulasOrTerms: ['Fractional Distillation', 'Hydrocarbons', 'Refinery fractions'],
        suggestedActivities: 'Separating ink colors using paper chromatography as model of fractional separation.'
      },
      {
        week: 4,
        topic: 'Work, Energy, and Power Calculations',
        subtopics: ['Definition of Work Done = Force × Distance in the direction of force', 'Forms of energy (Potential Energy = mgh, Kinetic Energy = 1/2 mv²)', 'Law of conservation of energy', 'Definition and calculation of Power = Work Done / Time Taken'],
        learningObjectives: [
          'Calculate work done in Joules: W = F × d',
          'Solve problems on potential energy (PE = mgh) and kinetic energy (KE = 1/2 mv²)',
          'Calculate power in Watts (W) and convert to horsepower'
        ],
        keyFormulasOrTerms: ['Work = Force × Distance (Joules)', 'PE = mgh', 'KE = 1/2 mv²', 'Power = Work / Time (Watts)'],
        suggestedActivities: 'Calculating student power output running up school stairs.'
      },
      {
        week: 5,
        topic: 'Simple Machines: Levers, Pulleys, and Inclined Planes',
        subtopics: ['Definition of machine as a device making work easier', 'Classes of levers (1st, 2nd, 3rd class levers based on Fulcrum, Load, Effort position)', 'Mechanical Advantage (MA = Load / Effort)', 'Velocity Ratio (VR = Distance moved by effort / Distance moved by load)', 'Efficiency = (MA / VR) × 100%'],
        learningObjectives: [
          'Classify everyday tools (scissors, wheelbarrow, tweezers, crowbar, nutcracker) into lever classes',
          'Calculate MA, VR, and Efficiency of pulley systems and inclined planes',
          'Explain why machine efficiency is always less than 100% due to friction'
        ],
        keyFormulasOrTerms: ['MA = Load / Effort', 'VR = d_E / d_L', 'Efficiency = (MA / VR) × 100%'],
        suggestedActivities: 'Lifting weights with single and double pulley systems.'
      },
      {
        week: 6,
        topic: 'Mid-Term Continuous Assessment & Practical Review',
        subtopics: ['BECE Style Written Test (Objectives & Theory)', 'Practical machine efficiency calculation review'],
        learningObjectives: [
          'Evaluate mastery of kinetic theory, heat transfer, and mechanical advantage',
          'Review continuous assessment scores'
        ],
        keyFormulasOrTerms: ['Junior Secondary Examination Standards']
      },
      {
        week: 7,
        topic: 'Human Skeletal System and Movement',
        subtopics: ['Functions of skeleton: Support, protection, movement, blood cell manufacture, mineral storage', 'Major divisions: Axial skeleton (skull, vertebral column, ribs, sternum) and Appendicular skeleton (limb girdles and limbs)', 'Types of joints: Immovable (sutures), slightly movable, freely movable (ball and socket, hinge, pivot)', 'Functions of bones, cartilage, ligaments, tendons, and synovial fluid'],
        learningObjectives: [
          'Identify major bones of the human skeleton on a full model',
          'Compare range of movement in shoulder (ball and socket) vs knee/elbow (hinge) joints',
          'Explain how antagonistic muscles (biceps and triceps) cause arm bending and straightening'
        ],
        keyFormulasOrTerms: ['Ligaments connect bone to bone', 'Tendons connect muscle to bone', 'Synovial fluid lubricates joints'],
        suggestedActivities: 'Observing articulated human skeleton model in science laboratory.'
      },
      {
        week: 8,
        topic: 'Human Circulatory and Respiratory Systems Overview',
        subtopics: ['Heart chambers and blood flow direction', 'Arteries vs veins vs capillaries', 'Organs of respiration: Nose, trachea, bronchi, lungs, alveoli', 'First aid for choking and artificial respiration (CPR)'],
        learningObjectives: [
          'Trace blood from heart to lungs and body tissues',
          'Describe how oxygen diffuses into blood capillaries at the alveoli',
          'Demonstrate basic first aid and recovery position for an unconscious breathing person'
        ],
        keyFormulasOrTerms: ['Alveoli gas exchange', 'Pulse rate'],
        suggestedActivities: 'Measuring resting pulse rate and post-exercise pulse rate.'
      },
      {
        week: 9,
        topic: 'Chemicals: Classification, Safety Rules, and Hazards',
        subtopics: ['Classes of chemicals based on usage: Agricultural, pharmaceutical, industrial, laboratory', 'Hazard symbols: Toxic (skull), Flammable (fire), Corrosive (acid drip), Explosive (blast), Oxidizing (flame over circle)', 'Safety guidelines in school laboratory and chemical storage'],
        learningObjectives: [
          'Recognize international chemical hazard symbols on reagent bottles',
          'Demonstrate correct handling of acids, alkalis, and flammable liquids',
          'State first aid measures for chemical spills on skin or eyes'
        ],
        keyFormulasOrTerms: ['Hazard warning symbols', 'Safety Data Sheet (SDS)'],
        suggestedActivities: 'Identifying hazard warning symbols on container labels.'
      },
      {
        week: 10,
        topic: 'Environmental Pollution: Air, Water, and Land Pollution',
        subtopics: ['Causes and pollutants of air pollution (CO, SO₂, NO₂, particulates, greenhouse gases)', 'Water pollution causes (sewage, industrial effluent, oil spills, plastics) and eutrophication', 'Land pollution: refuse heaps, non-biodegradable waste, pesticides', 'Control and recycling: Reduce, Reuse, Recycle (3Rs)'],
        learningObjectives: [
          'Differentiate biodegradable vs non-biodegradable substances',
          'Explain the process of eutrophication leading to fish mortality in polluted streams',
          'Propose sustainable waste recycling practices for Stanbax school community'
        ],
        keyFormulasOrTerms: ['Eutrophication', 'Biodegradable vs Non-biodegradable', 'The 3Rs: Reduce, Reuse, Recycle'],
        suggestedActivities: 'Designing school waste segregation and plastic recycling bins.'
      },
      {
        week: 11,
        topic: 'Solar System, Earth’s Rotation and Revolution',
        subtopics: ['Sun as center of solar system and eight planets in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune', 'Rotation of the Earth on its axis (24 hours) causing day and night', 'Revolution of the Earth around the Sun (365.25 days) causing seasons', 'Eclipses of the Sun (Solar eclipse) and Moon (Lunar eclipse)'],
        learningObjectives: [
          'List eight planets in order from the sun using mnemonics',
          'Draw diagrams illustrating total and partial solar and lunar eclipses',
          'Explain why we have leap years every four years'
        ],
        keyFormulasOrTerms: ['Umbra (complete shadow) and Penumbra (partial shadow)', 'Rotation = Day & Night; Revolution = Seasons'],
        suggestedActivities: 'Globe and flashlight demonstration of day/night and eclipses.'
      },
      {
        week: 12,
        topic: 'General Revision, BECE Examination Prep & Terminal Examination',
        subtopics: ['Comprehensive review of all 11 weeks of topics', 'BECE past question drills and revision', 'Terminal Examination'],
        learningObjectives: [
          'Synthesize all junior science topics into holistic understanding',
          'Achieve Distinction in terminal exams and BECE mock tests'
        ],
        keyFormulasOrTerms: ['BECE Basic Science Syllabus Guide']
      }
    ]
  }
];
