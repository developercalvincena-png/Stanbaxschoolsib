import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { LessonNote, NoteFormat } from '../../../types';
import { 
  BookOpen, 
  Download, 
  FileText, 
  File, 
  Image as ImageIcon, 
  Search, 
  Eye, 
  X, 
  Lock, 
  CheckCircle2, 
  Filter, 
  Clock, 
  User, 
  ExternalLink,
  GraduationCap
} from '../../RealIcons';

export const StudentLessonNotesTab: React.FC = () => {
  const { 
    lessonNotes, 
    notesFeatureEnabled, 
    incrementNoteDownload,
    student,
    schoolInfo,
    assessmentConfig
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'text' | 'pdf' | 'docx' | 'image'>('all');
  const [activePreviewNote, setActivePreviewNote] = useState<LessonNote | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const activeTerm = schoolInfo.activeTerm || '2nd Term (Lent Term)';

  // Filter notes
  const filteredNotes = lessonNotes.filter(note => {
    // If feature disabled, we don't display
    if (!notesFeatureEnabled) return false;

    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const matchesFormat = selectedFormat === 'all' || note.format === selectedFormat;

    return matchesSearch && matchesSubject && matchesFormat;
  });

  const availableSubjects = Array.from(new Set(lessonNotes.map(n => n.subject))).sort();

  const handleDownloadNote = (note: LessonNote) => {
    incrementNoteDownload(note.id);

    if (note.attachment?.dataUrl) {
      const link = document.createElement('a');
      link.href = note.attachment.dataUrl;
      const ext = note.format === 'image' ? 'png' : note.format === 'docx' ? 'docx' : note.format === 'pdf' ? 'pdf' : 'txt';
      link.download = note.attachment.name || `${note.title.replace(/\s+/g, '_')}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Text file download
      const textBlob = new Blob([
        `STANBAX SCHOOLS, IBADAN - OFFICIAL SCHOLAR STUDY MATERIAL\n` +
        `=======================================================\n` +
        `Title: ${note.title}\n` +
        `Subject: ${note.subject}\n` +
        `Target Class: ${note.targetClass}\n` +
        `Prepared By: ${note.authorName} (${note.authorRole || 'Faculty'})\n` +
        `Term: ${note.term} | Session: ${note.session}\n` +
        `Date: ${note.datePublished}\n` +
        `=======================================================\n\n` +
        `LECTURE NOTES & STUDY GUIDE:\n\n` +
        `${note.content}\n\n` +
        `=======================================================\n` +
        `Issued by Stanbax Schools Academic Directorate\n`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(textBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${note.subject}_${note.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setDownloadNotice(`Downloaded: "${note.title}". File saved to your downloads.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const getFormatDetails = (format: NoteFormat) => {
    switch (format) {
      case 'pdf':
        return {
          icon: File,
          label: 'PDF Document',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          iconColor: 'text-rose-600',
          cardBorder: 'border-rose-100 hover:border-rose-300'
        };
      case 'docx':
        return {
          icon: FileText,
          label: 'Word Document',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          cardBorder: 'border-blue-100 hover:border-blue-300'
        };
      case 'image':
        return {
          icon: ImageIcon,
          label: 'Diagram / Image',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
          iconColor: 'text-purple-600',
          cardBorder: 'border-purple-100 hover:border-purple-300'
        };
      default:
        return {
          icon: BookOpen,
          label: 'Text Lecture Guide',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          iconColor: 'text-emerald-600',
          cardBorder: 'border-emerald-100 hover:border-emerald-300'
        };
    }
  };

  // If feature is disabled by school admin
  if (!notesFeatureEnabled) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-xs border border-slate-200 max-w-2xl mx-auto space-y-4 animate-fade-in" id="student-notes-disabled-panel">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            Notice from Academic Directorate
          </span>
          <h3 className="text-xl font-black text-slate-900">
            Lesson Notes Portal Currently Paused
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            The distribution of electronic study notes and lecture materials is currently suspended by the School Administration for the ongoing revision and terminal assessment cycle.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md mx-auto">
          Please refer to your physical classroom notebooks, textbooks, and past assessment corrections. This portal will reopen for next term’s syllabus.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="student-lesson-notes-view">
      {/* Toast Notification */}
      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{downloadNotice}</span>
          </div>
          <button 
            onClick={() => setDownloadNotice(null)}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Library & Study Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Official Teacher Lesson Notes & Lecture Materials
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Access and download verified notes, syllabus summaries, and diagrammatic aids uploaded directly by your subject tutors. You can read them right in your browser or save them to your device for offline study.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Available Notes</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">{lessonNotes.length}</span>
            <span className="text-[11px] text-blue-200 block mt-0.5">{student.grade} • {activeTerm}</span>
          </div>
        </div>
      </div>

      {/* Search & Filtering Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by topic, teacher, formula..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              id="input-student-search-notes"
            />
          </div>

          {/* Subject & Format Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
              id="select-student-filter-subject"
            >
              <option value="all">All Academic Subjects</option>
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Format Filter Chips */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['all', 'text', 'pdf', 'docx', 'image'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                    selectedFormat === fmt 
                      ? 'bg-blue-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {fmt === 'all' ? 'All' : fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Notes Cards Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="text-sm font-bold text-slate-700">No Lesson Notes Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No notes match your current search criteria. Try selecting "All Subjects" or clearing your search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes.map((note) => {
            const formatInfo = getFormatDetails(note.format);
            const FormatIcon = formatInfo.icon;

            return (
              <div
                key={note.id}
                className={`bg-white rounded-3xl p-5 shadow-xs border transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 ${formatInfo.cardBorder}`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${formatInfo.badgeClass}`}>
                      <FormatIcon className={`w-3 h-3 ${formatInfo.iconColor}`} />
                      <span>{formatInfo.label}</span>
                    </span>

                    <span className="text-[11px] font-extrabold text-blue-900">
                      {note.subject}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  {/* Attachment metadata badge if present */}
                  {note.attachment && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-600">
                      <FormatIcon className={`w-4 h-4 shrink-0 ${formatInfo.iconColor}`} />
                      <span className="font-semibold truncate">{note.attachment.name}</span>
                      <span className="text-slate-400 shrink-0">({note.attachment.fileSize})</span>
                    </div>
                  )}
                </div>

                {/* Footer details & Action buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1 text-slate-600 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{note.authorName}</span>
                    </div>
                    <span className="shrink-0">{note.datePublished}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Read Online */}
                    <button
                      type="button"
                      onClick={() => setActivePreviewNote(note)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Read Online</span>
                    </button>

                    {/* Download */}
                    <button
                      type="button"
                      onClick={() => handleDownloadNote(note)}
                      className="w-full py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Online Lecture Reading Modal */}
      {activePreviewNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 space-y-5 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-900 uppercase">{activePreviewNote.subject}</span>
                  <span className="text-xs text-slate-400">• {activePreviewNote.targetClass}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {activePreviewNote.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Author: {activePreviewNote.authorName} ({activePreviewNote.authorRole || 'Faculty'}) • {activePreviewNote.datePublished}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePreviewNote(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Attachment / Diagram Preview */}
            {activePreviewNote.format === 'image' && activePreviewNote.attachment?.dataUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-2 text-center">
                <img 
                  src={activePreviewNote.attachment.dataUrl} 
                  alt={activePreviewNote.title} 
                  className="max-h-80 mx-auto rounded-lg object-contain"
                />
              </div>
            )}

            {/* Content Body */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-mono max-h-72 overflow-y-auto leading-relaxed">
              {activePreviewNote.content}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Term: <strong>{activePreviewNote.term}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewNote(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadNote(activePreviewNote);
                    setActivePreviewNote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs cursor-pointer transition flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
