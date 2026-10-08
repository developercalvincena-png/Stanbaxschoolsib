import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  ShieldCheck, 
  Award,
  School,
  HeartHandshake,
  CheckCircle2
} from './RealIcons';
import { useSchool } from '../context/SchoolContext';

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  FlaskConical,
  BookOpen,
  ShieldCheck,
  Award,
  School,
  HeartHandshake,
  CheckCircle2
};

export const KeyPillars: React.FC = () => {
  const { keyPillars, keyPillarsHeader } = useSchool();

  return (
    <section className="py-16 bg-[#FDFBF7] border-b border-[#EAE2CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-neutral-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-red-600" />
            <span>{keyPillarsHeader?.badge || 'The Stanbax Distinction'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            {keyPillarsHeader?.title || 'Why Parents Choose Stanbax Schools Ibadan'}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-2">
            {keyPillarsHeader?.subtitle || 'A tradition of academic excellence, technological fluency, and grounded moral values in the heart of Oyo State.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(keyPillars || []).map((pillar, idx) => {
            const IconComponent = (pillar.iconName && ICON_MAP[pillar.iconName]) || GraduationCap;
            const accentClass = pillar.accent || 'text-amber-400 bg-[#111827]';
            return (
              <div
                key={pillar.id || idx}
                className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 border border-[#EAE2CE] hover:border-red-600 group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${accentClass} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F0EAE0] flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>Pillar 0{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

