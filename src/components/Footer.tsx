import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { PageSection } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { 
  School as SchoolIcon, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  Lock, 
  ShieldCheck, 
  HeartHandshake,
  Compass
} from './RealIcons';

interface FooterProps {
  onNavigate: (section: PageSection) => void;
  onOpenAdmissions: () => void;
  onOpenTuitionCalc: () => void;
  onOpenStatusTracker: () => void;
  onOpenTour?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAdmissions,
  onOpenTuitionCalc,
  onOpenStatusTracker,
  onOpenTour
}) => {
  const { schoolInfo } = useSchool();

  return (
    <footer className="bg-stone-900 text-stone-300 font-['Nunito',sans-serif] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: School Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <SchoolLogo size="md" variant="light" showText={true} />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Dedicated to academic rigour, high moral character, and innovative technology literacy. Accredited British-Nigerian curriculum from Early Years to Senior Secondary in Ibadan.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{schoolInfo.address}, {schoolInfo.city}, {schoolInfo.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{schoolInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{schoolInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Academic Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Academic Wings
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button type="button" onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Creche & Early Years</button></li>
              <li><button type="button" onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Primary Education (Basic 1 - 6)</button></li>
              <li><button type="button" onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Junior Secondary School (JSS)</button></li>
              <li><button type="button" onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Senior Secondary Sciences (SSS)</button></li>
              <li><button type="button" onClick={() => onNavigate('programs')} className="hover:text-white transition-colors">Commercial & Humanities</button></li>
            </ul>
          </div>

          {/* Col 4: Admissions & Quick Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Admissions Desk
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button type="button" onClick={onOpenAdmissions} className="text-amber-300 font-bold hover:underline">Apply for Admission</button></li>
              <li><button type="button" onClick={onOpenTuitionCalc} className="hover:text-white transition-colors">Tuition Calculator</button></li>
              <li><button type="button" onClick={onOpenStatusTracker} className="hover:text-white transition-colors">Track Admission Status</button></li>
              {onOpenTour && <li><button type="button" onClick={onOpenTour} className="hover:text-white transition-colors flex items-center gap-1"><Compass className="w-3 h-3 text-amber-400" /> Interactive Tour</button></li>}
              <li><button type="button" onClick={() => onNavigate('calendar')} className="hover:text-white transition-colors">Academic Term Calendar</button></li>
            </ul>
          </div>

          {/* Col 5: Portals & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Institutional Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('portal-login')}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white flex items-center gap-1.5 transition-colors font-bold"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Portal Single Sign-On</span>
                </button>
              </li>
              <li><button type="button" onClick={() => onNavigate('portal-login')} className="hover:text-white transition-colors">Scholar & Parent Portal</button></li>
              <li><button type="button" onClick={() => onNavigate('portal-login')} className="hover:text-white transition-colors">Faculty Tutor Portal</button></li>
              <li><button type="button" onClick={() => onNavigate('portal-login')} className="hover:text-white transition-colors">Administrator Registry</button></li>
              <li><button type="button" onClick={() => onNavigate('proprietress')} className="hover:text-white transition-colors">Office of the Proprietress</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} {schoolInfo.name}, Ibadan, Nigeria. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Digital Academic Registry</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onNavigate('portal-login')}
              className="hover:text-stone-300 underline"
            >
              Staff & Student Gateway
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
