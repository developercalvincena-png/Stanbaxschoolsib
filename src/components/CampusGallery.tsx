import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { GalleryPhoto, GalleryCategory } from '../types';
import {
  Camera,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  CheckCircle2,
  Star,
  Bookmark,
  Building,
  Trophy,
  Palette,
  BookOpen,
  Eye,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';

interface CampusGalleryProps {
  onOpenAdmissions?: () => void;
  showAdminControls?: boolean;
}

export const CampusGallery: React.FC<CampusGalleryProps> = ({
  onOpenAdmissions,
  showAdminControls = true
}) => {
  const {
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto,
    resetGalleryPhotosToDefault,
    isAdminAuthenticated
  } = useSchool();

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  // Lightbox State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Admin Upload & Edit Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  // Upload Form State
  const [uploadSource, setUploadSource] = useState<'file' | 'url' | 'preset'>('preset');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<GalleryPhoto['category']>('facilities');
  const [photoImageUrl, setPhotoImageUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoDate, setPhotoDate] = useState('2025/2026 Academic Session');
  const [photoLocation, setPhotoLocation] = useState('Stanbax Main Campus');
  const [photoFeatured, setPhotoFeatured] = useState(false);
  const [fileUploadError, setFileUploadError] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // High-res curated school facility & event presets for quick admin additions
  const CURATED_PRESETS = [
    {
      title: 'Robotics & AI Innovation Lab',
      category: 'facilities' as const,
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      caption: 'Smart computing suite with programmable robotic arms, sensor circuits, and Python workstations.',
      location: 'Block C, Technology Suite'
    },
    {
      title: 'Stanbax Basketball & Volleyball Pavilion',
      category: 'sports' as const,
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      caption: 'Hardcourt gymnasium with electronic scoreboards and professional tournament markings.',
      location: 'South Sports Pavilion'
    },
    {
      title: 'Annual Carol Service & Orchestra Concert',
      category: 'events' as const,
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      caption: 'Stanbax Choir and Chamber Orchestra performing classical masterworks and joyful festive hymns.',
      location: 'Grace Auditorium'
    },
    {
      title: 'Physics & Thermodynamics Workshop',
      category: 'facilities' as const,
      url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
      caption: 'Precision laboratory equipped with optical benches, spectrometers, and electronic sensors for WAEC physics.',
      location: 'Science Quadrangle'
    },
    {
      title: 'Inter-House Drama & Poetry Festival',
      category: 'arts' as const,
      url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80',
      caption: 'Students staging dramatic adaptations of African literature and Shakespearean sonnets.',
      location: 'Stanbax Amphitheatre'
    },
    {
      title: 'Primary School Science Fair & Inventions',
      category: 'academics' as const,
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      caption: 'Young inventors demonstrating solar water purifiers, paper-mache volcanoes, and hydraulic lifts.',
      location: 'Junior School Quad'
    }
  ];

  // Filtered Photos
  const filteredPhotos = useMemo(() => {
    return galleryPhotos.filter(photo => {
      // Category filter
      if (selectedCategory !== 'all' && photo.category !== selectedCategory) {
        return false;
      }
      // Featured filter
      if (onlyFeatured && !photo.featured) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = photo.title.toLowerCase().includes(q);
        const matchCaption = photo.caption.toLowerCase().includes(q);
        const matchLocation = (photo.location || '').toLowerCase().includes(q);
        const matchCategory = photo.category.toLowerCase().includes(q);
        if (!matchTitle && !matchCaption && !matchLocation && !matchCategory) {
          return false;
        }
      }
      return true;
    });
  }, [galleryPhotos, selectedCategory, searchQuery, onlyFeatured]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredPhotos.length]);

  const handleNextImage = () => {
    if (activeLightboxIndex === null) return;
    setIsZoomed(false);
    setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPhotos.length);
  };

  const handlePrevImage = () => {
    if (activeLightboxIndex === null) return;
    setIsZoomed(false);
    setActiveLightboxIndex((activeLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const activePhoto: GalleryPhoto | null =
    activeLightboxIndex !== null && filteredPhotos[activeLightboxIndex]
      ? filteredPhotos[activeLightboxIndex]
      : null;

  // File Upload Handler (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFileUploadError('Image size is too large (max 8MB). Please choose a compressed photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoImageUrl(dataUrl);
      if (!photoTitle) {
        // Auto-generate a title from file name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setPhotoTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.onerror = () => {
      setFileUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) {
      alert('Please enter a photo title.');
      return;
    }
    if (!photoImageUrl.trim()) {
      alert('Please upload an image file or provide a valid image URL.');
      return;
    }

    if (editingPhoto) {
      updateGalleryPhoto(editingPhoto.id, {
        title: photoTitle.trim(),
        category: photoCategory,
        imageUrl: photoImageUrl.trim(),
        caption: photoCaption.trim() || 'Stanbax Schools facility and academic environment.',
        date: photoDate.trim(),
        location: photoLocation.trim(),
        featured: photoFeatured
      });
      setUploadSuccessToast('Photo details updated successfully!');
    } else {
      addGalleryPhoto({
        title: photoTitle.trim(),
        category: photoCategory,
        imageUrl: photoImageUrl.trim(),
        caption: photoCaption.trim() || 'Stanbax Schools facility and academic environment.',
        date: photoDate.trim(),
        location: photoLocation.trim(),
        featured: photoFeatured,
        uploadedBy: 'School Administrator'
      });
      setUploadSuccessToast('New photo published to Campus Gallery!');
    }

    // Reset and close
    resetUploadForm();
    setShowUploadModal(false);
    setEditingPhoto(null);
    setTimeout(() => setUploadSuccessToast(''), 4000);
  };

  const resetUploadForm = () => {
    setPhotoTitle('');
    setPhotoCategory('facilities');
    setPhotoImageUrl('');
    setPhotoCaption('');
    setPhotoDate('2025/2026 Academic Session');
    setPhotoLocation('Stanbax Main Campus');
    setPhotoFeatured(false);
    setFileUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenEdit = (photo: GalleryPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPhoto(photo);
    setPhotoTitle(photo.title);
    setPhotoCategory(photo.category);
    setPhotoImageUrl(photo.imageUrl);
    setPhotoCaption(photo.caption);
    setPhotoDate(photo.date || '2025/2026 Academic Session');
    setPhotoLocation(photo.location || 'Stanbax Main Campus');
    setPhotoFeatured(!!photo.featured);
    setUploadSource('url');
    setShowUploadModal(true);
  };

  const handleDeletePhoto = (id: string, title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}" from the Campus Gallery?`)) {
      deleteGalleryPhoto(id);
      if (activeLightboxIndex !== null) {
        setActiveLightboxIndex(null);
      }
      setUploadSuccessToast('Photo deleted from gallery.');
      setTimeout(() => setUploadSuccessToast(''), 3000);
    }
  };

  const categoryLabels: Record<GalleryCategory, { label: string; icon: React.ElementType }> = {
    all: { label: 'All Photos', icon: Camera },
    facilities: { label: 'Facilities & Labs', icon: Building },
    events: { label: 'School Events', icon: Calendar },
    sports: { label: 'Sports & Athletics', icon: Trophy },
    academics: { label: 'Academic Life', icon: BookOpen },
    arts: { label: 'Creative Arts', icon: Palette }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50 relative overflow-hidden font-['Nunito',sans-serif]">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 text-red-800 text-xs font-black uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Campus Visual Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
              Stanbax Campus & Events Gallery
            </h2>
            <p className="mt-3 text-base sm:text-lg text-stone-600 max-w-2xl font-medium">
              Explore our world-class infrastructure, STEM research laboratories, athletic facilities, and vibrant cultural celebrations.
            </p>
          </div>

          {/* Admin Upload / Control Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isAdminAuthenticated && showAdminControls && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    resetUploadForm();
                    setEditingPhoto(null);
                    setShowUploadModal(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload School Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset campus gallery photos to the default curated Stanbax collection?')) {
                      resetGalleryPhotosToDefault();
                      setUploadSuccessToast('Gallery reset to default collection.');
                      setTimeout(() => setUploadSuccessToast(''), 3000);
                    }
                  }}
                  className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer"
                  title="Reset Gallery to Default Photos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </>
            )}

            {onOpenAdmissions && (
              <button
                type="button"
                onClick={onOpenAdmissions}
                className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Schedule Physical Campus Tour
              </button>
            )}
          </div>
        </div>

        {/* Success Toast */}
        {uploadSuccessToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-bold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{uploadSuccessToast}</span>
            </div>
            <button
              onClick={() => setUploadSuccessToast('')}
              className="p-1 text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(Object.keys(categoryLabels) as GalleryCategory[]).map(cat => {
                const Icon = categoryLabels[cat].icon;
                const count = cat === 'all' 
                  ? galleryPhotos.length 
                  : galleryPhotos.filter(p => p.category === cat).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{categoryLabels[cat].label}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-red-700/60 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input & Featured Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search facilities, events, labs..."
                  className="w-full pl-9 pr-8 py-2 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  onlyFeatured
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
                title="Filter Featured Landmark Photos"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Featured Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-stone-800">No photos match your current filter</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Try choosing another category or clearing your search term to view our full collection of school facilities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyFeatured(false);
              }}
              className="px-5 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-black hover:bg-stone-800 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => {
              return (
                <div
                  key={photo.id}
                  onClick={() => {
                    setActiveLightboxIndex(index);
                    setIsZoomed(false);
                  }}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-xs ${
                        photo.category === 'facilities' ? 'bg-blue-600/90' :
                        photo.category === 'events' ? 'bg-amber-600/90' :
                        photo.category === 'sports' ? 'bg-emerald-600/90' :
                        photo.category === 'academics' ? 'bg-indigo-600/90' :
                        'bg-fuchsia-600/90'
                      }`}>
                        {photo.category}
                      </span>

                      {photo.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Hover Click to Expand Badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md text-stone-900 font-extrabold text-xs shadow-lg flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-red-600" />
                        <span>View in Fullscreen</span>
                      </div>
                    </div>

                    {/* Bottom Location pill on Image */}
                    {photo.location && (
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-white/90 drop-shadow-sm truncate">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900 line-clamp-1 group-hover:text-red-700 transition-colors">
                        {photo.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                      <div className="flex items-center gap-1 truncate">
                        <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{photo.date || 'Stanbax Campus'}</span>
                      </div>

                      {/* Admin Quick Actions */}
                      {isAdminAuthenticated && showAdminControls && (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEdit(photo, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Edit Photo Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeletePhoto(photo.id, photo.title, e)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN LIGHTBOX MODAL                                                 */}
      {/* ========================================================================= */}
      {activePhoto && activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200 select-none"
          onClick={() => {
            setActiveLightboxIndex(null);
            setIsZoomed(false);
          }}
        >
          {/* Top Control Bar */}
          <div
            className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                Photo {activeLightboxIndex + 1} of {filteredPhotos.length}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                activePhoto.category === 'facilities' ? 'bg-blue-500' :
                activePhoto.category === 'events' ? 'bg-amber-500' :
                activePhoto.category === 'sports' ? 'bg-emerald-500' :
                activePhoto.category === 'academics' ? 'bg-indigo-500' :
                'bg-fuchsia-500'
              }`}>
                {activePhoto.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Button */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>

              {/* View Full Resolution / External Link */}
              <a
                href={activePhoto.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                title="Open Original High-Resolution Image"
              >
                <ExternalLink className="w-5 h-5" />
              </a>

              {/* Admin Quick Edit inside Lightbox */}
              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => handleOpenEdit(activePhoto)}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                  title="Edit Photo Info"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setActiveLightboxIndex(null);
                  setIsZoomed(false);
                }}
                className="p-2.5 rounded-2xl bg-white/20 hover:bg-red-600 text-white backdrop-blur-md transition-all cursor-pointer ml-2"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Prev Button */}
          {filteredPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-3xl bg-black/40 hover:bg-red-600 text-white/90 hover:text-white backdrop-blur-md border border-white/10 shadow-2xl transition-all cursor-pointer active:scale-95"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Navigation Next Button */}
          {filteredPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-3xl bg-black/40 hover:bg-red-600 text-white/90 hover:text-white backdrop-blur-md border border-white/10 shadow-2xl transition-all cursor-pointer active:scale-95"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Image Display Area */}
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-12 pb-32 sm:pb-36"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative max-w-5xl max-h-[68vh] transition-transform duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}>
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                onClick={() => setIsZoomed(!isZoomed)}
                className="max-h-[68vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 mx-auto"
              />
            </div>
          </div>

          {/* Bottom Information & Thumbnails Bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base sm:text-xl font-black text-white tracking-tight break-words">
                    {activePhoto.title}
                  </h3>
                  {activePhoto.date && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 shrink-0">
                      {activePhoto.date}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium break-words">
                  {activePhoto.caption}
                </p>

                {activePhoto.location && (
                  <div className="flex items-center gap-1.5 text-xs text-red-300 font-bold pt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activePhoto.location}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Navigation Strip */}
              {filteredPhotos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-md shrink-0 scrollbar-none">
                  {filteredPhotos.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setActiveLightboxIndex(i);
                        setIsZoomed(false);
                      }}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        i === activeLightboxIndex
                          ? 'border-red-500 scale-105 shadow-md'
                          : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN UPLOAD & EDIT PHOTO MODAL                                           */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-stone-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    {editingPhoto ? 'Edit Photo Details' : 'Upload School Campus Photo'}
                  </h3>
                  <p className="text-xs text-red-100">
                    Showcase facilities, STEM laboratories, athletic grounds, and student events
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setEditingPhoto(null);
                }}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePhoto} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Upload Source Picker */}
              <div>
                <label className="block font-black text-stone-800 uppercase tracking-wider mb-2">
                  Image Source
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadSource('preset')}
                    className={`py-2.5 px-3 rounded-2xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      uploadSource === 'preset'
                        ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Curated Presets</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('file')}
                    className={`py-2.5 px-3 rounded-2xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      uploadSource === 'file'
                        ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Device File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadSource('url')}
                    className={`py-2.5 px-3 rounded-2xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                      uploadSource === 'url'
                        ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Custom URL</span>
                  </button>
                </div>
              </div>

              {/* Source Option: Presets */}
              {uploadSource === 'preset' && (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <p className="text-[11px] font-bold text-stone-600">
                    Select from professional high-resolution school campus photography presets:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {CURATED_PRESETS.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setPhotoTitle(p.title);
                          setPhotoCategory(p.category);
                          setPhotoImageUrl(p.url);
                          setPhotoCaption(p.caption);
                          setPhotoLocation(p.location);
                        }}
                        className={`p-2 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                          photoImageUrl === p.url
                            ? 'bg-red-50 border-red-500 ring-2 ring-red-500/20'
                            : 'bg-white border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200">
                          <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-extrabold text-[11px] text-stone-800 truncate">{p.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Option: Device File Upload */}
              {uploadSource === 'file' && (
                <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 text-center space-y-3">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <div>
                    <p className="font-extrabold text-stone-700">Choose an image from your computer or phone</p>
                    <p className="text-[11px] text-stone-500">Supports PNG, JPG, or WEBP (Max 8MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                  />
                  {fileUploadError && (
                    <p className="text-red-600 font-bold text-[11px]">{fileUploadError}</p>
                  )}
                </div>
              )}

              {/* Source Option: Custom URL */}
              {uploadSource === 'url' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Image Web URL (HTTPS)</label>
                  <input
                    type="url"
                    value={photoImageUrl}
                    onChange={(e) => setPhotoImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              )}

              {/* Live Preview If Image Selected */}
              {photoImageUrl && (
                <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                    <img src={photoImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate flex-1">
                    <span className="font-extrabold text-stone-800 block truncate">Photo Ready for Publication</span>
                    <span className="text-[11px] text-stone-500 truncate block">Click below to finalize</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoImageUrl('')}
                    className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Title & Category Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Ultra-Modern Chemistry Laboratory"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value as GalleryPhoto['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    <option value="facilities">Facilities & Labs</option>
                    <option value="events">School Events & Festivals</option>
                    <option value="sports">Sports & Athletics</option>
                    <option value="academics">Academic Life & Olympiads</option>
                    <option value="arts">Creative Arts & Drama</option>
                  </select>
                </div>
              </div>

              {/* Caption Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Caption / Description</label>
                <textarea
                  rows={3}
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Detail the equipment, educational significance, or event highlights..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Academic Session / Date</label>
                  <input
                    type="text"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    placeholder="e.g. 2025/2026 Academic Session"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={photoLocation}
                    onChange={(e) => setPhotoLocation(e.target.value)}
                    placeholder="e.g. Science Quadrangle, Block B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Featured Landmark Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-featured"
                  checked={photoFeatured}
                  onChange={(e) => setPhotoFeatured(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="chk-featured" className="cursor-pointer font-bold text-stone-700">
                  Feature this photo prominently with a landmark badge
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setEditingPhoto(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black cursor-pointer shadow-md shadow-red-600/20"
                >
                  {editingPhoto ? 'Save Changes' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
