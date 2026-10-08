import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Crown, 
  Calendar, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck, 
  Edit3, 
  Save, 
  RotateCcw,
  ExternalLink
} from '../../RealIcons';

export const AdminProprietressTab: React.FC = () => {
  const { 
    proprietressProfile, 
    updateProprietressProfile, 
    appointments, 
    updateAppointmentStatus, 
    messagesToProprietress, 
    updateProprietressMessageStatus,
    directives,
    addDirective,
    deleteDirective
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'appointments' | 'messages' | 'directives'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...proprietressProfile });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProprietressProfile(profileForm);
    setIsEditingProfile(false);
    setSuccessMsg('Proprietress executive profile successfully updated.');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-blue-950 p-6 shadow-md border border-amber-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-950 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>Executive Council & Governance</span>
            </span>
            <span className="text-xs font-bold text-blue-900">• Desk of the Proprietress</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-blue-950">
            {proprietressProfile.honorifics} {proprietressProfile.name}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-blue-900/90 max-w-2xl">
            {proprietressProfile.title} — Oversight of executive communications, official appointments, directives, and leadership statements.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-1.5 bg-blue-950/10 p-1 rounded-2xl border border-blue-950/10 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'profile' ? 'bg-blue-950 text-amber-300 shadow-sm' : 'text-blue-950 hover:bg-white/40'
            }`}
          >
            Profile & Statements
          </button>
          <button
            onClick={() => setActiveSubTab('appointments')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'appointments' ? 'bg-blue-950 text-amber-300 shadow-sm' : 'text-blue-950 hover:bg-white/40'
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('messages')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'messages' ? 'bg-blue-950 text-amber-300 shadow-sm' : 'text-blue-950 hover:bg-white/40'
            }`}
          >
            Messages ({messagesToProprietress.length})
          </button>
          <button
            onClick={() => setActiveSubTab('directives')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'directives' ? 'bg-blue-950 text-amber-300 shadow-sm' : 'text-blue-950 hover:bg-white/40'
            }`}
          >
            Directives ({directives.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub-tab 1: Profile & Statements */}
      {activeSubTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Proprietress Official Profile & Address</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays on the public website under "Proprietress Desk" and executive announcements.
              </p>
            </div>

            <button
              onClick={() => {
                if (isEditingProfile) {
                  setProfileForm({ ...proprietressProfile });
                }
                setIsEditingProfile(!isEditingProfile);
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-blue-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Executive Profile'}</span>
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Honorifics / Title</label>
                  <input
                    type="text"
                    value={profileForm.honorifics}
                    onChange={e => setProfileForm({ ...profileForm, honorifics: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Role</label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Term Theme</label>
                <input
                  type="text"
                  value={profileForm.termTheme}
                  onChange={e => setProfileForm({ ...profileForm, termTheme: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Welcome Message to Parents & Public</label>
                <textarea
                  rows={4}
                  value={profileForm.welcomeMessage}
                  onChange={e => setProfileForm({ ...profileForm, welcomeMessage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Term Address</label>
                <textarea
                  rows={4}
                  value={profileForm.termAddress}
                  onChange={e => setProfileForm({ ...profileForm, termAddress: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-black flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Name</span>
                  <span className="font-black text-slate-900 text-sm">{proprietressProfile.name}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation</span>
                  <span className="font-black text-blue-950">{proprietressProfile.title}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Email</span>
                  <span className="font-bold text-slate-700">{proprietressProfile.directEmail}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Executive Phone</span>
                  <span className="font-bold text-slate-700">{proprietressProfile.executivePhone}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-800">Current Academic Term Theme:</span>
                <p className="font-black text-amber-950 text-sm">"{proprietressProfile.termTheme}"</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Welcome Message:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {proprietressProfile.welcomeMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: Appointments */}
      {activeSubTab === 'appointments' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-800" />
                <span>Executive Appointments Booking Roster</span>
              </h3>
              <p className="text-xs text-slate-500">Meetings scheduled with the Proprietress</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 font-bold text-xs border border-blue-200">
              {appointments.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{appt.parentName || appt.guestName}</span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                      appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Purpose: <strong>{appt.purpose}</strong> • Preferred: {appt.preferredDate || appt.requestedDate} ({appt.preferredTimeSlot || appt.requestedTime})
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Contact: {appt.email} • {appt.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {appt.status !== 'Approved' && (
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'Approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {appt.status !== 'Completed' && (
                    <button
                      onClick={() => updateAppointmentStatus(appt.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Messages */}
      {activeSubTab === 'messages' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-800" />
                <span>Executive Confidential Inbox</span>
              </h3>
              <p className="text-xs text-slate-500">Messages sent directly to the Proprietress Desk</p>
            </div>
          </div>

          <div className="space-y-3">
            {messagesToProprietress.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-black text-slate-900 text-sm">{msg.subject}</span>
                    <span className="text-slate-500 ml-2">from {msg.senderName} ({msg.senderRole})</span>
                  </div>
                  <span className="text-slate-400">{msg.date}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{msg.content || msg.message}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px]">
                    {msg.category}
                  </span>
                  <span className="text-slate-400 text-[10px]">Ref: {msg.refNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Directives */}
      {activeSubTab === 'directives' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-800" />
                <span>Official Institutional Directives</span>
              </h3>
              <p className="text-xs text-slate-500">Policies and decrees issued by the Proprietress</p>
            </div>
          </div>

          <div className="space-y-3">
            {directives.map((dir) => (
              <div key={dir.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{dir.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                    {dir.targetAudience}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{dir.summary}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-500 text-[10px]">
                  <span>Ref: {dir.refCode} • Issued: {dir.date}</span>
                  <button
                    onClick={() => deleteDirective(dir.id)}
                    className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
