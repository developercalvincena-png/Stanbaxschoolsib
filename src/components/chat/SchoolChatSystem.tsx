import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ChatChannel, SchoolChatMessage, ChatChannelType, StudentProfile } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Lock, 
  Plus, 
  Trash2, 
  Flag, 
  ShieldCheck, 
  Eye, 
  GraduationCap, 
  Search, 
  X, 
  Crown,
  CheckCircle2,
  Award,
  Star,
  Settings,
  Clock,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Mic,
  Play,
  Pause,
  Camera,
  Maximize2,
  ArrowLeft,
  ExternalLink,
  Globe,
  Pin,
  Paperclip,
  Smile,
  FileText,
  ChevronUp,
  ChevronDown,
  Check
} from '../RealIcons';

import { SchoolLogo } from '../SchoolLogo';
import { EphemeralStatusManager } from './EphemeralStatusManager';
import { 
  ClassLeadershipModal, 
  ClubLeadershipModal, 
  SchoolPrefectBadgesModal, 
  StudentChatPrivacyModal 
} from './ChatLeadershipModals';

interface SchoolChatSystemProps {
  currentUserRole: 'student' | 'parent' | 'tutor' | 'admin' | 'headmistress' | 'moderator';
  currentUserId: string;
  currentUserName: string;
  currentUserSubtext?: string;
  initialPopupChannelId?: string | null;
  onClosePopup?: () => void;
  hideStories?: boolean;
}

export const SchoolChatSystem: React.FC<SchoolChatSystemProps> = ({
  currentUserRole,
  currentUserId,
  currentUserName,
  currentUserSubtext,
  initialPopupChannelId,
  onClosePopup,
  hideStories
}) => {
  const { 
    chatChannels, 
    chatMessages, 
    addChatChannel, 
    updateChatChannel, 
    deleteChatChannel, 
    sendChatMessage, 
    deleteChatMessage, 
    flagChatMessage,
    resetChatToDefault,
    toggleChatReaction,
    togglePinChatMessage,
    markChannelAsRead,
    getChannelUnreadCount,
    getTotalUnreadCount,
    students,
    tutors,
    parents,
    classes,
    clubs
  } = useSchool();

  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    return chatChannels[0]?.id || 'chan-gen-announcement';
  });

  // Mobile View state (allows switching between channels directory and active chat on small screens)
  const [mobileView, setMobileView] = useState<'channels' | 'conversation'>('channels');

  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'class' | 'club' | 'direct' | 'announcement'>('all');
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);

  // Leadership & Badges Modals
  const [showClassLeadershipModal, setShowClassLeadershipModal] = useState(false);
  const [showClubLeadershipModal, setShowClubLeadershipModal] = useState(false);
  const [showPrefectBadgesModal, setShowPrefectBadgesModal] = useState(false);
  const [showPrivacySettingsModal, setShowPrivacySettingsModal] = useState(false);

  // New Channel Form state (Admin or Authorized users)
  const [newChanName, setNewChanName] = useState('');
  const [newChanType, setNewChanType] = useState<ChatChannelType>('class');
  const [newChanDesc, setNewChanDesc] = useState('');
  const [newChanClassId, setNewChanClassId] = useState(classes[0]?.id || '');
  const [newChanClubId, setNewChanClubId] = useState(clubs[0]?.id || '');
  const [newChanDirectUser, setNewChanDirectUser] = useState('');
  const [newChanReadOnly, setNewChanReadOnly] = useState(false);

  // Direct Chat & Pop-Up Overlay State
  const [activePopupChannelId, setActivePopupChannelId] = useState<string | null>(initialPopupChannelId || null);

  useEffect(() => {
    if (initialPopupChannelId !== undefined) {
      setActivePopupChannelId(initialPopupChannelId);
    }
  }, [initialPopupChannelId]);

  // Mark active channel as read whenever opened
  useEffect(() => {
    if (activePopupChannelId) {
      markChannelAsRead(activePopupChannelId, currentUserId);
    }
  }, [activePopupChannelId, currentUserId]);

  const [showDirectPeerModal, setShowDirectPeerModal] = useState(false);
  const [peerSearchTerm, setPeerSearchTerm] = useState('');
  const [peerTab, setPeerTab] = useState<'classmates' | 'clubs' | 'tutors'>('classmates');

  // Media Attachments & Voice Note State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string; size: string; type: string } | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [playingVoiceMsgId, setPlayingVoiceMsgId] = useState<string | null>(null);
  const [voicePlaybackRate, setVoicePlaybackRate] = useState<number>(1);
  const [expandedImageModalUrl, setExpandedImageModalUrl] = useState<string | null>(null);

  // In-Conversation Search State
  const [inChatSearchOpen, setInChatSearchOpen] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');
  const [inChatSearchIndex, setInChatSearchIndex] = useState(0);

  // Reaction picker hover/tap state
  const [reactionPickerMsgId, setReactionPickerMsgId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatDocInputRef = useRef<HTMLInputElement>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine user permissions
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'headmistress' || currentUserRole === 'moderator';
  const isTutor = currentUserRole === 'tutor';
  const isParent = currentUserRole === 'parent';
  const isStudent = currentUserRole === 'student';

  // Identify current student profile if applicable
  const currentStudent: StudentProfile | null = isStudent 
    ? (students.find(s => s.id === currentUserId) || students.find(s => s.name === currentUserName) || null)
    : null;

  // Student's class and assigned class teacher
  const studentClass = currentStudent 
    ? classes.find(c => c.id === currentStudent.classId || c.name === currentStudent.grade || (currentStudent.grade && c.name.includes(currentStudent.grade)))
    : null;

  const studentClassTeacher = studentClass?.classTeacherId 
    ? tutors.find(t => t.id === studentClass.classTeacherId)
    : (currentStudent?.grade ? tutors.find(t => t.assignedClasses?.includes(currentStudent.grade)) : null);

  // Student clubs set
  const studentClubNames = currentStudent?.clubs || [];

  // Start or open a 1:1 direct chat between students (or with tutors).
  // Note: 'admin-1' is included in directParticipantIds in background for admin supervision,
  // but NEVER exposed in the UI or student views.
  const handleStartDirectChat = (targetId: string, targetName: string, targetRole: 'student' | 'tutor' | 'parent' = 'student') => {
    // Check direct messaging permission if current user is a student
    if (isStudent && targetRole === 'student') {
      const targetStudent = students.find(s => s.id === targetId);
      if (targetStudent) {
        if (targetStudent.chatSettings?.allowDirectMessages === false) {
          alert(`${targetName} has direct messages disabled in their chat privacy settings.`);
          return;
        }
        if (targetStudent.chatSettings?.dmPermission === 'classmates_only') {
          const isSameClass = (currentStudent?.classId && currentStudent.classId === targetStudent.classId) ||
                              (currentStudent?.grade && currentStudent.grade === targetStudent.grade);
          if (!isSameClass) {
            alert(`${targetName} only accepts direct messages from fellow classmates.`);
            return;
          }
        }
      }
    }

    let targetChan = chatChannels.find(c => 
      c.type === 'direct' && 
      c.directParticipantIds?.includes(currentUserId) && 
      c.directParticipantIds?.includes(targetId)
    );

    if (!targetChan) {
      targetChan = addChatChannel({
        name: targetName,
        type: 'direct',
        description: `Direct private consultation between ${currentUserName} and ${targetName}.`,
        directParticipantIds: [currentUserId, targetId, 'admin-1'],
        directParticipantNames: [currentUserName, targetName],
        createdBy: currentUserId,
        isReadOnly: false
      });
    }

    // Immediately pop up the direct chat overlay!
    setActiveChannelId(targetChan.id);
    setActivePopupChannelId(targetChan.id);
    setShowDirectPeerModal(false);
  };

  // Filter channels based on user authorization:
  // "For students, they should only have access to their class, club (when added), private chats and class teacher."
  const authorizedChannels = chatChannels.filter(chan => {
    // Admin has full omnipotent access
    if (isAdmin) return true;

    // Archived channels are hidden from non-admins
    if (chan.isArchived) return false;

    // Direct chats: only participants
    if (chan.type === 'direct') {
      return chan.directParticipantIds?.includes(currentUserId);
    }

    // Announcements are visible to everyone
    if (chan.type === 'announcement') return true;

    // Strict student access rules:
    if (isStudent && currentStudent) {
      // 1. Class chats: ONLY their own class
      if (chan.type === 'class') {
        const matchesClassId = currentStudent.classId && chan.classId === currentStudent.classId;
        const matchesClassName = currentStudent.grade && chan.className === currentStudent.grade;
        const matchesName = currentStudent.grade && chan.name.toLowerCase().includes(currentStudent.grade.toLowerCase());
        return matchesClassId || matchesClassName || matchesName;
      }

      // 2. Club chats: ONLY clubs student has been added to
      if (chan.type === 'club') {
        const matchedClub = clubs.find(cl => cl.id === chan.clubId || cl.name === chan.clubName);
        const inStudentClubsList = studentClubNames.includes(chan.clubName || '') || studentClubNames.includes(chan.clubId || '');
        const inClubMembersList = matchedClub?.memberStudentIds?.includes(currentUserId);
        const isClubOfficer = matchedClub?.presidentStudentId === currentUserId || matchedClub?.vicePresidentStudentId === currentUserId;
        const isParticipant = chan.directParticipantIds?.includes(currentUserId);
        return inStudentClubsList || inClubMembersList || isClubOfficer || isParticipant;
      }

      return false;
    }

    // Tutors and Parents: can view classes and clubs
    if (chan.type === 'class' || chan.type === 'club') {
      return true;
    }

    return true;
  });

  // Filter by category and search term
  const displayedChannels = authorizedChannels.filter(c => {
    const matchesFilter = channelFilter === 'all' || c.type === channelFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const activePopupChannel = activePopupChannelId
    ? (chatChannels.find(c => c.id === activePopupChannelId) || null)
    : null;

  const activeChannel = activePopupChannel || chatChannels.find(c => c.id === activeChannelId) || displayedChannels[0] || chatChannels[0];

  // Channel messages
  const activeMessages = chatMessages.filter(m => m.channelId === activeChannel?.id);

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (activePopupChannelId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activePopupChannelId, activeChannel?.id]);

  // Active channel context for leadership management
  const activeClassObj = activeChannel?.type === 'class'
    ? classes.find(c => c.id === activeChannel.classId || c.name === activeChannel.className || (activeChannel.name && c.name.includes(activeChannel.name)))
    : null;

  const activeClubObj = activeChannel?.type === 'club'
    ? clubs.find(cl => cl.id === activeChannel.clubId || cl.name === activeChannel.clubName || (activeChannel.name && cl.name.includes(activeChannel.name)))
    : null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Document size exceeds the 15MB upload limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const sizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      setSelectedDocument({
        name: file.name,
        url: reader.result as string,
        size: sizeFormatted,
        type: file.type || 'application/octet-stream'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTogglePlaybackRate = () => {
    const nextRate = voicePlaybackRate === 1 ? 1.5 : voicePlaybackRate === 1.5 ? 2 : 1;
    setVoicePlaybackRate(nextRate);
    if (activeAudioRef.current) {
      activeAudioRef.current.playbackRate = nextRate;
    }
  };

  // In-Conversation Search Matches & Navigation
  const matchingMessages = React.useMemo(() => {
    if (!inChatSearchQuery.trim()) return [];
    const q = inChatSearchQuery.toLowerCase().trim();
    return activeMessages.filter(m => m.content && m.content.toLowerCase().includes(q));
  }, [inChatSearchQuery, activeMessages]);

  const handleNextSearchMatch = () => {
    if (matchingMessages.length === 0) return;
    const nextIdx = (inChatSearchIndex + 1) % matchingMessages.length;
    setInChatSearchIndex(nextIdx);
    const targetMsg = matchingMessages[nextIdx];
    if (targetMsg) {
      const el = document.getElementById(`chat-msg-${targetMsg.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePrevSearchMatch = () => {
    if (matchingMessages.length === 0) return;
    const prevIdx = (inChatSearchIndex - 1 + matchingMessages.length) % matchingMessages.length;
    setInChatSearchIndex(prevIdx);
    const targetMsg = matchingMessages[prevIdx];
    if (targetMsg) {
      const el = document.getElementById(`chat-msg-${targetMsg.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Pinned Announcement Message in current active channel
  const pinnedMessage = activeMessages.find(m => m.isPinned && !m.deletedByAdmin);
  const canPinMessages = isAdmin || isTutor || Boolean(currentStudent?.prefectBadge) || Boolean(currentStudent?.prefectRole);

  const handleStartVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.start();
      setIsRecordingVoice(true);
      setVoiceDuration(0);

      voiceTimerRef.current = setInterval(() => {
        setVoiceDuration(prev => prev + 1);
      }, 1000);
    } catch {
      alert('Microphone access is required to record voice notes. Please allow microphone permissions.');
    }
  };

  const handleStopAndSendVoiceRecording = () => {
    if (!mediaRecorderRef.current || !activeChannel) return;
    const recorder = mediaRecorderRef.current;
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    const durationToSave = voiceDuration || 1;

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        sendChatMessage({
          channelId: activeChannel.id,
          senderId: currentUserId,
          senderName: currentUserName,
          senderRole: currentUserRole,
          senderSubtext: currentUserSubtext || (
            isAdmin ? 'School Administration' :
            isTutor ? 'Faculty Educator' :
            isParent ? 'Guardian' : 'Scholar'
          ),
          content: `🎤 Voice Note (${durationToSave}s)`,
          audioVoiceNote: {
            url: base64Audio,
            durationSeconds: durationToSave
          }
        });
      };
      reader.readAsDataURL(audioBlob);

      recorder.stream.getTracks().forEach(track => track.stop());
    };

    recorder.stop();
    setIsRecordingVoice(false);
    setVoiceDuration(0);
  };

  const handleCancelVoiceRecording = () => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecordingVoice(false);
    setVoiceDuration(0);
  };

  const handleTogglePlayVoice = (msgId: string, audioUrl: string) => {
    if (playingVoiceMsgId === msgId) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      setPlayingVoiceMsgId(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audio.playbackRate = voicePlaybackRate;
    activeAudioRef.current = audio;
    setPlayingVoiceMsgId(msgId);

    audio.onended = () => {
      setPlayingVoiceMsgId(null);
    };
    audio.onerror = () => {
      setPlayingVoiceMsgId(null);
    };

    audio.play().catch(() => {
      setPlayingVoiceMsgId(null);
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageText.trim() && !selectedImage && !selectedDocument) || !activeChannel) return;

    if (activeChannel.isReadOnly && !isAdmin) {
      alert('This channel is currently read-only. Only school administrators may publish messages here.');
      return;
    }

    const attachmentsList = selectedDocument ? [{
      name: selectedDocument.name,
      url: selectedDocument.url,
      size: selectedDocument.size,
      type: selectedDocument.type
    }] : undefined;

    sendChatMessage({
      channelId: activeChannel.id,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      senderSubtext: currentUserSubtext || (
        isAdmin ? 'School Administration' :
        isTutor ? 'Faculty Educator' :
        isParent ? 'Guardian' : 'Scholar'
      ),
      content: messageText.trim() || (selectedDocument ? `📎 Document: ${selectedDocument.name}` : '📷 Photo Attachment'),
      imageAttachment: selectedImage ? {
        url: selectedImage,
        caption: messageText.trim()
      } : undefined,
      attachments: attachmentsList
    });

    setMessageText('');
    setSelectedImage(null);
    setSelectedDocument(null);
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName.trim()) return;

    let targetClassName: string | undefined;
    if (newChanType === 'class' && newChanClassId) {
      targetClassName = classes.find(c => c.id === newChanClassId)?.name;
    }

    let targetClubName: string | undefined;
    if (newChanType === 'club' && newChanClubId) {
      targetClubName = clubs.find(cl => cl.id === newChanClubId)?.name;
    }

    let directIds: string[] | undefined;
    let directNames: string[] | undefined;
    if (newChanType === 'direct') {
      directIds = [currentUserId, newChanDirectUser, 'admin-1'];
      const targetUser = students.find(s => s.id === newChanDirectUser) ||
        tutors.find(t => t.id === newChanDirectUser) ||
        parents.find(p => p.id === newChanDirectUser);
      const targetName = targetUser ? ('fullName' in targetUser ? targetUser.fullName : targetUser.name) : 'School Contact';
      directNames = [currentUserName, targetName];
    }

    const created = addChatChannel({
      name: newChanName.trim(),
      type: newChanType,
      description: newChanDesc.trim() || undefined,
      classId: newChanType === 'class' ? newChanClassId : undefined,
      className: targetClassName,
      clubId: newChanType === 'club' ? newChanClubId : undefined,
      clubName: targetClubName,
      directParticipantIds: directIds,
      directParticipantNames: directNames,
      createdBy: currentUserId,
      isReadOnly: newChanReadOnly
    });

    setActiveChannelId(created.id);
    setActivePopupChannelId(created.id);
    setShowNewChannelModal(false);
    setNewChanName('');
    setNewChanDesc('');
  };

  // Helper to resolve sender display badge for any message:
  // "for class it displays as class prefect or assistant, for clubs it displays as president or vice. Also allow admin or principal administrator to give prefect badges to school’s prefects."
  const getSenderBadge = (msg: SchoolChatMessage): string | undefined => {
    if (msg.senderRole !== 'student') return undefined;

    const senderStudent = students.find(s => s.id === msg.senderId);

    // Class channel: check for Class Prefect or Assistant
    if (activeChannel?.type === 'class') {
      const cls = activeClassObj || classes.find(c => c.id === activeChannel.classId || c.name === activeChannel.className);
      if (cls?.prefectStudentId === msg.senderId || senderStudent?.classLeadershipRole === 'prefect') {
        return '⭐ Class Prefect';
      }
      if (cls?.assistantPrefectStudentId === msg.senderId || senderStudent?.classLeadershipRole === 'assistant_prefect') {
        return '⭐ Assistant Prefect';
      }
      if (senderStudent?.prefectBadge || senderStudent?.prefectRole) {
        return senderStudent.prefectBadge || `🏅 ${senderStudent.prefectRole}`;
      }
    }

    // Club channel: check for President or Vice President
    if (activeChannel?.type === 'club') {
      const clb = activeClubObj || clubs.find(cl => cl.id === activeChannel.clubId || cl.name === activeChannel.clubName);
      if (clb?.presidentStudentId === msg.senderId || senderStudent?.clubLeadershipRoles?.[clb?.id || ''] === 'president') {
        return '👑 President';
      }
      if (clb?.vicePresidentStudentId === msg.senderId || senderStudent?.clubLeadershipRoles?.[clb?.id || ''] === 'vice_president') {
        return '👑 Vice President';
      }
      if (senderStudent?.prefectBadge || senderStudent?.prefectRole) {
        return senderStudent.prefectBadge || `🏅 ${senderStudent.prefectRole}`;
      }
    }

    // Direct or other channels: show official school prefect badge if assigned
    if (senderStudent?.prefectBadge || senderStudent?.prefectRole) {
      return senderStudent.prefectBadge || `🏅 ${senderStudent.prefectRole}`;
    }

    return msg.senderBadge;
  };

  const renderHighlightedContent = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 text-neutral-950 font-black rounded-xs px-1 shadow-2xs">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE2CE] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      
      {/* ========================================================================= */}
      {/* TOP WHATSAPP-STYLE 16-HOUR EPHEMERAL STATUS STORY STRIP                   */}
      {/* ========================================================================= */}
      {!hideStories && (
        <EphemeralStatusManager
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserRole={currentUserRole}
          currentUserSubtext={currentUserSubtext}
          currentUserBadge={
            currentStudent?.prefectBadge || 
            (currentStudent?.prefectRole ? `🏅 ${currentStudent.prefectRole}` : undefined)
          }
        />
      )}

      {/* ========================================================================= */}
      {/* CHAT LIST HUB (CLEAN DIRECTORY OF ALL DISCUSSIONS & CHATS)                */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col">
        {/* Top Header Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">School Community Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
                  {currentUserRole}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold mt-0.5">
                {isStudent && currentStudent?.chatSettings?.showOnlineStatus !== false && (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                )}
                <span>•</span>
                <span>{currentUserName}</span>
                {currentUserSubtext && (
                  <>
                    <span>•</span>
                    <span className="text-neutral-400 truncate max-w-[200px]">{currentUserSubtext}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Student Privacy Settings button */}
            {isStudent && currentStudent && (
              <button
                type="button"
                onClick={() => setShowPrivacySettingsModal(true)}
                className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                title="Chat Privacy & Presence Settings"
              >
                <Settings className="w-4 h-4 text-neutral-500" />
                <span className="hidden md:inline">Privacy</span>
              </button>
            )}

            {/* Message peer button */}
            <button
              type="button"
              onClick={() => {
                setPeerSearchTerm('');
                setShowDirectPeerModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              title="Message a classmate or teacher privately"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isAdmin ? 'Message User' : '+ New Message'}</span>
            </button>

            {/* Admin School Prefects & Badges control */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowPrefectBadgesModal(true)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Confer & Manage School Prefect Badges (Principal Administrator)"
              >
                <Crown className="w-4 h-4 fill-neutral-950" />
                <span className="hidden sm:inline">Prefects</span>
              </button>
            )}

            {/* Admin Create Channel control */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowNewChannelModal(true)}
                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Create Chat Channel"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">New Channel</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Action: Chat My Class Teacher (for students) */}
        {isStudent && studentClassTeacher && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                👨‍🏫
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Assigned Form Master / Class Teacher</span>
                <span className="text-xs sm:text-sm font-black text-neutral-900 truncate block">{studentClassTeacher.name}</span>
                <span className="text-[11px] text-neutral-500 truncate block">{studentClassTeacher.assignedSubjects?.join(', ') || 'Faculty Educator'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartDirectChat(studentClassTeacher.id, studentClassTeacher.name, 'tutor')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" />
              <span>Direct Chat</span>
            </button>
          </div>
        )}

        {/* Search bar & Category filter tabs */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isStudent ? "Search your class, clubs, classmates, or direct chats..." : "Search chat forums, scholars, tutors, or topics..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {(['all', 'class', 'club', 'direct', 'announcement'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setChannelFilter(tab)}
                className={`px-3 py-1.5 rounded-xl uppercase tracking-wider text-[11px] whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  channelFilter === tab 
                    ? 'bg-neutral-900 text-white shadow-xs' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab === 'direct' && <Lock className="w-3 h-3" />}
                <span>
                  {tab === 'all' ? 'All Chats' : tab === 'class' ? (isStudent ? 'My Class' : 'Classes') : tab === 'club' ? 'Clubs' : tab === 'direct' ? (isAdmin ? 'Private DMs' : 'Direct Messages') : 'Bulletins'}
                </span>
                {tab === 'direct' && (
                  <span className={`px-1.5 py-0.2 rounded-md font-black text-[10px] ${
                    channelFilter === tab ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {authorizedChannels.filter(c => c.type === 'direct').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT LIST ITEMS */}
        <div className="space-y-2 pt-1 flex-1 overflow-y-auto">
          {displayedChannels.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400 bg-neutral-50/60 rounded-3xl border border-dashed border-neutral-200 space-y-3 my-4">
              <MessageSquare className="w-10 h-10 mx-auto text-neutral-300" />
              <p className="font-semibold text-neutral-600">
                {isStudent 
                  ? 'No matching discussion channels found. You have access to your class, enrolled clubs, and private chats.' 
                  : 'No matching discussion channels found.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setPeerSearchTerm('');
                  setShowDirectPeerModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-500 cursor-pointer"
              >
                + Start a Private Chat
              </button>
            </div>
          ) : (
            displayedChannels.map(chan => {
              const isDirect = chan.type === 'direct';

              let displayName = chan.name;
              let displayDesc = chan.description || `${chan.type.toUpperCase()} discussion channel`;
              let participantPrefectBadge: string | undefined;
              let isParticipantOnline = false;

              if (isDirect) {
                if (isAdmin) {
                  displayName = chan.directParticipantNames && chan.directParticipantNames.length >= 2
                    ? `${chan.directParticipantNames[0]} ↔ ${chan.directParticipantNames[1]}`
                    : chan.name;
                  displayDesc = 'Private Peer Dialogue • Administrator Safeguarding Active';
                } else {
                  // For student/tutor/parent: find the other participant's name
                  const otherName = chan.directParticipantNames?.find(n => !n.includes(currentUserName) && n !== 'admin-1' && !n.toLowerCase().includes('admin'));
                  if (otherName) displayName = otherName;
                  displayDesc = 'Private 1-on-1 Study Chat';

                  const otherStudent = students.find(s => s.name === displayName || s.id === chan.directParticipantIds?.find(id => id !== currentUserId && id !== 'admin-1'));
                  if (otherStudent) {
                    participantPrefectBadge = otherStudent.prefectBadge;
                    isParticipantOnline = otherStudent.chatSettings?.showOnlineStatus !== false;
                  }
                }
              }

              // Get last message in this channel for preview
              const channelMessages = chatMessages.filter(m => m.channelId === chan.id);
              const lastMsg = channelMessages[channelMessages.length - 1];

              let lastMsgSnippet = displayDesc;
              let lastMsgTime: string | null = null;

              if (lastMsg) {
                if (lastMsg.audioVoiceNote) {
                  lastMsgSnippet = `🎤 Voice Note (${lastMsg.audioVoiceNote.durationSeconds}s)`;
                } else if (lastMsg.imageAttachment) {
                  lastMsgSnippet = '📷 Photo Attachment';
                } else if (lastMsg.content) {
                  const author = lastMsg.senderId === currentUserId ? 'You' : lastMsg.senderName.split(' ')[0];
                  lastMsgSnippet = `${author}: ${lastMsg.content}`;
                }

                try {
                  const date = new Date(lastMsg.timestamp);
                  lastMsgTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } catch {
                  lastMsgTime = null;
                }
              }

              // Get channel unread count for current user
              const unreadCount = getChannelUnreadCount(chan.id, currentUserId);

              return (
                <div
                  key={chan.id}
                  onClick={() => {
                    markChannelAsRead(chan.id, currentUserId);
                    setActiveChannelId(chan.id);
                    setActivePopupChannelId(chan.id);
                  }}
                  className="w-full text-left p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-neutral-200/90 hover:border-indigo-300 hover:bg-indigo-50/20 bg-white transition flex items-center justify-between gap-3 cursor-pointer shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs ${
                      chan.type === 'announcement' ? 'bg-amber-100' :
                      chan.type === 'class' ? 'bg-blue-100 text-blue-900' :
                      chan.type === 'club' ? 'bg-emerald-100 text-emerald-900' :
                      'bg-indigo-100 text-indigo-900'
                    }`}>
                      {chan.type === 'announcement' && <SchoolLogo size="xs" showText={false} />}
                      {chan.type === 'class' && <GraduationCap className="w-5 h-5" />}
                      {chan.type === 'club' && <Users className="w-5 h-5" />}
                      {chan.type === 'direct' && (
                        <>
                          <span className="font-black text-sm">{displayName.charAt(0)}</span>
                          {isParticipantOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                          )}
                        </>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-neutral-900 truncate group-hover:text-indigo-950 transition">
                          {displayName}
                        </span>
                        {participantPrefectBadge && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-amber-950 shadow-2xs">
                            {participantPrefectBadge}
                          </span>
                        )}
                        {chan.isReadOnly && (
                          <span title="Read-only broadcast">
                            <Lock className="w-3 h-3 text-neutral-400 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5 group-hover:text-neutral-700 transition font-medium">
                        {lastMsgSnippet}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-2xs animate-pulse">
                            {unreadCount} new
                          </span>
                        )}
                        {lastMsgTime && (
                          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-400">
                            {lastMsgTime}
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md uppercase font-extrabold ${
                        isDirect
                          ? isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          : chan.type === 'class' ? 'bg-blue-100 text-blue-800'
                          : chan.type === 'club' ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {isDirect ? (isAdmin ? '1:1 Audited' : 'Direct DM') : chan.type}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-xl bg-neutral-50 group-hover:bg-indigo-600 group-hover:text-white text-neutral-400 flex items-center justify-center transition">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Admin reset / control footer */}
        {isAdmin && (
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs shrink-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Admin Safeguarding & Moderation Active
            </span>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset chat channels and messages to standard school default?')) {
                  resetChatToDefault();
                }
              }}
              className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
            >
              Reset Chat
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* POP-UP CHAT OVERLAY (POPS UP OVER THE ENTIRE SCREEN WHEN CHAT IS CLICKED) */}
      {/* ========================================================================= */}
      {activePopupChannel && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActivePopupChannelId(null);
            }
          }}
        >
          <div 
            className="w-full max-w-4xl h-[92vh] max-h-[820px] bg-white rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Safeguarding Notice Banner: SHOWN TO ADMIN ONLY! Never allow students to know admin has access! */}
            {activePopupChannel.type === 'direct' && isAdmin && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-950 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-900">Administrator Safeguarding Oversight: </span>
                    <span className="text-amber-800">
                      Observing private dialogue between <strong>{activePopupChannel.directParticipantNames?.[0] || 'Scholar A'}</strong> and <strong>{activePopupChannel.directParticipantNames?.[1] || 'Scholar B'}</strong>.
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider shrink-0 border border-amber-300">
                  Admin Audited
                </span>
              </div>
            )}

            {/* Active Channel Header */}
            {(() => {
              const chan = activePopupChannel;
              const isDirect = chan.type === 'direct';

              let displayName = chan.name;
              let displayDesc = chan.description || `${chan.type.toUpperCase()} discussion channel`;
              let participantPrefectBadge: string | undefined;
              let isParticipantOnline = false;

              if (isDirect) {
                if (isAdmin) {
                  displayName = chan.directParticipantNames && chan.directParticipantNames.length >= 2
                    ? `${chan.directParticipantNames[0]} ↔ ${chan.directParticipantNames[1]}`
                    : chan.name;
                  displayDesc = 'Private Peer Dialogue • Administrator Safeguarding Active';
                } else {
                  const otherName = chan.directParticipantNames?.find(n => !n.includes(currentUserName) && n !== 'admin-1' && !n.toLowerCase().includes('admin'));
                  if (otherName) displayName = otherName;
                  displayDesc = 'Private 1-on-1 Academic Consultation';

                  const otherStudent = students.find(s => s.name === displayName || s.id === chan.directParticipantIds?.find(id => id !== currentUserId && id !== 'admin-1'));
                  if (otherStudent) {
                    participantPrefectBadge = otherStudent.prefectBadge;
                    isParticipantOnline = otherStudent.chatSettings?.showOnlineStatus !== false;
                  }
                }
              }

              return (
                <div className="p-3.5 sm:p-4 border-b border-neutral-200 flex items-center justify-between gap-3 sm:gap-4 bg-white/95 backdrop-blur-xs shrink-0 shadow-2xs">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setActivePopupChannelId(null)}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                      title="Return to Chat List"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline text-xs font-bold">Back to Chats</span>
                    </button>

                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs ${
                      chan.type === 'announcement' ? 'bg-amber-100' :
                      chan.type === 'class' ? 'bg-blue-100 text-blue-900' :
                      chan.type === 'club' ? 'bg-emerald-100 text-emerald-900' :
                      'bg-indigo-100 text-indigo-900'
                    }`}>
                      {chan.type === 'announcement' && <SchoolLogo size="xs" showText={false} />}
                      {chan.type === 'class' && <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />}
                      {chan.type === 'club' && <Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                      {chan.type === 'direct' && (
                        <>
                          <span className="font-black text-sm">{displayName.charAt(0)}</span>
                          {isParticipantOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                          )}
                        </>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <h4 className="font-black text-xs sm:text-base text-neutral-900 break-words line-clamp-1">
                          {displayName}
                        </h4>

                        {participantPrefectBadge && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-amber-950 shadow-2xs">
                            {participantPrefectBadge}
                          </span>
                        )}

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                          chan.type === 'announcement' ? 'bg-amber-100 text-amber-900' :
                          chan.type === 'class' ? 'bg-blue-100 text-blue-900' :
                          chan.type === 'club' ? 'bg-emerald-100 text-emerald-900' :
                          'bg-indigo-100 text-indigo-900'
                        }`}>
                          {chan.type === 'direct' ? (isAdmin ? '1:1 Audited' : '1:1 Private') : chan.type}
                        </span>

                        {chan.isReadOnly && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 flex items-center gap-1 shrink-0">
                            <Lock className="w-2.5 h-2.5" /> Read-Only
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] sm:text-xs text-neutral-500 break-words line-clamp-1 mt-0.5">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  {/* Header Action Buttons (In-Chat Search, Leadership & Close) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* In-Conversation Search Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setInChatSearchOpen(!inChatSearchOpen);
                        if (inChatSearchOpen) {
                          setInChatSearchQuery('');
                          setInChatSearchIndex(0);
                        }
                      }}
                      className={`p-1.5 sm:p-2 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                        inChatSearchOpen 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                      title="Search messages in this discussion (Ctrl+F)"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Class Leadership button (Admin Only) */}
                    {isAdmin && chan.type === 'class' && activeClassObj && (
                      <button
                        type="button"
                        onClick={() => setShowClassLeadershipModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Select Class Prefect & Assistant Prefect"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="hidden sm:inline">Class Prefects</span>
                      </button>
                    )}

                    {/* Club Leadership button (Admin Only) */}
                    {isAdmin && chan.type === 'club' && activeClubObj && (
                      <button
                        type="button"
                        onClick={() => setShowClubLeadershipModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Select Club President, Vice President & Members"
                      >
                        <Crown className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span className="hidden sm:inline">Club Leaders</span>
                      </button>
                    )}

                    {/* Close Pop-Up Overlay */}
                    <button
                      type="button"
                      onClick={() => {
                        setActivePopupChannelId(null);
                        if (onClosePopup) onClosePopup();
                      }}
                      className="p-1.5 sm:p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                      title="Close Chat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* In-Conversation Search Toolbar */}
            {inChatSearchOpen && (
              <div className="bg-neutral-100/90 backdrop-blur-xs border-b border-neutral-200 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs shrink-0 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <input
                    type="text"
                    value={inChatSearchQuery}
                    onChange={(e) => {
                      setInChatSearchQuery(e.target.value);
                      setInChatSearchIndex(0);
                    }}
                    placeholder="Search in this conversation..."
                    autoFocus
                    className="w-full bg-white px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-neutral-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-neutral-600 px-1">
                    {matchingMessages.length > 0 
                      ? `${inChatSearchIndex + 1} of ${matchingMessages.length}` 
                      : (inChatSearchQuery ? 'No matches' : 'Type to search')}
                  </span>
                  <button
                    type="button"
                    onClick={handlePrevSearchMatch}
                    disabled={matchingMessages.length === 0}
                    className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 text-neutral-700 cursor-pointer shadow-2xs"
                    title="Previous match (Up)"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSearchMatch}
                    disabled={matchingMessages.length === 0}
                    className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 text-neutral-700 cursor-pointer shadow-2xs"
                    title="Next match (Down)"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInChatSearchOpen(false);
                      setInChatSearchQuery('');
                      setInChatSearchIndex(0);
                    }}
                    className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 cursor-pointer"
                    title="Close in-chat search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Pinned Message Announcement Banner */}
            {pinnedMessage && (
              <div className="bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border-b border-amber-300/80 px-4 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-amber-950 text-xs">Pinned Announcement</span>
                      <span className="text-[10px] text-amber-800 font-bold">• by {pinnedMessage.pinnedBy || pinnedMessage.senderName}</span>
                    </div>
                    <p className="text-[11px] text-neutral-700 truncate font-medium mt-0.5">
                      {pinnedMessage.content || 'Attached media announcement'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById(`chat-msg-${pinnedMessage.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-950 text-[11px] font-bold shadow-2xs cursor-pointer"
                  >
                    Jump to Msg
                  </button>
                  {canPinMessages && (
                    <button
                      type="button"
                      onClick={() => togglePinChatMessage(pinnedMessage.id, currentUserName)}
                      className="p-1 text-amber-800 hover:text-amber-950 rounded-lg hover:bg-amber-200/50 cursor-pointer"
                      title="Unpin this announcement"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/40">
              {activeMessages.length === 0 ? (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h5 className="font-black text-sm text-neutral-800">No messages in this chat yet</h5>
                  <p className="text-xs text-neutral-500 max-w-sm">
                    Start the conversation! Scholars, faculty tutors, and parents can collaborate, discuss study topics, and exchange ideas.
                  </p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMine = msg.senderId === currentUserId;
                  const isMsgAdmin = msg.senderRole === 'admin';
                  const isMsgTutor = msg.senderRole === 'tutor';
                  const isMsgParent = msg.senderRole === 'parent';
                  const senderBadge = getSenderBadge(msg);
                  const isClickableName = !isMine && msg.senderId && !isMsgAdmin && activePopupChannel.type !== 'announcement';

                  return (
                    <div 
                      key={msg.id}
                      id={`chat-msg-${msg.id}`}
                      className={`flex gap-3 max-w-2xl transition-all duration-200 ${isMine ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div 
                        onClick={() => {
                          if (isClickableName) {
                            handleStartDirectChat(msg.senderId, msg.senderName, msg.senderRole as any);
                          }
                        }}
                        title={isClickableName ? `Click to message ${msg.senderName}` : undefined}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs overflow-hidden ${
                          isClickableName ? 'cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all' : ''
                        } ${
                          isMsgAdmin || activePopupChannel.type === 'announcement' ? '' :
                          isMsgTutor ? 'bg-blue-900 text-amber-300' :
                          isMsgParent ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-indigo-700 text-white'
                        }`}
                      >
                        {isMsgAdmin || activePopupChannel.type === 'announcement' ? (
                          <SchoolLogo size="xs" showText={false} />
                        ) : (
                          msg.senderName.charAt(0)
                        )}
                      </div>

                      {/* Message Bubble Container */}
                      <div className={`space-y-1.5 ${isMine ? 'items-end' : ''}`}>
                        {/* Meta header */}
                        <div className={`flex items-center gap-1.5 flex-wrap text-[11px] ${isMine ? 'justify-end' : ''}`}>
                          <span 
                            onClick={() => {
                              if (isClickableName) {
                                handleStartDirectChat(msg.senderId, msg.senderName, msg.senderRole as any);
                              }
                            }}
                            className={`font-black text-neutral-900 ${
                              isClickableName ? 'cursor-pointer hover:text-indigo-600 hover:underline transition' : ''
                            }`}
                            title={isClickableName ? `Click to message ${msg.senderName}` : undefined}
                          >
                            {isMine ? 'You' : msg.senderName}
                          </span>
                          
                          {/* Role Tag */}
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            isMsgAdmin ? 'bg-neutral-900 text-white' :
                            isMsgTutor ? 'bg-blue-100 text-blue-900' :
                            isMsgParent ? 'bg-amber-100 text-amber-900' :
                            'bg-neutral-100 text-neutral-700'
                          }`}>
                            {msg.senderRole}
                          </span>

                          {/* Official Leadership Badge (Prefect, President, Vice President, etc.) */}
                          {senderBadge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-2xs flex items-center gap-1 ${
                              senderBadge.includes('President') ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              senderBadge.includes('Vice') ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                              senderBadge.includes('Prefect') ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' :
                              'bg-purple-100 text-purple-900 border border-purple-300'
                            }`}>
                              {senderBadge}
                            </span>
                          )}

                          {/* Pinned Marker Badge */}
                          {msg.isPinned && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-amber-950 flex items-center gap-1 shadow-2xs">
                              <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                            </span>
                          )}

                          {msg.senderSubtext && !senderBadge && (
                            <span className="text-neutral-400 font-medium truncate max-w-[140px]">
                              • {msg.senderSubtext}
                            </span>
                          )}

                          <span className="text-[10px] text-neutral-400">
                            • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Bubble */}
                        <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed relative group ${
                          isMine 
                            ? 'bg-neutral-900 text-white rounded-tr-xs shadow-sm' 
                            : (isAdmin && msg.flaggedByAdmin)
                            ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-xs'
                            : 'bg-white border border-neutral-200 text-neutral-800 rounded-tl-xs shadow-xs'
                        }`}>
                          {msg.deletedByAdmin ? (
                            <span className="italic text-neutral-400">
                              {isAdmin 
                                ? '[This message was removed by the School Administrator for violating conduct policy.]' 
                                : '[This message was deleted]'}
                            </span>
                          ) : (
                            <div className="space-y-2">
                              {/* Image Attachment */}
                              {msg.imageAttachment && (
                                <div 
                                  onClick={() => setExpandedImageModalUrl(msg.imageAttachment!.url)}
                                  className="rounded-2xl overflow-hidden max-w-xs cursor-pointer group/img relative border border-white/20"
                                >
                                  <img 
                                    src={msg.imageAttachment.url} 
                                    alt="Attachment" 
                                    className="w-full max-h-60 object-cover group-hover/img:scale-102 transition-transform" 
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>View Fullscreen</span>
                                  </div>
                                </div>
                              )}

                              {/* Document Files Attachment */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                  {msg.attachments.map((att, idx) => (
                                    <a
                                      key={idx}
                                      href={att.url}
                                      download={att.name}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`p-2.5 rounded-2xl flex items-center justify-between gap-3 border transition ${
                                        isMine 
                                          ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                                          <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                          <p className="text-xs font-bold truncate">{att.name}</p>
                                          <p className="text-[10px] opacity-70">{att.size || 'Document file'}</p>
                                        </div>
                                      </div>
                                      <span className="p-1.5 rounded-lg bg-neutral-200/60 hover:bg-neutral-200 text-neutral-700 text-xs shrink-0 font-bold">
                                        Download
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              )}

                              {/* Voice Note Player */}
                              {msg.audioVoiceNote && (
                                <div className={`p-2.5 rounded-2xl flex items-center gap-3 ${isMine ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePlayVoice(msg.id, msg.audioVoiceNote!.url)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition ${
                                      isMine ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300' : 'bg-neutral-900 text-white hover:bg-neutral-800'
                                    }`}
                                  >
                                    {playingVoiceMsgId === msg.id ? (
                                      <Pause className="w-4 h-4" />
                                    ) : (
                                      <Play className="w-4 h-4 ml-0.5" />
                                    )}
                                  </button>

                                  {/* Waveform Visualization Bars */}
                                  <div className="flex-1 flex items-center gap-1 h-6">
                                    {[40, 70, 30, 90, 60, 100, 45, 80, 50, 85, 35, 75, 55, 95, 65, 40].map((h, i) => (
                                      <span 
                                        key={i} 
                                        className={`w-1 rounded-full transition-all duration-200 ${
                                          playingVoiceMsgId === msg.id 
                                            ? (isMine ? 'bg-amber-300 animate-pulse' : 'bg-neutral-900 animate-pulse') 
                                            : (isMine ? 'bg-white/40' : 'bg-neutral-300')
                                        }`} 
                                        style={{ height: `${Math.max(20, h)}%` }} 
                                      />
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-[11px] font-mono font-bold">
                                      {Math.floor(msg.audioVoiceNote.durationSeconds / 60)}:{(msg.audioVoiceNote.durationSeconds % 60).toString().padStart(2, '0')}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleTogglePlaybackRate}
                                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono uppercase cursor-pointer transition ${
                                        isMine ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                                      }`}
                                      title="Toggle voice playback speed"
                                    >
                                      {voicePlaybackRate}x
                                    </button>
                                  </div>
                                </div>
                              )}

                              {msg.content && (!msg.audioVoiceNote || !msg.content.startsWith('🎤')) && (!msg.imageAttachment || msg.content !== '📷 Photo Attachment') && (
                                <p className="whitespace-pre-wrap">{renderHighlightedContent(msg.content, inChatSearchQuery)}</p>
                              )}
                            </div>
                          )}

                          {/* Message Action Menu (Quick Emoji Reactions, Pinning & Moderation) */}
                          <div className="hidden group-hover:flex items-center gap-1 absolute -top-3.5 right-2 bg-white px-2 py-0.5 rounded-full border border-neutral-200 shadow-md text-xs z-10 animate-in fade-in">
                            {/* Emoji Reaction palette */}
                            {['👍', '❤️', '👏', '😂', '🔥', '🎓'].map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => toggleChatReaction(msg.id, emoji, currentUserName)}
                                className="hover:scale-130 transition-transform p-0.5 cursor-pointer text-xs"
                                title={`React with ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}

                            {/* Pin message button (Admins, Tutors & Prefects) */}
                            {canPinMessages && (
                              <button
                                type="button"
                                onClick={() => togglePinChatMessage(msg.id, currentUserName)}
                                className={`p-1 hover:text-amber-600 transition cursor-pointer ml-1 ${
                                  msg.isPinned ? 'text-amber-600' : 'text-neutral-400'
                                }`}
                                title={msg.isPinned ? 'Unpin announcement' : 'Pin message as channel announcement'}
                              >
                                <Pin className="w-3 h-3 fill-current" />
                              </button>
                            )}

                            {/* Admin moderation quick actions */}
                            {isAdmin && !msg.deletedByAdmin && (
                              <>
                                <span className="w-px h-3 bg-neutral-200 mx-0.5" />
                                <button
                                  type="button"
                                  onClick={() => flagChatMessage(msg.id, !msg.flaggedByAdmin)}
                                  className={`p-1 hover:text-amber-600 cursor-pointer ${msg.flaggedByAdmin ? 'text-amber-600' : 'text-neutral-400'}`}
                                  title={msg.flaggedByAdmin ? 'Unflag message' : 'Flag message'}
                                >
                                  <Flag className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Delete this message as administrator?')) {
                                      deleteChatMessage(msg.id);
                                    }
                                  }}
                                  className="p-1 hover:text-red-600 text-neutral-400 cursor-pointer"
                                  title="Delete Message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Reaction Badges Display */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className={`flex items-center gap-1.5 flex-wrap pt-0.5 ${isMine ? 'justify-end' : ''}`}>
                            {Object.entries(msg.reactions).map(([emoji, users]) => {
                              if (!users || users.length === 0) return null;
                              const hasMyReaction = users.includes(currentUserName);
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => toggleChatReaction(msg.id, emoji, currentUserName)}
                                  className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition cursor-pointer border ${
                                    hasMyReaction 
                                      ? 'bg-amber-100 text-amber-950 border-amber-300 font-black shadow-2xs' 
                                      : 'bg-white/95 hover:bg-neutral-100 text-neutral-700 border-neutral-200 shadow-2xs'
                                  }`}
                                  title={`${users.join(', ')} reacted with ${emoji}`}
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[10px] font-bold">{users.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer */}
            <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 shrink-0">
              {activePopupChannel.isReadOnly && !isAdmin ? (
                <div className="p-3 rounded-2xl bg-neutral-100 text-neutral-500 text-xs text-center flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>This channel is locked by the School Administration. Comments are disabled.</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-2">
                  {/* Selected Image Preview Chip */}
                  {selectedImage && (
                    <div className="flex items-center gap-2 p-2 bg-neutral-100 rounded-2xl max-w-sm">
                      <img src={selectedImage} alt="Preview" className="w-12 h-12 object-cover rounded-xl border border-neutral-300" />
                      <span className="text-xs text-neutral-700 flex-1 truncate font-bold">Photo attached</span>
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-500 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Selected Document Preview Chip */}
                  {selectedDocument && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-2xl max-w-sm">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-neutral-900 truncate">{selectedDocument.name}</p>
                        <p className="text-[10px] text-amber-800 font-semibold">{selectedDocument.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedDocument(null)}
                        className="p-1 hover:bg-amber-100 rounded-lg text-amber-800 cursor-pointer"
                        title="Remove document"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Recording Voice Note Active Overlay */}
                  {isRecordingVoice ? (
                    <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                        <span className="text-xs font-black font-mono">
                          Recording Voice: {Math.floor(voiceDuration / 60)}:{(voiceDuration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCancelVoiceRecording}
                          className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleStopAndSendVoiceRecording}
                          className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black shadow-xs hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Voice Note</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Hidden Image File Input */}
                      <input
                        type="file"
                        ref={chatFileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                        title="Attach Photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>

                      {/* Hidden Document File Input */}
                      <input
                        type="file"
                        ref={chatDocInputRef}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                        onChange={handleDocSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => chatDocInputRef.current?.click()}
                        className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                        title="Attach Document or PDF"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleStartVoiceRecording}
                        className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
                        title="Record Voice Note"
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={`Message ${activePopupChannel.name}...`}
                        autoFocus
                        className="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                      />

                      <button
                        type="submit"
                        disabled={!messageText.trim() && !selectedImage && !selectedDocument}
                        className="p-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white transition cursor-pointer shadow-sm active:scale-95"
                        title="Send Message"
                      >
                        <Send className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE NEW CHANNEL                                               */}
      {/* ========================================================================= */}
      {showNewChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-black text-base text-neutral-900">Create New Chat Forum</h4>
                  <p className="text-xs text-neutral-500">Configure class forum, co-curricular club, or direct channel.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewChannelModal(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-4 text-xs font-bold text-neutral-700">
              <div>
                <label className="block mb-1">Forum Type</label>
                <select
                  value={newChanType}
                  onChange={(e) => {
                    const t = e.target.value as ChatChannelType;
                    setNewChanType(t);
                    if (t === 'class' && classes[0]) setNewChanName(`${classes[0].name} — Academic Forum`);
                    if (t === 'club' && clubs[0]) setNewChanName(`${clubs[0].name} — Society Hub`);
                    if (t === 'announcement') setNewChanName('Official Announcement Broadcast');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                >
                  <option value="class">Class by Class Forum</option>
                  <option value="club">Co-Curricular Club & Society</option>
                  <option value="direct">Direct 1:1 Consultation (Parent / Tutor / Student)</option>
                  <option value="announcement">Official Announcement Bulletin</option>
                </select>
              </div>

              {newChanType === 'class' && (
                <div>
                  <label className="block mb-1">Linked School Class</label>
                  <select
                    value={newChanClassId}
                    onChange={(e) => {
                      setNewChanClassId(e.target.value);
                      const cls = classes.find(c => c.id === e.target.value);
                      if (cls) setNewChanName(`${cls.name} — Academic Forum`);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {newChanType === 'club' && (
                <div>
                  <label className="block mb-1">Linked Extracurricular Club</label>
                  <select
                    value={newChanClubId}
                    onChange={(e) => {
                      setNewChanClubId(e.target.value);
                      const cl = clubs.find(c => c.id === e.target.value);
                      if (cl) setNewChanName(`${cl.name} — Society Hub`);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  >
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
                    ))}
                  </select>
                </div>
              )}

              {newChanType === 'direct' && (
                <div>
                  <label className="block mb-1">Target Contact</label>
                  <select
                    value={newChanDirectUser}
                    onChange={(e) => setNewChanDirectUser(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                    required
                  >
                    <option value="">-- Choose User for Consultation --</option>
                    <optgroup label="Faculty Tutors">
                      {tutors.map(t => (
                        <option key={t.id} value={t.id}>{t.name} (Tutor • {t.assignedSubjects?.join(', ') || 'Faculty'})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Parents">
                      {parents.map(p => (
                        <option key={p.id} value={p.id}>{p.fullName} (Guardian)</option>
                      ))}
                    </optgroup>
                    <optgroup label="Scholars">
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              <div>
                <label className="block mb-1">Channel Name</label>
                <input
                  type="text"
                  value={newChanName}
                  onChange={(e) => setNewChanName(e.target.value)}
                  placeholder="e.g. SSS 2 Science — Class Forum"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newChanDesc}
                  onChange={(e) => setNewChanDesc(e.target.value)}
                  placeholder="Purpose of this channel..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-read-only"
                  checked={newChanReadOnly}
                  onChange={(e) => setNewChanReadOnly(e.target.checked)}
                  className="rounded text-amber-500 cursor-pointer"
                />
                <label htmlFor="chk-read-only" className="cursor-pointer font-bold text-neutral-700">
                  Read-only announcement channel (only administrators can send messages)
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-black cursor-pointer shadow-sm"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DIRECT PEER-TO-PEER MESSAGING MODAL & CHAT OVERLAY CARD          */}
      {/* ========================================================================= */}
      {showDirectPeerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden my-2 sm:my-4 relative h-[min(90dvh,640px)] min-h-[400px] max-h-[94dvh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-neutral-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Private Direct Message</h3>
                  <p className="text-xs text-indigo-200">
                    Connect 1-on-1 with a fellow scholar or academic tutor
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowDirectPeerModal(false);
                }}
                className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student DM Privacy Bar (Allows student to see & change their direct messaging preference) */}
            {isStudent && currentStudent && (
              <div className="bg-indigo-950/70 border-b border-indigo-800/60 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-indigo-200 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">
                    Your DM Privacy: <strong className="text-white">{currentStudent.chatSettings?.dmPermission === 'classmates_only' ? 'Fellow Classmates Only' : 'Anyone at Stanbax'}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrivacySettingsModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-800/80 hover:bg-indigo-700 text-amber-300 font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Settings className="w-3 h-3" />
                  <span>Configure</span>
                </button>
              </div>
            )}

            {/* Directory Content (The Previous List of Users) */}
            <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Notice Card */}
              {isAdmin ? (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 leading-relaxed">
                    <span className="font-bold block text-amber-900">Administrative Oversight View</span>
                    All 1-on-1 direct message channels across scholars and tutors remain accessible from the Admin Community Hub.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-950 leading-relaxed">
                    <span className="font-bold block text-indigo-900">1-on-1 Academic Collaboration</span>
                    Connect directly with your classmates, club peers, and class teacher to collaborate on homework, assignments, and exam revision.
                  </div>
                </div>
              )}

              {/* Tabs: Classmates vs Club Peers vs Tutors */}
              <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPeerTab('classmates')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    peerTab === 'classmates' 
                      ? 'bg-white text-neutral-900 shadow-xs' 
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {isStudent ? 'My Classmates' : 'All Scholars'}
                </button>
                <button
                  type="button"
                  onClick={() => setPeerTab('clubs')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    peerTab === 'clubs' 
                      ? 'bg-white text-neutral-900 shadow-xs' 
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {isStudent ? 'Club Peers' : 'Club Members'}
                </button>
                <button
                  type="button"
                  onClick={() => setPeerTab('tutors')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    peerTab === 'tutors' 
                      ? 'bg-white text-neutral-900 shadow-xs' 
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {isStudent ? 'Class Teacher & Tutors' : 'Faculty Tutors'}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={peerSearchTerm}
                  onChange={(e) => setPeerSearchTerm(e.target.value)}
                  placeholder={
                    peerTab === 'classmates' ? "Search classmate by name..." :
                    peerTab === 'clubs' ? "Search club member by name..." :
                    "Search teacher by name or subject..."
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* User Directory List */}
              <div className="space-y-2 pt-1">
                {peerTab === 'classmates' ? (
                  (() => {
                    const peerList = students.filter(s => {
                      if (s.id === currentUserId) return false;
                      // Students can only access their own class!
                      if (isStudent && currentStudent) {
                        const inSameClass = (currentStudent.classId && s.classId === currentStudent.classId) || 
                          (currentStudent.grade && s.grade === currentStudent.grade);
                        if (!inSameClass) return false;
                      }
                      const matchesSearch = s.name.toLowerCase().includes(peerSearchTerm.toLowerCase());
                      return matchesSearch;
                    });

                    if (peerList.length === 0) {
                      return (
                        <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-100">
                          {isStudent ? "No classmates found in your class matching search." : "No scholars found."}
                        </div>
                      );
                    }

                    return peerList.map(s => {
                      const hasExistingChat = chatChannels.some(c => 
                        c.type === 'direct' && 
                        c.directParticipantIds?.includes(currentUserId) && 
                        c.directParticipantIds?.includes(s.id)
                      );

                      // Check student direct chat preference:
                      // Fellow classmates can chat unless scholar completely turned off direct chats
                      const peerChatDisabled = isStudent && s.chatSettings?.allowDirectMessages === false;

                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            if (!peerChatDisabled) {
                              handleStartDirectChat(s.id, s.name, 'student');
                            }
                          }}
                          className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 bg-white shadow-2xs ${
                            peerChatDisabled 
                              ? 'border-neutral-200 opacity-75' 
                              : 'border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 relative">
                              {s.name.charAt(0)}
                              {s.chatSettings?.showOnlineStatus !== false && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h5 className="font-extrabold text-xs text-neutral-900 truncate">{s.name}</h5>
                                {s.prefectBadge && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                    {s.prefectBadge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 font-medium truncate">
                                {s.grade} • {s.house ? `${s.house} House` : 'Stanbax Standard'}
                              </p>
                            </div>
                          </div>

                          {peerChatDisabled ? (
                            <span 
                              className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-400 font-semibold text-xs cursor-not-allowed shrink-0"
                              title="This scholar has chosen not to receive direct chats from fellow students."
                            >
                              Chat Disabled
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartDirectChat(s.id, s.name, 'student');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Send className="w-3 h-3" />
                              <span>{hasExistingChat ? 'Open Chat' : 'Start Chat'}</span>
                            </button>
                          )}
                        </div>
                      );
                    });
                  })()
                ) : peerTab === 'clubs' ? (
                  (() => {
                    // Club members in clubs that current student is in
                    const myClubs = clubs.filter(cl => 
                      cl.memberStudentIds?.includes(currentUserId) ||
                      cl.presidentStudentId === currentUserId ||
                      cl.vicePresidentStudentId === currentUserId ||
                      studentClubNames.includes(cl.name) ||
                      studentClubNames.includes(cl.id) ||
                      isAdmin
                    );

                    const clubMemberIds = Array.from(new Set(
                      myClubs.flatMap(c => [
                        ...(c.memberStudentIds || []),
                        ...(c.presidentStudentId ? [c.presidentStudentId] : []),
                        ...(c.vicePresidentStudentId ? [c.vicePresidentStudentId] : [])
                      ])
                    )).filter(id => id !== currentUserId);

                    const clubPeers = students.filter(s => 
                      clubMemberIds.includes(s.id) &&
                      s.name.toLowerCase().includes(peerSearchTerm.toLowerCase())
                    );

                    if (clubPeers.length === 0) {
                      return (
                        <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-100">
                          {isStudent 
                            ? "No fellow club members found. Join or get added to an extracurricular club to connect with society peers!" 
                            : "No club scholars found."}
                        </div>
                      );
                    }

                    return clubPeers.map(s => {
                      const hasExistingChat = chatChannels.some(c => 
                        c.type === 'direct' && 
                        c.directParticipantIds?.includes(currentUserId) && 
                        c.directParticipantIds?.includes(s.id)
                      );

                      // Check classmate privacy preference:
                      // If target student set dmPermission to 'classmates_only', non-classmate peers cannot direct message
                      const isClassmate = isStudent && currentStudent && (
                        (currentStudent.classId && s.classId === currentStudent.classId) || 
                        (currentStudent.grade && s.grade === currentStudent.grade)
                      );
                      const onlyClassmatesAllowed = isStudent && s.chatSettings?.dmPermission === 'classmates_only' && !isClassmate;
                      const peerChatDisabled = isStudent && (s.chatSettings?.allowDirectMessages === false || onlyClassmatesAllowed);

                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            if (!peerChatDisabled) {
                              handleStartDirectChat(s.id, s.name, 'student');
                            }
                          }}
                          className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 bg-white shadow-2xs ${
                            peerChatDisabled 
                              ? 'border-neutral-200 opacity-75' 
                              : 'border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
                              {s.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-xs text-neutral-900 truncate">{s.name}</h5>
                              <p className="text-[11px] text-neutral-500 font-medium truncate">
                                {s.grade} • Club Peer
                              </p>
                            </div>
                          </div>

                          {peerChatDisabled ? (
                            onlyClassmatesAllowed ? (
                              <span 
                                className="px-2.5 py-1 rounded-xl bg-neutral-100 text-neutral-500 font-bold text-[11px] flex items-center gap-1 border border-neutral-200 shrink-0"
                                title={`${s.name} only accepts direct messages from fellow classmates in ${s.grade || 'their class'}.`}
                              >
                                <Lock className="w-3 h-3 text-neutral-400" />
                                <span>Classmates Only</span>
                              </span>
                            ) : (
                              <span 
                                className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-400 font-semibold text-xs cursor-not-allowed shrink-0"
                                title="This scholar has chosen not to receive direct chats from fellow students."
                              >
                                Chat Disabled
                              </span>
                            )
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartDirectChat(s.id, s.name, 'student');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Send className="w-3 h-3" />
                              <span>{hasExistingChat ? 'Open Chat' : 'Start Chat'}</span>
                            </button>
                          )}
                        </div>
                      );
                    });
                  })()
                ) : (
                  (() => {
                    const tutorList = tutors.filter(t => {
                      if (t.id === currentUserId) return false;
                      const matchesSearch = t.name.toLowerCase().includes(peerSearchTerm.toLowerCase()) ||
                        (t.assignedSubjects && t.assignedSubjects.some(sub => sub.toLowerCase().includes(peerSearchTerm.toLowerCase())));
                      return matchesSearch;
                    });

                    if (tutorList.length === 0) {
                      return (
                        <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-50 rounded-2xl border border-neutral-100">
                          No tutors found matching your search.
                        </div>
                      );
                    }

                    return tutorList.map(t => {
                      const hasExistingChat = chatChannels.some(c => 
                        c.type === 'direct' && 
                        c.directParticipantIds?.includes(currentUserId) && 
                        c.directParticipantIds?.includes(t.id)
                      );

                      const isMyClassTeacher = studentClassTeacher?.id === t.id;

                      return (
                        <div
                          key={t.id}
                          onClick={() => handleStartDirectChat(t.id, t.name, 'tutor')}
                          className="p-3 rounded-2xl border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/30 transition flex items-center justify-between gap-3 bg-white shadow-2xs cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-sm shrink-0">
                              {t.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h5 className="font-extrabold text-xs text-neutral-900 truncate">{t.name}</h5>
                                {isMyClassTeacher && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                                    👨‍🏫 My Class Teacher
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 font-medium truncate">
                                Faculty Tutor • {t.assignedSubjects?.join(', ') || 'Academic Department'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartDirectChat(t.id, t.name, 'tutor');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Send className="w-3 h-3" />
                            <span>{hasExistingChat ? 'Open Chat' : 'Start Chat'}</span>
                          </button>
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowDirectPeerModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer transition shadow-xs"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CLASS LEADERSHIP MODAL (ADMIN ONLY)                              */}
      {/* ========================================================================= */}
      {showClassLeadershipModal && activeClassObj && (
        <ClassLeadershipModal
          schoolClass={activeClassObj}
          onClose={() => setShowClassLeadershipModal(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CLUB LEADERSHIP MODAL (ADMIN ONLY)                               */}
      {/* ========================================================================= */}
      {showClubLeadershipModal && activeClubObj && (
        <ClubLeadershipModal
          club={activeClubObj}
          onClose={() => setShowClubLeadershipModal(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: SCHOOL PREFECTS & BADGES MODAL (PRINCIPAL ADMINISTRATOR)         */}
      {/* ========================================================================= */}
      {showPrefectBadgesModal && (
        <SchoolPrefectBadgesModal
          onClose={() => setShowPrefectBadgesModal(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: STUDENT CHAT PRIVACY & PRESENCE SETTINGS                         */}
      {/* ========================================================================= */}
      {showPrivacySettingsModal && currentStudent && (
        <StudentChatPrivacyModal
          student={currentStudent}
          onClose={() => setShowPrivacySettingsModal(false)}
        />
      )}

    </div>
  );
};
