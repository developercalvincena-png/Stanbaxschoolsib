import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { AdmissionApplication } from '../../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Printer, 
  MessageCircle, 
  Mail, 
  Check, 
  User, 
  FileText 
} from '../../RealIcons';

interface AdminCandidateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: AdmissionApplication | null;
}

export const AdminCandidateExamModal: React.FC<AdminCandidateExamModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  const { entranceExamSettings, updateApplicationExamDetails, schoolInfo } = useSchool();

  if (!isOpen || !application) return null;

  const [status, setStatus] = useState<AdmissionApplication['status']>(application.status);
  const [screeningDate, setScreeningDate] = useState<string>(
    application.screeningDate || `${entranceExamSettings.examDate} (${entranceExamSettings.examTime})`
  );
  const [screeningTime, setScreeningTime] = useState<string>(
    application.screeningTime || entranceExamSettings.examTime
  );
  const [screeningVenue, setScreeningVenue] = useState<string>(
    application.screeningVenue || entranceExamSettings.venue
  );
  const [assignedSeatNumber, setAssignedSeatNumber] = useState<string>(
    application.assignedSeatNumber || ''
  );
  const [examScore, setExamScore] = useState<string>(
    application.examScore !== undefined ? String(application.examScore) : ''
  );
  const [examRemark, setExamRemark] = useState<string>(
    application.examRemark || ''
  );
  const [examSubjects, setExamSubjects] = useState<string>(
    Array.isArray(application.examSubjects)
      ? application.examSubjects.join(', ')
      : (typeof application.examSubjects === 'string'
        ? application.examSubjects
        : (Array.isArray(entranceExamSettings.subjects) ? entranceExamSettings.subjects.join(', ') : ''))
  );
  const [examRequirements, setExamRequirements] = useState<string>(
    application.examRequirements || (Array.isArray(entranceExamSettings.requirements) ? entranceExamSettings.requirements.join(' • ') : '')
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPrintView, setIsPrintView] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicationExamDetails(application.id, {
      status,
      screeningDate,
      screeningTime,
      screeningVenue,
      assignedSeatNumber: assignedSeatNumber.trim() || undefined,
      examScore: examScore.trim() !== '' ? Number(examScore) : undefined,
      examRemark: examRemark.trim() || undefined,
      examSubjects: examSubjects.split(',').map(s => s.trim()).filter(Boolean),
      examRequirements
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = (application.phone || '').replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Hello ${application.parentName},\n\nThis is Stanbax Schools Ibadan with updated Entrance Examination Screening details for ${application.studentName} (${application.gradeLevel}).\n\nApplication Reference: ${application.refNumber}\nDate & Time: ${screeningDate}\nVenue: ${screeningVenue}\n${assignedSeatNumber ? `Assigned Desk/Seat: ${assignedSeatNumber}\n` : ''}${examScore ? `Screening Score: ${examScore}%\n` : ''}Status: ${status}\n\nPlease ensure your child arrives 30 minutes before the scheduled time with the required writing materials.\n\nWarm regards,\nAdmissions Screening Office\nStanbax Schools Ibadan\n+234 803 456 7890`
  );

  const mailSubject = encodeURIComponent(`Entrance Exam Screening Details for ${application.studentName} (${application.refNumber})`);
  const mailBody = encodeURIComponent(
    `Dear ${application.parentName},\n\nGreetings from Stanbax Schools Ibadan.\n\nPlease find below the confirmed entrance examination and screening schedule for ${application.studentName} (${application.gradeLevel}):\n\n- Reference Code: ${application.refNumber}\n- Examination Date & Time: ${screeningDate}\n- Screening Venue: ${screeningVenue}\n${assignedSeatNumber ? `- Assigned Desk/Seat: ${assignedSeatNumber}\n` : ''}${examScore ? `- Exam Assessment Score: ${examScore}%\n` : ''}- Application Status: ${status}\n- Tested Subjects: ${examSubjects}\n- What to bring: ${examRequirements}\n\nWarm regards,\nAdmissions Screening Office\nStanbax Schools Ibadan`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#EAE2CE] my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] p-5 sm:p-6 text-white relative border-b-2 border-amber-400 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <User className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Candidate Exam Details: {application.studentName}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black font-mono">
                  {application.refNumber}
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Applied for <strong>{application.gradeLevel}</strong> • Parent: {application.parentName} ({application.phone})
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle Bar */}
        <div className="px-6 py-2.5 bg-[#FAF7EE] border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPrintView(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                !isPrintView ? 'bg-neutral-900 text-amber-300 shadow-xs' : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Edit Exam Details
            </button>
            <button
              type="button"
              onClick={() => setIsPrintView(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isPrintView ? 'bg-neutral-900 text-amber-300 shadow-xs' : 'text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Exam Slip Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhone}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
              title="Share updated exam details via WhatsApp"
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`mailto:${application.email}?subject=${mailSubject}&body=${mailBody}`}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
              title="Send updated exam details via Email"
            >
              <Mail className="w-3 h-3 text-white" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Main Content: Form or Slip Preview */}
        {!isPrintView ? (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Candidate exam details updated successfully!</span>
              </div>
            )}

            {/* Candidate Status & Seat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Admission / Exam Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none bg-white"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Screening Scheduled">Screening Scheduled</option>
                  <option value="Examination Completed">Examination Completed</option>
                  <option value="Admitted">Admitted (Offer Issued)</option>
                  <option value="Waitlisted">Waitlisted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Assigned Seat / Desk Number
                </label>
                <input
                  type="text"
                  value={assignedSeatNumber}
                  onChange={(e) => setAssignedSeatNumber(e.target.value)}
                  placeholder="e.g. Hall A / Desk #14"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none font-mono"
                />
              </div>
            </div>

            {/* Screening Date & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-700" />
                  <span>Exam Date (Candidate Specific)</span>
                </label>
                <input
                  type="text"
                  required
                  value={screeningDate}
                  onChange={(e) => setScreeningDate(e.target.value)}
                  placeholder="e.g. Saturday, 28th September 2025"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-red-700" />
                  <span>Exam Time</span>
                </label>
                <input
                  type="text"
                  required
                  value={screeningTime}
                  onChange={(e) => setScreeningTime(e.target.value)}
                  placeholder="e.g. 9:00 AM Prompt"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-700" />
                <span>Screening Venue / Room Allocation</span>
              </label>
              <input
                type="text"
                required
                value={screeningVenue}
                onChange={(e) => setScreeningVenue(e.target.value)}
                placeholder="e.g. Stanbax Main Hall, Room B2"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
              />
            </div>

            {/* Exam Score & Examiner Remark */}
            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Entrance Exam Performance & Grading</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Exam Score (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    placeholder="e.g. 85"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-black text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Examiner / Interview Remark
                  </label>
                  <input
                    type="text"
                    value={examRemark}
                    onChange={(e) => setExamRemark(e.target.value)}
                    placeholder="e.g. Passed screening test with honors; recommended for admission"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Subjects & Requirements */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Assigned Exam Subjects
                </label>
                <input
                  type="text"
                  value={examSubjects}
                  onChange={(e) => setExamSubjects(e.target.value)}
                  placeholder="Mathematics, English Language, General Knowledge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Requirements for Candidate
                </label>
                <input
                  type="text"
                  value={examRequirements}
                  onChange={(e) => setExamRequirements(e.target.value)}
                  placeholder="Passport photos, writing materials, birth cert photocopy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Details</span>
              </button>
            </div>
          </form>
        ) : (
          /* Printable Official Exam Slip Preview */
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-6 bg-white border-2 border-neutral-900 rounded-2xl shadow-sm space-y-4 print:p-0 print:border-none print:shadow-none" id="printable-exam-slip">
              {/* Slip Header */}
              <div className="border-b-2 border-neutral-900 pb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight uppercase">
                    {schoolInfo.name}
                  </h3>
                  <p className="text-[11px] font-bold text-red-700">
                    {schoolInfo.location} • Admissions & Screening Board
                  </p>
                  <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                    Official Entrance Examination Accreditation Slip
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded bg-neutral-900 text-amber-300 font-mono font-black text-xs">
                    REF: {application.refNumber}
                  </span>
                  <p className="text-[9px] text-neutral-500 mt-1 uppercase font-bold">Session: 2025/2026</p>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-3 gap-3 text-xs border-b border-neutral-200 pb-3">
                <div className="col-span-2 space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Candidate Full Name:</span>
                    <p className="font-black text-sm text-neutral-900">{application.studentName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-500">Applied Grade:</span>
                      <p className="font-bold text-neutral-800">{application.gradeLevel}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-500">Parent / Guardian:</span>
                      <p className="font-bold text-neutral-800">{application.parentName}</p>
                    </div>
                  </div>
                </div>

                {/* Photo Box Placeholder */}
                <div className="w-24 h-28 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center text-center p-1 justify-self-end bg-neutral-50">
                  <User className="w-6 h-6 text-neutral-300 mb-1" />
                  <span className="text-[9px] font-bold text-neutral-500 leading-tight">Affix Recent Passport Photo</span>
                </div>
              </div>

              {/* Exam Screening Details */}
              <div className="p-3.5 bg-[#FAF7EE] rounded-xl border border-[#EAE2CE] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-neutral-900 uppercase tracking-wide text-[11px]">
                    Entrance Examination Schedule
                  </span>
                  {assignedSeatNumber && (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-black font-mono text-[10px]">
                      Seat: {assignedSeatNumber}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold block">Date & Time:</span>
                    <span className="font-black text-red-700">{screeningDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold block">Screening Venue:</span>
                    <span className="font-bold text-neutral-800">{screeningVenue}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block">Subjects Tested:</span>
                  <span className="font-semibold text-neutral-700">{examSubjects}</span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block">Required Items:</span>
                  <span className="font-medium text-neutral-600">{examRequirements}</span>
                </div>

                {examScore && (
                  <div className="pt-1 border-t border-[#EAE2CE] flex items-center justify-between">
                    <span className="font-bold text-neutral-900">Entrance Score / Assessment:</span>
                    <span className="font-black text-emerald-800 font-mono text-sm">{examScore}%</span>
                  </div>
                )}
              </div>

              {/* Slip Signatures & Stamp Box */}
              <div className="pt-4 grid grid-cols-2 gap-6 text-[10px] text-neutral-600">
                <div className="border-t border-neutral-300 pt-1 text-center">
                  <p className="font-bold text-neutral-800">Registrar / Admissions Officer</p>
                  <p className="text-[9px] text-neutral-500">Official Signature & Date</p>
                </div>
                <div className="border-t border-neutral-300 pt-1 text-center">
                  <p className="font-bold text-neutral-800">Screening Supervisor</p>
                  <p className="text-[9px] text-neutral-500">Accreditation Stamp</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsPrintView(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Back to Edit
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
