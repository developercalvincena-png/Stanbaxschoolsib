import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../data/schoolData';
import { Calendar, Download, Clock, Bell, CheckCircle2, ChevronRight } from './RealIcons';
import { useSchool } from '../context/SchoolContext';

type CalendarTerm = '1st Term' | '2nd Term' | '3rd Term';

export const AcademicCalendarSection: React.FC = () => {
  const { calendarEvents, schoolInfo } = useSchool();
  const allEvents = (calendarEvents && calendarEvents.length > 0) ? calendarEvents : CALENDAR_EVENTS;

  // Extract unique terms from events
  const terms: CalendarTerm[] = ['1st Term', '2nd Term', '3rd Term'];
  const [selectedTerm, setSelectedTerm] = useState<CalendarTerm>('1st Term');

  const filteredEvents = allEvents.filter((e) => (e.term || '1st Term') === selectedTerm);

  const handleDownload = () => {
    try {
      window.print();
    } catch {
      // Safe iframe fallback
    }
  };

  return (
    <section id="calendar" className="py-16 sm:py-20 bg-[#FAF7EE] border-t border-[#EAE2CE] font-['Nunito',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-neutral-900 border border-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Academic Planning</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              {schoolInfo.activeSession || '2025/2026 Academic Session'} Calendar
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl">
              Key school resumption schedules, continuous assessment periods, parent-teacher conferences, and holiday breaks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="inline-flex p-1 rounded-xl bg-[#F0EAE0] border border-[#EAE2CE] overflow-x-auto max-w-full">
              {terms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSelectedTerm(term)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedTerm === term
                      ? 'bg-[#111827] text-amber-300 shadow-xs'
                      : 'text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-[#F0EAE0] text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#EAE2CE] shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-red-600" />
              <span>Print Calendar</span>
            </button>
          </div>
        </div>

        {/* Timeline event cards */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const displayCategory = evt.type || evt.category || 'Event';
              return (
                <div 
                  key={evt.id}
                  className="bg-white rounded-3xl p-6 border border-[#EAE2CE] hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        displayCategory === 'Resumption'
                          ? 'bg-red-100 text-red-900'
                          : displayCategory === 'Assessment' || displayCategory === 'Exam'
                          ? 'bg-amber-100 text-amber-900'
                          : displayCategory === 'Sports'
                          ? 'bg-emerald-100 text-emerald-900'
                          : displayCategory === 'Holiday'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-neutral-100 text-neutral-900'
                      }`}>
                        {displayCategory}
                      </span>
                      <span className="text-xs font-bold text-neutral-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {evt.dateRange || evt.date}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-neutral-900 leading-snug">{evt.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{evt.notes || evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#F0EAE0] flex items-center justify-between text-xs text-red-700 font-bold">
                    <span>{evt.term || selectedTerm} Milestone</span>
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE2CE]">
            <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-stone-700">No scheduled events published for {selectedTerm}</h4>
            <p className="text-xs text-stone-500 mt-1">Check back later as the school administration updates the academic calendar.</p>
          </div>
        )}
      </div>
    </section>
  );
};
