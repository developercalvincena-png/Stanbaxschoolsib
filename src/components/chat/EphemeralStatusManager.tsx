import React, { useState, useEffect, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { UserEphemeralStatus } from '../../types';
import { 
  Plus, 
  X, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  Image as ImageIcon,
  Camera,
  Play,
  Pause
} from 'lucide-react';

interface EphemeralStatusManagerProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: 'student' | 'parent' | 'tutor' | 'admin' | 'headmistress' | 'moderator';
  currentUserSubtext?: string;
  currentUserBadge?: string;
}

const GRADIENT_PRESETS = [
  { id: 'emerald', label: 'Emerald Study', class: 'from-emerald-800 via-teal-900 to-slate-950' },
  { id: 'indigo', label: 'Royal Indigo', class: 'from-indigo-900 via-purple-900 to-slate-950' },
  { id: 'amber', label: 'Sunset Amber', class: 'from-amber-800 via-orange-900 to-neutral-950' },
  { id: 'rose', label: 'Crimson Rose', class: 'from-rose-900 via-pink-900 to-neutral-950' },
  { id: 'slate', label: 'Midnight Blue', class: 'from-slate-900 via-blue-950 to-neutral-950' },
  { id: 'violet', label: 'Deep Violet', class: 'from-purple-900 via-indigo-950 to-neutral-950' }
];

export const EphemeralStatusManager: React.FC<EphemeralStatusManagerProps> = ({
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserSubtext,
  currentUserBadge
}) => {
  const { 
    ephemeralStatuses, 
    postEphemeralStatus, 
    deleteEphemeralStatus, 
    markEphemeralStatusViewed,
    students,
    tutors,
    parents
  } = useSchool();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeViewingStatusIndex, setActiveViewingStatusIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showViewersSheet, setShowViewersSheet] = useState(false);

  // Status Creation Form
  const [statusText, setStatusText] = useState('');
  const [statusMediaUrl, setStatusMediaUrl] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].class);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group active statuses
  const myStatuses = ephemeralStatuses.filter(s => s.userId === currentUserId);
  const otherStatuses = ephemeralStatuses.filter(s => s.userId !== currentUserId);

  // Flattened ordered list for viewer navigation: my statuses first, then others
  const allOrderedStatuses = [...myStatuses, ...otherStatuses];

  // Helper to format remaining hours & minutes from expiresAt
  const formatTimeRemaining = (expiresAtStr: string) => {
    try {
      const diffMs = new Date(expiresAtStr).getTime() - Date.now();
      if (diffMs <= 0) return 'Expired';
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) return `${hours}h ${mins}m left`;
      return `${mins}m left`;
    } catch {
      return '16h status';
    }
  };

  // Helper to get user display name for viewers
  const getViewerName = (viewerId: string): string => {
    if (viewerId === currentUserId) return `${currentUserName} (You)`;
    const s = students.find(item => item.id === viewerId);
    if (s) return `${s.name} (${s.grade})`;
    const t = tutors.find(item => item.id === viewerId);
    if (t) return `${t.name} (Tutor)`;
    const p = parents.find(item => item.id === viewerId);
    if (p) return `${p.fullName} (Parent)`;
    if (viewerId === 'admin-1') return 'Principal Administrator';
    return viewerId;
  };

  // Automatically mark status viewed when opening
  useEffect(() => {
    if (activeViewingStatusIndex !== null && allOrderedStatuses[activeViewingStatusIndex]) {
      const currentStatus = allOrderedStatuses[activeViewingStatusIndex];
      if (currentStatus.userId !== currentUserId) {
        markEphemeralStatusViewed(currentStatus.id, currentUserId, currentUserName, currentUserRole);
      }
      setProgress(0);
      setShowViewersSheet(false);
    }
  }, [activeViewingStatusIndex]);

  // Story progress auto-advance timer (5.5 seconds per status)
  useEffect(() => {
    if (activeViewingStatusIndex === null || isPaused) return;

    const interval = 50; // update every 50ms
    const step = 100 / (5500 / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + step >= 100) {
          // Go to next status or close if at end
          if (activeViewingStatusIndex < allOrderedStatuses.length - 1) {
            setActiveViewingStatusIndex(activeViewingStatusIndex + 1);
            return 0;
          } else {
            setActiveViewingStatusIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeViewingStatusIndex, isPaused, allOrderedStatuses.length]);

  const handleCreateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusText.trim() && !statusMediaUrl) return;

    postEphemeralStatus({
      userId: currentUserId,
      userName: currentUserName,
      userRole: currentUserRole,
      userGradeOrTitle: currentUserSubtext || (
        currentUserRole === 'student' ? 'Scholar' :
        currentUserRole === 'tutor' ? 'Faculty Educator' :
        currentUserRole === 'parent' ? 'Guardian' : 'Principal Administrator'
      ),
      userBadge: currentUserBadge,
      text: statusText.trim(),
      mediaUrl: statusMediaUrl.trim() || undefined,
      backgroundColor: selectedGradient
    });

    setStatusText('');
    setStatusMediaUrl('');
    setShowCreateModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStatusMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentViewedStatus = activeViewingStatusIndex !== null 
    ? allOrderedStatuses[activeViewingStatusIndex] 
    : null;

  return (
    <div className="border-b border-neutral-200 bg-white/95 px-4 py-3 select-none">
      {/* Top Status Story Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        
        {/* "My Status" Bubble */}
        <div className="flex flex-col items-center shrink-0 w-16">
          <div className="relative group cursor-pointer">
            <button
              type="button"
              onClick={() => {
                if (myStatuses.length > 0) {
                  // View own status
                  setActiveViewingStatusIndex(0);
                } else {
                  setShowCreateModal(true);
                }
              }}
              className={`w-12 h-12 rounded-full p-0.5 transition active:scale-95 flex items-center justify-center ${
                myStatuses.length > 0
                  ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 shadow-xs'
                  : 'border-2 border-dashed border-neutral-300 hover:border-indigo-400'
              }`}
              title={myStatuses.length > 0 ? "View your 16-hour status" : "Create new 16-hour status"}
            >
              <div className="w-full h-full rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-sm">
                {currentUserName.charAt(0)}
              </div>
            </button>

            {/* Plus badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateModal(true);
              }}
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer"
              title="Add 16-hour status update"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>
          <span className="text-[10px] font-bold text-neutral-700 truncate w-full text-center mt-1">
            {myStatuses.length > 0 ? 'My Status' : 'Add Status'}
          </span>
          {myStatuses.length > 0 && (
            <span className="text-[9px] font-extrabold text-emerald-600">
              {formatTimeRemaining(myStatuses[0].expiresAt)}
            </span>
          )}
        </div>

        {/* Divider */}
        {otherStatuses.length > 0 && (
          <div className="h-10 w-[1px] bg-neutral-200 shrink-0 mx-1" />
        )}

        {/* Other Users' Active Statuses */}
        {otherStatuses.map((status) => {
          const isViewed = status.views?.includes(currentUserId);
          const indexInAll = allOrderedStatuses.findIndex(s => s.id === status.id);

          return (
            <button
              key={status.id}
              type="button"
              onClick={() => setActiveViewingStatusIndex(indexInAll)}
              className="flex flex-col items-center shrink-0 w-16 group cursor-pointer focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-full p-0.5 transition transform group-hover:scale-105 active:scale-95 flex items-center justify-center ${
                isViewed
                  ? 'border-2 border-neutral-300'
                  : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-600 shadow-xs ring-1 ring-emerald-200'
              }`}>
                <div className={`w-full h-full rounded-full flex items-center justify-center font-black text-xs ${
                  status.userRole === 'admin' ? 'bg-neutral-900 text-white' :
                  status.userRole === 'tutor' ? 'bg-blue-900 text-amber-300' :
                  'bg-indigo-700 text-white'
                }`}>
                  {status.userName.charAt(0)}
                </div>
              </div>

              <span className="text-[10px] font-bold text-neutral-800 truncate w-full text-center mt-1">
                {status.userName.split(' ')[0]}
              </span>

              <span className="text-[9px] font-semibold text-neutral-400">
                {formatTimeRemaining(status.expiresAt)}
              </span>
            </button>
          );
        })}

        {/* Quick helper badge on the far right */}
        <div className="ml-auto pl-2 flex items-center gap-1.5 shrink-0 text-xs text-neutral-400">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px] font-semibold hidden sm:inline">
            Statuses auto-expire in 16 hrs
          </span>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: WHATSAPP-STYLE FULL STATUS VIEWER                                 */}
      {/* ========================================================================= */}
      {currentViewedStatus && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
          onClick={() => setActiveViewingStatusIndex(null)}
        >
          <div 
            className="relative w-full max-w-md h-[90vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Top Multi-Segment Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex gap-1.5 items-center mb-2">
                {allOrderedStatuses.map((st, idx) => {
                  let fillPercent = 0;
                  if (idx < (activeViewingStatusIndex || 0)) fillPercent = 100;
                  else if (idx === activeViewingStatusIndex) fillPercent = progress;

                  return (
                    <div key={st.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-75"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Status Header Meta */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-black text-sm shrink-0">
                    {currentViewedStatus.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-sm truncate">{currentViewedStatus.userName}</h4>
                      {currentViewedStatus.userBadge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-neutral-950 shadow-xs">
                          {currentViewedStatus.userBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/70 truncate flex items-center gap-1.5">
                      <span>{currentViewedStatus.userGradeOrTitle || 'Scholar'}</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-bold">
                        {formatTimeRemaining(currentViewedStatus.expiresAt)} (16h ephemeral)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
                    title={isPaused ? "Resume" : "Pause"}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveViewingStatusIndex(null)}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Center Content: Styled Gradient Background or Photo */}
            <div className={`flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br ${
              currentViewedStatus.backgroundColor || 'from-indigo-900 to-purple-950'
            } text-white relative overflow-hidden`}>
              
              {/* Media image if present */}
              {currentViewedStatus.mediaUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <img 
                    src={currentViewedStatus.mediaUrl} 
                    alt="Status media" 
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                </div>
              )}

              {/* Status Message Text */}
              <div className="relative z-10 max-w-sm text-center space-y-4">
                <p className="text-lg sm:text-xl font-bold leading-relaxed tracking-wide drop-shadow-md whitespace-pre-wrap">
                  {currentViewedStatus.text}
                </p>
              </div>

              {/* Navigation click zones (left & right sides) */}
              <button
                type="button"
                onClick={() => {
                  if (activeViewingStatusIndex !== null && activeViewingStatusIndex > 0) {
                    setActiveViewingStatusIndex(activeViewingStatusIndex - 1);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition z-20 cursor-pointer disabled:opacity-0"
                disabled={activeViewingStatusIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeViewingStatusIndex !== null && activeViewingStatusIndex < allOrderedStatuses.length - 1) {
                    setActiveViewingStatusIndex(activeViewingStatusIndex + 1);
                  } else {
                    setActiveViewingStatusIndex(null);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition z-20 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Controls / Viewers Tray */}
            <div className="p-4 bg-black/90 border-t border-white/10 flex items-center justify-between text-white text-xs z-30">
              {currentViewedStatus.userId === currentUserId || currentUserRole === 'admin' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowViewersSheet(!showViewersSheet)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer font-bold text-emerald-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Viewed by {currentViewedStatus.views?.length || 0} scholars</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete this status update from the database?')) {
                        deleteEphemeralStatus(currentViewedStatus.id);
                        setActiveViewingStatusIndex(null);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white transition cursor-pointer"
                    title="Delete status"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full text-white/70 text-xs">
                  <span>16-Hour Ephemeral Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimeRemaining(currentViewedStatus.expiresAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Expandable Viewers List Sheet */}
            {showViewersSheet && currentViewedStatus.userId === currentUserId && (
              <div className="absolute inset-x-0 bottom-0 z-40 bg-neutral-900 border-t border-white/20 p-5 rounded-t-3xl text-white max-h-64 overflow-y-auto animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h5 className="font-extrabold text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Status Views ({currentViewedStatus.views?.length || 0})</span>
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowViewersSheet(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-white/10 pt-2">
                  {(!currentViewedStatus.views || currentViewedStatus.views.length === 0) ? (
                    <p className="text-xs text-neutral-400 py-4 text-center">No views yet. Classmates will see your update in their status bar!</p>
                  ) : currentViewedStatus.viewRecords && currentViewedStatus.viewRecords.length > 0 ? (
                    currentViewedStatus.viewRecords.map((record, rIdx) => {
                      const timeStr = new Date(record.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <div key={rIdx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                              {record.userName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-neutral-100 block">{record.userName}</span>
                              <span className="text-[10px] text-neutral-400 capitalize">{record.userRole}</span>
                            </div>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-semibold">{timeStr}</span>
                        </div>
                      );
                    })
                  ) : (
                    currentViewedStatus.views.map((viewerId, vIdx) => (
                      <div key={vIdx} className="py-2.5 flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-200">{getViewerName(viewerId)}</span>
                        <span className="text-[10px] text-neutral-500 font-medium">Viewed</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: COMPOSE NEW 16-HOUR EPHEMERAL STATUS                              */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-950 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">Create 16-Hour Status</h4>
                  <p className="text-xs text-emerald-200">
                    Disappears automatically from the database in 16 hours (WhatsApp style)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStatus} className="p-6 space-y-4">
              {/* Preview Box */}
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedGradient} text-white min-h-[140px] flex items-center justify-center text-center relative overflow-hidden shadow-inner`}>
                {statusMediaUrl && (
                  <div className="absolute inset-0 bg-black/50">
                    <img src={statusMediaUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  </div>
                )}
                <p className="relative z-10 font-bold text-sm sm:text-base leading-relaxed whitespace-pre-wrap max-w-xs drop-shadow-sm">
                  {statusText.trim() || 'Type your status update, thought, or announcement below...'}
                </p>
              </div>

              {/* Status Text Input */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Status Message / Caption <span className="text-[11px] font-semibold text-neutral-500">(Required)</span>
                </label>
                <textarea
                  rows={3}
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="Share a study update, club notice, or thought with your school community..."
                  className="w-full p-3 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  maxLength={280}
                  required={!statusMediaUrl}
                />
                <span className="text-[10px] text-neutral-400 block text-right">
                  {statusText.length}/280 characters
                </span>
              </div>

              {/* Background Style Presets */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Card Theme Gradient
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {GRADIENT_PRESETS.map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      onClick={() => setSelectedGradient(grad.class)}
                      className={`h-9 rounded-xl bg-gradient-to-r ${grad.class} border-2 transition cursor-pointer flex items-center justify-center ${
                        selectedGradient === grad.class ? 'border-emerald-500 scale-105 shadow-sm' : 'border-transparent'
                      }`}
                      title={grad.label}
                    />
                  ))}
                </div>
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Optional Photo Attachment (URL or Local Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={statusMediaUrl}
                    onChange={(e) => setStatusMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                  {statusMediaUrl && (
                    <button
                      type="button"
                      onClick={() => setStatusMediaUrl('')}
                      className="px-2 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold cursor-pointer"
                      title="Clear photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* WhatsApp Guarantee Note */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>16-Hour Ephemeral Guarantee:</strong> Your status will be visible to classmates and teachers across the School Community Hub and will completely purge from the database after 16 hours.
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!statusText.trim() && !statusMediaUrl}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer shadow-md"
                >
                  Post Status (16 Hours)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
