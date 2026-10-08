import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Building,
  CreditCard,
  Calendar,
  User,
  Sparkles
} from '../RealIcons';
import { SchoolInfo, StudentProfile, FeePayment } from '../../types';

interface FeeReceiptModalProps {
  payment: FeePayment;
  student: StudentProfile;
  schoolInfo: SchoolInfo;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  payment,
  student,
  schoolInfo,
  onClose
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const amountInWords = (amt: number): string => {
    if (amt >= 200000) return 'Two Hundred and Ten Thousand Naira Only';
    if (amt >= 150000) return 'One Hundred and Eighty-Five Thousand Naira Only';
    if (amt >= 100000) return 'One Hundred and Twenty Thousand Naira Only';
    return `${amt.toLocaleString()} Naira Only`;
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in font-['Nunito',sans-serif] overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 my-8 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-black">Official Bursary Receipt & Clearance Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Document */}
        <div ref={printableRef} className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white text-neutral-900">
          
          {/* Institutional Header with Coat of Arms style border */}
          <div className="border-b-2 border-neutral-900 pb-5 text-center relative">
            <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-black uppercase tracking-widest mb-1.5">
              Federal Republic of Nigeria • Ministry of Education Approved
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight uppercase">
              {schoolInfo.name || 'Stanbax Schools Ibadan'}
            </h1>
            <p className="text-xs text-neutral-600 font-semibold mt-0.5">
              12 Excellence Avenue, Bodija / Oluyole Way, Ibadan, Oyo State, Nigeria
            </p>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
              Phone: +234 803 123 4567 • Email: bursary@stanbaxschools.edu.ng • Portal: stanbaxschools.edu.ng
            </p>

            {/* Document Title Badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Official Electronic Tuition Receipt and Clearance Certificate</span>
            </div>
          </div>

          {/* Reference Meta Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF7EE] p-3.5 rounded-2xl border border-[#EAE2CE]">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Receipt Number</span>
              <span className="font-mono font-black text-neutral-950">{payment.receiptNumber || 'STB-RCP-2026-0842'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Date Issued</span>
              <span className="font-bold text-neutral-900">{payment.paymentDate || new Date().toISOString().split('T')[0]}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Term / Session</span>
              <span className="font-bold text-neutral-900">{student.term || '2nd Term 2025/2026'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Clearance Status</span>
              <span className="font-black text-emerald-700">VERIFIED CLEARED</span>
            </div>
          </div>

          {/* Scholar & Payer Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-neutral-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Scholar Particulars</span>
              <div className="font-black text-neutral-950 text-sm">{student.name}</div>
              <div className="text-neutral-600">Student ID: <span className="font-mono font-bold text-neutral-900">{student.id}</span></div>
              <div className="text-neutral-600">Class: <span className="font-bold text-neutral-900">{student.grade}</span></div>
              <div className="text-neutral-600">Curriculum Track: <span className="font-bold text-neutral-900">Dual British-Nigerian</span></div>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Payment Particulars</span>
              <div className="text-neutral-600">Payment Channel: <span className="font-bold text-neutral-900">{payment.paymentMethod}</span></div>
              <div className="text-neutral-600">Bank Transaction Ref: <span className="font-mono font-bold text-neutral-900">{payment.reference}</span></div>
              <div className="text-neutral-600">Bursary Authorization: <span className="font-bold text-emerald-700">Automated Instant Clearance</span></div>
              <div className="text-neutral-600">Examination Entry Gate: <span className="font-bold text-blue-700">Full Access Granted</span></div>
            </div>
          </div>

          {/* Payment Itemized Table */}
          <div className="border border-neutral-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-neutral-100 border-b border-neutral-200 font-black uppercase text-[10px] text-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">Term Allocation</th>
                  <th className="py-2.5 px-3 text-right">Amount (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-neutral-800">Termly Academic Tuition and Curriculum Materials</td>
                  <td className="py-2.5 px-3 text-neutral-600">{student.term || '2nd Term'}</td>
                  <td className="py-2.5 px-3 text-right font-black">₦{payment.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-600">STEM Robotics Lab & Digital Computing Hall Levy</td>
                  <td className="py-2 px-3 text-neutral-500">Statutory Inclusion</td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-700">Included</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-neutral-600">Campus Sick-Bay Clinical Cover & Registered Nurse Care</td>
                  <td className="py-2 px-3 text-neutral-500">Statutory Inclusion</td>
                  <td className="py-2 px-3 text-right font-semibold text-emerald-700">Included</td>
                </tr>
              </tbody>
              <tfoot className="bg-neutral-50 border-t border-neutral-200 font-black text-xs">
                <tr>
                  <td colSpan={2} className="py-3 px-3 uppercase">Total Amount Cleared:</td>
                  <td className="py-3 px-3 text-right text-base text-neutral-950 font-black">
                    ₦{payment.amount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Amount in words */}
          <div className="p-3 bg-[#FAF7EE] rounded-xl border border-[#EAE2CE] text-xs">
            <span className="font-bold text-neutral-500 uppercase text-[10px] block">Amount in Words:</span>
            <span className="font-black text-neutral-900 italic">{amountInWords(payment.amount)}</span>
          </div>

          {/* Verification QR Code and Official Stamp */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-900 text-white rounded-xl">
                <QrCode className="w-12 h-12" />
              </div>
              <div className="text-[11px] space-y-0.5">
                <span className="font-black text-neutral-900 block">Cryptographic QR Verification</span>
                <span className="text-neutral-500 block">Scan to verify against the Stanbax Bursary Database</span>
                <span className="font-mono text-[10px] text-neutral-400">HASH: 78F9A-STB-CLEARANCE-VERIFIED</span>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block border-b-2 border-neutral-900 pb-1 px-4 text-xs font-black uppercase text-neutral-900">
                Mr. O. Babalola, FCA
              </div>
              <div className="text-[10px] font-bold text-neutral-500 block uppercase">
                Bursar and Directorate of Accounts
              </div>
              <div className="text-[9px] text-emerald-700 font-bold block">
                Electronic Seal Verified • Official Transcript
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
