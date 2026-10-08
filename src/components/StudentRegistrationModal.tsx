import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  ShieldCheck, 
  User, 
  GraduationCap, 
  Lock, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  UserPlus,
  ArrowRight,
  Image as ImageIcon
} from './RealIcons';
import { useSchool } from '../context/SchoolContext';
import { StudentProfile } from '../types';
import { isRemoteEnabled } from '../lib/supabase';
import { Database } from 'lucide-react';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess?: (student: StudentProfile) => void;
}

const PRESET_SECURITY_QUESTIONS = [
  "What is your favorite food?", // User's specific example
  "What is the name of your first elementary school?",
  "What is your mother's maiden name?",
  "What was your childhood pet's name?",
  "What is your favorite book or novel?",
  "What city were you born in?",
  "Write my own custom question..."
];

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistrationSuccess
}) => {
  const { classes, registerStudent, loginStudent } = useSchool();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');
  const [house, setHouse] = useState('Sapphire House (Blue)');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Security Question fields
  const [selectedQuestionPreset, setSelectedQuestionPreset] = useState(PRESET_SECURITY_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Passport upload fields
  const [passportPhoto, setPassportPhoto] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status & Success state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredStudent, setRegisteredStudent] = useState<StudentProfile | null>(null);
  const [copiedRegNo, setCopiedRegNo] = useState(false);

  // Set default grade if available
  React.useEffect(() => {
    if (classes.length > 0 && !grade) {
      const defaultClass = classes.find(c => c.name.includes('SSS 1') || c.name.includes('SSS 2')) || classes[0];
      setGrade(defaultClass.name);
    }
  }, [classes, grade]);

  if (!isOpen) return null;

  // Handle image file selection
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, or WEBP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('Passport image size should be less than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setPassportPhoto(base64);
        setErrorMessage(null);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to process the uploaded photo. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter the student full name.');
      return;
    }
    if (!grade) {
      setErrorMessage('Please select an enrolled class level.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    // Determine final security question
    const finalQuestion = selectedQuestionPreset === 'Write my own custom question...'
      ? customQuestion.trim()
      : selectedQuestionPreset;

    if (!finalQuestion) {
      setErrorMessage('Please provide or select a security question.');
      return;
    }
    if (!securityAnswer.trim()) {
      setErrorMessage('Please provide an answer to your security question. This is required for password recovery.');
      return;
    }

    // Execute registration
    try {
      const created = registerStudent({
        name: fullName.trim(),
        grade,
        house,
        emergencyPhone: emergencyPhone.trim() || '+234 800 000 0000',
        email: email.trim() || undefined,
        password: password.trim(),
        securityQuestion: finalQuestion,
        securityAnswer: securityAnswer.trim(),
        passportPhoto: passportPhoto || undefined
      });

      setRegisteredStudent(created);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete registration. Please try again.');
    }
  };

  const handleCopyRegNo = () => {
    if (registeredStudent) {
      navigator.clipboard.writeText(registeredStudent.regNumber);
      setCopiedRegNo(true);
      setTimeout(() => setCopiedRegNo(false), 2500);
    }
  };

  const handleProceedToPortal = () => {
    if (registeredStudent) {
      void loginStudent(registeredStudent.regNumber, registeredStudent.password || 'stanbax2025');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(registeredStudent);
      }
      onClose();
    }
  };

  const handleResetForm = () => {
    setRegisteredStudent(null);
    setFullName('');
    setEmergencyPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSecurityAnswer('');
    setPassportPhoto('');
    setCustomQuestion('');
    setSelectedQuestionPreset(PRESET_SECURITY_QUESTIONS[0]);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-['Nunito',sans-serif]">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EAE2CE] my-auto animate-fade-in text-neutral-900"
        role="dialog" 
        aria-modal="true"
        aria-labelledby="modal-student-reg-title"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-red-900">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="modal-student-reg-title" className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Scholar Portal Registration
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-400/30">
                  New Enrollment
                </span>
              </div>
              <p className="text-xs text-[#E5DEC9] mt-0.5">
                Set up your academic profile, security recovery question, and official report sheet passport.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Registration Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {/* SUCCESS STATE */}
          {registeredStudent ? (
            <div className="space-y-6 text-center py-2 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-neutral-900">
                  Scholar Registration Confirmed!
                </h3>
                <p className="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
                  Your academic profile and security credentials have been securely provisioned in the Stanbax Academic Database.
                </p>
              </div>

              {/* Scholar ID Card Preview */}
              <div className="bg-gradient-to-br from-[#111827] to-[#450A0A] text-white rounded-2xl p-5 max-w-md mx-auto shadow-lg border border-red-900 text-left relative overflow-hidden">
                <div className="flex items-start gap-4">
                  {/* Passport Photo Preview */}
                  <div className="shrink-0 text-center">
                    <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-amber-400 bg-neutral-800 shadow-md flex items-center justify-center">
                      {registeredStudent.passportPhoto ? (
                        <img 
                          src={registeredStudent.passportPhoto} 
                          alt={registeredStudent.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="p-2 text-center text-amber-300">
                          <User className="w-8 h-8 mx-auto opacity-70" />
                          <span className="text-[9px] block mt-1 leading-tight font-medium">Standard Avatar</span>
                        </div>
                      )}
                    </div>
                    <span className="inline-block mt-1 text-[9px] font-bold text-amber-300 uppercase tracking-wide">
                      {registeredStudent.passportPhoto ? 'Passport Attached' : 'No Photo'}
                    </span>
                  </div>

                  {/* Scholar Data */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-400/30 inline-block">
                      Official Scholar
                    </span>
                    <h4 className="text-base font-black text-white truncate">
                      {registeredStudent.name}
                    </h4>
                    <p className="text-xs text-[#E5DEC9]">
                      Class: <strong className="text-white">{registeredStudent.grade}</strong>
                    </p>
                    <p className="text-xs text-[#E5DEC9]">
                      House: <span className="text-amber-300 font-bold">{registeredStudent.house}</span>
                    </p>
                    
                    <div className="pt-2">
                      <span className="text-[10px] uppercase text-neutral-300 font-bold block">Assigned Reg Number</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-base font-black text-amber-300 tracking-wider">
                          {registeredStudent.regNumber}
                        </span>
                        <button
                          onClick={handleCopyRegNo}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition cursor-pointer"
                          title="Copy Registration Number"
                        >
                          {copiedRegNo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security reminder banner inside card */}
                <div className="mt-4 pt-3 border-t border-white/15 flex items-start gap-2 text-[11px] text-[#E5DEC9]">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Security Question Saved: </span>
                    <span>"{registeredStudent.securityQuestion}"</span>
                    <p className="text-[10px] text-[#C2B59B] mt-0.5">
                      Keep your answer confidential. Use this question if you ever need to reset your password.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-Device Cloud Sync Reminder */}
              {!isRemoteEnabled() ? (
                <div className="max-w-md mx-auto p-3 rounded-2xl bg-amber-50 border border-amber-300 text-left text-amber-950 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Database className="w-4 h-4 text-amber-700" />
                    <span>Single-Browser Mode (Netlify Deployment Notice)</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    This new scholar is currently saved in this browser. To make this scholar and all future registrations visible on every other browser, phone, and computer, connect your free Supabase database in Netlify Environment Variables (Admin Portal → School Settings → Cloud Sync).
                  </p>
                </div>
              ) : (
                <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-left text-emerald-950 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                  <span className="text-[11px] font-semibold">
                    Synced to Cloud Database — This scholar is accessible from any phone, laptop, or browser.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleProceedToPortal}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-amber-400/30"
                >
                  <span>Enter Scholar Portal Now</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FAF7EE] hover:bg-[#F2ECE0] text-neutral-700 font-bold text-xs transition cursor-pointer border border-[#EAE2CE]"
                >
                  Register Another Student
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Notice */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SECTION 1: PERSONAL & ACADEMIC INFO */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#EAE2CE] text-neutral-900">
                  <User className="w-4 h-4 text-red-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700">
                    1. Scholar Identity & Academic Placement
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Student Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tiwa Adeleke"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white"
                      id="reg-input-name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Enrolled Class Level <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white cursor-pointer"
                      id="reg-select-grade"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.name}>
                          {cls.name} ({cls.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Athletic House
                    </label>
                    <select
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white cursor-pointer"
                      id="reg-select-house"
                    >
                      <option value="Sapphire House (Blue)">Sapphire House (Blue)</option>
                      <option value="Emerald House (Green)">Emerald House (Green)</option>
                      <option value="Ruby House (Red)">Ruby House (Red)</option>
                      <option value="Gold House (Yellow)">Gold House (Yellow)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Parent / Guardian Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white"
                      id="reg-input-phone"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Student / Parent Email <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. tiwa.adeleke@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white"
                      id="reg-input-email"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SECURITY QUESTION & ANSWER (KEY USER REQUIREMENT) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7EE] border border-amber-200/90 space-y-4">
                <div className="flex items-center gap-2 text-amber-950">
                  <ShieldCheck className="w-5 h-5 text-red-700 shrink-0" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                      2. Password Recovery Security Question (Required)
                    </h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      This unique question and answer proves the person recovering this account is the true owner.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
                      Choose Your Security Question <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={selectedQuestionPreset}
                      onChange={(e) => setSelectedQuestionPreset(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-white cursor-pointer"
                      id="reg-select-security-question"
                    >
                      {PRESET_SECURITY_QUESTIONS.map((q, idx) => (
                        <option key={idx} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  {selectedQuestionPreset === 'Write my own custom question...' && (
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">
                        Type Custom Security Question <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="e.g. What was your favorite childhood vacation spot?"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-white"
                        id="reg-input-custom-question"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
                      Secret Security Answer <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="e.g. Rice and beans"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-white shadow-xs"
                      id="reg-input-security-answer"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-neutral-600">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        Example: <em>Rice and beans</em>. Answers are case-insensitive during verification.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PASSPORT PHOTO UPLOAD (KEY USER REQUIREMENT) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-neutral-950">
                    <Camera className="w-5 h-5 text-red-700 shrink-0" />
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-neutral-950">
                        3. Student Passport Photograph (Optional)
                      </h3>
                      <p className="text-[11px] text-neutral-600 mt-0.5">
                        Will be framed and included on your official terminal report sheet, ID card, and transcripts.
                      </p>
                    </div>
                  </div>
                  {passportPhoto && (
                    <button
                      type="button"
                      onClick={() => setPassportPhoto('')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  {/* Official Passport Preview Frame */}
                  <div className="shrink-0 text-center">
                    <div className="w-24 h-28 sm:w-28 sm:h-34 rounded-xl border-2 border-red-700 overflow-hidden bg-white shadow-md flex flex-col items-center justify-center relative group">
                      {passportPhoto ? (
                        <>
                          <img 
                            src={passportPhoto} 
                            alt="Passport Preview" 
                            className="w-full h-full object-cover" 
                          />
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                          >
                            <Camera className="w-5 h-5 mb-1 text-amber-300" />
                            <span>Change Photo</span>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 text-center text-neutral-400">
                          <User className="w-10 h-10 mx-auto opacity-40 text-neutral-700" />
                          <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-tight block mt-1">
                            Passport Frame
                          </span>
                          <span className="text-[8px] text-neutral-400 block">35mm x 45mm</span>
                        </div>
                      )}
                    </div>
                    <span className="inline-block mt-1.5 text-[10px] font-extrabold text-red-700 uppercase tracking-wider">
                      {passportPhoto ? '✓ Attached' : 'Report Sheet Photo'}
                    </span>
                  </div>

                  {/* Drag and Drop / File Input Box */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 w-full border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
                      dragActive 
                        ? 'border-red-700 bg-red-50' 
                        : 'border-[#EAE2CE] bg-white hover:bg-[#FAF7EE]'
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden" 
                      id="reg-file-passport"
                    />
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-neutral-900 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-neutral-800" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800">
                        {passportPhoto ? 'Click or drag to choose a different photo' : 'Click to browse or drag & drop student passport photo'}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Supports PNG, JPG, or WEBP up to 4MB (Clear portrait recommended)
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-amber-300 text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Select Image File
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 4: ACCOUNT PASSWORD */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#EAE2CE] text-neutral-950">
                  <Lock className="w-4 h-4 text-red-700" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700">
                    4. Portal Access Password
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Choose Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white"
                        id="reg-input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter chosen password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE2CE] text-sm font-medium focus:ring-2 focus:ring-red-600 outline-none bg-[#FAF7EE] focus:bg-white"
                      id="reg-input-confirm-password"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-[#EAE2CE] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-[#FAF7EE] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-amber-300 text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer active:scale-98"
                  id="btn-submit-student-registration"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Register Scholar Account</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
