import React, { useState } from 'react';
import { Compass, X, CheckCircle2, ArrowRight, BookOpen, GraduationCap } from './RealIcons';

interface CareerAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CareerPathway {
  title: string;
  stream: 'Pure Science' | 'Commercial & Finance' | 'Humanities & Arts' | 'Tech & Engineering';
  utmeSubjects: string[];
  waecSubjects: string[];
  topDestinations: string;
  advice: string;
}

const CAREER_PATHWAYS: Record<string, CareerPathway> = {
  "Medicine & Surgery / Health Sciences": {
    title: "Medicine & Surgery / Health Sciences",
    stream: "Pure Science",
    utmeSubjects: ["English Language", "Biology", "Chemistry", "Physics"],
    waecSubjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics", "Civic Education"],
    topDestinations: "University of Ibadan (UI), OAU Ile-Ife, UNILAG, UK / European Medical Colleges",
    advice: "Maintain a minimum score of 75% in continuous assessment Chemistry and Biology practicals. Focus on Olympiad bio-quizzes."
  },
  "Software Engineering & Artificial Intelligence": {
    title: "Software Engineering & Artificial Intelligence",
    stream: "Tech & Engineering",
    utmeSubjects: ["English Language", "Mathematics", "Physics", "Chemistry / Computer Studies"],
    waecSubjects: ["Mathematics", "English", "Physics", "Chemistry", "Further Maths", "Data Processing"],
    topDestinations: "FUTA, UNILAG, Covenant University, University of Toronto, MIT",
    advice: "Actively join the Stanbax Robotics & AI Club. Master Python programming and data processing algorithms."
  },
  "Law & Jurisprudence": {
    title: "Law & Jurisprudence",
    stream: "Humanities & Arts",
    utmeSubjects: ["English Language", "Literature in English", "Government", "Christian/Islamic Religious Studies"],
    waecSubjects: ["English Language", "Literature in English", "Government", "History", "Civic Education", "Mathematics"],
    topDestinations: "University of Ibadan (UI), UNILAG, Oxford University, Harvard Law",
    advice: "Excel in Model United Nations, school debate championship, and public oratory. Hone critical essay synthesis."
  },
  "Accounting, Finance & Actuarial Science": {
    title: "Accounting, Finance & Actuarial Science",
    stream: "Commercial & Finance",
    utmeSubjects: ["English Language", "Mathematics", "Economics", "Financial Accounting / Commerce"],
    waecSubjects: ["English", "Mathematics", "Economics", "Financial Accounting", "Commerce", "Civic Education"],
    topDestinations: "UNILAG, University of Ibadan, Covenant, London School of Economics (LSE)",
    advice: "Gain strong mastery of Financial Accounting double-entry principles and statistical variance."
  },
  "Architecture & Built Environment": {
    title: "Architecture & Built Environment",
    stream: "Tech & Engineering",
    utmeSubjects: ["English Language", "Physics", "Mathematics", "Technical Drawing / Chemistry"],
    waecSubjects: ["Mathematics", "English", "Physics", "Technical Drawing", "Visual Arts / Chemistry"],
    topDestinations: "Ahmadu Bello University (ABU), UNILAG, OAU, Bartlett UCL",
    advice: "Participate in visual arts sketching and 3D architectural computer-aided design workshops."
  }
};

export const CareerAdvisorModal: React.FC<CareerAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [selectedCareer, setSelectedCareer] = useState<string>("Medicine & Surgery / Health Sciences");

  if (!isOpen) return null;

  const activeData = CAREER_PATHWAYS[selectedCareer];

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
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Senior Secondary Guidance
              </span>
              <h3 className="text-xl sm:text-2xl font-black">Career & Subject Advisor</h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#E5DEC9] mt-2">
            Match your university career aspiration with required WAEC, NECO, and UTME/JAMB subject combinations at Stanbax Schools.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-2">
              Select Desired Career Field
            </label>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-bold focus:ring-2 focus:ring-red-600 bg-white"
            >
              {Object.keys(CAREER_PATHWAYS).map((career) => (
                <option key={career} value={career}>{career}</option>
              ))}
            </select>
          </div>

          {/* Details Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] space-y-5 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE2CE] pb-3">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Recommended Stream</span>
                <span className="text-base font-black text-red-700">{activeData.stream}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-neutral-900 text-amber-300 font-bold text-xs">
                WASSCE & UTME Standard
              </span>
            </div>

            {/* UTME subjects */}
            <div>
              <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block mb-2">
                Required 4 UTME / JAMB Subjects
              </span>
              <div className="flex flex-wrap gap-2">
                {activeData.utmeSubjects.map((sub, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-900 font-bold text-xs">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* WAEC Core subjects */}
            <div>
              <span className="text-xs font-black text-neutral-900 uppercase tracking-wider block mb-2">
                Core WAEC / NECO O'Level Subjects
              </span>
              <div className="flex flex-wrap gap-2">
                {activeData.waecSubjects.map((sub, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-white border border-[#EAE2CE] text-neutral-800 font-semibold text-xs shadow-sm">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* University Destinations */}
            <div className="pt-2 border-t border-[#EAE2CE]">
              <span className="text-[11px] font-bold text-neutral-500 uppercase block">Top Higher Institutions:</span>
              <p className="text-xs font-bold text-neutral-800 mt-0.5">{activeData.topDestinations}</p>
            </div>

            {/* Advice */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed">
              <strong className="text-red-700">Counselor's Tip:</strong> {activeData.advice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
