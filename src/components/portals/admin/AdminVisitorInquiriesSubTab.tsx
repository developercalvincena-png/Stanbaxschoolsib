import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Users, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  User, 
  Edit3, 
  ShieldCheck, 
  Radio, 
  Save, 
  RotateCcw, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  ChevronRight, 
  Check, 
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Mic,
  MessageCircle,
  ExternalLink,
  Paperclip,
  X,
  Share2,
  AlertCircle
} from '../../RealIcons';
import { SchoolRepRole } from '../../../types';

const CANNED_RESPONSES = [
  {
    category: 'Admissions & Screening',
    title: 'Screening Schedule & Entrance Requirements',
    text: 'Thank you for your interest in Stanbax Schools Ibadan! Our Entrance Examinations & Screening take place on campus every Saturday from 9:00 AM. Prospective students are evaluated in Mathematics, English, and General Aptitude. Required documents include 2 passport photographs and a copy of the latest report card.'
  },
  {
    category: 'Bursary & Fees',
    title: 'Tuition Breakdown & Flexible Installment Plans',
    text: 'Good day! Stanbax Schools offers transparent tuition structures with flexible installment payment milestones across the academic term. Fees cover academic tuition, STEM laboratory access, coding workshops, and co-curricular clubs. Let us know the scholar\'s intended grade so the Bursary Desk can provide the itemized breakdown.'
  },
  {
    category: 'Transport & Routes',
    title: 'School Bus Transportation Routes',
    text: 'Our school bus fleet operates monitored, air-conditioned transit across major Ibadan routes including Bodija, Akobo, Oluyole, Ring Road, Challenge, Eleyele, and Jericho. Buses feature dedicated teacher chaperones and safety protocols.'
  },
  {
    category: 'Curriculum & WAEC',
    title: 'British-Nigerian Dual Curriculum Details',
    text: 'Stanbax Schools runs an enriched British-Nigerian dual curriculum, combining the Nigerian NERDC syllabus with Cambridge International frameworks. We prepare scholars thoroughly for WAEC, NECO, BECE, and Cambridge IGCSE with proven 100% distinction records.'
  },
  {
    category: 'Campus Visit',
    title: 'Invitation for Guided Campus Tour',
    text: 'We cordially invite you and your scholar for a private guided tour of our modern campus, air-conditioned smart classrooms, science and robotics labs, and sports arenas. Tours are hosted Monday to Friday between 9:00 AM and 3:00 PM.'
  }
];

const cleanText = (content: string): string => {
  if (!content) return '';
  return content
    .replace(/^[ \t]*#{1,6}[ \t]*/gm, '')
    .replace(/#(\d+)/g, 'No. $1')
    .replace(/#/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[ \t]*\*[ \t]+/gm, '• ')
    .replace(/\*/g, '');
};

export const AdminVisitorInquiriesSubTab: React.FC = () => {
  const {
    schoolRepConfig,
    updateSchoolRepConfig,
    toggleRepAvailability,
    visitorConversations,
    replyAsRepresentative,
    markVisitorConversationRead,
    markConversationSeenByAdmin,
    setChatTyping,
    typingMap,
    transferConversationDepartment
  } = useSchool();

  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    visitorConversations.length > 0 ? visitorConversations[0].visitorId : null
  );
  const [repReplyText, setRepReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferRole, setTransferRole] = useState<SchoolRepRole>('bursar');
  const [transferReason, setTransferReason] = useState('');
  const [showCannedModal, setShowCannedModal] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // Representative configuration state
  const [formRole, setFormRole] = useState<SchoolRepRole>(schoolRepConfig.activeRole);
  const [formName, setFormName] = useState(schoolRepConfig.repName);
  const [formTitle, setFormTitle] = useState(schoolRepConfig.repTitle);
  const [formWelcome, setFormWelcome] = useState(schoolRepConfig.welcomeMessage);
  const [formPhone, setFormPhone] = useState(schoolRepConfig.contactPhone || '+234 803 123 4567');
  const [formEmail, setFormEmail] = useState(schoolRepConfig.contactEmail || 'admissions@stanbaxschools.edu.ng');

  const repTypingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const repFileInputRef = useRef<HTMLInputElement | null>(null);
  const [repPendingAttachment, setRepPendingAttachment] = useState<{ url: string; name: string; type: 'image' | 'document' } | null>(null);

  const selectedConversation = visitorConversations.find(c => c.visitorId === selectedVisitorId) || visitorConversations[0];

  // Automatically mark conversation as seen and acknowledged by representative
  useEffect(() => {
    if (selectedConversation?.visitorId) {
      markConversationSeenByAdmin(selectedConversation.visitorId);
    }
  }, [selectedConversation?.visitorId, selectedConversation?.messages.length]);

  // Handle typing indicator broadcast from representative
  const handleRepInputChange = (val: string) => {
    setRepReplyText(val);
    if (!selectedConversation) return;

    if (repTypingTimerRef.current) {
      clearTimeout(repTypingTimerRef.current);
    }

    if (val.trim()) {
      void setChatTyping(selectedConversation.visitorId, 'representative', true, formName || schoolRepConfig.repName);
      repTypingTimerRef.current = setTimeout(() => {
        void setChatTyping(selectedConversation.visitorId, 'representative', false);
      }, 3000);
    } else {
      void setChatTyping(selectedConversation.visitorId, 'representative', false);
    }
  };

  useEffect(() => {
    return () => {
      if (repTypingTimerRef.current) clearTimeout(repTypingTimerRef.current);
      if (selectedConversation) {
        void setChatTyping(selectedConversation.visitorId, 'representative', false);
      }
    };
  }, [selectedConversation?.visitorId]);

  const handleRoleQuickSelect = (role: SchoolRepRole) => {
    setFormRole(role);
    if (role === 'principal') {
      setFormName('Mrs. Bello');
      setFormTitle('School Principal & Head of Administration');
      setFormWelcome('Welcome to Stanbax Schools Ibadan! I am Mrs. Bello, Principal. How may we assist your family today with admissions, entrance examinations, or our British-Nigerian curriculum?');
    } else if (role === 'bursar') {
      setFormName('Mr. Olumide Ogunleye');
      setFormTitle('Chief Bursar & Finance Desk');
      setFormWelcome('Good day! I am Mr. Ogunleye, School Bursar. I am here to provide transparent fee schedules, installment options, and bursary clearance guidance.');
    } else if (role === 'admissions') {
      setFormName('Mrs. Folake Adeyemi');
      setFormTitle('Director of Admissions & Guidance');
      setFormWelcome('Welcome to the Stanbax Admissions Desk! Ask any questions regarding student registration, entrance test dates, Creche to SSS 3 placement, or campus tours.');
    } else {
      setFormName('Stanbax School Representative');
      setFormTitle('Official Campus Desk');
      setFormWelcome('Hello! Welcome to Stanbax Schools Ibadan. How can we assist you with our programs, admissions, or school facilities today?');
    }
  };

  const handleSaveConfig = () => {
    updateSchoolRepConfig({
      activeRole: formRole,
      repName: formName.trim() || 'School Representative',
      repTitle: formTitle.trim() || 'Campus Admissions Desk',
      welcomeMessage: formWelcome.trim(),
      contactPhone: formPhone.trim(),
      contactEmail: formEmail.trim()
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleRepFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      setRepPendingAttachment({
        url: reader.result as string,
        name: file.name,
        type: isImg ? 'image' : 'document'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendRepReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || (!repReplyText.trim() && !repPendingAttachment)) return;

    if (repTypingTimerRef.current) {
      clearTimeout(repTypingTimerRef.current);
    }
    void setChatTyping(selectedConversation.visitorId, 'representative', false);

    const attachmentToSend = repPendingAttachment;
    setRepPendingAttachment(null);

    replyAsRepresentative(
      selectedConversation.visitorId, 
      repReplyText, 
      {
        name: formName || schoolRepConfig.repName,
        title: formTitle || schoolRepConfig.repTitle
      },
      attachmentToSend || undefined
    );

    if (!schoolRepConfig.isAvailable) {
      toggleRepAvailability(true);
    }

    setRepReplyText('');
  };

  // 2. Calvin AI Smart Draft Suggestion
  const handleGenerateAiDraft = async () => {
    if (!selectedConversation) return;
    setIsGeneratingAiDraft(true);
    const lastVisitorMsg = [...selectedConversation.messages].reverse().find(m => m.sender === 'visitor');
    try {
      const res = await fetch('/api/visitor-rep-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: lastVisitorMsg ? lastVisitorMsg.content : "General inquiry regarding Stanbax Schools",
          visitorName: selectedConversation.visitorName,
          repName: formName || schoolRepConfig.repName,
          repTitle: formTitle || schoolRepConfig.repTitle,
          repRole: formRole || schoolRepConfig.activeRole,
          chatHistory: selectedConversation.messages.map(m => ({ sender: m.sender, content: m.content }))
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setRepReplyText(data.reply);
        }
      }
    } catch (err) {
      console.warn('AI Draft generation error:', err);
    } finally {
      setIsGeneratingAiDraft(false);
    }
  };

  // 4. Department Reassignment / Hand-off execution
  const handleExecuteTransfer = () => {
    if (!selectedConversation) return;
    let targetName = 'Mrs. Bello';
    let targetTitle = 'School Principal & Head of Administration';
    if (transferRole === 'bursar') {
      targetName = 'Mr. Olumide Ogunleye';
      targetTitle = 'Chief Bursar & Finance Desk';
    } else if (transferRole === 'admissions') {
      targetName = 'Mrs. Folake Adeyemi';
      targetTitle = 'Director of Admissions & Guidance';
    } else if (transferRole === 'representative') {
      targetName = 'General Campus Desk';
      targetTitle = 'Public Information Representative';
    }

    transferConversationDepartment(
      selectedConversation.visitorId,
      transferRole,
      targetName,
      targetTitle,
      transferReason.trim() || undefined
    );
    setIsTransferModalOpen(false);
    setTransferReason('');
  };

  // 5. WhatsApp Escalation Direct Integration
  const handleEscalateToWhatsApp = () => {
    if (!selectedConversation) return;
    const phone = selectedConversation.visitorPhone || selectedConversation.notificationOptIn?.phone;
    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const magicLink = `${window.location.origin}?chat_ref=${selectedConversation.visitorId}`;
    const text = encodeURIComponent(
      `Hello ${selectedConversation.visitorName}, this is ${formName || schoolRepConfig.repName} from Stanbax Schools Ibadan.\n\n${repReplyText ? `Regarding your inquiry: "${repReplyText}"\n\n` : ''}You can view and resume your live consultation thread here anytime: ${magicLink}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const filteredConversations = visitorConversations.filter(c => 
    c.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Hidden file picker for Rep Attachment */}
      <input 
        ref={repFileInputRef}
        type="file" 
        onChange={handleRepFileSelect} 
        className="hidden" 
        accept="image/*,.pdf,.doc,.docx" 
      />

      {/* 1. Header Banner & Live Availability Toggle */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
              Landing Page Inquiries
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase">
              Current Rep: {schoolRepConfig.activeRole}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            School Representative & Live Visitor Desk
          </h2>
          <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
            Manage inquiries, assign active reps (Principal, Bursar, Admissions), hand-off conversations across departments, and review appointment screening bookings.
          </p>
        </div>

        {/* Real-Time Availability Switch */}
        <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${schoolRepConfig.isAvailable ? 'bg-emerald-400 animate-ping' : 'bg-purple-400'}`} />
              <span>{schoolRepConfig.isAvailable ? 'Representative Online' : 'Representative Away'}</span>
            </div>
            <p className="text-[10px] text-neutral-300">
              {schoolRepConfig.isAvailable ? 'Live Human Replies Active' : 'Calvin AI Auto-Rep Handling'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleRepAvailability(!schoolRepConfig.isAvailable)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-xs ${
              schoolRepConfig.isAvailable
                ? 'bg-amber-400 hover:bg-amber-500 text-neutral-950'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {schoolRepConfig.isAvailable ? 'Switch to Away (Calvin AI)' : 'Set as Online / Available'}
          </button>
        </div>
      </div>

      {/* 2. Representative Assignment Settings Form */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              <span>Assign Representative Receiving Inquiries</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Choose who appears as the active representative on the landing page chat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessNotice && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Saved</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Representative Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Role Presets */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-neutral-600 tracking-wider">
            Quick Representative Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'principal' as const, label: 'School Principal', sub: 'Mrs. Bello' },
              { id: 'bursar' as const, label: 'School Bursar', sub: 'Mr. Olumide Ogunleye' },
              { id: 'admissions' as const, label: 'Admissions Desk', sub: 'Mrs. Folake Adeyemi' },
              { id: 'representative' as const, label: 'General Desk', sub: 'Campus Representative' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleQuickSelect(r.id)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  formRole === r.id
                    ? 'border-blue-700 bg-blue-50/60 shadow-xs ring-1 ring-blue-700'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="font-black text-xs text-neutral-900">{r.label}</div>
                <div className="text-[11px] text-neutral-500">{r.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Representative Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Official Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Assigned Role</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as SchoolRepRole)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="principal">School Principal</option>
              <option value="bursar">Bursar (Fees & Accounts)</option>
              <option value="admissions">Admissions Desk</option>
              <option value="representative">General School Representative</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-neutral-700 text-xs block mb-1">
            Initial Welcome Greeting (Shown to Landing Page Visitors)
          </label>
          <textarea
            rows={2}
            value={formWelcome}
            onChange={(e) => setFormWelcome(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* 3. Live Visitor Inquiries & Reply Workspace */}
      <div className="bg-white rounded-3xl shadow-xs border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-700" />
              <span>Visitor Inquiries & Live Threads ({visitorConversations.length})</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Review visitor queries, transfer across departments, send official replies, and schedule screening appointments.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search visitor query or ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {visitorConversations.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-neutral-300 mx-auto" />
            <h4 className="font-black text-sm text-neutral-700">No Visitor Inquiries Yet</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              When prospective parents, students, or visitors click the chat button on the landing page, their unique threads and inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
            {/* Conversations List */}
            <div className="border-r border-neutral-200 overflow-y-auto max-h-[580px] divide-y divide-neutral-100">
              {filteredConversations.map(conv => {
                const isSelected = selectedConversation?.visitorId === conv.visitorId;
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isConvTyping = !!typingMap[conv.visitorId]?.isVisitorTyping;

                return (
                  <div
                    key={conv.visitorId}
                    onClick={() => {
                      setSelectedVisitorId(conv.visitorId);
                      markVisitorConversationRead(conv.visitorId);
                      markConversationSeenByAdmin(conv.visitorId);
                    }}
                    className={`p-3.5 transition cursor-pointer hover:bg-neutral-50 ${
                      isSelected ? 'bg-blue-50/70 border-l-4 border-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-black text-xs text-neutral-900 truncate">
                        {conv.visitorName}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isConvTyping && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                            <span>Typing...</span>
                          </span>
                        )}
                        {conv.unreadByAdmin && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" title="New Message" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {lastMsg ? `${lastMsg.sender === 'visitor' ? 'Visitor: ' : 'Rep: '}${cleanText(lastMsg.content)}` : 'No messages'}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 font-mono">
                      <span>{new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-1">
                        {conv.assignedRole && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 text-[9px] font-bold uppercase">
                            {conv.assignedRole}
                          </span>
                        )}
                        <span className="capitalize">{conv.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conversation Active Thread View & Reply */}
            <div className="md:col-span-2 flex flex-col h-[580px] bg-neutral-50/40">
              {selectedConversation ? (
                <>
                  {/* Thread Header with Department Transfer & WhatsApp Escalation */}
                  <div className="p-3.5 bg-white border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-neutral-900">
                          {selectedConversation.visitorName}
                        </h4>
                        {selectedConversation.assignedRole && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-[10px] uppercase">
                            Desk: {selectedConversation.assignedRole}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 font-mono">
                        ID: {selectedConversation.visitorId} • Started: {new Date(selectedConversation.createdAt).toLocaleDateString()}
                        {selectedConversation.visitorPhone && ` • Phone: ${selectedConversation.visitorPhone}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Department Transfer Button */}
                      <button
                        type="button"
                        onClick={() => setIsTransferModalOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer border border-indigo-200"
                        title="Reassign inquiry to another representative desk"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Transfer Desk</span>
                      </button>

                      {/* WhatsApp Escalation Button */}
                      {(selectedConversation.visitorPhone || selectedConversation.notificationOptIn?.phone) && (
                        <button
                          type="button"
                          onClick={handleEscalateToWhatsApp}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer border border-emerald-200"
                          title="Open WhatsApp chat with this visitor"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                        {selectedConversation.messages.length} Messages
                      </span>
                    </div>
                  </div>

                  {/* Confirmed Screening Appointments Banner */}
                  {selectedConversation.appointments && selectedConversation.appointments.length > 0 && (
                    <div className="p-2.5 bg-emerald-50/90 border-b border-emerald-200 flex items-center justify-between text-xs shrink-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="font-extrabold text-emerald-950 text-[11px]">
                          Booked: {selectedConversation.appointments[0].type} ({selectedConversation.appointments[0].candidateName}) on {selectedConversation.appointments[0].date} at {selectedConversation.appointments[0].timeSlot}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] uppercase">
                        Confirmed Slot
                      </span>
                    </div>
                  )}

                  {/* Messages Bubble Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedConversation.messages.map(m => {
                      const isVisitor = m.sender === 'visitor';
                      const isAi = m.sender === 'calvin_ai';
                      const isSeenByAdmin = m.status === 'seen' || (selectedConversation.lastSeenByAdminAt && new Date(selectedConversation.lastSeenByAdminAt).getTime() >= new Date(m.timestamp).getTime());
                      const isSeenByVisitor = m.status === 'seen' || (selectedConversation.lastSeenByVisitorAt && new Date(selectedConversation.lastSeenByVisitorAt).getTime() >= new Date(m.timestamp).getTime());

                      // Department Transfer notice
                      if (m.isTransferNotice) {
                        return (
                          <div key={m.id} className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-black text-[11px] text-indigo-900">
                              <RotateCcw className="w-3.5 h-3.5 text-indigo-700" />
                              <span>Department Reassigned</span>
                            </div>
                            <p className="text-[11px] text-indigo-800 leading-relaxed">{m.content}</p>
                            <span className="text-[9px] text-indigo-500 font-mono block text-right">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      }

                      // Appointment notice
                      if (m.isAppointmentNotice && m.appointmentData) {
                        const apt = m.appointmentData;
                        return (
                          <div key={m.id} className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs space-y-1.5">
                            <div className="flex items-center justify-between border-b border-emerald-200 pb-1">
                              <span className="font-black text-xs text-emerald-900 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Screening Pass Created</span>
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] uppercase">
                                Synced to Calendar
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[11px]">
                              <div><b>Candidate:</b> {apt.candidateName}</div>
                              <div><b>Grade:</b> {apt.gradeApplying || 'General'}</div>
                              <div><b>Date:</b> {apt.date}</div>
                              <div><b>Slot:</b> {apt.timeSlot}</div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          className={`flex ${isVisitor ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-2xs ${
                              isVisitor
                                ? 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs'
                                : isAi
                                ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tr-xs'
                                : 'bg-blue-700 text-white rounded-tr-xs'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-black text-[10px] opacity-80">
                              <span>{m.senderName}</span>
                              {isAi && <span className="text-[9px] uppercase px-1 rounded bg-purple-200 text-purple-900">Calvin AI</span>}
                              {!isVisitor && !isAi && <span className="text-[9px] uppercase px-1 rounded bg-blue-900 text-amber-300">Live Rep</span>}
                            </div>

                            {/* Audio Voice Note Player in admin view */}
                            {m.attachmentType === 'audio' && m.attachmentUrl && (
                              <div className="my-1.5 p-2 rounded-xl bg-neutral-900/10 flex items-center gap-2">
                                <audio controls src={m.attachmentUrl} className="h-7 w-48" />
                                {m.audioDuration && (
                                  <span className="text-[10px] font-mono font-bold">{m.audioDuration}s</span>
                                )}
                              </div>
                            )}

                            {/* Image Attachment Preview in admin view */}
                            {m.attachmentType === 'image' && m.attachmentUrl && (
                              <div 
                                className="my-1.5 overflow-hidden rounded-xl border border-neutral-300 cursor-pointer max-w-[200px]"
                                onClick={() => setPreviewMediaUrl(m.attachmentUrl!)}
                              >
                                <img src={m.attachmentUrl} alt="Visitor Attachment" className="w-full h-28 object-cover hover:scale-105 transition" />
                              </div>
                            )}

                            {/* Document Attachment Preview */}
                            {m.attachmentType === 'document' && m.attachmentUrl && (
                              <a 
                                href={m.attachmentUrl} 
                                download={m.attachmentName || 'document'} 
                                className="my-1.5 p-2 rounded-xl bg-neutral-100 flex items-center gap-2 text-[11px] font-bold text-blue-700 hover:underline block"
                              >
                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                <span className="truncate max-w-[150px]">{m.attachmentName || 'Document.pdf'}</span>
                              </a>
                            )}

                            <div className="whitespace-pre-wrap">{cleanText(m.content)}</div>
                            
                            {/* Delivery & Seen Status Badges */}
                            {isVisitor ? (
                              <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono pt-1 border-t border-neutral-100">
                                <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isSeenByAdmin ? 'Acknowledged by Desk' : 'Delivered'}</span>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-[9px] opacity-85 pt-1 font-mono">
                                <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="flex items-center gap-1 font-bold">
                                  {isSeenByVisitor ? (
                                    <span className="text-emerald-300 flex items-center gap-0.5">
                                      <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                                      <span>Seen by Visitor</span>
                                    </span>
                                  ) : (
                                    <span className="text-blue-200 flex items-center gap-0.5">
                                      <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                                      <span>Delivered</span>
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-time Visitor Typing Indicator */}
                  {selectedConversation && typingMap[selectedConversation.visitorId]?.isVisitorTyping && (
                    <div className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200 text-amber-950 text-xs flex items-center justify-between animate-pulse shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <span className="font-extrabold text-[11px]">
                          {selectedConversation.visitorName} is currently crafting an inquiry...
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-bold font-mono uppercase tracking-wider">
                        Visitor Live
                      </span>
                    </div>
                  )}

                  {/* Rep Pending Attachment Preview */}
                  {repPendingAttachment && (
                    <div className="px-4 py-1.5 bg-blue-50 border-t border-blue-200 flex items-center justify-between text-xs shrink-0">
                      <div className="flex items-center gap-2">
                        {repPendingAttachment.type === 'image' ? <ImageIcon className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
                        <span className="font-bold text-neutral-800 text-[11px] truncate">{repPendingAttachment.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRepPendingAttachment(null)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Quick-reply Canned Responses Bar & Calvin AI Draft Assistant */}
                  <div className="p-2.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleGenerateAiDraft}
                        disabled={isGeneratingAiDraft}
                        className="px-2.5 py-1 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer border border-purple-300 disabled:opacity-50 whitespace-nowrap"
                        title="Draft tailored answer using Calvin AI based on school handbook"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-purple-600 ${isGeneratingAiDraft ? 'animate-spin' : ''}`} />
                        <span>{isGeneratingAiDraft ? 'Drafting...' : 'Calvin AI Smart Draft'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCannedModal(true)}
                        className="px-2.5 py-1 rounded-xl bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800 font-extrabold text-[11px] flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                      >
                        <FileText className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Quick Responses ({CANNED_RESPONSES.length})</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {CANNED_RESPONSES.slice(0, 2).map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRepReplyText(c.text)}
                          className="px-2 py-0.5 rounded-lg bg-white hover:bg-blue-50 border border-neutral-200 text-[10px] font-bold text-neutral-700 whitespace-nowrap transition cursor-pointer"
                          title={c.text}
                        >
                          {c.title.split(' ')[0]}...
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Representative Reply Input */}
                  <form
                    onSubmit={handleSendRepReply}
                    className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2 shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => repFileInputRef.current?.click()}
                      className="p-2.5 rounded-xl text-neutral-500 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                      title="Attach brochure, admission prospectus, or document"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={repReplyText}
                      onChange={(e) => handleRepInputChange(e.target.value)}
                      placeholder={`Reply to ${selectedConversation.visitorName} as ${formName || schoolRepConfig.repName}...`}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={!repReplyText.trim() && !repPendingAttachment}
                      className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs transition cursor-pointer shadow-md disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Official Reply</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-neutral-400 text-xs">
                  Select a visitor conversation on the left to read and reply.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DEPARTMENT HAND-OFF & DESK REASSIGNMENT                          */}
      {/* ========================================================================= */}
      {isTransferModalOpen && selectedConversation && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-black text-base text-neutral-900 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-indigo-700" />
                  <span>Transfer Inquiry Desk</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Reassign {selectedConversation.visitorName} to the designated school representative.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Target Department / Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'principal' as const, label: 'Principal', name: 'Mrs. Bello' },
                    { id: 'bursar' as const, label: 'Bursar Desk', name: 'Mr. Ogunleye' },
                    { id: 'admissions' as const, label: 'Admissions Desk', name: 'Mrs. Adeyemi' },
                    { id: 'representative' as const, label: 'General Desk', name: 'Campus Desk' },
                  ].map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setTransferRole(d.id)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        transferRole === d.id
                          ? 'border-indigo-700 bg-indigo-50/70 font-black text-indigo-950 shadow-xs'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <div className="font-black">{d.label}</div>
                      <div className="text-[11px] text-neutral-500">{d.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Transfer Note / Reason (Preserved in thread)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Transferred to Bursary for tuition installment calculation."
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 font-bold text-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black cursor-pointer shadow-md"
                >
                  Confirm Hand-Off
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CANNED RESPONSES PICKER                                          */}
      {/* ========================================================================= */}
      {showCannedModal && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-black text-base text-neutral-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-700" />
                  <span>Standard Canned Responses</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Select a template to paste into your official reply.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCannedModal(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {CANNED_RESPONSES.map((c, i) => (
                <div 
                  key={i}
                  className="p-3.5 rounded-2xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/40 transition cursor-pointer space-y-1.5"
                  onClick={() => {
                    setRepReplyText(c.text);
                    setShowCannedModal(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-neutral-900">{c.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                      {c.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed line-clamp-3">
                    {c.text}
                  </p>
                  <div className="text-[10px] text-blue-700 font-extrabold text-right">
                    Click to Insert →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: MEDIA PREVIEW ZOOM                                               */}
      {/* ========================================================================= */}
      {previewMediaUrl && (
        <div 
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewMediaUrl(null)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              type="button"
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewMediaUrl} alt="Preview" className="rounded-2xl max-h-[80vh] max-w-[85vw] object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
