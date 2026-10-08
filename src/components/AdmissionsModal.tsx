import React, { useState } from 'react';
import { X, CheckCircle, GraduationCap } from './RealIcons';
import { AdmissionForm } from '../types';
import { useSchool } from '../context/SchoolContext';

interface AdmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionsModal: React.FC<AdmissionsModalProps> = ({ isOpen, onClose }) => {
  const { submitApplication, entranceExamSettings } = useSchool();
  const [formData, setFormData] = useState<AdmissionForm>({
    parentName: '',
    email: '',
    phone: '',
    studentName: '',
    studentDob: '',
    gradeLevel: 'Primary 1',
    residentialAddress: '',
    notes: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.studentName || !formData.phone) return;
    
    const newRef = submitApplication({
      parentName: formData.parentName,
      email: formData.email,
      phone: formData.phone,
      studentName: formData.studentName,
      studentDob: formData.studentDob || '2015-05-12',
      gradeLevel: formData.gradeLevel,
      residentialAddress: formData.residentialAddress,
      notes: formData.notes
    });

    setGeneratedRef(newRef);
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      parentName: '',
      email: '',
      phone: '',
      studentName: '',
      studentDob: '',
      gradeLevel: 'Primary 1',
      residentialAddress: '',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE2CE] overflow-hidden my-8">
        {/* Header with Black, Red & Yellow Uniform Theme */}
        <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] text-white p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-amber-300 text-xs font-black uppercase tracking-wider">
                2025/2026 Academic Session
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Admissions Application Portal
              </h2>
              <p className="text-xs text-[#E5DEC9]">
                Stanbax Schools Ibadan • Creche, Primary & Secondary
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900">
                Application Initiated!
              </h3>
              <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for applying to <strong className="text-red-700">Stanbax Schools Ibadan</strong> for <strong>{formData.studentName}</strong> ({formData.gradeLevel}).
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] text-xs text-neutral-900 max-w-md mx-auto text-left space-y-1.5 font-medium">
                <div><strong>Application Reference:</strong> <span className="font-mono text-red-700 font-black">{generatedRef}</span></div>
                <div><strong>Entrance Exam Screening:</strong> {entranceExamSettings.examDate} ({entranceExamSettings.examTime})</div>
                <div><strong>Parent Contact:</strong> {formData.phone}</div>
                <div><strong>Screening Venue:</strong> {entranceExamSettings.venue}</div>
                {entranceExamSettings.duration && (
                  <div><strong>Exam Format & Duration:</strong> {entranceExamSettings.duration}</div>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                You can track this application at any time using your reference code via the <strong>Track Admission</strong> button in the top menu.
              </p>
              <button
                onClick={resetAndClose}
                className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 font-bold text-xs cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 flex items-center gap-2">
                <span className="font-black text-red-700">Notice:</span>
                <span>Early registration discounts and entrance scholarship assessments are ongoing.</span>
              </div>

              {/* Parent Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 border-b border-[#EAE2CE] pb-1">
                  1. Parent / Guardian Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief / Mrs. T. Adeleke"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Phone Number (WhatsApp Preferred) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Residential Area in Ibadan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oluyole Estate, Bodija, Challenge"
                      value={formData.residentialAddress}
                      onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500 border-b border-[#EAE2CE] pb-1">
                  2. Prospective Scholar Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Child's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="First and Surname"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                      Applying Grade Level *
                    </label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-bold focus:ring-2 focus:ring-red-600 focus:outline-none bg-white"
                    >
                      <option value="Creche">Creche (1-2 yrs)</option>
                      <option value="Nursery 1">Nursery 1</option>
                      <option value="Nursery 2">Nursery 2</option>
                      <option value="Primary 1">Primary 1</option>
                      <option value="Primary 2-5">Primary 2 - 5</option>
                      <option value="Primary 6">Primary 6</option>
                      <option value="JSS 1">JSS 1 (Junior High)</option>
                      <option value="JSS 2-3">JSS 2 - 3</option>
                      <option value="SSS 1 (Science)">SSS 1 (Science)</option>
                      <option value="SSS 1 (Arts/Commercial)">SSS 1 (Arts/Commercial)</option>
                      <option value="SSS 2-3 Transfer">SSS 2 - 3 Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Special Academic Interests or Medical Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Interested in robotics club, advanced mathematics, literary & debating society..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE2CE] text-xs sm:text-sm font-medium focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE2CE] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-[#FAF7EE] text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Submit Enrollment Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
