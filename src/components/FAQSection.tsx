import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Calculator,
  School as SchoolIcon
} from './RealIcons';

interface FAQSectionProps {
  onOpenAdmissions: () => void;
  onOpenTuitionCalc: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenAdmissions,
  onOpenTuitionCalc
}) => {
  const { faqItems, faqContent } = useSchool();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-[#FDFBF7] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{faqContent?.badge || 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {faqContent?.title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            {faqContent?.subtitle || 'Get fast answers to common questions about admissions, academics, and daily school operations.'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqItems.map(item => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-stone-900 hover:text-red-700 transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.question}</span>
                  <div className="p-1 rounded-lg bg-stone-100 text-stone-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Still have questions?</h3>
            <p className="text-xs text-stone-500 mt-0.5">Explore our fee estimator or speak directly with admissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenTuitionCalc}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              Tuition Calculator
            </button>
            <button
              type="button"
              onClick={onOpenAdmissions}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Apply Online
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
