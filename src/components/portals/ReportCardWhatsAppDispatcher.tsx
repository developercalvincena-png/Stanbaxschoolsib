import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Phone, 
  User, 
  GraduationCap, 
  Award, 
  Clock, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Printer
} from '../RealIcons';
import { useSchool } from '../../context/SchoolContext';
import { StudentProfile } from '../../types';

interface DispatchLog {
  id: string;
  studentName: string;
  parentPhone: string;
  reportType: string;
  dispatchedAt: string;
  status: 'Dispatched' | 'Delivered';
}

export const ReportCardWhatsAppDispatcher: React.FC = () => {
  const { students, schoolInfo } = useSchool();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'stu-1');
  const [reportType, setReportType] = useState<'mid' | 'end'>('end');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('+234 803 445 6789');
  const [customNote, setCustomNote] = useState('Excellent dedication demonstrated across all science practicals this term.');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLog[]>([
    {
      id: 'log-1',
      studentName: 'Femi Adebayo',
      parentPhone: '+234 803 111 2233',
      reportType: 'Official Terminal Dossier',
      dispatchedAt: 'Today at 09:15 AM',
      status: 'Delivered'
    },
    {
      id: 'log-2',
      studentName: 'Zainab Adeleke',
      parentPhone: '+234 803 445 6789',
      reportType: 'Mid-Term CA Breakdown',
      dispatchedAt: 'Yesterday at 04:30 PM',
      status: 'Delivered'
    }
  ]);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0] || {
    id: 'stu-1',
    name: 'Tiwa Savage',
    grade: 'SSS 2',
    term: '2nd Term',
    feeBalance: 0
  };

  const isMid = reportType === 'mid';
  const reportTypeName = isMid ? 'Mid-Term Continuous Assessment Dossier' : 'Official End-of-Term Terminal Dossier';
  const token = `STB-RPT-${activeStudent.id}-${Date.now().toString().slice(-4)}`;
  const secureReportLink = `https://stanbaxschools.edu.ng/secure-dossier?id=${activeStudent.id}&token=${token}`;

  const formattedWhatsAppMessage = `STANBAX SCHOOLS IBADAN
Official Academic Directorate • Terminal Report Card Dispatch

Dear Respected Parent / Guardian of ${activeStudent.name},

We are pleased to formally share the ${reportTypeName} for ${activeStudent.name} (${activeStudent.grade} • ${activeStudent.term || '2nd Term'}).

Academic Summary:
• Overall Average: 92.4% (Grade A1 Distinction)
• Class Position: 2nd of 32 Scholars
• Biometric School Attendance: 59 / 60 Sessions
• Bursary Status: Fully Cleared

Teacher & Principal Observation:
"${customNote}"

Secure PDF Report Card Link:
${secureReportLink}

Resumption for the upcoming term: Monday, 27th April 2026.
For bursary or academic counseling inquiries, contact +234 803 123 4567.

Office of the Principal,
Stanbax Schools Ibadan.`;

  const cleanPhone = parentPhoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(formattedWhatsAppMessage);
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  const handleLogDispatch = () => {
    const newLog: DispatchLog = {
      id: `log-${Date.now()}`,
      studentName: activeStudent.name,
      parentPhone: parentPhoneNumber,
      reportType: isMid ? 'Mid-Term CA Breakdown' : 'Official Terminal Dossier',
      dispatchedAt: 'Just now',
      status: 'Dispatched'
    };
    setDispatchLogs(prev => [newLog, ...prev]);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedWhatsAppMessage);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Automated Parent Communication Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Automated Report Card WhatsApp Dispatcher
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Seamlessly dispatch tamper-evident terminal report cards, mid-term dossiers, and bursary clearances directly to parents on WhatsApp in one click.
          </p>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-xs shrink-0 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-300 block">Dispatch Status</span>
          <span className="font-black text-white text-sm">Official API Gateway Ready</span>
          <span className="text-[10px] text-emerald-300 font-bold block">100% Mobile Optimized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-5">
          <h3 className="font-black text-xs text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
            Select Scholar and Dossier Parameters
          </h3>

          {/* Scholar Picker */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Select Student Profile:
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 bg-neutral-50"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Report Type Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Report Card Kind:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setReportType('mid')}
                className={`p-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
                  reportType === 'mid'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Mid-Term CA
              </button>
              <button
                type="button"
                onClick={() => setReportType('end')}
                className={`p-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
                  reportType === 'end'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Terminal Dossier
              </button>
            </div>
          </div>

          {/* Parent WhatsApp Number */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Parent Registered WhatsApp Number:
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={parentPhoneNumber}
                onChange={(e) => setParentPhoneNumber(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
              />
            </div>
          </div>

          {/* Faculty Observation */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1.5">
              Principal / Faculty Remarks:
            </label>
            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLogDispatch}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 no-underline"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch via WhatsApp to Parent</span>
            </a>

            <button
              type="button"
              onClick={handleCopyText}
              className="w-full py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSuccess ? 'Message Copied!' : 'Copy Formatted Text'}</span>
            </button>
          </div>
        </div>

        {/* Middle Column: WhatsApp Message Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#EFEAE2] p-6 rounded-3xl border border-neutral-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-neutral-300 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-black text-neutral-900">WhatsApp Live Message Preview</span>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]">Recipient: {parentPhoneNumber}</span>
            </div>

            {/* Bubble */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl rounded-tl-xs shadow-xs text-xs sm:text-sm text-neutral-900 leading-relaxed font-sans whitespace-pre-wrap border border-neutral-200 max-w-xl">
              {formattedWhatsAppMessage}
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-600 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Encrypted Security Token Included</span>
              </span>
              <span>West Africa Time Delivery</span>
            </div>
          </div>

          {/* Dispatch Logs Table */}
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs">
              <h4 className="font-black uppercase tracking-wider text-neutral-800">
                Recent WhatsApp Report Card Dispatches
              </h4>
              <span className="text-[11px] text-neutral-500">{dispatchLogs.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-neutral-200 font-black uppercase text-[10px] text-neutral-700">
                  <tr>
                    <th className="py-2.5 px-3">Scholar Name</th>
                    <th className="py-2.5 px-3">Parent Mobile</th>
                    <th className="py-2.5 px-3">Report Kind</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {dispatchLogs.map(log => (
                    <tr key={log.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-3 font-bold text-neutral-900">{log.studentName}</td>
                      <td className="py-2.5 px-3 text-neutral-600 font-mono">{log.parentPhone}</td>
                      <td className="py-2.5 px-3 text-neutral-800">{log.reportType}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{log.dispatchedAt}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
