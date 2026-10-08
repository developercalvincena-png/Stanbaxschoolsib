import React, { useState, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { TutorProfile, PrincipalRole, PrincipalPrivilege } from '../../../types';
import { Crown, CheckCircle2, Award as LucideAward } from 'lucide-react';
import { 
  UserCheck, 
  BookOpen, 
  Check, 
  PlusCircle, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  Search, 
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Users
} from '../../RealIcons';

export const AdminTutorAssignmentsTab: React.FC = () => {
  const { 
    tutors, 
    tutor: currentActiveTutor, 
    switchActiveTutor, 
    assignSubjectsToTutor, 
    appointPrincipal,
    subjects,
    classes,
    setActiveSection
  } = useSchool();

  const [selectedTutorId, setSelectedTutorId] = useState<string>(currentActiveTutor.id || tutors[0]?.id || 'tutor-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const activeTutor = tutors.find(t => t.id === selectedTutorId) || tutors[0] || currentActiveTutor;

  const [targetRole, setTargetRole] = useState<PrincipalRole>(activeTutor.principalRole || 'none');
  const [selectedPrivileges, setSelectedPrivileges] = useState<PrincipalPrivilege[]>(activeTutor.principalPrivileges || []);
  const [principalNotice, setPrincipalNotice] = useState<string | null>(null);

  useEffect(() => {
    setTargetRole(activeTutor.principalRole || 'none');
    setSelectedPrivileges(activeTutor.principalPrivileges || []);
  }, [activeTutor.id, activeTutor.principalRole, activeTutor.principalPrivileges]);

  const allPrivilegeOptions: Array<{ id: PrincipalPrivilege; label: string; desc: string }> = [
    { id: 'manage_admissions', label: 'Admissions & Enrolments', desc: 'Authorize candidate entrance exams and approve admissions' },
    { id: 'manage_assessments', label: 'Assessments & Report Sheets', desc: 'Approve terminal CA scores and release official report sheets' },
    { id: 'manage_curriculum', label: 'Curriculum & Lesson Notes', desc: 'Vet weekly lesson plans and approve syllabus coverage' },
    { id: 'manage_staff_leave', label: 'Staff Attendance & Leave', desc: 'Authorize faculty roll calls and staff leave requests' },
    { id: 'manage_finances', label: 'Bursary & Fee Clearance', desc: 'Inspect fee clearance records and exam slips' },
    { id: 'manage_discipline', label: 'Disciplinary Council', desc: 'Issue formal commendations and conduct disciplinary inquiries' },
    { id: 'manage_broadcasts', label: 'Official Broadcasts', desc: 'Publish school-wide directives to parent & student portals' },
    { id: 'manage_timetables', label: 'Master Timetable Overrides', desc: 'Modify faculty period allocations and hall arrangements' }
  ];

  const handleTogglePrivilege = (privId: PrincipalPrivilege) => {
    setSelectedPrivileges(prev => 
      prev.includes(privId) ? prev.filter(p => p !== privId) : [...prev, privId]
    );
  };

  const handlePresetRole = (role: PrincipalRole) => {
    setTargetRole(role);
    if (role === 'principal_administrator') {
      setSelectedPrivileges(['manage_admissions', 'manage_staff_leave', 'manage_finances', 'manage_discipline', 'manage_broadcasts']);
    } else if (role === 'principal_academics') {
      setSelectedPrivileges(['manage_assessments', 'manage_curriculum', 'manage_timetables', 'manage_discipline']);
    } else {
      setSelectedPrivileges([]);
    }
  };

  const handleSaveAppointment = () => {
    appointPrincipal(activeTutor.id, targetRole, selectedPrivileges);
    const title = targetRole === 'principal_administrator' ? 'Principal Administrator' : targetRole === 'principal_academics' ? 'Principal Academics' : 'Standard Faculty Tutor';
    setPrincipalNotice(`Official appointment saved: ${activeTutor.name} designated as ${title} with ${selectedPrivileges.length} administrative privileges.`);
    setTimeout(() => setPrincipalNotice(null), 4000);
  };

  const currentPrincipalAdmin = tutors.find(t => t.principalRole === 'principal_administrator');
  const currentPrincipalAcademics = tutors.find(t => t.principalRole === 'principal_academics');

  const [activeRightTab, setActiveRightTab] = useState<'principal' | 'subjects'>('principal');

  const handleToggleSubject = (subjectName: string) => {
    const currentList = activeTutor.assignedSubjects || [];
    const exists = currentList.some(s => s.toLowerCase() === subjectName.toLowerCase());
    const nextList = exists
      ? currentList.filter(s => s.toLowerCase() !== subjectName.toLowerCase())
      : [...currentList, subjectName];

    assignSubjectsToTutor(activeTutor.id, nextList);
    setStatusMessage(`Updated assigned subjects for ${activeTutor.name}.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSelectAllSubjects = () => {
    const allSubjectNames = subjects.map(s => s.name);
    assignSubjectsToTutor(activeTutor.id, allSubjectNames);
    setStatusMessage(`Assigned all ${allSubjectNames.length} subjects to ${activeTutor.name}.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleClearAllSubjects = () => {
    assignSubjectsToTutor(activeTutor.id, []);
    setStatusMessage(`Cleared all subject assignments for ${activeTutor.name}.`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSwitchAndGoToTutorPortal = (tutorObj: TutorProfile) => {
    switchActiveTutor(tutorObj.id);
    setActiveSection('tutor-portal');
  };

  const filteredTutors = tutors.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.staffId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
              <span>Tutor Subject Access & Scoring Permissions</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Tutor Subject Assignments & Security Clearance
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Assign tutors to specific academic subjects. In the Tutor Portal, tutors are strictly restricted to scoring, uploading continuous assessment results, and creating assignments only for their assigned subjects.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Currently Logged-in Tutor:</span>
            <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 text-xs font-black">
              {currentActiveTutor.name} ({currentActiveTutor.assignedSubjects?.length || 0} subjects)
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Executive Leadership Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Principal Administrator Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md border border-amber-300 shrink-0 overflow-hidden">
              {currentPrincipalAdmin?.photoUrl ? (
                <img src={currentPrincipalAdmin.photoUrl} alt="Principal Admin" className="w-full h-full object-cover" />
              ) : (
                <Crown className="w-6 h-6 fill-blue-950" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                Office of Principal Administrator
              </span>
              <h4 className="text-sm font-black text-slate-900">
                {currentPrincipalAdmin ? currentPrincipalAdmin.name : 'No Appointee Yet'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {currentPrincipalAdmin ? `${currentPrincipalAdmin.department} • ${currentPrincipalAdmin.principalPrivileges?.length || 0} Special Privileges` : 'Super admin can appoint any tutor below'}
              </p>
            </div>
          </div>
          {currentPrincipalAdmin && (
            <button
              onClick={() => {
                setSelectedTutorId(currentPrincipalAdmin.id);
                setActiveRightTab('principal');
              }}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-blue-950 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              Configure
            </button>
          )}
        </div>

        {/* Principal Academics Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md border border-indigo-400 shrink-0 overflow-hidden">
              {currentPrincipalAcademics?.photoUrl ? (
                <img src={currentPrincipalAcademics.photoUrl} alt="Principal Academics" className="w-full h-full object-cover" />
              ) : (
                <Crown className="w-6 h-6 fill-amber-300 text-amber-300" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider block">
                Office of Principal Academics
              </span>
              <h4 className="text-sm font-black text-slate-900">
                {currentPrincipalAcademics ? currentPrincipalAcademics.name : 'No Appointee Yet'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {currentPrincipalAcademics ? `${currentPrincipalAcademics.department} • ${currentPrincipalAcademics.principalPrivileges?.length || 0} Academic Privileges` : 'Super admin can appoint any tutor below'}
              </p>
            </div>
          </div>
          {currentPrincipalAcademics && (
            <button
              onClick={() => {
                setSelectedTutorId(currentPrincipalAcademics.id);
                setActiveRightTab('principal');
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              Configure
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Tutor List on Left, Subject Checkbox Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tutor Roster */}
        <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-900" />
              <span>Faculty Tutors ({tutors.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Select to configure</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tutor by name, ID, dept..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredTutors.map(t => {
              const isSelected = t.id === activeTutor.id;
              const isCurrentSession = t.id === currentActiveTutor.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTutorId(t.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-xs truncate">{t.name}</span>
                      {t.principalRole === 'principal_administrator' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-blue-950 flex items-center gap-0.5 shadow-xs">
                          <Crown className="w-2.5 h-2.5 fill-blue-950" />
                          <span>Principal Admin</span>
                        </span>
                      )}
                      {t.principalRole === 'principal_academics' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-blue-950 flex items-center gap-0.5 shadow-xs">
                          <Crown className="w-2.5 h-2.5 fill-blue-950" />
                          <span>Principal Academics</span>
                        </span>
                      )}
                      {isCurrentSession && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                          Active Desk
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      ID: <span className="font-mono text-slate-700">{t.staffId}</span> • {t.department}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.assignedSubjects && t.assignedSubjects.length > 0 ? (
                        t.assignedSubjects.slice(0, 3).map(sub => (
                          <span key={sub} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                            {sub}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> No subjects assigned
                        </span>
                      )}
                      {(t.assignedSubjects?.length || 0) > 3 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          +{t.assignedSubjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwitchAndGoToTutorPortal(t);
                      }}
                      className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      title="Switch to this tutor and open Tutor Portal"
                    >
                      <span>Open Desk</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Tutor Permission Matrix */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                Active Assignment Workspace
              </span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{activeTutor.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-normal">
                  {activeTutor.staffId}
                </span>
                {activeTutor.principalRole === 'principal_administrator' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-blue-950" /> Principal Administrator
                  </span>
                )}
                {activeTutor.principalRole === 'principal_academics' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-blue-950" /> Principal Academics
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Department: <strong>{activeTutor.department}</strong> • Current Clearance:{' '}
                <strong className="text-indigo-900">{activeTutor.assignedSubjects?.length || 0} Subject(s)</strong>
              </p>
            </div>

            {/* Sub-tab Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveRightTab('principal')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeRightTab === 'principal'
                    ? 'bg-amber-400 text-blue-950 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>Appoint Principal & Privileges</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab('subjects')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activeRightTab === 'subjects'
                    ? 'bg-blue-900 text-white font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Subject Clearances</span>
              </button>
            </div>
          </div>

          {/* TAB 1: APPOINT PRINCIPAL & PRIVILEGES */}
          {activeRightTab === 'principal' && (
            <div className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                  Select Administrative Appointment:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePresetRole('none')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      targetRole === 'none'
                        ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold ring-2 ring-slate-300'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span className="font-black text-xs block text-slate-900">Standard Faculty</span>
                    <span className="text-[11px] text-slate-500">Regular teaching responsibilities</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetRole('principal_administrator')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      targetRole === 'principal_administrator'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-300 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-amber-900">
                      <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Principal Admin</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Admissions, HR & operations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetRole('principal_academics')}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                      targetRole === 'principal_academics'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-300 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-indigo-900">
                      <Crown className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                      <span>Principal Academics</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Curriculum, scoring & exams</span>
                  </button>
                </div>
              </div>

              {/* Privileges Matrix */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Delegated Super Admin Privileges ({selectedPrivileges.length} selected):
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Specify the exact administrative capabilities authorized for this staff member.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedPrivileges(allPrivilegeOptions.map(o => o.id))}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-[11px]"
                    >
                      All Privileges
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPrivileges([])}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-rose-700 font-bold rounded-lg cursor-pointer text-[11px]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allPrivilegeOptions.map(opt => {
                    const isChecked = selectedPrivileges.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleTogglePrivilege(opt.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-amber-50/60 border-amber-400 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition ${
                          isChecked
                            ? 'bg-amber-400 border-amber-500 text-blue-950 font-black'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="font-black text-xs text-slate-900 block">
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                            {opt.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Appointment Button & Notice */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {targetRole !== 'none' ? (
                    <span>
                      Will appoint <strong>{activeTutor.name}</strong> as <strong>{targetRole === 'principal_administrator' ? 'Principal Administrator' : 'Principal Academics'}</strong>.
                    </span>
                  ) : (
                    <span>Designated as Standard Faculty.</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveAppointment}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Crown className="w-4 h-4 fill-blue-950" />
                  <span>Save Official Appointment & Privileges</span>
                </button>
              </div>

              {principalNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{principalNotice}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBJECT CLEARANCE MATRIX */}
          {activeRightTab === 'subjects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div className="text-xs text-slate-600">
                  Click any subject card to toggle permission for <strong>{activeTutor.name}</strong>.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllSubjects}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleClearAllSubjects}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Explanation Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Enforced Subject Boundary Rule:</strong> When this tutor logs in at the Tutor Portal, they will <em>only</em> be able to score CA1, CA2, Exam results, and publish homework for the subjects checked below.
                </div>
              </div>

              {/* Subjects Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {subjects.map(s => {
                  const isAssigned = (activeTutor.assignedSubjects || []).some(
                    subj => subj.toLowerCase() === s.name.toLowerCase()
                  );

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleToggleSubject(s.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isAssigned
                          ? 'bg-blue-50 border-blue-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 opacity-75'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded bg-white text-blue-900 border border-slate-200">
                            {s.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {s.department}
                        </span>
                      </div>

                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isAssigned
                          ? 'bg-blue-900 text-amber-400 border-blue-900'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Open Faculty Desk button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Assigned <strong>{activeTutor.assignedSubjects?.length || 0}</strong> of <strong>{subjects.length}</strong> total subjects
            </div>

            <button
              onClick={() => handleSwitchAndGoToTutorPortal(activeTutor)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Launch Faculty Gradebook Desk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
