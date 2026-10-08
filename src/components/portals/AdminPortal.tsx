import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolLogo } from '../SchoolLogo';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Settings, 
  Calendar, 
  FileText, 
  LogOut, 
  Search, 
  ChevronRight, 
  Layers, 
  ShieldCheck, 
  Key, 
  Radio, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Menu,
  X,
  HelpCircle,
  Layout,
  MessageSquare,
  School as SchoolIcon,
  Camera
} from '../RealIcons';

import { AdminStudentsAlumniTab } from './admin/AdminStudentsAlumniTab';
import { AdminFacultyTab } from './admin/AdminFacultyTab';
import { AdminTutorAssignmentsTab } from './admin/AdminTutorAssignmentsTab';
import { AdminClassesFeesTab } from './admin/AdminClassesFeesTab';
import { AdminSubjectsGradingTab } from './admin/AdminSubjectsGradingTab';
import { AdminResultCollationTab } from './admin/AdminResultCollationTab';
import { AdminLessonNotesTab } from './admin/AdminLessonNotesTab';
import { AdminParentBroadcastTab } from './admin/AdminParentBroadcastTab';
import { AdminProprietressTab } from './admin/AdminProprietressTab';
import { AdminCredentialsVaultTab } from './admin/AdminCredentialsVaultTab';
import { AdminSchoolSettingsTab } from './admin/AdminSchoolSettingsTab';
import { AdminSchoolCalendarTab } from './admin/AdminSchoolCalendarTab';
import { AdminLandingPageTab } from './admin/AdminLandingPageTab';
import { AdminFaqSubTab } from './admin/AdminFaqSubTab';
import { AdminCalvinTokensTab } from './admin/AdminCalvinTokensTab';
import { AdminSchemeOfWorkTab } from './admin/AdminSchemeOfWorkTab';
import { AdminCampusGalleryTab } from './admin/AdminCampusGalleryTab';
import { AdminVisitorInquiriesSubTab } from './admin/AdminVisitorInquiriesSubTab';
import { AdminRolePrivilegesTab } from './admin/AdminRolePrivilegesTab';
import { SchoolChatSystem } from '../chat/SchoolChatSystem';
import { SchoolPrefectBadgesModal } from '../chat/ChatLeadershipModals';
import { NetlifyCloudSyncModal } from './admin/NetlifyCloudSyncModal';
import { isRemoteEnabled } from '../../lib/supabase';
import { Bot, Newspaper, Compass, Database } from 'lucide-react';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

type AdminTab = 
  | 'overview'
  | 'roles_privileges'
  | 'chat'
  | 'calvin_tokens'
  | 'scheme_of_work'
  | 'calendar'
  | 'gallery'
  | 'students'
  | 'faculty'
  | 'assignments'
  | 'classes'
  | 'subjects'
  | 'results'
  | 'notes'
  | 'broadcasts'
  | 'proprietress'
  | 'credentials'
  | 'settings'
  | 'landing'
  | 'faqs';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  const { 
    schoolInfo, 
    students, 
    tutors, 
    classes, 
    calvinTokens,
    galleryPhotos,
    logoutAdmin,
    attendanceRecords,
    termResumptionConfig,
    consultationRequests,
    visitorConversations
  } = useSchool();

  const pendingConsultationsCount = consultationRequests.filter(c => c.status === 'Pending').length;
  const availableTokensCount = calvinTokens.filter(t => t.status === 'unused').length;
  const unreadVisitorInquiriesCount = visitorConversations?.filter(c => c.unreadByAdmin).length || 0;

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminChatTab, setAdminChatTab] = useState<'rep_desk' | 'channels'>('rep_desk');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPrefectModal, setShowPrefectModal] = useState(false);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    onBackToWebsite();
  };

  const menuItems: Array<{ id: AdminTab; label: string; icon: React.ElementType; badge?: string | number }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layers },
    { id: 'roles_privileges', label: 'Role Privileges & Delegations', icon: ShieldCheck, badge: 'Roles & Access' },
    { 
      id: 'chat', 
      label: 'Community & Representative Chat', 
      icon: MessageSquare, 
      badge: unreadVisitorInquiriesCount > 0 ? `${unreadVisitorInquiriesCount} New` : 'Live' 
    },
    { id: 'calvin_tokens', label: 'Calvin AI Tokens', icon: Bot, badge: availableTokensCount > 0 ? `${availableTokensCount} Ready` : undefined },
    { id: 'scheme_of_work', label: 'Schemes of Work (Curriculum Matrix)', icon: Compass, badge: 'Curriculum' },
    { id: 'calendar', label: 'Term Calendar & Events', icon: Calendar },
    { id: 'gallery', label: 'Campus Gallery & Photos', icon: Camera, badge: `${galleryPhotos?.length || 0} Photos` },
    { id: 'students', label: 'Scholars & Alumni', icon: GraduationCap, badge: students.length },
    { id: 'faculty', label: 'Faculty Staff', icon: Users, badge: tutors.length },
    { id: 'assignments', label: 'Tutor & Principal Roles', icon: BookOpen },
    { id: 'classes', label: 'Classes & Fees', icon: SchoolIcon, badge: classes.length },
    { id: 'subjects', label: 'Subjects & Grading', icon: Award },
    { id: 'results', label: 'Terminal Collation', icon: CheckCircle2 },
    { id: 'notes', label: 'Lesson Notes', icon: FileText },
    { id: 'broadcasts', label: 'Parent Broadcasts & Relations', icon: Radio, badge: pendingConsultationsCount || undefined },
    { id: 'proprietress', label: 'Executive Council', icon: ShieldCheck },
    { id: 'credentials', label: 'Credentials Vault', icon: Key },
    { id: 'settings', label: 'School Settings & Resumption', icon: Settings },
    { id: 'landing', label: 'School Logo & Website CMS', icon: Layout, badge: 'Logo & Media' },
    { id: 'faqs', label: 'FAQ Manager', icon: HelpCircle }
  ];

  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col font-['Nunito',sans-serif] overflow-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:bg-stone-100 rounded-xl md:hidden"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <SchoolLogo size="sm" showText={false} />
            <div>
              <div className="text-sm font-black text-stone-900 leading-tight">
                {schoolInfo.name} Administration
              </div>
              <div className="text-[11px] font-bold text-amber-700">
                {termResumptionConfig?.termName || schoolInfo.activeTerm} • {termResumptionConfig?.session || schoolInfo.activeSession}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Device Cloud Sync Button */}
          <button
            type="button"
            onClick={() => setShowCloudSyncModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs border ${
              isRemoteEnabled()
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200 animate-pulse'
            }`}
            title={isRemoteEnabled() ? 'Cloud Database Synced across all devices' : 'Single-Browser Mode: Click to configure multi-device sync on Netlify'}
          >
            <Database className={`w-3.5 h-3.5 ${isRemoteEnabled() ? 'text-emerald-600' : 'text-amber-700'}`} />
            <span className="hidden sm:inline">
              {isRemoteEnabled() ? 'Cloud Synced' : 'Multi-Device Sync (Netlify)'}
            </span>
            <span className="sm:hidden">
              {isRemoteEnabled() ? 'Synced' : 'Sync'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrefectModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Appoint & confer official school prefect badges"
          >
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Prefect Badges</span>
          </button>
          <button
            type="button"
            onClick={onBackToWebsite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            Public Website
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 shrink-0 p-4 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 px-3 py-2">
            Operations & Portals
          </div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-stone-900/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 space-y-1 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Navigation Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                      isActive ? 'bg-red-600 text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Workspace Tab Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full min-h-0 pb-20">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-xs">
                    <SchoolIcon className="w-3.5 h-3.5" />
                    <span>Executive Central Registry</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome, Administrator
                  </h1>
                  <p className="text-white/90 text-sm mt-2 leading-relaxed">
                    Overview of school attendance, academic grading, lesson notes, and fee structures. Term resumption is active and teacher registers are synchronized.
                  </p>
                </div>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase text-stone-400">Total Enrolled Scholars</div>
                    <GraduationCap className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-black text-stone-900 mt-2">{students.length}</div>
                  <div className="text-xs text-stone-500 mt-1">Across all primary & secondary arms</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase text-stone-400">Faculty Tutors</div>
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-stone-900 mt-2">{tutors.length}</div>
                  <div className="text-xs text-stone-500 mt-1">Registered academic faculty</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase text-stone-400">School Classes</div>
                    <SchoolIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-stone-900 mt-2">{classes.length}</div>
                  <div className="text-xs text-stone-500 mt-1">Active grade categories</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase text-stone-400">Attendance Registers</div>
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-stone-900 mt-2">{attendanceRecords.length}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">Daily registers logged</div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider mb-4">
                  Quick Navigation Shortcuts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('landing')}
                    className="p-4 rounded-xl border-2 border-red-200 bg-red-50/40 hover:border-red-500 hover:bg-red-50 text-left transition-all group"
                  >
                    <Layout className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">School Logo & CMS</div>
                    <div className="text-[11px] text-red-600 font-semibold">Change logo & website</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBackToWebsite();
                      setTimeout(() => {
                        const el = document.getElementById('news-blog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-50 text-left transition-all group"
                  >
                    <Newspaper className="w-5 h-5 text-amber-700 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">News & Blog Gazette</div>
                    <div className="text-[11px] text-amber-700 font-semibold">Press desk & dispatches</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-xl border border-stone-200 hover:border-red-500 hover:bg-red-50/50 text-left transition-all group"
                  >
                    <Settings className="w-5 h-5 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">Term Resumption</div>
                    <div className="text-[11px] text-stone-500">Set resumption date</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('classes')}
                    className="p-4 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 text-left transition-all group"
                  >
                    <SchoolIcon className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">Class & Fees</div>
                    <div className="text-[11px] text-stone-500">Manage tuition rates</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="p-4 rounded-xl border border-stone-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group"
                  >
                    <GraduationCap className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">Student Profiles</div>
                    <div className="text-[11px] text-stone-500">Attendance & ranks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="p-4 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">Result Collation</div>
                    <div className="text-[11px] text-stone-500">Generate report cards</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('calendar')}
                    className="p-4 rounded-xl border border-stone-200 hover:border-purple-500 hover:bg-purple-50/50 text-left transition-all group"
                  >
                    <Calendar className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">School Calendar</div>
                    <div className="text-[11px] text-stone-500">Terms & milestones</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('calvin_tokens')}
                    className="p-4 rounded-xl border border-stone-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
                  >
                    <Bot className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-xs text-stone-900">Calvin AI Tokens</div>
                    <div className="text-[11px] text-stone-500">Mint study access</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6">
              {/* Sub-navigation tabs: Representative Desk vs Community Channels */}
              <div className="flex items-center gap-2 p-1.5 bg-neutral-200/60 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setAdminChatTab('rep_desk')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                    adminChatTab === 'rep_desk'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-white/50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Landing Page Desk & Representative Assignment</span>
                  {unreadVisitorInquiriesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                      {unreadVisitorInquiriesCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAdminChatTab('channels')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                    adminChatTab === 'channels'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-white/50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Internal School Community Channels</span>
                </button>
              </div>

              {adminChatTab === 'rep_desk' ? (
                <AdminVisitorInquiriesSubTab />
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-red-950 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-300 text-[10px] font-black uppercase tracking-wider border border-red-500/40">
                        Omnipotent Administrative Control
                      </span>
                      <h2 className="text-xl font-black">Stanbax School Community Chat System</h2>
                      <p className="text-xs text-neutral-300 max-w-xl">
                        Full supervisory control across student class forums, extracurricular club hubs, and direct guardian-faculty consultations. Lock channels, flag messages, or manage discussion rooms.
                      </p>
                    </div>
                  </div>

                  <SchoolChatSystem
                    currentUserRole="admin"
                    currentUserId="admin-1"
                    currentUserName="Principal Administrator"
                    currentUserSubtext="School Administration & Registry"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'roles_privileges' && <AdminRolePrivilegesTab />}
          {activeTab === 'calvin_tokens' && <AdminCalvinTokensTab />}
          {activeTab === 'scheme_of_work' && <AdminSchemeOfWorkTab />}
          {activeTab === 'calendar' && <AdminSchoolCalendarTab />}
          {activeTab === 'gallery' && <AdminCampusGalleryTab />}
          {activeTab === 'students' && <AdminStudentsAlumniTab />}
          {activeTab === 'faculty' && <AdminFacultyTab />}
          {activeTab === 'assignments' && <AdminTutorAssignmentsTab />}
          {activeTab === 'classes' && <AdminClassesFeesTab />}
          {activeTab === 'subjects' && <AdminSubjectsGradingTab />}
          {activeTab === 'results' && <AdminResultCollationTab />}
          {activeTab === 'notes' && <AdminLessonNotesTab />}
          {activeTab === 'broadcasts' && <AdminParentBroadcastTab />}
          {activeTab === 'proprietress' && <AdminProprietressTab />}
          {activeTab === 'credentials' && <AdminCredentialsVaultTab />}
          {activeTab === 'settings' && <AdminSchoolSettingsTab />}
          {activeTab === 'landing' && <AdminLandingPageTab />}
          {activeTab === 'faqs' && <AdminFaqSubTab />}
        </main>
      </div>

      {/* School Prefect Badges Modal */}
      {showPrefectModal && (
        <SchoolPrefectBadgesModal
          onClose={() => setShowPrefectModal(false)}
        />
      )}

      {/* Netlify & Multi-Device Cloud Sync Assistant Modal */}
      <NetlifyCloudSyncModal
        isOpen={showCloudSyncModal}
        onClose={() => setShowCloudSyncModal(false)}
      />
    </div>
  );
};
