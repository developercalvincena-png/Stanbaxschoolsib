import React, { useState } from 'react';
import { useSchool } from '../../../context/SchoolContext';
import { FacultyMember } from '../../../types';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  RotateCcw, 
  Image as ImageIcon,
  Search,
  Award,
  BookOpen,
  Briefcase
} from '../../RealIcons';

export const AdminFacultyTab: React.FC = () => {
  const { facultyList, addFacultyMember, updateFacultyMember, deleteFacultyMember, resetFacultyToDefault } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState<Omit<FacultyMember, 'id'>>({
    name: '',
    role: '',
    qualification: '',
    department: 'Sciences',
    bio: '',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: '',
    phone: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const departments = ['All', 'Administration', 'Sciences', 'Humanities & Arts', 'Early Years & Primary', 'Technology & Vocational'];

  const filteredFaculty = facultyList.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || f.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (member: FacultyMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      qualification: member.qualification,
      department: member.department,
      bio: member.bio,
      imageUrl: member.imageUrl,
      email: member.email || '',
      phone: member.phone || ''
    });
    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      role: '',
      qualification: '',
      department: 'Sciences',
      bio: '',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      email: '',
      phone: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) return;

    if (editingId) {
      updateFacultyMember(editingId, formData);
      setStatusMessage(`Updated details for "${formData.name}". Changes are live on the landing page!`);
    } else {
      addFacultyMember(formData);
      setStatusMessage(`Added new faculty member "${formData.name}". Now live on the landing page!`);
    }

    handleCancelForm();
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the school faculty? This will update the landing page.`)) {
      deleteFacultyMember(id);
      setStatusMessage(`Removed "${name}" from faculty roster.`);
      setTimeout(() => setStatusMessage(''), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Landing Page Faculty Management</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Staff & Academic Leadership Roster
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add new educators, update designations/qualifications, or remove staff members appearing on the public landing page.
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
                    role: '',
                    qualification: '',
                    department: 'Sciences',
                    bio: '',
                    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                    email: '',
                    phone: ''
                  });
                  setShowAddForm(true);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>{showAddForm && !editingId ? 'Close Form' : 'Add New Staff Member'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all faculty members to initial institutional defaults?')) {
                  resetFacultyToDefault();
                  setStatusMessage('Reset faculty roster to default institutional staff.');
                  setTimeout(() => setStatusMessage(''), 3500);
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to default staff"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Status alert message */}
        {statusMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Add / Edit Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border-2 border-blue-200 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-900" />
              <span>{editingId ? 'Edit Faculty Member Details' : 'Register New Staff Member'}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">
              Changes apply instantly to the public website
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name & Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Folashade Adeyemi"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Designation / Position *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Head of College Sciences"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Qualifications *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ph.D. Physics (UI), M.Sc., PGDE"
                value={formData.qualification}
                onChange={e => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department / Division
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              >
                <option value="Administration">Administration & Governance</option>
                <option value="Sciences">Sciences & Mathematics</option>
                <option value="Humanities & Arts">Humanities, Languages & Arts</option>
                <option value="Early Years & Primary">Early Years & Primary Division</option>
                <option value="Technology & Vocational">Technology, ICT & Vocational</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Staff Email
              </label>
              <input
                type="email"
                placeholder="e.g. f.adeyemi@stanbaxschools.ng"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. +234 803 123 4567"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Educator Bio & Experience
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of their pedagogy, career milestones, and dedication to scholars..."
              value={formData.bio}
              onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden resize-none"
            />
          </div>

          {/* Photo Selection */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-bold text-slate-800 mb-2">Staff Portrait Photo</span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  placeholder="Paste direct Image URL..."
                  value={formData.imageUrl}
                  onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                />
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-blue-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WebP supported</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
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
              <span>{editingId ? 'Save Faculty Changes' : 'Confirm & Publish to Landing Page'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, degree..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Dept:</span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3.5">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 text-[10px] font-black uppercase tracking-wider mb-1">
                    {member.department}
                  </span>
                  <h3 className="font-black text-slate-900 text-sm truncate">
                    {member.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-bold leading-tight">
                    {member.role}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                  <span className="truncate">{member.qualification}</span>
                </div>
                {member.bio && (
                  <p className="text-slate-500 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-emerald-600 font-bold">● Active on Landing Page</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(member)}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Edit details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors cursor-pointer"
                  title="Remove staff member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No faculty members found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or department filter, or click "Add New Staff Member" above.
          </p>
        </div>
      )}
    </div>
  );
};
