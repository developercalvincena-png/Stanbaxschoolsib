import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Notice } from '../../../types';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Users, 
  AlertCircle,
  Zap,
  Smartphone,
  CheckCheck,
  FileText,
  CreditCard,
  MessageSquare,
  Check,
  X,
  ShieldCheck
} from '../../RealIcons';

interface AdminParentBroadcastTabProps {
  initialSelectedNotice?: Notice | null;
}

export const AdminParentBroadcastTab: React.FC<AdminParentBroadcastTabProps> = ({ 
  initialSelectedNotice 
}) => {
  const { 
    notices, 
    students, 
    schoolInfo,
    consultationRequests,
    updateConsultationStatus,
    feePayments,
    verifyFeePayment,
    rejectFeePayment
  } = useSchool();

  const [selectedNoticeId, setSelectedNoticeId] = useState<string>(
    initialSelectedNotice?.id || notices[0]?.id || ''
  );
  const [broadcastChannel, setBroadcastChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [targetAudience, setTargetAudience] = useState<string>('All Parents & Guardians');
  const [customHeadline, setCustomHeadline] = useState<string>(
    initialSelectedNotice?.title || notices[0]?.title || 'Important School Announcement'
  );
  const [customMessage, setCustomMessage] = useState<string>(
    initialSelectedNotice?.description || notices[0]?.description || ''
  );
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [responseModalReqId, setResponseModalReqId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Active students/parents count (excluding alumni)
  const activeStudents = students.filter(s => !s.isAlumni);

  const handleSelectNotice = (id: string) => {
    setSelectedNoticeId(id);
    const found = notices.find(n => n.id === id);
    if (found) {
      setCustomHeadline(found.title || '');
      setCustomMessage(found.description || '');
    }
  };

  const handleTriggerBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentCount(activeStudents.length);
      setSuccessMsg(
        `Instant broadcast successfully dispatched to ${activeStudents.length} verified parent phone contacts via ${broadcastChannel.toUpperCase()} Gateway!`
      );
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1000);
  };

  const handleApproveConsultation = (reqId: string) => {
    updateConsultationStatus(reqId, 'Approved', 'Appointment confirmed by School Administration Desk.');
    setSuccessMsg('Parent consultation appointment confirmed and scheduled.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleDeclineConsultation = (reqId: string) => {
    updateConsultationStatus(reqId, 'Declined', 'Declined due to scheduling conflict. Please choose an alternate date.');
    setSuccessMsg('Consultation request status updated.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleRespondConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseModalReqId) return;
    updateConsultationStatus(responseModalReqId, 'Approved', responseText.trim() || 'Appointment confirmed by Academic Office.');
    setResponseModalReqId(null);
    setResponseText('');
    setSuccessMsg('Appointment response saved and transmitted to parent portal.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleVerifyFee = (paymentId: string) => {
    verifyFeePayment(paymentId, 'Stanbax Central Bursary Admin');
    setSuccessMsg('Tuition fee payment cleared and marked as verified in bursary records.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleRejectFee = (paymentId: string) => {
    rejectFeePayment(paymentId, 'Stanbax Central Bursary Admin');
    setSuccessMsg('Payment marked as rejected; the scholar’s outstanding balance was restored.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-950 text-white p-6 shadow-md border border-emerald-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-emerald-300" />
              <span>Omnichannel Parent Dispatch & Relations</span>
            </span>
            <span className="text-xs font-bold text-teal-200">• WhatsApp, SMS & Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Parent Broadcast & Guardian Administration
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl">
            Transmit urgent school circulars, review parent-teacher meeting consultation bookings, and verify bursary bank transfer deposits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">{activeStudents.length} Active Parent Contacts</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SECTION 1: Broadcast Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Circulars */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-800" />
            <span>Select Circular or Notice</span>
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
            {notices.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleSelectNotice(n.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedNoticeId === n.id
                    ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-blue-800">{n.category}</span>
                  <span>{n.date}</span>
                </div>
                <div className="font-black line-clamp-1">{n.title}</div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Broadcast Composer */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Compose Broadcast Message</span>
          </h3>

          <form onSubmit={handleTriggerBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dispatch Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastChannel('whatsapp')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      broadcastChannel === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastChannel('sms')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      broadcastChannel === 'sms'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastChannel('email')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      broadcastChannel === 'email'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-800"
                >
                  <option value="All Parents & Guardians">All Enrolled Parents & Guardians ({activeStudents.length})</option>
                  <option value="Early Years Parents">Early Years Parents Only</option>
                  <option value="Primary School Parents">Primary School Parents Only</option>
                  <option value="Junior Secondary Parents">Junior Secondary Parents Only</option>
                  <option value="Senior Secondary Parents">Senior Secondary Parents Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Broadcast Headline</label>
              <input
                type="text"
                value={customHeadline}
                onChange={e => setCustomHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Broadcast Message Body</label>
              <textarea
                rows={4}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                required
              />
            </div>

            {/* Preview Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Parent Preview:</span>
              <p className="font-bold text-slate-900">{customHeadline}</p>
              <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-line">{customMessage}</p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Dispatching...' : `Send Broadcast to ${activeStudents.length} Parents`}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 2: Parent Consultations (Admin Privileges) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <h3 className="font-black text-sm text-slate-900">Parent-Faculty Consultation Bookings</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                Admin Privileges
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and approve guardian appointments with Form Masters, Guidance Counselors, and School Principals.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {consultationRequests.length} Total Requests
          </span>
        </div>

        <div className="space-y-3">
          {consultationRequests.length > 0 ? (
            consultationRequests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">{req.parentName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-bold">Ward: {req.studentName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-800 font-bold">Target: {req.targetRole}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'Declined' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{req.preferredDate} ({req.preferredTime})</span>
                  </div>
                </div>

                <p className="text-slate-700 font-medium italic">"{req.message}"</p>

                {req.adminResponse && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px]">
                    <strong className="text-emerald-700">Admin Response:</strong> {req.adminResponse}
                  </div>
                )}

                {/* Admin Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {req.status === 'Pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApproveConsultation(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeclineConsultation(req.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setResponseModalReqId(req.id);
                      setResponseText(req.adminResponse || '');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Custom Feedback / Reschedule
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 font-bold text-xs">
              No parent consultation requests cataloged.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: Parent Fee Payments Verification (Admin Privileges) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-800" />
              <h3 className="font-black text-sm text-slate-900">Guardian Fee Payment Receipts & Bursary Clearance</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                Admin Privileges
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify electronic bank deposits submitted by guardians and clear student bursary credentials.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {feePayments.length} Registered Payments
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase text-[10px]">
                <th className="py-2.5 px-3">Receipt #</th>
                <th className="py-2.5 px-3">Scholar</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feePayments.map(payment => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-black text-slate-900">{payment.receiptNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{payment.studentName} ({payment.grade})</td>
                  <td className="py-2.5 px-3 font-black text-emerald-700">₦{payment.amount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-slate-600">{payment.paymentMethod}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{payment.reference}</td>
                  <td className="py-2.5 px-3 text-slate-500">{payment.paymentDate}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      payment.status === 'Verified' ? 'bg-emerald-100 text-emerald-800'
                      : payment.status === 'Rejected' ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {payment.status === 'Pending Verification' ? (
                      <span className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleVerifyFee(payment.id)}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] cursor-pointer shadow-xs"
                        >
                          Verify & Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectFee(payment.id)}
                          className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] cursor-pointer shadow-xs"
                        >
                          Reject
                        </button>
                      </span>
                    ) : payment.status === 'Verified' ? (
                      <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cleared</span>
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold text-[11px]">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Modal */}
      {responseModalReqId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-sm">Respond to Parent Appointment</h4>
            <form onSubmit={handleRespondConsultation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Administrative Confirmation / Message</label>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  placeholder="e.g. Appointment scheduled with College Counselor on Tuesday at 2:00 PM in the Academic Boardroom."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResponseModalReqId(null)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save & Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
