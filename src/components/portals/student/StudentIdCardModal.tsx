import React, { useRef } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { SchoolLogo } from '../../SchoolLogo';
import { 
  Printer, 
  School, 
  ShieldCheck, 
  QrCode, 
  Download, 
  Award, 
  Calendar,
  Phone,
  Mail,
  UserCheck
} from '../../RealIcons';

export const StudentIdCardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { student, schoolInfo, images, houseStandings } = useSchool();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const matchedHouse = houseStandings.find(h => 
    student.house && (h.name.toLowerCase().includes(student.house.toLowerCase()) || student.house.toLowerCase().includes(h.name.toLowerCase()))
  ) || houseStandings[0];
  const houseColor = matchedHouse?.color || '#eab308';
  const houseDisplay = student.house || matchedHouse?.name || 'Unassigned House';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-[#FAF7EE] rounded-3xl shadow-2xl p-6 sm:p-8 border border-[#EAE2CE] space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE2CE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md border border-amber-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900">Official Scholar Digital Identity Card</h2>
              <p className="text-xs text-neutral-500">Government & Institutional Verification Pass</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* The Printable ID Card - 2-Sided Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={cardRef}>
          {/* Front Side */}
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-xl border-2 border-amber-400 bg-gradient-to-b from-neutral-950 via-[#1e1b4b] to-neutral-900 text-white p-5 flex flex-col justify-between relative">
            {/* Top School Branding */}
            <div className="flex items-center gap-3 border-b border-white/15 pb-3">
              <SchoolLogo size="sm" showText={false} />
              <div className="flex-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">{schoolInfo.name}</h3>
                <p className="text-[9px] text-neutral-300 uppercase tracking-widest">Scholar Identity Card</p>
              </div>
            </div>

            {/* Passport & Scholar Details */}
            <div className="flex items-center gap-4 my-auto">
              <div className="w-20 h-24 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-amber-400 shrink-0 shadow-md">
                {student.passportPhoto ? (
                  <img src={student.passportPhoto} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-300 font-bold text-xs text-center p-2">
                    No Passport
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase font-bold block">Scholar Full Name</span>
                  <span className="font-black text-sm text-white">{student.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase font-bold block">Reg Number</span>
                  <span className="font-mono font-black text-amber-300">{student.regNumber}</span>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <div>
                    <span className="text-neutral-400">Class:</span> <strong className="text-white">{student.grade}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400">House:</span> <strong style={{ color: houseColor }}>{houseDisplay}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Front Footer */}
            <div className="flex items-center justify-between border-t border-white/15 pt-2 text-[9px] text-neutral-400">
              <span>Expires: End of Academic Session</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Scholar
              </span>
            </div>
          </div>

          {/* Back Side */}
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-xl border-2 border-neutral-300 bg-white text-neutral-900 p-5 flex flex-col justify-between relative">
            <div className="space-y-2 border-b border-neutral-200 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">Official Regulations</span>
                <span className="text-[9px] font-mono font-bold text-neutral-500">ID: {student.id}</span>
              </div>
              <p className="text-[10px] text-neutral-600 leading-tight">
                This card remains the property of Stanbax Schools. If found, please return to the school administration office or contact campus security.
              </p>
            </div>

            <div className="space-y-1.5 text-[10px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
              <div className="flex justify-between">
                <span className="text-neutral-500">Emergency Phone:</span>
                <span className="font-bold text-neutral-800">{schoolInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Official Email:</span>
                <span className="font-bold text-neutral-800">{schoolInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Campus Address:</span>
                <span className="font-bold text-neutral-800">{schoolInfo.city}, {schoolInfo.state}</span>
              </div>
            </div>

            {/* QR Code Barcode Representation */}
            <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
              <div className="space-y-0.5">
                <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold block">Authorized Signature</span>
                <div className="font-serif italic font-bold text-xs text-neutral-800">
                  Adedeji K. (Registrar)
                </div>
              </div>

              <div className="w-12 h-12 rounded-lg bg-neutral-900 text-white flex items-center justify-center p-1">
                <div className="w-full h-full border border-white/40 grid grid-cols-3 gap-0.5 p-0.5">
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
            id="btn-print-student-id"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official ID Badge</span>
          </button>
        </div>

      </div>
    </div>
  );
};
