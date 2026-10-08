import React from 'react';
import { Users, Award, GraduationCap, PlusCircle, Settings, ArrowRight, Calendar, Lock } from './RealIcons';
import { useSchool } from '../context/SchoolContext';

export const FacultyTeam: React.FC = () => {
  const { images, facultyList, isAdminAuthenticated, setActiveSection, proprietressProfile } = useSchool();

  return (
    <section id="faculty" className="py-20 bg-[#FDFBF7] border-b border-[#EAE2CE] font-['Nunito',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Executive Founder Spotlight */}
        <div className="mb-16 bg-gradient-to-br from-[#111827] via-neutral-900 to-[#450A0A] rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-xl bg-neutral-800">
                <img
                  src={proprietressProfile.portraitUrl}
                  alt={proprietressProfile.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] uppercase tracking-wider whitespace-nowrap shadow-sm">
                Founder (Est. {proprietressProfile.establishedYear})
              </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Leadership & Founder's Desk</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {proprietressProfile.name}
              </h3>
              <p className="text-amber-300 text-xs sm:text-sm font-bold">
                {proprietressProfile.honorifics} • {proprietressProfile.title}
              </p>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-3xl italic">
                "{proprietressProfile.tagline}"
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => setActiveSection('proprietress')}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Visit Proprietress Desk & Addresses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveSection('proprietress')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Book an Audience</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-neutral-900 border border-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-red-600" />
            <span>Academic Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Meet Our Faculty & Administration
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-3">
            Dedicated educators, mentors, and administrators committed to cultivating intellect, discipline, and moral distinction at Stanbax Schools Ibadan.
          </p>

          {isAdminAuthenticated && (
            <div className="mt-4 inline-flex items-center gap-2">
              <button
                onClick={() => setActiveSection('admin-portal')}
                className="px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-amber-700" />
                <span>Manage Staff / Faculty in Admin Portal</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facultyList.map((member) => {
            const facultyImg = member.imageUrl 
              || (member.imageKey ? images[member.imageKey] : undefined) 
              || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={member.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#EAE2CE] group flex flex-col justify-between"
              >
                <div>
                  {/* Faculty Photo Container */}
                  <div className="relative h-64 overflow-hidden bg-neutral-100">
                    <img
                      src={facultyImg}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-neutral-900/90 text-amber-300 text-[11px] font-black shadow-xs backdrop-blur-xs border border-amber-400/30">
                      {member.department}
                    </div>
                  </div>

                  {/* Faculty Info */}
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-red-700 transition-colors">
                      {member.name}
                    </h3>
                    <div className="text-xs font-bold text-red-700 mt-1">
                      {member.role}
                    </div>
                    <div className="text-[11px] font-medium text-neutral-500 mt-1 mb-3">
                      {member.qualification}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed text-left border-t border-[#F0EAE0] pt-3">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF7EE] border-t border-[#EAE2CE] flex items-center justify-center gap-3">
                  <span className="text-[11px] font-bold text-neutral-800 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    Stanbax Academic Board
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Teacher to student ratio note */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111827] to-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-neutral-800">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 font-black">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-white">
                Low 1:12 Teacher-to-Student Ratio
              </div>
              <p className="text-xs sm:text-sm text-[#E5DEC9]">
                Ensuring individualized attention, continuous remedial support, and regular parent-teacher dialogues.
              </p>
            </div>
          </div>
          <div className="text-xs font-black text-amber-400 bg-white/10 px-4 py-2.5 rounded-xl shrink-0 border border-white/10">
            TRCN & Cambridge Certified Faculty
          </div>
        </div>
      </div>
    </section>
  );
};
