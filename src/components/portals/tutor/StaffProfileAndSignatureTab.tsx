import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Check, 
  Award, 
  ShieldCheck, 
  Crown, 
  Edit3, 
  FileText, 
  Clock, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useSchool } from '../../../context/SchoolContext';
import { TutorProfile, PrincipalPrivilege } from '../../../types';

interface StaffProfileAndSignatureTabProps {
  tutor: TutorProfile;
}

export const StaffProfileAndSignatureTab: React.FC<StaffProfileAndSignatureTabProps> = ({ tutor }) => {
  const { updateTutorPhotoAndSignature, schoolInfo } = useSchool();

  // Photo state
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(tutor.photoUrl || tutor.avatarUrl || null);
  const [photoNotice, setPhotoNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Signature state
  const sigFileInputRef = useRef<HTMLInputElement>(null);
  const [sigPreview, setSigPreview] = useState<string | null>(tutor.signatureUrl || null);
  const [sigNotice, setSigNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sigMode, setSigMode] = useState<'upload' | 'draw'>('draw');

  // Canvas Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Sync state if tutor changes
  useEffect(() => {
    setPhotoPreview(tutor.photoUrl || tutor.avatarUrl || null);
    setSigPreview(tutor.signatureUrl || null);
  }, [tutor.id, tutor.photoUrl, tutor.signatureUrl, tutor.avatarUrl]);

  // Handle Photo Upload
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoNotice({ type: 'error', text: 'Please select a valid image file (JPG, PNG, or WEBP).' });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setPhotoNotice({ type: 'error', text: 'Photo file size exceeds 3MB limit.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotoPreview(dataUrl);
        updateTutorPhotoAndSignature(tutor.id, { photoUrl: dataUrl });
        setPhotoNotice({ type: 'success', text: 'Staff photograph updated and saved successfully!' });
        setTimeout(() => setPhotoNotice(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (confirm('Are you sure you want to remove your staff photograph?')) {
      setPhotoPreview(null);
      updateTutorPhotoAndSignature(tutor.id, { photoUrl: '' });
      setPhotoNotice({ type: 'success', text: 'Staff photograph removed.' });
      setTimeout(() => setPhotoNotice(null), 3000);
    }
  };

  // Handle Signature Image Upload
  const handleSigFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSigNotice({ type: 'error', text: 'Please select a valid image file for your signature.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSigPreview(dataUrl);
        updateTutorPhotoAndSignature(tutor.id, { signatureUrl: dataUrl });
        setSigNotice({ type: 'success', text: 'Digital signature uploaded and saved successfully!' });
        setTimeout(() => setSigNotice(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Deep blue ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveCanvasSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      setSigNotice({ type: 'error', text: 'Please draw your signature before saving.' });
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    setSigPreview(dataUrl);
    updateTutorPhotoAndSignature(tutor.id, { signatureUrl: dataUrl });
    setSigNotice({ type: 'success', text: 'Drawn signature saved to your official staff profile!' });
    setTimeout(() => setSigNotice(null), 4000);
  };

  const handleRemoveSignature = () => {
    if (confirm('Are you sure you want to remove your digital signature?')) {
      setSigPreview(null);
      clearCanvas();
      updateTutorPhotoAndSignature(tutor.id, { signatureUrl: '' });
      setSigNotice({ type: 'success', text: 'Digital signature removed.' });
      setTimeout(() => setSigNotice(null), 3000);
    }
  };

  // Principal designation information
  const isPrincipalAdmin = tutor.principalRole === 'principal_administrator';
  const isPrincipalAcademics = tutor.principalRole === 'principal_academics';
  const isAppointedPrincipal = isPrincipalAdmin || isPrincipalAcademics;

  const privilegeLabels: Partial<Record<PrincipalPrivilege, { label: string; desc: string }>> = {
    manage_admissions: { label: 'Admissions & Enrolments', desc: 'Authorize candidate entrance exams and approve admissions' },
    manage_assessments: { label: 'Assessments & Report Cards', desc: 'Approve terminal CA scores and release official report sheets' },
    manage_curriculum: { label: 'Curriculum & Lesson Notes', desc: 'Vet weekly lesson plans and approve syllabus coverage' },
    manage_staff_leave: { label: 'Staff Attendance & Leave', desc: 'Authorize faculty roll calls and staff leave requests' },
    manage_finances: { label: 'Bursary & Fee Clearance', desc: 'Inspect fee clearance records and exam slips' },
    manage_discipline: { label: 'Disciplinary Council', desc: 'Issue formal commendations and conduct inquiries' },
    manage_broadcasts: { label: 'Official Broadcasts', desc: 'Publish school-wide directives to parent & student portals' },
    manage_timetables: { label: 'Master Timetable Overrides', desc: 'Modify faculty period allocations and hall arrangements' },
    approve_lesson_notes: { label: 'Approve Lesson Notes', desc: 'Review and endorse weekly lesson notes submitted by tutors' },
    audit_grades: { label: 'Audit Academic Grades', desc: 'Inspect score entries and continuous assessments across classes' },
    view_all_students: { label: 'View All Scholars', desc: 'Access comprehensive academic profiles and student registries' },
    sign_report_cards: { label: 'Executive Signature on Reports', desc: 'Endorse terminal report cards with principal stamp & signature' },
    manage_attendance: { label: 'School-Wide Attendance', desc: 'Oversee daily school attendance registers and trends' },
    school_announcements: { label: 'School Announcements', desc: 'Publish official administrative circulars to student & parent portals' },
    calvin_tokens_manage: { label: 'Calvin AI Token Authority', desc: 'Inspect and distribute Calvin AI study tokens to scholars' }
  };

  return (
    <div className="space-y-8 font-['Nunito',sans-serif]">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300 overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt={tutor.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{tutor.name.charAt(0)}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-900 hover:bg-blue-800 text-amber-400 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-md cursor-pointer transition active:scale-95"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{tutor.name}</h1>
                {isAppointedPrincipal && (
                  <span className="px-3 py-0.5 rounded-full bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Crown className="w-3.5 h-3.5 fill-blue-950" />
                    <span>
                      {isPrincipalAdmin ? 'Principal Administrator' : 'Principal Academics'}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-blue-200 text-xs sm:text-sm">
                <strong>{tutor.role}</strong> • Department of <strong>{tutor.department}</strong>
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-300 pt-1">
                <span>Staff ID: <strong className="text-amber-300 font-mono">{tutor.staffId || 'STX-FAC-01'}</strong></span>
                <span>•</span>
                <span>Qualification: <strong className="text-white">{tutor.qualification}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Status Seals */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Photo Status:</span>
              <span className={`font-bold ${photoPreview ? 'text-emerald-400' : 'text-amber-300'}`}>
                {photoPreview ? '✓ Uploaded' : 'Pending Upload'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-300">Digital Signature:</span>
              <span className={`font-bold ${sigPreview ? 'text-emerald-400' : 'text-amber-300'}`}>
                {sigPreview ? '✓ Verified' : 'Pending Signature'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10">
              <span className="text-slate-300">Administrative Rank:</span>
              <span className="font-bold text-amber-300">
                {isPrincipalAdmin ? 'Principal Administrator' : isPrincipalAcademics ? 'Principal Academics' : 'Faculty Tutor'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Principal Appointment Banner (if appointed) */}
      {isAppointedPrincipal && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-yellow-500/10 border-2 border-amber-400/40 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-md">
                <Crown className="w-7 h-7 fill-blue-950" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-amber-800 tracking-widest">
                  Executive Appointment by Super Administrator
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {isPrincipalAdmin ? 'Office of the Principal Administrator' : 'Office of the Principal Academics'}
                </h3>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600">
              <span>Appointed: <strong className="text-slate-900">{tutor.appointedDate || 'Current Session'}</strong></span>
              <span className="block text-[11px] text-amber-700 font-bold">Authorized Signatory & Academic Supervisor</span>
            </div>
          </div>

          {/* Privileges Granted List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Assigned Administrative Privileges ({tutor.principalPrivileges?.length || 0}):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {(tutor.principalPrivileges || []).map((priv) => {
                const info = privilegeLabels[priv];
                if (!info) return null;
                return (
                  <div key={priv} className="p-3 bg-white border border-amber-200 rounded-xl shadow-xs">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{info.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{info.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid: Photo Upload & Digital Signature Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Official Staff Photograph */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Staff Photograph</h3>
                <p className="text-xs text-slate-500">Official passport photo for faculty records & portal</p>
              </div>
            </div>
          </div>

          {/* Photo Display / Action Zone */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-32 h-32 rounded-2xl bg-white border-2 border-slate-300 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt={tutor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span className="text-[10px] font-bold block">No Photo</span>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Upload a clear front-facing photograph in official school/formal attire. 
                This image will appear on lesson note covers, student feedback cards, and the staff directory.
              </p>

              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoFileChange}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{photoPreview ? 'Change Photo' : 'Upload Photograph'}</span>
                </button>

                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-2.5 bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {photoNotice && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              photoNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {photoNotice.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{photoNotice.text}</span>
            </div>
          )}

          <div className="text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-600 block">Accepted formats:</span>
            <span>JPG, PNG, or WEBP up to 3MB. High-resolution formal portraits recommended.</span>
          </div>
        </div>

        {/* Card 2: Official Digital Signature */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Official Digital Signature</h3>
                <p className="text-xs text-slate-500">For endorsing continuous assessments & report sheets</p>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Draw vs Upload Image */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSigMode('draw')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                sigMode === 'draw' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Draw with Finger / Mouse
            </button>
            <button
              type="button"
              onClick={() => setSigMode('upload')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                sigMode === 'upload' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload Scanned Signature
            </button>
          </div>

          {/* Signature Zone */}
          {sigMode === 'draw' ? (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-indigo-200 bg-slate-50/60 rounded-2xl p-2 text-center relative">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 bg-white rounded-xl shadow-xs cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs">
                    Sign inside the box using your finger or stylus
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Pad</span>
                </button>
                <button
                  type="button"
                  onClick={saveCanvasSignature}
                  disabled={!hasDrawn}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Signature</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="file"
                ref={sigFileInputRef}
                onChange={handleSigFileChange}
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
              />
              <div 
                onClick={() => sigFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
              >
                <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
                <span className="text-xs font-bold text-slate-800 block">
                  Click to select signature image
                </span>
                <span className="text-[11px] text-slate-500 block">
                  PNG transparent background or black ink on clean white paper
                </span>
              </div>
            </div>
          )}

          {/* Signature Preview */}
          {sigPreview && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Digital Signature on File:
                </span>
                <button
                  type="button"
                  onClick={handleRemoveSignature}
                  className="text-rose-600 hover:text-rose-800 text-[11px] font-bold"
                >
                  Remove
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center h-20">
                <img src={sigPreview} alt="Digital Signature" className="max-h-16 object-contain" />
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Stamped as official endorsement for {tutor.name} ({schoolInfo.name})
              </div>
            </div>
          )}

          {sigNotice && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              sigNotice.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {sigNotice.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{sigNotice.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
