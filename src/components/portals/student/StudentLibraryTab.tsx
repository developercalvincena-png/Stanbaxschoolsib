import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  BookOpen, 
  Download, 
  Search, 
  CheckCircle2, 
  GraduationCap, 
  FileText, 
  ExternalLink,
  Tag,
  BookMarked,
  Sparkles
} from '../../RealIcons';
import { LibraryBookItem } from '../../../types';
import { DigitalLibraryLounge } from '../DigitalLibraryLounge';

export const StudentLibraryTab: React.FC = () => {
  const { student, libraryBooks, incrementBookDownload } = useSchool();

  const [activeLibraryView, setActiveLibraryView] = useState<'lounge' | 'catalog'>('lounge');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  const subjectsList = ['All', ...Array.from(new Set(libraryBooks.map(b => b.subject)))];
  const categoriesList = ['All', 'E-Textbook', 'Revision Guide', 'WAEC Past Questions', 'JAMB Mock Drill', 'Reference Material'];

  const filteredBooks = libraryBooks.filter(book => {
    const desc = book.description || book.summary || '';
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesSubject && matchesCategory;
  });

  const handleDownload = (book: LibraryBookItem) => {
    incrementBookDownload(book.id);

    // If external url, trigger direct download link safely
    const targetUrl = book.fileUrl || book.downloadUrl;
    if (targetUrl && targetUrl.startsWith('http')) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Simulate file download
      const desc = book.description || book.summary || '';
      const blob = new Blob([
        `STANBAX SCHOOLS DIGITAL E-LIBRARY\n\nTitle: ${book.title}\nAuthor: ${book.author}\nSubject: ${book.subject}\nClass: ${book.targetClass}\nEdition: ${book.edition || 'Official Edition'}\n\nDescription:\n${desc}\n\nDownloaded by ${student.name} (${student.regNumber}) on ${new Date().toLocaleString()}\n`
      ], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setDownloadSuccessNotice(`"${book.title}" was successfully downloaded to your device.`);
    setTimeout(() => setDownloadSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6" id="student-library-container">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1B365D] via-neutral-900 to-emerald-950 text-white shadow-md relative overflow-hidden border border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <BookMarked className="w-3.5 h-3.5" />
            Stanbax Digital E-Textbook Library
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Curriculum Textbooks & Examination Companion Books
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Direct online access to standard Nigerian Educational Research and Development Council (NERDC) recommended e-textbooks, past question compendiums, and revision digests.
          </p>
        </div>
      </div>

      {/* View Switcher: Interactive Lounge vs Downloadable Catalog */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveLibraryView('lounge')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeLibraryView === 'lounge'
              ? 'bg-blue-900 text-amber-300 shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Reading Lounge & E-Books</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLibraryView('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
            activeLibraryView === 'catalog'
              ? 'bg-blue-900 text-amber-300 shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Syllabus Textbooks & Compendiums ({libraryBooks.length})</span>
        </button>
      </div>

      {activeLibraryView === 'lounge' ? (
        <DigitalLibraryLounge />
      ) : (
        <>
          {/* Success Alert */}
      {downloadSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccessNotice}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE2CE] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title, author, subject, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {subjectsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span>Found {filteredBooks.length} available learning resource{filteredBooks.length !== 1 ? 's' : ''}</span>
          <span>Targeted Level: <strong>{student.grade}</strong></span>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="p-6 rounded-3xl bg-white border border-[#EAE2CE] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                  {book.category}
                </span>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {book.fileSize || '3.5 MB PDF'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-neutral-900 leading-snug">
                  {book.title}
                </h3>
                <p className="text-xs font-bold text-amber-800 mt-0.5">
                  By {book.author} {book.edition && `• ${book.edition}`}
                </p>
              </div>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {book.description || book.summary}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
                  {book.subject}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
                  {book.targetClass}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                  {book.downloadsCount} downloads
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDownload(book)}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              id={`btn-download-book-${book.id}`}
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download & Read Offline</span>
            </button>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
};
