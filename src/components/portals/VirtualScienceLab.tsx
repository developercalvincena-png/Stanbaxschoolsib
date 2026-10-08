import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  Sliders,
  Play,
  Pause
} from '../RealIcons';

export const VirtualScienceLab: React.FC = () => {
  const [activeExperiment, setActiveExperiment] = useState<'titration' | 'pendulum' | 'photosynthesis'>('titration');

  // Titration Experiment State
  const [acidVolume, setAcidVolume] = useState<number>(0);
  const equivalencePoint = 25.0; // cm³
  const isNeutralized = Math.abs(acidVolume - equivalencePoint) < 0.3;
  const isOverTitrated = acidVolume > equivalencePoint;
  
  // Calculate flask color
  const getFlaskColorClass = () => {
    if (acidVolume < 24.5) return 'bg-pink-500/80';
    if (acidVolume >= 24.5 && acidVolume < 25.0) return 'bg-pink-300/80';
    return 'bg-blue-100/40 border border-blue-200'; // Colorless endpoint
  };

  // Pendulum Experiment State
  const [pendulumLengthCm, setPendulumLengthCm] = useState<number>(60);
  const [isSwinging, setIsSwinging] = useState<boolean>(false);
  const [recordedOscillations, setRecordedOscillations] = useState<number>(20);
  const gConstant = 9.81;
  const lengthMeters = pendulumLengthCm / 100;
  const periodT = 2 * Math.PI * Math.sqrt(lengthMeters / gConstant);
  const totalTimeFor20 = periodT * recordedOscillations;

  // Photosynthesis Step State
  const [photoStep, setPhotoStep] = useState<number>(1);

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>WAEC WASSCE & Cambridge Practical Laboratory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Virtual Science Practical Simulator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Simulate laboratory experiments in Chemistry, Physics, and Biology. Master practical skills, data collation, and error precautions for external distinction grades.
          </p>
        </div>

        {/* Experiment Switcher Tabs */}
        <div className="flex flex-wrap gap-2 text-xs shrink-0">
          {[
            { id: 'titration', label: 'Chemistry: Acid-Base Titration' },
            { id: 'pendulum', label: 'Physics: Simple Pendulum' },
            { id: 'photosynthesis', label: 'Biology: Starch Iodine Test' }
          ].map(exp => (
            <button
              key={exp.id}
              type="button"
              onClick={() => setActiveExperiment(exp.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                activeExperiment === exp.id
                  ? 'bg-amber-400 text-neutral-950 font-black shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </div>

      {/* EXPERIMENT 1: ACID-BASE TITRATION */}
      {activeExperiment === 'titration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-5">
            <h3 className="font-black text-xs text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
              Titration Controls and Reagents
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-500 block text-[10px] uppercase">Titrant in Burette</span>
                <span className="font-black text-neutral-900 text-sm">0.100 mol/dm³ Hydrochloric Acid (HCl)</span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-500 block text-[10px] uppercase">Analyte in Conical Flask</span>
                <span className="font-black text-neutral-900 text-sm">25.0 cm³ Sodium Hydroxide (NaOH)</span>
                <span className="text-[11px] text-pink-700 font-bold block mt-0.5">Indicator: 2 drops Phenolphthalein</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-2">
                <span>Burette Tap Volume Delivered:</span>
                <span className="font-mono font-black text-blue-700 text-sm">{acidVolume.toFixed(1)} cm³</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="0.1"
                value={acidVolume}
                onChange={(e) => setAcidVolume(parseFloat(e.target.value))}
                className="w-full accent-blue-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                <span>0.0 cm³ (Initial)</span>
                <span>25.0 cm³ (Equivalence)</span>
                <span>35.0 cm³ (Excess)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAcidVolume(0)}
                className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Burette to 0.00 cm³</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] text-xs space-y-1.5">
              <span className="font-black text-amber-900 uppercase text-[10px] block">WAEC Chemistry Precautions:</span>
              <p className="text-neutral-700 leading-relaxed text-[11px]">
                Ensure burette jet is free of air bubbles before taking initial reading. Rinse conical flask with distilled water only. Swirl flask continuously during acid addition.
              </p>
            </div>
          </div>

          {/* Flask Apparatus Display */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h4 className="font-black text-base text-neutral-950">Laboratory Apparatus and Solution Reaction</h4>
                <p className="text-xs text-neutral-500">Phenolphthalein Indicator Endpoint Transition</p>
              </div>

              <div>
                {isNeutralized ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300 flex items-center gap-1.5 animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Exact End-Point Reached (25.0 cm³)</span>
                  </span>
                ) : isOverTitrated ? (
                  <span className="px-3 py-1 rounded-full bg-neutral-200 text-neutral-700 font-bold text-xs">
                    Solution Acidic (Excess Titrant Added)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 font-bold text-xs">
                    Alkaline State (Deep Pink Solution)
                  </span>
                )}
              </div>
            </div>

            {/* Simulated Glassware */}
            <div className="flex items-center justify-center py-6">
              <div className="w-48 p-4 rounded-3xl bg-neutral-50 border border-neutral-200 flex flex-col items-center shadow-xs">
                {/* Burette tip */}
                <div className="w-3 h-16 bg-blue-100 border border-blue-300 rounded-b-md relative">
                  <div className="w-1 h-full bg-blue-400 mx-auto" />
                </div>
                {/* Droplet animation */}
                <div className="w-2 h-2 rounded-full bg-blue-500 my-2 animate-bounce" />
                {/* Flask */}
                <div className="w-36 h-40 rounded-b-3xl rounded-t-lg border-2 border-neutral-400 bg-white p-2 flex flex-col justify-end shadow-inner relative overflow-hidden">
                  <div className={`w-full rounded-b-2xl transition-all duration-300 h-24 ${getFlaskColorClass()}`} />
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-neutral-500">
                    250 cm³ Flask
                  </span>
                </div>
                <span className="text-xs font-bold text-neutral-700 mt-3 text-center">
                  Conical Flask Analyte
                </span>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Reaction Ratio</span>
                <span className="font-mono font-bold text-neutral-900">HCl + NaOH → NaCl + H₂O (1:1)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Calculated Titre (Va)</span>
                <span className="font-mono font-bold text-blue-700">{acidVolume.toFixed(2)} cm³</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Calculated Base Molarity (Cb)</span>
                <span className="font-mono font-bold text-emerald-700">
                  {acidVolume > 0 ? ((0.1 * acidVolume) / 25).toFixed(4) : '0.0000'} mol/dm³
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIMENT 2: SIMPLE PENDULUM */}
      {activeExperiment === 'pendulum' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-5">
            <h3 className="font-black text-xs text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
              Apparatus Dimensions & Oscillations
            </h3>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-2">
                <span>Thread Length L:</span>
                <span className="font-mono font-black text-blue-700 text-sm">{pendulumLengthCm} cm</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={pendulumLengthCm}
                onChange={(e) => setPendulumLengthCm(parseInt(e.target.value))}
                className="w-full accent-blue-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                <span>20 cm</span>
                <span>60 cm</span>
                <span>100 cm</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-2">
                <span>Number of Swings (n):</span>
                <span className="font-mono font-black text-neutral-900 text-sm">{recordedOscillations} oscillations</span>
              </div>
              <div className="flex gap-2">
                {[10, 20, 30].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRecordedOscillations(n)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      recordedOscillations === n ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSwinging(!isSwinging)}
                className={`w-full py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isSwinging ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isSwinging ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSwinging ? 'Stop Oscillation Simulation' : 'Release Pendulum Bob'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] text-xs space-y-1.5">
              <span className="font-black text-amber-900 uppercase text-[10px] block">Physics Formula:</span>
              <p className="font-mono text-neutral-900 text-[11px]">T = 2π√(L / g)</p>
              <p className="text-neutral-700 text-[11px] leading-relaxed">
                Slope of T² against L equals 4π²/g. Acceleration due to gravity is calculated as g = 4π² / slope.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-6">
            <div className="border-b border-neutral-100 pb-3">
              <h4 className="font-black text-base text-neutral-950">Harmonic Motion Observation</h4>
              <p className="text-xs text-neutral-500">Real-Time Period Measurement & Gravity Deduction</p>
            </div>

            {/* Pendulum Visual */}
            <div className="flex flex-col items-center justify-center h-48 py-4">
              <div className="w-24 h-2 bg-neutral-800 rounded-full" />
              <div 
                className={`w-0.5 bg-neutral-600 origin-top transition-transform ${
                  isSwinging ? 'animate-[pulse_1s_ease-in-out_infinite]' : ''
                }`}
                style={{ height: `${pendulumLengthCm * 1.3}px` }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-700 -ml-2.5 mt-full shadow-md" />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Length (L)</span>
                <span className="font-mono font-bold text-neutral-900">{lengthMeters.toFixed(2)} m</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Single Period (T)</span>
                <span className="font-mono font-bold text-blue-700">{periodT.toFixed(3)} s</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Time for {recordedOscillations} Swings</span>
                <span className="font-mono font-bold text-purple-700">{totalTimeFor20.toFixed(2)} s</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 block">Computed g</span>
                <span className="font-mono font-bold text-emerald-700">9.81 m/s²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIMENT 3: PHOTOSYNTHESIS */}
      {activeExperiment === 'photosynthesis' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-3">
            <h4 className="font-black text-base text-neutral-950">Biology Practical: Testing a Green Leaf for Starch</h4>
            <p className="text-xs text-neutral-500">Four-Stage Laboratory Protocol for WAEC and Cambridge IGCSE Biology</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { step: 1, title: '1. Boil in Water', desc: 'Kills leaf cells and stops enzymatic chemical reactions.' },
              { step: 2, title: '2. Ethanol Water Bath', desc: 'Dissolves and removes green chlorophyll pigment.' },
              { step: 3, title: '3. Warm Water Rinse', desc: 'Softens the brittle leaf following alcohol extraction.' },
              { step: 4, title: '4. Iodine Drops', desc: 'Blue-black color confirms presence of synthesized starch.' }
            ].map(s => (
              <button
                key={s.step}
                type="button"
                onClick={() => setPhotoStep(s.step)}
                className={`p-4 rounded-2xl text-left border transition cursor-pointer ${
                  photoStep === s.step 
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <span className="font-black text-xs text-neutral-900 block">{s.title}</span>
                <span className="text-[11px] text-neutral-500 mt-1 block leading-relaxed">{s.desc}</span>
              </button>
            ))}
          </div>

          {/* Demonstration Viewer */}
          <div className="p-6 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Current Demonstration Stage {photoStep} of 4
              </span>
              <h5 className="text-lg font-black text-neutral-950">
                {photoStep === 1 && 'Boiling leaf in beaker of water over Bunsen flame'}
                {photoStep === 2 && 'De-colorizing leaf in boiling tube of ethanol (water bath precaution)'}
                {photoStep === 3 && 'Softening pale leaf in warm water prior to chemical indicator'}
                {photoStep === 4 && 'Flooding leaf on white tile with Iodine Solution (Potassium Iodide)'}
              </h5>
              <p className="text-xs text-neutral-700 max-w-lg leading-relaxed">
                {photoStep === 1 && 'The high temperature denatures enzymes and ruptures cellular membranes, making the leaf permeable to staining reagents.'}
                {photoStep === 2 && 'Safety Precaution: Never heat ethanol directly over a naked flame as it is highly flammable; always use a hot water bath.'}
                {photoStep === 3 && 'The alcohol treatment renders the leaf brittle. The warm rinse restores flexibility so it can spread flat.'}
                {photoStep === 4 && 'Result: The unmasked leaf turns intense blue-black where photosynthesis occurred in sunlight, confirming starch storage.'}
              </p>
            </div>

            <div className="w-32 h-32 rounded-2xl bg-white border border-[#EAE2CE] p-4 flex flex-col items-center justify-center shadow-xs shrink-0">
              <div className={`w-20 h-20 rounded-full transition-colors duration-500 flex items-center justify-center font-black text-xs ${
                photoStep === 1 ? 'bg-emerald-600 text-white' :
                photoStep === 2 ? 'bg-amber-100 text-amber-800' :
                photoStep === 3 ? 'bg-neutral-100 text-neutral-600' :
                'bg-indigo-950 text-white'
              }`}>
                {photoStep === 4 ? 'Blue-Black' : photoStep === 2 ? 'Pale' : 'Green Leaf'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
