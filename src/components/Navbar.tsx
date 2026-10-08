import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { PageSection } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { 
  School as SchoolIcon, 
  Menu, 
  X, 
  Phone, 
  Calendar, 
  UserCheck, 
  Calculator, 
  Compass, 
  GraduationCap, 
  BookOpen, 
  Lock,
  ChevronDown
} from './RealIcons';

interface NavbarProps {
  onNavigate: (section: PageSection) => void;
  activeSection: PageSection;
  onOpenAdmissions: () => void;
  onOpenTuitionCalc: () => void;
  onOpenStatusTracker: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeSection,
  onOpenAdmissions,
  onOpenTuitionCalc,
  onOpenStatusTracker,
  onOpenTour
}) => {
  const { 
    schoolInfo,
    isAdminAuthenticated,
    isProprietressAuthenticated,
    isHeadmistressAuthenticated,
    isModeratorAuthenticated,
    isTutorAuthenticated,
    isStudentAuthenticated,
    isParentAuthenticated,
    student,
    tutor
  } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const getActivePortalTarget = (): PageSection => {
    if (isStudentAuthenticated) return 'student-portal';
    if (isAdminAuthenticated) return 'admin-portal';
    if (isHeadmistressAuthenticated) return 'headmistress-portal';
    if (isModeratorAuthenticated) return 'moderator-portal';
    if (isTutorAuthenticated) return 'tutor-portal';
    if (isParentAuthenticated) return 'parent-portal';
    if (isProprietressAuthenticated) return 'proprietress-portal';
    return 'portal-login';
  };

  const getPortalButtonLabel = () => {
    if (isStudentAuthenticated) {
      const firstName = student?.name ? student.name.split(' ')[0] : 'Scholar';
      return `Scholar (${firstName})`;
    }
    if (isAdminAuthenticated) return 'Admin Console';
    if (isHeadmistressAuthenticated) return 'Head Mistress';
    if (isModeratorAuthenticated) return 'Moderator Desk';
    if (isTutorAuthenticated) return 'Faculty Portal';
    if (isParentAuthenticated) return 'Parent Portal';
    if (isProprietressAuthenticated) return 'Executive Portal';
    return 'Portals';
  };

  const hasAnyAuth = isStudentAuthenticated || isAdminAuthenticated || isHeadmistressAuthenticated || isModeratorAuthenticated || isTutorAuthenticated || isParentAuthenticated || isProprietressAuthenticated;

  const navLinks: Array<{ label: string; section: PageSection }> = [
    { label: 'Home', section: 'home' },
    { label: 'About', section: 'about' },
    { label: 'Academic Programs', section: 'programs' },
    { label: 'School Life', section: 'student-life' },
    { label: 'Campus Gallery', section: 'gallery' },
    { label: 'Faculty', section: 'faculty' },
    { label: 'Academic Calendar', section: 'calendar' },
    { label: 'News & Blog', section: 'news-blog' },
    { label: 'Notices', section: 'notices' },
    { label: 'Scholar Awards', section: 'achievements' },
    { label: 'House Championship', section: 'house-championship' },
    { label: 'Contact', section: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-stone-900 text-stone-200 px-4 py-1.5 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
              Notice
            </span>
            <span className="truncate">
              Admissions Open for 2025/2026 Academic Session • Creche to SSS 3
            </span>
          </div>
          <div className="flex items-center gap-4 text-stone-300 text-[11px]">
            <a href={`tel:${schoolInfo.phone}`} className="hover:text-white flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              {schoolInfo.phone}
            </a>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-amber-300 font-bold">
              {schoolInfo.city}, {schoolInfo.state}
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center text-left group cursor-pointer focus:outline-hidden"
        >
          <SchoolLogo size="sm" showText={true} />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = activeSection === link.section;
            return (
              <button
                key={link.section}
                type="button"
                onClick={() => onNavigate(link.section)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-red-700 bg-red-50'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {onOpenTour && (
            <button
              type="button"
              onClick={onOpenTour}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Interactive Tour"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span className="hidden lg:inline">Tour</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenTuitionCalc}
            className="px-3 py-2 text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden lg:inline">Tuition Calc</span>
          </button>

          {/* Portal Access Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => onNavigate(getActivePortalTarget())}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasAnyAuth 
                  ? 'bg-amber-100 hover:bg-amber-200 text-blue-950 border border-amber-300 shadow-2xs' 
                  : 'text-stone-800 bg-stone-100 hover:bg-stone-200'
              }`}
              title={hasAnyAuth ? 'Resume your active authenticated portal' : 'Access institutional portals'}
            >
              {hasAnyAuth ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-stone-600" />
              )}
              <span>{getPortalButtonLabel()}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAdmissions}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Apply Now</span>
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={onOpenAdmissions}
            className="sm:hidden px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg shadow-xs"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-xl"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-2 shadow-lg animate-fade-in">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmissions();
              }}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-red-600 rounded-xl text-center"
            >
              Apply for Admission
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(getActivePortalTarget());
              }}
              className={`w-full py-2 px-3 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors ${
                hasAnyAuth 
                  ? 'bg-amber-100 text-blue-950 border border-amber-300 shadow-2xs' 
                  : 'text-stone-800 bg-stone-100 hover:bg-stone-200'
              }`}
            >
              {hasAnyAuth && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              <span>{hasAnyAuth ? getPortalButtonLabel() : 'Access Portals'}</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => (
              <button
                key={link.section}
                type="button"
                onClick={() => {
                  onNavigate(link.section);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                  activeSection === link.section ? 'bg-red-50 text-red-700' : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-1.5 text-xs font-semibold text-stone-600">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTuitionCalc();
              }}
              className="text-left px-3 py-1.5 hover:bg-stone-100 rounded-lg flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-stone-500" />
              Tuition Fee Calculator
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStatusTracker();
              }}
              className="text-left px-3 py-1.5 hover:bg-stone-100 rounded-lg flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-stone-500" />
              Admission Status Tracker
            </button>
            {onOpenTour && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTour();
                }}
                className="text-left px-3 py-1.5 hover:bg-stone-100 rounded-lg flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                School Interactive Tour
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
