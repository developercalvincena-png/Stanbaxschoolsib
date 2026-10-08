import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { compressImageFile } from '../../../utils/imageUploadHelper';
import { SchoolLogo } from '../../SchoolLogo';
import { 
  Save, 
  RotateCcw, 
  Layout, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Trash2, 
  Plus, 
  Edit3, 
  Eye, 
  School as SchoolIcon, 
  BookOpen, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Trophy, 
  MessageSquare, 
  Award, 
  Layers, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from '../../RealIcons';
import { HeroSlide, AcademicProgram, KeyPillarItem, Club, Testimonial, HouseStanding } from '../../../types';
import { DEFAULT_IMAGES } from '../../../data/schoolData';

type CmsSubTab = 
  | 'logo' 
  | 'hero' 
  | 'about' 
  | 'programs' 
  | 'pillars' 
  | 'gallery' 
  | 'student_life' 
  | 'contact' 
  | 'testimonials';

export const AdminLandingPageTab: React.FC = () => {
  const { 
    schoolInfo, 
    updateSchoolInfo, 
    resetSchoolInfoToDefault,
    images, 
    updateImage, 
    resetImagesToDefault,
    heroSlides, 
    updateHeroSlide, 
    addHeroSlide, 
    deleteHeroSlide, 
    resetHeroSlidesToDefault,
    heroHighlights, 
    updateHeroHighlights, 
    resetHeroHighlightsToDefault,
    aboutContent, 
    updateAboutContent, 
    resetAboutContentToDefault,
    academicPrograms, 
    updateAcademicProgram, 
    addAcademicProgram, 
    deleteAcademicProgram, 
    resetAcademicProgramsToDefault,
    keyPillars, 
    keyPillarsHeader, 
    updateKeyPillar, 
    addKeyPillar, 
    deleteKeyPillar, 
    updateKeyPillarsHeader, 
    resetKeyPillarsToDefault,
    clubs, 
    updateClub, 
    addClub, 
    deleteClub, 
    resetClubsToDefault,
    students,
    assignClubLeaders,
    houseStandings, 
    updateHouseStanding, 
    addHouseStanding,
    deleteHouseStanding,
    resetHouseStandingsToDefault,
    testimonials, 
    testimonialsHeader, 
    updateTestimonial, 
    addTestimonial, 
    deleteTestimonial, 
    updateTestimonialsHeader, 
    resetTestimonialsToDefault
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<CmsSubTab>('logo');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Form states initialized with context values
  const [logoForm, setLogoForm] = useState({
    logoUrl: schoolInfo.logoUrl || (images.crest && !images.crest.includes('photo-1546410531-bb4caa6b424d') ? images.crest : ''),
    name: schoolInfo.name || 'Stanbax Schools',
    shortName: schoolInfo.shortName || 'Stanbax Schools',
    motto: schoolInfo.motto || 'Excellence, Character & Global Leadership',
    establishedYear: aboutContent.establishedYear || '2008',
    city: schoolInfo.city || 'Ibadan',
    state: schoolInfo.state || 'Oyo State'
  });

  const [aboutForm, setAboutForm] = useState(aboutContent);
  const [pillarHeaderForm, setPillarHeaderForm] = useState(keyPillarsHeader);
  const [contactForm, setContactForm] = useState({
    address: schoolInfo.address || '',
    city: schoolInfo.city || '',
    state: schoolInfo.state || '',
    country: schoolInfo.country || 'Nigeria',
    phone: schoolInfo.phone || '',
    email: schoolInfo.email || '',
    whatsapp: schoolInfo.whatsapp || '',
    admissionsPhone: schoolInfo.admissionsPhone || schoolInfo.phone || ''
  });

  // Keep logoForm and contactForm in sync when schoolInfo changes
  useEffect(() => {
    setLogoForm(prev => ({
      ...prev,
      logoUrl: schoolInfo.logoUrl || (images.crest && !images.crest.includes('photo-1546410531-bb4caa6b424d') ? images.crest : ''),
      name: schoolInfo.name || prev.name,
      shortName: schoolInfo.shortName || prev.shortName,
      motto: schoolInfo.motto || prev.motto,
      city: schoolInfo.city || prev.city,
      state: schoolInfo.state || prev.state
    }));
  }, [schoolInfo, images.crest]);

  // Highlight state
  const [highlightsList, setHighlightsList] = useState<string[]>(heroHighlights || []);
  const [newHighlightText, setNewHighlightText] = useState('');

  // Hidden file inputs references
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const founderPhotoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // 1. Handle School Logo Upload (File from device)
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingTarget('logo');
      const dataUrl = await compressImageFile(file, 600, 600, 0.9);
      setLogoForm(prev => ({ ...prev, logoUrl: dataUrl }));
      updateSchoolInfo({ logoUrl: dataUrl });
      updateImage('crest', dataUrl);
      showToast('School logo successfully uploaded and applied across all portals!');
    } catch (err) {
      console.error('Error uploading logo file:', err);
    } finally {
      setUploadingTarget(null);
    }
  };

  // 1. Handle Save School Logo & Identity
  const handleSaveLogoAndIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo({
      logoUrl: logoForm.logoUrl,
      name: logoForm.name,
      shortName: logoForm.shortName,
      motto: logoForm.motto,
      city: logoForm.city,
      state: logoForm.state
    });
    updateImage('crest', logoForm.logoUrl || DEFAULT_IMAGES.crest);
    updateAboutContent({
      establishedYear: logoForm.establishedYear
    });
    showToast('School logo and institutional identity updated successfully!');
  };

  // Reset to default Heraldic SVG crest
  const handleResetToDefaultCrest = () => {
    setLogoForm(prev => ({ ...prev, logoUrl: '' }));
    updateSchoolInfo({ logoUrl: '' });
    updateImage('crest', DEFAULT_IMAGES.crest);
    showToast('Restored default heraldic SVG crest emblem.');
  };

  // 2. Generic Image File Upload for any Gallery or Slide item
  const handleGenericImageUpload = async (
    file: File, 
    onSuccess: (dataUrl: string) => void, 
    targetKey: string
  ) => {
    try {
      setUploadingTarget(targetKey);
      const dataUrl = await compressImageFile(file, 1400, 1000, 0.85);
      onSuccess(dataUrl);
      showToast('Image uploaded and optimized successfully!');
    } catch (err) {
      console.error('Failed to compress/upload image:', err);
    } finally {
      setUploadingTarget(null);
    }
  };

  // Add a new Hero Highlight
  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    const updated = [...highlightsList, newHighlightText.trim()];
    setHighlightsList(updated);
    updateHeroHighlights(updated);
    setNewHighlightText('');
    showToast('Hero highlight bullet point added!');
  };

  const handleRemoveHighlight = (idx: number) => {
    const updated = highlightsList.filter((_, i) => i !== idx);
    setHighlightsList(updated);
    updateHeroHighlights(updated);
    showToast('Hero highlight removed.');
  };

  // Save About Section
  const handleSaveAboutSection = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutContent(aboutForm);
    if (aboutForm.founderPhotoUrl) {
      updateImage('founders', aboutForm.founderPhotoUrl);
    }
    showToast('About section content and Founder profile updated!');
  };

  // Save Contact Section
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(contactForm);
    showToast('Official contact information and campus desk updated!');
  };

  // Gallery items metadata
  const galleryItems = [
    { key: 'crest', title: 'School Logo / Crest', desc: 'Used in navbar, report cards, ID badges, and portal headers', defaultUrl: DEFAULT_IMAGES.crest },
    { key: 'founders', title: 'Founder & Proprietress Portrait', desc: 'Featured in homepage About section and executive letters', defaultUrl: DEFAULT_IMAGES.founders },
    { key: 'hero', title: 'Hero Banner Main Backdrop', desc: 'Primary landing banner background visual', defaultUrl: DEFAULT_IMAGES.hero },
    { key: 'earlyYears', title: 'Early Years & Crèche Classroom', desc: 'Featured in Academic Programs for Crèche / Nursery', defaultUrl: DEFAULT_IMAGES.earlyYears },
    { key: 'artClass', title: 'Creative Arts & Music Studio', desc: 'Featured in Primary / Junior School creative curriculum', defaultUrl: DEFAULT_IMAGES.artClass },
    { key: 'faculty', title: 'Faculty & Mentors Team', desc: 'Showcases educators and faculty leadership', defaultUrl: DEFAULT_IMAGES.faculty },
    { key: 'sports', title: 'Athletics & Track Sports', desc: 'Inter-house sports and physical education banner', defaultUrl: DEFAULT_IMAGES.sports },
    { key: 'soccer', title: 'Football Field & Team Play', desc: 'Co-curricular sports activities and campus facilities', defaultUrl: DEFAULT_IMAGES.soccer },
    { key: 'cultural', title: 'Cultural Day & Heritage Festivals', desc: 'Cultural day, music performances, and community celebrations', defaultUrl: DEFAULT_IMAGES.cultural },
  ];

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Top Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-2">
            <Layout className="w-3.5 h-3.5" />
            <span>Complete Website CMS & Asset Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Landing Page & School Media Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Update every visual element of your public website: upload the school logo, change hero banner images, configure academic programs, update co-curriculars, and customize institutional copy.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold">
            <SchoolLogo size="xs" showText={false} />
            <span className="hidden sm:inline">Active Brand:</span>
            <span className="text-red-700 font-black">{schoolInfo.shortName || 'Stanbax'}</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs underline font-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Horizontal Scrollable Sub-tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('logo')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'logo'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <SchoolIcon className="w-4 h-4" />
          <span>School Logo & Crest</span>
          {logoForm.logoUrl && <span className="w-2 h-2 rounded-full bg-amber-300" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Hero Banner & Slides</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {heroSlides.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'about'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>About & Founder Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('programs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'programs'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Academic Programs</span>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px]">
            {academicPrograms.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pillars')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'pillars'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Key Pillars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'gallery'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Website Media Gallery</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('student_life')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'student_life'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Student Life & Clubs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact & Campus Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('testimonials')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'testimonials'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/40'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews & Testimonials</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: SCHOOL LOGO & BRAND IDENTITY STUDIO (PRIMARY FOCUS)              */}
      {/* ========================================================================= */}
      {activeSubTab === 'logo' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveLogoAndIdentity} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <SchoolIcon className="w-5 h-5 text-red-600" />
                    Official School Logo & Heraldic Crest
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Upload your institution's custom crest or logo. It updates dynamically across the Navbar, Footer, Scholar ID Cards, Terminal Report Sheets, Entrance Slips, and all Portals.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefaultCrest}
                    className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore Default Crest
                  </button>
                </div>
              </div>

              {/* Logo Upload & URL Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Interactive Preview & Upload Box */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 text-center">
                  <div className="relative group mb-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-white shadow-lg border-4 border-amber-400 flex items-center justify-center p-1 relative">
                      {logoForm.logoUrl ? (
                        <img 
                          src={logoForm.logoUrl} 
                          alt="School Logo Preview" 
                          className="w-full h-full object-contain rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full">
                          <SchoolLogo size="xl" showText={false} />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer"
                    >
                      <Upload className="w-5 h-5 mb-1 text-amber-300" />
                      Change Logo
                    </button>
                  </div>

                  <input 
                    type="file"
                    ref={logoFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoFileUpload}
                  />

                  <div className="space-y-2 w-full">
                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      disabled={uploadingTarget === 'logo'}
                      className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingTarget === 'logo' ? 'Compressing & Storing...' : 'Upload Logo from Phone / PC'}</span>
                    </button>
                    <p className="text-[11px] text-stone-500">
                      Supports PNG, JPG, WebP, SVG. Auto-compressed for instant loading.
                    </p>
                  </div>
                </div>

                {/* Right: Manual URL & Settings */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Direct Logo Image URL (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="url"
                        value={logoForm.logoUrl}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/school-logo.png"
                        className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 font-mono"
                      />
                      {logoForm.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoForm(prev => ({ ...prev, logoUrl: '' }))}
                          className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                          title="Clear URL"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Tip: You can upload directly via the button on the left, or paste any image link here.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Official School Name</label>
                      <input 
                        type="text"
                        value={logoForm.name}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Short Brand Name</label>
                      <input 
                        type="text"
                        value={logoForm.shortName}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, shortName: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">Official Motto / Slogan</label>
                      <input 
                        type="text"
                        value={logoForm.motto}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, motto: e.target.value }))}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Established Heritage Year</label>
                      <input 
                        type="text"
                        value={logoForm.establishedYear}
                        onChange={(e) => setLogoForm(prev => ({ ...prev, establishedYear: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Campus Location</label>
                      <input 
                        type="text"
                        value={`${logoForm.city}, ${logoForm.state}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(',');
                          setLogoForm(prev => ({
                            ...prev,
                            city: parts[0]?.trim() || prev.city,
                            state: parts[1]?.trim() || prev.state
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Surface Live Previews */}
              <div className="pt-6 border-t border-stone-100">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                  Live Real-World Visual Previews:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Preview 1: Light Header Navbar */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      1. Website Navbar (Light)
                    </span>
                    <div className="py-2">
                      <SchoolLogo size="sm" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-2">✓ Rendered on Homepage</span>
                  </div>

                  {/* Preview 2: Dark Footer Banner */}
                  <div className="p-4 rounded-2xl bg-[#111827] text-white border border-stone-800 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-2">
                      2. Dark Theme / Footer
                    </span>
                    <div className="py-2">
                      <SchoolLogo size="sm" variant="light" />
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold mt-2">✓ Rendered on Footer</span>
                  </div>

                  {/* Preview 3: Terminal Report Card Letterhead */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-amber-200 shadow-xs flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                      3. Report Sheet & ID Stamp
                    </span>
                    <div className="py-1 flex items-center justify-center">
                      <SchoolLogo size="md" showText={false} />
                    </div>
                    <div className="text-[10px] text-center text-stone-700 font-black mt-1">
                      {logoForm.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save School Logo & Brand Identity</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: HERO BANNER & SLIDES                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-600" />
                  Homepage Hero Banner Carousel
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Configure the prominent full-width carousel slides and backgrounds displayed at the top of your school's website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetHeroSlidesToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Slides
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newSlide: HeroSlide = {
                      id: `slide-${Date.now()}`,
                      badge: 'New Academic Program',
                      title: 'Inspiring Future Innovators & Leaders',
                      subtitle: 'World-class facilities and nurturing mentorship located in the heart of Oyo State.',
                      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
                      ctaText: 'Apply for Admission',
                      ctaAction: 'apply'
                    };
                    addHeroSlide(newSlide);
                    showToast('New hero slide added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Slide
                </button>
              </div>
            </div>

            {/* Slides List */}
            <div className="space-y-6">
              {heroSlides.map((slide, idx) => (
                <div key={idx} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-amber-400 text-neutral-950 text-xs font-black rounded-lg">
                      Slide #{idx + 1}
                    </span>
                    {heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteHeroSlide(idx);
                          showToast(`Hero slide #${idx + 1} deleted.`);
                        }}
                        className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Slide Image Preview & Upload */}
                    <div className="lg:col-span-4 space-y-2">
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-300 shadow-inner group">
                        <img 
                          src={slide.imageUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'} 
                          alt={`Slide ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                          <Upload className="w-5 h-5 mb-1 text-amber-300" />
                          <span>Upload Banner Image</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateHeroSlide(idx, { imageUrl: dataUrl });
                                }, `hero_slide_${idx}`);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-stone-600">
                          Slide Image URL / Source
                        </label>
                        <input 
                          type="url"
                          value={slide.imageUrl}
                          onChange={(e) => updateHeroSlide(idx, { imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-red-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Slide Texts */}
                    <div className="lg:col-span-8 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Slide Pill Badge</label>
                          <input 
                            type="text"
                            value={slide.badge}
                            onChange={(e) => updateHeroSlide(idx, { badge: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">CTA Button Label</label>
                          <input 
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => updateHeroSlide(idx, { ctaText: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Headline Title</label>
                        <input 
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateHeroSlide(idx, { title: e.target.value })}
                          className="w-full px-3 py-2 text-sm font-extrabold bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Narrative</label>
                        <textarea 
                          rows={2}
                          value={slide.subtitle}
                          onChange={(e) => updateHeroSlide(idx, { subtitle: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Key Highlights Bullet Points */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-stone-900">
                    Hero Highlights Bar (Checkmark Bullet Points)
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Fast visual trust points displayed directly below the hero banner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetHeroHighlightsToDefault}
                  className="text-xs text-stone-500 hover:text-stone-700 underline"
                >
                  Reset Bullet Points
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {highlightsList.map((hl, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-stone-900 border border-amber-300 rounded-xl text-xs font-bold"
                  >
                    <Check className="w-3.5 h-3.5 text-red-600" />
                    <span>{hl}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveHighlight(i)}
                      className="ml-1 text-stone-400 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newHighlightText}
                  onChange={(e) => setNewHighlightText(e.target.value)}
                  placeholder="e.g., 100% WAEC & BECE Distinctions in Oyo State"
                  className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl"
                >
                  Add Bullet Point
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: ABOUT SECTION & PROPRIETRESS PROFILE                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'about' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveAboutSection} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-red-600" />
                    About Stanbax & Proprietress Showcase
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage the institutional story, core vision, mission statements, and Founder portrait photo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetAboutContentToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* Founder Photo & Quote Card */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                  <div className="relative group w-40 h-48 rounded-2xl overflow-hidden shadow-md border-2 border-amber-400 bg-stone-200">
                    <img 
                      src={aboutForm.founderPhotoUrl || images.founders || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'}
                      alt="Founder Portrait"
                      className="w-full h-full object-cover object-top"
                    />
                    <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                      <Upload className="w-5 h-5 mb-1 text-amber-300" />
                      <span>Change Photo</span>
                      <input 
                        type="file"
                        ref={founderPhotoInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericImageUpload(file, (dataUrl) => {
                              setAboutForm(prev => ({ ...prev, founderPhotoUrl: dataUrl }));
                              updateImage('founders', dataUrl);
                            }, 'founder_photo');
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => founderPhotoInputRef.current?.click()}
                    disabled={uploadingTarget === 'founder_photo'}
                    className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Portrait</span>
                  </button>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Founder / Proprietress Name</label>
                      <input 
                        type="text"
                        value={aboutForm.founderName}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, founderName: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Official Role / Designation</label>
                      <input 
                        type="text"
                        value={aboutForm.founderRole}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, founderRole: e.target.value }))}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Founder's Personal Quote</label>
                    <input 
                      type="text"
                      value={aboutForm.quote || ''}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, quote: e.target.value }))}
                      placeholder="Excellence is not an accident; it is the habit of dedicated mentors and eager minds."
                      className="w-full px-3 py-2 text-xs italic bg-white border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Photo Image URL</label>
                    <input 
                      type="url"
                      value={aboutForm.founderPhotoUrl || ''}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, founderPhotoUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* General About Section Narrative */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Section Badge</label>
                  <input 
                    type="text"
                    value={aboutForm.badge}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Section Main Title</label>
                  <input 
                    type="text"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Institutional Narrative</label>
                  <textarea 
                    rows={4}
                    value={aboutForm.description}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Vision Statement</label>
                  <textarea 
                    rows={3}
                    value={aboutForm.vision}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, vision: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mission Statement</label>
                  <textarea 
                    rows={3}
                    value={aboutForm.mission}
                    onChange={(e) => setAboutForm(prev => ({ ...prev, mission: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Section</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: ACADEMIC PROGRAMS & LEVELS                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'programs' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  Academic Pathways & Program Cards
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Customize the 4 primary academic tiers (Crèche/Early Years, Primary, JSS, SSS) along with their cover photos, curriculum features, and scholar capacities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAcademicProgramsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {academicPrograms.map((prog, idx) => (
                <div key={prog.id || idx} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Program Image Preview & Upload */}
                    <div className="relative rounded-xl overflow-hidden h-44 border border-stone-300 shadow-inner group">
                      <img 
                        src={prog.imageUrl || (prog.imageKey && images[prog.imageKey]) || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'}
                        alt={prog.title}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                        <Upload className="w-5 h-5 mb-1 text-amber-300" />
                        <span>Change Program Photo</span>
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleGenericImageUpload(file, (dataUrl) => {
                                updateAcademicProgram(prog.id, { imageUrl: dataUrl });
                              }, `prog_photo_${prog.id}`);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Program Title</label>
                        <input 
                          type="text"
                          value={prog.title}
                          onChange={(e) => updateAcademicProgram(prog.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Category</label>
                        <input 
                          type="text"
                          value={prog.category || ''}
                          onChange={(e) => updateAcademicProgram(prog.id, { category: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Age Tier</label>
                        <input 
                          type="text"
                          value={prog.ageGroup || prog.ageRange || ''}
                          onChange={(e) => updateAcademicProgram(prog.id, { ageGroup: e.target.value, ageRange: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Scholar Enrollment</label>
                        <input 
                          type="text"
                          value={prog.studentCount || ''}
                          onChange={(e) => updateAcademicProgram(prog.id, { studentCount: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Description</label>
                      <textarea 
                        rows={2}
                        value={prog.description}
                        onChange={(e) => updateAcademicProgram(prog.id, { description: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Custom Image URL</label>
                      <input 
                        type="url"
                        value={prog.imageUrl || ''}
                        onChange={(e) => updateAcademicProgram(prog.id, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 font-bold">
                    <span>{prog.features?.length || 0} Curriculum Highlights</span>
                    <button
                      type="button"
                      onClick={() => showToast(`Program "${prog.title}" updated!`)}
                      className="px-3 py-1 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: KEY PILLARS OF EXCELLENCE                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'pillars' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  Key Pillars of Excellence
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the core pillars that explain why parents choose Stanbax Schools.
                </p>
              </div>

              <button
                type="button"
                onClick={resetKeyPillarsToDefault}
                className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
            </div>

            {/* Header copy */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Badge</label>
                <input 
                  type="text"
                  value={pillarHeaderForm.badge}
                  onChange={(e) => {
                    const updated = { ...pillarHeaderForm, badge: e.target.value };
                    setPillarHeaderForm(updated);
                    updateKeyPillarsHeader(updated);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Section Main Headline</label>
                <input 
                  type="text"
                  value={pillarHeaderForm.title}
                  onChange={(e) => {
                    const updated = { ...pillarHeaderForm, title: e.target.value };
                    setPillarHeaderForm(updated);
                    updateKeyPillarsHeader(updated);
                  }}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Context</label>
                <input 
                  type="text"
                  value={pillarHeaderForm.subtitle}
                  onChange={(e) => {
                    const updated = { ...pillarHeaderForm, subtitle: e.target.value };
                    setPillarHeaderForm(updated);
                    updateKeyPillarsHeader(updated);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keyPillars.map((pillar) => (
                <div key={pillar.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-700 uppercase tracking-wider">
                      Icon: {pillar.iconName}
                    </span>
                    <select
                      value={pillar.iconName}
                      onChange={(e) => updateKeyPillar(pillar.id, { iconName: e.target.value })}
                      className="px-2 py-1 text-xs font-bold bg-stone-100 border border-stone-300 rounded-lg"
                    >
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="FlaskConical">FlaskConical</option>
                      <option value="BookOpen">BookOpen</option>
                      <option value="ShieldCheck">ShieldCheck</option>
                      <option value="Award">Award</option>
                      <option value="School">School</option>
                      <option value="HeartHandshake">HeartHandshake</option>
                      <option value="CheckCircle2">CheckCircle2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pillar Title</label>
                    <input 
                      type="text"
                      value={pillar.title}
                      onChange={(e) => updateKeyPillar(pillar.id, { title: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                    <textarea 
                      rows={2}
                      value={pillar.description || pillar.desc || ''}
                      onChange={(e) => updateKeyPillar(pillar.id, { description: e.target.value, desc: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: WEBSITE MEDIA GALLERY (ALL PUBLIC IMAGES)                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-600" />
                  Website Media Gallery & Global Image Assets
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Direct visual control over every photograph and graphic displayed on the public landing page. Upload from your phone camera or enter high-resolution image links.
                </p>
              </div>

              <button
                type="button"
                onClick={resetImagesToDefault}
                className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Images to Default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => {
                const currentImg = images[item.key] || item.defaultUrl;
                return (
                  <div 
                    key={item.key} 
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-300 shadow-inner group mb-3">
                        <img 
                          src={currentImg} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-bold cursor-pointer">
                          <Upload className="w-5 h-5 mb-1 text-amber-300" />
                          <span>Replace Image</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateImage(item.key, dataUrl);
                                  if (item.key === 'crest') {
                                    updateSchoolInfo({ logoUrl: dataUrl });
                                  }
                                }, item.key);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <h4 className="text-xs font-black text-stone-900">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <input 
                        type="url"
                        value={images[item.key] || ''}
                        onChange={(e) => {
                          updateImage(item.key, e.target.value);
                          if (item.key === 'crest') {
                            updateSchoolInfo({ logoUrl: e.target.value });
                          }
                        }}
                        placeholder={item.defaultUrl}
                        className="w-full px-2.5 py-1 text-[11px] font-mono bg-white border border-stone-300 rounded-lg"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <label className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg text-center cursor-pointer flex items-center justify-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericImageUpload(file, (dataUrl) => {
                                  updateImage(item.key, dataUrl);
                                  if (item.key === 'crest') {
                                    updateSchoolInfo({ logoUrl: dataUrl });
                                  }
                                }, item.key);
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            updateImage(item.key, item.defaultUrl);
                            showToast(`Reset ${item.title} to default image.`);
                          }}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
                          title="Reset this image"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: STUDENT LIFE & CO-CURRICULARS                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'student_life' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-red-600" />
                  Student Life, Inter-House Sports & Clubs
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage co-curricular student clubs and inter-house standings displayed in the Student Life section.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetClubsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Clubs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newClub: Club = {
                      id: `club-${Date.now()}`,
                      name: 'STEM & Robotics Guild',
                      category: 'Technology',
                      meetingDay: 'Fridays 3:00 PM',
                      patron: 'Engr. D. Adeleke',
                      description: 'Hands-on coding, circuitry, and regional robotic competitions.'
                    };
                    addClub(newClub);
                    showToast('New student club added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Club
                </button>
              </div>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((c) => (
                <div key={c.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <input 
                        type="text"
                        value={c.name}
                        onChange={(e) => updateClub(c.id, { name: e.target.value })}
                        className="text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1 flex-1 mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => deleteClub(c.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={c.category}
                        onChange={(e) => updateClub(c.id, { category: e.target.value })}
                        placeholder="Category"
                        className="text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                      />
                      <input 
                        type="text"
                        value={c.meetingDay}
                        onChange={(e) => updateClub(c.id, { meetingDay: e.target.value })}
                        placeholder="Meeting Schedule"
                        className="text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1"
                      />
                    </div>

                    <textarea 
                      rows={2}
                      value={c.description}
                      onChange={(e) => updateClub(c.id, { description: e.target.value })}
                      className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                    />

                    {/* President & Vice President Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200">
                      <div>
                        <label className="block text-[10px] font-black text-amber-700 mb-0.5">👑 President:</label>
                        <select
                          value={c.presidentStudentId || ''}
                          onChange={(e) => assignClubLeaders(c.id, e.target.value || undefined, c.vicePresidentStudentId, c.memberStudentIds)}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-semibold"
                        >
                          <option value="">-- No President --</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-emerald-700 mb-0.5">👑 Vice President:</label>
                        <select
                          value={c.vicePresidentStudentId || ''}
                          onChange={(e) => assignClubLeaders(c.id, c.presidentStudentId, e.target.value || undefined, c.memberStudentIds)}
                          className="w-full text-[11px] bg-white border border-stone-300 rounded-lg px-2 py-1 font-semibold"
                        >
                          <option value="">-- No Vice President --</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* House Standings */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Inter-House Sports Standings & Teams</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Create, edit or delete official athletic houses. Changes immediately update the public landing page, scholar portals, ID cards, and athletic standings across Stanbax.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={resetHouseStandingsToDefault}
                    className="px-3 py-1.5 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Houses
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newHouse: HouseStanding = {
                        name: `Diamond (White House)`,
                        color: '#475569',
                        points: 1200,
                        motto: 'Purity, Strength & Resilience',
                        houseMaster: 'Mr. David Adeleke'
                      };
                      addHouseStanding(newHouse);
                      showToast('New athletic house created successfully!');
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create House Team
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {houseStandings.map((h) => (
                  <div key={h.name} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: h.color }} />
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={h.name}
                          onChange={(e) => updateHouseStanding(h.name, { name: e.target.value })}
                          className="text-xs font-black bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 flex-1"
                          placeholder="House Name"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${h.name}?`)) {
                              deleteHouseStanding(h.name);
                              showToast(`Deleted ${h.name}`);
                            }
                          }}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                          title="Delete House"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">Points</label>
                          <input 
                            type="number"
                            value={h.points}
                            onChange={(e) => updateHouseStanding(h.name, { points: Number(e.target.value) })}
                            className="w-full px-2 py-1 text-xs font-bold bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 mb-0.5">House Color</label>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="color"
                              value={h.color || '#2563eb'}
                              onChange={(e) => updateHouseStanding(h.name, { color: e.target.value })}
                              className="w-7 h-7 rounded border border-stone-300 p-0.5 cursor-pointer"
                            />
                            <input 
                              type="text"
                              value={h.color || '#2563eb'}
                              onChange={(e) => updateHouseStanding(h.name, { color: e.target.value })}
                              className="w-full px-1.5 py-1 text-[10px] font-mono bg-stone-50 border border-stone-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">House Motto</label>
                        <input 
                          type="text"
                          value={h.motto || ''}
                          onChange={(e) => updateHouseStanding(h.name, { motto: e.target.value })}
                          placeholder="e.g. Valour and Integrity"
                          className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg italic text-stone-700"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-0.5">House Master / Mistress</label>
                        <input 
                          type="text"
                          value={h.houseMaster || ''}
                          onChange={(e) => updateHouseStanding(h.name, { houseMaster: e.target.value })}
                          placeholder="e.g. Mr. Olumide Ogunleye"
                          className="w-full px-2 py-1 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: CONTACT INFORMATION & CAMPUS DESK                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="pb-6 border-b border-stone-100">
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  Official Contact & Campus Desk Details
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage the physical campus location, admissions hotline, WhatsApp number, and emails displayed on the landing page contact section and footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Physical School Address</label>
                  <input 
                    type="text"
                    value={contactForm.address}
                    onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input 
                    type="text"
                    value={contactForm.city}
                    onChange={(e) => setContactForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State & Country</label>
                  <input 
                    type="text"
                    value={`${contactForm.state}, ${contactForm.country}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setContactForm(prev => ({
                        ...prev,
                        state: parts[0]?.trim() || prev.state,
                        country: parts[1]?.trim() || prev.country
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">General Inquiries Phone</label>
                  <input 
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Admissions Direct Helpline</label>
                  <input 
                    type="text"
                    value={contactForm.admissionsPhone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, admissionsPhone: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Chat Hotline Number</label>
                  <input 
                    type="text"
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Official School Email</label>
                  <input 
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact Details</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB: TESTIMONIALS & REVIEWS                                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                  Parent & Scholar Testimonials
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage authentic community feedback and parent quotes displayed on the public landing page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetTestimonialsToDefault}
                  className="px-3 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newTestimonial: Testimonial = {
                      id: `test-${Date.now()}`,
                      name: 'Mrs. Folake Adeyemi',
                      relationship: 'Parent of Primary 5 Scholar',
                      comment: 'Stanbax has instilled a genuine love of discovery and upright moral character in our daughter.',
                      rating: 5,
                      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
                    };
                    addTestimonial(newTestimonial);
                    showToast('New testimonial review added!');
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Testimonial
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <input 
                      type="text"
                      value={t.name}
                      onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                      className="text-xs font-black bg-white border border-stone-300 rounded-lg px-2 py-1 flex-1 mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => deleteTestimonial(t.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input 
                    type="text"
                    value={t.relationship}
                    onChange={(e) => updateTestimonial(t.id, { relationship: e.target.value })}
                    placeholder="Role / Relation"
                    className="w-full text-[11px] font-bold text-red-700 bg-white border border-stone-300 rounded-lg px-2 py-1"
                  />

                  <textarea 
                    rows={3}
                    value={t.comment}
                    onChange={(e) => updateTestimonial(t.id, { comment: e.target.value })}
                    className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
