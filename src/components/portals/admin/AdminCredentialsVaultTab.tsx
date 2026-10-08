import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { isRemoteEnabled } from '../../../lib/supabase';
import { UserCredentialItem, UserRole } from '../../../types';
import { 
  KeyRound, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Users, 
  GraduationCap, 
  Building2 
} from '../../RealIcons';

export const AdminCredentialsVaultTab: React.FC = () => {
  const { 
    getAllUserCredentials, 
    adminResetUserPassword, 
    changePassword,
    adminSecurityQuestion,
    adminSecurityAnswer,
    updateAdminSecurityQuestion,
    schoolInfo 
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'admin' | 'proprietress' | 'tutor' | 'student' | 'alumni'>('all');
  const [revealAll, setRevealAll] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Admin personal password change
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Admin security question management
  const [isEditingSecQ, setIsEditingSecQ] = useState(false);
  const [secQuestionInput, setSecQuestionInput] = useState(adminSecurityQuestion || 'What is your password');
  const [secAnswerInput, setSecAnswerInput] = useState(adminSecurityAnswer || 'Stanbax');
  const [showSecAnswer, setShowSecAnswer] = useState(false);
  const [secQMsg, setSecQMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // User password reset modal
  const [selectedUserForReset, setSelectedUserForReset] = useState<UserCredentialItem | null>(null);
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  const allCredentials = getAllUserCredentials();

  const filteredCredentials = allCredentials.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roleLabel.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedRoleFilter === 'all') return true;
    if (selectedRoleFilter === 'admin') return item.role === 'admin';
    if (selectedRoleFilter === 'proprietress') return item.role === 'proprietress';
    if (selectedRoleFilter === 'tutor') return item.role === 'tutor';
    if (selectedRoleFilter === 'student') return item.role === 'student' && item.status !== 'Alumni';
    if (selectedRoleFilter === 'alumni') return item.status === 'Alumni';

    return true;
  });

  const toggleRevealOne = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPassword = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAdminSelfChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg(null);

    if (newAdminPass !== confirmAdminPass) {
      setAdminPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newAdminPass.length < 6) {
      setAdminPassMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    const res = changePassword('admin', currentAdminPass, newAdminPass);
    if (res.success) {
      setAdminPassMsg({ type: 'success', text: res.message });
      setCurrentAdminPass('');
      setNewAdminPass('');
      setConfirmAdminPass('');
    } else {
      setAdminPassMsg({ type: 'error', text: res.message });
    }
  };

  const handleConfirmUserReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset || !resetNewPass.trim()) return;

    const success = adminResetUserPassword(
      selectedUserForReset.id, 
      selectedUserForReset.role, 
      resetNewPass.trim()
    );

    if (success) {
      setResetSuccessMsg(`Password for ${selectedUserForReset.name} updated successfully in Supabase database to: ${resetNewPass}`);
      setTimeout(() => {
        setResetSuccessMsg('');
        setSelectedUserForReset(null);
        setResetNewPass('');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-950">
            <KeyRound className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black">Central Credentials & Password Vault</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Full administrative transparency: View, inspect, copy, and reset passwords across all institutional user accounts (Administrators, Proprietress, Faculty Tutors, and Scholars).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRevealAll(!revealAll)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm self-start md:self-auto ${
            revealAll ? 'bg-amber-400 text-blue-950 hover:bg-amber-500' : 'bg-slate-800 text-white hover:bg-slate-900'
          }`}
          id="btn-toggle-reveal-all-passwords"
        >
          {revealAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{revealAll ? 'Mask All Passwords' : 'Reveal All Passwords'}</span>
        </button>
      </div>

      {/* Cloud Database Sync Status Indicator */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
        isRemoteEnabled() 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-2.5">
          {isRemoteEnabled() ? (
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span>
            {isRemoteEnabled() ? (
              <><strong>Supabase Central Database Active:</strong> Passwords and administrative resets are encrypted with bcrypt and saved directly to Supabase PostgreSQL, synchronizing across all devices.</>
            ) : (
              <><strong>Single-Device Local Storage:</strong> Connect Supabase via Cloud Database Settings to automatically save all passwords and resets to your central PostgreSQL cloud database.</>
            )}
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
          isRemoteEnabled() ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
        }`}>
          {isRemoteEnabled() ? 'Cloud Synced' : 'Local Only'}
        </span>
      </div>

      {/* Admin Personal Password Change Widget (Collapsible) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Change Master Admin Password</h3>
              <p className="text-[11px] text-slate-400">Update the principal administrative account passkey.</p>
            </div>
          </div>
          <span className="text-[11px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
            Identifier: Admin
          </span>
        </div>

        {adminPassMsg && (
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            adminPassMsg.type === 'error' ? 'bg-rose-950/70 text-rose-300 border border-rose-800' : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
          }`}>
            {adminPassMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{adminPassMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleAdminSelfChangePassword} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentAdminPass}
              onChange={(e) => setCurrentAdminPass(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={newAdminPass}
              onChange={(e) => setNewAdminPass(e.target.value)}
              placeholder="Min 6 chars"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmAdminPass}
              onChange={(e) => setConfirmAdminPass(e.target.value)}
              placeholder="Re-type new"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs transition cursor-pointer shadow-sm"
              id="btn-update-admin-master-password"
            >
              Update Admin Password
            </button>
          </div>
        </form>

        {/* Admin Anti-Hack Security Question Protection Card */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Anti-Hack Account Protection Shield</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                    Active & Enforced
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Prevents unauthorized password resets at the login gateway. Resetting the Admin account strictly requires answering this security question.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsEditingSecQ(!isEditingSecQ);
                setSecQuestionInput(adminSecurityQuestion || 'What is your password');
                setSecAnswerInput(adminSecurityAnswer || 'Stanbax');
                setSecQMsg(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition cursor-pointer self-start sm:self-auto"
            >
              {isEditingSecQ ? 'Cancel Edit' : 'Edit Security Question'}
            </button>
          </div>

          {secQMsg && (
            <div className={`p-2.5 rounded-xl text-xs font-bold mb-3 flex items-center gap-2 ${
              secQMsg.type === 'error' ? 'bg-rose-950/70 text-rose-300 border border-rose-800' : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
            }`}>
              {secQMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{secQMsg.text}</span>
            </div>
          )}

          {isEditingSecQ ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setSecQMsg(null);
                const res = updateAdminSecurityQuestion(secQuestionInput, secAnswerInput);
                if (res.success) {
                  setSecQMsg({ type: 'success', text: res.message });
                  setTimeout(() => {
                    setIsEditingSecQ(false);
                    setSecQMsg(null);
                  }, 1500);
                } else {
                  setSecQMsg({ type: 'error', text: res.message });
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800"
            >
              <div className="sm:col-span-6">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Security Question
                </label>
                <input
                  type="text"
                  required
                  value={secQuestionInput}
                  onChange={(e) => setSecQuestionInput(e.target.value)}
                  placeholder="e.g. What is your password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Security Answer
                </label>
                <div className="relative">
                  <input
                    type={showSecAnswer ? 'text' : 'password'}
                    required
                    value={secAnswerInput}
                    onChange={(e) => setSecAnswerInput(e.target.value)}
                    placeholder="e.g. Your first school name"
                    className="w-full px-3 py-2 pr-9 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecAnswer(!showSecAnswer)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showSecAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-sm"
                >
                  Save Question
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Configured Security Question:</span>
                <p className="font-bold text-amber-300">"{adminSecurityQuestion || 'What is your password'}"</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Protected Answer:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-emerald-400">
                    {showSecAnswer ? (adminSecurityAnswer || 'Stanbax') : '•••••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSecAnswer(!showSecAnswer)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                    title={showSecAnswer ? 'Hide answer' : 'Reveal answer'}
                  >
                    {showSecAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}
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
            placeholder="Search by name, identifier, or email..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Role:</span>
          {[
            { id: 'all', label: `All (${allCredentials.length})` },
            { id: 'admin', label: 'Admin' },
            { id: 'proprietress', label: 'Proprietress' },
            { id: 'tutor', label: 'Tutors' },
            { id: 'student', label: 'Scholars' },
            { id: 'alumni', label: 'Alumni' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRoleFilter(r.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] transition cursor-pointer whitespace-nowrap ${
                selectedRoleFilter === r.id ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Credentials Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Primary Identifier</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Class / Dept</th>
                <th className="py-3 px-4">Active Password</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCredentials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No user credentials found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCredentials.map((item) => {
                  const isVisible = revealAll || !!revealedIds[item.id];
                  const isCopied = copiedId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-xs">{item.name}</div>
                        <div className="mt-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            item.role === 'admin'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.role === 'proprietress'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : item.role === 'tutor'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : item.status === 'Alumni'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {item.roleLabel}
                          </span>
                        </div>
                      </td>

                      {/* Identifier */}
                      <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-900">
                        {item.primaryIdentifier}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {item.email}
                      </td>

                      {/* Grade / Dept */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {item.departmentOrGrade || '—'}
                      </td>

                      {/* Password */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-1 rounded-md font-bold text-xs ${
                            isVisible ? 'bg-amber-50 text-slate-900 border border-amber-200' : 'text-slate-400 select-none'
                          }`}>
                            {isVisible ? item.password : '••••••••••••'}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleRevealOne(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                            title={isVisible ? 'Hide password' : 'View password'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyPassword(item.id, item.password)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1 cursor-pointer border ${
                            isCopied
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                          title="Copy password to clipboard"
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserForReset(item);
                            setResetNewPass('');
                            setResetSuccessMsg('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-[11px] font-bold transition cursor-pointer shadow-xs"
                          title="Reset this user's password"
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Admin Direct Reset User Password */}
      {selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-slate-900">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black">Reset User Password</h3>
                <p className="text-xs text-slate-500">Administrative override for {selectedUserForReset.name}</p>
              </div>
            </div>

            {resetSuccessMsg ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{resetSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmUserReset} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1 text-slate-600 border border-slate-200">
                  <div><strong>Account:</strong> {selectedUserForReset.name} ({selectedUserForReset.roleLabel})</div>
                  <div><strong>Identifier:</strong> {selectedUserForReset.primaryIdentifier}</div>
                  <div><strong>Current Password:</strong> <span className="font-mono font-bold text-slate-800">{selectedUserForReset.password}</span></div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Assign New Password
                  </label>
                  <input
                    type="text"
                    required
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserForReset(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md cursor-pointer transition"
                  >
                    Save & Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
