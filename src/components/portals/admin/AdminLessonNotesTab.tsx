import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { LessonNote } from '../../../types';
import { 
  BookOpen, 
  Download, 
  Trash2, 
  FileText, 
  File, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Archive, 
  Eye, 
  X, 
  Filter, 
  Layers, 
  Info,
  Calendar,
  Users
} from '../../RealIcons';

export const AdminLessonNotesTab: React.FC = () => {
  const { 
    lessonNotes, 
    notesFeatureEnabled, 
    toggleNotesFeature, 
    deleteLessonNote, 
    deleteTermNotes, 
    exportNotesZip, 
    incrementNoteDownload,
    schoolInfo,
    assessmentConfig
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'text' | 'pdf' | 'docx' | 'image'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [previewNote, setPreviewNote] = useState<LessonNote | null>(null);

  const activeTerm = schoolInfo.activeTerm || '2nd Term (Lent Term)';
  const activeSession = assessmentConfig.activeSession || '2025/2026 Academic Session';

  // Notes matching the active term
  const activeTermNotes = lessonNotes.filter(n => 
    n.term.toLowerCase().includes(activeTerm.toLowerCase()) || activeTerm.toLowerCase().includes(n.term.toLowerCase())
  );

  const totalDownloads = lessonNotes.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);

  // Filtered list
  const filteredNotes = lessonNotes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.targetClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const matchesFormat = selectedFormat === 'all' || note.format === selectedFormat;

    return matchesSearch && matchesSubject && matchesFormat;
  });

  // Unique subjects for filter
  const uniqueSubjects = Array.from(new Set(lessonNotes.map(n => n.subject))).sort();

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleToggle = () => {
    toggleNotesFeature();
    const nextState = !notesFeatureEnabled;
    showToast(
      nextState ? 'success' : 'info', 
      `Lesson Notes distribution module has been ${nextState ? 'ACTIVATED' : 'DEACTIVATED'} for scholars and tutors.`
    );
  };

  const handleExportZip = async () => {
    if (lessonNotes.length === 0) {
      showToast('error', 'No lesson notes are currently available in the database to export.');
      return;
    }

    try {
      setIsExporting(true);
      const res = await exportNotesZip(activeTerm, activeSession);
      showToast('success', `Successfully generated and downloaded ${res.filename} containing ${res.count} lesson notes and materials!`);
    } catch (err) {
      console.error(err);
      showToast('error', 'An error occurred while creating the ZIP archive.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleConfirmPurge = () => {
    const deletedCount = deleteTermNotes(activeTerm, activeSession);
    setShowPurgeModal(false);
    showToast('success', `Database cleanup complete: Removed ${deletedCount} notes published during ${activeTerm}.`);
  };

  const handleSingleDownload = (note: LessonNote) => {
    incrementNoteDownload(note.id);

    if (note.attachment?.dataUrl) {
      const link = document.createElement('a');
      link.href = note.attachment.dataUrl;
      link.download = note.attachment.name || `${note.title.replace(/\s+/g, '_')}.${note.format === 'image' ? 'png' : note.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create text blob
      const textBlob = new Blob([
        `STANBAX SCHOOLS, IBADAN - OFFICIAL STUDY MATERIAL\n` +
        `Title: ${note.title}\n` +
        `Subject: ${note.subject}\n` +
        `Class: ${note.targetClass}\n` +
        `Tutor: ${note.authorName} (${note.authorRole || 'Faculty'})\n` +
        `Term: ${note.term} | Session: ${note.session}\n` +
        `Date: ${note.datePublished}\n\n` +
        `=======================================================\n` +
        `LESSON CONTENT & LECTURE OUTLINE\n` +
        `=======================================================\n\n` +
        `${note.content}`
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
    showToast('info', `Downloaded: ${note.title}`);
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'pdf':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
            <File className="w-3 h-3 text-rose-600" /> PDF Document
          </span>
        );
      case 'docx':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
            <FileText className="w-3 h-3 text-blue-600" /> Word DOCX
          </span>
        );
      case 'image':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-200">
            <ImageIcon className="w-3 h-3 text-purple-600" /> Diagram / Image
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            <BookOpen className="w-3 h-3 text-emerald-600" /> Text Lecture
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-lesson-notes-panel">
      {/* Toast Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-md transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : statusMessage.type === 'error'
            ? 'bg-rose-50 text-rose-900 border border-rose-200'
            : 'bg-blue-50 text-blue-900 border border-blue-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button 
            onClick={() => setStatusMessage(null)}
            className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Feature Control & Executive Overview Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Academic Material Repository</span>
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                notesFeatureEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${notesFeatureEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{notesFeatureEnabled ? 'Feature Active' : 'Feature Disabled'}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Teacher Lesson Notes & Study Materials Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Supervise the institutional curriculum repository. Teachers can upload notes in Text, PDF, DOCX, and Image formats for students to study and download. As Chief Administrator, you can toggle student and tutor access, export complete term archives as ZIP, or purge obsolete term notes.
            </p>
          </div>

          {/* Master Toggle Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col items-center sm:items-end gap-3 w-full md:w-auto shrink-0">
            <div className="text-right w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                Portal Distribution Switch
              </span>
              <span className="text-xs font-extrabold text-amber-300">
                {notesFeatureEnabled ? 'Enabled Across Portals' : 'Suspended Across Portals'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              id="btn-admin-toggle-lesson-notes-feature"
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                notesFeatureEnabled 
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-blue-950' 
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              {notesFeatureEnabled ? (
                <>
                  <ToggleRight className="w-5 h-5 text-blue-950" />
                  <span>Disable Notes Feature</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-white" />
                  <span>Enable Notes Feature</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Executive Action Controls Bar (Zip Export & Term Purge) */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Active Term Context: <strong className="text-white">{activeTerm}</strong> ({activeSession})</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Export All as ZIP */}
            <button
              type="button"
              onClick={handleExportZip}
              disabled={isExporting || lessonNotes.length === 0}
              id="btn-admin-export-notes-zip"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-blue-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              title="Download a single structured ZIP file containing all notes, documents, diagrams, and README"
            >
              <Archive className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
              <span>{isExporting ? 'Archiving Notes into ZIP...' : 'Export Term Notes as ZIP (.zip)'}</span>
            </button>

            {/* Delete All Notes Published During Current Term */}
            <button
              type="button"
              onClick={() => setShowPurgeModal(true)}
              disabled={activeTermNotes.length === 0}
              id="btn-admin-purge-term-notes"
              className="px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 disabled:opacity-40 text-white font-black text-xs flex items-center gap-2 transition cursor-pointer border border-rose-500/50 shadow-md"
              title="Delete all notes published during the active term from the database"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Term Notes from Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Stored Notes</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {lessonNotes.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all subjects & streams</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Term Notes</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {activeTermNotes.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{activeTerm}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Scholar Downloads</span>
            <Download className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {totalDownloads}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total downloads logged</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Feature Status</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${notesFeatureEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>{notesFeatureEnabled ? 'Active' : 'Disabled'}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{notesFeatureEnabled ? 'Available to scholars' : 'Suspended by admin'}</p>
        </div>
      </div>

      {/* Repository Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, tutor, subject..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              id="input-search-admin-notes"
            />
          </div>

          {/* Subject & Format Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="all">All Academic Subjects</option>
              {uniqueSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Format Selector */}
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
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Repository Table / Cards */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-black text-slate-900">
              Published Lesson Notes Catalog ({filteredNotes.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredNotes.length} of {lessonNotes.length} notes
          </span>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No Lesson Notes Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No study materials match your search filters. Tutors can publish new notes from the Tutor Portal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Topic / Material Title</th>
                  <th className="py-3 px-4">Subject & Class</th>
                  <th className="py-3 px-4">Author / Tutor</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Term</th>
                  <th className="py-3 px-4 text-center">Downloads</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{note.title}</div>
                      {note.attachment && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {note.attachment.name} ({note.attachment.fileSize})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-blue-900 block">{note.subject}</span>
                      <span className="text-[11px] text-slate-500">{note.targetClass}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{note.authorName}</span>
                      <span className="text-[10px] text-slate-400">{note.authorRole || 'Faculty'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getFormatBadge(note.format)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium text-slate-600 block">{note.term}</span>
                      <span className="text-[10px] text-slate-400">{note.datePublished}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        <Download className="w-3 h-3 text-slate-400" />
                        {note.downloadsCount || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewNote(note)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                          title="Preview Note Outline & Content"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSingleDownload(note)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition cursor-pointer"
                          title="Download Note / Attachment"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete lesson note "${note.title}"?`)) {
                              deleteLessonNote(note.id);
                              showToast('success', `Deleted note: ${note.title}`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Term Database Cleanup */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center font-black shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Purge Term Notes?</h3>
                <p className="text-xs text-slate-500">Database cleanup for {activeTerm}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will permanently delete all <strong>{activeTermNotes.length} notes</strong> published during <strong>{activeTerm}</strong> from the active database. 
              <br /><br />
              Tip: You can download the ZIP archive beforehand using <em>Export Term Notes as ZIP</em> to preserve a permanent copy.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurge}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer transition flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Purge ({activeTermNotes.length} Notes)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Content Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getFormatBadge(previewNote.format)}
                  <span className="text-xs font-bold text-blue-900">{previewNote.subject}</span>
                  <span className="text-xs text-slate-400">• {previewNote.targetClass}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {previewNote.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Tutor: {previewNote.authorName} ({previewNote.authorRole || 'Faculty'}) • {previewNote.datePublished}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewNote(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Attachment / Diagram Preview */}
            {previewNote.format === 'image' && previewNote.attachment?.dataUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-2 text-center">
                <img 
                  src={previewNote.attachment.dataUrl} 
                  alt={previewNote.title} 
                  className="max-h-72 mx-auto rounded-lg object-contain"
                />
              </div>
            )}

            {/* Content Body */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-mono max-h-72 overflow-y-auto leading-relaxed">
              {previewNote.content}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Downloads recorded: <strong>{previewNote.downloadsCount}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewNote(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSingleDownload(previewNote);
                    setPreviewNote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs cursor-pointer transition flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
