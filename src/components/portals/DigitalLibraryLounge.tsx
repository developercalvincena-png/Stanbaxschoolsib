import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Award, 
  Bookmark, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Headphones, 
  Clock, 
  Star,
  ChevronRight,
  Filter
} from '../RealIcons';

export interface LibraryBookItem {
  id: string;
  title: string;
  author: string;
  category: 'literature' | 'sciences' | 'mathematics' | 'humanities' | 'audiobooks';
  classLevel: string;
  pages: number;
  readMinutes: number;
  coverUrl: string;
  summary: string;
  curriculum: string;
  sampleChapter: string;
  isAudioAvailable?: boolean;
}

const LIBRARY_BOOKS: LibraryBookItem[] = [
  {
    id: 'lib-1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    category: 'literature',
    classLevel: 'SSS 1 to SSS 3',
    pages: 209,
    readMinutes: 180,
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    summary: 'The seminal masterpiece chronicling pre-colonial life in Southeastern Nigeria and the clash of traditions, required for WAEC and Cambridge Literature.',
    curriculum: 'WAEC / NECO / Cambridge African Prose Core',
    sampleChapter: 'Okonkwo was well known throughout the nine villages and even beyond. His fame rested on solid personal achievements. As a young man of eighteen he had brought honor to his village by throwing Amalinze the Cat...',
    isAudioAvailable: true
  },
  {
    id: 'lib-2',
    title: 'Cambridge IGCSE Biology (4th Edition)',
    author: 'D.G. Mackean & Dave Hayward',
    category: 'sciences',
    classLevel: 'SSS 1 to SSS 3',
    pages: 412,
    readMinutes: 320,
    coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    summary: 'Comprehensive scientific textbook detailing cellular biology, genetics, ecology, human physiology, and practical investigation techniques.',
    curriculum: 'Cambridge IGCSE 0610 / WAEC Sciences',
    sampleChapter: 'Chapter 1: Characteristics and Classification of Living Organisms. All living organisms share seven fundamental vital processes: movement, respiration, sensitivity, growth, reproduction, excretion, and nutrition...',
    isAudioAvailable: false
  },
  {
    id: 'lib-3',
    title: 'The Lion and the Jewel',
    author: 'Wole Soyinka (Nobel Laureate)',
    category: 'literature',
    classLevel: 'SSS 2 & SSS 3',
    pages: 128,
    readMinutes: 110,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    summary: 'A witty, poetic dramatic comedy set in the village of Ilujinle exploring modernity versus tradition through the characters of Sidi, Lakunle, and Baroka.',
    curriculum: 'WAEC Drama & African Theatre Anthology',
    sampleChapter: 'Morning. A clearing on the edge of the market in Ilujinle. Sidi enters carrying a pail of water on her head. Lakunle, the village school teacher, appears from the schoolhouse wearing his Western suit...',
    isAudioAvailable: true
  },
  {
    id: 'lib-4',
    title: 'New General Mathematics for Senior Secondary Schools (Book 2)',
    author: 'M.F. Macrae, A.O. Kalejaiye et al.',
    category: 'mathematics',
    classLevel: 'SSS 2',
    pages: 350,
    readMinutes: 280,
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    summary: 'The standard Nigerian-British mathematics manual featuring logarithms, coordinate geometry, quadratic trigonometry, and commercial statistics.',
    curriculum: 'NERDC National Mathematics Syllabus',
    sampleChapter: 'Chapter 4: Quadratic Equations and Graphs. When modeling real-world projectile flight paths and arch bridges, quadratic expressions in the standard form y = ax² + bx + c define parabolic loci...',
    isAudioAvailable: false
  },
  {
    id: 'lib-5',
    title: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    category: 'literature',
    classLevel: 'JSS 3 to SSS 2',
    pages: 307,
    readMinutes: 240,
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    summary: 'A gripping coming-of-age story following Kambili and Jaja in Enugu, delving into family devotion, religious orthodoxy, and the beauty of resilience.',
    curriculum: 'Cambridge Literature & National Reading List',
    sampleChapter: 'Things started to fall apart at home when my brother, Jaja, did not go to communion and Papa flung his heavy missal across the room and broke the figurines on the what-not...',
    isAudioAvailable: true
  },
  {
    id: 'lib-6',
    title: 'Essential Physics for West African Secondary Schools',
    author: 'O.E. Farinde & K.S. Adeleke',
    category: 'sciences',
    classLevel: 'SSS 1 to SSS 3',
    pages: 420,
    readMinutes: 350,
    coverUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
    summary: 'In-depth conceptual breakdowns of kinematics, optics, thermodynamics, electromagnetic induction, and modern atomic physics with worked WAEC examples.',
    curriculum: 'WAEC WASSCE & NECO SSCE Physics',
    sampleChapter: 'Chapter 8: Wave Motion and Sound Resonance. Waves transmit energy from one point in a medium to another without permanent displacement of the medium particles. Mechanical waves require elastic media...',
    isAudioAvailable: false
  }
];

export const DigitalLibraryLounge: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBookItem | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(['lib-1']);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredBooks = LIBRARY_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Stanbax Digital E-Library and Reading Sanctuary</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Digital Scholastic Library & E-Book Lounge
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Access thousands of curated African literature masterpieces, Cambridge international textbooks, and science revision anthologies available 24/7 on any device.
          </p>
        </div>

        {/* Termly Reading Milestone Chip */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-xs shrink-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black">
            <Award className="w-5 h-5 text-neutral-950" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-300 uppercase block">Termly Reading Quest</span>
            <span className="font-black text-white text-sm">6 of 10 Books Read</span>
            <span className="text-[10px] text-amber-300 font-bold block mt-0.5">Scholastic Reader Badge Active</span>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles, authors, or subjects..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-neutral-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Library Books' },
            { id: 'literature', label: 'African & World Literature' },
            { id: 'sciences', label: 'Sciences' },
            { id: 'mathematics', label: 'Mathematics' }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => {
          const isBookmarked = bookmarks.includes(book.id);
          return (
            <div
              key={book.id}
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden bg-neutral-950">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                    {book.classLevel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleBookmark(book.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer ${
                    isBookmarked ? 'bg-amber-400 text-neutral-950 shadow-md' : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Title'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wide block truncate">
                    {book.curriculum}
                  </span>
                  <h3 className="font-black text-sm text-white truncate">{book.title}</h3>
                  <p className="text-[11px] text-neutral-300 truncate">by {book.author}</p>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-neutral-600 text-xs leading-relaxed line-clamp-3">
                  {book.summary}
                </p>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-neutral-500 flex items-center gap-2">
                    <span>{book.pages} Pages</span>
                    <span>•</span>
                    <span>{book.readMinutes} mins read</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveReadingBook(book)}
                    className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Reader</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* READING LOUNGE MODAL */}
      {activeReadingBook && (
        <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
            
            {/* Reader Header */}
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-black truncate">{activeReadingBook.title}</h3>
                  <p className="text-[11px] text-neutral-400 truncate">By {activeReadingBook.author} • {activeReadingBook.curriculum}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeReadingBook.isAudioAvailable && (
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isPlayingAudio ? 'bg-amber-400 text-neutral-950 font-black' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'Playing Audio' : 'Audiobook'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveReadingBook(null);
                    setIsPlayingAudio(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reader Body with sample chapter */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-neutral-800 leading-relaxed text-sm bg-[#FDFBF7]">
              {isPlayingAudio && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-950 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-amber-700" />
                    <span>Narration Active: Cambridge Scholastic Voice Ensemble (West Africa English narration).</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800">Stereo 48kHz</span>
                </div>
              )}

              <div className="border-b border-[#EAE2CE] pb-3">
                <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider block">
                  Exemplar Chapter Extract
                </span>
                <h4 className="text-lg font-black text-neutral-950 mt-1">
                  Selected Study Chapter: Foundation Text
                </h4>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#EAE2CE] shadow-2xs text-xs sm:text-sm font-serif leading-loose text-neutral-900">
                {activeReadingBook.sampleChapter}
              </div>

              <div className="p-4 bg-white rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">Class Library Repository Reference:</span>
                  <span className="text-[11px] text-neutral-500">Full textbook and syllabus notes cleared for academic loan.</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Licensed for Scholar Use</span>
                </div>
              </div>
            </div>

            {/* Reader Footer */}
            <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between text-xs shrink-0">
              <span className="text-neutral-500 font-semibold text-[11px]">
                Stanbax Digital Library • Ibadan Campus
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveReadingBook(null);
                  setIsPlayingAudio(false);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs transition cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
