import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Award, 
  Download, 
  Printer, 
  ChevronRight,
  ShieldCheck,
  Filter
} from '../RealIcons';

interface CurriculumWeekItem {
  week: number;
  topic: string;
  nerdcMilestone: string;
  waecFocus: string;
  cambridgeCode: string;
  cambridgeObjective: string;
  practicalLab: string;
  assessmentCheckpoint: string;
}

const DUAL_CURRICULUM_DATA: Record<string, CurriculumWeekItem[]> = {
  'Mathematics': [
    {
      week: 1,
      topic: 'Quadratic Equations & Parabolic Modeling',
      nerdcMilestone: 'Factorization, completing the square method, and quadratic formula application.',
      waecFocus: 'Section B multi-step calculations & word problems involving discriminant analysis.',
      cambridgeCode: '0580 / Paper 2 & 4',
      cambridgeObjective: 'Solving equations with real roots, graphical roots approximation, vertex form.',
      practicalLab: 'Graphing parabolic trajectories in Python code using NumPy & matplotlib in STEM lab.',
      assessmentCheckpoint: 'Weekly Diagnostic Test & Formula Speed Drill'
    },
    {
      week: 2,
      topic: 'Simultaneous Equations (Linear & Non-Linear)',
      nerdcMilestone: 'Elimination and substitution methods with geometric line-curve intersection.',
      waecFocus: 'Simultaneous word problems relating to commercial business transactions in Naira.',
      cambridgeCode: '0580 / Extended Algebra',
      cambridgeObjective: 'Algebraic manipulation with fractions, graphical intersection verification.',
      practicalLab: 'Modeling breakeven point simulations for campus enterprise projects.',
      assessmentCheckpoint: 'Speed Worksheet & Peer Problem Swap'
    },
    {
      week: 3,
      topic: 'Coordinate Geometry & Straight Line Slopes',
      nerdcMilestone: 'Gradient of lines, distance between coordinates, parallel and perpendicular slopes.',
      waecFocus: 'Equations of normal and tangent lines to standard linear loci.',
      cambridgeCode: '0580 / Coordinate Geometry',
      cambridgeObjective: 'Calculating midpoints, length of line segment, perpendicular bisectors.',
      practicalLab: 'GPS coordinate mapping of school campus layout using digital surveying tool.',
      assessmentCheckpoint: 'Cambridge Checkpoint Timed Quiz'
    },
    {
      week: 4,
      topic: 'Trigonometry & Bearings in Three Dimensions',
      nerdcMilestone: 'Sine rule, cosine rule, bearings from true North, angles of elevation and depression.',
      waecFocus: 'Standard navigation problems involving multi-point ship and aircraft bearings.',
      cambridgeCode: '0580 / Trigonometric Functions',
      cambridgeObjective: 'Sine and cosine curves, exact values of standard angles, 3D triangular trigonometry.',
      practicalLab: 'Constructing optical clinometers to calculate flagpole height across the quadrangle.',
      assessmentCheckpoint: 'Comprehensive Mid-Term Continuous Assessment 1'
    },
    {
      week: 5,
      topic: 'Circle Theorems & Geometric Deductions',
      nerdcMilestone: 'Angle subtended at center is twice that at circumference, cyclic quadrilaterals, alternate segment.',
      waecFocus: 'Formal geometric proofs with justification statements in examination format.',
      cambridgeCode: '0580 / Geometry of Circles',
      cambridgeObjective: 'Tangents to circle, chords, angles in same segment, rigorous geometric reasoning.',
      practicalLab: 'Dynamic geometry modeling using GeoGebra on student Chromebooks.',
      assessmentCheckpoint: 'Theorem Proof Flashcard Evaluation'
    },
    {
      week: 6,
      topic: 'Statistics, Cumulative Frequency & Ogive Curves',
      nerdcMilestone: 'Grouped frequency distribution, mean, median, mode, cumulative frequency ogives.',
      waecFocus: 'Interquartile range calculation and percentiles read from graph sheets.',
      cambridgeCode: '0580 / Handling Data',
      cambridgeObjective: 'Box-and-whisker plots, standard deviation basics, probability distributions.',
      practicalLab: 'Analyzing actual school biometric attendance datasets in Excel spreadsheets.',
      assessmentCheckpoint: 'Mid-Term Examination Simulation'
    }
  ],
  'Physics': [
    {
      week: 1,
      topic: 'Projectile Motion & Trajectory Dynamics',
      nerdcMilestone: 'Equations of uniform acceleration, horizontal and vertical components, maximum height, range.',
      waecFocus: 'Derivation of time of flight formula and calculation of launch velocity.',
      cambridgeCode: '0625 / Mechanics Core',
      cambridgeObjective: 'Vectors and scalars, resolving velocity vectors at angle theta, air resistance effect.',
      practicalLab: 'Launching precision steel ball bearings through photogate sensors in physics laboratory.',
      assessmentCheckpoint: 'Lab Report Write-up & Error Calculation'
    },
    {
      week: 2,
      topic: 'Newtonian Laws & Linear Momentum Conservation',
      nerdcMilestone: 'Impulse, elastic and inelastic collisions, recoil velocity of projectiles.',
      waecFocus: 'Action-reaction pairs, frictional resistance on horizontal and inclined planes.',
      cambridgeCode: '0625 / Forces and Motion',
      cambridgeObjective: 'Momentum calculation, free-body diagrams, terminal velocity in viscous fluids.',
      practicalLab: 'Air track glider collisions measured with digital ultrasonic motion detectors.',
      assessmentCheckpoint: 'Derivation Test on Momentum Conservation'
    },
    {
      week: 3,
      topic: 'Thermal Physics & Heat Capacity Calorimetry',
      nerdcMilestone: 'Specific heat capacity of metals and liquids, latent heat of fusion and vaporization.',
      waecFocus: 'Electrical method and mixture method calorimetry calculations with heat loss compensation.',
      cambridgeCode: '0625 / Thermal Physics',
      cambridgeObjective: 'Kinetic particle model of matter, evaporation dynamics, thermal radiation emission.',
      practicalLab: 'Calorimeter determination of specific heat capacity of brass and copper samples.',
      assessmentCheckpoint: 'Practical Physics Data Analysis Test'
    }
  ],
  'Computer Science': [
    {
      week: 1,
      topic: 'Data Representation & Hexadecimal Systems',
      nerdcMilestone: 'Binary, octal, decimal, and hexadecimal conversions; ASCII vs Unicode character encoding.',
      waecFocus: 'Binary arithmetic, two\'s complement signed numbers, logic gate truth tables.',
      cambridgeCode: '0478 / Data Representation',
      cambridgeObjective: 'Media representation (bitmaps, sound sampling rate, lossy vs lossless compression).',
      practicalLab: 'Hex editor examination of audio and image files to inspect raw file headers.',
      assessmentCheckpoint: 'Timed Binary Conversion Speed Test'
    },
    {
      week: 2,
      topic: 'Algorithms, Flowcharts & Pseudocode Mastery',
      nerdcMilestone: 'Linear search, binary search, bubble sort algorithms with structured flowchart symbols.',
      waecFocus: 'Writing dry runs and trace tables for iterative loops and conditional branches.',
      cambridgeCode: '0478 / Algorithm Design',
      cambridgeObjective: 'Standard pseudocode syntax, validation checks (range, format, length, presence).',
      practicalLab: 'Coding binary search algorithms in Python and benchmarking execution cycles.',
      assessmentCheckpoint: 'Algorithm Trace Table Exam Challenge'
    }
  ]
};

export const DualCurriculumMatrix: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [viewMode, setViewMode] = useState<'integrated' | 'nerdc' | 'cambridge'>('integrated');

  const currentWeeks = DUAL_CURRICULUM_DATA[selectedSubject] || DUAL_CURRICULUM_DATA['Mathematics'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Dual British-Nigerian Curriculum Crosswalk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Scheme-of-Work Alignment Matrix
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Simultaneously maps Nigerian NERDC standards (WAEC / NECO / BECE) to Cambridge International frameworks (IGCSE / Checkpoint), ensuring complete dual-examination readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Curriculum Map</span>
          </button>
        </div>
      </div>

      {/* Subject and View Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
        {/* Subject buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {Object.keys(DUAL_CURRICULUM_DATA).map(subject => (
            <button
              key={subject}
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                selectedSubject === subject
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('integrated')}
            className={`px-3 py-1.5 rounded-lg font-black transition cursor-pointer ${
              viewMode === 'integrated' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Integrated Dual View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('nerdc')}
            className={`px-3 py-1.5 rounded-lg font-black transition cursor-pointer ${
              viewMode === 'nerdc' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            NERDC / WAEC
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cambridge')}
            className={`px-3 py-1.5 rounded-lg font-black transition cursor-pointer ${
              viewMode === 'cambridge' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cambridge Framework
          </button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-xs text-neutral-900 uppercase tracking-wider">
              {selectedSubject} Comprehensive Term Syllabus Matrix
            </h3>
          </div>
          <span className="text-[11px] font-bold text-neutral-500">
            {currentWeeks.length} Weeks Verified
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {currentWeeks.map((item) => (
            <div key={item.week} className="p-5 hover:bg-neutral-50/70 transition space-y-4">
              {/* Header row: Week and Topic */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                    W{item.week}
                  </span>
                  <div>
                    <h4 className="font-black text-sm text-neutral-900">{item.topic}</h4>
                    <span className="text-[11px] text-neutral-500">Assessment: {item.assessmentCheckpoint}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                    WAEC Aligned
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-[10px] font-black uppercase">
                    {item.cambridgeCode}
                  </span>
                </div>
              </div>

              {/* Grid content according to viewMode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* NERDC / WAEC Milestone Card */}
                {(viewMode === 'integrated' || viewMode === 'nerdc') && (
                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-black text-amber-900 uppercase tracking-wider">
                      <span>Nigerian NERDC & WAEC Standard</span>
                      <span className="text-amber-700">National Benchmark</span>
                    </div>
                    <p className="text-neutral-800 font-semibold leading-relaxed">
                      {item.nerdcMilestone}
                    </p>
                    <div className="pt-2 border-t border-[#EAE2CE] text-[11px] text-neutral-600">
                      <strong className="text-neutral-900">WAEC Exam Target:</strong> {item.waecFocus}
                    </div>
                  </div>
                )}

                {/* Cambridge International Card */}
                {(viewMode === 'integrated' || viewMode === 'cambridge') && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-black text-blue-950 uppercase tracking-wider">
                      <span>Cambridge International Framework</span>
                      <span className="text-blue-700 font-mono">{item.cambridgeCode}</span>
                    </div>
                    <p className="text-neutral-800 font-semibold leading-relaxed">
                      {item.cambridgeObjective}
                    </p>
                    <div className="pt-2 border-t border-blue-200 text-[11px] text-neutral-600">
                      <strong className="text-neutral-900">Lab & STEM Activity:</strong> {item.practicalLab}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
