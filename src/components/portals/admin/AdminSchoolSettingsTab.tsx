import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Building2, 
  Calendar, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  Award, 
  ChevronRight, 
  Upload,
  School as SchoolIcon,
  Database,
  Cloud,
  Globe,
  ExternalLink,
  Copy,
  Check
} from '../../RealIcons';
import { SchoolLogo } from '../../SchoolLogo';
import { compressImageFile } from '../../../utils/imageUploadHelper';
import { DEFAULT_IMAGES } from '../../../data/schoolData';
import { isRemoteEnabled } from '../../../lib/supabase';
import { NetlifyCloudSyncModal } from './NetlifyCloudSyncModal';
import schemaSql from '../../../../supabase/schema.sql?raw';

export const AdminSchoolSettingsTab: React.FC = () => {
  const { 
    schoolInfo, 
    updateSchoolInfo, 
    updateImage,
    assessmentConfig,
    updateAssessmentConfig,
    termResumptionConfig,
    setTermResumptionDate,
    setTermStartDate,
    resetDailyAttendanceCounter,
    startNewTerm,
    attendanceRecords,
    classes,
    getClassAttendanceSummary
  } = useSchool();

  const [formInfo, setFormInfo] = useState({
    name: schoolInfo.name,
    shortName: schoolInfo.shortName || 'Stanbax Schools',
    motto: schoolInfo.motto,
    logoUrl: schoolInfo.logoUrl || '',
    address: schoolInfo.address,
    city: schoolInfo.city,
    state: schoolInfo.state,
    phone: schoolInfo.phone,
    email: schoolInfo.email,
    whatsapp: schoolInfo.whatsapp,
    activeSession: schoolInfo.activeSession,
    activeTerm: schoolInfo.activeTerm,
    resumptionDate: schoolInfo.resumptionDate || termResumptionConfig?.termStartDate || '2026-09-15',
    vacationDate: schoolInfo.vacationDate || termResumptionConfig?.termEndDate || '2026-12-18'
  });

  const logoSettingsInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 600, 600, 0.9);
      setFormInfo(prev => ({ ...prev, logoUrl: dataUrl }));
      updateSchoolInfo({ logoUrl: dataUrl });
      updateImage('crest', dataUrl);
      setStatusMsg('School logo uploaded and updated across the entire institution!');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Dedicated Term Start Date control state
  const [termControlStartDate, setTermControlStartDate] = useState(
    termResumptionConfig?.termStartDate || schoolInfo.resumptionDate || '2026-09-15'
  );
  const [termControlEndDate, setTermControlEndDate] = useState(
    termResumptionConfig?.termEndDate || schoolInfo.vacationDate || '2026-12-18'
  );
  const [termControlTermName, setTermControlTermName] = useState(
    termResumptionConfig?.termName || '1st Term'
  );

  // New Term Form state
  const [newTermModalOpen, setNewTermModalOpen] = useState(false);
  const [newTermName, setNewTermName] = useState<'1st Term' | '2nd Term' | '3rd Term'>('1st Term');
  const [newTermStartDate, setNewTermStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTermEndDate, setNewTermEndDate] = useState('2026-12-18');
  const [newTermSession, setNewTermSession] = useState(assessmentConfig.activeSession || '2025/2026 Academic Session');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showSyncAssistant, setShowSyncAssistant] = useState(false);

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo(formInfo);
    // Sync term resumption date & bounds
    if (formInfo.resumptionDate) {
      setTermStartDate(formInfo.resumptionDate, {
        termName: formInfo.activeTerm,
        termEndDate: formInfo.vacationDate,
        sessionName: formInfo.activeSession,
        shouldResetAttendance: false
      });
    }
    setSavedSuccess(true);
    setStatusMsg('School profile and operational parameters saved successfully.');
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleDirectSetTermStartDate = (e: React.FormEvent) => {
    e.preventDefault();
    setTermStartDate(termControlStartDate, {
      termName: termControlTermName,
      termEndDate: termControlEndDate,
      sessionName: termResumptionConfig?.session || schoolInfo.activeSession,
      shouldResetAttendance: true
    });
    setFormInfo(prev => ({
      ...prev,
      resumptionDate: termControlStartDate,
      vacationDate: termControlEndDate,
      activeTerm: termControlTermName
    }));
    setSavedSuccess(true);
    setStatusMsg(
      `Term Start Date updated to ${termControlStartDate} (${termControlTermName})! The daily attendance counter for teachers has been automatically reset, and roll call starts at Day 1.`
    );
    setTimeout(() => setSavedSuccess(false), 5500);
  };

  const handleManualResetAttendance = () => {
    if (
      confirm(
        'Are you sure you want to reset the daily attendance counter for teachers? This will archive existing attendance logs and reset student cumulative attendance tallies to 0 for a fresh term cycle.'
      )
    ) {
      resetDailyAttendanceCounter();
      setSavedSuccess(true);
      setStatusMsg('Daily attendance counter has been manually reset for teachers.');
      setTimeout(() => setSavedSuccess(false), 4500);
    }
  };

  const handleStartNewTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startNewTerm(newTermName, newTermStartDate, newTermSession);
    setTermStartDate(newTermStartDate, {
      termName: newTermName,
      termEndDate: newTermEndDate,
      sessionName: newTermSession,
      shouldResetAttendance: true
    });
    setFormInfo(prev => ({
      ...prev,
      activeTerm: `${newTermName} ${newTermName === '1st Term' ? '(Michaelmas Term)' : newTermName === '2nd Term' ? '(Lent Term)' : '(Trinity Term)'}`,
      activeSession: newTermSession,
      resumptionDate: newTermStartDate,
      vacationDate: newTermEndDate
    }));
    setNewTermModalOpen(false);
    setSavedSuccess(true);
    setStatusMsg(
      `New academic term (${newTermName}) successfully launched! Daily attendance counter reset to Day 1 starting from ${newTermStartDate}. Class teachers can now mark attendance.`
    );
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  // Calculate overall attendance stats
  const totalDailyLogs = attendanceRecords.length;
  const activeTermLogs = attendanceRecords.filter(r => 
    r.term?.toLowerCase().includes((schoolInfo.activeTerm || 'term').toLowerCase()) ||
    (termResumptionConfig?.termName && r.term?.toLowerCase().includes(termResumptionConfig.termName.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <SchoolIcon className="w-5 h-5 text-red-600" />
            School Settings & Term Resumption Control
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Configure institutional profile, term calendar dates, and synchronize class teacher attendance schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNewTermModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Start New Term / Set Resumption Date
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Term Resumption & Attendance Status Card */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-stone-50 p-6 rounded-2xl border border-amber-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Active Academic Term & Attendance Status
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {termResumptionConfig?.termName || schoolInfo.activeTerm} • {termResumptionConfig?.session || schoolInfo.activeSession}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center gap-1.5 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Attendance System Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500 uppercase">Term Resumption Date</div>
            <div className="text-base font-bold text-stone-900 mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              {termResumptionConfig?.termStartDate || formInfo.resumptionDate || 'Sep 15, 2026'}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Marking starts from Day 1
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500 uppercase">Total Marked Registers</div>
            <div className="text-base font-bold text-stone-900 mt-1">
              {activeTermLogs.length} Sessions Logged
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Across all enrolled school classes
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500 uppercase">Enrolled Classes</div>
            <div className="text-base font-bold text-stone-900 mt-1">
              {classes.length} Academic Classes
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Early Years, Primary & Secondary
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200/80">
            <div className="text-[11px] font-bold text-stone-500 uppercase">Teacher Marking Status</div>
            <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Real-time Sync Active
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Aggregates student total attendance
            </div>
          </div>
        </div>

        {/* Quick Summary of Classes Attendance */}
        <div className="mt-6 pt-5 border-t border-stone-200/70">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-500" />
            Class-by-Class Attendance Snapshot
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {classes.slice(0, 6).map(cls => {
              const summary = getClassAttendanceSummary(cls.id);
              return (
                <div key={cls.id} className="bg-white p-3 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{cls.name}</div>
                    <div className="text-stone-500 text-[11px]">{cls.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {summary.totalDaysMarked > 0 ? `${summary.classAverageAttendancePercent}% Avg` : 'Pending'}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-0.5">{summary.totalDaysMarked} days marked</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Set Term Start Date & Attendance Counter Control Panel */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-sm">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Administrator Attendance Counter Control</span>
              </div>
              <h3 className="text-lg font-black text-stone-900">
                Set Term Start Date & Synchronize Teacher Attendance Counter
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualResetAttendance}
              className="px-3.5 py-2 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Counter Only</span>
            </button>
          </div>
        </div>

        <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 leading-relaxed">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-amber-900">Automated Attendance Counter Reset: </span>
            Setting or updating the <strong>Term Start Date</strong> will automatically trigger the resetting of the daily attendance counter for teachers to 0, initializing Day 1 on the designated resumption date. Class teachers' marking forms will automatically validate against this date range and prevent recording attendance outside the active term dates.
          </div>
        </div>

        <form onSubmit={handleDirectSetTermStartDate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Active Academic Term</label>
            <select
              value={termControlTermName}
              onChange={(e) => setTermControlTermName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="1st Term">1st Term (Michaelmas Term)</option>
              <option value="2nd Term">2nd Term (Lent Term)</option>
              <option value="3rd Term">3rd Term (Trinity Term)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Term Start Date (Triggers Reset)
            </label>
            <input
              type="date"
              value={termControlStartDate}
              onChange={(e) => setTermControlStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs font-black bg-stone-50 border border-amber-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 text-stone-900"
            />
            <span className="text-[10px] text-amber-700 font-bold block mt-1">
              Currently: {termResumptionConfig?.termStartDate || schoolInfo.resumptionDate || '2026-09-15'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Term Vacation / End Date
            </label>
            <input
              type="date"
              value={termControlEndDate}
              onChange={(e) => setTermControlEndDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs font-black bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 text-stone-900"
            />
            <span className="text-[10px] text-stone-500 font-bold block mt-1">
              Currently: {termResumptionConfig?.termEndDate || schoolInfo.vacationDate || '2026-12-18'}
            </span>
          </div>

          <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
            <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Current Status: Counter active, Day 1 anchored to {termResumptionConfig?.termStartDate || schoolInfo.resumptionDate || '2026-09-15'}</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Set Term Start Date & Auto-Reset Attendance Counter</span>
            </button>
          </div>
        </form>
      </div>

      {/* School Information Form */}
      <form onSubmit={handleSaveGeneralSettings} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-600" />
          Institutional Profile & Contact Information
        </h3>

        {/* School Logo & Branding Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-400 flex items-center justify-center p-1">
                {formInfo.logoUrl ? (
                  <img src={formInfo.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
                ) : (
                  <SchoolLogo size="lg" showText={false} />
                )}
              </div>
            </div>
            <div>
              <div className="text-xs font-black uppercase text-amber-800 tracking-wider">Official Institutional Logo</div>
              <div className="text-sm font-bold text-stone-900 mt-0.5">{formInfo.name}</div>
              <div className="text-xs text-stone-500">Visible on Navbar, Footer, Scholar ID Badges, and Terminal Slips.</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input 
              type="file"
              ref={logoSettingsInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              type="button"
              onClick={() => logoSettingsInputRef.current?.click()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Logo</span>
            </button>
            {formInfo.logoUrl && (
              <button
                type="button"
                onClick={() => {
                  setFormInfo(prev => ({ ...prev, logoUrl: '' }));
                  updateSchoolInfo({ logoUrl: '' });
                  updateImage('crest', DEFAULT_IMAGES.crest);
                }}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold rounded-xl"
              >
                Reset Crest
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">School Name</label>
            <input
              type="text"
              value={formInfo.name}
              onChange={e => setFormInfo({ ...formInfo, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Motto / Slogan</label>
            <input
              type="text"
              value={formInfo.motto}
              onChange={e => setFormInfo({ ...formInfo, motto: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">Physical School Address</label>
            <input
              type="text"
              value={formInfo.address}
              onChange={e => setFormInfo({ ...formInfo, address: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
            <input
              type="text"
              value={formInfo.city}
              onChange={e => setFormInfo({ ...formInfo, city: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">State & Country</label>
            <input
              type="text"
              value={`${formInfo.state}, Nigeria`}
              onChange={e => setFormInfo({ ...formInfo, state: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Official Phone Number</label>
            <input
              type="text"
              value={formInfo.phone}
              onChange={e => setFormInfo({ ...formInfo, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Official Email Address</label>
            <input
              type="email"
              value={formInfo.email}
              onChange={e => setFormInfo({ ...formInfo, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Desk Number</label>
            <input
              type="text"
              value={formInfo.whatsapp}
              onChange={e => setFormInfo({ ...formInfo, whatsapp: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Default Term Resumption Date</label>
            <input
              type="date"
              value={formInfo.resumptionDate}
              onChange={e => setFormInfo({ ...formInfo, resumptionDate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-stone-100">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Institutional Profile
          </button>
        </div>
      </form>

      {/* Multi-Device Cloud Database Sync & Netlify Status */}
      <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
        isRemoteEnabled()
          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          : 'bg-gradient-to-br from-amber-50/90 via-stone-50 to-orange-50/80 border-amber-300 text-stone-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-4 border-stone-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md shrink-0 ${
              isRemoteEnabled() ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'
            }`}>
              <Database className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isRemoteEnabled()
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-amber-200 text-amber-950 border border-amber-300'
                }`}>
                  {isRemoteEnabled() ? 'Live Cloud Database Connected' : 'Offline / Single-Browser Mode'}
                </span>
                <span className="text-xs text-stone-500 font-bold">
                  {isRemoteEnabled() ? 'Multi-Device Sync Active' : 'LocalStorage Cache Only'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 mt-1">
                {isRemoteEnabled()
                  ? 'All Devices & Browsers Are Synchronized in Real-Time'
                  : 'Why changes do not appear on other browsers & How to fix on Netlify'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSyncAssistant(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cloud Sync Assistant</span>
            </button>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        </div>

        {isRemoteEnabled() ? (
          <div className="space-y-2 text-xs text-emerald-900">
            <p className="font-semibold leading-relaxed">
              Your Netlify deployment is connected to your central cloud database! Any student registered, grade entered, or exam published is instantly stored in PostgreSQL and accessible from every smartphone, tablet, or PC.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 leading-relaxed font-medium">
              <strong>Why this happens:</strong> By default on Netlify, website data is saved into your current browser’s temporary storage (<code className="font-mono bg-white px-1 py-0.5 rounded">localStorage</code>). When you register a new student or make changes, it only exists on that specific browser. To make all data visible on every browser, phone, and computer, connect your free Supabase PostgreSQL database.
            </div>

            <div className="space-y-3">
              <h4 className="font-black text-stone-900 text-xs uppercase tracking-wider">
                Quick 3-Minute Setup on Netlify:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="font-black text-amber-700 block text-xs">Step 1: Free Supabase Project</span>
                  <p className="text-stone-600 leading-snug">
                    Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold">supabase.com</a>, create a free account, and create a new project.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="font-black text-amber-700 block text-xs">Step 2: Run Database Schema</span>
                  <p className="text-stone-600 leading-snug">
                    Open Supabase <strong>SQL Editor</strong>, paste <code className="font-mono text-purple-700 font-bold">schema.sql</code>, and click <strong>Run</strong> once.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(schemaSql);
                      setCopiedSchema(true);
                      setTimeout(() => setCopiedSchema(false), 2500);
                    }}
                    className="w-full mt-2 py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {copiedSchema ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-300" />}
                    <span>{copiedSchema ? 'SQL Schema Copied!' : 'Copy SQL Schema'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1.5 shadow-2xs">
                  <span className="font-black text-amber-700 block text-xs">Step 3: Add Variables & Deploy</span>
                  <p className="text-stone-600 leading-snug">
                    In your Netlify Dashboard: <strong>Site settings → Environment variables</strong>. Add the 2 variables below and click <strong>Trigger deploy</strong>.
                  </p>
                </div>
              </div>

              {/* Environment Variable Copy Boxes */}
              <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 space-y-3 shadow-inner">
                <span className="font-mono text-[11px] text-amber-400 font-bold block uppercase tracking-wider">
                  Netlify Environment Variables to Add:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans font-bold">Variable 1 Name</span>
                      <span className="text-emerald-400 font-bold">VITE_SUPABASE_URL</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('VITE_SUPABASE_URL');
                        setCopiedVar('VITE_SUPABASE_URL');
                        setTimeout(() => setCopiedVar(null), 2000);
                      }}
                      className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-white text-[10px] font-sans font-bold cursor-pointer"
                    >
                      {copiedVar === 'VITE_SUPABASE_URL' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-sans font-bold">Variable 2 Name</span>
                      <span className="text-emerald-400 font-bold">VITE_SUPABASE_ANON_KEY</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('VITE_SUPABASE_ANON_KEY');
                        setCopiedVar('VITE_SUPABASE_ANON_KEY');
                        setTimeout(() => setCopiedVar(null), 2000);
                      }}
                      className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-white text-[10px] font-sans font-bold cursor-pointer"
                    >
                      {copiedVar === 'VITE_SUPABASE_ANON_KEY' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 font-sans">
                  Obtain these values from your Supabase Dashboard: Project Settings → <strong>API</strong> (Project URL and Anon / Public API Key).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start New Term / Set Date Modal */}
      {newTermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900">Start New Term / Set Resumption Date</h3>
                <p className="text-xs text-stone-500">Initialize attendance register from Day 1</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 mb-5 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
              Setting a new term resumption date resets the attendance sequence so class teachers mark attendance from the <strong>first day (Day 1)</strong> after term resumption. All total student attendance summaries will calculate continuously for this new term.
            </p>

            <form onSubmit={handleStartNewTermSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Select Academic Term</label>
                <select
                  value={newTermName}
                  onChange={e => setNewTermName(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                  <option value="1st Term">1st Term (Michaelmas Term - September Resumption)</option>
                  <option value="2nd Term">2nd Term (Lent Term - January Resumption)</option>
                  <option value="3rd Term">3rd Term (Trinity Term - April Resumption)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Academic Session</label>
                <input
                  type="text"
                  value={newTermSession}
                  onChange={e => setNewTermSession(e.target.value)}
                  placeholder="e.g. 2025/2026 Academic Session"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Term Resumption Date (Day 1 Starts Here)</label>
                <input
                  type="date"
                  value={newTermStartDate}
                  onChange={e => setNewTermStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Term Vacation / End Date</label>
                <input
                  type="date"
                  value={newTermEndDate}
                  onChange={e => setNewTermEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewTermModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Launch Term Day 1
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloud Sync Setup & Data Migration Assistant Modal */}
      <NetlifyCloudSyncModal
        isOpen={showSyncAssistant}
        onClose={() => setShowSyncAssistant(false)}
      />
    </div>
  );
};
