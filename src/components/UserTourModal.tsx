import React, { useState } from 'react';
import { PageSection } from '../types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  GraduationCap, 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  Compass,
  School as SchoolIcon
} from './RealIcons';

interface UserTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: PageSection) => void;
  onOpenAdmissions: () => void;
  onOpenTuitionCalc: () => void;
}

export const UserTourModal: React.FC<UserTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAdmissions,
  onOpenTuitionCalc
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to Stanbax Schools Ibadan',
      description: 'Discover a learning environment designed for academic rigour, technological fluency, and grounded moral values from Early Childhood through Senior Secondary School.',
      icon: SchoolIcon,
      targetText: 'A Premier Learning Institution'
    },
    {
      title: 'Academic Programs & Curriculum',
      description: 'We blend the Nigerian National Curriculum with British Cambridge frameworks across Creche, Primary, JSS, and SSS Science, Commercial, and Arts departments.',
      icon: BookOpen,
      targetText: 'Enriched Hybrid Curriculum'
    },
    {
      title: 'Tuition & Transparent Fee Calculator',
      description: 'Use our interactive fee calculator to review tuition rates per term, textbook packages, and STEM laboratory resources.',
      icon: Calculator,
      targetText: 'Clear & Predictable Investments'
    },
    {
      title: 'Student & Faculty Digital Portals',
      description: 'Class teachers mark student daily attendance, publish lesson notes, and enter continuous assessment marks. Scholars and parents track terminal report cards in real-time.',
      icon: GraduationCap,
      targetText: 'Connected School Registry'
    }
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-['Nunito',sans-serif]">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-scale-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          title="Close Tour"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress pills */}
        <div className="flex items-center gap-1.5 mb-6">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-red-600' : 'w-2.5 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Step Visual & Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
            <StepIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">
              Step {currentStep + 1} of {tourSteps.length} • {step.targetText}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-snug mt-0.5">
              {step.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
          {step.description}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              currentStep === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTuitionCalc();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200"
              >
                Open Calculator
              </button>
            )}

            {currentStep === tourSteps.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmissions();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
              >
                Enroll Now
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
