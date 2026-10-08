import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolNewsArticle, SchoolNewsCategory } from '../types';
import { 
  Newspaper, 
  Search, 
  Clock, 
  Heart, 
  Share2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Award, 
  Users, 
  Crown, 
  Bookmark, 
  Eye, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from './RealIcons';

interface SchoolNewsBlogSectionProps {
  onOpenAdmissions?: () => void;
}

const CATEGORIES: SchoolNewsCategory[] = [
  'All',
  'Campus News',
  'Academic Honors',
  'Sports Desk',
  'Arts & Culture',
  'STEM & Innovation',
  'Executive Bulletin'
];

export const SchoolNewsBlogSection: React.FC<SchoolNewsBlogSectionProps> = ({ onOpenAdmissions }) => {
  const { 
    newsArticles, 
    addNewsArticle, 
    updateNewsArticle, 
    deleteNewsArticle, 
    likeNewsArticle,
    students,
    pressClubPresidentStudentId,
    pressClubEditorStudentIds,
    assignPressClubPresident,
    nominatePressClubEditor,
    removePressClubEditor
  } = useSchool();

  const [activeCategory, setActiveCategory] = useState<SchoolNewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<SchoolNewsArticle | null>(null);
  const [showEditorialModal, setShowEditorialModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [apiFeedback, setApiFeedback] = useState<string | null>(null);

  // New Article Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<SchoolNewsCategory, 'All'>>('Campus News');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState<'Press Club President' | 'Press Club Editor' | 'Staff Patron' | 'Principal Administrator'>('Press Club President');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Appointed President student
  const presidentStudent = students.find(s => s.id === pressClubPresidentStudentId) || students[0];

  // Nominated Editor students
  const editorStudents = students.filter(s => pressClubEditorStudentIds.includes(s.id));

  // Fetch recent external education wire updates from API
  const handleFetchExternalNews = async () => {
    setIsFetchingApi(true);
    setApiFeedback(null);
    try {
      const res = await fetch('/api/school-news');
      const data = await res.json();
      if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
        data.articles.forEach((art: SchoolNewsArticle) => {
          const exists = newsArticles.some(a => a.id === art.id || a.title === art.title);
          if (!exists) {
            addNewsArticle(art);
          }
        });
        setApiFeedback('Latest educational wire dispatch synchronized successfully!');
      } else {
        setApiFeedback('Editorial feed is up to date with verified Stanbax archives.');
      }
    } catch {
      setApiFeedback('Connected to verified offline school archives.');
    } finally {
      setIsFetchingApi(false);
      setTimeout(() => setApiFeedback(null), 3500);
    }
  };

  // Filtered articles
  const filteredArticles = newsArticles.filter(art => {
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  const handleOpenEdit = (article: SchoolNewsArticle) => {
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormExcerpt(article.excerpt);
    setFormContent(article.content);
    setFormCoverImage(article.coverImage);
    setFormTags(article.tags.join(', '));
    setFormIsFeatured(!!article.isFeatured);
    setFormAuthorName(article.author.name);
    setFormAuthorRole(article.author.role);
    setShowEditorialModal(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingArticleId) {
      updateNewsArticle(editingArticleId, {
        title: formTitle.trim(),
        category: formCategory,
        excerpt: formExcerpt.trim() || formContent.slice(0, 140) + '...',
        content: formContent.trim(),
        coverImage: formCoverImage.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
        tags: parsedTags.length > 0 ? parsedTags : ['Stanbax Gazette'],
        isFeatured: formIsFeatured,
        author: {
          id: presidentStudent?.id || 'stu-1',
          name: formAuthorName.trim() || presidentStudent?.name || 'Press Club Desk',
          role: formAuthorRole,
          gradeOrTitle: presidentStudent?.grade || 'Senior Press Guild'
        }
      });
    } else {
      addNewsArticle({
        title: formTitle.trim(),
        slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
        category: formCategory,
        excerpt: formExcerpt.trim() || formContent.slice(0, 140) + '...',
        content: formContent.trim(),
        coverImage: formCoverImage.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
        readTime: `${Math.max(2, Math.round(formContent.split(' ').length / 180))} min read`,
        tags: parsedTags.length > 0 ? parsedTags : ['Stanbax Gazette'],
        isFeatured: formIsFeatured,
        author: {
          id: presidentStudent?.id || 'stu-1',
          name: formAuthorName.trim() || presidentStudent?.name || 'Press Club Desk',
          role: formAuthorRole,
          gradeOrTitle: presidentStudent?.grade || 'Senior Press Guild'
        },
        likesCount: 0,
        viewsCount: 1
      });
    }

    // Reset Form
    setEditingArticleId(null);
    setFormTitle('');
    setFormExcerpt('');
    setFormContent('');
    setFormCoverImage('');
    setFormTags('');
    setFormIsFeatured(false);
    setShowEditorialModal(false);
  };

  const handleShare = (article: SchoolNewsArticle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#news-blog`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="news-blog" className="py-16 sm:py-24 bg-[#FCFBF8] border-b border-[#EAE2CE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Top Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-black uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5 text-red-700" />
              <span>The Stanbax Gazette • Official Campus Dispatch</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              School News & Journalistic Blog
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Curated by the appointed <strong>Press Club President</strong> and nominated student editors. Live reports covering STEM breakthroughs, academic distinctions, inter-house athletics, and institutional bulletins.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleFetchExternalNews}
              disabled={isFetchingApi}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
              title="Fetch recent updates from external education feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${isFetchingApi ? 'animate-spin' : ''}`} />
              <span>{isFetchingApi ? 'Fetching...' : 'Sync Wire'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingArticleId(null);
                setFormTitle('');
                setFormExcerpt('');
                setFormContent('');
                setFormCoverImage('');
                setFormTags('');
                setFormIsFeatured(false);
                setFormAuthorName(presidentStudent?.name || '');
                setFormAuthorRole('Press Club President');
                setShowEditorialModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Press Room & Editorial Desk</span>
            </button>
          </div>
        </div>

        {/* API Feedback Alert */}
        {apiFeedback && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{apiFeedback}</span>
          </div>
        )}

        {/* Masthead Banner: Current Press Leadership */}
        <div className="my-6 p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
              <Crown className="w-5 h-5 text-amber-700 fill-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Appointed Press Club President
                </span>
                <span className="text-xs font-black text-stone-900">{presidentStudent?.name || 'Tiwa Adeleke'}</span>
                <span className="text-[11px] text-stone-500">({presidentStudent?.grade || 'SSS 2 Science'})</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Nominated Editors: {editorStudents.length > 0 ? editorStudents.map(e => e.name).join(', ') : 'Babatunde Akindele, Chinedu Eze'} • Patron: Dr. Chukwuemeka Obi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <span className="text-stone-400 font-bold hidden md:inline">Editorial Verification:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 font-bold text-[11px] border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Peer Audited Journal</span>
            </span>
          </div>
        </div>

        {/* Category Filters and Search Input */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-red-700 text-white shadow-xs font-black'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by topic..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* No Articles Found State */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-black text-stone-800 text-base">No articles found in this category</h4>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Try selecting a different category or clear your search term to view published articles.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Featured Headline Article */}
            {featuredArticle && (
              <div 
                onClick={() => setSelectedArticle(featuredArticle)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Image side */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-stone-900">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                      Featured Report • {featuredArticle.category}
                    </span>
                  </div>
                </div>

                {/* Content side */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug group-hover:text-red-700 transition-colors">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                  </div>

                  {/* Author & Footer */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                        {featuredArticle.author.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-extrabold text-stone-900 truncate block">
                          {featuredArticle.author.name}
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold truncate block">
                          {featuredArticle.author.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs text-stone-500 font-bold">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          likeNewsArticle(featuredArticle.id);
                        }}
                        className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition cursor-pointer"
                        title="Applaud article"
                      >
                        <Heart className="w-4 h-4 fill-rose-600" />
                        <span>{featuredArticle.likesCount || 0}</span>
                      </button>

                      <span className="inline-flex items-center gap-1 text-stone-900 group-hover:translate-x-1 transition-transform font-black">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            {regularArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map(article => (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-stone-900">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-900/90 text-white backdrop-blur-xs">
                            {article.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                          <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>

                        <h4 className="text-base font-black text-stone-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
                          {article.title}
                        </h4>

                        <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-stone-800 truncate block">
                          {article.author.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium truncate block">
                          {article.author.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            likeNewsArticle(article.id);
                          }}
                          className="flex items-center gap-1 text-stone-500 hover:text-rose-600 transition cursor-pointer"
                          title="Like article"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>{article.likesCount || 0}</span>
                        </button>

                        <span className="text-red-700 font-bold group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: FULL ARTICLE READER MODAL                                        */}
      {/* ========================================================================= */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-stone-200 my-8 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reader Header Bar */}
            <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-100 text-red-900">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {new Date(selectedArticle.publishedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(selectedArticle)}
                  className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Share link"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Body */}
            <div className="p-6 sm:p-10 space-y-6 max-h-[75vh] overflow-y-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
                {selectedArticle.title}
              </h2>

              {/* Author Masthead Card */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-950 font-black text-sm flex items-center justify-center shadow-xs">
                    {selectedArticle.author.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-black text-xs sm:text-sm text-stone-900">{selectedArticle.author.name}</h5>
                    <p className="text-[11px] text-amber-800 font-bold">
                      {selectedArticle.author.role} • {selectedArticle.author.gradeOrTitle || 'Stanbax Press Guild'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-stone-500 font-semibold hidden sm:block">
                  <div>{selectedArticle.readTime}</div>
                  <div className="text-[11px] text-stone-400">Verified Press Release</div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-2xl overflow-hidden bg-stone-900 max-h-96">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Excerpt Lead */}
              <p className="text-base sm:text-lg font-bold text-stone-700 leading-relaxed italic border-l-4 border-red-600 pl-4">
                "{selectedArticle.excerpt}"
              </p>

              {/* Full Content */}
              <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
                {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-stone-200 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-stone-500">Filed under:</span>
                  {selectedArticle.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reader Footer Bar */}
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => likeNewsArticle(selectedArticle.id)}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer border border-rose-200"
              >
                <Heart className="w-4 h-4 fill-rose-600" />
                <span>Applaud Report ({selectedArticle.likesCount || 0})</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedArticle)}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit in Press Room</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-black cursor-pointer text-center"
                >
                  Close Reader
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRESS ROOM & EDITORIAL DESK MODAL                                */}
      {/* ========================================================================= */}
      {showEditorialModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-200 my-8 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-red-950 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">Press Room & Editorial Desk</h4>
                  <p className="text-xs text-stone-300">
                    Managed by Press Club President ({presidentStudent?.name || 'Tiwa Adeleke'}) & Nominated Editors
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditorialModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              
              {/* Press Leadership & Editor Nomination Manager */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <h5 className="font-black text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Press Club Leadership & Editorial Appointments</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Appoint Press Club President (Admin Authority) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Press Club President (Admin Appointment)
                    </label>
                    <select
                      value={pressClubPresidentStudentId || ''}
                      onChange={(e) => assignPressClubPresident(e.target.value || undefined)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                      ))}
                    </select>
                  </div>

                  {/* Nominate Editors */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nominate New Club Editor (President Privileges)
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          nominatePressClubEditor(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                    >
                      <option value="">+ Nominate Student Editor...</option>
                      {students
                        .filter(s => s.id !== pressClubPresidentStudentId && !pressClubEditorStudentIds.includes(s.id))
                        .map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Nominated Editors List */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  <span className="text-[11px] font-bold text-stone-500">Active Editorial Board:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                    👑 {presidentStudent?.name || 'Tiwa Adeleke'} (President)
                  </span>
                  {editorStudents.map(e => (
                    <span 
                      key={e.id}
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-200 text-stone-800 flex items-center gap-1.5"
                    >
                      <span>✍️ {e.name}</span>
                      <button
                        type="button"
                        onClick={() => removePressClubEditor(e.id)}
                        className="text-stone-400 hover:text-red-600 font-black cursor-pointer"
                        title="Remove editor"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Publishing Form */}
              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h5 className="font-black text-sm text-stone-900">
                    {editingArticleId ? 'Edit Article Dispatch' : 'Draft New Article Dispatch'}
                  </h5>
                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={() => setEditingArticleId(null)}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Cancel editing
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Article Headline *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Stanbax Scholars Triumph at National Mathematics Olympiad"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Desk / Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Author Byline & Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formAuthorName}
                        onChange={(e) => setFormAuthorName(e.target.value)}
                        placeholder="Author Name"
                        className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-xs"
                      />
                      <select
                        value={formAuthorRole}
                        onChange={(e) => setFormAuthorRole(e.target.value as any)}
                        className="w-full px-2 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                      >
                        <option value="Press Club President">Press President</option>
                        <option value="Press Club Editor">Press Editor</option>
                        <option value="Staff Patron">Staff Patron</option>
                        <option value="Principal Administrator">Principal</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Executive Summary / Excerpt</label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence lead paragraph..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Article Report Body *</label>
                  <textarea
                    rows={6}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Full article journalistic narrative. Separate paragraphs with double enter..."
                    className="w-full p-3 rounded-xl border border-stone-300 text-xs leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="e.g. Science, WAEC, Championship"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-featured"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-red-600 cursor-pointer"
                    />
                    <label htmlFor="chk-featured" className="text-xs font-bold text-stone-800 cursor-pointer">
                      Feature as Main Headline Article
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditorialModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-black shadow-md transition cursor-pointer"
                  >
                    {editingArticleId ? 'Update Article' : 'Publish Article to Gazette'}
                  </button>
                </div>
              </form>

              {/* Published Articles Management Table */}
              <div className="pt-6 border-t border-stone-200 space-y-3">
                <h5 className="font-black text-xs text-stone-900 uppercase tracking-wider">
                  Published Dispatch Archive ({newsArticles.length})
                </h5>

                <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto border border-stone-200 rounded-2xl bg-white">
                  {newsArticles.map(a => (
                    <div key={a.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <span className="font-extrabold text-stone-900 truncate block">{a.title}</span>
                        <span className="text-[10px] text-stone-500">{a.category} • {a.author.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(a)}
                          className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${a.title}" from the news blog?`)) {
                              deleteNewsArticle(a.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEditorialModal(false)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-black"
              >
                Close Desk
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
