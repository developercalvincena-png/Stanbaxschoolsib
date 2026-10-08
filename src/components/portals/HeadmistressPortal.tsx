import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolLogo } from '../SchoolLogo';
import { 
  Award, 
  BookOpen, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Radio, 
  Camera, 
  FileText, 
  LogOut, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  MessageSquare, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Menu,
  X
} from '../RealIcons';
import { AdminSchemeOfWorkTab } from './admin/AdminSchemeOfWorkTab';
import { AdminResultCollationTab } from './admin/AdminResultCollationTab';
import { AdminStudentsAlumniTab } from './admin/AdminStudentsAlumniTab';
import { AdminFacultyTab } from './admin/AdminFacultyTab';
import { AdminSchoolCalendarTab } from './admin/AdminSchoolCalendarTab';
import { AdminParentBroadcastTab } from './admin/AdminParentBroadcastTab';
import { AdminCampusGalleryTab } from './admin/AdminCampusGalleryTab';
import { SchoolChatSystem } from '../chat/SchoolChatSystem';
import { SchoolPrefectBadgesModal } from '../chat/ChatLeadershipModals';
import { AdminVisitorInquiriesSubTab } from './admin/AdminVisitorInquiriesSubTab';

interface HeadmistressPortalProps {
  onBackToWebsite: () => void;
}

type HeadmistressTab = 
  | 'overview' 
  | 'curriculum' 
  | 'results' 
  | 'students' 
  | 'faculty' 
  | 'calendar' 
  | 'broadcasts' 
  | 'chat' 
  | 'gallery';

export const HeadmistressPortal: React.FC<HeadmistressPortalProps> = ({ onBackToWebsite }) => {
  const {
    headmistressProfile,
    logoutHeadmistress,
    hasPrivilege,
    students,
    tutors,
    classes,
    assessmentConfig,
    termResumptionConfig
  } = useSchool();

  const [activeTab, setActiveTab] = useState<HeadmistressTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPrefectModal, setShowPrefectModal] = useState(false);

  const handleLogout = () => {
    logoutHeadmistress();
    onBackToWebsite();
  };

  const navItems: Array<{
    id: HeadmistressTab;
    label: string;
    icon: React.ElementType;
    privilegeKey?: Parameters<typeof hasPrivilege>[1];
    badge?: string | number;
  }> = [
    { id: 'overview', label: 'Academic Overview', icon: Award },
    { id: 'curriculum', label: 'Curriculum & Schemes', icon: Compass, privilegeKey: 'academic_curriculum', badge: 'Schemes' },
    { id: 'results', label: 'Terminal Results Collation', icon: CheckCircle2, privilegeKey: 'terminal_results' },
    { id: 'students', label: 'Scholars & Admissions', icon: GraduationCap, privilegeKey: 'manage_students', badge: students.length },
    { id: 'faculty', label: 'Faculty Staff Oversight', icon: Users, privilegeKey: 'manage_faculty', badge: tutors.length },
    { id: 'calendar', label: 'Term Calendar & Events', icon: Calendar, privilegeKey: 'school_calendar' },
    { id: 'broadcasts', label: 'Notices & Broadcasts', icon: Radio, privilegeKey: 'broadcasts_notices' },
    { id: 'chat', label: 'Community & Moderation', icon: MessageSquare, privilegeKey: 'community_chat_moderation' },
    { id: 'gallery', label: 'Campus Media Gallery', icon: Camera, privilegeKey: 'campus_gallery' }
  ];

  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col font-['Nunito',sans-serif] overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-950 text-white px-4 sm:px-6 flex items-center justify-between border-b border-amber-950/40 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <SchoolLogo size="sm" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-white">
                Head Mistress / Academic Principal
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider">
                Executive Desk
              </span>
            </div>
            <p className="text-[11px] text-amber-200/90 hidden sm:block">
              {headmistressProfile.name} • {headmistressProfile.qualification}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {hasPrivilege('headmistress', 'prefect_badges') && (
            <button
              type="button"
              onClick={() => setShowPrefectModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-amber-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-950" />
              <span>Prefect Badges</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBackToWebsite}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className={`w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 transition-all z-20 ${
          mobileMenuOpen ? 'fixed inset-y-16 left-0 shadow-2xl' : 'hidden md:flex'
        }`}>
          <div className="p-4 border-b border-stone-100 bg-stone-50/70">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Academic Governance
            </div>
            <div className="font-black text-sm text-stone-900 truncate">
              {headmistressProfile.name}
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const isAllowed = !item.privilegeKey || hasPrivilege('headmistress', item.privilegeKey);
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : isAllowed
                      ? 'text-stone-700 hover:bg-stone-100'
                      : 'text-stone-400 hover:bg-stone-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : isAllowed ? 'text-stone-600' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isAllowed && (
                      <Lock className="w-3 h-3 text-stone-400" />
                    )}
                    {item.badge && isAllowed && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-amber-400 text-neutral-950' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FDFBF7]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-neutral-800">
                <div className="max-w-2xl space-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                    Academic Leadership & Institutional Integrity
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome to the Head Mistress Desk
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                    "{headmistressProfile.welcomeMessage}"
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
                  <div className="bg-white/10 p-3.5 rounded-2xl">
                    <span className="text-[11px] text-neutral-300 block">Enrolled Scholars</span>
                    <span className="text-xl font-black text-amber-300">{students.length}</span>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl">
                    <span className="text-[11px] text-neutral-300 block">Faculty Educators</span>
                    <span className="text-xl font-black text-amber-300">{tutors.length}</span>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl">
                    <span className="text-[11px] text-neutral-300 block">Active Classes</span>
                    <span className="text-xl font-black text-amber-300">{classes.length}</span>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl">
                    <span className="text-[11px] text-neutral-300 block">Current Session</span>
                    <span className="text-xl font-black text-amber-300">{assessmentConfig.activeSession}</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('curriculum')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 transition cursor-pointer shadow-xs space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                    <Compass className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-black text-sm text-stone-900">Curriculum & Schemes of Work</h3>
                  <p className="text-xs text-stone-500">
                    Audit terminal lesson schemes, weekly topic coverage, and national educational standards across all grades.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('results')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 transition cursor-pointer shadow-xs space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-black text-sm text-stone-900">Terminal Results & Report Cards</h3>
                  <p className="text-xs text-stone-500">
                    Collate CA scores and exam results, compute terminal averages, and approve official terminal broadsheets.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('students')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 transition cursor-pointer shadow-xs space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
                    <GraduationCap className="w-5 h-5 text-blue-700" />
                  </div>
                  <h3 className="font-black text-sm text-stone-900">Scholars & Admissions</h3>
                  <p className="text-xs text-stone-500">
                    Inspect student enrollment registers, monitor attendance, and review academic performance tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Permission check gate for each sub-tab */}
          {activeTab === 'curriculum' && (
            hasPrivilege('headmistress', 'academic_curriculum') ? (
              <AdminSchemeOfWorkTab />
            ) : (
              <AccessRestrictedBanner privilege="academic_curriculum" title="Curriculum & Schemes of Work" />
            )
          )}

          {activeTab === 'results' && (
            hasPrivilege('headmistress', 'terminal_results') ? (
              <AdminResultCollationTab />
            ) : (
              <AccessRestrictedBanner privilege="terminal_results" title="Terminal Results Collation" />
            )
          )}

          {activeTab === 'students' && (
            hasPrivilege('headmistress', 'manage_students') ? (
              <AdminStudentsAlumniTab />
            ) : (
              <AccessRestrictedBanner privilege="manage_students" title="Scholars & Admissions Management" />
            )
          )}

          {activeTab === 'faculty' && (
            hasPrivilege('headmistress', 'manage_faculty') ? (
              <AdminFacultyTab />
            ) : (
              <AccessRestrictedBanner privilege="manage_faculty" title="Faculty Staff Oversight" />
            )
          )}

          {activeTab === 'calendar' && (
            hasPrivilege('headmistress', 'school_calendar') ? (
              <AdminSchoolCalendarTab />
            ) : (
              <AccessRestrictedBanner privilege="school_calendar" title="Academic Calendar & Term Resumption" />
            )
          )}

          {activeTab === 'broadcasts' && (
            hasPrivilege('headmistress', 'broadcasts_notices') ? (
              <AdminParentBroadcastTab />
            ) : (
              <AccessRestrictedBanner privilege="broadcasts_notices" title="Official Notices & Parent Broadcasts" />
            )
          )}

          {activeTab === 'chat' && (
            hasPrivilege('headmistress', 'community_chat_moderation') ? (
              <SchoolChatSystem
                currentUserRole="headmistress"
                currentUserId="hm-1"
                currentUserName={headmistressProfile.name}
                currentUserSubtext="Head Mistress / Academic Principal"
              />
            ) : (
              <AccessRestrictedBanner privilege="community_chat_moderation" title="Community Live Chat & Channels" />
            )
          )}

          {activeTab === 'gallery' && (
            hasPrivilege('headmistress', 'campus_gallery') ? (
              <AdminCampusGalleryTab />
            ) : (
              <AccessRestrictedBanner privilege="campus_gallery" title="Campus Media Gallery" />
            )
          )}
        </main>
      </div>

      {/* Prefect modal */}
      {showPrefectModal && (
        <SchoolPrefectBadgesModal onClose={() => setShowPrefectModal(false)} />
      )}
    </div>
  );
};

const AccessRestrictedBanner: React.FC<{ privilege: string; title: string }> = ({ privilege, title }) => (
  <div className="p-8 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-900 max-w-2xl mx-auto my-12 text-center space-y-3 shadow-md">
    <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center mx-auto font-black">
      <Lock className="w-7 h-7 text-amber-800" />
    </div>
    <h3 className="text-lg font-black text-amber-950">Module Access Restricted</h3>
    <p className="text-xs text-amber-800 leading-relaxed max-w-md mx-auto">
      The <strong>{title}</strong> module requires administrative delegation. Central Administration currently has the <code>{privilege}</code> privilege set to locked.
    </p>
    <div className="pt-2">
      <span className="text-[11px] text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 font-bold">
        Contact the School Administrator to grant this privilege in Central Administration.
      </span>
    </div>
  </div>
);
