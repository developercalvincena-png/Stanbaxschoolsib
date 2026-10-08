import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { AcademicCalendarEvent } from '../../../types';
import { CALENDAR_EVENTS } from '../../../data/schoolData';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Filter,
  ArrowRight,
  Tag
} from '../../RealIcons';

type TermFilter = 'All' | '1st Term' | '2nd Term' | '3rd Term';

export const AdminSchoolCalendarTab: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    resetCalendarEventsToDefault,
    termResumptionConfig,
    setTermStartDate,
    schoolInfo
  } = useSchool();

  const events: AcademicCalendarEvent[] =
    calendarEvents && calendarEvents.length > 0 ? calendarEvents : CALENDAR_EVENTS;

  const [selectedTerm, setSelectedTerm] = useState<TermFilter>('All');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingEvent, setEditingEvent] = useState<AcademicCalendarEvent | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Quick Set Term Start Date state
  const [quickStartDate, setQuickStartDate] = useState(
    termResumptionConfig?.termStartDate || schoolInfo.resumptionDate || '2026-09-15'
  );
  const [quickEndDate, setQuickEndDate] = useState(
    termResumptionConfig?.termEndDate || schoolInfo.vacationDate || '2026-12-18'
  );
  const [quickTermName, setQuickTermName] = useState(
    termResumptionConfig?.termName || '1st Term'
  );
  const [isSettingStartDate, setIsSettingStartDate] = useState(false);

  // Event form state
  const [formData, setFormData] = useState<Partial<AcademicCalendarEvent>>({
    title: '',
    term: '1st Term',
    date: new Date().toISOString().split('T')[0],
    dateRange: '',
    category: 'Resumption',
    type: 'Resumption',
    description: '',
    notes: ''
  });

  const showNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 4500);
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      term: selectedTerm === 'All' ? '1st Term' : selectedTerm,
      date: new Date().toISOString().split('T')[0],
      dateRange: '',
      category: 'Resumption',
      type: 'Resumption',
      description: '',
      notes: ''
    });
    setEditingEvent(null);
    setModalMode('create');
  };

  const handleOpenEdit = (evt: AcademicCalendarEvent) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      term: evt.term || '1st Term',
      date: evt.date,
      dateRange: evt.dateRange || '',
      category: evt.category || 'Resumption',
      type: evt.type || evt.category || 'Resumption',
      description: evt.description || '',
      notes: evt.notes || ''
    });
    setModalMode('edit');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.date) return;

    if (modalMode === 'create') {
      const newEvent: AcademicCalendarEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: formData.title.trim(),
        term: formData.term || '1st Term',
        date: formData.date,
        dateRange: formData.dateRange?.trim() || formData.date,
        category: formData.category || 'Academic',
        type: formData.category || 'Academic',
        description: formData.description?.trim() || '',
        notes: formData.notes?.trim() || ''
      };
      addCalendarEvent(newEvent);
      showNotification(`Calendar milestone "${newEvent.title}" was successfully added to ${newEvent.term}.`);
    } else if (modalMode === 'edit' && editingEvent) {
      const updated: AcademicCalendarEvent = {
        ...editingEvent,
        title: formData.title.trim(),
        term: formData.term || '1st Term',
        date: formData.date,
        dateRange: formData.dateRange?.trim() || formData.date,
        category: formData.category || 'Academic',
        type: formData.category || 'Academic',
        description: formData.description?.trim() || '',
        notes: formData.notes?.trim() || ''
      };
      updateCalendarEvent(updated.id, updated);
      showNotification(`Calendar milestone "${updated.title}" was updated.`);
    }

    setModalMode(null);
    setEditingEvent(null);
  };

  const handleDelete = (evt: AcademicCalendarEvent) => {
    if (confirm(`Are you sure you want to remove "${evt.title}" from the school calendar?`)) {
      deleteCalendarEvent(evt.id);
      showNotification(`Calendar milestone "${evt.title}" removed.`);
    }
  };

  const handleSetEventAsTermStart = (evt: AcademicCalendarEvent) => {
    const termTarget = evt.term || '1st Term';
    setTermStartDate(evt.date, {
      termName: termTarget,
      termEndDate: quickEndDate,
      sessionName: termResumptionConfig?.session || schoolInfo.activeSession,
      shouldResetAttendance: true
    });
    showNotification(
      `Term Start Date updated to ${evt.date} (${termTarget}). Daily attendance counter has been automatically reset for teachers!`
    );
  };

  const handleQuickSetStartDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTermStartDate(quickStartDate, {
      termName: quickTermName,
      termEndDate: quickEndDate,
      sessionName: termResumptionConfig?.session || schoolInfo.activeSession,
      shouldResetAttendance: true
    });
    setIsSettingStartDate(false);
    showNotification(
      `Official Term Start Date set to ${quickStartDate} (${quickTermName}). Daily attendance counter has been automatically reset for teachers!`
    );
  };

  const filteredEvents = events.filter(evt => {
    if (selectedTerm === 'All') return true;
    return (evt.term || '1st Term') === selectedTerm;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-red-600" />
            <span>Academic Session Planning</span>
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            School Calendar & Term Dates Manager
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Publish and update official academic milestones, examination schedules, mid-term breaks, and vacation dates across all 3 terms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSettingStartDate(!isSettingStartDate)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Clock className="w-4 h-4" />
            <span>Set Term Start Date</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Calendar Event</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Set Term Start Date Drawer / Card (Triggered or collapsible) */}
      {isSettingStartDate && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-2 border-amber-300 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Set Active Term Start Date & Auto-Reset Attendance
                </h3>
                <p className="text-xs text-stone-600">
                  Setting the Term Start Date resets the daily attendance counter to 0 for teachers, launching a new Day 1 cycle.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingStartDate(false)}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold self-start sm:self-auto cursor-pointer"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleQuickSetStartDateSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Select Academic Term</label>
              <select
                value={quickTermName}
                onChange={(e) => setQuickTermName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              >
                <option value="1st Term">1st Term (Michaelmas Term)</option>
                <option value="2nd Term">2nd Term (Lent Term)</option>
                <option value="3rd Term">3rd Term (Trinity Term)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Term Start Date (Triggers Counter Reset)
              </label>
              <input
                type="date"
                value={quickStartDate}
                onChange={(e) => setQuickStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-bold bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Term Vacation / End Date
              </label>
              <input
                type="date"
                value={quickEndDate}
                onChange={(e) => setQuickEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-bold bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-amber-900 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Teachers will be prevented from marking dates outside <strong>{quickStartDate}</strong> to <strong>{quickEndDate}</strong>.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingStartDate(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Start Date & Reset Counter</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Term Range & System Status Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">Current Term</div>
          <div className="text-base font-black text-stone-900 mt-1">
            {termResumptionConfig?.termName || schoolInfo.activeTerm}
          </div>
          <div className="text-xs text-amber-700 font-bold mt-0.5">
            {termResumptionConfig?.session || schoolInfo.activeSession}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">Term Start Date</div>
          <div className="text-base font-black text-blue-900 mt-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{termResumptionConfig?.termStartDate || schoolInfo.resumptionDate || '2026-09-15'}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
            Roll call starts from Day 1
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">Term End Date</div>
          <div className="text-base font-black text-stone-800 mt-1">
            {termResumptionConfig?.termEndDate || schoolInfo.vacationDate || '2026-12-18'}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Vacation & report cards
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">Published Milestones</div>
            <div className="text-xl font-black text-stone-900 mt-1">
              {events.length} Events
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Across all 3 academic terms
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            title="Restore default academic calendar"
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Term Filter Bar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200 self-start">
          {(['All', '1st Term', '2nd Term', '3rd Term'] as TermFilter[]).map(term => (
            <button
              key={term}
              type="button"
              onClick={() => setSelectedTerm(term)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTerm === term
                  ? 'bg-stone-900 text-amber-300 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {term === 'All' ? 'All Terms (Overview)' : term}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 font-bold">
          Showing {filteredEvents.length} calendar event{filteredEvents.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map(evt => {
          const category = evt.type || evt.category || 'Academic';
          const isResumption = category === 'Resumption' || evt.title.toLowerCase().includes('resumption');

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      category === 'Resumption'
                        ? 'bg-red-100 text-red-900'
                        : category === 'Assessment' || category === 'Exam'
                        ? 'bg-amber-100 text-amber-900'
                        : category === 'Sports'
                        ? 'bg-emerald-100 text-emerald-900'
                        : category === 'Holiday'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {category}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-stone-100 text-stone-600">
                    {evt.term || '1st Term'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-stone-900 leading-snug group-hover:text-red-700 transition-colors">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono mt-1 font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{evt.dateRange || evt.date}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {evt.notes || evt.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                {isResumption && (
                  <button
                    type="button"
                    onClick={() => handleSetEventAsTermStart(evt)}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>Set as Active Term Start Date</span>
                  </button>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(evt)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(evt)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="text-base font-bold text-stone-700">No events found for {selectedTerm}</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click "Add Calendar Event" above to create milestones for this term or restore standard events.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Now</span>
          </button>
        </div>
      )}

      {/* Modal: Create or Edit Calendar Event */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    {modalMode === 'create' ? 'Add School Calendar Milestone' : 'Edit Calendar Milestone'}
                  </h3>
                  <p className="text-xs text-stone-500">Official academic term event</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 2nd Term Resumption & Welcome Assembly"
                  required
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Academic Term *</label>
                  <select
                    value={formData.term || '1st Term'}
                    onChange={e => setFormData({ ...formData, term: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 font-bold"
                  >
                    <option value="1st Term">1st Term (Michaelmas Term)</option>
                    <option value="2nd Term">2nd Term (Lent Term)</option>
                    <option value="3rd Term">3rd Term (Trinity Term)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Event Category *</label>
                  <select
                    value={formData.category || 'Resumption'}
                    onChange={e => setFormData({ ...formData, category: e.target.value, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 font-bold"
                  >
                    <option value="Resumption">Resumption</option>
                    <option value="Exam">Examination & CA Assessment</option>
                    <option value="Holiday">Holiday & Mid-Term Break</option>
                    <option value="Sports">Sports & Inter-House Gala</option>
                    <option value="Celebration">Celebration & Speech Day</option>
                    <option value="Meeting">PTA & Parent Consultation</option>
                    <option value="Academic">STEM Fair & Academic Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Anchor Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Display Date Range</label>
                  <input
                    type="text"
                    value={formData.dateRange || ''}
                    onChange={e => setFormData({ ...formData, dateRange: e.target.value })}
                    placeholder="e.g. Oct 19 – Oct 23, 2026"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description / Purpose</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of the event..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Notes for Parents & Scholars</label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Boarders resume on Sunday evening."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{modalMode === 'create' ? 'Publish Event' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation: Restore Default Calendar */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-stone-900">Restore Standard Academic Calendar?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              This will re-populate all standard school milestones for the 1st Term (Michaelmas), 2nd Term (Lent), and 3rd Term (Trinity). Any customized events will be reset to default.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetCalendarEventsToDefault();
                  setConfirmResetOpen(false);
                  showNotification('Default academic calendar successfully restored.');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
