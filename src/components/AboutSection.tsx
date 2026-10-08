import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Building2, 
  Target, 
  Eye, 
  Award, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight,
  School as SchoolIcon
} from './RealIcons';

interface AboutSectionProps {
  onOpenAdmissions?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAdmissions }) => {
  const { aboutContent, schoolInfo, images } = useSchool();

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={aboutContent.founderPhotoUrl || images.founders || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'}
                alt="Proprietress of Stanbax Schools"
                className="w-full h-[420px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {aboutContent.founderRole || 'Founder & Proprietress'}
                </div>
                <div className="text-lg font-black">{aboutContent.founderName || 'Mrs. Adebisi Folashade Bello'}</div>
                <p className="text-xs text-stone-300 mt-1 italic">
                  "{aboutContent.quote || 'Excellence is not an accident; it is the habit of dedicated mentors and eager minds.'}"
                </p>
              </div>
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-amber-500 text-white p-4 rounded-2xl shadow-xl border-2 border-white flex items-center gap-3">
              <Award className="w-6 h-6 text-white" />
              <div>
                <div className="text-xl font-black leading-none">Est. {aboutContent.establishedYear || '2007'}</div>
                <div className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">Heritage of Impact</div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
              <SchoolIcon className="w-3.5 h-3.5" />
              <span>{aboutContent.badge || 'About Stanbax Schools'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
              {aboutContent.title || 'Building Legacies of Excellence in Ibadan'}
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {aboutContent.description || 'Founded with a profound vision to raise confident, morally sound, and globally competitive scholars, Stanbax Schools provides state-of-the-art facilities and experienced educators in the heart of Oyo State.'}
            </p>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm mb-1">Our Vision</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {aboutContent.vision || 'To be Nigeria’s foremost institution where holistic education inspires future global leaders.'}
                </p>
              </div>

              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-stone-200 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold mb-3">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm mb-1">Our Mission</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {aboutContent.mission || 'To provide world-class, learner-centered education combining academic rigour, technological mastery, and solid moral foundations.'}
                </p>
              </div>
            </div>

            {onOpenAdmissions && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdmissions}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <span>Begin Scholar Enrollment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
