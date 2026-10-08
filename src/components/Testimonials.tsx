import React from 'react';
import { Quote, Star, MapPin, Award } from './RealIcons';
import { TESTIMONIALS } from '../data/schoolData';
import { useSchool } from '../context/SchoolContext';

export const Testimonials: React.FC = () => {
  const { images, testimonials, testimonialsHeader } = useSchool();
  const effectiveTestimonials = (testimonials && testimonials.length > 0) ? testimonials : TESTIMONIALS;

  return (
    <section id="testimonials" className="py-20 bg-[#FDFBF7] border-b border-[#EAE2CE] font-['Nunito',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-neutral-900 border border-amber-300 text-xs font-black uppercase tracking-wider mb-3">
            <Quote className="w-3.5 h-3.5 text-red-600" />
            <span>{testimonialsHeader?.badge || 'Parent & Scholar Voices'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            {testimonialsHeader?.title || 'What Families Say About Stanbax Schools'}
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-3">
            {testimonialsHeader?.subtitle || "Hear from parents and guardians across Bodija, Oluyole, Jericho, and greater Ibadan on their children's growth and academic success."}
          </p>
        </div>

        {/* 4 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {effectiveTestimonials.map((t) => {
            const avatarImg = (t.imageKey && images[t.imageKey]) || t.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
            return (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 border border-[#EAE2CE] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-red-100" />
                  </div>

                  <p className="text-neutral-700 text-sm sm:text-base leading-relaxed italic mb-6">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#F0EAE0]">
                  <img
                    src={avatarImg}
                    alt={t.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div>
                    <h4 className="font-black text-neutral-900 text-sm sm:text-base">
                      {t.name}
                    </h4>
                    <p className="text-xs text-red-700 font-bold">
                      {t.relation}
                    </p>
                    <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust banner */}
        <div className="bg-[#FAF7EE] rounded-3xl p-6 border border-[#EAE2CE] text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center shrink-0 border border-neutral-700">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-black text-neutral-900">
                {testimonialsHeader?.satisfactionTitle || `${testimonialsHeader?.satisfactionRate || 'Over 98%'} Parent Satisfaction Rate`}
              </div>
              <div className="text-xs text-neutral-600">
                {testimonialsHeader?.satisfactionNote || 'Based on annual PTA quality & educational experience surveys.'}
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-neutral-800 bg-white px-3.5 py-1.5 rounded-xl border border-[#EAE2CE] shadow-2xs">
            {testimonialsHeader?.associationBadge || 'Stanbax PTA Association'}
          </div>
        </div>
      </div>
    </section>
  );
};
