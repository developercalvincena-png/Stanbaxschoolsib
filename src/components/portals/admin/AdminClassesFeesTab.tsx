import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { SchoolClass } from '../../../types';
import { 
  GraduationCap, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Calculator, 
  DollarSign, 
  Search,
  BookOpen,
  HelpCircle,
  Star
} from '../../RealIcons';

export const AdminClassesFeesTab: React.FC = () => {
  const { 
    classes, 
    tutors, 
    students,
    addClass, 
    updateClass, 
    deleteClass, 
    resetClassesToDefault, 
    assignClassTeacher,
    assignClassPrefects 
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Quick inline fee editor
  const [inlineFeeId, setInlineFeeId] = useState<string | null>(null);
  const [inlineFeeValue, setInlineFeeValue] = useState<number>(0);

  // New Class Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<SchoolClass, 'id'>>({
    name: '',
    category: 'Primary',
    tuitionPerTerm: 150000,
    description: '',
    isActive: true,
    classTeacherId: ''
  });

  const categories = ['All', 'Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary'];

  const filteredClasses = classes.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (item: SchoolClass) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      tuitionPerTerm: item.tuitionPerTerm,
      description: item.description || '',
      isActive: item.isActive !== false,
      classTeacherId: item.classTeacherId || ''
    });
    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      category: 'Primary',
      tuitionPerTerm: 150000,
      description: '',
      isActive: true,
      classTeacherId: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const payload = {
      ...formData,
      tuitionPerTerm: Number(formData.tuitionPerTerm),
      classTeacherId: formData.classTeacherId ? formData.classTeacherId : undefined
    };

    if (editingId) {
      updateClass(editingId, payload);
      setStatusMessage(`Updated class settings for "${formData.name}". Synchronized across all portals!`);
    } else {
      addClass(payload);
      setStatusMessage(`Created new class "${formData.name}" with ₦${Number(formData.tuitionPerTerm).toLocaleString()} termly fee!`);
    }

    handleCancelForm();
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleSaveInlineFee = (classId: string, name: string) => {
    if (inlineFeeValue < 0) return;
    updateClass(classId, { tuitionPerTerm: inlineFeeValue });
    setInlineFeeId(null);
    setStatusMessage(`Updated termly tuition fee for ${name} to ₦${inlineFeeValue.toLocaleString()}`);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete class "${name}"? Existing student records may still reference it.`)) {
      deleteClass(id);
      setStatusMessage(`Deleted class "${name}".`);
      setTimeout(() => setStatusMessage(''), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5 text-amber-700" />
              <span>Classes & Tuition Fee Schedule</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Class Structure & Termly Fees Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Create new class arms, adjust termly tuition amounts for each class, and maintain school fee structures dynamically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                if (showAddForm && !editingId) {
                  setShowAddForm(false);
                } else {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    category: 'Primary',
                    tuitionPerTerm: 150000,
                    description: '',
                    isActive: true
                  });
                  setShowAddForm(true);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>{showAddForm && !editingId ? 'Close Form' : 'Create New Class'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all classes and tuition fees to initial school defaults?')) {
                  resetClassesToDefault();
                  setStatusMessage('Reset classes and fee structure to initial defaults.');
                  setTimeout(() => setStatusMessage(''), 3500);
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset default classes & fees"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Add / Edit Class Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-300 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>{editingId ? 'Edit Class & Fee Schedule' : 'Create New Academic Class'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              Instantly available in Tuition Calculator & Admissions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Class Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Primary 6 / Prep or SSS 1 Science"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Tier / Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              >
                <option value="Early Years">Early Years (Creche, Nursery, Reception)</option>
                <option value="Primary">Primary School (Grades 1 – 5)</option>
                <option value="Junior Secondary">Junior Secondary School (JSS 1 – 3)</option>
                <option value="Senior Secondary">Senior Secondary College (SSS 1 – 3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tuition Fee per Term (₦ Naira) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₦</span>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={formData.tuitionPerTerm}
                  onChange={e => setFormData(prev => ({ ...prev, tuitionPerTerm: Number(e.target.value) }))}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Formatted: ₦{Number(formData.tuitionPerTerm || 0).toLocaleString()} / term
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Class Description & Curriculum Focus
            </label>
            <input
              type="text"
              placeholder="e.g. British-Nigerian foundational curriculum, phonics, robotics introduction..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Designated Class Teacher (Form Master)
            </label>
            <select
              value={formData.classTeacherId || ''}
              onChange={e => setFormData(prev => ({ ...prev, classTeacherId: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
            >
              <option value="">-- No Class Teacher Appointed --</option>
              {tutors.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} • {t.department} {t.role ? `(${t.role})` : ''}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Dedicated teacher in charge of this specific class (daily attendance, report remarks, welfare) alongside teaching their own subjects.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-400" />
              <span>{editingId ? 'Update Class & Fee' : 'Save & Publish Class'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search class name, category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tier:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">
            Current Class Roster ({filteredClasses.length} Classes Available)
          </span>
          <span className="text-[11px] text-slate-500">
            Click <strong>Quick Edit Fee</strong> to update tuition in seconds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-4 sm:px-6">Class Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Class Teacher (Form Master)</th>
                <th className="py-3.5 px-4">Class Prefects</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Termly Tuition Fee</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredClasses.map(c => {
                const isEditingInline = inlineFeeId === c.id;
                const assignedTeacher = tutors.find(t => t.id === c.classTeacherId);

                return (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-900 shrink-0" />
                        <span>{c.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.category === 'Early Years'
                          ? 'bg-rose-100 text-rose-800'
                          : c.category === 'Primary'
                          ? 'bg-amber-100 text-amber-800'
                          : c.category === 'Junior Secondary'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}>
                        {c.category}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 min-w-[210px]">
                        <select
                          value={c.classTeacherId || ''}
                          onChange={e => {
                            const newTutorId = e.target.value;
                            assignClassTeacher(c.id, newTutorId || undefined);
                            const tutorName = tutors.find(t => t.id === newTutorId)?.name || 'Unassigned';
                            setStatusMessage(`Assigned ${tutorName} as Class Teacher for ${c.name}.`);
                            setTimeout(() => setStatusMessage(''), 3500);
                          }}
                          className={`text-xs font-semibold py-1.5 px-2.5 rounded-xl border transition-colors cursor-pointer ${
                            c.classTeacherId
                              ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <option value="">-- Assign Class Teacher --</option>
                          {tutors.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.department})
                            </option>
                          ))}
                        </select>
                        {assignedTeacher && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span className="font-mono font-bold text-blue-900">{assignedTeacher.staffId || 'Staff'}</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px] text-slate-600">
                              {assignedTeacher.assignedSubjects && assignedTeacher.assignedSubjects.length > 0 
                                ? assignedTeacher.assignedSubjects.join(', ')
                                : 'Subject Lead'}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {(() => {
                        const classStudents = students.filter(s => 
                          s.classId === c.id || s.grade === c.name || (s.grade && c.name.includes(s.grade))
                        );

                        return (
                          <div className="space-y-1.5 min-w-[200px]">
                            {/* Prefect Select */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-amber-700 shrink-0">⭐ Prefect:</span>
                              <select
                                value={c.prefectStudentId || ''}
                                onChange={e => {
                                  const newPrefectId = e.target.value;
                                  assignClassPrefects(c.id, newPrefectId || undefined, c.assistantPrefectStudentId);
                                  const stName = students.find(s => s.id === newPrefectId)?.name || 'None';
                                  setStatusMessage(`Assigned ${stName} as Class Prefect for ${c.name}.`);
                                  setTimeout(() => setStatusMessage(''), 3500);
                                }}
                                className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-white hover:border-amber-400 focus:outline-none flex-1 truncate"
                              >
                                <option value="">-- Unassigned --</option>
                                {classStudents.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Assistant Prefect Select */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-blue-700 shrink-0">⭐ Asst:</span>
                              <select
                                value={c.assistantPrefectStudentId || ''}
                                onChange={e => {
                                  const newAsstId = e.target.value;
                                  assignClassPrefects(c.id, c.prefectStudentId, newAsstId || undefined);
                                  const stName = students.find(s => s.id === newAsstId)?.name || 'None';
                                  setStatusMessage(`Assigned ${stName} as Assistant Prefect for ${c.name}.`);
                                  setTimeout(() => setStatusMessage(''), 3500);
                                }}
                                className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-white hover:border-blue-400 focus:outline-none flex-1 truncate"
                              >
                                <option value="">-- Unassigned --</option>
                                {classStudents.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="py-4 px-4 text-slate-500 max-w-xs truncate">
                      {c.description || 'Standard British-Nigerian curriculum'}
                    </td>

                    <td className="py-4 px-4 text-right font-mono">
                      {isEditingInline ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-slate-400 font-bold">₦</span>
                          <input
                            type="number"
                            value={inlineFeeValue}
                            onChange={e => setInlineFeeValue(Number(e.target.value))}
                            className="w-28 px-2 py-1 rounded border border-blue-600 text-xs font-mono font-bold focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveInlineFee(c.id, c.name)}
                            className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            title="Save fee"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setInlineFeeId(null)}
                            className="p-1.5 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-black text-slate-900 text-sm">
                            ₦{c.tuitionPerTerm.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              setInlineFeeId(c.id);
                              setInlineFeeValue(c.tuitionPerTerm);
                            }}
                            className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 transition-colors cursor-pointer"
                            title="Quick Edit Fee"
                          >
                            Edit Fee
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors cursor-pointer"
                          title="Full Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                          title="Delete class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
