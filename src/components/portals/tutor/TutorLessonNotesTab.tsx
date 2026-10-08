import React, { useState, useRef } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { LessonNote, NoteFormat, LessonNoteAttachment } from '../../../types';
import { 
  BookOpen, 
  UploadCloud, 
  FileText, 
  File, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Download, 
  Eye, 
  X, 
  Send, 
  Clock, 
  Search, 
  Check, 
  AlertTriangle 
} from '../../RealIcons';

export const TutorLessonNotesTab: React.FC = () => {
  const { 
    tutor, 
    lessonNotes, 
    notesFeatureEnabled, 
    addLessonNote, 
    deleteLessonNote, 
    incrementNoteDownload,
    schoolInfo,
    assessmentConfig,
    classes,
    subjects
  } = useSchool();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(
    tutor.assignedSubjects && tutor.assignedSubjects.length > 0 
      ? tutor.assignedSubjects[0] 
      : (subjects[0]?.name || 'Physics')
  );
  const [targetClass, setTargetClass] = useState('All Senior Secondary');
  const [format, setFormat] = useState<NoteFormat>('text');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState<LessonNoteAttachment | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewNote, setPreviewNote] = useState<LessonNote | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [viewOnlyMyNotes, setViewOnlyMyNotes] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTerm = schoolInfo.activeTerm || '2nd Term (Lent Term)';
  const activeSession = assessmentConfig.activeSession || '2025/2026 Academic Session';

  // Notes filtered for this tutor or all
  const displayedNotes = lessonNotes.filter(n => {
    const matchesAuthor = !viewOnlyMyNotes || n.authorId === tutor.id || n.authorName.toLowerCase() === tutor.name.toLowerCase();
    const matchesQuery = 
      n.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(filterQuery.toLowerCase()) ||
      n.targetClass.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesAuthor && matchesQuery;
  });

  const tutorPublishedCount = lessonNotes.filter(
    n => n.authorId === tutor.id || n.authorName.toLowerCase() === tutor.name.toLowerCase()
  ).length;

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileSelection = (file: File) => {
    setUploadError('');

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10 MB upload threshold.');
      return;
    }

    const reader = new FileReader();
    setIsUploading(true);

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const lowerName = file.name.toLowerCase();

      let detectedFormat: NoteFormat = 'text';
      if (lowerName.endsWith('.pdf')) detectedFormat = 'pdf';
      else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) detectedFormat = 'docx';
      else if (lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.webp')) detectedFormat = 'image';

      setFormat(detectedFormat);
      setAttachment({
        name: file.name,
        fileType: detectedFormat,
        fileSize: formatFileSize(file.size),
        dataUrl
      });
      setIsUploading(false);
    };

    reader.onerror = () => {
      setUploadError('Failed to read and process the selected file.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handlePublishNote = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!title.trim()) {
      setUploadError('Please enter a descriptive note title or topic.');
      return;
    }

    if (!content.trim() && !attachment) {
      setUploadError('Please provide either text notes content or upload an attachment (PDF, DOCX, Image).');
      return;
    }

    // Publish note
    const published = addLessonNote({
      title: title.trim(),
      subject,
      targetClass,
      term: activeTerm,
      session: activeSession,
      authorId: tutor.id,
      authorName: tutor.name,
      authorRole: tutor.role || 'Subject Teacher',
      format,
      content: content.trim() || `Study notes for ${title.trim()} (${subject}). Refer to attached ${format.toUpperCase()} document.`,
      attachment: attachment || (format === 'text' ? {
        name: `${subject}_${title.slice(0, 30).replace(/\s+/g, '_')}.txt`,
        fileType: 'text',
        fileSize: `${Math.round(content.length / 1024) || 1} KB`,
        textContent: content.trim()
      } : undefined)
    });

    showToast('success', `Lesson note "${published.title}" published successfully to scholars!`);

    // Reset form
    setTitle('');
    setContent('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (note: LessonNote) => {
    incrementNoteDownload(note.id);

    if (note.attachment?.dataUrl) {
      const link = document.createElement('a');
      link.href = note.attachment.dataUrl;
      link.download = note.attachment.name || `${note.title.replace(/\s+/g, '_')}.${note.format === 'image' ? 'png' : note.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const textBlob = new Blob([
        `STANBAX SCHOOLS - OFFICIAL STUDY MATERIAL\n` +
        `Title: ${note.title}\n` +
        `Subject: ${note.subject}\n` +
        `Class: ${note.targetClass}\n` +
        `Tutor: ${note.authorName}\n` +
        `Term: ${note.term} | Session: ${note.session}\n` +
        `Date: ${note.datePublished}\n\n` +
        `==================== LESSON CONTENT ====================\n\n` +
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
  };

  return (
    <div className="space-y-6 animate-fade-in" id="tutor-lesson-notes-view">
      {/* Toast Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-md transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
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

      {/* Feature Disabled Notice Banner */}
      {!notesFeatureEnabled && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-amber-900">
              Lesson Notes Module Suspended by Administration
            </h3>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              The Chief Administrator has temporarily deactivated student lesson notes distribution for the ongoing revision/examination window. Existing materials remain archived in the system, but scholar downloads and new uploads are presently held.
            </p>
          </div>
        </div>
      )}

      {/* Hero / Header Card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-blue-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum & Study Materials Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Send Lesson Notes & Materials to Scholars
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Prepare and publish comprehensive notes in <strong>Text</strong>, <strong>PDF</strong>, <strong>Word (.docx)</strong>, or <strong>Diagram Images</strong> for your students. Scholars can study online and download the complete materials to their personal devices.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">My Published Notes</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">{tutorPublishedCount}</span>
            <span className="text-[11px] text-blue-200 block mt-0.5">{activeTerm}</span>
          </div>
        </div>
      </div>

      {/* Upload / Publication Section (Only if enabled) */}
      {notesFeatureEnabled && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">Publish New Lesson Note</h3>
                <p className="text-[11px] text-slate-500">Distribute study notes, laboratory guides, or diagrams</p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400">
              Format: <strong className="text-blue-900 uppercase">{format}</strong>
            </span>
          </div>

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handlePublishNote} className="space-y-4">
            {/* Row 1: Title & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Title / Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Week 4: Projectile Motion & Kinematics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition"
                  id="input-tutor-note-title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
                  id="select-tutor-note-subject"
                >
                  {(tutor.assignedSubjects && tutor.assignedSubjects.length > 0 ? tutor.assignedSubjects : subjects.map(s => s.name)).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Target Class & Format Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Class / Cohort <span className="text-rose-500">*</span>
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
                  id="select-tutor-note-class"
                >
                  <option value="All Senior Secondary">All Senior Secondary (SS 1 - SS 3)</option>
                  <option value="Senior Secondary (SSS 3 Science)">Senior Secondary (SSS 3 Science)</option>
                  <option value="Senior Secondary (SSS 3 Commercial)">Senior Secondary (SSS 3 Commercial)</option>
                  <option value="Senior Secondary (SSS 3 Arts)">Senior Secondary (SSS 3 Arts)</option>
                  <option value="Senior Secondary (SSS 2)">Senior Secondary (SSS 2)</option>
                  <option value="Senior Secondary (SSS 1)">Senior Secondary (SSS 1)</option>
                  <option value="All Junior Secondary">All Junior Secondary (JSS 1 - JSS 3)</option>
                  <option value="Basic 5 (Primary)">Basic 5 (Primary)</option>
                  <option value="Basic 4 (Primary)">Basic 4 (Primary)</option>
                  <option value="General (All Classes)">General (All Classes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Material Format
                </label>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormat('text')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      format === 'text' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      format === 'pdf' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <File className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('docx')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      format === 'docx' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>DOCX</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('image')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      format === 'image' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image</span>
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload Drag & Drop Area for PDF/DOCX/Image */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Upload Document or Diagram Attachment (Optional for Text notes, Required for PDF/DOCX/Images)
              </label>

              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  attachment 
                    ? 'border-emerald-400 bg-emerald-50/50' 
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp,.txt"
                  className="hidden"
                  id="input-tutor-file-upload"
                />

                {attachment ? (
                  <div className="flex items-center justify-between max-w-md mx-auto p-3 bg-white rounded-xl shadow-xs border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {attachment.fileType === 'pdf' ? (
                          <File className="w-5 h-5 text-rose-600" />
                        ) : attachment.fileType === 'docx' ? (
                          <FileText className="w-5 h-5 text-blue-600" />
                        ) : attachment.fileType === 'image' ? (
                          <ImageIcon className="w-5 h-5 text-purple-600" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-900 truncate max-w-xs">
                          {attachment.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {attachment.fileSize} • Ready to publish
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAttachment(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Drag and drop your file here, or <span className="text-blue-600 underline">browse files</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports PDF (.pdf), Microsoft Word (.docx, .doc), Images (.png, .jpg, .webp), or Text (.txt) up to 10 MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Note Content / Lecture Outline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lecture Notes Content / Executive Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Write out the lecture text, learning objectives, problem set solutions, or supplementary reading instructions for scholars..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition leading-relaxed"
                id="textarea-tutor-note-content"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                id="btn-tutor-publish-note"
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Publish Note to Scholars</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Library of Published Notes */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-black text-slate-900">
              Curriculum Study Materials Directory ({displayedNotes.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter notes..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* My notes toggle */}
            <button
              type="button"
              onClick={() => setViewOnlyMyNotes(!viewOnlyMyNotes)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewOnlyMyNotes 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {viewOnlyMyNotes ? 'Showing My Notes' : 'Show All Notes'}
            </button>
          </div>
        </div>

        {displayedNotes.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No notes found matching your criteria</p>
            <p className="text-[11px] text-slate-400">Use the form above to publish your first lesson note.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedNotes.map((note) => {
              const isMine = note.authorId === tutor.id || note.authorName.toLowerCase() === tutor.name.toLowerCase();

              return (
                <div key={note.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      {note.format === 'pdf' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                          <File className="w-3 h-3 text-rose-600" /> PDF
                        </span>
                      ) : note.format === 'docx' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                          <FileText className="w-3 h-3 text-blue-600" /> DOCX
                        </span>
                      ) : note.format === 'image' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                          <ImageIcon className="w-3 h-3 text-purple-600" /> Diagram
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          <BookOpen className="w-3 h-3 text-emerald-600" /> Text
                        </span>
                      )}

                      <span className="text-xs font-extrabold text-blue-900">{note.subject}</span>
                      <span className="text-xs text-slate-400">• {note.targetClass}</span>

                      {isMine && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          My Note
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span>Faculty: <strong className="text-slate-700">{note.authorName}</strong></span>
                      <span>•</span>
                      <span>Published: {note.datePublished}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-semibold">
                        <Download className="w-3 h-3" /> {note.downloadsCount || 0} downloads
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewNote(note)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(note)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    {isMine && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete lesson note "${note.title}"?`)) {
                            deleteLessonNote(note.id);
                            showToast('success', 'Note removed from distribution.');
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-900 uppercase">{previewNote.subject}</span>
                  <span className="text-xs text-slate-400">• {previewNote.targetClass}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {previewNote.title}
                </h3>
                <p className="text-xs text-slate-500">
                  By {previewNote.authorName} • {previewNote.datePublished}
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

            {/* Note Diagram Preview */}
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

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Logged Downloads: <strong>{previewNote.downloadsCount}</strong>
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
                    handleDownload(previewNote);
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
