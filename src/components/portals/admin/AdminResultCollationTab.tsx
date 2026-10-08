import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Sliders, 
  TrendingUp, 
  GraduationCap, 
  Calendar, 
  Users, 
  AlertCircle,
  Clock,
  Printer,
  RotateCcw
} from '../../RealIcons';

export const AdminResultCollationTab: React.FC = () => {
  const { 
    assessmentConfig, 
    updateAssessmentConfig, 
    setActiveAssessmentPhase, 
    setActiveAssessmentTerm, 
    setPromotionPassMark,
    toggleAutoRanking,
    getClassRankings,
    students,
    classes,
    schoolInfo
  } = useSchool();

  const [passMark, setPassMark] = useState<number>(assessmentConfig.promotionPassMarkPercent || 50);
  const [ca1Max, setCa1Max] = useState<number>(assessmentConfig.ca1Max ?? 10);
  const [ca2Max, setCa2Max] = useState<number>(assessmentConfig.ca2Max ?? 10);
  const [ca3Max, setCa3Max] = useState<number>(assessmentConfig.ca3Max ?? 10);
  const [examMax, setExamMax] = useState<number>(assessmentConfig.examMax ?? 70);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [selectedRankingClass, setSelectedRankingClass] = useState<string>('JSS 1 Gold');

  const totalAssessmentMax = Number(ca1Max) + Number(ca2Max) + Number(ca3Max) + Number(examMax);

  const isAutoRankingOn = assessmentConfig.autoRankingEnabled !== false;
  const currentClassRankings = getClassRankings(selectedRankingClass, assessmentConfig.activeTerm);

  const handlePhaseChange = (phase: any) => {
    setActiveAssessmentPhase(phase);
    setSuccessMsg(`Assessment phase successfully updated to ${phase.replace('_', ' ').toUpperCase()}.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleTermChange = (term: any) => {
    setActiveAssessmentTerm(term);
    setSuccessMsg(`Active assessment term switched to ${term}.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSavePassMark = (e: React.FormEvent) => {
    e.preventDefault();
    setPromotionPassMark(passMark);
    setSuccessMsg(`Official promotion pass threshold set to ${passMark}%.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveMarksBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    updateAssessmentConfig({
      ca1Max: Number(ca1Max),
      ca2Max: Number(ca2Max),
      ca3Max: Number(ca3Max),
      examMax: Number(examMax),
    });
    setSuccessMsg(`Assessment score breakdown saved: CA1 (${ca1Max}), CA2 (${ca2Max}), CA3 (${ca3Max}), Exam (${examMax}) = Total ${totalAssessmentMax} marks.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetMarksToDefault = () => {
    setCa1Max(10);
    setCa2Max(10);
    setCa3Max(10);
    setExamMax(70);
    updateAssessmentConfig({
      ca1Max: 10,
      ca2Max: 10,
      ca3Max: 10,
      examMax: 70,
    });
    setSuccessMsg('Assessment marks restored to standard 10 + 10 + 10 + 70 = 100 marks structure.');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handlePublicationToggle = (kind: 'mid' | 'end') => {
    if (kind === 'mid') {
      const next = !assessmentConfig.midTermResultsPublished;
      updateAssessmentConfig({
        midTermResultsPublished: next,
        midTermPublishedAt: next ? new Date().toISOString() : undefined,
      });
      setSuccessMsg(next
        ? 'Mid-Term report card (CA 1 + CA 2) published — now live on scholar & parent dashboards.'
        : 'Mid-Term report card unpublished — hidden from scholar & parent dashboards.');
    } else {
      const next = !assessmentConfig.endTermResultsPublished;
      updateAssessmentConfig({
        endTermResultsPublished: next,
        endTermPublishedAt: next ? new Date().toISOString() : undefined,
      });
      setSuccessMsg(next
        ? 'End-of-Term report card (CA 1–3 + Examination) published — now live on scholar & parent dashboards.'
        : 'End-of-Term report card unpublished — hidden from scholar & parent dashboards.');
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-blue-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 fill-blue-950" />
              <span>Continuous Assessment & Results Engine</span>
            </span>
            <span className="text-xs font-bold text-slate-300">• Terminal Collation Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Academic Scoring & Promotion Moderation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Control the academic assessment timeline across CA tests, terminal exams, pass-mark thresholds, and session promotions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-white/10 text-amber-300 border border-white/10 text-xs font-black">
            Pass Mark: {assessmentConfig.promotionPassMarkPercent}%
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Assessment Entry Phase */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-800" />
            <h3 className="font-black text-slate-900 text-sm">Active Assessment Phase</h3>
          </div>

          <p className="text-slate-500">
            Controls what faculty tutors are permitted to enter in their gradebooks:
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handlePhaseChange('mid_term_ca')}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                assessmentConfig.activePhase === 'mid_term_ca'
                  ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-black text-xs">
                <span>Mid-Term CA Entry</span>
                {assessmentConfig.activePhase === 'mid_term_ca' && <CheckCircle2 className="w-4 h-4 text-blue-800" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-normal">
                Tutors enter 1st and 2nd continuous assessment test marks. Exams are locked.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handlePhaseChange('terminal_exam')}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                assessmentConfig.activePhase === 'terminal_exam'
                  ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-black text-xs">
                <span>Terminal Examination Entry</span>
                {assessmentConfig.activePhase === 'terminal_exam' && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-normal">
                Tutors enter 3rd CA and final examination marks. CA 1 & 2 remain preserved.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handlePhaseChange('closed')}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                assessmentConfig.activePhase === 'closed'
                  ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-black text-xs">
                <span>Collation Closed / Locked</span>
                {assessmentConfig.activePhase === 'closed' && <CheckCircle2 className="w-4 h-4 text-rose-700" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-normal">
                All score entry locked for administrative report card collation and review.
              </p>
            </button>
          </div>
        </div>

        {/* Panel 1B: Results Publication Control */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-4 h-4 text-emerald-700" />
            <h3 className="font-black text-slate-900 text-sm">Report Card Publication</h3>
          </div>

          <p className="text-slate-500">
            Controls when results appear on scholar and parent dashboards. Unpublished results stay hidden even if scores are collated.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handlePublicationToggle('mid')}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                assessmentConfig.midTermResultsPublished
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-black text-xs">
                <span>Mid-Term Report (CA 1 + CA 2)</span>
                {assessmentConfig.midTermResultsPublished
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  : <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-normal">
                {assessmentConfig.midTermResultsPublished
                  ? `Live on scholar dashboards${assessmentConfig.midTermPublishedAt ? ` since ${new Date(assessmentConfig.midTermPublishedAt).toLocaleString()}` : ''}. Tap to unpublish.`
                  : 'Hidden from scholars. Tap to publish the mid-term CA summary card.'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handlePublicationToggle('end')}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                assessmentConfig.endTermResultsPublished
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between font-black text-xs">
                <span>End-of-Term Report (CA 1–3 + Exam)</span>
                {assessmentConfig.endTermResultsPublished
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  : <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-normal">
                {assessmentConfig.endTermResultsPublished
                  ? `Live on scholar dashboards${assessmentConfig.endTermPublishedAt ? ` since ${new Date(assessmentConfig.endTermPublishedAt).toLocaleString()}` : ''}. Tap to unpublish.`
                  : 'Hidden from scholars. Tap to publish the full terminal report card.'}
              </p>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            Tip: set the phase to "Collation Closed" before publishing to freeze score entry first.
          </p>
        </div>

        {/* Panel 2: Term and Session Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-indigo-800" />
            <h3 className="font-black text-slate-900 text-sm">Term & Academic Year</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Active Session</label>
              <input
                type="text"
                value={schoolInfo.activeSession}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assessment Term</label>
              <div className="space-y-1.5">
                {(['1st Term', '2nd Term', '3rd Term'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTermChange(t)}
                    className={`w-full text-left p-2.5 rounded-xl border font-bold flex items-center justify-between cursor-pointer ${
                      assessmentConfig.activeTerm === t
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t}</span>
                    {assessmentConfig.activeTerm === t && (
                      <span className="text-[10px] bg-indigo-200 text-indigo-950 px-2 py-0.5 rounded-full font-black">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {assessmentConfig.activeTerm === '3rd Term' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-[11px] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>3rd Term calculates the 3-term cumulative annual average for scholar promotion.</span>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Promotion Pass Mark Threshold */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="font-black text-slate-900 text-sm">Pass Mark & Promotion Standard</h3>
          </div>

          <form onSubmit={handleSavePassMark} className="space-y-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Minimum Annual Average for Automatic Promotion (%):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={40}
                  max={75}
                  value={passMark}
                  onChange={e => setPassMark(Number(e.target.value))}
                  className="w-24 p-2.5 rounded-xl border border-slate-300 font-black text-sm text-center"
                />
                <span className="font-bold text-slate-500">%</span>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer"
                >
                  Update
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Scholars scoring below this cumulative annual threshold in 3rd term will be marked for repeat/probation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Enrolled Student Body</span>
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Active Scholars:</span>
                <span className="font-black text-slate-900">{students.filter(s => !s.isAlumni).length}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Alumni Graduated:</span>
                <span className="font-black text-slate-900">{students.filter(s => s.isAlumni).length}</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Panel 4: CA Tests & Examination Maximum Marks Allocation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-blue-600 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-black shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <span>Score Structure Moderation</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                Continuous Assessment (CA) & Examination Score Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Configure the maximum mark allocations for Continuous Assessment tests and terminal exams across all student gradebooks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetMarksToDefault}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to 10/10/10/70 standard"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 10/10/10/70</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveMarksBreakdown} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CA 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                1st CA Test Max Marks
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={ca1Max}
                  onChange={e => setCa1Max(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-base text-blue-900 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                />
                <span className="text-xs font-bold text-slate-400">pts</span>
              </div>
              <p className="text-[11px] text-slate-500">First Continuous Assessment</p>
            </div>

            {/* CA 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                2nd CA Test Max Marks
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={ca2Max}
                  onChange={e => setCa2Max(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-base text-blue-900 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                />
                <span className="text-xs font-bold text-slate-400">pts</span>
              </div>
              <p className="text-[11px] text-slate-500">Mid-term Continuous Assessment</p>
            </div>

            {/* CA 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                3rd CA Test Max Marks
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  required
                  value={ca3Max}
                  onChange={e => setCa3Max(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-base text-blue-900 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                />
                <span className="text-xs font-bold text-slate-400">pts</span>
              </div>
              <p className="text-[11px] text-slate-500">Project / Assignment CA</p>
            </div>

            {/* Exam */}
            <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 space-y-2">
              <label className="block text-xs font-bold text-amber-950">
                Terminal Examination Max
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={100}
                  required
                  value={examMax}
                  onChange={e => setExamMax(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 font-black text-base text-amber-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <span className="text-xs font-bold text-amber-700">pts</span>
              </div>
              <p className="text-[11px] text-amber-800">Final Term Examination Paper</p>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-black ${
                totalAssessmentMax === 100 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                Total: {totalAssessmentMax} / 100 Marks
              </div>
              <span className="text-xs text-slate-600">
                Formula: CA1 ({ca1Max}) + CA2 ({ca2Max}) + CA3 ({ca3Max}) + Exam ({examMax}) = {totalAssessmentMax}
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Save Marks Allocation</span>
            </button>
          </div>
        </form>
      </div>

      {/* Panel 5: Automatic Student Ranking System (Toggle & Class Leaderboard) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <span>Scholar Merit & Positioning</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Automatic Student Class Ranking System
              </h3>
              <p className="text-xs text-slate-500">
                Automatically calculate and print student class positions (1st, 2nd, 3rd...) based on terminal or cumulative scores.
              </p>
            </div>
          </div>

          {/* Ranking Toggle Control */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <div className="text-right">
              <div className="text-xs font-black text-slate-900">
                {isAutoRankingOn ? 'Ranking Enabled' : 'Ranking Disabled'}
              </div>
              <div className="text-[10px] text-slate-500">
                {isAutoRankingOn ? 'Shown on Report Sheets' : 'Hidden from Cards'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleAutoRanking();
                const nextState = !isAutoRankingOn;
                setSuccessMsg(
                  nextState 
                    ? 'Automatic class ranking ENABLED! Scholar positions (1st, 2nd, 3rd...) are now calculated and displayed across report sheets.'
                    : 'Automatic class ranking DISABLED! Position rankings are now suppressed on terminal report cards.'
                );
                setTimeout(() => setSuccessMsg(''), 4500);
              }}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isAutoRankingOn ? 'bg-blue-900' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAutoRankingOn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Class Selector and Ranking Metrics */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Inspect Class Leaderboard:</label>
            <select
              value={selectedRankingClass}
              onChange={e => setSelectedRankingClass(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden cursor-pointer"
            >
              {classes.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Scholars Ranked: <strong className="text-slate-900 font-black">{currentClassRankings.length}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">
              Active Term: <strong className="text-blue-900 font-black">{assessmentConfig.activeTerm}</strong>
            </span>
          </div>
        </div>

        {/* Real-time Class Rankings Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Scholar Details</th>
                <th className="py-3 px-4 text-center">Admission ID</th>
                <th className="py-3 px-4 text-right">Average Score</th>
                <th className="py-3 px-4 text-center">Academic Standing</th>
                <th className="py-3 px-4 text-center">Promotion Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {currentClassRankings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No scholars enrolled in {selectedRankingClass} yet. Add students or enroll new admissions to compute ranking.
                  </td>
                </tr>
              ) : (
                currentClassRankings.map(({ student, rank, positionText, average }) => {
                  const isTop3 = rank <= 3;
                  const isPass = average >= passMark;

                  return (
                    <tr 
                      key={student.id} 
                      className={`transition-colors ${
                        rank === 1 
                          ? 'bg-amber-50/50 hover:bg-amber-50' 
                          : rank === 2 
                          ? 'bg-slate-50/60 hover:bg-slate-100/60' 
                          : rank === 3 
                          ? 'bg-orange-50/30 hover:bg-orange-50/60' 
                          : 'hover:bg-blue-50/30'
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center font-black text-xs px-2.5 py-1 rounded-xl shadow-xs ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : rank === 3
                            ? 'bg-amber-700 text-white font-bold'
                            : 'bg-slate-100 text-slate-700 font-bold'
                        }`}>
                          {positionText}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.passportPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80'}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {rank === 1 && (
                                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-black">
                                  Class Valedictorian
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">{student.grade} • {student.house || 'Scholar'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-600">
                        {student.regNumber}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-black text-sm text-slate-900">
                          {average.toFixed(1)}%
                        </div>
                        <div className="w-20 ml-auto bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              average >= 75 ? 'bg-emerald-600' : average >= 60 ? 'bg-blue-600' : average >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, average)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          average >= 75
                            ? 'bg-emerald-100 text-emerald-800 font-black'
                            : average >= 60
                            ? 'bg-blue-100 text-blue-900 font-bold'
                            : average >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {average >= 75 ? 'Distinction' : average >= 60 ? 'Credit' : average >= 50 ? 'Pass' : 'Weak'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isPass
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPass ? 'Promotion Eligible' : 'Below Pass Threshold'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Ranking status notification footer */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-blue-950 font-medium">
            <AlertCircle className="w-4 h-4 text-blue-900 shrink-0" />
            <span>
              {isAutoRankingOn
                ? 'Automatic ranking is currently ACTIVE. Positions are printed on Student Report Sheets & Parent Portal.'
                : 'Automatic ranking is currently MUTED. Positions are suppressed from student-facing report cards.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleAutoRanking();
              setSuccessMsg(`Automatic ranking toggled ${!isAutoRankingOn ? 'ON' : 'OFF'}.`);
              setTimeout(() => setSuccessMsg(''), 3000);
            }}
            className="px-3 py-1 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-950 transition-colors cursor-pointer text-[11px]"
          >
            {isAutoRankingOn ? 'Disable Ranking' : 'Enable Ranking'}
          </button>
        </div>
      </div>
    </div>
  );
};
