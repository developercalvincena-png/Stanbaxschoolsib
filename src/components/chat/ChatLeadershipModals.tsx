import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolClass, Club, StudentProfile } from '../../types';
import { 
  Crown, 
  Award, 
  X, 
  Users, 
  Check, 
  ShieldCheck, 
  Star,
  Settings,
  UserCheck,
  UserX,
  Plus,
  GraduationCap,
  Globe,
  Lock
} from 'lucide-react';

// ============================================================================
// 1. CLASS LEADERSHIP MODAL (CLASS PREFECT & ASSISTANT PREFECT)
// ============================================================================
interface ClassLeadershipModalProps {
  schoolClass: SchoolClass;
  onClose: () => void;
}

export const ClassLeadershipModal: React.FC<ClassLeadershipModalProps> = ({
  schoolClass,
  onClose
}) => {
  const { students, assignClassPrefects } = useSchool();

  // Filter students in this class
  const classStudents = students.filter(s => 
    s.classId === schoolClass.id || s.grade === schoolClass.name || (s.grade && schoolClass.name.includes(s.grade))
  );

  const [prefectId, setPrefectId] = useState<string>(schoolClass.prefectStudentId || '');
  const [assistantId, setAssistantId] = useState<string>(schoolClass.assistantPrefectStudentId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    assignClassPrefects(
      schoolClass.id, 
      prefectId || undefined, 
      assistantId || undefined
    );
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">Class Leadership & Prefects</h4>
              <p className="text-xs text-blue-200">{schoolClass.name} • Class Roster</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Assign the designated <strong>Class Prefect</strong> and <strong>Assistant Class Prefect</strong>. Their chat messages will be stamped with the official leadership badge in this class forum.
          </p>

          {/* Class Prefect */}
          <div>
            <label className="block text-xs font-black text-neutral-800 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>⭐ Class Prefect</span>
            </label>
            <select
              value={prefectId}
              onChange={(e) => setPrefectId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="">-- None / Select Class Prefect --</option>
              {classStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.regNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Assistant Class Prefect */}
          <div>
            <label className="block text-xs font-black text-neutral-800 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>⭐ Assistant Class Prefect</span>
            </label>
            <select
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- None / Select Assistant Prefect --</option>
              {classStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.regNumber})
                </option>
              ))}
            </select>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Class Prefects saved successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Save Class Leaders</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ============================================================================
// 2. CLUB LEADERSHIP MODAL (CLUB PRESIDENT, VICE PRESIDENT & MEMBERS)
// ============================================================================
interface ClubLeadershipModalProps {
  club: Club;
  onClose: () => void;
}

export const ClubLeadershipModal: React.FC<ClubLeadershipModalProps> = ({
  club,
  onClose
}) => {
  const { students, assignClubLeaders } = useSchool();

  const [presidentId, setPresidentId] = useState<string>(club.presidentStudentId || '');
  const [viceId, setViceId] = useState<string>(club.vicePresidentStudentId || '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(club.memberStudentIds || []);
  const [memberSearch, setMemberSearch] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleMember = (sId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure president and vice are included in member list
    const finalMembers = Array.from(new Set([
      ...selectedMemberIds,
      ...(presidentId ? [presidentId] : []),
      ...(viceId ? [viceId] : [])
    ]));

    assignClubLeaders(
      club.id,
      presidentId || undefined,
      viceId || undefined,
      finalMembers
    );
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const filteredScholars = students.filter(s => 
    s.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (s.grade && s.grade.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">Club Leadership & Members</h4>
              <p className="text-xs text-emerald-200">{club.name} • Society Executive</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-neutral-600 leading-relaxed">
            Select the designated <strong>President</strong> and <strong>Vice President</strong> for {club.name}. Their chat messages will display the official club executive crown badge in this society hub.
          </p>

          {/* Club President */}
          <div>
            <label className="block text-xs font-black text-neutral-800 mb-1 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>👑 Club President</span>
            </label>
            <select
              value={presidentId}
              onChange={(e) => setPresidentId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- None / Select Club President --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Club Vice President */}
          <div>
            <label className="block text-xs font-black text-neutral-800 mb-1 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
              <span>👑 Club Vice President</span>
            </label>
            <select
              value={viceId}
              onChange={(e) => setViceId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">-- None / Select Vice President --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Member Students Selection */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Enrolled Club Members ({selectedMemberIds.length})</span>
              </label>
              <span className="text-[10px] text-neutral-400">Only enrolled scholars can access this club chat</span>
            </div>

            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search scholar to add/remove..."
              className="w-full px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs mb-2 focus:outline-none"
            />

            <div className="max-h-44 overflow-y-auto space-y-1.5 p-2 bg-neutral-50 rounded-2xl border border-neutral-200">
              {filteredScholars.map(s => {
                const isSelected = selectedMemberIds.includes(s.id) || s.id === presidentId || s.id === viceId;
                const isOfficer = s.id === presidentId ? 'President' : s.id === viceId ? 'Vice President' : null;

                return (
                  <div
                    key={s.id}
                    onClick={() => toggleMember(s.id)}
                    className={`p-2 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold' 
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-emerald-600 text-white' : 'border border-neutral-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{s.name}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">({s.grade})</span>
                    </div>

                    {isOfficer && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-300 text-neutral-900">
                        {isOfficer}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Club Leadership & Members saved successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-amber-300" />
              <span>Save Club Leaders</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ============================================================================
// 3. SCHOOL PREFECTS & BADGES MODAL (PRINCIPAL ADMINISTRATOR PRIVILEGE)
// ============================================================================
const STANDARD_PREFECT_ROLES = [
  'Head Boy',
  'Head Girl',
  'Assistant Head Boy',
  'Assistant Head Girl',
  'Senior Prefect',
  'Sanitary / Health Prefect',
  'Library Prefect',
  'Sports Prefect (Boys)',
  'Sports Prefect (Girls)',
  'Assembly / Chapel Prefect',
  'Timekeeper Prefect',
  'Science & Lab Prefect',
  'Social & Welfare Prefect',
  'Dining Hall Prefect',
  'Hostel / Boarding Prefect'
];

interface SchoolPrefectBadgesModalProps {
  onClose: () => void;
}

export const SchoolPrefectBadgesModal: React.FC<SchoolPrefectBadgesModalProps> = ({
  onClose
}) => {
  const { students, assignStudentPrefectBadge } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRole, setSelectedRole] = useState(STANDARD_PREFECT_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⭐');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // List of active prefects
  const currentPrefects = students.filter(s => s.prefectRole || s.prefectBadge);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const finalRole = selectedRole === 'Custom' ? customRole.trim() : selectedRole;
    if (!finalRole) return;

    const finalBadge = `${selectedIcon} ${finalRole}`;
    assignStudentPrefectBadge(selectedStudentId, finalRole, finalBadge);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSelectedStudentId('');
    }, 1800);
  };

  const handleRemovePrefect = (studentId: string) => {
    assignStudentPrefectBadge(studentId, undefined, undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-neutral-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
              <Award className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">School Prefects & Badges Management</h4>
              <p className="text-xs text-amber-200">Principal Administrator / School Head Discretion</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Assignment Form */}
          <form onSubmit={handleAssign} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-4">
            <h5 className="font-extrabold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Confer Official School Prefect Badge</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Select Scholar *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Prefect Office / Portfolio *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {STANDARD_PREFECT_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="Custom">+ Other Custom Portfolio</option>
                </select>
              </div>
            </div>

            {selectedRole === 'Custom' && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Custom Portfolio Title</label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Protocol & Etiquette Prefect"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Badge Symbol</label>
              <div className="flex gap-2">
                {['⭐', '🏅', '👑', '🛡️', '🌟'].map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition cursor-pointer ${
                      selectedIcon === icon ? 'bg-amber-200 border-amber-500 scale-105' : 'bg-white border-neutral-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {savedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Prefect badge conferred successfully! Badge now visible in school chat and profile.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Confer Prefect Badge</span>
            </button>
          </form>

          {/* Active Prefects List */}
          <div>
            <h5 className="font-extrabold text-xs text-neutral-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Active Stanbax School Prefects ({currentPrefects.length})</span>
              <span className="text-[10px] text-neutral-400 font-semibold">Stanbax Prefectorial Board</span>
            </h5>

            {currentPrefects.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-200">
                No school prefects assigned yet. Use the form above to appoint students to the prefectorial council.
              </div>
            ) : (
              <div className="space-y-2">
                {currentPrefects.map(s => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h6 className="font-black text-xs text-neutral-900">{s.name}</h6>
                        <p className="text-[11px] text-neutral-500">{s.grade} • Reg: {s.regNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 shadow-2xs">
                        {s.prefectBadge || `🏅 ${s.prefectRole}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemovePrefect(s.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove Prefect Badge"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// ============================================================================
// 4. STUDENT CHAT PRIVACY & PRESENCE SETTINGS MODAL
// ============================================================================
interface StudentChatPrivacyModalProps {
  student: StudentProfile;
  onClose: () => void;
}

export const StudentChatPrivacyModal: React.FC<StudentChatPrivacyModalProps> = ({
  student,
  onClose
}) => {
  const { updateStudentChatSettings } = useSchool();

  const [showOnline, setShowOnline] = useState<boolean>(
    student.chatSettings?.showOnlineStatus !== false
  );
  const [allowDMs, setAllowDMs] = useState<boolean>(
    student.chatSettings?.allowDirectMessages !== false
  );
  const [dmPermission, setDmPermission] = useState<'classmates_only' | 'anyone'>(
    student.chatSettings?.dmPermission || 'anyone'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentChatSettings(student.id, {
      showOnlineStatus: showOnline,
      allowDirectMessages: allowDMs,
      dmPermission
    });
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-indigo-900 to-neutral-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-base text-white">Chat Privacy & Presence</h4>
              <p className="text-xs text-indigo-200">{student.name} • Settings</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Setting 1: Show Online Status */}
          <div className="p-4 rounded-2xl border border-neutral-200 hover:border-indigo-300 transition bg-neutral-50/50 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${showOnline ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'}`} />
                <h5 className="font-extrabold text-xs text-neutral-900">Show Online Presence Status</h5>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                When enabled, fellow scholars and tutors can see an active green dot when you are online in the School Community Hub.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={showOnline}
                onChange={(e) => setShowOnline(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Setting 2: Allow Fellow Students to Chat */}
          <div className="p-4 rounded-2xl border border-neutral-200 hover:border-indigo-300 transition bg-neutral-50/50 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <h5 className="font-extrabold text-xs text-neutral-900">Allow Direct Chat From Fellow Students</h5>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                When turned off, fellow classmates cannot initiate 1-on-1 private direct chats with you. (Faculty tutors and school administration will always be able to send important academic notices).
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={allowDMs}
                onChange={(e) => setAllowDMs(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Setting 3: Direct Message Audience Permission (Fellow Classmates vs Anyone) */}
          {allowDMs && (
            <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-700" />
                  <h5 className="font-extrabold text-xs text-neutral-900">Direct Message Audience</h5>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Scholar Privacy
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Choose which scholars at Stanbax College are permitted to message you privately:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Option A: Fellow Classmates Only */}
                <div
                  onClick={() => setDmPermission('classmates_only')}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-2 text-left ${
                    dmPermission === 'classmates_only'
                      ? 'border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-neutral-200 bg-white/70 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        dmPermission === 'classmates_only' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="font-black text-xs text-neutral-900">Classmates Only</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      dmPermission === 'classmates_only' ? 'border-indigo-600 bg-indigo-600' : 'border-neutral-300'
                    }`}>
                      {dmPermission === 'classmates_only' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    Only scholars in {student.grade ? student.grade : 'your class'} and tutors can direct message you.
                  </p>
                </div>

                {/* Option B: Anyone */}
                <div
                  onClick={() => setDmPermission('anyone')}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between gap-2 text-left ${
                    dmPermission === 'anyone'
                      ? 'border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-neutral-200 bg-white/70 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        dmPermission === 'anyone' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-black text-xs text-neutral-900">Anyone</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      dmPermission === 'anyone' ? 'border-indigo-600 bg-indigo-600' : 'border-neutral-300'
                    }`}>
                      {dmPermission === 'anyone' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    Any scholar (clubs, other grades, societies) and faculty can direct message you.
                  </p>
                </div>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Privacy settings updated!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
