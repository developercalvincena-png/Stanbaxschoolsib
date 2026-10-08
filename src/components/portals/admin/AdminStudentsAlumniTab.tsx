import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { StudentProfile } from '../../../types';
import { 
  GraduationCap, 
  Search, 
  Award, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  PlusCircle, 
  BookOpen, 
  ArrowRight,
  Filter,
  Database
} from '../../RealIcons';
import { isRemoteEnabled } from '../../../lib/supabase';
import { NetlifyCloudSyncModal } from './NetlifyCloudSyncModal';

export const AdminStudentsAlumniTab: React.FC = () => {
  const { 
    students, 
    toggleStudentAlumni, 
    upgradeStudentToTutor, 
    createTutorAccount,
    schoolInfo 
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'alumni' | 'upgraded'>('all');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Upgrade confirmation modal
  const [studentToUpgrade, setStudentToUpgrade] = useState<StudentProfile | null>(null);

  // New tutor modal
  const [showNewTutorModal, setShowNewTutorModal] = useState(false);
  const [newTutorName, setNewTutorName] = useState('');
  const [newTutorEmail, setNewTutorEmail] = useState('');
  const [newTutorPassword, setNewTutorPassword] = useState('stanbax2025');
  const [newTutorDept, setNewTutorDept] = useState('Sciences & STEM Faculty');
  const [newTutorRole, setNewTutorRole] = useState('Subject Teacher');
  const [newTutorQual, setNewTutorQual] = useState('B.Sc / B.Ed, TRCN Certified');
  const [newTutorPhone, setNewTutorPhone] = useState('+234 803 000 0000');

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'active') return !s.isAlumni;
    if (filterType === 'alumni') return !!s.isAlumni;
    if (filterType === 'upgraded') return !!s.isUpgradedTutor;
    return true;
  });

  const handleToggleAlumni = (student: StudentProfile) => {
    const nextAlumniState = !student.isAlumni;
    toggleStudentAlumni(student.id, nextAlumniState);
    if (nextAlumniState) {
      setSuccessMsg(`${student.name} marked as Graduated Alumni. Their academic history is preserved, but they will no longer appear in active class lists or receive future updates.`);
    } else {
      setSuccessMsg(`${student.name} restored to Active Scholar enrollment.`);
    }
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleConfirmUpgrade = () => {
    if (!studentToUpgrade) return;
    const res = upgradeStudentToTutor(studentToUpgrade.id);
    if (res.success) {
      setSuccessMsg(res.message);
      setStudentToUpgrade(null);
    } else {
      setErrorMsg(res.message);
    }
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMsg('');
    }, 5000);
  };

  const handleCreateTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTutorName.trim() || !newTutorEmail.trim()) return;

    createTutorAccount({
      name: newTutorName.trim(),
      email: newTutorEmail.trim(),
      password: newTutorPassword.trim() || 'stanbax2025',
      department: newTutorDept,
      role: newTutorRole,
      qualification: newTutorQual,
      assignedClasses: [],
      assignedSubjects: [],
      phone: newTutorPhone
    });

    setSuccessMsg(`Faculty Tutor account created for ${newTutorName}. Initial password: ${newTutorPassword}`);
    setShowNewTutorModal(false);
    setNewTutorName('');
    setNewTutorEmail('');
    setNewTutorPassword('stanbax2025');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const activeCount = students.filter(s => !s.isAlumni).length;
  const alumniCount = students.filter(s => s.isAlumni).length;
  const upgradedCount = students.filter(s => s.isUpgradedTutor).length;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-950">
            <GraduationCap className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black">Scholars, Alumni & Privilege Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Designate alumni to preserve past academic history while removing them from active class rosters. Promote exemplary scholars to Tutor privileges or create new Faculty Tutor accounts.
          </p>
        </div>

        <button
          onClick={() => setShowNewTutorModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-2 self-start md:self-auto shrink-0"
          id="btn-create-tutor-account"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Create New Tutor Account</span>
        </button>
      </div>

      {/* Netlify Single Browser Mode Alert */}
      {!isRemoteEnabled() && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-2xs">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs block text-amber-900">
                Single-Browser Storage Active (Netlify Deployment Notice)
              </span>
              <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                Scholars registered in this browser are stored in local memory only. To make new student registrations visible across every other browser, phone, and computer, connect your free Supabase database in Netlify Environment Variables.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSyncModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            How to Sync Across Devices
          </button>
        </div>
      )}

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Metric Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilterType('all')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            filterType === 'all' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="text-xs uppercase font-bold opacity-80">Total Registered</div>
          <div className="text-2xl font-black mt-1">{students.length}</div>
        </div>

        <div 
          onClick={() => setFilterType('active')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            filterType === 'active' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="text-xs uppercase font-bold opacity-80">Active Scholars</div>
          <div className="text-2xl font-black mt-1">{activeCount}</div>
        </div>

        <div 
          onClick={() => setFilterType('alumni')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            filterType === 'alumni' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="text-xs uppercase font-bold opacity-80">Graduated Alumni</div>
          <div className="text-2xl font-black mt-1 text-amber-400">{alumniCount}</div>
        </div>

        <div 
          onClick={() => setFilterType('upgraded')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            filterType === 'upgraded' ? 'bg-blue-900 text-white border-blue-900 shadow-sm' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="text-xs uppercase font-bold opacity-80">Promoted to Tutors</div>
          <div className="text-2xl font-black mt-1 text-emerald-400">{upgradedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, Reg No, or class..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Filter:</span>
          {(['all', 'active', 'alumni', 'upgraded'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition cursor-pointer ${
                filterType === t ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Students Directory List */}
      <div className="space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200">
            No scholars match your current search and filter criteria.
          </div>
        ) : (
          filteredStudents.map((std) => (
            <div 
              key={std.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                std.isAlumni ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Scholar Details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-slate-900">{std.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {std.regNumber}
                  </span>

                  {std.isAlumni && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide border border-amber-300">
                      Alumni • {std.graduationSession || 'Class Completed'}
                    </span>
                  )}

                  {std.isUpgradedTutor && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-300 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" />
                      Elevated to Faculty Tutor
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span>Class: <strong className="text-slate-800">{std.grade}</strong></span>
                  <span>•</span>
                  <span>Annual Average: <strong className="text-slate-800">{std.termAverage}%</strong></span>
                  <span>•</span>
                  <span>History Archive: <strong className="text-blue-700 font-semibold">{std.academicHistory?.length || 1} Past Sessions Logged</strong></span>
                </div>

                {std.isAlumni && (
                  <p className="text-[11px] text-amber-800 font-medium">
                    Academic records and transcripts are preserved in the Alumni Archive. Future class submissions and roster updates are closed.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Toggle Alumni Status */}
                <button
                  onClick={() => handleToggleAlumni(std)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    std.isAlumni
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                      : 'bg-amber-500 hover:bg-amber-600 text-blue-950 border-amber-400 shadow-sm'
                  }`}
                  title={std.isAlumni ? 'Reactivate as active student' : 'Mark as graduated alumni'}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{std.isAlumni ? 'Restore to Active Class' : 'Mark as Alumni'}</span>
                </button>

                {/* Upgrade to Tutor Privilege */}
                {!std.isUpgradedTutor ? (
                  <button
                    onClick={() => setStudentToUpgrade(std)}
                    className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Promote to Faculty Tutor"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upgrade to Tutor</span>
                  </button>
                ) : (
                  <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                    Tutor Privilege Active
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Upgrade Student to Tutor */}
      {studentToUpgrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-slate-900">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-black">Promote Scholar to Faculty Tutor</h3>
                <p className="text-xs text-slate-500">Grant teaching and assessment privileges.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2 text-xs text-slate-700">
              <p>
                You are elevating <strong>{studentToUpgrade.name}</strong> ({studentToUpgrade.regNumber}) to an Associate Faculty Tutor account.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                <li>A new Faculty Staff ID (e.g. STX-TUT-XXX) will be provisioned.</li>
                <li>Initial password will mirror their scholar credentials or standard default.</li>
                <li><strong>Onboarding Requirement:</strong> Upon first logging in to the Tutor Portal, they will be required to complete their profile details (Department, assigned subjects, qualifications, and bio).</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToUpgrade(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Promotion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Tutor Account */}
      {showNewTutorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-slate-900">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
                <PlusCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-black">Provision New Faculty Tutor Account</h3>
                <p className="text-xs text-slate-500">Register and configure credentials for a new educator.</p>
              </div>
            </div>

            <form onSubmit={handleCreateTutor} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Full Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={newTutorName}
                  onChange={(e) => setNewTutorName(e.target.value)}
                  placeholder="e.g. Dr. Oladipo Adeleke"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newTutorEmail}
                    onChange={(e) => setNewTutorEmail(e.target.value)}
                    placeholder="o.adeleke@stanbaxschools.edu.ng"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newTutorPassword}
                    onChange={(e) => setNewTutorPassword(e.target.value)}
                    placeholder="Enter initial password"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={newTutorDept}
                    onChange={(e) => setNewTutorDept(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  >
                    <option value="Sciences & STEM Faculty">Sciences & STEM Faculty</option>
                    <option value="Mathematics & Computing">Mathematics & Computing</option>
                    <option value="Languages & Humanities">Languages & Humanities</option>
                    <option value="Arts, Music & Vocational">Arts, Music & Vocational</option>
                    <option value="Junior Secondary & Basic">Junior Secondary & Basic</option>
                    <option value="Primary & Early Years">Primary & Early Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Faculty Role
                  </label>
                  <input
                    type="text"
                    required
                    value={newTutorRole}
                    onChange={(e) => setNewTutorRole(e.target.value)}
                    placeholder="e.g. Senior Physics & Chemistry Tutor"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Academic Qualifications
                  </label>
                  <input
                    type="text"
                    required
                    value={newTutorQual}
                    onChange={(e) => setNewTutorQual(e.target.value)}
                    placeholder="e.g. M.Sc Chemistry, PGDE, TRCN"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newTutorPhone}
                    onChange={(e) => setNewTutorPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTutorModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Register Tutor Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Netlify Cloud Sync Modal */}
      <NetlifyCloudSyncModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
      />
    </div>
  );
};
