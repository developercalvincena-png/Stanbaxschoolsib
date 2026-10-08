import React, { useState } from 'react';
import { TUITION_SCHEDULE } from '../data/schoolData';
import { useSchool } from '../context/SchoolContext';
import { Calculator, X, Check, ArrowRight, ShieldCheck } from './RealIcons';

interface TuitionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToApply: () => void;
}

export const TuitionCalculatorModal: React.FC<TuitionCalculatorModalProps> = ({
  isOpen,
  onClose,
  onProceedToApply,
}) => {
  const { classes } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState<string>(() => classes[2]?.id || classes[0]?.id || 'cls-3');
  const [includeUniform, setIncludeUniform] = useState<boolean>(true);
  const [includeBooks, setIncludeBooks] = useState<boolean>(true);
  const [includeTech, setIncludeTech] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentSelectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const baseTuition = currentSelectedClass ? currentSelectedClass.tuitionPerTerm : 250000;
  const uniformFee = includeUniform ? TUITION_SCHEDULE.addons.uniformSet["Full School Uniform + Sports Wear (2 pairs)"] : 0;
  const bookFee = includeBooks ? TUITION_SCHEDULE.addons.textbookPack["Standard Ministry Approved Textbook Pack"] : 0;
  const techFee = includeTech ? TUITION_SCHEDULE.addons.techFee["Robotics, ICT & Science Lab Consumables"] : 0;

  const totalEstimate = baseTuition + uniformFee + bookFee + techFee;

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#EAE2CE] my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] p-6 sm:p-7 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Transparent School Billing
              </span>
              <h3 className="text-xl sm:text-2xl font-black">Interactive Tuition & Fee Estimator</h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#E5DEC9] mt-2">
            Calculate exact termly estimates for Stanbax Schools Ibadan according to your child's grade level and optional services.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Grade selection */}
          <div>
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-2">
              1. Select Academic Class / Key Stage
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    selectedClassId === cls.id
                      ? 'border-red-700 bg-red-50 text-red-950 ring-1 ring-red-700 font-bold'
                      : 'border-[#EAE2CE] hover:border-amber-400 text-neutral-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{cls.name}</span>
                    <span className="text-[10px] text-neutral-500">{cls.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-700">
                    {formatNaira(cls.tuitionPerTerm)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Add-ons */}
          <div className="space-y-3">
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider">
              2. Optional Academic Add-ons & Materials
            </label>

            {/* Checkbox add-ons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-3 rounded-xl bg-[#FAF7EE] border border-[#EAE2CE] flex items-center gap-3 cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={includeUniform}
                  onChange={(e) => setIncludeUniform(e.target.checked)}
                  className="w-4 h-4 text-red-700 rounded border-[#EAE2CE] focus:ring-red-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 block">Uniforms & Sports Kit</span>
                  <span className="text-neutral-500 font-mono">{formatNaira(35000)} (Entry pack)</span>
                </div>
              </label>

              <label className="p-3 rounded-xl bg-[#FAF7EE] border border-[#EAE2CE] flex items-center gap-3 cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={includeBooks}
                  onChange={(e) => setIncludeBooks(e.target.checked)}
                  className="w-4 h-4 text-red-700 rounded border-[#EAE2CE] focus:ring-red-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 block">Ministry Textbook Pack</span>
                  <span className="text-neutral-500 font-mono">{formatNaira(45000)}</span>
                </div>
              </label>

              <label className="p-3 rounded-xl bg-[#FAF7EE] border border-[#EAE2CE] flex items-center gap-3 cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={includeTech}
                  onChange={(e) => setIncludeTech(e.target.checked)}
                  className="w-4 h-4 text-red-700 rounded border-[#EAE2CE] focus:ring-red-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-neutral-900 block">Robotics & Lab Levy</span>
                  <span className="text-neutral-500 font-mono">{formatNaira(25000)} / term</span>
                </div>
              </label>
            </div>
          </div>

          {/* Grand Total Highlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Estimated Term Total
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {formatNaira(totalEstimate)}
              </p>
              <p className="text-[11px] text-[#E5DEC9]">
                Includes all selected tuition, academic registrations, and learning materials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToApply();
              }}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
