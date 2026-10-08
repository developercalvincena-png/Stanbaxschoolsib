import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Sparkles, 
  Star, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Flame,
  ShieldCheck,
  X
} from './RealIcons';

export interface AchievementItem {
  id: string;
  title: string;
  studentName: string;
  grade: string;
  year: string;
  category: 'olympiad' | 'cambridge' | 'stem' | 'literary';
  competition: string;
  awardTier: 'Gold' | 'Top in Nigeria' | '1st Place' | 'State Champion' | 'Silver' | 'Distinction Citation';
  description: string;
  impactTag: string;
  imageUrl: string;
  mentor: string;
  details: string;
}

export const STUDENT_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'National Mathematics Olympiad Gold Medal',
    studentName: 'Femi Adebayo',
    grade: 'Senior Secondary (SSS 2)',
    year: '2026',
    category: 'olympiad',
    competition: 'National Mathematical Centre (NMC), Abuja',
    awardTier: 'Gold',
    description: 'Secured first place nationwide out of over 14,000 secondary school candidates with a perfect score in Advanced Geometry and Number Theory.',
    impactTag: 'Top 0.01% Nationwide',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    mentor: 'Dr. A. O. Adeleke (Head of Mathematics)',
    details: 'Femi completed the three-stage rigorous national evaluation hosted across 36 states, finishing with highest composite score in the final Abuja residential camp.'
  },
  {
    id: 'ach-2',
    title: 'Cambridge Outstanding Learner Award (Top in Nigeria)',
    studentName: 'Zainab Adeleke',
    grade: 'Senior Secondary (SSS 3)',
    year: '2025',
    category: 'cambridge',
    competition: 'Cambridge Assessment International Education / British Council',
    awardTier: 'Top in Nigeria',
    description: 'Recognized as the highest-scoring candidate across the Federation of Nigeria in Cambridge IGCSE Biology and Information & Communication Technology.',
    impactTag: 'British Council Citation',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    mentor: 'Mrs. Folashade Okon (Senior Cambridge Lead)',
    details: 'Zainab received the ceremonial Cambridge Learner Plaque in Lagos for securing 9 A* distinctions with consecutive 98% raw marks in scientific practicals.'
  },
  {
    id: 'ach-3',
    title: 'STAN National STEM Robotics and AI Innovation Fair (1st Place)',
    studentName: 'Stanbax Junior Robotics Squad',
    grade: 'JSS 2 to SSS 1 Collaborative Team',
    year: '2026',
    category: 'stem',
    competition: 'Science Teachers Association of Nigeria (STAN) National Finals',
    awardTier: '1st Place',
    description: 'Constructed an autonomous solar-powered crop-monitoring drone equipped with computer vision to assist local agricultural farms in Oyo State.',
    impactTag: 'National Innovation Trophy',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    mentor: 'Engr. K. Balogun (STEM & Robotics Coordinator)',
    details: 'The team programmed Arduino microcontrollers and utilized Python computer vision algorithms trained inside our Stanbax Digital Computing Lab.'
  },
  {
    id: 'ach-4',
    title: 'Cowbellpedia Secondary Schools Mathematics Champion',
    studentName: 'Tobi Ogundipe',
    grade: 'Junior Secondary (JSS 3)',
    year: '2025',
    category: 'olympiad',
    competition: 'Cowbellpedia National TV Mathematics Tournament',
    awardTier: 'State Champion',
    description: 'Emerged as the overall Oyo State Champion and advanced to the National Grand Finale with lightning 3.2-second mental math calculation speeds.',
    impactTag: 'Statewide 1st Rank',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    mentor: 'Mr. Emmanuel Babatunde (Junior Mathematics Coach)',
    details: 'Tobi answered 18 consecutive mental algebra problems under timed buzzer pressure without pen or paper during the televised Southwest regional qualifiers.'
  },
  {
    id: 'ach-5',
    title: 'WAEC WASSCE 9 A1s Academic Laureate Citation',
    studentName: 'Chidera Okonkwo',
    grade: 'Graduating Scholar (Class of 2025)',
    year: '2025',
    category: 'cambridge',
    competition: 'West African Examinations Council (WAEC)',
    awardTier: 'Distinction Citation',
    description: 'Attained straight A1 distinctions across all 9 registered subjects including Further Mathematics, Physics, Chemistry, and English Language.',
    impactTag: '100% Distinctions',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    mentor: 'Mrs. Bello (Principal & Head of Administration)',
    details: 'Chidera secured university scholarship admissions across multiple top tier institutions and is currently pursuing Aerospace Engineering.'
  },
  {
    id: 'ach-6',
    title: 'Southwest Inter-Schools Debate & Model United Nations Gold',
    studentName: 'Stanbax Debate Society',
    grade: 'Senior Secondary Delegation',
    year: '2026',
    category: 'literary',
    competition: 'Southwest Scholastic Model UN Conference, Ibadan',
    awardTier: 'Gold',
    description: 'Won Best Delegation and Outstanding Position Paper for articulating regional economic and renewable energy solutions for developing economies.',
    impactTag: 'Best Delegation Award',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
    mentor: 'Mr. O. Daramola (Civics & International Relations)',
    details: 'The delegation defeated 32 participating secondary schools through persuasive parliamentary procedure, policy drafting, and extemporaneous rebuttal.'
  },
  {
    id: 'ach-7',
    title: 'National Spelling Bee Championship (Southwest Finalist)',
    studentName: 'Amina Bello',
    grade: 'Primary School (Basic 5)',
    year: '2026',
    category: 'literary',
    competition: 'Nigeria National Spelling Bee Federation',
    awardTier: 'Silver',
    description: 'Mastered 3,500 advanced etymology and Latin-Greek derived words, securing second place in the fiercely contested Southwest zonal finals.',
    impactTag: 'Junior Scholar Honors',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    mentor: 'Mrs. C. Adegoke (Head of Primary Literacy)',
    details: 'Amina correctly articulated complex biological terms and archaic historical terms under strict 60-second timer intervals.'
  },
  {
    id: 'ach-8',
    title: 'Mathematical Association of Nigeria (MAN) Senior Cup',
    studentName: 'Ifeanyi Eze',
    grade: 'Senior Secondary (SSS 1)',
    year: '2025',
    category: 'olympiad',
    competition: 'Mathematical Association of Nigeria Annual Olympiad',
    awardTier: 'Gold',
    description: 'Awarded first position in the Oyo State Senior Category for inventive proofs in coordinate geometry and trigonometric identities.',
    impactTag: 'State Gold Medalist',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    mentor: 'Mr. P. Alabi (Senior Mathematics Fellow)',
    details: 'Ifeanyi demonstrated novel geometric constructions that were commended by university professors serving on the MAN judging panel.'
  }
];

export const StudentAchievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'olympiad' | 'cambridge' | 'stem' | 'literary'>('all');
  const [activeModalItem, setActiveModalItem] = useState<AchievementItem | null>(null);

  const filteredItems = selectedCategory === 'all' 
    ? STUDENT_ACHIEVEMENTS 
    : STUDENT_ACHIEVEMENTS.filter(item => item.category === selectedCategory);

  const getTierBadgeColor = (tier: AchievementItem['awardTier']) => {
    switch (tier) {
      case 'Gold':
      case 'Top in Nigeria':
        return 'bg-amber-100 text-amber-950 border-amber-300';
      case '1st Place':
      case 'State Champion':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300';
      case 'Distinction Citation':
        return 'bg-blue-100 text-blue-950 border-blue-300';
      default:
        return 'bg-purple-100 text-purple-950 border-purple-300';
    }
  };

  return (
    <section id="achievements" className="py-20 bg-[#FAF7EE] border-b border-[#EAE2CE] font-['Nunito',sans-serif] relative overflow-hidden">
      {/* Decorative background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Academic Honors and Competition Wins</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Distinction in Action: Stanbax Scholar Achievements
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-3 leading-relaxed">
            Our scholars consistently place at the very pinnacle of state, national, and international academic contests. Explore recent Olympiad gold medals, Cambridge citations, and STEM innovation trophies.
          </p>
        </div>

        {/* Milestone Key Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs text-center transform hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">48+</div>
            <div className="text-xs font-bold text-neutral-600 mt-0.5">National and State Trophies</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs text-center transform hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">100%</div>
            <div className="text-xs font-bold text-neutral-600 mt-0.5">Distinction Pass in External Exams</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs text-center transform hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-xs">
              <Medal className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">16</div>
            <div className="text-xs font-bold text-neutral-600 mt-0.5">Cambridge Outstanding Honors</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs text-center transform hover:-translate-y-1 transition duration-200">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-2 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">1st Place</div>
            <div className="text-xs font-bold text-neutral-600 mt-0.5">STAN National STEM Robotics Fair</div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'All Achievements' },
            { id: 'olympiad', label: 'Mathematics Olympiads' },
            { id: 'cambridge', label: 'Cambridge and WAEC Distinctions' },
            { id: 'stem', label: 'STEM and Robotics' },
            { id: 'literary', label: 'Debate and Literacy' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-[#EAE2CE] hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievement Cards Grid with Dynamic Hover Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EAE2CE] shadow-xs hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-2 relative"
            >
              {/* Header Image with subtle zoom on card hover */}
              <div className="relative h-48 overflow-hidden bg-neutral-900">
                <img
                  src={item.imageUrl}
                  alt={item.studentName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                
                {/* Award Tier Badge Ribbon */}
                <div className="absolute top-3.5 left-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm flex items-center gap-1 ${getTierBadgeColor(item.awardTier)}`}>
                    <Trophy className="w-3 h-3" />
                    <span>{item.awardTier}</span>
                  </span>
                </div>

                {/* Year Pill */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                    {item.year}
                  </span>
                </div>

                {/* Bottom Overlay Info on Photo */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                  <span className="text-[11px] font-extrabold text-amber-300 block tracking-wide">
                    {item.impactTag}
                  </span>
                  <div className="text-base font-black truncate">{item.studentName}</div>
                  <div className="text-[11px] text-neutral-300">{item.grade}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-neutral-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span className="truncate">{item.competition}</span>
                  </div>
                  <h3 className="font-black text-neutral-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed mt-2 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Mentor and Action trigger */}
                <div className="pt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-neutral-500">
                    <span className="font-semibold block text-[10px] uppercase text-neutral-400">Coach / Mentor</span>
                    <span className="font-bold text-neutral-700 truncate max-w-[170px] block">{item.mentor}</span>
                  </div>
                  <span className="font-black text-red-700 text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Citation</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-14 bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Nurturing Championship Minds</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Do You Want Your Child to Achieve Academic Distinction?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Admissions for the upcoming academic session are currently in progress. Schedule an entrance screening test or consult with our academic deans.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs sm:text-sm shadow-md transition transform hover:scale-105 shrink-0 text-center"
          >
            Inquire for Admissions Today
          </a>
        </div>

      </div>

      {/* MODAL: Full Citation and Honor Dossier View */}
      {activeModalItem && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="relative h-44 bg-neutral-950">
              <img 
                src={activeModalItem.imageUrl} 
                alt={activeModalItem.studentName} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shadow-xs inline-flex items-center gap-1 mb-1.5 ${getTierBadgeColor(activeModalItem.awardTier)}`}>
                  <Trophy className="w-3 h-3" />
                  <span>{activeModalItem.awardTier}</span>
                </span>
                <h3 className="text-xl font-black leading-tight text-white">{activeModalItem.title}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF7EE] rounded-2xl border border-[#EAE2CE]">
                <div>
                  <span className="text-[10px] font-black uppercase text-neutral-400 block">Honoree</span>
                  <span className="font-black text-neutral-900 text-sm">{activeModalItem.studentName}</span>
                  <span className="text-xs text-neutral-600 block">{activeModalItem.grade}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-neutral-400 block">Competition Body</span>
                  <span className="font-black text-neutral-900 text-xs block">{activeModalItem.competition}</span>
                  <span className="text-[10px] text-amber-700 font-bold block mt-0.5">Session: {activeModalItem.year}</span>
                </div>
              </div>

              <div>
                <h4 className="font-black text-neutral-900 mb-1">Official Award Citation</h4>
                <p className="text-neutral-700 leading-relaxed text-xs sm:text-sm">
                  {activeModalItem.description}
                </p>
              </div>

              <div>
                <h4 className="font-black text-neutral-900 mb-1">Tournament Background and Rigor</h4>
                <p className="text-neutral-600 leading-relaxed text-xs">
                  {activeModalItem.details}
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Assigned Faculty Mentor</span>
                  <span className="font-black text-neutral-800">{activeModalItem.mentor}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Distinction</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs transition cursor-pointer"
                >
                  Close Achievement Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
