import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Search, X, CheckCircle2, Clock, Calendar, AlertCircle, FileText } from './RealIcons';

interface ApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationTrackerModal: React.FC<ApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { applications, entranceExamSettings } = useSchool();
  const [searchRef, setSearchRef] = useState<string>('STX-849201');
  const [searched, setSearched] = useState<boolean>(true);

  if (!isOpen) return null;

  const foundApp = applications.find(
    (a) => a.refNumber.toUpperCase().trim() === searchRef.toUpperCase().trim()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#EAE2CE]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Candidate Portal
              </span>
              <h3 className="text-xl font-black">Admission Status Tracker</h3>
            </div>
          </div>
          <p className="text-xs text-[#E5DEC9] mt-1">
            Enter the 8-character application reference provided upon online submission.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. STX-849201"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl border border-[#EAE2CE] text-sm font-mono uppercase focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>

          {searched && foundApp && (
            <div className="p-5 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#EAE2CE] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 block">REFERENCE</span>
                  <span className="font-mono font-black text-sm text-red-700">{foundApp.refNumber}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  foundApp.status === 'Admitted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : foundApp.status === 'Screening Scheduled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {foundApp.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 block font-semibold">Scholar Name:</span>
                  <p className="font-black text-neutral-900 text-sm">{foundApp.studentName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-neutral-500 block font-semibold">Applied Grade:</span>
                    <p className="font-bold text-neutral-800">{foundApp.gradeLevel}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-semibold">Submitted:</span>
                    <p className="font-bold text-neutral-800">{foundApp.dateSubmitted}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF7EE] border border-[#EAE2CE] text-neutral-900 space-y-2 mt-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Calendar className="w-3.5 h-3.5 text-red-700" />
                      <span>Screening & Entrance Exam Date:</span>
                    </div>
                    {foundApp.assignedSeatNumber && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-neutral-950 font-mono font-black text-[11px]">
                        Seat: {foundApp.assignedSeatNumber}
                      </span>
                    )}
                  </div>
                  <p className="font-black text-red-700 text-sm">{foundApp.screeningDate}</p>
                  <p className="text-[11px] text-neutral-700 font-medium">
                    <strong>Screening Venue:</strong> {foundApp.screeningVenue || entranceExamSettings.venue}
                  </p>
                  {foundApp.examScore !== undefined && (
                    <div className="p-2 rounded-lg bg-white border border-amber-300 flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-800">Exam Score / Assessment:</span>
                      <span className="font-black text-sm text-emerald-800 font-mono">{foundApp.examScore}%</span>
                    </div>
                  )}
                  {foundApp.examRemark && (
                    <p className="text-[11px] text-neutral-600 italic">
                      Examiner Note: "{foundApp.examRemark}"
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-500 border-t border-[#EAE2CE] pt-1">
                    Requirements: {foundApp.examRequirements || (Array.isArray(entranceExamSettings.requirements) ? entranceExamSettings.requirements.join(', ') : String(entranceExamSettings.requirements))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {searched && !foundApp && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                No admission record found for reference <strong>{searchRef}</strong>. Please check your submission confirmation email or call admissions (+234 803 456 7890).
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
