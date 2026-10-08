import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolLogo } from '../SchoolLogo';
import { 
  MessageSquare, 
  Radio, 
  Camera, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Menu, 
  X,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Info
} from '../RealIcons';
import { SchoolChatSystem } from '../chat/SchoolChatSystem';
import { AdminVisitorInquiriesSubTab } from './admin/AdminVisitorInquiriesSubTab';
import { AdminParentBroadcastTab } from './admin/AdminParentBroadcastTab';
import { AdminCampusGalleryTab } from './admin/AdminCampusGalleryTab';
import { AdminSchoolCalendarTab } from './admin/AdminSchoolCalendarTab';

interface ModeratorPortalProps {
  onBackToWebsite: () => void;
}

type ModeratorTab = 'chat' | 'visitor_desk' | 'broadcasts' | 'gallery' | 'calendar';

export const ModeratorPortal: React.FC<ModeratorPortalProps> = ({ onBackToWebsite }) => {
  const {
    moderators,
    activeModeratorId,
    logoutModerator,
    hasPrivilege,
    visitorConversations,
    chatMessages,
    galleryPhotos
  } = useSchool();

  const currentMod = moderators.find(m => m.id === activeModeratorId) || moderators[0] || {
    id: 'mod-1',
    name: 'Mr. Kehinde Badmus',
    email: 'moderator@stanbaxschools.edu.ng',
    roleTitle: 'Chief Community & Communications Moderator'
  };

  const [activeTab, setActiveTab] = useState<ModeratorTab>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadVisitorCount = visitorConversations?.filter(c => c.unreadByAdmin).length || 0;
  const flaggedCount = chatMessages?.filter(m => (m as any).isFlagged).length || 0;

  const handleLogout = () => {
    logoutModerator();
    onBackToWebsite();
  };

  const navItems: Array<{
    id: ModeratorTab;
    label: string;
    icon: React.ElementType;
    privilegeKey?: Parameters<typeof hasPrivilege>[1];
    badge?: string | number;
    badgeColor?: string;
  }> = [
    { 
      id: 'chat', 
      label: 'Community Chat & Safety', 
      icon: MessageSquare, 
      privilegeKey: 'community_chat_moderation',
      badge: flaggedCount > 0 ? `${flaggedCount} Flagged` : 'Active',
      badgeColor: flaggedCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      id: 'visitor_desk', 
      label: 'Visitor Desk & Inquiries', 
      icon: Users, 
      privilegeKey: 'visitor_inquiries',
      badge: unreadVisitorCount > 0 ? `${unreadVisitorCount} New` : undefined,
      badgeColor: 'bg-amber-400 text-neutral-950'
    },
    { 
      id: 'broadcasts', 
      label: 'Parent Broadcasts & Notices', 
      icon: Radio, 
      privilegeKey: 'broadcasts_notices' 
    },
    { 
      id: 'gallery', 
      label: 'Campus Media Gallery', 
      icon: Camera, 
      privilegeKey: 'campus_gallery',
      badge: `${galleryPhotos?.length || 0}`
    },
    {
      id: 'calendar',
      label: 'Term Calendar & Events',
      icon: Calendar,
      privilegeKey: 'school_calendar'
    }
  ];

  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col font-['Nunito',sans-serif] overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-gradient-to-r from-[#111827] via-neutral-900 to-[#1e1b4b] text-white px-4 sm:px-6 flex items-center justify-between border-b border-indigo-900/40 shrink-0">
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
                Community Moderator Console
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
                Safety & Communications
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80 hidden sm:block">
              {currentMod.name} • {currentMod.roleTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 bg-white border-r border-stone-200 flex flex-col shrink-0 transition-all z-20 ${
          mobileMenuOpen ? 'fixed inset-y-16 left-0 shadow-2xl' : 'hidden md:flex'
        }`}>
          <div className="p-4 border-b border-stone-100 bg-stone-50/70">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Moderator Identity
            </div>
            <div className="font-black text-sm text-stone-900 truncate">
              {currentMod.name}
            </div>
            <div className="text-[11px] text-stone-500 truncate">
              {currentMod.email}
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const isAllowed = !item.privilegeKey || hasPrivilege('moderator', item.privilegeKey);
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
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : isAllowed ? 'text-blue-900' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isAllowed && (
                      <Lock className="w-3 h-3 text-stone-400" />
                    )}
                    {item.badge && isAllowed && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor || 'bg-stone-200 text-stone-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FDFBF7]">
          {activeTab === 'chat' && (
            hasPrivilege('moderator', 'community_chat_moderation') ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-950 text-white p-6 rounded-3xl shadow-sm border border-neutral-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
                      Community Safety Supervisor
                    </span>
                  </div>
                  <h2 className="text-xl font-black">Stanbax Live Community Chat Channels</h2>
                  <p className="text-xs text-neutral-300 max-w-xl">
                    Inspect scholar class forums, club groups, and parent conversations. Enforce institutional code of conduct by deleting inappropriate messages, pinning notices, or flagging misconduct.
                  </p>
                </div>

                <SchoolChatSystem
                  currentUserRole="moderator"
                  currentUserId={currentMod.id}
                  currentUserName={currentMod.name}
                  currentUserSubtext={currentMod.roleTitle}
                />
              </div>
            ) : (
              <ModeratorRestrictedBanner privilege="community_chat_moderation" title="Community Live Chat & Channels" />
            )
          )}

          {activeTab === 'visitor_desk' && (
            hasPrivilege('moderator', 'visitor_inquiries') ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-blue-900">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                      Public Representative Desk
                    </span>
                  </div>
                  <h2 className="text-xl font-black">Prospective Parent & Visitor Inquiries</h2>
                  <p className="text-xs text-neutral-300 max-w-xl">
                    Receive live inquiries submitted from the school website. Reply directly to questions about admissions, fees, and campus life.
                  </p>
                </div>

                <AdminVisitorInquiriesSubTab />
              </div>
            ) : (
              <ModeratorRestrictedBanner privilege="visitor_inquiries" title="Visitor Desk & Inquiries" />
            )
          )}

          {activeTab === 'broadcasts' && (
            hasPrivilege('moderator', 'broadcasts_notices') ? (
              <AdminParentBroadcastTab />
            ) : (
              <ModeratorRestrictedBanner privilege="broadcasts_notices" title="Parent Broadcasts & School Notices" />
            )
          )}

          {activeTab === 'gallery' && (
            hasPrivilege('moderator', 'campus_gallery') ? (
              <AdminCampusGalleryTab />
            ) : (
              <ModeratorRestrictedBanner privilege="campus_gallery" title="Campus Media Gallery" />
            )
          )}

          {activeTab === 'calendar' && (
            hasPrivilege('moderator', 'school_calendar') ? (
              <AdminSchoolCalendarTab />
            ) : (
              <ModeratorRestrictedBanner privilege="school_calendar" title="Academic Calendar & Events" />
            )
          )}
        </main>
      </div>
    </div>
  );
};

const ModeratorRestrictedBanner: React.FC<{ privilege: string; title: string }> = ({ privilege, title }) => (
  <div className="p-8 rounded-3xl bg-blue-50 border-2 border-blue-200 text-blue-950 max-w-2xl mx-auto my-12 text-center space-y-3 shadow-md">
    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto font-black">
      <Lock className="w-7 h-7 text-blue-900" />
    </div>
    <h3 className="text-lg font-black text-blue-950">Moderator Access Restricted</h3>
    <p className="text-xs text-blue-800 leading-relaxed max-w-md mx-auto">
      The <strong>{title}</strong> module requires permission <code>{privilege}</code>. The School Administrator can grant or revoke this in the Admin Role Privileges Console.
    </p>
  </div>
);
