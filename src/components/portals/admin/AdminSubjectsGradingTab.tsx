import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { Subject, GradeRule } from '../../../types';
import { 
  BookOpen, 
  Award, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  HelpCircle,
  Percent,
  Sliders
} from '../../RealIcons';

export const AdminSubjectsGradingTab: React.FC = () => {
  const { 
    subjects, 
    addSubject, 
    updateSubject, 
    deleteSubject, 
    resetSubjectsToDefault,
    gradingRules,
    updateGradingRule,
    addGradingRule,
    deleteGradingRule,
    resetGradingToDefault,
    calculateGrade,
    schemesOfWork
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'subjects' | 'grading'>('subjects');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');

  // Subject Form State
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectFormData, setSubjectFormData] = useState<Omit<Subject, 'id'>>({
    name: '',
    code: '',
    department: 'Sciences',
    applicableLevels: ['Senior Secondary'],
    description: ''
  });

  // Grade Rule Form State
  const [showGradeRuleForm, setShowGradeRuleForm] = useState(false);
  const [editingGradeRuleId, setEditingGradeRuleId] = useState<string | null>(null);
  const [gradeFormData, setGradeFormData] = useState<GradeRule>({
    id: '',
    grade: '',
    minScore: 0,
    maxScore: 100,
    remark: '',
    color: 'emerald'
  });

  // Live score tester
  const [testScore, setTestScore] = useState<number>(76);

  const departments = ['All', 'Sciences', 'Humanities', 'Commercial', 'Vocational & Tech', 'Languages'];
  const allLevels = ['Early Years', 'Primary', 'Junior Secondary', 'Senior Secondary'];

  // Filtered subjects
  const filteredSubjects = subjects.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Handle Subject Form
  const handleStartEditSubject = (subj: Subject) => {
    setEditingSubjectId(subj.id);
    setSubjectFormData({
      name: subj.name,
      code: subj.code || '',
      department: subj.department,
      applicableLevels: subj.applicableLevels || ['Senior Secondary'],
      description: subj.description || ''
    });
    setShowSubjectForm(true);
  };

  const handleCancelSubjectForm = () => {
    setEditingSubjectId(null);
    setShowSubjectForm(false);
    setSubjectFormData({
      name: '',
      code: '',
      department: 'Sciences',
      applicableLevels: ['Senior Secondary'],
      description: ''
    });
  };

  const handleSubmitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const codeVal = (subjectFormData.code || '').trim();
    if (!subjectFormData.name.trim() || !codeVal) return;

    if (editingSubjectId) {
      updateSubject(editingSubjectId, {
        ...subjectFormData,
        code: codeVal.toUpperCase()
      });
      setStatusMessage(`Updated subject "${subjectFormData.name}" (${codeVal.toUpperCase()}).`);
    } else {
      addSubject({
        ...subjectFormData,
        code: codeVal.toUpperCase()
      });
      setStatusMessage(`Created new subject "${subjectFormData.name}" (${codeVal.toUpperCase()}). Tutors can now be assigned to this subject!`);
    }

    handleCancelSubjectForm();
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Delete subject "${name}"? Existing tutor assignments for this subject may be affected.`)) {
      deleteSubject(id);
      setStatusMessage(`Deleted subject "${name}".`);
      setTimeout(() => setStatusMessage(''), 3500);
    }
  };

  const toggleApplicableLevel = (level: string) => {
    setSubjectFormData(prev => {
      const currentLevels = prev.applicableLevels || [];
      const exists = currentLevels.includes(level);
      return {
        ...prev,
        applicableLevels: exists
          ? currentLevels.filter(l => l !== level)
          : [...currentLevels, level]
      };
    });
  };

  // Handle Grade Rule Form
  const handleStartEditGradeRule = (rule: GradeRule) => {
    setEditingGradeRuleId(rule.id);
    setGradeFormData({ ...rule });
    setShowGradeRuleForm(true);
  };

  const handleSubmitGradeRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeFormData.grade.trim()) return;

    if (editingGradeRuleId) {
      updateGradingRule(editingGradeRuleId, gradeFormData);
      setStatusMessage(`Updated grading rule for "${gradeFormData.grade}".`);
    } else {
      const { id: _ignored, ...ruleData } = gradeFormData;
      addGradingRule(ruleData);
      setStatusMessage(`Created new grade rule "${gradeFormData.grade}".`);
    }

    setEditingGradeRuleId(null);
    setShowGradeRuleForm(false);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const testedResult = calculateGrade(testScore);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Academic Curriculum & Evaluation Scale</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Subjects & Grading System Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Create subjects taught in the school and configure standard grading boundaries, remarks, and assessment rules.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveSubTab('subjects')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'subjects'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-900" />
              <span>Subjects ({subjects.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('grading')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'grading'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Grading System ({gradingRules.length} Grades)</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* ======================= TAB 1: SUBJECTS ======================= */}
      {activeSubTab === 'subjects' && (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (showSubjectForm && !editingSubjectId) {
                    setShowSubjectForm(false);
                  } else {
                    setEditingSubjectId(null);
                    setSubjectFormData({
                      name: '',
                      code: '',
                      department: 'Sciences',
                      applicableLevels: ['Senior Secondary'],
                      description: ''
                    });
                    setShowSubjectForm(true);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>{showSubjectForm && !editingSubjectId ? 'Close Form' : 'Create New Subject'}</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all subjects to default British-Nigerian curriculum subjects?')) {
                    resetSubjectsToDefault();
                    setStatusMessage('Reset subjects to default list.');
                    setTimeout(() => setStatusMessage(''), 3500);
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset default subjects"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subjects or code..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Subject Form */}
          {showSubjectForm && (
            <form onSubmit={handleSubmitSubject} className="bg-white rounded-3xl p-6 shadow-md border-2 border-blue-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-900" />
                  <span>{editingSubjectId ? 'Edit Subject Details' : 'Create New Academic Subject'}</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Tutors can immediately be assigned to this subject
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Further Mathematics"
                    value={subjectFormData.name}
                    onChange={e => setSubjectFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Code (Short) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. FMA"
                    value={subjectFormData.code}
                    onChange={e => setSubjectFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Division *
                  </label>
                  <select
                    value={subjectFormData.department}
                    onChange={e => setSubjectFormData(prev => ({ ...prev, department: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Vocational & Tech">Vocational & Tech</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Applicable Academic Tiers
                </label>
                <div className="flex flex-wrap gap-2">
                  {allLevels.map(level => {
                    const isSelected = (subjectFormData.applicableLevels || []).includes(level);
                    return (
                      <button
                        type="button"
                        key={level}
                        onClick={() => toggleApplicableLevel(level)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Check className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'opacity-0'}`} />
                        <span>{level}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Scope / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pure & Applied Mathematics, Mechanics, Statistics for Senior Secondary Scholars"
                  value={subjectFormData.description}
                  onChange={e => setSubjectFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCancelSubjectForm}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{editingSubjectId ? 'Save Subject Changes' : 'Publish Subject'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Subjects Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Registered Academic Subjects ({filteredSubjects.length})
              </span>
              <div className="flex items-center gap-1">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setDeptFilter(dept)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                      deptFilter === dept
                        ? 'bg-blue-900 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3.5 px-4 sm:px-6">Subject Code</th>
                    <th className="py-3.5 px-4">Subject Name</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Applicable Tiers</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredSubjects.map(s => (
                    <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-mono font-black text-blue-900">
                        <span className="px-2.5 py-1 rounded-md bg-blue-100 border border-blue-200">
                          {s.code}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                          {schemesOfWork.some(sch => sch.subjectName.toLowerCase() === s.name.toLowerCase()) ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                              <span>AI Scheme Active</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                              No Scheme
                            </span>
                          )}
                        </div>
                        {s.description && (
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm truncate">
                            {s.description}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {s.department}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(s.applicableLevels || []).map(lvl => (
                            <span key={lvl} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                              {lvl}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEditSubject(s)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors cursor-pointer"
                            title="Edit subject"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(s.id, s.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: GRADING SYSTEM ======================= */}
      {activeSubTab === 'grading' && (
        <div className="space-y-6">
          {/* Controls & Live Score Tester Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Live Score Tester */}
            <div className="lg:col-span-6 bg-gradient-to-br from-blue-950 to-blue-900 rounded-3xl p-6 text-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-base">Interactive Grading Scale Simulator</h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Enter any total percentage score below to preview how the active institutional grading system evaluates the result on report sheets.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-36">
                  <label className="block text-[11px] font-bold text-blue-200 mb-1">
                    Score (0 - 100%):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={testScore}
                    onChange={e => setTestScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-mono font-black text-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex-1 p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-300 block">Grade</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {testedResult.grade}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-300 block">Remark</span>
                    <span className="text-sm font-black text-white">
                      {testedResult.remark}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grading System Actions */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Evaluation Standards</span>
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  WAEC & British-Nigerian Grading Framework
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust score intervals, letter grades, or official remarks. Changes immediately calculate across student continuous assessments, tutor gradebooks, and report cards.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setEditingGradeRuleId(null);
                    setGradeFormData({
                      id: `rule-${Date.now()}`,
                      grade: '',
                      minScore: 0,
                      maxScore: 100,
                      remark: 'Credit',
                      color: 'blue'
                    });
                    setShowGradeRuleForm(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Grade Rule</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Reset grading scale to the default WAEC 9-tier scale (A1 to F9)?')) {
                      resetGradingToDefault();
                      setStatusMessage('Reset grading system to official default rules.');
                      setTimeout(() => setStatusMessage(''), 3500);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Scale</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grade Rule Form */}
          {showGradeRuleForm && (
            <form onSubmit={handleSubmitGradeRule} className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-300 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{editingGradeRuleId ? 'Edit Grade Rule' : 'Create New Grade Rule'}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A1, B2, C4, F9"
                    value={gradeFormData.grade}
                    onChange={e => setGradeFormData(prev => ({ ...prev, grade: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-black focus:ring-2 focus:ring-blue-900 focus:outline-hidden uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Min Score (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={gradeFormData.minScore}
                    onChange={e => setGradeFormData(prev => ({ ...prev, minScore: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Score (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={gradeFormData.maxScore}
                    onChange={e => setGradeFormData(prev => ({ ...prev, maxScore: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Remark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distinction, Very Good, Credit"
                    value={gradeFormData.remark}
                    onChange={e => setGradeFormData(prev => ({ ...prev, remark: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGradeRuleForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Save Grading Rule</span>
                </button>
              </div>
            </form>
          )}

          {/* Grading Rules Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Active Institutional Grading Scale ({gradingRules.length} Tiers)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3.5 px-4 sm:px-6">Grade</th>
                    <th className="py-3.5 px-4">Percentage Score Range</th>
                    <th className="py-3.5 px-4">Official Remark</th>
                    <th className="py-3.5 px-4">Visual Badge</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {gradingRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-black text-sm text-slate-900">
                        {rule.grade}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {rule.minScore}% – {rule.maxScore}%
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {rule.remark}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.grade === 'A1'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rule.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-900'
                            : rule.grade.startsWith('C')
                            ? 'bg-purple-100 text-purple-800'
                            : rule.grade.startsWith('D') || rule.grade.startsWith('E')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rule.grade} • {rule.remark}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEditGradeRule(rule)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 transition-colors cursor-pointer"
                            title="Edit rule"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {gradingRules.length > 2 && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete grade rule for ${rule.grade}?`)) {
                                  deleteGradingRule(rule.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="Delete rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
