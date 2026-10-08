import React, { useState, useMemo, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  MessageSquare, 
  Search, 
  X, 
  ChevronRight, 
  GraduationCap, 
  Users, 
  Lock, 
  Send,
  Sparkles,
  ExternalLink,
  Crown
} from '../RealIcons';
import { SchoolLogo } from '../SchoolLogo';
import { SchoolChatSystem } from './SchoolChatSystem';
import { SchoolRepresentativeChat } from './SchoolRepresentativeChat';

export const FloatingChatWidget: React.FC = () => {
  const {
    activeSection,
    chatChannels,
    chatMessages,
    students,
    tutors,
    classes,
    isStudentAuthenticated,
    student,
    isTutorAuthenticated,
    tutor,
    isParentAuthenticated,
    parents,
    activeParentId,
    isAdminAuthenticated,
    getChannelUnreadCount,
    getTotalUnreadCount,
    markChannelAsRead,
    schoolRepConfig,
    typingMap,
    visitorConversations
  } = useSchool();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'class' | 'club' | 'direct' | 'announcement'>('all');
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);

  // Compute unread visitor replies count for visitors on public pages
  const visitorUnreadCount = useMemo(() => {
    try {
      const saved = localStorage.getItem('stanbax_visitor_identity');
      if (saved) {
        const idObj = JSON.parse(saved);
        if (idObj?.visitorId) {
          const conv = visitorConversations.find(c => c.visitorId === idObj.visitorId);
          if (conv) {
            const lastSeen = conv.lastSeenByVisitorAt ? new Date(conv.lastSeenByVisitorAt).getTime() : 0;
            return conv.messages.filter(m => (m.sender === 'representative' || m.sender === 'calvin_ai') && new Date(m.timestamp).getTime() > lastSeen).length;
          }
        }
      }
    } catch {}
    return 0;
  }, [visitorConversations]);

  // Auto-open chat if magic link or notification ref is present in URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('chat_ref') || params.get('open_chat')) {
        setIsOpen(true);
      }
    } catch {}
  }, []);

  // Demo fallback role switcher for public website evaluation
  const [demoRole, setDemoRole] = useState<'student' | 'tutor' | 'parent' | 'admin'>('student');

  // Determine current active user identity
  const currentIdentity = useMemo(() => {
    if (isStudentAuthenticated && student) {
      return {
        role: 'student' as const,
        id: student.id,
        name: student.name,
        subtext: `${student.grade} Scholar`,
        badge: student.prefectBadge || (student.prefectRole ? `🏅 ${student.prefectRole}` : undefined),
        classId: student.classId,
        clubs: student.clubs || []
      };
    }
    if (isTutorAuthenticated && tutor) {
      return {
        role: 'tutor' as const,
        id: tutor.id,
        name: tutor.name,
        subtext: `${tutor.role || 'Faculty Educator'} • ${tutor.department || 'Academic Staff'}`,
        badge: '👨‍🏫 Tutor',
        classId: tutor.assignedClasses?.[0],
        clubs: []
      };
    }
    if (isParentAuthenticated) {
      const activeParent = parents.find(p => p.id === activeParentId) || parents[0] || {
        id: 'parent-1',
        fullName: 'Chief & Mrs. Adebayo Adeleke',
        phone: '+234 803 445 6789',
        email: 'adeleke.family@gmail.com',
        childrenIds: ['stu-1']
      };
      return {
        role: 'parent' as const,
        id: activeParent.id,
        name: activeParent.fullName,
        subtext: 'Guardian / Parent',
        badge: 'Parent',
        classId: undefined,
        clubs: []
      };
    }
    if (isAdminAuthenticated) {
      return {
        role: 'admin' as const,
        id: 'admin-1',
        name: 'School Administrator',
        subtext: 'Principal Safeguarding Active',
        badge: '👑 Admin',
        classId: undefined,
        clubs: []
      };
    }

    // Default demo persona for visitors on public website
    if (demoRole === 'tutor') {
      const demoTutor = tutors[0] || { id: 'tut-1', name: 'Mr. Babatunde Adekunle', role: 'Senior Physics Tutor' };
      return {
        role: 'tutor' as const,
        id: demoTutor.id,
        name: demoTutor.name,
        subtext: `${demoTutor.role || 'Faculty Tutor'} (Demo Mode)`,
        badge: '👨‍🏫 Tutor',
        classId: undefined,
        clubs: []
      };
    }
    if (demoRole === 'admin') {
      return {
        role: 'admin' as const,
        id: 'admin-1',
        name: 'School Administrator',
        subtext: 'Principal Oversight (Demo Mode)',
        badge: '👑 Admin',
        classId: undefined,
        clubs: []
      };
    }
    if (demoRole === 'parent') {
      return {
        role: 'parent' as const,
        id: 'parent-demo',
        name: 'Mrs. Folashade Adeleke',
        subtext: 'Parent of Tiwa (Demo Mode)',
        badge: 'Parent',
        classId: undefined,
        clubs: []
      };
    }

    // Demo student Tiwa Savage
    const demoStudent = students.find(s => s.id === 'demo-student') || students[0] || {
      id: 'demo-student',
      name: 'Tiwa Savage',
      grade: 'SSS 2',
      classId: 'cls-sss2',
      clubs: ['JETS Science Club', 'Debate & Literary Society'],
      prefectBadge: '🏅 Head Girl'
    };

    return {
      role: 'student' as const,
      id: demoStudent.id,
      name: demoStudent.name,
      subtext: `${demoStudent.grade || 'SSS 2'} Scholar (Demo Mode)`,
      badge: demoStudent.prefectBadge,
      classId: demoStudent.classId,
      clubs: demoStudent.clubs || []
    };
  }, [
    isStudentAuthenticated, 
    student, 
    isTutorAuthenticated, 
    tutor, 
    isParentAuthenticated, 
    parents,
    activeParentId,
    isAdminAuthenticated, 
    demoRole, 
    students, 
    tutors
  ]);

  // Authorized channels for the current user
  const authorizedChannels = useMemo(() => {
    return chatChannels.filter(chan => {
      if (currentIdentity.role === 'admin') return true;
      if (chan.type === 'announcement') return true;
      if (chan.type === 'direct') {
        return chan.directParticipantIds?.includes(currentIdentity.id) ||
               chan.directParticipantNames?.some(n => n.toLowerCase().includes(currentIdentity.name.toLowerCase()));
      }
      if (currentIdentity.role === 'tutor') return true;
      if (currentIdentity.role === 'parent') {
        return chan.name.toLowerCase().includes('parent');
      }
      if (currentIdentity.role === 'student') {
        if (chan.type === 'class') {
          if (currentIdentity.classId && chan.classId === currentIdentity.classId) return true;
          if (currentIdentity.subtext.includes('SSS 2') && chan.name.toLowerCase().includes('sss 2')) return true;
          return false;
        }
        if (chan.type === 'club') {
          return currentIdentity.clubs.some(cName => chan.name.toLowerCase().includes(cName.toLowerCase()));
        }
      }
      return false;
    });
  }, [chatChannels, currentIdentity]);

  // Compute total unread count
  const totalUnreadCount = useMemo(() => {
    const channelIds = authorizedChannels.map(c => c.id);
    return getTotalUnreadCount(currentIdentity.id, channelIds);
  }, [authorizedChannels, currentIdentity.id, getTotalUnreadCount, chatMessages]);

  // Filter channels for the All Chats drawer list
  const displayedChannels = useMemo(() => {
    return authorizedChannels.filter(c => {
      const matchesTab = activeTab === 'all' || c.type === activeTab;
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [authorizedChannels, activeTab, searchTerm]);

  // Position: if WhatsApp is visible (on public homepage or proprietress page), stack above it at bottom-22; otherwise bottom-6
  const isPortalView = activeSection.includes('portal');
  const isLandingPageOrGuest = !isPortalView || (!isStudentAuthenticated && !isTutorAuthenticated && !isParentAuthenticated && !isAdminAuthenticated);
  const bottomPositionClass = isPortalView ? 'bottom-6 right-6' : 'bottom-22 right-6';
  const isAnyRepTyping = Object.values(typingMap).some(t => t.isRepTyping);

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING 💬 BUTTON AT LOWER RIGHT CORNER                                  */}
      {/* ========================================================================= */}
      <div className={`fixed ${bottomPositionClass} z-40 flex items-center`}>
        {/* Real-time Representative Typing Callout Pill when chat is collapsed */}
        {isLandingPageOrGuest && !isOpen && isAnyRepTyping && (
          <div 
            onClick={() => setIsOpen(true)}
            className="absolute -top-11 right-0 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-xl border border-blue-300 text-neutral-900 text-xs flex items-center gap-2 animate-bounce cursor-pointer whitespace-nowrap z-50"
            title="Representative is typing - click to open"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
            <span className="font-extrabold text-[11px] text-blue-950">
              {schoolRepConfig.repName} is typing a response...
            </span>
            <span className="inline-flex gap-0.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearchTerm('');
            }
          }}
          className={`relative w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer group ${
            isLandingPageOrGuest
              ? 'bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-800 ring-4 ring-amber-400/30 border border-amber-300/40'
              : 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 ring-4 ring-indigo-500/25'
          }`}
          title={
            isLandingPageOrGuest 
              ? `Chat with ${schoolRepConfig.repName} (${schoolRepConfig.repTitle})` 
              : "School Community Chat Hub • View All Chats"
          }
          aria-label="Open Live Chat"
        >
          {/* Small 💬 symbol as requested */}
          <span className="text-2xl select-none leading-none group-hover:scale-110 transition-transform">
            💬
          </span>

          {/* Active Status Pulse Dot for Representative on Landing Page */}
          {isLandingPageOrGuest && (
            <span 
              className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                schoolRepConfig.isAvailable ? 'bg-emerald-500' : 'bg-purple-500'
              }`}
              title={schoolRepConfig.isAvailable ? 'Representative Online' : 'Calvin AI Virtual Rep Active'}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-white ${schoolRepConfig.isAvailable ? 'animate-ping' : ''}`} />
            </span>
          )}

          {/* Visitor unread replies badge on landing page / guest view */}
          {isLandingPageOrGuest && visitorUnreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
              {visitorUnreadCount > 9 ? '9+' : visitorUnreadCount}
            </span>
          )}

          {/* Unread message counter badge */}
          {!isLandingPageOrGuest && totalUnreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
              {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. LANDING PAGE & VISITOR CHAT: PERSONALIZED SCHOOL REPRESENTATIVE CHAT   */}
      {/* ========================================================================= */}
      {isOpen && isLandingPageOrGuest && (
        <div 
          className="fixed bottom-20 right-3 sm:bottom-24 sm:right-6 w-[94vw] max-w-[420px] h-[580px] max-h-[85vh] z-50 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <SchoolRepresentativeChat onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUTHENTICATED INTERNAL PORTAL CHAT DRAWER                              */}
      {/* ========================================================================= */}
      {isOpen && !isLandingPageOrGuest && !activeChannelId && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 w-[94vw] max-w-[400px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-neutral-200 z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-4 shrink-0 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💬</span>
                <div>
                  <h4 className="font-black text-sm text-white leading-tight">All School Chats</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{currentIdentity.name}</span>
                    <span>•</span>
                    <span className="text-amber-300 uppercase font-bold text-[10px]">{currentIdentity.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {totalUnreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                    {totalUnreadCount} unread
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Close Chats"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Demo Persona Switcher (when browsing publicly) */}
            {!isStudentAuthenticated && !isTutorAuthenticated && !isParentAuthenticated && !isAdminAuthenticated && (
              <div className="bg-white/10 rounded-xl p-1.5 flex items-center justify-between text-[10px] gap-1">
                <span className="text-neutral-300 font-bold px-1">Switch View:</span>
                <div className="flex items-center gap-1">
                  {(['student', 'tutor', 'parent', 'admin'] as const).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setDemoRole(role)}
                      className={`px-2 py-0.5 rounded-lg font-black uppercase text-[9px] transition cursor-pointer ${
                        demoRole === role ? 'bg-amber-400 text-neutral-950' : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar & Category Filter Tabs */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50/60 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search discussions, peers, teachers..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px] font-bold">
              {(['all', 'class', 'club', 'direct', 'announcement'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                    activeTab === tab ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-200/80 border border-neutral-200'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === 'class' ? 'Class' : tab === 'club' ? 'Clubs' : tab === 'direct' ? 'DMs' : 'Bulletins'}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {displayedChannels.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-neutral-300" />
                <p className="font-semibold text-neutral-600">No conversations found</p>
                <p className="text-[11px] text-neutral-400">Try changing your search or filter tab.</p>
              </div>
            ) : (
              displayedChannels.map(chan => {
                const isDirect = chan.type === 'direct';
                let displayName = chan.name;
                let displayDesc = chan.description || `${chan.type.toUpperCase()} discussion`;

                if (isDirect) {
                  const otherName = chan.directParticipantNames?.find(
                    n => !n.includes(currentIdentity.name) && n !== 'admin-1' && !n.toLowerCase().includes('admin')
                  );
                  if (otherName) displayName = otherName;
                  displayDesc = 'Direct Consultation';
                }

                // Get last message preview
                const channelMsgs = chatMessages.filter(m => m.channelId === chan.id);
                const lastMsg = channelMsgs[channelMsgs.length - 1];

                let lastMsgSnippet = displayDesc;
                let lastMsgTime: string | null = null;

                if (lastMsg) {
                  if (lastMsg.audioVoiceNote) {
                    lastMsgSnippet = `🎤 Voice Note (${lastMsg.audioVoiceNote.durationSeconds}s)`;
                  } else if (lastMsg.imageAttachment) {
                    lastMsgSnippet = '📷 Photo Attachment';
                  } else if (lastMsg.attachments && lastMsg.attachments.length > 0) {
                    lastMsgSnippet = `📎 ${lastMsg.attachments[0].name}`;
                  } else if (lastMsg.content) {
                    const sender = lastMsg.senderId === currentIdentity.id ? 'You' : lastMsg.senderName.split(' ')[0];
                    lastMsgSnippet = `${sender}: ${lastMsg.content}`;
                  }

                  try {
                    lastMsgTime = new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  } catch {
                    lastMsgTime = null;
                  }
                }

                const unreadCount = getChannelUnreadCount(chan.id, currentIdentity.id);

                return (
                  <div
                    key={chan.id}
                    onClick={() => {
                      markChannelAsRead(chan.id, currentIdentity.id);
                      setActiveChannelId(chan.id);
                    }}
                    className="p-3 rounded-2xl border border-neutral-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 bg-white transition flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs text-xs font-black ${
                        chan.type === 'announcement' ? 'bg-amber-100 text-amber-900' :
                        chan.type === 'class' ? 'bg-blue-100 text-blue-900' :
                        chan.type === 'club' ? 'bg-emerald-100 text-emerald-900' :
                        'bg-indigo-100 text-indigo-900'
                      }`}>
                        {chan.type === 'announcement' ? <SchoolLogo size="xs" showText={false} /> :
                         chan.type === 'class' ? <GraduationCap className="w-4 h-4" /> :
                         chan.type === 'club' ? <Users className="w-4 h-4" /> :
                         displayName.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-neutral-900 truncate group-hover:text-indigo-950 transition">
                            {displayName}
                          </span>
                          {chan.isReadOnly && <Lock className="w-2.5 h-2.5 text-neutral-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {lastMsgSnippet}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex flex-col items-end gap-1">
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-2xs animate-pulse">
                            {unreadCount} new
                          </span>
                        )}
                        {lastMsgTime && (
                          <span className="text-[10px] font-bold text-neutral-400">
                            {lastMsgTime}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-indigo-600 transition" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-neutral-50 border-t border-neutral-100 text-center text-[10px] text-neutral-400 font-semibold shrink-0">
            Click any chat to open full interactive pop-up overlay 💬
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-UP CHAT OVERLAY WHEN A CHANNEL IS CLICKED                             */}
      {/* ========================================================================= */}
      {activeChannelId && (
        <SchoolChatSystem
          currentUserRole={currentIdentity.role}
          currentUserId={currentIdentity.id}
          currentUserName={currentIdentity.name}
          currentUserSubtext={currentIdentity.subtext}
          initialPopupChannelId={activeChannelId}
          onClosePopup={() => setActiveChannelId(null)}
          hideStories={true}
        />
      )}
    </>
  );
};
