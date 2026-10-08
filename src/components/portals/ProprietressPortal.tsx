import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolLogo } from '../SchoolLogo';
import { 
  Building2, 
  Users, 
  Calendar, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  LogOut, 
  ArrowLeft, 
  Menu, 
  X, 
  ChevronRight, 
  Lock, 
  LayoutDashboard,
  Award,
  Send,
  PlusCircle, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Check 
} from '../RealIcons';
import { ProprietressDirective } from '../../types';

interface ProprietressPortalProps {
  onBackToWebsite: () => void;
}

export const ProprietressPortal: React.FC<ProprietressPortalProps> = ({ onBackToWebsite }) => {
  const { 
    proprietressProfile, 
    updateProprietressProfile, 
    appointments, 
    updateAppointmentStatus, 
    messagesToProprietress, 
    updateProprietressMessageStatus, 
    directives, 
    addDirective, 
    updateDirective, 
    deleteDirective, 
    logoutProprietress, 
    schoolInfo, 
    images, 
    students, 
    tutors, 
    classes, 
    changePassword,
    setActiveSection
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'overview' | 'directives' | 'appointments' | 'messages' | 'security'>('overview');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // New directive form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academic Policy' | 'Administrative Directive' | 'Infrastructure' | 'Student Welfare' | 'Staff Development'>('Academic Policy');
  const [newPriority, setNewPriority] = useState<'Standard' | 'Urgent' | 'Mandatory Compliance'>('Standard');
  const [newAudience, setNewAudience] = useState<'All Staff' | 'Teaching Staff Only' | 'Parents & Guardians' | 'General School Community'>('All Staff');
  const [newSummary, setNewSummary] = useState('');
  const [directiveSuccess, setDirectiveSuccess] = useState('');

  // Change password form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Close side menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSideMenuOpen(false);
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
    return () => { document.body.style.overflow = 'unset'; };
  }, [isSideMenuOpen]);

  const handleAddDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    addDirective({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      targetAudience: newAudience,
      summary: newSummary.trim(),
      content: newSummary.trim(),
      refCode: `STX-DIR-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Active'
    });

    setDirectiveSuccess('Executive directive officially issued and logged into institutional records.');
    setNewTitle('');
    setNewSummary('');
    setTimeout(() => setDirectiveSuccess(''), 3500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPass !== confirmPass) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match. Please verify.' });
      return;
    }
    if (newPass.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    const res = changePassword('proprietress', currentPass, newPass);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: res.message });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPasswordMsg({ type: 'error', text: res.message });
    }
  };

  const handleLogout = () => {
    logoutProprietress();
    setActiveSection('home');
  };

  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const unreadMessages = messagesToProprietress.filter(m => m.status === 'Unread').length;
  const activeDirectivesCount = directives.filter(d => d.status === 'Active').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Nunito',sans-serif]">
      {/* Top Executive Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition cursor-pointer border border-slate-700"
              title="Open Navigation Drawer"
              id="btn-proprietress-menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <SchoolLogo size="sm" showText={false} />
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
                  <span>Executive Governance Portal</span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-amber-400/30">
                    Proprietress Council
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {schoolInfo.name} • Office of the Proprietress
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToWebsite}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">School Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 border border-rose-800/50 cursor-pointer"
              id="btn-proprietress-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Drawer */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSideMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-80 bg-slate-900 text-white shadow-2xl flex flex-col border-r border-slate-800">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-black">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">Executive Desk</h2>
                    <p className="text-[11px] text-amber-400 font-semibold">{proprietressProfile.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs">
                <button
                  onClick={() => { setActiveTab('overview'); setIsSideMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    activeTab === 'overview' ? 'bg-amber-400 text-blue-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Executive Overview</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => { setActiveTab('directives'); setIsSideMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    activeTab === 'directives' ? 'bg-amber-400 text-blue-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4" />
                    <span>Policy Directives</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-bold">
                    {activeDirectivesCount}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('appointments'); setIsSideMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    activeTab === 'appointments' ? 'bg-amber-400 text-blue-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>Audience Requests</span>
                  </div>
                  {pendingAppointments > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-bold">
                      {pendingAppointments} new
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('messages'); setIsSideMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    activeTab === 'messages' ? 'bg-amber-400 text-blue-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    <span>Executive Memos</span>
                  </div>
                  {unreadMessages > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-bold">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { setActiveTab('security'); setIsSideMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition cursor-pointer ${
                    activeTab === 'security' ? 'bg-amber-400 text-blue-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Change Executive Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Council</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Profile Card Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center text-2xl font-black shadow-lg border-2 border-amber-300 shrink-0">
              {proprietressProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PB'}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{proprietressProfile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold uppercase border border-amber-400/30">
                  Proprietress & Founder
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">{proprietressProfile.qualifications}</p>
              <p className="text-xs text-slate-300 italic mt-2 max-w-2xl">
                "{proprietressProfile.welcomeMessage.slice(0, 160)}..."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-black text-amber-400">{students.length}</div>
              <div className="text-[10px] text-blue-200 uppercase font-bold">Scholars</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-black text-amber-400">{tutors.length}</div>
              <div className="text-[10px] text-blue-200 uppercase font-bold">Faculty Tutors</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
              <div className="text-lg sm:text-xl font-black text-amber-400">{classes.length}</div>
              <div className="text-[10px] text-blue-200 uppercase font-bold">Classes</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Governance Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('directives')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'directives' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Policy Directives</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black">
              {activeDirectivesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'appointments' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Audience Appointments</span>
            {pendingAppointments > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {pendingAppointments}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Confidential Memos</span>
            {unreadMessages > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {unreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'security' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">School Vision</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {schoolInfo.vision || 'To nurture future global leaders grounded in academic brilliance, moral integrity, and technological prowess.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Core Mission</span>
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {schoolInfo.mission || 'Providing holistic education through world-class curricula, dedicated tutors, and cutting-edge facilities.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Active Term & Session</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-black text-slate-900">{schoolInfo.activeSession}</div>
                <div className="text-xs text-slate-500 font-semibold">{schoolInfo.activeTerm}</div>
              </div>
            </div>

            {/* Quick Action Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab('directives')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-slate-800">{activeDirectivesCount}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">Active Directives</h3>
                <p className="text-xs text-slate-500 mt-1">Review school circulars, compliance orders, and staff mandates.</p>
              </div>

              <div 
                onClick={() => setActiveTab('appointments')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-slate-800">{appointments.length}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">Audience Appointments</h3>
                <p className="text-xs text-slate-500 mt-1">Manage executive audience bookings with parents and stakeholders.</p>
              </div>

              <div 
                onClick={() => setActiveTab('messages')}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-slate-800">{messagesToProprietress.length}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">Confidential Letters</h3>
                <p className="text-xs text-slate-500 mt-1">Access direct inquiries sent directly to the Proprietress' desk.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Directives */}
        {activeTab === 'directives' && (
          <div className="space-y-6">
            {/* New Directive Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <PlusCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black">Issue Executive Policy Directive</h3>
              </div>

              {directiveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{directiveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAddDirective} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Directive Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Mandatory Continuous Assessment Submission Deadline"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 outline-none"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Mandatory Compliance">Mandatory Compliance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 outline-none"
                    >
                      <option value="Academic Policy">Academic Policy</option>
                      <option value="Administrative Directive">Administrative Directive</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Student Welfare">Student Welfare</option>
                      <option value="Staff Development">Staff Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-800 outline-none"
                    >
                      <option value="All Staff">All Staff</option>
                      <option value="Teaching Staff Only">Teaching Staff Only</option>
                      <option value="Parents & Guardians">Parents & Guardians</option>
                      <option value="General School Community">General School Community</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Directive Text / Executive Summary
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="Provide full operational guidance and institutional instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md cursor-pointer transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Publish Official Directive</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Directives */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Issued Directives Archive ({directives.length})
              </h3>

              {directives.map((dir) => (
                <div 
                  key={dir.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{dir.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        dir.priority === 'Mandatory Compliance'
                          ? 'bg-rose-100 text-rose-800'
                          : dir.priority === 'Urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {dir.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">{dir.dateIssued}</span>
                      <button
                        onClick={() => updateDirective(dir.id, { status: dir.status === 'Active' ? 'Archived' : 'Active' })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                      >
                        {dir.status === 'Active' ? 'Archive' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteDirective(dir.id)}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete directive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {dir.summary}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Category: <strong className="text-slate-700">{dir.category}</strong></span>
                    <span>•</span>
                    <span>Audience: <strong className="text-slate-700">{dir.targetAudience}</strong></span>
                    <span>•</span>
                    <span>Status: <strong className={dir.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}>{dir.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Audience Requests & Protocol Log ({appointments.length})
            </h3>

            {appointments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200">
                No audience appointment requests scheduled.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((app) => (
                  <div 
                    key={app.id} 
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{app.guestName}</span>
                        <span className="text-xs text-slate-500">({app.roleOrAffiliation})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500">{app.requestedDate} at {app.requestedTime}</span>
                        {app.status === 'Pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {app.status === 'Approved' && (
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-950 cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Purpose:</strong> {app.purpose}
                    </p>

                    <div className="text-[11px] text-slate-500 flex gap-4 pt-1">
                      <span>Phone: {app.phone}</span>
                      <span>Email: {app.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Executive Letters & Memos ({messagesToProprietress.length})
            </h3>

            {messagesToProprietress.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200">
                No incoming correspondence in the Proprietress inbox.
              </div>
            ) : (
              <div className="space-y-3">
                {messagesToProprietress.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{msg.senderName}</span>
                        <span className="text-xs text-blue-700 font-semibold">• {msg.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          msg.status === 'Unread' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {msg.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">{msg.date}</span>
                        {msg.status === 'Unread' && (
                          <button
                            onClick={() => updateProprietressMessageStatus(msg.id, 'Read')}
                            className="px-2.5 py-1 rounded-lg bg-blue-900 text-white font-bold hover:bg-blue-950 cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-medium whitespace-pre-line leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="text-[11px] text-slate-500 flex gap-4 pt-1">
                      <span>Email: {msg.senderEmail}</span>
                      {msg.phone && <span>Phone: {msg.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Security / Change Password */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Change Executive Password</h3>
                <p className="text-xs text-slate-500">Update your private Proprietress portal login credentials.</p>
              </div>
            </div>

            {passwordMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passwordMsg.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {passwordMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  New Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-800 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-black shadow-md cursor-pointer transition"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
