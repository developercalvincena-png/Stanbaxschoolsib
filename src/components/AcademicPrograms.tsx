import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Check, 
  Clock, 
  ArrowRight, 
  Award 
} from './RealIcons';
import { ACADEMIC_PROGRAMS, FEATURED_COURSES } from '../data/schoolData';
import { AcademicProgram } from '../types';
import { useSchool } from '../context/SchoolContext';

interface AcademicProgramsProps {
  onOpenAdmissions: () => void;
}

export const AcademicPrograms: React.FC<AcademicProgramsProps> = ({ onOpenAdmissions }) => {
  const { images, academicPrograms, featuredCourses } = useSchool();
  const progs = (academicPrograms && academicPrograms.length > 0) ? academicPrograms : ACADEMIC_PROGRAMS;
  const courses = (featuredCourses && featuredCourses.length > 0) ? featuredCourses : FEATURED_COURSES;
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgram>(progs[1] || progs[0]);

  // Keep selected program synced if programs list changes
  React.useEffect(() => {
    if (!progs.some(p => p.id === selectedProgram?.id)) {
      setSelectedProgram(progs[0]);
    }
  }, [progs, selectedProgram]);

  return (
    <section id="curriculum" className="py-20 bg-[#FDFBF7] border-b border-[#EAE2CE] font-['Nunito',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-neutral-900 border border-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span>Curriculum & Academics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Academic Pathways at Stanbax Schools
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-3">
            Structured for all age tiers from early childhood through college graduation, integrating national benchmarks with international enrichment.
          </p>
        </div>

        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {progs.map((prog) => {
            const isSelected = selectedProgram?.id === prog.id;
            const imgSrc = prog.imageUrl || (prog.imageKey && images[prog.imageKey]) || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group ${
                  isSelected
                    ? 'ring-4 ring-red-600 shadow-xl scale-[1.02]'
                    : 'hover:shadow-lg hover:-translate-y-1 bg-white border border-[#EAE2CE]'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 text-xs font-black shadow-sm">
                    {prog.ageGroup}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                      {prog.category}
                    </span>
                    <h3 className="text-base font-extrabold leading-snug">
                      {prog.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-white space-y-3">
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {prog.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-[#F0EAE0]">
                    <span className="flex items-center gap-1 font-bold text-neutral-700">
                      <Users className="w-3.5 h-3.5 text-red-600" />
                      {prog.studentCount} Scholars
                    </span>
                    <span className="text-red-700 font-black group-hover:underline">
                      Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Program Deep-Dive Modal/Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2CE] mb-20">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3">
              <div className="rounded-2xl overflow-hidden shadow-md border border-[#EAE2CE]">
                <img
                  src={selectedProgram.imageUrl || (selectedProgram.imageKey && images[selectedProgram.imageKey]) || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedProgram.title}
                  className="w-full h-56 sm:h-64 object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="mt-4 p-4 rounded-2xl bg-[#111827] text-white border border-neutral-800 text-center">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Admissions Status
                </div>
                <div className="text-base font-black text-white mt-0.5">
                  Now Accepting Applications
                </div>
                <button
                  onClick={onOpenAdmissions}
                  className="w-full mt-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs cursor-pointer transition-colors border border-red-500"
                >
                  Apply for {selectedProgram.category}
                </button>
              </div>
            </div>

            <div className="w-full lg:w-2/3 space-y-5">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                  {selectedProgram.ageGroup}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2">
                  {selectedProgram.title}
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base mt-2 leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-3">
                  Core Subject Modules & Focus Areas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Array.isArray(selectedProgram.subjects) ? selectedProgram.subjects : (typeof selectedProgram.subjects === 'string' ? (selectedProgram.subjects as string).split(',').map((s: string) => s.trim()) : [])).map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7EE] border border-[#EAE2CE] text-xs font-semibold text-neutral-800">
                      <Check className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-2">
                  Distinctive Learning Features
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-600">
                  {selectedProgram.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Enrichment Programs */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 block mb-1">
              Co-Curricular & Specializations
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Enrichment & Specialty Clubs
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm mt-1">
              Hands-on practical development outside the traditional classroom syllabus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => {
              const courseImg = (course.imageKey && images[course.imageKey]) || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#EAE2CE] flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={courseImg}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-neutral-900/90 text-amber-300 text-xs font-bold backdrop-blur-xs border border-amber-400/30">
                        {course.grade}
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-lg font-bold text-neutral-900 mb-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                        {course.highlight}
                      </p>

                      <div className="text-xs text-neutral-500 space-y-1.5 pt-3 border-t border-[#F0EAE0]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-700">Lead Instructor:</span>
                          <span className="font-bold text-neutral-900">{course.tutor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-700">Participation:</span>
                          <span className="text-red-700 font-bold">{course.students}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF7EE] border-t border-[#EAE2CE] flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <button
                      onClick={onOpenAdmissions}
                      className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
