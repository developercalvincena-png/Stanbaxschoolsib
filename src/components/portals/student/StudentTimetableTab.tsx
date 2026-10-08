import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Printer, 
  CheckCircle2, 
  MapPin, 
  User, 
  Download
} from '../../RealIcons';

export const StudentTimetableTab: React.FC = () => {
  const { student, timetables } = useSchool();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const [activeDay, setActiveDay] = useState<typeof daysOfWeek[number]>('Monday');

  // Find timetable for student's class — join by classId first, name fallback
  const classTimetable = timetables.find(t => student.classId && t.classId === student.classId)
    || timetables.find(t => 
      t.className.toLowerCase().includes(student.grade.toLowerCase()) ||
      student.grade.toLowerCase().includes(t.className.toLowerCase())
    ) || timetables[0];

  const currentDaySchedule = classTimetable?.schedule.find(s => s.day === activeDay);
  const currentDayPeriods = currentDaySchedule?.periods || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="student-timetable-container">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-950 text-white shadow-md relative overflow-hidden border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Calendar className="w-3.5 h-3.5" />
            Classroom Schedule & Bell Timetable
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Weekly Class Periods: {classTimetable?.className || student.grade}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Track daily academic subject periods, classroom venues, assigned instructors, and assembly & recreation intervals.
          </p>
        </div>
      </div>

      {/* Control Bar: Day Tabs & Print */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE2CE] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {daysOfWeek.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeDay === day
                  ? 'bg-amber-400 text-neutral-950 shadow-sm border border-amber-500'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" />
          <span>Print Weekly Timetable</span>
        </button>
      </div>

      {/* Day Schedule Cards */}
      <div className="space-y-3">
        {currentDayPeriods.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE2CE]">
            <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-neutral-600">No scheduled periods for {activeDay}.</p>
          </div>
        ) : (
          currentDayPeriods.map(period => (
            <div
              key={period.periodNumber}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                period.isBreak
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-white border-[#EAE2CE] hover:border-neutral-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  period.isBreak
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-neutral-900 text-amber-400'
                }`}>
                  P{period.periodNumber}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-neutral-900">{period.subject}</h3>
                    {period.isBreak && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                        Recess Interval
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {period.startTime} - {period.endTime}
                    </span>
                    {(period.tutorName || period.teacher) && (
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-neutral-400" />
                        {period.tutorName || period.teacher}
                      </span>
                    )}
                    {period.room && (
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {period.room}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-neutral-400 sm:text-right">
                Standard 40-Min Period
              </span>
            </div>
          ))
        )}
      </div>

      {/* Full 5-Day Matrix Table Preview */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm space-y-4">
        <h3 className="text-base font-black text-neutral-900">Complete Weekly Subject Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-100 text-neutral-700 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="p-2.5">Time</th>
                {daysOfWeek.map(d => (
                  <th key={d} className="p-2.5">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {[1, 2, 3, 4, 5, 6].map(periodNum => {
                const mondaySchedule = classTimetable?.schedule.find(s => s.day === 'Monday');
                const sampleP = mondaySchedule?.periods.find(p => p.periodNumber === periodNum);
                return (
                  <tr key={periodNum} className="hover:bg-neutral-50">
                    <td className="p-2.5 font-mono text-neutral-500 font-bold whitespace-nowrap">
                      {sampleP ? `${sampleP.startTime} - ${sampleP.endTime}` : `Period ${periodNum}`}
                    </td>
                    {daysOfWeek.map(d => {
                      const daySched = classTimetable?.schedule.find(s => s.day === d);
                      const match = daySched?.periods.find(p => p.periodNumber === periodNum);
                      return (
                        <td key={d} className={`p-2.5 ${match?.isBreak ? 'bg-amber-50 font-bold text-amber-900' : 'text-neutral-800'}`}>
                          {match?.subject || 'Free Study'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
