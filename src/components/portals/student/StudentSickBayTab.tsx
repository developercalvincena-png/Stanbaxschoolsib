import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  HeartPulse, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  PlusCircle, 
  X, 
  Info,
  Thermometer,
  FileText
} from '../../RealIcons';
import { SickBayVisitLog } from '../../../types';

export const StudentSickBayTab: React.FC = () => {
  const { student, sickBayLogs, addSickBayLog } = useSchool();

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter records for this scholar
  const myRecords = sickBayLogs.filter(r => 
    r.studentId === student.id ||
    r.regNumber === student.regNumber || 
    r.studentName.toLowerCase().includes(student.name.toLowerCase())
  );

  const handleSubmitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !complaint.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateStr = now.toISOString().split('T')[0];

    const newLog: Omit<SickBayVisitLog, 'id'> = {
      studentId: student.id,
      studentName: student.name,
      regNumber: student.regNumber,
      grade: student.grade,
      visitDate: dateStr,
      timeIn: timeStr,
      symptoms: complaint ? `${complaint}. ${symptoms}` : symptoms,
      diagnosis: 'Triage Pending Assessment',
      treatmentAdministered: 'Queued for Nursing Triage Assessment & Rest Bay Check',
      temperatureCelsius: 36.8,
      nurseNotes: 'Self-reported check-in via student mobile portal.',
      parentNotified: false,
      admittedToBed: false,
      status: 'In Treatment'
    };

    addSickBayLog(newLog);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowRequestModal(false);
        setComplaint('');
        setSymptoms('');
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6" id="student-sickbay-tab">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-neutral-900 to-amber-950 text-white shadow-md relative overflow-hidden border border-rose-900/40">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-500/30">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            Stanbax Health Bay & Medical Triage
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Health Bay Log & Emergency Medical Registry
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Registered medical histories, on-campus clinic attendance records, nurse treatment logs, and fast clinic pass check-in.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-rose-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-rose-200">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Clinic Hotline / On-Duty Matron: <strong>+234 803 234 5678</strong></span>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request Clinic Visit / Report Ailment</span>
          </button>
        </div>
      </div>

      {/* Health Profile Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-black text-neutral-400 block tracking-wider">Blood Group / Genotype</span>
          <span className="text-base font-black text-neutral-900">
            {student.bloodGroup || 'O+'} • {student.genotype || 'AA'}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Verified Medical File</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-black text-neutral-400 block tracking-wider">Registered Allergies</span>
          <span className="text-base font-black text-neutral-900">
            {student.allergies || 'None Recorded'}
          </span>
          <span className="text-[10px] text-neutral-500 font-bold block mt-0.5">Updated Current Term</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-black text-neutral-400 block tracking-wider">Parent Emergency Contact</span>
          <span className="text-base font-black text-neutral-900">{student.emergencyPhone || student.parentPhone || '+234 802 345 6789'}</span>
          <span className="text-[10px] text-neutral-500 font-bold block mt-0.5">{student.parentName || 'Primary Guardian'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase font-black text-neutral-400 block tracking-wider">Sick Bay Visits This Term</span>
          <span className="text-base font-black text-neutral-900">{myRecords.length} Recorded Visits</span>
          <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Stanbax College Infirmary</span>
        </div>
      </div>

      {/* Visit History Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Clinical Attendance & Prescription History ({myRecords.length})</span>
          </h3>
        </div>

        {myRecords.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE2CE] space-y-2">
            <HeartPulse className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-sm font-bold text-neutral-700">No Clinic Visits on Record</p>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Your medical record is pristine for this term. If you feel unwell during school hours, inform your form tutor or click the button above to log a triage ticket.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRecords.map(record => (
              <div
                key={record.id}
                className="p-5 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm hover:border-neutral-300 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase bg-rose-50 text-rose-800 border border-rose-200">
                      Visit Log
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-500">
                      Date: {record.visitDate} • {record.timeIn}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    record.status === 'Discharged to Class'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    Status: {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 font-bold block mb-1">Reported Symptoms / Complaint:</span>
                    <p className="font-bold text-neutral-900">{record.symptoms}</p>
                    {record.temperatureCelsius && (
                      <p className="text-xs text-amber-800 font-medium mt-1 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>Temperature: {record.temperatureCelsius}°C</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-neutral-400 font-bold block mb-1">Clinical Intervention & Treatment:</span>
                    <p className="font-medium text-neutral-800">{record.treatmentAdministered}</p>
                    {record.diagnosis && (
                      <p className="text-[11px] text-neutral-500 mt-1">
                        Diagnosis: <strong className="text-neutral-700">{record.diagnosis}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {record.nurseNotes && (
                  <div className="p-3 rounded-xl bg-neutral-50 text-neutral-600 text-xs border border-neutral-100 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>Matron Note: {record.nurseNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Visit Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900">Request Sick Bay Pass</h3>
                  <p className="text-xs text-neutral-500">Report illness or discomfort for prompt nursing attention</p>
                </div>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm text-emerald-950">Sick Bay Pass Issued</h4>
                <p className="text-xs text-emerald-800">
                  Your ticket has been logged and the school clinic matron has been alerted. Please proceed calmly to the Clinic Bay.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitVisit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Primary Complaint / What hurts?</label>
                  <input
                    type="text"
                    required
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="e.g. Mild headache, stomach discomfort, sprained ankle"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Detailed Symptoms (optional)</label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. dizziness, slight fever warmth, chills"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-neutral-800"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Logging Pass...' : 'Confirm Sick Bay Pass'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
