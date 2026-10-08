import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { isRemoteEnabled, remoteGetSecurityQuestion } from '../lib/supabase';
import { SchoolLogo } from './SchoolLogo';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  School,
  UserPlus,
  Phone,
  Mail,
  ShieldCheck,
  KeyRound,
  X,
  GraduationCap
} from './RealIcons';
import { UserRole } from '../types';
import { StudentRegistrationModal } from './StudentRegistrationModal';

interface PortalLoginPageProps {
  onBackToWebsite: () => void;
  onLoginSuccess?: (role: UserRole) => void;
}

export const PortalLoginPage: React.FC<PortalLoginPageProps> = ({
  onBackToWebsite,
  onLoginSuccess
}) => {
  const { 
    universalLogin,
    forgotPasswordReset,
    getSecurityQuestionForUser,
    resetPasswordWithSecurityAnswer,
    schoolInfo,
    images,
    setActiveSection,
    isAdminAuthenticated,
    isProprietressAuthenticated,
    isHeadmistressAuthenticated,
    isModeratorAuthenticated,
    isTutorAuthenticated,
    isStudentAuthenticated,
    isParentAuthenticated,
    headmistressProfile,
    moderators,
    activeModeratorId,
    student,
    tutor,
    parents,
    activeParentId,
    logoutAll
  } = useSchool();

  const currentParent = parents.find(p => p.id === activeParentId);

  // Form input states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Student registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Forgot Password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [forgotSecurityAnswer, setForgotSecurityAnswer] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [verifiedUserInfo, setVerifiedUserInfo] = useState<{
    exists: boolean;
    hasQuestion: boolean;
    securityQuestion?: string;
    name?: string;
    role?: UserRole;
  } | null>(null);

  // Check identifier for security question
  const handleCheckIdentifier = async () => {
    if (!forgotId.trim()) {
      setForgotMsg({ type: 'error', text: 'Please enter an institutional identifier first.' });
      return;
    }
    const check = getSecurityQuestionForUser(forgotId);
    if (!check.exists && isRemoteEnabled()) {
      const remoteCheck = await remoteGetSecurityQuestion(forgotId);
      if (remoteCheck.exists) {
        setVerifiedUserInfo({
          exists: true,
          hasQuestion: remoteCheck.hasQuestion,
          securityQuestion: remoteCheck.securityQuestion,
          name: remoteCheck.name || forgotId,
          role: (remoteCheck.role as UserRole) || 'student'
        });
        setForgotMsg(null);
        return;
      }
    }
    if (!check.exists) {
      setForgotMsg({ type: 'error', text: 'No registered user account found with that identifier.' });
      setVerifiedUserInfo(null);
    } else {
      setVerifiedUserInfo(check);
      setForgotMsg(null);
    }
  };

  // Universal Single Sign-On submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    setTimeout(async () => {
      const res = await universalLogin(identifier, password);
      if (res.success && res.role) {
        const roleGreetings: Record<UserRole, string> = {
          admin: 'Administrator credentials verified. Accessing Central Administration Console...',
          proprietress: 'Welcome, Proprietress. Opening Executive Governance Portal...',
          headmistress: 'Welcome, Head Mistress. Opening Academic Leadership Portal...',
          moderator: 'Moderator credentials verified. Opening Safety & Communications Console...',
          tutor: 'Faculty credentials verified. Entering Faculty Workspace...',
          student: res.isAlumni 
            ? 'Alumni record verified. Opening Alumni Scholar Archives...' 
            : 'Scholar credentials verified. Loading Academic Portal...',
          parent: 'Parent & Guardian credentials verified. Opening Family Portal...'
        };

        setSuccessMessage(roleGreetings[res.role] || 'Authentication successful. Redirecting...');
        
        setTimeout(() => {
          if (res.targetSection) {
            setActiveSection(res.targetSection);
          }
          if (onLoginSuccess && res.role) {
            onLoginSuccess(res.role);
          }
        }, 600);
      } else {
        setErrorMessage(res.message || 'Invalid credentials. Please verify your identifier and password.');
        setIsSubmitting(false);
      }
    }, 450);
  };

  // Forgot Password Reset submit with Security Question verification
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    // If identifier has not been verified yet, verify it first
    let currentVerified = verifiedUserInfo;
    if (!currentVerified) {
      const check = getSecurityQuestionForUser(forgotId);
      if (!check.exists && isRemoteEnabled()) {
        const remoteCheck = await remoteGetSecurityQuestion(forgotId);
        if (remoteCheck.exists) {
          currentVerified = {
            exists: true,
            hasQuestion: remoteCheck.hasQuestion,
            securityQuestion: remoteCheck.securityQuestion,
            name: remoteCheck.name || forgotId,
            role: (remoteCheck.role as UserRole) || 'student'
          };
          setVerifiedUserInfo(currentVerified);
        }
      } else if (check.exists) {
        currentVerified = check;
        setVerifiedUserInfo(check);
      }

      if (!currentVerified) {
        setForgotMsg({ type: 'error', text: 'No user account found with that identifier.' });
        return;
      }
      if (currentVerified.hasQuestion && !forgotSecurityAnswer.trim()) {
        setForgotMsg({ type: 'error', text: 'Please enter the secret answer to your security question.' });
        return;
      }
    }

    if (currentVerified?.hasQuestion && !forgotSecurityAnswer.trim()) {
      setForgotMsg({ type: 'error', text: 'Please enter your secret security answer to verify ownership.' });
      return;
    }

    if (forgotNewPass !== forgotConfirmPass) {
      setForgotMsg({ type: 'error', text: 'New passwords do not match. Please re-enter.' });
      return;
    }
    if (forgotNewPass.length < 6) {
      setForgotMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsResetting(true);
    try {
      let res;
      if (currentVerified?.hasQuestion) {
        res = await resetPasswordWithSecurityAnswer(forgotId, forgotSecurityAnswer, forgotNewPass);
      } else {
        res = await forgotPasswordReset(forgotId, forgotNewPass);
      }

      setIsResetting(false);
      if (res.success) {
        setForgotMsg({ 
          type: 'success', 
          text: `${res.message} Your new password is now active. You can log in immediately.` 
        });
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotMsg(null);
          setForgotId('');
          setForgotSecurityAnswer('');
          setForgotNewPass('');
          setForgotConfirmPass('');
          setVerifiedUserInfo(null);
          setIdentifier(forgotId);
        }, 1800);
      } else {
        setForgotMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setIsResetting(false);
      setForgotMsg({ type: 'error', text: err?.message || 'Password reset failed.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111827] via-neutral-900 to-[#450A0A] text-neutral-100 flex flex-col justify-between font-['Nunito',sans-serif]">
      {/* Top Header Bar */}
      <header className="w-full border-b border-white/10 bg-black/60 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SchoolLogo size="sm" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-tight text-white">
                {schoolInfo.name}
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-amber-400/30">
                Universal Portal Gateway
              </span>
            </div>
            <p className="text-[11px] text-[#FAF7EE]/70 hidden sm:block">
              {schoolInfo.location || `${schoolInfo.city}, ${schoolInfo.state}`}
            </p>
          </div>
        </div>

        <button
          onClick={onBackToWebsite}
          className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/15 cursor-pointer shadow-sm active:scale-95"
          id="btn-return-school-website"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>School Website</span>
        </button>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-[#FAF7EE] text-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-[#EAE2CE]">
          
          {/* Card Top Branding Header - Unified, no role tabs */}
          <div className="bg-gradient-to-r from-[#111827] via-neutral-900 to-[#450A0A] p-6 sm:p-8 text-center text-white relative border-b-2 border-amber-400">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center mx-auto mb-3.5 shadow-lg border-2 border-white/20 font-black">
              <KeyRound className="w-8 h-8 text-neutral-950" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Institutional Portal Login
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-md mx-auto">
              Sign in with your institutional credentials. The system will automatically route you to your authorized dashboard.
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Active Session Detected (Auto-Resumption Banner) */}
            {(isStudentAuthenticated || isAdminAuthenticated || isHeadmistressAuthenticated || isModeratorAuthenticated || isTutorAuthenticated || isParentAuthenticated || isProprietressAuthenticated) && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md border border-amber-400/50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      Active Signed-In Session
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-200">Preserved Across Refresh</span>
                </div>
                <div>
                  <p className="text-xs text-white">
                    You are already authenticated as{' '}
                    <strong className="text-amber-300">
                      {isStudentAuthenticated ? (student?.name || 'Scholar') :
                       isAdminAuthenticated ? 'Administrator' :
                       isHeadmistressAuthenticated ? (headmistressProfile.name || 'Head Mistress') :
                       isModeratorAuthenticated ? 'Community Moderator' :
                       isTutorAuthenticated ? (tutor?.name || 'Faculty Member') :
                       isProprietressAuthenticated ? 'Proprietress' :
                       (currentParent?.fullName || 'Parent / Guardian')}
                    </strong>
                    .
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isStudentAuthenticated) {
                        setActiveSection('student-portal');
                        onLoginSuccess?.('student');
                      } else if (isAdminAuthenticated) {
                        setActiveSection('admin-portal');
                        onLoginSuccess?.('admin');
                      } else if (isHeadmistressAuthenticated) {
                        setActiveSection('headmistress-portal');
                        onLoginSuccess?.('headmistress');
                      } else if (isModeratorAuthenticated) {
                        setActiveSection('moderator-portal');
                        onLoginSuccess?.('moderator');
                      } else if (isTutorAuthenticated) {
                        setActiveSection('tutor-portal');
                        onLoginSuccess?.('tutor');
                      } else if (isParentAuthenticated) {
                        setActiveSection('parent-portal');
                        onLoginSuccess?.('parent');
                      } else if (isProprietressAuthenticated) {
                        setActiveSection('proprietress-portal');
                        onLoginSuccess?.('proprietress');
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Resume My Portal</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-950 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => logoutAll()}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-rose-300 text-xs font-bold transition cursor-pointer border border-white/15"
                  >
                    Switch User
                  </button>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div 
                className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div 
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in"
                role="status"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Universal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Field */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Institutional Identifier
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Username, Staff ID, Reg No, Parent Phone, or Email"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-red-700 text-sm font-medium bg-white transition"
                  id="portal-input-identifier"
                  autoComplete="username"
                />
                <p className="text-[11px] text-neutral-600 mt-1">
                  Use your assigned registration number, staff ID, parent phone/email, or admin username.
                </p>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Password / Access PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-bold text-red-700 hover:text-red-900 transition hover:underline cursor-pointer"
                    id="btn-forgot-password-link"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter confidential password"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-red-700 text-sm font-medium bg-white transition"
                    id="portal-input-password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                id="btn-portal-submit-login"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Sign In to Institutional Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Scholar Registration Callout */}
            <div className="pt-3 border-t border-[#EAE2CE] text-center">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-neutral-900 font-extrabold text-xs">
                  <GraduationCap className="w-4 h-4 text-red-700" />
                  <span>New Student Seeking Portal Access?</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-snug">
                  Register your scholar account, configure your password recovery security question, and upload your official report sheet passport photo.
                </p>
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-black text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300 active:scale-98"
                  id="btn-open-student-registration"
                >
                  <UserPlus className="w-4 h-4 text-red-700" />
                  <span>Register Scholar Account</span>
                </button>
              </div>
            </div>

            {/* Help & Support Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs font-bold text-neutral-600 hover:text-red-750 transition flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHelp ? 'Hide Portal Help' : 'Need Login Assistance?'}</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>TLS Encrypted Gateway</span>
              </div>
            </div>

            {/* Help Information Box */}
            {showHelp && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-neutral-900 text-xs space-y-2.5 animate-fade-in">
                <div className="font-bold flex items-center gap-1.5 text-neutral-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Institutional Sign-In Guidelines</span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-relaxed">
                  Stanbax operates a unified authentication gateway. Enter your designated institutional identifier (e.g. administrative username, staff ID, or student admission registration number) along with your access password. The gateway will securely route you to your authorized portal.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 text-[11px] border-t border-amber-200/60 mt-1">
                  <div className="flex items-center gap-1.5 text-neutral-800">
                    <Mail className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    <span className="font-medium">ict@stanbaxschools.edu.ng</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-800">
                    <Phone className="w-3.5 h-3.5 text-red-700 shrink-0" />
                    <span className="font-medium">{schoolInfo.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Forgot Password Modal with Security Question Recovery */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FAF7EE] text-neutral-900 rounded-3xl shadow-2xl p-6 border border-[#EAE2CE] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2CE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-neutral-900">Institutional Password Recovery</h2>
              </div>
              <button 
                onClick={() => { 
                  setShowForgotModal(false); 
                  setForgotMsg(null); 
                  setVerifiedUserInfo(null); 
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Enter your registered Institutional Identifier. For students with a configured security question, you must provide your secret answer to prove account ownership.
            </p>

            {forgotMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                forgotMsg.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {forgotMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Institutional Identifier
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={forgotId}
                    onChange={(e) => {
                      setForgotId(e.target.value);
                      if (verifiedUserInfo) setVerifiedUserInfo(null);
                    }}
                    placeholder="e.g. STX/2023/042 or staff email or username"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCheckIdentifier}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs transition cursor-pointer shrink-0 border border-neutral-300"
                  >
                    Check
                  </button>
                </div>
              </div>

              {/* Verified Account Information & Security Question */}
              {verifiedUserInfo && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-neutral-900 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">
                      User: <strong>{verifiedUserInfo.name}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-neutral-900 text-[10px] font-extrabold uppercase">
                      {verifiedUserInfo.role}
                    </span>
                  </div>

                  {verifiedUserInfo.hasQuestion ? (
                    <div className="pt-2 border-t border-amber-200/80 space-y-2">
                      <div className="flex items-start gap-1.5 text-xs text-neutral-900 font-bold">
                        <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span>Security Question:</span>
                          <p className="text-xs font-black text-neutral-900 mt-0.5 bg-white p-2 rounded-xl border border-amber-200">
                            "{verifiedUserInfo.securityQuestion}"
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-900 mb-1">
                          Your Secret Answer <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={forgotSecurityAnswer}
                          onChange={(e) => setForgotSecurityAnswer(e.target.value)}
                          placeholder="Enter your registered security answer"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none bg-white shadow-xs"
                        />
                        <p className="text-[10px] text-amber-800 mt-1">
                          Proves you are the authorized owner of this account.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-600 pt-1 border-t border-amber-200">
                      Standard account without security question. Enter your new password below.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={forgotNewPass}
                  onChange={(e) => setForgotNewPass(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={forgotConfirmPass}
                  onChange={(e) => setForgotConfirmPass(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:border-red-700 outline-none bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { 
                    setShowForgotModal(false); 
                    setForgotMsg(null); 
                    setVerifiedUserInfo(null); 
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-200/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md cursor-pointer disabled:bg-red-400"
                >
                  {isResetting ? 'Verifying...' : 'Verify & Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scholar Registration Modal */}
      <StudentRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onRegistrationSuccess={(registered) => {
          setIdentifier(registered.regNumber);
        }}
      />

      {/* Footer Notice */}
      <footer className="w-full py-3.5 text-center text-xs text-neutral-400 border-t border-white/5 bg-black/40">
        <p>
          © {new Date().getFullYear()} {schoolInfo.name}. All rights reserved. Authorized academic access only.
        </p>
      </footer>
    </div>
  );
};
