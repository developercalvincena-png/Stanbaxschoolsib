import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { PageSection } from '../types';
import { 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft
} from './RealIcons';

interface HeroBannerProps {
  onNavigate: (section: PageSection) => void;
  onOpenAdmissions: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  onOpenAdmissions
}) => {
  const { heroSlides, heroHighlights, schoolInfo } = useSchool();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const slide = heroSlides[currentSlideIndex] || {
    badge: 'Premier Education in Ibadan',
    title: 'Nurturing Global Minds & Noble Character',
    subtitle: 'From Creche through Senior Secondary School, Stanbax Schools provides British-Nigerian curriculum and holistic moral development.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
  };

  return (
    <section className="relative bg-stone-900 text-white overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.imageUrl}
          alt="Stanbax Schools"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
            <Award className="w-3.5 h-3.5" />
            <span>{slide.badge || 'Stanbax Schools Ibadan'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
            {slide.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenAdmissions}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all hover:translate-x-0.5 active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Apply for Admission</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('programs')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm flex items-center gap-2 backdrop-blur-xs transition-colors"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          </div>

          {/* Highlights Row */}
          {heroHighlights && heroHighlights.length > 0 && (
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300 font-medium">
              {heroHighlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
