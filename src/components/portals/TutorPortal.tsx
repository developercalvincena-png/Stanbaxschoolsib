import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { PortalLoginPage } from '../PortalLoginPage';
import { AiExamCreatorTab } from './tutor/AiExamCreatorTab';
import { TutorLessonNotesTab } from './tutor/TutorLessonNotesTab';
import { StaffProfileAndSignatureTab } from './tutor/StaffProfileAndSignatureTab';
import { Crown, Camera, UserCheck } from 'lucide-react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Save, 
  Award, 
  FileText, 
  AlertCircle,
  Lock,
  ShieldCheck,
  RotateCcw,
  Sliders,
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  MessageSquare,
  Layers,
  Send,
  Sparkles
} from '../RealIcons';
import { SchoolChatSystem } from '../chat/SchoolChatSystem';
import { DualCurriculumMatrix } from './DualCurriculumMatrix';
import { ReportCardWhatsAppDispatcher } from './ReportCardWhatsAppDispatcher';
import { VirtualScienceLab } from './VirtualScienceLab';

interface TutorPortalProps {
  onBackToWebsite: () => void;
}

export const TutorPortal: React.FC<TutorPortalProps> = ({ onBackToWebsite }) => {
  const { 
    tutor, 
    tutors, 
    student,
    students,
    updateGrade, 
    addHomework, 
    homeworks,
    schoolInfo,
    calculateGrade,
    assessmentConfig,
    isTutorAuthenticated,
    isAdminAuthenticated,
    logoutTutor,
    completeTutorProfile,
    changePassword,
    subjects,
    classes,
    attendanceRecords,
    termResumptionConfig,
    submitDailyAttendance,
    getClassAttendanceSummary,
    getStudentAttendanceSummary,
    getTotalUnreadCount,
    consultationRequests,
    updateConsultationStatus
  } = useSchool();

  const tutorChatUnread = tutor ? getTotalUnreadCount(tutor.id) : 0;

  // If faculty is not authenticated, delegate to unified PortalLoginPage
  if (!isTutorAuthenticated) {
    return (
      <PortalLoginPage
        onBackToWebsite={onBackToWebsite}
      />
    );
  }

  const [tutorTab, setTutorTab] = useState<'gradebook' | 'ai_exam_creator' | 'lesson_notes' | 'dual_curriculum' | 'whatsapp_reports' | 'sciencelab' | 'homework' | 'attendance' | 'timetable' | 'consultations' | 'staff_profile' | 'chat'>('gradebook');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Active enrolled scholars in class (ex-students / alumni no longer show as part of the class)
  const activeClassStudents = students.filter(s => !s.isAlumni);

  // Scholar selector for grading
  const [selectedScholarId, setSelectedScholarId] = useState<string>(activeClassStudents[0]?.id || student.id);
  const activeScholar = activeClassStudents.find(s => s.id === selectedScholarId) || activeClassStudents[0] || student;
  // Gradebook of the scholar currently selected for scoring
  const scholarGrades = activeScholar.grades || [];

  // Class teacher designation (designated teacher in charge of a specific class / form master)
  const assignedClassesAsTeacher = classes.filter(c => c.classTeacherId === tutor.id);
  const isClassTeacher = assignedClassesAsTeacher.length > 0;
  const primaryAssignedClass = assignedClassesAsTeacher[0] || null;
  const assignedClassAsTeacher = primaryAssignedClass;

  // Tutor Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentTutorPass, setCurrentTutorPass] = useState('');
  const [newTutorPass, setNewTutorPass] = useState('');
  const [confirmTutorPass, setConfirmTutorPass] = useState('');
  const [showPassText, setShowPassText] = useState(false);
  const [tutorPassMsg, setTutorPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Profile completion state for newly upgraded tutors
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(tutor.profileCompleted === false);
  const [onboardDept, setOnboardDept] = useState(tutor.department || 'Sciences & STEM Faculty');
  const [onboardRole, setOnboardRole] = useState(tutor.role || 'Subject Teacher');
  const [onboardQual, setOnboardQual] = useState(tutor.qualification || 'B.Sc / B.Ed, TRCN Certified');
  const [onboardPhone, setOnboardPhone] = useState(tutor.phone || '+234 803 000 0000');
  const [onboardBio, setOnboardBio] = useState(tutor.bio || 'Dedicated Stanbax educator committed to student excellence.');
  const [onboardSubjects, setOnboardSubjects] = useState<string[]>(tutor.assignedSubjects || []);
  const [onboardClasses, setOnboardClasses] = useState<string[]>(tutor.assignedClasses || []);
  const [onboardSuccess, setOnboardSuccess] = useState('');

  // Keep modal open if profile is not completed
  useEffect(() => {
    if (tutor.profileCompleted === false) {
      setShowCompleteProfileModal(true);
    }
  }, [tutor.id, tutor.profileCompleted]);

  // Close side menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when side menu is open
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSideMenuOpen]);

  // Permitted subjects clearance
  const permittedSubjects = tutor.assignedSubjects || [];
  const hasSubjectClearance = permittedSubjects.length > 0;

  // Selected subject for scoring
  const [selectedSubject, setSelectedSubject] = useState<string>(
    permittedSubjects[0] || (scholarGrades[0]?.subject ?? 'Physics')
  );

  // Sync selected subject if tutor changes
  useEffect(() => {
    if (permittedSubjects.length > 0 && !permittedSubjects.includes(selectedSubject)) {
      setSelectedSubject(permittedSubjects[0]);
    }
  }, [tutor.id, permittedSubjects]);

  const activeRecord = scholarGrades.find(g => g.subject.toLowerCase() === selectedSubject.toLowerCase()) || scholarGrades[0] || {
    subject: selectedSubject,
    ca1: 8,
    ca2: 8,
    ca3: 8,
    exam: 60,
    total: 84,
    grade: 'A1',
    remark: 'Distinction'
  };
  
  const [ca1Input, setCa1Input] = useState<number>(activeRecord.ca1);
  const [ca2Input, setCa2Input] = useState<number>(activeRecord.ca2);
  const [ca3Input, setCa3Input] = useState<number>(activeRecord.ca3 ?? 8);
  const [examInput, setExamInput] = useState<number>(activeRecord.exam);
  const [gradeSaveMsg, setGradeSaveMsg] = useState<string>('');

  // Keep inputs synced when subject changes
  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    const rec = scholarGrades.find(g => g.subject.toLowerCase() === subj.toLowerCase());
    if (rec) {
      setCa1Input(rec.ca1);
      setCa2Input(rec.ca2);
      setCa3Input(rec.ca3 ?? 8);
      setExamInput(rec.exam);
    }
  };

  // Reload the score sheet whenever a different scholar or subject is chosen
  useEffect(() => {
    const rec = scholarGrades.find(g => g.subject.toLowerCase() === selectedSubject.toLowerCase());
    setCa1Input(rec?.ca1 ?? 0);
    setCa2Input(rec?.ca2 ?? 0);
    setCa3Input(rec?.ca3 ?? 0);
    setExamInput(rec?.exam ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScholar.id, selectedSubject]);

  const activePhase = assessmentConfig.activePhase;
  const isMidTermOnly = activePhase === 'mid_term_ca';
  const isTerminalExam = activePhase === 'terminal_exam';
  const isClosed = activePhase === 'closed';

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) {
      alert('Assessment entry is currently locked by the School Administration.');
      return;
    }
    if (!permittedSubjects.includes(selectedSubject)) {
      alert(`Security Restriction: You are not assigned to score ${selectedSubject}. Only authorized tutors may score this subject.`);
      return;
    }

    updateGrade(
      selectedSubject, 
      Number(ca1Input), 
      Number(ca2Input), 
      Number(examInput), 
      Number(ca3Input), 
      activeScholar.id
    );

    const calculatedTotal = isMidTermOnly 
      ? Number(ca1Input) + Number(ca2Input)
      : Number(ca1Input) + Number(ca2Input) + Number(ca3Input) + Number(examInput);

    const midMax = (assessmentConfig.ca1Max ?? 10) + (assessmentConfig.ca2Max ?? 10);
    setGradeSaveMsg(`Successfully recorded official score for ${selectedSubject} (${calculatedTotal}${isMidTermOnly ? `/${midMax} Mid-Term` : '%'}) for ${activeScholar.name}!`);
    setTimeout(() => setGradeSaveMsg(''), 3500);
  };

  // Homework creation state
  const [newHwSubject, setNewHwSubject] = useState<string>(permittedSubjects[0] || 'Physics');
  const [newHwTitle, setNewHwTitle] = useState('');
  const [newHwDueDate, setNewHwDueDate] = useState('');
  const [newHwInstructions, setNewHwInstructions] = useState('');
  const [hwSuccessMsg, setHwSuccessMsg] = useState('');

  useEffect(() => {
    if (permittedSubjects.length > 0 && !permittedSubjects.includes(newHwSubject)) {
      setNewHwSubject(permittedSubjects[0]);
    }
  }, [tutor.id, permittedSubjects]);

  const handleCreateHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permittedSubjects.includes(newHwSubject)) {
      alert(`Security Restriction: You cannot create homework for ${newHwSubject}. You are only cleared for: ${permittedSubjects.join(', ')}`);
      return;
    }
    if (!newHwTitle.trim() || !newHwInstructions.trim()) return;
    addHomework({
      subject: newHwSubject,
      title: newHwTitle.trim(),
      targetClass: primaryAssignedClass?.name || tutor.assignedClasses?.[0],
      targetClassId: primaryAssignedClass?.id,
      dueDate: newHwDueDate || 'Friday, 4:00 PM',
      instructions: newHwInstructions.trim(),
      assignedBy: tutor.name
    });
    setNewHwTitle('');
    setNewHwInstructions('');
    setNewHwDueDate('');
    setHwSuccessMsg(`New assignment for ${newHwSubject} published to student portal!`);
    setTimeout(() => setHwSuccessMsg(''), 3500);
  };

  // Attendance System State (Daily School Presence / Roll Call)
  const defaultClassId = primaryAssignedClass?.id || classes[0]?.id || 'cls-14';
  const [selectedAttendanceClassId, setSelectedAttendanceClassId] = useState<string>(defaultClassId);

  // If tutor is an appointed class teacher, keep focus on their designated classroom
  useEffect(() => {
    if (isClassTeacher && primaryAssignedClass) {
      if (!assignedClassesAsTeacher.some(c => c.id === selectedAttendanceClassId)) {
        setSelectedAttendanceClassId(primaryAssignedClass.id);
      }
    }
  }, [tutor.id, isClassTeacher, primaryAssignedClass?.id]);

  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<string, 'Present' | 'Late' | 'Absent'>>({});
  const [attendanceRemarks, setAttendanceRemarks] = useState<Record<string, string>>({});
  const [attendanceSubmitted, setAttendanceSubmitted] = useState<boolean>(false);
  const [submittedSummary, setSubmittedSummary] = useState<any>(null);
  const [attendanceValidationError, setAttendanceValidationError] = useState<string | null>(null);

  // Selected Class & Permissions Check
  const selectedClassObj = classes.find(c => c.id === selectedAttendanceClassId) || classes[0];
  const isTeacherOfSelectedClass = Boolean(selectedClassObj && selectedClassObj.classTeacherId === tutor.id);
  const canMarkAttendance = isClassTeacher && isTeacherOfSelectedClass;
  const designatedTeacherOfSelectedClass = tutors.find(t => t.id === selectedClassObj?.classTeacherId);

  const classStudentsForAttendance = students.filter(s => {
    if (s.isAlumni) return false;
    const g = (s.grade || '').toLowerCase();
    const targetName = (selectedClassObj?.name || '').toLowerCase();
    return g.includes(targetName) || targetName.includes(g) || s.classId === selectedAttendanceClassId;
  });
  const effectiveStudentsList = classStudentsForAttendance.length > 0 
    ? classStudentsForAttendance 
    : activeClassStudents.slice(0, 8);

  // Term resumption calculation
  // "When term resumes, it starts from the first day after admin starts a new term or set the date, then teachers start marking attendance…"
  const termResumptionDateStr = termResumptionConfig?.termStartDate || schoolInfo.resumptionDate || '2026-09-15';
  const termEndDateStr = termResumptionConfig?.termEndDate || schoolInfo.vacationDate || '2026-12-18';
  const resumptionDateObj = new Date(termResumptionDateStr);
  const selectedDateObj = new Date(attendanceDate);
  const diffTime = selectedDateObj.getTime() - resumptionDateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const isBeforeResumption = diffDays < 1;
  const isAfterTermEnd = termEndDateStr ? (new Date(attendanceDate) > new Date(termEndDateStr)) : false;
  const isWithinActiveTerm = !isBeforeResumption && !isAfterTermEnd;
  const currentDayNumber = Math.max(1, diffDays > 0 ? diffDays : 1);

  // Initialize or load statuses when class or date changes
  useEffect(() => {
    const existing = attendanceRecords.find(
      r => (r.classId === selectedAttendanceClassId || r.className?.toLowerCase() === selectedClassObj?.name?.toLowerCase()) &&
           r.date === attendanceDate
    );
    if (existing) {
      const statusMap: Record<string, 'Present' | 'Late' | 'Absent'> = {};
      existing.studentsAttendance.forEach(entry => {
        statusMap[entry.studentId] = entry.status;
      });
      setAttendanceStatuses(statusMap);
      setAttendanceSubmitted(true);
      setSubmittedSummary(getClassAttendanceSummary(selectedAttendanceClassId));
    } else {
      const initialMap: Record<string, 'Present' | 'Late' | 'Absent'> = {};
      effectiveStudentsList.forEach(s => {
        initialMap[s.id] = 'Present';
      });
      setAttendanceStatuses(initialMap);
      setAttendanceSubmitted(false);
      // Still show existing term summary if any records exist
      const existingSummary = getClassAttendanceSummary(selectedAttendanceClassId);
      if (existingSummary.totalDaysMarked > 0) {
        setSubmittedSummary(existingSummary);
      } else {
        setSubmittedSummary(null);
      }
    }
  }, [selectedAttendanceClassId, attendanceDate, attendanceRecords.length]);

  const toggleStudentStatus = (studentId: string) => {
    if (!canMarkAttendance) return;
    setAttendanceStatuses(prev => {
      const current = prev[studentId] || 'Present';
      const next = current === 'Present' ? 'Late' : current === 'Late' ? 'Absent' : 'Present';
      return { ...prev, [studentId]: next };
    });
  };

  const markAllStudents = (status: 'Present' | 'Late' | 'Absent') => {
    if (!canMarkAttendance) return;
    const newMap: Record<string, 'Present' | 'Late' | 'Absent'> = {};
    effectiveStudentsList.forEach(s => {
      newMap[s.id] = status;
    });
    setAttendanceStatuses(newMap);
  };

  const handleSubmitAttendance = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAttendanceValidationError(null);

    if (!canMarkAttendance) {
      alert('Only designated Class Teachers (Form Masters/Mistresses) are authorized to mark and submit daily school attendance.');
      return;
    }

    // Validation check: Prevent submission if the date selected is not within the current active term range
    if (isBeforeResumption) {
      const msg = `Attendance submission blocked: The selected date (${attendanceDate}) is before the current active term resumption start date (${termResumptionDateStr}). Attendance cannot be marked prior to term resumption.`;
      setAttendanceValidationError(msg);
      return;
    }

    if (isAfterTermEnd) {
      const msg = `Attendance submission blocked: The selected date (${attendanceDate}) is after the current active term closing/vacation date (${termEndDateStr}). Attendance cannot be marked outside the active term range.`;
      setAttendanceValidationError(msg);
      return;
    }

    const studentsAttendance = effectiveStudentsList.map(s => ({
      studentId: s.id,
      studentName: s.name,
      regNumber: s.regNumber,
      status: attendanceStatuses[s.id] || 'Present'
    }));

    submitDailyAttendance({
      classId: selectedAttendanceClassId,
      className: selectedClassObj?.name || 'Class',
      date: attendanceDate,
      dayNumber: currentDayNumber,
      term: termResumptionConfig?.termName || schoolInfo.activeTerm,
      session: termResumptionConfig?.session || schoolInfo.activeSession,
      submittedByTutorId: tutor.id,
      submittedByTutorName: tutor.name,
      studentsAttendance
    });

    const summary = getClassAttendanceSummary(selectedAttendanceClassId);
    setSubmittedSummary(summary);
    setAttendanceSubmitted(true);
  };

  const tutorModules = [
    { 
      id: 'gradebook' as const, 
      label: 'Continuous Assessment & Gradebook', 
      badge: 'Academic Scoring',
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
      icon: Award,
      description: 'Input CA1, CA2, CA3 & terminal exam marks with auto grade computation'
    },
    { 
      id: 'ai_exam_creator' as const, 
      label: 'AI Exam & Assessment Studio', 
      badge: 'Paper-Saving AI',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: FileText,
      description: 'Personalized AI exam synthesizer: Ages 3-6 pictorial items, Secondary 50 obj + 6 theory on single lines'
    },
    { 
      id: 'lesson_notes' as const, 
      label: 'Lesson Notes & Materials', 
      badge: 'Send Study Notes',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: BookOpen,
      description: 'Send study notes in text, PDF, Word docx, or diagrams to scholars'
    },
    { 
      id: 'dual_curriculum' as const, 
      label: 'Dual Curriculum Alignment Matrix', 
      badge: 'NERDC & Cambridge',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Layers,
      description: 'Crosswalk mapping Nigerian NERDC standards to Cambridge IGCSE and Checkpoint learning outcomes'
    },
    { 
      id: 'whatsapp_reports' as const, 
      label: 'WhatsApp Report Dispatcher', 
      badge: 'Parent WhatsApp',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Send,
      description: 'Instant dispatch of official terminal reports and CA dossiers directly to parent WhatsApp'
    },
    { 
      id: 'sciencelab' as const, 
      label: 'Virtual Science Lab Simulator', 
      badge: 'Practical Labs',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: Sparkles,
      description: 'Interactive STEM laboratory for Chemistry Titration, Physics Pendulum & Biology Photosynthesis'
    },
    { 
      id: 'homework' as const, 
      label: 'Assign & Manage Homework', 
      badge: `${homeworks.length} Active`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: BookOpen,
      description: 'Upload assignments, set deadlines & track class submission status'
    },
    { 
      id: 'attendance' as const, 
      label: 'Daily School Attendance Register', 
      badge: isClassTeacher ? 'Form Master' : 'Class Teachers Only',
      badgeColor: isClassTeacher 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
        : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: CheckCircle2,
      description: isClassTeacher 
        ? `Morning roll call: scholars present in school today for ${primaryAssignedClass?.name || 'your class'}` 
        : 'Morning roll call (students present in school each day — restricted to Class Teachers)'
    },
    { 
      id: 'timetable' as const, 
      label: 'Faculty Teaching Timetable', 
      badge: 'Weekly Schedule',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: Calendar,
      description: 'View designated lecture halls, period allocations & weekly calendar'
    },
    { 
      id: 'consultations' as const, 
      label: 'Parent Consultations & Appointments', 
      badge: `${consultationRequests.length} Inquiries`,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: MessageSquare,
      description: 'Review guardian meeting requests with Form Masters & Teachers, confirm schedules or propose alternate dates'
    },
    { 
      id: 'staff_profile' as const, 
      label: 'Staff Profile, Photo & Signature', 
      badge: tutor.signatureUrl ? 'Signature Verified' : 'Action Required',
      badgeColor: tutor.signatureUrl ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-400/20 text-amber-300 border-amber-400/30',
      icon: UserCheck,
      description: 'Upload official passport photograph, endorse digital signature & view administrative ranking'
    },
    { 
      id: 'chat' as const, 
      label: 'Staff Room & Community Chat', 
      badge: tutorChatUnread > 0 ? `${tutorChatUnread} New` : 'Interactive Hub',
      badgeColor: tutorChatUnread > 0 ? 'bg-rose-500 text-white border-rose-400 font-black animate-pulse' : 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: MessageSquare,
      description: 'Collaborate with faculty colleagues, interact with student class groups & communicate with parents'
    },
  ];

  const currentTutorModule = tutorModules.find(m => m.id === tutorTab) || tutorModules[0];
  const CurrentModuleIcon = currentTutorModule.icon;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Nunito',sans-serif]">
      {/* Tutor Header */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white sticky top-0 z-30 shadow-md border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Faculty Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setTutorTab('staff_profile')}
              title="View Staff Profile & Digital Signature"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md border border-amber-300 shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all"
            >
              {tutor.photoUrl ? (
                <img src={tutor.photoUrl} alt={tutor.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm sm:text-base md:text-lg tracking-tight truncate">
                  STANBAX FACULTY PORTAL
                </span>
                {tutor.principalRole === 'principal_administrator' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase tracking-wider border border-amber-300 shrink-0 shadow-xs">
                    <Crown className="w-3 h-3 fill-blue-950" />
                    <span>Principal Administrator</span>
                  </span>
                )}
                {tutor.principalRole === 'principal_academics' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase tracking-wider border border-amber-300 shrink-0 shadow-xs">
                    <Crown className="w-3 h-3 fill-blue-950" />
                    <span>Principal Academics</span>
                  </span>
                )}
                <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full bg-blue-500/30 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-amber-400/30 shrink-0">
                  TRCN
                </span>
                {isClassTeacher ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-800/80 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30 shrink-0 shadow-xs">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>Class Teacher: {assignedClassesAsTeacher.map(c => c.name).join(', ')}</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-200 text-[10px] font-bold uppercase tracking-wider border border-blue-400/30 shrink-0">
                    Subject Specialist
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200 truncate hidden sm:block">
                Welcome, <strong>{tutor.name}</strong> • {tutor.role || 'Faculty Educator'} {tutor.principalRole && tutor.principalRole !== 'none' ? `• Appointed ${tutor.principalRole === 'principal_administrator' ? 'Principal Administrator' : 'Principal Academics'}` : ''}
              </p>
            </div>
          </div>

          {/* Corner Menu Bar Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Corner Side Menu Trigger Button */}
            <button
              onClick={() => setIsSideMenuOpen(true)}
              id="tutor-corner-menu-btn"
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-blue-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer border border-amber-300 active:scale-95"
              aria-label="Open Faculty Navigation Menu"
            >
              <Menu className="w-4 h-4 text-blue-950 stroke-[2.5]" />
              <span>Menu</span>
            </button>

            <button
              onClick={() => {
                logoutTutor();
                onBackToWebsite();
              }}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer border border-rose-700/50 shadow-sm"
              title="Sign Out of Faculty Workspace"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Sleek Active Module Strip (Replaces horizontal tab bar) */}
        <div className="bg-blue-950/80 border-t border-blue-800/60 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-blue-300 font-bold shrink-0 hidden xs:inline">Current Module:</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300 font-extrabold text-xs truncate">
                <CurrentModuleIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{currentTutorModule.label}</span>
                {currentTutorModule.badge && (
                  <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-400/25 text-amber-200 font-bold ml-1">
                    {currentTutorModule.badge}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors py-0.5 shrink-0"
            >
              <span className="hidden sm:inline">Browse Faculty Modules</span>
              <span className="sm:hidden">Change</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </header>

      {/* HIDDEN SIDE MENU DRAWER */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-blue-950/75 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsSideMenuOpen(false)}
          />

          {/* Slide-out Side Menu from Corner */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md flex z-50">
            <div className="w-full bg-blue-950 text-white shadow-2xl border-l border-blue-800 flex flex-col h-full overflow-hidden">
              {/* Side Menu Header */}
              <div className="p-4 sm:p-5 border-b border-blue-800/80 flex items-center justify-between bg-blue-900/60 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-sm sm:text-base text-white">FACULTY MENU</h2>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-400/30 shrink-0">
                        TRCN
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-300 truncate">{tutor.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors cursor-pointer border border-blue-700 shrink-0 ml-2"
                  aria-label="Close Faculty Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tutor Details Card */}
              <div className="px-4 sm:px-5 py-3 bg-blue-900/30 border-b border-blue-800/60 text-xs space-y-1 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-300 font-bold shrink-0">Department:</span>
                  <span className="text-white font-black text-right truncate">{tutor.department}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-300 font-bold shrink-0">Role:</span>
                  <span className="text-amber-300 font-bold text-right truncate">{tutor.role}</span>
                </div>
                {permittedSubjects.length > 0 && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-blue-300 font-bold shrink-0">Authorized Subjects:</span>
                    <span className="text-emerald-300 font-bold text-[11px] text-right truncate">{permittedSubjects.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Scrollable Navigation List */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2 pb-6">
                <div className="px-2 pb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                    Faculty Workspaces ({tutorModules.length})
                  </span>
                </div>

                {tutorModules.map((item) => {
                  const Icon = item.icon;
                  const isActive = tutorTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setTutorTab(item.id);
                        setIsSideMenuOpen(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-amber-400 text-blue-950 font-black shadow-lg ring-2 ring-amber-300'
                          : 'bg-blue-900/40 hover:bg-blue-900/70 text-slate-100 border border-blue-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isActive
                              ? 'bg-blue-950 text-amber-400'
                              : 'bg-blue-800/80 text-amber-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                                  isActive
                                    ? 'bg-blue-950/20 text-blue-950 border-blue-950/30'
                                    : item.badgeColor
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isActive ? 'text-blue-950 font-medium' : 'text-blue-200'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-blue-950' : 'text-blue-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Side Menu Footer Actions */}
              <div className="p-4 border-t border-blue-800 bg-blue-950 space-y-2 shrink-0">
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onBackToWebsite();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-blue-700"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>View Public School Website</span>
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    logoutTutor();
                    onBackToWebsite();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-rose-700/50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sign Out & Exit Faculty Workspace</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tutor Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Tutor Info Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
                {tutor.department}
              </span>
              <span className="text-xs text-slate-500">• ID: {tutor.staffId}</span>
              <span className="text-xs font-bold text-slate-700">• {schoolInfo.activeSession} ({schoolInfo.activeTerm})</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">{tutor.name}</h2>
            <p className="text-xs text-slate-600">{tutor.qualification}</p>

            {/* Subject clearance badge */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-slate-500">Subject Clearance:</span>
              {hasSubjectClearance ? (
                permittedSubjects.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{s}</span>
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1">
                  <Lock className="w-3 h-3 text-rose-600" />
                  <span>No subjects assigned yet</span>
                </span>
              )}
            </div>
          </div>

          {/* Verified Staff Identity & Role (No Supervisor Switcher) */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end flex-wrap">
                <span className="text-xs font-mono font-black text-blue-950 bg-blue-100/90 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {tutor.staffId || 'FACULTY'}
                </span>
                {isClassTeacher ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Class Teacher: {assignedClassesAsTeacher.map(c => c.name).join(', ')}</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    Subject Specialist
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                {tutor.department} • {tutor.role || 'Faculty Educator'}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              <button
                onClick={() => setTutorTab('ai_exam_creator')}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Exam Studio</span>
              </button>
              {(tutor.assignedClasses || []).map((cls, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TAB 1: CONTINUOUS ASSESSMENT GRADEBOOK */}
        {tutorTab === 'gradebook' && (
          <div className="space-y-6">
            {/* Phase Status Notification Banner */}
            <div className={`p-4 sm:p-5 rounded-3xl border text-xs sm:text-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isMidTermOnly
                ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                : isTerminalExam
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-black ${
                  isMidTermOnly
                    ? 'bg-blue-900 text-white'
                    : isTerminalExam
                    ? 'bg-amber-500 text-blue-950'
                    : 'bg-slate-400 text-white'
                }`}>
                  {isClosed ? <Lock className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-black text-sm sm:text-base flex items-center gap-2">
                    <span>
                      {isMidTermOnly && 'Mid-Term CA Test Entry Active (CA 1 & 2 Only)'}
                      {isTerminalExam && 'End-of-Term Examination Active (CA 3 & Exam Entry)'}
                      {isClosed && 'Assessment Entry Currently Locked by Administration'}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                      {assessmentConfig.activeTerm} • {schoolInfo.activeSession}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">
                    {isMidTermOnly && 'Admin has opened Mid-Term tests. Enter 1st and 2nd CA tests; the system calculates the mid-term continuous assessment. Terminal exam inputs remain locked until exam period.'}
                    {isTerminalExam && 'Admin has opened Terminal Exams. 1st and 2nd CA test scores are permanently retained from mid-term (no re-entry needed!). Enter 3rd Test and Exam to compute the full term grade.'}
                    {isClosed && 'Gradebook inputs are locked for moderation and student report generation.'}
                  </p>
                </div>
              </div>

              {assessmentConfig.activeTerm === '3rd Term' && (
                <div className="px-3.5 py-2 rounded-2xl bg-amber-200/60 border border-amber-300/80 text-amber-950 font-black text-xs shrink-0 flex items-center gap-1.5 self-start md:self-auto">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>3rd Term: 3-Term Annual Average Active</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Grade Input Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5 h-fit">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>Score Continuous Assessment</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-bold">
                      {assessmentConfig.activeTerm}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a scholar and record verified assessment scores.
                  </p>
                </div>

                {/* Scholar Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Select Scholar to Grade *
                  </label>
                  <select
                    value={selectedScholarId}
                    onChange={(e) => setSelectedScholarId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-slate-50"
                  >
                    {activeClassStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade}) • {s.regNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {!hasSubjectClearance ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-black text-amber-800">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>Subject Clearance Required</span>
                    </div>
                    <p className="leading-relaxed">
                      You currently have no subjects assigned by the School Administrator. Tutors are restricted to scoring only their allocated curriculum subjects.
                    </p>
                  </div>
                ) : isClosed ? (
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-black text-slate-800">
                      <Lock className="w-4 h-4 text-slate-600" />
                      <span>Entry Closed</span>
                    </div>
                    <p className="leading-relaxed">
                      Grading entries are currently locked by the administrator. Contact the academic office to request an entry window.
                    </p>
                  </div>
                ) : (
                  <>
                    {gradeSaveMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{gradeSaveMsg}</span>
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900 text-[11px] font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>You are authorized to score: {permittedSubjects.join(', ')}</span>
                    </div>

                    <form onSubmit={handleSaveGrade} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Select Authorized Subject *
                        </label>
                        <select
                          value={selectedSubject}
                          onChange={(e) => handleSubjectChange(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white"
                        >
                          {permittedSubjects.map(subName => (
                            <option key={subName} value={subName}>{subName}</option>
                          ))}
                        </select>
                      </div>

                      {/* Input Fields Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* CA 1 */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-600">
                              1st CA Test ({assessmentConfig.ca1Max ?? 10})
                            </label>
                            {isTerminalExam && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                                Retained
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min={0}
                            max={assessmentConfig.ca1Max ?? 10}
                            required
                            disabled={isTerminalExam || isClosed}
                            value={ca1Input}
                            onChange={(e) => setCa1Input(Number(e.target.value))}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-center focus:ring-2 focus:ring-blue-800 ${
                              isTerminalExam 
                                ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>

                        {/* CA 2 */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-600">
                              2nd CA Test ({assessmentConfig.ca2Max ?? 10})
                            </label>
                            {isTerminalExam && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                                Retained
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min={0}
                            max={assessmentConfig.ca2Max ?? 10}
                            required
                            disabled={isTerminalExam || isClosed}
                            value={ca2Input}
                            onChange={(e) => setCa2Input(Number(e.target.value))}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-center focus:ring-2 focus:ring-blue-800 ${
                              isTerminalExam 
                                ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>

                        {/* CA 3 (3rd Test) */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-600">
                              3rd Test ({assessmentConfig.ca3Max ?? 10})
                            </label>
                            {isMidTermOnly && (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 rounded">
                                Locked
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min={0}
                            max={assessmentConfig.ca3Max ?? 10}
                            required={isTerminalExam}
                            disabled={isMidTermOnly || isClosed}
                            value={ca3Input}
                            onChange={(e) => setCa3Input(Number(e.target.value))}
                            placeholder={isMidTermOnly ? 'Locked' : '0'}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-center focus:ring-2 focus:ring-blue-800 ${
                              isMidTermOnly 
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>

                        {/* Exam */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-600">
                              Exam ({assessmentConfig.examMax ?? 70})
                            </label>
                            {isMidTermOnly && (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 rounded">
                                Locked
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min={0}
                            max={assessmentConfig.examMax ?? 70}
                            required={isTerminalExam}
                            disabled={isMidTermOnly || isClosed}
                            value={examInput}
                            onChange={(e) => setExamInput(Number(e.target.value))}
                            placeholder={isMidTermOnly ? 'Locked' : '0'}
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-center focus:ring-2 focus:ring-blue-800 ${
                              isMidTermOnly 
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                : 'border-slate-300 bg-white text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Calculated Total & Grade Breakdown */}
                      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-blue-900 block">
                            {isMidTermOnly ? 'Mid-Term CA Total:' : 'Full Term Total & Grade:'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {isMidTermOnly 
                              ? `CA1 (${assessmentConfig.ca1Max ?? 10}) + CA2 (${assessmentConfig.ca2Max ?? 10})` 
                              : `CA1(${assessmentConfig.ca1Max ?? 10}) + CA2(${assessmentConfig.ca2Max ?? 10}) + CA3(${assessmentConfig.ca3Max ?? 10}) + Exam(${assessmentConfig.examMax ?? 70})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-blue-950">
                            {isMidTermOnly 
                              ? `${Number(ca1Input) + Number(ca2Input)} / ${(assessmentConfig.ca1Max ?? 10) + (assessmentConfig.ca2Max ?? 10)} (${Math.round((Number(ca1Input) + Number(ca2Input)) / ((assessmentConfig.ca1Max ?? 10) + (assessmentConfig.ca2Max ?? 10)) * 100)}%)`
                              : `${Number(ca1Input) + Number(ca2Input) + Number(ca3Input) + Number(examInput)}%`
                            }
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-300 text-blue-950 font-black text-xs font-mono">
                            {calculateGrade(
                              isMidTermOnly 
                                ? Math.round((Number(ca1Input) + Number(ca2Input)) / ((assessmentConfig.ca1Max ?? 10) + (assessmentConfig.ca2Max ?? 10)) * 100)
                                : Number(ca1Input) + Number(ca2Input) + Number(ca3Input) + Number(examInput)
                            ).grade}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4 text-amber-400" />
                        <span>
                          {isMidTermOnly 
                            ? `Save Mid-Term CA for ${selectedSubject}` 
                            : `Save Terminal Assessment for ${selectedSubject}`
                          }
                        </span>
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Current Class Grade Summary */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{activeScholar.grade} Grade Ledger</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                        {schoolInfo.activeSession}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official ledger for <strong>{activeScholar.name}</strong> • {assessmentConfig.activeTerm}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs self-start sm:self-auto">
                      Official Ministry Ledger
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase">
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-2 text-center">CA 1 ({assessmentConfig.ca1Max ?? 10})</th>
                        <th className="py-3 px-2 text-center">CA 2 ({assessmentConfig.ca2Max ?? 10})</th>
                        <th className="py-3 px-2 text-center">CA 3 ({assessmentConfig.ca3Max ?? 10})</th>
                        <th className="py-3 px-2 text-center">Exam ({assessmentConfig.examMax ?? 70})</th>
                        <th className="py-3 px-2 text-center">Total (100)</th>
                        <th className="py-3 px-2 text-center">Grade</th>
                        {assessmentConfig.activeTerm === '3rd Term' && (
                          <>
                            <th className="py-3 px-2 text-center text-blue-900 bg-blue-50/60">T1 Total</th>
                            <th className="py-3 px-2 text-center text-blue-900 bg-blue-50/60">T2 Total</th>
                            <th className="py-3 px-2 text-center font-black text-blue-950 bg-amber-50">Annual Avg</th>
                          </>
                        )}
                        <th className="py-3 px-3">Remark</th>
                        <th className="py-3 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scholarGrades.map((g, i) => {
                        const isPermitted = permittedSubjects.some(
                          sub => sub.toLowerCase() === g.subject.toLowerCase()
                        );
                        const isCurrentSelected = g.subject.toLowerCase() === selectedSubject.toLowerCase();
                        const t1 = g.term1Total ?? g.total;
                        const t2 = g.term2Total ?? g.total;
                        const t3 = g.term3Total ?? g.total;
                        const annualAvg = g.annualAverage ?? Math.round((t1 + t2 + t3) / 3);

                        return (
                          <tr key={i} className={`hover:bg-slate-50 transition-colors ${
                            isCurrentSelected ? 'bg-blue-50/60' : ''
                          }`}>
                            <td className="py-3 px-4 font-black text-slate-900">
                              <div className="flex items-center gap-1.5">
                                <span>{g.subject}</span>
                                {isPermitted && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Your assigned subject" />
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-700">{g.ca1}</td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-700">{g.ca2}</td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-700">{g.ca3 ?? 8}</td>
                            <td className="py-3 px-2 text-center font-semibold text-slate-700">{g.exam}</td>
                            <td className="py-3 px-2 text-center font-black text-blue-900">{g.total}%</td>
                            <td className="py-3 px-2 text-center">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-black font-mono">
                                {g.grade}
                              </span>
                            </td>

                            {assessmentConfig.activeTerm === '3rd Term' && (
                              <>
                                <td className="py-3 px-2 text-center text-slate-600 bg-blue-50/30">{t1}%</td>
                                <td className="py-3 px-2 text-center text-slate-600 bg-blue-50/30">{t2}%</td>
                                <td className="py-3 px-2 text-center font-black text-blue-950 bg-amber-50">
                                  {annualAvg}%
                                </td>
                              </>
                            )}

                            <td className="py-3 px-3 text-slate-600 italic">{g.remark}</td>
                            <td className="py-3 px-3 text-center">
                              {isPermitted ? (
                                <button
                                  onClick={() => handleSubjectChange(g.subject)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                    isCurrentSelected
                                      ? 'bg-blue-900 text-white shadow-xs'
                                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                                  }`}
                                >
                                  {isCurrentSelected ? 'Active' : 'Score'}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-400 bg-slate-100" title="Only the assigned tutor can score this subject">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Locked</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AI ASSESSMENT & EXAM CREATOR */}
        {tutorTab === 'ai_exam_creator' && (
          <AiExamCreatorTab />
        )}

        {/* TAB: LESSON NOTES & MATERIALS */}
        {tutorTab === 'lesson_notes' && (
          <TutorLessonNotesTab />
        )}

        {/* TAB: DUAL CURRICULUM SCHEME-OF-WORK MATRIX */}
        {tutorTab === 'dual_curriculum' && (
          <DualCurriculumMatrix />
        )}

        {/* TAB: WHATSAPP REPORT DISPATCHER */}
        {tutorTab === 'whatsapp_reports' && (
          <ReportCardWhatsAppDispatcher />
        )}

        {/* TAB: VIRTUAL SCIENCE PRACTICAL SIMULATOR */}
        {tutorTab === 'sciencelab' && (
          <VirtualScienceLab />
        )}

        {/* TAB 2: ASSIGN HOMEWORK */}
        {tutorTab === 'homework' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 h-fit space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-800" />
                <span>Post New Class Assignment</span>
              </h3>

              {!hasSubjectClearance ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <p className="font-bold mb-1">Subject Assignment Clearance Required</p>
                  <p>You cannot assign homework until an Administrator assigns subjects to your faculty profile.</p>
                </div>
              ) : (
                <>
                  {hwSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{hwSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateHw} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Authorized Subject *
                      </label>
                      <select
                        value={newHwSubject}
                        onChange={(e) => setNewHwSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-800 bg-white"
                      >
                        {permittedSubjects.map(subName => (
                          <option key={subName} value={subName}>{subName}</option>
                        ))}
                      </select>
                    </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wave Motion & Sound Reflection Lab Report"
                    value={newHwTitle}
                    onChange={(e) => setNewHwTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Submission Deadline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next Tuesday, 8:00 AM"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Detailed Instructions & Resources
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Specify textbook pages, laboratory requirements, formatting, and submission rules..."
                    value={newHwInstructions}
                    onChange={(e) => setNewHwInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-800 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Publish to Scholars
                </button>
              </form>
            </>
          )}
        </div>

            {/* List of active homeworks */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Assignments Currently Active</h3>
                  <p className="text-xs text-slate-500">Visible to scholars in their student portal</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold">
                  {homeworks.length} Tasks
                </span>
              </div>

              {homeworks.map(hw => (
                <div key={hw.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black uppercase">
                      {hw.subject}
                    </span>
                    <span className="text-xs text-rose-600 font-bold">Due: {hw.dueDate}</span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900">{hw.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{hw.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DAILY SCHOOL ATTENDANCE (STUDENTS PRESENT IN SCHOOL) */}
        {tutorTab === 'attendance' && (
          <div className="space-y-6">
            {/* Attendance Header & Configuration */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                      Daily School Roll Call
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-200">
                      Day {currentDayNumber} of Term
                    </span>
                    {isClassTeacher ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-700" />
                        <span>Authorized Class Teacher</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Subject Specialist (Read-Only)</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-blue-800" />
                    <span>Daily School Attendance Register • {selectedClassObj?.name || 'Class'}</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    Official daily record of scholars physically present in school. <strong>This tracks the number of students who came to school each day</strong>, not individual class or subject attendance.
                  </p>
                </div>

                {/* Class & Date Selector */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1">Select Classroom</label>
                    <select
                      value={selectedAttendanceClassId}
                      onChange={(e) => {
                        setSelectedAttendanceClassId(e.target.value);
                        setAttendanceSubmitted(false);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                      {isClassTeacher && (
                        <optgroup label="Your Assigned Classroom(s) — Marking Authorized">
                          {assignedClassesAsTeacher.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name} (Your Assigned Class)
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label={isClassTeacher ? "Other Classrooms — Read-Only Mode" : "All Classrooms — Read-Only Mode"}>
                        {classes
                          .filter(c => !assignedClassesAsTeacher.some(ac => ac.id === c.id))
                          .map(c => {
                            const cTeacher = tutors.find(t => t.id === c.classTeacherId);
                            return (
                              <option key={c.id} value={c.id}>
                                {c.name} {cTeacher ? `(Teacher: ${cTeacher.name})` : '(No Class Teacher)'}
                              </option>
                            );
                          })}
                      </optgroup>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1">Attendance Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => {
                        setAttendanceDate(e.target.value);
                        setAttendanceSubmitted(false);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Based Attendance Marking Authorization Notices */}
              {!isClassTeacher ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-amber-950">
                        Class Teacher Authorization Required to Mark Attendance
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Only appointed <strong>Class Teachers (Form Masters/Mistresses)</strong> are authorized to take and mark the daily school attendance register.
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed sm:pl-13">
                    You are signed in as <strong>{tutor.name}</strong> ({tutor.role || tutor.department || 'Subject Specialist'}). Daily school attendance records the <strong>number of students who came to school each day</strong>, not individual subject attendance. Since you are not designated as a Class Teacher, you cannot mark or alter attendance. You may inspect student attendance summaries below in <strong>Read-Only Mode</strong>.
                  </p>
                </div>
              ) : !isTeacherOfSelectedClass ? (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-3 text-xs">
                  <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-blue-950">
                      Viewing {selectedClassObj?.name} in Read-Only Mode
                    </h4>
                    <p className="text-blue-800 text-[11px] leading-relaxed">
                      You are the designated Class Teacher for <strong>{assignedClassesAsTeacher.map(c => c.name).join(', ')}</strong>. This classroom is assigned to <strong>{designatedTeacherOfSelectedClass?.name || 'its designated Class Teacher'}</strong>. You can only mark daily school attendance for your own assigned classroom.
                    </p>
                    {primaryAssignedClass && (
                      <button
                        type="button"
                        onClick={() => setSelectedAttendanceClassId(primaryAssignedClass.id)}
                        className="mt-1 text-xs font-black text-blue-900 underline hover:text-blue-950 cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Switch to your classroom ({primaryAssignedClass.name})</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center font-black shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div>
                      <span className="font-black text-emerald-950">
                        Authorized Class Teacher: {tutor.name}
                      </span>
                      <span className="text-[11px] text-emerald-800 block">
                        You are authorized to record the official daily morning roll call (number of students present in school) for <strong>{selectedClassObj?.name}</strong>.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-200/80 text-emerald-950 font-black text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Roll Call Active</span>
                  </div>
                </div>
              )}

              {/* Term Resumption Information Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-800 shrink-0" />
                    <span className="font-black text-blue-950">
                      Term Resumption Anchor: {new Date(termResumptionDateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200/70 text-blue-900">
                      Day 1 Base
                    </span>
                  </div>
                  <p className="text-blue-700 text-[11px]">
                    Academic Term: <strong>{termResumptionConfig?.termName || schoolInfo.activeTerm}</strong> ({termResumptionConfig?.session || schoolInfo.activeSession}).
                    Per school regulation, attendance cycles start from Day 1 on or after the admin-set resumption date.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Selected Day Index</div>
                    <div className="text-sm font-black text-blue-900">
                      Day {currentDayNumber}
                    </div>
                  </div>
                </div>
              </div>

              {isBeforeResumption && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-rose-950 block">Selected Date Outside Active Term (Pre-Resumption)</span>
                    <span className="text-[11px] text-rose-800">
                      The selected date ({attendanceDate}) is earlier than the active term start date ({termResumptionDateStr}). 
                      Submission is blocked until a date on or after term resumption is chosen.
                    </span>
                  </div>
                </div>
              )}

              {isAfterTermEnd && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-rose-950 block">Selected Date Outside Active Term (Post-Vacation)</span>
                    <span className="text-[11px] text-rose-800">
                      The selected date ({attendanceDate}) is after the active term closing date ({termEndDateStr}). 
                      Daily roll call cannot be recorded after the term has concluded.
                    </span>
                  </div>
                </div>
              )}

              {attendanceValidationError && (
                <div className="p-3.5 rounded-2xl bg-rose-600 text-white text-xs flex items-center justify-between gap-3 shadow-md animate-shake">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold">{attendanceValidationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttendanceValidationError(null)}
                    className="text-white/80 hover:text-white text-xs underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Daily School Roll Call Live Status Counter */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                      Daily School Roll Call
                    </span>
                    <span className="text-xs text-slate-300">
                      {new Date(attendanceDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white">
                    {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Present').length} of {effectiveStudentsList.length} Students Came to School Today
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Physical headcount of scholars present on school premises today. Updates institutional attendance records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-center min-w-[70px]">
                    <div className="text-base font-black text-emerald-300">
                      {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Present').length}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-emerald-200">In School</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-center min-w-[70px]">
                    <div className="text-base font-black text-amber-300">
                      {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Late').length}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-amber-200">Late</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-center min-w-[70px]">
                    <div className="text-base font-black text-rose-300">
                      {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Absent').length}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-rose-200">Absent</div>
                  </div>
                </div>
              </div>

              {/* Quick Bulk Marking & Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                {canMarkAttendance ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 mr-1">Quick Mark All:</span>
                    <button
                      type="button"
                      onClick={() => markAllStudents('Present')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-black transition-colors cursor-pointer"
                    >
                      All Came to School
                    </button>
                    <button
                      type="button"
                      onClick={() => markAllStudents('Late')}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-black transition-colors cursor-pointer"
                    >
                      All Late
                    </button>
                    <button
                      type="button"
                      onClick={() => markAllStudents('Absent')}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-black transition-colors cursor-pointer"
                    >
                      All Absent
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Marking Locked (Class Teachers Only)</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {canMarkAttendance ? (
                    <button
                      type="button"
                      onClick={handleSubmitAttendance}
                      disabled={!isWithinActiveTerm}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md ${
                        !isWithinActiveTerm
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white cursor-pointer hover:shadow-lg active:scale-95'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${!isWithinActiveTerm ? 'text-slate-400' : 'text-amber-400'}`} />
                      <span>
                        {!isWithinActiveTerm
                          ? `Date Outside Active Term (${attendanceDate})`
                          : `Submit Daily School Attendance (${effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Present').length} Present Today)`}
                      </span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Submission Locked (Class Teachers Only)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Marking Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase text-[11px]">
                      <th className="py-3 px-4 w-12">#</th>
                      <th className="py-3 px-4">Scholar Details</th>
                      <th className="py-3 px-4">Registration ID</th>
                      <th className="py-3 px-4 text-center">
                        Status: Came to School Today? ({attendanceDate})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {effectiveStudentsList.map((s, idx) => {
                      const status = attendanceStatuses[s.id] || 'Present';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center shrink-0">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-black text-slate-900 block">{s.name}</span>
                                <span className="text-[10px] text-slate-500">{s.grade}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-600">{s.regNumber}</td>
                          <td className="py-3 px-4">
                            {canMarkAttendance ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setAttendanceStatuses(prev => ({ ...prev, [s.id]: 'Present' }))}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                    status === 'Present'
                                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  In School
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAttendanceStatuses(prev => ({ ...prev, [s.id]: 'Late' }))}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                    status === 'Late'
                                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  Late
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAttendanceStatuses(prev => ({ ...prev, [s.id]: 'Absent' }))}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                    status === 'Absent'
                                      ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  Absent
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                                  status === 'Present'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : status === 'Late'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  <Lock className="w-3 h-3" />
                                  <span>{status === 'Present' ? 'Came to School' : status === 'Late' ? 'Late to School' : 'Absent from School'}</span>
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOTAL ATTENDANCE FOR STUDENTS (Displayed immediately upon submission or when records exist) */}
            {(attendanceSubmitted || submittedSummary) && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Daily School Attendance Synced</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900">
                      Total School Attendance Summary for Scholars • {selectedClassObj?.name || 'Class'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Official record of scholars who came to school. Term: <strong>{termResumptionConfig?.termName}</strong> ({termResumptionConfig?.session}) • Total school days recorded: <strong>{submittedSummary?.totalDaysMarked || 1} day(s)</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const summary = getClassAttendanceSummary(selectedAttendanceClassId);
                      setSubmittedSummary(summary);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Refresh Totals</span>
                  </button>
                </div>

                {/* High-Level Attendance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Enrolled</span>
                    <span className="text-xl font-black text-slate-900 mt-0.5 block">{effectiveStudentsList.length}</span>
                    <span className="text-[10px] text-slate-400">Total Scholars</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-black uppercase text-emerald-700 block">In School Today</span>
                    <span className="text-xl font-black text-emerald-800 mt-0.5 block">
                      {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Present').length}
                    </span>
                    <span className="text-[10px] text-emerald-600">On Time</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-black uppercase text-amber-700 block">Late to School</span>
                    <span className="text-xl font-black text-amber-800 mt-0.5 block">
                      {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Late').length}
                    </span>
                    <span className="text-[10px] text-amber-600">Tardy</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                    <span className="text-[10px] font-black uppercase text-rose-700 block">Absent from School</span>
                    <span className="text-xl font-black text-rose-800 mt-0.5 block">
                      {effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Absent').length}
                    </span>
                    <span className="text-[10px] text-rose-600">Unexcused</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <span className="text-[10px] font-black uppercase text-blue-700 block">Today's Presence</span>
                    <span className="text-xl font-black text-blue-900 mt-0.5 block">
                      {effectiveStudentsList.length > 0
                        ? Math.round(((effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Present').length + 
                                       effectiveStudentsList.filter(s => (attendanceStatuses[s.id] || 'Present') === 'Late').length * 0.5) / 
                                      effectiveStudentsList.length) * 100)
                        : 100}%
                    </span>
                    <span className="text-[10px] text-blue-600">School Metric</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                    <span className="text-[10px] font-black uppercase text-indigo-700 block">Term School Avg</span>
                    <span className="text-xl font-black text-indigo-900 mt-0.5 block">
                      {submittedSummary?.classAverageAttendancePercent || 100}%
                    </span>
                    <span className="text-[10px] text-indigo-600">Cumulative</span>
                  </div>
                </div>

                {/* Cumulative Attendance Table for Students */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-800" />
                      <span>Cumulative Term School Attendance by Student (Days Present in School)</span>
                    </h5>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {submittedSummary?.studentSummaries?.length || effectiveStudentsList.length} Scholars Evaluated
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black uppercase text-[11px]">
                          <th className="py-3 px-4">#</th>
                          <th className="py-3 px-4">Scholar Name</th>
                          <th className="py-3 px-4">Registration ID</th>
                          <th className="py-3 px-4 text-center">Today's School Mark</th>
                          <th className="py-3 px-4 text-center">Days in School</th>
                          <th className="py-3 px-4 text-center">Days Late</th>
                          <th className="py-3 px-4 text-center">Days Absent</th>
                          <th className="py-3 px-4 text-center">Total School Days</th>
                          <th className="py-3 px-4 text-center">School Attendance Rate</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {effectiveStudentsList.map((s, idx) => {
                          const todayStatus = attendanceStatuses[s.id] || 'Present';
                          const summaryEntry = submittedSummary?.studentSummaries?.find(
                            (item: any) => item.studentId === s.id || item.regNumber === s.regNumber
                          );

                          const totalDays = submittedSummary?.totalDaysMarked || 1;
                          const presentDays = summaryEntry?.daysPresent ?? (todayStatus === 'Present' ? 1 : 0);
                          const lateDays = summaryEntry?.daysLate ?? (todayStatus === 'Late' ? 1 : 0);
                          const absentDays = summaryEntry?.daysAbsent ?? (todayStatus === 'Absent' ? 1 : 0);
                          const rate = summaryEntry?.attendancePercent ?? (
                            Math.round(((presentDays + (lateDays * 0.5)) / Math.max(1, totalDays)) * 100)
                          );

                          return (
                            <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-black text-[11px] flex items-center justify-center shrink-0">
                                    {s.name.charAt(0)}
                                  </div>
                                  <span className="font-black text-slate-900">{s.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-slate-600">{s.regNumber}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  todayStatus === 'Present'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : todayStatus === 'Late'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {todayStatus}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-emerald-700">{presentDays}</td>
                              <td className="py-3 px-4 text-center font-bold text-amber-700">{lateDays}</td>
                              <td className="py-3 px-4 text-center font-bold text-rose-700">{absentDays}</td>
                              <td className="py-3 px-4 text-center font-bold text-slate-700">{totalDays}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                                    <div
                                      className={`h-full rounded-full ${
                                        rate >= 90 ? 'bg-emerald-500' : rate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                                      }`}
                                      style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
                                    />
                                  </div>
                                  <span className="font-black text-slate-900 w-9 text-right">{rate}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {rate >= 90 ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                                    Excellent
                                  </span>
                                ) : rate >= 75 ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                                    Satisfactory
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                                    Needs Attention
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* History of Submitted Registers for Class */}
                {attendanceRecords.filter(r => r.classId === selectedAttendanceClassId).length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <h5 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                      Term Log History for {selectedClassObj?.name}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {attendanceRecords
                        .filter(r => r.classId === selectedAttendanceClassId)
                        .slice(-6)
                        .reverse()
                        .map(record => {
                          const pCount = record.studentsAttendance.filter(e => e.status === 'Present').length;
                          const lCount = record.studentsAttendance.filter(e => e.status === 'Late').length;
                          const aCount = record.studentsAttendance.filter(e => e.status === 'Absent').length;
                          return (
                            <div key={record.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900 block">Day {record.dayNumber} • {record.date}</span>
                                <span className="text-[10px] text-slate-500">By {record.submittedByTutorName}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                <span className="text-emerald-700 font-black">{pCount}P</span>
                                <span className="text-amber-700 font-black">{lCount}L</span>
                                <span className="text-rose-700 font-black">{aCount}A</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FACULTY TIMETABLE */}
        {tutorTab === 'timetable' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-800" />
              <span>Teaching Hours & Laboratory Periods</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-blue-800">Monday (08:45 – 10:15 AM)</span>
                <h4 className="font-bold text-xs text-blue-950">Physics Practical Lab</h4>
                <p className="text-[11px] text-blue-700">SSS 2 Science • West Physics Lab</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-600">Tuesday (11:30 – 12:45 PM)</span>
                <h4 className="font-bold text-xs text-slate-900">Basic Science Core</h4>
                <p className="text-[11px] text-slate-600">JSS 3 • Block B Classroom 4</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-amber-800">Wednesday (09:00 – 10:30 AM)</span>
                <h4 className="font-bold text-xs text-amber-950">Physics Theory (Electricity)</h4>
                <p className="text-[11px] text-amber-800">SSS 1 Science • Hall C</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-800">Thursday (02:30 – 04:00 PM)</span>
                <h4 className="font-bold text-xs text-emerald-950">JETS Science Club Supervision</h4>
                <p className="text-[11px] text-emerald-800">STEM Centre • Robotics Arena</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PARENT CONSULTATIONS & APPOINTMENTS */}
        {tutorTab === 'consultations' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Parent Consultations & Appointments
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review guardian meeting inquiries, accept appointments, or coordinate alternate counseling schedules.
                    </p>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold font-mono">
                {consultationRequests.length} Total Requests
              </span>
            </div>

            {consultationRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bold text-xs border border-dashed border-slate-200 rounded-3xl">
                No parent consultation requests currently queued for your department.
              </div>
            ) : (
              <div className="space-y-4">
                {consultationRequests.map((req) => (
                  <div key={req.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm text-slate-900">{req.parentName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-bold text-blue-900">Ward: {req.studentName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-bold text-purple-700">Target: {req.targetRole} {req.recipientName ? `(${req.recipientName})` : ''}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block font-mono">
                          📅 {req.preferredDate} at {req.preferredTime} • Phone: {req.parentPhone}
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase shrink-0 ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Declined' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-800 italic leading-relaxed">
                      "{req.message}"
                    </div>

                    {req.adminResponse && (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                        <strong>Staff Feedback:</strong> {req.adminResponse}
                      </div>
                    )}

                    {req.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            updateConsultationStatus(req.id, 'Approved', `Confirmed by ${tutor.name} (${tutor.role})`);
                            alert(`Appointment for ${req.parentName} confirmed! Synchronized with the Parent Portal.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-xs"
                        >
                          Accept Appointment
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const note = prompt('Please enter a reschedule suggestion or feedback for the guardian:', `Reschedule suggested by ${tutor.name}: kindly select a morning period next Tuesday.`);
                            if (note !== null) {
                              updateConsultationStatus(req.id, 'Declined', note.trim() || `Reschedule requested by ${tutor.name}`);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          Suggest Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STAFF PROFILE, PHOTO & DIGITAL SIGNATURE */}
        {tutorTab === 'staff_profile' && (
          <StaffProfileAndSignatureTab tutor={tutor} />
        )}

        {/* TAB: STAFF ROOM & COMMUNITY CHAT */}
        {tutorTab === 'chat' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 p-6 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-black uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Faculty Staff Room & Scholastic Hub</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Teacher Collaboration & Student Channels
                </h2>
                <p className="text-xs text-blue-200 max-w-xl">
                  Communicate across class channels, engage in academic subject departments, answer student questions, and liaise with parents.
                </p>
              </div>
            </div>

            <SchoolChatSystem
              currentUserRole="tutor"
              currentUserId={tutor.id}
              currentUserName={tutor.name}
              currentUserSubtext={`${tutor.role || 'Faculty Tutor'} • ${tutor.department || 'Academic Staff'}`}
            />
          </div>
        )}
      </main>
    </div>
  );
};
