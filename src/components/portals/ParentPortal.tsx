import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolLogo } from '../SchoolLogo';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  HeartPulse, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  Printer, 
  Send,
  X,
  Lock,
  ChevronRight,
  School as SchoolIcon,
  Check,
  Camera,
  Bus
} from '../RealIcons';
import { ParentProfile, StudentProfile, ParentConsultationRequest, FeePaymentRecord, FeePayment } from '../../types';
import { PortalLoginPage } from '../PortalLoginPage';
import { SchoolChatSystem } from '../chat/SchoolChatSystem';
import { CampusGallery } from '../CampusGallery';
import { BusFleetTracker } from './BusFleetTracker';
import { FeeReceiptModal } from './FeeReceiptModal';

interface ParentPortalProps {
  onBackToWebsite: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ onBackToWebsite }) => {
  const {
    parents,
    activeParentId,
    isParentAuthenticated,
    logoutParent,
    students,
    schoolInfo,
    termResumptionConfig,
    consultationRequests,
    submitConsultationRequest,
    feePayments,
    recordFeePayment,
    sickBayLogs,
    notices,
    classes,
    timetables,
    assessmentConfig
  } = useSchool();

  // If not authenticated, render login
  if (!isParentAuthenticated) {
    return <PortalLoginPage onBackToWebsite={onBackToWebsite} />;
  }

  // Find active parent
  const activeParent: ParentProfile = parents.find(p => p.id === activeParentId) || parents[0] || {
    id: 'parent-1',
    fullName: 'Chief & Mrs. Adebayo Adeleke',
    phone: '+234 803 445 6789',
    email: 'adeleke.family@gmail.com',
    childrenIds: ['stu-1']
  };

  // Find linked children
  const linkedChildren: StudentProfile[] = students.filter(s => 
    activeParent.childrenIds?.includes(s.id)
  );

  const [selectedChildId, setSelectedChildId] = useState<string>(
    linkedChildren[0]?.id || 'stu-1'
  );

  const selectedChild = linkedChildren.find(c => c.id === selectedChildId) || linkedChildren[0] || students[0];

  // Active navigation tab
  type ParentTab = 'overview' | 'academics' | 'fees' | 'health' | 'bus' | 'consultation' | 'timetable' | 'chat' | 'gallery';
  const [activeTab, setActiveTab] = useState<ParentTab>('overview');

  // Official Bursary Fee Receipt Modal State
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<FeePayment | null>(null);

  // Health Clinic Emergency Alert Broadcast State
  const [emergencyBroadcastSent, setEmergencyBroadcastSent] = useState(false);

  // Consultation Booking Modal / Form State
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultTargetRole, setConsultTargetRole] = useState<'Class Teacher' | 'Guidance Counselor' | 'Principal' | 'School Nurse'>('Class Teacher');
  const [consultTopic, setConsultTopic] = useState('');
  const [consultMessage, setConsultMessage] = useState('');
  const [consultDate, setConsultDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [consultTime, setConsultTime] = useState('11:00 AM');
  const [consultSuccessMsg, setConsultSuccessMsg] = useState('');

  // Fee Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(50000);
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'POS' | 'Direct Deposit' | 'Online WebPay'>('Bank Transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Report card kind (mid-term CA card vs end-of-term exam card)
  const [reportCardKind, setReportCardKind] = useState<'mid' | 'end'>('mid');
  const midPublished = assessmentConfig.midTermResultsPublished === true;
  const endPublished = assessmentConfig.endTermResultsPublished === true;
  const isMidSheet = reportCardKind === 'mid';
  const kindPublished = isMidSheet ? midPublished : endPublished;

  // Print Report Card helper
  const handlePrintChildReport = () => {
    window.print();
  };

  // Submit Consultation
  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultTopic.trim() || !consultMessage.trim()) return;

    submitConsultationRequest({
      parentId: activeParent.id,
      parentName: activeParent.fullName,
      parentPhone: activeParent.phone,
      studentId: selectedChild.id,
      studentName: selectedChild.name,
      targetRole: consultTargetRole,
      preferredDate: consultDate,
      preferredTime: consultTime,
      topic: consultTopic.trim(),
      message: consultMessage.trim()
    });

    setConsultSuccessMsg(`Consultation request with the ${consultTargetRole} successfully submitted! The administration desk will confirm your appointment via SMS.`);
    setShowConsultModal(false);
    setConsultTopic('');
    setConsultMessage('');
    setTimeout(() => setConsultSuccessMsg(''), 6000);
  };

  // Submit Fee Payment
  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || paymentAmount <= 0) return;

    const ref = paymentReference.trim() || `NIP/STX/${Date.now().toString().slice(-6)}`;
    const rec = recordFeePayment({
      receiptNumber: `REC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: selectedChild.id,
      studentName: selectedChild.name,
      regNumber: selectedChild.regNumber,
      grade: selectedChild.grade,
      amount: Number(paymentAmount),
      term: termResumptionConfig?.termName || schoolInfo.activeTerm,
      session: termResumptionConfig?.session || schoolInfo.activeSession,
      paymentMethod,
      reference: ref,
      paymentDate: new Date().toISOString().split('T')[0]
    });

    setPaymentSuccessMsg(`Payment receipt #${rec.receiptNumber} recorded! Thank you. Bursary clearance status updated.`);
    setShowPaymentModal(false);
    setPaymentReference('');
    setTimeout(() => setPaymentSuccessMsg(''), 6000);
  };

  // Filter child-specific records
  const childSickBayVisits = sickBayLogs.filter(log => 
    log.studentId === selectedChild.id || log.regNumber === selectedChild.regNumber
  );

  const childFeePayments = feePayments.filter(f => 
    f.studentId === selectedChild.id || f.regNumber === selectedChild.regNumber
  );

  const myConsultations = consultationRequests.filter(req => 
    req.parentId === activeParent.id || req.studentId === selectedChild.id
  );

  // Child timetable — join by classId first, name fallback
  const childClassObj = classes.find(c => c.id === selectedChild.classId)
    || classes.find(c => c.name.toLowerCase() === selectedChild.grade.toLowerCase());
  const childTimetable = timetables.find(t => (childClassObj && t.classId === childClassObj.id) || (selectedChild.classId && t.classId === selectedChild.classId))
    || timetables.find(t => t.className.toLowerCase() === selectedChild.grade.toLowerCase());

  // Navigation Items
  const parentNav = [
    { id: 'overview' as const, label: 'Ward Overview', icon: Users },
    { id: 'academics' as const, label: 'Continuous Assessment & Reports', icon: Award },
    { id: 'fees' as const, label: 'Bursary & Fee Clearance', icon: CreditCard },
    { id: 'health' as const, label: 'Clinic & Health Log', icon: HeartPulse, badge: childSickBayVisits.length || undefined },
    { id: 'bus' as const, label: 'Live Bus GPS Fleet', icon: Bus },
    { id: 'timetable' as const, label: 'Weekly Class Schedule', icon: Calendar },
    { id: 'consultation' as const, label: 'Faculty Consultations', icon: MessageSquare, badge: myConsultations.filter(c => c.status === 'Approved').length || undefined },
    { id: 'chat' as const, label: 'School Community & Tutors Chat', icon: MessageSquare },
    { id: 'gallery' as const, label: 'Campus & Events Gallery', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 font-['Nunito',sans-serif] flex flex-col">
      {/* Top Universal Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <SchoolLogo size="sm" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-stone-900 leading-tight">
                {schoolInfo.name} Parent Portal
              </span>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300">
                Guardian Link
              </span>
            </div>
            <div className="text-[11px] font-bold text-stone-500">
              Welcome, {activeParent.fullName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToWebsite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
          <button
            type="button"
            onClick={() => {
              logoutParent();
              onBackToWebsite();
            }}
            className="px-4 py-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Child Selector & Resumption Banner */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-extrabold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Student Record Synchronized</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Family Dashboard: {selectedChild.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Monitor academic attendance, grade assessments, medical sickbay incidents, and bursary clearances across all school terms.
            </p>
          </div>

          {/* Child Switcher if multiple children */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-xs font-black text-stone-600 uppercase tracking-wider">Select Ward:</span>
            <div className="flex flex-wrap gap-2">
              {linkedChildren.map(child => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                    selectedChildId === child.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{child.name.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-80">({child.grade})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Success Banners */}
        {consultSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{consultSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setConsultSuccessMsg('')}
              className="text-emerald-700 hover:text-emerald-950 text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {paymentSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setPaymentSuccessMsg('')}
              className="text-emerald-700 hover:text-emerald-950 text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
          {parentNav.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-stone-900 text-white shadow-xs' 
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-amber-400 text-stone-950' : 'bg-red-100 text-red-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: WARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-black uppercase tracking-wider">Attendance Rate</span>
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {selectedChild.attendancePercentage || 96}%
                </div>
                <div className="text-xs font-bold text-stone-500">
                  {selectedChild.attendanceDays || 58} days attended of {selectedChild.totalSchoolDays || 60} days
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-black uppercase tracking-wider">Class Standing</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {selectedChild.overallPosition || '1st in Class'}
                </div>
                <div className="text-xs font-bold text-stone-500">
                  Term Average: <strong className="text-stone-900">{selectedChild.cumulativeAverage || 89.4}%</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-black uppercase tracking-wider">Bursary Status</span>
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {selectedChild.feeStatus || 'Fully Paid'}
                </div>
                <div className="text-xs font-bold text-stone-500">
                  Outstanding: ₦{(selectedChild.feeBalance || 0).toLocaleString()}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-[11px] font-black uppercase tracking-wider">Sickbay Incidents</span>
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-black text-stone-900">
                  {childSickBayVisits.length} Visit{childSickBayVisits.length !== 1 ? 's' : ''}
                </div>
                <div className="text-xs font-bold text-stone-500">
                  Current Term Health Clearance
                </div>
              </div>
            </div>

            {/* Ward Profile Card & Principal's Remark */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-4">
                  {(selectedChild.passportPhoto || selectedChild.passportUrl) ? (
                    <img 
                      src={selectedChild.passportPhoto || selectedChild.passportUrl} 
                      alt={selectedChild.name} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xl border-2 border-amber-300">
                      {selectedChild.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-base text-stone-900">{selectedChild.name}</h3>
                    <p className="text-xs font-bold text-red-600">{selectedChild.regNumber}</p>
                    <p className="text-xs font-medium text-stone-500">{selectedChild.grade} • {selectedChild.gender || 'Male'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Class Enrolled:</span>
                    <span className="font-bold text-stone-900">{selectedChild.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">House Color:</span>
                    <span className="font-bold text-stone-900">{selectedChild.house || 'Blue Sapphire House'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Academic Session:</span>
                    <span className="font-bold text-stone-900">{termResumptionConfig?.session || schoolInfo.activeSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Active Term:</span>
                    <span className="font-bold text-amber-700">{termResumptionConfig?.termName || schoolInfo.activeTerm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Term Start Date:</span>
                    <span className="font-bold text-stone-900">{termResumptionConfig?.termStartDate || schoolInfo.resumptionDate}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConsultModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Book Faculty Consultation</span>
                  </button>
                </div>
              </div>

              {/* Remarks & School Advisories */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-stone-900 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-600" />
                      <span>Form Master & Principal Evaluations</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handlePrintChildReport}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Summary</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="text-[11px] font-black uppercase text-amber-900">Form Master / Class Teacher Remark</div>
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      "{selectedChild.teacherRemark || `${selectedChild.name} continues to exhibit high intellectual curiosity and disciplined class participation across all subjects. Outstanding role model.`}"
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <div className="text-[11px] font-black uppercase text-stone-600">Principal / Head of Academics Endorsement</div>
                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      "{selectedChild.principalRemark || 'An exemplary scholar maintaining top tier marks. Promoted with distinction to the honors honor roll.'}"
                    </p>
                  </div>
                </div>

                {/* Recent School Notices for Parents */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <h3 className="font-black text-stone-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Important School Bulletins for Parents</span>
                  </h3>
                  <div className="space-y-3">
                    {notices.slice(0, 3).map(notice => (
                      <div key={notice.id} className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100/70 transition border border-stone-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-stone-900 truncate">{notice.title}</span>
                            <span className="text-[10px] text-stone-400 shrink-0">{notice.date}</span>
                          </div>
                          <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">{notice.content || notice.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMICS & REPORT SHEET */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            {/* Report card kind selector — mirrors the scholar portal gate */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs w-fit">
              <button
                type="button"
                onClick={() => setReportCardKind('mid')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  reportCardKind === 'mid'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {!midPublished && <Lock className="w-3 h-3" />}
                <span>Mid-Term (CA 1 + CA 2)</span>
              </button>
              <button
                type="button"
                onClick={() => setReportCardKind('end')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  reportCardKind === 'end'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {!endPublished && <Lock className="w-3 h-3" />}
                <span>End-of-Term (CA 1–3 + Exam)</span>
              </button>
            </div>

            {!kindPublished ? (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-stone-900 mt-4">
                  {isMidSheet ? 'Mid-Term' : 'End-of-Term'} Results Not Yet Published
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  The school administration is still collating and moderating scores. {selectedChild.name}'s report card will appear here automatically once officially released.
                </p>
              </div>
            ) : (
            <>
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-stone-900">
                  Continuous Assessment Breakdown & Report Card
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedChild.name} • {selectedChild.grade} • {termResumptionConfig?.termName || schoolInfo.activeTerm}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintChildReport}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download {isMidSheet ? 'Mid-Term Report' : 'Official Terminal Dossier'}</span>
                </button>
              </div>
            </div>

            {/* Assessment Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-black uppercase text-[11px]">
                      <th className="py-3.5 px-4">Subject</th>
                      <th className="py-3.5 px-3 text-center">1st CA ({assessmentConfig.ca1Max ?? 10})</th>
                      <th className="py-3.5 px-3 text-center">2nd CA ({assessmentConfig.ca2Max ?? 10})</th>
                      {!isMidSheet && (
                        <>
                          <th className="py-3.5 px-3 text-center">3rd CA ({assessmentConfig.ca3Max ?? 10})</th>
                          <th className="py-3.5 px-3 text-center">Exam ({assessmentConfig.examMax ?? 70})</th>
                        </>
                      )}
                      <th className="py-3.5 px-3 text-center">{isMidSheet ? 'Mid Total (20)' : 'Total (100)'}</th>
                      <th className="py-3.5 px-3 text-center">Grade</th>
                      <th className="py-3.5 px-4">Subject Tutor Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(selectedChild.grades || []).map((gradeRecord, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/70 transition">
                        <td className="py-3 px-4 font-black text-stone-900">{gradeRecord.subject}</td>
                        <td className="py-3 px-3 text-center font-bold text-stone-700">{gradeRecord.ca1}</td>
                        <td className="py-3 px-3 text-center font-bold text-stone-700">{gradeRecord.ca2}</td>
                        {!isMidSheet && (
                          <>
                            <td className="py-3 px-3 text-center font-bold text-stone-700">{gradeRecord.ca3 ?? 0}</td>
                            <td className="py-3 px-3 text-center font-bold text-stone-700">{gradeRecord.exam}</td>
                          </>
                        )}
                        <td className="py-3 px-3 text-center font-black text-stone-950">
                          {isMidSheet
                            ? `${(gradeRecord.ca1 ?? 0) + (gradeRecord.ca2 ?? 0)}/20`
                            : gradeRecord.total}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-md font-black text-[11px] ${
                            gradeRecord.grade === 'A1' ? 'bg-emerald-100 text-emerald-800' :
                            gradeRecord.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            gradeRecord.grade.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                            'bg-stone-100 text-stone-800'
                          }`}>
                            {gradeRecord.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-600 italic text-[11px]">{gradeRecord.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* TAB 3: BURSARY & FEES */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-stone-900">Bursary Clearance & Payment Invoices</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Track tuition receipts, outstanding school dues, and submit electronic payment evidence.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>Submit School Fee Payment</span>
              </button>
            </div>

            {/* Fee summary card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-black uppercase text-stone-400 block mb-1">Approved Term Tuition</span>
                <span className="text-2xl font-black text-stone-900">
                  ₦{(selectedChild.feeTotal || 0).toLocaleString()}
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  Tuition, ICT labs, STEM workshops & sports levy
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-black uppercase text-stone-400 block mb-1">Amount Cleared & Verified</span>
                <span className="text-2xl font-black text-emerald-600">
                  ₦{(selectedChild.feePaid || 0).toLocaleString()}
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  Verified by Stanbax Accounts Desk
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-black uppercase text-stone-400 block mb-1">Current Term Balance</span>
                <span className={`text-2xl font-black ${(selectedChild.feeBalance || 0) > 0 ? 'text-red-600' : 'text-stone-900'}`}>
                  ₦{(selectedChild.feeBalance || 0).toLocaleString()}
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  {(selectedChild.feeBalance || 0) <= 0 ? 'Fully Cleared for Term' : 'Payment Due Before Exams'}
                </p>
              </div>
            </div>

            {/* Fee Receipts Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-black text-xs text-stone-800 uppercase tracking-wider">Payment Transaction History</h3>
                <span className="text-[11px] text-stone-400">{childFeePayments.length} Registered Transactions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-black uppercase text-[11px]">
                      <th className="py-3 px-4">Receipt #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {childFeePayments.length > 0 ? (
                      childFeePayments.map(p => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="py-3 px-4 font-black text-stone-900">{p.receiptNumber}</td>
                          <td className="py-3 px-4 text-stone-600">{p.paymentDate}</td>
                          <td className="py-3 px-4 font-bold text-stone-700">{p.paymentMethod}</td>
                          <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">{p.reference}</td>
                          <td className="py-3 px-4 text-right font-black text-stone-950">₦{p.amount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptPayment(p)}
                              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-[10px] transition cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                              title="Generate Official Bursary Receipt & Clearance Certificate"
                            >
                              <ShieldCheck className="w-3 h-3 text-amber-700" />
                              <span>View Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-400 font-bold">
                          No previous fee payments found for this scholar profile.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLINIC & HEALTH LOG */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-stone-900">Clinic & Sick-Bay Treatment Logs</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time health center logs logged by the school nursing staff for {selectedChild.name}.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>School Clinic Open 24/7 with Qualified Registered Nurse</span>
              </div>
            </div>

            <div className="space-y-4">
              {emergencyBroadcastSent && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Emergency alert dispatched to Lead Registered Nurse on campus. The sick-bay desk will contact you via WhatsApp and phone immediately.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmergencyBroadcastSent(false)}
                    className="text-emerald-800 underline font-bold cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Scholar Clinical Baseline Vitals Card */}
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-black text-xs text-stone-800 uppercase tracking-wider">
                      Student Clinical Baseline Profile
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Certified by Stanbax School Clinic & Registered Nursing Directorate
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmergencyBroadcastSent(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Request Nurse Emergency Callback</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Blood Group</span>
                    <span className="font-black text-stone-900 text-sm">O+ (Rh Positive)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Genotype</span>
                    <span className="font-black text-stone-900 text-sm">AA (Verified)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Body Mass</span>
                    <span className="font-black text-stone-900 text-sm">49.5 kg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Allergies</span>
                    <span className="font-bold text-emerald-700 text-xs">None Reported</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Immunizations</span>
                    <span className="font-bold text-emerald-700 text-xs">Up to Date</span>
                  </div>
                </div>
              </div>

              {childSickBayVisits.length > 0 ? (
                childSickBayVisits.map(visit => (
                  <div key={visit.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[11px]">
                          {visit.visitDate}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          Time In: {visit.timeIn} {visit.timeOut ? `• Time Out: ${visit.timeOut}` : ''}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        visit.status === 'Discharged to Class' ? 'bg-emerald-100 text-emerald-800' :
                        visit.status === 'Sent Home with Parent' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {visit.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-stone-400 block text-[10px] uppercase">Symptoms Reported:</span>
                        <p className="font-bold text-stone-900 mt-0.5">{visit.symptoms}</p>
                      </div>
                      <div>
                        <span className="font-bold text-stone-400 block text-[10px] uppercase">Clinical Diagnosis:</span>
                        <p className="font-bold text-stone-900 mt-0.5">{visit.diagnosis || 'Under Observation'}</p>
                      </div>
                      <div>
                        <span className="font-bold text-stone-400 block text-[10px] uppercase">Treatment Administered:</span>
                        <p className="font-bold text-stone-900 mt-0.5">{visit.treatmentAdministered}</p>
                      </div>
                      <div>
                        <span className="font-bold text-stone-400 block text-[10px] uppercase">Vitals & Temperature:</span>
                        <p className="font-bold text-stone-900 mt-0.5">{visit.temperatureCelsius ? `${visit.temperatureCelsius}°C` : 'Normal body temperature'}</p>
                      </div>
                    </div>

                    {visit.nurseNotes && (
                      <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 italic border border-stone-100">
                        <strong>Nurse Note:</strong> {visit.nurseNotes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-2">
                  <HeartPulse className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-black text-stone-800 text-sm">No Sick-Bay Visits Cataloged</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {selectedChild.name} has maintained a stellar health and attendance record with zero medical emergency incidents this term.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4B: LIVE BUS GPS FLEET TRACKER */}
        {activeTab === 'bus' && (
          <BusFleetTracker />
        )}

        {/* TAB 5: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-stone-900">Weekly Class Timetable & Bell Schedule</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Class timetable for {selectedChild.grade} • Mon - Fri (08:00 AM - 03:30 PM)
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrintChildReport}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bell Timetable</span>
              </button>
            </div>

            {childTimetable ? (
              <div className="space-y-4">
                {childTimetable.schedule.map(daySchedule => (
                  <div key={daySchedule.day} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                    <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span>{daySchedule.day}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {daySchedule.periods.map(period => (
                        <div 
                          key={period.id} 
                          className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                            period.isBreak 
                              ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                              : 'bg-stone-50 border-stone-200 text-stone-900'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold">
                            <span>Period {period.periodNumber}</span>
                            <span>{period.startTime} - {period.endTime}</span>
                          </div>
                          <div className="font-black text-stone-900">{period.subject}</div>
                          {!period.isBreak && (
                            <div className="text-[11px] text-stone-500 font-medium">
                              Tutor: {period.tutorName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-2">
                <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-black text-stone-800 text-sm">Class Timetable Available with Form Master</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  The official weekly bell schedule for {selectedChild.grade} is posted on the classroom notice board.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CONSULTATIONS */}
        {activeTab === 'consultation' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-stone-900">Faculty Consultations & Parent-Teacher Sessions</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Request one-on-one appointments with class teachers, counselors, or the principal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConsultModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Request New Appointment</span>
              </button>
            </div>

            <div className="space-y-4">
              {myConsultations.length > 0 ? (
                myConsultations.map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-black text-stone-900 text-sm">{req.topic}</span>
                        <p className="text-xs text-stone-500">
                          With: <strong>{req.targetRole}</strong> {req.recipientName ? `(${req.recipientName})` : ''} • Ward: {req.studentName}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'Declined' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">
                      "{req.message}"
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-stone-500 font-bold pt-1">
                      <span>Preferred Date: {req.preferredDate}</span>
                      <span>•</span>
                      <span>Time: {req.preferredTime}</span>
                    </div>

                    {req.adminResponse && (
                      <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-bold border border-emerald-200">
                        <strong>Official School Confirmation:</strong> {req.adminResponse}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-2">
                  <MessageSquare className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="font-black text-stone-800 text-sm">No Pending Consultation Bookings</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Need to discuss academic progression, university track, or pastoral care? Click the button above to book an appointment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SCHOOL COMMUNITY & CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-900/50">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>PTA, Faculty & Ward Communications</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Parent Community & Direct Tutor Desk
                </h2>
                <p className="text-xs text-stone-300 max-w-xl">
                  Connect directly with teachers, engage in the Parents & Teachers Association (PTA) channel, and receive administrative announcements.
                </p>
              </div>
            </div>

            <SchoolChatSystem
              currentUserRole="parent"
              currentUserId={activeParent.id}
              currentUserName={activeParent.fullName}
              currentUserSubtext={`Guardian of ${selectedChild.name} (${selectedChild.grade})`}
            />
          </div>
        )}

        {/* TAB 8: CAMPUS & EVENTS GALLERY */}
        {activeTab === 'gallery' && (
          <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white shadow-xs">
            <CampusGallery showAdminControls={false} />
          </div>
        )}

      </div>

      {/* MODAL: Book Consultation */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span>Schedule Consultation: {selectedChild.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowConsultModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Target Faculty / Staff Member</label>
                <select
                  value={consultTargetRole}
                  onChange={e => setConsultTargetRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white text-stone-800"
                >
                  <option value="Class Teacher">Designated Class Teacher (Form Master/Mistress)</option>
                  <option value="Guidance Counselor">College Guidance Counselor & Career Advisor</option>
                  <option value="Principal">School Principal & Academic Director</option>
                  <option value="School Nurse">School Clinic Nurse (Health & Dietary)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Consultation Topic / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Term assessment performance, Cambridge IGCSE track, etc."
                  value={consultTopic}
                  onChange={e => setConsultTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={consultDate}
                    onChange={e => setConsultDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Preferred Time</label>
                  <select
                    value={consultTime}
                    onChange={e => setConsultTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Detailed Message / Inquiry</label>
                <textarea
                  rows={3}
                  placeholder="Share details regarding your discussion points..."
                  value={consultMessage}
                  onChange={e => setConsultMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConsultModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Appointment Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Submit Fee Payment */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Submit Fee Payment: {selectedChild.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMakePayment} className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-stone-400">Designated School Bank Account</span>
                <p className="font-black text-stone-900 text-sm">Stanbax Schools Bursary Clearance</p>
                <p className="text-stone-600 font-bold">First Bank of Nigeria • Acct: 2045981122</p>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-black text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold bg-white"
                >
                  <option value="Bank Transfer">Direct Bank Transfer (NIP)</option>
                  <option value="Online WebPay">Online WebPay / Card Gateway</option>
                  <option value="POS">Bursary Terminal POS</option>
                  <option value="Direct Deposit">Bank Branch Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Transaction Reference / Teller Number</label>
                <input
                  type="text"
                  placeholder="e.g. NIP/STANBAX/2026/0921"
                  value={paymentReference}
                  onChange={e => setPaymentReference(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Payment for Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Bursary Fee Receipt & Clearance Certificate Modal */}
      {selectedReceiptPayment && (
        <FeeReceiptModal
          payment={selectedReceiptPayment}
          student={selectedChild}
          schoolInfo={schoolInfo}
          onClose={() => setSelectedReceiptPayment(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-xs text-stone-500 border-t border-stone-200">
        <p>© {new Date().getFullYear()} {schoolInfo.name}. Parent Portal & Family Academic Gateway.</p>
      </footer>
    </div>
  );
};
