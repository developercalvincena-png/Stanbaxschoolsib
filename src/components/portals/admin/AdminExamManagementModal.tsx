import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { EntranceExamSettings } from '../../../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  AlertCircle, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check
} from '../../RealIcons';

interface AdminExamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminExamManagementModal: React.FC<AdminExamManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    entranceExamSettings, 
    updateEntranceExamSettings, 
    resetEntranceExamSettings,
    applications,
    updateApplicationExamDetails
  } = useSchool();

  const [formData, setFormData] = useState<EntranceExamSettings>({ ...entranceExamSettings });
  const [newReqInput, setNewReqInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'academics' | 'requirements'>('schedule');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEntranceExamSettings(formData);
    setSaveSuccessMsg('Entrance examination details successfully updated!');
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 2800);
  };

  const handleApplyToAllApplicants = () => {
    if (window.confirm(`Apply these exam details (${formData.examDate} at ${formData.venue}) to all currently pending applicants?`)) {
      let count = 0;
      applications.forEach(app => {
        if (app.status === 'Pending Review' || app.status === 'Screening Scheduled') {
          updateApplicationExamDetails(app.id, {
            screeningDate: `${formData.examDate} (${formData.examTime})`,
            screeningTime: formData.examTime,
            screeningVenue: formData.venue,
            examSubjects: Array.isArray(formData.subjects) ? formData.subjects : [formData.subjects],
            examRequirements: Array.isArray(formData.requirements) ? formData.requirements.join(' • ') : String(formData.requirements)
          });
          count++;
        }
      });
      setSaveSuccessMsg(`Updated screening details across ${count} applicant records!`);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleAddRequirement = () => {
    if (!newReqInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, newReqInput.trim()]
    }));
    setNewReqInput('');
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all entrance examination parameters to Stanbax default settings?')) {
      resetEntranceExamSettings();
      // Reload form data
      setFormData({
        examTitle: 'Stanbax Standard Entrance & Scholarship Screening',
        examDate: 'Next Saturday',
        examTime: '9:00 AM',
        venue: 'Stanbax Main Hall, Ring Road / Oluyole Axis, Ibadan',
        duration: '2 Hours (Mathematics, English & General Paper)',
        subjects: ['Mathematics', 'English Language', 'Quantitative Reasoning', 'Verbal Aptitude & General Knowledge'],
        requirements: [
          '2 recent passport-sized photographs',
          'Writing materials (HB pencils, pens, eraser, 30cm ruler)',
          'Photocopy of candidate birth certificate',
          'Photocopy of last term academic report sheet',
          'Printed Application Slip / Reference Code'
        ],
        coordinatorName: 'Admissions Screening Committee',
        coordinatorPhone: '+234 803 456 7890',
        passMark: 60,
        instructions: 'Candidates must arrive 30 minutes before exam time for verification and accreditation. Parents are welcome to wait in the hospitality lounge.',
        fee: 'Free / Included with Application'
      });
      setSaveSuccessMsg('Restored default examination details.');
      setTimeout(() => setSaveSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#EAE2CE] my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] p-5 sm:p-6 text-white relative border-b-2 border-amber-400 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <Calendar className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Entrance Examination & Screening Desk Editor
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase">
                  Admin Control
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Configure all entrance exam schedules, screening venues, duration, subjects, cut-off marks, and instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-neutral-200 bg-[#FAF7EE] shrink-0">
          <div className="flex items-center gap-2">
            {[
              { id: 'schedule', label: '1. Date, Time & Venue', icon: Calendar },
              { id: 'academics', label: '2. Format, Subjects & Pass Mark', icon: BookOpen },
              { id: 'requirements', label: '3. Items to Bring & Instructions', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
                  activeSubTab === tab.id
                    ? 'border-red-700 text-red-700 bg-white shadow-xs'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-neutral-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
            title="Reset to default examination parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: SCHEDULE & VENUE */}
          {activeSubTab === 'schedule' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-neutral-800">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Real-Time Public Sync:</span>
                </p>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Updates saved here will instantly reflect on the public Admissions Application Slip, the parent Admission Tracker, and candidate confirmation slips.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Exam Title / Screening Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.examTitle}
                  onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
                  placeholder="e.g. Stanbax Standard Entrance & Scholarship Screening"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-700" />
                    <span>Screening Exam Date <span className="text-red-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    placeholder="e.g. Next Saturday or Saturday, 28th September 2025"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Free text format: supports "Next Saturday", exact dates, or batch timelines.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-700" />
                    <span>Screening Exam Time <span className="text-red-600">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.examTime}
                    onChange={(e) => setFormData({ ...formData, examTime: e.target.value })}
                    placeholder="e.g. 9:00 AM Prompt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Recommended arrival time: 30 minutes prior for biometric verification.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-700" />
                  <span>Screening Venue & Hall Address <span className="text-red-600">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Stanbax Main Hall, Ring Road / Oluyole Axis, Ibadan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Screening Fee / Slip Note
                  </label>
                  <input
                    type="text"
                    value={formData.fee}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    placeholder="e.g. Free / Included with Application"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Admissions Desk Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.coordinatorPhone}
                    onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                    placeholder="e.g. +234 803 456 7890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS & CUT-OFF */}
          {activeSubTab === 'academics' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Exam Format & Duration
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 2 Hours (Mathematics, English & General Paper)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Subjects Tested
                </label>
                <textarea
                  rows={2}
                  required
                  value={Array.isArray(formData.subjects) ? formData.subjects.join(', ') : formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="e.g. Mathematics, English Language, Quantitative Reasoning, Verbal Aptitude & General Knowledge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Displayed on the candidate's exam slip to help parents prepare their children.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Pass Mark / Cut-Off Percentage (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      required
                      value={formData.passMark}
                      onChange={(e) => setFormData({ ...formData, passMark: Number(e.target.value) })}
                      className="w-28 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-black text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                    />
                    <span className="text-xs font-bold text-neutral-600">% or higher to qualify for direct admission</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Screening Officer / Coordinator
                  </label>
                  <input
                    type="text"
                    value={formData.coordinatorName}
                    onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                    placeholder="e.g. Admissions Screening Committee"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REQUIREMENTS & INSTRUCTIONS */}
          {activeSubTab === 'requirements' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Items Candidates Must Bring on Exam Day
                </label>
                <div className="space-y-2 mb-3">
                  {formData.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-neutral-900 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold">{req}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                        title="Remove requirement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReqInput}
                    onChange={(e) => setNewReqInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRequirement();
                      }
                    }}
                    placeholder="Add an item (e.g. 2 Passport Photographs, Birth Certificate photocopy)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  General Candidate & Parent Instructions
                </label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Rules, punctuality notice, parent hospitality lounge details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleApplyToAllApplicants}
              className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1.5 cursor-pointer order-2 sm:order-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Bulk apply this date & venue to all pending candidates</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save All Exam Details</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
