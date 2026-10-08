import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Mail, 
  Phone, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Camera, 
  GraduationCap, 
  FileText, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Check, 
  Info,
  Shield,
  HelpCircle,
  Sparkles
} from '../../RealIcons';
import { ALL_PRIVILEGES, DEFAULT_ROLE_PRIVILEGES } from '../../../data/rolePrivilegesData';
import { PrivilegeKey, UserRole, ModeratorProfile } from '../../../types';
import { isRemoteEnabled } from '../../../lib/supabase';

export const AdminRolePrivilegesTab: React.FC = () => {
  const {
    rolePrivileges,
    updateRolePrivilege,
    resetRolePrivileges,
    headmistressProfile,
    updateHeadmistressProfile,
    moderators,
    addModerator,
    updateModerator,
    deleteModerator
  } = useSchool();

  const [activeRoleTab, setActiveRoleTab] = useState<'headmistress' | 'moderator' | 'tutor' | 'student' | 'parent'>('headmistress');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  
  // Head Mistress editing state
  const [hmName, setHmName] = useState(headmistressProfile.name);
  const [hmTitle, setHmTitle] = useState(headmistressProfile.title);
  const [hmEmail, setHmEmail] = useState(headmistressProfile.email);
  const [hmPhone, setHmPhone] = useState(headmistressProfile.phone);
  const [hmQualification, setHmQualification] = useState(headmistressProfile.qualification);
  const [hmWelcome, setHmWelcome] = useState(headmistressProfile.welcomeMessage);
  const [isEditingHm, setIsEditingHm] = useState(false);

  // New Moderator modal state
  const [showAddModModal, setShowAddModModal] = useState(false);
  const [newModName, setNewModName] = useState('');
  const [newModEmail, setNewModEmail] = useState('');
  const [newModPhone, setNewModPhone] = useState('');
  const [newModTitle, setNewModTitle] = useState('Community & Communications Moderator');

  const remoteActive = isRemoteEnabled();

  const handleSaveHmProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeadmistressProfile({
      name: hmName.trim(),
      title: hmTitle.trim(),
      email: hmEmail.trim(),
      phone: hmPhone.trim(),
      qualification: hmQualification.trim(),
      welcomeMessage: hmWelcome.trim()
    });
    setIsEditingHm(false);
    triggerSuccess('Head Mistress official profile updated successfully!');
  };

  const handleCreateModerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModName.trim() || !newModEmail.trim()) return;

    addModerator({
      name: newModName.trim(),
      email: newModEmail.trim(),
      phone: newModPhone.trim() || '+234 800 000 0000',
      roleTitle: newModTitle.trim() || 'Community Moderator',
      assignedSections: ['School Live Chat', 'Visitor Desk', 'Broadcasts & Gallery'],
      status: 'Active'
    });

    setNewModName('');
    setNewModEmail('');
    setNewModPhone('');
    setShowAddModModal(false);
    triggerSuccess('New Moderator appointed and registered in system!');
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4500);
  };

  const currentRolePrivs = rolePrivileges[activeRoleTab] || {};

  const categories = [
    'Academics & Faculty',
    'Communications & Chat',
    'Operations & Administration',
    'Security & Finance'
  ] as const;

  // Compute grant counts
  const totalPrivilegesCount = ALL_PRIVILEGES.length;
  const grantedCount = ALL_PRIVILEGES.filter(p => !!currentRolePrivs[p.key]).length;

  const handleGrantAll = () => {
    ALL_PRIVILEGES.forEach(p => {
      // Don't auto-grant financial or security vault to lower roles unless specifically desired
      if ((p.key === 'financial_records' || p.key === 'credentials_vault') && (activeRoleTab === 'student' || activeRoleTab === 'parent')) {
        return;
      }
      updateRolePrivilege(activeRoleTab, p.key, true);
    });
    triggerSuccess(`All permitted privileges granted to ${activeRoleTab.toUpperCase()}!`);
  };

  const handleRevokeAll = () => {
    ALL_PRIVILEGES.forEach(p => {
      updateRolePrivilege(activeRoleTab, p.key, false);
    });
    triggerSuccess(`All privileges revoked for ${activeRoleTab.toUpperCase()}!`);
  };

  const handleResetDefaults = () => {
    resetRolePrivileges(activeRoleTab as any);
    triggerSuccess(`Reset ${activeRoleTab.toUpperCase()} privileges to recommended institutional defaults.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Role-Based Access Control (RBAC) & Delegations
            </span>
            {remoteActive ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black border border-emerald-500/30">
                Cloud Synced
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-500/30">
                Local Active
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Administrative Role Privileges & Governance
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            As Central Administrator, you control exactly which modules and operational privileges are delegated to the 
            <strong> Head Mistress</strong>, <strong>Moderators</strong>, <strong>Faculty Tutors</strong>, and other roles. Changes update in real-time across the school system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/15 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>Reset Role Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => triggerSuccess('Institutional role privileges successfully saved to database state!')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-neutral-950" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>

      {/* Success alert message */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {[
          { id: 'headmistress', label: 'Head Mistress', icon: Award, subtitle: 'Executive Academic Head' },
          { id: 'moderator', label: 'Moderator', icon: MessageSquare, subtitle: 'Community & Communications' },
          { id: 'tutor', label: 'Faculty Tutor', icon: BookOpen, subtitle: 'Subject & Class Educators' },
          { id: 'student', label: 'Scholar / Student', icon: GraduationCap, subtitle: 'Enrolled Scholars' },
          { id: 'parent', label: 'Parent / Guardian', icon: Users, subtitle: 'Family Portal' }
        ].map(roleItem => {
          const isActive = activeRoleTab === roleItem.id;
          const RoleIcon = roleItem.icon;
          return (
            <button
              key={roleItem.id}
              type="button"
              onClick={() => setActiveRoleTab(roleItem.id as any)}
              className={`px-4 py-3 rounded-2xl text-left transition flex items-center gap-3 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isActive ? 'bg-amber-400 text-neutral-950' : 'bg-stone-100 text-stone-600'
              }`}>
                <RoleIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm">{roleItem.label}</div>
                <div className={`text-[10px] ${isActive ? 'text-neutral-300' : 'text-stone-500'}`}>
                  {roleItem.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Role Detail Cards: Headmistress profile & Moderator management */}
      {activeRoleTab === 'headmistress' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                <Award className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-stone-900">{headmistressProfile.name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                    Academic Leader
                  </span>
                </div>
                <p className="text-xs text-stone-500">{headmistressProfile.title} • {headmistressProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingHm(!isEditingHm)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition cursor-pointer"
              >
                {isEditingHm ? 'Cancel Editing' : 'Edit Official Profile'}
              </button>
            </div>
          </div>

          {isEditingHm ? (
            <form onSubmit={handleSaveHmProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={hmName}
                  onChange={e => setHmName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Official Title</label>
                <input
                  type="text"
                  value={hmTitle}
                  onChange={e => setHmTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={hmEmail}
                  onChange={e => setHmEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Official Telephone</label>
                <input
                  type="text"
                  value={hmPhone}
                  onChange={e => setHmPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Academic Credentials & Qualifications</label>
                <input
                  type="text"
                  value={hmQualification}
                  onChange={e => setHmQualification(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Welcome & Mission Statement</label>
                <textarea
                  value={hmWelcome}
                  onChange={e => setHmWelcome(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingHm(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-4 rounded-2xl">
              <div>
                <span className="text-stone-500 block text-[11px]">Login Identifier</span>
                <span className="font-bold text-stone-800">headmistress</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Default Password</span>
                <span className="font-mono font-bold text-amber-800">Headmistress2025!</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Primary Portal URL</span>
                <span className="font-bold text-blue-900">Head Mistress Portal</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeRoleTab === 'moderator' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-stone-900">Appointed Community Moderators</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                  {moderators.length} Staff
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Moderators manage community chat channels, live prospective visitor inquiries, and photo gallery curation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Appoint New Moderator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {moderators.map(mod => (
              <div key={mod.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs">
                      {mod.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-xs sm:text-sm text-stone-900">{mod.name}</div>
                      <div className="text-[11px] text-stone-500">{mod.roleTitle}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    mod.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {mod.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200/80">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{mod.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{mod.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100 text-[11px]">
                    <Key className="w-3 h-3 text-amber-600" />
                    <span>Login: <strong className="text-stone-800">{mod.email.split('@')[0]}</strong> • Pass: <strong className="text-amber-800 font-mono">Moderator2025!</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const nextStatus = mod.status === 'Active' ? 'Suspended' : 'Active';
                      updateModerator(mod.id, { status: nextStatus });
                      triggerSuccess(`${mod.name} is now ${nextStatus}.`);
                    }}
                    className="text-stone-600 hover:text-stone-900 font-bold underline cursor-pointer"
                  >
                    Toggle {mod.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>

                  {moderators.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove moderator appointment for ${mod.name}?`)) {
                          deleteModerator(mod.id);
                          triggerSuccess(`Removed moderator ${mod.name}.`);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privileges Matrix Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-stone-900">
                Delegated Privileges for {activeRoleTab.toUpperCase()}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-xs font-black">
                {grantedCount} of {totalPrivilegesCount} Granted
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Toggle specific institutional responsibilities on or off. Modules will dynamically adapt their interface.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGrantAll}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Grant All</span>
            </button>
            <button
              type="button"
              onClick={handleRevokeAll}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition flex items-center gap-1.5 border border-rose-200 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Revoke All</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          {categories.map(cat => {
            const catPrivileges = ALL_PRIVILEGES.filter(p => p.category === cat);
            if (catPrivileges.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <h4 className="font-black text-xs uppercase tracking-wider text-stone-700">
                    {cat}
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    ({catPrivileges.filter(p => !!currentRolePrivs[p.key]).length}/{catPrivileges.length} enabled)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catPrivileges.map(priv => {
                    const isGranted = !!currentRolePrivs[priv.key];

                    return (
                      <div
                        key={priv.key}
                        onClick={() => {
                          updateRolePrivilege(activeRoleTab, priv.key, !isGranted);
                          triggerSuccess(`${priv.label} ${!isGranted ? 'granted to' : 'revoked from'} ${activeRoleTab}!`);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isGranted
                            ? 'bg-amber-50/50 hover:bg-amber-50 border-amber-300/80 shadow-xs ring-1 ring-amber-400/20'
                            : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200 text-stone-500 opacity-80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-black text-xs ${isGranted ? 'text-stone-900' : 'text-stone-600'}`}>
                              {priv.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 flex items-center gap-1 ${
                              isGranted
                                ? 'bg-amber-200/80 text-amber-900 border border-amber-300'
                                : 'bg-stone-200 text-stone-600'
                            }`}>
                              {isGranted ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                              {isGranted ? 'Granted' : 'Locked'}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-stone-500">
                            {priv.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                          <span className="font-mono text-[10px] text-stone-400">{priv.key}</span>
                          <span className={`font-bold ${isGranted ? 'text-amber-800' : 'text-stone-500'}`}>
                            Click to {isGranted ? 'Revoke' : 'Grant'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Moderator Modal */}
      {showAddModModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
                  <UserCheck className="w-5 h-5 text-blue-900" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">Appoint New Moderator</h3>
                  <p className="text-[11px] text-stone-500">Grant live community moderation credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateModerator} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Moderator Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Kehinde Badmus"
                  value={newModName}
                  onChange={e => setNewModName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Official Institutional Email</label>
                <input
                  type="email"
                  placeholder="e.g. moderator@stanbaxschools.edu.ng"
                  value={newModEmail}
                  onChange={e => setNewModEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Telephone Contact</label>
                <input
                  type="text"
                  placeholder="+234 802 345 6789"
                  value={newModPhone}
                  onChange={e => setNewModPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Role Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Community & Communications Moderator"
                  value={newModTitle}
                  onChange={e => setNewModTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <span className="font-black block">Default System Access</span>
                <span>The moderator will receive initial login credentials: username is their email prefix, default password is <code>Moderator2025!</code>.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black shadow-xs"
                >
                  Appoint Moderator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
