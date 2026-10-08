import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Copy, 
  ExternalLink, 
  FileText, 
  Heart, 
  HelpCircle, 
  Lock, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Quote, 
  Send, 
  Share2, 
  ShieldCheck, 
  Star, 
  User, 
  Users, 
  ArrowLeft,
  ArrowRight,
  GraduationCap
} from './RealIcons';
import { useSchool } from '../context/SchoolContext';
import { PageSection } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface ProprietressPageProps {
  onNavigate: (section: PageSection) => void;
  onOpenAdmissions: () => void;
  onOpenTuitionCalc?: () => void;
}

export const ProprietressPage: React.FC<ProprietressPageProps> = ({
  onNavigate,
  onOpenAdmissions,
  onOpenTuitionCalc
}) => {
  const { 
    schoolInfo, 
    proprietressProfile, 
    directives, 
    bookAppointment, 
    sendMessageToProprietress 
  } = useSchool();

  // Active sub-view or tab
  const [activeTab, setActiveTab] = useState<'welcome' | 'term-address' | 'directives' | 'book-audience' | 'confidential-letter'>('welcome');

  // Appointment Form State
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [scholarName, setScholarName] = useState('');
  const [scholarGrade, setScholarGrade] = useState('');
  const [purpose, setPurpose] = useState<'Admissions & Placement' | 'Scholar Academic / Disciplinary Welfare' | 'Scholarship & Financial Aid' | 'Educational Innovation & Partnership' | 'General Executive Consultation'>('Admissions & Placement');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<'Morning (9:00 AM – 11:00 AM)' | 'Midday (11:30 AM – 1:30 PM)' | 'Afternoon (2:00 PM – 3:30 PM)'>('Morning (9:00 AM – 11:00 AM)');
  const [meetingType, setMeetingType] = useState<'In-Person (Executive Office, Ibadan)' | 'Virtual (Zoom / Phone Consultation)'>('In-Person (Executive Office, Ibadan)');
  const [notes, setNotes] = useState('');
  const [appointmentRef, setAppointmentRef] = useState<string | null>(null);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Confidential Letter Form State
  const [letterSenderName, setLetterSenderName] = useState('');
  const [letterSenderRole, setLetterSenderRole] = useState<'Parent / Guardian' | 'Current Student' | 'Alumni' | 'Faculty / Staff Member' | 'Well-Wisher / Prospective Parent'>('Parent / Guardian');
  const [letterEmail, setLetterEmail] = useState('');
  const [letterPhone, setLetterPhone] = useState('');
  const [letterCategory, setLetterCategory] = useState<'Commendation & Praise' | 'Scholar Welfare & Care' | 'Academic Suggestion' | 'School Facilities & Campus Feedback' | 'Confidential Matter' | 'Pastoral Prayer Request'>('Commendation & Praise');
  const [letterIsConfidential, setLetterIsConfidential] = useState(true);
  const [letterSubject, setLetterSubject] = useState('');
  const [letterContent, setLetterContent] = useState('');
  const [letterRef, setLetterRef] = useState<string | null>(null);
  const [isLetterSubmitting, setIsLetterSubmitting] = useState(false);

  // Copy helper
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !email || !phone || !preferredDate) {
      alert('Please complete all required fields including your contact details and preferred meeting date.');
      return;
    }

    setIsBookingSubmitting(true);
    setTimeout(() => {
      const ref = bookAppointment({
        parentName,
        email,
        phone,
        scholarName: scholarName || undefined,
        scholarGrade: scholarGrade || undefined,
        purpose,
        preferredDate,
        preferredTimeSlot,
        meetingType,
        notes
      });
      setAppointmentRef(ref);
      setIsBookingSubmitting(false);
    }, 600);
  };

  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterSenderName || !letterEmail || !letterSubject || !letterContent) {
      alert('Please provide your name, contact email, letter subject, and message.');
      return;
    }

    setIsLetterSubmitting(true);
    setTimeout(() => {
      const ref = sendMessageToProprietress({
        senderName: letterSenderName,
        senderRole: letterSenderRole,
        email: letterEmail,
        phone: letterPhone || phone || 'N/A',
        category: letterCategory,
        isConfidential: letterIsConfidential,
        subject: letterSubject,
        content: letterContent
      });
      setLetterRef(ref);
      setIsLetterSubmitting(false);
    }, 600);
  };

  const resetAppointmentForm = () => {
    setAppointmentRef(null);
    setParentName('');
    setEmail('');
    setPhone('');
    setScholarName('');
    setScholarGrade('');
    setNotes('');
    setPreferredDate('');
  };

  const resetLetterForm = () => {
    setLetterRef(null);
    setLetterSenderName('');
    setLetterEmail('');
    setLetterPhone('');
    setLetterSubject('');
    setLetterContent('');
  };

  const getExecutiveWhatsAppUrl = () => {
    const cleanNumber = (schoolInfo.whatsappNumber || '+2348034567890').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hello Office of the Proprietress, Stanbax Schools Ibadan. I would like to inquire regarding an audience / meeting with the Proprietress.`);
    return `https://wa.me/${cleanNumber}?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] font-['Nunito',sans-serif] flex flex-col">
      {/* Top Banner Navigation Header */}
      <div className="bg-neutral-950 text-white border-b border-neutral-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Main Portal</span>
            </button>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Office of the Founder & Executive Proprietress</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('book-audience')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book an Audience</span>
            </button>
            <button
              onClick={() => setActiveTab('confidential-letter')}
              className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-amber-200 border border-red-600 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Confidential Letter</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        {/* Hero Section with Official Portrait & Prestige Crest */}
        <section className="relative bg-gradient-to-br from-[#111827] via-neutral-900 to-[#450A0A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-amber-400/40">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Dignified Portrait with Gold Trim Frame */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-500" />
                  <div className="relative rounded-3xl overflow-hidden bg-slate-800 w-64 h-80 sm:w-72 sm:h-92 border-4 border-amber-400/90 shadow-2xl">
                    <img
                      src={proprietressProfile.portraitUrl}
                      alt={proprietressProfile.name}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-neutral-950/80 backdrop-blur-xs border border-amber-400/40 text-center">
                      <p className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        {proprietressProfile.title}
                      </p>
                      <p className="text-xs font-bold text-white truncate">
                        {proprietressProfile.signatureName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Official Secretariat Badges */}
                <div className="mt-6 flex flex-wrap gap-2 justify-center sm:justify-start max-w-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Founder (Est. {proprietressProfile.establishedYear})</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-bold">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Distinguished Fellow NIM</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Executive Titles, Philosophy, and Contacts */}
              <div className="lg:col-span-8 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Executive Leadership & Founder's Desk</span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    {proprietressProfile.name}
                  </h1>
                  <p className="text-amber-300 font-bold text-sm sm:text-base mt-1">
                    {proprietressProfile.honorifics}
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm italic mt-2 border-l-2 border-amber-400 pl-3">
                    "{proprietressProfile.tagline}"
                  </p>
                </div>

                {/* Executive Quote Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs relative">
                  <Quote className="w-7 h-7 text-amber-400/40 absolute top-3 right-3" />
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic pr-8">
                    "{proprietressProfile.quote}"
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-amber-300/90 font-bold pt-2 border-t border-white/5">
                    <span>— Executive Philosophy of Stanbax Schools</span>
                    <span>Ibadan, Oyo State</span>
                  </div>
                </div>

                {/* Executive Office Quick Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-slate-400 text-[11px] block font-bold">Executive Office Consultation:</span>
                    <span className="text-white font-black mt-0.5 block">{proprietressProfile.officeHours}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-slate-400 text-[11px] block font-bold">Direct Secretarial Desk:</span>
                    <span className="text-white font-black mt-0.5 block">{proprietressProfile.executivePhone}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="text-slate-400 text-[11px] block font-bold">Official Executive Email:</span>
                    <span className="text-white font-black mt-0.5 block truncate">{proprietressProfile.directEmail}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('welcome')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'welcome' 
                        ? 'bg-amber-400 text-neutral-950 shadow-md' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Welcome Message</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('term-address')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'term-address' 
                        ? 'bg-amber-400 text-neutral-950 shadow-md' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lent Term Address</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('directives')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'directives' 
                        ? 'bg-amber-400 text-neutral-950 shadow-md' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Executive Circulars ({directives.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('book-audience')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'book-audience' 
                        ? 'bg-amber-400 text-neutral-950 shadow-md' 
                        : 'bg-blue-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>Book Audience</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('confidential-letter')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'confidential-letter' 
                        ? 'bg-amber-400 text-neutral-950 shadow-md' 
                        : 'bg-red-700 hover:bg-red-800 text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Write to Proprietress</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Content Body based on activeTab */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* TAB 1: WELCOME MESSAGE & FOUNDING VISION */}
          {activeTab === 'welcome' && (
            <div className="space-y-12 animate-fade-in">
              {/* Main Welcome Letter Layout */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-[#EAE2CE]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-red-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-red-700" />
                      <span>Official Inaugural & Continuing Welcome</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                      A Warm Welcome from the Founder's Desk
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Published by {proprietressProfile.name}, Founder & Executive Proprietress
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={getExecutiveWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Executive Secretary WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Letter Body */}
                <div className="prose prose-slate max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed space-y-5">
                  {proprietressProfile.welcomeMessage.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Formal Signature & Institutional Seal */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Yours in Dedication to Child Excellence,
                    </p>
                    <div className="my-2 font-serif text-2xl font-bold text-neutral-950 tracking-wider italic">
                      {proprietressProfile.signatureName}
                    </div>
                    <p className="text-xs font-black text-neutral-900">
                      {proprietressProfile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {proprietressProfile.title}, Stanbax Schools Ibadan
                    </p>
                  </div>

                  {/* Stamp / Seal Graphic */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-amber-700 font-black text-xs text-center leading-tight">
                      SEAL<br/>2008
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-amber-900 uppercase">Executive Office Seal</p>
                      <p className="text-[11px] text-amber-700">Official Charter of Academic Distinction</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* The 5 Core Founder's Pillars */}
              <div>
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                    Foundational Heritage
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-2">
                    The 5 Pillars Established by the Proprietress
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    The guiding philosophical compass that has shaped over 1,400 accomplished scholars since 2008.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs hover:border-blue-400 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-blue-800 flex items-center justify-center font-black mb-3">
                      1
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-1">Godliness & Integrity</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Rooted in the fear of God, high moral rectitude, honesty, and empathy in all dealings.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs hover:border-emerald-400 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black mb-3">
                      2
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-1">Academic Rigor & STEM</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Tri-curriculum synergy blending Nigerian benchmarks with British standards, coding, and robotics.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs hover:border-amber-400 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-black mb-3">
                      3
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-1">Character & Etiquette</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Refined British diction, courteous social manners, punctuality, and personal grooming.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs hover:border-amber-400 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-red-700 flex items-center justify-center font-black mb-3">
                      4
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-1">Global Citizenship</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Debate prowess, Model UN simulations, and foreign languages fostering world-ready leaders.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#EAE2CE] shadow-xs hover:border-rose-400 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center font-black mb-3">
                      5
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm mb-1">Child Safety & Care</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      A zero-tolerance bullying policy, round-the-clock pediatric care, and serene gated security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vision, Mission, and Educational Philosophy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#EAE2CE] shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-red-800 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-neutral-900">Founding Vision</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {proprietressProfile.visionStatement}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EAE2CE] shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-700" />
                  </div>
                  <h4 className="text-base font-black text-neutral-900">Institutional Mission</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {proprietressProfile.missionStatement}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EAE2CE] shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-neutral-900">Educator's Philosophy</h4>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {proprietressProfile.philosophy}
                  </p>
                </div>
              </div>

              {/* Academic Background & Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2CE] shadow-xs">
                  <h4 className="text-base font-black text-neutral-900 flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-blue-800" />
                    <span>Academic & Leadership Credentials</span>
                  </h4>
                  <ul className="space-y-3">
                    {(Array.isArray(proprietressProfile.educationalBackground)
                      ? proprietressProfile.educationalBackground
                      : (typeof proprietressProfile.educationalBackground === 'string'
                        ? [proprietressProfile.educationalBackground]
                        : [
                            'B.Ed Educational Management & English (University of Ibadan)',
                            'M.Sc Educational Psychology & Curriculum Development',
                            'Fellow, Institute of Corporate Administration of Nigeria',
                            'Over 28 Years of Transformative Educational Leadership in Nigeria'
                          ])).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE2CE] shadow-xs">
                  <h4 className="text-base font-black text-neutral-900 flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span>Key Achievements & Community Honors</span>
                  </h4>
                  <ul className="space-y-3">
                    {(Array.isArray(proprietressProfile.achievements)
                      ? proprietressProfile.achievements
                      : (typeof proprietressProfile.achievements === 'string'
                        ? [proprietressProfile.achievements]
                        : [
                            'Oyo State Quality Education Leadership Award (2022)',
                            'Championed Digital Coding & STEM Integration in Primary Curriculum',
                            'Maintained 100% WASSCE & BECE Distinctions Track Record',
                            'Established Stanbax Orphanage & Scholar Hope Foundation'
                          ])).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CURRENT TERM PASTORAL ADDRESS */}
          {activeTab === 'term-address' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] rounded-3xl p-6 sm:p-10 text-white shadow-md border border-blue-800">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-wider mb-4">
                    <Award className="w-3.5 h-3.5" />
                    <span>Current Session: {schoolInfo.activeSession} • {schoolInfo.activeTerm}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Termly Address: "{proprietressProfile.termTheme}"
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2">
                    Official pastoral guidance delivered to scholars, parents, and faculty members by {proprietressProfile.name}.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-[#EAE2CE]">
                <div className="prose prose-slate max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed space-y-5">
                  {(proprietressProfile.termAddress || '').split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Term Milestones & Commitments */}
                <div className="mt-10 p-6 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE]">
                  <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider mb-4 text-red-800">
                    Key Pastoral Directives for this Term:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-700">
                    <div className="p-3 bg-white rounded-xl border border-[#EAE2CE]">
                      <span className="font-black block text-neutral-900 mb-1">1. Academic Rigor:</span>
                      Scheduled Saturday mock drills and laboratory practicals for JSS 3 and SSS 3 cohorts.
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#EAE2CE]">
                      <span className="font-black block text-neutral-900 mb-1">2. Character Building:</span>
                      Weekly morning assembly moral affirmations and zero-tolerance policy on device infractions.
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#EAE2CE]">
                      <span className="font-black block text-neutral-900 mb-1">3. Parental Partnership:</span>
                      Continuous feedback through the Parent-Teacher forum and open executive consultations.
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-neutral-800">Authorized by the Executive Secretariat, Stanbax Schools</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('book-audience')}
                    className="px-4 py-2 rounded-xl bg-red-700 text-white font-bold hover:bg-blue-800 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Request Meeting on this Address</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTIVE DIRECTIVES & CIRCULARS */}
          {activeTab === 'directives' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#EAE2CE]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Official Circulars</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                      Directives from the Proprietress Desk
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Binding guidelines, school policy updates, and pastoral memos released for all stakeholders.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {directives.map((dir) => (
                    <div
                      key={dir.id}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                        dir.isPinned 
                          ? 'bg-amber-50/70 border-amber-300 shadow-xs' 
                          : 'bg-[#FAF7EE] border-[#EAE2CE]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-red-700 text-white text-[11px] font-black">
                            {dir.refCode}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{dir.date}</span>
                          {dir.isPinned && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-neutral-950 text-[10px] font-black uppercase">
                              Pinned
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-neutral-700">
                          Target: {dir.targetAudience}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-black text-neutral-900 mb-2">
                        {dir.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 mb-3 font-medium">
                        {dir.summary}
                      </p>

                      <div className="p-3.5 rounded-xl bg-white border border-[#EAE2CE] text-xs text-neutral-700 leading-relaxed">
                        {dir.content}
                      </div>
                    </div>
                  ))}

                  {directives.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p>No active directives published at this time.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BOOK AN AUDIENCE WITH THE PROPRIETRESS */}
          {activeTab === 'book-audience' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-red-800 text-xs font-black uppercase tracking-wider mb-3">
                  <Calendar className="w-3.5 h-3.5 text-blue-800" />
                  <span>Executive Audience Request</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  Request an Audience with the Proprietress
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
                  The Proprietress maintains dedicated consultation hours for parents, prospective sponsors, and educational partners. Kindly submit this formal request to schedule your audience.
                </p>
              </div>

              {appointmentRef ? (
                <div className="bg-white rounded-3xl p-8 border-2 border-emerald-400 shadow-md text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      Audience Request Successfully Logged
                    </span>
                    <h4 className="text-2xl font-black text-neutral-900 mt-3">
                      Thank You, {parentName}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-2">
                      Your request has been delivered directly to the Executive Secretarial Office of the Proprietress. You will receive an official confirmation via SMS/Email within 24 hours.
                    </p>
                  </div>

                  {/* Reference Number Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] max-w-sm mx-auto flex items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Tracking Reference:</span>
                      <span className="font-mono text-base font-black text-neutral-950">{appointmentRef}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(appointmentRef)}
                      className="p-2 rounded-lg bg-white border border-[#EAE2CE] hover:bg-slate-100 text-neutral-700 transition cursor-pointer"
                      title="Copy Reference"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={`https://wa.me/${(schoolInfo.whatsappNumber || '+2348034567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Secretariat, I have submitted an audience request with the Proprietress under reference: ${appointmentRef}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Notify Secretary via WhatsApp</span>
                    </a>
                    <button
                      onClick={resetAppointmentForm}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-neutral-800 font-bold text-xs transition cursor-pointer"
                    >
                      Book Another Meeting
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAppointmentSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#EAE2CE] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Full Name / Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Dr. Mrs. Funke Adeleke"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Active Phone / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +234 803 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. parent@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Purpose of Audience <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="Admissions & Placement">Admissions & Placement</option>
                        <option value="Scholar Academic / Disciplinary Welfare">Scholar Academic / Disciplinary Welfare</option>
                        <option value="Scholarship & Financial Aid">Scholarship & Financial Aid</option>
                        <option value="Educational Innovation & Partnership">Educational Innovation & Partnership</option>
                        <option value="General Executive Consultation">General Executive Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Scholar Name (If applicable)
                      </label>
                      <input
                        type="text"
                        value={scholarName}
                        onChange={(e) => setScholarName(e.target.value)}
                        placeholder="e.g. Tunde Adeleke"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Scholar Class / Grade (If applicable)
                      </label>
                      <input
                        type="text"
                        value={scholarGrade}
                        onChange={(e) => setScholarGrade(e.target.value)}
                        placeholder="e.g. Basic 5 / JSS 2 / SSS 1"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Preferred Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Preferred Time Slot <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={preferredTimeSlot}
                        onChange={(e) => setPreferredTimeSlot(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="Morning (9:00 AM – 11:00 AM)">Morning (9:00 AM – 11:00 AM)</option>
                        <option value="Midday (11:30 AM – 1:30 PM)">Midday (11:30 AM – 1:30 PM)</option>
                        <option value="Afternoon (2:00 PM – 3:30 PM)">Afternoon (2:00 PM – 3:30 PM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Consultation Mode <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={meetingType}
                        onChange={(e) => setMeetingType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="In-Person (Executive Office, Ibadan)">In-Person (Executive Office, Ibadan)</option>
                        <option value="Virtual (Zoom / Phone Consultation)">Virtual (Zoom / Phone Consultation)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Brief Description / Agenda for the Proprietress
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Please outline the key points you would like to discuss with the Proprietress..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isBookingSubmitting}
                      className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isBookingSubmitting ? (
                        <span>Logging Audience Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Submit Official Request to Proprietress Desk</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      Formal notifications are dispatched via encrypted email to the Executive Secretariat.
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: CONFIDENTIAL LETTER TO THE PROPRIETRESS */}
          {activeTab === 'confidential-letter' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-red-800 text-xs font-black uppercase tracking-wider mb-3">
                  <Lock className="w-3.5 h-3.5 text-red-700" />
                  <span>The Proprietress's Confidential Letterbox</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                  Direct Confidential Letter to Mummy Proprietress
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto">
                  An unmediated, private communication channel allowing parents, teachers, and alumni to communicate praises, pastoral prayer requests, or sensitive welfare matters directly to the Founder.
                </p>
              </div>

              {letterRef ? (
                <div className="bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-md text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-red-700 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-red-700 bg-amber-50 px-3 py-1 rounded-full">
                      Confidential Letter Dispatched
                    </span>
                    <h4 className="text-2xl font-black text-neutral-900 mt-3">
                      Received with Discretion, {letterSenderName}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-2">
                      Your letter has been encrypted and deposited into the private inbox of Deaconess (Dr.) Mrs. Funmilayo Adeleke. It will be reviewed with utmost care and pastoral discretion.
                    </p>
                  </div>

                  {/* Reference Number Card */}
                  <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] max-w-sm mx-auto flex items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Letter Tracking Code:</span>
                      <span className="font-mono text-base font-black text-neutral-950">{letterRef}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(letterRef)}
                      className="p-2 rounded-lg bg-white border border-[#EAE2CE] hover:bg-slate-100 text-neutral-700 transition cursor-pointer"
                      title="Copy Code"
                    >
                      {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={resetLetterForm}
                      className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Write Another Letter
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLetterSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#EAE2CE] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={letterSenderName}
                        onChange={(e) => setLetterSenderName(e.target.value)}
                        placeholder="e.g. Mrs. Titilayo Alabi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Relationship to the School <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={letterSenderRole}
                        onChange={(e) => setLetterSenderRole(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none bg-white font-medium"
                      >
                        <option value="Parent / Guardian">Parent / Guardian</option>
                        <option value="Current Student">Current Student</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Faculty / Staff Member">Faculty / Staff Member</option>
                        <option value="Well-Wisher / Prospective Parent">Well-Wisher / Prospective Parent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Email Address for Confidential Reply <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={letterEmail}
                        onChange={(e) => setLetterEmail(e.target.value)}
                        placeholder="e.g. confidential@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Telephone / WhatsApp Contact
                      </label>
                      <input
                        type="tel"
                        value={letterPhone}
                        onChange={(e) => setLetterPhone(e.target.value)}
                        placeholder="e.g. +234 802 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Category of Communication <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={letterCategory}
                        onChange={(e) => setLetterCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none bg-white font-medium"
                      >
                        <option value="Commendation & Praise">Commendation & Praise</option>
                        <option value="Scholar Welfare & Care">Scholar Welfare & Care</option>
                        <option value="Academic Suggestion">Academic Suggestion</option>
                        <option value="School Facilities & Campus Feedback">School Facilities & Campus Feedback</option>
                        <option value="Confidential Matter">Confidential Matter</option>
                        <option value="Pastoral Prayer Request">Pastoral Prayer Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Letter Subject <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={letterSubject}
                        onChange={(e) => setLetterSubject(e.target.value)}
                        placeholder="e.g. Commendation regarding the Music & Arts Dept"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Letter Content / Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={letterContent}
                      onChange={(e) => setLetterContent(e.target.value)}
                      placeholder="Write directly to the Proprietress with complete assurance of privacy..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-400 focus:border-red-700 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7EE] border border-[#EAE2CE] text-xs text-neutral-700">
                    <input
                      type="checkbox"
                      id="confidentialCheck"
                      checked={letterIsConfidential}
                      onChange={(e) => setLetterIsConfidential(e.target.checked)}
                      className="w-4 h-4 text-red-700 rounded-sm focus:ring-amber-400 focus:border-red-700"
                    />
                    <label htmlFor="confidentialCheck" className="font-semibold cursor-pointer">
                      Keep this communication strictly confidential between me and the Proprietress
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLetterSubmitting}
                      className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLetterSubmitting ? (
                        <span>Transmitting Sealed Letter...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>Transmit Sealed Letter to Proprietress</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>

        {/* Quick Institutional Action Strip */}
        <section className="bg-[#111827] border-t border-neutral-800 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-amber-400 text-xs font-black uppercase tracking-wider block">
                Inspiring Excellence Since {proprietressProfile.establishedYear}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Ready to Enroll Your Child at {schoolInfo.name}?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Admissions are currently underway for Creche, Primary, and Junior/Senior Secondary College.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAdmissions}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs shadow-md transition cursor-pointer"
              >
                Enroll Online Now
              </button>
              {onOpenTuitionCalc && (
                <button
                  onClick={onOpenTuitionCalc}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Estimate Tuition Fees
                </button>
              )}
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white border border-blue-700 font-bold text-xs transition cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
