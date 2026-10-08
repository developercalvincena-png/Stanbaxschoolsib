import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  X, 
  Send, 
  Sparkles, 
  User, 
  Edit3, 
  Check, 
  CheckCheck,
  Clock, 
  Phone, 
  ShieldCheck, 
  BookOpen, 
  CreditCard, 
  MapPin, 
  Award,
  MessageSquare,
  Calendar,
  Mic,
  Square,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Share2,
  Copy,
  MessageCircle,
  CheckCircle2,
  RotateCcw,
  Download,
  AlertCircle
} from '../RealIcons';
import { SchoolRepRole, ChatAppointment } from '../../types';

interface SchoolRepresentativeChatProps {
  onClose: () => void;
}

const VISITOR_IDENTITY_KEY = 'stanbax_visitor_identity';

const cleanMessageContent = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/^[ \t]*#{1,6}[ \t]*/gm, '')
    .replace(/#(\d+)/g, 'No. $1')
    .replace(/#/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[ \t]*\*[ \t]+/gm, '• ')
    .replace(/\*/g, '');
};

export const SchoolRepresentativeChat: React.FC<SchoolRepresentativeChatProps> = ({ onClose }) => {
  const {
    schoolInfo,
    schoolRepConfig,
    visitorConversations,
    sendVisitorMessage,
    requestCalvinAiInstantReply,
    getVisitorConversation,
    markConversationSeenByVisitor,
    setChatTyping,
    typingMap,
    bookChatAppointment,
    updateVisitorNotificationOptIn
  } = useSchool();

  // Persistent unique visitor identity
  const [visitorIdentity, setVisitorIdentity] = useState<{ visitorId: string; visitorName: string; phone?: string; email?: string }>(() => {
    try {
      const saved = localStorage.getItem(VISITOR_IDENTITY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.visitorId && parsed.visitorName) {
          return parsed;
        }
      }
    } catch {}

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newIdentity = {
      visitorId: `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorName: `Prospective Parent (${randomNum})`,
      phone: '',
      email: ''
    };
    try {
      localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify(newIdentity));
    } catch {}
    return newIdentity;
  });

  // Restore magic link from URL if present (?chat_ref=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const chatRef = params.get('chat_ref');
      if (chatRef && chatRef !== visitorIdentity.visitorId) {
        const found = visitorConversations.find(c => c.visitorId === chatRef);
        if (found) {
          const restored = {
            visitorId: found.visitorId,
            visitorName: found.visitorName,
            phone: found.visitorPhone || '',
            email: found.visitorEmail || ''
          };
          setVisitorIdentity(restored);
          localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify(restored));
        }
      }
    } catch {}
  }, [visitorConversations]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(visitorIdentity.visitorName);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [serverRepTyping, setServerRepTyping] = useState<{ isRepTyping: boolean; repName: string }>({ isRepTyping: false, repName: '' });
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Modals & Tools state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [showOptInModal, setShowOptInModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [optInSuccess, setOptInSuccess] = useState(false);
  const [optInPhone, setOptInPhone] = useState(visitorIdentity.phone || '');

  // Booking Form State
  const [bookingType, setBookingType] = useState<ChatAppointment['type']>('Entrance Screening');
  const [candidateName, setCandidateName] = useState('');
  const [gradeApplying, setGradeApplying] = useState('Primary 1');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Language State for Calvin AI Multilingual Concierge (Yoruba, French, Hausa, Igbo, English)
  const [chatLanguage, setChatLanguage] = useState<'en' | 'yo' | 'fr' | 'ha' | 'ig'>('en');
  // Microphone permission error banner state
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  // Audio Voice Notes Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Attachments State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<{ url: string; name: string; type: 'image' | 'document' | 'audio'; audioDuration?: number } | null>(null);

  // Retrieve current active conversation
  const currentConversation = getVisitorConversation(visitorIdentity.visitorId);
  const messages = currentConversation?.messages || [];

  // Effective Representative Details (Handles Multi-Department Hand-off / Transferred Desk)
  const effectiveRepRole = currentConversation?.assignedRole || schoolRepConfig.activeRole;
  const effectiveRepName = currentConversation?.assignedRepName || schoolRepConfig.repName;
  const effectiveRepTitle = currentConversation?.assignedRepTitle || schoolRepConfig.repTitle;

  // Mark all incoming representative/AI messages as seen by visitor
  useEffect(() => {
    if (visitorIdentity.visitorId) {
      markConversationSeenByVisitor(visitorIdentity.visitorId);
    }
  }, [visitorIdentity.visitorId, messages.length]);

  // Real-time server typing polling for cross-window / multi-client synchronization
  useEffect(() => {
    const checkTyping = async () => {
      try {
        const res = await fetch(`/api/chat-typing/${visitorIdentity.visitorId}`);
        if (res.ok) {
          const data = await res.json();
          setServerRepTyping({
            isRepTyping: !!data.isRepTyping,
            repName: data.repName || ''
          });
        }
      } catch {}
    };

    checkTyping();
    const interval = setInterval(checkTyping, 2000);
    return () => clearInterval(interval);
  }, [visitorIdentity.visitorId]);

  // Combined real-time typing indicators for school representative
  const activeTypingState = typingMap[visitorIdentity.visitorId];
  const isRepTyping = serverRepTyping.isRepTyping || !!activeTypingState?.isRepTyping;
  const repTypingName = serverRepTyping.repName || activeTypingState?.repName || effectiveRepName;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isThinking, isRepTyping, isRecording]);

  // Visitor typing handler with debounced broadcast
  const handleInputChange = (val: string) => {
    setInputText(val);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (val.trim()) {
      void setChatTyping(visitorIdentity.visitorId, 'visitor', true, visitorIdentity.visitorName);
      typingTimeoutRef.current = setTimeout(() => {
        void setChatTyping(visitorIdentity.visitorId, 'visitor', false);
      }, 2500);
    } else {
      void setChatTyping(visitorIdentity.visitorId, 'visitor', false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      void setChatTyping(visitorIdentity.visitorId, 'visitor', false);
    };
  }, [visitorIdentity.visitorId]);

  const handleSaveName = () => {
    const trimmed = editedName.trim();
    if (trimmed) {
      const updated = { ...visitorIdentity, visitorName: trimmed };
      setVisitorIdentity(updated);
      try {
        localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify(updated));
      } catch {}
    }
    setIsEditingName(false);
  };

  // Voice Recording Handlers
  const startVoiceRecording = async () => {
    setMicPermissionDenied(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setPendingAttachment({
              url: base64data,
              name: `Voice Note (${recordingSeconds || 4}s)`,
              type: 'audio',
              audioDuration: recordingSeconds || 4
            });
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(sec => sec + 1);
        }, 1000);
      } else {
        setMicPermissionDenied(true);
      }
    } catch (err: any) {
      console.warn('Microphone permission check:', err?.message || err);
      setMicPermissionDenied(true);
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      const duration = recordingSeconds || 4;
      setPendingAttachment({
        url: 'https://cdn.freesound.org/previews/263/263133_2064400-lq.mp3',
        name: `Voice_Inquiry_${Date.now()}.mp3`,
        type: 'audio',
        audioDuration: duration
      });
    }
    setIsRecording(false);
  };

  const cancelVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // File Attachment Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      setPendingAttachment({
        url: reader.result as string,
        name: file.name,
        type: isImg ? 'image' : 'document'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTriggerCalvinAiStandIn = async () => {
    setIsThinking(true);
    try {
      await requestCalvinAiInstantReply(visitorIdentity.visitorId);
    } catch (err) {
      console.warn('Failed to trigger Calvin AI instant stand-in:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if ((!text && !pendingAttachment) || isThinking) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    void setChatTyping(visitorIdentity.visitorId, 'visitor', false);

    const attachmentToSend = pendingAttachment;
    setPendingAttachment(null);
    setInputText('');
    setIsThinking(true);

    try {
      await sendVisitorMessage(
        visitorIdentity.visitorId, 
        text, 
        {
          name: visitorIdentity.visitorName,
          phone: visitorIdentity.phone,
          language: chatLanguage
        },
        attachmentToSend || undefined
      );
    } catch (err) {
      console.warn('Failed to send visitor inquiry:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  // Appointment Submission
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;

    setIsSubmittingBooking(true);
    try {
      await bookChatAppointment(visitorIdentity.visitorId, {
        type: bookingType,
        candidateName: candidateName.trim(),
        gradeApplying,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        parentPhone: visitorIdentity.phone || '+234 803 000 0000',
        parentEmail: visitorIdentity.email,
        notes: bookingNotes.trim()
      });
      setIsBookingOpen(false);
      setCandidateName('');
      setBookingNotes('');
    } catch (err) {
      console.warn('Booking error:', err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // WhatsApp / SMS Opt-in Handlers
  const handleSaveOptIn = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = optInPhone.trim();
    if (!phone) return;

    updateVisitorNotificationOptIn(visitorIdentity.visitorId, {
      whatsapp: true,
      sms: true,
      phone
    });
    setVisitorIdentity(prev => ({ ...prev, phone }));
    try {
      localStorage.setItem(VISITOR_IDENTITY_KEY, JSON.stringify({ ...visitorIdentity, phone }));
    } catch {}

    setOptInSuccess(true);
    setTimeout(() => {
      setShowOptInModal(false);
      setOptInSuccess(false);
    }, 2000);
  };

  // Copy Magic Link
  const handleCopyMagicLink = () => {
    const url = `${window.location.origin}?chat_ref=${visitorIdentity.visitorId}`;
    void navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const quickQuestions = [
    { label: '💳 Tuition Fees & Bursary', text: 'Could you explain the tuition fees breakdown and installment payment options?' },
    { label: '📝 Admission & Screening', text: 'How do I register for admissions and what are the entrance exam screening dates?' },
    { label: '📍 Location & Bus Routes', text: 'Where is the school located and what bus transportation routes do you cover in Ibadan?' },
    { label: '🎓 Dual Curriculum', text: 'Tell me about the British-Nigerian curriculum and WAEC/Cambridge preparations.' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 animate-in fade-in zoom-in-95 duration-200 select-none sm:select-auto font-['Nunito',sans-serif] relative">
      {/* Hidden file picker */}
      <input 
        ref={fileInputRef} 
        type="file" 
        onChange={handleFileSelect} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx" 
      />

      {/* 1. Header: Representative Details, Desk Status & Quick Tools */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-3.5 sm:p-4 shrink-0 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Representative Avatar with Status Indicator */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md border-2 border-amber-300 overflow-hidden">
                {schoolRepConfig.repAvatar ? (
                  <img 
                    src={schoolRepConfig.repAvatar} 
                    alt={effectiveRepName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-6 h-6 text-neutral-950" />
                )}
              </div>
              <span 
                title={schoolRepConfig.isAvailable ? 'Representative Online' : 'Representative Away • Calvin AI Active'}
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${
                  schoolRepConfig.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-purple-400'
                }`} 
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white truncate tracking-tight">
                  {effectiveRepName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                  {effectiveRepRole}
                </span>
              </div>
              <p className="text-xs text-blue-200/90 truncate font-semibold">
                {effectiveRepTitle}
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Appointment Booking, WhatsApp Alerts, Magic Link, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="p-1.5 sm:px-2 sm:py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer border border-amber-400/40"
              title="Schedule Entrance Screening or Campus Tour"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Screening</span>
            </button>

            <button
              type="button"
              onClick={() => setShowOptInModal(true)}
              className={`p-1.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                currentConversation?.notificationOptIn?.whatsapp 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                  : 'bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white'
              }`}
              title="Receive WhatsApp/SMS notifications when Representative replies"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleCopyMagicLink}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Copy consultation magic link to resume anytime"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Subtitle Banner & Copied Notification */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isRepTyping ? (
              <div className="flex items-center gap-1.5 text-amber-300 font-black truncate animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span className="truncate">{repTypingName} is crafting a response...</span>
              </div>
            ) : schoolRepConfig.isAvailable ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-bold truncate">Online • Rep is at the desk</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="text-purple-200 font-bold truncate">
                  Rep is Away • Calvin AI answering on their behalf
                </span>
              </>
            )}
          </div>
          {copiedLink ? (
            <span className="text-emerald-300 text-[10px] font-bold shrink-0 animate-pulse">
              ✓ Link Copied!
            </span>
          ) : (
            <span className="text-neutral-400 text-[10px] shrink-0 font-medium">
              Stanbax Ibadan
            </span>
          )}
        </div>
      </div>

      {/* 2. Visitor Identity & Persistent Channel Bar */}
      <div className="bg-neutral-50 px-3.5 py-2 border-b border-neutral-200/80 flex items-center justify-between gap-2 shrink-0 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-neutral-500 font-semibold text-[11px] shrink-0">Inquiring as:</span>
          {isEditingName ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="px-2 py-0.5 rounded-lg border border-neutral-300 text-xs font-bold text-neutral-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer"
                title="Save Name"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-neutral-800 truncate text-[11px]">
                {visitorIdentity.visitorName}
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditedName(visitorIdentity.visitorName);
                  setIsEditingName(true);
                }}
                className="text-neutral-400 hover:text-blue-700 p-0.5 rounded transition cursor-pointer shrink-0"
                title="Customize your name"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-0.5 rounded bg-neutral-200/80 text-neutral-600 text-[9px] font-mono font-bold">
            Ref: {visitorIdentity.visitorId.slice(-5).toUpperCase()}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
            <Check className="w-3 h-3" />
            <span>Retained</span>
          </span>
        </div>
      </div>

      {/* Multilingual Admissions Concierge Selector Bar */}
      <div className="bg-neutral-100/90 px-3 py-1.5 border-b border-neutral-200 flex items-center justify-between gap-1 overflow-x-auto text-[10px] scrollbar-none">
        <span className="text-neutral-500 font-bold uppercase shrink-0">Language:</span>
        <div className="flex items-center gap-1 shrink-0">
          {[
            { id: 'en', label: 'English' },
            { id: 'yo', label: 'Èdè Yorùbá' },
            { id: 'fr', label: 'Français' },
            { id: 'ha', label: 'Hausa' },
            { id: 'ig', label: 'Asụsụ Igbo' }
          ].map(lang => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setChatLanguage(lang.id as any)}
              className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                chatLanguage === lang.id
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-white/80 text-neutral-700 hover:bg-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Microphone Permission Fallback Notification Banner */}
      {micPermissionDenied && (
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-1.5 text-[11px]">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Microphone unavailable or blocked. You can upload an audio file directly instead.</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold cursor-pointer transition"
            >
              Attach Audio File
            </button>
            <button
              type="button"
              onClick={() => setMicPermissionDenied(false)}
              className="text-amber-800 hover:text-amber-950 text-[11px] p-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-100/50">
        {/* Welcome Greeting from Representative */}
        <div className="flex gap-2.5 max-w-[90%] sm:max-w-[85%]">
          <div className="w-8 h-8 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            {effectiveRepName.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-neutral-800">
                {effectiveRepName}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase">
                {effectiveRepRole}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white text-neutral-800 text-xs shadow-xs border border-neutral-200/70 leading-relaxed">
              {schoolRepConfig.welcomeMessage}
            </div>
          </div>
        </div>

        {/* Offline Calvin AI notice if rep is away */}
        {!schoolRepConfig.isAvailable && messages.length === 0 && (
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-900 text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-black text-[11px] text-purple-950">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Calvin AI Virtual Representative Ready</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              {effectiveRepName} is presently on campus duty. Ask any question below or schedule a screening date! I will provide immediate details on fees and admissions, and the representative can resume live upon returning.
            </p>
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg, idx) => {
          const isVisitor = msg.sender === 'visitor';
          const isAi = msg.sender === 'calvin_ai';
          const isHumanRep = msg.sender === 'representative';

          // Detect handover resumption
          const hadAiBefore = messages.slice(0, idx).some(m => m.sender === 'calvin_ai');
          const isFirstRepAfterAi = isHumanRep && hadAiBefore && !messages.slice(0, idx).some(m => m.sender === 'representative');

          // 1. Department Hand-Off Notice
          if (msg.isTransferNotice) {
            return (
              <div key={msg.id} className="my-2 p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-950 text-xs shadow-xs space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-xs text-blue-900">
                    <RotateCcw className="w-4 h-4 text-blue-700" />
                    <span>Department Hand-off Preserved</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-950 text-[10px] font-black uppercase">
                    Active Desk
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-900/90 font-medium">{msg.content}</p>
                <div className="text-[9px] text-blue-600 font-mono text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          }

          // 2. Official Appointment Booking Notice
          if (msg.isAppointmentNotice && msg.appointmentData) {
            const apt = msg.appointmentData;
            return (
              <div key={msg.id} className="my-2 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 text-emerald-950 text-xs shadow-sm space-y-2 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-1.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-emerald-950">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span>Official Screening & Visit Pass</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase shadow-2xs">
                    Confirmed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/70 p-2.5 rounded-xl border border-emerald-200/60">
                  <div>
                    <span className="text-emerald-700 font-semibold block text-[10px]">Session Type</span>
                    <span className="font-extrabold text-neutral-900">{apt.type}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-semibold block text-[10px]">Candidate</span>
                    <span className="font-extrabold text-neutral-900">{apt.candidateName}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-semibold block text-[10px]">Scheduled Date</span>
                    <span className="font-extrabold text-neutral-900">{apt.date}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-semibold block text-[10px]">Time Slot</span>
                    <span className="font-extrabold text-neutral-900">{apt.timeSlot}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-emerald-800 font-semibold pt-0.5">
                  <span>Logged in Stanbax Admissions Calendar</span>
                  <span className="font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          }

          if (isVisitor) {
            const isMsgSeen = msg.status === 'seen' || (currentConversation?.lastSeenByAdminAt && new Date(currentConversation.lastSeenByAdminAt).getTime() >= new Date(msg.timestamp).getTime());
            const isMsgDelivered = msg.status === 'delivered' || isMsgSeen;

            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] space-y-1 text-right">
                  <span className="text-[10px] text-neutral-400 font-semibold pr-1">
                    {msg.senderName}
                  </span>
                  <div className="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs shadow-sm text-left leading-relaxed">
                    {/* Audio Voice Note Player */}
                    {msg.attachmentType === 'audio' && msg.attachmentUrl && (
                      <div className="mb-2 p-2 rounded-xl bg-white/15 backdrop-blur-xs flex items-center gap-2">
                        <audio controls src={msg.attachmentUrl} className="h-8 max-w-[210px] accent-white" />
                        {msg.audioDuration && (
                          <span className="text-[10px] font-mono text-white/90 font-bold">{msg.audioDuration}s</span>
                        )}
                      </div>
                    )}

                    {/* Image Attachment */}
                    {msg.attachmentType === 'image' && msg.attachmentUrl && (
                      <div 
                        className="mb-2 overflow-hidden rounded-xl border border-white/20 cursor-pointer max-w-[220px]" 
                        onClick={() => setPreviewImageUrl(msg.attachmentUrl!)}
                      >
                        <img src={msg.attachmentUrl} alt="Visitor Attachment" className="w-full max-h-36 object-cover hover:scale-105 transition" />
                      </div>
                    )}

                    {/* Document Attachment */}
                    {msg.attachmentType === 'document' && msg.attachmentUrl && (
                      <a 
                        href={msg.attachmentUrl} 
                        download={msg.attachmentName || 'document'} 
                        className="mb-2 p-2 rounded-xl bg-white/20 hover:bg-white/30 flex items-center gap-2 text-[11px] font-bold text-white transition block"
                      >
                        <FileText className="w-4 h-4 text-white shrink-0" />
                        <span className="truncate max-w-[170px]">{msg.attachmentName || 'Document.pdf'}</span>
                      </a>
                    )}

                    <div className="whitespace-pre-wrap">{cleanMessageContent(msg.content)}</div>
                  </div>

                  {/* Delivery & Seen Tracking Status */}
                  <div className="flex items-center justify-end gap-1.5 text-[9px] text-neutral-400 pr-1 font-mono">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMsgSeen ? (
                      <span 
                        className="flex items-center gap-0.5 text-blue-600 font-extrabold"
                        title={`Query acknowledged by ${effectiveRepName}${msg.seenAt ? ` at ${new Date(msg.seenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`}
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Acknowledged</span>
                      </span>
                    ) : isMsgDelivered ? (
                      <span 
                        className="flex items-center gap-0.5 text-neutral-500 font-semibold"
                        title="Delivered to school representative desk"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Delivered</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-neutral-400 font-semibold" title="Sent">
                        <Check className="w-3.5 h-3.5" />
                        <span>Sent</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Reply from Calvin AI or Human Representative
          return (
            <React.Fragment key={msg.id}>
              {/* Handover Notice: Representative Resumed Chat Live */}
              {isFirstRepAfterAi && (
                <div className="flex items-center justify-center my-2">
                  <div className="px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-[10px] font-black flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>{effectiveRepName} has come online & resumed the conversation live</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 max-w-[90%] sm:max-w-[85%]">
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                    isAi ? 'bg-purple-700 text-white' : 'bg-emerald-700 text-amber-300'
                  }`}
                >
                  {isAi ? <Sparkles className="w-4 h-4 text-purple-200" /> : <ShieldCheck className="w-4 h-4 text-amber-300" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-black text-neutral-900">
                      {msg.senderName}
                    </span>
                    <span 
                      className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                        isAi 
                          ? 'bg-purple-100 text-purple-900 border border-purple-200' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isAi ? 'Virtual Rep' : 'Official Reply'}
                    </span>
                    {isHumanRep && (
                      <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                        • Live from Desk
                      </span>
                    )}
                  </div>
                  <div 
                    className={`p-3.5 rounded-2xl rounded-tl-xs text-xs shadow-xs border leading-relaxed whitespace-pre-wrap ${
                      isAi 
                        ? 'bg-white text-neutral-800 border-purple-200/70' 
                        : 'bg-emerald-50/70 text-emerald-950 border-emerald-200'
                    }`}
                  >
                    {/* Media Attachments in rep reply */}
                    {msg.attachmentType === 'image' && msg.attachmentUrl && (
                      <div 
                        className="mb-2 overflow-hidden rounded-xl border border-neutral-300 cursor-pointer max-w-[220px]" 
                        onClick={() => setPreviewImageUrl(msg.attachmentUrl!)}
                      >
                        <img src={msg.attachmentUrl} alt="Representative Attachment" className="w-full max-h-36 object-cover hover:scale-105 transition" />
                      </div>
                    )}
                    {msg.attachmentType === 'document' && msg.attachmentUrl && (
                      <a 
                        href={msg.attachmentUrl} 
                        download={msg.attachmentName || 'document'} 
                        className="mb-2 p-2 rounded-xl bg-white border border-neutral-200 flex items-center gap-2 text-[11px] font-bold text-blue-700 transition block"
                      >
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[170px]">{msg.attachmentName || 'Document.pdf'}</span>
                      </a>
                    )}
                    {msg.attachmentType === 'audio' && msg.attachmentUrl && (
                      <div className="mb-2 p-2 rounded-xl bg-neutral-900/10 flex items-center gap-2">
                        <audio controls src={msg.attachmentUrl} className="h-8 max-w-[210px]" />
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{cleanMessageContent(msg.content)}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 pl-1 font-mono">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivered live</span>
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Live Inquiry Acknowledgment Notification Banner */}
        {currentConversation?.lastSeenByAdminAt && messages.some(m => m.sender === 'visitor') && (
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 text-blue-950 text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-extrabold text-[11px] truncate">
                Inquiry acknowledged by {effectiveRepName} ({effectiveRepTitle})
              </span>
            </div>
            <span className="text-[10px] text-blue-700 font-mono font-bold shrink-0">
              {new Date(currentConversation.lastSeenByAdminAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {/* Real-Time Representative Typing Indicator Bubble */}
        {isRepTyping && (
          <div className="flex gap-2.5 max-w-[90%] sm:max-w-[85%] items-end animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-amber-300 flex items-center justify-center font-black text-xs shrink-0 shadow-xs border border-amber-300/40">
              {repTypingName.charAt(0) || 'R'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-neutral-800">
                  {repTypingName}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase">
                  {effectiveRepRole}
                </span>
                <span className="text-[9px] font-bold text-blue-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  <span>Typing response</span>
                </span>
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white text-neutral-800 text-xs shadow-xs border border-blue-200 flex items-center gap-2.5">
                <span className="font-semibold text-neutral-700 text-[11px]">
                  {repTypingName} is currently crafting a response...
                </span>
                <span className="inline-flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '160ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '320ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Live Representative Reviewing Message Notice */}
        {schoolRepConfig.isAvailable && messages.length > 0 && messages[messages.length - 1].sender === 'visitor' && !isThinking && !isRepTyping && (
          <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-[11px] text-emerald-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Delivered to {effectiveRepName}'s Desk</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Representative Online</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Your inquiry has been routed to {effectiveRepName} ({effectiveRepTitle}). Representative is active and will respond shortly.
            </p>
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => void handleTriggerCalvinAiStandIn()}
                className="text-[10px] font-extrabold text-purple-700 hover:text-purple-900 bg-purple-100/90 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Need an instant answer? Ask Calvin AI to draft right now</span>
              </button>
            </div>
          </div>
        )}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex gap-2.5 items-center text-xs text-purple-700">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-purple-200 shadow-xs flex items-center gap-2">
              <span className="font-extrabold text-[11px]">Calvin AI is drafting response...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Inquiry Suggestions */}
      <div className="px-3 py-2 bg-neutral-50 border-t border-neutral-200/70 shrink-0">
        <span className="text-[10px] font-bold text-neutral-500 block mb-1">
          Quick Inquiries for {effectiveRepName}:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => void handleSend(q.text)}
              disabled={isThinking}
              className="px-2.5 py-1 rounded-xl bg-white border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 text-[10px] font-extrabold text-neutral-700 whitespace-nowrap transition cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Attachment / Voice Note Preview Chip */}
      {pendingAttachment && (
        <div className="px-3 py-1.5 bg-blue-50 border-t border-blue-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {pendingAttachment.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />}
            {pendingAttachment.type === 'document' && <FileText className="w-4 h-4 text-blue-600 shrink-0" />}
            {pendingAttachment.type === 'audio' && <Mic className="w-4 h-4 text-rose-600 shrink-0" />}
            <span className="font-bold text-neutral-800 text-[11px] truncate">{pendingAttachment.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setPendingAttachment(null)}
            className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Input Bar: Voice Recording, File Attachment, and Send */}
      <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
        {isRecording ? (
          <div className="flex items-center justify-between gap-3 p-2 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="font-black text-rose-700 text-xs">
                Recording Voice Note ({recordingSeconds}s)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelVoiceRecording}
                className="px-2.5 py-1 rounded-lg bg-neutral-200 text-neutral-700 text-[11px] font-bold hover:bg-neutral-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={stopVoiceRecording}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black hover:bg-rose-700 transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-neutral-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
              title="Attach document or photo (birth certificate, report card, payment slip)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice Record Button */}
            <button
              type="button"
              onClick={() => void startVoiceRecording()}
              className="p-2.5 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Record Voice Note Inquiry"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setTimeout(scrollToBottom, 200)}
              placeholder={`Message ${effectiveRepName} or ask Calvin AI...`}
              disabled={isThinking}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />
            <button
              type="submit"
              disabled={(!inputText.trim() && !pendingAttachment) || isThinking}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white flex items-center justify-center transition cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
              title="Send Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
        <p className="text-[9px] text-center text-neutral-400 mt-1.5">
          Stanbax Admissions & Public Information Desk • All conversation history retained
        </p>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADMISSIONS & SCREENING APPOINTMENT BOOKING                       */}
      {/* ========================================================================= */}
      {isBookingOpen && (
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[92%] overflow-y-auto p-5 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-neutral-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <span>Book Screening or Visit</span>
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Instant scheduling with Admissions & Desk
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Appointment Type</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Entrance Screening">Entrance Exam Screening</option>
                  <option value="Campus Tour">Campus Guided Tour & Facilities</option>
                  <option value="Principal Interview">1-on-1 Principal Interview</option>
                  <option value="Bursary Consultation">Bursary & Fee Breakdown Session</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Candidate / Child's Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Adeleke"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Grade Applying</label>
                  <select
                    value={gradeApplying}
                    onChange={(e) => setGradeApplying(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Creche">Creche / Playgroup</option>
                    <option value="Nursery 1">Nursery 1</option>
                    <option value="Nursery 2">Nursery 2</option>
                    <option value="Primary 1">Primary 1</option>
                    <option value="Primary 2-6">Primary 2 - 6</option>
                    <option value="JSS 1">JSS 1 (Junior High)</option>
                    <option value="JSS 2-3">JSS 2 - 3</option>
                    <option value="SSS 1">SSS 1 (Senior WAEC/IGCSE)</option>
                    <option value="SSS 2-3">SSS 2 - 3</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Time Slot</label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Parent Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 803 123 4567"
                  value={visitorIdentity.phone || ''}
                  onChange={(e) => setVisitorIdentity(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Notes / Questions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Inquiring about boarding bus pickup"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 font-bold text-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking || !candidateName.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black cursor-pointer shadow-md disabled:opacity-40"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WHATSAPP / SMS ALERT NOTIFICATION OPT-IN                         */}
      {/* ========================================================================= */}
      {showOptInModal && (
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-neutral-900">WhatsApp & SMS Alerts</h3>
                  <p className="text-[10px] text-neutral-500">Get notified when rep replies offline</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOptInModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {optInSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-xs">Alerts Activated!</h4>
                <p className="text-[11px] text-emerald-700">
                  You will receive an instant notification whenever {effectiveRepName} responds.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveOptIn} className="space-y-3 text-xs">
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  If you need to close this browser tab, enter your WhatsApp or mobile number so the school representative can deliver their official response to you directly.
                </p>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 445 6789"
                    value={optInPhone}
                    onChange={(e) => setOptInPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOptInModal(false)}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 font-bold text-neutral-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black cursor-pointer shadow-md"
                  >
                    Activate Alerts
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: IMAGE ATTACHMENT FULLSCREEN PREVIEW                               */}
      {/* ========================================================================= */}
      {previewImageUrl && (
        <div 
          className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={previewImageUrl} 
              alt="Attachment Preview" 
              className="rounded-2xl max-h-[75vh] max-w-[85vw] object-contain shadow-2xl border border-white/20" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
